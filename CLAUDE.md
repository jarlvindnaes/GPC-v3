# CLAUDE.md — Product Connect V4

## What this project is

Product Connect is a B2B platform for furniture manufacturers. It gathers product and supply-chain data, connects it in a Dynamic Product Model, calculates environmental impact, and makes the result available through Digital Product Passports, APIs, and MCP.

The homepage is the current V4 design. Keep it refined, editorial, responsive, and grounded in credible product behavior.

## Where to work

- `src/components/v4/Home.astro` — homepage content and composition
- `src/components/v4/home.css` — homepage layout and visual language
- `src/components/v4/BrandStrip.astro` — photographic brand banner
- `src/components/v4/NodeFlow.astro` and `node-flow.ts` — draggable data model
- `src/components/v4/data-scenes.ts` — Dynamic Product Model and Input interface canvases
- `src/components/v4/McpGraphic.astro` — database-to-MCP-to-AI illustration
- `src/components/v4/Scale.astro` — animated infrastructure section
- `src/components/v4/BenefitProof.astro` — draft proof panels
- `src/components/v4/PassportPhone.tsx` — interactive 3D passport phone
- `src/pages/how-it-works.astro` — detailed product workflow
- `public/v4/` — V4 image assets

Read `README.md` for routes and development commands.

## Design direction

- Use generous space, precise typography, soft light surfaces, and deep near-black technical sections.
- Keep motion subtle and purposeful. Respect `prefers-reduced-motion`.
- The Dynamic Product Model is a large sphere whose gravity attracts and collects incoming data points.
- The Input interface focuses scattered product data into the model.
- The MCP illustration shows an orb inside a product database communicating with AI tools through MCP.
- Keep the photographic brand strip colorful but restrained so it does not compete with the hero.

## Content guardrails

- The benefit quotes, names, and evidence panels are illustrative drafts. Do not present them as verified customer proof.
- The large testimonial portrait, person, company, and quote are fictional placeholders.
- Replace draft proof only with approved quotes and measured outcomes.
- EPD publication follows applicable programme rules and independent verification. Avoid promising certification in a specific time.
- The commerce feature is labeled “Coming this fall.”
- Avoid unsupported scale, security, certification, customer, and performance claims.

## Technical rules

- Prefix internal asset URLs with `import.meta.env.BASE_URL` for subpath deployments.
- Keep the canvas scenes visible-only and frame-rate limited.
- Preserve keyboard operation for the data model and accessible names for visualizations.
- The Digital Product Passport opens in a dialog and lazy-loads `/passport-preview/`.
- Preserve unrelated prototype routes and components unless the user explicitly asks to remove them.

## Before committing

Run:

```bash
npm run build
node --test tests/*.test.mjs
```

`npm run check` currently reports legacy formatting and lint debt across the older V3 code. Do not attribute that backlog to a new V4 change without checking the affected files. Use focused, imperative commit messages and review the staged diff before pushing.
