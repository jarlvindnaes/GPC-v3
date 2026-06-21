# Astro Migration Plan — Product Connect Front Page

**Status:** Proposed
**Author:** Drafted with Claude, June 2026
**Scope:** Migrate the GPC-v3 marketing site from a Vite client-side React SPA to Astro with React islands, preserving all 3D, scroll, and interactive functionality.

---

## 1. Why

The current site is a **client-side React SPA using `HashRouter`**. That is the wrong shape for a marketing site whose job is to be found, understood, and shared:

- **URLs are `/#/platform`** — bad for SEO, link previews, and analytics.
- **Everything ships as JS** and renders in the browser → first paint waits on the bundle, even for pages that are 90% static text.
- **The full framework cost is paid on every page**, including ones with no interactivity.

Astro fixes all three while letting us keep the parts of React that actually earn their place.

### What we keep React for (the genuine 20%)
- `@react-three/fiber` 3D models — the cleanest way to do declarative Three.js, including the 3D phone with a live HTML page projected onto its screen.
- The interactive DPP mini-app (`src/components/dpp/`) — genuinely stateful app UI.
- Scroll-driven storytelling (`motion/react` `useScroll`/`useTransform`).
- Canvas visualizations (`Hero` network, `StatsSection`, `SupplyChainGlobe`).

### What we stop paying React for (the other 80%)
Hero copy, value sections, pricing, timeline, footer, trust logos — content that should be static HTML.

---

## 2. Goals & Non-Goals

**Goals**
- Real, crawlable URLs (`/platform`, `/dpp`, `/pricing`, `/about`).
- Static HTML for all marketing content; **zero JS shipped** for purely-static sections.
- Interactive pieces hydrate lazily (`client:visible`) so 3D/canvas never blocks first paint.
- Preserve the GitHub Pages (`/GPC-v3/`) and xBuild production deploy paths.
- Incremental, low-risk: every interactive component moves over as the React it already is.

**Non-Goals**
- No redesign. This is an architecture migration, not a content rework. (Content work tracked separately against the April feedback / `Drafts/`.)
- No rewrite of 3D or DPP logic — those move verbatim into islands.
- No move off Tailwind 4 or TypeScript.

---

## 3. Current State (measured)

- **Stack:** Vite 6, React 19, TypeScript, Tailwind 4.
- **Routing:** `HashRouter` in `src/App.tsx`. Routes: `/`, `/platform`, `/dpp`, `/pricing`, `/about`, plus two standalone pages `/dpp-test` and `/html-phone-test` (no navbar/footer).
- **Base path:** `/GPC-v3/` (set in `vite.config.ts`).
- **Deploy:** `npm run deploy` (gh-pages) for the demo; xBuild production via `.claude/deploy.md`.
- **Size:** ~6,600 LOC of components, heavily concentrated:
  - `Native3DModels.tsx` — 1,846
  - `SupplyChainGlobe.tsx` — 870
  - `StorytellingScroll.tsx` — 527
  - `IntegrationSection.tsx` — 393
  - `Hero.tsx` — 345
- **`motion/react` is used in 21 files**, including content sections (`FeatureGrid`, `TrustLogos`, `Testimonials`) that are otherwise static. This is the single biggest source of conversion friction.

**Key insight:** the large files are all interactive and move into islands essentially untouched. The migration does not shrink the codebase — it relocates JS from "always loaded" to "loaded on demand."

---

## 4. Target Architecture

```
src/
  layouts/
    SiteLayout.astro        # navbar + footer + smooth-scroll wrapper, <slot/>
    BareLayout.astro        # standalone pages (dpp-test, html-phone-test)
  pages/                    # file-based routing → real URLs
    index.astro             # Home
    platform.astro
    dpp.astro
    pricing.astro
    about.astro
    dpp-test.astro
    html-phone-test.astro
  components/
    *.astro                 # static sections (new, ported from React)
    react/                  # interactive islands (existing .tsx, mostly unchanged)
```

**Hydration directives** (the core of the migration):

| Directive | Used for | Why |
|---|---|---|
| `client:visible` | All 3D, canvas, scroll-story sections | Don't load/run until scrolled into view — big first-paint win |
| `client:load` | DPP app, global SmoothScroll/BackToTop | Needed immediately/globally |
| *(none)* | Static `.astro` sections | Ships as HTML, zero JS |

---

## 5. Component Classification

