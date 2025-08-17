import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      react(),
      tailwindcss(),
  ],
  // server: {
  //   allowedHosts: ['crucial-escargot-concrete.ngrok-free.app'],
  //   proxy: {
  //     '/api': 'http://localhost:8000',
  //   },
  // },
})
