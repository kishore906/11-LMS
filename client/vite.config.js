import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    outDir: "dist", // This MUST match vercel.json -> distDir: "client/dist"
    emptyOutDir: true, // Optional: clears dist folder before each build
  },
});
