import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const validReleaseTypes = new Set(['patch', 'minor', 'major']);

function run(command, args, options = {}) {
  return execFileSync(command, args, {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...options,
  }).trim();
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

function bumpVersion(version, releaseType) {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) {
    fail(`Unsupported version format: ${version}`);
  }

  const major = Number(match[1]);
  const minor = Number(match[2]);
  const patch = Number(match[3]);

  if (releaseType === 'major') {
    return `${major + 1}.0.0`;
  }
  if (releaseType === 'minor') {
    return `${major}.${minor + 1}.0`;
  }
  return `${major}.${minor}.${patch + 1}`;
}

function updateJsonFile(filePath, updater) {
  const original = readFileSync(filePath, 'utf8');
  const json = JSON.parse(original);
  updater(json);
  writeFileSync(filePath, `${JSON.stringify(json, null, 2)}\n`);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const packageJsonPath = path.join(repoRoot, 'packages', 'mask-hook', 'package.json');
const packageLockPath = path.join(repoRoot, 'package-lock.json');

const releaseType = process.argv[2];
if (!validReleaseTypes.has(releaseType)) {
  fail('Usage: npm run tag -- <patch|minor|major>');
}

const status = run('git', ['status', '--porcelain']);
if (status) {
  fail('Git working tree must be clean before tagging a release.');
}

const branchName = run('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
if (!branchName || branchName === 'HEAD') {
  fail('Cannot create a release from a detached HEAD.');
}

const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
const currentVersion = packageJson.version;
const nextVersion = bumpVersion(currentVersion, releaseType);
const nextTag = `v${nextVersion}`;

try {
  run('git', ['rev-parse', '-q', '--verify', `refs/tags/${nextTag}`]);
  fail(`Tag ${nextTag} already exists locally.`);
} catch {
  // Tag does not exist locally.
}

try {
  run('git', ['ls-remote', '--exit-code', '--tags', 'origin', nextTag]);
  fail(`Tag ${nextTag} already exists on origin.`);
} catch {
  // Tag does not exist on origin.
}

updateJsonFile(packageJsonPath, (json) => {
  json.version = nextVersion;
});

updateJsonFile(packageLockPath, (json) => {
  if (json.packages?.['packages/mask-hook']) {
    json.packages['packages/mask-hook'].version = nextVersion;
  }
});

run('git', ['add', 'packages/mask-hook/package.json', 'package-lock.json']);
run('git', ['commit', '-m', `chore(release): ${nextTag}`], { stdio: 'inherit' });
run('git', ['tag', nextTag]);
run('git', ['push', 'origin', branchName], { stdio: 'inherit' });
run('git', ['push', 'origin', nextTag], { stdio: 'inherit' });

console.log(`Released ${nextTag}`);
