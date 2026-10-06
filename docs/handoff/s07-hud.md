# 7 · Round HUD

<!-- node pages/screens/build.js --handoff s7 (prime-game-ui, pages/screens/src/s07-hud.json); generated, do not edit by hand -->

The styled round hud screen from the UI track (xperiaroco2/prime-game-ui), as a Godot 4.7.2 node tree for the 1920×1080 reference.

- **Source:** `pages/screens/src/s07-hud.json`; the review page is `pages/screens/screens.html#s7`; the wireframe is section `s7` («HUD у раунді»).
- **Theme:** the Toy pack ui-0.2.0 (`dist/pack/toy.pack.json`); the variations below are `theme_type_variation` names.
- **World behind the UI** (not UI): a lit room of the level.
- **How to read it:** the roots are children of the screen's full-rect root `Control`; every property not listed keeps Godot's default; sizes and offsets are reference px. In a state's **Shown** list, the first node of each subtree gives its path from the screen root.
- **Texts** are keys of `copy/strings.csv`, and the language switches live (the Esc menu's Settings). A plain key is set as `text` and translates itself. A key with placeholders, a plural key (`tr_n`) and a key drawn in pieces are set from code with `auto_translate_mode = DISABLED`: `tr()`, then `String.format()` with the data (the samples below), rebuilt on `NOTIFICATION_TRANSLATION_CHANGED`. A "text from data" (names, the room code, times, numbers) is set in code and never translated (`auto_translate_mode = DISABLED`).

One HUD for the whole round; s9 hides and returns the same nodes (Hud/Timer, Hud/Vitals/Health, Hud/Vitals/Stamina, Hud/Vitals/Mic, Hud/Slots). Every node has mouse_filter IGNORE. The HUD never shows keys, walking or running, a player list, who knocked the player down, a destination or task progress. HUD edges sit 40 px in.

## States

| State | Page label | What it shows |
|---|---|---|
| `empty` | Порожні руки | Nothing carried; the crosshair is on a package within reach. |
| `pack` | Несеш пакунок | Carrying a package with both hands: the hand slot widens; the package's room sign is on the 3D package only, the slot never repeats it. |
| `tired` | Мало сил | Stamina at 0.18. |
| `hurt` | Мало здоровʼя | Health at 0.22 (ramp stop 04). |
| `mate` | Дисидент бачить команду | A dissident with a knife on the belt sees a teammate's name plate with the teammate mark. |
| `raising` | Підняття | Decided by the engineer (2026-10-06, the wave-19 question page, q9): what the raiser sees while holding Interact next to a downed teammate. A thin progress bar under the crosshair in place of the object name, filling at the same rate as the downed player's raise bar (s9 raise); no text. |

## Node tree in `empty`

- **Plates** `Control` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both
  - Note: The name plate layer (#257), under the rest of the HUD: one Plate per other player in line of sight within about 10 m. Code: position = camera.unproject_position(head + 0.35 m), the plate centred on it; hidden behind walls (raycast), beyond 10 m or behind the camera. No role, no health.
- **Hud** `Control` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both
  - **Timer** `PanelContainer` · variation `ToyPlate` · anchors `center_top`, offsets 0, 40, 0, 40 (left, top, right, bottom), grow both/end
    - **Time** `Label` · variation `ToyTimer` · custom_minimum_size (140, 0) · text from data (auto_translate_mode = DISABLED), sample: "07:22" · horizontal_alignment `CENTER`
      - Note: The round's time left as mm:ss from code (auto_translate_mode DISABLED), updated every second. Comfortaa's digits are proportional (4 is the widest), so the minimum width holds the widest time, "44:44" (134.8 px): the centred plate never changes width as the seconds tick. ToyTimer is 48 px, which large text leaves unchanged. s6 after and s9 back use the same node.
  - **Role** `PanelContainer` · variation `ToyChipPlate` · anchors `top_left`, offsets 40, 40, 40, 40 (left, top, right, bottom), grow end/end
    - **Text** `Label` · variation `ToyChipPlateText` · text `role.engineer`: en "Engineer" · uk "Інженер"
      - Note: The player's own role for the round: role.engineer or role.dissident.
  - **Cross** `Panel` · variation `ToyCrosshair` · anchors `center`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (8, 8) = Vector2(get_theme_constant("width", "ToyCrosshair"), get_theme_constant("height", "ToyCrosshair"))
    - Note: The crosshair dot, centred on the screen (its size is the variation's).
  - **Aim** `PanelContainer` · variation `ToyChipPlate` · anchors `center`, offsets 0, 38, 0, 38 (left, top, right, bottom), grow both/both
    - Note: The name of the object under the crosshair within reach (item.package, item.knife, item.switch); hidden when nothing within reach is under the crosshair.
    - **Text** `Label` · variation `ToyChipPlateText` · text `item.package`: en "Package" · uk "Пакунок"
  - **Vitals** `VBoxContainer` · variation `ToyColumnTwelve` · anchors `bottom_left`, offsets 40, -40, 40, -40 (left, top, right, bottom), grow end/begin · gaps from the variation: separation 12
    - **Health** `VBoxContainer` · variation `ToyColumnFour` · custom_minimum_size (320, 0) · gaps from the variation: separation 4
      - Note: Always shown in a round. No numbers: the bar's length is the real cue, the colour only adds to it.
      - **Cap** `PanelContainer` · variation `ToyBarLabel` · size flags horizontal `SIZE_SHRINK_BEGIN`
        - **Text** `Label` · variation `ToyHudCaption` · text `hud.health`: en "Health" · uk "Здоровʼя"
      - **Track** `PanelContainer` · variation `ToyBarTrack` · custom_minimum_size (320, 16) = Vector2(320, get_theme_constant("height", "ToyBarTrack"))
        - **Fill** `ProgressBar` · variation `ToyBarHealth` · custom_minimum_size (0, 10) · value 0.8 of max_value 1, show_percentage false · fill self_modulate = theme colour `ramp_stop_16` of `ToyBarHealth` (step = clampi(floori(hp * 20.0 + 0.5), 0, 20))
          - Note: value = hp (0 to 1). The fill colour follows the fraction: step = clampi(floori(hp * 20.0 + 0.5), 0, 20), Fill.self_modulate = get_theme_color("ramp_stop_%02d" % step, "ToyBarHealth").
    - **Stamina** `VBoxContainer` · variation `ToyColumnFour` · custom_minimum_size (320, 0) · gaps from the variation: separation 4
      - Note: Always shown in a round; drains while sprinting and refills at rest.
      - **Cap** `PanelContainer` · variation `ToyBarLabel` · size flags horizontal `SIZE_SHRINK_BEGIN`
        - **Text** `Label` · variation `ToyHudCaption` · text `hud.stamina`: en "Stamina" · uk "Витривалість"
      - **Track** `PanelContainer` · variation `ToyBarTrack` · custom_minimum_size (320, 16) = Vector2(320, get_theme_constant("height", "ToyBarTrack"))
        - **Fill** `ProgressBar` · variation `ToyBarStamina` · custom_minimum_size (0, 10) · value 0.9 of max_value 1, show_percentage false
          - Note: value = stamina (0 to 1).
    - **Mic** `PanelContainer` · variation `ToyMic` · size flags horizontal `SIZE_SHRINK_BEGIN` · custom_minimum_size (46, 46) = Vector2(get_theme_constant("width", "ToyMic"), get_theme_constant("height", "ToyMic"))
      - Note: Whether anyone hears the player. On: mic.svg tinted icon_on. Off (mic off, push-to-talk released, downed, pre and post game): mic-off.svg tinted icon_off (coral).
      - **Icon** `TextureRect` · size flags horizontal `SIZE_SHRINK_CENTER`, vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (28, 28) · texture `mic` (dist/pack/icons/mic.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("icon_on", "ToyMic")
  - **Slots** `HBoxContainer` · variation `ToyRowTwelve` · anchors `bottom_right`, offsets -40, -40, -40, -40 (left, top, right, bottom), grow begin/begin · gaps from the variation: separation 12
    - Note: One slot pattern for both: empty shows the slot's name; a one-handed item shows only its icon (48 px); a two-handed item widens the hand slot and shows its icon and name.
    - **Hand** `PanelContainer` · variation `ToySlotActive` · custom_minimum_size (88, 88) = Vector2(get_theme_constant("width", "ToySlotActive"), get_theme_constant("height", "ToySlotActive"))
      - Note: Always the active slot. Two-handed carry (a package) uses the slot's wide width.
      - **Center** `CenterContainer`
        - **Row** `HBoxContainer` · variation `ToyRowEight` · centred by its CenterContainer · gaps from the variation: separation 8
          - **Name** `Label` · variation `ToySlotTextEmpty` · size flags vertical `SIZE_SHRINK_CENTER` · text `hud.slot.hand`: en "Hand" · uk "Рука"
            - Note: Shown only while the hand is empty: hud.slot.hand.
    - **Belt** `PanelContainer` · variation `ToySlot` · custom_minimum_size (88, 88) = Vector2(get_theme_constant("width", "ToySlot"), get_theme_constant("height", "ToySlot"))
      - **Center** `CenterContainer`
        - **Row** `HBoxContainer` · variation `ToyRowEight` · centred by its CenterContainer · gaps from the variation: separation 8
          - **Name** `Label` · variation `ToySlotTextEmpty` · size flags vertical `SIZE_SHRINK_CENTER` · text `hud.slot.belt`: en "Belt" · uk "Пояс"
            - Note: Empty: hud.slot.belt. Hidden while the belt holds a one-handed item.

## `pack`: what differs from `empty`

- **Hidden:** `Hud/Aim`, `Hud/Slots/Hand/Center/Row/Name`.
- **Changed** `Hud/Slots/Hand`: custom_minimum_size (180, 88) = Vector2(get_theme_constant("wide_width", "ToySlotActive"), get_theme_constant("height", "ToySlotActive")) (wide) (was: custom_minimum_size (88, 88) = Vector2(get_theme_constant("width", "ToySlotActive"), get_theme_constant("height", "ToySlotActive")))
- **Shown:**
  - **Hud/Slots/Hand/Center/Row/Icon** `TextureRect` · custom_minimum_size (48, 48) · texture `item` (dist/pack/icons/item.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToyTextOnDark")
    - Note: The hand slot's item icon (the package here).
  - **Hud/Slots/Hand/Center/Row/ItemName** `Label` · variation `ToySlotText` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (106, 0) · text `item.package`: en "Package" · uk "Пакунок" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
    - Note: Shown only while carrying a two-handed item: its name (item.package here). Its own node, so the empty slot keeps its 88 px: 106 = 180 (wide width) - 2 x 9 (content margins) - 48 (Icon) - 8 (gap). A longer name is cut with an ellipsis. One-handed item: both labels hidden.

## `tired`: what differs from `empty`

- **Changed** `Hud/Vitals/Stamina/Track/Fill`: value 0.18 of max_value 1, show_percentage false (was: value 0.9 of max_value 1, show_percentage false)

## `hurt`: what differs from `empty`

- **Changed** `Hud/Vitals/Health/Track/Fill`: value 0.22 of max_value 1, show_percentage false · fill self_modulate = theme colour `ramp_stop_04` of `ToyBarHealth` (step = clampi(floori(hp * 20.0 + 0.5), 0, 20)) (was: value 0.8 of max_value 1, show_percentage false · fill self_modulate = theme colour `ramp_stop_16` of `ToyBarHealth` (step = clampi(floori(hp * 20.0 + 0.5), 0, 20)))

## `mate`: what differs from `empty`

- **Hidden:** `Hud/Aim`, `Hud/Slots/Belt/Center/Row/Name`.
- **Changed** `Hud/Role/Text`: text `role.dissident`: en "Dissident" · uk "Дисидент" (was: text `role.engineer`: en "Engineer" · uk "Інженер")
- **Shown:**
  - **Plates/Plate** `PanelContainer` · variation `ToyNamePlate` · anchors `top_left`, offsets 538, 302, 538, 302 (left, top, right, bottom), grow both/both
    - Note: One instance per visible player, moved every frame to the projected point (the sample sits over a teammate at about 538, 302).
    - **Row** `HBoxContainer` · variation `ToyRowEight` · gaps from the variation: separation 8
      - **Name** `Label` · variation `ToyNamePlateText` · text from data (auto_translate_mode = DISABLED), sample: "Taras" / "Тарас"
        - Note: The player's name from code (auto_translate_mode DISABLED); no translated text.
      - **Mark** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (20, 20) · texture `teammate-mark` (dist/pack/icons/teammate-mark.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToyTextOnDark")
        - Note: Only on a dissident's client and only for a teammate.
  - **Hud/Slots/Belt/Center/Row/Icon** `TextureRect` · custom_minimum_size (48, 48) · texture `knife` (dist/pack/icons/knife.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToyTextOnDark")
    - Note: The belt slot's item icon: a one-handed item shows only its icon (the knife here).

## `raising`: what differs from `empty`

- **Hidden:** `Hud/Aim`.
- **Shown:**
  - **Hud/Raising** `PanelContainer` · variation `ToyPlate` · anchors `center`, offsets 0, 38, 0, 38 (left, top, right, bottom), grow both/both
    - Note: See the state raising. Shown while the player holds Interact on a downed teammate, in place of Aim; hidden when the key is released or the teammate is up.
    - **Bar** `ProgressBar` · variation `ToyBarProgress` · custom_minimum_size (240, 10) · value 0.6 of max_value 1, show_percentage false
      - Note: The raise progress (0 to 1), the same value the downed player's s9 Downed/V/Raise shows.

## Notes

- The review page emulates Godot's containers with CSS grid (expanding children share the free space by stretch ratio, never below their minimum size), so a pixel or two may differ from Godot.
- Size constants: a variation's `width`, `height`, `min_width`, `wide_width` and `wide_min_width` theme constants are read by code into `custom_minimum_size`, as the node lines give them. A Panel or PanelContainer takes no size from them on its own: an anchored Panel at offsets 0 is 0×0, a slot shrinks to its text.
- Icons: the tinted ones are white SVGs in `dist/pack/icons/` (the pack's copy of `pages/components/icons`, currentColor written as white): a TextureRect tints one with the `self_modulate` its line gives (the colour the page draws it in), a Button with its variation's `icon_*_color`, an OptionButton its arrow with `modulate_arrow`. The room pictograms are ink and are not tinted.
- SVG import: Godot rasterises an SVG at import, so import each at `svg/scale` = the largest size it is drawn ÷ its viewBox (the largest over every screen that draws it): `item` 2 (48 px), `knife` 1 (48 px), `mic` 1.17 (28 px), `teammate-mark` 0.84 (20 px).
- Boxes and grids take their gaps only from their spacing variation (ToyColumn…, ToyRow…, ToyGrid…), and a ScrollContainer the gap to its bar from ToyScroll; a box without one has a single child. No `theme_override_constants`: the theme test forbids them.

## Keys

- **Drawn** (7): `hud.health`, `hud.slot.belt`, `hud.slot.hand`, `hud.stamina`, `item.package`, `role.dissident`, `role.engineer`.
- **Named only in the notes** (wire them too): `item.knife`, `item.switch`.

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
