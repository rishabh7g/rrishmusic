import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

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
      "@/content": path.resolve(__dirname, "./src/content")
    }
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    // GitHub Pages SPA optimization
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    // Remove the setupFiles reference since the file doesn't exist
    // setupFiles: "./src/test/setup.ts",
  },
  // GitHub Pages preview configuration
  preview: {
    port: 4173,
    host: true,
    strictPort: true,
  },
  // Development server configuration
  server: {
    port: 5173,
    host: true,
    // Handle client-side routing in development
    historyApiFallback: true,
  },
});