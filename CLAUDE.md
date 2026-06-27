# Byggr.nl — Projectcontext

## Project
Portfolio- en leadgeneratiesite voor Remco (Byggr), freelance web/data/AI-toolbouwer uit Twente.

- **Domein**: byggr.nl (in bezit)
- **Hosting**: Netlify (gratis tier)
- **CMS**: Decap CMS (portfolio beheer via Git)
- **Stack**: Vanilla HTML/CSS/JS + Eleventy (static site generator, `.njk` templates)
- **Formulieren**: Netlify Forms
- **Startdatum**: 2026-04-13
- **Status**: Sprint 2 — live, finetuning

## Structuur

### Homepage — scrollytelling canvas (`index.njk`)
De homepage is één sticky canvas-ervaring van 900vh. Een `position:sticky` stage van 100vh blijft gepind terwijl de container ervoorbij scrolt. Scroll-progress `p ∈ [0,1]` stuurt alles aan: canvas, overlays, progress bar en fase-navigatie.

**7 fasen (scroll-ranges):**
| # | Fase | p-range |
|---|------|---------|
| 1 | Start | 0.00–0.12 |
| 2 | Discovery | 0.10–0.29 |
| 3 | Architectuur | 0.27–0.46 |
| 4 | Iteraties | 0.44–0.63 |
| 5 | Kwaliteitscontrole | 0.61–0.80 |
| 6 | Resultaat + cases | 0.78–0.935 |
| 7 | Contact / CTA | 0.945–1.001 |

**Canvas:** generative mesh van 15×9 nodes, seeded PRNG (mulberry32, seed `20260621`). Nodes bouwen op via scroll, quality sweep (p 0.78–0.90) snapt alles naar exacte grid. Logic zit inline in `index.njk`.

**Navigatie op homepage:** geen traditionele sticky nav. Wordmark top-left, Cases/Contact top-right, fase-nav rechts (verschijnt na p > 0.04).

### Casepagina's (`portfolio/*.md` + `_includes/layouts/detail.njk`)
Content in Markdown, gegenereerd via Eleventy. Template in `detail.njk`.

**Actieve cases:**
- `afbouwr.md` — Calculator / Webapplicatie
- `beentelskabaal.md` — Website
- `bi-dashboard-baumeister.md` — BI Dashboard (bestandsnaam behouden voor URL-stabiliteit)
- `ratio.md` — Web-app Vermogensbeheer + fiscaal (in ontwikkeling, screenshots volgen)

**nextUrl-keten:** afbouwr → beentelskabaal → bi-dashboard → ratio → afbouwr

**Hero casepagina's:** ambient canvas-animatie (zelfde mesh, geen scroll-effect), 65vh hoog, fog-gradient, tekst onderaan. Canvas alleen actief bij `pageType == 'portfolio'`.

### Overige pagina's
- `werkwijze.html` — scrollytelling werkwijze-pagina (losse HTML, zelfde stijl)
- `dank-je.njk` — bedankpagina na formulier
- `privacy.njk` — privacyverklaring
- `admin/` — Decap CMS interface

## Design tokens (vastgesteld)
Tokens zitten **inline** in `index.njk`, `detail.njk` en `base.njk` — er is geen aparte `tokens.css`.

| Token | Waarde | Gebruik |
|-------|--------|---------|
| Achtergrond | `#0a0b0d` | pagina + canvas bg |
| Panel | `#0c0e12` | cards, service-blokken |
| Foreground | `#ecece4` | primaire tekst, nodes |
| FG muted | `rgba(236,234,228,.55)` | bodytekst |
| FG faint | `rgba(236,234,228,.32–.42)` | labels, inactieve nav |
| Accent | `#4fa8ff` | de enige accentkleur — dots, edges, CTA, kickers |
| Edge (non-accent) | `rgba(150,172,205, α)` | mesh-lijnen |

## Typografie
- **Display / UI:** `Archivo` (Google Fonts), weights 400/600/700/800/900
- **Labels / mono:** `Space Mono`, voor kickers, nav, wordmark, tags
- Headline sizes: fluid `clamp()` — zie faseoverzicht in `newLook/README.md`

## Logo
`BYGGR` uppercase, Archivo 800, `letter-spacing:.02em`, kleur `#ecece4`, met dunne accent-blauwe ring erachter (`border: 1.5px solid rgba(79,168,255,.6)`).

## Animaties
- Homepage: canvas via `requestAnimationFrame` + passieve scroll-listener (inline JS in `index.njk`)
- Casepagina's: ambient mesh in hero (inline JS in `detail.njk`)
- Overige reveals: `IntersectionObserver` in `src/js/animations.js`
- Geen zware libraries — alles vanilla

## Deployment
1. Push naar `master` op GitHub (branch is `master`, niet `main`)
2. Netlify deployt automatisch
3. `_site/` is de gegenereerde output — **nooit direct bewerken**

## Decap CMS
Admin interface op `/admin/`. Content in `/portfolio/*.md`.
Config: `admin/config.yml`.

## Formulier
Netlify Forms. `data-netlify="true"` en `name="contact"` op het form-element.

## Succesdoel
10 leads/maand na 6 maanden live.

## Wat NIET te doen
- Geen stockfoto's
- Geen externe CSS frameworks (Bootstrap, Tailwind, etc.)
- Tokens nooit hardcoded buiten de bestaande inline styles — consistentie bewaken
- `_site/` nooit handmatig bewerken (wordt overschreven door Eleventy build)
- Geen tweede accentkleur introduceren naast `#4fa8ff`
