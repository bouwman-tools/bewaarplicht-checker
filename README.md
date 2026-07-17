# Bewaarplicht Checker

Kennisbank en rekentool voor de fiscale bewaarplicht (AWR art. 52). Toont de wettelijke bewaartermijnen per documenttype en berekent de einddatum voor een specifiek document.

## Gebruik

1. Open de tool via [bouwman.tools/bewaarplicht.html](https://bouwman.tools/bewaarplicht.html)
2. **Kennisbank**: blader door de categorieën voor een overzicht van alle bewaartermijnen (7 of 10 jaar per documenttype)
3. **Einddatum berekenen**: selecteer een documenttype en vul de relevante datum in
4. De tool toont automatisch tot wanneer het document bewaard moet worden ("bewaren t/m 31 december [jaar]")
5. Als de termijn al verstreken is, verschijnt de melding "Termijn verstreken ✔"

## Inhoud

- **Kennisbank** — 7 categorieën: facturen & betalingen, jaarrekening & boekhouding, contracten & overeenkomsten, personeel & loon, onroerend goed, bijzondere regelingen (margegoederen, OSS), correspondentie
- **Aandachtspunten** — AVG-spanning, digitaal bewaren, navorderingstermijn 12 jaar (art. 16 lid 4 AWR)
- **Bronnen** — directe links naar AWR art. 52 en belastingdienst.nl

## Bewaartermijnen

| Termijn | Geldt voor |
|---|---|
| 7 jaar | Facturen, bankafschriften, aangiften, contracten (na afloop), loonadministratie, correspondentie |
| 10 jaar | Onroerend goed documenten, onderhoudsfacturen OG, OSS/Unieregeling |

De termijn start op **1 januari van het jaar volgend op het moment waarop het document zijn actuele waarde verliest** — niet op de aanmaakdatum.

## Toegang

Via het bouwman.tools portaal (sectie Administratie & Archief). Geen installatie nodig, werkt volledig in de browser zonder externe API.

## Sync

Bij elke push naar `master` kopieert de GitHub Action automatisch `bewaarplicht.html` naar de centrale [bouwman-tools/bouwman-tools](https://github.com/bouwman-tools/bouwman-tools) repo. De tool is binnen ~1 minuut live.
