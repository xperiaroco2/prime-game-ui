# Styled screens

The ten session screens in the Toy style, each described as a Godot 4.7.2 scene tree, rendered from the Toy components
and the copy deck into one review page, validated, and handed off to the game one issue per screen
([prime-game-ui#19](https://github.com/xperiaroco2/prime-game-ui/issues/19)).

```text
node pages/screens/build.js                      write screens.html, screens-ui.css and screens-layout.css
node pages/screens/build.js --check              exit 1 when an output is stale (a step of tools/check.js)
node pages/screens/build.js --validate [s2 ...]  validate the sources only (all, or these screens); writes nothing
node pages/screens/build.js --handoff s2         print the screen's Godot handoff (Markdown) to stdout
```

`--validate s7` checks one screen while other screens are being edited. `tools/check.js` runs `screens` (validate
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
  `editable`, `icon`, `theme_color`, `variation`, `wide` change per state; layout never does), `custom_minimum_size` `[w, h]`, `note`
  (English: behaviour, input, timing), `children`.
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
| `MarginContainer` | `margin_left/top/right/bottom` (0) | children fill the rect minus the margins |
| `CenterContainer` | – | children centred at their minimum size |
| `VBoxContainer`, `HBoxContainer` | `separation` (4), `alignment` `begin`/`center`/`end` | a box: free space to expanding children by ratio |
| `GridContainer` | `columns` (1), `h_separation` (4), `v_separation` (4) | a grid; a column or row with an expanding child expands |
| `Label` | `key`, `args`, `count`, `piece`, `value_of`, `horizontal_alignment` (`left`), `vertical_alignment` (`top`), `autowrap_mode` (`off`, `arbitrary`, `word`, `word_smart`; needs a `custom_minimum_size` width) | the text |
| `Button` | `key` and/or `icon`, `icon_size` (the SVG's size), `args`, `count`, `state`, `toggle_mode`, `alignment` (`center`), `h_separation` (the variation's theme constant, else 4) | the face, the icon tinted by the variation's icon colours; children placed by anchors |
| `OptionButton` | `key` (the shown item), `args`, `items` (keys), `state` | text and the arrow (`icons/chevron-down.svg`) |
| `LineEdit` | `text` (a sample value) or `placeholder` (a key), `editable` (true), `state` `normal`/`focus` | the field, the caret when focused |
| `ProgressBar` | `value` (0), `max_value` (100), `show_percentage` (must be `false`) | the fill; ToyBarHealth picks its ramp stop |
| `TextureRect` | `icon`, `theme_color` (`icon-on`, `icon-off`: a colour item of the surface it sits on, as ToyMic's), sized by `custom_minimum_size` | the icon, keep-aspect, centred |

- **Texts** come only from `copy/strings.csv` keys: no field takes literal player-facing text. `args` gives every
  placeholder a sample value, a string or `{"uk": …, "en": …}` (player names, the lobby name, times, codes: sample data
  only here). A plural key takes `count`. `piece: N` draws the Nth part of the text split at `{key}` or `{preset}` (the
  words around a keycap); `value_of: "key"` draws the sample value of that placeholder (the keycap's letter).
- **Button states** (the look the page shows): `normal`, `hover`, `held`, `disabled`, `focus`, and with
  `toggle_mode: true` the selected ones `selected`, `selected-hover`, `selected-held`, `selected-disabled`,
  `selected-focus`, which draw the pack's `toggle.selected` variation as ToyToggle does. Name the idle variation (`ToyTab`),
  never the selected one.
- **Icons:** `pages/components/icons/<name>.svg` as `<name>` (`item`, `check`, `mic`, `mic-off`) and the room
  pictograms `pages/room-signs/systems/b/icons/<name>.svg` as `room/<name>`; each needs a licence record in its
  `LICENCES.json`. A Button's icon is tinted by its variation's icon colours (ToyMenuItem's pointer); elsewhere an icon
  draws in the text colour of its context, or in the `theme_color` its TextureRect names.

## Validation

Every error names the file, the line, the JSON pointer and what to do: an unknown type or field (including a field in
the wrong place, such as anchors inside a container); a variation missing from the pack, abstract, of a class that
does not fit the type, or the selected half of a toggle; a text that is not a deck key; a placeholder without a sample,
an arg the key does not have, a plural key without `count`; an icon without a licence record; an undeclared state, or
one where the parent is hidden; duplicate sibling names; an anchored root whose fixed size (its
`custom_minimum_size` or the variation's size constants) leaves the 1920x1080 frame; and the context rule:

> A surface is a node drawn with a Panel or PanelContainer variation, or any node with a variation that holds
> children; the world behind the UI is a dark surface. A node drawn with a Label, Button, OptionButton, LineEdit or
> ProgressBar variation sits on its nearest surface ancestor. When the pack gives the variation an `on` list (ToyKeyText
> on ToyKeyOnDark, ToyKeyOnLight, ToyKeyRound), that surface must be in it; otherwise a dark or light variation needs a
> surface of the same context (a surface of context `any` passes on its own surface's context). Variations of context
> `any` fit everywhere.

Content sizes (a text that overflows its box, at large text or in English) are the fit tool's to measure
(`tools/screens/`).

## How the page emulates Godot

- **Boxes and grids** are CSS grids: a non-expanding child gets an `auto` track, an expanding one `<stretch_ratio>fr`,
  so the free space goes to the expanding children by ratio and never below their minimum size, as in BoxContainer. A
  hidden child takes no track, so the track lists are written per state where they differ. A column or row of a
  GridContainer expands when one of its children does.
- **PanelContainer, MarginContainer, CenterContainer** stack their children in one grid cell; the PanelContainer's
  content margins are the StyleBox padding of the generated components CSS.
- **Size flags** are `justify-self` / `align-self` (`fill` is the default stretch).
- **Anchors:** an anchored node sits in a `.gd-anchor` box at its anchor rect (counted from the parent's rect, outside
  its border) and grows from it as its grow direction says; its size is at least the rect and at least
  `custom_minimum_size`.
- **Minimum sizes:** a node is never smaller than its content, as in Godot. An autowrapping Label and a LineEdit add no
  width of their own (`contain: inline-size`), a TextureRect only its `custom_minimum_size` (`contain: size`).
- **Known limits:** a node with a `custom_minimum_size` in an expanding track may get less than its content when space
  is short (Godot would keep the larger of the two); Godot's LineEdit minimum of four characters is not drawn (give it a
  width or let a container fill it); icons draw in the text colour of their context.

## The page contract (the fit tool codes against it)

1. `<html>` carries `lang`, `data-lang` (`uk`, `en`) and `data-text-size` (`default`, `large`); the page switches both,
   Ukrainian and default first. Large text is the tokens' textSize modifier.
2. Every state is one frame, `<div class="sc-frame" data-screen="s2" data-state="main">`, 1920x1080 reference px
   (`calc(1920 * var(--px))`), clipping like the game window; all of the state's UI is inside it.
3. Every node is one element with `data-node="s2/Menu/Buttons/Host"`, `data-type` (the Godot class) and
   `data-variation` (the variation drawn, the selected one for a pressed toggle). The element holding a text carries
   `data-key` and only that text (a Label is that element itself; a Button's text is a child span; an icon is a
   sibling). An anchored node is wrapped in a `.gd-anchor` box without `data-node`.
4. Measuring mode, local only: `screens.html?only=<screen>:<state>&lang=uk|en&size=default|large` renders that frame
   alone at zoom 1 at the top left with no chrome or margins; `?only=all` stacks every frame, each frame's top at a
   multiple of 1080 px, in source order. When the fonts and the layout are done, `<html>` gets `data-ready="1"`.

## The handoff

`--handoff s2` prints Markdown for the body of a prime-game issue: the source, the theme version, the world, the
states; the full node tree in the first state (types, variations with their ToyRaised base, anchors and grow, size
flags, minimum sizes, container constants, keys with their English and Ukrainian, sample values, notes); then for
every other state what is shown, hidden or changed.
