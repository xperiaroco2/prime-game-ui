# 9 · Downed, dead and respawn

<!-- node pages/screens/build.js --handoff s9 (prime-game-ui, pages/screens/src/s09-downed.json); generated, do not edit by hand -->

The styled downed, dead and respawn screen from the UI track (xperiaroco2/prime-game-ui), as a Godot 4.7.2 node tree for the 1920×1080 reference.

- **Source:** `pages/screens/src/s09-downed.json`; the review page is `pages/screens/screens.html#s9`; the wireframe is section `s9` («Повалений, мертвий, повернення»).
- **Theme:** the Toy pack ui-1.3.0 (`dist/pack/toy.pack.json`); the variations below are `theme_type_variation` names.
- **World behind the UI** (not UI): a dark room of the level.
- **How to read it:** the roots are children of the screen's full-rect root `Control`; every property not listed keeps Godot's default; sizes and offsets are reference px. In a state's **Shown** list, the first node of each subtree gives its path from the screen root.
- **Texts** are keys of `copy/strings.csv`, and the language switches live (the Esc menu's Settings). A plain key is set as `text` and translates itself. A key with placeholders, a plural key (`tr_n`) and a key drawn in pieces are set from code with `auto_translate_mode = DISABLED`: `tr()`, then `String.format()` with the data (the samples below), rebuilt on `NOTIFICATION_TRANSLATION_CHANGED`. A "text from data" (names, the room code, times, numbers) is set in code and never translated (`auto_translate_mode = DISABLED`).

The same HUD as s7: Hud and its nodes are s7's (same names and places); this screen only hides and returns them and adds the downed plates, the dead's room and the protection chip. Aim and the name plates behave as in s7 and are left out here. Every node has mouse_filter IGNORE. Never show who knocked the player down or who killed the player (the engineer, 2026-10-21). The knockdown is kept as decided (GDD §3); spectating left with the MVP: the dead wait in the dead's room (m8 §3; the sketch pages/mvp-screens frame 5 at 0.75, every length x 1.5).

## States

| State | Page label | What it shows |
|---|---|---|
| `down` | Нокдаун | Downed and bleeding out: only the two plates and the mic (off) show; the rest of the HUD hides. As decided, kept. |
| `down-holding` | Утримуєш F | The give-up key is held: the hold bar fills over 1 s. |
| `raise` | Тебе піднімають | Someone is raising the player: the raise progress replaces the bleed-out bar; giving up hides. |
| `dead-room` | Кімната мертвих | Dead (killed, bled out or gave up): the player waits 30 s with the other dead in the dead's room, not watching the living (m8 §3, the sketch's frame 5). The rest of the HUD hides. Open: where the room is; whether the dead can talk to each other there; whether they see the timer and the anger (so no timer and no mic here). No killer is shown (the engineer, 2026-10-21). Open: how the return from the dead's room is shown: to be redone later (the engineer, 2026-10-21). |
| `back` | Повернення | Back in the round at a random capsule: the s7 HUD returns with the 3 s protection chip. Stamina returns full in the game; the sample shows it part-empty only so the bar is reviewed over a dark room. |

## Node tree in `down`

