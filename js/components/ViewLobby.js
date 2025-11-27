// js/components/ViewLobby.js
import { el } from '../modules/dom.js';
import { state } from '../modules/state.js';
import { t, applyTranslations } from '../modules/i18n.js';
import { hostGame, joinGame, setNetworkCallbacks, disconnect, getRoomCode, getConnectedPlayers, isHost, getLocalPlayerName, getHostPeerId } from '../modules/network.js';
import { showView, showClientRoleView, showLobbyView } from '../modules/engine.js'; 
import { renderPlayerList } from '../modules/setup.js';

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
        this.attachEvents();
        setNetworkCallbacks({
            connected: this.handlePeerConnected.bind(this),
            disconnected: this.handlePeerDisconnected.bind(this),
            gameStart: this.handleGameStart.bind(this),
            hostDisconnected: this.handleHostDisconnected.bind(this),
            receiveRole: this.handleReceiveRole.bind(this),
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
            </section>
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

    async onHostGame() {
        this.isHostMode = true;
        this.roomCode = await hostGame();
        if (this.roomCode) {
            el.lobbyMainMenu.classList.add('hidden');
            el.lobbyHost.classList.remove('hidden');
            el.hostRoomCodeDisplay.textContent = this.roomCode;
            this.updateHostPlayerList();
            showLobbyView();
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
            showLobbyView();
        } catch (error) {
            console.error("Error joining game:", error);
            el.toastError(t("network.joinError", { error: error.message }));
        }
    }

    onStartNetworkGame() {
        // This will trigger the game start in engine.js
        // and network.js will broadcast to all clients
        if (state.customNames.length < 1) { // Narrator + at least 1 player
             el.toastError(t("network.needAtLeastOnePlayer"));
             return;
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
    }

    onLeaveGame() {
        disconnect();
        el.lobbyClient.classList.add('hidden');
        el.lobbyMainMenu.classList.remove('hidden');
        el.toastInfo(t("network.leftGame"));
        showView("setup"); // Return to setup view as default
    }

    handlePeerConnected(playerName, peerId) {
        this.connectedPlayerPeers.set(peerId, playerName); // Store peerId -> name mapping
        this.updateHostPlayerList();
        el.toastInfo(t("network.playerJoined", { name: playerName }));
    }

    handlePeerDisconnected(playerName, peerId) {
        this.connectedPlayerPeers.delete(peerId);
        this.updateHostPlayerList();
        el.toastInfo(t("network.playerLeft", { name: playerName }));
        // Also remove from state.customNames if this player was added via network
        state.customNames = state.customNames.filter(name => name !== playerName);
        renderPlayerList(); // Refresh the setup player list
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


    updateHostPlayerList() {
        if (!el.hostPlayerList) return;
        el.hostPlayerList.innerHTML = '';
        getConnectedPlayers().forEach(player => {
            const li = document.createElement('li');
            li.textContent = player.name;
            el.hostPlayerList.appendChild(li);
        });

        // Add narrator's own name to the list (implicitly local player)
        if (this.isHostMode) {
             const narratorLi = document.createElement('li');
             narratorLi.textContent = t("lobby.narratorPlayerName"); // "Narrator (You)"
             el.hostPlayerList.appendChild(narratorLi);
        }
    }

    handleRejoinAsClient() {
        const hostPeerId = getHostPeerId();
        const playerName = getLocalPlayerName();
        if (hostPeerId && playerName) {
            el.toastInfo(t("network.rejoiningGame", { name: playerName }));
            el.lobbyMainMenu.classList.add('hidden');
            el.lobbyClient.classList.remove('hidden');
            el.clientPlayerNameDisplay.textContent = playerName;
            showLobbyView();
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