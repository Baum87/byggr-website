// ── BI & Data — counter animatie voor KPI getallen ───────────
(function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animateCounter(el, initialDelay) {
    const to       = parseFloat(el.dataset.target);
    const suffix   = el.dataset.suffix || '';
    const dec      = parseInt(el.dataset.dec || '0', 10);
    const duration = 1600;
    const pause    = 2800;

    if (prefersReducedMotion) {
      el.textContent = to.toFixed(dec) + suffix;
      return;
    }

    function cycle() {
      el.textContent = '0' + suffix;
      const start = performance.now();

      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const v = 1 - Math.pow(1 - p, 3);
        el.textContent = (v * to).toFixed(dec) + suffix;
        if (p < 1) {
          requestAnimationFrame(tick);
        } else {
          setTimeout(cycle, pause);
        }
      }

      requestAnimationFrame(tick);
    }

    setTimeout(cycle, initialDelay);
  }

  document.querySelectorAll('.svis-kpi-num[data-target]').forEach(function (el, i) {
    animateCounter(el, i * 180);
  });
})();
