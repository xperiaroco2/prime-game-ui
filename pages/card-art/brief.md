# How-to card art: the brief

What the illustrators of [prime-game-ui#3](https://github.com/xperiaroco2/prime-game-ui/issues/3) follow. The research
behind it is `docs/research/2026-10-07-card-art/report.md`. Every style draws the same 8 panels: the Delivery card
(`delivery-1` to `delivery-4`) and the Switches card (`switches-1` to `switches-4`). Everything drawn is own work.

The engineer's direction: a fun cartoon drawing; the game's characters look a bit like plasticine; the UI style is Toy
(chunky rounded shapes, thick plum outline, cream panels, sunny yellow). All four styles are fun cartoons; they differ
in how.

## 0. Where a panel shows

- A panel is the art of one frame of a how-to card. A card shows 3 to 4 frames side by side; the game draws a caption
  under each frame from the copy deck. The art itself carries no text.
- The game shows the whole panel (keep aspect, centred): **160 x 120 px** on the map card and the Esc menu, **267 x 200
  px** on the loading card. Draw at 320 x 240; check at 160 x 120, where 1 unit is half a pixel.
- Frames 1 to 3 are white `#ffffff`, frame 4 (the finish) is mint-tint `#d5f4ec`; each has a 3 px plum outline and
  16 px corners. The game draws the frame, not you: the art is transparent.

## 1. The SVG contract

Only what both a browser and Godot 4.7.2's ThorVG draw the same (tested; see the report, section 3).

**The file.** Line 1 is the licence comment, then exactly one root:

```xml
<!-- own work, prime-game-ui, licence: own work -->
<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240" viewBox="0 0 320 240">
  <defs>
    ...
  </defs>
  ...
</svg>
```

- No other root attributes (no `preserveAspectRatio`, no `version`, no `xmlns:xlink`). `<defs>` first, if any.
- One element per line (the checks below read lines).
- At most **12 KB** (12,288 bytes) per file.

**Elements.** Allowed: `svg` (the root only), `defs`, `g`, `path`, `circle`, `ellipse`, `rect`, `line`, `polyline`,
`polygon`, `use`, `clipPath`; and `linearGradient`, `radialGradient`, `stop` only in a style that allows gradients
(clay). Banned: `text`, `tspan`, `image`, `style`, `script`, `mask`, `pattern`, `symbol`, a nested `svg`, `filter` and
every `fe*`, `marker`, `switch`, `foreignObject`, `a`, `animate*`, `set`, `title`, `desc`.

**Attributes (presentation attributes only).**
- On shapes and `g`: `id`, `d`, `cx`, `cy`, `r`, `rx`, `ry`, `x`, `y`, `width`, `height`, `x1`, `y1`, `x2`, `y2`,
  `points`, `transform`, `fill`, `fill-opacity`, `fill-rule`, `stroke`, `stroke-width`, `stroke-opacity`,
  `stroke-linejoin`, `stroke-linecap`, `stroke-miterlimit`, `opacity`, `paint-order`, `clip-path="url(#id)"`.
- On `use`: `href="#id"` only; position it with a wrapping `<g transform>`, not `x`/`y`. It points to a shape or `g` in
  this file's `defs`, never to another `use`.
- On `clipPath`: `id` only (user space); children are `path`, `circle`, `ellipse`, `rect`, `polygon`.
- On gradients: `id`, `x1`, `y1`, `x2`, `y2`, `cx`, `cy`, `r`, `fx`, `fy`, `gradientUnits`, `gradientTransform`; on
  `stop`: `offset`, `stop-color`, `stop-opacity`.
- Banned: `style`, `class`, `filter`, `mask`, `visibility`, `mix-blend-mode`, `vector-effect`, `preserveAspectRatio`,
  `xlink:href`, `stroke-dasharray` (no dashed lines), `currentColor`, `data-*`, `aria-*`.

**Values.**
- Colours only `#rrggbb`, lowercase. No `#rgb`, names, `rgb()`; `rgba()`, `hsla()` and `#rrggbbaa` draw **black** in
  Godot.
- Alpha only through `fill-opacity`, `stroke-opacity`, `opacity`, `stop-opacity` (0 to 1).
- Numbers are plain decimals with at most 2 decimals: no units, no `%`, no exponent. Stop offsets ascend from 0 to 1.
- **Every** shape element has its own `fill` (`fill="none"` on pure strokes, a fill on clip children too); a missing
  fill draws black.
- Transforms: `translate`, `rotate`, uniform `scale`, `matrix`. No non-uniform scale or skew on anything stroked.

**Strokes.** Every stroke has `stroke-linejoin="round"`; open paths, lines and polylines also `stroke-linecap="round"`.
Widths: the style's outline (section 5), inner lines at least 3 units, texture lines (clay) at least 2 units. For an
outline outside the fill only, draw the stroke at double width with `paint-order="stroke"`.

**ids.** Unique, lowercase, prefixed by the panel: `d1-` to `d4-`, `s1-` to `s4-` (for example `d2-lab`). Several
panels can share one HTML page, and ids would clash.

**Layout.**
- No full-bleed background: nothing covers the 320 x 240 box; the frame colour shows through.
- Keep everything inside x 12 to 308, y 12 to 228.
- The smallest feature that carries meaning is 8 units (4 px on the map card); a room pictogram is at least 40 units
  wide.
- No text in the art: no letters, digits, `!`, `?`, "zzz", speech bubbles or check marks (the mint frame says "done").

**Checks** (Git Bash, from the folder with the 8 SVGs; each must print nothing but the size lines):

```bash
P='<(text|tspan|image|style|script|mask|pattern|symbol|filter|fe[A-Z][A-Za-z]*|marker|switch|foreignObject|animate[A-Za-z]*|set|a|title|desc)\b|\b(style|class|filter|mask|visibility|mix-blend-mode|vector-effect|preserveAspectRatio|xlink:href|stroke-dasharray)=|currentColor|rgba?\(|hsla?\(|#[0-9a-fA-F]{8}\b|#[0-9a-fA-F]{3}\b|="#[0-9a-f]*[A-F]|[0-9]\.[0-9]{3,}|[0-9](px|pt|em|%)|[0-9]e-[0-9]'
grep -nE "$P" *.svg
grep -nE '<(path|circle|ellipse|rect|polygon|polyline|line)\b' *.svg | grep -v 'fill='
grep -nE 'stroke="#' *.svg | grep -v 'stroke-linejoin="round"'
for f in *.svg; do echo "$f $(wc -c < "$f") bytes, $(grep -o '<svg' "$f" | wc -l) svg"; done   # <= 12288 bytes, 1 svg
```

## 2. The render recipe (self-checks)

Work in your scratchpad, never in the repo. Make `<scratchpad>/card-sheet/<style-id>/sheet.html` with the content
below; set the `base href` to the folder that holds your 8 SVGs (forward slashes, ending in `/`). It shows the 8
panels at 2x in frames like the game's (white, the last of each row mint) on the cream card colour `#fff4e2`.

```html
<!doctype html>
<html><head><meta charset="utf-8"><base href="file:///D:/path/to/the/eight/svgs/"><title>Card art sheet</title>
<style>
  /* --k: 2 = the review size (640x480 per panel); 0.5 = the map card's real size (160x120) */
  :root { --k: 2; }
  html, body { margin: 0; background: #fff4e2; }
  body { padding: calc(16px * var(--k)); display: grid; grid-template-columns: repeat(4, max-content);
         gap: calc(12px * var(--k)); font: 700 calc(11px * var(--k))/1 sans-serif; color: #2a1f33; }
  figure { margin: 0; }
  .frame { padding: calc(13px * var(--k)); background: #ffffff; border: calc(3px * var(--k)) solid #2a1f33;
           border-radius: calc(16px * var(--k)); }
  .frame.done { background: #d5f4ec; }
  .frame img { display: block; width: calc(320px * var(--k)); height: calc(240px * var(--k)); }
  figcaption { height: calc(14px * var(--k)); padding-top: calc(4px * var(--k)); text-align: center; }
</style></head><body>
<figure><div class="frame"><img src="delivery-1.svg" alt=""></div><figcaption>delivery-1</figcaption></figure>
<figure><div class="frame"><img src="delivery-2.svg" alt=""></div><figcaption>delivery-2</figcaption></figure>
<figure><div class="frame"><img src="delivery-3.svg" alt=""></div><figcaption>delivery-3</figcaption></figure>
<figure><div class="frame done"><img src="delivery-4.svg" alt=""></div><figcaption>delivery-4</figcaption></figure>
<figure><div class="frame"><img src="switches-1.svg" alt=""></div><figcaption>switches-1</figcaption></figure>
<figure><div class="frame"><img src="switches-2.svg" alt=""></div><figcaption>switches-2</figcaption></figure>
<figure><div class="frame"><img src="switches-3.svg" alt=""></div><figcaption>switches-3</figcaption></figure>
<figure><div class="frame done"><img src="switches-4.svg" alt=""></div><figcaption>switches-4</figcaption></figure>
</body></html>
```

Copy it to `sheet-small.html` with `--k: 0.5` for the map-card size. Render with headless Edge through PowerShell
(this exact form worked on this machine on 2026-10-07, about 2 s per sheet):

```powershell
$d = '<scratchpad>\card-sheet\<style-id>'
$edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
foreach ($r in @(@('sheet','2952,1248'), @('sheet-small','738,312'))) {
  $png = "$d\$($r[0]).png"; $url = 'file:///' + ($d -replace '\\','/') + '/' + $r[0] + '.html'
  Start-Process -FilePath $edge -ArgumentList '--headless=new','--disable-gpu','--hide-scrollbars','--no-first-run',"--user-data-dir=`"$d\edge-profile`"",'"--host-resolver-rules=MAP * ~NOTFOUND"','--force-device-scale-factor=1',"--window-size=$($r[1])","--screenshot=`"$png`"",$url -Wait -NoNewWindow -RedirectStandardError "$d\edge-err.txt"
  "$($r[0]): " + (Get-Item $png).Length + " bytes"
}
```

- The window sizes fit the sheets exactly (k = 2: 2952 x 1248; k = 0.5: 738 x 312). Then look at both PNGs with the
  Read tool.
- `-Wait` matters: called straight from Bash, `msedge.exe` returns at once and the PNG lands about a second later.
  The fresh `--user-data-dir` keeps it off the engineer's running Edge; the resolver rule means nothing is fetched.
  `edge-err.txt` collects harmless component-updater errors; success is the PNG (Edge prints "bytes written to file").

**Godot parity (optional, tested).** The research harness is in
`C:/Users/xperi/AppData/Local/Temp/claude/D--prime-game-ui/05830164-3f9d-43f4-b430-da7645309ac7/scratchpad/svgtest/`
(`render.gd`, `diff.js`, `project.godot`; scratch, not in the repo). `render.gd` writes `<name>_godot.png` next to the
SVG, so first copy the panels into `$d\panels` (never render inside the repo). `$d` and `$edge` are those of the
sheet command above.

```powershell
$t = 'C:\Users\xperi\AppData\Local\Temp\claude\D--prime-game-ui\05830164-3f9d-43f4-b430-da7645309ac7\scratchpad\svgtest'
# one.html: the panel at 2x on #fff3d6 (diff.js composites Godot's transparent output on #fff3d6)
Set-Content -Encoding utf8 "$d\one.html" '<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#fff3d6}img{display:block;width:640px;height:480px}</style></head><body><img src="panels/delivery-1.svg" alt=""></body></html>'
Start-Process -FilePath $edge -ArgumentList '--headless=new','--disable-gpu','--hide-scrollbars','--no-first-run',"--user-data-dir=`"$d\edge-profile`"",'"--host-resolver-rules=MAP * ~NOTFOUND"','--force-device-scale-factor=1','--window-size=640,480',"--screenshot=`"$d\panels\delivery-1_chrome.png`"",('file:///' + ($d -replace '\\','/') + '/one.html') -Wait -NoNewWindow -RedirectStandardError "$d\edge-err.txt"
$env:SVGDIR = ($d -replace '\\','/') + '/panels'; $env:SVGFILES = 'delivery-1'; $env:SVGSCALE = '2'
& 'D:\Godot_v4.7.2-stable_win64.exe\Godot_v4.7.2-stable_win64_console.exe' --headless --path $t --script render.gd
node "$t\diff.js" "$d\panels\delivery-1_chrome.png" "$d\panels\delivery-1_godot.png" 1 1   # pass: mean <= 1.5
```

A contract test panel gave `mean 0.07`.

## 3. The character sheet and the props (shared by every style)

### The hero

One generic clay person from the game's cast (not a specific player), the **same in all 8 panels**.
- **Who:** a plasticine adult: matte clay, rounded and slightly squashed forms, never lanky, never a bean.
- **Proportions:** about 3.5 heads tall by default (each style sets its own between 3 and 4.5); the game's 7 heads
  would leave the face at about 7 px on the map card. Slim visible neck, narrow shoulders, arms a little away from the
  body, small flat shoes. A full figure is 150 to 190 units tall.
- **Head:** an egg, wider and fuller at the top, a little taller than wide; small ears.
- **Eyes:** two big round white eyes that bulge out of the face, close together in the upper middle of the head, each
  about a quarter of the head's width; a tall dark pill pupil (about 60 % of the eye's height); a thin lid over the top
  in the skin's shade, whose angle sets the mood (neutral, alert, sleepy).
- **Brows:** thick dark slabs (rounded bars) well above the eyes; with the lids they carry every expression.
- **Nose:** a big ball ("potato"), just below the eyes and overlapping them a little, a bit lighter and pinker than the
  skin; the biggest feature after the eyes.
- **Mouth:** small and low: the gap grin by default (dark inside, pink lip rim, one or two upper teeth with a gap); open
  for effort or surprise.
- **Hands:** simplified: a rounded palm with a thumb; fingers shown as one or two notches only when the action needs
  them (gripping a lever, pressing).
- **Hair and clothes:** a brown spiky quiff of flat leaf-like tufts; a teal top, grey-blue trousers, brown shoes; all
  chunky and soft.
- **Acting:** natural human poses with gentle comic exaggeration; no rubbery limbs, no ragdoll flop. A package always
  takes **both hands**, hugged at chest height. The hero faces right (the reading direction) unless the action turns
  them.

| Hero part | Colour | Shade |
|---|---|---|
| Skin | `#e6c3ad` | `#c9a089` |
| Nose | `#f1cbbd` | `#d9ad9b` |
| Eye white / teeth | `#f6f2ea` | |
| Pupil | `#2a1f33` | |
| Brows | `#4a3328` | |
| Mouth inside / lips | `#4e3632` / `#e0948c` | |
| Hair | `#6b4630` | `#503322` |
| Top (teal) | `#78ada5` | `#5d8f87` |
| Trousers | `#5d6f86` | `#4a5a6e` |
| Shoes | `#5a3d2b` | |

