# Slay the Werewolf - Project Context

## Project Overview

**Slay the Werewolf** is a digital companion web application for the social deduction game "Lupus in Tabula" (Werewolf/Mafia). It is designed to run entirely in the browser without a backend, replacing physical cards and helping the narrator manage the game state.

*   **Type:** Single Page Application (SPA) / Client-side Web App.
*   **Core Tech:** Vanilla JavaScript (ES Modules), HTML5, CSS3.
*   **No Build Step:** The project uses native browser features (ES Modules) and requires no bundlers (Webpack, Vite, etc.) or transpilers.
*   **State Management:** Custom centralized state object persisted to `LocalStorage`.

## Directory Structure

The project follows a modular architecture:

```
/
├── index.html              # Main application entry point.
├── css/                    # Stylesheets (CSS Variables for theming).
│   ├── styles.css          # Main stylesheet (imports component styles).
│   ├── base.css            # Reset and typography.
│   └── game.css            # Game-specific styles.
├── js/
│   ├── app.js              # Application bootstrapper (ES Module entry).
│   ├── translations.js     # Internationalization dictionaries (en, es, it).
│   └── modules/            # Core business logic.
│       ├── config.js       # Constants and configuration.
│       ├── engine.js       # Main game loop and coordinator.
│       ├── state.js        # State definition and persistence logic.
│       ├── roles.js        # Role definitions and deck generation.
│       ├── logic.js        # Pure functions for game rules (victory, voting).
│       ├── dom.js          # DOM manipulation helpers.
│       └── ...             # Other utility modules.
└── docs/                   # Technical documentation.
```

## Development & Usage

### Running the Application
Since there is no build process, you can serve the project directory using any static file server.

**Examples:**
*   **Python 3:** `python3 -m http.server`
*   **Node.js:** `npx serve`
*   **PHP:** `php -S localhost:8000`

Access the app at `http://localhost:8000` (or the port provided by your server).

### Architecture Highlights

1.  **State Management (`js/modules/state.js`):**
    *   The `state` object holds all game data (players, roles, current day, flags).
    *   It is automatically saved to `LocalStorage` (`SLAY_STATE` key) to preserve progress across reloads.
    *   Direct mutation of `state` is common in this codebase, though some actions are encapsulated.

2.  **Modules (`js/modules/`):**
    *   `engine.js` orchestrates the flow between views (Setup -> Reveal -> Summary -> Final).
    *   `logic.js` contains pure functions for determining victory conditions and complex role interactions (e.g., Mythomaniac transformation).
    *   `roles.js` defines the specific attributes of every character card.

3.  **Internationalization (`js/translations.js`):**
    *   The app supports English, Spanish, and Italian.
    *   Text is retrieved using a `t()` helper function.

### Key Files
*   `index.html`: Contains all the markup for the different views (`#setupView`, `#revealView`, `#summaryView`, `#finalView`), which are toggled via CSS classes.
*   `js/app.js`: The "main" function. It loads the config, initializes the engine, and logs the startup.
*   `js/modules/logic.js`: Critical logic for determining if the game is over or how special roles act.

## Contribution Guidelines
*   **Style:** Adhere to the existing Vanilla JS style. Use ES Modules for new logic.
*   **CSS:** Use the CSS variables defined in `css/base.css` for colors and spacing to maintain consistency.
*   **Versioning:** When updating CSS or JS files, remember to update the query string version (e.g., `?v=1.0.7`) in `index.html` to bust browser caches.
