import { build } from '../frontend/node_modules/vite/dist/node/index.js';
import react from '../frontend/node_modules/@vitejs/plugin-react/dist/index.js';
import path from 'path';
import fs from 'fs';

async function run() {
  console.log("Building Backend UI app.jsx with Vite...");

  const indexPath = path.resolve('./public/index.html');
  let indexContent = fs.readFileSync(indexPath, 'utf8');

  // Step 1: Ensure index.html points to source /app.jsx before build
  // (cpSync from a previous build may have overwritten it with a built JS reference)
  indexContent = indexContent.replace(
    /<script type="module"[^>]*src="\/assets\/[^"]*"[^>]*><\/script>/,
    '<script type="module" src="/app.jsx"></script>'
  );
  fs.writeFileSync(indexPath, indexContent, 'utf8');

  // Step 2: Build with Vite
  await build({
    configFile: false,
    root: path.resolve('./public'),
    plugins: [react()],
    resolve: {
      alias: {
        'react/jsx-runtime': path.resolve('../frontend/node_modules/react/jsx-runtime.js'),
        'react/jsx-dev-runtime': path.resolve('../frontend/node_modules/react/jsx-dev-runtime.js'),
        'react-dom/client': path.resolve('../frontend/node_modules/react-dom/client.js'),
        'react-dom': path.resolve('../frontend/node_modules/react-dom/index.js'),
        'react': path.resolve('../frontend/node_modules/react/index.js')
      }
    },
    build: {
      outDir: path.resolve('./public/dist'),
      emptyOutDir: true,
      rollupOptions: {
        input: path.resolve('./public/index.html')
      }
    }
  });

  // Step 3: Copy built assets to public (overwrites index.html with built version — correct for serving)
  fs.cpSync('./public/dist', './public', { recursive: true });

  console.log("VITE BUILD OF BACKEND UI SUCCESSFUL!");
}

run().catch(err => {
  console.error("VITE BUILD ERROR:", err);
  process.exit(1);
});
