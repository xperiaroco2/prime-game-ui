# UI decisions so far

The engineer's decisions for the game's UI, 2026-10-02 and 2026-10-03, with where each was recorded (comments on
[prime-game #150](https://github.com/xperiaroco2/prime-game/issues/150), the game issues). The engineer answered as the
designer too. The wireframes that show them: the `pages/wireframes/` page. A newer decision replaces an older one; record
a change here in the same PR as the page change. A decision marked "(agent)" was taken by the agent alone under the
trust rules in `CLAUDE.md` (small and easy to change); the engineer can veto it at any time.

## Principles
- **The UI never tells the player what to do.** No "take it to X" line, no destination marker, no key prompts on the HUD;
  the player reads the world (labels and room signs) and the map. Learning is separate from playing.
  ([no hints](https://github.com/xperiaroco2/prime-game/issues/150#issuecomment-5960844470))
- **Less text on screen**: what can be learned once is taught by the tutorial, not repeated on every screen.
  ([less text](https://github.com/xperiaroco2/prime-game/issues/150#issuecomment-5968715316))
- **English and Ukrainian from the start**, a language choice on the first launch and in the settings, every player in
  their own language ([prime-game #208](https://github.com/xperiaroco2/prime-game/issues/208)).
- **Simple, but not ugly**; references liked: A Short Hike, LOCKDOWN Protocol's HUD layout (more readable), PEAK,
  Overcooked's cards. ([references](https://github.com/xperiaroco2/prime-game/issues/150#issuecomment-5955158412))

## Learning
- **Tutorial:** a separate room, skippable, on the first launch; it teaches the basics (moving, hand and belt, raising
  and giving up, voice, death and spectating, menus) and how to find out about any task: open the map (M), press "?".
- **How-to cards** per task type: 3 to 4 drawn panels with a few words, calm like an airline safety card with one funny
  panel where it fits; not videos. Opened by "?" on the map screen; shown once on the loading screen for a task type not
  done yet (at most twice); all of them in a Guide tab of the Esc menu. Cards for tasks first. No practice stations in the
  lobby. ([prime-game #254](https://github.com/xperiaroco2/prime-game/issues/254),
  [answers](https://github.com/xperiaroco2/prime-game/issues/150#issuecomment-5968611538))
- **Loading-screen tips** are funny.
- **A "with hints" host setting** (markers through walls, highlights) is dropped for now: a future idea, only if real
  maps prove too hard.

## Screens
- **Main menu:** A Short Hike's few words; host, join by address (LAN for now), tutorial, settings, quit. No server
  browser.
- **Connecting:** "Connecting to <lobby name>…"; the host names the lobby
  ([prime-game #214](https://github.com/xperiaroco2/prime-game/issues/214)).
- **Lobby:** in the world (already built); ready state and players; the mic as an icon.
- **Esc menu** over the running game (no pause): Game, Role (own role, goal, a scrolling teammate list for dissidents:
  a proposal), Guide, Lobby (one settings view for everyone, the host edits, presets as cards; easy and complex tasks with
  a subtask count, [#256](https://github.com/xperiaroco2/prime-game/issues/256)), Character (changes only in the lobby),
  Settings (with Language).
- **Pre game** (role reveal) and **post game** (round end): black intro and outro of about 3 s each, nobody hears
  anybody and no text says so, one sound per role in pre game, one sound for win and loss; post game returns everyone to
  the lobby after 3 s; roles are not revealed at the end
  ([#213](https://github.com/xperiaroco2/prime-game/issues/213), [#212](https://github.com/xperiaroco2/prime-game/issues/212),
  [#175](https://github.com/xperiaroco2/prime-game/issues/175)). Goals are generic: Engineers complete the tasks,
  Dissidents get in their way.
- **Round HUD:** only the time at the top (task progress lives on the map screen); health and stamina always (stamina in the toy yellow; health green when full and turning red as it runs low, the colour computed from the fraction; both on a dark outlined track; the bar length is the real cue for colour-blind players); the mic as
  an icon, crossed out when nobody hears you; a hand slot and a belt slot, the hand slot widening into a rectangle while
  carrying with both hands; a small role chip; the object's name under the crosshair; no walk/run indicator, no player
  list, never who knocked you down.
- **Name plates** in line of sight within about 10 m; a dissident sees a mark next to a teammate's name, nobody else
  does ([#257](https://github.com/xperiaroco2/prime-game/issues/257)).
- **Map and tasks on M**, press to open and close, walking allowed: task counters without descriptions, "?" and NEW per
  task, a map with "you are here" and room names, hovering a task lights up zones; no circles, players, items, role or
  teammates. Tab is kept for an inventory later ([#253](https://github.com/xperiaroco2/prime-game/issues/253),
  [#258](https://github.com/xperiaroco2/prime-game/issues/258)).
- **Downed:** "Hold F to give up" (F instead of G; every key rebindable,
  [#211](https://github.com/xperiaroco2/prime-game/issues/211)). **Spectating:** only "Watching: <name>" and the time to
  respawn.

## Delivery (the designer's answers)
Packages have no colours, start in the storage room and carry their destination room's pictogram (no word); the same
sign marks the room on the map, the door and the spot, its look waiting for the style; no destination marker
([#255](https://github.com/xperiaroco2/prime-game/issues/255),
[answers](https://github.com/xperiaroco2/prime-game/issues/150#issuecomment-5968656240)). Wave 1's package-colour and
colour-blindness work therefore applies to body colours only.

Room signs, decided by the agent from the "UI never tells" principle (agent): hovering the Delivery task on the map
lights only the storage room, never the rooms still waiting for a package; the HUD hand slot does not repeat the carried
package's sign; there are no direction signs at corridor junctions (signs mark rooms, not routes). The room list of the
room-signs page (the storage room and the hall take no deliveries) is a proposal for the designer's map
([prime-game #306](https://github.com/xperiaroco2/prime-game/issues/306), #146). The sign system itself waits for the
engineer ([prime-game-ui#6](https://github.com/xperiaroco2/prime-game-ui/issues/6)).

## Style
The engineer chose **Toy** (2026-10-03): chunky rounded shapes with a thick plum outline, cream panels, sunny-yellow buttons with a solid toy base that look pressable, and a small, calm HUD; it reads as arcade and game-like. **No tilted plates** (they break the design). **Press feedback** on the voluminous buttons: the button sinks onto its base when pressed (a pressed StyleBox and a short Tween in Godot; previewed in `pages/styles/motion-preview.css`). Safety card was liked but reads too much like an office; Quiet retro was not chosen. The 10 character colours proposed by the retro skin are not adopted. ([prime-game-ui#2](https://github.com/xperiaroco2/prime-game-ui/issues/2))

**Toy look details** (the engineer, 2026-10-03, on the [look-choices page](https://claude.ai/artifact/2gRChgdYcCBNUCbggt3z2S);
[prime-game-ui#5](https://github.com/xperiaroco2/prime-game-ui/issues/5)): a disabled control is "unplugged" (no base,
pale lilac face, muted outline and label); keyboard and gamepad focus thickens the outline inward from 3 to 6 px (ink;
cream on ghost buttons on dark), chips, the stepper and radios get a 3 px ring 2 px outside; hover and held on flat
controls (ghost buttons, line chips, idle tabs) is a quiet fill, night plate on dark and lavender on light (the
dropdown follows the same rule: (agent));
a coral danger button for the host's «Покинути сесію» and its confirm dialog; large text ×1.25 for 18 to 36 px (48 px
and up unchanged); the selected preset card keeps the idle card's size; held buttons sink 4 px (white) or 5 px
(yellow), leaving 1 px of base; the menu backdrop `.dim` is 74 % instead of 70 %, so dim lilac text over a white wall
reaches 4.5:1; wide keycaps (Space, Shift, Tab, Esc) are at least 96 px; the near-identical plums and lilacs stay
separate (28 colours). Decided by the agent, small and easy to change (agent): a held stepper turns honey, preset
cards lift 1 px on hover, a read-only field (the guest's view) is a quiet pale-lilac box with readable text, and the
field's placeholder is muted plum with an ink caret and a yellow selection.

## Type
Comfortaa for titles and text, provisionally, until the style is chosen (SIL OFL 1.1 with the Reserved Font Name
"Comfortaa": ship it unmodified) ([font pick](https://github.com/xperiaroco2/prime-game/issues/150#issuecomment-5960452846)).
