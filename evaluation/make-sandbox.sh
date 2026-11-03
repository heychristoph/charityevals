#!/usr/bin/env bash
# Makes a blind copy of the repo for a build-cea evaluation run (docs/eval-skills.md).
#   evaluation/make-sandbox.sh <dest> <charity-id> [<charity-id> ...]
# The copy has no git history, no bulk imports (models/grants) and none of the named charities' models:
# every model whose `charity` is one of them, every model that extends or reads (#id) one that goes, and
# their write-ups, plus any write-up whose file name mentions the charity. GiveWell's shared-input facts
# (facts/givewell*.json) keep only the rows a remaining model or a build-cea template reads, so the
# models left compute and no excluded sheet's inputs show. The named charities' records keep only name,
# cause and website. node_modules is a symlink.
set -euo pipefail
dest=$1; shift
src=$(cd "$(dirname "$0")/.." && pwd)
mkdir -p "$dest"
rsync -a --exclude .git --exclude node_modules --exclude dist --exclude .astro --exclude 'models/grants' \
  --exclude generated --exclude inventory --exclude 'evaluation/blind-runs' --exclude 'evaluation/dev-runs' --exclude docs/eval-skills.md --exclude 'evaluation/*.test.ts' \
  --exclude '.claude/worktrees' --exclude 'scripts/convert-*' --exclude 'scripts/import-*' --exclude scripts/givewell-manifest.py --exclude scripts/collect-resources.py "$src/" "$dest/"
ln -sfn "$src/node_modules" "$dest/node_modules"
node - "$dest" "$src" "$@" <<'JS'
const fs = require("fs"), path = require("path");
const [dest, src, ...ids] = process.argv.slice(2);
// Short names the docs use for a charity besides its id and name.
const ALIASES = { "against-malaria-foundation": ["AMF"], "the-humane-league": ["THL"], "sociedade-vegetariana-brasileira": ["SVB"],
  "dansk-vegetarisk-forening": ["DVF"], "shrimp-welfare-project": ["SWP"], "helen-keller-intl": ["Helen Keller"], "the-life-you-can-save": ["TLYCS"] };
