# Changelog

All notable changes to the Product Connect marketing frontpage.

## [Unreleased] — 2026-02-28

### Hero Section
- Added premium floating network canvas with ~55 animated nodes
- Nodes represent supply chain entities: components, suppliers, products, consumers, certifications
- Color palette: blue, orange, purple (brand-aligned)
- Mouse-reactive parallax repulsion, inter-node connections, per-node drift
- Labels appear on foreground nodes with depth-based opacity
- Product screenshot carousel with crossfade transitions and browser chrome frame
- Swapped to cropped screenshots with adjusted aspect ratio

### Storytelling Scroll ("How it works")
- 7-step sticky scroll section with metro line progress indicator
- Steps: Ingest Model → Component Details → Supplier Verification → Raw Material Mapping → Transport Routes → Impact Calculation → Passport & Certifications
- Visual panels per step: 3D chair, bolt, emerald, supplier card, transport route card, LCA engine animation, DPP mini-card
- Grand finale section with interactive 3D chair, QR tag on seat, hover/tap info panel
- Metro line extends from story section into finale, fading into the QR code

### 3D Models (`Native3DModels.tsx`)
- West Elm Slope Leather Chair with drag controls and float animation
- Steel Bolt (ISO 4762 M8×30) with tilted rotation
- Emerald crystal (replaced ore → quartz → emerald through iterations)
- Finale chair with oscillation, radiating QR tag, and interactive info panel
- Softened drag physics (`mass: 4, tension: 120, friction: 40`)
- All models sized to float freely without clipping frames

### Integration Diagram
- Complete rework: suppliers (left, amber), data sources (right, indigo/emerald), ERP inputs (top), consumer outputs (bottom)
- Central Product Connect hub with pulsing border animation
- QR code node below hub with violet connections
- **Dynamic SVG path computation** — paths calculated from actual DOM element positions via `getBoundingClientRect` + `ResizeObserver`, eliminating all coordinate guessing
- Animated flowing gradients along all connection lines

### Stats Section ("Backbone")
- Canvas-based network visualization with 150 nodes in circular distribution
- Mouse gravitation: nodes within 250px radius are pulled toward cursor with spring easing
- Idle drift animation per node (sine/cosine oscillation with unique phase/speed)
- Sphere size reduced and repositioned 200px down

### Countdown Banner
- Redesigned with light theme (white-to-slate gradient)
- Stripe-inspired minimal aesthetic
- Clean monospace countdown numbers without card backgrounds
- Pill-shaped badge with pulsing amber indicator
- Subtle grid background with faint indigo/violet gradient orbs

### Feature Grid
- Responsive card layout with icons
- Feature categories: 3D Models, Supply Chain, LCA, DPP, Spare Parts, Commerce

### Mobile Responsiveness
- Full mobile audit and fixes across all components
- Responsive text sizes, padding, and grid layouts
- 3D models render on all screen sizes with `overflow-hidden`
- Touch support for finale chair QR interaction ("Tap" vs "Hover")
- LCA engine animation converted from pixel-based to percentage-based
- Info overlays hidden on very small screens to prevent clutter

### Transport Route Card
- Detailed logistics tracking card with route legs
- Icons for ship, train, truck per leg
- Animated progress bars, distances, CO₂, transit times
- Summary footer with total route stats

### LCA Engine Visual
- Animated concentric rotating rings with orbiting data nodes
- Pulsing core glow with central CPU icon
- Floating metric labels (CO₂ Impact, PEF Score, Components)
- Fully responsive with percentage-based positioning

### DPP Mini-card
- GS1-compliant passport preview with QR code
- Semi-transparent glassmorphism styling
- Key metrics: CO₂, Repair score, Lifecycle

---

## [0.1.0] — 2026-02-26

### Initial Release
- Project scaffolded with Vite + React + TypeScript + Tailwind
- Basic page structure: Home, DPP, Platform, Pricing, About
- Navbar with mobile hamburger menu
- Hero section with gradient text and CTA buttons
- Initial storytelling scroll prototype
- 3D model integration (chair GLB)
- Pricing tiers grid
- Testimonials section
- Footer with site links
- GitHub Pages deployment via `gh-pages`
