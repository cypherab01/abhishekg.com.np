# Accessibility

Several signature patterns in this design language are accessibility traps: low-contrast grey text,
autoplaying video, repeated generic link text, hover-only mega menus, and colour-only selection
states. Google's own pages handle these carefully, and a convincing imitation has to as well.

## Contrast: the grey problem

The `#5f6368` / `#202124` two-tone system is central to the look and mostly fine, but it has edges.

All ratios below are computed, not estimated. AA needs 4.5:1 for normal text and 3:1 for large
text (≥24px, or ≥18.66px bold) and for UI component boundaries.

| Foreground | Background | Ratio | Verdict |
|---|---|---|---|
| `#202124` | `#ffffff` | 16.10 | Fine anywhere |
| `#5f6368` | `#ffffff` | 6.05 | Fine anywhere |
| `#5f6368` | `#f8f9fa` | 5.74 | Fine |
| `#5f6368` | `#f1f3f4` | 5.44 | Fine |
| `#5f6368` | `#f0f1f7` (product tint) | 5.37 | Fine |
| `#5f6368` | `#e8eaed` | 5.02 | Fine, but this is the floor — do not tint darker |
| `#9aa0a6` | `#ffffff` | 2.64 | **Fails.** Disabled and decorative only |
| `#80868b` | `#ffffff` | 3.68 | **Fails body text.** Large text only |
| `#1a73e8` | `#ffffff` | 4.51 | Passes AA body by 0.01. Use `#1967d2` (5.37) for small text |
| `#dadce0` | `#ffffff` | 1.37 | Borders only, never text |
| `#5f6368` | `#202124` | 2.66 | **Fails.** Use `#bdc1c6` on dark |
| `#bdc1c6` | `#202124` | 8.90 | Fine on dark |
| `#1a73e8` | `#202124` | 3.57 | **Fails on dark.** Use `#8ab4f8` (7.64) |
| `#174ea6` | `#e8f0fe` | 6.85 | Fine — tonal blue chip |
| `#188038` | `#e6f4ea` | 4.42 | **Fails.** See the badge note below |
| `#c5221f` | `#fce8e6` | 4.92 | Passes, barely |
| `#d93025` | `#ffffff` | 4.77 | Fine for error text |

**The badge trap.** Google's green 700 on green 50 — the obvious choice for a `New` badge — measures
4.42:1 and fails AA for the 12px text badges are made of. Use green 800 `#0d652d` on `#e6f4ea`
(6.34) instead, and red 900 `#a50e0e` on `#fce8e6` (6.68) for a sale badge. The 50/700 pairing only
works at large sizes.

**Google Blue is marginal at 4.51:1.** It passes for normal text with nothing to spare. For 14px
links and small labels, prefer blue 700 `#1967d2` (5.37); keep blue 600 for large buttons where the
white-on-blue direction is what matters.

Practical consequences:

- **Footnote copy at `#80868b`** is the pattern's weakest point. It passes as "large text" only
  above 24px, and footnotes are 12px. Either move footnotes to `#5f6368`, or accept that this is a
  known deviation and flag it. Prefer `#5f6368`.
- **On any dark band**, swap the whole secondary palette: body `#bdc1c6`, links and actions
  `#8ab4f8`, borders `#5f6368`. Carrying `#5f6368` onto `#202124` is the most frequent contrast bug
  in this style.
- **On product tints**, re-check. A `#5f6368` on a `#f0f1f7` lavender tint is fine, but a
  saturated tint will fail. Measure; do not assume.
- Text over photography or video needs a scrim, and the ratio must hold against the *lightest*
  frame the video reaches, not the poster.

## Autoplaying video

android.com autoplays a silent looping hero video *and* ships a visible play/pause control with an
explicit accessible name. Both halves are required.

```html
<div class="hero__media">
  <video id="heroVideo" autoplay muted loop playsinline
         preload="metadata" poster="/hero-poster.jpg"
         aria-label="Silent looping product footage">
    <source src="/hero.webm" type="video/webm">
    <source src="/hero.mp4" type="video/mp4">
  </video>
  <button class="hero__toggle" id="heroToggle"
          aria-label="Pause silent looping video">
    <span class="material-symbols-rounded" aria-hidden="true">pause</span>
  </button>
</div>
```

```js
const v = document.getElementById('heroVideo');
const t = document.getElementById('heroToggle');

// Respect the OS setting before anything plays.
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  v.removeAttribute('autoplay');
  v.pause();
}

const sync = () => {
  const paused = v.paused;
  t.setAttribute('aria-label', paused ? 'Play silent looping video'
                                     : 'Pause silent looping video');
  t.querySelector('span').textContent = paused ? 'play_arrow' : 'pause';
};
t.addEventListener('click', () => { v.paused ? v.play() : v.pause(); });
v.addEventListener('play', sync);
v.addEventListener('pause', sync);
sync();
```

WCAG 2.2.2 requires a pause mechanism for anything moving automatically for more than five seconds.
The label must change with the state, and the icon must change with it — a static "pause" icon on a
paused video is a real bug, not a detail.

