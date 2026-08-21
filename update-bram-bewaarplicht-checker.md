# Terugkoppeling: bewaarplicht-checker

**Aan** Bram, DK Accountants · **Van** Join Administraties · **Datum** 21 augustus 2026
**Aanleiding** De bewaarplicht-tool is inhoudelijk herzien. Bij die herziening zijn een paar
uitgangspunten van de vorige versie gesneuveld. Hieronder staan alleen de punten waarop jouw
oordeel waarde heeft — niet de technische wijzigingen.

---

## 1. Wat de tool doet

De tool bestaat uit een kennisbank (37 documenttypen in 7 categorieën) en een rekentool. Je kiest
een documenttype, vult één datum in, en de tool geeft de laatste dag waarop het stuk bewaard moet
blijven plus de dag waarop de termijn is verstreken.

De tool is bedoeld voor adviseurs, niet voor cliënten, en rekent uitsluitend de **fiscale** termijn
(plus de Wwft, zie §4).

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

**De vraag aan jou zit in het vervolg.** Voor een onderhoudsfactuur uit 2024 op een pand dat sinds
2010 in gebruik is, was de art. 34a-termijn al op 31-12-2019 afgelopen. Op de factuur zélf loopt dan
nog gewoon de zevenjaarstermijn van art. 52 lid 4 AWR. De tool vraagt daarom bij onroerende zaken om
een **tweede, optionele datum** (het moment waarop het stuk zijn actuele waarde verliest) en neemt
de **laatste van beide** termijnen. Vult de gebruiker die tweede datum niet in en is de
art. 34a-termijn voorbij, dan meldt de tool bewust "onvolledig" in plaats van "verstreken".

Is die max-benadering wat jou betreft de juiste? En vind je dat wij een gebruiker met twee datums
mogen opzadelen, of is het praktischer om altijd van het langste scenario uit te gaan?

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
"bescheiden betreffende". **Dat is een lezing, geen vindplaats.** Als jij vindt dat een
huurovereenkomst gewoon onder de zeven jaar van art. 52 AWR valt, halen we hem uit de OG-categorie.

Zelfde vraag, kleiner belang: geldt de tienjaarstermijn ook voor een schoonmaak- of
kleinonderhoudsfactuur die met de herziening niets te maken heeft?

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

**Twee punten voor jou.**

Ten eerste: het Handboek Loonheffingen 2026 is hier **intern tegenstrijdig**. §3.5.2 schrijft
"ten minste 5 kalenderjaren na het einde van de dienstbetrekking", terwijl §2.3.4 en §17.2
"na het kalenderjaar waarin de dienstbetrekking eindigt" schrijven — precies de wettekst. Dat
scheelt een heel kalenderjaar. Wij volgen de wettekst en waarschuwen de gebruiker voor de afwijking.
Ben je het daarmee eens?

Ten tweede: voor de rij "beschikking/verklaring van de werknemer" hebben wij **geen wetsbepaling**
gevonden, alleen het Handboek. Wij hanteren daar toch vijf jaar, in de veronderstelling dat het
Handboek deze categorie bewust naast de opgaaf en de kopie-ID zet. Als jij liever zeven jaar
aanhoudt (art. 52 AWR als restcategorie), horen we dat graag — dat is de voorzichtiger kant.

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
oorzaak, die niet mogen. **Is die tweedeling zoals wij hem nu neerzetten bruikbaar voor de
praktijk?**

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
notaris, niet op de administratieplichtige ondernemer. **Kun jij bevestigen dat wij hier niets over
het hoofd zien?** Het is een hardnekkige aanname in de adviespraktijk.

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

**De vraag aan jou:** die slotclausule "tenzij bij wettelijk voorschrift anders is bepaald" is voor
een accountantskantoor niet theoretisch. Welke voorschriften komen in onze praktijk in aanmerking,
en moeten wij die in de tool benoemen?

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

## 7. Open vragen

1. Is de max-benadering bij onroerende zaken (art. 34a naast art. 52 AWR, langste wint) juist, en is
   twee datums vragen werkbaar? (§2.1)
2. Valt een huurovereenkomst van de verhuurder onder art. 34a, of gewoon onder art. 52 AWR? En geldt
   de tienjaarstermijn ook voor klein onderhoud zonder herzieningsgevolg? (§2.2)
3. Volgen wij bij de 5-jaarstermijn terecht de wettekst in plaats van §3.5.2 van het Handboek? (§2.3)
4. Vijf of zeven jaar voor "beschikking/verklaring van de werknemer", waarvoor alleen het Handboek
   een bron is? (§2.3)
5. Zien wij iets over het hoofd bij het schrappen van "notariële aktes" als conversie-uitzondering?
   (§2.4)
6. Welke wettelijke voorschriften vallen onder de uitzondering van art. 34a lid 3 Wwft in onze
   praktijk? (§4)
7. Zijn bankafschriften, de aangifte loonheffingen en de margeadministratie terecht als
   basisgegeven aangemerkt? (§3)
8. Investeringsdiensten ≥ € 30.000: tien jaar via art. 34a, of zeven jaar via art. 52 AWR omdat
   art. 34a niet is meegewijzigd? (§6)
9. Verlof- en ziektestaten: is de knip tussen "onderbouwt de loonbetaling — zeven jaar" en
   "verzuimfrequentie in het dossier — AP-richtsnoer twee jaar" in de praktijk werkbaar, of moeten
   wij één termijn aanhouden? En is het terecht dat wij ze niet langer als basisgegeven aanmerken?
   (§2.3)

---

## 8. Bronnen

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
- Art. 33 en 34a Wwft — https://wetten.overheid.nl/BWBR0024282
- Art. 5 lid 1 sub e AVG, Verordening (EU) 2016/679 — https://eur-lex.europa.eu/eli/reg/2016/679/oj/nld#art_5

**Belastingdienst**
- Hoelang moet u gegevens bewaren? — https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/ondernemen/administratie/hoelang-moet-u-gegevens-bewaren
- Administratie bewaren voor de btw: 7 of 10 jaar? — https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/btw/administratie_bijhouden/administratie_bewaren/
- Uw geautomatiseerde administratie en de fiscale bewaarplicht, AL 040, uitgave juli 2026 — https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/themaoverstijgend/brochures_en_publicaties/uw_geautomatiseerde_administratie_en_de_fiscale_bewaarplicht (landingspagina; de directe pdf-link draagt een editiecode die per uitgave wijzigt en dan een 404 geeft)
- Handboek Loonheffingen 2026, uitgave maart 2026 — https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/themaoverstijgend/brochures_en_publicaties/handboek-loonheffingen

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
