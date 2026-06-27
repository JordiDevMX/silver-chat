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
      includeAssets: ["favicon.ico", "robots.txt"],
      workbox: {
        navigateFallback: "/",
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest}"],
      },
      manifest: {
        name: "SilverChat",
        short_name: "SilverChat",
        description: "SilverChat — silver glassmorphism messenger",
        start_url: "/",
        display: "standalone",
        background_color: "#f5f7fa",
        theme_color: "#A855F7",
        icons: [
          {
            src: "favicon.ico",
            sizes: "64x64 32x32 24x24 16x16",
            type: "image/x-icon",
          },
          {
            src: "logo192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "logo512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});

export default config;
