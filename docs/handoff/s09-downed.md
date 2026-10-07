# 9 · Downed, dead and respawn

<!-- node pages/screens/build.js --handoff s9 (prime-game-ui, pages/screens/src/s09-downed.json); generated, do not edit by hand -->

The styled downed, dead and respawn screen from the UI track (xperiaroco2/prime-game-ui), as a Godot 4.7.2 node tree for the 1920×1080 reference.

- **Source:** `pages/screens/src/s09-downed.json`; the review page is `pages/screens/screens.html#s9`; the wireframe is section `s9` («Повалений, мертвий, повернення»).
- **Theme:** the Toy pack ui-0.4.0 (`dist/pack/toy.pack.json`); the variations below are `theme_type_variation` names.
- **World behind the UI** (not UI): a dark room of the level.
- **How to read it:** the roots are children of the screen's full-rect root `Control`; every property not listed keeps Godot's default; sizes and offsets are reference px. In a state's **Shown** list, the first node of each subtree gives its path from the screen root.
- **Texts** are keys of `copy/strings.csv`, and the language switches live (the Esc menu's Settings). A plain key is set as `text` and translates itself. A key with placeholders, a plural key (`tr_n`) and a key drawn in pieces are set from code with `auto_translate_mode = DISABLED`: `tr()`, then `String.format()` with the data (the samples below), rebuilt on `NOTIFICATION_TRANSLATION_CHANGED`. A "text from data" (names, the room code, times, numbers) is set in code and never translated (`auto_translate_mode = DISABLED`).

The same HUD as s7: Hud and its nodes are s7's (same names and places); this screen only hides and returns them and adds the downed, spectating and protection plates. Aim and the name plates behave as in s7 and are left out here. Every node has mouse_filter IGNORE. Never show who knocked the player down.

## States

| State | Page label | What it shows |
|---|---|---|
| `down` | Нокдаун | Downed and bleeding out: only the two plates and the mic (off) show; the rest of the HUD hides. |
| `down-holding` | Утримуєш F | The give-up key is held: the hold bar fills over 1 s. |
| `raise` | Тебе піднімають | A teammate is raising the player: the raise progress replaces the bleed-out bar; giving up hides. |
| `dead` | Смерть: спостереження | Spectating another player: only the time to respawn and the watched player's name. |
| `back` | Повернення | Back in the round: the s7 HUD returns with a 3 s protection chip. Stamina returns full in the game; the sample shows it part-empty only so the bar is reviewed over a dark room. |

## Node tree in `down`

- **Hud** `Control` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both
  - Note: s7's Hud. While downed only Vitals/Mic shows; while dead nothing shows; on return everything as in s7.
  - **Vitals** `VBoxContainer` · variation `ToyColumnTwelve` · anchors `bottom_left`, offsets 40, -40, 40, -40 (left, top, right, bottom), grow end/begin · gaps from the variation: separation 12
    - **Mic** `PanelContainer` · variation `ToyMic` · size flags horizontal `SIZE_SHRINK_BEGIN` · custom_minimum_size (46, 46) = Vector2(get_theme_constant("width", "ToyMic"), get_theme_constant("height", "ToyMic"))
      - Note: Off while downed (nobody hears a downed player); hidden while dead; on again on return (when the player is heard).
      - **Icon** `TextureRect` · size flags horizontal `SIZE_SHRINK_CENTER`, vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (28, 28) · texture `mic-off` (dist/pack/icons/mic-off.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("icon_off", "ToyMic")
- **Downed** `PanelContainer` · variation `ToyPlate` · anchors `center_top`, offsets 0, 152, 0, 152 (left, top, right, bottom), grow both/end · custom_minimum_size (688, 0)
  - Note: Shown from the moment the player is downed until they are raised, give up or bleed out.
  - **V** `VBoxContainer` · variation `ToyColumnEight` · gaps from the variation: separation 8
    - **Title** `Label` · variation `ToyTitleOnDark` · custom_minimum_size (600, 0) · text `downed.title`: en "You're down" · uk "Тебе повалено" · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
      - Note: downed.title while bleeding out; downed.raised_by with the raiser's name (auto_translate_mode DISABLED on the name) while someone raises the player.
    - **Bleed** `PanelContainer` · variation `ToyBarTrack` · custom_minimum_size (600, 16) = Vector2(600, get_theme_constant("height", "ToyBarTrack"))
      - **Fill** `ProgressBar` · variation `ToyBarHealth` · custom_minimum_size (0, 10) · value 0.7 of max_value 1, show_percentage false · fill self_modulate = theme colour `ramp_stop_14` of `ToyBarHealth` (step = clampi(floori(hp * 20.0 + 0.5), 0, 20))
        - Note: value = bleed-out time left / bleed-out duration, falling to 0; coloured with the health ramp as s7's health (the time left reads as life).
    - **Left** `Label` · variation `ToyTextMutedOnDark` · text `downed.time_left` with sample {time} = "0:10": en "0:10 left" · uk "Лишилось 0:10" · horizontal_alignment `CENTER`
      - Note: {time} is the bleed-out time left as m:ss, updated every second.
- **GiveUp** `PanelContainer` · variation `ToyPlate` · anchors `center_bottom`, offsets 0, -128, 0, -128 (left, top, right, bottom), grow both/begin
  - Note: Hidden while someone raises the player.
  - **V** `VBoxContainer` · variation `ToyColumnEight` · gaps from the variation: separation 8
    - **Line** `HBoxContainer` · variation `ToyRowFour` · gaps from the variation: separation 4 · alignment `ALIGNMENT_CENTER`
      - Note: tr("downed.give_up_hold") split at {key}: the words around a keycap, each piece through strip_edges() (the 4 px gap and the keycap's own padding stand in for the spaces, so the uk comma sits by the key). A piece that is empty after strip_edges() is hidden.
      - **Before** `Label` · variation `ToyTextOnDark` · size flags vertical `SIZE_SHRINK_CENTER` · text piece 0 of `tr("downed.give_up_hold")` split at {key}/{preset} (strip_edges(); hidden when the piece is empty): en "Hold" · uk "Щоб здатися, утримуй"
      - **Key** `PanelContainer` · variation `ToyKeyOnDark` · custom_minimum_size (36, 0) = Vector2(get_theme_constant("min_width", "ToyKeyOnDark"), 0)
        - **Text** `Label` · variation `ToyKeyText` · text the value of {key} in `downed.give_up_hold` with sample {key} = "F": en "F" · uk "F" · horizontal_alignment `CENTER`
          - Note: The give_up action's key: DisplayServer.keyboard_get_label_from_physical() of its binding (rebindable, #211); F by default.
      - **After** `Label` · variation `ToyTextOnDark` · size flags vertical `SIZE_SHRINK_CENTER` · text piece 1 of `tr("downed.give_up_hold")` split at {key}/{preset} (strip_edges(); hidden when the piece is empty): en "to give up" · uk ""
    - **Hold** `ProgressBar` · variation `ToyBarProgress` · size flags horizontal `SIZE_SHRINK_CENTER` · custom_minimum_size (360, 10) · value 0 of max_value 1, show_percentage false
      - Note: Fills over the 1 s hold while the give-up key is down and empties when it is released; at 1 the player gives up (dead). Empty at rest, so the plate never changes size.
    - **Pad** `Control` · custom_minimum_size (0, 4)
      - Note: An empty spacer: a bar that ends a plate gets 4 px more room under it than the plate's padding.

## `down-holding`: what differs from `down`

- **Changed** `GiveUp/V/Hold`: value 0.45 of max_value 1, show_percentage false (was: value 0 of max_value 1, show_percentage false)

## `raise`: what differs from `down`

- **Hidden:** `Downed/V/Bleed`, `Downed/V/Left`, `GiveUp`.
- **Changed** `Downed/V/Title`: text `downed.raised_by` with sample {name} = "Olena" / "Олена": en "Olena is raising you" · uk "Тебе піднімає Олена" (was: text `downed.title`: en "You're down" · uk "Тебе повалено")
- **Shown:**
  - **Downed/V/Raise** `ProgressBar` · variation `ToyBarProgress` · custom_minimum_size (600, 16) · value 0.6 of max_value 1, show_percentage false
    - Note: The raise progress (0 to 1) while a teammate holds raise; if they stop, the bleed-out bar and the time return.
  - **Downed/V/Pad** `Control` · custom_minimum_size (0, 4)
    - Note: An empty spacer: a bar that ends a plate gets 4 px more room under it than the plate's padding.

## `dead`: what differs from `down`

- **Hidden:** `Hud/Vitals`, `Downed`, `GiveUp`.
- **Shown:**
  - **Spectate** `PanelContainer` · variation `ToyPlate` · anchors `center_top`, offsets 0, 40, 0, 40 (left, top, right, bottom), grow both/end
    - Note: The only UI while dead (no timer, bars, slots, mic or arrows). The camera follows the watched player; spectate_next and spectate_previous switch (taught in the tutorial). The watched player's HUD, health and role never show; the name updates when they die.
    - **V** `VBoxContainer` · variation `ToyColumnFour` · gaps from the variation: separation 4
      - **Respawn** `Label` · variation `ToyTextMutedOnDark` · text `dead.respawn_in` with sample {time} = "0:24": en "Back in 0:24" · uk "Повернення через 0:24" · horizontal_alignment `CENTER`
        - Note: {time} is the time to respawn as m:ss.
      - **Watching** `Label` · variation `ToyTitleOnDark` · text `dead.watching` with sample {name} = "Olena" / "Олена": en "Watching: Olena" · uk "Дивишся: Олена" · horizontal_alignment `CENTER`
        - Note: {name}: the watched player's name (auto_translate_mode DISABLED on the name).

## `back`: what differs from `down`

- **Hidden:** `Downed`, `GiveUp`.
- **Changed** `Hud/Vitals/Mic/Icon`: texture `mic` (dist/pack/icons/mic.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("icon_on", "ToyMic") (was: texture `mic-off` (dist/pack/icons/mic-off.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("icon_off", "ToyMic"))
- **Shown:**
  - **Hud/Timer** `PanelContainer` · variation `ToyPlate` · anchors `center_top`, offsets 0, 40, 0, 40 (left, top, right, bottom), grow both/end
    - **Time** `Label` · variation `ToyTimer` · custom_minimum_size (140, 0) · text from data (auto_translate_mode = DISABLED), sample: "05:10" · horizontal_alignment `CENTER`
      - Note: As s7: the round's time left as mm:ss from code; the minimum width holds "44:44".
  - **Hud/Role** `PanelContainer` · variation `ToyChipPlate` · anchors `top_left`, offsets 40, 40, 40, 40 (left, top, right, bottom), grow end/end
    - **Text** `Label` · variation `ToyChipPlateText` · text `role.engineer`: en "Engineer" · uk "Інженер"
  - **Hud/Cross** `Panel` · variation `ToyCrosshair` · anchors `center`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (8, 8) = Vector2(get_theme_constant("width", "ToyCrosshair"), get_theme_constant("height", "ToyCrosshair"))
  - **Hud/Vitals/Health** `VBoxContainer` · variation `ToyColumnFour` · custom_minimum_size (320, 0) · gaps from the variation: separation 4
    - Note: Hidden while downed; full again on return.
    - **Cap** `PanelContainer` · variation `ToyBarLabel` · size flags horizontal `SIZE_SHRINK_BEGIN`
      - **Text** `Label` · variation `ToyHudCaption` · text `hud.health`: en "Health" · uk "Здоровʼя"
    - **Track** `PanelContainer` · variation `ToyBarTrack` · custom_minimum_size (320, 16) = Vector2(320, get_theme_constant("height", "ToyBarTrack"))
      - **Fill** `ProgressBar` · variation `ToyBarHealth` · custom_minimum_size (0, 10) · value 1 of max_value 1, show_percentage false · fill self_modulate = theme colour `ramp_stop_20` of `ToyBarHealth` (step = clampi(floori(hp * 20.0 + 0.5), 0, 20))
  - **Hud/Vitals/Stamina** `VBoxContainer` · variation `ToyColumnFour` · custom_minimum_size (320, 0) · gaps from the variation: separation 4
    - Note: Hidden while downed; full again on return.
    - **Cap** `PanelContainer` · variation `ToyBarLabel` · size flags horizontal `SIZE_SHRINK_BEGIN`
      - **Text** `Label` · variation `ToyHudCaption` · text `hud.stamina`: en "Stamina" · uk "Витривалість"
    - **Track** `PanelContainer` · variation `ToyBarTrack` · custom_minimum_size (320, 16) = Vector2(320, get_theme_constant("height", "ToyBarTrack"))
      - **Fill** `ProgressBar` · variation `ToyBarStamina` · custom_minimum_size (0, 10) · value 0.35 of max_value 1, show_percentage false
  - **Hud/Slots** `HBoxContainer` · variation `ToyRowTwelve` · anchors `bottom_right`, offsets -40, -40, -40, -40 (left, top, right, bottom), grow begin/begin · gaps from the variation: separation 12
    - Note: As s7; the player comes back with empty hands.
    - **Hand** `PanelContainer` · variation `ToySlotActive` · custom_minimum_size (88, 88) = Vector2(get_theme_constant("width", "ToySlotActive"), get_theme_constant("height", "ToySlotActive"))
      - **Center** `CenterContainer`
        - **Row** `HBoxContainer` · variation `ToyRowEight` · centred by its CenterContainer · gaps from the variation: separation 8
          - **Name** `Label` · variation `ToySlotTextEmpty` · size flags vertical `SIZE_SHRINK_CENTER` · text `hud.slot.hand`: en "Hand" · uk "Рука"
    - **Belt** `PanelContainer` · variation `ToySlot` · custom_minimum_size (88, 88) = Vector2(get_theme_constant("width", "ToySlot"), get_theme_constant("height", "ToySlot"))
      - **Center** `CenterContainer`
        - **Row** `HBoxContainer` · variation `ToyRowEight` · centred by its CenterContainer · gaps from the variation: separation 8
          - **Name** `Label` · variation `ToySlotTextEmpty` · size flags vertical `SIZE_SHRINK_CENTER` · text `hud.slot.belt`: en "Belt" · uk "Пояс"
  - **Protect** `PanelContainer` · variation `ToyChipLight` · anchors `center_top`, offsets 0, 144, 0, 144 (left, top, right, bottom), grow both/end
    - Note: Spawn protection: count 3, 2, 1 (one per second), then hidden. It sits 24 px under the timer plate (40 + 80 + 24).
    - **Text** `Label` · variation `ToyChipLightText` · text `respawn.protected` with sample {count} = "3": en "Protected 3 s" · uk "Захист 3 с"

## Notes

- The review page emulates Godot's containers with CSS grid (expanding children share the free space by stretch ratio, never below their minimum size), so a pixel or two may differ from Godot.
- Size constants: a variation's `width`, `height`, `min_width`, `wide_width` and `wide_min_width` theme constants are read by code into `custom_minimum_size`, as the node lines give them. A Panel or PanelContainer takes no size from them on its own: an anchored Panel at offsets 0 is 0×0, a slot shrinks to its text.
- Size constants that follow the text size: `min_width` 36 (42 in the pack's `modes.textSize.large`) of ToyKeyOnDark. The large-text theme is swapped in while a screen is open, so code that sets custom_minimum_size from such a constant sets it again on `NOTIFICATION_THEME_CHANGED`.
- Icons: the tinted ones are white SVGs in `dist/pack/icons/` (the pack's copy of `pages/components/icons`, currentColor written as white): a TextureRect tints one with the `self_modulate` its line gives (the colour the page draws it in), a Button with its variation's `icon_*_color`, an OptionButton its arrow with `modulate_arrow`. The room pictograms are white copies too (`dist/pack/icons/room/`), drawn in ink: their lines give the `self_modulate`. The pack's `assets` list every icon with its tint and `svg_scale`.
- SVG import: Godot rasterises an SVG at import, so import each at `svg/scale` = the largest size it is drawn ÷ its viewBox (the largest over every screen that draws it, as the pack's `assets` give it): `mic` 1.17 (28 px), `mic-off` 1.17 (28 px).
- Boxes and grids take their gaps only from their spacing variation (ToyColumn…, ToyRow…, ToyGrid…), and a ScrollContainer the gap to its bar from ToyScroll; a box without one has a single child. No `theme_override_constants`: the theme test forbids them.

## Keys

- **Drawn** (12): `dead.respawn_in`, `dead.watching`, `downed.give_up_hold`, `downed.raised_by`, `downed.time_left`, `downed.title`, `hud.health`, `hud.slot.belt`, `hud.slot.hand`, `hud.stamina`, `respawn.protected`, `role.engineer`.

## Layers and input (every screen)

| CanvasLayer | What |
|---|---|
| 1 | Name plates in the world (s4, s7) |
| 2 | HUD: the round HUD (s7), downed and spectating (s9), the lobby HUD (s4), the tutorial's lesson plates (s1) |
| 3 | Map and tasks (s8), with its how-to card |
| 4 | Esc menu (s5) and its dim |
| 5 | The Esc menu's confirm dialog |
| 6 | Black screens: connecting and loading (s3), pre game (s6), post game (s10) |

- The main menu (s2) is its own scene, under none of these.
- Esc closes the topmost open overlay first (a how-to card, then the map; in the Esc menu its confirm dialog, then the menu) and opens the Esc menu only when nothing else is open. M is ignored while the Esc menu is open.
