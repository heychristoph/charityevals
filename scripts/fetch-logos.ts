// Fetches each charity's logo from its own website into public/logos/<id>.webp and records where
// each came from in generated/logos.json.
//   npx tsx scripts/fetch-logos.ts               every charity with a website
//   npx tsx scripts/fetch-logos.ts --only <id>   one or more ids (repeat --only); others keep their entry
//   npx tsx scripts/fetch-logos.ts --missing     only charities without a logo yet
//
// Candidates, best first: the icons the homepage declares (apple-touch-icon, <link rel="icon"> with
// sizes or an SVG) and the conventional /apple-touch-icon.png and /favicon.ico; only when none of
// those is big enough, the charity's own square logo <img> on the page, then a square og:image. The
// largest square-ish candidate wins; one under MIN_PX is rejected as too blurry to show.
//
// Downloads are untrusted data. They are held in memory only, never written as-is or executed: every
// logo is decoded and re-encoded by sharp as a 128px WebP, so no SVG (and none of its scripts or
// external references) reaches the site. SVGs are rasterized from a buffer, with no base URL, so the
// renderer cannot load anything they reference. Sizes and pixel counts are capped.
//
// Logos are trademarks of their owners, shown only to identify each charity (nominative use).
// Uses sharp, which Astro already installs for image processing.
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import sharp, { type Sharp } from "sharp";

const root = join(import.meta.dirname, "..");
const outDir = join(root, "public/logos");
const manifestPath = join(root, "generated/logos.json");

const SIZE = 128; // output edge, px: over 3x the largest (40px) display
const MIN_PX = 48; // smallest source edge worth showing
const MAX_BYTES = 20 * 1024; // per output file
const MAX_DOWNLOAD = 3 * 1024 * 1024;
const TIMEOUT_MS = 15_000;
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36 charityevals-logo-fetcher (+https://charityevals.org)";

/** Hand-picked image URLs, for sites whose declared icons are unusable. Same processing applies. */
const OVERRIDES: Record<string, string> = {};

/** Logos checked by eye and found unusable at 24-40px; these charities get the monogram instead. */
const REJECTED: Record<string, string> = {
  taimaka: "the site icon is a screenshot of small text, unreadable when shrunk",
};

/** bleed: the logo fills its square to the corners (an app icon), so it is shown edge to edge
 * rather than inset on a white tile. */
type Entry = { file: string; source: string; kind: string; sourcePx: number | "svg"; bleed: boolean; fetched: string };
type Manifest = Record<string, Entry>;
type Candidate = { url: string; kind: string; declared: number };
// Fallbacks, tried only when the site declares no usable icon: a header logo, then a square og:image.
const PAGE_LOGO = -1;
const OG_IMAGE = -2;
/** Platform default icons that identify the CMS, not the charity. */
const GENERIC = [/\/wp-includes\/images\/w-logo/i, /static\d*\.squarespace\.com\/static\/ta\//i, /wix\.com\/favicon\.ico/i];

const args = process.argv.slice(2);
const only = args.flatMap((a, i) => (a === "--only" ? [args[i + 1]] : []));
const missingOnly = args.includes("--missing");

const charities = readdirSync(join(root, "charities"))
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(join(root, "charities", f), "utf8")) as { id: string; name: string; website?: string })
  .sort((a, b) => a.id.localeCompare(b.id));

const manifest: Manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : {};

