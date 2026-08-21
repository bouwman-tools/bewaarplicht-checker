# Terugkoppeling: bewaarplicht-checker

**Aan** Bram, DK Accountants · **Van** Join Administraties · **Datum** 21 augustus 2026
**Aanleiding** De bewaarplicht-tool is inhoudelijk herzien. Bij die herziening zijn een paar
uitgangspunten van de vorige versie gesneuveld. Hieronder staan alleen de punten waarop jouw
oordeel waarde heeft — niet de technische wijzigingen.

---

## 1. Wat de tool doet

De tool bestaat uit een kennisbank (42 documenttypen in 8 categorieën) en een rekentool. Je kiest
een documenttype, vult één datum in, en de tool geeft de laatste dag waarop het stuk bewaard moet
blijven plus de dag waarop de termijn is verstreken.

De tool is bedoeld voor adviseurs, niet voor cliënten. Hij rekent de **fiscale** termijn van de
cliënt, de Wwft (§4), en sinds kort ook de bewaarplichten voor het **dossier van de accountant
zelf** (§8). Die laatste twee zijn nadrukkelijk andere verplichtingen met een eigen startmoment.

---

## 2. Vijf inhoudelijke correcties op de vorige versie

Dit zijn de wijzigingen waar een fiscale beoordeling bij hoort. De rest van de herziening was
techniek en tekst.

### 2.1 Onroerende zaken: het ankermoment was fout

De vorige versie vroeg om de **transportdatum**, de **factuurdatum onderhoud** of de **einddatum van
de huurovereenkomst**, en telde daar tien jaar bij op. Dat is op twee punten onjuist.

Art. 34a Wet OB 1968 luidt integraal:

> "De ondernemer is verplicht boeken, bescheiden en andere gegevensdragers of de inhoud daarvan
> – zulks ter keuze van de inspecteur – betreffende onroerende zaken en rechten waaraan deze zijn
> onderworpen **gedurende negen jaren, volgende op het jaar waarin hij het goed is gaan gebruiken**,
> te bewaren."

Dus: het anker is de **ingebruikneming**, en de termijn is **negen jaren volgend op** dat jaar —
samen met het jaar van ingebruikneming tien boekjaren, en zo noemt de Belastingdienst het ook
("Gegevens over onroerende zaken en rechten op onroerende zaken moet u 10 jaar bewaren").

Concreet: bij ingebruikneming in 2022 loopt de termijn t/m **31 december 2031**. De oude tool kwam
met een factuurdatum in 2022 uit op 31 december 2032 — een jaar te lang, en bij een ouder pand met
een recente factuur juist veel te kort.

**Het vervolg is waar het schuurt.** Voor een onderhoudsfactuur uit 2024 op een pand dat sinds
2010 in gebruik is, was de art. 34a-termijn al op 31-12-2019 afgelopen. Op de factuur zélf loopt dan
nog gewoon de zevenjaarstermijn van art. 52 lid 4 AWR. De tool vraagt daarom bij onroerende zaken om
een **tweede, optionele datum** (het moment waarop het stuk zijn actuele waarde verliest) en neemt
de **laatste van beide** termijnen. Vult de gebruiker die tweede datum niet in en is de
art. 34a-termijn voorbij, dan meldt de tool bewust "onvolledig" in plaats van "verstreken".

Wij houden de max-benadering aan en vragen de ingebruiknemingsdatum alléén bij
onroerendezaakgegevens, zodat een gebruiker niet standaard met twee datums wordt opgezadeld. Zie
§7.1 voor de onderbouwing.

### 2.2 De reikwijdte van art. 34a — hier zit onze zwakste onderbouwing

