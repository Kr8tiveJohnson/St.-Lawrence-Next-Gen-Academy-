import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // Exposes Vite on the local network (0.0.0.0) so WebFrame Pro can connect
    cors: true, // Enables Cross-Origin Resource Sharing for extensions
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    open: true,
  },
});
