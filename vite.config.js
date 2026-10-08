import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { existsSync } from 'node:fs'
import path from 'node:path'

const optimizedMedia = () => ({
  name: 'optimized-media',
  enforce: 'pre',
  resolveId(source, importer) {
    if (!importer || (!source.startsWith('./') && !source.startsWith('../'))) return null
    if (source.endsWith('/video/portada.mp4')) return null

    const extension = path.extname(source).toLowerCase()
    if (!['.png', '.jpg', '.jpeg', '.mp4'].includes(extension)) return null

    const original = path.resolve(path.dirname(importer), source)
    const optimized = extension === '.mp4'
      ? original.replace(/\.mp4$/i, '.optimized.mp4')
      : original.replace(/\.(png|jpe?g)$/i, '.webp')

    return existsSync(optimized) ? optimized : null
  },
})

export default defineConfig({
  plugins: [optimizedMedia(), react()],
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
})
