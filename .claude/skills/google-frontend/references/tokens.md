# Tokens

Exact values for the Google marketing web and Material Design 3. Read this first; every other
reference assumes these names.

## Contents

1. [Typefaces](#1-typefaces)
2. [Type scale — marketing register](#2-type-scale--marketing-register)
3. [Type scale — Material 3 product register](#3-type-scale--material-3-product-register)
4. [Colour — the Google palette](#4-colour--the-google-palette)
5. [Colour — semantic roles](#5-colour--semantic-roles)
6. [Colour — Material 3 tonal roles](#6-colour--material-3-tonal-roles)
7. [Layout, grid, breakpoints](#7-layout-grid-breakpoints)
8. [Spacing](#8-spacing)
9. [Shape](#9-shape)
10. [Elevation](#10-elevation)
11. [Motion](#11-motion)
12. [Icons](#12-icons)

---

## 1. Typefaces

**Google Sans Flex** is the authentic choice and, since late 2025, is released under the SIL Open
Font License and available on Google Fonts. It is a variable font with axes for weight (`wght`
1–1000), width (`wdth` 25–151), optical size (`opsz` 6–144), slant (`slnt` -10–0), grade (`GRAD`)
and roundness (`ROND`). Before this release, everyone approximated Google's look with Inter or
Roboto; that workaround is no longer necessary.

```css
/* Verify the exact snippet at fonts.google.com — the CSS2 API axis syntax
   changes with the axes a font exposes. Pattern: */
@import url('https://fonts.googleapis.com/css2?family=Google+Sans+Flex:wght@100..900&display=swap');
```

Self-hosting via Fontsource is the more deterministic route and avoids a third-party request:

```bash
npm install @fontsource-variable/google-sans-flex
```
```js
import '@fontsource-variable/google-sans-flex/wght.css';
```
```css
font-family: 'Google Sans Flex Variable', sans-serif;
```

**Stack.** Always ship a fallback chain, because the variable font is a real payload and FOUT on
a display headline is very visible:

```css
--gfs-font-brand: 'Google Sans Flex', 'Google Sans', 'Roboto Flex', Roboto,
                  system-ui, -apple-system, 'Segoe UI', Arial, sans-serif;
--gfs-font-plain: 'Google Sans Flex', 'Google Sans Text', Roboto,
                  system-ui, -apple-system, Arial, sans-serif;
--gfs-font-mono:  'Google Sans Code', 'Roboto Mono', ui-monospace, monospace;
```

Google itself splits *brand* (display, headlines) from *plain* (body, labels) — historically
Google Sans versus Google Sans Text. With Google Sans Flex you can use one family for both and
differentiate with the optical-size axis instead, which is the more modern approach:
`font-variation-settings: 'opsz' 96;` on display type, `'opsz' 16` on body.

**Fallbacks if Google Sans Flex is unavailable or the client has a licence constraint:** Inter is
the closest free match, then DM Sans, then Roboto. Note that swapping the face changes the
metrics — re-check your `letter-spacing`, which should go to `0` or slightly positive with Inter
where Google Sans Flex wants negative tracking on large sizes.

**Never** use Product Sans. It is Google's logotype face, restricted to Google's own product
logos, and is not licensable.

---

## 2. Type scale — marketing register

This is the scale for landing pages and product pages, and it is *not* the Material 3 scale. It is
fluid, larger at the top end, and set at light-to-medium weights.

| Role | Size | Weight | Line height | Tracking | Colour |
|---|---|---|---|---|---|
| Hero display | `clamp(2.5rem, 6vw, 4.5rem)` | 400 | 1.08 | `-0.02em` | `#202124` |
| Section headline | `clamp(2rem, 4vw, 3rem)` | 400 | 1.15 | `-0.015em` | `#202124` |
| Band headline (product spotlight) | `clamp(1.75rem, 3vw, 2.5rem)` | 400 | 1.2 | `-0.01em` | `#202124` |
| Card headline | `clamp(1.25rem, 2vw, 1.5rem)` | 500 | 1.3 | `-0.005em` | `#202124` |
| Eyebrow / category label | `0.875rem` (14px) | 500 | 1.4 | `0` | `#5f6368` |
| Lead paragraph | `clamp(1rem, 1.5vw, 1.25rem)` | 400 | 1.5 | `0` | `#5f6368` |
| Body | `1rem` (16px) | 400 | 1.5 | `0` | `#5f6368` |
| Small / caption | `0.875rem` (14px) | 400 | 1.45 | `0` | `#5f6368` |
| Legal / footnote | `0.75rem` (12px) | 400 | 1.5 | `0` | `#80868b` |
| Button label | `0.875rem`–`1rem` | 500 | 1 | `0.01em` | contextual |

Rules that matter more than the numbers:

- **Weight 400 for anything above 2rem.** Increase weight only as size *decreases*. A 14px eyebrow
  at 500 and a 64px hero at 400 is correct and looks intentional; the reverse looks like Bootstrap.
- **Negative tracking scales with size.** `-0.02em` at hero, `-0.01em` mid, `0` at body, and never
  negative below 20px.
- **Measure caps at ~60ch for body, ~20ch for display.** Google hero headlines are 3–6 words and
  frequently break across two lines deliberately — use `<br>` or `text-wrap: balance`.
- **`text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs.** Cheap and noticeably
  more Google-like, because their headlines are always visually balanced.

## 3. Type scale — Material 3 product register

The 15-style baseline scale, for components and denser UI. M3 also defines 15 *emphasized* styles
(same scale, higher weight) added in the M3 Expressive update — use those for selection states,
actions, and editorial emphasis, paired with the baseline styles rather than replacing them.

| Token | Size | Weight | Line height | Tracking |
|---|---|---|---|---|
| display-large | 57px | 400 | 64px | -0.25px |
| display-medium | 45px | 400 | 52px | 0 |
| display-small | 36px | 400 | 44px | 0 |
| headline-large | 32px | 400 | 40px | 0 |
| headline-medium | 28px | 400 | 36px | 0 |
| headline-small | 24px | 400 | 32px | 0 |
| title-large | 22px | 400 | 28px | 0 |
| title-medium | 16px | 500 | 24px | 0.15px |
| title-small | 14px | 500 | 20px | 0.1px |
| body-large | 16px | 400 | 24px | 0.5px |
| body-medium | 14px | 400 | 20px | 0.25px |
| body-small | 12px | 400 | 16px | 0.4px |
| label-large | 14px | 500 | 20px | 0.1px |
| label-medium | 12px | 500 | 16px | 0.5px |
| label-small | 11px | 500 | 16px | 0.5px |

CSS naming convention, if you want to match Material Web:
`--md-sys-typescale-<scale>-<size>-<property>`, e.g. `--md-sys-typescale-body-medium-size`.

---

## 4. Colour — the Google palette

The ramp Google uses across its web properties. Steps 600/700 are the accessible action colours;
50–200 are the tint/background steps.

**Grey — the backbone. You will use these more than anything else.**

| Step | Hex | Use |
|---|---|---|
| 50 | `#f8f9fa` | Default tinted section background, card fill |
| 100 | `#f1f3f4` | Second-level tint, chip background, image plate |
| 200 | `#e8eaed` | Divider on tinted surfaces |
| 300 | `#dadce0` | **The border colour.** Hairlines, outlined buttons, field borders |
| 500 | `#9aa0a6` | Disabled text, legal copy, placeholder |
| 700 | `#5f6368` | **Secondary text.** All supporting copy, eyebrows, icons |
| 800 | `#3c4043` | Dark surfaces, hover state on dark |
| 900 | `#202124` | **Primary text.** Headlines, body on white. Never `#000`. |

**Blue — the action colour.**

| Step | Hex | Use |
|---|---|---|
| 50 | `#e8f0fe` | Selected/tonal button background, info surface |
| 100 | `#d2e3fc` | Tonal hover |
| 600 | `#1a73e8` | **Primary.** Filled buttons, links, focus ring |
| 700 | `#1967d2` | Hover on primary |
| 900 | `#174ea6` | Pressed, or text on very light blue |

**Red / Yellow / Green — status only.**

| Colour | 600 | 700 | 800/900 (text on the 50 tint) | 50 (surface) |
|---|---|---|---|---|
| Red (error, destructive) | `#d93025` | `#c5221f` | `#a50e0e` | `#fce8e6` |
| Yellow (warning) | `#f9ab00` | `#f29900` | `#e37400` | `#fef7e0` |
| Green (success) | `#1e8e3e` | `#188038` | `#0d652d` | `#e6f4ea` |

Use the 800/900 step, not the 700, for small text on the matching 50 tint — the 700-on-50 pairing
is the intuitive choice and it fails AA at 12–14px. Yellow needs care in any case: no yellow step
has enough contrast on white for text, so warnings must carry an icon and dark text.

**Brand four-colour — identity, not UI.**

`#4285f4` blue · `#ea4335` red · `#fbbc04` yellow · `#34a853` green

These are the logo colours. Correct uses: a logo mark, a single decorative illustration, a loading
indicator that cycles through them, an accent underline on one word. Incorrect: four feature cards
each in one of the four colours, a four-colour gradient hero, coloured section backgrounds. That
pattern is a Google *parody*, not a Google page, and it is the most common tell of an imitation.

---

## 5. Colour — semantic roles

Map the palette to roles and use the roles. This keeps a page consistent and makes a dark mode
tractable later.

```
surface            #ffffff      page background
surface-tinted     #f8f9fa      alternating section background
surface-sunken     #f1f3f4      image plates, chip fill, footer
surface-inverse    #202124      dark bands (Android XR-style sections)
on-surface         #202124      headlines, primary text
on-surface-variant #5f6368      all supporting copy and icons
outline            #dadce0      hairlines and borders
outline-variant    #e8eaed      dividers on tinted surfaces
accent             #1a73e8      links, filled buttons, focus
accent-hover       #1967d2
accent-container   #e8f0fe      tonal button fill, selected chip
on-inverse         #ffffff      text on dark bands
on-inverse-variant #bdc1c6      supporting text on dark bands
```

Note `#bdc1c6` for secondary text on dark surfaces — `#5f6368` does not have enough contrast
against `#202124` and using it there is a frequent mistake.

**Product tints.** Google Store gives each device band a soft background drawn from the device's
own colourway (a lavender band for a lavender phone, a jade band for a jade fold). Emulate this by
picking 2–4 desaturated tints from the subject's actual product or photography, at roughly 92–96%
lightness. Examples of the register: `#f0f1f7` lavender-grey, `#eef3f0` jade-grey, `#f6f1ec`
sand, `#eef1f6` moonstone. They should read as "barely coloured white," never as pastel blocks.

## 6. Colour — Material 3 tonal roles

For the product register, M3 uses a generated tonal system rather than a fixed palette. The
baseline scheme (purple) is what you get if you do nothing:

```
primary #6750a4   on-primary #ffffff   primary-container #eaddff   on-primary-container #21005d
secondary #625b71 on-secondary #ffffff secondary-container #e8def8 on-secondary-container #1d192b
tertiary #7d5260  on-tertiary #ffffff  tertiary-container #ffd8e4  on-tertiary-container #31111d
error #b3261e     on-error #ffffff     error-container #f9dedc     on-error-container #410e0b
surface #fef7ff   on-surface #1d1b20   surface-variant #e7e0ec     on-surface-variant #49454f
outline #79747e   outline-variant #cac4d0
surface-container-lowest #ffffff  -low #f7f2fa  (default) #f3edf7  -high #ece6f0  -highest #e6e0e9
```

Two things worth knowing:

- **Generate, don't guess.** Feed a brand colour to the Material Theme Builder and take the
  output. M3 derives tonal palettes via HCT, so hand-picking container colours produces
  inconsistent contrast.
- **Tonal elevation over shadow.** In M3, "higher" surfaces are *lighter* (the
  `surface-container-*` ramp), not shadowed. Shadow is reserved for genuinely floating things.
- If the brief is a Google-branded feel rather than an arbitrary brand, seed the scheme with
  `#1a73e8` rather than using the purple baseline, which reads as "untouched Material demo."

---

## 7. Layout, grid, breakpoints

Material 3 window size classes, which Google's own responsive behaviour follows:

| Class | Width | Columns | Gutter / margin |
|---|---|---|---|
| Compact | < 600px | 4 | 16px margin, 16px gutter |
| Medium | 600–839px | 8 | 24px |
| Expanded | 840–1199px | 12 | 24px |
| Large | 1200–1599px | 12 | 32px |
| Extra-large | ≥ 1600px | 12 | 32px, content capped |

Marketing-page containers:

```css
--gfs-page-max: 1440px;    /* page frame */
--gfs-content-max: 1280px; /* content column, centred */
--gfs-prose-max: 68ch;     /* paragraph measure */
--gfs-gutter: 24px;        /* < 600px */
--gfs-gutter-md: 48px;     /* 600–1199px */
--gfs-gutter-lg: 80px;     /* ≥ 1200px */
```

Full-bleed media escapes the container; text never does. A common Google pattern is a full-bleed
background with a `1280px` content column floated left or centred on top of it.

## 8. Spacing

Base unit 4px, with an 8px rhythm for components and a much coarser scale for sections. Section
spacing is *not* on the same scale as component spacing, and conflating them is what makes an
imitation feel cramped.

```
Component scale:  4  8  12  16  24  32  40  48  64
Section scale:    72  96  120  160  200
```

| Context | Mobile | Tablet | Desktop |
|---|---|---|---|
| Section vertical padding | 72px | 96px | 120–160px |
| Hero vertical padding | 96px | 120px | 160–200px |
| Gap between headline and lead | 16px | 16px | 24px |
| Gap between lead and CTA | 24px | 32px | 32px |
| Card grid gap | 16px | 24px | 24–32px |
| Nav height | 56px | 64px | 64–72px |

## 9. Shape

Material 3's corner tokens, including the `-increased` steps from M3 Expressive:

| Token | Radius | Applied to |
|---|---|---|
| none | 0 | Full-bleed media edges |
| extra-small | 4px | Text field, tooltip, snackbar |
| small | 8px | Small chips, menu |
| small-increased | 10px | — |
| medium | 12px | Card (dense), dialog on mobile |
| medium-increased | 16px | — |
| large | 16px | Card (default), image thumbnail |
| large-increased | 20px | — |
| extra-large | 28px | Hero media, large card, dialog, bottom sheet |
| extra-large-increased | 32px | Feature media |
| extra-extra-large | 48px | Large decorative container |
| full | 9999px | **All buttons, all chips, all pills, avatars** |

M3 Expressive changed `full` from "50% of component size" to a true pill; use `9999px` and let the
height define the curve.

Marketing-register defaults: media and cards `28px`, nested images inside cards `16px`, buttons
and chips `9999px`, form fields `8px` (or pill for a search field — Google search fields are
pills).

## 10. Elevation

Google's marketing web is flat at rest. The five M3 levels exist, but on a marketing page you will
almost only use level 0 and level 2-on-hover.

| Level | Shadow | Use |
|---|---|---|
| 0 | none | Everything at rest. Use a `1px #dadce0` border or `#f8f9fa` fill for definition instead. |
| 1 | `0 1px 2px rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)` | Sticky nav once scrolled |
| 2 | `0 1px 2px rgba(60,64,67,.3), 0 2px 6px 2px rgba(60,64,67,.15)` | Card hover, menu |
| 3 | `0 1px 3px rgba(60,64,67,.3), 0 4px 8px 3px rgba(60,64,67,.15)` | Mega-menu panel, dialog |
| 4 | `0 2px 3px rgba(60,64,67,.3), 0 6px 10px 4px rgba(60,64,67,.15)` | Rarely — dragged element |

Note the shadow colour: `rgba(60,64,67,...)`, i.e. grey 800, not black. Google's shadows are
neutral-grey and quite transparent. A `rgba(0,0,0,0.1)` shadow reads noticeably heavier and
muddier.

## 11. Motion

Easing:

```css
--gfs-ease-standard:              cubic-bezier(0.2, 0, 0, 1);
--gfs-ease-standard-decelerate:   cubic-bezier(0, 0, 0, 1);
--gfs-ease-standard-accelerate:   cubic-bezier(0.3, 0, 1, 1);
--gfs-ease-emphasized-decelerate: cubic-bezier(0.05, 0.7, 0.1, 1);
--gfs-ease-emphasized-accelerate: cubic-bezier(0.3, 0, 0.8, 0.15);
--gfs-ease-linear:                cubic-bezier(0, 0, 1, 1); /* indeterminate progress only */
```

Duration:

| Token | ms | Use |
|---|---|---|
| short1 | 50 | Ripple / state layer fade-in |
| short2 | 100 | Icon state change |
| short3 | 150 | Hover colour, small fade |
| short4 | 200 | **Default for hover and small transitions** |
| medium1 | 250 | Card expand |
| medium2 | 300 | **Default for menus, reveals, morphs** |
| medium4 | 400 | Larger expansion |
| long1 | 450 | Page transition |
| long2 | 500 | Full-screen expand |

Which curve for which move: entering the screen → `standard-decelerate` or
`emphasized-decelerate`; leaving permanently → `standard-accelerate`; starting and ending on
screen → `standard`; something that can be recalled immediately (a drawer) → decelerate on exit
too, as a cue that it can come back.

Larger movements get longer durations; keep the *sense of speed* constant. Desktop transitions
sit at the short end (150–200ms) because they are less noticeable and cheaper to drop frames on.

The marketing-page reveal, which is the only scroll animation you generally need:

```css
.reveal { opacity: 0; transform: translateY(20px);
          transition: opacity 300ms var(--gfs-ease-standard-decelerate),
                      transform 300ms var(--gfs-ease-standard-decelerate); }
.reveal.is-visible { opacity: 1; transform: none; }

@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1; transform: none; transition: none; }
}
```

Anything over roughly 200ms registers as deliberate motion rather than a state change, which is
the threshold at which reduced-motion guidance applies. Wrap it.

## 12. Icons

**Material Symbols** (Apache 2.0), variable font with axes for fill, weight, grade, and optical
size. Google's own properties overwhelmingly use the **Rounded** style, which matches Google Sans
Flex's geometry — Outlined reads more Material-2, Sharp is rare.

```html
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0" />
```
```html
<span class="material-symbols-rounded" aria-hidden="true">arrow_forward</span>
```

Set `FILL` 0 for inactive and 1 for active/selected states and transition between them — that
fill morph is a signature Material interaction. Size icons at 20px inline with text, 24px in
buttons and nav, 40–48px for feature icons. Colour them `#5f6368` unless they are part of an
action.

Icons are decorative in most marketing contexts: `aria-hidden="true"` and let the adjacent text
carry the meaning. If an icon is the only content of a control, it needs an `aria-label`.
