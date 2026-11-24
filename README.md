# Chatavatar Universal · austauschbare Figuren

Aktiv sind **Lina & Elio**, ein weiteres, feiner gestaltetes Paar im Stil von Lumi: Lina ist blond, Elio blond-rot; ihre schlichten Kostüme sind in Perlmutt, Flieder und Taubenblau gehalten. Beide besitzen je eine eigene Haupt- und Zusatz-PNG mit zusammen 64 vollständigen Einzelposen pro Person. **„Paartanz vorführen“** startet die feine gemeinsame Kür mit kleineren, weich geführten Sprüngen. **„Pirouetten & Umkreisen“** zeigt die zweite Folge: Lina dreht drei Pirouetten auf derselben Stelle, Elio tanzt zweimal um sie herum, beide gleiten wieder synchron und schließen nebeneinander ab. Elio steht beim letzten Knicks von Lina ruhig dabei. Nach dem Umkreisen bleiben beide auf derselben Kufenhöhe. Elios Drehungen schließen vollständige Runden; seine Stand-, Gleit-, Dreh- und Sprungansichten sind über passende Referenzposen im Maßstab abgeglichen. Automatisch wechseln beide Folgen ab. Bilddateien, Größenregeln und vollständige Vorgaben: [docs/FINE-PAIR-SKATING.md](docs/FINE-PAIR-SKATING.md).

**Aurora & Noel** bleiben als buntes, glitzerndes Eiskunstlauf-Paar erhalten: Aurora ist blond, Noel blond-rot. Beide verwenden jetzt eigene neue Action-PNGs mit je 32 vollständigen Posen: `assets/aurora-action-v1.png` und `assets/noel-action-v1.png` (je 887 × 1774 Pixel, 4 × 8 Felder). Beide bleiben während der gesamten Kür eigenständige Avatare. Die frühere gemeinsame Paar-PNG wird nicht mehr verwendet. Die Kür verbindet gemeinsame Figuren mit getrennten synchronen Pirouetten, einem gleichzeitigen Sprung aufeinander zu und dem anschließenden Zusammenfinden. **„Synchronfolge vorführen“** spielt den getrennten Teil einzeln ab. **„Paartanz vorführen“** zeigt die gesamte Folge. Bildaufbau und Bildprompts: [docs/PAIR-SKATING.md](docs/PAIR-SKATING.md).

Die Voreinstellung steht in `asset-sets.js`: `const ACTIVE_ASSET_SET = 'ice-pair-fine';`. Die vier vollständigen Sets `ice-pair-fine`, `ice-pair`, `ice-skater` und `jimmy` bleiben im Figurenschalter auswählbar. Jeder Tänzer wird durchgehend aus seiner eigenen PNG als vollständige Figur gezeichnet. Beide bewegen sich im selben Takt, gleiten auseinander, springen aufeinander zu und finden wieder in eine nahe Formation. Sie bleiben dabei zwei getrennte Avatare. Beim Auseinandergleiten bleiben beide auf derselben Kufenhöhe; ein vollständiger Gleitzyklus und leichtes Kantenneigen begleiten die Bewegung.

Die Demoseite verwendet eine durchgehende helle Glasoptik: transparente Flächen, feine Lichtkanten, eine kühle Perlweiß-Lavendel-Palette und passende Musik- und Tanzschalter. Die Eislandschaft bleibt bis zum Bildschirmrand sichtbar. Das Layout passt sich an schmale Bildschirme an.

## Lumi als weiteres Asset

**Lumi, die Eiskunstläuferin**, bleibt erhalten: eine ruhiger abgespielte Kür mit tiefem Anlauf, einfachem und doppeltem Drehsprung, weichen Landungen, Überkreuzschritten, tiefem Ausfallschritt, Spirale und aufrechten Pirouetten. Alle Bewegungen verwenden den gemeinsamen Master-Atlas mit 64 vollständigen Posen. Auf üblichen Desktop-Fenstern dauert die Kür etwa 35–55 Sekunden; breite Fenster verlängern den Anlauf statt das Fahrtempo. Die frei laufende Figur benötigt keine eigene Eisfläche. Jimmy bleibt als vollständiges zweites Asset-Set erhalten.

Die bewegte Figur ist auf dem Desktop 192 Pixel, mobil 160 Pixel breit. Die Vorschau verwendet 256 bzw. 240 Pixel und zeichnet direkt in der tatsächlichen Bildschirmauflösung. Dadurch entfällt das nachträgliche Strecken eines zu kleinen Canvas. Der restaurierte Master `assets/lumi-master-v2.webp` erhält alle 64 vollständigen Posen und hat klarere Gesichtsdetails und Konturen. Er wird verlustfrei mit Transparenz gespeichert; der ursprüngliche Master bleibt erhalten.

