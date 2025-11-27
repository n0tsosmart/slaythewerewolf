// js/components/ViewLobby.js
import { el } from '../modules/dom.js';
import { state } from '../modules/state.js';
import { t, applyTranslations } from '../modules/i18n.js';
import { hostGame, joinGame, setNetworkCallbacks, disconnect, getRoomCode, getConnectedPlayers, isHost, getLocalPlayerName, getHostPeerId } from '../modules/network.js';
import { showView, showClientRoleView, showLobbyView } from '../modules/engine.js';
import { renderPlayerList } from '../modules/setup.js';
import { persistState } from '../modules/store.js';

export class ViewLobby extends HTMLElement {
    constructor() {
        super();
        this.render();
        this.isHostMode = false;
        this.roomCode = null;
        this.connectedPlayerPeers = new Map(); // Map to store peerId -> playerName
    }

    connectedCallback() {
        this.style.display = 'contents';
        this.render();

        // Sync local state with network state in case of re-render
        const existingPlayers = getConnectedPlayers();
        existingPlayers.forEach(p => this.connectedPlayerPeers.set(p.id, p.name));

        this.attachEvents();
        setNetworkCallbacks({
            connected: this.handlePeerConnected.bind(this),
            disconnected: this.handlePeerDisconnected.bind(this),
            gameStart: this.handleGameStart.bind(this),
            hostDisconnected: this.handleHostDisconnected.bind(this),
            receiveRole: this.handleReceiveRole.bind(this),
            playerListUpdate: this.handlePlayerListUpdate.bind(this),
        });

        // Check if we are resuming from a client role view
        if (state.view === "client-role" && getHostPeerId()) {
            // If we were a client, try to re-join and go straight to client role view
            this.handleRejoinAsClient();
        }
    }

    disconnectedCallback() {
        this.removeEvents();
    }

    render() {
        this.innerHTML = `
            <section id="lobbyView" class="panel hidden">
                <h2 data-i18n="lobby.title"></h2>
                
                <div id="lobbyMainMenu" class="lobby-section">
                    <button id="hostGameBtn" class="btn-primary" type="button" data-i18n="lobby.hostGame"></button>
                    <div class="or-separator" data-i18n="lobby.or"></div>
                    <div class="join-game-section">
                        <input type="text" id="joinRoomCodeInput" placeholder="ABCD" maxlength="4" data-i18n-placeholder="lobby.roomCodePlaceholder" />
                        <input type="text" id="joinPlayerNameInput" placeholder="Your Name" data-i18n-placeholder="lobby.yourNamePlaceholder" />
                        <button id="joinGameBtn" class="btn-secondary" type="button" data-i18n="lobby.joinGame"></button>
                    </div>
                </div>

                <div id="lobbyHost" class="lobby-section hidden">
                    <p data-i18n="lobby.shareCode"></p>
                    <h3 id="hostRoomCodeDisplay"></h3>
                    <div class="player-list-container">
                        <h4 data-i18n="lobby.playersInRoom"></h4>
                        <ul id="hostPlayerList" class="player-list"></ul>
                    </div>
                    <div class="lobby-actions">
                        <button id="startNetworkGameBtn" class="btn-primary" type="button" data-i18n="lobby.startGame"></button>
                        <button id="cancelHostBtn" class="btn-ghost" type="button" data-i18n="buttons.cancel"></button>
                    </div>
                </div>

                <div id="lobbyClient" class="lobby-section hidden">
                    <p data-i18n="lobby.joinedAs"></p>
                    <h3 id="clientPlayerNameDisplay"></h3>
                    <p data-i18n="lobby.waitingForHost"></p>
                    <button id="leaveGameBtn" class="btn-ghost" type="button" data-i18n="buttons.leave"></button>
                </div>
            </section >
    `;
        // Apply initial translations
        applyTranslations(this);
    }
    attachEvents() {
        el.hostGameBtn?.addEventListener('click', this.onHostGame.bind(this));
        el.joinGameBtn?.addEventListener('click', this.onJoinGame.bind(this));
        el.startNetworkGameBtn?.addEventListener('click', this.onStartNetworkGame.bind(this));
        el.cancelHostBtn?.addEventListener('click', this.onCancelHost.bind(this));
        el.leaveGameBtn?.addEventListener('click', this.onLeaveGame.bind(this));
    }

