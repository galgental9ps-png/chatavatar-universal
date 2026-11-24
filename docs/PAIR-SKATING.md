# Aurora & Noel · Paarlauf

Asset: `assets/ice-pair-master-v1.png`. Erstellt mit der integrierten Bildgenerierung am 24.11.2026; unveränderte PNG mit Alpha, 1254 × 1254 Pixel, 8 × 8 Felder. Keine hochskalierte 4K-Datei. Jedes Feld enthält dieselbe blonde Frau und denselben dunkelhaarigen Mann in weiß/champagnerfarbenem bzw. dunkelblauem Kristallkostüm.

## Zwei verbundene Abfolgen

Die vollständige Kür beginnt gemeinsam, führt dann auseinander, zeigt räumlich getrennte synchrone Pirouetten und einen gleichzeitigen Drehsprung aufeinander zu, führt beide wieder zusammen und setzt mit gestützter Arabesque und Paar-Schrittfolge mit tiefer Tanzfigur fort. `Synchronfolge vorführen` startet den getrennten Teil mit gemeinsamem Abschluss einzeln. `Aufeinander zuspringen` und `Synchrone Pirouetten` starten kürzere Varianten.

In den Reihen 1, 2, 7 und 8 wird das gesamte Paar mit einem Bildaufruf gezeigt. In den Reihen 3 bis 6 ist jede vollständige Figur in einer eigenen Hälfte desselben Feldes freigestellt. Der Renderer entnimmt genau diese zwei ganzen Körper aus derselben Animationsphase und bewegt sie unabhängig. Es werden keine Arme, Beine oder Körperteile kombiniert. Beide verwenden denselben Takt, dieselbe Sprunghöhe, denselben anatomischen Maßstab und dieselbe PNG. Der Mann bekommt im getrennten Teil eine eigene bedienbare Schaltfläche; beide öffnen dasselbe Wissensfenster.

Der anatomische Maßstab wird beim Abspielen nicht pro Pose angepasst. Die bewegte Darstellung ist 208 Pixel auf dem Desktop bzw. 176 Pixel mobil breit; beide einzelnen Tänzer nutzen beim Trennen denselben Maßstab. Auf sehr schmalen Fenstern bleibt das Paar zusammen. Tempo und Sprunghöhe werden begrenzt; ein breites Fenster verlängert die Gleitzeit. Lesen, Ausblenden, Ziehen, Asset-Wechsel und reduzierte Bewegung beenden die laufende Folge und entfernen die getrennte zweite Darstellung. Ein ausgeblendeter Tab hält den gemeinsamen Takt an.

Die Auswahl `const ACTIVE_ASSET_SET = 'ice-pair';` in `asset-sets.js` setzt das Paar als Voreinstellung. Lumi und Jimmy bleiben im Figurenschalter erhalten. Die weiße PNG-Winterlandschaft und die Hintergrundmusik sind weiterhin nur Teil der Demoseite.

## Zeilen im Action-PNG

| Reihe | Zellen | Verwendung |
| --- | --- | --- |
| 1 | 0–7 | Gemeinsames Stehen, Begrüßen und Verbeugen |
| 2 | 8–15 | Gemeinsames Gleiten |
| 3 | 16–23 | Zwei vollständige getrennte Figuren beim Beschleunigen |
| 4 | 24–31 | Synchroner Absprung und Streckung |
| 5 | 32–39 | Aufrechte Drehansichten für Pirouette und Flugphase |
| 6 | 40–47 | Öffnen, Landen und Ausgleiten |
| 7 | 48–55 | Gestützte Paar-Arabesque |
| 8 | 56–63 | Paar-Schrittfolge und gestützte tiefe Tanzfigur |

## Ausgangsprompt

