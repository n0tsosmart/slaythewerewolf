# 🚀 Slay the Werewolf - Improvement Ideas

This document outlines potential improvements and enhancements for the Slay the Werewolf project, identified after a comprehensive codebase review.

---

## 💡 Code Quality & Technical Debt

### 1. CSS Organization & Maintainability

**Current Issues:**
- The `css/` folder has 9 separate files, but `styles.css` (24KB) and `components.css` (16KB) are quite large
- Some styling duplicated between `base.css`, `styles.css`, and `game.css`
- ~~CSS version numbers in `index.html` are inconsistent with cache versions in `sw.js`~~ ✅ **FIXED**
- ~~Duplicate favicon link in `index.html` (line 6 and line 34)~~ ✅ **FIXED**

**What was fixed (December 2024):**
- ✅ Removed duplicate favicon link outside `<html>` tag
- ✅ Synchronized all version numbers to `v=1.1.5` across:
  - `index.html` (CSS, JS, translations, PWA modules)
  - `sw.js` (cache name and asset URLs)

**Remaining Recommendations:**
- **CSS Variables Consolidation**: Move all color definitions into a single `variables.css` file
- **BEM Naming Convention**: Adopt consistent BEM naming (Block__Element--Modifier) for better readability
- **CSS Module Pattern**: Consider splitting large component styles into co-located CSS (e.g., `ViewSetup.css` alongside `ViewSetup.js`)
- **Auto-sync Versions**: Create a build script or pre-commit hook to sync version numbers across HTML, CSS, and service worker files

---

### 2. Engine.js Refactoring 🛠️ ✅ **COMPLETED**

~~**Current Issue:**~~
~~- `js/modules/engine.js` is **1,627 lines** – this is difficult to maintain and test~~

**What was done (December 2024):**
The monolithic engine.js was split into 9 focused modules:

```
js/modules/engine/
├── index.js           # Main exports and orchestration (~270 lines)
├── views.js           # View switching and visibility (~100 lines)
├── game-lifecycle.js  # startGame, resetGame (~180 lines)
├── narrator.js        # Day cycle, guide steps (~190 lines)
├── mythomaniac.js     # Mythomaniac role handling (~200 lines)
├── elimination.js     # Player elimination, voting (~400 lines)
├── victory.js         # Victory conditions and screens (~230 lines)
├── events.js          # Event attachment (~300 lines)
├── modals.js          # Modal open/close helpers (~85 lines)
└── settings.js        # Language/theme handlers (~120 lines)
```

**Benefits achieved:**
- ✅ Easier to understand and modify individual features
- ✅ Clear separation of concerns
- ✅ Simpler unit testing per module
- ✅ Reduced merge conflicts in team development
- ✅ All 57 existing tests still pass

---

### 3. Translations File Optimization ✅ **COMPLETED**

~~**Current Issue:**~~
~~- `translations.js` is **78KB** (1,099 lines) with all languages in a single file~~

**What was done (December 2024):**
The monolithic translations.js was split into modular files with lazy loading:

```
js/translations/
├── index.js   (2KB)  - Loader with lazy loading logic
├── en.js      (21KB) - English + Mafia overrides (loaded immediately)
├── es.js      (22KB) - Spanish + Mafia overrides (lazy loaded)
└── it.js      (22KB) - Italian + Mafia overrides (lazy loaded)
```

**Implementation:**
- English is loaded immediately with the app
- Spanish and Italian are lazy loaded via `import()` when selected
- `setLanguage()` is now async and awaits language loading
- **~71% reduction in initial bundle** for English users (23KB vs 79KB)

---

### 4. Service Worker Version Sync

**Current Issue:**
- HTML files reference `?v=1.1.4`, `?v=1.1.2`, `?v=1.1.1`
- Service worker uses `CACHE_NAME = 'slay-werewolf-v1.1.0'`
- Manual updates are error-prone

**Quick Fix:**
Create a version constant file that all assets reference:
```javascript
// js/version.js
export const APP_VERSION = '1.2.0';
```

Or use a simple build script:
```bash
# scripts/bump-version.sh
VERSION="1.2.0"
sed -i "s/v=[0-9]\+\.[0-9]\+\.[0-9]\+/v=$VERSION/g" index.html
sed -i "s/slay-werewolf-v[0-9]\+\.[0-9]\+\.[0-9]\+/slay-werewolf-v$VERSION/g" sw.js
```

---

## ✨ New Feature Ideas

### 5. Dark/Light Mode Toggle 🌓

