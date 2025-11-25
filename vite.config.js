import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"], // separate major dependencies
        },
      },
    },
    chunkSizeWarningLimit: 1000, // optional
  },
  // Make sure the app works when deployed in a subdirectory
  base: "/",
});
