export class ViewSummary extends HTMLElement {
  connectedCallback() {
    this.style.display = 'contents';
    this.innerHTML = `
    <section id="summaryView" class="panel hidden">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <h2 data-i18n="summary.title" style="margin: 0;">📋 Narrator summary</h2>
        <button id="openVotingFromSummary" type="button" class="btn-link" data-i18n="menu.voting">🗳️ Voting
          Rules</button>
      </div>
      <details id="livingDetails" class="living-details" open>
        <summary>
          <span data-i18n="living.title">👥 Living players</span>
          <span id="livingCount" class="living-count">0</span>
          <button id="toggleListView" class="btn-icon-small" type="button" title="Toggle view mode"
            aria-label="Toggle view mode">
            <span class="view-icon">⊞</span>
          </button>
        </summary>
        <ul id="summaryList" class="summary-list"></ul>
      </details>

      <details id="fallenDetails" class="fallen-details">
        <summary>
          <span data-i18n="fallen.title">🪦 Fallen players</span>
          <span id="fallenCount" class="fallen-count">0</span>
        </summary>
        <ul id="fallenList" class="fallen-list"></ul>
      </details>

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
        <button id="mythConfirmBtn" class="btn-secondary btn-small" type="button" data-i18n="myth.confirm">Apply
          transformation</button>
        <p id="mythResultMessage" class="myth-result help" aria-live="polite"></p>
      </div>
      <div id="mythSummary" class="myth-summary hidden">
        <span data-i18n="myth.title">Mythomaniac</span>
        <span id="mythSummaryText"></span>
      </div>

      <div class="narrator-tools">
        <div class="day-control">
          <div>
            <p class="eyebrow" data-i18n="day.label">Current day</p>
            <p class="day-number" id="dayCounter">1</p>
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
                <button id="timer2min" class="timer-preset" type="button" title="2 minutes">2m</button>
                <button id="timer3min" class="timer-preset" type="button" title="3 minutes">3m</button>
                <button id="timer5min" class="timer-preset" type="button" title="5 minutes">5m</button>
                <button id="timerPause" class="timer-action" type="button" disabled title="Pause">⏸️</button>
                <button id="timerSkip" class="timer-action" type="button" disabled title="Skip">⏭️</button>
              </div>
            </div>
          </div>
        </div>

        <div class="guide-panel">
          <div class="guide-header">
            <h3 data-i18n="guide.title">Narration guide</h3>
            <span id="guideProgress" class="guide-progress">Step 1 / 1</span>
            <button id="toggleGuideMode" class="btn-ghost btn-small" type="button" data-i18n="buttons.toggleGuide">Show
              list</button>
          </div>
          <p id="guideStepText" class="guide-text">-</p>
          <ul id="guideFullList" class="guide-list hidden"></ul>
          <div id="guideNav" class="actions-right guide-nav">
            <button id="prevGuideStep" class="btn-ghost btn-small" type="button" data-i18n="buttons.prevStep">⬅️
              Back</button>
            <button id="nextGuideStep" class="btn-primary btn-small" type="button" data-i18n="buttons.nextStep">Next
              ➡️</button>
          </div>
        </div>
        
        <button id="nextDayBtn" class="btn-day btn-next-day" type="button" data-i18n="buttons.nextDay">Next day</button>
      </div>
    </section>
    `;
  }
}

customElements.define('view-summary', ViewSummary);