**Current State:**
- App only has dark theme with Werewolf/Mafia variants
- No light mode option for daytime use or accessibility preferences

**Recommendations:**
- Add a **light mode theme** with inverted colors for daytime visibility
- Respect `prefers-color-scheme` media query for automatic switching
- Store preference in localStorage alongside language setting
- Add a **"Follow System"** option in addition to manual toggle

**Implementation:**
```css
/* css/themes/light.css */
:root[data-theme="light"] {
  --bg-primary: #f5f5f5;
  --text-primary: #1a1a1a;
  --accent-color: #b91c1c;
}
```

---

### 6. Turn Timer Feature ⏱️

**Description:**
Add optional turn timers for discussion phases to keep the game moving.

**Features:**
- **Configurable Timer**: 2/3/5 minute options per day phase
- **Visual Countdown**: Circular progress indicator
- **Audio Warning**: 30-second and 10-second alerts (if sounds enabled)
- **Pause/Resume**: Allow narrator to pause mid-discussion
- **Skip Timer**: Option to advance without waiting

**UI Location:**
Add timer controls to the narrator guide section in `ViewSummary.js`.

---

### 7. Role Balancing Assistant ⚖️ ✅ **COMPLETED**

~~**Description:**~~
~~Calculate and display the "balance score" of the current role composition.~~

**What was done (December 2024):**
Added a colored balance indicator badge next to the "Role composition" section:

- **🔴 Favors Wolves** - when wolves are >30% of players
- **🟢 Balanced** - normal game balance  
- **� Favors Village** - when wolves <15% or many village specials selected

**Files modified:**
- `js/modules/setup.js` - Added `calculateBalance()` function
- `js/components/ViewSetup.js` - Added badge element
- `js/modules/dom.js` - Added badge getter
- `css/game.css` - Added badge styling
- Translation files (en/es/it) - Added balance labels

---

### 8. Session Sharing via URL 📤

**Description:**
Generate shareable URLs that encode game configuration for quick setup.

**Example URL:**
```
https://n0tsosmart.github.io/slaythewerewolf#config=eyJwbGF5ZXJzIjo4LCJ3b2x2ZXMiOjIsInNwZWNpYWxzIjpbInNlZXIiLCJtZWRpdW0iXX0=
```

**Benefits:**
- Quick game setup for recurring groups
- Share presets on social media or messaging apps
- No server-side storage needed (all encoded in URL hash)

---

### 9. Sound Effects & Audio 🔊

**Recommended Sound Set:**
- `card-reveal.mp3` – Card flip sound on reveal
- `wolf-howl.mp3` – Night phase transition
- `rooster.mp3` – Dawn announcement
- `dramatic-sting.mp3` – Player elimination
- `fanfare.mp3` – Victory screen

**Considerations:**
- Use Web Audio API for precise timing
- Preload sounds during initial app load
- Provide volume slider (0-100%) in settings
- **Default to muted** to avoid surprising users
- Compress sounds (use MP3/OGG, <50KB each)

---

### 10. Statistics Dashboard 📊

**Track Locally:**
- Games played per week/month
- Win rates by role
- Average game length  
- Most frequently used role compositions
- Personal "streaks" (e.g., 3 wins in a row)

**Visualization:**
Use simple bar charts with pure CSS or inline SVG (no external dependencies).

---

## 🧪 Testing & Quality Assurance

### 11. E2E Testing with Playwright

**Current Gap:**
Testing infrastructure has unit tests (Vitest) but no E2E tests for user flows.

**Recommended Test Scenarios:**
1. **Local Game Flow**: Setup → Deal → Reveal → Summary → Victory
2. **Online Game Flow**: Host creates room → Client joins → Cards dealt
3. **Language Switching**: Verify all translations display correctly
4. **PWA Installation**: Test install prompt and offline mode
5. **Theme Switching**: Werewolf → Mafia → Back

**Configuration:**
```javascript
// playwright.config.js
export default {
  use: {
    baseURL: 'http://localhost:8000',
    viewport: { width: 375, height: 667 }, // Mobile-first
  },
  projects: [
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Desktop Chrome', use: { ...devices['Desktop Chrome'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],
};
```

---

### 12. Accessibility Audit ♿

**Quick Wins:**
- Add `aria-live="polite"` regions for game state announcements
- Ensure all interactive elements have visible focus states
- Add `prefers-reduced-motion` support to disable animations
- Verify color contrast ratios meet WCAG AA standards
- Add keyboard shortcuts documentation (`?` to show help)

