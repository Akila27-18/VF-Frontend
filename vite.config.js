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
    port: 5173,        // optional: set dev server port
    open: true,        // optional: open browser on dev start
  },
  build: {
    outDir: "dist",    // folder for production build
  },
});
