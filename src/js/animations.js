// Scroll-triggered reveals via IntersectionObserver
// Voeg class 'reveal' toe aan elk element dat moet animeren bij scrollen

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // eenmalig
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
