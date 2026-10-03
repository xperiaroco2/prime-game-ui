# Toy style inventory: the raw material for tokens

Research date: 2026-10-03. Wave [prime-game-ui#5](https://github.com/xperiaroco2/prime-game-ui/issues/5) (DTCG tokens
and components for the chosen style, Toy), branch `tokens/5-toy-tokens`. Read-only: nothing downloaded, nothing in
`pages/` changed.

**Inputs:** `pages/styles/toy.css` (every rule), `pages/styles/motion-preview.css`, `pages/styles/meta.json`,
`pages/styles/check_styles.js`, `pages/wireframes/wireframes.html`, `docs/ui-decisions.md`,
`docs/research/2026-10-02-wave-1/lens-3-system.md` (section 3) and `lens-6-a11y.md`.

**Method:** a throwaway node 20 script (scratchpad, no packages) parsed every declaration of the two CSS files, ran
`node check_styles.js toy` from `pages/styles` (0 violations, all 18 pairs pass), computed 54 more contrast pairs with
the lint's own formula (WCAG 2 ratio, alpha composited in sRGB over the backdrop), and wrote
[`inventory.json`](inventory.json) next to this file. The JSON has every use with file and line; this page summarises.

**Conventions:** px are at the 1920×1080 frame (the pages write `calc(Ncqw / 19.2)`, which is N px there). `sN` is
wireframe screen N (`#sN` in `wireframes.html`), with its state names. Selectors drop the `body[data-style="toy"]`
prefix. Pair ids: `c1`–`c18` from the lint, `x1`–`x19` (text) and `n1`–`n35` (non-text) from this report. Godot
facts cite the 4.7.2 API dump (`D:\prime-game\tools\out\godot-api\4.7.2\extension_api.json`), the 4.7.2-stable
source or the 4.7 docs; "(unconfirmed)" marks the rest.

## 0. What matters most for the token design

1. **Colours: 21 palette variables, 5 context variables, and 7 colour values that bypass them:** `#F3EDF6`, `#E2D6EA`
   and `#4A3B55`, the two backdrops on `#261C30` (70% and 80%), the panel and map base `rgba(15,10,20,.6)`, and the map
   zone tint (yellow written as a literal `rgba(…,.55)`). The HUD plate is exactly plum ink at 86%. There are four dark plums within
   1.25:1 of each other (`#2A1F33`, `#1F1727`, `#261C30`, `#0F0A14`). Next to white and cream sit four pale lilacs
   within 1.30:1 of each other (`#F3EDF6`, `#E2D6EA`, lavender `#E9DFF0`, light track `#DCCFE4`). The row line
   `#E2D6EA` is only 1.07 to 1.08:1 from two of them. These are candidates to merge.
