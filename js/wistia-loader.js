(() => {
  'use strict';

  let loadPromise = null;

  const appendScript = (src, { module = false } = {}) => new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === 'true') resolve();
      else {
        existing.addEventListener('load', resolve, { once: true });
        existing.addEventListener('error', reject, { once: true });
      }
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    if (module) script.type = 'module';
    script.addEventListener('load', () => {
      script.dataset.loaded = 'true';
      resolve();
    }, { once: true });
    script.addEventListener('error', reject, { once: true });
    document.head.appendChild(script);
  });

  window.loadNeoVideo = () => {
    if (!loadPromise) {
      loadPromise = Promise.all([
        appendScript('https://fast.wistia.com/player.js'),
        appendScript('https://fast.wistia.com/embed/ro89dasf7b.js', { module: true })
      ]);
    }

    return loadPromise;
  };

  if (window.innerWidth > 820) {
    window.loadNeoVideo().catch(() => {});
  }
})();