### The sneaker (switches-3 only)

A second cast member with a clearly different silhouette: a purple mohawk, warm brown skin, an olive top, charcoal
trousers. Same face construction as the hero. A comic opponent, not a villain: no mask, no costume, no role marks.

| Sneaker part | Colour | Shade |
|---|---|---|
| Skin / nose | `#8a6247` / `#a07258` | `#6e4c36` |
| Mohawk | `#7d5ba6` | `#634689` |
| Top (olive) | `#7f8550` | `#666b3f` |
| Trousers / shoes | `#4a4650` / `#6b5a48` | |

### Colour roles

- **Plum ink** `#2a1f33`: outlines (per style), pupils, the room pictograms.
- **Sunny yellow** `#ffc23a` (edge `#c98a10` honey): only lit or target things (a lit lamp, the delivery zone). Nothing
  else is yellow.
- **Coral** `#ff8466` (shade `#d9482f`): the part you act on (the lever knob).
- **Cream** `#fff4e2`: room plates and switch boxes. **Lavender** `#e9dff0`: walls. **Keyshade** `#b9a8c7`: doors.
  **Track-light** `#dccfe4`: floors.
- **Mint** is the done frame's own colour; the art adds no mint.
- Cast shadows: an ellipse in ink at `fill-opacity="0.15"`. Sparkles and puffs: white `#ffffff` with an ink outline.

