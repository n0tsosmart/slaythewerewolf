export class ViewReveal extends HTMLElement {
  connectedCallback() {
    this.style.display = 'contents';
    this.innerHTML = `
    <section id="revealView" class="panel hidden">
      <h2 data-i18n="reveal.title">🔐 Secret dealing</h2>
      <div id="revealStatus" class="reveal-status">
        <p id="playerProgress">Player 1 / 1</p>
        <h3 id="currentPlayerLabel">Player 1</h3>
      </div>
      <div id="roleCard" class="role-card" data-team="unknown">
        <img id="roleImage" class="role-image hidden" alt="Immagine del ruolo" />
        <div class="role-text">
          <p class="eyebrow" id="roleTeam">Hidden card</p>
          <h3 id="roleName">Tap to reveal</h3>
          <p id="roleDescription">Make sure no one else is watching</p>
        </div>
      </div>
      <div id="handoffNotice" class="handoff-notice hidden">
        <h4 data-i18n="handoffNotice.title">⚠️ Pass the device to the narrator</h4>
        <p data-i18n="handoffNotice.body">When every card has been seen, nobody else should touch the device. Hand it to
          the narrator before Day 1 begins.</p>
        <p id="handoffTimer" class="handoff-timer hidden" aria-live="polite"></p>
      </div>
      <div class="actions-right">
        <button id="revealBtn" class="btn-primary" type="button" data-i18n="buttons.showCard">👁️ Show card</button>
        <button id="hideBtn" class="btn-secondary hidden" type="button" data-i18n="buttons.nextPlayer">➡️ Next
          player</button>
        <button id="openSummaryBtn" class="btn-ghost hidden" type="button" data-i18n="buttons.handoff">📱 I am the
          narrator</button>
      </div>
    </section>
    `;
  }
}

customElements.define('view-reveal', ViewReveal);