import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, './.env') });

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: process.env.NODE_ENV === "development" ? {
      '/api': {
        target: process.env.API_URL,
        changeOrigin: true,
        secure: false,
      },
    } : {
    }
  }
})
