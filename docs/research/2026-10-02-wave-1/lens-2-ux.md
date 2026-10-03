# Lens 2: UX of social and party games, applied to prime-game

Research agent, lens 2 of 6, 2026-10-02. Read-only. Every claim has a link; "(unconfirmed)" marks a claim
that rests on a search snippet, a fan wiki, a blog, a forum or memory rather than a primary source I opened.

## 0. What makes our game different (and what that does to the UI)

Read from the repo (live, `D:\prime-game`): `client/ui/*.gd`, `client/life/life_hud.gd`, `client/app/end_reasons.gd`,
`project.godot`, issues #169 and #175, `docs/decisions/2026-10-01-vision-revision-1.md`.

Five facts of our game shape almost every screen:

1. **Proximity voice is the fun, and it has unusual rules.** Nobody hears a downed or dead player; the dead hear no
   voice at all, only the world sounds around their spectate target (vision revision 1, V11, lines 153-193). In
   every reference game the dead *can* talk (Among Us ghosts chat with ghosts, per
   [Wikipedia](https://en.wikipedia.org/wiki/Among_Us); Lethal Company's dead talk to each other, per a
   [Steam thread](https://steamcommunity.com/app/1966720/discussions/0/5513030717662354322/) (unconfirmed); R.E.P.O.
   lets the dead talk through a possessed "death head", per
   [TheGamer](https://www.thegamer.com/repo-death-head-possession-explained-guide/) (unconfirmed)). Our players will
   arrive with that expectation and think their microphone broke. **The UI must say it, every time.**
2. **Roles are dealt privately but are not a protected secret.** The role screen can be informative rather than a
   dramatic "Shhh" reveal.
3. **Death does not take you out** (downed, raised, or dead, spectate, respawn in about 30 s with 3 s of
   invulnerability). Three short states, each needs its own clear screen and countdown.
4. **Colour carries the core task.** Ten package colours, ten circles, and ten body colours (palette in
   `content/tasks/delivery.tres`). If the body palette equals the package palette, "the red one" becomes ambiguous.
5. **Player-hosted by address now, Steam later.** The host must be able to read out what friends type.
   `client/ui/main_menu.gd` today has Address, Port, Host, Join, Quit and no name field.

The live code also shows: no `push_to_talk` or mute action in `project.godot`'s `[input]` section (actions present:
movement, sprint, jump, interact, put_down, use, swap, task_screen, ready, debug_overlay, give_up, spectate_next,
spectate_previous); and `EndReasons.WORDS` already names every failure (`wrong_version`, `wrong_content`,
`joins_closed`, `full`, `connect_failed`, `host_lost`, `load_deadline`...) but in developer words ("put both
machines on the same commit").

## 1. Main menu and first launch

- **Job:** get a new player into a lobby with a working name and microphone in under a minute.
- **Must show:** name field (first launch: required), Host, Join (address, port, remembered last address),
  Settings, Quit, game version, the last session's end reason.
- **References:** Content Warning puts you straight into an in-world house after "Host"; invites go through an
  in-world monitor or the Steam overlay, and you start the run by opening the front door
  ([Gameleap](https://www.gameleap.com/articles/content-warning-how-to-host-and-invite-friends), unconfirmed).
  Jackbox's whole join flow is "type the short code shown on the host's screen, then your name"
  ([Jackbox support](https://support.jackboxgames.com/hc/en-us/articles/15794759479959-How-do-I-join-a-game),
  unconfirmed: search snippet). Steam lobbies later give invites from the friends list and overlay, and a click on an
  invite launches the game with `+connect_lobby`
  ([Steamworks matchmaking](https://partner.steamgames.com/doc/features/multiplayer/matchmaking)).
- **Anti-patterns:** a menu tree before the first fun; asking for a name after joining; hiding the version (our
  `wrong_version` failure is then undiagnosable).
- **Recommendation:** one screen, two big verbs. First launch adds a one-time strip: name, language (UK/EN), a mic
  check with a live level bar. Remember name, address and port. After Host, the lobby HUD shows the host's join
  info ("Friends join: 192.168.1.20 : 7777") so the host can read it out, the Jackbox lesson.
- **Wireframe:**
  ```
  [top-left] logo / game name             [top-right] v0.4.0 (build) 
  [centre]  HELLO, <name> (edit)
            [ HOST A GAME ]   [ JOIN ]  address [______] port [7777]
            [ Settings ]  [ Quit ]
  [bottom]  banner: last end reason in player words + "Details" (opens the log text)
  first launch only: overlay card  Name [____]  Language (UK|EN)  Mic: [||||   ] "Say something"  [Done]
  ```
- **States:** first launch; returning; after an error (banner); host failed to start (`cannot_host`).
- **Priority:** MVP (name + version + player-word banner); first-launch mic check MVP; 3D backdrop later.

## 2. Connecting and loading

- **Job:** reassure that something is happening, then show who is ready.
- **Must show:** connecting: target address, elapsed time, Cancel. Loading: map name, each player's loading state
  (public), one tip.
- **References:** loading screens are the classic slot for bite-sized tips that lower in-game load
  ([Wayline](https://www.wayline.io/blog/tutorial-ux-indie-game-onboarding), unconfirmed: blog).
- **Anti-patterns:** a spinner with no address (the player cannot spot a typo); tips that teach things the player
  cannot do yet; a per-player list that shows anything private (only names and loaded or not).
- **Recommendation:** keep today's two screens; add the elapsed seconds and, after 5 s, the hint "Is the address
  right? Is the host's firewall open for UDP?" (`connect_failed` words, shortened). Loading: a row per player with a
  tick when loaded, and a tip line read from content data (designer-owned text). `load_deadline` gets its own error.
- **Wireframe:**
  ```
  CONNECTING                          LOADING  <map name>
  to 192.168.1.20:7777  (3 s)         [x] Ana   [x] Bo   [ ] Cy (loading...)
  [ Cancel ]                          tip: "Hold E on a downed friend to raise them."
  ```
- **States:** connecting; slow (>5 s); refused (one of the reasons in section 11); loading; someone slow.
- **Priority:** MVP (it exists; add the hint, ticks and tip).

## 3. The lobby (in-world)

- **Job:** the first fun. Walk, talk, try the controls, pick a colour, see who is ready, start.
- **Must show:** roster (name, body colour, ready, speaking dot), Ready state and key, host's settings (read-only to
  others), countdown, the host's join info, colour picker.
- **References:** Among Us picks colours at an in-world laptop; one colour per player per lobby
  ([Among Us wiki: Colors](https://among-us.fandom.com/wiki/Colors), unconfirmed). Content Warning's lobby is a
  walkable house with an in-world invite monitor (above). Party Animals' lobby owner changes settings (maps, teams,
  HP, stamina, weapons) without leaving
  ([Party Animals support FAQ](https://wp-support.partyanimals.com/2023/08/22/custom-game-faq/), unconfirmed). Among Us
  hosts set speed, meetings and task counts before the match ([Wikipedia](https://en.wikipedia.org/wiki/Among_Us)).
  Game UI Database has a "Pre-Game & Lobby" category ([link](https://www.gameuidatabase.com/index.php?scrn=43)) and
  "Matchmaking Lobby" ([link](https://www.gameuidatabase.com/index.php?scrn=181)) for visual references (the site
  refused my fetch: links only).
- **Anti-patterns:** a settings panel covering the world (the exact problem #169 fixed); a ready list that only the
  host sees; a countdown that cannot be stopped when someone un-readies.
- **Recommendation:** keep #169's split: the world plus a small roster chip and the hint, and everything editable in
  the Esc menu's Lobby tab. **Colour picker now:** a row of 10 swatches in the Lobby tab, each with its colour name
  under it (Among Us added "colorblind text" for exactly this, per
  [Gamepur](https://www.gamepur.com/guides/among-us-june-2022-patch-notes-colorblind-settings-bugfixes-and-more),
  unconfirmed), a taken colour greyed with its owner's name. **Later:** an in-world mirror or wardrobe that opens the
  same picker. Countdown: a big centred number in the last 5 s, with "Starting... (F to cancel ready)".
  Suggest to the designer a small practice corner in the lobby level (a package and its circle), learning in the
  lobby instead of a tutorial (section 13).
- **Wireframe (HUD over the world):**
  ```
  [top-left]  LOBBY 6/10 ready  · Ana● Bo○ Cy● ...  (● ready, ring pulses = speaking, you hear them)
  [top-right] host only: "Friends join: 192.168.1.20 : 7777"
  [centre]    countdown 5..1 (only in Countdown)
  [bottom-centre] F: ready   Esc: menu & settings   [mic chip]
  ```
- **States:** alone in the lobby ("Waiting for players: tell friends the address"); not enough players (show the
  host's shortfalls, already in `LobbyPanel`); all ready; countdown; host vs client (settings editable vs read-only).
- **Priority:** MVP (roster chip, join info, colour row in Lobby tab, countdown); in-world mirror later.

## 4. Role screen at the round's start (#175)

- **Job:** in two seconds, "which side am I on and what do I do".
- **Must show:** own side's display name, a one-line goal (content data), side colour or emblem; for a dissident,
  their teammates (name + body colour). Nothing about anyone else (privacy rule).
- **References:** Among Us plays a "Shhh" stinger then the role card
  ([Among Us wiki: Red](https://among-us.fandom.com/wiki/Red), unconfirmed); Project Winter shows each player their
  role alone and marks traitors to each other with a red symbol
  ([Project Winter wiki](https://projectwinter.fandom.com/wiki/Player_Roles), unconfirmed); Goose Goose Duck guides
  advise reading your role at each round start because lobbies change roles
  ([ExitLag](https://www.exitlag.com/blog/goose-goose-duck-tips-and-tricks-for-winning/), unconfirmed). Fall Guys
  opens each round with a short intro and later shortened the longest intros
  ([Fall Guys notes](https://www.fallguys.com/en-US/news/fall-guys-creative-construction-release-notes),
  unconfirmed: search snippet).
- **Anti-patterns:** a long dramatic reveal while others already move (a dissident could act while engineers read);
  a role shown only once and never again; a goal line that names mechanics the player has not seen.
- **Recommendation:** a non-blocking banner over the world for about 3 s (input stays live, everyone sees it at the
  same tick), then it shrinks into a small chip next to the clock ("Engineer") and lives on in the Tab screen, as
  #175 asks. Because the role is not a protected secret, it can be loud and funny rather than secretive.
- **Wireframe:**
  ```
  [centre, 3 s]   YOU ARE AN ENGINEER            (side colour bar)
                  Carry every package to the circle of its colour before time runs out.
                  dissident only: Your team: ● Bo  ● Cy
  [after]         chip under the clock: "Engineer"  (Tab: details)
  ```
- **States:** engineer; dissident with teammates; dissident alone; 0 dissidents (crew screen still shows); late
  arrival of RoleAssigned (show when it arrives); respawn (do not replay).
- **Priority:** MVP.

## 5. Minimal first-person HUD

- **Job:** the least ink that answers "what can I do here, what am I holding, how long is left, can people hear me".
- **Must show:** crosshair; interaction prompt; hands and belt; shared task progress; clock; the carried package's
  destination (swatch + name) and its world marker; own mic state; speaking cues; health only when it matters.
- **References:** Lockdown Protocol combines health and stamina in one bar, uses a two-item limit and does item
  actions "with only two buttons", and puts the map and task procedures in an in-world tablet
  ([Mirage Creative Lab](https://miragecreativelab.com/lockdown-protocol/)). Lethal Company's base game lacked a clear
  own-mic indicator: players install VoiceHUD to see a push-to-talk icon
  ([Thunderstore](https://thunderstore.io/c/lethal-company/p/5Bit/VoiceHUD/), unconfirmed), and another mod fixes a
  speaking icon that lied while spectating
  ([Spectator Voice Icon Fix](https://thunderstore.io/c/lethal-company/p/ficcialfaint/Spectator_Voice_Icon_Fix/),
  unconfirmed). R.E.P.O. has a quick mute key, B by default
  ([repo-game.org](https://www.repo-game.org/en/repogame-voice-chat), unconfirmed: fan site). The Game Accessibility
  Guidelines recommend a visual indication of who is speaking (colour, name, an indicator over the speaker)
  ([GAG](https://gameaccessibilityguidelines.com/provide-a-visual-indication-of-who-is-currently-speaking/); it is
  written for dialogue, not voice chat).
- **Anti-patterns:** a global "now talking" list in the round (it would tell you who speaks out of earshot and
  defeat proximity voice); a mic icon that shows "talking" when nobody can hear you (the Lethal Company bug); text
  labels "Health 100", "Stamina 7" as today's greybox does.
- **Recommendation:** a speaking cue **on the avatar** (a ring or glow over the head, or the mask mouth later, #73),
  driven by the voice the listener actually receives and plays, so it can never show a voice you cannot hear. A
  small own-mic chip with four states: open, push-to-talk idle, transmitting, **blocked by the game** (downed or
  dead). The prompt near the crosshair names the key and the object: "[E] Pick up Red package".
- **Wireframe:**
  ```
  [top-centre]   04:12   ·   Delivered 3/8   ·  chip "Engineer"
  [centre]       • crosshair   prompt under it: [E] Pick up  ● Red package
  [bottom-left]  mic chip (open / PTT / talking / "nobody hears you")
  [bottom-right] L hand: ● Red package   R hand: Knife   Belt: —
                 destination: ● RED circle →  (marker in the world shows the circle, through walls)
  [screen edge]  red vignette when hurt; health bar appears only below full
  ```
- **States:** empty hands; carrying a package; invulnerable (a shield icon for 3 s); no mic device (chip says "no
  microphone", links to Settings).
- **Priority:** MVP (layout, prompt, mic chip, destination name); avatar speaking cue MVP if the engine exposes a
  per-speaker level, else later.

## 6. Tab task screen

- **Job:** the game's manual and status in one held key: what my side does, what is left.
- **Must show:** own side and goal (role reminder, #175), clock, shared progress, each task with type, description
  and progress; for Delivery, which colours are done (only if that is public: circles are open knowledge, so likely
  yes; **check `ClientModel` has it**).
- **References:** Lockdown Protocol's tablet carries the map and the "procedures for every task"
  ([Mirage Creative Lab](https://miragecreativelab.com/lockdown-protocol/)); NN/G's case for help that is easy to
  dismiss and rediscover ([NN/G](https://www.nngroup.com/articles/onboarding-tutorials/)).
- **Anti-patterns:** a full-screen sheet that hides danger while held; a map (none for now, by design).
- **Recommendation:** a translucent centred card while Tab is held (a "toggle" option in Settings), with a 10-chip
  colour grid for Delivery (filled = delivered, each chip with its colour name).
- **Wireframe:**
  ```
  ENGINEER: carry every package to its circle before time runs out      04:12
  Shared progress  ███████░░░  7/10
  DELIVERY  ●Red ✓  ●Orange ✓  ●Yellow ·  ●Green ✓ ... (names under swatches)
  Controls: E pick up · Q put down · X swap hands · LMB use
  ```
- **States:** no tasks yet; all done; spectating (show the same public card); dissident (side goal differs).
- **Priority:** MVP (exists; add the role line, grid, controls footer).

## 7. Downed, dead, spectating, respawn

- **Job:** tell the player what state they are in, how long it lasts, what they can do, and that they cannot talk.
- **Must show:** downed: "Knocked down", bleed-out countdown, being raised by whom, hold G to give up, **"Nobody
  can hear you"**. Dead: respawn countdown, "Spectating <name>" with the target's public hand and belt, LMB/RMB to
  switch, **"The dead hear only the world"**. Respawn: 3 s invulnerability.
- **References:** Fall Guys flips to a big "Eliminated!" card and lets you spectate almost at once
  ([Fall Guys wiki](https://fallguysultimateknockout.fandom.com/wiki/Round_Over_Screen), unconfirmed); Among Us
  ghosts keep doing tasks ([Wikipedia](https://en.wikipedia.org/wiki/Among_Us)); R.E.P.O.'s death-head UI moves out
  of the way of messages in the same corner
  ([R.E.P.O. news](https://steamcommunity.com/app/3241660/allnews/?l=english), unconfirmed).
- **Anti-patterns:** silently cutting the mic; a death screen that waits for a click; showing the target's health
  (forbidden by our privacy rule).
- **Recommendation:** reuse the life panel at the bottom centre, one big number per state, and the mic chip turning
  to a crossed mic with "Nobody can hear you". While downed, desaturate the screen and lower the camera (exists).
  While dead, a thin top bar "Spectating ● Bo · respawn in 24 s".
- **Wireframe:**
  ```
  DOWNED   [centre-bottom] KNOCKED DOWN   dying in 18 s  (paused while being raised by Ana)
                           Hold G: give up      mic chip: ✕ Nobody can hear you
  DEAD     [top]           Spectating ● Bo        Respawn in 24 s
           [bottom-right]  Bo's hands: ● Red package / Knife   [bottom] LMB/RMB: switch player
                           note: The dead hear only the world around Bo.
  RESPAWN  [centre, 3 s]   You're back!  shield icon 3..1
  ```
- **States:** nobody to watch; target leaves; target dies; respawn while the menu is open.
- **Priority:** MVP (the words and mic chip state); visual treatment later.

## 8. Esc menu (exists, #169): review

What it does well: one Esc opens and frees the cursor; tabs left, content right; the Lobby tab only in the lobby
and countdown; settings read-only for clients; the host is warned that leaving ends the session for all.
What to change:

1. **Add Settings** (section 10) and a **Players** tab: per-player volume slider and mute, the single most useful
   control in a proximity-voice game.
2. **Say the game does not pause:** a line under Resume, "The game keeps running".
3. **Leave vs Quit:** label them by result: "Leave to main menu" and "Quit to desktop".
4. **Host join info** in the Lobby tab, with a Copy button (`DisplayServer.clipboard_set`, confirmed in the API
   dump).
5. Keep the menu small enough to see the world behind it (the 460 x 440 page is fine).
- **Wireframe:**
  ```
  [left tabs]  Resume · Lobby (lobby only) · Players · Settings · Leave · Quit
  [right page] Resume: "The game keeps running. Esc to return."
               Players: ● Ana  [vol ───●──] [mute]   ● Bo ...
  ```
- **Priority:** MVP for Players and Settings: Audio/Voice; the rest later.

## 9. End screen

- **Job:** close the round with a clear, shareable moment and send everyone back.
- **Must show:** the winning side (today: "The <side> won" on black), host's Back to lobby; clients: "Waiting for
  the host".
- **References:** Fall Guys colours its "Qualified!" and "Eliminated!" cards differently (blue/pink swapped)
  ([Fall Guys wiki](https://fallguysultimateknockout.fandom.com/wiki/Round_Over_Screen), unconfirmed).
- **Anti-patterns:** a client button that does nothing (only the host returns everyone).
- **Recommendation:** the side's colour and emblem, plus "You won" or "You lost" for the viewer (own role is own
  knowledge), plus a one-line public reason ("All packages delivered" / "Time ran out" / "Every engineer left")
  if the end reason is in the model. Whether to reveal everyone's role at the end is the designer's call.
- **Wireframe:** `[centre] THE ENGINEERS WON · You won! · All packages delivered   [host] Back to lobby / [client] Waiting for the host...`
- **Priority:** MVP (personal line, host vs client button); reveal later, if the designer wants it.

## 10. Settings

- **Job:** make voice work, then comfort.
- **Contents (priority order):**
  1. **Voice and audio (MVP):** input device and output device (`AudioServer.input_device`, `output_device`,
     `get_input_device_list()`, `get_output_device_list()`, all confirmed in the 4.7.2 API dump and the
     [Godot 4.7 docs](https://docs.godotengine.org/en/4.7/classes/class_audioserver.html), which note input needs
     `audio/driver/enable_input`); mode: voice activation / push-to-talk / toggle, with its key (Phasmophobia offers
     all three and a voice test button,
     [Gamertweak](https://gamertweak.com/how-set-up-mic-phasmophobia/), unconfirmed); input threshold; a mic test
     with a live level bar (`AudioEffectSpectrumAnalyzerInstance.get_magnitude_for_frequency_range` or
     `AudioEffectCapture.get_buffer`, both confirmed in the dump) and optional loopback; volumes: master, voices,
     world, music, UI; "use headphones" advice (the voice ADR notes loudspeakers need echo cancellation).
  2. **Controls (MVP-lite):** mouse sensitivity, invert Y, hold-or-toggle for Tab; key rebinding later
     (`InputMap.action_erase_events` / `action_add_event`, confirmed).
  3. **Graphics (later):** window mode, resolution scale, vsync, FOV, frame cap.
  4. **Accessibility (MVP-lite, lens 6 owns it):** text size, colour names on packages and circles, reduced motion.
  5. **Language:** UK / EN (`TranslationServer.set_locale`, confirmed).
- Persist in `user://` with `ConfigFile` (`save`/`load` confirmed). XAG 119 asks for speech-to-text and
  text-to-speech in voice chat ([XAG 119](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/119),
  unconfirmed: search snippet); far beyond MVP, note it only.

## 11. Error and edge states

Map each `EndReasons` id to a player sentence, an action button, and the developer text to the log:

| Id | Player words (draft, the humans own the final text) | Action |
|---|---|---|
| `wrong_version` | "You and the host have different game versions (you 0.4.0, host 0.3.9)." | Back |
| `wrong_content` | same as above, "different game files" | Back |
| `full` | "The lobby is full (10/10)." | Back |
| `joins_closed` | "They're mid-match. Try again when they're back in the lobby." | Retry |
| `connect_failed` | "No answer from <address>. Check the address, the port, and that the host is running." | Retry / Back |
| `host_lost` | "The host left or the connection dropped." | Main menu |
| `load_deadline` | "Loading took too long; the match started without you." | Main menu |

Show them on the main menu banner (exists: `reason_label`), never as a modal that blocks the next try. Showing both
versions needs the client to know the host's version from the refusal; today `Rejected` carries only `seq` and
`reason` (`net/messages/wire_schema.gd` line 303), so the client can show its own version only, unless the engineer
adds the host's version to the row (a wire change, the engineer's call). A player leaving mid-round becomes a toast (below).

## 12. Toasts and notifications

- **Recommendation:** one toast stack under the clock, at most 3 visible, 4 s each, public events only: player
  joined or left, the host changed a setting (lobby), "Ana raised you", "Red delivered" (if delivery is public).
  No toast may say anything a player could not see in the world or on the shared progress. Whether a death or a
  knockdown is announced globally is a design question for the designer.
- **Anti-pattern:** a corner where toasts collide with another widget (R.E.P.O. had to move its death-head UI away
  from messages, see section 7).
- **Priority:** MVP (join/leave, host left), the rest later.

## 13. First-time teaching

- **Evidence:** push tutorials are intrusive and quickly forgotten; contextual help is easy to dismiss and to find
  again ([NN/G, Laubheimer, 2023](https://www.nngroup.com/articles/onboarding-tutorials/)).
- **Recommendation for us (no tutorial level):** (a) the lobby is the tutorial: a practice package and circle in
  the lobby level (designer), the same controls as the round; (b) contextual prompts near the crosshair the first
  times an action is possible ("[E] Pick up", "[X] Swap hands"), fading after the player has done it a few times,
  stored per machine; (c) the role screen's goal line; (d) the Tab screen as the reference with a controls footer;
  (e) loading tips from content data; (f) the downed and dead explanations of voice (section 7).
- **Priority:** MVP for (b) to (f); (a) when the designer builds the lobby.

## 14. Screen inventory

| # | Screen | Exists in client/ui | Biggest change | Priority |
|---|---|---|---|---|
| 1 | Main menu + first launch | yes (no name, no version) | name, version, mic check, player-word banner | MVP |
| 2 | Connecting | yes | elapsed time, slow hint | MVP |
| 3 | Loading | yes | per-player ticks, tip | MVP |
| 4 | Lobby HUD | yes | roster chip with colours, host join info, countdown | MVP |
| 5 | Lobby tab + colour picker | tab yes, picker no | 10 named swatches | MVP |
| 6 | Role screen (#175) | no | banner then chip | MVP |
| 7 | Round HUD | yes (text labels) | zones, prompt, mic chip, destination name | MVP |
| 8 | Tab task screen | yes | role line, colour grid, controls | MVP |
| 9 | Downed / dead / spectate / respawn | yes (life panel) | voice wording, big numbers | MVP |
| 10 | Esc menu (#169) | yes | Players and Settings tabs, "keeps running" | MVP |
| 11 | Settings: voice and audio | no | devices, mode, mic test, volumes | MVP |
| 12 | Settings: controls, graphics, a11y, language | no | sensitivity, Tab toggle, text size | later (a11y part MVP) |
| 13 | End screen | yes | You won/lost, reason line, client waiting | MVP |
| 14 | Errors | words only | player sentences + actions | MVP |
| 15 | Toasts | no | one stack, public events | MVP-lite |
| 16 | Debug overlay | yes | out of the UI track (debug only) | none |

## Sources

- Repo (read live): `client/ui/*.gd`, `client/life/life_hud.gd`, `client/app/end_reasons.gd`, `project.godot`,
  `docs/decisions/2026-10-01-vision-revision-1.md`, issues #169 and #175 (`gh issue view`).
- Godot 4.7.2 API dump `tools/out/godot-api/4.7.2/extension_api.json` (AudioServer, InputMap, ConfigFile,
  TranslationServer, AudioEffectCapture, AudioEffectSpectrumAnalyzerInstance, DisplayServer.clipboard_get, Control
  accessibility_name: all present).
- https://docs.godotengine.org/en/4.7/classes/class_audioserver.html
- https://miragecreativelab.com/lockdown-protocol/
- https://store.steampowered.com/app/2780980/LOCKDOWN_Protocol/
- https://en.wikipedia.org/wiki/Among_Us
- https://en.wikipedia.org/wiki/Lethal_Company
- https://en.wikipedia.org/wiki/R.E.P.O.
- https://www.nngroup.com/articles/onboarding-tutorials/
- https://gameaccessibilityguidelines.com/provide-a-visual-indication-of-who-is-currently-speaking/
- https://partner.steamgames.com/doc/features/multiplayer/matchmaking
- https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/119 (snippet only)
- https://www.gameuidatabase.com/index.php?scrn=43 and ?scrn=181 (fetch refused; links only)
- https://among-us.fandom.com/wiki/Colors , https://among-us.fandom.com/wiki/Red (unconfirmed)
- https://www.gamepur.com/guides/among-us-june-2022-patch-notes-colorblind-settings-bugfixes-and-more (unconfirmed)
- https://projectwinter.fandom.com/wiki/Player_Roles (unconfirmed)
- https://www.exitlag.com/blog/goose-goose-duck-tips-and-tricks-for-winning/ (unconfirmed)
- https://fallguysultimateknockout.fandom.com/wiki/Round_Over_Screen (unconfirmed)
- https://www.fallguys.com/en-US/news/fall-guys-creative-construction-release-notes (snippet, unconfirmed)
- https://www.gameleap.com/articles/content-warning-how-to-host-and-invite-friends (unconfirmed)
- https://support.jackboxgames.com/hc/en-us/articles/15794759479959-How-do-I-join-a-game (snippet, unconfirmed)
- https://wp-support.partyanimals.com/2023/08/22/custom-game-faq/ (snippet, unconfirmed)
- https://thunderstore.io/c/lethal-company/p/5Bit/VoiceHUD/ and
  https://thunderstore.io/c/lethal-company/p/ficcialfaint/Spectator_Voice_Icon_Fix/ (unconfirmed)
- https://steamcommunity.com/app/1966720/discussions/0/5513030717662354322/ (forum, unconfirmed)
- https://www.thegamer.com/repo-death-head-possession-explained-guide/ (unconfirmed)
- https://steamcommunity.com/app/3241660/allnews/?l=english (snippet, unconfirmed)
- https://www.repo-game.org/en/repogame-voice-chat (fan site, unconfirmed)
- https://gamertweak.com/how-set-up-mic-phasmophobia/ (unconfirmed)
- https://www.wayline.io/blog/tutorial-ux-indie-game-onboarding (blog, unconfirmed)
