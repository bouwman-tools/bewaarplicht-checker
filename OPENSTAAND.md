# Openstaande punten

Laatst bijgewerkt: 26-09-2026 23:38 CEST.

**Stand:** van de 12 punten staat er geen meer open, is er 1 gepland en zijn er 11 gesloten.

## Nog te doen

Geen open punten.

## Gepland, niet open

### 8. NVKS-overgangsrecht na 1 januari 2027

**Status:** gepland als taak `bewaarplicht-nvks-overgangsrecht-2027`, eenmalig op 04-01-2027
09:00 CET.
**Eigenaar:** Sylvain.

Kantoren zonder vergunning konden de NVKS onder overgangsrecht (art. 6 NVKM) toepassen tot
1 januari 2027. Daarna moet worden nagegaan of de bronkaart `art. 25 NVKS`, de overgangswaarschuwing
bij het opdrachtdossier en §8 van `update-bram-bewaarplicht-checker.md` nog alleen historische
betekenis hebben. Geen test slaat aan op die datum. De taak schrijft haar bevinding als nieuw punt
in dit bestand. Vindplaats: `vrijgave-bewaarplicht-checker-2026-09-06.md` §4 en §6.

## Bekende beperkingen, geen actie

Wat de tool bewust niet rekent staat in `update-bram-bewaarplicht-checker.md` §6: het startmoment
zelf, de verlengde navorderingstermijn, civielrechtelijke verjaring, de btw-herziening zelf,
afgesproken kortere bewaartermijnen. Dat zijn beschreven keuzes zonder gevraagde actie.

## Gesloten

### 1. Verlof- en ziektestaten als basisgegeven aanmerken

**Status:** gesloten op 26-09-2026. Gebouwd: de verlof- en urenregistratie en de
leerwerkovereenkomst staan in `bewaarplicht.html` op `basis: true` als eigen keuze, met een basisNoot die Handboek
Loonheffingen 2026 §3.2.2 en §3.5.2 noemt; het code-commentaar schrijft de knip met de
verzuimgegevens niet langer aan het Handboek toe maar aan de AVG. Termijn blijft zeven jaar,
verzuimregistratie blijft apart. Test in `tests/bronnen-en-grondslagen.test.mjs`. Zie
`vrijgave-bewaarplicht-checker-2026-09-26.md`.

### 2. Het verschil tussen de aangiften motiveren

**Status:** gesloten op 26-09-2026. Gebouwd: de basisNoot van de aangifte loonheffingen en van de
btw-aangifte en de aangifte IB/Vpb (constante `AANGIFTE_OVERIG_NOOT`) legt het verschil uit als
eigen keuze: loonheffingen volgt uit de loonadministratie, de andere aangiften uit het grootboek.
Uitkomst ongewijzigd. Zie `vrijgave-bewaarplicht-checker-2026-09-26.md`.

### 3. Bronkaart Eindejaarsregeling 2024 schrijft art. VII te veel toe

**Status:** gesloten op 26-09-2026. De bronkaart `eindejaarsregeling2024` schrijft art. VII nu
alleen de ingangsdatum toe ("met ingang van 1 januari 2026") en citeert voor het
ingebruiknemingscriterium de toelichting (Stcrt. 2024, 41523, nagelezen 26-09-2026). Uitkomst
ongewijzigd; `JAARWAARDEN.investeringsdienst2026` bevatte geen toeschrijving en is niet aangepast.

### 4. Art. 6a Uitv.besch. OB als vindplaats bij de huurovereenkomst

**Status:** gesloten op 26-09-2026. Nieuwe bronkaart `ubob6a` met letterlijk citaat van art. 6a
lid 1 en 2 (wetten.overheid.nl, BWBR0002634, geraadpleegd 26-09-2026); het documenttype
huurovereenkomst verhuurder verwijst ernaar en noemt de lezing onder art. 34a Wet OB een eigen
keuze.

### 5. Zin over onroerende zaken bij de margeregeling

