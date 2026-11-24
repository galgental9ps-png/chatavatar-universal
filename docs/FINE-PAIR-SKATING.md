# Lina & Elio · feiner Paarlauf

Neues Set `ice-pair-fine`, aktiv über `ACTIVE_ASSET_SET` in `asset-sets.js`. Lina ist blond, Elio blond-rot. Der reduzierte Stil verwendet Perlmutt, Flieder und Taubenblau. Aurora & Noel, Lumi und Jimmy bleiben auswählbar.

## Vier eigene Action-PNGs

| Datei | Inhalt |
| --- | --- |
| `assets/lina-action-v1.png` | Lina: Begrüßung, Gleiten, Drehen, Absprung und Landung |
| `assets/elio-action-v1.png` | Elio: Begrüßung, Gleiten, Drehen, Absprung, Landung und Gleitfigur |
| `assets/lina-encore-v1.png` | Identische Lina: 16 Drehansichten, acht Tanzschritte, Ausstieg und Knicks |
| `assets/elio-encore-v1.png` | Identischer Elio: 16 umlaufende Tanzansichten, acht synchrone Schritte und Ruheposen |

Jede PNG hat 887 × 1774 Pixel, vier Spalten und acht Reihen mit 32 vollständigen Einzelpersonen. Keine PNG enthält ein zusammengesetztes Paar. Alle wurden mit der integrierten Bildgenerierung erzeugt. Die Vorlagen des ersten Entwurfs dienten bei den weiteren Aktionen als Identitätsreferenz. Die endgültigen Dateien sind direkte PNG-Ausgaben; der Browser entfernt beim Dekodieren schwache Freistellungsreste wie beim vorhandenen Lumi-Renderer.

Die Bildreihen des Elio-Masters sind ungleich hoch; `rowBounds` benennt ihre tatsächlichen Grenzen, damit keine Kufen abgeschnitten werden. Linas Master hat eine eigene Phasenzuordnung für Absprung und Landung. Der Renderer richtet Kopfmittelpunkt und Kufenlinie aus. Elio wird über passende aufrechte Referenzposen in Stand-, Gleit-, Dreh- und Sprunggruppe auf denselben anatomischen Maßstab abgestimmt. Innerhalb jeder Gruppe gilt ein fester Maßstab. Eine Hocke wird nicht auf Standhöhe vergrößert. Es werden immer vollständige Bildfelder gezeichnet, keine einzelnen Körperteile und keine überblendeten Doppelbilder. Haupt- und Zusatzbilder laden gemeinsam, werden zwischengespeichert und wechseln ohne Nachladen während der Folge.

## Zwei Folgen

**Paartanz vorführen**: bestehender gemeinsamer Paarlauf, feinere Gleitphasen, kleine synchrone Drehsprünge mit gedämpfter Flugkurve und weicher Landung. Das Auseinandergleiten bleibt auf gleichbleibender Höhe. Das neue Profil begrenzt Sprünge auf 28 % der logischen Figurenhöhe und die Kantenneigung auf 1,1 Grad.

**Pirouetten & Umkreisen** / `JimmyChatAvatar.instance.encore()`: sanft zur Mitte, Lina dreht drei Pirouetten stationär, Elio fährt zwei ovale Tanzrunden um sie. Auf der hinteren Hälfte wird er hinter Lina gezeichnet; auf der vorderen davor. Nach dem Umkreisen bleibt Lina an ihrem Pirouettenplatz, während Elio mit vollständigen, streckenabhängigen Gleitposen zu ihr zurückkehrt. Erst dann beginnen beide den gemeinsamen Gleitabschnitt von dieser neuen Formation aus und schließen nebeneinander ab. Auf extrem schmalen Flächen wird die Formation in den sichtbaren Bereich verschoben; dabei nutzt auch Lina ihre Gleitposen. Elio steht beim abschließenden Knicks von Lina ruhig dabei. Der gemeinsame Zeitgeber steuert beide unabhängigen Tänzer und ihre unterschiedlichen Bildphasen.

Die Kufenlinie bleibt bei Eintritt, Umkreisen, Rückkehr, Weitergleiten und Abschluss durchgehend auf derselben Höhe. Für Elios vordere Hälfte der ovalen Bahn ist unterhalb dieser Linie Platz reserviert; beide Tänzer müssen nach dem Kreis nicht mehr gemeinsam nach unten sinken. Die linke Hälfte seiner axialen Drehungen verwendet passende vollständige, gespiegelte Körperansichten. Dadurch schließt jede Umdrehung einschließlich Rücken- und linker Seitenansicht, statt zwischen zwei rechten Ansichten zurückzupendeln.