- **Hud** `Control` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both
  - Note: s7's Hud. While downed only Vitals/Mic shows; in the dead's room nothing shows; on return everything as in s7.
  - **Vitals** `HBoxContainer` · variation `ToyRowTwentyFour` · anchors `bottom_left`, offsets 39, -39, 39, -39 (left, top, right, bottom), grow end/begin · gaps from the variation: separation 24
    - **Mic** `PanelContainer` · variation `ToyMic` · size flags vertical `SIZE_SHRINK_END` · custom_minimum_size (75, 75) = Vector2(get_theme_constant("width", "ToyMic"), get_theme_constant("height", "ToyMic"))
      - Note: Off while downed (nobody hears a downed player); hidden in the dead's room; on again on return (when the player is heard).
      - **Icon** `TextureRect` · size flags horizontal `SIZE_SHRINK_CENTER`, vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (42, 42) · texture `mic-off` (dist/pack/icons/mic-off.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("icon_off", "ToyMic")
- **Downed** `PanelContainer` · variation `ToyPlate` · anchors `center_top`, offsets 0, 228, 0, 228 (left, top, right, bottom), grow both/end · custom_minimum_size (900, 0)
  - Note: Shown from the moment the player is downed until they are raised, give up or bleed out. Never shows who knocked the player down. 228 px down (the old 152 x 1.5); 900 wide, the old 688 x 1.5 capped at the goal plate's width.
  - **V** `VBoxContainer` · variation `ToyColumnTwelve` · gaps from the variation: separation 12
    - **Title** `Label` · variation `ToyPlateTitle` · custom_minimum_size (810, 0) · text `downed.title`: en "You're down" · uk "Тебе повалено" · horizontal_alignment `CENTER` · autowrap_mode `AUTOWRAP_WORD_SMART`
      - Note: downed.title while bleeding out; downed.raised_by with the raiser's name (auto_translate_mode DISABLED on the name) while someone raises the player.
    - **Bleed** `ProgressBar` · variation `ToyBarHealthCalm` · custom_minimum_size (810, 24) = Vector2(810, get_theme_constant("height", "ToyBarHealthCalm")) · value 0.7 of max_value 1, show_percentage false
      - Note: One ProgressBar in the health bar's look (the time left reads as life; one green, no ramp since ui-1.3.0). value = bleed-out time left / bleed-out duration, falling to 0. The alarm line is health's (s7 Hud/Vitals/Bars/Health): under 0.3 the game sets ToyBarHealthAlarm and pulses the light as s7's bars; otherwise ToyBarHealthCalm (agent, open to the engineer's veto).
    - **Left** `Label` · variation `ToyPlateTextMuted` · text `downed.time_left` with sample {time} = "0:10": en "0:10 left" · uk "Лишилось 0:10" · horizontal_alignment `CENTER`
      - Note: {time} is the bleed-out time left as m:ss, updated every second.
- **GiveUp** `PanelContainer` · variation `ToyPlate` · anchors `center_bottom`, offsets 0, -192, 0, -192 (left, top, right, bottom), grow both/begin
  - Note: Hidden while someone raises the player. Its bottom 192 px up (the old 128 x 1.5).
  - **V** `VBoxContainer` · variation `ToyColumnTwelve` · gaps from the variation: separation 12
    - **Line** `HBoxContainer` · variation `ToyRowEight` · gaps from the variation: separation 8 · alignment `ALIGNMENT_CENTER`
      - Note: tr("downed.give_up_hold") split at {key}: the words around a keycap, each piece through strip_edges() (the 8 px gap and the keycap's own padding stand in for the spaces, so the uk comma sits by the key). A piece that is empty after strip_edges() is hidden.
      - **Before** `Label` · variation `ToyPlateText` · size flags vertical `SIZE_SHRINK_CENTER` · text piece 0 of `tr("downed.give_up_hold")` split at {key}/{preset} (strip_edges(); hidden when the piece is empty): en "Hold" · uk "Щоб здатися, утримуй"
      - **Key** `PanelContainer` · variation `ToyKeyOnDark` · custom_minimum_size (36, 0) = Vector2(get_theme_constant("min_width", "ToyKeyOnDark"), 0)
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

- **Hidden:** `Hud/Vitals`, `Downed`, `GiveUp`.
- **Shown:**
  - **DeadHead** `PanelContainer` · variation `ToyPlateHead` · anchors `center_top`, offsets 0, 39, 0, 39 (left, top, right, bottom), grow both/end
    - Note: The dead's room overlay replaces spectating (m8 §3, decided 2026-10-20). Its head, 39 px down (the sketch's 26 x 1.5). The room itself is a place in the world (open: where).
    - **Text** `Label` · variation `ToyPlateHeadText` · text `dead.room.title`: en "The dead's room" · uk "Кімната мертвих"
  - **DeadCol** `VBoxContainer` · variation `ToyColumnTwentyFour` · anchors `center`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · gaps from the variation: separation 24
    - Note: Centred on the screen: the return countdown. No killer line (the engineer, 2026-10-21: the game does not show who killed the player).
    - **Count** `PanelContainer` · variation `ToyPlateCount` · size flags horizontal `SIZE_SHRINK_CENTER` · custom_minimum_size (540, 0) = Vector2(get_theme_constant("min_width", "ToyPlateCount"), 0)
      - Note: The return countdown on the mint count plate, at least 540 wide (the sketch's 360 x 1.5). Open: how the return from the dead's room is shown: to be redone later (the engineer, 2026-10-21).
      - **V** `VBoxContainer` · variation `ToyColumnTwelve` · gaps from the variation: separation 12
        - **Label** `Label` · variation `ToyPlateText` · text `dead.back_in`: en "Back in" · uk "Повернення через" · horizontal_alignment `CENTER`
        - **Time** `Label` · variation `ToyPlateCountdown` · text from data (auto_translate_mode = DISABLED), sample: "0:24" · horizontal_alignment `CENTER`
          - Note: The time to respawn, m:ss from code (auto_translate_mode DISABLED), every second; the wait is 30 s (m8 §3).
        - **Bar** `ProgressBar` · variation `ToyBarReturnCalm` · custom_minimum_size (0, 24) = Vector2(0, get_theme_constant("height", "ToyBarReturnCalm")) · value 0.2 of max_value 1, show_percentage false
          - Note: The dead's room return bar, one ProgressBar: its background is the white track, its fill the alien green. value = the wait passed (0 to 1), filling to the return. The alarm line: in the wait's last 5 s (value over 25 / 30) the game sets theme_type_variation ToyBarReturnAlarm (the track glows green) and pulses the light as s7's bars (the background StyleBox's shadow_color.a 1 to 0.25 and back, 0.9 s each way, no pulse under reduced motion); before that ToyBarReturnCalm.
  - **Others** `PanelContainer` · variation `ToyChipPlate` · anchors `bottom_left`, offsets 39, -39, 39, -39 (left, top, right, bottom), grow end/begin
    - Note: Who else waits in the room, 39 px in at the bottom left; hidden when the player is alone there.
    - **Text** `Label` · variation `ToyChipPlateText` · text `dead.also_here` with sample {names} = "Bulk, Zinga" / "Бульк, Зінга": en "Also here: Bulk, Zinga" · uk "Тут також: Бульк, Зінга"
      - Note: {names}: the other dead players' names joined with ", " (data).
  - **Capsule** `PanelContainer` · variation `ToySticker` · anchors `bottom_right`, offsets -39, -39, -39, -39 (left, top, right, bottom), grow begin/begin
    - Note: Where the player comes back: a random capsule, with the 3 s protection of state back. Choosing the capsule is a later perk (m8 §3). Open: how the return from the dead's room is shown: to be redone later (the engineer, 2026-10-21).
    - **Text** `Label` · variation `ToyStickerText` · text `dead.capsule_note` with sample {count} = "3": en "Random capsule · 3 s protection" · uk "Випадкова капсула · 3 с захисту"

