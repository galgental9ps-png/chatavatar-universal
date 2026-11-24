# Skelly · Melbourne-Shuffle-Skelett

Skelly ist ein kindliches, freundliches Cartoon-Skelett mit großen warmbraunen Augen, rundem Schädel, kleinem Grinsen und Sonnenbrille auf dem Kopf. Die Sneaker sind in Türkis, Magenta und Limette gehalten. Alle vier transparenten PNGs wurden mit der integrierten Bildgenerierung erstellt und als unveränderte Quellen ins Projekt übernommen.

| Datei | Raster und Größe | Vollständig gezeichnete Posen |
| --- | --- | --- |
| `assets/skelly-shuffle-v1.png` | 4×8, 887×1774 Pixel | 0–15 Running Man, 16–23 T-Step, 24–31 Slide/Glide |
| `assets/skelly-tricks-v1.png` | 4×8, 887×1774 Pixel | 0–7 voller Spin, 8–15 Kicks, 16–23 Idle-Groove, 24–31 Gesten |
| `assets/skelly-running-v2.png` | 4×4, 1254×1254 Pixel | 16 größere Running-Man-Phasen mit gegensinnigem Bein- und Armschwung |
| `assets/skelly-moves-v1.png` | 4×8, 887×1774 Pixel | 0–7 Spin mit offenen Armen, 8–15 Heel-Toe, 16–23 Hand-Groove, 24–31 Charleston |

Die 112 Posen zeigen jeweils eine vollständige Figur. Es werden keine Arme, Schultern, Beine oder Knochen zusammengesetzt. Eine einzige, feste Größenreferenz pro Atlas erhält dieselbe Körpergröße; eine Kniebeuge wird nicht auf die Höhe einer Standpose vergrößert. Die Sneaker bleiben an einer gemeinsamen Bodenlinie. Schwache Freistellungsreste werden wie bei den vorhandenen Figuren einmalig beim Laden entfernt. Der Canvas wird direkt in der tatsächlichen Gerätepixeldichte gezeichnet.

`shuffle-core.js` verwendet einen festen Tanzpuls von 120 BPM. Das ist ein eigener Animationstakt, keine Analyse oder Synchronisierung der MP3s. Running Man bleibt zunächst am selben Bildschirmort, verschiebt sich dann maximal 0,28 Figurenbreiten zur Seite und kehrt wieder zurück. Die vollständige Folge kombiniert kleine Running-Man-Seitenwege, Heel-Toe, Charleston, T-Steps, Slides, Kicks und Hand-Grooves. Fünf vollständige Drehungen mit geschlossenen und offenen Armen verteilen sich über die Folge. Spins durchlaufen tatsächliche Vorder-, Seiten- und Rückenansichten in einer Richtung, ohne links/rechts zu pendeln. Die Schritte laufen aus verstrichener Zeit statt aus der Anzahl gezeichneter Browserframes. Die ursprüngliche erste Folge bleibt mit ihren bisherigen PNG-Posen, 20 Sekunden Dauer und derselben Reihenfolge erhalten. Die zusätzliche Folge „Shuffle-Mix · Folge 2“ dauert 26 Sekunden und verwendet die neuen Bewegungen. Automatisch wechseln beide Folgen ab. Lesefenster, Ziehen, Pause, reduzierte Bewegung und Figurenwechsel unterbrechen die Folge; ein versteckter Tab hält ihre Uhr an.

## Auswahl und Steuerung

Die Voreinstellung lautet in `asset-sets.js`:

```js
const ACTIVE_ASSET_SET = 'shuffle-skeleton';
```

Alle bisherigen Figuren bleiben im Schalter erhalten. Ohne Seitenwechsel tauscht `await JimmyChatAvatar.instance.setAsset('shuffle-skeleton')` die Figur aus und behält Wissensdaten, aktuelle Antwort sowie die Benutzereinstellungen.

```js
const avatar = JimmyChatAvatar.instance;
avatar.perform();                 // erste Folge unverändert
avatar.perform('freestyle');      // zusätzliche Folge mit neuen Moves
avatar.perform('running-man');    // auf der Stelle
avatar.perform('t-step');         // seitlich und zurück
avatar.perform('slides');         // seitlicher Glide
avatar.spin();                    // ganze Spins
avatar.hop();                     // rhythmische Kicks
avatar.perform('heeltoe');        // Heel-Toe-Twist
avatar.perform('charleston');     // Charleston
avatar.perform('hands');          // Hand- und Arm-Groove
avatar.walkTo(180);               // mit Slides zu einer Position
```

## Verwendete Bildvorgaben

Hauptatlas: scharfes, sauberes 2D-Cartoon-Skelett mit weichen elfenbeinfarbenen Knochen und cyan-magenta-limettenfarbenen Sneakern. 32 vollständige Posen im exakten Raster aus vier Spalten und acht Reihen vor echtem Alphahintergrund. 16 aufeinanderfolgende Running-Man-Phasen mit abwechselndem Knieheben, aufsetzendem Fuß und rückwärts gleitendem Standfuß, acht Heel-Toe-T-Steps und acht Side-Slide-Phasen. Ruhige Schulterperspektive, leicht gegenläufige Arme, gleichbleibender Maßstab und Bodenlinie. Keine abgetrennten Körperteile, Schatten, Bühne, Texte, Rasterlinien oder Bewegungsschlieren.

Zusatzatlas: exakt dieselbe Figur und Darstellung. Acht echte Winkelansichten eines vollständigen 360-Grad-Spins: vorne, vorne rechts, rechts, hinten rechts, hinten, hinten links, links, vorne links. Danach acht Kick- und Erholungsphasen, acht leichte Groove-Phasen und acht Gesten: Stehen, Winken, Sprechen, Zeigen, Nachdenken, Gehaltenwerden, Jubeln und Verbeugung. Rückansichten haben keine Gesichtszüge auf dem Hinterkopf.

Gesichtsüberarbeitung beider Atlanten: ausschließlich Kopf und Gesicht an die kindlichere Identität anpassen. Rundlicher freundlicher Cartoon-Schädel, große warme bernsteinbraune Augen mit Pupillen und Lichtreflexen, kleine dreieckige Nase, verspieltes Lächeln mit wenigen breiten runden Zähnen. Sonnenbrille auf die Stirn schieben, damit die Augen sichtbar bleiben. Keine bedrohlichen leeren Augenhöhlen. Kopfgröße, alle Körperposen, Sneaker, Proportionen, Raster und Transparenz erhalten. Der überarbeitete Hauptatlas dient als Identitätsreferenz für die Gesichter und korrekten Seiten- und Rückenansichten im Zusatzatlas.

Zusätzliche Bildvorgaben: eigene quadratische 4×4-Bildfolge nur für Running Man mit hoher Kniehaltung, vorn aufsetzendem und rückwärts gleitendem Schuh sowie echtem Wechsel des Standbeins. Der zweite Halbzyklus wurde gezielt für das andere Bein und gegenläufige Arme neu gezeichnet; die Kopf- und Schulterperspektive bleibt erhalten. Die Laufzeitzuordnung verwendet die passenden Übergangsposen und zeigt keine zusätzliche Wiederholung des falschen Beins. Eine weitere 4×8-PNG liefert einen vollständigen Spin mit geöffneten Armen, acht Heel-Toe-Twist-Phasen, acht Hand- und Armwellen und acht Charleston-Phasen. Identität, warme Augen, Sonnenbrille auf dem Kopf, Sneaker, Maßstab und echte Transparenz bleiben die Vorgaben.
