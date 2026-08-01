# Components

Exact specs for the controls that appear on Google's web properties. Assumes the tokens from
`tokens.md` are loaded as CSS custom properties.

## Contents

1. [Buttons](#1-buttons)
2. [Text link with chevron](#2-text-link-with-chevron)
3. [State layers](#3-state-layers)
4. [Focus rings](#4-focus-rings)
5. [Cards](#5-cards)
6. [Chips](#6-chips)
7. [Badges](#7-badges)
8. [Text fields](#8-text-fields)
9. [Select and menu](#9-select-and-menu)
10. [Tabs](#10-tabs)
11. [Carousel / rail](#11-carousel--rail)
12. [Colour swatch picker](#12-colour-swatch-picker)
13. [Dialog and sheet](#13-dialog-and-sheet)
14. [Snackbar](#14-snackbar)
15. [Skeleton loading](#15-skeleton-loading)

---

## 1. Buttons

Every button is a pill. Height 48px on marketing pages (40px in dense product UI), horizontal
padding 24px (32px for a hero primary), label 14–16px weight 500, `border-radius: 9999px`,
`white-space: nowrap`.

Five variants, in descending emphasis. Use **one filled button per section** — the emphasis
hierarchy is the whole point and two filled buttons side by side destroys it.

```css
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  min-height: 48px; padding: 0 24px;
  font: 500 0.875rem/1 var(--gfs-font-plain); letter-spacing: 0.01em;
  border-radius: 9999px; border: none; cursor: pointer;
  text-decoration: none; position: relative; overflow: hidden;
  transition: background-color 200ms var(--gfs-ease-standard),
              box-shadow    200ms var(--gfs-ease-standard),
              border-color  200ms var(--gfs-ease-standard);
}

/* Filled — the one primary action */
.btn--filled { background: var(--gfs-accent); color: #fff; }
.btn--filled:hover { background: var(--gfs-accent-hover);
                     box-shadow: 0 1px 2px rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15); }
.btn--filled:active { background: #174ea6; box-shadow: none; }

/* Tonal — secondary action of real importance */
.btn--tonal { background: var(--gfs-accent-container); color: var(--gfs-accent); }
.btn--tonal:hover { background: #d2e3fc; }

/* Outlined — the common secondary on marketing pages */
.btn--outlined { background: transparent; color: var(--gfs-accent);
                 border: 1px solid var(--gfs-outline); }
.btn--outlined:hover { background: rgba(26,115,232,.04); border-color: var(--gfs-accent); }

/* Text — tertiary, in dense UI */
.btn--text { background: transparent; color: var(--gfs-accent); padding: 0 12px; }
.btn--text:hover { background: rgba(26,115,232,.04); }

/* On a dark band */
.btn--on-dark { background: #fff; color: #202124; }
.btn--on-dark-outlined { background: transparent; color: #fff; border: 1px solid #5f6368; }
.btn--on-dark-outlined:hover { background: rgba(255,255,255,.08); border-color: #9aa0a6; }

/* Disabled — grey, not faded-blue */
.btn:disabled { background: #f1f3f4; color: #9aa0a6; border-color: transparent;
                cursor: default; box-shadow: none; }
```

Notes that matter:

- Outlined buttons carry a `#dadce0` border, **not** a blue one, at rest. The border only turns
  blue on hover. This is a specific Google detail.
- Hover on filled adds a *faint* shadow. Do not translate the button upward — Google buttons do
  not lift.
- Icon-with-label: icon on the left for "add"-type actions, on the right for "forward"-type
  (`arrow_forward`, `chevron_right`). 20px icon, 8px gap.
- Never uppercase a button label. Sentence case, always. (Material 2 uppercased; M3 does not.)

## 2. Text link with chevron

The most-used CTA on Google marketing pages, more common than buttons.

```css
.link-cta {
  display: inline-flex; align-items: center; gap: 4px;
  color: var(--gfs-accent); font: 500 1rem/1.5 var(--gfs-font-plain);
  text-decoration: none;
}
.link-cta .material-symbols-rounded { font-size: 20px; transition: transform 200ms var(--gfs-ease-standard); }
.link-cta:hover { text-decoration: underline; text-underline-offset: 3px; }
.link-cta:hover .material-symbols-rounded { transform: translateX(3px); }
```

The chevron nudges right on hover — small, 3px, 200ms. That micro-interaction appears throughout
Google's properties and is worth reproducing precisely.

Inline prose links: `#1a73e8`, underlined at rest (not underline-on-hover — in body copy Google
underlines links for accessibility), `text-underline-offset: 2px`.

## 3. State layers

Material's mechanism for hover/focus/press feedback: a semi-transparent overlay of the *content*
colour on top of the container, at fixed opacities.

| State | Opacity |
|---|---|
| Hover | 8% |
| Focus | 10% |
| Pressed | 10% |
| Dragged | 16% |

```css
.state-layer { position: relative; isolation: isolate; }
.state-layer::after {
  content: ''; position: absolute; inset: 0; border-radius: inherit;
  background: currentColor; opacity: 0; pointer-events: none;
  transition: opacity 150ms var(--gfs-ease-standard);
}
.state-layer:hover::after { opacity: .08; }
.state-layer:active::after { opacity: .10; }
```

Use this rather than hand-mixing hover colours — it stays correct across every surface tint
automatically, which is why Material defines it this way.

## 4. Focus rings

```css
:focus-visible {
  outline: 2px solid var(--gfs-accent);
  outline-offset: 2px;
  border-radius: inherit;
}
```

`:focus-visible`, not `:focus`, so mouse users don't see rings on click. Never
`outline: none` without a replacement. On a dark band, switch the ring to `#fff`. On a blue filled
button, use a white ring with a 2px offset so it reads against the blue.

## 5. Cards

```css
.card {
  background: #fff; border-radius: 28px; overflow: hidden;
  box-shadow: none;
  transition: box-shadow 200ms var(--gfs-ease-standard);
}
.card:hover { box-shadow: 0 1px 2px rgba(60,64,67,.3), 0 2px 6px 2px rgba(60,64,67,.15); }

.card__media { aspect-ratio: 4 / 3; background: var(--gfs-surface-sunken);
               border-radius: 16px; overflow: hidden; }
.card__media img { width: 100%; height: 100%; object-fit: cover;
                   transition: transform 300ms var(--gfs-ease-standard); }
.card:hover .card__media img { transform: scale(1.03); }

.card__eyebrow  { font: 500 .875rem/1.4 var(--gfs-font-plain); color: var(--gfs-on-surface-variant); }
.card__title    { font: 500 clamp(1.25rem,2vw,1.5rem)/1.3 var(--gfs-font-brand);
                  color: var(--gfs-on-surface); letter-spacing: -.005em; text-wrap: balance; }
.card__body     { font: 400 1rem/1.5 var(--gfs-font-plain); color: var(--gfs-on-surface-variant); }
```

Three variants:

- **Elevated** — white on a tinted section, no border, shadow on hover. The marketing default.
- **Filled** — `#f8f9fa` fill on white, no border, no shadow. Quieter grouping.
- **Outlined** — `1px #dadce0`, no fill, no shadow. For dense product UI and comparison grids.

Content order is fixed: media → eyebrow → title → optional body → CTA. Padding 24px (0 on the media
if the media is edge-to-edge). Do not put a filled button inside a marketing card; use a text link
with chevron.

If the whole card is clickable, wrap it in one `<a>` and make the inner "Learn more" text
non-focusable (`aria-hidden`) or omit it — nested interactive elements are a real accessibility
problem, not a nitpick.

## 6. Chips

Pill, 32px tall, 12–16px horizontal padding, 14px weight 500.

```css
.chip { display: inline-flex; align-items: center; gap: 8px; height: 32px; padding: 0 16px;
        border-radius: 9999px; border: 1px solid var(--gfs-outline);
        background: transparent; color: var(--gfs-on-surface);
        font: 500 .875rem/1 var(--gfs-font-plain); cursor: pointer; }
.chip:hover { background: #f1f3f4; }
.chip[aria-pressed="true"], .chip--selected {
  background: var(--gfs-accent-container); border-color: transparent; color: #174ea6; }
.chip--selected::before { content: 'check'; font-family: 'Material Symbols Rounded'; font-size: 18px; }
```

A selected filter chip in Material gains a leading checkmark and a blue tonal fill. Filter chip
rows use `role="group"` with `aria-pressed` on each chip; single-select rows use
`role="radiogroup"`.

## 7. Badges

The small `New` / `Sale` marker on product cards. 24px tall, 8px horizontal padding,
`border-radius: 8px` (badges are one of the few non-pill things), 12px weight 500.

```css
/* Note the 800/900 text steps: green-700 on green-50 measures 4.42:1 and fails
   AA at badge sizes. See accessibility.md. */
.badge      { background: #e6f4ea; color: #0d652d; }  /* New   — 6.34:1 */
.badge--sale{ background: #fce8e6; color: #a50e0e; }  /* Offer — 6.68:1 */
.badge--info{ background: #e8f0fe; color: #174ea6; }  /* Info  — 6.85:1 */
```

Position `top: 12px; left: 12px` absolutely inside the card media. It is text, not decoration —
leave it readable to screen readers.

## 8. Text fields

Two Material variants; **outlined** is what Google's web forms use.

```css
.field { position: relative; }
.field input {
  width: 100%; height: 56px; padding: 20px 16px 6px;
  font: 400 1rem/1.5 var(--gfs-font-plain); color: var(--gfs-on-surface);
  background: #fff; border: 1px solid var(--gfs-outline); border-radius: 8px;
  transition: border-color 150ms var(--gfs-ease-standard), box-shadow 150ms var(--gfs-ease-standard);
}
.field input:hover { border-color: var(--gfs-on-surface); }
.field input:focus { outline: none; border-color: var(--gfs-accent);
                     box-shadow: inset 0 0 0 1px var(--gfs-accent); }  /* 2px total */
.field label {
  position: absolute; left: 16px; top: 16px; pointer-events: none;
  font: 400 1rem/1.5 var(--gfs-font-plain); color: var(--gfs-on-surface-variant);
  transition: all 150ms var(--gfs-ease-standard);
}
.field input:focus + label,
.field input:not(:placeholder-shown) + label { top: 7px; font-size: .75rem; }
.field input:focus + label { color: var(--gfs-accent); }

.field--error input { border-color: #d93025; }
.field__error { display: flex; gap: 4px; margin-top: 4px; padding: 0 16px;
                font: 400 .75rem/1.4 var(--gfs-font-plain); color: #d93025; }
```

The focus state is a **2px** border achieved with border + inset shadow, so the field does not
shift by a pixel when focused. Use `aria-describedby` to tie the error to the input and
`aria-invalid="true"` on the input. A search field is the exception to the 8px radius: search is a
pill.

## 9. Select and menu

Native `<select>` for locale pickers and simple choices — it is more accessible and behaves
correctly on mobile. Style with `appearance: none`, an 8px radius, a `#dadce0` border, and a
background chevron.

For a custom menu, use `<button aria-expanded aria-haspopup="menu">` and a
`<div role="menu">` with `role="menuitem"` children. Panel: `#fff`, radius 8px (dense) or 28px
(large), elevation 3, 8px vertical padding, items 48px tall with 16px horizontal padding.
Arrow-key navigation, `Escape` to close, focus returns to the trigger. If you can use the native
`popover` attribute plus CSS anchor positioning, do — less to get wrong.

## 10. Tabs

Underlined, not pill-shaped, in the Material style Google uses on web.

```css
.tabs { display: flex; gap: 0; border-bottom: 1px solid var(--gfs-outline); }
.tab  { padding: 14px 24px; background: none; border: none; cursor: pointer;
        font: 500 .875rem/1.4 var(--gfs-font-plain); color: var(--gfs-on-surface-variant);
        border-bottom: 3px solid transparent; margin-bottom: -1px;
        transition: color 150ms, border-color 150ms; }
.tab[aria-selected="true"] { color: var(--gfs-accent); border-bottom-color: var(--gfs-accent); }
```

`role="tablist"` / `role="tab"` / `role="tabpanel"`, with arrow-key navigation between tabs and a
single tab stop into the list. The indicator can slide between tabs over 250ms `standard` — a nice
touch, but only if the tab widths are measured, not assumed.

## 11. Carousel / rail

```css
.rail { display: flex; gap: 24px; overflow-x: auto; scroll-snap-type: x mandatory;
        scroll-behavior: smooth; scrollbar-width: none;
        padding-inline: max(24px, calc((100vw - 1280px) / 2)); }
.rail::-webkit-scrollbar { display: none; }
.rail > * { flex: 0 0 clamp(200px, 24vw, 280px); scroll-snap-align: start; }
```

Requirements: real `<button>` prev/next controls with `aria-label`s, disabled at the ends; the rail
itself gets `role="region"` and an `aria-label`; every card reachable by keyboard.
`scroll-behavior: smooth` should be disabled under `prefers-reduced-motion`. Never auto-advance a
carousel that contains links — if you must, provide a pause control and stop on focus or hover.

## 12. Colour swatch picker

Product pages need this (choosing a device colourway). Circular 32px swatches in a
`role="radiogroup"`, each a 24px filled circle inside a 2px ring that turns `#1a73e8` when
selected, with a 4px gap between ring and fill.

Colour alone cannot convey selection — the ring is a shape cue, and each swatch needs an accessible
name ("Moonstone"), not just a hex.

## 13. Dialog and sheet

Desktop dialog: `#fff`, radius 28px, max-width 560px, 24px padding, elevation 3, scrim
`rgba(32,33,36,.32)`. Enter with opacity + `scale(0.92) → 1` over 300ms `emphasized-decelerate`;
exit at 200ms `emphasized-accelerate`. Mobile: full-width bottom sheet with radius
`28px 28px 0 0`, sliding up.

Use the native `<dialog>` element with `showModal()` — it gives focus trapping, `Escape`, and
inert background for free. Actions bottom-right, dismissive on the left of confirming.

## 14. Snackbar

`#3c4043` fill, `#fff` text at 14px, radius 8px, one optional text action in `#8ab4f8` (light blue,
because blue 600 fails contrast on dark grey). Bottom-centre desktop, bottom-full-width mobile,
`role="status"` with `aria-live="polite"`. Auto-dismiss after 4–10 seconds, never for anything the
user must act on.

## 15. Skeleton loading

Google uses a subtle shimmer, not a spinner, for content areas.

```css
.skeleton { background: linear-gradient(90deg, #f1f3f4 25%, #e8eaed 50%, #f1f3f4 75%);
            background-size: 200% 100%; animation: shimmer 1.5s infinite linear;
            border-radius: 8px; }
@keyframes shimmer { to { background-position: -200% 0; } }
@media (prefers-reduced-motion: reduce) { .skeleton { animation: none; background: #f1f3f4; } }
```

Match the skeleton's shape to the content it replaces — same radius, same aspect ratio — so the
layout does not shift on load. Announce loading state with `aria-busy="true"` on the container.