Der Anlauf verwendet die acht Quellposen einmal je Bewegungszyklus. Überkreuzschritte liegen im verbindenden Gleitabschnitt. Vor jedem Sprung schließt Lumi ihre Haltung ohne eine zweite schnelle Anlauffolge. Das Antreten verwendet mit `approachStride: 1.22` eine etwas schnellere Schrittfolge. `tempo: .675`, `jumpTempo: .895` und `spinTempo: .79` stimmen den übrigen Ablauf behutsam darauf ab. Das Antreten läuft gegenüber der vorherigen Fassung etwa 11 % schneller, die übrigen Bewegungen etwa 4 %.

Auf der Demoseite wechselt **„Figur auswählen“** direkt zwischen **Lina & Elio · Feines Eiskunstlauf-Paar**, **Aurora & Noel · Eiskunstlauf-Paar**, **Lumi · Eiskunstläuferin** und **Jimmy · Park-Affe**. Die laufende Figur, die große Vorschau, Namen, Bewegungsbuttons und Sprüche wechseln zusammen. Die Seite wird dabei nicht neu geladen; die Musik kann weiterspielen. Die Auswahl verwendet die vollständig vorhandenen Figuren aus `asset-sets.js`.

Die Standardfigur steht zentral in `asset-sets.js`. Für Lumi genügt der Wert `'ice-skater'`, für Jimmy `'jimmy'`. Diese Voreinstellung gilt beim Laden der Seite und für bestehende Einbindungen. Details und Dateiliste: [docs/ASSET-SETS.md](docs/ASSET-SETS.md).

Die vorhandenen Antworten und das Wissensstudio beziehen sich weiterhin auf Jimmy’s Fun Park. Der Einbindungscode bleibt gleich.

Unten auf der Demoseite liegt eine helle, minimalistische Winterlandschaft als eigene PNG: `assets/glass-ice-scene-v1.png` (2172 × 724 Pixel). Die weiße Eisfläche in Glasoptik reicht ohne umlaufenden Rand über die gesamte Seitenbreite. Auf schmalen Bildschirmen füllt ein mittiger Ausschnitt den Streifen. In der Landschaft wird kein zusätzlicher Avatar erzeugt; die vorhandene frei laufende Figur bleibt sichtbar. Bildbeschreibung und Entstehung: [docs/GLASS-ICE-SCENE.md](docs/GLASS-ICE-SCENE.md).

Die Demo spielt **Bittersweet Beauty → Glacial Arpeggios → Bittersweet Beauty** als fortlaufende Playlist. Die hochgeladene Datei `Glacial Arpeggios.m4a` bleibt erhalten; `Glacial Arpeggios.mp3` ist die browserfähige Wiedergabefassung. Beide MP3s werden mit veröffentlicht. Nach dem Titelende wechselt die Seite automatisch zum nächsten Lied. „Nächstes Lied“ an der Winterlandschaft wechselt direkt; eine manuelle Pause bleibt auch dabei erhalten. Lautstärke bleibt leise. Blockiert der Browser den hörbaren Autostart, beginnt die Wiedergabe nach dem ersten Klick oder über „Musik einschalten“. Beim Wechsel in einen anderen Tab pausiert die Musik und setzt nur eine zuvor laufende Wiedergabe fort. Die normale Avatar-Einbindung lädt weiterhin keine Musik und keine Winterlandschaft.

Sprechblase und Antwortfenster verwenden eine helle Glasoberfläche mit Hintergrundunschärfe, feinen Lichtkanten und farbig schimmernden Überschriften. Die Sprechtexte erhalten einen violett-pink-türkisen Farbverlauf; längere Antworten bleiben gut lesbar in dunkler Schrift.

**Kür vorführen**, **Drehsprung** und **Pirouette** starten die zusammenhängende Folge bzw. einzelne Elemente. Automatisch führt Lumi ihre Kür nach kurzen Pausen erneut auf. Beim Öffnen einer Antwort, bei Pause, reduzierter Bewegung und beim Ziehen wird sie unterbrochen. Ein während eines Sprungs angefordertes anderes Element wartet auf einen sicheren Ausstieg.

Die Sprungübergänge verwenden zusätzlich 16 vollständige Zwischenposen: schrittweises Strecken beim Absprung, Öffnen der Haltung vor dem Aufsetzen und anschließendes Abfedern. Anlauf, Flughaltung und Landung werden an denselben anatomischen Maßstäben ausgerichtet; eine gebeugte Haltung wird dabei nicht künstlich vergrößert.

---

# Jimmy · Chatavatar für Jimmy’s Fun Park

