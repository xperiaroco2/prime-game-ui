# Lens 3: a design system for prime-game

Research date: 2026-10-02. Read-only. The Godot facts were checked against the 4.7.2 API dump
(`D:\prime-game\tools\out\godot-api\4.7.2\extension_api.json`, header "Godot Engine v4.7.2.stable.official") with a
small node script, and theme item names against the 4.7 class reference, because the API dump does not list theme
items (it has `Theme`'s methods and each class's properties, but no per-control colour/constant/stylebox names).
"(unconfirmed)" marks claims without a primary source I opened.

## 0. The short version

- **Format:** DTCG 2025.10 is stable since 28 October 2025: three modules, Format, Color and Resolver. Use all three.
  Dimensions in `px` only, durations in `ms`, colours as `srgb` objects with a `hex` fallback.
- **Tiers:** primitive → semantic → component. The 3 to 4 style directions are one resolver *modifier*
  (`direction: a|b|c|d`) over the same semantic names, so every wireframe can be viewed in every direction.
- **Tools:** no package now. Style Dictionary (Apache-2.0, 5.5.5) says its 2025.10 support is still a work in
  progress; Terrazzo (MIT, 2.7.1) is the best fallback. A zero-dependency node script in prime-game-ui (tokens → CSS
  variables and a resolved flat JSON) is enough for our size.
- **Godot Theme:** generate it later in prime-game with a headless GDScript script that reads the resolved JSON,
  builds a `Theme` through the real API, checks every item name against `ThemeDB.get_default_theme()` and saves with
  `ResourceSaver`. One type variation per component variant (`ButtonPrimary`, `HudPanel`), states as theme items.
- **Godot-safe CSS:** three tiers. A = what `StyleBoxFlat`, theme constants and fonts do (the default). B = needs a
  texture asset (gradients, 9-slices, SVG icons, slider knobs, check marks). C = needs a shader or code (blur, glow,
  inner shadow, multiple box shadows): forbidden in mockups. A zero-dependency lint plus an in-page checker keep
  mockups honest.
- **Reference frame:** the project sets no window size, so the base is Godot's default 1152×648 with
  `canvas_items`/`expand`. Draw mockups at 1920×1080 and move the project to that base when porting.

## 1. DTCG design tokens in 2026

