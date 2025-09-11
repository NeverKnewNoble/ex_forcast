import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import frappeui from 'frappe-ui/vite'

export default defineConfig({
  plugins: [frappeui(), vue()],
  resolve: {
    alias: { 
      '@': path.resolve(__dirname, 'src'), 
      // Point directly to files so we bypass the package "exports" guard:
      'highlight.js/lib/core': path.resolve(__dirname, 'node_modules/highlight.js/es/core.js'),
      'highlight.js/lib/common': path.resolve(__dirname, 'node_modules/highlight.js/es/common.js'),
      // Make deps use the proper ESM-friendly entry:
      'interactjs/dist/interact.min.js': 'interactjs',
    },
  },
  build: {
    outDir: `../${path.basename(path.resolve('..'))}/public/forcast_desk`,
    emptyOutDir: true,
    target: 'es2015',
    // Drop console.* and debugger in production builds
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
      },
    },
  },
  optimizeDeps: {
    include: ['frappe-ui > feather-icons', 'showdown', 'engine.io-client', 'interactjs'],
  },
})