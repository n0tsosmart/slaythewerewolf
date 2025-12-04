# 🚀 Slay the Werewolf - Improvement Roadmap

This document outlines potential improvements and enhancements for the Slay the Werewolf project. These suggestions are organized by priority and category to help guide future development.

---

## ✅ Completed Improvements

### 1. Testing Infrastructure ✅ **COMPLETED** (December 2025)

**Status:** Fully implemented with Vitest framework.

**What was implemented:**
- ✅ **Unit tests** for core game logic:
  - `logic.js` - Mythomaniac mechanics (15 tests)
  - `roles.js` - Card creation and deck management (7 tests)
  - `i18n.js` - Translation system (14 tests)
  - `utils.js` - Utility functions (16 tests)
- ✅ **Integration tests** for state persistence (5 tests)
- ✅ **57 total tests** with 100% pass rate
- ✅ **Test coverage reporting** configured
- ✅ **CI-ready** configuration (runs in ~550ms)
- ✅ **Documentation** - [TESTING.md](TESTING.md) guide created
- ✅ **Watch mode** and browser UI support

**Commands:**
```bash
npm test              # Run all tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
```

**Benefits achieved:**
- Automated bug detection before deployment
- Confident refactoring capability
- Living documentation for core modules
- Foundation for future E2E tests

**Next steps:**
- Add E2E tests for game flows (setup → reveal → summary)
- Add E2E tests for online mode with WebRTC
- Integrate with GitHub Actions for CI

---

### 2. PWA (Progressive Web App) Support ✅ **COMPLETED** (December 2025)

**Status:** Fully implemented with offline support and mobile optimizations.

