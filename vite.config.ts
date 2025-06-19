/// <reference types="node" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import dotenv from 'dotenv';

dotenv.config(); // Loads .env variables into process.env

// Use Node-style env access here
const API_BASE = process.env.VITE_API_BASE;

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: API_BASE,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
