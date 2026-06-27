# Handoff: Byggr Homepage — "Van idee naar product"

## Overview
A single-page, scroll-driven homepage for **Byggr**, a digital studio in Delden (NL).
The core idea: **the scroll motion *is* the studio's way of working.** The page loads
almost empty (one idea), and with every step the visitor scrolls, more appears —
loose points → structure → refinement → a quality "sweep" that snaps everything onto a
perfect grid → a finished, complete image. The visitor literally builds a digital
product, phase by phase, instead of just reading about it.

There is **no fixed navigation bar**. One continuous narrative on scroll, with a thin
top progress bar and a minimal phase indicator (right side) that doubles as a jump menu.

## About the Design Files
The files in this bundle are **design references created in HTML/Canvas** — a working
prototype showing the intended look, motion, and scroll choreography. They are **not
production code to copy directly**.

The task is to **recreate this design in the target codebase's environment** (React,
Vue, Svelte, etc.) using its established patterns. If no environment exists yet, a
lightweight setup (Vite + React or plain TS) is fine — the page is mostly one full-screen
`<canvas>` driven by scroll, plus a handful of absolutely-positioned text overlays, so it
has very few framework dependencies.

> **Note on the prototype runtime:** the `.dc.html` files use an internal component
> runtime (`support.js`). Ignore that runtime when porting. Everything that matters lives
> in (a) the template markup (the overlays + DOM scaffold) and (b) the logic class
> (the canvas animation + scroll driver). Lift the *logic and values*, not the runtime.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, motion timing, and the full
canvas algorithm are specified below and present in the prototype. Recreate pixel- and
motion-faithfully. The only placeholders are the **case-study images** (striped
placeholders) and **contact details** — these are meant to be replaced with real content.

---

## Architecture / Scroll Mechanism (read first)

The entire experience is one **"scrollytelling" stage**:

- A tall outer container (`height: 900vh`) provides the scroll distance.
- Inside it, a `position: sticky; top: 0; height: 100vh` **stage** stays pinned while the
  container scrolls past it.
- A normalized scroll progress **`p` ∈ [0, 1]** is computed every frame:
  `p = clamp((scrollY - container.offsetTop) / (container.offsetHeight - innerHeight), 0, 1)`
- `p` drives **everything**: the canvas build, overlay cross-fades, the progress bar, the
  phase nav, and the vignette opacity.

Layers inside the stage (z-order):
1. `z0` — full-screen `<canvas>` (the generative mesh + idea dot + quality sweep)
2. `z1` — radial **vignette** div (darkens center so text stays readable over the mesh;
   its opacity is animated — see below)
3. `z4` — **phase overlay** container (the text blocks, services grid, cases, CTA)
4. `z6` — top **progress bar**
5. `z7/z8` — **wordmark** (top-left), **Cases/Contact links** (top-right), **phase nav**
   (right middle)

