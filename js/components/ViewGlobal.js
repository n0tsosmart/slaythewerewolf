export class ViewGlobal extends HTMLElement {
  connectedCallback() {
    this.style.display = 'contents';
    this.innerHTML = `
    <div id="infoFooter" class="info-footer">
      <p class="app-footer" data-i18n="footer.license">Released under the MIT License by n0tsosmart.</p>
      <p class="app-footer">
        <a href="https://www.paypal.com/donate/?hosted_button_id=QRPBSBNR88J8C" target="_blank" rel="noopener noreferrer" class="link-button" data-i18n="footer.donate">❤️ Support this project</a>
        •
        <button id="privacyBtn" class="link-button" type="button" data-i18n="footer.privacy">🔒 Privacy & Data Policy</button>
      </p>
    </div>

    <div id="modalOverlay" class="modal-overlay hidden">
      <div class="modal-panel">
        <h3 id="modalTitle" class="modal-title" data-i18n="modal.title">Confirm</h3>
        <p id="modalMessage" class="help" style="color: #f8fafc"></p>
        <div class="modal-actions">
          <button id="modalCancel" class="btn-secondary btn-small" type="button"
            data-i18n="modal.cancel">Cancel</button>
          <button id="modalConfirm" class="btn-primary btn-small" type="button"
            data-i18n="modal.confirm">Confirm</button>
        </div>
      </div>
    </div>

    <div id="infoOverlay" class="modal-overlay hidden">
      <div class="modal-panel info-panel">
        <h3 class="modal-title" data-i18n="info.title">Keep the village immersive</h3>
        <div class="info-section">
          <h3 data-i18n="info.roleplayTitle">Roleplay suggestions</h3>
          <p data-i18n="info.roleplayPlayers">Players: speak in character, whisper suspicions, and describe gestures
            without breaking immersion. Skip meta remarks like “I was picked third”.</p>
          <p data-i18n="info.roleplayNarrator">Narrator: set the scene before every phase, give sensory details, and
            call roles by title instead of names so the mystery stays alive.</p>
        </div>
        <div class="info-section">
          <h3 data-i18n="info.rulesTitle">Rules & metagame</h3>
          <p data-i18n="info.rulesSummary">No one may show their card, record the night, or discuss outside the table.
            Eliminated players remain silent unless a role explicitly reintroduces them.</p>
          <p data-i18n="info.rulesMetagame">Metagame reminders: no nudging, no phone searches, and no coded taps. The
            narrator can pause or rewind a phase if the table breaks immersion.</p>
        </div>
        <div class="modal-actions">
          <button id="infoClose" class="btn-secondary btn-small" type="button" data-i18n="modal.cancel">Close</button>
        </div>
      </div>
    </div>

    <div id="votingOverlay" class="modal-overlay hidden">
      <div class="modal-panel info-panel">
        <h3 class="modal-title" data-i18n="voting.title">Voting Rules</h3>
        <div class="info-section">
          <h3 data-i18n="voting.indiziatoTitle">Suspects</h3>
          <p data-i18n="voting.indiziatoBody">The two players with the most votes become suspects. In case of a tie, the
            player closest to the one with the 'Welcome!' card (clockwise) is chosen.</p>
        </div>
        <div class="info-section">
          <h3 data-i18n="voting.lynchTitle">Lynching</h3>
          <p data-i18n="voting.lynchBody">Only living players (excluding suspects and ghosts) vote to lynch one of the
            suspects. The suspect with the most votes is eliminated.</p>
        </div>
        <div class="info-section">
          <h3 data-i18n="voting.tieTitle">Tie-breaking</h3>
          <p data-i18n="voting.tieBody">If there is a tie during the lynching vote, the suspect closest to the
            'Welcome!' player (clockwise) is eliminated.</p>
        </div>
        <div class="info-section">
          <h3 data-i18n="voting.ghostTitle">Ghosts</h3>
          <p data-i18n="voting.ghostBody">Ghosts can vote to choose suspects but cannot vote for lynching.</p>
        </div>
        <div class="modal-actions">
          <button id="votingClose" class="btn-secondary btn-small" type="button" data-i18n="modal.cancel">Close</button>
        </div>
      </div>
    </div>

    <div id="privacyOverlay" class="modal-overlay hidden">
      <div class="modal-panel info-panel">
        <h3 class="modal-title" data-i18n="privacy.title">Privacy & Data Policy</h3>
        <p class="help" data-i18n="privacy.intro">This application is designed with privacy in mind. Here's how we handle your data:</p>
        
        <div class="info-section">
          <h3 data-i18n="privacy.localTitle">Local Storage Only</h3>
          <p data-i18n="privacy.localDesc">All game data (player names, game state, language preferences) is stored locally in your browser using LocalStorage. No data is sent to any external servers or third parties.</p>
        </div>
        
        <div class="info-section">
          <h3 data-i18n="privacy.noCookiesTitle">No Tracking or Cookies</h3>
          <p data-i18n="privacy.noCookiesDesc">We do not use cookies, analytics, or any tracking mechanisms. Your gameplay is completely private.</p>
        </div>
        
        <div class="info-section">
          <h3 data-i18n="privacy.peerJsTitle">Online Mode: WebRTC (PeerJS)</h3>
          <p data-i18n="privacy.peerJsDesc">When you use Online Mode, the app uses PeerJS for peer-to-peer connections via WebRTC. This requires a signaling server to establish connections between players.</p>
          <p data-i18n="privacy.peerJsData">Data exchanged: Only game-related information (role assignments, player names, room codes) is transmitted directly between players' browsers. The signaling server only facilitates the initial connection and does not store or access your game data.</p>
          <p data-i18n="privacy.peerJsThirdParty">PeerJS uses a public signaling server by default. If you're concerned about privacy, you can host your own PeerJS server.</p>
        </div>
        
        <div class="info-section">
          <h3 data-i18n="privacy.openSourceTitle">Open Source & Transparent</h3>
          <p data-i18n="privacy.openSourceDesc">This application is open source. You can review the entire codebase on GitHub to verify how data is handled.</p>
        </div>
        
        <div class="info-section">
          <h3 data-i18n="privacy.dataDeletionTitle">Data Deletion</h3>
          <p data-i18n="privacy.dataDeletionDesc">You can clear all stored data at any time by clearing your browser's local storage or cache for this website.</p>
        </div>
        
        <div class="modal-actions">
          <button id="privacyClose" class="btn-secondary btn-small" type="button" data-i18n="modal.cancel">Close</button>
        </div>
      </div>
    </div>
    `;
  }
}

customElements.define('view-global', ViewGlobal);