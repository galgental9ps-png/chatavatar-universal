# Austauschbare vollständige Figuren

Die Standardfigur wird in **`asset-sets.js`** ausgewählt:

```js
const ACTIVE_ASSET_SET = 'ice-pair';
```

| Kennung | Figur | Bewegung |
| --- | --- | --- |
| `ice-pair` | Aurora & Noel, Eiskunstlauf-Paar | Gemeinsamer Paartanz, getrennte synchrone Pirouetten, Sprung aufeinander zu und gemeinsamer Abschluss |
| `ice-skater` | Lumi, Eiskunstläuferin | Ruhiger tiefer Anlauf, Drehsprünge, Überkreuzschritte, Ausfallschritt, Spirale, aufrechte Pirouetten und komplette Kür |
| `jimmy` | Jimmy, Park-Affe | Laufen und kleine Hüpfer |

Für einen späteren Wechsel genügt diese eine Auswahlzeile. Zeichnungen, Bewegungsprofil, Name, Vorschauknöpfe und figurbezogene Sprüche folgen der Auswahl. Der Veröffentlichungsworkflow muss danach erfolgreich durchlaufen. Eine bereits offene Webseite neu laden; bei einem alten Browsercache vollständig neu laden.

Die Eiskunstläuferin ist eine transparente Figur. Es wird keine Eisfläche oder sonstige Bodenfläche über die Webseite gelegt. Antworten, Wissensstudio, Quellen und Einbindung bleiben der vorhandene Park-Chatavatar.

## Figurenschalter auf der Demo

„Figur auswählen“ zeigt alle vollständigen Sets aus dem Katalog und tauscht die Figur direkt aus. Vorschau, Name, Sprüche und passende Bewegungsbuttons wechseln gemeinsam. Wissen, aktuelle Antwort sowie Pause-, Sichtbarkeits- und Vorleseeinstellungen bleiben erhalten. Ein laufender Sprung wird beim Wechsel am Boden beendet. Während die neue Bilddatei lädt, bleibt die bisherige Figur aktiv; bei einem Ladefehler kann der Wechsel erneut versucht werden.

Die neue Schnittstelle ist `await JimmyChatAvatar.instance.setAsset('jimmy')` bzw. `await JimmyChatAvatar.instance.setAsset('ice-skater')`. Der Renderer stellt mit `JimmyMascot.forAsset(id)` pro Figur einen eigenen zwischengespeicherten Bildsatz bereit. Wiederholte Wechsel nutzen bereits geladene Bilder. Das Ereignis `jimmy:asset-change` meldet den erfolgreichen Austausch an die Vorschau. `ACTIVE_ASSET_SET` bleibt die veröffentlichte Voreinstellung; eine Besucherauswahl verändert diese Datei nicht.

## Paarlauf in einer PNG

`assets/ice-pair-master-v1.png` enthält 64 Felder mit beiden Tänzern und echtem Alpha (1254 × 1254 Pixel, 8 × 8). `ice-pair` ist die neue Voreinstellung. Die Tänzer trennen sich während des Synchronteils räumlich, drehen im gleichen Takt und springen gleichzeitig aufeinander zu. Danach finden sie wieder zusammen und setzen die gestützten Paarfiguren fort. Ganze Figuren, Größenregeln, Ablauf, Einzelfunktionen und beide Bildprompts sind in [PAIR-SKATING.md](PAIR-SKATING.md) beschrieben. `JimmyChatAvatar.instance.duet()` startet den Synchronteil; `perform()` zeigt die gesamte Kür. Der Figurenschalter erhält Lumi und Jimmy.

## Lumi-Master-Atlas (64 Posen)

Aktiv ist `assets/lumi-master-v2.webp` (1254 × 1254 Pixel, 8 × 8 gleich große Felder, Alpha), eine konservativ restaurierte Fassung mit klareren Gesichtsdetails und Konturen. `width` und `height` in `asset-sets.js` benennen die tatsächlichen Quelldimensionen; auch nicht ganzzahlige Feldbreiten werden direkt aus dem Master gelesen. Der ursprüngliche Master `assets/lumi-master-v1.webp` bleibt archiviert. Die logischen 16-Frame-Bewegungen greifen über die Zuordnung in `asset-sets.js` auf 64 vollständige Posen zu. Maßstab und Kufenlinie sind im Bild festgelegt. Nur wenn der aktive Master nicht geladen werden kann, verwendet der Renderer die unten dokumentierten alten Einzeltafeln.

Jede Pose wird direkt in einen Canvas mit der tatsächlichen CSS-Breite mal Geräte-Pixeldichte gezeichnet, auch nach Fenster- oder Zoomänderungen. Es gibt keinen festen 218-Pixel-Zwischenschritt mehr. Die bewegte Figur nutzt 192 Pixel auf dem Desktop und 160 Pixel mobil; die Vorschau 256 bzw. 240 Pixel. Die Bildschirmposition wird auf Gerätepixel gerundet. Die restaurierte Zeichnung wurde verlustfrei als WebP übernommen; eine nachträgliche Vergrößerung der Datei würde keine zusätzlichen Details liefern.

