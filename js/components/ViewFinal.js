export class ViewFinal extends HTMLElement {
  connectedCallback() {
    this.style.display = 'contents';
    this.innerHTML = `
    <section id="finalView" class="panel hidden">
      <h2 id="victoryTitle" class="victory-title">Victory</h2>
      <p id="victorySubtitle" class="victory-subtitle"></p>
      <ul id="victoryList" class="summary-list"></ul>
      <div class="summary-actions actions-right">
        <button id="finalNewGameBtn" class="btn-primary" type="button" data-i18n="buttons.newMatch">🔁 New game</button>
      </div>
    </section>
    `;
  }
}

customElements.define('view-final', ViewFinal);