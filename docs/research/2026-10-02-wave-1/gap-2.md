# Gap G2: HUD and screens the synthesis omits

Spec addendum for the UI track's screen inventory (synthesis §4.1). Date: 2026-10-02. Read-only research.
Repo sources read: `docs/decisions/2026-10-01-vision-revision-1.md` (the vision ADR), `client/ui/hud.gd`, `client/ui/hud_text.gd`,
`client/life/life_hud.gd`, the `[input]` section of `project.godot`, `core/events/damaged_event.gd`,
`core/events/swung_event.gd`, `core/events/knocked_down_event.gd`. Godot names checked in
`tools/out/godot-api/4.7.2/extension_api.json`.

## What the code and rules already fix

- **The live HUD has stamina.** `hud.gd` puts `health_label` and `stamina_label` in the bottom-left corner panel.
  `hud_text.gd` fills them with "Health N" and "Stamina N", using the client's predicted stamina. The synthesis
  (§4.2 rule 1) gives bottom-left to the mic chip alone and never mentions stamina, so this addendum re-zones that corner.
- **Stamina is private.** The vision ADR's hidden-information table says that only the player themself learns their
  health, stamina and damage, and a spectator never gets the target's. Living players walk, sprint and jump. A downed
  player crawls with "no jump, no sprint and no stamina cost". A revive does not reset stamina, and a respawn restores it in full.
- **A hit names nobody.** `Damaged` goes only to the victim and has `peer`, `amount` and `health`, with no attacker
  and no direction. `Swung` is public (`peer`, `facing`) and does not say whether the swing hit anyone.
  `KnockedDown` is public (`peer`, `position`) with no attacker and no cause.
- **The dead** hear no voice. They hear only world sounds around their target, plus lift music that only their own
  client plays (`client/life/lift_music.gd` exists).
- **Input map** (physical keys): WASD, Shift sprint, Space jump, E interact, Q put down, LMB use, X swap, Tab task
  screen, F ready, F3 debug overlay, G give up, LMB/RMB spectate next/previous (dead only). **Free:** R, T, Z, C, V, B, 1–0,
  middle mouse, the wheel, Ctrl, Alt. There is no push-to-talk action yet. Synthesis PG-10 plans one, and V is the usual key for it,
  so keep V free.

## (a) Stamina, sprint and jump

