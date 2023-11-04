import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import webExtension from 'vite-plugin-web-extension';
import svgLoader from 'vite-svg-loader';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
    extensions: ['.mjs', '.js', '.ts', '.json', '.vue'],
  },
  plugins: [
    vue(),
    svgLoader({
      defaultImport: 'component',
    }),
    webExtension({
      manifest: 'manifest.json',
    }),
  ],
});
