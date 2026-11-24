# Aurora & Noel · zwei eigene Action-PNGs

Die aktive Fassung verwendet ausschließlich zwei neu gezeichnete transparente Action-PNGs:

| Figur | Datei | Raster | Native Größe |
| --- | --- | --- | --- |
| Aurora, blonde Tänzerin im pink-violetten Glitzerkleid mit Türkisakzenten | `assets/aurora-action-v1.png` | 4 × 8, 32 vollständige Posen | 887 × 1774 Pixel |
| Noel, blond-roter Tänzer im blau-violetten Kristallkostüm | `assets/noel-action-v1.png` | 4 × 8, 32 vollständige Posen | 887 × 1774 Pixel |

Jedes quadratische Quellfeld ist rund 222 × 222 Pixel groß und enthält nur eine vollständige Person. Die Dateien werden unverändert und mit ihrem Alpha-Kanal veröffentlicht. Keine nachträgliche Hochskalierung oder künstliche 4K-Angabe. Die frühere gemeinsame Paar-PNG wird nicht mehr geladen.

## Darstellung und Ablauf

Beide Tänzer sind durchgehend zwei eigenständige Avatare mit eigenem Canvas und eigener bedienbarer Schaltfläche. Das gilt beim Stehen, gemeinsamen Gleiten, Auseinandergleiten, Drehen und Annähern. Es werden weder Hälften einer Paarzeichnung ausgeschnitten noch Körperteile zusammengesetzt. Auch nach dem Wiederannähern werden beide weiterhin aus ihren eigenen PNGs gezeichnet.

Ein gemeinsamer Takt steuert die Animationsphase, Sprunghöhe und Bewegung beider. Beim Auseinandergleiten laufen echte Abstoß- und Gleitposen auf gleichbleibender Kufenhöhe. Eine leichte Neigung um die Kufen begleitet die Bewegung. Vor der Pirouette richten sich beide über die vorhandenen ganzen Übergangsposen wieder auf. Die Bildschirmbewegung verwendet Zwischenpositionen statt ganzer Pixelschritte, damit langsames Gleiten weniger stockt. Beim Annähern blicken und gleiten sie aufeinander zu; Pirouetten werden zeitgleich abgespielt. Die getrennten Laufwege führen wieder in eine nahe Formation für gemeinsame Gleitfiguren. Die größere räumliche Trennung wird auf sehr schmalen Bildschirmen begrenzt. Jeder einzelne Avatar ist auf dem Desktop 192 Pixel und mobil 160 Pixel breit, bei sehr wenig Platz kleiner. Der anatomische Maßstab bleibt über die Posen fest; eine Hocke wird nicht auf Standhöhe vergrößert. Der Renderer zeichnet direkt in der Geräteauflösung.

`Paartanz vorführen` zeigt beide Abfolgen. `Synchronfolge vorführen`, `Aufeinander zuspringen` und `Synchrone Pirouetten` starten einzelne Varianten. Lesen, Ziehen, Pause, reduzierte Bewegung und Asset-Wechsel beenden die laufende Folge. Beide Avatare bleiben als ruhende Figuren getrennt erhalten; Ausblenden verbirgt beide. Ein ausgeblendeter Tab hält den gemeinsamen Takt an. Ein Wechsel zu Lumi oder Jimmy entfernt die zweite Darstellung.

Die Voreinstellung bleibt `const ACTIVE_ASSET_SET = 'ice-pair';`. Bildquellen und die gemeinsame Zuordnung stehen in `asset-sets.js` unter `master.actors` bzw. `master.frames`. Die weiße Winterlandschaft und die Musik werden durch diese Änderung nicht verändert.

## Gleich angeordnete Posen in beiden Dateien

| Zellen | Bewegung |
| --- | --- |
| 0–3 | Stehen, Winken, Präsentieren, Verbeugen |
| 4–11 | Acht fortlaufende Abstoß- und Gleitphasen |
| 12–19 | Acht aufrechte Drehansichten |
| 20–23 | Kniebeuge und Absprungstreckung |
| 24–27 | Öffnen, Landung und Ausgleiten |
| 28–31 | Vorbereitung, Anheben, Halten und Absenken der Arabesque |

## Bildvorgabe Aurora

