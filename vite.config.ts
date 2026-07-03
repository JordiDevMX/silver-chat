import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import { VitePWA } from "vite-plugin-pwa";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    tailwindcss(),
    // SPA mode: produces a static index.html and prerenders the route tree
    // into dist/client/, which Netlify can serve directly. The SSR server
    // bundle is still built (for local dev / future use) but `publish` in
    // netlify.toml points at the static output.
    tanstackStart({
      spa: {
        enabled: true,
        prerender: {
          enabled: true,
          crawlLinks: true,
          retryCount: 3,
        },
      },
    }),
    viteReact(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "robots.txt"],
      workbox: {
        navigateFallback: "/",
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest,jpg}"],
      },
      manifest: false,
    }),
  ],
});

export default config;
