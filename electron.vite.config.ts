import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        external: ['better-sqlite3']
      }
    },
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@shared': resolve('src/shared'),
        '@/repository': resolve('src/main/repository')
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@shared': resolve('src/shared')
      }
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'es2020'
      }
    },
    esbuild: {
      // https://github.com/vitejs/vite/issues/8644#issuecomment-1159308803
      logOverride: { 'this-is-undefined-in-esm': 'silent' }
    },
    plugins: [
      react({
        babel: {
          plugins: ['babel-plugin-macros', 'babel-plugin-styled-components']
        }
      })
    ]
  }
})
