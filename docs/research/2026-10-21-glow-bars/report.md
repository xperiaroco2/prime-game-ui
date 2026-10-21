# Glowing progress bars and line item icons (2026-10-21)

The engineer, 2026-10-21 (chat, translated): the glow he meant is on the progress bars, not on the item icon; the neon
item icons' shape is fine, but without the glow; keep researching. Two gatherers searched the web (text pages only,
nothing downloaded): one on glowing and alarm bars, one on line-icon construction. The page built on these findings is
`pages/glow-bars/` ("Світні смуги"). Claims not confirmed on a primary page say "(unconfirmed)"; our own inferences say
"(inference)".

## Building a glowing bar in Godot

- StyleBoxFlat draws exactly one soft shadow: a bar glow is a bright `shadow_color` with `shadow_offset` (0, 0) and a
  `shadow_size` in pixels. The default shadow colour is black at 0.6 alpha; nothing is drawn when `shadow_size` is below
  1. Corner radii and border widths are per side, so the glow follows a rounded end. This fits the Godot-safe rule (one
  shadow, no inset, no spread). [Godot: StyleBoxFlat](https://docs.godotengine.org/en/stable/classes/class_styleboxflat.html)
- ProgressBar has only two StyleBox slots, `background` (the track) and `fill`, plus `fill_mode` (four directions),
  `show_percentage` (default true) and an animated `indeterminate` mode. A leading-edge spark, ticks or an end-cap icon
  need child nodes (a small Panel at the fill's end, a TextureRect). Whether the bar's rect clips the fill's shadow is
  untested (unconfirmed). [Godot: ProgressBar](https://docs.godotengine.org/en/stable/classes/class_progressbar.html)
- Real bloom is a post-process, separate from StyleBox shadows: Rendering > Viewport > HDR 2D, and what glows is picked
  by raising Modulate or Self Modulate above 1. UI under a CanvasLayer is excluded, and Canvas Max Layer limits which
  layers glow. Blend modes: Additive is "too strong", Screen never brightens more than itself, Softlight is the weakest.
  Bloom falls outside the project's Godot-safe list, so it is a rule decision for the engineer.
  [Godot: environment and post-processing](https://docs.godotengine.org/en/stable/tutorials/3d/environment_and_post_processing.html)
- Unreal's progress bar has "Enable Fill Animation" so progress "has not stalled", but a solid colour shows no motion:
  the fill needs a pattern. A flat Godot-safe fill cannot show it, so motion must come from a moving child (spark, tick)
  or from pulsing the colour or the shadow.
  [Unreal: Break ProgressBarStyle](https://dev.epicgames.com/documentation/unreal-engine/BlueprintAPI/Utilities/Struct/BreakProgressBarStyle)
- Glow is additive, so on a bright background it barely shows; the usual fixes are an additive shader, post-processing
  or a bordered sprite under the glow (forum thread, no primary source; unconfirmed). A dark outline plus a hard ink
  shadow, which the sticker already has, is the safer base (inference).
  [Unity discussions](https://discussions.unity.com/t/emission-glow-with-unity-ui/590375)

## How games make a bar feel alive or alarmed

- A CC0 Godot health-bar shader pulses between `health_color` and `low_health_color` on a sine wave only below
  `low_health_threshold` (default 0.25), keeps a trailing bar for the value just lost (red) or healed (green), and marks
  the fill's end with a bright edge (`edge_color`, `edge_pixels`). It has no glow parameter: pulse, trail and edge do
  the work. [godotshaders: health bar](https://godotshaders.com/shader/health-bar/)
- Threshold-only pulsing is an old, standard pattern: Torque 3D's stock health bar has `pulseThreshold`, `pulseRate`
  and a separate `damageFillColor`. [Torque 3D: GuiHealthBarHud](https://torque3d.readthedocs.io/en/3.5/script/class/GuiHealthBarHud.html)
- Dead Space put the health bar on the suit's spine: a glowing segmented section that shows health by colour and by
  length, so colour is not the only channel (third-party coverage of Dino Ignacio's GDC 2013 talk; the GDC Vault page
  was behind a login). [Kill Screen](https://www.killscreen.com/how-dead-space-3-pulled-dieter-rams-and-instagram/)
  The bar steps its colour by health (aqua above 75%, green above 50%, yellow below 50%, red below 25%) and blinks near
  death (fan wiki via a search snippet; the page returned 402; unconfirmed).
  [Dead Space wiki](https://deadspace.fandom.com/wiki/Resource_Integration_Gear)
- Halo flashes its meters only in danger: in Reach a depleted shield shows "Warning" and low health flashes; Halo 5
  flashes emptied health red and slides a light across the shield while regeneration waits (search snippet; fetch
  refused; unconfirmed). [Halopedia](https://www.halopedia.org/Heads-up_display)
- Splatoon's ink-tank gauge flashes red when out of ink, in the team colour of the match (search snippet; 403;
  unconfirmed). [Inkipedia](https://splatoonwiki.org/wiki/Ink_tank)
- Minecraft's hearts use shape and motion as well as colour: they shake at 2 hearts or fewer, show the hearts just lost,
  bounce under Regeneration; status colours are the redundant layer. [Minecraft wiki: Health](https://minecraft.wiki/w/Health)
- Indie advice (opinion): pulse or flash the bar at low health, or pulse the screen edge; a busy screen can hide any
  bar effect. [itch.io post](https://itch.io/post/13271312) An opinion piece argues a red screen-edge vignette is
  distant and calm, so the alarm should sit on the bar too.
  [Giant Bomb](https://giantbomb.com/users/4289/articles/a-discussion-on-the-proper-display-of-health-in-vi)
- A free 2D health-bar asset flickers at full health and suggests dropping the bar's opacity at low health: a cheap,
  non-glow state cue (hobby source). [OpenGameArt: Health Bar 01](https://opengameart.org/content/health-bar-01)
- Doom Eternal answers "glow and colour that clash with the world" with options: HUD opacity, six colour profiles, three
  colourblind modes and a boss-gauge toggle.
  [Bethesda: Doom Eternal custom HUDs](https://slayersclub.bethesda.net/en/article/2V0erykuLGuV8a8GsmribP/doom-eternal-custom-huds)

## Accessibility limits

- Flashing: avoid flashing sequences over 5 s, more than three flashes a second over 25% of the screen, and large
  repeated patterns; a flash is a sharp brightness change or a change to or from red; offer a "screen flash effects"
  setting, never call it "epilepsy safe".
  [Game Accessibility Guidelines](https://gameaccessibilityguidelines.com/avoid-flickering-images-and-repetitive-patterns/)
- Xbox XAG 118: a flash is a luminance change of 10% or more with the darker value below 0.8; failure is more than about
  3 flashes a second or over about 20% of the screen; red is stricter; mitigate by lowering contrast, rate or area.
  [XAG 118](https://devdocs.xbox.com/gaming/accessibility/xbox-accessibility-guidelines/118)
- WCAG 2.3.1: no more than three flashes in any second unless below the thresholds; areas under 0.006 sr (about
  341x256 px at 1024x768) pass. A slow pulse (about 0.5 to 2 Hz) on a small bar is well inside (inference).
  [WCAG 2.3.1](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html)
- Colour is never the only channel: back it with shape, pattern, icon or label, and let players choose colours.
  [XAG 103](https://devdocs.xbox.com/gaming/accessibility/xbox-accessibility-guidelines/103)
- WCAG 1.4.11: 3:1 against adjacent colours for UI components and the graphics needed to understand them, measured on
  the markup's colours; thin lines render fainter, so choose pairs well above 3:1. Applied to a bar (inference): the
  fill reaches 3:1 against the track, and the glow is not the only separation.
  [WCAG 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)

## Line icons with character

- The big systems tie weight to radius: Sky's Skycons use 2 px on a 32 px grid (28 px live area), 1 px outer and 0 inner
  radius, a 2 px minimum gap, and "don't round every corner"; Primer (1.5 px, round caps and joins, 1 px radius) and
  Polaris (1.5 px, 1.25 px cut-outs, 0.25 px optical steps) come from search snippets (unconfirmed). A generic set is
  about 6 to 8% stroke to canvas; a heavier ~10% stroke is a deliberate deviation (inference).
  [Sky Skycons](https://sky-ui.cf.sky.com/skycons/design-guidelines)
- Stroke weight, caps, joins and corner radius are the personality dials: sharp corners read serious, round ones
  friendly, bevel joins taper. [Streamline: Stroke of genius](https://blog.streamlinehq.com/stroke-of-genius)
- Feather's defaults (2 px, round caps and joins, 24 grid, currentColor) are the template of the generic outline look;
  matching them exactly is what reads as soulless (inference). [Feather](https://github.com/feathericons/feather)
- Hand-made feel: one hand, one line character, a controlled wobble the same on every icon, pixel-snapped
  ([Roundicons](https://roundicons.com/hand-drawn-icons/), vendor page); vary width like pressure, slight asymmetry,
  bake the roughness in once ([flat-icons](https://flat-icons.com/what-are-hand-drawn-doodle-icons), vendor page).
- Cut one to three narrow gaps into a stroke, keep ornaments subordinate, perfect one icon first.
  [Streamline: icon to illustration](https://blog.streamlinehq.com/icon-to-illustration/)
- Outline plus one flat fill layer is a standard, buildable structure (duotone sets, HugeIcons' second colour at 40%,
  Phosphor's six weights from one 16 px drawing system), so its character must come from shape and colour.
  [Roundicons: filled outline](https://roundicons.com/filled-outline-icons/),
  [Phosphor](https://github.com/phosphor-icons/homepage)
- Silhouette first: fill each icon black and still tell it apart; minimal detail; one weight, grid and padding; design
  big, judge small over the real background. [Made Good Designs](https://madegooddesigns.com/?p=5494)
- An inked comic item set chose simple silhouettes and big open areas inside the lines for 32 to 64 px frames.
  [Inked Adventure Items devlog](https://stevencolling.itch.io/inked-adventure-items/devlog/74106/inked-adventure-items-released)
- Exaggerate the identifying feature for small screens (avatar-item guide).
  [Highrise: shape](https://create.highrise.game/learn/designer-resources/artguides/shape)
- Pixel-art item icons: draw at final size, readable without colour, 3 to 4 colours, a bright colour for important
  items. [Pathbits](https://app.pathbits.com/articles/designing-readable-item-icons-in-top-down-pixel-art)
- One outline approach for every asset, a shared dark tone rather than pure black (search summary; unconfirmed).
  [Sprite AI](https://www.sprite-ai.art/gallery/items)
- Light glyphs on dark look heavier: Material Symbols' grade -25 "reduces glare for a light symbol on a dark background".
  [Material Symbols](https://developers.google.com/fonts/docs/material_symbols)
- Keep the stock object shape; altering a standard icon's style weakens recognition.
  [NN/g: icon usability](https://www.nngroup.com/articles/icon-usability/)
- A set is identical stroke weight, one corner treatment, one focal point per icon, previewed at several sizes.
  [Noun Project blog](https://blog.thenounproject.com/?p=8558)

## Gaps

No GDC talk or developer interview confirmed the game examples first-hand; Halopedia, Inkipedia and the Dead Space
wiki refused the fetch (their claims are unconfirmed). Material 3, Apple HIG, Lucide, Carbon and ServiceNow Horizon
did not render as text. No first-party studio source on line-icon construction turned up.

## What the page takes from this (inference)

- The cheapest Godot-safe glow is one bright shadow on a ProgressBar StyleBox, over the sticker's ink outline.
- Light means trouble: glow only past a threshold, with a slow pulse (under 1 Hz) on a small area, and length, pulse
  and the siren as the other channels.
- Put the alarm glow on the track's shadow so it is as wide as the bar however short the fill; a dark track or plate
  gives the light a ground.
- Engine bloom is the only route to a true neon look and breaks the Godot-safe list: the engineer's decision.
- Icons: keep the stock silhouettes, one line weight, one flat fill per item; test each in black first.
