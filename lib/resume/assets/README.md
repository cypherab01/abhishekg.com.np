Tinos TTF files (Apache License 2.0, https://github.com/google/fonts/tree/main/apache/tinos),
fetched from Google Fonts and vendored here as genuine `.ttf` files. Tinos is a metric-compatible
Times New Roman clone, chosen to match the classic serif look of the original LaTeX resume
template (`files/resume.tex`).

Genuine `.ttf` files are used instead of an npm font package's `.woff2` files (e.g.
`@fontsource/*`) because `@react-pdf/renderer`'s bundled `fontkit` has a font-subsetting bug that
corrupts certain glyph combinations when embedding woff2-sourced fonts (verified during
development for both Inter and Roboto woff2 — see
`docs/superpowers/plans/2026-07-08-admin-resume-builder.md`). Plain `.ttf` embeds reliably.
