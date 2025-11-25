// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"], // put major dependencies into vendor.js
        },
      },
    },
    chunkSizeWarningLimit: 1000, // optional: raise warning limit to 1MB
  },
});
