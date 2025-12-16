// PWA Installation and Update Management

let deferredPrompt;
let isInstalled = false;

// Check if app is already installed
if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
    isInstalled = true;
    console.log('[PWA] App is running in standalone mode');
}

// Check if iOS and not installed
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
const isInStandaloneMode = window.navigator.standalone === true;

// Show install button on iOS if not installed
if (isIOS && !isInStandaloneMode) {
    window.addEventListener('DOMContentLoaded', () => {
        const installBtn = document.getElementById('installAppBtn');
        if (installBtn) {
            installBtn.style.display = 'block';
            console.log('[PWA] Install button shown for iOS');
        }
    });
}

// Capture the beforeinstallprompt event (Android/Desktop)
window.addEventListener('beforeinstallprompt', (e) => {
    console.log('[PWA] beforeinstallprompt event fired');

    // Prevent the default prompt
    e.preventDefault();

    // Store the event for later use
    deferredPrompt = e;

    // Show the install button in the menu
    const installBtn = document.getElementById('installAppBtn');
    if (installBtn) {
        installBtn.style.display = 'block';
    }
});

// Handle successful installation
window.addEventListener('appinstalled', () => {
    console.log('[PWA] App installed successfully');
    isInstalled = true;
    deferredPrompt = null;

    // Hide the install button
    const installBtn = document.getElementById('installAppBtn');
    if (installBtn) {
        installBtn.style.display = 'none';
    }

    // Track installation (localStorage only, privacy-first)
    try {
        localStorage.setItem('pwa_installed', 'true');
        localStorage.setItem('pwa_install_date', new Date().toISOString());
    } catch (e) {
        console.warn('[PWA] Could not save install status', e);
    }
});

// Function to trigger install prompt (can be called from UI)
export function promptInstall() {
    // Check if iOS
    if (showiOSInstallInstructions()) {
        // Show iOS-specific toast
        if (typeof window.toastInfo === 'function') {
            window.toastInfo('Tap the Share button, then tap "Add to Home Screen"');
        } else {
            alert('To install: Tap the Share button, then tap "Add to Home Screen"');
        }
        return false;
    }

    if (!deferredPrompt) {
        console.log('[PWA] Install prompt not available');
        return false;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user's response
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('[PWA] User accepted the install prompt');
        } else {
            console.log('[PWA] User dismissed the install prompt');
        }
        deferredPrompt = null;

        // Hide the install button
        const installBtn = document.getElementById('installAppBtn');
        if (installBtn) {
            installBtn.style.display = 'none';
        }
    });

    return true;
}

// Check if install is available
export function canInstall() {
    return deferredPrompt !== null && !isInstalled;
}

// Check if app is installed
export function isPWAInstalled() {
    return isInstalled;
}

// iOS-specific install instructions
export function showiOSInstallInstructions() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isInStandaloneMode = window.navigator.standalone === true;

    if (isIOS && !isInStandaloneMode) {
        // Show iOS-specific instructions
        // You can create a modal or toast with instructions:
        // "Tap the Share button, then tap 'Add to Home Screen'"
        return true;
    }

    return false;
}

// Register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/slaythewerewolf/sw.js')
            .then((registration) => {
                console.log('[PWA] Service Worker registered:', registration.scope);

                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;

                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New service worker available
                            console.log('[PWA] New version available! Refresh to update.');

                            // Optionally show update notification to user
                            // You can add UI here to prompt refresh
                        }
                    });
                });
            })
            .catch((error) => {
                console.error('[PWA] Service Worker registration failed:', error);
            });
    });
}
