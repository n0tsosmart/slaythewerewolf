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
- **Flexible Player Count** – Support for 5-24 players
- **Customizable Werewolf Pack** – Choose 1-3 werewolves based on group size
- **Player Name Management** – Add, remove, and reorder players with persistent storage
- **Smart Role Unlocking** – Special roles automatically unlock based on player count
- **Role Composition Preview** – See the complete role distribution before dealing

### 🃏 Secret Card Distribution
- **Private Card Reveal** – Each player views their role secretly
- **Auto-scroll Protection** – Automatic scrolling prevents accidental reveals
- **Progress Tracking** – Clear indication of which player is viewing their card
- **Handoff Reminders** – Prompts to pass the device to the narrator after all cards are dealt
- **AI-Generated Artwork** – Beautiful, unique card designs for each role

### 🎭 Narrator Toolkit
- **Living Players Overview** – Track all active players and their roles
- **Fallen Players Log** – Collapsible history of eliminated players
- **Day/Night Cycle Management** – Easy progression through game phases
- **Step-by-Step Narration Guide** – Detailed instructions for each phase
- **List/Sequential View Toggle** – Choose between full guide or step-by-step mode
- **Mythomaniac Helper** – Special interface for managing the Mythomaniac role transformation

### 📜 Rules & Guidance
- **Voting Procedures** – Built-in guide for suspect selection and lynching
- **Tie-Breaking Rules** – Clear instructions for resolving tied votes
- **Roleplay Tips** – Suggestions for players and narrators to enhance immersion
- **Metagame Prevention** – Reminders about fair play and avoiding meta-gaming

### 🌍 Internationalization
- **Multi-language Support** – English, Spanish, and Italian
- **Easy Language Switching** – Change language on-the-fly from the menu
- **Fully Translated Interface** – All UI elements, rules, and guides localized

### 🔒 Privacy & Performance
- **Zero Tracking** – No cookies, analytics, or external requests
- **Local Storage Only** – Game state persists in your browser
- **Offline Ready** – Works without internet connection after initial load
- **Lightweight** – Pure vanilla JavaScript with no frameworks or dependencies
- **Responsive Design** – Works on desktop, tablet, and mobile devices

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

That's it! No build process, no npm install, no configuration needed.

## 🎯 How to Play

1. **Setup Phase**
   - Enter the number of players (5-24)
   - Choose how many werewolves (1-3)
   - Optionally add player names
   - Select special roles (unlocked based on player count)
   - Review role composition
   - Click "Deal the cards"

2. **Card Distribution**
   - Pass the device to each player in turn
   - Each player taps to reveal their secret role
   - Players should memorize their role and tap "Next player"
   - After all cards are dealt, hand the device to the narrator

3. **Game Play**
   - Narrator uses the summary view to track all players and roles
   - Follow the narration guide for each day/night phase
   - Use the voting rules guide for suspect selection and lynching
   - Mark players as eliminated when they fall
   - Continue until werewolves or villagers win

## 📁 Project Structure

```
slaythewerewolf/
├── index.html              # Main HTML structure
├── css/
│   └── styles.css          # Application styling (versioned)
├── js/
│   ├── app.js              # Core game logic and state management
│   └── translations.js     # Localization strings (en, es, it)
├── assets/
│   ├── logo.png            # Application logo
│   ├── favicon.ico         # Browser favicon
│   ├── cards/              # Role card artwork
│   └── backgrounds/        # Background images
├── LICENSE                 # MIT License
└── README.md              # This file
```

## 🛠️ Technical Details

### Technology Stack
- **HTML5** – Semantic markup with accessibility features
- **CSS3** – Modern styling with custom properties and animations
- **Vanilla JavaScript** – No frameworks, no dependencies
- **LocalStorage API** – Client-side state persistence

## 🔧 Development

### Code Style
- **Semantic HTML** – Proper use of semantic elements and ARIA attributes
- **CSS Custom Properties** – Consistent theming through CSS variables
- **Modular JavaScript** – Clear separation of concerns in app.js
- **Internationalization** – All user-facing strings in translations.js

### Adding a New Language

1. Open `js/translations.js`
2. Add a new language object following the existing structure
3. Update the language selector in `index.html`
4. Test all UI elements in the new language

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Test thoroughly** across different browsers
5. **Commit your changes** (`git commit -m 'Add amazing feature'`)
6. **Push to the branch** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request**

### Contribution Ideas
- 🌍 Add new language translations
- 🎨 Improve UI/UX design
- 🎭 Add new special roles
- 📱 Enhance mobile experience
- ♿ Improve accessibility
- 📚 Expand documentation
- 🐛 Fix bugs

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the classic "Lupus in Tabula" card game
- AI-generated artwork for role cards
- Built with ❤️ by [n0tsosmart](https://github.com/n0tsosmart)

## 📞 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/n0tsosmart/slaythewerewolf/issues)
- **Discussions**: [GitHub Discussions](https://github.com/n0tsosmart/slaythewerewolf/discussions)
- **Author**: [@n0tsosmart](https://github.com/n0tsosmart)

---

<div align="center">

**[⬆ Back to Top](#-slay-the-werewolf)**

Made with 🌙 for werewolf hunters everywhere

</div>
