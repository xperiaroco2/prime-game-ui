# 6 · Pre game

<!-- node pages/screens/build.js --handoff s6 (prime-game-ui, pages/screens/src/s06-pre-game.json); generated, do not edit by hand -->

The styled pre game screen from the UI track (xperiaroco2/prime-game-ui), as a Godot 4.7.2 node tree for the 1920×1080 reference.

- **Source:** `pages/screens/src/s06-pre-game.json`; the review page is `pages/screens/screens.html#s6`; the wireframe is section `s6` («Pre game: показ ролі»).
- **Theme:** the Toy pack ui-2.5.4 (`dist/pack/toy.pack.json`); the variations below are `theme_type_variation` names.
- **World behind the UI** (not UI): a lit room of the house (the level).
- **How to read it:** the roots are children of the screen's full-rect root `Control`; every property not listed keeps Godot's default; sizes and offsets are reference px. In a state's **Shown** list, the first node of each subtree gives its path from the screen root.
- **Texts** are keys of `copy/strings.csv`, and the language switches live (the Esc menu's Settings). A plain key is set as `text` and translates itself. A key with placeholders, a plural key (`tr_n`) and a key drawn in pieces are set from code with `auto_translate_mode = DISABLED`: `tr()`, then `String.format()` with the data (the samples below), rebuilt on `NOTIFICATION_TRANSLATION_CHANGED`. A "text from data" (names, the room code, times, numbers) is set in code and never translated (`auto_translate_mode = DISABLED`).

The black intro of about 3 s in the silent pre game (#213): it shows when the own side arrives, names it and its goal (and, for a human, the other humans), plays one sound per side, and needs no input. Nobody hears anybody and no text says so. Then the round fades in. No mic, no other HUD while it shows. The target page pages/suit-final, frame 4 (the role reveal, loud), every length x 1.5. Open: how the trip from the spaceship lobby maps onto Countdown, Loading and Pregame.

## States

| State | Page label | What it shows |
|---|---|---|
| `alien` | Прибулець | An alien's intro (the target's frame 4, the mint band). |
| `human` | Людина | A human's intro (the target's frame 4b): the danger band and title, and the other humans under the goal with their body colours (humans know each other, decided 2026-10-20). |
| `after` | Потім: раунд | The round fading in: Night fades from alpha 1 to 0 over 0.4 s (a cut under reduced motion) over the round HUD, s7 at the round's first second. |

## Node tree in `alien`

- **Night** `Panel` · variation `ToyBackdropFullScreen` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both
  - Note: P2, opaque: the full screens' base ground (ui-2.0.0; ToyBackdropNight's colour, the soft ink until ui-1.4.0). In after it fades from alpha 1 to 0 over 0.4 s (modulate.a; a cut under reduced motion), then the whole screen is freed.
