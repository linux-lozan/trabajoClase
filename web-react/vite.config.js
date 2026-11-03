import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Permite abrir dist/index.html con doble clic (file://): los navegadores
// bloquean <script type="module"> fuera de un servidor, así que el build
// genera un script clásico (IIFE) que se carga con "defer".
const abrirSinServidor = {
  name: 'abrir-sin-servidor',
  apply: 'build',
  transformIndexHtml: {
    order: 'post',
    handler: (html) =>
      html
        .replace(/<script type="module" crossorigin/g, '<script defer')
        .replace(/<link rel="stylesheet" crossorigin/g, '<link rel="stylesheet"'),
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), abrirSinServidor],
  // Rutas relativas: el build funciona en cualquier carpeta o servidor estático.
  base: './',
  build: {
    modulePreload: false,
    rollupOptions: { output: { format: 'iife' } },
  },
})
