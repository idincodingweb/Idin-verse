import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  // --- CONFIG SUPAYA BISA BACA FILE 3D (.glb) ---
  assetsInclude: ['**/*.glb'], 

  server: {
    host: "::",
    port: 8080, // Port default lo
    hmr: {
      overlay: false, // Biar gak muncul error merah di layar kalo ada warning
    },
  },
  
  plugins: [
    react(),
  ],
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});