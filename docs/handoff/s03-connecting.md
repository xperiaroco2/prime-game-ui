# 3 · Connecting, failures and loading

<!-- node pages/screens/build.js --handoff s3 (prime-game-ui, pages/screens/src/s03-connecting.json); generated, do not edit by hand -->

The styled connecting, failures and loading screen from the UI track (xperiaroco2/prime-game-ui), as a Godot 4.7.2 node tree for the 1920×1080 reference.

- **Source:** `pages/screens/src/s03-connecting.json`; the review page is `pages/screens/screens.html#s3`; the wireframe is section `s3` («Підключення й завантаження»).
- **Theme:** the Toy pack ui-0.5.0 (`dist/pack/toy.pack.json`); the variations below are `theme_type_variation` names.
- **World behind the UI** (not UI): black, no world (intro, outro, loading).
- **How to read it:** the roots are children of the screen's full-rect root `Control`; every property not listed keeps Godot's default; sizes and offsets are reference px. In a state's **Shown** list, the first node of each subtree gives its path from the screen root.
- **Texts** are keys of `copy/strings.csv`, and the language switches live (the Esc menu's Settings). A plain key is set as `text` and translates itself. A key with placeholders, a plural key (`tr_n`) and a key drawn in pieces are set from code with `auto_translate_mode = DISABLED`: `tr()`, then `String.format()` with the data (the samples below), rebuilt on `NOTIFICATION_TRANSLATION_CHANGED`. A "text from data" (names, the room code, times, numbers) is set in code and never translated (`auto_translate_mode = DISABLED`).

One screen on the opaque night backdrop for the join (its steps and each failure in plain words), a session that ended (lost, map failed, error), a host that could not start, and the map loading with the players and a tip or a how-to card. Leaving (left, closed) shows nothing here: straight to s2. Every text is rebuilt on NOTIFICATION_TRANSLATION_CHANGED.

## States

| State | Page label | What it shows |
|---|---|---|
| `finding` | Пошук | A code join, step FINDING; the host's name is not known yet. CONNECTING looks the same with connect.step.connecting. |
| `connecting-direct` | Напряму | A Direct join (LAN or VPN): it starts at CONNECTING, shows no code row and no address. |
| `joined` | Вхід | Step JOINED; the host's lobby name has arrived (#214). |
| `fail-no-room` | Немає гри | no_room |
| `fail-started` | Раунд іде | joins_closed |
| `fail-version` | Версія | wrong_version, wrong_content, service_refused, unknown_map; the two version lines when known. |
| `fail-full` | Повне лобі | full |
| `fail-service` | Сервіс | service_unreachable |
| `fail-unreachable` | Немає звʼязку | host_unreachable |
| `fail-no-answer` | Не відповідає | connect_failed (a Direct join) |
| `lost` | Втрачено | host_lost: a running session ended (from the lobby or a round). |
| `map-failed` | Мапа | load_failed, load_deadline |
| `error` | Помилка | row_error, own_client_malformed, own_client_disconnected |
| `host-failed` | Не створено | cannot_host: Host (with a code or directly) could not start. |
| `load` | Завантаження | From the Loading phase until pre game (s6): this machine's progress, the players, one random tip. |
| `load-card` | З карткою | As load, with the how-to card of a task type in this round the player has not completed instead of the players and the tip. |

## Node tree in `finding`

- **Night** `Panel` · variation `ToyBackdropNight` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both
  - Note: Opaque; the style's darkest, used as the decided black. mouse_filter STOP, so nothing behind it takes input.
- **Connecting** `VBoxContainer` · variation `ToyColumnTwentyFour` · anchors `center`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (768, 0) · gaps from the variation: separation 24 · alignment `ALIGNMENT_CENTER`
  - Note: Shown from Join until the lobby (s4) or a failure. Under the texts, a code join shows the code (CodeRow) and then the time since Join in m:ss (Elapsed). A Direct join shows no address and no CodeRow.
  - **Spinner** `Panel` · variation `ToySpinner` · size flags horizontal `SIZE_SHRINK_CENTER` · custom_minimum_size (90, 90) = Vector2(get_theme_constant("width", "ToySpinner"), get_theme_constant("height", "ToySpinner"))
    - Note: Turns once a second about its centre (pivot_offset_ratio 0.5, 0.5); half speed under reduced motion.
  - **Texts** `VBoxContainer` · variation `ToyColumnEight` · gaps from the variation: separation 8
    - **Title** `Label` · variation `ToyTitleOnDark` · custom_minimum_size (768, 0) · text `connect.connecting_unnamed`: en "Connecting…" · uk "Підключення…" · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
      - Note: connect.connecting_unnamed until the host's lobby name arrives (#214), then connect.connecting with {lobby}: a name the host typed is player data and never translated; while the host's lobby name is the default, {lobby} = tr("lobby.default_name") with the host's name, as on s4.
    - **Step** `Label` · variation `ToyTextOnDark` · text `connect.step.finding`: en "Finding the game" · uk "Пошук гри" · horizontal_alignment `CENTER`
      - Note: JoinProgress.step(): FINDING -&gt; connect.step.finding, CONNECTING -&gt; connect.step.connecting, JOINED -&gt; connect.step.joined. A Direct join starts at CONNECTING.
  - **CodeRow** `HBoxContainer` · variation `ToyRowEight` · size flags horizontal `SIZE_SHRINK_CENTER` · gaps from the variation: separation 8
    - Note: A code join only (hidden for a Direct join).
    - **Label** `Label` · variation `ToyTextMutedOnDark` · size flags vertical `SIZE_SHRINK_CENTER` · text `common.code`: en "Code" · uk "Код"
    - **Code** `PanelContainer` · variation `ToyKeyOnDark` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (36, 0) = Vector2(get_theme_constant("min_width", "ToyKeyOnDark"), 0)
      - **Text** `Label` · variation `ToyKeyText` · text from data (auto_translate_mode = DISABLED), sample: "K7Q2XR" · horizontal_alignment `CENTER`
        - Note: The code typed in s2 (auto_translate_mode DISABLED).
  - **Elapsed** `Label` · variation `ToyTextMutedOnDark` · text from data (auto_translate_mode = DISABLED), sample: "0:04" · horizontal_alignment `CENTER`
    - Note: The time since Join as m:ss, updated every second (auto_translate_mode DISABLED).
  - **Cancel** `Button` · variation `ToyButtonSecondary` (raised: ToyRaised with base `ToyBaseRaisedOnDark`, ToyPress; UiParts.button()) · size flags horizontal `SIZE_SHRINK_CENTER` · placement, size flags, custom_minimum_size and visibility on its ToyRaised wrapper · text `common.cancel`: en "Cancel" · uk "Скасувати" · shown with keyboard focus (grab_focus)
    - Note: The only button, so raised (ToyButtonSecondary), as the failure layout's lone Back. Focus on open; Esc (ui_cancel) does the same. Aborts the join and returns to s2 with the code or address kept in its field. The traversal timeout is the game's (M6 §2.3).

## `connecting-direct`: what differs from `finding`

- **Hidden:** `Connecting/CodeRow`.
- **Changed** `Connecting/Texts/Step`: text `connect.step.connecting`: en "Connecting to the host" · uk "Підключення до хоста" (was: text `connect.step.finding`: en "Finding the game" · uk "Пошук гри")
- **Changed** `Connecting/Elapsed`: text from data (auto_translate_mode = DISABLED), sample: "0:02" (was: text from data (auto_translate_mode = DISABLED), sample: "0:04")

## `joined`: what differs from `finding`

- **Changed** `Connecting/Texts/Title`: text `connect.connecting` with sample {lobby} = "Olena's lobby" / "Лобі: Олена": en "Connecting to “Olena's lobby”…" · uk "Підключення до «Лобі: Олена»…" (was: text `connect.connecting_unnamed`: en "Connecting…" · uk "Підключення…")
- **Changed** `Connecting/Texts/Step`: text `connect.step.joined`: en "Entering the lobby" · uk "Вхід у лобі" (was: text `connect.step.finding`: en "Finding the game" · uk "Пошук гри")
- **Changed** `Connecting/Elapsed`: text from data (auto_translate_mode = DISABLED), sample: "0:09" (was: text from data (auto_translate_mode = DISABLED), sample: "0:04")

## `fail-no-room`: what differs from `finding`

- **Hidden:** `Connecting`.
- **Shown:**
  - **Failure** `VBoxContainer` · variation `ToyColumnThirtyTwo` · anchors `center`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (848, 0) · gaps from the variation: separation 32 · alignment `ALIGNMENT_CENTER`
    - Note: One layout for every failure: what happened, then one action and Back. The texts come from the EndReasons id (the table in the spec, s3).
    - **Texts** `VBoxContainer` · variation `ToyColumnSixteen` · gaps from the variation: separation 16
      - **Title** `Label` · variation `ToyTitleOnDark` · custom_minimum_size (848, 0) · text `connect.fail.title`: en "Couldn't connect" · uk "Не вдалося підключитися" · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
        - Note: Join failures share connect.fail.title; a session that ended or a host that could not start has its own title.
      - **Body** `Label` · variation `ToyTextMutedOnDark` · custom_minimum_size (848, 0) · text `connect.fail.no_room`: en "No game has this code. Check it with the host." · uk "Гри з таким кодом немає. Перевір код у хоста." · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
    - **Buttons** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16 · alignment `ALIGNMENT_CENTER`
      - **BackSolo** `Button` · variation `ToyButtonSecondary` (raised: ToyRaised with base `ToyBaseRaisedOnDark`, ToyPress; UiParts.button()) · placement, size flags, custom_minimum_size and visibility on its ToyRaised wrapper · text `common.back`: en "Back" · uk "Назад" · shown with keyboard focus (grab_focus)
        - Note: Back when it is the only button (no_room, the version failures, lost, map failed, error): raised on its ToyRaised wrapper, focused on open. Same action as BackGhost; the two are separate nodes because only this one has a base.

## `fail-started`: what differs from `finding`

- **Hidden:** `Connecting`.
- **Shown:**
  - **Failure** `VBoxContainer` · variation `ToyColumnThirtyTwo` · anchors `center`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (848, 0) · gaps from the variation: separation 32 · alignment `ALIGNMENT_CENTER`
    - Note: One layout for every failure: what happened, then one action and Back. The texts come from the EndReasons id (the table in the spec, s3).
    - **Texts** `VBoxContainer` · variation `ToyColumnSixteen` · gaps from the variation: separation 16
      - **Title** `Label` · variation `ToyTitleOnDark` · custom_minimum_size (848, 0) · text `connect.fail.title`: en "Couldn't connect" · uk "Не вдалося підключитися" · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
        - Note: Join failures share connect.fail.title; a session that ended or a host that could not start has its own title.
      - **Body** `Label` · variation `ToyTextMutedOnDark` · custom_minimum_size (848, 0) · text `connect.fail.started`: en "The round has already started. Join when everyone is back in the lobby." · uk "Раунд уже почався. Приєднуйся, коли всі повернуться в лобі." · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
    - **Buttons** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16 · alignment `ALIGNMENT_CENTER`
      - **Primary** `Button` · variation `ToyButtonPrimary` (raised: ToyRaised with base `ToyBasePrimaryOnDark`, ToyPress; UiParts.button()) · placement, size flags, custom_minimum_size and visibility on its ToyRaised wrapper · text `connect.fail.retry`: en "Try again" · uk "Спробувати ще" · shown with keyboard focus (grab_focus)
        - Note: Focus on open. connect.fail.retry tries the same target again (host-failed: hosts again the same way); connect.fail.direct opens s2 direct with the code kept in its field. Absent where the failure has no action.
      - **BackGhost** `Button` · variation `ToyButtonGhostOnDark` · text `common.back`: en "Back" · uk "Назад"
        - Note: Back beside Primary (flat, no base): returns to s2 main; after a join failure the code or address stays in its field. Esc does the same.

## `fail-version`: what differs from `finding`

- **Hidden:** `Connecting`.
- **Shown:**
  - **Failure** `VBoxContainer` · variation `ToyColumnThirtyTwo` · anchors `center`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (848, 0) · gaps from the variation: separation 32 · alignment `ALIGNMENT_CENTER`
    - Note: One layout for every failure: what happened, then one action and Back. The texts come from the EndReasons id (the table in the spec, s3).
    - **Texts** `VBoxContainer` · variation `ToyColumnSixteen` · gaps from the variation: separation 16
      - **Title** `Label` · variation `ToyTitleOnDark` · custom_minimum_size (848, 0) · text `connect.fail.title`: en "Couldn't connect" · uk "Не вдалося підключитися" · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
        - Note: Join failures share connect.fail.title; a session that ended or a host that could not start has its own title.
      - **Body** `Label` · variation `ToyTextMutedOnDark` · custom_minimum_size (848, 0) · text `connect.fail.version`: en "The host has another version of the game. You need the same one." · uk "У хоста інша версія гри. Потрібна така сама." · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
      - **Versions** `VBoxContainer` · variation `ToyColumnFour` · gaps from the variation: separation 4
        - Note: fail-version only, and only when the game can name the versions (protocol and content from JoinProgress.found_detail); hidden when unknown.
        - **Host** `Label` · variation `ToyTextOnDark` · text `connect.fail.version_host` with sample {version} = "0.5 (a1b2c3)": en "Host: 0.5 (a1b2c3)" · uk "Хост: 0.5 (a1b2c3)" · horizontal_alignment `CENTER`
        - **Own** `Label` · variation `ToyTextOnDark` · text `connect.fail.version_own` with sample {version} = "0.4 (9f8e7d)": en "You: 0.4 (9f8e7d)" · uk "Ти: 0.4 (9f8e7d)" · horizontal_alignment `CENTER`
    - **Buttons** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16 · alignment `ALIGNMENT_CENTER`
      - **BackSolo** `Button` · variation `ToyButtonSecondary` (raised: ToyRaised with base `ToyBaseRaisedOnDark`, ToyPress; UiParts.button()) · placement, size flags, custom_minimum_size and visibility on its ToyRaised wrapper · text `common.back`: en "Back" · uk "Назад" · shown with keyboard focus (grab_focus)
        - Note: Back when it is the only button (no_room, the version failures, lost, map failed, error): raised on its ToyRaised wrapper, focused on open. Same action as BackGhost; the two are separate nodes because only this one has a base.

## `fail-full`: what differs from `finding`

- **Hidden:** `Connecting`.
- **Shown:**
  - **Failure** `VBoxContainer` · variation `ToyColumnThirtyTwo` · anchors `center`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (848, 0) · gaps from the variation: separation 32 · alignment `ALIGNMENT_CENTER`
    - Note: One layout for every failure: what happened, then one action and Back. The texts come from the EndReasons id (the table in the spec, s3).
    - **Texts** `VBoxContainer` · variation `ToyColumnSixteen` · gaps from the variation: separation 16
      - **Title** `Label` · variation `ToyTitleOnDark` · custom_minimum_size (848, 0) · text `connect.fail.title`: en "Couldn't connect" · uk "Не вдалося підключитися" · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
        - Note: Join failures share connect.fail.title; a session that ended or a host that could not start has its own title.
      - **Body** `Label` · variation `ToyTextMutedOnDark` · custom_minimum_size (848, 0) · text `connect.fail.full`: en "The lobby is full." · uk "Лобі заповнене." · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
    - **Buttons** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16 · alignment `ALIGNMENT_CENTER`
      - **Primary** `Button` · variation `ToyButtonPrimary` (raised: ToyRaised with base `ToyBasePrimaryOnDark`, ToyPress; UiParts.button()) · placement, size flags, custom_minimum_size and visibility on its ToyRaised wrapper · text `connect.fail.retry`: en "Try again" · uk "Спробувати ще" · shown with keyboard focus (grab_focus)
        - Note: Focus on open. connect.fail.retry tries the same target again (host-failed: hosts again the same way); connect.fail.direct opens s2 direct with the code kept in its field. Absent where the failure has no action.
      - **BackGhost** `Button` · variation `ToyButtonGhostOnDark` · text `common.back`: en "Back" · uk "Назад"
        - Note: Back beside Primary (flat, no base): returns to s2 main; after a join failure the code or address stays in its field. Esc does the same.

## `fail-service`: what differs from `finding`

- **Hidden:** `Connecting`.
- **Shown:**
  - **Failure** `VBoxContainer` · variation `ToyColumnThirtyTwo` · anchors `center`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (848, 0) · gaps from the variation: separation 32 · alignment `ALIGNMENT_CENTER`
    - Note: One layout for every failure: what happened, then one action and Back. The texts come from the EndReasons id (the table in the spec, s3).
    - **Texts** `VBoxContainer` · variation `ToyColumnSixteen` · gaps from the variation: separation 16
      - **Title** `Label` · variation `ToyTitleOnDark` · custom_minimum_size (848, 0) · text `connect.fail.title`: en "Couldn't connect" · uk "Не вдалося підключитися" · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
        - Note: Join failures share connect.fail.title; a session that ended or a host that could not start has its own title.
      - **Body** `Label` · variation `ToyTextMutedOnDark` · custom_minimum_size (848, 0) · text `connect.fail.service`: en "The code service isn't answering. Join directly with the host's address." · uk "Сервіс кодів не відповідає. Приєднайся напряму за адресою хоста." · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
    - **Buttons** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16 · alignment `ALIGNMENT_CENTER`
      - **Primary** `Button` · variation `ToyButtonPrimary` (raised: ToyRaised with base `ToyBasePrimaryOnDark`, ToyPress; UiParts.button()) · placement, size flags, custom_minimum_size and visibility on its ToyRaised wrapper · text `connect.fail.direct`: en "Join directly" · uk "Приєднатися напряму" · shown with keyboard focus (grab_focus)
        - Note: Focus on open. connect.fail.retry tries the same target again (host-failed: hosts again the same way); connect.fail.direct opens s2 direct with the code kept in its field. Absent where the failure has no action.
      - **BackGhost** `Button` · variation `ToyButtonGhostOnDark` · text `common.back`: en "Back" · uk "Назад"
        - Note: Back beside Primary (flat, no base): returns to s2 main; after a join failure the code or address stays in its field. Esc does the same.

## `fail-unreachable`: what differs from `finding`

- **Hidden:** `Connecting`.
- **Shown:**
  - **Failure** `VBoxContainer` · variation `ToyColumnThirtyTwo` · anchors `center`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (848, 0) · gaps from the variation: separation 32 · alignment `ALIGNMENT_CENTER`
    - Note: One layout for every failure: what happened, then one action and Back. The texts come from the EndReasons id (the table in the spec, s3).
    - **Texts** `VBoxContainer` · variation `ToyColumnSixteen` · gaps from the variation: separation 16
      - **Title** `Label` · variation `ToyTitleOnDark` · custom_minimum_size (848, 0) · text `connect.fail.title`: en "Couldn't connect" · uk "Не вдалося підключитися" · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
        - Note: Join failures share connect.fail.title; a session that ended or a host that could not start has its own title.
      - **Body** `Label` · variation `ToyTextMutedOnDark` · custom_minimum_size (848, 0) · text `connect.fail.unreachable`: en "No link to the host. If the lobby has room, ask the host for an address and join directly." · uk "Немає звʼязку з хостом. Якщо в лобі є місце, попроси в хоста адресу й приєднайся напряму." · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
    - **Buttons** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16 · alignment `ALIGNMENT_CENTER`
      - **Primary** `Button` · variation `ToyButtonPrimary` (raised: ToyRaised with base `ToyBasePrimaryOnDark`, ToyPress; UiParts.button()) · placement, size flags, custom_minimum_size and visibility on its ToyRaised wrapper · text `connect.fail.direct`: en "Join directly" · uk "Приєднатися напряму" · shown with keyboard focus (grab_focus)
        - Note: Focus on open. connect.fail.retry tries the same target again (host-failed: hosts again the same way); connect.fail.direct opens s2 direct with the code kept in its field. Absent where the failure has no action.
      - **BackGhost** `Button` · variation `ToyButtonGhostOnDark` · text `common.back`: en "Back" · uk "Назад"
        - Note: Back beside Primary (flat, no base): returns to s2 main; after a join failure the code or address stays in its field. Esc does the same.

## `fail-no-answer`: what differs from `finding`

- **Hidden:** `Connecting`.
- **Shown:**
  - **Failure** `VBoxContainer` · variation `ToyColumnThirtyTwo` · anchors `center`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (848, 0) · gaps from the variation: separation 32 · alignment `ALIGNMENT_CENTER`
    - Note: One layout for every failure: what happened, then one action and Back. The texts come from the EndReasons id (the table in the spec, s3).
    - **Texts** `VBoxContainer` · variation `ToyColumnSixteen` · gaps from the variation: separation 16
      - **Title** `Label` · variation `ToyTitleOnDark` · custom_minimum_size (848, 0) · text `connect.fail.title`: en "Couldn't connect" · uk "Не вдалося підключитися" · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
        - Note: Join failures share connect.fail.title; a session that ended or a host that could not start has its own title.
      - **Body** `Label` · variation `ToyTextMutedOnDark` · custom_minimum_size (848, 0) · text `connect.fail.body`: en "The host isn't answering. Check the address and the network." · uk "Хост не відповідає. Перевір адресу й мережу." · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
    - **Buttons** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16 · alignment `ALIGNMENT_CENTER`
      - **Primary** `Button` · variation `ToyButtonPrimary` (raised: ToyRaised with base `ToyBasePrimaryOnDark`, ToyPress; UiParts.button()) · placement, size flags, custom_minimum_size and visibility on its ToyRaised wrapper · text `connect.fail.retry`: en "Try again" · uk "Спробувати ще" · shown with keyboard focus (grab_focus)
        - Note: Focus on open. connect.fail.retry tries the same target again (host-failed: hosts again the same way); connect.fail.direct opens s2 direct with the code kept in its field. Absent where the failure has no action.
      - **BackGhost** `Button` · variation `ToyButtonGhostOnDark` · text `common.back`: en "Back" · uk "Назад"
        - Note: Back beside Primary (flat, no base): returns to s2 main; after a join failure the code or address stays in its field. Esc does the same.

## `lost`: what differs from `finding`

- **Hidden:** `Connecting`.
- **Shown:**
  - **Failure** `VBoxContainer` · variation `ToyColumnThirtyTwo` · anchors `center`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (848, 0) · gaps from the variation: separation 32 · alignment `ALIGNMENT_CENTER`
    - Note: One layout for every failure: what happened, then one action and Back. The texts come from the EndReasons id (the table in the spec, s3).
    - **Texts** `VBoxContainer` · variation `ToyColumnSixteen` · gaps from the variation: separation 16
      - **Title** `Label` · variation `ToyTitleOnDark` · custom_minimum_size (848, 0) · text `connect.lost.title`: en "Connection lost" · uk "Звʼязок втрачено" · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
        - Note: Join failures share connect.fail.title; a session that ended or a host that could not start has its own title.
      - **Body** `Label` · variation `ToyTextMutedOnDark` · custom_minimum_size (848, 0) · text `connect.lost.body`: en "The session was closed, or the network dropped." · uk "Сесію закрито або обірвалася мережа." · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
    - **Buttons** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16 · alignment `ALIGNMENT_CENTER`
      - **BackSolo** `Button` · variation `ToyButtonSecondary` (raised: ToyRaised with base `ToyBaseRaisedOnDark`, ToyPress; UiParts.button()) · placement, size flags, custom_minimum_size and visibility on its ToyRaised wrapper · text `common.back`: en "Back" · uk "Назад" · shown with keyboard focus (grab_focus)
        - Note: Back when it is the only button (no_room, the version failures, lost, map failed, error): raised on its ToyRaised wrapper, focused on open. Same action as BackGhost; the two are separate nodes because only this one has a base.

## `map-failed`: what differs from `finding`

- **Hidden:** `Connecting`.
- **Shown:**
  - **Failure** `VBoxContainer` · variation `ToyColumnThirtyTwo` · anchors `center`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (848, 0) · gaps from the variation: separation 32 · alignment `ALIGNMENT_CENTER`
    - Note: One layout for every failure: what happened, then one action and Back. The texts come from the EndReasons id (the table in the spec, s3).
    - **Texts** `VBoxContainer` · variation `ToyColumnSixteen` · gaps from the variation: separation 16
      - **Title** `Label` · variation `ToyTitleOnDark` · custom_minimum_size (848, 0) · text `connect.map_fail.title`: en "The map didn't load" · uk "Мапа не завантажилася" · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
        - Note: Join failures share connect.fail.title; a session that ended or a host that could not start has its own title.
      - **Body** `Label` · variation `ToyTextMutedOnDark` · custom_minimum_size (848, 0) · text `connect.map_fail.body`: en "The round goes on without you." · uk "Раунд іде без тебе." · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
    - **Buttons** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16 · alignment `ALIGNMENT_CENTER`
      - **BackSolo** `Button` · variation `ToyButtonSecondary` (raised: ToyRaised with base `ToyBaseRaisedOnDark`, ToyPress; UiParts.button()) · placement, size flags, custom_minimum_size and visibility on its ToyRaised wrapper · text `common.back`: en "Back" · uk "Назад" · shown with keyboard focus (grab_focus)
        - Note: Back when it is the only button (no_room, the version failures, lost, map failed, error): raised on its ToyRaised wrapper, focused on open. Same action as BackGhost; the two are separate nodes because only this one has a base.

## `error`: what differs from `finding`

- **Hidden:** `Connecting`.
- **Shown:**
  - **Failure** `VBoxContainer` · variation `ToyColumnThirtyTwo` · anchors `center`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (848, 0) · gaps from the variation: separation 32 · alignment `ALIGNMENT_CENTER`
    - Note: One layout for every failure: what happened, then one action and Back. The texts come from the EndReasons id (the table in the spec, s3).
    - **Texts** `VBoxContainer` · variation `ToyColumnSixteen` · gaps from the variation: separation 16
      - **Title** `Label` · variation `ToyTitleOnDark` · custom_minimum_size (848, 0) · text `connect.error.title`: en "The session stopped" · uk "Сесію зупинено" · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
        - Note: Join failures share connect.fail.title; a session that ended or a host that could not start has its own title.
      - **Body** `Label` · variation `ToyTextMutedOnDark` · custom_minimum_size (848, 0) · text `connect.error.body`: en "The game ran into an error. The details are in the log." · uk "У грі сталася помилка. Подробиці — в журналі." · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
    - **Buttons** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16 · alignment `ALIGNMENT_CENTER`
      - **BackSolo** `Button` · variation `ToyButtonSecondary` (raised: ToyRaised with base `ToyBaseRaisedOnDark`, ToyPress; UiParts.button()) · placement, size flags, custom_minimum_size and visibility on its ToyRaised wrapper · text `common.back`: en "Back" · uk "Назад" · shown with keyboard focus (grab_focus)
        - Note: Back when it is the only button (no_room, the version failures, lost, map failed, error): raised on its ToyRaised wrapper, focused on open. Same action as BackGhost; the two are separate nodes because only this one has a base.

## `host-failed`: what differs from `finding`

- **Hidden:** `Connecting`.
- **Shown:**
  - **Failure** `VBoxContainer` · variation `ToyColumnThirtyTwo` · anchors `center`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (848, 0) · gaps from the variation: separation 32 · alignment `ALIGNMENT_CENTER`
    - Note: One layout for every failure: what happened, then one action and Back. The texts come from the EndReasons id (the table in the spec, s3).
    - **Texts** `VBoxContainer` · variation `ToyColumnSixteen` · gaps from the variation: separation 16
      - **Title** `Label` · variation `ToyTitleOnDark` · custom_minimum_size (848, 0) · text `connect.host_fail.title`: en "Couldn't start the game" · uk "Не вдалося створити гру" · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
        - Note: Join failures share connect.fail.title; a session that ended or a host that could not start has its own title.
      - **Body** `Label` · variation `ToyTextMutedOnDark` · custom_minimum_size (848, 0) · text `connect.error.body`: en "The game ran into an error. The details are in the log." · uk "У грі сталася помилка. Подробиці — в журналі." · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
    - **Buttons** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16 · alignment `ALIGNMENT_CENTER`
      - **Primary** `Button` · variation `ToyButtonPrimary` (raised: ToyRaised with base `ToyBasePrimaryOnDark`, ToyPress; UiParts.button()) · placement, size flags, custom_minimum_size and visibility on its ToyRaised wrapper · text `connect.fail.retry`: en "Try again" · uk "Спробувати ще" · shown with keyboard focus (grab_focus)
        - Note: Focus on open. connect.fail.retry tries the same target again (host-failed: hosts again the same way); connect.fail.direct opens s2 direct with the code kept in its field. Absent where the failure has no action.
      - **BackGhost** `Button` · variation `ToyButtonGhostOnDark` · text `common.back`: en "Back" · uk "Назад"
        - Note: Back beside Primary (flat, no base): returns to s2 main; after a join failure the code or address stays in its field. Esc does the same.

## `load`: what differs from `finding`

- **Hidden:** `Connecting`.
- **Shown:**
  - **Loading** `VBoxContainer` · variation `ToyColumnSixteen` · anchors `center_top`, offsets 0, 368, 0, 368 (left, top, right, bottom), grow both/end · custom_minimum_size (768, 0) · gaps from the variation: separation 16
    - **Title** `Label` · variation `ToyTitleOnDark` · text `loading.title`: en "Loading the map" · uk "Завантаження мапи" · horizontal_alignment `CENTER`
    - **Bar** `ProgressBar` · variation `ToyBarProgress` · custom_minimum_size (768, 16) · value 62 of max_value 100, show_percentage false
      - Note: This machine's load fraction.
    - **Players** `VBoxContainer` · variation `ToyColumnEight` · gaps from the variation: separation 8
      - Note: One row per player, the host first, then in join order; the own row (Row) reads player.you, the other rows the player's name (auto_translate_mode DISABLED).
      - **HostRow** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
        - **Name** `Label` · variation `ToyTextOnDark` · size flags horizontal `SIZE_EXPAND_FILL` · text from data (auto_translate_mode = DISABLED), sample: "Olena" / "Олена" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
        - **State** `Label` · variation `ToyTextOnDark` · text `loading.player_ready`: en "Ready" · uk "Готово"
      - **Row** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
        - **Name** `Label` · variation `ToyTextOnDark` · size flags horizontal `SIZE_EXPAND_FILL` · text `player.you`: en "You" · uk "Ти" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
        - **State** `Label` · variation `ToyTextMutedOnDark` · text `loading.player_loading`: en "Loading…" · uk "Завантаження…"
          - Note: loading.player_loading in ToyTextMutedOnDark while the player loads; loading.player_ready in ToyTextOnDark once loaded.
      - **OtherRow** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
        - **Name** `Label` · variation `ToyTextOnDark` · size flags horizontal `SIZE_EXPAND_FILL` · text from data (auto_translate_mode = DISABLED), sample: "Taras" / "Тарас" · clip_text true · text_overrun_behavior `OVERRUN_TRIM_ELLIPSIS`
        - **State** `Label` · variation `ToyTextMutedOnDark` · text `loading.player_loading`: en "Loading…" · uk "Завантаження…"
  - **Tip** `PanelContainer` · variation `ToyPlate` · anchors `center_bottom`, offsets 0, -88, 0, -88 (left, top, right, bottom), grow both/both · custom_minimum_size (1072, 0)
    - **Text** `Label` · variation `ToyPlateText` · custom_minimum_size (1036, 0) · text `tip.two_hands`: en "Don't forget: you have two hands." · uk "Не забувай: у тебе дві руки." · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
      - Note: One random tip.* key per loading.

## `load-card`: what differs from `finding`

- **Hidden:** `Connecting`.
- **Shown:**
  - **Head** `VBoxContainer` · variation `ToyColumnTwelve` · anchors `center_top`, offsets 0, 64, 0, 64 (left, top, right, bottom), grow both/end · custom_minimum_size (768, 0) · gaps from the variation: separation 12
    - **Title** `Label` · variation `ToyTitleOnDark` · text `loading.title`: en "Loading the map" · uk "Завантаження мапи" · horizontal_alignment `CENTER`
    - **Bar** `ProgressBar` · variation `ToyBarProgress` · custom_minimum_size (768, 16) · value 62 of max_value 100, show_percentage false
  - **Card** `PanelContainer` · variation `ToyPanelHowto` (raised: ToyRaised with base `ToyBasePanel`) · anchors `center`, offsets 0, 40, 0, 40 (left, top, right, bottom), grow both/both · custom_minimum_size (1616, 0) · placement, size flags, custom_minimum_size and visibility on its ToyRaised wrapper
    - Note: The how-to card (P8) of a task type in this round that the player has not completed: at most twice per type and never after its first completion (user:// counters, #254). Content data per task type; here Delivery, the game's one task type. No line says the task is new.
    - **V** `VBoxContainer` · variation `ToyColumnSixteen` · gaps from the variation: separation 16
      - **Head** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16
        - **Title** `Label` · variation `ToyTitleOnLight` · size flags horizontal `SIZE_EXPAND_FILL` · text `task.delivery`: en "Delivery" · uk "Доставка"
        - **Note** `Label` · variation `ToyHowtoNote` · size flags vertical `SIZE_SHRINK_CENTER` · text `howto.label`: en "How to" · uk "Як робити"
      - **Frames** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
        - **Take** `PanelContainer` · variation `ToyHowtoFrame` · size flags horizontal `SIZE_EXPAND_FILL`
          - **Art** `TextureRect` · custom_minimum_size (352, 264) · texture `card/delivery-1` (dist/pack/cards/delivery-1.png, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · not tinted (drawn in its own colours)
            - Note: The card's art: one picture per frame from the card data (#254), here the pack's Delivery PNGs dist/pack/cards/delivery-1.png … delivery-4.png (640x480, transparent). expand_mode IGNORE_SIZE, stretch_mode KEEP_ASPECT_CENTERED; 352x264 here, 320x240 in s8. The cards are wordless: a frame holds only its art, no caption.
        - **Sign** `PanelContainer` · variation `ToyHowtoFrame` · size flags horizontal `SIZE_EXPAND_FILL`
          - **Art** `TextureRect` · custom_minimum_size (352, 264) · texture `card/delivery-2` (dist/pack/cards/delivery-2.png, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · not tinted (drawn in its own colours)
        - **Find** `PanelContainer` · variation `ToyHowtoFrame` · size flags horizontal `SIZE_EXPAND_FILL`
          - **Art** `TextureRect` · custom_minimum_size (352, 264) · texture `card/delivery-3` (dist/pack/cards/delivery-3.png, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · not tinted (drawn in its own colours)
        - **Drop** `PanelContainer` · variation `ToyHowtoFrameDone` · size flags horizontal `SIZE_EXPAND_FILL`
          - Note: The frame that shows the finish.
          - **Art** `TextureRect` · custom_minimum_size (352, 264) · texture `card/delivery-4` (dist/pack/cards/delivery-4.png, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · not tinted (drawn in its own colours)

## Notes

- The review page emulates Godot's containers with CSS grid (expanding children share the free space by stretch ratio, never below their minimum size), so a pixel or two may differ from Godot.
- A raised variation is built as the tokens spec (§6) says: a `ToyRaised` MarginContainer holding first the base `Panel` (the base named above, chosen by the context it sits in), then the face. The wrapper is the node in its parent: anchors, offsets, grow, size flags, stretch ratio, custom_minimum_size and visibility belong to the wrapper; the variation, the text, toggle_mode, disabled, focus and the signals belong to the face. Hide or show the wrapper, not the face.
- Size constants: a variation's `width`, `height`, `min_width`, `wide_width` and `wide_min_width` theme constants are read by code into `custom_minimum_size`, as the node lines give them. A Panel or PanelContainer takes no size from them on its own: an anchored Panel at offsets 0 is 0×0, a slot shrinks to its text.
- Size constants that follow the text size: `min_width` 36 (42 in the pack's `modes.textSize.large`) of ToyKeyOnDark. The large-text theme is swapped in while a screen is open, so code that sets custom_minimum_size from such a constant sets it again on `NOTIFICATION_THEME_CHANGED`.
- Card art: the how-to frames draw the pack's PNGs, `dist/pack/cards/delivery-1.png`, `dist/pack/cards/delivery-2.png`, `dist/pack/cards/delivery-3.png`, `dist/pack/cards/delivery-4.png` (640x480, transparent, own work; rendered from `pages/card-art/round-2/clean-sketch/` by `tools/card-art/render.js`), in their own colours, never tinted. They are drawn smaller than their size (up to 352x264 px here), so import them as Texture2D with `compress/mode` Lossless and `mipmaps/generate` on.
- Boxes and grids take their gaps only from their spacing variation (ToyColumn…, ToyRow…, ToyGrid…), and a ScrollContainer the gap to its bar from ToyScroll; a box without one has a single child. No `theme_override_constants`: the theme test forbids them.

## Keys

- **Drawn** (34): `common.back`, `common.cancel`, `common.code`, `connect.connecting`, `connect.connecting_unnamed`, `connect.error.body`, `connect.error.title`, `connect.fail.body`, `connect.fail.direct`, `connect.fail.full`, `connect.fail.no_room`, `connect.fail.retry`, `connect.fail.service`, `connect.fail.started`, `connect.fail.title`, `connect.fail.unreachable`, `connect.fail.version`, `connect.fail.version_host`, `connect.fail.version_own`, `connect.host_fail.title`, `connect.lost.body`, `connect.lost.title`, `connect.map_fail.body`, `connect.map_fail.title`, `connect.step.connecting`, `connect.step.finding`, `connect.step.joined`, `howto.label`, `loading.player_loading`, `loading.player_ready`, `loading.title`, `player.you`, `task.delivery`, `tip.two_hands`.
- **Named only in the notes** (wire them too): `lobby.default_name`.

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