Wij passen de tienjaarstermijn toe op vier typen: de akte, de onderhouds-/investeringsfactuur, de
huurovereenkomst van de verhuurder, en overige gegevens over de zaak. De grondslag is de zinsnede
"**betreffende** onroerende zaken en rechten waaraan deze zijn onderworpen", die ruimer is dan de
zaak zelf. De Belastingdienst bevestigt het voor facturen ("Facturen over onroerende zaken bewaart u
10 jaar").

Voor de **huurovereenkomst** hebben wij geen expliciete bron gevonden. Onze redenering: bij optie
belaste verhuur is het contract onderdeel van de onderbouwing van de optie en van de herziening.
"Rechten waaraan deze zijn onderworpen" ziet op beperkte zakelijke rechten (erfpacht, opstal,
vruchtgebruik) en dus niet op huur; wij plaatsen de huurovereenkomst onder de ruimere categorie
"bescheiden betreffende". **Dat is een lezing, geen vindplaats.**

Wij houden die lezing aan: de huurovereenkomst blijft in de OG-categorie, maar met art. 52 AWR
vooraan en de OB-klok als optioneel tweede veld. Datzelfde geldt voor een schoonmaak- of
kleinonderhoudsfactuur: die valt naar de letter onder "bescheiden betreffende", maar start geen
nieuwe tienjaarsklok, want het anker blijft de ingebruikneming van het pand. Zie §7.2.

### 2.3 Loonadministratie: 7 jaar vanaf uitdiensttreding klopte niet als algemene regel

De vorige versie koppelde "loonadministratie" aan zeven jaar vanaf de datum van uitdiensttreding.
Dat gooide drie regimes op één hoop. De tool onderscheidt ze nu:

| Stuk | Termijn | Startmoment | Grondslag |
|---|---|---|---|
| Loonadministratie, loonstroken, jaaropgaven, loonstaat | 7 jaar | na het kalenderjaar | art. 52 lid 4 AWR (basisgegeven) |
| Arbeidsovereenkomst | 7 jaar | na het jaar van uitdiensttreding | art. 52 lid 4 AWR + Handboek §3.2.2 |
| Opgaaf gegevens voor de loonheffingen | 5 jaar | na het **kalenderjaar** van uitdiensttreding | art. 7.9 lid 2 URLB 2011 |
| Kopie identiteitsbewijs | 5 jaar | na het **kalenderjaar** van uitdiensttreding | art. 7.5 lid 4 URLB 2011 |
| Beschikking/verklaring van de werknemer | 5 jaar | na het kalenderjaar van uitdiensttreding | alleen Handboek §3.5.2 en §17.2 |
| Overig personeelsdossier | geen wettelijke termijn | — | AVG, AP-norminvulling |

Beide URLB-bepalingen luiden woordelijk gelijk:

> "De inhoudingsplichtige bewaart de in dit artikel bedoelde gegevens en afschriften **ten minste
> vijf jaren na het einde van het kalenderjaar waarin de dienstbetrekking is geëindigd**."

**Twee punten die hieruit volgden.**

Ten eerste: het Handboek Loonheffingen 2026 is hier **intern tegenstrijdig**. §3.5.2 schrijft
"ten minste 5 kalenderjaren na het einde van de dienstbetrekking", terwijl §2.3.4 en §17.2
"na het kalenderjaar waarin de dienstbetrekking eindigt" schrijven — precies de wettekst. Dat
scheelt een heel kalenderjaar. Wij volgen de wettekst, die met §17.2 overeenkomt, en waarschuwen de
gebruiker voor de afwijking (§7.3).

Ten tweede: voor "beschikking/verklaring van de werknemer" bestaat **geen wetsbepaling**, alleen het
Handboek. Dat is inmiddels gesplitst op herkomst: wat u ván de werknemer krijgt vijf jaar, wat u
zelf aanvraagt of wat op gezamenlijk verzoek is afgegeven zeven jaar via art. 52 AWR. Zie §7.3.

Los daarvan een detail dat vaak misgaat en dat wij nu expliciet maken: het Handboek rekent
**verlof- en ziektestaten** in §3.2.2 uitdrukkelijk tot de gegevens die bij de loonadministratie
worden bewaard. Voor zover die staten de loondoorbetaling en de loonheffingen onderbouwen, vallen ze
dus onder de fiscale zeven jaar.

Maar dat is niet het hele verhaal, en de eerste opzet van de tool was hier te stellig. De AP zet
**verzuimfrequentie** juist in de categorie waarvoor zij als richtsnoer maximaal twee jaar na
uitdiensttreding noemt, met de kanttekening dat de wet daar geen termijn voor geeft. Zeven jaar is
dus verdedigbaar voor de staten die de loonbetaling dragen, maar niet als blanco termijn voor de
verzuimadministratie in het personeelsdossier. De tool scheidt die twee nu en zegt dat er ook bij.

Twee gevolgen daarvan:

- Verlof- en ziektestaten staan niet meer als **basisgegeven** aangemerkt. Het Handboek noemt ze in
  §3.2.2 bij de *overige* gegevens bij de loonadministratie, niet in de opsomming van basisgegevens
  in §3.5.2. Dat verschil is hier niet academisch: §3.5.2 sluit af met "Voor de overige gegevens
  kunt u met ons afspraken maken over kortere bewaartermijnen dan 7 jaar", en juist bij
  gezondheidsgerelateerde gegevens is die route door de AVG nodig.
- De **leerwerkovereenkomst (bbl)** stond in dezelfde rij als de ziektestaten. Dat is losgetrokken
  naar een eigen documenttype: een neutraal contractstuk en een gegeven met een gezondheidscomponent
  horen niet onder één termijn met één privacyprofiel.

Wij hebben in de tool ook de formulering over medische gegevens genuanceerd. Die luidde dat een
werkgever medische gegevens "niet mag vastleggen". De AP hanteert het onderscheid tussen
*verzuimgegevens* — een beperkte, limitatieve set die wél mag — en *medische gegevens* over aard en
oorzaak, die niet mogen. De tool volgt die tweedeling, en scheidt de verzuimkant sinds §7.4 ook
als eigen documenttype van de loononderbouwing.

### 2.4 Digitaal bewaren: "notariële aktes" is geschrapt

De vorige versie schreef dat niet alle documenten mogen worden gedigitaliseerd, "bijv. notariële
aktes". Wij hebben die uitzondering **in geen enkele primaire bron teruggevonden** — niet in art. 52
lid 5 AWR, niet in art. 2:10 lid 4 BW, en niet in de Belastingdienst-brochure *Uw geautomatiseerde
administratie en de fiscale bewaarplicht* (AL 040, uitgave juli 2026), waarin "notari" en "akte"
nul treffers geven.

Wat er wél staat, art. 52 lid 5 AWR:

> "De op een gegevensdrager aangebrachte gegevens, **uitgezonderd de op papier gestelde balans en
> staat van baten en lasten**, kunnen op een andere gegevensdrager worden overgebracht en bewaard,
> mits de overbrenging geschiedt met juiste en volledige weergave der gegevens en deze gegevens
> gedurende de volledige bewaartijd beschikbaar zijn en binnen redelijke tijd leesbaar kunnen worden
> gemaakt."

En de brochure voegt daar één uitzondering aan toe: van documenten die bepalend zijn voor de rechten
bij in- of uitvoer (zoals oorsprongscertificaten) moet het origineel bewaard blijven.

De tool noemt nu dus twee uitzonderingen in plaats van drie. Voor zover er een bewaarplicht voor
originele notariële aktes bestaat, vloeit die voort uit de Wet op het notarisambt en rust die op de
notaris, niet op de administratieplichtige ondernemer. Het is een hardnekkige aanname in de
adviespraktijk, maar er is geen fiscale vindplaats voor. Wel iets anders: een notariële akte kan
inhoudelijk prima onder art. 34a Wet OB vallen als bescheid betreffende een onroerende zaak. Dat
gaat over hóé lang, niet over de vraag of hij mag worden gedigitaliseerd (§7.2).

### 2.5 Civielrechtelijke verjaring: verkeerd artikel onder een algemeen contract

Bij het documenttype "overige overeenkomst / contract" stond als enige civielrechtelijke bron
**art. 7:761 BW**. Dat is een lex specialis voor gebreken in opgeleverd werk bij *aanneming van werk*.
De zinsnede "in alle andere gevallen" in lid 2 ziet op andere aanneming dan bouwwerken — niet op
overeenkomsten in het algemeen. Als enige verwijzing onder een willekeurig contract wees hij dus de
verkeerde kant op.

Vervangen door de algemene bepalingen:

> **Art. 3:307 lid 1 BW** — "Een rechtsvordering tot nakoming van een verbintenis uit overeenkomst
> tot een geven of een doen verjaart door verloop van vijf jaren na de aanvang van de dag, volgende
> op die waarop de vordering opeisbaar is geworden."

> **Art. 3:310 lid 1 BW** — verjaring "door verloop van vijf jaren" na bekendheid met schade én
> aansprakelijke persoon, "en in ieder geval door verloop van twintig jaren na de gebeurtenis
> waardoor de schade is veroorzaakt".

Art. 7:761 BW blijft in de tool staan waar hij hoort: bij het aandachtspunt over niet-fiscale
bewaarplichten, voor bouwdossiers.

**Rittenregistratie.** Die stond als basisgegeven met het Handboek als grondslag. Het Handboek noemt
de rittenregistratie echter niet in de opsomming van basisgegevens, en kent er ook geen eigen
bewaartermijn voor — zeven jaar volgt uit art. 52 lid 4 AWR. Bovendien geldt dat voor de werkgever
die de bijtelling zélf achterwege laat op grond van een sluitende registratie. Bij een "Verklaring
geen privégebruik auto" ligt de bewijslast bij de wérknemer; de werkgever bewaart dan alleen een
kopie van die verklaring. De tool zegt dat nu, en merkt de rittenregistratie aan als overig gegeven.

---

## 3. Modelkeuzes — geen fiscale regels

Deze keuzes zijn van ons en staan los van de wet. Ze bepalen wel wat de gebruiker ziet.

- **Eén rekenregel voor bijna alles.** Elke termijn is "N jaren die gaan lopen ná afloop van het
  kalenderjaar van een ankermoment". Dat geldt voor art. 52 AWR (7), art. 34a Wet OB (9),
  art. 28rl/28sj/28tn Wet OB (10) en art. 7.5/7.9 URLB (5). Alleen de Wwft telt anders (§4).
- **De langste termijn wint.** Lopen er twee termijnen naast elkaar, dan is de laatst aflopende
  bepalend — een stuk mag pas weg als er geen enkele bewaarplicht meer op rust.
- **Geen exacte datum bij ontbrekende regel.** Voor het overige personeelsdossier en voor
  sollicitatiegegevens toont de tool géén berekende einddatum, maar de AP-norminvulling in woorden.
  Liever geen antwoord dan schijnzekerheid.
- **"Verstreken" is geen vernietigingsadvies.** Bij een verstreken termijn toont de tool een blok
  dat wijst op art. 2:10 BW, lopende procedures, arbeids- en civielrechtelijke gronden (bij
  bouwwerken tot twintig jaar na oplevering, art. 7:761 lid 2 BW) en het eigen bewaarbeleid.
- **Onwaarschijnlijke datums.** Een datum die meer dan 25 jaar in de toekomst ligt levert een
  waarschuwing op. Willekeurige grens, bedoeld om typefouten in het jaartal te vangen.
- **Basisgegeven of niet.** De tool merkt per documenttype aan of het een basisgegeven is (altijd
  zeven jaar) of een overig gegeven (kortere termijn in overleg met de Belastingdienst mogelijk).
  Voor het grootboek, de debiteuren-/crediteurenadministratie, de voorraadadministratie, de in- en
  verkoopadministratie, de loonadministratie en gegevens ten behoeve van derden is dat de letterlijke
  opsomming van de Belastingdienst. Bij **bankafschriften**, de **aangifte loonheffingen** en de
  **margeadministratie** is het onze toerekening: wij scharen die onder respectievelijk het
  grootboek, de loonadministratie en de in- en verkoopadministratie. Die drie mag je tegenspreken.

---

## 4. Wwft: de enige termijn die óók een bovengrens is

Nieuw in de tool, en het punt waarop wij de meeste fouten in de praktijk verwachten.

> Art. 33 lid 3 Wwft: "Een instelling **bewaart** de in het eerste en tweede lid bedoelde gegevens op
> toegankelijke wijze **gedurende vijf jaar na het tijdstip van het beëindigen van de zakelijke
> relatie** of gedurende vijf jaar na het uitvoeren van de desbetreffende transactie."

> Art. 34a lid 3 Wwft: "Een instelling **vernietigt** de persoonsgegevens die zij uit hoofde van deze
> wet heeft verkregen **onmiddellijk na het verstrijken van de termijn**, bedoeld in artikel 33,
> derde lid, en 34, **tenzij bij wettelijk voorschrift anders is bepaald**."

Samen is dat één vaste termijn: vijf jaar bewaren, daarna vernietigen. Een Wwft-cliëntdossier
"voor de zekerheid" meenemen in de fiscale zevenjaarsbak is dus geen veilige keuze.

Twee gevolgen die wij bewust hebben doorgevoerd:

1. **De Wwft telt vanaf de dag, niet vanaf het jaareinde.** Relatie beëindigd op 15 maart 2026 →
   bewaren t/m 14 maart 2031, vernietigen vanaf 15 maart 2031. Alle andere termijnen in de tool
   lopen tot en met 31 december.
2. **Bij een schrikkeldag klemmen wij vooruit.** Relatie beëindigd op 29 februari 2024 → vernietigen
   vanaf 1 maart 2029, niet vanaf 28 februari. Anders zou de tool vernietigen adviseren voordat de
   vijf jaar vol zijn.

3. **De melding is een apart documenttype geworden.** Art. 34a lid 3 verwijst niet alleen naar
   art. 33 lid 3 maar ook naar **art. 34**, en dat artikel kent een eigen ankermoment:

   > Art. 34 lid 2 Wwft: "Een instelling bewaart de in het eerste lid bedoelde gegevens op
   > toegankelijke wijze gedurende vijf jaar **na het tijdstip van het doen van de melding**,
   > respectievelijk het tijdstip van de ontvangst van het bericht van de Financiële inlichtingen
   > eenheid."

   Het gaat om de gegevens waarmee de transactie te reconstrueren is, een afschrift van de melding
   en het ontvangstbericht van de FIU. Dat anker — de meldingsdatum — ligt bijna altijd vóór het
   einde van de zakelijke relatie, dus één termijn voor beide zou de verkeerde uitkomst geven. De
   tool rekent ze nu apart.

**De slotclausule.** "Tenzij bij wettelijk voorschrift anders is bepaald" is voor een
accountantskantoor niet theoretisch. Die uitzondering werkt op **documentniveau, niet op
dossierniveau**: de wetsgeschiedenis licht toe dat dezelfde persoonsgegevens ook voor een ánder doel
verzameld kunnen zijn en dáárvoor een eigen bewaartermijn kunnen hebben. De tool zegt daarom niet
"een Wwft-dossier is ook fiscaal, dus alles zeven jaar", maar: beoordeel per stuk of er zelfstandig
een tweede grondslag is. Gegevens die alleen voor de Wwft zijn verzameld, gaan na vijf jaar weg.
Welke voorschriften in onze praktijk het vaakst die tweede grondslag vormen, benoemen wij nu niet
limitatief in de tool — dat is het punt waar een aanvulling vanuit jouw praktijk het meest oplevert.

---

## 5. Testvectoren

Alle uitkomsten hieronder zijn door de rekenkern zelf gegenereerd, niet overgetypt.
Peildatum voor de statuskolom: **21 augustus 2026**.

| Geval | Badge | Termijn start | Bewaren t/m | Verstreken vanaf | Status |
|---|---|---|---|---|---|
| Inkoopfactuur, factuurdatum 15-06-2022 | 7 jaar | 1 jan 2023 | 31 december 2029 | 1 januari 2030 | loopt |
| Grootboek boekjaar 2022 | 7 jaar | 1 jan 2023 | 31 december 2029 | 1 januari 2030 | loopt |
| Contract eindigt 30-09-2026 | 7 jaar | 1 jan 2027 | 31 december 2033 | 1 januari 2034 | loopt |
| Huurperiode eindigt 31-12-2027 | 7 jaar | 1 jan 2028 | 31 december 2034 | 1 januari 2035 | loopt |
| Akte, pand in gebruik sinds 01-04-2022 | 10 jaar | 1 jan 2023 | 31 december 2031 | 1 januari 2032 | loopt |
| Onderhoudsfactuur 2024, pand in gebruik sinds 2010 | 10 jaar | 1 jan 2025 | 31 december 2031 | 1 januari 2032 | loopt |
| Onderhoudsfactuur 2024, pand in gebruik sinds 2024 | 10 jaar | 1 jan 2025 | 31 december 2033 | 1 januari 2034 | loopt |
| OSS-levering 20-05-2022 | 10 jaar | 1 jan 2023 | 31 december 2032 | 1 januari 2033 | loopt |
| Kopie ID, uit dienst 15-03-2026 | 5 jaar | 1 jan 2027 | 31 december 2031 | 1 januari 2032 | loopt |
| Opgaaf loonheffingen, uit dienst 15-03-2026 | 5 jaar | 1 jan 2027 | 31 december 2031 | 1 januari 2032 | loopt |
| Arbeidsovereenkomst, uit dienst 15-03-2026 | 7 jaar | 1 jan 2027 | 31 december 2033 | 1 januari 2034 | loopt |
| Wwft, relatie beëindigd 15-03-2026 | 5 jaar (vast) | 15 maart 2026 | 14 maart 2031 | 15 maart 2031 | loopt |
| Wwft, relatie beëindigd 29-02-2024 | 5 jaar (vast) | 29 februari 2024 | 28 februari 2029 | 1 maart 2029 | loopt |
| Margeadministratie boekjaar 2022 | 7 jaar | 1 jan 2023 | 31 december 2029 | 1 januari 2030 | loopt |

Twee vectoren verdienen aparte aandacht.

**De twee tienjaarstermijnen zijn niet gelijk.** Bij hetzelfde ankerjaar 2022 eindigt de OG-termijn
op 31-12-2031 en de OSS-termijn op 31-12-2032. Art. 34a telt negen jaren *volgend op*, de
OSS-bepalingen tellen tien jaar *na afloop van*. Eén generieke "+10" zou fout zijn.

**De grens rond 31 december.** De vorige versie toonde een termijn op 31 december al als verstreken.
Dat is hersteld:

| Peildatum | Inkoopfactuur 2022 |
|---|---|
| 30-12-2029 | nog niet verstreken |
| 31-12-2029 | nog niet verstreken |
| 01-01-2030 | verstreken |

---

## 6. Wat de tool bewust niet rekent

- **Het startmoment zelf.** De tool vraagt de gebruiker wanneer de actuele waarde vervalt; zij leidt
  dat niet af. Art. 52 AWR zegt niets over het startmoment — dat komt uit de uitleg van de
  Belastingdienst ("Vervalt de actualiteitswaarde? Dan begint de bewaartermijn") en is per geval
  feitelijk.
- **De verlengde navorderingstermijn.** Art. 16 lid 4 AWR (twaalf jaar bij buitenlandbestanddelen) is
  een bevoegdheid van de inspecteur en verlengt de bewaarplicht niet. De tool noemt het als
  aandachtspunt maar rekent het niet mee.
- **Civielrechtelijke verjaring.** Genoemd als aandachtspunt (art. 7:761 lid 2 BW: twintig jaar na
  oplevering bij bouwwerken), niet berekend — dat hangt te zeer van de feiten af.
- **De btw-herziening zelf.** De tool noemt dat de bewaartermijn van art. 34a één op één meeloopt met
  de herzieningsperiode van art. 13 lid 2 Uitv.besch. OB, maar rekent geen herziening uit.
- **Afspraken over kortere bewaartermijnen.** De tool merkt aan welke gegevens "overig" zijn en dus
  in aanmerking komen, maar rekent geen afgesproken termijn.
- **Investeringsdiensten vanaf € 30.000.** Per 1 januari 2026 kennen die een eigen herziening over
  vijf boekjaren (art. 13 lid 1 sub c en lid 3 Uitv.besch. OB). Art. 34a Wet OB is daarbij **niet**
  meegewijzigd. Wij behandelen zo'n factuur daarom als een bescheid "betreffende onroerende zaken",
  dus tien jaar. Zie de open vragen.

---

## 7. Onze eigen voorlopige standpunten — graag jouw toets

De negen punten uit de vorige versie hebben wij zelf langs de wettekst, de actuele
Belastingdienstinformatie, het Handboek Loonheffingen 2026 en de wetsgeschiedenis gelegd, en op basis
daarvan de tool aangepast. **Dit is dus onze eigen invulling en nog niet extern getoetst** — precies
daarom leggen we hem hier voor. De onderbouwing per punt staat hieronder; waar wij een keuze hebben
gemaakt die niet dwingend uit de wet volgt, is dat aangegeven.

| # | Onderwerp | Ons standpunt | Doorgevoerd |
|---|---|---|---|
| 1 | Max-benadering onroerende zaken | Praktisch en juridisch verdedigbaar | Ongewijzigd. Ingebruikneming wordt alleen bij onroerendezaakgegevens uitgevraagd |
| 2 | Huurovereenkomst verhuurder | Valt onder art. 34a, maar géén nieuwe tienjaarsklok vanaf het contract | **Omgedraaid**: art. 52 AWR vooraan, OB-klok als optioneel tweede veld |
| 2b | Klein onderhoud | Ook binnen scope, maar het anker blijft de ingebruikneming van het pand | **Omgedraaid**, idem. Pand 1995 + factuur 2026 → zeven jaar, niet opnieuw tien |
| 3 | Vijfjaarstermijn loon | Wettekst volgen; §17.2 van het Handboek bevestigt dat | Was al zo; onderbouwing toegevoegd aan de bron |
| 4 | Beschikking/verklaring werknemer | Vijf jaar, met bronstatus Handboek in plaats van wet | Was al zo |
| 5 | Notariële aktes | Schrappen als conversie-uitzondering is juist | Was al zo; toegevoegd dat een akte inhoudelijk wél onder art. 34a kan vallen |
| 6 | Wwft-slotclausule | Werkt op documentniveau, niet op dossierniveau | Teksten aangescherpt |
| 7 | Basisgegevens | Bankafschriften niet categorisch basisgegeven | **Geherclassificeerd** naar overig gegeven |
| 8 | Investeringsdiensten vanaf € 30.000 | Zeven jaar via art. 52 AWR, geen zelfstandige tienjaarstermijn | **Doorgevoerd**, met Drebers als uitzondering |
| 9 | Verlof- en ziektestaten | Knip behouden en verfijnen | **Gesplitst** in twee documenttypen |

### De twee die er echt toe deden

**Punt 2 en 8 draaien om hetzelfde onderscheid: scope versus termijn.** Art. 34a Wet OB is ruim in
wát eronder valt — "betreffende onroerende zaken en rechten waaraan deze zijn onderworpen" — maar
smal in de termijn: negen jaren volgend op het jaar waarin de ondernemer *het goed* in gebruik nam.
Het anker is het pand, niet het stuk. Een onderhoudsfactuur of een nieuwe huurovereenkomst start dus
geen nieuwe tienjaarsklok.

Daarom staat bij stukken met een eigen ankermoment nu art. 52 AWR vooraan — die geldt altijd — en is
de OB-klok het optionele tweede veld, dat alleen bijdraagt zolang het pand nog binnen zijn termijn
zit. Bij stukken die het pand zelf betreffen (akte, overige gegevens) is het andersom. De tool
berekent beide en neemt de langste.

Voor investeringsdiensten vanaf € 30.000 volgt hieruit zeven jaar. De wetgever heeft per 2026 in
art. 13 Uitvoeringsbeschikking OB de onroerende zaak (tien jaar herziening) en de investeringsdienst
(vijf jaar) uitdrukkelijk náást elkaar gezet, maar art. 34a Wet OB ongemoeid gelaten: daar staat nog
steeds "het goed", niet "het goed of de investeringsdienst". Een tienjaarslezing zou bovendien
betekenen dat een dakrenovatie in 2026 op een pand uit 1998 een klok start die in art. 34a nergens
is te vinden.

**Punt 9 is juist niet vereenvoudigd.** Een urenstaat waaruit blijkt dat iemand in maart 160 uur
betaald kreeg waarvan 16 verlofuren, onderbouwt de loonberekening en hoort bij de loonadministratie.
"Zes ziekmeldingen" of een verzuimdossier is privacyrechtelijk iets anders. Eén gedeelde termijn zou
betekenen dat je uit angst voor de fiscale bewaarplicht zeven jaar een volledige ziektehistorie
vasthoudt. De tool adviseert nu ook uitdrukkelijk die twee technisch gescheiden te bewaren.

### Nieuwe testvectoren uit deze ronde

| Situatie | Uitkomst |
|---|---|
| Onderhoudsfactuur 2026, pand in gebruik sinds 1995 | t/m 31-12-2033 (art. 52 AWR; OB-termijn allang voorbij) |
| Onderhoudsfactuur 2027, pand in gebruik sinds 2024 | t/m 31-12-2034 (art. 52 AWR wint van OB t/m 31-12-2033) |
| Huur eindigt 2026, pand in gebruik sinds 2010 | t/m 31-12-2033 (art. 52 AWR na afloop huurperiode) |
| Einde dienstbetrekking 10-01-2026, kopie identiteitsbewijs | t/m 31-12-2031 (niet 10-01-2031) |

### Vier knopen die wij hebben doorgehakt

Op deze vier punten geeft de wet geen uitsluitsel en hebben wij zelf gekozen. De redenering staat
erbij, zodat je kunt zien wáár je het eens of oneens bent.

**1. Investeringsdienst vanaf € 30.000 → zeven jaar, geen kunstmatige tien.**
Art. 13 Uitv.besch. OB maakt sinds 2026 juist uitdrukkelijk onderscheid tussen de onroerende zaak en
de investeringsdienst, en voor die laatste geldt een herziening over effectief vijf boekjaren vanaf
ingebruikneming van de dienst. De toelichting zegt zelfs dat die kortere periode bewust is gekozen.
Art. 34a is ondertussen niet meegewijzigd. Voor een pand uit 1998 met een dakrenovatie in 2026 komt
de factuur daarmee op art. 52 AWR: **t/m 31-12-2033**. Als kantoorbeleid mag je vrijwillig langer
bewaren, maar de tool moet niet doen alsof tien jaar het wettelijke minimum is.

**2. Drebers uit de standaardwaarschuwing.**
Die stond bij élke onderhoudsfactuur, ook bij een schilderbeurt van € 400. Het kabinet zegt dat
Drebers niet generiek mag worden toegepast; alleen bij bijvoorbeeld een aanzienlijke uitbreiding of
grondige renovatie met de economische levensduur van een nieuw gebouw kan tien jaar in beeld komen.
Bovendien kan de belastingplichtige zich erop beroepen zonder dat de termijn hem kan worden
tegengeworpen. Daarmee is het een herzienings- en aftrekpunt, geen bewaarplichtwaarschuwing. De
nuance staat nu bij de herzieningsbron (art. 13 Uitv.besch. OB).

**3. Beschikking/verklaring gesplitst op herkomst.**
Het Handboek is hier duidelijker dan wij eerst dachten: onder de afwijkende termijnen staat
uitdrukkelijk "kopieën van beschikkingen of verklaringen die u van uw werknemer hebt gekregen", en
§3.3.3 gebruikt dezelfde formulering. Daarom nu twee documenttypen:

- ontvangen ván de werknemer → **5 jaar** (bij uitdienst in 2026: t/m 31-12-2031);
- zelf aangevraagd of op gezamenlijk verzoek afgegeven → **7 jaar**, tenzij een eigen wettelijke
  regel geldt.

Voorbeelden als "doelgroepverklaring" zijn bewust uit de naam gehaald: juist daarvan verschilt de
herkomst per geval, en dan zou de tool de grens die hij moet trekken zelf weer vertroebelen.

**4. Knip verlof/verzuim behouden, met een expliciete instructie bij gemengde bestanden.**
Het inhoudelijke onderscheid blijft. Maar de tool suggereert niet langer dat je bij één gemengde
export simpelweg een van beide kunt kiezen — dan bewaar je óf fiscaal te kort, óf privacygevoelige
verzuimdata zeven jaar zonder noodzaak. De regel is nu: bevat een bestand zowel loon- en
ureninformatie als verzuimgegevens, maak dan vóór archivering een aparte fiscale export zonder de
niet-noodzakelijke verzuimgegevens. Kan dat niet, dan is er voor dat bestand als geheel geen
eenduidige bewaartermijn te geven.

Alles hierboven is onze eigen invulling; tegenspraak blijft welkom, op deze vier punten het meest.

---

## 8. Accountancy: het dossier van de accountant zelf

Nieuw, en het enige deel van de tool dat niet over de administratie van de cliënt gaat. Twee
documenttypen, allebei met een eigen startmoment dat níet aan een boekjaar hangt.

| Dossier | Termijn | Startmoment | Grondslag |
|---|---|---|---|
| Opdrachtdossier (samenstel-, beoordelings-, adviesopdracht) | ten minste 7 jaar | nadat het dossier is **afgesloten** | art. 25 lid 1 sub e NVKS, via overgangsrecht art. 6 NVKM |
| Controledossier wettelijke controle | ten minste 7 jaar | nadat het dossier is afgesloten | art. 11 lid 6 Bta |

**De NVKS is ingetrokken, maar nog niet uitgewerkt.** Zij regelde de bewaartermijn van het
opdrachtdossier in art. 25 en is per 21 februari 2025 ingetrokken met terugwerkende kracht tot
1 januari 2025. Maar **art. 6 NVKM houdt haar via overgangsrecht in stand**:

| Soort kantoor | NVKS blijft toepasbaar tot |
|---|---|
| Accountantsorganisatie met Wta-vergunning | 1 januari 2026 |
| Kantoor zonder vergunning | 1 januari 2027 |

Join Administraties is blijkens het AFM-register zelf geen vergunninghouder — de vergunning binnen
het netwerk staat op naam van IZA Accountants B.V., met DK Eemland B.V. en Join Administraties
Utrecht B.V. als netwerkonderdeel. Voor 2026 gaan wij daarom uit van de tweede rij: de NVKS geldt
nog. Art. 25 lid 1 onderdeel e luidt dat de kwaliteitsmanager "ten minste zeven jaren, tenzij bij of
krachtens wet anders is bepaald (…) opdrachtdossiers nadat deze zijn afgesloten" bewaart.

**Wat wij bewust níet hebben geprogrammeerd**, is dat het anker per 1 januari 2027 automatisch de
rapportagedatum wordt. SKM 1 par. 31(6) eist "tenminste zeven jaar", maar de uitdrukkelijke
koppeling aan de datum van de opdrachtrapportage staat in A85 en ziet daar op controle- en
assurance-opdrachten. Voor een samenstellingsopdracht is het precieze ankermoment daarmee nog niet
vastgesteld. De tool waarschuwt voor de overgang en laat het anker met rust tot dat is uitgezocht.

Dat verschilt van het controledossier, waar art. 11 lid 6 Bta luidt:

> "Een accountantsorganisatie bewaart een controledossier gedurende ten minste zeven jaren nadat het
> is afgesloten."

Afsluiten moet op grond van lid 5 uiterlijk 60 dagen na ondertekening van de accountantsverklaring.
Verklaringsdatum en afsluitdatum vallen dus niet samen, en de tool vraagt bewust naar de laatste.

Beide termijnen zijn "ten minste": ondergrenzen. En beide rekenen op de dag zelf, niet op het
kalenderjaar — de fiscale kalenderjaarlogica zou hier een verkeerde einddatum geven. Dossier
afgesloten op 21-08-2026 loopt t/m 21-08-2033, tegenover 31-12-2033 voor een fiscaal stuk met
dezelfde datum.

**Waarom dit uit elkaar wordt gehouden in de tool.** Hetzelfde stuk kan zowel in de administratie van
de cliënt als in het opdrachtdossier zitten, met verschillende startmomenten. De tool zegt daarom
uitdrukkelijk dat deze termijnen niet uit zichzelf op de administratie van de cliënt van toepassing
zijn, en dat bij een stuk in beide dossiers de langst lopende toepasselijke bewaarplicht in de
praktijk bepalend is voor het moment van vernietigen.

**Waar jouw blik het meest oplevert:** het ankermoment vanaf 1 januari 2027. Geldt de rapportagedatum
uit A85 alleen voor controle- en assurance-opdrachten, of ook voor een samenstellingsopdracht? Zolang
dat niet vaststaat, schakelt de tool niet automatisch om. Daarnaast hebben wij de opdrachtdossiers
niet gesplitst naar opdrachtsoort, omdat SKM 1 dat onderscheid voor de bewaartermijn niet maakt.

---


## 9. Bronnen

Alle bronnen geraadpleegd op 21 augustus 2026. Wetteksten via de geldende geconsolideerde versie op
wetten.overheid.nl.

**Wetgeving**
- Art. 16 en 52 AWR — https://wetten.overheid.nl/BWBR0002320
- Art. 28rl, 28sj, 28tn, 34, 34a Wet OB 1968 — https://wetten.overheid.nl/BWBR0002629
- Art. 13 en 31 Uitvoeringsbeschikking omzetbelasting 1968 — https://wetten.overheid.nl/BWBR0002634
- Art. 7.5 en 7.9 Uitvoeringsregeling loonbelasting 2011 — https://wetten.overheid.nl/BWBR0028236
- Art. 2:10 BW — https://wetten.overheid.nl/BWBR0003045 · Art. 3:15i BW — https://wetten.overheid.nl/BWBR0005291
- Art. 3:307 en 3:310 BW — https://wetten.overheid.nl/BWBR0005291
- Art. 7:640a en 7:642 BW (verval en verjaring vakantieaanspraken) · Art. 7:761 BW — https://wetten.overheid.nl/BWBR0005290
- Art. 33, 34 en 34a Wwft — https://wetten.overheid.nl/BWBR0024282
- Art. 11 Besluit toezicht accountantsorganisaties — https://wetten.overheid.nl/BWBR0020184
- Nadere voorschriften kwaliteitsmanagement (NVKM) — https://wetten.overheid.nl/BWBR0050792
- Art. 25 Nadere voorschriften kwaliteitssystemen (NVKS), vervallen per 21-02-2025 maar via art. 6 NVKM nog toepasbaar — https://wetten.overheid.nl/BWBR0038869/2024-01-19#Paragraaf6_Artikel25
- Art. 5 lid 1 sub e AVG, Verordening (EU) 2016/679 — https://eur-lex.europa.eu/eli/reg/2016/679/oj/nld#art_5

**Belastingdienst**
- Hoelang moet u gegevens bewaren? — https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/ondernemen/administratie/hoelang-moet-u-gegevens-bewaren
- Administratie bewaren voor de btw: 7 of 10 jaar? — https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/btw/administratie_bijhouden/administratie_bewaren/
- Uw geautomatiseerde administratie en de fiscale bewaarplicht, AL 040, uitgave juli 2026 — https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/themaoverstijgend/brochures_en_publicaties/uw_geautomatiseerde_administratie_en_de_fiscale_bewaarplicht (landingspagina; de directe pdf-link draagt een editiecode die per uitgave wijzigt en dan een 404 geeft)
- Handboek Loonheffingen 2026, uitgave maart 2026 — https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/themaoverstijgend/brochures_en_publicaties/handboek-loonheffingen

**NBA**
- Standaard voor kwaliteitsmanagement 1 (SKM 1), par. 31(6) en A85 — https://www.nba.nl/wet--en-regelgeving/hra/1619/1600/

**Autoriteit Persoonsgegevens**
- Bewaren van persoonsgegevens — https://www.autoriteitpersoonsgegevens.nl/themas/basis-avg/privacy-en-persoonsgegevens/bewaren-van-persoonsgegevens
- Personeelsdossier — https://www.autoriteitpersoonsgegevens.nl/themas/werk-en-uitkering/personeelsgegevens/personeelsdossier
- Persoonsgegevens van sollicitanten — https://www.autoriteitpersoonsgegevens.nl/themas/werk-en-uitkering/sollicitaties/persoonsgegevens-van-sollicitanten

Voor de fiscale behandeling van de auto en het 60-maandenregime verwijzen wij naar de
terugkoppelingen bij `auto-fiscaal-2027` en `auto-van-de-zaak`; die logica wordt hier niet herhaald.

---

**Voorbehoud.** Dit document beschrijft de uitgangspunten van een intern hulpmiddel en is geen
fiscaal advies. De tool geeft een berekende indicatie van de fiscale bewaartermijn; de beoordeling
of een stuk daadwerkelijk kan worden vernietigd blijft een oordeel per geval.