    removeEvents() {
        el.hostGameBtn?.removeEventListener('click', this.onHostGame.bind(this));
        el.joinGameBtn?.removeEventListener('click', this.onJoinGame.bind(this));
        el.startNetworkGameBtn?.removeEventListener('click', this.onStartNetworkGame.bind(this));
        el.cancelHostBtn?.removeEventListener('click', this.onCancelHost.bind(this));
        el.leaveGameBtn?.removeEventListener('click', this.onLeaveGame.bind(this));
    }

    resetToMainMenu() {
        // Show only the main menu, hide host and client sections
        if (el.lobbyMainMenu) el.lobbyMainMenu.classList.remove('hidden');
        if (el.lobbyHost) el.lobbyHost.classList.add('hidden');
        if (el.lobbyClient) el.lobbyClient.classList.add('hidden');
    }

    async onHostGame() {
        this.isHostMode = true;

        // Clear manual player list when hosting online game
        state.customNames = [];
        persistState();

        this.roomCode = await hostGame();
        if (this.roomCode) {
            el.lobbyMainMenu.classList.add('hidden');
            el.lobbyHost.classList.remove('hidden');
            el.hostRoomCodeDisplay.textContent = this.roomCode;
            this.updateHostPlayerList();

            // Add online-mode class to hide player configurator
            document.body.classList.add('online-mode');

            showView('lobby');
        }
    }

    async onJoinGame() {
        this.isHostMode = false;
        const roomCode = el.joinRoomCodeInput.value.toUpperCase();
        const playerName = el.joinPlayerNameInput.value.trim();

        if (!roomCode || !playerName) {
            el.toastError(t("network.roomCodeAndNameRequired"));
            return;
        }

        try {
            await joinGame(roomCode, playerName);
            el.lobbyMainMenu.classList.add('hidden');
            el.lobbyClient.classList.remove('hidden');
            el.clientPlayerNameDisplay.textContent = playerName;
            this.updateClientPlayerList(); // Initial player list update
            showView('lobby');
        } catch (error) {
            console.error("Error joining game:", error);
            el.toastError(t("network.joinError", { error: error.message }));
        }
    }

    onStartNetworkGame() {
        // This will trigger the game start in engine.js
        // and network.js will broadcast to all clients
        const peerCount = this.connectedPlayerPeers.size;
        
        if (peerCount < 5) {
            el.toastError(t("errors.minPlayers", { count: 5 }));
            return;
        }

        // Update el.playerCount to match connected peers so setup logic works (hints, deck size preview)
        if (el.playerCount) {
            el.playerCount.value = String(peerCount);
            el.playerCount.dispatchEvent(new Event('input', { bubbles: true }));
        }

        showView("setup"); // Transition to setup to finalize game config
    }

    onCancelHost() {
        disconnect();
        this.connectedPlayerPeers.clear();
        this.roomCode = null;
        this.isHostMode = false;
        el.lobbyHost.classList.add('hidden');
        el.lobbyMainMenu.classList.remove('hidden');
        el.toastInfo(t("network.hostCancelled"));
        // Clear player list added by network joins
        state.customNames = state.customNames.filter(name => !this.connectedPlayerPeers.has(name));

        // Remove online-mode class
        document.body.classList.remove('online-mode');
    }

    onLeaveGame() {
        disconnect();
        el.lobbyClient.classList.add('hidden');
        el.lobbyMainMenu.classList.remove('hidden');
        el.toastInfo(t("network.leftGame"));

        // Clear assigned role when explicitly leaving
        state.assignedRole = null;
        persistState();

        showView("setup"); // Return to setup view as default
    }

