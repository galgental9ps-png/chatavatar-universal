# Jimmy · Chatavatar für Jimmy’s Fun Park

Ein animierter Affe für eine Webseite: Er läuft am Seitenrand, winkt, lässt sich ziehen und beantwortet anklickbare Fragen über Jimmy’s Fun Park in Dasing. Die Anwendung basiert auf [Pinselio](https://github.com/galgental9ps-png/atelier-chatavatar), mit eigener Figur, eigenem Parkwissen und getrennter JavaScript-Schnittstelle.

Eigenständiges Demo-Konzept, kein bereits beauftragter offizieller Park-Assistent. Recherche: **22.11.2026**, ausschließlich öffentliche Primärseiten des Parks. Quellen und Prüftermine stehen an jeder Antwort; Besonderheiten sind in [docs/QUELLEN.md](docs/QUELLEN.md) dokumentiert.

- Produktseite und Demo: https://galgental9ps-png.github.io/chatavatar-universal/
- Wissensstudio: https://galgental9ps-png.github.io/chatavatar-universal/admin.html
- Einbindungsbeispiele: https://galgental9ps-png.github.io/chatavatar-universal/embed-beispiel.html
- Download: https://github.com/galgental9ps-png/chatavatar-universal/archive/refs/heads/main.zip

Diese Seitenadressen funktionieren nach erfolgreicher GitHub-Pages-Veröffentlichung. Einmal unter **Settings → Pages → Source → GitHub Actions** aktivieren. Anschließend den mitgelieferten Workflow „Jimmy – GitHub Pages“ ausführen. Jeder spätere Push auf `main` veröffentlicht die getestete Anwendung automatisch.

## Auf einer Webseite einbinden

In einen HTML-/JavaScript-Bereich einfügen, idealerweise vor `</body>`:

```html
<script src="https://galgental9ps-png.github.io/chatavatar-universal/avatar.js" defer></script>
```

Die Figur, Grafiken und Antworten werden von GitHub Pages geladen. Es ist kein Upload auf den Server der einbindenden Webseite erforderlich. Das Design ist über Shadow DOM gekapselt. Figur, Sprechblase und Antwortfenster nehmen Mausaktionen an; die übrige Webseite bleibt bedienbar.

Wenn nur ein eingebetteter Bereich erlaubt ist:

```html
<iframe src="https://galgental9ps-png.github.io/chatavatar-universal/embed.html"
  title="Jimmy – digitaler Parkbegleiter" width="100%" height="740"
  style="border:0;max-width:100%"></iframe>
```

Die Bewegung bleibt dann im Rahmen. Freie Bewegung über die ganze Webseite erfordert Script-Unterstützung im Seitendokument. Weitere Hinweise: [docs/IONOS.md](docs/IONOS.md).

## Wissen und Funktionsumfang

Hinterlegt sind Besuchszeiten und Ausnahmen, Eintritt und Jahreskarten, Geburtstage und Extras, Attraktionen, Restaurant, Allergenauskünfte, Kita-/Schulausflüge, Anfahrt, Kontakt, Gutscheine und Vermietung. Das Paket hat keine Verbindung zu einem LLM und erzeugt keine freien Antworten. Unbekannte Fragen erhalten einen Hinweis auf das Park-Team.

Keine Live-Abfrage von Buchungen, Auslastung, freien Terminen oder Preisen. Die Links öffnen offizielle Informations- und Buchungsseiten; Jimmy nimmt selbst keine Buchung vor. Preis- und Zeitangaben haben kurze Prüffristen. Befristete Ankündigungen werden nach ihrem Gültigkeitsende nicht mehr vorgeschlagen.

## Wissensstudio

1. `admin.html` öffnen. Über **GitHub-Zugang** zunächst den aktuellen Repository-Stand laden.
2. Antworten, Suchbegriffe, Kategorien, Quellen und Folgefragen bearbeiten oder JSON/Markdown/TXT/CSV importieren.
3. Mit **Antwort testen** bzw. **Jimmy testen** prüfen und **im Browser speichern**.
4. Mit **Auf GitHub speichern** zentral veröffentlichen und den Pages-Workflow abwarten.

Ein Browserentwurf verändert die öffentliche Wissensdatei nicht. Markdown-/TXT-/CSV-Importe erzeugen zunächst deaktivierte Entwürfe. JSON ersetzt das Paket nach Bestätigung. Pro Datei sind maximal 4 MB erlaubt.

Die öffentliche Bearbeitungsoberfläche verleiht keine Schreibrechte. Für GitHub-Veröffentlichungen benötigt der Betreiber einen Fine-grained Token ausschließlich für dieses Repository mit **Contents: Read and write**. Er bleibt im Arbeitsspeicher, wird beim Trennen verworfen und gehört weder in das Wissenspaket noch in den Einbindungscode. JSON und Offlinepaket werden gemeinsam in einem Commit geschrieben; zwischenzeitliche Änderungen werden geprüft.

## Lokaler Start

ZIP vollständig herunterladen und entpacken. Unter Windows `Start-Jimmy.cmd` oder `Start-Wissensstudio.cmd` öffnen. Auch ein Doppelklick auf `index.html` funktioniert mit dem mitgelieferten Offlinepaket.

```sh
python -m http.server 8080
node --test tests/*.test.cjs
node tools/sync-knowledge.cjs
node tools/build-site.cjs
```

`knowledge/jimmys-funpark.json` ist die zentrale Datendatei; `knowledge/jimmys-funpark.bundle.js` die synchronisierte Dateiversion. `tools/build-knowledge.cjs` dokumentiert das recherchierte Startpaket und wird beim Deployment nicht ausgeführt. Spätere Änderungen werden dadurch erhalten.

## Eigene Schnittstelle

`JimmyChatAvatar.instance` ist die Standardinstanz. Sie bietet `open()`, `close()`, `minimize()`, `answer(id)`, `walkTo(x)`, `setKnowledge(pack)` und `destroy()`. Vor Zugriff auf die Antworten `await JimmyChatAvatar.instance.ready` verwenden. Beispiel: `JimmyChatAvatar.instance.answer('zeiten')`.

Eigene Instanz: Script mit `data-manual="true"` laden und `JimmyChatAvatar.create(...)` verwenden. Eigene Wissensquelle über `data-knowledge="https://…/firma.json"` angeben. Bei anderer Domain muss diese Quelle CORS erlauben. DOM-Ereignisse heißen `jimmy:ready`, `jimmy:answer` und `jimmy:error`.

Jimmy verwendet eigene globale Namen und einen separaten Browserentwurf und kann neben Pinselio oder Pinselia eingebunden werden. Bewegungspause, Ausblenden, Escape, Tastaturfokus und reduzierte Bewegung werden unterstützt. Vorlesen wird erst auf Wunsch eingeschaltet; die verwendete Browserstimme kann einen Onlinedienst nutzen.
