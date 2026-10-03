# DTCG 2025.10: the exact rules for our tokens

Research date: 2026-10-03, for prime-game-ui#5 (DTCG tokens and components for the Toy style). Read-only. The three
2025.10 modules were read as HTML, the two published JSON schemas as JSON, both fetched into a temp folder only; nothing
was saved into either repo. The project example in section 5 and a set of edge cases were checked with throwaway node
scripts (a small subset of a JSON Schema draft-07 validator run against the published schemas, and a small resolver);
"(checked with a subset validator)" marks results that rest on that script and not on a full JSON Schema implementation.
"(unconfirmed)" marks claims without a primary source I opened.

Quotes are kept to the operative clause. The specifications are published under the W3C Community Final Specification
Agreement, whose summary lets anyone "copy and distribute the Specification"
([FSA deed](https://www.w3.org/community/about/agreements/fsa/)).

Short links used below:
- **F** = [Format module 2025.10](https://www.designtokens.org/tr/2025.10/format/)
- **C** = [Color module 2025.10](https://www.designtokens.org/tr/2025.10/color/)
- **R** = [Resolver module 2025.10](https://www.designtokens.org/tr/2025.10/resolver/)
- **format.json** = [published format schema](https://www.designtokens.org/schemas/2025.10/format.json) (JSON Schema
  draft-07, not linked from the format page)
- **resolver.json** = [published resolver schema](https://www.designtokens.org/schemas/2025.10/resolver.json) (draft-07,
  linked from [R §4.4](https://www.designtokens.org/tr/2025.10/resolver/#schema))

## 0. The short version

- 2025.10 is a "Final Community Group Report" of 28 October 2025, declared stable, but not a W3C Standard
  ([F status](https://www.designtokens.org/tr/2025.10/format/#sotd)). A living draft dated 08 September 2026 already
  changes how `$ref` works and calls itself a preview not to implement
  ([drafts](https://www.designtokens.org/tr/drafts/format/#json-pointer-support)). We target 2025.10.
- **Every value is structured.** Colours are `{colorSpace, components, alpha?, hex?}`, dimensions `{value, unit}` with
  `px` or `rem`, durations `{value, unit}` with `ms` or `s`. A bare `"#ffc23a"`, `"16px"` or `"70ms"` is invalid.
- **Typography needs all five sub-values**, `letterSpacing` included; `lineHeight` is a plain number (a multiplier).
  **Shadow needs `spread`**; `inset` is optional. A shadow may be an array, which Godot cannot draw.
- **Every token must have a type** (own `$type`, nearest group `$type`, or the type of the token it aliases); a tool
  must never guess it from the value.
- **Aliases are whole strings** (`"{color.action.primary}"`), target tokens only, chain freely, must not loop, and must
  match the expected type. No string interpolation, no maths.
- **Modes live in the resolver** (`*.resolver.json`): `version: "2025.10"`, `sets` with `sources`, `modifiers` with
  `contexts` and an optional `default`, and a required `resolutionOrder`. Files merge in order, the last token wins,
  and aliases resolve only after the merge, so a base-set alias picks up whichever `textSize` or `motion` context is
  active. Our two modifiers give 4 permutations to validate.
- **The published schema is weaker and in places stricter than the prose**: it accepts untyped tokens, rejects
  `{group.$root}` references the prose shows, rejects named font weights under a group `$type`, and rejects gradient
  positions the prose says to clamp. The node validator must implement the rules itself.
- **Older tools still write the 2022 draft shapes**: hex strings, `"16px"`, `"100ms"`, string line heights, and
  Tokens Studio's own types (`sizing`, `spacing`, `borderRadius`, `boxShadow` with `x`/`y`). Style Dictionary's
  2025.10 support is still open ([issue #1590](https://github.com/style-dictionary/style-dictionary/issues/1590)) and
  v5 needs Node 22, while this repo runs node 20.

## 1. Files

| Rule | Quote and section |
|---|---|
| JSON | "Design token files are JSON" ([F §4](https://www.designtokens.org/tr/2025.10/format/#file-format)). The examples in the spec use comments and trailing commas, but examples are non-normative: "all authoring guidelines, diagrams, examples, and notes in this specification are non-normative" ([F §1](https://www.designtokens.org/tr/2025.10/format/#conformance)) |
| Media type | `application/design-tokens+json` SHOULD be used, `application/json` MAY; "Tools that can open design token files MUST support both media types." ([F §4.1](https://www.designtokens.org/tr/2025.10/format/#media-type-mime-type)) |
| Extension | `.tokens` or `.tokens.json` are recommended, not required; "Tools that can save design token files SHOULD append one of the recommended file extensions" ([F §4.2](https://www.designtokens.org/tr/2025.10/format/#file-extensions)) |
| Top level | The prose defines no root object of its own; every example root is an unnamed group. format.json models the root as a group: `$type`, `$description`, `$extensions`, `$extends`, `$deprecated`, `$root`, `$schema`, plus children whose names match `^[^${}.][^{}.]*$`, with `additionalProperties: false` |
| `$schema` in token files | Not in the 2025.10 prose. format.json allows it at the root only, with the note "$schema is not part of the official DTCG specification." The September 2026 living draft adds `"$schema": "https://www.designtokens.org/schemas/2025.10/format.json"` to its examples ([drafts](https://www.designtokens.org/tr/drafts/format/)) |
| Resolver file | "A resolver document MUST use standard JSON syntax" (tools MAY accept JSONC/JSON5 if convertible) ([R §3.1](https://www.designtokens.org/tr/2025.10/resolver/#format)); "Users SHOULD use the .resolver.json file extension" ([R §3.2](https://www.designtokens.org/tr/2025.10/resolver/#file-extension)); "users SHOULD use the expected application/json MIME type", not a custom one ([R §3.3](https://www.designtokens.org/tr/2025.10/resolver/#mime-type)) |
| `$schema` in resolver | Optional root property; the schema URL above is "present in most examples"; "This does not affect resolution behavior" ([R §4.4](https://www.designtokens.org/tr/2025.10/resolver/#schema)) |

No `color.json` schema exists (the URL returns 404); colour values are validated inside format.json
(`format/values/color.json`).

## 2. Groups and tokens

**Token or group.** "An object with a $value property is a token." Name and value: "Name and value are both required."
([F §5.1](https://www.designtokens.org/tr/2025.10/format/#name-and-value)). "A group is identified as a JSON object
that does NOT contain a $value property." An object with both `$value` and child tokens or groups is invalid: "Tools
MUST report this as an error." ([F §6.1](https://www.designtokens.org/tr/2025.10/format/#group-structure)). "Groups MAY
be empty" ([F §6.5](https://www.designtokens.org/tr/2025.10/format/#empty-groups)); tools SHOULD give a clear error
when an object looks like an incomplete token rather than an empty group (same section).

**Names.**
- "token and group names MUST NOT begin with the $ character." `{`, `}` and `.` "MUST NOT be used anywhere in a token
  or group name" ([F §5.1.1](https://www.designtokens.org/tr/2025.10/format/#character-restrictions)).
- "Token names are case-sensitive"; "Tools MAY display a warning when token names differ only by case."
  ([F §5.1](https://www.designtokens.org/tr/2025.10/format/#name-and-value)).
- A name must be a valid JSON string (same section). Spaces and `/` are allowed (the path table shows
  `{brand colors.primary}` and `{my/group.token}`,
  [F §7.4.6](https://www.designtokens.org/tr/2025.10/format/#path-examples)). format.json also rejects the empty name
  (checked with a subset validator).
- Tools "MUST validate that token names do not conflict with reserved properties"
  ([F §6.8](https://www.designtokens.org/tr/2025.10/format/#migration-and-compatibility)).
- No case convention is required. The colour module's naming advice (non-normative) recommends avoiding abbreviations,
  for example "background" over "bg" ([C §7.2.2](https://www.designtokens.org/tr/2025.10/color/#alias-tokens)).

**Token properties.** "$value is the only required property for a token"
([F §5.2](https://www.designtokens.org/tr/2025.10/format/#additional-properties)). format.json allows exactly `$value`,
`$type`, `$ref`, `$description`, `$extensions` and `$deprecated` on a token (`additionalProperties: false`), and
`$value` and `$ref` are mutually exclusive.

| Property | Rule |
|---|---|
| `$description` | "The value of the $description property MUST be a plain JSON string" ([F §5.2.1](https://www.designtokens.org/tr/2025.10/format/#description)); also allowed on groups |
| `$type` | Optional on a token, but the type must be determinable: if the value is a reference, "its type is the resolved type of the token being referenced"; otherwise the closest parent group's `$type`; otherwise "the token's type cannot be determined and the token MUST be considered invalid." "Tools MUST NOT attempt to guess the type of a token"; "The value of $type is case-sensitive." ([F §5.2.2](https://www.designtokens.org/tr/2025.10/format/#type-0)). It must be one of the 13 types: "every design token MUST use one of these types" ([F §8](https://www.designtokens.org/tr/2025.10/format/#types)) |
| `$extensions` | An object; "each tool MUST use a vendor-specific key" whose value may be any JSON; "The reverse domain name notation is recommended for this purpose."; tools "MUST preserve any extension data they do not themselves understand"; teams "SHOULD restrict their usage of extension data to optional meta-data" ([F §5.2.3](https://www.designtokens.org/tr/2025.10/format/#extensions)). Allowed on groups too ([F §6.3.2](https://www.designtokens.org/tr/2025.10/format/#extensions-0)) |
| `$deprecated` | `true` (deprecated), a string (deprecated, with the reason) or `false` (not deprecated, can override a group default) ([F §5.2.4](https://www.designtokens.org/tr/2025.10/format/#deprecated)). On a group: "This extends to all child tokens within the group unless explicitly overridden." ([F §6.3.1](https://www.designtokens.org/tr/2025.10/format/#deprecated-0)) |
| `$root` | "Groups support root tokens using the reserved name $root as the token name"; it is referenced as `{color.accent.$root}`, and `{color.accent}` is an invalid reference because it names a group ([F §6.2](https://www.designtokens.org/tr/2025.10/format/#root-tokens-in-groups), [F §6.7.2](https://www.designtokens.org/tr/2025.10/format/#path-construction)). **format.json's curly-reference pattern forbids a segment starting with `$`, so it rejects `"{color.accent.$root}"`** (checked with a subset validator) |
| `$extends` | Group only; "$extends MUST NOT reference a token." It is JSON Schema `$ref` sugar ([F §6.4](https://www.designtokens.org/tr/2025.10/format/#extending-groups)): copy the target group, local tokens at the same path win, and "the entire token definition is replaced (not merged property-by-property)" ([F §6.4.3](https://www.designtokens.org/tr/2025.10/format/#inheritance-semantics)). "Groups MUST NOT create circular inheritance chains." ([F §6.4.4](https://www.designtokens.org/tr/2025.10/format/#circular-reference-prevention)). Target written as `"{button}"` or a JSON Pointer `"#/button"` (format.json) |

**Type inheritance with `$extends`** follows a different precedence list: token `$type`, then the resolved group's
`$type` after extension, then parent groups ([F §6.7.3](https://www.designtokens.org/tr/2025.10/format/#type-inheritance)).
That list does not mention references, while §5.2.2 puts the referenced type before the group type. Our files avoid
the conflict by requiring the two to agree (validator checklist, item 17).

## 3. References

| Rule | Quote and section |
|---|---|
| Curly braces | `"{group.token}"` "always resolves to the $value property of the target token"; "Curly brace references can ONLY target complete tokens" ([F §7.1.1](https://www.designtokens.org/tr/2025.10/format/#curly-brace-syntax-token-references)). format.json only accepts a whole-string reference (`^\{…\}$`); `"{size}px"` is rejected (checked with a subset validator) |
| JSON Pointer `$ref` | "Tools implementing this specification MUST support JSON Pointer syntax." ([F §7.1.2](https://www.designtokens.org/tr/2025.10/format/#json-pointer-syntax-required-support)). As a whole token: `{ "$ref": "#/colors/blue/$value", "$type": "color" }` (§7.1.2) but `{ "$ref": "#/base" }` in [F §6.6.2](https://www.designtokens.org/tr/2025.10/format/#json-pointer-support): the two examples disagree on whether the pointer names the token or its `$value`. The living draft settles on the token ([drafts §7.1.2](https://www.designtokens.org/tr/drafts/format/#json-pointer-syntax-required-support)) |
| Property-level | "Property-level references require JSON Pointer syntax ($ref) and cannot be expressed using curly brace syntax." Example: `"components": [{ "$ref": "#/base/blue/$value/components/0" }, …]` ([F §7.3](https://www.designtokens.org/tr/2025.10/format/#property-level-references)) |
| Chains | "tools MUST follow each reference until they find a token with an explicit value" ([F §7.2.2](https://www.designtokens.org/tr/2025.10/format/#chained-references)) |
| Cycles | "References MUST NOT be circular." Tools must "detect and report this as an error affecting all tokens in the circular chain" ([F §7.2.3](https://www.designtokens.org/tr/2025.10/format/#circular-references)); the same holds for `$extends` and `$ref` ([F §6.7.4](https://www.designtokens.org/tr/2025.10/format/#circular-reference-detection)) |
| Type matching | Tools must report "Type mismatches: Referenced value incompatible with expected type" ([F §7.4.5](https://www.designtokens.org/tr/2025.10/format/#error-conditions-0), again in [§7.5.3](https://www.designtokens.org/tr/2025.10/format/#error-conditions-1)); the resolver repeats "An alias must point to the correct $type." ([R §6.3](https://www.designtokens.org/tr/2025.10/resolver/#aliases)) |
| Inside composites | Sub-values may be literals or "references to other design tokens that have the sub-value's type" ([F §9](https://www.designtokens.org/tr/2025.10/format/#composite-types)): a typography `fontSize` must point to a `dimension` token, `lineHeight` to a `number` token, a shadow `color` to a `color` token, and so on |
| Inside arrays | "References in arrays resolve to single values and do not cause array expansion or flattening." ([F §9.1](https://www.designtokens.org/tr/2025.10/format/#array-aliasing-in-composite-types)); the same section also says a referenced array becomes one element, so referencing an array-valued shadow inside a shadow array is unclear |
| Array indices | `{a.data.0}` cannot index an array (error); `#/a/data/0` can ([F §7.5.2](https://www.designtokens.org/tr/2025.10/format/#disambiguation-examples)) |
| When to resolve | Tools SHOULD keep references and resolve only when the value is needed ([F §7.2](https://www.designtokens.org/tr/2025.10/format/#reference-resolution)); with a resolver, "Aliases MUST NOT be resolved until this step", that is after all files are merged ([R §6.3](https://www.designtokens.org/tr/2025.10/resolver/#aliases)) |

## 4. Types

All 13 types: `color`, `dimension`, `fontFamily`, `fontWeight`, `duration`, `cubicBezier`, `number`, `strokeStyle`,
`border`, `transition`, `shadow`, `gradient`, `typography` (format.json `tokenType` enum). There is no `string`,
`boolean`, `fontSize`, `lineHeight` or `opacity` type. Format Example 12 uses `"$type": "string"`, which the enum
rejects. Composite tokens are strict: "Adding additional sub-values … make the composite token invalid"
([F §9.2](https://www.designtokens.org/tr/2025.10/format/#groups-versus-composite-tokens)).

### color ([C §4.1](https://www.designtokens.org/tr/2025.10/color/#format))
- `colorSpace (required)`: one of `srgb`, `srgb-linear`, `hsl`, `hwb`, `lab`, `lch`, `oklab`, `oklch`, `display-p3`,
  `a98-rgb`, `prophoto-rgb`, `rec2020`, `xyz-d65`, `xyz-d50`
  ([C §4.2](https://www.designtokens.org/tr/2025.10/color/#supported-color-spaces)).
- `components (required)`: 3 entries for every listed space, each a number or `"none"`. "The none keyword MAY be used
  in the components array" ([C §4.1.1.1](https://www.designtokens.org/tr/2025.10/color/#using-the-none-keyword)).
  Ranges: `srgb`, `srgb-linear`, `display-p3`, `a98-rgb`, `prophoto-rgb`, `rec2020`, `xyz-*`: each [0, 1]; `hsl` and
  `hwb`: hue [0, 360) then [0, 100], [0, 100]; `lab`: L [0, 100], a and b unbounded; `lch`: L [0, 100], C ≥ 0, hue
  [0, 360); `oklab`: L [0, 1], a and b unbounded; `oklch`: L [0, 1], C ≥ 0, hue [0, 360). The 2025.10 editor's note
  writes the hue range as "[0 - 360]" and then says 360 must not be used; the table and the draft use [0, 360).
- `alpha (optional)`: a number in [0, 1]; "If omitted, the alpha value of the color MUST be assumed to be 1".
- `hex (optional)`: a fallback that "MUST be formatted in 6 digit CSS hex color notation" (alpha stays in `alpha`).
  format.json: `^#[0-9a-fA-F]{6}$`.
- No extra keys (format.json `additionalProperties: false`).

```json
{ "$type": "color", "$value": { "colorSpace": "srgb", "components": [1, 0.7608, 0.2275], "hex": "#ffc23a" } }
{ "$type": "color", "$value": { "colorSpace": "srgb", "components": [0.1647, 0.1216, 0.2], "alpha": 0.86, "hex": "#2a1f33" } }
```

### dimension ([F §8.2](https://www.designtokens.org/tr/2025.10/format/#dimension))
`{ "value": number, "unit": "px" | "rem" }`. "$value.unit may only be "px" or "rem"." "$value.unit is still required
even if $value.value is 0." ([F §8.2.1](https://www.designtokens.org/tr/2025.10/format/#validation)). Negative values
are not forbidden. `em`, `%` and unitless numbers are invalid (Format Example 25 uses `"%"` and Example 14 uses
`"100px"`; both are non-normative and invalid).

```json
{ "$type": "dimension", "$value": { "value": 18, "unit": "px" } }
```

### duration ([F §8.5](https://www.designtokens.org/tr/2025.10/format/#duration))
`{ "value": number, "unit": "ms" | "s" }`; "$value.unit may only be "ms" or "s""
([F §8.5.1](https://www.designtokens.org/tr/2025.10/format/#validation-0)). The format does not forbid negative values
(format.json accepts them; checked with a subset validator).

```json
{ "$type": "duration", "$value": { "value": 70, "unit": "ms" } }
```

### cubicBezier ([F §8.6](https://www.designtokens.org/tr/2025.10/format/#cubic-bezier))
An array of exactly four numbers `[P1x, P1y, P2x, P2y]`; "the x coordinates are restricted to the range [0, 1]", and
y is any real number.

```json
{ "$type": "cubicBezier", "$value": [0, 0, 0.58, 1] }
```

### number ([F §8.7](https://www.designtokens.org/tr/2025.10/format/#number))
"The value MUST be a JSON number value." Used for unitless line heights and gradient positions.

```json
{ "$type": "number", "$value": 1.3 }
```

### fontFamily ([F §8.3](https://www.designtokens.org/tr/2025.10/format/#font-family))
A string, or an array of strings with "a single font name or an array of strings, each being a single font name",
ordered from most to least preferred. format.json forbids curly references as array items (only a JSON Pointer object
there).

```json
{ "$type": "fontFamily", "$value": "Comfortaa" }
```

### fontWeight ([F §8.4](https://www.designtokens.org/tr/2025.10/format/#font-weight))
A number in [1, 1000], or one of `thin`/`hairline` (100), `extra-light`/`ultra-light` (200), `light` (300),
`normal`/`regular`/`book` (400), `medium` (500), `semi-bold`/`demi-bold` (600), `bold` (700), `extra-bold`/`ultra-bold`
(800), `black`/`heavy` (900), `extra-black`/`ultra-black` (950). Anything else, "including ones that differ only in
case, are invalid and MUST be rejected by tools". Schema quirk: a named weight on a token whose type comes from its
group (`{ "$type": "fontWeight", "bold": { "$value": "bold" } }`) fails format.json, because without its own `$type`
the string matches both the fontFamily and the fontWeight shapes; a font family named "black" fails the same way
(checked with a subset validator). Numbers avoid this.

```json
{ "$type": "fontWeight", "$value": 700 }
```

### strokeStyle ([F §9.3](https://www.designtokens.org/tr/2025.10/format/#stroke-style))
Either a string ("String stroke style values MUST be set to one of the following, pre-defined values": `solid`,
`dashed`, `dotted`, `double`, `groove`, `ridge`, `outset`, `inset`), or an object ("Object stroke style values MUST
have the following properties"): `dashArray` (dimensions or dimension references) and `lineCap` (`round`, `butt`,
`square`) ([F §9.3.2](https://www.designtokens.org/tr/2025.10/format/#object-value)).

```json
{ "$type": "strokeStyle", "$value": "solid" }
```

### border ([F §9.4](https://www.designtokens.org/tr/2025.10/format/#border))
"The value MUST be an object with the following properties": `color` (color or reference), `width` (dimension or
reference), `style` (strokeStyle or reference). All three are required (format.json).

```json
{ "$type": "border", "$value": { "color": "{color.outline}", "width": { "value": 3, "unit": "px" }, "style": "solid" } }
```

### shadow ([F §9.6](https://www.designtokens.org/tr/2025.10/format/#shadow))
Either "a single shadow object with the properties defined below, or" "an array of shadow objects and/or references to
shadow tokens". Each object needs `color`, `offsetX`, `offsetY`, `blur` and `spread` (all required, also in
format.json); `inset` is "(optional)", a boolean, default false. In 2025.10 the array and `inset` are both valid
values; Godot's `StyleBoxFlat` draws one outer shadow without spread (lens 3 §4), so our profile forbids both.

```json
{ "$type": "shadow", "$value": { "color": "{color.action.primary-base}", "offsetX": { "value": 0, "unit": "px" },
  "offsetY": { "value": 5, "unit": "px" }, "blur": { "value": 0, "unit": "px" }, "spread": { "value": 0, "unit": "px" } } }
```

### gradient ([F §9.7](https://www.designtokens.org/tr/2025.10/format/#gradient))
An array of stops (or references to gradient tokens), each `{ color, position }`; `position` is a number in [0, 1] and,
outside it, "it MUST be considered as if it were clamped to the range [0, 1]". format.json instead rejects a position
outside [0, 1] (checked with a subset validator). There is no gradient kind or angle. We do not use gradients (Godot-safe
rule).

```json
{ "$type": "gradient", "$value": [ { "color": "{palette.ink}", "position": 0 }, { "color": "{palette.cream}", "position": 1 } ] }
```

### transition ([F §9.5](https://www.designtokens.org/tr/2025.10/format/#transition))
`duration` (duration or reference), `delay` (duration or reference), `timingFunction` (cubicBezier or reference); all
three required.

```json
{ "$type": "transition", "$value": { "duration": "{duration.press}", "delay": { "value": 0, "unit": "ms" }, "timingFunction": "{ease.out}" } }
```

### typography ([F §9.8](https://www.designtokens.org/tr/2025.10/format/#typography))
Exactly `fontFamily`, `fontSize` (dimension), `fontWeight`, `letterSpacing` (dimension) and `lineHeight` (number); all
five are required (format.json `required`), and `letterSpacing` is included. `lineHeight`: "The number SHOULD be
interpreted as a multiplier of the fontSize." There is no font style, text case or paragraph spacing. A percentage
line height (`"120%"`) is invalid.

```json
{ "$type": "typography", "$value": { "fontFamily": "{font.family.base}", "fontSize": "{font.size.body}",
  "fontWeight": 600, "letterSpacing": { "value": 0, "unit": "px" }, "lineHeight": 1.3 } }
```

## 5. The resolver module

**Root** ([R §4.1](https://www.designtokens.org/tr/2025.10/resolver/#root-level-properties)):

| Key | Type | Required | Rule |
|---|---|---|---|
| `version` | `"2025.10"` | yes | "it MUST be 2025.10" ([§4.1.2](https://www.designtokens.org/tr/2025.10/resolver/#version)) |
| `resolutionOrder` | array of reference objects, inline sets, inline modifiers | yes | "tokens later in the array overriding any tokens that came before them" ([§4.1.6](https://www.designtokens.org/tr/2025.10/resolver/#resolution-order)); resolver.json: at least 1 item |
| `sets` | map name → `{ description?, sources, $extensions? }` | no | "A set MUST contain a sources array"; sources are reference objects or inline token trees, merged in order; "Tools MUST respect array ordering." ([§4.1.4](https://www.designtokens.org/tr/2025.10/resolver/#sets)) |
| `modifiers` | map name → `{ description?, contexts, default?, $extensions? }` | no | `contexts` maps a context name to an array of sources (empty arrays allowed, [§4.1.6 Example 7](https://www.designtokens.org/tr/2025.10/resolver/#resolution-order)); "Tools MUST throw an error for modifiers with 0 contexts."; "Tools SHOULD throw an error for modifiers with only 1 context." (resolver.json requires 2); "a modifier MUST NOT reference any other modifier" ([§4.1.5.1](https://www.designtokens.org/tr/2025.10/resolver/#contexts)); `default`: "Tools MUST throw an error if the value is not present in contexts." ([§4.1.5.3](https://www.designtokens.org/tr/2025.10/resolver/#default)) |
| `name`, `description` | string | no | human-readable |
| `$schema` | string | no | see section 1 |
| `$defs` | object | no | "tools MUST NOT throw an error when encountering $defs"; ignore it if unsupported ([§4.5](https://www.designtokens.org/tr/2025.10/resolver/#defs)) |

resolver.json has `additionalProperties: false` at the root, so `$extensions` is allowed on sets and modifiers
([§4.3](https://www.designtokens.org/tr/2025.10/resolver/#extensions): "$extensions MUST be an object with the keys
being vendor-specific namespaces") but not on the root. The spec's Examples 14 and 17 write `"context"` instead of
`"contexts"` in places; the schema rejects that spelling (checked with a subset validator), so `contexts` is the key.

**Inline items** in `resolutionOrder` add `"type": "set" | "modifier"` and a unique `name`; "Tools MUST throw an error
in the case where name or type are missing"; "Inline sets and modifiers MUST NOT be referenced in any way."
([§4.1.6.1](https://www.designtokens.org/tr/2025.10/resolver/#inline-sets-and-modifiers)).

**Reference objects** `{ "$ref": "…" }` ([§4.2](https://www.designtokens.org/tr/2025.10/resolver/#reference-objects)):
"Tools MUST support same-document reference objects"; support for file paths (relative to the resolver document) and
remote URLs is up to each tool; "Reference objects MUST NOT be circular". Invalid pointers: only `resolutionOrder` may
point at `#/modifiers/…`, and nothing may point into `#/resolutionOrder/…`; "Tools MUST throw an error if encountering
any invalid pointers." ([§4.2.1](https://www.designtokens.org/tr/2025.10/resolver/#invalid-pointers)). Keys next to
`$ref` are overrides, and nested objects and arrays there are replaced, not merged: "tools MUST flatten these shallowly"
([§4.2.2](https://www.designtokens.org/tr/2025.10/resolver/#extending)).

**Inputs** ([R §5](https://www.designtokens.org/tr/2025.10/resolver/#inputs)): "Tools MUST accept inputs as a
JSON-serializable object" such as `{ "textSize": "large" }`; a tool SHOULD "throw an error if an accompanying input is
not provided"; "Inputs SHOULD be case-insensitive." ([§5.1](https://www.designtokens.org/tr/2025.10/resolver/#case-sensitivity));
"Inputs MUST have strings as their values." (`{ "beta": true }` is an error,
[§5.2](https://www.designtokens.org/tr/2025.10/resolver/#enforcing-strings)).

**How a tool resolves** ("Tools MUST handle the resolution stages in order",
[R §6](https://www.designtokens.org/tr/2025.10/resolver/#resolution-logic)):
1. *Input validation* ([§6.1](https://www.designtokens.org/tr/2025.10/resolver/#input-validation)): "Tools MUST require
   all inputs match the provided modifier contexts." An unknown modifier key, an unknown context, or a missing modifier
   that has no `default` is an error.
2. *Ordering* ([§6.2](https://www.designtokens.org/tr/2025.10/resolver/#ordering)): "Tools MUST iterate over the
   resolutionOrder array in order." A set contributes its sources in order; a modifier contributes only the chosen
   context's sources, in order. "In case of a conflict, take the most recent occurrence in the array." The example
   replaces the whole token. The spec does not say how group-level `$type` or `$description` merge across sources
   (unconfirmed; keep `$type` in every file that declares a group).
3. *Aliases* ([§6.3](https://www.designtokens.org/tr/2025.10/resolver/#aliases)): resolved only now, over the merged tree,
   exactly as in the format module (deep chains allowed, no cycles, correct `$type`).
4. *Resolution* ([§6.4](https://www.designtokens.org/tr/2025.10/resolver/#resolution)): the final token tree for that
   input. The number of possible results is the product of the context counts
   ([§4.1.5.4](https://www.designtokens.org/tr/2025.10/resolver/#resolution-count)).

Modifiers "MAY be orthogonal" (each touching its own tokens), and orthogonality reduces errors
([R §2.1](https://www.designtokens.org/tr/2025.10/resolver/#orthogonality)). Conformance also asks tools to "Maintain
additional token properties (e.g., $extensions) throughout the resolution process."
([R §8](https://www.designtokens.org/tr/2025.10/resolver/#conformance)).

### A complete example for prime-game-ui

A base set (primitives, semantic, components) and two orthogonal modifiers. Each context file defines the same token
paths, and no path is defined by both a modifier and the base set, so the order of the modifiers never matters. Values
come from `pages/styles/toy.css` (ink `#2A1F33`, cream `#FFF4E2`, yellow `#FFC23A`, honey `#C98A10`, the HUD plate at
86 % ink, a 3 px outline, an 18 px radius, a 5 px toy base dropping to 1 px when pressed) and
`pages/styles/motion-preview.css` (a 70 ms ease-out press). Font sizes and the large sizes are placeholders. All eight
files pass format.json or resolver.json, and all four inputs resolve with every alias and sub-value type matching
(checked with a subset validator and a throwaway resolver).

`tokens/prime.resolver.json`
```json
{
  "$schema": "https://www.designtokens.org/schemas/2025.10/resolver.json",
  "name": "prime-game UI tokens",
  "version": "2025.10",
  "description": "Toy style: one base set and two orthogonal modifiers.",
  "sets": {
    "base": {
      "description": "Primitives, then semantic tokens, then component tokens.",
      "sources": [
        { "$ref": "primitives.tokens.json" },
        { "$ref": "semantic.tokens.json" },
        { "$ref": "components.tokens.json" }
      ]
    }
  },
  "modifiers": {
    "textSize": {
      "description": "The player's text size setting.",
      "contexts": {
        "default": [{ "$ref": "text-size/default.tokens.json" }],
        "large": [{ "$ref": "text-size/large.tokens.json" }]
      },
      "default": "default"
    },
    "motion": {
      "description": "The player's reduced-motion setting.",
      "contexts": {
        "default": [{ "$ref": "motion/default.tokens.json" }],
        "reduced": [{ "$ref": "motion/reduced.tokens.json" }]
      },
      "default": "default"
    }
  },
  "resolutionOrder": [
    { "$ref": "#/sets/base" },
    { "$ref": "#/modifiers/textSize" },
    { "$ref": "#/modifiers/motion" }
  ]
}
```

`tokens/primitives.tokens.json` (literals only)
```json
{
  "$schema": "https://www.designtokens.org/schemas/2025.10/format.json",
  "palette": {
    "$type": "color",
    "ink": { "$value": { "colorSpace": "srgb", "components": [0.1647, 0.1216, 0.2], "hex": "#2a1f33" } },
    "cream": { "$value": { "colorSpace": "srgb", "components": [1, 0.9569, 0.8863], "hex": "#fff4e2" } },
    "yellow": { "$value": { "colorSpace": "srgb", "components": [1, 0.7608, 0.2275], "hex": "#ffc23a" } },
    "honey": { "$value": { "colorSpace": "srgb", "components": [0.7882, 0.5412, 0.0627], "hex": "#c98a10" } },
    "plate": {
      "$description": "HUD plates over the 3D world: ink at 86 % opacity.",
      "$value": { "colorSpace": "srgb", "components": [0.1647, 0.1216, 0.2], "alpha": 0.86, "hex": "#2a1f33" }
    }
  },
  "stroke": {
    "$type": "dimension",
    "thick": { "$value": { "value": 3, "unit": "px" } }
  },
  "radius": {
    "$type": "dimension",
    "large": { "$value": { "value": 18, "unit": "px" } }
  },
  "offset": {
    "$type": "dimension",
    "none": { "$value": { "value": 0, "unit": "px" } },
    "pressed": { "$value": { "value": 1, "unit": "px" } },
    "raised": { "$value": { "value": 5, "unit": "px" } }
  },
  "font": {
    "family": {
      "$type": "fontFamily",
      "base": { "$value": "Comfortaa" }
    },
    "weight": {
      "$type": "fontWeight",
      "semibold": { "$value": 600 },
      "bold": { "$value": 700 }
    },
    "line-height": {
      "$type": "number",
      "body": { "$value": 1.3 },
      "title": { "$value": 1.1 }
    },
    "tracking": {
      "$type": "dimension",
      "none": { "$value": { "value": 0, "unit": "px" } }
    }
  },
  "ease": {
    "$type": "cubicBezier",
    "out": { "$value": [0, 0, 0.58, 1] }
  }
}
```

`tokens/semantic.tokens.json` (references to primitives; `font.size.*` and `duration.*` come from the modifiers)
```json
{
  "color": {
    "$type": "color",
    "text": {
      "on-light": { "$value": "{palette.ink}" },
      "on-dark": { "$value": "{palette.cream}" }
    },
    "surface": {
      "panel": { "$value": "{palette.cream}" },
      "hud": { "$value": "{palette.plate}" }
    },
    "action": {
      "primary": { "$value": "{palette.yellow}" },
      "primary-base": { "$value": "{palette.honey}" }
    },
    "outline": { "$value": "{palette.ink}" }
  },
  "text-style": {
    "$type": "typography",
    "body": {
      "$value": {
        "fontFamily": "{font.family.base}",
        "fontSize": "{font.size.body}",
        "fontWeight": "{font.weight.semibold}",
        "letterSpacing": "{font.tracking.none}",
        "lineHeight": "{font.line-height.body}"
      }
    },
    "title": {
      "$value": {
        "fontFamily": "{font.family.base}",
        "fontSize": "{font.size.title}",
        "fontWeight": "{font.weight.bold}",
        "letterSpacing": "{font.tracking.none}",
        "lineHeight": "{font.line-height.title}"
      }
    }
  },
  "motion": {
    "$type": "transition",
    "press": {
      "$value": {
        "duration": "{duration.press}",
        "delay": { "value": 0, "unit": "ms" },
        "timingFunction": "{ease.out}"
      }
    }
  }
}
```

`tokens/components.tokens.json`
```json
{
  "button": {
    "primary": {
      "background": { "$type": "color", "$value": "{color.action.primary}" },
      "text": { "$type": "color", "$value": "{color.text.on-light}" },
      "border": {
        "$type": "border",
        "$value": { "color": "{color.outline}", "width": "{stroke.thick}", "style": "solid" }
      },
      "radius": { "$type": "dimension", "$value": "{radius.large}" },
      "shadow": {
        "$type": "shadow",
        "$description": "The solid toy base under the button.",
        "$value": {
          "color": "{color.action.primary-base}",
          "offsetX": "{offset.none}",
          "offsetY": "{offset.raised}",
          "blur": { "value": 0, "unit": "px" },
          "spread": { "value": 0, "unit": "px" }
        }
      },
      "shadow-pressed": {
        "$type": "shadow",
        "$value": {
          "color": "{color.action.primary-base}",
          "offsetX": "{offset.none}",
          "offsetY": "{offset.pressed}",
          "blur": { "value": 0, "unit": "px" },
          "spread": { "value": 0, "unit": "px" }
        }
      },
      "label": { "$type": "typography", "$value": "{text-style.body}" },
      "press": {
        "$type": "transition",
        "$value": "{motion.press}",
        "$extensions": { "io.github.xperiaroco2.prime-game": { "godotTween": { "trans": "cubic", "ease": "out" } } }
      }
    }
  }
}
```

`tokens/text-size/default.tokens.json` and `tokens/text-size/large.tokens.json` (same paths, different values)
```json
{ "font": { "size": { "$type": "dimension",
  "body": { "$value": { "value": 18, "unit": "px" } },
  "title": { "$value": { "value": 36, "unit": "px" } } } } }
```
```json
{ "font": { "size": { "$type": "dimension",
  "body": { "$value": { "value": 22, "unit": "px" } },
  "title": { "$value": { "value": 44, "unit": "px" } } } } }
```

`tokens/motion/default.tokens.json` and `tokens/motion/reduced.tokens.json`
```json
{ "duration": { "$type": "duration", "press": { "$value": { "value": 70, "unit": "ms" } } } }
```
```json
{ "duration": { "$type": "duration", "press": { "$value": { "value": 0, "unit": "ms" } } } }
```

Resolved results (38 tokens in each permutation):

| Input | `font.size.body` | `button.primary.label` fontSize | `duration.press` | `button.primary.press` duration |
|---|---|---|---|---|
| `{}` (both defaults) | 18px | 18px | 70ms | 70ms |
| `{ "textSize": "large" }` | 22px | 22px | 70ms | 70ms |
| `{ "motion": "reduced" }` | 18px | 18px | 0ms | 0ms |
| `{ "textSize": "large", "motion": "reduced" }` | 22px | 22px | 0ms | 0ms |
| `{ "textSize": "huge", "foo": "x" }` | errors: invalid context "huge" for modifier "textSize"; unknown modifier "foo" | | | |
| `{ "motion": true }` | error: input is not a string | | | |

The component tokens never change between files; they pick up the active context only because aliases resolve after
the merge. The `$extensions` key uses the reverse-domain form of the GitHub owner; DTCG only recommends reverse domain
notation, so the exact key is our convention.

## 6. What a conforming tool must do

**Errors it must raise (format).** An object with both `$value` and children
([F §6.1](https://www.designtokens.org/tr/2025.10/format/#group-structure)); a token whose type cannot be determined
([F §5.2.2](https://www.designtokens.org/tr/2025.10/format/#type-0)); out-of-range or unknown font weights
([F §8.4](https://www.designtokens.org/tr/2025.10/format/#font-weight)); circular aliases, `$extends` and `$ref`
([F §6.7.4](https://www.designtokens.org/tr/2025.10/format/#circular-reference-detection)); "Invalid syntax",
"Unresolvable paths", "Invalid token references" (curly braces on a non-token), "Circular references", "Type
mismatches" ([F §7.4.5](https://www.designtokens.org/tr/2025.10/format/#error-conditions-0)) and "Invalid property
paths" ([F §7.5.3](https://www.designtokens.org/tr/2025.10/format/#error-conditions-1)); `$extends` that cannot be
resolved, points at a token, cycles or breaks inherited constraints
([F §6.4.6](https://www.designtokens.org/tr/2025.10/format/#error-conditions)). A value that does not match its declared
type makes the token invalid, and an error SHOULD be shown ([F §8](https://www.designtokens.org/tr/2025.10/format/#types)).
Token names must not clash with reserved properties
([F §6.8](https://www.designtokens.org/tr/2025.10/format/#migration-and-compatibility)).

**Errors it must raise (resolver).** A version other than 2025.10; a modifier with 0 contexts (1 context: SHOULD); a
`default` that is not a context; an inline item without `name` or `type`, or with a duplicate name; invalid or circular
pointers; non-string inputs; inputs naming unknown modifiers or contexts; a missing input for a modifier without a
default (each quoted with its section in section 5).

**Things a tool must not treat as errors.** An empty group ([F §6.5](https://www.designtokens.org/tr/2025.10/format/#empty-groups));
a missing `alpha` (assume 1, [C §4.1](https://www.designtokens.org/tr/2025.10/color/#format)); a gradient position
outside [0, 1] (clamp, [F §9.7](https://www.designtokens.org/tr/2025.10/format/#gradient)); `$defs` in a resolver
([R §4.5](https://www.designtokens.org/tr/2025.10/resolver/#defs)); empty context arrays
([R §4.1.6](https://www.designtokens.org/tr/2025.10/resolver/#resolution-order)).

**Unknown `$extensions`.** In token files, tools "MUST preserve any extension data they do not themselves understand",
including writing it back on save ([F §5.2.3](https://www.designtokens.org/tr/2025.10/format/#extensions)). In a
resolver, extension data is metadata that each tool may use or ignore
([R §4.3](https://www.designtokens.org/tr/2025.10/resolver/#extensions)), and token `$extensions` must survive resolution
([R §8](https://www.designtokens.org/tr/2025.10/resolver/#conformance)).

**Number precision.** The format sets none: a number is "a JSON number value"
([F §8.7](https://www.designtokens.org/tr/2025.10/format/#number)), and the colour module's (non-normative) note says
"the numbers used to define each component can have any degree of precision"
([C §4.2](https://www.designtokens.org/tr/2025.10/color/#supported-color-spaces)). JSON itself lets implementations limit
range and precision, and recommends staying within IEEE 754 double precision; integers within ±(2^53 − 1) are exact
([RFC 8259 §6](https://www.rfc-editor.org/rfc/rfc8259#section-6)). NaN and Infinity cannot be written. For sRGB, 4
decimals (`round(byte / 255, 4)`) round-trip every 8-bit value exactly to `hex` (3 decimals also do; checked for all
256 values with node).

**Duplicate keys.** RFC 8259 says object names "SHOULD be unique"
([§4](https://www.rfc-editor.org/rfc/rfc8259#section-4)); `JSON.parse` keeps the last duplicate silently, so a
validator has to scan for duplicates itself.

## 7. What changed since the drafts older tools still follow

The 2022 Second Editors' Draft ([link](https://second-editors-draft.tr.designtokens.org/format/)) is the shape most
older tooling was built on. Style Dictionary's DTCG page still links `https://tr.designtokens.org/format/`, which now
redirects to the 2026 living draft (observed with curl).

| Topic | 2022 draft | 2025.10 |
|---|---|---|
| Colour | a hex string, `"#ff00ff"` or 8-digit `"#00000088"` with alpha ([draft §8.1](https://second-editors-draft.tr.designtokens.org/format/#color)) | an object; `hex` is an optional 6-digit fallback; alpha separate; 14 colour spaces |
| Dimension | a string `"0.25rem"` ([draft §8.2](https://second-editors-draft.tr.designtokens.org/format/#dimension)) | `{ "value": 0.25, "unit": "rem" }` |
| Duration | a string `"100ms"`, `ms` only ([draft §8.5](https://second-editors-draft.tr.designtokens.org/format/#duration)) | `{ "value": 100, "unit": "ms" }`, `ms` or `s` |
| `$type` | could also be `string`, `number`, `boolean`, `object`, `array`, `null`; an untyped token took its JSON type ([draft §5.4](https://second-editors-draft.tr.designtokens.org/format/#type-0)) | only the 13 types; an untyped token is invalid; `number` is a defined type |
| Shadow | one object, no `inset` ([draft §9.5](https://second-editors-draft.tr.designtokens.org/format/#shadow)) | an object or an array, optional `inset` |
| Typography | `lineHeight` a string, examples with `"700"` and `"42px"` strings ([draft §9.7](https://second-editors-draft.tr.designtokens.org/format/#typography)) | `lineHeight` a number, structured sub-values |
| Groups | no `$root`, `$extends`, `$deprecated` or `$ref` (none in the draft text) | all four exist |
| Files | `.tokens`, `.tokens.json`, `application/design-tokens+json` | unchanged |
| Modes | none | the resolver module |

**Style Dictionary.** Its DTCG page says the 2025.10 format is not fully supported and is "a work in progress in v5"
([DTCG page](https://styledictionary.com/info/dtcg/)). The tracking issue, open and updated 2026-09-29, ticks colour,
border, shadow and dimension, marks gradient and duration as in progress, and leaves resolvers unticked
([#1590](https://github.com/style-dictionary/style-dictionary/issues/1590)); which release ships each tick is
(unconfirmed). v5 needs Node 22 and only lets references point at tokens, with the `{`, `.`, `}` syntax fixed
([v5 migration](https://styledictionary.com/versions/v5/migration/)). Its built-in transforms are documented with
string values and with types 2025.10 does not have, for example `fontSize` and `asset`, and `size/px` adds "px" to a
number ([predefined transforms](https://styledictionary.com/reference/hooks/transforms/predefined/)). Its v3-to-DTCG
converter does not rename non-DTCG types such as `size` to `dimension` ([DTCG page](https://styledictionary.com/info/dtcg/)).

**Tokens Studio.** Its "W3C DTCG" format only adds the `$` prefix to `value`, `type` and `description` and blocks
`{`, `}`, `$` in names; the other DTCG types are promised for future releases
([token format](https://docs.tokens.studio/manage-settings/token-format)). It keeps 24 types, many unofficial (`sizing`,
`spacing`, `borderRadius`, `borderWidth`, `opacity`, `boolean`, `asset`, `text`, `other`, `composition`, `textCase`,
`textDecoration`, `paragraphSpacing`, plural JSON types such as `fontFamilies`, `fontWeights`, `lineHeights`, and
`boxShadow`), and its table lists `fontSize` as a DTCG type, which 2025.10 does not have
([token types](https://docs.tokens.studio/manage-tokens/token-types/)). Colours are strings (hex, `rgb()`, `rgba()`,
`hsla()`, 8-digit ARGB with alpha first), and non-hex input is stored as hex, with the DTCG spec given as the reason
([color](https://docs.tokens.studio/manage-tokens/token-types/color/)). Dimensions are strings such as `16px` or `1rem`,
and references can sit inside strings (`{unitless.number}px`, `rgba({colors.grey.900}, 0.06)`) or maths, none of
which 2025.10 allows ([dimension](https://docs.tokens.studio/manage-tokens/token-types/dimension/),
[color](https://docs.tokens.studio/manage-tokens/token-types/color/)). Box shadows still use `x` and `y`; renaming
them to `offsetX` and `offsetY` is an open request ([box shadow](https://docs.tokens.studio/manage-tokens/token-types/box-shadow)).
Line heights are written as `"100%"` with type `lineHeights` ([line height](https://docs.tokens.studio/manage-tokens/token-types/typography/line-height)).

## 8. Corrections to lens 3 (`docs/research/2026-10-02-wave-1/lens-3-system.md`)

| Lens 3 said | 2025.10 says |
|---|---|
| Schemas "reported at … format.json and resolver.json" (unconfirmed) | Confirmed: both exist as `application/json` draft-07 schemas. format.json is not linked from the format page; resolver.json is linked from R §4.4. There is no color.json (404) |
| Typography has letterSpacing "as I recall (unconfirmed)" | Confirmed, and **required**: all five sub-values are required ([F §9.8](https://www.designtokens.org/tr/2025.10/format/#typography), format.json) |
| Names may not start with `$` or contain `{`, `}`, `.` (unconfirmed from memory) | Confirmed ([F §5.1.1](https://www.designtokens.org/tr/2025.10/format/#character-restrictions)); names are also case-sensitive, and tools may warn on case-only differences |
| Shadow = `color`, `offsetX`, `offsetY`, `blur`, `spread`, `inset` | `spread` is required, `inset` optional (default false) |
| "JSON Pointer `$ref` reaches one property of another token" | Also a whole-token form exists; tools MUST support `$ref`, but the 2025.10 examples disagree on its target and the living draft changes it, so our files should not use it |
| `$type` required directly, by inheritance or through an alias | Correct; §5.2.2 and §6.7.3 order the sources differently when an alias sits in a typed group |
| Resolver: `sets` (token sources), contexts "mapping to token files" | Sets are objects with a `sources` array; contexts map to arrays of sources (files, inline tokens or `#/sets/…`); `version` and `resolutionOrder` are required, `default` optional; resolver files are `application/json` and `.resolver.json`; aliases resolve after the merge |
| "Dimensions in px only, durations in ms" | Our choice, not the spec's: `rem` and `s` are valid |
| Modes table with a `direction` modifier (a, b, c, d) | Obsolete: Toy is chosen ([ui-decisions](../../ui-decisions.md)); this wave's modifiers are `textSize` and `motion` |
| Style Dictionary 2025.10 support "still a work in progress" | Still true on 2026-10-03, with the #1590 status above; v5 also needs Node 22 |
| `$extends` = "deep-merge another group" | Yes, but a local token replaces the inherited token whole, and `$extends` must point at a group |
| A bare `"#ff0000"` is invalid; `hex` an optional fallback | Correct; `hex` must have 6 digits, and alpha lives in `alpha` |

## 9. Validator checklist

Rules for a zero-dependency node validator in this repo. **[spec]** = required by 2025.10 (or its published schema);
**[profile]** = our stricter project rule (Godot-safe CSS from `CLAUDE.md`, lens 3 §4, and simplicity). The published
schema is not enough on its own (sections 0 and 4): implement these rules directly and keep the schema URLs only for
editor hints.

**A. Files and JSON**
1. [spec] Parse every `*.tokens.json` and `*.resolver.json` as strict RFC 8259 JSON: no comments, no trailing commas.
2. [profile] Reject duplicate keys in any object (JSON.parse hides them; needs a small tokenizer).
3. [profile] Token files end in `.tokens.json`; the resolver ends in `.resolver.json`; every file is reachable from the
   resolver (no orphans).
4. [profile] `$schema` only at a file root, equal to the 2025.10 `format.json` or `resolver.json` URL.

**B. Names and structure**
5. [spec] No name starts with `$` (except the reserved properties) or contains `{`, `}` or `.`; no empty name.
6. [profile] Every name matches `^[a-z0-9]+(-[a-z0-9]+)*$` (lower kebab-case), which also rules out case-only
   duplicates, spaces, `/` and `~`.
7. [spec] An object with `$value` has no child objects.
8. [spec] A token holds only `$value`, `$type`, `$description`, `$extensions`, `$deprecated` ([profile] no `$ref`); a group
   holds only `$type`, `$description`, `$extensions`, `$deprecated` and child objects ([profile] no `$extends`, no
   `$root`).
9. [spec] Every non-`$` member of a group is an object.
10. [spec] `$description` is a string; `$deprecated` is a boolean or a string; `$extensions` is an object.
11. [profile] `$extensions` keys are `io.github.xperiaroco2.prime-game` only; any other key is a warning, and the tool
    never drops it ([spec] preserve).
12. [spec, SHOULD] Warn about an object that looks like an unfinished token (a `$type` or `$description` but no
    `$value` and no children).

**C. Types and values**
13. [spec] Every token has a type: its own `$type`, else the referenced token's type, else the nearest group `$type`;
    otherwise error. Never infer a type from the value.
14. [spec] `$type` is one of the 13 names, exact case.
15. [profile] Allowed types: `color`, `dimension`, `duration`, `cubicBezier`, `number`, `fontFamily`, `fontWeight`,
    `border`, `shadow`, `transition`, `typography`. No `gradient`; no standalone `strokeStyle`.
16. [spec] Composites have exactly their sub-values: border {color, width, style}; shadow {color, offsetX, offsetY, blur,
    spread, inset?}; transition {duration, delay, timingFunction}; typography {fontFamily, fontSize, fontWeight,
    letterSpacing, lineHeight}.
17. [profile] When a token's type is both inherited from a group and implied by an alias, the two must be equal.
    Component tokens carry an explicit `$type`.
18. color: [spec] `colorSpace` and `components` present, 3 components, `alpha` in [0, 1], `hex` 6-digit;
    [profile] `colorSpace` is `srgb`, components are numbers in [0, 1] (no `"none"`) with at most 4 decimals, `alpha`
    omitted when 1, `hex` required, lowercase, equal to `round(c × 255)` per channel.
19. dimension: [spec] `{value: number, unit}` with `px` or `rem`, unit present even for 0; [profile] `px` only and
    integers (in the 4.7.2 API dump `StyleBoxFlat.border_width_*`, `corner_radius_*`, `shadow_size` and
    `FontVariation.spacing_glyph` are `int`; `shadow_offset` and `content_margin_*` are floats, but integers keep the
    mock-ups and the theme identical).
20. duration: [spec] `{value: number, unit}` with `ms` or `s`; [profile] `ms` only, an integer ≥ 0.
21. cubicBezier: [spec] exactly 4 finite numbers, x1 and x2 in [0, 1].
22. number: [spec] a finite JSON number.
23. fontFamily: [spec] a string or a non-empty array of strings; [profile] one string naming a font whose licence is
    recorded in the repo (today: Comfortaa).
24. fontWeight: [spec] 1 to 1000 or the exact listed names; [profile] integers only, since named weights under a group
    `$type` fail the published schema.
25. border: [profile] `style` is `"solid"`.
26. shadow: [profile] one object (no array), `spread` 0, `inset` absent or false.

**D. References**
27. [spec] A reference is a whole string `{a.b.c}` whose path names an existing token (not a group); no interpolation,
    no maths, no array indices.
28. [spec] Follow chains to a literal; on a cycle, report every token in it.
29. [spec] The referenced token's type equals the referring token's type; a reference in a composite sub-value points
    to the sub-value's type (fontSize, letterSpacing, width, offsets, blur, spread → dimension; lineHeight → number;
    color → color; duration, delay → duration; timingFunction → cubicBezier; fontWeight → fontWeight; fontFamily →
    fontFamily; style → strokeStyle).
30. [profile] No references inside arrays.
31. [profile] Tier direction: primitives (and the modifier files, which are primitives too) hold literals only;
    semantic tokens reference primitives; component tokens reference semantic or primitive tokens, and a component
    colour always references a `color.*` semantic token.

**E. Resolver**
32. [spec] Root keys are only `$schema`, `name`, `version` (= `"2025.10"`), `description`, `sets`, `modifiers`,
    `resolutionOrder` (required, non-empty) and `$defs` (ignored).
33. [spec] A set has a `sources` array; a modifier has `contexts` with at least 1 entry ([spec SHOULD and schema] at
    least 2); `default`, if present, is one of the context names; `$extensions` only on sets and modifiers.
34. [spec] Reference objects resolve; sets and modifiers never point at `#/modifiers/…`; nothing points at
    `#/resolutionOrder/…`; no circular pointers; inline items carry `type` and a unique `name`. [profile] File
    references are relative paths inside `tokens/` and must exist.
35. [spec] Inputs: an object of strings; an unknown modifier, an unknown context or a missing modifier without a default
    is an error. [profile] Match case-insensitively, and forbid modifier or context names that differ only in case.
36. [spec] Merge in order (set sources, then the chosen context's sources, in `resolutionOrder` order); a later token
    replaces an earlier one whole; resolve aliases only after the merge; keep `$description` and `$extensions` in the
    resolved output.
37. [profile] Orthogonality: all contexts of a modifier define the same token paths; no path is defined by two
    modifiers; the base set never defines a modifier-owned path.
38. [profile] Resolve and validate every permutation (the product of the context counts; 2 × 2 = 4 today), not only the
    defaults.

**F. Output**
39. [profile] Report each problem with the file, the JSON Pointer inside the file and the token path, separate errors
    from warnings, and exit non-zero on any error.

## Sources

- Format module 2025.10: https://www.designtokens.org/tr/2025.10/format/
- Color module 2025.10: https://www.designtokens.org/tr/2025.10/color/
- Resolver module 2025.10: https://www.designtokens.org/tr/2025.10/resolver/
- 2025.10 index of modules: https://www.designtokens.org/tr/2025.10/
- Format schema: https://www.designtokens.org/schemas/2025.10/format.json
- Resolver schema: https://www.designtokens.org/schemas/2025.10/resolver.json
- Living drafts (preview, 08 September 2026): https://www.designtokens.org/tr/drafts/format/ ,
  https://www.designtokens.org/tr/drafts/color/ , https://www.designtokens.org/tr/drafts/resolver/
- Second Editors' Draft (14 June 2022): https://second-editors-draft.tr.designtokens.org/format/
- W3C Community Final Specification Agreement deed: https://www.w3.org/community/about/agreements/fsa/
- RFC 8259 (JSON): https://www.rfc-editor.org/rfc/rfc8259
- Style Dictionary DTCG page: https://styledictionary.com/info/dtcg/
- Style Dictionary v5 migration: https://styledictionary.com/versions/v5/migration/
- Style Dictionary predefined transforms: https://styledictionary.com/reference/hooks/transforms/predefined/
- Style Dictionary issue #1590 (read through the GitHub API as JSON): https://github.com/style-dictionary/style-dictionary/issues/1590
- Tokens Studio token format: https://docs.tokens.studio/manage-settings/token-format
- Tokens Studio token types: https://docs.tokens.studio/manage-tokens/token-types/
- Tokens Studio color, dimension, box shadow, line height:
  https://docs.tokens.studio/manage-tokens/token-types/color/ ,
  https://docs.tokens.studio/manage-tokens/token-types/dimension/ ,
  https://docs.tokens.studio/manage-tokens/token-types/box-shadow ,
  https://docs.tokens.studio/manage-tokens/token-types/typography/line-height
- Local: `docs/research/2026-10-02-wave-1/lens-3-system.md`, `docs/ui-decisions.md`, `pages/styles/toy.css`,
  `pages/styles/motion-preview.css`, `D:\prime-game\tools\out\godot-api\4.7.2\extension_api.json` (property types)
