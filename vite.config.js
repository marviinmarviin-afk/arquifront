import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// Configuracion minima: solo el plugin oficial de Vue.
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    open: true,
  },
});
