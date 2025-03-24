import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0',
    port: 4174,
    strictPort: true,
    allowedHosts: ['health-centre.onrender.com'] 
  },
  preview: {
    allowedHosts: ['health-centre.onrender.com'] 
  }
})