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
    tanstackStart(),
    viteReact(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "robots.txt"],
      // Para funcionar offline
      workbox: {
        navigateFallback: "/index.html",
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg}"],
      },
      manifest: {
        name: "First PWA",
        short_name: "FPWA",
        description: "App React+Vite PWA",
        start_url: "/",
        // Habilita la instalacion en celulares
        display: "standalone",
        background_color: "#fff",
        theme_color: "#228be6",
        screenshots: [
          {
            src: "/screenshots/728x410.png",
            sizes: "728x410",
            type: "image/png",
            form_factor: "wide",
          },
          {
            src: "/screenshots/736x1309.png",
            sizes: "736x1309",
            type: "image/png",
            form_factor: "narrow",
          },
        ],
        icons: [
          {
            src: "/icons/icon-128x128.png",
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: "/icons/icon-144x144.png",
            sizes: "144x144",
            type: "image/png",
          },
          {
            src: "/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});

export default config;