### The props

- **Package:** a plain cardboard box with slightly rounded corners: front `#d9a066`, side `#c08550`, top `#e8b882`;
  brown tape `#a8713f` along the top seam only, never across the front face. The destination pictogram is printed in ink
  straight on the faces, like a stamp (no plate, no colour, no words). The example destination in every Delivery panel
  is the **lab** (flask), as in the placeholders. Its sign is at least 40 units wide on a carried box, about 90 in the
  close-up.
- **Room pictogram:** copy the path data verbatim from `pages/room-signs/systems/b/icons/<room>.svg` (48 grid, own
  work) into `defs` and place it with a uniform scale. The lab:

  ```xml
  <g id="d2-lab">
    <path d="M17.5,4 L30.5,4 A2.5,2.5 0 0 1 33,6.5 L33,7.5 A2.5,2.5 0 0 1 30.5,10 L17.5,10 A2.5,2.5 0 0 1 15,7.5 L15,6.5 A2.5,2.5 0 0 1 17.5,4 Z" fill="#2a1f33"/>
    <path d="M19,8 L29,8 L29,17.45 A2,2 0 0 0 29.29,18.48 L40.43,37.05 A4,4 0 0 1 41,39.11 L41,41 A3,3 0 0 1 38,44 L10,44 A3,3 0 0 1 7,41 L7,39.11 A4,4 0 0 1 7.57,37.05 L18.71,18.48 A2,2 0 0 0 19,17.45 L19,8 Z M15.5,36 A3.5,3.5 0 1 0 22.5,36 A3.5,3.5 0 1 0 15.5,36 Z M25,29 A3,3 0 1 0 31,29 A3,3 0 1 0 25,29 Z" fill="#2a1f33" fill-rule="evenodd"/>
  </g>
  ```

  used as `<g transform="translate(130 120) scale(1.25)"><use href="#d2-lab"/></g>` (48 x 1.25 = 60 units). The flask's
  bubbles are holes, so the cardboard shows through. Other rooms: storage (three stacked boxes), hall (clock), kitchen
  (kettle), office (desk lamp), lounge (sofa), workshop (hammer), server (plug); the stroked ones (hall, kitchen,
  office, server) keep their 6-unit stroke, scaled with the icon.
