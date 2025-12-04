// js/components/ViewClientRole.js
import { el } from '../modules/dom.js';
import { t, getRoleContent, applyTranslations } from '../modules/i18n.js';
import { getRoleImage } from '../modules/utils.js';
import { state } from '../modules/state.js';
import { persistState } from '../modules/store.js';

export class ViewClientRole extends HTMLElement {
    constructor() {
        super();
        this.render();
    }

    connectedCallback() {
        this.style.display = 'contents';
        this.render();
        // Listen for theme changes to update the image
        document.addEventListener('themeChanged', () => {
            if (state.assignedRole && el.clientRoleImage) {
                el.clientRoleImage.src = getRoleImage(state.assignedRole.roleId);
            }
        });
    }

    render() {
        this.innerHTML = `
            <section id="clientRoleView" class="panel hidden">
                <h2 data-i18n="clientRole.title">Your Role</h2>
                <div class="connection-status" data-status="disconnected">
                    <span class="connection-label" data-i18n="clientRole.connectionStatus">Connection:</span>
                    <span class="status-indicator"></span>
                    <span class="status-text" data-i18n="clientRole.statusDisconnected">Disconnected</span>
                </div>
                <div id="ghostPanel" class="ghost-panel hidden">
                    <div class="ghost-panel-icon">👻</div>
                    <h3 id="ghostYouWere" class="ghost-you-were"></h3>
                    <div class="ghost-divider"></div>
                    <h4 data-i18n="ghost.reminderTitle">Ghost Rules</h4>
                    <p data-i18n="ghost.reminderMessage">You have been eliminated. You can still vote to choose suspects, but you cannot vote in the lynching. You must not speak during discussions and must close your eyes during the night.</p>
                </div>
                <div id="clientRoleCard" class="role-card" data-team="unknown">
                    <img id="clientRoleImage" class="role-image" alt="${t("clientRole.imageAlt")}" />
                    <div class="role-text">
                        <p class="eyebrow" id="clientRoleTeam"></p>
                        <h3 id="clientRoleName"></h3>
                        <p id="clientRoleDescription"></p>
                    </div>
                </div>
                <button id="returnToLobbyBtn" class="btn-secondary hidden" type="button" data-i18n="clientRole.returnToLobby"></button>
            </section>
        `;
        applyTranslations(this);
    }

    showEliminated() {
        const ghostPanel = this.querySelector('#ghostPanel');
        const roleCard = this.querySelector('#clientRoleCard');
        const ghostYouWere = this.querySelector('#ghostYouWere');

        // Get the role name from the current state
        if (ghostYouWere && state.assignedRole) {
            const localized = getRoleContent(state.assignedRole.roleId);
            const roleName = localized ? localized.name : t("clientRole.unknownRole");
            ghostYouWere.textContent = t("ghost.youWere", { role: roleName });
        }

        // Show ghost panel
        if (ghostPanel) {
            ghostPanel.classList.remove('hidden');
        }

        // Hide role card
        if (roleCard) {
            roleCard.classList.add('hidden');
        }

        applyTranslations(this.querySelector('#ghostPanel'));
    }


    updateConnectionStatus(status) {
        const container = this.querySelector('.connection-status');
        const text = this.querySelector('.status-text');
        if (!container || !text) return;

        container.dataset.status = status;
        state.connectionStatus = status;

        const statusKey = status === 'connected' ? 'clientRole.statusConnected' :
            status === 'reconnecting' ? 'clientRole.statusReconnecting' :
                'clientRole.statusDisconnected';

        text.textContent = t(statusKey);
        text.setAttribute('data-i18n', statusKey);
        persistState();
    }

    setRole(roleData) {
        if (!roleData) {
            // Clear role display
            el.clientRoleImage.src = '';
            el.clientRoleImage.classList.add('hidden');
            el.clientRoleTeam.textContent = '';
            el.clientRoleName.textContent = t("clientRole.noRoleAssigned");
            el.clientRoleDescription.textContent = '';
            return;
        }

        // Save the role data to state for persistence
        state.assignedRole = roleData;
        persistState();

        const localized = getRoleContent(roleData.roleId);

        if (el.clientRoleImage) {
            el.clientRoleImage.src = getRoleImage(roleData.roleId);
            el.clientRoleImage.alt = localized ? localized.name : t("clientRole.imageAlt");
            el.clientRoleImage.classList.remove('hidden');
        }

        // Listen for theme changes to update the image



        if (el.clientRoleTeam) {
            el.clientRoleTeam.textContent = localized ? localized.teamLabel : '';
            if (el.clientRoleCard) el.clientRoleCard.dataset.team = roleData.team;
        }
        if (el.clientRoleName) {
            el.clientRoleName.textContent = localized ? localized.name : t("clientRole.unknownRole");
        }
        if (el.clientRoleDescription) {
            el.clientRoleDescription.textContent = localized ? localized.description : '';
        }

        // Event listener for the return to lobby button
        if (el.returnToLobbyBtn) {
            el.returnToLobbyBtn.classList.remove('hidden');
            el.returnToLobbyBtn.onclick = () => {
                // Clear role from state and storage
                state.assignedRole = null;
                persistState();
                window.location.reload();
            };
        }
    }
}

customElements.define('view-client-role', ViewClientRole);
