import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  build: {
    outDir: "dist",
    target: "es2020",
    minify: "esbuild",
  },
  server: {
    port: 5190,
  },
});