- **Reveal** `Control` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both
  - Note: The target page's frame 4 (pages/suit-final, the role reveal, the first loud moment): fixed places on the night, so the band never moves between the two sides: the kicker at 270, the band from 345 to 630 across the whole width, the goal from 684, a human's team at 870 (the target's 180, 230 to 420, 456 and 580 x 1.5).
  - **YourRole** `Label` · variation `ToyKicker` · anchors `top_wide`, offsets 0, 270, 0, 270 (left, top, right, bottom), grow both/end · text `pregame.your_role`: en "Your role" · uk "Твоя роль" · horizontal_alignment `CENTER`
    - Note: The kicker over the band (the target's .who: dim capitals; the game sets uppercase = true).
  - **Band** `PanelContainer` · variation `ToyBand` · anchors `top_wide`, offsets 0, 345, 0, 630 (left, top, right, bottom), grow both/end
    - Note: The loud band across the whole width, 285 px tall (190 x 1.5): the accent for an alien, the danger colour for a human.
    - **Role** `Label` · variation `ToyTitleHero` · text `role.alien`: en "Alien" · uk "Прибулець" · horizontal_alignment `CENTER` · vertical_alignment `CENTER` · uppercase true (the text drawn in capitals)
      - Note: The own side in Unbounded capitals at the hero size on the band (uppercase, as the target writes it): ToyTitleHero (the accent ink) with role.alien, ToyTitleHeroAlert (the danger ink) with role.human.
  - **Goal** `PanelContainer` · variation `ToyPlateGoal` · anchors `center_top`, offsets 0, 684, 0, 684 (left, top, right, bottom), grow both/end · custom_minimum_size (900, 0) = Vector2(get_theme_constant("width", "ToyPlateGoal"), 0)
    - Note: The side's goal as a plain line under the band (ToyPlateGoal draws no plate since ui-2.0.0), 1080 wide (the target's 720 x 1.5).
    - **Text** `Label` · variation `ToyPlateGoalText` · custom_minimum_size (1080, 0) · text `role.goal.alien`: en "Throw the best party: finish every task before time runs out and the cops arrive." · uk "Влаштуй найкращу вечірку: виконай усі задачі, поки не скінчився час і не приїхали копи." · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
      - Note: role.goal.alien or role.goal.human.

## `human`: what differs from `alien`

- **Changed** `Reveal/Band`: variation `ToyBandAlert` (was: variation `ToyBand`)
- **Changed** `Reveal/Band/Role`: variation `ToyTitleHeroAlert` · text `role.human`: en "Human" · uk "Людина" (was: variation `ToyTitleHero` · text `role.alien`: en "Alien" · uk "Прибулець")
- **Changed** `Reveal/Goal/Text`: text `role.goal.human`: en "You're a human in an alien mask. Ruin the party: run out the clock or anger the neighbours until the cops come." · uk "Ти людина під маскою прибульця. Зіпсуй вечірку: протягни час або розлюти сусідів, щоб приїхали копи." (was: text `role.goal.alien`: en "Throw the best party: finish every task before time runs out and the cops arrive." · uk "Влаштуй найкращу вечірку: виконай усі задачі, поки не скінчився час і не приїхали копи.")
- **Shown:**
  - **Reveal/Team** `HBoxContainer` · variation `ToyRowTwelve` · anchors `center_top`, offsets 0, 870, 0, 870 (left, top, right, bottom), grow both/end · gaps from the variation: separation 12
    - Note: A human's fellow humans (humans know each other, decided 2026-10-20), as the target's .team: each one's body colour, then the line; hidden for an alien and for a human with no other human. One Dot per other human, in the roster's order.
    - **Dot** `Panel` · variation `ToyRosterDot` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (15, 15) = Vector2(get_theme_constant("width", "ToyRosterDot"), get_theme_constant("height", "ToyRosterDot")) · self_modulate from data (a content colour, not a theme colour), sample #4AA3DF
      - Note: The other human's body colour (self_modulate, content data).
    - **Text** `Label` · variation `ToyTextOnDark` · size flags vertical `SIZE_SHRINK_CENTER` · text `pregame.teammate` with sample {names} = "Zinga" / "Зінга": en "Your team: Zinga" · uk "Твоя команда: Зінга"
      - Note: The other humans' names joined with ", " (user text, auto_translate_mode DISABLED on the names).

## `after`: what differs from `alien`

- **Hidden:** `Night`, `Reveal`.
- **Shown:**
  - **Hud** `Control` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both
    - Note: Not part of this scene: the round HUD of s7 (s7/Hud at the round's first second: the full time, no anger, empty hands, nothing within reach), drawn here only to show what the fading Night uncovers. Build it once, in s7.
    - **Role** `PanelContainer` · variation `ToySticker` · anchors `top_left`, offsets 39, 39, 39, 39 (left, top, right, bottom), grow end/end
      - **Text** `Label` · variation `ToyStickerText` · text `role.alien`: en "Alien" · uk "Прибулець"
    - **Time** `PanelContainer` · variation `ToyPlate` · anchors `center_top`, offsets 0, 36, 0, 36 (left, top, right, bottom), grow both/end
      - Note: As s7, at the round's first second: the full time, no anger.
      - **Row** `HBoxContainer` · variation `ToyRowTwentyFour` · gaps from the variation: separation 24
        - **Timer** `Label` · variation `ToyTimer` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (120, 0) · text from data (auto_translate_mode = DISABLED), sample: "09:57" · horizontal_alignment `CENTER`
        - **Divider** `Panel` · variation `ToyTileDivider` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (3, 48) = Vector2(get_theme_constant("width", "ToyTileDivider"), get_theme_constant("height", "ToyTileDivider"))
          - Note: The thin line between the time and the anger (the target's .time .div, ui-2.1.0).
        - **Anger** `HBoxContainer` · variation `ToyRowEight` · size flags vertical `SIZE_SHRINK_CENTER` · gaps from the variation: separation 8
          - **Bar** `ProgressBar` · variation `ToyBarAngerCalm` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (240, 16) = Vector2(get_theme_constant("width", "ToyBarAngerCalm"), get_theme_constant("height", "ToyBarAngerCalm")) · value 0 of max_value 1, show_percentage false
          - **Siren** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (36, 36) · texture `siren-off` (dist/pack/icons/siren-off.svg, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · not tinted (drawn in its own colours)
    - **Roster** `PanelContainer` · variation `ToyRoster` · anchors `top_right`, offsets -39, 39, -39, 39 (left, top, right, bottom), grow begin/end · custom_minimum_size (276, 0) = Vector2(get_theme_constant("min_width", "ToyRoster"), 0)
      - Note: As s7; nobody is dead yet.
      - **Rows** `VBoxContainer` · variation `ToyColumnEight` · gaps from the variation: separation 8
        - **Row1** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
          - **Dot** `Panel` · variation `ToyRosterDot` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (15, 15) = Vector2(get_theme_constant("width", "ToyRosterDot"), get_theme_constant("height", "ToyRosterDot")) · self_modulate from data (a content colour, not a theme colour), sample #7C5CC8
          - **Name** `Label` · variation `ToyRosterNameSelf` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `hud.roster.self` with sample {name} = "Olena" / "Олена": en "Olena (you)" · uk "Олена (ти)"
        - **Row2** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
          - **Dot** `Panel` · variation `ToyRosterDot` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (15, 15) = Vector2(get_theme_constant("width", "ToyRosterDot"), get_theme_constant("height", "ToyRosterDot")) · self_modulate from data (a content colour, not a theme colour), sample #1C7A82
          - **Name** `Label` · variation `ToyRosterName` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Glorp" / "Глорп"
        - **Row3** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
          - **Dot** `Panel` · variation `ToyRosterDot` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (15, 15) = Vector2(get_theme_constant("width", "ToyRosterDot"), get_theme_constant("height", "ToyRosterDot")) · self_modulate from data (a content colour, not a theme colour), sample #E66B57
          - **Name** `Label` · variation `ToyRosterName` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Yizhak" / "Їжак"
        - **Row4** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
          - **Dot** `Panel` · variation `ToyRosterDot` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (15, 15) = Vector2(get_theme_constant("width", "ToyRosterDot"), get_theme_constant("height", "ToyRosterDot")) · self_modulate from data (a content colour, not a theme colour), sample #E8B04A
          - **Name** `Label` · variation `ToyRosterName` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Bulk" / "Бульк"
        - **Row5** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
          - **Dot** `Panel` · variation `ToyRosterDot` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (15, 15) = Vector2(get_theme_constant("width", "ToyRosterDot"), get_theme_constant("height", "ToyRosterDot")) · self_modulate from data (a content colour, not a theme colour), sample #4AA3DF
          - **Name** `Label` · variation `ToyRosterName` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Zinga" / "Зінга"
        - **Row6** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
          - **Dot** `Panel` · variation `ToyRosterDot` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (15, 15) = Vector2(get_theme_constant("width", "ToyRosterDot"), get_theme_constant("height", "ToyRosterDot")) · self_modulate from data (a content colour, not a theme colour), sample #D46FB0
          - **Name** `Label` · variation `ToyRosterName` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Taras" / "Тарас"
    - **Cross** `Panel` · variation `ToyCrosshair` · anchors `center`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (12, 12) = Vector2(get_theme_constant("width", "ToyCrosshair"), get_theme_constant("height", "ToyCrosshair"))
    - **Vitals** `HBoxContainer` · variation `ToyRowTwentyFour` · anchors `bottom_left`, offsets 39, -39, 39, -39 (left, top, right, bottom), grow end/begin · gaps from the variation: separation 24
      - Note: As s7.
      - **Suit** `PanelContainer` · variation `ToyPlate` · size flags vertical `SIZE_SHRINK_END`
        - **Rows** `VBoxContainer` · variation `ToyColumnEight` · gaps from the variation: separation 8
          - **Health** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Label** `Label` · variation `ToyHudCaption` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (150, 0) · text `hud.health`: en "Health" · uk "Здоровʼя"
            - **Pips** `HBoxContainer` · variation `ToyRowFour` · size flags vertical `SIZE_SHRINK_CENTER` · gaps from the variation: separation 4
              - **P1** `Panel` · variation `ToyPipHealth` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
              - **P2** `Panel` · variation `ToyPipHealth` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
              - **P3** `Panel` · variation `ToyPipHealth` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
              - **P4** `Panel` · variation `ToyPipHealth` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
              - **P5** `Panel` · variation `ToyPipHealth` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
              - **P6** `Panel` · variation `ToyPipHealth` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
              - **P7** `Panel` · variation `ToyPipHealth` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
              - **P8** `Panel` · variation `ToyPipHealth` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
              - **P9** `Panel` · variation `ToyPipHealth` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
              - **P10** `Panel` · variation `ToyPipHealth` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipHealth"), get_theme_constant("height", "ToyPipHealth"))
          - **Stamina** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Label** `Label` · variation `ToyHudCaption` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (150, 0) · text `hud.stamina`: en "Stamina" · uk "Витривалість"
            - **Pips** `HBoxContainer` · variation `ToyRowFour` · size flags vertical `SIZE_SHRINK_CENTER` · gaps from the variation: separation 4
              - **P1** `Panel` · variation `ToyPipStamina` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipStamina"), get_theme_constant("height", "ToyPipStamina"))
              - **P2** `Panel` · variation `ToyPipStamina` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipStamina"), get_theme_constant("height", "ToyPipStamina"))
              - **P3** `Panel` · variation `ToyPipStamina` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipStamina"), get_theme_constant("height", "ToyPipStamina"))
              - **P4** `Panel` · variation `ToyPipStamina` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipStamina"), get_theme_constant("height", "ToyPipStamina"))
              - **P5** `Panel` · variation `ToyPipStamina` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipStamina"), get_theme_constant("height", "ToyPipStamina"))
              - **P6** `Panel` · variation `ToyPipStamina` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipStamina"), get_theme_constant("height", "ToyPipStamina"))
              - **P7** `Panel` · variation `ToyPipStamina` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipStamina"), get_theme_constant("height", "ToyPipStamina"))
              - **P8** `Panel` · variation `ToyPipStamina` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipStamina"), get_theme_constant("height", "ToyPipStamina"))
              - **P9** `Panel` · variation `ToyPipStamina` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipStamina"), get_theme_constant("height", "ToyPipStamina"))
              - **P10** `Panel` · variation `ToyPipStamina` · custom_minimum_size (23, 15) = Vector2(get_theme_constant("width", "ToyPipStamina"), get_theme_constant("height", "ToyPipStamina"))
      - **Mic** `PanelContainer` · variation `ToyMic` · size flags vertical `SIZE_SHRINK_END` · custom_minimum_size (75, 75) = Vector2(get_theme_constant("width", "ToyMic"), get_theme_constant("height", "ToyMic"))
        - **Icon** `TextureRect` · size flags horizontal `SIZE_SHRINK_CENTER`, vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (42, 42) · texture `mic` (dist/pack/icons/mic.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("icon_on", "ToyMic")
    - **Slots** `HBoxContainer` · variation `ToyRowSixteen` · anchors `bottom_right`, offsets -36, -36, -36, -36 (left, top, right, bottom), grow begin/begin · gaps from the variation: separation 16
      - Note: As s7: both slots empty.
      - **Hand** `PanelContainer` · variation `ToySlotHand` · size flags vertical `SIZE_SHRINK_END` · custom_minimum_size (117, 132) = Vector2(get_theme_constant("width", "ToySlotHand"), get_theme_constant("height", "ToySlotHand"))
        - **V** `VBoxContainer` · variation `ToyColumnFour` · gaps from the variation: separation 4 · alignment `ALIGNMENT_CENTER`
          - **Head** `Label` · variation `ToyKicker` · text `hud.slot.hand`: en "Hand" · uk "Рука" · horizontal_alignment `CENTER`
            - Note: The slot's head at the top inside (the target's .sl .tab, ui-2.1.0); the game sets uppercase = true.
          - **Picture** `TextureRect` · size flags horizontal `SIZE_SHRINK_CENTER` · custom_minimum_size (57, 57) · texture `slot-empty-hand` (dist/pack/icons/slot-empty-hand.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToyTextOnDark")
      - **Belt** `PanelContainer` · variation `ToySlotBelt` · size flags vertical `SIZE_SHRINK_END` · custom_minimum_size (117, 132) = Vector2(get_theme_constant("width", "ToySlotBelt"), get_theme_constant("height", "ToySlotBelt"))
        - **V** `VBoxContainer` · variation `ToyColumnFour` · gaps from the variation: separation 4 · alignment `ALIGNMENT_CENTER`
          - **Head** `Label` · variation `ToyKicker` · text `hud.slot.belt`: en "Belt" · uk "Пояс" · horizontal_alignment `CENTER`
            - Note: The slot's head at the top inside (the target's .sl .tab, ui-2.1.0); the game sets uppercase = true.
          - **Picture** `TextureRect` · size flags horizontal `SIZE_SHRINK_CENTER` · custom_minimum_size (57, 57) · texture `slot-empty-belt` (dist/pack/icons/slot-empty-belt.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToyTextOnDark")

## Notes

- The review page emulates Godot's containers with CSS grid (expanding children share the free space by stretch ratio, never below their minimum size), so a pixel or two may differ from Godot.
- Size constants: a variation's `width`, `height`, `min_width`, `wide_width` and `wide_min_width` theme constants are read by code into `custom_minimum_size`, as the node lines give them. A Panel or PanelContainer takes no size from them on its own: an anchored Panel at offsets 0 is 0×0, a slot shrinks to its text.
- Icons: the tinted ones are white SVGs in `dist/pack/icons/` (the pack's copy of `pages/components/icons`, currentColor written as white): a TextureRect tints one with the `self_modulate` its line gives (the colour the page draws it in), a Button with its variation's `icon_*_color`, an OptionButton its arrow with `modulate_arrow`. The room pictograms are white copies too (`dist/pack/icons/room/`), drawn in the pack's `tint_color`: their lines give the `self_modulate`. The pack's `assets` list every icon with its tint and `svg_scale`.
- SVG import: Godot rasterises an SVG at import, so import each at `svg/scale` = the largest size it is drawn ÷ its viewBox (the largest over every screen that draws it, as the pack's `assets` give it): `mic` 1.75 (42 px), `siren-off` 0.57 (36 px), `slot-empty-belt` 0.9 (57 px), `slot-empty-hand` 0.9 (57 px).
- Boxes and grids take their gaps only from their spacing variation (ToyColumn…, ToyRow…, ToyGrid…), and a ScrollContainer the gap to its bar from ToyScroll; a box without one has a single child. No `theme_override_constants`: the theme test forbids them.

## Keys

- **Drawn** (11): `hud.health`, `hud.roster.self`, `hud.slot.belt`, `hud.slot.hand`, `hud.stamina`, `pregame.teammate`, `pregame.your_role`, `role.alien`, `role.goal.alien`, `role.goal.human`, `role.human`.

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