Restaurierungsbrief: Bestehenden 64-Posen-Master schärfer ausarbeiten, Gesicht, Augen, Haare, Kleidsaum und Schlittschuhe klarer zeichnen. Identität, Kostüm, Proportionen, alle Posen und ihre Reihenfolge, das 8×8-Raster und die Kufenlinie erhalten. Keine neuen Körperteile, Bewegungen, Beschriftungen, Schatten oder Eisfläche; Außenbereiche transparent. Die Originaldatei und ihre Darstellung auf hellem Papier dienten als Referenz. Die Bildüberarbeitung erfolgte mit der integrierten Bildgenerierung; die resultierende Datei hat 1254 × 1254 Pixel und wird nicht als höher aufgelöster 4K-Master bezeichnet.

## Neue Bilddateien

Alle Figuren bestehen aus vollständig gezeichneten Actionframes; es werden keine Arme, Beine oder anderen Körperteile zusammengesetzt.

| Datei | Inhalt |
| --- | --- |
| `assets/ice-skater-poses-v1.webp` | 16 vollständige Begrüßungs-, Gesprächs- und Interaktionsposen |
| `assets/ice-skater-glide-v1.webp` | 16 aufeinanderfolgende Phasen eines flachen, weichen Abstoß- und Gleitzyklus |
| `assets/ice-skater-spin-v1.webp` | 16 Ansichten einer aufrechten Drehung einschließlich Seiten- und Rückenansichten |
| `assets/ice-skater-spiral-v1.webp` | 16 Phasen zum Anheben, Halten und Absenken des freien Beins |
| `assets/ice-skater-speed-v2.webp` | 16 tiefe, kraftvolle Abstoßphasen mit weichem Armschwung |
| `assets/ice-skater-jump-v2.webp` | 16 vollständige Absprung-, Flug-, Dreh- und Landeposen |
| `assets/ice-skater-flow-v2.webp` | 8 Ein- und 8 Ausstiegsposen zum allmählichen Schließen und Öffnen der Arme |
| `assets/ice-skater-footwork-v2.webp` | 16 Überkreuz-, Streck- und Ausfallschrittphasen |
| `assets/ice-skater-jump-bridge-v3.webp` | 8 feinere Absprung- und 8 Landeübergänge, einschließlich der Vorbereitung noch in der Luft |

Die Bildtafeln haben jeweils vier mal vier Felder. Der Renderer zeigt genau ein vollständiges Bild mit voller Deckkraft und erhält die RGB-Farben. Schwache Reste der Freistellung werden beim Laden entfernt. Die Kufenhöhe wird zwischen den Einzelbildern ausgerichtet. Die Figur verschiebt sich unabhängig davon mit der Bildwiederholrate des Browsers; Abstoß und Bewegungsphase folgen der tatsächlich zurückgelegten Strecke. Das Tempo steigt sanft an und wird vor dem Anhalten abgebremst. Eine Pirouette dreht die Ansichten des Körpers um die senkrechte Achse, kein flaches, auf die Seite rollendes Bild.

**Größenregel für jede neue oder geänderte Figur:** Kopf, Körperproportionen und anatomischer Maßstab müssen über alle Einzelbilder vergleichbar bleiben. Eine Hocke wird nicht auf die sichtbare Höhe einer stehenden Figur hochskaliert. `layoutFor()` verwendet deshalb pro Tafel einen festen Maßstab. Die neue Sprungtafel gleicht zwei identische Haltungen ab: tiefe Anlaufhocke mit `speed:0` sowie geschlossene Flughaltung mit `jump:11`. Aus beiden Referenzen wird ein gemeinsamer Maßstab ermittelt. Alle 16 Zwischenposen behalten diesen Maßstab und dieselbe senkrechte Körperachse. Kleine isolierte Bildreste aus Nachbarzellen werden vor der Vermessung entfernt; feine Kufen und nahe Haarspitzen bleiben erhalten.

Beim Sprung folgen jetzt acht kleinere Absprungänderungen aufeinander. Kurz vor dem Bodenkontakt öffnen drei weitere Posen Arme und Beine bereits im Flug. Erst danach setzt die Kufe auf; die tiefe Kniebeuge zum Abfedern folgt nach dem Kontakt. Der Auslauf bleibt in derselben Bildtafel, damit kein zusätzlicher Größen- oder Haltungswechsel am Ende der Landung entsteht.

