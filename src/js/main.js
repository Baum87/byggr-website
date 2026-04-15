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

