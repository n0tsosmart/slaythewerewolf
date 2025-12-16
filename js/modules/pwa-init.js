// Initialize PWA install button
import { promptInstall } from './pwa.js';

document.addEventListener('DOMContentLoaded', () => {
    const installBtn = document.getElementById('installAppBtn');

    if (installBtn) {
        installBtn.addEventListener('click', () => {
            promptInstall();

            // Close the menu after clicking
            const mainMenu = document.getElementById('mainMenu');
            if (mainMenu) {
                mainMenu.classList.add('hidden');
                mainMenu.setAttribute('aria-hidden', 'true');
            }

            const menuBtn = document.getElementById('menuBtn');
            if (menuBtn) {
                menuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }
});