### Smoothing
Two reasons the loop runs on `requestAnimationFrame` rather than purely on scroll events:
1. The canvas has idle motion (the idea dot "breathes", nodes jitter before settling).
2. `p` is eased toward its target each frame (`this.p += (target - this.p) * 0.12`) for
   buttery motion. **Also** draw directly on the `scroll` event (don't rely on rAF alone)
   so it still updates in environments that throttle rAF in hidden tabs.

---

## Phases (overlay content)

Each overlay is an absolutely-positioned full-screen flex block, **centered** (align +
text-align center), tagged with a scroll range `data-range="start,end"`. It cross-fades:
`opacity = clamp(min((p-start)/0.045, (end-p)/0.045, 1), 0, 1)` and lifts
`translateY((1-opacity)*16px)`. (Edge cases: the first overlay has no fade-in, the last
no fade-out.)

| # | Phase | Scroll range (p) | Kicker | Headline (exact copy) |
|---|-------|------------------|--------|-----------------------|
| 1 | Start | 0.00–0.12 | — | **elk product begint met _een idee_** (lowercase; "een idee" in accent) |
| 2 | Discovery | 0.10–0.29 | 01 — Discovery | We beginnen met vragen, niet met aannames. |
| 3 | Architectuur | 0.27–0.46 | 02 — Architectuur | Losse ideeën worden een fundament. |
| 3b | Services grid | 0.295–0.455 | — | 4 blocks: Websites / BI & Data / AI-tools / Hosting |
| 4 | Iteraties | 0.44–0.63 | 03 — Iteraties | Goed wordt beter — iteratie na iteratie. |
| 5 | Kwaliteitscontrole | 0.61–0.80 | 04 — Kwaliteitscontrole | Alles valt op zijn plek. |
| 6 | Resultaat (text) | 0.78–0.93 | 05 — Resultaat | **Van idee naar _product_.** (heaviest weight; "product" in accent) |
| 6b | Cases preview | 0.81–0.935 | — | 3 case cards (placeholder imagery) |
| 7 | Contact / CTA | 0.945–1.001 | — | Klaar om iets te bouwen dat klopt? |

**Sub-copy:**
- Discovery `<p>`: "De eerste lijnen verschijnen. Nog niets staat vast — en juist dat is het punt."
- Iteraties `<p>`: "Niets is af bij de eerste versie. Vorm krijgt vorm."
- Kwaliteit `<p>`: "Precisie is geen detail. Het is het vak."
- Services blocks sub-copy: "Sites die werken zoals ze horen." / "Inzicht uit ruwe cijfers." / "Slimme tools, op maat gebouwd." / "Betrouwbaar draaiend, dag en nacht."
- CTA buttons: **Bekijk cases** (solid accent) · **Neem contact op** (outline)
- CTA footer line: "Byggr · Delden · hello@byggr.nl"

**Pacing note:** ranges are deliberately sequenced so the Resultaat quality-sweep fully
finishes (~p 0.90) and the completed image gets a beat before the Contact overlay fades in
(~p 0.945). Don't let Contact overlap the still-animating Resultaat.

---

## The Canvas: generative mesh ("data layer")

A grid of nodes connected by edges, generated once on mount with a **seeded PRNG**
(mulberry32, seed `20260621`) so the layout is deterministic. All node coordinates are
**normalized 0–1** and multiplied by canvas W/H at draw time. Canvas uses
`devicePixelRatio` (capped at 2).

### Generation
- Grid: **15 columns × 9 rows** (135 nodes).
- Grid extent (normalized): x ∈ [0.115, 0.885], y ∈ [0.16, 0.84].
- For each node store:
  - `gx, gy` — **exact grid position** (no jitter) → used by the quality sweep.
  - `tx, ty` — **organic target** = grid position + small random offset
    (±0.012 x, ±0.017 y). This is the slightly-irregular "built" look.
  - `sx, sy` — **start position** (where it animates *from* as it's born):
    - ~20% of nodes are flagged `isEarly` and start **near screen center**
      (0.5 ± a small radius) so they look like they **disperse out of the idea dot**.
    - the rest start at a random scattered position.
  - `birth` — when the node appears, mostly proportional to its distance from center
    (center builds first, edges last); `isEarly` nodes get birth ≈ 0–0.12.
  - `rowFrac = r/(rows-1)` — used by the sweep.
  - `hub` — ~12% of nodes are accent-blue "hub" dots (bigger, glowing); rest are off-white.
- Edges: connect each node to its right and bottom neighbor, plus ~32% diagonal
  neighbors. Each edge has a `reveal` threshold and a 16% chance of being accent-colored.

### Build progress
`b = clamp((p - 0.10) / 0.78, 0, 1)` — the global build amount. The mesh **begins
appearing at Discovery (p≈0.10) and is complete by p≈0.88**, just before Resultaat.
- A node's local growth: `nl = clamp((b - birth) / 0.28, 0, 1)`, eased (cubic). Position
  interpolates `start → target` by `ease(nl)`. Before settling, a node has a tiny
  sinusoidal **jitter** that dies as it grows.
- An edge's growth: `el = clamp((b - reveal) / 0.12, 0, 1)`; it draws from node A toward
  node B, the far end extending with `el`.
- Node/edge opacity scales with `b` so the whole field brightens as it fills in.

### The idea dot (Start → Discovery)
One large soft blue dot, centered, represents "the idea". It is drawn on the canvas so it
can morph into the data layer:
- `ideaLife = clamp(1 - p/0.23, 0, 1)` (visible from Start into Discovery).
- `ideaJE = ease(clamp(p/0.23, 0, 1))` — journey 0→1.
- Position **sinks** from center (0.5, 0.5) → (0.52, 0.63) as you scroll.
- Radius **shrinks** from ~0.22·min(W,H) down to ~2px (a normal data-dot size).
- It morphs from a **soft halo+gradient** (when large) to a **crisp little blue point**
  (a small bright core fades in smoothly across the journey — no hard pop), then
  disappears among the real points = "the idea becomes one of many".
- While it descends, nearby `isEarly` points briefly **flare** (proximity-based glow) as
  if its energy spreads to neighbors.
- At rest (Start) it gently **breathes** (slow sine scale) so the screen isn't static.
- The **vignette** (z1) opacity ramps `0.3 → 1.0` across p∈[0.02, 0.22] so the dot reads
  clearly at Start and the vignette is full for text legibility later.

### The quality sweep (Resultaat) — "straightening"
A horizontal band falls **top → bottom** and snaps each row from its organic position onto
the **exact grid**, so all points end up perfectly aligned in columns *and* rows. This is
the "kwaliteitscontrole/afwerking" made literal.
- `sweepStart = 0.78`, `sweepEnd = 0.90`, `feather = 0.16`.
- `sweepFrac = clamp((p - sweepStart)/(sweepEnd - sweepStart), 0, 1)` (persists at 1 after).
- `bandPos = sweepFrac * (1 + feather)` travels across `rowFrac` space.
- Per node: `straight = clamp((bandPos - rowFrac)/feather, 0, 1)` →
  position = `lerp(organicPos, gridPos, straight)`; jitter dies as `straight→1`.
- Above the band = strict grid; below = still loose. Each row gives a brief **snap flash**
  (`sin(straight·π)`) as the band passes, and **edges follow** the straightened positions.
- The band itself: a soft blue gradient (`rgba(79,168,255,0.14)` peak) ~140px tall with a
  crisp 1px leading line, positioned exactly on the row currently snapping. Persists
  straight after the sweep completes.

---

## Interactions & Behavior
- **Top-right links** ("Cases", "Contact") and **right-side phase nav** smooth-scroll to a
  target fraction: `scrollTo({ top: container.offsetTop + frac*total, behavior:'smooth' })`.
- **Phase nav** appears once `p > 0.04`; the active phase tick widens to 26px and turns
  accent blue with a glow; labels brighten. Phase ranges:
  `[0,0.10] [0.10,0.27] [0.27,0.46] [0.46,0.61] [0.61,0.78] [0.78,0.92] [0.92,1.01]`.
- **Progress bar** width = `p*100%`, accent blue with glow.
- All hover states: links/nav fade from `rgba(236,234,228,.55)` to full `#ecece4`.
- `resize` re-reads stage size and re-sets the canvas backing store (×dpr).

## State Management
Minimal — no app state, no data fetching. Just:
- `p` (eased) and `targetP` (raw from scroll) on the animation controller.
- One `requestAnimationFrame` loop + a passive `scroll` listener (which also draws
  directly). Clean both up on unmount.
- Node/edge arrays are generated once and mutated in place per frame (`_x/_y/_str/_nl`
  scratch fields) for performance.

---

## Design Tokens

### Colors
| Token | Hex / value | Use |
|-------|-------------|-----|
| Ink (page bg) | `#0a0b0d` | page + stage background |
| Panel | `#0c0e12` | service blocks, case cards |
| Foreground | `#ecece4` | primary text, off-white nodes |
| FG muted | `rgba(236,234,228,.55)` | body copy |
| FG faint | `rgba(236,234,228,.32–.42)` | labels, inactive nav |
| Accent | `#4fa8ff` (`rgb(79,168,255)`) | the one accent — dots, edges, highlights, CTA |
| Accent bright | `rgb(110–150, 185–205, 255)` | idea-dot core / snap flashes |
| Edge (non-accent) | `rgba(150,172,205, α)` | mesh lines |
| Hairline | `rgba(236,234,228,.10–.12)` | borders, dividers |

### Typography
- **Display / UI:** `Archivo` (Google Fonts), weights 400/600/700/800/900. Headlines 800;
  Resultaat headline 900. Tight tracking on big type (`letter-spacing: -.032 to -.05em`).
  Start headline is `text-transform: lowercase`.
- **Labels / mono:** `Space Mono`, used for kickers, the wordmark microcopy, nav labels,
  placeholders, footers. Uppercase, letter-spacing ~.16–.34em.
- Headline sizes are fluid `clamp()`:
  - Start H1: `clamp(48px, 10vw, 158px)`
  - Section H2: `clamp(34px, 5.6vw, 86px)`
  - Kwaliteit H2: `clamp(36px, 6vw, 96px)`
  - Resultaat H2: `clamp(40px, 7vw, 118px)`
  - CTA H2: `clamp(38px, 6.4vw, 100px)`

### Logo (chosen: "B — roundel")
`BYGGR` in **uppercase**, Archivo 800, `letter-spacing: .02em`, color `#ecece4`, with a
thin **accent-blue ring behind** it (the word cuts through the ring's middle):
- Header scale: word 19px; ring 34px circle, `border: 1.5px solid rgba(79,168,255,.6)`,
  soft glow `box-shadow: 0 0 18px rgba(79,168,255,.16)`. Ring centered behind the word.
- Large scale (optional, for Contact/footer): word ~54px; ring 96px, `border: 2px`.

Other explored options live in **BYGGR Logo opties.dc.html** (A/A2/B/B2) for reference.

### Spacing / radius / motion
- Generous full-bleed phases; horizontal padding `~6–9vw`.
- Radii: near-zero (`2px`) — Swiss/brutalist; cards and blocks are effectively square.
- Service grid: 4 columns, `1px` gaps over a hairline bg (creates thin dividers).
- Cases grid: 3 columns, `22px` gap, `16/10` image aspect.
- Cross-fade feather: `0.045` in p-space. Overlay lift: `16px`.
- Easing: cubic in-out for journeys; smoothstep for the crisp-core fade.

## Assets
- **Fonts:** Archivo + Space Mono via Google Fonts (swap for self-hosted in prod if desired).
- **No icon set, no SVG illustration.** The only "imagery" is the live canvas.
- **Case images:** currently striped placeholders
  (`repeating-linear-gradient(135deg, rgba(79,168,255,.10) 0 2px, transparent 2px 11px)`
  with a `[ case-beeld ]` mono label). Replace with real 16:10 case screenshots.
- **Contact details** ("hello@byggr.nl") are placeholder.

## Files
- `Byggr Homepage.dc.html` — the full prototype (markup + canvas logic). Primary reference.
- `BYGGR Logo opties.dc.html` — logo exploration (chosen option = **B**, the roundel).
- `screenshots/` — six rendered reference frames (01-start … 06-resultaat) showing the
  mesh state + overlay at each phase. These are faithful re-renders of the canvas
  algorithm at fixed scroll positions (the live `<canvas>` can't be screenshotted directly).
  Note: in these stills the accent words ("een idee", "product") are drawn white for
  simplicity — in the real design they are accent blue `#4fa8ff` (see Phases table).
- `support.js` — the prototype runtime only; **not part of the design**, do not port.

## Recommended port approach
1. One full-screen `<canvas>` + a `ResizeObserver`; a scroll controller computing `p`.
2. Port the node/edge generation (seeded PRNG) and the per-frame `draw(p, now)` verbatim —
   it's plain Canvas 2D math, framework-agnostic.
3. Render the phase overlays as normal DOM (absolutely positioned), driving their opacity
   from `p` in the same rAF loop (or via CSS scroll-timeline if targeting modern browsers).
4. Keep the single accent color and the inline-style discipline; this design intentionally
   has no rounded corners, no gradients-as-decoration, no stock imagery.
