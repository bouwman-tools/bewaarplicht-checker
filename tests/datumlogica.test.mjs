// Tests voor de kalenderdatum- en termijnlogica van de bewaarplicht-tool.
// Uitvoeren:  npm test
//
// Deze suite gaat NIET over fiscale inhoud (zie bewaartermijnen.test.mjs) maar
// over de twee valkuilen die in de vorige versie fout gingen:
//   1. een termijn t/m 31 december werd op 31 december al als verstreken getoond;
//   2. new Date('JJJJ-MM-DD') parst als UTC-middernacht en levert in een
//      negatieve UTC-offset (bijv. America/New_York) het verkeerde jaar op.

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import kern, { plat } from './laad-kern.mjs';

const {
  parseKalenderdatum, formatDatumNl, vergelijkDatum,
  bewaartermijnUitJaar, bewaartermijnVanafDatum, isVerstreken,
  datumPlusJaren, dagErvoor, isSchrikkeljaar, dagenInMaand,
} = kern;

const d = (jaar, maand, dag) => ({ jaar, maand, dag });

// ─────────────────────────────────────────────────────────────────────────────
describe('parseKalenderdatum — kalenderdatum zonder tijdzone', () => {
  test('parst een geldige ISO-kalenderdatum', () => {
    assert.deepEqual(plat(parseKalenderdatum('2022-06-15')), d(2022, 6, 15));
  });

  test('1 januari blijft 1 januari, ongeacht de tijdzone van de gebruiker', () => {
    // new Date('2022-01-01').getFullYear() geeft in America/New_York 2021.
    // parseKalenderdatum mag dat nooit doen.
    const oudeTZ = process.env.TZ;
    for (const tz of ['America/New_York', 'Pacific/Kiritimati', 'Europe/Amsterdam', 'UTC']) {
      process.env.TZ = tz;
      assert.deepEqual(plat(parseKalenderdatum('2022-01-01')), d(2022, 1, 1), `fout in tijdzone ${tz}`);
      assert.deepEqual(plat(parseKalenderdatum('2029-12-31')), d(2029, 12, 31), `fout in tijdzone ${tz}`);
    }
    if (oudeTZ === undefined) delete process.env.TZ; else process.env.TZ = oudeTZ;
  });

  test('weigert lege en onzinnige invoer', () => {
    for (const invoer of ['', null, undefined, 'gisteren', '15-06-2022', '2022/06/15',
                          '2022-6-15', '2022-06', 42, {}, [], '2022-06-15T00:00']) {
      assert.equal(parseKalenderdatum(invoer), null,
        `had null moeten zijn voor ${JSON.stringify(invoer)}`);
    }
  });

  test('weigert onmogelijke kalenderdata', () => {
    for (const invoer of ['2022-02-30', '2022-13-01', '2022-00-10', '2022-06-31',
                          '2023-02-29', '2022-06-00', '2022-04-31']) {
      assert.equal(parseKalenderdatum(invoer), null, `${invoer} bestaat niet en moet geweigerd worden`);
    }
  });

  test('accepteert een schrikkeldag die wél bestaat', () => {
    assert.deepEqual(plat(parseKalenderdatum('2024-02-29')), d(2024, 2, 29));
    assert.deepEqual(plat(parseKalenderdatum('2000-02-29')), d(2000, 2, 29));
  });

  test('weigert jaartallen buiten een zinnig administratief bereik', () => {
    assert.equal(parseKalenderdatum('0202-06-15'), null);
    assert.equal(parseKalenderdatum('1899-12-31'), null);
    assert.equal(parseKalenderdatum('2100-01-01'), null);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('kalenderhulpjes', () => {
  test('schrikkeljaren volgen de eeuwregel', () => {
    assert.equal(isSchrikkeljaar(2024), true);
    assert.equal(isSchrikkeljaar(2023), false);
    assert.equal(isSchrikkeljaar(1900), false, '1900 is géén schrikkeljaar');
    assert.equal(isSchrikkeljaar(2000), true, '2000 is wél een schrikkeljaar');
  });

  test('februari heeft 28 of 29 dagen', () => {
    assert.equal(dagenInMaand(2023, 2), 28);
    assert.equal(dagenInMaand(2024, 2), 29);
    assert.equal(dagenInMaand(2024, 12), 31);
    assert.equal(dagenInMaand(2024, 4), 30);
  });

  test('datumPlusJaren klemt 29 februari, standaard achteruit', () => {
    assert.deepEqual(plat(datumPlusJaren(d(2024, 2, 29), 5)), d(2029, 2, 28));
    assert.deepEqual(plat(datumPlusJaren(d(2024, 2, 29), 4)), d(2028, 2, 29), 'bestaat wél');
    assert.deepEqual(plat(datumPlusJaren(d(2022, 6, 15), 7)), d(2029, 6, 15));
  });

  test('datumPlusJaren kan ook vooruit klemmen, naar 1 maart', () => {
    assert.deepEqual(plat(datumPlusJaren(d(2024, 2, 29), 5, 'vooruit')), d(2029, 3, 1));
    assert.deepEqual(plat(datumPlusJaren(d(2024, 2, 29), 4, 'vooruit')), d(2028, 2, 29),
      'bestaat wél, dus niet klemmen');
    assert.deepEqual(plat(datumPlusJaren(d(2022, 6, 15), 7, 'vooruit')), d(2029, 6, 15));
  });

  test('dagErvoor steekt maand- en jaargrenzen over', () => {
    assert.deepEqual(plat(dagErvoor(d(2030, 1, 1))), d(2029, 12, 31));
    assert.deepEqual(plat(dagErvoor(d(2030, 3, 1))), d(2030, 2, 28));
    assert.deepEqual(plat(dagErvoor(d(2028, 3, 1))), d(2028, 2, 29));
    assert.deepEqual(plat(dagErvoor(d(2030, 5, 17))), d(2030, 5, 16));
  });

  test('formatDatumNl schrijft de maand voluit', () => {
    assert.equal(formatDatumNl(d(2029, 12, 31)), '31 december 2029');
    assert.equal(formatDatumNl(d(2030, 1, 1)), '1 januari 2030');
    assert.equal(formatDatumNl(d(2026, 3, 8)), '8 maart 2026');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('vergelijkDatum — kalendervergelijking zonder klok', () => {
  test('ordent op jaar, dan maand, dan dag', () => {
    assert.ok(vergelijkDatum(d(2029, 12, 31), d(2030, 1, 1)) < 0);
    assert.ok(vergelijkDatum(d(2030, 1, 1), d(2029, 12, 31)) > 0);
    assert.equal(vergelijkDatum(d(2029, 12, 31), d(2029, 12, 31)), 0);
    assert.ok(vergelijkDatum(d(2029, 1, 31), d(2029, 2, 1)) < 0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('bewaartermijnUitJaar — de kalenderjaarklok', () => {
  test('7 jaar, actuele waarde vervalt in 2022: t/m 31-12-2029, verstreken vanaf 01-01-2030', () => {
    const r = bewaartermijnUitJaar(2022, 7);
    assert.equal(r.startJaar, 2023, 'de termijn begint op 1 januari van het volgende jaar');
    assert.equal(r.eindJaar, 2029);
    assert.deepEqual(plat(r.laatsteBewaardag), d(2029, 12, 31));
    assert.deepEqual(plat(r.verstrekenVanaf), d(2030, 1, 1));
  });

  test('9 jaar (onroerende zaken) telt op dezelfde manier', () => {
    const r = bewaartermijnUitJaar(2022, 9);
    assert.equal(r.eindJaar, 2031);
    assert.deepEqual(plat(r.laatsteBewaardag), d(2031, 12, 31));
  });

  test('10 jaar (OSS) telt op dezelfde manier', () => {
    const r = bewaartermijnUitJaar(2022, 10);
    assert.equal(r.eindJaar, 2032);
    assert.deepEqual(plat(r.laatsteBewaardag), d(2032, 12, 31));
    assert.deepEqual(plat(r.verstrekenVanaf), d(2033, 1, 1));
  });

  test('5 jaar (loonheffingen) telt op dezelfde manier', () => {
    const r = bewaartermijnUitJaar(2026, 5);
    assert.equal(r.eindJaar, 2031);
    assert.deepEqual(plat(r.laatsteBewaardag), d(2031, 12, 31));
  });

  test('de bewaarperiode beslaat precies het aantal hele kalenderjaren van de termijn', () => {
    for (const termijn of [5, 7, 9, 10]) {
      const r = bewaartermijnUitJaar(2020, termijn);
      assert.equal(r.eindJaar - r.startJaar + 1, termijn,
        `${termijn} jaar moet ${termijn} hele kalenderjaren beslaan`);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('bewaartermijnVanafDatum — de datumklok (Wwft)', () => {
  // Art. 33 lid 3 Wwft rekent "vijf jaar na het tijdstip", maar de invoer is een
  // kalenderdatum zonder tijdstip. Eindigde de relatie laat op de dag, dan loopt
  // de termijn nog een groot deel van de vijfde verjaardag door. De verjaardag
  // telt daarom zelf nog mee als bewaardag.
  test('de vijfde verjaardag telt zelf nog mee als bewaardag', () => {
    const r = bewaartermijnVanafDatum(d(2026, 3, 15), 5);
    assert.deepEqual(plat(r.laatsteBewaardag), d(2031, 3, 15));
    assert.deepEqual(plat(r.verstrekenVanaf), d(2031, 3, 16));
  });

  test('21 augustus 2026 + 5 jaar: vernietigen pas vanaf 22 augustus 2031', () => {
    // Zou de tool op 21 augustus 2031 al vernietigen adviseren, dan is dat te
    // vroeg voor elke relatie die niet om middernacht eindigde.
    const r = bewaartermijnVanafDatum(d(2026, 8, 21), 5);
    assert.deepEqual(plat(r.laatsteBewaardag), d(2031, 8, 21));
    assert.deepEqual(plat(r.verstrekenVanaf), d(2031, 8, 22));
  });

  test('een relatie die op 1 januari eindigt loopt t/m 1 januari vijf jaar later', () => {
    const r = bewaartermijnVanafDatum(d(2026, 1, 1), 5);
    assert.deepEqual(plat(r.laatsteBewaardag), d(2031, 1, 1));
    assert.deepEqual(plat(r.verstrekenVanaf), d(2031, 1, 2));
  });

  test('een maandeinde rolt netjes door naar de volgende maand', () => {
    const r = bewaartermijnVanafDatum(d(2026, 5, 31), 5);
    assert.deepEqual(plat(r.laatsteBewaardag), d(2031, 5, 31));
    assert.deepEqual(plat(r.verstrekenVanaf), d(2031, 6, 1));
  });

  test('een jaareinde rolt netjes door naar het volgende jaar', () => {
    const r = bewaartermijnVanafDatum(d(2026, 12, 31), 5);
    assert.deepEqual(plat(r.laatsteBewaardag), d(2031, 12, 31));
    assert.deepEqual(plat(r.verstrekenVanaf), d(2032, 1, 1));
  });

  test('29 februari wordt vooruit geklemd zodat de vijf jaar echt vol zijn', () => {
    // 29 februari 2029 bestaat niet. Achteruit klemmen (28 februari) zou
    // vernietigen adviseren vóórdat er vijf volle jaren om zijn.
    const r = bewaartermijnVanafDatum(d(2024, 2, 29), 5);
    assert.deepEqual(plat(r.laatsteBewaardag), d(2029, 3, 1));
    assert.deepEqual(plat(r.verstrekenVanaf), d(2029, 3, 2));
  });

  test('29 februari naar een schrikkeljaar houdt gewoon 29 februari', () => {
    const r = bewaartermijnVanafDatum(d(2024, 2, 29), 4);
    assert.deepEqual(plat(r.laatsteBewaardag), d(2028, 2, 29));
    assert.deepEqual(plat(r.verstrekenVanaf), d(2028, 3, 1));
  });

  test('een relatie die 29 februari eindigt krijgt niet minder dan één die 28 februari eindigt', () => {
    const opDe28 = bewaartermijnVanafDatum(d(2024, 2, 28), 5);
    const opDe29 = bewaartermijnVanafDatum(d(2024, 2, 29), 5);
    assert.ok(vergelijkDatum(opDe29.verstrekenVanaf, opDe28.verstrekenVanaf) > 0,
      'later eindigen mag nooit een kortere termijn opleveren');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('REGRESSIE: 31 december mag niet als verstreken gelden', () => {
  const r = bewaartermijnUitJaar(2022, 7); // t/m 31-12-2029

  test('30-12-2029 — niet verstreken', () => {
    assert.equal(isVerstreken(r, d(2029, 12, 30)), false);
  });

  test('31-12-2029 — NIET verstreken (dit was de bug)', () => {
    assert.equal(isVerstreken(r, d(2029, 12, 31)), false,
      'op de laatste bewaardag zelf is de termijn nog niet verstreken');
  });

  test('01-01-2030 — wél verstreken', () => {
    assert.equal(isVerstreken(r, d(2030, 1, 1)), true);
  });

  test('later dan 01-01-2030 — verstreken', () => {
    assert.equal(isVerstreken(r, d(2030, 1, 2)), true);
    assert.equal(isVerstreken(r, d(2031, 6, 1)), true);
  });

  test('de uitkomst hangt niet van het tijdstip op de dag af', () => {
    // De oude code vergeleek new Date(2029, 11, 31) met new Date(): élk moment ná
    // middernacht op 31 december sloeg om naar "verstreken". isVerstreken kent
    // alleen kalenderdagen, dus dat kan niet meer gebeuren.
    assert.equal(isVerstreken(r, d(2029, 12, 31)), false);
    assert.equal(isVerstreken(r, d(2030, 1, 1)), true);
  });
});