Die automatischen Auftritte wechseln bei diesem Set zwischen beiden Folgen. Pause, Lesen, Ziehen, reduzierte Bewegung und Asset-Wechsel beenden sie kontrolliert; ein versteckter Tab hält die Zeit an. Beide Figuren bleiben eigenständige Avatare. Die anderen Sets behalten ihre bisherigen Bewegungsprofile.

## Bildvorgaben

Die folgenden endgültigen Vorgaben wurden mit der integrierten Bildgenerierung verwendet, mit `transparent_background: true`. Hauptfolge und Zusatzfolge verwenden jeweils die zuvor gezeichnete Person als Referenz, damit Frisur, Gesicht, Kostüm und Proportionen zusammenpassen.

### Hauptfolge · jeweils Lina und Elio

Use case: identity-preserve.
Production correction of the supplied sprite atlas. Preserve this EXACT character identity, face, hair color, costume colors, minimalist costume, body proportions and crisp 3D illustration style. Re-layout as EXACTLY 4 columns x 8 rows (32 SQUARE cells) on a portrait PNG with width:height exactly 1:2. Keep all 32 full people completely inside their individual cell with no touching or overlapping neighboring cells.
Remove ALL existing background haze, mist, cream paper and stray colored pixels. Empty space MUST be genuinely fully transparent alpha=0, with clean anti-aliased edges only at the character. No shadow, floor, ice, scene or fake checkerboard. No low-opacity veil across the canvas.
One complete single person per cell. SAME camera and anatomical scale throughout: upright hair top 12% of cell and blade baseline 92%; bent poses get LOWER, never larger. Thin detailed blades and complete hands/feet. Consistent body center. Safe margins including above head/below blades. High native detail and pin-sharp eyes. No blur/glow, no logos/text.

Create this action order:
Row1 cells0-3: relaxed upright front-right stance, gentle small wave, open arms softly, small bow.
Rows2-3 cells4-11: eight CLOSE sequential phases of one subtle push-and-glide cycle RIGHTWARD. Same 3/4 shoulder perspective throughout. Modest knee bend, modest leg extension, soft narrow arm sweep, return to ready-to-gather stance. No shoulder mirroring or exaggerated lunges.
Rows4-5 cells12-19: eight consecutive 45-degree views of one compact UPRIGHT 360-degree axial pirouette. Clearly show side AND rear views; soft gathered arms, free skate near ankle, same body scale and blade baseline. Not eight repeated front views, not rotation of a flat cutout.
Row6 cells20-23: gentle takeoff preparation: small balanced knee bend, half extension, 3/4 extension, compact upright takeoff. Adjacent postures connect smoothly.
Row7 cells24-27: compact rotation exit, softly opening arms and free skate, absorb landing on bent knee, graceful upright exit glide.
Row8 cells28-31: prepared one-leg glide, lift free leg a little behind, delicate low arabesque, lower the leg smoothly. Moderate extension with full leg inside square.
Exactly 32 drawings. This corrects the overcrowded old 48-frame atlas into a sharp clean 32-frame master. Keep the reference person identical.

### Zusatzfolge · Lina

Use case: identity-preserve.
Production correction of the supplied sprite atlas. Preserve this EXACT character identity, face, hair color, costume colors, minimalist costume, body proportions and crisp 3D illustration style. Re-layout as EXACTLY 4 columns x 8 rows (32 SQUARE cells) on a portrait PNG with width:height exactly 1:2. Keep all 32 full people completely inside their individual cell with no touching or overlapping neighboring cells.
Remove ALL existing background haze, mist, cream paper and stray colored pixels. Empty space MUST be genuinely fully transparent alpha=0, with clean anti-aliased edges only at the character. No shadow, floor, ice, scene or fake checkerboard. No low-opacity veil across the canvas.
One complete single person per cell. SAME camera and anatomical scale throughout: upright hair top 12% of cell and blade baseline 92%; bent poses get LOWER, never larger. Thin detailed blades and complete hands/feet. Consistent body center. Safe margins including above head/below blades. High native detail and pin-sharp eyes. No blur/glow, no logos/text.