    handlePeerConnected(playerName, peerId) {
        this.connectedPlayerPeers.set(peerId, playerName); // Store peerId -> name mapping
        this.updateHostPlayerList();
        el.toastInfo(t("network.playerJoined", { name: playerName }));

        // Update player count input if in setup view to reflect new count immediately
        if (state.view === 'setup' && el.playerCount) {
            el.playerCount.value = String(this.connectedPlayerPeers.size);
            el.playerCount.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    handlePeerDisconnected(playerName, peerId) {
        this.connectedPlayerPeers.delete(peerId);
        this.updateHostPlayerList();
        el.toastInfo(t("network.playerLeft", { name: playerName }));
        // Also remove from state.customNames if this player was added via network
        state.customNames = state.customNames.filter(name => name !== playerName);
        renderPlayerList(); // Refresh the setup player list

        // Update player count input if in setup view to reflect new count immediately
        if (state.view === 'setup' && el.playerCount) {
            el.playerCount.value = String(this.connectedPlayerPeers.size);
            el.playerCount.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    handleHostDisconnected() {
        disconnect(); // Clean up client-side network
        el.lobbyClient.classList.add('hidden');
        el.lobbyMainMenu.classList.remove('hidden');
        el.toastError(t("network.hostDisconnected"));
        showView("setup"); // Return to setup view
    }

    handleGameStart(gameData) {
        // Client receives this when host starts the game
        // Transition client to a waiting screen or directly to role if immediately sent
        el.toastInfo(t("network.gameStarted"));
        // Potentially show a "waiting for role" screen, or directly go to client role view if role is bundled
        showClientRoleView(getLocalPlayerName()); // This will show the client role view
    }

    handleReceiveRole(roleData) {
        el.toastInfo(t("network.receivedRole"));
        showClientRoleView(getLocalPlayerName(), roleData); // showClientRoleView will populate with roleData
    }

    handlePlayerListUpdate(players) {
        console.log("Player list updated:", players);
        this.updateClientPlayerList();
    }


    updateHostPlayerList() {
        if (!el.hostPlayerList) return;
        console.log("Updating host player list with:", this.connectedPlayerPeers);
        el.hostPlayerList.innerHTML = '';

        // Use local map as source of truth
        this.connectedPlayerPeers.forEach((name, id) => {
            const li = document.createElement('li');
            li.textContent = name;
            el.hostPlayerList.appendChild(li);
        });

        // Add narrator's own name to the list (implicitly local player)
        if (this.isHostMode) {
            const narratorLi = document.createElement('li');
            narratorLi.textContent = t("lobby.narratorPlayerName"); // "Narrator (You)"
            el.hostPlayerList.appendChild(narratorLi);
        }
    }

    updateClientPlayerList() {
        const clientPlayerList = document.getElementById('clientPlayerList');
        if (!clientPlayerList) return;
        console.log("Updating client player list with:", state.customNames);
        clientPlayerList.innerHTML = '';

        // Display all players from state.customNames (updated by PLAYER_LIST_UPDATE message)
        state.customNames.forEach((name) => {
            const li = document.createElement('li');
            li.textContent = name;
            clientPlayerList.appendChild(li);
        });

        // Add the local player's name with indicator
        const localLi = document.createElement('li');
        localLi.textContent = `${getLocalPlayerName()} (${t("lobby.you") || "You"})`;
        clientPlayerList.appendChild(localLi);
    }

    handleRejoinAsClient() {
        const hostPeerId = getHostPeerId();
        const playerName = getLocalPlayerName();
        if (hostPeerId && playerName) {
            el.toastInfo(t("network.rejoiningGame", { name: playerName }));
            el.lobbyMainMenu.classList.add('hidden');
            el.lobbyClient.classList.remove('hidden');
            el.clientPlayerNameDisplay.textContent = playerName;
            showView('lobby');
            // Re-joining game should be handled by the network module itself if the connection is dropped.
            // For now, we assume if hostPeerId exists, the connection is still active or will attempt to re-establish.
        } else {
            // No active host ID, cannot rejoin
            el.toastWarning(t("network.couldNotRejoin"));
            showView("setup");
        }
    }
}

customElements.define('view-lobby', ViewLobby);