# Room signs: ground for wave #6

Grounding for [prime-game-ui#6](https://github.com/xperiaroco2/prime-game-ui/issues/6) (room signs), 2026-10-03.
Inputs: `docs/ui-decisions.md` (Principles, Delivery, Style: Toy), `tokens/`, the game repo `D:\prime-game` read only
(commit `3807bed`), [prime-game#255](https://github.com/xperiaroco2/prime-game/issues/255) (Delivery v2). Web pages read
as HTML or JSON only; nothing downloaded. "(unconfirmed)" marks a claim from a secondary source or a search snippet.

## 1. The first map

### What the game has today (facts)
- **No rooms yet.** The first round map is `levels/greybox/greybox.tscn`: one 60 × 60 m floor box and `Marker3D`s, no
  walls, no rooms, no room names. 10 `spawn_package` markers stand in a row at z = −12 (x = −18 … 18, every 4 m),
  10 `spawn_circle` markers in a row at z = +12, 10 round-player spawns on a line through the centre (z = 0), 4 knives,
  4 respawns. It is the "flat, marker-only" scene of M2, to be dressed from pieces in M4 (`levels/CLAUDE.md`).
- **The rooms are the designer's open work.** [prime-game#146](https://github.com/xperiaroco2/prime-game/issues/146)
  (L-1, open) lays out rooms, corridors and hiding places; `docs/GDD.md` §13 still asks "Which rooms and interactables
  does the first map need?".
- **No room data exists.** Nothing in `levels/`, `core/` or `docs/ARCHITECTURE.md` names a room or a room zone (the only
  "zones" are the knife's hit zone and #36's zone task). The map screen
  ([#253](https://github.com/xperiaroco2/prime-game/issues/253)) needs room names, and #255 needs a storage zone and a
  room per package, so the level will need a room record (an id, a name key, an outline for the map, a pictogram).
- **Delivery today** (`core/tasks/delivery.gd`, `content/tasks/delivery.tres`): N packages and N circles (1 m radius,
  2 m high), each package bound **one to one** to its own circle, with a unique colour of a 10-colour palette; the circles
  sit on random `circle` markers. The package is a 0.45 m box (`client/world/item_view.gd`), two-handed, held at
  (0, −0.7, −1.0) m from the eye (`client/player/first_person_hand.gd`); the eye is 1.6 m high
  (`content/modes/base_mode.tres`). The game renders with Forward+ (`project.godot`); no camera FOV override was found
  in `client/`, so the Camera3D default of 75° vertical applies.
- **#255 (open)** changes this: packages start in the storage room, no colours, each carries its destination room's
  pictogram (no word), the same sign marks the room on the map, at the door and at the spot, no marker and no HUD line.

### A consequence the wave must not miss
With 10 packages and 4 to 6 destination rooms, a room receives 2 or 3 packages. A pictogram names a **room**, not one
of its circles, so the one-to-one package-circle binding cannot stay: either any free spot in the right room accepts
the package (a room-level binding), or each room has one spot that takes several packages. This is a rule change for
#255 (`core/`), not a look question; it is listed in the open questions.

### Proposed room list (a proposal, not in the game)
Taken from the wireframes' map (`pages/wireframes/wireframes.html`, state "Мапа": Склад, Кухня, Лабораторія, Офіс, Хол,
Кімната відпочинку) plus what the greybox suggests (a central spawn line = a hub; a far row of packages = a store; a far
row of circles = destinations). Pictogram ideas are ideas only; every shape will be our own drawing.

| Room (UA / id) | Role | Deliveries | Pictogram idea (own drawing) | Keep apart from |
|---|---|---|---|---|
| Склад / `storage` | where every package starts | no | a shelf with boxes, or a hand truck | Офіс (boxes vs papers) |
| Хол / `hall` | the hub; round spawn | no (proposal: everyone crosses it, a spot there is trivial) | a big round clock or a bench | Кімната відпочинку |
| Кухня / `kitchen` | destination | yes | a kettle or a pan | Кімната відпочинку (both drinks) |
| Лабораторія / `lab` | destination | yes | a flask | any medical sign |
| Офіс / `office` | destination | yes | a desk lamp or a paper clip | Склад |
| Кімната відпочинку / `lounge` | destination | yes | a sofa or a potted plant | Кухня, Хол |
| Майстерня / `workshop` (if the map has room) | destination | yes | a wrench or a hammer | Лабораторія |
| Серверна / `server` (if the map has room) | destination | yes | a plug or a server rack | Офіс |

So the first set is **6 signs** (4 destinations), growing to 8. No medical room with a cross: the red cross is a
protected emblem and the Red Cross has objected to it in games
([Opinio Juris, 2026](https://opiniojuris.org/2026/08/20/from-medkits-to-punk-rock-pop-culture-and-the-non-negotiable-protection-of-the-red-cross-emblem/)).

## 2. Wayfinding and pictograms

### Games
- **LOCKDOWN Protocol.** The studio says players find their way "through the architecture signage" or the tablet, which
  holds a map ([Mirage Creative Lab](https://miragecreativelab.com/lockdown-protocol/)). A community guide says each
  package has a symbol you inspect while holding it, the delivery box in the room shows "the same symbol" and "should
  also have a yellow light", and the map (Q) shows each room with a colour banner and an icon: Storage orange with a
  box, Medical light blue with a cross, the restaurant with a pizza slice
  ([Steam guide](https://steamcommunity.com/sharedfiles/filedetails/?id=3305518998)) (unconfirmed: community guide).
  Its areas have colours: "Eggs match the area color they spawn at" (update 0.8.0,
  [Steam news JSON](https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=2780980&count=100&maxlength=0&feeds=steam_community_announcements)).
  So LOCKDOWN uses three codes at once (icon, area colour, a light at the spot), and the light is a destination cue our
  principle rules out.
- **Among Us** goes the other way: multi-stage tasks show a yellow arrow to the next stage and an outline near the task
  ([Among Us wiki, Tasks](https://among-us.fandom.com/wiki/Tasks)); rooms are named on the map and the Admin table counts
  players per room ([GamesRadar map guide](https://www.gamesradar.com/among-us-maps-guide)) (unconfirmed: search
  snippet). Its rooms carry no destination icon on items.
- **Overcooked** shows each order as icons of the dish and its ingredients, so players match a picture to an object on
  the counter ([ludo.guide, Overcooked 2 UI](https://www.ludo.guide/guide/overcooked-2/understanding-the-user-interface))
  (unconfirmed: secondary guide). Picture-to-object matching is the skill our packages ask for.
- **Lethal Company** gives the explorer no map of the facility; a crewmate at the ship's terminal watches a radar
  ("view monitor", "switch [player]") and talks them through it, and a radar booster can be pinged to find the exit
  ([GameRevolution, terminal commands](https://www.gamerevolution.com/guides/958910-lethal-company-computer-commands-list-terminal))
  (unconfirmed: secondary guide). Wayfinding becomes voice play; we have proximity voice too.
- **PEAK** sets a visible goal (the summit) and splits the climb into biomes separated by campfires
  ([Wikipedia, Peak](https://en.wikipedia.org/wiki/Peak_(video_game))): landmarks instead of markers (that it has no map
  at all is unconfirmed).

### Real places
- Wayfinding as a discipline: Kevin Lynch's *The Image of the City* (1960) and Arthur and Passini's *Wayfinding:
  People, Signs and Architecture* (1992), which treats it as spatial problem solving
  ([Wikipedia, Wayfinding](https://en.wikipedia.org/wiki/Wayfinding)). The same page says colour-coded zones are common
  and that too many signs confuse (unconfirmed: summariser paraphrase).
- **Airports:** ACRP Report 52 (2011) gives US airports a wayfinding strategy, colour, fonts and sizes
  ([National Academies](https://nap.nationalacademies.org/catalog/13640/wayfinding-and-signing-guidelines-for-airport-terminals-and-landside));
  a summary quotes it calling consistency the "backbone" of airport wayfinding
  ([Mount Holyoke UX project](https://commons.mtholyoke.edu/uxprojects/?p=541)) (unconfirmed: secondary).
- **Hospitals:** a 2017 capstone finds that signs of symbols and pictograms "lead to better patient outcomes"
  ([Potter, University of Oregon](https://scholarsbank.uoregon.edu/items/d0bc73b9-6024-4f9f-9cb1-699edd8e7b73/full));
  hospitals split into colour zones, each with a symbol, repeated on signs and maps, sometimes with stripe patterns for
  colour-blind visitors ([Simbo blog](https://www.simbo.ai/blog/?p=137593)) (unconfirmed: secondary).
- **Trade signs:** carved and painted hanging shop signs made a shop "a landmark to a public that was largely
  illiterate" ([Londonist](https://londonist.com/london/history/the-decline-and-fall-of-london-s-hanging-signs)): a key
  for a locksmith, a shoe for a shoemaker. A wordless sign that is the object itself is an old, proven idea.
- **AIGA/DOT symbol signs:** 34 symbols in 1974 and 16 more in 1979, by AIGA with Roger Cook and Don Shanosky, public
  domain; a committee scored existing systems on semantic, syntactic and pragmatic grounds before drawing
  ([Wikipedia, DOT pictograms](https://en.wikipedia.org/wiki/DOT_pictograms)). A model of clarity and of a process; per
  our licence rule it is a model only, never a source of shapes (the same for ISO 7001).

### What makes a pictogram readable far away and small
- Symbol signs were legible at about **twice the distance** of word signs at every visual acuity tested
  ([Jacobs, Johnston and Cole 1975, TRID](https://trid.trb.org/View/45200)).
- US accessibility rules for room pictograms: a pictogram field at least 6 in (152 mm) high; letter strokes 10 to 30 % of
  the letter height; light on dark or dark on light; a non-glare finish
  ([US Access Board, Chapter 7: Signs](https://www.access-board.gov/ada/guides/chapter-7-signs/)).
- Icon systems thicken strokes as icons get smaller "for the image to look the same at different sizes"
  ([Google, Material Symbols](https://developers.google.com/fonts/docs/material_symbols)). One texture serves 1 to 15 m
  here, so the sign must be drawn for the far case.
- Comprehension is tested, not assumed: ISO 9186-1 is the method for testing a symbol's comprehensibility
  ([ISO 9186-1:2014](https://www.iso.org/standard/59226.html)) (its pass rate of about two thirds is unconfirmed).
- Rules for us (from the above and §3's numbers): the **outer silhouette carries the meaning**; one object per sign,
  side or front view, no perspective; filled shapes over line drawings; one stroke weight and one corner radius across
  the set (Toy: round joins, round corners); a plate behind the figure for figure-ground; outer shapes that differ
  across the set (DOT's "syntactic" test: no two signs alike at a squint).

### Colour-blind safety
- "Ensure no essential information is conveyed by a fixed colour alone" is a basic guideline
  ([Game Accessibility Guidelines](https://gameaccessibilityguidelines.com/ensure-no-essential-information-is-conveyed-by-a-colour-alone/));
  about 1 in 12 men has a colour vision deficiency, most often red-green
  ([NEI](https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/color-blindness)).
- Our packages already carry no colour (decided), so the package side is safe by design. Any colour on doors or the
  map may only repeat what shape already says.
- Token contrast for a sign (computed, WCAG formula): ink `#2a1f33` on cream `#fff4e2` 14.4:1, on white 15.6:1, on
  lavender 12.1:1, on yellow 9.7:1, on mint 7.2:1, on coral 6.5:1. Ink on cream is the safest pair.
- The map already uses `palette.zone` (`#ffc23a`) to light zones when a task is hovered; a room colour must not be
  that yellow.

### When a sign everywhere becomes a destination marker
A matching sign is reading the world; a sign that **reacts to what you carry** is a marker. LOCKDOWN's yellow light on
the delivery box and Among Us's arrows are the line we do not cross. Rules for every system below:
1. Signs are static: no glow, blink, sound or highlight when the matching package is near or carried.
2. Signs obey walls: depth test on, no `fixed_size`, no `no_depth_test`; never on the HUD or the screen edge.
3. The map shows every room's sign all the time, never only the carried package's room.
4. The package's sign is on the package only (in 3D). Whether the HUD hand slot repeats it is an open question.
5. Signs mark rooms, not routes: no arrows at junctions unless the designers decide so (open question).
6. A few signs per room (the door and the spot), not on every wall.

## 3. Godot 4.7 placement facts

| Where | Ways in Godot 4.7 | Facts (class reference) | For us |
|---|---|---|---|
| Package | **Texture on the box mesh** | `BoxMesh`: "The box's UV layout is arranged in a 3×2 layout that allows texturing each face individually" ([BoxMesh](https://docs.godotengine.org/en/4.7/classes/class_boxmesh.html)) | The best fit: the sign on all 6 faces, including the **top**, the face the carrier mostly sees (the box sits 35° below the eye line, near the bottom of a 75° view). Shaded with the scene, no floating |
| | Decal (child of the package) | Projects onto meshes in its box; "Forward+ and Mobile", not Compatibility; `cull_mask` picks the layers it touches; Mobile shows 8 decals per mesh ([Decal](https://docs.godotengine.org/en/4.7/classes/class_decal.html), [Using decals](https://docs.godotengine.org/en/4.7/tutorials/3d/using_decals.html)) | Works (we are Forward+), but it would also paint hands and the floor inside its box unless culled; more cost than a texture |
| | Sprite3D, billboard | `billboard` (default disabled; `BILLBOARD_ENABLED` turns it to the camera), `pixel_size` 0.01, `double_sided` true, `fixed_size` false ([SpriteBase3D](https://docs.godotengine.org/en/4.7/classes/class_spritebase3d.html), [BaseMaterial3D](https://docs.godotengine.org/en/4.7/classes/class_basematerial3d.html)) | Readable from any side, but a sign that turns to you floats like a marker; avoid on packages |
| | Label3D with our own icon font | Renders text from a `Font`; `outline_size` 12, `billboard` off by default ([Label3D](https://docs.godotengine.org/en/4.7/classes/class_label3d.html)); MSDF fonts do not look grainy "for Label3Ds viewed from a long distance" ([FontFile](https://docs.godotengine.org/en/4.7/classes/class_fontfile.html)) | Crisp at every distance and gives a real outline, but needs a font built from our SVGs (a tooling task in prime-game) |
| Door | A sign mesh (a plate or a cut-out shape) with the texture; or a wall Decal; or Sprite3D with billboard off | as above | A plate mesh at eye height beside or over the door; a cut-out plate makes shape codes (angle B) physical |
| Map screen | `TextureRect` in the theme | `stretch_mode` default `STRETCH_SCALE`; `STRETCH_KEEP_ASPECT_CENTERED` keeps proportions ([TextureRect](https://docs.godotengine.org/en/4.7/classes/class_texturerect.html)); tint through `modulate` ([CanvasItem](https://docs.godotengine.org/en/4.7/classes/class_canvasitem.html)) | The sign sits on a room label plate drawn by a `StyleBoxFlat` from tokens (cream, ink outline, round corners) |
| | `DPITexture` for the SVG | An SVG texture that re-rasterises for the viewport scale; experimental, "may be changed or removed" ([DPITexture](https://docs.godotengine.org/en/4.7/classes/class_dpitexture.html)) | Crisp UI icons after the move to a 1920×1080 base ([#287](https://github.com/xperiaroco2/prime-game/issues/287)); else import a second raster at UI size |
| Delivery spot | Floor Decal, or a stand (a vertical plate) | Decal `distance_fade`, `normal_fade`; filter is a project setting `rendering/textures/decals/filter` ([Using decals](https://docs.godotengine.org/en/4.7/tutorials/3d/using_decals.html)) | A floor sign foreshortens hard (below); a stand reads from far, a floor sign only up close. Both may be needed |

**SVG import.** SVGs are rasterised at import; `svg/scale` (default 1.0) sets the size; text must be converted to paths
and ThorVG's SVG support is limited ([Importing images](https://docs.godotengine.org/en/4.7/tutorials/assets_pipeline/importing_images.html),
[ResourceImporterTexture](https://docs.godotengine.org/en/4.7/classes/class_resourceimportertexture.html)). A texture
detected in 3D gets mipmaps and VRAM compression; mipmaps cost about 33 % more memory; the docs warn VRAM compression
hurts pixel art even in 3D, and flat-colour signs have the same hard edges, so sign textures should use Lossless or VRAM
Uncompressed (8 signs at 512² RGBA with mipmaps ≈ 11 MB of VRAM). Materials default to `LINEAR_WITH_MIPMAPS`; the
anisotropic variant keeps oblique faces (the box top, a floor sign) sharp
([BaseMaterial3D](https://docs.godotengine.org/en/4.7/classes/class_basematerial3d.html)). So the SVG should be plain
paths and fills, no text, no filters, no masks.

**How big a sign is on screen.** At 75° vertical FOV ([Camera3D](https://docs.godotengine.org/en/4.7/classes/class_camera3d.html)),
a 1080 px tall view shows 1080 / (2 · d · tan 37.5°) ≈ 704 / d px per metre at distance d. For a 0.32 m field on a
package face and a 0.40 m door plate:

| Distance | Package 0.32 m, 1080p | 720p | 1440p | Door plate 0.40 m, 1080p | 720p |
|---|---|---|---|---|---|
| 0.8 m (picking up) | 281 px | 188 | 375 | 352 | 235 |
| 1.2 m (carried) | 185 | 123 | 246 | 231 | 154 |
| 2 m | 113 | 75 | 150 | 141 | 94 |
| 5 m | 45 | 30 | 60 | 56 | 38 |
| 10 m | 23 | 15 | 30 | 28 | 19 |
| 15 m | 15 | 10 | 20 | 19 | 13 |

A 1.2 m floor sign seen from the 1.6 m eye: 264 px tall at 2 m, 51 px at 5 m (17.7° grazing), 13 px at 10 m.

**What that means for the drawing.**
- Draw on a **64-unit artboard with a 56-unit live area**; raster at 512 px (`svg/scale` 8). 512 covers the close
  views (281 px at 1080p, 375 at 1440p) without magnifying; mipmaps cover distance.
- On a 0.32 m field one unit is 0.35 px at 10 m on 1080p and 0.23 px on 720p. A detail must stay about 2 px wide to
  survive, so **strokes and gaps of at least 6 units (about 11 % of the field)**: 2.1 px at 10 m on 1080p, 1.4 px on
  720p. At 10 m on 720p only the outer silhouette survives; inner details of 9 units or more read up to about 5 m.
- So: the silhouette alone must identify the room; at most two or three parts; no hairlines; the plate's ink outline
  at least 4 units; round joins and caps to match Toy.
- Test every sign at 15 px and 23 px (the 10 m cases) and run the set through `tools/a11y/` for colour vision.

## 4. Three system angles

Each keeps the decided parts (a word-free pictogram on the package, the same sign on the map, at the door and at the
spot, nothing that reacts to the carrier) and differs in how the room is recognised.

**A. Stamps: one pure silhouette set.** Every room is one filled silhouette in plum ink on cream, nothing else: no
colour, no frame code. On the package it is a cargo stamp on all six faces; at the door it is a square enamel-like
plate with round corners; at the spot a small stand repeats the plate; on the map it sits on the room's label. The whole
system is one SVG per room and one plate style, so it is the cheapest to build, the safest for colour vision (14.4:1),
and the easiest to keep consistent across 3D and the theme. It plays the sign quieter than LOCKDOWN (one code, no
banner colour, no light). Its risk is that at 10 m or more only the outline differs, so the set lives or dies by
distinct silhouettes; the drawing round must pass a squint test before anything else.

**B. Shape-coded plates: two codes, still no colour.** Each room gets its own plate shape from Toy's chunky, rounded
family (a circle, a rounded square, a pill, a hexagon, a scalloped "cookie", a house shape) with its pictogram inside.
The plate shape is cut out physically at the door and on the stand, is the border of the stamp on the package, and is
the shape of the room label on the map. From afar (13 to 19 px) the plate shape reads; up close the pictogram confirms:
the redundancy hospitals get from colour, without colour. It suits Toy, whose look is chunky rounded shapes with a thick
outline. Costs: two things to learn per room, and shapes with set meanings must be avoided (ISO-style warning triangles
and prohibition circles), so the shapes stay soft and playful. The plate needs its own mesh or an alpha-scissor cut.

**C. Shop signs: the room's own object is the sign.** The pictogram on the package is a flat drawing of one big,
physical toy object that marks the room in the world, the way hanging trade signs marked shops: a giant kettle over the
kitchen door, a giant flask over the lab, a lamp over the office. There is no flat plate at the door; the map shows the
same drawing beside the room name; the spot is the same "receiving hatch" object in every room (so players learn once
what a drop-off looks like), with a small stamp of the sign. This is the clearest way to play it differently from
LOCKDOWN: one sign on the box and the map, one landmark in the world, nothing repeated on every surface, and finding
the room becomes looking for a thing (as in Overcooked and PEAK) rather than reading labels. Costs and risks: one 3D
prop per room (level art in prime-game, the designer's), the drawing must match the prop's side silhouette exactly, and
a prop seen end-on can read wrong, so each needs a distinct profile from every side.

**Why these three, and not colour districts.** A, B and C differ in what the player recognises (a silhouette, a shape
plus a silhouette, a physical object), so the designers cannot converge on one look. Colour-coded zones were the fourth
candidate and are dropped as an angle: they are closest to LOCKDOWN's banners, they add a second code that packages
(colourless, decided) cannot carry, the map's hover highlight already owns the yellow, and Toy's palette has few hues
that stay apart for colour-blind players. Colour can still return later as a quiet extra on the map's room fill in A or
B, never as the only cue.

## Open questions for the engineer
1. Delivery binding: may a package go to any free spot of its room, or does each room have one spot that takes
   several packages? (Needed before the spot can be drawn; a change to #255.)
2. Do Склад and Хол take deliveries? (Proposal: no.)
3. On the map, what does hovering the Delivery task light: the storage room only, or every room that still waits for
   a package? (The latter is close to a destination marker.)
4. Does the HUD hand slot show the carried package's sign, or only the package?
5. Are directional signs at corridor junctions allowed, or do signs only mark rooms?
6. The level needs a room record (id, name, map outline, sign): a prime-game issue (`area:levels` and `area:content`)
   with a note on #150.
