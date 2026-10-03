# Lens A: references. How games teach per-task mechanics apart from play

Research date: 2026-10-02. Read-only web research; nothing downloaded. "(unconfirmed)" marks a claim that rests on a
fan wiki, a forum, a search-result snippet or memory. A link is given for every claim about a game or a study.

## TL;DR

1. **Up-front teaching is skipped and forgotten; help at the moment of need works.** NN/g: tutorials "don't result in
   better task performance", users skip them, and multi-step info out of context is not retained
   ([NN/g](https://www.nngroup.com/articles/onboarding-tutorials/)). A 45,000-player A/B study found tutorials raised
   play time (up to 29%) only in the most complex of three games, and not in the simpler two
   ([Andersen et al., CHI 2012](https://grail.cs.washington.edu/projects/game-abtesting/chi2012/chi2012.pdf)).
2. **Static pictures with short text beat narrated animation for explaining "how a thing works".** In 8 comparisons
   animation never won; static annotated illustrations won 4 and tied 4 (average d = 0.68)
   ([Mayer, Hegarty, Mayer & Campbell 2005](https://pubmed.ncbi.nlm.nih.gov/16393035/), summarised by
   [Work-Learning Research](https://www.worklearning.com/2006/05/31/research_brief_/)). This is direct support for
   the engineer's comic cards over LOCKDOWN-style videos.
3. **The best references teach a task the first time it appears, then get out of the way:** Overcooked shows a new
   recipe at the start of the level it first appears in (unconfirmed); TF2's game-mode intros stop after a few
   viewings (unconfirmed); Jackbox added a group skip after players asked "I wish we could skip tutorials!"
   ([Jackbox](https://jackboxgames.com/responding-to-your-questions-from-the-jackbox-customer-survey)).
4. **The cheapest teacher is a station that reads itself** (Among Us has no task instructions at all, unconfirmed;
   WarioWare teaches a whole microgame with one verb, [Wikipedia](https://en.wikipedia.org/wiki/WarioWare)). Cards
   are the fallback for multi-step tasks, not a crutch for unreadable ones.
5. **I found no confirmed party game that uses drawn comic-strip how-to cards per task.** That gap (if real) is the
   uniqueness the engineer hoped for. Absence is unconfirmed: my searches may have missed one.

## Evidence on skipping and on "show, don't tell"

- **Andersen, O'Rourke, Liu et al., "The Impact of Tutorials on Games of Varying Complexity", CHI 2012.** Eight
  tutorial designs, three games, more than 45,000 players. Tutorials helped only in the most complex game; the authors
  conclude tutorials "may not be justified" for mechanics discoverable by experimentation. The four variables they
  tested are useful for us: presence, context sensitivity (instructions only when relevant), freedom (agency during
  the tutorial), availability of help (on demand)
  ([paper](https://grail.cs.washington.edu/projects/game-abtesting/chi2012/chi2012.pdf),
  [Semantic Scholar](https://www.semanticscholar.org/paper/The-impact-of-tutorials-on-games-of-varying-Andersen-O'Rourke/d4a00da8cab8c5b2777385a698b02edc69736bea)).
  Implication: Delivery needs no card; a 4-step Pizzushi-like task does.
- **NN/g, "Onboarding Tutorials vs. Contextual Help".** The "paradox of the active user": people want to act, not
  study. Push tutorials are skipped, poorly recalled and do not improve performance. Recommends "pull revelations":
  help that is easy to dismiss and to get back, shown next to the step it explains, skipped for conventional things
  ([NN/g](https://www.nngroup.com/articles/onboarding-tutorials/); also
  [mobile tutorials](https://www.nngroup.com/articles/mobile-tutorials/)).
- **Mayer et al. 2005, static vs animated.** Lessons on lightning, a toilet tank, waves, car brakes; same words and
  graphics on paper vs a narrated system-paced animation. Paper never lost
  ([PubMed](https://pubmed.ncbi.nlm.nih.gov/16393035/),
  [summary](https://www.worklearning.com/2006/05/31/research_brief_/)). The usual explanation: a reader controls the
  pace and re-reads; an animation is transient. Caveat: for *human motor skills* animation can win
  ([Wong et al., title only](https://www.academia.edu/2293233/Instructional_animations_can_be_superior_to_statics_when_learning_human_motor_skills)).
  Our tasks are "go there, take this, use it there": procedural, not motor. Motor basics (jump, sprint) belong to the
  tutorial room, learned by doing.
- **Pictures need a few words.** A pharmaceutical-pictogram study reports symbol-plus-text and text-only beating
  symbol-only (unconfirmed, search snippet of
  [PMC3122047](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3122047/)). IKEA tests each wordless manual by having
  staff build the product from pictures alone (unconfirmed, blog:
  [Justin Zhuang](https://justinzhuang.com/posts/wordless-instructions/)). For us: a panel is a drawing plus a 1-4
  word caption, and the caption is a separate localized string (EN/UK), never text baked into the image.
- **Show, don't tell.** Miyamoto designed World 1-1 so the player "gradually and naturally" understands, enticing
  jumps and mushroom grabs without commands
  ([Game Developer](https://www.gamedeveloper.com/design/how-miyamoto-built-i-super-mario-bros-i-legendary-world-1-1)).
  Celia Hodent (Fortnite UX, GDC 2016) asks teams to list everything a player must learn and prioritise it, teaching
  by doing ([Game Developer](https://www.gamedeveloper.com/design/video-inside-the-ux-of-onboarding-and-player-engagement),
  [Hodent](https://celiahodent.com/gamers-brain-ux-onboarding/)).
- **Players skip videos and fixed instructions in practice.** Jackbox players asked to skip tutorials; Jackbox
  added a VIP skip from Pack 6
  ([Jackbox](https://jackboxgames.com/responding-to-your-questions-from-the-jackbox-customer-survey),
  [Steam thread, Pack 4](https://steamcommunity.com/app/610180/discussions/0/1700541698695336712/),
  [Steam thread, Pack 2](https://steamcommunity.com/app/397460/discussions/0/357286663691716832/)). TF2 players ask how
  to disable game-mode intro videos; they stop by themselves after a set number of views (unconfirmed, forum:
  [GameFAQs](https://gamefaqs.gamespot.com/boards/437678-team-fortress-2/61603528)). This matches the engineer's own
  experience with LOCKDOWN's videos.

## Reference games

### 1. LOCKDOWN Protocol: tablet task list, hover-lit spots, how-to videos
- **How:** each player opens a tablet with the task list; hovering a task shows blinking dots in rooms
  ([TheGamer](https://www.thegamer.com/lockdown-protocol-vents-fix-explained-guide/)); "for the tasks there are videos
  that explain them", and a private lobby with custom settings lets you switch on tasks to train
  (unconfirmed, forum: [Steam](https://steamcommunity.com/app/2780980/discussions/0/4635988779091438487/)); partial
  video tutorials were added to the tablet in Update 1.1.12 (unconfirmed, search snippet; the page body did not load:
  [Steam announcement](https://steamcommunity.com/games/2780980/announcements/detail/4360131627007800347)). Tasks are
  multi-step: Vents (find red vent, screwdriver, wash filter in another room, reinstall), Pizzushi (rice, plants,
  fish vending, assembly, placemat) (unconfirmed, community guide:
  [Steam guide](https://steamcommunity.com/sharedfiles/filedetails/?id=3305518998)).
- **Pros:** help lives where the task list is (pull, in context); veterans never open it; the practice lobby is
  cheap.
- **Cons:** video is transient, slow, scrubbed (the engineer's experience; Mayer 2005); watching a minute mid-round
  costs the round; the community still made many YouTube and TikTok task tutorials
  ([example](https://www.youtube.com/watch?v=vRvoqHCTO_A)), a hint the in-game help was not enough (unconfirmed
  inference).
- **Fit: partial.** Keep the place (task list, hover zones, pull) and the practice lobby; replace the video.

### 2. Among Us: stations that explain themselves; Practice mode
- **How:** tasks are minigames, puzzles and toggles; "none of the tasks come with instructions", players look at the
  screen and work it out (unconfirmed, fan wiki: [Among Us wiki](https://among-us.fandom.com/wiki/Tasks)). Practice
  (formerly Freeplay) is a solo mode with a laptop where you pick tasks and roles
  ([Nerdschalk](https://nerdschalk.com/what-is-freeplay-in-among-us/), unconfirmed;
  [Innersloth beginner's guide](https://innersloth.zendesk.com/hc/en-us/articles/7794240573460-Beginner-s-Guide-to-Among-Us)).
- **Pros:** zero UI cost; tasks teach in one look; practice is opt-in.
- **Cons:** works because each task is one screen; multi-room chains do not explain themselves.
- **Fit: good** for the principle "a station must show its state and what it wants" (an empty slot shaped like the
  item, a switch visibly off). Good for a practice mode.

### 3. Overcooked: the new recipe at the start of its first level
- **How:** when a new recipe appears, its instructions are shown at the level start and the timer waits until the
  first order is served (unconfirmed, fan wiki:
  [1-1](https://overcooked.fandom.com/wiki/1-1_(Overcooked!)), [Recipe](https://overcooked.fandom.com/wiki/Recipe)).
  From memory, the recipe card is pictorial: ingredient icons, arrows, station icons (unconfirmed, memory).
- **Pros:** taught exactly once, exactly when it matters, as pictures; the grace period removes pressure.
- **Cons:** a level-based game controls when a recipe first appears; we do not (random task assignment).
- **Fit: good.** The equivalent for us: show a task's card during Loading/Countdown only if *this player* has not
  done that task type yet.

### 4. Mario Party: instruction screen with rules, tips and practice
- **How:** before each minigame an instruction screen shows rules and tips with a small rendition; you can practise
  from it ([Mario Party DS manual](https://cdn02.nintendo-europe.com/media/downloads/games_8/emanuals/nintendo_ds_21/Manual_NintendoDS_MarioPartyDS_EN.pdf));
  later games run the practice inside the rules screen itself
  ([Twinfinite](https://twinfinite.net/guides/mario-party-superstars-minigames-how-practice/),
  [Super Mario Wiki](https://www.mariowiki.com/Super_Mario_Party), unconfirmed).
- **Pros:** learn by doing while reading; everyone waits for everyone, so no one is punished.
- **Cons:** a forced pause before every minigame; veterans mash through it.
- **Fit: partial.** We have no per-task pause, but the lobby is a natural waiting time: practice stations there.

### 5. WarioWare: one word
- **How:** each microgame gives one imperative ("Pick!", "Find!") as it starts; the first microgame plan was a
  picture of a nose, a finger and the word "Pick!" ([Wikipedia](https://en.wikipedia.org/wiki/WarioWare)).
- **Pros:** instant; the scene carries the rest.
- **Cons:** works for 5-second games only.
- **Fit: good for naming.** Task names on the Tab list should be verbs that are half the explanation: "Deliver",
  "Switch on", "Refuel". The first panel of every card is that verb.

### 6. Fall Guys: round intro with name, one-line goal and flyover
- **How:** each round opens with its name and goal and an overhead pan of the course (unconfirmed, fan sources:
  [Wikipedia](https://en.wikipedia.org/wiki/Fall_Guys),
  [Fall Guys wiki](https://fallguysultimateknockout.fandom.com/wiki/Welcome_to_Fall_Guys!)).
- **Pros:** one line per round is enough when the round reads itself.
- **Cons:** shown to veterans every time (short, so tolerated).
- **Fit: good** for the round-start/Countdown moment: the mode's one-line goal ("Engineers: finish the tasks before
  the timer") belongs here, not on the HUD.

### 7. Jackbox: per-game tutorial, skippable by the VIP
- **How:** each game opens with a narrated tutorial; from Pack 6 the VIP can skip it for the room; tutorials are
  also on YouTube ([Jackbox](https://jackboxgames.com/responding-to-your-questions-from-the-jackbox-customer-survey)).
- **Pros:** a group decision fits a party game; new players can rewatch.
- **Cons:** unskippable tutorials generated explicit complaints for years (Steam threads above).
- **Fit: good lesson:** whatever is shown to all must be skippable by the host; anything personal must be per player.

### 8. Goose Goose Duck: role descriptions and a Help button for this match
- **How:** a Help button shows the roles and rules selected for the current game (unconfirmed, search snippet of
  the [V0.99.5 news](https://store.steampowered.com/news/app/1568590/view/2984182379485260022); role list:
  [fan wiki](https://goose-goose-duck.fandom.com/wiki/Roles)).
- **Pros:** reference limited to what is in play, so 45 roles do not overwhelm.
- **Cons:** text-heavy role blurbs.
- **Fit: good:** our Tab list already lists only this match's tasks; cards open from there.

### 9. Lethal Company: no tutorial; terminal and a bestiary that fills as you scan
- **How:** the ship terminal has `help`; the bestiary gains an entry when the crew scans a creature, and keeps it
  after death (unconfirmed, guides: [Game Rant](https://gamerant.com/lethal-company-all-terminal-commands/)).
- **Pros:** discovery is the reward; the log feels earned, not imposed.
- **Cons:** typed commands are hidden from newcomers; much learning happens by friends explaining over voice.
- **Fit: partial.** "A card unlocks a sticker when you first complete a task" is a fun variant; a terminal is not
  our style.

### 10. Phasmophobia: training mission and the journal
- **How:** a training contract teaches equipment and evidence; the journal's evidence page greys out ghosts as you
  tick evidence ([Phasmophobia wiki](https://phasmophobia.fandom.com/wiki/Journal), unconfirmed;
  [Screen Rant](https://screenrant.com/complete-phasmophobia-tutorial-walkthrough/)).
- **Pros:** basics in a separate safe level; deep reference in an in-world object.
- **Cons:** the journal is dense text.
- **Fit: partial;** mirrors the decided tutorial room plus Tab screen.

### 11. Keep Talking and Nobody Explodes: the manual is the game
- **How:** experts read a manual the defuser cannot see; information asymmetry is the core
  ([GDC 2016, Ben Kane](https://gdcvault.com/play/1023471/Designing-Asymmetric-Gameplay-For-Keep),
  [Wikipedia](https://en.wikipedia.org/wiki/Keep_Talking_and_Nobody_Explodes)).
- **Fit: poor for onboarding** (reading is the work). A later task idea for the designer, not a teaching tool.

### 12. Deep Rock Galactic: briefing box, HUD objectives, resettable hints
- **How:** selecting a mission shows its objectives; primary and secondary objectives sit in a HUD corner; tutorial
  hints can be toggled and reset in options (unconfirmed, wiki:
  [HUD](https://deeprockgalactic.wiki.gg/wiki/Heads-up_display), [Missions](https://deeprockgalactic.wiki.gg/wiki/Missions)).
- **Fit: good** for the hints setting: per player on/off plus "reset hints" (for a friend on your PC).

### 13. Team Fortress 2: game-mode intro movies that retire themselves
- **How:** a short intro of the mode plays when you join a mode; after a set number of views it stops (unconfirmed,
  forum: [GameFAQs](https://gamefaqs.gamespot.com/boards/437678-team-fortress-2/61603528)).
- **Fit: partial:** take the auto-retirement, drop the movie.

## Patterns, condensed

| Pattern | Games | Fit for us |
|---|---|---|
| Self-explaining station | Among Us, WarioWare | Good: the first line of defence |
| Pull help from the task list | LOCKDOWN, GGD | Good: already the Tab screen |
| Video how-to | LOCKDOWN, Jackbox | Poor: slow, skipped, transient |
| First-appearance card, then retire | Overcooked, TF2 | Good: per player, at Loading |
| Static picture steps + short words | Overcooked (unconfirmed), IKEA, Mayer 2005 | Good: the comic cards |
| Practice sandbox | Among Us Practice, LOCKDOWN lobby, Mario Party | Good: lobby stations |
| One-line goal at round start | Fall Guys | Good: Countdown |
| Host-level skip / hints toggle | Jackbox, DRG | Good: session setting |
| Discovery log | Lethal Company | Partial: fun sticker variant |
| Manual as game | KTANE | Poor for teaching |

## Recommendations for prime-game

1. **Three layers, each for a different player.** (a) The tutorial room teaches verbs only (decided). (b) Every
   station reads itself: visible state, item-shaped slots, the destination label on the package. (c) A comic "how
   to" card per task type for the multi-step ones. A veteran meets none of (a) or (c) after the first sessions.
2. **Cards, not videos.** 3 to 4 panels, one verb each, a drawn figure, a 1-4 word caption as a localized string.
   Readable in about 5 seconds; no autoplay, no audio. If a task needs more than 4 panels, treat it as a design smell
   (Andersen: complexity is what makes help necessary).
3. **Pull during the round, push only before it.** In the round the card opens only from the hold-Tab task list
   (hover or click a task). Before the round, the Loading screen shows the card of a task type this player has never
   completed, in place of a funny tip; otherwise the tip. This keeps the round UI clean and still reaches newcomers.
4. **Retire per player.** A task type's card stops appearing on the Loading screen after the player has completed it
   (once or twice); it stays pullable from Tab forever (open knowledge). Stored per player, locally.
5. **Practice without a separate mode first:** put one practice station of each task type in the lobby, where
   people wait anyway (Mario Party, Among Us Practice). Cheaper than a practice mode and social.
6. **Name tasks as verbs** (WarioWare) and put the mode's one-line goal on the Countdown card (Fall Guys).
7. **Session setting "with hints / without"** (DRG, Jackbox): "without" turns off the Loading cards and the hover
   zone highlights; the pulled cards stay (open knowledge).
8. **The style is the uniqueness.** Cringe-fun drawn figures (the same little engineer in every card, with a funny
   failure panel such as "a Dissident flips it off: flip it back") can also feed trailers and loading art.

## Open questions

- Who draws the panels? Humans hand-make only scene layout and imported third-party assets; drawn cards are either
  commissioned or imported art (credits entry) or simple vector art an agent can author. This decides cost and style.
- Does a Loading-screen card for an untried task break "the UI must not tell the player what to do"? It is before
  the round and per player; the engineer should rule.
- How many completions retire a card: 1 or 2?
- Do panels name fixed rooms ("Storage") or show only icons, given open knowledge and possible map changes?
- Is the lobby practice station in scope for the next milestone, or does a host-enabled practice match come first?
- The claim that no party game uses comic how-to cards is unconfirmed; worth one more search before marketing it.
