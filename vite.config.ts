import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/hooks": path.resolve(__dirname, "./src/hooks"),
      "@/utils": path.resolve(__dirname, "./src/utils"),
      "@/types": path.resolve(__dirname, "./src/types"),
      "@/content": path.resolve(__dirname, "./src/content"),
      "@/test": path.resolve(__dirname, "./src/test"),
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: process.env.NODE_ENV === 'development',
    rollupOptions: {
      output: {
        // Better chunk splitting for analysis
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          motion: ['framer-motion'],
        },
      },
    },
  },
  test: {
    // Default test configuration (fallback for simple test runs)
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    
    // Default coverage settings
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json"],
      reportsDirectory: "./test-results/coverage/default",
      exclude: [
        "node_modules/",
        "test-results/",
        "dist/",
        "**/*.d.ts",
        "**/*.config.{js,ts}",
        "**/__tests__/**",
        "**/tests/**",
        "src/test/**",
      ],
    },
    
    // Performance settings
    testTimeout: 10000,
    hookTimeout: 5000,
    
    // Output settings
    reporter: process.env.CI ? ["verbose", "json"] : ["default"],
    outputFile: {
      json: "./test-results/json/default-results.json",
    },
  },
  
  // Development server settings
  server: {
    port: 5173,
    host: true, // Allow external connections for testing
  },
  
  // Preview server settings (for E2E tests)
  preview: {
    port: 4173,
    host: true,
  },
});