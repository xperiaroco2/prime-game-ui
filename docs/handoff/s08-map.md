# 8 · Map and tasks

<!-- node pages/screens/build.js --handoff s8 (prime-game-ui, pages/screens/src/s08-map.json); generated, do not edit by hand -->

The styled map and tasks screen from the UI track (xperiaroco2/prime-game-ui), as a Godot 4.7.2 node tree for the 1920×1080 reference.

- **Source:** `pages/screens/src/s08-map.json`; the review page is `pages/screens/screens.html#s8`; the wireframe is section `s8` («Мапа й задачі (M)»).
- **Theme:** the Toy pack ui-0.3.0 (`dist/pack/toy.pack.json`); the variations below are `theme_type_variation` names.
- **World behind the UI** (not UI): a lit room of the level.
- **How to read it:** the roots are children of the screen's full-rect root `Control`; every property not listed keeps Godot's default; sizes and offsets are reference px. In a state's **Shown** list, the first node of each subtree gives its path from the screen root.
- **Texts** are keys of `copy/strings.csv`, and the language switches live (the Esc menu's Settings). A plain key is set as `text` and translates itself. A key with placeholders, a plural key (`tr_n`) and a key drawn in pieces are set from code with `auto_translate_mode = DISABLED`: `tr()`, then `String.format()` with the data (the samples below), rebuilt on `NOTIFICATION_TRANSLATION_CHANGED`. A "text from data" (names, the room code, times, numbers) is set in code and never translated (`auto_translate_mode = DISABLED`).

M opens and closes this screen over the running round (press, not hold; rebindable, #211); Tab does nothing here. The mouse is freed while it is open and the player keeps walking: only the mouse look stops. Nothing here is a HUD hint: the map never shows players, items, roles, teammates, delivery circles or done points. Input while it is open: the gameplay actions keep working (move, sprint, jump, interact, talk), so Space, which jumps, must never press a focused «?»: remove Space from ui_accept in the project InputMap (Enter and the gamepad's A still press; jump keeps Space), and when the card was opened with the mouse, closing it releases focus instead of giving it back to the «?». The map's focus moves only with the arrows and the d-pad; the left stick and WASD walk.

## States

| State | Page label | What it shows |
|---|---|---|
| `list` | Задачі | The task list beside the map; nothing hovered. |
| `zone` | Наведено на задачу | Delivery's «?» has keyboard focus (the mouse over the Delivery row does the same, with no look of its own): the map lights that task's zones, for Delivery only the storage room; the zone is drawn inside the room, under its pictogram and name. |
| `guide` | Натиснуто «?» | The Delivery «?» was pressed: its how-to card opens over the map; Close, Esc or M closes it. |

## Node tree in `list`

- **Dim** `Panel` · variation `ToyBackdropDeep` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both
  - Note: mouse_filter IGNORE. The round keeps running behind it.
- **Tasks** `PanelContainer` · variation `ToyPanelMenu` (raised: ToyRaised with base `ToyBasePanel`) · anchors `top_left`, offsets 80, 88, 688, 88 (left, top, right, bottom), grow end/end · placement, size flags, custom_minimum_size and visibility on its ToyRaised wrapper
  - Note: Grows down from its top to its content (the rows, then the time). On open no control has focus (state list); the first ui_down or ui_up gives focus to the first row's «?» (Rows/Delivery/H/Help), which lights that task's zones (state zone). While the how-to card is open, focus_behavior_recursive = FOCUS_BEHAVIOR_DISABLED here (see Dim2).
  - **V** `VBoxContainer` · variation `ToyColumnTwentyFour` · gaps from the variation: separation 24
    - **Title** `Label` · variation `ToyTitleOnLight` · text `map.tasks`: en "Tasks" · uk "Задачі"
    - **Rows** `VBoxContainer` · variation `ToyColumnEight` · gaps from the variation: separation 8
      - Note: One row per task type of the round, in the round's task order (content data). A counter only, never a description.
      - **Delivery** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
        - Note: mouse_entered and mouse_exited (and focus on its «?») show and hide this task's zones on the board (ZoneDelivery, ZoneDeliveryTag).
        - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
          - **Name** `Label` · variation `ToySettingRowValue` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `task.delivery`: en "Delivery" · uk "Доставка"
          - **Count** `Label` · variation `ToySettingRowText` · size flags vertical `SIZE_SHRINK_CENTER` · text `map.progress` with sample {count} = "3", {total} = "6": en "3 of 6" · uk "3 з 6"
            - Note: Packages delivered of the round's total; updates live while the map is open.
          - **Help** `Button` · variation `ToyKeyRoundButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (42, 42) = Vector2(42, 42) · text from data (auto_translate_mode = DISABLED), sample: "?"
            - Note: The text ? is a glyph, not a deck key (auto_translate_mode DISABLED); focus_mode ALL. 42 x 42 so it stays round at large text, where the glyph makes it 42 tall. A press opens this task's how-to card (Guide); keyboard focus shows the task's zones as hovering the row does. Every ? looks the same (no seen or new mark).
      - **Switches** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
        - Note: Its zones use map.zone_hint.switches and the level's switch areas.
        - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
          - **Name** `Label` · variation `ToySettingRowValue` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `task.switches`: en "Switches" · uk "Рубильники"
          - **Count** `Label` · variation `ToySettingRowText` · size flags vertical `SIZE_SHRINK_CENTER` · text `map.progress` with sample {count} = "0", {total} = "3": en "0 of 3" · uk "0 з 3"
          - **Help** `Button` · variation `ToyKeyRoundButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (42, 42) = Vector2(42, 42) · text from data (auto_translate_mode = DISABLED), sample: "?"
            - Note: As Delivery's Help.
    - **Time** `Label` · variation `ToyTextMutedOnLight` · text `map.time` with sample {time} = "7:22": en "Time: 7:22" · uk "Час: 7:22"
      - Note: The round's time left, m:ss, updated every second.
- **Board** `PanelContainer` · variation `ToyMapBoard` (raised: ToyRaised with base `ToyBasePanel`) · anchors `top_left`, offsets 744, 88, 1840, 992 (left, top, right, bottom), grow end/end · placement, size flags, custom_minimum_size and visibility on its ToyRaised wrapper
  - Note: While the how-to card is open, focus_behavior_recursive = FOCUS_BEHAVIOR_DISABLED here (see Dim2).
  - **Rooms** `Control`
    - Note: Children are built from the level's map data (room rects, the pin), scaled to fit this rect. The rects here are sample data in Rooms px (1088x896) until the designer's map exists.
    - **Storage** `PanelContainer` · variation `ToyMapRoom` · anchors `top_left`, offsets 56, 56, 386, 356 (left, top, right, bottom), grow end/end
      - Note: One room: its rect from the map data, its system B pictogram (ink, not tinted, no plate) and its name.
      - **V** `VBoxContainer` · variation `ToyColumnFour` · gaps from the variation: separation 4 · alignment `ALIGNMENT_CENTER`
        - **Icon** `TextureRect` · size flags horizontal `SIZE_SHRINK_CENTER` · custom_minimum_size (48, 48) · texture `room/storage` (dist/pack/icons/room/storage.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate #2a1f33 (the colour the pages draw it in; the pack's copy is white)
        - **Name** `Label` · variation `ToyMapRoomText` · custom_minimum_size (120, 0) · text `room.storage`: en "Storage" · uk "Склад" · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
    - **Kitchen** `PanelContainer` · variation `ToyMapRoom` · anchors `top_left`, offsets 434, 56, 698, 356 (left, top, right, bottom), grow end/end
      - **V** `VBoxContainer` · variation `ToyColumnFour` · gaps from the variation: separation 4 · alignment `ALIGNMENT_CENTER`
        - **Icon** `TextureRect` · size flags horizontal `SIZE_SHRINK_CENTER` · custom_minimum_size (48, 48) · texture `room/kitchen` (dist/pack/icons/room/kitchen.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate #2a1f33 (the colour the pages draw it in; the pack's copy is white)
        - **Name** `Label` · variation `ToyMapRoomText` · custom_minimum_size (120, 0) · text `room.kitchen`: en "Kitchen" · uk "Кухня" · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
    - **Lab** `PanelContainer` · variation `ToyMapRoom` · anchors `top_left`, offsets 746, 56, 1030, 436 (left, top, right, bottom), grow end/end
      - **V** `VBoxContainer` · variation `ToyColumnFour` · gaps from the variation: separation 4 · alignment `ALIGNMENT_CENTER`
        - **Icon** `TextureRect` · size flags horizontal `SIZE_SHRINK_CENTER` · custom_minimum_size (48, 48) · texture `room/lab` (dist/pack/icons/room/lab.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate #2a1f33 (the colour the pages draw it in; the pack's copy is white)
        - **Name** `Label` · variation `ToyMapRoomText` · custom_minimum_size (120, 0) · text `room.lab`: en "Lab" · uk "Лабораторія" · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
    - **Office** `PanelContainer` · variation `ToyMapRoom` · anchors `top_left`, offsets 56, 452, 306, 843 (left, top, right, bottom), grow end/end
      - **V** `VBoxContainer` · variation `ToyColumnFour` · gaps from the variation: separation 4 · alignment `ALIGNMENT_CENTER`
        - **Icon** `TextureRect` · size flags horizontal `SIZE_SHRINK_CENTER` · custom_minimum_size (48, 48) · texture `room/office` (dist/pack/icons/room/office.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate #2a1f33 (the colour the pages draw it in; the pack's copy is white)
        - **Name** `Label` · variation `ToyMapRoomText` · custom_minimum_size (120, 0) · text `room.office`: en "Office" · uk "Офіс" · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
    - **Hall** `PanelContainer` · variation `ToyMapRoom` · anchors `top_left`, offsets 354, 452, 698, 843 (left, top, right, bottom), grow end/end
      - **V** `VBoxContainer` · variation `ToyColumnFour` · gaps from the variation: separation 4 · alignment `ALIGNMENT_CENTER`
        - **Icon** `TextureRect` · size flags horizontal `SIZE_SHRINK_CENTER` · custom_minimum_size (48, 48) · texture `room/hall` (dist/pack/icons/room/hall.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate #2a1f33 (the colour the pages draw it in; the pack's copy is white)
        - **Name** `Label` · variation `ToyMapRoomText` · custom_minimum_size (120, 0) · text `room.hall`: en "Hall" · uk "Хол" · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
    - **Lounge** `PanelContainer` · variation `ToyMapRoom` · anchors `top_left`, offsets 746, 484, 1030, 843 (left, top, right, bottom), grow end/end
      - **V** `VBoxContainer` · variation `ToyColumnFour` · gaps from the variation: separation 4 · alignment `ALIGNMENT_CENTER`
        - **Icon** `TextureRect` · size flags horizontal `SIZE_SHRINK_CENTER` · custom_minimum_size (48, 48) · texture `room/lounge` (dist/pack/icons/room/lounge.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate #2a1f33 (the colour the pages draw it in; the pack's copy is white)
        - **Name** `Label` · variation `ToyMapRoomText` · custom_minimum_size (120, 0) · text `room.lounge`: en "Break room" · uk "Кімната відпочинку" · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
    - **Pin** `Panel` · variation `ToyMapPin` · anchors `top_left`, offsets 404, 500, 432, 528 (left, top, right, bottom), grow end/end · custom_minimum_size (28, 28) = Vector2(get_theme_constant("width", "ToyMapPin"), get_theme_constant("height", "ToyMapPin"))
      - Note: You are here: the local player's position from the map data. pivot_offset_ratio (0.5, 0.5); rotation = PI / 4 + the player's heading on the map (0 = up, clockwise), so the sharp top-left corner points where the player looks. Updated every frame while the map is open.
    - **Here** `PanelContainer` · variation `ToyChipPlate` · anchors `top_left`, offsets 440, 497, 440, 497 (left, top, right, bottom), grow end/end
      - Note: Follows the pin: its left edge 8 px right of the pin's rect, its top 3 px above the pin's top; it does not rotate.
      - **Text** `Label` · variation `ToyHudCaption` · text `map.you_are_here`: en "You are here" · uk "Ти тут"

## `zone`: what differs from `list`

- **Changed** `Tasks/V/Rows/Delivery/H/Help`: shown with keyboard focus (grab_focus)
- **Shown:**
  - **Board/Rooms/Storage/ZoneDelivery** `Panel` · variation `ToyMapZone`
    - Note: mouse_filter IGNORE. A lit zone of the hovered or focused task (level or content data): a zone that is a whole room is the room's first child, so it fills the room's content rect under its pictogram and name; a zone that is part of a room is placed the same way inside it by its rect. Delivery lights only the storage room, never the rooms still waiting for a package.
  - **Board/Rooms/ZoneDeliveryTag** `PanelContainer` · variation `ToyChipLight` · anchors `top_left`, offsets 56, 368, 56, 368 (left, top, right, bottom), grow end/end
    - Note: mouse_filter IGNORE. Under the first zone's room, its left edge on the room's, 12 px below it. Switches use map.zone_hint.switches.
    - **Text** `Label` · variation `ToyChipLightText` · text `map.zone_hint`: en "Packages may be here" · uk "Тут можуть бути пакунки"

## `guide`: what differs from `list`

- **Shown:**
  - **Dim2** `Panel` · variation `ToyBackdrop` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both
    - Note: mouse_filter STOP: the task list and the map under the card do not react to the mouse while it is open. Keyboard and gamepad focus search ignores what is drawn on top, so while the card is open set focus_behavior_recursive = FOCUS_BEHAVIOR_DISABLED on Tasks and Board (Control, Godot 4.5+) and restore FOCUS_BEHAVIOR_INHERITED on close. The card handles ui_cancel and the map key itself and calls get_viewport().set_input_as_handled(), so one press closes only the card, never the map too.
  - **Guide** `CenterContainer` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both
    - Note: Centres the how-to card of the task whose «?» was pressed (content data per task type, #254) on the screen. Close, Esc (ui_cancel) or M closes it; focus goes back to that «?» only when the card was opened by keyboard or gamepad. mouse_filter IGNORE (Dim2 blocks the mouse).
    - **Card** `PanelContainer` · variation `ToyPanelHowto` (raised: ToyRaised with base `ToyBasePanel`) · centred by its CenterContainer · custom_minimum_size (1536, 0) · placement, size flags, custom_minimum_size and visibility on its ToyRaised wrapper
      - Note: The same card tree as s3/Card and the Esc menu's s5 Guide/Card (Head, Frames/Frame1..4 with Art and Caption), plus Bar with Close.
      - **V** `VBoxContainer` · variation `ToyColumnSixteen` · gaps from the variation: separation 16
        - **Head** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
          - **Title** `Label` · variation `ToyTitleOnLight` · size flags horizontal `SIZE_EXPAND_FILL` · text `task.delivery`: en "Delivery" · uk "Доставка"
          - **Note** `Label` · variation `ToyHowtoNote` · size flags vertical `SIZE_SHRINK_CENTER` · text `howto.label`: en "How to" · uk "Як робити"
        - **Frames** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
          - Note: 3 to 4 frames from the card data; the frame that shows the finish uses ToyHowtoFrameDone.
          - **Frame1** `PanelContainer` · variation `ToyHowtoFrame` · size flags horizontal `SIZE_EXPAND_FILL`
            - **F** `VBoxContainer` · variation `ToyColumnEight` · gaps from the variation: separation 8
              - **Art** `TextureRect` · custom_minimum_size (120, 120) · texture `item` (dist/pack/icons/item.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToyTextOnLight")
                - Note: Placeholder art until the card art (prime-game-ui#3): the package, the room pictogram it carries (twice), the check on the done frame. The art fills the frame width at 120 px high (s3's loading card draws it 200 high).
              - **Caption** `Label` · variation `ToyHowtoCaption` · custom_minimum_size (120, 0) · text `howto.delivery.take`: en "Take a package from the storage room" · uk "Візьми пакунок на складі" · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
          - **Frame2** `PanelContainer` · variation `ToyHowtoFrame` · size flags horizontal `SIZE_EXPAND_FILL`
            - **F** `VBoxContainer` · variation `ToyColumnEight` · gaps from the variation: separation 8
              - **Art** `TextureRect` · custom_minimum_size (120, 120) · texture `room/lab` (dist/pack/icons/room/lab.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate #2a1f33 (the colour the pages draw it in; the pack's copy is white)
              - **Caption** `Label` · variation `ToyHowtoCaption` · custom_minimum_size (120, 0) · text `howto.delivery.sign`: en "Check the sign on it" · uk "Подивись на знак на ньому" · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
          - **Frame3** `PanelContainer` · variation `ToyHowtoFrame` · size flags horizontal `SIZE_EXPAND_FILL`
            - **F** `VBoxContainer` · variation `ToyColumnEight` · gaps from the variation: separation 8
              - **Art** `TextureRect` · custom_minimum_size (120, 120) · texture `room/lab` (dist/pack/icons/room/lab.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate #2a1f33 (the colour the pages draw it in; the pack's copy is white)
              - **Caption** `Label` · variation `ToyHowtoCaption` · custom_minimum_size (120, 0) · text `howto.delivery.find`: en "Find the room with that sign" · uk "Знайди кімнату з таким знаком" · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
          - **Frame4** `PanelContainer` · variation `ToyHowtoFrameDone` · size flags horizontal `SIZE_EXPAND_FILL`
            - **F** `VBoxContainer` · variation `ToyColumnEight` · gaps from the variation: separation 8
              - **Art** `TextureRect` · custom_minimum_size (120, 120) · texture `check` (dist/pack/icons/check.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToyTextOnLight")
              - **Caption** `Label` · variation `ToyHowtoCaption` · custom_minimum_size (120, 0) · text `howto.delivery.drop`: en "Put it in the delivery zone" · uk "Поклади в зону доставки" · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
        - **Bar** `HBoxContainer` · alignment `ALIGNMENT_END`
          - **Close** `Button` · variation `ToyButtonSecondary` (raised: ToyRaised with base `ToyBaseRaisedOnLight`, ToyPress; UiParts.button()) · placement, size flags, custom_minimum_size and visibility on its ToyRaised wrapper · text `common.close`: en "Close" · uk "Закрити" · shown with keyboard focus (grab_focus)
            - Note: Takes focus when the card opens by keyboard or gamepad (the page shows that case).

## Notes

- The review page emulates Godot's containers with CSS grid (expanding children share the free space by stretch ratio, never below their minimum size), so a pixel or two may differ from Godot.
- A raised variation is built as the tokens spec (§6) says: a `ToyRaised` MarginContainer holding first the base `Panel` (the base named above, chosen by the context it sits in), then the face. The wrapper is the node in its parent: anchors, offsets, grow, size flags, stretch ratio, custom_minimum_size and visibility belong to the wrapper; the variation, the text, toggle_mode, disabled, focus and the signals belong to the face. Hide or show the wrapper, not the face.
- Size constants: a variation's `width`, `height`, `min_width`, `wide_width` and `wide_min_width` theme constants are read by code into `custom_minimum_size`, as the node lines give them. A Panel or PanelContainer takes no size from them on its own: an anchored Panel at offsets 0 is 0×0, a slot shrinks to its text.
- Icons: the tinted ones are white SVGs in `dist/pack/icons/` (the pack's copy of `pages/components/icons`, currentColor written as white): a TextureRect tints one with the `self_modulate` its line gives (the colour the page draws it in), a Button with its variation's `icon_*_color`, an OptionButton its arrow with `modulate_arrow`. The room pictograms are white copies too (`dist/pack/icons/room/`), drawn in ink: their lines give the `self_modulate`. The pack's `assets` list every icon with its tint and `svg_scale`.
- SVG import: Godot rasterises an SVG at import, so import each at `svg/scale` = the largest size it is drawn ÷ its viewBox (the largest over every screen that draws it, as the pack's `assets` give it): `check` 5 (120 px), `item` 5 (120 px), `room/hall` 1 (48 px), `room/kitchen` 1 (48 px), `room/lab` 2.5 (120 px), `room/lounge` 1 (48 px), `room/office` 1 (48 px), `room/storage` 1 (48 px).
- Boxes and grids take their gaps only from their spacing variation (ToyColumn…, ToyRow…, ToyGrid…), and a ScrollContainer the gap to its bar from ToyScroll; a box without one has a single child. No `theme_override_constants`: the theme test forbids them.

## Keys

- **Drawn** (19): `common.close`, `howto.delivery.drop`, `howto.delivery.find`, `howto.delivery.sign`, `howto.delivery.take`, `howto.label`, `map.progress`, `map.tasks`, `map.time`, `map.you_are_here`, `map.zone_hint`, `room.hall`, `room.kitchen`, `room.lab`, `room.lounge`, `room.office`, `room.storage`, `task.delivery`, `task.switches`.
- **Named only in the notes** (wire them too): `map.zone_hint.switches`.

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
