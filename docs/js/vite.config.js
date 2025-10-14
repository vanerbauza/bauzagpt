import { defineConfig } from "vite";

export default defineConfig({
  base: "/",                 // dominio propio ⇒ raíz
  build: {
    outDir: "docs",          // el build se publica en /docs
    emptyOutDir: true
  }
});
