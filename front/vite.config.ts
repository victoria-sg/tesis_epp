import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: true,
    proxy: {
      "/stream": {
        target: "ws://localhost:8000",
        ws: true,
        changeOrigin: true,
      },
      "/auth": { target: "http://localhost:8000", changeOrigin: true },
      "/usuarios": { target: "http://localhost:8000", changeOrigin: true },
      "/roles": { target: "http://localhost:8000", changeOrigin: true },
      "/zonas": { target: "http://localhost:8000", changeOrigin: true },
      "/camaras": { target: "http://localhost:8000", changeOrigin: true },
      "/alertas": { target: "http://localhost:8000", changeOrigin: true },
      "/sirenas": { target: "http://localhost:8000", changeOrigin: true },
      "/tipos-epp": { target: "http://localhost:8000", changeOrigin: true },
      "/resoluciones": { target: "http://localhost:8000", changeOrigin: true },
      "/conteos": { target: "http://localhost:8000", changeOrigin: true },
      "/permisos": { target: "http://localhost:8000", changeOrigin: true },
      "/health": { target: "http://localhost:8000", changeOrigin: true },
      "/system": { target: "http://localhost:8000", changeOrigin: true },
      "/deteccion": { target: "http://localhost:8000", changeOrigin: true },
      "/stats": { target: "http://localhost:8000", changeOrigin: true },
    },
  },
});