- **Door with its plate:** a door is a tall rounded rect (corner radius about 8) in keyshade `#b9a8c7` with an ink
  outline and a small round knob, set in a lavender wall band. The plate hangs **flat on the wall beside the door** at
  the hero's eye height, not over it and not as a hanging shop sign. Copy it whole from
  `pages/room-signs/systems/b/signs/<room>.svg` (64 grid: the room's own plate shape in cream with a 6-unit ink outline,
  the pictogram inside), at least 44 units wide. Plate shapes: storage a rounded square, hall an arch, kitchen a frying
  pan, lab a hexagon, office a folder, lounge a house, workshop a gear, server a cloud.
- **Delivery zone:** a flat patch on the floor in perspective (an ellipse or a rounded rect about 1.5 times the box's
  width), solid sunny yellow `#ffc23a` with a 4-unit honey `#c98a10` edge and 2 or 3 short upward light ticks in honey
  (4 units, round caps). Solid, not 55 % yellow: on the mint frame that turns khaki (about `#ecd88a`). It sits in the
  lab, under the lab plate on the wall.
- **Switch, off and on** (the game's switch is not designed yet, so this is the card's own): a cream `#fff4e2` wall box
  about 40 x 60 units with an ink outline and a slot; a lever pivots at the box's centre: a thick ink rod (8 units,
  round caps) ending in a coral ball knob. **Off:** the lever points down, the lamp is dark. **On:** the lever points up,
  the lamp is lit. Lever and lamp always agree (two cues, because "up = on" is not universal).
