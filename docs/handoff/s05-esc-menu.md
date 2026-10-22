# 5 · Esc menu

<!-- node pages/screens/build.js --handoff s5 (prime-game-ui, pages/screens/src/s05-esc-menu.json); generated, do not edit by hand -->

The styled esc menu screen from the UI track (xperiaroco2/prime-game-ui), as a Godot 4.7.2 node tree for the 1920×1080 reference.

- **Source:** `pages/screens/src/s05-esc-menu.json`; the review page is `pages/screens/screens.html#s5`; the wireframe is section `s5` («Меню Esc»).
- **Theme:** the Toy pack ui-2.2.2 (`dist/pack/toy.pack.json`); the variations below are `theme_type_variation` names.
- **World behind the UI** (not UI): the ship (the lobby room) seen behind a menu.
- **How to read it:** the roots are children of the screen's full-rect root `Control`; every property not listed keeps Godot's default; sizes and offsets are reference px. In a state's **Shown** list, the first node of each subtree gives its path from the screen root.
- **Texts** are keys of `copy/strings.csv`, and the language switches live (the Esc menu's Settings). A plain key is set as `text` and translates itself. A key with placeholders, a plural key (`tr_n`) and a key drawn in pieces are set from code with `auto_translate_mode = DISABLED`: `tr()`, then `String.format()` with the data (the samples below), rebuilt on `NOTIFICATION_TRANSLATION_CHANGED`. A "text from data" (names, the room code, times, numbers) is set in code and never translated (`auto_translate_mode = DISABLED`).

The suit menu over the running game (no pause), in the approved look (pages/suit-final, section 2, «Меню костюма (Esc)»): one tile, the tabs as text on the hairline strip with the small Esc keycap at its right, no page title under the tabs (the chosen tab names the page), small-capitals heads (ToyKicker) and hairline rows (ToySettingRow). Esc (ui_cancel) opens and closes it; the game runs on, the mouse is free while it is open and captured again on close. While it is open the own character takes no gameplay input (it stands still: no move, look, sprint, jump, interact or item use; those keys go to the menu or nowhere); the voice keeps working as set (voice activation, or the Talk key while held). Focus: the frames show the mouse's view with no focus drawn; ship-keys shows the ring keyboard and gamepad focus draws. The game boots straight into the ship (the engineer, 2026-10-21; s2 was removed): with no session the menu has Find a lobby (host, join with a code, join by address, the tutorial, quit) and Settings. The host's match settings are the ship console's screen (s4), so this menu has no Lobby tab. Open (each a visible placeholder here): the lobbies nearby and the own code (the target's list and «Твій код» row) need the game's network discovery and the engineer's words; the Guide's new topics (points, mutations, the neighbours' anger, the cops, the dead's room); every MVP task's card art (the art track's; own-work Delivery frames stand in here).

## States

| State | Page label | What it shows |
|---|---|---|
| `ship` | Корабель | In the ship with no session: the game boots straight here (the engineer, 2026-10-21) and every player returns here when a session ends or they leave it. Two tabs only, as the target page (pages/suit-final, section 2): Find a lobby (esc.tab.find, the Game tab's name while there is no session) and Settings; no Role, Guide, Character or Lobby tab without a session. The code field is empty, so Join is disabled. No control is drawn focused: the frames show the mouse's view (ship-keys shows the focus ring). |
| `ship-empty` | Корабель: поруч нікого | No lobby found on the network nearby: the list says so in one line, with no Join; the code entry and the footer as in ship. |
| `ship-code` | Корабель: код | Six valid characters typed into the code field, so Join is enabled. |
| `ship-keys` | З клавіатури | The same frame reached with the keyboard or a gamepad: Join has the focus and draws its focus ring. The one frame that documents the ring; every other frame shows the mouse's view, with no focus drawn. |
| `ship-direct` | Корабель: за адресою | Join by address pressed in the footer: the address entry takes the code entry's place, with the default port under it; Join, or host directly. |
| `character` | Персонаж | In the lobby (a session in the ship): the tabs Game, Guide, Character and Settings (Role is hidden in the lobby; the match settings are the ship console's screen, s4, not a tab here). The name and the body colour apply live. |
| `character-round` | Персонаж у раунді | In a round: locked; the name is read-only and the swatches take no input. |
| `game-host` | Гра: хост | In a round (the menu opens on Game there), the host: Leave and Quit open the confirm dialog. |
| `game-guest` | Гра: гравець | In a round, a player: Leave and Quit act at once. |
| `game-confirm` | Гра: підтвердження | The host pressed Leave: the confirm dialog (P1) over the menu. Quit opens the same dialog titled esc.game.quit_confirm with Confirm esc.game.quit. |
| `role-alien` | Роль: прибулець | In a round only: the own role and its goal. |
| `role-human` | Роль: людина | A human also sees the other humans (humans know each other: the engineer, 2026-10-20; one here, Zinga, as in s6 and s7); the list scrolls when it is longer than the view. With no other human the Team column is hidden. |
| `guide` | Посібник | In a round: every how-to card, the basics from the tutorial and one card per MVP task type; Cooking selected. Its art is a placeholder (own-work Delivery frames) until the art track's cards exist; the card holds as many frames as its task needs and scrolls sideways. |
| `settings-sound` | Звук і голос | Settings opens on Sound and voice. Drawn in the ship with no session, as the target page; in a session the same page sits under the session's tabs. Voice activation is selected, so the threshold row shows. The language is chosen only here, on Language. |
| `settings-controls` | Керування | Interact is capturing a key; Talk was rebound to M, so Talk and Map show Same key. The list scrolls. |
| `settings-display` | Екран | The window mode. |
| `settings-access` | Доступність | Large text and reduced motion. |
| `settings-language` | Мова | The game language, chosen only here; it applies at once. |
| `tutorial-game` | Навчання | The tutorial's menu: only Game, Guide and Settings; Leave goes back to the ship. |

## Node tree in `ship`

- **Dim** `Panel` · variation `ToyBackdropDeep` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both
  - Note: Dims the running game behind the menu.
- **Menu** `PanelContainer` · variation `ToyPanelMenu` · anchors `center`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (1200, 780)
  - Note: One fixed size for every tab (1200x780, agent), so switching tabs never moves the tile: the target's 990 px wide tile holds its two tabs, a session's five tabs need more at large text, and Character's 456x608 preview sets the height.
  - **V** `VBoxContainer` · variation `ToyColumnTwentyFour` · gaps from the variation: separation 24
    - **Strip** `PanelContainer` · variation `ToyTabStrip`
      - Note: ui-2.1.0 (the target page's .tabs): the tabs in one row on the strip, its 2 px edge line under them; the chosen tab light over the accent underline (ToyTabSelected); the small Esc keycap at the right closes the menu.
      - **Tabs** `HBoxContainer` · variation `ToyRowFour` · gaps from the variation: separation 4
        - Note: One ButtonGroup; the selected tab shows its page. With no session (the ship): Find a lobby and Settings. In the lobby: Game, Guide, Character, Settings. In a round: Game, Role, Guide, Character, Settings. In the tutorial: Game, Guide, Settings. Default tab: Game (named Find a lobby with no session); the last tab is kept for the session. Opening the menu grabs no focus, so the mouse's view draws no ring: the first ui_left, ui_right, ui_up, ui_down or ui_focus_next grabs focus on the selected tab (keyboard and gamepad then draw the ring, ship-keys).
        - **Game** `Button` · variation `ToyTab` · text `esc.tab.find`: en "Find a lobby" · uk "Знайти лобі" · toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`)
          - Note: One tab, two names: esc.tab.find («Знайти лобі», the engineer's word, 2026-10-22) while there is no session, esc.tab.game in a session; the game swaps the key when a session starts or ends.
        - **Settings** `Button` · variation `ToyTab` · text `esc.tab.settings`: en "Settings" · uk "Налаштування" · toggle_mode true, button_pressed false
        - **Gap** `Control` · size flags horizontal `SIZE_EXPAND_FILL`
          - Note: Pushes the Esc keycap to the right end of the strip.
        - **Esc** `PanelContainer` · variation `ToyKeyQuiet` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (42, 0) = Vector2(get_theme_constant("min_width", "ToyKeyQuiet"), 0)
          - Note: The key that closes the menu, shown small (the target); its name is the bound key from the InputMap (data, not a copy key).
          - **Text** `Label` · variation `ToyKeyQuietText` · text from data (auto_translate_mode = DISABLED), sample: "Esc"
    - **Page** `VBoxContainer` · variation `ToyColumnTwentyFour` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_EXPAND_FILL` · gaps from the variation: separation 24
      - Note: The selected tab's page; no title row (the chosen tab already names the page).
      - **Find** `VBoxContainer` · variation `ToyColumnSixteen` · size flags vertical `SIZE_EXPAND_FILL` · gaps from the variation: separation 16
        - Note: The Game page while there is no session, its tab named esc.tab.find, as the target page's «Знайти лобі»: the list area at the left, the code entry at its right, the footer row under the hairline. There is no server browser yet: Host makes a game with a code, the code entry takes a code, Join by address joins or hosts directly (LAN, VPN). The jobs of the removed start screen (s2, #111; prime-game#1285).
        - **Body** `PanelContainer` · variation `ToySettingRow` · size flags vertical `SIZE_EXPAND_FILL`
          - Note: The page's body over the footer row: ToySettingRow draws only its bottom hairline, the target's line between the body and the footer (.mf).
          - **H** `HBoxContainer` · variation `ToyRowTwentyFour` · gaps from the variation: separation 24
            - **Nearby** `VBoxContainer` · variation `ToyColumnTwelve` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_BEGIN` · gaps from the variation: separation 12
              - Note: The lobbies nearby (the engineer, 2026-10-22: needed; the game's discovery is prime-game#1316), as the target's list (.lst): the head in small capitals, the rows, Join under them at the right. What "nearby" means (LAN discovery, public lobbies) is the game's; the list is the same either way. It refreshes while the tab is open; a lobby that goes away leaves its row.
              - **Head** `Label` · variation `ToyKicker` · text `find.nearby`: en "Lobbies nearby" · uk "Лобі поруч"
                - Note: The tile head in small capitals (uppercase = true).
              - **List** `VBoxContainer` · variation `ToyColumnEight` · gaps from the variation: separation 8
                - Note: Rows 8 px apart; the first lobby found is chosen when the tab opens. A long list scrolls (a ScrollContainer at the page's height; three rows here).
                - **Glorp** `Button` · variation `ToyPresetCard` · custom_minimum_size (0, 60) · no text or icon: its child is its content, drawn in its StyleBox content rect (the child and every node inside ignore the mouse, so the Button takes the press); a Button's minimum size does not follow its children, so custom_minimum_size holds the content at large text · toggle_mode true, button_pressed true (ToyToggle draws `ToyPresetCardSelected`)
                  - Note: One row per lobby found nearby, built from the discovery's list (prime-game#1316): ToyPresetCard, a toggle in one ButtonGroup with the other rows; the chosen one draws ToyPresetCardSelected (the target's accent edge). Its content (no text of its own) is a row: the lobby's name, its players and the latency. A Button's minimum size does not follow its children: custom_minimum_size holds the row at 60 (the target's 40 x 1.5). Double click = Join.
                  - **H** `HBoxContainer` · variation `ToyRowTwelve` · the Button's content: anchors `full_rect`, offsets 16, 16, -16, -16 (the `normal` StyleBox's content margins), mouse_filter `MOUSE_FILTER_IGNORE` on it and every node inside · gaps from the variation: separation 12
                    - **Name** `Label` · variation `ToyPresetCardName` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `lobby.default_name` with sample {name} = "Glorp" / "Ґлорп": en "Glorp's lobby" · uk "Лобі: Ґлорп" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
                    - **Count** `Label` · variation `ToyPresetCardName` · size flags vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "6 / 10"
                      - Note: Players of the maximum (data, auto_translate_mode DISABLED), as the target's «6 / 10».
                    - **Ping** `Label` · variation `ToyPresetCardNoteSelected` · size flags vertical `SIZE_SHRINK_CENTER` · text `unit.ms` with sample {count} = "24": en "24 ms" · uk "24 мс"
                      - Note: The latency to the lobby's host, in whole ms.
                - **Zinga** `Button` · variation `ToyPresetCard` · custom_minimum_size (0, 60) · no text or icon: its child is its content, drawn in its StyleBox content rect (the child and every node inside ignore the mouse, so the Button takes the press); a Button's minimum size does not follow its children, so custom_minimum_size holds the content at large text · toggle_mode true, button_pressed false
                  - Note: As the first row, not chosen.
                  - **H** `HBoxContainer` · variation `ToyRowTwelve` · the Button's content: anchors `full_rect`, offsets 16, 16, -16, -16 (the `normal` StyleBox's content margins), mouse_filter `MOUSE_FILTER_IGNORE` on it and every node inside · gaps from the variation: separation 12
                    - **Name** `Label` · variation `ToyPresetCardName` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `lobby.default_name` with sample {name} = "Zinga" / "Зінґа": en "Zinga's lobby" · uk "Лобі: Зінґа" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
                    - **Count** `Label` · variation `ToyPresetCardName` · size flags vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "3 / 10"
                      - Note: Players of the maximum (data, auto_translate_mode DISABLED), as the target's «6 / 10».
                    - **Ping** `Label` · variation `ToyPresetCardNote` · size flags vertical `SIZE_SHRINK_CENTER` · text `unit.ms` with sample {count} = "41": en "41 ms" · uk "41 мс"
                      - Note: The latency to the lobby's host, in whole ms.
                - **Bulk** `Button` · variation `ToyPresetCard` · custom_minimum_size (0, 60) · no text or icon: its child is its content, drawn in its StyleBox content rect (the child and every node inside ignore the mouse, so the Button takes the press); a Button's minimum size does not follow its children, so custom_minimum_size holds the content at large text · toggle_mode true, button_pressed false · disabled true
                  - Note: A full lobby: disabled (it cannot be chosen), its name dim and «Лобі заповнене.» in place of the players and the latency, as the target's muted row.
                  - **H** `HBoxContainer` · variation `ToyRowTwelve` · the Button's content: anchors `full_rect`, offsets 16, 16, -16, -16 (the `normal` StyleBox's content margins), mouse_filter `MOUSE_FILTER_IGNORE` on it and every node inside · gaps from the variation: separation 12
                    - **Name** `Label` · variation `ToyPresetCardNote` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `lobby.default_name` with sample {name} = "Bulk" / "Бульк": en "Bulk's lobby" · uk "Лобі: Бульк" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
                    - **Full** `Label` · variation `ToyPresetCardNote` · size flags vertical `SIZE_SHRINK_CENTER` · text `connect.fail.full`: en "The lobby is full." · uk "Лобі заповнене."
              - **Join** `Button` · variation `ToyButtonPrimary` · size flags horizontal `SIZE_SHRINK_END` · text `join.connect`: en "Join" · uk "Приєднатися"
                - Note: Joins the chosen lobby: s3 (the connecting steps). The target's filled Join under the list; the code entry's Join stays outlined. Disabled while no row is chosen.
            - **Code** `VBoxContainer` · variation `ToyColumnTwelve` · size flags vertical `SIZE_SHRINK_BEGIN` · custom_minimum_size (420, 0) · gaps from the variation: separation 12
              - Note: Join with a code: the target's code entry (.jn), a small-capitals head over the field and Join under it. 420 px holds «Приєднатися за адресою»'s column in ship-direct, so the column keeps one width.
              - **Head** `Label` · variation `ToyKicker` · text `common.code`: en "Code" · uk "Код"
                - Note: The tile head in small capitals: the game sets uppercase = true on this Label (the pack's uppercase member).
              - **Field** `LineEdit` · variation `ToyField` · empty (no text, no placeholder) · context_menu_enabled false (Godot's right-click menu would show untranslated English labels; see the notes)
                - Note: Empty until typed (ship). max_length 6; upper-cases as typed, drops spaces and dashes on paste, accepts only the 31-letter code alphabet (no 0, O, 1, I, L). Keeps what was typed after a failure (back from s3). Enter = Join when it is enabled. auto_translate_mode DISABLED. A click focuses it (the caret shows); the menu does not grab focus for it on open.
              - **Join** `Button` · variation `ToyButtonSecondary` · text `join.connect`: en "Join" · uk "Приєднатися" · disabled true
                - Note: The target's outlined Join. Disabled (unplugged) until the field holds 6 valid characters. Joins by the code: s3 finding. ship-keys: reached with the keyboard, it draws the focus ring.
        - **Foot** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
          - Note: The target's footer row (.mf): your own code with Copy at the left, then the quiet jobs as ghost buttons, Quit the game at the right, where the target has «Вийти з гри».
          - **YourCode** `Label` · variation `ToyTextMutedOnLight` · size flags vertical `SIZE_SHRINK_CENTER` · text `find.your_code`: en "Your code" · uk "Твій код"
            - Note: Your own code, to call friends into your ship (the target's «Твій код»). Whether every ship listens with a code while there is no session is the game's (prime-game#1316); while there is none, the three nodes hide.
          - **CodeValue** `Label` · variation `ToyTextOnLight` · size flags vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "MD4WXT"
            - Note: The own code (auto_translate_mode DISABLED); «…» while the code service has not made it yet.
          - **Copy** `Button` · variation `ToyButtonSecondary` · text `esc.lobby.copy`: en "Copy" · uk "Копіювати"
            - Note: Copies the code to the clipboard; the button reads esc.lobby.copied for 2 s (as on the session's Game page).
          - **Host** `Button` · variation `ToyButtonGhostOnLight` · text `menu.host`: en "Host a game" · uk "Створити гру"
            - Note: Hosts a game with a code (WebRTC): the ship becomes the lobby (s4); the menu, opened again, shows the session's tabs; a failure shows s3 host-failed. The code is on the ship console (s4).
          - **Direct** `Button` · variation `ToyButtonGhostOnLight` · text `menu.direct`: en "Join by address" · uk "Приєднатися за адресою" · toggle_mode true, button_pressed false
            - Note: button_pressed while the address entry is open (the ghost's pressed StyleBox); pressing it again, Back or Esc (ui_cancel) closes it (Esc with nothing open closes the menu).
          - **Tutorial** `Button` · variation `ToyButtonGhostOnLight` · text `menu.tutorial`: en "Tutorial" · uk "Навчання"
            - Note: Loads the tutorial's first lesson (s1); its end returns to the ship.
          - **Gap** `Control` · size flags horizontal `SIZE_EXPAND_FILL`
            - Note: Pushes Quit to the right end of the footer.
          - **Quit** `Button` · variation `ToyButtonGhostOnLight` · text `esc.game.quit`: en "Quit the game" · uk "Вийти з гри"
            - Note: Quits the game at once (no session to end).

## `ship-empty`: what differs from `ship`

- **Hidden:** `Menu/V/Page/Find/Body/H/Nearby/List`, `Menu/V/Page/Find/Body/H/Nearby/Join`.
- **Shown:**
  - **Menu/V/Page/Find/Body/H/Nearby/None** `Label` · variation `ToyTextMutedOnLight` · text `find.none`: en "No lobbies nearby" · uk "Поруч лобі немає"
    - Note: No lobby found nearby: one quiet line in the list's place, and no Join. It stays until a lobby appears.

## `ship-code`: what differs from `ship`

- **Changed** `Menu/V/Page/Find/Body/H/Code/Field`: text (sample data) "K7Q2XR" (was: empty (no text, no placeholder))
- **Changed** `Menu/V/Page/Find/Body/H/Code/Join`: no longer disabled true

## `ship-keys`: what differs from `ship`

- **Changed** `Menu/V/Page/Find/Body/H/Code/Field`: text (sample data) "K7Q2XR" (was: empty (no text, no placeholder))
- **Changed** `Menu/V/Page/Find/Body/H/Code/Join`: shown with keyboard focus (grab_focus) (was: disabled true)

## `ship-direct`: what differs from `ship`

- **Hidden:** `Menu/V/Page/Find/Body/H/Code`.
- **Changed** `Menu/V/Page/Find/Foot/Direct`: toggle_mode true, button_pressed true (its own `pressed` StyleBox; the variation has no toggle partner) (was: toggle_mode true, button_pressed false)
- **Shown:**
  - **Menu/V/Page/Find/Body/H/Address** `VBoxContainer` · variation `ToyColumnTwelve` · size flags vertical `SIZE_SHRINK_BEGIN` · custom_minimum_size (420, 0) · gaps from the variation: separation 12
    - Note: Join or host directly over ENet (LAN, VPN, playit.gg), in the code entry's place while Join by address is pressed. No address is shown anywhere else (streams).
    - **Head** `Label` · variation `ToyKicker` · text `join.address`: en "Host address" · uk "Адреса хоста"
      - Note: The tile head in small capitals (uppercase = true).
    - **Field** `LineEdit` · variation `ToyField` · text (sample data) "192.168.0.12" · context_menu_enabled false (Godot's right-click menu would show untranslated English labels; see the notes)
      - Note: Takes host or host:port, host names included (JoinTarget). Keeps what was typed after a failure. Enter = Join. auto_translate_mode DISABLED.
    - **Port** `Label` · variation `ToyTextMutedOnLight` · text `join.port` with sample {port} = "7777": en "Port 7777" · uk "Порт 7777"
      - Note: The default port, used when the address has none.
    - **Buttons** `VBoxContainer` · variation `ToyColumnTwelve` · gaps from the variation: separation 12
      - **Join** `Button` · variation `ToyButtonSecondary` · text `join.connect`: en "Join" · uk "Приєднатися"
        - Note: Disabled (unplugged) while Address is empty. Joins over ENet: s3 (the connecting steps, no code row).
      - **Host** `Button` · variation `ToyButtonSecondary` · text `menu.host`: en "Host a game" · uk "Створити гру"
        - Note: Hosts directly (ENet) on the port typed, else the default; the ship becomes the lobby (s4) with no code row.
      - **Back** `Button` · variation `ToyButtonGhostOnLight` · text `common.back`: en "Back" · uk "Назад"
        - Note: Closes the address entry and unpresses Join by address (the code entry comes back); Esc does the same.

## `character`: what differs from `ship`

- **Hidden:** `Menu/V/Page/Find`.
- **Changed** `Menu/V/Strip/Tabs/Game`: text `esc.tab.game`: en "Game" · uk "Гра" · toggle_mode true, button_pressed false (was: text `esc.tab.find`: en "Find a lobby" · uk "Знайти лобі" · toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`))
- **Shown:**
  - **Menu/V/Strip/Tabs/Guide** `Button` · variation `ToyTab` · text `esc.tab.guide`: en "Guide" · uk "Посібник" · toggle_mode true, button_pressed false
    - Note: In a session only.
  - **Menu/V/Strip/Tabs/Character** `Button` · variation `ToyTab` · text `esc.tab.character`: en "Character" · uk "Персонаж" · toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`)
    - Note: In a session (not the tutorial); changes apply live in the lobby.
  - **Menu/V/Page/Character** `HBoxContainer` · variation `ToyRowThirtyTwo` · gaps from the variation: separation 32
    - **Preview** `PanelContainer` · variation `ToyHowtoFrame` · custom_minimum_size (456, 608)
      - Note: In the game: SubViewportContainer (stretch true) · min 456×608 with a SubViewport showing the own character; the page draws a ToyHowtoFrame placeholder.
    - **Form** `VBoxContainer` · variation `ToyColumnFour` · size flags horizontal `SIZE_EXPAND_FILL` · gaps from the variation: separation 4
      - Note: Changes apply live in the lobby. The Hat row (esc.character.hat) stays hidden until hats exist.
      - **NameRow** `PanelContainer` · variation `ToySettingRow`
        - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
          - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `player.name`: en "Name" · uk "Імʼя"
          - **Field** `LineEdit` · variation `ToyField` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (345, 0) · text (sample data) "Olena" / "Олена" · context_menu_enabled false (Godot's right-click menu would show untranslated English labels; see the notes)
            - Note: The player's name, kept between sessions; auto_translate_mode DISABLED. editable false in a round.
      - **ColourRow** `PanelContainer` · variation `ToySettingRow`
        - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
          - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `esc.character.colour`: en "Colour" · uk "Колір"
          - **Swatches** `GridContainer` · variation `ToyGridSwatch` · size flags vertical `SIZE_SHRINK_CENTER` · gaps from the variation: h_separation 12, v_separation 12 · columns 5
            - Note: The ten body colours (#255; the palette is not decided yet).
            - **Swatch1** `Control` · custom_minimum_size (60, 60)
              - Note: In the game: TextureButton · toggle_mode · one ButtonGroup · 60×60 (focus_mode ALL in the lobby, NONE in a round; mouse_filter IGNORE in a round). The disc is tinted with the body colour (content data, #255; the page's colours are samples only). Keyboard and gamepad focus shows ToySwatchFocus, a Panel over the swatch (mouse_filter IGNORE), visible while it has focus; the frames show the mouse's view, so no swatch is drawn focused.
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

- **Hidden:** `Menu/V/Page/Find`.
- **Changed** `Menu/V/Strip/Tabs/Game`: text `esc.tab.game`: en "Game" · uk "Гра" · toggle_mode true, button_pressed false (was: text `esc.tab.find`: en "Find a lobby" · uk "Знайти лобі" · toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`))
- **Shown:**
  - **Menu/V/Strip/Tabs/Role** `Button` · variation `ToyTab` · text `esc.tab.role`: en "Role" · uk "Роль" · toggle_mode true, button_pressed false
    - Note: In a round only.
  - **Menu/V/Strip/Tabs/Guide** `Button` · variation `ToyTab` · text `esc.tab.guide`: en "Guide" · uk "Посібник" · toggle_mode true, button_pressed false
    - Note: In a session only.
  - **Menu/V/Strip/Tabs/Character** `Button` · variation `ToyTab` · text `esc.tab.character`: en "Character" · uk "Персонаж" · toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`)
    - Note: In a session (not the tutorial); changes apply live in the lobby.
  - **Menu/V/Page/Character** `HBoxContainer` · variation `ToyRowThirtyTwo` · gaps from the variation: separation 32
    - **Preview** `PanelContainer` · variation `ToyHowtoFrame` · custom_minimum_size (456, 608)
      - Note: In the game: SubViewportContainer (stretch true) · min 456×608 with a SubViewport showing the own character; the page draws a ToyHowtoFrame placeholder.
    - **Form** `VBoxContainer` · variation `ToyColumnFour` · size flags horizontal `SIZE_EXPAND_FILL` · gaps from the variation: separation 4
      - Note: Changes apply live in the lobby. The Hat row (esc.character.hat) stays hidden until hats exist.
      - **NameRow** `PanelContainer` · variation `ToySettingRow`
        - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
          - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `player.name`: en "Name" · uk "Імʼя"
          - **Field** `LineEdit` · variation `ToyField` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (345, 0) · text (sample data) "Olena" / "Олена" · editable false · context_menu_enabled false (Godot's right-click menu would show untranslated English labels; see the notes)
            - Note: The player's name, kept between sessions; auto_translate_mode DISABLED. editable false in a round.
      - **ColourRow** `PanelContainer` · variation `ToySettingRow`
        - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
          - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `esc.character.colour`: en "Colour" · uk "Колір"
          - **Swatches** `GridContainer` · variation `ToyGridSwatch` · size flags vertical `SIZE_SHRINK_CENTER` · gaps from the variation: h_separation 12, v_separation 12 · columns 5
            - Note: The ten body colours (#255; the palette is not decided yet).
            - **Swatch1** `Control` · custom_minimum_size (60, 60)
              - Note: In the game: TextureButton · toggle_mode · one ButtonGroup · 60×60 (focus_mode ALL in the lobby, NONE in a round; mouse_filter IGNORE in a round). The disc is tinted with the body colour (content data, #255; the page's colours are samples only). Keyboard and gamepad focus shows ToySwatchFocus, a Panel over the swatch (mouse_filter IGNORE), visible while it has focus; the frames show the mouse's view, so no swatch is drawn focused.
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
      - **Gap** `Control` · custom_minimum_size (0, 12)
        - Note: A spacer: 4 + 12 + 12 = 28 px between the rows and the lock line.
      - **Locked** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
        - Note: In a round the tab is locked: the lock line under the rows, the rows keep their place.
        - **Lock** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (30, 30) · texture `lock` (dist/pack/icons/lock.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToyTextMutedOnLight")
        - **Text** `Label` · variation `ToyTextMutedOnLight` · text `esc.character.locked`: en "You can change this only in the lobby" · uk "Змінювати можна лише в лобі"

## `game-host`: what differs from `ship`

- **Hidden:** `Menu/V/Page/Find`.
- **Changed** `Menu/V/Strip/Tabs/Game`: text `esc.tab.game`: en "Game" · uk "Гра" (was: text `esc.tab.find`: en "Find a lobby" · uk "Знайти лобі")
- **Shown:**
  - **Menu/V/Strip/Tabs/Role** `Button` · variation `ToyTab` · text `esc.tab.role`: en "Role" · uk "Роль" · toggle_mode true, button_pressed false
    - Note: In a round only.
  - **Menu/V/Strip/Tabs/Guide** `Button` · variation `ToyTab` · text `esc.tab.guide`: en "Guide" · uk "Посібник" · toggle_mode true, button_pressed false
    - Note: In a session only.
  - **Menu/V/Strip/Tabs/Character** `Button` · variation `ToyTab` · text `esc.tab.character`: en "Character" · uk "Персонаж" · toggle_mode true, button_pressed false
    - Note: In a session (not the tutorial); changes apply live in the lobby.
  - **Menu/V/Page/Game** `VBoxContainer` · variation `ToyColumnSixteen` · size flags vertical `SIZE_EXPAND_FILL` · gaps from the variation: separation 16
    - Note: The Game page in a session, built as Find a lobby: the body over the hairline with Resume, the footer row with Leave at the left and Quit at the right (where the target has «Вийти з гри»).
    - **Body** `PanelContainer` · variation `ToySettingRow` · size flags vertical `SIZE_EXPAND_FILL`
      - Note: The body over the footer row; ToySettingRow draws only its bottom hairline.
      - **V** `VBoxContainer`
        - **Resume** `Button` · variation `ToyButtonPrimary` · size flags horizontal `SIZE_SHRINK_BEGIN` · text `esc.game.resume`: en "Resume" · uk "Продовжити"
          - Note: Closes the menu (as Esc).
    - **Foot** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
      - **Inset** `Control` · custom_minimum_size (6, 0)
        - Note: A spacer: 6 + 12 = 18 px, so Leave lines up with Resume inside the body row (ToySettingRow keeps 18 px at its sides).
      - **Leave** `Button` · variation `ToyButtonSecondary` · text `esc.game.leave`: en "Leave the session" · uk "Покинути сесію"
        - Note: Everyone: the outlined secondary, so the menu stays calm. The host: opens the confirm dialog, whose Confirm is the danger button. A player: leaves at once. In the tutorial: esc.game.leave_tutorial, back to the ship. Leaving a session returns the player to the ship (s5 ship).
      - **Gap** `Control` · size flags horizontal `SIZE_EXPAND_FILL`
        - Note: Pushes Quit to the right end of the footer.
      - **Quit** `Button` · variation `ToyButtonGhostOnLight` · text `esc.game.quit`: en "Quit the game" · uk "Вийти з гри"
        - Note: The host: opens the confirm dialog (esc.game.quit_confirm, Confirm esc.game.quit). A player, and in the tutorial: quits at once.

## `game-guest`: what differs from `ship`

- **Hidden:** `Menu/V/Page/Find`.
- **Changed** `Menu/V/Strip/Tabs/Game`: text `esc.tab.game`: en "Game" · uk "Гра" (was: text `esc.tab.find`: en "Find a lobby" · uk "Знайти лобі")
- **Shown:**
  - **Menu/V/Strip/Tabs/Role** `Button` · variation `ToyTab` · text `esc.tab.role`: en "Role" · uk "Роль" · toggle_mode true, button_pressed false
    - Note: In a round only.
  - **Menu/V/Strip/Tabs/Guide** `Button` · variation `ToyTab` · text `esc.tab.guide`: en "Guide" · uk "Посібник" · toggle_mode true, button_pressed false
    - Note: In a session only.
  - **Menu/V/Strip/Tabs/Character** `Button` · variation `ToyTab` · text `esc.tab.character`: en "Character" · uk "Персонаж" · toggle_mode true, button_pressed false
    - Note: In a session (not the tutorial); changes apply live in the lobby.
  - **Menu/V/Page/Game** `VBoxContainer` · variation `ToyColumnSixteen` · size flags vertical `SIZE_EXPAND_FILL` · gaps from the variation: separation 16
    - Note: The Game page in a session, built as Find a lobby: the body over the hairline with Resume, the footer row with Leave at the left and Quit at the right (where the target has «Вийти з гри»).
    - **Body** `PanelContainer` · variation `ToySettingRow` · size flags vertical `SIZE_EXPAND_FILL`
      - Note: The body over the footer row; ToySettingRow draws only its bottom hairline.
      - **V** `VBoxContainer`
        - **Resume** `Button` · variation `ToyButtonPrimary` · size flags horizontal `SIZE_SHRINK_BEGIN` · text `esc.game.resume`: en "Resume" · uk "Продовжити"
          - Note: Closes the menu (as Esc).
    - **Foot** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
      - **Inset** `Control` · custom_minimum_size (6, 0)
        - Note: A spacer: 6 + 12 = 18 px, so Leave lines up with Resume inside the body row (ToySettingRow keeps 18 px at its sides).
      - **Leave** `Button` · variation `ToyButtonSecondary` · text `esc.game.leave`: en "Leave the session" · uk "Покинути сесію"
        - Note: Everyone: the outlined secondary, so the menu stays calm. The host: opens the confirm dialog, whose Confirm is the danger button. A player: leaves at once. In the tutorial: esc.game.leave_tutorial, back to the ship. Leaving a session returns the player to the ship (s5 ship).
      - **Gap** `Control` · size flags horizontal `SIZE_EXPAND_FILL`
        - Note: Pushes Quit to the right end of the footer.
      - **Quit** `Button` · variation `ToyButtonGhostOnLight` · text `esc.game.quit`: en "Quit the game" · uk "Вийти з гри"
        - Note: The host: opens the confirm dialog (esc.game.quit_confirm, Confirm esc.game.quit). A player, and in the tutorial: quits at once.

## `game-confirm`: what differs from `ship`

- **Hidden:** `Menu/V/Page/Find`.
- **Changed** `Menu/V/Strip/Tabs/Game`: text `esc.tab.game`: en "Game" · uk "Гра" (was: text `esc.tab.find`: en "Find a lobby" · uk "Знайти лобі")
- **Shown:**
  - **Menu/V/Strip/Tabs/Role** `Button` · variation `ToyTab` · text `esc.tab.role`: en "Role" · uk "Роль" · toggle_mode true, button_pressed false
    - Note: In a round only.
  - **Menu/V/Strip/Tabs/Guide** `Button` · variation `ToyTab` · text `esc.tab.guide`: en "Guide" · uk "Посібник" · toggle_mode true, button_pressed false
    - Note: In a session only.
  - **Menu/V/Strip/Tabs/Character** `Button` · variation `ToyTab` · text `esc.tab.character`: en "Character" · uk "Персонаж" · toggle_mode true, button_pressed false
    - Note: In a session (not the tutorial); changes apply live in the lobby.
  - **Menu/V/Page/Game** `VBoxContainer` · variation `ToyColumnSixteen` · size flags vertical `SIZE_EXPAND_FILL` · gaps from the variation: separation 16
    - Note: The Game page in a session, built as Find a lobby: the body over the hairline with Resume, the footer row with Leave at the left and Quit at the right (where the target has «Вийти з гри»).
    - **Body** `PanelContainer` · variation `ToySettingRow` · size flags vertical `SIZE_EXPAND_FILL`
      - Note: The body over the footer row; ToySettingRow draws only its bottom hairline.
      - **V** `VBoxContainer`
        - **Resume** `Button` · variation `ToyButtonPrimary` · size flags horizontal `SIZE_SHRINK_BEGIN` · text `esc.game.resume`: en "Resume" · uk "Продовжити"
          - Note: Closes the menu (as Esc).
    - **Foot** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
      - **Inset** `Control` · custom_minimum_size (6, 0)
        - Note: A spacer: 6 + 12 = 18 px, so Leave lines up with Resume inside the body row (ToySettingRow keeps 18 px at its sides).
      - **Leave** `Button` · variation `ToyButtonSecondary` · text `esc.game.leave`: en "Leave the session" · uk "Покинути сесію"
        - Note: Everyone: the outlined secondary, so the menu stays calm. The host: opens the confirm dialog, whose Confirm is the danger button. A player: leaves at once. In the tutorial: esc.game.leave_tutorial, back to the ship. Leaving a session returns the player to the ship (s5 ship).
      - **Gap** `Control` · size flags horizontal `SIZE_EXPAND_FILL`
        - Note: Pushes Quit to the right end of the footer.
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
        - **Cancel** `Button` · variation `ToyButtonGhostOnLight` · text `common.cancel`: en "Cancel" · uk "Скасувати"
          - Note: Takes focus when the dialog was opened with the keyboard or a gamepad (it then draws the ring); opened with the mouse, nothing grabs focus. Closes the dialog.

## `role-alien`: what differs from `ship`

- **Hidden:** `Menu/V/Page/Find`.
- **Changed** `Menu/V/Strip/Tabs/Game`: text `esc.tab.game`: en "Game" · uk "Гра" · toggle_mode true, button_pressed false (was: text `esc.tab.find`: en "Find a lobby" · uk "Знайти лобі" · toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`))
- **Shown:**
  - **Menu/V/Strip/Tabs/Role** `Button` · variation `ToyTab` · text `esc.tab.role`: en "Role" · uk "Роль" · toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`)
    - Note: In a round only.
  - **Menu/V/Strip/Tabs/Guide** `Button` · variation `ToyTab` · text `esc.tab.guide`: en "Guide" · uk "Посібник" · toggle_mode true, button_pressed false
    - Note: In a session only.
  - **Menu/V/Strip/Tabs/Character** `Button` · variation `ToyTab` · text `esc.tab.character`: en "Character" · uk "Персонаж" · toggle_mode true, button_pressed false
    - Note: In a session (not the tutorial); changes apply live in the lobby.
  - **Menu/V/Page/Role** `HBoxContainer` · variation `ToyRowThirtyTwo` · gaps from the variation: separation 32
    - Note: Reads only the own role and, for a human, the other humans.
    - **Left** `VBoxContainer` · variation `ToyColumnTwelve` · size flags horizontal `SIZE_EXPAND_FILL`, stretch_ratio 1.1 · gaps from the variation: separation 12
      - **You** `Label` · variation `ToyKicker` · text `player.you`: en "You" · uk "Ти"
        - Note: A small-capitals head (uppercase = true) over the own side.
      - **Role** `Label` · variation `ToyDisplayOnLight` · text `role.alien`: en "Alien" · uk "Прибулець"
        - Note: The own side at the display size: ToyDisplayOnLight (the accent) with role.alien, ToyDisplayAlertOnLight (the danger colour) with role.human, as in s6 and s7.
      - **Goal** `Label` · variation `ToyTextOnLight` · custom_minimum_size (560, 0) · text `role.goal.alien`: en "Throw the best party: finish every task before time runs out and the cops arrive." · uk "Влаштуй найкращу вечірку: виконай усі задачі, поки не скінчився час і не приїхали копи." · autowrap_mode `AUTOWRAP_WORD_SMART`

## `role-human`: what differs from `ship`

- **Hidden:** `Menu/V/Page/Find`.
- **Changed** `Menu/V/Strip/Tabs/Game`: text `esc.tab.game`: en "Game" · uk "Гра" · toggle_mode true, button_pressed false (was: text `esc.tab.find`: en "Find a lobby" · uk "Знайти лобі" · toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`))
- **Shown:**
  - **Menu/V/Strip/Tabs/Role** `Button` · variation `ToyTab` · text `esc.tab.role`: en "Role" · uk "Роль" · toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`)
    - Note: In a round only.
  - **Menu/V/Strip/Tabs/Guide** `Button` · variation `ToyTab` · text `esc.tab.guide`: en "Guide" · uk "Посібник" · toggle_mode true, button_pressed false
    - Note: In a session only.
  - **Menu/V/Strip/Tabs/Character** `Button` · variation `ToyTab` · text `esc.tab.character`: en "Character" · uk "Персонаж" · toggle_mode true, button_pressed false
    - Note: In a session (not the tutorial); changes apply live in the lobby.
  - **Menu/V/Page/Role** `HBoxContainer` · variation `ToyRowThirtyTwo` · gaps from the variation: separation 32
    - Note: Reads only the own role and, for a human, the other humans.
    - **Left** `VBoxContainer` · variation `ToyColumnTwelve` · size flags horizontal `SIZE_EXPAND_FILL`, stretch_ratio 1.1 · gaps from the variation: separation 12
      - **You** `Label` · variation `ToyKicker` · text `player.you`: en "You" · uk "Ти"
        - Note: A small-capitals head (uppercase = true) over the own side.
      - **Role** `Label` · variation `ToyDisplayAlertOnLight` · text `role.human`: en "Human" · uk "Людина"
        - Note: The own side at the display size: ToyDisplayOnLight (the accent) with role.alien, ToyDisplayAlertOnLight (the danger colour) with role.human, as in s6 and s7.
      - **Goal** `Label` · variation `ToyTextOnLight` · custom_minimum_size (560, 0) · text `role.goal.human`: en "You're a human in an alien mask. Ruin the party: run out the clock or anger the neighbours until the cops come." · uk "Ти людина під маскою прибульця. Зіпсуй вечірку: протягни час або розлюти сусідів, щоб приїхали копи." · autowrap_mode `AUTOWRAP_WORD_SMART`
    - **Team** `VBoxContainer` · variation `ToyColumnTwelve` · size flags horizontal `SIZE_EXPAND_FILL` · gaps from the variation: separation 12
      - Note: Humans only (humans know each other: the engineer, 2026-10-20); hidden when there is no other human. Aliens see no list.
      - **Count** `Label` · variation `ToyKicker` · text `esc.role.teammates` with sample {count} = "1": en "Your team · 1" · uk "Твоя команда · 1"
        - Note: The number of the other humans (here one, Zinga, as in s6 and s7). A small-capitals head (uppercase = true).
      - **Scroll** `ScrollContainer` · variation `ToyScroll` · custom_minimum_size (0, 375) · the gap between the child and the bar from the variation: scrollbar_h_separation 8 · horizontal_scroll_mode `SCROLL_MODE_DISABLED` (vertical scrolling only); `get_v_scroll_bar().theme_type_variation = &"ToyScrollBar"`; the bar shows when the child is taller
        - Note: The view is 375 px tall; the list scrolls when it is longer.
        - **Rows** `VBoxContainer` · variation `ToyColumnFour` · size flags horizontal `SIZE_EXPAND_FILL` · gaps from the variation: separation 4
          - Note: One hairline row per other human, in join order; a long list scrolls in the 375 px view.
          - **Zinga** `PanelContainer` · variation `ToySettingRow`
            - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
              - **Mark** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (30, 30) · texture `teammate-mark` (dist/pack/icons/teammate-mark.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToySettingRowText")
              - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Zinga" / "Зінга" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
                - Note: The other human's name (auto_translate_mode DISABLED); a long name is cut with an ellipsis.

## `guide`: what differs from `ship`

- **Hidden:** `Menu/V/Page/Find`.
- **Changed** `Menu/V/Strip/Tabs/Game`: text `esc.tab.game`: en "Game" · uk "Гра" · toggle_mode true, button_pressed false (was: text `esc.tab.find`: en "Find a lobby" · uk "Знайти лобі" · toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`))
- **Shown:**
  - **Menu/V/Strip/Tabs/Role** `Button` · variation `ToyTab` · text `esc.tab.role`: en "Role" · uk "Роль" · toggle_mode true, button_pressed false
    - Note: In a round only.
  - **Menu/V/Strip/Tabs/Guide** `Button` · variation `ToyTab` · text `esc.tab.guide`: en "Guide" · uk "Посібник" · toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`)
    - Note: In a session only.
  - **Menu/V/Strip/Tabs/Character** `Button` · variation `ToyTab` · text `esc.tab.character`: en "Character" · uk "Персонаж" · toggle_mode true, button_pressed false
    - Note: In a session (not the tutorial); changes apply live in the lobby.
  - **Menu/V/Page/Guide** `HBoxContainer` · variation `ToyRowThirtyTwo` · size flags vertical `SIZE_EXPAND_FILL` · gaps from the variation: separation 32
    - **List** `ScrollContainer` · variation `ToyScroll` · custom_minimum_size (360, 0) · the gap between the child and the bar from the variation: scrollbar_h_separation 8 · horizontal_scroll_mode `SCROLL_MODE_DISABLED` (vertical scrolling only); `get_v_scroll_bar().theme_type_variation = &"ToyScrollBar"`; the bar shows when the child is taller
      - Note: Fills the page height. follow_focus = true, so keyboard and gamepad focus scrolls the topic in view. 360 px holds the longest topic at large text.
      - **V** `VBoxContainer` · variation `ToyColumnFour` · size flags horizontal `SIZE_EXPAND_FILL` · gaps from the variation: separation 4
        - Note: One ButtonGroup over every topic, drawn as the settings' section list (the open topic shows the pressed row fill); a topic shows its card, headed with the topic's name. The MVP's new topics (points, mutations, the neighbours' anger, the cops, the dead's room) are open: their texts and cards are the engineer's.
        - **Basics** `Label` · variation `ToyKicker` · text `guide.basics`: en "Basics" · uk "Основи"
          - Note: A small-capitals head (uppercase = true).
        - **Moving** `Button` · variation `ToyMenuItem` · text `guide.moving`: en "Moving and hands" · uk "Рух і руки" · alignment `LEFT` · toggle_mode true, button_pressed false
          - Note: Card frames: tutorial.step.move.title, .pick_up.title, .put_down.title, .hand_belt.title.
        - **Voice** `Button` · variation `ToyMenuItem` · text `guide.voice`: en "Voice" · uk "Голос" · alignment `LEFT` · toggle_mode true, button_pressed false
          - Note: Card frames: tutorial.step.voice.title, tutorial.step.voice.how, tutorial.list.death.
        - **Downed** `Button` · variation `ToyMenuItem` · text `guide.downed`: en "Downed and back" · uk "Нокдаун і повернення" · alignment `LEFT` · toggle_mode true, button_pressed false
          - Note: Card frames: tutorial.step.downed.title, downed.give_up_hold, then the death frames: tutorial.step.dead_room.title, tutorial.step.dead_room.how (drafts; the dead wait in the dead's room, m8 §3).
        - **Gap** `Control` · custom_minimum_size (0, 16)
          - Note: A spacer: 4 + 16 + 4 = 24 px between the Downed row and the Tasks head.
        - **Tasks** `Label` · variation `ToyKicker` · text `guide.tasks`: en "Tasks" · uk "Задачі"
          - Note: A small-capitals head (uppercase = true).
        - **CarTuning** `Button` · variation `ToyMenuItem` · text `task.car_tuning`: en "Car tuning" · uk "Тюнінг авто" · alignment `LEFT` · toggle_mode true, button_pressed false
          - Note: The MVP's five task types (GDD §8, #1144), in the deck's order. Each card needs new wordless art (the card art quality bar); until the art track's cards exist every card shows the placeholder (own-work Delivery frames, dist/pack/cards/).
        - **Engine** `Button` · variation `ToyMenuItem` · text `task.engine`: en "Ship's engine" · uk "Двигун корабля" · alignment `LEFT` · toggle_mode true, button_pressed false
        - **Cooking** `Button` · variation `ToyMenuItem` · text `task.cooking`: en "Cooking" · uk "Готування" · alignment `LEFT` · toggle_mode true, button_pressed true (its own `pressed` StyleBox; the variation has no toggle partner)
        - **Photo** `Button` · variation `ToyMenuItem` · text `task.photo`: en "Photo" · uk "Фото" · alignment `LEFT` · toggle_mode true, button_pressed false
        - **Wifi** `Button` · variation `ToyMenuItem` · text `task.wifi`: en "Wi-Fi" · uk "Wi-Fi" · alignment `LEFT` · toggle_mode true, button_pressed false
    - **Card** `VBoxContainer` · variation `ToyColumnSixteen` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_BEGIN` · gaps from the variation: separation 16
      - Note: P8's how-to card without its own panel inside the menu's tile (the target draws no tile in a tile): the head, then the frames in one row that scroll sideways, as in s3 and s8, with 272 px art beside the topic list. A card is content data per task type (#254).
      - **Head** `VBoxContainer` · variation `ToyColumnEight` · gaps from the variation: separation 8
        - Note: The card's head as in s3 and s8: howto.label in small capitals over the open topic's name, so the card is the same in s3, s5 and s8.
        - **Note** `Label` · variation `ToyKicker` · text `howto.label`: en "How to" · uk "Як робити"
          - Note: The game sets uppercase = true.
        - **Title** `Label` · variation `ToyTitleOnLight` · text `task.cooking`: en "Cooking" · uk "Готування"
          - Note: The open topic's name (a basics topic shows its guide.* name).
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

- **Hidden:** `Menu/V/Page/Find`.
- **Changed** `Menu/V/Strip/Tabs/Game`: toggle_mode true, button_pressed false (was: toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`))
- **Changed** `Menu/V/Strip/Tabs/Settings`: toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`) (was: toggle_mode true, button_pressed false)
- **Shown:**
  - **Menu/V/Page/Settings** `HBoxContainer` · variation `ToyRowTwentyFour` · size flags vertical `SIZE_EXPAND_FILL` · gaps from the variation: separation 24
    - Note: One scene (#301), the target's settings page: the section list at the left, the section's hairline rows at the right. The mic, the mode, the threshold with its live meter, noise suppression and the volumes work without a session. Saved per player.
    - **Nav** `VBoxContainer` · variation `ToyColumnFour` · size flags vertical `SIZE_SHRINK_BEGIN` · custom_minimum_size (300, 0) · gaps from the variation: separation 4
      - Note: The section list (the target's .nav): one ButtonGroup of toggle rows; the open section shows the pressed row fill. Settings opens on Sound and voice. Up and down move the focus through the list; ui_right moves it into the rows. 300 px holds «Звук і голос» and «Accessibility» at large text.
      - **Sound** `Button` · variation `ToyMenuItem` · text `settings.tab.sound`: en "Sound and voice" · uk "Звук і голос" · alignment `LEFT` · toggle_mode true, button_pressed true (its own `pressed` StyleBox; the variation has no toggle partner)
        - Note: ToyMenuItem (the target's .nav item; a light-context variation since ui-2.2.0): dim idle text, the open section the pressed row fill with light text.
      - **Controls** `Button` · variation `ToyMenuItem` · text `settings.tab.controls`: en "Controls" · uk "Керування" · alignment `LEFT` · toggle_mode true, button_pressed false
      - **Display** `Button` · variation `ToyMenuItem` · text `settings.tab.display`: en "Display" · uk "Екран" · alignment `LEFT` · toggle_mode true, button_pressed false
      - **Access** `Button` · variation `ToyMenuItem` · text `settings.tab.accessibility`: en "Accessibility" · uk "Доступність" · alignment `LEFT` · toggle_mode true, button_pressed false
      - **Language** `Button` · variation `ToyMenuItem` · text `settings.tab.language`: en "Language" · uk "Мова" · alignment `LEFT` · toggle_mode true, button_pressed false
    - **Scroll** `ScrollContainer` · variation `ToyScroll` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_EXPAND_FILL` · the gap between the child and the bar from the variation: scrollbar_h_separation 8 · horizontal_scroll_mode `SCROLL_MODE_DISABLED` (vertical scrolling only); `get_v_scroll_bar().theme_type_variation = &"ToyScrollBar"`; the bar shows when the child is taller
      - Note: follow_focus = true, so keyboard and gamepad focus scrolls the focused row in view (the 15 keys of Controls, the volumes at large text). Spectating left the MVP (the dead wait in the dead's room), so its two keys are gone from Controls.
      - **Rows** `VBoxContainer` · variation `ToyColumnFour` · size flags horizontal `SIZE_EXPAND_FILL` · gaps from the variation: separation 4
        - Note: Hairline rows (ToySettingRow: the label at the left, the control at the row's right, a 2 px line under each), as the target's .sr; the pack has no zero-gap column, so 4 px stand between the rows. Every row is at least 88 px tall (a dropdown row's height), so the rows of every section keep one height.
        - **Overall** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 88)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `settings.game_volume`: en "Overall volume" · uk "Загальна гучність"
            - **Ctl** `HBoxContainer` · variation `ToyRowTwelve` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (345, 0) · gaps from the variation: separation 12
              - Note: The target's slider with its value at the right (.sld, .vv).
              - **Slider** `HSlider` · variation `ToySlider` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · value 55 (min_value 0, max_value 100, step 1)
                - Note: The Master bus, 0 to 100 %.
              - **Value** `Label` · variation `ToySettingRowValue` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (48, 0) · text from data (auto_translate_mode = DISABLED), sample: "55" · horizontal_alignment `RIGHT`
                - Note: str(value) (auto_translate_mode DISABLED), updated as the slider moves.
        - **Voices** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 88)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `settings.voice_volume`: en "Voice volume" · uk "Гучність голосів"
            - **Ctl** `HBoxContainer` · variation `ToyRowTwelve` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (345, 0) · gaps from the variation: separation 12
              - Note: The target's slider with its value at the right (.sld, .vv).
              - **Slider** `HSlider` · variation `ToySlider` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · value 70 (min_value 0, max_value 100, step 1)
                - Note: The voice bus, 0 to 100 %.
              - **Value** `Label` · variation `ToySettingRowValue` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (48, 0) · text from data (auto_translate_mode = DISABLED), sample: "70" · horizontal_alignment `RIGHT`
                - Note: str(value) (auto_translate_mode DISABLED), updated as the slider moves.
        - **Effects** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 88)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `settings.effects_volume`: en "Effects volume" · uk "Гучність ефектів"
            - **Ctl** `HBoxContainer` · variation `ToyRowTwelve` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (345, 0) · gaps from the variation: separation 12
              - Note: The target's slider with its value at the right (.sld, .vv).
              - **Slider** `HSlider` · variation `ToySlider` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · value 80 (min_value 0, max_value 100, step 1)
                - Note: The effects bus, 0 to 100 %.
              - **Value** `Label` · variation `ToySettingRowValue` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (48, 0) · text from data (auto_translate_mode = DISABLED), sample: "80" · horizontal_alignment `RIGHT`
                - Note: str(value) (auto_translate_mode DISABLED), updated as the slider moves.
        - **Music** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 88)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `settings.music_volume`: en "Music volume" · uk "Гучність музики"
            - **Ctl** `HBoxContainer` · variation `ToyRowTwelve` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (345, 0) · gaps from the variation: separation 12
              - Note: The target's slider with its value at the right (.sld, .vv).
              - **Slider** `HSlider` · variation `ToySlider` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · value 50 (min_value 0, max_value 100, step 1)
                - Note: The music bus, 0 to 100 %.
              - **Value** `Label` · variation `ToySettingRowValue` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (48, 0) · text from data (auto_translate_mode = DISABLED), sample: "50" · horizontal_alignment `RIGHT`
                - Note: str(value) (auto_translate_mode DISABLED), updated as the slider moves.
        - **TalkMode** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 88)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `settings.talk_mode`: en "How to talk" · uk "Як говорити"
            - **Mode** `OptionButton` · variation `ToyDropdown` · size flags vertical `SIZE_SHRINK_CENTER` · text `settings.talk_mode.open`: en "Voice activation" · uk "Голосова активація" · arrow: theme icon `arrow` (dist/pack/icons/chevron-down.svg), tinted by the font colour (modulate_arrow) · `get_popup().theme_type_variation = &"ToyDropdownList"` (its open list, see the notes) · items `settings.talk_mode.open`, `settings.talk_mode.push`, `common.off`
              - Note: Voice activation (with the threshold row), push to talk (the Talk key) or off: the target's dropdown, as wide as its text, at the row's right.
        - **Threshold** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 88)
          - Note: Shown for voice activation only.
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `settings.voice_threshold`: en "Voice threshold" · uk "Поріг голосу"
            - **Ctl** `HBoxContainer` · variation `ToyRowTwelve` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (345, 0) · gaps from the variation: separation 12
              - Note: The target's slider with its value at the right (.sld, .vv).
              - **Slider** `HSlider` · variation `ToySlider` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · value 40 (min_value 0, max_value 100, step 1)
                - Note: The voice-activation threshold, 0 to 100 %.
              - **Value** `Label` · variation `ToySettingRowValue` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (48, 0) · text from data (auto_translate_mode = DISABLED), sample: "40" · horizontal_alignment `RIGHT`
                - Note: str(value) (auto_translate_mode DISABLED), updated as the slider moves.
        - **Mic** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 88)
          - Note: Without the voice add-on, Mic, TalkMode, Threshold and MicTest give way to one Label(ToyTextMutedOnLight) settings.voice_unavailable.
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `settings.mic`: en "Microphone" · uk "Мікрофон"
            - **Device** `OptionButton` · variation `ToyDropdown` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (345, 0) · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS` · text `settings.mic.default`: en "Default" · uk "Стандартний" · arrow: theme icon `arrow` (dist/pack/icons/chevron-down.svg), tinted by the font colour (modulate_arrow) · `get_popup().theme_type_variation = &"ToyDropdownList"` (its open list, see the notes) · items `settings.mic.default`
              - Note: Items: settings.mic.default, then the device names (not translated). A pick opens the device under the existing "opening" mark. A long device name is cut with an ellipsis, so the row keeps its 450 px.
        - **MicTest** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 88)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `settings.mic_test`: en "Mic test" · uk "Перевірка мікрофона"
            - **Meter** `ProgressBar` · variation `ToyBarSlider` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (345, 15) · value 40 of max_value 100, show_percentage false
              - Note: The live mic level; it runs without a session (#301).
        - **Noise** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 88)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `settings.noise_suppression`: en "Noise suppression" · uk "Шумозаглушення"
            - **Toggle** `HBoxContainer` · variation `ToyRowTwelve` · size flags horizontal `SIZE_SHRINK_END`, vertical `SIZE_SHRINK_CENTER` · gaps from the variation: separation 12
              - Note: One ButtonGroup: RNNoise off or on.
              - **Off** `Button` · variation `ToyChipToggleOnLight` · text `common.off`: en "Off" · uk "Вимкнено" · toggle_mode true, button_pressed false
              - **On** `Button` · variation `ToyChipToggleOnLight` · text `common.on`: en "On" · uk "Увімкнено" · toggle_mode true, button_pressed true (ToyToggle draws `ToyChipToggleOnLightSelected`)

## `settings-controls`: what differs from `ship`

- **Hidden:** `Menu/V/Page/Find`.
- **Changed** `Menu/V/Strip/Tabs/Game`: toggle_mode true, button_pressed false (was: toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`))
- **Changed** `Menu/V/Strip/Tabs/Settings`: toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`) (was: toggle_mode true, button_pressed false)
- **Shown:**
  - **Menu/V/Page/Settings** `HBoxContainer` · variation `ToyRowTwentyFour` · size flags vertical `SIZE_EXPAND_FILL` · gaps from the variation: separation 24
    - Note: One scene (#301), the target's settings page: the section list at the left, the section's hairline rows at the right. The mic, the mode, the threshold with its live meter, noise suppression and the volumes work without a session. Saved per player.
    - **Nav** `VBoxContainer` · variation `ToyColumnFour` · size flags vertical `SIZE_SHRINK_BEGIN` · custom_minimum_size (300, 0) · gaps from the variation: separation 4
      - Note: The section list (the target's .nav): one ButtonGroup of toggle rows; the open section shows the pressed row fill. Settings opens on Sound and voice. Up and down move the focus through the list; ui_right moves it into the rows. 300 px holds «Звук і голос» and «Accessibility» at large text.
      - **Sound** `Button` · variation `ToyMenuItem` · text `settings.tab.sound`: en "Sound and voice" · uk "Звук і голос" · alignment `LEFT` · toggle_mode true, button_pressed false
        - Note: ToyMenuItem (the target's .nav item; a light-context variation since ui-2.2.0): dim idle text, the open section the pressed row fill with light text.
      - **Controls** `Button` · variation `ToyMenuItem` · text `settings.tab.controls`: en "Controls" · uk "Керування" · alignment `LEFT` · toggle_mode true, button_pressed true (its own `pressed` StyleBox; the variation has no toggle partner)
      - **Display** `Button` · variation `ToyMenuItem` · text `settings.tab.display`: en "Display" · uk "Екран" · alignment `LEFT` · toggle_mode true, button_pressed false
      - **Access** `Button` · variation `ToyMenuItem` · text `settings.tab.accessibility`: en "Accessibility" · uk "Доступність" · alignment `LEFT` · toggle_mode true, button_pressed false
      - **Language** `Button` · variation `ToyMenuItem` · text `settings.tab.language`: en "Language" · uk "Мова" · alignment `LEFT` · toggle_mode true, button_pressed false
    - **Scroll** `ScrollContainer` · variation `ToyScroll` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_EXPAND_FILL` · the gap between the child and the bar from the variation: scrollbar_h_separation 8 · horizontal_scroll_mode `SCROLL_MODE_DISABLED` (vertical scrolling only); `get_v_scroll_bar().theme_type_variation = &"ToyScrollBar"`; the bar shows when the child is taller
      - Note: follow_focus = true, so keyboard and gamepad focus scrolls the focused row in view (the 15 keys of Controls, the volumes at large text). Spectating left the MVP (the dead wait in the dead's room), so its two keys are gone from Controls.
      - **Rows** `VBoxContainer` · variation `ToyColumnFour` · size flags horizontal `SIZE_EXPAND_FILL` · gaps from the variation: separation 4
        - Note: Hairline rows (ToySettingRow: the label at the left, the control at the row's right, a 2 px line under each), as the target's .sr; the pack has no zero-gap column, so 4 px stand between the rows. Every row is at least 88 px tall (a dropdown row's height), so the rows of every section keep one height.
        - **Forward** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 88)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.forward`: en "Forward" · uk "Уперед"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (144, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text from data (auto_translate_mode = DISABLED), sample: "W"
              - Note: Button(ToyKeyButton), wide (min 96): its text is the bound key's label, DisplayServer.keyboard_get_label_from_physical() of the action's binding (data, auto_translate_mode DISABLED); Space and the mouse buttons use key.space, key.mouse_left, key.mouse_right. A click or ui_accept starts capture.
        - **Backward** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 88)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.backward`: en "Back" · uk "Назад"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (144, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text from data (auto_translate_mode = DISABLED), sample: "S"
        - **Left** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 88)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.left`: en "Left" · uk "Ліворуч"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (144, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text from data (auto_translate_mode = DISABLED), sample: "A"
        - **Right** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 88)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.right`: en "Right" · uk "Праворуч"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (144, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text from data (auto_translate_mode = DISABLED), sample: "D"
        - **Sprint** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 88)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.sprint`: en "Sprint" · uk "Бігти"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (144, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text from data (auto_translate_mode = DISABLED), sample: "Shift"
        - **Jump** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 88)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.jump`: en "Jump" · uk "Стрибнути"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (144, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text `key.space`: en "Space" · uk "Пробіл"
        - **Crouch** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 88)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.crouch`: en "Crouch" · uk "Присісти"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (144, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text from data (auto_translate_mode = DISABLED), sample: "Ctrl"
        - **Sneak** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 88)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.sneak`: en "Sneak" · uk "Крастися"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (144, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text from data (auto_translate_mode = DISABLED), sample: "Alt"
        - **Interact** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 88)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.interact`: en "Interact" · uk "Взаємодіяти"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (144, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text `settings.controls.press_key`: en "Press a key…" · uk "Натисни клавішу…" · shown held down (review only)
              - Note: Capturing: settings.controls.press_key on the pressed look; idle it shows the bound key's label (E). A click or ui_accept starts capture: set toggle_mode = true and set_pressed_no_signal(true), which draws ToyKeyButton's pressed StyleBox (it has no toggle partner), and restore both when capture ends. Capture runs in _input and calls get_viewport().set_input_as_handled() on every event, so nothing else sees it: the next key or mouse button binds, except the release of the click that started capture, which is ignored; Esc cancels and is consumed (the menu stays open); the arrows and ui_accept do not move or press focus while capturing.
        - **Use** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 88)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.use`: en "Use" · uk "Використати"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (144, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text `key.mouse_left`: en "LMB" · uk "ЛКМ"
        - **PutDown** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 88)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.put_down`: en "Put down" · uk "Покласти"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (144, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text from data (auto_translate_mode = DISABLED), sample: "Q"
        - **Swap** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 88)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.swap`: en "Swap hand and belt" · uk "Поміняти руку й пояс"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (144, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text from data (auto_translate_mode = DISABLED), sample: "X"
        - **Throw** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 88)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.throw`: en "Toss" · uk "Жбурнути"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (144, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text from data (auto_translate_mode = DISABLED), sample: "G"
        - **Map** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 88)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.map`: en "Map and tasks" · uk "Мапа й задачі"
            - **Same** `PanelContainer` · variation `ToyChipAlert` · size flags vertical `SIZE_SHRINK_CENTER`
              - Note: Only on rows whose key clashes with another action of the same phase (here Map and Talk on M); give_up and ready share F legally (different phases, #211).
              - **Text** `Label` · variation `ToyChipAlertText` · text `settings.controls.same_key`: en "Same key" · uk "Та сама клавіша"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (144, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text from data (auto_translate_mode = DISABLED), sample: "M"
        - **GiveUp** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 88)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.give_up`: en "Give up" · uk "Здатися"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (144, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text from data (auto_translate_mode = DISABLED), sample: "F"
        - **ReadyKey** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 88)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `control.ready`: en "Ready" · uk "Готовність"
            - **Bind** `Button` · variation `ToyKeyButton` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (144, 0) = Vector2(get_theme_constant("wide_min_width", "ToyKeyButton"), 0) (wide) · text from data (auto_translate_mode = DISABLED), sample: "F"
        - **Talk** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 88)
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

- **Hidden:** `Menu/V/Page/Find`.
- **Changed** `Menu/V/Strip/Tabs/Game`: toggle_mode true, button_pressed false (was: toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`))
- **Changed** `Menu/V/Strip/Tabs/Settings`: toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`) (was: toggle_mode true, button_pressed false)
- **Shown:**
  - **Menu/V/Page/Settings** `HBoxContainer` · variation `ToyRowTwentyFour` · size flags vertical `SIZE_EXPAND_FILL` · gaps from the variation: separation 24
    - Note: One scene (#301), the target's settings page: the section list at the left, the section's hairline rows at the right. The mic, the mode, the threshold with its live meter, noise suppression and the volumes work without a session. Saved per player.
    - **Nav** `VBoxContainer` · variation `ToyColumnFour` · size flags vertical `SIZE_SHRINK_BEGIN` · custom_minimum_size (300, 0) · gaps from the variation: separation 4
      - Note: The section list (the target's .nav): one ButtonGroup of toggle rows; the open section shows the pressed row fill. Settings opens on Sound and voice. Up and down move the focus through the list; ui_right moves it into the rows. 300 px holds «Звук і голос» and «Accessibility» at large text.
      - **Sound** `Button` · variation `ToyMenuItem` · text `settings.tab.sound`: en "Sound and voice" · uk "Звук і голос" · alignment `LEFT` · toggle_mode true, button_pressed false
        - Note: ToyMenuItem (the target's .nav item; a light-context variation since ui-2.2.0): dim idle text, the open section the pressed row fill with light text.
      - **Controls** `Button` · variation `ToyMenuItem` · text `settings.tab.controls`: en "Controls" · uk "Керування" · alignment `LEFT` · toggle_mode true, button_pressed false
      - **Display** `Button` · variation `ToyMenuItem` · text `settings.tab.display`: en "Display" · uk "Екран" · alignment `LEFT` · toggle_mode true, button_pressed true (its own `pressed` StyleBox; the variation has no toggle partner)
      - **Access** `Button` · variation `ToyMenuItem` · text `settings.tab.accessibility`: en "Accessibility" · uk "Доступність" · alignment `LEFT` · toggle_mode true, button_pressed false
      - **Language** `Button` · variation `ToyMenuItem` · text `settings.tab.language`: en "Language" · uk "Мова" · alignment `LEFT` · toggle_mode true, button_pressed false
    - **Scroll** `ScrollContainer` · variation `ToyScroll` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_EXPAND_FILL` · the gap between the child and the bar from the variation: scrollbar_h_separation 8 · horizontal_scroll_mode `SCROLL_MODE_DISABLED` (vertical scrolling only); `get_v_scroll_bar().theme_type_variation = &"ToyScrollBar"`; the bar shows when the child is taller
      - Note: follow_focus = true, so keyboard and gamepad focus scrolls the focused row in view (the 15 keys of Controls, the volumes at large text). Spectating left the MVP (the dead wait in the dead's room), so its two keys are gone from Controls.
      - **Rows** `VBoxContainer` · variation `ToyColumnFour` · size flags horizontal `SIZE_EXPAND_FILL` · gaps from the variation: separation 4
        - Note: Hairline rows (ToySettingRow: the label at the left, the control at the row's right, a 2 px line under each), as the target's .sr; the pack has no zero-gap column, so 4 px stand between the rows. Every row is at least 88 px tall (a dropdown row's height), so the rows of every section keep one height.
        - **Window** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 88)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `settings.window`: en "Window" · uk "Вікно"
            - **Mode** `HBoxContainer` · variation `ToyRowTwelve` · size flags horizontal `SIZE_SHRINK_END`, vertical `SIZE_SHRINK_CENTER` · gaps from the variation: separation 12
              - Note: One ButtonGroup: DisplayServer window mode.
              - **Fullscreen** `Button` · variation `ToyChipToggleOnLight` · text `settings.window.fullscreen`: en "Fullscreen" · uk "На весь екран" · toggle_mode true, button_pressed true (ToyToggle draws `ToyChipToggleOnLightSelected`)
              - **Windowed** `Button` · variation `ToyChipToggleOnLight` · text `settings.window.windowed`: en "Windowed" · uk "У вікні" · toggle_mode true, button_pressed false

## `settings-access`: what differs from `ship`

- **Hidden:** `Menu/V/Page/Find`.
- **Changed** `Menu/V/Strip/Tabs/Game`: toggle_mode true, button_pressed false (was: toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`))
- **Changed** `Menu/V/Strip/Tabs/Settings`: toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`) (was: toggle_mode true, button_pressed false)
- **Shown:**
  - **Menu/V/Page/Settings** `HBoxContainer` · variation `ToyRowTwentyFour` · size flags vertical `SIZE_EXPAND_FILL` · gaps from the variation: separation 24
    - Note: One scene (#301), the target's settings page: the section list at the left, the section's hairline rows at the right. The mic, the mode, the threshold with its live meter, noise suppression and the volumes work without a session. Saved per player.
    - **Nav** `VBoxContainer` · variation `ToyColumnFour` · size flags vertical `SIZE_SHRINK_BEGIN` · custom_minimum_size (300, 0) · gaps from the variation: separation 4
      - Note: The section list (the target's .nav): one ButtonGroup of toggle rows; the open section shows the pressed row fill. Settings opens on Sound and voice. Up and down move the focus through the list; ui_right moves it into the rows. 300 px holds «Звук і голос» and «Accessibility» at large text.
      - **Sound** `Button` · variation `ToyMenuItem` · text `settings.tab.sound`: en "Sound and voice" · uk "Звук і голос" · alignment `LEFT` · toggle_mode true, button_pressed false
        - Note: ToyMenuItem (the target's .nav item; a light-context variation since ui-2.2.0): dim idle text, the open section the pressed row fill with light text.
      - **Controls** `Button` · variation `ToyMenuItem` · text `settings.tab.controls`: en "Controls" · uk "Керування" · alignment `LEFT` · toggle_mode true, button_pressed false
      - **Display** `Button` · variation `ToyMenuItem` · text `settings.tab.display`: en "Display" · uk "Екран" · alignment `LEFT` · toggle_mode true, button_pressed false
      - **Access** `Button` · variation `ToyMenuItem` · text `settings.tab.accessibility`: en "Accessibility" · uk "Доступність" · alignment `LEFT` · toggle_mode true, button_pressed true (its own `pressed` StyleBox; the variation has no toggle partner)
      - **Language** `Button` · variation `ToyMenuItem` · text `settings.tab.language`: en "Language" · uk "Мова" · alignment `LEFT` · toggle_mode true, button_pressed false
    - **Scroll** `ScrollContainer` · variation `ToyScroll` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_EXPAND_FILL` · the gap between the child and the bar from the variation: scrollbar_h_separation 8 · horizontal_scroll_mode `SCROLL_MODE_DISABLED` (vertical scrolling only); `get_v_scroll_bar().theme_type_variation = &"ToyScrollBar"`; the bar shows when the child is taller
      - Note: follow_focus = true, so keyboard and gamepad focus scrolls the focused row in view (the 15 keys of Controls, the volumes at large text). Spectating left the MVP (the dead wait in the dead's room), so its two keys are gone from Controls.
      - **Rows** `VBoxContainer` · variation `ToyColumnFour` · size flags horizontal `SIZE_EXPAND_FILL` · gaps from the variation: separation 4
        - Note: Hairline rows (ToySettingRow: the label at the left, the control at the row's right, a 2 px line under each), as the target's .sr; the pack has no zero-gap column, so 4 px stand between the rows. Every row is at least 88 px tall (a dropdown row's height), so the rows of every section keep one height.
        - **LargeText** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 88)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `settings.large_text`: en "Large text" · uk "Великий текст"
            - **Toggle** `HBoxContainer` · variation `ToyRowTwelve` · size flags horizontal `SIZE_SHRINK_END`, vertical `SIZE_SHRINK_CENTER` · gaps from the variation: separation 12
              - Note: One ButtonGroup. On swaps GameUi's theme to game_theme_large.tres live.
              - **Off** `Button` · variation `ToyChipToggleOnLight` · text `common.off`: en "Off" · uk "Вимкнено" · toggle_mode true, button_pressed true (ToyToggle draws `ToyChipToggleOnLightSelected`)
              - **On** `Button` · variation `ToyChipToggleOnLight` · text `common.on`: en "On" · uk "Увімкнено" · toggle_mode true, button_pressed false
        - **ReducedMotion** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 88)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `settings.reduced_motion`: en "Reduce motion" · uk "Менше руху"
            - **Toggle** `HBoxContainer` · variation `ToyRowTwelve` · size flags horizontal `SIZE_SHRINK_END`, vertical `SIZE_SHRINK_CENTER` · gaps from the variation: separation 12
              - Note: One ButtonGroup; the default comes from DisplayServer.accessibility_should_reduce_animation(). On: the connecting spinner (s3) turns at half speed; the pre and post game fades (s6, s10) and the End fade are cuts; the button press is instant (the pressed StyleBox still shows).
              - **Off** `Button` · variation `ToyChipToggleOnLight` · text `common.off`: en "Off" · uk "Вимкнено" · toggle_mode true, button_pressed true (ToyToggle draws `ToyChipToggleOnLightSelected`)
              - **On** `Button` · variation `ToyChipToggleOnLight` · text `common.on`: en "On" · uk "Увімкнено" · toggle_mode true, button_pressed false

## `settings-language`: what differs from `ship`

- **Hidden:** `Menu/V/Page/Find`.
- **Changed** `Menu/V/Strip/Tabs/Game`: toggle_mode true, button_pressed false (was: toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`))
- **Changed** `Menu/V/Strip/Tabs/Settings`: toggle_mode true, button_pressed true (ToyToggle draws `ToyTabSelected`) (was: toggle_mode true, button_pressed false)
- **Shown:**
  - **Menu/V/Page/Settings** `HBoxContainer` · variation `ToyRowTwentyFour` · size flags vertical `SIZE_EXPAND_FILL` · gaps from the variation: separation 24
    - Note: One scene (#301), the target's settings page: the section list at the left, the section's hairline rows at the right. The mic, the mode, the threshold with its live meter, noise suppression and the volumes work without a session. Saved per player.
    - **Nav** `VBoxContainer` · variation `ToyColumnFour` · size flags vertical `SIZE_SHRINK_BEGIN` · custom_minimum_size (300, 0) · gaps from the variation: separation 4
      - Note: The section list (the target's .nav): one ButtonGroup of toggle rows; the open section shows the pressed row fill. Settings opens on Sound and voice. Up and down move the focus through the list; ui_right moves it into the rows. 300 px holds «Звук і голос» and «Accessibility» at large text.
      - **Sound** `Button` · variation `ToyMenuItem` · text `settings.tab.sound`: en "Sound and voice" · uk "Звук і голос" · alignment `LEFT` · toggle_mode true, button_pressed false
        - Note: ToyMenuItem (the target's .nav item; a light-context variation since ui-2.2.0): dim idle text, the open section the pressed row fill with light text.
      - **Controls** `Button` · variation `ToyMenuItem` · text `settings.tab.controls`: en "Controls" · uk "Керування" · alignment `LEFT` · toggle_mode true, button_pressed false
      - **Display** `Button` · variation `ToyMenuItem` · text `settings.tab.display`: en "Display" · uk "Екран" · alignment `LEFT` · toggle_mode true, button_pressed false
      - **Access** `Button` · variation `ToyMenuItem` · text `settings.tab.accessibility`: en "Accessibility" · uk "Доступність" · alignment `LEFT` · toggle_mode true, button_pressed false
      - **Language** `Button` · variation `ToyMenuItem` · text `settings.tab.language`: en "Language" · uk "Мова" · alignment `LEFT` · toggle_mode true, button_pressed true (its own `pressed` StyleBox; the variation has no toggle partner)
    - **Scroll** `ScrollContainer` · variation `ToyScroll` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_EXPAND_FILL` · the gap between the child and the bar from the variation: scrollbar_h_separation 8 · horizontal_scroll_mode `SCROLL_MODE_DISABLED` (vertical scrolling only); `get_v_scroll_bar().theme_type_variation = &"ToyScrollBar"`; the bar shows when the child is taller
      - Note: follow_focus = true, so keyboard and gamepad focus scrolls the focused row in view (the 15 keys of Controls, the volumes at large text). Spectating left the MVP (the dead wait in the dead's room), so its two keys are gone from Controls.
      - **Rows** `VBoxContainer` · variation `ToyColumnFour` · size flags horizontal `SIZE_EXPAND_FILL` · gaps from the variation: separation 4
        - Note: Hairline rows (ToySettingRow: the label at the left, the control at the row's right, a 2 px line under each), as the target's .sr; the pack has no zero-gap column, so 4 px stand between the rows. Every row is at least 88 px tall (a dropdown row's height), so the rows of every section keep one height.
        - **Language** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 88)
          - **H** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
            - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `settings.language.title`: en "Game language" · uk "Мова гри"
            - **Choice** `HBoxContainer` · variation `ToyRowTwelve` · size flags horizontal `SIZE_SHRINK_END`, vertical `SIZE_SHRINK_CENTER` · gaps from the variation: separation 12
              - Note: One ButtonGroup; each language is named in itself (auto_translate_mode DISABLED); the language applies at once (#208). A long list later would take ToyRadio rows.
              - **Ukrainian** `Button` · variation `ToyChipToggleOnLight` · text `lang.uk`: en "Українська" · uk "Українська" · button_pressed while this is the game's language (TranslationServer.get_locale()); the page draws the shown language's chip pressed · toggle_mode true, button_pressed true (ToyToggle draws `ToyChipToggleOnLightSelected`)
              - **English** `Button` · variation `ToyChipToggleOnLight` · text `lang.en`: en "English" · uk "English" · button_pressed while this is the game's language (TranslationServer.get_locale()); the page draws the shown language's chip pressed · toggle_mode true, button_pressed false

## `tutorial-game`: what differs from `ship`

- **Hidden:** `Menu/V/Page/Find`.
- **Changed** `Menu/V/Strip/Tabs/Game`: text `esc.tab.game`: en "Game" · uk "Гра" (was: text `esc.tab.find`: en "Find a lobby" · uk "Знайти лобі")
- **Shown:**
  - **Menu/V/Strip/Tabs/Guide** `Button` · variation `ToyTab` · text `esc.tab.guide`: en "Guide" · uk "Посібник" · toggle_mode true, button_pressed false
    - Note: In a session only.
  - **Menu/V/Page/Game** `VBoxContainer` · variation `ToyColumnSixteen` · size flags vertical `SIZE_EXPAND_FILL` · gaps from the variation: separation 16
    - Note: The Game page in a session, built as Find a lobby: the body over the hairline with Resume, the footer row with Leave at the left and Quit at the right (where the target has «Вийти з гри»).
    - **Body** `PanelContainer` · variation `ToySettingRow` · size flags vertical `SIZE_EXPAND_FILL`
      - Note: The body over the footer row; ToySettingRow draws only its bottom hairline.
      - **V** `VBoxContainer`
        - **Resume** `Button` · variation `ToyButtonPrimary` · size flags horizontal `SIZE_SHRINK_BEGIN` · text `esc.game.resume`: en "Resume" · uk "Продовжити"
          - Note: Closes the menu (as Esc).
    - **Foot** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
      - **Inset** `Control` · custom_minimum_size (6, 0)
        - Note: A spacer: 6 + 12 = 18 px, so Leave lines up with Resume inside the body row (ToySettingRow keeps 18 px at its sides).
      - **Leave** `Button` · variation `ToyButtonSecondary` · text `esc.game.leave_tutorial`: en "Leave the tutorial" · uk "Вийти з навчання"
        - Note: Everyone: the outlined secondary, so the menu stays calm. The host: opens the confirm dialog, whose Confirm is the danger button. A player: leaves at once. In the tutorial: esc.game.leave_tutorial, back to the ship. Leaving a session returns the player to the ship (s5 ship).
      - **Gap** `Control` · size flags horizontal `SIZE_EXPAND_FILL`
        - Note: Pushes Quit to the right end of the footer.
      - **Quit** `Button` · variation `ToyButtonGhostOnLight` · text `esc.game.quit`: en "Quit the game" · uk "Вийти з гри"
        - Note: The host: opens the confirm dialog (esc.game.quit_confirm, Confirm esc.game.quit). A player, and in the tutorial: quits at once.

## Notes

- The review page emulates Godot's containers with CSS grid (expanding children share the free space by stretch ratio, never below their minimum size), so a pixel or two may differ from Godot.
- Size constants: a variation's `width`, `height`, `min_width`, `wide_width` and `wide_min_width` theme constants are read by code into `custom_minimum_size`, as the node lines give them. A Panel or PanelContainer takes no size from them on its own: an anchored Panel at offsets 0 is 0×0, a slot shrinks to its text.
- Size constants that follow the text size: `min_width` 42 (50 in the pack's `modes.textSize.large`) of ToyKeyButton, ToyKeyQuiet. The large-text theme is swapped in while a screen is open, so code that sets custom_minimum_size from such a constant sets it again on `NOTIFICATION_THEME_CHANGED`.
- Icons: the tinted ones are white SVGs in `dist/pack/icons/` (the pack's copy of `pages/components/icons`, currentColor written as white): a TextureRect tints one with the `self_modulate` its line gives (the colour the page draws it in), a Button with its variation's `icon_*_color`, an OptionButton its arrow with `modulate_arrow`. The room pictograms are white copies too (`dist/pack/icons/room/`), drawn in the pack's `tint_color`: their lines give the `self_modulate`. The pack's `assets` list every icon with its tint and `svg_scale`.
- SVG import: Godot rasterises an SVG at import, so import each at `svg/scale` = the largest size it is drawn ÷ its viewBox (the largest over every screen that draws it, as the pack's `assets` give it): `chevron-down` 1 (24 px), `lock` 1.25 (30 px), `radio-checked` 1 (24 px), `radio-checked-disabled` 1 (24 px), `radio-unchecked` 1 (24 px), `slider-knob` 1 (42 px), `slider-knob-disabled` 1 (42 px), `swatch-disc` 2.31 (60 px), `teammate-mark` 1.25 (30 px).
- Card art: the how-to frames draw the pack's PNGs, `dist/pack/cards/delivery-1.png`, `dist/pack/cards/delivery-2.png`, `dist/pack/cards/delivery-3.png`, `dist/pack/cards/delivery-meaning-1.png`, `dist/pack/cards/delivery-meaning-2.png`, `dist/pack/cards/delivery-meaning-3.png`, `dist/pack/cards/delivery-meaning-4.png` (640x480, transparent, own work; rendered from `pages/card-art/round-2/clean-sketch/`, `pages/card-art/round-3/a/` by `tools/card-art/render.js`), in their own colours, never tinted. They are drawn smaller than their size (up to 272x204 px here), so import them as Texture2D with `compress/mode` Lossless and `mipmaps/generate` on.
- An OptionButton's open list is its `get_popup()`, a PopupMenu in a window of its own: set its `theme_type_variation` to `ToyDropdownList` in code when the scene is ready (a cream list with the dropdown's ink outline, a lavender hovered or keyboard-focused row). The selected item shows the theme icon `radio_checked` (`dist/pack/icons/radio-checked.svg`, `radio_checked_disabled` `dist/pack/icons/radio-checked-disabled.svg`); the others `radio_unchecked` and `radio_unchecked_disabled` (`dist/pack/icons/radio-unchecked.svg`, empty, so every label starts at the same x). PopupMenu does not tint these icons, so they are drawn in their own colours (not white; the pack names them in the variation's `textures`). Its rounded corners need the default embedded subwindows (`display/window/subwindows/embed_subwindows` true).
- A LineEdit's right-click menu is a PopupMenu too, but its labels (Cut, Copy, Paste, Select All, Clear, Undo, Redo, Text Writing Direction, …) are Godot's English source strings, translated at run time only through translations of those exact strings, which the copy deck (keyed, copy/strings.csv) does not have: in Ukrainian they would show in English. So LineEdits keep `context_menu_enabled = false`; the keyboard shortcuts (copy, paste, select all, undo) still work.
- Boxes and grids take their gaps only from their spacing variation (ToyColumn…, ToyRow…, ToyGrid…), and a ScrollContainer the gap to its bar from ToyScroll; a box without one has a single child. No `theme_override_constants`: the theme test forbids them.
- An HSlider's grabber is a texture: the theme icons `grabber` and `grabber_highlight` are `dist/pack/icons/slider-knob.svg`, `grabber_disabled` `dist/pack/icons/slider-knob-disabled.svg` (own work, in their own colours, not tinted; the pack names them in the variation's `textures`). Slider draws no focus StyleBox of its own: draw the variation's `focus` StyleBox over the slider while it has visible focus.
- A ScrollContainer's bar is its own `VScrollBar`: set its `theme_type_variation` to `ToyScrollBar` in code (`get_v_scroll_bar()`); the child fills the width (`SIZE_EXPAND_FILL`) and keeps its minimum height.

## Keys

- **Drawn** (97): `common.back`, `common.cancel`, `common.code`, `common.off`, `common.on`, `connect.fail.full`, `control.backward`, `control.crouch`, `control.forward`, `control.give_up`, `control.interact`, `control.jump`, `control.left`, `control.map`, `control.put_down`, `control.ready`, `control.right`, `control.sneak`, `control.sprint`, `control.swap`, `control.talk`, `control.throw`, `control.use`, `esc.character.colour`, `esc.character.locked`, `esc.game.leave`, `esc.game.leave_confirm`, `esc.game.leave_host_note`, `esc.game.leave_tutorial`, `esc.game.quit`, `esc.game.resume`, `esc.lobby.copy`, `esc.role.teammates`, `esc.tab.character`, `esc.tab.find`, `esc.tab.game`, `esc.tab.guide`, `esc.tab.role`, `esc.tab.settings`, `find.nearby`, `find.none`, `find.your_code`, `guide.basics`, `guide.downed`, `guide.moving`, `guide.tasks`, `guide.voice`, `howto.label`, `join.address`, `join.connect`, `join.port`, `key.mouse_left`, `key.space`, `lang.en`, `lang.uk`, `lobby.default_name`, `menu.direct`, `menu.host`, `menu.tutorial`, `player.name`, `player.you`, `role.alien`, `role.goal.alien`, `role.goal.human`, `role.human`, `settings.controls.press_key`, `settings.controls.reset`, `settings.controls.same_key`, `settings.effects_volume`, `settings.game_volume`, `settings.language.title`, `settings.large_text`, `settings.mic`, `settings.mic.default`, `settings.mic_test`, `settings.music_volume`, `settings.noise_suppression`, `settings.reduced_motion`, `settings.tab.accessibility`, `settings.tab.controls`, `settings.tab.display`, `settings.tab.language`, `settings.tab.sound`, `settings.talk_mode`, `settings.talk_mode.open`, `settings.talk_mode.push`, `settings.voice_threshold`, `settings.voice_volume`, `settings.window`, `settings.window.fullscreen`, `settings.window.windowed`, `task.car_tuning`, `task.cooking`, `task.engine`, `task.photo`, `task.wifi`, `unit.ms`.
- **Named only in the notes** (wire them too): `downed.give_up_hold`, `esc.character.hat`, `esc.game.quit_confirm`, `esc.lobby.copied`, `key.mouse_right`, `settings.voice_unavailable`, `tutorial.list.death`, `tutorial.step.dead_room.how`, `tutorial.step.dead_room.title`, `tutorial.step.downed.title`, `tutorial.step.move.title`, `tutorial.step.voice.how`, `tutorial.step.voice.title`.

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
