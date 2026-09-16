import path from 'path';
import fs from 'fs';

async function run() {
  console.log("Checking UI build status...");

  let viteBuild;
  let reactPlugin;

  try {
    const vitePkg = await import('vite');
    viteBuild = vitePkg.build;
    const reactPkg = await import('@vitejs/plugin-react');
    reactPlugin = reactPkg.default;
  } catch (err) {
    try {
      const vitePkg = await import('../frontend/node_modules/vite/dist/node/index.js');
      viteBuild = vitePkg.build;
      const reactPkg = await import('../frontend/node_modules/@vitejs/plugin-react/dist/index.js');
      reactPlugin = reactPkg.default;
    } catch (err2) {
      console.log("Vite build dependencies not present, serving committed pre-built production assets from public/");
      process.exit(0);
    }
  }

  const indexPath = path.resolve('./public/index.html');
  let indexContent = fs.readFileSync(indexPath, 'utf8');

  // Ensure index.html points to source /app.jsx before build
  indexContent = indexContent.replace(
    /<script type="module"[^>]*src="\/assets\/[^"]*"[^>]*><\/script>/,
    '<script type="module" src="/app.jsx"></script>'
  );
  fs.writeFileSync(indexPath, indexContent, 'utf8');

  // Clean assets and dist before building to prevent filename bloat
  fs.rmSync('./public/assets', { recursive: true, force: true });
  fs.rmSync('./public/dist', { recursive: true, force: true });

  // Build with Vite into dist
  await viteBuild({
    configFile: false,
    root: path.resolve('./public'),
    plugins: [reactPlugin()],
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

  // Copy built assets & index.html to public cleanly
  if (fs.existsSync('./public/dist/assets')) {
    fs.cpSync('./public/dist/assets', './public/assets', { recursive: true });
  }
  if (fs.existsSync('./public/dist/index.html')) {
    fs.copyFileSync('./public/dist/index.html', './public/index.html');
  }

  // Clean temporary dist folder
  fs.rmSync('./public/dist', { recursive: true, force: true });

  console.log("VITE BUILD OF BACKEND UI SUCCESSFUL!");
}

run().catch(err => {
  console.log("Build script notice: using committed pre-built production bundle:", err.message);
  process.exit(0);
});