Ein animierter Affe für eine Webseite: Er läuft am Seitenrand, hüpft, winkt, lässt sich ziehen und beantwortet anklickbare Fragen über Jimmy’s Fun Park in Dasing. Die Anwendung basiert auf [Pinselio](https://github.com/galgental9ps-png/atelier-chatavatar), mit eigener Figur, eigenem Parkwissen und getrennter JavaScript-Schnittstelle.

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

## Bewegung und Affensprüche

Jimmy verwendet vollständige Actionframes. Die acht Laufbilder in `assets/jimmy-walk-v3.webp` zeigen einen leichten Armschwung bei gleichbleibender Schulterperspektive. Es werden keine einzelnen Körperteile zusammengesetzt. Die vorhandenen vier Sprungbilder zeigen Ausholen, Aufstieg, Abstieg und Landung. Kleine seitliche Hüpfer bleiben innerhalb des sichtbaren Fensters; bei wenig Platz werden sie begrenzt oder ausgelassen.

Zwischendurch wechselt Jimmy zwischen Winken, Grübeln, Jubeln und Ausruhen. `personality-core.js` enthält 60 kurze Sprüche: 32 für Pausen, 16 fürs Laufen und 12 fürs Springen. Jeder Vorrat wird durchgemischt und vollständig verwendet, bevor Sprüche wiederholt werden. Die Sprüche enthalten keine neuen Parkauskünfte. Während einer geöffneten Antwort, beim Ziehen, bei Pause und auf ausgeblendeten Seiten werden keine automatischen Sprüche gestartet. Vorlesen bleibt freiwillig. Reduzierte Bewegung verhindert automatische Hüpfer.

Auf der Produktseite lassen sich Laufen, Springen und ein Affenspruch einzeln ausprobieren.

## Wissensstudio

1. `admin.html` öffnen. Über **GitHub-Zugang** zunächst den aktuellen Repository-Stand laden.
2. Antworten, Suchbegriffe, Kategorien, Quellen und Folgefragen bearbeiten oder JSON/Markdown/TXT/CSV importieren.
3. Mit **Antwort testen** bzw. **Jimmy testen** prüfen und **im Browser speichern**.
4. Mit **Auf GitHub speichern** zentral veröffentlichen und den Pages-Workflow abwarten.

Ein Browserentwurf verändert die öffentliche Wissensdatei nicht. Markdown-/TXT-/CSV-Importe erzeugen zunächst deaktivierte Entwürfe. JSON ersetzt das Paket nach Bestätigung. Pro Datei sind maximal 4 MB erlaubt.

Die öffentliche Bearbeitungsoberfläche verleiht keine Schreibrechte. Für GitHub-Veröffentlichungen benötigt der Betreiber einen Fine-grained Token ausschließlich für dieses Repository mit **Contents: Read and write**. Er bleibt im Arbeitsspeicher, wird beim Trennen verworfen und gehört weder in das Wissenspaket noch in den Einbindungscode. JSON und Offlinepaket werden gemeinsam in einem Commit geschrieben; zwischenzeitliche Änderungen werden geprüft.

## Lokaler Start

ZIP vollständig herunterladen und entpacken. Für Lumi die Dateien über einen lokalen HTTP-Server öffnen, damit die transparenten Canvas-Bilder verarbeitet werden können; beispielsweise den folgenden Server starten und `http://localhost:8080` öffnen. Das Wissenspaket liegt ebenfalls vollständig im Download.

```sh
python -m http.server 8080
node --test tests/*.test.cjs
node tools/sync-knowledge.cjs
node tools/build-site.cjs
```

`knowledge/jimmys-funpark.json` ist die zentrale Datendatei; `knowledge/jimmys-funpark.bundle.js` die synchronisierte Dateiversion. `tools/build-knowledge.cjs` dokumentiert das recherchierte Startpaket und wird beim Deployment nicht ausgeführt. Spätere Änderungen werden dadurch erhalten.

## Eigene Schnittstelle

`JimmyChatAvatar.instance` ist die Standardinstanz. Sie bietet `open()`, `close()`, `minimize()`, `answer(id)`, `walkTo(x)`, `hop()`, `showQuip()`, `setKnowledge(pack)` und `destroy()`. Vor Zugriff auf die Antworten `await JimmyChatAvatar.instance.ready` verwenden. Beispiel: `JimmyChatAvatar.instance.answer('zeiten')`.

Eigene Instanz: Script mit `data-manual="true"` laden und `JimmyChatAvatar.create(...)` verwenden. Eigene Wissensquelle über `data-knowledge="https://…/firma.json"` angeben. Bei anderer Domain muss diese Quelle CORS erlauben. DOM-Ereignisse heißen `jimmy:ready`, `jimmy:answer` und `jimmy:error`.

Jimmy verwendet eigene globale Namen und einen separaten Browserentwurf und kann neben Pinselio oder Pinselia eingebunden werden. Bewegungspause, Ausblenden, Escape, Tastaturfokus und reduzierte Bewegung werden unterstützt. Vorlesen wird erst auf Wunsch eingeschaltet; die verwendete Browserstimme kann einen Onlinedienst nutzen.
