<div align="center">

# 🐺 Slay the Werewolf

**A modern digital companion for the classic social deduction game "Lupus in Tabula"**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Made with Vanilla JS](https://img.shields.io/badge/Made%20with-Vanilla%20JS-f7df1e.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![No Dependencies](https://img.shields.io/badge/Dependencies-None-brightgreen.svg)](https://github.com/n0tsosmart/slaythewerewolf)
[![Privacy First](https://img.shields.io/badge/Privacy-First-blue.svg)](https://github.com/n0tsosmart/slaythewerewolf)

[Live Demo](https://n0tsosmart.github.io/slaythewerewolf) • [Report Bug](https://github.com/n0tsosmart/slaythewerewolf/issues) • [Request Feature](https://github.com/n0tsosmart/slaythewerewolf/issues)

</div>

---

## 📖 About

**Slay the Werewolf** is a modern, single-page web application that brings the beloved social deduction game "Lupus in Tabula" (Werewolf/Mafia) to your browser. Choose between **local mode** (pass one device) or **online mode** (WebRTC peer-to-peer) to deal secret role cards to players.

This digital companion handles role distribution, game narration, player tracking, and voting rules, allowing the narrator to focus on creating an immersive storytelling experience.

## ✨ Features

### 🎮 Dual Game Modes

* **Local Game Mode** – Pass a single device around the table for secret card reveals
* **Online Game Mode** – WebRTC-powered peer-to-peer card dealing to remote players
* **Seamless Mode Selection** – Choose your preferred mode from the landing page
* **Session Persistence** – Game state is preserved even after page refresh

### 🎯 Game Setup

* **Flexible Player Count** – Support for 5-24 players
* **Customizable Werewolf Pack** – Choose 1-3 werewolves based on group size
* **Player Name Management** – Add, remove, and reorder players with drag-and-drop
* **Smart Role Unlocking** – Special roles automatically unlock based on player count
* **Role Composition Preview** – See the complete role distribution before dealing
* **Auto-Configuration** – Online mode automatically configures player count based on connected peers

### 🃏 Secret Card Distribution

#### Local Mode
* **Private Card Reveal** – Each player views their role secretly
* **Auto-scroll Protection** – Automatic scrolling prevents accidental reveals
* **Progress Tracking** – Clear indication of which player is viewing their card
* **AI-Generated Artwork** – Beautiful, unique card designs for each role

#### Online Mode (WebRTC)
* **Peer-to-Peer Dealing** – Direct card distribution via WebRTC data channels
* **No Central Server** – Role data never touches external servers
* **Room-Based Sessions** – Create one-time room codes for ephemeral games
* **Encrypted Channels** – WebRTC DTLS/SRTP encryption for role data
* **Role Persistence** – Players can refresh their browser without losing their role
* **Premium UI** – Enhanced role card view with glassmorphism and animations
* **Host Disconnect Handling** – Clients automatically return to mode selection if host drops

### 🎭 Narrator Toolkit

* **Living Players Overview** – Track all active players and their roles
* **Fallen Players Log** – Collapsible history of eliminated players with vote counts
* **Day/Night Cycle Management** – Easy progression through game phases with safety checks
* **Step-by-Step Narration Guide** – Detailed instructions for each phase
* **List/Sequential View Toggle** – Choose between full guide or step-by-step mode
* **Mythomaniac Helper** – Special interface for managing the Mythomaniac role transformation
* **Player Elimination Tools** – Quick actions for managing maulings and lynchings
* **Victory Detection** – Automatic game-end detection with beautiful victory screens

### 📜 Rules & Guidance

* **Voting Procedures** – Built-in modal guide for suspect selection and lynching
* **Tie-Breaking Rules** – Clear instructions for resolving tied votes
* **Roleplay Tips** – Suggestions for players and narrators to enhance immersion
* **Metagame Prevention** – Reminders about fair play and avoiding meta-gaming
* **Accessibility Menu** – Always-available hamburger menu with rules and settings

### 🌍 Internationalization

* **Multi-language Support** – English 🇬🇧, Spanish 🇪🇸, and Italian 🇮🇹
* **Easy Language Switching** – Change language on-the-fly from the menu
* **Fully Translated Interface** – All UI elements, rules, guides, and privacy policy localized
* **Persistent Preference** – Language selection saved to browser

### 🔒 Privacy & Transparency

* **Zero Tracking** – No cookies, no analytics, no external requests
* **Local Storage Only** – Game state persists in your browser LocalStorage
* **Comprehensive Privacy Policy** – Built-in modal explaining data handling
* **WebRTC Transparency** – Detailed explanation of signaling and peer connections
* **Open Source** – Full codebase available for review
* **Data Deletion** – Clear instructions for removing all stored data
* **Offline Ready** – Works without internet (local mode only)

### 🎨 User Experience

* **Modern Glassmorphism Design** – Premium UI with depth and visual effects
* **Responsive Layout** – Works perfectly on desktop, tablet, and mobile
* **Dark Theme** – Eye-friendly dark color scheme with golden accents
* **Smooth Animations** – Micro-interactions and transitions throughout
* **Toast Notifications** – Non-intrusive feedback for user actions
* **Contextual UI** – Restart button hidden during mode selection and role viewing
* **Accessible Controls** – Keyboard navigation and screen reader support

## 🚀 Quick Start

### Option 1: Use the Live Version

Simply visit [https://n0tsosmart.github.io/slaythewerewolf](https://n0tsosmart.github.io/slaythewerewolf) in your browser.

### Option 2: Run Locally

1. **Clone the repository**

   ```bash
   git clone https://github.com/n0tsosmart/slaythewerewolf.git
   cd slaythewerewolf
   ```

2. **Start a local server**

   ```bash
   # Using Python 3
   python -m http.server 8000

   # Or using Python 2
   python -m SimpleHTTPServer 8000

   # Or using Node.js
   npx serve
   ```

3. **Navigate to** `http://localhost:8000`

### Testing Online Mode Locally

1. Open the app in two separate browser windows (or different devices on same network)
2. In window 1, select "Online Game" → "Host Game" and copy the room code
3. In window 2, select "Online Game" → "Join Game" and enter the room code
4. Configure the game in window 1 and click "Deal the cards"
5. Each player receives their secret role card on their device

> **Note**: For internet play across different networks, you'll need to deploy a signaling server. The default PeerJS cloud server works for most cases, but you can also self-host for maximum privacy.

That's it! No build process, no npm install, no configuration needed.

## 📁 Project Structure

```
slaythewerewolf/
├── index.html                    # Main HTML entry point
├── css/
│   ├── animations.css           # Keyframe animations
│   ├── colors.css               # Color variables and theme
│   ├── components.css           # UI component styles
│   ├── layout.css               # Page layout and structure
│   ├── panels.css               # Panel-specific styles
│   ├── styles.css               # Main stylesheet
│   └── utilities.css            # Utility classes
├── js/
│   ├── app.js                   # Application entry point
│   ├── translations.js          # i18n strings (en, es, it)
│   ├── components/              # Web Components
│   │   ├── AppHeader.js         # App header component
│   │   ├── GlobalControls.js    # Menu and restart button
│   │   ├── ViewClientRole.js    # Online player role view
│   │   ├── ViewFinal.js         # Victory screen
│   │   ├── ViewGlobal.js        # Modals and footer
│   │   ├── ViewLanding.js       # Mode selection screen
│   │   ├── ViewLobby.js         # Online lobby management
│   │   ├── ViewReveal.js        # Local card reveal
│   │   ├── ViewSetup.js         # Game configuration
│   │   └── ViewSummary.js       # Narrator tools
│   └── modules/                 # Core logic modules
│       ├── config.js            # Game constants
│       ├── dom.js               # DOM element references
│       ├── engine.js            # Main game engine
│       ├── i18n.js              # Internationalization
│       ├── logic.js             # Game logic (victory, mythomaniac)
│       ├── network.js           # WebRTC/PeerJS handling
│       ├── reveal.js            # Card reveal logic
│       ├── roles.js             # Role definitions and deck
│       ├── setup.js             # Setup helpers
│       ├── state.js             # Global game state
│       ├── store.js             # LocalStorage persistence
│       └── utils.js             # UI utilities
├── assets/
│   ├── images/                  # Role card artwork
│   └── favicon.ico              # Site favicon
├── LICENSE                      # MIT License
└── README.md                    # This file
```

## 🛠️ Technical Details

### Technology Stack

* **HTML5** – Semantic markup with Web Components
* **CSS3** – Modern styling with custom properties, gradients, and animations
* **Vanilla JavaScript (ES6+)** – No frameworks, no build tools
* **LocalStorage API** – Client-side state persistence
* **PeerJS** – WebRTC abstraction for peer-to-peer connections
* **Web Components** – Custom elements for modular UI

### Architecture

* **Component-Based UI** – Each view is a custom Web Component
* **Modular Architecture** – Clear separation of concerns
* **Event-Driven** – Reactive updates via event listeners
* **State Management** – Centralized state with persistence
* **Progressive Enhancement** – Works without JavaScript for basic content

### Browser Support

* **Modern Browsers** – Chrome, Firefox, Safari, Edge (latest versions)
* **WebRTC Support** – Required for online mode only
* **LocalStorage** – Required for state persistence
* **ES6 Modules** – Native module support required

### Security & Privacy

#### Local Mode
* All data stored in browser LocalStorage
* No external requests after initial load
* Works completely offline

#### Online Mode (WebRTC)
* **Signaling**: Minimal metadata exchange (SDP/ICE) via PeerJS cloud server
* **Role Data**: Transmitted directly peer-to-peer via encrypted DataChannels
* **Encryption**: DTLS/SRTP provided by WebRTC
* **Ephemeral**: No server-side storage of game data
* **Transparent**: Full privacy policy available in-app

## 🔧 Development

### Code Style

* **Modular JavaScript** – ES6 modules with clear dependencies
* **Semantic HTML** – Web Components with proper ARIA attributes
* **CSS Custom Properties** – Consistent theming via CSS variables
* **Internationalization** – All strings externalized to translations.js
* **Privacy-First** – No external dependencies except PeerJS (optional)

### Adding New Features

1. **Components**: Add new views in `js/components/`
2. **Logic**: Add game logic in `js/modules/`
3. **Styles**: Add component styles in `css/components.css`
4. **Translations**: Add strings to `js/translations.js`
5. **Test**: Verify in all three languages and both game modes

### Project Conventions

* **File Versioning**: CSS/JS files use `?v=x.x.x` for cache busting
* **State Persistence**: All state changes call `persistState()`
* **Translation Keys**: Use dot notation (e.g., `footer.privacy`)
* **DOM Access**: Use getter methods from `dom.js`
* **Event Handling**: Attach in `engine.js` `attachEvents()`

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Test thoroughly** (all languages, both modes, mobile + desktop)
5. **Commit your changes** (`git commit -m 'Add amazing feature'`)
6. **Push to the branch** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request**

### Contribution Ideas

* 🌍 Add new language translations (French, German, Portuguese)
* 🎨 Enhance UI/UX design and animations
* 🎭 Add new special roles with unique mechanics
* 📱 Improve mobile experience and touch interactions
* ♿ Improve accessibility (ARIA, keyboard navigation)
* 📚 Expand documentation and guides
* 🧪 Add automated tests
* 🐛 Fix bugs and performance issues

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

* Inspired by the classic "Lupus in Tabula" card game by dV Giochi
* AI-generated artwork for role cards
* PeerJS library for WebRTC abstraction
* Built with ❤️ and 🌙 by [n0tsosmart](https://github.com/n0tsosmart)

## 📞 Contact & Support

* **Issues**: [GitHub Issues](https://github.com/n0tsosmart/slaythewerewolf/issues)
* **Discussions**: [GitHub Discussions](https://github.com/n0tsosmart/slaythewerewolf/discussions)
* **Author**: [@n0tsosmart](https://github.com/n0tsosmart)

---

<div align="center">

**[⬆ Back to Top](#-slay-the-werewolf)**

Made with 🌙 for werewolf hunters everywhere

</div>
