import { build } from '../frontend/node_modules/esbuild/lib/main.js';
import path from 'path';

async function bundleBackendUI() {
  await build({
    entryPoints: [path.resolve('./public/app.jsx')],
    outfile: path.resolve('./public/bundle.js'),
    bundle: true,
    format: 'iife',
    loader: { '.js': 'jsx', '.jsx': 'jsx' },
    define: { 'process.env.NODE_ENV': '"production"' },
    absWorkingDir: path.resolve('../frontend'),
    nodePaths: [path.resolve('../frontend/node_modules')]
  });
  console.log("BACKEND UI BUNDLE SUCCESSFUL!");
}

bundleBackendUI().catch(err => {
  console.error("BUNDLE ERROR:", err);
  process.exit(1);
});