Comparable games:
- Lethal Company keeps an always-visible orange stamina arc in the top-left. Sprinting and jumping drain it, and
  standing regenerates it. The arc is known to be misleading at both ends: it barely moves when full and can sit empty
  while some stamina is left ([Lethal Company Wiki, HUD](https://lethal.miraheze.org/wiki/HUD), fan wiki, unconfirmed). The accuracy complaint is
  serious enough that a mod exists to fix it ([AccurateStaminaDisplay](https://github.com/ButteryStancakes/AccurateStaminaDisplay), unconfirmed).
- PEAK has a personal stamina bar whose capacity shrinks with injury, hunger and carried weight ([PEAK Wiki, How to play](https://peak.wiki.gg/wiki/How_to_play), fan wiki, unconfirmed;
  [Wikipedia](https://en.wikipedia.org/wiki/Peak_(video_game)), unconfirmed). That page did not say where the bar sits on screen.

Recommendation for this game. Stamina matters here (escaping a knife, racing a package), but the game avoids aim and
micro skill, so the bar needs to be readable, not prominent.
- A thin bar in the bottom-left "self" cluster, directly above the mic chip and level with the health bar.
- Shown only while below full, and it fades out about 1.5 s after refilling, matching the synthesis rule "health only
  below full".
- An "exhausted" state, when sprinting or jumping is refused, gets a tint plus a word or icon. It never flashes
  (synthesis rule 9).
- An accessibility toggle, "Always show stamina and health", for players who want the bar constant.
- Jump gets no HUD element of its own.
- Any exhaustion sound (heavy breathing) plays only on the player's own client as a non-positional 2D sound. Stamina
  is private, and a 3D breath sound heard by others would leak it.

| Screen | States | Zone | Priority |
|---|---|---|---|
| Round HUD: stamina bar | full (hidden), draining, refilling, exhausted, "always show" option on; hidden while downed, dead/spectating (never the target's), in menus that cover the HUD | bottom-left self cluster, above the mic chip, beside health | MVP |
| Round HUD: bottom-left self cluster (re-zone) | mic chip + health (below full) + stamina (below full); collapses to the mic chip alone at full health and stamina | bottom-left | MVP |

## (b) Nameplates over other players

Comparable games:
- Lethal Company shows player names above players who are nearby. A popular mod's defaults talk about "~1 ship
  length" of visibility distance, larger plates, and an overhead speaking light that vanilla lacks ([LCNameplateTweaks](https://github.com/taffyko/LCNameplateTweaks),
  [Thunderstore](https://thunderstore.io/c/lethal-company/p/taffyko/NameplateTweaks/); both describe the mod, not the vanilla game: unconfirmed).
- A "HidePlayerNames" mod also exists ([Thunderstore](https://thunderstore.io/c/lethal-company/p/Monkeytype/HidePlayerNames/), unconfirmed), which shows some
  players want names off.

Recommendation:
- **Content.** The name, then the body-colour shape chip and the colour's name, e.g. "Olena ◆ green". This follows
  synthesis decision 6: on by default, with an option to hide the colour name. A nameplate never shows a role. The
  ADR allows a dissident to see their own teammates, but whether that reaches nameplates is a call for the humans and
  the designer (see the decisions below). For MVP, teammates stay on the role chip and the Tab screen only.
- **When.**
  - Within about 10 m, as a small, dimmed nameplate.
  - Full size when the crosshair is on that player (the existing crosshair raycast).
  - Always hidden by walls: `Label3D.no_depth_test` stays false.
  - Through-wall plates would break the hiding play (dissidents hide packages, and the ADR says hidden things are
    "hidden by sight only").
  - Fade by distance with `GeometryInstance3D.visibility_range_end` and `visibility_range_fade_mode`, which `Label3D` inherits.
  - Billboard on (`Label3D.billboard`), with an outline (`outline_size`) for legibility. All of these are in the
    4.7.2 dump.
- **Speaking.** A small speaker glyph lights only from audio this listener actually receives, per synthesis rule 7.
  Downed and dead players are heard by nobody, so their glyph never lights. The dead hear no voice, so a spectator
  sees no glyph lit either.
- **Downed.** The plate gets a "downed" icon and stays occluded like any other plate. A downed player
  within reach already gets "Hold E to raise" (`life_hud.gd`). Whether a downed marker should show through walls is a
  mechanics question for the designer (the `KnockedDown` position is public); it is not a UI default.
- **Invulnerable.** No change to the plate. The in-world shell (D8) already shows it.
- **Lobby.** Plates always on (no aim needed) with the ready tick, because meeting people is the point there.
- **Spectating.** Plates use the same rules, measured from the target's camera. The watched target has no plate of
  their own.

| Screen | States | Zone | Priority |
|---|---|---|---|
| World: nameplate (Label3D) | far (hidden), near (dim), aimed (full), speaking (heard), downed, lobby (always + ready tick), colour name hidden by option | in world, over the head | MVP (name + colour); speaking glyph MVP-lite; teammate mark: decision |
| Settings: nameplates | show colour name, nameplate size | Settings: accessibility | MVP-lite |

## (c) Gestures and emotes (ADR: post-MVP; reserve now)

How comparable proximity-voice games do it:
- **PEAK:** the R key opens an emote wheel with eight slots. Middle-click shows a pointing hand at the looked-at spot
  to all players ([PEAK Wiki, Emotes](https://peak.wiki.gg/wiki/Emotes) and [How to play](https://peak.wiki.gg/wiki/How_to_play), fan wiki, unconfirmed;
  [Game Rant](https://gamerant.com/peak-how-to-ping-emote/), unconfirmed). PEAK's hand ping is the same thing as the ADR's "a hand ping seen only
  in view".
- **Content Warning:** purchased emotes play on T, which is rebindable ([Game Rant](https://gamerant.com/content-warning-how-emote-guide/), unconfirmed).
- **Lethal Company:** only number keys, 1 to dance and 2 to point ([TheGamer](https://www.thegamer.com/lethal-company-emote-dance-guide/), unconfirmed).
- **R.E.P.O.:** six expressions on keys 5 to 0 that combine into 63 ([Steam guide](https://steamcommunity.com/sharedfiles/filedetails/?id=3512343763), unconfirmed;
  the fan wiki returned HTTP 402).

Recommendation:
- **Hold T to open a radial wheel** of 6 to 8 gestures; release to play the highlighted one. A tap without moving
  the mouse replays the last gesture.
- **Number keys 1–8** play gestures directly, as a shortcut and as the accessible alternative to the wheel.
- **Middle mouse:** the later hand ping.
- **Why not R or G.**
  - R sits right next to E, which is held for 3 s to raise, so a slip could open the wheel mid-raise.
  - G must never open the wheel. A living player holding it could be downed mid-hold, and hold G is give-up when downed.
- **While the wheel is open,** the mouse selects and the view stops turning, but WASD still moves. Opening the wheel
  never cancels a raise or drops an item.
- **When gestures are off.** No gestures while downed (crawl and give up only) or dead (no avatar). Which gestures
  work with a two-handed package is the designer's content question.
- **Godot:** there is no radial container. It is a custom `Control` drawn with `CanvasItem.draw_arc` and
  `draw_circle` (both in the 4.7.2 dump), with labels placed by angle.

| Screen | States | Zone | Priority |
|---|---|---|---|
| Gesture wheel | closed, open (hover slot n), cooldown, unavailable (downed, dead, hands full if the designer says so) | screen centre, over the crosshair | later (#73 era); reserve key T and number keys now |
| Hand ping (in world) | shown at the looked-at point, fades after a few seconds, only where in view | in world | later |
| Settings: controls | gesture wheel key, gesture 1–8 keys, ping key | Settings: controls | later |

## (d) Customization

Comparable games:
- **Among Us:** a laptop on a table in the pre-game lobby opens a Customize menu with colour, hats, skins and
  pets ([PC Gamer](https://www.pcgamer.com/how-to-customize-your-character-in-among-us/), unconfirmed).
- **PEAK:** customization uses a Passport item at the Airport lobby, which opens a menu with seven categories (skin
  colour, accessory, eyes, mouth, fit, hat, sash). The wiki also mentions an Airport mirror ([PEAK Wiki, Customization](https://peak.wiki.gg/wiki/Customization), unconfirmed).
- **Content Warning:** players walk to a "Type a Face" screen in the house and press E. The visor shows up to three
  typed characters in a chosen colour ([Charlie INTEL](https://www.charlieintel.com/games/how-to-customize-faces-in-content-warning-315316/), [Dexerto](https://www.dexerto.com/gaming/content-warning-how-to-change-faces-2624084/), unconfirmed).

The common pattern is **an in-world object that opens a 2D menu**. It is diegetic enough to be fun and a place
people gather, yet the menu itself stays a normal, readable screen.

Recommendation:
- **One "Wardrobe" screen with two entry points.**
  - MVP: a row in the Esc Lobby tab, as the synthesis already plans for body colour.
  - Later: an in-world wardrobe and mirror in the lobby that opens the same screen.
- **What to reserve in the wireframes now for #73:**
  - A large 3D preview area for the own avatar (left or centre).
  - A category rail. MVP has one category, Colour; #73 adds Mask, Mouth (animated by voice) and ready-made parts.
  - An item grid per category.
  - A "taken by NAME" state for body colours.
  - "Randomize" and "Done" buttons.
- **The animated mouth is an in-world speaking cue.** It follows synthesis rule 7: it moves on each listener's
  client only from audio that listener receives, so a downed or dead player's mouth never moves.

| Screen | States | Zone | Priority |
|---|---|---|---|
| Wardrobe (menu) | colour only (MVP), with categories (later), colour taken, preview idle/speaking | full-screen panel opened from the Esc Lobby tab | MVP (colour row); full screen later |
| Lobby: wardrobe/mirror object | prompt "[E] Customize", in use | in world (lobby) + crosshair prompt | later |

## (e) Strike and knockdown feedback

The rules decide most of this. Non-lethal hits are private, so the swing must look and sound identical to everyone
whether it hit or missed.

**Victim.**
- Show a fading, non-directional hurt vignette at the screen edges. It can be a `TextureRect` with a radial
  `GradientTexture2D` (`fill` is in the dump; synthesis §5 table), so no shader is needed.
- Play a short hurt sound as a 2D `AudioStreamPlayer` on the victim's own client only, never a 3D sound others hear,
  because others hearing it would confirm the hit.
- Add a small camera kick, scaled by a screen-shake setting.
- Show the health bar, since health is now below full.
- **No hit-direction arrow.** `Damaged` carries no direction. The only way to draw one would be for the client to
  match the same tick's public `Swung` events, which picks out one peer: it would point at the attacker without
  naming them. Treat it as a decision (below) and recommend no.

**Victim at knockdown.**
- The "Knocked down" panel already exists. Add a stronger vignette and a low-pass on the world bus, from
  `AudioServer.set_bus_effect_enabled` and `AudioEffectLowPassFilter` (cutoff on its parent `AudioEffectFilter`;
  in the dump).
- The camera already moves to third person above the body (ADR).
- Text names no cause and no attacker: "Knocked down", never "by NAME".

**Onlookers.**
- They see the public swing animation and hear the whoosh at the swinger. Neither ever changes on a hit: no spark,
  no blood, no hit sound on a non-lethal hit.
- On a knockdown they see the body fall, hear a thud at the victim, and get a toast "NAME was knocked down", with no
  "by" and no position.
- The attacker gets the same, and no hit marker (ARCHITECTURE "no hit confirmation", #32).

| Screen | States | Zone | Priority |
|---|---|---|---|
| Round HUD: hurt feedback (own) | hit (vignette + 2D sound + kick), low health (persistent faint vignette), knocked down (strong vignette + muffled world) | screen edge | MVP |
| World: swing and knockdown (everyone) | swing (same hit or miss), knockdown (fall + thud) | in world, 3D audio | MVP |
| Toast: knocked down | "NAME was knocked down" (no attacker, no place) | toast stack under the clock | MVP-lite |
| Settings: screen shake | 0–100% | Settings: accessibility | MVP-lite |

## (f) Dead-screen wording (texts are the humans' call; drafts only)

Today `life_hud.gd` shows "Dead", "Respawn in N s" and the cycle keys, and the HUD shows "Spectating NAME". The
missing lines explain the audio, so players do not think the game is broken (synthesis risk 3).

**Ukrainian cannot inflect a typed player name** ("навколо Олени" needs the genitive), so put the name in a separate
label slot and keep the sentence free of it. English then mirrors that structure so both share one layout.

| Slot | EN draft | UA draft |
|---|---|---|
| title | Dead · back in 23 s | Мертвий · повернення через 23 с |
| watching | Watching: Olena | Дивишся: Олена |
| hearing | Nobody hears you. You hear only the sounds around this player, and lift music. No voices. | Тебе ніхто не чує. Ти чуєш лише звуки поруч із цим гравцем і музику з ліфта. Голосів не чути. |
| keys | [LMB] next · [RMB] previous | [ЛКМ] наступний · [ПКМ] попередній |
| nobody | Nobody to watch. You hear only lift music. | Нема за ким дивитися. Чути лише музику з ліфта. |

"Мертвий" is gendered; a neutral "Тебе вибито" or an icon-plus-countdown title avoids that. This is a question for
the humans.

| Screen | States | Zone | Priority |
|---|---|---|---|
| Dead / spectate panel (wording) | watching, nobody to watch, target changed, respawn soon (last 3 s) | life panel + "Watching" label | MVP |

## (g) The lobby as a 3D space

The vision ADR's first pillar makes the lobby a place to play. Lobby UI splits between the world and the HUD.

**In the world (diegetic).**
- Players' bodies and nameplates, always on with a ready tick.
- Later: the wardrobe/mirror and a "board" wall object that mirrors the roster and ready ticks, a place to gather.
- Comparable games all use objects that open menus (Among Us laptop, PEAK Passport, Content Warning TV; sources in (d)).

**On the HUD (authoritative and accessible).**
- Ready stays on F with the HUD roster chip. A ready button that exists only in the world forces a walk and fails
  players who use the menus, so any world button is a second path.
- Host settings stay in the Esc Lobby tab (#169).
- The 5..1 countdown sits big in the centre.

| Screen | States | Zone | Priority |
|---|---|---|---|
| Lobby HUD (re-check) | roster chip, "[F] Ready" keycap, host join line, countdown | top-centre roster, centre countdown, bottom-left self cluster | MVP |
| Lobby world: ready board | names + ready ticks, countdown mirror | in world | later |
| Lobby world: wardrobe | see (d) | in world | later |

## Decisions for the humans (batch with the others)

1. **Teammate mark on nameplates for dissidents.** Options: none, with teammates listed only on the role chip and
   Tab screen; or a small mark on teammates' nameplates. Recommendation: none for MVP. It keeps one nameplate look for
   everyone and keeps role knowledge out of the world view.
2. **Hit-direction arrow for the victim.** Options: none; client-inferred from `Swung`; host-sent direction.
   Recommendation: none. It would effectively point at the attacker.
3. **Downed marker through walls.** Options: sight only; marker for everyone; marker for nearby players.
   Recommendation: sight only (the designer's mechanics call).
4. **Gesture key.** Options: hold T wheel plus 1–8; R like PEAK. Recommendation: T, as a technical choice already
   reported, so humans need to object only if they want something else.

## Gaps (not verified)

- PEAK's stamina bar position and R.E.P.O.'s HUD and expression controls (the fan wiki returned 402, dotesports 403).
- LOCKDOWN Protocol's nameplates and lobby customization: no primary source found.
- Lethal Company's vanilla nameplate distance (only the mod's README describes it).
- All game-behaviour claims above come from fan wikis or press guides, so all are unconfirmed. The Godot names are
  confirmed in the 4.7.2 dump; the shader route was not checked against the 4.7 docs, and none is needed here.