- **Lamp:** a round bulb 22 to 28 units across on top of the switch box, with an ink outline. **Dark:** `#9a8ca6`, no
  rays. **Lit:** `#ffc23a`, a small white highlight, and 6 short rays around it (4 units, 8 to 10 long, round caps, a
  4-unit gap from the bulb; ink, or honey in the clay style).
- **Setting:** only what the step needs: a floor line or band and a wall band. Nothing in the corners competes with the
  focus.

## 4. The panel scripts

One action per panel; the thing the step is about is the biggest, highest-contrast shape. The gap between panels does
the walking: no "walk there" panels. A card teaches the method, never a round's answer (the lab is only an example).
**One gag per card:** `delivery-1` and `switches-3`. Each gag acts its step out, so ignoring the joke still leaves the
step readable; the other panels are calm with at most a facial reaction. The last panel of each card is the done frame
(mint).

| File | Caption key | uk | en | Frame | Gag |
|---|---|---|---|---|---|
| `delivery-1.svg` | `howto.delivery.take` | Візьми пакунок на складі | Take a package from the storage room | white | yes |
| `delivery-2.svg` | `howto.delivery.sign` | Подивись на знак на ньому | Check the sign on it | white | |
| `delivery-3.svg` | `howto.delivery.find` | Знайди кімнату з таким знаком | Find the room with that sign | white | |
| `delivery-4.svg` | `howto.delivery.drop` | Поклади в зону доставки | Put it in the delivery zone | mint (done) | |
| `switches-1.svg` | `howto.switches.find` | Знайди всі рубильники | Find every switch | white | |
| `switches-2.svg` | `howto.switches.turn_on` | Увімкни кожен | Turn each one on | white | |
| `switches-3.svg` | `howto.switches.watch` | Стеж, щоб ніхто не вимкнув | Watch that nobody turns them off | white | yes |
| `switches-4.svg` | `howto.switches.done` | Готово, коли всі горять | Done when all are lit | mint (done) | |

