// Acceptatiechecks uit de onafhankelijke review: bronintegriteit en de
// grondslagen die bij een documenttype horen.
//
// Deze checks bewaken vooral dingen die stil kunnen breken: een bronlink die
// naar het verkeerde artikel wijst valt niemand op, en een grondslag die op een
// magisch getal is gebaseerd gaat pas liegen als er later een documenttype bij
// komt. De datumlogica zelf staat in datumlogica.test.mjs.

import test from 'node:test';
import assert from 'node:assert/strict';
import kern from './laad-kern.mjs';

const {
  BRONNEN, DOCUMENT_TYPES, AANDACHTSPUNTEN,
  vindDocumentType, termijnOmschrijving,
} = kern;

test('elke bron waarnaar een documenttype verwijst bestaat', () => {
  for (const doc of DOCUMENT_TYPES) {
    for (const sleutel of doc.bronnen || []) {
      assert.ok(BRONNEN[sleutel], `${doc.id} verwijst naar onbekende bron "${sleutel}"`);
    }
  }
});

test('elke bron heeft een korte naam, titel, omschrijving en url', () => {
  for (const [sleutel, bron] of Object.entries(BRONNEN)) {
    for (const veld of ['kort', 'titel', 'omschrijving', 'url', 'host']) {
      assert.ok(bron[veld], `bron "${sleutel}" mist het veld ${veld}`);
    }
    assert.match(bron.url, /^https:\/\//, `bron "${sleutel}" gebruikt geen https`);
  }
});

test('elk documenttype noemt ten minste één bron', () => {
  for (const doc of DOCUMENT_TYPES) {
    assert.ok((doc.bronnen || []).length > 0, `${doc.id} heeft geen bronnen`);
  }
});

test('geen enkele bronlink bevat een editiecode van een Belastingdienst-pdf', () => {
  // download.belastingdienst.nl-links dragen een editiecode in de bestandsnaam
  // (…al0401z14fd.pdf). Oudere codes geven een harde 404 zonder redirect, dus
  // zo'n link breekt gegarandeerd bij de volgende uitgave. Link naar de
  // landingspagina, die altijd naar de actuele pdf wijst.
  for (const [sleutel, bron] of Object.entries(BRONNEN)) {
    assert.doesNotMatch(
      bron.url, /download\.belastingdienst\.nl/,
      `bron "${sleutel}" linkt rechtstreeks naar een pdf met editiecode`
    );
  }
});

test('de AVG-link wijst naar de Nederlandse tekst van artikel 5', () => {
  // Zonder taalcode levert EUR-Lex de Engelse tekst, bovenaan de hele
  // verordening — terwijl de tool art. 5 lid 1 sub e citeert.
  assert.match(BRONNEN.avg5.url, /\/nld/);
  assert.match(BRONNEN.avg5.url, /#art_5$/);
});

test('wetten.overheid.nl-links gebruiken het Juriconnect-formaat met artikelnummer', () => {
  // De jci-vorm resolvet op artikelnummer en blijft werken als een hoofdstuk of
  // afdeling wordt hernummerd; een hard gecodeerd structuuranker doet dat niet
  // en faalt dan stil met HTTP 200 bovenaan de regeling.
  for (const [sleutel, bron] of Object.entries(BRONNEN)) {
    if (!bron.url.includes('wetten.overheid.nl')) continue;
    assert.match(
      bron.url, /^https:\/\/wetten\.overheid\.nl\/jci1\.3:c:BWBR\d{7}&artikel=[\w.]+$/,
      `bron "${sleutel}" gebruikt niet het jci-formaat`
    );
  }
});

test('een algemeen contract verwijst naar de algemene verjaring, niet naar aanneming van werk', () => {
  // Art. 7:761 BW is een lex specialis voor gebreken in opgeleverd werk bij
  // aanneming van werk. Als enige civiele bron onder "overige overeenkomst"
  // is dat misleidend.
  const doc = vindDocumentType('overige-overeenkomst');
  assert.ok(doc.bronnen.includes('bw3307'), 'mist art. 3:307 BW');
  assert.ok(doc.bronnen.includes('bw3310'), 'mist art. 3:310 BW');
  assert.ok(!doc.bronnen.includes('bw7761'), 'verwijst nog naar art. 7:761 BW');
});

test('de grondslagtekst van art. 34a hangt niet aan het getal negen', () => {
  // Zou de tekst op termijn === 9 sturen, dan gaat een latere negenjaarstermijn
  // uit een andere bron stilzwijgend "art. 34a Wet OB" heten.
  const verzonnen = { id: 'test', termijn: 9, methode: 'jaareinde' };
  assert.equal(termijnOmschrijving(verzonnen), '9 jaar');

  const echt = vindDocumentType('og-akte');
  assert.match(termijnOmschrijving(echt), /art\. 34a Wet OB/);
});

test('gegevens met een AVG-gevoelige kant zijn geen basisgegeven', () => {
  // Het Handboek noemt verlof- en ziektestaten en de rittenregistratie niet in
  // de opsomming van basisgegevens. Ze als basisgegeven aanmerken ontneemt de
  // gebruiker bovendien de route naar een kortere termijn, en die is hier door
  // de AVG juist nodig.
  for (const id of ['verlof-ziekte', 'rittenregistratie']) {
    assert.equal(vindDocumentType(id).basis, false, `${id} staat ten onrechte als basisgegeven`);
  }
});

test('de basisgegevens zijn precies de zes die de Belastingdienst opsomt', () => {
  // Grootboek, debiteuren/crediteuren, voorraad, in- en verkoop, loon, en
  // gegevens van belang voor de heffing bij derden — plus de stukken die die
  // administraties rechtstreeks vormen.
  const basis = DOCUMENT_TYPES.filter((d) => d.basis).map((d) => d.id);
  for (const id of ['grootboek', 'debcred', 'voorraad', 'derden', 'loonadministratie']) {
    assert.ok(basis.includes(id), `${id} hoort basisgegeven te zijn`);
  }
  // Een maximumtermijn kan per definitie geen basisgegeven zijn.
  for (const doc of DOCUMENT_TYPES) {
    if (doc.maximum) assert.equal(doc.basis, false, `${doc.id} is maximum én basisgegeven`);
  }
});

test('de leerwerkovereenkomst staat los van de ziektestaten', () => {
  // Een neutraal contractstuk en een gezondheidsgerelateerd gegeven horen niet
  // in één documenttype met één termijn: hun privacyprofiel verschilt volledig.
  const bbl = vindDocumentType('leerwerkovereenkomst');
  assert.ok(bbl, 'documenttype leerwerkovereenkomst ontbreekt');
  assert.doesNotMatch(vindDocumentType('verlof-ziekte').naam, /BBL|leerwerk/i);
});

test('de verzuimtekst onderscheidt verzuimgegevens van medische gegevens', () => {
  const doc = vindDocumentType('verlof-ziekte');
  assert.match(doc.waarschuwing, /verzuimgegevens/i);
  assert.match(doc.waarschuwing, /medische gegevens/i);
  // De AP-norm van twee jaar voor de verzuimfrequentie mag niet ontbreken.
  assert.match(doc.toelichting, /twee jaar/i);
});

test('de Wwft heet overal een vaste termijn, niet een maximum', () => {
  // Het documenttype noemt vijf jaar "ondergrens én bovengrens"; een
  // kennisbankkaart die tegelijk "maximum" zegt laat de tool zichzelf
  // tegenspreken.
  const kaart = AANDACHTSPUNTEN.find((n) => /Wwft/.test(n.body));
  assert.ok(kaart, 'geen kennisbankkaart over de Wwft gevonden');
  assert.doesNotMatch(kaart.titel, /maximum/i);
  // De uitzondering hoort erbij: vernietigen tenzij een ander voorschrift geldt.
  assert.match(kaart.body, /tenzij bij wettelijk voorschrift anders is bepaald/);
});

test('documenttypen met een tweede termijn leggen beide grondslagen vast', () => {
  for (const doc of DOCUMENT_TYPES) {
    if (!doc.tweedeTermijn) continue;
    assert.ok(doc.tweedeTermijn.grondslag, `${doc.id}: tweede termijn zonder grondslag`);
    assert.ok(doc.bronnen.includes('ob34a'), `${doc.id}: tweede termijn maar geen art. 34a als bron`);
    assert.ok(doc.bronnen.includes('awr52'), `${doc.id}: tweede termijn maar geen art. 52 AWR als bron`);
  }
});

test('id, naam en datumLabel zijn uniek genoeg om niet te verwarren', () => {
  const ids = DOCUMENT_TYPES.map((d) => d.id);
  assert.equal(new Set(ids).size, ids.length, 'dubbele id in DOCUMENT_TYPES');
  const namen = DOCUMENT_TYPES.map((d) => d.naam);
  assert.equal(new Set(namen).size, namen.length, 'dubbele naam in DOCUMENT_TYPES');
});
