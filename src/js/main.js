// ── Nav: transparant → solid bij scrollen ─────────────────────
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('nav--scrolled', window.scrollY > 60);
}, { passive: true });

// ── Theme toggle ──────────────────────────────────────────────
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;
// Voorkeur is al toegepast via inline script in <head> — hier alleen de toggle

themeToggle?.addEventListener('click', () => {
  const isDark = html.getAttribute('data-theme') === 'dark';
  if (isDark) {
    html.removeAttribute('data-theme');
    localStorage.setItem('byggr-theme', 'light');
    themeToggle.setAttribute('aria-label', 'Wisselen naar donker thema');
  } else {
    html.setAttribute('data-theme', 'dark');
    localStorage.setItem('byggr-theme', 'dark');
    themeToggle.setAttribute('aria-label', 'Wisselen naar licht thema');
  }
});

// ── Hamburger menu ─────────────────────────────────────────────
const hamburger = document.querySelector('.nav__hamburger');
const mobileMenu = document.querySelector('.nav__mobile-menu');

hamburger?.addEventListener('click', () => {
  const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
  hamburger.setAttribute('aria-expanded', String(!isOpen));
  mobileMenu.classList.toggle('is-open');
  document.body.classList.toggle('no-scroll');
});

// Sluit mobiel menu bij klik op link
document.querySelectorAll('.nav__mobile-link').forEach((link) => {
  link.addEventListener('click', () => {
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  });
});

// Sluit mobiel menu met Escape-toets
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    hamburger.focus();
  }
});

// ── Showcase marquee — auto-scroll + drag ─────────────────────
(function () {
  const stage = document.querySelector('.showcase__stage');
  const track = document.querySelector('.showcase__track');
  if (!stage || !track) return;

  const speed = 0.85; // px per frame
  let isPaused   = false;
  let isDragging = false;
  let startX     = 0;
  let startScroll = 0;

  function halfWidth() {
    return track.scrollWidth / 2;
  }

  function loop() {
    if (!isDragging && !isPaused) {
      stage.scrollLeft += speed;
      if (stage.scrollLeft >= halfWidth()) {
        stage.scrollLeft -= halfWidth();
      }
    }
    requestAnimationFrame(loop);
  }

  // Hover: pauzeer
  stage.addEventListener('mouseenter', () => { isPaused = true; });
  stage.addEventListener('mouseleave', () => {
    isPaused   = false;
    isDragging = false;
    stage.classList.remove('is-dragging');
  });

  // Mouse drag
  stage.addEventListener('mousedown', (e) => {
    isDragging  = true;
    startX      = e.pageX;
    startScroll = stage.scrollLeft;
    stage.classList.add('is-dragging');
    e.preventDefault();
  });
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx  = startX - e.pageX;
    let next  = startScroll + dx;
    const hw  = halfWidth();
    if (next >= hw) next -= hw;
    if (next < 0)   next += hw;
    stage.scrollLeft = next;
  });
  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    isPaused   = false;
    stage.classList.remove('is-dragging');
  });

  // Touch drag
  stage.addEventListener('touchstart', (e) => {
    startX      = e.touches[0].pageX;
    startScroll = stage.scrollLeft;
    isDragging  = true;
    isPaused    = true;
  }, { passive: true });
  stage.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const dx  = startX - e.touches[0].pageX;
    let next  = startScroll + dx;
    const hw  = halfWidth();
    if (next >= hw) next -= hw;
    if (next < 0)   next += hw;
    stage.scrollLeft = next;
  }, { passive: true });
  stage.addEventListener('touchend', () => {
    isDragging = false;
    isPaused   = false;
  });

  requestAnimationFrame(loop);
})();

