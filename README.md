# Bewaarplicht Checker

Kennisbank en rekentool voor de fiscale bewaarplicht. Toont per documenttype welke bewaartermijn
geldt, vanaf welk moment die loopt, en tot wanneer een concreet stuk bewaard moet blijven.

Hoofdregel is art. 52 lid 4 AWR (zeven jaar). Daarnaast rekent de tool de afwijkende termijnen uit
de Wet OB (onroerende zaken, eenloketsysteem), de Uitvoeringsregeling loonbelasting 2011 en de Wwft.

## Gebruik

1. Open de tool via [bouwman.tools/bewaarplicht.html](https://bouwman.tools/bewaarplicht.html)
2. **Kennisbank** — 40 documenttypen in 7 categorieën, met per type de termijn, het startmoment en
   of het een basisgegeven is
3. **Einddatum berekenen** — kies een documenttype en vul de datum in waar dat type om vraagt. Welke
   datum dat is verschilt per type en staat onder het invoerveld
4. De uitkomst toont de laatste bewaardag en de dag waarop de termijn verstrijkt

## Bewaartermijnen

| Termijn | Geldt voor | Grondslag |
|---|---|---|
| 7 jaar | Basisgegevens en de overige administratie | art. 52 lid 4 AWR |
| 10 jaar | Onroerende zaken: negen jaren volgend op het jaar van ingebruikneming | art. 34a Wet OB 1968 |
| 10 jaar | OSS: tien jaar na afloop van het jaar van de handeling | art. 28rl, 28sj, 28tn Wet OB |
| 5 jaar | Kopie identiteitsbewijs en opgaaf gegevens voor de loonheffingen | art. 7.5 lid 4 en 7.9 lid 2 URLB 2011 |
| 5 jaar | Beschikking of verklaring ontvangen ván de werknemer; zelf aangevraagd is 7 jaar | Handboek Loonheffingen |
| 5 jaar, vast | Wwft-cliëntonderzoek: bewaren én daarna vernietigen, vanaf einde zakelijke relatie | art. 33 lid 3 en 34a lid 3 Wwft |
| 5 jaar, vast | Wwft-melding ongebruikelijke transactie, vanaf het tijdstip van de melding | art. 34 lid 2 en 34a lid 3 Wwft |
| geen | Overig personeelsdossier, ziekteverzuimregistratie, sollicitatiegegevens | AVG, norminvulling AP |

De termijn begint niet op de aanmaakdatum maar op **1 januari van het jaar volgend op het moment
waarop het gegeven zijn actuele waarde verliest** — behalve bij de Wwft, die vanaf de dag zelf telt.

Twee valkuilen die de tool expliciet afvangt:

- **De twee tienjaarstermijnen zijn niet gelijk.** Art. 34a telt negen jaren *volgend op* het jaar
  van ingebruikneming; de OSS-bepalingen tellen tien jaar *na afloop van* het jaar van de handeling.
  Bij hetzelfde ankerjaar 2022 is dat 31-12-2031 tegen 31-12-2032.
- **Bij onroerende zaken lopen twee termijnen naast elkaar**, en welke vooraan staat verschilt per
  documenttype. Art. 34a is ruim in scope maar smal in termijn: de klok hangt aan de ingebruikneming
  van het *pand*, niet aan het stuk, dus onderhoud of een nieuw huurcontract start geen nieuwe
  tienjaarsklok. Bij stukken met een eigen ankermoment (factuur, huurovereenkomst) staat art. 52 AWR
  daarom vooraan — die geldt altijd — met de OB-klok als optioneel tweede veld. Bij stukken die het
  pand zelf betreffen (akte, overige gegevens) is het andersom. De tool berekent beide en neemt de
  laatst aflopende termijn.
- **Ontbreekt de tweede datum en is de eerste termijn verstreken, dan zegt de tool "onvolledig"** in
  plaats van "verstreken". Dat voorkomt een vernietigingssignaal voor een stuk waarop de andere klok
  nog kan lopen.

## Inhoudelijke verantwoording

De fiscale keuzes, de bronnen en de open vragen staan in
[`update-bram-bewaarplicht-checker.md`](update-bram-bewaarplicht-checker.md). Dat document is de
plek voor inhoudelijke discussie; deze README beschrijft alleen het gebruik en de opzet.

## Toegang

Via het bouwman.tools portaal (sectie Administratie & Archief). Geen installatie nodig, werkt
volledig in de browser zonder externe API.

## Sync

Bij elke push naar `master` kopieert een GitHub Action `bewaarplicht.html` naar de centrale
[bouwman-tools/bouwman-tools](https://github.com/bouwman-tools/bouwman-tools) repo. De tool is binnen
~1 minuut live.

---

## Voor de ontwikkelaar

### Opzet

De tool is één zelfstandig HTML-bestand (`bewaarplicht.html`) zonder externe afhankelijkheden: geen
frameworks, geen CDN-links, geen API-aanroepen. Dat is een bewuste keuze — de tool moet ook werken
zonder internetverbinding.

Het bestand valt uiteen in twee delen:

- **De fiscale kern**, tussen de markers `FISCALE KERN — BEGIN` en `FISCALE KERN — EINDE`. Puur
  JavaScript: geen DOM, geen `Date`, geen globale state. Hier staan de documenttypen, de termijnen,
  de bronnen, de teksten en de rekenregels.
- **De UI-laag** daaronder. Leest de DOM, roept de kern aan, schrijft de DOM. Bouwt het
  documenttype-menu, de kennisbank, de aandachtspunten en de bronnenlijst op uit de kern.

### Eén centrale gegevensbron

`DOCUMENT_TYPES` is de enige plek waar een documenttype bestaat. Menu, kennisbank, invoerlabels,
toelichtingen, rekenregels en bronverwijzingen komen daar alle uit voort. Een documenttype toevoegen
is één object toevoegen aan die array; er staat niets in de HTML dat je hoeft bij te werken.

De configuratie wordt aan het eind van de kern diep bevroren, zodat een schrijfactie zichtbaar faalt
in plaats van stilletjes de uitkomst van een ander documenttype te veranderen.

### Twee klokken

`bewaartermijnUitJaar(ankerjaar, n)` — N jaren die gaan lopen ná afloop van het kalenderjaar van het
ankermoment. Dit is de klok voor vrijwel alles.

`bewaartermijnVanafDatum(ankerdatum, n)` — N jaren vanaf de dag zelf. Alleen de Wwft. De wet rekent
daar vanaf een *tijdstip*, terwijl de UI alleen een kalenderdatum kent; daarom telt de N-de
verjaardag zelf nog mee als bewaardag en mag pas de dag daarna worden vernietigd. Bij een
schrikkeldag klemt deze vooruit (29-02 + 5 jaar → t/m 1 maart), zodat de termijn altijd minstens het
volle aantal jaren beslaat.

Datums zijn platte `{jaar, maand, dag}`-objecten. `Date` wordt in de kern niet gebruikt:
`new Date('2022-01-01')` parst als UTC-middernacht en levert in een negatieve UTC-offset het
verkeerde jaar op.

### Tests

```bash
npm test
```

113 acceptatiechecks via `node --test`, zonder dependencies. `tests/laad-kern.mjs` snijdt de kern uit
het HTML-bestand en draait die in een `vm`-sandbox. Die loader bewaakt ook dat de kern puur blijft:
hij weigert DOM-toegang (`document.`, `window.`) en elk gebruik van `Date`.

Omdat de kern in een eigen realm draait, zijn objecten die hij teruggeeft niet `deepStrictEqual` aan
objectliteralen in de tests. Gebruik daarvoor de `plat()`-helper uit `laad-kern.mjs`.

De suite dekt onder meer: de 31-decembergrens, tijdzonegedrag, schrikkeljaren, de vier fiscale
klokken, de dubbele termijn bij onroerende zaken, ongeldige invoer, en consistentie van de
configuratie (unieke id's, bestaande bronnen, badge past bij termijn, geen dode bronconfiguratie).

### Lokaal bekijken

```bash
python -m http.server 8842
```

Daarna `http://127.0.0.1:8842/bewaarplicht.html`. Via `file://` werkt de pagina ook, maar een echte
origin is handiger bij het debuggen.

### Scope

De tool is een intern hulpmiddel voor adviseurs, geen juridisch systeem en geen vervanging voor
fiscaal advies. Die beperking zit bewust in de teksten: bij een verstreken termijn toont de tool
uitdrukkelijk dat verstreken niet hetzelfde is als vernietigen. Vergroot die scope niet bij
integratie in de productieomgeving.
