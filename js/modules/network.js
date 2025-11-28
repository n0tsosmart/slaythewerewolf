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

// Callbacks for UI updates - now using arrays to support multiple handlers
const onPeerConnectedCallbacks = [];
const onPeerDisconnectedCallbacks = [];
const onGameStartCallbacks = [];
const onHostDisconnectedCallbacks = [];
const onReceiveRoleCallbacks = [];
const onPlayerListUpdateCallbacks = [];

export function setNetworkCallbacks({ connected, disconnected, gameStart, hostDisconnected, receiveRole, playerListUpdate }) {
    if (connected) onPeerConnectedCallbacks.push(connected);
    if (disconnected) onPeerDisconnectedCallbacks.push(disconnected);
    if (gameStart) onGameStartCallbacks.push(gameStart);
    if (hostDisconnected) onHostDisconnectedCallbacks.push(hostDisconnected);
    if (receiveRole) onReceiveRoleCallbacks.push(receiveRole);
    if (playerListUpdate) onPlayerListUpdateCallbacks.push(playerListUpdate);
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

        peer.on('connection', (conn) => {
            console.log(`Connection received from: ${conn.peer}`);
            connections.set(conn.peer, conn);

            conn.on('open', () => {
                console.log(`Data channel opened with ${conn.peer}`);
                // Send initial data to new client
                conn.send({ type: 'WELCOME', message: t("network.welcomeClient") });
            });

            conn.on('data', (data) => {
                console.log(`Data from ${conn.peer}:`, data);
                handleHostData(conn, data);
            });

            conn.on('close', () => {
                console.log(`Connection with ${conn.peer} closed`);
                const playerName = conn.customPlayerName || conn.metadata?.playerName || conn.peer;
                connections.delete(conn.peer);
                onPeerDisconnectedCallbacks.forEach(callback => callback(playerName, conn.peer));
            });

            conn.on('error', (err) => {
                console.error(`Connection error with ${conn.peer}:`, err);
                // Connection errors are logged but not shown to users to avoid technical messages
            });
        });

        return currentRoomCode;
    } catch (err) {
        console.error("Failed to host game:", err);
        throw err;
    }
}

function handleHostData(conn, data) {
    switch (data.type) {
        case 'JOIN_REQUEST':
            conn.metadata = { playerName: data.playerName };
            conn.customPlayerName = data.playerName; // Store directly to ensure availability
            console.log(`Player ${data.playerName} (${conn.peer}) joined.`);
            // Add player to local state and update UI
            state.customNames.push(data.playerName);
            persistState();
            onPeerConnectedCallbacks.forEach(callback => callback(data.playerName, conn.peer));
            // Inform all existing clients about the new player
            broadcast({ type: 'PLAYER_LIST_UPDATE', players: state.customNames });
            break;
        default:
            console.warn("Unknown data type received by host:", data.type);
    }
}

// Client functions
export async function joinGame(roomId, playerName) {
    try {
        localPlayerName = playerName;
        hostId = roomId;
        await initializePeer(); // Initialize with a random ID for the client
        console.log(`Attempting to join room ${roomId} as ${playerName}`);

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
                cleanup();
                console.log(`Connected to host ${roomId}`);
                conn.send({ type: 'JOIN_REQUEST', playerName: playerName });
                resolve(conn);
            });

            // Handle connection data
            conn.on('data', (data) => {
                console.log('Data from host:', data);
                handleClientData(data);
            });

            // Handle connection close
            conn.on('close', () => {
                console.log('Connection to host closed');
                hostId = null;
                onHostDisconnectedCallbacks.forEach(callback => callback());
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
        default:
            console.warn("Unknown data type received by client:", data.type);
    }
}

// Send data to a specific peer (Host only)
export function sendToPeer(peerId, data) {
    const conn = connections.get(peerId);
    if (conn && conn.open) {
        conn.send(data);
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

// Disconnect from current peer (client) or close all connections (host)
export function disconnect() {
    if (peer) {
        peer.destroy();
        peer = null;
    }
    connections.clear();
    hostId = null;
    currentRoomCode = null;
    localPlayerName = "Player";
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
