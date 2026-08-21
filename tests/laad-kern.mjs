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

// De kern staat vol Nederlandse toelichting waarin "document" een gewoon woord
// is, en waarin een comment mag uitleggen waaróm we new Date() vermijden. De
// bewakingen hieronder moeten dus naar echte code kijken, niet naar proza.
// Daarom strippen we eerst commentaar en stringinhoud — met respect voor quotes,
// zodat een URL in een string ("https://…") niet halverwege een regel snijdt.
function alleenCode(src) {
  let uit = '';
  let i = 0;
  while (i < src.length) {
    const c = src[i], twee = src.slice(i, i + 2);
    if (twee === '//') {
      while (i < src.length && src[i] !== '\n') i++;
    } else if (twee === '/*') {
      i += 2;
      while (i < src.length && src.slice(i, i + 2) !== '*/') i++;
      i += 2;
    } else if (c === '"' || c === "'" || c === '`') {
      const quote = c;
      i++;
      while (i < src.length && src[i] !== quote) {
        if (src[i] === '\\') i++;
        i++;
      }
      i++;
      uit += quote + quote; // lege string: houdt de syntaxis herkenbaar
    } else {
      uit += c;
      i++;
    }
  }
  return uit;
}

const code = alleenCode(bron);

// Weiger DOM- en omgevingsgebruik in de kern: dan is het geen pure kern meer.
const verboden = [
  /\bdocument\s*[.[]/,
  /\bwindow\s*[.[]/,
  /\bnavigator\s*[.[]/,
  /\balert\s*\(/,
  /\blocalStorage\b/,
  /\bfetch\s*\(/,
];
for (const p of verboden) {
  if (p.test(code)) {
    throw new Error(
      `De fiscale kern bevat "${p.source}". Houd het blok tussen de markers vrij ` +
      `van UI- en omgevingscode, anders is het niet testbaar.`
    );
  }
}

// De kern mag de systeemklok niet zelf lezen: "vandaag" hoort een parameter te
// zijn, anders is verstreken-ja/nee niet reproduceerbaar te testen.
if (/new\s+Date\s*\(/.test(code) || /Date\.now\s*\(/.test(code)) {
  throw new Error(
    'De fiscale kern gebruikt Date. Reken met platte {jaar, maand, dag}-objecten en ' +
    'geef "vandaag" als parameter mee — anders zijn de tests niet reproduceerbaar en ' +
    'sluipt tijdzonegedrag de kalenderlogica in.'
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

// De kern draait in een eigen vm-realm, dus objecten die hij teruggeeft hebben
// een ander Object.prototype dan objectliteralen in dit bestand. deepStrictEqual
// struikelt daarover ("same structure but not reference-equal"). plat() haalt de
// waarde terug naar deze realm zodat vergelijken gewoon werkt.
export const plat = (waarde) =>
  waarde === undefined ? undefined : JSON.parse(JSON.stringify(waarde));
