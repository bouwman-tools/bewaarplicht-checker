// Acceptatiechecks uit de onafhankelijke review: bronintegriteit en de
// grondslagen die bij een documenttype horen.
//
// Deze checks bewaken vooral dingen die stil kunnen breken: een bronlink die
// naar het verkeerde artikel wijst valt niemand op, en een grondslag die op een
// magisch getal is gebaseerd gaat pas liegen als er later een documenttype bij
// komt. De datumlogica zelf staat in datumlogica.test.mjs.

import test from 'node:test';
import assert from 'node:assert/strict';
import kern, { plat } from './laad-kern.mjs';

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
  // Uitzondering: bij een íngetrokken regeling levert de jci-resolver een
  // redirect zonder fragment op, zodat de lezer boven aan de regeling landt in
  // plaats van bij het artikel. Daar is de gedateerde ankervorm juist beter, en
  // een vaste datum is dan ook gewenst omdat overgangsrecht de tekst conserveert.
  const JCI = /^https:\/\/wetten\.overheid\.nl\/jci1\.3:c:BWBR\d{7}&artikel=[\w.]+$/;
  const GEDATEERD_ANKER = /^https:\/\/wetten\.overheid\.nl\/BWBR\d{7}\/\d{4}-\d{2}-\d{2}#[\w.]+$/;
  for (const [sleutel, bron] of Object.entries(BRONNEN)) {
    if (!bron.url.includes('wetten.overheid.nl')) continue;
    assert.ok(
      JCI.test(bron.url) || GEDATEERD_ANKER.test(bron.url),
      `bron "${sleutel}" gebruikt niet het jci-formaat en ook geen gedateerd anker`
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
  // Bankafschriften staan evenmin in die opsomming: zeven jaar bewaren wel,
  // maar zonder het label basisgegeven.
  for (const id of ['verlof-uren', 'rittenregistratie', 'bankafschrift']) {
    assert.equal(vindDocumentType(id).basis, false, `${id} staat ten onrechte als basisgegeven`);
  }
});

test('de ziekteverzuimkant staat los van de loononderbouwing', () => {
  // Eén gedeelde termijn zou betekenen dat je uit angst voor de fiscale
  // bewaarplicht zeven jaar een volledige ziektehistorie vasthoudt.
  const uren = vindDocumentType('verlof-uren');
  const verzuim = vindDocumentType('verzuimregistratie');
  assert.ok(uren && verzuim, 'verlof/uren en verzuim horen aparte documenttypen te zijn');
  assert.equal(uren.termijn, 7, 'de loononderbouwing volgt de fiscale zeven jaar');
  assert.equal(verzuim.methode, 'indicatief', 'verzuimgegevens kennen geen fiscale rekenregel');
  assert.equal(verzuim.termijn, null);
  // De verzuimkant mag nergens een fiscale grondslag claimen.
  assert.ok(!verzuim.bronnen.includes('awr52'), 'verzuimregistratie claimt een fiscale grondslag');
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
  for (const doc of DOCUMENT_TYPES) {
    if (doc.id === 'leerwerkovereenkomst') continue;
    assert.doesNotMatch(doc.naam, /BBL|leerwerk/i, `${doc.id} bundelt de leerwerkovereenkomst weer`);
  }
});