**Testing Tools:**
- axe DevTools browser extension
- Lighthouse accessibility audit
- NVDA / VoiceOver manual testing

---

## 📱 PWA & Mobile Improvements

### 13. Install Prompt Optimization

**Current State:**
PWA install button exists in hamburger menu but isn't prominently shown.

**Recommendations:**
- Show a **dismissable bottom banner** on first visit
- Trigger install prompt after first successful game completion
- Track (locally) if user has dismissed the banner
- Show install option in victory screen for returning players

---

### 14. Offline Mode Improvements ✅ **COMPLETED**

~~**Current State:**~~
~~Local mode works offline, but online mode completely fails with no guidance.~~

**What was done (December 2024):**
- **📴 Offline indicator** - Red banner at top of page when offline
- **Disabled Online button** - Grayed out with tooltip when offline
- **Auto-update** - UI updates automatically when connection is restored

**Files:** `js/modules/offline.js` (new), `css/components.css`, translations (en/es/it)

---

### 15. Version Check & Update Prompt

**Issue:**
Service worker updates are automatic, but users may not know when a new version is available.

**Implementation:**
```javascript
// In pwa-init.js
navigator.serviceWorker.addEventListener('controllerchange', () => {
  showToast('New version available! Refresh to update.', {
    action: { label: 'Refresh', onClick: () => location.reload() }
  });
});
```

---

## 📝 Documentation

### 16. Changelog Creation

**Quick Win:** Create `CHANGELOG.md` following [Keep a Changelog](https://keepachangelog.com/) format.

**Template:**
```markdown
# Changelog

All notable changes to Slay the Werewolf.

## [1.2.0] - 2025-12-XX
### Added
- Ghost mode for eliminated players in online games
- Browser compatibility warnings for WebRTC/localStorage
- Mafia Edition theme with adapted terminology

### Fixed
- Mobile viewport issues on notched devices
- Translation missing for Spanish vibration toggle
```

---

### 17. Developer Architecture Guide

**Create:** `docs/ARCHITECTURE.md` covering:
- State management flow diagram
- Component lifecycle and communication
- WebRTC connection flow sequence diagram
- Adding a new role step-by-step guide
- Adding a new language checklist

---

## 📊 Priority Matrix

| Improvement | Effort | Impact | Priority |
|-------------|--------|--------|----------|
| Fix duplicate favicon | 🟢 Low | 🟡 Low | ⭐⭐⭐⭐⭐ |
| Version sync script | 🟢 Low | 🟠 High | ⭐⭐⭐⭐⭐ |
| Create CHANGELOG.md | 🟢 Low | 🟡 Medium | ⭐⭐⭐⭐ |
| Dark/Light mode toggle | 🟡 Medium | 🟠 High | ⭐⭐⭐⭐ |
| Turn timer feature | 🟡 Medium | 🟠 High | ⭐⭐⭐⭐ |
| Split translations file | 🟡 Medium | 🟡 Medium | ⭐⭐⭐ |
| Sound effects | 🟡 Medium | 🟡 Medium | ⭐⭐⭐ |
| E2E tests (Playwright) | 🔴 High | 🟠 High | ⭐⭐⭐ |
| Role balancing tool | 🟡 Medium | 🟡 Medium | ⭐⭐⭐ |
| URL session sharing | 🟢 Low | 🟡 Medium | ⭐⭐⭐ |
| Refactor engine.js | 🔴 High | 🟠 High | ⭐⭐ |
| Statistics dashboard | 🔴 High | 🟡 Medium | ⭐⭐ |
| Architecture docs | 🟡 Medium | 🟡 Medium | ⭐⭐ |

---

## 🎁 Quick Wins (< 1 hour each)

1. ✅ Remove duplicate favicon link in `index.html`
2. ✅ Create version sync script  
3. ✅ Add `CHANGELOG.md`
4. ✅ Add `prefers-reduced-motion` CSS media query
5. ✅ Add keyboard shortcut: `Esc` to close modals
6. ✅ Fix inconsistent button spacing in setup view
7. ✅ Add loading skeleton for lobby player list

---

## 📝 Notes

- This roadmap is a living document and should be updated as the project evolves
- Prioritize based on user feedback and pain points
- Consider creating GitHub issues for each major improvement
- Breaking changes should be carefully planned and communicated
- Always maintain backward compatibility when possible

---

**Last Updated:** 2025-12-04  
**Maintainer:** [@n0tsosmart](https://github.com/n0tsosmart)
