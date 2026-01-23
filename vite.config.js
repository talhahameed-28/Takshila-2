import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteCompression from "vite-plugin-compression";

export default defineConfig({
  plugins: [
    react(),
    // Gzip compression
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240, // Only compress files larger than 10KB
      algorithm: "gzip",
      ext: ".gz",
    }),
    // Brotli compression (better than gzip)
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: "brotliCompress",
      ext: ".br",
    }),
  ],
  server: {
    host: true, // Allow network access
    port: 5173,
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'https://development.takshila.co',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    // Disable source maps in production (saves ~30% size)
    sourcemap: false,
    
    // Remove console logs in production
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    
    // Manual chunk splitting for optimal caching
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          
          // Redux state management
          "vendor-redux": ["@reduxjs/toolkit", "react-redux"],
          
          // Three.js and 3D libraries
          "vendor-three": ["three", "@react-three/fiber", "@react-three/drei"],
          
          // UI utilities
          "vendor-ui": ["react-helmet-async", "react-hot-toast", "lucide-react"],
          
          // Auth libraries
          "vendor-auth": ["@react-oauth/google", "@greatsumini/react-facebook-login"],
        },
      },
    },
    
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
});

