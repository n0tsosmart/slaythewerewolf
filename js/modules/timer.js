/**
 * @fileoverview Turn Timer for discussion phases
 * Version: 1.1.8
 */
import { t } from './i18n.js';
import { state } from './state.js';
import { persistState } from './store.js';
import { el } from './dom.js';

let timerId = null;
let remainingSeconds = 0;
let totalSeconds = 0;
let isPaused = false;

/**
 * Initialize timer UI and events
 */
export function initTimer() {
    updateTimerDisplay();
    attachTimerEvents();

    // Set initial mini display placeholder
    const miniDisplay = document.getElementById('timerMiniDisplay');
    if (miniDisplay) {
        miniDisplay.textContent = '—';
    }
}

/**
 * Attach timer button events
 */
function attachTimerEvents() {
    const timer2min = document.getElementById('timer2min');
    const timer3min = document.getElementById('timer3min');
    const timer5min = document.getElementById('timer5min');
    const timerPause = document.getElementById('timerPause');
    const timerSkip = document.getElementById('timerSkip');

    if (timer2min) timer2min.addEventListener('click', () => startTimer(2));
    if (timer3min) timer3min.addEventListener('click', () => startTimer(3));
    if (timer5min) timer5min.addEventListener('click', () => startTimer(5));
    if (timerPause) timerPause.addEventListener('click', togglePause);
    if (timerSkip) timerSkip.addEventListener('click', skipTimer);

    // Toggle button for collapsible timer
    const timerToggle = document.getElementById('timerToggle');
    if (timerToggle) {
        timerToggle.addEventListener('click', toggleTimerPanel);
    }

    // Close timer on click outside
    document.addEventListener('click', (e) => {
        const timerControl = document.getElementById('timerControl');
        if (timerControl && !timerControl.contains(e.target)) {
            timerControl.classList.add('collapsed');
        }
    });
}

/**
 * Start a countdown timer
 * @param {number} minutes - Duration in minutes
 */
export function startTimer(minutes) {
    stopTimer();
    totalSeconds = minutes * 60;
    remainingSeconds = totalSeconds;
    isPaused = false;

    updateTimerDisplay();
    updateTimerProgress();
    showTimerActive(true);

    // Auto-collapse the timer panel
    const timerControl = document.getElementById('timerControl');
    if (timerControl) {
        timerControl.classList.add('collapsed');
    }

    timerId = setInterval(() => {
        if (!isPaused) {
            remainingSeconds--;
            updateTimerDisplay();
            updateTimerProgress();

            // Audio warnings
            if (remainingSeconds === 30) {
                playWarningBeep();
                showTimerWarning(t('timer.warning30') || '30 seconds left!');
            } else if (remainingSeconds === 10) {
                playWarningBeep();
                showTimerWarning(t('timer.warning10') || '10 seconds left!');
            }

            if (remainingSeconds <= 0) {
                timerComplete();
            }
        }
    }, 1000);
}

/**
 * Pause or resume the timer
 */
export function togglePause() {
    isPaused = !isPaused;
    const pauseBtn = document.getElementById('timerPause');
    if (pauseBtn) {
        pauseBtn.textContent = isPaused ? '▶️' : '⏸️';
        pauseBtn.title = isPaused ? (t('timer.resume') || 'Resume') : (t('timer.pause') || 'Pause');
    }

    const timerDisplay = document.getElementById('timerDisplay');
    if (timerDisplay) {
        timerDisplay.classList.toggle('paused', isPaused);
    }
}

/**
 * Stop and reset the timer
 */
export function stopTimer() {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
    }
    remainingSeconds = 0;
    totalSeconds = 0;
    isPaused = false;
    updateTimerDisplay();
    showTimerActive(false);
}

/**
 * Skip the current timer
 */
export function skipTimer() {
    stopTimer();
    // Collapse the timer panel
    const timerControl = document.getElementById('timerControl');
    if (timerControl) {
        timerControl.classList.add('collapsed');
    }
    el.toastInfo?.(t('timer.skipped') || 'Timer skipped');
}

/**
 * Called when timer reaches zero
 */