Use case: stylized-concept.
Asset type: one native high-resolution transparent PNG action sprite atlas, for an animated figure skater on a website.
Create a genuinely NEW drawing, not a crop of a paired image. EXACTLY ONE complete ADULT PERSON per animation cell. No partner or second person anywhere.
IMPORTANT QUALITY AND GEOMETRY: portrait canvas, width:height exactly 1:2, ideally native 1920 x 3840 pixels or highest true native detail supported. EXACTLY 4 equal columns and 8 equal rows: 32 equally sized SQUARE cells, read left to right, top to bottom. This less dense layout gives each person much more real pixel detail. Very crisp eyes and facial features, clean contours, well-defined fingers, fine fabric and skate blade details. No blur, ghosting, soft-focus glow, pixel enlargement, tiny low-detail faces or motion-blurred silhouettes.
True transparent alpha in all empty space and gutters, no scenery, no ice, no floor, no cast shadow, no label, no line grid, no numbers or watermark. Keep each FULL person entirely inside their own cell with clear 6% or greater transparent side margins. No cell-to-cell spill. Fixed anatomical scale across ALL 32 poses; standing body from 12% to 92% cell height, skate blade baseline at exactly 92%, same head/torso dimensions in all frames. A crouch is LOWER, never enlarged. Lock the body center to 50% cell width. Lock camera scale, adult identity, outfit, lighting and rendering style. Arms, both hands, both legs and both skates remain complete in every frame.
Style: highly polished colorful 3D animated storybook character in the same friendly artistic family as a refined Lumi skating mascot, clearly adult, athletic and graceful, gently oversized expressive head, charming warm face, detailed eyes, sculptural fabric. Glamorous stage costume with dazzling fine crystals and iridescent sequins; rich saturated jewel tones, controlled elegant shimmer on the costume, no floating sparkles outside the body. Bright neutral studio lighting, crisp illustration, no dark tint.
Use this exact pose ORDER:
Cells 0–3 (row 1): 0 elegant upright relaxed skating stance toward front-right; 1 small friendly wave; 2 both arms elegantly opened in a dance presentation; 3 graceful small bow.
Cells 4–11 (rows 2 and 3): ONE continuous smooth 8-frame forward skating push-and-glide cycle to the RIGHT. Constant shoulder perspective. Lower flexed knees, strong controlled leg extension and soft arm swing, then recovery. Adjacent frames are close sequential motion phases, not unrelated poses. End by bringing arms and knees in, ready to gather for a jump. Keep the whole extended leg and hand within safe margins.
Cells 12–19 (rows 4 and 5): 8 consecutive 45-degree views of one UPRIGHT axial figure-skating rotation, from front-three-quarter, through right profile and back views, returning to front. Closed graceful arms, legs close together with free skate near ankle. The person remains vertically upright, not rolling or tilting the entire flat image. Same standing anatomical scale and blade baseline in all 8 views; website adds airborne height for a jump.
Cells 20–23 (row 6): four sequential takeoff phases: deep balanced knee bend with gathered arms, half extension, fuller extension, upright compact takeoff stance. Same center and source baseline.
Cells 24–27 (row 7): four sequential landing phases: closed upright rotation exit, open arms and reach free leg, softly absorb landing with bent knee, long elegant exit glide. No perspective or anatomical size change.
Cells 28–31 (row 8): four connected arabesque / spiral phases: upright prepared glide, gently lift free leg back, beautiful extended one-leg spiral with long free leg and open arms, gently lower free leg and return toward an upright glide. Stable identity and physique.
Constraints: exactly 32 complete single-person action images in the specified 4x8 grid, one identical performer per cell, absolutely no partner, duplicate silhouettes, detached body parts, joined bodies, ice patches, fake checkerboard background or lettering. Preserve genuine transparency and high native detail.
PERSON: Aurora, an elegant adult blonde woman with a bright golden-blonde high bun, delicate silver-and-turquoise crystal hair ornament, warm expressive hazel eyes and a friendly refined face. Athletic graceful adult proportions. A dazzling long-sleeved figure-skating dress: vivid fuchsia and magenta fading into electric turquoise and lavender accents, fine silver crystal embroidery, tasteful iridescent sequins, flowing short layered skirt, natural tights and pristine white skates with narrow detailed silver blades. Bright, colorful, glittering and artistic, coordinated with a male partner's royal-blue, violet and turquoise costume, but ONLY THIS WOMAN appears anywhere on this PNG.

## Bildvorgabe Noel

