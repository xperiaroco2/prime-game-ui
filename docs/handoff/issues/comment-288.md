<!-- Draft of a comment on prime-game #288 -->

## ui-0.2.0: what the generator must handle

`ui-0.2.0` (a minor bump from `ui-0.1.2`; `schema` stays 1) adds 24 variations for the styled screens (prime-game-ui#19), 118 concrete in all. Sync with `tools\run.cmd ui-sync ui-0.2.0`. Sources: `dist/pack/toy.pack.json` and `tokens/README.md` (Classes, Items) at the tag.

**New classes** (new `mapping.json` entries)

| Class | Variations | Theme items |
|---|---|---|
| VBoxContainer | ToyColumnFour, ToyColumnEight, ToyColumnTwelve, ToyColumnSixteen, ToyColumnTwentyFour, ToyColumnThirtyTwo | constant `separation` (4 to 32) |
| HBoxContainer | ToyRowFour … ToyRowThirtyTwo (the same six) | `separation` |
| GridContainer | ToyGridList (24, 8), ToyGridSwatch (12, 12) | `h_separation`, `v_separation` |
| ScrollContainer | ToyScroll | `scrollbar_h_separation` 8 |
| HSlider | ToySlider | StyleBoxes `slider`, `grabber_area`, `grabber_area_highlight`, plus `focus` (below); icons `grabber`, `grabber_highlight`, `grabber_disabled` |
| VScrollBar | ToyScrollBar | StyleBoxes `scroll`, `scroll_focus`, `grabber`, `grabber_highlight`, `grabber_pressed` |

Containers have no StyleBox (`styleboxes` is empty) and no `parent`: their base type is the class itself. State names map as before (`grabber-area-highlight` → `grabber_area_highlight`, `scroll-focus` → `scroll_focus`).

**New items on existing classes** (kebab-case to snake_case, as before)
- Button: `icon_normal_color`, `icon_hover_color`, `icon_pressed_color`, `icon_hover_pressed_color`, `icon_focus_color`, `icon_disabled_color` (ToyMenuItem, ToyButtonPrimary, ToyStepper), and the constant `h_separation` (ToyMenuItem 12).
- OptionButton (ToyDropdown): constants `arrow_margin` 16, `h_separation` 8, `modulate_arrow` 1 (the arrow takes the state's font colour).

**Other new variations**: ToyMenuItem, ToyKeyButton, ToyKeyRoundButton (Buttons, parent ToyButton, `press.*` all 0; ToyKeyButton has `min_width` 36 and `wide_min_width` 96, ToyKeyRoundButton `min_width` 36), ToyChipAlert (PanelContainer) and ToyChipAlertText, ToyPresetCardName, ToyDisplayOnLight (Labels).

**Spelled-out names.** The spacing variations spell their numbers (ToyColumnTwentyFour, never ToyColumn24), so every name passes the theme test's `[A-Za-z]+`. The pack's `space.4` … `space.32` are primitives with no variation: nothing to map.

**ToySlider's `focus`.** Godot 4.7.2's Slider draws no focus StyleBox (slider.cpp binds `slider`, `grabber_area` and `grabber_area_highlight` only). Write the `focus` StyleBox under ToySlider anyway, so the code can draw the ring (#289). The class-reference check must allow it as a custom item, like ToyMic's `icon_on` and `icon_off` and the ramp stops.

**ToyScroll** only sets the container's constant. The bar is the container's own VScrollBar, which takes ToyScrollBar from code (`get_v_scroll_bar()`, #289); the generator writes ToyScrollBar's StyleBoxes only.

**Textures the pack does not name.** The slider's grabber icons (`icons/slider-knob.svg` for `grabber` and `grabber_highlight`, `icons/slider-knob-disabled.svg` for `grabber_disabled`; 28 px, own colours, not tinted) and ToyDropdown's `arrow` (`icons/chevron-down.svg`, white, tinted through `modulate_arrow`) have no token in the pack: name them in `mapping.json`.

**Icons and the `.gdignore`.** `dist/pack/icons/` holds 14 own-work SVGs and their `LICENCES.json`. An icon drawn in `currentColor` is written white, so the game tints it by multiplying (`self_modulate`, a Button's `icon_*_color`, `modulate_arrow`); the slider knobs keep their colours. ui-sync copies the pack under a `.gdignore`, so Godot would not import these SVGs: they need an imported folder, under the same sha256 lock. Import each at `svg/scale` = its largest drawn size ÷ its viewBox, as the handoffs list: `check` and `item` 5, `mic` and `mic-off` 1.17, `lock` and `teammate-mark` 0.84, the chevrons, `pointer`, `swatch-disc` and `knife` 1.

**Deprecated.** ToyChipNew and ToyChipNewText carry `$deprecated` in the tokens (the NEW tag is gone; ToyChipAlert replaces them) and stay in the pack until the next major. The pack does not mark them, so the generator writes them as usual; no screen uses them.

**Value changes.** ToySlot and ToySlotActive `width` and `height`: 84 → 88.

Tracking: #150

🤖 Generated with [Claude Code](https://claude.com/claude-code)