test('de verzuimtekst onderscheidt verzuimgegevens van medische gegevens', () => {
  const doc = vindDocumentType('verzuimregistratie');
  assert.match(doc.waarschuwing, /verzuimgegevens/i);
  assert.match(doc.waarschuwing, /aard en/i);
  // De AP-norm van twee jaar hoort erbij, met de uitzonderingen.
  assert.match(doc.indicatief, /twee jaar/i);
  assert.match(doc.indicatief, /eigenrisicodrager|geschil/i);
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

// ─────────────────────────────────────────────────────────────────────────────
// Dubbele termijnen: welke klok vooraan staat verschilt per documenttype, dus de
// meldingen mogen niet aannemen dat art. 34a altijd primair is.
// ─────────────────────────────────────────────────────────────────────────────

const OG_34A_PRIMAIR = ['og-akte', 'og-overig'];
const OG_AWR_PRIMAIR = ['og-onderhoud', 'og-huur-verhuurder'];

test('beide richtingen komen voor: 34a primair én AWR primair', () => {
  for (const id of OG_34A_PRIMAIR) {
    assert.match(vindDocumentType(id).primaireGrondslag, /34a/, `${id}`);
    assert.match(vindDocumentType(id).tweedeTermijn.grondslag, /52/, `${id}: tweede termijn`);
  }
  for (const id of OG_AWR_PRIMAIR) {
    assert.match(vindDocumentType(id).primaireGrondslag, /52/, `${id}`);
    assert.match(vindDocumentType(id).tweedeTermijn.grondslag, /34a/, `${id}: tweede termijn`);
  }
});

test('kortGrondslag knipt de grondslag af op het artikel', () => {
  assert.equal(kern.TEKSTEN.kortGrondslag('art. 34a Wet OB — negen jaren na ingebruikneming'),
    'art. 34a Wet OB');
  assert.equal(kern.TEKSTEN.kortGrondslag('art. 52 lid 4 AWR — zeven jaar op het stuk zelf'),
    'art. 52 lid 4 AWR');
  assert.equal(kern.TEKSTEN.kortGrondslag(undefined), '');
});

test('de melding bij een lopende primaire termijn noemt de juiste twee grondslagen', () => {
  // Zonder de tweede datum is de getoonde datum een ondergrens. De melding moet
  // per documenttype de eigen primaire en secundaire grondslag noemen.
  for (const id of [...OG_34A_PRIMAIR, ...OG_AWR_PRIMAIR]) {
    const doc = vindDocumentType(id);
    const primair = kern.TEKSTEN.kortGrondslag(doc.primaireGrondslag);
    const tweede = kern.TEKSTEN.kortGrondslag(doc.tweedeTermijn.grondslag);
    const tekst = kern.TEKSTEN.tweedeVeldOnbenut(primair, tweede);

    assert.ok(tekst.includes(primair), `${id}: primaire grondslag ontbreekt in de melding`);
    assert.ok(tekst.includes(tweede), `${id}: tweede grondslag ontbreekt in de melding`);
    assert.notEqual(primair, tweede, `${id}: beide grondslagen zijn gelijk`);
  }
});

test('de melding bij een verstreken primaire termijn zegt "kan rusten", niet "loopt nog"', () => {
  // Zonder de tweede datum weet de tool niet óf de andere termijn loopt. Een
  // stellige formulering zou een zekerheid suggereren die er niet is.
  const tekst = kern.TEKSTEN.tweedeVeldNodig('art. 34a Wet OB', 'art. 52 lid 4 AWR');
  assert.match(tekst, /kan .*rusten/i);
  assert.doesNotMatch(tekst, /loopt .*nog door/i);
  assert.match(tekst, /niet vaststellen of/i);
});

test('34a primair: verstreken OB-termijn zonder tweede datum blijft onvolledig', () => {
  // Akte van een pand uit 2010: art. 34a liep t/m 31-12-2019. Zonder de tweede
  // datum mag dat geen "verstreken" heten.
  const r = kern.berekenBewaarplicht('og-akte',
    { datum: '2010-05-01', datum2: '' }, { jaar: 2026, maand: 8, dag: 21 });
  assert.equal(r.onvolledig, true);
  assert.match(r.bepalend.grondslag, /34a/);
});

test('AWR primair: verstreken AWR-termijn zonder tweede datum blijft onvolledig', () => {
  // Onderhoudsfactuur uit 2010: art. 52 AWR liep t/m 31-12-2017. Of de OB-klok
  // van het pand nog loopt is zonder de tweede datum onbekend.
  const r = kern.berekenBewaarplicht('og-onderhoud',
    { datum: '2010-05-01', datum2: '' }, { jaar: 2026, maand: 8, dag: 21 });
  assert.equal(r.onvolledig, true);
  assert.match(r.bepalend.grondslag, /52/);
});

test('een nog lopende primaire termijn is in beide richtingen niet onvolledig', () => {
  const akte = kern.berekenBewaarplicht('og-akte',
    { datum: '2024-05-01', datum2: '' }, { jaar: 2026, maand: 8, dag: 21 });
  assert.equal(akte.onvolledig, false);
  assert.equal(akte.verstreken, false);

  const factuur = kern.berekenBewaarplicht('og-onderhoud',
    { datum: '2024-05-01', datum2: '' }, { jaar: 2026, maand: 8, dag: 21 });
  assert.equal(factuur.onvolledig, false);
  assert.equal(factuur.verstreken, false);
});

// ─────────────────────────────────────────────────────────────────────────────
// Vastgelegde inhoudelijke beslissingen. Dit zijn keuzes, geen wetmatigheden —
// juist daarom moeten ze niet stil kunnen terugvallen.
// ─────────────────────────────────────────────────────────────────────────────

test('investeringsdienst: zeven jaar, geen kunstmatige tienjaarstermijn', () => {
  // Pand uit 1998, dakrenovatie in gebruik 2026. Art. 34a is niet meegewijzigd
  // bij de herzieningsregeling voor investeringsdiensten en blijft rekenen vanaf
  // ingebruikneming van het góéd, dus de OB-klok liep in 2007 af.
  const r = kern.berekenBewaarplicht('og-onderhoud',
    { datum: '2026-06-01', datum2: '1998-01-01' }, { jaar: 2026, maand: 8, dag: 21 });
  assert.deepEqual(plat(r.laatsteBewaardag), { jaar: 2033, maand: 12, dag: 31 });
  assert.match(r.bepalend.grondslag, /52/, 'art. 52 AWR hoort hier bepalend te zijn');
});

test('Drebers staat niet als waarschuwing bij elke onderhoudsfactuur', () => {
  // Het kabinet zegt dat Drebers niet generiek mag worden toegepast, en de
  // termijn kan de belastingplichtige niet worden tegengeworpen. Een rode
  // melding bij een schilderbeurt van € 400 is dus misplaatst. Het hoort bij de
  // herziening, niet bij de bewaarplicht.
  const doc = vindDocumentType('og-onderhoud');
  assert.doesNotMatch(String(doc.waarschuwing || ''), /Drebers/);
  assert.doesNotMatch(String(doc.toelichting || ''), /Drebers/);
  assert.match(BRONNEN.ubob13.omschrijving, /Drebers/,
    'de nuance hoort wel ergens te staan, namelijk bij de herzieningsbron');
});

test('beschikking/verklaring is gesplitst op herkomst, niet op documentsoort', () => {
  const vanWerknemer = vindDocumentType('verklaring-werknemer');
  const overig = vindDocumentType('beschikking-overig');
  assert.equal(vanWerknemer.termijn, 5);
  assert.equal(overig.termijn, 7);
  // De vijfjaarscategorie geldt alleen voor wat je ván de werknemer krijgt.
  assert.match(vanWerknemer.naam, /ván de werknemer/i);
  // Voorbeelden waarvan de herkomst per geval verschilt horen niet in de naam:
  // dan vertroebelt de tool de grens die hij juist moet trekken.
  assert.doesNotMatch(vanWerknemer.naam, /doelgroepverklaring/i);
  assert.match(String(vanWerknemer.waarschuwing || ''), /zelf aan|gezamenlijk verzoek/i);
});

test('bij gemengde bestanden zegt de tool: eerst splitsen', () => {
  // Eén termijn kiezen voor een export met zowel uren als verzuimgegevens levert
  // óf fiscaal te kort bewaren óf zeven jaar onnodige verzuimdata op.
  const uren = vindDocumentType('verlof-uren');
  const verzuim = vindDocumentType('verzuimregistratie');
  assert.match(uren.waarschuwing, /aparte fiscale export|splits/i);
  assert.match(uren.waarschuwing, /geen eenduidige bewaartermijn|niet.*eenduidig/i);
  assert.match(verzuim.waarschuwing, /splits/i);
});

// ─────────────────────────────────────────────────────────────────────────────
// Accountancy: de bewaarplicht van de accountant zelf, niet die van de cliënt.
// Beide lopen op de datumklok en hebben een eigen startmoment.
// ─────────────────────────────────────────────────────────────────────────────

const PEIL = { jaar: 2026, maand: 8, dag: 21 };
const rekenAcc = (id, datum, vandaag = PEIL) =>
  kern.berekenBewaarplicht(id, { datum, datum2: '' }, vandaag);

test('opdrachtdossier: zeven jaar vanaf de datum van de opdrachtrapportage', () => {
  const r = rekenAcc('opdrachtdossier', '2026-08-21');
  assert.equal(r.bepalend.termijn.klok, 'datum', 'geen kalenderjaarklok');
  assert.deepEqual(plat(r.laatsteBewaardag), { jaar: 2033, maand: 8, dag: 21 });
  assert.deepEqual(plat(r.verstrekenVanaf), { jaar: 2033, maand: 8, dag: 22 });
});

test('opdrachtdossier ankert op de afsluiting, niet op de rapportagedatum', () => {
  // Voor een kantoor zonder Wta-vergunning geldt de NVKS via art. 6 NVKM nog tot
  // 1 januari 2027. Art. 25 lid 1 sub e rekent vanaf de afsluiting van het
  // dossier; afsluiten gebeurt ná rapporteren, dus dat anker valt later en is
  // de veilige kant.
  const doc = vindDocumentType('opdrachtdossier');
  assert.match(doc.datumLabel, /afgesloten/i);
  assert.doesNotMatch(doc.datumLabel, /rapportage/i);
  assert.ok(doc.bronnen.includes('nvks25'), 'art. 25 NVKS hoort de primaire bron te zijn');
});

test('de afsluitdatum geldt onder beide regimes en is als keuze uitgelegd', () => {
  // SKM 1 par. 31(f) eist zeven jaar voor alle opdrachten binnen het
  // toepassingsgebied, maar A85 koppelt die aan de rapportagedatum alleen voor
  // controle- en assurance-opdrachten. Voor de aan assurance verwante opdrachten
  // houdt de tool de latere afsluitdatum aan: conservatief, en uitgelegd als
  // keuze van de tool in plaats van als tekst van A85.
  const doc = vindDocumentType('opdrachtdossier');
  assert.match(doc.waarschuwing, /afsluiting van het dossier/i);
  assert.match(doc.waarschuwing, /nooit te kort/i);
  assert.match(BRONNEN.qms1.omschrijving, /A85/);
  assert.match(BRONNEN.qms1.omschrijving, /geen afzonderlijk startanker/i);
});

test('het NVKS-overgangsrecht is niet absoluut geformuleerd', () => {
  // Niet ieder kantoor zonder vergunning valt automatisch tot 1-1-2027 onder de
  // NVKS: het mág onder de overgangsvoorwaarden, en eerder overstappen kan ook.
  const doc = vindDocumentType('opdrachtdossier');
  assert.match(doc.waarschuwing, /kan .*blijven toepassen/i);
  assert.match(doc.waarschuwing, /eerdere toepassing/i);
  assert.doesNotMatch(doc.waarschuwing, /valt automatisch|geldt automatisch/i);
});

test('Wwft: de uitzondering werkt per gegeven en niet dossierbreed', () => {
  const doc = vindDocumentType('wwft-clientonderzoek');
  assert.match(doc.waarschuwing, /per gegeven/i);
  assert.match(doc.waarschuwing, /niet dossierbreed|niet genoeg|onvoldoende/i);
  assert.match(doc.waarschuwing, /alleen voor de Wwft/i);

  const kaart = kern.AANDACHTSPUNTEN.find((n) => /Wwft/.test(n.body));
  for (const grondslag of [/52 AWR/, /11 lid 6 Bta/, /NBA-regelgeving/]) {
    assert.match(kaart.body, grondslag, 'voorbeeldgrondslag ontbreekt');
  }
  // Geen absolute uitspraak over de status van beroepsregelgeving.
  assert.doesNotMatch(kaart.body, /geen wettelijk voorschrift is/i);
});

test('controledossier: zeven jaar nadat het dossier is afgesloten', () => {
  const r = rekenAcc('controledossier', '2026-08-21');
  assert.equal(r.bepalend.termijn.klok, 'datum');
  assert.deepEqual(plat(r.laatsteBewaardag), { jaar: 2033, maand: 8, dag: 21 });
  assert.deepEqual(plat(r.verstrekenVanaf), { jaar: 2033, maand: 8, dag: 22 });
});

test('status op de laatste bewaardag en de dag erna', () => {
  for (const id of ['opdrachtdossier', 'controledossier']) {
    assert.equal(rekenAcc(id, '2026-08-21', { jaar: 2033, maand: 8, dag: 20 }).verstreken, false, id);
    assert.equal(rekenAcc(id, '2026-08-21', { jaar: 2033, maand: 8, dag: 21 }).verstreken, false,
      `${id}: op de laatste bewaardag nog niet verstreken`);
    assert.equal(rekenAcc(id, '2026-08-21', { jaar: 2033, maand: 8, dag: 22 }).verstreken, true,
      `${id}: de dag erna wél verstreken`);
  }
});

test('het startmoment verschilt van een fiscale termijn met hetzelfde ankerjaar', () => {
  // Zelfde datum, ander regime: de fiscale klok loopt tot en met 31 december van
  // het eindjaar, de accountancyklok tot de dag zelf. Dat verschil moet zichtbaar
  // blijven — één generieke regel voor beide zou fout zijn.
  const dossier = rekenAcc('opdrachtdossier', '2026-08-21');
  const factuur = rekenAcc('inkoopfactuur', '2026-08-21');
  assert.deepEqual(plat(dossier.laatsteBewaardag), { jaar: 2033, maand: 8, dag: 21 });
  assert.deepEqual(plat(factuur.laatsteBewaardag), { jaar: 2033, maand: 12, dag: 31 });
  assert.notDeepEqual(plat(dossier.laatsteBewaardag), plat(factuur.laatsteBewaardag));
});

test('de accountancytermijnen claimen geen fiscale grondslag', () => {
  // De termijn van de accountant geldt niet uit zichzelf voor de administratie
  // van de cliënt; die suggestie mag de tool niet wekken.
  for (const id of ['opdrachtdossier', 'controledossier']) {
    const doc = vindDocumentType(id);
    assert.equal(doc.categorie, 'accountancy');
    assert.equal(doc.basis, false);
    assert.ok(!doc.bronnen.includes('awr52'), `${id} verwijst naar art. 52 AWR`);
    assert.match(doc.basisNoot, /niet|geen/i);
  }
});

test('een aandachtspunt legt het verschil met de fiscale bewaarplicht uit', () => {
  const kaart = kern.AANDACHTSPUNTEN.find((n) => /opdrachtdossier/i.test(n.body));
  assert.ok(kaart, 'geen aandachtspunt over het dossier van de accountant');
  assert.match(kaart.body, /langst lopende/i);
  assert.match(kaart.body, /ander startmoment/i);
});

test('id, naam en datumLabel zijn uniek genoeg om niet te verwarren', () => {
  const ids = DOCUMENT_TYPES.map((d) => d.id);
  assert.equal(new Set(ids).size, ids.length, 'dubbele id in DOCUMENT_TYPES');
  const namen = DOCUMENT_TYPES.map((d) => d.naam);
  assert.equal(new Set(namen).size, namen.length, 'dubbele naam in DOCUMENT_TYPES');
});
