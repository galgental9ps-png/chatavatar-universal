# Auftrag für ein neues Wissenspaket

Kopieren Sie diesen Auftrag in ChatGPT und ergänzen Sie Organisation und Webseite. Laden Sie das Ergebnis als JSON im Wissensstudio hoch. Das Widget selbst verwendet kein LLM.

> Erstelle ein ausführliches, quellenbasiertes Wissenspaket für Chatavatar, schemaVersion 1, für **[Name]**, offizielle Webseite **[URL]**. Recherchiere öffentliche Primärquellen. Nutze das Schema aus `knowledge/firma-vorlage.json` und die Feldbeschreibung aus `docs/WISSENSSCHEMA.md`. Liefere valides UTF-8-JSON. Erstelle einzelne, verständliche Frage-Antwort-Einträge mit Kategorien, Suchbegriffen, Folgefragen-IDs, offiziellen weiterführenden Links, Quellen-URL, tatsächlichem Prüfdatum und nächstem Prüftermin. Prüfe Kontakt, Öffnungszeiten samt Ausnahmen, Leistungen/Abteilungen, Zielgruppen, Anmeldewege, Beiträge/Preise samt Zusatzkosten, Anfahrt, Barrierefreiheit soweit belegt und häufige Fragen. Trenne angekündigte von schon verfügbaren Angeboten. Bei widersprüchlichen Quellen beschreibe den Widerspruch und verweise auf die zuständige Kontaktstelle. Erfinde keine Zeiten, freien Plätze, Ansprechpartner, Preise oder Zusagen. Keine vertraulichen Daten. Verwende selbst formulierte kurze Antworten statt kopierter Website-Texte. Alle Folgefragen-IDs müssen existieren. Nicht belegbare Inhalte bleiben deaktiviert (`enabled: false`) und erhalten kein erfundenes Prüfdatum. Belege keine reine Navigation als detaillierte Leistungsbeschreibung. Gib zusätzlich an, welche Bereiche sich öffentlich nicht zuverlässig klären ließen.

## Import und Prüfung

1. Ergebnis als `.json` speichern.
2. `admin.html` → **Wissen hochladen** → Datei auswählen.
3. Organisation, aktive Antworten, Quellen und Folgefragen prüfen.
4. **Jimmy testen** bzw. **Antwort testen** verwenden.
5. Mit GitHub verbinden, aktuellen Stand laden, Paket importieren und auf GitHub speichern.

Ein JSON-Paket ersetzt den gesamten Entwurf. Markdown/TXT/CSV ergänzen Einträge. Importierte Texte bleiben deaktiviert, bis sie redaktionell freigegeben werden. Reine Dokumentimporte werden nicht automatisch in perfekte FAQs umgeschrieben.

