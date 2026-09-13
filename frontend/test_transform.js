import fs from 'fs';
import path from 'path';
import { transform } from 'esbuild';

const htmlPath = 'c:/Users/bhamr/OneDrive/Desktop/bis-ai-assistant/backend/public/index.html';
const content = fs.readFileSync(htmlPath, 'utf8');

const matches = content.match(/<script type="text\/babel">([\s\S]*?)<\/script>/);

if (!matches) {
  console.error("No babel script found!");
  process.exit(1);
}

const jsCode = matches[1];

try {
  const result = await transform(jsCode, {
    loader: 'jsx',
    target: 'es2020'
  });
  console.log("ESBUILD TRANSFORM SUCCESS! No JSX syntax error!");
} catch (err) {
  console.error("ESBUILD SYNTAX ERROR FOUND IN INDEX.HTML:");
  console.error(err.message);
}
