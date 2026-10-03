# Synthesis: separating learning from playing

prime-game UX/UI brainstorm, 2026-10-02. Inputs: `refs.md` (Lens A, how other games teach per-task mechanics),
`tasks.md` (Lens B, self-explaining tasks and balance), `cards.md` (Lens C, comic how-to cards). "(unconfirmed)"
follows the lenses: the claim rests on a search snippet, a fan wiki, a forum or memory. Recommendations are for this
game: 4 to 10 players, first person, proximity voice, open knowledge, macro over micro, cringe-fun, EN and UK.

The engineer's acceptance test, used throughout: **a newcomer can work out any task quickly, and a player who has
played ten times sees none of the teaching.**

## TL;DR

1. **Three places, three jobs.** The tutorial room teaches the verbs (decided). The world teaches each task: the
   item's 3D label, the same room symbol on map, door and spot, shape-matched sockets, lamps, loud success and
   readable failure. A comic how-to card is the reference for every task type.
2. **Push only before the round, pull during it.** The Loading screen shows, once per player, the card of a task
   type this player has not completed yet. In the round a card opens only from the task screen (a small "?").
   Nothing goes on the HUD.
3. **Cards, not videos.** A strip of 3 to 4 panels, all visible at once, one verb and one object per panel, the same
   little figure, and a 1 to 4 word caption stored as a translated string. Optional "watch out" panel in a hatched
   frame. A task that needs more than 4 action panels gets simplified, not a longer card.
4. **A card teaches the method, never this round's answer** ("check the label, find it on the map", never "take it
   to Storage B"). That keeps the decision that the UI never tells the player what to do.
5. **Tab:** a tap opens the task screen and leaves it open with a free cursor; a hold is a peek that closes on
   release; M opens the same screen on the map. Cards and hover zones need the cursor.
6. **"With hints / without"** is a host setting for in-round explaining help only (hover zones, first-time nudges).
   Cards stay reachable for everyone; the Loading auto-show is personal; help that changes the rules (longer timer,
   fewer items) is a separate lobby setting.
7. **Tasks stay readable by construction:** a verb budget, chains of labelled deliveries, at most 3 hops, effort from
   macro levers only, and a 12-question checklist with a silent playtest before a task ships.

## Where the lenses agree, and how the disagreements are resolved

All three lenses agree on: no videos; help pulled from the task list; per-player retirement of teaching; the tutorial
room for basics only; static pictures with short captions; panel count as a complexity cap.

