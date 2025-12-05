// js/modules/network.js
import { state } from '../modules/state.js';
import { el } from './dom.js';
import { t } from './i18n.js';
import { persistState } from './store.js';

// Global PeerJS instance
let peer = null;
// Connections to other peers (for host)
const connections = new Map();
// Host's Peer ID (for client)
let hostId = null;
// Player's own name in the room
let localPlayerName = "Player";
// Current room code
let currentRoomCode = null;
// Role assignments for reconnection (host only)
const roleAssignments = new Map(); // peerId -> {playerName, roleData}
// Reconnection state
let reconnectAttempts = 0;
let reconnectTimer = null;
const MAX_RECONNECT_ATTEMPTS = 3;
const CONNECTION_INFO_KEY = 'stw_connection_info';

// Callbacks for UI updates - now using arrays to support multiple handlers
const onPeerConnectedCallbacks = [];
const onPeerDisconnectedCallbacks = [];
const onGameStartCallbacks = [];
const onHostDisconnectedCallbacks = [];
const onReceiveRoleCallbacks = [];
const onPlayerListUpdateCallbacks = [];
const onPlayerEliminatedCallbacks = [];
const onPlayerRevivedCallbacks = [];
const onStatusUpdateCallbacks = [];

export function setNetworkCallbacks({ connected, disconnected, gameStart, hostDisconnected, receiveRole, playerListUpdate, playerEliminated, playerRevived, statusUpdate }) {
    if (connected) onPeerConnectedCallbacks.push(connected);
    if (disconnected) onPeerDisconnectedCallbacks.push(disconnected);
    if (gameStart) onGameStartCallbacks.push(gameStart);
    if (hostDisconnected) onHostDisconnectedCallbacks.push(hostDisconnected);
    if (receiveRole) onReceiveRoleCallbacks.push(receiveRole);
    if (playerListUpdate) onPlayerListUpdateCallbacks.push(playerListUpdate);
    if (playerEliminated) onPlayerEliminatedCallbacks.push(playerEliminated);
    if (playerRevived) onPlayerRevivedCallbacks.push(playerRevived);
    if (statusUpdate) onStatusUpdateCallbacks.push(statusUpdate);
}

// Utility to generate a random 4-char alphanumeric room code
function generateRoomCode() {
    return Math.random().toString(36).substring(2, 6).toUpperCase();
}

// Initialize PeerJS
function initializePeer(id) {
    return new Promise((resolve, reject) => {
        if (peer && peer.open) {
            peer.destroy();
        }
        // Using the default public PeerJS server (PeerServer Cloud)
        // Note: The public server has limits and no uptime guarantees.
        // For production, you should run your own PeerServer.
        peer = new Peer(id, {
            debug: 2, // 0: none, 1: error, 2: warning, 3: info
        });

        peer.on('open', (newId) => {
            console.log('PeerJS ID:', newId);
            currentRoomCode = newId;
            resolve(newId);
        });

        peer.on('error', (err) => {
            console.error('PeerJS error:', err);
            // Don't show technical peer errors to users - they'll see user-friendly messages from specific operations
            reject(err);
        });

        peer.on('disconnected', () => {
            console.log('PeerJS disconnected from server.');
        });

        peer.on('close', () => {
            console.log('PeerJS connection closed.');
            connections.clear();
        });
    });
}

// Host functions
export async function hostGame() {
    try {
        currentRoomCode = generateRoomCode();
        await initializePeer(currentRoomCode);
        console.log(`Hosting game with ID: ${currentRoomCode}`);

        // Start Heartbeat
        const heartbeatInterval = setInterval(() => {
            broadcast({ type: 'PING' });
        }, 20000);

        peer.on('connection', (conn) => {
            console.log(`Connection received from: ${conn.peer}`);
            connections.set(conn.peer, conn);

            conn.on('open', () => {
                console.log(`Data channel opened with ${conn.peer}`);
                // Wait for JOIN_REQUEST
            });

            conn.on('data', (data) => {
                // console.log(`Data from ${conn.peer}:`, data); // Too verbose for Pings
                handleHostData(conn, data);
            });

            conn.on('close', () => {
                console.log(`Connection with ${conn.peer} closed`);
                const playerName = conn.customPlayerName || conn.metadata?.playerName || conn.peer;
                connections.delete(conn.peer);
                onPeerDisconnectedCallbacks.forEach(callback => callback(playerName, conn.peer));
                // Sync removal to other clients
                broadcast({ type: 'PLAYER_LIST_UPDATE', players: state.customNames });
            });

            conn.on('error', (err) => {
                console.error(`Connection error with ${conn.peer}:`, err);
            });
        });

        // Clear interval on peer destroy (not fully handled here but good practice)
        peer.on('close', () => clearInterval(heartbeatInterval));
        peer.on('disconnected', () => clearInterval(heartbeatInterval));

        return currentRoomCode;
    } catch (err) {
        console.error("Failed to host game:", err);
        throw err;
    }
}

