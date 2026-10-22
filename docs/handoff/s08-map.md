# 8 · Map and tasks

<!-- node pages/screens/build.js --handoff s8 (prime-game-ui, pages/screens/src/s08-map.json); generated, do not edit by hand -->

The styled map and tasks screen from the UI track (xperiaroco2/prime-game-ui), as a Godot 4.7.2 node tree for the 1920×1080 reference.

- **Source:** `pages/screens/src/s08-map.json`; the review page is `pages/screens/screens.html#s8`; the wireframe is section `s8` («Мапа й задачі (M)»).
- **Theme:** the Toy pack ui-2.2.3 (`dist/pack/toy.pack.json`); the variations below are `theme_type_variation` names.
- **World behind the UI** (not UI): a lit room of the house (the level).
- **How to read it:** the roots are children of the screen's full-rect root `Control`; every property not listed keeps Godot's default; sizes and offsets are reference px. In a state's **Shown** list, the first node of each subtree gives its path from the screen root.
- **Texts** are keys of `copy/strings.csv`, and the language switches live (the Esc menu's Settings). A plain key is set as `text` and translates itself. A key with placeholders, a plural key (`tr_n`) and a key drawn in pieces are set from code with `auto_translate_mode = DISABLED`: `tr()`, then `String.format()` with the data (the samples below), rebuilt on `NOTIFICATION_TRANSLATION_CHANGED`. A "text from data" (names, the room code, times, numbers) is set in code and never translated (`auto_translate_mode = DISABLED`).

M opens and closes this screen over the running round (press, not hold; rebindable, #211); Tab does nothing here. The mouse is freed while it is open and the player keeps walking: only the mouse look stops. Nothing here is a HUD hint: the map never shows players, items, roles, teammates or done points. The MVP: the five MVP task types, the House's rooms, Delivery's zones gone and the zone highlight kept for the MVP tasks; the pin 42 px and the you-are-here chip clear of it. Every length the old x 1.5, the panels kept inside the frame. Input while it is open: the gameplay actions keep working (move, sprint, jump, interact, talk), so Space, which jumps, must never press a focused «?»: remove Space from ui_accept in the project InputMap (Enter and the gamepad's A still press; jump keeps Space), and when the card was opened with the mouse, closing it releases focus instead of giving it back to the «?». The map's focus moves only with the arrows and the d-pad; the left stick and WASD walk.

## States

| State | Page label | What it shows |
|---|---|---|
| `list` | Задачі | The task list beside the map; nothing hovered, nothing focused. |
| `zone` | Наведено на задачу | The mouse is over the Cooking row (no look of its own): the map lights that task's zones, the kitchen here (sample data); the zone fills the room under its head. |
| `keyboard` | З клавіатури | The same from the keyboard or gamepad: an arrow or the d-pad gave Cooking's «?» focus, which shows its ring and lights the zones as hovering the row does. The only frame of this screen that shows a focus ring. |
| `guide` | Натиснуто «?» | Cooking's «?» was pressed: its how-to card opens over the map (own-work Delivery frames as a placeholder; the card holds as many frames as its task needs and scrolls sideways); Close, Esc or M closes it. |

## Node tree in `list`

- **Dim** `Panel` · variation `ToyBackdropDeep` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both
  - Note: mouse_filter IGNORE. The round keeps running behind it.
- **Tasks** `PanelContainer` · variation `ToyPanelMenu` · anchors `top_left`, offsets 60, 60, 684, 60 (left, top, right, bottom), grow end/end
  - Note: 60 px in, 624 wide (the old 80 and 608 kept near: x 1.5 would leave the frame); grows down from its top to its content (the rows, then the time). On open no control has focus (state list); the first ui_down or ui_up gives focus to the first row's «?», which lights that task's zones (state keyboard; the mouse over a row lights them with no focus, state zone). While the how-to card is open, focus_behavior_recursive = FOCUS_BEHAVIOR_DISABLED here (see Dim2).
  - **V** `VBoxContainer` · variation `ToyColumnSixteen` · gaps from the variation: separation 16
    - **Title** `Label` · variation `ToyKicker` · text `map.tasks`: en "Tasks" · uk "Задачі"
      - Note: The tile's head in small capitals (the target's tile heads); the game sets uppercase = true.
    - **Rows** `VBoxContainer` · variation `ToyColumnFour` · gaps from the variation: separation 4
      - Note: Hairline rows (ToySettingRow), 4 px apart.
      - **CarTuning** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
        - Note: One row per task type the round deals (the MVP's five: car tuning, the ship's engine, cooking, photo, Wi-Fi), in the round's task order. A counter only, never a description: what counts is each task type's data (the car's order cards, the engine's stages, the burgers, the photo, the Wi-Fi's N passwords). Hovering a row or focusing its «?» lights the task's zones.
        - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
          - **Name** `Label` · variation `ToySettingRowValue` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `task.car_tuning`: en "Car tuning" · uk "Тюнінг авто"
          - **Count** `Label` · variation `ToySettingRowText` · size flags vertical `SIZE_SHRINK_CENTER` · text `map.progress` with sample {count} = "1", {total} = "3": en "1 of 3" · uk "1 з 3"
            - Note: The task's progress of the round's total; updates live while the map is open.
          - **Help** `Button` · variation `ToyKeyRoundButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (63, 63) = Vector2(63, 63) · text from data (auto_translate_mode = DISABLED), sample: "?"
            - Note: The text ? is a glyph, not a deck key (auto_translate_mode DISABLED); focus_mode ALL. 63 x 63 (the old 42 x 1.5) so it stays round at large text. A press opens this task's how-to card (Guide); keyboard focus shows the task's zones as hovering the row does. Every ? looks the same (no seen or new mark).
      - **Engine** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
        - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
          - **Name** `Label` · variation `ToySettingRowValue` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `task.engine`: en "Ship's engine" · uk "Двигун корабля"
          - **Count** `Label` · variation `ToySettingRowText` · size flags vertical `SIZE_SHRINK_CENTER` · text `map.progress` with sample {count} = "1", {total} = "3": en "1 of 3" · uk "1 з 3"
          - **Help** `Button` · variation `ToyKeyRoundButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (63, 63) = Vector2(63, 63) · text from data (auto_translate_mode = DISABLED), sample: "?"
            - Note: As the first row's Help.
      - **Cooking** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
        - Note: mouse_entered and mouse_exited (and focus on its «?») show and hide this task's zones on the board (Kitchen/V/Area/Zone, ZoneTag).
        - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
          - **Name** `Label` · variation `ToySettingRowValue` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `task.cooking`: en "Cooking" · uk "Готування"
          - **Count** `Label` · variation `ToySettingRowText` · size flags vertical `SIZE_SHRINK_CENTER` · text `map.progress` with sample {count} = "2", {total} = "4": en "2 of 4" · uk "2 з 4"
          - **Help** `Button` · variation `ToyKeyRoundButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (63, 63) = Vector2(63, 63) · text from data (auto_translate_mode = DISABLED), sample: "?"
            - Note: As the first row's Help.
      - **Photo** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
        - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
          - **Name** `Label` · variation `ToySettingRowValue` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `task.photo`: en "Photo" · uk "Фото"
          - **Count** `Label` · variation `ToySettingRowText` · size flags vertical `SIZE_SHRINK_CENTER` · text `map.progress` with sample {count} = "0", {total} = "1": en "0 of 1" · uk "0 з 1"
          - **Help** `Button` · variation `ToyKeyRoundButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (63, 63) = Vector2(63, 63) · text from data (auto_translate_mode = DISABLED), sample: "?"
            - Note: As the first row's Help.
      - **Wifi** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
        - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
          - **Name** `Label` · variation `ToySettingRowValue` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `task.wifi`: en "Wi-Fi" · uk "Wi-Fi"
          - **Count** `Label` · variation `ToySettingRowText` · size flags vertical `SIZE_SHRINK_CENTER` · text `map.progress` with sample {count} = "1", {total} = "3": en "1 of 3" · uk "1 з 3"
          - **Help** `Button` · variation `ToyKeyRoundButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (63, 63) = Vector2(63, 63) · text from data (auto_translate_mode = DISABLED), sample: "?"
            - Note: As the first row's Help.
    - **Time** `Label` · variation `ToyTextMutedOnLight` · text `map.time` with sample {time} = "7:22": en "Time: 7:22" · uk "Час: 7:22"
      - Note: The round's time left, m:ss, updated every second.
- **Board** `PanelContainer` · variation `ToyMapBoard` · anchors `top_left`, offsets 732, 60, 1860, 1020 (left, top, right, bottom), grow end/end
  - Note: 732 to 1860 across, 60 to 1020 down: 48 px right of the task list, 60 px in. While the how-to card is open, focus_behavior_recursive = FOCUS_BEHAVIOR_DISABLED here (see Dim2).
  - **Rooms** `Control`
    - Note: Children but Head are built from the level's map data (room rects, the pin), scaled to fit this rect under the head (the sample rooms start 72 px down, 48 px in). The rects here are sample data in Rooms px (1116 x 948) until the House's map exists. Open: whether the map shows the capsules or the mutation workbench; the map never marks a mischief while the hint rule is open.
    - **Head** `Label` · variation `ToyKicker` · anchors `top_left`, offsets 48, 24, 0, 0 (left, top, right, bottom), grow end/end · text `map.title`: en "Map" · uk "Мапа"
      - Note: The board's head in small capitals (the game sets uppercase = true; the target's tile heads), map.title (the engineer's word, 2026-10-22). Fixed, not from the map data: 30 px from the board's top edge, on the line of the task list's head, and in line with the rooms' left edge.
    - **Lab** `PanelContainer` · variation `ToyMapRoom` · anchors `top_left`, offsets 48, 72, 340, 424 (left, top, right, bottom), grow end/end
      - Note: One room: its rect from the map data, its name as the head at the top left and its system B pictogram centred. Sample rooms of the House; the pictograms that fit them stand in (the garage takes the workshop's, the pantry the storage's, the study the office's, the living room the lounge's) until the House's rooms have their own; a room without one shows only its name.
      - **V** `VBoxContainer` · variation `ToyColumnEight` · gaps from the variation: separation 8
        - Note: The room as a quiet tile: its name in small capitals as the head at the top left (ToyKicker; the game sets uppercase = true), its system B pictogram (72 px, the old 48 x 1.5, in the dim colour of its head: the pack's tint_color, ui-2.2.0) centred in the rest of the room.
        - **Name** `Label` · variation `ToyKicker` · text `room.lab`: en "Lab" · uk "Лабораторія"
        - **Area** `Control` · size flags vertical `SIZE_EXPAND_FILL`
          - Note: The room under its head: the pictogram centred in it, and the lit zone filling it (Kitchen/V/Area/Zone).
          - **Icon** `TextureRect` · anchors `center`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (72, 72) · texture `room/lab` (dist/pack/icons/room/lab.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate #a39dbd (the colour the pages draw it in; the pack's copy is white)
    - **Kitchen** `PanelContainer` · variation `ToyMapRoom` · anchors `top_left`, offsets 388, 72, 760, 424 (left, top, right, bottom), grow end/end
      - **V** `VBoxContainer` · variation `ToyColumnEight` · gaps from the variation: separation 8
        - **Name** `Label` · variation `ToyKicker` · text `room.kitchen`: en "Kitchen" · uk "Кухня"
        - **Area** `Control` · size flags vertical `SIZE_EXPAND_FILL`
          - **Icon** `TextureRect` · anchors `center`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (72, 72) · texture `room/kitchen` (dist/pack/icons/room/kitchen.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate #a39dbd (the colour the pages draw it in; the pack's copy is white)
    - **Garage** `PanelContainer` · variation `ToyMapRoom` · anchors `top_left`, offsets 808, 72, 1068, 504 (left, top, right, bottom), grow end/end
      - **V** `VBoxContainer` · variation `ToyColumnEight` · gaps from the variation: separation 8
        - **Name** `Label` · variation `ToyKicker` · text `room.garage`: en "Garage" · uk "Гараж"
        - **Area** `Control` · size flags vertical `SIZE_EXPAND_FILL`
          - **Icon** `TextureRect` · anchors `center`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (72, 72) · texture `room/workshop` (dist/pack/icons/room/workshop.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate #a39dbd (the colour the pages draw it in; the pack's copy is white)
    - **Study** `PanelContainer` · variation `ToyMapRoom` · anchors `top_left`, offsets 48, 552, 340, 924 (left, top, right, bottom), grow end/end
      - **V** `VBoxContainer` · variation `ToyColumnEight` · gaps from the variation: separation 8
        - **Name** `Label` · variation `ToyKicker` · text `room.study`: en "Study" · uk "Кабінет"
        - **Area** `Control` · size flags vertical `SIZE_EXPAND_FILL`
          - **Icon** `TextureRect` · anchors `center`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (72, 72) · texture `room/office` (dist/pack/icons/room/office.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate #a39dbd (the colour the pages draw it in; the pack's copy is white)
    - **LivingRoom** `PanelContainer` · variation `ToyMapRoom` · anchors `top_left`, offsets 388, 552, 760, 924 (left, top, right, bottom), grow end/end
      - **V** `VBoxContainer` · variation `ToyColumnEight` · gaps from the variation: separation 8
        - **Name** `Label` · variation `ToyKicker` · text `room.living_room`: en "Living room" · uk "Вітальня"
        - **Area** `Control` · size flags vertical `SIZE_EXPAND_FILL`
          - **Icon** `TextureRect` · anchors `center`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (72, 72) · texture `room/lounge` (dist/pack/icons/room/lounge.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate #a39dbd (the colour the pages draw it in; the pack's copy is white)
    - **Pantry** `PanelContainer` · variation `ToyMapRoom` · anchors `top_left`, offsets 808, 584, 1068, 924 (left, top, right, bottom), grow end/end
      - **V** `VBoxContainer` · variation `ToyColumnEight` · gaps from the variation: separation 8
        - **Name** `Label` · variation `ToyKicker` · text `room.pantry`: en "Pantry" · uk "Комора"
        - **Area** `Control` · size flags vertical `SIZE_EXPAND_FILL`
          - **Icon** `TextureRect` · anchors `center`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (72, 72) · texture `room/storage` (dist/pack/icons/room/storage.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate #a39dbd (the colour the pages draw it in; the pack's copy is white)
    - **Pin** `Panel` · variation `ToyMapPin` · anchors `top_left`, offsets 412, 592, 454, 634 (left, top, right, bottom), grow end/end · custom_minimum_size (42, 42) = Vector2(get_theme_constant("width", "ToyMapPin"), get_theme_constant("height", "ToyMapPin"))
      - Note: You are here: the local player's position from the map data, 42 px (its size constants; the old 28 x 1.5). pivot_offset_ratio (0.5, 0.5); rotation = PI / 4 + the player's heading on the map (0 = up, clockwise), so the sharp top-left corner points where the player looks. Updated every frame while the map is open.
    - **Here** `PanelContainer` · variation `ToyChipPlate` · anchors `top_left`, offsets 475, 582, 475, 582 (left, top, right, bottom), grow end/end
      - Note: Follows the pin: its left edge 21 px right of the pin's rect (the 9 px a turned pin's corner reaches past its rect, then 12 px), its centre on the pin's centre line; it does not rotate.
      - **Text** `Label` · variation `ToyHudCaption` · text `map.you_are_here`: en "You are here" · uk "Ти тут"

## `zone`: what differs from `list`

- **Shown:**
  - **Board/Rooms/Kitchen/V/Area/Zone** `Panel` · variation `ToyMapZone` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both
    - Note: mouse_filter IGNORE. A lit zone of the hovered or focused task (level or content data): a zone that is a whole room is the first child of the room's Area, so it fills the room under its head; a zone that is part of a room is placed the same way inside it by its rect. Cooking lights the kitchen here (sample data). Zones never light a hidden thing (nothing hidden is found by highlighting, GDD §8).
  - **Board/Rooms/ZoneTag** `PanelContainer` · variation `ToyChipLight` · anchors `top_left`, offsets 388, 442, 388, 442 (left, top, right, bottom), grow end/end
    - Note: mouse_filter IGNORE. Under the first zone's room, its left edge on the room's, 18 px below it (the old 12 x 1.5).
    - **Text** `Label` · variation `ToyChipLightText` · text `map.zone_hint.task`: en "This task is here" · uk "Тут ця задача"

## `keyboard`: what differs from `list`

- **Changed** `Tasks/V/Rows/Cooking/H/Help`: shown with keyboard focus (grab_focus)
- **Shown:**
  - **Board/Rooms/Kitchen/V/Area/Zone** `Panel` · variation `ToyMapZone` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both
    - Note: mouse_filter IGNORE. A lit zone of the hovered or focused task (level or content data): a zone that is a whole room is the first child of the room's Area, so it fills the room under its head; a zone that is part of a room is placed the same way inside it by its rect. Cooking lights the kitchen here (sample data). Zones never light a hidden thing (nothing hidden is found by highlighting, GDD §8).
  - **Board/Rooms/ZoneTag** `PanelContainer` · variation `ToyChipLight` · anchors `top_left`, offsets 388, 442, 388, 442 (left, top, right, bottom), grow end/end
    - Note: mouse_filter IGNORE. Under the first zone's room, its left edge on the room's, 18 px below it (the old 12 x 1.5).
    - **Text** `Label` · variation `ToyChipLightText` · text `map.zone_hint.task`: en "This task is here" · uk "Тут ця задача"

## `guide`: what differs from `list`

- **Shown:**
  - **Dim2** `Panel` · variation `ToyBackdrop` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both
    - Note: mouse_filter STOP: the task list and the map under the card do not react to the mouse while it is open. Keyboard and gamepad focus search ignores what is drawn on top, so while the card is open set focus_behavior_recursive = FOCUS_BEHAVIOR_DISABLED on Tasks and Board (Control, Godot 4.5+) and restore FOCUS_BEHAVIOR_INHERITED on close. The card handles ui_cancel and the map key itself and calls get_viewport().set_input_as_handled(), so one press closes only the card, never the map too.
  - **Guide** `CenterContainer` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both
    - Note: Centres the how-to card of the task whose «?» was pressed (content data per task type, #254) on the screen. Close, Esc (ui_cancel) or M closes it; focus goes back to that «?» only when the card was opened by keyboard or gamepad. mouse_filter IGNORE (Dim2 blocks the mouse).
    - **Card** `PanelContainer` · variation `ToyPanelHowto` · centred by its CenterContainer
      - Note: The same card tree as s3/Card and the Esc menu's s5 Guide/Card (Head, Scroll/Frames/Frame1..7, each holding its Art), plus Bar with Close; it takes its content's width, the Scroll's 1384 px.
      - **V** `VBoxContainer` · variation `ToyColumnTwentyFour` · gaps from the variation: separation 24
        - **Head** `VBoxContainer` · variation `ToyColumnEight` · gaps from the variation: separation 8
          - Note: The card's head as a tile head: howto.label in small capitals over the task's name.
          - **Note** `Label` · variation `ToyKicker` · text `howto.label`: en "How to" · uk "Як робити"
            - Note: The game sets uppercase = true.
          - **Title** `Label` · variation `ToyTitleOnLight` · text `task.cooking`: en "Cooking" · uk "Готування"
        - **Scroll** `ScrollContainer` · custom_minimum_size (1384, 0) · scrolls sideways: horizontal_scroll_mode `SCROLL_MODE_SHOW_NEVER` (no bar drawn), vertical_scroll_mode `SCROLL_MODE_DISABLED`; the child keeps its minimum width, the container is as tall as the child and as wide as its custom_minimum_size
          - Note: The frames scroll sideways when they do not fit (the engineer, 2026-10-22): a card holds as many frames as its task needs. No bar is drawn (SCROLL_MODE_SHOW_NEVER) until the pack has a sideways bar; the frame cut at the card's edge shows there is more. The wheel scrolls it sideways while vertical scrolling is disabled, a drag on a touch screen too (unconfirmed for Godot 4.7.2: check ScrollContainer's wheel handling); follow_focus true. The view shows three and a half frames (1384 px), as s3's.
          - **Frames** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Frame1** `PanelContainer` · variation `ToyHowtoFrame`
              - **Art** `TextureRect` · custom_minimum_size (352, 264) · texture `card/delivery-meaning-1` (dist/pack/cards/delivery-meaning-1.png, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · not tinted (drawn in its own colours)
                - Note: PLACEHOLDER art: seven own-work Delivery frames (dist/pack/cards/delivery-meaning-1..3, delivery-1..3 and delivery-meaning-4, 640x480, transparent) stand in for the Cooking card's seven frames, which the engineer named every card's placeholder (2026-10-22). Those frames are generated art kept in the art track (prime-game-art#272) and this repo's licence list does not cover generated art yet, so the game takes them from the art track's pack. expand_mode IGNORE_352x264 here and in s3, 272x204 in s5's Guide, stretch_mode KEEP_ASPECT_CENTERED; SIZE here; the same card in s3, s5 and s8. The cards are wordless: a frame holds only its art, no caption.
            - **Frame2** `PanelContainer` · variation `ToyHowtoFrame`
              - **Art** `TextureRect` · custom_minimum_size (352, 264) · texture `card/delivery-meaning-2` (dist/pack/cards/delivery-meaning-2.png, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · not tinted (drawn in its own colours)
            - **Frame3** `PanelContainer` · variation `ToyHowtoFrame`
              - **Art** `TextureRect` · custom_minimum_size (352, 264) · texture `card/delivery-meaning-3` (dist/pack/cards/delivery-meaning-3.png, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · not tinted (drawn in its own colours)
            - **Frame4** `PanelContainer` · variation `ToyHowtoFrame`
              - **Art** `TextureRect` · custom_minimum_size (352, 264) · texture `card/delivery-1` (dist/pack/cards/delivery-1.png, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · not tinted (drawn in its own colours)
            - **Frame5** `PanelContainer` · variation `ToyHowtoFrame`
              - **Art** `TextureRect` · custom_minimum_size (352, 264) · texture `card/delivery-2` (dist/pack/cards/delivery-2.png, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · not tinted (drawn in its own colours)
            - **Frame6** `PanelContainer` · variation `ToyHowtoFrame`
              - **Art** `TextureRect` · custom_minimum_size (352, 264) · texture `card/delivery-3` (dist/pack/cards/delivery-3.png, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · not tinted (drawn in its own colours)
            - **Frame7** `PanelContainer` · variation `ToyHowtoFrameDone`
              - Note: The frame that shows the finish.
              - **Art** `TextureRect` · custom_minimum_size (352, 264) · texture `card/delivery-meaning-4` (dist/pack/cards/delivery-meaning-4.png, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · not tinted (drawn in its own colours)
        - **Bar** `HBoxContainer` · alignment `ALIGNMENT_END`
          - **Close** `Button` · variation `ToyButtonSecondary` · text `common.close`: en "Close" · uk "Закрити"
            - Note: Takes focus when the card opens by keyboard or gamepad, with the ring hidden until the next arrow or d-pad press (grab_focus(true), Godot 4.5+; unconfirmed for 4.7.2); opened with the mouse, nothing has focus.

## Notes

- The review page emulates Godot's containers with CSS grid (expanding children share the free space by stretch ratio, never below their minimum size), so a pixel or two may differ from Godot.
- Size constants: a variation's `width`, `height`, `min_width`, `wide_width` and `wide_min_width` theme constants are read by code into `custom_minimum_size`, as the node lines give them. A Panel or PanelContainer takes no size from them on its own: an anchored Panel at offsets 0 is 0×0, a slot shrinks to its text.
- Size constants that follow the text size: `min_width` 42 (50 in the pack's `modes.textSize.large`) of ToyKeyRoundButton. The large-text theme is swapped in while a screen is open, so code that sets custom_minimum_size from such a constant sets it again on `NOTIFICATION_THEME_CHANGED`.
- Icons: the tinted ones are white SVGs in `dist/pack/icons/` (the pack's copy of `pages/components/icons`, currentColor written as white): a TextureRect tints one with the `self_modulate` its line gives (the colour the page draws it in), a Button with its variation's `icon_*_color`, an OptionButton its arrow with `modulate_arrow`. The room pictograms are white copies too (`dist/pack/icons/room/`), drawn in the pack's `tint_color`: their lines give the `self_modulate`. The pack's `assets` list every icon with its tint and `svg_scale`.
- SVG import: Godot rasterises an SVG at import, so import each at `svg/scale` = the largest size it is drawn ÷ its viewBox (the largest over every screen that draws it, as the pack's `assets` give it): `room/kitchen` 1.5 (72 px), `room/lab` 1.5 (72 px), `room/lounge` 1.5 (72 px), `room/office` 1.5 (72 px), `room/storage` 1.5 (72 px), `room/workshop` 1.5 (72 px).
- Card art: the how-to frames draw the pack's PNGs, `dist/pack/cards/delivery-1.png`, `dist/pack/cards/delivery-2.png`, `dist/pack/cards/delivery-3.png`, `dist/pack/cards/delivery-meaning-1.png`, `dist/pack/cards/delivery-meaning-2.png`, `dist/pack/cards/delivery-meaning-3.png`, `dist/pack/cards/delivery-meaning-4.png` (640x480, transparent, own work; rendered from `pages/card-art/round-2/clean-sketch/`, `pages/card-art/round-3/a/` by `tools/card-art/render.js`), in their own colours, never tinted. They are drawn smaller than their size (up to 352x264 px here), so import them as Texture2D with `compress/mode` Lossless and `mipmaps/generate` on.
- Boxes and grids take their gaps only from their spacing variation (ToyColumn…, ToyRow…, ToyGrid…), and a ScrollContainer the gap to its bar from ToyScroll; a box without one has a single child. No `theme_override_constants`: the theme test forbids them.

## Keys

- **Drawn** (19): `common.close`, `howto.label`, `map.progress`, `map.tasks`, `map.time`, `map.title`, `map.you_are_here`, `map.zone_hint.task`, `room.garage`, `room.kitchen`, `room.lab`, `room.living_room`, `room.pantry`, `room.study`, `task.car_tuning`, `task.cooking`, `task.engine`, `task.photo`, `task.wifi`.

## Layers and input (every screen)

| CanvasLayer | What |
|---|---|
| 1 | Name plates in the world (s4, s7) |
| 2 | HUD: the round HUD (s7), downed and the dead's room (s9), the lobby HUD (s4), the tutorial's lesson plates (s1) |
| 3 | Map and tasks (s8), with its how-to card |
| 4 | Esc menu (s5) and its dim |
| 5 | The Esc menu's confirm dialog |
| 6 | Black screens: connecting and loading (s3), pre game (s6), post game (s10) |

- The game boots straight into the ship (the lobby, s4); the suit menu (s5) hosts, joins and holds Settings.
- The mutation workbench (s11) is on no CanvasLayer: it is a SubViewport drawn on the machine in the world, under the HUD.
- Esc closes the topmost open overlay first (a how-to card, then the map; in the Esc menu its confirm dialog, then the menu) and opens the Esc menu only when nothing else is open. M is ignored while the Esc menu is open.
