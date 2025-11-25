# Slay the Werewolf

Slay the Werewolf is a single-page web app that recreates the classic “Lupus in Tabula” experience without physical cards. Add player names, pick how many werewolves you want, unlock special roles when the group is large enough, and secretly hand out cards directly from the browser.

## Features
- **Fast setup** – Add or remove players, tweak the pack size, and enable optional roles only when they’re allowed.
- **Secret dealing** – Each player views their card privately with auto-scroll prompts and reminders to hand the device to the narrator.
- **Narrator toolkit** – Player summary, elimination log, collapsible fallen roster, Mythomaniac helper, and a narration guide that works in list or step-by-step mode.
- **Voting & Rules** – Built-in guides for voting procedures, tie-breaking, and roleplay tips to keep the game immersive.
- **Local persistence** – Game state lives in `localStorage`, so a refresh won’t ruin the session.
- **Translations** – English, Spanish, and Italian interfaces ship by default.

## Project Structure
- `index.html` – The main entry point and UI structure.
- `js/app.js` – Core game logic, state management, and UI interactions.
- `js/translations.js` – Localization strings for all supported languages.
- `css/styles.css` – Custom styling for the application.

## Development
This project is built with **Vanilla HTML, CSS, and JavaScript**. There are no build steps, bundlers, or external dependencies required to run the core application.

## Privacy & License
- The app **doesn’t use cookies, trackers, or remote storage**—everything stays inside your browser.
- Released under the **MIT License** by **n0tsosmart**.

## Feedback
Have suggestions or want to contribute? Open an issue or pull request on [GitHub](https://github.com/n0tsosmart/slaythewerewolf).
# slaythewerewolf
