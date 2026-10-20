import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  base: process.env.SITE_BASE || "/",
  site: process.env.SITE_URL || "https://xbuild.com", // absolute URLs for link previews (og:image etc.)
  // Emit build assets to "astro-assets" (no leading underscore) so GitHub Pages' Jekyll,
  // which strips "_"-prefixed folders, still serves the island scripts.
  build: { assets: "astro-assets" },
  // no dev toolbar over the page while testing locally (it never ships in builds)
  devToolbar: { enabled: false },
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": projectRoot,
        "lottie-web": path.resolve(projectRoot, "node_modules/lottie-web/build/player/esm/lottie_light.min.js")
      }
    },
    // Dev server only: bundle up front what the on-demand 3D scenes, the passport, the globe and the route map import
    // (all components are scanned at start), so the dev server doesn't discover them mid-page and re-bundle, which
    // breaks an open page's import ("Outdated Optimize Dep"). The production build is unaffected.
    optimizeDeps: {
      entries: ["src/components/**/*.{ts,tsx}", "src/views/**/*.{ts,tsx}"],
      include: [
        "three",
        "three/examples/jsm/controls/OrbitControls.js",
        "three/examples/jsm/libs/meshopt_decoder.module.js",
        "three/examples/jsm/loaders/DRACOLoader.js",
        "three/examples/jsm/loaders/GLTFLoader.js",
        "three/examples/jsm/loaders/HDRLoader.js",
        "three/examples/jsm/postprocessing/EffectComposer.js",
        "three/examples/jsm/postprocessing/OutputPass.js",
        "three/examples/jsm/postprocessing/RenderPass.js",
        "three/examples/jsm/postprocessing/ShaderPass.js",
        "d3-geo",
        "topojson-client"
      ]
    }
    // Note: the Vite-SPA `manualChunks: { three: [...] }` is intentionally dropped.
    // Astro code-splits per island, so three.js loads only with the 3D islands
    // that import it (mounted client:visible), which is what we want.
  }
});