**What was implemented:**
- ✅ **Web App Manifest** with theme colors and icons
- ✅ **Service Worker** for offline caching and asset management
- ✅ **Installable** on iOS and Android devices
- ✅ **Mobile viewport fixes** - No black bars on notched devices
- ✅ **Themed app icons** with dark red background (#0a0404)
- ✅ **Safe-area-insets** for iPhone X+ and Android notches
- ✅ **iOS status bar** set to black-translucent
- ✅ **Offline support** for local mode gameplay

**Features:**
- Standalone app experience (no browser UI)
- Instant load times after first visit
- Works offline for local mode
- Custom splash screen with theme colors
- Professional branded icons

**Files created:**
- `manifest.json` - PWA configuration
- `sw.js` - Service worker with cache-first strategy
- `js/modules/pwa.js` - Installation prompt handler
- `assets/icons/` - 5 app icons (512x512, 192x192, 180x180, 32x32, 16x16)

**Benefits achieved:**
- Native-like app experience
- No black bars on mobile devices
- Reduced bandwidth usage
- Better performance on slow connections
- Professional appearance on home screens

**Next steps:**
- Add custom install prompt UI
- Implement update notifications
- Add background sync for online mode
- Push notifications (opt-in)

---

## 🎯 High Priority Improvements

### 3. Build Process & Code Optimization


While the "no build step" philosophy is great for simplicity, a production build process would provide significant benefits.

**Recommendations:**
- **Minification** for production (smaller file sizes, faster load times)
- **Tree shaking** (removing unused code)
- **CSS autoprefixing** for better browser compatibility
- **TypeScript** or **JSDoc** for type safety (catch bugs at development time)
- **Source maps** for easier debugging in production

**Implementation:**
- Keep development as-is (no build needed)
- Use **Vite** or **esbuild** for production builds only
- Add npm scripts: `npm run dev` (current behavior) and `npm run build` (optimized output)

---

### 3. Accessibility (A11y) Enhancements

While there are some ARIA attributes, there's significant room for improvement.

**Current Gaps:**
- Limited keyboard navigation support
- Inconsistent focus management
- Missing screen reader announcements for dynamic content
- Some color contrast issues

**Recommendations:**
- **Focus management** for modals and view transitions
- **Keyboard navigation** for drag-and-drop player lists (arrow keys + space)
- **Screen reader announcements** for:
  - Game state changes (day/night transitions)
  - Player eliminations
  - Victory conditions
- **Color contrast** verification against WCAG AA standards
- **Reduced motion** support (`prefers-reduced-motion` media query)
- **Skip links** for keyboard users
- **ARIA live regions** for dynamic game updates

**Testing:**
- Use tools like **axe DevTools**, **Lighthouse**, **NVDA**, or **VoiceOver**

---

### 4. Error Handling & Recovery

Improve resilience and user experience when things go wrong.

**Recommendations:**
- **Global error boundary** to catch unexpected JavaScript errors
- **Offline detection** with graceful fallbacks and user notifications
- **Retry logic** for WebRTC connection failures
- **State validation** on restore from localStorage:
  - Handle corrupted data
  - Validate schema versions
  - Provide migration paths for breaking changes
- **Better error messages** (user-friendly, actionable)
- **Error reporting** (optional, privacy-respecting analytics)

---

## 🚀 Feature Enhancements

### 5. Enhanced Online Mode

Improve the WebRTC multiplayer experience.

**Current Limitations:**
- Disconnect = game over (no reconnection)
- Host disconnect ends the game for everyone
- No spectator support

**Recommendations:**
- **Reconnection logic** for dropped peers:
  - Store role assignments in host state
  - Allow clients to rejoin with same peerId
  - Restore their role card on reconnect
- **Host migration**:
  - If host disconnects, elect a new host (oldest peer)
  - Transfer game state to new host
- **Spectator mode**:
  - Allow eliminated players to watch
  - Join as observer without receiving a role
- **Optional voice chat** via WebRTC audio channels
- **Better connection status indicators**
- **Latency/quality metrics** for troubleshooting

---

### 7. Game History & Analytics

Track games and provide insights.

**Recommendations:**
- **Game logs** saved to localStorage:
  - Date/time of game
  - Player names and roles
  - Elimination order
  - Winner (team)
  - Number of days survived
- **Statistics dashboard**:
  - Win rates by role
  - Most played roles
  - Average game length
  - Player participation history
- **Export/share results**:
  - JSON download for record-keeping
  - Shareable summary (text format)
  - Optional social media sharing

**Privacy:**
- All data stored locally
- Opt-in export only
- Clear data deletion option

---

## 🎨 UX/UI Improvements

### 8. Better Mobile Experience

Enhance touch interactions and mobile-specific features.

**Recommendations:**
- **Touch-optimized drag-and-drop**:
  - Long-press to start drag
  - Visual feedback during drag
  - Haptic feedback (vibration)
- **Gesture support**:
  - Swipe gestures for navigation
  - Pull-to-refresh for reconnection
- **iOS Safari testing**:
  - WebRTC compatibility
  - Viewport height issues (address bar)
  - PWA install behavior
- **Mobile-first player elimination UI**:
  - Larger tap targets
  - Swipe-to-eliminate gestures
- **Landscape/portrait optimizations**

---

### 9. Animation Polish

Add more delightful micro-interactions.

**Recommendations:**
- **Loading states** for async operations (connecting to peers, dealing cards)
- **Skeleton screens** during game initialization
- **Haptic feedback** for mobile:
  - Button presses
  - Role reveal
  - Eliminations
- **Transition animations** between views (smoother, more branded)
- **Particle effects** for special moments:
  - Victory screen confetti
  - Elimination animations
- **Progress indicators** for multi-step processes

---

### 10. Customization Options

Give users more control over their experience.

**Recommendations:**
- **Custom role creation** (advanced feature):
  - Define role name, team, and abilities
  - Upload custom artwork
  - Save/share custom role packs
- **Visual themes**:
  - Dark/light mode toggle
  - Additional theme packs (beyond Werewolf/Mafia)
  - Custom color schemes
- **Sound effects** (optional, with mute toggle):
  - Ambient night/day sounds
  - Card reveal sound
  - Elimination sound
  - Victory fanfare
- **Game rules variants**:
  - Different voting rules
  - Werewolf reveal variants
  - Custom narration scripts

---

## 🛠️ Code Quality & Maintainability

### 11. Code Organization

The codebase is well-structured, but `engine.js` is too large.

**Current Issue:**
- `js/modules/engine.js` is **1,573 lines** – this is difficult to maintain

**Recommendations:**
Split `engine.js` into focused modules:
- `game-flow.js` – State transitions, game lifecycle
- `narrator.js` – Narrator-specific UI and logic
- `elimination.js` – Player elimination logic
- `ui-updates.js` – DOM manipulation and rendering
- `event-handlers.js` – Event attachment and delegation
- `view-manager.js` – View switching and visibility

**Benefits:**
- Easier to understand and modify
- Better code reusability
- Simpler testing
- Reduced merge conflicts

---

### 12. Documentation

Improve developer onboarding and code understanding.

**Recommendations:**
- **JSDoc comments** for all public functions:
  - Parameters, return types
  - Usage examples
  - Edge cases
- **Developer guide**:
  - Architecture overview
  - How to add new roles
  - State machine explanation
  - Event flow diagrams
- **WebRTC flow documentation**:
  - Sequence diagrams
  - Signaling process
  - Data channel usage
- **API documentation** (if exposing any public APIs)
- **Contribution guide** (beyond README)

---

### 13. Performance Optimization

Ensure smooth performance across devices.

**Recommendations:**
- **Lazy loading** for components:
  - Load views only when needed
  - Dynamic imports for large modules
- **Debouncing/throttling** for event handlers:
  - Window resize events
  - Scroll handlers
  - Input validation
- **RequestAnimationFrame** for smooth animations
- **Memory leak audits**:
  - WebRTC connections cleanup
  - Event listener removal
  - setInterval/setTimeout cleanup
- **Bundle size analysis**:
  - Identify large dependencies
  - Consider alternatives or tree-shaking
- **Image optimization**:
  - WebP format with fallbacks
  - Lazy loading role card images
  - Appropriate sizing/compression

---

## 🔐 Security & Privacy

### 14. Content Security Policy (CSP)

Add protection against XSS attacks.

**Recommendation:**
Add a CSP meta tag or HTTP header:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' https://unpkg.com; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data:;">
```

**Benefits:**
- Prevents inline script execution
- Blocks unauthorized external resources
- Mitigates XSS risks

---

### 15. Input Sanitization

Validate and sanitize all user inputs.

**Recommendations:**
- **Player names**:
  - Sanitize HTML to prevent XSS
  - Limit length (prevent UI breaks)
  - Validate characters (prevent injection)
- **Room codes**:
  - Validate format
  - Prevent injection attacks
- **LocalStorage data**:
  - Validate on restore
  - Schema versioning
  - Sanitize before rendering

---

## 📦 Developer Experience

### 16. Linting & Formatting

Ensure consistent code style across the project.

**Recommendations:**
- **ESLint** for JavaScript linting:
  - Recommended: `eslint-config-airbnb-base` or `standard`
  - Custom rules for project conventions
- **Prettier** for automatic formatting:
  - Consistent indentation, quotes, semicolons
  - Integrates with ESLint
- **Pre-commit hooks** (Husky + lint-staged):
  - Auto-format on commit
  - Run linting before push
  - Prevent commits with errors

---

### 17. CI/CD Pipeline

Automate testing and deployment.

**Recommendations:**
Set up **GitHub Actions** for:
- **Continuous Integration**:
  - Run tests on every commit
  - Linting and formatting checks
  - Build verification
- **Continuous Deployment**:
  - Automated deployments to GitHub Pages
  - Version bumping
  - Release notes generation
- **Pull Request checks**:
  - Code coverage reports
  - Visual regression testing
  - Accessibility audits

---

## 🌍 Additional Features

### 18. More Languages

Expand international support beyond EN/ES/IT.

**Recommendations:**
- **French** 🇫🇷 (large player base)
- **German** 🇩🇪 (popular in Central Europe)
- **Portuguese** 🇵🇹 (Brazilian and Portuguese markets)
- **Russian** 🇷🇺
- **Japanese** 🇯🇵
- **Polish** 🇵🇱

**Implementation:**
- Community contributions
- Professional translation services
- Crowdsourced translation platform (e.g., Crowdin)

---

### 19. Accessibility of Rules

Make the game easier to learn.

**Recommendations:**
- **In-game tutorial** or interactive onboarding:
  - Step-by-step walkthrough
  - Practice mode
- **Video tutorials** embedded in the app:
  - How to play (local mode)
  - How to host (online mode)
  - Narrator tips
- **Role ability tooltips** in setup screen
- **Glossary** of game terms

---

### 20. Social Features

Make it easier to share and invite.

**Recommendations:**
- **Share button** to invite friends:
  - Generate shareable link with room code
  - Copy to clipboard
  - Native share API on mobile
- **QR code generation** for easy room joining:
  - Host displays QR code
  - Clients scan to join
- **Embed support**:
  - Allow game to be embedded in other sites
  - iframe-friendly
- **Social media meta tags**:
  - Open Graph for Facebook/Discord
  - Twitter Cards
  - Rich link previews

---

## 🎁 Quick Wins (Easy to Implement)

These are small improvements that can be done quickly with high impact:

1. **Add comprehensive favicons**:
   - apple-touch-icon for iOS
   - favicon-32x32, favicon-16x16
   - Android chrome icons
   - manifest icons

2. **Add meta tags** for better social sharing:
   - Open Graph (Facebook, Discord)
   - Twitter Cards
   - Description and keywords

3. **Add a changelog** (`CHANGELOG.md`):
   - Track version history
   - Document breaking changes
   - Keep users informed

4. **Add keyboard shortcuts**:
   - `N` - Advance to next day
   - `R` - Restart game
   - `M` - Open menu
   - `Esc` - Close modals
   - `?` - Show keyboard shortcuts

5. **Add a "Back to Top" button**:
   - For long narrator guides
   - Smooth scroll animation
   - Show/hide based on scroll position

6. **Add loading splash screen**:
   - Show while app initializes
   - Branded animation
   - Progress indicator

7. **Add copy-to-clipboard buttons**:
   - Room code
   - Game summary
   - Player list

8. **Add confirmation for destructive actions**:
   - Ensure all critical actions (reset, leave game) have warnings

9. **Add browser compatibility warnings**:
   - Detect old browsers
   - Suggest modern alternatives
   - WebRTC feature detection

10. **Add version display in footer**:
    - Show current version number
    - Link to changelog
    - Update notification

---

## 📊 Summary: Top 5 Priorities

If you want to focus on the most impactful improvements, start with these:

### ~~1. Add Automated Testing~~ ✅ **COMPLETED**
   - **Status:** Implemented with Vitest (57 tests, 100% pass rate)
   - **See:** [TESTING.md](../TESTING.md) for usage guide

### ~~2. Make it a PWA~~ ✅ **COMPLETED**
   - **Status:** Fully implemented with offline support and mobile optimizations
   - **See:** Walkthrough for implementation details

### 3. **Refactor `engine.js`** 🛠️
   - **Why:** Improve maintainability, easier to understand and modify
   - **Effort:** High
   - **Impact:** Medium (long-term)

### 4. **Add Accessibility Improvements** ♿
   - **Why:** Reach more users, legal compliance, better UX for all
   - **Effort:** Medium
   - **Impact:** High

### 5. **Improve WebRTC Reliability** 🌐
   - **Why:** Better online experience, fewer frustrations
   - **Effort:** High
   - **Impact:** High

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
