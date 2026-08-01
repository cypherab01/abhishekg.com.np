---
name: google-frontend-skills
description: Build websites, landing pages, and web UI in the visual language of Google's own marketing properties (android.com, store.google.com, about.google, blog.google) and Material Design 3 — Google Sans Flex typography, the Google grey/blue palette, pill buttons, full-bleed media bands, alternating product spotlights, mega-menu navigation, and fat footers. Use this skill whenever the user asks for a site that looks like Google, Android, the Google Store, Pixel, Nest, Gemini, or "Material Design"; whenever they say "make it feel like a Google product page," "clean like Google," "Material 3," or reference a Google property as a design target; and also for any product-marketing landing page, device/hardware launch page, e-commerce category page, or tech company homepage where a calm, spacious, high-trust consumer-tech aesthetic is wanted — even if Google is never mentioned by name. Prefer this skill over generic frontend styling for those cases.
---

# Google Frontend Skills

Build in the design language of Google's consumer marketing web — the family that includes
android.com, store.google.com, about.google, blog.google, and Google's product landing pages —
layered on Material Design 3 tokens for component-level detail.

The look is deceptively simple, and that is exactly why it is easy to get wrong. It is not
"minimal with a blue button." It is a specific, disciplined system: enormous amounts of white
space, very large type set at *normal* weight, near-black headlines with grey supporting copy,
fully-rounded pill controls, generously rounded media, one accent colour used sparingly, and
motion that is quick and never showy. Most attempts fail by making the type too bold, the
sections too tight, the colours too saturated, and the shadows too heavy.

## First: establish the surface you are building

Google's web properties are not one design; they are two closely-related registers. Decide which
one the brief calls for before writing any CSS, and say which you chose.

**Marketing register** (android.com, store.google.com, Pixel/Nest product pages). Editorial and
spacious. Full-bleed imagery and silent looping video, huge display headlines, alternating
image/copy bands, one product per section, text-link CTAs. Sections are tall and few. This is the
default for landing pages, launch pages, homepages, and campaign pages.

**Product/app register** (Gmail, Google Cloud console, Material 3 apps). Denser and functional.
Real component library — filled/tonal/outlined buttons, cards with tonal surfaces, navigation
rails, chips, data tables, state layers. Tighter spacing, smaller type. This is the default for
dashboards, admin tools, settings, and signed-in experiences.

Most requests want the marketing register with product-register components appearing inside it
(a form, a filter chip row, a comparison table). Mixing is normal and correct; what is not
correct is applying product-register density to a marketing page, which is the single most
common failure mode and reads instantly as "not Google."

## Read the references before building

Load these as needed. Do not work from memory of "what Google looks like" — the specific numbers
are what make it convincing.

| Reference | Read it when |
|---|---|
| `references/tokens.md` | Always, first. Colour, type scale, spacing, shape, elevation, motion — with exact values and the reasoning behind them. |
| `references/page-patterns.md` | Composing a page. The section-by-section anatomy of a Google marketing page, in order, with the rules for each. |
| `references/components.md` | Building any control or card. Pill buttons, cards, chips, mega menu, carousels, fields, tabs, badges, and every interaction state. |
| `references/copy-voice.md` | Writing any words at all. Google's marketing copy has hard rules (the terminal period, sentence case, the footnote discipline) and copy in the wrong voice ruins an otherwise correct design. |
| `references/accessibility.md` | Always before shipping. Google's own pages are held to a high bar and several of their signature patterns (autoplay video, low-contrast grey) are accessibility traps. |

`assets/tokens.css` is a drop-in stylesheet of every token as CSS custom properties. Copy it into
the project and build against `var(--...)` rather than hard-coding values.
`assets/starter-page.html` is a complete working reference implementation of a marketing page —
read it to see how the pieces fit together, and adapt it rather than starting from an empty file.

## The seven rules that carry the look

If you remember nothing else, these are what separate a convincing result from a generic one.

**1. Set display type at 400, not 700.** Google's giant headlines are *regular or medium* weight.
The size does the work, the weight does not. `font-weight: 400` at `clamp(2.5rem, 6vw, 4.5rem)`
with `line-height: 1.1` and `letter-spacing: -0.02em`. Bold display type is the fastest way to
look like a generic SaaS template instead of Google.

**2. Two text colours, always.** Headline `#202124` (near-black, never pure `#000`). Supporting
copy `#5f6368` (grey 700). That two-tone relationship appears on every Google page and does most
of the hierarchy work. Do not introduce a third body colour.

