# Lens 5: Motion, juiciness and UI sound (prime-game UX/UI research, wave 1)

Date: 2026-10-02. Read-only research. Godot facts were checked against `D:\prime-game\tools\out\godot-api\4.7.2\extension_api.json`
(a node script; every class, method, property and enum value named below exists there unless marked otherwise) and the
4.7 docs. Claims marked "(unconfirmed)" rest on memory, a secondary source, or a source I did not open.

## 0. The short version

- **Loud on rare moments, quiet on frequent ones.** Hover, press, item pickup and HUD changes happen hundreds of times a
  round: 60 to 120 ms, small scale changes, no wobble. The role reveal, countdown, downed moment and round end happen once
  or twice a round: they may be big, slow (1 to 3 s), bouncy and funny. This is where the "cringe-fun" lives.
- **Godot's transition + ease pairs are the source of truth for easing**, not arbitrary cubic-beziers. A fixed table of nine
  named easings; each DTCG token stores the nearest `cubicBezier` in `$value` and the exact Godot pair in `$extensions`;
  mockups get an exact CSS `linear()` curve sampled from the same Penner equations Godot uses, so a phone preview moves
  exactly like the game will.
- **Durations the rules own are never motion tokens.** The 5 s countdown, the 1 s give-up hold, the 30 s respawn and the
  3 s invulnerability come from game data and host events; motion only decorates inside them.
- **Reduced motion from day one:** an in-game setting whose default comes from
  `DisplayServer.accessibility_should_reduce_animation()`; mockups honour `prefers-reduced-motion` plus a toggle.
- **UI sounds:** Kenney's two CC0 UI packs, plus self-made sounds (ChipTone, jsfxr, ZzFX, or the humans' own recordings)
  are licence-clean for two public repos. **Sonniss GDC bundles are not**: their licence forbids supplying the raw files to
  others, and both prime-game (checked: `gh repo view` says PUBLIC) and prime-game-ui are public.
- **A game-specific sound risk:** with proximity voice and open microphones on speakers, a team-specific role sting can be
  heard by nearby players through someone's mic. Use the same sting for both teams (a human decision, below).

## 1. Principles: what makes a party game's UI feel alive and funny

