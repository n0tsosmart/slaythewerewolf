<div align="center">

# 🐺 Slay the Werewolf

**A digital companion for the classic social deduction game "Lupus in Tabula"**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Made with Vanilla JS](https://img.shields.io/badge/Made%20with-Vanilla%20JS-f7df1e.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![No Dependencies](https://img.shields.io/badge/Dependencies-None-brightgreen.svg)](https://github.com/n0tsosmart/slaythewerewolf)
[![Privacy First](https://img.shields.io/badge/Privacy-First-blue.svg)](https://github.com/n0tsosmart/slaythewerewolf)

[Live Demo](https://n0tsosmart.github.io/slaythewerewolf) • [Report Bug](https://github.com/n0tsosmart/slaythewerewolf/issues) • [Request Feature](https://github.com/n0tsosmart/slaythewerewolf/issues)

</div>

---

## 📖 About

**Slay the Werewolf** is a modern, single-page web application that brings the beloved social deduction game "Lupus in Tabula" (Werewolf/Mafia) to your browser. No physical cards needed—just gather your friends, open the app, and let the mystery unfold.

This digital companion handles role distribution, game narration, player tracking, and voting rules, allowing the narrator to focus on creating an immersive storytelling experience.

## ✨ Features

### 🎮 Game Setup

* **Flexible Player Count** – Support for 5-24 players
* **Customizable Werewolf Pack** – Choose 1-3 werewolves based on group size
* **Player Name Management** – Add, remove, and reorder players with persistent storage
* **Smart Role Unlocking** – Special roles automatically unlock based on player count
* **Role Composition Preview** – See the complete role distribution before dealing

### 🃏 Secret Card Distribution

* **Private Card Reveal** – Each player views their role secretly
* **Auto-scroll Protection** – Automatic scrolling prevents accidental reveals
* **Progress Tracking** – Clear indication of which player is viewing their card
* **Handoff Reminders** – Prompts to pass the device to the narrator after all cards are dealt
* **AI-Generated Artwork** – Beautiful, unique card designs for each role

### 🌐 Online WebRTC Card Dealing (New)

* **Peer-to-peer dealing**: deal private role cards to remote players using WebRTC data channels — no central game-state server required for card distribution.
* **Signaling + optional TURN**: minimal signaling server required to exchange SDP/ICE candidates (example `signaling/simple-signaling.js` included). Use a TURN server for reliable connectivity on restrictive networks.
* **Room-based ephemeral sessions**: create one-time room IDs; cards are generated per-session and not persisted on any server.
* **Client-only encryption & privacy**: role payloads are transmitted over encrypted WebRTC channels (DTLS/SRTP). The app minimizes server-side exposure — signaling messages do not contain role data.
* **Fallback flow**: if p2p fails, the app falls back to local-only dealing (pass-and-reveal) so games are never blocked.

> Implementation notes (short): cards are assigned on the narrator's client, serialized, and sent via WebRTC data channels to each peer. Signaling only exchanges connection metadata. For full end-to-end guarantees in hostile environments, enable Insertable Streams (browser support dependent) or implement application-level encryption before sending.

### 🎭 Narrator Toolkit

* **Living Players Overview** – Track all active players and their roles
* **Fallen Players Log** – Collapsible history of eliminated players
* **Day/Night Cycle Management** – Easy progression through game phases
* **Step-by-Step Narration Guide** – Detailed instructions for each phase
* **List/Sequential View Toggle** – Choose between full guide or step-by-step mode
* **Mythomaniac Helper** – Special interface for managing the Mythomaniac role transformation

### 📜 Rules & Guidance

* **Voting Procedures** – Built-in guide for suspect selection and lynching
* **Tie-Breaking Rules** – Clear instructions for resolving tied votes
* **Roleplay Tips** – Suggestions for players and narrators to enhance immersion
* **Metagame Prevention** – Reminders about fair play and avoiding meta-gaming

### 🌍 Internationalization

* **Multi-language Support** – English, Spanish, and Italian
* **Easy Language Switching** – Change language on-the-fly from the menu
* **Fully Translated Interface** – All UI elements, rules, and guides localized

### 🔒 Privacy & Performance

* **Zero Tracking** – No cookies, analytics, or external requests (signaling excluded by choice)
* **Local Storage Only** – Game state persists in your browser
* **Offline Ready** – Works without internet connection after initial load (local mode)
* **Lightweight** – Pure vanilla JavaScript with no frameworks or dependencies
* **Responsive Design** – Works on desktop, tablet, and mobile devices

## 🚀 Quick Start

### Option 1: Use the Live Version

Simply visit [https://n0tsosmart.github.io/slaythewerewolf](https://n0tsosmart.github.io/slaythewerewolf) in your browser.

### Option 2: Run Locally

1. **Clone the repository**

   ```bash
   git clone https://github.com/n0tsosmart/slaythewerewolf.git
   cd slaythewerewolf
   ```

2. **Open in browser**

   ```bash
   # Using Python 3
   python -m http.server 8000

   # Or using Python 2
   python -m SimpleHTTPServer 8000

   # Or using Node.js
   npx serve
   ```

3. **Navigate to** `http://localhost:8000`

#### Quick test for WebRTC dealing (local)

1. Open the live app in two separate browser windows (or use another device on the same network).
2. In one window, create a room (Narrator) and copy the generated room ID.
3. In the other window, join the room using the room ID.
4. Use the "Deal Online" button in the setup flow to send private role cards to connected peers.

> For real internet play, deploy the included `signaling/simple-signaling.js` to a minimal Node host and configure STUN/TURN credentials.

That's it! No build process, no npm install, no configuration needed for local testing.

## 📁 Project Structure

```
slaythewerewolf/
├── index.html              # Main HTML structure
├── css/
│   └── ...                 # Application styling files
├── js/
│   ├── app.js              # Main application entry point (ES Module)
│   ├── translations.js     # Localization strings (en, es, it)
│   ├── webrtc.js           # NEW: WebRTC helpers (signaling hooks, datachannel helpers)
│   └── modules/            # Core game logic and state management modules
│       ├── config.js       # Global constants and configuration
│       ├── dom.js          # DOM element references
│       ├── engine.js       # Core game engine and event handling
│       ├── i18n.js         # Internationalization functions
│       ├── logic.js        # Pure game logic functions (e.g., Mythomaniac, victory conditions)
│       ├── reveal.js       # Role revelation phase logic
│       ├── roles.js        # Role creation and deck management
│       ├── setup.js        # Game setup and player management
│       ├── state.js        # Global game state
│       ├── store.js        # LocalStorage persistence logic
│       └── utils.js        # Utility functions and UI enhancements
├── signaling/              # Optional helper for deploying the minimal signaling server
│   └── simple-signaling.js
├── assets/
│   └── ...                 # Images, favicons, card artwork
├── LICENSE                 # MIT License
└── README.md               # This file
```

## 🛠️ Technical Details

### Technology Stack

* **HTML5** – Semantic markup with accessibility features
* **CSS3** – Modern styling with custom properties and animations
* **Vanilla JavaScript** – No frameworks, no dependencies
* **LocalStorage API** – Client-side state persistence
* **WebRTC (DataChannels)** – Peer-to-peer transport for online dealing

### Security & Privacy Notes

* Signaling messages are metadata-only (SDP/ICE). Role payloads are not sent via the signaling server.
* DataChannels use DTLS/SRTP encryption provided by WebRTC — keep your signaling server minimal and ephemeral to reduce surface area.
* For hostile threat models (malicious network operators), enable application-level encryption (pre-shared keys) or Insertable Streams where supported.

## 🔧 Development

### Code Style

* **Semantic HTML** – Proper use of semantic elements and ARIA attributes
* **CSS Custom Properties** – Consistent theming through CSS variables
* **Modular JavaScript** – Clear separation of concerns in app.js
* **Internationalization** – All user-facing strings in translations.js

### Adding/Testing WebRTC Dealing

1. Review `js/webrtc.js` for the public API (`createRoom`, `joinRoom`, `onPeerConnected`, `dealToPeer`).
2. Run the app locally and test across multiple windows/devices on the same network.
3. For internet tests, deploy `signaling/simple-signaling.js` to a small Node host and configure STUN/TURN servers.

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/online-deal`)
3. **Make your changes**
4. **Test thoroughly** across different browsers and network conditions
5. **Commit your changes** (`git commit -m 'Add WebRTC card dealing'`)
6. **Push to the branch** (`git push origin feature/online-deal`)
7. **Open a Pull Request**

### Contribution Ideas

* 🌍 Add new language translations
* 🎨 Improve UI/UX design
* 🎭 Add new special roles
* 📱 Enhance mobile experience
* ♿ Improve accessibility
* 📚 Expand documentation
* 🐛 Fix bugs

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

* Inspired by the classic "Lupus in Tabula" card game
* AI-generated artwork for role cards
* Built with ❤️ by [n0tsosmart](https://github.com/n0tsosmart)

## 📞 Contact & Support

* **Issues**: [GitHub Issues](https://github.com/n0tsosmart/slaythewerewolf/issues)
* **Discussions**: [GitHub Discussions](https://github.com/n0tsosmart/slaythewerewolf/discussions)
* **Author**: [@n0tsosmart](https://github.com/n0tsosmart)

---

<div align="center">

**[⬆ Back to Top](#-slay-the-werewolf)**

Made with 🌙 for werewolf hunters everywhere

</div>
