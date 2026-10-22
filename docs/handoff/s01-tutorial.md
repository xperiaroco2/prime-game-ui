# 1 · Tutorial

<!-- node pages/screens/build.js --handoff s1 (prime-game-ui, pages/screens/src/s01-tutorial.json); generated, do not edit by hand -->

The styled tutorial screen from the UI track (xperiaroco2/prime-game-ui), as a Godot 4.7.2 node tree for the 1920×1080 reference.

- **Source:** `pages/screens/src/s01-tutorial.json`; the review page is `pages/screens/screens.html#s1`; the wireframe is section `s1` («Перший запуск і навчання»).
- **Theme:** the Toy pack ui-2.1.1 (`dist/pack/toy.pack.json`); the variations below are `theme_type_variation` names.
- **World behind the UI** (not UI): a lit room of the level.
- **How to read it:** the roots are children of the screen's full-rect root `Control`; every property not listed keeps Godot's default; sizes and offsets are reference px. In a state's **Shown** list, the first node of each subtree gives its path from the screen root.
- **Texts** are keys of `copy/strings.csv`, and the language switches live (the Esc menu's Settings). A plain key is set as `text` and translates itself. A key with placeholders, a plural key (`tr_n`) and a key drawn in pieces are set from code with `auto_translate_mode = DISABLED`: `tr()`, then `String.format()` with the data (the samples below), rebuilt on `NOTIFICATION_TRANSLATION_CHANGED`. A "text from data" (names, the room code, times, numbers) is set in code and never translated (`auto_translate_mode = DISABLED`).

The tutorial room. On the first launch the invite with the language choice; in the room, the current lesson at the top and the lesson list at the right, over the MVP round HUD of s7 without the timer, the anger meter, the roster and the role (Hud). After lesson 9 the game returns to the ship (the player's own, no session) with no end screen, where the game boots (the engineer, 2026-10-21). The nine lessons are the game's (GDD §15: Throwing replaced Delivery in #901); which lessons the MVP adds (points and the workbench, the neighbours' anger and the cops, a task) is open, the engineer's design. Lesson 2 names the battery, an MVP item (a draft; which item lies in the room is the game's data).

## States

| State | Page label | What it shows |
|---|---|---|
| `invite` | Запрошення | First launch only (a user:// flag). Focus starts on Start the tutorial. |
| `step` | Крок навчання | Lesson 2, its first instruction: a sentence with one keycap. |
| `step-keys` | Крок: керування | Lesson 1 (Controls): a row of keycaps instead of the sentence. |
| `step-howto` | Крок: «?» на мапі | Lesson 5, its second instruction: the round «?» keycap inside the sentence. The map (s8) is open in this lesson; it is not drawn here, nor the HUD under its dim. |
| `step-dead` | Крок: смерть | Lesson 7 (Death): the player died and waits in the dead's room (m8 §3), so the round HUD is hidden; the dead's room overlay is s9's and is not drawn here. Its two lines are drafts. |

## Node tree in `invite`

- **Dim** `Panel` · variation `ToyBackdrop` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both
  - Note: Dims the tutorial room behind the invite.
- **Lang** `HBoxContainer` · variation `ToyRowTwelve` · anchors `top_right`, offsets -39, 39, -39, 39 (left, top, right, bottom), grow begin/end · gaps from the variation: separation 12
  - Note: The two chips share one ButtonGroup. The default is Ukrainian when OS.get_locale_language() is "uk", else English. A press applies at once (TranslationServer.set_locale) and is saved; the invite's texts rebuild on NOTIFICATION_TRANSLATION_CHANGED.
  - **Uk** `Button` · variation `ToyChipToggleOnDark` · text `lang.uk`: en "Українська" · uk "Українська" · button_pressed while this is the game's language (TranslationServer.get_locale()); the page draws the shown language's chip pressed · toggle_mode true, button_pressed true (ToyToggle draws `ToyChipToggleOnDarkSelected`)
    - Note: A language's name is always in its own language: lang.uk holds the same word in every locale, so the key translates to it.
  - **En** `Button` · variation `ToyChipToggleOnDark` · text `lang.en`: en "English" · uk "English" · button_pressed while this is the game's language (TranslationServer.get_locale()); the page draws the shown language's chip pressed · toggle_mode true, button_pressed false
    - Note: lang.en holds the same word in every locale.
- **Box** `PanelContainer` · variation `ToyPanelDialog` · anchors `center`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (1032, 0)
  - **V** `VBoxContainer` · variation `ToyColumnThirtyTwo` · gaps from the variation: separation 32
    - **Text** `VBoxContainer` · variation `ToyColumnSixteen` · gaps from the variation: separation 16
      - **Title** `Label` · variation `ToyTitleOnLight` · text `tutorial.invite.title`: en "First time here?" · uk "Перший раз тут?" · horizontal_alignment `CENTER`
      - **Body** `Label` · variation `ToyTextMutedOnLight` · custom_minimum_size (720, 0) · text `tutorial.invite.body`: en "About three minutes, only once." · uk "Близько трьох хвилин, лише один раз." · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
    - **Buttons** `HBoxContainer` · variation `ToyRowTwentyFour` · gaps from the variation: separation 24 · alignment `ALIGNMENT_CENTER`
      - **Start** `Button` · variation `ToyButtonPrimary` · text `tutorial.invite.start`: en "Start the tutorial" · uk "Почати навчання" · shown with keyboard focus (grab_focus)
        - Note: Focused on open. Starts lesson 1 and hides the invite for good.
      - **Skip** `Button` · variation `ToyButtonGhostOnLight` · text `tutorial.invite.skip`: en "Skip" · uk "Пропустити"
        - Note: Closes the invite for good; the player stays in the ship, where the game booted. Esc (ui_cancel) does the same.

## `step`: what differs from `invite`

- **Hidden:** `Dim`, `Lang`, `Box`.
- **Shown:**
  - **Hud** `Control` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both
    - Note: Not part of this scene: the MVP round HUD of s7 (s7/Hud) as in a round, without the timer, the anger meter, the roster (the lesson list takes the top right) and the role; Aim shows as in s7 (not drawn here). Drawn here only to show what the lesson plates share the screen with: the suit tile (health and stamina as ten pips each) at the bottom left with the mic beside it, the hand and belt tiles at the bottom right (both empty here), placed as in s7. Build it once, in s7.
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
  - **Step** `PanelContainer` · variation `ToyPlate` · anchors `center_top`, offsets 0, 39, 0, 39 (left, top, right, bottom), grow both/end · custom_minimum_size (1140, 0)
    - Note: mouse_filter IGNORE (and its children). The current lesson. A lesson advances when the game sees its action; a lesson with two instructions swaps Title and How within the same step number. The lessons (Progress {count} of 9; the list key; the title key, the how key and the binding that fills {key}): 1 tutorial.list.move: tutorial.step.move.title with the key row HowKeys (control.forward, control.left, control.backward, control.right, control.sprint, control.jump), advancing once the player has moved. 2 tutorial.list.pick_up: tutorial.step.pick_up.title, tutorial.step.pick_up.how, control.interact (E); then tutorial.step.put_down.title, tutorial.step.press, control.put_down (Q). 3 tutorial.list.hand_belt: tutorial.step.hand_belt.title, tutorial.step.press, control.swap (X). 4 tutorial.list.throw: tutorial.step.throw.title, tutorial.step.throw.how, control.throw (G). 5 tutorial.list.map: tutorial.step.map.title, tutorial.step.press, control.map (M); then tutorial.step.howto.title, tutorial.step.howto.how with the round «?» keycap (the map's «?» button). 6 tutorial.list.downed: tutorial.step.downed.title, tutorial.step.downed.how, control.interact held (E). 7 tutorial.list.death: tutorial.step.dead_room.title, tutorial.step.dead_room.how (drafts), no key: the player waits in the dead's room (m8 §3) and comes back at a capsule. 8 tutorial.list.voice: tutorial.step.voice.title, tutorial.step.voice.how, no key. 9 tutorial.list.menu: tutorial.step.menu.title, tutorial.step.press, Esc (ui_cancel, a wide keycap).
    - **V** `VBoxContainer` · variation `ToyColumnTwelve` · gaps from the variation: separation 12 · alignment `ALIGNMENT_CENTER`
      - **Progress** `Label` · variation `ToyPlateTextMuted` · text `tutorial.step.progress` with sample {count} = "2", {total} = "9": en "Step 2 of 9" · uk "Крок 2 з 9" · horizontal_alignment `CENTER`
      - **Title** `Label` · variation `ToyPlateTitle` · custom_minimum_size (900, 0) · text `tutorial.step.pick_up.title`: en "Pick up the battery" · uk "Візьми батарейку" · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
      - **How** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12 · alignment `ALIGNMENT_CENTER`
        - Note: A sentence with a keycap (P3), built in code: tr() the lesson's how-string, split it at {key}, strip_edges() each piece, add a Label per non-empty piece and the keycap between them; a how-string without {key} (death, voice) is one Label. The keycap is a ToyKeyOnDark PanelContainer holding a ToyKeyText Label: DisplayServer.keyboard_get_label_from_physical() of the action's binding (#211); Space and the mouse buttons use key.space, key.mouse_left, key.mouse_right, and Space, Shift, Tab and Esc keycaps take the wide size. Lesson 5's «?» is a ToyKeyRound keycap with the text «?», the look of the map's «?» button.
        - **Before** `Label` · variation `ToyPlateText` · size flags vertical `SIZE_SHRINK_CENTER` · text piece 0 of `tr("tutorial.step.pick_up.how")` split at {key}/{preset} (strip_edges(); hidden when the piece is empty) with sample {key} = "E": en "Aim at the battery and press" · uk "Наведи приціл на батарейку і натисни"
        - **Key** `PanelContainer` · variation `ToyKeyOnDark` · custom_minimum_size (42, 0) = Vector2(get_theme_constant("min_width", "ToyKeyOnDark"), 0)
          - **Text** `Label` · variation `ToyKeyText` · text the value of {key} in `tutorial.step.pick_up.how` with sample {key} = "E": en "E" · uk "E" · horizontal_alignment `CENTER`
  - **List** `PanelContainer` · variation `ToyPlate` · anchors `top_right`, offsets -39, 270, -39, 270 (left, top, right, bottom), grow begin/end · custom_minimum_size (520, 0)
    - Note: mouse_filter IGNORE; not clickable. The nine lessons in order, built in code: a done lesson is its name with a check at the right edge (XDone), the current one a one-line light chip (XNow), the rest muted and wrapping (the plain names). 520 px holds every lesson's chip at large text.
    - **V** `VBoxContainer` · variation `ToyColumnTwentyFour` · gaps from the variation: separation 24
      - **Head** `Label` · variation `ToyPlateText` · text `tutorial.list.title`: en "Tutorial" · uk "Навчання"
      - **Rows** `VBoxContainer` · variation `ToyColumnTwelve` · gaps from the variation: separation 12
        - **MoveDone** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
          - **Name** `Label` · variation `ToyPlateText` · size flags horizontal `SIZE_EXPAND_FILL` · custom_minimum_size (360, 0) · text `tutorial.list.move`: en "Controls" · uk "Керування" · autowrap_mode `AUTOWRAP_WORD_SMART`
          - **Check** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (36, 36) · texture `check` (dist/pack/icons/check.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToyPlateText")
        - **PickUpNow** `PanelContainer` · variation `ToyChipLight` · size flags horizontal `SIZE_SHRINK_BEGIN`
          - **Name** `Label` · variation `ToyChipLightText` · text `tutorial.list.pick_up`: en "Picking up and putting down" · uk "Взяти й покласти"
        - **HandBelt** `Label` · variation `ToyPlateTextMuted` · custom_minimum_size (360, 0) · text `tutorial.list.hand_belt`: en "Hand and belt" · uk "Рука й пояс" · autowrap_mode `AUTOWRAP_WORD_SMART`
        - **Throw** `Label` · variation `ToyPlateTextMuted` · custom_minimum_size (360, 0) · text `tutorial.list.throw`: en "Throwing" · uk "Кидання" · autowrap_mode `AUTOWRAP_WORD_SMART`
        - **Map** `Label` · variation `ToyPlateTextMuted` · custom_minimum_size (360, 0) · text `tutorial.list.map` with sample {key} = "M": en "Map and tasks (M)" · uk "Мапа й задачі (M)" · autowrap_mode `AUTOWRAP_WORD_SMART`
          - Note: {key} is the bound key of the map action (control.map).
        - **Downed** `Label` · variation `ToyPlateTextMuted` · custom_minimum_size (360, 0) · text `tutorial.list.downed`: en "Downed" · uk "Нокдаун" · autowrap_mode `AUTOWRAP_WORD_SMART`
        - **Death** `Label` · variation `ToyPlateTextMuted` · custom_minimum_size (360, 0) · text `tutorial.list.death`: en "Death" · uk "Смерть" · autowrap_mode `AUTOWRAP_WORD_SMART`
        - **Voice** `Label` · variation `ToyPlateTextMuted` · custom_minimum_size (360, 0) · text `tutorial.list.voice`: en "Voice nearby" · uk "Голос поруч" · autowrap_mode `AUTOWRAP_WORD_SMART`
        - **Menu** `Label` · variation `ToyPlateTextMuted` · custom_minimum_size (360, 0) · text `tutorial.list.menu`: en "Menu" · uk "Меню" · autowrap_mode `AUTOWRAP_WORD_SMART`

## `step-keys`: what differs from `invite`

- **Hidden:** `Dim`, `Lang`, `Box`.
- **Shown:**
  - **Hud** `Control` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both
    - Note: Not part of this scene: the MVP round HUD of s7 (s7/Hud) as in a round, without the timer, the anger meter, the roster (the lesson list takes the top right) and the role; Aim shows as in s7 (not drawn here). Drawn here only to show what the lesson plates share the screen with: the suit tile (health and stamina as ten pips each) at the bottom left with the mic beside it, the hand and belt tiles at the bottom right (both empty here), placed as in s7. Build it once, in s7.
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
  - **Step** `PanelContainer` · variation `ToyPlate` · anchors `center_top`, offsets 0, 39, 0, 39 (left, top, right, bottom), grow both/end · custom_minimum_size (1140, 0)
    - Note: mouse_filter IGNORE (and its children). The current lesson. A lesson advances when the game sees its action; a lesson with two instructions swaps Title and How within the same step number. The lessons (Progress {count} of 9; the list key; the title key, the how key and the binding that fills {key}): 1 tutorial.list.move: tutorial.step.move.title with the key row HowKeys (control.forward, control.left, control.backward, control.right, control.sprint, control.jump), advancing once the player has moved. 2 tutorial.list.pick_up: tutorial.step.pick_up.title, tutorial.step.pick_up.how, control.interact (E); then tutorial.step.put_down.title, tutorial.step.press, control.put_down (Q). 3 tutorial.list.hand_belt: tutorial.step.hand_belt.title, tutorial.step.press, control.swap (X). 4 tutorial.list.throw: tutorial.step.throw.title, tutorial.step.throw.how, control.throw (G). 5 tutorial.list.map: tutorial.step.map.title, tutorial.step.press, control.map (M); then tutorial.step.howto.title, tutorial.step.howto.how with the round «?» keycap (the map's «?» button). 6 tutorial.list.downed: tutorial.step.downed.title, tutorial.step.downed.how, control.interact held (E). 7 tutorial.list.death: tutorial.step.dead_room.title, tutorial.step.dead_room.how (drafts), no key: the player waits in the dead's room (m8 §3) and comes back at a capsule. 8 tutorial.list.voice: tutorial.step.voice.title, tutorial.step.voice.how, no key. 9 tutorial.list.menu: tutorial.step.menu.title, tutorial.step.press, Esc (ui_cancel, a wide keycap).
    - **V** `VBoxContainer` · variation `ToyColumnTwelve` · gaps from the variation: separation 12 · alignment `ALIGNMENT_CENTER`
      - **Progress** `Label` · variation `ToyPlateTextMuted` · text `tutorial.step.progress` with sample {count} = "1", {total} = "9": en "Step 1 of 9" · uk "Крок 1 з 9" · horizontal_alignment `CENTER`
      - **Title** `Label` · variation `ToyPlateTitle` · custom_minimum_size (900, 0) · text `tutorial.step.move.title`: en "Move around" · uk "Походи кімнатою" · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
      - **HowKeys** `HBoxContainer` · variation `ToyRowThirtyTwo` · gaps from the variation: separation 32 · alignment `ALIGNMENT_CENTER`
        - Note: The Controls lesson: the bound keys of walking, sprinting and jumping, each group followed by its action name; it advances once the player has moved. Each keycap shows the label of its action's binding as a data text (DisplayServer.keyboard_get_label_from_physical(), #211; auto_translate_mode DISABLED); Space is key.space. Shift and Space keycaps take the wide size.
        - **Walk** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
          - **Keys** `HBoxContainer` · variation `ToyRowEight` · gaps from the variation: separation 8
            - **Forward** `PanelContainer` · variation `ToyKeyOnDark` · custom_minimum_size (42, 0) = Vector2(get_theme_constant("min_width", "ToyKeyOnDark"), 0)
              - **Text** `Label` · variation `ToyKeyText` · text from data (auto_translate_mode = DISABLED), sample: "W" · horizontal_alignment `CENTER`
            - **Left** `PanelContainer` · variation `ToyKeyOnDark` · custom_minimum_size (42, 0) = Vector2(get_theme_constant("min_width", "ToyKeyOnDark"), 0)
              - **Text** `Label` · variation `ToyKeyText` · text from data (auto_translate_mode = DISABLED), sample: "A" · horizontal_alignment `CENTER`
            - **Backward** `PanelContainer` · variation `ToyKeyOnDark` · custom_minimum_size (42, 0) = Vector2(get_theme_constant("min_width", "ToyKeyOnDark"), 0)
              - **Text** `Label` · variation `ToyKeyText` · text from data (auto_translate_mode = DISABLED), sample: "S" · horizontal_alignment `CENTER`
            - **Right** `PanelContainer` · variation `ToyKeyOnDark` · custom_minimum_size (42, 0) = Vector2(get_theme_constant("min_width", "ToyKeyOnDark"), 0)
              - **Text** `Label` · variation `ToyKeyText` · text from data (auto_translate_mode = DISABLED), sample: "D" · horizontal_alignment `CENTER`
          - **Label** `Label` · variation `ToyPlateText` · size flags vertical `SIZE_SHRINK_CENTER` · text `control.walk`: en "Walk" · uk "Ходити"
        - **Sprint** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
          - **Key** `PanelContainer` · variation `ToyKeyOnDark` · custom_minimum_size (144, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyOnDark"), 0) (wide)
            - **Text** `Label` · variation `ToyKeyText` · text from data (auto_translate_mode = DISABLED), sample: "Shift" · horizontal_alignment `CENTER`
          - **Label** `Label` · variation `ToyPlateText` · size flags vertical `SIZE_SHRINK_CENTER` · text `control.sprint`: en "Sprint" · uk "Бігти"
        - **Jump** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
          - **Key** `PanelContainer` · variation `ToyKeyOnDark` · custom_minimum_size (144, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyOnDark"), 0) (wide)
            - **Text** `Label` · variation `ToyKeyText` · text `key.space`: en "Space" · uk "Пробіл" · horizontal_alignment `CENTER`
          - **Label** `Label` · variation `ToyPlateText` · size flags vertical `SIZE_SHRINK_CENTER` · text `control.jump`: en "Jump" · uk "Стрибнути"
  - **List** `PanelContainer` · variation `ToyPlate` · anchors `top_right`, offsets -39, 270, -39, 270 (left, top, right, bottom), grow begin/end · custom_minimum_size (520, 0)
    - Note: mouse_filter IGNORE; not clickable. The nine lessons in order, built in code: a done lesson is its name with a check at the right edge (XDone), the current one a one-line light chip (XNow), the rest muted and wrapping (the plain names). 520 px holds every lesson's chip at large text.
    - **V** `VBoxContainer` · variation `ToyColumnTwentyFour` · gaps from the variation: separation 24
      - **Head** `Label` · variation `ToyPlateText` · text `tutorial.list.title`: en "Tutorial" · uk "Навчання"
      - **Rows** `VBoxContainer` · variation `ToyColumnTwelve` · gaps from the variation: separation 12
        - **MoveNow** `PanelContainer` · variation `ToyChipLight` · size flags horizontal `SIZE_SHRINK_BEGIN`
          - Note: The current lesson: a one-line chip (a pill does not wrap).
          - **Name** `Label` · variation `ToyChipLightText` · text `tutorial.list.move`: en "Controls" · uk "Керування"
        - **PickUp** `Label` · variation `ToyPlateTextMuted` · custom_minimum_size (360, 0) · text `tutorial.list.pick_up`: en "Picking up and putting down" · uk "Взяти й покласти" · autowrap_mode `AUTOWRAP_WORD_SMART`
        - **HandBelt** `Label` · variation `ToyPlateTextMuted` · custom_minimum_size (360, 0) · text `tutorial.list.hand_belt`: en "Hand and belt" · uk "Рука й пояс" · autowrap_mode `AUTOWRAP_WORD_SMART`
        - **Throw** `Label` · variation `ToyPlateTextMuted` · custom_minimum_size (360, 0) · text `tutorial.list.throw`: en "Throwing" · uk "Кидання" · autowrap_mode `AUTOWRAP_WORD_SMART`
        - **Map** `Label` · variation `ToyPlateTextMuted` · custom_minimum_size (360, 0) · text `tutorial.list.map` with sample {key} = "M": en "Map and tasks (M)" · uk "Мапа й задачі (M)" · autowrap_mode `AUTOWRAP_WORD_SMART`
          - Note: {key} is the bound key of the map action (control.map).
        - **Downed** `Label` · variation `ToyPlateTextMuted` · custom_minimum_size (360, 0) · text `tutorial.list.downed`: en "Downed" · uk "Нокдаун" · autowrap_mode `AUTOWRAP_WORD_SMART`
        - **Death** `Label` · variation `ToyPlateTextMuted` · custom_minimum_size (360, 0) · text `tutorial.list.death`: en "Death" · uk "Смерть" · autowrap_mode `AUTOWRAP_WORD_SMART`
        - **Voice** `Label` · variation `ToyPlateTextMuted` · custom_minimum_size (360, 0) · text `tutorial.list.voice`: en "Voice nearby" · uk "Голос поруч" · autowrap_mode `AUTOWRAP_WORD_SMART`
        - **Menu** `Label` · variation `ToyPlateTextMuted` · custom_minimum_size (360, 0) · text `tutorial.list.menu`: en "Menu" · uk "Меню" · autowrap_mode `AUTOWRAP_WORD_SMART`

## `step-howto`: what differs from `invite`

- **Hidden:** `Dim`, `Lang`, `Box`.
- **Shown:**
  - **Step** `PanelContainer` · variation `ToyPlate` · anchors `center_top`, offsets 0, 39, 0, 39 (left, top, right, bottom), grow both/end · custom_minimum_size (1140, 0)
    - Note: mouse_filter IGNORE (and its children). The current lesson. A lesson advances when the game sees its action; a lesson with two instructions swaps Title and How within the same step number. The lessons (Progress {count} of 9; the list key; the title key, the how key and the binding that fills {key}): 1 tutorial.list.move: tutorial.step.move.title with the key row HowKeys (control.forward, control.left, control.backward, control.right, control.sprint, control.jump), advancing once the player has moved. 2 tutorial.list.pick_up: tutorial.step.pick_up.title, tutorial.step.pick_up.how, control.interact (E); then tutorial.step.put_down.title, tutorial.step.press, control.put_down (Q). 3 tutorial.list.hand_belt: tutorial.step.hand_belt.title, tutorial.step.press, control.swap (X). 4 tutorial.list.throw: tutorial.step.throw.title, tutorial.step.throw.how, control.throw (G). 5 tutorial.list.map: tutorial.step.map.title, tutorial.step.press, control.map (M); then tutorial.step.howto.title, tutorial.step.howto.how with the round «?» keycap (the map's «?» button). 6 tutorial.list.downed: tutorial.step.downed.title, tutorial.step.downed.how, control.interact held (E). 7 tutorial.list.death: tutorial.step.dead_room.title, tutorial.step.dead_room.how (drafts), no key: the player waits in the dead's room (m8 §3) and comes back at a capsule. 8 tutorial.list.voice: tutorial.step.voice.title, tutorial.step.voice.how, no key. 9 tutorial.list.menu: tutorial.step.menu.title, tutorial.step.press, Esc (ui_cancel, a wide keycap).
    - **V** `VBoxContainer` · variation `ToyColumnTwelve` · gaps from the variation: separation 12 · alignment `ALIGNMENT_CENTER`
      - **Progress** `Label` · variation `ToyPlateTextMuted` · text `tutorial.step.progress` with sample {count} = "5", {total} = "9": en "Step 5 of 9" · uk "Крок 5 з 9" · horizontal_alignment `CENTER`
      - **Title** `Label` · variation `ToyPlateTitle` · custom_minimum_size (900, 0) · text `tutorial.step.howto.title`: en "See how a task is done" · uk "Подивись, як виконати задачу" · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
      - **How** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12 · alignment `ALIGNMENT_CENTER`
        - Note: A sentence with a keycap (P3), built in code: tr() the lesson's how-string, split it at {key}, strip_edges() each piece, add a Label per non-empty piece and the keycap between them; a how-string without {key} (death, voice) is one Label. The keycap is a ToyKeyOnDark PanelContainer holding a ToyKeyText Label: DisplayServer.keyboard_get_label_from_physical() of the action's binding (#211); Space and the mouse buttons use key.space, key.mouse_left, key.mouse_right, and Space, Shift, Tab and Esc keycaps take the wide size. Lesson 5's «?» is a ToyKeyRound keycap with the text «?», the look of the map's «?» button.
        - **Before** `Label` · variation `ToyPlateText` · size flags vertical `SIZE_SHRINK_CENTER` · text piece 0 of `tr("tutorial.step.howto.how")` split at {key}/{preset} (strip_edges(); hidden when the piece is empty) with sample {key} = "?": en "Press" · uk "Натисни"
        - **Key** `PanelContainer` · variation `ToyKeyRound` · custom_minimum_size (42, 0) = Vector2(get_theme_constant("min_width", "ToyKeyRound"), 0)
          - **Text** `Label` · variation `ToyKeyText` · text the value of {key} in `tutorial.step.howto.how` with sample {key} = "?": en "?" · uk "?" · horizontal_alignment `CENTER`
        - **After** `Label` · variation `ToyPlateText` · size flags vertical `SIZE_SHRINK_CENTER` · text piece 1 of `tr("tutorial.step.howto.how")` split at {key}/{preset} (strip_edges(); hidden when the piece is empty) with sample {key} = "?": en "next to a task" · uk "біля задачі"
  - **List** `PanelContainer` · variation `ToyPlate` · anchors `top_right`, offsets -39, 270, -39, 270 (left, top, right, bottom), grow begin/end · custom_minimum_size (520, 0)
    - Note: mouse_filter IGNORE; not clickable. The nine lessons in order, built in code: a done lesson is its name with a check at the right edge (XDone), the current one a one-line light chip (XNow), the rest muted and wrapping (the plain names). 520 px holds every lesson's chip at large text.
    - **V** `VBoxContainer` · variation `ToyColumnTwentyFour` · gaps from the variation: separation 24
      - **Head** `Label` · variation `ToyPlateText` · text `tutorial.list.title`: en "Tutorial" · uk "Навчання"
      - **Rows** `VBoxContainer` · variation `ToyColumnTwelve` · gaps from the variation: separation 12
        - **MoveDone** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
          - **Name** `Label` · variation `ToyPlateText` · size flags horizontal `SIZE_EXPAND_FILL` · custom_minimum_size (360, 0) · text `tutorial.list.move`: en "Controls" · uk "Керування" · autowrap_mode `AUTOWRAP_WORD_SMART`
          - **Check** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (36, 36) · texture `check` (dist/pack/icons/check.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToyPlateText")
        - **PickUpDone** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
          - **Name** `Label` · variation `ToyPlateText` · size flags horizontal `SIZE_EXPAND_FILL` · custom_minimum_size (360, 0) · text `tutorial.list.pick_up`: en "Picking up and putting down" · uk "Взяти й покласти" · autowrap_mode `AUTOWRAP_WORD_SMART`
          - **Check** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (36, 36) · texture `check` (dist/pack/icons/check.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToyPlateText")
        - **HandBeltDone** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
          - **Name** `Label` · variation `ToyPlateText` · size flags horizontal `SIZE_EXPAND_FILL` · custom_minimum_size (360, 0) · text `tutorial.list.hand_belt`: en "Hand and belt" · uk "Рука й пояс" · autowrap_mode `AUTOWRAP_WORD_SMART`
          - **Check** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (36, 36) · texture `check` (dist/pack/icons/check.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToyPlateText")
        - **ThrowDone** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
          - **Name** `Label` · variation `ToyPlateText` · size flags horizontal `SIZE_EXPAND_FILL` · custom_minimum_size (360, 0) · text `tutorial.list.throw`: en "Throwing" · uk "Кидання" · autowrap_mode `AUTOWRAP_WORD_SMART`
          - **Check** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (36, 36) · texture `check` (dist/pack/icons/check.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToyPlateText")
        - **MapNow** `PanelContainer` · variation `ToyChipLight` · size flags horizontal `SIZE_SHRINK_BEGIN`
          - **Name** `Label` · variation `ToyChipLightText` · text `tutorial.list.map` with sample {key} = "M": en "Map and tasks (M)" · uk "Мапа й задачі (M)"
        - **Downed** `Label` · variation `ToyPlateTextMuted` · custom_minimum_size (360, 0) · text `tutorial.list.downed`: en "Downed" · uk "Нокдаун" · autowrap_mode `AUTOWRAP_WORD_SMART`
        - **Death** `Label` · variation `ToyPlateTextMuted` · custom_minimum_size (360, 0) · text `tutorial.list.death`: en "Death" · uk "Смерть" · autowrap_mode `AUTOWRAP_WORD_SMART`
        - **Voice** `Label` · variation `ToyPlateTextMuted` · custom_minimum_size (360, 0) · text `tutorial.list.voice`: en "Voice nearby" · uk "Голос поруч" · autowrap_mode `AUTOWRAP_WORD_SMART`
        - **Menu** `Label` · variation `ToyPlateTextMuted` · custom_minimum_size (360, 0) · text `tutorial.list.menu`: en "Menu" · uk "Меню" · autowrap_mode `AUTOWRAP_WORD_SMART`

## `step-dead`: what differs from `invite`

- **Hidden:** `Dim`, `Lang`, `Box`.
- **Shown:**
  - **Step** `PanelContainer` · variation `ToyPlate` · anchors `center_top`, offsets 0, 39, 0, 39 (left, top, right, bottom), grow both/end · custom_minimum_size (1140, 0)
    - Note: mouse_filter IGNORE (and its children). The current lesson. A lesson advances when the game sees its action; a lesson with two instructions swaps Title and How within the same step number. The lessons (Progress {count} of 9; the list key; the title key, the how key and the binding that fills {key}): 1 tutorial.list.move: tutorial.step.move.title with the key row HowKeys (control.forward, control.left, control.backward, control.right, control.sprint, control.jump), advancing once the player has moved. 2 tutorial.list.pick_up: tutorial.step.pick_up.title, tutorial.step.pick_up.how, control.interact (E); then tutorial.step.put_down.title, tutorial.step.press, control.put_down (Q). 3 tutorial.list.hand_belt: tutorial.step.hand_belt.title, tutorial.step.press, control.swap (X). 4 tutorial.list.throw: tutorial.step.throw.title, tutorial.step.throw.how, control.throw (G). 5 tutorial.list.map: tutorial.step.map.title, tutorial.step.press, control.map (M); then tutorial.step.howto.title, tutorial.step.howto.how with the round «?» keycap (the map's «?» button). 6 tutorial.list.downed: tutorial.step.downed.title, tutorial.step.downed.how, control.interact held (E). 7 tutorial.list.death: tutorial.step.dead_room.title, tutorial.step.dead_room.how (drafts), no key: the player waits in the dead's room (m8 §3) and comes back at a capsule. 8 tutorial.list.voice: tutorial.step.voice.title, tutorial.step.voice.how, no key. 9 tutorial.list.menu: tutorial.step.menu.title, tutorial.step.press, Esc (ui_cancel, a wide keycap).
    - **V** `VBoxContainer` · variation `ToyColumnTwelve` · gaps from the variation: separation 12 · alignment `ALIGNMENT_CENTER`
      - **Progress** `Label` · variation `ToyPlateTextMuted` · text `tutorial.step.progress` with sample {count} = "7", {total} = "9": en "Step 7 of 9" · uk "Крок 7 з 9" · horizontal_alignment `CENTER`
      - **Title** `Label` · variation `ToyPlateTitle` · custom_minimum_size (900, 0) · text `tutorial.step.dead_room.title`: en "Wait in the dead's room" · uk "Перечекай у кімнаті мертвих" · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
      - **HowText** `Label` · variation `ToyPlateText` · text `tutorial.step.dead_room.how`: en "You're back at a capsule" · uk "Повернешся в одній із капсул" · horizontal_alignment `CENTER`
        - Note: A how-string without {key}: one Label (voice's works the same).
  - **List** `PanelContainer` · variation `ToyPlate` · anchors `top_right`, offsets -39, 270, -39, 270 (left, top, right, bottom), grow begin/end · custom_minimum_size (520, 0)
    - Note: mouse_filter IGNORE; not clickable. The nine lessons in order, built in code: a done lesson is its name with a check at the right edge (XDone), the current one a one-line light chip (XNow), the rest muted and wrapping (the plain names). 520 px holds every lesson's chip at large text.
    - **V** `VBoxContainer` · variation `ToyColumnTwentyFour` · gaps from the variation: separation 24
      - **Head** `Label` · variation `ToyPlateText` · text `tutorial.list.title`: en "Tutorial" · uk "Навчання"
      - **Rows** `VBoxContainer` · variation `ToyColumnTwelve` · gaps from the variation: separation 12
        - **MoveDone** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
          - **Name** `Label` · variation `ToyPlateText` · size flags horizontal `SIZE_EXPAND_FILL` · custom_minimum_size (360, 0) · text `tutorial.list.move`: en "Controls" · uk "Керування" · autowrap_mode `AUTOWRAP_WORD_SMART`
          - **Check** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (36, 36) · texture `check` (dist/pack/icons/check.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToyPlateText")
        - **PickUpDone** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
          - **Name** `Label` · variation `ToyPlateText` · size flags horizontal `SIZE_EXPAND_FILL` · custom_minimum_size (360, 0) · text `tutorial.list.pick_up`: en "Picking up and putting down" · uk "Взяти й покласти" · autowrap_mode `AUTOWRAP_WORD_SMART`
          - **Check** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (36, 36) · texture `check` (dist/pack/icons/check.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToyPlateText")
        - **HandBeltDone** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
          - **Name** `Label` · variation `ToyPlateText` · size flags horizontal `SIZE_EXPAND_FILL` · custom_minimum_size (360, 0) · text `tutorial.list.hand_belt`: en "Hand and belt" · uk "Рука й пояс" · autowrap_mode `AUTOWRAP_WORD_SMART`
          - **Check** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (36, 36) · texture `check` (dist/pack/icons/check.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToyPlateText")
        - **ThrowDone** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
          - **Name** `Label` · variation `ToyPlateText` · size flags horizontal `SIZE_EXPAND_FILL` · custom_minimum_size (360, 0) · text `tutorial.list.throw`: en "Throwing" · uk "Кидання" · autowrap_mode `AUTOWRAP_WORD_SMART`
          - **Check** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (36, 36) · texture `check` (dist/pack/icons/check.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToyPlateText")
        - **MapDone** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
          - **Name** `Label` · variation `ToyPlateText` · size flags horizontal `SIZE_EXPAND_FILL` · custom_minimum_size (360, 0) · text `tutorial.list.map` with sample {key} = "M": en "Map and tasks (M)" · uk "Мапа й задачі (M)" · autowrap_mode `AUTOWRAP_WORD_SMART`
          - **Check** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (36, 36) · texture `check` (dist/pack/icons/check.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToyPlateText")
        - **DownedDone** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
          - **Name** `Label` · variation `ToyPlateText` · size flags horizontal `SIZE_EXPAND_FILL` · custom_minimum_size (360, 0) · text `tutorial.list.downed`: en "Downed" · uk "Нокдаун" · autowrap_mode `AUTOWRAP_WORD_SMART`
          - **Check** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (36, 36) · texture `check` (dist/pack/icons/check.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToyPlateText")
        - **DeathNow** `PanelContainer` · variation `ToyChipLight` · size flags horizontal `SIZE_SHRINK_BEGIN`
          - **Name** `Label` · variation `ToyChipLightText` · text `tutorial.list.death`: en "Death" · uk "Смерть"
        - **Voice** `Label` · variation `ToyPlateTextMuted` · custom_minimum_size (360, 0) · text `tutorial.list.voice`: en "Voice nearby" · uk "Голос поруч" · autowrap_mode `AUTOWRAP_WORD_SMART`
        - **Menu** `Label` · variation `ToyPlateTextMuted` · custom_minimum_size (360, 0) · text `tutorial.list.menu`: en "Menu" · uk "Меню" · autowrap_mode `AUTOWRAP_WORD_SMART`

## Notes

- The review page emulates Godot's containers with CSS grid (expanding children share the free space by stretch ratio, never below their minimum size), so a pixel or two may differ from Godot.
- Size constants: a variation's `width`, `height`, `min_width`, `wide_width` and `wide_min_width` theme constants are read by code into `custom_minimum_size`, as the node lines give them. A Panel or PanelContainer takes no size from them on its own: an anchored Panel at offsets 0 is 0×0, a slot shrinks to its text.
- Size constants that follow the text size: `min_width` 42 (50 in the pack's `modes.textSize.large`) of ToyKeyOnDark, ToyKeyRound. The large-text theme is swapped in while a screen is open, so code that sets custom_minimum_size from such a constant sets it again on `NOTIFICATION_THEME_CHANGED`.
- Icons: the tinted ones are white SVGs in `dist/pack/icons/` (the pack's copy of `pages/components/icons`, currentColor written as white): a TextureRect tints one with the `self_modulate` its line gives (the colour the page draws it in), a Button with its variation's `icon_*_color`, an OptionButton its arrow with `modulate_arrow`. The room pictograms are white copies too (`dist/pack/icons/room/`), drawn in ink: their lines give the `self_modulate`. The pack's `assets` list every icon with its tint and `svg_scale`.
- SVG import: Godot rasterises an SVG at import, so import each at `svg/scale` = the largest size it is drawn ÷ its viewBox (the largest over every screen that draws it, as the pack's `assets` give it): `check` 1.5 (36 px), `mic` 1.75 (42 px), `slot-empty-belt` 0.9 (57 px), `slot-empty-hand` 0.9 (57 px).
- Boxes and grids take their gaps only from their spacing variation (ToyColumn…, ToyRow…, ToyGrid…), and a ScrollContainer the gap to its bar from ToyScroll; a box without one has a single child. No `theme_override_constants`: the theme test forbids them.

## Keys

- **Drawn** (32): `control.jump`, `control.sprint`, `control.walk`, `hud.health`, `hud.slot.belt`, `hud.slot.hand`, `hud.stamina`, `key.space`, `lang.en`, `lang.uk`, `tutorial.invite.body`, `tutorial.invite.skip`, `tutorial.invite.start`, `tutorial.invite.title`, `tutorial.list.death`, `tutorial.list.downed`, `tutorial.list.hand_belt`, `tutorial.list.map`, `tutorial.list.menu`, `tutorial.list.move`, `tutorial.list.pick_up`, `tutorial.list.throw`, `tutorial.list.title`, `tutorial.list.voice`, `tutorial.step.dead_room.how`, `tutorial.step.dead_room.title`, `tutorial.step.howto.how`, `tutorial.step.howto.title`, `tutorial.step.move.title`, `tutorial.step.pick_up.how`, `tutorial.step.pick_up.title`, `tutorial.step.progress`.
- **Named only in the notes** (wire them too): `control.backward`, `control.forward`, `control.interact`, `control.left`, `control.map`, `control.put_down`, `control.right`, `control.swap`, `control.throw`, `key.mouse_left`, `key.mouse_right`, `tutorial.step.downed.how`, `tutorial.step.downed.title`, `tutorial.step.hand_belt.title`, `tutorial.step.map.title`, `tutorial.step.menu.title`, `tutorial.step.press`, `tutorial.step.put_down.title`, `tutorial.step.throw.how`, `tutorial.step.throw.title`, `tutorial.step.voice.how`, `tutorial.step.voice.title`.

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