**delivery-1, take (the gag).** The storage room: a tall stack of packages (three to five boxes, built like the
storage pictogram) and the storage plate (rounded square, stacked boxes) on the wall at the left. The hero leans back
and pulls one package out from the **bottom** of the stack with both hands; the stack above wobbles (the top box
tilted, 2 or 3 short wobble arcs) but holds. The hero's eyes look up at the wobble, brows high, mouth a tight grin.
Focus: the package coming out in the hero's hands. Stacked boxes show small pictograms of other rooms or none; no box
shows a colour or a word.

**delivery-2, sign.** Waist-up close-up. The hero holds the package in both hands at chest height, its front face to
the viewer with the lab pictogram big (about 90 units). The hero's eyes look down at the sign, brows raised, a small
pleased smile. Nothing else in the panel: no other pictogram, no background beyond a floor or wall hint.

**delivery-3, find.** A corridor wall with **two** doors and their plates: the kitchen (frying-pan plate, kettle) at the
left, the lab (hexagon plate, flask) at the right. The hero stands at the left holding the package, its lab sign
visible on the side toward the viewer, and turns toward the lab door. One curved ink arrow runs from the package's sign
to the lab plate (the match); the kitchen plate stays plain. Doors closed, the hero standing, not walking.

**delivery-4, drop (done frame).** Inside the lab: the lab plate on the wall behind. The hero bends a little and sets the
package down on the lit yellow zone; 2 small landing puffs at the box's base. The hero's face is happy and relieved.
Focus: the box on the zone.

