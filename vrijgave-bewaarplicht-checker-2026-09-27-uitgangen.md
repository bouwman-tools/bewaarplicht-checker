# Vrijgave bewaarplicht-checker — 27-09-2026 — de drie uitgangen

## Wat is gewijzigd

`bewaarplicht.html` had tot nu toe geen enkele uitgang: de uitkomst stond alleen op het
scherm. Deze wijziging voegt de drie uitgangen toe die `tool-uitgangen` voorschrijft, zonder
enige fiscale of juridische waarde te wijzigen — de rekenkern tussen de FISCALE KERN-markers
is onaangeraakt.

1. **Dossierstuk (afdrukbaar).** Een nieuw kenmerkveld ("Kenmerk of cliëntnaam") en een
   afdrukknop. De afdruk toont het documenttype, de ingevulde datum (en tweede datum indien
   van toepassing), de volledige uitkomst met tussenstappen (termijn, start, verstreken- of
   vernietigingsdatum, laatste bewaardag, en bij een dubbele termijn beide termijnen met de
   bepalende gemarkeerd), een vaste kaart met de vindplaatsen van dat documenttype, een vaste
   afbakeningstekst en een versiestempel. De afdruk leest dezelfde uitkomst die `bereken()`
   al heeft berekend (via `vulDossierstuk()`); er wordt niets herrekend. Interactieve chrome
   (header, knoppen, kennisbank, aandachtspunten, bronnenlijst, invoervelden zelf) is via
   `@media print` verborgen.
2. **Excel-export.** Eigen, afhankelijkheidsvrije xlsx-schrijver, overgenomen als kopie uit
   `gedeelde-kern/blokken/xlsx-schrijver.js` (zie hieronder). Eén bevroren werkblad zonder
   formules: kop (tool, versie, exportdatum, kenmerk), invoer, uitkomst met dezelfde labels
   als op het scherm, en een toelichtingsblok met de vindplaatsen en de afbakening. Leest
   `laatsteUitkomst`, dezelfde staat die het scherm net heeft getoond. Bestandsnaam
   `bewaarplicht-<kenmerk>-<jjjj-mm-dd>.xlsx`.
3. **Dossierbestand.** Twee knoppen, "Opslaan als bestand" en "Bestand openen", met een klein
   JSON-bestand (`tool`, `formaatversie`, `doctype`, `datum`, `datum2`, `kenmerk`). Bij openen:
   - tool-identificatie en formaatversie worden gevalideerd vóór de huidige casus wordt
     vervangen; een nieuwere formaatversie dan de tool kent geeft een melding en verandert
     niets;
   - een ontbrekend `doctype`- of `datum`-veld geeft een zichtbare melding, geen stille
     standaardwaarde;
   - een onbekend documenttype-id (bijvoorbeeld uit een latere toolversie) wordt geweigerd
     met een duidelijke melding;
   - **de twee bekende gebreken zijn vermeden.** Elke waarde uit het bestand gaat door
     `typeof waarde === 'string'` vóór verdere verwerking — nooit door `Number(...)` — dus
     `true`, `[]` of `' '` als datum of kenmerk worden niet stil als geldig geaccepteerd
     (getest, zie hieronder). En `onerror`, `onabort` én een gegooide uitzondering tijdens
     het verwerken van de gelezen tekst worden alle drie afgevangen, met een duidelijke
     melding en zonder de huidige casus te wijzigen (getest).

## Gedeelde code: xlsx-schrijver

`bewaarplicht.html` bevat nu een kopie van `gedeelde-kern/blokken/xlsx-schrijver.js`,
herkenbaar aan de markers `XLSX-SCHRIJVER — BEGIN/EINDE` en het herkomstcommentaar. Die
kopie is **handmatig** neergezet in plaats van via `node verspreid.mjs`: `gedeelde-kern`
had bij aanvang van deze sessie een ongecommitte wijziging in `manifest.json` van een andere
sessie. Draaien van `verspreid.mjs` had die wijziging kunnen raken. Zodra `gedeelde-kern`
weer rustig is, kan een volgende sessie de reguliere verspreidingsroute draaien om te
bevestigen dat deze kopie bit-voor-bit gelijk is aan de bron; zie het nieuwe punt in
`OPENSTAAND.md`.

## Wat niet is gewijzigd

Geen enkele fiscale waarde, termijn, bron of rekenregel. De FISCALE KERN-sectie is
onaangeraakt; de test die haar puurheid bewaakt (geen `Date`, geen DOM-toegang binnen de
markers) slaagt onveranderd.

## Test

```
npm test
```

150 acceptatiechecks, allemaal groen (0 fails) — hetzelfde aantal en dezelfde uitslag als
vóór deze wijziging, plus handmatige verificatie in de browser (lokale server, geen
externe afhankelijkheden):

- dossierstuk: kenmerk, documenttype, datum(s), volledige uitkomst inclusief dubbele
  termijn bij een onroerende zaak, en de bronnenlijst komen correct over in het
  print-only-blok;
- Excel-export: het gegenereerde bestand is een geldig ZIP-archief (Python `zipfile`,
  `testzip()` geeft `None`), bevat geen `<f>`-formules, en de celwaarden komen overeen met
  het scherm;
- dossierbestand: opslaan en openen rondom (inhoud klopt), en alle foutpaden gecontroleerd:
  kapotte JSON, verkeerde tool, ontbrekend veld, nieuwere formaatversie, `true` als datum,
  `[]` als kenmerk, `' '` als tweede datum (leeggelaten met waarschuwing, niet stil
  geaccepteerd), `onerror`, `onabort` en een gegooide uitzondering tijdens het verwerken.

## Wat de eigenaar concreet moet beoordelen

- Of de drie uitgangen inhoudelijk compleet genoeg zijn voor gebruik in de praktijk, met
  name of het dossierstuk voldoende is voor het opdrachtdossier van de accountant zelf
  (waar deze tool ook voor is bedoeld).
- Of de bestandsnaamgeving (`bewaarplicht-<kenmerk>-<datum>.xlsx` / `bewaarplicht-<kenmerk>.json`)
  aansluit bij hoe collega's dossiers in de klantmap benoemen.
- `tools.json` in `bouwman-tools` is **niet** aangepast; die registerregel zou een
  `uitgangen`-blok (`dossierstuk`, `excel`, `dossierbestand`, alle drie `true`) moeten
  krijgen. Dat is aan de coördinerende sessie, zoals de opdracht voorschreef.
