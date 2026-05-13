import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { imagetools } from "vite-imagetools";

export default defineConfig({
  vite: {
    plugins: [imagetools()],
  },
});
