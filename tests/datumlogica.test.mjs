// Tests voor de kalenderdatum- en termijnlogica van de bewaarplicht-tool.
// Uitvoeren:  node --test tests/
//
// Deze suite gaat NIET over fiscale inhoud (zie bewaartermijnen.test.mjs) maar
// over de twee valkuilen die in de vorige versie fout gingen:
//   1. een termijn t/m 31 december werd op 31 december al als verstreken getoond;
//   2. new Date('YYYY-MM-DD') parst als UTC-middernacht en levert in een
//      negatieve UTC-offset (bijv. America/New_York) het verkeerde jaar op.

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import kern from './laad-kern.mjs';

const { parseKalenderdatum, formatDatumNl, vergelijkDatum, bewaartermijnUitJaar } = kern;

// ─────────────────────────────────────────────────────────────────────────────
describe('parseKalenderdatum — kalenderdatum zonder tijdzone', () => {
  test('parst een geldige ISO-kalenderdatum', () => {
    assert.deepEqual(parseKalenderdatum('2022-06-15'), { jaar: 2022, maand: 6, dag: 15 });
  });

  test('1 januari blijft 1 januari — ongeacht de tijdzone van de gebruiker', () => {
    // new Date('2022-01-01') geeft in America/New_York 31-12-2021.
    // parseKalenderdatum mag dat nooit doen.
    const oudeTZ = process.env.TZ;
    for (const tz of ['America/New_York', 'Pacific/Kiritimati', 'Europe/Amsterdam', 'UTC']) {
      process.env.TZ = tz;
      assert.deepEqual(
        parseKalenderdatum('2022-01-01'),
        { jaar: 2022, maand: 1, dag: 1 },
        `fout in tijdzone ${tz}`
      );
    }
    process.env.TZ = oudeTZ;
  });

  test('31 december blijft 31 december', () => {
    assert.deepEqual(parseKalenderdatum('2029-12-31'), { jaar: 2029, maand: 12, dag: 31 });
  });

  test('weigert lege en onzinnige invoer', () => {
    for (const invoer of ['', null, undefined, 'gisteren', '15-06-2022', '2022/06/15', '2022-6-15', '2022-06', 42, {}]) {
      assert.equal(parseKalenderdatum(invoer), null, `had null moeten zijn voor ${JSON.stringify(invoer)}`);
    }
  });

  test('weigert onmogelijke kalenderdata', () => {
    for (const invoer of ['2022-02-30', '2022-13-01', '2022-00-10', '2022-06-31', '2023-02-29', '2022-06-00']) {
      assert.equal(parseKalenderdatum(invoer), null, `${invoer} bestaat niet en moet geweigerd worden`);
    }
  });

  test('accepteert een schrikkeldag die wél bestaat', () => {
    assert.deepEqual(parseKalenderdatum('2024-02-29'), { jaar: 2024, maand: 2, dag: 29 });
  });

  test('weigert jaartallen buiten een zinnig administratief bereik', () => {
    assert.equal(parseKalenderdatum('0202-06-15'), null);
    assert.equal(parseKalenderdatum('9999-06-15'), null);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('vergelijkDatum — kalendervergelijking zonder klok', () => {
  const d = (j, m, dg) => ({ jaar: j, maand: m, dag: dg });

  test('ordent op jaar, dan maand, dan dag', () => {
    assert.ok(vergelijkDatum(d(2029, 12, 31), d(2030, 1, 1)) < 0);
    assert.ok(vergelijkDatum(d(2030, 1, 1), d(2029, 12, 31)) > 0);
    assert.equal(vergelijkDatum(d(2029, 12, 31), d(2029, 12, 31)), 0);
    assert.ok(vergelijkDatum(d(2029, 1, 31), d(2029, 2, 1)) < 0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('bewaartermijnUitJaar — de kernrekenregel', () => {
  test('7 jaar, actuele waarde vervalt in 2022: t/m 31-12-2029, verstreken vanaf 01-01-2030', () => {
    const r = bewaartermijnUitJaar(2022, 7);
    assert.equal(r.startJaar, 2023, 'de termijn begint op 1 januari van het volgende jaar');
    assert.equal(r.eindJaar, 2029);
    assert.deepEqual(r.laatsteBewaardag, { jaar: 2029, maand: 12, dag: 31 });
    assert.deepEqual(r.verstrekenVanaf, { jaar: 2030, maand: 1, dag: 1 });
  });

  test('10 jaar telt op dezelfde manier', () => {
    const r = bewaartermijnUitJaar(2022, 10);
    assert.equal(r.eindJaar, 2032);
    assert.deepEqual(r.laatsteBewaardag, { jaar: 2032, maand: 12, dag: 31 });
    assert.deepEqual(r.verstrekenVanaf, { jaar: 2033, maand: 1, dag: 1 });
  });

  test('5 jaar (loonheffingen) telt op dezelfde manier', () => {
    const r = bewaartermijnUitJaar(2026, 5);
    assert.equal(r.eindJaar, 2031);
    assert.deepEqual(r.laatsteBewaardag, { jaar: 2031, maand: 12, dag: 31 });
  });

  test('de bewaarperiode beslaat precies het aantal hele kalenderjaren van de termijn', () => {
    for (const termijn of [5, 7, 10]) {
      const r = bewaartermijnUitJaar(2020, termijn);
      assert.equal(r.eindJaar - r.startJaar + 1, termijn,
        `${termijn} jaar moet ${termijn} hele kalenderjaren beslaan`);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('REGRESSIE: 31 december mag niet als verstreken gelden', () => {
  const { isVerstreken } = kern;
  const r = bewaartermijnUitJaar(2022, 7); // t/m 31-12-2029

  test('30-12-2029 — niet verstreken', () => {
    assert.equal(isVerstreken(r, { jaar: 2029, maand: 12, dag: 30 }), false);
  });

  test('31-12-2029 — NIET verstreken (dit was de bug)', () => {
    assert.equal(isVerstreken(r, { jaar: 2029, maand: 12, dag: 31 }), false,
      'op de laatste bewaardag zelf is de termijn nog niet verstreken');
  });

  test('01-01-2030 — wél verstreken', () => {
    assert.equal(isVerstreken(r, { jaar: 2030, maand: 1, dag: 1 }), true);
  });

  test('het tijdstip op de dag verandert niets aan de uitkomst', () => {
    // De oude code vergeleek new Date(2029,11,31) met new Date(): elk moment
    // ná middernacht op 31 december sloeg om naar "verstreken".
    const laatsteDag = { jaar: 2029, maand: 12, dag: 31 };
    assert.equal(isVerstreken(r, laatsteDag), false);
    assert.equal(isVerstreken(r, laatsteDag), false);
  });
});
