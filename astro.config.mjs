import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  base: "/GPC-v3/",
  site: "https://jarlvindnaes.github.io",
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": projectRoot,
        "lottie-web": path.resolve(projectRoot, "node_modules/lottie-web/build/player/esm/lottie_light.min.js")
      }
    }
    // Note: the Vite-SPA `manualChunks: { three: [...] }` is intentionally dropped.
    // Astro code-splits per island, so three.js loads only with the 3D islands
    // that import it (mounted client:visible), which is what we want.
  }
});
