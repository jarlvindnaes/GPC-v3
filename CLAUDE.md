# CLAUDE.md — AI Context for Product Connect Frontpage

## What is this project?

A marketing website for **Product Connect** — a B2B SaaS platform that helps furniture manufacturers:
- Digitise products from 3D construction models into verified digital twins
- Manage supply chain data with supplier verification portals
- Calculate lifecycle environmental impact (LCA) per component
- Generate ESPR-compliant Digital Product Passports (DPP)
- Enable direct-to-consumer spare parts and commerce via QR codes on products

The site is designed to showcase these capabilities through interactive 3D models, scroll-driven storytelling, and premium data visualizations.

## Architecture

### Build & Deploy
- **Vite 6** with React 19 + TypeScript
- **Tailwind CSS 4** (utility-first, no separate CSS files)
- Deployed to **GitHub Pages** at `jarlvindnaes.github.io/GPC-v3/`
- Deploy command: `npm run deploy` (builds + pushes `dist/` to `gh-pages` branch)
- **Production deploy** to xBuild: follow `.claude/deploy.md` — when user says "deploy", run the full deployment workflow automatically and post the PR link when done
- Base URL: `/GPC-v3/` (configured in `vite.config.ts`)

### Key Libraries
- `motion/react` — Animation (scroll transforms, entrance animations, spring physics)
- `@react-three/fiber` + `@react-three/drei` — 3D rendering (GLB models, controls, shadows)
- `three` — Underlying 3D engine
- `lucide-react` — Icon library

## Important Components

### `Hero.tsx`
The top banner. Contains a `HeroNetwork` canvas component that renders floating, labeled nodes in a blue/orange/purple color scheme. Nodes drift, connect with proximity lines, and repel from mouse cursor. Also contains `HeroCarousel` for product screenshots.

### `StorytellingScroll.tsx`
The core "How it works" section. Uses `useScroll` + `useTransform` for a 7-step sticky scroll experience. Each step fades in text on the left and a visual on the right (3D model, data card, or animated graphic). A metro line tracks scroll progress. Below the sticky section is a standalone "grand finale" section with an interactive 3D chair.

### `Native3DModels.tsx`
All 3D model components live here:
- `FinishedProduct3DCanvas` — Story section chair
- `Components3DCanvas` — Steel bolt
- `RawMaterial3DCanvas` — Emerald crystal
- `PassportChair3DCanvas` — Finale chair with QR tag (uses `Html` from Drei for 3D-positioned HTML)
- `DPPInteractiveProduct` — DPP page interactive model
- All use `PresentationControls` for drag, `Float` for idle oscillation, `ContactShadows` for grounding

### `IntegrationSection.tsx`
System integration diagram. **Critical design decision**: SVG paths are computed dynamically from DOM positions using refs + `getBoundingClientRect` + `ResizeObserver`. This was done because static SVG coordinates could never reliably match CSS-positioned elements across viewport sizes. The `viewBox` is set to match container pixel dimensions for 1:1 coordinate mapping.

### `StatsSection.tsx`
"Backbone of sustainable manufacturing" stats. Features a `NetworkCanvas` (HTML5 Canvas) with 150 nodes in a circular pattern, connected by lines to a central anchor. Nodes gravitate toward mouse cursor and have idle sine/cosine drift.

### `CountdownBanner.tsx`
ESPR 2027 deadline countdown. Light theme (white background), Stripe-inspired minimal design with large monospace numbers.

## Common Gotchas

1. **Motion import path**: Use `motion/react`, NOT `framer-motion`
2. **Asset paths**: Always prefix with `import.meta.env.BASE_URL` for GitHub Pages compatibility
3. **3D model clipping**: When adjusting model `scale`, also check the container dimensions and camera `fov` — larger models need larger containers or wider FOV
4. **Integration diagram paths**: Never hardcode SVG coordinates — the dynamic computation system handles this automatically. Just position elements with CSS and the paths follow.
5. **Canvas DPR**: Always handle `window.devicePixelRatio` when using HTML5 Canvas for sharp rendering on Retina displays
6. **Pointer events on 3D sections**: The storytelling scroll uses `pointerEvents` transforms to prevent invisible overlapping panels from blocking 3D model drag interaction

## Commit Standards

### Message Format
- **Imperative form** — "Add feature" not "Added feature" or "Adding feature"
- **Start with capital letter** — "Fix validation" not "fix validation"
- **No ending punctuation** — "Update component" not "Update component."
- **Single line only** — multi-line commit messages are forbidden
- **Describe the change and motivation** — "Add caching to improve API response time"

### Good Examples
```
Add user dashboard API endpoint
Implement status polling with TanStack Query
Remove unused translations to reduce bundle size
Extract WebsiteCard component from inline card implementations
```

### Forbidden Patterns
```
wip                                          # Too vague
Fixed bug                                    # Which bug? Where?
Updates to components                        # Which components? What updates?
More changes.                                # Vague + has ending punctuation
updated the dashboard                        # Not imperative, not capitalized
Add dashboard, fix tests, update deps        # Multiple unrelated changes
```

### Commit Scope
- **Small, atomic commits** — each commit represents one logical change
- **Single responsibility** — one commit does one thing (add feature, fix bug, refactor component)
- **Buildable state** — every commit must leave the codebase in a working, compilable state
- **Logical progression** — commits build upon each other so feature development is easy to follow

### Before Committing
1. Verify the build passes (`npm run build`)
2. Run the linter (`npm run check`)
3. Review the diff — verify only intended changes are included
4. Stage specific files by name — avoid `git add .` or `git add -A`
5. Never push without explicit instructions to do so

## Design Language

- **Light sections**: White/slate-50 backgrounds with indigo/blue accents
- **Dark sections**: Slate-900/950 backgrounds with indigo/violet/emerald accents
- **Typography**: `font-display` for headings, system sans-serif for body
- **Cards**: Glassmorphism style — semi-transparent backgrounds (`bg-slate-800/40`), `backdrop-blur-xl`, subtle borders (`border-slate-700/40`)
- **Color palette**: Indigo (primary), Blue (data), Orange/Amber (suppliers/warnings), Violet (certifications), Emerald (success/verified), Rose (consumer outputs)
- **Animations**: Subtle and purposeful — entrance fades, scroll-linked transforms, gentle float oscillations on 3D models
