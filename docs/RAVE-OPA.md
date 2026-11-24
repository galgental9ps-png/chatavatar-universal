# Rave-Opa · Hard-Techno-Asset

Ein eigenständiges sechstes Figurenset: stockiger alter Mann mit kurzem silberweißem Haar, weißem Schnurrbart, buschigen Augenbrauen, schwarzer rechteckiger Brille und ruhigem ernstem Gesicht. Er trägt eine orangefarbene Trainingsjacke mit hellen Streifen, eine petrolblaue Steppweste, eine dunkelblaue weite Trainingshose und sehr große grauweiße Sneaker mit Orange- und Limettenakzenten. Alle Figuren wurden mit der integrierten Bildgenerierung erstellt und als PNG-Quellen im Repository gespeichert.

| Aktive Datei | Quelldimensionen | Inhalt |
| --- | --- | --- |
| `assets/rave-opa-master-v2.png` | 1024×1536 Pixel, RGBA | 96 vollständige Figuren in zwölf Zeilen mit je acht Posen |
| `assets/rave-opa-warehouse-v1.png` | 2172×724 Pixel | Leere anthrazitfarbene Warehouse-Halle mit Orange-/Limettenlicht |

Alle Moves wurden gemeinsam neu gezeichnet und stehen in **einer** PNG. Es gibt keine aktiven Zusatzatlanten mehr. Running Man, T-Steps, Slides, zwei volle Drehvarianten, Kicks, Groove, Gesprächsgesten, Heel-Toe, Techno-Arm-Moves und Charleston verwenden dieselbe Bildquelle. Die bisherigen vier Action-PNGs bleiben als frühere Quellen archiviert und werden vom Rave-Opa nicht mehr geladen.

| Quellindizes | Bewegung |
| --- | --- |
| 0–15 | Frontaler Running Man mit beiden Beinen |
| 16–23 | T-Steps |
| 24–31 | Slides |
| 32–39 | Vollständige Drehung mit angewinkelten Armen |
| 40–47 | Kicks |
| 48–55 | Ruhiger Groove |
| 56–63 | Stand, Winken, Sprechen, Zeigen, Denken, Gehaltenwerden, Jubel, Verbeugung |
| 64–71 | Vollständige Drehung mit offenen Armen |
| 72–79 | Heel-Toe |
| 80–87 | Techno-Arm-Moves |
| 88–95 | Charleston |

Jede Pose ist eine vollständig gezeichnete Figur. Arme, Schultern und Beine werden nicht aus Teilen zusammengesetzt. Pirouetten verwenden echte Vorder-, Seiten- und Rückenansichten. Die vorhandenen Choreografien wählen über `selectionSheets` die zweite Drehvariante innerhalb derselben Master-PNG aus, ohne eine andere Bilddatei zu laden.

Die gemalte Anordnung hat leicht ungleichmäßige Abstände. Deshalb beschreibt `cellRects` die tatsächlichen Quellrechtecke der 96 ganzen Figuren, statt Köpfe oder ausgestreckte Hände an gedachten Rastergrenzen abzuschneiden. Die Rechtecke wurden durch reine Auswertung der Alpha-Maske vermessen; die erzeugte PNG bleibt unverändert. `mascot.js` richtet alle Posen an der Schuhlinie aus und verwendet **eine feste Größenreferenz** für den gesamten Master. Eine Hocke wird nicht zur Standhöhe aufgeblasen. Schwache Freistellungsreste werden beim Laden einmalig entfernt. Die frei bewegte Figur bleibt 192 Pixel auf dem Desktop und 160 Pixel mobil; die Renderauflösung folgt der Gerätepixeldichte. Die Datei wird in ihrer tatsächlichen Auflösung verwendet, ohne sie nachträglich als 2K- oder 4K-Quelle auszugeben.

## Bewegung und Auswahl

`asset-sets.js` aktiviert den Opa mit `ACTIVE_ASSET_SET = 'rave-grandpa'`. Alle anderen Figuren bleiben im Schalter erhalten. `await JimmyChatAvatar.instance.setAsset('rave-grandpa')` wechselt ohne neue Wissensdaten und ohne zusätzliche Figuren auf der Seite.

`perform()` startet „Hard-Techno tanzen“, `perform('freestyle')` den zweiten Rave-Mix. Beide Folgen wechseln automatisch ab. Einzelne Knöpfe starten Running Man, Spins, T-Steps, Kicks, Slides, Heel-Toe, Charleston und Hand-Groove. „Mitfeiern!“ startet den Rave-Mix mit einem eigenen Opa-Spruch.

