import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "DreamJodiWeb",
        short_name: "DreamJodi",
        description: "DreamJodiWeb Progressive Web App",
        start_url: ".",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#1976d2",
        icons: [
          {
            src: "vite.svg",
            sizes: "192x192",
            type: "image/svg+xml",
          },
          {
            src: "vite.svg",
            sizes: "512x512",
            type: "image/svg+xml",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,json}"],
      },
    }),
  ],
  server: {
    host: "0.0.0.0",
    port: 5000,
    allowedHosts: [
      "9c784f00-573b-4a35-a7b5-55170d6e9126-00-2y3sbswg60rg0.spock.replit.dev",
      "localhost",
      "127.0.0.1",
    ],
    proxy: {
      // Localhost backend ke liye proxy lagao
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
