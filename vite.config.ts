import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslintPlugin from 'vite-plugin-eslint';
import { resolve } from "path";
// import { viteCommonjs } from '@originjs/vite-plugin-commonjs'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [vue(), eslintPlugin(), ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "/src"),
    },
  },
  server: {
    proxy: {
      // 本地开发环境
      "/api": {
        target: "http://127.0.0.1:7001",
        rewrite: path => path.replace(/^\/api/, ''),
        changeOrigin: true,
      },
      // 生产环境
      // "^/api/.*": {
      //   secure: false,
      //   target: "http://127.0.0.1:7001",
      //   changeOrigin: true,
      // },
    },
  },
})
