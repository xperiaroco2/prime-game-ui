## UX/UI department, wave 1: research report (2026-10-02)

Read-only research for the UI track (#150). No file in prime-game changed, no Godot was started, no asset was downloaded. "(unconfirmed)": no primary source behind the claim (memory, fan wiki, blog or snippet). "(computed)": numbers from our own node scripts.

### What ran

- **12 agents**, the approved ceiling: 6 lens agents with web access (L1 references and style, L2 party-game UX, L3 design system, L4 type and icons, L5 motion and sound, L6 accessibility), 1 synthesis, 1 completeness critic (14 spot-checks: 12 held, 2 unconfirmed, none wrong), 3 gap agents (G1 Ukrainian as a language, G2 missed HUD and screens, G3 verification: it proved the sticker-shadow advice wrong and the Windows accessibility hints right), 1 final writer. Workflow `wf_05a4bf0b-de6`: 53 minutes, 420 tool calls, about 1.83M subagent tokens, no agent failed.
- **Cost**: the account's weekly limit went from 3% to 7% (the manager's own turns included), about **4%** against the approved ~3%. The overrun came at the last step (the final writer), which was let finish rather than lose the wave.
- **Not run (bounds)**: G4 joining over the internet, G5 deeper references.
- **Disclosure, a break of the no-downloads rule**: in G1 the WebFetch tool, asked to read Microsoft's Ukrainian style guide, saved that PDF (1.8 MB) on its own into this session's local tool-results folder (outside both repos). Nobody opened it. It waits for the engineer's word to be deleted; later waves avoid links that point straight at PDFs.

### Executive summary

1. **Colour is the hardest problem.** Today's 10 package colours fail colour-blind players: for protanopes red and brown nearly merge (ΔE00 2.7), and blue/purple fails for almost every type (computed). Fix: every package, circle and swatch always carries **our own symbol and a spoken colour name**; packages own the saturated colours. The safer "Hand A" palette has zero confusable pairs, but its black package disappears in shadow and on dark panels.
2. **The voice rules confuse players.** Nobody hears a downed or dead player; the dead hear no voices, only the world around the player they watch, plus lift music. The HUD must say so: a mic chip "Nobody can hear you", speaking cues only from audio the listener really receives, no global talking list.
3. **Readability over 3D first.** A quiet round HUD on a ≥ 60% backplate; personality in rare big moments (lobby, role reveal, downed, respawn, end).
4. **Ukrainian is a language, not only glyphs**: three plural forms, gender-neutral "you" lines, names never declined, Latin key prompts on the ЙЦУКЕН layout. Every screen is mocked in Ukrainian first.
5. **Build four style directions** as interactive phone pages: D1 Sticker Bomb, D4 Karaoke Night, D2 Parcel Post, D3 Pocket LCD. D5 Safety Card stays on paper.
6. **Design system**: a DTCG 2025.10 tokens file as the single source of truth, node tooling, Godot-safe CSS, a Theme generator later.
7. **Godot 4.7.2 can do more than assumed**: a near-hard sticker shadow (source reading, not rendered), focus rings outside the box, and OS reduce-motion and high-contrast hints implemented on Windows.
8. **Licences**: OFL fonts (Comfortaa has a Reserved Font Name), own SVG icons plus one MIT set, CC0 or own sounds; nothing downloaded without your yes per batch.
9. **You decide 8 things now (Q1–Q8)**; for the rest, silence means the recommendation.

### Recommendations

