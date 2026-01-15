import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
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
});
