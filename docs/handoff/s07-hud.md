# 7 · Round HUD

<!-- node pages/screens/build.js --handoff s7 (prime-game-ui, pages/screens/src/s07-hud.json); generated, do not edit by hand -->

The styled round hud screen from the UI track (xperiaroco2/prime-game-ui), as a Godot 4.7.2 node tree for the 1920×1080 reference.

- **Source:** `pages/screens/src/s07-hud.json`; the review page is `pages/screens/screens.html#s7`; the wireframe is section `s7` («HUD у раунді»).
- **Theme:** the Toy pack ui-1.3.0 (`dist/pack/toy.pack.json`); the variations below are `theme_type_variation` names.
- **World behind the UI** (not UI): a lit room of the level.
- **How to read it:** the roots are children of the screen's full-rect root `Control`; every property not listed keeps Godot's default; sizes and offsets are reference px. In a state's **Shown** list, the first node of each subtree gives its path from the screen root.
- **Texts** are keys of `copy/strings.csv`, and the language switches live (the Esc menu's Settings). A plain key is set as `text` and translates itself. A key with placeholders, a plural key (`tr_n`) and a key drawn in pieces are set from code with `auto_translate_mode = DISABLED`: `tr()`, then `String.format()` with the data (the samples below), rebuilt on `NOTIFICATION_TRANSLATION_CHANGED`. A "text from data" (names, the room code, times, numbers) is set in code and never translated (`auto_translate_mode = DISABLED`).

One HUD for the whole round, the MVP's (the engineer's decisions of 2026-10-20 in docs/ui-decisions.md, the sketch pages/mvp-screens frames 1, 1a, 3 and 4 at 0.75: every sketch length x 1.5). s9 hides and returns the same nodes; s1 and s6 draw them as context. Every node has mouse_filter IGNORE. The top: the bare time, the anger meter exactly centred under it, the own side at the top left, every player at the top right. No points on the HUD (they show only on the mutation workbench, s11). The HUD never shows keys, walking or running, who knocked the player down, who killed whom (the engineer, 2026-10-21), a destination or task progress. HUD edges sit 39 px in (the sketch's 26 x 1.5).

## States

| State | Page label | What it shows |
|---|---|---|
| `empty` | Порожні руки | An alien with nothing carried; the crosshair is on an extinguisher within reach; the anger is calm (the siren off). |
| `carry` | Предмети | Fireworks in the hand and a bun on the belt, each with its name tag; the anger rises (the siren on). |
| `human` | Очима людини | A human's view: the coral role sticker, the other humans tagged in the roster, a battery in the hand. A teammate's name plate keeps the old dissident mark as a visible placeholder: whether a mark over another human's head is still needed beside the roster's tag is open. |
| `hurt` | Мало здоровʼя й сил | Health at 0.22 (ramp stop 04) and stamina at 0.18. |
| `raising` | Підняття | Decided by the engineer (2026-10-06, the wave-19 question page, q9): what the raiser sees while holding Interact next to a downed player. A thin progress bar under the crosshair in place of the object name, filling at the same rate as the downed player's raise bar (s9 raise); no text. |
| `cops` | Копи за хвилину | The anger is full: the neighbours called the cops, and the whole party sees the countdown. Open: whether the round timer still shows beside the cops' minute, or only the one that ends first; how long the minute is. |

## Node tree in `empty`

- **Plates** `Control` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both
  - Note: The name plate layer (#257), under the rest of the HUD: one Plate per other player in line of sight within about 10 m. Code: position = camera.unproject_position(head + 0.35 m), the plate centred on it; hidden behind walls (raycast), beyond 10 m or behind the camera. No role, no health.
- **Hud** `Control` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both
  - **Role** `PanelContainer` · variation `ToySticker` · anchors `top_left`, offsets 39, 39, 39, 39 (left, top, right, bottom), grow end/end
    - Note: The player's own side for the round, a flat word sticker 39 px in (the sketch's 26 x 1.5): ToySticker with role.alien, ToyStickerAlert (coral) with role.human.
    - **Text** `Label` · variation `ToyStickerText` · text `role.alien`: en "Alien" · uk "Прибулець"
  - **Timer** `Label` · variation `ToyTimerBare` · anchors `center_top`, offsets 0, 33, 0, 33 (left, top, right, bottom), grow both/end · custom_minimum_size (140, 0) · text from data (auto_translate_mode = DISABLED), sample: "07:42" · horizontal_alignment `CENTER`
    - Note: The round's time left, mm:ss from code (auto_translate_mode DISABLED), every second; no plate (decided 2026-10-20): mint Rubik digits with the 6 px ink text outline, its top 33 px down (the sketch's 22 x 1.5). Rubik's digits are proportional, so the minimum width holds the widest time and the centred label never changes width.
  - **Anger** `Control` · anchors `center_top`, offsets 0, 96, 0, 96 (left, top, right, bottom), grow both/end
    - Note: The neighbours' anger, meter A (decided 2026-10-20): a zero-size point at the top centre, 96 px down (the sketch's 64 x 1.5). The track centres on it, so the bar is exactly centred under the time; the siren hangs off its right end without moving that centre. No caption, no plate. It never says what raises the anger or where (open: whether it hints the type of problem, the audit's point 3).
    - **Track** `PanelContainer` · variation `ToyBarAngerTrack` · anchors `center_top`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/end · custom_minimum_size (225, 30) = Vector2(get_theme_constant("width", "ToyBarAngerTrack"), get_theme_constant("height", "ToyBarAngerTrack"))
      - Note: The white pill track, 225 x 30 (its size constants).
      - **Fill** `ProgressBar` · variation `ToyBarAnger` · custom_minimum_size (0, 20) · value 0.08 of max_value 1, show_percentage false
        - Note: value = anger / the host's threshold (0 to 1). Ongoing mischief raises it a little at a time, a one-off (the fireworks) jumps it; fixing stops the rise and the gained anger stays (m8 §5). At 1 the neighbours call the cops (Hud/Cops).
    - **Siren** `TextureRect` · anchors `top_left`, offsets 122, -14, 179, 43 (left, top, right, bottom), grow end/end · custom_minimum_size (57, 57) · texture `siren-off` (dist/pack/icons/siren-off.svg, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · not tinted (drawn in its own colours)
      - Note: The siren, 57 px (the sketch's 38 x 1.5), 9 px right of the track's end (112.5 + 9, rounded up) and centred on its height: icons/siren-off.svg while the anger is calm (not rising), icons/siren-on.svg while it rises and when full. Never tinted.
  - **Roster** `PanelContainer` · variation `ToyRoster` · anchors `top_right`, offsets -39, 39, -39, 39 (left, top, right, bottom), grow begin/end · custom_minimum_size (285, 0) = Vector2(get_theme_constant("min_width", "ToyRoster"), 0)
    - Note: Every player of the round with the body colour (decided 2026-10-20), 39 px in at the top right; at least 285 wide (the sketch's 190 x 1.5), growing to its longest row. The rows are built from the player list in the session's order with the own row first; a row updates when a player dies, comes back or leaves. Names are data and are not cut. Open: whether the dead show here (the page shows them dimmed with a mark).
    - **Rows** `VBoxContainer` · variation `ToyColumnEight` · gaps from the variation: separation 8
      - **Row1** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
        - Note: One row: Dot is ToyRosterDot, a white disc the game tints to the player's body colour (self_modulate from data); Name is the player's name (auto_translate_mode DISABLED), the own one through hud.roster.self in ToyRosterNameSelf (green), a dead player's through hud.roster.dead in ToyRosterNameDead (lilac), else the bare name in ToyRosterName. In a human's roster the other humans and the own row carry Tag (role.human, coral); an alien's roster has no tags (humans know each other, decided 2026-10-20).
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
  - **Cross** `Panel` · variation `ToyCrosshair` · anchors `center`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (12, 12) = Vector2(get_theme_constant("width", "ToyCrosshair"), get_theme_constant("height", "ToyCrosshair"))
    - Note: The crosshair dot, centred on the screen (its size is the variation's).
  - **Aim** `PanelContainer` · variation `ToyChipPlate` · anchors `center`, offsets 0, 64, 0, 64 (left, top, right, bottom), grow both/both
    - Note: The name of the object under the crosshair within reach (an item.* key, item.extinguisher here; a mischief station or a machine takes its own key when the game adds one); hidden when nothing within reach is under the crosshair. Centred 64 px under the screen's centre, so its top is the sketch's 22 x 1.5 = 33 px under it.
    - **Text** `Label` · variation `ToyChipPlateText` · text `item.extinguisher`: en "Extinguisher" · uk "Вогнегасник"
  - **Vitals** `HBoxContainer` · variation `ToyRowTwentyFour` · anchors `bottom_left`, offsets 39, -39, 39, -39 (left, top, right, bottom), grow end/begin · gaps from the variation: separation 24
    - Note: The bars and the mic beside them, 39 px in at the bottom left (the sketch: bars 200 wide, the mic 244 in, x 1.5). Always shown in a round. No numbers and no captions on the bars (the engineer wants less screen): health is the green bar on top, stamina the yellow one under it, as everywhere in the game; the length is the real cue, the colour only adds to it.
    - **Bars** `VBoxContainer` · variation `ToyColumnTwelve` · size flags vertical `SIZE_SHRINK_END` · gaps from the variation: separation 12
      - **Health** `PanelContainer` · variation `ToyBarTrack` · custom_minimum_size (300, 24) = Vector2(300, get_theme_constant("height", "ToyBarTrack"))
        - **Fill** `ProgressBar` · variation `ToyBarHealth` · custom_minimum_size (0, 14) · value 0.8 of max_value 1, show_percentage false · fill self_modulate = theme colour `ramp_stop_16` of `ToyBarHealth` (step = clampi(floori(hp * 20.0 + 0.5), 0, 20))
          - Note: value = hp (0 to 1). The fill colour follows the fraction: step = clampi(floori(hp * 20.0 + 0.5), 0, 20), Fill.self_modulate = get_theme_color("ramp_stop_%02d" % step, "ToyBarHealth").
      - **Stamina** `PanelContainer` · variation `ToyBarTrack` · custom_minimum_size (300, 24) = Vector2(300, get_theme_constant("height", "ToyBarTrack"))
        - **Fill** `ProgressBar` · variation `ToyBarStamina` · custom_minimum_size (0, 14) · value 0.9 of max_value 1, show_percentage false
          - Note: value = stamina (0 to 1); drains while sprinting and refills at rest.
    - **Mic** `PanelContainer` · variation `ToyMic` · size flags vertical `SIZE_SHRINK_END` · custom_minimum_size (75, 75) = Vector2(get_theme_constant("width", "ToyMic"), get_theme_constant("height", "ToyMic"))
      - Note: Whether anyone hears the player. On: mic.svg tinted icon_on. Off (mic off, push-to-talk released, downed, pre and post game): mic-off.svg tinted icon_off (coral). 42 px in the 75 px badge.
      - **Icon** `TextureRect` · size flags horizontal `SIZE_SHRINK_CENTER`, vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (42, 42) · texture `mic` (dist/pack/icons/mic.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("icon_on", "ToyMic")
  - **Slots** `HBoxContainer` · variation `ToyRowSixteen` · anchors `bottom_right`, offsets -39, -51, -39, -51 (left, top, right, bottom), grow begin/begin · gaps from the variation: separation 16
    - Note: Item bar A (decided 2026-10-20): the hand slot (green, 150) and the belt slot (mint, 126) 16 px apart, bottoms aligned, 39 px from the right and 51 from the bottom (the sketch's 26 and 34 x 1.5), so a name tag clears the edge. A slot is a Control holding its face and its tag; an empty slot shows its faint palm or pocket and no tag. Two-handed carrying is the game's data (which items take two hands); the slot does not widen. The pictures (pack icons, never tinted) and the item.* key of each MVP item: item-battery item.battery, item-flower item.flower, item-car-part item.car_part, item-bun item.bun, item-patty item.patty, item-burger item.burger, item-watering-can item.watering_can, item-wrench item.tools (the garage's cabled tools), item-bin-bag item.rubbish, item-extinguisher item.extinguisher, item-rocket item.fireworks; item-knife item.knife only if a knife stays in the MVP (weapons are deferred, open).
    - **Hand** `Control` · size flags vertical `SIZE_SHRINK_END` · custom_minimum_size (150, 150)
      - **Face** `PanelContainer` · variation `ToySlotHand` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (150, 150) = Vector2(get_theme_constant("width", "ToySlotHand"), get_theme_constant("height", "ToySlotHand"))
        - **Picture** `TextureRect` · custom_minimum_size (111, 111) · texture `slot-empty-hand` (dist/pack/icons/slot-empty-hand.svg, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · not tinted (drawn in its own colours)
          - Note: The carried item's pack icon (icons/item-*.svg) at 111 px, else icons/slot-empty-hand.svg; never tinted.
    - **Belt** `Control` · size flags vertical `SIZE_SHRINK_END` · custom_minimum_size (126, 126)
      - **Face** `PanelContainer` · variation `ToySlotBelt` · anchors `full_rect`, offsets 0, 0, 0, 0 (left, top, right, bottom), grow both/both · custom_minimum_size (126, 126) = Vector2(get_theme_constant("width", "ToySlotBelt"), get_theme_constant("height", "ToySlotBelt"))
        - **Picture** `TextureRect` · custom_minimum_size (90, 90) · texture `slot-empty-belt` (dist/pack/icons/slot-empty-belt.svg, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · not tinted (drawn in its own colours)
          - Note: icons/item-*.svg at 90 px, else icons/slot-empty-belt.svg; never tinted.

## `carry`: what differs from `empty`

- **Hidden:** `Hud/Aim`.
- **Changed** `Hud/Anger/Track/Fill`: value 0.55 of max_value 1, show_percentage false (was: value 0.08 of max_value 1, show_percentage false)
- **Changed** `Hud/Anger/Siren`: texture `siren-on` (dist/pack/icons/siren-on.svg, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` (was: texture `siren-off` (dist/pack/icons/siren-off.svg, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED`)
- **Changed** `Hud/Slots/Hand/Face/Picture`: texture `item-rocket` (dist/pack/icons/item-rocket.svg, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` (was: texture `slot-empty-hand` (dist/pack/icons/slot-empty-hand.svg, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED`)
- **Changed** `Hud/Slots/Belt/Face/Picture`: texture `item-bun` (dist/pack/icons/item-bun.svg, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` (was: texture `slot-empty-belt` (dist/pack/icons/slot-empty-belt.svg, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED`)
- **Shown:**
  - **Hud/Slots/Hand/Tag** `PanelContainer` · variation `ToySlotTag` · anchors `center_bottom`, offsets 0, 18, 0, 18 (left, top, right, bottom), grow both/begin
    - Note: The carried item's name tag over the slot's bottom edge, centred, its bottom 18 px below the face: the item's item.* key (item.fireworks here). Hidden while the slot is empty.
    - **Text** `Label` · variation `ToySlotTagText` · text `item.fireworks`: en "Fireworks" · uk "Феєрверк"
  - **Hud/Slots/Belt/Tag** `PanelContainer` · variation `ToySlotTag` · anchors `center_bottom`, offsets 0, 18, 0, 18 (left, top, right, bottom), grow both/begin
    - Note: As the hand's Tag (item.bun here).
    - **Text** `Label` · variation `ToySlotTagText` · text `item.bun`: en "Bun" · uk "Булка"

## `human`: what differs from `empty`

- **Hidden:** `Hud/Aim`.
- **Changed** `Hud/Role`: variation `ToyStickerAlert` (was: variation `ToySticker`)
- **Changed** `Hud/Role/Text`: text `role.human`: en "Human" · uk "Людина" (was: text `role.alien`: en "Alien" · uk "Прибулець")
- **Changed** `Hud/Anger/Track/Fill`: value 0.55 of max_value 1, show_percentage false (was: value 0.08 of max_value 1, show_percentage false)
- **Changed** `Hud/Anger/Siren`: texture `siren-on` (dist/pack/icons/siren-on.svg, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` (was: texture `siren-off` (dist/pack/icons/siren-off.svg, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED`)
- **Changed** `Hud/Roster/Rows/Row1/Dot`: self_modulate from data (a content colour, not a theme colour), sample #E8B04A (was: self_modulate from data (a content colour, not a theme colour), sample #7C5CC8)
- **Changed** `Hud/Roster/Rows/Row1/Name`: text `hud.roster.self` with sample {name} = "Bulk" / "Бульк": en "Bulk (you)" · uk "Бульк (ти)" (was: text `hud.roster.self` with sample {name} = "Olena" / "Олена": en "Olena (you)" · uk "Олена (ти)")
- **Changed** `Hud/Roster/Rows/Row2/Dot`: self_modulate from data (a content colour, not a theme colour), sample #7C5CC8 (was: self_modulate from data (a content colour, not a theme colour), sample #1C7A82)
- **Changed** `Hud/Roster/Rows/Row2/Name`: text from data (auto_translate_mode = DISABLED), sample: "Olena" / "Олена" (was: text from data (auto_translate_mode = DISABLED), sample: "Glorp" / "Глорп")
- **Changed** `Hud/Roster/Rows/Row3/Dot`: self_modulate from data (a content colour, not a theme colour), sample #1C7A82 (was: self_modulate from data (a content colour, not a theme colour), sample #E66B57)
- **Changed** `Hud/Roster/Rows/Row3/Name`: text from data (auto_translate_mode = DISABLED), sample: "Glorp" / "Глорп" (was: text from data (auto_translate_mode = DISABLED), sample: "Yizhak" / "Їжак")
- **Changed** `Hud/Roster/Rows/Row4/Dot`: self_modulate from data (a content colour, not a theme colour), sample #E66B57 (was: self_modulate from data (a content colour, not a theme colour), sample #E8B04A)
- **Changed** `Hud/Roster/Rows/Row4/Name`: text from data (auto_translate_mode = DISABLED), sample: "Yizhak" / "Їжак" (was: text from data (auto_translate_mode = DISABLED), sample: "Bulk" / "Бульк")
- **Changed** `Hud/Slots/Hand/Face/Picture`: texture `item-battery` (dist/pack/icons/item-battery.svg, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` (was: texture `slot-empty-hand` (dist/pack/icons/slot-empty-hand.svg, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED`)
- **Shown:**
  - **Plates/Plate** `PanelContainer` · variation `ToyNamePlate` · anchors `top_left`, offsets 538, 302, 538, 302 (left, top, right, bottom), grow both/both
    - Note: One instance per visible player, moved every frame to the projected point (the sample sits over another human at about 538, 302).
    - **Row** `HBoxContainer` · variation `ToyRowTwelve` · gaps from the variation: separation 12
      - **Name** `Label` · variation `ToyNamePlateText` · text from data (auto_translate_mode = DISABLED), sample: "Zinga" / "Зінга"
        - Note: The player's name from code (auto_translate_mode DISABLED); no translated text.
      - **Mark** `TextureRect` · size flags vertical `SIZE_SHRINK_CENTER` · custom_minimum_size (30, 30) · texture `teammate-mark` (dist/pack/icons/teammate-mark.svg, white, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` · self_modulate = get_theme_color("font_color", "ToyNamePlateText")
        - Note: PLACEHOLDER, open: the old dissident mark, on a human's client over another human only. Whether a mark over another human's head is still needed beside the roster's tag is the engineer's choice; drop this node if not.
  - **Hud/Roster/Rows/Row1/Tag** `PanelContainer` · variation `ToyRosterTag` · size flags vertical `SIZE_SHRINK_CENTER`
    - **Text** `Label` · variation `ToyRosterTagText` · text `role.human`: en "Human" · uk "Людина"
  - **Hud/Roster/Rows/Row5/Tag** `PanelContainer` · variation `ToyRosterTag` · size flags vertical `SIZE_SHRINK_CENTER`
    - **Text** `Label` · variation `ToyRosterTagText` · text `role.human`: en "Human" · uk "Людина"
  - **Hud/Slots/Hand/Tag** `PanelContainer` · variation `ToySlotTag` · anchors `center_bottom`, offsets 0, 18, 0, 18 (left, top, right, bottom), grow both/begin
    - Note: The carried item's name tag over the slot's bottom edge, centred, its bottom 18 px below the face: the item's item.* key (item.fireworks here). Hidden while the slot is empty.
    - **Text** `Label` · variation `ToySlotTagText` · text `item.battery`: en "Battery" · uk "Батарейка"

## `hurt`: what differs from `empty`

- **Hidden:** `Hud/Aim`.
- **Changed** `Hud/Anger/Track/Fill`: value 0.55 of max_value 1, show_percentage false (was: value 0.08 of max_value 1, show_percentage false)
- **Changed** `Hud/Anger/Siren`: texture `siren-on` (dist/pack/icons/siren-on.svg, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` (was: texture `siren-off` (dist/pack/icons/siren-off.svg, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED`)
- **Changed** `Hud/Vitals/Bars/Health/Fill`: value 0.22 of max_value 1, show_percentage false · fill self_modulate = theme colour `ramp_stop_04` of `ToyBarHealth` (step = clampi(floori(hp * 20.0 + 0.5), 0, 20)) (was: value 0.8 of max_value 1, show_percentage false · fill self_modulate = theme colour `ramp_stop_16` of `ToyBarHealth` (step = clampi(floori(hp * 20.0 + 0.5), 0, 20)))
- **Changed** `Hud/Vitals/Bars/Stamina/Fill`: value 0.18 of max_value 1, show_percentage false (was: value 0.9 of max_value 1, show_percentage false)

## `raising`: what differs from `empty`

- **Hidden:** `Hud/Aim`.
- **Changed** `Hud/Anger/Track/Fill`: value 0.55 of max_value 1, show_percentage false (was: value 0.08 of max_value 1, show_percentage false)
- **Changed** `Hud/Anger/Siren`: texture `siren-on` (dist/pack/icons/siren-on.svg, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` (was: texture `siren-off` (dist/pack/icons/siren-off.svg, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED`)
- **Shown:**
  - **Hud/Raising** `PanelContainer` · variation `ToyPlate` · anchors `center`, offsets 0, 64, 0, 64 (left, top, right, bottom), grow both/both
    - Note: See the state raising. Shown while the player holds Interact on a downed player, in place of Aim; hidden when the key is released or the player is up. Its top sits as Aim's.
    - **Bar** `ProgressBar` · variation `ToyBarProgress` · custom_minimum_size (360, 24) · value 0.6 of max_value 1, show_percentage false
      - Note: The raise progress (0 to 1), the same value the downed player's s9 Downed/V/Raise shows.

## `cops`: what differs from `empty`

- **Hidden:** `Hud/Aim`.
- **Changed** `Hud/Timer`: text from data (auto_translate_mode = DISABLED), sample: "04:12" (was: text from data (auto_translate_mode = DISABLED), sample: "07:42")
- **Changed** `Hud/Anger/Track/Fill`: value 1 of max_value 1, show_percentage false (was: value 0.08 of max_value 1, show_percentage false)
- **Changed** `Hud/Anger/Siren`: texture `siren-on` (dist/pack/icons/siren-on.svg, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED` (was: texture `siren-off` (dist/pack/icons/siren-off.svg, own work), expand_mode `EXPAND_IGNORE_SIZE`, stretch_mode `STRETCH_KEEP_ASPECT_CENTERED`)
- **Shown:**
  - **Hud/Cops** `PanelContainer` · variation `ToyPlateBanner` · anchors `center_top`, offsets 0, 168, 0, 168 (left, top, right, bottom), grow both/end
    - Note: The cops' minute (m8 §5.3): when the anger fills, the neighbours call the cops and every player sees this coral banner, 168 px down (the sketch's 112 x 1.5), until the cops arrive (the round ends, s10 cops) or the aliens finish first. Stalling the cops is not in the MVP.
    - **V** `VBoxContainer` · variation `ToyColumnFour` · gaps from the variation: separation 4
      - **Title** `Label` · variation `ToyPlateTitle` · text `hud.cops.title`: en "The neighbours called the cops!" · uk "Сусіди викликали копів!" · horizontal_alignment `CENTER`
      - **In** `Label` · variation `ToyPlateText` · text `hud.cops.in`: en "The cops arrive in" · uk "Копи будуть за" · horizontal_alignment `CENTER`
      - **Count** `Label` · variation `ToyPlateCountdown` · text from data (auto_translate_mode = DISABLED), sample: "0:58" · horizontal_alignment `CENTER`
        - Note: The time until the cops arrive, m:ss from code (auto_translate_mode DISABLED), every second.

## Notes

- The review page emulates Godot's containers with CSS grid (expanding children share the free space by stretch ratio, never below their minimum size), so a pixel or two may differ from Godot.
- Size constants: a variation's `width`, `height`, `min_width`, `wide_width` and `wide_min_width` theme constants are read by code into `custom_minimum_size`, as the node lines give them. A Panel or PanelContainer takes no size from them on its own: an anchored Panel at offsets 0 is 0×0, a slot shrinks to its text.
- Icons: the tinted ones are white SVGs in `dist/pack/icons/` (the pack's copy of `pages/components/icons`, currentColor written as white): a TextureRect tints one with the `self_modulate` its line gives (the colour the page draws it in), a Button with its variation's `icon_*_color`, an OptionButton its arrow with `modulate_arrow`. The room pictograms are white copies too (`dist/pack/icons/room/`), drawn in ink: their lines give the `self_modulate`. The pack's `assets` list every icon with its tint and `svg_scale`.
- SVG import: Godot rasterises an SVG at import, so import each at `svg/scale` = the largest size it is drawn ÷ its viewBox (the largest over every screen that draws it, as the pack's `assets` give it): `item-battery` 1.74 (111 px), `item-bun` 1.74 (111 px), `item-rocket` 1.74 (111 px), `mic` 1.75 (42 px), `siren-off` 0.9 (57 px), `siren-on` 0.9 (57 px), `slot-empty-belt` 1.41 (90 px), `slot-empty-hand` 1.74 (111 px), `teammate-mark` 1.25 (30 px).
- Boxes and grids take their gaps only from their spacing variation (ToyColumn…, ToyRow…, ToyGrid…), and a ScrollContainer the gap to its bar from ToyScroll; a box without one has a single child. No `theme_override_constants`: the theme test forbids them.

## Keys

- **Drawn** (10): `hud.cops.in`, `hud.cops.title`, `hud.roster.dead`, `hud.roster.self`, `item.battery`, `item.bun`, `item.extinguisher`, `item.fireworks`, `role.alien`, `role.human`.
- **Named only in the notes** (wire them too): `item.burger`, `item.car_part`, `item.flower`, `item.knife`, `item.patty`, `item.rubbish`, `item.tools`, `item.watering_can`.

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