function handleHostData(conn, data) {
    switch (data.type) {
        case 'JOIN_REQUEST':
            if (state.customNames.includes(data.playerName)) {
                conn.send({ type: 'JOIN_REJECTED', reason: t("errors.nameTaken", { name: data.playerName }) || "Name taken" });
                setTimeout(() => conn.close(), 500);
                return;
            }

            conn.metadata = { playerName: data.playerName };
            conn.customPlayerName = data.playerName; // Store directly to ensure availability
            console.log(`Player ${data.playerName} (${conn.peer}) joined.`);

            // Accept join
            conn.send({ type: 'JOIN_ACCEPTED' });
            conn.send({ type: 'WELCOME', message: t("network.welcomeClient") });

            // Add player to local state and update UI
            state.customNames.push(data.playerName);
            persistState();
            onPeerConnectedCallbacks.forEach(callback => callback(data.playerName, conn.peer));
            // Inform all existing clients about the new player
            broadcast({ type: 'PLAYER_LIST_UPDATE', players: state.customNames });
            break;
        case 'REJOIN_REQUEST':
            // Handle reconnection attempt
            const { playerName } = data;
            console.log(`Rejoin request from ${playerName} (${conn.peer})`);

            // Check if this player was previously in the game
            if (!state.customNames.includes(playerName)) {
                conn.send({ type: 'REJOIN_REJECTED', reason: t("network.playerNotInGame") || "Player not in this game" });
                setTimeout(() => conn.close(), 500);
                return;
            }

            // Update connection metadata
            conn.metadata = { playerName };
            conn.customPlayerName = playerName;

            // Accept rejoin
            conn.send({ type: 'REJOIN_ACCEPTED', message: t("network.rejoinAccepted", { name: playerName }) });

            // Restore role if available
            const savedRole = roleAssignments.get(playerName);
            if (savedRole) {
                conn.send({ type: 'YOUR_ROLE', roleData: savedRole.roleData });
            }

            // Update connections map with new peerId
            const oldPeerId = Array.from(connections.entries())
                .find(([_, c]) => c.customPlayerName === playerName)?.[0];
            if (oldPeerId && oldPeerId !== conn.peer) {
                connections.delete(oldPeerId);
            }
            connections.set(conn.peer, conn);

            onPeerConnectedCallbacks.forEach(callback => callback(playerName, conn.peer));
            break;
        case 'PONG':
            // Alive
            break;
        default:
            console.warn("Unknown data type received by host:", data.type);
    }
}

