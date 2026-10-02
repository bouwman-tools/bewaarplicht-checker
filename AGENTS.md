# bewaarplicht-checker

Kennisbank en rekentool voor fiscale bewaartermijnen (art. 52 AWR en de afwijkende regels), als één zelfstandig HTML-bestand: `bewaarplicht.html`, zonder buildstap.

## Publicatie

- `.github/workflows/sync-to-bouwman-tools.yml` start bij elke push naar `main` of `master` en handmatig. Een merge naar `master` publiceert dus.
- De workflow draait eerst `npm test` en kopieert daarna alleen `bewaarplicht.html` naar de publieke repository `bouwman-tools`. AGENTS.md en CLAUDE.md gaan niet mee.

## Tests

`npm test` (draait `node --test "tests/**/*.test.mjs"`, Node 22). Gemeten op 02-10-2026: 150 geslaagd.

## Rekenkern en bronnen

- De rekenkern staat in `bewaarplicht.html` tussen de markers `FISCALE KERN — BEGIN` en `FISCALE KERN — EINDE`. `tests/laad-kern.mjs` snijdt dat blok eruit en evalueert het, dus houd het vrij van DOM-code.
- Fiscale waarden en bronkaarten staan in hetzelfde bestand met de vindplaats erbij. De onderbouwing van de eigen standpunten staat in `update-bram-bewaarplicht-checker.md`.
- Het blok `XLSX-SCHRIJVER` (Excel-export) en de kopbalk komen uit `gedeelde-kern`. Pas ze hier niet aan.

## Valkuilen

- Het blok `XLSX-SCHRIJVER` is met de hand neergezet en niet via `verspreid.mjs` van `gedeelde-kern`; bevestigen tegen de bron is punt 13 in `OPENSTAAND.md`.
- Het aantal documenttypen (44 in 8 categorieën) staat in `README.md` en `update-bram-bewaarplicht-checker.md`. Voeg je een type toe, dan moeten die teksten mee.
- Bij elke inhoudelijke wijziging hoort een vrijgavenotitie (`vrijgave-bewaarplicht-checker-<datum>-<onderwerp>.md`).

Openstaande punten en geplande acties: `OPENSTAAND.md`.