**switches-1, find.** A wall with **three** switches spread out (left low, middle high, right), all off: levers down,
lamps dark. The hero stands in the middle, one hand shading the eyes, head turned, looking around. No arrows, no lit
lamps.

**switches-2, turn on.** The hero, close to one switch, pushes its lever up with one hand; a curved motion arrow follows
the knob's path from down to up, and the lamp above pops lit (rays). In the background, smaller: one switch already
lit, one still dark ("each").

**switches-3, watch (the gag).** All three switches lit. The hero stands guard beside them at the left, arms crossed,
eyes side-glancing right. From the right, the sneaker tiptoes in: one knee high, back hunched, one finger stretched
toward the nearest lever, a sly closed-mouth grin, caught mid-step by the hero's look. Calm and comic: no panic, no
fight, no switch is off yet.

**switches-4, done (done frame).** All three switches on, all lamps lit with rays. The hero celebrates with both arms
up in a small hop (a cast shadow under the feet), 2 or 3 white sparkles. No sneaker, no timer. Whether "done" means
all lit at once or for some seconds is not decided (unconfirmed); the panel shows all lit at once.

## 5. Four style directions

All four are fun cartoons of the same hero, props and scripts; they differ in line, shading and how loud the joke is.

### toy-sticker: Toy sticker

Flat colour and the UI's thick plum outline: the Toy menus come alive. Closest to the Toy UI.
- **Line:** one ink `#2a1f33` outline on every shape: 6 units on silhouettes (3 px on the map card, the frame's own
  width), 4 units on inner lines; no line under 4 units.
- **Fill:** flat solid fills, no gradients; the Toy palette and the character colours above, at full saturation.
- **Shading:** one flat shade shape per big form (bottom right, the listed shade colour); one white highlight ellipse at
  `fill-opacity="0.6"` on the hair, head and box (top left); a flat cast-shadow ellipse. Nothing else.
- **Shapes:** chunky and rounded, corner radii at least 6 units, forms a little wider than tall; clay lumps become
  smooth curves.
- **Faces:** the shared face as clean geometry: outlined white eye circles, pill pupils, rounded-bar brows, an outlined
  ball nose, the gap grin.
- **Proportions:** 3.5 heads.
- **Humour:** gentle; the gag pose plus one or two small effect shapes (wobble arcs, a puff); faces carry the joke.
- **Detail:** low; a wall band and a floor line; about 120 shapes per panel at most.

### clay: Plasticine

Modelled clay forms with highlights and a shade, a soft self-coloured edge instead of ink. Closest to the game's
characters.
- **Line:** no ink outline on figures and props; each form has a soft edge line in its own shade colour, 3 units. Ink
  stays only for pupils, mouth insides and the room pictograms (which keep their real look). Lamp rays in honey.
- **Fill:** slightly muted character colours; every body part a lumpy blob: a closed smooth path through 8 to 10
  points jittered by 3 to 5 % of the radius (quadratic curves through the edge midpoints). At most **one** radial
  gradient per big form (the head, the torso, the box): centre top left, from the base colour lightened about 12 % to
  the base; everything else flat.
- **Shading:** light from the top left. Per big form: a shade crescent bottom right (the listed shade colour), 1 or 2
  white highlight blobs top left at `fill-opacity` 0.45 to 0.55, a cast-shadow ellipse at 0.18.
- **Texture:** 2 or 3 faint fingerprint arcs per big form (2 units, `stroke-opacity="0.2"`, round caps) and 1 or 2 small
  dimples; none on eyes. They fade at the map size; that is fine, they carry no meaning.
- **Faces:** the game's face most literally: glossy eye balls with a small white specular dot on the pupil, a lid in
  the skin's shade, brows as lumpy rolls, the potato nose with its own highlight, the gap grin with a pink lip roll.
