export class ViewSummary extends HTMLElement {
  connectedCallback() {
    this.style.display = 'contents';
    this.innerHTML = `
    <section id="summaryView" class="panel hidden">
      <!-- Sticky Header: Day + Timer + Next Day -->
      <div class="summary-sticky-header">
        <div class="summary-header-row">
          <div class="day-badge">
            <span class="day-label" data-i18n="day.label">Day</span>
            <span class="day-value" id="dayCounter">1</span>
          </div>
          
          <div class="timer-control collapsed" id="timerControl">
            <button id="timerToggle" class="timer-toggle" type="button" title="Toggle timer">
              <span class="timer-toggle-icon">⏱️</span>
              <span id="timerMiniDisplay" class="timer-mini-display"></span>
            </button>
            <div class="timer-expanded">
              <div class="timer-display-wrapper">
                <svg class="timer-ring-svg" viewBox="0 0 100 100">
                  <circle class="timer-ring-bg" cx="50" cy="50" r="45" />
                  <circle id="timerRing" class="timer-ring-progress" cx="50" cy="50" r="45" />
                </svg>
                <span id="timerDisplay" class="timer-display">--:--</span>
              </div>
              <div class="timer-buttons">
                <button id="timer2min" class="timer-preset" type="button">2m</button>
                <button id="timer3min" class="timer-preset" type="button">3m</button>
                <button id="timer5min" class="timer-preset" type="button">5m</button>
                <button id="timerPause" class="timer-action" type="button" disabled>⏸️</button>
                <button id="timerSkip" class="timer-action" type="button" disabled>⏭️</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Guide Panel - Primary focus -->
      <div class="guide-panel">
        <div class="guide-header">
          <h3 data-i18n="guide.title">Narration guide</h3>
          <span id="guideProgress" class="guide-progress">Step 1 / 1</span>
        </div>
        <p id="guideStepText" class="guide-text">-</p>
        <ul id="guideFullList" class="guide-list hidden"></ul>
        <div id="guideNav" class="guide-nav-inline">
          <button id="prevGuideStep" class="btn-ghost btn-small" type="button">⬅️</button>
          <button id="toggleGuideMode" class="btn-ghost btn-small" type="button" data-i18n="buttons.toggleGuide">List</button>
          <button id="nextGuideStep" class="btn-primary btn-small" type="button">➡️</button>
        </div>
      </div>

      <!-- Mythomaniac Panel (hidden until needed) -->
      <div id="mythPanel" class="myth-panel hidden">
        <div class="myth-header">
          <h3 data-i18n="myth.title">Mythomaniac</h3>
          <span id="mythStatusTag" class="myth-status"></span>
        </div>
        <p id="mythPlayerLabel" class="help"></p>
        <p id="mythInstructions" class="help"></p>
        <label>
          <span data-i18n="myth.targetLabel">Choose someone to imitate</span>
          <select id="mythTargetSelect"></select>
        </label>
        <button id="mythConfirmBtn" class="btn-secondary btn-small" type="button" data-i18n="myth.confirm">Apply</button>
        <p id="mythResultMessage" class="myth-result help" aria-live="polite"></p>
      </div>
      <div id="mythSummary" class="myth-summary hidden">
        <span data-i18n="myth.title">Mythomaniac</span>
        <span id="mythSummaryText"></span>
      </div>

      <!-- Next Day Button - attached to guide -->
      <button id="nextDayBtn" class="btn-day btn-next-day" type="button" data-i18n="buttons.nextDay">Next day</button>

      <!-- Divider -->
      <hr class="section-divider" />

      <!-- Player Sections - Collapsible -->
      <details id="livingDetails" class="player-section">
        <summary class="player-section-header">
          <span data-i18n="living.title">👥 Living</span>
          <span id="livingCount" class="player-count">0</span>
          <button id="toggleListView" class="btn-icon-tiny" type="button" aria-label="Toggle view">⊞</button>
        </summary>
        <ul id="summaryList" class="summary-list"></ul>
      </details>

      <details id="fallenDetails" class="player-section">
        <summary class="player-section-header">
          <span data-i18n="fallen.title">🪦 Fallen</span>
          <span id="fallenCount" class="player-count">0</span>
        </summary>
        <ul id="fallenList" class="fallen-list"></ul>
      </details>

      <!-- Quick Actions -->
      <div class="summary-footer">
        <button id="openVotingFromSummary" type="button" class="btn-ghost btn-small" data-i18n="menu.voting">🗳️ Voting Rules</button>
      </div>
    </section>
    `;
  }
}

customElements.define('view-summary', ViewSummary);