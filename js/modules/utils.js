import { PAGE_FADE_DURATION, RIPPLE_DURATION, HAPTIC_VIBRATION_DURATION, TOAST_DURATION, ANIMATION_SHAKE_DURATION, ROLE_LIBRARY } from './config.js';

// UI/UX Enhancements

export function initUI() {
  document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    requestAnimationFrame(() => {
      document.body.style.transition = `opacity ${PAGE_FADE_DURATION / 1000}s ease`;
      document.body.style.opacity = '1';
    });
  });

  document.addEventListener('click', (e) => {
    const button = e.target.closest('button, .btn, [role="button"]');
    if (!button || button.disabled) return;
    if (!button.contains(e.target)) return;

    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        pointer-events: none;
        transform: scale(0);
        animation: ripple 0.5s ease-out;
        z-index: 0;
      `;

    button.style.position = button.style.position || 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), RIPPLE_DURATION);

    if ('vibrate' in navigator && window.matchMedia('(max-width: 768px)').matches) {
      navigator.vibrate(HAPTIC_VIBRATION_DURATION);
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  document.querySelectorAll('input, select, textarea').forEach(input => {
    input.addEventListener('invalid', (e) => {
      e.preventDefault();
      input.style.animation = `shake ${ANIMATION_SHAKE_DURATION / 1000}s ease`;
      setTimeout(() => input.style.animation = '', ANIMATION_SHAKE_DURATION);
    });
  });
}

export const showToast = (message, duration = TOAST_DURATION) => {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        padding: 12px 20px;
        background: rgba(185, 28, 28, 0.95);
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(10px);
        z-index: 10000;
        font-family: var(--font-body);
        font-size: 14px;
        max-width: 90%;
        text-align: center;
        transition: transform 0.3s ease;
      `;

  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(100px)';
    setTimeout(() => toast.remove(), 300);
  }, duration);
};

export const debounce = (func, wait) => {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

export function scrollToBottom(view) {
  if (view !== "reveal") return;

  // Only scroll if the action buttons aren't visible
  window.requestAnimationFrame(() => {
    const revealBtn = document.getElementById('revealBtn');
    const hideBtn = document.getElementById('hideBtn');
    const btn = (hideBtn && !hideBtn.classList.contains('hidden')) ? hideBtn : revealBtn;

    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const isVisible = rect.bottom <= window.innerHeight && rect.top >= 0;

    // Only scroll if the button is not visible
    if (!isVisible) {
      btn.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  });
}

export function shuffle(deck) {
  const arr = [...deck];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function getLanguageFlag(lang) {
  if (lang === "es") return "🇪🇸";
  if (lang === "it") return "🇮🇹";
  return "🇬🇧";
}

export function getRoleImage(roleId) {
  const role = ROLE_LIBRARY[roleId] || ROLE_LIBRARY.villager;
  const defaultImage = role.image;
  const theme = document.documentElement.getAttribute('data-theme');

  if (theme === 'purple' && defaultImage) {
    const parts = defaultImage.split('/');
    const filename = parts.pop();
    const path = parts.join('/');
    return `${path}/mafia_${filename}`;
  }

  return defaultImage;
}
