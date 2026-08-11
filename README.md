# Bewaarplicht Checker

Kennisbank en rekentool voor de fiscale bewaarplicht (AWR art. 52). Toont de wettelijke bewaartermijnen per documenttype en berekent de einddatum voor een specifiek document.

## Gebruik

1. Open de tool via [bouwman.tools/bewaarplicht.html](https://bouwman.tools/bewaarplicht.html)
2. **Kennisbank**: blader door de categorieën voor een overzicht van alle bewaartermijnen (7 of 10 jaar per documenttype)
3. **Einddatum berekenen**: selecteer een documenttype en vul de relevante datum in
4. De tool toont automatisch de berekende fiscale bewaardatum ("31 december [jaar]")
5. Als de termijn al verstreken is, verschijnt de melding "Fiscale bewaartermijn verstreken" met een toelichting om vóór vernietiging te controleren of geen andere bewaarplicht geldt

## Inhoud

- **Kennisbank** — 7 categorieën: facturen & betalingen, jaarrekening & boekhouding, contracten & overeenkomsten, personeel & loon, onroerend goed, bijzondere regelingen (margegoederen, OSS), correspondentie
- **Aandachtspunten** — AVG-spanning, digitaal bewaren, buitenlandse bestanddelen / lopende fiscale geschillen (art. 16 lid 4 AWR)
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

---

## Voor de ontwikkelaar

> Dit blok is bedoeld voor de technicus die de tool integreert in de productieomgeving. Het beschrijft de opzet van de tool, de recente inhoudelijke wijzigingen en de aandachtspunten bij implementatie.

### Opzet

De tool bestaat uit één zelfstandig HTML-bestand (`bewaarplicht.html`) zonder externe afhankelijkheden: geen frameworks, geen CDN-links, geen API-aanroepen. Alle logica, stijlen en inhoud staan in dat ene bestand. De tool werkt volledig in de browser.

Dit is een bewuste keuze. De tool moet ook functioneren in omgevingen zonder internetverbinding en mag niet afhankelijk zijn van externe services.

### Intentie en scope

De tool is bedoeld als praktische interne kennis- en rekentool voor adviseurs. Het is nadrukkelijk **geen juridisch systeem** en geen vervanging voor fiscaal advies. De berekeningen zijn gebaseerd op art. 52 AWR en geven een praktische richtlijn, geen juridisch bindende uitkomst.

Die beperking is bewust verwerkt in de teksten (zie "Recente wijzigingen" hieronder). Vergroot die scope niet bij integratie in de productieomgeving.

### Recente wijzigingen (augustus 2025)

De volgende aanpassingen zijn doorgevoerd ten opzichte van de vorige versie. Ze zijn inhoudelijk gemotiveerd; de technische uitwerking staat per punt beschreven.

**1. Verstreken bewaartermijn — tekst genuanceerd**

De vorige versie toonde bij een verlopen termijn: *"Dit document mag worden vernietigd — de wettelijke bewaartermijn is verstreken."* Die tekst was te absoluut: ook na het verstrijken van de fiscale bewaartermijn kunnen andere bewaarverplichtingen gelden (civielrechtelijk, AVG, lopende procedures).

Nieuwe tekst:
> Volgens deze berekening is de fiscale bewaartermijn verstreken. Controleer vóór vernietiging of geen andere bewaarplicht, lopende procedure of andere reden voor langere bewaring geldt.

**2. Dynamisch resultaatlabel**

De vaste kop "Bewaren tot en met" boven het resultaat werd ook getoond bij een verlopen termijn, wat leidde tot de tegenstrijdige combinatie "Bewaren tot en met / Termijn verstreken". Het label wordt nu dynamisch bijgewerkt via JavaScript:

- Lopende termijn: `Berekende fiscale bewaardatum`
- Verlopen termijn: `Fiscale bewaartermijn verstreken`

Technisch: het `<div class="result-label">` heeft nu `id="result-label"` gekregen. De `bereken()`-functie in het script schrijft dit element bij elke berekening.

**3. Aandachtspunt buitenlandse bestanddelen gecorrigeerd**

De vorige versie koppelde de verlengde navorderingstermijn van 12 jaar (art. 16 lid 4 AWR) aan fraude. Dat is juridisch onjuist: de 12-jaarsterm geldt specifiek voor in het buitenland opgekomen of gehouden inkomens- of vermogensbestanddelen, niet als algemene fraudesanctie.

Nieuwe titel: `Buitenlandse bestanddelen / lopend fiscaal geschil`

De bijbehorende brontekst (bronnenlijst onderaan de pagina) is in dezelfde zin gecorrigeerd.

**4. Algemene disclaimer toegevoegd**

Direct onder de intro van de rekentool staat nu een compacte disclaimer:
> Deze tool geeft een praktische indicatie van fiscale bewaartermijnen. Bij bijzondere situaties, andere wettelijke bewaarplichten of lopende procedures kan een langere of afwijkende bewaartermijn gelden.

De formulering vermijdt bewust "raadpleeg een adviseur" omdat de tool intern door adviseurs wordt gebruikt.

**5. Personeelsdossier — categorie hernoemd en genuanceerd**

De generieke categorie "Personeelsdossier (loongegevens)" was te breed: een personeelsdossier omvat meerdere documentsoorten met uiteenlopende bewaarregimes (fiscaal, arbeidsrechtelijk, AVG).

De categorie is hernoemd naar `Loonadministratie (loonstroken / salarisadministratie)` en beperkt zich expliciet tot de fiscale component. De toelichting in de kennisbank vermeldt dat voor overige onderdelen van een personeelsdossier andere wettelijke of AVG-bewaartermijnen kunnen gelden.

**6. Zakelijke correspondentie — scope beperkt**

"Overige zakelijke correspondentie" suggereerde dat alle zakelijke communicatie standaard zeven jaar bewaard moet worden. Dat klopt niet: alleen correspondentie die deel uitmaakt van de administratie of relevant is voor de belastingheffing valt onder art. 52 AWR.

Hernoemd naar `Zakelijke correspondentie (fiscaal relevant)` met een bijbehorende toelichting. Dezelfde toelichting is toegevoegd bij `Offerte / orderbevestiging`.

**7. Huurcontract — rol van de gebruiker verduidelijkt**

De categorie "Huurcontract" (7 jaar) stond naast "Huurovereenkomst onroerend goed (verhuurder)" (10 jaar) zonder duidelijk onderscheid. De 10-jaarsterm geldt voor verhuurders in het kader van de BTW-herzieningsperiode. Het kortere label is hernoemd naar `Huurcontract (huurder)` om verwarring te voorkomen.

**8. Accessibility verbeterd**

De vorige CSS verwijderde de focus-indicator volledig (`outline: none`) voor zowel muis- als toetsenbordgebruikers. Dat is een toegankelijkheidsprobleem voor gebruikers die met het toetsenbord navigeren.

Toegevoegd:
```css
select:focus-visible, input[type="date"]:focus-visible {
  outline: 2px solid #C0522A;
  outline-offset: 2px;
}
```

Dit toont de focusring uitsluitend bij toetsenbordnavigatie (`:focus-visible`), niet bij muisklikken. Het resultaatblok heeft `aria-live="polite"` gekregen zodat schermlezers de bijgewerkte uitkomst aankondigen.

### Wat ongewijzigd is gebleven

- De berekeningsmethodiek: `eindJaar = datum.getFullYear() + termijn`, einddatum altijd 31 december van het eindejaar. Dit is een conservatieve maar correct toepasbare benadering.
- Alle documentcategorieën en bijbehorende termijnen.
- De visuele stijl en layout.
- De enkelvoudige bestandsstructuur (geen externe afhankelijkheden).
