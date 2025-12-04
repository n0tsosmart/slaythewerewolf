# Testing Guide

This document explains how to run and write tests for the Slay the Werewolf project.

## Quick Start

### Running Tests

```bash
# Run all tests once
npm test

# Run tets in watch mode (re-run on file changes)
npm run test:watch

# Run tests with UI (browser-based test runner)
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

Tests are organized in the `tests/` directory:

```
tests/
├── unit/                    # Unit tests for individual modules
│   ├── logic.test.js       # Game logic tests
│   ├── roles.test.js       # Role card tests
│   ├── i18n.test.js        # Translation tests
│   └── utils.test.js       # Utility function tests
└── integration/             # Integration tests
    └── state-persistence.test.js  # LocalStorage persistence tests
```

## Writing Tests

### Basic Test Structure

```javascript
import { describe, it, expect } from 'vitest';
import { myFunction } from '../../js/modules/myModule.js';

describe('myModule.js', () => {
  describe('myFunction', () => {
    it('should do something specific', () => {
      const result = myFunction('input');
      expect(result).toBe('expected output');
    });
  });
});
```

### Using Mocks

When testing modules that depend on other modules, use Vitest's mocking:

```javascript
import { vi } from 'vitest';

vi.mock('../../js/modules/config.js', () => ({
  ROLE_LIBRARY: {
    villager: { id: 'villager', name: 'Villager' },
  },
}));
```

### Testing Async Code

```javascript
it('should handle async operations', async () => {
  const result = await asyncFunction();
  expect(result).toBeDefined();
});
```

## Coverage Reports

After running `npm run test:coverage`, open `coverage/index.html` in your browser to view detailed coverage information.

### Coverage Goals

- **Unit tests**: Aim for >80% coverage on core modules
- **Integration tests**: Focus on critical user flows

### Currently Covered Modules

✅ `js/modules/logic.js` - Mythomaniac logic  
✅ `js/modules/roles.js` - Card creation  
✅ `js/modules/i18n.js` - Translations  
✅ `js/modules/utils.js` - Utility functions  
✅ `js/modules/store.js` - State persistence  

### Currently Excluded from Coverage

- `js/modules/dom.js` - Requires full DOM environment
- `js/modules/engine.js` - Complex integration (planned for E2E tests)
- `js/modules/network.js` - Requires WebRTC mocks

## Testing Conventions

### File Naming

- Test files should end with `.test.js`
- Name test files after the module they test (e.g., `logic.test.js` for `logic.js`)

### Test Organization

- Use `describe()` to group related tests
- Use descriptive test names that explain what is being tested
- Test edge cases (null, undefined, empty arrays, etc.)

### Assertions

Common assertion patterns:

```javascript
// Equality
expect(value).toBe(expected);           // Strict equality (===)
expect(object).toEqual(expected);       // Deep equality

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();
expect(value).toBeDefined();

// Numbers
expect(number).toBeGreaterThan(5);
expect(number).toBeLessThan(10);

// Arrays
expect(array).toHaveLength(3);
expect(array).toContain(item);

// Exceptions
expect(() => fn()).toThrow();
expect(() => fn()).not.toThrow();
```

## Continuous Integration

Tests are designed to run in CI environments. They use jsdom for browser environment simulation and don't require a real browser.

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
```

## Troubleshooting

### Tests failing locally but passing in CI (or vice versa)

- Ensure all dependencies are installed: `npm install`
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### Module import errors

- Check that file paths are correct (use `../../` for relative imports from tests)
- Ensure vitest.config.js has correct path aliases

### Mock not working

- Ensure mocks are defined before imports
- Use `vi.mock()` with the correct module path
- Check that the mock returns the expected structure

## Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [Vitest API Reference](https://vitest.dev/api/)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

---

**Questions or Issues?** Open an issue on [GitHub](https://github.com/n0tsosmart/slaythewerewolf/issues).
