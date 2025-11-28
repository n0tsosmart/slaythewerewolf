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
