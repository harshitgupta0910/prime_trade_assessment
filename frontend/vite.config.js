import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // Proxy API calls to the backend during development
    proxy: {
      "/api": {
        target: "https://prime-trade-assessment-su11.onrender.com",
        changeOrigin: true,
      },
    },
  },
});
