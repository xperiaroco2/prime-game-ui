# 9 · Downed, dead and respawn

<!-- node pages/screens/build.js --handoff s9 (prime-game-ui, pages/screens/src/s09-downed.json); generated, do not edit by hand -->

The styled downed, dead and respawn screen from the UI track (xperiaroco2/prime-game-ui), as a Godot 4.7.2 node tree for the 1920×1080 reference.

- **Source:** `pages/screens/src/s09-downed.json`; the review page is `pages/screens/screens.html#s9`; the wireframe is section `s9` («Повалений, мертвий, повернення»).
- **Theme:** the Toy pack ui-2.5.1 (`dist/pack/toy.pack.json`); the variations below are `theme_type_variation` names.
- **World behind the UI** (not UI): the dead's room.
- **How to read it:** the roots are children of the screen's full-rect root `Control`; every property not listed keeps Godot's default; sizes and offsets are reference px. In a state's **Shown** list, the first node of each subtree gives its path from the screen root.
- **Texts** are keys of `copy/strings.csv`, and the language switches live (the Esc menu's Settings). A plain key is set as `text` and translates itself. A key with placeholders, a plural key (`tr_n`) and a key drawn in pieces are set from code with `auto_translate_mode = DISABLED`: `tr()`, then `String.format()` with the data (the samples below), rebuilt on `NOTIFICATION_TRANSLATION_CHANGED`. A "text from data" (names, the room code, times, numbers) is set in code and never translated (`auto_translate_mode = DISABLED`).

The same HUD as s7: Hud and its nodes are s7's (same names and places); this screen only hides and returns them and adds the downed plates, the dead's room and the protection chip. Aim and the name plates behave as in s7 and are left out here. Every node has mouse_filter IGNORE. Never show who knocked the player down or who killed the player (the engineer, 2026-10-21). The knockdown is kept as decided (GDD §3); spectating left with the MVP: the dead wait in the dead's room (m8 §3; the sketch pages/mvp-screens frame 5 at 0.75, every length x 1.5).

## States

| State | Page label | What it shows |
|---|---|---|
| `down` | Нокдаун | Downed and bleeding out: only the two plates and the mic (off) show; the rest of the HUD hides. As decided, kept. |
| `down-holding` | Утримуєш F | The give-up key is held: the hold bar fills over 1 s. |
| `raise` | Тебе піднімають | Someone is raising the player: the raise progress replaces the bleed-out bar; giving up hides. |
| `dead-room` | Кімната мертвих | Dead (killed, bled out or gave up): the player waits 30 s with the other dead in the dead's room, not watching the living (m8 §3, the sketch's frame 5). The rest of the HUD hides but the mic: the dead hear and talk to each other, the living do not hear them (the engineer, 2026-10-22), so the mic is on with who else is here beside it. Open: where the room is; whether they see the timer and the anger (so no timer here). No killer is shown (the engineer, 2026-10-21). The return shows small at the top (the engineer, 2026-10-22). |
| `back` | Повернення | Back in the round at a random capsule: the s7 HUD returns with the 3 s protection chip. Stamina returns full: all ten pips lit. |

## Node tree in `down`