Der Opa verwendet 144 BPM als eigenen Animationstakt, keine Audioanalyse der MP3. Running Man und seitliche Wege werden zeitbasiert mit leichtem Beschleunigen und Auslaufen berechnet. Die erste Folge enthält vier vollständige Drehungen, die zweite fünf. Skelly behält seinen Takt von 120 BPM und seine beiden freigegebenen Folgen. Antwortenlesen, Pause, reduzierte Bewegung, Ziehen, Tabwechsel und Assetwechsel behalten die bestehenden Unterbrechungsregeln.

Die Schritte betonen den Takt mit einer sanften zeitlichen Akzentuierung: Beim Running Man setzt der Schuh auf jedem Beat auf, das Knie hebt sich dazwischen. Die bestehenden ganzen Posen verweilen kurz im Akzent und wechseln anschließend etwas zügiger weiter. Eine Gewichtsverlagerung von höchstens 0,65 Grad um die Schuhlinie unterstützt den Groove ohne Größenänderung oder zusätzlichen Sprung. Die Drehungen laufen weiterhin gleichmäßig und ohne seitliches Wippen; Tempo, Weg und Länge beider Folgen bleiben erhalten. Auch die ruhigen Groove-Posen zwischen den Folgen folgen dem Opa-Takt.

Die Seite wechselt zu Anthrazit, Orange und Limette, einschließlich der Sprechfenster. Das Warehouse-Bild enthält keinen zweiten Avatar und reicht mit seiner Tanzfläche bis zu allen Rändern. Als Starttitel ist wie bei Skelly „Hoffnungsvoll“ ausgewählt; die komplette vorhandene Drei-Lieder-Playlist bleibt verfügbar.

## Verwendete Bildvorgaben

Der aktive Master wurde mit der integrierten Bildgenerierung erzeugt. Identitätsreferenz war `assets/rave-opa-running-v1.png`; anschließend wurde die gemeinsame Tafel im selben Verfahren überarbeitet. Die überarbeitete Gesamttafel ist die aktive Quelldatei; es gibt keine nachträgliche Bildmontage.

**Gemeinsamer Master:** Eine einzige transparente PNG mit genau acht Spalten und zwölf Reihen, 96 vollständigen Figuren. Derselbe ernst blickende stockige Rave-Opa mit silberweißem Haar, weißem Schnurrbart, schwarzer rechteckiger Brille, orangefarbener Trainingsjacke mit hellen Ärmelstreifen, petrolblauer Steppweste, dunkelblauer weiter Hose und sehr großen grauweißen Sneakern mit dezenten Orange-/Limettenakzenten. Über alle Posen gleiches Gesicht, gleiche Anatomie, Farben, Beleuchtung und Kameradistanz. Scharfer plastischer Cartoon-Stil, transparente Außenbereiche, keine Szene, Beschriftung, Bodenschatten, Bewegungsgeister oder separaten Körperteile.

**Bewegungsreihen:** Zwei Reihen mit 16 aufeinanderfolgenden Frontalphasen des Running Man und wechselndem Standbein; danach je acht T-Steps, Slides, tatsächliche 360-Grad-Drehansichten mit angewinkelten Armen, wechselseitige Kicks, kleine Knie-/Schulter-Grooves, Interaktionsgesten, 360-Grad-Drehansichten mit geöffneten Armen, Heel-Toe-Schritte, diagonale Techno-Arm-Pumps mit Öffnen/Kreuzen/Vorwärtsdrücken und Charleston-Schritte. Beide Drehreihen verlaufen von vorne über rechte Seite und Rücken zur linken Seite und zurück. Rückansichten zeigen Hinterkopf und Westenrücken.

**Überarbeitung:** Alle 96 Aktionen, Identität und Reihenfolge erhalten; sichere freie Ränder für Haare, Finger und Sneaker, einheitlichen anatomischen Maßstab, saubere Transparenz und klare Konturen anstreben. Der Größenwunsch im Erzeugungsbrief war 2048×3072 Pixel; das tatsächlich gelieferte und verwendete Bild hat 1024×1536 Pixel. Die Quelle wird nicht künstlich hochskaliert. Unregelmäßige Bildabstände werden über die Quellrechtecke im Code berücksichtigt.