## `back`: what differs from `down`

- **Hidden:** `Downed`, `GiveUp`.
- **Changed** `Hud/Vitals/Mic/Icon`: texture `mic` (dist/pack/icons/mic.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("icon_on", "ToyMic") (was: texture `mic-off` (dist/pack/icons/mic-off.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("icon_off", "ToyMic"))
- **Shown:**
  - **Hud/Role** `PanelContainer` · variation `ToySticker` · anchors `top_left`, offsets 39, 39, 39, 39 (left, top, right, bottom), grow end/end
    - Note: The player's own side for the round, a flat word sticker 39 px in (the sketch's 26 x 1.5): ToySticker with role.alien, ToyStickerAlert (coral) with role.human.
    - **Text** `Label` · variation `ToyStickerText` · text `role.alien`: en "Alien" · uk "Прибулець"
  - **Hud/Timer** `Label` · variation `ToyTimerBare` · anchors `center_top`, offsets 0, 33, 0, 33 (left, top, right, bottom), grow both/end · custom_minimum_size (140, 0) · text from data (auto_translate_mode = DISABLED), sample: "05:10" · horizontal_alignment `CENTER`
    - Note: As s7.
  - **Hud/Anger** `Control` · anchors `center_top`, offsets 0, 96, 0, 96 (left, top, right, bottom), grow both/end
    - Note: The neighbours' anger, meter A (decided 2026-10-20): a zero-size point at the top centre, 96 px down (the sketch's 64 x 1.5). The track centres on it, so the bar is exactly centred under the time; the siren hangs off its right end without moving that centre. No caption, no plate. It never says what raises the anger or where (open: whether it hints the type of problem, the audit's point 3).
    - **Bar** `ProgressBar` · variation `ToyBarAngerCalm` · anchors `center_top`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/end · custom_minimum_size (225, 30) = Vector2(get_theme_constant("width", "ToyBarAngerCalm"), get_theme_constant("height", "ToyBarAngerCalm")) · value 0.55 of max_value 1, show_percentage false
      - Note: As s7: one ProgressBar, ToyBarAngerCalm, ToyBarAngerAlarm over 0.7.
    - **Siren** `TextureRect` · anchors `top_left`, offsets 122, -14, 179, 43 (left, top, right, bottom), grow end/end · custom_minimum_size (57, 57) · texture `siren-on` (dist/pack/icons/siren-on.svg, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · not tinted (drawn in its own colours)
      - Note: The siren, 57 px (the sketch's 38 x 1.5), 9 px right of the track's end (112.5 + 9, rounded up) and centred on its height: icons/siren-off.svg while the anger is calm (not rising), icons/siren-on.svg while it rises and when full. Never tinted.
  - **Hud/Roster** `PanelContainer` · variation `ToyRoster` · anchors `top_right`, offsets -39, 39, -39, 39 (left, top, right, bottom), grow begin/end · custom_minimum_size (285, 0) = Vector2(get_theme_constant("min_width", "ToyRoster"), 0)
    - Note: Every player of the round with the body colour (decided 2026-10-20), 39 px in at the top right; at least 285 wide (the sketch's 190 x 1.5), growing to its longest row. The rows are built from the player list in the session's order with the own row first; a row updates when a player dies, comes back or leaves. Names are data and are not cut. Open: whether the dead show here (the page shows them dimmed with a mark).
    - **Rows** `VBoxContainer` · variation `ToyColumnEight` · gaps from the variation: separation 8
      - **Row1** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
        - Note: As s7.
        - **Dot** `Panel` · variation `ToyRosterDot` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (24, 24) = Vector2(get_theme_constant("width", "ToyRosterDot"), get_theme_constant("height", "ToyRosterDot")) · self_modulate from data (a content colour, not a theme colour), sample #7C5CC8
        - **Name** `Label` · variation `ToyRosterNameSelf` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `hud.roster.self` with sample {name} = "Olena" / "Олена": en "Olena (you)" · uk "Олена (ти)"
      - **Row2** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
        - **Dot** `Panel` · variation `ToyRosterDot` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (24, 24) = Vector2(get_theme_constant("width", "ToyRosterDot"), get_theme_constant("height", "ToyRosterDot")) · self_modulate from data (a content colour, not a theme colour), sample #1C7A82
        - **Name** `Label` · variation `ToyRosterName` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Glorp" / "Глорп"
      - **Row3** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
        - **Dot** `Panel` · variation `ToyRosterDot` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (24, 24) = Vector2(get_theme_constant("width", "ToyRosterDot"), get_theme_constant("height", "ToyRosterDot")) · self_modulate from data (a content colour, not a theme colour), sample #E66B57
        - **Name** `Label` · variation `ToyRosterName` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Yizhak" / "Їжак"
      - **Row4** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
        - **Dot** `Panel` · variation `ToyRosterDot` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (24, 24) = Vector2(get_theme_constant("width", "ToyRosterDot"), get_theme_constant("height", "ToyRosterDot")) · self_modulate from data (a content colour, not a theme colour), sample #E8B04A
        - **Name** `Label` · variation `ToyRosterName` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Bulk" / "Бульк"
      - **Row5** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
        - **Dot** `Panel` · variation `ToyRosterDot` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (24, 24) = Vector2(get_theme_constant("width", "ToyRosterDot"), get_theme_constant("height", "ToyRosterDot")) · self_modulate from data (a content colour, not a theme colour), sample #4AA3DF
        - **Name** `Label` · variation `ToyRosterName` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text from data (auto_translate_mode = DISABLED), sample: "Zinga" / "Зінга"
      - **Row6** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
        - **Dot** `Panel` · variation `ToyRosterDot` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (24, 24) = Vector2(get_theme_constant("width", "ToyRosterDot"), get_theme_constant("height", "ToyRosterDot")) · self_modulate from data (a content colour, not a theme colour), sample #D46FB0
        - **Name** `Label` · variation `ToyRosterNameDead` · size flags horizontal `SIZE_EXPAND_FILL`, vertical `SIZE_SHRINK_CENTER` · text `hud.roster.dead` with sample {name} = "Taras" / "Тарас": en "Taras · out" · uk "Тарас · поза грою"
  - **Hud/Cross** `Panel` · variation `ToyCrosshair` · anchors `center`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (12, 12) = Vector2(get_theme_constant("width", "ToyCrosshair"), get_theme_constant("height", "ToyCrosshair"))
    - Note: The crosshair dot, centred on the screen (its size is the variation's).
  - **Hud/Vitals/Bars** `VBoxContainer` · variation `ToyColumnTwelve` · size flags vertical `SIZE_SHRINK_END` · gaps from the variation: separation 12
    - Note: Hidden while downed; full again on return.
    - **Health** `ProgressBar` · variation `ToyBarHealthCalm` · custom_minimum_size (300, 24) = Vector2(300, get_theme_constant("height", "ToyBarHealthCalm")) · value 1 of max_value 1, show_percentage false
      - Note: As s7.
    - **Stamina** `ProgressBar` · variation `ToyBarStaminaCalm` · custom_minimum_size (300, 24) = Vector2(300, get_theme_constant("height", "ToyBarStaminaCalm")) · value 0.35 of max_value 1, show_percentage false
      - Note: As s7.
  - **Hud/Slots** `HBoxContainer` · variation `ToyRowSixteen` · anchors `bottom_right`, offsets -39, -51, -39, -51 (left, top, right, bottom), grow begin/begin · gaps from the variation: separation 16
    - Note: As s7; the player comes back with empty hands.
    - **Hand** `Control` · size flags vertical `SIZE_SHRINK_END` · custom_minimum_size (150, 150)
      - **Face** `PanelContainer` · variation `ToySlotHand` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (150, 150) = Vector2(get_theme_constant("width", "ToySlotHand"), get_theme_constant("height", "ToySlotHand"))
        - **Picture** `TextureRect` · custom_minimum_size (111, 111) · texture `slot-empty-hand` (dist/pack/icons/slot-empty-hand.svg, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · not tinted (drawn in its own colours)
          - Note: The carried item's pack icon (icons/item-*.svg) at 111 px, else icons/slot-empty-hand.svg; never tinted.
    - **Belt** `Control` · size flags vertical `SIZE_SHRINK_END` · custom_minimum_size (126, 126)
      - **Face** `PanelContainer` · variation `ToySlotBelt` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (126, 126) = Vector2(get_theme_constant("width", "ToySlotBelt"), get_theme_constant("height", "ToySlotBelt"))
        - **Picture** `TextureRect` · custom_minimum_size (90, 90) · texture `slot-empty-belt` (dist/pack/icons/slot-empty-belt.svg, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · not tinted (drawn in its own colours)
          - Note: icons/item-*.svg at 90 px, else icons/slot-empty-belt.svg; never tinted.
  - **Protect** `PanelContainer` · variation `ToyChipLight` · anchors `center_top`, offsets 0, 165, 0, 165 (left, top, right, bottom), grow both/end
    - Note: Spawn protection: count 3, 2, 1 (one per second), then hidden. 165 px down (the sketch's 110 x 1.5), 39 px under the anger meter.
    - **Text** `Label` · variation `ToyChipLightText` · text `respawn.protected` with sample {count} = "3": en "Protected 3 s" · uk "Захист 3 с"

## Notes

- The review page emulates Godot's containers with CSS grid (expanding children share the free space by stretch ratio, never below their minimum size), so a pixel or two may differ from Godot.
- Size constants: a variation's `width`, `height`, `min_width`, `wide_width` and `wide_min_width` theme constants are read by code into `custom_minimum_size`, as the node lines give them. A Panel or PanelContainer takes no size from them on its own: an anchored Panel at offsets 0 is 0×0, a slot shrinks to its text.
- Size constants that follow the text size: `min_width` 36 (52 in the pack's `modes.textSize.large`) of ToyKeyOnDark. The large-text theme is swapped in while a screen is open, so code that sets custom_minimum_size from such a constant sets it again on `NOTIFICATION_THEME_CHANGED`.
- Icons: the tinted ones are white SVGs in `dist/pack/icons/` (the pack's copy of `pages/components/icons`, currentColor written as white): a TextureRect tints one with the `self_modulate` its line gives (the colour the page draws it in), a Button with its variation's `icon_*_color`, an OptionButton its arrow with `modulate_arrow`. The room pictograms are white copies too (`dist/pack/icons/room/`), drawn in ink: their lines give the `self_modulate`. The pack's `assets` list every icon with its tint and `svg_scale`.
- SVG import: Godot rasterises an SVG at import, so import each at `svg/scale` = the largest size it is drawn ÷ its viewBox (the largest over every screen that draws it, as the pack's `assets` give it): `mic` 1.75 (42 px), `mic-off` 1.75 (42 px), `siren-on` 0.9 (57 px), `slot-empty-belt` 1.41 (90 px), `slot-empty-hand` 1.74 (111 px).
- Boxes and grids take their gaps only from their spacing variation (ToyColumn…, ToyRow…, ToyGrid…), and a ScrollContainer the gap to its bar from ToyScroll; a box without one has a single child. No `theme_override_constants`: the theme test forbids them.

## Keys

- **Drawn** (12): `dead.also_here`, `dead.back_in`, `dead.capsule_note`, `dead.room.title`, `downed.give_up_hold`, `downed.raised_by`, `downed.time_left`, `downed.title`, `hud.roster.dead`, `hud.roster.self`, `respawn.protected`, `role.alien`.
- **Named only in the notes** (wire them too): `role.human`.

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