function timerComplete() {
    stopTimer();
    playCompleteSound();
    el.toastInfo?.(t('timer.complete') || 'Time is up!');

    // Flash the timer display
    const timerDisplay = document.getElementById('timerDisplay');
    if (timerDisplay) {
        timerDisplay.classList.add('timer-complete');
        setTimeout(() => timerDisplay.classList.remove('timer-complete'), 2000);
    }
}

/**
 * Update the timer display text
 */
function updateTimerDisplay() {
    const timerDisplay = document.getElementById('timerDisplay');
    if (!timerDisplay) return;

    if (remainingSeconds <= 0 && totalSeconds === 0) {
        timerDisplay.textContent = '--:--';
        // Reset mini display to placeholder when timer is inactive
        const miniDisplay = document.getElementById('timerMiniDisplay');
        if (miniDisplay) {
            miniDisplay.textContent = '—';
        }
        return;
    }

    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;
    const timeText = `${mins}:${secs.toString().padStart(2, '0')}`;
    timerDisplay.textContent = timeText;

    // Also update mini display
    const miniDisplay = document.getElementById('timerMiniDisplay');
    if (miniDisplay) {
        miniDisplay.textContent = (remainingSeconds > 0 || totalSeconds > 0) ? timeText : '—';
    }

    // Add urgency class when under 30 seconds
    timerDisplay.classList.toggle('timer-urgent', remainingSeconds > 0 && remainingSeconds <= 30);
}

/**
 * Reset timer to placeholder state - called on new day or new match
 */
export function resetTimerPlaceholder() {
    stopTimer();
    const miniDisplay = document.getElementById('timerMiniDisplay');
    if (miniDisplay) {
        miniDisplay.textContent = '—';
    }
}

/**
 * Update the circular progress ring
 */
function updateTimerProgress() {
    const timerRing = document.getElementById('timerRing');
    if (!timerRing || totalSeconds === 0) return;

    const progress = remainingSeconds / totalSeconds;
    const circumference = 2 * Math.PI * 45; // radius = 45
    const offset = circumference * (1 - progress);
    timerRing.style.strokeDashoffset = offset;
}

/**
 * Show/hide timer as active
 */
function showTimerActive(active) {
    const timerControl = document.querySelector('.timer-control');
    if (timerControl) {
        timerControl.classList.toggle('timer-active', active);
    }

    const timerPause = document.getElementById('timerPause');
    const timerSkip = document.getElementById('timerSkip');
    if (timerPause) timerPause.disabled = !active;
    if (timerSkip) timerSkip.disabled = !active;

    // Reset pause button
    if (timerPause && !active) {
        timerPause.textContent = '⏸️';
    }
}

/**
 * Show a timer warning toast
 */
function showTimerWarning(message) {
    el.toastWarning?.(message);
}

/**
 * Play a warning beep sound
 */
function playWarningBeep() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.value = 880; // A5 note
        oscillator.type = 'sine';
        gainNode.gain.value = 0.3;

        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        oscillator.stop(ctx.currentTime + 0.3);
    } catch (e) {
        console.log('[Timer] Audio not supported');
    }
}

/**
 * Play a completion sound
 */
function playCompleteSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.value = 523.25; // C5
        oscillator.type = 'sine';
        gainNode.gain.value = 0.4;

        oscillator.start();

        // Two-tone completion sound
        setTimeout(() => {
            oscillator.frequency.value = 659.25; // E5
        }, 150);

        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        oscillator.stop(ctx.currentTime + 0.5);
    } catch (e) {
        console.log('[Timer] Audio not supported');
    }
}

/**
 * Check if timer is currently running
 */
export function isTimerRunning() {
    return timerId !== null && !isPaused;
}

/**
 * Get remaining time in seconds
 */
export function getRemainingTime() {
    return remainingSeconds;
}

/**
 * Toggle timer panel expanded/collapsed
 */
export function toggleTimerPanel() {
    const timerControl = document.getElementById('timerControl');
    if (timerControl) {
        timerControl.classList.toggle('collapsed');
    }
}
