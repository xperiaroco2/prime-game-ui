# Wordless 2D how-to cards: readability, AI tells, counter-techniques, ten styles

2026-10-22, for the how-to cards (prime-game#150; `docs/ui-decisions.md`, "The how-to cards in the game's own look").
The engineer rejected the first generated pilot (glossy 3D renders) as "AI slop" and asked for flat 2D cartoon cards
that a player would not take for AI images, explored wide first. Gathered by one web-research agent; claims carry a
link, "(unconfirmed)" marks what no primary source confirms, and unlinked lines are the agent's judgement.

## 1. What keeps wordless instructions readable
- **One step per picture, show don't tell.** Flat-pack manuals match the product's state at each step and use plain
  line drawings, grey only on key steps; a manual is good only if a tester builds the thing without text
  ([Zhuang](https://justinzhuang.com/posts/wordless-instructions/)).
- **Wordless is not self-evident.** An FAA study of 41 airline safety cards (785 participants) found a mean
  comprehension of 65%, from 28.8% to 96.3%; experienced flyers scored higher, so design for novices
  ([FAA 2008](https://www.faa.gov/data_research/research/med_humanfacs/oamtechreports/2000s/2008/200820)). Test the
  cards on someone who has never played.
- **The warning inside the action.** Only 19.6% of cards drew the "leave your bag" warning inside the evacuation
  action ([FAA/NTL](https://rosap.ntl.bts.gov/view/dot/58470)); its effect was not measured. For us: the burnt
  patty beside the good one, in the same frame.
- **Silhouette first, judged small.** Judge the silhouette at the small size
  ([Wayline](https://www.wayline.io/learn/game-ui-art)); chunky shapes and bold outlines survive, hairlines vanish
  ([Gamine](https://gamineai.com/blog/creating-game-icons-and-logos-design-principles-game-branding)); few shapes, no
  extremes of thick and thin ([Microsoft](https://learn.microsoft.com/en-us/WINDOWS/APPS/design/iconography/app-icon-design)).
  Check every frame at 160x120.
- **Consistent units, no extra meaning.** Isotype's repeatable pictograms
  ([Wikipedia](https://en.wikipedia.org/wiki/Isotype_(picture_language))); a symbol denotes no more than the fact needs
  ([Eye](https://eyemagazine.com/feature/article/talking-pictures1)). The patty and the herb glyph look the same in
  every frame; nothing decorative.
- **Action-to-action sequence:** one figure, one prop, one change per frame
  ([notes on McCloud](https://portfolio.newschool.edu/tingentsai/2019/11/06/transition-panels-reading-understanding-comics),
  secondary).
- Agent's conventions: one accent marks what to act on; the figure keeps its screen position; at most one arrow or
  motion mark; empty background; the object at 50–70% of the frame height.

## 2. What reads as AI-made
- **Aesthetic filtering, gloss:** an "ethereal quality", bright saturated colour, dramatic light, "airbrushed"
  ([Berkeley iSchool, Hany Farid](https://www.ischool.berkeley.edu/news/2024/certain-ethereal-quality-hany-farid-explains-why-ai-art-looks-way-it-does));
  the "glossy, over-saturated AI sheen" ([Lovart](https://www.lovart.ai/ru/blog/how-to-detect-ai-generated-content-design)).
- **Even detail density:** over-resolved backgrounds competing with the subject, several light sources, perfect light,
  symmetry, repetition, gibberish small text, no idea behind it (Lovart, above).
- **Smoothness and light:** "unnatural smoothness", inconsistent shadows, hands, garbled text, exaggerated expressions
  ([Speculative Chic](https://speculativechic.com/visual-tells-of-ai-generated-images-how-to-spot-them-in-2026/)).
- **Clutter:** tiny details that "don't add up to an idea"
  ([Creativepool](https://creativepool.com/magazine/features/how-to-avoid-making-creative-work-that-looks-like-ai.35166),
  unconfirmed: the page refused the read).
- **Slop in general:** "lacking in effort, quality, or meaning", banal realism, uncanny food
  ([Wikipedia](https://en.wikipedia.org/wiki/AI_slop)). Bokeh as a tell: anecdotal
  ([Shotkit](https://shotkit.com/ai-bokeh/)); rim glow: no source (unconfirmed).
- **Warm cast** in this model's output, fixed by asking for neutral white balance
  ([Korben](https://korben.info/en/fix-ai-color-balance-practical-solutions.html); the cause unconfirmed).
- **Default images:** models fall back on stable defaults of motif and style
  ([arXiv 2505.09166](https://arxiv.org/html/2505.09166v6)), so a generic "cute cartoon alien" drifts there.

## 3. Counter-techniques
- **Prompting:** name the medium, the shapes and the materials; "clean, vector-like shapes, a strong silhouette… flat
  design, minimal strokes, no gradients"; state exclusions and invariants explicitly
  ([OpenAI cookbook](https://developers.openai.com/cookbook/examples/multimodal/image-gen-1.5-prompting_guide)). Forbid
  by name: gradient, soft shading, glow, rim light, bokeh, 3D render, depth of field, text; ask for a plain
  background and neutral colour. Naming a print process (screenprint, riso, linocut) implies flatness (agent).
- **Human-made inputs, the strongest lever:** edits take one or more reference images
  ([OpenAI docs](https://developers.openai.com/api/docs/guides/image-generation)); style transfer "Use the same style
  from the input image…", sketch-to-render "Preserve the exact layout, proportions, and perspective… Do not add new
  elements or text" (cookbook, 5.3); a character anchor passed with every scene, "do not redesign the character"
  (cookbook, 6.4). Our own thumbnails can give the composition, a hand-made style sheet the style. Which reference
  wins on style is undocumented: test it.
- **Post-processing (agent):** downscale to the display size and snap to a fixed palette (kills gradients and glow);
  trace with [VTracer](https://github.com/visioncortex/vtracer) (MIT); a 1–2 px plate shift for print texture
  ([CCS](https://campus.collegeforcreativestudies.edu/imaging-center/?p=3493),
  [Calverts](https://www.calverts.coop/portfolio/risograph)).
- **Best-of-N** at 8–16 per step, judged at 160x120; one style sheet across a strip.

## 4. Ten style directions
Every prompt ends with a shared subject block; another step changes only its scene sentence. Names and prompts name no
game, film, studio, brand, artist or real person.

| # | Direction | Look | Palette | Why it resists the AI look | Risk |
|---|---|---|---|---|---|
| 1 | Three-ink screenprint | chunky shapes in three overprinted inks, slightly off-register, on paper | #F2E8D5 #E4572E #2A9D8F #2B2D42 | capped palette, flat overlaps | retro-poster cliché |
| 2 | Bold sticker outline | one thick even black outline, flat fills, four colours | #1B1B1B #FFD23F #6FF2B4 #FF6B6B #FFFFFF | reads small | a common AI default unless the line is strictly even |
| 3 | Isotype pictogram | solid faceless silhouettes from circles and rectangles | #1D1D1F #F4F1EA #6FF2B4 | geometry, no detail | cold for a party game |
| 4 | Flat-pack line art + accent | one even black line, white fills, mint only on the object to act on | #111111 #FFFFFF #6FF2B4 | the strongest readability (§1) | bland without charming proportions |
| 5 | Two-colour riso | pink and blue overprint, purple overlap, grain | #F4EFE6 #FF5C8A #2F5BEA #5B3FA0 | texture hides smoothness | misregistration blurs small frames |
| 6 | Paper cut-out | straight scissor-cut flat pieces, one hard offset shadow | #F6E7CB #E76F51 #2A9D8F #264653 #E9C46A | a few simple polygons | the model adds paper-fibre rendering |
| 7 | Hand-inked noodle-limb cartoon | slightly irregular black ink, dot eyes, cream, one spot red | #F3E9D2 #1A1A1A #D62828 | line wobble | "vintage" brings sepia and grain |
| 8 | Crayon picture book | waxy scribble fill inside a wobbly outline | #FFF6E0 #3D3D3D #F4A261 #2A9D8F #E76F51 | human imperfection | imprecise at 160x120 |
| 9 | Native low-res pixel art | 16 colours, 1 px outline, no anti-aliasing | #2A2540 #6FF2B4 #F8E16C #E4572E #FFFFFF | deterministic after palette snapping | the model fakes pixels: snap in post |
| 10 | Linocut | black carved shapes, sparse white cuts, one offset flat block | #17141F #F2EBDD #6FF2B4 | hard two-tone, no mid-tones | dense cuts clog when small |

The agent's bets: **4** (readability, and our own sketches can feed it), **1** (capped palette, warm, survives
quantising), **9** (fits the 160x120 display and the tile); reserve **5**. The prompts as run are in the art track's
batch `2026-10-22-howto-styles-r1` (prime-game-art `batches/`).
