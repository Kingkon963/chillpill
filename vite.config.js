import { fileURLToPath } from "url";
import { resolve, dirname } from "path";
import { defineConfig } from "vite";

const __fileName = fileURLToPath(import.meta.url);
const __DIR__ = dirname(__fileName);

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__DIR__, "index.html"),
        register: resolve(__DIR__, "register/index.html"),
        dashboard: resolve(__DIR__, "dashboard/index.html"),
      },
    },
  },
  resolve: {
    alias: {
      "@src": resolve(__DIR__, "src"),
      "@styles": resolve(__DIR__, "src/styles"),
      "@component": resolve(__DIR__, "src/components"),
    },
  },
});
