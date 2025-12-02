import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      src: path.resolve(__dirname, "src"),
    },

  },
  server: {
    port: 5173,  // Dev server port
    open: true,  // Opens browser automatically on 'npm run dev'
  },
  build: {
    outDir: "dist", // Production build output folder
  },
});
