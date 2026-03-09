#!/usr/bin/env node
/**
 * Cross-platform build script for stgsd CLI.
 *
 * Replaces the shell-dependent esbuild + chmod pipeline from package.json.
 * Uses esbuild's JS API for reliable cross-platform banner injection.
 */

import * as esbuild from 'esbuild';

const banner = [
  '#!/usr/bin/env node',
  'import { createRequire as __createRequire } from "node:module";',
  'const require = __createRequire(import.meta.url);',
].join('\n');

await esbuild.build({
  entryPoints: ['src/cli/index.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node22',
  outfile: 'dist/stgsd.mjs',
  banner: { js: banner },
});

console.log('Built dist/stgsd.mjs');