- **Hud** `Control` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both
  - Note: s7's Hud. While downed only Vitals/Mic shows; in the dead's room nothing shows; on return everything as in s7.
  - **Vitals** `HBoxContainer` · variation `ToyRowTwentyFour` · anchors `bottom_left`, offsets 39, -39, 39, -39 (left, top, right, bottom), grow end/begin · gaps from the variation: separation 24
    - **Mic** `PanelContainer` · variation `ToyMic` · size flags vertical `SIZE_SHRINK_END` · custom_minimum_size (75, 75) = Vector2(get_theme_constant("width", "ToyMic"), get_theme_constant("height", "ToyMic"))
      - Note: Off while downed (nobody hears a downed player); on in the dead's room, where only the other dead hear the player and the living do not (the engineer, 2026-10-22: the dead hear and talk to each other, the living and the dead never hear one another); on again on return (when the living hear the player).
      - **Icon** `TextureRect` · size flags horizontal `SIZE_SHRINK_CENTER`, vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (42, 42) · texture `mic-off` (dist/pack/icons/mic-off.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("icon_off", "ToyMic")
- **Downed** `PanelContainer` · variation `ToyPlate` · anchors `center_top`, offsets 0, 228, 0, 228 (left, top, right, bottom), grow both/end · custom_minimum_size (900, 0)
  - Note: Shown from the moment the player is downed until they are raised, give up or bleed out. Never shows who knocked the player down. 228 px down (the old 152 x 1.5); 900 wide, the old 688 x 1.5 capped at the goal plate's width.
  - **V** `VBoxContainer` · variation `ToyColumnTwelve` · gaps from the variation: separation 12
    - **Title** `Label` · variation `ToyPlateTitle` · custom_minimum_size (810, 0) · text `downed.title`: en "You're down" · uk "Тебе повалено" · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
      - Note: downed.title while bleeding out; downed.raised_by with the raiser's name (auto_translate_mode DISABLED on the name) while someone raises the player.
    - **Bleed** `ProgressBar` · variation `ToyBarReturnCalm` · custom_minimum_size (810, 24) = Vector2(810, 24) · value 0.7 of max_value 1, show_percentage false
      - Note: One ProgressBar, ToyBarReturnCalm (the base track, the accent fill), since the health bars are pips now (ui-2.0.0) and the time left is a countdown as the dead's room return. value = bleed-out time left / bleed-out duration, falling to 0. Under 0.3 (health's alarm line) the game sets ToyBarReturnAlarm (the danger fill); no pulse (agent, open to the engineer's veto).
    - **Left** `Label` · variation `ToyPlateTextMuted` · text `downed.time_left` with sample {time} = "0:10": en "0:10 left" · uk "Лишилось 0:10" · horizontal_alignment `CENTER`
      - Note: {time} is the bleed-out time left as m:ss, updated every second.
- **GiveUp** `PanelContainer` · variation `ToyPlate` · anchors `center_bottom`, offsets 0, -192, 0, -192 (left, top, right, bottom), grow both/begin
  - Note: Hidden while someone raises the player. Its bottom 192 px up (the old 128 x 1.5).
  - **V** `VBoxContainer` · variation `ToyColumnTwelve` · gaps from the variation: separation 12
    - **Line** `HBoxContainer` · variation `ToyRowEight` · gaps from the variation: separation 8 · alignment `ALIGNMENT_CENTER`
      - Note: tr("downed.give_up_hold") split at {key}: the words around a keycap, each piece through strip_edges() (the 8 px gap and the keycap's own padding stand in for the spaces, so the uk comma sits by the key). A piece that is empty after strip_edges() is hidden.
      - **Before** `Label` · variation `ToyPlateText` · size flags vertical `SIZE_SHRINK_CENTER` · text piece 0 of `tr("downed.give_up_hold")` split at {key}/{preset} (strip_edges(); hidden when the piece is empty): en "Hold" · uk "Щоб здатися, утримуй"
      - **Key** `PanelContainer` · variation `ToyKeyOnDark` · custom_minimum_size (42, 0) = Vector2(get_theme_constant("min_width", "ToyKeyOnDark"), 0)
        - **Text** `Label` · variation `ToyKeyText` · text the value of {key} in `downed.give_up_hold` with sample {key} = "F": en "F" · uk "F" · horizontal_alignment `CENTER`
          - Note: The give_up action's key: DisplayServer.keyboard_get_label_from_physical() of its binding (rebindable, #211); F by default.
      - **After** `Label` · variation `ToyPlateText` · size flags vertical `SIZE_SHRINK_CENTER` · text piece 1 of `tr("downed.give_up_hold")` split at {key}/{preset} (strip_edges(); hidden when the piece is empty): en "to give up" · uk ""
    - **Hold** `ProgressBar` · variation `ToyBarProgress` · size flags horizontal `SIZE_SHRINK_CENTER` · custom_minimum_size (540, 24) · value 0 of max_value 1, show_percentage false
      - Note: Fills over the 1 s hold while the give-up key is down and empties when it is released; at 1 the player gives up (dead). Empty at rest, so the plate never changes size.
    - **Pad** `Control` · custom_minimum_size (0, 6)
      - Note: An empty spacer: a bar that ends a plate gets 6 px more room under it than the plate's padding.

## `down-holding`: what differs from `down`

- **Changed** `GiveUp/V/Hold`: value 0.45 of max_value 1, show_percentage false (was: value 0 of max_value 1, show_percentage false)

## `raise`: what differs from `down`

- **Hidden:** `Downed/V/Bleed`, `Downed/V/Left`, `GiveUp`.
- **Changed** `Downed/V/Title`: text `downed.raised_by` with sample {name} = "Olena" / "Олена": en "Olena is raising you" · uk "Тебе піднімає Олена" (was: text `downed.title`: en "You're down" · uk "Тебе повалено")
- **Shown:**
  - **Downed/V/Raise** `ProgressBar` · variation `ToyBarProgress` · custom_minimum_size (810, 24) · value 0.6 of max_value 1, show_percentage false
    - Note: The raise progress (0 to 1) while someone holds raise; if they stop, the bleed-out bar and the time return.
  - **Downed/V/Pad** `Control` · custom_minimum_size (0, 6)
    - Note: An empty spacer: a bar that ends a plate gets 6 px more room under it than the plate's padding.

## `dead-room`: what differs from `down`

- **Hidden:** `Downed`, `GiveUp`.
- **Changed** `Hud/Vitals/Mic/Icon`: texture `mic` (dist/pack/icons/mic.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("icon_on", "ToyMic") (was: texture `mic-off` (dist/pack/icons/mic-off.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("icon_off", "ToyMic"))
- **Shown:**
  - **Hud/Vitals/Others** `PanelContainer` · variation `ToyChipPlate` · size flags vertical `SIZE_SHRINK_CENTER`
    - Note: Who else waits in the room, beside the mic: the dead hear and talk to each other there (the engineer, 2026-10-22), so these are the voices the player hears; hidden when the player is alone there.
    - **Text** `Label` · variation `ToyChipPlateText` · text `dead.also_here` with sample {names} = "Bulk, Zinga" / "Бульк, Зінга": en "Also here: Bulk, Zinga" · uk "Тут також: Бульк, Зінга"
      - Note: {names}: the other dead players' names joined with ", " (data).
  - **DeadTop** `PanelContainer` · variation `ToyPlate` · anchors `center_top`, offsets 0, 36, 0, 36 (left, top, right, bottom), grow both/end
    - Note: The dead's room: its name and the return countdown in one quiet tile at the top centre, where the round's time tile sits (36 px down); the middle of the screen stays clear, since the dead walk around and interact there (the engineer, 2026-10-22: the return written nicely at the top, not filling the screen). No bar under the countdown and no big title plate. No killer line (the engineer, 2026-10-21).
    - **V** `VBoxContainer` · variation `ToyColumnFour` · gaps from the variation: separation 4
      - **Room** `Label` · variation `ToyKicker` · text `dead.room.title`: en "The dead's room" · uk "Кімната мертвих" · horizontal_alignment `CENTER`
        - Note: The tile's head: ToyKicker sets Unbounded with 2 px spacing; the game sets uppercase = true on this Label (the pack's uppercase member).
      - **Return** `HBoxContainer` · variation `ToyRowSixteen` · gaps from the variation: separation 16 · alignment `ALIGNMENT_CENTER`
        - **Label** `Label` · variation `ToyHudCaption` · size flags vertical `SIZE_SHRINK_CENTER` · text `dead.back_in`: en "Back in" · uk "Повернення через"
        - **Time** `Label` · variation `ToyTimer` · size flags vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "0:24"
          - Note: The time to respawn, m:ss from code (auto_translate_mode DISABLED), every second; the wait is 30 s (m8 §3).
  - **Capsule** `PanelContainer` · variation `ToySticker` · anchors `bottom_right`, offsets -39, -39, -39, -39 (left, top, right, bottom), grow begin/begin
    - Note: Where the player comes back: a random capsule, with the 3 s protection of state back. Choosing the capsule is a later perk (m8 §3).
    - **Text** `Label` · variation `ToyStickerText` · text `dead.capsule_note` with sample {count} = "3": en "Random capsule · 3 s protection" · uk "Випадкова капсула · 3 с захисту"

## `back`: what differs from `down`

- **Hidden:** `Downed`, `GiveUp`.
- **Changed** `Hud/Vitals/Mic/Icon`: texture `mic` (dist/pack/icons/mic.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("icon_on", "ToyMic") (was: texture `mic-off` (dist/pack/icons/mic-off.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("icon_off", "ToyMic"))
- **Shown:**
  - **Hud/Role** `PanelContainer` · variation `ToySticker` · anchors `top_left`, offsets 39, 39, 39, 39 (left, top, right, bottom), grow end/end
    - **Text** `Label` · variation `ToyStickerText` · text `role.alien`: en "Alien" · uk "Прибулець"
  - **Hud/Time** `PanelContainer` · variation `ToyPlate` · anchors `center_top`, offsets 0, 36, 0, 36 (left, top, right, bottom), grow both/end
    - Note: As s7.
    - **Row** `HBoxContainer` · variation `ToyRowTwentyFour` · gaps from the variation: separation 24
      - **Timer** `Label` · variation `ToyTimer` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (120, 0) · text from data (auto_translate_mode = DISABLED), sample: "05:10" · horizontal_alignment `CENTER`
      - **Divider** `Panel` · variation `ToyTileDivider` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (3, 48) = Vector2(get_theme_constant("width", "ToyTileDivider"), get_theme_constant("height", "ToyTileDivider"))
        - Note: The thin line between the time and the anger (the target's .time .div, ui-2.1.0).
      - **Anger** `HBoxContainer` · variation `ToyRowEight` · size flags vertical `SIZE_SHRINK_CENTER` · gaps from the variation: separation 8
        - **Bar** `ProgressBar` · variation `ToyBarAngerCalm` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (240, 16) = Vector2(get_theme_constant("width", "ToyBarAngerCalm"), get_theme_constant("height", "ToyBarAngerCalm")) · value 0.55 of max_value 1, show_percentage false
        - **Siren** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (36, 36) · texture `siren-on` (dist/pack/icons/siren-on.svg, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · not tinted (drawn in its own colours)
  - **Hud/Roster** `PanelContainer` · variation `ToyRoster` · anchors `top_right`, offsets -39, 39, -39, 39 (left, top, right, bottom), grow begin/end · custom_minimum_size (276, 0) = Vector2(get_theme_constant("min_width", "ToyRoster"), 0)
    - Note: Every player of the round with the body colour (decided 2026-10-20), 39 px in at the top right; at least 285 wide (the sketch's 190 x 1.5), growing to its longest row. The rows are built from the player list in the session's order with the own row first; a row updates when a player dies, comes back or leaves. Names are data and are not cut. Open: whether the dead show here (the page shows them dimmed with a mark).
    - **Rows** `VBoxContainer` · variation `ToyColumnEight` · gaps from the variation: separation 8
      - **Row1** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
        - Note: As s7.
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
        - **Name** `Label` · variation `ToyRosterNameDead` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `hud.roster.dead` with sample {name} = "Taras" / "Тарас": en "Taras · out" · uk "Тарас · поза грою"
  - **Hud/Cross** `Panel` · variation `ToyCrosshair` · anchors `center`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (12, 12) = Vector2(get_theme_constant("width", "ToyCrosshair"), get_theme_constant("height", "ToyCrosshair"))
  - **Hud/Vitals/Suit** `PanelContainer` · variation `ToyPlate` · size flags vertical `SIZE_SHRINK_END`
    - Note: Hidden while downed; every pip full again on return.
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
  - **Hud/Slots** `HBoxContainer` · variation `ToyRowSixteen` · anchors `bottom_right`, offsets -36, -36, -36, -36 (left, top, right, bottom), grow begin/begin · gaps from the variation: separation 16
    - Note: As s7; the player comes back with empty hands.
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
  - **Protect** `PanelContainer` · variation `ToyChipLight` · anchors `center_top`, offsets 0, 165, 0, 165 (left, top, right, bottom), grow both/end
    - Note: Spawn protection: count 3, 2, 1 (one per second), then hidden. 165 px down (the sketch's 110 x 1.5), 39 px under the anger meter.
    - **Text** `Label` · variation `ToyChipLightText` · text `respawn.protected` with sample {count} = "3": en "Protected 3 s" · uk "Захист 3 с"

## Notes

- The review page emulates Godot's containers with CSS grid (expanding children share the free space by stretch ratio, never below their minimum size), so a pixel or two may differ from Godot.
- Size constants: a variation's `width`, `height`, `min_width`, `wide_width` and `wide_min_width` theme constants are read by code into `custom_minimum_size`, as the node lines give them. A Panel or PanelContainer takes no size from them on its own: an anchored Panel at offsets 0 is 0×0, a slot shrinks to its text.
- Size constants that follow the text size: `min_width` 42 (50 in the pack's `modes.textSize.large`) of ToyKeyOnDark. The large-text theme is swapped in while a screen is open, so code that sets custom_minimum_size from such a constant sets it again on `NOTIFICATION_THEME_CHANGED`.
- Icons: the tinted ones are white SVGs in `dist/pack/icons/` (the pack's copy of `pages/components/icons`, currentColor written as white): a TextureRect tints one with the `self_modulate` its line gives (the colour the page draws it in), a Button with its variation's `icon_*_color`, an OptionButton its arrow with `modulate_arrow`. The room pictograms are white copies too (`dist/pack/icons/room/`), drawn in the pack's `tint_color`: their lines give the `self_modulate`. The pack's `assets` list every icon with its tint and `svg_scale`.
- SVG import: Godot rasterises an SVG at import, so import each at `svg/scale` = the largest size it is drawn ÷ its viewBox (the largest over every screen that draws it, as the pack's `assets` give it): `mic` 1.75 (42 px), `mic-off` 1.75 (42 px), `siren-on` 0.57 (36 px), `slot-empty-belt` 0.9 (57 px), `slot-empty-hand` 0.9 (57 px).
- Boxes and grids take their gaps only from their spacing variation (ToyColumn…, ToyRow…, ToyGrid…), and a ScrollContainer the gap to its bar from ToyScroll; a box without one has a single child. No `theme_override_constants`: the theme test forbids them.

## Keys

- **Drawn** (16): `dead.also_here`, `dead.back_in`, `dead.capsule_note`, `dead.room.title`, `downed.give_up_hold`, `downed.raised_by`, `downed.time_left`, `downed.title`, `hud.health`, `hud.roster.dead`, `hud.roster.self`, `hud.slot.belt`, `hud.slot.hand`, `hud.stamina`, `respawn.protected`, `role.alien`.

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
