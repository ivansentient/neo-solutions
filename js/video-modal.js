/**
 * video-modal.js — Handles mobile intro video overlay modal.
 * Blurs and locks background until dismissed.
 */
(() => {
  'use strict';

  const overlay = document.getElementById('video-modal-overlay');
  if (!overlay) return;

  const closeBtn = document.getElementById('close-video-modal');
  const enterBtn = document.getElementById('enter-website-btn');
  const backdrop = document.getElementById('video-modal-backdrop');
  const player = document.getElementById('mobile-intro-player');
  const videoTab = document.querySelector('.bottom-nav__item[data-section="showreel"]');

  const isMobile = () => window.innerWidth <= 820;

  const openModal = () => {
    overlay.classList.remove('is-hidden');
    overlay.classList.add('is-open');
    document.body.classList.add('video-modal-open');
    if (player && typeof player.play === 'function') {
      player.play().catch(() => {});
    }
  };

  const closeModal = () => {
    overlay.classList.remove('is-open');
    overlay.classList.add('is-hidden');
    document.body.classList.remove('video-modal-open');
    if (player && typeof player.pause === 'function') {
      player.pause();
    }
  };

  // Open modal on mobile on initial load
  if (isMobile()) {
    document.body.classList.add('video-modal-open');
  } else {
    overlay.classList.remove('is-open');
    overlay.classList.add('is-hidden');
    document.body.classList.remove('video-modal-open');
  }

  closeBtn?.addEventListener('click', closeModal);
  enterBtn?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
      closeModal();
    }
  });

  if (videoTab) {
    videoTab.addEventListener('click', (e) => {
      if (isMobile()) {
        e.preventDefault();
        openModal();
      }
    });
  }
})();
