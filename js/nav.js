/**
 * nav.js — Header visibility, accurate section scrolling, and active tab scrollspy.
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

  // Section targets in visual DOM order
  const sections = [
    { id: 'hero-demo', el: document.querySelector('.hero__copy') || document.getElementById('hero-demo') },
    { id: 'how-it-works', el: document.getElementById('how-it-works') },
    { id: 'audience', el: document.getElementById('audience') },
    { id: 'pricing', el: document.getElementById('pricing') }
  ];

  window.syncBottomNavActive = (forcedSection) => {
    if (!navItems.length) return;

    let activeId = forcedSection;

    if (!activeId) {
      if (document.body.classList.contains('video-modal-open')) {
        activeId = 'video';
      } else if (window.scrollY < 200) {
        activeId = 'hero-demo';
      } else {
        const threshold = window.innerHeight * 0.45;
        activeId = 'hero-demo';

        for (let i = sections.length - 1; i >= 0; i--) {
          const sec = sections[i];
          if (sec.el) {
            const rect = sec.el.getBoundingClientRect();
            if (rect.top <= threshold && rect.bottom > 80) {
              activeId = sec.id;
              break;
            }
          }
        }
      }
    }

    navItems.forEach(item => {
      const section = item.getAttribute('data-section');
      const isActive = section === activeId;
      item.classList.toggle('is-active', isActive);
      item.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  };

  if (navItems.length > 0) {
    let scrollRaf = 0;
    window.addEventListener('scroll', () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        window.syncBottomNavActive();
      });
    }, { passive: true });

    window.syncBottomNavActive();

    // Click handler for bottom navigation items
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = item.getAttribute('data-section');

        // 1. Video modal tab
        if (section === 'video') {
          if (typeof window.openVideoModal === 'function') {
            window.openVideoModal();
          }
          return;
        }

        // Close modal if open
        if (document.body.classList.contains('video-modal-open') && typeof window.closeVideoModal === 'function') {
          window.closeVideoModal();
        }

        // 2. Home / Hero section
        if (section === 'hero-demo' || section === 'home' || section === 'top') {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
          window.syncBottomNavActive('hero-demo');
          return;
        }

        // 3. Specific section (Pasos, Audiencia, Precios)
        const targetObj = sections.find(s => s.id === section);
        const target = targetObj ? targetObj.el : document.getElementById(section);
        if (target) {
          const headerHeight = 60;
          const targetY = target.getBoundingClientRect().top + window.scrollY - headerHeight;
          window.scrollTo({
            top: Math.max(0, targetY),
            behavior: 'smooth'
          });
          window.syncBottomNavActive(section);
        }
      });
    });
  }
})();
