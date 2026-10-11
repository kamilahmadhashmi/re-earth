import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import glsl from 'vite-plugin-glsl'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: process.env.BASE_PATH || (process.env.GITHUB_PAGES === 'true' ? '/re-earth/' : '/'),
  plugins: [
    react(),
    glsl({
      include: ['**/*.glsl', '**/*.wgsl', '**/*.vert', '**/*.frag'],
      defaultExtension: 'glsl',
      warnDuplicatedImports: false,
      compress: false,
      root: '/'
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 5174,
    host: true
  }
}))