This is a SECOND, ADDITIONAL action atlas for the EXACT SAME blonde woman, with DIFFERENT actions. Same pearl-lilac dress, small blonde bun and white skates. Preserve her exact identity and costume.
Rows1-4 cells0-15: SIXTEEN adjacent views at 22.5-degree increments of a single compact UPRIGHT pirouette on one spot, starting front-right, through right/profile, full back, left/profile, front and back to front-right. Small softly gathered arms, free skate lightly crossed near ankle. Beautiful delicate continuous rotation with consistent height, anatomy and relaxed face. Clear rear views, not repeated front views. The site repeats this turn several times.
Rows5-6 cells16-23: eight connected synchronous ice-dance steps and small chassés, soft arms opening and closing just a little, compact controlled knees, ending on an upright forward glide. Delicate and elegant, no big jump.
Row7 cells24-27: settle out of pirouette: compact closed stance, gently open forearms, lower forearms to the sides, upright poised presentation.
Row8 cells28-31: prepare a small curtsy, modest graceful curtsy, rise halfway, relaxed upright standing front-right with arms lowered. Cell31 should match the reference relaxed standing pose closely.
Exactly32 single-woman drawings; no man anywhere. Genuinely clear fully transparent empty space, NO cream backdrop or mist.

### Zusatzfolge · Elio

Use case: identity-preserve.
Production correction of the supplied sprite atlas. Preserve this EXACT character identity, face, hair color, costume colors, minimalist costume, body proportions and crisp 3D illustration style. Re-layout as EXACTLY 4 columns x 8 rows (32 SQUARE cells) on a portrait PNG with width:height exactly 1:2. Keep all 32 full people completely inside their individual cell with no touching or overlapping neighboring cells.
Remove ALL existing background haze, mist, cream paper and stray colored pixels. Empty space MUST be genuinely fully transparent alpha=0, with clean anti-aliased edges only at the character. No shadow, floor, ice, scene or fake checkerboard. No low-opacity veil across the canvas.
One complete single person per cell. SAME camera and anatomical scale throughout: upright hair top 12% of cell and blade baseline 92%; bent poses get LOWER, never larger. Thin detailed blades and complete hands/feet. Consistent body center. Safe margins including above head/below blades. High native detail and pin-sharp eyes. No blur/glow, no logos/text.

This is a SECOND, ADDITIONAL action atlas for the EXACT SAME blond-red / strawberry-blonde man, with DIFFERENT actions. Same dove-blue top, slate-lilac piping and slate-blue trousers, black skates. Preserve his exact identity and costume. He will dance an oval path around his female partner, but ONLY THE MAN appears in this PNG.
Rows1-4 cells0-15: SIXTEEN close sequential poses of one elegant traveling CIRCULAR skating step sequence. Progress through all camera-relative orientations around a circle (front-right, right/profile, back-right, back, back-left, left/profile, front-left, front, returning to front-right) with fine small alternating skate pushes and gentle arm gestures at waist height. His shoulder orientation turns smoothly, his weight subtly changes from one skate to the other. He does not spin frozen in place, and he does not leap. Keep whole person centered in each cell; WEBSITE MOVES HIM IN A CIRCLE. Same baseline. Clear back views and identical warm LIGHT copper/strawberry-blonde hair in every view.
Rows5-6 cells16-23: eight connected synchronous ice-dance steps and small chassés with the same phase timing as the woman: softly opening/closing arms, compact knees, end upright forward glide. No big jump.
Row7 cells24-27: gently reduce the step, bring feet together, lower forearms, upright poised presentation.
Row8 cells28-31: small bow preparation, modest bow, rise halfway, relaxed upright standing front-right with arms lowered. Cell31 closely matches reference relaxed standing pose. He rests beside his partner at the end.
Exactly32 single-man drawings; no woman anywhere. Genuine clear fully transparent empty space, no floor or background.

### Transparente Ränder

Use case: background-extraction.
Remove ONLY the entire background from this exact 32-pose character atlas. Produce a clean TRUE TRANSPARENT PNG CUTOUT: every pixel outside the complete person in each cell must have ALPHA ZERO. Delete the white / cream haze and ALL faint gray smears, halos, stray colored dots and translucent veil. Transparent means invisible empty space, NOT white, gray, paper, mist, or checkerboard.
Preserve all 32 people EXACTLY in their original locations and poses, with their exact face, blonde / strawberry-blonde hair, soft minimalist costume colors, fabric and crisp full-body details. Same 887 x 1774 portrait layout with four columns and eight rows. No rearranging, no new poses, no change to proportions, no blur, no glow. Preserve hands, hair details, pale costumes and the full skate blades. Do not leave shadows or ice. Remove background only; show isolated clean people on genuinely transparent empty space.

