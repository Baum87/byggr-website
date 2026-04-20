# BYGGR — To do lijst (na weekend, thuispc)
> Status: april 2026

---

## Eleventy migratie (thuispc — Node.js vereist)

1. Node.js installeren via nodejs.org → LTS versie
2. Bevestig: `node --version` en `npm --version` werken in terminal
3. `npm init` + Eleventy installeren in projektmap
4. Eleventy config (`.eleventy.js`) aanmaken
5. Base layout aanmaken: nav + footer + head als herbruikbare includes
6. Portfolio template bouwen op basis van `afbouwr.html` als referentie
7. Service template bouwen op basis van `websites.html` als referentie
8. Bestaande pagina's (index, privacy, 404, dank-je) omzetten naar Eleventy templates
9. Portfolio-collectie opzetten: auto-generate pagina's vanuit markdown
10. Markdown-bestanden aanmaken voor 4 bestaande projecten (afbouwr, beentelskabaal, kenkhuis, BI-dashboard)
11. Decap CMS config bijwerken zodat markdown → pagina koppeling klopt
12. Netlify.toml bijwerken: build command + publish directory instellen
13. Lokaal testen: eleventy build + alle pagina's checken in browser
14. Overige 6 subpagina's krijgen nieuw design via Eleventy templates (NIET handmatig)
15. Commit + push → Netlify deploy controleren

---

## Openstaand — los van Eleventy

- **Google Search Console** — DNS-verificatie afwachten (TXT-record staat al bij Vimexx)
- **Foto sectie "Over"** — uitgesteld, zodra foto beschikbaar is
- **21:9 hero-afbeelding + typewriter-effect op titels** — CSS/JS klaar, nog niet gecommit

---

## Content klaar en goedgekeurd

- Definitieve copy voor alle 4 services + 4 portfoliopagina's → `content/copy-definitief.md`
- Inclusief business-opmerkingen verwerkt (prijssignaal hosting, CTA-titels, cross-links)

---

## Referentie-pagina's (bouwplan voor Eleventy-templates)

- Portfolio template → `portfolio/afbouwr.html`
- Service template → `services/websites.html`
