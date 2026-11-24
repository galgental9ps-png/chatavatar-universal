# Austauschbare vollständige Figuren

Die aktive Figur wird in **`asset-sets.js`** ausgewählt:

```js
const ACTIVE_ASSET_SET = 'ice-skater';
```

| Kennung | Figur | Bewegung |
| --- | --- | --- |
| `ice-skater` | Lumi, Eiskunstläuferin | Weiches Gleiten, Gleitfigur mit ausgestrecktem Bein, aufrechte Pirouetten |
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

Die Bildtafeln haben jeweils vier mal vier Felder. Der Renderer zeigt genau ein vollständiges Bild mit voller Deckkraft und erhält die RGB-Farben. Schwache Reste der Freistellung werden beim Laden entfernt. Die Kufenhöhe wird zwischen den Einzelbildern ausgerichtet. Die Figur verschiebt sich unabhängig davon mit der Bildwiederholrate des Browsers; Abstoß und Bewegungsphase folgen der tatsächlich zurückgelegten Strecke. Das Tempo steigt sanft an und wird vor dem Anhalten abgebremst. Eine Pirouette dreht die Ansichten des Körpers um die senkrechte Achse, kein flaches, auf die Seite rollendes Bild.

Die Gleitfigur wird alle drei Fahrten automatisch verwendet. Pirouetten erscheinen gelegentlich nach dem Anhalten. Alle zeitlich begrenzten Figuren kehren von selbst in den normalen Ablauf zurück. Ein offenes Antwortfenster, Pause, reduzierte Bewegung und Ziehen unterbrechen die automatischen Figuren.

## Erzeugungsbrief

Einheitliche erwachsene, athletische Eiskunstläuferin mit braunem Dutt, silberner Haarspange, eisblauem langärmeligem Kleid mit lavendelfarbenem Rock, naturfarbenen Strumpfhosen und weißen Schlittschuhen mit schmalen Stahlkufen. Freundlicher, plastisch gemalter Illustrationsstil. Gleiche Identität, Körperproportionen und Beleuchtung in allen Feldern. Vollständige Figuren mit sicheren Rändern vor transparentem Hintergrund, keine Beschriftung oder Hintergrundszene.

Die drei Bewegungsbriefe ergänzen diese Vorgaben: sechzehn flache Abstoß- und Gleitphasen nach rechts mit gleichbleibender Schulterperspektive; sechzehn Winkelansichten einer aufrechten Einbein-Pirouette in Schritten von 22,5 Grad; sechzehn Phasen einer Arabesque mit stabilem Stützbein und lang nach hinten gestrecktem freien Bein. Das Gleitfiguren-Atlas wurde zusätzlich freigestellt, um Hintergrund und Raster zu entfernen. Die PNG-Originale wurden ohne Änderung der Pose oder des Rasteraufbaus in WebP übertragen.

## Schnittstelle

Der bestehende Name `JimmyChatAvatar` bleibt für bisherige Einbindungen erhalten; `UniversalChatAvatar` ist derselbe Einstieg. Die Standardinstanz bietet zusätzlich `spin()` und `walkTo(x, {style:'spiral'})`. Die übliche Script-Adresse bleibt `avatar.js`.
