// ── Scroll-triggered reveals — alle typen ────────────────────
const revealSelector = '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-fade, .reveal-up, .reveal-blur';

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(revealSelector).forEach((el) => observer.observe(el));

// ── Hero word-reveal (bij pagina-load, staggered) ─────────────
// Elk woord klapt omhoog vanuit zijn eigen overflow-container.
// Timing: 150ms vertraging + 110ms stagger per woord.
const wordWraps = document.querySelectorAll('.word-reveal');

wordWraps.forEach((wrap, i) => {
  const inner = wrap.querySelector('span');
  if (inner) inner.style.transitionDelay = `${150 + i * 110}ms`;
});

// Twee rAF's: eerste laat browser layout afmaken, tweede triggert animatie
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    wordWraps.forEach((wrap) => wrap.classList.add('visible'));
  });
});

// ── Reduced-motion check — respecteer OS voorkeur ─────────────
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── 3D perspectief-tilt helper ────────────────────────────────
function applyTilt(el, { maxAngle = 10, maxZ = 6, shadowAlpha = 0.18 } = {}) {
  if (prefersReducedMotion) return;
  el.addEventListener('mouseenter', () => {
    el.style.transition = 'transform 0.1s ease, box-shadow 0.1s ease, background-color var(--transition-base)';
  });

  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const rx = ((e.clientY - rect.top)  / rect.height - 0.5) * -maxAngle;
    const ry = ((e.clientX - rect.left) / rect.width  - 0.5) *  maxAngle;

    // Schaduw verschuift mee: kantelt rechts → schaduw links
    const sx = ry * -1.2;
    const sy = rx *  1.2;
    const blur = 24 + (Math.abs(rx) + Math.abs(ry)) * 1.5;

    el.style.transform  = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(${maxZ}px)`;
    el.style.boxShadow  = `${sx}px ${sy}px ${blur}px rgba(0,0,0,${shadowAlpha})`;
  });

  el.addEventListener('mouseleave', () => {
    el.style.transition = 'transform 0.55s var(--ease-out-expo), box-shadow 0.55s var(--ease-out-expo), background-color var(--transition-base)';
    el.style.transform  = '';
    el.style.boxShadow  = '';
  });
}

// Portfolio kaarten — tilt + afbeelding parallax (beweegt tegengesteld aan kaart)
document.querySelectorAll('.project-card').forEach((card) => {
  if (prefersReducedMotion) return;

  const img = card.querySelector('.project-card__img img');
  let leaveTimer = null;

  card.addEventListener('mouseenter', () => {
    clearTimeout(leaveTimer);
    card.style.transition = 'transform 0.1s ease, box-shadow 0.1s ease, background-color var(--transition-base)';
    if (img) img.style.transition = 'transform 0.1s ease, filter 0.7s var(--ease-out-expo)';
  });

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const rx = ((e.clientY - rect.top)  / rect.height - 0.5) * -10;
    const ry = ((e.clientX - rect.left) / rect.width  - 0.5) *  10;

    const sx   = ry * -1.2;
    const sy   = rx *  1.2;
    const blur = 24 + (Math.abs(rx) + Math.abs(ry)) * 1.5;

    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
    card.style.boxShadow = `${sx}px ${sy}px ${blur}px rgba(0,0,0,0.18)`;

    // Beeld beweegt tegenovergesteld: kaart rechts → beeld links
    if (img) img.style.transform = `translateX(${-ry * 1}px) translateY(${rx * 1}px) scale(1.08)`;
  });

  card.addEventListener('mouseleave', () => {
    // Kleine vertraging voorkomt stuck-state bij snelle muis-beweging
    leaveTimer = setTimeout(() => {
      card.style.transition = 'transform 0.55s var(--ease-out-expo), box-shadow 0.55s var(--ease-out-expo), background-color var(--transition-base)';
      if (img) img.style.transition = 'transform 0.55s var(--ease-out-expo), filter 0.7s var(--ease-out-expo)';
      card.style.transform = '';
      card.style.boxShadow = '';
      if (img) img.style.transform = '';
    }, 20);
  });
});

// ── Count-up animatie voor stat-blokken ──────────────────────
const statGetallen = document.querySelectorAll('.stat-block__getal');

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    countObserver.unobserve(entry.target);

    const el = entry.target;
    const raw = el.textContent.trim();
    const suffix = raw.replace(/[0-9]/g, ''); // bijv. "+"
    const target = parseInt(raw, 10);
    const index = [...statGetallen].indexOf(el);

    // Geen animatie bij reduced motion — toon eindwaarde direct
    if (prefersReducedMotion) {
      el.textContent = raw;
      return;
    }

    setTimeout(() => {
      const duration = 1400;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    }, index * 200); // stagger: 0ms, 200ms, 400ms
  });
}, { threshold: 0.6 });

statGetallen.forEach((el) => countObserver.observe(el));

// ── Section title word-split reveal ──────────────────────────
// Grote koppen knippen per woord omhoog als ze in beeld komen.
// Op hover: typewriter char-for-char effect.
document.querySelectorAll('.section-title').forEach((title) => {
  const text = title.textContent.trim();
  title.setAttribute('data-text', text);

  if (prefersReducedMotion) {
    // Geen animatie, direct tonen
    title.classList.add('visible');
    return;
  }

  const words = text.split(/\s+/);

  const buildWords = (stayVisible) => {
    title.innerHTML = words.map((word, i) =>
      `<span class="st-word-wrap"><span class="st-word"` +
      (stayVisible ? ` style="transform:translateY(0);transition:none"` : ` style="transition-delay:${i * 95}ms"`) +
      `>${word}</span></span>`
    ).join(' ');
  };

  buildWords(false);

  // IntersectionObserver: voeg .visible toe zodra titel in beeld komt
  const titleObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        titleObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  titleObs.observe(title);

  // Hover: typewriter over originele tekst
  title.addEventListener('mouseenter', () => {
    title.innerHTML = text
      .split('')
      .map((ch) => `<span class="char" style="display:inline-block">${ch === ' ' ? '&nbsp;' : ch}</span>`)
      .join('');
    title.querySelectorAll('.char').forEach((ch, i) => {
      ch.style.opacity = '0';
      setTimeout(() => { ch.style.opacity = '1'; }, i * 65);
    });
  });

  // Na hover: herstel word-split (zichtbaar, geen heranimatie)
  title.addEventListener('mouseleave', () => {
    buildWords(true);
  });
});

// ── Typewriter hover op project-hero titels ──────────────────
document.querySelectorAll('.project-hero__title').forEach((title) => {
  title.innerHTML = title.textContent
    .split('')
    .map((ch) => `<span class="char" style="display:inline-block">${ch === ' ' ? '&nbsp;' : ch}</span>`)
    .join('');

  title.addEventListener('mouseenter', () => {
    title.querySelectorAll('.char').forEach((ch, i) => {
      ch.style.opacity = '0';
      setTimeout(() => { ch.style.opacity = '1'; }, i * 65);
    });
  });
});

// ── Scroll progress bar ──────────────────────────────────────
(function () {
  const bar = document.getElementById('scroll-progress');
  if (!bar || prefersReducedMotion) return;

  let ticking = false;

  const updateBar = () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${total > 0 ? scrolled / total : 0})`;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateBar);
      ticking = true;
    }
  }, { passive: true });
})();

