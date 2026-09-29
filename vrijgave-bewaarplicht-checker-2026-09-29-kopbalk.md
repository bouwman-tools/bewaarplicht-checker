# Vrijgavenotitie Bewaarplicht: de gedeelde kopbalk

29-09-2026 13:30 CEST

Technische wijziging aan de bovenkant van de pagina. Geen rekenkern, geen fiscale waarde en
geen documenttekst geraakt. De tool blijft een POC voor collega-test.

## Aanleiding

Sylvain wil bij alle tools op bouwman.tools dezelfde kopbalk als in de Dividend &
Uitkeringstoets: plakkend, met titel, ondertitel en de regel "Laatste update". Goedgekeurd op
29-09-2026 na drie proeftools. De opmaak komt uit `gedeelde-kern` (`opmaak/kopbalk.css`, blok
`KOPBALK`) en wordt daar met `tests/kopbalk.test.mjs` bewaakt.

## Wat er verandert

- De kleine kop met "← Terug" en "bouwman.tools" is vervangen door de gedeelde kopbalk. De terug-link staat als eerste rechts in de kopbalk, als "← bouwman.tools", met hetzelfde adres (/portal.html).
- De titel in de kopbalk is een div, omdat de pagina zelf al een h1 heeft. De ondertitel is de beschrijving uit het overzicht van bouwman.tools.
- Privacymelding staat erbij: de tool rekent in de browser en verstuurt niets; de adressen in de code zijn alleen bronlinks.
- De afdrukregel noemt header niet meer; de kopbalk valt op papier vanzelf weg. Het dossierstuk is ongewijzigd.
- De opmaakregels voor de oude kop zijn weggehaald.
- Geen test aangepast.
- De datum achter `<!-- LAST_UPDATED -->Laatste update: ` vult de globale pre-commit hook in;
  de markering staat nu precies één keer in de tool.
- Bij afdrukken valt de kopbalk weg.

## Wat de eigenaar beoordeelt

- De bovenkant ziet er anders uit. Een eerder logo (zoals het JOIN-logo met de koppeling naar
  joinadministraties.nl) is vervangen door het pictogramvlak; de knop Uitloggen is nieuw waar
  die er nog niet was. Wat er per tool precies is verdwenen, verhuisd of nieuw is, staat
  hierboven onder "Wat er verandert".
- Bekijk de pagina na publicatie op bouwman.tools met het oog: de kopbalk blijft staan bij
  het scrollen, de knoppen erin werken, en er valt niets over de kopbalk heen.

## Fiscale en juridische waarden

Niet van toepassing.

## Feitelijk getest

- Tests van deze repository: npm test, 150 van 150 geslaagd.
- `tests/kopbalk.test.mjs` in gedeelde-kern: groen voor deze tool (blok gelijk aan de bron,
  opbouw volgens het sjabloon, één datumregel).
