/**
 * @fileoverview Modal open/close helpers for info, privacy, and voting modals.
 * Extracted from engine.js for better modularity.
 */
import { el } from '../dom.js';
import { t } from '../i18n.js';

/**
 * Opens the info/immersion tips modal.
 */
export function openInfoModal() {
    if (!el.infoOverlay) return;
    el.infoOverlay.classList.remove("hidden");
    document.body.style.overflow = "hidden";
}

/**
 * Closes the info/immersion tips modal.
 */
export function closeInfoModal() {
    if (!el.infoOverlay) return;
    el.infoOverlay.classList.add("hidden");
    document.body.style.overflow = "";
}

/**
 * Opens the privacy policy modal.
 */
export function openPrivacyModal() {
    if (!el.privacyOverlay) return;
    el.privacyOverlay.classList.remove("hidden");
    document.body.style.overflow = "hidden";
}

/**
 * Closes the privacy policy modal.
 */
export function closePrivacyModal() {
    if (!el.privacyOverlay) return;
    el.privacyOverlay.classList.add("hidden");
    document.body.style.overflow = "";
}

/**
 * Opens the voting rules modal.
 */
export function openVotingModal() {
    if (!el.votingOverlay) return;
    el.votingOverlay.classList.remove("hidden");
    document.body.style.overflow = "hidden";
}

/**
 * Closes the voting rules modal.
 */
export function closeVotingModal() {
    if (!el.votingOverlay) return;
    el.votingOverlay.classList.add("hidden");
    document.body.style.overflow = "";
}

/**
 * Shows a confirmation modal with cancel/confirm buttons.
 * @param {string} message - The confirmation message to display
 * @param {Function} onConfirm - Callback to execute on confirm
 */
export function confirmAction(message, onConfirm) {
    el.modalTitle.textContent = t("modal.title");
    el.modalMessage.textContent = message;
    el.modalOverlay.classList.remove("hidden");
    document.body.style.overflow = "hidden";

    const cleanup = () => {
        el.modalOverlay.classList.add("hidden");
        document.body.style.overflow = "";
        el.modalCancel.removeEventListener("click", cancelHandler);
        el.modalConfirm.removeEventListener("click", confirmHandler);
    };
    const cancelHandler = () => cleanup();
    const confirmHandler = () => {
        cleanup();
        if (typeof onConfirm === "function") onConfirm();
    };
    el.modalCancel.addEventListener("click", cancelHandler);
    el.modalConfirm.addEventListener("click", confirmHandler);
}
