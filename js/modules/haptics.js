import { state } from './state.js';

export const PATTERNS = {
  SHORT: 15,               // Button press
  MEDIUM: 40,              // Minor event
  LONG: 100,               // Significant event
  REVEAL: 100,             // Role reveal
  SUCCESS: [50, 50, 50],   // Success action
  FAILURE: [50, 100, 50],  // Error/Failure
  VICTORY: [100, 50, 100, 50, 200], // Game over / Victory
  ELIMINATION: [100, 50, 100], // Player elimination
};

// Check if vibration is supported
const isVibrationSupported = typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';

// Detect iOS Safari which doesn't support vibration at all
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

/**
 * Triggers haptic feedback if enabled in state and supported by the device.
 * Note: iOS Safari does not support the Web Vibration API, so haptics 
 * will not work on iPhones/iPads via the browser.
 * @param {number|number[]} pattern - The vibration pattern (ms or array of ms)
 */
export function vibrate(pattern) {
  if (!state.hapticsEnabled) return;

  // Only attempt vibration on supported devices
  if (!isVibrationSupported) return;

  // iOS doesn't support vibration API - fail silently
  if (isIOS) return;

  try {
    navigator.vibrate(pattern);
  } catch (e) {
    // Ignore errors (some browsers might block if user hasn't interacted yet)
  }
}

/**
 * Helper for button clicks (short tap)
 */
export function vibrateShort() {
  vibrate(PATTERNS.SHORT);
}

/**
 * Helper for success actions
 */
export function vibrateSuccess() {
  vibrate(PATTERNS.SUCCESS);
}

