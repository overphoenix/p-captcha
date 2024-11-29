import path from "path";
import { defineConfig } from "vite";
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/main.ts"),
      name: "p-captcha-vanilla",
      fileName: (format) => `p-captcha-vanilla.${format}.js`,
    },
  },
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
});
