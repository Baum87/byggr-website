// Scroll-triggered reveals — IntersectionObserver
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
  { threshold: 0.04 }
);

document.querySelectorAll(revealSelector).forEach((el) => observer.observe(el));
