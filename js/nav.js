/**
 * nav.js — Header visibility, smooth section scrolling, and active tab scrollspy.
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
  const sectionIds = ['hero-demo', 'showreel', 'why-neo', 'how-it-works', 'audience', 'pricing', 'faq'];
  const getSectionElements = () => {
    return sectionIds.map(id => ({
      id,
      el: id === 'hero-demo'
        ? (document.querySelector('.hero__copy') || document.getElementById('hero-demo'))
        : document.getElementById(id)
    })).filter(item => Boolean(item.el));
  };

  const syncBottomNavActive = (forcedSection) => {
    if (!navItems.length) return;

    let activeId = forcedSection;

    if (!activeId) {
      if (window.scrollY < 120) {
        activeId = 'hero-demo';
      } else {
        const sections = getSectionElements();
        const triggerLine = window.innerHeight * 0.35;

        for (let i = sections.length - 1; i >= 0; i--) {
          const sec = sections[i];
          const rect = sec.el.getBoundingClientRect();
          if (rect.top <= triggerLine) {
            activeId = sec.id;
            break;
          }
        }
      }
    }

    navItems.forEach(item => {
      const section = item.getAttribute('data-section');
      const isActive = section === (activeId || 'hero-demo');
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
        syncBottomNavActive();
      });
    }, { passive: true });

    syncBottomNavActive();

    // Click handler for bottom navigation items
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = item.getAttribute('data-section');

        // 1. Home / Hero
        if (section === 'hero-demo' || section === 'home') {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
          syncBottomNavActive('hero-demo');
          return;
        }

        // 2. Section scroll with top header offset
        const target = document.getElementById(section);
        if (target) {
          const headerHeight = 60;
          const targetY = target.getBoundingClientRect().top + window.scrollY - headerHeight;
          window.scrollTo({
            top: Math.max(0, targetY),
            behavior: 'smooth'
          });
          syncBottomNavActive(section);
        }
      });
    });
  }
})();
