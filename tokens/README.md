# Design tokens (the plain tile and the ink-mint palette; Toy names)

The single source of truth for the game's look: the plain tile («Плитка») and the ink-mint palette («Чорнильна мʼята») since ui-2.0.0, the Ink and mint sticker from ui-1.0.0 to ui-1.4.0 (each a re-skin: the variation names, `Toy*`, and the `--toy-` prefix stay from the Toy style on purpose, so the game's scenes keep their variation names), in [DTCG 2025.10](https://www.designtokens.org/tr/2025.10/). The showcase CSS
and the game's Godot theme are both generated from these files, never copied by hand. The full contract is the build
spec, [`docs/research/2026-10-03-tokens/spec.md`](../docs/research/2026-10-03-tokens/spec.md) (§2 to §6).

## Files

| File | What it holds |
|---|---|
| `prime.resolver.json` | The resolver: one base set (the files below, in order) and two modifiers, `textSize` and `motion` |
| `primitives.tokens.json` | Literals: the palette, font families, weights, letter spacing, line height, `ease.press`, `duration.none`, `focus.*`, `stroke.*` (edges, the bright faces' bottom edge, the halo, the cops' edges), `radius.*`, `space.*` (the screens' gaps: 4, 8, 12, 16, 24, 32); `offset.*` and `glow.*` left in ui-2.0.0 |
| `semantic.tokens.json` | Aliases of primitives: colour roles by context (`color.*`), the 17 type roles (`type.*`; `kicker` new in ui-2.0.0, `display-small` in ui-2.1.0), `motion.press` |
| `components/<name>.tokens.json` | 24 files, 187 Godot type variations (the abstract ToyButton and the twenty deprecated ones included): one variant group per variation, with its StyleBox states, `label`, `press`, `size`, `items`, `ramp` |
| `text-size/default.tokens.json`, `text-size/large.tokens.json` | `font.size.*` (with `font.size.theme-default`, the theme's `default_font_size`) and `size.keycap` (a keycap's minimum width) for the player's text size setting |
| `motion/default.tokens.json`, `motion/reduced.tokens.json` | `duration.press` for the reduced-motion setting |
| `release.json` | The semver the next `ui-<semver>` tag carries |
| `gates.json` | Contrast pairs, surfaces and waivers for `tools/contrast/gates.js` (not a DTCG file) |

## Tiers

1. **Primitive**: literals only. The modifier files are primitives owned by one modifier, and each modifier owns exactly
   these paths (P63): `textSize` `font.size.*` and `size.keycap`, `motion` `duration.press`.
2. **Semantic**: aliases of primitives only (`{palette.ink}`), composite sub-values included.
3. **Component**: one group per variation, marked by `$extensions` `io.github.xperiaroco2.prime-game` `godot.variation`.
   Colours alias down to `palette.*`; dimensions are int px literals or aliases to the primitives `stroke.*`, `radius.*`, `offset.*`,
   `focus.*`, `space.*` and `glow.*`; a container's separation is always a `space.*` alias. A `size` member may also alias
   `size.*`, the lengths the text size owns (the keycaps' `min-width` is `{size.keycap}`: 36, 42 at large text), so a
   size follows the text size with no code in the game.
   The build completes each state to the 19 `StyleBoxFlat` fields (spec §3.5), plus the glow's `shadow-color` and
   `shadow-size` where a state has a glow (ui-1.3.0, below), so the pack needs no inheritance logic.

Lengths are int px at the 1920×1080 reference frame. Since ui-2.0.0 the geometry is the target page `pages/suit-final/`
(1280×720 frames) × 1.5, rounded up: its 1 px edge is 2 px here, its 8 px corners 12, its 3 px bottom edges 5 (ui-1.2.0 to
ui-1.4.0: the MVP sketches at the 0.75 scale). The text sizes stay as they were up to the heading; the numbers and the loud
titles follow the target (display 36, display-large 78, hero 126, kicker 14).

## Editing a value

- A colour used everywhere: change the primitive in `primitives.tokens.json` (keep `components`, `hex` and `alpha` in
  agreement: components are `round(byte / 255, 4)`).
- A role (what "muted text on dark" is): change the alias in `semantic.tokens.json`.
- One control: change its token in `components/<name>.tokens.json`. Follow the compact authoring form of spec §3.5
  (shorthand when all sides are equal, `-block` / `-inline` for an equal axis, zero expand sides omitted); the validator
  enforces it.
- Then rebuild and commit `tokens/` and `dist/` together:

```sh
node tools/tokens/build.js          # validate, then write dist/css/toy-tokens.css, dist/pack/toy.pack.json, dist/pack/icons/
node tools/tokens/build.js --check  # fail if dist/ is stale (CI runs this)
node tools/tokens/test/run.js       # validator self-test and the spec's spot values
node tools/check.js                 # every check: tokens, lint, contrast gates, showcase
```

`dist/pack/icons/` is the game's copy of `pages/components/icons`: an icon drawn in `currentColor` is written white
(`#ffffff`), since Godot's SVG importer has no colour context and the game tints an icon by multiplying it
(`self_modulate`, a Button's `icon_*_color`, OptionButton's `modulate_arrow`); an icon in its own colours (the slider
knobs) and `LICENCES.json` are copied as they are. `dist/pack/icons/room/` holds the room pictograms (room-signs system B, the
engineer's room-signs decision: plain on packages and the map), their ink written white the same way, with their own
`LICENCES.json`; the game names a room's sign by its file name (`room/lab`). The pack's `assets` list every one of
these icons with how it is imported (below, "The pack's assets"); `tools/tokens/icons.js` writes both.

Every error names the rule (D01–D39, P40–P63, B01 for `release.json`, B02 for a screen source the icon sizes cannot
read, B03 for card art whose PNG is older than its SVG or has no licence record, or B04 for a font that is not its record's file, has no allowed licence or does not match the tokens' family and weights) and the file; where the file parses it also gives the line and column, the JSON Pointer and the token path.

## Classes

A variant's `godot.class` is one of these (`tools/tokens/expand.js` CLASSES); its children are the class's states, plus
`items`, `size` and the Button extras (`label`, `press`):

| Class | States (StyleBoxes) | Items |
|---|---|---|
| Button, OptionButton | normal, hover, pressed, hover-pressed, disabled, focus | any (each needs a CSS form) |
| CheckBox | as Button (`pressed` is checked) | icon-*-color (as Button's), h-separation, check-v-offset, checkbox-checked-color, checkbox-unchecked-color |
| LineEdit | normal, focus, read-only | any |
| Panel, PanelContainer | panel | any |
| Label | normal | any |
| ProgressBar | background, fill (+ `ramp`) | any |
| HSlider | slider, grabber-area, grabber-area-highlight (from grabber-area), focus | center-grabber (0 or 1), grabber-offset |
| VScrollBar | scroll, scroll-focus (from scroll), grabber, grabber-highlight and grabber-pressed (from grabber) | none |
| VBoxContainer, HBoxContainer | none | separation (required, a `space.*` alias) |
| GridContainer | none | h-separation, v-separation (both required, `space.*` aliases) |
| ScrollContainer | none | scrollbar-h-separation (required, a `space.*` alias: the gap between the content and the vertical bar) |
| SpinBox | up-background (required), up-background-hovered, -pressed, -disabled, down-background and its three (all from up-background) | buttons-width, field-and-buttons-separation, buttons-vertical-separation, up-/down- icon-modulate, hover-icon-modulate, pressed-icon-modulate, disabled-icon-modulate (all required) |
| PopupMenu | panel, hover, separator (all three required) | font-color, font-hover-color, font-disabled-color (required), v-separation, h-separation, item-start-padding, item-end-padding |

- **HSlider:** its grabber, grabber_highlight and grabber_disabled are textures, not tokens
  (`pages/components/icons/slider-knob.svg` and `slider-knob-disabled.svg`, 42 px), named in `godot.textures` (below). Its `focus` is an outer ring (mint, as it sits on the purple);
  Godot 4.7.2's Slider draws no focus StyleBox (slider.cpp binds slider, grabber_area, grabber_area_highlight only), so
  the game draws this one over the slider while it has visible focus.
- **Containers** draw nothing: the game's theme test forbids theme overrides, so a box or grid takes its gap from a
  variation: `ToyColumnFour`, `ToyColumnEight`, `ToyColumnTwelve`, `ToyColumnSixteen`, `ToyColumnTwentyFour`,
  `ToyColumnThirtyTwo` (VBoxContainer, space.4 … space.32), the same six `ToyRow…` (HBoxContainer), `ToyGridList`
  (h 24, v 8) and `ToyGridSwatch` (12, 12), and `ToyScroll` (ScrollContainer, scrollbar_h_separation 8: the gap
  between a list and its vertical bar; the Godot 4.7 class reference names it the space between the vertical scroll bar
  and the content). Names stay letters only (P40): the game's theme test sees `&"[A-Za-z]+"`
  only, and the pages that read the components CSS find its blocks by that pattern, so a number is spelled.
- **An outer focus ring** is a pill (999) or follows the control's corners: radius = the control's radius + the expand
  margin (ToyKeyButton: radius.small 8 + 5 = 13). P48 checks it.
- **PopupMenu** (`ToyDropdownList`, the open list of every ToyDropdown: the game sets it on the OptionButton's
  `get_popup()`). Godot 4.7.2 binds the StyleBoxes `panel`, `hover`, `separator`, `labeled_separator_left/right`, the
  colours `font_color`, `font_hover_color`, `font_disabled_color`, `font_accelerator_color`, `font_separator_color`,
  the outline colours, the constants `v_separation`, `h_separation`, `indent`, `item_start_padding`,
  `item_end_padding`, `icon_max_width`, `gutter_compact`, `outline_size`, … and the icons `checked`, `unchecked`,
  `radio_checked`, `radio_unchecked` (each with `_disabled`), `submenu`, `submenu_mirrored`, `search`
  ([popup_menu.cpp L3548-L3591](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/popup_menu.cpp#L3548-L3591);
  the defaults: [default_theme.cpp L750-L805](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/theme/default_theme.cpp#L750-L805)).
  Toy binds what an OptionButton's list draws: the three StyleBoxes, the three font colours, the four layout constants
  and the four radio icons (an OptionButton adds every item as a radio-checkable item and checks the selected one,
  [option_button.cpp L220-L227](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/option_button.cpp#L220-L227),
  [L442-L470](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/option_button.cpp#L442-L470)).
  The font colours are items here, as Godot names them, since PopupMenu has no StyleBox per text state; `font` and
  `font_size` come from `label`. How it draws ([popup_menu.cpp L882-L1090](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/popup_menu.cpp#L882-L1090),
  [L307-L327](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/popup_menu.cpp#L307-L327)): the
  `panel` content margins inset the rows; a row is as tall as its text (or its check icon, if taller) plus
  `v_separation`, half above and half below, and `hover` fills that whole row across the content width while the row
  is hovered or keyboard-focused (its own margins lay nothing out); in a row come `item_start_padding`, the check
  gutter (the widest of the check and radio icons), `h_separation`, the label, `item_end_padding`; a separator row is
  the `separator` StyleBox across the content width, as tall as its minimum size (its content margins). The check
  icons are drawn with the item's own `icon_modulate` (white by default), never a theme colour, so Toy's are in their
  own colours (`tint: "none"` in the pack's assets). Rounded corners on a popup need embedded subwindows, Godot's
  default ([popup_menu.cpp L3327-L3338](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/popup_menu.cpp#L3327-L3338)).
  Labeled separators, accelerators, submenus and the search bar are not bound: no Toy list has them.

## The library brought to the target, ui-2.1.0

The component library matches the approved target page (`pages/suit-final/`) where `pages/library-check/` found nine
differences (`docs/ui-decisions.md`, "The library brought to the approved target (ui-2.1.0)"). A minor release: new
variations, a type role, two icons and a pack member; changed values; three deprecations; nothing removed.

- **Tabs:** `ToyTab` is dim text with no face, `ToyTabSelected` light text over a 3 px accent underline (a bottom border
  only); both stand on `ToyTabStrip` (new, a PanelContainer: no fill, a 2 px edge line under the row), the small Esc
  keycap (`ToyKeyQuiet`) at its right. The settings section list is `ToyMenuItem` (the target's `.nav`).
- **Tile heads:** `ToyKicker` (context `any`) heads the tiles: ГРАВЦІ (`lobby.players`), КОСТЮМ (`hud.suit`), РУКА and
  ПОЯС (`hud.slot.hand`, `hud.slot.belt`), КОД (`common.code`), the dead's room's name. **`godot.uppercase`** (new, P64):
  `true` on a Label variant whose text the game writes in capitals (`ToyKicker`, `ToyRosterTagText`); a Theme cannot set
  it, so the pack names it (`variations.<name>.uppercase: true`) and the game sets `Label.uppercase` on the node; the
  letter spacing is the label's `letterSpacingPx`, a FontVariation's `spacing_glyph` in the game. The showcase draws it as
  `text-transform: uppercase` (lint L29 allows that value only).
- **The time tile:** `ToyTileDivider` (new, a 3 x 48 Panel of the base) between the time and the anger column, whose
  caption (`hud.anger`, `ToyHudCaption`) sits over the bar.
- **The slots:** `ToySlotHand` and `ToySlotBelt` 6 px above and below and 12 at the sides; inside, top to bottom, the head
  (`ToyKicker`), the 57 px picture (the accent in the hand, light on the belt) and the name (`ToySlotTagText`).
- **The stepper:** `ToyStepper` is a 51 px square with `icons/minus.svg` and `icons/plus.svg` (new, own work); the
  two-way choice (the anger threshold) is two joined halves, `ToySegmentStart` and `ToySegmentEnd` (toggles to their
  `…Selected`; the outer corners 9 px, the joined side square, an inner focus ring; a chosen half locked for a guest is the
  deeper accent). P48's inner ring keeps a square corner square (the face's radius + the expand, at least 0).
- **The workbench:** `ToyTitleMachine` (display, Unbounded 36), `ToyMutationCardName` (`type.display-small`, Unbounded
  22), `ToyMutationCardText` (small, dim), `ToyMutationCardCost` (display), their `…Off` forms (dim) on a card you cannot
  afford, `ToyMutationCardPointed` (the card under the crosshair, a 3 px accent outline), and `ToyButtonMutate`: the
  secondary look until hovered, the main action's face while hovered or held, so only the card under the crosshair shows a
  filled button. `ToyMutationCard` is 21 px inside.
- **The dead's room:** one `ToyPlate` at the top centre (36 px down, where the round's time tile sits): the room's name
  (`ToyKicker`), then `dead.back_in` (`ToyHudCaption`) and the countdown (`ToyTimer`); no bar, no title plate.
  `ToyPlateCount`, `ToyPlateHead` (replacement `ToyPlate`) and `ToyPlateHeadText` (replacement `ToyKicker`) are deprecated.

## The host tag, ui-2.4.0

A minor release: two variations added for the lobby roster's host tag (the target's quiet `.tg.h`; copy round 9, `hud.roster.host`).

- **`ToyRosterTagHost`** is `ToyRosterTag` with the edge colour (`color.outline`) in place of the danger outline.
- **`ToyRosterTagHostText`** is the tag's word in Unbounded capitals at the kicker size, dim (`color.on-dark.text-muted`); the capitals are the Label's `uppercase` (godot.uppercase).

## The screens step, ui-2.2.0

The screens redrawn to the approved target (`docs/ui-decisions.md`, "The screens redrawn to the approved target
(ui-2.2.0)"). A minor release: a variation's context and an asset's tint changed; nothing added or removed.

- **`ToyMenuItem`** is a light-context variation, since it sits on a tile (the suit menu's settings section list and the
  Guide's topic list, s5; since ui-2.3.0 also the entries of the suit menu's side panel); its values are as in ui-2.1.0
  (dim idle text, the open entry a row fill with light text).
- **The room pictograms' `tint_color`** is the dim colour `#a39dbd`, the quiet level of a room's `ToyKicker` head on
  the map; the pages now draw them in it (they drew the source ink, nearly invisible on the dark tiles).

## Proposal marks

`"$extensions": { "io.github.xperiaroco2.prime-game": { "proposal": true } }` with a `$description` marks a value the
engineer has not approved yet. None is left since ui-0.1.2: the engineer approved the look choices of 2026-10-03,
and the agent decided the last small ones (`docs/ui-decisions.md`, marked "(agent)").
A mark on a group covers everything in it. The pack lists every mark under `proposals`, and the
showcase puts a proposal badge on each. When a proposal is approved, remove its mark (keep the description) and rebuild.

## Items

`items` holds Godot theme items that are not StyleBox fields, named as the Godot item in kebab-case (`icon-hover-color` is
`icon_hover_color`, `h-separation` is `h_separation`, `arrow-margin` is `arrow_margin`, PopupMenu's `font-hover-color`
is `font_hover_color`, `item-start-padding` is `item_start_padding`); the older `placeholder-color`,
`caret-color`, `selection-color`, `selected-font-color` (ToyField) and `icon-on`, `icon-off` (ToyMic) keep their names.
Every item needs a CSS form in `pages/components/emit-css.js` (or a stated reason it has none), or the showcase build fails.

## Textures

A theme icon of a class is a texture, not a token: a variant names it in `godot.textures`, keyed by the Godot icon in
kebab-case (`grabber-highlight` is `grabber_highlight`), with the pack path of an icon as the value (`icons/<name>.svg`
for `pages/components/icons/<name>.svg`, `icons/room/<name>.svg` for a room pictogram):

```json
"godot": { "variation": "ToySlider", "class": "HSlider",
  "textures": { "grabber": "icons/slider-knob.svg", "grabber-highlight": "icons/slider-knob.svg",
                "grabber-disabled": "icons/slider-knob-disabled.svg" } }
```

The class's icons are listed in `tools/tokens/expand.js` CLASSES (`textures`): OptionButton `arrow`; HSlider `grabber`,
`grabber-highlight`, `grabber-disabled`, `tick` (godot-facts §9); PopupMenu `checked`, `unchecked`, `radio-checked`,
`radio-unchecked` (each also `-disabled`), `submenu`, `submenu-mirrored`, `search`; CheckBox `checked`, `unchecked`,
`radio-checked`, `radio-unchecked` (each also `-disabled`); SpinBox `updown`, `up`, `up-hover`, `up-pressed`,
`up-disabled` and the same four `down`. A new class adds its own there. P61
checks that each name is one of the class's icons and that the file exists with an allowed licence record. Today:
ToySlider's three knobs, ToyDropdown's `arrow` (`icons/chevron-down.svg`) and ToyDropdownList's `radio-checked`
(`icons/radio-checked.svg`, an ink check), `radio-checked-disabled` (`icons/radio-checked-disabled.svg`, the check in
the muted ink), `radio-unchecked` and `radio-unchecked-disabled` (both `icons/radio-unchecked.svg`, an empty 24 px
icon that keeps the check's gutter), ToyCheckBox's four boxes and ToySpinBox's two chevrons (below).

## The plain tile since ui-2.0.0

The engineer's choice of 2026-10-22 (`docs/ui-decisions.md`, "The plain tile and the ink-mint palette"; the whole screen
set in this look is the target page `pages/suit-final/`): the suit's interface is calm tiles; only the big moments are loud.
A MAJOR release: the palette's names, the glow, the hard shadow and the old fonts are gone (the release notes list them).

- **The palette** (`palette.*`): the base #1A1629 (grounds, tracks, field cells), the module #2A2540 (every tile), the row
  #352F4F (row faces, secondary buttons, keys, segments), the edge #4A4170 (a tile's outline), the text #ECE8F7 and the dim
  #A39DBD, the accent #6FF2B4 with its ink #082418 and its deeper #33A877, the danger #FF5C6C with its ink #26060C and its
  deeper #A8243A; (agent) shades for hover and held (`row-light`, `accent-light`, `accent-dark`, `danger-light`,
  `danger-dark`), the shade (a halo on the world) and the backdrops (the base at 87 % and 90 %, so text keeps 4.5:1 over a
  white world; the target's dim is 50 % over a dark ship). Every surface is dark now, so `color.on-light.*` reads as
  `color.on-dark.*`; `color.on-accent.*` is text on the accent and the new `color.on-danger.text` text on the danger colour.
- **The tile** («Плитка»): one fill, a 2 px edge of one colour (`stroke.surface`), 12 px corners (`radius.surface`); controls
  9 px (`radius.control`, `radius.medium`), keys and chips 6 (`radius.small`). No hard shadow anywhere: the base layers
  (`ToyBaseRaisedOnDark`, `ToyBaseRaisedOnLight`, `ToyBasePanel`, `ToyBaseCard`, `ToyBaseTitle`) are clear and deprecated,
  no variation names a `base` and every `press` is 0, so the game can drop its ToyRaised wrappers and ToyPress. No glow:
  no StyleBox has a shadow (the alarm pulse has nothing to pulse; the game can drop it).
- **Buttons:** the main action (`ToyButtonPrimary`) and danger (`ToyButtonDanger`) are bright faces with the ink text and a
  5 px deeper bottom edge (`stroke.edge`; per-side border widths, one colour); secondary is a row face with a 2 px accent
  outline and accent text; plain is a row face with the edge; ghosts, the menu item (the target's `.nav`) are text
  with a row fill on hover; tabs are text on `ToyTabStrip`, the chosen one over a 3 px accent underline (ui-2.1.0). Focus is an accent ring (`color.focus`, `focus.width` 3): outside
  the face (expand `focus.gap` + `focus.width` = 6, the face's radius + 6) on the faced buttons, inside the edge on
  fields, ghosts, tabs and cards. `ToyButtonPrimaryOnMint` and `ToyButtonDangerOnMint` are deprecated (no surface is mint).
- **The suit's pips** (new, `bar.pip*`): health and stamina are ten pips each (the engineer's segmented pips), a ProgressBar
  cannot draw them: `ToyPip` (empty, the base), `ToyPipHealth` (the accent), `ToyPipStamina` (the text colour),
  `ToyPipAlarm` (the danger colour, health under 30 %), each a Panel of 23 × 15 with 5 px corners in a `ToyRowFour`; the game
  sets round(value × 10) pips full. The labels are `ToyHudCaption` (`hud.health`, `hud.stamina`), the health label
  `ToyTextAlertOnLight` under its line. `ToyBarHealthCalm` / `Alarm` and `ToyBarStaminaCalm` / `Alarm` are deprecated.
- **The anger meter:** `ToyBarAngerCalm` is a 240 × 16 base track with a dim fill, `ToyBarAngerAlarm` the danger fill past the
  line; it sits in the time tile (`ToyPlate`) beside the time (`ToyTimer`, Unbounded), the siren `icons/siren-off.svg` (dim)
  or `siren-on.svg` (the danger colour), both line drawings now.
- **The loud moments** (new): `ToyBand` and `ToyBandAlert` (PanelContainers, the accent or the danger colour across the whole
  width) carry `ToyTitleHero` (the accent ink) and `ToyTitleHeroAlert` (the danger ink) at the hero size in Unbounded (the
  role reveal, the ends); the cops' tile `ToyPlateBanner` is the danger face with an 8 px deeper bottom edge
  (`stroke.alarm`) and its own labels `ToyPlateAlertTitle`, `ToyPlateAlertText`, `ToyPlateAlertCountdown`; the cops' minute
  adds `ToyScreenEdgeAlert` (a Panel over the whole screen, a 12 px danger edge, `stroke.screen`); the cops' end is
  `ToyBackdropAlert` (the danger colour) with `ToyTextOnDanger`.
- **Minimal plates:** the goal (`ToyPlateGoal`), the result (`ToyPlateResult`), the points (`ToyPlateBalance`), a name over a
  head (`ToyNamePlate`) and a slot's name (`ToySlotTag`) have no plate; a name over a head and the bare timer keep a 6 px
  shade halo (`stroke.halo`, Godot's shadow outline). The slots are 117 × 132 tiles with the item's line picture and its name
  inside; the hand in use has a 3 px accent outline (`stroke.selected`).
- **Icons:** the item pictures and the empty slots are line drawings in `currentColor` now (`tint: "multiply"`: the game
  tints the white copy, the text colour; the accent in the hand is open); the check boxes, the dropdown's check, the slider's
  knob (a 21 × 33 light tile) and the sirens are redrawn in the palette (own colours); the room pictograms' `tint_color` is
  the text colour #ece8f7 (the dim colour #a39dbd since ui-2.2.0).
- **Type:** Onest for text (Medium 500, Bold 700) and Unbounded Bold for titles, numbers, the loud titles, the logo and the new
  `type.kicker` (Unbounded capitals at `font.size.kicker` 14, 2 px apart; `ToyKicker`, `ToyRosterTagText`; since ui-2.1.0 the
  capitals are the Label's `uppercase` property, `godot.uppercase` in the tokens and `uppercase: true` in the pack). `font.family.text` is Onest, `font.family.number` and `font.family.logo` (the names kept) Unbounded.

## The MVP round HUD since ui-1.2.0 (re-skinned in ui-2.0.0)

The variations of the MVP sketch page's round HUD and new screens (the engineer's decisions of 2026-10-20 in
`docs/ui-decisions.md`). None of their classes has a theme icon, so none names a texture: the siren and the item
pictures are pack assets (`assets`) drawn by a TextureRect, never tinted.

- **The top:** `ToyTimerBare` (no plate, the ink text outline) centred at the top; under it the anger meter,
  `ToyBarAngerTrack` (225 × 30) holding the fill-only `ToyBarAnger` (coral, ink end edge), exactly centred; the siren
  hangs 9 px off the track's right end, a 57 px TextureRect that does not move the centre. The game swaps its texture:
  `icons/siren-off.svg` while the anger is calm, `icons/siren-on.svg` while it rises and when full.
- **The roster** (top right): `ToyRoster` around a `ToyColumnEight` of `ToyRowTwelve` rows: `ToyRosterDot`
  (white, tinted to the body colour with `self_modulate`), the name (`ToyRosterName`, the own `ToyRosterNameSelf`,
  the dead `ToyRosterNameDead`) and, in a human's roster, `ToyRosterTag` with `ToyRosterTagText` on the other humans.
- **Item bar A:** `ToySlotHand` (150, green) and `ToySlotBelt` (126, mint) in a `ToyRowSixteen`, bottoms aligned; the
  picture is the item's `icons/item-*.svg` (111 and 90 px) or `icons/slot-empty-hand.svg` / `slot-empty-belt.svg`;
  the name tag `ToySlotTag` (`ToySlotTagText`) is centred on the slot's bottom edge, its bottom 18 px below the face.
- **Notices:** `ToyPlateNotice` (no screen since 2026-10-21: the kill notice and the killer line were dropped), `ToyPlateBanner` (the cops), `ToyPlateCount` (the
  dead's countdown), `ToyPlateHead` (the dead's room head), `ToyPlateGoal` (the role's goal), `ToyPlateResult` (the end
  screens), with `ToyPlateTitle`, `ToyPlateText`, `ToyPlateTimer`, `ToyPlateHeading`, `ToyPlateCountdown`,
  `ToyPlateHeadText`, `ToyPlateGoalText`; word stickers `ToySticker`, `ToyStickerAlert`, `ToyStickerHighlight` with
  `ToyStickerText` (HUD) or `ToyStickerTextLarge` (full screens); full-screen titles `ToyTitleHero`, `ToyTitleHeroAlert`;
  in a panel, the human's role `ToyDisplayAlertOnLight` (the coral `ToyDisplayOnLight`, the Esc menu's Role tab).
- **The workbench:** `ToyPanelDialog` with `ToyTitleOnLight`, `ToyPlateBalance` and `ToyMutationCard`s; a card's "not
  enough" state is its button disabled, the card does not change.

## The glow since ui-1.3.0 (gone in ui-2.0.0)

The record of ui-1.3.0 to ui-1.4.0; since ui-2.0.0 no StyleBox has a shadow (above, "The plain tile since ui-2.0.0").

The engineer's choices of 2026-10-21 (prime-game#150; `pages/glow-bars/`, way 3 "поріг"). The sketch pages' lengths
× 1.5, as every length since ui-1.2.0.

- **The glow is a StyleBox field pair.** A state may author `shadow-color` and `shadow-size` (Godot's `shadow_color` and
  `shadow_size`; `shadow_offset` is never authored and stays (0, 0)). An inheriting state takes them from the state it
  completes from; a record has both only where its state or that state authors one, so every other record keeps its 19
  fields and the game leaves Godot's default (no shadow) there. The sizes are the primitives `glow.action` (45) and
  `glow.alarm` (42); the colour is the glowing piece's own at alpha 1. The CSS image is `box-shadow: 0 0 <size>
  <colour>` (lint L11 allows a blur only at offset 0 0). The hard ink shadow is never a StyleBox shadow: it stays a
  base layer or the edge form.
- **The main action glows:** `ToyButtonPrimary` is the acid `palette.acid` (#B6FF3C; hover `acid-light`, held
  `acid-dark`) with the glow (`glow.action`, acid). It has no `base` and `press.depth` is 0: the game drops its ToyRaised
  wrapper. In ui-1.3.0 its hard shadow was the edge form (outlines 6 / 14 / 14 / 6, expand 8 right and bottom); since
  ui-1.4.0 it has none (below, "The buttons since ui-1.4.0"). Unplugged: `shadow-size` 0.
  `ToyBasePrimaryOnDark` and `ToyBasePrimaryOnLight` are deprecated.
- **The bars glow only at their alarm line.** One `ProgressBar` per bar, two variations each: `ToyBar…Calm` (the white
  track as `background`, a 5 px ink outline, pill ends; the fill in the bar's colour with the same outline and ends,
  drawn over the track's full height) and `ToyBar…Alarm` (the same, plus the track's glow, `glow.alarm` in the bar's
  colour, so the light is as wide as the bar however short the fill). `ToyBarAngerCalm` / `Alarm` (coral, 225 × 30),
  `ToyBarHealthCalm` / `Alarm` (the alien green, no ramp), `ToyBarStaminaCalm` / `Alarm` (yellow) and
  `ToyBarReturnCalm` / `Alarm` (the dead's room return, the alien green), 24 px tall, the screen giving the width.
  **The game owns the line and the pulse:** it sets the Alarm variation while anger is over 70 %, health or stamina
  under 30 %, or the return in its last 5 s (the agent's lines on the page, open to the engineer's veto), and the Calm
  one otherwise; in alarm it tweens the background StyleBox's `shadow_color.a` from 1 to 0.25 and back, 0.9 s each way
  (TRANS_SINE, EASE_IN_OUT, looping), on a per-bar duplicate of the StyleBox so the theme's stays untouched; under
  reduced motion it does not pulse (alpha 1). The fill-only `ToyBarAnger`, `ToyBarHealth`, `ToyBarStamina` and their
  tracks `ToyBarAngerTrack`, `ToyBarTrack` are deprecated.
- **The full-screen titles are Kablammo:** `ToyTitleHero` and `ToyTitleHeroAlert` take `type.hero-display` (Kablammo,
  `font.family.logo`, at the hero size 96, the sketch pages' 84 px title; weight 400, its line box `font.line-height.logo`);
  every smaller title stays Nunito Black. They stand on `ToyBackdropFullScreen` (Panel), the soft ink
  `color.surface.full-screen` (#54457A), where their ink outline shows; the role reveal and the ends use it in place
  of `ToyBackdropNight`, which stays for the other screens. The plain lines on that ground ("Your role", the return
  count) are mint `ToyTextOnDark` (gate g9, 6.99:1), not the muted lilac (3.82:1 there).

## The buttons since ui-1.4.0 (replaced in ui-2.0.0)

The record of ui-1.4.0; since ui-2.0.0 the buttons are the plain tile's (above).

The engineer's choice of 2026-10-21 (`docs/ui-decisions.md`; `pages/buttons-fix/`, look B): the buttons are the MVP
sketches' sticker (`pages/mvp-screens/`, `.st .btn`), at the 0.75 scale as every length since ui-1.2.0 (the sketch's 4 px
outline, 5 px shadow and 14 px corners are `stroke.control` 6, `offset.base` 8 and `radius.control` 21 here).

- **The face:** `ToyButtonSecondary`, `ToyButtonDanger`, `ToyMenuItem` and `ToyButtonPrimary` have a 6 px ink outline
  on every side (`border-width` `{stroke.control}`) and no expand margin; the edge form (14 px right and bottom outlines)
  is gone from every button.
- **The hard shadow** is the base layer, never a StyleBox shadow (Godot's blurs): `ToyBaseRaisedOnDark` /
  `ToyBaseRaisedOnLight`, exactly the face's shape moved 8 px right and 8 px down (expand −8 top and left, +8 right and
  bottom, the face's corners), drawn by ToyRaised under the secondary and danger buttons and, new in ui-1.4.0, under the
  main-menu entries (`ToyMenuItem` gains the `base` and `press.depth` 8). Nothing of it shows left of or above the face.
- **Press:** hover a step lighter (as before), held a step darker and the face sinks `press.held` 4 px toward its shadow
  (ToyPress moves it down only), unplugged lilac with a soft-ink outline and no shadow (`base.visible = not disabled`).
  The open main-menu entry (toggled on) is green and does not sink.
- **Focus, no second frame:** two new forms of the `focus` StyleBox, both checked by P48:
  - *filled* (`ToyMenuItem`, `ToyButtonSecondary`): an opaque box of exactly the normal face's shape (the same outline
    widths, ink and corners, no expand), the alien green `palette.green` #A6E85A, as the open entry. Godot draws `focus`
    over the state's StyleBox and under the label ([button.cpp L228-L230](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/button.cpp#L228-L230),
    the label at [L461](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/button.cpp#L461)), so the focused
    entry reads green with its own label. The page draws it as the face's own fill while `.is-focus` / `:focus-visible`.
  - *outer ring* (`ToyButtonPrimary`, `ToyButtonDanger`): no fill, a mint ring (`color.on-dark.line`) of `focus.width`
    5 px with `focus.gap` 3 px of the ground between it and the outline (expand 8, corners 21 + 8 = 29), as the chips'
    rings; the acid or coral face and its outline stay as they are. The ring follows the surface: an ink ring would
    vanish on the purple (1.1:1) and a mint one on mint (1.0:1), so a button standing on a mint face takes
    `ToyButtonPrimaryOnMint` / `ToyButtonDangerOnMint` (new, the same sticker with an ink ring, `godot.on`
    `ToyMutationCard`): today the workbench's buy buttons. P58 lets a Button name its surface in `on`, and the contrast
    gate checks an outer ring against its `on` surfaces where a button names them, else against its context.
  - P48 also still knows a *thick outline* (a clear box whose outline is the face's plus `focus.width`); no variation
    uses it since the coordinator's review (it read as the slab again).
- **The main action** keeps its acid face and its glow (`glow.action`) with the equal 6 px outline, no base and no hard
  shadow.
- **Unchanged:** `ToyButtonPlain`, the ghost buttons, chips, tabs, keys, fields, the dropdown, preset cards and plates.

## Deprecated variations

`ToyChipNew` and `ToyChipNewText` carry `$deprecated` since ui-0.2.0 (the NEW tag is gone; `ToyChipAlert` replaces them);
since ui-1.3.0 also `ToyBasePrimaryOnDark`, `ToyBasePrimaryOnLight`, `ToyBarAngerTrack`, `ToyBarTrack`, `ToyBarAnger`,
`ToyBarHealth`, `ToyBarStamina` (no replacement since ui-2.0.0); since ui-2.0.0 also `ToyBaseRaisedOnDark`,
`ToyBaseRaisedOnLight`, `ToyBasePanel`, `ToyBaseCard`, `ToyBaseTitle` (no shadow layers), `ToyBarHealthCalm`,
`ToyBarHealthAlarm`, `ToyBarStaminaCalm`, `ToyBarStaminaAlarm` (the pips) and `ToyButtonPrimaryOnMint`,
`ToyButtonDangerOnMint` (replaced by `ToyButtonPrimary`, `ToyButtonDanger`). ui-2.0.0 is a major release but removes no
variation, so the game's scenes and theme test keep working; they leave with the next major release after it. A deprecated variant names its replacement in
`godot.replacement` (`ToyChipAlert`, `ToyChipAlertText`); P62 checks it is a variant of the same class that is not
deprecated itself. The pack marks both (below).

## The pack's members since ui-0.3.0

`schema` stays 1: every member below is new and optional, so a generator that ignores it still works.

- **`assets`**: one entry per icon in `dist/pack/icons/` (and `icons/room/`), sorted by path:
  `{ "path": "icons/check.svg", "kind": "icon", "sha256": "<64 hex of the file>", "licence": "own work",
  "licence_file": "icons/LICENCES.json", "source": "pages/components/icons/check.svg", "size": [24, 24], "drawn_px": 120,
  "svg_scale": 5, "tint": "multiply" }`.
  - `size` is the SVG's own size (width and height, else its viewBox); `drawn_px` the largest size a screen of
    `pages/screens/src` draws it at (a TextureRect by its custom_minimum_size, a Button icon by `icon_size` or its own
    size, an OptionButton's arrow and an HSlider's knobs at their own size; an item picture `icons/item-*.svg`, which the
    game swaps in a slot, the largest size any item picture is drawn at; an icon no screen draws keeps its own size);
    `svg_scale` = `drawn_px` ÷ the larger side of `size`, rounded up to 0.01: the `svg/scale` to import it at, as the
    screens' handoffs list it. The pack is rebuilt when a screen changes an icon's size.
  - `tint`: `"multiply"` for a white copy (currentColor or the room ink written as `#ffffff`): the game colours it by
    multiplying (`self_modulate`, a Button's `icon_*_color`, OptionButton's `modulate_arrow`); `"none"` for an icon in
    its own colours (the slider knobs), never tinted.
  - `tint_color` (only where the pages always draw the icon in one colour): the `self_modulate` that draws it as the
    pages do: the dim colour `#a39dbd` for the room pictograms since ui-2.2.0.
  - `deprecated` (since ui-1.3.0, only on a deprecated icon): `{ "replacement": "<assets path>" | null, "note": "<reason>" }`,
    the form of a deprecated variation, from the icon's licence record (`"deprecated": "<reason>"`, `"replacement":
    "<file of the same folder>" | null`, `tools/tokens/icons.js`). The file stays in the pack until the next major
    release. None today: the grown-up set 2 (`item2-*`, not chosen on 2026-10-21) left the pack's `assets` and
    licences before any tag; fourteen stray copies of its SVGs stayed in `dist/pack/icons/` at ui-1.3.0 (listed nowhere,
    so not part of the pack) and ui-1.4.0 deletes them. It lives on as `pages/mvp-screens/item2/` for the sketch page only.
  - **Importing them:** ui-sync puts a `.gdignore` in the pack's folder, so Godot imports nothing under it. The game
    copies the icons into a folder Godot imports, keeps them under the same sha256 lock (`sha256` here is the file's), and
    imports each at its `svg_scale`.
- **`variations.<name>.textures`** (only where a variant names textures): `{ "<theme icon, kebab-case>": "<assets path>" }`,
  e.g. ToySlider `{ "grabber": "icons/slider-knob.svg", "grabber-highlight": "icons/slider-knob.svg",
  "grabber-disabled": "icons/slider-knob-disabled.svg" }`, ToyDropdown `{ "arrow": "icons/chevron-down.svg" }` and
  ToyDropdownList's four radio icons: the generator sets each as the theme icon (`grabber_highlight`,
  `radio_checked_disabled`) of that variation.
- **PopupMenu** (since ui-0.3.0, `ToyDropdownList`): its `styleboxes` are `panel`, `hover` and `separator` (Godot's
  StyleBox names); its `items` are theme colours (`font_color`, `font_hover_color`, `font_disabled_color`) and
  constants (`v_separation`, `h_separation`, `item_start_padding`, `item_end_padding`), kebab-case to snake_case like
  every item; `font` and `font_size` come from its `label`. The game sets it on every OptionButton's `get_popup()`.
- **`variations.<name>.deprecated`** (only on a deprecated variation): `{ "replacement": "<variation>" | null, "note":
  "<the $deprecated text>" | null }`, e.g. ToyChipNew `{ "replacement": "ToyChipAlert", … }`. The variation stays in the
  pack, complete, until the next major release.
- **`modes.textSize.large`** now also holds a dimension that is not a font size: `size.keycap` (42) and the keycap
  variations' `size.min-width` that reference it (ToyKeyOnDark, ToyKeyOnLight, ToyKeyQuiet, ToyKeyRound,
  ToyKeyRoundQuiet, ToyKeyRoundButton, ToyKeyButton; `from` names `size.keycap`). The large-text theme's `min_width`
  constant of these variations is 42. `wide-min-width` (96) does not change.

## The pack's card art since ui-0.4.0

`schema` stays 1. The how-to cards are wordless (`docs/ui-decisions.md`): a frame holds only its art, and
`ToyHowtoCaption` is deprecated. The art ships beside the pack as PNG, because the chosen clean-sketch line is an SVG
filter Godot's SVG importer does not draw:

- `tools/card-art/render.js` (local, headless Edge) renders the Delivery panels at 2x (640×480, transparent
  background) into `pages/card-art/png/` and records each PNG's and SVG's sha256 in `renders.json`; `--check` (a step
  of `tools/check.js`) needs no Edge. Two Delivery cards ship since ui-0.8.0: `delivery-1..4.png` from
  `pages/card-art/round-2/clean-sketch/` (the greybox's colour Delivery, task `colour_delivery`; `delivery` until
  ui-0.7.0) and `delivery-meaning-1..4.png` from `pages/card-art/round-3/a/` (the House's Delivery by meaning, task
  `delivery`).
- The token build (`tools/tokens/cards.js`) copies them byte for byte into `dist/pack/cards/` with `cards/LICENCES.json`,
  and refuses (B03) a PNG whose SVG changed since it was rendered. Switches is a sample card of the pages, not a game
  task: it is not rendered and not shipped.
- **`assets`** gains one entry per PNG, sorted by path with the icons:
  `{ "path": "cards/delivery-1.png", "kind": "card-art", "sha256": "…", "licence": "own work", "licence_file":
  "cards/LICENCES.json", "source": "pages/card-art/round-2/clean-sketch/delivery-1.svg", "size": [640, 480], "task":
  "colour_delivery", "frame": 1 }`; the last frame of a task also has `"done": true` (drawn in `ToyHowtoFrameDone`). The
  game imports them as Texture2D (Lossless, mipmaps on), never tinted, in a TextureRect with `EXPAND_IGNORE_SIZE` and
  `STRETCH_KEEP_ASPECT_CENTERED`.

## The pack's fonts since ui-0.5.0 (Onest and Unbounded since ui-2.0.0)

`schema` stays 1. The fonts ship beside the pack, so the game takes them from one pinned source (prime-game-ui#44).
Since ui-2.0.0 (the plain tile) there are two families, both SIL OFL 1.1 with Latin and Cyrillic: **Onest** (text, Medium
500 and Bold 700) and **Unbounded** (titles, numbers, the loud titles and the kickers, Bold 700). Nunito, Rubik and
Kablammo left with the sticker.

- `fonts/<family>/` holds the upstream files byte for byte: google/fonts' `ofl/<family>/<Family>[wght].ttf` at
  45e3d52 (`Onest[wght].ttf` 193 056 bytes, `Unbounded[wght].ttf` 778 272 bytes), renamed to Google Fonts' download names
  (`Onest-VariableFont_wght.ttf`, `Unbounded-VariableFont_wght.ttf`: no brackets, which PowerShell and globs read as
  wildcards), and its `OFL.txt` (kept byte for byte by `.gitattributes`). `LICENCES.json` records each file's upstream URL,
  its raw `download` URL, git blob, size (`bytes`), family, axes and expected `metrics`.
- **Waiting for the download (ui-2.0.0).** The records were written from the GitHub API before anything was downloaded
  (the engineer's yes is pending), so they hold the git blob and size instead of a sha256, and expected metrics taken from
  @capsizecss/metrics 4.4.0 (unconfirmed). Until the four files are in `fonts/onest/` and `fonts/unbounded/`, the token
  build lists each as MISSING (path, size, git blob, URL) and fails, ships no font, and takes the line boxes from the
  expected metrics; everything else builds. With the files in, `node tools/tokens/build.js` checks each by its git blob and
  size, reads its own metrics (B04 refuses a difference from the record's, naming the line height to set), computes the
  sha256 the pack's `assets` and `fonts/LICENCES.json` carry, and ships them.
- The token build (`tools/tokens/fonts.js`) copies them into `dist/pack/fonts/` with `fonts/LICENCES.json`. Each
  family's licence text ships under the family's name, `OFL-<Family>.txt` (`OFL-Onest.txt`), bytes unchanged, so two
  families never collide. It refuses (B04) a file that is not its record's (sha256, or git blob and size), a font
  without an allowed licence or its licence text, a family no `font.family.*` token names, a family no type role uses,
  and a weight a type role (`type.*`) gives a family outside that family's own `wght` axis (Onest 100 to 900, Unbounded
  200 to 900). It also refuses a type role whose `lineHeight` is not its family's own line box (below) and a font whose
  `MVAR` moves its ascender or descender per instance.
- **The line height (ui-1.1.0, #75).** Godot 4.7.2 draws a line of a Label as the font's ascent plus its descent
  ([label.cpp L392-L400](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/label.cpp#L392-L400)), from
  FreeType's size metrics ([text_server_adv.cpp L1638-L1659](https://github.com/godotengine/godot/blob/4.7.2-stable/modules/text_server_adv/text_server_adv.cpp#L1638-L1659)),
  which take OS/2 typo when `USE_TYPO_METRICS` is set, else hhea
  ([sfobjs.c L1380-L1411](https://github.com/godotengine/godot/blob/4.7.2-stable/thirdparty/freetype/src/sfnt/sfobjs.c#L1380-L1411)),
  and round the ascent up and the descent down to a whole pixel
  ([ftobjs.c L3176-L3182](https://github.com/godotengine/godot/blob/4.7.2-stable/thirdparty/freetype/src/base/ftobjs.c#L3176-L3182)); no line gap.
  So each family's `font.line-height.*` is its own (ascender + descender) / units per em: `base` (the text, the
  ui-1.0.0 name kept) Onest (970 + 305) / 1000 = 1.275, `number` and `logo` Unbounded (995 + 245) / 1000 = 1.24 (the
  expected metrics, unconfirmed until the files are here; the build then checks them). The CSS line box is the pixel height Godot draws, which the
  ratio alone cannot give: every typography token gets a derived `--toy-<token>-line-box` (an int, per text size:
  `type.body` 29 at 22 px, 37 at 28 px with Onest's expected metrics; `tools/tokens/fonts.js` `lineBoxPx`, FreeType's fixed point), and the pages
  set `line-height: calc(var(--toy-…-line-box) * var(--px))`. In the game a Label variation's `line_spacing` is 0:
  the font's own line is the line (the generator's `fontSizePx × lineHeight` rounds below Godot's line by up to 2 px).
- **`assets`** has one entry per font, sorted by path with the others:
  `{ "path": "fonts/Onest-VariableFont_wght.ttf", "kind": "font", "sha256": "…", "licence": "OFL-1.1",
  "licence_file": "fonts/LICENCES.json", "licence_text": "fonts/OFL-Onest.txt", "source": "fonts/onest/…", "family":
  "Onest", "axes": { "wght": [100, 900] }, "weights": [500, 700] }`; `weights` are the weights the type roles give
  that family (Unbounded `[700]`). None ships until the files are downloaded (above).
- **In Godot:** one `FontFile` per file, and per family one `FontVariation` per weight, its `base_font` that file and
  `variation_opentype` `{ "wght": 700 }`. The theme generator gives
  each typography token the font of its `fontFamily` at its `fontWeight`. The game ships each `OFL-<Family>.txt` with
  its font. (The game's generator read one font until ui-0.8.0; the families need it to pick by `fontFamily`.)

## The pack's base-type sources since ui-0.7.0

`schema` stays 1. The game's theme styles a bare control (one with no `theme_type_variation`) through a base type named
after its engine class, copied from a pack variation of that very class with no parent (prime-game#576, its
`tools/theme/mapping.json` `base_types`). The engineer's answers on the base-controls page (prime-game-ui#52,
2026-10-14) add the looks it lacked, so the game can set `gui/theme/default_theme_scale` to 1 (prime-game#620):

- **CheckBox: `ToyCheckBox`** (`pick.check-box`, class CheckBox, context any): borderless on the purple (no face; hover a lighter-purple
  band, `radius.medium`) with the box texture at its left and the mint label (`type.body`) 12 px after it
  (`h-separation`); the texture draws the state; focus is a mint ring; disabled has no face. It sets every item a Button sets (the six StyleBoxes, the six font colours, the six
  icon colours, `h-separation`, the font size), so the game's Button base type never reaches it. Its `textures`:
  `checked` `icons/checkbox-checked.svg` (green, ink check), `unchecked` `icons/checkbox-unchecked.svg` (mint), both
  with a 6 px ink outline, `checked-disabled` and `unchecked-disabled` (lilac with soft ink, the unplugged face): 42 px, own colours
  (`tint: "none"`), so `checkbox_checked_color` and `checkbox_unchecked_color` stay the default white. The radio icons
  (a CheckBox in a ButtonGroup) are not bound: no Toy screen has one.
- **SpinBox: `ToySpinBox`** (`field.spin`, class SpinBox, context any): its eight button StyleBoxes (green, 4 px ink
  outline, flat; `-hovered` lighter green, `-pressed` darker green, `-disabled` lilac), `buttons-width` 34, `field-and-buttons-separation` 8, `buttons-vertical-separation` 2, the eight
  `*-icon-modulate` colours (ink; soft ink when disabled) and the arrows `icons/spin-up.svg`, `icons/spin-down.svg`
  (27 px white chevrons, `tint: "multiply"`). Its separators stay the default theme's empty ones.
- **SpinBox's field: `ToySpinField`** (`field.spin-input`, class LineEdit, context any): `ToyField` with 12 px above and
  below instead of 10, so each arrow button is at least 24 px high. Godot names the field's variation
  `SpinBoxInnerLineEdit`; the game gives it this variation's items.
- **Button: `ToyButtonPlain`** (`button.plain`, class Button, no parent, context any): the mint secondary face, flat (no
  `base`, no `press`: a bare Button has no ToyRaised); hover lighter mint, held darker mint, the secondary button's focus ring and
  disabled look, icon colours in the label's colour.
- **`font.size.theme-default`**: the theme's `default_font_size`, 27 (the greybox's 16 × 5/3); the large text size's is 34
  (27 × 1.25 rounded), in `modes.textSize.large`.

## Profile rules since ui-0.3.0

These extend spec §7.2 (P40–P60):

| Id | Rule |
|---|---|
| P42 | (extended) a listed `*-color` or `*-modulate` item (PopupMenu's font colours, SpinBox's icon modulates) is a colour; the other listed items are dimensions, `center-grabber` a number |
| P43 | (extended, ui-1.3.0) a state may author the glow, `shadow-color` and `shadow-size` (any other `shadow*` field is refused: the offset stays 0); P44 refuses a `shadow-size` below 0 |
| P44 | (extended) a listed `*-padding` item (PopupMenu's `item-start-padding`, `item-end-padding`) is ≥ 0, as separations are |
| P47 | (extended) a PopupMenu variant needs the states `panel`, `hover`, `separator` and the items `font-color`, `font-hover-color`, `font-disabled-color`, `v-separation` (CLASSES `requiredItems`); a CheckBox variant `normal`, `disabled`, `focus`; a SpinBox variant `up-background` and all its listed items |
| P48 | (extended, ui-1.4.0) a Button or OptionButton `focus` may also be *filled* (opaque, exactly the normal face's outline widths, colour and corners, no expand on it or on the face) or a *thick outline* (clear, no expand, each outline the face's plus `focus.width`, the face's colour and corners) |
| P50 | (extended, ui-1.0.0) a base may also sit dx ≥ 0 to the right (the sticker's hard shadow): its left expand is the owner's − dx and its right the owner's + dx, one offset for all of a face's bases; the showcase draws it as `box-shadow: dx dy 0` (lint L12 now refuses only a shift to the left) |
| P53 | (extended) a component dimension may also alias `offset.*` (ui-1.0.0) and `glow.*` (ui-1.3.0); a variant's `size` member may also alias `size.*`, and only a `size.*` a modifier owns |
| P61 | `godot.textures` is a non-empty object; each key is one of the class's theme icons (`expand.js` CLASSES `textures`), each value the pack path of an icon that exists and has an allowed licence record |
| P62 | `godot.replacement` only on a variant with `$deprecated`; it names a variant of the same class that is not deprecated |
| P63 | A modifier's files define only the paths it owns (`validate.js` MODIFIER_OWNS: textSize `font.size.*`, `size.keycap`; motion `duration.press`), and the base set none of them |
| P64 | `godot.uppercase` is `true` or absent, and only on a Label variant (ui-2.1.0) |

## Releases

`release.json` holds the version; the pack copies it. A release is the git tag `ui-<version>` on `main`, and
`node tools/check.js --release ui-X.Y.Z` checks that the tag, `release.json` and the pack agree and that the bump is big
enough against the previous `ui-*` tag's pack:

- **major**: a token path, variation, variation member (`textures`, `deprecated`), asset or pack member removed, renamed
  or retyped, or the pack `schema` bumped;
- **minor**: one added;
- **patch**: only values changed (an asset's file or import values included).

The PR is merged once CI is green and the merge commit is tagged (by the agent, under the trust rules in
`CLAUDE.md`); prime-game then copies `dist/pack/` at that tag byte for byte and
records the tag and commit in its lock file (spec §9.3).
