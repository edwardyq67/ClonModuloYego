import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import viteCompression from 'vite-plugin-compression'; // Importa el plugin de compresión

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), // Plugin de React
    viteCompression({ // Plugin de compresión
      algorithm: 'gzip', // Usa gzip para comprimir (también puedes usar 'brotliCompress' para Brotli)
      ext: '.gz', // Extensión de los archivos comprimidos
      threshold: 1024, // Comprime solo archivos mayores a 1 KB
    }),
  ],
});