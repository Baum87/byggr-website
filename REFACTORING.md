# Refactoring Plan — Byggr.nl

> Status: in behandeling  
> Kleine fixes: zie commit-log  
> Grote refactors: onderstaand

---

## Grote refactors (aparte sprint)

### R1 — Canvas samenvoegen tot één module

**Probleem**  
De mesh canvas is twee keer geïmplementeerd:
- `src/js/byggr-canvas.js` — homepage, scroll-driven (349 regels)
- Inline `<script>` in `_includes/layouts/detail.njk` — subpagina, ambient loop (~90 regels)

Beide delen identieke code: `mulberry32` PRNG (seed `20260621`), 15×9 grid, dezelfde constanten, dezelfde node/edge-generatie en dezelfde draw-loop. Alleen de aansturing verschilt.

**Doel**  
Één bestand `src/js/mesh.js` dat de mesh genereert en exporteert. Twee consumers:
- `byggr-canvas.js` importeert mesh + voegt scroll-aansturing toe
- `detail-canvas.js` importeert mesh + draait ambient loop

Omdat Eleventy geen bundler heeft, zijn er twee opties:
- **Optie A** — Inline een gedeeld IIFE via Eleventy `{% include %}` of een shortcode
- **Optie B** — Voeg esbuild/rollup toe als build-stap (kleine devDep, geen productie-impact)

**Risico:** Hoog — raakt kern van beide canvas-implementaties.  
**Effort:** ~3u

---

### R2 — Inline JS uit `detail.njk` halen

**Probleem**  
`detail.njk` bevat twee `<script>` blokken (~115 regels JS) inline in een Nunjucks template:
1. Canvas ambient loop (90 regels)
2. Slideshow controller (25 regels)

Dit maakt de template moeilijk leesbaar, Nunjucks-errors cryptisch, en JS niet testbaar.

**Doel**  
- `src/js/detail-canvas.js` — ambient canvas voor subpagina's  
- `src/js/slideshow.js` — slideshow controller  
- Laden via `<script src="..." defer>` in `detail.njk` of `base.njk` (conditioneel via frontmatter)

**Afhankelijkheid:** R1 (canvas module) maakt R2 zinvoller.  
**Risico:** Middel — timing van `defer` vs inline moet getest.  
**Effort:** ~2u

---

### R3 — Fase-ranges single source of truth

**Probleem**  
De 7 fase-boundaries zijn hardcoded op drie plekken:
1. `data-range="0.00,0.12"` in `index.njk` (HTML)
2. `navRanges` array in `byggr-canvas.js` (JS)
3. CLAUDE.md (documentatie)

Wijzig één range → de andere twee kloppen niet meer.

**Doel**  
Eén `_data/phases.json` bestand:
```json
[
  { "id": "start",        "label": "Start",          "range": [0.00, 0.12], "target": 0.05 },
  { "id": "discovery",    "label": "Discovery",      "range": [0.10, 0.27], "target": 0.19 },
  { "id": "architectuur", "label": "Architectuur",   "range": [0.27, 0.46], "target": 0.37 },
  { "id": "iteraties",    "label": "Iteraties",      "range": [0.44, 0.63], "target": 0.53 },
  { "id": "kwaliteit",    "label": "Kwaliteitscontrole", "range": [0.61, 0.80], "target": 0.70 },
  { "id": "resultaat",    "label": "Resultaat",      "range": [0.78, 0.93], "target": 0.86 },
  { "id": "contact",      "label": "Contact",        "range": [0.945, 1.001], "target": 0.97 }
]
```
Eleventy injecteert dit in de HTML als `data-range` én als inline JS-variabele (`window.BYG_PHASES`). `byggr-canvas.js` leest `window.BYG_PHASES` in plaats van de hardcoded array.

**Risico:** Middel — vereist Eleventy data-pipeline + template aanpassing.  
**Effort:** ~2u

---

## Kleine fixes (al uitgevoerd)

Zie commit-log voor:
- animations.js afslanken (dode code verwijderd)
- Carousel dots gegenereerd via JS
- Carousel gap berekening via scrollWidth
- inline onmouseover handlers vervangen
- Cookie banner implementatie gelijkgetrokken
- visibilitychange check in canvas loop
