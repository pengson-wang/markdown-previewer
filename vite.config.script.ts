// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  define: {
    global: {},
    'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
  },
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: {
        background: resolve(__dirname, 'src/background/index.ts'),
        'content-script': resolve(__dirname, 'src/content-script/index.ts'),
      },
    },
    minify: false,
    copyPublicDir: false,
    emptyOutDir: false,
  },
})