**Must**
- **Colour is never the only cue**: symbol + name on packages, circles, HUD swatch, destination marker and Tab grid; body colours are a non-circle shape + name ([XAG 103](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/103), [GAG](https://gameaccessibilityguidelines.com/full-list/)).
- **A package swatch is a ringed circle**: the outer ring takes the panel's opposite lightness (≥ 3:1), our symbol inside in a fixed ink, the name beside it.
- **Packages own saturated colour**; chrome is neutral or one pale tint; teams read without hue (shape, word, light vs dark).
- **HUD text on an opaque panel or a ≥ 60% black backplate**; 60% gives 5.74:1 even over white (computed; [XAG 102](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/102)).
- **One size scale** at 1920×1080: 18 / 20 / 22 / 24 HUD / 28 buttons / 36 titles / 64–96 timers / 96–140 set pieces; works at 200% UI scale ([XAG 101](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/101)). Contrast 4.5:1 text, 3:1 large and non-text, 7:1 high contrast.
- **Ukrainian first** with a length budget per component: Godot 4.7.2 `Label` has no shrink-to-fit.
- **Voice**: mic chip with five states; the dead-screen line; speaking cues only from received audio ([GAG](https://gameaccessibilityguidelines.com/provide-a-visual-indication-of-who-is-currently-speaking/)).
- **Privacy**: no other player's role anywhere (except a dissident's own teammates); spectating shows only "Watching: NAME" and public hand and belt; no toast or indicator ever names an attacker; no hit marker, no hit-direction arrow; hurt sounds only on the victim's client.
- **Stamina and health** join the mic chip in a bottom-left "self cluster", shown only below full. Stamina is private, so an exhaustion breath is a 2D sound on the own client only.
- **Motion**: loud on rare moments, quiet on frequent ones; reduced motion from day one; input never waits for an animation; rule times come from the host ([NN/g](https://www.nngroup.com/articles/animation-duration/), [Juice it](https://www.gdcvault.com/play/1016487/juice-it-or-lose)).
- **Assets**: allowed licences only, a credits entry and licence file per asset; never Sonniss ([its licence](https://sonniss.com/gdc-bundle-license/) forbids supplying the files to others).

**Should**: Hand A or fewer colours, and a separate body palette (designer's content); emissive symbol decals and a symbol post per circle; **nameplates** (`Label3D`: name + body-colour shape and name; dim near, full when aimed, hidden by walls, speaker glyph only from received audio, never a role); Latin keycaps from the live binding; Tab grid from public `Station.done`; end screen "You won/lost" + reason (needs a data source); teaching by prompts, tips and a lobby practice package ([NN/g](https://www.nngroup.com/articles/onboarding-tutorials/)); a Players tab with per-player volume and mute; a reserved Accessibility tab; tabular figures; ~20 UI sounds, each with a visible twin.

**Could**: wireframes in Balsamiq Sans; a toast stack (max 3, 4 s); 2–3 set-piece shaders later; colour-blind playtesters; a gesture wheel after the MVP.

### Style directions

All keep R1–R7: packages own saturated colour, ringed swatch, teams without hue, HUD on a plate, personality in big moments, microcopy as style, body colours never circles and always named. Contrast numbers are computed.

- **D1 Sticker Bomb**, "a friend slapped stickers on your screen". Ink #1A1424, paper #FFF6E5, lilac #CBB8FF; white vs ink sticker teams. Mostly tier A. Lilac on paper is 1.65:1, so the focus ring is ink. Risk: neo-brutalist web look ([NN/g](https://www.nngroup.com/articles/neobrutalism/)).
- **D4 Karaoke Night**, "a karaoke lyrics screen runs your match"; the lyric wipe ties to voice. The only dark one, the cheapest in Godot. 3/10 dots under 3:1 on velvet; Hand A black 1.11:1, indigo 1.23:1, so the two-ring swatch is required. Flicker only as a one-shot entrance.
- **D2 Parcel Post**, "paperwork of a slightly incompetent courier firm". The most original, the most textures. It implies a setting: built only if Q3 allows, in a light form (flavour in big moments, plain HUD).
- **D3 Pocket LCD**, "your HUD is a 1998 virtual-pet toy". Riskiest: 7/10 dots under 3:1 on the LCD; no pixel font with Ukrainian found yet.
- **D5 Safety Card**, "an airline safety card calmly explaining the chaos". The most illustration; its shape-coded teams live on as R3.

Build order: D1, D4, D2, D3.

### Screen inventory and HUD rules

| # | Screen | Biggest change | Priority |
|---|---|---|---|
| 1 | Main menu, first launch | name, version, error banner, mic check | MVP |
| 2 | Connecting | address, elapsed time, Cancel | MVP |
| 3 | Loading | per-player ticks, a tip | MVP |
| 4 | Lobby HUD | roster chips, `[F] Ready`, join line, 5..1 | MVP |
| 5 | Esc Lobby tab + Wardrobe | colour row now; Wardrobe (3D preview, category rail, item grid) reserved for #73 | MVP / later |
| 6 | Role screen (#175) | banner over the live world ~3 s, then a chip; no replay on respawn | MVP |
| 7 | Round HUD | zones, crosshair prompt with symbol + name, self cluster (mic, health, stamina), hands and belt, destination | MVP |
| 8 | Nameplates | far hidden, near dim, aimed full, speaking, downed, lobby always on | MVP |
| 9 | Hurt and knockdown | private vignette, 2D sound, camera kick; knockdown: muffled world, toast "NAME was knocked down" (no "by") | MVP |
| 10 | Tab task screen | role line, delivery grid, controls; hold or toggle | MVP |
| 11 | Downed / dead / spectate | "Nobody hears you. You hear only the sounds around this player, and lift music. No voices."; name in its own "Watching:" label | MVP |
| 12 | Esc menu (#169) | Players and Settings tabs, "The game keeps running" | MVP |
| 13 | Settings | voice and audio first, then controls, accessibility, language | MVP-lite |
| 14 | End screen | winning side, "You won/lost", reason, "Waiting for the host" | MVP |
| 15 | Errors, toasts | a sentence + action per `EndReasons` id; public events only | MVP |
| 16 | Gesture wheel, ping, lobby board, mirror | reserved keys and zones | later |

**HUD rules**: zones top-centre (clock, progress, role chip, toasts), centre (dot crosshair + prompt), bottom-left (self cluster), bottom-right (hands, belt, destination), edges (vignettes). No idle animation except the destination marker and downed vignette; no textures in the round HUD; prompts are keycaps from the live binding; ≤ 3 flashes per second; Esc does not pause, and says so.

**Join line: LAN-only for now.** `IP.get_local_addresses` and `UPNP` exist in the 4.7.2 dump. The wireframe shows the LAN address labelled "same network only", a Copy button (`DisplayServer.clipboard_set`) and a slot for an internet address; that flow waits on UI-9.

### Design system plan

- **Tokens**: [DTCG 2025.10](https://www.designtokens.org/tr/2025.10/format/) Format + Color + [Resolver](https://www.designtokens.org/tr/2025.10/resolver/), a stable W3C **Community Group final report** of 2025-10-28, not a W3C Recommendation ([announcement](https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/)). 13 types, no string type. The spec allows px and rem; **px only is our restriction**; ms; srgb maps 1:1 to Godot `Color`.
- **Tiers**: primitive (`color.palette.ink.900`), semantic (`color.surface.hud`, `color.package.<id>` + `.on`, `color.body.<id>`), component (`component.swatch.ring.outer`). Package and body colours mirror the designer's content; a later prime-game test fails if the copies differ. Colour names live in the copy deck, symbol paths in `$extensions`.
- **Modes**: `direction`, `textSize`, `contrast`, `motion`, and `colorVision` reserved (`default` only). UI scale is `Window.content_scale_factor`, not a token.

**Godot-safe CSS** (names checked in the 4.7.2 dump):

| Tier | CSS in mocks | Godot 4.7.2 |
|---|---|---|
| A | solid background; per-side border width, **one** colour; per-corner radius | `StyleBoxFlat.bg_color`, `border_width_*`, `border_color`, `corner_radius_*`, `corner_detail` |
| A | one soft `box-shadow` | `shadow_color/size/offset` (fall-off vs CSS blur unconfirmed) |
| A | hard sticker shadow `4px 4px 0` | **`shadow_size` 1 + `shadow_offset`, `draw_center` on**: a solid offset copy with a 1 px edge ([4.7.2 source](https://raw.githubusercontent.com/godotengine/godot/4.7.2-stable/scene/resources/style_box_flat.cpp); not rendered). `shadow_size` 0 draws nothing |
| A | focus ring outside the box | `expand_margin_*`: draws outside, click area unchanged |
| A | `skewX`; rotate/scale on set pieces | `StyleBoxFlat.skew`, `Control.rotation`, `pivot_offset_ratio` |
| A | one text outline, letter-spacing, `tnum`, uppercase, ellipsis | `outline_size`, `FontVariation`, `Label.uppercase`, `text_overrun_behavior` |
| A | up to 2 stacked outlines + 1 shadow | `LabelSettings`, **Label only, never Button text** (use a Label inside the button, or one outline) |
| A | transitions | `Tween` with a pair from the easing table |
| B | gradients, 9-slice stickers, icons, rings, vignette | `StyleBoxTexture`, `GradientTexture2D`, `DPITexture`, `TextureProgressBar` (declared assets) |
| C | blur, filters, inset or multiple shadows, per-side border colours, dashed, `clip-path`, blend modes | **forbidden in mocks** |

`border_blend` (border fades into the background) has no exact CSS twin; it stays out until a side-by-side check.

**Components**: base controls plus swatch, body chip, keycap, player and mic chips, speaking indicator, slots, delivery grid, marker, timers, banners, toast, nameplate, stamina and health bars, vignette, focus ring. **Tooling** (node 20, no packages): `build-tokens`, `lint-css` + in-page checker, `a11y-gate`, `font-check`, `credits-check`. **Later in prime-game**: a headless GDScript generator validates item names against `ThemeDB.get_default_theme()`, generates `LabelSettings` and a `UiMotion` class, and has a staleness test.

### Accessibility

**Today's palette, confusable pairs** (ΔE00 < 10, Machado 2009 simulation; computed):

| Vision | Pairs |
|---|---|
| protanopia | red/brown 2.7, blue/purple 4.3, orange/green 6.2 |
| deuteranopia | blue/purple 6.0, red/green 7.7, orange/green 8.4, cyan/pink 9.9 |
| tritanopia | orange/pink 7.1 |
| mild protan / deutan | blue/purple 4.3 / 3.2 |

Six distinct pairs fail; in normal vision blue/purple is weakest (13.3). The best sets found (computed): 6 colours 22.2, 8 colours 13.5, 10 colours 11.7. About 6 colours work by colour alone; at 9–10 the symbols carry the meaning.

**Hand A**: white #F2F2F2, black #1E1E1E, yellow #F0E442, orange #E69F00, red #D55E00, sky #56B4E9, blue #0072B2, green #009E73, pink #CC79A7, indigo #332288. Zero confusable pairs (min 12.2 protan, 11.6 deutan, 10.9 tritan; computed). Okabe-Ito hexes come from secondary sources; the [authors' page](https://jfly.uni-koeln.de/color/) shows them only as an image (unconfirmed). **Trade-off**: black vanishes in 3D shadow and on dark panels (D4 velvet 1.11:1); "red" is vermillion; tritan still weak.

**Redundancy plan**: (1) our own 10 rotation-safe symbols, no look-alike pairs; ColorSym is only a reference ([repo](https://github.com/luisfrancisco/colorsym): CC BY-SA 4.0 + OFL 1.1, share-alike); (2) colour names always on (Ukrainian already separates блакитний and синій); (3) the ringed swatch and emissive decals in 3D; (4) a CI gate: ≥ 10 under protan, deutan, tritan, ≥ 20 normal; (5) `colorVision` reserved, presets only if playtests ask.

**Also**: a 3 px focus ring (`expand_margin`); hold or toggle for Tab, G, E (give-up: press twice); remapping; screen-shake slider; "always show health and stamina". The OS hints `accessibility_should_reduce_animation()` and `accessibility_should_increase_contrast()` are implemented on Windows in 4.7.2; they only pre-fill settings (-1 = off).

### Typography and icons

Licences from google/fonts `METADATA.pb` and `OFL.txt`. A subset tag is not glyph proof: each font gets a check for і ї є ґ І Ї Є Ґ, all three apostrophes (ʼ ’ '), № and `tnum`.

| Font | Role | Licence | Cyrillic |
|---|---|---|---|
| Unbounded | loud display | OFL | cyrillic, -ext |
| Onest / Golos Text | UI, body | OFL | cyrillic, -ext |
| Nunito | warm rounded | OFL | cyrillic, -ext |
| [Inter](https://rsms.me/inter/) | numbers (`tnum` confirmed) | OFL | cyrillic, -ext |
| Dela Gothic One | poster | OFL | cyrillic only (per glyph unconfirmed) |
| [Comfortaa](https://raw.githubusercontent.com/google/fonts/main/ofl/comfortaa/OFL.txt) | rounded display | OFL, **Reserved Font Name**: ship unmodified | cyrillic, -ext |
| Rubik Mono One, Rubik Bubbles, Pangolin, Tektur, Oswald, Climate Crisis | timers, shouts, stamps | OFL | cyrillic, -ext |
| Balsamiq Sans | wireframes | OFL | cyrillic, -ext |
| [Fixel](https://github.com/MacPaw/Fixel) (MacPaw) | UI + display | OFL 1.1, no RFN | Ukrainian stated; not on Google Fonts |
| ~~Russo One~~ | excluded | RFN "Russo" | its description: the name means "Russian" |
| ~~e-Ukraine~~ | excluded | no font licence | a state brand |

Pairings for a specimen page: A Unbounded + Onest (loud); B Nunito + Rubik Bubbles (warm); C Dela Gothic One + Golos Text + Oswald (poster); D Fixel + Climate Crisis. Fonts ship as original TTFs, never subset.

**Icons**: own SVGs for 15–25 signature icons (package, knife, downed, raise, ready, voice, slots, respawn, spectate); one MIT set for system icons, [Tabler](https://raw.githubusercontent.com/tabler/tabler-icons/main/LICENSE) or [Phosphor](https://raw.githubusercontent.com/phosphor-icons/core/main/LICENSE) ([Lucide](https://raw.githubusercontent.com/lucide-icons/lucide/main/LICENSE) is ISC + MIT, two notices); [Kenney Input Prompts](https://kenney.nl/assets/input-prompts) (CC0) for mouse glyphs only. Avoided: game-icons.net (CC BY 3.0 per author), Font Awesome (CC BY + RFN).

**Keycaps**: the input map uses `physical_keycode`, so play works on any layout. A keycap shows `DisplayServer.keyboard_get_label_from_physical` only if it is a Latin letter (AZERTY sees its own), otherwise the US letter. On ЙЦУКЕН, F reads "А", D "В", S "І", each a look-alike of another Latin key, and the label flips with the layout (key map from memory, unconfirmed).

### Motion and sound

- **Nine easings**, a chosen subset of Godot's 12 `TransitionType` × 4 `EaseType`: `linear`, `out`, `in`, `in-out`, `snap`, `pop`, `anticipate`, `wobble` (titles), `bounce` (downed drop). **TRANS_SPRING** is deliberately left out (no CSS twin); revisit after PG-1.
- Durations 0–480 ms; hover and press 60–120 ms, scale ≤ 1.04, no overshoot. The role reveal slams in over the live world (no black screen) and shrinks into the chip after ~3 s.
- Sound: our own WebAudio blip in mocks; in the game CC0 or self-made only ([Kenney Interface Sounds](https://kenney.nl/assets/interface-sounds), CC0; [UI Audio](https://kenney.nl/assets/ui-audio), CC0 on the page, zip licence unread). One role sting for both teams (an open mic could leak a team sting).

### Risks and mitigations

| Risk | Mitigation |
|---|---|
| Colour-blind players cannot match packages; black hides in shadow | symbols + names always; Hand A or fewer colours; emissive decals; CI gate; playtesters |
| Players think the mic broke when downed or dead | mic chip "Nobody can hear you"; dead-screen line |
| A speaking or hurt cue leaks hidden information | cues only from received audio; private 2D hurt sound; no attacker, no direction |
| Mocks promise what Godot cannot draw | tiers, lint, checker; probe PG-1 |
| Ukrainian strings overflow | UA-first mocks, length budgets |
| Licence contamination of public repos | allowed list; CI credits check; per-batch yes |
| Over-juiced UI tires players or triggers seizures | loud only on rare moments; ≤ 3 flashes/s; reduced motion |
| A direction implies a setting; mean cringe pushes players away | Q3; jokes on the situation, never on a player |
| Mocks encode a LAN-only join | "same network only" label; UI-9 first |

### Decisions for the engineer

Style, look, texts and money are yours. **Q1–Q8 need an answer**; for Q9–Q26 silence means the recommendation.

- **Q1. Create the public repo `xperiaroco2/prime-game-ui` now; licence?** (a) yes, no licence file; (b) yes, open licence (MIT tools, CC BY art); (c) not yet. *Rec: (a).* No licence means all rights reserved, though GitHub's Terms let others view and fork a public repo ([GitHub docs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository)); prime-game has no LICENSE either.
- **Q2. Which directions become interactive pages?** (a) D1+D4+D2+D3; (b) D1+D4+D3; (c) all five; (d) another mix. *Rec: (a), in that order.*
- **Q3. May the UI hint at a setting (courier firm, workplace, bar) before the setting is chosen?** Yes / lightly / no. *Rec: lightly* (big moments only). "No" drops D2.
- **Q4. Colour symbols and names?** Always / only in a colour-blind setting / never. *Rec: always, our own simple shapes.*
- **Q5. Package colours (also the designer's content).** (a) current + symbols; (b) Hand A + symbols; (c) 6–8 colours + symbols. *Rec: (b), and ask the designer about 8 or fewer.* Trade-off: Hand A's black is hard to see in shadow and on dark panels; mocks show both palettes with a toggle.
- **Q6. May mock pages load fonts from Google Fonts in your browser?** No file in the repo, no agent download. Yes / no (system fonts until a batch). *Rec: yes.*
- **Q7. Tone of the texts.** Plain everywhere / playful everywhere / plain instructions and errors plus one playful line per big moment. *Rec: the third; warm, self-deprecating, never mocking a player; "ти", gender-neutral, no gender setting.* The final tone is picked on a sampler page.
- **Q8. Accept defaults Q9–Q26?** Yes / I'll go through them. *Rec: yes*; object to any at any time.

**Defaults**: Q9 chrome neutral + at most one pale tint. Q10 effects tier B (flat + licensed or own textures), one direction nearly flat. Q11 body colours a separate set, non-circle shape + name; picked in the Esc Lobby tab now, a wardrobe later. Q12 70% HUD backplate, players can raise it. Q13 role reveal (#175): banner then chip, no blocking card. Q14 capitals only for 1–3-word titles (#175's line becomes a short title + a sentence). Q15 colour names always on swatches and Tab; on nameplates by default, can be hidden. Q16 no teammate mark on nameplates in the MVP. Q17 no hit-direction arrow (it would point at the attacker). Q18 downed marker: sight only (designer's call). Q19 our texts use ʼ (U+02BC); names accept all three apostrophes. Q20 typeface chosen on the specimen page with the direction. Q21 drop Russo One and e-Ukraine. Q22 own signature icons + one MIT set; own keycaps, Kenney only for the mouse. Q23 motion: bouncy only in rare moments, snappy elsewhere. Q24 sound: Kenney clicks + homemade stings, one role sting, separate win and lose. Q25 end screen: "You won/lost" + reason; ask the designer about revealing roles. Q26 money: free only; an illustrator is decided after the mocks.

**For the designer (to relay)**: roles revealed at the end? "NAME was knocked down" toasted? Fewer than 10 package colours? The body palette (#73)? A lobby practice package and circle? Gestures while carrying? A downed marker through walls?

### Technical decisions by the manager

Under your delegation (#134); each is revertible.

- **T1** DTCG 2025.10 Format + Color + Resolver, `.tokens.json`, px and ms, srgb with hex.
- **T2** Tiers primitive → semantic → component; `color.package.*` and `color.body.*` mirror content, apart from chrome.
- **T3** Colour names in the copy deck; symbol paths in `$extensions`.
- **T4** Modes `direction`, `textSize`, `contrast`, `motion`, `colorVision` (default only); UI scale is runtime.
- **T5** Zero-dependency node 20 scripts; Terrazzo only as a fallback, with your yes.
- **T6** Godot-safe tiers A/B/C with a lint and an in-page checker; sticker shadow = `shadow_size` 1 + offset; focus ring = `expand_margin`; stacked outlines on Labels only.
- **T7** Reference 1920×1080; also 1280×720, 2560×1080, 1920×1200, 200%; CSS bright, dark and busy backdrops.
- **T8** Gates: WCAG 2.x contrast; Machado 2009 + CIEDE2000; ring ≥ 3:1, symbol ink ≥ 4.5:1; backplate ≥ 60%.
- **T9** Swatch: circle, two rings, outer ring opposite the panel's lightness.
- **T10** The nine-easing table, Godot pair as source of truth; CSS `cubic-bezier` + exact `linear()`; no SPRING for now.
- **T11** Mock sound: our own WebAudio blip.
- **T12** Fonts: Google Fonts CSS in mocks (Q6); Balsamiq Sans for wireframes; after the choice, one batch of original TTFs at a pinned commit.
- **T13** Icons: monochrome SVG, 24 or 32 px grid, paths only.
- **T14** Credits in prime-game's `docs/credits` format, licence file per asset, CI check. Allowed CC0, OFL, MIT, ISC, Apache-2.0, own; excluded CC BY-SA, NC, Sonniss.
- **T15** Copy deck `copy/deck.csv`, header `keys,?plural,uk,en,_notes` (Godot 4.6+ CSV, [4.7 docs](https://docs.godotengine.org/en/4.7/tutorials/i18n/localization_using_spreadsheets.html)). Plurals need `tr_n` (no automatic Control translation); uk has 3 forms ([CLDR](https://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html)) plus a `?pluralrule` row as insurance. Counters "Готові: 4/8". No gendered past tense, adjective or role noun for a player (a check rejects "(ла)"). `{name}` stays nominative; one whole-sentence key per team or colour.
- **T16** Voice cues only from received audio; mic chip with 5 states; bottom-left self cluster.
- **T17** Wireframe zones named like anchored Godot containers.
- **T18** Theme generator later in prime-game, as above.
- **T19** Propose prime-game's base at 1920×1080 ([Godot 4.7 docs](https://docs.godotengine.org/en/4.7/tutorials/rendering/multiple_resolutions.html)); the engineer decides.
- **T20** Every deliverable is a private artifact page for the phone (switchers, tap-to-zoom, 1:1 crop); feedback as page comments; a #150 comment per wave.
- **T21** Keycaps: Latin physical letter; Space from the deck; mouse buttons as icons.
- **T22** Wireframe placeholders only, not decisions (controls are the designer's call, as D6 in the M4 ADR): hold T for a gesture wheel, 1–8 direct gestures, middle mouse for the hand ping, V kept free for push-to-talk; not R (beside E, held to raise), not G (give-up).
- **T23** Names in wireframes: 16 characters (not bytes), kept as typed, normalised only for duplicate checks (a placeholder until the engine sets the limit).
- **T24** Layout `tokens/ tools/ web/ pages/ copy/ assets/ docs/research/`; CI runs build, lint, gates, font and credits checks with no installs.

### Process

0. Bootstrap: repo, CLAUDE.md, CI, tooling, page kit.
1. References: `docs/research/` and a link board (no copied images).
2. Wireframes of every screen: greyscale, all states, UA + EN, 100% and 200%; voice spec, copy deck, tone sampler. You approve the structure.
3. Directions: colour system, type specimen, motion lab, a 5-screen mock frame, one page per direction, a comparison page.
4. Choice: an ADR (you and the designer).
5. Tokens and components: gates green, font and icon batches, a showcase page. You approve the look.
6. Screens: every family styled; you approve each.
7. Handoff: resolved JSON, mapping notes, credits, prime-game issues (the engineer).

### Proposed issues

**prime-game-ui** (dependencies in brackets):
- **Wave A, needs only Q1**: UI-1 Bootstrap; UI-2 Research notes + reference board (1); UI-3 Rules and baselines incl. Ukrainian copy rules (2); UI-4 Token build (1); UI-5 Godot-safe CSS lint + checker (1); UI-6 A11y gates (4); UI-7 Credits check (1); UI-8 Page kit (4, 5).
- **Wave B, needs only Q1**: UI-9 Research: joining over the internet (1); UI-10 Research: reference sheet incl. LOCKDOWN Protocol (2); UI-11 Inventory and flows (3, 8); UI-12 Copy deck + tone sampler (3, 11); UI-13 Voice UX spec (11); UI-14 WF menus, connecting, loading, errors, join (9, 11); UI-15 WF lobby, Lobby tab, wardrobe (11); UI-16 WF role, round HUD, nameplates, hurt, Tab (11, 13); UI-17 WF downed, dead, spectate (11, 13); UI-18 WF Esc menu, settings (11, 13); UI-19 WF end, toasts (11).
- **Wave C, needs Q2–Q7**: UI-20 Colour system (6, 8); UI-21 Type specimen (8); UI-22 Motion lab (4, 8); UI-23 Mock frame (16, 17, 19); UI-24 D1, UI-25 D4, UI-26 D2, UI-27 D3 (20–23); UI-28 Comparison + ADR (24–27).
- **Wave D, after the choice**: UI-29 Font batch + glyph check (28, 7); UI-30 Tokens for the chosen direction (28, 6); UI-31 Components + showcase (30); UI-32 Icons + keycap (28, 7); UI-33 Sound list (28, 22).
- **Wave E**: UI-34–UI-39 styled screen families (31, 32, own wireframe). **Wave F**: UI-40 Port package (34–39).

**prime-game, later** (the engineer's, not this track's): PG-1 `shot` probe spike, report only (sticker shadow, focus ring, `border_blend`, stacked outlines, tilt, SVG, uk plurals, ї/є/ґ capitals); PG-2 data colours + palette match test; PG-3 base 1920×1080; PG-4 Theme generator (UI-30); PG-5 showcase scene; PG-6 typography (UI-29); PG-7 icons + keycap helper (UI-32); PG-8 translations uk/en (UI-12); PG-9 `EndReasons` words, host version in `Rejected`, localised default names, IP field accepting "ю" as "." (UI-12); PG-10 voice mode, mute, per-speaker level (UI-13); PG-11 voice, audio, control settings; PG-12 accessibility settings; PG-13 UI audio bus; PG-14 `UiMotion`; PG-15 3D symbols + palette (Q5); PG-16 nameplates (PG-10); PG-17 hurt feedback; PG-18 set-piece motion; PG-19 screen port; PG-20 internet join (UI-9).

### Not covered / unconfirmed

- **G4 internet join** (UPnP success, VPN tools, version mismatch, lobby full): not researched; becomes UI-9.
- **G5 references**: all visual references are text only (Game UI Database refused fetches); LOCKDOWN Protocol, the closest comparable, was not inspected beyond store copy; becomes UI-10.
- **Not rendered in Godot**: sticker shadow, `border_blend`, shadow fall-off, tilt in containers, SVG strokes, blend colour space, `uid://` through `ResourceSaver`.
- **Not glyph-checked**: Ukrainian coverage per font, `tnum` beyond Inter, pixel and typewriter faces for D2 and D3.
- **Unconfirmed**: Okabe-Ito hexes; Kenney UI Audio's in-zip licence; ColorSym's per-part licence; the ЙЦУКЕН key map and typed apostrophes; Godot's built-in uk plural rule; all comparable-game behaviour from fan wikis (Lethal Company, PEAK, R.E.P.O., Content Warning).
- **Not done**: real colour-blind testing, a lit-level simulation; the end screen's reason source is open; Microsoft's Ukrainian style guide (PDF) unread.

The full lens, synthesis and gap reports (all links, every "(unconfirmed)" kept) will be committed to prime-game-ui under `docs/research/` once the repo exists.

### Handover and next step

- **Nothing is running.** The wave's workflow `wf_05a4bf0b-de6` finished; no worktree, branch or issue was created, and prime-game is untouched (`git status`: clean `main`).
- **Where the reports are**: the scratchpad of the UX/UI manager session (`ce8374ce-…`, `scratchpad/ux/`: six `lens-*.md`, `synthesis.md`, three `gap-*.md`, this comment). A successor session without that scratchpad reruns only what it needs; the conclusions above are the record.
- **The engineer's reading page** (Ukrainian, private): https://claude.ai/artifact/Hz8ftzjf2jujrkQz5KpvMe (the questions with tap-to-answer, and a colour-blind simulation of both palettes).
- **Stopped, waiting for the engineer**: answers to Q1–Q8 (asked in chat in plain words), and a separate yes before the public repo is created. Then wave A (bootstrap, research notes, tooling) and wave B (wireframes) run without further questions; wave C (style pages) needs Q2–Q7.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