const walk = (d) => fs.readdirSync(d).flatMap((f) => {
  const p = path.join(d, f);
  return fs.statSync(p).isDirectory() ? walk(p) : f.endsWith(".json") ? [p] : [];
});
const models = walk(path.join(dest, "models")).map((p) => ({ p, m: JSON.parse(fs.readFileSync(p, "utf8")), s: fs.readFileSync(p, "utf8") }));
// The models a model reads: `#id` in a formula (`#owner:charity` names a charity's figure, not a model).
const reads = (m) => (m.rows ?? []).flatMap((r) => [...String(r.formula ?? "").matchAll(/#([a-z0-9][a-z0-9-]*)(:?)/g)].filter((x) => !x[2]).map((x) => x[1]));
// A model goes if it is about an excluded charity, extends or reads a model that goes, or reads a
// model the sandbox doesn't have (a bulk import).
const present = new Set(models.map(({ m }) => m.id));
const gone = new Set();
let changed = true;
while (changed) {
  changed = false;
  for (const { m } of models)
    if (!gone.has(m.id) && (ids.includes(m.charity) || (m.extends && gone.has(m.extends)) || reads(m).some((r) => gone.has(r) || !present.has(r)))) { gone.add(m.id); changed = true; }
}
for (const { p, m } of models) if (gone.has(m.id)) fs.rmSync(p);
// GiveWell's sheet inputs (facts/givewell*.json except the house constants): drop the rows only the
// excluded charities' sheets read (their models here and their bulk imports), so no excluded sheet's
// inputs show; rows anything else reads stay.
const srcModels = [...walk(path.join(src, "models"))].map((p) => ({ m: JSON.parse(fs.readFileSync(p, "utf8")), s: fs.readFileSync(p, "utf8") }));
const factRefs = (s) => [...s.matchAll(/@(givewell[a-z_]*)\.([a-z0-9_]+)/g)].map((x) => `${x[1]}.${x[2]}`);
const theirs = new Set(srcModels.filter(({ m }) => gone.has(m.id) || ids.includes(m.charity)).flatMap(({ s }) => factRefs(s)));
const others = new Set([...srcModels.filter(({ m }) => !gone.has(m.id) && !ids.includes(m.charity)).map(({ s }) => s),
  ...walk(path.join(dest, ".claude/skills")).map((p) => fs.readFileSync(p, "utf8")),
  ...walk(path.join(dest, "assumptions")).map((p) => fs.readFileSync(p, "utf8"))].flatMap(factRefs));
let dropped = 0;
for (const p of walk(path.join(dest, "facts")).filter((p) => path.basename(p).startsWith("givewell") && !p.endsWith("givewell_shared.json"))) {
  const f = JSON.parse(fs.readFileSync(p, "utf8"));
  const rows = f.rows.filter((r) => !theirs.has(`${f.id}.${r.id}`) || others.has(`${f.id}.${r.id}`));
  dropped += f.rows.length - rows.length;
  fs.writeFileSync(p, JSON.stringify({ ...f, rows }, null, 1) + "\n");
}
// Text that names an excluded charity (the docs' per-model tables, fact explainers and sources citing
// an evaluator's sheet of it, waiver reasons) is removed: lines of Markdown, string values of JSON.
// The numbers stay where other models read them.
const names = ids.flatMap((c) => {
  const p = path.join(src, "charities", `${c}.json`);
  const r = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : {};
  return [c, r.name, ...(r.aliases ?? []), ...(ALIASES[c] ?? [])].filter(Boolean);
});
const names_re = new RegExp(`\\b(${names.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/ /g, "\\s+")).join("|")})\\b`, "i");
let redacted = 0;
const scrub = (v, k) => {
  if (typeof v === "string") return k !== "id" && names_re.test(v) ? (redacted++, "(removed for a blind run)") : v;
  if (Array.isArray(v)) return v.map((x) => scrub(x, k));
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([kk, x]) => [kk, scrub(x, kk)]));
  return v;
};
for (const p of [...walk(path.join(dest, "facts")), ...walk(path.join(dest, "assumptions")), path.join(dest, "src/engine/normalization-waivers.json")].filter((p) => fs.existsSync(p))) {
  const raw = fs.readFileSync(p, "utf8");
  if (!names_re.test(raw)) continue;
  fs.writeFileSync(p, JSON.stringify(scrub(JSON.parse(raw)), null, raw.startsWith('{\n "') ? 1 : 2) + "\n");
}
const md = (d) => fs.readdirSync(d).flatMap((f) => { const p = path.join(d, f); return fs.statSync(p).isDirectory() ? md(p) : f.endsWith(".md") ? [p] : []; });
for (const p of [...md(path.join(dest, "docs")), ...md(path.join(dest, ".claude/skills"))]) {
  const lines = fs.readFileSync(p, "utf8").split("\n");
  // A name can wrap onto the next line: drop both lines.
  const drop = new Set();
  lines.forEach((l, i) => {
    if (names_re.test(l)) drop.add(i);
    else if (i + 1 < lines.length && names_re.test(`${l}\n${lines[i + 1]}`)) { drop.add(i); drop.add(i + 1); }
  });
  const kept = lines.filter((_, i) => !drop.has(i));
  if (kept.length < lines.length) { redacted += lines.length - kept.length; fs.writeFileSync(p, kept.join("\n")); }
}
const writeups = path.join(dest, "writeups");
for (const f of fs.readdirSync(writeups)) {
  const id = f.replace(/\.md$/, "");
  if (gone.has(id) || ids.some((c) => f.includes(c))) fs.rmSync(path.join(writeups, f));
}
for (const c of ids) {
  const p = path.join(dest, "charities", `${c}.json`);
  if (!fs.existsSync(p)) continue;
  const r = JSON.parse(fs.readFileSync(p, "utf8"));
  fs.writeFileSync(p, JSON.stringify({ id: r.id, name: r.name, cause: r.cause, website: r.website }, null, 2) + "\n");
}
console.log(`removed ${gone.size} models: ${[...gone].sort().join(", ")}; ${dropped} GiveWell sheet rows only they read; ${redacted} lines or strings naming them`);
JS
echo "sandbox at $dest without: $*"
