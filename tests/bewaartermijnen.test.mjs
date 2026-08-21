// Tests voor de fiscale bewaartermijnen van de bewaarplicht-tool.
// Uitvoeren:  npm test
//
// De termijnen hieronder zijn geverifieerd tegen de wettekst op
// wetten.overheid.nl (geraadpleegd 21-08-2026):
//
//   art. 52 lid 4 AWR        "gedurende zeven jaar te bewaren"
//   art. 34a Wet OB 1968     "gedurende negen jaren, volgende op het jaar waarin
//                             hij het goed is gaan gebruiken"
//   art. 28rl/28sj/28tn OB   "tien jaar na afloop van het jaar waarin de
//                             handeling is verricht"
//   art. 7.5 lid 4 URLB 2011 "ten minste vijf jaren na het einde van het
//   art. 7.9 lid 2 URLB 2011  kalenderjaar waarin de dienstbetrekking is geëindigd"
//   art. 33 lid 3 Wwft       "vijf jaar na het tijdstip van het beëindigen van de
//                             zakelijke relatie"
//
// Wijzigt een van die bepalingen, dan horen de verwachtingen hieronder mee te
// wijzigen — dat is precies het vangnet dat deze suite moet bieden.

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import kern, { plat } from './laad-kern.mjs';

const {
  DOCUMENT_TYPES, CATEGORIEEN, BRONNEN, AANDACHTSPUNTEN,
  berekenBewaarplicht, vindDocumentType, documentenInCategorie, formatDatumNl,
} = kern;

const d = (jaar, maand, dag) => ({ jaar, maand, dag });
const reken = (id, datum, vandaag, datum2 = '') =>
  berekenBewaarplicht(id, { datum, datum2 }, vandaag);

