# 2 · Main menu

<!-- node pages/screens/build.js --handoff s2 (prime-game-ui, pages/screens/src/s02-main-menu.json); generated, do not edit by hand -->

The styled main menu screen from the UI track (xperiaroco2/prime-game-ui), as a Godot 4.7.2 node tree for the 1920×1080 reference.

- **Source:** `pages/screens/src/s02-main-menu.json`; the review page is `pages/screens/screens.html#s2`; the wireframe is section `s2` («Головне меню»).
- **Theme:** the Toy pack ui-0.3.0 (`dist/pack/toy.pack.json`); the variations below are `theme_type_variation` names.
- **World behind the UI** (not UI): the lobby room seen behind the main menu.
- **How to read it:** the roots are children of the screen's full-rect root `Control`; every property not listed keeps Godot's default; sizes and offsets are reference px. In a state's **Shown** list, the first node of each subtree gives its path from the screen root.
- **Texts** are keys of `copy/strings.csv`, and the language switches live (the Esc menu's Settings). A plain key is set as `text` and translates itself. A key with placeholders, a plural key (`tr_n`) and a key drawn in pieces are set from code with `auto_translate_mode = DISABLED`: `tr()`, then `String.format()` with the data (the samples below), rebuilt on `NOTIFICATION_TRANSLATION_CHANGED`. A "text from data" (names, the room code, times, numbers) is set in code and never translated (`auto_translate_mode = DISABLED`).

The live lobby stays behind a dim backdrop with an idle camera. There is no server browser: Host makes a game with a code, Join takes a code, Join by address (Direct) joins or hosts directly. Join, Direct and Settings are one ButtonGroup with allow_unpress: pressing one opens its panel to the right of the items (Join's and Direct's top on Host's top; Settings' a taller root of its own); pressing it again, Back or Esc (ui_cancel) closes it. The panels have no title: the pressed item names the open panel.

## States

| State | Page label | What it shows |
|---|---|---|
| `main` | Меню | The menu alone; keyboard focus starts on Host. |
| `code` | Код | Join pressed: the code panel opens with the field focused and empty, Join unplugged. |
| `code-ready` | Код готовий | Six valid characters typed: Join is enabled. |
| `direct` | За адресою | Join by address pressed: the Direct panel, the address focused. |
| `settings` | Налаштування | Settings pressed: the Settings panel on its Sound and voice page, focus on Sound and voice. |

## Node tree in `main`

- **Backdrop** `Panel` · variation `ToyBackdrop` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both
  - Note: mouse_filter IGNORE; it dims the live lobby behind the menu.
- **Column** `VBoxContainer` · variation `ToyColumnTwentyFour` · anchors `top_left`, offsets 136, 256, 136, 256 (left, top, right, bottom), grow end/end · gaps from the variation: separation 24
  - **Logo** `Label` · variation `ToyLogo` · text from data (auto_translate_mode = DISABLED), sample: "prime-game"
    - Note: The game's name, the working title "prime-game" (auto_translate_mode DISABLED; not a deck key).
  - **NameRow** `HBoxContainer` · variation `ToyRowTwelve` · size flags horizontal `SIZE_SHRINK_BEGIN` · custom_minimum_size (592, 0) · gaps from the variation: separation 12
    - **NameLabel** `Label` · variation `ToyTextMutedOnDark` · size flags vertical `SIZE_SHRINK_CENTER` · text `player.name`: en "Name" · uk "Імʼя"
    - **Name** `LineEdit` · variation `ToyField` · size flags horizontal `SIZE_EXPAND_FILL` · text (sample data) "Olena" / "Олена" · context_menu_enabled false (no Toy PopupMenu look yet)
      - Note: The player's name, kept between sessions (user://); never empty: the last name used, else the system user name. max_length 16 (characters, the same limit in both languages: wave 1's proposal until the game sets its name rule; the host checks String.length() too); a longer text scrolls inside the field. auto_translate_mode DISABLED.
  - **Body** `HBoxContainer` · variation `ToyRowThirtyTwo` · gaps from the variation: separation 32
    - Note: The items, then the open panel (if any) to their right, its top on Host's top.
    - **Items** `VBoxContainer` · variation `ToyColumnFour` · size flags vertical `SIZE_SHRINK_BEGIN` · custom_minimum_size (592, 0) · gaps from the variation: separation 4
      - Note: Up and down move the focus through the items; the focused, hovered or pressed item shows its pointer icon.
      - **Host** `Button` · variation `ToyMenuItem` · text `menu.host`: en "Host a game" · uk "Створити гру" · icon `pointer` (dist/pack/icons/pointer.svg, own work) at 24 px, tinted by `ToyMenuItem`'s icon_*_color · alignment `LEFT` · shown with keyboard focus (grab_focus)
        - Note: Focus on open. Hosts a game with a code (WebRTC) and goes straight to the lobby (s4); a failure shows s3 host-failed.
      - **Join** `Button` · variation `ToyMenuItem` · text `menu.join`: en "Join" · uk "Приєднатися" · icon `pointer` (dist/pack/icons/pointer.svg, own work) at 24 px, tinted by `ToyMenuItem`'s icon_*_color · alignment `LEFT` · toggle_mode true, button_pressed false
        - Note: In the menu ButtonGroup; button_pressed while CodePanel is open (ToyMenuItem's own pressed StyleBox and pointer). Toggles CodePanel.
      - **Direct** `Button` · variation `ToyMenuItem` · text `menu.direct`: en "Join by address" · uk "Приєднатися за адресою" · icon `pointer` (dist/pack/icons/pointer.svg, own work) at 24 px, tinted by `ToyMenuItem`'s icon_*_color · alignment `LEFT` · toggle_mode true, button_pressed false
        - Note: In the menu ButtonGroup; button_pressed while DirectPanel is open (its own pressed StyleBox). Toggles DirectPanel.
      - **Tutorial** `Button` · variation `ToyMenuItem` · text `menu.tutorial`: en "Tutorial" · uk "Навчання" · icon `pointer` (dist/pack/icons/pointer.svg, own work) at 24 px, tinted by `ToyMenuItem`'s icon_*_color · alignment `LEFT`
        - Note: Loads the tutorial's first lesson (s1).
      - **Settings** `Button` · variation `ToyMenuItem` · text `menu.settings`: en "Settings" · uk "Налаштування" · icon `pointer` (dist/pack/icons/pointer.svg, own work) at 24 px, tinted by `ToyMenuItem`'s icon_*_color · alignment `LEFT` · toggle_mode true, button_pressed false
        - Note: In the menu ButtonGroup; button_pressed while SettingsPanel is open (its own pressed StyleBox). Toggles SettingsPanel.
      - **Quit** `Button` · variation `ToyMenuItem` · text `menu.quit`: en "Quit" · uk "Вийти" · icon `pointer` (dist/pack/icons/pointer.svg, own work) at 24 px, tinted by `ToyMenuItem`'s icon_*_color · alignment `LEFT`
        - Note: Quits the game at once.
- **Version** `Label` · variation `ToyTextMutedOnDark` · anchors `bottom_right`, offsets -40, -40, -40, -40 (left, top, right, bottom), grow begin/begin · text `menu.version` with sample {version} = "0.4": en "Version 0.4" · uk "Версія 0.4"
  - Note: The build's version (ProjectSettings application/config/version).

## `code`: what differs from `main`

- **Changed** `Column/Body/Items/Host`: no longer shown with keyboard focus (grab_focus)
- **Changed** `Column/Body/Items/Join`: toggle_mode true, button_pressed true (its own `pressed` StyleBox; the variation has no toggle partner) (was: toggle_mode true, button_pressed false)
- **Shown:**
  - **Column/Body/Gap** `Control` · custom_minimum_size (64, 0)
    - Note: An empty spacer: 32 + 64 + 32 px between the items and the open panel. Shown with any panel.
  - **Column/Body/CodePanel** `PanelContainer` · variation `ToyPanelMenu` (raised: ToyRaised with base `ToyBasePanel`) · size flags vertical `SIZE_SHRINK_BEGIN` · custom_minimum_size (784, 0) · placement, size flags, custom_minimum_size and visibility on its ToyRaised wrapper
    - Note: Join with a code. Shown while Join is pressed. As wide as DirectPanel, so the two panels never differ.
    - **V** `VBoxContainer` · variation `ToyColumnSixteen` · gaps from the variation: separation 16
      - **Field** `VBoxContainer` · variation `ToyColumnEight` · gaps from the variation: separation 8
        - **CodeLabel** `Label` · variation `ToyTextMutedOnLight` · text `common.code`: en "Code" · uk "Код"
        - **Code** `LineEdit` · variation `ToyField` · empty (no text, no placeholder) · context_menu_enabled false (no Toy PopupMenu look yet) · shown focused with the caret
          - Note: Focused and empty when the panel opens. max_length 6; upper-cases as typed, drops spaces and dashes on paste, accepts only the 31-letter code alphabet (no 0, O, 1, I, L). Keeps what was typed after a failure (back from s3). Enter = Join when it is enabled. auto_translate_mode DISABLED.
      - **Buttons** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
        - **Join** `Button` · variation `ToyButtonPrimary` (raised: ToyRaised with base `ToyBasePrimaryOnLight`, ToyPress; UiParts.button()) · size flags horizontal `SIZE_EXPAND_FILL` · placement, size flags, custom_minimum_size and visibility on its ToyRaised wrapper · text `join.connect`: en "Join" · uk "Приєднатися" · disabled true
          - Note: Disabled (unplugged) until the field holds 6 valid characters. Joins by the code: s3 finding.
        - **Back** `Button` · variation `ToyButtonGhostOnLight` · text `common.back`: en "Back" · uk "Назад"
          - Note: Closes the panel and unpresses Join; Esc does the same.

## `code-ready`: what differs from `main`

- **Changed** `Column/Body/Items/Host`: no longer shown with keyboard focus (grab_focus)
- **Changed** `Column/Body/Items/Join`: toggle_mode true, button_pressed true (its own `pressed` StyleBox; the variation has no toggle partner) (was: toggle_mode true, button_pressed false)
- **Shown:**
  - **Column/Body/Gap** `Control` · custom_minimum_size (64, 0)
    - Note: An empty spacer: 32 + 64 + 32 px between the items and the open panel. Shown with any panel.
  - **Column/Body/CodePanel** `PanelContainer` · variation `ToyPanelMenu` (raised: ToyRaised with base `ToyBasePanel`) · size flags vertical `SIZE_SHRINK_BEGIN` · custom_minimum_size (784, 0) · placement, size flags, custom_minimum_size and visibility on its ToyRaised wrapper
    - Note: Join with a code. Shown while Join is pressed. As wide as DirectPanel, so the two panels never differ.
    - **V** `VBoxContainer` · variation `ToyColumnSixteen` · gaps from the variation: separation 16
      - **Field** `VBoxContainer` · variation `ToyColumnEight` · gaps from the variation: separation 8
        - **CodeLabel** `Label` · variation `ToyTextMutedOnLight` · text `common.code`: en "Code" · uk "Код"
        - **Code** `LineEdit` · variation `ToyField` · text (sample data) "K7Q2XR" · context_menu_enabled false (no Toy PopupMenu look yet) · shown focused with the caret
          - Note: Focused and empty when the panel opens. max_length 6; upper-cases as typed, drops spaces and dashes on paste, accepts only the 31-letter code alphabet (no 0, O, 1, I, L). Keeps what was typed after a failure (back from s3). Enter = Join when it is enabled. auto_translate_mode DISABLED.
      - **Buttons** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
        - **Join** `Button` · variation `ToyButtonPrimary` (raised: ToyRaised with base `ToyBasePrimaryOnLight`, ToyPress; UiParts.button()) · size flags horizontal `SIZE_EXPAND_FILL` · placement, size flags, custom_minimum_size and visibility on its ToyRaised wrapper · text `join.connect`: en "Join" · uk "Приєднатися"
          - Note: Disabled (unplugged) until the field holds 6 valid characters. Joins by the code: s3 finding.
        - **Back** `Button` · variation `ToyButtonGhostOnLight` · text `common.back`: en "Back" · uk "Назад"
          - Note: Closes the panel and unpresses Join; Esc does the same.

## `direct`: what differs from `main`

- **Changed** `Column/Body/Items/Host`: no longer shown with keyboard focus (grab_focus)
- **Changed** `Column/Body/Items/Direct`: toggle_mode true, button_pressed true (its own `pressed` StyleBox; the variation has no toggle partner) (was: toggle_mode true, button_pressed false)
- **Shown:**
  - **Column/Body/Gap** `Control` · custom_minimum_size (64, 0)
    - Note: An empty spacer: 32 + 64 + 32 px between the items and the open panel. Shown with any panel.
  - **Column/Body/DirectPanel** `PanelContainer` · variation `ToyPanelMenu` (raised: ToyRaised with base `ToyBasePanel`) · size flags vertical `SIZE_SHRINK_BEGIN` · custom_minimum_size (784, 0) · placement, size flags, custom_minimum_size and visibility on its ToyRaised wrapper
    - Note: Join or host directly over ENet (LAN, VPN, playit.gg). Shown while Direct is pressed. No address is shown anywhere else (streams).
    - **V** `VBoxContainer` · variation `ToyColumnSixteen` · gaps from the variation: separation 16
      - **Field** `VBoxContainer` · variation `ToyColumnEight` · gaps from the variation: separation 8
        - **AddressLabel** `Label` · variation `ToyTextMutedOnLight` · text `join.address`: en "Host address" · uk "Адреса хоста"
        - **Address** `LineEdit` · variation `ToyField` · text (sample data) "192.168.0.12" · context_menu_enabled false (no Toy PopupMenu look yet) · shown focused with the caret
          - Note: Focused when the panel opens. Takes host or host:port, host names included (JoinTarget). Keeps what was typed after a failure. Enter = Join. auto_translate_mode DISABLED.
        - **Port** `Label` · variation `ToyTextMutedOnLight` · text `join.port` with sample {port} = "7777": en "Port 7777" · uk "Порт 7777"
          - Note: The default port, used when the address has none.
      - **Buttons** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
        - **Join** `Button` · variation `ToyButtonPrimary` (raised: ToyRaised with base `ToyBasePrimaryOnLight`, ToyPress; UiParts.button()) · size flags horizontal `SIZE_EXPAND_FILL` · placement, size flags, custom_minimum_size and visibility on its ToyRaised wrapper · text `join.connect`: en "Join" · uk "Приєднатися"
          - Note: Disabled (unplugged) while Address is empty. Joins over ENet: s3 (the connecting steps, no code row).
        - **Host** `Button` · variation `ToyButtonSecondary` (raised: ToyRaised with base `ToyBaseRaisedOnLight`, ToyPress; UiParts.button()) · placement, size flags, custom_minimum_size and visibility on its ToyRaised wrapper · text `menu.host`: en "Host a game" · uk "Створити гру"
          - Note: Hosts directly (ENet) on the port typed, else the default, and opens the lobby (s4) with no code row.
        - **Back** `Button` · variation `ToyButtonGhostOnLight` · text `common.back`: en "Back" · uk "Назад"
          - Note: Closes the panel and unpresses Direct; Esc does the same.

## `settings`: what differs from `main`

- **Changed** `Column/Body/Items/Host`: no longer shown with keyboard focus (grab_focus)
- **Changed** `Column/Body/Items/Settings`: toggle_mode true, button_pressed true (its own `pressed` StyleBox; the variation has no toggle partner) (was: toggle_mode true, button_pressed false)
- **Shown:**
  - **SettingsPanel** `PanelContainer` · variation `ToyPanelMenu` (raised: ToyRaised with base `ToyBasePanel`) · anchors `top_left`, offsets 856, 96, 1816, 984 (left, top, right, bottom), grow end/end · placement, size flags, custom_minimum_size and visibility on its ToyRaised wrapper
    - Note: Shown while Settings is pressed. A root of its own (too tall for Body): its left edge on the code and Direct panels' left edge (856), 960x888 (the five page chips fit at large text), centred vertically; raised on its ToyRaised wrapper. It holds the Esc menu's Settings scene (s5/Menu/H/Page/Settings), one scene that both menus instance (#301): the mic, the mode, the threshold with its live meter, noise suppression and the volumes work without a session; nothing is sent. Focus goes to Settings/Sub/Sound when it opens; Settings again or Esc (ui_cancel) closes it and gives the focus back to Items/Settings.
    - **Settings** `VBoxContainer` · variation `ToyColumnSixteen` · gaps from the variation: separation 16
      - Note: The s5 Settings scene (s5/Menu/H/Page/Settings), instanced here on its Sound and voice page; its nodes, notes and other pages are s5's. Build it once, in s5.
      - **Sub** `HBoxContainer` · variation `ToyRowEight` · gaps from the variation: separation 8
        - **Sound** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.sound`: en "Sound and voice" · uk "Звук і голос" · toggle_mode true, button_pressed true (ToyToggle draws `ToyChipToggleOnLightSelected`) · shown with keyboard focus (grab_focus)
        - **Controls** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.controls`: en "Controls" · uk "Керування" · toggle_mode true, button_pressed false
        - **Display** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.display`: en "Display" · uk "Екран" · toggle_mode true, button_pressed false
        - **Access** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.accessibility`: en "Accessibility" · uk "Доступність" · toggle_mode true, button_pressed false
        - **Language** `Button` · variation `ToyChipToggleOnLight` · text `settings.tab.language`: en "Language" · uk "Мова" · toggle_mode true, button_pressed false
      - **Scroll** `ScrollContainer` · variation `ToyScroll` · size flags vertical `SIZE_EXPAND_FILL` · the gap between the child and the bar from the variation: scrollbar_h_separation 8 · horizontal_scroll_mode `SCROLL_MODE_DISABLED` (vertical scrolling only); `get_v_scroll_bar().theme_type_variation = &"ToyScrollBar"`; the bar shows when the child is taller
        - **Rows** `VBoxContainer` · variation `ToyColumnEight` · size flags horizontal `SIZE_EXPAND_FILL` · gaps from the variation: separation 8
          - **Mic** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
            - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
              - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `settings.mic`: en "Microphone" · uk "Мікрофон"
              - **Device** `OptionButton` · variation `ToyDropdown` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (500, 0) · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS` · text `settings.mic.default`: en "Default" · uk "Стандартний" · arrow: theme icon `arrow` (dist/pack/icons/chevron-down.svg), tinted by the font colour (modulate_arrow); its list is `get_popup()` (see the notes) · items `settings.mic.default`
          - **TalkMode** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
            - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
              - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `settings.talk_mode`: en "How to talk" · uk "Як говорити"
              - **Mode** `OptionButton` · variation `ToyDropdown` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (500, 0) · text `settings.talk_mode.open`: en "Voice activation" · uk "Голосова активація" · arrow: theme icon `arrow` (dist/pack/icons/chevron-down.svg), tinted by the font colour (modulate_arrow); its list is `get_popup()` (see the notes) · items `settings.talk_mode.open`, `settings.talk_mode.push`, `common.off`
          - **Threshold** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
            - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
              - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `settings.voice_threshold`: en "Voice threshold" · uk "Поріг голосу"
              - **Slider** `HSlider` · variation `ToySlider` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (500, 0) · value 40 (min_value 0, max_value 100, step 1)
          - **MicTest** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
            - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
              - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `settings.mic_test`: en "Mic test" · uk "Перевірка мікрофона"
              - **Meter** `ProgressBar` · variation `ToyBarSlider` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (500, 10) · value 40 of max_value 100, show_percentage false
          - **Noise** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
            - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
              - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `settings.noise_suppression`: en "Noise suppression" · uk "Шумозаглушення"
              - **Toggle** `HBoxContainer` · variation `ToyRowEight` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (500, 0) · gaps from the variation: separation 8
                - **Off** `Button` · variation `ToyChipToggleOnLight` · text `common.off`: en "Off" · uk "Вимкнено" · toggle_mode true, button_pressed false
                - **On** `Button` · variation `ToyChipToggleOnLight` · text `common.on`: en "On" · uk "Увімкнено" · toggle_mode true, button_pressed true (ToyToggle draws `ToyChipToggleOnLightSelected`)
          - **Overall** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
            - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
              - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `settings.game_volume`: en "Overall volume" · uk "Загальна гучність"
              - **Slider** `HSlider` · variation `ToySlider` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (500, 0) · value 55 (min_value 0, max_value 100, step 1)
          - **Voices** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
            - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
              - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `settings.voice_volume`: en "Voice volume" · uk "Гучність голосів"
              - **Slider** `HSlider` · variation `ToySlider` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (500, 0) · value 70 (min_value 0, max_value 100, step 1)
          - **Effects** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
            - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
              - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `settings.effects_volume`: en "Effects volume" · uk "Гучність ефектів"
              - **Slider** `HSlider` · variation `ToySlider` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (500, 0) · value 80 (min_value 0, max_value 100, step 1)
          - **Music** `PanelContainer` · variation `ToySettingRow` · custom_minimum_size (0, 64)
            - **H** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
              - **Name** `Label` · variation `ToySettingRowText` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `settings.music_volume`: en "Music volume" · uk "Гучність музики"
              - **Slider** `HSlider` · variation `ToySlider` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (500, 0) · value 50 (min_value 0, max_value 100, step 1)

## Notes

- The review page emulates Godot's containers with CSS grid (expanding children share the free space by stretch ratio, never below their minimum size), so a pixel or two may differ from Godot.
- A raised variation is built as the tokens spec (§6) says: a `ToyRaised` MarginContainer holding first the base `Panel` (the base named above, chosen by the context it sits in), then the face. The wrapper is the node in its parent: anchors, offsets, grow, size flags, stretch ratio, custom_minimum_size and visibility belong to the wrapper; the variation, the text, toggle_mode, disabled, focus and the signals belong to the face. Hide or show the wrapper, not the face.
- Icons: the tinted ones are white SVGs in `dist/pack/icons/` (the pack's copy of `pages/components/icons`, currentColor written as white): a TextureRect tints one with the `self_modulate` its line gives (the colour the page draws it in), a Button with its variation's `icon_*_color`, an OptionButton its arrow with `modulate_arrow`. The room pictograms are white copies too (`dist/pack/icons/room/`), drawn in ink: their lines give the `self_modulate`. The pack's `assets` list every icon with its tint and `svg_scale`.
- SVG import: Godot rasterises an SVG at import, so import each at `svg/scale` = the largest size it is drawn ÷ its viewBox (the largest over every screen that draws it, as the pack's `assets` give it): `chevron-down` 1 (24 px), `pointer` 1 (24 px).
- An OptionButton's open list is its `get_popup()`, a PopupMenu in a window of its own, and a LineEdit's right-click menu is one too: Toy has no PopupMenu variation yet, so they would draw in Godot's default theme. Until it comes (a prime-game-ui follow-up), LineEdits set `context_menu_enabled = false`.
- Boxes and grids take their gaps only from their spacing variation (ToyColumn…, ToyRow…, ToyGrid…), and a ScrollContainer the gap to its bar from ToyScroll; a box without one has a single child. No `theme_override_constants`: the theme test forbids them.
- An HSlider's grabber is a texture: the theme icons `grabber` and `grabber_highlight` are `dist/pack/icons/slider-knob.svg`, `grabber_disabled` `dist/pack/icons/slider-knob-disabled.svg` (own work, in their own colours, not tinted; the pack names them in the variation's `textures`). Slider draws no focus StyleBox of its own: draw the variation's `focus` StyleBox over the slider while it has visible focus.
- A ScrollContainer's bar is its own `VScrollBar`: set its `theme_type_variation` to `ToyScrollBar` in code (`get_v_scroll_bar()`); the child fills the width (`SIZE_EXPAND_FILL`) and keeps its minimum height.

## Keys

- **Drawn** (32): `common.back`, `common.code`, `common.off`, `common.on`, `join.address`, `join.connect`, `join.port`, `menu.direct`, `menu.host`, `menu.join`, `menu.quit`, `menu.settings`, `menu.tutorial`, `menu.version`, `player.name`, `settings.effects_volume`, `settings.game_volume`, `settings.mic`, `settings.mic.default`, `settings.mic_test`, `settings.music_volume`, `settings.noise_suppression`, `settings.tab.accessibility`, `settings.tab.controls`, `settings.tab.display`, `settings.tab.language`, `settings.tab.sound`, `settings.talk_mode`, `settings.talk_mode.open`, `settings.talk_mode.push`, `settings.voice_threshold`, `settings.voice_volume`.

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
