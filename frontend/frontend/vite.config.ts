import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tailwindcss(),react()],
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:3000', // URL del backend
        changeOrigin: true,
        secure: false,
      },
    },
  }
});