**Status:** gesloten op 26-09-2026. Een onroerende zaak kan niet onder de margeregeling vallen:
gebruikte goederen zijn volgens art. 2a lid 1 onder l Wet OB "alle roerende lichamelijke zaken", en
kunstvoorwerpen, verzamelvoorwerpen en antiquiteiten zijn de goederen van bijlage J Uitv.besch. OB
(art. 4 lid 2), elk met een GN-code (wetten.overheid.nl, BWBR0002629 en BWBR0002634, versie
01-01-2026, geraadpleegd 26-09-2026). Dat een gebouw van meer dan honderd jaar geen antiquiteit is,
rust op die GN-code (hoofdstuk 97 van het douanetarief deelt goederen in) en is een lezing zonder
tegenstrijdige bron. Sylvain koos op 26-09-2026 de zin te schrappen en er de uitleg voor in de plaats
te zetten. Vindplaats: `bewaarplicht.html`, documenttype `margeregeling` en nieuwe bronkaart `ob2a`;
test in `tests/bronnen-en-grondslagen.test.mjs`. Zie `vrijgave-bewaarplicht-checker-2026-09-26-bronpunten.md`.

### 6. Citaat "Facturen over onroerende zaken bewaart u 10 jaar"

**Status:** gesloten op 26-09-2026. Het citaat staat letterlijk op de Belastingdienstpagina "Uw
facturen bewaren":
https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/btw/administratie_bijhouden/facturen_maken/uw_facturen_bewaren
(geraadpleegd 26-09-2026). URL en datum staan nu in `update-bram-bewaarplicht-checker.md` §2.2, met
de kanttekening van de bron-controleur dat de pagina alleen de tienjaarstermijn voor facturen steunt
en niets zegt over het anker bij de ingebruikneming. Het citaat is niet vervangen.

### 7. AP-pagina Personeelsdossier

**Status:** gesloten op 26-09-2026. De pagina is in de browser geopend en door de bron-controleur
zelf gelezen (pagina bijgewerkt op 15 september 2026). Onder "Bewaren personeelsdossier" staat de
kop "Maximaal 2 jaar bewaren" met de tekst dat gegevens zonder wettelijke termijn "over het algemeen"
twee jaar na uitdiensttreding worden bewaard; verzuimfrequentie staat bij de voorbeelden. Vindplaats:
https://www.autoriteitpersoonsgegevens.nl/themas/werk-en-uitkering/personeelsgegevens/personeelsdossier

### 9. Toets door Bram van de eigen standpunten (§3 en §7)

**Status:** gesloten op 26-09-2026. Van Bram werd geen reactie verwacht; Sylvain heeft de
standpunten zelf beoordeeld na een broncontrole door de bron-controleur. Uitkomst per standpunt in
`update-bram-bewaarplicht-checker.md`, aanvulling 26 september 2026. Wat daaruit nog gebouwd moet
worden staat als punt 1 tot en met 4.

### 10. Tegenstrijdigheden in `update-bram-bewaarplicht-checker.md`

**Status:** gesloten op 26-09-2026. §6 noemde tien jaar voor een investeringsdienst, §3 schaarde
bankafschriften onder het grootboek, de eerste zin van §2.2 paste niet meer bij de tool en §1
noemde 42 documenttypen. Alle vier rechtgezet; de telling (44 in 8 categorieën) is gemeten met
`tests/laad-kern.mjs`.

### 11. Registerregel in `tools.json`

**Status:** gesloten, gemeten op 26-09-2026. De vrijgavenotitie van 06-09-2026 (§6) meldde dat de
beschrijving alleen art. 52 AWR noemde en dat de investeringsdienst niet in het register stond. In
`bouwman-tools/bouwman-tools` staat nu een beschrijving over administratie, personeel en
accountantsdossiers en `jaarwaarden: ["INVESTERINGSDIENST_2026"]`.

### 12. Loze verwijzing naar "de open vragen"

**Status:** gesloten op 26-09-2026. `update-bram-bewaarplicht-checker.md` §6 verwees naar "de open
vragen", die nergens bestonden; de verwijzing wijst nu naar dit bestand.
