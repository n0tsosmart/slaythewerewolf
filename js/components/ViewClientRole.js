// js/components/ViewClientRole.js
import { el } from '../modules/dom.js';
import { t, getRoleContent, applyTranslations } from '../modules/i18n.js'; 

export class ViewClientRole extends HTMLElement {
    constructor() {
        super();
        this.render();
    }

    connectedCallback() {
        this.style.display = 'contents';
        this.render();
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

        const localized = getRoleContent(roleData.roleId);

        if (el.clientRoleImage) {
            el.clientRoleImage.src = roleData.image;
            el.clientRoleImage.alt = localized ? localized.name : t("clientRole.imageAlt");
            el.clientRoleImage.classList.remove('hidden');
        }
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
                // In a real scenario, this might disconnect or go to a client-side summary
                // For now, it will return to the setup screen.
                window.location.reload(); // Simple way to clear state for now
            };
        }
    }
}

customElements.define('view-client-role', ViewClientRole);
