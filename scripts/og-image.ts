// The share image (public/og.png, 1200×630): the logo and the tagline on white. Built by `npm run build` (npm run og on its own).
//
// Everything is drawn as paths, so the result never depends on the fonts installed: the logo from
// public/logo.svg, the tagline from Source Sans 3 at its regular weight. The font is the static
// @fontsource/source-sans-3 (dev dependency): the site's variable .woff2 can't be set to a weight by the
// font reader, fontkitten (installed with Astro; add it as a dev dependency if Astro stops bringing it).
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { create, type Font } from "fontkitten";

const TAGLINE = "Adjustable charity cost-effectiveness models, by AI";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const W = 1200;
const H = 630;
const INK_2 = "#4a5468";

/** A line of text as SVG paths, its baseline at (x, y), in Source Sans 3 at the given weight. */
function textPath(text: string, x: number, y: number, size: number, weight: number): string {
  const file = join(root, `node_modules/@fontsource/source-sans-3/files/source-sans-3-latin-${weight}-normal.woff`);
  const font = create(readFileSync(file)) as Font;
  const k = size / font.unitsPerEm;
  let pen = 0;
  const parts = font.glyphsForString(text).map((g) => {
    const d = g.path.toSVG();
    const part = d ? `<path transform="translate(${x + pen * k} ${y}) scale(${k} ${-k})" d="${d}"/>` : "";
    pen += g.advanceWidth;
    return part;
  });
  return parts.join("");
}

// The logo at 720px wide, its inner markup reused as a group.
const logo = readFileSync(join(root, "public/logo.svg"), "utf8");
const [, vw, vh] = logo.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)!.map(Number);
const inner = logo.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "").replace(/<title[^>]*>[\s\S]*?<\/title>/, "");
const logoW = 720;
const scale = logoW / vw;
const x = 110;
const logoY = 170;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#fff"/>
  <g transform="translate(${x} ${logoY}) scale(${scale})">${inner}</g>
  <g fill="${INK_2}">${textPath(TAGLINE, x + 2, logoY + vh * scale + 110, 40, 400)}</g>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(join(root, "public/og.png"));
console.log(`public/og.png: "${TAGLINE}"`);