2. **Toy kept the wireframe's outer boxes.** Where a border got thicker, the padding shrank by the same amount
   (button 9/19 + 3 = the wireframe's 10/20 + 2). So the spacing that means something is **padding + border**: button
   12/22, field 10/16, chip 4/14, tab 10/16, card 14. In Godot, once a StyleBox's `content_margin_*` is set (≥ 0), it is
   used *instead of* the border width
   ([style_box.cpp](https://raw.githubusercontent.com/godotengine/godot/4.7.2-stable/scene/resources/style_box.cpp)).
   So the content margins should be generated from these outer values.
3. **The "toy base"** (a hard bottom shadow `0 N 0`, no blur) is the style's signature: 4, 5, 6 and 10 px, 1 px when
   pressed. `StyleBoxFlat` draws a shadow only when `shadow_size > 0`. It grows the shadow rect by `shadow_size` on
   every side and fades it to alpha 0 at the outer edge
   ([style_box_flat.cpp](https://raw.githubusercontent.com/godotengine/godot/4.7.2-stable/scene/resources/style_box_flat.cpp)).
   So a blur-0 base cannot be drawn exactly. The closest is `shadow_size = 1`, which adds a 1 px soft rim on all sides.
   The alternative is a separate base node. This needs a side-by-side check in the showcase.
4. **Press feedback moves the whole button** (`translateY`), which is not a StyleBox property. Godot 4.7.2 has
   `Control.offset_transform_position` with `offset_transform_visual_only`, which moves the drawing without moving the
   layout or the click area (dump, [Control docs](https://docs.godotengine.org/en/4.7/classes/class_control.html)).
   In the CSS, the pressed button travels 1 px further than its base, so its bottom edge drops 1 px. Cards shift down
   3 px together with their base instead of sinking onto it (section 3).
5. **The health colour differs between the preview and the game.** The CSS mixes in OKLab. The plan for Godot is
   `Color.lerp`, which interpolates sRGB components ([Color docs](https://docs.godotengine.org/en/4.7/classes/class_color.html)).
   At half health that gives `#C59E49` in the preview against `#AD9349` in the game. Both stay ≥ 3:1 on the dark track
   (the lowest is 3.13:1, sRGB at 22%). `Gradient` with `GRADIENT_COLOR_SPACE_OKLAB` exists in 4.7.2 if the preview
   colour is wanted (dump).
6. **Contrast:** all 18 lint pairs pass. Of the extra pairs, three matter:
   - Lilac dim text on `.dim` over a pure white wall (lens 6's worst case) is **3.93:1, a fail**. A 74% backdrop, or
     the 80% `.dim.more`, fixes it.
   - Muted plum on yellow is **4.20:1, a fail**. That is why `#4A3B55` exists.
   - Yellow tab, white tiles and the zone tint against cream or lavender are 1.09 to 1.48:1. They work only through
     their ink outlines.

   For lens 6's 7:1 high-contrast mode, muted plum, lilac on the dim backdrop, the NEW sticker and secondary text on
   white all fall short.
7. **Type:**
   - The effective sizes are 18, 20, 22, 24, 28, 36, 48, 64 and 96. `.t18` and `.t20` both render 20 px.
   - The swatch numbers are 14 px, below lens 6's 18 px floor.
   - HUD labels are 18 to 20 px, against lens 6's 24 px for HUD key text.
   - Letter-spacing is in em (−0.96 to +0.2 px), but Godot's `FontVariation.spacing_glyph` is an int (dump).
8. **Components:**
   - 29 live components and 2 dead ones (`.marker` and `.circ` are styled, but no frame uses them).
   - The engineer's showcase list is drawable from what exists. Missing everywhere: **disabled and focus states**, and
     static hover and pressed frames (hover and pressed exist only as live CSS).
9. **32 hacks to replace with classes:**
   - 9 preview-only selectors (`[style*=…]`, `:nth-child`, `:first-child`, `[data-in]`) carrying 9 `!important`
     declarations
   - context switches done by ancestor selectors
   - font-size classes acting as components (`.t96` is the title plate)
   - one wireframe pseudo-element (the muted mic's slash) still drawn under Toy

## 1. Colours

### 1.1 Palette variables (`toy.css` lines 12–32, on `.frame`)

| Variable | Value | meta.json name | Used by (selector → property; d/l = through a context variable in the dark/light context) | Pairs |
|---|---|---|---|---|
| `--toy-ink` | `#2A1F33` | Plum ink | Text on light (l); titles on light (l); the base under buttons on light (l); every outline in the skin: `.panel`, `.map`, `.t96`, `.btn`, `.btn.fill`, `.field`, `.chip.light`, `.panel .key`, `.tabs > div.on`, `.val .ar`, `.card`, `.dot`, how-to frames, `.room`, the zone, `.map .you`, `.cross`, `[data-bar]`; text of `.btn`, `.field`, `.chip.light`, `.key`, tabs, `.val`, `.card`, `.room`, `.t96`; the base of `.card` and `.tabs > div.on` written directly; slider fill `.panel .bar2 > i`; svg strokes and fills in panels and rooms; the swatch ring (`!important`) | c4 c6 c7 c14 c17 x4 x17 n10 n11 n12 n16 n26 |
| `--toy-night` | `#1F1727` | Night plum | `.frame.dark` background; the s6 inline overlay (`!important`) | c18 x7 x8 n14 n28 n29 |
| `--toy-plate` | `rgba(42,31,51,.86)` = ink @ 0.86 | HUD plate | Background of `.plate`, `.chip`, `.slot`, `.mic`, `.marker`, HUD bar-label plates | c1 c2 c3 c8 c9 c10 c15 x9–x13 n1 n2 n4 n5 n33–n35 |
| `--toy-plate-solid` | `#352A41` | Night plate | `.frame.dark .plate` background (loading tip); `.ring` disc | x6 n27 |
| `--toy-cream` | `#FFF4E2` | Cream | `.panel`, `.key`, `.cross`, `.room` backgrounds; text on dark (d); the line colour of ghost buttons and line chips on dark (d); text of `.plate`, `.chip`, `.slot`, `.mic`, bar labels | c1 c2 c4 c5 c11 c18 x6 x9 x13 x14 x19 n4 n14–n19 n22 n23 n25 n31 n32 |
| `--toy-white` | `#FFFFFF` | White | Faces of `.btn`, `.field`, `.panel .key`, `.setrow`, `.card`, how-to frames (`!important`), the unchecked radio (`!important`) | c7 x1 n18 n20 n30 |
| `--toy-yellow` | `#FFC23A` | Sunny yellow | Titles on dark (d); logo; `.t96` plate; the current checklist step; faces of `.btn.fill`, `.chip.light`, `.tabs > div.on`, `.val .ar`, `.card.on`, the checked radio (`!important`), `.circ`; outlines of `.slot.on`, `.ring`, `.marker`; the stamina fill | c6 c10 c12 x2 x3 x7 x11 x16 n1 n6 n17 n27 |
| `--toy-honey` | `#C98A10` | Honey | Only through `--toy-base` on dark: the base of `.btn` and `.btn.fill`, and their hover and pressed bases | n28 |
| `--toy-coral` | `#FF8466` | Coral | Logo `text-shadow`; the `.t96` base; the downed plate's edge; the NEW sticker | c14 n2 n3 n29 |
| `--toy-coral-deep` | `#D9482F` | Coral deep | `.map .you` face | n21 n22 |
| `--toy-mint` | `#3CC4A8` | Mint | `.bar2 > i` (loading, downed bleed-out, raising) | n9 |
| `--toy-mint-tint` | `#D5F4EC` | Mint tint | The 4th how-to frame (`:nth-child(4)`, `!important`) | x4 |
| `--toy-lavender` | `#E9DFF0` | Lavender | `.map` board; `.card.dimtext` (save your own) | c16 c17 x13 x17 n21 n24 |
| `--toy-track-light` | `#DCCFE4` | Light track | `.panel .bar2` (settings sliders) | n10 |
| `--toy-track-dark` | `#4A3C5C` | Dark track | `.bar2` and `[data-bar]` tracks | n6–n9 n13 |
| `--toy-muted` | `#64566F` | Muted plum | Dim text on light (l); text and outline of the quiet `?` key and the quiet card | c5 c16 x1 x3 x5 n31 n32 |
| `--toy-lilac` | `#D8CCE3` | Lilac | Dim text on dark (d); the idle slot label | c3 c13 x8 x10 x12 x15 x18 |
| `--toy-keyshade` | `#B9A8C7` | Key shade | `.key` edge on dark | n5 |
| `--toy-slotline` | `#9A8CA6` | Slot line | `.slot` idle outline | c15 n33 n34 |
| `--toy-health-full` | `#5BCB4E` | (not in meta.json) | Health fill at 100%, and one end of the `color-mix` | n7 |
| `--toy-health-empty` | `#FF5A44` | (not in meta.json) | The other end of the health `color-mix` | n8 |

### 1.2 Context variables

| Variable | Dark context (`.frame`) | Light context (`.panel`, `.map`) | Read by |
|---|---|---|---|
| `--toy-tx` | cream | ink | `.frame` and `.panel/.map` `color`; `.btn.ghost` and `.chip.line` text |
| `--toy-tx-muted` | lilac | muted plum | `.dimtext` |
| `--toy-tx-title` | yellow | ink | `.t28.b`, `.t36.b`, `.t48.b`, `.t64.b` |
| `--toy-line` | cream | ink | `.btn.ghost` and `.chip.line` outlines |
| `--toy-base` | honey | ink | the base of `.btn` (5 px) and `.btn.fill` (6 px), and their hover and pressed bases |

### 1.3 Hard-coded colours that bypass the variables

| Value | Where (toy.css line) | Note |
|---|---|---|
| `#F3EDF6` | `.panel .key.dimtext` background (195) | The quiet `?` key face. 1.06:1 against cream, so the muted outline carries the shape. A third near-white tint |
| `#E2D6EA` | `.setrow` bottom border (254) | The row divider. 1.07:1 against the light track and 1.08:1 against lavender: merge it into one of them |
| `#4A3B55` | `.card.on .dimtext` color (281) | Secondary text on yellow, 6.36:1. The muted plum would fail there (4.20:1). Needs a token such as `text.on-accent.muted` |
| `rgba(38,28,48,.70)` | `.dim` (91) | The menu backdrop. Its base `#261C30` is neither ink nor night. meta.json lists it, but it has no variable |
| `rgba(38,28,48,.80)` | `.dim.more` (92) | The deep backdrop, same base |
| `rgba(15,10,20,.6)` | `.panel` and `.map` box-shadow (122, 311) | The 10 px base under panels and the map board, written twice. Another dark plum, `#0F0A14`, not in meta.json |
| `rgba(255,194,58,.55)` | map zone background (324, `!important`) | Yellow at 55% written as a literal. The fill alone is 1.25:1 against a room; the 4 px ink outline makes the zone readable |
| `transparent` | `.chip` border, `.chip.line` and `.btn.ghost` fill, `.tabs > div` border | Keeps a 3 px border box so that selecting a chip or tab does not shift the layout |

`motion-preview.css` adds no colour: its shadows use `var(--toy-base)`.

### 1.4 Contrast

**The lint** (`node check_styles.js toy`, run from `pages/styles` on 2026-10-03):

```
== toy.css: 0 violation(s)
  info rules 70; box-shadow declarations 7; !important 9; preview-only selectors (:has, :nth-child, [style*=], [data-in], :first/last-child) 9
  -- contrast (main pairs marked *) --
  * ok    11.54 (min 4.5)  text (cream) on HUD plate, world 97  [#FFF4E2 on #393041]
  * ok    10.39 (min 4.5)  text (cream) on HUD plate, world C9  [#FFF4E2 on #403748]
  * ok     7.36 (min 4.5)  dim text (lilac) on HUD plate, world C9  [#D8CCE3 on #403748]
  * ok    14.37 (min 4.5)  text (plum ink) on cream panel  [#2A1F33 on #FFF4E2]
  * ok     6.22 (min 4.5)  dim text (muted plum) on cream panel  [#64566F on #FFF4E2]
  * ok     9.71 (min 4.5)  primary button: ink on yellow  [#2A1F33 on #FFC23A]
  * ok    15.65 (min 4.5)  secondary button: ink on white  [#2A1F33 on #FFFFFF]
  * ok     4.30 (min 3)  HUD plate vs world 97  [#393041 on #979797]
  * ok     6.83 (min 3)  HUD plate vs world C9  [#403748 on #C9C9C9]
    ok     7.02 (min 4.5)  title (yellow) on HUD plate, world C9  [#FFC23A on #403748]
    ok     7.12 (min 4.5)  menu text (cream) on .dim, world C9  [#FFF4E2 on #57505E]
    ok     4.81 (min 3)  logo and menu selection (yellow, large) on .dim, world C9  [#FFC23A on #57505E]
    ok     5.04 (min 4.5)  dim text (lilac) on .dim, world C9  [#D8CCE3 on #57505E]
    ok     6.51 (min 4.5)  NEW sticker: ink on coral  [#2A1F33 on #FF8466]
    ok     3.60 (min 3)  idle slot outline on slot plate, world C9  [#9A8CA6 on #403748]
    ok     5.25 (min 4.5)  map secondary text on lavender board  [#64566F on #E9DFF0]
    ok    12.13 (min 3)  you-are-here marker outline on map  [#2A1F33 on #E9DFF0]
    ok    15.94 (min 4.5)  ghost text (cream) on night  [#FFF4E2 on #1F1727]
ALL CLEAN
```

**Extra pairs** (this report). All 72 pairs, with their hex values, are in the JSON under `contrast_pairs`. Lens 6 sets the targets: 4.5:1
for text, 3:1 for large text (36 px and up) and for non-text UI, and 7:1 for a high-contrast mode. It also says to
measure over the lowest-contrast part of the background, so a pure white world (`#FFFFFF`) is added to the lint's
two world samples, `#C9C9C9` and `#979797`.

| Id | Pair | Ratio | Result |
|---|---|---|---|
| x1 | muted plum on white (idle preset card, setting-row tile) | 6.77 | ok |
| x2 | `#4A3B55` on yellow (selected card) | 6.36 | ok |
| x3 | muted plum on yellow (if the variable were used) | **4.20** | **fail** |
| x4 | ink on mint tint (done how-to frame) | 13.40 | ok |
| x5 | muted plum on `#F3EDF6` (quiet `?` key) | 5.88 | ok |
| x6 | cream on night plate (loading tip) | 12.37 | ok |
| x7 | yellow titles on night | 10.77 | ok |
| x8 | lilac dim text on night | 11.29 | ok |
| x9 / x10 / x11 | cream / lilac / yellow on the HUD plate over a white world | 9.25 / 6.55 / 6.25 | ok |
| x12 | idle slot label (lilac) on the slot plate, world 97 | 8.18 | ok |
| x13 | the "you are here" chip: cream on the plate over lavender | 9.83 | ok |
| x14 | cream on `.dim` over a white world | 5.54 | ok |
| x15 | **lilac on `.dim` over a white world** (main-menu "Name" label, version) | **3.93** | **fail** (a 74% backdrop would pass) |
| x16 | yellow, large, on `.dim` over a white world | 3.74 | ok (min 3) |
| x18 / x19 | lilac / cream on `.dim.more` over a white world | 5.55 / 7.83 | ok |
| n1 | selected slot outline (yellow) vs the plate | 7.02 | ok |
| n2 / n3 | downed edge (coral) vs the plate / vs the world C9 | 4.71 / 1.45 | ok against the plate it borders |
| n4 / n5 | keycap face / key-shade edge vs the plate | 10.39 / 5.11 | ok |
| n6 / n7 / n8 / n9 | stamina yellow / health full / health empty / mint vs the dark track | 6.23 / 4.83 / 3.25 / 4.61 | ok |
| n10 | slider fill (ink) vs the light track | 10.50 | ok |
| n11 / n12 / n13 | HUD bar outline (ink) vs world C9 / 97; dark track vs C9 | 9.45 / 5.36 / 6.06 | ok |
| n14 / n15 / n16 | ghost and line outline: cream vs night / cream vs `.dim` / ink vs cream | 15.94 / 7.12 / 14.37 | ok |
| n17 | yellow selected tab vs the cream panel | **1.48** | carried by the 3 px ink outline |
| n18 | white card, field and row faces vs the cream panel | **1.09** | carried by the outline or the row line |
| n19 / n20 | row line `#E2D6EA` vs cream / vs the white row | **1.28 / 1.40** | decorative; below 3:1 |
| n21 / n22 | you-are-here pin vs lavender / vs the cream Hall tile it sits on in s8 | 3.31 / 3.92 | ok |
| n23 / n24 | zone tint vs a cream room / vs lavender | **1.25 / 1.15** | carried by the 4 px ink outline |
| n25 / n26 | crosshair face (cream) / outline (ink) vs world C9 | 1.52 / 9.45 | two-tone works, as lens 6 asks |
| n27 | spinner arc (yellow) vs its night disc | 8.36 | ok |
| n28 / n29 | honey base / coral base vs night | 5.89 / 7.23 | ok |
| n30 | white field face vs `.dim` (main-menu name field) | 7.75 | ok |
| n31 / n32 | muted outline of the quiet key and card vs cream | 6.22 | ok |
| n33 / n34 | idle slot outline vs the plate, world 97 / white | 3.99 / 3.20 | ok |
| n35 | HUD plate vs a white world | 10.07 | ok |

**Health fill** (`[data-bar="health"] > i`, the CSS preview against the Godot plan written in the toy.css comment):

| Health | CSS `color-mix(in oklab)` | on the track | Godot `Color.lerp` (sRGB components) | on the track |
|---|---|---|---|---|
| 100% | `#5BCB4E` | 4.83 | `#5BCB4E` | 4.83 |
| 80% (s7) | `#92BA4C` | 4.48 | `#7CB44C` | 4.07 |
| 50% | `#C59E49` | 3.99 | `#AD9349` | 3.35 |
| 22% (s7 hurt) | `#E87D46` | 3.56 | `#DB7346` | 3.13 |
| 0% | `#FF5A44` | 3.25 | `#FF5A44` | 3.25 |

**Against the 7:1 high-contrast target (lens 6):** these pairs pass 7:1 today: c1–c4, c6, c7, c10, c11, c18, x4,
x6–x9, x12–x13. These do not:
- muted plum on cream (6.22), on lavender (5.25) and on white (6.77)
- lilac on `.dim` (5.04), and on the plate over a white wall (6.55)
- yellow on `.dim` (4.81), and on the plate over a white wall (6.25)
- cream on `.dim` over a white wall (5.54)
- the NEW sticker (6.51), `#4A3B55` on yellow (6.36) and the quiet key (5.88)

A `contrast: high` modifier would override the muted and dim text tokens, the backdrop alpha and the plate alpha.

### 1.5 Wireframe colours still drawn under Toy

- **The muted mic's slash:** `.mic.off::after`, `#F2F2F2`, a pseudo-element the skin does not restyle. The toy.css
  comment plans a crossed-mic icon tinted coral instead.
- **The swatches:** ten placeholder greys on `.dot` (inline), from `#F2F2F2` to `#2C2C2C`, with white numbers on
  6 to 10. The body colours are not decided.
- **World mocks, not UI:**
  - the frame's world gradient (`#D4D4D4` to `#979797`; the lint samples `#C9C9C9` and `#979797`)
  - `.sil` `#4A4A4A`
  - the `.vignette` radial gradient (a shader in Godot)
  - the s7 carried package (`#8C8C8C`, `#6E6E6E`, `#F2F2F2`, `#111`)
  - `.worldtag` and the s7 annotation (black at 35% and 55%)

### 1.6 Drift between toy.css and meta.json

- **meta.json is behind toy.css:**
  - It has no entry for `--toy-health-full`, `--toy-health-empty`, `#F3EDF6`, `#E2D6EA`, `#4A3B55` or the panel base.
  - Its Mint entry still says mint fills health and stamina. Since 2026-10-03 those bars are green-to-red and
    yellow (`docs/ui-decisions.md`, Round HUD).
  - Its `pitch_en` still promises "slightly tilted title plates", which were rejected (Style).
- **Stale comments in toy.css:**
  - The header still allows "rotation of whole elements". Only the map pin is rotated.
  - The `--toy-honey` comment says "under yellow buttons on dark", but it is also the base of white secondary
    buttons on dark.

## 2. Dimensions (px at 1920×1080)

### 2.1 Border widths

| px | Uses |
|---|---|
| 0 | `.ring` bottom and left (the spinner's gap) |
| 2 | `.key` top and sides; `.cross`; `.val .ar` (stepper); `.dot` (swatch and radio) |
| 3 | `.btn`, `.field`, `.chip` (also when transparent), `.slot` idle, `.tabs > div`, `.setrow` bottom, `.card`, how-to frames, `.room`, `.map .you`, `[data-bar]` |
| 4 | `.t96` title plate, the downed plate, `.panel`, `.card.on`, `.map`, the map zone |
| 5 | `.key` bottom (the keycap's thick lower edge), `.slot.on` |
| 10 | `.ring` top and right (the spinner arc) |

**Candidate scale:** 2 thin, 3 control, 4 surface and selection, 5 emphasis. The 10 is a stroke thickness, not an
outline. The wireframe used 2 almost everywhere. Toy raised controls to 3 and surfaces to 4, and selection adds +1
(card 3→4, slot 3→5).

### 2.2 Corner radii

| px | Uses |
|---|---|
| 6 | `[data-bar] > i` (the HUD bar fill; on a 10 px fill it acts as a pill) |
| 8 | `.key`, HUD bar-label plates |
| 10 | `[data-bar]` track |
| 12 | `.field`, `.setrow`, `.room`, the map zone |
| 14 | `.tabs > div`; three corners of `.map .you` (the fourth is 0: the pin's point) |
| 16 | `.plate`, `.card`, how-to frames (`!important` over the inline 10) |
| 18 | `.btn`, `.slot` |
| 24 | `.panel`, `.map` |
| 26 | `.t96` title plate |
| pill | `.val .ar` 999px (Toy); `.chip` 999px and generic `.bar2` 99px (wireframe) |
| circle | `.dot`, `.mic`, `.ring`, `.cross` 50% (wireframe); the `?` keys (inline 50%) |

**Candidate scale:** 8 / 12 / 16 / 24 (each used by at least two components), plus pill and circle.

**Odd values:**
- 6 and 10: the HUD bar is derived. Its fill radius is the track radius minus the border, minus 1.
- 14: tabs and the pin.
- 18: the two most visible controls, button and slot. Either a step of its own or moved to 16.
- 26: the title plate.

**Pill and circle values:** in Godot, radii are ints that `StyleBoxFlat` scales down to fit the box (`adapt_values`
in [style_box_flat.cpp](https://raw.githubusercontent.com/godotengine/godot/4.7.2-stable/scene/resources/style_box_flat.cpp)).
So "pill" can be any int of at least half the height. "50%" is tier C in lens 3, so the tokens should state an int.

### 2.3 Space (padding, margin, gap)

**Toy's own values** are mostly "the wireframe minus the extra border", so the outer value is the one to keep:

| Component | Toy padding (block / inline) | Border | Outer = padding + border | Wireframe outer |
|---|---|---|---|---|
| `.btn` | 9 / 19 | 3 | **12 / 22** | 10+2 / 20+2 = 12 / 22 |
| `.field` | 7 / 13 | 3 | **10 / 16** | 8+2 / 14+2 = 10 / 16 |
| `.chip`, `.chip.light` | 1 / 11 | 3 | **4 / 14** | 4 / 14 (no border) |
| `.chip.line` | 1 / 11 | 3 | 4 / 14 | 4+2 / 14+2 = 6 / 16 (Toy made it 2 px smaller per side to match the other chips) |
| `.tabs > div` | 7 / 13 | 3 | **10 / 16** | 10 / 16 |
| `.setrow` | 8 top, 14 sides, 6 bottom | 3 bottom | **8 / 14 / 9** | 8 / 0 / 8+1 (Toy adds 14 at the sides) |
| `.card` | 11 | 3 | **14** | 12+2 = 14 |
| `.card.on` | 12 | 4 | **16** | 12+4 = 16 (the selected card is 2 px larger per side than an idle one; inherited) |
| `.val .ar` | 0 / 8 | 2 | 2 / 10 | text only |
| HUD bar label | 0 / 8 | 0 | 0 / 8 | text only |
| `.t96` | 0 / 32 | 4 | 4 / 36; the margin −4 / −36 cancels it | text only |
| `.slot` | 4 (wireframe) | 3, on 5 | 7, on 9 | 6, on 8 |
| `.room` | 6 (wireframe) | 3 | 9 | 6+3 = 9 |
| how-to frame | 10 (inline) | 3 | 13 | 10 |
| `.plate` | 10 / 18 (wireframe) | 0, downed 4 | 10 / 18, downed 14 / 22 (the edge is not compensated) | 10 / 18 |
| `.panel` | 22–36 (inline) | 4 | +4 | +2 |

**Wireframe values Toy keeps:**
- **Gaps:** `.col` 10, `.row` 12, `.tabs` 8, `.setrow` 12, `.val` 14.
- **Panel paddings (inline):** 36 (invite), 28 (join), 24 (Esc, with a gap of 24), 26 (task list), 22 (how-to card).
- **Other inline gaps:** 4, 6, 8, 10, 12, 20, 32 and 36.
- **Inline margins:** 6, 8, 10, 12, 14, 18 and 40.

By count, 10 is the most common, then 8, 12 and 14; 4, 16, 22 and 24 follow.

**Candidate space scale:** a 2 px step named by use, or a 4 px grid (4, 8, 12, 16, 20, 24, 28, 32, 36, 40) plus 10
and 14, which are too frequent to drop. 6, 18, 22 and 26 also fall between grid steps. Toy's compensated paddings
(1, 7, 9, 11, 13, 19) should not become tokens: they come out as outer value minus border.

### 2.4 Type

| Class | Wireframe | Toy | Uses in frames | What it is used for |
|---|---|---|---|---|
| `.t16` | 16 | **18** (+12.5%) | 12 | HUD bar labels, slot labels, NEW, zone label, you-are-here chip, map note, version, Esc tab footer |
| `.t18` | 18 | **20** (+11%) | 15 | Dim captions: step count, "how to", port hint, checklist, lobby name, hints |
| `.t20` | 20 | 20 | 45 | Ghost buttons, chips, lists, how-to captions, dim labels, object name, setting values |
| `.t22` | 22 | 22 | 17 | Body: invite text, tutorial instruction, name row, setting rows, loading tip, downed text |
| `.t24` | 24 | 24 | 18 | Primary buttons, task rows, Esc tabs, goals, countdown text |
| `.t28` | 28 | 28 | 9 | Main-menu items, join title, connect title, loading-with-card title |
| `.t36` | 36 | 36 | 19 | Panel titles, step title, countdown, raising, spectating, end subtitle |
| `.t48` | 48 | 48 | 4 | Round timer, "You're down" |
| `.t64` | 64 | 64 | 3 | Logo, role in the Esc menu |
| `.t96` | 96 | 96 | 4 | Title plates (role reveal, winner) |
| `.room` | 16 | **18** | 6 rooms | Map room names |
| `.dot` | 14 | 14 (kept) | 12 | Swatch numbers, radio glyph: **below the 18 px floor** |
| `.mic` | 22 | 22 | 3 | The emoji glyph (an icon in Godot) |

- **Sizes:** the distinct steps are 18, 20, 22, 24, 28, 36, 48, 64 and 96. They meet lens 6's 18 px floor, except the
  swatch numbers.
- **HUD text:** lens 6 asks for 24 px HUD key text. The Toy HUD uses 18 (bar and slot labels), 20 (role chip, object
  name), 22 (hints), 36 and 48 (timers).
- **Weights:**
  - 600 is the base (`.frame`) and the ghost button.
  - 700 is `.b`, every size from 36 up, `.btn`, `.field`, the selected tab, the stepper and `.room`. The wireframe's
    `.key`, `.dot` and `.val` are 700 too.
  - `<b>` inside 600 text resolves to 900 ([CSS Fonts 4](https://www.w3.org/TR/css-fonts-4/), relative weights:
    550–749 → 900).
  - Comfortaa ships 300–700 (`docs/research/2026-10-02-fonts/verified.md`), so it renders 700 (unconfirmed:
    browser weight matching).
  - In Godot: two weights from the variable font through `FontVariation.variation_opentype` (lens 3).
- **Letter-spacing:**
  - +0.01em on `.t16` and `.t18`: +0.18 and +0.2 px.
  - −0.01em on 36, 48, 64 and 96: −0.36, −0.48, −0.64 and −0.96 px.
  - `FontVariation.spacing_glyph` is an `int` in the 4.7.2 dump, so in the game these round to 0 (or −1 at 64 and
    96). The tokens should state int px.
- **Line height:** 1.25, unitless, from the wireframe `.frame`. Godot's `line_spacing` is extra px (lens 3), so the
  generator must convert it per size.

### 2.5 Elevation: the toy base (offset y of a blur-0 shadow)

| px | Uses | Colour |
|---|---|---|
| 1 | pressed buttons (motion preview) | `--toy-base` |
| 4 | `.tabs > div.on` | ink (direct) |
| 5 | `.btn`, `.card` | `--toy-base` / ink (direct) |
| 6 | `.btn.fill`; `.btn` on hover; the logo's `text-shadow` extrusion | `--toy-base`; coral |
| 7 | `.btn.fill` on hover | `--toy-base` |
| 10 | `.panel`, `.map`, `.t96` | `rgba(15,10,20,.6)`; coral |

**Candidate:** small 4–5 (could become one value), medium 6, large 10, pressed 1, hover = rest + 1. All are
`0 N 0` with no blur. See finding 3 for the Godot constraint.

### 2.6 Component sizes

| Size | px | Source |
|---|---|---|
| HUD bar (`[data-bar]`) | 16 tall (inner 10 after the 3 px borders) | Toy |
| Generic bar (`.bar2`: loading, downed, raising, sliders) | 10 tall, pill | wireframe |
| Slot | 84 × 84; wide 180 | wireframe |
| You-are-here pin | 28 × 28, rotated 80° | Toy |
| Swatch and radio (`.dot`) | 26 | wireframe |
| Mic | 46 | wireframe |
| Spinner | 90 | wireframe |
| Crosshair | 8 (margin −4) | wireframe |
| Keycap | min-width 1.6em, padding 0 .35em (32–38 px and 7–8.4 px at 20–24 px text) | wireframe |
| Room pictogram | 26 wide | inline |
| Teammate list | max-height 250 | inline |
| `.marker` and `.circ` | 34 and 26 | unused |

### 2.7 Odd values that fit no scale

- **Compensated paddings:** 1, 7, 9, 11, 13 and 19. Generate them from outer value minus border.
- **Radii:** 6, 10, 14, 18 and 26.
- **The pressed-button travel:** 5 and 6 px, against a rest base of 5 and 6 (section 3).
- **Swatch numbers:** the 14 px text.
- **The spinner's 10 px arc**, and the `.mic.off` slash (4 px, a pseudo-element).
- **Sizes in em:** the keycap's padding and min-width. Lens 3 lists em sizes inside components as not Godot-safe.
- **Pills and circles:** 999px, 99px and 50% need concrete ints.

## 3. Motion

| What | Where | Values |
|---|---|---|
| Hover lift | `.btn:not(.ghost):hover`, `.btn.fill:hover` (motion-preview.css 9, 13) | The face rises 1 px and the base grows 5→6 (secondary) or 6→7 (primary), so the base's bottom edge stays put |
| Press sink | `.btn:not(.ghost):active` (16), `.btn.fill:active` (20) | The face moves down 5 px (secondary) or 6 px (primary) and the base becomes 1 px. The face travels its whole rest base and keeps 1 px, so the bottom edge ends **1 px lower** than at rest. A travel of base − 1 (4 or 5 px) would keep it fixed. Which is intended is open |
| Card press | `.card:active` (23) | `translateY(3px)`; the 5 px base is unchanged, so the card and its base shift together. The quiet card (no base) shifts too. Cards have no hover |
| Timing | `.btn:not(.ghost)`, `.card` (4–7) | `transition: transform 70ms ease-out, box-shadow 70ms ease-out`. `ease-out` is `cubic-bezier(0, 0, 0.58, 1)` ([CSS Easing 1](https://www.w3.org/TR/css-easing-1/)). Plan in the comment: a short Tween, about 70 ms. `Tween` offers only `TRANS_*` × `EASE_*` pairs (dump; lens 3), so the token needs a Godot pair in `$extensions` next to the cubic-bezier |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` (26–28) | `transition: none`; the offsets still apply, instantly. Godot: `DisplayServer.accessibility_should_reduce_animation()` exists in the 4.7.2 dump; lens 6 proposes zero-duration tokens or `Tween.set_speed_scale` |
| No feedback | `.btn.ghost`, `.tabs > div`, `.val .ar`, interactive `.chip`s, the `?` keys, `.field`, swatches and radios | No hover or press feedback. `cursor: pointer` only on `.btn:not(.ghost)` and `.card` |
| Static rotation | `.map .you` `rotate(80deg)` (toy.css 336) | A facing angle in the frame, `Control.rotation` at runtime; not a token. No tilt rules remain |
| Not yet specified | screens | Spinner rotation; the ~3 s intro and outro fades; panel open and close (Esc, the map on M); tab switch; bar fill and health colour changes; the hold-to-give-up progress (F); countdowns; the 3 s protection chip |

**Godot mapping options for the sink:**
- `pressed` and `hover` StyleBoxes with a different shadow offset, plus `Control.offset_transform_position` with
  `offset_transform_visual_only` for the face. The properties are in the dump; the
  [Control docs](https://docs.godotengine.org/en/4.7/classes/class_control.html) describe them as visual only, leaving
  layout and the click area alone.
- Content and expand margins in the StyleBox. Whether negative expand margins work is unconfirmed.

## 4. Components, variants and states

Showcase items the engineer listed are marked **(showcase)**.

| Component | Wireframe classes | Variants | States shown (frames) | States missing for a full component |
|---|---|---|---|---|
| **Button (showcase)** | `.btn`, `.btn.fill`, `.btn.ghost` + `.t20/.t22/.t24`, `.b` | primary (yellow, base 6), secondary (white, base 5), ghost (no fill, context line, no base, 600); base honey on dark and ink on light; text 20, 22 or 24 | normal: s1 invite, s2 join, s3 conn and fail (on night), s5 host and game, s8 guide; hover and pressed live only (motion preview) | **disabled**; **focus** (lens 6: ≥ 2 px ring with a 3:1 change, 3 px proposed); hover_pressed for toggles (Ready); ghost hover and pressed; secondary on dark (in no frame); danger for Leave and Quit (lens 3); icon button; static hover and pressed frames |
| Main-menu item | `.t28`, `.t28.b` with "▸" in the text | idle (cream), selected (yellow bold ▸) | s2 main, join | hover vs keyboard focus, pressed, disabled |
| **Chip (showcase)** | `.chip`, `.chip.light`, `.chip.line`, `.panel .chip.light.t16` | plate, light (yellow + ink outline), line (outline), NEW sticker (coral, panels only) | role (s6 after, s7); ready no and yes (s4); language selected and idle (s1); settings sub-tabs (s5 set, lang); guide list selection (s5 manual); lock note (s5 charr); zone label (s8 zone); you-are-here (s8); Protected 3 s (s9 back); NEW (s8) | hover, focus and pressed for the interactive uses; disabled; NEW on dark; icon chips (the lock is an emoji, the mark a glyph) |
| **Keycap (showcase)** | `.key`, `.panel .key`, `.panel .key.dimtext`, inline `border-radius:50%` | on dark (cream, key shade 2/2/5), on light (white, ink), quiet on light (`#F3EDF6`, muted), round `?` | E (s1 step), F (s9 down), `?` normal and quiet (s8) | wide keys (Space, Shift, Tab, Esc); mouse glyphs (lens 3); quiet on dark; held with a progress ring for "Hold F" (lens 6); the `?` as a pressable control (hover, focus, pressed); unbound key |
| **Slot (showcase)** | `.slot`, `.slot.on`, `.slot.wide`, `.slot.dimtext` + `.t16`, `.b` | square 84, wide 180 (two hands); idle (3 px slot line), active (5 px yellow) | hand active and empty (s7 empty, tired, hurt, mate); hand active, two-handed and filled (s7 pack); belt idle and empty (all s7) | filled one-handed with an item icon (tier B art); belt filled; belt active with the hand idle; an empty-vs-filled cue that does not rely on the placeholder words |
| **Bar (showcase)** | `.bar2 > i`, `.panel .bar2 > i`, `[data-bar="health"] > i` + inline `--hp`, `[data-bar="stamina"] > i` | HUD health (16 px, ink outline, green to red), HUD stamina (yellow), progress on dark (10 px pill, mint), slider in panels (ink on the light track) | health 80% and 22%; stamina 90% and 18%; loading 62%; downed 70%; raising 60%; sliders 70, 55 and 40% | 0% and 100%; the in-between health colours; fills narrower than twice their radius; a low-stamina emphasis; the slider grabber (tier B) with hover, focus and drag; disabled; the mic test as a live level meter |
| **Panel (showcase)** | `.panel`, nested `.panel .panel` (s5 manual), inline padding 22–36 | dialog (s1, s2), menu (s5), task list (s8), how-to card (s3, s5, s8) | normal | a confirm dialog with a danger button (lens 3); a scroll container and scrollbar (the teammate list scrolls, s5 roled); focus handling; open and close motion |
| HUD plate | `.plate`, `.frame.dark .plate`, `.plate.col[data-in="down"]`, bar-label plates | over the world (ink 86%), on night (solid), alert (4 px coral), mini label (radius 8) | timer; object name; tutorial step and checklist; player list; lobby status; loading tip; downed, raising and give-up; spectating; bar labels | backplate opacity 70–100% (lens 6); high contrast; toast (lens 3); caption plate (lens 6) |
| Backdrop | `.dim`, `.dim.more`, `.frame.dark`, inline `#0E0E0E` overlay | 70%, 80%, night | s1, s2 (`.dim`); s5, s8 (`.dim.more`); s8 guide (`.dim` over `.dim.more`); s3, s10, s6 (night) | intro and outro fades; a defined value for the stacked double dim; ≥ 74% for lilac over white walls |
| Title plate | `.t96` | role reveal, round end | s6 eng and dis; s10 win and lose | a two-line wrap for long Ukrainian titles; appear motion |
| Logo | `.abs.col:not(.panel) > .t64:first-child` | yellow, 6 px coral extrusion | s2 | the real logotype (art) |
| Text roles | `.t16`…`.t96`, `.b`, `.dimtext`, `.t28.b`–`.t64.b` | 9 sizes, dim, title colour by context | every frame | tabular figures for timers (lens 3); outlined HUD text without a plate (lens 3); large-text mode up to 200% (lens 6) |
| Field | `.field` + `.t20/.t24` | text input (name, address, lobby name), dropdown (mic) | normal with a value: s2 main (on the backdrop), s2 join, s5 host, char, set | focus with caret and ring; placeholder; read_only (the guest gets plain text); disabled; error (bad address); selection colour; an open dropdown list |
| Esc tabs | `.tabs > div`, `.on` (`data-on`); the footer `.t16.dimtext` | idle (ink, transparent 3 px border), selected (yellow, ink outline, 4 px base, bold) | selected and idle in every s5 state | hover, focus, pressed, disabled |
| Setting row | `.setrow`, `.val` and their content | with a text field, stepper, read-only value, dropdown, slider, or a value with a dim alternative | s5 host, guest, set | a hover and focus highlight (keyboard or gamepad); a toggle row; a locked row for the guest |
| Stepper | `.val .ar` (‹ ›) | yellow pill, 2 px ink outline | normal (s5 host) | hover, pressed, disabled at min or max, focus |
| Preset card | `.card`, `.card.on`, `.card.dimtext` | idle (white, base 5), selected (yellow, 4 px outline), quiet "Save your own" (lavender, no base) | idle, selected and quiet (s5 host); pressed live only | hover; focus; disabled (the guest sees a text line); one outer size for idle and selected |
| Swatch | `.dot` + inline greys, inline outline ring | 10 placeholders with numbers; selected ring (4 px at a 3 px offset) | s5 char, charr | the real colours (not decided); symbols (lens 6); taken by another player; hover and focus; numbers ≥ 18 px |
| Radio | `.dot` with an inline `#EDEDED` (checked) or `#555` (unchecked) | checked (yellow "●"), unchecked (white) | s5 lang | hover, focus, disabled; a proper radio icon (tier B, lens 3) |
| **How-to card (showcase)** | `.panel.col` (padding 22) + a title row + `.col.c[style*="#1C1C1C"]` × 4 with svg and a `.t20.b` caption | frame normal (white, 3 px ink, radius 16), frame done (mint tint, the 4th) | on night (s3 loadcard); nested in the Esc panel (s5 manual); over the backdrop with a ghost Close (s8 guide) | a 3-frame card; a done frame that is not the 4th; the card list in the Guide tab; frame art (tier B) |
| Map board | `.map`, `.room`, `.room svg`, the zone, the you-are-here chip, the note | board (lavender, 4 px, radius 24, base 10), room tile (cream, 3 px, radius 12, 18 px bold), zone (yellow 55% + 4 px ink) | six rooms, one with a pictogram (s8 list); one zone lit (s8 zone) | a zone over several rooms; the room pictogram set shared with packages and doors |
| You-are-here pin | `.map .you` | a 28 px coral-deep square, 3 px ink, radii 0/14/14/14 | rotated 80° (s8) | other angles at runtime |
| Mic | `.mic`, `.mic.off` (the wireframe's `::after`) | on (a plate circle with the emoji), off (a light grey slash) | on (s4, s7), off (s9 down, raise) | talking; push-to-talk held; the crossed-mic icon in coral (planned, not drawn); a who-is-talking indicator (lens 6) |
| Crosshair | `.cross` | an 8 px cream dot with a 2 px ink outline | s1 step, s4, s6 after, s7, s9 back | a state over interactables (if any); style and colour options (lens 6) |
| Spinner | `.ring` | a 90 px night disc with a 10 px yellow arc on two sides | static (s3 conn) | rotation; a reduced-motion alternative |
| Name plate | `.chip.t20.b` + "◈" | a plate chip with the teammate mark | s7 mate | a plain plate; talking; distance fade; the mark as an icon |
| Tutorial checklist | `.plate.col.t18` children | done ✓ (cream), current • (bold yellow), upcoming (lilac) | s1 step | all done; scroll |
| Player row | `.row.between` in the s4 plate and the s5 lobby column | ready ✓, not ready "—" (dim), host label | s4 wait, count; s5 host, guest | talking, muted, disconnected |
| Timer and countdown | `.plate.c > .t48.b`; `.t36.b`; `.t24.b` | round timer (48 yellow), lobby countdown (36), waiting line (24) | s4, s6 after, s7, s9 back | a low-time warning; tabular figures |
| `.marker` (dead) | `.marker` | styled, unused | none | drop: destination markers were removed by decision |
| `.circ` (dead) | `.circ` | styled, unused | none | drop: the map shows no circles by decision |

## 5. Contexts

- **Dark (the default, on `.frame`).**
  - **Text variables:** cream text, lilac dim text, yellow titles, cream lines, honey base.
  - **Surfaces over the world:** `.plate`, `.chip`, `.slot`, `.mic` and the bar labels at `--toy-plate` (ink 86%).
  - **Menu backdrops:** `.dim` (70%) and `.dim.more` (80%) of `#261C30`.
  - **Frames:** the s1 invite language chips, s2's main menu, and the HUD of s1 step, s4, s6 after, s7 and s9.
- **Night (a sub-context of dark).**
  - **Where:** `.frame.dark` (s3, s10) and the inline `#0E0E0E` overlay in s6. Both become `--toy-night`.
  - **What changes:** the text variables stay the same, and `.frame.dark .plate` turns solid `#352A41` (the loading
    tip). The s6 overlay is not `.frame.dark`, so a plate drawn there would stay translucent; none is.
- **Light (`.panel`, `.map`).**
  - **Text variables:** ink text, muted-plum dim text, ink titles, ink lines, ink base.
  - **Surfaces:** cream panels (Esc, dialogs, the task list, how-to cards) and the lavender map board. White tiles
    sit inside them: `.btn`, `.field`, `.setrow`, `.card`, `.panel .key` and the how-to frames.
- **The switching variables** are `--toy-tx`, `--toy-tx-muted`, `--toy-tx-title`, `--toy-line` and `--toy-base`
  (table 1.2). Only text, ghost and line outlines, titles and the button base follow them.
- **Not context-aware:**
  - **Fixed colours:** `.plate`, `.chip` (plate), `.chip.light`, `.slot`, `.mic`, `.cross`, `.ring`, `.field`,
    `.card`, tabs, `.setrow`, `.val`, `.room`, the pin and `.t96` set their own colours wherever they are. The
    you-are-here chip keeps its dark plate on the light map (9.83:1).
  - **Switched by an ancestor selector instead of a variable:** `.panel .chip.light.t16` (NEW), `.panel .key` and
    `.panel .key.dimtext`, `.panel .bar2` (slider), `.frame.dark .plate`, and `.panel svg` / `.room svg`.
  - **The base written as ink:** cards and the selected tab use `var(--toy-ink)` for their base, not `--toy-base`.
    They only appear in the light context, where the two are equal.
- **For the tokens:** a resolver modifier is not needed for these contexts. They are surfaces inside one theme, so they
  become semantic token pairs (`text.on-dark` / `text.on-light`, `line.*`, `base.*`). In Godot, each pair is a
  separate type variation (for example a dark and a light ghost button). Lens 3 already proposes no light/dark
  modifier.

## 6. Hacks the tokenised components should replace

| Selector (file:line) | Kind | What it does | Replace with |
|---|---|---|---|
| `[style*="background:#0E0E0E"]` (toy.css:89) | `[style*=]` + `!important` | Repaints the s6 pre-game overlay night | a backdrop class, or `.frame.dark` |
| `.abs.col:not(.panel) > .t64:first-child` (69) | `:first-child`, `:not()` | Finds the game name to make it the logo | `.logo` |
| `.t96` (76) | a size class as a component | The 96 px class carries the whole title-plate surface and its negative margins | `.title-plate` |
| `.t28.b, .t36.b, .t48.b, .t64.b` (63) | size + weight as a role | Bold large text is recoloured as a title | `.title` (a text role) |
| `.plate.col.t18 > .b:not(.t20)` (103) | `:not()`, a size class | The bold child is the current tutorial step | `.checklist-item.current / .done / .upcoming` |
| `.plate.col[data-in="down"]` (105) | `[data-in]` (the wireframe's state switch) | The coral edge comes from the state attribute | `.plate.alert` |
| `.abs.col > .col > span.t16` (109) | a structural selector | Any 16 px span two columns deep becomes a label plate | `.hud-label` |
| `.panel .chip.light.t16` (177) | a size class as a variant | A small light chip in a panel becomes NEW | `.chip.new` |
| `.panel .key`, `.panel .key.dimtext` (190, 194) | ancestor context + a hard-coded colour | Keycaps change inside panels; the quiet face is `#F3EDF6` | `.key.on-light`, `.key.quiet` |
| inline `border-radius:50%` on `.key` (wireframes.html:441) | an inline style not overridden | The `?` keys are round because the inline radius beats Toy's 8 | `.key.round` or a help icon button |
| `.slot.dimtext` (207) | a text class as a state | The idle belt is marked by its dim label | `.slot.idle` |
| `.tabs > div`, `:not(.dimtext)` (239, 244) | a structural selector, `:not()` | Every child of `.tabs` gets tab padding and a border, including the footer note | `.tab` + a separate footer |
| `.setrow` border `#E2D6EA` (254) | a hard-coded colour | A divider outside the palette | a token |
| `.val .ar` (260) | text spans as controls | ‹ and › spans styled as stepper buttons | `.stepper` with two icon buttons |
| `.card.on .dimtext` (281) | a hard-coded colour | `#4A3B55` because muted plum fails on yellow | `text.on-accent.muted` |
| `.card.dimtext` (282) | a text class as a variant | The dim card is the quiet "Save your own" | `.card.add` |
| `.dot[style*="outline"]` (290) | `[style*=]` + `!important` | Recolours the selected swatch's inline ring | `.swatch.selected` |
| `.dot[style*="background:#EDEDED"]`, `[style*="background:#555"]` (291, 292) | `[style*=]` + `!important` | Radios found by their inline greys | `.radio`, `.radio.checked` |
| `.panel .row > .col.c[style*="#1C1C1C"]` (295) | `[style*=]` + 2 × `!important` | How-to frames found by their inline fill; the radius is forced | `.howto-frame` |
| `…:nth-child(4)` (300) | `:nth-child` + `!important` | The 4th frame is assumed to be "done" | `.howto-frame.done` |
| `.panel svg`, `.panel svg text`, `.room svg` (303, 304, 321) | overrides SVG presentation attributes | Pictograms follow the light context | an icon colour token (icon modulate in Godot) |
| `.map [style*="z-index:2"]` (323) | `[style*=]` + 2 × `!important` | The lit zone found by its z-index; replaces the stripes and the dashed border | `.map-zone.lit` |
| `.map .you` (330) | a restyle of another shape | The wireframe's per-side-colour triangle becomes a rotated square pin | `.pin` (rotation at runtime) |
| `.frame.dark .plate` (101) | ancestor context | Plates turn solid on night | a plate variant or a night context |
| `.panel .bar2` (216) | ancestor context | Any bar in a panel becomes a slider | `.slider` with a grabber |
| `[data-bar]` + inline `--hp` + `color-mix()` (348–359) | a data attribute, an inline custom property, a CSS colour function | HUD bars by attribute; health mixed in OKLab from an inline fraction | `.bar.health` / `.bar.stamina`; the fraction and colour at runtime (`Color.lerp` or `Gradient.sample`) |
| `.mic.off::after` (wireframes.html:114) | a pseudo-element left in place | The muted slash is the wireframe's light grey pseudo-element. CLAUDE.md forbids pseudo-element decoration in UI | `.mic.off` with a crossed-mic icon |
| `.bar2 { overflow: hidden }` (wireframes.html:85) | clipping | The track clips the fill in CSS; Godot's `clip_contents` is rectangular (lens 3) | a fill radius token (Toy has one only for `[data-bar]`) |
| `.key` padding `.35em`, min-width `1.6em` (wireframes.html:94) | sizes in em | Keycap size follows the text; not Godot-safe (lens 3) | px per key size |
| `.field` as a dropdown; `.chip` as sub-tabs; "▸" as selection; "‹ ›" in the spectate plate; emoji and "◈" as icons (wireframes.html) | reused classes and glyphs | Components borrowed for another job | `.dropdown`, `.subtab`, `.menu-item.selected`, icon tokens (tier B icons with licences) |
| `.marker`, `.circ` (233, 338) | dead rules | Styled; no frame uses them | remove |

The lint counts 9 preview-only selectors and 9 `!important` declarations (all in the rows above).

Gaps in the lint that the tokens step may want to close:
- `motion-preview.css` is outside the lint on purpose.
- The lint passes `box-shadow` with blur 0, but Godot needs `shadow_size > 0` (finding 3).
- It does not check that letter-spacing comes out as int px, or that em sizes appear in components.
- It samples the world at `#C9C9C9` and `#979797`, while lens 6 measures over white.

## 7. Open points for the token step (not decided here)

- **Look decisions (the humans'):**
  - Merging the near-duplicate plums and pale lilacs.
  - Whether buttons and slots keep radius 18.
  - One base size for the tab, button and card (4/5/6).
  - The health in-between colour: the OKLab preview or the sRGB lerp.
  - The 14 px swatch numbers.
  - HUD labels at 18–20 px against lens 6's 24.
  - Whether `.dim` rises to 74% or lilac gets lighter.
  - Disabled and focus looks.
- **Technical choices (the agent's, to report):**
  - Outer values as space tokens, with content margins generated from them.
  - How to draw the base (`shadow_size = 1` against a base node), compared in the showcase.
  - The sink as a visual-only offset transform.
  - Int letter-spacing.
  - Concrete ints for pills.
  - A Godot `TRANS_*`/`EASE_*` pair for 70 ms ease-out.

## Sources

- Godot 4.7.2-stable `StyleBoxFlat` source (shadow drawn only if `shadow_size > 0`, grown by `shadow_size`, faded to
  alpha 0; `get_style_margin` returns the border width; corner radii adapted to the box):
  https://raw.githubusercontent.com/godotengine/godot/4.7.2-stable/scene/resources/style_box_flat.cpp
- Godot 4.7.2-stable `StyleBox` source (`content_margin` defaults to −1, and a negative value falls back to
  `get_style_margin`): https://raw.githubusercontent.com/godotengine/godot/4.7.2-stable/scene/resources/style_box.cpp
- Godot 4.7 `Color` (`lerp` interpolates the components): https://docs.godotengine.org/en/4.7/classes/class_color.html
- Godot 4.7 `Control` (`offset_transform_*`, visual only): https://docs.godotengine.org/en/4.7/classes/class_control.html
- CSS Fonts 4, relative weights (`bolder` from 550–749 is 900): https://www.w3.org/TR/css-fonts-4/
- CSS Easing 1 (`ease-out` = `cubic-bezier(0, 0, 0.58, 1)`): https://www.w3.org/TR/css-easing-1/
- Godot 4.7.2 API dump, read locally: `D:\prime-game\tools\out\godot-api\4.7.2\extension_api.json`. It confirms:
  - `StyleBoxFlat`: `shadow_size` is an int and `expand_margin_*` are floats.
  - `FontVariation.spacing_glyph` is an int.
  - `Gradient.interpolation_color_space` includes OKLAB.
  - `Control.offset_transform_*` exists.
  - `DisplayServer.accessibility_should_reduce_animation` and `accessibility_should_increase_contrast` exist.
- Project files: `pages/styles/toy.css`, `motion-preview.css`, `meta.json`, `check_styles.js`;
  `pages/wireframes/wireframes.html`; `docs/ui-decisions.md`;
  `docs/research/2026-10-02-wave-1/lens-3-system.md`, `lens-6-a11y.md`;
  `docs/research/2026-10-02-fonts/verified.md`.
- The style choice: [prime-game-ui#2](https://github.com/xperiaroco2/prime-game-ui/issues/2).
