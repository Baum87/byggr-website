# Byggr.nl — Projectcontext

## Project
Portfolio- en leadgeneratiesite voor Remco (Byggr), freelance web/data/AI-toolbouwer uit Twente.

- **Domein**: byggr.nl (in bezit)
- **Hosting**: Netlify (gratis tier)
- **CMS**: Decap CMS (portfolio beheer via Git)
- **Stack**: Vanilla HTML/CSS/JS
- **Formulieren**: Netlify Forms
- **Startdatum**: 2026-04-13
- **Status**: Sprint 1

## Structuur
Één single-page site (index.html) met anchor-secties. Uitzondering: portfolio-detailpagina's zijn losse HTML-bestanden onder /portfolio/.

### Secties op index.html (in volgorde)
1. `#hero` — tagline, subline, 1 CTA
2. `#diensten` — drie blokken: Websites / BI & Data / AI-tools
3. `#over` — over Remco
4. `#portfolio` — uitgelichte projecten (preview + link naar detailpagina)
5. `#contact` — contactformulier (Netlify Forms)

### Navigatie
Sticky nav met anchor-links. Op mobiel: hamburger menu.

## Design tokens
Zie `src/css/tokens.css`. Pas ALLEEN daar kleuren/typografie aan — nooit hardcoded in andere bestanden.

### Richting (wordt vastgesteld in Sprint 2)
- Achtergrond: near-black (~#111)
- Tekst: gebroken wit
- Accent: TBD in Sprint 2
- Typografie: TBD in Sprint 2 (richting: Space Grotesk / Syne + IBM Plex Mono)

## Animaties
Scroll-triggered reveals via IntersectionObserver in `src/js/animations.js`.
Geen zware libraries — alles vanilla.

## Formulier
Netlify Forms. Het `<form>` element heeft `data-netlify="true"` en `name="contact"`.
Geen Formspree, geen externe dienst.

## Decap CMS
Admin interface op `/admin/`. Beheert portfolio-projecten.
Config: `admin/config.yml`. Content wordt opgeslagen als markdown in `/portfolio/`.

## Deployment
1. Push naar `main` op GitHub
2. Netlify deployt automatisch
3. Preview via Netlify deploy preview URL

## Succesdoel
10 leads/maand na 6 maanden live.

## Inspiratie
dvdrod.com, andrewreff.com, chkstepan.com — dynamisch, interactief, dark, weinig tekst, visueel.

## Wat NIET te doen
- Geen stockfoto's
- Geen hero-carousel
- Geen twee CTA's naast elkaar
- Geen standaard template-uitstraling
- Geen externe CSS frameworks (Bootstrap, Tailwind, etc.)
