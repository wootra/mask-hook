import { appendFileSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function fail(message) {
  console.error(message);
  process.exit(1);
}

const outputPath = process.env.GITHUB_OUTPUT;
if (!outputPath) {
  fail('GITHUB_OUTPUT is not set. This script must run inside GitHub Actions.');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const packageJsonPath = path.join(repoRoot, 'packages', 'mask-hook', 'package.json');

const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
appendFileSync(outputPath, `name=${pkg.name}\nversion=${pkg.version}\n`);