Use case: stylized-concept.
Asset type: one native high-resolution transparent PNG action sprite atlas, for an animated figure skater on a website.
Create a genuinely NEW drawing, not a crop of a paired image. EXACTLY ONE complete ADULT PERSON per animation cell. No partner or second person anywhere.
IMPORTANT QUALITY AND GEOMETRY: portrait canvas, width:height exactly 1:2, ideally native 1920 x 3840 pixels or highest true native detail supported. EXACTLY 4 equal columns and 8 equal rows: 32 equally sized SQUARE cells, read left to right, top to bottom. This less dense layout gives each person much more real pixel detail. Very crisp eyes and facial features, clean contours, well-defined fingers, fine fabric and skate blade details. No blur, ghosting, soft-focus glow, pixel enlargement, tiny low-detail faces or motion-blurred silhouettes.
True transparent alpha in all empty space and gutters, no scenery, no ice, no floor, no cast shadow, no label, no line grid, no numbers or watermark. Keep each FULL person entirely inside their own cell with clear 6% or greater transparent side margins. No cell-to-cell spill. Fixed anatomical scale across ALL 32 poses; standing body from 12% to 92% cell height, skate blade baseline at exactly 92%, same head/torso dimensions in all frames. A crouch is LOWER, never enlarged. Lock the body center to 50% cell width. Lock camera scale, adult identity, outfit, lighting and rendering style. Arms, both hands, both legs and both skates remain complete in every frame.
Style: highly polished colorful 3D animated storybook character in the same friendly artistic family as a refined Lumi skating mascot, clearly adult, athletic and graceful, gently oversized expressive head, charming warm face, detailed eyes, sculptural fabric. Glamorous stage costume with dazzling fine crystals and iridescent sequins; rich saturated jewel tones, controlled elegant shimmer on the costume, no floating sparkles outside the body. Bright neutral studio lighting, crisp illustration, no dark tint.
Use this exact pose ORDER:
Cells 0–3 (row 1): 0 elegant upright relaxed skating stance toward front-right; 1 small friendly wave; 2 both arms elegantly opened in a dance presentation; 3 graceful small bow.
Cells 4–11 (rows 2 and 3): ONE continuous smooth 8-frame forward skating push-and-glide cycle to the RIGHT. Constant shoulder perspective. Lower flexed knees, strong controlled leg extension and soft arm swing, then recovery. Adjacent frames are close sequential motion phases, not unrelated poses. End by bringing arms and knees in, ready to gather for a jump. Keep the whole extended leg and hand within safe margins.
Cells 12–19 (rows 4 and 5): 8 consecutive 45-degree views of one UPRIGHT axial figure-skating rotation, from front-three-quarter, through right profile and back views, returning to front. Closed graceful arms, legs close together with free skate near ankle. The person remains vertically upright, not rolling or tilting the entire flat image. Same standing anatomical scale and blade baseline in all 8 views; website adds airborne height for a jump.
Cells 20–23 (row 6): four sequential takeoff phases: deep balanced knee bend with gathered arms, half extension, fuller extension, upright compact takeoff stance. Same center and source baseline.
Cells 24–27 (row 7): four sequential landing phases: closed upright rotation exit, open arms and reach free leg, softly absorb landing with bent knee, long elegant exit glide. No perspective or anatomical size change.
Cells 28–31 (row 8): four connected arabesque / spiral phases: upright prepared glide, gently lift free leg back, beautiful extended one-leg spiral with long free leg and open arms, gently lower free leg and return toward an upright glide. Stable identity and physique.
Constraints: exactly 32 complete single-person action images in the specified 4x8 grid, one identical performer per cell, absolutely no partner, duplicate silhouettes, detached body parts, joined bodies, ice patches, fake checkerboard background or lettering. Preserve genuine transparency and high native detail.
PERSON: Noel, a handsome adult male figure skater, tidy dark-brown hair, expressive warm brown eyes and friendly refined face, athletic adult proportions. A glamorous tailored skating costume: rich royal-blue and vivid violet jacket/top with electric turquoise and magenta accents and precise silver crystal embroidery, tasteful iridescent sequins, slim deep royal-blue trousers, clean black figure skates with narrow detailed silver blades. Bright, colorful and glittering, coordinated with a blonde partner's fuchsia-turquoise skating dress, but ONLY THIS MAN appears anywhere on this PNG. Keep the same frame-by-frame action timing and illustration style described above.

## Blond-rote Haare nach Nutzerkorrektur

Use case: identity-preserve, precise-object-edit.
Edit ONLY the man's HAIR COLOR throughout this exact existing single-man action PNG atlas. His hair must be clearly STRAWBERRY BLONDE / BLOND-RED, warm light copper with golden-blonde highlights. Make this new blond-red hair consistent in ALL 32 poses, including every profile and back view. Keep the same styled short hair silhouette.
Preserve everything else EXACTLY: the same adult male face and identity, glamorous royal-blue/violet/turquoise crystal costume, all 32 complete full-body action poses and their order, crisp eyes and contours, illustration style, body proportions, anatomical scale, all skates and fingers, precise 4 columns by 8 rows, 1:2 portrait canvas, per-cell positions, baseline, native fine detail and genuine transparent background. Do not add a woman, partner, extra person, background, shadows, labels or new actions. Do not move or zoom frames. This remains one PNG containing ONLY the man, one intact person in every cell. This is a hair color correction, never a scene redesign or grid change. Preserve high quality and sharpness.
