import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/rrishmusic/", // Important: matches your GitHub repo name
  build: {
    outDir: "dist", // Build output folder
    assetsDir: "assets", // Where CSS/JS files go
    sourcemap: false, // Don't generate source maps for production
  },
  test: {
    globals: true, // Make test functions available globally
    environment: "jsdom", // Simulate browser environment for tests
    setupFiles: "./src/test/setup.ts", // Test setup file
  },
});