async function get(url: string, accept: string): Promise<{ body: Buffer; type: string; url: string }> {
  const res = await fetch(url, { headers: { "user-agent": UA, accept }, redirect: "follow", signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const len = Number(res.headers.get("content-length") ?? 0);
  if (len > MAX_DOWNLOAD) throw new Error("too large");
  const chunks: Buffer[] = [];
  let total = 0;
  for await (const chunk of res.body as unknown as AsyncIterable<Uint8Array>) {
    total += chunk.byteLength;
    if (total > MAX_DOWNLOAD) throw new Error("too large");
    chunks.push(Buffer.from(chunk));
  }
  return { body: Buffer.concat(chunks), type: res.headers.get("content-type") ?? "", url: res.url };
}

const attr = (tag: string, name: string) =>
  tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"))?.slice(2).find((v) => v !== undefined);
const decodeEntities = (s: string) => s.replace(/&amp;/g, "&").replace(/&#x2F;/gi, "/").replace(/&#47;/g, "/");

/** Icons the page declares, with the edge length they claim (Infinity for SVG, 0 when unknown). */
function candidatesFrom(html: string, base: string, name: string): Candidate[] {
  const out: Candidate[] = [];
  const abs = (href: string) => {
    try {
      const u = new URL(decodeEntities(href.trim()), base);
      return u.protocol === "https:" || u.protocol === "http:" ? u.href : undefined;
    } catch {
      return undefined;
    }
  };
  for (const tag of html.match(/<link\b[^>]*>/gi) ?? []) {
    const rel = (attr(tag, "rel") ?? "").toLowerCase().split(/\s+/);
    const href = attr(tag, "href");
    if (!href || href.startsWith("data:")) continue;
    const url = abs(href);
    if (!url) continue;
    const isSvg = /\.svg(\?|#|$)/i.test(url) || /svg/i.test(attr(tag, "type") ?? "");
    const sizes = (attr(tag, "sizes") ?? "").toLowerCase();
    const declared = isSvg || sizes === "any" ? Infinity : Math.max(0, ...[...sizes.matchAll(/(\d+)x(\d+)/g)].map((m) => Math.min(+m[1], +m[2])));
    if (rel.includes("apple-touch-icon") || rel.includes("apple-touch-icon-precomposed")) {
      out.push({ url, kind: "apple-touch-icon", declared: declared || 180 });
    } else if (rel.includes("icon")) {
      out.push({ url, kind: isSvg ? "svg-icon" : "icon", declared });
    }
  }
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const prop = (attr(tag, "property") ?? attr(tag, "name") ?? "").toLowerCase();
    const content = attr(tag, "content");
    if ((prop === "og:image" || prop === "og:logo") && content) {
      const url = abs(content);
      if (url) out.push({ url, kind: prop, declared: OG_IMAGE });
    }
  }
  // The charity's own logo image on the page: alt text naming the charity, or a file name carrying
  // its domain. A bare "logo" match would pick up partner and social-media logos.
  const stem = new URL(base).hostname.replace(/^www\./, "").split(".")[0].toLowerCase();
  const nameLc = name.toLowerCase();
  for (const tag of html.match(/<img\b[^>]*>/gi) ?? []) {
    const src = attr(tag, "src");
    const alt = (attr(tag, "alt") ?? "").toLowerCase();
    if (!src || src.startsWith("data:") || !/logo/i.test(tag)) continue;
    const url = abs(src);
    if (!url) continue;
    const file = new URL(url).pathname.split("/").pop()!.toLowerCase(); // not the host: every image on the site carries that
    if (!(alt.includes(nameLc) || (stem.length >= 4 && file.includes(stem)))) continue;
    out.push({ url, kind: "page logo", declared: PAGE_LOGO });
    break;
  }
  return out.filter((c) => !GENERIC.some((re) => re.test(c.url)));
}

/** Largest image inside an .ico: PNG entries pass through; 32-bit BMP entries are unpacked to raw RGBA. */
function fromIco(buf: Buffer): { input: Buffer; raw?: { width: number; height: number; channels: 4 } } | undefined {
  if (buf.length < 6 || buf.readUInt16LE(0) !== 0 || buf.readUInt16LE(2) !== 1) return undefined;
  const n = buf.readUInt16LE(4);
  let best: { w: number; off: number; len: number } | undefined;
  for (let i = 0; i < n && 6 + 16 * (i + 1) <= buf.length; i++) {
    const e = 6 + 16 * i;
    const w = buf[e] || 256;
    const len = buf.readUInt32LE(e + 8);
    const off = buf.readUInt32LE(e + 12);
    if (off + len > buf.length) continue;
    if (!best || w > best.w) best = { w, off, len };
  }
  if (!best) return undefined;
  const img = buf.subarray(best.off, best.off + best.len);
  if (img.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return { input: img };
  // BITMAPINFOHEADER; height counts the AND mask too.
  const hdr = img.readUInt32LE(0);
  const width = img.readInt32LE(4);
  const height = img.readInt32LE(8) / 2;
  const bpp = img.readUInt16LE(14);
  if (bpp !== 32 || width <= 0 || width > 256 || height !== width || hdr + width * height * 4 > img.length) return undefined;
  const px = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const s = hdr + ((height - 1 - y) * width + x) * 4; // bottom-up BGRA
      const d = (y * width + x) * 4;
      px[d] = img[s + 2];
      px[d + 1] = img[s + 1];
      px[d + 2] = img[s];
      px[d + 3] = img[s + 3];
    }
  }
  return { input: px, raw: { width, height, channels: 4 } };
}

type Decoded = { img: Sharp; px: number | "svg" };

async function decode(body: Buffer, type: string, url: string): Promise<Decoded | undefined> {
  const head = body.subarray(0, 512).toString("utf8").trimStart().toLowerCase();
  const isSvg = /svg/.test(type) || head.startsWith("<svg") || (head.startsWith("<?xml") && head.includes("<svg"));
  if (isSvg) {
    // Rasterized from a buffer: no base URL, so external references can't load; scripts never run in librsvg.
    const meta = await sharp(body, { limitInputPixels: 4096 * 4096 }).metadata();
    if (!meta.width || !meta.height) return undefined;
    // Render the short edge at about twice the output size, whatever the SVG's nominal size.
    const ratio = meta.width / meta.height;
    if (ratio > 1.4 || ratio < 1 / 1.4) return undefined; // a wordmark or banner, unreadable in a square
    const density = Math.min(2400, Math.max(72, Math.round((72 * SIZE * 2) / Math.min(meta.width, meta.height))));
    return { img: sharp(body, { density, limitInputPixels: 8192 * 8192 }), px: "svg" };
  }
  if (/\.ico(\?|$)/i.test(url) || /icon/.test(type) || (body.length > 4 && body.readUInt32LE(0) === 0x00010000)) {
    const ico = fromIco(body);
    if (!ico) return undefined;
    const img = ico.raw ? sharp(ico.input, { raw: ico.raw }) : sharp(ico.input, { limitInputPixels: 4096 * 4096 });
    const meta = await img.metadata();
    return meta.width && meta.height ? { img, px: Math.min(meta.width, meta.height) } : undefined;
  }
  const img = sharp(body, { limitInputPixels: 8192 * 8192, animated: false });
  const meta = await img.metadata();
  if (!meta.width || !meta.height) return undefined;
  const ratio = meta.width / meta.height;
  if (ratio > 1.4 || ratio < 1 / 1.4) return undefined; // a banner or wordmark, unreadable in a square
  return { img, px: Math.min(meta.width, meta.height) };
}

async function encode(img: Sharp): Promise<Buffer> {
  // A mark on a transparent or white ground is cropped to the mark, so every logo fills the tile the
  // same way (the page adds the margin). A filled square, such as an app icon, keeps its ground.
  const flat = await img.rotate().png().toBuffer();
  const { data: corner } = await sharp(flat).ensureAlpha().extract({ left: 0, top: 0, width: 1, height: 1 }).raw().toBuffer({ resolveWithObject: true });
  const blankGround = corner[3] < 16 || (corner[0] > 245 && corner[1] > 245 && corner[2] > 245);
  let source = sharp(flat);
  if (blankGround) {
    try {
      source = sharp(await sharp(flat).trim({ threshold: 12 }).png().toBuffer());
    } catch {
      // nothing to trim, or nothing left after trimming: keep the whole image
    }
  }
  const square = source
    .resize(SIZE, SIZE, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 }, kernel: "lanczos3" }); // output metadata is stripped by default
  for (const quality of [88, 80, 70, 60, 50]) {
    const out = await square.clone().webp({ quality, alphaQuality: 90, effort: 6 }).toBuffer();
    if (out.length <= MAX_BYTES) return out;
  }
  throw new Error("could not fit under 20 KB");
}

