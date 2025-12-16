/**
 * @fileoverview Offline detection and UI updates
 * Version: 1.1.7
 */
import { t } from './i18n.js';

let offlineIndicator = null;

/**
 * Initialize offline detection listeners
 */
export function initOfflineDetection() {
    // Create the indicator element
    createOfflineIndicator();

    // Set initial state
    updateOfflineStatus();

    // Listen for network changes
    window.addEventListener('online', updateOfflineStatus);
    window.addEventListener('offline', updateOfflineStatus);
}

/**
 * Check if the browser is currently offline
 * @returns {boolean}
 */
export function isOffline() {
    return !navigator.onLine;
}

/**
 * Create the offline indicator element
 */
function createOfflineIndicator() {
    if (offlineIndicator) return;

    offlineIndicator = document.createElement('div');
    offlineIndicator.id = 'offlineIndicator';
    offlineIndicator.className = 'offline-indicator hidden';
    offlineIndicator.setAttribute('role', 'status');
    offlineIndicator.setAttribute('aria-live', 'polite');

    // Insert into header area
    const header = document.querySelector('header') || document.querySelector('.main-header');
    if (header) {
        header.appendChild(offlineIndicator);
    } else {
        // Fallback: insert at top of body
        document.body.insertBefore(offlineIndicator, document.body.firstChild);
    }
}

/**
 * Update the offline status in the UI
 */
function updateOfflineStatus() {
    const offline = isOffline();

    // Update body class
    document.body.classList.toggle('is-offline', offline);

    // Update indicator
    if (offlineIndicator) {
        offlineIndicator.classList.toggle('hidden', !offline);
        offlineIndicator.textContent = t('offline.indicator') || '📴 Offline';
    }

    // Update online game button
    const onlineBtn = document.getElementById('onlineGameBtn');
    if (onlineBtn) {
        onlineBtn.disabled = offline;
        onlineBtn.classList.toggle('disabled-offline', offline);

        if (offline) {
            onlineBtn.title = t('offline.onlineDisabled') || 'Online mode requires internet';
        } else {
            onlineBtn.title = '';
        }
    }

    console.log(`[Offline] Status: ${offline ? 'OFFLINE' : 'ONLINE'}`);
}
