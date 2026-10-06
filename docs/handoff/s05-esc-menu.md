# 5 · Esc menu

<!-- node pages/screens/build.js --handoff s5 (prime-game-ui, pages/screens/src/s05-esc-menu.json); generated, do not edit by hand -->

The styled esc menu screen from the UI track (xperiaroco2/prime-game-ui), as a Godot 4.7.2 node tree for the 1920×1080 reference.

- **Source:** `pages/screens/src/s05-esc-menu.json`; the review page is `pages/screens/screens.html#s5`; the wireframe is section `s5` («Меню Esc»).
- **Theme:** the Toy pack ui-0.3.0 (`dist/pack/toy.pack.json`); the variations below are `theme_type_variation` names.
- **World behind the UI** (not UI): a lit room of the level.
- **How to read it:** the roots are children of the screen's full-rect root `Control`; every property not listed keeps Godot's default; sizes and offsets are reference px. In a state's **Shown** list, the first node of each subtree gives its path from the screen root.
- **Texts** are keys of `copy/strings.csv`, and the language switches live (the Esc menu's Settings). A plain key is set as `text` and translates itself. A key with placeholders, a plural key (`tr_n`) and a key drawn in pieces are set from code with `auto_translate_mode = DISABLED`: `tr()`, then `String.format()` with the data (the samples below), rebuilt on `NOTIFICATION_TRANSLATION_CHANGED`. A "text from data" (names, the room code, times, numbers) is set in code and never translated (`auto_translate_mode = DISABLED`).

The menu over the running game (no pause): Esc (ui_cancel) opens and closes it; the game runs on, the mouse is free while it is open and captured again on close. While it is open the own character takes no gameplay input (it stands still: no move, look, sprint, jump, interact or item use; those keys go to the menu or nowhere); the voice keeps working as set (voice activation, or the Talk key while held). The page shows one frame per tab and case; the focused control is drawn in every state that has one.

## States

| State | Page label | What it shows |
|---|---|---|
| `lobby-host` | Лобі: хост | In the lobby, the host's view (the Esc menu opens on Lobby there): presets, the settings the host edits live, the room code with Copy, a full lobby of 10 players (the list scrolls) and Ready. Role is hidden in the lobby. |
| `lobby-guest` | Лобі: гравець | A player's view of the same tab, and everyone's in a round (settings change only in the lobby): values without steppers, tasks as static chips, the host's name by a lock. This player joined with the code, so the code row shows. |
| `lobby-no-code` | Лобі: без коду | The host's view when the code service closed or was never reachable: one line in place of the code row. |
| `character` | Персонаж | In the lobby: the name and the body colour apply live. |
| `character-round` | Персонаж у раунді | In a round: locked; the name is read-only and the swatches take no input. |
| `game-host` | Гра: хост | In a round (the menu opens on Game there), the host: Leave and Quit open the confirm dialog. |
| `game-guest` | Гра: гравець | In a round, a player: Leave and Quit act at once. |
| `game-confirm` | Гра: підтвердження | The host pressed Leave: the confirm dialog (P1) over the menu. Quit opens the same dialog titled esc.game.quit_confirm with Confirm esc.game.quit. |
| `role-engineer` | Роль: інженер | In a round only: the own role and its goal. |
| `role-dissident` | Роль: дисидент | A dissident also sees the team (one teammate here, Taras, as in s6 and s7); the list scrolls when it is longer than the view. With no teammates the Team column is hidden. |
| `guide` | Посібник | Every how-to card: the basics from the tutorial and one card per task type; Switches selected. |
| `settings-sound` | Звук і голос | Settings opens on Sound and voice. Voice activation is selected, so the threshold row shows. The main menu opens this same Settings subtree (s2). |
| `settings-controls` | Керування | Interact is capturing a key; Talk was rebound to M, so Talk and Map show Same key. The list scrolls. |
| `settings-display` | Екран | The window mode. |
| `settings-access` | Доступність | Large text and reduced motion. |
| `settings-language` | Мова | The game language; it applies at once. |
| `tutorial-game` | Навчання | The tutorial's menu: only Game, Guide and Settings; Leave goes back to the main menu. |

## Node tree in `lobby-host`

- **Dim** `Panel` · variation `ToyBackdropDeep` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both
  - Note: Dims the running game behind the menu.
- **Menu** `PanelContainer` · variation `ToyPanelMenu` (raised: ToyRaised with base `ToyBasePanel`) · anchors `center`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (1600, 880) · placement, size flags, custom_minimum_size and visibility on its ToyRaised wrapper
  - **H** `HBoxContainer` · variation `ToyRowTwentyFour` · gaps from the variation: separation 24
    - **Tabs** `VBoxContainer` · variation `ToyColumnEight` · custom_minimum_size (288, 0) · gaps from the variation: separation 8
      - Note: One ButtonGroup; the selected tab shows its page. 288 px holds the longest tab, «Налаштування», at large text, so the page never shifts between text sizes. Default tab: Lobby in the lobby, Game in a round and in the tutorial; the last tab is kept for the session. Role is hidden in the lobby; the tutorial shows only Game, Guide and Settings. Focus starts on the selected tab (drawn selected-focus); on Game, Resume takes it.
      - **Game** `Button` · variation `ToyTab` · text `esc.tab.game`: en "Game" · uk "Гра" · alignment `LEFT` · toggle_mode true, button_pressed false
      - **Guide** `Button` · variation `ToyTab` · text `esc.tab.guide`: en "Guide" · uk "Посібник" · alignment `LEFT` · toggle_mode true, button_pressed false
      - **Lobby** `Button` · variation `ToyTab` · text `esc.tab.lobby`: en "Lobby" · uk "Лобі" · alignment `LEFT` · toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`) · shown with keyboard focus (grab_focus)
      - **Character** `Button` · variation `ToyTab` · text `esc.tab.character`: en "Character" · uk "Персонаж" · alignment `LEFT` · toggle_mode true, button_pressed false
      - **Settings** `Button` · variation `ToyTab` · text `esc.tab.settings`: en "Settings" · uk "Налаштування" · alignment `LEFT` · toggle_mode true, button_pressed false
        - Note: settings-controls: focus is on the capturing Interact key, so this tab is drawn selected without focus.
    - **Page** `VBoxContainer` · variation `ToyColumnSixteen` · size flags horizontal `SIZE_EXPAND_FILL` · gaps from the variation: separation 16
      - **TitleRow** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
        - **Title** `Label` · variation `ToyTitleOnLight` · size flags horizontal `SIZE_EXPAND_FILL` · text `esc.tab.lobby`: en "Lobby" · uk "Лобі"
          - Note: The selected tab's name.
        - **HostNote** `Label` · variation `ToyTextMutedOnLight` · size flags vertical `SIZE_SHRINK_CENTER` · text `esc.lobby.you_host`: en "You're the host: everyone sees your changes" · uk "Ти хост: зміни бачать усі"
      - **Lobby** `VBoxContainer` · variation `ToyColumnSixteen` · size flags vertical `SIZE_EXPAND_FILL` · gaps from the variation: separation 16
        - **Presets** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
          - Note: One ButtonGroup over the cards (Save is not in it). A card applies its values; any other change deselects every card (a player then reads preset.custom). Save your own stores one custom preset: a card named preset.custom, built like Standard (184 x 96, V with Name and Note), appears before Save. The row is 4 x 184 + 3 x 16 = 784 px, the width of SettingList below, so the cards end where the rows end.
          - **Standard** `Button` · variation `ToyPresetCard` (raised: ToyRaised with base `ToyBaseCard`, ToyPress; UiParts.button()) · custom_minimum_size (184, 96) · placement, size flags, custom_minimum_size and visibility on its ToyRaised wrapper · no text or icon: its child is its content, drawn in its StyleBox content rect (the child and every node inside ignore the mouse, so the Button takes the press); a Button's minimum size does not follow its children, so custom_minimum_size holds the content at large text · toggle_mode true, button_pressed true (ToyToggle draws `ToyPresetCardSelected`)
            - Note: The card has no text of its own: V holds the preset's name and its note (the preset's match duration); the note is ToyPresetCardNote on an idle card and ToyPresetCardNoteSelected on the selected one. 184 px holds the longest name, «Звичайний», at large text.
            - **V** `VBoxContainer` · variation `ToyColumnFour` · the Button's content: anchors `full_rect`, offsets 14, 14, -14, -14 (the `normal` StyleBox's content margins), mouse_filter `MOUSE_FILTER_IGNORE` on it and every node inside · gaps from the variation: separation 4 · alignment `ALIGNMENT_CENTER`
              - **Name** `Label` · variation `ToyPresetCardName` · text `preset.standard`: en "Standard" · uk "Звичайний" · horizontal_alignment `CENTER`
              - **Note** `Label` · variation `ToyPresetCardNoteSelected` · text `unit.minutes` with sample {count} = "10": en "10 min" · uk "10 хв" · horizontal_alignment `CENTER`
          - **Quick** `Button` · variation `ToyPresetCard` (raised: ToyRaised with base `ToyBaseCard`, ToyPress; UiParts.button()) · custom_minimum_size (184, 96) · placement, size flags, custom_minimum_size and visibility on its ToyRaised wrapper · no text or icon: its child is its content, drawn in its StyleBox content rect (the child and every node inside ignore the mouse, so the Button takes the press); a Button's minimum size does not follow its children, so custom_minimum_size holds the content at large text · toggle_mode true, button_pressed false
            - **V** `VBoxContainer` · variation `ToyColumnFour` · the Button's content: anchors `full_rect`, offsets 14, 14, -14, -14 (the `normal` StyleBox's content margins), mouse_filter `MOUSE_FILTER_IGNORE` on it and every node inside · gaps from the variation: separation 4 · alignment `ALIGNMENT_CENTER`
              - **Name** `Label` · variation `ToyPresetCardName` · text `preset.quick`: en "Quick" · uk "Швидкий" · horizontal_alignment `CENTER`
              - **Note** `Label` · variation `ToyPresetCardNote` · text `unit.minutes` with sample {count} = "5": en "5 min" · uk "5 хв" · horizontal_alignment `CENTER`
          - **NoKnives** `Button` · variation `ToyPresetCard` (raised: ToyRaised with base `ToyBaseCard`, ToyPress; UiParts.button()) · custom_minimum_size (184, 96) · placement, size flags, custom_minimum_size and visibility on its ToyRaised wrapper · no text or icon: its child is its content, drawn in its StyleBox content rect (the child and every node inside ignore the mouse, so the Button takes the press); a Button's minimum size does not follow its children, so custom_minimum_size holds the content at large text · toggle_mode true, button_pressed false
            - **V** `VBoxContainer` · variation `ToyColumnFour` · the Button's content: anchors `full_rect`, offsets 14, 14, -14, -14 (the `normal` StyleBox's content margins), mouse_filter `MOUSE_FILTER_IGNORE` on it and every node inside · gaps from the variation: separation 4 · alignment `ALIGNMENT_CENTER`
              - **Name** `Label` · variation `ToyPresetCardName` · text `preset.no_knives`: en "No knives" · uk "Без ножів" · horizontal_alignment `CENTER`
              - **Note** `Label` · variation `ToyPresetCardNote` · text `unit.minutes` with sample {count} = "10": en "10 min" · uk "10 хв" · horizontal_alignment `CENTER`
                - Note: The preset's match duration, as on every card (its name already says there are no knives).
          - **Save** `Button` · variation `ToyPresetCard` (raised: ToyRaised with base `ToyBaseCard`, ToyPress; UiParts.button()) · custom_minimum_size (184, 96) · placement, size flags, custom_minimum_size and visibility on its ToyRaised wrapper · no text or icon: its child is its content, drawn in its StyleBox content rect (the child and every node inside ignore the mouse, so the Button takes the press); a Button's minimum size does not follow its children, so custom_minimum_size holds the content at large text
            - Note: A press button with the card's raised face (not a toggle, not in the ButtonGroup): saves the current values as the own preset. Its name wraps onto two lines where it is longer than the card.
            - **V** `VBoxContainer` · variation `ToyColumnFour` · the Button's content: anchors `full_rect`, offsets 14, 14, -14, -14 (the `normal` StyleBox's content margins), mouse_filter `MOUSE_FILTER_IGNORE` on it and every node inside · gaps from the variation: separation 4 · alignment `ALIGNMENT_CENTER`
              - **Name** `Label` · variation `ToyPresetCardName` · custom_minimum_size (120, 0) · text `preset.save_own`: en "Save your own" · uk "Зберегти свій" · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
        - **Body** `HBoxContainer` · variation `ToyRowThirtyTwo` · size flags vertical `SIZE_EXPAND_FILL` · gaps from the variation: separation 32
          - **SettingList** `VBoxContainer` · variation `ToyColumnEight` · custom_minimum_size (784, 0) · gaps from the variation: separation 8
            - Note: The host's edits apply live for everyone. 784 px is the preset row's width, so the rows end under the last card and Side starts after the 32 px gap. Every row is at least 64 px tall (the field row's height), so the rows of a list keep one height.
            - **Name** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
              - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
                - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `lobby.setting.name`: en "Lobby name" · uk "Назва лобі"
                - **Field** `LineEdit` · variation `ToyField` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (500, 0) · text (sample data) "Olena's lobby" / "Лобі: Олена" · context_menu_enabled false (Godot's right-click menu would show untranslated English labels; see the notes)
                  - Note: The lobby name (#214), lobby.default_name until the host changes it; auto_translate_mode DISABLED. editable false for a player (the quiet read-only box), who cannot scroll it, so the field shows a whole name: 500 px holds 24 characters ("Нічна зміна Мирослави №2", 447 px) at large text. max_length per #214, which has not set it yet (24 or less keeps a name whole here).
            - **Duration** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
              - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
                - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `lobby.setting.duration`: en "Match duration" · uk "Тривалість матчу"
                - **Stepper** `HBoxContainer` · variation `ToyRowEight` · size flags vertical `SIZE_SHRINK_CENTER` · gaps from the variation: separation 8
                  - **Less** `Button` · variation `ToyStepper` · icon `chevron-left` (dist/pack/icons/chevron-left.svg, own work) at 24 px, tinted by `ToyStepper`'s icon_*_color
                    - Note: Steps the value down; disabled (unplugged) at the lower bound. Keyboard and gamepad reach Less and More by focus (ui_left and ui_right move between them) and step with ui_accept. When a step reaches a bound, the other arrow takes focus (More.grab_focus()) before this one is disabled, so focus never rests on an unplugged arrow. The value is 104 px wide ("60 min" at large text), so every stepper has one width and the arrows line up down the list. Every stepper below works the same; a player sees only the value.
                  - **Value** `Label` · variation `ToySettingRowValue` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (104, 0) · text `unit.minutes` with sample {count} = "10": en "10 min" · uk "10 хв" · horizontal_alignment `CENTER`
                  - **More** `Button` · variation `ToyStepper` · icon `chevron-right` (dist/pack/icons/chevron-right.svg, own work) at 24 px, tinted by `ToyStepper`'s icon_*_color
                    - Note: Steps the value up; disabled (unplugged) at the upper bound.
            - **Packages** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
              - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
                - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `lobby.setting.packages`: en "Packages" · uk "Пакунки"
                - **Stepper** `HBoxContainer` · variation `ToyRowEight` · size flags vertical `SIZE_SHRINK_CENTER` · gaps from the variation: separation 8
                  - **Less** `Button` · variation `ToyStepper` · icon `chevron-left` (dist/pack/icons/chevron-left.svg, own work) at 24 px, tinted by `ToyStepper`'s icon_*_color
                  - **Value** `Label` · variation `ToySettingRowValue` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (104, 0) · text from data (auto_translate_mode = DISABLED), sample: "6" · horizontal_alignment `CENTER`
                    - Note: str(value) (auto_translate_mode DISABLED).
                  - **More** `Button` · variation `ToyStepper` · icon `chevron-right` (dist/pack/icons/chevron-right.svg, own work) at 24 px, tinted by `ToyStepper`'s icon_*_color
            - **Dissidents** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
              - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
                - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `lobby.setting.dissidents`: en "Dissidents" · uk "Дисиденти"
                - **Stepper** `HBoxContainer` · variation `ToyRowEight` · size flags vertical `SIZE_SHRINK_CENTER` · gaps from the variation: separation 8
                  - **Less** `Button` · variation `ToyStepper` · icon `chevron-left` (dist/pack/icons/chevron-left.svg, own work) at 24 px, tinted by `ToyStepper`'s icon_*_color · disabled true
                    - Note: Disabled (unplugged): 1 is the lower bound.
                  - **Value** `Label` · variation `ToySettingRowValue` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (104, 0) · text from data (auto_translate_mode = DISABLED), sample: "1" · horizontal_alignment `CENTER`
                    - Note: str(value) (auto_translate_mode DISABLED).
                  - **More** `Button` · variation `ToyStepper` · icon `chevron-right` (dist/pack/icons/chevron-right.svg, own work) at 24 px, tinted by `ToyStepper`'s icon_*_color
            - **Knives** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
              - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
                - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `lobby.setting.knives`: en "Knives" · uk "Ножі"
                - **Stepper** `HBoxContainer` · variation `ToyRowEight` · size flags vertical `SIZE_SHRINK_CENTER` · gaps from the variation: separation 8
                  - **Less** `Button` · variation `ToyStepper` · icon `chevron-left` (dist/pack/icons/chevron-left.svg, own work) at 24 px, tinted by `ToyStepper`'s icon_*_color
                  - **Value** `Label` · variation `ToySettingRowValue` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (104, 0) · text from data (auto_translate_mode = DISABLED), sample: "2" · horizontal_alignment `CENTER`
                    - Note: str(value) (auto_translate_mode DISABLED).
                  - **More** `Button` · variation `ToyStepper` · icon `chevron-right` (dist/pack/icons/chevron-right.svg, own work) at 24 px, tinted by `ToyStepper`'s icon_*_color
            - **Tasks** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
              - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
                - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `lobby.setting.tasks`: en "Tasks" · uk "Задачі"
                - **Allowed** `HBoxContainer` · variation `ToyRowEight` · size flags vertical `SIZE_SHRINK_CENTER` · gaps from the variation: separation 8
                  - Note: One toggle per task type, not grouped: selected = allowed.
                  - **Delivery** `Button` · variation `ToyChipToggleOnLight` · text `task.delivery`: en "Delivery" · uk "Доставка" · toggle_mode true, button_pressed true (ToyToggle draws `ToyChipToggleOnLightSelected`)
                  - **Switches** `Button` · variation `ToyChipToggleOnLight` · text `task.switches`: en "Switches" · uk "Рубильники" · toggle_mode true, button_pressed true (ToyToggle draws `ToyChipToggleOnLightSelected`)
            - **SwitchSteps** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
              - Note: One row per complex task type (#256), hidden while that task is banned.
              - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
                - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `lobby.setting.task_steps` with sample {task} = "Switches" / "Рубильники": en "Switches: step count" · uk "Рубильники: кількість кроків"
                - **Stepper** `HBoxContainer` · variation `ToyRowEight` · size flags vertical `SIZE_SHRINK_CENTER` · gaps from the variation: separation 8
                  - **Less** `Button` · variation `ToyStepper` · icon `chevron-left` (dist/pack/icons/chevron-left.svg, own work) at 24 px, tinted by `ToyStepper`'s icon_*_color
                  - **Value** `Label` · variation `ToySettingRowValue` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (104, 0) · text from data (auto_translate_mode = DISABLED), sample: "3" · horizontal_alignment `CENTER`
                    - Note: str(value) (auto_translate_mode DISABLED).
                  - **More** `Button` · variation `ToyStepper` · icon `chevron-right` (dist/pack/icons/chevron-right.svg, own work) at 24 px, tinted by `ToyStepper`'s icon_*_color
          - **Side** `VBoxContainer` · variation `ToyColumnSixteen` · size flags horizontal `SIZE_EXPAND_FILL` · gaps from the variation: separation 16
            - **CodeRow** `HBoxContainer` · variation `ToyRowEight` · gaps from the variation: separation 8
              - Note: The room code, to whoever knows it: the host who hosted with a code and each player who joined with it (never an address), drawn as a keycap as on the lobby HUD (s4, the same row). Hidden for a Direct host and for Direct joiners (no code exists).
              - **Label** `Label` · variation `ToyTextMutedOnLight` · size flags vertical `SIZE_SHRINK_CENTER` · text `common.code`: en "Code" · uk "Код"
              - **Code** `PanelContainer` · variation `ToyKeyOnLight` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (36, 0) = Vector2(get_theme_constant("min_width", "ToyKeyOnLight"), 0)
                - **Text** `Label` · variation `ToyKeyText` · text from data (auto_translate_mode = DISABLED), sample: "K7Q2XR" · horizontal_alignment `CENTER`
                  - Note: The room code (auto_translate_mode DISABLED).
              - **Copy** `Button` · variation `ToyButtonGhostOnLight` · size flags vertical `SIZE_SHRINK_CENTER` · text `esc.lobby.copy`: en "Copy" · uk "Копіювати"
                - Note: DisplayServer.clipboard_set(code); the text reads esc.lobby.copied for 1.5 s, then esc.lobby.copy again.
            - **Players** `VBoxContainer` · variation `ToyColumnEight` · size flags vertical `SIZE_EXPAND_FILL` · gaps from the variation: separation 8
              - **Count** `Label` · variation `ToyTextMutedOnLight` · text `lobby.player_count` with sample {count} = "10", {total} = "10": en "Players 10 / 10" · uk "Гравці 10 / 10"
              - **Scroll** `ScrollContainer` · variation `ToyScroll` · size flags vertical `SIZE_EXPAND_FILL` · the gap between the child and the bar from the variation: scrollbar_h_separation 8 · horizontal_scroll_mode `SCROLL_MODE_DISABLED` (vertical scrolling only); `get_v_scroll_bar().theme_type_variation = &"ToyScrollBar"`; the bar shows when the child is taller
                - Note: Takes the height left between the code row and Ready inside the fixed menu, so a full lobby of 10 never makes the menu taller: the rows scroll (lobby-host shows 10 players, lobby-guest 4). follow_focus = true.
                - **Rows** `VBoxContainer` · variation `ToyColumnEight` · size flags horizontal `SIZE_EXPAND_FILL` · gaps from the variation: separation 8
                  - **Host** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
                    - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
                      - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `player.you`: en "You" · uk "Ти" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
                        - Note: One row per player in join order: the own row reads player.you, the host's row lobby.host_mark with the host's name, the others the name alone (auto_translate_mode DISABLED). In the host's own view the first row is the own one. A long name is cut with an ellipsis, so it never widens the menu.
                  - **Taras** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
                    - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
                      - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Taras" / "Тарас" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
                      - **Ready** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (24, 24) · texture `check` (dist/pack/icons/check.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToyTextOnLight")
                  - **Ivan** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
                    - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
                      - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Ivan" / "Іван" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
                      - **Ready** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (24, 24) · texture `check` (dist/pack/icons/check.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToyTextOnLight")
                  - **Marko** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
                    - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
                      - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Marko" / "Марко" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
                      - **Ready** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (24, 24) · texture `check` (dist/pack/icons/check.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToyTextOnLight")
                  - **Oksana** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
                    - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
                      - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Oksana" / "Оксана" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
                      - **Ready** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (24, 24) · texture `check` (dist/pack/icons/check.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToyTextOnLight")
                  - **Solomiia** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
                    - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
                      - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Solomiia" / "Соломія" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
                  - **Bohdan** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
                    - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
                      - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Bohdan" / "Богдан" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
                      - **Ready** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (24, 24) · texture `check` (dist/pack/icons/check.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToyTextOnLight")
                  - **Iryna** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
                    - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
                      - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Iryna" / "Ірина" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
                  - **Dmytro** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
                    - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
                      - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Dmytro" / "Дмитро" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
                      - **Ready** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (24, 24) · texture `check` (dist/pack/icons/check.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToyTextOnLight")
                  - **Lesia** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
                    - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
                      - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Lesia" / "Леся" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
            - **Ready** `Button` · variation `ToyButtonPrimary` (raised: ToyRaised with base `ToyBasePrimaryOnLight`, ToyPress; UiParts.button()) · placement, size flags, custom_minimum_size and visibility on its ToyRaised wrapper · text `esc.lobby.ready`: en "Ready" · uk "Готовність" · toggle_mode true, button_pressed false
              - Note: Toggles the own ready state: while ready it is pressed (ToyButtonPrimary's pressed look) and shows the check icon (check.svg at 24 px, tinted by ToyButtonPrimary's icon colours) before its text, the same as the own row's mark (lobby-guest: this player is ready; the page does not draw the pressed look with its icon yet). Hidden in a round, where nobody gets ready.

## `lobby-guest`: what differs from `lobby-host`

- **Hidden:** `Menu/H/Page/TitleRow/HostNote`, `Menu/H/Page/Lobby/Presets`, `Menu/H/Page/Lobby/Body/SettingList/Duration/H/Stepper/Less`, `Menu/H/Page/Lobby/Body/SettingList/Duration/H/Stepper/More`, `Menu/H/Page/Lobby/Body/SettingList/Packages/H/Stepper/Less`, `Menu/H/Page/Lobby/Body/SettingList/Packages/H/Stepper/More`, `Menu/H/Page/Lobby/Body/SettingList/Dissidents/H/Stepper/Less`, `Menu/H/Page/Lobby/Body/SettingList/Dissidents/H/Stepper/More`, `Menu/H/Page/Lobby/Body/SettingList/Knives/H/Stepper/Less`, `Menu/H/Page/Lobby/Body/SettingList/Knives/H/Stepper/More`, `Menu/H/Page/Lobby/Body/SettingList/Tasks/H/Allowed`, `Menu/H/Page/Lobby/Body/SettingList/SwitchSteps/H/Stepper/Less`, `Menu/H/Page/Lobby/Body/SettingList/SwitchSteps/H/Stepper/More`, `Menu/H/Page/Lobby/Body/Side/Players/Scroll/Rows/Ivan`, `Menu/H/Page/Lobby/Body/Side/Players/Scroll/Rows/Marko/H/Ready`, `Menu/H/Page/Lobby/Body/Side/Players/Scroll/Rows/Oksana`, `Menu/H/Page/Lobby/Body/Side/Players/Scroll/Rows/Solomiia`, `Menu/H/Page/Lobby/Body/Side/Players/Scroll/Rows/Bohdan`, `Menu/H/Page/Lobby/Body/Side/Players/Scroll/Rows/Iryna`, `Menu/H/Page/Lobby/Body/Side/Players/Scroll/Rows/Dmytro`, `Menu/H/Page/Lobby/Body/Side/Players/Scroll/Rows/Lesia`.
- **Changed** `Menu/H/Page/Lobby/Body/SettingList/Name/H/Field`: editable false
- **Changed** `Menu/H/Page/Lobby/Body/Side/Players/Count`: text `lobby.player_count` with sample {count} = "4", {total} = "10": en "Players 4 / 10" · uk "Гравці 4 / 10" (was: text `lobby.player_count` with sample {count} = "10", {total} = "10": en "Players 10 / 10" · uk "Гравці 10 / 10")
- **Changed** `Menu/H/Page/Lobby/Body/Side/Players/Scroll/Rows/Host/H/Name`: text `lobby.host_mark` with sample {name} = "Olena" / "Олена": en "Olena · host" · uk "Олена · хост" (was: text `player.you`: en "You" · uk "Ти")
- **Shown:**
  - **Menu/H/Page/TitleRow/HostOnly** `HBoxContainer` · variation `ToyRowEight` · size flags vertical `SIZE_SHRINK_CENTER` · gaps from the variation: separation 8
    - Note: A player's view in the lobby only; hidden in a round, where nobody changes the settings and the values without steppers already read as fixed.
    - **Lock** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (20, 20) · texture `lock` (dist/pack/icons/lock.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToyTextOnLight")
      - Note: Muted like the text beside it: self_modulate = get_theme_color("font_color", "ToyTextMutedOnLight") (this replaces the generated ToyTextOnLight line).
    - **Text** `Label` · variation `ToyTextMutedOnLight` · text `esc.lobby.host_only` with sample {name} = "Olena" / "Олена": en "Only the host changes these · Olena" · uk "Змінює лише хост · Олена"
  - **Menu/H/Page/Lobby/Preset** `Label` · variation `ToyTextOnLight` · text `esc.lobby.preset` with sample {preset} = "Standard" / "Звичайний": en "Preset: Standard" · uk "Шаблон: Звичайний"
    - Note: {preset} is tr() of the applied preset's name key (preset.standard, preset.quick, preset.no_knives), or preset.custom.
  - **Menu/H/Page/Lobby/Body/SettingList/Tasks/H/Shown** `HBoxContainer` · variation `ToyRowEight` · size flags vertical `SIZE_SHRINK_CENTER` · gaps from the variation: separation 8
    - Note: A player sees allowed tasks as ToyChipLight plates and banned ones as ToyChipLineOnLight plates with ToyChipLineOnLightText.
    - **Delivery** `PanelContainer` · variation `ToyChipLight`
      - **Text** `Label` · variation `ToyChipLightText` · text `task.delivery`: en "Delivery" · uk "Доставка"
    - **Switches** `PanelContainer` · variation `ToyChipLight`
      - **Text** `Label` · variation `ToyChipLightText` · text `task.switches`: en "Switches" · uk "Рубильники"
  - **Menu/H/Page/Lobby/Body/Side/Players/Scroll/Rows/Host/H/Ready** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (24, 24) · texture `check` (dist/pack/icons/check.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToyTextOnLight")
    - Note: Shown while the player is ready; not ready leaves the slot empty (no dash). The marks are hidden in a round.
  - **Menu/H/Page/Lobby/Body/Side/Players/Scroll/Rows/You** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
    - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
      - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `player.you`: en "You" · uk "Ти" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`

## `lobby-no-code`: what differs from `lobby-host`

- **Hidden:** `Menu/H/Page/Lobby/Body/Side/CodeRow`.
- **Shown:**
  - **Menu/H/Page/Lobby/Body/Side/CodeGone** `Label` · variation `ToyTextMutedOnLight` · custom_minimum_size (360, 0) · text `esc.lobby.code_gone`: en "The code service isn't answering. To let more players in, host directly." · uk "Сервіс кодів не відповідає. Щоб прийняти ще гравців, створи гру напряму." · autowrap_mode `AUTOWRAP_WORD_SMART`
    - Note: In place of CodeRow, only for a host who hosted with a code, when the code service closed or was never reachable; a Direct host sees neither.

## `character`: what differs from `lobby-host`

- **Hidden:** `Menu/H/Page/TitleRow/HostNote`, `Menu/H/Page/Lobby`.
- **Changed** `Menu/H/Tabs/Lobby`: toggle_mode true, button_pressed false (was: toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`) · shown with keyboard focus (grab_focus))
- **Changed** `Menu/H/Tabs/Character`: toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`) · shown with keyboard focus (grab_focus) (was: toggle_mode true, button_pressed false)
- **Changed** `Menu/H/Page/TitleRow/Title`: text `esc.tab.character`: en "Character" · uk "Персонаж" (was: text `esc.tab.lobby`: en "Lobby" · uk "Лобі")
- **Shown:**
  - **Menu/H/Page/Character** `VBoxContainer` · variation `ToyColumnSixteen` · gaps from the variation: separation 16
    - **Body** `HBoxContainer` · variation `ToyRowThirtyTwo` · gaps from the variation: separation 32
      - **Preview** `PanelContainer` · variation `ToyHowtoFrame` · custom_minimum_size (380, 506)
        - Note: In the game: SubViewportContainer (stretch true) · min 380×506 with a SubViewport showing the own character; the page draws a ToyHowtoFrame placeholder.
      - **Form** `VBoxContainer` · variation `ToyColumnEight` · size flags horizontal `SIZE_EXPAND_FILL` · gaps from the variation: separation 8
        - Note: Changes apply live in the lobby. The Hat row (esc.character.hat) stays hidden until hats exist.
        - **NameRow** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
          - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `player.name`: en "Name" · uk "Імʼя"
            - **Field** `LineEdit` · variation `ToyField` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (400, 0) · text (sample data) "Olena" / "Олена" · context_menu_enabled false (Godot's right-click menu would show untranslated English labels; see the notes)
              - Note: The player's name, kept between sessions; auto_translate_mode DISABLED. editable false in a round.
        - **ColourRow** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
          - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `esc.character.colour`: en "Colour" · uk "Колір"
            - **Swatches** `GridContainer` · variation `ToyGridSwatch` · size flags vertical `SIZE_SHRINK_CENTER` · gaps from the variation: h_separation 12, v_separation 12 · columns 5
              - Note: The ten body colours (#255; the palette is not decided yet).
              - **Swatch1** `Control` · custom_minimum_size (40, 40)
                - Note: In the game: TextureButton · toggle_mode · one ButtonGroup · 40×40 (focus_mode ALL in the lobby, NONE in a round; mouse_filter IGNORE in a round). The disc is tinted with the body colour (content data, #255; the page's colours are samples only).
                - **Disc** `TextureRect` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (40, 40) · texture `swatch-disc` (dist/pack/icons/swatch-disc.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate from data (a content colour, not a theme colour), sample #ff8466
                  - Note: self_modulate = the body colour (content data).
                - **Ring** `Panel` · variation `ToySwatchRing` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (40, 40) = Vector2(get_theme_constant("width", "ToySwatchRing"), get_theme_constant("height", "ToySwatchRing"))
                  - Note: mouse_filter IGNORE.
                - **Sel** `Panel` · variation `ToySwatchSelected` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both
                  - Note: mouse_filter IGNORE; visible while the swatch is selected.
              - **Swatch2** `Control` · custom_minimum_size (40, 40)
                - **Disc** `TextureRect` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (40, 40) · texture `swatch-disc` (dist/pack/icons/swatch-disc.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate from data (a content colour, not a theme colour), sample #ffc23a
                - **Ring** `Panel` · variation `ToySwatchRing` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (40, 40) = Vector2(get_theme_constant("width", "ToySwatchRing"), get_theme_constant("height", "ToySwatchRing"))
              - **Swatch3** `Control` · custom_minimum_size (40, 40)
                - **Disc** `TextureRect` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (40, 40) · texture `swatch-disc` (dist/pack/icons/swatch-disc.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate from data (a content colour, not a theme colour), sample #3cc4a8
                - **Ring** `Panel` · variation `ToySwatchRing` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (40, 40) = Vector2(get_theme_constant("width", "ToySwatchRing"), get_theme_constant("height", "ToySwatchRing"))
                - **Focus** `Panel` · variation `ToySwatchFocus` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both
                  - Note: mouse_filter IGNORE; visible while the swatch has keyboard or gamepad focus (drawn here on the third swatch).
              - **Swatch4** `Control` · custom_minimum_size (40, 40)
                - **Disc** `TextureRect` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (40, 40) · texture `swatch-disc` (dist/pack/icons/swatch-disc.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate from data (a content colour, not a theme colour), sample #5bcb4e
                - **Ring** `Panel` · variation `ToySwatchRing` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (40, 40) = Vector2(get_theme_constant("width", "ToySwatchRing"), get_theme_constant("height", "ToySwatchRing"))
              - **Swatch5** `Control` · custom_minimum_size (40, 40)
                - **Disc** `TextureRect` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (40, 40) · texture `swatch-disc` (dist/pack/icons/swatch-disc.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate from data (a content colour, not a theme colour), sample #d9482f
                - **Ring** `Panel` · variation `ToySwatchRing` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (40, 40) = Vector2(get_theme_constant("width", "ToySwatchRing"), get_theme_constant("height", "ToySwatchRing"))
              - **Swatch6** `Control` · custom_minimum_size (40, 40)
                - **Disc** `TextureRect` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (40, 40) · texture `swatch-disc` (dist/pack/icons/swatch-disc.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate from data (a content colour, not a theme colour), sample #c98a10
                - **Ring** `Panel` · variation `ToySwatchRing` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (40, 40) = Vector2(get_theme_constant("width", "ToySwatchRing"), get_theme_constant("height", "ToySwatchRing"))
              - **Swatch7** `Control` · custom_minimum_size (40, 40)
                - **Disc** `TextureRect` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (40, 40) · texture `swatch-disc` (dist/pack/icons/swatch-disc.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate from data (a content colour, not a theme colour), sample #b9a8c7
                - **Ring** `Panel` · variation `ToySwatchRing` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (40, 40) = Vector2(get_theme_constant("width", "ToySwatchRing"), get_theme_constant("height", "ToySwatchRing"))
              - **Swatch8** `Control` · custom_minimum_size (40, 40)
                - **Disc** `TextureRect` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (40, 40) · texture `swatch-disc` (dist/pack/icons/swatch-disc.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate from data (a content colour, not a theme colour), sample #64566f
                - **Ring** `Panel` · variation `ToySwatchRing` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (40, 40) = Vector2(get_theme_constant("width", "ToySwatchRing"), get_theme_constant("height", "ToySwatchRing"))
              - **Swatch9** `Control` · custom_minimum_size (40, 40)
                - **Disc** `TextureRect` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (40, 40) · texture `swatch-disc` (dist/pack/icons/swatch-disc.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate from data (a content colour, not a theme colour), sample #4a3c5c
                - **Ring** `Panel` · variation `ToySwatchRing` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (40, 40) = Vector2(get_theme_constant("width", "ToySwatchRing"), get_theme_constant("height", "ToySwatchRing"))
              - **Swatch10** `Control` · custom_minimum_size (40, 40)
                - **Disc** `TextureRect` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (40, 40) · texture `swatch-disc` (dist/pack/icons/swatch-disc.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate from data (a content colour, not a theme colour), sample #fff4e2
                - **Ring** `Panel` · variation `ToySwatchRing` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (40, 40) = Vector2(get_theme_constant("width", "ToySwatchRing"), get_theme_constant("height", "ToySwatchRing"))

## `character-round`: what differs from `lobby-host`

- **Hidden:** `Menu/H/Page/TitleRow/HostNote`, `Menu/H/Page/Lobby`.
- **Changed** `Menu/H/Tabs/Lobby`: toggle_mode true, button_pressed false (was: toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`) · shown with keyboard focus (grab_focus))
- **Changed** `Menu/H/Tabs/Character`: toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`) · shown with keyboard focus (grab_focus) (was: toggle_mode true, button_pressed false)
- **Changed** `Menu/H/Page/TitleRow/Title`: text `esc.tab.character`: en "Character" · uk "Персонаж" (was: text `esc.tab.lobby`: en "Lobby" · uk "Лобі")
- **Shown:**
  - **Menu/H/Tabs/Role** `Button` · variation `ToyTab` · text `esc.tab.role`: en "Role" · uk "Роль" · alignment `LEFT` · toggle_mode true, button_pressed false
  - **Menu/H/Page/TitleRow/Locked** `HBoxContainer` · variation `ToyRowEight` · size flags vertical `SIZE_SHRINK_CENTER` · gaps from the variation: separation 8
    - Note: In a round the Character tab is locked: the same lock line as the guest's HostOnly, in the title row, so the page below does not move.
    - **Lock** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (20, 20) · texture `lock` (dist/pack/icons/lock.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToyTextOnLight")
      - Note: Muted like the text beside it: self_modulate = get_theme_color("font_color", "ToyTextMutedOnLight") (this replaces the generated ToyTextOnLight line).
    - **Text** `Label` · variation `ToyTextMutedOnLight` · text `esc.character.locked`: en "You can change this only in the lobby" · uk "Змінювати можна лише в лобі"
  - **Menu/H/Page/Character** `VBoxContainer` · variation `ToyColumnSixteen` · gaps from the variation: separation 16
    - **Body** `HBoxContainer` · variation `ToyRowThirtyTwo` · gaps from the variation: separation 32
      - **Preview** `PanelContainer` · variation `ToyHowtoFrame` · custom_minimum_size (380, 506)
        - Note: In the game: SubViewportContainer (stretch true) · min 380×506 with a SubViewport showing the own character; the page draws a ToyHowtoFrame placeholder.
      - **Form** `VBoxContainer` · variation `ToyColumnEight` · size flags horizontal `SIZE_EXPAND_FILL` · gaps from the variation: separation 8
        - Note: Changes apply live in the lobby. The Hat row (esc.character.hat) stays hidden until hats exist.
        - **NameRow** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
          - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `player.name`: en "Name" · uk "Імʼя"
            - **Field** `LineEdit` · variation `ToyField` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (400, 0) · text (sample data) "Olena" / "Олена" · editable false · context_menu_enabled false (Godot's right-click menu would show untranslated English labels; see the notes)
              - Note: The player's name, kept between sessions; auto_translate_mode DISABLED. editable false in a round.
        - **ColourRow** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
          - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `esc.character.colour`: en "Colour" · uk "Колір"
            - **Swatches** `GridContainer` · variation `ToyGridSwatch` · size flags vertical `SIZE_SHRINK_CENTER` · gaps from the variation: h_separation 12, v_separation 12 · columns 5
              - Note: The ten body colours (#255; the palette is not decided yet).
              - **Swatch1** `Control` · custom_minimum_size (40, 40)
                - Note: In the game: TextureButton · toggle_mode · one ButtonGroup · 40×40 (focus_mode ALL in the lobby, NONE in a round; mouse_filter IGNORE in a round). The disc is tinted with the body colour (content data, #255; the page's colours are samples only).
                - **Disc** `TextureRect` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (40, 40) · texture `swatch-disc` (dist/pack/icons/swatch-disc.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate from data (a content colour, not a theme colour), sample #ff8466
                  - Note: self_modulate = the body colour (content data).
                - **Ring** `Panel` · variation `ToySwatchRing` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (40, 40) = Vector2(get_theme_constant("width", "ToySwatchRing"), get_theme_constant("height", "ToySwatchRing"))
                  - Note: mouse_filter IGNORE.
                - **Sel** `Panel` · variation `ToySwatchSelected` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both
                  - Note: mouse_filter IGNORE; visible while the swatch is selected.
              - **Swatch2** `Control` · custom_minimum_size (40, 40)
                - **Disc** `TextureRect` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (40, 40) · texture `swatch-disc` (dist/pack/icons/swatch-disc.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate from data (a content colour, not a theme colour), sample #ffc23a
                - **Ring** `Panel` · variation `ToySwatchRing` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (40, 40) = Vector2(get_theme_constant("width", "ToySwatchRing"), get_theme_constant("height", "ToySwatchRing"))
              - **Swatch3** `Control` · custom_minimum_size (40, 40)
                - **Disc** `TextureRect` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (40, 40) · texture `swatch-disc` (dist/pack/icons/swatch-disc.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate from data (a content colour, not a theme colour), sample #3cc4a8
                - **Ring** `Panel` · variation `ToySwatchRing` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (40, 40) = Vector2(get_theme_constant("width", "ToySwatchRing"), get_theme_constant("height", "ToySwatchRing"))
                - **Focus** `Panel` · variation `ToySwatchFocus` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both
                  - Note: mouse_filter IGNORE; visible while the swatch has keyboard or gamepad focus (drawn here on the third swatch).
              - **Swatch4** `Control` · custom_minimum_size (40, 40)
                - **Disc** `TextureRect` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (40, 40) · texture `swatch-disc` (dist/pack/icons/swatch-disc.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate from data (a content colour, not a theme colour), sample #5bcb4e
                - **Ring** `Panel` · variation `ToySwatchRing` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (40, 40) = Vector2(get_theme_constant("width", "ToySwatchRing"), get_theme_constant("height", "ToySwatchRing"))
              - **Swatch5** `Control` · custom_minimum_size (40, 40)
                - **Disc** `TextureRect` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (40, 40) · texture `swatch-disc` (dist/pack/icons/swatch-disc.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate from data (a content colour, not a theme colour), sample #d9482f
                - **Ring** `Panel` · variation `ToySwatchRing` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (40, 40) = Vector2(get_theme_constant("width", "ToySwatchRing"), get_theme_constant("height", "ToySwatchRing"))
              - **Swatch6** `Control` · custom_minimum_size (40, 40)
                - **Disc** `TextureRect` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (40, 40) · texture `swatch-disc` (dist/pack/icons/swatch-disc.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate from data (a content colour, not a theme colour), sample #c98a10
                - **Ring** `Panel` · variation `ToySwatchRing` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (40, 40) = Vector2(get_theme_constant("width", "ToySwatchRing"), get_theme_constant("height", "ToySwatchRing"))
              - **Swatch7** `Control` · custom_minimum_size (40, 40)
                - **Disc** `TextureRect` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (40, 40) · texture `swatch-disc` (dist/pack/icons/swatch-disc.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate from data (a content colour, not a theme colour), sample #b9a8c7
                - **Ring** `Panel` · variation `ToySwatchRing` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (40, 40) = Vector2(get_theme_constant("width", "ToySwatchRing"), get_theme_constant("height", "ToySwatchRing"))
              - **Swatch8** `Control` · custom_minimum_size (40, 40)
                - **Disc** `TextureRect` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (40, 40) · texture `swatch-disc` (dist/pack/icons/swatch-disc.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate from data (a content colour, not a theme colour), sample #64566f
                - **Ring** `Panel` · variation `ToySwatchRing` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (40, 40) = Vector2(get_theme_constant("width", "ToySwatchRing"), get_theme_constant("height", "ToySwatchRing"))
              - **Swatch9** `Control` · custom_minimum_size (40, 40)
                - **Disc** `TextureRect` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (40, 40) · texture `swatch-disc` (dist/pack/icons/swatch-disc.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate from data (a content colour, not a theme colour), sample #4a3c5c
                - **Ring** `Panel` · variation `ToySwatchRing` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (40, 40) = Vector2(get_theme_constant("width", "ToySwatchRing"), get_theme_constant("height", "ToySwatchRing"))
              - **Swatch10** `Control` · custom_minimum_size (40, 40)
                - **Disc** `TextureRect` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (40, 40) · texture `swatch-disc` (dist/pack/icons/swatch-disc.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate from data (a content colour, not a theme colour), sample #fff4e2
                - **Ring** `Panel` · variation `ToySwatchRing` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (40, 40) = Vector2(get_theme_constant("width", "ToySwatchRing"), get_theme_constant("height", "ToySwatchRing"))

## `game-host`: what differs from `lobby-host`

- **Hidden:** `Menu/H/Page/TitleRow/HostNote`, `Menu/H/Page/Lobby`.
- **Changed** `Menu/H/Tabs/Game`: toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`) (was: toggle_mode true, button_pressed false)
- **Changed** `Menu/H/Tabs/Lobby`: toggle_mode true, button_pressed false (was: toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`) · shown with keyboard focus (grab_focus))
- **Changed** `Menu/H/Page/TitleRow/Title`: text `esc.tab.game`: en "Game" · uk "Гра" (was: text `esc.tab.lobby`: en "Lobby" · uk "Лобі")
- **Shown:**
  - **Menu/H/Tabs/Role** `Button` · variation `ToyTab` · text `esc.tab.role`: en "Role" · uk "Роль" · alignment `LEFT` · toggle_mode true, button_pressed false
  - **Menu/H/Page/Actions** `VBoxContainer` · variation `ToyColumnSixteen` · size flags horizontal `SIZE_SHRINK_BEGIN` · custom_minimum_size (760, 0) · gaps from the variation: separation 16
    - **Resume** `Button` · variation `ToyButtonPrimary` (raised: ToyRaised with base `ToyBasePrimaryOnLight`, ToyPress; UiParts.button()) · placement, size flags, custom_minimum_size and visibility on its ToyRaised wrapper · text `esc.game.resume`: en "Resume" · uk "Продовжити" · shown with keyboard focus (grab_focus)
      - Note: Closes the menu (as Esc). Takes focus when the menu opens on Game.
    - **Leave** `Button` · variation `ToyButtonDanger` (raised: ToyRaised with base `ToyBaseRaisedOnLight`, ToyPress; UiParts.button()) · placement, size flags, custom_minimum_size and visibility on its ToyRaised wrapper · text `esc.game.leave`: en "Leave the session" · uk "Покинути сесію"
      - Note: The host: coral (ToyButtonDanger), opens the confirm dialog. A player: ToyButtonSecondary, leaves at once. In the tutorial: ToyButtonSecondary esc.game.leave_tutorial, back to the main menu (s2).
    - **Quit** `Button` · variation `ToyButtonGhostOnLight` · text `esc.game.quit`: en "Quit the game" · uk "Вийти з гри"
      - Note: The host: opens the confirm dialog (esc.game.quit_confirm, Confirm esc.game.quit). A player, and in the tutorial: quits at once.

## `game-guest`: what differs from `lobby-host`

- **Hidden:** `Menu/H/Page/TitleRow/HostNote`, `Menu/H/Page/Lobby`.
- **Changed** `Menu/H/Tabs/Game`: toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`) (was: toggle_mode true, button_pressed false)
- **Changed** `Menu/H/Tabs/Lobby`: toggle_mode true, button_pressed false (was: toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`) · shown with keyboard focus (grab_focus))
- **Changed** `Menu/H/Page/TitleRow/Title`: text `esc.tab.game`: en "Game" · uk "Гра" (was: text `esc.tab.lobby`: en "Lobby" · uk "Лобі")
- **Shown:**
  - **Menu/H/Tabs/Role** `Button` · variation `ToyTab` · text `esc.tab.role`: en "Role" · uk "Роль" · alignment `LEFT` · toggle_mode true, button_pressed false
  - **Menu/H/Page/Actions** `VBoxContainer` · variation `ToyColumnSixteen` · size flags horizontal `SIZE_SHRINK_BEGIN` · custom_minimum_size (760, 0) · gaps from the variation: separation 16
    - **Resume** `Button` · variation `ToyButtonPrimary` (raised: ToyRaised with base `ToyBasePrimaryOnLight`, ToyPress; UiParts.button()) · placement, size flags, custom_minimum_size and visibility on its ToyRaised wrapper · text `esc.game.resume`: en "Resume" · uk "Продовжити" · shown with keyboard focus (grab_focus)
      - Note: Closes the menu (as Esc). Takes focus when the menu opens on Game.
    - **Leave** `Button` · variation `ToyButtonSecondary` (raised: ToyRaised with base `ToyBaseRaisedOnLight`, ToyPress; UiParts.button()) · placement, size flags, custom_minimum_size and visibility on its ToyRaised wrapper · text `esc.game.leave`: en "Leave the session" · uk "Покинути сесію"
      - Note: The host: coral (ToyButtonDanger), opens the confirm dialog. A player: ToyButtonSecondary, leaves at once. In the tutorial: ToyButtonSecondary esc.game.leave_tutorial, back to the main menu (s2).
    - **Quit** `Button` · variation `ToyButtonGhostOnLight` · text `esc.game.quit`: en "Quit the game" · uk "Вийти з гри"
      - Note: The host: opens the confirm dialog (esc.game.quit_confirm, Confirm esc.game.quit). A player, and in the tutorial: quits at once.

## `game-confirm`: what differs from `lobby-host`

- **Hidden:** `Menu/H/Page/TitleRow/HostNote`, `Menu/H/Page/Lobby`.
- **Changed** `Menu/H/Tabs/Game`: toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`) (was: toggle_mode true, button_pressed false)
- **Changed** `Menu/H/Tabs/Lobby`: toggle_mode true, button_pressed false (was: toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`) · shown with keyboard focus (grab_focus))
- **Changed** `Menu/H/Page/TitleRow/Title`: text `esc.tab.game`: en "Game" · uk "Гра" (was: text `esc.tab.lobby`: en "Lobby" · uk "Лобі")
- **Shown:**
  - **Menu/H/Tabs/Role** `Button` · variation `ToyTab` · text `esc.tab.role`: en "Role" · uk "Роль" · alignment `LEFT` · toggle_mode true, button_pressed false
  - **Menu/H/Page/Actions** `VBoxContainer` · variation `ToyColumnSixteen` · size flags horizontal `SIZE_SHRINK_BEGIN` · custom_minimum_size (760, 0) · gaps from the variation: separation 16
    - **Resume** `Button` · variation `ToyButtonPrimary` (raised: ToyRaised with base `ToyBasePrimaryOnLight`, ToyPress; UiParts.button()) · placement, size flags, custom_minimum_size and visibility on its ToyRaised wrapper · text `esc.game.resume`: en "Resume" · uk "Продовжити"
      - Note: Closes the menu (as Esc). Takes focus when the menu opens on Game.
    - **Leave** `Button` · variation `ToyButtonDanger` (raised: ToyRaised with base `ToyBaseRaisedOnLight`, ToyPress; UiParts.button()) · placement, size flags, custom_minimum_size and visibility on its ToyRaised wrapper · text `esc.game.leave`: en "Leave the session" · uk "Покинути сесію"
      - Note: The host: coral (ToyButtonDanger), opens the confirm dialog. A player: ToyButtonSecondary, leaves at once. In the tutorial: ToyButtonSecondary esc.game.leave_tutorial, back to the main menu (s2).
    - **Quit** `Button` · variation `ToyButtonGhostOnLight` · text `esc.game.quit`: en "Quit the game" · uk "Вийти з гри"
      - Note: The host: opens the confirm dialog (esc.game.quit_confirm, Confirm esc.game.quit). A player, and in the tutorial: quits at once.
  - **ConfirmDim** `Panel` · variation `ToyBackdrop` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both
    - Note: mouse_filter STOP: blocks the mouse to the menu behind while the dialog is open. Keyboard and gamepad focus search ignores what is drawn on top, so while the dialog is open set focus_behavior_recursive = FOCUS_BEHAVIOR_DISABLED on Menu (Control, Godot 4.5+) and restore FOCUS_BEHAVIOR_INHERITED on close. The dialog handles ui_cancel itself (= Cancel) and calls get_viewport().set_input_as_handled(), so Esc closes only the dialog, not the menu too.
  - **Confirm** `PanelContainer` · variation `ToyPanelDialog` (raised: ToyRaised with base `ToyBasePanel`) · anchors `center`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (720, 0) · placement, size flags, custom_minimum_size and visibility on its ToyRaised wrapper
    - Note: P1. Opened by the host's Leave (esc.game.leave_confirm, Confirm esc.game.leave) or Quit (esc.game.quit_confirm, Confirm esc.game.quit). ui_cancel = Cancel.
    - **V** `VBoxContainer` · variation `ToyColumnThirtyTwo` · gaps from the variation: separation 32
      - **Text** `VBoxContainer` · variation `ToyColumnTwelve` · gaps from the variation: separation 12
        - **Title** `Label` · variation `ToyTitleOnLight` · custom_minimum_size (600, 0) · text `esc.game.leave_confirm`: en "Leave the session?" · uk "Покинути сесію?" · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
        - **Body** `Label` · variation `ToyTextMutedOnLight` · custom_minimum_size (600, 0) · text `esc.game.leave_host_note`: en "You host this session: leaving ends it for every player." · uk "Ти хост: якщо вийдеш, сесія закінчиться для всіх." · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
      - **Buttons** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16 · alignment `ALIGNMENT_CENTER`
        - **ConfirmButton** `Button` · variation `ToyButtonDanger` (raised: ToyRaised with base `ToyBaseRaisedOnLight`, ToyPress; UiParts.button()) · placement, size flags, custom_minimum_size and visibility on its ToyRaised wrapper · text `esc.game.leave`: en "Leave the session" · uk "Покинути сесію"
          - Note: Ends the session for every player and returns to the main menu (Quit: quits the game).
        - **Cancel** `Button` · variation `ToyButtonGhostOnLight` · text `common.cancel`: en "Cancel" · uk "Скасувати" · shown with keyboard focus (grab_focus)
          - Note: Focus on open; closes the dialog.

## `role-engineer`: what differs from `lobby-host`

- **Hidden:** `Menu/H/Page/TitleRow/HostNote`, `Menu/H/Page/Lobby`.
- **Changed** `Menu/H/Tabs/Lobby`: toggle_mode true, button_pressed false (was: toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`) · shown with keyboard focus (grab_focus))
- **Changed** `Menu/H/Page/TitleRow/Title`: text `esc.tab.role`: en "Role" · uk "Роль" (was: text `esc.tab.lobby`: en "Lobby" · uk "Лобі")
- **Shown:**
  - **Menu/H/Tabs/Role** `Button` · variation `ToyTab` · text `esc.tab.role`: en "Role" · uk "Роль" · alignment `LEFT` · toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`) · shown with keyboard focus (grab_focus)
  - **Menu/H/Page/Role** `HBoxContainer` · variation `ToyRowThirtyTwo` · gaps from the variation: separation 32
    - Note: Reads only the own role and Teammates.
    - **Left** `VBoxContainer` · variation `ToyColumnEight` · size flags horizontal `SIZE_EXPAND_FILL`, stretch_ratio 1.1 · gaps from the variation: separation 8
      - **You** `Label` · variation `ToyTextMutedOnLight` · text `player.you`: en "You" · uk "Ти"
      - **Role** `Label` · variation `ToyDisplayOnLight` · text `role.engineer`: en "Engineer" · uk "Інженер"
      - **Goal** `Label` · variation `ToyTextOnLight` · custom_minimum_size (400, 0) · text `role.goal.engineer`: en "Your goal: complete every task before time runs out." · uk "Твоя мета: виконати всі задачі, поки не вийшов час." · autowrap_mode `AUTOWRAP_WORD_SMART`

## `role-dissident`: what differs from `lobby-host`

- **Hidden:** `Menu/H/Page/TitleRow/HostNote`, `Menu/H/Page/Lobby`.
- **Changed** `Menu/H/Tabs/Lobby`: toggle_mode true, button_pressed false (was: toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`) · shown with keyboard focus (grab_focus))
- **Changed** `Menu/H/Page/TitleRow/Title`: text `esc.tab.role`: en "Role" · uk "Роль" (was: text `esc.tab.lobby`: en "Lobby" · uk "Лобі")
- **Shown:**
  - **Menu/H/Tabs/Role** `Button` · variation `ToyTab` · text `esc.tab.role`: en "Role" · uk "Роль" · alignment `LEFT` · toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`) · shown with keyboard focus (grab_focus)
  - **Menu/H/Page/Role** `HBoxContainer` · variation `ToyRowThirtyTwo` · gaps from the variation: separation 32
    - Note: Reads only the own role and Teammates.
    - **Left** `VBoxContainer` · variation `ToyColumnEight` · size flags horizontal `SIZE_EXPAND_FILL`, stretch_ratio 1.1 · gaps from the variation: separation 8
      - **You** `Label` · variation `ToyTextMutedOnLight` · text `player.you`: en "You" · uk "Ти"
      - **Role** `Label` · variation `ToyDisplayOnLight` · text `role.dissident`: en "Dissident" · uk "Дисидент"
      - **Goal** `Label` · variation `ToyTextOnLight` · custom_minimum_size (400, 0) · text `role.goal.dissident`: en "Your goal: stop the Engineers from completing their tasks." · uk "Твоя мета: заважати Інженерам виконати задачі." · autowrap_mode `AUTOWRAP_WORD_SMART`
    - **Team** `VBoxContainer` · variation `ToyColumnTwelve` · size flags horizontal `SIZE_EXPAND_FILL` · gaps from the variation: separation 12
      - Note: Dissidents only; hidden when there are no teammates.
      - **Count** `Label` · variation `ToyTextMutedOnLight` · text `esc.role.teammates` with sample {count} = "1": en "Your team · 1" · uk "Твоя команда · 1"
        - Note: The number of teammates (here one, Taras, as in s6 and s7).
      - **Scroll** `ScrollContainer` · variation `ToyScroll` · custom_minimum_size (0, 250) · the gap between the child and the bar from the variation: scrollbar_h_separation 8 · horizontal_scroll_mode `SCROLL_MODE_DISABLED` (vertical scrolling only); `get_v_scroll_bar().theme_type_variation = &"ToyScrollBar"`; the bar shows when the child is taller
        - Note: The view is 250 px tall; the list scrolls when it is longer.
        - **Grid** `GridContainer` · variation `ToyGridList` · size flags horizontal `SIZE_EXPAND_FILL` · gaps from the variation: h_separation 24, v_separation 8 · columns 2
          - Note: Two columns, in join order; a long list scrolls in the 250 px view.
          - **Taras** `HBoxContainer` · variation `ToyRowEight` · size flags horizontal `SIZE_EXPAND_FILL` · gaps from the variation: separation 8
            - **Mark** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (20, 20) · texture `teammate-mark` (dist/pack/icons/teammate-mark.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToyTextOnLight")
            - **Name** `Label` · variation `ToyTextOnLight` · size flags horizontal `SIZE_EXPAND_FILL` · text from data (auto_translate_mode = DISABLED), sample: "Taras" / "Тарас" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
              - Note: The teammate's name (auto_translate_mode DISABLED); a long name is cut with an ellipsis.

## `guide`: what differs from `lobby-host`

- **Hidden:** `Menu/H/Page/TitleRow/HostNote`, `Menu/H/Page/Lobby`.
- **Changed** `Menu/H/Tabs/Guide`: toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`) · shown with keyboard focus (grab_focus) (was: toggle_mode true, button_pressed false)
- **Changed** `Menu/H/Tabs/Lobby`: toggle_mode true, button_pressed false (was: toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`) · shown with keyboard focus (grab_focus))
- **Changed** `Menu/H/Page/TitleRow/Title`: text `esc.tab.guide`: en "Guide" · uk "Посібник" (was: text `esc.tab.lobby`: en "Lobby" · uk "Лобі")
- **Shown:**
  - **Menu/H/Tabs/Role** `Button` · variation `ToyTab` · text `esc.tab.role`: en "Role" · uk "Роль" · alignment `LEFT` · toggle_mode true, button_pressed false
  - **Menu/H/Page/Guide** `HBoxContainer` · variation `ToyRowTwentyFour` · size flags vertical `SIZE_EXPAND_FILL` · gaps from the variation: separation 24
    - **List** `ScrollContainer` · variation `ToyScroll` · custom_minimum_size (332, 0) · the gap between the child and the bar from the variation: scrollbar_h_separation 8 · horizontal_scroll_mode `SCROLL_MODE_DISABLED` (vertical scrolling only); `get_v_scroll_bar().theme_type_variation = &"ToyScrollBar"`; the bar shows when the child is taller
      - Note: Fills the page height. follow_focus = true, so keyboard and gamepad focus scrolls the chip in view. 332 px holds the longest chip at large text.
      - **V** `VBoxContainer` · variation `ToyColumnEight` · size flags horizontal `SIZE_EXPAND_FILL` · gaps from the variation: separation 8
        - Note: One ButtonGroup over every chip; a chip shows its card, titled with the chip's text.
        - **Basics** `Label` · variation `ToyTextMutedOnLight` · text `guide.basics`: en "Basics" · uk "Основи"
        - **Moving** `Button` · variation `ToyChipToggleOnLight` · size flags horizontal `SIZE_SHRINK_BEGIN` · text `guide.moving`: en "Moving and hands" · uk "Рух і руки" · toggle_mode true, button_pressed false
          - Note: Card frames: tutorial.step.move.title, .pick_up.title, .put_down.title, .hand_belt.title.
        - **Voice** `Button` · variation `ToyChipToggleOnLight` · size flags horizontal `SIZE_SHRINK_BEGIN` · text `guide.voice`: en "Voice" · uk "Голос" · toggle_mode true, button_pressed false
          - Note: Card frames: tutorial.step.voice.title, tutorial.step.voice.how, tutorial.list.death.
        - **Downed** `Button` · variation `ToyChipToggleOnLight` · size flags horizontal `SIZE_SHRINK_BEGIN` · text `guide.downed`: en "Downed and back" · uk "Нокдаун і повернення" · toggle_mode true, button_pressed false
          - Note: Card frames: tutorial.step.downed.title, downed.give_up_hold, tutorial.step.death.title, tutorial.step.death.how.
        - **Gap** `Control` · custom_minimum_size (0, 8)
          - Note: A spacer: 8 + 8 + 8 = 24 px between the Downed chip and the Tasks caption.
        - **Tasks** `Label` · variation `ToyTextMutedOnLight` · text `guide.tasks`: en "Tasks" · uk "Задачі"
        - **Delivery** `Button` · variation `ToyChipToggleOnLight` · size flags horizontal `SIZE_SHRINK_BEGIN` · text `task.delivery`: en "Delivery" · uk "Доставка" · toggle_mode true, button_pressed false
          - Note: Card frames: howto.delivery.take, .sign, .find, .drop (done frame).
        - **Switches** `Button` · variation `ToyChipToggleOnLight` · size flags horizontal `SIZE_SHRINK_BEGIN` · text `task.switches`: en "Switches" · uk "Рубильники" · toggle_mode true, button_pressed true (ToyToggle draws `ToyChipToggleOnLightSelected`)
    - **Card** `PanelContainer` · variation `ToyPanelHowto` (raised: ToyRaised with base `ToyBasePanel`) · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_BEGIN` · placement, size flags, custom_minimum_size and visibility on its ToyRaised wrapper
      - Note: P8 how-to card; a card is content data per task type (#254).
      - **V** `VBoxContainer` · variation `ToyColumnSixteen` · gaps from the variation: separation 16
        - **Head** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
          - **Title** `Label` · variation `ToyTitleOnLight` · size flags horizontal `SIZE_EXPAND_FILL` · text `task.switches`: en "Switches" · uk "Рубильники"
          - **Note** `Label` · variation `ToyHowtoNote` · size flags vertical `SIZE_SHRINK_CENTER` · text `howto.label`: en "How to" · uk "Як робити"
        - **Frames** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
          - **Frame1** `PanelContainer` · variation `ToyHowtoFrame` · size flags horizontal `SIZE_EXPAND_FILL`
            - **F** `VBoxContainer` · variation `ToyColumnEight` · gaps from the variation: separation 8
              - **Art** `TextureRect` · custom_minimum_size (120, 120) · texture `item` (dist/pack/icons/item.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToyTextOnLight")
                - Note: Placeholder art until the card art (prime-game-ui#3). The same card tree as s3/Card and s8/Guide/Card; the art is 120 px high here and in s8, 200 in s3's loading card.
              - **Caption** `Label` · variation `ToyHowtoCaption` · custom_minimum_size (120, 0) · text `howto.switches.find`: en "Find every switch" · uk "Знайди всі рубильники" · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
          - **Frame2** `PanelContainer` · variation `ToyHowtoFrame` · size flags horizontal `SIZE_EXPAND_FILL`
            - **F** `VBoxContainer` · variation `ToyColumnEight` · gaps from the variation: separation 8
              - **Art** `TextureRect` · custom_minimum_size (120, 120) · texture `item` (dist/pack/icons/item.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToyTextOnLight")
              - **Caption** `Label` · variation `ToyHowtoCaption` · custom_minimum_size (120, 0) · text `howto.switches.turn_on`: en "Turn each one on" · uk "Увімкни кожен" · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
          - **Frame3** `PanelContainer` · variation `ToyHowtoFrame` · size flags horizontal `SIZE_EXPAND_FILL`
            - **F** `VBoxContainer` · variation `ToyColumnEight` · gaps from the variation: separation 8
              - **Art** `TextureRect` · custom_minimum_size (120, 120) · texture `item` (dist/pack/icons/item.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToyTextOnLight")
              - **Caption** `Label` · variation `ToyHowtoCaption` · custom_minimum_size (120, 0) · text `howto.switches.watch`: en "Watch that nobody turns them off" · uk "Стеж, щоб ніхто не вимкнув" · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
          - **Frame4** `PanelContainer` · variation `ToyHowtoFrameDone` · size flags horizontal `SIZE_EXPAND_FILL`
            - **F** `VBoxContainer` · variation `ToyColumnEight` · gaps from the variation: separation 8
              - **Art** `TextureRect` · custom_minimum_size (120, 120) · texture `check` (dist/pack/icons/check.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToyTextOnLight")
              - **Caption** `Label` · variation `ToyHowtoCaption` · custom_minimum_size (120, 0) · text `howto.switches.done`: en "Done when all are lit" · uk "Готово, коли всі горять" · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`

## `settings-sound`: what differs from `lobby-host`

- **Hidden:** `Menu/H/Page/TitleRow/HostNote`, `Menu/H/Page/Lobby`.
- **Changed** `Menu/H/Tabs/Lobby`: toggle_mode true, button_pressed false (was: toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`) · shown with keyboard focus (grab_focus))
- **Changed** `Menu/H/Tabs/Settings`: toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`) · shown with keyboard focus (grab_focus) (was: toggle_mode true, button_pressed false)
- **Changed** `Menu/H/Page/TitleRow/Title`: text `esc.tab.settings`: en "Settings" · uk "Налаштування" (was: text `esc.tab.lobby`: en "Lobby" · uk "Лобі")
- **Shown:**
  - **Menu/H/Tabs/Role** `Button` · variation `ToyTab` · text `esc.tab.role`: en "Role" · uk "Роль" · alignment `LEFT` · toggle_mode true, button_pressed false
  - **Menu/H/Page/Settings** `VBoxContainer` · variation `ToyColumnSixteen` · size flags vertical `SIZE_EXPAND_FILL` · gaps from the variation: separation 16
    - Note: The same subtree (one scene) as the main menu's Settings panel (s2): the mic, the mode, the threshold with its live meter, noise suppression and the volumes work without a session. Saved per player.
    - **Sub** `HBoxContainer` · variation `ToyRowEight` · gaps from the variation: separation 8
      - Note: One ButtonGroup; Settings opens on Sound and voice.
      - **Sound** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.sound`: en "Sound and voice" · uk "Звук і голос" · toggle_mode true, button_pressed true (ToyToggle draws `ToyChipToggleOnLightSelected`)
      - **Controls** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.controls`: en "Controls" · uk "Керування" · toggle_mode true, button_pressed false
      - **Display** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.display`: en "Display" · uk "Екран" · toggle_mode true, button_pressed false
      - **Access** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.accessibility`: en "Accessibility" · uk "Доступність" · toggle_mode true, button_pressed false
      - **Language** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.language`: en "Language" · uk "Мова" · toggle_mode true, button_pressed false
    - **Scroll** `ScrollContainer` · variation `ToyScroll` · size flags vertical `SIZE_EXPAND_FILL` · the gap between the child and the bar from the variation: scrollbar_h_separation 8 · horizontal_scroll_mode `SCROLL_MODE_DISABLED` (vertical scrolling only); `get_v_scroll_bar().theme_type_variation = &"ToyScrollBar"`; the bar shows when the child is taller
      - Note: follow_focus = true, so keyboard and gamepad focus scrolls the focused row in view (the 15 keys of Controls, the volumes at large text).
      - **Rows** `VBoxContainer` · variation `ToyColumnEight` · size flags horizontal `SIZE_EXPAND_FILL` · gaps from the variation: separation 8
        - **Mic** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
          - Note: Without the voice add-on, Mic, TalkMode, Threshold and MicTest give way to one Label(ToyTextMutedOnLight) settings.voice_unavailable.
          - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `settings.mic`: en "Microphone" · uk "Мікрофон"
            - **Device** `OptionButton` · variation `ToyDropdown` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (500, 0) · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS` · text `settings.mic.default`: en "Default" · uk "Стандартний" · arrow: theme icon `arrow` (dist/pack/icons/chevron-down.svg), tinted by the font colour (modulate_arrow) · `get_popup().theme_type_variation = &"ToyDropdownList"` (its open list, see the notes) · items `settings.mic.default`
              - Note: Items: settings.mic.default, then the device names (not translated). A pick opens the device under the existing "opening" mark. A long device name is cut with an ellipsis, so the row keeps its 500 px.
        - **TalkMode** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
          - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `settings.talk_mode`: en "How to talk" · uk "Як говорити"
            - **Mode** `OptionButton` · variation `ToyDropdown` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (500, 0) · text `settings.talk_mode.open`: en "Voice activation" · uk "Голосова активація" · arrow: theme icon `arrow` (dist/pack/icons/chevron-down.svg), tinted by the font colour (modulate_arrow) · `get_popup().theme_type_variation = &"ToyDropdownList"` (its open list, see the notes) · items `settings.talk_mode.open`, `settings.talk_mode.push`, `common.off`
              - Note: Voice activation (with the threshold row), push to talk (the Talk key) or off. A dropdown like Mic: three chips would not fit the main menu's Settings panel at large text.
        - **Threshold** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
          - Note: Shown for voice activation only.
          - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `settings.voice_threshold`: en "Voice threshold" · uk "Поріг голосу"
            - **Slider** `HSlider` · variation `ToySlider` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (500, 0) · value 40 (min_value 0, max_value 100, step 1)
              - Note: The voice-activation threshold, 0 to 100 %.
        - **MicTest** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
          - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `settings.mic_test`: en "Mic test" · uk "Перевірка мікрофона"
            - **Meter** `ProgressBar` · variation `ToyBarSlider` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (500, 10) · value 40 of max_value 100, show_percentage false
              - Note: The live mic level; it runs without a session (#301).
        - **Noise** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
          - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `settings.noise_suppression`: en "Noise suppression" · uk "Шумозаглушення"
            - **Toggle** `HBoxContainer` · variation `ToyRowEight` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (500, 0) · gaps from the variation: separation 8
              - Note: One ButtonGroup: RNNoise off or on.
              - **Off** `Button` · variation `ToyChipToggleOnLight` · text `common.off`: en "Off" · uk "Вимкнено" · toggle_mode true, button_pressed false
              - **On** `Button` · variation `ToyChipToggleOnLight` · text `common.on`: en "On" · uk "Увімкнено" · toggle_mode true, button_pressed true (ToyToggle draws `ToyChipToggleOnLightSelected`)
        - **Overall** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
          - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `settings.game_volume`: en "Overall volume" · uk "Загальна гучність"
            - **Slider** `HSlider` · variation `ToySlider` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (500, 0) · value 55 (min_value 0, max_value 100, step 1)
              - Note: The Master bus, 0 to 100 %.
        - **Voices** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
          - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `settings.voice_volume`: en "Voice volume" · uk "Гучність голосів"
            - **Slider** `HSlider` · variation `ToySlider` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (500, 0) · value 70 (min_value 0, max_value 100, step 1)
              - Note: The voice bus, 0 to 100 %.
        - **Effects** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
          - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `settings.effects_volume`: en "Effects volume" · uk "Гучність ефектів"
            - **Slider** `HSlider` · variation `ToySlider` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (500, 0) · value 80 (min_value 0, max_value 100, step 1)
              - Note: The effects bus, 0 to 100 %.
        - **Music** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
          - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `settings.music_volume`: en "Music volume" · uk "Гучність музики"
            - **Slider** `HSlider` · variation `ToySlider` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (500, 0) · value 50 (min_value 0, max_value 100, step 1)
              - Note: The music bus, 0 to 100 %.

## `settings-controls`: what differs from `lobby-host`

- **Hidden:** `Menu/H/Page/TitleRow/HostNote`, `Menu/H/Page/Lobby`.
- **Changed** `Menu/H/Tabs/Lobby`: toggle_mode true, button_pressed false (was: toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`) · shown with keyboard focus (grab_focus))
- **Changed** `Menu/H/Tabs/Settings`: toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`) (was: toggle_mode true, button_pressed false)
- **Changed** `Menu/H/Page/TitleRow/Title`: text `esc.tab.settings`: en "Settings" · uk "Налаштування" (was: text `esc.tab.lobby`: en "Lobby" · uk "Лобі")
- **Shown:**
  - **Menu/H/Tabs/Role** `Button` · variation `ToyTab` · text `esc.tab.role`: en "Role" · uk "Роль" · alignment `LEFT` · toggle_mode true, button_pressed false
  - **Menu/H/Page/Settings** `VBoxContainer` · variation `ToyColumnSixteen` · size flags vertical `SIZE_EXPAND_FILL` · gaps from the variation: separation 16
    - Note: The same subtree (one scene) as the main menu's Settings panel (s2): the mic, the mode, the threshold with its live meter, noise suppression and the volumes work without a session. Saved per player.
    - **Sub** `HBoxContainer` · variation `ToyRowEight` · gaps from the variation: separation 8
      - Note: One ButtonGroup; Settings opens on Sound and voice.
      - **Sound** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.sound`: en "Sound and voice" · uk "Звук і голос" · toggle_mode true, button_pressed false
      - **Controls** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.controls`: en "Controls" · uk "Керування" · toggle_mode true, button_pressed true (ToyToggle draws `ToyChipToggleOnLightSelected`)
      - **Display** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.display`: en "Display" · uk "Екран" · toggle_mode true, button_pressed false
      - **Access** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.accessibility`: en "Accessibility" · uk "Доступність" · toggle_mode true, button_pressed false
      - **Language** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.language`: en "Language" · uk "Мова" · toggle_mode true, button_pressed false
    - **Scroll** `ScrollContainer` · variation `ToyScroll` · size flags vertical `SIZE_EXPAND_FILL` · the gap between the child and the bar from the variation: scrollbar_h_separation 8 · horizontal_scroll_mode `SCROLL_MODE_DISABLED` (vertical scrolling only); `get_v_scroll_bar().theme_type_variation = &"ToyScrollBar"`; the bar shows when the child is taller
      - Note: follow_focus = true, so keyboard and gamepad focus scrolls the focused row in view (the 15 keys of Controls, the volumes at large text).
      - **Rows** `VBoxContainer` · variation `ToyColumnEight` · size flags horizontal `SIZE_EXPAND_FILL` · gaps from the variation: separation 8
        - **Forward** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
          - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.forward`: en "Forward" · uk "Уперед"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (96, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text from data (auto_translate_mode = DISABLED), sample: "W"
              - Note: Button(ToyKeyButton), wide (min 96): its text is the bound key's label, DisplayServer.keyboard_get_label_from_physical() of the action's binding (data, auto_translate_mode DISABLED); Space and the mouse buttons use key.space, key.mouse_left, key.mouse_right. A click or ui_accept starts capture.
        - **Backward** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
          - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.backward`: en "Back" · uk "Назад"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (96, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text from data (auto_translate_mode = DISABLED), sample: "S"
        - **Left** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
          - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.left`: en "Left" · uk "Ліворуч"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (96, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text from data (auto_translate_mode = DISABLED), sample: "A"
        - **Right** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
          - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.right`: en "Right" · uk "Праворуч"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (96, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text from data (auto_translate_mode = DISABLED), sample: "D"
        - **Sprint** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
          - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.sprint`: en "Sprint" · uk "Бігти"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (96, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text from data (auto_translate_mode = DISABLED), sample: "Shift"
        - **Jump** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
          - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.jump`: en "Jump" · uk "Стрибнути"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (96, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text `key.space`: en "Space" · uk "Пробіл"
        - **Interact** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
          - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.interact`: en "Interact" · uk "Взаємодіяти"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (96, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text `settings.controls.press_key`: en "Press a key…" · uk "Натисни клавішу…" · shown held down (review only)
              - Note: Capturing: settings.controls.press_key on the pressed look; idle it shows the bound key's label (E). A click or ui_accept starts capture: set toggle_mode = true and set_pressed_no_signal(true), which draws ToyKeyButton's pressed StyleBox (it has no toggle partner), and restore both when capture ends. Capture runs in _input and calls get_viewport().set_input_as_handled() on every event, so nothing else sees it: the next key or mouse button binds, except the release of the click that started capture, which is ignored; Esc cancels and is consumed (the menu stays open); the arrows and ui_accept do not move or press focus while capturing.
        - **Use** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
          - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.use`: en "Use" · uk "Використати"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (96, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text `key.mouse_left`: en "LMB" · uk "ЛКМ"
        - **PutDown** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
          - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.put_down`: en "Put down" · uk "Покласти"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (96, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text from data (auto_translate_mode = DISABLED), sample: "Q"
        - **Swap** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
          - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.swap`: en "Swap hand and belt" · uk "Поміняти руку й пояс"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (96, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text from data (auto_translate_mode = DISABLED), sample: "X"
        - **Map** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
          - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.map`: en "Map and tasks" · uk "Мапа й задачі"
            - **Same** `PanelContainer` · variation `ToyChipAlert` · size flags vertical `SIZE_SHRINK_CENTER`
              - Note: Only on rows whose key clashes with another action of the same phase (here Map and Talk on M); give_up and ready share F legally (different phases, #211).
              - **Text** `Label` · variation `ToyChipAlertText` · text `settings.controls.same_key`: en "Same key" · uk "Та сама клавіша"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (96, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text from data (auto_translate_mode = DISABLED), sample: "M"
        - **GiveUp** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
          - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.give_up`: en "Give up" · uk "Здатися"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (96, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text from data (auto_translate_mode = DISABLED), sample: "F"
        - **ReadyKey** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
          - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.ready`: en "Ready" · uk "Готовність"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (96, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text from data (auto_translate_mode = DISABLED), sample: "F"
        - **Talk** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
          - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.talk`: en "Talk" · uk "Говорити"
            - **Same** `PanelContainer` · variation `ToyChipAlert` · size flags vertical `SIZE_SHRINK_CENTER`
              - **Text** `Label` · variation `ToyChipAlertText` · text `settings.controls.same_key`: en "Same key" · uk "Та сама клавіша"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (96, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text from data (auto_translate_mode = DISABLED), sample: "M"
        - **SpectateNext** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
          - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.spectate_next`: en "Next player" · uk "Наступний гравець"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (96, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text `key.mouse_left`: en "LMB" · uk "ЛКМ"
        - **SpectatePrevious** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
          - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.spectate_previous`: en "Previous player" · uk "Попередній гравець"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (96, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text `key.mouse_right`: en "RMB" · uk "ПКМ"
        - **ResetGap** `Control` · custom_minimum_size (0, 12)
          - Note: A spacer: 4 + 12 + 4 = 20 px between the last row and Reset.
        - **Reset** `Button` · variation `ToyButtonGhostOnLight` · size flags horizontal `SIZE_SHRINK_BEGIN` · text `settings.controls.reset`: en "Reset to defaults" · uk "Скинути до стандартних"
          - Note: Restores the default bindings. Esc itself is fixed.

## `settings-display`: what differs from `lobby-host`

- **Hidden:** `Menu/H/Page/TitleRow/HostNote`, `Menu/H/Page/Lobby`.
- **Changed** `Menu/H/Tabs/Lobby`: toggle_mode true, button_pressed false (was: toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`) · shown with keyboard focus (grab_focus))
- **Changed** `Menu/H/Tabs/Settings`: toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`) · shown with keyboard focus (grab_focus) (was: toggle_mode true, button_pressed false)
- **Changed** `Menu/H/Page/TitleRow/Title`: text `esc.tab.settings`: en "Settings" · uk "Налаштування" (was: text `esc.tab.lobby`: en "Lobby" · uk "Лобі")
- **Shown:**
  - **Menu/H/Tabs/Role** `Button` · variation `ToyTab` · text `esc.tab.role`: en "Role" · uk "Роль" · alignment `LEFT` · toggle_mode true, button_pressed false
  - **Menu/H/Page/Settings** `VBoxContainer` · variation `ToyColumnSixteen` · size flags vertical `SIZE_EXPAND_FILL` · gaps from the variation: separation 16
    - Note: The same subtree (one scene) as the main menu's Settings panel (s2): the mic, the mode, the threshold with its live meter, noise suppression and the volumes work without a session. Saved per player.
    - **Sub** `HBoxContainer` · variation `ToyRowEight` · gaps from the variation: separation 8
      - Note: One ButtonGroup; Settings opens on Sound and voice.
      - **Sound** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.sound`: en "Sound and voice" · uk "Звук і голос" · toggle_mode true, button_pressed false
      - **Controls** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.controls`: en "Controls" · uk "Керування" · toggle_mode true, button_pressed false
      - **Display** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.display`: en "Display" · uk "Екран" · toggle_mode true, button_pressed true (ToyToggle draws `ToyChipToggleOnLightSelected`)
      - **Access** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.accessibility`: en "Accessibility" · uk "Доступність" · toggle_mode true, button_pressed false
      - **Language** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.language`: en "Language" · uk "Мова" · toggle_mode true, button_pressed false
    - **Scroll** `ScrollContainer` · variation `ToyScroll` · size flags vertical `SIZE_EXPAND_FILL` · the gap between the child and the bar from the variation: scrollbar_h_separation 8 · horizontal_scroll_mode `SCROLL_MODE_DISABLED` (vertical scrolling only); `get_v_scroll_bar().theme_type_variation = &"ToyScrollBar"`; the bar shows when the child is taller
      - Note: follow_focus = true, so keyboard and gamepad focus scrolls the focused row in view (the 15 keys of Controls, the volumes at large text).
      - **Rows** `VBoxContainer` · variation `ToyColumnEight` · size flags horizontal `SIZE_EXPAND_FILL` · gaps from the variation: separation 8
        - **Window** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
          - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `settings.window`: en "Window" · uk "Вікно"
            - **Mode** `HBoxContainer` · variation `ToyRowEight` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (500, 0) · gaps from the variation: separation 8
              - Note: One ButtonGroup: DisplayServer window mode.
              - **Fullscreen** `Button` · variation `ToyChipToggleOnLight` · text `settings.window.fullscreen`: en "Fullscreen" · uk "На весь екран" · toggle_mode true, button_pressed true (ToyToggle draws `ToyChipToggleOnLightSelected`)
              - **Windowed** `Button` · variation `ToyChipToggleOnLight` · text `settings.window.windowed`: en "Windowed" · uk "У вікні" · toggle_mode true, button_pressed false

## `settings-access`: what differs from `lobby-host`

- **Hidden:** `Menu/H/Page/TitleRow/HostNote`, `Menu/H/Page/Lobby`.
- **Changed** `Menu/H/Tabs/Lobby`: toggle_mode true, button_pressed false (was: toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`) · shown with keyboard focus (grab_focus))
- **Changed** `Menu/H/Tabs/Settings`: toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`) · shown with keyboard focus (grab_focus) (was: toggle_mode true, button_pressed false)
- **Changed** `Menu/H/Page/TitleRow/Title`: text `esc.tab.settings`: en "Settings" · uk "Налаштування" (was: text `esc.tab.lobby`: en "Lobby" · uk "Лобі")
- **Shown:**
  - **Menu/H/Tabs/Role** `Button` · variation `ToyTab` · text `esc.tab.role`: en "Role" · uk "Роль" · alignment `LEFT` · toggle_mode true, button_pressed false
  - **Menu/H/Page/Settings** `VBoxContainer` · variation `ToyColumnSixteen` · size flags vertical `SIZE_EXPAND_FILL` · gaps from the variation: separation 16
    - Note: The same subtree (one scene) as the main menu's Settings panel (s2): the mic, the mode, the threshold with its live meter, noise suppression and the volumes work without a session. Saved per player.
    - **Sub** `HBoxContainer` · variation `ToyRowEight` · gaps from the variation: separation 8
      - Note: One ButtonGroup; Settings opens on Sound and voice.
      - **Sound** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.sound`: en "Sound and voice" · uk "Звук і голос" · toggle_mode true, button_pressed false
      - **Controls** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.controls`: en "Controls" · uk "Керування" · toggle_mode true, button_pressed false
      - **Display** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.display`: en "Display" · uk "Екран" · toggle_mode true, button_pressed false
      - **Access** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.accessibility`: en "Accessibility" · uk "Доступність" · toggle_mode true, button_pressed true (ToyToggle draws `ToyChipToggleOnLightSelected`)
      - **Language** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.language`: en "Language" · uk "Мова" · toggle_mode true, button_pressed false
    - **Scroll** `ScrollContainer` · variation `ToyScroll` · size flags vertical `SIZE_EXPAND_FILL` · the gap between the child and the bar from the variation: scrollbar_h_separation 8 · horizontal_scroll_mode `SCROLL_MODE_DISABLED` (vertical scrolling only); `get_v_scroll_bar().theme_type_variation = &"ToyScrollBar"`; the bar shows when the child is taller
      - Note: follow_focus = true, so keyboard and gamepad focus scrolls the focused row in view (the 15 keys of Controls, the volumes at large text).
      - **Rows** `VBoxContainer` · variation `ToyColumnEight` · size flags horizontal `SIZE_EXPAND_FILL` · gaps from the variation: separation 8
        - **LargeText** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
          - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `settings.large_text`: en "Large text" · uk "Великий текст"
            - **Toggle** `HBoxContainer` · variation `ToyRowEight` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (500, 0) · gaps from the variation: separation 8
              - Note: One ButtonGroup. On swaps GameUi's theme to game_theme_large.tres live.
              - **Off** `Button` · variation `ToyChipToggleOnLight` · text `common.off`: en "Off" · uk "Вимкнено" · toggle_mode true, button_pressed true (ToyToggle draws `ToyChipToggleOnLightSelected`)
              - **On** `Button` · variation `ToyChipToggleOnLight` · text `common.on`: en "On" · uk "Увімкнено" · toggle_mode true, button_pressed false
        - **ReducedMotion** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
          - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `settings.reduced_motion`: en "Reduce motion" · uk "Менше руху"
            - **Toggle** `HBoxContainer` · variation `ToyRowEight` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (500, 0) · gaps from the variation: separation 8
              - Note: One ButtonGroup; the default comes from DisplayServer.accessibility_should_reduce_animation(). On: the connecting spinner (s3) turns at half speed; the pre and post game fades (s6, s10) and the End fade are cuts; the press tween of raised buttons is instant (the pressed StyleBox still shows).
              - **Off** `Button` · variation `ToyChipToggleOnLight` · text `common.off`: en "Off" · uk "Вимкнено" · toggle_mode true, button_pressed true (ToyToggle draws `ToyChipToggleOnLightSelected`)
              - **On** `Button` · variation `ToyChipToggleOnLight` · text `common.on`: en "On" · uk "Увімкнено" · toggle_mode true, button_pressed false

## `settings-language`: what differs from `lobby-host`

- **Hidden:** `Menu/H/Page/TitleRow/HostNote`, `Menu/H/Page/Lobby`.
- **Changed** `Menu/H/Tabs/Lobby`: toggle_mode true, button_pressed false (was: toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`) · shown with keyboard focus (grab_focus))
- **Changed** `Menu/H/Tabs/Settings`: toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`) · shown with keyboard focus (grab_focus) (was: toggle_mode true, button_pressed false)
- **Changed** `Menu/H/Page/TitleRow/Title`: text `esc.tab.settings`: en "Settings" · uk "Налаштування" (was: text `esc.tab.lobby`: en "Lobby" · uk "Лобі")
- **Shown:**
  - **Menu/H/Tabs/Role** `Button` · variation `ToyTab` · text `esc.tab.role`: en "Role" · uk "Роль" · alignment `LEFT` · toggle_mode true, button_pressed false
  - **Menu/H/Page/Settings** `VBoxContainer` · variation `ToyColumnSixteen` · size flags vertical `SIZE_EXPAND_FILL` · gaps from the variation: separation 16
    - Note: The same subtree (one scene) as the main menu's Settings panel (s2): the mic, the mode, the threshold with its live meter, noise suppression and the volumes work without a session. Saved per player.
    - **Sub** `HBoxContainer` · variation `ToyRowEight` · gaps from the variation: separation 8
      - Note: One ButtonGroup; Settings opens on Sound and voice.
      - **Sound** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.sound`: en "Sound and voice" · uk "Звук і голос" · toggle_mode true, button_pressed false
      - **Controls** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.controls`: en "Controls" · uk "Керування" · toggle_mode true, button_pressed false
      - **Display** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.display`: en "Display" · uk "Екран" · toggle_mode true, button_pressed false
      - **Access** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.accessibility`: en "Accessibility" · uk "Доступність" · toggle_mode true, button_pressed false
      - **Language** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.language`: en "Language" · uk "Мова" · toggle_mode true, button_pressed true (ToyToggle draws `ToyChipToggleOnLightSelected`)
    - **Scroll** `ScrollContainer` · variation `ToyScroll` · size flags vertical `SIZE_EXPAND_FILL` · the gap between the child and the bar from the variation: scrollbar_h_separation 8 · horizontal_scroll_mode `SCROLL_MODE_DISABLED` (vertical scrolling only); `get_v_scroll_bar().theme_type_variation = &"ToyScrollBar"`; the bar shows when the child is taller
      - Note: follow_focus = true, so keyboard and gamepad focus scrolls the focused row in view (the 15 keys of Controls, the volumes at large text).
      - **Rows** `VBoxContainer` · variation `ToyColumnEight` · size flags horizontal `SIZE_EXPAND_FILL` · gaps from the variation: separation 8
        - **Language** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
          - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `settings.language.title`: en "Game language" · uk "Мова гри"
            - **Choice** `HBoxContainer` · variation `ToyRowEight` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (500, 0) · gaps from the variation: separation 8
              - Note: One ButtonGroup; each language is named in itself (auto_translate_mode DISABLED); the language applies at once (#208). A long list later would take ToyRadio rows.
              - **Ukrainian** `Button` · variation `ToyChipToggleOnLight` · text `lang.uk`: en "Українська" · uk "Українська" · button_pressed while this is the game's language (TranslationServer.get_locale()); the page draws the shown language's chip pressed · toggle_mode true, button_pressed true (ToyToggle draws `ToyChipToggleOnLightSelected`)
              - **English** `Button` · variation `ToyChipToggleOnLight` · text `lang.en`: en "English" · uk "English" · button_pressed while this is the game's language (TranslationServer.get_locale()); the page draws the shown language's chip pressed · toggle_mode true, button_pressed false

## `tutorial-game`: what differs from `lobby-host`

- **Hidden:** `Menu/H/Tabs/Lobby`, `Menu/H/Tabs/Character`, `Menu/H/Page/TitleRow/HostNote`, `Menu/H/Page/Lobby`.
- **Changed** `Menu/H/Tabs/Game`: toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`) (was: toggle_mode true, button_pressed false)
- **Changed** `Menu/H/Page/TitleRow/Title`: text `esc.tab.game`: en "Game" · uk "Гра" (was: text `esc.tab.lobby`: en "Lobby" · uk "Лобі")
- **Shown:**
  - **Menu/H/Page/Actions** `VBoxContainer` · variation `ToyColumnSixteen` · size flags horizontal `SIZE_SHRINK_BEGIN` · custom_minimum_size (760, 0) · gaps from the variation: separation 16
    - **Resume** `Button` · variation `ToyButtonPrimary` (raised: ToyRaised with base `ToyBasePrimaryOnLight`, ToyPress; UiParts.button()) · placement, size flags, custom_minimum_size and visibility on its ToyRaised wrapper · text `esc.game.resume`: en "Resume" · uk "Продовжити" · shown with keyboard focus (grab_focus)
      - Note: Closes the menu (as Esc). Takes focus when the menu opens on Game.
    - **Leave** `Button` · variation `ToyButtonSecondary` (raised: ToyRaised with base `ToyBaseRaisedOnLight`, ToyPress; UiParts.button()) · placement, size flags, custom_minimum_size and visibility on its ToyRaised wrapper · text `esc.game.leave_tutorial`: en "Leave the tutorial" · uk "Вийти з навчання"
      - Note: The host: coral (ToyButtonDanger), opens the confirm dialog. A player: ToyButtonSecondary, leaves at once. In the tutorial: ToyButtonSecondary esc.game.leave_tutorial, back to the main menu (s2).
    - **Quit** `Button` · variation `ToyButtonGhostOnLight` · text `esc.game.quit`: en "Quit the game" · uk "Вийти з гри"
      - Note: The host: opens the confirm dialog (esc.game.quit_confirm, Confirm esc.game.quit). A player, and in the tutorial: quits at once.

## Notes

- The review page emulates Godot's containers with CSS grid (expanding children share the free space by stretch ratio, never below their minimum size), so a pixel or two may differ from Godot.
- A raised variation is built as the tokens spec (§6) says: a `ToyRaised` MarginContainer holding first the base `Panel` (the base named above, chosen by the context it sits in), then the face. The wrapper is the node in its parent: anchors, offsets, grow, size flags, stretch ratio, custom_minimum_size and visibility belong to the wrapper; the variation, the text, toggle_mode, disabled, focus and the signals belong to the face. Hide or show the wrapper, not the face.
- Size constants: a variation's `width`, `height`, `min_width`, `wide_width` and `wide_min_width` theme constants are read by code into `custom_minimum_size`, as the node lines give them. A Panel or PanelContainer takes no size from them on its own: an anchored Panel at offsets 0 is 0×0, a slot shrinks to its text.
- Icons: the tinted ones are white SVGs in `dist/pack/icons/` (the pack's copy of `pages/components/icons`, currentColor written as white): a TextureRect tints one with the `self_modulate` its line gives (the colour the page draws it in), a Button with its variation's `icon_*_color`, an OptionButton its arrow with `modulate_arrow`. The room pictograms are white copies too (`dist/pack/icons/room/`), drawn in ink: their lines give the `self_modulate`. The pack's `assets` list every icon with its tint and `svg_scale`.
- SVG import: Godot rasterises an SVG at import, so import each at `svg/scale` = the largest size it is drawn ÷ its viewBox (the largest over every screen that draws it, as the pack's `assets` give it): `check` 5 (120 px), `chevron-down` 1 (24 px), `chevron-left` 1 (24 px), `chevron-right` 1 (24 px), `item` 5 (120 px), `lock` 0.84 (20 px), `radio-checked` 1 (24 px), `radio-checked-disabled` 1 (24 px), `radio-unchecked` 1 (24 px), `swatch-disc` 1.54 (40 px), `teammate-mark` 0.84 (20 px).
- An OptionButton's open list is its `get_popup()`, a PopupMenu in a window of its own: set its `theme_type_variation` to `ToyDropdownList` in code when the scene is ready (a cream list with the dropdown's ink outline, a lavender hovered or keyboard-focused row). The selected item shows the theme icon `radio_checked` (`dist/pack/icons/radio-checked.svg`, `radio_checked_disabled` `dist/pack/icons/radio-checked-disabled.svg`); the others `radio_unchecked` and `radio_unchecked_disabled` (`dist/pack/icons/radio-unchecked.svg`, empty, so every label starts at the same x). PopupMenu does not tint these icons, so they are drawn in their own colours (not white; the pack names them in the variation's `textures`). Its rounded corners need the default embedded subwindows (`display/window/subwindows/embed_subwindows` true).
- A LineEdit's right-click menu is a PopupMenu too, but its labels (Cut, Copy, Paste, Select All, Clear, Undo, Redo, Text Writing Direction, …) are Godot's English source strings, translated at run time only through translations of those exact strings, which the copy deck (keyed, copy/strings.csv) does not have: in Ukrainian they would show in English. So LineEdits keep `context_menu_enabled = false`; the keyboard shortcuts (copy, paste, select all, undo) still work.
- Boxes and grids take their gaps only from their spacing variation (ToyColumn…, ToyRow…, ToyGrid…), and a ScrollContainer the gap to its bar from ToyScroll; a box without one has a single child. No `theme_override_constants`: the theme test forbids them.
- An HSlider's grabber is a texture: the theme icons `grabber` and `grabber_highlight` are `dist/pack/icons/slider-knob.svg`, `grabber_disabled` `dist/pack/icons/slider-knob-disabled.svg` (own work, in their own colours, not tinted; the pack names them in the variation's `textures`). Slider draws no focus StyleBox of its own: draw the variation's `focus` StyleBox over the slider while it has visible focus.
- A ScrollContainer's bar is its own `VScrollBar`: set its `theme_type_variation` to `ToyScrollBar` in code (`get_v_scroll_bar()`); the child fills the width (`SIZE_EXPAND_FILL`) and keeps its minimum height.

## Keys

- **Drawn** (104): `common.cancel`, `common.code`, `common.off`, `common.on`, `control.backward`, `control.forward`, `control.give_up`, `control.interact`, `control.jump`, `control.left`, `control.map`, `control.put_down`, `control.ready`, `control.right`, `control.spectate_next`, `control.spectate_previous`, `control.sprint`, `control.swap`, `control.talk`, `control.use`, `esc.character.colour`, `esc.character.locked`, `esc.game.leave`, `esc.game.leave_confirm`, `esc.game.leave_host_note`, `esc.game.leave_tutorial`, `esc.game.quit`, `esc.game.resume`, `esc.lobby.code_gone`, `esc.lobby.copy`, `esc.lobby.host_only`, `esc.lobby.preset`, `esc.lobby.ready`, `esc.lobby.you_host`, `esc.role.teammates`, `esc.tab.character`, `esc.tab.game`, `esc.tab.guide`, `esc.tab.lobby`, `esc.tab.role`, `esc.tab.settings`, `guide.basics`, `guide.downed`, `guide.moving`, `guide.tasks`, `guide.voice`, `howto.label`, `howto.switches.done`, `howto.switches.find`, `howto.switches.turn_on`, `howto.switches.watch`, `key.mouse_left`, `key.mouse_right`, `key.space`, `lang.en`, `lang.uk`, `lobby.host_mark`, `lobby.player_count`, `lobby.setting.dissidents`, `lobby.setting.duration`, `lobby.setting.knives`, `lobby.setting.name`, `lobby.setting.packages`, `lobby.setting.task_steps`, `lobby.setting.tasks`, `player.name`, `player.you`, `preset.no_knives`, `preset.quick`, `preset.save_own`, `preset.standard`, `role.dissident`, `role.engineer`, `role.goal.dissident`, `role.goal.engineer`, `settings.controls.press_key`, `settings.controls.reset`, `settings.controls.same_key`, `settings.effects_volume`, `settings.game_volume`, `settings.language.title`, `settings.large_text`, `settings.mic`, `settings.mic.default`, `settings.mic_test`, `settings.music_volume`, `settings.noise_suppression`, `settings.reduced_motion`, `settings.tab.accessibility`, `settings.tab.controls`, `settings.tab.display`, `settings.tab.language`, `settings.tab.sound`, `settings.talk_mode`, `settings.talk_mode.open`, `settings.talk_mode.push`, `settings.voice_threshold`, `settings.voice_volume`, `settings.window`, `settings.window.fullscreen`, `settings.window.windowed`, `task.delivery`, `task.switches`, `unit.minutes`.
- **Named only in the notes** (wire them too): `downed.give_up_hold`, `esc.character.hat`, `esc.game.quit_confirm`, `esc.lobby.copied`, `howto.delivery.take`, `lobby.default_name`, `preset.custom`, `settings.voice_unavailable`, `tutorial.list.death`, `tutorial.step.death.how`, `tutorial.step.death.title`, `tutorial.step.downed.title`, `tutorial.step.move.title`, `tutorial.step.voice.how`, `tutorial.step.voice.title`.

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
