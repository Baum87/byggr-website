(function () {
  'use strict';

  // ─── Math helpers ─────────────────────────────────────────────────────────
  const clamp  = (v, a, b) => v < a ? a : v > b ? b : v;
  const lerp   = (a, b, t) => a + (b - a) * t;
  const smooth = (e0, e1, x) => {
    const t = clamp((x - e0) / (e1 - e0), 0, 1);
    return t * t * (3 - 2 * t);
  };
  const ease = t => t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;

  // Seeded PRNG — same seed = same mesh every load
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  // ─── Boot ─────────────────────────────────────────────────────────────────
  function boot() {
    const container = document.getElementById('byg-cont');
    const stage     = document.getElementById('byg-stage');
    const canvas    = document.getElementById('byg-canvas');
    const bar       = document.getElementById('byg-bar');
    const nav       = document.getElementById('byg-nav');
    const vignette  = document.getElementById('byg-vignette');
    if (!container || !stage || !canvas) return;

    // ─── Generate mesh (15×9 grid, seeded) ──────────────────────────────────
    const rnd  = mulberry32(20260621);
    const cols = 15, rows = 9;
    const x0 = 0.115, x1 = 0.885, y0 = 0.16, y1 = 0.84;
    const nodes = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const gx = x0 + (c / (cols - 1)) * (x1 - x0);
        const gy = y0 + (r / (rows - 1)) * (y1 - y0);
        // organic target = grid pos + small random offset
        const tx = gx + (rnd() - 0.5) * 0.024;
        const ty = gy + (rnd() - 0.5) * 0.034;
        const distN  = Math.hypot(tx - 0.5, ty - 0.5) / 0.55;
        const isEarly = rnd() < 0.20;  // these disperse from the idea dot
        let birth = clamp(distN * 0.72 + (rnd() - 0.5) * 0.12, 0.0, 0.85);
        if (isEarly) birth = rnd() * 0.12;
        let sx, sy;
        if (isEarly) {
          const a = rnd() * 6.283, rr = 0.015 + rnd() * 0.09;
          sx = 0.5 + Math.cos(a) * rr;
          sy = 0.5 + Math.sin(a) * rr;
        } else {
          sx = 0.04 + rnd() * 0.92;
          sy = 0.04 + rnd() * 0.92;
        }
        nodes.push({
          tx, ty, sx, sy, gx, gy,
          rowFrac: r / (rows - 1),
          birth, isEarly,
          hub:  rnd() < 0.12,
          ph:   rnd() * 6.283,
          freq: 0.5 + rnd() * 1.1,
          // scratch fields mutated per frame (no GC pressure)
          _x: 0, _y: 0, _nl: 0, _str: 0,
        });
      }
    }

    const idx = (c, r) => r * cols + c;
    const edges = [];
    const addEdge = (a, b) => {
      const A = nodes[a], B = nodes[b];
      edges.push({
        a, b,
        reveal: Math.max(A.birth, B.birth) + 0.03 + rnd() * 0.06,
        accent: rnd() < 0.16,
      });
    };
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (c < cols - 1) addEdge(idx(c, r), idx(c + 1, r));
        if (r < rows - 1) addEdge(idx(c, r), idx(c, r + 1));
        if (c < cols - 1 && r < rows - 1 && rnd() < 0.32) addEdge(idx(c, r), idx(c + 1, r + 1));
      }
    }

    // ─── Overlays ────────────────────────────────────────────────────────────
    const overlays = Array.from(stage.querySelectorAll('[data-range]')).map(el => {
      const [s, e] = el.getAttribute('data-range').split(',').map(Number);
      return { el, s, e };
    });

    // ─── Phase nav ───────────────────────────────────────────────────────────
    const navBtns   = Array.from(nav.querySelectorAll('button'));
    const navRanges = [
      [0, 0.10], [0.10, 0.27], [0.27, 0.46],
      [0.46, 0.61], [0.61, 0.78], [0.78, 0.92], [0.92, 1.01],
    ];

    navBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const frac  = parseFloat(btn.getAttribute('data-target'));
        const total = container.offsetHeight - window.innerHeight;
        window.scrollTo({ top: container.offsetTop + frac * total, behavior: 'smooth' });
      });
    });

    // data-jump buttons (top-right Cases + nav jumps)
    stage.querySelectorAll('[data-jump]').forEach(b => {
      b.addEventListener('click', () => {
        const f     = parseFloat(b.getAttribute('data-jump'));
        const total = container.offsetHeight - window.innerHeight;
        window.scrollTo({ top: container.offsetTop + f * total, behavior: 'smooth' });
      });
    });

    // "Neem contact op" CTA → scrolls to Netlify form below the stage
    stage.querySelectorAll('[data-contact-cta]').forEach(b => {
      b.addEventListener('click', () => {
        const form = document.getElementById('contact-form');
        if (form) form.scrollIntoView({ behavior: 'smooth' });
      });
    });

    // ─── Canvas setup ────────────────────────────────────────────────────────
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W   = stage.clientWidth;
      H   = stage.clientHeight;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // ─── Scroll progress p ∈ [0,1] ──────────────────────────────────────────
    let targetP = 0, p = 0;
    const readP = () => {
      const total = container.offsetHeight - window.innerHeight;
      const sy    = window.scrollY || document.documentElement.scrollTop || 0;
      return total > 0 ? clamp((sy - container.offsetTop) / total, 0, 1) : 0;
    };

    // ─── Draw ────────────────────────────────────────────────────────────────
    const nodeLocal = (n, b) => clamp((b - n.birth) / 0.28, 0, 1);

    const draw = (p, now) => {
      ctx.clearRect(0, 0, W, H);
      // b = global build amount: mesh starts appearing at Discovery, done by p≈0.88
      const b = clamp((p - 0.10) / 0.78, 0, 1);

      // ── The idea dot ──────────────────────────────────────────────────────
      const ideaLife = clamp(1 - p / 0.23, 0, 1);
      const ideaJP   = clamp(p / 0.23, 0, 1);
      const ideaJE   = ease(ideaJP);
      const ideaX    = lerp(0.5, 0.52, ideaJE) * W;
      const ideaY    = lerp(0.5, 0.63, ideaJE) * H;

      if (ideaLife > 0) {
        const soft    = 1 - ideaJE;
        const breathe = 1 + 0.045 * Math.sin(now * 0.0016) * soft;
        const R       = lerp(0.22 * Math.min(W, H), 2.2, ideaJE) * breathe;
        ctx.save();
        if (soft > 0.02) {
          const hg = ctx.createRadialGradient(ideaX, ideaY, R * 0.25, ideaX, ideaY, R * 2.0);
          hg.addColorStop(0, `rgba(79,168,255,${0.12 * ideaLife * soft})`);
          hg.addColorStop(1, 'rgba(79,168,255,0)');
          ctx.fillStyle = hg;
          ctx.beginPath(); ctx.arc(ideaX, ideaY, R * 2.0, 0, 6.2832); ctx.fill();
        }
        const cg = ctx.createRadialGradient(ideaX, ideaY, 0, ideaX, ideaY, R);
        cg.addColorStop(0,    `rgba(120,190,255,${(0.6 + 0.25 * ideaJE) * ideaLife})`);
        cg.addColorStop(0.55, `rgba(79,168,255,${(0.32 + 0.10 * ideaJE) * ideaLife})`);
        cg.addColorStop(1,    'rgba(79,168,255,0)');
        ctx.fillStyle = cg;
        ctx.beginPath(); ctx.arc(ideaX, ideaY, R, 0, 6.2832); ctx.fill();
        if (soft > 0.1) {
          ctx.strokeStyle = `rgba(79,168,255,${0.26 * ideaLife * soft})`;
          ctx.lineWidth   = 1.5;
          ctx.beginPath(); ctx.arc(ideaX, ideaY, R * 0.86, 0, 6.2832); ctx.stroke();
        }
        // crisp core resolves as the dot becomes a data point
        if (ideaJE > 0.1) {
          const crisp     = smooth(0.1, 0.85, ideaJE);
          ctx.shadowColor = 'rgba(79,168,255,0.85)';
          ctx.shadowBlur  = 7 * crisp;
          ctx.fillStyle   = `rgba(150,205,255,${0.85 * crisp * ideaLife})`;
          ctx.beginPath(); ctx.arc(ideaX, ideaY, Math.max(R * 0.55, 1.5), 0, 6.2832); ctx.fill();
          ctx.shadowBlur  = 0;
        }
        ctx.restore();
      }

      // ── Quality sweep (Resultaat) ─────────────────────────────────────────
      // A horizontal band snaps each row from organic → exact grid (top→bottom)
      const sweepStart = 0.78, sweepEnd = 0.90, feather = 0.16;
      const sweepFrac  = clamp((p - sweepStart) / (sweepEnd - sweepStart), 0, 1);
      const bandPos    = sweepFrac * (1 + feather);
      const sweeping   = p > sweepStart && sweepFrac < 1;

      // Precompute pixel positions for this frame
      for (let i = 0; i < nodes.length; i++) {
        const n  = nodes[i];
        const nl = nodeLocal(n, b);
        n._nl = nl;
        if (nl <= 0) { n._x = null; continue; }
        const str = clamp((bandPos - n.rowFrac) / feather, 0, 1);
        n._str    = str;
        const eL  = ease(nl);
        const jit = (1 - nl) * 0.018 * (1 - str);  // jitter dies as row snaps
        const jx  = Math.sin(now * 0.001  * n.freq + n.ph) * jit;
        const jy  = Math.cos(now * 0.0011 * n.freq + n.ph) * jit;
        const ox  = lerp(n.sx, n.tx, eL) + jx;
        const oy  = lerp(n.sy, n.ty, eL) + jy;
        n._x = lerp(ox, n.gx, str) * W;
        n._y = lerp(oy, n.gy, str) * H;
      }

      // Draw edges
      for (let i = 0; i < edges.length; i++) {
        const e  = edges[i];
        const el = clamp((b - e.reveal) / 0.12, 0, 1);
        if (el <= 0) continue;
        const A = nodes[e.a], B = nodes[e.b];
        if (A._x === null || B._x === null) continue;
        const ex       = lerp(A._x, B._x, el);
        const ey       = lerp(A._y, B._y, el);
        const straight = (A._str + B._str) * 0.5;
        const alpha    = el * (0.05 + 0.20 * b + 0.10 * straight);
        ctx.strokeStyle = e.accent
          ? `rgba(79,168,255,${alpha * 1.35})`
          : `rgba(150,172,205,${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(A._x, A._y); ctx.lineTo(ex, ey); ctx.stroke();
      }

      // Draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (n._x === null) continue;
        const x    = n._x, y = n._y;
        const snap = Math.sin(clamp(n._str, 0, 1) * Math.PI);  // flash as band passes
        let spark2 = 0;
        if (ideaLife > 0 && n.isEarly) {
          const dd = Math.hypot(x - ideaX, y - ideaY);
          spark2   = clamp(1 - dd / (0.12 * Math.min(W, H)), 0, 1) * ideaJE * ideaLife;
        }
        const glow = Math.max(snap, spark2);
        const ap   = clamp(clamp(n._nl * 1.25, 0, 1) * (0.42 + 0.55 * b) + 0.4 * glow, 0, 1);
        if (n.hub) {
          ctx.fillStyle   = `rgba(79,168,255,${ap})`;
          ctx.shadowColor = 'rgba(79,168,255,0.85)';
          ctx.shadowBlur  = 9 * b + 6 * glow;
          ctx.beginPath(); ctx.arc(x, y, 2.5 + 0.8 * glow, 0, 6.2832); ctx.fill();
          ctx.shadowBlur  = 0;
        } else {
          ctx.fillStyle = `rgba(236,234,228,${ap})`;
          if (glow > 0.05) {
            ctx.shadowColor = 'rgba(79,168,255,0.7)';
            ctx.shadowBlur  = 5 * glow;
          }
          ctx.beginPath(); ctx.arc(x, y, 1.5 + 0.8 * glow, 0, 6.2832); ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // Sweep band — soft gradient with crisp 1px leading edge
      if (sweeping) {
        const by = (y0 + clamp(bandPos, 0, 1) * (y1 - y0)) * H;
        const g  = ctx.createLinearGradient(0, by - 70, 0, by + 70);
        g.addColorStop(0,   'rgba(79,168,255,0)');
        g.addColorStop(0.5, 'rgba(79,168,255,0.14)');
        g.addColorStop(1,   'rgba(79,168,255,0)');
        ctx.fillStyle = g; ctx.fillRect(0, by - 70, W, 140);
        ctx.strokeStyle = 'rgba(79,168,255,0.5)';
        ctx.lineWidth   = 1;
        ctx.beginPath(); ctx.moveTo(0, by); ctx.lineTo(W, by); ctx.stroke();
      }
    };

    // ─── UI updates ──────────────────────────────────────────────────────────
    const updateOverlays = p => {
      for (const o of overlays) {
        const fin  = o.s <= 0.001 ? 1 : (p - o.s) / 0.045;
        const fout = o.e >= 1     ? 1 : (o.e - p) / 0.045;
        const op   = clamp(Math.min(fin, fout, 1), 0, 1);
        o.el.style.opacity       = op.toFixed(3);
        o.el.style.transform     = `translateY(${(1 - op) * 16}px)`;
        o.el.style.pointerEvents = op > 0.5 ? 'auto' : 'none';
      }
    };

    const updateNav = p => {
      nav.style.opacity = p > 0.04 ? '1' : '0';
      let active = 0;
      for (let i = 0; i < navRanges.length; i++) {
        if (p >= navRanges[i][0] && p < navRanges[i][1]) active = i;
      }
      navBtns.forEach((btn, i) => {
        const lbl  = btn.querySelector('[data-lbl]');
        const tick = btn.querySelector('[data-tick]');
        const on   = i === active;
        lbl.style.color       = on ? '#ecece4' : 'rgba(236,234,228,.32)';
        lbl.style.opacity     = on ? '1' : '.65';
        tick.style.background = on ? '#4fa8ff' : 'rgba(236,234,228,.32)';
        tick.style.width      = on ? '26px' : '14px';
        tick.style.boxShadow  = on ? '0 0 8px rgba(79,168,255,.7)' : 'none';
      });
    };

    const update = (p, now) => {
      draw(p, now || performance.now());
      updateOverlays(p);
      updateNav(p);
      if (vignette) vignette.style.opacity = (0.3 + 0.7 * clamp((p - 0.02) / 0.20, 0, 1)).toFixed(3);
      if (bar)      bar.style.width        = (p * 100).toFixed(2) + '%';
    };

    // ─── Loop ────────────────────────────────────────────────────────────────
    // scroll event draws immediately; rAF eases p for buttery motion
    const onScroll = () => { targetP = readP(); update(targetP); };
    window.addEventListener('scroll', onScroll, { passive: true });

    const tick = now => {
      targetP = readP();
      p      += (targetP - p) * 0.12;
      update(p, now);
      requestAnimationFrame(tick);
    };
    p = readP();
    update(p);
    requestAnimationFrame(tick);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
