import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

function getServerConfig() {
  if (fs.readFileSync('.env').toString().includes('ENV=production')) {
    console.log('Running on production environment');

    return {
      port: 44320,
      host: '0.0.0.0',
      https: {
        cert: fs.readFileSync('certs/www.seguroonline.com.uy.pem'),
        key: fs.readFileSync('certs/www.seguroonline.com.uy.key')
      }
    }
  }
  console.log('Running on development environment');

  return {}
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['react-icons']
  },
  server: {...getServerConfig()}
})
