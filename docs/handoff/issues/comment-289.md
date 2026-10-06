<!-- Draft of a comment on prime-game #289 -->

## ui-0.2.0: what the styled screens add to the Toy components

The ten styled screens (prime-game-ui#19; handoffs in `docs/handoff/` at `ui-0.2.0`) use the components in ways this issue does not list yet.

1. **ToyRaised also wraps panels and a Label.** ToyPanelMenu, ToyPanelDialog, ToyPanelHowto and ToyMapBoard sit on ToyBasePanel, and ToyTitlePlate (a Label: the role and the winner) on ToyBaseTitle, with no ToyPress. A `UiParts` helper beside `UiParts.button()` keeps one way to build them. The wrapper takes the placement, size flags, minimum size and visibility; the face keeps the variation, the text and the signals.
2. **Toggles without a toggle partner.** ToyMenuItem (the main menu's Join, Join by address and Settings: one ButtonGroup with `allow_unpress`) and ToyKeyButton draw their own `pressed` and `hover_pressed` StyleBoxes. The pack's `toggle` is null for them, so ToyToggle does not apply. ToyMenuItem's pointer icon is tinted by its `icon_*_color` (clear when idle). Their `press.*` are 0: no base, no offset.
3. **ToyKeyButton's capture look.** Settings › Controls sets `toggle_mode = true` and `set_pressed_no_signal(true)` while it captures a key, and restores both after. A wide keycap reads `wide_min_width` (96), a plain one `min_width` (36).
4. **ToyKeyRoundButton** is the map's «?», 42×42.
5. **Preset cards are content buttons.** ToyPresetCard has no text: a VBox child holds ToyPresetCardName and the note, the children ignore the mouse, and `custom_minimum_size` 184×96 holds them (a Button's minimum does not follow its children). When ToyToggle swaps a card to ToyPresetCardSelected, its note swaps ToyPresetCardNote ↔ ToyPresetCardNoteSelected too. The press offset is on the face, so the content must sink with it. Save is the same raised card as a plain button.
6. **A raised toggle that stays on.** The Esc menu's Ready is a ToyButtonPrimary toggle that keeps its pressed look and a check icon while ready (the review page does not draw that state yet), while a selected preset card keeps the idle card's size. Decide the offset ToyPress gives a raised toggle that is on.
7. **Slots are 88 px** (84 in ui-0.1.2): ToySlot and ToySlotActive `width` and `height` 88, `wide_width` 180. Read them, never hard-code.
8. **ToySlider's focus ring is drawn in code.** Godot's Slider has no focus StyleBox, so draw `get_theme_stylebox(&"focus", &"ToySlider")` over the slider while it shows keyboard or gamepad focus. The grabber textures come from the theme (#288).
9. **ToyScrollBar** is set in code: `get_v_scroll_bar().theme_type_variation = &"ToyScrollBar"` on every ToyScroll container.
10. **One size helper** reads `width`, `height`, `min_width`, `wide_width` and `wide_min_width` into `custom_minimum_size`.
11. **The health ramp** also colours the downed screen's bleed-out bar (the time left reads as life).
12. **Reduced motion and large text** are toggles in Settings › Accessibility (s5). Reduced motion defaults from `DisplayServer.accessibility_should_reduce_animation()`; besides the press, it makes the connecting spinner half speed and the pre game, post game and End fades cuts (screen code, one setting). Large text swaps to `game_theme_large.tres` live.
13. **The Godot showcase** adds the 0.2.0 variations in their states: ToyMenuItem (idle, hover, focus, open), ToyKeyButton (plain, wide, capturing), ToyKeyRoundButton, ToySlider (idle, focused with the code-drawn ring, not editable), ToyScrollBar beside a ToyScroll list, ToyChipAlert, ToyPresetCardName, ToyDisplayOnLight, ToyStepper with its chevron icons and ToyDropdown with its arrow. The spacing variations draw nothing. ToyChipNew and ToyChipNewText are deprecated: no screen uses them.

Tracking: #150

🤖 Generated with [Claude Code](https://claude.com/claude-code)
