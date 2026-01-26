import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync } from "fs";

// Read package.json to get version
const packageJson = JSON.parse(readFileSync("./package.json", "utf-8"));

export default defineConfig({
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
    __BUILD_TIME__: JSON.stringify(new Date().toLocaleString()),
  },
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