| Disagreement | Lens positions | Resolution and reason |
|---|---|---|
| Panels per card | A: 3 to 4. B: at most 4, wordless. C: 3 to 5 including an optional warning panel | **3 to 4 action panels plus an optional "watch out" panel.** Captions are required: pictograms alone are misread (the FAA safety-card study found 65% mean comprehension, [ROSAP](https://rosap.ntl.bts.gov/view/dot/58470)) |
| Does Delivery need a card? | A, B: maybe not, it is simple. C: yes | **Yes, every task type has one.** A card is data the engine composes, so it costs the designer 15 to 30 minutes; Delivery's card also teaches the label, map, spot grammar that every later chain reuses |
| When a card stops auto-showing | A, B: after the player completes the task type. C: after it was seen once | **After the first completion, and at most twice.** Seen is not understood (a card skipped in two seconds teaches nothing); the cap stops nagging a player who never takes that task |
| What "without hints" switches off | A: Loading cards and hover zones. B: all explaining help. C: round hints only | **Round hints only** (hover zones, nudges, failure pictogram, learner badge). One new friend among veterans still gets the Loading card, because that is personal and happens before the round |

## Question 1. Where does learning live, and where does playing live?

| Option | Pros | Cons |
|---|---|---|
| A. One tutorial that covers the basics and every task | One place for everything | Long; up-front tutorials are skipped, forgotten and do not improve task performance ([NN/g](https://www.nngroup.com/articles/onboarding-tutorials/)); cannot scale to 10 or more tasks |
| B. Tutorial room for the basics only; tasks are learned by trying and from friends | Zero UI | Multi-step tasks become hidden recipes. LOCKDOWN Protocol has per-task explanations in its tablet ([Mirage Creative Lab](https://miragecreativelab.com/lockdown-protocol/)) and its community still made task tutorials ([video example](https://www.youtube.com/watch?v=vRvoqHCTO_A); the inference that in-game help was not enough is unconfirmed) |
| C. Layers by moment: first launch (tutorial room, verbs), lobby (practice stations, a "How to play" board), Loading (personal card for an untried task type), round (the world explains; cards only on pull), dead or spectating (browse cards) | Each layer serves a different player; a veteran meets only a "?" glyph on a screen he opens anyway | More parts to build; a newcomer must notice the "?" |

**Recommendation: C.** Help at the moment of need works where up-front teaching does not
([NN/g](https://www.nngroup.com/articles/onboarding-tutorials/)), and a 45,000-player A/B study found tutorials paid
off only in the most complex of three games ([Andersen et al., CHI 2012](https://grail.cs.washington.edu/projects/game-abtesting/chi2012/chi2012.pdf),
unconfirmed: read from the abstract). Teaching therefore goes to the moments when a player waits anyway (lobby,
Loading, death), and the round itself carries only what the world shows. The decided tutorial room stays exactly as
decided: verbs only, taught by situations, never tasks.

## Question 2. How does a player learn a task he has never seen?

| Option | Pros | Cons |
|---|---|---|
| A. Reference help inside the round (LOCKDOWN's tablet with a how-to per task; videos per the engineer's experience and a forum post, [Steam](https://steamcommunity.com/app/2780980/discussions/0/4635988779091438487/), unconfirmed) | Complete; veterans never open it | A minute of video mid-round costs the round; video is transient and gets scrubbed (the engineer's own experience) |
| B. The world explains itself, plus per-player first-time nudges | Nothing on screen; language-free; scales to many tasks | Needs a disciplined art and level convention; nudges must be checked against "no markers" |
| C. Learn before the round: practice stations of each task type in the lobby and a "How to play" board where veterans explain by voice | Learning by doing and by friends, in time players spend waiting; no round UI | Level pieces to build; not everyone walks to them |

What B means concretely (Lens B):
- **One symbol, four hops.** Each room has one pictogram and one colour, repeated on the item's 3D label, on the map,
  on the door sign and on the exact spot. A player matches picture to picture; no hop says "go there".
- **Shape matching and state on the object.** A socket accepts only its own silhouette; a station shows progress with
  lamps or a gauge (the Dead Space principle of information in the world, [Game Developer](https://www.gamedeveloper.com/design/video-designing-i-dead-space-i-s-immersive-user-interface), unconfirmed).
- **Loud success, readable failure.** Thunk, green lamp, a cringe-fun fanfare heard nearby through proximity voice;
  a wrong item bounces out with a buzzer, costing time, never progress.
- **First-time nudges, local and fading.** Until a player has completed a task type twice, its items glint and its
  socket chimes when he looks at them; after two wrong tries at one socket, its pictogram lights for him only (the
  Super Guide idea, [Wikipedia](https://en.wikipedia.org/wiki/New_Super_Mario_Bros._Wii), unconfirmed). A nudge never
  points anywhere: it reacts only to what the player already looks at.

Among Us is the counter-example: arrows to the next stage of a task and outlines near a task
([Among Us wiki](https://among-us.fandom.com/wiki/Tasks), unconfirmed). That is the "UI tells you what to do" layer
this game decided against.

**Recommendation: B as the base, C as a cheap complement, and the card (Question 3) as the pull reference.** B costs
the veteran nothing and teaches the newcomer without words; C uses waiting time and turns proximity voice into
teaching (Among Us has a Practice mode, [Innersloth guide](https://innersloth.zendesk.com/hc/en-us/articles/7794240573460-Beginner-s-Guide-to-Among-Us);
Mario Party lets players practise from the rules screen, [Twinfinite](https://twinfinite.net/guides/mario-party-superstars-minigames-how-practice/), unconfirmed).
A is rejected as a format; its place (help next to the task list) is kept.

## Question 3. The comic how-to cards

| Option | Pros | Cons |
|---|---|---|
| A. A how-to video per task (LOCKDOWN) | Shows motion and the exact interaction | Linear and slow; in 8 comparisons narrated animation never beat static annotated pictures (4 wins for pictures, 4 ties; [Mayer et al. 2005](https://pubmed.ncbi.nlm.nih.gov/16393035/)) |
| B. A slideshow: one picture at a time with "Next" | Big pictures | Clicking; the whole procedure is never visible at a glance; a player cannot jump to step 3 |
| C. A comic strip: 3 to 4 panels visible at once, one verb and object each, the same figure, a 1 to 4 word caption; optional hatched "watch out" panel | Read in about 5 seconds; glance at one panel; cheap to translate; the game's own recognisable look | Needs art; captions and a novice test are mandatory |

**Recommendation: C.** Static pictures with short text match or beat narrated animation for "how it works"
([Mayer et al. 2005](https://pubmed.ncbi.nlm.nih.gov/16393035/)), and learner-paced segments beat continuous video
for procedures ([Arguel and Jamet 2009](https://www.sciencedirect.com/science/article/abs/pii/S0747563208002252),
unconfirmed: abstract snippet). No lens found a party game with drawn comic how-to cards per task (unconfirmed
absence), so the format may also be the uniqueness the engineer hoped for.

Card rules (from Lens C, trimmed to the 4-panel cap):
1. One verb per panel from a closed list (about 13: FIND, GO, TAKE, CHECK, CARRY, PUT, TURN ON, TURN OFF, HOLD, GIVE,
   WAIT, WATCH, REPEAT). A new verb is a new figure pose, a small art request, which keeps the list short.
2. The same deadpan figure and viewpoint in every panel; no "walking" panels (readers fill the gap between panels,
   McCloud via [EBSCO](https://www.ebsco.com/research-starters/literature-and-writing/understanding-comics-invisible-art-scott-mccloud), unconfirmed).
3. The last action panel shows "done when" as the counter going up, so the player learns where progress shows.
4. Teach the method, never this round's answer: no room names, no colours of this round.
5. Captions are translation keys, never text drawn into the image (Godot 4.7 `tr()`, CSV or PO, pseudolocalization:
   [docs](https://docs.godotengine.org/en/4.7/tutorials/i18n/internationalizing_games.html)). Ukrainian runs longer
   than English, so captions may wrap to two lines.
6. The "watch out" panel uses a hatched frame and a triangle, not colour alone
   ([Game Accessibility Guidelines](https://gameaccessibilityguidelines.com/full-list/)).
7. The hallway test: two of three people who have never played must say what to do from the card alone.

When a card appears:
- **Loading, automatically,** for each task type in the match that this player has not completed yet, at most twice
  per task type. It never blocks: when the round starts the card closes and the task row keeps a "NEW" dot until the
  card is opened. A card version bump shows it once more, marked "CHANGED".
- **On demand:** a "?" at the end of each task row on the task screen; the lobby "How to play" board; while dead or
  spectating. Never on the HUD.
- **Personal settings:** "Show how-to cards automatically" (default on) and "Reset seen cards" for a shared PC.

How it scales (a sketch; the engineer decides the shape): a card is client-only presentation data, never in `core/`.
A `HowToCard` resource holds `HowToStep`s (verb, object pictogram, count such as xN or xALL or bound to a task
setting, optional caption key, optional hand-drawn art override). Each task type's data in `content/` names its card,
so the designer writes steps without an engine change. The engine composes each panel from a pictogram set, so a new
task type has a readable card the day it lands. A content test checks that every task type has a card of 3 to 4
steps, every verb is in the list and every caption key exists in EN and UK.

Art in two tiers: Tier 1 now, an agent-made SVG pictogram set on one grid (Aicher-style consistency,
[Wikipedia](https://en.wikipedia.org/wiki/Otl_Aicher), unconfirmed) with a style sheet in `docs/design/`; Tier 2
later, hand-drawn funny panels swapped in one at a time through the art override. Who draws Tier 2 is a human
decision (see the designer list). Rough cost: one medium engine issue, one small-to-medium art issue (about 30
pictograms), 15 to 30 minutes of designer time per task type, one lobby level piece; zero money unless an artist is
commissioned.

## Question 4. Tab held, Tab toggled, or M?

| Option | Pros | Cons |
|---|---|---|
| A. Hold Tab only (today's decision) | A quick peek that closes itself; no mode to forget | No free cursor, so no hovering a task to light its zones and no "?" to click; reading a card while holding a key is awkward, and releasing it closes the card mid-read |
| B. Tab toggles the screen (cursor free), M opens the map | Simple; cards and hover work | A veteran needs two presses for a glance at the counters; a forgotten open screen |
| C. Tap Tab: the screen opens and stays open with a free cursor (WASD still walks, the camera stops). Hold Tab: a peek with counters and map, no cursor, closes on release. M: the same toggled screen with the map focused | One key serves both kinds of player; a card is always read on a stable screen | The tap threshold (about 0.2 s) needs tuning in a playtest; a slow tap may read as a hold |

**Recommendation: C, with B as the fallback** if playtesters confuse tap and hold. The reason is mechanical: the
decided hover zones and the card's "?" need a cursor, and a glance at counters does not. Tap-versus-hold on one key
is a common pattern, but its use in comparable games is unconfirmed (Lens C).

## Question 5. The session setting "with hints / without"

| Option | Pros | Cons |
|---|---|---|
| A. One host switch that removes all help, cards included | Simple hardcore mode | The one new friend in a group of veterans gets nothing; hiding the rules contradicts open knowledge |
| B. The host switch governs in-round explaining help only (hover zones, first-time nudges, the failure pictogram, a learner badge). Cards stay reachable for all; the Loading auto-show is a personal setting; rule help (longer timer, fewer items) is a separate lobby setting shown to all | Fair for the group, kind to the newcomer; each setting has one meaning | Three kinds of setting to explain in the menus |
| C. Only personal settings | Each player chooses | Hover zones give an in-round advantage, so a group must be able to agree on "no help" together |

**Recommendation: B.** What affects fairness inside the round is the host's call; what only teaches the rules stays
personal. Jackbox moved to a group skip after its players asked to skip tutorials
([Jackbox](https://jackboxgames.com/responding-to-your-questions-from-the-jackbox-customer-survey)), and Moving Out 2
offers rule-changing assists for the whole group with no penalty ([Can I Play That](https://caniplaythat.com/2023/06/05/moving-out-2-accessibility-and-assist-modes-detailed/)).
Wording follows the Celeste lesson: never "easy", never shaming ([Vice](https://www.vice.com/en/article/celeste-assist-mode-change-and-accessibility/)).
A visible, funny "learner" badge while hints are on (the Mario Kart smart-steering antenna idea,
[win.gg](https://win.gg/news/should-you-use-smart-steering-in-mario-kart-8-deluxe/), unconfirmed) is an option for the
designer, opt-in at first.

## Question 6. Tasks that are neither too easy nor too hard

| Option | Pros | Cons |
|---|---|---|
| A. Only simple one-place tasks (Among Us style) | Nothing to teach | Boring after a few rounds; no route or team decisions, so it fails "macro over micro" |
| B. LOCKDOWN-style recipes: 4 or more steps across machines and rooms ([Steam task guide](https://steamcommunity.com/sharedfiles/filedetails/?id=3305518998), unconfirmed) | Depth | Needs reference help; a reviewer says the first matches are spent learning ([Backloggd](https://backloggd.com/u/spyrospy/review/4020631/), unconfirmed) |
| C. Chains of labelled deliveries: each intermediate item carries the label of its next stop; at most 3 hops; the tutorial's verbs plus at most one new verb that the object itself shows; effort from route, search, carry limits, teamwork and dissidents | Depth without hidden recipes; anyone handed an item mid-chain knows its next step | Needs a level convention and a checklist on every task |

**Recommendation: C.** Starting values to tune in a playtest: first progress within about 20 to 30 seconds for an
unhindered player, one hop under a minute, at most 3 hops. Order item spawns by kishotenketsu: the first item in the
easiest zone, later ones harder, the dissidents as the twist, the last item under time pressure
([Game Developer, Hayashida](https://www.gamedeveloper.com/design/the-secret-to-i-mario-i-level-design)). Let players
choose their own challenge by keeping several tasks and items open at once (flow,
[Chen's thesis](https://www.jenovachen.com/flowingames/Flow_in_games_final.pdf), unconfirmed). Every new task runs the
12-question "readable without the UI?" checklist in `tasks.md` §8, ending with the silent playtest: a newcomer
finishes the first hop within 60 seconds unaided in 3 of 4 tries, and a ten-match veteran sees nothing extra. A task
that needs more than 4 action panels on its card fails the checklist.

## Risks

- **Pictograms get misread.** Mitigation: captions on every panel and the hallway test (FAA mean comprehension 65%,
  [ROSAP](https://rosap.ntl.bts.gov/view/dot/58470)).
- **Loading may be too short on a LAN to read a card.** Mitigation: the "NEW" dot, the lobby board and the "?".
- **Nudges, "task paint" on sockets and permanent room pictograms on the map may be read as markers.** They mark
  fixed places for everyone, not a destination for one player; the humans must confirm this reading.
- **Art.** The hard rules let humans hand-make only scene layout and imported third-party assets; hand-drawn Tier 2
  panels need the humans' decision on who draws them. Tier 1 SVG is agent-authored; that Godot 4.7 imports SVG as
  textures as expected is unconfirmed until `check` runs on a sample.
- **Tap versus hold confusion** on Tab; fallback B.
- **The learner badge may embarrass** part of the audience; opt-in first.
- **Mixed UI languages in one match:** a 3D label could render each client's own language locally or carry the
  pictogram only; undecided.
- **Scope creep.** Cards, nudges, practice stations and the board are several issues. Suggested order: (1) the world
  grammar and checklist (designer), (2) the card engine and Tier 1 art, (3) Tab tap and hold, (4) lobby board and
  practice stations, (5) nudges and the hints setting.
- **Evidence quality.** Several game details rest on fan wikis, forums or snippets (LOCKDOWN's in-tablet videos,
  Overcooked's recipe card format, TF2 intro retirement, Fall Guys intros, the Goose Goose Duck Help button, the
  Andersen paper read from its abstract). Verify hands-on before an ADR cites them. The "no other party game does
  comic cards" claim is an unconfirmed absence.

## What the designer must decide

1. Adopt "the task list says what, the world says how" and the one-symbol chain (one pictogram and colour per room on
   the item label, the map, the door and the spot) as a level convention.
2. Add a verb budget to the `new-mechanic` interview: the tutorial's verbs plus at most one new verb the object shows.
3. Make the 3-hop limit, the 12-question checklist and the silent playtest part of a task's definition.
4. The card style: the figure, the tone (deadpan safety-card parody, a funny failure panel), the final EN and UK
   captions. The page's example captions are drafts.
5. Who draws Tier 2 panels: the designer by hand, a friend, a commissioned artist (money, so ask first), or CC0 / CC BY
   sets with credit entries. A joint human decision, since it touches the hard rules.
6. Delivery, panel 1: are packages scattered (FIND) or collected from a storage room (GO)? The GDD says scattered.
7. The switches idea: is it done when all switches are on at once, or on for N seconds?
8. Whether "task paint" on sockets and permanent room pictograms on the map are acceptable under "no markers".
9. The learner badge: yes, no, or opt-in.
10. Rule help (longer timer, fewer items): needed, or does the existing timer setting cover it?
11. The lobby "How to play" board and practice stations: which milestone.
12. Spawn order per task (easiest zone first) as content data.
13. Whether role cards and item cards reuse the card system from the start.

## What the engineer must decide

1. Tab: C (tap, hold, M) or the simpler B.
2. Card retirement: after the first completion (at most two showings), or after the first viewing.
3. Whether a card may show a key glyph (for the map), given "no key prompts on screen".
4. Whether "without hints" also suppresses the Loading auto-show for everyone, or only round hints.
5. Whether nudges and the failure pictogram count as markers.
6. The data model and where cards live (client presentation, `content/` data), and the order of the issues.
