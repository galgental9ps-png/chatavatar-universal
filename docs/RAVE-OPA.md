# Rave-Opa · Hard-Techno-Asset

Ein eigenständiges sechstes Figurenset: stockiger alter Mann mit kurzem silberweißem Haar, weißem Schnurrbart, buschigen Augenbrauen, schwarzer rechteckiger Brille und ruhigem ernstem Gesicht. Er trägt eine orangefarbene Trainingsjacke mit hellen Streifen, eine petrolblaue Steppweste, eine dunkelblaue weite Trainingshose und sehr große grauweiße Sneaker mit Orange- und Limettenakzenten. Alle Figuren wurden mit der integrierten Bildgenerierung erstellt und als PNG-Quellen im Repository gespeichert.

| Datei | Raster, Quelldimensionen | Posen |
| --- | --- | --- |
| `assets/rave-opa-shuffle-v1.png` | 4×8, 887×1774 Pixel | 16 Running-Man-Phasen, 8 T-Step- und 8 Slide-Phasen |
| `assets/rave-opa-tricks-v1.png` | 4×8, 887×1774 Pixel | 8 geschlossene Drehansichten, 8 Kick-Phasen, 8 Groove- und 8 Gestenposen |
| `assets/rave-opa-running-v1.png` | 2×4, 887×1774 Pixel | 8 größere frontale Running-Man-Schlüsselposen mit wechselndem Standbein |
| `assets/rave-opa-moves-v1.png` | 4×8, 887×1774 Pixel | 8 Drehansichten mit offenen Armen, 8 Heel-Toe-, 8 Techno-Arm- und 8 Charleston-Posen |
| `assets/rave-opa-warehouse-v1.png` | Panorama, 2172×724 Pixel | Leere anthrazitfarbene Warehouse-Halle mit Orange-/Limettenlicht |

Die vier Action-PNGs enthalten zusammen 104 vollständig gezeichnete Figuren. Arme, Schultern und Beine werden nicht aus Teilen zusammengesetzt. Die größere Frontalfolge wird für die tatsächlichen Running-Man-Abschnitte und die scharfe große Vorschau verwendet. Ein falschseitiges frontales Zwischenbild wird als vollständige Figur reflektiert, damit das Standbein korrekt wechselt; die allgemeine Kamerarichtung bleibt frontal. Pirouetten verwenden echte Vorder-, Seiten- und Rückenansichten in einer Richtung, ohne flache Papierdrehung oder rechts/links zu pendeln.

Dreh- und Armtafeln wurden zusätzlich mit sicheren Rändern neu gezeichnet. Jede Pose bleibt innerhalb ihres Feldes, einschließlich Finger, Haare und Sneaker. Pro Atlas wird eine feste anatomische Größenreferenz verwendet; Kniebeugen werden nicht zur Standhöhe aufgeblasen. Schwache Freistellungsreste werden beim Laden einmalig entfernt. Die frei bewegte Figur bleibt 192 Pixel auf dem Desktop und 160 Pixel mobil; die Renderauflösung folgt der Gerätepixeldichte.

## Bewegung und Auswahl

`asset-sets.js` aktiviert den Opa mit `ACTIVE_ASSET_SET = 'rave-grandpa'`. Alle anderen Figuren bleiben im Schalter erhalten. `await JimmyChatAvatar.instance.setAsset('rave-grandpa')` wechselt ohne neue Wissensdaten und ohne zusätzliche Figuren auf der Seite.

`perform()` startet „Hard-Techno tanzen“, `perform('freestyle')` den zweiten Rave-Mix. Beide Folgen wechseln automatisch ab. Einzelne Knöpfe starten Running Man, Spins, T-Steps, Kicks, Slides, Heel-Toe, Charleston und Hand-Groove. „Mitfeiern!“ startet den Rave-Mix mit einem eigenen Opa-Spruch.

Der Opa verwendet 144 BPM als eigenen Animationstakt, keine Audioanalyse der MP3. Running Man und seitliche Wege werden zeitbasiert mit leichtem Beschleunigen und Auslaufen berechnet. Die erste Folge enthält vier vollständige Drehungen, die zweite fünf. Skelly behält seinen Takt von 120 BPM und seine beiden freigegebenen Folgen. Antwortenlesen, Pause, reduzierte Bewegung, Ziehen, Tabwechsel und Assetwechsel behalten die bestehenden Unterbrechungsregeln.

Die Seite wechselt zu Anthrazit, Orange und Limette, einschließlich der Sprechfenster. Das Warehouse-Bild enthält keinen zweiten Avatar und reicht mit seiner Tanzfläche bis zu allen Rändern. Als Starttitel ist wie bei Skelly „Hoffnungsvoll“ ausgewählt; die komplette vorhandene Drei-Lieder-Playlist bleibt verfügbar.

## Verwendete Bildvorgaben

**Identität und Hauptatlas:** derselbe ernst blickende, liebenswerte ältere Mann mit weißem Schnurrbart, schwarzer Brille, orangefarbener Trainingsjacke, blauer Steppweste, dunkelblauer Hose und übergroßen grauweißen Sneakern. Scharfer, plastischer 3D-Cartoon-Stil. 32 ganze Figuren im gleichmäßigen Raster aus vier Spalten und acht Reihen: 16 Running-Man-Phasen mit hohem Knie, vorn aufsetzendem und zurückgleitendem Schuh, acht Heel-Toe-T-Steps und acht seitliche Gleitphasen. Unveränderte Identität, Kleidung, Körpergröße, Beleuchtung und Bodenlinie; echte Transparenz ohne Schrift, Szene, Raster, Schatten oder Bewegungsgeister.

**Trickatlas:** dieselbe Figur in acht tatsächlichen Winkeln einer vollständigen Drehung mit locker angewinkelten Armen: vorne, vorne rechts, rechts, hinten rechts, hinten, hinten links, links, vorne links. Danach acht wechselseitige Kick- und Erholungsphasen, acht ruhige Knie-/Schulter-Grooves sowie acht Gesten: Stehen, Winken, Sprechen, Zeigen, Nachdenken, sanftes Gehaltenwerden, Jubeln und Verbeugung. Der Hinterkopf und die Rückseite der Weste haben keine vorn aufgemalten Gesichtszüge.

**Große Running-Man-Folge:** acht deutlich verschiedene frontale ganze Figuren in zwei Spalten und vier Reihen. Erste Hälfte: linkes Knie auf Bildseite hoch, der Schuh senkt sich nach vorn und setzt auf, der Standfuß gleitet zurück. Zweite Hälfte: die Beine wechseln mit sichtbar angehobenem Knie auf der anderen Bildseite und gegenläufigen Armen. Frontaler Kopf, symmetrische Brille und Schultern, konstante Kameraperspektive, feste Körpergröße und vollständig sichtbare Schuhe.

**Zusatzmoves:** acht volle Drehansichten mit geöffneten Armen, acht Heel-Toe-/Shuffle-Twist-Phasen, acht kraftvolle Techno-Hand-/Armphasen mit diagonalem Pumpen, Öffnen, Kreuzen und Vorwärtsdrücken sowie acht Charleston-/Kick-Step-Phasen. Derselbe Opa mit unverändert ernstem Gesicht. Dreh- und Armtafeln zusätzlich mit gleichmäßig vergrößerten freien Rändern innerhalb jedes Feldes neu zeichnen, sämtliche Finger und Sneaker vollständig erhalten und an den Nachbarfeldern keine Figurenteile abschneiden.
