# Wissensschnittstelle v1

`knowledge/jimmys-funpark.json` ist die zentrale öffentliche Datenschnittstelle. Der Avatar lädt sie beim Start mit `cache: no-cache`. Er zeigt ausschließlich hinterlegte Antworten und verwendet weder ein Sprachmodell noch einen API-Schlüssel. Die Suche ist eine lokale gewichtete Textsuche über Frage, Suchbegriffe und Antwort. Keine semantische KI-Suche und keine automatisch erzeugten Antworten.

| Feld | Bedeutung |
|---|---|
| `schemaVersion` | Muss `1` sein. |
| `id` | Kennung des Pakets. |
| `updatedAt` | Paketstand als `YYYY-MM-DD`. |
| `organization` | `name`, `shortName`, `website`, `greeting`, `fallback`. |
| `avatar` | `name`, `subtitle`, `color` (sechsstelliger Hexcode). |
| `categories` | Liste aus `id`, `label`, `icon`. |
| `suggested` | IDs für die vorgeschlagenen Startfragen und Sprechblasen. |
| `entries` | 1 bis 1500 Einträge. |

## Eintrag

| Feld | Bedeutung |
|---|---|
| `id` | Eindeutige Kennung; wird für Folgefragen und JavaScript-Aufrufe verwendet. |
| `category` | Existierende Kategorie-ID. |
| `question` | Frage und klickbare Beschriftung, bis 220 Zeichen. |
| `answer` | Unverändert dargestellter Text bis 12000 Zeichen; Zeilenumbrüche erlaubt. |
| `keywords` | Zusätzliche Suchbegriffe als Liste. |
| `suggestions` | Existierende Eintrags-IDs für Folgefragen. |
| `links` | Liste aus `label` und `url`, höchstens zehn. |
| `sourceUrl` | Öffentliche Quelle, bevorzugt die offizielle Seite. |
| `verifiedAt` | Tatsächliches Prüfdatum. Leer, wenn ungeprüft. |
| `reviewAfter` | Ab wann eine erneute Prüfung empfohlen wird. Warnhinweis nach Ablauf. |
| `validFrom`, `validUntil` | Optionaler Gültigkeitszeitraum; außerhalb wird der Eintrag ausgeblendet. |
| `enabled` | `false` blendet einen Eintrag im Besucher-Avatar aus. |
| `priority` | 0–100, für die Reihenfolge innerhalb von Themen. |

Tagesgrenzen werden in **Europe/Berlin** bestimmt. `reviewAfter` löscht keine Inhalte und aktualisiert sie nicht selbst. Es erzeugt einen Prüfhinweis. Zeitlich begrenzte Aktionen können über `validUntil` zuverlässig ausgeblendet werden.

## Einbinden

```html
<script src="https://IHR-HOST/Chatavatar/avatar.js" defer></script>
```

Alle benötigten Dateien werden relativ zu `avatar.js` geladen. Eigene Wissensquelle:

```html
<script src="https://IHR-HOST/Chatavatar/avatar.js"
        data-knowledge="https://IHR-HOST/wissen/firma.json"
        defer></script>
```

Bei verschiedenen Domains muss die JSON-Quelle CORS für die einbindende Webseite erlauben. Keine Tokens oder Zugangsdaten in Einbindungscode oder Wissensdateien schreiben. Die öffentliche JSON-Datei ist für Websitebesucher lesbar, auch wenn einzelne Einträge deaktiviert sind.

## JavaScript

Standardinstanz: `JimmyChatAvatar.instance`, sobald das Script geladen ist. Mit `await JimmyChatAvatar.instance.ready` auf die Wissensdaten warten. Die Instanz bietet `open()`, `close()`, `minimize()`, `answer(id)`, `setKnowledge(pack)` und `destroy()`.

Für eine manuell erzeugte Instanz: Script mit `data-manual="true"` laden und dann `JimmyChatAvatar.create({ knowledge: paket })` oder `JimmyChatAvatar.create({ knowledgeUrl: url })` aufrufen. `jimmy:ready`, `jimmy:answer` und `jimmy:error` sind DOM-Ereignisse am Host-Element. Antwortereignisse enthalten nur die Eintrags-ID.

## Offlinepaket

`knowledge/jimmys-funpark.bundle.js` enthält denselben Datenstand als lokale Dateiversion. Beim direkten Öffnen von `index.html` per Doppelklick funktioniert diese ohne JSON-Fetch. Nach manuellen JSON-Änderungen ausführen:

```sh
node tools/sync-knowledge.cjs
```

Das Wissensstudio veröffentlicht JSON und Offlinepaket gemeinsam in einem Git-Commit. Eigene `data-knowledge`-URLs werden bei einem Ladefehler niemals stillschweigend durch das Park-Paket ersetzt.