/** All four corners opaque: a filled square rather than a mark on a transparent ground. */
async function fillsCorners(webp: Buffer): Promise<boolean> {
  const { data, info } = await sharp(webp).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const alpha = (x: number, y: number) => data[(y * info.width + x) * info.channels + 3];
  const e = info.width - 3; // a pixel in from the edge, past any anti-aliased rounding
  return [alpha(2, 2), alpha(e, 2), alpha(2, e), alpha(e, e)].every((a) => a > 240);
}

const rank = (px: number | "svg") => (px === "svg" ? 10_000 : px);

async function logoFor(c: { id: string; name: string; website: string }): Promise<{ entry: Entry; data: Buffer } | { error: string }> {
  const candidates: Candidate[] = [];
  if (OVERRIDES[c.id]) candidates.push({ url: OVERRIDES[c.id], kind: "override", declared: Infinity });
  let base = c.website;
  let homepageError: string | undefined;
  try {
    const page = await get(c.website, "text/html,application/xhtml+xml");
    base = page.url;
    const html = page.body.toString("utf8");
    const baseHref = html.match(/<base\b[^>]*>/i)?.[0];
    const b = baseHref && attr(baseHref, "href");
    if (b) try { base = new URL(b, base).href; } catch {}
    candidates.push(...candidatesFrom(html, base, c.name));
  } catch (e) {
    homepageError = `homepage failed: ${(e as Error).message}`;
  }
  const origin = new URL(base).origin;
  candidates.push({ url: `${origin}/apple-touch-icon.png`, kind: "apple-touch-icon (default path)", declared: 180 });
  candidates.push({ url: `${origin}/favicon.ico`, kind: "favicon.ico (default path)", declared: 0 });

  const tried = new Set<string>();
  let best: { cand: Candidate; dec: Decoded } | undefined;
  const ordered = candidates.sort((a, b) => (b.kind === "override" ? 1 : 0) - (a.kind === "override" ? 1 : 0) || b.declared - a.declared);
  for (const cand of ordered) {
    if (tried.has(cand.url)) continue;
    if (cand.declared < 0 && best && rank(best.dec.px) >= MIN_PX) break; // a real icon beats any fallback
    tried.add(cand.url);
    try {
      const res = await get(cand.url, "image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8");
      if (GENERIC.some((re) => re.test(res.url))) continue; // e.g. /favicon.ico redirecting to a CMS default
      const dec = await decode(res.body, res.type, res.url);
      if (!dec) continue;
      if (!best || rank(dec.px) > rank(best.dec.px)) best = { cand: { ...cand, url: res.url }, dec };
      if (cand.kind === "override" || rank(dec.px) >= SIZE) break; // good enough; stop downloading
    } catch {
      // try the next candidate
    }
  }
  if (!best) return { error: homepageError ?? "no usable icon found" };
  if (best.dec.px !== "svg" && best.dec.px < MIN_PX) return { error: `best icon is only ${best.dec.px}px (${best.cand.url})` };
  const data = await encode(best.dec.img);
  const bleed = await fillsCorners(data);
  return {
    data,
    entry: { file: `/logos/${c.id}.webp`, source: best.cand.url, kind: best.cand.kind, sourcePx: best.dec.px, bleed, fetched: new Date().toISOString().slice(0, 10) },
  };
}

