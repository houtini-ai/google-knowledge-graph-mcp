import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * The single source of truth for the server version.
 *
 * Read from package.json at runtime rather than hardcoded, so the MCP handshake
 * can never drift from the published version - it had drifted to 1.0.5 while
 * package.json said 1.0.6.
 *
 * This package compiles to CommonJS, so __dirname is the compiled dist/ folder.
 */
export const SERVER_VERSION: string = JSON.parse(
  readFileSync(join(__dirname, '..', 'package.json'), 'utf8')
).version;
