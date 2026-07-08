Roboto TTF files (Apache License 2.0, https://github.com/google/fonts/tree/main/apache/roboto),
fetched from Google Fonts and vendored here as genuine `.ttf` files.

These are used instead of the `@fontsource/roboto` npm package's `.woff2` files because
`@react-pdf/renderer`'s bundled `fontkit` has a font-subsetting bug that corrupts certain
glyph combinations when embedding woff2-sourced fonts (verified during development — see
`docs/superpowers/plans/2026-07-08-admin-resume-builder.md`). Plain `.ttf` embeds reliably.
