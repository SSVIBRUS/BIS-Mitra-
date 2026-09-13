import { preview } from 'vite';

async function startPreview() {
  const server = await preview({
    configFile: false,
    root: process.cwd(),
    preview: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true
        }
      }
    }
  });
  server.printUrls();
}

startPreview().catch(err => {
  console.error("PREVIEW ERROR:", err);
  process.exit(1);
});
