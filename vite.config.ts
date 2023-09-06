import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from "path";
import webExtension from "vite-plugin-web-extension";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
    extensions: ['.mjs', '.js', '.ts', '.json', '.vue'],
  },
  plugins: [
    vue(),
    webExtension({
      manifest: "manifest.json"
    })
  ],
})
