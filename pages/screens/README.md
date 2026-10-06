# Styled screens

The ten session screens in the Toy style, each described as a Godot 4.7.2 scene tree, rendered from the Toy components
and the copy deck into one review page, validated, and handed off to the game one issue per screen
([prime-game-ui#19](https://github.com/xperiaroco2/prime-game-ui/issues/19)).

```text
node pages/screens/build.js                      write screens.html, screens-ui.css, screens-layout.css and
                                                 docs/handoff/<screen file>.md
node pages/screens/build.js --check              exit 1 when an output is stale (a step of tools/check.js)
node pages/screens/build.js --validate [s2 ...]  validate the sources only (all, or these screens); writes nothing
node pages/screens/build.js --handoff s2         print the screen's Godot handoff (Markdown) to stdout
node pages/screens/build.js --out <file.html> s2 [s5 ...]
                                                 a private page with only these screens, outside the repo
```

`--validate s7` checks one screen while other screens are being edited. `--out` builds a private page with only the
named screens (validated alone, the CSS inlined) to a path outside the repo (a path inside it is refused), so an author
can build and measure one screen while others edit theirs; `tools/screens/fit.js --page <file>` and
`tools/screens/shots.js --page <file>` take it. `tools/check.js` runs `screens` (validate
everything) and `page:screens` (`--check`).

## Files

| File | What it is |
|---|---|
| `src/sNN-name.json` | one screen: `s01-tutorial`, `s02-main-menu`, `s03-connecting`, `s04-lobby`, `s05-esc-menu`, `s06-pre-game`, `s07-hud`, `s08-map`, `s09-downed`, `s10-post-game`. A missing file is a screen not drawn yet. |
| `build.js` | the format (its header comment), the validation, the build and the handoff |
| `screens.html` | the review page (generated) |
| `screens-ui.css` | the components CSS of the variations the screens draw (generated, lint profile `generated`) |
| `screens-layout.css` | Godot's containers emulated in CSS (generated, lint profile `layout`: layout only, no paint) |
| `page.css`, `page.js` | the page chrome, the world art and the measuring mode (outside the lint) |
| `docs/handoff/sNN-name.md` | each screen's handoff (the `--handoff` text), generated and checked by `--check`; the prime-game handoff issues link to these files, since a long screen's handoff passes GitHub's 65,536-character issue limit |

## The format

A screen file mirrors a Godot scene, so the handoff is one to one. Godot's defaults are the format's defaults: a node
states only what differs, with Godot's property names.

```json
{
  "id": "s2", "wireframe": "s2", "title": "Main menu", "background": "menu",
  "note": "English, for the game developer (optional)",
  "states": [{ "id": "main", "label": "Меню", "note": "optional, English" }, { "id": "join", "label": "Приєднатися" }],
  "nodes": [{ "name": "Menu", "type": "VBoxContainer", "anchors_preset": "center_left", "offset_left": 134, "children": [] }]
}
```

- **Screen:** `id` comes from the file name (`s02-…` is `s2`); `wireframe` names a section of `pages/wireframes`;
  `title` is English; `background` is the world behind the UI, page art outside the game UI and the lint: `menu` (the
  lobby behind the main menu), `room-light`, `room-dark`, `black`. `states` are the frames: an `id` (lower case), a
  short Ukrainian `label` for the page's tabs and an optional English `note`.
- **Node:** `name` (unique among its siblings; the names make the path `s2/Menu/Buttons/Host`), `type`, `variation` (a
  pack variation whose class is the type or a base of it: a Label takes Label variations, an OptionButton also Button
  ones), `states` (the states it is visible in; default all; a child cannot show where its parent is hidden),
  `per_state` (`{"join": {"state": "normal"}}`: only `key`, `args`, `count`, `state`, `value`, `text`, `placeholder`,
  `editable`, `icon`, `theme_color`, `self_modulate`, `variation`, `wide` change per state; layout never does),
  `custom_minimum_size` `[w, h]`, `note` (English: behaviour, input, timing), `children`.
- **Placement by anchors:** a root, or a child of a `Control`, `Panel` or `Button`: `anchors_preset` (Godot's
  LayoutPreset: `top_left` (default), `top_right`, `bottom_left`, `bottom_right`, `center_left`, `center_top`,
  `center_right`, `center_bottom`, `center`, `left_wide`, `top_wide`, `right_wide`, `bottom_wide`, `vcenter_wide`,
  `hcenter_wide`, `full_rect`), `offset_left/top/right/bottom` (reference px, default 0), `grow_horizontal` and
  `grow_vertical` (`begin`, `end`, `both`; default what the editor sets with the preset). As in Godot, a rect smaller
  than the node's minimum size grows from it in the grow direction, so `center` with zero offsets centres the node at
  its minimum size.
- **Placement by a container:** `size_flags_horizontal` and `size_flags_vertical`: `fill` (default), `shrink_begin`,
  `shrink_center`, `shrink_end`, `expand_fill`, `expand_shrink_begin`, `expand_shrink_center`, `expand_shrink_end`;
  `size_flags_stretch_ratio` (in a box, with an expand flag). A `CenterContainer` ignores size flags.

| Type | Its own fields (default) | Rendered as |
|---|---|---|
| `Control` | children placed by anchors | a plain box |
| `Panel` | `variation` (required) | the StyleBox; children placed by anchors |
| `PanelContainer` | `variation` (required), `wide` | the StyleBox; children fill its content rect |
| `MarginContainer` | – (its margins are theme constants, so setting them is an override the theme test forbids: refused) | children fill its rect |
| `CenterContainer` | – | children centred at their minimum size |
| `VBoxContainer`, `HBoxContainer` | `variation` (a spacing variation, below), `alignment` `begin`/`center`/`end` | a box: free space to expanding children by ratio; the gap is the variation's |
| `GridContainer` | `variation` (`ToyGridList` or `ToyGridSwatch`), `columns` (1) | a grid; a column or row with an expanding child expands |
| `ScrollContainer` | `variation` (`ToyScroll`: 8 px between the child and the bar), `scroll_vertical` (0, reference px; the page shows the view scrolled) | vertical scrolling only: one child, which fills the width and keeps its minimum height; the bar is a `VScrollBar` drawn with `ToyScrollBar` when the child is taller than the view, and the child is then narrower by the bar and the variation's `scrollbar_h_separation` |
| `HSlider` | `variation` (`ToySlider`), `value` (0), `min_value` (0), `max_value` (100), `step` (1), `editable` (true), `state` `normal`/`hover`/`focus` | the track, the fill to the grabber's centre, the grabber texture (`icons/slider-knob.svg`, `slider-knob-disabled.svg` when not editable), the focus ring |
| `VScrollBar` | `variation` (`ToyScrollBar`), `value` (0), `min_value` (0), `max_value` (100), `page` (0), `state` `normal`/`hover`/`held`/`focus` | the track and the grabber (page ÷ range long, at value ÷ range) |
| `Label` | `key`, `args`, `count`, `piece`, `value_of`, or `text` (a data text), `horizontal_alignment` (`left`), `vertical_alignment` (`top`), `autowrap_mode` (`off`, `arbitrary`, `word`, `word_smart`; needs a `custom_minimum_size` width), `clip_text` (false), `text_overrun_behavior` (`no_trimming`, `trim_char`, `trim_word`, `trim_ellipsis`, `trim_word_ellipsis`) | the text |
| `Button` | `key` or `text` (a data text), and/or `icon`, `icon_size` (the SVG's size), `args`, `count`, `state`, `toggle_mode`, `alignment` (`center`), `h_separation` (the variation's theme constant, else 4), `wide` (ToyKeyButton's wide keycap), `clip_text`, `text_overrun_behavior` | the face, the icon tinted by the variation's icon colours; children placed by anchors. With no key, text or icon its children are its content: they fill its StyleBox content rect (no anchors or size flags), as the preset cards' name and note |
| `OptionButton` | `key` (the shown item), `args`, `items` (keys), `state`, `clip_text`, `text_overrun_behavior` | text and the arrow (`icons/chevron-down.svg`) |
| `LineEdit` | `text` (a sample value; `""` or no text and no placeholder is an empty field) or `placeholder` (a key), `editable` (true), `state` `normal`/`focus` | the field, the caret when focused |
| `ProgressBar` | `value` (0), `max_value` (100), `show_percentage` (must be `false`) | the fill; ToyBarHealth picks its ramp stop |
| `TextureRect` | `icon`, `theme_color` (`icon-on`, `icon-off`: a colour item of the surface it sits on, as ToyMic's) or `self_modulate` (a sample colour `#rrggbb` of content data, such as a body colour; page data, not a theme colour), sized by `custom_minimum_size` | the icon, keep-aspect, centred |

- **Texts** a player reads in their language come only from `copy/strings.csv` keys: no field takes literal
  player-facing text. `args` gives every placeholder a sample value, a string or `{"uk": …, "en": …}` (player names, the
  lobby name, times, codes: sample data only here). A plural key takes `count`. `piece: N` draws the Nth part of the
  text split at `{key}` or `{preset}` (the words around a keycap); `value_of: "key"` draws the sample value of that
  placeholder (the keycap's letter inside that sentence).
- **Data texts:** `text` on a Label or Button is a sample of what the game fills from data and never translates: player
  and lobby names, the room code, times, numbers shown alone (stepper values), a key's label, the working title, glyphs
  such as «?». It takes no `args`, `count`, `piece` or `value_of`, never sits beside a `key`, and a text equal to a deck
  value (in either language, any case) is refused: that text is the key's. The handoff prints "text from data
  (auto_translate_mode = DISABLED), sample: …".
- **Cut texts:** `clip_text: true` or a trimming `text_overrun_behavior` (`trim_ellipsis` for names and device names)
  cuts a Label's, Button's or OptionButton's text at its width, as Godot does; the text then adds nothing to the
  node's minimum width (Godot: a Label 1 px, a Button its StyleBox and icon). So the width must come from somewhere:
  the build refuses a cut text where the node gets only its minimum width (a CenterContainer's child, a row child
  without `size_flags_horizontal: expand_fill`, a column child that shrinks, an anchored node at a point) unless it
  has a `custom_minimum_size` width. The page draws the cut (`text-overflow`), and the fit tool still reports a cut
  sample as `text-overflow` ("clip_text: Godot cuts it"), since a realistic value should fit.
- **Language chips:** a toggle Button with a `lang.*` key is drawn pressed while its language is the page's (the
  English frames show English selected), whatever its source state; the handoff says `button_pressed` follows the
  game's language.
- **Button states** (the look the page shows): `normal`, `hover`, `held`, `disabled`, `focus`, and with
  `toggle_mode: true` the selected ones `selected`, `selected-hover`, `selected-held`, `selected-disabled`,
  `selected-focus`, which draw the pack's `toggle.selected` variation as ToyToggle does. Name the idle variation (`ToyTab`),
  never the selected one. A variation with no toggle partner but a `pressed` StyleBox (ToyMenuItem's open item) draws
  that pressed look while selected (`selected-hover` too, as `hover_pressed` has no CSS form; `selected-disabled` the
  disabled look).
- **Spacing:** the game's theme test forbids theme overrides, so a box or grid never sets `separation`,
  `h_separation` or `v_separation`: its gap comes from a spacing variation. Columns (VBoxContainer): `ToyColumnFour`,
  `ToyColumnEight`, `ToyColumnTwelve`, `ToyColumnSixteen`, `ToyColumnTwentyFour`, `ToyColumnThirtyTwo` (4 … 32 px, the
  tokens' `space.*`); rows (HBoxContainer): `ToyRowFour` … `ToyRowThirtyTwo`; grids: `ToyGridList` (24 across, 8 down)
  and `ToyGridSwatch` (12, 12); a ScrollContainer's gap to its bar (`scrollbar_h_separation`): `ToyScroll` (8). A box or grid without a variation keeps Godot's default (4) and may hold only one child
  (there is no gap to draw). Spacing variations draw nothing, so they never make a surface for the context rule. A
  gap the scale lacks is an empty `Control` spacer with a `custom_minimum_size` (MarginContainer margins are theme
  constants too, so they would be overrides), or a question for the manager.
- **Icons:** `pages/components/icons/<name>.svg` as `<name>` (`item`, `check`, `mic`, `mic-off`) and the room
  pictograms `pages/room-signs/systems/b/icons/<name>.svg` as `room/<name>`; each needs a licence record in its
  `LICENCES.json`. A Button's icon is tinted by its variation's icon colours (ToyMenuItem's pointer), so a tinted icon
  on a variation without them is refused (Godot would draw it white); elsewhere an icon draws in the text colour of
  its context, or in the `theme_color` its TextureRect names. The game imports the white copies the token build writes
  to `dist/pack/icons/` and tints them; the handoff gives every TextureRect its `self_modulate`.

## Validation

Every error names the file, the line, the JSON pointer and what to do: an unknown type or field (including a field in
the wrong place, such as anchors inside a container); a variation missing from the pack, abstract, of a class that
does not fit the type, or the selected half of a toggle; a separation written on a box or grid (the message names the
variation to use), a MarginContainer margin, a box or grid with more than one child and no spacing variation, a spacing
variation changed per state; a ScrollContainer without exactly one child, a child that does not set `size_flags_horizontal: expand_fill`, or
one that expands vertically; an HSlider or VScrollBar value outside its range (or off the slider's step), a slider that
is not editable shown hovered or focused; a text that is not a deck key, a key beside a data text, a data text that is a
deck value or carries a key's fields; a Button with nothing to draw; a cut text that gets no width; a tinted Button
icon on a variation without icon colours; a placeholder without a sample,
an arg the key does not have, a plural key without `count`; an icon without a licence record; an undeclared state, or
one where the parent is hidden; duplicate sibling names; an anchored root whose fixed size (its
`custom_minimum_size` or the variation's size constants) leaves the 1920x1080 frame; and the context rule:

> A surface is a node drawn with a Panel or PanelContainer variation, or any node with a variation that holds
> children (but a spacing variation); the world behind the UI is a dark surface. A node drawn with a Label, Button,
> OptionButton, LineEdit, ProgressBar, HSlider or VScrollBar variation, and a ScrollContainer's ToyScrollBar, sits on
> its nearest surface ancestor. When the pack gives the variation an `on` list (ToyKeyText
> on ToyKeyOnDark, ToyKeyOnLight, ToyKeyRound), that surface must be in it; otherwise a dark or light variation needs a
> surface of the same context (a surface of context `any` passes on its own surface's context). Variations of context
> `any` fit everywhere.

Content sizes (a text that overflows its box, at large text or in English) are the fit tool's to measure
(`tools/screens/`).

## How the page emulates Godot

- **Boxes and grids** are CSS grids: a non-expanding child gets a `minmax(min-content, auto)` track, an expanding one
  `minmax(min-content, <stretch_ratio>fr)`, so the free space goes to the expanding children by ratio and never below
  their minimum size, as in BoxContainer. `min-content` makes a track hold its child's content even where the child
  has a smaller `custom_minimum_size` (Godot's minimum is the larger of the two; a plain `auto` track would take the
  child's min-width alone). A hidden child takes no track, so the track lists are written per state where they
  differ. A column or row of a GridContainer expands when one of its children does.
- **PanelContainer, MarginContainer, CenterContainer** stack their children in one grid cell (its tracks
  `minmax(min-content, auto)`); the PanelContainer's content margins are the StyleBox padding of the generated
  components CSS. A variation's size constants are minimums there, as in Godot (a slot grows with its content).
- **Size flags** are `justify-self` / `align-self` (`fill` is the default stretch).
- **Anchors:** an anchored node sits in a `.gd-anchor` box at its anchor rect (counted from the parent's rect, outside
  its border) and grows from it as its grow direction says; its size is the rect, or Godot's combined minimum when
  that is larger (`width: min-content`: a box's minimum is the sum of its children's, so an expanding sibling never
  inflates it) and at least `custom_minimum_size` and the variation's size constants.
- **Minimum sizes:** a node is never smaller than its content, as in Godot. An autowrapping Label, a cut text and a
  LineEdit add no width of their own (`contain: inline-size`), a TextureRect only its `custom_minimum_size`
  (`contain: size`). `word_smart` wraps at words and breaks a word longer than the line (`overflow-wrap: anywhere`).
  An empty LineEdit keeps one line of its font.
- **Gaps** are the spacing variations' (`gap`, `column-gap`, `row-gap` in the generated components CSS).
- **ScrollContainer:** a view that scrolls vertically (its native bar hidden) over a zero-height grid row, so the child
  keeps its own height and the container adds none to its parent (in Godot its minimum height is
  `custom_minimum_size` only); its minimum width is the child's (`min-width: min-content`), as horizontal scrolling
  is disabled. `page.js` does what Godot's `update_scrollbars` does: when the child is taller than the
  view it shows the `ToyScrollBar` (`data-vscroll="1"`): the container becomes two grid columns, the view and the bar
  at its minimum width, and the column gap is the variation's `scrollbar_h_separation` (Godot 4.7's class reference:
  the space between the vertical scroll bar and the content; 0 without ToyScroll). It sizes the grabber to the visible
  part; it runs before `data-ready` and after every switch. Wheel and touch scroll the view on the page; the bar follows.
- **Expand margins:** a panel's expand margins draw outside its rect (negative margins in the components CSS); an
  anchored node's box is its anchor rect plus them, so ToySwatchSelected's ring shows.
- **A Button's content:** a Button with no key, text or icon is a grid cell over its StyleBox content box (the
  components CSS padding), and its children fill it; the Button grows to hold them, where Godot needs its
  `custom_minimum_size` to.
- **HSlider:** a flex line: the track across the whole width, then the grabber-area (the fill and the grabber texture)
  and the rest sharing the width less the grabber by `--value`, so the grabber lands where Godot draws it.
- **Known limits:** Godot's LineEdit minimum of four characters is not drawn (give it a
  width or let a container fill it); icons draw in the text colour of their context; a ScrollContainer counts its bar's
  width in its minimum width only while the bar shows (Godot always does once the child has a height); an HSlider is at
  least its grabber wide (Godot: 0).

## The page contract (the fit tool codes against it)

1. `<html>` carries `lang`, `data-lang` (`uk`, `en`) and `data-text-size` (`default`, `large`); the page switches both,
   Ukrainian and default first. Large text is the tokens' textSize modifier.
2. Every state is one frame, `<div class="sc-frame" data-screen="s2" data-state="main">`, 1920x1080 reference px
   (`calc(1920 * var(--px))`), clipping like the game window; all of the state's UI is inside it.
3. Every node is one element with `data-node="s2/Menu/Buttons/Host"`, `data-type` (the Godot class) and
   `data-variation` (the variation drawn, the selected one for a pressed toggle). The element holding a text carries
   `data-key` (a deck text) or `data-text="data"` (a data text) and only that text (a Label is that element itself; a
   Button's text is a child span; a LineEdit's sample value is a child span marked `data-text`; an icon is a
   sibling). A node that cuts its text on purpose carries `data-clip` (`ellipsis` or `clip`). An anchored node is wrapped in a `.gd-anchor` box without `data-node`. A ScrollContainer's view
   (`.gd-scroll-view`, `overflow-y: auto`) and its drawn bar (`.gd-VScrollBar`, `data-bar-of`) carry no `data-node`:
   they are the container's own parts.
4. Measuring mode, local only: `screens.html?only=<screen>:<state>&lang=uk|en&size=default|large` renders that frame
   alone at zoom 1 at the top left with no chrome or margins; `?only=all` stacks every frame, each frame's top at a
   multiple of 1080 px, in source order. When the fonts and the layout are done, `<html>` gets `data-ready="1"`.

## The handoff

`--handoff s2` prints Markdown for the body of a prime-game issue: the source, the theme version, the world, the
states; the full node tree in the first state (types, variations with their ToyRaised base, anchors and grow, size
flags, minimum sizes, the spacing variations' gaps, keys with their English and Ukrainian, sample values, notes); then
for every other state what is shown (each shown subtree from its path), hidden or changed. `node pages/screens/build.js`
also writes every screen's handoff to `docs/handoff/<screen file>.md` (checked by `--check`); the issues link there.
Each node line gives `custom_minimum_size` with the variation's size constants it comes from, what goes on a raised
node's ToyRaised wrapper, the cut-text properties, the icon (its white copy in `dist/pack/icons/`) and its tint. The
notes say what the game sets in code: the raised wrapper, the size constants, the icons' tints and `svg/scale` (one
value per file, the pack's `assets`: the largest size any screen draws it at), a
ScrollContainer's bar variation, an HSlider's grabber textures and its focus ring (Slider draws no focus StyleBox), the
missing PopupMenu look. Then the keys the screen draws and the keys only its notes name, and the layers and input
rules every screen shares (CanvasLayer order; Esc closes the topmost overlay first).
