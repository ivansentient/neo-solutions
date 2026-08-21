/**
 * nav.js — Scroll-reveal for top header and active scrollspy for bottom nav bar.
 */
(() => {
  'use strict';

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  window.addEventListener('load', () => {
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, { once: true });

  const header = document.querySelector('.hero__header');
  const navItems = document.querySelectorAll('.bottom-nav__item');

  const updateVisibility = () => {
    if (header) {
      header.classList.toggle('is-visible', window.scrollY > 24);
    }
  };

  updateVisibility();
  window.addEventListener('scroll', updateVisibility, { passive: true });
  window.addEventListener('resize', updateVisibility);

  // Scrollspy for bottom navigation
  if (navItems.length > 0) {
    const sectionIds = Array.from(navItems).map(item => item.getAttribute('data-section')).filter(Boolean);
    const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

    const updateActiveTab = () => {
      const scrollPos = window.scrollY + 180;
      let currentSectionId = sectionIds[0];

      if (window.scrollY < 120) {
        currentSectionId = sectionIds[0];
      } else {
        for (const section of sections) {
          if (section.offsetTop <= scrollPos) {
            currentSectionId = section.id;
          }
        }
      }

      navItems.forEach(item => {
        const isActive = item.getAttribute('data-section') === currentSectionId;
        item.classList.toggle('is-active', isActive);
        item.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
    };

    window.addEventListener('scroll', updateActiveTab, { passive: true });
    updateActiveTab();

    // Smooth click handler
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const targetId = item.getAttribute('data-section');
        if (targetId === 'hero-demo' || targetId === 'showreel' && window.scrollY < 200) {
          e.preventDefault();
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
          return;
        }

        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          e.preventDefault();
          const targetY = targetEl.getBoundingClientRect().top + window.scrollY - 64;
          window.scrollTo({
            top: Math.max(0, targetY),
            behavior: 'smooth'
          });
        }
      });
    });
  }
})();
