# Page patterns

The composition of a Google marketing page, in the order the sections appear. Derived from
android.com, store.google.com, and Google's product landing pages.

A real page uses **7–10 of these, not all of them.** The restraint is part of the look. Pick the
stack that serves the page's single job and delete the rest.

## Contents

1. [The canonical stack](#the-canonical-stack)
2. [Skip link](#1-skip-link)
3. [Promo bar](#2-promo-bar)
4. [Sticky nav with mega menu](#3-sticky-nav-with-mega-menu)
5. [Hero](#4-hero)
6. [Three-up card row](#5-three-up-card-row)
7. [Product rail](#6-product-rail)
8. [Product spotlight band](#7-product-spotlight-band)
9. [Dark feature band](#8-dark-feature-band)
10. [Category tiles](#9-category-tiles)
11. [Editorial two-up](#10-editorial-two-up)
12. [Value-prop icon row](#11-value-prop-icon-row)
13. [Email capture](#12-email-capture)
14. [Comparison table](#13-comparison-table)
15. [FAQ accordion](#14-faq-accordion)
16. [Fat footer](#15-fat-footer)
17. [Footnotes and disclaimers](#16-footnotes-and-disclaimers)

---

## The canonical stack

```
┌──────────────────────────────────────────────────────────┐
│ skip link (visually hidden until focused)                │
├──────────────────────────────────────────────────────────┤
│ promo bar          · one line, dismissible, tinted       │
├──────────────────────────────────────────────────────────┤
│ sticky nav         · logo | categories | search cart CTA │
├══════════════════════════════════════════════════════════┤
│                                                          │
│ HERO               · full-bleed media, headline, 2 CTAs  │
│                                                          │
├──────────────────────────────────────────────────────────┤
│ three-up card row  · "Explore the latest." + 3 cards     │
├──────────────────────────────────────────────────────────┤
│ product rail       · horizontal scroll of product cards  │
├──────────────────────────────────────────────────────────┤
│ spotlight band A   · image left  / copy right · tint 1   │
│ spotlight band B   · copy left   / image right · tint 2  │
│ spotlight band C   · image left  / copy right · tint 3   │
├──────────────────────────────────────────────────────────┤
│ dark feature band  · #202124, full-bleed, single idea    │
├──────────────────────────────────────────────────────────┤
│ category tiles     · 4 rounded tiles, image + label      │
├──────────────────────────────────────────────────────────┤
│ value-prop row     · 4 icons + one line each             │
├──────────────────────────────────────────────────────────┤
│ email capture      · tinted, one field, one button       │
├══════════════════════════════════════════════════════════┤
│ fat footer         · 5–7 link columns + social + locale  │
├──────────────────────────────────────────────────────────┤
│ footnotes          · 12px grey, numbered, legal          │
└──────────────────────────────────────────────────────────┘
```

Sections alternate between white `#ffffff` and a tint (`#f8f9fa` or a product tint). Never two
consecutive tinted sections in the same tint — the boundary disappears and the page reads as one
long block.

---

## 1. Skip link

First focusable element in the document. android.com and store.google.com both ship one; it is not
optional.

```html
<a class="skip-link" href="#main">Skip to main content</a>
```
```css
.skip-link { position: absolute; left: 16px; top: -100px; z-index: 100;
             background: #fff; color: #1a73e8; padding: 12px 24px;
             border-radius: 9999px; box-shadow: 0 1px 3px rgba(60,64,67,.3);
             transition: top 200ms cubic-bezier(0.2,0,0,1); }
.skip-link:focus { top: 16px; }
```

## 2. Promo bar

A single line above the nav announcing an offer or launch, on a tint (`#e8f0fe` for informational,
`#f1f3f4` for neutral) with the message and one inline text link. Height 40–48px, `14px` text,
centred.

Rules: one message only, never a carousel of rotating promos. Include a dismiss button with
`aria-label="Dismiss"`. Do not make it sticky — only the nav sticks. If the offer has conditions,
link to terms rather than cramming them in; the footnote section carries the fine print.

```
Explore summer deals on Pixel and Fitbit, now until 06/14.  Shop deals →
```

## 3. Sticky nav with mega menu

The most structurally involved piece on the page. Anatomy left to right:

```
[logo] [Category ▾] [Category ▾] [Category ▾] [Category ▾]  ·····  [🔍] [🛒] [Sign in] [Primary CTA]
```

Behaviour:

- **Height** 64px desktop, 56px mobile. Background `#ffffff`.
- **At rest, no shadow and no border.** On scroll past ~8px, add a `1px solid #dadce0` bottom
  border *or* elevation level 1 — one or the other, not both. Transition over 200ms.
- **Sticky** via `position: sticky; top: 0`.
- **Category triggers** are `<button aria-expanded>` with a trailing chevron that rotates 180° on
  open. Labels are sentence case, 14px, weight 500, `#202124`.
- **The panel** is full-viewport-width, drops below the nav, `#ffffff`, elevation 3, radius
  `0 0 28px 28px`, and animates in with a fade plus `translateY(-8px) → 0` over 300ms
  `emphasized-decelerate`. Height is content-driven, never full-screen on desktop.
- **Panel contents** — this is the part people miss. A Google mega menu is not a flat list. It is
  3–4 sub-columns: the primary product list, an "Explore more" column of utility links (compare,
  accessories, offers), a "Discover" column of editorial links, and frequently **a promo tile with
  an image, one line of copy, and a text link** pinned to the right of the panel. Reproducing that
  promo tile is what makes a mega menu read as Google's.
- **Open on click, not hover.** Google Store's menus are click-triggered. Hover-open menus are
  hostile on touch and to keyboard users. Close on `Escape`, on outside click, and on focus leaving
  the panel. Move focus into the panel on open.
- **Mobile** collapses to a hamburger opening a full-height sheet where each category is an
  accordion with the same sub-column content stacked. The primary CTA stays visible in the bar.

## 4. Hero

The single most identity-carrying section.

Structure: full-bleed media (silent looping video or a wide image) with the headline block either
centred over it, or in a `1280px` column beneath it. Google alternates between overlay and
stacked; overlay needs a scrim, stacked does not.

- **Padding** 160–200px vertical on desktop, 96px on mobile.
- **Headline** hero display scale, weight 400, 3–6 words, sentence case, terminal period.
- **Lead** one sentence, `#5f6368`, max ~60ch. Optional — many Google heroes are headline + CTAs
  only.
- **CTAs** two maximum. Primary is a filled blue pill; secondary is an outlined pill or a text link
  with a chevron. Pre-order/Buy on the left, Learn more/Explore on the right.
- **Video** must be `muted loop playsinline` with `preload="metadata"` and a `poster`. It must have
  a **visible play/pause toggle** — android.com labels theirs "Play silent looping video" / "Pause
  silent looping video", which is a good model for the accessible name. Do not autoplay when
  `prefers-reduced-motion: reduce`; show the poster instead.
- **Overlay text** needs a scrim: `linear-gradient(to top, rgba(32,33,36,.55), transparent 60%)`.
  Do not rely on the video being dark enough — it changes frame to frame. Verify contrast against
  the *lightest* frame.

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│                 [full-bleed video / image]               │
│                                                          │
│              Introducing the new Fold.                   │
│         One sentence of supporting context here.         │
│                                                          │
│            ( Pre-order now )   Explore more →            │
│                                                    ⏸     │
└──────────────────────────────────────────────────────────┘
```

## 5. Three-up card row

The "Explore the latest on Android." pattern. A section headline with a text-link CTA on the same
baseline, then three equal cards.

Each card: rounded image (`28px`, aspect ~4:3 or 1:1) on a tinted plate, then an **eyebrow** naming
the feature (`Gboard`, `Quick Share`, `Circle to Search` — sentence case, 14px, 500, `#5f6368`),
then a card headline of 4–8 words with a terminal period, then a text link with chevron.

Note the information order: eyebrow *then* headline. The eyebrow tells you which product; the
headline tells you the benefit. This is inverted from most design systems and is very
characteristic.

Three on desktop, two at tablet, one-per-row or a horizontal scroll-snap rail on mobile. Cards have
no border and no shadow at rest.

## 6. Product rail

"Popular on the Google Store." — a horizontally scrolling row of small product cards with a scroll
indicator or prev/next buttons.

Each card: product image on `#f8f9fa`, optional `New` chip in the top-left, product name (16px,
500, `#202124`), price and/or a strikethrough original price. Radius 16px. Card width ~200–240px,
`scroll-snap-align: start` on a `scroll-snap-type: x mandatory` rail with
`scrollbar-width: none`.

Provide real prev/next `<button>`s with `aria-label`s, not only drag-scroll. Keyboard users need to
reach every card; do not trap them.

## 7. Product spotlight band

The workhorse of a Google product page, repeated 3–6 times, one product or feature each.

Two-column: media on one side, copy on the other, **alternating sides** band to band. Each band
gets its own soft product-derived tint. Copy column is narrow (max ~440px) and vertically centred.

Contents: band headline (product name, 4–8 words), one short line of positioning copy, one text
link with chevron. That is all. No feature bullets, no specs, no secondary CTA. The spec detail
lives on the product's own page — the marketing page's job is to make you click through.

```
┌────────────────────────────┬─────────────────────────────┐
│                            │                             │
│                            │   Google Pixel 10 Pro       │
│      [ product image ]     │   Meet the new status pro.   │
│                            │                             │
│                            │   Learn more →              │
└────────────────────────────┴─────────────────────────────┘
   tint: #f0f1f7 (drawn from the device colourway)
```

Full-bleed the band background; keep the two-column content inside the `1280px` container. On
mobile, image above copy, always in that order regardless of desktop side — use `order` on the
flex/grid children rather than duplicating markup.

## 8. Dark feature band

For one big idea per page, Google switches to `#202124` full-bleed with white type and often a
large edge-to-edge image (the "Reality, expanded." Android XR treatment). Use at most **one** per
page; two dark bands cancels the effect.

On dark: headline `#ffffff` weight 400, supporting copy `#bdc1c6` (not `#5f6368`), CTA as an
outlined pill with a `#5f6368` border and white text, or a white filled pill with `#202124` text.
Same padding as other sections.

## 9. Category tiles

Four rounded tiles ("Shop popular categories.") — image on tint, label beneath, whole tile is one
link. Radius 28px, aspect 1:1 or 4:5, 4-up desktop / 2-up mobile. Label 16px 500 `#202124` with a
chevron on hover. Hover: image scales `1.03` over 200ms with `overflow: hidden` on the tile.

Wrap the whole tile in a single `<a>`; do not nest a link inside a linked card.

## 10. Editorial two-up

For story/article promotion ("Discover the world of Pixel."). Two cards side by side, each with a
large 16:9 image, a card headline, two lines of body copy, and a text link. This is the one place
Google allows a paragraph of body copy in a card — keep it to 2 lines and truncate with
`-webkit-line-clamp: 2` rather than letting cards go uneven.

## 11. Value-prop icon row

"Why buy on the Google Store." — four columns, each a 40–48px line icon (Material Symbols Rounded,
`#5f6368`), one short benefit line (16px, `#202124`), and a `Learn more` text link. Sits on
`#f8f9fa`. 4-up desktop, 2×2 tablet, stacked mobile.

Benefit lines are declarative statements, not features: "Free shipping." "Get our price match
promise." "Free and easy returns." Each ends with a period.

## 12. Email capture

Tinted section, centred, with a headline ("Be in the mix with Android."), one line explaining what
they will receive, one email field, a consent checkbox linking to terms and privacy policy, and one
filled pill button.

The field is a pill or 8px-radius outlined input, 48px tall, with a floating or above-field label.
Validate inline with a `#d93025` message and `aria-live="polite"`, never with an alert. Handle three
states explicitly, because Google's forms all do: idle, success ("You're all set."), and error
("Something went wrong.") with a retry.

Consent is a real checkbox, unchecked by default, with the terms and privacy links inside the label.

## 13. Comparison table

Used on "Compare phones" pages. Sticky first column with row labels, product columns with image +
name + price at the top, then spec rows. On mobile it becomes a horizontal scroll with the label
column pinned, or a per-product stacked accordion.

Use real `<table>` markup with `<th scope="col">` and `<th scope="row">`. A CSS-grid fake table is
unreadable to screen readers. Rows alternate `#ffffff` / `#f8f9fa`; dividers `#e8eaed`; no vertical
borders.

## 14. FAQ accordion

`<details>`/`<summary>` is the right primitive and gets keyboard behaviour free. Style the summary
as 18px 400 `#202124` with a `+`/`−` or chevron that rotates, `1px #dadce0` dividers between items,
no card chrome. Animate with `interpolate-size: allow-keywords` and a `height` transition, or
`grid-template-rows: 0fr → 1fr`. One item open at a time is a choice, not a requirement — Google
generally allows multiple.

## 15. Fat footer

`#ffffff` or `#f1f3f4`, generous. Anatomy top to bottom:

1. Optional social row — "Follow us" with icon links, each with a real `aria-label`.
2. **5–7 columns of links** under bold-ish column headings (14px, 500, `#202124`), links 14px 400
   `#5f6368`. Group by audience, which is how Google groups them: *For Enterprise*, *For the
   Press*, *For Developers*, *Support*, *Privacy and Safety*, *Accessibility*.
3. A `1px #dadce0` divider.
4. Bottom bar: wordmark on the left; on the right, privacy policy, terms, cookie controls, and a
   **locale selector** as a native `<select>` or a menu button.

Columns collapse to accordions on mobile. Do not ship a footer with three links — the density is
part of the trust signal this design language trades on.

## 16. Footnotes and disclaimers

The genuinely distinctive last section: 12px `#80868b` copy carrying numbered footnotes matching
superscript markers in the page body, availability caveats, and trademark attributions.

```
1 Compatibility varies. Internet connection required. Available in select countries and to users 18+.
2 Results for illustrative purposes and may vary.
Product availability, features, and specifications vary by region and carrier.
All other trademarks are the property of their respective owners.
```

Markers in the body are `<sup><a href="#fn1" id="ref1">1</a></sup>` linking to the footnote, and
each footnote links back. If the page makes any claim about pricing, availability, performance, or
AI output, it needs a footnote — that is precisely the convention this design language signals, and
including it is a large part of why a page reads as authentically Google rather than as a pastiche.
