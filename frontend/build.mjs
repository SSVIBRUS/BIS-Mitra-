import { build } from 'vite';
import react from '@vitejs/plugin-react';

async function runBuild() {
  await build({
    configFile: false,
    root: process.cwd(),
    plugins: [react()],
    build: {
      outDir: 'dist',
      emptyOutDir: true
    }
  });
  console.log("BUILD SUCCESSFUL!");
}

runBuild().catch(err => {
  console.error("BUILD ERROR:", err);
  process.exit(1);
});