// ── Parallax: homepage hero ───────────────────────────────────
// De inhoud van de hero trekt achter bij het scrollen — meer
// parallax-factor voor een zichtbaarder diepte-effect.
(function () {
  const heroSection = document.querySelector('.hero');
  const heroInner   = document.querySelector('.hero__inner');
  if (!heroSection || !heroInner || prefersReducedMotion) return;

  const heroH = heroSection.offsetHeight;
  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    if (y < heroH * 1.5) {
      heroInner.style.transform = `translateY(${y * 0.32}px)`;
    }
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
})();

// ── Custom cursor ─────────────────────────────────────────────
// Dot volgt muis direct. Ring volgt met lerp-vertraging.
// Alleen op pointer:fine (desktop met muis).
(function () {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.className  = 'cursor-dot is-hidden';
  ring.className = 'cursor-ring is-hidden';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mouseX = -200, mouseY = -200;
  let ringX  = -200, ringY  = -200;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
    dot.classList.remove('is-hidden');
    ring.classList.remove('is-hidden');
  });

  document.addEventListener('mouseleave', () => {
    dot.classList.add('is-hidden');
    ring.classList.add('is-hidden');
  });

  // Ring: soepele volgbeweging via lineaire interpolatie
  if (!prefersReducedMotion) {
    const lerp = (a, b, t) => a + (b - a) * t;
    const tick = () => {
      ringX = lerp(ringX, mouseX, 0.1);
      ringY = lerp(ringY, mouseY, 0.1);
      ring.style.left = ringX + 'px';
      ring.style.top  = ringY + 'px';
      requestAnimationFrame(tick);
    };
    tick();
  } else {
    document.addEventListener('mousemove', (e) => {
      ring.style.left = e.clientX + 'px';
      ring.style.top  = e.clientY + 'px';
    });
  }

  // Hover-staat: dot krimpt, ring groeit
  document.querySelectorAll('a, button, [role="button"], .project-card, .showcase__card-inner').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('is-hover');
      ring.classList.add('is-hover');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('is-hover');
      ring.classList.remove('is-hover');
    });
  });
})();

// ── Parallax: detail-pagina hero afbeelding ───────────────────
// De afbeelding beweegt trager dan de pagina (klassieke parallax).
// .project-hero__img-wrap heeft overflow:hidden — de afbeelding
// begint met scale(1.08) zodat er geen witruimte verschijnt.
(function () {
  const wrap = document.querySelector('.project-hero__img-wrap');
  const img  = document.querySelector('.project-hero__img');
  if (!wrap || !img || prefersReducedMotion) return;

  let ticking = false;

  const update = () => {
    const y         = window.scrollY;
    const wrapBot   = wrap.getBoundingClientRect().bottom + y;
    if (y < wrapBot) {
      // Negatieve Y: beeld beweegt omhoog binnen de wrapper
      img.style.transform = `scale(1.08) translateY(${y * -0.12}px)`;
    }
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
})();
