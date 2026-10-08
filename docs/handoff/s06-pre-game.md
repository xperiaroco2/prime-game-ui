# 6 · Pre game

<!-- node pages/screens/build.js --handoff s6 (prime-game-ui, pages/screens/src/s06-pre-game.json); generated, do not edit by hand -->

The styled pre game screen from the UI track (xperiaroco2/prime-game-ui), as a Godot 4.7.2 node tree for the 1920×1080 reference.

- **Source:** `pages/screens/src/s06-pre-game.json`; the review page is `pages/screens/screens.html#s6`; the wireframe is section `s6` («Pre game: показ ролі»).
- **Theme:** the Toy pack ui-0.5.0 (`dist/pack/toy.pack.json`); the variations below are `theme_type_variation` names.
- **World behind the UI** (not UI): a lit room of the level.
- **How to read it:** the roots are children of the screen's full-rect root `Control`; every property not listed keeps Godot's default; sizes and offsets are reference px. In a state's **Shown** list, the first node of each subtree gives its path from the screen root.
- **Texts** are keys of `copy/strings.csv`, and the language switches live (the Esc menu's Settings). A plain key is set as `text` and translates itself. A key with placeholders, a plural key (`tr_n`) and a key drawn in pieces are set from code with `auto_translate_mode = DISABLED`: `tr()`, then `String.format()` with the data (the samples below), rebuilt on `NOTIFICATION_TRANSLATION_CHANGED`. A "text from data" (names, the room code, times, numbers) is set in code and never translated (`auto_translate_mode = DISABLED`).

The black intro of about 3 s in the silent pre game (#213): it shows when the own role arrives, names the role and the goal (and a dissident's team), plays one sound per role, and needs no input. Nobody hears anybody and no text says so. Then the round fades in. No mic, no other HUD while it shows.

## States

| State | Page label | What it shows |
|---|---|---|
| `engineer` | Інженер | An Engineer's intro. |
| `dissident` | Дисидент | A dissident's intro: the teammates' names under the goal (#175). |
| `after` | Потім: раунд | The round fading in: Night fades from alpha 1 to 0 over 0.4 s (a cut under reduced motion) over the round HUD, s7 empty at the round's first second. |

## Node tree in `engineer`

- **Night** `Panel` · variation `ToyBackdropNight` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both
  - Note: P2, opaque: the style's darkest stands for the decided black. In after it fades from alpha 1 to 0 over 0.4 s (modulate.a; a cut under reduced motion), then the whole screen is freed.
- **V** `VBoxContainer` · variation `ToyColumnThirtyTwo` · anchors `center`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (1152, 0) · gaps from the variation: separation 32 · alignment `ALIGNMENT_CENTER`
  - Note: The 32 px gaps clear the title plate's expand margins (4 px above it, the base 14 px below).
  - **YourRole** `Label` · variation `ToyTextMutedOnDark` · text `pregame.your_role`: en "Your role" · uk "Твоя роль" · horizontal_alignment `CENTER`
  - **Role** `Label` · variation `ToyTitlePlate` (raised: ToyRaised with base `ToyBaseTitle`) · size flags horizontal `SIZE_SHRINK_CENTER` · placement, size flags, custom_minimum_size and visibility on its ToyRaised wrapper · text `role.engineer`: en "Engineer" · uk "Інженер"
    - Note: The own role on the title plate (raised on ToyBaseTitle): role.engineer or role.dissident.
  - **Text** `VBoxContainer` · variation `ToyColumnSixteen` · gaps from the variation: separation 16
    - Note: The column's 32 px gap above clears the title base, which draws 14 px below the plate.
    - **Goal** `Label` · variation `ToyTextOnDark` · custom_minimum_size (1152, 0) · text `role.goal.engineer`: en "Your goal: complete every task before time runs out." · uk "Твоя мета: виконати всі задачі, поки не вийшов час." · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
      - Note: The role's generic goal: role.goal.engineer or role.goal.dissident.

## `dissident`: what differs from `engineer`

- **Changed** `V/Role`: text `role.dissident`: en "Dissident" · uk "Дисидент" (was: text `role.engineer`: en "Engineer" · uk "Інженер")
- **Changed** `V/Text/Goal`: text `role.goal.dissident`: en "Your goal: stop the Engineers from completing their tasks." · uk "Твоя мета: заважати Інженерам виконати задачі." (was: text `role.goal.engineer`: en "Your goal: complete every task before time runs out." · uk "Твоя мета: виконати всі задачі, поки не вийшов час.")
- **Shown:**
  - **V/Text/Team** `Label` · variation `ToyTextMutedOnDark` · custom_minimum_size (1152, 0) · text `pregame.teammate` with sample {names} = "Taras" / "Тарас": en "Your team: Taras" · uk "Твоя команда: Тарас" · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
    - Note: A dissident's teammates: {names} joined with ", " (user text). Hidden for an Engineer and for a dissident with no teammates.

## `after`: what differs from `engineer`

- **Hidden:** `Night`, `V`.
- **Shown:**
  - **Hud** `Control` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both
    - Note: Not part of this scene: the round HUD of s7 (s7/Hud as in its state empty, without Aim: nothing is within reach at the round's first second), drawn here only to show what the fading Night uncovers. Build it once, in s7.
    - **Timer** `PanelContainer` · variation `ToyPlate` · anchors `center_top`, offsets 0, 40, 0, 40 (left, top, right, bottom), grow both/end
      - **Time** `Label` · variation `ToyTimer` · custom_minimum_size (140, 0) · text from data (auto_translate_mode = DISABLED), sample: "09:57" · horizontal_alignment `CENTER`
    - **Role** `PanelContainer` · variation `ToyChipPlate` · anchors `top_left`, offsets 40, 40, 40, 40 (left, top, right, bottom), grow end/end
      - **Text** `Label` · variation `ToyChipPlateText` · text `role.engineer`: en "Engineer" · uk "Інженер"
    - **Cross** `Panel` · variation `ToyCrosshair` · anchors `center`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (8, 8) = Vector2(get_theme_constant("width", "ToyCrosshair"), get_theme_constant("height", "ToyCrosshair"))
    - **Vitals** `VBoxContainer` · variation `ToyColumnTwelve` · anchors `bottom_left`, offsets 40, -40, 40, -40 (left, top, right, bottom), grow end/begin · gaps from the variation: separation 12
      - **Health** `VBoxContainer` · variation `ToyColumnFour` · custom_minimum_size (320, 0) · gaps from the variation: separation 4
        - **Cap** `PanelContainer` · variation `ToyBarLabel` · size flags horizontal `SIZE_SHRINK_BEGIN`
          - **Text** `Label` · variation `ToyHudCaption` · text `hud.health`: en "Health" · uk "Здоровʼя"
        - **Track** `PanelContainer` · variation `ToyBarTrack` · custom_minimum_size (320, 16) = Vector2(320, get_theme_constant("height", "ToyBarTrack"))
          - **Fill** `ProgressBar` · variation `ToyBarHealth` · custom_minimum_size (0, 10) · value 1 of max_value 1, show_percentage false · fill self_modulate = theme colour `ramp_stop_20` of `ToyBarHealth` (step = clampi(floori(hp * 20.0 + 0.5), 0, 20))
      - **Stamina** `VBoxContainer` · variation `ToyColumnFour` · custom_minimum_size (320, 0) · gaps from the variation: separation 4
        - **Cap** `PanelContainer` · variation `ToyBarLabel` · size flags horizontal `SIZE_SHRINK_BEGIN`
          - **Text** `Label` · variation `ToyHudCaption` · text `hud.stamina`: en "Stamina" · uk "Витривалість"
        - **Track** `PanelContainer` · variation `ToyBarTrack` · custom_minimum_size (320, 16) = Vector2(320, get_theme_constant("height", "ToyBarTrack"))
          - **Fill** `ProgressBar` · variation `ToyBarStamina` · custom_minimum_size (0, 10) · value 1 of max_value 1, show_percentage false
      - **Mic** `PanelContainer` · variation `ToyMic` · size flags horizontal `SIZE_SHRINK_BEGIN` · custom_minimum_size (46, 46) = Vector2(get_theme_constant("width", "ToyMic"), get_theme_constant("height", "ToyMic"))
        - **Icon** `TextureRect` · size flags horizontal `SIZE_SHRINK_CENTER`, vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (28, 28) · texture `mic` (dist/pack/icons/mic.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("icon_on", "ToyMic")
    - **Slots** `HBoxContainer` · variation `ToyRowTwelve` · anchors `bottom_right`, offsets -40, -40, -40, -40 (left, top, right, bottom), grow begin/begin · gaps from the variation: separation 12
      - **Hand** `PanelContainer` · variation `ToySlotActive` · custom_minimum_size (88, 88) = Vector2(get_theme_constant("width", "ToySlotActive"), get_theme_constant("height", "ToySlotActive"))
        - **Center** `CenterContainer`
          - **Row** `HBoxContainer` · variation `ToyRowEight` · centred by its CenterContainer · gaps from the variation: separation 8
            - **Name** `Label` · variation `ToySlotTextEmpty` · size flags vertical `SIZE_SHRINK_CENTER` · text `hud.slot.hand`: en "Hand" · uk "Рука"
      - **Belt** `PanelContainer` · variation `ToySlot` · custom_minimum_size (88, 88) = Vector2(get_theme_constant("width", "ToySlot"), get_theme_constant("height", "ToySlot"))
        - **Center** `CenterContainer`
          - **Row** `HBoxContainer` · variation `ToyRowEight` · centred by its CenterContainer · gaps from the variation: separation 8
            - **Name** `Label` · variation `ToySlotTextEmpty` · size flags vertical `SIZE_SHRINK_CENTER` · text `hud.slot.belt`: en "Belt" · uk "Пояс"

## Notes

- The review page emulates Godot's containers with CSS grid (expanding children share the free space by stretch ratio, never below their minimum size), so a pixel or two may differ from Godot.
- A raised variation is built as the tokens spec (§6) says: a `ToyRaised` MarginContainer holding first the base `Panel` (the base named above, chosen by the context it sits in), then the face. The wrapper is the node in its parent: anchors, offsets, grow, size flags, stretch ratio, custom_minimum_size and visibility belong to the wrapper; the variation, the text, toggle_mode, disabled, focus and the signals belong to the face. Hide or show the wrapper, not the face.
- Size constants: a variation's `width`, `height`, `min_width`, `wide_width` and `wide_min_width` theme constants are read by code into `custom_minimum_size`, as the node lines give them. A Panel or PanelContainer takes no size from them on its own: an anchored Panel at offsets 0 is 0×0, a slot shrinks to its text.
- Icons: the tinted ones are white SVGs in `dist/pack/icons/` (the pack's copy of `pages/components/icons`, currentColor written as white): a TextureRect tints one with the `self_modulate` its line gives (the colour the page draws it in), a Button with its variation's `icon_*_color`, an OptionButton its arrow with `modulate_arrow`. The room pictograms are white copies too (`dist/pack/icons/room/`), drawn in ink: their lines give the `self_modulate`. The pack's `assets` list every icon with its tint and `svg_scale`.
- SVG import: Godot rasterises an SVG at import, so import each at `svg/scale` = the largest size it is drawn ÷ its viewBox (the largest over every screen that draws it, as the pack's `assets` give it): `mic` 1.17 (28 px).
- Boxes and grids take their gaps only from their spacing variation (ToyColumn…, ToyRow…, ToyGrid…), and a ScrollContainer the gap to its bar from ToyScroll; a box without one has a single child. No `theme_override_constants`: the theme test forbids them.

## Keys

- **Drawn** (10): `hud.health`, `hud.slot.belt`, `hud.slot.hand`, `hud.stamina`, `pregame.teammate`, `pregame.your_role`, `role.dissident`, `role.engineer`, `role.goal.dissident`, `role.goal.engineer`.

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
