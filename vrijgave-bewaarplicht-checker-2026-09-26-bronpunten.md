# Vrijgavenotitie — Bewaarplicht Checker, bronpunten 5 tot en met 7

## 1. Waarover gaat het

**Tool:** Bewaarplicht Checker (`bewaarplicht.html`)
**URL:** https://bouwman.tools/bewaarplicht.html
**Datum:** 26 september 2026
**Eigenaar:** Sylvain Bouwman
**Branch:** `bronpunten-5-7`

## 2. Wat is er gewijzigd

Deze vrijgave sluit punt 5, 6 en 7 uit `OPENSTAAND.md`. Geen bewaartermijn, label of rekenregel verandert. In de tool verandert alleen de toelichting bij de margeadministratie, met een nieuwe bronkaart.

**Margeadministratie (punt 5).** De toelichting eindigde met "Gaat het om een onroerende zaak, dan geldt dus de langere OB-termijn." Die zin had geen toepassingsbereik: gebruikte goederen zijn volgens art. 2a lid 1 onder l Wet OB "alle roerende lichamelijke zaken", en kunstvoorwerpen, verzamelvoorwerpen en antiquiteiten zijn via art. 2a lid 1 onder m Wet OB en art. 4 lid 2 Uitv.besch. OB de goederen van bijlage J, elk met een GN-code. Sylvain koos op 26-09-2026 de zin te schrappen en er de uitleg voor in de plaats te zetten. De toelichting zegt nu dat de tienjaarstermijn van art. 34a hier niet speelt omdat een onroerende zaak nooit onder de margeregeling valt. Nieuwe bronkaart `ob2a` met het letterlijke citaat van onderdeel l. De termijn blijft zeven jaar.

**Citaat in het Bram-document (punt 6).** "Facturen over onroerende zaken bewaart u 10 jaar" staat letterlijk op de Belastingdienstpagina "Uw facturen bewaren". §2.2 van `update-bram-bewaarplicht-checker.md` draagt nu de URL en de raadpleegdatum, met de kanttekening dat de pagina alleen de tienjaarstermijn voor facturen steunt. De tool gebruikt het citaat niet.

**AP-pagina Personeelsdossier (punt 7).** Opnieuw gelezen; de kop "Maximaal 2 jaar bewaren" en het richtsnoer van twee jaar na uitdiensttreding staan er nog. Geen wijziging in de tool.

## 3. Geraakte fiscale uitspraken

| Uitspraak | Status | Vindplaats |
| --- | --- | --- |
| Een onroerende zaak valt niet onder de margeregeling; art. 34a speelt bij de margeadministratie niet | nieuw (vervangt de geschrapte zin) | Art. 2a lid 1 onder l en m Wet OB 1968 (BWBR0002629, geldend vanaf 01-01-2026); art. 4 lid 2 en bijlage J punt 3 Uitv.besch. OB 1968 (BWBR0002634). Geraadpleegd 26-09-2026. Dat een gebouw ouder dan honderd jaar geen antiquiteit is, rust op de GN-code 9706 00 00 en is een lezing zonder tegenstrijdige bron. |
| Margeadministratie: zeven jaar | ongewijzigd | Art. 31 lid 6 Uitv.besch. OB; art. 52 lid 4 AWR. |
| "Facturen over onroerende zaken bewaart u 10 jaar" (alleen in het Bram-document) | vindplaats toegevoegd | belastingdienst.nl, "Uw facturen bewaren", geraadpleegd 26-09-2026. |
| AP-richtsnoer twee jaar na uitdiensttreding | ongewijzigd, herbevestigd | autoriteitpersoonsgegevens.nl, "Personeelsdossier", kop "Maximaal 2 jaar bewaren", pagina bijgewerkt 15-09-2026, gelezen 26-09-2026. |

## 4. Testset

`npm test`: **150 geslaagd, 0 gefaald** (14 suites). Voor de wijziging 149. Nieuwe test in `tests/bronnen-en-grondslagen.test.mjs`: de margeadministratie houdt zeven jaar, de oude zin komt niet terug, de toelichting noemt art. 2a lid 1 onder l Wet OB en de uitsluiting van onroerende zaken, en de bronkaart `ob2a` wijst naar art. 2a en citeert "alle roerende lichamelijke zaken". De tests toetsen formuleringen, niet de juridische uitleg; die staat in paragraaf 5.

## 5. Broncontrole en poort

**Bron-controleur, 26-09-2026 (rond 23:28 CEST).** Alle drie de conclusies bevestigd tegen de vindplaats. Voorbehoud bij punt 5: voor antiquiteiten staat het woord "roerend" niet in de definitie; de uitsluiting van een oud gebouw rust op de GN-code, en geen gelezen bron wijst een onroerende zaak als margegoed aan. Bij punt 6: de pagina steunt §2.2 alleen voor de algemene stelling, niet voor het anker bij de ingebruikneming; dat staat er nu bij.

**Publicatiepoort, 26-09-2026: GO.** npm test zelf gedraaid (150 geslaagd, 0 gefaald, 14 suites); vrijgavenotitie compleet; gelijkwaardigheidstoets niet van toepassing (geen rekenregel of modelvervanging); elke geraakte uitspraak draagt haar vindplaats.

## 6. Openstaande punten

`OPENSTAAND.md` heeft geen open punten meer; punt 8 is gepland. `laatst_beoordeeld` en `status` in het register zijn niet aangeraakt. De merge publiceert, hij accordeert niet.
