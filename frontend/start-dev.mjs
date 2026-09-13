import { createServer } from 'vite';
import react from '@vitejs/plugin-react';

async function start() {
  const server = await createServer({
    configFile: false,
    root: process.cwd(),
    plugins: [react()],
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-dom/client']
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true
        }
      }
    }
  });
  await server.listen();
  server.printUrls();
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
