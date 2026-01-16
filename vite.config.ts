import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // --- TAMBAHAN PENTING ---
  // Biar Vite gak bingung baca file 3D (.glb)
  assetsInclude: ['**/*.glb'], 
  // ------------------------

  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  
  // Instagram : @Idin_iskndr
  plugins: [
    react(),
  ].filter(Boolean),
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));