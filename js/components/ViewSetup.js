export class ViewSetup extends HTMLElement {
  connectedCallback() {
    this.style.display = 'contents';
    this.innerHTML = `
    <section id="setupView" class="panel">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;" class="animate-entry stagger-1">
        <h2 data-i18n="setup.title" style="margin-bottom: 0;">⚙️ Setup</h2>
        <button id="backToLandingFromSetup" class="btn-solid-glass btn-small" type="button" data-i18n="buttons.back">← Back</button>
      </div>
      <form id="setupForm" class="setup-form">
        <div class="field-group animate-entry stagger-2">
          <label class="player-count-label">
            <span data-i18n="setup.playersLabel">Number of players</span>
            <div class="number-stepper">
              <button type="button" class="step-btn" data-target="playerCount" data-delta="-1">-</button>
              <input type="number" id="playerCount" min="5" max="24" value="8" required />
              <button type="button" class="step-btn" data-target="playerCount" data-delta="1">+</button>
            </div>
            <span class="help" data-i18n="setup.playersHelp">Minimum 5 players to start</span>
          </label>

          <label>
            <span data-i18n="setup.wolvesLabel">Werewolves</span>
            <div class="number-stepper">
              <button type="button" class="step-btn" data-target="wolfCount" data-delta="-1">-</button>
              <input type="number" id="wolfCount" min="1" max="3" value="2" required />
              <button type="button" class="step-btn" data-target="wolfCount" data-delta="1">+</button>
            </div>
            <span id="wolfHint" class="help"></span>
          </label>
        </div>


        <div class="player-list-section animate-entry stagger-3">
          <label>
            <span data-i18n="setup.namesLabel">👥 Player names (optional)</span>
            <span class="help" data-i18n="setup.namesHelp">We keep this list even after starting a new game.</span>
          </label>
          <div class="add-player-row">
            <input type="text" id="playerNameInput" data-i18n-placeholder="setup.namesPlaceholder"
              placeholder="e.g. Marcus" autocomplete="off" />
            <button type="button" id="addPlayerBtn" class="btn-secondary btn-small"
              data-i18n="buttons.addPlayer">Add</button>
          </div>
          <ul id="playerList" class="player-chips"></ul>
          <p id="reorderHint" class="help hidden" data-i18n="setup.reorderHint" style="margin-bottom: 4px;">Use the
            arrows to change the player order</p>
          <button type="button" id="clearPlayersBtn" class="btn-ghost btn-small hidden"
            data-i18n="buttons.clearPlayers">Clear list</button>
        </div>

        <p id="validationMessage" class="validation" aria-live="polite"></p>

        <details id="rolesDetails" class="roles-details animate-entry stagger-4">
          <summary class="roles-summary">
            <span data-i18n="setup.specialsTitle">✨ Special roles</span>
            <span class="roles-caret">⌄</span>
          </summary>
          <div class="collapsible-content">
            <p class="help" data-i18n="setup.specialsHelp">The Seer is always included. Other roles unlock based on the
              player count.</p>
            <div id="roleOptions" class="options-grid"></div>
          </div>
        </details>

        <div id="roleSummary" class="role-summary hidden">
          <div class="role-summary-header">
            <h3 data-i18n="setup.rolesSummary">Role composition</h3>
            <span id="balanceBadge" class="balance-badge"></span>
          </div>
          <div id="roleSummaryContent" class="role-summary-content"></div>
        </div>

        <div class="actions-right animate-entry stagger-5">
          <button type="submit" class="btn-primary" data-i18n="buttons.deal">🎴 Deal the cards</button>
        </div>
      </form>
    </section>
    `;
  }
}

customElements.define('view-setup', ViewSetup);