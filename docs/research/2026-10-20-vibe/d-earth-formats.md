# Lens D: aliens redo Earth formats (gatherer report, 2026-10-20)

About 39 tool calls; no images fetched; image URLs were found in page HTML. Broadcast sources are described by genre.

## 1. Broadcast graphics
- **Late-night talk-show package, Trollbäck + Company**: an "energized, neon-accented brand package", clean modern type
  with hand-drawn neon lettering, the open shot in camera with Pixelsticks
  ([source](https://trollback.com/projects/late-late-show-james-corden/)). Take: a clean grotesk beside ONE hand-made
  personality lettering; neon is a colour and outline decision, not glow. Images:
  [1](https://cdn.sanity.io/images/1pn9obcz/production/e6550c55870f54902b1360e2e7f1626dfebcc610-1920x1080.jpg?auto=format&q=80&w=600),
  [2](https://cdn.sanity.io/images/1pn9obcz/production/aff2f591f592009adb57a55ae67228a7a91ee64a-1920x1080.jpg?auto=format&q=80&w=600),
  [3](https://cdn.sanity.io/images/1pn9obcz/production/39793ba425c2e0c05ebcc521c2ffdd17042c3ab4-960x1080.jpg?auto=format&q=80&w=600).
- **Talk-show identity, Pentagram**: the whole logotype inside one circular shape, usable as photo or flat graphic
  ([source](https://pentagram.com/work/the-tonight-show-starring-jimmy-fallon/story)). Take: one container silhouette
  reused by every reveal, badge and sticker (a saucer disc for us).
- **Sports packages and lower thirds**: about 20 elements in one consistent system
  ([METAphrenie](https://www.metaphrenie.com/projects/nhl-wednesday-night-rivalry)); lower thirds must fit long names
  ([School of Motion](https://schoolofmotion.com/blog/sports-lower-thirds)); a package reads in 1-2 s
  ([Fiveable](https://fiveable.me/sports-reporting-and-production/key-terms/graphics-package)). Take: one fixed
  announcement plate with autoscaling text that survives long Ukrainian strings.
- **Shopping channels**: a falling-price auction graphic and struck "was" against "now"
  ([source](https://en.wikipedia.org/wiki/Shop_at_Bid)); hosts' sales screens refresh every 3-5 s
  ([source](https://www.tampabay.com/archive/1993/11/29/zing-go-the-hosts-ring-go-the-phones-ping-go-hsn-sales/)).
  Take: urgency data as a character. On-air graphics conventions beyond that: (unconfirmed).

## 2. Appliance, dashboard and arcade displays
- **VFD**: very bright, high contrast, common phosphor peak 505 nm (blue-green); seven-segment, alphanumeric and
  dot-matrix; fixed icons scanned like segments; microwaves, VCRs, car dashes, hi-fi, arcades
  ([source](https://en.wikipedia.org/wiki/Vacuum_fluorescent_display)). Take: one phosphor colour per device, a fixed
  pictogram strip that limits what the device can say (its mania). Images:
  [car dash](https://thumb.wikimedia.org/wikipedia/commons/thumb/d/db/Vfd_car.jpg/500px-Vfd_car.jpg),
  [hi-fi](https://thumb.wikimedia.org/wikipedia/commons/thumb/4/40/VFD2.jpg/250px-VFD2.jpg).
- **Pachinko and arcade**: only patent search summaries; take "anticipation theatre" (spin, tease, reveal) for the car
  and mutation reveals (unconfirmed as design analysis).
- **Lethal Company**: flat colour, blue/green information and red/orange alarms, simple shapes, a code-editor font,
  information only when needed ([source](https://indieklem.substack.com/p/11-whats-behind-the-interface-of)). Take:
  restraint. Images:
  [UI](https://substack-post-media.s3.amazonaws.com/public/images/e77ab074-0992-462e-8b94-2d8d265cd7f3_2912x1632.png),
  [Steam](https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1966720/ss_568d97dfa9d8d3128157d84c9437030ccc1011b0.1920x1080.jpg?t=1775380053).

## 3. Constructed scripts
- **Tunic**: glyphs evoke being somewhere you do not belong; context carries meaning
  ([source](https://www.gamedeveloper.com/design/designing-content-for-no-one-an-interview-with-the-team-behind-tunic);
  the page notes later corrections).
- **Chants of Sennaar**: logographic, radicals mark word type, form borrowed from real scripts
  ([1](https://thelanguagecloset.com/2024/12/07/playing-chants-of-sennaar/),
  [2](https://www.gonintendo.com/contents/31644-chants-of-sennaar-devs-explain-how-the-game-s-fictional-languages-were-developed)).
  Take: a small radical set plus a frame shape, an icon family rather than text.
- **Heaven's Vault**: words from a few primitives
  ([source](https://www.thesixthaxis.com/2018/04/27/interview-talking-with-inkles-about-deciphering-ancient-language-in-heavens-vault/), search summary).
- **Fez**: geometric glyphs; digits as open sides of a square ([source](https://www.giantbomb.com/games/3030-24768/)).
  Take: an open-sided square cell, a StyleBoxFlat with per-side borders.

## 4. Diegetic formats and devices as characters
Pacific Drive's car as companion ([Steam](https://store.steampowered.com/app/1458140/Pacific_Drive/)); Content
Warning's video-site loop as the score ([Steam](https://store.steampowered.com/app/2881650/Content_Warning/)); Job
Simulator's misread jobs ([Steam](https://store.steampowered.com/app/448280/Job_Simulator/)); Untitled Goose Game's
to-do list as structure; Portal 2's corporate voice on absurd content (a secondary reading,
[source](https://madegooddesigns.com/portal-font/)).

## Fonts checked
Rubik Mono One OFL with Cyrillic ([METADATA](https://raw.githubusercontent.com/google/fonts/main/ofl/rubikmonoone/METADATA.pb));
Martian Mono OFL with Cyrillic ([METADATA](https://raw.githubusercontent.com/google/fonts/main/ofl/martianmono/METADATA.pb));
VT323 has no Cyrillic, out ([METADATA](https://raw.githubusercontent.com/google/fonts/main/ofl/vt323/METADATA.pb)).

## Proposals
- **A. Alien home-shopping channel** (overlay): the party sold live; announcements as lower thirds with struck "was",
  flashing "now", absurd stock counters. Rubik Mono One headlines, Martian Mono numerals; dark violet frame, one acid
  band per plate, the player's hue as a chip, one hard shadow. Risk: loud, and childish if saturated like Toy; show
  only on events. Godot-safe.
- **B. Misread appliance LCD/VFD** (in-world): near-black glass, one phosphor colour per device, unlit ghost segments
  as a dimmer solid, one mad accent, rounded vinyl bezels and a "slay" reveal state against the nostalgic risk.
  Godot-safe (ghost segments are a second Label).
- **C. Glyph sign kit** (both): a frame plus 3-5 radicals, always captioned; own-work icons. Godot-safe.
- Pairing: B in-world, A on screen, C as the thread.

## Gaps
No primary source for shopping-channel graphics, pachinko UI, Portal 2 UI, Two Point Hospital, Viewfinder, the Nomai
or No Man's Sky glyph design.
