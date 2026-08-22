/**
 * video-modal.js — Initial video overlay on mobile.
 * Darkens & blurs the entire site until dismissed.
 */
(() => {
  'use strict';

  const overlay = document.getElementById('video-modal-overlay');
  if (!overlay) return;

  const closeBtn = document.getElementById('close-video-modal');
  const enterBtn = document.getElementById('enter-website-btn');
  const backdrop = document.getElementById('video-modal-backdrop');
  const player = document.getElementById('mobile-intro-player');
  const isMobile = () => window.innerWidth <= 820;

  window.openVideoModal = () => {
    overlay.classList.remove('is-hidden');
    overlay.classList.add('is-open');
    document.body.classList.add('video-modal-open');
    const playVideo = () => {
      if (player && typeof player.play === 'function') {
        player.play().catch(() => {});
      }
    };

    if (typeof window.loadNeoVideo === 'function') {
      window.loadNeoVideo().then(playVideo).catch(() => {});
    } else {
      playVideo();
    }
    if (typeof window.syncBottomNavActive === 'function') {
      window.syncBottomNavActive('video');
    }
  };

  window.closeVideoModal = () => {
    overlay.classList.remove('is-open');
    overlay.classList.add('is-hidden');
    document.body.classList.remove('video-modal-open');
    if (player && typeof player.pause === 'function') {
      player.pause();
    }
    if (typeof window.syncBottomNavActive === 'function') {
      window.syncBottomNavActive();
    }
  };

  if (isMobile()) {
    window.openVideoModal();
  } else {
    overlay.classList.remove('is-open');
    overlay.classList.add('is-hidden');
    document.body.classList.remove('video-modal-open');
  }

  closeBtn?.addEventListener('click', window.closeVideoModal);
  enterBtn?.addEventListener('click', window.closeVideoModal);
  backdrop?.addEventListener('click', window.closeVideoModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
      window.closeVideoModal();
    }
  });
})();