**3. Whitespace is the design.** Section padding of `120px`–`160px` vertical on desktop, `72px`–
`80px` on mobile. If a section feels roomy enough, it is probably still too tight. Content max-
width `1280px` inside a `1440px` page, centred, with `24px`/`48px`/`80px` gutters as the viewport
grows.

**4. Controls are pills; media is generously rounded.** Buttons and chips get
`border-radius: 9999px` and a `48px` height with `24px`–`32px` horizontal padding. Images, video,
and cards get `16px`–`28px` radius. Nothing in between, and nothing square.

**5. One accent, used rarely.** Google Blue `#1a73e8` for primary actions and links, and almost
nowhere else. The four-colour logo palette (`#4285f4` `#ea4335` `#fbbc04` `#34a853`) is *brand
identity*, not a UI palette — using all four in a interface reads as a Google parody. Colour
enters a Google page through photography and soft product-derived background tints, not through
chrome.

**6. Borders and tints instead of shadows.** Resting state is flat: a `1px #dadce0` hairline or a
`#f8f9fa`/`#f1f3f4` tinted surface. Shadow appears only on hover and only faintly
(`0 1px 3px rgba(60,64,67,.3), 0 4px 8px 3px rgba(60,64,67,.15)`). Heavy drop shadows are wrong.

**7. Motion is short and decelerating.** `200ms`–`300ms`, `cubic-bezier(0.2, 0, 0, 1)`. Scroll
reveals are a fade plus a `16px`–`24px` rise, nothing more. No parallax, no scroll-jacking, no
staggered letter animations. And honour `prefers-reduced-motion` on every one of them.

## Workflow

1. **Pick the register** (marketing vs product) and name the subject, audience, and the page's
   single job. State this in one or two lines before building.
2. **Read `references/tokens.md`**, then copy `assets/tokens.css` into the project.
3. **Choose the accent story.** Keep Google Blue for actions, then pick *one* soft tint family
   derived from the subject's own product/photography for section backgrounds — the way Google
   Store tints a Pixel band with a pastel drawn from the device colourway. This is where the page
   gets its personality without breaking the system.
4. **Sketch the section stack** from `references/page-patterns.md`. A real Google marketing page
   is typically 7–10 sections and no more. Cut before you add.
5. **Write the copy** to `references/copy-voice.md` rules *before* finalising layout, because
   Google's headline lengths (3–6 words) drive the layout, not the reverse.
6. **Build**, adapting `assets/starter-page.html`. Use semantic landmarks, real `<button>` and
   `<a>` elements, and the token variables throughout.
7. **Run the pre-ship checklist** below.

## Pre-ship checklist

Walk this before presenting work. Each line is a failure seen repeatedly in attempts at this
style.

- [ ] No display heading is heavier than `500`.
- [ ] Only two prose colours in use: `#202124` and `#5f6368`.
- [ ] Every button and chip is a full pill; every image and card is rounded `16px`+.
- [ ] Section vertical padding is at least `96px` on desktop. Measure it, do not eyeball it.
- [ ] Google Blue appears on actions and links only — not on backgrounds, headings, or icons-for-decoration.
- [ ] The four-colour brand palette is either absent or confined to a single logo-like moment.
- [ ] No resting shadows. Hover shadows are faint and short.
- [ ] All motion is ≤ `300ms`, decelerating, and wrapped in a `prefers-reduced-motion` guard.
- [ ] Any autoplaying video is muted, looping, and has a visible play/pause control (android.com does; so must you).
- [ ] Headlines are sentence case and end in a period. Body copy does not oversell.
- [ ] Skip-to-content link is the first focusable element; focus rings are visible everywhere.
- [ ] Grey text on tinted backgrounds still clears 4.5:1. `#5f6368` on `#f1f3f4` is borderline — verify, do not assume.
- [ ] Responsive at 360px, 768px, 1024px, 1440px, and 1920px.

## Using Google's actual brand assets: don't

Build in the *style*; do not ship Google's *property*. The Google wordmark, the four-colour "G",
the Android robot, Pixel and Nest product photography, and the product names themselves are
trademarks and licensed images. A site that borrows the layout language is fine and common
practice; a site that reuses Google's logos or device renders, or that presents itself as
affiliated with Google, is not. Substitute the client's own brand mark and photography, and if
the user explicitly asks for Google's logo or product images, say plainly that those are
trademarked assets and offer a placeholder or their own mark instead.

Google Sans Flex and Google Sans Code are the exception: Google released them under the SIL Open
Font License, so they are genuinely free to use commercially. Material Symbols is likewise open
(Apache 2.0). Use them.
