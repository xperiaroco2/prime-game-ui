# prime-game UX/UI track: wave 1 research synthesis (draft)

Date: 2026-10-02. Synthesis of six research lenses for issue #150. Read-only: nothing was downloaded, no Godot was
started, no file in `D:\prime-game` was changed.

**Inputs** (full reports, all in the session scratchpad `...\scratchpad\ux\`):
- [L1] `lens-1-style.md`: references and style
- [L2] `lens-2-ux.md`: UX of social and party games
- [L3] `lens-3-system.md`: design system, DTCG tokens, Godot-safe CSS
- [L4] `lens-4-type.md`: typography and icons
- [L5] `lens-5-motion.md`: motion, juice, UI sound
- [L6] `lens-6-a11y.md`: accessibility, including a computed colour-blindness analysis

**Markers.** "(unconfirmed)" is kept exactly where a lens put it: the claim rests on memory, a fan wiki, a blog, a
search snippet or a non-primary page. No claim marked unconfirmed by a lens is upgraded here. "(computed)" marks
numbers from our own node scripts (L1's luminance script, L6's `a11y/cvd.js` and `a11y/contrast.js`, and this
synthesis's `ux/synth_contrast.js`), which are calculations, not quotes.

**Live checks made for this synthesis (2026-10-02, read-only):**
- `D:\prime-game` has no `LICENSE` or `COPYING` file at its root (`ls`).
- `client/net/client_model.gd` keeps, per station, its `colour` and a public `done` flag (set by PackageDelivered),
  and per item its `colour` and `delivered`; it keeps `winner`, `tasks`, `tasks_done`, `tasks_total`, `role` and
  `teammates`. So the Tab screen's 10-colour delivery grid can be drawn from public data (L2's open question). No
  round-end *reason* field was seen in `ClientModel` (only `winner`); `client/net/client_session.gd:53` has an
  `end_reason`, which by its name is the session's end reason (`EndReasons`), not why the round ended (not read further).

---

## 1. Executive summary

1. **Colour is the hardest problem.** The 10 placeholder package colours cover the whole hue wheel and fail
   colour-blind players: red/brown ΔE00 2.7 for protanopes, blue/purple 3.2 to 6.0 for most types, seven
   confusable pairs (computed, L6). No 10-colour set is safe by colour alone (best found 11.7). So every package,
   circle and swatch always carries a **symbol and a spoken colour name**, packages own the saturated colour, and a
   package swatch is always a ringed circle. A safer "Hand A" palette has zero confusable pairs; choosing it is a
   human and designer call.
2. **Our voice rules confuse players.** Nobody hears a downed or dead player, and the dead hear no voice at all. In
   every reference game the dead can talk. The HUD must say so every time: a mic chip that shows "Nobody can hear
   you", plus a speaking cue on the avatar that is driven only by audio the listener actually receives. There is no
   global "who is talking" list.
3. **Readability over the 3D scene comes first.** The personality goes into the rare big moments (lobby, role
   reveal, downed, respawn, end) and the round HUD stays quiet. HUD text sits on a black backplate of at least 60%
   (70% by default) or on an opaque panel. Sizes are px at a 1920×1080 reference: floor 18, body 20 to 22, HUD 24.
   Every screen is mocked in Ukrainian first.
4. **Five style directions; build four.** Lens 1 proposes D1 Sticker Bomb, D2 Parcel Post, D3 Pocket LCD,
   D4 Karaoke Night and D5 Safety Card. Build D1, D4, D2 and D3 as interactive pages, in that order, on the same
   five screens over three backdrops. D2 depends on whether the UI may hint at a setting. D5 stays a wildcard on paper.
5. **The design system uses DTCG 2025.10** (stable since 2025-10-28): tiers primitive → semantic → component, and
   resolver modifiers for direction, text size, contrast and motion. All tooling is zero-dependency node: token build,
   Godot-safe CSS lint, contrast and colour-blindness gates, font glyph check and credits check. No paid tools.
6. **Godot-safe is a three-tier rule.** A means StyleBoxFlat, theme constants, fonts and LabelSettings stacked
   outlines. B needs a declared texture asset. C needs a shader and is forbidden in mockups. Hard "sticker" shadows
   are drawn as thicker right and bottom borders. Later a headless GDScript generator in prime-game builds the Theme
   from the resolved tokens.
7. **Motion is loud on rare moments and quiet on frequent ones.** A fixed table of nine easings maps 1:1 to Godot
   Tween pairs. Reduced motion exists from day one. Rule times (countdown, holds, respawn) come from host data, never
   from tokens.
8. **Licences.** Fonts are OFL Google Fonts with a glyph check, and Russo One and e-Ukraine are excluded. Signature
   icons are our own SVGs, plus one MIT set for system icons. Sounds are CC0 or self-made only. Sonniss and CC BY-SA
   cannot go in public repos. Nothing is downloaded without a per-batch yes.
9. **Decisions are batched by when they block.** 12 decisions are needed before the style mocks (directions,
   setting, chrome colour, effect tier, symbols, colour names, palette, body colours, backplate, tone, role reveal,
   caps). The rest
   (type, icons, motion, sound, end screen) and the money and licence questions come later. A short list of
   permissions comes first: create the repo, and load Google Fonts in pages.
10. **The plan has 38 prime-game-ui issues in six waves** (bootstrap and tooling, wireframes, style exploration,
    system, screens, port handoff) and 18 later prime-game issues: the Godot probe, the generator, the base
    resolution, typography and icons, the voice input mode, settings and accessibility, symbols in 3D, and the
    screen port.

---

## 2. Recommendations across lenses

### 2.1 Conflicts between lenses and how they are resolved

| # | Conflict | Lenses | Resolution |
|---|---|---|---|
| C1 | **Juicy motion vs reduced motion and fatigue.** D1 wants a jiggle on hover; D3 stepped boot flicker; D4 flicker-on and a flickering dissident outline; L5/L6 limit frequent motion, idle loops and flashing | L1, L5, L6 | **Loud on rare, quiet on frequent** (L5): hover and press 60 to 120 ms, scale ≤ 1.04, no overshoot; bounce, tilt and wobble only on set pieces. D1's hover jiggle is dropped. Flicker is allowed only as a one-shot entrance with at most 3 flashes in any second (WCAG 2.3.1), never as a loop; D4's dissident marker is a *static* unlit outline. A reduced-motion mode turns motion into ≤150 ms fades and keeps every information-bearing indicator (holds, invulnerability ring, countdown digits) |
| C2 | **Bold style vs readability over 3D.** Loud directions vs a quiet, legible HUD | L1, L4, L6 | R4 and R5 (L1) plus numbers (L6): HUD text sits on an opaque panel or a black backplate ≥ 60% (70% default; 60% gives 5.74:1 over pure white, computed); outlines on display text; tilt only on big moments; the round HUD is texture-free so any direction degrades to plain StyleBoxFlat. Every mock is judged first over bright, dark and busy backdrops |
| C3 | **10 colours vs colour blindness.** L1 keeps 10 hues and coding by rings; L6 shows the palette fails and no 10-colour palette is safe | L1, L3, L6 | Symbols and colour names **always on** (L3 and L6 agree; not a setting). Saturated colour is reserved for packages (R1). Package swatches are ringed circles (R2). Teams never rely on hue (R3). The "Hand A" palette and "fewer than 10 colours" go to the humans and the designer (H7). The contrast and colour-blindness gates run on whichever palette is chosen |
| C4 | **Colour-vision "mode" or not.** L3: no mode, symbols do the work; L6: palette presets default / red-green / blue-yellow / high contrast | L3, L6 | Both: symbols and names do the work always; the token structure reserves a `colorVision` resolver modifier now (cheap) but ships only `default` and `high-contrast` values first. Red-green and blue-yellow presets come only if playtests with colour-blind players show a need, because they also have to recolour the 3D packages and circles (game code) and must never change names or symbols |
| C5 | **Swatch keyline order.** L1: ink outer ring, light inner keyline; L6: light outer, dark inner; L3: "filled rounded box" | L1, L3, L6 | A package swatch is a **circle** (R2; a StyleBoxFlat with radius = half its size is Godot-safe). Two rings, and the order flips with the panel: the **outer ring takes the opposite lightness of the panel** (it separates the dot from the panel), the inner keyline the other one (it separates a dark or light fill from the outer ring). A per-direction component token holds the order; the gate checks outer ring vs panel ≥ 3:1 |
| C6 | **Body colour dots vs R2** (L2/L3 show body colour as a "colour dot" on player chips; L1 says no UI element is a plain filled circle in a package hue) | L1, L2, L3, L6 | Body colours are **never drawn as circles**: a different shape per direction (a rounded square, a mask silhouette or a sticker) plus the colour name. Combined with a separate body palette (H8), "the red one" stops meaning two things |
| C7 | **Role reveal: black screen vs live world.** L5's choreography fades to black first; L2 wants a banner over the live world with input live | L2, L5 | No black screen: the team sticker slams in over the live world (at most a partial scrim band behind it), input stays live, everyone gets it on the same tick, about 3 s, then it shrinks into the chip under the clock. L5's slam, 200 ms beat and typed subtitle stay. It is not replayed on respawn |
| C8 | **Toast timing.** L2: 4 s each; L5: a 2.5 s hold | L2, L5 | 4 s total on screen (L2's reading time, longer Ukrainian strings) with L5's motion: in 200 ms `snap`, out 120 ms `in`, max 3 stacked |
| C9 | **Type size scale.** L4: 18 / 22 / 24 / 28 / 36 / 64-96 / 96-140; L6: floor 18, body 20, HUD 24 | L4, L6 | One scale at 1920×1080: 18 floor (fine print, debug), 20 body, 22 descriptions, 24 HUD text and hints, 28 buttons and tabs, 36 section titles (also the "large text" line for 3:1), 64 to 96 timers, 96 to 140 set-piece titles |
| C10 | **Base resolution.** L3: move prime-game's base to 1920×1080 in the port; L4/L6: either the generator scales ×0.6 or the base moves | L3, L4, L6 | Tokens are px at 1920×1080 (all agree). The port issue moves prime-game's base to 1920×1080 (recommended by the Godot 4.7 docs for non-pixel-art desktop games); the generator's scale factor is the fallback. Engineer-owned (`project.godot`) |
| C11 | **Token names: `color.delivery.*` (L3) vs `color.package.*` (L1, L6)** | L1, L3, L6 | `color.package.*` (2 of 3 lenses, and the game's own word); the circle uses the same token |
| C12 | **Team colour on the role card** (L3: "team colour") vs R3 (teams without hue) | L1, L3 | Team identity = shape + word + light-versus-dark (e.g. D1: white sticker vs ink sticker; D5: square vs triangle frame). A team colour token may exist but only as a lightness treatment, never a hue a package uses |
| C13 | **Motion tokens priority.** L3 marks them "could"; L5 "must" | L3, L5 | **Must**: the mocks need them to animate at all, and the nine-easing table is what keeps the mocks portable |
| C14 | **ZzFX inlined in mockups (L5)** vs the no-download rule | L5, rules | An agent would have to fetch ZzFX's source to inline it. Instead: our own ~50-line WebAudio blip function (no third-party code, no download, no licence entry). ZzFX only if the human approves it as a batch |
| C15 | **D3 pixel text vs UI scale 75 to 200%** | L1, L6 | Pixel faces need integer scales. If D3 wins, pixel faces are used only for big text (L1 already says so) and all small text uses a non-pixel UI font that scales freely |
| C16 | **Tab: hold (today) vs toggle (APX "Leave It There")** | L2, L6 | Hold stays the default (current behaviour); toggle is a setting. G give-up gets "press twice within 2 s" or an adjustable hold, not a plain toggle (it is irreversible) |

### 2.2 Merged recommendations

Tags: **[must]** / **[should]** / **[could]**. Sources are lens ids plus the key primary link; full lists in §11.

**A. Colour, packages and teams**
- [must] **R1 Packages own saturated colour.** Chrome is neutral or pastel with at most one pale hero tint.
  Sources: L1 (measured collisions), [Splatoon chroma hierarchy (unconfirmed)](https://www.nintendo.com/us/whatsnew/ask-the-developer-vol-7-splatoon-3-part-1/).
- [must] **R2 A package swatch is a ringed circle with its symbol inside and its colour name next to it.** Order of
  rings per C5; symbol ink per fill (computed: ink or white, every Hand A fill ≥ 4.64:1). Sources: L1, L3, L6,
  [XAG 103](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/103).
- [must] **Colour is never the only cue.** Symbols and names always on, for packages, circles, HUD swatch, the
  destination marker, the Tab grid and body colours. Sources: L6, [GAG basic](https://gameaccessibilityguidelines.com/full-list/), XAG 103.
- [must] **R3 Teams read without hue**: shape, word, light versus dark. Sources: L1,
  [ISO 7010 (unconfirmed, Wikipedia)](https://en.wikipedia.org/wiki/ISO_7010).
- [must] Draw 10 **own** rotation-safe symbols (no square/diamond, plus/×, up/down triangle pairs); ColorSym is
  only a reference (CC BY-SA, unconfirmed from the repo page), ColorADD is paid (unconfirmed, Wikipedia). Sources: L6.
- [should] Replace the placeholder palette with a colour-blind-safer one, such as **Hand A** (Okabe-Ito hues plus
  white, near-black, indigo; zero confusable pairs, computed), or use fewer package colours. Human and designer
  decision (H7). Sources: L6, [Okabe-Ito (hexes unconfirmed)](https://jfly.uni-koeln.de/color/), [Paul Tol](https://sronpersonalpages.nl/~pault/).
- [should] **Separate body palette**, checked by the same script, never drawn as a circle (C6), with the colour
  name on the nameplate. Sources: L2, L6.
- [should] Symbols on 3D packages and circles are emissive or unshaded decals; circles get a standing post with the
  symbol. Later simulate real level screenshots. Sources: L6.

**B. Readability, layout and sizes**
- [must] **R4/R5**: HUD over 3D on an opaque panel or a ≥ 60% (70% default) black backplate, or outlined; the round
  HUD stays quiet; personality in big moments. Sources: L1, L6 (computed backplate table),
  [XAG 102](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/102).
- [must] The size scale of C9; nothing below 18 px at 1920×1080; text and icons scale to 200%. Sources: L4, L6,
  [XAG 101](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/101).
- [must] Contrast floors: 4.5:1 text, 3:1 large text (≥ 36 px) and non-text, 7:1 in high contrast, measured against
  the worst-case background. Sources: L6, XAG 102.
- [must] Every mock at 1920×1080 and 1280×720, over bright, dark and busy backdrops; also checked at 2560×1080
  (21:9), 1920×1200 (16:10) and 200% UI scale. Sources: L1, L3, L6.
- [must] Mock every text-bearing screen in **Ukrainian first**, then English: Godot 4.7.2 `Label` has no
  shrink-to-fit, so each component has a length budget, wrap or ellipsis. Sources: L4 (API dump),
  [W3C text size (European figures; Ukrainian-specific unconfirmed)](https://www.w3.org/International/articles/article-text-size).
- [should] Tabular figures for timers, countdowns and counters (FontVariation `tnum`; Inter has it, others
  unconfirmed until the glyph check). Sources: L4, [Inter](https://rsms.me/inter/).
- [should] Caps only for short titles of 1 to 3 words, with letter spacing; sentence case for instructions (H12).
  Sources: L4, XAG 101.
- [should] Focus ring ≥ 2 px (3 px default) with a 3:1 change; in D1 the focus ring is ink, because lilac on paper
  is only 1.65:1 (computed). Sources: L6, [WCAG 2.4.13](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html).

**C. Voice and privacy**
- [must] Mic chip with five states: open, push-to-talk idle, transmitting, no microphone, "Nobody can hear you"
  (downed or dead). The dead screen says "The dead hear only the world around <name>". Sources: L2 (vision
  revision 1, V11), [VoiceHUD and the lying spectate icon (unconfirmed, mod pages)](https://thunderstore.io/c/lethal-company/p/ficcialfaint/Spectator_Voice_Icon_Fix/).
- [must] Speaking cue on the avatar (ring, glow, later the mask mouth, #73), driven only by audio the client
  receives and plays; plus an off-screen edge arrow for audible voices out of view. Never a global talking list.
  Sources: L2, L6, [GAG: who is speaking](https://gameaccessibilityguidelines.com/provide-a-visual-indication-of-who-is-currently-speaking/).
- [must] Privacy on every screen: no other player's role (except a dissident's own teammates); spectate shows only
  "Spectating <name>" and public hand and belt; toasts only public events. Sources: L2, `client/CLAUDE.md`.
- [should] One role sting for both teams, and identical sounds for private events across teams, since open mics on
  speakers can leak them (inference, unconfirmed size). Sources: L5.
- [should] Esc menu Players tab: per-player volume and mute. Sources: L2, L6.

**D. Screens and flows** (inventory in §4)
- [must] Main menu: name (required on first launch), Host, Join with remembered address, version in a corner,
  one-time mic check. Sources: L2.
- [must] Host's join info "Friends join: <LAN IP> : <port>" with Copy (`DisplayServer.clipboard_set`, API dump) in
  the lobby HUD and the Esc Lobby tab. Whether the client can read its own LAN address was not checked (gap). Sources: L2.
- [must] Errors: a player sentence plus an action per `EndReasons` id, developer text to the log, shown in the main
  menu banner, not a modal. Sources: L2 (`client/app/end_reasons.gd`).
- [must] Role screen (#175): banner over the live world ~3 s, then a chip under the clock, repeated on Tab (C7).
  Sources: L2, L5.
- [must] Esc menu (#169): Players and Settings tabs; "The game keeps running" under Resume; "Leave to main menu",
  "Quit to desktop". Sources: L2.
- [should] Tab screen: role and goal line, 10-chip delivery grid with names (public `Station.done`, checked live),
  controls footer. Sources: L2.
- [should] End screen: "You won" / "You lost" from the viewer's own role, a one-line public reason, "Waiting for the
  host" for clients. The reason needs a source: no round-end reason field was seen in `ClientModel`. Sources: L2.
- [should] Teach without a tutorial: prompts near the crosshair the first few times, loading tips from content
  data, the Tab screen, a practice package and circle in the lobby (to suggest to the designer). Sources: L2,
  [NN/g onboarding](https://www.nngroup.com/articles/onboarding-tutorials/).
- [could] Toast stack under the clock (C8), public events only. Sources: L2, L5.

**E. Typography**
- [must] Glyph check (cmap and GSUB) on every candidate before adoption: і ї є ґ І Ї Є Ґ ʼ ’ № and `tnum`. A subset
  tag is not glyph proof. Sources: L4, [Google subset definitions](https://github.com/googlefonts/nam-files/tree/main/Lib/gfsubsets/data).
- [must] Exclude Russo One (its own description: the name means "Russian"; RFN "Russo") and e-Ukraine (no
  font-specific licence; state brand; unconfirmed licence). Sources: L4.
- [should] Two families plus at most one gimmick per direction; variable TTFs from google/fonts at a pinned commit;
  never subset (OFL Modified Version and RFN rules). Sources: L4, [OFL FAQ](https://openfontlicense.org/ofl-faq/).
- [should] Every display font has an explicit fallback to the UI font. Sources: L4,
  [Godot fonts 4.7](https://docs.godotengine.org/en/4.7/tutorials/ui/gui_using_fonts.html).
- [could] Wireframes in Balsamiq Sans, so nobody reads them as a style. Sources: L4.

**F. Icons**
- [should] Own SVGs for 15 to 25 signature icons (package, knife, downed, raise, give up, ready, host, voice,
  speaking, slots, circle, respawn, spectate); one MIT set (Phosphor or Tabler) for system icons; Kenney Input
  Prompts (CC0) for mouse glyphs only. Sources: L4.
- [should] Keycap component for key prompts, reading the live binding, with tap and hold variants (hold ring).
  Sources: L4, L6.
- [should] Godot-safe SVG rules: paths only, one colour (white, tinted), fixed grid, no text, filters or masks.
  Sources: L4, [Godot importing images 4.7](https://docs.godotengine.org/en/4.7/tutorials/assets_pipeline/importing_images.html).

**G. Motion**
- [must] Loud on rare, quiet on frequent (C1). Sources: L5, [NN/g animation duration](https://www.nngroup.com/articles/animation-duration/),
  [Juice It or Lose It](https://www.gdcvault.com/play/1016487/juice-it-or-lose).
- [must] Nine-easing table mapped to Godot (TransitionType, EaseType) pairs; DTCG `$value` = nearest cubicBezier,
  `$extensions` = the Godot pair; CSS gets cubic-bezier and an exact `linear()` sampled from a JS port of Godot's
  Penner equations. Sources: L5, [MDN linear()](https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function/linear),
  [Tween 4.7](https://docs.godotengine.org/en/4.7/classes/class_tween.html).
- [must] Rule durations (5 s countdown, 1 s give-up hold, 30 s respawn, 3 s invulnerability) are never motion
  tokens; motion decorates inside host-driven time. Sources: L5.
- [must] Reduced motion from day one (default from `DisplayServer.accessibility_should_reduce_animation()`, Windows
  support unconfirmed). Sources: L5, L6.
- [must] Input never waits for an animation; Esc and Tab act on the same frame. Sources: L5.
- [should] Each direction defines a motion personality and a sound palette, shown in a motion lab page. Sources: L5.
- [could] Two or three CanvasItem shaders for set pieces only (later, prime-game). Sources: L5.

**H. Sound**
- [must] Only CC0 or self-made UI sounds in either repo; never Sonniss (its licence forbids supplying the files to
  others; both repos public). Sources: L5, [Sonniss licence](https://sonniss.com/gdc-bundle-license/).
- [should] About 20 UI sounds, each with a visible twin; separate UI volume. Sources: L5, GAG.
- [could] Freesound CC0 sounds only by a human (login needed). Sources: L5, [Freesound FAQ](https://freesound.org/help/faq/).

**I. Accessibility settings** (design space reserved now, implemented later in prime-game)
- [should] An Accessibility tab with the top ten: UI scale and text size; hold or toggle for Tab, G, E; full
  remapping; colour mode; reduced motion; FOV and head-bob; crosshair options; speaking indicator and per-player
  volume; mono and sound captions; reduce flashing and backplate opacity. Sources: L6.
- [should] MVP order for settings: Voice and Audio first, then sensitivity and the Tab toggle, then text size,
  colour mode, remapping. Sources: L2, L6.
- [could] Recruit two or three colour-blind playtesters. Sources: L6, XAG 103.

**J. Design system and tooling** (details §5)
- [must] DTCG 2025.10 tokens, three tiers, resolver modifiers, zero-dependency node tooling (build, CSS lint and
  in-page checker, a11y gates, font check, credits check). Sources: L3, [DTCG 2025.10](https://www.designtokens.org/tr/2025.10/format/).
- [must] Godot-safe CSS tiers A/B/C, written before any mockup. Sources: L1, L3, L4.
- [should] Matching showcases (`showcase.html` and later `client/dev/theme_showcase.tscn` via `shot`) with a
  side-by-side page. Sources: L3.

**K. Licences and downloads**
- [must] Every font, icon, image and sound has a credits entry in prime-game's `docs/credits` format with the
  licence file next to it; CI fails an asset without an entry. Sources: L4 (`tools/runner/credits.py`).
- [must] Nothing enters the repo from the internet without the human's yes per batch (fonts, icon set, sounds).
  Sources: the human's rules.

---

## 3. Style directions

### 3.1 Rules every direction keeps

R1 packages own saturated colour; R2 package swatch = ringed circle + symbol + name; R3 teams without hue; R4 HUD
over 3D on a plate or outlined; R5 personality in big moments; R6 microcopy is part of the style (tone is the
humans'); **R7 (new) body colours are never circles and always named** (C6). Sources: L1 §3, L6.

### 3.2 The five directions, refined

Palettes and pitches are L1's. Typography is from L4's candidate list. Godot tiers are from L3. The accessibility
numbers are computed (the `synth_contrast.js` run; WCAG 2.x ratios).

| | D1 Sticker Bomb | D2 Parcel Post | D3 Pocket LCD | D4 Karaoke Night | D5 Safety Card |
|---|---|---|---|---|---|
| Pitch | panels are stickers a friend slapped on your screen | paperwork of a slightly incompetent courier firm | your HUD is a 1998 virtual-pet toy | a karaoke lyrics screen runs your match | an airline safety card calmly explaining the chaos |
| Core palette | ink #1A1424, paper #FFF6E5, lilac #CBB8FF, grey #8A8492 | label white #FBF7EE, kraft #C89B6D (frames only), ink #231F1C, oxblood #7A1F2B | LCD #B9C4A4, segment #262E22, ghost 12%, milk shell #F4EFE6, lilac buttons #B9A7F2 | night #15112B, velvet #2A1F4D, tube white #FFF1D6 | card cream #FBF3E4, ink #24223A, pastel fields (mint, peach, sky, butter) |
| Teams (R3) | white sticker with ink tick vs ink sticker with white type | staff badge vs the same badge stamped "RETURN TO SENDER" | engineer pet in hard hat vs pet in bandit mask (same monochrome) | steady lit tube vs **static** unlit outline (C1) | square "safe" frame vs rounded triangle "warning" frame (shape-coded) |
| Type candidates (L4) | Unbounded Black + Onest (pairing 1) or Dela Gothic One + Golos Text (pairing 3); Pangolin for one-word marker stickers; timers Inter `tnum` or Rubik Mono One | Oswald or Tektur (`wdth`) for stamps, Golos Text body, Rubik Mono One for stamp numbers; a Cyrillic typewriter or receipt mono was **not researched** (gap) | a pixel font with Ukrainian Cyrillic was **not researched** (Kenney Fonts' Cyrillic unconfirmed); Tektur as a non-pixel fallback; 7-segment timer digits could be a component drawn from StyleBoxFlat segments (proposal, untested) | Nunito throughout (pairing 2), Comfortaa as a monoline display (RFN: never subset), Rubik Bubbles for one-word shouts | Fixel Display + Text (pairing 4; needs a download batch even for mocks) or Onest/Golos Text as a free-to-load DIN-like fallback |
| Godot-safe (L3 tiers) | A: panels, extruded-border shadow, tilt (`Control.rotation`), sticker text (LabelSettings stacked outlines). B: tape, peel corners, torn edges, halftone 9-slices | A: label panels, rotated stamp Labels. B: paper grain, kraft fibre, perforated edges, tape, barcodes, stamp roughness (the most texture) | A: bezels, LCD windows, segmented bars, ghost-segment Labels. B: pixel icons, pet sprites. C (forbidden in mocks): LCD tint shader. Needs an integer-scaling test | A almost entirely: glow = one zero-offset StyleBoxFlat shadow (fall-off vs CSS blur unconfirmed), outlines with `draw_center` off, text glow via LabelSettings shadows. C (forbidden): bloom, flicker noise | A: cards, frames, numbered steps. B: SVG pictograms, triangle frames, hazard stripes (illustration-heavy) |
| Package dots: current palette under 3:1 on main panel (computed) | 6/10 on paper | 6/10 on label white; **10/10 on kraft** | 7/10 on LCD | 3/10 on velvet (blue, purple, brown) | 6/10 on cream |
| Same, Hand A palette (computed) | 5/10 (white, yellow, orange, sky, pink) | 5/10 on label white; 8/10 on kraft | 8/10 | 3/10 (black 1.11, blue 2.89, indigo 1.23) | 5/10 |
| Other a11y notes (computed) | ink on paper 16.73; lilac vs paper 1.65, so lilac can't be a focus ring (ink ring needed); grey #8A8492 on paper 3.38: disabled only, secondary text needs a darker grey | oxblood on label 9.54; ink on kraft 6.51 (text OK on kraft, packages never) | segment on LCD 7.68; lilac buttons on shell 1.86: decoration only; pixel Cyrillic at small sizes and integer scaling vs a 200% UI scale (C15) | tube white on velvet 13.42; dark UI over dark levels relies on the glow; flicker is a photosensitivity risk (C1) | ink on cream 13.95; pastel field edges 1.12 vs cream need borders; shape-coded teams are the most colour-blind-safe |
| Implies a setting | no | yes (courier) | no | mild (bar) | yes (workplace) |
| Cliché risk | medium (neo-brutalist web trend, [NN/g](https://www.nngroup.com/articles/neobrutalism/)) | low | low-medium (gimmick fatigue) | medium (synthwave) | medium (corporate-safety humour common in co-op games, unconfirmed) |
| Cost (L1) | medium | medium-high (textures) | medium, art-heavy | low-medium | high (illustration) |

Rule that follows from the table: with either palette, **every direction needs the two-ring keyline (C5)**. No panel
colour shows all ten dots. The symbol ink per fill is fixed per colour, not per direction (computed for Hand A: ink
on white, yellow, orange, red 4.64, sky, green, pink; white on black, blue 5.19, indigo).

### 3.3 Which to build first, and why

Build four interactive pages, in this order:

1. **D1 Sticker Bomb**: the loudest cringe-fun look. It has light opaque panels (the best readability over 3D) and is
   mostly tier A. It is the safest of the bold options.
2. **D4 Karaoke Night**: the only dark direction and the cheapest in Godot (nearly pure tier A). Its motif, the
   karaoke wipe, ties straight to proximity voice. It gives the humans a real light-versus-dark choice.
3. **D2 Parcel Post**: the most original direction, diegetic to the Delivery task. Build it only if H2 allows the
   UI to hint at a setting. Mock it in its "light" form: courier flavour in the big moments (badge, manifest,
   receipt) and a single plain label as the round HUD.
4. **D3 Pocket LCD**: the most unexpected and the riskiest for accessibility (8/10 dots under 3:1 on the LCD,
   pixel Cyrillic). A mock is the cheap way to find out whether it works. Build it as the fourth only if the humans
   want four (H1).

**D5 Safety Card** stays a wildcard on paper. It shares D2's setting risk and needs the most illustration, though
its shape-coded teams are the best colour-blind idea. That idea is kept as R3 in every direction.

---

## 4. Screen inventory and cross-cutting HUD rules

### 4.1 Inventory (L2's 16 screens, plus the accessibility settings from L6)

| # | Screen | Exists in client/ui | Biggest change | States to wireframe | Priority |
|---|---|---|---|---|---|
| 1 | Main menu + first launch | yes (no name, no version) | name, version, player-word error banner, one-time strip: name, language, mic check | first launch, returning, after an error, `cannot_host` | MVP |
| 2 | Connecting | yes | target address, elapsed seconds, slow hint after 5 s, Cancel | connecting, slow, refused | MVP |
| 3 | Loading | yes | per-player ticks (public), one tip from content data | loading, someone slow, `load_deadline` | MVP |
| 4 | Lobby HUD | yes | roster chip (name, body-colour shape, ready, speaking ring), host join line, countdown 5..1 | alone, shortfalls, all ready, countdown, host vs client | MVP |
| 5 | Esc Lobby tab + colour picker | tab yes, picker no | 10 named body-colour swatches, taken = greyed with owner, join info + Copy | host vs client | MVP |
| 6 | Role screen (#175) | no | banner over the live world → chip (C7) | engineer, dissident with teammates, dissident alone, 0 dissidents, late RoleAssigned, respawn (no replay) | MVP |
| 7 | Round HUD | yes (text labels) | zones, crosshair prompt with symbol + name, mic chip, hands and belt, destination swatch + name, health only below full | empty hands, carrying, invulnerable, no mic | MVP |
| 8 | Tab task screen | yes | role + goal line, 10-chip delivery grid (from public `Station.done`), controls footer; hold or toggle | no tasks, all done, spectating, dissident | MVP |
| 9 | Downed / dead / spectate / respawn | yes (life panel) | big numbers, "Nobody can hear you", "The dead hear only the world around <name>", spectate bar with public hand and belt | nobody to watch, target leaves or dies, respawn while the menu is open | MVP |
| 10 | Esc menu (#169) | yes | Players tab, Settings tab, "The game keeps running", Leave/Quit labels | lobby vs round, host vs client | MVP |
| 11 | Settings: voice and audio | no | devices, mode (PTT, voice activation, toggle) and key, threshold, mic test meter, volumes, headphones advice | no device, PTT unbound | MVP |
| 12 | Settings: controls, accessibility, language, graphics | no | sensitivity, Tab toggle, then the L6 top ten (Accessibility tab), UK/EN; graphics later | 100% and 200% UI scale | a11y and language MVP-lite, rest later |
| 13 | End screen | yes | winning side, "You won"/"You lost", one-line reason (source needed), host button vs client "Waiting for the host" | engineers won, dissidents won (time, everyone left) | MVP |
| 14 | Errors | words only | player sentence + action per `EndReasons` id | one per id | MVP |
| 15 | Toasts | no | one stack under the clock, max 3, 4 s, public only | join, leave, host left, raised by, colour delivered | MVP-lite |
| 16 | Debug overlay | yes | out of the UI track (debug only, no tokens) | n/a | none |

### 4.2 Cross-cutting HUD rules

1. **Zones** (named like anchored Godot containers): top-centre clock, shared progress and role chip; centre a dot
   crosshair with the prompt under it ("[E] Pick up ● Red package", symbol + name); bottom-left the mic chip;
   bottom-right hands, belt and the destination (swatch + symbol + name); screen edge the hurt vignette; top-centre
   below the clock the toast stack. (L2)
2. **Quiet HUD.** No idle animation except the destination marker and the downed vignette (L5). No textures in the
   round HUD, so every direction degrades to plain StyleBoxFlat (L1).
3. **Plates.** Every HUD text sits on an opaque panel or a black backplate ≥ 60% (70% default), measured against
   the worst-case world pixel; display text gets an outline (L6, XAG 102).
4. **Sizes.** The C9 scale; numbers use tabular figures; caps only for 1 to 3-word titles (L4, L6).
5. **Colour never alone.** Package: circle + symbol + name. Body: non-circle shape + name (R2, R7).
6. **Live bindings.** Every key hint is a keycap that reads the current binding; nothing hard-codes "E" or "Tab"
   (L6).
7. **Voice.** The own mic chip always shows the true state; speaking cues come only from audio the listener hears;
   no global talking list (L2).
8. **Privacy.** No other player's role anywhere except a dissident's own teammates; spectate shows only
   "Spectating <name>" and the target's public hand and belt; toasts only public events; role and private-event
   sounds identical across teams (L2, L5, `client/CLAUDE.md`).
9. **Health and harm.** The health bar appears only below full; the hurt and downed vignettes fade, never flash; no
   full-screen red flash; ≤ 3 flashes per second anywhere (L2, L6, WCAG 2.3.1).
10. **Input first.** No screen waits for its animation before taking the next key (L5).
11. **Esc does not pause.** It says so (L2).
12. **Ukrainian first.** Each component has a length budget for the longest UA string; wrap or ellipsis, never
    overflow (L4).
13. **Frames.** 1920×1080 reference, also 1280×720, 2560×1080, 1920×1200 and 200% UI scale (L3, L6).

### 4.3 Questions the screens depend on (for the designer or the engineer, not style)

- Designer: are roles revealed at the end? Are knockdowns and deaths announced in toasts? Can there be fewer than
  10 package colours? What is the body palette (#73)? A practice package and circle in the lobby level? The role
  goal lines and the loading tips are content data.
- Engineer: where does the end screen's reason come from (no field seen in `ClientModel`)? Can the client read its
  own LAN address (Godot `IP`, not checked)? Should the host's version be sent in `Rejected` (a wire change)? A
  per-speaker received level for speaking cues, and a voice input mode and mute action (none in `project.godot`
  today, L2).

---

## 5. Design system plan

### 5.1 Token tiers and naming

Format: DTCG 2025.10 Format + Color + Resolver ([format](https://www.designtokens.org/tr/2025.10/format/),
[color](https://www.designtokens.org/tr/2025.10/color/), [resolver](https://www.designtokens.org/tr/2025.10/resolver/)).
Files are `.tokens.json`. Dimensions are `px` only and durations `ms`. Colours are `{colorSpace: "srgb",
components, alpha, hex}`, so `srgb` 0..1 maps 1:1 to Godot `Color`. Name segments are kebab-case; the exact
character rules are unconfirmed (L3).

| Tier | Examples | Who uses it |
|---|---|---|
| Primitive (per direction, no meaning) | `color.palette.ink.900`, `space.1..10` (4 px steps), `radius.0..4`, `size.font.100..900`, `motion.duration.fast`, `motion.ease.pop` | semantic tokens only |
| Semantic (meaning) | `color.surface.hud / menu / card / shade / backdrop`, `color.text.primary / secondary / on-accent / hud`, `color.text.outline-hud`, `color.accent`, `color.focus`, `color.state.danger / warn / ok`; game domain: `color.package.<id>` and `color.package.<id>.on` (symbol ink), `color.body.<id>`, `color.team.engineers / dissidents` (lightness only, C12), `color.life.downed / dead / invulnerable`, `color.voice.talking`; `a11y.text.min` 18, `text.body` 20, `text.hud` 24, `backplate.opacity` 0.7 | screens and components |
| Component (only where it differs) | `component.button.primary.hover.background`, `component.key-cap.border`, `component.swatch.ring.outer / inner`, `component.player-chip.talking.ring`, `focus.ring.width` 3 | one component |

- `color.package.*` and `color.body.*` **mirror game content** (`content/tasks/delivery.tres`, designer-owned).
  prime-game later gets a test that fails when the two copies differ. The UI repo never owns gameplay colours.
- **Non-colour metadata.** DTCG 2025.10 has 13 types and none of them is a string (L3's confirmed list). So colour
  names live in the copy deck under translation keys (`package.colour.<id>.name`, UK and EN), and the symbol asset
  path goes in `$extensions` under a reverse-domain key (`io.github.xperiaroco2.prime-game-ui`). A CI gate checks
  that every package and body token has a name key, a symbol and an `.on` colour.

### 5.2 Modes (resolver modifiers)

| Modifier | Contexts | In mockups | Later in Godot |
|---|---|---|---|
| `direction` | `d1`, `d2`, `d3`, `d4` | `[data-direction]` switcher; the losing directions are deleted after the choice | one generated theme |
| `textSize` | `default`, `large` | switcher | a second generated text-size set or theme |
| `contrast` | `default`, `high` (7:1, stronger plates and outlines) | switcher | a second generated theme; default from `DisplayServer.accessibility_should_increase_contrast()` (platform support unconfirmed) |
| `motion` | `default`, `reduced` | follows `prefers-reduced-motion` plus a toggle | the generated `UiMotion` class carries both sets; one runtime flag picks one |
| `colorVision` | `default` only at first; `red-green`, `blue-yellow` later if playtests need them (C4) | reserved | would also recolour 3D packages and circles (game code); names and symbols never change |

**UI scale is not a token mode.** At runtime it is `Window.content_scale_factor` (in the API dump), from 75 to 200%.
Mockups get a scale toggle, and every wireframe is reviewed at 100% and 200%.

### 5.3 The Godot-safe CSS subset

From L3 §4, with L1, L4 and L6 additions. All Godot names were checked by the lenses in the 4.7.2 API dump unless
marked otherwise.

| CSS in a mockup | Tier | Godot 4.7.2 | Note |
|---|---|---|---|
| `background-color` (solid, rgba) | A | `StyleBoxFlat.bg_color` | |
| `border-width` per side, **one** `border-color`, solid | A | `border_width_*`, `border_color` | no per-side colours, no dashed or double |
| `border-radius` per corner, px | A | `corner_radius_*` (int) | a circle = radius at half the size |
| one outer `box-shadow` with blur, no spread | A | `shadow_color`, `shadow_size`, `shadow_offset` | fall-off differs from CSS (unconfirmed); compare in the showcase |
| hard offset "sticker" shadow (`4px 4px 0`) | A | **write it as thicker right and bottom borders** | `shadow_size` 0 likely draws nothing (unconfirmed) |
| `padding`, flex `gap` | A | `content_margin_*`, `MarginContainer`, `BoxContainer.separation` | grid separations' names unconfirmed |
| `transform: skewX()` on a box | A | `StyleBoxFlat.skew` | the box only; never skew text |
| `transform: rotate()/scale()` on set pieces | A | `Control.rotation`, `scale`, `pivot_offset_ratio` | containers ignore scale; `offset_transform_*` behaviour in containers unconfirmed |
| `opacity` | A | `modulate.a` / `self_modulate.a` | |
| `color`, `font-size` px, `font-family`, weight | A | `font_color`, `font_size`, Font, `FontVariation.variation_opentype` | |
| `letter-spacing`, `word-spacing` px | A | `FontVariation.spacing_glyph`, `spacing_space` | |
| `line-height` | A | `line_spacing` = **extra px**, not a multiplier | the generator converts |
| `tabular-nums` | A | `FontVariation.opentype_features` `tnum` | |
| one text outline | A | `outline_size`, `font_outline_color` | |
| one `text-shadow` | A | Label only: `font_shadow_color`, `shadow_offset_x/y` | Button has no shadow item |
| up to **two stacked outlines + one shadow** on display text | A | `LabelSettings` stacked outlines and shadows | Label only, a generated resource |
| `text-transform: uppercase`, ellipsis, wrap, align | A | `Label.uppercase`, `text_overrun_behavior`, `autowrap_mode`, alignment | no auto-shrink |
| `overflow: hidden` (rectangle) | A | `Control.clip_contents` | |
| `:hover :active :disabled :focus-visible :checked` | A | Button's styles `normal`, `hover`, `pressed`, `hover_pressed`, `disabled`, `focus` | only on controls that have the state in Godot |
| simple transitions and keyframes | A | `Tween` with a (TransitionType, EaseType) pair from the nine-easing table | no cubic-bezier in Tween |
| gradients (linear, radial, conic) | B | `StyleBoxTexture` + `GradientTexture2D` | loses rounded corners and borders unless baked |
| `border-image`, stickers, torn paper, tape | B | `StyleBoxTexture` 9-slice, `NinePatchRect` | declared asset with a credits entry |
| check marks, slider knobs, icons, symbols, mouse glyphs | B | SVG → texture (`DPITexture`) | Godot-safe SVG rules |
| radial progress (hold ring, respawn ring) | B | `TextureProgressBar` `FILL_CLOCKWISE` | ring texture |
| radial vignette | B | `TextureRect` + `GradientTexture2D` `FILL_RADIAL` | no shader needed |
| shape masks | B | `clip_children` with a mask texture | |
| `backdrop-filter`, `filter`, `drop-shadow()`, `inset` or multiple box shadows, `spread`, per-side border colours, dashed/dotted borders, `clip-path`, blend modes, gradient-filled text, `rem/em/vw/%` inside components, CSS grid areas, animated gradients, `position: sticky`, variable-axis animation | C | shader, code or not possible | **forbidden in mockups** |

### 5.4 Components

**Godot base controls** (theme items from the 4.7 class reference, L3): Button (`primary`, `secondary`, `ghost`,
`danger`, `tab`, `icon`; `large` only where needed), Label (`display`, `title`, `body`, `caption`, `hud`,
`key-glyph`, `mono-number`), LineEdit, CheckBox (tier B icons), HSlider (tier B grabbers), ProgressBar,
TabContainer, Panel/PanelContainer (`hud`, `life`, `task`, `menu`/`modal`, `card`, `shade`, `backdrop`), Tooltip
(theme type names from stable docs, unconfirmed), and OptionButton/PopupMenu, CheckButton, ItemList, ScrollBar,
AcceptDialog (item names not checked: gap).

**Game components:**

| Component | Variants and states | Notes |
|---|---|---|
| Package swatch | S (HUD), M (Tab), L (marker); 10 colours | circle, two rings (C5), symbol in `.on` ink, name beside it |
| Body-colour chip | 10 colours; taken, own | non-circle shape + name (R7) |
| Keycap / key prompt | tap, hold (ring), disabled; E Q X G F Tab Esc, LMB/RMB | reads the live binding; the text inside meets the 18 px floor |
| Player chip | lobby: ready, not ready, host; round: talking, muted, downed, dead | never shows a role |
| Mic chip | open, PTT idle, transmitting, no microphone, nobody can hear you | from the client's own voice state |
| Speaking indicator | over the head, off-screen edge arrow | only from received audio |
| Item slot | left, right, belt; empty, filled, active, package | |
| Task row and delivery grid | in progress, done | from public state |
| Destination marker | on screen, edge-clamped arrow, through walls | symbol inside |
| Countdown and timer | lobby 5..1, round clock (last 10 s pulse), respawn 30 s, invulnerability 3 s | time from host data, `tnum` |
| Life banner | downed (bleed-out bar, give-up hold), dead/spectating, invulnerable | no target health or role |
| Role card / banner | engineers, dissidents (+ own teammates) | banner → chip |
| Toast | info, success, warning | public events only, max 3 |
| Settings row | slider, toggle, option, key binding | |
| Confirm dialog | Leave, Quit | `danger` button |
| Focus ring, HUD backplate, hold-progress ring | a11y primitives, each with a reduced-motion variant | |

### 5.5 Tooling in prime-game-ui (all zero-dependency node 20)

1. `tools/build-tokens.mjs`: resolves aliases and `$ref`, detects cycles, checks types and applies resolver
   contexts. It emits `dist/tokens.css` (`[data-direction]` and mode blocks, `cubic-bezier()` plus exact `linear()`
   easings) and `dist/tokens.<context>.resolved.json`. Tests use `node:test`.
2. `tools/lint-css.mjs`: a tier property allowlist and value patterns, token-only values (except 0 and 1px), output
   as `file:line`. Plus `web/safe-check.js` on every page: it outlines violations in red and tier-B elements dashed
   (`?tier=b`), so they are visible on the phone.
3. `tools/a11y-gate.mjs`: ported from L6's `cvd.js` and `contrast.js` and this synthesis's script.
   - Text pairs pass their contrast floor.
   - The outer swatch ring is ≥ 3:1 against every panel, and the symbol ink is ≥ 4.5:1 against its fill.
   - Palettes reach ΔE00 ≥ 10 under protan, deutan and tritan simulation, and ≥ 20 in normal vision.
   - Every coloured component has a symbol or a text field.
4. `tools/font-check.mjs`: cmap and GSUB checks for Ukrainian codepoints and `tnum` on `assets/fonts/**`.
5. `tools/credits-check.mjs`: every file under `assets/` matches a `docs/credits` entry glob and has its licence
   file next to it.

### 5.6 Repo layout (L3 §7, extended)

```
tokens/primitives.tokens.json   tokens/directions/{d1,d2,d3,d4}.tokens.json   tokens/components.tokens.json
tokens/modes/{text-size,contrast,motion}/*.tokens.json   tokens/prime.resolver.json
tools/*.mjs   web/{safe-check.js,stage.js,blip.js}   dist/ (built)
pages/ (artifact pages: references, flows, wireframes, mocks, specimen, motion lab, showcase)
copy/deck.csv (translation keys, uk, en, notes)   assets/{fonts,icons,symbols,sounds}/ + licence files
docs/research/ docs/rules.md docs/godot-safe-css.md docs/components.md docs/decisions/ docs/credits/
```

### 5.7 Tokens → Godot Theme (later, prime-game, engineer-owned)

- A **headless GDScript generator** (`tools/theme/build_theme.gd`, run through the runner). It reads
  `client/ui/theme/tokens.resolved.json` and an engineer-owned mapping table (component token → base type,
  variation, item). It builds the Theme through the real 4.7.2 API and validates item names against
  `ThemeDB.get_default_theme()` lists, which the API dump does not contain. It saves with `ResourceSaver`; whether
  `uid://` is kept is unconfirmed and must be verified. A GdUnit staleness test guards it.
- Type variations are named `<Component><Variant>` in PascalCase, with states as items inside them.
  `LabelSettings` resources are generated for display text.
- Motion floats go into a generated `UiMotion` GDScript class, because `Theme.set_constant` holds ints only.
- Data colours (body chip, package swatch) need an explicit allowance under `client/CLAUDE.md`'s theme-only rule,
  using `self_modulate` or `ColorRect`, and its source test must be updated by the engineer.
- Alternatives not taken: Python writing `.tres` text (no engine check of names), ThemeGen (a new addon, MIT, and
  its source of truth is GDScript, not our tokens), and a hand-made theme (it drifts).

---

## 6. Risks and mitigations

| # | Risk | Mitigation |
|---|---|---|
| 1 | Colour-blind players cannot match packages (red/brown 2.7, blue/purple 3.2 to 6.0, computed) | symbols + names always on; Hand A or fewer colours (H7); CVD gate in CI; colour-blind playtesters |
| 2 | Lighting and shadow change 3D package colours; black vanishes in shadow, white in light | emissive or unshaded symbol decals; circle posts; later simulate real level screenshots (engineer's `shot`) |
| 3 | Players think their mic broke when downed or dead | mic chip "Nobody can hear you"; dead-screen line; a loading tip |
| 4 | A speaking cue or list shows voices the listener cannot hear (defeats proximity voice, leaks) | cues only from received audio; no global list |
| 5 | Body and package palettes collide ("the red one") | separate body palette, non-circle shape, names (H8, R7) |
| 6 | Mockups promise what Godot cannot draw cheaply | tiers A/B/C, lint, in-page checker; a later Godot probe (PG-1) for hard shadows, stacked outlines, tilt in containers, SVG rendering |
| 7 | Text renders differently in browser and Godot (line height, hinting, outlines, shadow fall-off) | same font files; generator converts line height; side-by-side showcase shots |
| 8 | Ukrainian strings overflow (no auto-fit in Label) | UA-first mocks, per-component length budgets, later pseudolocalization test |
| 9 | A display font lacks ґ, ʼ or № | font-check script before adoption; explicit fallback to the UI font |
| 10 | Licence contamination in public repos (Sonniss, CC BY-SA, NC, RFN subsetting, missed CC BY credits) | allowed-licence list; credits check in CI; never subset; per-batch human approval |
| 11 | Over-juiced UI tires players or hides information; flashes harm photosensitive players | loud-on-rare rule; no idle HUD loops; ≤ 3 flashes/s; fades not flashes; reduced motion |
| 12 | Countdown and hold visuals drift from host time | rule times from host events; motion only decorates |
| 13 | Team-specific sounds leak through open mics | one role sting; identical private-event sounds |
| 14 | A direction implies a setting (D2, D5) before the setting is chosen | H2; D2 in its light form only |
| 15 | Illustration-heavy directions exceed a two-person team | cost scored on the comparison page; texture-free HUD; illustrator money is H21 |
| 16 | Neo-brutalism (D1) reads as a web startup; neon (D4) as synthwave cliché | anchor each in a game motif; ban grids, sunsets, magenta-cyan |
| 17 | Mean cringe pushes away an audience that is not only guys | the joke is on the situation, never on a player; tone sampler (H10) |
| 18 | A unit mismatch (XAG body height at 1080p vs Godot em size on a 1152×648 base) misreads sizes by about 40% | all tokens px at 1920×1080; the generator owns conversion; verify with a pixel-measured `shot` |
| 19 | Phone review cannot judge hover feel, small HUD text at 1:1, or the audio mix | scale-to-fit stage with tap-to-zoom and 1:1 crop; hover as a toggled state; one desktop check at the choice step |
| 20 | Settings scope creep delays voice settings | MVP order: voice and audio first; reserve the Accessibility tab's space now |
| 21 | DTCG 2025.10 tooling still moving | own small build script supporting only what we use |
| 22 | The OS accessibility hints may not work on Windows | use them only as first-launch defaults; the in-game setting wins |

---

## 7. Decisions for the humans

Only style, look, texts, money and subscriptions are listed here. The engineer and the designer are both "the
humans". Colour palettes are also the designer's content. Each item has options, a recommendation and the reason.

### 7.0 Permissions to give first (the human reserved these separately)

- **P1. Create the public repo `xperiaroco2/prime-game-ui`.** A separate yes.
- **P2. May mockup pages load fonts from the Google Fonts CSS API in the viewer's browser?** No file enters the
  repo and no agent downloads anything; the browser fetches the font when the page is opened. *Recommendation: yes*,
  since it is the only way to compare typefaces on the phone before any download batch.
- **P3. Download batches, each asked separately later:** fonts for the chosen direction (Fixel early only if
  pairing D is wanted), the MIT icon set, Kenney Input Prompts (mouse glyphs), and Kenney UI sound packs.
  *Recommendation: none before the direction is chosen.*

### 7.1 Needed before the style mocks (wave C)

1. **Which style directions become interactive mock pages?**
   - Options: (a) D1 + D2 + D3 + D4; (b) D1 + D3 + D4; (c) all five; (d) another mix.
   - *Recommendation:* (a), built in the order D1, D4, D2, D3, with D5 kept on paper.
   - *Why:* four clearly different looks give a real choice (loud handmade, dark and voice-linked, diegetic,
     retro-toy). D5 costs the most illustration and shares D2's setting risk.
2. **May the UI hint at a setting (a courier firm, a workplace, a bar) before the game's setting is chosen?**
   - Options: yes; only lightly (flavour in big moments, neutral HUD); no.
   - *Recommendation:* only lightly.
   - *Why:* the team names are provisional until the setting is chosen, and a strongly diegetic UI would be rebuilt
     if the setting changes. If "no", D2 drops out and three directions are built.
3. **Chrome colour.**
   - Options: neutral chrome, so packages are the only saturated colour; one pale hero tint (lilac, mint); one
     saturated brand colour.
   - *Recommendation:* neutral chrome plus at most one pale tint.
   - *Why:* the ten packages already cover the hue wheel, so any saturated brand colour collides with one of them.
     A pale tint still cannot be a focus ring on its own (lilac on paper measures 1.65:1).
4. **How far beyond flat panels may a direction go?**
   - Options: A, flat only (solid colours, borders, rounded or slanted corners, one soft shadow, outlined text);
     B, flat plus textures (gradients, sticker or torn edges, drawn icons), each a licensed or self-made asset;
     C, anything, including blur, glow and animated shader effects (engineer shader work).
   - *Recommendation:* B, with at least one direction staying nearly pure A (D4 is).
   - *Why:* the cringe-fun looks need stickers and outlines. Textures cost assets but little engine work, while
     shaders cost engineer time and frame time.
5. **Colour symbols on packages, circles and swatches.**
   - When shown: always; only in a colour-blind setting; never.
   - Style: our own simple rotation-safe shapes; easy-to-remember pictures (drop, leaf, sun); ColorSym's open
     system (CC BY-SA, must credit, no cyan).
   - *Recommendation:* always, and our own simple shapes, with a picture-like link only where it comes naturally
     (drop for sky, leaf for green).
   - *Why:* colour-blind players match packages without opening a menu, there is one look to design and test, and
     there is no licence question. Packages rotate, so shapes must read from any side.
6. **Colour names on screen.**
   - Options: always next to swatches and on nameplates; only with an option on (like Among Us); swatches always,
     nameplates optional.
   - *Recommendation:* always on package swatches and on the Tab screen; nameplate names on by default with an
     option to hide them.
   - *Why:* players say colours aloud in voice chat, so the name is the shared vocabulary. Ukrainian already
     separates блакитний (light blue) from синій (blue).
7. **Package colours (look, and the designer's content).**
   - Options: keep the current hues and add symbols and names; adopt "Hand A" (white, black, yellow, orange, red,
     sky, blue, green, pink, indigo) with symbols and names; fewer package colours (6 to 8) with symbols and names.
   - *Recommendation:* Hand A with symbols and names, and ask the designer whether 8 or fewer packages would work.
   - *Why:* in the current palette red/brown and blue/purple nearly merge for the most common colour blindness,
     while Hand A has no confusable pair in any simulation (computed). The mocks can show both palettes through a
     toggle until this is decided.
8. **Body colours.**
   - Options: the same palette as packages; a separate set; the same hues with patterns.
   - Where to pick: a menu row in the Esc Lobby tab now; an in-world mirror or wardrobe later.
   - *Recommendation:* a separate set, checked by the same script, drawn as a non-circle shape with its name.
     Pick from the menu now and in-world later.
   - *Why:* sharing the set makes "the red one" mean both a player and a package. The menu is cheap, and the
     in-world picker adds lobby fun once the designer's lobby exists.
9. **HUD text over the 3D world.**
   - Options: a dark backplate (70% by default); outlined text without a plate; a plate by default, with
     outline-only as a player option.
   - *Recommendation:* a plate by default, which players can make more opaque.
   - *Why:* only a plate of 60% or more guarantees 4.5:1 over any wall, including a white one.
10. **Tone of the texts.**
    - Options: plain everywhere; playful everywhere; plain for instructions and errors with one playful line on
      the moments (role, death, end).
    - Flavour: warm and self-deprecating; deadpan bureaucratic; a cheeky roast of the situation.
    - *Recommendation:* plain for instructions and errors, plus one playful line on the moments. The flavour is
      warm and self-deprecating, with deadpan for system lines, and never mocks a player. Pick from a tone
      sampler page (the same 12 strings in three tones, in UA and EN).
    - *Why:* errors and controls must be understood at once in both languages, the moments are where cringe-fun
      lands, and a mean tone pushes away an audience that is not only guys.
11. **Role reveal size (#175).**
    - Options: a full-screen card that blocks input for about 3 s; a big banner over the live world, then a chip;
      only a chip.
    - *Recommendation:* the banner, then the chip.
    - *Why:* roles are not a protected secret, and a blocking card is unfair at the round's start.
12. **Capital letters in titles.**
    - Options: caps only for short titles of 1 to 3 words; all titles in caps; no caps.
    - *Recommendation:* caps only for short titles. This changes #175's all-caps line ("YOU ARE IN THE ENGINEERS'
      TEAM") into a short cap title plus a sentence-case line.
    - *Why:* long Ukrainian caps lines get very wide, and the accessibility guidelines ask for sentence case on
      lines of text.

### 7.2 At or after the direction choice

13. **Typeface personality.**
    - Options: A, Unbounded + Onest (loud); B, Nunito + Rubik Bubbles (soft and warm); C, Dela Gothic One + Golos
      Text + Oswald (poster); D, Fixel Display + Text (Ukrainian-made) + Climate Crisis as a timer joke.
    - *Recommendation:* compare all four on a specimen page with real game strings in UA and EN, then pick
      together with the direction. B is the warmest for an audience that is not only guys; A is the loudest.
    - *Why:* the typeface changes the feel of every screen. D needs a download batch even to preview.
14. **Drop Russo One and e-Ukraine from the list?**
    - Options: drop both; keep Russo One; keep e-Ukraine after asking the Ministry about its licence.
    - *Recommendation:* drop both.
    - *Why:* by its own description Russo One's name means "Russian", and e-Ukraine has no licence of its own and
      is a state brand.
15. **Which Ukrainian apostrophe?**
    - Options: ʼ (U+02BC); ’ (U+2019).
    - *Recommendation:* ʼ, used consistently.
    - *Why:* it is a text choice, and the glyph check must test the one we pick.
16. **Icons and key prompts.**
    - Icons: own signature icons plus one MIT set (hybrid); everything from one set; game-icons.net style (credits
      per author); everything drawn ourselves.
    - Key prompts: our own keycap; Kenney art.
    - *Recommendation:* the hybrid, plus our own keycaps with Kenney art only for the mouse buttons.
    - *Why:* the signature icons carry the game's identity, and keycaps follow the style, scale with text and
      survive key rebinding.
17. **Motion personality.**
    - Options: bouncy everywhere; snappy "TV game show"; calm, mostly fades; a mix (big and bouncy only on rare
      moments, snappy on menus and the HUD).
    - *Recommendation:* the mix.
    - *Why:* the set pieces carry the cringe-fun, while fast frequent motion does not tire players.
18. **UI sound.**
    - Character: chiptune blips; Kenney clean clicks; comedic foley (kazoo, squeaks, "ta-da"); Kenney clicks for
      menus plus homemade stings.
    - Role sting: the same for both teams, or different.
    - Round end: one sting for everyone, or win and lose sounds.
    - *Recommendation:* Kenney clicks plus homemade stings; the same role sting for both teams; separate win and
      lose sounds.
    - *Why:* the clicks are licence-clean, the homemade stings are unique and free, a team-specific sting could
      leak through an open mic, and once the round ends the result is public.
19. **End screen content.**
    - Options: only "The <side> won"; plus "You won" or "You lost" and a one-line reason; plus everyone's role
      revealed (also the designer's call).
    - *Recommendation:* add "You won" or "You lost" and a reason, and ask the designer about revealing roles.
    - *Why:* a personal result and a reason make the ending land and teach why the round ended.

### 7.3 Money, subscriptions, licence

20. **Paid tools and assets** (fonts, icons, sound packs, token tools, Figma, Tokens Studio Pro).
    - Options: free only; case by case with your approval.
    - *Recommendation:* free only.
    - *Why:* everything found is free, #150 already decided against Figma, and paid packs usually forbid
      redistribution, which a public repo cannot honour.
21. **An illustrator** (pictograms, stickers, pet sprites).
    - Options: no money, agent-made SVG only; a small budget after the choice; decide after seeing the mocks.
    - *Recommendation:* decide after the mocks, and mock with simple shapes until then.
    - *Why:* D5, D2's textures and D3's sprites depend on illustration quality.
22. **The licence of prime-game-ui's own work in a public repo.**
    - Options: no licence file (all rights reserved, view only; the same as prime-game today, which has no
      `LICENSE` file, checked); an open licence (for example MIT for the tools, CC BY for the art); mixed.
    - *Recommendation:* no open licence for now, the same as prime-game, and revisit before release. Own assets
      get credits entries naming "prime-game team, all rights reserved".
    - *Why:* the look is the game's identity. Note that "no licence means all rights reserved" is from memory of
      GitHub's docs (unconfirmed).

---

## 8. Technical decisions the manager can take now

- **T1. Token format.** DTCG 2025.10 Format + Color + Resolver; `.tokens.json`; px and ms; srgb with hex. *Why:*
  a stable vendor-neutral spec; px and srgb map 1:1 to Godot at the reference.
- **T2. Tiers and names.** Primitive → semantic → component, with game-domain semantic names. `color.package.*`
  (not `delivery`) and `color.body.*` mirror game content, kept apart from chrome. *Why:* the gates can then test
  every chrome colour against every package colour, and gameplay colours stay owned by content.
- **T3. Non-colour metadata.** Colour names go in the copy deck under translation keys. Symbol paths go in
  `$extensions` under a reverse-domain key. The symbol ink is a real colour token (`.on`). *Why:* DTCG 2025.10 has
  no string type.
- **T4. Modes are resolver modifiers.** `direction`, `textSize`, `contrast`, `motion`, plus `colorVision`
  reserved with `default` only. UI scale is a runtime factor, not a token mode. *Why:* one wireframe renders in
  every direction and mode, and the colour-vision presets wait for evidence (C4).
- **T5. No token, lint or font packages.** Zero-dependency node 20 scripts. Terrazzo (MIT) is the first fallback if
  ever needed, and needs the human's yes as a dependency. *Why:* Style Dictionary's 2025.10 support is still a work
  in progress, and every package is a stop-and-ask dependency.
- **T6. Godot-safe CSS tiers A/B/C** as in §5.3, enforced by a lint and an in-page checker. Display text may use
  up to two stacked outlines and one shadow. Hard shadows are drawn as borders. *Why:* every approved mock then
  ports without a redesign.
- **T7. Reference frame and checks.** 1920×1080 px. Also checked at 1280×720, 2560×1080, 1920×1200 and 200% UI
  scale, over three CSS-drawn placeholder backdrops (bright, dark, busy). No images and no Godot. *Why:*
  readability over 3D is the first filter, and placeholders keep the track out of the engine.
- **T8. Accessibility gates.**
  - Contrast uses the WCAG 2.x ratios (4.5, 3, 7); APCA is information only.
  - Colour blindness uses Machado 2009 with CIEDE2000 (≥ 10 under protan, deutan and tritan; ≥ 20 normal).
  - Swatches: outer ring vs panel ≥ 3:1, and symbol ink vs fill ≥ 4.5:1.
  - Backplate ≥ 60%, 70% by default.
  - *Why:* the WCAG 3 draft has no contrast method yet. The scripts already exist and caught the palette failures.
- **T9. Package swatch component.** A circle with two rings, the outer ring taking the opposite lightness of the
  panel, the symbol in `.on` ink, and the name beside it. *Why:* it resolves C5, it is Godot-safe, and it passes
  for every fill (computed).
- **T10. Motion.**
  - The nine-easing table, with the Godot pair as the source of truth in `$extensions`.
  - CSS gets `cubic-bezier()` plus an exact `linear()` from a JS Penner port.
  - Durations scale as instant 0, xfast 80, fast 120, base 200, slow 320, slower 480 and beat 200 ms, plus loops
    of 900, 1200 and 4000 ms.
  - Rule times are never tokens, and a reduced-motion set exists.
  - *Why:* mocks and game move the same way.
- **T11. Mockup sound.** Our own small WebAudio blip function, not inlined ZzFX. *Why:* no third-party code needs
  to be fetched (C14).
- **T12. Fonts in mocks.** Specimen and mock pages load candidates through the Google Fonts CSS API (needs P2).
  Wireframes use Balsamiq Sans. After the choice, variable TTFs come from google/fonts at a pinned commit, in one
  approved batch, never subset. *Why:* no download before the choice, and the OFL and RFN rules.
- **T13. Icons.** Monochrome white SVG on a 24 or 32 grid, paths only, for later `DPITexture` import. The MIT set
  is chosen at batch time per H16. *Why:* one file serves every state, within ThorVG's limits.
- **T14. Credits.** prime-game's `docs/credits` field format plus Reserved Font Name, Retrieved, Modified,
  Attribution and Ukrainian check. The licence file sits next to each asset, and CI checks it.
  - Allowed: CC0, OFL, MIT, ISC, Apache-2.0, own.
  - Excluded: CC BY-SA, NC, Sonniss, and anything unclear.
  - *Why:* entries move into prime-game unchanged at port time.
- **T15. Strings.** Every player-facing string gets a translation key in `copy/deck.csv` (uk, en). Agents draft
  and the humans approve the wording. *Why:* Ukrainian is first-class, and keys added later would touch every
  screen twice.
- **T16. Voice cues.** Speaking cues come only from received audio, and the mic chip has five states. This is
  written as a spec in the UI repo, and the engine work is a later prime-game issue. *Why:* it keeps proximity
  voice honest and leaks nothing.
- **T17. Wireframe zone names** match anchored Godot containers (top-centre, bottom-left, ...). *Why:* the port
  maps one-to-one.
- **T18. Godot Theme generator** (later): headless GDScript, ThemeDB name validation, `ResourceSaver`, a staleness
  test, an engineer-owned mapping table, `<Component><Variant>` variations, generated `LabelSettings` and a
  `UiMotion` class. *Why:* see §5.7.
- **T19. Base resolution.** Propose, in a prime-game issue, that the port moves the base to 1920×1080. *Why:* the
  Godot 4.7 docs recommend it, and mockup px then equal Godot px. The change itself is the engineer's.
- **T20. Review surface.**
  - Every deliverable is a private artifact page built for a phone: a scale-to-fit stage, tap-to-zoom, a 1:1 crop,
    switchers for direction, mode, frame, backdrop and language, hover shown as a toggled state, and safe-check
    overlays.
  - Feedback comes as artifact comments.
  - Each wave ends with a comment on #150 that links the pages.
  - *Why:* the human reviews from a phone.
- **T21. Repo layout** as in §5.6, and **T22. CI** runs the build, lint, gates, font check and credits check on
  every PR, with node 20 and no installs.

---

## 9. The process, concretized

| Step | Deliverable in prime-game-ui | Who decides | Phone review |
|---|---|---|---|
| 0. Bootstrap | repo (after P1), `CLAUDE.md`, README, CI, tooling (build, lint, gates, credits), page kit | manager (technical); human says yes to creating the repo | none needed; a #150 comment lists what exists |
| 1. References | `docs/research/` (six lens reports, links only, markers kept); `pages/references.html`: a reference board per screen family, links and short notes, no copied images | nobody (input) | artifact page; human comments what to keep or avoid |
| 2. Wireframes of every screen | `pages/flows.html` (inventory, flows, every error exit); `pages/wf-*.html`, one per screen family, greyscale and Balsamiq Sans, zones, all states, UA + EN, 100% and 200%, a motion row per moment; voice UX spec; copy deck draft; tone sampler | human approves the structure (layout is look); the designer is consulted on content (role lines, end reveal, death toasts); manager on technical states | each family is one page with a state switcher and tap-to-zoom; the human comments on the page, and the manager answers and revises |
| 3. 3 to 4 style directions | colour system page (symbols, swatch, current vs Hand A with simulated colour-blind views); type specimen; motion lab; the mock frame with the same five screens; one page per direction (D1, D4, D2, D3) with backdrop and frame switchers and the safe-check overlay | humans decide H1 to H12 before; nothing chosen yet | each direction page on the phone, plus one comparison page with scores (readability, gate results, tier cost, UA fit); one desktop check for hover and audio |
| 4. Choice | `docs/decisions/<date>-style-direction.md` (ADR): the chosen direction or hybrid, H13 to H19 answers, what is dropped | humans | the comparison page with a "chosen" marker; the decision is recorded on #150 |
| 5. Tokens and components | the filled tokens for the chosen direction and its modes, gates green; font batch 1 (after P3); own symbols and signature icons; keycap; `docs/components.md`; `pages/showcase.html` | manager (technical); humans approve the showcase's look | the showcase with direction, text-size, contrast and motion toggles, tap-to-zoom and 1:1 crop |
| 6. Screens | `pages/screen-*.html`: every screen family styled, all states, UA + EN, 200%, reduced motion; final copy approved | humans approve each family; manager checks the gates and the a11y checklist | one page per family; comments per state |
| 7. Handoff to prime-game | resolved JSON per context, mapping notes, credits entries, a list of engine requests | engineer (in prime-game) | the #150 comment links the prime-game issues |

---

## 10. Proposed issue breakdown

### 10.1 prime-game-ui (in order; "→" means depends on)

**Wave A: bootstrap and tooling** (needs only P1)

| Id | Title | Depends |
|---|---|---|
| UI-1 | Bootstrap: README, CLAUDE.md, layout, CI (node 20, no deps), templates, credits format | P1 |
| UI-2 | Research notes: the six lens reports as `docs/research/`, links only, markers kept; reference board page | UI-1 |
| UI-3 | Rules and baselines: R1 to R7, a11y numbers, HUD rules, privacy rules; the screen review checklist | UI-2 |
| UI-4 | Token build: skeleton tokens, resolver, `build-tokens.mjs`, tests | UI-1 |
| UI-5 | Godot-safe CSS: `docs/godot-safe-css.md`, `lint-css.mjs`, `safe-check.js` | UI-1 |
| UI-6 | A11y gates: contrast, CVD, swatch rule, symbol/text presence | UI-4 |
| UI-7 | Credits register and check | UI-1 |
| UI-8 | Page kit: phone stage, frames, CSS backdrops, switchers, safe-check, WebAudio blip | UI-4, UI-5 |

**Wave B: UX structure and wireframes** (no style decisions needed)

| Id | Title | Depends |
|---|---|---|
| UI-9 | Screen inventory and flows page (all states, every `EndReasons` exit) | UI-2, UI-8 |
| UI-10 | Copy deck skeleton (keys, UA + EN drafts, error words) and tone sampler | UI-9 → H10 |
| UI-11 | Voice UX spec: mic chip, speaking cues, downed and dead wording, mic test | UI-9 |
| UI-12 | WF: main menu, first launch, connecting, loading, errors | UI-9 |
| UI-13 | WF: lobby HUD, Esc Lobby tab, colour picker, countdown | UI-9 |
| UI-14 | WF: role screen (#175), round HUD, Tab task screen | UI-9, UI-11 |
| UI-15 | WF: downed, dead, spectating, respawn | UI-9, UI-11 |
| UI-16 | WF: Esc menu revision, Players tab, Settings (voice, controls, accessibility tab, language) | UI-9, UI-11 |
| UI-17 | WF: end screen and toasts | UI-9 |

**Wave C: style exploration** (needs H1 to H12)

| Id | Title | Depends |
|---|---|---|
| UI-18 | Colour system: 10 own symbols, swatch component, body chip, palette page (current vs Hand A, simulated views) | UI-6, UI-8 → H5 to H8 |
| UI-19 | Type specimen page (Google Fonts CSS API, UA first) | UI-8, P2 |
| UI-20 | Motion tokens and motion lab page | UI-4, UI-8 |
| UI-21 | Mock frame: the five fixed screens with identical content (+ lobby player card if time) | UI-14, UI-15, UI-17 approved |
| UI-22 | Direction mock D1 Sticker Bomb | UI-18 to UI-21 |
| UI-23 | Direction mock D4 Karaoke Night | UI-18 to UI-21 |
| UI-24 | Direction mock D2 Parcel Post (light form; only if H2 allows) | UI-18 to UI-21 |
| UI-25 | Direction mock D3 Pocket LCD (only if H1 picks four) | UI-18 to UI-21 |
| UI-26 | Comparison page and the style-direction ADR after the humans choose | UI-22 to UI-25 → H13 to H19 |

**Wave D: system** (after the choice)

| Id | Title | Depends |
|---|---|---|
| UI-27 | Font download batch 1 and the glyph and `tnum` check script | UI-26, UI-7, P3 |
| UI-28 | Tokens for the chosen direction and its modes; gates green | UI-26, UI-6 |
| UI-29 | Component inventory doc and showcase page | UI-28 |
| UI-30 | Icon inventory, own signature icons, MIT set batch, keycap component | UI-26, UI-7, P3 |
| UI-31 | UI sound list, placeholder blips, CC0 candidate batch list | UI-26, UI-20, P3 |

**Wave E: screens**

| Id | Title | Depends |
|---|---|---|
| UI-32 | Styled: menus, connecting, loading, errors | UI-29, UI-30, UI-12 |
| UI-33 | Styled: lobby HUD, Lobby tab, picker, countdown | UI-29, UI-30, UI-13 |
| UI-34 | Styled: role screen, round HUD, Tab | UI-29, UI-30, UI-14 |
| UI-35 | Styled: downed, dead, spectate, respawn | UI-29, UI-30, UI-15 |
| UI-36 | Styled: Esc menu and settings | UI-29, UI-30, UI-16 |
| UI-37 | Styled: end screen and toasts | UI-29, UI-30, UI-17 |

**Wave F: handoff**

| Id | Title | Depends |
|---|---|---|
| UI-38 | Port package: resolved JSON per context, mapping notes, credits, engine-request list for prime-game | UI-32 to UI-37 |

The first tasks to open are waves A and B. Waves C to F are opened after the humans' first answers.

### 10.2 prime-game, later (engineer-owned unless stated; none is part of this track's work)

| Id | Title | When |
|---|---|---|
| PG-1 | Spike: headless `shot` probe of a hard StyleBoxFlat shadow, LabelSettings stacked outlines, `offset_transform` tilt inside containers, shadow fall-off vs CSS blur, SVG via ThorVG as `DPITexture`, and the 2D blend colour space; report only, no theme change | any time; best before the direction choice |
| PG-2 | Allow data colours (`self_modulate`/`ColorRect`) and generated LabelSettings under the theme-only rule; a test that the token palettes equal content data | before PG-4 |
| PG-3 | Move the base resolution to 1920×1080 (with the generated theme) | with PG-4 |
| PG-4 | Theme generator from resolved tokens (headless GDScript), mapping table, staleness test, `UiMotion` constants | after UI-28 |
| PG-5 | Theme showcase scene and side-by-side shots | after PG-4 |
| PG-6 | Typography port: fonts, FontVariation per token, stacked-outline LabelSettings, fallbacks, `tnum`, pre-render configurations | after UI-27 |
| PG-7 | Icons as `DPITexture` and theme icons; credits moved over | after UI-30 |
| PG-8 | Translation keys and TranslationServer (UK, EN); pseudolocalization overflow test | after UI-10 |
| PG-9 | Player words and actions for `EndReasons` (optional: the host's version in `Rejected`) | after UI-10 |
| PG-10 | Engine: voice input mode (PTT, voice activation, toggle), mute action, client voice state, per-speaker received level | after UI-11 |
| PG-11 | Settings persistence and the voice and audio settings (devices, mode, threshold, mic test, volumes), then controls (sensitivity, remapping, hold or toggle) | after UI-16 |
| PG-12 | Accessibility settings: UI scale, text size, high contrast, reduced motion (OS default), FOV and head-bob, crosshair, mono, backplate opacity, reduce flashing | after UI-16, PG-4 |
| PG-13 | UI audio bus layout and the `UiSounds` player | after UI-31 |
| PG-14 | `UiMotion` helpers and the reduced-motion flag | with PG-4 |
| PG-15 | Package and circle symbols in 3D and the palette change (the designer's `delivery.tres` plus the engineer's emissive decals and circle posts) | after H7 and UI-18 |
| PG-16 | Speaking indicator over heads, off-screen arrow, captions for key sounds | after PG-10 |
| PG-17 | Set-piece motion: countdown, role reveal (#175), downed, respawn, end | after PG-14 |
| PG-18 | Screen port, one issue per screen family | after UI-32 to UI-37 |

Suggestions for the designer (their area, not our issues): a practice package and circle in the lobby level,
loading tips and role goal lines as content data, the end-of-round role reveal, death and knockdown announcements,
the number of package colours, and the body palette (#73).

---

## 11. Sources

Duplicates are merged. Every "(unconfirmed)" from the lenses is kept.

**prime-game repo (read live)**
- `docs/decisions/2026-10-01-vision-revision-1.md`, `docs/decisions/2026-09-29-voice-approach.md`, `content/tasks/delivery.tres`,
  `client/ui/theme/game_theme.tres`, `client/ui/*.gd`, `client/life/life_hud.gd`, `client/app/end_reasons.gd`,
  `client/net/client_model.gd`, `client/net/client_session.gd`, `net/messages/wire_schema.gd`, `project.godot`, `client/CLAUDE.md`,
  `docs/credits/gdunit4.md`, `tools/runner/credits.py`, issues #169 and #175
- Godot 4.7.2 API dump: `tools/out/godot-api/4.7.2/extension_api.json`

**Own computations (scratchpad, calculations not quotes)**
- L1 luminance script; L6 `a11y/cvd.js`, `a11y/cvd-output.txt`, `a11y/contrast.js`, `a11y/contrast-output.txt`, `a11y/api_check.js`;
  this synthesis `ux/synth_contrast.js` (assumes sRGB floats and sRGB blending: both unconfirmed for the engine)

**Godot 4.7 documentation**
- https://docs.godotengine.org/en/4.7/classes/class_styleboxflat.html
- https://docs.godotengine.org/en/4.7/classes/class_button.html , class_label.html , class_lineedit.html , class_checkbox.html ,
  class_slider.html , class_progressbar.html , class_tabcontainer.html , class_labelsettings.html , class_viewport.html ,
  class_projectsettings.html , class_control.html , class_tween.html , class_propertytweener.html , class_audioserver.html ,
  class_audiostreampolyphonic.html , class_audioeffectstereoenhance.html , class_displayserver.html (all under https://docs.godotengine.org/en/4.7/classes/)
- https://docs.godotengine.org/en/4.7/tutorials/rendering/multiple_resolutions.html
- https://docs.godotengine.org/en/4.7/tutorials/ui/gui_theme_type_variations.html
- https://docs.godotengine.org/en/4.7/tutorials/ui/gui_using_fonts.html
- https://docs.godotengine.org/en/4.7/tutorials/ui/bbcode_in_richtextlabel.html
- https://docs.godotengine.org/en/4.7/tutorials/assets_pipeline/importing_images.html
- https://docs.godotengine.org/en/4.7/tutorials/i18n/pseudolocalization.html
- https://docs.godotengine.org/en/4.7/tutorials/shaders/shader_reference/canvas_item_shader.html
- https://docs.godotengine.org/en/4.7/tutorials/audio/audio_buses.html
- https://docs.godotengine.org/en/stable/classes/class_control.html (tooltip theme types; stable, not 4.7: unconfirmed)
- https://raw.githubusercontent.com/godotengine/godot/master/doc/classes/DisplayServer.xml (platform list from master: unconfirmed for 4.7.2)
- https://raw.githubusercontent.com/godotengine/godot/4.5-stable/scene/animation/easing_equations.h (4.7.2 unchanged: unconfirmed)
- https://raw.githubusercontent.com/godotengine/godot-docs/master/img/tween_cheatsheet.webp

**Design tokens and tooling**
- https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/
- https://www.designtokens.org/ ; https://www.designtokens.org/tr/2025.10/format/ (typography `letterSpacing`: unconfirmed) ;
  https://www.designtokens.org/tr/2025.10/color/ ; https://www.designtokens.org/tr/2025.10/resolver/ ; https://www.designtokens.org/tr/drafts/format/
- https://github.com/jsxtools/dtcg-tools (schema URLs from a search summary: unconfirmed)
- https://github.com/style-dictionary/style-dictionary ; https://styledictionary.com/info/dtcg/ ; https://registry.npmjs.org/style-dictionary/latest
- https://github.com/terrazzoapp/terrazzo ; https://terrazzo.app/docs/ ; https://registry.npmjs.org/@terrazzo/cli (2.7.1 resolver support: unconfirmed)
- https://github.com/Inspiaaa/ThemeGen ; https://github.com/elasrlambert/GodotThemeGenerator
- https://stylelint.io/user-guide/rules/property-allowed-list/ ; https://stylelint.io/user-guide/rules/declaration-property-value-allowed-list/

**Accessibility**
- https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/101 ; /102 ; /103 ;
  /119 (search snippet only: unconfirmed)
- https://gameaccessibilityguidelines.com/full-list/ ; https://gameaccessibilityguidelines.com/use-an-easily-readable-default-font-size/ ;
  https://gameaccessibilityguidelines.com/provide-a-visual-indication-of-who-is-currently-speaking/
- https://accessible.games/accessible-player-experiences/
- https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html ; https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html ;
  https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio ; https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html (not opened by L1: unconfirmed there)
- https://www.w3.org/TR/wcag-3.0/ ; https://www.adacompliancepros.com/blog/wcag-3-draft-status-procurement (timeline: unconfirmed)
- https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/color-blindness
- https://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_Simulation/CVD_Simulation.html (linear-RGB application: unconfirmed)
- https://sronpersonalpages.nl/~pault/ ; https://jfly.uni-koeln.de/color/ (Okabe-Ito hexes: unconfirmed, image only)
- https://github.com/luisfrancisco/colorsym (licence from the repo page: unconfirmed) ;
  https://boardgamewire.com/index.php/2026/07/06/designer-pair-launch-colorsym-giving-publishers-a-free-tool-for-colourblind-friendly-board-game-creation/
- https://en.wikipedia.org/wiki/ColorADD (paid licence: unconfirmed, secondary)
- https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion

**UX and design writing**
- https://www.nngroup.com/articles/neobrutalism/ ; https://www.nngroup.com/articles/onboarding-tutorials/ ; https://www.nngroup.com/articles/animation-duration/
- https://www.wayline.io/blog/tutorial-ux-indie-game-onboarding (blog: unconfirmed)
- https://www.w3.org/International/articles/article-text-size
- https://punchev.com/cases/goose-goose-duck-let-the-duck-hunt-begin
- https://personacentral.com/persona-5-panel-concept-development-ui/ (fan translation: unconfirmed)
- https://www.gdcvault.com/play/1016487/juice-it-or-lose ; https://www.youtube.com/watch?v=AJdEqssNZ-U (tricks from memory: unconfirmed) ;
  https://www.gamedeveloper.com/design/video-indies-resist-the-urge-to-juice-it-or-lose-it-
- https://easings.net/ ; https://raw.githubusercontent.com/ai/easings.net/master/src/easings.yml
- https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function/linear
- https://en.wikipedia.org/wiki/ISO_7010 ; https://en.wikipedia.org/wiki/ISO_3864 (ISO texts paywalled: unconfirmed)
- https://www.wallpaper.com/design-interiors/memphis-design-group-definitive-guide (unconfirmed) ; https://en.wikipedia.org/wiki/Y2K_aesthetic ;
  https://cari.institute/history (unconfirmed)

**Game references** (Game UI Database pages refused fetches: links only)
- https://www.gameuidatabase.com/ (entries 305, 1512, 235, 471, 1590, 1890; screens ?scrn=43, ?scrn=181)
- Among Us: https://en.wikipedia.org/wiki/Among_Us ; https://among-us.fandom.com/wiki/Impostor ; https://among-us.fandom.com/wiki/Colors ;
  https://among-us.fandom.com/wiki/Red ; https://www.gamepur.com/guides/among-us-june-2022-patch-notes-colorblind-settings-bugfixes-and-more
  (fan wiki and Gamepur: unconfirmed; role-reveal details from memory: unconfirmed)
- LOCKDOWN Protocol: https://miragecreativelab.com/lockdown-protocol/ ; https://store.steampowered.com/app/2780980/LOCKDOWN_Protocol/ ;
  https://www.kickstarter.com/projects/miragecreativelab/lockdown-protocol/description ; https://steamdb.info/app/2780980/info/
  (L1's HUD summary from store copy: unconfirmed)
- Fall Guys: https://interfaceingame.com/games/fall-guys-ultimate-knockout/ ; https://fallguysultimateknockout.fandom.com/wiki/Round_Over_Screen (unconfirmed) ;
  https://www.fallguys.com/en-US/news/fall-guys-creative-construction-release-notes (snippet: unconfirmed)
- Splatoon: https://www.nintendo.com/us/whatsnew/ask-the-developer-vol-7-splatoon-3-part-1/ (chroma claims via secondary summaries: unconfirmed)
- Lethal Company: https://fontsinuse.com/uses/68901/lethal-company-video-game ; https://en.wikipedia.org/wiki/Lethal_Company ;
  https://lethal.miraheze.org/wiki/HUD (unconfirmed) ; https://steamcommunity.com/app/1966720/discussions/0/5513030717662354322/ (forum: unconfirmed) ;
  https://thunderstore.io/c/lethal-company/p/5Bit/VoiceHUD/ ; https://thunderstore.io/c/lethal-company/p/ficcialfaint/Spectator_Voice_Icon_Fix/ (unconfirmed)
- Buckshot Roulette: https://fontsinuse.com/uses/64498/buckshot-roulette-video-game ; https://en.wikipedia.org/wiki/Buckshot_Roulette
- PEAK: https://en.wikipedia.org/wiki/Peak_(video_game) ; https://gamerant.com/peak-all-status-effects/ (unconfirmed)
- Content Warning: https://en.wikipedia.org/wiki/Content_Warning ; https://landfall.se/content-warning-press-kit ;
  https://www.gameleap.com/articles/content-warning-how-to-host-and-invite-friends (unconfirmed)
- Untitled Goose Game: https://atomicbobomb.home.blog/2019/10/12/untitled-goose-game-and-ui/ ; https://untitledgoosegame.fandom.com/wiki/To-Do_List (unconfirmed)
- Jackbox: https://www.jackboxgames.com/blog/behind-the-scenes-of-pp10-art ;
  https://support.jackboxgames.com/hc/en-us/articles/15794759479959-How-do-I-join-a-game (snippet: unconfirmed)
- Bomb Rush Cyberfunk: https://toucharcade.com/2023/12/14/bomb-rush-cyberfunk-interview-game-director-dion-koster-career-soundtrack-vinyl-physical-release-switch-iam8bit-skybound/ (unconfirmed) ;
  https://burodestruct.net/work/bd-bomb-rush-cyberfunk-graffiti
- WarioWare: https://www.nintendolife.com/features/butt-movements-pitches-and-9-volts-retro-microgames-we-speak-with-wariowares-chief-director (unconfirmed) ;
  https://www.gamestudies.org/0501/gingold/
- R.E.P.O.: https://en.wikipedia.org/wiki/R.E.P.O. ; https://www.thegamer.com/repo-death-head-possession-explained-guide/ (unconfirmed) ;
  https://steamcommunity.com/app/3241660/allnews/?l=english (snippet: unconfirmed) ; https://www.repo-game.org/en/repogame-voice-chat (fan site: unconfirmed)
- Others: https://en.wikipedia.org/wiki/Webfishing ; https://projectwinter.fandom.com/wiki/Player_Roles (unconfirmed) ;
  https://www.exitlag.com/blog/goose-goose-duck-tips-and-tricks-for-winning/ (unconfirmed) ;
  https://wp-support.partyanimals.com/2023/08/22/custom-game-faq/ (snippet: unconfirmed) ; https://gamertweak.com/how-set-up-mic-phasmophobia/ (unconfirmed)
- Steam: https://partner.steamgames.com/doc/features/multiplayer/matchmaking
- Sci-fi HUD kits (the look is commoditised): https://vill8tion.itch.io/sci-fi-holographic-hud-kit-cyberpunk-ui-4k ; https://syntystore.com/products/interface-sci-fi-soldier-hud

**Fonts and licences**
- https://openfontlicense.org/ofl-faq/ ; https://creativecommons.org/licenses/by/4.0/
- https://github.com/google/fonts (ofl/<family>/METADATA.pb, OFL.txt, DESCRIPTION.en_us.html for Unbounded, Dela Gothic One, Climate Crisis,
  Rubik and Rubik Mono One / Bubbles / Doodle Shadow / Wet Paint, Nunito, Comfortaa, Montserrat and Alternates, Balsamiq Sans, Onest,
  Golos Text, Inter, Manrope, Oswald, Roboto Condensed, Tektur, Exo 2, Pangolin, Neucha, Bad Script, Russo One)
  (Climate Crisis melting effect and origin: unconfirmed; glyph-level coverage of every file: unconfirmed until a cmap check)
- https://github.com/googlefonts/nam-files/tree/main/Lib/gfsubsets/data
- https://rsms.me/inter/
- https://github.com/MacPaw/Fixel ; https://github.com/MacPaw/Fixel/blob/main/OFL.txt (variable version and Google Fonts listing: unconfirmed)
- https://thedigital.gov.ua/fonts ; https://thedigital.gov.ua/news/diia_design ; https://github.com/abondarev-guru/e-ukraine-fonts (licence: unconfirmed, ambiguous)
- https://kenney.nl/assets/kenney-fonts (Cyrillic: unconfirmed)
- https://fonts.google.com (CSS API for previews)

**Icons**
- https://kenney.nl/assets/game-icons ; https://kenney.nl/assets/input-prompts (file formats: unconfirmed)
- https://game-icons.net/about.html ; https://github.com/game-icons/icons/blob/master/license.txt
- https://github.com/tabler/tabler-icons ; https://github.com/phosphor-icons/core (weights: unconfirmed) ; https://github.com/lucide-icons/lucide/blob/main/LICENSE ;
  https://github.com/iconoir-icons/iconoir ; https://github.com/google/material-design-icons (full Apache obligations not re-read: unconfirmed) ;
  https://github.com/FortAwesome/Font-Awesome/blob/7.x/LICENSE.txt

**Sound**
- https://kenney.nl/assets/interface-sounds ; https://kenney.nl/assets/ui-audio (in-zip licence not opened)
- https://sfbgames.itch.io/chiptone ; https://sfxr.me/ ; https://github.com/KilledByAPixel/ZzFX ; https://killedbyapixel.github.io/ZzFX
- https://freesound.org/help/faq/
- https://sonniss.com/gameaudiogdc/ ; https://sonniss.com/gdc-bundle-license/

**Gaps carried forward (not verified by any lens or this synthesis)**
- Screenshots: Game UI Database, the Splatoon and Fall Guys Medium articles and the Lethal Company fandom wiki
  refused fetches, so every visual description of a game is from text or memory.
- LOCKDOWN Protocol's real lobby, role, death and spectate screens were not inspected.
- Not checked in Godot: a hard StyleBoxFlat shadow, `offset_transform` in containers, the CSS-blur match,
  `ResourceSaver` keeping the uid, ThorVG strokes and masks, WOFF2 import, Button icon colours, theme item names
  for several controls, and the 2D blending colour space.
- Fonts: glyph-level Ukrainian coverage of every candidate; `tnum` beyond Inter; pixel and typewriter faces with
  Ukrainian Cyrillic (needed by D2 and D3) were not researched.
- Not confirmed: the Windows support of the DisplayServer accessibility hints, and the default Camera3D FOV.
- No real colour-blind testing; no simulation of the lit level.
- In prime-game: the round-end reason source; whether the client can read its own LAN address.
- Not researched: Tokens Studio licence and price, and Penpot.
