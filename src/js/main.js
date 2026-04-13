// Nav: transparant → solid bij scrollen
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('nav--scrolled', window.scrollY > 60);
}, { passive: true });

// Hamburger menu
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

// Actieve nav-link op basis van scroll positie
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
const activateNavLink = () => {
  let current = '';
  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 120) current = section.id;
  });
  navLinks.forEach((link) => {
    link.classList.toggle('is-active', link.getAttribute('href') === `#${current}`);
  });
};
window.addEventListener('scroll', activateNavLink, { passive: true });
