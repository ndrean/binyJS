import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/biny.js"),
      name: "binyJS",
      fileName: "binyjs",
    },
    rollupOptions: {
      external: ["bootstrap"],
    },
  },
});
