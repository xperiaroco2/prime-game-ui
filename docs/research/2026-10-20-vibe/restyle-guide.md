# The sticker re-skin: the guide for the component writers

The Ink and mint sticker, strength B, no tilts (`docs/ui-decisions.md`, "The new setting"), drawn by `pages/sticker/`
(the `.st` and `.st.vb` rules). The foundation (ui-1.0.0) sets the palette, the fonts, the roles and four reference
files: `button`, `panel`, `plate`, `title`. Each writer restyles the files named below, following this guide word for
word, and records each look choice taken alone as one "(agent)" line in `docs/ui-decisions.md` under the new setting.

## Hard limits
- A **re-skin**: keep every variation name, class, member and `context`; change values only. A new hue, a new font or
  a large change of a component's character goes to the engineer, not into the tokens.
- Colours alias `palette.*` or a `color.*` role; lengths are int px literals or `stroke.*`, `radius.*`, `focus.*`,
  `offset.*`, `space.*`. Never `StyleBoxFlat.shadow_*`. Run `node tools/tokens/build.js` and
  `node tools/tokens/test/run.js` after each file; update a spot value of `tools/tokens/test/expect-values.json` you
  change on purpose.

## The palette (`palette.*`; "(agent)" = a derived state shade)
| Path | Hex | Role |
|---|---|---|
| `purple` | #2B1846 | panels, HUD plates |
| `purple-deep` | #1F1033 | the full-screen ground, the map board |
| `purple-light` | #3C2660 | (agent) hover fill on purple, a setting row's face |
| `ink` | #1E1230 | every outline, the hard shadow, text on bright faces |
| `ink-soft` | #54457A | (agent) dim text on bright faces; the unplugged outline and label |
| `mint`, `mint-light`, `mint-dark` | #CFF3DF, #E6FAEF, #B2E3C7 | plates on a panel (fields, cards, keys, the selected tab, chips); hover; held |
| `green`, `green-light`, `green-dark` | #A6E85A, #BDF27E, #8CD13F | the main action, selected, titles, health full, progress; hover; held |
| `coral`, `coral-light`, `coral-dark` | #FF8A6B, #FFA58C, #EC6F50 | alarm, danger, health empty, the you-are-here pin (dark) |
| `yellow` | #FFD60A | stamina only |
| `muted` | #B7A8D6 | dim text on purple; the unplugged face |
| `white` | #FFFFFF | bar tracks only |
| `backdrop`, `backdrop-deep` | #1F1033 at 0.82, 0.86 | over the world behind menus and dialogs |
| `zone`, `clear` | yellow at 0.55; transparent | map zone tint; no fill |

## Contexts and roles
The `context` hint says where the game puts a variation, and stays. Its colours changed:
- **dark** = on the world, the HUD plates (now purple stickers), the backdrops and the deep purple ground:
  `color.on-dark.*` text mint, text-muted muted, title green, line mint, base ink.
- **light** (the name kept from Toy) = **inside a panel, now purple**: on the panel, the map board, a setting row:
  `color.on-light.*` has the same values as on-dark (mint, muted, green, mint, ink). It is no longer for ink text.
