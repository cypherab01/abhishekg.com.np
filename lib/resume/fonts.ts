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
 */
export function registerResumeFonts() {
  if (registered) return;

  Font.register({
    family: "Roboto",
    fonts: [
      { src: path.join(ASSETS_DIR, "roboto-400-normal.ttf"), fontWeight: 400 },
      { src: path.join(ASSETS_DIR, "roboto-500-normal.ttf"), fontWeight: 500 },
      { src: path.join(ASSETS_DIR, "roboto-600-normal.ttf"), fontWeight: 600 },
      { src: path.join(ASSETS_DIR, "roboto-700-normal.ttf"), fontWeight: 700 },
      {
        src: path.join(ASSETS_DIR, "roboto-400-italic.ttf"),
        fontWeight: 400,
        fontStyle: "italic",
      },
      {
        src: path.join(ASSETS_DIR, "roboto-500-italic.ttf"),
        fontWeight: 500,
        fontStyle: "italic",
      },
    ],
  });

  registered = true;
}
