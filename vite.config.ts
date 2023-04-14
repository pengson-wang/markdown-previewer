import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig, type PluginOption } from 'vite'
import svgrPlugin from 'vite-plugin-svgr'
import viteTsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  if (command === 'serve') {
    if (mode === 'development') {
      return {
        define: {
          global: {},
          'process.env': {},
        },
        server: {
          host: '0.0.0.0',
          port: 3000,
          strictPort: true,
        },
        plugins: [
          react({
            babel: {
              plugins: ['styled-components'],
            },
          }),
          viteTsconfigPaths(),
          svgrPlugin(),
        ],
      }
    } else {
      return {
        preview: {
          host: '0.0.0.0',
          port: 3000,
          strictPort: true,
        },
      }
    }
  } else {
    return {
      plugins: [
        react({
          babel: {
            plugins: ['styled-components'],
          },
        }),
        viteTsconfigPaths(),
        svgrPlugin(),
        visualizer({
          gzipSize: true,
          brotliSize: true,
          emitFile: false,
          filename: 'bundle-visual.html',
          open: true,
        }) as PluginOption,
      ],
      build: {
        copyPublicDir: false,
        emptyOutDir: false,
        rollupOptions: {
          input: {
            options: resolve(__dirname, 'src/options/index.html'),
            main: resolve(__dirname, 'index.html'),
          },
          output: {
            manualChunks: {
              react: ['react', 'react-dom', 'react-helmet', 'react-router-dom'],
              rxjs: ['rxjs', 'rxjs-hooks'],
              styled: ['styled-components'],
            },
          },
        },
      },
    }
  }
})