## Repeated link text

A Google page can carry a dozen "Learn more" links. In a screen reader's link list they are
indistinguishable. Fix it per link:

```html
<a class="link-cta" href="/pixel-watch-4">
  Learn more<span class="sr-only"> about Pixel Watch 4</span>
  <span class="material-symbols-rounded" aria-hidden="true">arrow_forward</span>
</a>
```

```css
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
           overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
```

The visually-hidden span is better than `aria-label` here, because `aria-label` overrides the
visible text entirely and breaks voice-control users who say "click Learn more."

## Mega menu

- **Trigger on click, not hover.** Hover menus are unusable on touch and unreachable by keyboard.
- `<button aria-expanded="false" aria-controls="panel-phones">` on the trigger.
- Move focus into the panel on open; return it to the trigger on close.
- `Escape` closes. Outside click closes. Focus leaving the panel closes.
- Only one panel open at a time, and opening a second closes the first.
- The panel is not `aria-hidden` while focusable content is inside it — use `hidden` or
  `display: none` so its contents leave the tab order entirely when closed.

```js
function closeAll(except) {
  document.querySelectorAll('[data-menu-trigger]').forEach(t => {
    if (t === except) return;
    t.setAttribute('aria-expanded', 'false');
    document.getElementById(t.getAttribute('aria-controls')).hidden = true;
  });
}
document.querySelectorAll('[data-menu-trigger]').forEach(trigger => {
  const panel = document.getElementById(trigger.getAttribute('aria-controls'));
  trigger.addEventListener('click', () => {
    const open = trigger.getAttribute('aria-expanded') === 'true';
    closeAll(trigger);
    trigger.setAttribute('aria-expanded', String(!open));
    panel.hidden = open;
    if (!open) panel.querySelector('a, button')?.focus();
  });
});
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  const open = document.querySelector('[data-menu-trigger][aria-expanded="true"]');
  if (open) { closeAll(); open.focus(); }
});
```

## Reduced motion

Every transition and animation on the page needs a guard. Do not disable motion wholesale with
`* { animation: none }` — that breaks loading indicators, which users still need. Reduce durations
and remove *movement*, keeping opacity changes.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
  .reveal { opacity: 1 !important; transform: none !important; }
  .spinner { animation-duration: 1.2s !important; animation-iteration-count: infinite !important; }
}
```

Also: no parallax, no scroll-jacking, no auto-advancing carousels without a pause control, and no
animation that moves more than a small distance. The tasteful-restraint of this design language
makes this easy — it does not want big motion anyway.

## Semantics and structure

```html
<a class="skip-link" href="#main">Skip to main content</a>
<header>
  <nav aria-label="Main">…</nav>
</header>
<main id="main">
  <h1>…</h1>
  <section aria-labelledby="latest"><h2 id="latest">…</h2></section>
</main>
<footer>
  <nav aria-label="Footer">…</nav>
</footer>
```

- One `<h1>`, `<h2>` per section, `<h3>` per card. Never skip a level for size — that is what CSS
  classes are for.
- `<section>` needs an accessible name (`aria-labelledby` pointing at its heading) to register as a
  landmark.
- Real `<button>` for actions, real `<a href>` for navigation. A `<div onclick>` has no keyboard
  behaviour, no role, and no focus.
- Decorative icons: `aria-hidden="true"`. Icon-only buttons: `aria-label`.
- Product images: descriptive alt. Background/atmospheric images: CSS background or `alt=""`.

## Targets and zoom

- Minimum 44×44px touch target (WCAG 2.5.8 asks 24×24 as AA; 44 is the practical floor). The 48px
  button height clears this; a 32px chip does not, so give chips padding or a pseudo-element hit
  area.
- 24px minimum between adjacent targets, which the 24px grid gap gives you for free.
- Layout must hold at 200% browser zoom and at 400% with reflow (WCAG 1.4.10), which means no fixed
  heights on text containers and no horizontal scrolling at 320px width.
- Respect `rem` units so browser font-size settings work. The `clamp()` values in `tokens.md` are
  all `rem`-based for this reason — do not convert them to `px`.

## Forms

- Every input has a visible `<label>` — a placeholder is not a label and disappears on input.
- `aria-invalid="true"` plus `aria-describedby` pointing at the error message.
- Errors announced with `aria-live="polite"`, not an `alert()`.
- Consent checkboxes unchecked by default, with terms links inside the label.
- Do not disable the submit button until the form is valid; let people submit and get errors, which
  is more discoverable than a permanently-grey button with no explanation.

## Quick audit

Before shipping, in this order:

1. Tab through the entire page. Every interactive thing reachable, focus always visible, order
   logical, no traps.
2. Turn on the OS reduced-motion setting and reload. Nothing moves.
3. Zoom to 200%. Nothing overlaps or clips.
4. Resize to 320px wide. No horizontal scroll.
5. Run a contrast checker on every text/background pair, including text on tints and on the dark
   band.
6. Read the link list with a screen reader, or just list every link's text — any duplicates without
   distinguishing context are bugs.
7. Disable images. Alt text should still tell the story.
