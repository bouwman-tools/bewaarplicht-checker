// Laadt de rekenkern uit bewaarplicht.html en draait die in een sandbox.
// Zo blijft de tool één zelfstandig HTML-bestand, terwijl de logica testbaar is.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const here = dirname(fileURLToPath(import.meta.url));
export const HTML_PATH = join(here, '..', 'bewaarplicht.html');
export const html = readFileSync(HTML_PATH, 'utf8');

const CORE_RE = /<script id="bewaarplicht-core">([\s\S]*?)<\/script>/;
const match = html.match(CORE_RE);
if (!match) {
  throw new Error('Kernscript <script id="bewaarplicht-core"> niet gevonden in bewaarplicht.html');
}

const sandbox = { console };
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(match[1], sandbox, { filename: 'bewaarplicht-core.js' });

if (!sandbox.Bewaarplicht) {
  throw new Error('Kernscript exporteert geen globale Bewaarplicht');
}

export const core = sandbox.Bewaarplicht;
