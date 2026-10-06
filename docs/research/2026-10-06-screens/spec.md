# Styled screens: the screen spec (wave prime-game-ui#19)

The document the five screen authors build from: per screen, its states and the Godot node outline of each state, with
the Toy variations of `dist/pack/toy.pack.json` (`ui-0.1.2`), the keys of `copy/strings.csv` and the decisions of
`docs/ui-decisions.md` (they win over the wireframes). The gaps (new variations, new keys, icons) are at the end; a new
variation or key is used in the outlines under its proposed name and marked **NEW**.

Read: §0 and §1 (everyone), then your screens, then §12 for the names you use.

## 0. Conventions

**Frame.** 1920×1080 reference px, `stretch_mode canvas_items`, `aspect expand` (#287). Every screen is a `Control`
root with `PRESET_FULL_RECT` under `GameUi`. Positions are a LayoutPreset plus offsets in px at that frame; HUD edges sit
40 px in (agent). Theme sizes are ints.

**Outline notation** (one node per line, children indented two spaces):

```
Name: Type(Variation) `key` {placeholder}="sample" · props   // developer note
```

- Types: `VBox`/`HBox`/`Grid`/`Scroll`/`Center` = VBoxContainer/HBoxContainer/GridContainer/ScrollContainer/
  CenterContainer; other names are Godot classes.
- `Raised[Base] > Face` = the ToyRaised `MarginContainer` (spec §6): first the base `Panel(Base)` with
  `mouse_filter IGNORE`, then the face.
- `Btn(Var)` = a Button made by `UiParts.button()` (#289): it adds ToyRaised and ToyPress when the variation has a
  `base` hint (Primary, Secondary, Danger, preset cards) and ToyToggle when it has a `toggle` hint.
- `Key(Var) "E"` = `PanelContainer(Var) > Label(ToyKeyText)`; the text is the bound key's label (§1 P3).
- `Plate(Var) > Label(Var2)` = a static PanelContainer with one Label (chips, plates).
- Spacing: `VBox(ToyColumn16)`, `HBox(ToyRow8)`, `Grid(ToyGridList)`: **NEW** container variations (§12.1); screen code
  sets no `separation` override (the theme test forbids overrides).
- `@TOP_LEFT (x, y)`, `@CENTER_TOP y`, `@BOTTOM_RIGHT (-x, -y)`, `@CENTER`: the preset and its offsets; `min W×H` is
  `custom_minimum_size`; `grow both` = `grow_horizontal BOTH`.
- A key in backticks is a deck key; **NEW** keys are in §12.2. Samples are the wireframes' (Ukrainian).
- State names in `code` are the page's state ids.

**Rules for every screen.**
- Text: `tr()` then `String.format()`; counted strings through `tr_n` (`lobby.need_more`). Rebuild on
  `NOTIFICATION_TRANSLATION_CHANGED`. Player names, the lobby name, the code and the game name use
  `auto_translate_mode = DISABLED`.
- Large text (the Accessibility setting, ×1.25 for 18-36 px, 48 px and up unchanged) swaps the theme: no fixed
  heights on text containers, `autowrap_mode WORD_SMART` on every body Label, widths as minimums.
- No `add_theme_*_override`, no `Color(...)`: tints come from `get_theme_color(..)` or content data (body colours).
- Icons are own-work SVGs (§12.3) drawn in one colour (`currentColor`, imported white) and tinted with
  `self_modulate` from the theme colour named in the outline. The room icons are ink and are not tinted.
- HUD nodes: `mouse_filter IGNORE`. Menus: the first primary button takes focus on open; `ui_cancel` = Back or Close.
- Focus, hover, held and disabled looks are the variations' own (spec §4.17); a state is drawn only when the outline
  names it.

## 1. Shared parts

Defined once; the screens refer to them as P1-P8.

**P1 Dialog** (the host's leave confirm):
```
Dim: Panel(ToyBackdrop) · @FULL_RECT
Box: Raised[ToyBasePanel] · @CENTER · min 720×0 · grow both
  Face: PanelContainer(ToyPanelDialog)
    V: VBox(ToyColumn16)
      Title: Label(ToyTitleOnLight)
      Body: Label(ToyTextOnLight) · autowrap
      Buttons: HBox(ToyRow16) · alignment END
        Confirm: Btn(ToyButtonDanger)
        Cancel: Btn(ToyButtonGhostOnLight) `common.cancel` · focus on open
```

**P2 Night screen** (connecting, failures, loading, pre game, post game):
`Night: Panel(ToyBackdropNight) · @FULL_RECT` (opaque; the style's darkest, used as the decided black).

**P3 Sentence with a keycap** (tutorial steps, downed): the translated string is split at `{key}` and drawn as
`HBox(ToyRow8) · alignment CENTER` of `Label` pieces and a `Key`. On dark: `Label(ToyTextOnDark)` + `Key(ToyKeyOnDark)`;
on light: `Label(ToyTextOnLight)` + `Key(ToyKeyOnLight)`. The key text is
`DisplayServer.keyboard_get_label_from_physical()` of the action's binding (#211); Space and the mouse buttons use
`key.space`, `key.mouse_left`, `key.mouse_right` (**NEW**). Space, Shift, Tab and Esc keycaps are at least 96 px wide
([Style › Toy look details]).

**P4 Mic**: `Mic: PanelContainer(ToyMic) · 46×46 > Icon: TextureRect · 28×28 · keep centered`. On: `mic.svg`,
`self_modulate = get_theme_color("icon_on", "ToyMic")`. Off (nobody hears you: mic off, push-to-talk released, downed,
pre and post game): `mic-off.svg`, `icon_off` (coral).

**P5 Crosshair**: `Cross: Panel(ToyCrosshair) · @CENTER · 8×8`.

**P6 Name plate** (#257): a 2D plate projected over each other player in line of sight within about 10 m.
```
Plate: PanelContainer(ToyNamePlate) · grow both
  H: HBox(ToyRow8)
    Name: Label(ToyNamePlateText) "Тарас"
    Mark: TextureRect `teammate-mark.svg` · 20×20 · self_modulate = font_color of ToyNamePlateText   // only on a dissident's client, only for a teammate
```
Code: position = `camera.unproject_position(head + 0.35 m)`, centred; hidden behind walls (raycast), beyond 10 m or
behind the camera. No role, no health.

**P7 HUD bar** (health, stamina): spec §4.5.
```
Bar: VBox(ToyColumn4) · min 320×0
  Cap: PanelContainer(ToyBarLabel) > Label(ToyHudCaption) `hud.health` | `hud.stamina` · size_flags SHRINK_BEGIN
  Track: PanelContainer(ToyBarTrack) · min 320×16
    Fill: ProgressBar(ToyBarHealth | ToyBarStamina) · show_percentage false · min 0×10 · max 1.0
```
Health: `step = clampi(floori(hp * 20.0 + 0.5), 0, 20)`, `Fill.self_modulate =
get_theme_color("ramp_stop_%02d" % step, &"ToyBarHealth")`. No numbers.

**P8 How-to card** (map «?», loading screen, Esc Guide), spec §4.8:
```
Card: Raised[ToyBasePanel]
  Face: PanelContainer(ToyPanelHowto)
    V: VBox(ToyColumn16)
      Head: HBox(ToyRow16)
        Title: Label(ToyTitleOnLight) `task.switches` · expand
        Note: Label(ToyHowtoNote) `howto.label` · size_flags SHRINK_CENTER
      Frames: HBox(ToyRow12)
        Frame×3-4: PanelContainer(ToyHowtoFrame) · expand · ratio 1   // the last frame, when it shows the finish: ToyHowtoFrameDone (agent)
          F: VBox(ToyColumn8)
            Art: TextureRect · expand KEEP_ASPECT_CENTERED · min 0×120   // placeholder art (item.svg, check.svg) until the card art (prime-game-ui#3)
            Caption: Label(ToyHowtoCaption) · autowrap · center
```
Switches: `howto.switches.find`, `.turn_on`, `.watch`, `.done` (done frame). Delivery (**NEW**):
`howto.delivery.take`, `.sign`, `.find`, `.drop` (done frame). A card is content data per task type (#254).

---

## 2. s1 Tutorial

Purpose: on the first launch, the invite with the language choice; in the tutorial room, the current lesson and the
lesson list.

States: `invite`, `step` (a lesson with one key), `step-keys` (the Controls lesson: a row of keycaps).

### invite
```
Root: Control · @FULL_RECT   // over the tutorial room
  Dim: Panel(ToyBackdrop) · @FULL_RECT
  Lang: HBox(ToyRow8) · @TOP_RIGHT (-40, 40) · grow left
    Uk: Btn(ToyChipToggleOnDark → Selected) `lang.uk` · selected
    En: Btn(ToyChipToggleOnDark) `lang.en`   // one ButtonGroup; default from OS.get_locale_language() == "uk"; applies live (TranslationServer.set_locale) and is saved
  Box: Raised[ToyBasePanel] · @CENTER · min 690×0 · grow both
    Face: PanelContainer(ToyPanelDialog)
      V: VBox(ToyColumn16) · alignment CENTER
        Title: Label(ToyTitleOnLight) `tutorial.invite.title` · center
        Body: Label(ToyTextMutedOnLight) `tutorial.invite.body` · center · autowrap
        Buttons: HBox(ToyRow16) · alignment CENTER
          Start: Btn(ToyButtonPrimary) `tutorial.invite.start` · focus
          Skip: Btn(ToyButtonGhostOnLight) `tutorial.invite.skip`
```
Code: shown once, on the first launch (a `user://` flag). Start → lesson 1. Skip → s2. The main menu's
`menu.tutorial` starts lesson 1 without the invite.

### step
```
Root: Control · @FULL_RECT   // the round HUD of s7 shows too, without the timer and the role chip
  Cross: P5
  Step: PanelContainer(ToyPlate) · @CENTER_TOP y 54 · min 845×0 · grow both
    V: VBox(ToyColumn8) · alignment CENTER
      Progress: Label(ToyTextMutedOnDark) `tutorial.step.progress` {count}=2 {total}=9 · center
      Title: Label(ToyTitleOnDark) `tutorial.step.pick_up.title` · center · autowrap
      How: P3 on dark `tutorial.step.pick_up.how` {key}=E
  List: PanelContainer(ToyPlate) · @TOP_RIGHT (-40, 259) · min 384×0 · grow left
    V: VBox(ToyColumn8)
      Head: Label(ToyTextOnDark) `tutorial.list.title`
      Done: HBox(ToyRow8) > Icon: TextureRect check.svg 20×20 (tint: font_color of ToyTextOnDark) + Label(ToyTextOnDark) `tutorial.list.move`
      Now: Plate(ToyChipLight) > Label(ToyChipLightText) `tutorial.list.pick_up` · size_flags SHRINK_BEGIN
      Next×7: Label(ToyTextMutedOnDark) `tutorial.list.hand_belt`, `.deliver`, `.map` {key}=M, `.downed`, `.death`, `.voice`, `.menu`
```
Code: a lesson advances when the game sees the action; a lesson with two instructions swaps Title and How in the same
step number. The list is not clickable.

Lessons (step `{count}` of 9; titles and hows **NEW** except pick_up's):

| # | List key | Instruction 1: title / how {key} | Instruction 2 |
|---|---|---|---|
| 1 | `tutorial.list.move` | `tutorial.step.move.title` / key row (state `step-keys`) | – |
| 2 | `tutorial.list.pick_up` | `tutorial.step.pick_up.title` / `.pick_up.how` interact E | `tutorial.step.put_down.title` / `tutorial.step.press` put_down Q |
| 3 | `tutorial.list.hand_belt` | `tutorial.step.hand_belt.title` / `tutorial.step.press` swap X | – |
| 4 | `tutorial.list.deliver` | `tutorial.step.deliver.title` / `tutorial.step.deliver.how` (no key) | – |
| 5 | `tutorial.list.map` | `tutorial.step.map.title` / `tutorial.step.press` map M | `tutorial.step.howto.title` / `tutorial.step.howto.how` with the round «?» (`Key(ToyKeyRound) "?"`) |
| 6 | `tutorial.list.downed` | `tutorial.step.downed.title` / `tutorial.step.downed.how` interact E | – |
| 7 | `tutorial.list.death` | `tutorial.step.death.title` / `tutorial.step.death.how` spectate_next `key.mouse_left` | – |
| 8 | `tutorial.list.voice` | `tutorial.step.voice.title` / `tutorial.step.voice.how` (no key) | – |
| 9 | `tutorial.list.menu` | `tutorial.step.menu.title` / `tutorial.step.press` Esc (wide) | – |

After lesson 9 the game returns to s2 with no end screen (agent).

### step-keys
As `step`, with Progress `{count}=1`, Title `tutorial.step.move.title`, the list's first row as Now, and How replaced by:
```
How: HBox(ToyRow24) · alignment CENTER
  Walk: HBox(ToyRow8) > Keys: HBox(ToyRow4) > Key(ToyKeyOnDark)×4 "W" "A" "S" "D" ; Label(ToyTextOnDark) `control.walk`
  Sprint: HBox(ToyRow8) > Key(ToyKeyOnDark) "Shift" (min 96) ; Label(ToyTextOnDark) `control.sprint`
  Jump: HBox(ToyRow8) > Key(ToyKeyOnDark) `key.space` (min 96) ; Label(ToyTextOnDark) `control.jump`
```

The Esc menu in the tutorial: s5 `tutorial-game`.

**Decisions:** [Learning › Tutorial] (separate room, skippable, first launch; teaches the basics and «M, then ?»);
[Principles] (keys only in learning; English and Ukrainian with a first-launch choice); [Texts] (one «Керування» lesson,
no sprint-and-jump or "new task" lesson; sentence case).

---

## 3. s2 Main menu

Purpose: the player's name, then host, join with a code, join or host directly, the tutorial, settings, quit, over the
live lobby.

States: `main`, `code` (Join with a code, empty), `code-ready` (6 characters typed), `direct`, `settings`.

### main
```
Root: Control · @FULL_RECT   // the lobby world behind, an idle camera
  Dim: Panel(ToyBackdrop) · @FULL_RECT
  Column: VBox(ToyColumn8) · @TOP_LEFT (134, 259) · min 576×0
    Logo: Label(ToyLogo) "prime-game"   // the game's name, not a key (working title)
    NameRow: HBox(ToyRow12) · margin top 16 (a 16 px spacer)
      Label(ToyTextMutedOnDark) `player.name`
      Name: LineEdit(ToyField) "Олена" · expand · max_length per the game   // never empty: the last name or the system user name
    Items: VBox(ToyColumn4) · margin top 16
      Host: Btn(ToyMenuItem NEW) `menu.host` · focus (pointer shown)
      Join: Btn(ToyMenuItem) `menu.join` (changed: «Приєднатися за кодом») · toggle
      Direct: Btn(ToyMenuItem) `menu.direct` NEW · toggle
      Tutorial: Btn(ToyMenuItem) `menu.tutorial`
      Settings: Btn(ToyMenuItem) `menu.settings` · toggle
      Quit: Btn(ToyMenuItem) `menu.quit`
  Version: Label(ToyHudCaption) `menu.version` {version}="0.4" · @BOTTOM_RIGHT (-40, -32) · grow left
```
ToyMenuItem shows the `pointer.svg` icon on hover, focus and pressed (its icon colours, §12.1), so the open item keeps
its marker. Join, Direct and Settings are one ButtonGroup with `allow_unpress`: pressing opens their panel, pressing
again or Back closes it. Host hosts with a code (WebRTC) and goes straight to the lobby (s4). Tutorial loads lesson 1.

### code
`main`, Join pressed, plus:
```
  Panel: Raised[ToyBasePanel] · @TOP_LEFT (845, 367) · min 576×0
    Face: PanelContainer(ToyPanelMenu)
      V: VBox(ToyColumn16)
        Title: Label(ToyTitleOnLight) `menu.join`
        CodeLabel: Label(ToyTextMutedOnLight) `common.code` NEW
        Code: LineEdit(ToyField) "" · focus · max_length 6
        Buttons: HBox(ToyRow16)
          Join: Btn(ToyButtonPrimary) `join.connect` · expand · disabled (unplugged)
          Back: Btn(ToyButtonGhostOnLight) `common.back`
```
Code: the field upper-cases, drops spaces and dashes on paste, accepts only the 31-letter alphabet (no 0, O, 1, I, L)
and keeps what was typed after a failure (M6 §3 item 5); Join is enabled at 6 valid characters; Enter = Join → s3.

### code-ready
As `code` with Code "K7Q2XR" showing its focus ring and Join enabled (normal).

### direct
`main`, Direct pressed, plus the same Panel with:
```
        Title: Label(ToyTitleOnLight) `menu.direct`
        AddrLabel: Label(ToyTextMutedOnLight) `join.address`
        Address: LineEdit(ToyField) "192.168.0.12" · focus
        Port: Label(ToyTextMutedOnLight) `join.port` {port}=7777
        Buttons: HBox(ToyRow16)
          Join: Btn(ToyButtonPrimary) `join.connect` · expand   // disabled while Address is empty
          Host: Btn(ToyButtonSecondary) `menu.host`
          Back: Btn(ToyButtonGhostOnLight) `common.back`
```
Code: Address takes `host` or `host:port`, host names included (JoinTarget; playit.gg works); Port shows the default
used when none is typed. Join → s3 over ENet. Host = Host Direct (ENet) on that port → s4 with no code row.

### settings
`main`, Settings pressed, plus:
```
  Panel: Raised[ToyBasePanel] · @TOP_LEFT (845, 97) · 941×886
    Face: PanelContainer(ToyPanelMenu)
      V: VBox(ToyColumn16)
        Title: Label(ToyTitleOnLight) `esc.tab.settings`
        (s5 Settings subtree, state settings-sound)
```
The same panel code as the Esc menu's Settings (#301): the mic, the mode, the threshold with its live meter, noise
suppression and the volumes work without a session; nothing is sent.

**Decisions:** [Screens › Main menu] (A Short Hike's few words; host, join, tutorial, settings, quit; no server
browser), the join with a code (prime-game M6 §2.3 and §3 items 1 and 5, #373), #301 (voice settings before joining),
[Style › Toy look details] (focus ring, quiet hover fill on flat controls on dark, unplugged disabled), [Texts] (sentence
case).

---

## 4. s3 Connecting, failures and loading

Purpose: what the join is doing, why it failed (and why a session ended), then the map loading with the players and a
tip or a how-to card.

States: `finding`, `joined`, `fail-no-room`, `fail-started`, `fail-version`, `fail-full`, `fail-service`,
`fail-unreachable`, `fail-no-answer`, `lost`, `map-failed`, `error`, `host-failed`, `load`, `load-card`.

### finding (and the other connecting steps)
```
Root: Control · @FULL_RECT
  Night: P2
  V: VBox(ToyColumn16) · @CENTER · min 768×0 · grow both · alignment CENTER
    Spinner: Panel(ToySpinner) · 90×90 · size_flags SHRINK_CENTER   // turns once a second about its centre (pivot_offset_ratio 0.5, 0.5); half speed under reduced motion
    Title: Label(ToyTitleOnDark) `connect.connecting_unnamed` · center · autowrap
    Step: Label(ToyTextOnDark) `connect.step.finding` NEW · center
    CodeRow: HBox(ToyRow8) · alignment CENTER   // code joins only; a Direct join shows no address (agent: no address on screen)
      Label(ToyTextMutedOnDark) `common.code`
      Key(ToyKeyOnDark) "K7Q2XR"
    Elapsed: Label(ToyTextMutedOnDark) "0:04" · center   // m:ss since Join, not a key
    Cancel: Btn(ToyButtonGhostOnDark) `common.cancel` · size_flags SHRINK_CENTER · focus
```
Step text from `JoinProgress.step()`: FINDING → `connect.step.finding`, CONNECTING → `connect.step.connecting`,
JOINED → `connect.step.joined` (all **NEW**). Title: `connect.connecting_unnamed` until the host's name arrives (#214),
then `connect.connecting` {lobby}. Cancel aborts and returns to s2 with the field kept. The traversal timeout is the
game's (M6 §2.3).

### joined
As `finding` with Title `connect.connecting` {lobby}="Лобі Олени" and Step `connect.step.joined`.

### fail-* (one layout, eleven states)
```
Root: Control · @FULL_RECT
  Night: P2
  V: VBox(ToyColumn16) · @CENTER · min 845×0 · grow both · alignment CENTER
    Title: Label(ToyTitleOnDark) · center · autowrap
    Body: Label(ToyTextMutedOnDark) · center · autowrap
    Versions: VBox(ToyColumn4) · alignment CENTER   // fail-version only, when the versions are known
      Label(ToyTextOnDark) `connect.fail.version_host` {version}="0.5 (a1b2c3)"
      Label(ToyTextOnDark) `connect.fail.version_own` {version}="0.4 (9f8e7d)"
    Buttons: HBox(ToyRow16) · alignment CENTER
      Primary: Btn(ToyButtonPrimary) · focus   // absent when the table says –
      Back: Btn(ToyButtonGhostOnDark) `common.back`   // ToyButtonSecondary with focus when it is the only button
```

| State | Game reasons (EndReasons ids) | Title | Body | Primary |
|---|---|---|---|---|
| `fail-no-room` | no_room | `connect.fail.title` | `connect.fail.no_room` | – |
| `fail-started` | joins_closed | `connect.fail.title` | `connect.fail.started` | `connect.fail.retry` |
| `fail-version` | wrong_version, wrong_content, service_refused, unknown_map | `connect.fail.title` | `connect.fail.version` + Versions | – |
| `fail-full` | full | `connect.fail.title` | `connect.fail.full` | `connect.fail.retry` |
| `fail-service` | service_unreachable | `connect.fail.title` | `connect.fail.service` | `connect.fail.direct` |
| `fail-unreachable` | host_unreachable | `connect.fail.title` | `connect.fail.unreachable` | `connect.fail.direct` |
| `fail-no-answer` | connect_failed (Direct) | `connect.fail.title` | `connect.fail.body` | `connect.fail.retry` |
| `lost` | host_lost | `connect.lost.title` | `connect.lost.body` | – |
| `map-failed` | load_failed, load_deadline | `connect.map_fail.title` | `connect.map_fail.body` | – |
| `error` | row_error, own_client_malformed, own_client_disconnected | `connect.error.title` | `connect.error.body` | – |
| `host-failed` | cannot_host | `connect.host_fail.title` | `connect.error.body` | `connect.fail.retry` |
| (none) | left, closed | – | – | straight to s2 |

All new keys except `connect.fail.title`, `.body`, `.retry`. Code: Back → s2 with the code or address kept (M6 §3
item 5); `connect.fail.direct` → s2 `direct` (the code stays in its field); Retry → the same target again. Versions:
`{version}` is what the game can name (protocol and content text from `JoinProgress.found_detail`); hidden when unknown.
`lost`, `map-failed` and `error` end a session that was running, so they show from the lobby or a round.

### load
```
Root: Control · @FULL_RECT
  Night: P2
  V: VBox(ToyColumn16) · @CENTER_TOP y 367 · min 768×0 · grow both
    Title: Label(ToyTitleOnDark) `loading.title` · center
    Bar: ProgressBar(ToyBarProgress) · min 768×16 · show_percentage false   // this machine's load fraction
    Players: VBox(ToyColumn8)
      Row×n: HBox(ToyRow12)
        Name: Label(ToyTextOnDark) "Олена" · expand   // own row: `player.you`
        State: Label(ToyTextOnDark) `loading.player_ready` | Label(ToyTextMutedOnDark) `loading.player_loading`
  Tip: PanelContainer(ToyPlate) · @CENTER_BOTTOM y -86 · min 1075×0 · grow both
    Label(ToyPlateText) `tip.two_hands` · center · autowrap   // one random `tip.*`
```
Sample rows: Олена Готово · Тарас Завантажує… · Ти Готово. Host first, then join order. Shown from the Loading phase until
pre game (s6).

### load-card
```
Root: Control · @FULL_RECT
  Night: P2
  Head: VBox(ToyColumn12) · @CENTER_TOP y 65 · min 960×0 · grow both
    Title: Label(ToyTitleOnDark) `loading.title` · center
    Bar: ProgressBar(ToyBarProgress) · min 960×16
  Card: P8 · @CENTER_TOP y 259 · min 1613×0 · grow both   // the Switches card
```
Code: instead of the tip and the player list, the card of a task type in this round that the player has not completed,
at most twice per type and never after its first completion (`user://` counters, #254). No line says the task is new.

**Decisions:** [Screens › Connecting] («Підключення до «{lobby}»…», the host names the lobby, #214); M6 §2.3 and §3
item 3 (the steps and each failure in plain words, the fallback text), §3 item 4 (no addresses on screen); [Learning ›
How-to cards] (once on loading, at most twice) and [Learning › Loading-screen tips] (funny); [Texts] (no «ми»: noun
statuses; the "new task" line removed; errors say what happened and one action).

---

## 5. s4 Lobby

Purpose: the in-world lobby's HUD: who is here and ready, the countdown, the room's code.

States: `wait` (the host's view, code known), `count`, `short` (too few players), `code-waiting` (the host, before the
service answers), `direct` (a Direct joiner: no code).

### wait
```
Root: Control · @FULL_RECT · mouse IGNORE   // in the world, mouse captured
  Cross: P5
  Status: PanelContainer(ToyPlate) · @CENTER_TOP y 43 · grow both
    Label(ToyPlateText) `lobby.waiting` {count}=3 {total}=4
  Players: PanelContainer(ToyPlate) · @TOP_RIGHT (-40, 43) · min 326×0 · grow left
    V: VBox(ToyColumn8)
      Lobby: Label(ToyTextMutedOnDark) "Лобі Олени"   // the lobby name (#214), user text
      CodeRow: HBox(ToyRow8)   // the host and code joiners; hidden for Direct
        Label(ToyTextMutedOnDark) `common.code`
        Key(ToyKeyOnDark) "K7Q2XR"
      Head: HBox(ToyRow12)
        Label(ToyTextOnDark) `lobby.players` · expand
        Label(ToyTextOnDark) "4 / 10"
      Row×n: HBox(ToyRow12)
        Name: Label(ToyTextOnDark) `lobby.host_mark` {name}="Олена" · expand   // others: the name; own: `player.you`
        Ready: TextureRect check.svg · 24×24 · tint font_color of ToyTextOnDark   // not ready: the same 24×24 empty (agent)
  Bottom: VBox(ToyColumn12) · @BOTTOM_LEFT (40, -40) · grow up
    ReadyChip: Plate(ToyChipPlate) > Label(ToyChipPlateText) `lobby.ready_no`
    Mic: P4 (on)
  Plates: P6 over the other players
```
Sample rows: Олена · хост ✓, Тарас ✓, Ти (not ready), Марко ✓. Code: Ready toggles on the bound ready key (F; no
prompt on screen, the tutorial teaches it, and the Esc Lobby tab has the button). The countdown starts when everyone is
ready and the mode's demands are met; an un-ready stops it.

### count
As `wait` with Status `Label(ToyTitleOnDark) lobby.countdown {count}=5` (5…1), every row ready, and
`ReadyChip: Plate(ToyChipLight) > Label(ToyChipLightText) lobby.ready_yes`.

### short
As `wait` with Status `Label(ToyPlateText) lobby.need_more {count}=1` (**NEW**, `tr_n`), shown instead of
`lobby.waiting` while the lobby has fewer players than the mode needs; Head reads "3 / 10". Other demands (#208's ids)
take their own keys later.

### code-waiting
As `wait` with the code keycap reading "…" while the code service has not made the room (`JoinProgress.CODE_WAITING`).
When the service is gone the keycap reads "—" and the Esc Lobby tab explains (s5 `lobby-no-code`).

### direct
A Direct joiner's view: as `wait` without CodeRow, own row not ready.

**Decisions:** [Screens › Lobby] (in the world; ready state and players; the mic as an icon); M6 §3 item 2 (the code to
whoever knows it, none for Direct); #214 (the lobby name); [Principles] (no key prompts); [Texts] («Готові 3 з 4», no
«Чекаємо на всіх»; «Готовність»).

---

## 6. s5 Esc menu

Purpose: the menu over the running game (no pause): game actions, the own role, the guide, the lobby settings, the
character and the settings.

States: `lobby-host`, `lobby-guest`, `lobby-no-code`, `character`, `character-round`, `game-host`, `game-guest`,
`game-confirm`, `role-engineer`, `role-dissident`, `guide`, `settings-sound`, `settings-controls`, `settings-display`,
`settings-access`, `settings-language`, `tutorial-game`.

### The frame (every state)
```
Root: Control · @FULL_RECT
  Dim: Panel(ToyBackdropDeep) · @FULL_RECT
  Menu: Raised[ToyBasePanel] · @CENTER · 1460×880
    Face: PanelContainer(ToyPanelMenu)
      H: HBox(ToyRow24)
        Tabs: VBox(ToyColumn8) · min 260×0
          Btn(ToyTab → ToyTabSelected)×6, one ButtonGroup: `esc.tab.game`, `esc.tab.role`, `esc.tab.guide`, `esc.tab.lobby`, `esc.tab.character`, `esc.tab.settings`
        Page: VBox(ToyColumn16) · expand
          TitleRow: HBox(ToyRow16)
            Title: Label(ToyTitleOnLight) (the tab's name) · expand
            (Note, per page)
          (the page)
```
Code: Esc opens and closes; the game runs on and the mouse is free. Default tab (agent): Lobby in the lobby, Game in a
round and in the tutorial; the last tab is kept for the session. Role is hidden in the lobby; the tutorial shows only
Game, Guide and Settings. Focus starts on the selected tab.

### lobby-host
```
          TitleRow.Note: Label(ToyTextMutedOnLight) `esc.lobby.you_host` · size_flags SHRINK_END
          Presets: HBox(ToyRow16)
            Card×3: Btn(ToyPresetCard → ToyPresetCardSelected) · min 200×96 · one ButtonGroup
              V: VBox(ToyColumn4) · mouse IGNORE
                Name: Label(ToyPresetCardName NEW) `preset.standard` | `preset.quick` | `preset.no_knives`
                Note: Label(ToyPresetCardNote | ToyPresetCardNoteSelected) `unit.minutes` {count}=10 | 5 ; `unit.knives` {count}=0
            Save: Btn(ToyPresetCardQuiet) `preset.save_own` · min 200×96
          Body: HBox(ToyRow32)
            Settings: VBox(ToyColumn4) · expand ratio 1.4
              Row×7: PanelContainer(ToySettingRow) > HBox(ToyRow12)
                Label(ToySettingRowText) <name> · expand
                <value>
            Side: VBox(ToyColumn12) · expand ratio 1
              CodeRow: HBox(ToyRow8)
                Label(ToyTextMutedOnLight) `common.code`
                Key(ToyKeyOnLight) "K7Q2XR"
                Copy: Btn(ToyButtonGhostOnLight) `esc.lobby.copy` NEW
              Count: Label(ToySettingRowValue) `esc.lobby.players` {count}=4 {total}=10
              Row×n: HBox(ToyRow12) > Label(ToyTextOnLight) name · expand ; TextureRect check.svg 24×24 (tint font_color of ToyTextOnLight) or empty
              Ready: Btn(ToyButtonPrimary) `esc.lobby.ready` · icon check.svg when ready (agent)
```
Rows (name key → value):

| Row | Host value | Sample |
|---|---|---|
| `lobby.setting.name` | `LineEdit(ToyField)` · min 300×0 · max_length per #214 | "Лобі Олени" |
| `lobby.setting.duration` | Stepper: `HBox(ToyRow8)` > `Btn(ToyStepper)` icon chevron-left ; `Label(ToySettingRowValue)` · min 80 · center ; `Btn(ToyStepper)` icon chevron-right | `unit.minutes` {count}=10 |
| `lobby.setting.packages` | Stepper | 6 |
| `lobby.setting.dissidents` | Stepper | 1 |
| `lobby.setting.knives` | Stepper | 2 |
| `lobby.setting.tasks` | `HBox(ToyRow8)` > `Btn(ToyChipToggleOnLight → Selected)` per task type (not grouped; selected = allowed) | `task.delivery` ✓, `task.switches` ✓ |
| `lobby.setting.task_steps` {task}="Рубильники" | Stepper; one row per complex task type, hidden while it is banned | 3 |

Code: edits apply live for everyone; a stepper is disabled (unplugged) at its bound. A preset card applies its values;
any other change deselects every card (the guest line then reads `preset.custom`, **NEW**). Save your own stores one
custom preset: a card named `preset.custom` appears before the quiet card. Copy: `DisplayServer.clipboard_set(code)`,
the button reads `esc.lobby.copied` (**NEW**) for 1.5 s. Ready toggles; the check icon shows while ready.

### lobby-guest
As `lobby-host` with these differences:
```
          TitleRow.Note: HBox(ToyRow8) > TextureRect lock.svg 20×20 (tint font_color of ToyTextMutedOnLight) ; Label(ToyTextMutedOnLight) `esc.lobby.host_only` {name}="Олена"
          Presets → Preset: Label(ToyTextOnLight) `esc.lobby.preset` {preset}="Звичайний"
```
Values without steppers (wireframe): `Label(ToySettingRowValue)`. The name: `LineEdit(ToyField)` · `editable false` (the
quiet read-only box). Tasks: allowed `Plate(ToyChipLight) > Label(ToyChipLightText)`, banned
`Plate(ToyChipLineOnLight) > Label(ToyChipLineOnLightText)`. CodeRow only for a code joiner. In a round everyone sees
this view (settings change only in the lobby).

### lobby-no-code
`lobby-host` when the code service closed or was never reachable: CodeRow is replaced by
`Label(ToyTextMutedOnLight) esc.lobby.code_gone · autowrap` (**NEW**).

### character
```
          Body: HBox(ToyRow32)
            Preview: SubViewportContainer · min 380×506   // the own character; the mock-up draws a ToyHowtoFrame placeholder
            Form: VBox(ToyColumn16) · expand
              NameRow: HBox(ToyRow12) > Label(ToyTextMutedOnLight) `player.name` · min 160 ; LineEdit(ToyField) "Олена" · expand
              ColourRow: HBox(ToyRow12)
                Label(ToyTextMutedOnLight) `esc.character.colour` · min 160
                Swatches: Grid(ToyGridSwatch) · columns 5
                  Swatch×10: TextureButton · toggle · one ButtonGroup · 26×26
                    Disc: TextureRect swatch-disc.svg · self_modulate = the body colour (content data)
                    Ring: Panel(ToySwatchRing) · @FULL_RECT · mouse IGNORE
                    Sel: Panel(ToySwatchSelected) · @FULL_RECT · mouse IGNORE   // visible when selected or focused
```
The Hat row (`esc.character.hat`) stays hidden until hats exist (agent). The palette waits for the body colours (#255);
the mock-up keeps the wireframe's ten greys. Changes apply live in the lobby.

### character-round
As `character`, with under the TitleRow
`Locked: Plate(ToyChipLineOnLight) > HBox(ToyRow8) > TextureRect lock.svg 20×20 ; Label(ToyChipLineOnLightText) esc.character.locked`
(SHRINK_BEGIN); the name `editable false`, the swatches `mouse_filter IGNORE` and `focus_mode NONE`.

### game-host
```
          Actions: VBox(ToyColumn16) · min 760×0 · size_flags SHRINK_BEGIN
            Resume: Btn(ToyButtonPrimary) `esc.game.resume` · focus
            Leave: Btn(ToyButtonDanger) `esc.game.leave`
            Quit: Btn(ToyButtonGhostOnLight) `esc.game.quit`
```
Code: the host's Leave and Quit open P1 (`game-confirm`); the note under the button moves into that dialog (agent).

### game-guest
As `game-host` with `Leave: Btn(ToyButtonSecondary)`; Leave and Quit act at once.

### game-confirm
`game-host` with P1 over it: Title `esc.game.leave_confirm` (or `esc.game.quit_confirm` from Quit), Body
`esc.game.leave_host_note`, Confirm `esc.game.leave` (or `esc.game.quit`), Cancel focused.

### tutorial-game
The tutorial's menu: tabs Game, Guide, Settings; Actions = Resume (Primary), `esc.game.leave_tutorial` (**NEW**,
ToyButtonSecondary → s2), Quit (ghost).

### role-engineer
```
          Body: HBox(ToyRow32)
            Left: VBox(ToyColumn8) · expand ratio 1.1
              Label(ToyTextMutedOnLight) `player.you`
              Role: Label(ToyDisplayOnLight NEW) `role.engineer`
              Goal: Label(ToyTextOnLight) `role.goal.engineer` · autowrap
```

### role-dissident
As `role-engineer` with `role.dissident`, `role.goal.dissident`, and:
```
            Team: VBox(ToyColumn12) · expand ratio 1
              Label(ToySettingRowValue) `esc.role.teammates` {count}=9
              Scroll: Scroll · vertical · min 0×250 · max 250 (custom_minimum_size + clip)   // the bar is ToyScrollBar NEW
                Grid: Grid(ToyGridList) · columns 2
                  Mate×9: HBox(ToyRow8) > TextureRect teammate-mark.svg 20×20 (tint font_color of ToyTextOnLight) ; Label(ToyTextOnLight) "Тарас"
```
Sample: Тарас, Марко, Оксана, Іван, Соломія, Богдан, Ірина, Дмитро, Леся. Code: reads only the own role and
`Teammates`; with no teammates the Team column is hidden.

### guide
```
          Body: HBox(ToyRow24)
            List: Scroll · min 300×0
              V: VBox(ToyColumn8)
                Label(ToyTextMutedOnLight) `guide.basics`
                Btn(ToyChipToggleOnLight → Selected) `guide.moving`, `guide.voice`, `guide.downed` · SHRINK_BEGIN
                Label(ToyTextMutedOnLight) `guide.tasks` · margin top 16
                Btn(ToyChipToggleOnLight → Selected) `task.delivery`, `task.switches` (selected)   // one ButtonGroup over all five
            Card: P8 · expand   // Switches, 4 frames
```
Basics pages are P8 cards from the tutorial's keys (agent): `guide.moving` = `tutorial.step.move.title`,
`.pick_up.title`, `.put_down.title`, `.hand_belt.title`; `guide.voice` = `tutorial.step.voice.title`, `.voice.how`,
`tutorial.list.death`; `guide.downed` = `tutorial.step.downed.title`, `downed.give_up_hold`,
`tutorial.step.death.title`, `.death.how`. Task
pages: the task type's card (#254). The Card's title is the chip's text.

### settings-sound
```
          Sub: HBox(ToyRow8)
            Btn(ToyChipToggleOnLight → Selected)×5, one ButtonGroup: `settings.tab.sound` (selected), `settings.tab.controls`, `settings.tab.display`, `settings.tab.accessibility`, `settings.tab.language`
          Scroll: Scroll · expand   // bar ToyScrollBar
            Rows: VBox(ToyColumn4)
              Row: PanelContainer(ToySettingRow) > HBox(ToyRow12) > Label(ToySettingRowText) <name> · expand ; <control> · min 500×0
```

| Row | Control | Sample |
|---|---|---|
| `settings.mic` | `OptionButton(ToyDropdown)`: `settings.mic.default` + device names (not translated); arrow chevron-down | Стандартний |
| `settings.talk_mode` | `HBox(ToyRow8)` > `Btn(ToyChipToggleOnLight → Selected)`, grouped: `settings.talk_mode.open` (changed: «За голосом»), `settings.talk_mode.push`, `common.off` | За голосом |
| `settings.voice_threshold` NEW | `HSlider(ToySlider NEW)`; shown for voice activity only | 40 % |
| `settings.mic_test` | `ProgressBar(ToyBarSlider)` · min 500×10: the live mic level | 40 % |
| `settings.noise_suppression` NEW | chips `common.off` / `common.on` | Увімкнено |
| `settings.game_volume` (changed: «Загальна гучність») | `HSlider(ToySlider)` | 55 % |
| `settings.voice_volume` | `HSlider(ToySlider)` | 70 % |
| `settings.effects_volume` NEW | `HSlider(ToySlider)` | 80 % |
| `settings.music_volume` NEW | `HSlider(ToySlider)` | 50 % |

Code: the game's `voice_panel.gd` (mic, mode, threshold, meter, RNNoise, four buses) under these rows; the meter runs
without a session (#301); a pick opens the device under the existing "opening" mark. Without the voice add-on the four
mic rows are replaced by `Label(ToyTextMutedOnLight) settings.voice_unavailable` (**NEW**).

### settings-controls
`Sub` with Controls selected; Rows:
```
              Row×16: PanelContainer(ToySettingRow) > HBox(ToyRow12)
                Label(ToySettingRowText) `control.*` · expand
                Same: Plate(ToyChipAlert NEW) > Label(ToyChipAlertText) `settings.controls.same_key` NEW   // only on clashing rows
                Bind: Btn(ToyKeyButton NEW) "E" · min 96×0
              Reset: Btn(ToyButtonGhostOnLight) `settings.controls.reset` NEW · SHRINK_BEGIN · margin top 16
```
Rows and defaults (from the game's input map): `control.forward` W, `.backward` S, `.left` A, `.right` D, `.sprint`
Shift, `.jump` Space (`key.space`), `.interact` E, `.use` `key.mouse_left`, `.put_down` Q, `.swap` X, `.map` M,
`.give_up` F, `.ready` F, `.talk` V, `.spectate_next` `key.mouse_left`, `.spectate_previous` `key.mouse_right` (16 rows;
Esc is fixed). The state shows Interact capturing: `Bind` held look with the text `settings.controls.press_key` (**NEW**),
and Talk and Map both on M with the Same chip.

Code: a click (or ui_accept) on Bind starts capture; the next key or mouse button binds; Esc cancels. Same key in one
phase marks both rows; give_up and ready share F legally (different phases, #211). Reset restores the defaults. Saved
per player.

### settings-display
One row `settings.window` (**NEW**): chips `settings.window.fullscreen` (selected) / `settings.window.windowed`.

### settings-access
Rows `settings.large_text` (**NEW**: chips `common.off` (selected) / `common.on`; swaps `GameUi`'s theme to
`game_theme_large.tres` live) and `settings.reduced_motion` (**NEW**: chips; default from
`DisplayServer.accessibility_should_reduce_animation()`).

### settings-language
```
          Lang: VBox(ToyColumn12) · min 672×0
            Label(ToyTextMutedOnLight) `settings.language.title`
            Row×2: HBox(ToyRow12) > Btn(ToyRadio → ToyRadioSelected), one ButtonGroup ; Label(ToySettingRowValue when selected | ToySettingRowText) `lang.uk` (selected) | `lang.en`
```
Code: the Label swaps its variation on `toggled`; clicking the Label toggles its radio; the language applies at once.

**Decisions:** [Screens › Esc menu] (over the running game; the six tabs; one Lobby view, the host edits; presets as
cards; easy and complex tasks with a subtask count, #256; Character changes only in the lobby; Settings with Language);
[Style › Toy look details] (coral danger for the host's leave and its dialog; unplugged disabled; focus rings;
selected preset card keeps its size; read-only field; held stepper honey; preset cards lift on hover); [Learning ›
How-to cards] (Guide tab); #211 (rebinding), #301, #208 (language live); [Texts] («шаблон», «Готовність», «Ти хост:
зміни бачать усі» kept; the no-pause line removed); [Principles] (players are experienced: no explanations).

---

## 7. s6 Pre game

Purpose: the ~3 s black intro that names the own role and goal (and a dissident's team), then the round fades in.

States: `engineer`, `dissident`, `after`.

### engineer
```
Root: Control · @FULL_RECT
  Night: P2
  V: VBox(ToyColumn24) · @CENTER · min 1152×0 · grow both · alignment CENTER
    Label(ToyTextMutedOnDark) `pregame.your_role` · center
    Role: Raised[ToyBaseTitle] · SHRINK_CENTER
      Face: Label(ToyTitlePlate) `role.engineer`
    Goal: Label(ToyTextOnDark) `role.goal.engineer` · center · autowrap
```
ToyTitlePlate draws 36 px outside its rect (expand margins): the 24 px column gap plus the plate's own 4 px top keep it
clear; give the Raised node 40 px side margins in the mock-up.

### dissident
As `engineer` with `role.dissident`, `role.goal.dissident`, and
`Team: Label(ToyTextMutedOnDark) pregame.teammate {names}="Тарас" · center · autowrap` (names joined with ", "; hidden
with no teammates).

### after
The round fading in: s7 `empty` with Timer "09:57". Night fades from alpha 1 to 0 over 0.4 s (a cut under reduced
motion).

Code: shows when the own role arrives, for about 3 s, in the silent pre game (#213); one sound per role; no text about
the mic; input is not needed.

**Decisions:** [Screens › Pre game] (black intro of about 3 s, nobody hears anybody and no text says so, one sound per
role, generic goals); #175 (a dissident sees the team); [Texts] (team and role names capitalised).

---

## 8. s7 Round HUD

Purpose: the round's HUD: time, own role, health, stamina, mic, hand and belt, the aimed object's name, name plates.

States: `empty`, `pack`, `tired`, `hurt`, `mate`.

### empty
```
Root: Control · @FULL_RECT · mouse IGNORE
  Timer: PanelContainer(ToyPlate) · @CENTER_TOP y 32 · grow both
    Label(ToyTimer) "07:22" · center · min width of "00:00"   // mm:ss, the round's time left (agent: fixed width)
  Role: Plate(ToyChipPlate) > Label(ToyChipPlateText) `role.engineer` · @TOP_LEFT (40, 43)
  Cross: P5
  Aim: Plate(ToyChipPlate) > Label(ToyChipPlateText) `item.package` · @CENTER, offset top +38 · grow both   // the aimed object's name; hidden when nothing is aimed
  Vitals: VBox(ToyColumn12) · @BOTTOM_LEFT (40, -40) · grow up
    Health: P7 `hud.health` hp 0.8 (ramp stop 16)
    Stamina: P7 `hud.stamina` 0.9
    Mic: P4 (on) · SHRINK_BEGIN
  Slots: HBox(ToyRow12) · @BOTTOM_RIGHT (-40, -40) · grow left/up
    Hand: PanelContainer(ToySlotActive) · 84×84 > Center > Label(ToySlotTextEmpty) `hud.slot.hand`
    Belt: PanelContainer(ToySlot) · 84×84 > Center > Label(ToySlotTextEmpty) `hud.slot.belt`
  Plates: P6
```
Slots (agent): the hand is always ToySlotActive, the belt ToySlot; a one-handed item shows its icon (48×48) and no word;
an empty slot shows its name.

### pack
As `empty`, Aim hidden, and the hand slot widened:
`Hand: PanelContainer(ToySlotActive) · 180×84 > Center > HBox(ToyRow8) > TextureRect item.svg 48×48 (tint font_color of ToySlotText) ; Label(ToySlotText) item.package`.
The package's room sign is on the 3D package only; the slot never repeats it.

### tired
As `empty`, stamina 0.18.

### hurt
As `empty`, health 0.22 (stop 4).

### mate
As `empty` with Role `role.dissident`, the belt holding a knife
(`Belt: ToySlot > Center > TextureRect knife.svg 48×48`), Aim hidden, and one P6 plate "Тарас" with the teammate mark
over a teammate at about (538, 302).

Code: the mic is off (crossed, coral) whenever nobody hears the player; Aim shows the name of the object under the
crosshair within reach (`item.package`, `item.knife` **NEW**, `item.switch` **NEW**); the HUD never shows keys, walking
or running, a player list, who knocked you down, a destination or task progress.

**Decisions:** [Screens › Round HUD] (time at the top only; health and stamina always, the health colour from the
fraction, the bar length as the real cue; the mic icon, crossed out; hand and belt, the wide two-handed slot; the role
chip; the object's name; none of the excluded items); [Screens › Name plates]; [Delivery] (no destination marker; the
hand slot does not repeat the sign); [Principles] (no key prompts on the HUD).

---

## 9. s8 Map and tasks (M)

Purpose: M opens the map and tasks over the running game, walking allowed: counters, «?» cards, rooms, «you are here»,
the zones of a hovered task.

States: `list`, `zone`, `guide`.

### list
```
Root: Control · @FULL_RECT
  Dim: Panel(ToyBackdropDeep) · @FULL_RECT · mouse IGNORE
  Tasks: Raised[ToyBasePanel] · @TOP_LEFT (77, 86) · 614×907
    Face: PanelContainer(ToyPanelMenu)
      V: VBox(ToyColumn12)
        Title: Label(ToyTitleOnLight) `map.tasks`
        Row×n: PanelContainer(ToySettingRow) > HBox(ToyRow12)
          Name: Label(ToySettingRowValue) `task.delivery` · expand
          Count: Label(ToySettingRowText) `map.progress` {count}=3 {total}=6
          Help: Btn(ToyKeyRoundButton NEW) "?" · 36×36 min   // not a key; auto_translate off
        (Switches row: `task.switches`, {count}=0 {total}=3)
        Fill: Control · expand
        Time: Label(ToyTextMutedOnLight) `map.time` {time}="7:22"
  Board: Raised[ToyBasePanel] · @TOP_LEFT (749, 86) · 1094×907
    Face: PanelContainer(ToyMapBoard)
      Rooms: Control · expand   // children placed from the level's map data, scaled to fit
        Room×6: PanelContainer(ToyMapRoom) at its rect
          C: Center > VBox(ToyColumn4) · alignment CENTER
            Icon: TextureRect <room>.svg · 40×40   // system B icon, ink, no plate
            Label(ToyMapRoomText) `room.*` · center · autowrap
        Pin: Panel(ToyMapPin) · 28×28 · rotation = the player's yaw (pivot_offset_ratio 0.5, 0.5)
        Here: Plate(ToyChipPlate) > Label(ToyHudCaption) `map.you_are_here` · at the pin +(24, 16)
```
Room rects in board px (the wireframe's map, placeholders until the designer's map): `room.storage` (66, 73, 328×308),
`room.kitchen` (438, 73, 263×200), `room.lab` (744, 73, 284×363), `room.office` (66, 454, 241×363), `room.hall`
(350, 345, 350×472), `room.lounge` (744, 508, 284×308); pin at (503, 526).

### zone
As `list` with the Delivery row hovered and, above the rooms:
`Zone: Panel(ToyMapZone)` over the storage rect, and
`ZoneTag: Plate(ToyChipLight) > Label(ToyChipLightText) map.zone_hint` at (88, 399).

### guide
As `list` (Delivery hovered off), plus:
```
  Dim2: Panel(ToyBackdrop) · @FULL_RECT
  G: VBox(ToyColumn12) · @CENTER_TOP y 151 · min 1536×0 · grow both
    Card: P8   // Switches
    Bar: HBox · alignment END > Close: Btn(ToyButtonGhostOnDark) `common.close` · focus
```

Code: M opens and closes (press, not hold; rebindable, #211); Tab does nothing; the mouse is free and movement keeps
working. Hovering a row, or focusing its «?», shows that task's zones (from level or content data): Delivery lights the
storage only, never the rooms waiting for a package; Switches uses `map.zone_hint.switches` (**NEW**). «?» opens the
card; Close, Esc or M closes it. All «?» look the same (agent: the wireframe's quiet «?» marked a seen card, which the
no-NEW rule drops). The map never shows players, items, roles, teammates, delivery circles or done points.

**Decisions:** [Screens › Map and tasks on M] (press to open and close, walking, counters without descriptions, «?»
per task, «you are here» and room names, hover lights zones, none of the excluded); [Delivery] (storage zone only;
plain pictograms on the map); [Texts] (no NEW tag; «мапа», «задача», «Ти тут»); [Learning › How-to cards].

---

## 10. s9 Downed, dead and respawn

Purpose: what a downed player sees (time left, raising, giving up), the spectator's two lines, the return.

States: `down`, `down-holding`, `raise`, `dead`, `back`.

### down
```
Root: Control · @FULL_RECT · mouse IGNORE   // the rest of the HUD hides while downed (agent, as the wireframe)
  Top: PanelContainer(ToyPlateNight) · @CENTER_TOP y 151 · min 690×0 · grow both
    V: VBox(ToyColumn8) · alignment CENTER
      Title: Label(ToyTitleOnDark) `downed.title` · center
      Track: PanelContainer(ToyBarTrack) · min 600×16
        Fill: ProgressBar(ToyBarHealth) · 0.7   // the bleed-out time left as a fraction, ramp colour (agent)
      Left: Label(ToyTextMutedOnDark) `downed.time_left` {time}="0:10" · center
  GiveUp: PanelContainer(ToyPlate) · @CENTER_BOTTOM y -130 · grow both
    V: VBox(ToyColumn8) · alignment CENTER
      Line: P3 on dark `downed.give_up_hold` {key}=F
      Hold: ProgressBar(ToyBarProgress) · min 360×10 · hidden   // fills over the 1 s hold while the key is down (agent)
  Mic: P4 (off) · @BOTTOM_LEFT (40, -40)
```

### down-holding
As `down` with Hold visible at 0.45.

### raise
As `down` with GiveUp hidden and Top's content:
`Label(ToyTitleOnDark) downed.raised_by {name}="Олена" · center · autowrap` +
`ProgressBar(ToyBarProgress) · min 600×16 · 0.6` (the raise progress).

### dead
```
Root: Control · @FULL_RECT · mouse IGNORE   // nothing else: no timer, bars, slots, mic or arrows
  Top: PanelContainer(ToyPlate) · @CENTER_TOP y 43 · grow both
    V: VBox(ToyColumn4) · alignment CENTER
      Label(ToyTextMutedOnDark) `dead.respawn_in` {time}="0:24"
      Label(ToyTitleOnDark) `dead.watching` {name}="Олена"
```
Code: the camera follows the watched player; spectate_next and spectate_previous switch (taught in the tutorial); the
watched player's HUD, health and role never show; the plate updates when they die.

### back
s7 `empty` with Timer "05:10", plus
`Protect: Plate(ToyChipLight) > Label(ToyChipLightText) respawn.protected {count}=3 · @CENTER_TOP y 238 · grow both`
(3, 2, 1, then hidden).

**Decisions:** [Screens › Downed] («Hold F to give up», F, rebindable, #211); [Screens › Spectating] (only «Watching:
<name>» and the time to respawn); [Screens › Round HUD] (never who knocked you down); [Texts] («Нокдаун», «повернення»,
«Тебе повалено»: no gender).

---

## 11. s10 Post game

Purpose: the ~3 s black outro: who won, whether the own team won, why, and the return to the lobby.

States: `win` (an Engineer's view, all tasks done), `lose` (an Engineer's view, time up).

### win
```
Root: Control · @FULL_RECT
  Night: P2
  V: VBox(ToyColumn16) · @CENTER_TOP y 259 · min 1152×0 · grow both · alignment CENTER
    Label(ToyTextMutedOnDark) `end.title` · center
    Winner: Raised[ToyBaseTitle] · SHRINK_CENTER > Face: Label(ToyTitlePlate) `end.won_engineers`
    Team: Label(ToyTitleOnDark) `end.your_team_won` · center
    Reason: Label(ToyTextMutedOnDark) `end.reason.all_tasks` {time}="7:41" · center · autowrap
    Gap: Control · min 0×40
    Back: Label(ToyTextOnDark) `end.back_to_lobby` {count}=3 · center   // 3, 2, 1
```

### lose
As `win` with `end.won_dissidents`, `end.your_team_lost`, `end.reason.time_up`.

Code: the End phase fades to black (0.4 s; a cut under reduced motion), plays one sound for both outcomes, routes no
voice (#213) and returns everyone to the lobby after 3 s (#212). Roles are not revealed. The reason is an id from the
host (#208); an unknown reason hides the line.

**Decisions:** [Screens › Pre game and post game] (black outro of about 3 s, no voice and no text about it, one sound
for win and loss, back to the lobby after 3 s, no roles revealed); [Texts] (team names capitalised).

---

## 12. Gaps

### 12.1 Variations the pack lacks

Each derives from an existing variation with only the listed differences (no new colour or font).

| Name (class) | Like | Differs | Screens |
|---|---|---|---|
| ToyMenuItem (Button → ToyButton), dark | ToyButtonGhostOnDark | border width 0 in every state; label `type.heading-bold` (28); `toggle_mode` used (pressed = hover fill); icon colours: `icon_normal_color` and `icon_disabled_color` `palette.clear`, `icon_hover/pressed/hover_pressed/focus_color` `color.on-dark.text`; `h_separation` 12; focus as ghost with expand 0 | s2 |
| ToyKeyButton (Button → ToyButton), light | ToyKeyOnLight | a Button: normal = the keycap panel; hover and pressed bg `color.state.hover-on-light`; disabled the unplugged colours; focus outer ring (bc `color.outline` · bw focus · ex 5, radius `radius.small` + 5); label = `keycap.text`; `min-width` 36, wide 96 | s5 |
| ToyKeyRoundButton (Button → ToyButton), light | ToyKeyRound | as ToyKeyButton with radius pill | s8 |
| ToyPresetCardName (Label), light | ToyPresetCardNote | label `type.small-bold`; font `color.on-light.text` (ink, equal to `color.on-accent.text` on the selected card) | s5 |
| ToyDisplayOnLight (Label), light | ToyTitleOnLight | label `type.display-large` (64) | s5 |
| ToyChipAlert + ToyChipAlertText, light | ToyChipNew (+Text) | name only: the NEW tag is gone, the coral chip now marks a clash; ToyChipNew retires | s5 |
| ToySlider (HSlider), light | ToyBarSlider | class HSlider: `slider` = its background, `grabber_area`/`_highlight` = its fill; icons `grabber`/`_highlight`/`_disabled` = slider-knob SVGs (28 px; yellow face, ink outline; disabled face and ink); `focus` outer ring as chips | s5, s2 |
| ToyScrollBar (VScrollBar), light | ToyBarSlider | class VScrollBar: `scroll` = the track (pill, 10 wide), `grabber`/`_highlight`/`_pressed` = the ink fill pill | s5 |
| ToyColumn4/8/12/16/24/32 (VBoxContainer), ToyRow4/8/12/16/24/32 (HBoxContainer), ToyGridList (h 24 · v 8), ToyGridSwatch (h 12 · v 12) | none (new `space.4`…`space.32` dimension tokens) | `separation` (grids: `h_separation`, `v_separation`) only | all |
| ToyStepper (changed) | ToyStepper | adds `icon_*_color` = its font colours, for the chevron icons | s5 |
| ToyDropdown (changed) | ToyDropdown | the arrow icon (chevron-down, ink) and its width added to `content-margin-right` (spec §4.9) | s5, s2 |

### 12.2 New keys

`{key}` follows P3. One plural (`lobby.need_more`: en one/other, uk one/few/many).

| Key | en | uk | Screens |
|---|---|---|---|
| `menu.direct` | Direct (LAN or VPN) | Напряму (LAN або VPN) | s2 |
| `common.code` | Code | Код | s2-s5 |
| `common.on` | On | Увімкнено | s5 |
| `common.off` | Off | Вимкнено | s5 |
| `connect.step.finding` | Finding the game | Пошук гри | s3 |
| `connect.step.connecting` | Reaching the host | Зʼєднання з хостом | s3 |
| `connect.step.joined` | Entering the lobby | Вхід у лобі | s3 |
| `connect.fail.no_room` | No game has this code. Check it with the host. | Гри з таким кодом немає. Перевір код у хоста. | s3 |
| `connect.fail.started` | The round has already started. Join when everyone is back in the lobby. | Раунд уже почався. Приєднуйся, коли всі повернуться в лобі. | s3 |
| `connect.fail.version` | The host has another version of the game. You need the same one. | У хоста інша версія гри. Потрібна така сама. | s3 |
| `connect.fail.version_host` | Host: {version} | Хост: {version} | s3 |
| `connect.fail.version_own` | You: {version} | Ти: {version} | s3 |
| `connect.fail.full` | The lobby is full. | Лобі заповнене. | s3 |
| `connect.fail.service` | The code service isn't answering. Join directly with the host's address. | Сервіс кодів не відповідає. Приєднайся напряму за адресою хоста. | s3 |
| `connect.fail.unreachable` | No link to the host. If the lobby has room, ask the host for an address and join directly. | Немає звʼязку з хостом. Якщо в лобі є місце, попроси в хоста адресу й приєднайся напряму. | s3 |
| `connect.fail.direct` | Join directly | Приєднатися напряму | s3 |
| `connect.lost.title` | Connection lost | Звʼязок втрачено | s3 |
| `connect.lost.body` | The session was closed, or the network dropped. | Сесію закрито або обірвалася мережа. | s3 |
| `connect.map_fail.title` | The map didn't load | Мапа не завантажилася | s3 |
| `connect.map_fail.body` | The round goes on without you. | Раунд іде без тебе. | s3 |
| `connect.error.title` | The session stopped | Сесію зупинено | s3 |
| `connect.error.body` | The game ran into an error. The details are in the log. | У грі сталася помилка. Подробиці — в журналі. | s3 |
| `connect.host_fail.title` | Couldn't start the game | Не вдалося створити гру | s3 |
| `lobby.need_more` (plural) | {count} more player to start / {count} more players to start | Ще {count} гравець до старту / Ще {count} гравці до старту / Ще {count} гравців до старту | s4 |
| `lobby.default_name` | {name}'s lobby | Лобі: {name} | s4, s5 |
| `esc.lobby.copy` | Copy | Копіювати | s5 |
| `esc.lobby.copied` | Copied | Скопійовано | s5 |
| `esc.lobby.code_gone` | The code service isn't answering. To let more players in, host directly. | Сервіс кодів не відповідає. Щоб прийняти ще гравців, створи гру напряму. | s5 |
| `esc.game.leave_confirm` | Leave the session? | Покинути сесію? | s5 |
| `esc.game.quit_confirm` | Quit the game? | Вийти з гри? | s5 |
| `esc.game.leave_tutorial` | Leave the tutorial | Вийти з навчання | s5 |
| `preset.custom` | Custom | Свій | s5 |
| `settings.voice_threshold` | Voice threshold | Поріг голосу | s5, s2 |
| `settings.noise_suppression` | Noise suppression | Шумозаглушення | s5, s2 |
| `settings.effects_volume` | Effects volume | Гучність ефектів | s5, s2 |
| `settings.music_volume` | Music volume | Гучність музики | s5, s2 |
| `settings.voice_unavailable` | Voice isn't available in this build. | Голос у цій збірці недоступний. | s5, s2 |
| `settings.controls.press_key` | Press a key… | Натисни клавішу… | s5 |
| `settings.controls.reset` | Reset to defaults | Скинути до стандартних | s5 |
| `settings.controls.same_key` | Same key | Та сама клавіша | s5 |
| `settings.window` | Window | Вікно | s5 |
| `settings.window.fullscreen` | Fullscreen | На весь екран | s5 |
| `settings.window.windowed` | Windowed | У вікні | s5 |
| `settings.large_text` | Large text | Великий текст | s5 |
| `settings.reduced_motion` | Reduce motion | Менше руху | s5 |
| `control.forward` | Forward | Уперед | s5 |
| `control.backward` | Backward | Назад | s5 |
| `control.left` | Left | Ліворуч | s5 |
| `control.right` | Right | Праворуч | s5 |
| `control.walk` | Walk | Ходити | s1 |
| `control.sprint` | Sprint | Бігти | s1, s5 |
| `control.jump` | Jump | Стрибнути | s1, s5 |
| `control.interact` | Interact | Взаємодіяти | s5 |
| `control.use` | Use | Використати | s5 |
| `control.put_down` | Put down | Покласти | s5 |
| `control.swap` | Swap hand and belt | Поміняти руку й пояс | s5 |
| `control.give_up` | Give up | Здатися | s5 |
| `control.ready` | Ready | Готовність | s5 |
| `control.map` | Map and tasks | Мапа й задачі | s5 |
| `control.talk` | Talk | Говорити | s5 |
| `control.spectate_next` | Next player | Наступний гравець | s5 |
| `control.spectate_previous` | Previous player | Попередній гравець | s5 |
| `key.space` | Space | Пробіл | s1, s5 |
| `key.mouse_left` | LMB | ЛКМ | s1, s5 |
| `key.mouse_right` | RMB | ПКМ | s5 |
| `tutorial.step.press` | Press {key} | Натисни {key} | s1 |
| `tutorial.step.move.title` | Move around | Походи кімнатою | s1, s5 |
| `tutorial.step.put_down.title` | Put the package down | Поклади пакунок | s1, s5 |
| `tutorial.step.hand_belt.title` | Swap hand and belt | Поміняй руку й пояс | s1, s5 |
| `tutorial.step.deliver.title` | Deliver the package | Доправ пакунок | s1 |
| `tutorial.step.deliver.how` | Find the room with the sign that's on the package | Знайди кімнату зі знаком, як на пакунку | s1 |
| `tutorial.step.map.title` | Open the map | Відкрий мапу | s1 |
| `tutorial.step.howto.title` | See how a task is done | Подивись, як виконати задачу | s1 |
| `tutorial.step.howto.how` | Press {key} next to a task | Натисни {key} біля задачі | s1 |
| `tutorial.step.downed.title` | Raise a player who's down | Підніми гравця з нокдауну | s1, s5 |
| `tutorial.step.downed.how` | Hold {key} next to them | Утримуй {key} поруч | s1 |
| `tutorial.step.death.title` | Watch while you wait | Спостерігай, поки чекаєш | s1, s5 |
| `tutorial.step.death.how` | Press {key} to watch another player | Натисни {key}, щоб дивитися на іншого гравця | s1, s5 |
| `tutorial.step.voice.title` | Talk to someone nearby | Поговори з кимось поруч | s1, s5 |
| `tutorial.step.voice.how` | Only players near you hear you | Тебе чують лише ті, хто поруч | s1, s5 |
| `tutorial.step.menu.title` | Open the menu | Відкрий меню | s1 |
| `howto.delivery.take` | Take a package from the storage room | Візьми пакунок на складі | s5, s8, s3 |
| `howto.delivery.sign` | Check the sign on it | Подивись на знак на ньому | s5, s8, s3 |
| `howto.delivery.find` | Find the room with that sign | Знайди кімнату з таким знаком | s5, s8, s3 |
| `howto.delivery.drop` | Put it in the delivery zone | Поклади в зону доставки | s5, s8, s3 |
| `item.knife` | Knife | Ніж | s7 |
| `item.switch` | Switch | Рубильник | s7 |
| `map.zone_hint.switches` | Switches may be here | Тут можуть бути рубильники | s8 |

Alternatives where the choice is real: `lobby.default_name` (en "{name} · lobby", uk «{name} · лобі»; en "Lobby
“{name}”", uk «Лобі «{name}»»: Ukrainian cannot decline a name in a placeholder, so «Лобі Олени» is not possible);
`connect.fail.version` (en "The host has another version of the game.", uk «У хоста інша версія гри.»: the two version
lines as the only action); `connect.fail.unreachable` (en "No link to the host. Ask for an address and join directly.",
uk «Немає звʼязку з хостом. Попроси адресу й приєднайся напряму.»); `settings.talk_mode.open` (uk «Автоматично»).

### 12.3 Existing keys that no longer fit

- `menu.join` «Приєднатися» → en "Join with a code", uk «Приєднатися за кодом»: joining by address is now Direct.
- `join.title` «Приєднатися до гри»: remove; the two panels take `menu.join` and `menu.direct` as titles.
- `join.lan_only` «Лише та сама мережа»: remove; Direct works over a VPN and playit.gg too (M6 §2.3 item 6).
- `settings.talk_mode.open` «Завжди ввімкнено» → en "Voice activity", uk «За голосом»: the game's mode is voice
  activity with a threshold, not an always-open mic; Off is `common.off`.
- `settings.game_volume` «Гучність гри» → en "Overall volume", uk «Загальна гучність»: it is the master bus, next to
  the new effects and music volumes.
- `connect.fail.body` stays, now only for a Direct join that gets no answer (connect_failed).
- `esc.game.leave_host_note` stays, moved into the confirm dialog.

### 12.4 Icons (own-work SVG, 24 grid, `currentColor` unless noted)

| Name | Purpose |
|---|---|
| `pointer.svg` | the ▸ marker of the hovered, focused or open main-menu item (ToyMenuItem's icon) |
| `chevron-left.svg`, `chevron-right.svg` | the stepper buttons (setting rows) |
| `chevron-down.svg` | the dropdown arrow (microphone list) |
| `lock.svg` | «only the host changes these» and the character lock |
| `teammate-mark.svg` | the mark next to a teammate's name (name plates, Role tab), dissidents only |
| `knife.svg` | the knife in a hand or belt slot (48 px) |
| `slider-knob.svg`, `slider-knob-disabled.svg` | ToySlider's grabber; drawn in the palette (yellow face, ink outline; disabled face and ink), not tinted |
| `swatch-disc.svg` | the white disc of a colour swatch, tinted by the body colour |
| existing: `check.svg`, `mic.svg`, `mic-off.svg`, `item.svg` (package), the system B room icons | ready marks and the done list; the mic; the package; the map rooms |

---

## 13. Agent decisions (small, reversible; to `docs/ui-decisions.md` as "(agent)")

1. Failures show on the connecting screen's layout with Back to s2 (the code or address kept), not as a line in the
   menu: the wireframe's s3 fail state, and M6 §3 item 5's return to the menu still holds.
2. Join failures share `connect.fail.title` and differ in the body; reasons that read the same are merged (the table in
   s3); `left` and `closed` show nothing.
3. No address on screen, even the one the player typed (streams); the code is shown.
4. The code is drawn as a keycap (ToyKeyOnDark, ToyKeyOnLight): it reads as something to type; no new variation.
5. Copy lives in the Esc Lobby tab (the lobby HUD has the mouse captured); the HUD shows the code only; «Скопійовано»
   for 1.5 s.
6. Direct takes one field with `host[:port]`; the port line shows the default.
7. Main-menu items as ToyMenuItem with a pointer icon on the current item (A Short Hike's arrow).
8. Map task rows are ToySettingRow; hovering a row or focusing its «?» lights the zones; every «?» looks the same.
9. Spectating drops the wireframe's ‹ › arrows and the rest of the HUD (the decision: only the name and the time).
10. While downed only the two plates and the mic show; the bleed-out bar uses the health ramp (time left as life), the
    raise bar the mint progress; a hold bar fills under the give-up line while the key is held.
11. Pre and post game black is ToyBackdropNight, the style's darkest, rather than a new pure black.
12. The role and the winner sit on the ToyTitlePlate (the showcase's role plate).
13. The Esc Ready button is ToyButtonPrimary «Готовність» with a check icon while ready.
14. The host's leave note moves into the confirm dialog; quitting while hosting asks the same.
15. Esc default tab: Lobby in the lobby, Game in a round and the tutorial; Role hidden in the lobby; the tutorial shows
    Game, Guide and Settings; Leave reads «Вийти з навчання».
16. Guide › Basics pages are how-to cards built from the tutorial's keys (one source).
17. Settings: Display holds the window mode, Accessibility large text and reduced motion; Controls rebinds 16 actions
    with a clash chip.
18. The Hat row stays hidden until hats exist; the guest's steppers are hidden (wireframe) and the host's are disabled
    at their bounds; a guest sees allowed and banned tasks as static chips.
19. Not ready is an empty mark, not a dash.
20. The HUD timer is mm:ss at a fixed width; `{time}` elsewhere stays m:ss.
21. HUD edges 40 px; the slots: the hand is always active, a one-handed item shows only its icon.
22. The last frame of a how-to card that shows the finish uses ToyHowtoFrameDone.
23. The tutorial ends back on the main menu with no end screen.
24. Each task type gets its own zone label (`map.zone_hint.switches`).
25. A lobby with too few players shows `lobby.need_more` in the status plate.
26. The spinner turns at half speed under reduced motion; fades are cuts.
27. Spacing comes from container variations over a new `space.*` scale (the theme test forbids overrides).
28. Space and the mouse buttons get translated keycap labels; letter keys follow the keyboard layout.

## 14. Engineer questions

1. **Two host buttons** (prime-game#373's handoff, "Left" item 3: one host serves one backend). (a) Recommended: the
   main menu's «Створити гру» hosts with a code; the Direct panel has its own «Створити гру» next to «Приєднатися».
   (b) One «Створити гру» that then asks: with a code or directly. (c) Direct hosting only from a launch option.

## 15. Work split

Adjusted from the default for balance: s4 moves from (d) to (e).

| Author | Screens | States | Why |
|---|---|---|---|
| (a) | s5 Esc menu | 17 | the largest screen; owns the Settings subtree that s2 embeds |
| (b) | s7 HUD, s9 downed and spectating | 10 | one HUD; s9 hides and returns s7's parts |
| (c) | s8 map, s1 tutorial | 6 | the map is what the tutorial teaches last; both draw P8 and keycaps |
| (d) | s2 main menu, s3 connecting and loading | 20 | the join with a code: the menu panels, every step and failure, loading |
| (e) | s4 lobby, s6 pre game, s10 post game | 10 | the session loop (lobby → black intro → black outro → lobby): plates and title plates on dark; the code row is fully specified here, so it needs no join context |

Shared parts: P1-P8 are drawn by each author from §1; s2 `settings` embeds s5 `settings-sound` (the renderer includes
it, or (d) draws it from §6 after (a)). New variations and keys go to the tokens and copy owner first (§12).
