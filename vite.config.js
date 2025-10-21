import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    proxy: {
      // All UI calls to /api/users/* will be forwarded to your Python service
      "/api/users": {
        target: "http://localhost:8081", // ← change ONLY this port if your service uses another
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/users/, ""),
      },
    },
  },
});