// Client functions
export async function joinGame(roomId, playerName, isReconnect = false) {
    try {
        localPlayerName = playerName;
        hostId = roomId;
        await initializePeer(); // Initialize with a random ID for the client
        console.log(`Attempting to ${isReconnect ? 'rejoin' : 'join'} room ${roomId} as ${playerName}`);

        return new Promise((resolve, reject) => {
            let timeout;
            let peerErrorListener;

            // Cleanup function to remove listeners and timeout
            const cleanup = () => {
                if (timeout) clearTimeout(timeout);
                if (peerErrorListener) peer.off('error', peerErrorListener);
            };

            const conn = peer.connect(roomId, { metadata: { playerName: playerName } });

            // Setup timeout
            timeout = setTimeout(() => {
                cleanup();
                conn.close(); // Ensure connection is closed
                reject(new Error(t("network.connectionTimeout")));
            }, 5000);

            // Handle successful connection
            conn.on('open', () => {
                console.log(`Connected to host ${roomId}, sending ${isReconnect ? 'rejoin' : 'join'} request...`);
                const requestType = isReconnect ? 'REJOIN_REQUEST' : 'JOIN_REQUEST';
                conn.send({ type: requestType, playerName: playerName });
            });

            // Handle connection data
            conn.on('data', (data) => {
                if (data.type === 'JOIN_ACCEPTED' || data.type === 'REJOIN_ACCEPTED') {
                    cleanup();
                    if (data.type === 'REJOIN_ACCEPTED') {
                        reconnectAttempts = 0; // Reset reconnect counter on success
                        if (el.toastInfo) el.toastInfo(t("network.reconnectSuccess"));
                    }
                    persistConnectionInfo();
                    resolve(conn);
                } else if (data.type === 'JOIN_REJECTED' || data.type === 'REJOIN_REJECTED') {
                    cleanup();
                    conn.close();
                    reject(new Error(data.reason));
                }

                handleClientData(data);
            });

            // Handle connection close
            conn.on('close', () => {
                console.log('Connection to host closed');
                // Only trigger reconnection if we have an active game and haven't exceeded attempts
                if (state.assignedRole && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
                    attemptReconnect();
                } else {
                    hostId = null;
                    clearConnectionInfo();
                    onHostDisconnectedCallbacks.forEach(callback => callback());
                }
            });

            // Handle connection error
            conn.on('error', (err) => {
                cleanup();
                console.error('Connection to host error:', err);
                let errorMessage = t("network.hostConnectionError", { error: err.message });
                if (err.type === 'peer-unavailable') {
                    errorMessage = t("network.roomDoesNotExist");
                }
                reject(new Error(errorMessage));
            });

            // Specific PeerJS error listener for 'peer-unavailable' (often fires on peer, not conn)
            peerErrorListener = (err) => {
                if (err.type === 'peer-unavailable' && err.message.includes(roomId)) {
                    cleanup();
                    const errorMessage = t("network.roomDoesNotExist");
                    // Close connection attempt
                    conn.close();
                    reject(new Error(errorMessage));
                }
            };
            peer.on('error', peerErrorListener);
        });
    } catch (err) {
        console.error("Failed to join game:", err);
        throw err;
    }
}

function handleClientData(data) {
    switch (data.type) {
        case 'JOIN_ACCEPTED':
        case 'JOIN_REJECTED':
        case 'REJOIN_ACCEPTED':
        case 'REJOIN_REJECTED':
            // Handled by joinGame promise
            break;
        case 'PING':
            // Respond to keep alive
            if (hostId) {
                const conn = peer.connections[hostId]?.[0];
                if (conn) conn.send({ type: 'PONG' });
            }
            break;
        case 'WELCOME':
            // Welcome message received, no toast needed (join success is shown elsewhere)
            break;
        case 'PLAYER_LIST_UPDATE':
            state.customNames = data.players;
            persistState();
            onPlayerListUpdateCallbacks.forEach(callback => callback(data.players));
            break;
        case 'START_GAME':
            // Host has started the game, switch client to appropriate view
            onGameStartCallbacks.forEach(callback => callback(data.gameData));
            break;
        case 'YOUR_ROLE':
            // Client received their role
            onReceiveRoleCallbacks.forEach(callback => callback(data.roleData));
            break;
        case 'PLAYER_ELIMINATED':
            // Player has been eliminated - show ghost reminder
            onPlayerEliminatedCallbacks.forEach(callback => callback(data.playerName));
            break;
        case 'PLAYER_REVIVED':
            // Player has been revived - show role card again
            onPlayerRevivedCallbacks.forEach(callback => callback(data.playerName));
            break;
        case 'PLAYER_STATUS':
            // Player status update (suspect, welcome)
            onStatusUpdateCallbacks.forEach(callback => callback(data.status));
            break;
        default:
            console.warn("Unknown data type received by client:", data.type);
    }
}

// Send data to a specific peer (Host only)
export function sendToPeer(peerId, data) {
    const conn = connections.get(peerId);
    if (conn && conn.open) {
        conn.send(data);
        // Track role assignments for reconnection
        if (data.type === 'YOUR_ROLE' && conn.customPlayerName) {
            roleAssignments.set(conn.customPlayerName, {
                playerName: conn.customPlayerName,
                roleData: data.roleData
            });
        }
    } else {
        console.warn(`Connection to ${peerId} not open, cannot send data:`, data);
    }
}

// Broadcast data to all connected peers (Host only)
export function broadcast(data) {
    connections.forEach((conn) => {
        if (conn.open) {
            conn.send(data);
        }
    });
}

// Notify a specific player that they have been eliminated (Host only)
export function notifyPlayerEliminated(playerName) {
    // Find the connection for this player
    for (const [peerId, conn] of connections.entries()) {
        if (conn.customPlayerName === playerName && conn.open) {
            conn.send({ type: 'PLAYER_ELIMINATED', playerName });
            break;
        }
    }
}

