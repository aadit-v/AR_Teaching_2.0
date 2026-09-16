import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

// getUserMedia needs a secure context. basicSsl gives you https on the LAN
// address so you can test on a real phone, not just localhost.
export default defineConfig({
  base: './',
  plugins: [basicSsl()],
  server: { https: true, host: true, port: 5173 },
  optimizeDeps: { include: ['mind-ar/dist/mindar-image-three.prod.js', 'three'] },
  build: { target: 'es2020' },
});
