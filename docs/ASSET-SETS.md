# Austauschbare vollständige Figuren

Die aktive Figur wird in **`asset-sets.js`** ausgewählt:

```js
const ACTIVE_ASSET_SET = 'ice-skater';
```

| Kennung | Figur | Bewegung |
| --- | --- | --- |
| `ice-skater` | Lumi, Eiskunstläuferin | Schneller tiefer Anlauf, Drehsprünge, Überkreuzschritte, Ausfallschritt, Spirale, aufrechte Pirouetten und komplette Kür |
| `jimmy` | Jimmy, Park-Affe | Laufen und kleine Hüpfer |

Für einen späteren Wechsel genügt diese eine Auswahlzeile. Zeichnungen, Bewegungsprofil, Name, Vorschauknöpfe und figurbezogene Sprüche folgen der Auswahl. Der Veröffentlichungsworkflow muss danach erfolgreich durchlaufen. Eine bereits offene Webseite neu laden; bei einem alten Browsercache vollständig neu laden.

Die Eiskunstläuferin ist eine transparente Figur. Es wird keine Eisfläche oder sonstige Bodenfläche über die Webseite gelegt. Antworten, Wissensstudio, Quellen und Einbindung bleiben der vorhandene Park-Chatavatar.

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

Die Bildtafeln haben jeweils vier mal vier Felder. Der Renderer zeigt genau ein vollständiges Bild mit voller Deckkraft und erhält die RGB-Farben. Schwache Reste der Freistellung werden beim Laden entfernt. Die Kufenhöhe wird zwischen den Einzelbildern ausgerichtet. Die Figur verschiebt sich unabhängig davon mit der Bildwiederholrate des Browsers; Abstoß und Bewegungsphase folgen der tatsächlich zurückgelegten Strecke. Das Tempo steigt sanft an und wird vor dem Anhalten abgebremst. Eine Pirouette dreht die Ansichten des Körpers um die senkrechte Achse, kein flaches, auf die Seite rollendes Bild.

`skating-core.js` verbindet die vollständigen Bilder zu einer Kür von etwa 20–22 Sekunden. Zusammenhängende Fahrten bauen Tempo auf und bremsen nur vor den Wendungen ab. Geschwindigkeit und Beschleunigung schließen an diesen Punkten ohne Sprung an. Die Abstoßphasen folgen der Strecke. Erst die tiefen Kniebeugen, dann der vollständig gezeichnete aufrechte Drehsprung entlang einer Flugbahn, anschließend die gedämpfte Landung und das Weitergleiten. Der zweite Sprung verwendet zwei aufrechte Drehungen. Überkreuzschritte, tiefer Ausfallschritt und Spirale verbinden die Elemente.

Vor den Pirouetten schließen acht vollständige Zwischenposen Arme und Beine; danach öffnen acht Ausstiegsbilder die Haltung wieder. Die Drehgeschwindigkeit baut sich sanft auf und ab. Ein Richtungswechsel erfolgt während einer stationären Rückenansicht; die Bildfolge wird dabei entsprechend weitergeführt. Es werden keine Körperteile separat bewegt, keine flachen Bilder um die Bildschirmachse gedreht und keine halbtransparenten Doppelbilder überblendet.

Nach einer kurzen Pause beginnt die nächste Kür. Ein geöffnetes Antwortfenster, Pause, reduzierte Bewegung und Ziehen unterbrechen die gesamte Folge. Ein ausgeblendeter Tab hält die Kürzeit an. Eine langsame Einzelbildberechnung verlängert die Kür nicht; die nächste Position wird aus der verstrichenen Zeit berechnet. Alle Wege und Sprünge werden an die Fenstergröße angepasst. Ein während eines Sprungs angefordertes anderes Element wartet bis zur Landung oder zum weichen Pirouettenausstieg.

## Erzeugungsbrief

Einheitliche erwachsene, athletische Eiskunstläuferin mit braunem Dutt, silberner Haarspange, eisblauem langärmeligem Kleid mit lavendelfarbenem Rock, naturfarbenen Strumpfhosen und weißen Schlittschuhen mit schmalen Stahlkufen. Freundlicher, plastisch gemalter Illustrationsstil. Gleiche Identität, Körperproportionen und Beleuchtung in allen Feldern. Vollständige Figuren mit sicheren Rändern vor transparentem Hintergrund, keine Beschriftung oder Hintergrundszene.

Die drei Bewegungsbriefe ergänzen diese Vorgaben: sechzehn flache Abstoß- und Gleitphasen nach rechts mit gleichbleibender Schulterperspektive; sechzehn Winkelansichten einer aufrechten Einbein-Pirouette in Schritten von 22,5 Grad; sechzehn Phasen einer Arabesque mit stabilem Stützbein und lang nach hinten gestrecktem freien Bein. Das Gleitfiguren-Atlas wurde zusätzlich freigestellt, um Hintergrund und Raster zu entfernen. Die PNG-Originale wurden ohne Änderung der Pose oder des Rasteraufbaus in WebP übertragen.

## Schnittstelle

Der bestehende Name `JimmyChatAvatar` bleibt für bisherige Einbindungen erhalten; `UniversalChatAvatar` ist derselbe Einstieg. Die Standardinstanz bietet `perform()` für die gesamte Kür, `skateJump()` bzw. `hop()` für einen Anlauf mit Drehsprung, `spin()` für eine Pirouette mit Zwischenposen sowie `walkTo(x, {style:'speed'})`. Weitere Werte für `style` sind `'footwork'`, `'spiral'` und `'glide'`. Die übliche Script-Adresse bleibt `avatar.js`.

Die vier neuen Bildtafeln wurden mit der integrierten Bildgenerierung erstellt und unverändert als WebP mit Alpha übernommen. Die vollständigen Bildvorgaben stehen in [LUMI-KUER-PROMPTS.md](LUMI-KUER-PROMPTS.md).
