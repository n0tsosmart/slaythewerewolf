/**
 * @fileoverview Browser Compatibility Detection Module
 * Checks for required browser features and shows warnings for unsupported capabilities.
 * 
 * Features checked:
 * - WebRTC (RTCPeerConnection) - required for online multiplayer
 * - localStorage - required for game state persistence
 */

import { el } from './dom.js';
import { t } from './i18n.js';

/**
 * Check browser compatibility for required features
 * @returns {Array<{feature: string, severity: 'warning'|'error'}>} List of compatibility issues
 */
export function checkBrowserCompatibility() {
    const issues = [];

    // Check WebRTC support (needed for online mode)
    if (!window.RTCPeerConnection && !window.webkitRTCPeerConnection && !window.mozRTCPeerConnection) {
        issues.push({ feature: 'webrtc', severity: 'warning' });
    }

    // Check localStorage support (needed for game state persistence)
    try {
        const testKey = '__browser_compat_test__';
        localStorage.setItem(testKey, '1');
        localStorage.removeItem(testKey);
    } catch (e) {
        issues.push({ feature: 'localStorage', severity: 'warning' });
    }

    return issues;
}

/**
 * Show toast notifications for compatibility issues
 * @param {Array<{feature: string, severity: 'warning'|'error'}>} issues - List of issues to display
 */
export function showCompatibilityWarnings(issues) {
    if (!issues || issues.length === 0) return;

    issues.forEach(issue => {
        let message = '';

        switch (issue.feature) {
            case 'webrtc':
                message = t('compat.webrtcWarning');
                break;
            case 'localStorage':
                message = t('compat.localStorageWarning');
                break;
            default:
                message = t('compat.oldBrowser');
        }

        if (message) {
            // Use warning toast for compatibility issues
            el.toastWarning(message, 6000);
        }
    });
}

/**
 * Check if WebRTC is supported (for online mode availability)
 * @returns {boolean} True if WebRTC is supported
 */
export function isWebRTCSupported() {
    return !!(window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection);
}

/**
 * Check if localStorage is supported
 * @returns {boolean} True if localStorage is available
 */
export function isLocalStorageSupported() {
    try {
        const testKey = '__ls_test__';
        localStorage.setItem(testKey, '1');
        localStorage.removeItem(testKey);
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Initialize browser compatibility checks
 * Should be called on app startup
 */
export function initBrowserCompatibility() {
    const issues = checkBrowserCompatibility();

    if (issues.length > 0) {
        // Delay slightly to ensure DOM is ready and translations are loaded
        setTimeout(() => {
            showCompatibilityWarnings(issues);
        }, 500);
    }

    return issues;
}