| Component | LOC | Bucket | Target |
|---|---:|---|---|
| `Footer` | 112 | Static | `.astro` |
| `Pricing` | 131 | Static (no motion) | `.astro` |
| Hero copy / CTAs / value / timeline | — | Static (from `Drafts/`) | `.astro` |
| `FeatureGrid` | 204 | Content + motion entrance | island `client:visible` **or** CSS-reveal rewrite |
| `TrustLogos` | — | Content + motion entrance | island `client:visible` **or** CSS-reveal rewrite |
| `Testimonials` | 79 | Content + motion entrance | island, **or** drop (April feedback says hold) |
| `Hero` (network canvas + carousel) | 345 | Island | `client:visible` |
| `StorytellingScroll` | 527 | Island | `client:visible` |
| `Native3DModels` | 1,846 | Island | `client:visible` (consumed by others) |
| `SupplyChainGlobe` | 870 | Island | `client:visible` |
| `StatsSection` (network canvas) | 305 | Island | `client:visible` |
| `ChairPhoneShowcase` | 275 | Island | `client:visible` |
| `IntegrationSection` (dynamic SVG) | 393 | Island ⚠ | `client:visible` — see risks |
| `CountdownBanner` | 278 | Island (live timer) | `client:visible` |
| `LcaEngineVisual`, `SupplierDataEntryVisual` | 200/134 | Island | `client:visible` |
| `ScreenshotCarousel`, `WebsiteCardDialog` | 104/175 | Island (stateful UI) | `client:visible` |
| `Navbar` | 171 | Mostly static + mobile toggle | `.astro` + tiny script, or small island |
| `SmoothScroll` (Lenis) | — | Global | `client:load` wrapper ⚠ |
| `BackToTop` | — | Global | `client:load` (or plain script) |
| `dpp/` (13 files, `DppApp` + views) | — | App island | `client:load` on `/dpp` |

---

## 6. Phased Plan

### Phase 0 — Spike (½ day)
- `npm create astro`, add `@astrojs/react`, `@astrojs/tailwind` (Tailwind 4), TypeScript.
- Set `base: '/GPC-v3/'` and `site` in `astro.config.mjs`.
- Stand up **one** page (e.g. `/about`, the simplest) end-to-end to prove the toolchain, Tailwind, and base path work.
- **Exit criteria:** `/about` renders correctly under `/GPC-v3/` in a production build.

### Phase 1 — Plumbing (½ day)
- Port global styles / Tailwind config / fonts.
- Build `SiteLayout.astro` (navbar + footer + smooth-scroll slot) and `BareLayout.astro`.
- Wire `SmoothScroll` (Lenis) and `BackToTop` as `client:load` globals; verify scroll behavior.
- Move shared assets; confirm `import.meta.env.BASE_URL` references still resolve (Astro supports `import.meta.env.BASE_URL`).

### Phase 2 — Static pages & sections (1 day)
- Create file-based pages: `index`, `platform`, `dpp`, `pricing`, `about`, `dpp-test`, `html-phone-test`.
- Port genuinely-static sections to `.astro` (`Footer`, `Pricing`, hero copy, value, timeline).
- Decide per content-section: keep `FeatureGrid`/`TrustLogos`/`Testimonials` as `client:visible` islands (fast, zero rewrite) or convert motion-entrance to a CSS/IntersectionObserver reveal (zero JS, more work). **Recommended: islands first, optimize later.**

### Phase 3 — Interactive islands (1 day)
- Move 3D/canvas/scroll components into `src/components/react/` largely unchanged.
- Mount each with the directive from §5.
- Mount the `dpp/` app as a single `client:load` island on `/dpp`.
- Verify drag/scroll/pointer-event interactions on 3D sections still work (see Common Gotchas in CLAUDE.md re: `pointerEvents` transforms).

### Phase 4 — Deploy & cutover (½ day)
- Update `npm run build`/`deploy` for Astro's static output (`dist/`).
- Repoint `gh-pages` deploy at Astro's `dist/`.
- Update `.claude/deploy.md` xBuild workflow for the new build output and routing (no more hash URLs).
- Set up redirects from old `/#/...` hash URLs to the new paths if any are already shared externally.
- **Exit criteria:** all routes load under `/GPC-v3/`, 3D/DPP work, Lighthouse SEO + first-paint improved over baseline.

---

## 7. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| **`IntegrationSection`** relies on `ResizeObserver` + `getBoundingClientRect` for dynamic SVG paths | Self-contained within the component; test as a `client:visible` island. Logic doesn't change — only when it hydrates. |
| **`SmoothScroll` (Lenis)** is a global DOM concern | Mount as a `client:load` island wrapping page content; verify it composes with Astro's view transitions (or disable those). |
| **`motion` entrance animations** on static sections | Default to keeping them as islands (zero rewrite). Only convert to CSS reveals where the zero-JS win matters. |
| **Pointer-events on 3D sections** (drag vs. overlapping panels) | Preserve existing `pointerEvents` transform logic verbatim; this is component-internal. |
| **Asset base paths** under `/GPC-v3/` | Astro honors `base`; audit every `import.meta.env.BASE_URL` usage during Phase 1. |
| **Two deploy targets** (gh-pages + xBuild) | Update both in Phase 4; keep gh-pages working throughout as the canary. |

---

## 8. Effort & Sequencing

**Total: ~2–4 focused days.** Mechanical and incremental — the static shell can render while every interactive piece stays the React already written.

**Recommended sequencing:** do the content/narrative rework first (April feedback + `Drafts/`), *then* run this migration as a "harden for launch" pass once the page structure has stopped moving. Migrating while layout is still in flux means paying the per-section conversion cost twice.

---

## 9. Decision Log

- **Astro + React islands** chosen over (a) staying a Vite SPA — loses SEO/URLs/first-paint; (b) full vanilla HTML rewrite — loses the 3D and DPP app that differentiate the site; (c) Next.js — heavier than needed for a mostly-static marketing site with a few interactive islands.
