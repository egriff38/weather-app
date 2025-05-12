import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import Icons from "unplugin-icons/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Icons({
      compiler: "vue3",
    }),
  ],
  resolve: {
    alias: [
      {
        // vue @ shortcut fix
        find: "@/",
        replacement: `${path.resolve(__dirname, "./src")}/`,
      },
    ],
  },
  clearScreen: false,
});
