# Product Connect website

The current Product Connect marketing site. The main experience is an Astro page with lightweight canvas animation, interactive product-data diagrams, an embedded 3D Digital Product Passport, and responsive layouts.

## Start the project

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

The development server runs at `http://localhost:3000` by default.

```bash
npm run build       # production build
npm run typecheck   # Astro and TypeScript checks
node --test tests/*.test.mjs
```

## Current pages

- `/` — V4 Product Connect homepage
- `/how-it-works/` — detailed product workflow
- `/passport-preview/` — embedded interactive DPP used by the homepage
- `/platform/`, `/pricing/`, `/enterprise/`, `/about/`, `/dpp/` — supporting pages from the existing site
- `/emballage/` — separate packaging calculator prototype

## V4 structure

- `src/components/v4/Home.astro` — homepage content and composition
- `src/components/v4/home.css` — homepage layout and visual system
- `src/components/v4/BrandStrip.astro` — photographic customer/brand banner
- `src/components/v4/NodeFlow.astro` — draggable connected-data diagram
- `src/components/v4/data-scenes.ts` — Dynamic Product Model and Input interface canvases
- `src/components/v4/McpGraphic.astro` — database-to-MCP-to-AI illustration
- `src/components/v4/Scale.astro` — animated infrastructure section
- `src/components/v4/BenefitProof.astro` — draft proof panels for the five benefits
- `src/components/v4/PassportPhone.tsx` — interactive 3D passport phone
- `src/components/v4/Footer.astro` — shared V4 footer
- `public/v4/` — optimized V4 imagery

## Content status

The five benefit quotes, names, and evidence panels are clearly marked as illustrative drafts. Replace them with approved customer quotes and measured outcomes before publishing them as customer proof. The testimonial portrait, person, and company are fictional placeholders. Brand-strip images came from the brands’ public websites; their source URLs are recorded in `public/v4/brands/sources.json`.

## Working conventions

- Prefix public asset paths with `import.meta.env.BASE_URL` so branch and GitHub Pages builds work.
- Keep animation subtle and respect `prefers-reduced-motion`.
- Preserve keyboard controls, labels, and focus states on interactive diagrams.
- Run `npm run build` before committing.
- The type checker currently includes generated and draft files, so it can print many non-blocking hints even when it finishes with zero errors.
- `npm run check` currently reports formatting debt in older V3 files; treat that as a cleanup task rather than a V4 regression.
- Read `CLAUDE.md` before continuing substantial work in Claude Code.

## GitHub

Repository: [github.com/jarlvindnaes/GPC-v3](https://github.com/jarlvindnaes/GPC-v3)

The V4 design is maintained on the `product-connect-v4` branch.
