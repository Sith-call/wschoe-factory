import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 로컬 개발 시 토스 네이티브 모듈을 스텁으로 대체
      "@apps-in-toss/native-modules": path.resolve(
        __dirname,
        "src/engine/native-stubs.ts"
      ),
    },
  },
  optimizeDeps: {
    exclude: [
      "@apps-in-toss/web-framework",
      "@granite-js/react-native",
    ],
  },
  build: {
    rollupOptions: {
      external: [
        "@apps-in-toss/web-framework",
        "@granite-js/react-native",
      ],
    },
  },
});
