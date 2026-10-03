# Godot 4.7.2 facts for the Toy tokens and the Theme generator

Research for [prime-game-ui#5](https://github.com/xperiaroco2/prime-game-ui/issues/5) (DTCG tokens and components for the
chosen style "Toy", [`docs/ui-decisions.md`](../../ui-decisions.md)). It answers what Godot 4.7.2 can draw for the Toy
skin ([`pages/styles/toy.css`](../../../pages/styles/toy.css), the press preview
[`pages/styles/motion-preview.css`](../../../pages/styles/motion-preview.css), the lint
[`pages/styles/check_styles.js`](../../../pages/styles/check_styles.js)) and what a Theme generator in prime-game must do.

**Sources, in the order used.**
1. The API dump `D:\prime-game\tools\out\godot-api\4.7.2\extension_api.json` (header: "Godot Engine
   v4.7.2.stable.official", precision single), queried with a throwaway node script. The dump lists classes, properties,
   enums and methods; it has **no theme items** (the string `align_to_largest_stylebox` occurs 0 times in it).
2. The engine source as text at tag `4.7.2-stable` (commit `ed1daf0bf001b61586d9930840f2f1394092c079`, from
   `gh api repos/godotengine/godot/git/refs/tags/4.7.2-stable`). Links below are
   `https://github.com/godotengine/godot/blob/4.7.2-stable/<file>#L<a>-L<b>`. The class reference XML at the same tag
   (`doc/classes/*.xml`) and the rendered 4.7 class reference on docs.godotengine.org.
3. The game repo, read only, at `main` = `83a2c2fff9db752c9dd8e3cca7199e581dfd4a79`.
4. For the CSS side: the CSS specs' source text in `w3c/csswg-drafts` at commit
   `dddf78d1aec8935ae6fdb836e38459142e58dc59`, and the CSS Easing TR page.

Godot was not run. Every engine behaviour below comes from reading the source at the tag; numbers marked "computed" come
from node scripts that re-implement the engine's formulas (same constants), not from Godot.

## Summary: what the tokens and the generator must know

1. **Reference resolution.** The mock-ups are drawn at 1920×1080 ([wireframes.html L55-L57](../../../pages/wireframes/wireframes.html#L55-L57)),
   but the game sets no viewport size, so Godot's default base of **1152×648** applies
   ([project_settings.cpp L1719-L1720](https://github.com/godotengine/godot/blob/4.7.2-stable/core/config/project_settings.cpp#L1719-L1720);
   [project.godot L25-L28](https://github.com/xperiaroco2/prime-game/blob/83a2c2fff9db752c9dd8e3cca7199e581dfd4a79/project.godot#L25-L28)).
   One mock-up px is therefore 0.6 Godot px today, and border widths, radii, shadow sizes and font sizes are **ints** in
   Godot. Either the game moves its base to 1920×1080 (a prime-game issue; it also changes the start window size, see
   §8) or every token is scaled by 0.6 and rounded.
2. **The toy base** (`box-shadow: 0 5px 0 <base>`) maps to `shadow_color = base`, `shadow_offset = (0, 5)`,
   **`shadow_size = 1`**: a shadow is drawn only when `shadow_size > 0`, and `shadow_size` is both grow and a linear
   fade, so the base gets a 1 px soft outer edge. Where the base colour equals the border colour (every button on a
   cream panel: base = ink = border) an exact hard base is `expand_margin_bottom = 5` plus a bottom border of 3 + 5 px.
3. **Content margins count from the outer edge**: a Toy `padding: 9px 19px` inside a 3 px border is
   `content_margin_top/bottom = 12`, `left/right = 22`. Left at −1, a StyleBoxFlat's content margin is its border width.
4. **Press motion without overrides**: either an instant state swap in the theme (hover and pressed StyleBoxes shift the
   face with expand margins and the label with content margins, sums kept equal) or a Tween of the 4.7
   `Control.offset_transform_position`, which is visual-only by default and so moves neither the layout nor the hit
   area. Tweening a duplicated StyleBox needs `add_theme_stylebox_override`, which the game's rule forbids.
5. **Health colour**: `Color.lerp` mixes the stored sRGB components and does **not** match the mock-up's
   `color-mix(in oklab, …)` (computed: #AD9349 against #C59E49 at half health). A `Gradient` with
   `interpolation_color_space = GRADIENT_COLOR_SPACE_OKLAB` does match.
6. **ProgressBar fill**: the fill StyleBox is drawn over the full bar height and width, borders included. To sit inside
   a 3 px track outline and keep the CSS fraction exact, the fill needs `expand_margin_* = -3` and
   `content_margin_left/right = 3`.
7. **Text**: Label draws one hard, unblurred text shadow from theme items (`font_shadow_color`, `shadow_offset_x/y`,
   `shadow_outline_size`, which must be set to 0 since the default is 1). Button has an outline but **no text shadow**.
   `letter-spacing` of ±0.01em cannot be drawn (`FontVariation.spacing_glyph` is an int px).
8. **Generator**: theme type variation names must be letters only (the game's test regex is `&"([A-Za-z]+)"`), may
   chain (a variation of a variation), and must not be a built-in class name. A headless non-editor `ResourceSaver.save`
   writes **no uid** into the `.tres` header: restore `uid://c8behqt7jtcn8` with `ResourceSaver.set_uid` afterwards.
9. **Textures, not StyleBoxes**: CheckBox and CheckButton marks, the HSlider grabber, SpinBox arrows and OptionButton's
   arrow are `Texture2D` icons, so these need own-work SVG icons, or the Toy design uses toggle Buttons instead.
10. **Focus** is missing from the Toy CSS. Godot draws the `focus` StyleBox *over* the state StyleBox at the control
    rect; mouse clicks hide it by default, so it appears only for keyboard or gamepad focus.

## 0. The game today (read only)

**Stretch and rendering** ([project.godot L11-L28](https://github.com/xperiaroco2/prime-game/blob/83a2c2fff9db752c9dd8e3cca7199e581dfd4a79/project.godot#L11-L28)):
`window/stretch/mode="canvas_items"`, `window/stretch/aspect="expand"`, features `"4.7", "Forward Plus"`. Not set, so
at their defaults: `display/window/size/viewport_width` 1152 and `viewport_height` 648, `display/window/stretch/scale`
1.0, `scale_mode` "fractional"
([project_settings.cpp L1719-L1720, L1787-L1790](https://github.com/godotengine/godot/blob/4.7.2-stable/core/config/project_settings.cpp#L1719-L1790)),
`rendering/viewport/hdr_2d` false
([ProjectSettings.xml L3511-L3515](https://github.com/godotengine/godot/blob/4.7.2-stable/doc/classes/ProjectSettings.xml#L3511-L3515)),
and no `gui/theme/custom` (no project theme).

**The theme** ([game_theme.tres](https://github.com/xperiaroco2/prime-game/blob/83a2c2fff9db752c9dd8e3cca7199e581dfd4a79/client/ui/theme/game_theme.tres),
uid `uid://c8behqt7jtcn8`, hand-written, 29 type variations, no default font, no item on a base type). Nothing outside
the file names its uid (a grep of `*.gd`, `*.tscn`, `*.tres` and `*.godot` outside `.claude/` and `.godot/` finds only the
file itself); [`game_ui.gd` L13](https://github.com/xperiaroco2/prime-game/blob/83a2c2fff9db752c9dd8e3cca7199e581dfd4a79/client/ui/game_ui.gd#L13)
preloads it by path.

| Variation | Base type | What it sets |
|---|---|---|
| DebugMargin | MarginContainer | margins 8 |
| DebugText | Label | font_size 16 |
| EndBackdrop | Panel | panel: black |
| EndColumn | VBoxContainer | separation 24 |
| EndTitle | Label | font_size 40 |
| EscBody | HBoxContainer | separation 16 |
| EscPage | VBoxContainer | separation 10 |
| EscShade | Panel | panel: black at 0.5 |
| EscTab | Button | font_size 20 (toggle buttons: the Esc menu's tabs) |
| EscTabs | VBoxContainer | separation 6 |
| HudCrosshair | Label | font_size 24 |
| HudHint | Label | font_size 18 |
| HudMargin | MarginContainer | margins 16 |
| HudPanel | PanelContainer | panel: dark 0.6, radius 4, content 12/8 |
| HudText | Label | font_size 18 |
| HudTitle | Label | font_size 24 |
| LifeBar | ProgressBar | background (content 160/7 sets the size), fill |
| LifeMargin | MarginContainer | margin_bottom 96 |
| LifePanel | PanelContainer | panel: dark 0.72, radius 6, content 18/12 |
| LifeText | Label | font_size 18 |
| LifeTitle | Label | font_size 26 |
| LoadingBackdrop | Panel | panel: near black |
| PanelMargin | MarginContainer | margins 18 |
| ScreenColumn | VBoxContainer | separation 10 |
| Shortfalls | Label | font_color amber |
| TaskDescription | Label | font_color grey, font_size 15 |
| TaskPanel | PanelContainer | panel: dark 0.85, radius 6, content 24/18 |
| TaskRow | Label | font_size 20 |
| Title | Label | font_size 28 |

Controls built **without** a variation therefore get the engine's default look and need base-type items in the Toy
theme: `UiParts.button()`'s Button, `centered_column()`'s PanelContainer, `labelled()`'s Label
([ui_parts.gd](https://github.com/xperiaroco2/prime-game/blob/83a2c2fff9db752c9dd8e3cca7199e581dfd4a79/client/ui/ui_parts.gd#L10-L62)),
the LineEdit and SpinBox of the main menu, the SpinBox and CheckBox of the lobby panel, the Esc menu's ScrollContainer
and VSeparator, and the HUD's ColorRect swatch (its colour comes from the model).

**The rules screens follow.**
- [client/CLAUDE.md](https://github.com/xperiaroco2/prime-game/blob/83a2c2fff9db752c9dd8e3cca7199e581dfd4a79/client/CLAUDE.md)
  (Rules): "Screens are styled only through the shared theme (`GameUi.THEME`, `client/ui/theme/game_theme.tres`): a
  type variation per look, no `add_theme_*_override`, `Color(...)` or font size in a screen's code; a source test holds
  it."
- [theme_test.gd L13-L15](https://github.com/xperiaroco2/prime-game/blob/83a2c2fff9db752c9dd8e3cca7199e581dfd4a79/tests/unit/client/ui/theme_test.gd#L13-L15)
  forbids `\badd_theme_\w+_override\b`, `\bColor\s*\(` and `\bColor\s*\.\s*[A-Z_]+\b` (named colours), and the word
  `font_size`, after comments and strings are stripped. The scan covers every script under `client/ui/` **except
  `client/ui/theme/`** ([L98-L108](https://github.com/xperiaroco2/prime-game/blob/83a2c2fff9db752c9dd8e3cca7199e581dfd4a79/tests/unit/client/ui/theme_test.gd#L98-L108)).
- [L70-L82](https://github.com/xperiaroco2/prime-game/blob/83a2c2fff9db752c9dd8e3cca7199e581dfd4a79/tests/unit/client/ui/theme_test.gd#L70-L82):
  every `&"Name"` on a line that mentions `theme_type_variation`, `styled_label` or `backdrop` must be a type variation of
  `GameUi.THEME` (`get_type_variation_base` not empty). Only `[A-Za-z]+` names are seen by that regex.
- [L49-L67](https://github.com/xperiaroco2/prime-game/blob/83a2c2fff9db752c9dd8e3cca7199e581dfd4a79/tests/unit/client/ui/theme_test.gd#L49-L67):
  `GameUi` gives the theme to every Control child, also one added later, unless the child brought its own theme
  ([game_ui.gd L120-L124](https://github.com/xperiaroco2/prime-game/blob/83a2c2fff9db752c9dd8e3cca7199e581dfd4a79/client/ui/game_ui.gd#L120-L124)).

## 1. StyleBoxFlat drawing and the toy base

### 1.1 No shadow when `shadow_size` is 0

[style_box_flat.cpp L459-L464](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/resources/style_box_flat.cpp#L459-L464):

```cpp
bool draw_border = (border_width[0] > 0) || ...;
bool draw_shadow = (shadow_size > 0);
if (!draw_border && !draw_center && !draw_shadow) {
    return;
}
```

`shadow_offset` alone draws nothing. The setter does not clamp (`set_shadow_size`,
[L194-L197](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/resources/style_box_flat.cpp#L194-L197)), so a
negative size also draws nothing. `get_draw_rect` adds the shadow only under the same condition
([L447-L457](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/resources/style_box_flat.cpp#L447-L457)).

### 1.2 Shape and feather: `shadow_size` is grow and a linear fade at once

[L527-L544](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/resources/style_box_flat.cpp#L527-L544):

```cpp
if (draw_shadow) {
    Rect2 shadow_inner_rect = style_rect;
    shadow_inner_rect.position += shadow_offset;
    Rect2 shadow_rect = style_rect.grow(shadow_size);
    shadow_rect.position += shadow_offset;
    Color shadow_color_transparent = Color(shadow_color.r, shadow_color.g, shadow_color.b, 0);
    draw_rounded_rectangle(verts, indices, colors, shadow_inner_rect, adapted_corner,
            shadow_rect, shadow_inner_rect, shadow_color, shadow_color_transparent, corner_detail, skew);
    if (draw_center) {
        draw_rounded_rectangle(verts, indices, colors, shadow_inner_rect, adapted_corner,
                shadow_inner_rect, shadow_inner_rect, shadow_color, shadow_color, corner_detail, skew, true);
    }
}
```

- The shadow is the box's own shape (`style_rect`, which already includes the expand margins, with the same adapted
  corner radii and skew), moved by `shadow_offset` and filled with `shadow_color`.
- Around it, a ring `shadow_size` px wide fades **linearly** from `shadow_color` at the shape's edge to alpha 0 at
  `shadow_size` px outside it. The ring's outer corner radius is the radius plus `shadow_size` (the radius helper
  subtracts the ring width, which is negative here,
  [L231-L241](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/resources/style_box_flat.cpp#L231-L241)).
  So `shadow_size` grows the shadow and feathers it in one go, with no Gaussian blur and no separate spread. At
  `shadow_size = 1` the shadow's 50 % edge sits 0.5 px outside the CSS shadow's edge.
- With `draw_center = false` only the ring is drawn: a hollow shadow.
- The shadow is filled **under the whole box** too. CSS clips an outer box-shadow inside the border box ("The shadow is
  drawn outside the border edge only: it is clipped inside the border-box of the element",
  [css-backgrounds-3 Overview.bs L3487-L3495](https://github.com/w3c/csswg-drafts/blob/dddf78d1aec8935ae6fdb836e38459142e58dc59/css-backgrounds-3/Overview.bs#L3487-L3495)).
  This only shows when the box's fill is translucent. Every Toy element with a box-shadow has an opaque fill (`.btn`,
  `.btn.fill`, `.tabs > div.on`, `.card`, `.t96`, `.panel`, `.map`), so nothing changes today.
- `anti_aliasing` does not touch the shadow: `aa_on` is only used for the border and the fill, and only when a corner is
  rounded or the box is skewed
  ([L471-L474](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/resources/style_box_flat.cpp#L471-L474),
  [L546-L633](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/resources/style_box_flat.cpp#L546-L633)).
  The box's own AA width is divided by the canvas oversampling
  ([L500-L512](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/resources/style_box_flat.cpp#L500-L512)),
  but the shadow ring is not, so under `canvas_items` upscaling the shadow's 1 px fade becomes wider in screen pixels
  than the box's anti-aliased edge (for example 1.67 physical px at a 1920-wide window over the 1152 base).

### 1.3 The closest match for the Toy base

The CSS: `.btn { border: 3px solid #2A1F33; border-radius: 18px; box-shadow: 0 5px 0 var(--toy-base) }`, with base =
honey #C98A10 on dark backgrounds and ink #2A1F33 on cream panels
([toy.css L33-L51, L126-L140](../../../pages/styles/toy.css#L33-L51)).

| Option | Result | Verdict |
|---|---|---|
| `shadow_size = 1`, `shadow_offset = (0, 5)`, `shadow_color = base`, AA on | Same outline as the CSS (same radii and width, 5 px lower), plus a 1 px linear fade outward, so a faint ≤1 px fringe of base colour shows along the sides | **Best single StyleBox, any base colour.** One StyleBox per state, no nodes, no code |
| The same with `anti_aliasing = false` | The shadow is unchanged (AA is not applied to it, see §1.2) and the face's rounded corners turn jagged | Worse |
| `shadow_size = 0` | No shadow at all ([L461](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/resources/style_box_flat.cpp#L461)) | Not possible |
| `expand_margin_bottom = 5`, `border_width_bottom = 3 + 5 = 8`, `border_color = ink`, explicit content margins | Exact and hard, with no fringe, **only when the base colour equals the border colour** (one `border_color` per box, [L63-L66](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/resources/style_box_flat.cpp#L63-L66)). Union of the face and the face moved 5 px down = a rounded rect 5 px taller with the same radii; the face's inner bottom corners keep radius 18 − min(8, 3) = 15, as in CSS | **Exact for buttons on cream panels** (base = ink), the selected tab and the cards (base ink). The bottom content margin must be set explicitly, or it defaults to the 8 px border |
| A second StyleBox on the same Button | Button draws exactly one state StyleBox, then `focus` on top ([button.cpp L222-L230](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/button.cpp#L222-L230)) | Not possible |
| A child Panel with `show_behind_parent = true` and a "base" variation, moved 5 px down | Exact hard base in any colour ([canvas_item.cpp L1294-L1300](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/main/canvas_item.cpp#L1294-L1300)); one more node per button and component code | Exact for honey on dark; costs a node |
| A wrapper PanelContainer whose `panel` StyleBox is the base (`expand_margin_top = -5`, `expand_margin_bottom = 5`) with the Button inside | Exact hard base; the base stays put while the button moves (§4, option B) | Exact; needed anyway if the press is tweened |
| Drawing the base in the button script's `_draw` | The script's `_draw` runs **after** Button's native draw, so it would cover the label ([canvas_item.cpp L172-L174](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/main/canvas_item.cpp#L172-L174)) | Not usable |

**What the CSS must change to stay faithful:** nothing for the geometry. The mapping rule to record in the lint and
the tokens is: a CSS `box-shadow: 0 Npx 0 C` becomes `shadow_offset = (0, N)`, `shadow_size = 1`, `shadow_color = C`,
and Godot adds a 1 px outward fade. Two guard rules follow from §1.2 and should be linted: a box-shadow only on an opaque
fill, and never on a box without a fill (`background: transparent`). If the 1 px fringe shows in a `shot`, use the exact
border variant where base = border colour, and the wrapper or child Panel where it is honey.

## 2. StyleBoxFlat properties and types

From the dump (types) and [style_box_flat.cpp L698-L735](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/resources/style_box_flat.cpp#L698-L735)
(hints); defaults from [style_box_flat.h L38-L54](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/resources/style_box_flat.h#L38-L54)
and [StyleBox](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/resources/style_box.cpp#L130-L146).

| Property | Type | Default | Setter or draw facts |
|---|---|---|---|
| `bg_color` | Color | (0.6, 0.6, 0.6) | |
| `draw_center` | bool | true | false also hollows the shadow (§1.2) |
| `skew` | Vector2 | (0, 0) | skews the drawn box only (not the label); turns AA on even without radii |
| `border_width_left/top/right/bottom` | **int** | 0 | setter takes int ([L84-L88](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/resources/style_box_flat.cpp#L84-L88)); stored as `real_t` |
| `border_color` | Color | (0.8, 0.8, 0.8) | one colour for all four sides |
| `border_blend` | bool | false | fades the border into `bg_color` |
| `corner_radius_top_left/top_right/bottom_right/bottom_left` | **int** | 0 | setter takes int ([L104-L108](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/resources/style_box_flat.cpp#L104-L108)) |
| `corner_detail` | int | 8 | clamped to 1..20 ([L132-L135](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/resources/style_box_flat.cpp#L132-L135)); segments per corner |
| `expand_margin_left/top/right/bottom` | **float** | 0 | **no clamp** in the setter ([L141-L145](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/resources/style_box_flat.cpp#L141-L145)); drawing grows the rect by them, so negative values shrink or shift it ([L466](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/resources/style_box_flat.cpp#L466)); a zero-size result draws nothing ([L467-L469](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/resources/style_box_flat.cpp#L467-L469)); they do not change the clickable area ([StyleBoxFlat.xml L146-L149](https://github.com/godotengine/godot/blob/4.7.2-stable/doc/classes/StyleBoxFlat.xml#L146-L149)). The inspector hint is `0,100,1,or_greater`, without `or_less`; whether the inspector clamps a typed negative to 0 is (unconfirmed). The generator and `.tres` go through the setter, which keeps negatives |
| `content_margin_left/top/right/bottom` | float | **−1** | −1 means "use the style margin" ([style_box.cpp L79-L87](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/resources/style_box.cpp#L79-L87)), which for StyleBoxFlat is the border width of that side ([style_box_flat.cpp L40-L43](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/resources/style_box_flat.cpp#L40-L43)). Min size = left + right, top + bottom ([style_box.cpp L36-L49](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/resources/style_box.cpp#L36-L49)). Measured from the outer edge, so a token is border + padding |
| `shadow_color` | Color | (0, 0, 0, 0.6) | |
| `shadow_size` | **int** | 0 | 0 draws no shadow (§1.1) |
| `shadow_offset` | **Vector2** | (0, 0) | fractional px allowed |
| `anti_aliasing` | bool | true | only effective with rounded corners or skew ([L471-L474](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/resources/style_box_flat.cpp#L471-L474)) |
| `anti_aliasing_size` | float | 1.0 | clamped to 0.01..10 ([L222-L225](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/resources/style_box_flat.cpp#L222-L225)), divided by the canvas oversampling when drawn |

**Radii larger than the box.** Godot shrinks each pair of radii on a side by `min(1, side / (r_a + r_b))`, and each
corner takes the smallest result over its two sides, capped by the side minus the opposite border
([adapt_values L439-L445](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/resources/style_box_flat.cpp#L439-L445),
[L489-L494](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/resources/style_box_flat.cpp#L489-L494); the
class description calls it a relative system,
[StyleBoxFlat.xml L7-L19](https://github.com/godotengine/godot/blob/4.7.2-stable/doc/classes/StyleBoxFlat.xml#L7-L19)).
CSS multiplies **all** radii by one factor `f = min(L_i / S_i)`
([css-backgrounds-3 Overview.bs L2602-L2620](https://github.com/w3c/csswg-drafts/blob/dddf78d1aec8935ae6fdb836e38459142e58dc59/css-backgrounds-3/Overview.bs#L2602-L2620)).
With four equal radii, as on every Toy bar and pill, both give the same result. With unequal radii they can differ.
`border-radius: 999px` (the `.val .ar` steppers) becomes int 999 and turns into a pill; a percentage such as `50%` has
no Godot form and must be written as px. The tiny health fill is worked through in §6.

**Inner corners with uneven borders.** Godot's inner radius is `radius − min(the two adjacent border widths)`, a circle
([L231-L241](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/resources/style_box_flat.cpp#L231-L241)).
CSS uses "the outer border radius minus the corresponding border thickness"
([Overview.bs L2427-L2435](https://github.com/w3c/csswg-drafts/blob/dddf78d1aec8935ae6fdb836e38459142e58dc59/css-backgrounds-3/Overview.bs#L2427-L2435)),
which is elliptical when the two widths differ. So `.key` (2 2 5), `.setrow` (bottom border only) and `.ring`
(10 10 0 0) look slightly different at the corners: check them in a `shot`.

## 3. Button

### 3.1 Theme items in 4.7.2

Bound in [button.cpp L838-L875](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/button.cpp#L838-L875);
default values from [default_theme.cpp L136-L174](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/theme/default_theme.cpp#L136-L174).

| Kind | Items |
|---|---|
| StyleBox | `normal`, `normal_mirrored`, `hover`, `hover_mirrored`, `pressed`, `pressed_mirrored`, `hover_pressed`, `hover_pressed_mirrored`, `disabled`, `disabled_mirrored`, `focus` |
| Color | `font_color`, `font_focus_color`, `font_hover_color`, `font_pressed_color`, `font_hover_pressed_color`, `font_disabled_color`, `font_outline_color`, `icon_normal_color`, `icon_focus_color`, `icon_hover_color`, `icon_pressed_color`, `icon_hover_pressed_color`, `icon_disabled_color` |
| Font, font size | `font`, `font_size` (default theme: none and −1, so the theme's default and the fallback apply) |
| Constant | `outline_size` (0), `h_separation` (4), `icon_max_width` (0), `align_to_largest_stylebox` (0), `line_spacing` (bound, **not set** in the default theme; the class reference gives default 0, [Button.xml L133-L135](https://github.com/godotengine/godot/blob/4.7.2-stable/doc/classes/Button.xml#L133-L135)) |
| Icon | `icon` |
| Text shadow | **none**: Button only draws an outline ([L466-L471](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/button.cpp#L466-L471)) |

The `*_mirrored` StyleBoxes are used only when `is_layout_rtl()` and the theme has them
([L68-L95](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/button.cpp#L68-L95),
[L103-L154](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/button.cpp#L103-L154)). English and Ukrainian
are left to right, so the generator can leave them out. The default theme sets `hover_pressed` only for CheckBox and
CheckButton ([L285](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/theme/default_theme.cpp#L285),
[L324](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/theme/default_theme.cpp#L324)).

### 3.2 Which StyleBox in which state

`BaseButton::get_draw_mode`
([base_button.cpp L361-L394](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/base_button.cpp#L361-L394))
and `Button::_get_current_stylebox`
([button.cpp L103-L154](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/button.cpp#L103-L154)):

| Situation | Draw mode | StyleBox |
|---|---|---|
| disabled | DISABLED | `disabled` |
| shortcut feedback | HOVER_PRESSED | `hover_pressed` if the theme has it, else `pressed` |
| hovered, not held, toggled on | HOVER_PRESSED | `hover_pressed`, else `pressed` |
| hovered, not held | HOVER | `hover` |
| mouse held inside (or toggled on and not held) | PRESSED | `pressed` |
| otherwise | NORMAL | `normal` |

For a toggle button (the Esc menu's `EscTab`, `toggle_mode = true`,
[esc_menu.gd L44-L50](https://github.com/xperiaroco2/prime-game/blob/83a2c2fff9db752c9dd8e3cca7199e581dfd4a79/client/ui/esc_menu.gd#L44-L50)),
`pressed` and `hover_pressed` are the **selected** look. A toggle tab therefore needs its own variation: the "sink"
pressed StyleBox of action buttons would make the selected tab look held down for as long as it is selected.

**Focus is drawn on top** of the state StyleBox, over the whole control rect, whatever the state
([L228-L230](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/button.cpp#L228-L230); the class reference:
"displayed *over* the base StyleBox", [Button.xml L155-L157](https://github.com/godotengine/godot/blob/4.7.2-stable/doc/classes/Button.xml#L155-L157)).
It is drawn only for visible focus: a left click hides it unless `gui/common/show_focus_state_on_pointer_event` is 2
([viewport.cpp L571-L572, L1945-L1946, L2720-L2722](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/main/viewport.cpp#L1945-L1946)).
The focus box does not follow a face moved by expand margins (§4). The font colour of the focused state replaces only the
normal state's ([L290-L302](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/button.cpp#L290-L302)).

### 3.3 Content margins position the label; the pressed StyleBox can move it

[L241-L251](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/button.cpp#L241-L251) and
[L461](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/button.cpp#L461):

```cpp
const float style_margin_top = (theme_cache.align_to_largest_stylebox) ? theme_cache.style_margin_top : style->get_margin(SIDE_TOP);
...
drawable_size_remained.height -= style_margin_top + style_margin_bottom;
...
text_ofs.y = (drawable_size_remained.height - text_buf->get_size().height) / 2.0f + style_margin_top;
```

With `align_to_largest_stylebox = 0` (the default) the **current** state's StyleBox margins place the label. A pressed
StyleBox with `content_margin_top` +N and `content_margin_bottom` −N against `normal` moves the label down by exactly
N px; changing only the top moves it N/2. With `align_to_largest_stylebox = 1` the label uses the largest margin of every
state and **never moves**.

### 3.4 Minimum size

[L533](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/button.cpp#L533):
`return (theme_cache.align_to_largest_stylebox ? _get_largest_stylebox_size() : _get_current_stylebox()->get_minimum_size()) + minsize;`

- With the constant at 0: the minimum size is the **current** state's StyleBox minimum size plus the text and icon. It
  is recomputed only on `update_minimum_size()`: theme change, text change, or disabled change
  ([base_button.cpp L295-L314](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/base_button.cpp#L295-L314)).
  Hover and press only call `queue_redraw()`
  ([base_button.cpp L168-L178](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/base_button.cpp#L168-L178),
  [L285](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/base_button.cpp#L285)), so in practice the
  size comes from `normal` (or `disabled` while disabled). Even when it is recomputed, a change reaches the parent only
  if the size really changed
  ([control.cpp L1877-L1891](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/control.cpp#L1877-L1891)).
  **Keep top + bottom and left + right content margins equal across all states**, and no neighbour can ever move.
- With the constant at 1: the maximum over `normal`, `pressed`, `hover`, `disabled` and `hover_pressed` if present
  ([L59-L97](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/button.cpp#L59-L97),
  [L696-L702](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/button.cpp#L696-L702)). `focus` never
  counts.

## 4. The press motion (hover lifts 1 px, press sinks onto the base in 70 ms)

The CSS preview ([motion-preview.css L4-L29](../../../pages/styles/motion-preview.css#L4-L29)) translates the whole
button and changes its box-shadow, which moves the base with it: `.btn:active` is `translateY(5px)` with a 1 px shadow,
so the base's bottom edge moves from y = h + 5 to h + 6. `.card:active` moves 3 px without changing the shadow, so the
base moves 3 px.

**Godot cannot animate between two StyleBoxes**: Button picks one StyleBox per draw mode (§3.2), and nothing
interpolates between them. The options:

| Option | How | Layout stable? | Fits the game's rule? |
|---|---|---|---|
| **A. Instant state swap** (theme only) | Base 5 px (6 for `.fill`). `normal`: `shadow_offset (0, 5)`. `hover`: `expand_margin_top = +1`, `expand_margin_bottom = −1` (face 1 px up), `shadow_offset (0, 6)`, `content_margin_top −1` and `bottom +1`. `pressed`: `expand_margin_top = −4`, `expand_margin_bottom = +4` (face 4 px down), `shadow_offset (0, 1)`, `content_margin_top +4` and `bottom −4`. The base's bottom stays at h + 5 in every state. `align_to_largest_stylebox = 0` | Yes: equal margin sums (§3.4), and expand margins never touch layout | **Yes**: generator-only, no code |
| **B. Tween a visual-only offset** | A wrapper PanelContainer draws the base (its `panel` StyleBox: `expand_margin_top = −5`, `expand_margin_bottom = +5`, content margins 0); the Button inside has no shadow. A shared component tweens the Button's `offset_transform_position:y` to −1 (hover), base − 1 (press) and 0 (rest) | Yes: the offset transform is applied only to the canvas transform when `offset_transform_visual_only` is true, which is the default ([control.h L188-L205](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/control.h#L188-L205), [control.cpp L742-L775](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/control.cpp#L742-L775)); hit tests use `get_transform()`, which leaves it out ([viewport.cpp L1844-L1885](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/main/viewport.cpp#L1844-L1885)), so a sunk button cannot lose the mouse | **Yes**: no override, no `Color(...)`, no font size; one wrapper per button and one component |
| **C. Tween a duplicated StyleBoxFlat per button** (`shadow_offset`, expand margins, content margins) | `get_theme_stylebox("normal").duplicate()`, installed with `add_theme_stylebox_override` ([control.cpp L4003-L4014](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/control.cpp#L4003-L4014)), then tweened | Yes, if the sums are kept. But every tween step emits `changed`, so the button gets `NOTIFICATION_THEME_CHANGED`, reshapes its text and updates its minimum size on every frame ([control.cpp L3583-L3587](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/control.cpp#L3583-L3587), [button.cpp L195-L200](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/button.cpp#L195-L200)) | **No**: `add_theme_*_override` is what client/CLAUDE.md forbids and theme_test.gd's regex catches. The test skips `client/ui/theme/`, but putting the component there would only dodge the test, not the rule |
| C′. Tween the StyleBox **in** the Theme | | It moves every button of that variation at once, and the Theme re-emits `changed` ([theme.cpp L402-L418](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/resources/theme.cpp#L402-L418)), which re-propagates the theme to every themed screen ([control.cpp L3577-L3581, L3635](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/control.cpp#L3577-L3635)) | Not usable |
| D. Tween `position` | | No: a container's sort sets the child's rect and resets its rotation and scale ([container.cpp L109-L153](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/container.cpp#L109-L153)) | Not usable inside containers |

**Tween facts** (dump; [tween.h L85-L112](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/animation/tween.h#L85-L112)).
- `Tween.TransitionType`: `TRANS_LINEAR`=0, `TRANS_SINE`=1, `TRANS_QUINT`=2, `TRANS_QUART`=3, `TRANS_QUAD`=4,
  `TRANS_EXPO`=5, `TRANS_ELASTIC`=6, `TRANS_CUBIC`=7, `TRANS_CIRC`=8, `TRANS_BOUNCE`=9, `TRANS_BACK`=10,
  `TRANS_SPRING`=11.
- `Tween.EaseType`: `EASE_IN`=0, `EASE_OUT`=1, `EASE_IN_OUT`=2, `EASE_OUT_IN`=3. A Tween's own defaults are LINEAR and
  IN_OUT.
- `tween_property(object: Object, property: NodePath, final_val, duration)` works on any Object, so on a Resource too, and
  writes through `set_indexed`
  ([tween.cpp L640-L690](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/animation/tween.cpp#L640-L690)).
- There is **no cubic-bezier** transition: the curves are the fixed table at
  [tween.cpp L43-L56](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/animation/tween.cpp#L43-L56). But
  `PropertyTweener.set_custom_interpolator(Callable)` maps the 0..1 progress through any function returning a float
  ([L559-L571, L607-L608, L666-L683](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/animation/tween.cpp#L559-L683)),
  so a GDScript cubic-bezier is possible.
- CSS `ease-out` is `cubic-bezier(0, 0, 0.58, 1)`
  ([CSS Easing 1 §2.2](https://www.w3.org/TR/css-easing-1/#cubic-bezier-easing-functions)). Computed largest progress
  error against it: **TRANS_SINE + EASE_OUT 0.024** (0.12 px over 5 px), TRANS_QUAD 0.069, TRANS_CUBIC 0.216
  (equations: [easing_equations.h L65-L85](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/animation/easing_equations.h#L65-L85)).
  Use SINE/OUT with 0.07 s.
- 70 ms is 4.2 frames at 60 Hz and 10 frames at 144 Hz. My judgment, not a source: at 60 Hz option A and option B are
  hard to tell apart, so A could ship first and B be added only if a playtest asks for it.
- `prefers-reduced-motion` has no Godot counterpart that I found (unconfirmed); a game setting can set the duration to 0.

**What the mock-up should change to stay faithful:** with a static base (both A and B), the face moves by base − 1 and
the base stays put. In `motion-preview.css`, `.btn:active` should be `translateY(4px)` (5 px for `.fill`), keeping the
1 px shadow, so the base no longer moves 1 px down. `.card:active` should also reduce its shadow to 2 px
(`translateY(3px)` plus `box-shadow: 0 2px 0`), or the whole toy, base included, moves.

## 5. Text

**LabelSettings in 4.7.2** (dump; defaults from
[label_settings.h L43-L69](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/resources/label_settings.h#L43-L69)):
`line_spacing` float 3, `paragraph_spacing` float 0, `font`, `font_size` int, `font_color`, `outline_size` int 0,
`outline_color` (white), `shadow_size` int **1**, `shadow_color` (0, 0, 0, 0), `shadow_offset` Vector2 (1, 1). **Stacked
outlines and stacked shadows exist**: `stacked_outline_count` and `stacked_shadow_count`, with per-index size, colour,
offset and outline size (`add_stacked_outline`, `set_stacked_shadow_offset`, …). When a Label has `label_settings`, all of
its font, colour, outline and shadow values come from the settings and the theme's are ignored
([label.cpp L776-L788](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/label.cpp#L776-L788)).
`label_settings` is a node property, not a theme item, so using it in a screen bypasses the theme. The theme items below
cover one hard shadow.

**Label theme items** ([label.cpp L1510-L1523](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/label.cpp#L1510-L1523);
defaults from [default_theme.cpp L377-L401](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/theme/default_theme.cpp#L377-L401)):
`normal` and `focus` StyleBoxes; `font`, `font_size`; `font_color` (white); `font_shadow_color` (transparent);
`font_outline_color` (black); constants `shadow_offset_x` 1, `shadow_offset_y` 1, `outline_size` 0,
`shadow_outline_size` **1**, `line_spacing` 3, `paragraph_spacing`. The `normal` StyleBox is drawn behind the text and
its margins add to the Label's minimum size
([L789-L793](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/label.cpp#L789-L793),
[L1001-L1014](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/label.cpp#L1001-L1014)). So the `.t96`
title plate can be a Label variation, with expand margins in place of the CSS's negative margins.

**Hard text shadow: drawable.** The shadow is the glyph itself, drawn unblurred at an offset, before the outline and the
text ([L420-L424](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/label.cpp#L420-L424),
[L845-L901](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/label.cpp#L845-L901)). If
`shadow_outline_size > 0`, an outline of the shadow glyph is drawn as well, which fattens the shadow
([L845-L848](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/label.cpp#L845-L848)). The Toy logo
`text-shadow: 0 6px 0 coral` ([toy.css L69-L72](../../../pages/styles/toy.css#L69-L72)) is therefore a Label variation
with `font_shadow_color = coral`, `shadow_offset_x = 0`, `shadow_offset_y = 6`, and **`shadow_outline_size = 0`** (the
default 1 would make it 1 px fatter than the CSS). The offsets are int constants.

**Button and other controls** have `font_outline_color` and `outline_size` only, no text shadow
([button.cpp L859-L860](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/button.cpp#L859-L860)).

**Fonts.**
- `FontVariation` (dump; [font.cpp L2936-L2958](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/resources/font.cpp#L2936-L2958)):
  `base_font`, `variation_opentype` (Dictionary), `variation_face_index`, `variation_embolden` (float −2..2),
  `variation_transform`, `opentype_features`, `spacing_glyph`, `spacing_space`, `spacing_top`, `spacing_bottom` (all
  **int** px), `baseline_offset`.
- The 4.7 reference ([class_fontvariation](https://docs.godotengine.org/en/4.7/classes/class_fontvariation.html)) sets a
  variable weight like this: `fv.variation_opentype = { ts.name_to_tag("wght"): 900, ... }`, with
  `ts = TextServerManager.get_primary_interface()`. It says the axes can be keyed by tag (int) or by name (string). It
  also notes that embolden makes outlines thicker and can produce self-intersecting outlines.
- Comfortaa's Google Fonts build has a `wght` axis 300..700
  ([fonts research, finder.md L49](../2026-10-02-fonts/finder.md)). Toy's weights 600 (body) and 700 (titles and
  buttons) ([toy.css L40, L54, L133](../../../pages/styles/toy.css#L40)) are two `FontVariation` resources over one
  `FontFile`, with `variation_opentype = {wght: 600}` and `{wght: 700}`, set as `font` per theme type (and one as the
  theme's `default_font`). Embolden is the synthetic bold for static fonts (the engine's default bold uses
  `variation_embolden = 1.2`, [default_theme.cpp L1413-L1426](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/theme/default_theme.cpp#L1413-L1426));
  it is not needed for Comfortaa. Which weight the plain `FontFile` shows with no coordinates is (unconfirmed).
- `letter-spacing: .01em` and `-.01em` ([toy.css L56-L61](../../../pages/styles/toy.css#L56-L61)) come to 0.18 to 0.64 px.
  `spacing_glyph` is an int, so these round to 0 or ±1: the mock-up should drop them, or use whole px through a separate
  FontVariation.

## 6. ProgressBar, Gradient and the health colour

**ProgressBar theme items** ([progress_bar.cpp L282-L289](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/progress_bar.cpp#L282-L289)):
StyleBoxes `background` and `fill`, plus `font`, `font_size`, `font_color`, `outline_size`, `font_outline_color` (for
the percentage). Properties: `fill_mode` (`FILL_BEGIN_TO_END`=0, `FILL_END_TO_BEGIN`=1, `FILL_TOP_TO_BOTTOM`=2,
`FILL_BOTTOM_TO_TOP`=3), `show_percentage`, `indeterminate`. The minimum size is the larger of the two StyleBoxes'
minimum sizes, plus the text height when the percentage shows
([L40-L51](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/progress_bar.cpp#L40-L51)). That is how the
current `LifeBar` gets its size from content margins.

**How the fill is drawn** ([L69-L70, L115-L133](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/progress_bar.cpp#L115-L133)):

```cpp
draw_style_box(theme_cache.background_style, Rect2(Point2(), get_size()));
...
int mp = theme_cache.fill_style->get_minimum_size().width;
int p = std::round(r * (get_size().width - mp));
if (p > 0) {
    draw_style_box(theme_cache.fill_style, Rect2(Point2(0, 0), Size2(p + theme_cache.fill_style->get_minimum_size().width, get_size().height)));
}
```

- The fill rect starts at x = 0 and spans the **full height**, over the background's border. It is not inset by the
  background's content margins.
- Its width is `round(r · (W − mp)) + mp`, where `mp` is the fill StyleBox's horizontal minimum size; nothing is drawn
  while `round(r · (W − mp))` is 0.
- To reproduce the Toy track (3 px ink outline, fill inside,
  [toy.css L348-L359](../../../pages/styles/toy.css#L348-L359)): give the fill `expand_margin_left/top/right/bottom = −3`
  and `content_margin_left = content_margin_right = 3`. Then `mp = 6` and the drawn width is exactly
  `r · (W − 6)`, the CSS fraction of the inner width. Without the content margins every fill is 6 px short.
- Computed for the HUD bar (18 % of 1920 = 345.6 px wide, 16 px high) at 3 % health: `p = round(0.03 × 339.6) = 10`,
  so a 10 × 10 px drawn fill with radius 6. The radii shrink to 5 (§2), close to the CSS's 10.2 × 10 px fill with radius
  5. A small rounded square, not a sliver.

**Gradient in 4.7.2** (dump; [gradient.h L42-L52, L65-L66](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/resources/gradient.h#L42-L66)):
- `interpolation_mode`: `GRADIENT_INTERPOLATE_LINEAR`=0, `GRADIENT_INTERPOLATE_CONSTANT`=1, `GRADIENT_INTERPOLATE_CUBIC`=2.
- `interpolation_color_space`: `GRADIENT_COLOR_SPACE_SRGB`=0 (default), `GRADIENT_COLOR_SPACE_LINEAR_SRGB`=1,
  **`GRADIENT_COLOR_SPACE_OKLAB`=2**.
- `sample(offset) -> Color` ([gradient.cpp L60](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/resources/gradient.cpp#L60)).
- In Oklab mode each stop goes sRGB → linear → Oklab, is lerped, and comes back
  ([gradient.h L75-L119, L197-L207](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/resources/gradient.h#L75-L207);
  the conversion matrices are in [ok_color.h L67-L99](https://github.com/godotengine/godot/blob/4.7.2-stable/thirdparty/misc/ok_color.h#L67-L99)).

**`Color.lerp`** lerps the stored r, g, b and a ([color.h L110-L117](https://github.com/godotengine/godot/blob/4.7.2-stable/core/math/color.h#L110-L117)),
which are sRGB-encoded for colours written as hex. That equals CSS `color-mix(in srgb, …)`, **not** the mock-up's
`color-mix(in oklab, var(--toy-health-full) calc(var(--hp) * 100%), var(--toy-health-empty))`, which mixes full with
weight hp and empty with weight 1 − hp in Oklab
([css-color-5 Overview.bs L250-L285](https://github.com/w3c/csswg-drafts/blob/dddf78d1aec8935ae6fdb836e38459142e58dc59/css-color-5/Overview.bs#L250-L285)).
Computed with Godot's formulas, from #5BCB4E (full) to #FF5A44 (empty); all results are in gamut:

| hp | Gradient Oklab = CSS `in oklab` | `Color.lerp` (sRGB) |
|---|---|---|
| 1.00 | #5BCB4E | #5BCB4E |
| 0.75 | #9CB64C | #84AF4C |
| 0.50 | #C59E49 | #AD9349 |
| 0.25 | #E58147 | #D67647 |
| 0.10 | #F56B45 | #EF6545 |
| 0.03 | #FC6044 | #FA5D44 |
| 0.00 | #FF5A44 | #FF5A44 |

The sRGB lerp is darker in the middle (Oklab L 0.670 against 0.718 at 0.5). **To match the mock-up, use a `Gradient`
with the Oklab colour space**: two stops, built from two theme colours, then `sample(hp)`. Or the mock-up switches to
`in srgb` if `Color.lerp` is preferred; that is a look decision.

**Setting the fill colour without an override.** A ProgressBar draws its background and fill in one canvas item, so
`self_modulate` would tint both. An option that keeps the theme rule: a fill-only bar with a `StyleBoxEmpty` background,
a **white** fill StyleBox and `self_modulate = colour` (white × colour = colour), stacked over a track bar. The colour
comes from `get_theme_color()` items and a Gradient, so no `Color(...)` literal appears (theme_test.gd L14).

## 7. Other controls the Toy screens use

Theme item names are from each control's `_bind_methods` at the tag; textures are marked.

| Control | StyleBoxes | Colours, constants, fonts | Icons (Texture2D) | Notes |
|---|---|---|---|---|
| Panel ([panel.cpp L44-L53](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/panel.cpp#L44-L53)) | `panel` | | | drawn over the full rect |
| PanelContainer ([panel_container.cpp L35-L51, L100-L127](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/panel_container.cpp#L35-L127)) | `panel` | | | children are inset by the panel's content margins, which add to the minimum size |
| Label | `normal`, `focus` | see §5 | | |
| LineEdit ([line_edit.cpp L3545-L3564](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/line_edit.cpp#L3545-L3564)) | `normal`, `read_only`, `focus` (drawn over `normal`, [L1385-L1403](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/line_edit.cpp#L1385-L1403)) | `font_color`, `font_uneditable_color`, `font_selected_color`, `font_placeholder_color`, `font_outline_color`, `caret_color`, `selection_color`, `clear_button_color`, `clear_button_color_pressed`; `outline_size`, `caret_width`, `minimum_character_width`; `font`, `font_size` | `clear` | |
| TabBar ([tab_bar.cpp L2255-L2290](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/tab_bar.cpp#L2255-L2290)) | `tab_selected`, `tab_unselected`, `tab_hovered`, `tab_disabled`, `tab_focus`, `button_pressed`, `button_highlight` | `font_selected_color`, `font_hovered_color`, `font_unselected_color`, `font_disabled_color`, `font_outline_color`, `icon_*_color`, `drop_mark_color`; `h_separation`, `tab_separation`, `icon_max_width`, `outline_size`, `hover_switch_wait_msec`; `font`, `font_size` | `increment(_highlight)`, `decrement(_highlight)`, `drop_mark`, `close` | |
| TabContainer ([tab_container.cpp L1273-L1312](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/tab_container.cpp#L1273-L1312)) | the TabBar's five `tab_*` plus `panel`, `tabbar_background` | as TabBar, plus `side_margin`, `icon_separation` | as TabBar, plus `menu`, `menu_highlight` | the game's Esc tabs are toggle Buttons (`EscTab`), not a TabContainer |
| CheckBox ([check_box.cpp L154-L168](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/check_box.cpp#L154-L168)) | all Button items (default: StyleBoxEmpty, [default_theme.cpp L274-L313](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/theme/default_theme.cpp#L274-L313)) | `checkbox_checked_color`, `checkbox_unchecked_color`; `h_separation`, `check_v_offset` | **`checked`, `unchecked`, `radio_checked`, `radio_unchecked` and `*_disabled`** | the mark is a texture |
| CheckButton ([check_button.cpp L153-L167](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/check_button.cpp#L153-L167)) | Button items | `button_checked_color`, `button_unchecked_color`; `h_separation`, `check_v_offset` | **`checked`, `unchecked`, `*_disabled`, `*_mirrored`** | the switch is a texture |
| OptionButton ([option_button.cpp L664-L677](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/option_button.cpp#L664-L677)) | Button items | Button colours, `arrow_margin`, `modulate_arrow`, `h_separation` | **`arrow`** | its list is a PopupMenu: `panel`, `hover`, `separator`, `labeled_separator_left/right`, font colours, `v_separation`, … ([default_theme.cpp L750-L805](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/theme/default_theme.cpp#L750-L805)) |
| HSlider ([slider.cpp L480-L491](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/slider.cpp#L480-L491)) | `slider`, `grabber_area`, `grabber_area_highlight` | `center_grabber`, `grabber_offset`, `tick_offset` | **`grabber`, `grabber_highlight`, `grabber_disabled`, `tick`** | the grabber is a texture ([L283-L291](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/slider.cpp#L283-L291)) |
| VScrollBar, HScrollBar ([scroll_bar.cpp L690-L725](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/scroll_bar.cpp#L690-L725)) | `scroll`, `scroll_focus`, `grabber`, `grabber_highlight`, `grabber_pressed` | `padding_left/right/top/bottom` (bound, not in the default theme) | `increment`, `decrement` and their `_highlight`, `_pressed` (empty by default) | |
| ScrollContainer ([scroll_container.cpp L939-L949](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/scroll_container.cpp#L939-L949)) | `panel`, `focus` | `scrollbar_h_separation`, `scrollbar_v_separation`, `scroll_hint_vertical_color`, `scroll_hint_horizontal_color` | `scroll_hint_vertical`, `scroll_hint_horizontal` | |
| Tooltip | `TooltipPanel` (a variation of PopupPanel): `panel` | `TooltipLabel` (a variation of Label): Label items | | made by the viewport, which sets those variations ([viewport.cpp L1660-L1687](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/main/viewport.cpp#L1660-L1687), [default_theme.cpp L1187-L1203](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/theme/default_theme.cpp#L1187-L1203)). The popup is added as a child of the hovered control, and a Window takes its parent's theme on parenting ([window.cpp L1632-L1634](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/main/window.cpp#L1632-L1634), [theme_owner.cpp L93-L110](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/theme/theme_owner.cpp#L93-L110)), so these two in `game_theme.tres` should reach tooltips on themed screens (read from code, not run) |
| ItemList ([item_list.cpp L2474-L2500](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/item_list.cpp#L2474-L2500)) | `panel`, `focus`, `hovered`, `hovered_selected`, `hovered_selected_focus`, `selected`, `selected_focus`, `cursor`, `cursor_unfocused` | `font_color`, `font_hovered_color`, `font_hovered_selected_color`, `font_selected_color`, `font_outline_color`, `guide_color`, `scroll_hint_color`; `h_separation`, `v_separation`, `line_separation`, `icon_margin`, `outline_size` | `scroll_hint` | only if a teammate list or a preset list becomes one |
| SpinBox (the game uses it: main menu port, lobby numbers) | `up_background`, `down_background` and their `_hovered`, `_pressed`, `_disabled`; `field_and_buttons_separator`, `up_down_buttons_separator` | `up_icon_modulate`, … ; `buttons_vertical_separation`, `field_and_buttons_separation`, `buttons_width` | **`up`, `down` and their variants, `updown`** | [default_theme.cpp L613-L651](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/theme/default_theme.cpp#L613-L651). The Toy `‹ ›` steppers ([toy.css L260-L267](../../../pages/styles/toy.css#L260-L267)) are text in pills; a SpinBox can only show icon textures there |

For Toy, toggles and steppers can avoid textures by being Buttons (`toggle_mode`, `pressed` and `hover_pressed` as the
"on" look). Otherwise they need own-work SVG icons, each with a recorded licence.

## 8. Scaling and text size

- **Window content scale** (dump; [window.cpp L3594-L3598](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/main/window.cpp#L3594-L3598)):
  `content_scale_size` Vector2i; `content_scale_mode` (`CONTENT_SCALE_MODE_DISABLED`=0, `_CANVAS_ITEMS`=1,
  `_VIEWPORT`=2); `content_scale_aspect` (`IGNORE`=0, `KEEP`=1, `KEEP_WIDTH`=2, `KEEP_HEIGHT`=3, `EXPAND`=4);
  `content_scale_stretch` (`FRACTIONAL`=0, `INTEGER`=1); `content_scale_factor` float (hint 0.5..8, the setter rejects
  ≤ 0, [L1887-L1892](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/main/window.cpp#L1887-L1892)).
- In `canvas_items` mode the 2D logical size is `viewport_size / content_scale_factor`, stretched to the screen
  ([L1407-L1411](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/main/window.cpp#L1407-L1411)). With
  `expand`, one base dimension is kept and the other grows with the window: the height on screens wider than the base's
  16:9, the width on narrower ones such as 16:10
  ([L1346-L1375](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/main/window.cpp#L1346-L1375)).
- At startup the root window gets the project's stretch mode, aspect, base size and `display/window/stretch/scale`
  ([main.cpp L4627-L4661](https://github.com/godotengine/godot/blob/4.7.2-stable/main/main.cpp#L4627-L4661)).
- `viewport_width/height` also set the **initial window size** unless `window_width_override/height_override` are set
  ([main.cpp L2684-L2700](https://github.com/godotengine/godot/blob/4.7.2-stable/main/main.cpp#L2684-L2700)). Moving the
  base to 1920×1080 therefore needs the override pair too, if the window should not open at 1920×1080.
- **Theme scale items are not a UI scale.** `Theme.default_base_scale` (default 0.0) is "used by some controls to
  scale their visual properties" ([Theme.xml L553-L556](https://github.com/godotengine/godot/blob/4.7.2-stable/doc/classes/Theme.xml#L553-L556)),
  for example LineEdit's caret width ([line_edit.cpp L1187, L1562](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/line_edit.cpp#L1562)).
  `Theme.default_font_size` (−1) only fills sizes the theme does not set
  ([Theme.xml L561-L564](https://github.com/godotengine/godot/blob/4.7.2-stable/doc/classes/Theme.xml#L561-L564)), so
  it does nothing for variations that each set their own size. `gui/theme/default_theme_scale` only scales the engine's
  default theme ([theme_db.cpp L55](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/theme/theme_db.cpp#L55),
  [default_theme.cpp L97-L98](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/theme/default_theme.cpp#L97-L98)).
- **Two ways to offer large text.**
  1. `get_tree().root.content_scale_factor = k`: one property scales **all** 2D (text, borders, radii, the HUD) and
     leaves only 1/k of the logical room, so fixed layouts can overflow. Simple, and exact to the tokens.
  2. A second generated theme (for example `game_theme_large.tres`, font sizes × k, with content margins adjusted),
     swapped at runtime. It grows only the text, but `GameUi.THEME` is a const preload handed to every screen
     ([game_ui.gd L13, L120-L124](https://github.com/xperiaroco2/prime-game/blob/83a2c2fff9db752c9dd8e3cca7199e581dfd4a79/client/ui/game_ui.gd#L13)),
     so a swap needs a GameUi change (a prime-game issue). `Theme.merge_with`
     ([theme.cpp L1699](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/resources/theme.cpp#L1699)) can
     layer the larger sizes over the base theme.
- **Translucent fills.** With `hdr_2d` off (the project's default), 2D is not "performed on linear values"
  ([ProjectSettings.xml L3512](https://github.com/godotengine/godot/blob/4.7.2-stable/doc/classes/ProjectSettings.xml#L3512)),
  so the rgba plates blend on encoded values, the way the mock-up assumes. That browsers also blend on encoded sRGB is
  (unconfirmed) here.

## 9. Theme type variations and the generator

- **API** (dump): `Theme.set_stylebox(name, theme_type, StyleBox)`, `set_color`, `set_constant` (int), `set_font_size`
  (int), `set_font`, `set_icon`, `set_type_variation(theme_type, base_type)`, `get_type_variation_base`,
  `get_type_variation_list`, `get_type_list`, `has_theme_item`, `merge_with`; properties `default_base_scale`,
  `default_font`, `default_font_size`.
- **In `.tres`** the keys are `Type/styles/name`, `Type/colors/…`, `Type/constants/…`, `Type/font_sizes/…`,
  `Type/fonts/…`, `Type/icons/…`, and `Type/base_type = &"Base"`
  ([theme.cpp L38-L68](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/resources/theme.cpp#L38-L68)).
- **Names**: ASCII identifier characters only, and a variation may not be named after a built-in class
  ([theme.cpp L180-L189, L1237-L1253](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/resources/theme.cpp#L1237-L1253)).
  Item names may be custom: a `press_depth` constant or a `health_full` colour can be read with
  `get_theme_constant` and `get_theme_color` ([L191-L203](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/resources/theme.cpp#L191-L203)).
  Use **letters-only CamelCase** names: the game's test only sees `&"[A-Za-z]+"` (§0).
- **Variations of variations work.** The lookup walks variation → its base variation → … → the native class chain
  ([theme.cpp L1406-L1421](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/resources/theme.cpp#L1406-L1421)).
  The whole chain must be in one theme: "variations can depend on other variations, but only within the same theme"
  ([theme_owner.cpp L178-L226](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/theme/theme_owner.cpp#L178-L226)).
  Items are searched per owner, then per type in that chain, then in the global themes
  ([L228-L260](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/theme/theme_owner.cpp#L228-L260)).
  The reference says "Variations can also be nested"
  ([Theme.xml L540-L549](https://github.com/godotengine/godot/blob/4.7.2-stable/doc/classes/Theme.xml#L540-L549)). So
  `ToyButtonPrimary → ToyButton → Button` can set only what differs.
- **Validating item names.** `ThemeDB.get_default_theme()`
  ([theme_db.cpp L419-L421](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/theme/theme_db.cpp#L419-L421))
  holds only what the default theme sets, and some bound items are missing from it: Button's `line_spacing`
  (bound at [button.cpp L875](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/button.cpp#L875)), Label's
  `paragraph_spacing`, ScrollBar's `padding_*`, TabBar's and TabContainer's `tab_separation`. The API dump has no theme
  items. Validate against the default theme plus the class reference XML's `<theme_items>` at the tag
  (`doc/classes/<Class>.xml`), or plus a short allowlist.
- **Writing the file.** `ResourceSaver.save(theme, path, flags)`; flags include `FLAG_CHANGE_PATH` and
  `FLAG_OMIT_EDITOR_PROPERTIES` (dump).
  - The header's uid comes from `ResourceSaver.get_resource_id_for_path`, which only uses a callback
    ([resource_saver.cpp L285-L290](https://github.com/godotengine/godot/blob/4.7.2-stable/core/io/resource_saver.cpp#L285-L290);
    [resource_format_text.cpp L1812-L1816](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/resources/resource_format_text.cpp#L1812-L1816)).
    The editor's `EditorFileSystem` installs that callback and returns the file's existing uid
    ([editor_file_system.cpp L3672-L3700, L3817](https://github.com/godotengine/godot/blob/4.7.2-stable/editor/file_system/editor_file_system.cpp#L3672-L3700)).
  - `main.cpp` at the tag never installs it, and a GitHub code search (default branch, not the tag) finds it only in the
    editor. So in a plain `--headless --script` run, **the saved `.tres` has no uid**. Afterwards, call
    `ResourceSaver.set_uid(path, ResourceUID.text_to_id("uid://c8behqt7jtcn8"))`, which rewrites the header
    ([resource_format_text.cpp L2204-L2231](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/resources/resource_format_text.cpp#L2204-L2231)).
    Whether a headless *editor* run installs the callback before the script runs is (unconfirmed).
  - Sub-resource ids are random (`StyleBoxFlat_` plus a generated id) unless the resource already has a
    `resource_scene_unique_id` ([L1895-L1935](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/resources/resource_format_text.cpp#L1895-L1935)).
    Setting one per StyleBox (for example `StyleBoxFlat_toy_button_pressed`) keeps the regenerated file's diff small.
  - Colours in the generator: if it lives under `client/ui/`, outside `client/ui/theme/`, `Color(...)` would fail
    theme_test.gd. Keep it in `client/ui/theme/` or `tools/`.

## CSS mock-up rule -> Godot reality

Every feature used in [toy.css](../../../pages/styles/toy.css) and [motion-preview.css](../../../pages/styles/motion-preview.css).

| CSS feature (where) | Godot 4.7.2 | Verdict |
|---|---|---|
| Solid hex fills (`background: var(--toy-…)`) | `StyleBoxFlat.bg_color` | drawable as is |
| rgba fills (`--toy-plate` .86, `.dim` .70 and .80, the map zone .55) | `bg_color` with alpha; blends on non-linear values with `hdr_2d` off (§8) | drawable as is |
| `background: transparent` (`.btn.ghost`, `.chip.line`) | `draw_center = false` | drawable as is |
| `border: Npx solid C`, one colour (buttons, panels, fields, cards, slots, bars) | `border_width_*` (int) + `border_color` | drawable as is (ints at the reference resolution, §8) |
| Per-side border widths, one colour (`.key` 2 2 5, `.ring` 10 10 0 0, `.setrow` bottom only, `.slot.on` 5) | per-side `border_width_*` | drawable with a change: inner corners are circular in Godot and elliptical in CSS (§2); check in a `shot` |
| `border-color: transparent` (`.chip`, `.tabs > div`) | Godot leaves a see-through ring and insets the fill; CSS paints the background under the border (`background-clip` initial `border-box`, [Overview.bs L923-L930](https://github.com/w3c/csswg-drafts/blob/dddf78d1aec8935ae6fdb836e38459142e58dc59/css-backgrounds-3/Overview.bs#L923-L930)) | drawable with a change: border width 0, with the width added to the content margins (or `border_color = bg_color`) |
| `border-radius` in px, per corner (`.you` 0 14 14 14) | `corner_radius_*` (int) | drawable as is |
| `border-radius: 999px` (`.val .ar`) and radii above half the box | int 999; per-corner adaptation, same as CSS for equal radii (§2) | drawable as is |
| `border-radius: 50%` (wireframe `.dot`, `.circ`, `.ring`, `.cross`) | no percentage form | drawable with a change: write half the size in px |
| `box-shadow: 0 Npx 0 C`, the toy base (`.btn` 5, `.btn.fill` 6, `.tabs > div.on` 4, `.card` 5, `.t96` 10, `.panel` and `.map` 10 at rgba .6) | `shadow_offset (0, N)`, `shadow_size 1`, `shadow_color` | drawable with a change: a 1 px soft outer edge; opaque fills only (§1.2). Exact where base = border colour: `expand_margin_bottom` + a thicker bottom border (§1.3) |
| `box-shadow: none` | `shadow_size = 0` | drawable as is |
| `padding` | `content_margin_*` = border + padding | drawable with a change: the token is the sum |
| Negative `margin` around `.t96` (the plate drawn outside the layout box) | Label `normal` StyleBox `expand_margin_*` | drawable with a change |
| `height` on `[data-bar]`, width and height on `.you` | StyleBox content margins (minimum size) or `custom_minimum_size` | drawable with a change |
| `text-shadow: 0 6px 0 coral` (the logo) | Label `font_shadow_color`, `shadow_offset_x/y`, `shadow_outline_size = 0` | drawable as is, on a Label only (a Button has no text shadow) |
| Text `color` | `font_color` and the per-state colours | drawable as is |
| `font-weight: 600 / 700` | a `FontVariation` per weight (`variation_opentype {wght}`) set as `font` | drawable with a change |
| `font-size` px (`.t16` 18, `.t18` 20, `.room` 18) | `font_size` (int) | drawable as is (ints at the reference resolution) |
| `letter-spacing: ±.01em` | `FontVariation.spacing_glyph` is an int px | not drawable at that size: drop it, or use whole px |
| `transform: rotate(80deg)` (`.you`) | `Control.rotation`, or `offset_transform_rotation` inside a container (containers reset rotation, [container.cpp L150-L152](https://github.com/godotengine/godot/blob/4.7.2-stable/scene/gui/container.cpp#L150-L152)) | drawable with a change: a node property, not the theme |
| `transform: translateY(…)` (hover −1, press +5, +6, +3) | hover and pressed StyleBoxes shift the face with expand margins and the label with content margins; or a Tween of `offset_transform_position` (§4) | drawable with a change: press by base − 1 so the base stays still |
| `transition: transform, box-shadow 70ms ease-out` | instant state swap, or a Tween with TRANS_SINE / EASE_OUT for 0.07 s | drawable with a change: code for the tween |
| `@media (prefers-reduced-motion: reduce)` | no OS query found (unconfirmed); a game setting sets the tween duration to 0 | drawable with a change |
| `cursor: pointer` | `Control.mouse_default_cursor_shape = CURSOR_POINTING_HAND` | drawable with a change: a node property |
| `color-mix(in oklab, full hp%, empty)` (health fill) | `Gradient` with `GRADIENT_COLOR_SPACE_OKLAB`, `sample(hp)`; `Color.lerp` gives a different (sRGB) mix (§6) | drawable with a change |
| Fill inside the bar's 3 px outline, radius 6 | the ProgressBar `fill` with `expand_margin_* = −3`, `content_margin_left/right = 3` (§6) | drawable with a change |
| SVG `stroke` and `fill` (how-to frames, room icons) | icon textures (own-work SVG) tinted with icon colours or `self_modulate` | drawable with a change |
| `outline-color` on the swatch ring (the wireframe's `outline` with `outline-offset`) | a second box: a ring StyleBox (`draw_center = false`, expand margins = offset + width) on its own node | drawable with a change |
| `.ring` spinner (two borders and 50 % radius, rotating) | per-side borders and px radius; rotation through `offset_transform_rotation` or `rotation` | drawable with a change: the crescent's shape differs slightly |
| `opacity`, gradients, blur, filters, several or inset shadows, per-side border colours, `clip-path` | not used in Toy; already outside the lint ([check_styles.js L63-L70](../../../pages/styles/check_styles.js#L63-L70)) | not drawable (none used) |

**Lint additions that follow from this** (for [check_styles.js](../../../pages/styles/check_styles.js)):
- flag `box-shadow` on a translucent or transparent fill;
- flag `border-color: transparent`;
- flag a `%` border-radius;
- flag fractional `letter-spacing`;
- record the mapping "blur 0 → `shadow_size` 1".
