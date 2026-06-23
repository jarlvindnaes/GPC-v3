# Product Connect - site wireframes (v2)

**Purpose:** lock the *message, sections, order, and wording* before we make anything beautiful.
These are deliberately plain. Visuals (3D phone, globe, animated data-flow chart) are **placeholders**.

Open `index.html` (SMV) and `enterprise.html` in a browser. Shared styles in `wireframe.css`.

## The two pages
- **`index.html` - SMV** (the primary landing / beachhead audience). Self-serve, price-sensitive.
- **`enterprise.html` - Enterprise.** Scale, ERP, complete data layer; "Talk to us".
- **Bank** is *not* a web page - it becomes a pitch deck that circulates the banking network.
  It should reuse this look & tone so it reads as an extension of the site.

## Design rules baked in
- **Light by default** (warm, Studio 9-inspired), with our indigo kept as the brand accent.
- **"Under the hood" sections are dark** → zebra-stripe rhythm down the page:
  - SMV: Hero (L) · How it works (D) · Component-level (L) · Value (L) · Data quality & verified (D) · Passport (L) · Timeline (L) · Time & cost (D) · Pricing (L) · CTA (L)
  - Enterprise: Hero (L) · Data layer (D) · Reuse at scale (L) · Supply chain mapping (D) · Capabilities (L) · Data quality & verified (D) · Why-us (L) · Timeline (L) · CTA (L)
- **No heavy JS yet.** Dashed placeholder boxes mark where assets land (DPP phone, globe, data-flow chart).

## Message decisions baked in (from our research)
- **Wonder over fear** - lead with "your furniture is smarter than you think" + the talking-chair demo (TANKER). EU compliance is demoted to a *supporting* line, not the hook (Studio 9: "Start with data, not regulations"; April reviewers: we over-sell compliance).
- **Value-led narrative** - what it is → how it works (kept; reviewers liked it) → value → system → passport → proof → next step.
- **Trimmed gains** - 3 gains + 1 future vision (not 4).
- **Proof via work + standards, not testimonials** (held for now, per April feedback).
- **Data quality as a moat** (`#verified` on SMV; supplier card + verified section on Enterprise): suppliers log in and verify the data on their *own* components - first-hand, primary data no spreadsheet or consultant can match. A pure-CSS **provenance ladder** (Estimated → Extracted → Authored → Supplier-verified) shows the quality tiers, with supplier-verified as the top.
- **Verified EPDs / ISO standards** called out as a differentiator (EN 15804, ISO 14025, ISO 14040/14044, ESPR, GS1/CBAM).
- **Provably-genuine passports** (`#passport` on SMV): each DPP is issued as cryptographically signed credentials (did:web) and independently verifiable in one tap via a third party (EECC) - the authenticity standard in EU ESPR 2024/1781. This is what makes our DPP more than a link to a product web page. Live example: https://view-product.info/0215687140/about (the "Verify credentials" button checks Environmental Impact, Material Composition, Product Identity & Traceability).
- **Component-level data & reuse** (`#components` on SMV; enriched capability card on Enterprise): LCA is calculated per component and reused across every product that shares it - measure once, never re-key. Uploading a 3D model auto-detects components, including ones shared with already-mapped products, so coverage compounds with every upload.
- **Studio 9-style "data in → us → value out"** chart lives on **Enterprise** (`#layer`) - it's the architecture/data-layer story, which is an enterprise concern. Removed from SMV to keep that page outcome-led and scannable. To be animated/interactive later.
- **Less time, less money** - two real (pure HTML/CSS) charts from `Desktop/Graphs/`:
  - Time/cost comparison vs a traditional consultant-led EPD (≈ €28k / ≈ 5 months → ≈ €1,000/EPD + €499/mo / ≈ 1 week) → `#cost` (dark) on **SMV** (the SME cost argument).
  - Component-reuse bar chart (data-gathering time per product drops as the shared library grows) → `#reuse` on **Enterprise** (the scale argument - strongest across a big portfolio).

## Reused current-site assets (placeholders for now)
- DPP inside the 3D phone → `#passport` on SMV (now the only visual in that section).
- Interactive globe → `#supply-chain` on **Enterprise** — **now wired in** (not a placeholder): `globe.js` is a vanilla-JS port of the live site's `SupplyChainGlobe.tsx`, loading Three.js from a CDN and `world-map.png` locally. Supply-chain nodes + transport routes + downstream scan/tap geography. Moved off the SMV passport so each section has one visual.
- Data-flow / engine diagram → `#layer` on **Enterprise** (removed from SMV).
- **NEW asset to produce:** exploded-assembly **scroll-scrubbed video** (Apple-style - furniture explodes into components, reassembles on scroll) → `#components` on SMV. Can be generated from a client's own 3D model. Shared brand asset - also usable on Enterprise.

## Open questions for the team
1. Hero scope: CO₂-led front door vs. whole-platform promise?
2. Tagline: "Your furniture is smarter than you think" - keep?
3. Is the zebra rhythm right, or too many dark sections?
4. SMV pricing shown publicly (€499/€999) - keep on the page or gate behind a demo?
5. Where exactly should the phone live - hero or a dedicated section (currently `#passport`)?
6. Exploded-assembly scroll-video: produce a generic hero piece now, or generate per-client from their 3D model?
7. Scannability split: the "data in → out" chart and the component-reuse chart now live on **Enterprise** only (SMV stays outcome-led). OK, or should SMV keep a simplified version of either?