**Status.** The W3C Design Tokens Community Group announced the first stable version, 2025.10, on 28 October 2025,
with reference implementations named as Style Dictionary, Tokens Studio and Terrazzo
([W3C CG announcement](https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/),
[designtokens.org](https://www.designtokens.org/)). The release has three modules: Format, Color and Resolver, and
JSON schemas are reported at `designtokens.org/schemas/2025.10/format.json` and `resolver.json`
([search result summary](https://github.com/jsxtools/dtcg-tools), unconfirmed: I did not open the schema files).
A living draft continues at designtokens.org/TR/drafts.

**Format module** ([2025.10 format](https://www.designtokens.org/tr/2025.10/format/)):
- Types: `color`, `dimension`, `fontFamily`, `fontWeight`, `duration`, `cubicBezier`, `number`, `strokeStyle`,
  `border`, `transition`, `shadow`, `gradient`, `typography`.
- `dimension` is `{ "value": 12, "unit": "px" }`, units `px` or `rem` only. `duration` is `{ "value": 150, "unit": "ms" }`
  (`ms` or `s`). `cubicBezier` is `[P1x, P1y, P2x, P2y]` with x in [0, 1]. `fontWeight` is 1 to 1000 or a named alias
  (`"bold"`). `fontFamily` is a string or an array.
- `shadow` is one object (`color`, `offsetX`, `offsetY`, `blur`, `spread`, `inset`) *or an array of them*: the format
  allows stacks that Godot cannot draw (section 4).
- `border` = `color` + `width` + `style`; `transition` = `duration` + `delay` + `timingFunction`; `typography` =
  `fontFamily`, `fontSize`, `fontWeight`, `lineHeight` (a unitless number) and, as I recall, `letterSpacing`
  (unconfirmed: the page summary did not list it).
- Groups: `$type` inherited by children, `$root` (a group's own base token), `$extends` (deep-merge another group),
  `$deprecated`, `$description`, `$extensions` (vendor data). Aliases: `"{color.palette.red.500}"`; JSON Pointer
  `$ref` reaches one property of another token. `$type` is required, directly, by inheritance or through an alias.
- Files: `.tokens` or `.tokens.json`, media type `application/design-tokens+json`.

**Color module** ([2025.10 color](https://www.designtokens.org/tr/2025.10/color/)): a colour value is
`{ "colorSpace": "srgb", "components": [0.9, 0.1, 0.1], "alpha": 1, "hex": "#e61a1a" }`. 14 colour spaces including
`srgb`, `srgb-linear`, `oklch`, `display-p3`. A bare `"#ff0000"` string is no longer a valid `$value`; `hex` is an
optional fallback. For us: `srgb` with 0..1 components maps 1:1 onto Godot's `Color(r, g, b, a)` floats, and
`oklch` is handy for *designing* a palette but must be converted before Godot (keep `hex` filled).

**Resolver module** ([2025.10 resolver](https://www.designtokens.org/tr/2025.10/resolver/)) is how modes and themes
work now: the format module itself has none. A `*.resolver.json` has `version: "2025.10"`, `sets` (token sources),
`modifiers` (each with named `contexts` mapping to token files) and `resolutionOrder`. A tool is given inputs such as
`{ "direction": "b", "textSize": "large" }` and merges the matching files. It is declared stable.

**Modes this game needs** (each a resolver modifier):
| Modifier | Contexts | Why |
|---|---|---|
| `direction` | `a`, `b`, `c`, `d` | The 3 to 4 style directions share semantic and component names, so one wireframe renders in each direction; after the choice the losers are deleted |
| `textSize` | `default`, `large` | A text-size setting (lens 6). In Godot: a second generated theme or `Window.content_scale_factor` (exists in 4.7.2) for a whole-UI scale |
| `contrast` (optional) | `default`, `high` | Stronger HUD backgrounds and outlines over bright 3D scenes |

No light/dark modifier: a game has one look per direction. Colour-blind help for the delivery circles should not be a
mode at all: the swatch always carries a symbol (section 3), and lens 6 decides the palette.

**Tiers and naming for a game.** Names are dot paths of groups; I use kebab-case segments (a name may not start with
`$` or contain `{`, `}` or `.`: unconfirmed from memory).
- *Primitive* (no meaning, per direction): `color.palette.red.500`, `color.palette.ink.900`, `space.1..10`
  (4 px steps), `radius.0..4`, `size.font.100..900`, `duration.instant|fast|base|slow`, `ease.out|back-out`.
- *Semantic* (meaning, what screens use): `color.surface.hud`, `color.surface.menu`, `color.surface.shade`,
  `color.text.primary|secondary|on-accent|hud`, `color.text.outline-hud`, `color.accent`, `color.state.danger|warn|ok`,
  game domain: `color.team.engineers`, `color.team.dissidents`, `color.life.downed|dead|invulnerable`,
  `color.voice.talking`, `color.delivery.red..white` (with `symbol.delivery.*` names), `color.body.1..10`.
- *Component* (only where a component deviates): `component.button.primary.hover.background`,
  `component.key-cap.border`, `component.player-chip.talking.ring`.

The delivery palette is *game content* (`content/tasks/delivery.tres`, designer-owned) and the body colours will be
too. The UI tokens should mirror them under `color.delivery.*` and `color.body.*`, and a prime-game test should fail
when the two copies differ, rather than making the UI repo the owner of gameplay colours.

## 2. Tools that read DTCG

| Tool | Licence | Version | 2025.10 status |
|---|---|---|---|
| [Style Dictionary](https://github.com/style-dictionary/style-dictionary) | Apache-2.0 | 5.5.5 ([npm](https://registry.npmjs.org/style-dictionary/latest)) | First-class DTCG since v4; the [DTCG page](https://styledictionary.com/info/dtcg/) says 2025.10 is not fully supported yet, "work in progress in v5". 13 runtime dependencies |
| [Terrazzo](https://github.com/terrazzoapp/terrazzo) (ex Cobalt UI) | MIT | `@terrazzo/cli` 2.7.1 ([npm](https://registry.npmjs.org/@terrazzo/cli)) | Its [docs](https://terrazzo.app/docs/) promise resolvers and other 2025.10 features "in 2.0"; 2.x is out, so probably supported now (unconfirmed). Plugins for CSS, Sass, JS/TS, Swift, Tailwind; a plugin API for custom outputs |
| Tokens Studio | not checked | n/a | A Figma plugin first; we do not buy Figma (#150), so it is out of scope. Licence and price not checked (dropped by the bounds) |

**Do we need one?** No, not now. What we need is small: read our own files, resolve `{aliases}` and the two or three
modifiers we use, check the handful of types we use, and print CSS custom properties plus one resolved flat JSON per
context. That is about 200 lines of plain node (node 20 is installed). Installing Style Dictionary or Terrazzo adds a
dependency (a stop-and-ask item) for features we will not use, and their 2025.10 support is still moving. If the
repo later wants a JSON-schema validation or many outputs, Terrazzo (MIT) is the first candidate.

## 3. Components and variants

**Godot base types** (theme item names from the 4.7 class reference; "states" are separate theme items, not CSS
pseudo-classes):
| Control | Styles (StyleBox items) | Colours and constants worth tokens |
|---|---|---|
| [Button](https://docs.godotengine.org/en/4.7/classes/class_button.html) | `normal`, `hover`, `pressed`, `hover_pressed`, `disabled`, `focus` (+ `*_mirrored` for RTL, unused by us) | `font_color`, `font_hover_color`, `font_pressed_color`, `font_hover_pressed_color`, `font_focus_color`, `font_disabled_color`, `font_outline_color`, `icon_*_color`; `h_separation`, `outline_size`, `icon_max_width`, `line_spacing`, `align_to_largest_stylebox` |
| [Label](https://docs.godotengine.org/en/4.7/classes/class_label.html) | `normal`, `focus` | `font_color`, `font_outline_color`, `font_shadow_color`; `outline_size`, `shadow_offset_x/y`, `shadow_outline_size`, `line_spacing`, `paragraph_spacing` |
| [LineEdit](https://docs.godotengine.org/en/4.7/classes/class_lineedit.html) | `normal`, `focus`, `read_only` | `font_color`, `font_placeholder_color`, `caret_color`, `selection_color`, `font_uneditable_color`; icon `clear` |
| [CheckBox](https://docs.godotengine.org/en/4.7/classes/class_checkbox.html) | Button's | icons `checked`, `unchecked`, `*_disabled`, `radio_*` are **Texture2D** (tier B) |
| [HSlider](https://docs.godotengine.org/en/4.7/classes/class_slider.html) | `slider` (track), `grabber_area`, `grabber_area_highlight` | icons `grabber`, `grabber_highlight`, `grabber_disabled`, `tick` (tier B); `center_grabber`, `grabber_offset` |
| [ProgressBar](https://docs.godotengine.org/en/4.7/classes/class_progressbar.html) | `background`, `fill` | `font_color`; `fill_mode` (begin→end etc.) |
| [TabContainer](https://docs.godotengine.org/en/4.7/classes/class_tabcontainer.html) | `panel`, `tabbar_background`, `tab_selected`, `tab_hovered`, `tab_unselected`, `tab_disabled`, `tab_focus` | `font_selected_color`, `font_hovered_color`, `font_unselected_color`, `font_disabled_color`; `tab_separation`, `side_margin` |
| Panel / PanelContainer | `panel` | the surfaces |
| Tooltip | `TooltipPanel` `panel`, `TooltipLabel` colours ([Control docs, stable](https://docs.godotengine.org/en/stable/classes/class_control.html)); `_make_custom_tooltip` is a virtual in the 4.7.2 dump | |
| CheckButton, OptionButton (+ PopupMenu), ItemList, ScrollBar, AcceptDialog | inherit Button's or have their own lists | names not checked in 4.7 docs (gap) |

Also confirmed present in the 4.7.2 dump: `TextureProgressBar` with `FILL_CLOCKWISE` / `FILL_COUNTER_CLOCKWISE`
(radial rings: "hold G 1 s", respawn ring), `NinePatchRect`, `FoldableContainer`, `AspectRatioContainer`,
`HFlowContainer`, `DPITexture` ("an automatically scalable Texture2D based on an SVG image", re-rasterized for the
`canvas_items` stretch), `Control.offset_transform_*` (a visual-only transform for juice that does not move the
click area) and `Control.accessibility_name` / `accessibility_description`.

**Button variants:** `primary`, `secondary`, `ghost` (flat), `danger` (Leave, Quit), `tab` (exists as `EscTab`),
`icon`. Size variants only where needed (`large` for the main menu). States: all six above; `hover_pressed` matters
for toggles (Ready).

**Surfaces (Panel/PanelContainer variants):** `hud` (translucent over 3D; exists as `HudPanel`), `life` (exists),
`task` (exists), `menu`/`modal`, `card` (role card), `shade` (exists as `EscShade`), `backdrop` (black end screen,
loading).

**Text styles (Label variants):** `display` (end title, countdown, role headline), `title`, `body`, `caption`,
`hud` (outlined for any 3D background), `key-glyph`, `mono-number` (timers: tabular figures via
`FontVariation.opentype_features`).

**Game components** (each = a small Godot node composition + type variations):
| Component | Variants / states | Godot composition and notes |
|---|---|---|
| Key prompt | tap, hold (with radial fill), disabled; keys E Q X G F Tab Esc, LMB/RMB | `PanelContainer` (`KeyCap`) + `Label`; hold ring = `TextureProgressBar` clockwise (tier B ring texture); mouse glyphs are icons |
| Player chip | lobby: ready / not ready, host badge; in round: talking, muted, downed, dead/spectating | colour dot + name + talking ring. Never shows a role. The dot colour comes from data at runtime (`self_modulate` of a white stylebox or `ColorRect.color`), which today's "no `Color(...)` in screen code" rule must explicitly allow |
| Item slot | left hand, right hand, belt; empty, filled, active hand, package (shows its circle swatch) | `PanelContainer` + icon `TextureRect` (tier B icons) |
| Task row | in progress, done; shared progress | `Label` + `ProgressBar` (`TaskProgress` variation) |
| Swatch with symbol | S (HUD), M (task screen), L (marker); 10 colours | a filled rounded box + a per-colour symbol icon, always shown (colour-blind safe, and open knowledge) |
| Destination marker | on screen, off screen edge arrow, through walls | swatch L + distance; clamped to the screen edge |
| Countdown | lobby 5..1, respawn 30 s, round timer, invulnerability | `display` / `mono-number` text, optional ring |
| Life banner | downed (bleed-out bar, "hold G"), dead/spectating "Spectating <name>", invulnerable | `LifePanel` + `LifeBar` exist; spectate shows no target health or role |
| Role card (#175) | engineers, dissidents (+ own teammates' chips) | `card` surface, team colour, a one-line task |
| Toast | info, success, warning | short-lived `PanelContainer`; only public or own events |
| Settings row | label + control (slider, toggle, option) | for the host's lobby settings in the Esc menu |
| Confirm dialog | Leave, Quit | `danger` button |

The debug overlay stays outside the design system (dev only, monospace, no tokens).

## 4. The Godot-safe CSS subset

What exists in 4.7.2 (checked in the dump):
- `StyleBox`: `content_margin_left/top/right/bottom`.
- `StyleBoxFlat`: `bg_color`, `draw_center`, `skew` (Vector2), `border_width_left/top/right/bottom`, **one**
  `border_color`, `border_blend`, `corner_radius_top_left/top_right/bottom_right/bottom_left` (int), `corner_detail`,
  `expand_margin_*`, **one** shadow (`shadow_color`, `shadow_size` int, `shadow_offset`), `anti_aliasing`,
  `anti_aliasing_size`. No gradient, no inner shadow, no shadow spread, no per-side border colours.
- `StyleBoxTexture`: `texture`, `texture_margin_*` (9-slice), `expand_margin_*`, `axis_stretch_*`
  (stretch/tile/tile-fit), `region_rect`, `modulate_color`, `draw_center`.
- `StyleBoxLine`: `color`, `thickness`, `grow_begin`, `grow_end`, `vertical`. `StyleBoxEmpty`: nothing.
- `LabelSettings`: `font`, `font_size`, `font_color`, `line_spacing`, `paragraph_spacing`, one `outline_*`, one
  `shadow_*` and **stacked outlines and stacked shadows** (`stacked_outline_count`, `add_stacked_outline`,
  `set_stacked_outline_size/color`, `stacked_shadow_count`, `set_stacked_shadow_offset/color/outline_size`). The dump
  says a Label's `label_settings` "takes priority over theme properties"; it is a resource, not a theme item, and it
  exists on `Label` only.
- `FontVariation`: `base_font`, `variation_opentype` (variable-font axes such as weight), `variation_embolden` (fake
  bold), `variation_transform` (fake italic), `opentype_features`, `spacing_glyph`, `spacing_space`, `spacing_top`,
  `spacing_bottom`, `baseline_offset`. `FontFile` has `multichannel_signed_distance_field` and `oversampling`.
  `SystemFont` exists but a shipped game should not depend on the player's fonts.
- `GradientTexture2D` with `FILL_LINEAR`, `FILL_RADIAL`, `FILL_SQUARE`, `FILL_CONIC`; `Gradient` interpolates in sRGB,
  linear sRGB or OKLab.
- `Theme`: `default_font`, `default_font_size`, `default_base_scale`, `set_type_variation`, `get_*_list`.
- `CanvasItem`: `modulate`, `self_modulate`, `clip_children`, `material`; `Control`: `clip_contents`, `rotation`,
  `scale`, `pivot_offset`, `pivot_offset_ratio`, `mouse_default_cursor_shape`.

**Tier A, allowed in mockups (maps to theme data):**
| CSS | Godot 4.7.2 |
|---|---|
| `background-color` (solid, rgba) | `StyleBoxFlat.bg_color` |
| `border-width` per side, one `border-color`, `border-style: solid` | `border_width_*`, `border_color` |
| `border-radius` per corner in px | `corner_radius_*` (int) |
| `box-shadow: X Y B 0 color` (one, outer, no spread) | `shadow_offset`, `shadow_size` ≈ B, `shadow_color` (the fall-off differs from CSS's Gaussian blur: compare in the showcase, unconfirmed) |
| hard offset "sticker" shadow (`4px 4px 0`) | write it as a thicker right/bottom border in the mockup; `shadow_size = 0` likely draws nothing (unconfirmed) |
| `padding` | `content_margin_*` or `MarginContainer` `margin_*` constants (both in use today) |
| `gap` in flex row/column | `BoxContainer` `separation` (in use); grids: `GridContainer` (`h_separation`, `v_separation`, unconfirmed names) |
| `transform: skewX()` on a box | `StyleBoxFlat.skew` (the box only; text stays straight, so do not skew text in mockups) |
| `opacity` | `modulate.a` / `self_modulate.a` |
| `color`, `font-size` (px), `font-family` | `font_color`, `font_size` (int), a `Font` resource per family |
| `font-weight` | a separate font file, `FontVariation.variation_opentype` (variable font) or `variation_embolden` |
| `letter-spacing`, `word-spacing` (px) | `FontVariation.spacing_glyph`, `spacing_space` (int) |
| `line-height` | `line_spacing` constant = *extra* px, not a multiplier (convert; approximate) |
| `font-variant-numeric: tabular-nums` | `FontVariation.opentype_features` (`tnum`) |
| `-webkit-text-stroke` / one text outline | `outline_size` + `font_outline_color` (Label, Button, ProgressBar, LineEdit) |
| `text-shadow` (one) | Label only: `font_shadow_color`, `shadow_offset_x/y`, `shadow_outline_size`; Button has no shadow item |
| stacked outlines / several text shadows | Label + `LabelSettings` stacked outlines/shadows (generated resource) |
| `text-transform: uppercase` | `Label.uppercase`; Button has no such property: write the text in capitals |
| `text-overflow: ellipsis`, wrapping, `text-align` | `text_overrun_behavior`, `autowrap_mode`, `horizontal_alignment` |
| `overflow: hidden` (rectangular) | `Control.clip_contents` |
| `:hover :active :disabled :focus-visible :checked` | Button's six styles; toggles use `pressed`/`hover_pressed`; only controls that have the state in Godot may have it in the mockup (a Panel has no hover) |
| `cursor` | `mouse_default_cursor_shape` |
| `transition`/simple `@keyframes` (fade, slide, scale, pop) | a `Tween` in code: duration + `TransitionType` (linear, sine, quad, cubic, quart, quint, expo, circ, back, elastic, bounce, spring) + `EaseType` |

**Tier B, allowed only with a licensed asset and a "B" mark in the mockup:**
`linear-gradient`/`radial-gradient`/`conic-gradient` → `StyleBoxTexture` with `GradientTexture2D` (lose rounded
corners and borders unless baked into a texture); `border-image`/stickers/torn paper → `StyleBoxTexture` 9-slice or
`NinePatchRect`; check marks, slider knobs, switch thumbs, key glyph art, item and symbol icons → SVG imported as
textures (`DPITexture` for crisp scaling); radial progress → `TextureProgressBar`; masks with a shape →
`clip_children` with a mask texture.

**Tier C, forbidden in mockups (each needs a shader, code or an engine request):**
`backdrop-filter: blur()` (frosted glass: screen-texture shader, costs a pass over the 3D view), `filter: blur()`,
`drop-shadow()`, `brightness()`/`grayscale()`; `inset` box shadows; several box shadows on one box; `spread`;
per-side border colours; dashed/dotted/double borders; elliptical or percentage radii; `clip-path` polygons;
`mix-blend-mode` beyond what `CanvasItemMaterial` blend modes offer; text with gradient fill; `rem`/`em`/`vw`/`%`
sizes inside components (Godot is px at the base resolution); CSS grid areas and `auto-fit`; animated gradients;
`position: sticky`; variable-font axis animation.

## 5. Generating the Godot Theme from tokens (later, in prime-game)

Grounding: `client/ui/theme/game_theme.tres` is a format-3 `Theme` of about 30 type variations (`HudPanel`,
`HudText`, `EscTab`, `LifeBar`, `TaskPanel`, ...) with eight `StyleBoxFlat` sub-resources, no fonts, font sizes 15 to
40; `client/CLAUDE.md` forbids `add_theme_*_override`, `Color(...)` and font sizes in screen code (a source test holds
it). `project.godot`'s `[display]` sets only `window/stretch/mode="canvas_items"` and `aspect="expand"`, so the base
is the default 1152×648 ([ProjectSettings 4.7](https://docs.godotengine.org/en/4.7/classes/class_projectsettings.html)).
The [multiple-resolutions page](https://docs.godotengine.org/en/4.7/tutorials/rendering/multiple_resolutions.html)
suggests 1920×1080 as the base for a desktop game that is not pixel art.

**Options:**
1. **Headless GDScript generator (recommended).** `tools/theme/build_theme.gd`, run by the runner with `--headless`
   (later a `theme` command). It reads `client/ui/theme/tokens.resolved.json` (the flat file prime-game-ui builds)
   and a mapping table (component token → base type, variation name, item), builds a `Theme` with `set_stylebox`,
   `set_color`, `set_constant`, `set_font_size`, `set_type_variation`, writes `LabelSettings` resources for display
   text, and saves with `ResourceSaver.save`. Why: every property goes through the real 4.7.2 API, so a typo fails
   loudly; theme item names can be checked against `ThemeDB.get_default_theme().get_color_list("Button")` and friends
   (the dump has no list of them); and the file comes out exactly as the editor writes it, so `normalize` has nothing
   to change. A GdUnit test rebuilds the theme in memory and fails when the committed file is stale (like `credits`).
   Whether `ResourceSaver.save` keeps the existing `uid://` of the file is unconfirmed: verify in the issue.
2. Python in the runner writing the `.tres` text: no engine start and matches the runner's language, but item and
   property names are unchecked until `check`/`normalize`, and it duplicates Godot's serializer.
3. [ThemeGen](https://github.com/Inspiaaa/ThemeGen) (MIT): an addon where you write the theme as GDScript; good, but
   it is a new addon (stop-and-ask) and its source of truth is GDScript, not our tokens.
   [GodotThemeGenerator](https://github.com/elasrlambert/GodotThemeGenerator) (MIT, 3 commits, preset palettes) is
   too young.
4. A hand-made theme in the editor: drifts from the tokens and costs human time. No.

**Variants ↔ type variations.** One variation per component variant, PascalCase `<Component><Variant>` like the
existing names (`ButtonPrimary`, `ButtonDanger`, `PanelHud`... or keep `HudPanel`). States are the items inside the
variation (`ButtonPrimary/styles/hover`), not separate variations. Variations may extend variations
([type variations 4.7](https://docs.godotengine.org/en/4.7/tutorials/ui/gui_theme_type_variations.html)), so a size
variant can extend its colour variant; keep the matrix small. The mapping table belongs to the engineer (engine
knowledge); the tokens stay engine-neutral (the designer's).

**Fonts and motion in the mapping.** DTCG `fontFamily` is a name; the mapping turns it into a `res://` font file and
`FontVariation`s for weights. `Tween` has no cubic-bezier easing (its methods and enums in the dump list only
`set_trans`/`set_ease` and Penner-style transitions), so motion tokens should name a Godot pair in `$extensions`
(for example `trans: back, ease: out`) and carry a CSS `cubicBezier` approximation for the mockups.

**Keeping HTML and Godot in sync.** Both sides get a *showcase*: `showcase.html` in prime-game-ui (every component ×
variant × state on a 1920×1080 stage) and `client/dev/theme_showcase.tscn` in prime-game, built from the same list.
`tools\run.cmd shot` renders the Godot one off-screen to a PNG; a comparison page in prime-game-ui shows the two side
by side per component. Hover cannot be forced on a real Button, so the Godot showcase draws non-interactive states
with `draw_style_box(get_theme_stylebox("hover", "ButtonPrimary"), rect)` (dev scene only). Test frames: 1920×1080,
about 2560×1080 (21:9 with `expand`) and 1920×1200 (16:10).

## 6. A lint for the safe subset

Two zero-dependency parts in prime-game-ui:
1. `tools/lint-css.mjs` (node, run in CI and before commits). Authoring rules make parsing trivial: no nesting, one
   declaration per line. It checks a **property allowlist** per tier, **value patterns** (one `box-shadow`, no
   `inset`, spread 0; `border-style: solid`; px-only lengths in components; no `gradient(` outside files marked
   tier B; no `filter`, `backdrop-filter`, `clip-path`, `mix-blend-mode`), and **token-only values**: colours and
   sizes in component CSS must be `var(--…)` from the generated `tokens.css`, except `0` and `1px`. Output `file:line`.
2. `safe-check.js`, included in every mockup page: walks `document.styleSheets` and `[style]` attributes through the
   browser's own CSS parser and outlines offending elements in red with the rule's name, so the human sees violations
   on the phone too. A `?tier=b` query shows tier-B elements with a dashed outline.

Off-the-shelf alternative: stylelint's [`property-allowed-list`](https://stylelint.io/user-guide/rules/property-allowed-list/)
and [`declaration-property-value-allowed-list`](https://stylelint.io/user-guide/rules/declaration-property-value-allowed-list/)
do the same, but need an npm install (a dependency, so ask first).

A token check in the same build: every token resolves, no cycles, every type is in our supported set, every
`color.text.*` on its intended `color.surface.*` meets the contrast target that lens 6 sets.

## 7. Suggested file layout for prime-game-ui

```
tokens/primitives.tokens.json        tokens/directions/{a,b,c,d}.tokens.json
tokens/text-size/{default,large}.tokens.json   tokens/components.tokens.json
tokens/prime.resolver.json           (modifiers: direction, textSize)
tools/build-tokens.mjs  -> dist/tokens.css ([data-direction] blocks) + dist/tokens.<ctx>.resolved.json
tools/lint-css.mjs      web/safe-check.js
components/*.css        showcase.html     screens/*.html (wireframes, then styled)
docs/godot-safe-css.md  docs/components.md (inventory, variants, Godot mapping, privacy notes)
```

## Sources

- W3C CG announcement, 2025-10-28: https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/
- designtokens.org: https://www.designtokens.org/
- Format 2025.10: https://www.designtokens.org/tr/2025.10/format/
- Color 2025.10: https://www.designtokens.org/tr/2025.10/color/
- Resolver 2025.10: https://www.designtokens.org/tr/2025.10/resolver/
- dtcg-tools (schema URLs, search summary): https://github.com/jsxtools/dtcg-tools
- Style Dictionary repo and DTCG page: https://github.com/style-dictionary/style-dictionary , https://styledictionary.com/info/dtcg/
- Style Dictionary npm metadata: https://registry.npmjs.org/style-dictionary/latest
- Terrazzo repo, docs, npm: https://github.com/terrazzoapp/terrazzo , https://terrazzo.app/docs/ , https://registry.npmjs.org/@terrazzo/cli
- Godot 4.7 Button: https://docs.godotengine.org/en/4.7/classes/class_button.html
- Godot 4.7 Label: https://docs.godotengine.org/en/4.7/classes/class_label.html
- Godot 4.7 LineEdit: https://docs.godotengine.org/en/4.7/classes/class_lineedit.html
- Godot 4.7 CheckBox: https://docs.godotengine.org/en/4.7/classes/class_checkbox.html
- Godot 4.7 Slider: https://docs.godotengine.org/en/4.7/classes/class_slider.html
- Godot 4.7 ProgressBar: https://docs.godotengine.org/en/4.7/classes/class_progressbar.html
- Godot 4.7 TabContainer: https://docs.godotengine.org/en/4.7/classes/class_tabcontainer.html
- Godot 4.7 StyleBoxFlat: https://docs.godotengine.org/en/4.7/classes/class_styleboxflat.html
- Godot 4.7 ProjectSettings: https://docs.godotengine.org/en/4.7/classes/class_projectsettings.html
- Godot 4.7 multiple resolutions: https://docs.godotengine.org/en/4.7/tutorials/rendering/multiple_resolutions.html
- Godot 4.7 theme type variations: https://docs.godotengine.org/en/4.7/tutorials/ui/gui_theme_type_variations.html
- Godot Control (stable, tooltips): https://docs.godotengine.org/en/stable/classes/class_control.html
- ThemeGen: https://github.com/Inspiaaa/ThemeGen
- GodotThemeGenerator: https://github.com/elasrlambert/GodotThemeGenerator
- stylelint rules: https://stylelint.io/user-guide/rules/property-allowed-list/ , https://stylelint.io/user-guide/rules/declaration-property-value-allowed-list/
- Local: D:\prime-game\tools\out\godot-api\4.7.2\extension_api.json, D:\prime-game\client\ui\theme\game_theme.tres, D:\prime-game\client\CLAUDE.md, D:\prime-game\project.godot