**Juice.** Martin Jonasson and Petri Purho's GDC Europe 2012 talk
[Juice It or Lose It](https://www.gdcvault.com/play/1016487/juice-it-or-lose) turns a grey Breakout clone into a
gleeful one by layering tweens, scaling, squash, screen shake, particles and sound, each behind a slider. The lesson for UI
is the same: an element that *reacts* (it pops when it appears, squishes when pressed, settles when released, and makes a
sound) feels physical. Jan Willem Nijman's [The Art of Screenshake](https://www.youtube.com/watch?v=AJdEqssNZ-U)
(INDIGO 2013) adds the timing tricks: a short pause before a hit ("sleep" or hit-stop), camera kick, and permanence
(unconfirmed: from memory of the talk; the video is the source). The counterweight is Folmer Kelly's 2014 talk
[Don't juice it or lose it](https://www.gamedeveloper.com/design/video-indies-resist-the-urge-to-juice-it-or-lose-it-):
effects that do not fit the theme hurt more than they help.

**Duration discipline.** Nielsen Norman Group's [Executing UX Animations: Duration and Motion
Characteristics](https://www.nngroup.com/articles/animation-duration/) (2020): about 100 ms for small feedback, 200 to
300 ms for larger screen changes, most UI motion in 100 to 500 ms, and the more often an animation is seen, the shorter
and subtler it should be. Games may break the upper bound for *set pieces* that the player waits for anyway (a role
reveal over a black screen costs no one time).

**What makes it funny, not just smooth (my synthesis for this game):**
1. *Anticipation, action, hold, release.* Comedy needs a beat of stillness. The role reveal: black, 200 ms of nothing,
   then the team name slams in. The end screen: 400 ms of silent black before the winner drops.
2. *Overshoot and settle* (Godot `TRANS_BACK`, `TRANS_ELASTIC`, `TRANS_SPRING`): stickers that land a bit too big and
   wobble back. A slight random tilt (plus or minus 2 to 6 degrees) makes labels feel hand-stuck, like stickers on a
   suitcase, which suits the "cringe-fun" vibe without new art.
3. *Squash and stretch* on press: scale 0.96 on press, back to 1.0 with overshoot on release.
4. *Exaggerated text*, cheaply: Godot's `RichTextLabel` has built-in animated BBCode effects (`[wave]`, `[shake]`,
   `[tornado]`, `[pulse]`, `[rainbow]`, `[fade]`) ([BBCode in RichTextLabel, 4.7](https://docs.godotengine.org/en/4.7/tutorials/ui/bbcode_in_richtextlabel.html)).
   A `[shake]` on "DOWNED" or a `[wave]` on the winning team's name is a one-line joke. Use one per screen at most.
5. *Sound sells motion.* A pop without a sound feels like a glitch; a sound without motion feels like a bug report.
   Every set-piece motion gets a sound, and every UI sound has a visible cause.

**What tires players (and must be avoided here):**
- Looping animation in the first-person HUD during play. Peripheral motion pulls the eye from the world; only two
  things may move idly: the destination marker (you *want* to find it) and the downed-state vignette.
- Overshoot on frequent elements (a wobbling hand slot on every swap gets old in a minute).
- Animations that gate input. No menu, tab or button waits for its animation to finish before accepting the next key;
  Esc and Tab must respond on the same frame.
- Flashes. The [Game Accessibility Guidelines](https://gameaccessibilityguidelines.com/full-list/) list "Avoid flickering
  images and repetitive patterns" (basic) and "Avoid any sudden unexpected movement or events" (advanced). Use fades, not
  white flashes, for respawn and round end.

## 2. A motion vocabulary for our screens

Easing names refer to the table in section 3; durations to the scale there. "RM" is the reduced-motion variant.
"Rule time" means the duration comes from game data or a host event, not a token.

| Moment | Motion (default) | Duration / easing | RM variant | Sound |
|---|---|---|---|---|
| Screen change (menu, connecting, loading, lobby) | Cross-fade; or a skewed full-screen panel wipes across (a `StyleBoxFlat` with `skew`, so Godot-safe) | `base` 200 ms, `snap` in, `in` out | 120 ms fade | soft whoosh (optional) |
| Button hover / keyboard focus | Scale 1.0 to 1.04, plus StyleBox hover colour | `xfast` 80 ms, `out` | colour only | very quiet tick, rate-limited |
| Button press / release | Press 0.96 (`in`, 60 ms); release to 1.0 | `fast` 120 to 180 ms, `pop` | colour only | click |
| Toggle (Ready, F) | A "READY" stamp lands with a random tilt; un-ready shrinks out | in: `slow` 320 ms `pop`; out: `fast` `anticipate` | fade | toggle-on / toggle-off |
| Toast (player joined, left, host notices) | Slides 24 px down and fades in; holds 2.5 s; fades out; max 3 stacked, others shift | in `base` `snap`; out `fast` `in`; shift `fast` `out` | fade only | notification blip |
| Esc menu open / close | Backdrop dims; panel slides 32 px from its edge; tabs cross-fade 80 ms | `fast` 120 to 160 ms, `snap` / `in` | instant panel, 80 ms dim | menu open / close |
| Tab task screen (hold) | Panel scales 0.98 to 1.0 and fades in; rows stagger 30 ms | `fast`, `out` | fade, no stagger | none or a paper rustle |
| Countdown (Lobby, 5 s) | Each second the numeral pops in at 1.8x and settles to 1.0, then shrinks out before the next; last one becomes "GO" | per numeral: in 240 ms `pop`, out 160 ms `in`; total is rule time from the host | numeral swaps with a 100 ms fade | tick per second, pitched up a semitone each; go sting |
| Loading | A logo or icon bobs; progress bar fills from real progress | bob 1.2 s loop `in-out` | static | none |
| Role reveal (#175) | Black fades in; 200 ms hold; team sticker slams (1.6x to 1.0, -6 to -2 degrees); 4 px UI bump; subtitle types in (`visible_ratio` 0 to 1); dissident teammates stagger in 90 ms apart; hold to about 3 s or a key; exit | slam `slow` `pop` or `wobble` 600 ms; type 500 ms `linear`; exit `base` `in` | fade in 200 ms, hold, fade out | role sting at the slam (same for both teams, see 4.4) |
| Destination marker (carried package) | Ring pulses 1.0 to 1.15; off-screen it clamps to the edge with a bobbing arrow | 0.9 s loop `in-out` | static ring, no pulse | none (a sound would repeat forever) |
| Task progress (+1 by anyone) | Bar fills; a "+1" sticker pops by it and floats up 12 px while fading | fill `slower` 480 ms `out`; sticker `slow` `pop` | bar fill 120 ms, no sticker | task progress blip |
| Task complete | Row stamps "DONE" with tilt; bar flashes once to full colour (no white flash) | `slow` `wobble` | colour change | task done fanfare (short) |
| Number tickers (timer, counters) | Count up/down with `tween_method`; the last 10 s of the round timer pulse once per second | 300 to 600 ms `out`; pulse 200 ms `pop` | jump to value | last-10-s tick (quiet) |
| Item pickup / drop / swap (X) | Icon pops into its slot / shrinks out / the two slots cross-slide | `fast` `pop` / `fast` `in` / `fast` `out` | instant | pickup, drop, swap (very short) |
| Downed | Radial vignette fades in at the edges (a `TextureRect` with a `GradientTexture2D`, `FILL_RADIAL`, so no shader), then pulses slowly like a heartbeat; "DOWNED" drops in with a bounce and `[shake]` | vignette in `slow`, pulse 1.2 s loop `in-out`; label `slower` `bounce` | static vignette, no pulse, no shake | downed thud |
| Give-up hold (G, 1 s) / raise hold (E) | A radial fill (`TextureProgressBar`, radial `fill_mode`) | rule time, `linear` (it must match the real rule) | same (it is information) | rising tone while held, cut on release |
| Dead and spectating | "Spectating <name>" bar slides in; switching target cross-fades the name (the camera cuts) | `base` `snap`; switch `xfast` | fade | target switch tick |
| Respawn countdown (30 s) | Ticker; the last 3 seconds pop | ticker per second; pop `fast` `pop` | plain digits | last-3-s ticks |
| Respawn | Fade from black (never a white flash) | `base` `out` | same | respawn chime |
| Invulnerability (3 s) | A shield icon on the life panel with a shrinking ring | rule time, `linear` | same (it is information) | none |
| Round end (black screen, winner only) | 400 ms silent black; winner title drops with elastic wobble; optional confetti (`CPUParticles2D`) behind it; `[wave]` on the team name | title `slower` 700 ms `wobble`; confetti 1.5 s | fade in title, no confetti, no wave | round-end sting |
| Main menu idle | Logo sways plus or minus 2 degrees; buttons stagger in on first show | sway 4 s loop `in-out`; stagger 40 ms, `base` `out` | static | none |

Two rules that follow from the game, not taste: the countdown and every hold or timer read their time from the host
(the client tweens only the decoration of each second, so a late packet cannot make the visual lie); and the two "rule
time" indicators that carry information (give-up hold, invulnerability) are never removed by reduced motion.

## 3. Motion tokens in DTCG and how they map to Godot 4.7.2

### 3.1 What DTCG gives us

The [Design Tokens Format Module 2025.10](https://www.designtokens.org/tr/2025.10/format/) is a Final Community Group
Report (28 October 2025, "considered stable", not a W3C Standard). Relevant types:
- `duration`: an object `{"value": 120, "unit": "ms"}`, unit `ms` or `s`.
- `cubicBezier`: `[P1x, P1y, P2x, P2y]`, x in [0, 1], y any real number (so overshoot curves like Back fit).
- `transition` (composite): `duration`, `delay`, `timingFunction` (a cubicBezier or a reference).
- `$extensions`: vendor data under a reverse-domain key; tools must preserve unknown extension data.
A newer draft (dated 8 September 2026) exists but says not to implement it
([draft](https://www.designtokens.org/tr/drafts/format/)); target 2025.10.

DTCG has no keyword easings and no spring or elastic type, so elastic, bounce and spring cannot be expressed exactly.

### 3.2 Godot's easing model (verified)

`Tween.TransitionType`: `TRANS_LINEAR, TRANS_SINE, TRANS_QUINT, TRANS_QUART, TRANS_QUAD, TRANS_EXPO, TRANS_ELASTIC,
TRANS_CUBIC, TRANS_CIRC, TRANS_BOUNCE, TRANS_BACK, TRANS_SPRING`. `Tween.EaseType`: `EASE_IN, EASE_OUT, EASE_IN_OUT,
EASE_OUT_IN` (API dump). The curves are Robert Penner's equations: the engine source says so, Back uses `s = 1.70158`,
and Spring is Godot's own decaying sine
([easing_equations.h, 4.5-stable](https://raw.githubusercontent.com/godotengine/godot/4.5-stable/scene/animation/easing_equations.h);
unconfirmed that 4.7.2 is unchanged, though the enum is identical). So Godot tweens choose a *(transition, ease) pair*,
not a bezier. Arbitrary curves are still possible: `PropertyTweener.set_custom_interpolator(callable)` maps 0..1 to 0..1
(the docs' own example samples a `Curve` with `sample_baked`)
([PropertyTweener](https://docs.godotengine.org/en/4.7/classes/class_propertytweener.html)), and `tween_method` can feed
any function. We should not need either for UI.

### 3.3 Recommendation: a fixed table of nine easings

| Token `motion.ease.*` | Godot pair | DTCG `$value` (CSS cubic-bezier, easings.net) | Exact in CSS? | Use |
|---|---|---|---|---|
| `linear` | `TRANS_LINEAR`, any | `[0, 0, 1, 1]` | yes | timers, holds, typing |
| `out` | `TRANS_CUBIC, EASE_OUT` | `[0.33, 1, 0.68, 1]` | close | default for things arriving |
| `in` | `TRANS_CUBIC, EASE_IN` | `[0.32, 0, 0.67, 0]` | close | things leaving |
| `in-out` | `TRANS_SINE, EASE_IN_OUT` | `[0.37, 0, 0.63, 1]` | close | loops: bob, pulse, sway |
| `snap` | `TRANS_EXPO, EASE_OUT` | `[0.16, 1, 0.3, 1]` | close | panels, toasts, screen wipes |
| `pop` | `TRANS_BACK, EASE_OUT` | `[0.34, 1.56, 0.64, 1]` | close | stickers, release, countdown |
| `anticipate` | `TRANS_BACK, EASE_IN` | `[0.36, 0, 0.66, -0.56]` | close | a wind-up before leaving |
| `wobble` | `TRANS_ELASTIC, EASE_OUT` | fallback `pop` | no: use `linear()` | role and winner titles only |
| `bounce` | `TRANS_BOUNCE, EASE_OUT` | fallback `out` | no: use `linear()` | "DOWNED" drop only |

The bezier values are [easings.net](https://easings.net/)'s CSS approximations
([source file](https://raw.githubusercontent.com/ai/easings.net/master/src/easings.yml)); easings.net itself lists no
bezier for Elastic and Bounce. `TRANS_SPRING` is left out until a direction asks for it.

Token shape (my proposal; the `$extensions` key is a placeholder until the repo exists):

```json
"motion": {
  "duration": { "$type": "duration", "fast": { "$value": { "value": 120, "unit": "ms" } } },
  "ease": {
    "$type": "cubicBezier",
    "pop": { "$value": [0.34, 1.56, 0.64, 1],
             "$extensions": { "io.github.xperiaroco2.prime-game-ui": { "godot": ["TRANS_BACK", "EASE_OUT"] } } }
  },
  "transition": { "$type": "transition",
    "sticker-in": { "$value": { "duration": "{motion.duration.slow}", "delay": { "value": 0, "unit": "ms" },
                                "timingFunction": "{motion.ease.pop}" } } }
}
```

**Duration scale:** `instant` 0, `xfast` 80, `fast` 120, `base` 200, `slow` 320, `slower` 480, `beat` 200 (a comedic
pause), plus loop periods `loop-quick` 900 and `loop-slow` 1200 and `loop-idle` 4000 ms. Set pieces are sequences of
these, not single long tokens.

**The mockup side:** the token build script emits CSS custom properties: `--motion-ease-pop: cubic-bezier(...)` for the
close ones, and for all nine a second property, `--motion-ease-pop-exact: linear(...)`, sampled (about 40 points) from a
JavaScript port of Godot's Penner functions. CSS `linear()` takes a list of progress points, allows values outside 0..1
(overshoot), and is Baseline widely available
([MDN: linear()](https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function/linear)). That makes elastic and
bounce previews exact on a phone, and keeps one rule: if it is not in the table, Godot cannot do it with a plain tween,
so the mockup may not use it either.

**The Godot side:** the generator writes a typed GDScript constants class (for example `UiMotion` with
`const FAST := 0.12` and pairs as `Tween.TransitionType` and `Tween.EaseType` values), not Theme entries:
`Theme.set_constant(name, theme_type, constant: int)` holds ints only (API dump), and durations are floats. Colours
stay in the Theme, so the screens' "no `Color(...)` in screen code" rule (client/CLAUDE.md) still holds: a pulse
tweens `modulate` or `self_modulate` between `Color.WHITE` and a theme colour read with `get_theme_color`.

### 3.4 How to build each kind of motion in Godot 4.7.2

- **Tweens** (all verified in the dump): `Node.create_tween()` binds the tween to that node, so it halts outside the tree
  and dies with the node ([Tween, 4.7](https://docs.godotengine.org/en/4.7/classes/class_tween.html)).
  `tween_property(obj, path, final, duration)` returns a `PropertyTweener` with `from`, `from_current`, `as_relative`,
  `set_trans`, `set_ease`, `set_delay`. Sequences are the default; `parallel()` runs the next tweener alongside,
  `set_parallel(true)` makes all parallel and `chain()` goes back to sequence. `tween_callback`, `tween_interval`,
  `tween_subtween` (nest a tween), `set_loops`, `set_speed_scale`, `kill`, signals `finished`, `step_finished`,
  `loop_finished`. Number tickers: `tween_method(func(v: float) -> void: label.text = str(int(v)), from, to, d)`.
  Typing text: tween `Label.visible_ratio` 0 to 1. Progress bars: tween `Range.value`.
- **Pitfalls from the docs:** more than one tween on the same property: the last created wins; tweens are not reusable
  ("undefined behavior"). So each animated element keeps its tween in a field and kills it before starting a new one,
  always tweening to absolute targets (otherwise a hover cut mid-way leaves a button stuck at 1.03x).
- **Pause and time:** the Esc menu cannot pause a multiplayer tree, so the default `TWEEN_PAUSE_BOUND` is fine; if a
  debug slow-motion ever changes `Engine.time_scale`, UI tweens call `set_ignore_time_scale(true)`.
- **Tests:** `Tween.custom_step(delta)` advances a tween by hand, so GdUnit4 can assert the end state of an animation
  headlessly without waiting.
- **Containers.** Containers set their children's position and size; the Control docs note that container layouts do not
  account for `scale` ([Control, 4.7](https://docs.godotengine.org/en/4.7/classes/class_control.html)). So: animate
  `scale`, `rotation`, `modulate` on container children, with `pivot_offset_ratio = Vector2(0.5, 0.5)` (in the 4.7.2
  dump; it keeps the pivot centred whatever the size, where `pivot_offset` is in pixels); for anything that moves
  (slide, bump, shake), put the visual inside a plain `Control` wrapper that holds the layout slot and tween the inner
  node's `position`. Never tween `size` or `custom_minimum_size` of a container child (it re-sorts the container every
  frame; unconfirmed as a measured cost, it is the documented container behaviour applied per frame).
- **AnimationPlayer** (`play`, `play_backwards`, `queue`) suits multi-track set pieces tuned visually in the editor.
  Here the humans author no animation and tokens must stay the single source, so: tweens in code for everything at first;
  revisit AnimationPlayer only if a set piece needs hand timing the designer wants to tweak.
- **Shaders (CanvasItem)**, only for two or three set pieces, never on every button: a diagonal shine band moving with
  `TIME` across the role sticker; a vertex wobble on the winner title; a dissolve using a `NoiseTexture2D` (generated in
  the engine, so nothing to download). Built-ins `TIME`, `UV`, `COLOR`, `TEXTURE`, `VERTEX`, `SCREEN_UV` and
  `hint_screen_texture` are available ([CanvasItem shaders, 4.7](https://docs.godotengine.org/en/4.7/tutorials/shaders/shader_reference/canvas_item_shader.html)).
  A distinct material per control may break 2D batching (unconfirmed for 4.7; the page says nothing about it).
  Gradients and vignettes need no shader: `GradientTexture2D` has `FILL_RADIAL` (dump).
- **Performance:** a few dozen short tweens per frame are negligible (unconfirmed; no measurement). The real costs are
  per-frame relayout and many shader materials, both avoided above.

### 3.5 Reduced motion

Godot 4.7.2 has `DisplayServer.accessibility_should_reduce_animation()`: 1 if moving content should be disabled, 0 if
not, -1 if unknown, implemented on Android, macOS and Windows
([class reference, master branch](https://raw.githubusercontent.com/godotengine/godot/master/doc/classes/DisplayServer.xml);
the method is in the 4.7.2 dump; the platform note was read from master, so unconfirmed for 4.7.2 exactly). On Windows 11
the OS switch is Settings > Accessibility > Visual effects > Animation effects
([MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)).
Plan: a "Reduce motion" setting in the Esc menu, defaulting to the OS answer on first launch; one flag that every
`UiMotion` helper reads. Under it: scale, slide, rotation, shake, elastic and bounce become fades of 150 ms or less;
idle loops stop; BBCode motion tags (`[wave]`, `[shake]`, `[tornado]`) are stripped; confetti and UI bumps are off;
information-bearing indicators (holds, invulnerability ring, countdown digits) stay. MDN's own advice matches: replace
scaling and panning with dissolves.

## 4. UI sounds

### 4.1 The set we need (about 20 sounds)

| Group | Sounds | Notes |
|---|---|---|
| Navigation | hover, click, confirm, back/cancel, error (an intent the host rejected), menu open, menu close, tab switch | hover very quiet and rate-limited (one per 60 ms); random pitch about 5% |
| Toggles | toggle on, toggle off (Ready) | a pair: rising vs falling |
| Lobby | player joined, player left, countdown tick (x5, pitch rising), go | the tick is one sample pitched by `pitch_scale` |
| Round | role sting, task progress (+1), task done, last-10-s tick | task sounds are public events: everyone may hear them |
| Life | downed, give-up hold tone, raised, respawn, spectate switch | personal; never routed to the world |
| End | round-end sting (winner) | one sting, or win and lose variants (a human decision) |

The [Game Accessibility Guidelines](https://gameaccessibilityguidelines.com/full-list/) ask that key sounds be distinct
from each other, that no essential information is conveyed by sound alone, and for separate volume controls for effects,
speech and music. Every sound above has a visual twin in section 2, and the UI bus gets its own slider.

### 4.2 Sources and licences (all fine for a commercial game unless stated)

| Source | Licence (where confirmed) | In a public repo? | Notes |
|---|---|---|---|
| [Kenney Interface Sounds](https://kenney.nl/assets/interface-sounds) (100 files) | CC0, stated on the official page | yes | clicks, toggles, confirms, errors |
| [Kenney UI Audio](https://kenney.nl/assets/ui-audio) (50 files) | CC0, stated on the official page | yes | older, smaller set; same use |
| [ChipTone](https://sfbgames.itch.io/chiptone) (SFB Games) | the page: sounds made with it are free for any purpose, commercial or not, under CC0 | yes | a free tool; great for stings and ticks with character |
| [jsfxr / sfxr.me](https://sfxr.me/) | tool code under the Unlicense; the page states unrestricted commercial use | yes | runs in the browser; save the parameter JSON next to the WAV so a sound can be re-made |
| [ZzFX](https://github.com/KilledByAPixel/ZzFX) (Frank Force) | MIT (code); a sound is a parameter array | yes | under 1 KB; plays in a mockup with no audio files at all; its [designer](https://killedbyapixel.github.io/ZzFX) exports WAV |
| [Freesound](https://freesound.org/help/faq/), CC0 only | licence is per sound (CC0, CC BY, CC BY-NC, Sampling+) | CC0 only | downloading needs a logged-in account, so only a human can fetch; filter by licence and record each sound's URL |
| [Sonniss #GameAudioGDC bundles](https://sonniss.com/gameaudiogdc/) | royalty-free, commercial use, no attribution ([licence](https://sonniss.com/gdc-bundle-license/)) | **no** | the licence forbids supplying the sound effects as sound effects to anyone else, modified or not; a public repo does exactly that. It also bans AI/ML training use |
| The humans' own recordings | they own them | yes | kazoo, "ta-da", a squeaky toy: the most "cringe-fun" and unique option; licence-clean by construction |

Every file goes into `docs/credits/` (prime-game's `credits` command already fails `check` on an LFS asset without an
entry; the new repo should copy that rule). No agent downloads any of these without the human's per-batch approval.

### 4.3 How Godot 4.7.2 plays them (verified in the dump)

- **Buses.** prime-game has no `default_bus_layout.tres` yet (checked: none at the root, no audio keys in
  `project.godot`), so everything plays on Master. Add `Master <- Music, World, Voice, UI` when the port happens; players
  choose a bus by name, and a player whose bus name is missing outputs to Master
  ([Audio buses, 4.7](https://docs.godotengine.org/en/4.7/tutorials/audio/audio_buses.html)). Volume sliders map
  linear to dB with `AudioServer.set_bus_volume_linear` (exists in the dump).
- **One player for all UI sounds:** an `AudioStreamPlayer` on bus `UI` whose stream is an `AudioStreamPolyphonic`
  (`polyphony`, default 32 per the docs; 8 to 16 is plenty). After `play()`, `get_stream_playback()` returns an
  `AudioStreamPlaybackPolyphonic` whose `play_stream(stream, from_offset, volume_db, pitch_scale, playback_type, bus)`
  starts a voice ([AudioStreamPolyphonic](https://docs.godotengine.org/en/4.7/classes/class_audiostreampolyphonic.html);
  the need to call `play()` first is unconfirmed: the docs do not say).
- **Variation:** each sound is an `AudioStreamRandomizer` (`add_stream`, `random_pitch`, `random_pitch_semitones`,
  `random_volume_offset_db`, `playback_mode` with `PLAYBACK_RANDOM_NO_REPEATS`), so a hover or footstep-like tick never
  sounds mechanical. The countdown tick is one sample played with a rising `pitch_scale`.
- **Format:** short WAV for UI (no decode cost), OGG for stings over a second (unconfirmed as a measured difference;
  common practice).

### 4.4 A risk only this game has

Proximity voice is the core mechanic. A player on speakers with an open mic will leak their UI sounds into the voice
that nearby players hear (unconfirmed how much: voice capture and any echo cancellation are M5 work). Roles are "not a
protected secret" by the vision, but the privacy rule says no screen shows another player's role. If the engineers' and
dissidents' role stings differ, a dissident standing next to you at round start can be heard through their mic. The same
holds for any dissident-only sound. So: one role sting for both teams (the team difference lives on screen), and keep
private-event sounds identical across teams.

## 5. Previewing motion and sound in the HTML mockups

- **Tokens drive the CSS.** The build script turns `tokens.json` into CSS custom properties (durations, beziers and the
  exact `linear()` curves), so a mockup cannot drift from the tokens.
- **A "motion lab" page** (an interactive artifact the human opens on the phone): one tile per easing and per moment in
  section 2; tap to replay; a slow-motion switch (x0.25, by multiplying every duration variable, or the Web Animations
  API's `playbackRate`); a reduced-motion switch that also follows the OS `prefers-reduced-motion`; a sound switch.
- **Phones have no hover.** Show hover states as a "hover" demo state on tap-and-hold or a toggle, and say so on the page.
- **Sound in mockups:** inline ZzFX (MIT; keep its licence comment; under 1 KB, so no CDN is needed and the artifact
  rules on external scripts are not touched) to play placeholder blips from parameter arrays; browsers only start audio
  after a user gesture (unconfirmed: from memory of browser autoplay policy), so the sound switch is the gesture. Once a
  CC0 batch is approved and credited, the mockup plays the real files from the repo.
- **What a phone preview cannot judge:** the mix against game audio and voice, and hover feel with a mouse. A desktop
  check at the "choice" step covers that.

## 6. Suggested process fit

References (lens 1) -> wireframes, each with a motion row from section 2 -> 3 to 4 style directions, **each with a motion
personality and a sound palette** (a direction is as much how it moves and sounds as how it looks) -> choice -> tokens
(including `motion.*`) and components with their states and transitions -> screens -> later the Godot port (`UiMotion`,
`UiSounds`, bus layout, reduced-motion setting).

## Gaps

- Material Design 3's motion token tables could not be read (the page needs JavaScript); its values are not used here.
- No dedicated GDC talk on *UI* animation was found in the time; the principles rest on the two juice talks, NN/g and the
  accessibility guidelines.
- `play()` before `get_stream_playback()` on a polyphonic player, 4.7 batching cost of per-control materials, the exact
  4.7.2 platform list of `accessibility_should_reduce_animation`, and the "sleep" trick in The Art of Screenshake are
  unconfirmed.
- Kenney packs' file formats and sizes were not stated on their pages; the licence file inside the zip was not opened
  (nothing downloaded).
- Browser autoplay rules for Web Audio were not re-checked.

## Sources

- GDC Vault, Juice It or Lose It (Jonasson, Purho, 2012): https://www.gdcvault.com/play/1016487/juice-it-or-lose
- The Art of Screenshake (Nijman, INDIGO 2013): https://www.youtube.com/watch?v=AJdEqssNZ-U
- Game Developer, Don't juice it or lose it (Kelly, 2014): https://www.gamedeveloper.com/design/video-indies-resist-the-urge-to-juice-it-or-lose-it-
- NN/g, Animation duration (2020): https://www.nngroup.com/articles/animation-duration/
- Game Accessibility Guidelines, full list: https://gameaccessibilityguidelines.com/full-list/
- DTCG Format Module 2025.10: https://www.designtokens.org/tr/2025.10/format/ ; draft: https://www.designtokens.org/tr/drafts/format/
- Godot 4.7 Tween: https://docs.godotengine.org/en/4.7/classes/class_tween.html
- Godot 4.7 PropertyTweener: https://docs.godotengine.org/en/4.7/classes/class_propertytweener.html
- Godot 4.7 Control: https://docs.godotengine.org/en/4.7/classes/class_control.html
- Godot 4.7 BBCode in RichTextLabel: https://docs.godotengine.org/en/4.7/tutorials/ui/bbcode_in_richtextlabel.html
- Godot 4.7 CanvasItem shaders: https://docs.godotengine.org/en/4.7/tutorials/shaders/shader_reference/canvas_item_shader.html
- Godot 4.7 AudioStreamPolyphonic: https://docs.godotengine.org/en/4.7/classes/class_audiostreampolyphonic.html
- Godot 4.7 Audio buses: https://docs.godotengine.org/en/4.7/tutorials/audio/audio_buses.html
- Godot DisplayServer class reference (master): https://raw.githubusercontent.com/godotengine/godot/master/doc/classes/DisplayServer.xml
- Godot easing equations (4.5-stable): https://raw.githubusercontent.com/godotengine/godot/4.5-stable/scene/animation/easing_equations.h
- Godot tween cheat sheet image (linked from the Tween docs): https://raw.githubusercontent.com/godotengine/godot-docs/master/img/tween_cheatsheet.webp
- Godot 4.7.2 API dump (local): D:\prime-game\tools\out\godot-api\4.7.2\extension_api.json
- easings.net: https://easings.net/ ; its curve file: https://raw.githubusercontent.com/ai/easings.net/master/src/easings.yml
- MDN, linear() easing: https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function/linear
- MDN, prefers-reduced-motion: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
- Kenney Interface Sounds: https://kenney.nl/assets/interface-sounds ; Kenney UI Audio: https://kenney.nl/assets/ui-audio
- ChipTone: https://sfbgames.itch.io/chiptone
- jsfxr: https://sfxr.me/
- ZzFX: https://github.com/KilledByAPixel/ZzFX
- Freesound FAQ: https://freesound.org/help/faq/
- Sonniss GameAudioGDC: https://sonniss.com/gameaudiogdc/ ; licence: https://sonniss.com/gdc-bundle-license/
