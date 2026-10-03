# prime-game-ui

The UI and UX design track of [prime-game](https://github.com/xperiaroco2/prime-game): research, wireframes, style
directions and, after a choice, the design system the game's Godot theme is built from. The plan and the wave reports
live on prime-game issue #150. The engineer runs the track and, for now, also answers as the designer. Chat follows the
human's language (Ukrainian); everything in this repo is English.

## Hard rules
- **HTML-first, shown not named.** Every deliverable is an HTML page the engineer reviews on a phone as a private
  claude.ai artifact; its source lives in `pages/`. A style, a layout or a screen is presented as a picture or a page,
  never only as a name and a paragraph.
- **Godot-safe CSS** in every mock-up: only what Godot 4.7.2 `StyleBoxFlat`, `LabelSettings` and `Theme` can draw
  (solid fills, per-side border widths with one colour, per-corner radii, one shadow with no inset and no spread, one text
  outline). In the UI: no gradients, images, blur or filters, several or inset shadows, per-side border colours, dashed
  borders, `clip-path`, blend modes or pseudo-element decoration.
- **After the style choice, a DTCG tokens file is the single source of truth**; the Godot theme is generated from it in
  prime-game, never hand-copied.
- **Licences.** Every font, icon, sound or image has a verified licence recorded next to it (allowed: OFL, CC0, MIT, ISC,
  Apache-2.0, own work). Never another studio's screenshots or art in this repo: reference images stay in private pages.
- **Downloads.** Nothing is downloaded from the internet without the engineer's yes for that batch (name the files, the
  sources and the size). Web research reads HTML, JSON and text only, never a direct image, PDF or archive URL.
- **Merging and issues.** Only a human merges into `main`; agents work on branches and open PRs. Agents never close
  issues.
- **Who decides.** Look, texts, money and subscriptions are the humans'; technical choices the agent decides and reports.
- **The game's code is not edited from here.** What the game needs becomes an issue in prime-game (with its `area:` label)
  and a note on #150.
- **Research claims carry a link**; anything not confirmed by a primary source says "(unconfirmed)".
- **Moving state** (who does what, what is next) lives only in GitHub issues, never in Markdown files.

## Layout
- `docs/ui-decisions.md`: the UI decisions made so far and where each was recorded. Read it before any screen work.
- `docs/research/<date>-<topic>/`: research reports.
- `pages/<page>/`: sources of the review pages.
- `tools/a11y/`: colour-blindness and contrast scripts (node 20, no packages).

## The process
References, then wireframes of every screen, then three style directions, the choice, tokens and components, the styled
screens, and finally handoff issues in prime-game.
