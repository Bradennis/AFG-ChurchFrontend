import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["xlsx"], // pre-bundle xlsx
  },
  build: {
    rollupOptions: {
      external: [], // ensure xlsx is bundled, not externalized
    },
  },
});