- **Proportions:** 4 heads (closest to the game while still readable).
- **Humour:** soft physical comedy: a squashed pose, a bulge; never floppy.
- **Detail:** medium, and the 12 KB budget bites: lumpy paths cost bytes, so about 80 shapes at most and 1-decimal
  coordinates where possible; near-empty backgrounds (a floor shadow, a muted wall band).

### comic-gag: Comic gag

An expressive gag cartoon: bold poses, motion lines and the strongest jokes, bright solid images that read from a
distance.
- **Line:** ink outline with weight contrast: 7 units on silhouettes, 3.5 to 4 on inner lines; swooshes and tapered
  accents drawn as filled ink shapes.
- **Fill:** flat, bright, saturated (sunny yellow, coral, the hero's teal); no gradients.
- **Shading:** one hard-edged flat shade shape per big form (the listed shade or ink at 0.15); a white shine dash on
  each eye.
- **Proportions:** 3 heads, big hands and feet, eyes each about 30 % of the head's width.
- **Poses:** a strong line of action, anticipation before the action, squash and stretch only on the gag beat;
  diagonal compositions; the camera may go low or close.
- **Effects:** motion lines (2 or 3 parallel 4-unit strokes behind the moving thing, along its path), landing puffs,
  small white stars, effort arcs; at most two effect kinds per panel. No sweat drops, anger veins or other manga cues.
- **Faces:** big elastic expressions; brows do most of the work; the open gap-tooth mouth when straining or surprised.
- **Humour:** the loudest gag on the gag panels (the stack nearly toppling; the frozen tiptoe caught by a side-eye);
  every other panel gets one small reaction only.
- **Detail:** low to medium; a floor line and only the props the step needs.

### safety-card: Safety card

Calm like an airline safety card: a limited palette, pictogram clarity and one wink. Closest to the card the engineer
liked.
- **Line:** one uniform ink outline of 5 units on every shape, inner and outer; geometric construction (circles,
  capsules, rounded rects), no lumps.
- **Fill:** a limited palette: ink, white and cream, the skin, the hero's teal, cardboard, and sunny yellow only for
  lit things and the zone; at most 6 fill colours per panel besides the skin. No gradients, no texture.
- **Shading:** none, except a flat cast-shadow ellipse at 0.12 under figures; no highlights.
- **Views:** front or side at eye level, no perspective tricks; the hero the same size in every panel. Arrows are the
  main storytelling tool: one bold ink arrow (6 units, a filled rounded triangular head) per panel where motion or
  matching matters.
- **Faces:** simplified but kept: white oval eyes with pill pupils, short bar brows, the ball nose as a circle, a small
  line mouth or the gap grin; mostly neutral-pleasant.
- **Proportions:** 4.5 heads (more adult, card-like).
- **Humour:** deadpan: only the gag panel winks (the tilted top box; the sneaker's exaggerated tiptoe in an otherwise
  calm scene), with at most one motion mark.
- **Detail:** minimal; empty backgrounds except the wall, door, plate and floor line the step needs.

## 6. Hand-in

- Files (suggested; the task that starts you names the folder): `pages/card-art/<style-id>/delivery-1.svg` to
  `switches-4.svg`, and `pages/card-art/<style-id>/LICENCES.json` in the pattern of
  `pages/room-signs/systems/b/LICENCES.json`, for example
  `"delivery-1.svg": { "licence": "own work", "author": "prime-game-ui", "what": "how-to card art, Delivery step 1 (take), <style> style" }`.
- The contact sheets stay in your scratchpad; report their paths.
- Before you hand in, for every panel:
  1. Cover the caption: one short sentence about the picture matches the caption.
  2. One thing draws the eye first.
  3. The hero is identical (hair, clothes, skin) in all 8 panels.
  4. On `sheet-small.png` (160 x 120) the pictogram, the lamp state and the faces still read.
  5. The gag is only on `delivery-1` and `switches-3`, and the step reads without the joke.
  6. The checks in section 1 print nothing.
- A look detail you decided alone goes into your report marked "(agent)" so the manager can record it.