mkdirSync(outDir, { recursive: true });
const todo = charities.filter((c) => c.website && !REJECTED[c.id] && (only.length ? only.includes(c.id) : missingOnly ? !manifest[c.id] : true));
const failures: string[] = [];
const queue = [...todo];
await Promise.all(
  Array.from({ length: 6 }, async () => {
    for (let c = queue.shift(); c; c = queue.shift()) {
      // A decode or encode failure is this charity's problem only: the batch carries on and the
      // manifest is still written for every logo that did land.
      const r = await logoFor(c as { id: string; name: string; website: string }).catch((e: Error) => ({ error: `processing failed: ${e.message}` }));
      if ("error" in r) {
        // A failed fetch (often a timeout or a bot wall) keeps the logo we already have.
        failures.push(`${c.id} (${c.website}): ${r.error}${manifest[c.id] ? "; kept the existing logo" : ""}`);
      } else {
        writeFileSync(join(outDir, `${c.id}.webp`), r.data);
        manifest[c.id] = r.entry;
        console.log(`ok  ${c.id}  ${r.entry.sourcePx}${r.entry.sourcePx === "svg" ? "" : "px"}  ${(r.data.length / 1024).toFixed(1)} KB  ${r.entry.source}`);
      }
    }
  }),
);
// Charities that no longer exist, or whose logo was rejected, lose it.
const ids = new Set(charities.map((c) => c.id));
for (const id of Object.keys(manifest)) {
  if (ids.has(id) && !REJECTED[id]) continue;
  delete manifest[id];
  const p = join(outDir, `${id}.webp`);
  if (existsSync(p)) unlinkSync(p);
}

const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(manifestPath, JSON.stringify(sorted, null, 2) + "\n");
const noSite = charities.filter((c) => !c.website).map((c) => c.id);
if (noSite.length) console.log(`\nno website: ${noSite.join(", ")}`);
if (failures.length) console.log(`\nno logo:\n  ${failures.sort().join("\n  ")}`);