// Notify a specific player that they have been revived (Host only)
export function notifyPlayerRevived(playerName) {
    // Find the connection for this player
    for (const [peerId, conn] of connections.entries()) {
        if (conn.customPlayerName === playerName && conn.open) {
            conn.send({ type: 'PLAYER_REVIVED', playerName });
            break;
        }
    }
}

// Notify a specific player of their status (suspect, welcome) (Host only)
export function notifyPlayerStatus(playerName, status) {
    // Find the connection for this player
    for (const [peerId, conn] of connections.entries()) {
        if (conn.customPlayerName === playerName && conn.open) {
            conn.send({ type: 'PLAYER_STATUS', status });
            break;
        }
    }
}

// Disconnect from current peer (client) or close all connections (host)
export function disconnect() {
    if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
    }
    reconnectAttempts = 0;
    if (peer) {
        peer.destroy();
        peer = null;
    }
    connections.clear();
    roleAssignments.clear();
    hostId = null;
    currentRoomCode = null;
    localPlayerName = "Player";
    clearConnectionInfo();
}

export function isHost() {
    return peer && connections.size > 0; // Simplified check
}

export function isClient() {
    return peer && hostId !== null;
}

export function getLocalPlayerName() {
    return localPlayerName;
}

export function getRoomCode() {
    return currentRoomCode;
}

export function getConnectedPlayers() {
    const players = [];
    connections.forEach((conn) => {
        const name = conn.customPlayerName || conn.metadata?.playerName;
        if (name) {
            players.push({ id: conn.peer, name: name });
        }
    });
    return players;
}

export function getHostPeerId() {
    return hostId;
}

// Connection persistence helpers
function persistConnectionInfo() {
    if (typeof localStorage === 'undefined') return;
    try {
        const info = {
            hostId,
            localPlayerName,
            currentRoomCode,
            isClient: isClient(),
            timestamp: Date.now()
        };
        localStorage.setItem(CONNECTION_INFO_KEY, JSON.stringify(info));
    } catch (err) {
        console.warn('Failed to persist connection info:', err);
    }
}

function getConnectionInfo() {
    if (typeof localStorage === 'undefined') return null;
    try {
        const raw = localStorage.getItem(CONNECTION_INFO_KEY);
        if (!raw) return null;
        const info = JSON.parse(raw);
        // Connection info expires after 1 hour
        if (Date.now() - (info.timestamp || 0) > 3600000) {
            clearConnectionInfo();
            return null;
        }
        return info;
    } catch (err) {
        console.warn('Failed to retrieve connection info:', err);
        return null;
    }
}

function clearConnectionInfo() {
    if (typeof localStorage === 'undefined') return;
    try {
        localStorage.removeItem(CONNECTION_INFO_KEY);
    } catch (err) {
        console.warn('Failed to clear connection info:', err);
    }
}

// Reconnection logic
async function attemptReconnect() {
    if (reconnectTimer) return; // Already attempting

    reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts - 1), 10000);

    console.log(`Reconnection attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS} in ${delay}ms...`);

    if (el.toastWarning) {
        el.toastWarning(t("network.connectionLost"));
    }

    reconnectTimer = setTimeout(async () => {
        reconnectTimer = null;

        try {
            const info = getConnectionInfo();
            if (!info || !info.hostId || !info.localPlayerName) {
                throw new Error('No connection info available');
            }

            if (el.toastInfo) {
                el.toastInfo(t("network.reconnectAttempt", {
                    attempt: reconnectAttempts,
                    max: MAX_RECONNECT_ATTEMPTS
                }));
            }

            await joinGame(info.hostId, info.localPlayerName, true);
        } catch (err) {
            console.error('Reconnection failed:', err);

            if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
                if (el.toastError) {
                    el.toastError(t("network.reconnectFailed"));
                }
                clearConnectionInfo();
                onHostDisconnectedCallbacks.forEach(callback => callback());
            } else {
                // Try again with backoff
                attemptReconnect();
            }
        }
    }, delay);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Make PeerJS instance accessible for debugging
window.peer = () => peer;
window.network = {
    hostGame,
    joinGame,
    disconnect,
    sendToPeer,
    broadcast,
    isHost,
    isClient,
    getRoomCode,
    getLocalPlayerName,
    getConnectedPlayers,
    getHostPeerId,
    setNetworkCallbacks
};
