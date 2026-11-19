# The Honeymoon Studio 2028 · Tamara & Marvin

Ein persönliches Reisestudio für den Mini-Moon ab 21. Juni 2028 und die großen Flitterwochen mit Wander- und Strand-Etappe im Dezember 2028.

## Lokal öffnen

Die Anwendung besteht aus HTML, CSS und JavaScript-Modulen. Für die Website werden weder Backend noch API-Schlüssel benötigt. Lokaler Start mit Node.js 24:

```sh
npm run dev
```

Dann [das Studio öffnen](http://127.0.0.1:4173/honeymoon-2028/).

## So plant ihr

- Erstellt ein separates Reiseprofil für jede Reise. Das Studio bewertet mindestens 20 Reiseideen pro Reise anhand der Reisesaison, der Interessen und Aktivitäten, des Hotelstils, eurer Wunsch- und Ausschlussstichwörter, des Zielbudgets und des Reiseaufwands. Frühere Bewertungen beeinflussen die Reihenfolge. Abgelehnte Ideen bleiben ausgeblendet, bis ihr sie ausdrücklich wieder zulasst.
- Sammelt beliebig viele Favoriten aus dem Zielkatalog pro Reise. Startet den Vergleich, wenn eure Auswahl steht, und nutzt einen Favoriten für die Startroute. Plant den Dezember in zwei Etappen. Wählt zuerst eine Route in Patagonien oder eine Alternative und passt die Naturstopps, Nächte und Aktivitäten an. Strandvorschläge werden für eure Natur-Etappe und eine Gesamtreise von 20–25 Tagen einschließlich Transfers berechnet. Tagesausflüge per Boot ermöglichen Inselhopping mit wenigen Unterkunftswechseln. Ändert Datum, Aufenthaltsdauer, Aktivitäten und Reihenfolge. Karte und Tagesplan übernehmen die neue Route.
- Passt die Modellkosten für Flüge, Übernachtungen, Transfers, Aktivitäten und Essen sowie den Reserveprozentsatz an. Der Rechner aktualisiert Reisekosten und Gesamtsumme für zwei. Die Kosten sind Schätzungen in Euro für 2028 mit Abflug ab Mitteleuropa. Transferkorridore und saisonale Hinweise dienen der Planung. Flugpläne, Abfahrtszeiten und Wetter sollten vor der Buchung geprüft werden.
- Speichert unter **Varianten** je Reise mehrere benannte Stände mit Route, Profil und Budgetansätzen. Startet danach eine neue Beratung oder ladet eine Variante zur Weiterbearbeitung.
- Der aktuelle Plan liegt im lokalen Browserspeicher. Exportiert ihn als JSON für Backups oder den Gerätewechsel. Ein erfolgreicher Import ersetzt die Planung für beide Reisen.

## Tests

```sh
npm ci
npm test
npx playwright install --with-deps chromium webkit
npm run test:e2e
```

Die End-to-End-Suite läuft mit Desktop Chromium, einer mobilen Chromium-Emulation und Playwright WebKit mit iPhone-13-Profil. GitHub Actions führt die Suite auf Pull Requests und auf `main` aus.

## GitHub Pages

1. Pull Request in `main` zusammenführen.
2. In **Settings → Pages → Build and deployment** die Quelle **Deploy from a branch** wählen.
3. **main** und **/ (root)** auswählen und speichern.
4. Nach dem Pages-Deployment ist das Studio unter [braunic1221.github.io/honeymoon-2028](https://braunic1221.github.io/honeymoon-2028/) erreichbar.

Die Website ist bei einer öffentlichen Pages-Veröffentlichung frei aufrufbar. Persönliche Eingaben und Reisepläne werden im jeweiligen Browser gespeichert. Die JSON-Exporte enthalten die persönlichen Planungsdaten.

## Medien

Die Landschaftsbilder sind KI-generierte Illustrationen. Die Landflächen der geografischen Übersicht stammen aus [Natural Earth 1:110m](https://www.naturalearthdata.com/about/terms-of-use/) (Public Domain). DM Sans und Playfair Display werden lokal ausgeliefert. Ihre SIL Open Font Licenses liegen in `media/`.
