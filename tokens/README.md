# Toy design tokens

The single source of truth for the Toy look ([DTCG 2025.10](https://www.designtokens.org/tr/2025.10/)). The showcase CSS
and the game's Godot theme are both generated from these files, never copied by hand. The full contract is the build
spec, [`docs/research/2026-10-03-tokens/spec.md`](../docs/research/2026-10-03-tokens/spec.md) (§2 to §6).

## Files

| File | What it holds |
|---|---|
| `prime.resolver.json` | The resolver: one base set (the files below, in order) and two modifiers, `textSize` and `motion` |
| `primitives.tokens.json` | Literals: the palette, font family, weights, letter spacing, line height, `ease.press`, `duration.none`, `focus.*`, `stroke.*`, `radius.*`, `space.*` (the screens' gaps: 4, 8, 12, 16, 24, 32) |
| `semantic.tokens.json` | Aliases of primitives: colour roles by context (`color.*`), the 14 type roles (`type.*`), `motion.press` |
| `components/<name>.tokens.json` | 21 files, 121 Godot type variations (the abstract ToyButton and the two deprecated chips included): one variant group per variation, with its StyleBox states, `label`, `press`, `size`, `items`, `ramp` |
| `text-size/default.tokens.json`, `text-size/large.tokens.json` | `font.size.*` and `size.keycap` (a keycap's minimum width) for the player's text size setting |
| `motion/default.tokens.json`, `motion/reduced.tokens.json` | `duration.press` for the reduced-motion setting |
| `release.json` | The semver the next `ui-<semver>` tag carries |
| `gates.json` | Contrast pairs, surfaces and waivers for `tools/contrast/gates.js` (not a DTCG file) |

## Tiers

1. **Primitive**: literals only. The modifier files are primitives owned by one modifier, and each modifier owns exactly
   these paths (P63): `textSize` `font.size.*` and `size.keycap`, `motion` `duration.press`.
2. **Semantic**: aliases of primitives only (`{palette.ink}`), composite sub-values included.
3. **Component**: one group per variation, marked by `$extensions` `io.github.xperiaroco2.prime-game` `godot.variation`.
   Colours alias down to `palette.*`; dimensions are int px literals or aliases to the primitives `stroke.*`, `radius.*`,
   `focus.*` and `space.*`; a container's separation is always a `space.*` alias. A `size` member may also alias
   `size.*`, the lengths the text size owns (the keycaps' `min-width` is `{size.keycap}`: 36, 42 at large text), so a
   size follows the text size with no code in the game.
   The build completes each state to the 19 `StyleBoxFlat` fields (spec §3.5), so the pack needs no inheritance logic.

Lengths are int px at the 1920×1080 reference frame.

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
read, or B03 for card art whose PNG is older than its SVG or has no licence record) and the file; where the file parses it also gives the line and column, the JSON Pointer and the token path.

## Classes

A variant's `godot.class` is one of these (`tools/tokens/expand.js` CLASSES); its children are the class's states, plus
`items`, `size` and the Button extras (`label`, `press`):

| Class | States (StyleBoxes) | Items |
|---|---|---|
| Button, OptionButton | normal, hover, pressed, hover-pressed, disabled, focus | any (each needs a CSS form) |
| LineEdit | normal, focus, read-only | any |
| Panel, PanelContainer | panel | any |
| Label | normal | any |
| ProgressBar | background, fill (+ `ramp`) | any |
| HSlider | slider, grabber-area, grabber-area-highlight (from grabber-area), focus | center-grabber (0 or 1), grabber-offset |
| VScrollBar | scroll, scroll-focus (from scroll), grabber, grabber-highlight and grabber-pressed (from grabber) | none |
| VBoxContainer, HBoxContainer | none | separation (required, a `space.*` alias) |
| GridContainer | none | h-separation, v-separation (both required, `space.*` aliases) |
| ScrollContainer | none | scrollbar-h-separation (required, a `space.*` alias: the gap between the content and the vertical bar) |
| PopupMenu | panel, hover, separator (all three required) | font-color, font-hover-color, font-disabled-color (required), v-separation, h-separation, item-start-padding, item-end-padding |

- **HSlider:** its grabber, grabber_highlight and grabber_disabled are textures, not tokens
  (`pages/components/icons/slider-knob.svg` and `slider-knob-disabled.svg`, 28 px), named in `godot.textures` (below). Its `focus` is the Toy outer ring;
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
`radio-unchecked` (each also `-disabled`), `submenu`, `submenu-mirrored`, `search`. A new class adds its own there. P61
checks that each name is one of the class's icons and that the file exists with an allowed licence record. Today:
ToySlider's three knobs, ToyDropdown's `arrow` (`icons/chevron-down.svg`) and ToyDropdownList's `radio-checked`
(`icons/radio-checked.svg`, an ink check), `radio-checked-disabled` (`icons/radio-checked-disabled.svg`, the check in
the muted ink), `radio-unchecked` and `radio-unchecked-disabled` (both `icons/radio-unchecked.svg`, an empty 24 px
icon that keeps the check's gutter).

## Deprecated variations

`ToyChipNew` and `ToyChipNewText` carry `$deprecated` since ui-0.2.0 (the NEW tag is gone; `ToyChipAlert` replaces them). A
removal is a major bump, so they leave with the next major release. A deprecated variant names its replacement in
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
    size, an OptionButton's arrow and an HSlider's knobs at their own size; an icon no screen draws keeps its own size);
    `svg_scale` = `drawn_px` ÷ the larger side of `size`, rounded up to 0.01: the `svg/scale` to import it at, as the
    screens' handoffs list it. The pack is rebuilt when a screen changes an icon's size.
  - `tint`: `"multiply"` for a white copy (currentColor or the room ink written as `#ffffff`): the game colours it by
    multiplying (`self_modulate`, a Button's `icon_*_color`, OptionButton's `modulate_arrow`); `"none"` for an icon in
    its own colours (the slider knobs), never tinted.
  - `tint_color` (only where the pages always draw the icon in one colour): the `self_modulate` that draws it as the
    pages do, `#2a1f33` (ink) for the room pictograms.
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

- `tools/card-art/render.js` (local, headless Edge) renders the Delivery panels of
  `pages/card-art/round-2/clean-sketch/` at 2x (640×480, transparent background) into `pages/card-art/png/` and records
  each PNG's and SVG's sha256 in `renders.json`; `--check` (a step of `tools/check.js`) needs no Edge.
- The token build (`tools/tokens/cards.js`) copies them byte for byte into `dist/pack/cards/` with `cards/LICENCES.json`,
  and refuses (B03) a PNG whose SVG changed since it was rendered. Switches is a sample card of the pages, not a game
  task: it is not rendered and not shipped.
- **`assets`** gains one entry per PNG, sorted by path with the icons:
  `{ "path": "cards/delivery-1.png", "kind": "card-art", "sha256": "…", "licence": "own work", "licence_file":
  "cards/LICENCES.json", "source": "pages/card-art/round-2/clean-sketch/delivery-1.svg", "size": [640, 480], "task":
  "delivery", "frame": 1 }`; the last frame of a task also has `"done": true` (drawn in `ToyHowtoFrameDone`). The
  game imports them as Texture2D (Lossless, mipmaps on), never tinted, in a TextureRect with `EXPAND_IGNORE_SIZE` and
  `STRETCH_KEEP_ASPECT_CENTERED`.

## Profile rules since ui-0.3.0

These extend spec §7.2 (P40–P60):

| Id | Rule |
|---|---|
| P42 | (extended) a listed `*-color` item (PopupMenu's font colours) is a colour; the other listed items are dimensions, `center-grabber` a number |
| P44 | (extended) a listed `*-padding` item (PopupMenu's `item-start-padding`, `item-end-padding`) is ≥ 0, as separations are |
| P47 | (extended) a PopupMenu variant needs the states `panel`, `hover`, `separator` and the items `font-color`, `font-hover-color`, `font-disabled-color`, `v-separation` (CLASSES `requiredItems`) |
| P53 | (extended) a variant's `size` member may also alias `size.*`, and only a `size.*` a modifier owns |
| P61 | `godot.textures` is a non-empty object; each key is one of the class's theme icons (`expand.js` CLASSES `textures`), each value the pack path of an icon that exists and has an allowed licence record |
| P62 | `godot.replacement` only on a variant with `$deprecated`; it names a variant of the same class that is not deprecated |
| P63 | A modifier's files define only the paths it owns (`validate.js` MODIFIER_OWNS: textSize `font.size.*`, `size.keycap`; motion `duration.press`), and the base set none of them |

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