Use case: stylized-concept.
Asset type: a production animation sprite atlas PNG for the Chatavatar Universal website, matching the softly rendered charming 3D storybook figure style of the existing Lumi ice-skater.
Primary request: EXACTLY 64 FULL-BODY action frames arranged as an EXACT 8 columns by 8 rows REGULAR square sprite grid. Every single frame contains the SAME TWO ADULT figure-skating partners together, as one complete unified illustration, executing coordinated pair skating. Both dancers must be present in every cell. No separate body parts.
Subject identity locked across all 64 frames: a graceful glamorous adult woman with bright blonde hair in a neat golden-blonde bun, silver crystal hair ornament, warm expressive eyes and an elegant ice-white and pale champagne long-sleeved skating dress with subtle crystal embroidery, delicate flowing short skirt, natural tights, white figure skates; her handsome adult male partner has tidy dark brown hair, a tailored deep midnight navy skating suit with silver crystal details coordinating with her dress, slim black trousers and black figure skates with fine silver blades. Friendly, artistically stylized, refined, expressive faces, gently oversized heads like a premium 3D animated mascot, clearly adult performers. Gleaming but tasteful stage costumes, natural athletic anatomy.
Scene/backdrop: TRUE TRANSPARENT alpha background, including all gutters and empty space. NO ice patch, NO floor, NO reflection, NO background, NO ground shadow, no grid lines, no labels, no numbers.
Composition/framing: square high-detail PNG at the largest native square resolution available. 8 equally sized cells across and 8 down. Exactly TWO people in EACH cell. Lock the camera, lighting, costume, face, anatomical scale, pair center and floor baseline for ALL cells. Same head and torso size across the sheet: crouches become shorter, NEVER enlarged to standing height. Preserve both complete heads, all hands, both complete bodies and all four skates with safe transparent margins. Pair centered in each cell; blades at the same low baseline, including airborne rotation source poses (website adds the jump height). They may turn together; do NOT mirror or swap their identities. No cropped or neighboring figures entering another cell. The left-to-right progression within each row must be small smooth coherent motion changes, never unrelated poses.
Animation rows, in this EXACT order:
ROW 1, cells 0–7: paired rest and friendly interactions: poised together, small synchronized wave, welcoming open arms, elegant joined-hand presentation, hands softly near chest, gentle nod, relaxed smiling pose, shared small bow.
ROW 2, cells 8–15: one smooth 8-frame synchronized basic forward skating push-and-glide cycle toward the right, side by side with consistent shoulder perspective and soft complementary arm swing. Their stroke timing matches exactly.
ROW 3, cells 16–23: one smooth 8-frame stronger synchronized acceleration cycle toward the right: lower knees, long coordinated pushes, gradual recovery, ending in a compact stable knee bend ready for takeoff. Constant body proportions.
ROW 4, cells 24–31: 8 closely spaced paired takeoff anticipation and extension phases, both synchronized: begin low and balanced as in the last speed pose, bend and gather arms, slowly extend knees and draw arms inward, finish upright closed stance ready to leave the ice. Both are at the common blade baseline.
ROW 5, cells 32–39: 8 consecutive upright axial rotation views of BOTH dancers synchronized side by side, each 45 degrees farther around the vertical axis from front three-quarter through side and back to front again. Arms elegantly closed, legs close together; both bodies remain upright, with all skates at the source baseline. These views are used for side-by-side pirouettes and airborne synchronized jumps. Never rotate a flat image around the picture plane.
ROW 6, cells 40–47: 8 smooth landing-and-recovery phases for both: start from the same closed upright pose as row 5; gradually open arms, extend free leg, soften knees to absorb landing, return to a long elegant exit glide. No abrupt change in size or viewpoint.
ROW 7, cells 48–55: 8 graceful coordinated pair spiral / supported arabesque phases, start together upright, gently enter matching one-leg glides, he offers a steady hand and waist support as she extends her free leg back; the middle poses show a beautiful low supported arabesque, then both smoothly lower the free legs and return together. The man's skates always stay grounded. Stable physiques, no impossible anatomy or overhead lift.
ROW 8, cells 56–63: 8 connected artistic pair dance footwork poses: crossed skating steps together, softly joined hands, smooth partnered direction change, a graceful supported low dance dip in the middle, recover and finish with a small elegant presentation pose together. Keep the two people distinct with anatomically clear hands and legs.
Materials/textures and mood: crisp detailed faces, smooth clean sculptural contours, gentle physically lit fabric and crystal highlights, soft neutral studio lighting, artistic glamorous performance, graceful and warm. Consistent detail level and clarity across the whole atlas.
Constraints: exactly 8x8 cells, exactly one complete pair per cell, exactly the same blonde woman and dark-haired man, consistent individual anatomical size across ALL 64 images, complete silhouettes with margins, transparent alpha throughout empty areas. NO text, borders, ice, scenery, logos, watermark, detached limbs, duplicate people inside cells, extra partners, changing costumes, perspective zooms, motion blur, crossfades or ghosted silhouettes.

## Anpassung für den getrennten Synchronteil

Use case: precise-object-edit, identity-preserve.
Edit target: the attached generated 8x8 paired figure-skating sprite atlas.
Preserve EXACTLY these two adult dancers, blonde woman in crystal white/champagne dress and dark-haired man in midnight navy silver suit, their faces, glamorous softly rendered 3D style, costumes, original 8 columns by 8 rows, all 64 action frames, and genuine transparent alpha.
Update the atlas for TWO performance sequences: artistic close partnered skating AND separately performed synchronized tricks where the two whole people can move toward each other.
CRITICAL edit only to ROWS 3, 4, 5 and 6 (zero-based cells 16 through 47): separate the full dancers into the LEFT HALF and RIGHT HALF of EVERY cell. Blonde woman is centered exactly at 25% of cell width, man centered exactly at 75%. Each COMPLETE dancer including outstretched hands, hair and both skates must fit ENTIRELY within their own half-cell, with clear transparent separation at the 50% divider. NO overlap, touching hands, crossed silhouettes or hair crossing this divider, and no cropped body parts. Each dancer is an intact complete action illustration, never cut into body parts. Lock their horizontal center to the center of their own half-cell in all 32 separated frames.
ROW 3: 8 synchronized low skating acceleration phases. She faces to the right and he faces to the LEFT so they skate TOWARD each other. Mirror the overall ACTION naturally, not their identities. Knees, strokes and arm timing synchronized.
ROW 4: 8 finely spaced synchronized knee bend and takeoff extension phases, still separately in each half, still facing toward each other. Both skates at the common source baseline; application supplies jump height.
ROW 5: 8 synchronized upright rotation views, both separate in their halves and the same relative rotation phase, front through side/back and back to front. Complete full bodies, arms neatly closed; no flat image rotation.
ROW 6: 8 separate synchronized opening, landing absorption and recovery phases. Same fixed per-person centers, full bodies in each half, no overlap. Face inward again by the final exit pose.
Keep ROWS 1, 2, 7 and 8 as close TOGETHER partnered figures, including original joined-hand greetings, paired glide, supported arabesque and supported dance dip.
Across ALL 64 frames use ONE fixed anatomical scale: a normally standing adult is approximately 72–76% of one cell's height, blades aligned at 92% cell height. Reduce ALL figures uniformly if needed to gain safe margins; a crouching person becomes lower, do not enlarge a crouch. Every head/torso keeps a stable anatomical size between separated and joined rows. This also creates clear transparent margins around every complete pair. Keep the entire composition precisely aligned to an 8x8 regular grid, no drawings spilling between cells.
Final must remain ONE square high-detail PNG with alpha, all 64 complete pair frames, no background, ground, labels, numbers, borders, ice, shadows, duplicate extra people or detached limbs. Clean true transparent gutters; preserve sharp faces and all costume details.
