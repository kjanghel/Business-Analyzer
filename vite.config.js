import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/Business-Analyzer/', // GitHub Pages base path
  plugins: [react()],
})