- **A face a component draws itself** (mint, green, coral, yellow): its text is `color.on-accent.text` (ink) and
  `color.on-accent.text-muted` (ink-soft), whatever the context. Every component that used `color.on-light.text` for
  text on its own white, cream or yellow face moves to `on-accent` now (fields, cards, keys, rows' values, chips).
- Surfaces: `night` purple-deep, `night-plate` purple, `plate` purple, `panel` purple, `board` purple-deep, `tile`
  purple-light, `drop` ink, `backdrop(-deep)`. States: `hover-on-dark`, `hover-on-light` purple-light (on purple);
  on a mint face hover is `mint-light`, held `mint-dark`; `disabled-face` muted, `disabled-ink` ink-soft,
  `disabled-ink-on-dark` muted; `held-accent` green-dark. Status: `stamina` yellow, `health-full`/`progress` green,
  `health-empty`/`alert` coral.

## Type (`type.*`; sizes unchanged, `font.size.*` stays with the text-size modifier)
Plain roles (`caption`, `small`, `body`, `body-large`, `heading`) Nunito 800; `-bold` roles, `title` and `hero` Nunito
Black 900 (`hero` letter spacing −1); `display` and `display-large` Rubik 700 (numbers: the timer, readouts, codes);
`logo` (new) Kablammo 400 at the display-large size, for `ToyLogo` only. Buttons, tabs, chips and stickers on the page
are 900: use the `-bold` roles there. Never Kablammo outside `ToyLogo`.

## Building a sticker (strength B)
- **Surface**: the face colour, `border-color` `{color.outline}`, `border-width` `{stroke.control}` (controls) or
  `{stroke.surface}` (surfaces), both 4; `{stroke.thin}` 3 for bar tracks and small marks; `{stroke.bold}` 5 for a
  key's bottom edge. Radii: `radius.small` 8, `medium` 12 (tabs), `large` 16 (plates), `control` 14 (buttons),
  `surface` 20 (panels), `pill` 999 (chips). Keep the content margins (the screens' layout depends on them) unless P45
  or P48 asks for 1 px more.
- **Hard shadow, base layer** (only a variation with a `godot.base` hint: buttons, panels, the map board, the title
  plate, preset cards): the base Panel is ink, no border, the face's radii, and sits `offset.base` (5) right and 5 down:
  `expand-margin-top` = face top − 5, `-bottom` = face bottom + 5, `-left` = face left − 5, `-right` = face right + 5
  (P50 checks both axes; every base of one face uses the same offset). A Button's `press.depth` is `{offset.base}`.
- **Hard shadow, edge form** (a surface with no base in the game: plates, chips, slots, keys): the right and bottom
  borders 9 (4 + 5), top and left 4, `expand-margin-right` and `-bottom` 5, explicit content margins as before (the
  label does not move; the edge reaches 5 px outside the box). See `ToyPlate`. Use it where the page draws a shadow;
  a small sticker the page draws flat (a tab, an idle chip, a row) keeps the plain outline.
- **Hover**: the face one step lighter (`*-light`), or `purple-light` laid under a borderless item. **Held / pressed**:
  one step darker (`*-dark`). The sticker never moves: `press.hover` and `press.held` are 0 (ToyPress moves only `y`,
  which would tear the face off a diagonal shadow).
- **Focus**: inner, as before: `border-width` `{focus.width}` (3) in ink (in mint on a borderless item on purple),
  `expand-margin` = −(the largest normal border, 4 on a sticker), radius = the normal radius + that expand. Outer focus
  (chips, stepper, radio) stays 5 out, radius 999.
- **Disabled (unplugged)**: no shadow (the base hides; an edge form returns to 4 px on all sides with no expand),
  face `color.state.disabled-face` (muted), outline and label `color.state.disabled-ink` (ink-soft). A borderless item:
  only the label goes muted.
- **Title outline**: a title Label gets `font-shadow-color` `{color.outline}` and the items `shadow-offset-x` 0,
  `shadow-offset-y` 0, `shadow-outline-size` `{stroke.surface}`: Godot draws the shadow glyph with that outline under the
  letters; the showcase draws it as `-webkit-text-stroke` (twice the size, under the fill). Only on title selectors
  (`.tv-Toy(Logo|Title*)`; lint L25). Titles are green on purple, ink on a bright face (then no outline).

## The reference set (done)
`ToyButtonPrimary` green, `Secondary` and `Plain` mint, `Danger` coral, all ink 4 px, 14 radius, hover/held shades;
`ToyButtonGhostOnDark`/`OnLight` borderless, mint label, purple-light hover; `ToyMenuItem` a mint sticker in the edge form, open green, the pointer ink;
`ToyPanelMenu`/`Dialog`/`Howto` purple, ink 4 px, radius 20 on the ink `ToyBasePanel`; `ToyPlate`, `ToyPlateNight`
purple and `ToyPlateAlert` purple with a coral outline, all in the edge form, text mint; `ToyTitlePlate` a purple
sticker around a green Nunito Black title with an ink outline, on `ToyBaseTitle`; `ToyLogo` Kablammo green, ink outline.

## One line per remaining file
- **chip**: mint sticker chips (ink 4, pill, `small-bold` ink); `ToyChipAlert` coral, the toggle's on face green with the edge-form shadow; line chips borderless on purple.
- **tab**: idle a borderless mint label on purple (`purple-light` hover); `ToyTabSelected` a mint face, ink 4, radius 12, ink label; drop the merge base for the plain outline (sums equal, P46).
- **pick**: `ToyCheckBox` and radio on purple: mint label, a mint box texture face; selected green; swatch rings ink 4, the selected ring green.
- **setting**: `ToySettingRow` borderless on the panel (mint label, muted value); `ToyStepper` a mint sticker, held `mint-dark`.
- **field**: `ToyField`, `ToySpinField` and `ToyDropdown` mint plates, ink 4, radius 12, ink text, ink-soft placeholder; `ToyDropdownList` a mint list, `mint-dark` hover row; `ToySpinBox` buttons green.
- **keycap**: mint keys, ink outline 3 with the 5 px ink bottom edge, ink text; quiet keys muted with ink-soft text.
- **bar**: white tracks, ink outline 3, radius 10; stamina yellow, progress green, health the coral-to-green ramp (the ramp gate vs a white track needs the integration's answer); `ToySlider` a white track, green fill, mint knob.
- **hud**: `ToyCrosshair` white dot with an ink ring; `ToySpinner` a green arc on a purple disc.
- **slot**: purple sticker slots (edge form), mint label; `ToySlotActive` outlined in green; empty label muted.
- **mic**: a purple plate with a mint mic icon on and coral off.
- **name-plate**: a purple sticker with the mint name (`small-bold`), edge form.
- **map**: `ToyMapBoard` the deep purple board on `ToyBasePanel`; rooms mint plates with ink names; zone yellow at 0.55; the pin coral-dark with an ink outline (gate c17 then pairs the pin, not the board). The room pictograms' ink is still the Toy #2A1F33 in their SVGs (`tools/tokens/icons.js` ROOM_INK): leave it, or ask.
- **layout**: no look; keep every `space.*` separation.
- **text**: `ToyTextOnDark`/`OnLight` mint, `Muted*` muted, `ToyTitleOnDark`/`OnLight` green with the ink outline items, `ToyDisplayOnLight` and `ToyTimer` Rubik (the display roles) in mint, `ToyHudCaption` mint `caption`.
- **preset-card**: mint card stickers on `ToyBaseCard` (the base form: ink, 5 right and 5 down), ink text; selected green; quiet muted with ink-soft.
- **howto**: `ToyHowtoFrame` a mint plate (the ink sketches read on it), `ToyHowtoFrameDone` green; captions ink.
- **backdrop**: `ToyBackdrop` and `ToyBackdropDeep` the deep purple at 0.82 and 0.86; `ToyBackdropNight` solid purple-deep.

## Known open points (for the integration)
- Contrast gates fail until every file is restyled; the pairs in `tokens/gates.json` still describe Toy (`what`), and the
  ramp gate (health vs the white track, 1.47) and ink outlines vs purple surfaces (c17) need an answer or a waiver.
- The Toy-era review pages (styles, choices, base-controls, room-signs) are frozen: no longer rebuilt or linted.
