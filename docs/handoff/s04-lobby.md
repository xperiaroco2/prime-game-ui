# 4 · Lobby

<!-- node pages/screens/build.js --handoff s4 (prime-game-ui, pages/screens/src/s04-lobby.json); generated, do not edit by hand -->

The styled lobby screen from the UI track (xperiaroco2/prime-game-ui), as a Godot 4.7.2 node tree for the 1920×1080 reference.

- **Source:** `pages/screens/src/s04-lobby.json`; the review page is `pages/screens/screens.html#s4`; the wireframe is section `s4` («Лобі»).
- **Theme:** the Toy pack ui-2.5.3 (`dist/pack/toy.pack.json`); the variations below are `theme_type_variation` names.
- **World behind the UI** (not UI): the ship (the lobby room) seen behind a menu.
- **How to read it:** the roots are children of the screen's full-rect root `Control`; every property not listed keeps Godot's default; sizes and offsets are reference px. In a state's **Shown** list, the first node of each subtree gives its path from the screen root.
- **Texts** are keys of `copy/strings.csv`, and the language switches live (the Esc menu's Settings). A plain key is set as `text` and translates itself. A key with placeholders, a plural key (`tr_n`) and a key drawn in pieces are set from code with `auto_translate_mode = DISABLED`: `tr()`, then `String.format()` with the data (the samples below), rebuilt on `NOTIFICATION_TRANSLATION_CHANGED`. A "text from data" (names, the room code, times, numbers) is set in code and never translated (`auto_translate_mode = DISABLED`).

The ship is the lobby (the target page pages/suit-final, frames 1, 3 and 3b): the game boots into the aliens' ship and the player walks around it; the HUD over the world is thin and calm. The mouse is captured and every HUD node has mouse_filter IGNORE. In a session the HUD is the ready count at the top centre, the roster at the top right (the host mark and a ready pip per player), the own ready state and the mic at the bottom left. Ready toggles on the bound ready key (control.ready, rebindable in Settings › Controls). The countdown starts when everyone is ready and the mode's demands are met; an un-ready stops it. The match settings are no tab of the Esc menu: they are a screen on the ship's console (Console below), a SubViewport scene as the workbench s11 is, shown on the console's mesh to whoever stands near it; the host edits it with the crosshair, everyone else reads it. How the trip maps onto Lobby, Countdown, Loading and Pregame is open (the engineer's design).

## States

| State | Page label | What it shows |
|---|---|---|
| `boot` | Старт | The game has just loaded into the ship with no session: no HUD but a small hint at the bottom left (the target's frame 1). Esc opens the suit menu (s5 ship), where the player hosts or joins. |
| `wait` | Очікування | A code joiner's view (Zinga) in a lobby of six: four ready, the own player among them. The two players in sight carry their name plates. |
| `count` | Відлік | Everyone ready and the mode's demands met: the countdown runs 5, 4, 3, 2, 1 in the same plate, every pip full. |
| `short` | Замало гравців | Fewer players than the mode needs: the plate says how many more, instead of the ready count, and its pips hide. The own player not ready. |
| `console-host` | Пульт: хост | The host (Olena) at the console (the target's frame 3b): the console's screen, the SubViewport scene Console, drawn at its 960 x 540 where the player looks, with the HUD over the world. The crosshair is on the lower right of the humans' minus, clear of its icon, so the button hovers (pushed mouse motion, as in s11). |
| `console-guest` | Пульт: гравець | Another player (Zinga) reading the console: the same screen without steppers or choices, values only, and the lock line naming the host. |

## Node tree in `boot`

- **Bottom** `HBoxContainer` · variation `ToyRowSixteen` · anchors `bottom_left`, offsets 36, -36, 36, -36 (left, top, right, bottom), grow end/begin · gaps from the variation: separation 16
  - **Hint** `PanelContainer` · variation `ToyPlate` · size flags vertical `SIZE_SHRINK_END`
    - Note: The only UI at the boot (the target's frame 1): the key that opens the suit menu. Hidden once a session starts. Its word is tutorial.list.menu, the controls list's «Меню» (the target's draft is «меню»).
    - **Row** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
      - **Key** `PanelContainer` · variation `ToyKeyOnDark` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (42, 0) = Vector2(get_theme_constant("min_width", "ToyKeyOnDark"), 0)
        - **Text** `Label` · variation `ToyKeyText` · text from data (auto_translate_mode = DISABLED), sample: "Esc" · horizontal_alignment `CENTER`
          - Note: The bound key's label (ui_cancel, auto_translate_mode DISABLED).
      - **Text** `Label` · variation `ToyPlateTextMuted` · size flags vertical `SIZE_SHRINK_CENTER` · text `tutorial.list.menu`: en "Menu" · uk "Меню"

## `wait`: what differs from `boot`

- **Hidden:** `Bottom/Hint`.
- **Shown:**
  - **Plates** `Control` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both
    - Note: The name plate layer (P6, #257), the same as s7/Plates, under the rest of the HUD: one Plate per other player in line of sight within about 10 m. Code: position = camera.unproject_position(head + 0.35 m), the plate centred on it; hidden behind walls (raycast), beyond 10 m or behind the camera. No role, no health. Not drawn in the console frames, where the screen fills the view.
    - **Glorp** `PanelContainer` · variation `ToyNamePlate` · anchors `top_left`, offsets 1026, 408, 1026, 408 (left, top, right, bottom), grow both/both
      - Note: One instance per visible player, moved every frame to the projected point (the samples stand over two players, as on the target). The teammate mark of s7 never shows here: roles do not exist yet in the lobby.
      - **Name** `Label` · variation `ToyNamePlateText` · text from data (auto_translate_mode = DISABLED), sample: "Glorp" / "Глорп"
        - Note: The player's name from code (auto_translate_mode DISABLED); no translated text.
    - **Bulk** `PanelContainer` · variation `ToyNamePlate` · anchors `top_left`, offsets 1258, 453, 1258, 453 (left, top, right, bottom), grow both/both
      - **Name** `Label` · variation `ToyNamePlateText` · text from data (auto_translate_mode = DISABLED), sample: "Bulk" / "Бульк"
  - **Cross** `Panel` · variation `ToyCrosshair` · anchors `center`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (12, 12) = Vector2(get_theme_constant("width", "ToyCrosshair"), get_theme_constant("height", "ToyCrosshair"))
    - Note: The crosshair (P5), centred on the screen (its size is the variation's); over the console it is what the host points with. Not drawn at the boot (the target's frame 1 has no UI but the hint).
  - **Status** `PanelContainer` · variation `ToyPlate` · anchors `center_top`, offsets 0, 36, 0, 36 (left, top, right, bottom), grow both/end · custom_minimum_size (360, 66)
    - Note: The ready plate (the target's .wait): the count at the left, one pip per player at the right, the ready ones full and first. 360 x 66 (the target's 240 x 44 x 1.5).
    - **Row** `HBoxContainer` · variation `ToyRowTwentyFour` · gaps from the variation: separation 24
      - **Text** `Label` · variation `ToyPlateText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `lobby.waiting` with sample {count} = "4", {total} = "6": en "4 of 6 ready" · uk "Готові 4 з 6"
        - Note: lobby.waiting {count} ready of {total} players; lobby.need_more (tr_n) while the lobby has fewer players than the mode needs (other unmet demands of #208 take their own keys later); during the countdown lobby.countdown, once a second from 5 to 1, in the same calm text (agent).
      - **Pips** `HBoxContainer` · variation `ToyRowFour` · size flags vertical `SIZE_SHRINK_CENTER` · gaps from the variation: separation 4
        - Note: One pip per player in the lobby (up to 10): ToyPipHealth for each ready player, ToyPip for the rest (the suit's pips). Hidden while the plate says how many more players are needed.
        - **P1** `Panel` · variation `ToyPipHealth` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
        - **P2** `Panel` · variation `ToyPipHealth` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
        - **P3** `Panel` · variation `ToyPipHealth` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
        - **P4** `Panel` · variation `ToyPipHealth` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
        - **P5** `Panel` · variation `ToyPip` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPip"), get_theme_constant("height", "ToyPip"))
        - **P6** `Panel` · variation `ToyPip` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPip"), get_theme_constant("height", "ToyPip"))
  - **Players** `PanelContainer` · variation `ToyRoster` · anchors `top_right`, offsets -36, 36, -36, 36 (left, top, right, bottom), grow begin/end · custom_minimum_size (330, 0) = Vector2(330, 0)
    - Note: The roster as in the round (s7/Roster), with a ready pip per row. Rebuilt when a player joins, leaves, renames or toggles ready. 330 px wide (the target's 184 x 1.5 = 276, widened so «Олена · хост» fits at large text); a long name is cut with an ellipsis.
    - **Rows** `VBoxContainer` · variation `ToyColumnEight` · gaps from the variation: separation 8
      - **Head** `Label` · variation `ToyKicker` · text `lobby.player_count` with sample {count} = "6", {total} = "10": en "Players 6 / 10" · uk "Гравці 6 / 10"
        - Note: Players in the lobby / the lobby's limit, the tile's head (the target's .tab «ГРАВЦІ 6 / 10»; the game sets uppercase = true).
      - **Host** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
        - **Dot** `Panel` · variation `ToyRosterDot` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (15, 15) = Vector2(get_theme_constant("width", "ToyRosterDot"), get_theme_constant("height", "ToyRosterDot")) · self_modulate from data (a content colour, not a theme colour), sample #7C5CC8
        - **Name** `Label` · variation `ToyRosterName` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Olena" / "Олена" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
          - Note: One row per player in join order, the host first: the body colour, the name, the host tag on the host's row, the ready pip. Names are user text (auto_translate_mode DISABLED).
        - **HostTag** `PanelContainer` · variation `ToyRosterTagHost` · size flags vertical `SIZE_SHRINK_CENTER`
          - Note: The host tag (the target's quiet «ХОСТ»; hud.roster.host, the engineer's copy round 9), on the host's row only.
          - **Text** `Label` · variation `ToyRosterTagHostText` · text `hud.roster.host`: en "host" · uk "хост"
        - **Ready** `Panel` · variation `ToyPipHealth` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
          - Note: ToyPipHealth while that player is ready, ToyPip while not.
      - **Glorp** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
        - **Dot** `Panel` · variation `ToyRosterDot` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (15, 15) = Vector2(get_theme_constant("width", "ToyRosterDot"), get_theme_constant("height", "ToyRosterDot")) · self_modulate from data (a content colour, not a theme colour), sample #1C7A82
        - **Name** `Label` · variation `ToyRosterName` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Glorp" / "Глорп" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
        - **Ready** `Panel` · variation `ToyPipHealth` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
      - **Yizhak** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
        - **Dot** `Panel` · variation `ToyRosterDot` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (15, 15) = Vector2(get_theme_constant("width", "ToyRosterDot"), get_theme_constant("height", "ToyRosterDot")) · self_modulate from data (a content colour, not a theme colour), sample #E66B57
        - **Name** `Label` · variation `ToyRosterName` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Yizhak" / "Їжак" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
        - **Ready** `Panel` · variation `ToyPip` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPip"), get_theme_constant("height", "ToyPip"))
      - **Bulk** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
        - **Dot** `Panel` · variation `ToyRosterDot` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (15, 15) = Vector2(get_theme_constant("width", "ToyRosterDot"), get_theme_constant("height", "ToyRosterDot")) · self_modulate from data (a content colour, not a theme colour), sample #E8B04A
        - **Name** `Label` · variation `ToyRosterName` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Bulk" / "Бульк" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
        - **Ready** `Panel` · variation `ToyPipHealth` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
      - **Self** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
        - **Dot** `Panel` · variation `ToyRosterDot` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (15, 15) = Vector2(get_theme_constant("width", "ToyRosterDot"), get_theme_constant("height", "ToyRosterDot")) · self_modulate from data (a content colour, not a theme colour), sample #4AA3DF
        - **Name** `Label` · variation `ToyRosterNameSelf` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `hud.roster.self` with sample {name} = "Zinga" / "Зінга": en "Zinga (you)" · uk "Зінга (ти)" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
        - **Ready** `Panel` · variation `ToyPipHealth` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
      - **Taras** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
        - **Dot** `Panel` · variation `ToyRosterDot` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (15, 15) = Vector2(get_theme_constant("width", "ToyRosterDot"), get_theme_constant("height", "ToyRosterDot")) · self_modulate from data (a content colour, not a theme colour), sample #D46FB0
        - **Name** `Label` · variation `ToyRosterName` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Taras" / "Тарас" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
        - **Ready** `Panel` · variation `ToyPip` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPip"), get_theme_constant("height", "ToyPip"))
  - **Bottom/Ready** `PanelContainer` · variation `ToyPlate` · size flags vertical `SIZE_SHRINK_END`
    - Note: The own ready state (the target's .rdy): a calm tile with the ready pip and the words, ToyPipHealth with lobby.ready_yes while ready, ToyPip with lobby.ready_no while not.
    - **Row** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
      - **Pip** `Panel` · variation `ToyPipHealth` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
      - **Text** `Label` · variation `ToyPlateText` · size flags vertical `SIZE_SHRINK_CENTER` · text `lobby.ready_yes`: en "Ready: yes" · uk "Готовність: так"
  - **Bottom/Mic** `PanelContainer` · variation `ToyMic` · size flags vertical `SIZE_SHRINK_END` · custom_minimum_size (75, 75) = Vector2(get_theme_constant("width", "ToyMic"), get_theme_constant("height", "ToyMic"))
    - Note: The mic (P4): mic.svg in icon_on while anybody can hear the player, mic-off.svg in icon_off when nobody does. The target's lobby frame has no mic; it stays beside the ready tile (agent).
    - **Icon** `TextureRect` · size flags horizontal `SIZE_SHRINK_CENTER`, vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (42, 42) · texture `mic` (dist/pack/icons/mic.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("icon_on", "ToyMic")

## `count`: what differs from `boot`

- **Hidden:** `Bottom/Hint`.
- **Shown:**
  - **Plates** `Control` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both
    - Note: The name plate layer (P6, #257), the same as s7/Plates, under the rest of the HUD: one Plate per other player in line of sight within about 10 m. Code: position = camera.unproject_position(head + 0.35 m), the plate centred on it; hidden behind walls (raycast), beyond 10 m or behind the camera. No role, no health. Not drawn in the console frames, where the screen fills the view.
    - **Glorp** `PanelContainer` · variation `ToyNamePlate` · anchors `top_left`, offsets 1026, 408, 1026, 408 (left, top, right, bottom), grow both/both
      - Note: One instance per visible player, moved every frame to the projected point (the samples stand over two players, as on the target). The teammate mark of s7 never shows here: roles do not exist yet in the lobby.
      - **Name** `Label` · variation `ToyNamePlateText` · text from data (auto_translate_mode = DISABLED), sample: "Glorp" / "Глорп"
        - Note: The player's name from code (auto_translate_mode DISABLED); no translated text.
    - **Bulk** `PanelContainer` · variation `ToyNamePlate` · anchors `top_left`, offsets 1258, 453, 1258, 453 (left, top, right, bottom), grow both/both
      - **Name** `Label` · variation `ToyNamePlateText` · text from data (auto_translate_mode = DISABLED), sample: "Bulk" / "Бульк"
  - **Cross** `Panel` · variation `ToyCrosshair` · anchors `center`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (12, 12) = Vector2(get_theme_constant("width", "ToyCrosshair"), get_theme_constant("height", "ToyCrosshair"))
    - Note: The crosshair (P5), centred on the screen (its size is the variation's); over the console it is what the host points with. Not drawn at the boot (the target's frame 1 has no UI but the hint).
  - **Status** `PanelContainer` · variation `ToyPlate` · anchors `center_top`, offsets 0, 36, 0, 36 (left, top, right, bottom), grow both/end · custom_minimum_size (360, 66)
    - Note: The ready plate (the target's .wait): the count at the left, one pip per player at the right, the ready ones full and first. 360 x 66 (the target's 240 x 44 x 1.5).
    - **Row** `HBoxContainer` · variation `ToyRowTwentyFour` · gaps from the variation: separation 24
      - **Text** `Label` · variation `ToyPlateText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `lobby.countdown` with sample {count} = "5": en "Starting in 5" · uk "Старт через 5"
        - Note: lobby.waiting {count} ready of {total} players; lobby.need_more (tr_n) while the lobby has fewer players than the mode needs (other unmet demands of #208 take their own keys later); during the countdown lobby.countdown, once a second from 5 to 1, in the same calm text (agent).
      - **Pips** `HBoxContainer` · variation `ToyRowFour` · size flags vertical `SIZE_SHRINK_CENTER` · gaps from the variation: separation 4
        - Note: One pip per player in the lobby (up to 10): ToyPipHealth for each ready player, ToyPip for the rest (the suit's pips). Hidden while the plate says how many more players are needed.
        - **P1** `Panel` · variation `ToyPipHealth` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
        - **P2** `Panel` · variation `ToyPipHealth` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
        - **P3** `Panel` · variation `ToyPipHealth` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
        - **P4** `Panel` · variation `ToyPipHealth` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
        - **P5** `Panel` · variation `ToyPipHealth` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
        - **P6** `Panel` · variation `ToyPipHealth` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
  - **Players** `PanelContainer` · variation `ToyRoster` · anchors `top_right`, offsets -36, 36, -36, 36 (left, top, right, bottom), grow begin/end · custom_minimum_size (330, 0) = Vector2(330, 0)
    - Note: The roster as in the round (s7/Roster), with a ready pip per row. Rebuilt when a player joins, leaves, renames or toggles ready. 330 px wide (the target's 184 x 1.5 = 276, widened so «Олена · хост» fits at large text); a long name is cut with an ellipsis.
    - **Rows** `VBoxContainer` · variation `ToyColumnEight` · gaps from the variation: separation 8
      - **Head** `Label` · variation `ToyKicker` · text `lobby.player_count` with sample {count} = "6", {total} = "10": en "Players 6 / 10" · uk "Гравці 6 / 10"
        - Note: Players in the lobby / the lobby's limit, the tile's head (the target's .tab «ГРАВЦІ 6 / 10»; the game sets uppercase = true).
      - **Host** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
        - **Dot** `Panel` · variation `ToyRosterDot` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (15, 15) = Vector2(get_theme_constant("width", "ToyRosterDot"), get_theme_constant("height", "ToyRosterDot")) · self_modulate from data (a content colour, not a theme colour), sample #7C5CC8
        - **Name** `Label` · variation `ToyRosterName` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Olena" / "Олена" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
          - Note: One row per player in join order, the host first: the body colour, the name, the host tag on the host's row, the ready pip. Names are user text (auto_translate_mode DISABLED).
        - **HostTag** `PanelContainer` · variation `ToyRosterTagHost` · size flags vertical `SIZE_SHRINK_CENTER`
          - Note: The host tag (the target's quiet «ХОСТ»; hud.roster.host, the engineer's copy round 9), on the host's row only.
          - **Text** `Label` · variation `ToyRosterTagHostText` · text `hud.roster.host`: en "host" · uk "хост"
        - **Ready** `Panel` · variation `ToyPipHealth` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
          - Note: ToyPipHealth while that player is ready, ToyPip while not.
      - **Glorp** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
        - **Dot** `Panel` · variation `ToyRosterDot` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (15, 15) = Vector2(get_theme_constant("width", "ToyRosterDot"), get_theme_constant("height", "ToyRosterDot")) · self_modulate from data (a content colour, not a theme colour), sample #1C7A82
        - **Name** `Label` · variation `ToyRosterName` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Glorp" / "Глорп" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
        - **Ready** `Panel` · variation `ToyPipHealth` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
      - **Yizhak** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
        - **Dot** `Panel` · variation `ToyRosterDot` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (15, 15) = Vector2(get_theme_constant("width", "ToyRosterDot"), get_theme_constant("height", "ToyRosterDot")) · self_modulate from data (a content colour, not a theme colour), sample #E66B57
        - **Name** `Label` · variation `ToyRosterName` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Yizhak" / "Їжак" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
        - **Ready** `Panel` · variation `ToyPipHealth` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
      - **Bulk** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
        - **Dot** `Panel` · variation `ToyRosterDot` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (15, 15) = Vector2(get_theme_constant("width", "ToyRosterDot"), get_theme_constant("height", "ToyRosterDot")) · self_modulate from data (a content colour, not a theme colour), sample #E8B04A
        - **Name** `Label` · variation `ToyRosterName` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Bulk" / "Бульк" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
        - **Ready** `Panel` · variation `ToyPipHealth` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
      - **Self** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
        - **Dot** `Panel` · variation `ToyRosterDot` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (15, 15) = Vector2(get_theme_constant("width", "ToyRosterDot"), get_theme_constant("height", "ToyRosterDot")) · self_modulate from data (a content colour, not a theme colour), sample #4AA3DF
        - **Name** `Label` · variation `ToyRosterNameSelf` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `hud.roster.self` with sample {name} = "Zinga" / "Зінга": en "Zinga (you)" · uk "Зінга (ти)" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
        - **Ready** `Panel` · variation `ToyPipHealth` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
      - **Taras** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
        - **Dot** `Panel` · variation `ToyRosterDot` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (15, 15) = Vector2(get_theme_constant("width", "ToyRosterDot"), get_theme_constant("height", "ToyRosterDot")) · self_modulate from data (a content colour, not a theme colour), sample #D46FB0
        - **Name** `Label` · variation `ToyRosterName` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Taras" / "Тарас" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
        - **Ready** `Panel` · variation `ToyPipHealth` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
  - **Bottom/Ready** `PanelContainer` · variation `ToyPlate` · size flags vertical `SIZE_SHRINK_END`
    - Note: The own ready state (the target's .rdy): a calm tile with the ready pip and the words, ToyPipHealth with lobby.ready_yes while ready, ToyPip with lobby.ready_no while not.
    - **Row** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
      - **Pip** `Panel` · variation `ToyPipHealth` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
      - **Text** `Label` · variation `ToyPlateText` · size flags vertical `SIZE_SHRINK_CENTER` · text `lobby.ready_yes`: en "Ready: yes" · uk "Готовність: так"
  - **Bottom/Mic** `PanelContainer` · variation `ToyMic` · size flags vertical `SIZE_SHRINK_END` · custom_minimum_size (75, 75) = Vector2(get_theme_constant("width", "ToyMic"), get_theme_constant("height", "ToyMic"))
    - Note: The mic (P4): mic.svg in icon_on while anybody can hear the player, mic-off.svg in icon_off when nobody does. The target's lobby frame has no mic; it stays beside the ready tile (agent).
    - **Icon** `TextureRect` · size flags horizontal `SIZE_SHRINK_CENTER`, vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (42, 42) · texture `mic` (dist/pack/icons/mic.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("icon_on", "ToyMic")

## `short`: what differs from `boot`

- **Hidden:** `Bottom/Hint`.
- **Shown:**
  - **Plates** `Control` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both
    - Note: The name plate layer (P6, #257), the same as s7/Plates, under the rest of the HUD: one Plate per other player in line of sight within about 10 m. Code: position = camera.unproject_position(head + 0.35 m), the plate centred on it; hidden behind walls (raycast), beyond 10 m or behind the camera. No role, no health. Not drawn in the console frames, where the screen fills the view.
    - **Glorp** `PanelContainer` · variation `ToyNamePlate` · anchors `top_left`, offsets 1026, 408, 1026, 408 (left, top, right, bottom), grow both/both
      - Note: One instance per visible player, moved every frame to the projected point (the samples stand over two players, as on the target). The teammate mark of s7 never shows here: roles do not exist yet in the lobby.
      - **Name** `Label` · variation `ToyNamePlateText` · text from data (auto_translate_mode = DISABLED), sample: "Glorp" / "Глорп"
        - Note: The player's name from code (auto_translate_mode DISABLED); no translated text.
  - **Cross** `Panel` · variation `ToyCrosshair` · anchors `center`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (12, 12) = Vector2(get_theme_constant("width", "ToyCrosshair"), get_theme_constant("height", "ToyCrosshair"))
    - Note: The crosshair (P5), centred on the screen (its size is the variation's); over the console it is what the host points with. Not drawn at the boot (the target's frame 1 has no UI but the hint).
  - **Status** `PanelContainer` · variation `ToyPlate` · anchors `center_top`, offsets 0, 36, 0, 36 (left, top, right, bottom), grow both/end · custom_minimum_size (360, 66)
    - Note: The ready plate (the target's .wait): the count at the left, one pip per player at the right, the ready ones full and first. 360 x 66 (the target's 240 x 44 x 1.5).
    - **Row** `HBoxContainer` · variation `ToyRowTwentyFour` · gaps from the variation: separation 24
      - **Text** `Label` · variation `ToyPlateText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `tr_n("lobby.need_more", "lobby.need_more", 1)`: en "1 more player to start" · uk "Ще 1 гравець до старту"
        - Note: lobby.waiting {count} ready of {total} players; lobby.need_more (tr_n) while the lobby has fewer players than the mode needs (other unmet demands of #208 take their own keys later); during the countdown lobby.countdown, once a second from 5 to 1, in the same calm text (agent).
  - **Players** `PanelContainer` · variation `ToyRoster` · anchors `top_right`, offsets -36, 36, -36, 36 (left, top, right, bottom), grow begin/end · custom_minimum_size (330, 0) = Vector2(330, 0)
    - Note: The roster as in the round (s7/Roster), with a ready pip per row. Rebuilt when a player joins, leaves, renames or toggles ready. 330 px wide (the target's 184 x 1.5 = 276, widened so «Олена · хост» fits at large text); a long name is cut with an ellipsis.
    - **Rows** `VBoxContainer` · variation `ToyColumnEight` · gaps from the variation: separation 8
      - **Head** `Label` · variation `ToyKicker` · text `lobby.player_count` with sample {count} = "3", {total} = "10": en "Players 3 / 10" · uk "Гравці 3 / 10"
        - Note: Players in the lobby / the lobby's limit, the tile's head (the target's .tab «ГРАВЦІ 6 / 10»; the game sets uppercase = true).
      - **Host** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
        - **Dot** `Panel` · variation `ToyRosterDot` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (15, 15) = Vector2(get_theme_constant("width", "ToyRosterDot"), get_theme_constant("height", "ToyRosterDot")) · self_modulate from data (a content colour, not a theme colour), sample #7C5CC8
        - **Name** `Label` · variation `ToyRosterName` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Olena" / "Олена" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
          - Note: One row per player in join order, the host first: the body colour, the name, the host tag on the host's row, the ready pip. Names are user text (auto_translate_mode DISABLED).
        - **HostTag** `PanelContainer` · variation `ToyRosterTagHost` · size flags vertical `SIZE_SHRINK_CENTER`
          - Note: The host tag (the target's quiet «ХОСТ»; hud.roster.host, the engineer's copy round 9), on the host's row only.
          - **Text** `Label` · variation `ToyRosterTagHostText` · text `hud.roster.host`: en "host" · uk "хост"
        - **Ready** `Panel` · variation `ToyPipHealth` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
          - Note: ToyPipHealth while that player is ready, ToyPip while not.
      - **Glorp** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
        - **Dot** `Panel` · variation `ToyRosterDot` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (15, 15) = Vector2(get_theme_constant("width", "ToyRosterDot"), get_theme_constant("height", "ToyRosterDot")) · self_modulate from data (a content colour, not a theme colour), sample #1C7A82
        - **Name** `Label` · variation `ToyRosterName` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Glorp" / "Глорп" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
        - **Ready** `Panel` · variation `ToyPip` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPip"), get_theme_constant("height", "ToyPip"))
      - **Self** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
        - **Dot** `Panel` · variation `ToyRosterDot` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (15, 15) = Vector2(get_theme_constant("width", "ToyRosterDot"), get_theme_constant("height", "ToyRosterDot")) · self_modulate from data (a content colour, not a theme colour), sample #4AA3DF
        - **Name** `Label` · variation `ToyRosterNameSelf` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `hud.roster.self` with sample {name} = "Zinga" / "Зінга": en "Zinga (you)" · uk "Зінга (ти)" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
        - **Ready** `Panel` · variation `ToyPip` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPip"), get_theme_constant("height", "ToyPip"))
  - **Bottom/Ready** `PanelContainer` · variation `ToyPlate` · size flags vertical `SIZE_SHRINK_END`
    - Note: The own ready state (the target's .rdy): a calm tile with the ready pip and the words, ToyPipHealth with lobby.ready_yes while ready, ToyPip with lobby.ready_no while not.
    - **Row** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
      - **Pip** `Panel` · variation `ToyPip` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPip"), get_theme_constant("height", "ToyPip"))
      - **Text** `Label` · variation `ToyPlateText` · size flags vertical `SIZE_SHRINK_CENTER` · text `lobby.ready_no`: en "Ready: no" · uk "Готовність: ні"
  - **Bottom/Mic** `PanelContainer` · variation `ToyMic` · size flags vertical `SIZE_SHRINK_END` · custom_minimum_size (75, 75) = Vector2(get_theme_constant("width", "ToyMic"), get_theme_constant("height", "ToyMic"))
    - Note: The mic (P4): mic.svg in icon_on while anybody can hear the player, mic-off.svg in icon_off when nobody does. The target's lobby frame has no mic; it stays beside the ready tile (agent).
    - **Icon** `TextureRect` · size flags horizontal `SIZE_SHRINK_CENTER`, vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (42, 42) · texture `mic` (dist/pack/icons/mic.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("icon_on", "ToyMic")

## `console-host`: what differs from `boot`

- **Hidden:** `Bottom/Hint`.
- **Shown:**
  - **Console** `PanelContainer` · variation `ToyPanelDialog` · anchors `center`, offsets -180, 112, -180, 112 (left, top, right, bottom), grow both/both · custom_minimum_size (960, 540)
    - Note: Not a HUD node: the console's own scene, the root of a SubViewport (960 x 540, the target's 640 x 360 x 1.5, with the game's Theme) whose ViewportTexture the ship console's screen mesh shows, built as s11 is (anchors full_rect in the viewport). Whoever stands near the console sees the same screen; the host works it with the crosshair (the game raycasts the screen mesh and pushes the hit point into the SubViewport as mouse motion and Interact as a left click, SubViewport.push_input), so the control under the crosshair hovers. The page draws the canvas at its own size where the player looks (moved so the crosshair falls on the lower right of the humans' minus, clear of its icon), under the HUD. Every change applies live for everyone. There are no presets (the target has none, agent); the lobby name field and Knives are not on it (open).
    - **V** `VBoxContainer` · variation `ToyColumnSixteen` · gaps from the variation: separation 16
      - **Top** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
        - **Title** `Label` · variation `ToyTitleMachine` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `console.title`: en "Match" · uk "Матч" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
          - Note: The console's title, as the target's «Матч» (console.title, the engineer's word, 2026-10-22): the console sets up the match. The lobby's own name (#214) is not on the console; it is what the suit menu's lobbies nearby list shows (s5).
        - **HostNote** `Label` · variation `ToyTextMutedOnLight` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (420, 0) · text `esc.lobby.you_host`: en "You're the host: everyone sees your changes" · uk "Ти хост: зміни бачать усі" · horizontal_alignment `RIGHT` · autowrap_mode `AUTOWRAP_WORD_SMART`
          - Note: At most 420 wide, so the title keeps its room; a long translation wraps to two lines.
      - **Rows** `VBoxContainer` · variation `ToyColumnFour` · size flags vertical `SIZE_EXPAND_FILL` · gaps from the variation: separation 4
        - Note: The MVP match settings of frame 7 of pages/mvp-screens, moved here from the Esc menu's Lobby tab: the humans, the anger threshold, the match length, the Wi-Fi passwords. Rows at least 72 px (four rows and the code fit the 456 px inside the frame; the target's three rows are 96), the controls right-aligned, every value 156 px wide so the arrows line up. The host sees the steppers and the choice; everyone else the values only.
        - **Humans** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 72)
          - Note: The exact number of humans among the players (m8 §2, #1032). Bounds and the default per player count are open.
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (240, 0) · text `lobby.setting.humans`: en "Humans" · uk "Люди" · autowrap_mode `AUTOWRAP_WORD_SMART`
            - **Stepper** `HBoxContainer` · variation `ToyRowTwelve` · size flags vertical `SIZE_SHRINK_CENTER` · gaps from the variation: separation 12 · alignment `ALIGNMENT_END`
              - **Less** `Button` · variation `ToyStepper` · custom_minimum_size (51, 51) = Vector2(get_theme_constant("width", "ToyStepper"), get_theme_constant("height", "ToyStepper")) · icon `minus` (dist/pack/icons/minus.svg, own work) at 24 px, tinted by `ToyStepper`'s icon_*_color · shown hovered (review only)
                - Note: Steps the value down; disabled (unplugged) at the lower bound. Under the crosshair in console-host, so it hovers. Every stepper here works the same; a player who is not the host sees only the value.
              - **Value** `Label` · variation `ToySettingRowValue` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (156, 0) · text `lobby.setting.humans_of` with sample {count} = "2", {total} = "6": en "2 of 6" · uk "2 з 6" · horizontal_alignment `CENTER`
                - Note: {count} the humans set; {total} the players now in the lobby, also the stepper's maximum, so it follows joins and leaves.
              - **More** `Button` · variation `ToyStepper` · custom_minimum_size (51, 51) = Vector2(get_theme_constant("width", "ToyStepper"), get_theme_constant("height", "ToyStepper")) · icon `plus` (dist/pack/icons/plus.svg, own work) at 24 px, tinted by `ToyStepper`'s icon_*_color
                - Note: Steps the value up; disabled at the upper bound.
        - **Anger** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 72)
          - Note: The neighbours' anger threshold that calls the cops (m8 §5).
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (240, 0) · text `lobby.setting.anger`: en "Anger threshold" · uk "Поріг гніву" · autowrap_mode `AUTOWRAP_WORD_SMART`
            - **Choice** `Control` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (240, 51)
              - Note: One ButtonGroup of two toggles that touch (the target's .seg): a Control with the two halves placed side by side by anchors, since a box's smallest gap is 4 px. Each label is the number (data, auto_translate_mode DISABLED). The choices are open (the engineer's design); 50 and 100 are the sketch's samples.
              - **Fifty** `Button` · variation `ToySegmentStart` · anchors `top_left`, offsets 0, 0, 120, 51 (left, top, right, bottom), grow end/end · text from data (auto_translate_mode = DISABLED), sample: "50" · toggle_mode true, button_pressed true (ToyToggle draws `ToySegmentStartSelected`)
              - **Hundred** `Button` · variation `ToySegmentEnd` · anchors `top_left`, offsets 120, 0, 240, 51 (left, top, right, bottom), grow end/end · text from data (auto_translate_mode = DISABLED), sample: "100" · toggle_mode true, button_pressed false
        - **Duration** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 72)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (240, 0) · text `lobby.setting.duration`: en "Match duration" · uk "Тривалість матчу" · autowrap_mode `AUTOWRAP_WORD_SMART`
            - **Stepper** `HBoxContainer` · variation `ToyRowTwelve` · size flags vertical `SIZE_SHRINK_CENTER` · gaps from the variation: separation 12 · alignment `ALIGNMENT_END`
              - **Less** `Button` · variation `ToyStepper` · custom_minimum_size (51, 51) = Vector2(get_theme_constant("width", "ToyStepper"), get_theme_constant("height", "ToyStepper")) · icon `minus` (dist/pack/icons/minus.svg, own work) at 24 px, tinted by `ToyStepper`'s icon_*_color
              - **Value** `Label` · variation `ToySettingRowValue` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (156, 0) · text `unit.minutes` with sample {count} = "10": en "10 min" · uk "10 хв" · horizontal_alignment `CENTER`
              - **More** `Button` · variation `ToyStepper` · custom_minimum_size (51, 51) = Vector2(get_theme_constant("width", "ToyStepper"), get_theme_constant("height", "ToyStepper")) · icon `plus` (dist/pack/icons/plus.svg, own work) at 24 px, tinted by `ToyStepper`'s icon_*_color
        - **WifiPasswords** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 72)
          - Note: The Wi-Fi task's N: the passwords to enter before the task is done (GDD §8). Bounds and the default are the game's data.
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (240, 0) · text `lobby.setting.wifi_passwords`: en "Wi-Fi passwords" · uk "Паролі Wi-Fi" · autowrap_mode `AUTOWRAP_WORD_SMART`
            - **Stepper** `HBoxContainer` · variation `ToyRowTwelve` · size flags vertical `SIZE_SHRINK_CENTER` · gaps from the variation: separation 12 · alignment `ALIGNMENT_END`
              - **Less** `Button` · variation `ToyStepper` · custom_minimum_size (51, 51) = Vector2(get_theme_constant("width", "ToyStepper"), get_theme_constant("height", "ToyStepper")) · icon `minus` (dist/pack/icons/minus.svg, own work) at 24 px, tinted by `ToyStepper`'s icon_*_color
              - **Value** `Label` · variation `ToySettingRowValue` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (156, 0) · text from data (auto_translate_mode = DISABLED), sample: "3" · horizontal_alignment `CENTER`
                - Note: str(value) (auto_translate_mode DISABLED).
              - **More** `Button` · variation `ToyStepper` · custom_minimum_size (51, 51) = Vector2(get_theme_constant("width", "ToyStepper"), get_theme_constant("height", "ToyStepper")) · icon `plus` (dist/pack/icons/plus.svg, own work) at 24 px, tinted by `ToyStepper`'s icon_*_color
      - **Code** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
        - Note: The room code at the screen's foot (the target's .vft), for everyone near the console to read out: the host who hosted with a code and every player who joined with it. Hidden in a Direct session (LAN or VPN: no code exists). There is no Copy here (the crosshair is no clipboard); copying the code is the Esc menu's (s5).
        - **Label** `Label` · variation `ToyTextMutedOnLight` · size flags vertical `SIZE_SHRINK_CENTER` · text `common.code`: en "Code" · uk "Код"
        - **Value** `Label` · variation `ToyTextOnLight` · size flags vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "K7Q2XR"
          - Note: The room code (auto_translate_mode DISABLED); "…" while the code service has not made the room yet (JoinProgress.CODE_WAITING). When the service is gone, the row shows esc.lobby.code_gone in ToyTextMutedOnLight instead.
  - **Cross** `Panel` · variation `ToyCrosshair` · anchors `center`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (12, 12) = Vector2(get_theme_constant("width", "ToyCrosshair"), get_theme_constant("height", "ToyCrosshair"))
    - Note: The crosshair (P5), centred on the screen (its size is the variation's); over the console it is what the host points with. Not drawn at the boot (the target's frame 1 has no UI but the hint).
  - **Status** `PanelContainer` · variation `ToyPlate` · anchors `center_top`, offsets 0, 36, 0, 36 (left, top, right, bottom), grow both/end · custom_minimum_size (360, 66)
    - Note: The ready plate (the target's .wait): the count at the left, one pip per player at the right, the ready ones full and first. 360 x 66 (the target's 240 x 44 x 1.5).
    - **Row** `HBoxContainer` · variation `ToyRowTwentyFour` · gaps from the variation: separation 24
      - **Text** `Label` · variation `ToyPlateText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `lobby.waiting` with sample {count} = "4", {total} = "6": en "4 of 6 ready" · uk "Готові 4 з 6"
        - Note: lobby.waiting {count} ready of {total} players; lobby.need_more (tr_n) while the lobby has fewer players than the mode needs (other unmet demands of #208 take their own keys later); during the countdown lobby.countdown, once a second from 5 to 1, in the same calm text (agent).
      - **Pips** `HBoxContainer` · variation `ToyRowFour` · size flags vertical `SIZE_SHRINK_CENTER` · gaps from the variation: separation 4
        - Note: One pip per player in the lobby (up to 10): ToyPipHealth for each ready player, ToyPip for the rest (the suit's pips). Hidden while the plate says how many more players are needed.
        - **P1** `Panel` · variation `ToyPipHealth` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
        - **P2** `Panel` · variation `ToyPipHealth` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
        - **P3** `Panel` · variation `ToyPipHealth` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
        - **P4** `Panel` · variation `ToyPipHealth` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
        - **P5** `Panel` · variation `ToyPip` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPip"), get_theme_constant("height", "ToyPip"))
        - **P6** `Panel` · variation `ToyPip` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPip"), get_theme_constant("height", "ToyPip"))
  - **Players** `PanelContainer` · variation `ToyRoster` · anchors `top_right`, offsets -36, 36, -36, 36 (left, top, right, bottom), grow begin/end · custom_minimum_size (330, 0) = Vector2(330, 0)
    - Note: The roster as in the round (s7/Roster), with a ready pip per row. Rebuilt when a player joins, leaves, renames or toggles ready. 330 px wide (the target's 184 x 1.5 = 276, widened so «Олена · хост» fits at large text); a long name is cut with an ellipsis.
    - **Rows** `VBoxContainer` · variation `ToyColumnEight` · gaps from the variation: separation 8
      - **Head** `Label` · variation `ToyKicker` · text `lobby.player_count` with sample {count} = "6", {total} = "10": en "Players 6 / 10" · uk "Гравці 6 / 10"
        - Note: Players in the lobby / the lobby's limit, the tile's head (the target's .tab «ГРАВЦІ 6 / 10»; the game sets uppercase = true).
      - **Host** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
        - **Dot** `Panel` · variation `ToyRosterDot` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (15, 15) = Vector2(get_theme_constant("width", "ToyRosterDot"), get_theme_constant("height", "ToyRosterDot")) · self_modulate from data (a content colour, not a theme colour), sample #7C5CC8
        - **NameSelf** `Label` · variation `ToyRosterNameSelf` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `hud.roster.self` with sample {name} = "Olena" / "Олена": en "Olena (you)" · uk "Олена (ти)" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
          - Note: The own row reads hud.roster.self in the accent, as in the round: the host's own view (console-host) reads «Олена (ти)». In the game one Label swaps key and variation.
        - **HostTag** `PanelContainer` · variation `ToyRosterTagHost` · size flags vertical `SIZE_SHRINK_CENTER`
          - Note: The host tag (the target's quiet «ХОСТ»; hud.roster.host, the engineer's copy round 9), on the host's row only.
          - **Text** `Label` · variation `ToyRosterTagHostText` · text `hud.roster.host`: en "host" · uk "хост"
        - **Ready** `Panel` · variation `ToyPipHealth` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
          - Note: ToyPipHealth while that player is ready, ToyPip while not.
      - **Glorp** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
        - **Dot** `Panel` · variation `ToyRosterDot` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (15, 15) = Vector2(get_theme_constant("width", "ToyRosterDot"), get_theme_constant("height", "ToyRosterDot")) · self_modulate from data (a content colour, not a theme colour), sample #1C7A82
        - **Name** `Label` · variation `ToyRosterName` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Glorp" / "Глорп" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
        - **Ready** `Panel` · variation `ToyPipHealth` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
      - **Yizhak** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
        - **Dot** `Panel` · variation `ToyRosterDot` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (15, 15) = Vector2(get_theme_constant("width", "ToyRosterDot"), get_theme_constant("height", "ToyRosterDot")) · self_modulate from data (a content colour, not a theme colour), sample #E66B57
        - **Name** `Label` · variation `ToyRosterName` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Yizhak" / "Їжак" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
        - **Ready** `Panel` · variation `ToyPip` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPip"), get_theme_constant("height", "ToyPip"))
      - **Bulk** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
        - **Dot** `Panel` · variation `ToyRosterDot` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (15, 15) = Vector2(get_theme_constant("width", "ToyRosterDot"), get_theme_constant("height", "ToyRosterDot")) · self_modulate from data (a content colour, not a theme colour), sample #E8B04A
        - **Name** `Label` · variation `ToyRosterName` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Bulk" / "Бульк" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
        - **Ready** `Panel` · variation `ToyPipHealth` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
      - **Zinga** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
        - **Dot** `Panel` · variation `ToyRosterDot` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (15, 15) = Vector2(get_theme_constant("width", "ToyRosterDot"), get_theme_constant("height", "ToyRosterDot")) · self_modulate from data (a content colour, not a theme colour), sample #4AA3DF
        - **Name** `Label` · variation `ToyRosterName` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Zinga" / "Зінга" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
        - **Ready** `Panel` · variation `ToyPipHealth` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
      - **Taras** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
        - **Dot** `Panel` · variation `ToyRosterDot` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (15, 15) = Vector2(get_theme_constant("width", "ToyRosterDot"), get_theme_constant("height", "ToyRosterDot")) · self_modulate from data (a content colour, not a theme colour), sample #D46FB0
        - **Name** `Label` · variation `ToyRosterName` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Taras" / "Тарас" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
        - **Ready** `Panel` · variation `ToyPip` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPip"), get_theme_constant("height", "ToyPip"))
  - **Bottom/Ready** `PanelContainer` · variation `ToyPlate` · size flags vertical `SIZE_SHRINK_END`
    - Note: The own ready state (the target's .rdy): a calm tile with the ready pip and the words, ToyPipHealth with lobby.ready_yes while ready, ToyPip with lobby.ready_no while not.
    - **Row** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
      - **Pip** `Panel` · variation `ToyPipHealth` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
      - **Text** `Label` · variation `ToyPlateText` · size flags vertical `SIZE_SHRINK_CENTER` · text `lobby.ready_yes`: en "Ready: yes" · uk "Готовність: так"
  - **Bottom/Mic** `PanelContainer` · variation `ToyMic` · size flags vertical `SIZE_SHRINK_END` · custom_minimum_size (75, 75) = Vector2(get_theme_constant("width", "ToyMic"), get_theme_constant("height", "ToyMic"))
    - Note: The mic (P4): mic.svg in icon_on while anybody can hear the player, mic-off.svg in icon_off when nobody does. The target's lobby frame has no mic; it stays beside the ready tile (agent).
    - **Icon** `TextureRect` · size flags horizontal `SIZE_SHRINK_CENTER`, vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (42, 42) · texture `mic` (dist/pack/icons/mic.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("icon_on", "ToyMic")

## `console-guest`: what differs from `boot`

- **Hidden:** `Bottom/Hint`.
- **Shown:**
  - **Console** `PanelContainer` · variation `ToyPanelDialog` · anchors `center`, offsets -180, 112, -180, 112 (left, top, right, bottom), grow both/both · custom_minimum_size (960, 540)
    - Note: Not a HUD node: the console's own scene, the root of a SubViewport (960 x 540, the target's 640 x 360 x 1.5, with the game's Theme) whose ViewportTexture the ship console's screen mesh shows, built as s11 is (anchors full_rect in the viewport). Whoever stands near the console sees the same screen; the host works it with the crosshair (the game raycasts the screen mesh and pushes the hit point into the SubViewport as mouse motion and Interact as a left click, SubViewport.push_input), so the control under the crosshair hovers. The page draws the canvas at its own size where the player looks (moved so the crosshair falls on the lower right of the humans' minus, clear of its icon), under the HUD. Every change applies live for everyone. There are no presets (the target has none, agent); the lobby name field and Knives are not on it (open).
    - **V** `VBoxContainer` · variation `ToyColumnSixteen` · gaps from the variation: separation 16
      - **Top** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
        - **Title** `Label` · variation `ToyTitleMachine` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `console.title`: en "Match" · uk "Матч" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
          - Note: The console's title, as the target's «Матч» (console.title, the engineer's word, 2026-10-22): the console sets up the match. The lobby's own name (#214) is not on the console; it is what the suit menu's lobbies nearby list shows (s5).
        - **HostOnly** `HBoxContainer` · variation `ToyRowTwelve` · size flags vertical `SIZE_SHRINK_CENTER` · gaps from the variation: separation 12
          - Note: Everyone but the host: the lock and who changes the settings.
          - **Lock** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (30, 30) · texture `lock` (dist/pack/icons/lock.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToyTextMutedOnLight")
          - **Text** `Label` · variation `ToyTextMutedOnLight` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (378, 0) · text `esc.lobby.host_only` with sample {name} = "Olena" / "Олена": en "Only the host changes these · Olena" · uk "Змінює лише хост · Олена" · horizontal_alignment `RIGHT` · autowrap_mode `AUTOWRAP_WORD_SMART`
      - **Rows** `VBoxContainer` · variation `ToyColumnFour` · size flags vertical `SIZE_EXPAND_FILL` · gaps from the variation: separation 4
        - Note: The MVP match settings of frame 7 of pages/mvp-screens, moved here from the Esc menu's Lobby tab: the humans, the anger threshold, the match length, the Wi-Fi passwords. Rows at least 72 px (four rows and the code fit the 456 px inside the frame; the target's three rows are 96), the controls right-aligned, every value 156 px wide so the arrows line up. The host sees the steppers and the choice; everyone else the values only.
        - **Humans** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 72)
          - Note: The exact number of humans among the players (m8 §2, #1032). Bounds and the default per player count are open.
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (240, 0) · text `lobby.setting.humans`: en "Humans" · uk "Люди" · autowrap_mode `AUTOWRAP_WORD_SMART`
            - **Stepper** `HBoxContainer` · variation `ToyRowTwelve` · size flags vertical `SIZE_SHRINK_CENTER` · gaps from the variation: separation 12 · alignment `ALIGNMENT_END`
              - **Value** `Label` · variation `ToySettingRowValue` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (156, 0) · text `lobby.setting.humans_of` with sample {count} = "2", {total} = "6": en "2 of 6" · uk "2 з 6" · horizontal_alignment `CENTER`
                - Note: {count} the humans set; {total} the players now in the lobby, also the stepper's maximum, so it follows joins and leaves.
        - **Anger** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 72)
          - Note: The neighbours' anger threshold that calls the cops (m8 §5).
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (240, 0) · text `lobby.setting.anger`: en "Anger threshold" · uk "Поріг гніву" · autowrap_mode `AUTOWRAP_WORD_SMART`
            - **Value** `Label` · variation `ToySettingRowValue` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (156, 0) · text from data (auto_translate_mode = DISABLED), sample: "50" · horizontal_alignment `CENTER`
              - Note: A player who is not the host sees the chosen threshold only: str(value) (auto_translate_mode DISABLED), in the steppers' value column.
        - **Duration** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 72)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (240, 0) · text `lobby.setting.duration`: en "Match duration" · uk "Тривалість матчу" · autowrap_mode `AUTOWRAP_WORD_SMART`
            - **Stepper** `HBoxContainer` · variation `ToyRowTwelve` · size flags vertical `SIZE_SHRINK_CENTER` · gaps from the variation: separation 12 · alignment `ALIGNMENT_END`
              - **Value** `Label` · variation `ToySettingRowValue` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (156, 0) · text `unit.minutes` with sample {count} = "10": en "10 min" · uk "10 хв" · horizontal_alignment `CENTER`
        - **WifiPasswords** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 72)
          - Note: The Wi-Fi task's N: the passwords to enter before the task is done (GDD §8). Bounds and the default are the game's data.
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (240, 0) · text `lobby.setting.wifi_passwords`: en "Wi-Fi passwords" · uk "Паролі Wi-Fi" · autowrap_mode `AUTOWRAP_WORD_SMART`
            - **Stepper** `HBoxContainer` · variation `ToyRowTwelve` · size flags vertical `SIZE_SHRINK_CENTER` · gaps from the variation: separation 12 · alignment `ALIGNMENT_END`
              - **Value** `Label` · variation `ToySettingRowValue` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (156, 0) · text from data (auto_translate_mode = DISABLED), sample: "3" · horizontal_alignment `CENTER`
                - Note: str(value) (auto_translate_mode DISABLED).
      - **Code** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
        - Note: The room code at the screen's foot (the target's .vft), for everyone near the console to read out: the host who hosted with a code and every player who joined with it. Hidden in a Direct session (LAN or VPN: no code exists). There is no Copy here (the crosshair is no clipboard); copying the code is the Esc menu's (s5).
        - **Label** `Label` · variation `ToyTextMutedOnLight` · size flags vertical `SIZE_SHRINK_CENTER` · text `common.code`: en "Code" · uk "Код"
        - **Value** `Label` · variation `ToyTextOnLight` · size flags vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "K7Q2XR"
          - Note: The room code (auto_translate_mode DISABLED); "…" while the code service has not made the room yet (JoinProgress.CODE_WAITING). When the service is gone, the row shows esc.lobby.code_gone in ToyTextMutedOnLight instead.
  - **Cross** `Panel` · variation `ToyCrosshair` · anchors `center`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (12, 12) = Vector2(get_theme_constant("width", "ToyCrosshair"), get_theme_constant("height", "ToyCrosshair"))
    - Note: The crosshair (P5), centred on the screen (its size is the variation's); over the console it is what the host points with. Not drawn at the boot (the target's frame 1 has no UI but the hint).
  - **Status** `PanelContainer` · variation `ToyPlate` · anchors `center_top`, offsets 0, 36, 0, 36 (left, top, right, bottom), grow both/end · custom_minimum_size (360, 66)
    - Note: The ready plate (the target's .wait): the count at the left, one pip per player at the right, the ready ones full and first. 360 x 66 (the target's 240 x 44 x 1.5).
    - **Row** `HBoxContainer` · variation `ToyRowTwentyFour` · gaps from the variation: separation 24
      - **Text** `Label` · variation `ToyPlateText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `lobby.waiting` with sample {count} = "4", {total} = "6": en "4 of 6 ready" · uk "Готові 4 з 6"
        - Note: lobby.waiting {count} ready of {total} players; lobby.need_more (tr_n) while the lobby has fewer players than the mode needs (other unmet demands of #208 take their own keys later); during the countdown lobby.countdown, once a second from 5 to 1, in the same calm text (agent).
      - **Pips** `HBoxContainer` · variation `ToyRowFour` · size flags vertical `SIZE_SHRINK_CENTER` · gaps from the variation: separation 4
        - Note: One pip per player in the lobby (up to 10): ToyPipHealth for each ready player, ToyPip for the rest (the suit's pips). Hidden while the plate says how many more players are needed.
        - **P1** `Panel` · variation `ToyPipHealth` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
        - **P2** `Panel` · variation `ToyPipHealth` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
        - **P3** `Panel` · variation `ToyPipHealth` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
        - **P4** `Panel` · variation `ToyPipHealth` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
        - **P5** `Panel` · variation `ToyPip` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPip"), get_theme_constant("height", "ToyPip"))
        - **P6** `Panel` · variation `ToyPip` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPip"), get_theme_constant("height", "ToyPip"))
  - **Players** `PanelContainer` · variation `ToyRoster` · anchors `top_right`, offsets -36, 36, -36, 36 (left, top, right, bottom), grow begin/end · custom_minimum_size (330, 0) = Vector2(330, 0)
    - Note: The roster as in the round (s7/Roster), with a ready pip per row. Rebuilt when a player joins, leaves, renames or toggles ready. 330 px wide (the target's 184 x 1.5 = 276, widened so «Олена · хост» fits at large text); a long name is cut with an ellipsis.
    - **Rows** `VBoxContainer` · variation `ToyColumnEight` · gaps from the variation: separation 8
      - **Head** `Label` · variation `ToyKicker` · text `lobby.player_count` with sample {count} = "6", {total} = "10": en "Players 6 / 10" · uk "Гравці 6 / 10"
        - Note: Players in the lobby / the lobby's limit, the tile's head (the target's .tab «ГРАВЦІ 6 / 10»; the game sets uppercase = true).
      - **Host** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
        - **Dot** `Panel` · variation `ToyRosterDot` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (15, 15) = Vector2(get_theme_constant("width", "ToyRosterDot"), get_theme_constant("height", "ToyRosterDot")) · self_modulate from data (a content colour, not a theme colour), sample #7C5CC8
        - **Name** `Label` · variation `ToyRosterName` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Olena" / "Олена" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
          - Note: One row per player in join order, the host first: the body colour, the name, the host tag on the host's row, the ready pip. Names are user text (auto_translate_mode DISABLED).
        - **HostTag** `PanelContainer` · variation `ToyRosterTagHost` · size flags vertical `SIZE_SHRINK_CENTER`
          - Note: The host tag (the target's quiet «ХОСТ»; hud.roster.host, the engineer's copy round 9), on the host's row only.
          - **Text** `Label` · variation `ToyRosterTagHostText` · text `hud.roster.host`: en "host" · uk "хост"
        - **Ready** `Panel` · variation `ToyPipHealth` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
          - Note: ToyPipHealth while that player is ready, ToyPip while not.
      - **Glorp** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
        - **Dot** `Panel` · variation `ToyRosterDot` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (15, 15) = Vector2(get_theme_constant("width", "ToyRosterDot"), get_theme_constant("height", "ToyRosterDot")) · self_modulate from data (a content colour, not a theme colour), sample #1C7A82
        - **Name** `Label` · variation `ToyRosterName` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Glorp" / "Глорп" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
        - **Ready** `Panel` · variation `ToyPipHealth` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
      - **Yizhak** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
        - **Dot** `Panel` · variation `ToyRosterDot` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (15, 15) = Vector2(get_theme_constant("width", "ToyRosterDot"), get_theme_constant("height", "ToyRosterDot")) · self_modulate from data (a content colour, not a theme colour), sample #E66B57
        - **Name** `Label` · variation `ToyRosterName` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Yizhak" / "Їжак" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
        - **Ready** `Panel` · variation `ToyPip` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPip"), get_theme_constant("height", "ToyPip"))
      - **Bulk** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
        - **Dot** `Panel` · variation `ToyRosterDot` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (15, 15) = Vector2(get_theme_constant("width", "ToyRosterDot"), get_theme_constant("height", "ToyRosterDot")) · self_modulate from data (a content colour, not a theme colour), sample #E8B04A
        - **Name** `Label` · variation `ToyRosterName` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Bulk" / "Бульк" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
        - **Ready** `Panel` · variation `ToyPipHealth` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
      - **Self** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
        - **Dot** `Panel` · variation `ToyRosterDot` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (15, 15) = Vector2(get_theme_constant("width", "ToyRosterDot"), get_theme_constant("height", "ToyRosterDot")) · self_modulate from data (a content colour, not a theme colour), sample #4AA3DF
        - **Name** `Label` · variation `ToyRosterNameSelf` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `hud.roster.self` with sample {name} = "Zinga" / "Зінга": en "Zinga (you)" · uk "Зінга (ти)" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
        - **Ready** `Panel` · variation `ToyPipHealth` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
      - **Taras** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
        - **Dot** `Panel` · variation `ToyRosterDot` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (15, 15) = Vector2(get_theme_constant("width", "ToyRosterDot"), get_theme_constant("height", "ToyRosterDot")) · self_modulate from data (a content colour, not a theme colour), sample #D46FB0
        - **Name** `Label` · variation `ToyRosterName` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Taras" / "Тарас" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
        - **Ready** `Panel` · variation `ToyPip` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPip"), get_theme_constant("height", "ToyPip"))
  - **Bottom/Ready** `PanelContainer` · variation `ToyPlate` · size flags vertical `SIZE_SHRINK_END`
    - Note: The own ready state (the target's .rdy): a calm tile with the ready pip and the words, ToyPipHealth with lobby.ready_yes while ready, ToyPip with lobby.ready_no while not.
    - **Row** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
      - **Pip** `Panel` · variation `ToyPipHealth` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
      - **Text** `Label` · variation `ToyPlateText` · size flags vertical `SIZE_SHRINK_CENTER` · text `lobby.ready_yes`: en "Ready: yes" · uk "Готовність: так"
  - **Bottom/Mic** `PanelContainer` · variation `ToyMic` · size flags vertical `SIZE_SHRINK_END` · custom_minimum_size (75, 75) = Vector2(get_theme_constant("width", "ToyMic"), get_theme_constant("height", "ToyMic"))
    - Note: The mic (P4): mic.svg in icon_on while anybody can hear the player, mic-off.svg in icon_off when nobody does. The target's lobby frame has no mic; it stays beside the ready tile (agent).
    - **Icon** `TextureRect` · size flags horizontal `SIZE_SHRINK_CENTER`, vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (42, 42) · texture `mic` (dist/pack/icons/mic.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("icon_on", "ToyMic")

## Notes

- The review page emulates Godot's containers with CSS grid (expanding children share the free space by stretch ratio, never below their minimum size), so a pixel or two may differ from Godot.
- Size constants: a variation's `width`, `height`, `min_width`, `wide_width` and `wide_min_width` theme constants are read by code into `custom_minimum_size`, as the node lines give them. A Panel or PanelContainer takes no size from them on its own: an anchored Panel at offsets 0 is 0×0, a slot shrinks to its text.
- Size constants that follow the text size: `min_width` 42 (50 in the pack's `modes.textSize.large`) of ToyKeyOnDark. The large-text theme is swapped in while a screen is open, so code that sets custom_minimum_size from such a constant sets it again on `NOTIFICATION_THEME_CHANGED`.
- Icons: the tinted ones are white SVGs in `dist/pack/icons/` (the pack's copy of `pages/components/icons`, currentColor written as white): a TextureRect tints one with the `self_modulate` its line gives (the colour the page draws it in), a Button with its variation's `icon_*_color`, an OptionButton its arrow with `modulate_arrow`. The room pictograms are white copies too (`dist/pack/icons/room/`), drawn in the pack's `tint_color`: their lines give the `self_modulate`. The pack's `assets` list every icon with its tint and `svg_scale`.
- SVG import: Godot rasterises an SVG at import, so import each at `svg/scale` = the largest size it is drawn ÷ its viewBox (the largest over every screen that draws it, as the pack's `assets` give it): `lock` 1.25 (30 px), `mic` 1.75 (42 px), `minus` 1 (24 px), `plus` 1 (24 px).
- Boxes and grids take their gaps only from their spacing variation (ToyColumn…, ToyRow…, ToyGrid…), and a ScrollContainer the gap to its bar from ToyScroll; a box without one has a single child. No `theme_override_constants`: the theme test forbids them.

## Keys

- **Drawn** (19): `common.code`, `console.title`, `esc.lobby.host_only`, `esc.lobby.you_host`, `hud.roster.host`, `hud.roster.self`, `lobby.countdown`, `lobby.need_more`, `lobby.player_count`, `lobby.ready_no`, `lobby.ready_yes`, `lobby.setting.anger`, `lobby.setting.duration`, `lobby.setting.humans`, `lobby.setting.humans_of`, `lobby.setting.wifi_passwords`, `lobby.waiting`, `tutorial.list.menu`, `unit.minutes`.
- **Named only in the notes** (wire them too): `control.ready`, `esc.lobby.code_gone`.

## Layers and input (every screen)

| CanvasLayer | What |
|---|---|
| 1 | Name plates in the world (s4, s7) |
| 2 | HUD: the round HUD (s7), downed and the dead's room (s9), the lobby HUD (s4), the tutorial's lesson plates (s1) |
| 3 | Map and tasks (s8), with its how-to card |
| 4 | Esc menu (s5): the side panel and its open page (no dim) |
| 5 | The Esc menu's confirm dialog |
| 6 | Black screens: connecting and loading (s3), pre game (s6), post game (s10) |

- The game boots straight into the ship (the lobby, s4); the suit menu (s5) hosts, joins and holds Settings.
- The mutation workbench (s11) is on no CanvasLayer: it is a SubViewport drawn on the machine in the world, under the HUD.
- Esc closes the topmost open overlay first (a how-to card, then the map; in the Esc menu its confirm dialog, then the menu) and opens the Esc menu only when nothing else is open. M is ignored while the Esc menu is open.
