# 5 · Esc menu

<!-- node pages/screens/build.js --handoff s5 (prime-game-ui, pages/screens/src/s05-esc-menu.json); generated, do not edit by hand -->

The styled esc menu screen from the UI track (xperiaroco2/prime-game-ui), as a Godot 4.7.2 node tree for the 1920×1080 reference.

- **Source:** `pages/screens/src/s05-esc-menu.json`; the review page is `pages/screens/screens.html#s5`; the wireframe is section `s5` («Меню Esc»).
- **Theme:** the Toy pack ui-2.1.1 (`dist/pack/toy.pack.json`); the variations below are `theme_type_variation` names.
- **World behind the UI** (not UI): a lit room of the level.
- **How to read it:** the roots are children of the screen's full-rect root `Control`; every property not listed keeps Godot's default; sizes and offsets are reference px. In a state's **Shown** list, the first node of each subtree gives its path from the screen root.
- **Texts** are keys of `copy/strings.csv`, and the language switches live (the Esc menu's Settings). A plain key is set as `text` and translates itself. A key with placeholders, a plural key (`tr_n`) and a key drawn in pieces are set from code with `auto_translate_mode = DISABLED`: `tr()`, then `String.format()` with the data (the samples below), rebuilt on `NOTIFICATION_TRANSLATION_CHANGED`. A "text from data" (names, the room code, times, numbers) is set in code and never translated (`auto_translate_mode = DISABLED`).

The menu over the running game (no pause): Esc (ui_cancel) opens and closes it; the game runs on, the mouse is free while it is open and captured again on close. While it is open the own character takes no gameplay input (it stands still: no move, look, sprint, jump, interact or item use; those keys go to the menu or nowhere); the voice keeps working as set (voice activation, or the Talk key while held). The page shows one frame per tab and case; the focused control is drawn in every state that has one. MVP (m8, 2026-10-20): the roles are alien and human; the Lobby tab has the MVP host settings; the Guide lists the MVP's five tasks. Open (the engineer's design, each a visible placeholder here): the humans' default per player count and what each preset sets; the anger threshold's choices; Knives and the No knives preset (weapons are deferred); the MVP tasks' other settings (only the Wi-Fi's N is decided); the Guide's new topics (points, mutations, the neighbours' anger, the cops, the dead's room); every MVP task's card art (the art track's; own-work Delivery frames stand in here). The game boots straight into the ship (the engineer, 2026-10-21; s2 was removed), and the suit menu holds the start screen's old jobs on its Game tab while there is no session (host, join with a code, join by address, the tutorial) and Settings everywhere.

## States

| State | Page label | What it shows |
|---|---|---|
| `ship` | Корабель | In the ship with no session: the game boots straight here (the engineer, 2026-10-21) and every player returns here when a session ends or they leave it. The menu opens on Game, named Find a lobby (esc.tab.find) while there is no session, whose page holds the jobs of the removed start screen (s2): host, join with a code, join by address, the tutorial. No Lobby or Role tab without a session; Character applies live. Focus on Resume. |
| `ship-code` | Корабель: код | Join pressed: the code field opens beside the list, focused; six valid characters typed, so Join is enabled (it stays disabled until then). |
| `ship-direct` | Корабель: за адресою | Join by address pressed: the address field, focused, with the default port under it; Join, or host directly. |
| `lobby-host` | Лобі: хост | In the lobby, the host's view (the Esc menu opens on Lobby there): presets, the MVP match settings the host edits live (the humans, the anger threshold, the match length, the Wi-Fi passwords; frame 7 of pages/mvp-screens), the room code with Copy, a full lobby of 10 players (the list scrolls) and Ready. Role is hidden in the lobby. |
| `lobby-guest` | Лобі: гравець | A player's view of the same tab, and everyone's in a round (settings change only in the lobby): values without steppers, tasks as static chips, the host's name by a lock. This player joined with the code, so the code row shows. |
| `lobby-no-code` | Лобі: без коду | The host's view when the code service closed or was never reachable: one line in place of the code row. |
| `character` | Персонаж | In the lobby: the name and the body colour apply live. |
| `character-round` | Персонаж у раунді | In a round: locked; the name is read-only and the swatches take no input. |
| `game-host` | Гра: хост | In a round (the menu opens on Game there), the host: Leave and Quit open the confirm dialog. |
| `game-guest` | Гра: гравець | In a round, a player: Leave and Quit act at once. |
| `game-confirm` | Гра: підтвердження | The host pressed Leave: the confirm dialog (P1) over the menu. Quit opens the same dialog titled esc.game.quit_confirm with Confirm esc.game.quit. |
| `role-alien` | Роль: прибулець | In a round only: the own role and its goal. |
| `role-human` | Роль: людина | A human also sees the other humans (humans know each other: the engineer, 2026-10-20; one here, Zinga, as in s6 and s7); the list scrolls when it is longer than the view. With no other human the Team column is hidden. |
| `guide` | Посібник | Every how-to card: the basics from the tutorial and one card per MVP task type; Cooking selected. Its art is a placeholder (own-work Delivery frames) until the art track's cards exist; the card holds as many frames as its task needs and scrolls sideways. |
| `settings-sound` | Звук і голос | Settings opens on Sound and voice. Voice activation is selected, so the threshold row shows. Settings shows only here since the game boots into the ship. |
| `settings-controls` | Керування | Interact is capturing a key; Talk was rebound to M, so Talk and Map show Same key. The list scrolls. |
| `settings-display` | Екран | The window mode. |
| `settings-access` | Доступність | Large text and reduced motion. |
| `settings-language` | Мова | The game language; it applies at once. |
| `tutorial-game` | Навчання | The tutorial's menu: only Game, Guide and Settings; Leave goes back to the ship. |

## Node tree in `ship`

- **Dim** `Panel` · variation `ToyBackdropDeep` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both
  - Note: Dims the running game behind the menu.
- **Menu** `PanelContainer` · variation `ToyPanelMenu` · anchors `center`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (1536, 864)
  - **V** `VBoxContainer` · variation `ToyColumnTwentyFour` · gaps from the variation: separation 24
    - **Strip** `PanelContainer` · variation `ToyTabStrip`
      - Note: ui-2.1.0 (the target page's .tabs): the tabs in one row on the strip, its 2 px edge line under them; the chosen tab light over the accent underline (ToyTabSelected); the small Esc keycap at the right closes the menu.
      - **Tabs** `HBoxContainer` · variation `ToyRowFour` · gaps from the variation: separation 4
        - Note: One ButtonGroup; the selected tab shows its page. Default tab: Game in the ship with no session, Lobby in the lobby, Game in a round and in the tutorial; the last tab is kept for the session. Role is hidden in the lobby; the tutorial shows only Game, Guide and Settings. Focus starts on the selected tab (drawn selected-focus); on Game, Resume takes it.
        - **Game** `Button` · variation `ToyTab` · text `esc.tab.find`: en "Find a lobby" · uk "Знайти лобі" · toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`)
          - Note: One tab, two names: esc.tab.find («Знайти лобі», the engineer's word, 2026-10-22) while there is no session, esc.tab.game in a session; the game swaps the key when a session starts or ends.
        - **Guide** `Button` · variation `ToyTab` · text `esc.tab.guide`: en "Guide" · uk "Посібник" · toggle_mode true, button_pressed false
        - **Character** `Button` · variation `ToyTab` · text `esc.tab.character`: en "Character" · uk "Персонаж" · toggle_mode true, button_pressed false
        - **Settings** `Button` · variation `ToyTab` · text `esc.tab.settings`: en "Settings" · uk "Налаштування" · toggle_mode true, button_pressed false
          - Note: settings-controls: focus is on the capturing Interact key, so this tab is drawn selected without focus.
        - **Gap** `Control` · size flags horizontal `SIZE_EXPAND_FILL`
          - Note: Pushes the Esc keycap to the right end of the strip.
        - **Esc** `PanelContainer` · variation `ToyKeyQuiet` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (42, 0) = Vector2(get_theme_constant("min_width", "ToyKeyQuiet"), 0)
          - Note: The key that closes the menu, shown small (the target); its name is the bound key from the InputMap (data, not a copy key).
          - **Text** `Label` · variation `ToyKeyQuietText` · text from data (auto_translate_mode = DISABLED), sample: "Esc"
    - **Page** `VBoxContainer` · variation `ToyColumnTwentyFour` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_EXPAND_FILL` · gaps from the variation: separation 24
      - **TitleRow** `HBoxContainer` · variation `ToyRowTwentyFour` · gaps from the variation: separation 24
        - **Title** `Label` · variation `ToyTitleOnLight` · size flags horizontal `SIZE_EXPAND_FILL` · text `esc.tab.find`: en "Find a lobby" · uk "Знайти лобі"
          - Note: The selected tab's name.
      - **Ship** `HBoxContainer` · variation `ToyRowThirtyTwo` · gaps from the variation: separation 32
        - Note: The Game page in the ship with no session, its tab named esc.tab.find (the jobs of the removed start screen s2, #111; prime-game#1285): the list at the left, the open join field at its right. There is no server browser: Host makes a game with a code, Join takes a code, Join by address joins or hosts directly (LAN, VPN). Join and Join by address are one ButtonGroup with allow_unpress: pressing one opens its field, pressing it again, Back or Esc (ui_cancel) closes it (Esc with no field open closes the menu). The target page's «Знайти лобі» list (lobbies nearby) is not drawn: it has no copy key and the game has no server browser (docs/ui-decisions.md).
        - **Items** `VBoxContainer` · variation `ToyColumnSixteen` · size flags vertical `SIZE_SHRINK_BEGIN` · custom_minimum_size (420, 0) · gaps from the variation: separation 16
          - Note: Up and down move the focus through the list. 420 px holds «Приєднатися за адресою» at large text.
          - **Resume** `Button` · variation `ToyButtonPrimary` · text `esc.game.resume`: en "Resume" · uk "Продовжити" · shown with keyboard focus (grab_focus)
            - Note: Closes the menu (as Esc). Takes focus when the menu opens.
          - **Host** `Button` · variation `ToyButtonSecondary` · text `menu.host`: en "Host a game" · uk "Створити гру"
            - Note: Hosts a game with a code (WebRTC): the ship becomes the lobby (s4) and the menu, opened again, shows the Lobby tab with the code; a failure shows s3 host-failed.
          - **Join** `Button` · variation `ToyButtonSecondary` · text `menu.join`: en "Join" · uk "Приєднатися" · toggle_mode true, button_pressed false
            - Note: In the join ButtonGroup; button_pressed while CodePanel is open (the pressed StyleBox). Toggles CodePanel.
          - **Direct** `Button` · variation `ToyButtonSecondary` · text `menu.direct`: en "Join by address" · uk "Приєднатися за адресою" · toggle_mode true, button_pressed false
            - Note: In the join ButtonGroup; button_pressed while DirectPanel is open. Toggles DirectPanel.
          - **Tutorial** `Button` · variation `ToyButtonSecondary` · text `menu.tutorial`: en "Tutorial" · uk "Навчання"
            - Note: Loads the tutorial's first lesson (s1); its end returns to the ship.
          - **Quit** `Button` · variation `ToyButtonGhostOnLight` · text `esc.game.quit`: en "Quit the game" · uk "Вийти з гри"
            - Note: Quits the game at once (no session to end).

## `ship-code`: what differs from `ship`

- **Changed** `Menu/V/Page/Ship/Items/Resume`: no longer shown with keyboard focus (grab_focus)
- **Changed** `Menu/V/Page/Ship/Items/Join`: toggle_mode true, button_pressed true (its own `pressed` StyleBox; the variation has no toggle partner) (was: toggle_mode true, button_pressed false)
- **Shown:**
  - **Menu/V/Page/Ship/CodePanel** `VBoxContainer` · variation `ToyColumnTwentyFour` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_BEGIN` · gaps from the variation: separation 24
    - Note: Join with a code; no panel of its own inside the menu's tile (agent).
    - **Field** `VBoxContainer` · variation `ToyColumnTwelve` · gaps from the variation: separation 12
      - **CodeLabel** `Label` · variation `ToyTextMutedOnLight` · text `common.code`: en "Code" · uk "Код"
      - **Code** `LineEdit` · variation `ToyField` · text (sample data) "K7Q2XR" · context_menu_enabled false (Godot's right-click menu would show untranslated English labels; see the notes) · shown focused with the caret
        - Note: Focused when the field opens, empty until typed. max_length 6; upper-cases as typed, drops spaces and dashes on paste, accepts only the 31-letter code alphabet (no 0, O, 1, I, L). Keeps what was typed after a failure (back from s3). Enter = Join when it is enabled. auto_translate_mode DISABLED.
    - **Buttons** `HBoxContainer` · variation `ToyRowTwentyFour` · gaps from the variation: separation 24
      - **Join** `Button` · variation `ToyButtonPrimary` · size flags horizontal `SIZE_EXPAND_FILL` · text `join.connect`: en "Join" · uk "Приєднатися"
        - Note: Disabled (unplugged) until the field holds 6 valid characters. Joins by the code: s3 finding.
      - **Back** `Button` · variation `ToyButtonGhostOnLight` · text `common.back`: en "Back" · uk "Назад"
        - Note: Closes the field and unpresses Join; Esc does the same.

## `ship-direct`: what differs from `ship`

- **Changed** `Menu/V/Page/Ship/Items/Resume`: no longer shown with keyboard focus (grab_focus)
- **Changed** `Menu/V/Page/Ship/Items/Direct`: toggle_mode true, button_pressed true (its own `pressed` StyleBox; the variation has no toggle partner) (was: toggle_mode true, button_pressed false)
- **Shown:**
  - **Menu/V/Page/Ship/DirectPanel** `VBoxContainer` · variation `ToyColumnTwentyFour` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_BEGIN` · gaps from the variation: separation 24
    - Note: Join or host directly over ENet (LAN, VPN, playit.gg). No address is shown anywhere else (streams).
    - **Field** `VBoxContainer` · variation `ToyColumnTwelve` · gaps from the variation: separation 12
      - **AddressLabel** `Label` · variation `ToyTextMutedOnLight` · text `join.address`: en "Host address" · uk "Адреса хоста"
      - **Address** `LineEdit` · variation `ToyField` · text (sample data) "192.168.0.12" · context_menu_enabled false (Godot's right-click menu would show untranslated English labels; see the notes) · shown focused with the caret
        - Note: Focused when the field opens. Takes host or host:port, host names included (JoinTarget). Keeps what was typed after a failure. Enter = Join. auto_translate_mode DISABLED.
      - **Port** `Label` · variation `ToyTextMutedOnLight` · text `join.port` with sample {port} = "7777": en "Port 7777" · uk "Порт 7777"
        - Note: The default port, used when the address has none.
    - **Buttons** `HBoxContainer` · variation `ToyRowTwentyFour` · gaps from the variation: separation 24
      - **Join** `Button` · variation `ToyButtonPrimary` · size flags horizontal `SIZE_EXPAND_FILL` · text `join.connect`: en "Join" · uk "Приєднатися"
        - Note: Disabled (unplugged) while Address is empty. Joins over ENet: s3 (the connecting steps, no code row).
      - **Host** `Button` · variation `ToyButtonSecondary` · text `menu.host`: en "Host a game" · uk "Створити гру"
        - Note: Hosts directly (ENet) on the port typed, else the default; the ship becomes the lobby (s4) with no code row.
      - **Back** `Button` · variation `ToyButtonGhostOnLight` · text `common.back`: en "Back" · uk "Назад"
        - Note: Closes the field and unpresses Join by address; Esc does the same.

## `lobby-host`: what differs from `ship`

- **Hidden:** `Menu/V/Page/Ship`.
- **Changed** `Menu/V/Strip/Tabs/Game`: text `esc.tab.game`: en "Game" · uk "Гра" · toggle_mode true, button_pressed false (was: text `esc.tab.find`: en "Find a lobby" · uk "Знайти лобі" · toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`))
- **Changed** `Menu/V/Page/TitleRow/Title`: text `esc.tab.lobby`: en "Lobby" · uk "Лобі" (was: text `esc.tab.find`: en "Find a lobby" · uk "Знайти лобі")
- **Shown:**
  - **Menu/V/Strip/Tabs/Lobby** `Button` · variation `ToyTab` · text `esc.tab.lobby`: en "Lobby" · uk "Лобі" · toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`) · shown with keyboard focus (grab_focus)
  - **Menu/V/Page/TitleRow/HostNote** `Label` · variation `ToyTextMutedOnLight` · size flags vertical `SIZE_SHRINK_CENTER` · text `esc.lobby.you_host`: en "You're the host: everyone sees your changes" · uk "Ти хост: зміни бачать усі"
  - **Menu/V/Page/Lobby** `VBoxContainer` · variation `ToyColumnTwentyFour` · size flags vertical `SIZE_EXPAND_FILL` · gaps from the variation: separation 24
    - **Presets** `HBoxContainer` · variation `ToyRowTwentyFour` · gaps from the variation: separation 24
      - Note: One ButtonGroup over the cards (Save is not in it). A card applies its values; any other change deselects every card (a player then reads preset.custom). Save your own stores one custom preset: a card named preset.custom, built like Standard, appears before Save. The four cards share the page width (expand_fill, at least 196 px: «Звичайний» at large text), as on the MVP sketch. What Standard and Quick set for the humans and the anger threshold is open (the engineer's design); whether No knives stays is open (weapons are deferred, m8 §7).
      - **Standard** `Button` · variation `ToyPresetCard` · size flags horizontal `SIZE_EXPAND_FILL` · custom_minimum_size (196, 96) · no text or icon: its child is its content, drawn in its StyleBox content rect (the child and every node inside ignore the mouse, so the Button takes the press); a Button's minimum size does not follow its children, so custom_minimum_size holds the content at large text · toggle_mode true, button_pressed true (ToyToggle draws `ToyPresetCardSelected`)
        - Note: The card has no text of its own: V holds the preset's name and its note (the preset's match duration); the note is ToyPresetCardNote on an idle card and ToyPresetCardNoteSelected on the selected one.
        - **V** `VBoxContainer` · variation `ToyColumnEight` · the Button's content: anchors `full_rect`, offsets 16, 16, -16, -16 (the `normal` StyleBox's content margins), mouse_filter `MOUSE_FILTER_IGNORE` on it and every node inside · gaps from the variation: separation 8 · alignment `ALIGNMENT_CENTER`
          - **Name** `Label` · variation `ToyPresetCardName` · text `preset.standard`: en "Standard" · uk "Звичайний" · horizontal_alignment `CENTER`
          - **Note** `Label` · variation `ToyPresetCardNoteSelected` · text `unit.minutes` with sample {count} = "10": en "10 min" · uk "10 хв" · horizontal_alignment `CENTER`
      - **Quick** `Button` · variation `ToyPresetCard` · size flags horizontal `SIZE_EXPAND_FILL` · custom_minimum_size (196, 96) · no text or icon: its child is its content, drawn in its StyleBox content rect (the child and every node inside ignore the mouse, so the Button takes the press); a Button's minimum size does not follow its children, so custom_minimum_size holds the content at large text · toggle_mode true, button_pressed false
        - **V** `VBoxContainer` · variation `ToyColumnEight` · the Button's content: anchors `full_rect`, offsets 16, 16, -16, -16 (the `normal` StyleBox's content margins), mouse_filter `MOUSE_FILTER_IGNORE` on it and every node inside · gaps from the variation: separation 8 · alignment `ALIGNMENT_CENTER`
          - **Name** `Label` · variation `ToyPresetCardName` · text `preset.quick`: en "Quick" · uk "Швидкий" · horizontal_alignment `CENTER`
          - **Note** `Label` · variation `ToyPresetCardNote` · text `unit.minutes` with sample {count} = "5": en "5 min" · uk "5 хв" · horizontal_alignment `CENTER`
      - **NoKnives** `Button` · variation `ToyPresetCard` · size flags horizontal `SIZE_EXPAND_FILL` · custom_minimum_size (196, 96) · no text or icon: its child is its content, drawn in its StyleBox content rect (the child and every node inside ignore the mouse, so the Button takes the press); a Button's minimum size does not follow its children, so custom_minimum_size holds the content at large text · toggle_mode true, button_pressed false
        - Note: Open (weapons are deferred, m8 §7): kept as a placeholder until the engineer decides which melee the MVP keeps.
        - **V** `VBoxContainer` · variation `ToyColumnEight` · the Button's content: anchors `full_rect`, offsets 16, 16, -16, -16 (the `normal` StyleBox's content margins), mouse_filter `MOUSE_FILTER_IGNORE` on it and every node inside · gaps from the variation: separation 8 · alignment `ALIGNMENT_CENTER`
          - **Name** `Label` · variation `ToyPresetCardName` · text `preset.no_knives`: en "No knives" · uk "Без ножів" · horizontal_alignment `CENTER`
          - **Note** `Label` · variation `ToyPresetCardNote` · text `unit.minutes` with sample {count} = "10": en "10 min" · uk "10 хв" · horizontal_alignment `CENTER`
      - **Save** `Button` · variation `ToyPresetCard` · size flags horizontal `SIZE_EXPAND_FILL` · custom_minimum_size (196, 96) · no text or icon: its child is its content, drawn in its StyleBox content rect (the child and every node inside ignore the mouse, so the Button takes the press); a Button's minimum size does not follow its children, so custom_minimum_size holds the content at large text
        - Note: A press button with the card's face (not a toggle, not in the ButtonGroup): saves the current values as the own preset. Its name wraps onto two lines where it is longer than the card.
        - **V** `VBoxContainer` · variation `ToyColumnEight` · the Button's content: anchors `full_rect`, offsets 16, 16, -16, -16 (the `normal` StyleBox's content margins), mouse_filter `MOUSE_FILTER_IGNORE` on it and every node inside · gaps from the variation: separation 8 · alignment `ALIGNMENT_CENTER`
          - **Name** `Label` · variation `ToyPresetCardName` · custom_minimum_size (160, 0) · text `preset.save_own`: en "Save your own" · uk "Зберегти свій" · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
    - **Body** `HBoxContainer` · variation `ToyRowThirtyTwo` · size flags vertical `SIZE_EXPAND_FILL` · gaps from the variation: separation 32
      - **SettingList** `VBoxContainer` · variation `ToyColumnTwelve` · size flags horizontal `SIZE_EXPAND_FILL` · gaps from the variation: separation 12
        - Note: The host's edits apply live for everyone. The rows of frame 7 of pages/mvp-screens: the humans, the anger threshold, the match length, the Wi-Fi passwords, after the lobby name; Packages and the task rows (Delivery, Switches) are gone with Delivery. Every row is at least 96 px tall (the field row's height), so the rows of a list keep one height; every control sits in a 345 px column at the right (the sketch's 230 x 1.5). Open (the engineer's design): the humans' default per player count, the anger threshold's choices, what else each MVP task sets (only the Wi-Fi's N is decided), and Knives (weapons are deferred).
        - **Name** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (160, 0) · text `lobby.setting.name`: en "Lobby name" · uk "Назва лобі" · autowrap_mode `AUTOWRAP_WORD_SMART`
            - **Field** `LineEdit` · variation `ToyField` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (345, 0) · text (sample data) "Olena's lobby" / "Лобі: Олена" · context_menu_enabled false (Godot's right-click menu would show untranslated English labels; see the notes)
              - Note: The lobby name (#214), lobby.default_name until the host changes it; auto_translate_mode DISABLED. editable false for a player (the quiet read-only box), who cannot scroll it: 345 px (the control column of the MVP sketch) holds about 16 characters at large text; a longer name shows its start. max_length per #214, which has not set it yet.
        - **Humans** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - Note: The exact number of humans among the players (m8 §2, #1032), as lobby.setting.humans_of: {count} of {total}, where {total} is the players now in the lobby (the stepper's maximum). Bounds and the default per player count are open (research round 2 suggests 4→1 … 10→3).
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (160, 0) · text `lobby.setting.humans`: en "Humans" · uk "Люди" · autowrap_mode `AUTOWRAP_WORD_SMART`
            - **Stepper** `HBoxContainer` · variation `ToyRowTwelve` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (345, 0) · gaps from the variation: separation 12 · alignment `ALIGNMENT_END`
              - **Less** `Button` · variation `ToyStepper` · custom_minimum_size (51, 51) = Vector2(get_theme_constant("width", "ToyStepper"), get_theme_constant("height", "ToyStepper")) · icon `minus` (dist/pack/icons/minus.svg, own work) at 24 px, tinted by `ToyStepper`'s icon_*_color
              - **Value** `Label` · variation `ToySettingRowValue` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (156, 0) · text `lobby.setting.humans_of` with sample {count} = "3", {total} = "10": en "3 of 10" · uk "3 з 10" · horizontal_alignment `CENTER`
                - Note: {count} the humans set; {total} the players now in the lobby, which is also the stepper's maximum, so it follows joins and leaves: 3 of 10 in the full lobby, 1 of 4 in the guest's lobby of 4.
              - **More** `Button` · variation `ToyStepper` · custom_minimum_size (51, 51) = Vector2(get_theme_constant("width", "ToyStepper"), get_theme_constant("height", "ToyStepper")) · icon `plus` (dist/pack/icons/plus.svg, own work) at 24 px, tinted by `ToyStepper`'s icon_*_color
        - **Anger** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - Note: The neighbours' anger threshold that calls the cops (m8 §5). Its choices are open (the engineer's design); 50 and 100 are the sketch's samples.
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (160, 0) · text `lobby.setting.anger`: en "Anger threshold" · uk "Поріг гніву" · autowrap_mode `AUTOWRAP_WORD_SMART`
            - **Choice** `HBoxContainer` · variation `ToyRowTwelve` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (345, 0) · gaps from the variation: separation 12 · alignment `ALIGNMENT_END`
              - Note: One ButtonGroup, one toggle chip per threshold; each label is the number (data, auto_translate_mode DISABLED).
              - **Fifty** `Button` · variation `ToyChipToggleOnLight` · text from data (auto_translate_mode = DISABLED), sample: "50" · toggle_mode true, button_pressed false
              - **Hundred** `Button` · variation `ToyChipToggleOnLight` · text from data (auto_translate_mode = DISABLED), sample: "100" · toggle_mode true, button_pressed true (ToyToggle draws `ToyChipToggleOnLightSelected`)
        - **Duration** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (160, 0) · text `lobby.setting.duration`: en "Match duration" · uk "Тривалість матчу" · autowrap_mode `AUTOWRAP_WORD_SMART`
            - **Stepper** `HBoxContainer` · variation `ToyRowTwelve` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (345, 0) · gaps from the variation: separation 12 · alignment `ALIGNMENT_END`
              - **Less** `Button` · variation `ToyStepper` · custom_minimum_size (51, 51) = Vector2(get_theme_constant("width", "ToyStepper"), get_theme_constant("height", "ToyStepper")) · icon `minus` (dist/pack/icons/minus.svg, own work) at 24 px, tinted by `ToyStepper`'s icon_*_color
                - Note: Steps the value down; disabled (unplugged) at the lower bound. Keyboard and gamepad reach Less and More by focus (ui_left and ui_right move between them) and step with ui_accept. When a step reaches a bound, the other arrow takes focus (More.grab_focus()) before this one is disabled, so focus never rests on an unplugged arrow. The value is 156 px wide, so every stepper has one width and the arrows line up down the list. Every stepper below works the same; a player sees only the value.
              - **Value** `Label` · variation `ToySettingRowValue` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (156, 0) · text `unit.minutes` with sample {count} = "10": en "10 min" · uk "10 хв" · horizontal_alignment `CENTER`
              - **More** `Button` · variation `ToyStepper` · custom_minimum_size (51, 51) = Vector2(get_theme_constant("width", "ToyStepper"), get_theme_constant("height", "ToyStepper")) · icon `plus` (dist/pack/icons/plus.svg, own work) at 24 px, tinted by `ToyStepper`'s icon_*_color
                - Note: Steps the value up; disabled (unplugged) at the upper bound.
        - **WifiPasswords** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - Note: The Wi-Fi task's N: the passwords to enter before the task is done (GDD §8, a decided lobby setting). Bounds and the default are the game's data.
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (160, 0) · text `lobby.setting.wifi_passwords`: en "Wi-Fi passwords" · uk "Паролі Wi-Fi" · autowrap_mode `AUTOWRAP_WORD_SMART`
            - **Stepper** `HBoxContainer` · variation `ToyRowTwelve` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (345, 0) · gaps from the variation: separation 12 · alignment `ALIGNMENT_END`
              - **Less** `Button` · variation `ToyStepper` · custom_minimum_size (51, 51) = Vector2(get_theme_constant("width", "ToyStepper"), get_theme_constant("height", "ToyStepper")) · icon `minus` (dist/pack/icons/minus.svg, own work) at 24 px, tinted by `ToyStepper`'s icon_*_color
              - **Value** `Label` · variation `ToySettingRowValue` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (156, 0) · text from data (auto_translate_mode = DISABLED), sample: "3" · horizontal_alignment `CENTER`
                - Note: str(value) (auto_translate_mode DISABLED).
              - **More** `Button` · variation `ToyStepper` · custom_minimum_size (51, 51) = Vector2(get_theme_constant("width", "ToyStepper"), get_theme_constant("height", "ToyStepper")) · icon `plus` (dist/pack/icons/plus.svg, own work) at 24 px, tinted by `ToyStepper`'s icon_*_color
        - **Knives** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - Note: Open (weapons are deferred, m8 §7): a placeholder until the engineer decides which melee the MVP keeps.
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (160, 0) · text `lobby.setting.knives`: en "Knives" · uk "Ножі" · autowrap_mode `AUTOWRAP_WORD_SMART`
            - **Stepper** `HBoxContainer` · variation `ToyRowTwelve` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (345, 0) · gaps from the variation: separation 12 · alignment `ALIGNMENT_END`
              - **Less** `Button` · variation `ToyStepper` · custom_minimum_size (51, 51) = Vector2(get_theme_constant("width", "ToyStepper"), get_theme_constant("height", "ToyStepper")) · icon `minus` (dist/pack/icons/minus.svg, own work) at 24 px, tinted by `ToyStepper`'s icon_*_color
              - **Value** `Label` · variation `ToySettingRowValue` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (156, 0) · text from data (auto_translate_mode = DISABLED), sample: "2" · horizontal_alignment `CENTER`
                - Note: str(value) (auto_translate_mode DISABLED).
              - **More** `Button` · variation `ToyStepper` · custom_minimum_size (51, 51) = Vector2(get_theme_constant("width", "ToyStepper"), get_theme_constant("height", "ToyStepper")) · icon `plus` (dist/pack/icons/plus.svg, own work) at 24 px, tinted by `ToyStepper`'s icon_*_color
      - **Side** `VBoxContainer` · variation `ToyColumnTwentyFour` · custom_minimum_size (420, 0) · gaps from the variation: separation 24
        - **CodeRow** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
          - Note: The room code, to whoever knows it: the host who hosted with a code and each player who joined with it (never an address), drawn as a keycap as on the lobby HUD (s4, the same row). Hidden for a Direct host and for Direct joiners (no code exists).
          - **Label** `Label` · variation `ToyTextMutedOnLight` · size flags vertical `SIZE_SHRINK_CENTER` · text `common.code`: en "Code" · uk "Код"
          - **Code** `PanelContainer` · variation `ToyKeyOnLight` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (42, 0) = Vector2(get_theme_constant("min_width", "ToyKeyOnLight"), 0)
            - **Text** `Label` · variation `ToyKeyText` · text from data (auto_translate_mode = DISABLED), sample: "K7Q2XR" · horizontal_alignment `CENTER`
              - Note: The room code (auto_translate_mode DISABLED).
          - **Copy** `Button` · variation `ToyButtonGhostOnLight` · size flags vertical `SIZE_SHRINK_CENTER` · text `esc.lobby.copy`: en "Copy" · uk "Копіювати"
            - Note: DisplayServer.clipboard_set(code); the text reads esc.lobby.copied for 1.5 s, then esc.lobby.copy again.
        - **Players** `VBoxContainer` · variation `ToyColumnTwelve` · size flags vertical `SIZE_EXPAND_FILL` · gaps from the variation: separation 12
          - **Count** `Label` · variation `ToyTextMutedOnLight` · text `lobby.player_count` with sample {count} = "10", {total} = "10": en "Players 10 / 10" · uk "Гравці 10 / 10"
          - **Scroll** `ScrollContainer` · variation `ToyScroll` · size flags vertical `SIZE_EXPAND_FILL` · the gap between the child and the bar from the variation: scrollbar_h_separation 8 · horizontal_scroll_mode `SCROLL_MODE_DISABLED` (vertical scrolling only); `get_v_scroll_bar().theme_type_variation = &"ToyScrollBar"`; the bar shows when the child is taller
            - Note: Takes the height left between the code row and Ready inside the fixed menu, so a full lobby of 10 never makes the menu taller: the rows scroll (lobby-host shows 10 players, lobby-guest 4). follow_focus = true.
            - **Rows** `VBoxContainer` · variation `ToyColumnTwelve` · size flags horizontal `SIZE_EXPAND_FILL` · gaps from the variation: separation 12
              - **Host** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
                - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
                  - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `player.you`: en "You" · uk "Ти" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
                    - Note: One row per player in join order: the own row reads player.you, the host's row lobby.host_mark with the host's name, the others the name alone (auto_translate_mode DISABLED). In the host's own view the first row is the own one. A long name is cut with an ellipsis, so it never widens the menu.
              - **Taras** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
                - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
                  - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Taras" / "Тарас" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
                  - **Ready** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (36, 36) · texture `check` (dist/pack/icons/check.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToySettingRowText")
              - **Ivan** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
                - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
                  - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Ivan" / "Іван" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
                  - **Ready** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (36, 36) · texture `check` (dist/pack/icons/check.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToySettingRowText")
              - **Marko** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
                - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
                  - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Marko" / "Марко" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
                  - **Ready** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (36, 36) · texture `check` (dist/pack/icons/check.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToySettingRowText")
              - **Oksana** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
                - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
                  - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Oksana" / "Оксана" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
                  - **Ready** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (36, 36) · texture `check` (dist/pack/icons/check.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToySettingRowText")
              - **Solomiia** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
                - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
                  - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Solomiia" / "Соломія" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
              - **Bohdan** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
                - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
                  - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Bohdan" / "Богдан" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
                  - **Ready** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (36, 36) · texture `check` (dist/pack/icons/check.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToySettingRowText")
              - **Iryna** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
                - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
                  - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Iryna" / "Ірина" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
              - **Dmytro** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
                - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
                  - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Dmytro" / "Дмитро" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
                  - **Ready** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (36, 36) · texture `check` (dist/pack/icons/check.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToySettingRowText")
              - **Lesia** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
                - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
                  - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Lesia" / "Леся" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
        - **Ready** `Button` · variation `ToyButtonPrimary` · text `esc.lobby.ready`: en "Ready" · uk "Готовність" · toggle_mode true, button_pressed false
          - Note: Toggles the own ready state: while ready it is pressed (ToyButtonPrimary's pressed look) and shows the check icon (check.svg at 24 px, tinted by ToyButtonPrimary's icon colours) before its text, the same as the own row's mark (lobby-guest: this player is ready; the page does not draw the pressed look with its icon yet). Hidden in a round, where nobody gets ready.

## `lobby-guest`: what differs from `ship`

- **Hidden:** `Menu/V/Page/Ship`.
- **Changed** `Menu/V/Strip/Tabs/Game`: text `esc.tab.game`: en "Game" · uk "Гра" · toggle_mode true, button_pressed false (was: text `esc.tab.find`: en "Find a lobby" · uk "Знайти лобі" · toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`))
- **Changed** `Menu/V/Page/TitleRow/Title`: text `esc.tab.lobby`: en "Lobby" · uk "Лобі" (was: text `esc.tab.find`: en "Find a lobby" · uk "Знайти лобі")
- **Shown:**
  - **Menu/V/Strip/Tabs/Lobby** `Button` · variation `ToyTab` · text `esc.tab.lobby`: en "Lobby" · uk "Лобі" · toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`) · shown with keyboard focus (grab_focus)
  - **Menu/V/Page/TitleRow/HostOnly** `HBoxContainer` · variation `ToyRowTwelve` · size flags vertical `SIZE_SHRINK_CENTER` · gaps from the variation: separation 12
    - Note: A player's view in the lobby only; hidden in a round, where nobody changes the settings and the values without steppers already read as fixed.
    - **Lock** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (30, 30) · texture `lock` (dist/pack/icons/lock.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToyTextMutedOnLight")
    - **Text** `Label` · variation `ToyTextMutedOnLight` · text `esc.lobby.host_only` with sample {name} = "Olena" / "Олена": en "Only the host changes these · Olena" · uk "Змінює лише хост · Олена"
  - **Menu/V/Page/Lobby** `VBoxContainer` · variation `ToyColumnTwentyFour` · size flags vertical `SIZE_EXPAND_FILL` · gaps from the variation: separation 24
    - **Preset** `Label` · variation `ToyTextOnLight` · text `esc.lobby.preset` with sample {preset} = "Standard" / "Звичайний": en "Preset: Standard" · uk "Шаблон: Звичайний"
      - Note: {preset} is tr() of the applied preset's name key (preset.standard, preset.quick, preset.no_knives), or preset.custom.
    - **Body** `HBoxContainer` · variation `ToyRowThirtyTwo` · size flags vertical `SIZE_EXPAND_FILL` · gaps from the variation: separation 32
      - **SettingList** `VBoxContainer` · variation `ToyColumnTwelve` · size flags horizontal `SIZE_EXPAND_FILL` · gaps from the variation: separation 12
        - Note: The host's edits apply live for everyone. The rows of frame 7 of pages/mvp-screens: the humans, the anger threshold, the match length, the Wi-Fi passwords, after the lobby name; Packages and the task rows (Delivery, Switches) are gone with Delivery. Every row is at least 96 px tall (the field row's height), so the rows of a list keep one height; every control sits in a 345 px column at the right (the sketch's 230 x 1.5). Open (the engineer's design): the humans' default per player count, the anger threshold's choices, what else each MVP task sets (only the Wi-Fi's N is decided), and Knives (weapons are deferred).
        - **Name** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (160, 0) · text `lobby.setting.name`: en "Lobby name" · uk "Назва лобі" · autowrap_mode `AUTOWRAP_WORD_SMART`
            - **Field** `LineEdit` · variation `ToyField` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (345, 0) · text (sample data) "Olena's lobby" / "Лобі: Олена" · editable false · context_menu_enabled false (Godot's right-click menu would show untranslated English labels; see the notes)
              - Note: The lobby name (#214), lobby.default_name until the host changes it; auto_translate_mode DISABLED. editable false for a player (the quiet read-only box), who cannot scroll it: 345 px (the control column of the MVP sketch) holds about 16 characters at large text; a longer name shows its start. max_length per #214, which has not set it yet.
        - **Humans** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - Note: The exact number of humans among the players (m8 §2, #1032), as lobby.setting.humans_of: {count} of {total}, where {total} is the players now in the lobby (the stepper's maximum). Bounds and the default per player count are open (research round 2 suggests 4→1 … 10→3).
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (160, 0) · text `lobby.setting.humans`: en "Humans" · uk "Люди" · autowrap_mode `AUTOWRAP_WORD_SMART`
            - **Stepper** `HBoxContainer` · variation `ToyRowTwelve` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (345, 0) · gaps from the variation: separation 12 · alignment `ALIGNMENT_END`
              - **Value** `Label` · variation `ToySettingRowValue` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (156, 0) · text `lobby.setting.humans_of` with sample {count} = "1", {total} = "4": en "1 of 4" · uk "1 з 4" · horizontal_alignment `CENTER`
                - Note: {count} the humans set; {total} the players now in the lobby, which is also the stepper's maximum, so it follows joins and leaves: 3 of 10 in the full lobby, 1 of 4 in the guest's lobby of 4.
        - **Anger** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - Note: The neighbours' anger threshold that calls the cops (m8 §5). Its choices are open (the engineer's design); 50 and 100 are the sketch's samples.
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (160, 0) · text `lobby.setting.anger`: en "Anger threshold" · uk "Поріг гніву" · autowrap_mode `AUTOWRAP_WORD_SMART`
            - **Value** `Label` · variation `ToySettingRowValue` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (156, 0) · text from data (auto_translate_mode = DISABLED), sample: "100" · horizontal_alignment `CENTER`
              - Note: A player sees the chosen threshold only: str(value) (auto_translate_mode DISABLED), under the steppers' values.
        - **Duration** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (160, 0) · text `lobby.setting.duration`: en "Match duration" · uk "Тривалість матчу" · autowrap_mode `AUTOWRAP_WORD_SMART`
            - **Stepper** `HBoxContainer` · variation `ToyRowTwelve` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (345, 0) · gaps from the variation: separation 12 · alignment `ALIGNMENT_END`
              - **Value** `Label` · variation `ToySettingRowValue` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (156, 0) · text `unit.minutes` with sample {count} = "10": en "10 min" · uk "10 хв" · horizontal_alignment `CENTER`
        - **WifiPasswords** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - Note: The Wi-Fi task's N: the passwords to enter before the task is done (GDD §8, a decided lobby setting). Bounds and the default are the game's data.
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (160, 0) · text `lobby.setting.wifi_passwords`: en "Wi-Fi passwords" · uk "Паролі Wi-Fi" · autowrap_mode `AUTOWRAP_WORD_SMART`
            - **Stepper** `HBoxContainer` · variation `ToyRowTwelve` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (345, 0) · gaps from the variation: separation 12 · alignment `ALIGNMENT_END`
              - **Value** `Label` · variation `ToySettingRowValue` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (156, 0) · text from data (auto_translate_mode = DISABLED), sample: "3" · horizontal_alignment `CENTER`
                - Note: str(value) (auto_translate_mode DISABLED).
        - **Knives** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - Note: Open (weapons are deferred, m8 §7): a placeholder until the engineer decides which melee the MVP keeps.
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (160, 0) · text `lobby.setting.knives`: en "Knives" · uk "Ножі" · autowrap_mode `AUTOWRAP_WORD_SMART`
            - **Stepper** `HBoxContainer` · variation `ToyRowTwelve` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (345, 0) · gaps from the variation: separation 12 · alignment `ALIGNMENT_END`
              - **Value** `Label` · variation `ToySettingRowValue` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (156, 0) · text from data (auto_translate_mode = DISABLED), sample: "2" · horizontal_alignment `CENTER`
                - Note: str(value) (auto_translate_mode DISABLED).
      - **Side** `VBoxContainer` · variation `ToyColumnTwentyFour` · custom_minimum_size (420, 0) · gaps from the variation: separation 24
        - **CodeRow** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
          - Note: The room code, to whoever knows it: the host who hosted with a code and each player who joined with it (never an address), drawn as a keycap as on the lobby HUD (s4, the same row). Hidden for a Direct host and for Direct joiners (no code exists).
          - **Label** `Label` · variation `ToyTextMutedOnLight` · size flags vertical `SIZE_SHRINK_CENTER` · text `common.code`: en "Code" · uk "Код"
          - **Code** `PanelContainer` · variation `ToyKeyOnLight` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (42, 0) = Vector2(get_theme_constant("min_width", "ToyKeyOnLight"), 0)
            - **Text** `Label` · variation `ToyKeyText` · text from data (auto_translate_mode = DISABLED), sample: "K7Q2XR" · horizontal_alignment `CENTER`
              - Note: The room code (auto_translate_mode DISABLED).
          - **Copy** `Button` · variation `ToyButtonGhostOnLight` · size flags vertical `SIZE_SHRINK_CENTER` · text `esc.lobby.copy`: en "Copy" · uk "Копіювати"
            - Note: DisplayServer.clipboard_set(code); the text reads esc.lobby.copied for 1.5 s, then esc.lobby.copy again.
        - **Players** `VBoxContainer` · variation `ToyColumnTwelve` · size flags vertical `SIZE_EXPAND_FILL` · gaps from the variation: separation 12
          - **Count** `Label` · variation `ToyTextMutedOnLight` · text `lobby.player_count` with sample {count} = "4", {total} = "10": en "Players 4 / 10" · uk "Гравці 4 / 10"
          - **Scroll** `ScrollContainer` · variation `ToyScroll` · size flags vertical `SIZE_EXPAND_FILL` · the gap between the child and the bar from the variation: scrollbar_h_separation 8 · horizontal_scroll_mode `SCROLL_MODE_DISABLED` (vertical scrolling only); `get_v_scroll_bar().theme_type_variation = &"ToyScrollBar"`; the bar shows when the child is taller
            - Note: Takes the height left between the code row and Ready inside the fixed menu, so a full lobby of 10 never makes the menu taller: the rows scroll (lobby-host shows 10 players, lobby-guest 4). follow_focus = true.
            - **Rows** `VBoxContainer` · variation `ToyColumnTwelve` · size flags horizontal `SIZE_EXPAND_FILL` · gaps from the variation: separation 12
              - **Host** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
                - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
                  - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `lobby.host_mark` with sample {name} = "Olena" / "Олена": en "Olena · host" · uk "Олена · хост" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
                    - Note: One row per player in join order: the own row reads player.you, the host's row lobby.host_mark with the host's name, the others the name alone (auto_translate_mode DISABLED). In the host's own view the first row is the own one. A long name is cut with an ellipsis, so it never widens the menu.
                  - **Ready** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (36, 36) · texture `check` (dist/pack/icons/check.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToySettingRowText")
                    - Note: Shown while the player is ready; not ready leaves the slot empty (no dash). The marks are hidden in a round.
              - **Taras** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
                - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
                  - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Taras" / "Тарас" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
                  - **Ready** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (36, 36) · texture `check` (dist/pack/icons/check.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToySettingRowText")
              - **You** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
                - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
                  - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `player.you`: en "You" · uk "Ти" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
              - **Marko** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
                - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
                  - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Marko" / "Марко" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
        - **Ready** `Button` · variation `ToyButtonPrimary` · text `esc.lobby.ready`: en "Ready" · uk "Готовність" · toggle_mode true, button_pressed false
          - Note: Toggles the own ready state: while ready it is pressed (ToyButtonPrimary's pressed look) and shows the check icon (check.svg at 24 px, tinted by ToyButtonPrimary's icon colours) before its text, the same as the own row's mark (lobby-guest: this player is ready; the page does not draw the pressed look with its icon yet). Hidden in a round, where nobody gets ready.

## `lobby-no-code`: what differs from `ship`

- **Hidden:** `Menu/V/Page/Ship`.
- **Changed** `Menu/V/Strip/Tabs/Game`: text `esc.tab.game`: en "Game" · uk "Гра" · toggle_mode true, button_pressed false (was: text `esc.tab.find`: en "Find a lobby" · uk "Знайти лобі" · toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`))
- **Changed** `Menu/V/Page/TitleRow/Title`: text `esc.tab.lobby`: en "Lobby" · uk "Лобі" (was: text `esc.tab.find`: en "Find a lobby" · uk "Знайти лобі")
- **Shown:**
  - **Menu/V/Strip/Tabs/Lobby** `Button` · variation `ToyTab` · text `esc.tab.lobby`: en "Lobby" · uk "Лобі" · toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`) · shown with keyboard focus (grab_focus)
  - **Menu/V/Page/TitleRow/HostNote** `Label` · variation `ToyTextMutedOnLight` · size flags vertical `SIZE_SHRINK_CENTER` · text `esc.lobby.you_host`: en "You're the host: everyone sees your changes" · uk "Ти хост: зміни бачать усі"
  - **Menu/V/Page/Lobby** `VBoxContainer` · variation `ToyColumnTwentyFour` · size flags vertical `SIZE_EXPAND_FILL` · gaps from the variation: separation 24
    - **Presets** `HBoxContainer` · variation `ToyRowTwentyFour` · gaps from the variation: separation 24
      - Note: One ButtonGroup over the cards (Save is not in it). A card applies its values; any other change deselects every card (a player then reads preset.custom). Save your own stores one custom preset: a card named preset.custom, built like Standard, appears before Save. The four cards share the page width (expand_fill, at least 196 px: «Звичайний» at large text), as on the MVP sketch. What Standard and Quick set for the humans and the anger threshold is open (the engineer's design); whether No knives stays is open (weapons are deferred, m8 §7).
      - **Standard** `Button` · variation `ToyPresetCard` · size flags horizontal `SIZE_EXPAND_FILL` · custom_minimum_size (196, 96) · no text or icon: its child is its content, drawn in its StyleBox content rect (the child and every node inside ignore the mouse, so the Button takes the press); a Button's minimum size does not follow its children, so custom_minimum_size holds the content at large text · toggle_mode true, button_pressed true (ToyToggle draws `ToyPresetCardSelected`)
        - Note: The card has no text of its own: V holds the preset's name and its note (the preset's match duration); the note is ToyPresetCardNote on an idle card and ToyPresetCardNoteSelected on the selected one.
        - **V** `VBoxContainer` · variation `ToyColumnEight` · the Button's content: anchors `full_rect`, offsets 16, 16, -16, -16 (the `normal` StyleBox's content margins), mouse_filter `MOUSE_FILTER_IGNORE` on it and every node inside · gaps from the variation: separation 8 · alignment `ALIGNMENT_CENTER`
          - **Name** `Label` · variation `ToyPresetCardName` · text `preset.standard`: en "Standard" · uk "Звичайний" · horizontal_alignment `CENTER`
          - **Note** `Label` · variation `ToyPresetCardNoteSelected` · text `unit.minutes` with sample {count} = "10": en "10 min" · uk "10 хв" · horizontal_alignment `CENTER`
      - **Quick** `Button` · variation `ToyPresetCard` · size flags horizontal `SIZE_EXPAND_FILL` · custom_minimum_size (196, 96) · no text or icon: its child is its content, drawn in its StyleBox content rect (the child and every node inside ignore the mouse, so the Button takes the press); a Button's minimum size does not follow its children, so custom_minimum_size holds the content at large text · toggle_mode true, button_pressed false
        - **V** `VBoxContainer` · variation `ToyColumnEight` · the Button's content: anchors `full_rect`, offsets 16, 16, -16, -16 (the `normal` StyleBox's content margins), mouse_filter `MOUSE_FILTER_IGNORE` on it and every node inside · gaps from the variation: separation 8 · alignment `ALIGNMENT_CENTER`
          - **Name** `Label` · variation `ToyPresetCardName` · text `preset.quick`: en "Quick" · uk "Швидкий" · horizontal_alignment `CENTER`
          - **Note** `Label` · variation `ToyPresetCardNote` · text `unit.minutes` with sample {count} = "5": en "5 min" · uk "5 хв" · horizontal_alignment `CENTER`
      - **NoKnives** `Button` · variation `ToyPresetCard` · size flags horizontal `SIZE_EXPAND_FILL` · custom_minimum_size (196, 96) · no text or icon: its child is its content, drawn in its StyleBox content rect (the child and every node inside ignore the mouse, so the Button takes the press); a Button's minimum size does not follow its children, so custom_minimum_size holds the content at large text · toggle_mode true, button_pressed false
        - Note: Open (weapons are deferred, m8 §7): kept as a placeholder until the engineer decides which melee the MVP keeps.
        - **V** `VBoxContainer` · variation `ToyColumnEight` · the Button's content: anchors `full_rect`, offsets 16, 16, -16, -16 (the `normal` StyleBox's content margins), mouse_filter `MOUSE_FILTER_IGNORE` on it and every node inside · gaps from the variation: separation 8 · alignment `ALIGNMENT_CENTER`
          - **Name** `Label` · variation `ToyPresetCardName` · text `preset.no_knives`: en "No knives" · uk "Без ножів" · horizontal_alignment `CENTER`
          - **Note** `Label` · variation `ToyPresetCardNote` · text `unit.minutes` with sample {count} = "10": en "10 min" · uk "10 хв" · horizontal_alignment `CENTER`
      - **Save** `Button` · variation `ToyPresetCard` · size flags horizontal `SIZE_EXPAND_FILL` · custom_minimum_size (196, 96) · no text or icon: its child is its content, drawn in its StyleBox content rect (the child and every node inside ignore the mouse, so the Button takes the press); a Button's minimum size does not follow its children, so custom_minimum_size holds the content at large text
        - Note: A press button with the card's face (not a toggle, not in the ButtonGroup): saves the current values as the own preset. Its name wraps onto two lines where it is longer than the card.
        - **V** `VBoxContainer` · variation `ToyColumnEight` · the Button's content: anchors `full_rect`, offsets 16, 16, -16, -16 (the `normal` StyleBox's content margins), mouse_filter `MOUSE_FILTER_IGNORE` on it and every node inside · gaps from the variation: separation 8 · alignment `ALIGNMENT_CENTER`
          - **Name** `Label` · variation `ToyPresetCardName` · custom_minimum_size (160, 0) · text `preset.save_own`: en "Save your own" · uk "Зберегти свій" · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
    - **Body** `HBoxContainer` · variation `ToyRowThirtyTwo` · size flags vertical `SIZE_EXPAND_FILL` · gaps from the variation: separation 32
      - **SettingList** `VBoxContainer` · variation `ToyColumnTwelve` · size flags horizontal `SIZE_EXPAND_FILL` · gaps from the variation: separation 12
        - Note: The host's edits apply live for everyone. The rows of frame 7 of pages/mvp-screens: the humans, the anger threshold, the match length, the Wi-Fi passwords, after the lobby name; Packages and the task rows (Delivery, Switches) are gone with Delivery. Every row is at least 96 px tall (the field row's height), so the rows of a list keep one height; every control sits in a 345 px column at the right (the sketch's 230 x 1.5). Open (the engineer's design): the humans' default per player count, the anger threshold's choices, what else each MVP task sets (only the Wi-Fi's N is decided), and Knives (weapons are deferred).
        - **Name** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (160, 0) · text `lobby.setting.name`: en "Lobby name" · uk "Назва лобі" · autowrap_mode `AUTOWRAP_WORD_SMART`
            - **Field** `LineEdit` · variation `ToyField` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (345, 0) · text (sample data) "Olena's lobby" / "Лобі: Олена" · context_menu_enabled false (Godot's right-click menu would show untranslated English labels; see the notes)
              - Note: The lobby name (#214), lobby.default_name until the host changes it; auto_translate_mode DISABLED. editable false for a player (the quiet read-only box), who cannot scroll it: 345 px (the control column of the MVP sketch) holds about 16 characters at large text; a longer name shows its start. max_length per #214, which has not set it yet.
        - **Humans** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - Note: The exact number of humans among the players (m8 §2, #1032), as lobby.setting.humans_of: {count} of {total}, where {total} is the players now in the lobby (the stepper's maximum). Bounds and the default per player count are open (research round 2 suggests 4→1 … 10→3).
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (160, 0) · text `lobby.setting.humans`: en "Humans" · uk "Люди" · autowrap_mode `AUTOWRAP_WORD_SMART`
            - **Stepper** `HBoxContainer` · variation `ToyRowTwelve` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (345, 0) · gaps from the variation: separation 12 · alignment `ALIGNMENT_END`
              - **Less** `Button` · variation `ToyStepper` · custom_minimum_size (51, 51) = Vector2(get_theme_constant("width", "ToyStepper"), get_theme_constant("height", "ToyStepper")) · icon `minus` (dist/pack/icons/minus.svg, own work) at 24 px, tinted by `ToyStepper`'s icon_*_color
              - **Value** `Label` · variation `ToySettingRowValue` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (156, 0) · text `lobby.setting.humans_of` with sample {count} = "3", {total} = "10": en "3 of 10" · uk "3 з 10" · horizontal_alignment `CENTER`
                - Note: {count} the humans set; {total} the players now in the lobby, which is also the stepper's maximum, so it follows joins and leaves: 3 of 10 in the full lobby, 1 of 4 in the guest's lobby of 4.
              - **More** `Button` · variation `ToyStepper` · custom_minimum_size (51, 51) = Vector2(get_theme_constant("width", "ToyStepper"), get_theme_constant("height", "ToyStepper")) · icon `plus` (dist/pack/icons/plus.svg, own work) at 24 px, tinted by `ToyStepper`'s icon_*_color
        - **Anger** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - Note: The neighbours' anger threshold that calls the cops (m8 §5). Its choices are open (the engineer's design); 50 and 100 are the sketch's samples.
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (160, 0) · text `lobby.setting.anger`: en "Anger threshold" · uk "Поріг гніву" · autowrap_mode `AUTOWRAP_WORD_SMART`
            - **Choice** `HBoxContainer` · variation `ToyRowTwelve` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (345, 0) · gaps from the variation: separation 12 · alignment `ALIGNMENT_END`
              - Note: One ButtonGroup, one toggle chip per threshold; each label is the number (data, auto_translate_mode DISABLED).
              - **Fifty** `Button` · variation `ToyChipToggleOnLight` · text from data (auto_translate_mode = DISABLED), sample: "50" · toggle_mode true, button_pressed false
              - **Hundred** `Button` · variation `ToyChipToggleOnLight` · text from data (auto_translate_mode = DISABLED), sample: "100" · toggle_mode true, button_pressed true (ToyToggle draws `ToyChipToggleOnLightSelected`)
        - **Duration** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (160, 0) · text `lobby.setting.duration`: en "Match duration" · uk "Тривалість матчу" · autowrap_mode `AUTOWRAP_WORD_SMART`
            - **Stepper** `HBoxContainer` · variation `ToyRowTwelve` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (345, 0) · gaps from the variation: separation 12 · alignment `ALIGNMENT_END`
              - **Less** `Button` · variation `ToyStepper` · custom_minimum_size (51, 51) = Vector2(get_theme_constant("width", "ToyStepper"), get_theme_constant("height", "ToyStepper")) · icon `minus` (dist/pack/icons/minus.svg, own work) at 24 px, tinted by `ToyStepper`'s icon_*_color
                - Note: Steps the value down; disabled (unplugged) at the lower bound. Keyboard and gamepad reach Less and More by focus (ui_left and ui_right move between them) and step with ui_accept. When a step reaches a bound, the other arrow takes focus (More.grab_focus()) before this one is disabled, so focus never rests on an unplugged arrow. The value is 156 px wide, so every stepper has one width and the arrows line up down the list. Every stepper below works the same; a player sees only the value.
              - **Value** `Label` · variation `ToySettingRowValue` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (156, 0) · text `unit.minutes` with sample {count} = "10": en "10 min" · uk "10 хв" · horizontal_alignment `CENTER`
              - **More** `Button` · variation `ToyStepper` · custom_minimum_size (51, 51) = Vector2(get_theme_constant("width", "ToyStepper"), get_theme_constant("height", "ToyStepper")) · icon `plus` (dist/pack/icons/plus.svg, own work) at 24 px, tinted by `ToyStepper`'s icon_*_color
                - Note: Steps the value up; disabled (unplugged) at the upper bound.
        - **WifiPasswords** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - Note: The Wi-Fi task's N: the passwords to enter before the task is done (GDD §8, a decided lobby setting). Bounds and the default are the game's data.
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (160, 0) · text `lobby.setting.wifi_passwords`: en "Wi-Fi passwords" · uk "Паролі Wi-Fi" · autowrap_mode `AUTOWRAP_WORD_SMART`
            - **Stepper** `HBoxContainer` · variation `ToyRowTwelve` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (345, 0) · gaps from the variation: separation 12 · alignment `ALIGNMENT_END`
              - **Less** `Button` · variation `ToyStepper` · custom_minimum_size (51, 51) = Vector2(get_theme_constant("width", "ToyStepper"), get_theme_constant("height", "ToyStepper")) · icon `minus` (dist/pack/icons/minus.svg, own work) at 24 px, tinted by `ToyStepper`'s icon_*_color
              - **Value** `Label` · variation `ToySettingRowValue` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (156, 0) · text from data (auto_translate_mode = DISABLED), sample: "3" · horizontal_alignment `CENTER`
                - Note: str(value) (auto_translate_mode DISABLED).
              - **More** `Button` · variation `ToyStepper` · custom_minimum_size (51, 51) = Vector2(get_theme_constant("width", "ToyStepper"), get_theme_constant("height", "ToyStepper")) · icon `plus` (dist/pack/icons/plus.svg, own work) at 24 px, tinted by `ToyStepper`'s icon_*_color
        - **Knives** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - Note: Open (weapons are deferred, m8 §7): a placeholder until the engineer decides which melee the MVP keeps.
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (160, 0) · text `lobby.setting.knives`: en "Knives" · uk "Ножі" · autowrap_mode `AUTOWRAP_WORD_SMART`
            - **Stepper** `HBoxContainer` · variation `ToyRowTwelve` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (345, 0) · gaps from the variation: separation 12 · alignment `ALIGNMENT_END`
              - **Less** `Button` · variation `ToyStepper` · custom_minimum_size (51, 51) = Vector2(get_theme_constant("width", "ToyStepper"), get_theme_constant("height", "ToyStepper")) · icon `minus` (dist/pack/icons/minus.svg, own work) at 24 px, tinted by `ToyStepper`'s icon_*_color
              - **Value** `Label` · variation `ToySettingRowValue` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (156, 0) · text from data (auto_translate_mode = DISABLED), sample: "2" · horizontal_alignment `CENTER`
                - Note: str(value) (auto_translate_mode DISABLED).
              - **More** `Button` · variation `ToyStepper` · custom_minimum_size (51, 51) = Vector2(get_theme_constant("width", "ToyStepper"), get_theme_constant("height", "ToyStepper")) · icon `plus` (dist/pack/icons/plus.svg, own work) at 24 px, tinted by `ToyStepper`'s icon_*_color
      - **Side** `VBoxContainer` · variation `ToyColumnTwentyFour` · custom_minimum_size (420, 0) · gaps from the variation: separation 24
        - **CodeGone** `Label` · variation `ToyTextMutedOnLight` · custom_minimum_size (420, 0) · text `esc.lobby.code_gone`: en "The code service isn't answering. To let more players in, host directly." · uk "Сервіс кодів не відповідає. Щоб прийняти ще гравців, створи гру напряму." · autowrap_mode `AUTOWRAP_WORD_SMART`
          - Note: In place of CodeRow, only for a host who hosted with a code, when the code service closed or was never reachable; a Direct host sees neither.
        - **Players** `VBoxContainer` · variation `ToyColumnTwelve` · size flags vertical `SIZE_EXPAND_FILL` · gaps from the variation: separation 12
          - **Count** `Label` · variation `ToyTextMutedOnLight` · text `lobby.player_count` with sample {count} = "10", {total} = "10": en "Players 10 / 10" · uk "Гравці 10 / 10"
          - **Scroll** `ScrollContainer` · variation `ToyScroll` · size flags vertical `SIZE_EXPAND_FILL` · the gap between the child and the bar from the variation: scrollbar_h_separation 8 · horizontal_scroll_mode `SCROLL_MODE_DISABLED` (vertical scrolling only); `get_v_scroll_bar().theme_type_variation = &"ToyScrollBar"`; the bar shows when the child is taller
            - Note: Takes the height left between the code row and Ready inside the fixed menu, so a full lobby of 10 never makes the menu taller: the rows scroll (lobby-host shows 10 players, lobby-guest 4). follow_focus = true.
            - **Rows** `VBoxContainer` · variation `ToyColumnTwelve` · size flags horizontal `SIZE_EXPAND_FILL` · gaps from the variation: separation 12
              - **Host** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
                - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
                  - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `player.you`: en "You" · uk "Ти" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
                    - Note: One row per player in join order: the own row reads player.you, the host's row lobby.host_mark with the host's name, the others the name alone (auto_translate_mode DISABLED). In the host's own view the first row is the own one. A long name is cut with an ellipsis, so it never widens the menu.
              - **Taras** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
                - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
                  - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Taras" / "Тарас" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
                  - **Ready** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (36, 36) · texture `check` (dist/pack/icons/check.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToySettingRowText")
              - **Ivan** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
                - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
                  - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Ivan" / "Іван" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
                  - **Ready** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (36, 36) · texture `check` (dist/pack/icons/check.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToySettingRowText")
              - **Marko** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
                - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
                  - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Marko" / "Марко" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
                  - **Ready** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (36, 36) · texture `check` (dist/pack/icons/check.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToySettingRowText")
              - **Oksana** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
                - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
                  - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Oksana" / "Оксана" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
                  - **Ready** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (36, 36) · texture `check` (dist/pack/icons/check.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToySettingRowText")
              - **Solomiia** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
                - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
                  - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Solomiia" / "Соломія" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
              - **Bohdan** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
                - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
                  - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Bohdan" / "Богдан" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
                  - **Ready** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (36, 36) · texture `check` (dist/pack/icons/check.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToySettingRowText")
              - **Iryna** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
                - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
                  - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Iryna" / "Ірина" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
              - **Dmytro** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
                - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
                  - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Dmytro" / "Дмитро" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
                  - **Ready** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (36, 36) · texture `check` (dist/pack/icons/check.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToySettingRowText")
              - **Lesia** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
                - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
                  - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Lesia" / "Леся" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
        - **Ready** `Button` · variation `ToyButtonPrimary` · text `esc.lobby.ready`: en "Ready" · uk "Готовність" · toggle_mode true, button_pressed false
          - Note: Toggles the own ready state: while ready it is pressed (ToyButtonPrimary's pressed look) and shows the check icon (check.svg at 24 px, tinted by ToyButtonPrimary's icon colours) before its text, the same as the own row's mark (lobby-guest: this player is ready; the page does not draw the pressed look with its icon yet). Hidden in a round, where nobody gets ready.

## `character`: what differs from `ship`

- **Hidden:** `Menu/V/Page/Ship`.
- **Changed** `Menu/V/Strip/Tabs/Game`: text `esc.tab.game`: en "Game" · uk "Гра" · toggle_mode true, button_pressed false (was: text `esc.tab.find`: en "Find a lobby" · uk "Знайти лобі" · toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`))
- **Changed** `Menu/V/Strip/Tabs/Character`: toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`) · shown with keyboard focus (grab_focus) (was: toggle_mode true, button_pressed false)
- **Changed** `Menu/V/Page/TitleRow/Title`: text `esc.tab.character`: en "Character" · uk "Персонаж" (was: text `esc.tab.find`: en "Find a lobby" · uk "Знайти лобі")
- **Shown:**
  - **Menu/V/Strip/Tabs/Lobby** `Button` · variation `ToyTab` · text `esc.tab.lobby`: en "Lobby" · uk "Лобі" · toggle_mode true, button_pressed false
  - **Menu/V/Page/Character** `VBoxContainer` · variation `ToyColumnTwentyFour` · gaps from the variation: separation 24
    - **Body** `HBoxContainer` · variation `ToyRowThirtyTwo` · gaps from the variation: separation 32
      - **Preview** `PanelContainer` · variation `ToyHowtoFrame` · custom_minimum_size (456, 608)
        - Note: In the game: SubViewportContainer (stretch true) · min 456×608 with a SubViewport showing the own character; the page draws a ToyHowtoFrame placeholder.
      - **Form** `VBoxContainer` · variation `ToyColumnTwelve` · size flags horizontal `SIZE_EXPAND_FILL` · gaps from the variation: separation 12
        - Note: Changes apply live in the lobby. The Hat row (esc.character.hat) stays hidden until hats exist.
        - **NameRow** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `player.name`: en "Name" · uk "Імʼя"
            - **Field** `LineEdit` · variation `ToyField` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (450, 0) · text (sample data) "Olena" / "Олена" · context_menu_enabled false (Godot's right-click menu would show untranslated English labels; see the notes)
              - Note: The player's name, kept between sessions; auto_translate_mode DISABLED. editable false in a round.
        - **ColourRow** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `esc.character.colour`: en "Colour" · uk "Колір"
            - **Swatches** `GridContainer` · variation `ToyGridSwatch` · size flags vertical `SIZE_SHRINK_CENTER` · gaps from the variation: h_separation 12, v_separation 12 · columns 5
              - Note: The ten body colours (#255; the palette is not decided yet).
              - **Swatch1** `Control` · custom_minimum_size (60, 60)
                - Note: In the game: TextureButton · toggle_mode · one ButtonGroup · 60×60 (focus_mode ALL in the lobby, NONE in a round; mouse_filter IGNORE in a round). The disc is tinted with the body colour (content data, #255; the page's colours are samples only).
                - **Disc** `TextureRect` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (60, 60) · texture `swatch-disc` (dist/pack/icons/swatch-disc.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate from data (a content colour, not a theme colour), sample #ff8466
                  - Note: self_modulate = the body colour (content data).
                - **Ring** `Panel` · variation `ToySwatchRing` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (60, 60) = Vector2(get_theme_constant("width", "ToySwatchRing"), get_theme_constant("height", "ToySwatchRing"))
                  - Note: mouse_filter IGNORE.
                - **Sel** `Panel` · variation `ToySwatchSelected` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both
                  - Note: mouse_filter IGNORE; visible while the swatch is selected.
              - **Swatch2** `Control` · custom_minimum_size (60, 60)
                - **Disc** `TextureRect` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (60, 60) · texture `swatch-disc` (dist/pack/icons/swatch-disc.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate from data (a content colour, not a theme colour), sample #ffc23a
                - **Ring** `Panel` · variation `ToySwatchRing` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (60, 60) = Vector2(get_theme_constant("width", "ToySwatchRing"), get_theme_constant("height", "ToySwatchRing"))
              - **Swatch3** `Control` · custom_minimum_size (60, 60)
                - **Disc** `TextureRect` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (60, 60) · texture `swatch-disc` (dist/pack/icons/swatch-disc.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate from data (a content colour, not a theme colour), sample #3cc4a8
                - **Ring** `Panel` · variation `ToySwatchRing` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (60, 60) = Vector2(get_theme_constant("width", "ToySwatchRing"), get_theme_constant("height", "ToySwatchRing"))
                - **Focus** `Panel` · variation `ToySwatchFocus` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both
                  - Note: mouse_filter IGNORE; visible while the swatch has keyboard or gamepad focus (drawn here on the third swatch).
              - **Swatch4** `Control` · custom_minimum_size (60, 60)
                - **Disc** `TextureRect` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (60, 60) · texture `swatch-disc` (dist/pack/icons/swatch-disc.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate from data (a content colour, not a theme colour), sample #5bcb4e
                - **Ring** `Panel` · variation `ToySwatchRing` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (60, 60) = Vector2(get_theme_constant("width", "ToySwatchRing"), get_theme_constant("height", "ToySwatchRing"))
              - **Swatch5** `Control` · custom_minimum_size (60, 60)
                - **Disc** `TextureRect` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (60, 60) · texture `swatch-disc` (dist/pack/icons/swatch-disc.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate from data (a content colour, not a theme colour), sample #d9482f
                - **Ring** `Panel` · variation `ToySwatchRing` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (60, 60) = Vector2(get_theme_constant("width", "ToySwatchRing"), get_theme_constant("height", "ToySwatchRing"))
              - **Swatch6** `Control` · custom_minimum_size (60, 60)
                - **Disc** `TextureRect` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (60, 60) · texture `swatch-disc` (dist/pack/icons/swatch-disc.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate from data (a content colour, not a theme colour), sample #c98a10
                - **Ring** `Panel` · variation `ToySwatchRing` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (60, 60) = Vector2(get_theme_constant("width", "ToySwatchRing"), get_theme_constant("height", "ToySwatchRing"))
              - **Swatch7** `Control` · custom_minimum_size (60, 60)
                - **Disc** `TextureRect` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (60, 60) · texture `swatch-disc` (dist/pack/icons/swatch-disc.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate from data (a content colour, not a theme colour), sample #b9a8c7
                - **Ring** `Panel` · variation `ToySwatchRing` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (60, 60) = Vector2(get_theme_constant("width", "ToySwatchRing"), get_theme_constant("height", "ToySwatchRing"))
              - **Swatch8** `Control` · custom_minimum_size (60, 60)
                - **Disc** `TextureRect` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (60, 60) · texture `swatch-disc` (dist/pack/icons/swatch-disc.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate from data (a content colour, not a theme colour), sample #64566f
                - **Ring** `Panel` · variation `ToySwatchRing` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (60, 60) = Vector2(get_theme_constant("width", "ToySwatchRing"), get_theme_constant("height", "ToySwatchRing"))
              - **Swatch9** `Control` · custom_minimum_size (60, 60)
                - **Disc** `TextureRect` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (60, 60) · texture `swatch-disc` (dist/pack/icons/swatch-disc.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate from data (a content colour, not a theme colour), sample #4a3c5c
                - **Ring** `Panel` · variation `ToySwatchRing` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (60, 60) = Vector2(get_theme_constant("width", "ToySwatchRing"), get_theme_constant("height", "ToySwatchRing"))
              - **Swatch10** `Control` · custom_minimum_size (60, 60)
                - **Disc** `TextureRect` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (60, 60) · texture `swatch-disc` (dist/pack/icons/swatch-disc.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate from data (a content colour, not a theme colour), sample #fff4e2
                - **Ring** `Panel` · variation `ToySwatchRing` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (60, 60) = Vector2(get_theme_constant("width", "ToySwatchRing"), get_theme_constant("height", "ToySwatchRing"))

## `character-round`: what differs from `ship`

- **Hidden:** `Menu/V/Page/Ship`.
- **Changed** `Menu/V/Strip/Tabs/Game`: text `esc.tab.game`: en "Game" · uk "Гра" · toggle_mode true, button_pressed false (was: text `esc.tab.find`: en "Find a lobby" · uk "Знайти лобі" · toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`))
- **Changed** `Menu/V/Strip/Tabs/Character`: toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`) · shown with keyboard focus (grab_focus) (was: toggle_mode true, button_pressed false)
- **Changed** `Menu/V/Page/TitleRow/Title`: text `esc.tab.character`: en "Character" · uk "Персонаж" (was: text `esc.tab.find`: en "Find a lobby" · uk "Знайти лобі")
- **Shown:**
  - **Menu/V/Strip/Tabs/Role** `Button` · variation `ToyTab` · text `esc.tab.role`: en "Role" · uk "Роль" · toggle_mode true, button_pressed false
  - **Menu/V/Strip/Tabs/Lobby** `Button` · variation `ToyTab` · text `esc.tab.lobby`: en "Lobby" · uk "Лобі" · toggle_mode true, button_pressed false
  - **Menu/V/Page/TitleRow/Locked** `HBoxContainer` · variation `ToyRowTwelve` · size flags vertical `SIZE_SHRINK_CENTER` · gaps from the variation: separation 12
    - Note: In a round the Character tab is locked: the same lock line as the guest's HostOnly, in the title row, so the page below does not move.
    - **Lock** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (30, 30) · texture `lock` (dist/pack/icons/lock.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToyTextMutedOnLight")
    - **Text** `Label` · variation `ToyTextMutedOnLight` · text `esc.character.locked`: en "You can change this only in the lobby" · uk "Змінювати можна лише в лобі"
  - **Menu/V/Page/Character** `VBoxContainer` · variation `ToyColumnTwentyFour` · gaps from the variation: separation 24
    - **Body** `HBoxContainer` · variation `ToyRowThirtyTwo` · gaps from the variation: separation 32
      - **Preview** `PanelContainer` · variation `ToyHowtoFrame` · custom_minimum_size (456, 608)
        - Note: In the game: SubViewportContainer (stretch true) · min 456×608 with a SubViewport showing the own character; the page draws a ToyHowtoFrame placeholder.
      - **Form** `VBoxContainer` · variation `ToyColumnTwelve` · size flags horizontal `SIZE_EXPAND_FILL` · gaps from the variation: separation 12
        - Note: Changes apply live in the lobby. The Hat row (esc.character.hat) stays hidden until hats exist.
        - **NameRow** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `player.name`: en "Name" · uk "Імʼя"
            - **Field** `LineEdit` · variation `ToyField` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (450, 0) · text (sample data) "Olena" / "Олена" · editable false · context_menu_enabled false (Godot's right-click menu would show untranslated English labels; see the notes)
              - Note: The player's name, kept between sessions; auto_translate_mode DISABLED. editable false in a round.
        - **ColourRow** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `esc.character.colour`: en "Colour" · uk "Колір"
            - **Swatches** `GridContainer` · variation `ToyGridSwatch` · size flags vertical `SIZE_SHRINK_CENTER` · gaps from the variation: h_separation 12, v_separation 12 · columns 5
              - Note: The ten body colours (#255; the palette is not decided yet).
              - **Swatch1** `Control` · custom_minimum_size (60, 60)
                - Note: In the game: TextureButton · toggle_mode · one ButtonGroup · 60×60 (focus_mode ALL in the lobby, NONE in a round; mouse_filter IGNORE in a round). The disc is tinted with the body colour (content data, #255; the page's colours are samples only).
                - **Disc** `TextureRect` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (60, 60) · texture `swatch-disc` (dist/pack/icons/swatch-disc.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate from data (a content colour, not a theme colour), sample #ff8466
                  - Note: self_modulate = the body colour (content data).
                - **Ring** `Panel` · variation `ToySwatchRing` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (60, 60) = Vector2(get_theme_constant("width", "ToySwatchRing"), get_theme_constant("height", "ToySwatchRing"))
                  - Note: mouse_filter IGNORE.
                - **Sel** `Panel` · variation `ToySwatchSelected` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both
                  - Note: mouse_filter IGNORE; visible while the swatch is selected.
              - **Swatch2** `Control` · custom_minimum_size (60, 60)
                - **Disc** `TextureRect` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (60, 60) · texture `swatch-disc` (dist/pack/icons/swatch-disc.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate from data (a content colour, not a theme colour), sample #ffc23a
                - **Ring** `Panel` · variation `ToySwatchRing` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (60, 60) = Vector2(get_theme_constant("width", "ToySwatchRing"), get_theme_constant("height", "ToySwatchRing"))
              - **Swatch3** `Control` · custom_minimum_size (60, 60)
                - **Disc** `TextureRect` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (60, 60) · texture `swatch-disc` (dist/pack/icons/swatch-disc.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate from data (a content colour, not a theme colour), sample #3cc4a8
                - **Ring** `Panel` · variation `ToySwatchRing` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (60, 60) = Vector2(get_theme_constant("width", "ToySwatchRing"), get_theme_constant("height", "ToySwatchRing"))
                - **Focus** `Panel` · variation `ToySwatchFocus` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both
                  - Note: mouse_filter IGNORE; visible while the swatch has keyboard or gamepad focus (drawn here on the third swatch).
              - **Swatch4** `Control` · custom_minimum_size (60, 60)
                - **Disc** `TextureRect` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (60, 60) · texture `swatch-disc` (dist/pack/icons/swatch-disc.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate from data (a content colour, not a theme colour), sample #5bcb4e
                - **Ring** `Panel` · variation `ToySwatchRing` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (60, 60) = Vector2(get_theme_constant("width", "ToySwatchRing"), get_theme_constant("height", "ToySwatchRing"))
              - **Swatch5** `Control` · custom_minimum_size (60, 60)
                - **Disc** `TextureRect` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (60, 60) · texture `swatch-disc` (dist/pack/icons/swatch-disc.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate from data (a content colour, not a theme colour), sample #d9482f
                - **Ring** `Panel` · variation `ToySwatchRing` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (60, 60) = Vector2(get_theme_constant("width", "ToySwatchRing"), get_theme_constant("height", "ToySwatchRing"))
              - **Swatch6** `Control` · custom_minimum_size (60, 60)
                - **Disc** `TextureRect` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (60, 60) · texture `swatch-disc` (dist/pack/icons/swatch-disc.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate from data (a content colour, not a theme colour), sample #c98a10
                - **Ring** `Panel` · variation `ToySwatchRing` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (60, 60) = Vector2(get_theme_constant("width", "ToySwatchRing"), get_theme_constant("height", "ToySwatchRing"))
              - **Swatch7** `Control` · custom_minimum_size (60, 60)
                - **Disc** `TextureRect` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (60, 60) · texture `swatch-disc` (dist/pack/icons/swatch-disc.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate from data (a content colour, not a theme colour), sample #b9a8c7
                - **Ring** `Panel` · variation `ToySwatchRing` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (60, 60) = Vector2(get_theme_constant("width", "ToySwatchRing"), get_theme_constant("height", "ToySwatchRing"))
              - **Swatch8** `Control` · custom_minimum_size (60, 60)
                - **Disc** `TextureRect` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (60, 60) · texture `swatch-disc` (dist/pack/icons/swatch-disc.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate from data (a content colour, not a theme colour), sample #64566f
                - **Ring** `Panel` · variation `ToySwatchRing` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (60, 60) = Vector2(get_theme_constant("width", "ToySwatchRing"), get_theme_constant("height", "ToySwatchRing"))
              - **Swatch9** `Control` · custom_minimum_size (60, 60)
                - **Disc** `TextureRect` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (60, 60) · texture `swatch-disc` (dist/pack/icons/swatch-disc.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate from data (a content colour, not a theme colour), sample #4a3c5c
                - **Ring** `Panel` · variation `ToySwatchRing` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (60, 60) = Vector2(get_theme_constant("width", "ToySwatchRing"), get_theme_constant("height", "ToySwatchRing"))
              - **Swatch10** `Control` · custom_minimum_size (60, 60)
                - **Disc** `TextureRect` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (60, 60) · texture `swatch-disc` (dist/pack/icons/swatch-disc.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate from data (a content colour, not a theme colour), sample #fff4e2
                - **Ring** `Panel` · variation `ToySwatchRing` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (60, 60) = Vector2(get_theme_constant("width", "ToySwatchRing"), get_theme_constant("height", "ToySwatchRing"))

## `game-host`: what differs from `ship`

- **Hidden:** `Menu/V/Page/Ship`.
- **Changed** `Menu/V/Strip/Tabs/Game`: text `esc.tab.game`: en "Game" · uk "Гра" (was: text `esc.tab.find`: en "Find a lobby" · uk "Знайти лобі")
- **Changed** `Menu/V/Page/TitleRow/Title`: text `esc.tab.game`: en "Game" · uk "Гра" (was: text `esc.tab.find`: en "Find a lobby" · uk "Знайти лобі")
- **Shown:**
  - **Menu/V/Strip/Tabs/Role** `Button` · variation `ToyTab` · text `esc.tab.role`: en "Role" · uk "Роль" · toggle_mode true, button_pressed false
  - **Menu/V/Strip/Tabs/Lobby** `Button` · variation `ToyTab` · text `esc.tab.lobby`: en "Lobby" · uk "Лобі" · toggle_mode true, button_pressed false
  - **Menu/V/Page/Actions** `VBoxContainer` · variation `ToyColumnTwentyFour` · size flags horizontal `SIZE_SHRINK_BEGIN` · custom_minimum_size (760, 0) · gaps from the variation: separation 24
    - **Resume** `Button` · variation `ToyButtonPrimary` · text `esc.game.resume`: en "Resume" · uk "Продовжити" · shown with keyboard focus (grab_focus)
      - Note: Closes the menu (as Esc). Takes focus when the menu opens on Game.
    - **Leave** `Button` · variation `ToyButtonDanger` · text `esc.game.leave`: en "Leave the session" · uk "Покинути сесію"
      - Note: The host: the danger colour (ToyButtonDanger), opens the confirm dialog. A player: ToyButtonSecondary, leaves at once. In the tutorial: ToyButtonSecondary esc.game.leave_tutorial, back to the ship. Leaving a session returns the player to the ship (s5 ship).
    - **Quit** `Button` · variation `ToyButtonGhostOnLight` · text `esc.game.quit`: en "Quit the game" · uk "Вийти з гри"
      - Note: The host: opens the confirm dialog (esc.game.quit_confirm, Confirm esc.game.quit). A player, and in the tutorial: quits at once.

## `game-guest`: what differs from `ship`

- **Hidden:** `Menu/V/Page/Ship`.
- **Changed** `Menu/V/Strip/Tabs/Game`: text `esc.tab.game`: en "Game" · uk "Гра" (was: text `esc.tab.find`: en "Find a lobby" · uk "Знайти лобі")
- **Changed** `Menu/V/Page/TitleRow/Title`: text `esc.tab.game`: en "Game" · uk "Гра" (was: text `esc.tab.find`: en "Find a lobby" · uk "Знайти лобі")
- **Shown:**
  - **Menu/V/Strip/Tabs/Role** `Button` · variation `ToyTab` · text `esc.tab.role`: en "Role" · uk "Роль" · toggle_mode true, button_pressed false
  - **Menu/V/Strip/Tabs/Lobby** `Button` · variation `ToyTab` · text `esc.tab.lobby`: en "Lobby" · uk "Лобі" · toggle_mode true, button_pressed false
  - **Menu/V/Page/Actions** `VBoxContainer` · variation `ToyColumnTwentyFour` · size flags horizontal `SIZE_SHRINK_BEGIN` · custom_minimum_size (760, 0) · gaps from the variation: separation 24
    - **Resume** `Button` · variation `ToyButtonPrimary` · text `esc.game.resume`: en "Resume" · uk "Продовжити" · shown with keyboard focus (grab_focus)
      - Note: Closes the menu (as Esc). Takes focus when the menu opens on Game.
    - **Leave** `Button` · variation `ToyButtonSecondary` · text `esc.game.leave`: en "Leave the session" · uk "Покинути сесію"
      - Note: The host: the danger colour (ToyButtonDanger), opens the confirm dialog. A player: ToyButtonSecondary, leaves at once. In the tutorial: ToyButtonSecondary esc.game.leave_tutorial, back to the ship. Leaving a session returns the player to the ship (s5 ship).
    - **Quit** `Button` · variation `ToyButtonGhostOnLight` · text `esc.game.quit`: en "Quit the game" · uk "Вийти з гри"
      - Note: The host: opens the confirm dialog (esc.game.quit_confirm, Confirm esc.game.quit). A player, and in the tutorial: quits at once.

## `game-confirm`: what differs from `ship`

- **Hidden:** `Menu/V/Page/Ship`.
- **Changed** `Menu/V/Strip/Tabs/Game`: text `esc.tab.game`: en "Game" · uk "Гра" (was: text `esc.tab.find`: en "Find a lobby" · uk "Знайти лобі")
- **Changed** `Menu/V/Page/TitleRow/Title`: text `esc.tab.game`: en "Game" · uk "Гра" (was: text `esc.tab.find`: en "Find a lobby" · uk "Знайти лобі")
- **Shown:**
  - **Menu/V/Strip/Tabs/Role** `Button` · variation `ToyTab` · text `esc.tab.role`: en "Role" · uk "Роль" · toggle_mode true, button_pressed false
  - **Menu/V/Strip/Tabs/Lobby** `Button` · variation `ToyTab` · text `esc.tab.lobby`: en "Lobby" · uk "Лобі" · toggle_mode true, button_pressed false
  - **Menu/V/Page/Actions** `VBoxContainer` · variation `ToyColumnTwentyFour` · size flags horizontal `SIZE_SHRINK_BEGIN` · custom_minimum_size (760, 0) · gaps from the variation: separation 24
    - **Resume** `Button` · variation `ToyButtonPrimary` · text `esc.game.resume`: en "Resume" · uk "Продовжити"
      - Note: Closes the menu (as Esc). Takes focus when the menu opens on Game.
    - **Leave** `Button` · variation `ToyButtonDanger` · text `esc.game.leave`: en "Leave the session" · uk "Покинути сесію"
      - Note: The host: the danger colour (ToyButtonDanger), opens the confirm dialog. A player: ToyButtonSecondary, leaves at once. In the tutorial: ToyButtonSecondary esc.game.leave_tutorial, back to the ship. Leaving a session returns the player to the ship (s5 ship).
    - **Quit** `Button` · variation `ToyButtonGhostOnLight` · text `esc.game.quit`: en "Quit the game" · uk "Вийти з гри"
      - Note: The host: opens the confirm dialog (esc.game.quit_confirm, Confirm esc.game.quit). A player, and in the tutorial: quits at once.
  - **ConfirmDim** `Panel` · variation `ToyBackdrop` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both
    - Note: mouse_filter STOP: blocks the mouse to the menu behind while the dialog is open. Keyboard and gamepad focus search ignores what is drawn on top, so while the dialog is open set focus_behavior_recursive = FOCUS_BEHAVIOR_DISABLED on Menu (Control, Godot 4.5+) and restore FOCUS_BEHAVIOR_INHERITED on close. The dialog handles ui_cancel itself (= Cancel) and calls get_viewport().set_input_as_handled(), so Esc closes only the dialog, not the menu too.
  - **Confirm** `PanelContainer` · variation `ToyPanelDialog` · anchors `center`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (1080, 0)
    - Note: P1. Opened by the host's Leave (esc.game.leave_confirm, Confirm esc.game.leave) or Quit (esc.game.quit_confirm, Confirm esc.game.quit). ui_cancel = Cancel.
    - **V** `VBoxContainer` · variation `ToyColumnThirtyTwo` · gaps from the variation: separation 32
      - **Text** `VBoxContainer` · variation `ToyColumnSixteen` · gaps from the variation: separation 16
        - **Title** `Label` · variation `ToyTitleOnLight` · custom_minimum_size (900, 0) · text `esc.game.leave_confirm`: en "Leave the session?" · uk "Покинути сесію?" · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
        - **Body** `Label` · variation `ToyTextMutedOnLight` · custom_minimum_size (900, 0) · text `esc.game.leave_host_note`: en "You host this session: leaving ends it for every player." · uk "Ти хост: якщо вийдеш, сесія закінчиться для всіх." · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
      - **Buttons** `HBoxContainer` · variation `ToyRowTwentyFour` · gaps from the variation: separation 24 · alignment `ALIGNMENT_CENTER`
        - **ConfirmButton** `Button` · variation `ToyButtonDanger` · text `esc.game.leave`: en "Leave the session" · uk "Покинути сесію"
          - Note: Ends the session for every player; everyone returns to their own ship (Quit: quits the game).
        - **Cancel** `Button` · variation `ToyButtonGhostOnLight` · text `common.cancel`: en "Cancel" · uk "Скасувати" · shown with keyboard focus (grab_focus)
          - Note: Focus on open; closes the dialog.

## `role-alien`: what differs from `ship`

- **Hidden:** `Menu/V/Page/Ship`.
- **Changed** `Menu/V/Strip/Tabs/Game`: text `esc.tab.game`: en "Game" · uk "Гра" · toggle_mode true, button_pressed false (was: text `esc.tab.find`: en "Find a lobby" · uk "Знайти лобі" · toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`))
- **Changed** `Menu/V/Page/TitleRow/Title`: text `esc.tab.role`: en "Role" · uk "Роль" (was: text `esc.tab.find`: en "Find a lobby" · uk "Знайти лобі")
- **Shown:**
  - **Menu/V/Strip/Tabs/Role** `Button` · variation `ToyTab` · text `esc.tab.role`: en "Role" · uk "Роль" · toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`) · shown with keyboard focus (grab_focus)
  - **Menu/V/Strip/Tabs/Lobby** `Button` · variation `ToyTab` · text `esc.tab.lobby`: en "Lobby" · uk "Лобі" · toggle_mode true, button_pressed false
  - **Menu/V/Page/Role** `HBoxContainer` · variation `ToyRowThirtyTwo` · gaps from the variation: separation 32
    - Note: Reads only the own role and, for a human, the other humans.
    - **Left** `VBoxContainer` · variation `ToyColumnTwelve` · size flags horizontal `SIZE_EXPAND_FILL`, stretch_ratio 1.1 · gaps from the variation: separation 12
      - **You** `Label` · variation `ToyTextMutedOnLight` · text `player.you`: en "You" · uk "Ти"
      - **Role** `Label` · variation `ToyDisplayOnLight` · text `role.alien`: en "Alien" · uk "Прибулець"
        - Note: The own side at the display size: ToyDisplayOnLight (the accent) with role.alien, ToyDisplayAlertOnLight (the danger colour) with role.human, as in s6 and s7.
      - **Goal** `Label` · variation `ToyTextOnLight` · custom_minimum_size (560, 0) · text `role.goal.alien`: en "Throw the best party: finish every task before time runs out and the cops arrive." · uk "Влаштуй найкращу вечірку: виконай усі задачі, поки не скінчився час і не приїхали копи." · autowrap_mode `AUTOWRAP_WORD_SMART`

## `role-human`: what differs from `ship`

- **Hidden:** `Menu/V/Page/Ship`.
- **Changed** `Menu/V/Strip/Tabs/Game`: text `esc.tab.game`: en "Game" · uk "Гра" · toggle_mode true, button_pressed false (was: text `esc.tab.find`: en "Find a lobby" · uk "Знайти лобі" · toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`))
- **Changed** `Menu/V/Page/TitleRow/Title`: text `esc.tab.role`: en "Role" · uk "Роль" (was: text `esc.tab.find`: en "Find a lobby" · uk "Знайти лобі")
- **Shown:**
  - **Menu/V/Strip/Tabs/Role** `Button` · variation `ToyTab` · text `esc.tab.role`: en "Role" · uk "Роль" · toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`) · shown with keyboard focus (grab_focus)
  - **Menu/V/Strip/Tabs/Lobby** `Button` · variation `ToyTab` · text `esc.tab.lobby`: en "Lobby" · uk "Лобі" · toggle_mode true, button_pressed false
  - **Menu/V/Page/Role** `HBoxContainer` · variation `ToyRowThirtyTwo` · gaps from the variation: separation 32
    - Note: Reads only the own role and, for a human, the other humans.
    - **Left** `VBoxContainer` · variation `ToyColumnTwelve` · size flags horizontal `SIZE_EXPAND_FILL`, stretch_ratio 1.1 · gaps from the variation: separation 12
      - **You** `Label` · variation `ToyTextMutedOnLight` · text `player.you`: en "You" · uk "Ти"
      - **Role** `Label` · variation `ToyDisplayAlertOnLight` · text `role.human`: en "Human" · uk "Людина"
        - Note: The own side at the display size: ToyDisplayOnLight (the accent) with role.alien, ToyDisplayAlertOnLight (the danger colour) with role.human, as in s6 and s7.
      - **Goal** `Label` · variation `ToyTextOnLight` · custom_minimum_size (560, 0) · text `role.goal.human`: en "You're a human in an alien mask. Ruin the party: run out the clock or anger the neighbours until the cops come." · uk "Ти людина під маскою прибульця. Зіпсуй вечірку: протягни час або розлюти сусідів, щоб приїхали копи." · autowrap_mode `AUTOWRAP_WORD_SMART`
    - **Team** `VBoxContainer` · variation `ToyColumnSixteen` · size flags horizontal `SIZE_EXPAND_FILL` · gaps from the variation: separation 16
      - Note: Humans only (humans know each other: the engineer, 2026-10-20); hidden when there is no other human. Aliens see no list.
      - **Count** `Label` · variation `ToyTextMutedOnLight` · text `esc.role.teammates` with sample {count} = "1": en "Your team · 1" · uk "Твоя команда · 1"
        - Note: The number of the other humans (here one, Zinga, as in s6 and s7).
      - **Scroll** `ScrollContainer` · variation `ToyScroll` · custom_minimum_size (0, 375) · the gap between the child and the bar from the variation: scrollbar_h_separation 8 · horizontal_scroll_mode `SCROLL_MODE_DISABLED` (vertical scrolling only); `get_v_scroll_bar().theme_type_variation = &"ToyScrollBar"`; the bar shows when the child is taller
        - Note: The view is 375 px tall; the list scrolls when it is longer.
        - **Grid** `GridContainer` · variation `ToyGridList` · size flags horizontal `SIZE_EXPAND_FILL` · gaps from the variation: h_separation 24, v_separation 8 · columns 2
          - Note: Two columns, in join order; a long list scrolls in the 375 px view.
          - **Zinga** `HBoxContainer` · variation `ToyRowTwelve` · size flags horizontal `SIZE_EXPAND_FILL` · gaps from the variation: separation 12
            - **Mark** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (30, 30) · texture `teammate-mark` (dist/pack/icons/teammate-mark.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToyTextOnLight")
            - **Name** `Label` · variation `ToyTextOnLight` · size flags horizontal `SIZE_EXPAND_FILL` · text from data (auto_translate_mode = DISABLED), sample: "Zinga" / "Зінга" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
              - Note: The other human's name (auto_translate_mode DISABLED); a long name is cut with an ellipsis.

## `guide`: what differs from `ship`

- **Hidden:** `Menu/V/Page/Ship`.
- **Changed** `Menu/V/Strip/Tabs/Game`: text `esc.tab.game`: en "Game" · uk "Гра" · toggle_mode true, button_pressed false (was: text `esc.tab.find`: en "Find a lobby" · uk "Знайти лобі" · toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`))
- **Changed** `Menu/V/Strip/Tabs/Guide`: toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`) · shown with keyboard focus (grab_focus) (was: toggle_mode true, button_pressed false)
- **Changed** `Menu/V/Page/TitleRow/Title`: text `esc.tab.guide`: en "Guide" · uk "Посібник" (was: text `esc.tab.find`: en "Find a lobby" · uk "Знайти лобі")
- **Shown:**
  - **Menu/V/Strip/Tabs/Role** `Button` · variation `ToyTab` · text `esc.tab.role`: en "Role" · uk "Роль" · toggle_mode true, button_pressed false
  - **Menu/V/Strip/Tabs/Lobby** `Button` · variation `ToyTab` · text `esc.tab.lobby`: en "Lobby" · uk "Лобі" · toggle_mode true, button_pressed false
  - **Menu/V/Page/Guide** `HBoxContainer` · variation `ToyRowThirtyTwo` · size flags vertical `SIZE_EXPAND_FILL` · gaps from the variation: separation 32
    - **List** `ScrollContainer` · variation `ToyScroll` · custom_minimum_size (360, 0) · the gap between the child and the bar from the variation: scrollbar_h_separation 8 · horizontal_scroll_mode `SCROLL_MODE_DISABLED` (vertical scrolling only); `get_v_scroll_bar().theme_type_variation = &"ToyScrollBar"`; the bar shows when the child is taller
      - Note: Fills the page height. follow_focus = true, so keyboard and gamepad focus scrolls the chip in view. 360 px holds the longest chip at large text.
      - **V** `VBoxContainer` · variation `ToyColumnTwelve` · size flags horizontal `SIZE_EXPAND_FILL` · gaps from the variation: separation 12
        - Note: One ButtonGroup over every chip; a chip shows its card, titled with the chip's text. The MVP's new topics (points, mutations, the neighbours' anger, the cops, the dead's room) are open: their texts and cards are the engineer's.
        - **Basics** `Label` · variation `ToyTextMutedOnLight` · text `guide.basics`: en "Basics" · uk "Основи"
        - **Moving** `Button` · variation `ToyChipToggleOnLight` · size flags horizontal `SIZE_SHRINK_BEGIN` · text `guide.moving`: en "Moving and hands" · uk "Рух і руки" · toggle_mode true, button_pressed false
          - Note: Card frames: tutorial.step.move.title, .pick_up.title, .put_down.title, .hand_belt.title.
        - **Voice** `Button` · variation `ToyChipToggleOnLight` · size flags horizontal `SIZE_SHRINK_BEGIN` · text `guide.voice`: en "Voice" · uk "Голос" · toggle_mode true, button_pressed false
          - Note: Card frames: tutorial.step.voice.title, tutorial.step.voice.how, tutorial.list.death.
        - **Downed** `Button` · variation `ToyChipToggleOnLight` · size flags horizontal `SIZE_SHRINK_BEGIN` · text `guide.downed`: en "Downed and back" · uk "Нокдаун і повернення" · toggle_mode true, button_pressed false
          - Note: Card frames: tutorial.step.downed.title, downed.give_up_hold, then the death frames: tutorial.step.dead_room.title, tutorial.step.dead_room.how (drafts; the dead wait in the dead's room, m8 §3).
        - **Gap** `Control` · custom_minimum_size (0, 12)
          - Note: A spacer: 12 + 12 + 12 = 36 px between the Downed chip and the Tasks caption.
        - **Tasks** `Label` · variation `ToyTextMutedOnLight` · text `guide.tasks`: en "Tasks" · uk "Задачі"
        - **CarTuning** `Button` · variation `ToyChipToggleOnLight` · size flags horizontal `SIZE_SHRINK_BEGIN` · text `task.car_tuning`: en "Car tuning" · uk "Тюнінг авто" · toggle_mode true, button_pressed false
          - Note: The MVP's five task types (GDD §8, #1144), in the deck's order. Each card needs new wordless art (the card art quality bar); until the art track's cards exist every card shows the placeholder (own-work Delivery frames, dist/pack/cards/).
        - **Engine** `Button` · variation `ToyChipToggleOnLight` · size flags horizontal `SIZE_SHRINK_BEGIN` · text `task.engine`: en "Ship's engine" · uk "Двигун корабля" · toggle_mode true, button_pressed false
        - **Cooking** `Button` · variation `ToyChipToggleOnLight` · size flags horizontal `SIZE_SHRINK_BEGIN` · text `task.cooking`: en "Cooking" · uk "Готування" · toggle_mode true, button_pressed true (ToyToggle draws `ToyChipToggleOnLightSelected`)
        - **Photo** `Button` · variation `ToyChipToggleOnLight` · size flags horizontal `SIZE_SHRINK_BEGIN` · text `task.photo`: en "Photo" · uk "Фото" · toggle_mode true, button_pressed false
        - **Wifi** `Button` · variation `ToyChipToggleOnLight` · size flags horizontal `SIZE_SHRINK_BEGIN` · text `task.wifi`: en "Wi-Fi" · uk "Wi-Fi" · toggle_mode true, button_pressed false
    - **Card** `PanelContainer` · variation `ToyPanelHowto` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_BEGIN`
      - Note: P8 how-to card; a card is content data per task type (#254). Its frames stand in one row that scrolls sideways (Scroll), as in s3 and s8, with 272 px art beside the topic list.
      - **V** `VBoxContainer` · variation `ToyColumnTwentyFour` · gaps from the variation: separation 24
        - **Head** `HBoxContainer` · variation `ToyRowTwentyFour` · gaps from the variation: separation 24
          - **Title** `Label` · variation `ToyTitleOnLight` · size flags horizontal `SIZE_EXPAND_FILL` · text `task.cooking`: en "Cooking" · uk "Готування"
          - **Note** `Label` · variation `ToyHowtoNote` · size flags vertical `SIZE_SHRINK_CENTER` · text `howto.label`: en "How to" · uk "Як робити"
        - **Scroll** `ScrollContainer` · custom_minimum_size (302, 0) · scrolls sideways: horizontal_scroll_mode `SCROLL_MODE_SHOW_NEVER` (no bar drawn), vertical_scroll_mode `SCROLL_MODE_DISABLED`; the child keeps its minimum width, the container is as tall as the child and as wide as its custom_minimum_size
          - Note: The frames scroll sideways when they do not fit (the engineer, 2026-10-22): a card holds as many frames as its task needs. No bar is drawn (SCROLL_MODE_SHOW_NEVER) until the pack has a sideways bar; the frame cut at the card's edge shows there is more. The wheel scrolls it sideways while vertical scrolling is disabled, a drag on a touch screen too (unconfirmed for Godot 4.7.2: check ScrollContainer's wheel handling); follow_focus true. Here the view fills the card beside the topic list (at least one frame, 302 px).
          - **Frames** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Frame1** `PanelContainer` · variation `ToyHowtoFrame`
              - **Art** `TextureRect` · custom_minimum_size (272, 204) · texture `card/delivery-meaning-1` (dist/pack/cards/delivery-meaning-1.png, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · not tinted (drawn in its own colours)
                - Note: PLACEHOLDER art: seven own-work Delivery frames (dist/pack/cards/delivery-meaning-1..3, delivery-1..3 and delivery-meaning-4, 640x480, transparent) stand in for the Cooking card's seven frames, which the engineer named every card's placeholder (2026-10-22). Those frames are generated art kept in the art track (prime-game-art#272) and this repo's licence list does not cover generated art yet, so the game takes them from the art track's pack. expand_mode IGNORE_272x204 here, 352x264 in s3 and s8, stretch_mode KEEP_ASPECT_CENTERED; SIZE here; the same card in s3, s5 and s8. The cards are wordless: a frame holds only its art, no caption.
            - **Frame2** `PanelContainer` · variation `ToyHowtoFrame`
              - **Art** `TextureRect` · custom_minimum_size (272, 204) · texture `card/delivery-meaning-2` (dist/pack/cards/delivery-meaning-2.png, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · not tinted (drawn in its own colours)
            - **Frame3** `PanelContainer` · variation `ToyHowtoFrame`
              - **Art** `TextureRect` · custom_minimum_size (272, 204) · texture `card/delivery-meaning-3` (dist/pack/cards/delivery-meaning-3.png, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · not tinted (drawn in its own colours)
            - **Frame4** `PanelContainer` · variation `ToyHowtoFrame`
              - **Art** `TextureRect` · custom_minimum_size (272, 204) · texture `card/delivery-1` (dist/pack/cards/delivery-1.png, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · not tinted (drawn in its own colours)
            - **Frame5** `PanelContainer` · variation `ToyHowtoFrame`
              - **Art** `TextureRect` · custom_minimum_size (272, 204) · texture `card/delivery-2` (dist/pack/cards/delivery-2.png, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · not tinted (drawn in its own colours)
            - **Frame6** `PanelContainer` · variation `ToyHowtoFrame`
              - **Art** `TextureRect` · custom_minimum_size (272, 204) · texture `card/delivery-3` (dist/pack/cards/delivery-3.png, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · not tinted (drawn in its own colours)
            - **Frame7** `PanelContainer` · variation `ToyHowtoFrameDone`
              - Note: The frame that shows the finish.
              - **Art** `TextureRect` · custom_minimum_size (272, 204) · texture `card/delivery-meaning-4` (dist/pack/cards/delivery-meaning-4.png, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · not tinted (drawn in its own colours)

## `settings-sound`: what differs from `ship`

- **Hidden:** `Menu/V/Page/Ship`.
- **Changed** `Menu/V/Strip/Tabs/Game`: text `esc.tab.game`: en "Game" · uk "Гра" · toggle_mode true, button_pressed false (was: text `esc.tab.find`: en "Find a lobby" · uk "Знайти лобі" · toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`))
- **Changed** `Menu/V/Strip/Tabs/Settings`: toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`) · shown with keyboard focus (grab_focus) (was: toggle_mode true, button_pressed false)
- **Changed** `Menu/V/Page/TitleRow/Title`: text `esc.tab.settings`: en "Settings" · uk "Налаштування" (was: text `esc.tab.find`: en "Find a lobby" · uk "Знайти лобі")
- **Shown:**
  - **Menu/V/Strip/Tabs/Role** `Button` · variation `ToyTab` · text `esc.tab.role`: en "Role" · uk "Роль" · toggle_mode true, button_pressed false
  - **Menu/V/Strip/Tabs/Lobby** `Button` · variation `ToyTab` · text `esc.tab.lobby`: en "Lobby" · uk "Лобі" · toggle_mode true, button_pressed false
  - **Menu/V/Page/Settings** `VBoxContainer` · variation `ToyColumnTwentyFour` · size flags vertical `SIZE_EXPAND_FILL` · gaps from the variation: separation 24
    - Note: One scene (#301; since the boot into the ship only the suit menu shows it): the mic, the mode, the threshold with its live meter, noise suppression and the volumes work without a session. Saved per player.
    - **Sub** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
      - Note: One ButtonGroup; Settings opens on Sound and voice.
      - **Sound** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.sound`: en "Sound and voice" · uk "Звук і голос" · toggle_mode true, button_pressed true (ToyToggle draws `ToyChipToggleOnLightSelected`)
      - **Controls** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.controls`: en "Controls" · uk "Керування" · toggle_mode true, button_pressed false
      - **Display** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.display`: en "Display" · uk "Екран" · toggle_mode true, button_pressed false
      - **Access** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.accessibility`: en "Accessibility" · uk "Доступність" · toggle_mode true, button_pressed false
      - **Language** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.language`: en "Language" · uk "Мова" · toggle_mode true, button_pressed false
    - **Scroll** `ScrollContainer` · variation `ToyScroll` · size flags vertical `SIZE_EXPAND_FILL` · the gap between the child and the bar from the variation: scrollbar_h_separation 8 · horizontal_scroll_mode `SCROLL_MODE_DISABLED` (vertical scrolling only); `get_v_scroll_bar().theme_type_variation = &"ToyScrollBar"`; the bar shows when the child is taller
      - Note: follow_focus = true, so keyboard and gamepad focus scrolls the focused row in view (the 15 keys of Controls, the volumes at large text). Spectating left the MVP (the dead wait in the dead's room), so its two keys are gone from Controls.
      - **Rows** `VBoxContainer` · variation `ToyColumnTwelve` · size flags horizontal `SIZE_EXPAND_FILL` · gaps from the variation: separation 12
        - **Mic** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - Note: Without the voice add-on, Mic, TalkMode, Threshold and MicTest give way to one Label(ToyTextMutedOnLight) settings.voice_unavailable.
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `settings.mic`: en "Microphone" · uk "Мікрофон"
            - **Device** `OptionButton` · variation `ToyDropdown` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (450, 0) · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS` · text `settings.mic.default`: en "Default" · uk "Стандартний" · arrow: theme icon `arrow` (dist/pack/icons/chevron-down.svg), tinted by the font colour (modulate_arrow) · `get_popup().theme_type_variation = &"ToyDropdownList"` (its open list, see the notes) · items `settings.mic.default`
              - Note: Items: settings.mic.default, then the device names (not translated). A pick opens the device under the existing "opening" mark. A long device name is cut with an ellipsis, so the row keeps its 450 px.
        - **TalkMode** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `settings.talk_mode`: en "How to talk" · uk "Як говорити"
            - **Mode** `OptionButton` · variation `ToyDropdown` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (450, 0) · text `settings.talk_mode.open`: en "Voice activation" · uk "Голосова активація" · arrow: theme icon `arrow` (dist/pack/icons/chevron-down.svg), tinted by the font colour (modulate_arrow) · `get_popup().theme_type_variation = &"ToyDropdownList"` (its open list, see the notes) · items `settings.talk_mode.open`, `settings.talk_mode.push`, `common.off`
              - Note: Voice activation (with the threshold row), push to talk (the Talk key) or off. A dropdown like Mic: three chips would not fit the settings column at large text.
        - **Threshold** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - Note: Shown for voice activation only.
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `settings.voice_threshold`: en "Voice threshold" · uk "Поріг голосу"
            - **Slider** `HSlider` · variation `ToySlider` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (450, 0) · value 40 (min_value 0, max_value 100, step 1)
              - Note: The voice-activation threshold, 0 to 100 %.
        - **MicTest** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `settings.mic_test`: en "Mic test" · uk "Перевірка мікрофона"
            - **Meter** `ProgressBar` · variation `ToyBarSlider` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (450, 15) · value 40 of max_value 100, show_percentage false
              - Note: The live mic level; it runs without a session (#301).
        - **Noise** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `settings.noise_suppression`: en "Noise suppression" · uk "Шумозаглушення"
            - **Toggle** `HBoxContainer` · variation `ToyRowTwelve` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (450, 0) · gaps from the variation: separation 12
              - Note: One ButtonGroup: RNNoise off or on.
              - **Off** `Button` · variation `ToyChipToggleOnLight` · text `common.off`: en "Off" · uk "Вимкнено" · toggle_mode true, button_pressed false
              - **On** `Button` · variation `ToyChipToggleOnLight` · text `common.on`: en "On" · uk "Увімкнено" · toggle_mode true, button_pressed true (ToyToggle draws `ToyChipToggleOnLightSelected`)
        - **Overall** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `settings.game_volume`: en "Overall volume" · uk "Загальна гучність"
            - **Slider** `HSlider` · variation `ToySlider` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (450, 0) · value 55 (min_value 0, max_value 100, step 1)
              - Note: The Master bus, 0 to 100 %.
        - **Voices** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `settings.voice_volume`: en "Voice volume" · uk "Гучність голосів"
            - **Slider** `HSlider` · variation `ToySlider` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (450, 0) · value 70 (min_value 0, max_value 100, step 1)
              - Note: The voice bus, 0 to 100 %.
        - **Effects** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `settings.effects_volume`: en "Effects volume" · uk "Гучність ефектів"
            - **Slider** `HSlider` · variation `ToySlider` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (450, 0) · value 80 (min_value 0, max_value 100, step 1)
              - Note: The effects bus, 0 to 100 %.
        - **Music** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `settings.music_volume`: en "Music volume" · uk "Гучність музики"
            - **Slider** `HSlider` · variation `ToySlider` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (450, 0) · value 50 (min_value 0, max_value 100, step 1)
              - Note: The music bus, 0 to 100 %.

## `settings-controls`: what differs from `ship`

- **Hidden:** `Menu/V/Page/Ship`.
- **Changed** `Menu/V/Strip/Tabs/Game`: text `esc.tab.game`: en "Game" · uk "Гра" · toggle_mode true, button_pressed false (was: text `esc.tab.find`: en "Find a lobby" · uk "Знайти лобі" · toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`))
- **Changed** `Menu/V/Strip/Tabs/Settings`: toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`) (was: toggle_mode true, button_pressed false)
- **Changed** `Menu/V/Page/TitleRow/Title`: text `esc.tab.settings`: en "Settings" · uk "Налаштування" (was: text `esc.tab.find`: en "Find a lobby" · uk "Знайти лобі")
- **Shown:**
  - **Menu/V/Strip/Tabs/Role** `Button` · variation `ToyTab` · text `esc.tab.role`: en "Role" · uk "Роль" · toggle_mode true, button_pressed false
  - **Menu/V/Strip/Tabs/Lobby** `Button` · variation `ToyTab` · text `esc.tab.lobby`: en "Lobby" · uk "Лобі" · toggle_mode true, button_pressed false
  - **Menu/V/Page/Settings** `VBoxContainer` · variation `ToyColumnTwentyFour` · size flags vertical `SIZE_EXPAND_FILL` · gaps from the variation: separation 24
    - Note: One scene (#301; since the boot into the ship only the suit menu shows it): the mic, the mode, the threshold with its live meter, noise suppression and the volumes work without a session. Saved per player.
    - **Sub** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
      - Note: One ButtonGroup; Settings opens on Sound and voice.
      - **Sound** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.sound`: en "Sound and voice" · uk "Звук і голос" · toggle_mode true, button_pressed false
      - **Controls** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.controls`: en "Controls" · uk "Керування" · toggle_mode true, button_pressed true (ToyToggle draws `ToyChipToggleOnLightSelected`)
      - **Display** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.display`: en "Display" · uk "Екран" · toggle_mode true, button_pressed false
      - **Access** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.accessibility`: en "Accessibility" · uk "Доступність" · toggle_mode true, button_pressed false
      - **Language** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.language`: en "Language" · uk "Мова" · toggle_mode true, button_pressed false
    - **Scroll** `ScrollContainer` · variation `ToyScroll` · size flags vertical `SIZE_EXPAND_FILL` · the gap between the child and the bar from the variation: scrollbar_h_separation 8 · horizontal_scroll_mode `SCROLL_MODE_DISABLED` (vertical scrolling only); `get_v_scroll_bar().theme_type_variation = &"ToyScrollBar"`; the bar shows when the child is taller
      - Note: follow_focus = true, so keyboard and gamepad focus scrolls the focused row in view (the 15 keys of Controls, the volumes at large text). Spectating left the MVP (the dead wait in the dead's room), so its two keys are gone from Controls.
      - **Rows** `VBoxContainer` · variation `ToyColumnTwelve` · size flags horizontal `SIZE_EXPAND_FILL` · gaps from the variation: separation 12
        - **Forward** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.forward`: en "Forward" · uk "Уперед"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (144, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text from data (auto_translate_mode = DISABLED), sample: "W"
              - Note: Button(ToyKeyButton), wide (min 96): its text is the bound key's label, DisplayServer.keyboard_get_label_from_physical() of the action's binding (data, auto_translate_mode DISABLED); Space and the mouse buttons use key.space, key.mouse_left, key.mouse_right. A click or ui_accept starts capture.
        - **Backward** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.backward`: en "Back" · uk "Назад"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (144, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text from data (auto_translate_mode = DISABLED), sample: "S"
        - **Left** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.left`: en "Left" · uk "Ліворуч"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (144, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text from data (auto_translate_mode = DISABLED), sample: "A"
        - **Right** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.right`: en "Right" · uk "Праворуч"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (144, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text from data (auto_translate_mode = DISABLED), sample: "D"
        - **Sprint** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.sprint`: en "Sprint" · uk "Бігти"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (144, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text from data (auto_translate_mode = DISABLED), sample: "Shift"
        - **Jump** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.jump`: en "Jump" · uk "Стрибнути"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (144, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text `key.space`: en "Space" · uk "Пробіл"
        - **Crouch** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.crouch`: en "Crouch" · uk "Присісти"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (144, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text from data (auto_translate_mode = DISABLED), sample: "Ctrl"
        - **Sneak** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.sneak`: en "Sneak" · uk "Крастися"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (144, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text from data (auto_translate_mode = DISABLED), sample: "Alt"
        - **Interact** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.interact`: en "Interact" · uk "Взаємодіяти"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (144, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text `settings.controls.press_key`: en "Press a key…" · uk "Натисни клавішу…" · shown held down (review only)
              - Note: Capturing: settings.controls.press_key on the pressed look; idle it shows the bound key's label (E). A click or ui_accept starts capture: set toggle_mode = true and set_pressed_no_signal(true), which draws ToyKeyButton's pressed StyleBox (it has no toggle partner), and restore both when capture ends. Capture runs in _input and calls get_viewport().set_input_as_handled() on every event, so nothing else sees it: the next key or mouse button binds, except the release of the click that started capture, which is ignored; Esc cancels and is consumed (the menu stays open); the arrows and ui_accept do not move or press focus while capturing.
        - **Use** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.use`: en "Use" · uk "Використати"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (144, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text `key.mouse_left`: en "LMB" · uk "ЛКМ"
        - **PutDown** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.put_down`: en "Put down" · uk "Покласти"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (144, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text from data (auto_translate_mode = DISABLED), sample: "Q"
        - **Swap** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.swap`: en "Swap hand and belt" · uk "Поміняти руку й пояс"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (144, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text from data (auto_translate_mode = DISABLED), sample: "X"
        - **Throw** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.throw`: en "Toss" · uk "Жбурнути"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (144, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text from data (auto_translate_mode = DISABLED), sample: "G"
        - **Map** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.map`: en "Map and tasks" · uk "Мапа й задачі"
            - **Same** `PanelContainer` · variation `ToyChipAlert` · size flags vertical `SIZE_SHRINK_CENTER`
              - Note: Only on rows whose key clashes with another action of the same phase (here Map and Talk on M); give_up and ready share F legally (different phases, #211).
              - **Text** `Label` · variation `ToyChipAlertText` · text `settings.controls.same_key`: en "Same key" · uk "Та сама клавіша"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (144, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text from data (auto_translate_mode = DISABLED), sample: "M"
        - **GiveUp** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.give_up`: en "Give up" · uk "Здатися"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (144, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text from data (auto_translate_mode = DISABLED), sample: "F"
        - **ReadyKey** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.ready`: en "Ready" · uk "Готовність"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (144, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text from data (auto_translate_mode = DISABLED), sample: "F"
        - **Talk** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.talk`: en "Talk" · uk "Говорити"
            - **Same** `PanelContainer` · variation `ToyChipAlert` · size flags vertical `SIZE_SHRINK_CENTER`
              - **Text** `Label` · variation `ToyChipAlertText` · text `settings.controls.same_key`: en "Same key" · uk "Та сама клавіша"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (144, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text from data (auto_translate_mode = DISABLED), sample: "M"
        - **ResetGap** `Control` · custom_minimum_size (0, 18)
          - Note: A spacer: 4 + 12 + 4 = 20 px between the last row and Reset.
        - **Reset** `Button` · variation `ToyButtonGhostOnLight` · size flags horizontal `SIZE_SHRINK_BEGIN` · text `settings.controls.reset`: en "Reset to defaults" · uk "Скинути до стандартних"
          - Note: Restores the default bindings. Esc itself is fixed.

## `settings-display`: what differs from `ship`

- **Hidden:** `Menu/V/Page/Ship`.
- **Changed** `Menu/V/Strip/Tabs/Game`: text `esc.tab.game`: en "Game" · uk "Гра" · toggle_mode true, button_pressed false (was: text `esc.tab.find`: en "Find a lobby" · uk "Знайти лобі" · toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`))
- **Changed** `Menu/V/Strip/Tabs/Settings`: toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`) · shown with keyboard focus (grab_focus) (was: toggle_mode true, button_pressed false)
- **Changed** `Menu/V/Page/TitleRow/Title`: text `esc.tab.settings`: en "Settings" · uk "Налаштування" (was: text `esc.tab.find`: en "Find a lobby" · uk "Знайти лобі")
- **Shown:**
  - **Menu/V/Strip/Tabs/Role** `Button` · variation `ToyTab` · text `esc.tab.role`: en "Role" · uk "Роль" · toggle_mode true, button_pressed false
  - **Menu/V/Strip/Tabs/Lobby** `Button` · variation `ToyTab` · text `esc.tab.lobby`: en "Lobby" · uk "Лобі" · toggle_mode true, button_pressed false
  - **Menu/V/Page/Settings** `VBoxContainer` · variation `ToyColumnTwentyFour` · size flags vertical `SIZE_EXPAND_FILL` · gaps from the variation: separation 24
    - Note: One scene (#301; since the boot into the ship only the suit menu shows it): the mic, the mode, the threshold with its live meter, noise suppression and the volumes work without a session. Saved per player.
    - **Sub** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
      - Note: One ButtonGroup; Settings opens on Sound and voice.
      - **Sound** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.sound`: en "Sound and voice" · uk "Звук і голос" · toggle_mode true, button_pressed false
      - **Controls** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.controls`: en "Controls" · uk "Керування" · toggle_mode true, button_pressed false
      - **Display** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.display`: en "Display" · uk "Екран" · toggle_mode true, button_pressed true (ToyToggle draws `ToyChipToggleOnLightSelected`)
      - **Access** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.accessibility`: en "Accessibility" · uk "Доступність" · toggle_mode true, button_pressed false
      - **Language** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.language`: en "Language" · uk "Мова" · toggle_mode true, button_pressed false
    - **Scroll** `ScrollContainer` · variation `ToyScroll` · size flags vertical `SIZE_EXPAND_FILL` · the gap between the child and the bar from the variation: scrollbar_h_separation 8 · horizontal_scroll_mode `SCROLL_MODE_DISABLED` (vertical scrolling only); `get_v_scroll_bar().theme_type_variation = &"ToyScrollBar"`; the bar shows when the child is taller
      - Note: follow_focus = true, so keyboard and gamepad focus scrolls the focused row in view (the 15 keys of Controls, the volumes at large text). Spectating left the MVP (the dead wait in the dead's room), so its two keys are gone from Controls.
      - **Rows** `VBoxContainer` · variation `ToyColumnTwelve` · size flags horizontal `SIZE_EXPAND_FILL` · gaps from the variation: separation 12
        - **Window** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `settings.window`: en "Window" · uk "Вікно"
            - **Mode** `HBoxContainer` · variation `ToyRowTwelve` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (450, 0) · gaps from the variation: separation 12
              - Note: One ButtonGroup: DisplayServer window mode.
              - **Fullscreen** `Button` · variation `ToyChipToggleOnLight` · text `settings.window.fullscreen`: en "Fullscreen" · uk "На весь екран" · toggle_mode true, button_pressed true (ToyToggle draws `ToyChipToggleOnLightSelected`)
              - **Windowed** `Button` · variation `ToyChipToggleOnLight` · text `settings.window.windowed`: en "Windowed" · uk "У вікні" · toggle_mode true, button_pressed false

## `settings-access`: what differs from `ship`

- **Hidden:** `Menu/V/Page/Ship`.
- **Changed** `Menu/V/Strip/Tabs/Game`: text `esc.tab.game`: en "Game" · uk "Гра" · toggle_mode true, button_pressed false (was: text `esc.tab.find`: en "Find a lobby" · uk "Знайти лобі" · toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`))
- **Changed** `Menu/V/Strip/Tabs/Settings`: toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`) · shown with keyboard focus (grab_focus) (was: toggle_mode true, button_pressed false)
- **Changed** `Menu/V/Page/TitleRow/Title`: text `esc.tab.settings`: en "Settings" · uk "Налаштування" (was: text `esc.tab.find`: en "Find a lobby" · uk "Знайти лобі")
- **Shown:**
  - **Menu/V/Strip/Tabs/Role** `Button` · variation `ToyTab` · text `esc.tab.role`: en "Role" · uk "Роль" · toggle_mode true, button_pressed false
  - **Menu/V/Strip/Tabs/Lobby** `Button` · variation `ToyTab` · text `esc.tab.lobby`: en "Lobby" · uk "Лобі" · toggle_mode true, button_pressed false
  - **Menu/V/Page/Settings** `VBoxContainer` · variation `ToyColumnTwentyFour` · size flags vertical `SIZE_EXPAND_FILL` · gaps from the variation: separation 24
    - Note: One scene (#301; since the boot into the ship only the suit menu shows it): the mic, the mode, the threshold with its live meter, noise suppression and the volumes work without a session. Saved per player.
    - **Sub** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
      - Note: One ButtonGroup; Settings opens on Sound and voice.
      - **Sound** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.sound`: en "Sound and voice" · uk "Звук і голос" · toggle_mode true, button_pressed false
      - **Controls** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.controls`: en "Controls" · uk "Керування" · toggle_mode true, button_pressed false
      - **Display** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.display`: en "Display" · uk "Екран" · toggle_mode true, button_pressed false
      - **Access** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.accessibility`: en "Accessibility" · uk "Доступність" · toggle_mode true, button_pressed true (ToyToggle draws `ToyChipToggleOnLightSelected`)
      - **Language** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.language`: en "Language" · uk "Мова" · toggle_mode true, button_pressed false
    - **Scroll** `ScrollContainer` · variation `ToyScroll` · size flags vertical `SIZE_EXPAND_FILL` · the gap between the child and the bar from the variation: scrollbar_h_separation 8 · horizontal_scroll_mode `SCROLL_MODE_DISABLED` (vertical scrolling only); `get_v_scroll_bar().theme_type_variation = &"ToyScrollBar"`; the bar shows when the child is taller
      - Note: follow_focus = true, so keyboard and gamepad focus scrolls the focused row in view (the 15 keys of Controls, the volumes at large text). Spectating left the MVP (the dead wait in the dead's room), so its two keys are gone from Controls.
      - **Rows** `VBoxContainer` · variation `ToyColumnTwelve` · size flags horizontal `SIZE_EXPAND_FILL` · gaps from the variation: separation 12
        - **LargeText** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `settings.large_text`: en "Large text" · uk "Великий текст"
            - **Toggle** `HBoxContainer` · variation `ToyRowTwelve` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (450, 0) · gaps from the variation: separation 12
              - Note: One ButtonGroup. On swaps GameUi's theme to game_theme_large.tres live.
              - **Off** `Button` · variation `ToyChipToggleOnLight` · text `common.off`: en "Off" · uk "Вимкнено" · toggle_mode true, button_pressed true (ToyToggle draws `ToyChipToggleOnLightSelected`)
              - **On** `Button` · variation `ToyChipToggleOnLight` · text `common.on`: en "On" · uk "Увімкнено" · toggle_mode true, button_pressed false
        - **ReducedMotion** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `settings.reduced_motion`: en "Reduce motion" · uk "Менше руху"
            - **Toggle** `HBoxContainer` · variation `ToyRowTwelve` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (450, 0) · gaps from the variation: separation 12
              - Note: One ButtonGroup; the default comes from DisplayServer.accessibility_should_reduce_animation(). On: the connecting spinner (s3) turns at half speed; the pre and post game fades (s6, s10) and the End fade are cuts; the button press is instant (the pressed StyleBox still shows).
              - **Off** `Button` · variation `ToyChipToggleOnLight` · text `common.off`: en "Off" · uk "Вимкнено" · toggle_mode true, button_pressed true (ToyToggle draws `ToyChipToggleOnLightSelected`)
              - **On** `Button` · variation `ToyChipToggleOnLight` · text `common.on`: en "On" · uk "Увімкнено" · toggle_mode true, button_pressed false

## `settings-language`: what differs from `ship`

- **Hidden:** `Menu/V/Page/Ship`.
- **Changed** `Menu/V/Strip/Tabs/Game`: text `esc.tab.game`: en "Game" · uk "Гра" · toggle_mode true, button_pressed false (was: text `esc.tab.find`: en "Find a lobby" · uk "Знайти лобі" · toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`))
- **Changed** `Menu/V/Strip/Tabs/Settings`: toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`) · shown with keyboard focus (grab_focus) (was: toggle_mode true, button_pressed false)
- **Changed** `Menu/V/Page/TitleRow/Title`: text `esc.tab.settings`: en "Settings" · uk "Налаштування" (was: text `esc.tab.find`: en "Find a lobby" · uk "Знайти лобі")
- **Shown:**
  - **Menu/V/Strip/Tabs/Role** `Button` · variation `ToyTab` · text `esc.tab.role`: en "Role" · uk "Роль" · toggle_mode true, button_pressed false
  - **Menu/V/Strip/Tabs/Lobby** `Button` · variation `ToyTab` · text `esc.tab.lobby`: en "Lobby" · uk "Лобі" · toggle_mode true, button_pressed false
  - **Menu/V/Page/Settings** `VBoxContainer` · variation `ToyColumnTwentyFour` · size flags vertical `SIZE_EXPAND_FILL` · gaps from the variation: separation 24
    - Note: One scene (#301; since the boot into the ship only the suit menu shows it): the mic, the mode, the threshold with its live meter, noise suppression and the volumes work without a session. Saved per player.
    - **Sub** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
      - Note: One ButtonGroup; Settings opens on Sound and voice.
      - **Sound** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.sound`: en "Sound and voice" · uk "Звук і голос" · toggle_mode true, button_pressed false
      - **Controls** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.controls`: en "Controls" · uk "Керування" · toggle_mode true, button_pressed false
      - **Display** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.display`: en "Display" · uk "Екран" · toggle_mode true, button_pressed false
      - **Access** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.accessibility`: en "Accessibility" · uk "Доступність" · toggle_mode true, button_pressed false
      - **Language** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.language`: en "Language" · uk "Мова" · toggle_mode true, button_pressed true (ToyToggle draws `ToyChipToggleOnLightSelected`)
    - **Scroll** `ScrollContainer` · variation `ToyScroll` · size flags vertical `SIZE_EXPAND_FILL` · the gap between the child and the bar from the variation: scrollbar_h_separation 8 · horizontal_scroll_mode `SCROLL_MODE_DISABLED` (vertical scrolling only); `get_v_scroll_bar().theme_type_variation = &"ToyScrollBar"`; the bar shows when the child is taller
      - Note: follow_focus = true, so keyboard and gamepad focus scrolls the focused row in view (the 15 keys of Controls, the volumes at large text). Spectating left the MVP (the dead wait in the dead's room), so its two keys are gone from Controls.
      - **Rows** `VBoxContainer` · variation `ToyColumnTwelve` · size flags horizontal `SIZE_EXPAND_FILL` · gaps from the variation: separation 12
        - **Language** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 96)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `settings.language.title`: en "Game language" · uk "Мова гри"
            - **Choice** `HBoxContainer` · variation `ToyRowTwelve` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (450, 0) · gaps from the variation: separation 12
              - Note: One ButtonGroup; each language is named in itself (auto_translate_mode DISABLED); the language applies at once (#208). A long list later would take ToyRadio rows.
              - **Ukrainian** `Button` · variation `ToyChipToggleOnLight` · text `lang.uk`: en "Українська" · uk "Українська" · button_pressed while this is the game's language (TranslationServer.get_locale()); the page draws the shown language's chip pressed · toggle_mode true, button_pressed true (ToyToggle draws `ToyChipToggleOnLightSelected`)
              - **English** `Button` · variation `ToyChipToggleOnLight` · text `lang.en`: en "English" · uk "English" · button_pressed while this is the game's language (TranslationServer.get_locale()); the page draws the shown language's chip pressed · toggle_mode true, button_pressed false

## `tutorial-game`: what differs from `ship`

- **Hidden:** `Menu/V/Strip/Tabs/Character`, `Menu/V/Page/Ship`.
- **Changed** `Menu/V/Strip/Tabs/Game`: text `esc.tab.game`: en "Game" · uk "Гра" (was: text `esc.tab.find`: en "Find a lobby" · uk "Знайти лобі")
- **Changed** `Menu/V/Page/TitleRow/Title`: text `esc.tab.game`: en "Game" · uk "Гра" (was: text `esc.tab.find`: en "Find a lobby" · uk "Знайти лобі")
- **Shown:**
  - **Menu/V/Page/Actions** `VBoxContainer` · variation `ToyColumnTwentyFour` · size flags horizontal `SIZE_SHRINK_BEGIN` · custom_minimum_size (760, 0) · gaps from the variation: separation 24
    - **Resume** `Button` · variation `ToyButtonPrimary` · text `esc.game.resume`: en "Resume" · uk "Продовжити" · shown with keyboard focus (grab_focus)
      - Note: Closes the menu (as Esc). Takes focus when the menu opens on Game.
    - **Leave** `Button` · variation `ToyButtonSecondary` · text `esc.game.leave_tutorial`: en "Leave the tutorial" · uk "Вийти з навчання"
      - Note: The host: the danger colour (ToyButtonDanger), opens the confirm dialog. A player: ToyButtonSecondary, leaves at once. In the tutorial: ToyButtonSecondary esc.game.leave_tutorial, back to the ship. Leaving a session returns the player to the ship (s5 ship).
    - **Quit** `Button` · variation `ToyButtonGhostOnLight` · text `esc.game.quit`: en "Quit the game" · uk "Вийти з гри"
      - Note: The host: opens the confirm dialog (esc.game.quit_confirm, Confirm esc.game.quit). A player, and in the tutorial: quits at once.

## Notes

- The review page emulates Godot's containers with CSS grid (expanding children share the free space by stretch ratio, never below their minimum size), so a pixel or two may differ from Godot.
- Size constants: a variation's `width`, `height`, `min_width`, `wide_width` and `wide_min_width` theme constants are read by code into `custom_minimum_size`, as the node lines give them. A Panel or PanelContainer takes no size from them on its own: an anchored Panel at offsets 0 is 0×0, a slot shrinks to its text.
- Size constants that follow the text size: `min_width` 42 (50 in the pack's `modes.textSize.large`) of ToyKeyButton, ToyKeyOnLight, ToyKeyQuiet. The large-text theme is swapped in while a screen is open, so code that sets custom_minimum_size from such a constant sets it again on `NOTIFICATION_THEME_CHANGED`.
- Icons: the tinted ones are white SVGs in `dist/pack/icons/` (the pack's copy of `pages/components/icons`, currentColor written as white): a TextureRect tints one with the `self_modulate` its line gives (the colour the page draws it in), a Button with its variation's `icon_*_color`, an OptionButton its arrow with `modulate_arrow`. The room pictograms are white copies too (`dist/pack/icons/room/`), drawn in ink: their lines give the `self_modulate`. The pack's `assets` list every icon with its tint and `svg_scale`.
- SVG import: Godot rasterises an SVG at import, so import each at `svg/scale` = the largest size it is drawn ÷ its viewBox (the largest over every screen that draws it, as the pack's `assets` give it): `check` 1.5 (36 px), `chevron-down` 1 (24 px), `lock` 1.25 (30 px), `minus` 1 (24 px), `plus` 1 (24 px), `radio-checked` 1 (24 px), `radio-checked-disabled` 1 (24 px), `radio-unchecked` 1 (24 px), `slider-knob` 1 (42 px), `slider-knob-disabled` 1 (42 px), `swatch-disc` 2.31 (60 px), `teammate-mark` 1.25 (30 px).
- Card art: the how-to frames draw the pack's PNGs, `dist/pack/cards/delivery-1.png`, `dist/pack/cards/delivery-2.png`, `dist/pack/cards/delivery-3.png`, `dist/pack/cards/delivery-meaning-1.png`, `dist/pack/cards/delivery-meaning-2.png`, `dist/pack/cards/delivery-meaning-3.png`, `dist/pack/cards/delivery-meaning-4.png` (640x480, transparent, own work; rendered from `pages/card-art/round-2/clean-sketch/`, `pages/card-art/round-3/a/` by `tools/card-art/render.js`), in their own colours, never tinted. They are drawn smaller than their size (up to 272x204 px here), so import them as Texture2D with `compress/mode` Lossless and `mipmaps/generate` on.
- An OptionButton's open list is its `get_popup()`, a PopupMenu in a window of its own: set its `theme_type_variation` to `ToyDropdownList` in code when the scene is ready (a cream list with the dropdown's ink outline, a lavender hovered or keyboard-focused row). The selected item shows the theme icon `radio_checked` (`dist/pack/icons/radio-checked.svg`, `radio_checked_disabled` `dist/pack/icons/radio-checked-disabled.svg`); the others `radio_unchecked` and `radio_unchecked_disabled` (`dist/pack/icons/radio-unchecked.svg`, empty, so every label starts at the same x). PopupMenu does not tint these icons, so they are drawn in their own colours (not white; the pack names them in the variation's `textures`). Its rounded corners need the default embedded subwindows (`display/window/subwindows/embed_subwindows` true).
- A LineEdit's right-click menu is a PopupMenu too, but its labels (Cut, Copy, Paste, Select All, Clear, Undo, Redo, Text Writing Direction, …) are Godot's English source strings, translated at run time only through translations of those exact strings, which the copy deck (keyed, copy/strings.csv) does not have: in Ukrainian they would show in English. So LineEdits keep `context_menu_enabled = false`; the keyboard shortcuts (copy, paste, select all, undo) still work.
- Boxes and grids take their gaps only from their spacing variation (ToyColumn…, ToyRow…, ToyGrid…), and a ScrollContainer the gap to its bar from ToyScroll; a box without one has a single child. No `theme_override_constants`: the theme test forbids them.
- An HSlider's grabber is a texture: the theme icons `grabber` and `grabber_highlight` are `dist/pack/icons/slider-knob.svg`, `grabber_disabled` `dist/pack/icons/slider-knob-disabled.svg` (own work, in their own colours, not tinted; the pack names them in the variation's `textures`). Slider draws no focus StyleBox of its own: draw the variation's `focus` StyleBox over the slider while it has visible focus.
- A ScrollContainer's bar is its own `VScrollBar`: set its `theme_type_variation` to `ToyScrollBar` in code (`get_v_scroll_bar()`); the child fills the width (`SIZE_EXPAND_FILL`) and keeps its minimum height.

## Keys

- **Drawn** (112): `common.back`, `common.cancel`, `common.code`, `common.off`, `common.on`, `control.backward`, `control.crouch`, `control.forward`, `control.give_up`, `control.interact`, `control.jump`, `control.left`, `control.map`, `control.put_down`, `control.ready`, `control.right`, `control.sneak`, `control.sprint`, `control.swap`, `control.talk`, `control.throw`, `control.use`, `esc.character.colour`, `esc.character.locked`, `esc.game.leave`, `esc.game.leave_confirm`, `esc.game.leave_host_note`, `esc.game.leave_tutorial`, `esc.game.quit`, `esc.game.resume`, `esc.lobby.code_gone`, `esc.lobby.copy`, `esc.lobby.host_only`, `esc.lobby.preset`, `esc.lobby.ready`, `esc.lobby.you_host`, `esc.role.teammates`, `esc.tab.character`, `esc.tab.find`, `esc.tab.game`, `esc.tab.guide`, `esc.tab.lobby`, `esc.tab.role`, `esc.tab.settings`, `guide.basics`, `guide.downed`, `guide.moving`, `guide.tasks`, `guide.voice`, `howto.label`, `join.address`, `join.connect`, `join.port`, `key.mouse_left`, `key.space`, `lang.en`, `lang.uk`, `lobby.host_mark`, `lobby.player_count`, `lobby.setting.anger`, `lobby.setting.duration`, `lobby.setting.humans`, `lobby.setting.humans_of`, `lobby.setting.knives`, `lobby.setting.name`, `lobby.setting.wifi_passwords`, `menu.direct`, `menu.host`, `menu.join`, `menu.tutorial`, `player.name`, `player.you`, `preset.no_knives`, `preset.quick`, `preset.save_own`, `preset.standard`, `role.alien`, `role.goal.alien`, `role.goal.human`, `role.human`, `settings.controls.press_key`, `settings.controls.reset`, `settings.controls.same_key`, `settings.effects_volume`, `settings.game_volume`, `settings.language.title`, `settings.large_text`, `settings.mic`, `settings.mic.default`, `settings.mic_test`, `settings.music_volume`, `settings.noise_suppression`, `settings.reduced_motion`, `settings.tab.accessibility`, `settings.tab.controls`, `settings.tab.display`, `settings.tab.language`, `settings.tab.sound`, `settings.talk_mode`, `settings.talk_mode.open`, `settings.talk_mode.push`, `settings.voice_threshold`, `settings.voice_volume`, `settings.window`, `settings.window.fullscreen`, `settings.window.windowed`, `task.car_tuning`, `task.cooking`, `task.engine`, `task.photo`, `task.wifi`, `unit.minutes`.
- **Named only in the notes** (wire them too): `downed.give_up_hold`, `esc.character.hat`, `esc.game.quit_confirm`, `esc.lobby.copied`, `key.mouse_right`, `lobby.default_name`, `preset.custom`, `settings.voice_unavailable`, `tutorial.list.death`, `tutorial.step.dead_room.how`, `tutorial.step.dead_room.title`, `tutorial.step.downed.title`, `tutorial.step.move.title`, `tutorial.step.voice.how`, `tutorial.step.voice.title`.

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