`skating-core.js` verwendet das Bewegungsprofil aus `asset-sets.js`: `tempo: .675` hält die Bodenbewegung ruhig, `jumpTempo: .895` steuert den Sprung und `spinTempo: .79` die Pirouetten. Die Feinabstimmung beschleunigt den gesamten Ablauf um etwa 4 % und das Antreten beim Anlauf um etwa 11 %. `approachStride: 1.22` steuert diese Schrittfolge unabhängig vom normalen Gleitzyklus mit `stride: 1.3`. Die Kür dauert auf üblichen Desktop-Fenstern etwa 35–55 Sekunden. Das Fahrtempo bleibt auf etwa 240 CSS-Pixel pro Sekunde begrenzt; kleinere Figuren bewegen sich entsprechend langsamer. Breitere Fenster verlängern den Anlauf und die Gleitstrecke, während die Sprungdauer gleich bleibt. Der manuelle Gleitknopf fährt mit etwa 144 Pixeln pro Sekunde. Geschwindigkeit und Beschleunigung schließen an den Wendepunkten ohne Sprung an. Die Abstoßphasen folgen der Strecke.

Die acht Anlauf-, Gleit- und Schrittposen durchlaufen ihren Zyklus jeweils einmal. Die frühere Wiederholung derselben Folge innerhalb von 16 logischen Frames entfällt. Vor beiden Sprüngen gibt es genau einen Anlaufabschnitt ohne zusätzliche Überkreuzschritte oder einen zweiten Anlauf. In den letzten 450 Millisekunden schließt sich die Haltung allmählich; danach folgen ein einzelner Absprung, die Flugbahn, die gedämpfte Landung und das Weitergleiten. Überkreuzschritte und Ausfallschritt bleiben im verbindenden Gleitabschnitt erhalten.

Vor den Pirouetten schließen acht vollständige Zwischenposen Arme und Beine; danach öffnen acht Ausstiegsbilder die Haltung wieder. Die Drehgeschwindigkeit baut sich sanft auf und ab. Ein Richtungswechsel erfolgt während einer stationären Rückenansicht; die Bildfolge wird dabei entsprechend weitergeführt. Es werden keine Körperteile separat bewegt, keine flachen Bilder um die Bildschirmachse gedreht und keine halbtransparenten Doppelbilder überblendet.

Nach einer kurzen Pause beginnt die nächste Kür. Ein geöffnetes Antwortfenster, Pause, reduzierte Bewegung und Ziehen unterbrechen die gesamte Folge. Ein ausgeblendeter Tab hält die Kürzeit an. Eine langsame Einzelbildberechnung verlängert die Kür nicht; die nächste Position wird aus der verstrichenen Zeit berechnet. Alle Wege und Sprünge werden an die Fenstergröße angepasst. Ein während eines Sprungs angefordertes anderes Element wartet bis zur Landung oder zum weichen Pirouettenausstieg.

## Erzeugungsbrief

Einheitliche erwachsene, athletische Eiskunstläuferin mit braunem Dutt, silberner Haarspange, eisblauem langärmeligem Kleid mit lavendelfarbenem Rock, naturfarbenen Strumpfhosen und weißen Schlittschuhen mit schmalen Stahlkufen. Freundlicher, plastisch gemalter Illustrationsstil. Gleiche Identität, Körperproportionen und Beleuchtung in allen Feldern. Vollständige Figuren mit sicheren Rändern vor transparentem Hintergrund, keine Beschriftung oder Hintergrundszene.

Die drei Bewegungsbriefe ergänzen diese Vorgaben: sechzehn flache Abstoß- und Gleitphasen nach rechts mit gleichbleibender Schulterperspektive; sechzehn Winkelansichten einer aufrechten Einbein-Pirouette in Schritten von 22,5 Grad; sechzehn Phasen einer Arabesque mit stabilem Stützbein und lang nach hinten gestrecktem freien Bein. Das Gleitfiguren-Atlas wurde zusätzlich freigestellt, um Hintergrund und Raster zu entfernen. Die PNG-Originale wurden ohne Änderung der Pose oder des Rasteraufbaus in WebP übertragen.

## Schnittstelle

Der bestehende Name `JimmyChatAvatar` bleibt für bisherige Einbindungen erhalten; `UniversalChatAvatar` ist derselbe Einstieg. Die Standardinstanz bietet `perform()` für die gesamte Kür, `skateJump()` bzw. `hop()` für einen Anlauf mit Drehsprung, `spin()` für eine Pirouette mit Zwischenposen sowie `walkTo(x, {style:'speed'})`. Weitere Werte für `style` sind `'footwork'`, `'spiral'` und `'glide'`. Die übliche Script-Adresse bleibt `avatar.js`.

Die vier neuen Bildtafeln wurden mit der integrierten Bildgenerierung erstellt und unverändert als WebP mit Alpha übernommen. Die vollständigen Bildvorgaben stehen in [LUMI-KUER-PROMPTS.md](LUMI-KUER-PROMPTS.md).

