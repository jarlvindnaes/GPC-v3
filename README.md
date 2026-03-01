# Product Connect — Marketing Frontpage

The public-facing marketing website for **Product Connect**, a SaaS platform that helps furniture manufacturers digitise their products, manage supply chain data, calculate environmental impact (LCA), and generate ESPR-compliant Digital Product Passports (DPP).

**Live site:** [jarlvindnaes.github.io/GPC-v3](https://jarlvindnaes.github.io/GPC-v3/)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS 4 |
| Animation | Motion (Framer Motion) |
| 3D | React Three Fiber + Drei + Three.js |
| Icons | Lucide React |
| Deployment | GitHub Pages (`gh-pages`) |

## Project Structure

```
src/
├── components/
│   ├── Hero.tsx                # Hero banner with floating network canvas
│   ├── StorytellingScroll.tsx  # 7-step sticky scroll "How it works" section
│   ├── Native3DModels.tsx      # All 3D model components (Chair, Bolt, Emerald, DPP chair)
│   ├── IntegrationSection.tsx  # System integration diagram with dynamic SVG paths
│   ├── StatsSection.tsx        # Stats with interactive network visualization
│   ├── CountdownBanner.tsx     # ESPR 2027 countdown timer
│   ├── FeatureGrid.tsx         # Feature cards grid
│   ├── Testimonials.tsx        # Customer testimonials carousel
│   ├── Pricing.tsx             # Pricing tiers
│   ├── ProductBreakdown.tsx    # Product journey breakdown
│   ├── Navbar.tsx              # Global navigation with mobile menu
│   ├── Footer.tsx              # Site footer
│   ├── TrustLogos.tsx          # Partner/trust logos
│   └── BackToTop.tsx           # Scroll-to-top button
├── pages/
│   ├── Home.tsx                # Main landing page
│   ├── DPP.tsx                 # Digital Product Passport page
│   ├── Platform.tsx            # Platform features page
│   ├── PricingPage.tsx         # Dedicated pricing page
│   └── About.tsx               # About page
├── App.tsx                     # Router and layout
└── main.tsx                    # Entry point
public/
├── models/                     # GLB 3D model files
└── screenshots/                # Product screenshot assets
```

## Key Features

### Interactive 3D Models
- West Elm Slope Leather Chair, Steel Bolt, Emerald crystal
- Drag-to-rotate via `PresentationControls` with softened spring physics
- Float animations, contact shadows, studio lighting

### Storytelling Scroll
- 7-step sticky scroll section explaining the product digitisation flow
- Each step has animated text + a visual panel (3D model, data card, or animated graphic)
- Metro line progress indicator that extends into a grand finale section
- Finale features an interactive 3D chair with a hoverable/tappable QR tag

### Dynamic Integration Diagram
- SVG paths computed at runtime from actual DOM element positions via `getBoundingClientRect`
- Automatically adapts to any viewport size — no hardcoded coordinates
- Animated flowing gradients along connection lines
- `ResizeObserver` for live recalculation

### Hero Network Canvas
- HTML5 Canvas with ~55 floating nodes representing the supply chain ecosystem
- Node categories: Components (blue), Suppliers (orange), Products (purple), Consumers (orange), Certifications (indigo)
- Mouse-reactive parallax repulsion, inter-node connections, subtle drift animation
- Labels appear on foreground nodes

### Stats Network Visualization
- Canvas-based circular node distribution with lines converging to anchor point
- Mouse gravitation: nodes within radius are pulled toward cursor
- Idle drift animation on each node

### Mobile Responsive
- Full mobile support with responsive breakpoints
- 3D models render on all screen sizes
- Touch support for QR tag interaction on finale chair

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## Deployment

The site deploys to GitHub Pages via the `gh-pages` package. Running `npm run deploy` builds the project and pushes the `dist/` folder to the `gh-pages` branch.

**Repository:** [github.com/jarlvindnaes/GPC-v3](https://github.com/jarlvindnaes/GPC-v3)
