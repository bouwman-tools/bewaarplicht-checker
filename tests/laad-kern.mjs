// Laadt de fiscale kern uit bewaarplicht.html.
//
// De tool is bewust één HTML-bestand zonder buildstap. Om de rekenregels toch
// echt te kunnen testen, snijdt deze helper het blok tussen de markers
// "FISCALE KERN — BEGIN" en "FISCALE KERN — EINDE" uit het bestand en evalueert
// dat als CommonJS-module. Blijft het blok puur (geen DOM), dan werkt dit.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';
import vm from 'node:vm';

const hier = dirname(fileURLToPath(import.meta.url));
export const htmlPad = join(hier, '..', 'bewaarplicht.html');

const BEGIN = 'FISCALE KERN — BEGIN';
const EINDE = 'FISCALE KERN — EINDE';

export const html = readFileSync(htmlPad, 'utf8');

const van = html.indexOf(BEGIN);
const tot = html.indexOf(EINDE);
if (van === -1 || tot === -1 || tot < van) {
  throw new Error(
    `Kon de fiscale kern niet vinden in ${htmlPad}. ` +
    `Verwacht de markers "${BEGIN}" en "${EINDE}".`
  );
}
// Terug naar het begin van de markerregels: de markers staan in een
// //-commentaar, dus zonder dit begint het fragment midden in een comment.
const regelStart = html.lastIndexOf('\n', van) + 1;
const regelEinde = html.lastIndexOf('\n', tot) + 1;
const bron = html.slice(regelStart, regelEinde);

// Weiger DOM-gebruik in de kern: dan is het geen pure kern meer.
const verboden = [/\bdocument\b/, /\bwindow\b/, /\balert\s*\(/, /\bnavigator\b/];
for (const p of verboden) {
  if (p.test(bron)) {
    throw new Error(
      `De fiscale kern bevat "${p.source}". Houd het blok tussen de markers vrij ` +
      `van DOM-code, anders is het niet testbaar.`
    );
  }
}

// De kern mag de systeemklok niet zelf lezen: "vandaag" hoort een parameter te
// zijn, anders is verstreken-ja/nee niet reproduceerbaar te testen.
if (/new\s+Date\s*\(\s*\)/.test(bron) || /Date\.now\s*\(/.test(bron)) {
  throw new Error(
    'De fiscale kern leest de systeemklok (new Date() of Date.now()). ' +
    'Geef "vandaag" als parameter mee, anders zijn de tests niet reproduceerbaar.'
  );
}

const module_ = { exports: {} };
const context = vm.createContext({
  module: module_,
  exports: module_.exports,
  require: createRequire(import.meta.url),
  console,
});
new vm.Script(bron, { filename: 'fiscale-kern.js' }).runInContext(context);

if (!Object.keys(module_.exports).length) {
  throw new Error('De fiscale kern exporteerde niets via module.exports.');
}

export default module_.exports;
