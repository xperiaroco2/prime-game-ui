# 4 · Lobby

<!-- node pages/screens/build.js --handoff s4 (prime-game-ui, pages/screens/src/s04-lobby.json); generated, do not edit by hand -->

The styled lobby screen from the UI track (xperiaroco2/prime-game-ui), as a Godot 4.7.2 node tree for the 1920×1080 reference.

- **Source:** `pages/screens/src/s04-lobby.json`; the review page is `pages/screens/screens.html#s4`; the wireframe is section `s4` («Лобі»).
- **Theme:** the Toy pack ui-0.5.0 (`dist/pack/toy.pack.json`); the variations below are `theme_type_variation` names.
- **World behind the UI** (not UI): the lobby room seen behind the main menu.
- **How to read it:** the roots are children of the screen's full-rect root `Control`; every property not listed keeps Godot's default; sizes and offsets are reference px. In a state's **Shown** list, the first node of each subtree gives its path from the screen root.
- **Texts** are keys of `copy/strings.csv`, and the language switches live (the Esc menu's Settings). A plain key is set as `text` and translates itself. A key with placeholders, a plural key (`tr_n`) and a key drawn in pieces are set from code with `auto_translate_mode = DISABLED`: `tr()`, then `String.format()` with the data (the samples below), rebuilt on `NOTIFICATION_TRANSLATION_CHANGED`. A "text from data" (names, the room code, times, numbers) is set in code and never translated (`auto_translate_mode = DISABLED`).

The lobby's HUD in the world: the mouse is captured and every node has mouse_filter IGNORE. Ready toggles on the bound ready key (control.ready, rebindable in Settings › Controls); no prompt on screen, and the Esc Lobby tab has the Ready button. The countdown starts when everyone is ready and the mode's demands are met; an un-ready stops it.

## States

| State | Page label | What it shows |
|---|---|---|
| `wait` | Очікування | A code joiner's view with the code known: three of four ready, the own row not ready. |
| `count` | Відлік | Everyone ready and the mode's demands met: the countdown runs 5, 4, 3, 2, 1. |
| `short` | Замало гравців | Fewer players than the mode needs: the status plate says how many more, instead of the ready count. |
| `code-waiting` | Код ще не готовий | The host's own view before the code service has made the room (JoinProgress.CODE_WAITING), so nobody else can be in yet: the host alone, whose row reads player.you as in s5 lobby-host; the code keycap reads "…"; when the service is gone it reads "—" and the Esc Lobby tab explains (s5 lobby-no-code). |
| `direct` | Напряму | A player who joined directly (LAN or VPN): no code row; the own row not ready. |

## Node tree in `wait`

- **Plates** `Control` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both
  - Note: The name plate layer (P6, #257), the same as s7/Plates, under the rest of the HUD: one Plate per other player in line of sight within about 10 m. Code: position = camera.unproject_position(head + 0.35 m), the plate centred on it; hidden behind walls (raycast), beyond 10 m or behind the camera. No role, no health.
  - **Plate** `PanelContainer` · variation `ToyNamePlate` · anchors `top_left`, offsets 1296, 500, 1296, 500 (left, top, right, bottom), grow both/both
    - Note: One instance per visible player, moved every frame to the projected point (the sample stands over one player). The teammate mark of s7 never shows here: roles do not exist yet in the lobby.
    - **Row** `HBoxContainer` · variation `ToyRowEight` · gaps from the variation: separation 8
      - **Name** `Label` · variation `ToyNamePlateText` · text from data (auto_translate_mode = DISABLED), sample: "Taras" / "Тарас"
        - Note: The player's name from code (auto_translate_mode DISABLED); no translated text.
- **Cross** `Panel` · variation `ToyCrosshair` · anchors `center`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (8, 8) = Vector2(get_theme_constant("width", "ToyCrosshair"), get_theme_constant("height", "ToyCrosshair"))
  - Note: The crosshair (P5), centred on the screen (its size is the variation's).
- **Status** `PanelContainer` · variation `ToyPlate` · anchors `center_top`, offsets 0, 40, 0, 40 (left, top, right, bottom), grow both/end
  - **Text** `Label` · variation `ToyPlateText` · text `lobby.waiting` with sample {count} = "3", {total} = "4": en "3 of 4 ready" · uk "Готові 3 з 4" · horizontal_alignment `CENTER`
    - Note: lobby.waiting {count} ready of {total} players; lobby.need_more (tr_n) while the lobby has fewer players than the mode needs (other unmet demands of #208 take their own keys later); during the countdown lobby.countdown in ToyTitleOnDark, once a second from 5 to 1.
- **Players** `PanelContainer` · variation `ToyPlate` · anchors `top_right`, offsets -40, 40, -40, 40 (left, top, right, bottom), grow begin/end · custom_minimum_size (400, 0)
  - Note: Rebuilt when a player joins, leaves, renames or toggles ready.
  - **V** `VBoxContainer` · variation `ToyColumnSixteen` · gaps from the variation: separation 16
    - **Info** `VBoxContainer` · variation `ToyColumnEight` · gaps from the variation: separation 8
      - **LobbyName** `Label` · variation `ToyTextMutedOnDark` · text `lobby.default_name` with sample {name} = "Olena" / "Олена": en "Olena's lobby" · uk "Лобі: Олена" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
        - Note: The lobby name the host set (#214), user text with auto_translate_mode DISABLED; lobby.default_name with the host's name while it is the default.
      - **CodeRow** `HBoxContainer` · variation `ToyRowEight` · gaps from the variation: separation 8
        - Note: The host and every player who joined with the code (M6 §3); hidden for a Direct joiner. Copy lives in the Esc Lobby tab (the mouse is captured here).
        - **Label** `Label` · variation `ToyTextMutedOnDark` · size flags vertical `SIZE_SHRINK_CENTER` · text `common.code`: en "Code" · uk "Код"
        - **Code** `PanelContainer` · variation `ToyKeyOnDark` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (36, 0) = Vector2(get_theme_constant("min_width", "ToyKeyOnDark"), 0)
          - **Text** `Label` · variation `ToyKeyText` · text from data (auto_translate_mode = DISABLED), sample: "K7Q2XR" · horizontal_alignment `CENTER`
            - Note: The room code (auto_translate_mode DISABLED); "…" while the code service has not made the room (CODE_WAITING), "—" when the service is gone.
    - **List** `VBoxContainer` · variation `ToyColumnEight` · gaps from the variation: separation 8
      - **Head** `Label` · variation `ToyTextOnDark` · text `lobby.player_count` with sample {count} = "4", {total} = "10": en "Players 4 / 10" · uk "Гравці 4 / 10"
        - Note: Players in the lobby / the lobby's limit.
      - **Rows** `VBoxContainer` · variation `ToyColumnEight` · gaps from the variation: separation 8
        - Note: One row per player in join order, the host first. Name expands; Ready shows the check while that player is ready and hides otherwise (an empty mark, not a dash).
        - **HostRow** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
          - **Name** `Label` · variation `ToyTextOnDark` · size flags horizontal `SIZE_EXPAND_FILL` · text `lobby.host_mark` with sample {name} = "Olena" / "Олена": en "Olena · host" · uk "Олена · хост" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
            - Note: The host's row: lobby.host_mark with the name (auto_translate_mode DISABLED on the name), seen by the other players; on the host's own client it reads player.you, as every own row does.
          - **Ready** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (24, 24) · texture `check` (dist/pack/icons/check.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToyTextOnDark")
        - **Row2** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
          - **Name** `Label` · variation `ToyTextOnDark` · size flags horizontal `SIZE_EXPAND_FILL` · text from data (auto_translate_mode = DISABLED), sample: "Taras" / "Тарас" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
            - Note: Another player's row: the name only (auto_translate_mode DISABLED).
          - **Ready** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (24, 24) · texture `check` (dist/pack/icons/check.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToyTextOnDark")
        - **OwnRow** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
          - **Name** `Label` · variation `ToyTextOnDark` · size flags horizontal `SIZE_EXPAND_FILL` · text `player.you`: en "You" · uk "Ти" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
            - Note: The own row reads player.you.
        - **Row4** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
          - **Name** `Label` · variation `ToyTextOnDark` · size flags horizontal `SIZE_EXPAND_FILL` · text from data (auto_translate_mode = DISABLED), sample: "Marko" / "Марко" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
          - **Ready** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (24, 24) · texture `check` (dist/pack/icons/check.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToyTextOnDark")
- **Bottom** `VBoxContainer` · variation `ToyColumnTwelve` · anchors `bottom_left`, offsets 40, -40, 40, -40 (left, top, right, bottom), grow end/begin · gaps from the variation: separation 12
  - **ReadyChip** `PanelContainer` · variation `ToyChipPlate` · size flags horizontal `SIZE_SHRINK_BEGIN`
    - Note: The own ready state: ToyChipPlate with lobby.ready_no while not ready, ToyChipLight with lobby.ready_yes while ready.
    - **Text** `Label` · variation `ToyChipPlateText` · text `lobby.ready_no`: en "Ready: no" · uk "Готовність: ні"
  - **Mic** `PanelContainer` · variation `ToyMic` · size flags horizontal `SIZE_SHRINK_BEGIN` · custom_minimum_size (46, 46) = Vector2(get_theme_constant("width", "ToyMic"), get_theme_constant("height", "ToyMic"))
    - Note: The mic (P4): mic.svg in icon_on while anybody can hear the player, mic-off.svg in icon_off when nobody does (mic off, push-to-talk released).
    - **Icon** `TextureRect` · size flags horizontal `SIZE_SHRINK_CENTER`, vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (28, 28) · texture `mic` (dist/pack/icons/mic.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("icon_on", "ToyMic")

## `count`: what differs from `wait`

- **Changed** `Status/Text`: variation `ToyTitleOnDark` · text `lobby.countdown` with sample {count} = "5": en "Starting in 5" · uk "Старт через 5" (was: variation `ToyPlateText` · text `lobby.waiting` with sample {count} = "3", {total} = "4": en "3 of 4 ready" · uk "Готові 3 з 4")
- **Changed** `Bottom/ReadyChip`: variation `ToyChipLight` (was: variation `ToyChipPlate`)
- **Changed** `Bottom/ReadyChip/Text`: variation `ToyChipLightText` · text `lobby.ready_yes`: en "Ready: yes" · uk "Готовність: так" (was: variation `ToyChipPlateText` · text `lobby.ready_no`: en "Ready: no" · uk "Готовність: ні")
- **Shown:**
  - **Players/V/List/Rows/OwnRow/Ready** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (24, 24) · texture `check` (dist/pack/icons/check.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToyTextOnDark")

## `short`: what differs from `wait`

- **Hidden:** `Players/V/List/Rows/Row4`.
- **Changed** `Status/Text`: text `tr_n("lobby.need_more", "lobby.need_more", 1)`: en "1 more player to start" · uk "Ще 1 гравець до старту" (was: text `lobby.waiting` with sample {count} = "3", {total} = "4": en "3 of 4 ready" · uk "Готові 3 з 4")
- **Changed** `Players/V/List/Head`: text `lobby.player_count` with sample {count} = "3", {total} = "10": en "Players 3 / 10" · uk "Гравці 3 / 10" (was: text `lobby.player_count` with sample {count} = "4", {total} = "10": en "Players 4 / 10" · uk "Гравці 4 / 10")

## `code-waiting`: what differs from `wait`

- **Hidden:** `Plates/Plate`, `Players/V/List/Rows/HostRow/Ready`, `Players/V/List/Rows/Row2`, `Players/V/List/Rows/OwnRow`, `Players/V/List/Rows/Row4`.
- **Changed** `Status/Text`: text `tr_n("lobby.need_more", "lobby.need_more", 3)`: en "3 more players to start" · uk "Ще 3 гравці до старту" (was: text `lobby.waiting` with sample {count} = "3", {total} = "4": en "3 of 4 ready" · uk "Готові 3 з 4")
- **Changed** `Players/V/Info/CodeRow/Code/Text`: text from data (auto_translate_mode = DISABLED), sample: "…" (was: text from data (auto_translate_mode = DISABLED), sample: "K7Q2XR")
- **Changed** `Players/V/List/Head`: text `lobby.player_count` with sample {count} = "1", {total} = "10": en "Players 1 / 10" · uk "Гравці 1 / 10" (was: text `lobby.player_count` with sample {count} = "4", {total} = "10": en "Players 4 / 10" · uk "Гравці 4 / 10")
- **Changed** `Players/V/List/Rows/HostRow/Name`: text `player.you`: en "You" · uk "Ти" (was: text `lobby.host_mark` with sample {name} = "Olena" / "Олена": en "Olena · host" · uk "Олена · хост")

## `direct`: what differs from `wait`

- **Hidden:** `Players/V/Info/CodeRow`.

## Notes

- The review page emulates Godot's containers with CSS grid (expanding children share the free space by stretch ratio, never below their minimum size), so a pixel or two may differ from Godot.
- Size constants: a variation's `width`, `height`, `min_width`, `wide_width` and `wide_min_width` theme constants are read by code into `custom_minimum_size`, as the node lines give them. A Panel or PanelContainer takes no size from them on its own: an anchored Panel at offsets 0 is 0×0, a slot shrinks to its text.
- Size constants that follow the text size: `min_width` 36 (42 in the pack's `modes.textSize.large`) of ToyKeyOnDark. The large-text theme is swapped in while a screen is open, so code that sets custom_minimum_size from such a constant sets it again on `NOTIFICATION_THEME_CHANGED`.
- Icons: the tinted ones are white SVGs in `dist/pack/icons/` (the pack's copy of `pages/components/icons`, currentColor written as white): a TextureRect tints one with the `self_modulate` its line gives (the colour the page draws it in), a Button with its variation's `icon_*_color`, an OptionButton its arrow with `modulate_arrow`. The room pictograms are white copies too (`dist/pack/icons/room/`), drawn in ink: their lines give the `self_modulate`. The pack's `assets` list every icon with its tint and `svg_scale`.
- SVG import: Godot rasterises an SVG at import, so import each at `svg/scale` = the largest size it is drawn ÷ its viewBox (the largest over every screen that draws it, as the pack's `assets` give it): `check` 1 (24 px), `mic` 1.17 (28 px).
- Boxes and grids take their gaps only from their spacing variation (ToyColumn…, ToyRow…, ToyGrid…), and a ScrollContainer the gap to its bar from ToyScroll; a box without one has a single child. No `theme_override_constants`: the theme test forbids them.

## Keys

- **Drawn** (10): `common.code`, `lobby.countdown`, `lobby.default_name`, `lobby.host_mark`, `lobby.need_more`, `lobby.player_count`, `lobby.ready_no`, `lobby.ready_yes`, `lobby.waiting`, `player.you`.
- **Named only in the notes** (wire them too): `control.ready`.

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
