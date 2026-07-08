import "server-only";
import path from "node:path";
import { Font } from "@react-pdf/renderer";

let registered = false;

const ASSETS_DIR = path.join(process.cwd(), "lib/resume/assets");

/**
 * Vendored, genuine TrueType files (not the woff2 files @fontsource ships) —
 * @react-pdf/renderer's bundled fontkit has a subsetting bug that corrupts
 * certain glyph combinations when embedding woff2-sourced fonts, verified
 * during development. Plain .ttf embeds reliably.
 *
 * Tinos (a metric-compatible Times New Roman clone) was chosen to match the
 * classic serif look of the original LaTeX resume template.
 */
export function registerResumeFonts() {
  if (registered) return;

  Font.register({
    family: "Tinos",
    fonts: [
      { src: path.join(ASSETS_DIR, "tinos-400-normal.ttf"), fontWeight: 400 },
      { src: path.join(ASSETS_DIR, "tinos-700-normal.ttf"), fontWeight: 700 },
      {
        src: path.join(ASSETS_DIR, "tinos-400-italic.ttf"),
        fontWeight: 400,
        fontStyle: "italic",
      },
      {
        src: path.join(ASSETS_DIR, "tinos-700-italic.ttf"),
        fontWeight: 700,
        fontStyle: "italic",
      },
    ],
  });

  registered = true;
}