// ─────────────────────────────────────────────────────────────────────────────
describe('7-jaarstermijn (art. 52 lid 4 AWR)', () => {
  test('actuele waarde vervalt in 2022 → bewaren t/m 31 december 2029', () => {
    const r = reken('inkoopfactuur', '2022-06-15', d(2026, 8, 21));
    assert.equal(r.status, 'ok');
    assert.equal(r.bepalend.termijn.startJaar, 2023, 'termijn start op 1 januari 2023');
    assert.deepEqual(plat(r.laatsteBewaardag), d(2029, 12, 31));
    assert.deepEqual(plat(r.verstrekenVanaf), d(2030, 1, 1));
    assert.equal(r.verstreken, false);
  });

  test('de datum binnen het jaar verandert de uitkomst niet', () => {
    for (const datum of ['2022-01-01', '2022-06-15', '2022-12-31']) {
      const r = reken('inkoopfactuur', datum, d(2026, 8, 21));
      assert.deepEqual(plat(r.laatsteBewaardag), d(2029, 12, 31), `fout bij ${datum}`);
    }
  });

  test('31 december 2029: NIET verstreken', () => {
    const r = reken('inkoopfactuur', '2022-06-15', d(2029, 12, 31));
    assert.equal(r.verstreken, false, 'op de laatste bewaardag zelf is de termijn nog niet voorbij');
  });

  test('1 januari 2030: wél verstreken', () => {
    const r = reken('inkoopfactuur', '2022-06-15', d(2030, 1, 1));
    assert.equal(r.verstreken, true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('contracten — de termijn start pas bij verval van de actuele waarde', () => {
  test('contract verliest actuele waarde in 2026 → t/m 31 december 2033', () => {
    const r = reken('overige-overeenkomst', '2026-09-30', d(2026, 8, 21));
    assert.equal(r.bepalend.termijn.startJaar, 2027,
      'de zeven jaar begint pas ná het jaar waarin het contract eindigt');
    assert.deepEqual(plat(r.laatsteBewaardag), d(2033, 12, 31));
    assert.equal(r.verstreken, false);
  });

  test('een einddatum in de toekomst is voor een contract normaal en geeft geen waarschuwing', () => {
    const r = reken('overige-overeenkomst', '2030-01-31', d(2026, 8, 21));
    assert.equal(r.datumInToekomst, true);
    assert.equal(r.doc.toekomstNormaal, true,
      'bij een einddatum hoort geen "datum ligt in de toekomst"-waarschuwing');
    assert.deepEqual(plat(r.laatsteBewaardag), d(2037, 12, 31));
  });

  test('bij een factuurdatum is een datum in de toekomst juist wél verdacht', () => {
    const r = reken('inkoopfactuur', '2030-01-31', d(2026, 8, 21));
    assert.equal(r.datumInToekomst, true);
    assert.ok(!r.doc.toekomstNormaal, 'een factuurdatum in de toekomst hoort een waarschuwing te geven');
  });

  test('het huurcontract-voorbeeld van de Belastingdienst klopt', () => {
    // Huurcontract van vijf jaar, eindigt 2027: bewaartermijn start 2028, t/m 2034.
    const r = reken('huurcontract-huurder', '2027-12-31', d(2026, 8, 21));
    assert.equal(r.bepalend.termijn.startJaar, 2028);
    assert.deepEqual(plat(r.laatsteBewaardag), d(2034, 12, 31));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('onroerende zaken (art. 34a Wet OB) — negen jaren ná ingebruikneming', () => {
  test('ingebruikneming 2022 → t/m 31 december 2031, niet 2032', () => {
    const r = reken('og-akte', '2022-04-01', d(2026, 8, 21));
    assert.equal(r.bepalend.termijn.startJaar, 2023);
    assert.deepEqual(plat(r.laatsteBewaardag), d(2031, 12, 31),
      'negen jaren volgend op 2022 eindigt op 31-12-2031');
    assert.deepEqual(plat(r.verstrekenVanaf), d(2032, 1, 1));
  });

  test('samen met het jaar van ingebruikneming zijn dat tien boekjaren', () => {
    const r = reken('og-akte', '2022-04-01', d(2026, 8, 21));
    const ingebruik = 2022;
    assert.equal(r.bepalend.termijn.eindJaar - ingebruik + 1, 10);
    assert.equal(r.doc.badge, '10 jaar', 'de kennisbank noemt het 10 jaar, zoals de Belastingdienst');
  });

  test('de OG-termijn is een jaar korter dan de OSS-termijn bij hetzelfde ankerjaar', () => {
    const og = reken('og-akte', '2022-04-01', d(2026, 8, 21));
    const oss = reken('oss', '2022-04-01', d(2026, 8, 21));
    assert.equal(og.bepalend.termijn.eindJaar, 2031);
    assert.equal(oss.bepalend.termijn.eindJaar, 2032);
    assert.notDeepEqual(plat(og.laatsteBewaardag), plat(oss.laatsteBewaardag),
      'één generieke +10-regel voor beide zou fout zijn');
  });

  test('tweede termijn: de langste van art. 34a en art. 52 AWR is bepalend', () => {
    // Pand in gebruik sinds 2010 → OB-termijn liep t/m 31-12-2019.
    // Onderhoudsfactuur uit 2024 → art. 52 AWR loopt t/m 31-12-2031.
    const r = reken('og-onderhoud', '2010-01-01', d(2026, 8, 21), '2024-07-01');
    assert.equal(r.termijnen.length, 2);
    assert.deepEqual(plat(r.laatsteBewaardag), d(2031, 12, 31),
      'de nog lopende zevenjaarstermijn op de factuur zelf is hier bepalend');
    assert.equal(r.bepalend.rol, 'tweede');
    assert.equal(r.verstreken, false);
  });

  test('tweede termijn: is de OB-termijn langer, dan wint die', () => {
    // Pand in gebruik sinds 2024 → OB-termijn t/m 31-12-2033.
    // Stuk verliest actuele waarde in 2024 → art. 52 AWR t/m 31-12-2031.
    const r = reken('og-onderhoud', '2024-01-01', d(2026, 8, 21), '2024-07-01');
    assert.deepEqual(plat(r.laatsteBewaardag), d(2033, 12, 31));
    assert.equal(r.bepalend.rol, 'primair');
  });

  test('zonder tweede datum rekent de tool alleen de OB-termijn', () => {
    const r = reken('og-onderhoud', '2010-01-01', d(2026, 8, 21), '');
    assert.equal(r.termijnen.length, 1);
    assert.deepEqual(plat(r.laatsteBewaardag), d(2019, 12, 31));
    assert.equal(r.verstreken, true);
  });

  test('een onleesbare tweede datum wordt gemeld en niet meegerekend', () => {
    const r = reken('og-onderhoud', '2024-01-01', d(2026, 8, 21), '2024-02-30');
    assert.equal(r.tweedeOngeldig, true);
    assert.equal(r.termijnen.length, 1);
    assert.equal(r.status, 'ok', 'de primaire berekening blijft gewoon geldig');
  });

  test('alle onroerendezaak-typen vragen om de ingebruiknemingsdatum', () => {
    for (const doc of documentenInCategorie('og')) {
      assert.match(doc.datumLabel, /ingebruikneming/i,
        `${doc.id} moet om de ingebruiknemingsdatum vragen, niet om transport-/factuurdatum`);
      assert.equal(doc.termijn, 9, `${doc.id} moet negen jaren rekenen (art. 34a Wet OB)`);
      assert.ok(doc.tweedeTermijn, `${doc.id} moet ook de zevenjaarstermijn kunnen meerekenen`);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('OSS — tien jaar na afloop van het jaar van de handeling', () => {
  test('levering in 2022 → t/m 31 december 2032', () => {
    const r = reken('oss', '2022-05-20', d(2026, 8, 21));
    assert.equal(r.bepalend.termijn.startJaar, 2023);
    assert.deepEqual(plat(r.laatsteBewaardag), d(2032, 12, 31));
    assert.deepEqual(plat(r.verstrekenVanaf), d(2033, 1, 1));
  });

  test('31 december 2032 is nog niet verstreken, 1 januari 2033 wel', () => {
    assert.equal(reken('oss', '2022-05-20', d(2032, 12, 31)).verstreken, false);
    assert.equal(reken('oss', '2022-05-20', d(2033, 1, 1)).verstreken, true);
  });

  test('de platform-boekhouding volgt dezelfde tienjaarssystematiek', () => {
    const r = reken('platform', '2022-05-20', d(2026, 8, 21));
    assert.deepEqual(plat(r.laatsteBewaardag), d(2032, 12, 31));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('personeel & loon — afwijkende termijnen', () => {
  test('kopie identiteitsbewijs: 5 jaar ná het KALENDERJAAR van uitdiensttreding', () => {
    // Dienstbetrekking eindigt 15 maart 2026 → t/m 31 december 2031.
    const r = reken('kopie-id', '2026-03-15', d(2026, 8, 21));
    assert.equal(r.doc.termijn, 5);
    assert.equal(r.bepalend.termijn.startJaar, 2027);
    assert.deepEqual(plat(r.laatsteBewaardag), d(2031, 12, 31));
  });

  test('opgaaf gegevens voor de loonheffingen volgt dezelfde 5-jaarsregel', () => {
    const r = reken('opgaaf-loonheffingen', '2026-03-15', d(2026, 8, 21));
    assert.deepEqual(plat(r.laatsteBewaardag), d(2031, 12, 31));
  });

  test('de 5-jaarstermijn is een lex specialis: korter dan de 7 jaar, niet ernaast', () => {
    const vijf = reken('kopie-id', '2026-03-15', d(2026, 8, 21));
    const zeven = reken('arbeidsovereenkomst', '2026-03-15', d(2026, 8, 21));
    assert.deepEqual(plat(vijf.laatsteBewaardag), d(2031, 12, 31));
    assert.deepEqual(plat(zeven.laatsteBewaardag), d(2033, 12, 31));
    assert.equal(vijf.termijnen.length, 1, 'geen stapeling van 5 én 7 jaar');
  });

  test('arbeidsovereenkomst rekent vanaf uitdiensttreding, niet vanaf ondertekening', () => {
    const r = reken('arbeidsovereenkomst', '2026-03-15', d(2026, 8, 21));
    assert.match(r.doc.datumLabel, /einde dienstbetrekking/i);
    assert.equal(r.bepalend.termijn.startJaar, 2027);
  });

  test('overig personeelsdossier geeft géén exacte datum maar een toelichting', () => {
    const r = reken('personeelsdossier-overig', '', d(2026, 8, 21));
    assert.equal(r.status, 'indicatief');
    assert.equal(r.doc.termijn, null);
    assert.match(r.doc.indicatief, /geen wettelijke bewaartermijn/i);
    assert.equal(r.laatsteBewaardag, undefined, 'geen schijnzekerheid: geen berekende einddatum');
  });

  test('sollicitatiegegevens idem — AVG-richtlijn, geen wettelijke termijn', () => {
    const r = reken('sollicitatiegegevens', '', d(2026, 8, 21));
    assert.equal(r.status, 'indicatief');
    assert.match(r.doc.indicatief, /vier weken/i);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('Wwft — een maximumtermijn met vernietigingsplicht', () => {
  test('rekent op de datumklok, niet op kalenderjaren', () => {
    const r = reken('wwft-clientonderzoek', '2026-03-15', d(2026, 8, 21));
    assert.equal(r.maximum, true);
    assert.equal(r.bepalend.termijn.klok, 'datum');
    assert.deepEqual(plat(r.laatsteBewaardag), d(2031, 3, 14));
    assert.deepEqual(plat(r.verstrekenVanaf), d(2031, 3, 15));
  });

  test('verschilt daarmee bewust van de loon-5-jaarstermijn met dezelfde einddatum', () => {
    const wwft = reken('wwft-clientonderzoek', '2026-03-15', d(2026, 8, 21));
    const loon = reken('kopie-id', '2026-03-15', d(2026, 8, 21));
    assert.notDeepEqual(plat(wwft.laatsteBewaardag), plat(loon.laatsteBewaardag),
      'Wwft telt vanaf het tijdstip, de URLB vanaf het einde van het kalenderjaar');
  });

  test('na afloop moet er vernietigd zijn', () => {
    const r = reken('wwft-clientonderzoek', '2020-03-15', d(2026, 8, 21));
    assert.equal(r.verstreken, true);
    assert.equal(r.maximum, true);
  });

  test('is als maximum gemarkeerd, niet als basisgegeven', () => {
    const doc = vindDocumentType('wwft-clientonderzoek');
    assert.equal(doc.maximum, true);
    assert.equal(doc.basis, false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('invoervalidatie en randgevallen', () => {
  test('geen documenttype gekozen', () => {
    assert.equal(reken('', '2022-01-01', d(2026, 8, 21)).status, 'geen-document');
    assert.equal(reken('bestaat-niet', '2022-01-01', d(2026, 8, 21)).status, 'geen-document');
  });

  test('wel een documenttype, geen datum', () => {
    const r = reken('inkoopfactuur', '', d(2026, 8, 21));
    assert.equal(r.status, 'geen-datum');
    assert.ok(r.doc, 'de tool moet nog wel weten welk type is gekozen');
  });

  test('onmogelijke datum wordt geweigerd in plaats van stilzwijgend doorgerekend', () => {
    for (const slecht of ['2022-02-30', '2022-13-01', 'onzin', '0001-01-01']) {
      assert.equal(reken('inkoopfactuur', slecht, d(2026, 8, 21)).status, 'datum-ongeldig',
        `${slecht} had geweigerd moeten worden`);
    }
  });

  test('switchen van documenttype met dezelfde datum geeft een andere uitkomst', () => {
    const factuur = reken('inkoopfactuur', '2022-06-15', d(2026, 8, 21));
    const og = reken('og-akte', '2022-06-15', d(2026, 8, 21));
    const oss = reken('oss', '2022-06-15', d(2026, 8, 21));
    assert.equal(factuur.bepalend.termijn.eindJaar, 2029);
    assert.equal(og.bepalend.termijn.eindJaar, 2031);
    assert.equal(oss.bepalend.termijn.eindJaar, 2032);
  });

  test('een indicatief type negeert een meegegeven datum', () => {
    const r = reken('personeelsdossier-overig', '2022-01-01', d(2026, 8, 21));
    assert.equal(r.status, 'indicatief');
  });

  test('rond de grens blijft de uitkomst stabiel', () => {
    const grens = [
      ['2029-12-30', false], ['2029-12-31', false],
      ['2030-01-01', true],  ['2030-01-02', true],
    ];
    for (const [vandaagStr, verwacht] of grens) {
      const [j, m, dg] = vandaagStr.split('-').map(Number);
      const r = reken('inkoopfactuur', '2022-06-15', d(j, m, dg));
      assert.equal(r.verstreken, verwacht, `fout op ${vandaagStr}`);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('centrale configuratie — kennisbank en calculator komen uit één bron', () => {
  test('elk documenttype heeft een unieke id', () => {
    const ids = DOCUMENT_TYPES.map((doc) => doc.id);
    assert.equal(new Set(ids).size, ids.length, 'dubbele id gevonden');
  });

  test('elk documenttype hoort bij een bestaande categorie', () => {
    const categorieIds = new Set(CATEGORIEEN.map((c) => c.id));
    for (const doc of DOCUMENT_TYPES) {
      assert.ok(categorieIds.has(doc.categorie), `${doc.id} verwijst naar onbekende categorie`);
    }
  });

  test('elke categorie bevat minstens één documenttype', () => {
    for (const cat of CATEGORIEEN) {
      assert.ok(documentenInCategorie(cat.id).length > 0, `categorie ${cat.id} is leeg`);
    }
  });

  test('elk documenttype heeft de velden die kennisbank en calculator nodig hebben', () => {
    for (const doc of DOCUMENT_TYPES) {
      assert.ok(doc.naam, `${doc.id} mist naam`);
      assert.ok(doc.badge, `${doc.id} mist badge`);
      assert.ok(doc.startMoment, `${doc.id} mist startMoment`);
      assert.equal(typeof doc.basis, 'boolean', `${doc.id} mist basis-vlag`);
      assert.ok(doc.basisNoot, `${doc.id} mist basisNoot`);
      assert.ok(Array.isArray(doc.bronnen) && doc.bronnen.length, `${doc.id} mist bronnen`);
      if (doc.methode === 'indicatief') {
        assert.equal(doc.termijn, null, `${doc.id} is indicatief en mag geen termijn hebben`);
        assert.ok(doc.indicatief, `${doc.id} mist de indicatieve toelichting`);
      } else {
        assert.ok(Number.isInteger(doc.termijn) && doc.termijn > 0, `${doc.id} mist een termijn`);
        assert.ok(doc.datumLabel, `${doc.id} mist datumLabel`);
        assert.ok(doc.datumHint, `${doc.id} mist datumHint`);
      }
    }
  });

  test('elke bronverwijzing bestaat en is bruikbaar', () => {
    const verwezen = new Set(DOCUMENT_TYPES.flatMap((doc) => doc.bronnen || []));
    for (const key of verwezen) {
      const b = BRONNEN[key];
      assert.ok(b, `documenttype verwijst naar onbekende bron "${key}"`);
      assert.ok(b.titel && b.kort && b.omschrijving && b.host, `bron ${key} is onvolledig`);
      assert.match(b.url, /^https:\/\//, `bron ${key} heeft geen https-URL`);
    }
  });

  test('elke gedefinieerde bron wordt ook echt gebruikt', () => {
    // De bronnenlijst op de pagina bestaat uit de documentbronnen plus een vaste
    // set die alleen in de aandachtspunten voorkomt. Een bron die nergens
    // opduikt is dode configuratie.
    const viaDocumenten = new Set(DOCUMENT_TYPES.flatMap((doc) => doc.bronnen || []));
    const alleenInNotities = ['bdConversie', 'bw210', 'bw7761', 'awr16', 'wwft', 'avg5', 'apBewaren'];
    const gebruikt = new Set([...viaDocumenten, ...alleenInNotities]);
    for (const key of Object.keys(BRONNEN)) {
      assert.ok(gebruikt.has(key), `bron "${key}" wordt nergens aangehaald`);
    }
  });

  test('de badge past bij de gerekende termijn', () => {
    for (const doc of DOCUMENT_TYPES) {
      if (doc.methode === 'indicatief') {
        assert.match(doc.badge, /geen wettelijke termijn/i, `${doc.id}`);
      } else if (doc.termijn === 9) {
        assert.equal(doc.badge, '10 jaar',
          'negen jaren ná ingebruikneming = tien boekjaren; zo noemt de Belastingdienst het');
      } else {
        assert.ok(doc.badge.startsWith(String(doc.termijn) + ' jaar'),
          `${doc.id}: badge "${doc.badge}" past niet bij termijn ${doc.termijn}`);
      }
    }
  });

  test('alleen de Wwft is een maximumtermijn', () => {
    const maxima = plat(DOCUMENT_TYPES.filter((doc) => doc.maximum).map((doc) => doc.id));
    assert.deepEqual(maxima, ['wwft-clientonderzoek']);
  });

  test('de zes basisgegevens van de Belastingdienst zitten in de kennisbank', () => {
    const basis = DOCUMENT_TYPES.filter((doc) => doc.basis).map((doc) => doc.id);
    for (const id of ['grootboek', 'debcred', 'voorraad', 'loonadministratie', 'derden']) {
      assert.ok(basis.includes(id), `${id} hoort een basisgegeven te zijn`);
    }
    // In- en verkoopadministratie zit in de facturen.
    assert.ok(basis.includes('inkoopfactuur') && basis.includes('verkoopfactuur'));
  });

  test('elk documenttype is via zijn categorie bereikbaar in het menu', () => {
    const viaCategorie = CATEGORIEEN.flatMap((cat) => documentenInCategorie(cat.id));
    assert.equal(viaCategorie.length, DOCUMENT_TYPES.length,
      'een documenttype dat niet in een categorie valt verschijnt niet in menu of kennisbank');
  });

  test('elk aandachtspunt heeft een titel en tekst', () => {
    assert.ok(AANDACHTSPUNTEN.length >= 5);
    for (const n of AANDACHTSPUNTEN) {
      assert.ok(n.titel && n.body, 'aandachtspunt is onvolledig');
    }
  });

  test('geen enkel documenttype belooft een exacte datum zonder rekenregel', () => {
    for (const doc of DOCUMENT_TYPES) {
      const r = reken(doc.id, '2022-06-15', d(2026, 8, 21));
      if (doc.methode === 'indicatief') {
        assert.equal(r.status, 'indicatief');
      } else {
        assert.equal(r.status, 'ok', `${doc.id} rekent niet door`);
        assert.equal(typeof formatDatumNl(r.laatsteBewaardag), 'string');
        assert.ok(r.laatsteBewaardag.jaar > 2022, `${doc.id} geeft een onlogische einddatum`);
      }
    }
  });
});
