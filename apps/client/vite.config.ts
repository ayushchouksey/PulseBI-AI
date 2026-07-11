import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@pulsebi/shared-types": path.resolve(
        __dirname,
        "../../packages/shared-types/src"
      ),
      "@pulsebi/shared-utils": path.resolve(
        __dirname,
        "../../packages/shared-utils/src"
      ),
      "buffer": "buffer",
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    include: ["buffer", "plotly.js"],
  },
  define: {
    "global": "globalThis",
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "plotly": ["react-plotly.js", "plotly.js"],
          "pdf": ["html2canvas-pro", "jspdf"],
          "vendor": ["react", "react-dom", "zustand", "@tanstack/react-query"],
        },
      },
    },
  },
});
