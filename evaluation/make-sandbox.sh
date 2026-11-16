#!/usr/bin/env bash
# Makes a blind copy of the repo for a build-cea evaluation run (docs/eval-skills.md).
#   evaluation/make-sandbox.sh <dest> <charity-id> [<charity-id> ...]
# The copy has no git history, no bulk imports (models/grants) other than those a shared destination
# set or a kept model reads, and none of the named charities' models:
# every model whose `charity` is one of them, every model that extends or reads (#id) one that goes or
# reads their figure (#owner:charity), and their write-ups and audits, plus any write-up whose file name
# mentions the charity. The Life You Can Save's destination list drops them (as charities without a
# model). GiveWell's sheet inputs (facts/givewell*.json) lose the rows only the excluded charities'
# sheets read, and text naming the charities or their models is removed from every Markdown file, the
# JSON of facts, models, charities and waivers, and the registers and comments of scripts/, src/ and
# evaluation/. The named charities' records keep only name, cause and website. The copy is then
# searched for their names, aliases and removed model ids; any hit fails the run. node_modules is a
# symlink; generated/ starts empty.
set -euo pipefail
dest=$1; shift
src=$(cd "$(dirname "$0")/.." && pwd)
mkdir -p "$dest"
rsync -a --exclude .git --exclude node_modules --exclude dist --exclude .astro --exclude 'models/grants' \
  --exclude generated --exclude inventory --exclude 'evaluation/blind-runs' --exclude 'evaluation/dev-runs' --exclude docs/eval-skills.md --exclude 'evaluation/*.test.ts' --exclude evaluation/make-sandbox.sh \
  --exclude '.claude/worktrees' --exclude 'scripts/convert-*' --exclude 'scripts/import-*' --exclude scripts/givewell-manifest.py --exclude scripts/collect-resources.py "$src/" "$dest/"
ln -sfn "$src/node_modules" "$dest/node_modules"
mkdir -p "$dest/generated" # scripts write there (scripts/summaries.ts)
names_file=$(mktemp)
trap 'rm -f "$names_file"' EXIT
node - "$dest" "$src" "$names_file" "$@" <<'JS'
const fs = require("fs"), path = require("path");
const [dest, src, namesFile, ...ids] = process.argv.slice(2);
// Short names the docs use for a charity besides its id and name.
const ALIASES = { "against-malaria-foundation": ["AMF"], "the-humane-league": ["THL"], "sociedade-vegetariana-brasileira": ["SVB"],
  "dansk-vegetarisk-forening": ["DVF"], "shrimp-welfare-project": ["SWP"], "helen-keller-intl": ["Helen Keller"], "the-life-you-can-save": ["TLYCS"] };
const walk = (d) => fs.readdirSync(d).flatMap((f) => {
  const p = path.join(d, f);
  return fs.statSync(p).isDirectory() ? walk(p) : f.endsWith(".json") ? [p] : [];
});
// Bulk imports a shared destination set reads live (src/engine/moved-money.ts names them by model or
// charity id) or a sandbox model reads (`#id`, `#owner:charity`) come along, with the models they
// extend and read, unless they are an excluded charity's.
{
  const named = new Set([...fs.readFileSync(path.join(src, "src/engine/moved-money.ts"), "utf8").matchAll(/"(?:[a-z-]+:)?([a-z0-9][a-z0-9-]+)"/g)].map((x) => x[1]));
  const grantsDir = path.join(src, "models/grants");
  const grants = walk(grantsDir).map((p) => { const s = fs.readFileSync(p, "utf8"); return { p, s, m: JSON.parse(s) }; });
  const byId = new Map(grants.map((g) => [g.m.id, g]));
  const charityOf = (g) => g.m.charity ?? (byId.get(g.m.extends) ? charityOf(byId.get(g.m.extends)) : undefined);
  const ownerOf = (g) => g.m.owner ?? (byId.get(g.m.extends) ? ownerOf(byId.get(g.m.extends)) : path.relative(grantsDir, g.p).split(path.sep)[0]);
  const keep = new Set();
  const refsIn = (s) => [...s.matchAll(/#([a-z0-9][a-z0-9-]*)(?::([a-z0-9][a-z0-9-]*))?/g)];
  const add = (g) => {
    if (!g || keep.has(g) || ids.includes(charityOf(g))) return;
    keep.add(g);
    add(byId.get(g.m.extends));
    follow(g.s);
  };
  const follow = (s) => {
    for (const [, a, b] of refsIn(s)) {
      if (!b) add(byId.get(a));
      else if (a !== "cause") for (const g of grants) if (charityOf(g) === b && ownerOf(g) === a) add(g);
    }
  };
  for (const g of grants) if (named.has(g.m.id) || named.has(charityOf(g))) add(g);
  for (const p of walk(path.join(dest, "models"))) {
    const s = fs.readFileSync(p, "utf8");
    if (!ids.includes(JSON.parse(s).charity)) follow(s);
  }
  for (const g of keep) {
    const to = path.join(dest, path.relative(src, g.p));
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(g.p, to);
  }
}
// The names that must not show: the charities' ids, names and aliases and the removed models' ids,
// whatever joins their words (space, hyphen, underscore: fact ids and waiver keys write them so).
const names = ids.flatMap((c) => {
  const p = path.join(src, "charities", `${c}.json`);
  const r = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : {};
  return [c, r.name, ...(r.aliases ?? []), ...(ALIASES[c] ?? [])].filter(Boolean);
});
const namesRe = () => new RegExp(`(?<![A-Za-z0-9])(${names.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/[-_ ]+/g, "[-_\\s]+")).join("|")})(?![A-Za-z0-9])`, "i");
// The Life You Can Save's destination list (src/engine/moved-money.ts) loses an excluded charity, as
// a charity without a model: its line, its fact (below) and its term in the shared row of every model
// (scripts/relink-tlycs.ts runs afterwards to make the row word for word the shared one).
const mmPath = path.join(dest, "src/engine/moved-money.ts");
const droppedDest = []; // [fact key, destination]
{
  let inList = false;
  const lines = fs.readFileSync(mmPath, "utf8").split("\n");
  const kept = lines.filter((l) => {
    if (/TLYCS_DESTINATIONS\b.*=\s*\[\s*$/.test(l)) inList = true;
    else if (inList && /^\s*\];/.test(l)) inList = false;
    const x = inList && /^\s*\["([a-z0-9_]+)", "((?:[a-z0-9-]+:)?([a-z0-9-]+))"\],\s*$/.exec(l);
    if (x && ids.includes(x[3])) { droppedDest.push([x[1], x[2]]); return false; }
    return true;
  });
  if (droppedDest.length) fs.writeFileSync(mmPath, kept.join("\n"));
}
const dropTerm = (f, t) => f.replace(new RegExp(` \\+ ${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![a-z0-9_:-])|${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![a-z0-9_:-]) \\+ `), "");
const models = walk(path.join(dest, "models")).map((p) => ({ p, m: JSON.parse(fs.readFileSync(p, "utf8")) }));
for (const { p, m } of models) {
  const r = (m.rows ?? []).find((r) => r.id === "value_tlycs_recommended");
  if (!r || !droppedDest.length) continue;
  for (const [k, id] of droppedDest) r.formula = dropTerm(dropTerm(r.formula, `@meta.tlycs_moved_2025_${k} * #${id}`), `@meta.tlycs_moved_2025_${k}`);
  fs.writeFileSync(p, JSON.stringify(m, null, 2) + "\n");
}
// The models a model reads: `#id` in a formula (`#owner:charity` names a charity's figure, not a model).
const reads = (m) => (m.rows ?? []).flatMap((r) => [...String(r.formula ?? "").matchAll(/#([a-z0-9][a-z0-9-]*)(:?)/g)].filter((x) => !x[2]).map((x) => x[1]));
const readsExcluded = (m) => (m.rows ?? []).some((r) => [...String(r.formula ?? "").matchAll(/#([a-z0-9][a-z0-9-]*):([a-z0-9][a-z0-9-]*)/g)].some((x) => x[1] !== "cause" && ids.includes(x[2])));
// A model goes if it is about an excluded charity, extends or reads a model that goes, reads an
// excluded charity's figure, or reads a model the sandbox doesn't have (a bulk import).
const present = new Set(models.map(({ m }) => m.id));
const gone = new Set();
let changed = true;
while (changed) {
  changed = false;
  for (const { m } of models)
    if (!gone.has(m.id) && (ids.includes(m.charity) || (m.extends && gone.has(m.extends)) || readsExcluded(m) || reads(m).some((r) => gone.has(r) || !present.has(r)))) { gone.add(m.id); changed = true; }
}
for (const { p, m } of models) if (gone.has(m.id)) fs.rmSync(p);
names.push(...gone); // the removed models' ids (waivers, registers and fact sources name them)
const names_re = namesRe();
// Their audits go with them.
const audits = path.join(dest, "audits");
if (fs.existsSync(audits)) for (const f of fs.readdirSync(audits)) if (gone.has(f.replace(/\.md$/, "")) || names_re.test(f)) fs.rmSync(path.join(audits, f), { recursive: true });
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
// an evaluator's sheet of it, waivers, per-model registers in scripts) is removed: lines of Markdown,
// entries and comment lines of TypeScript, string values of JSON (formulas keep theirs); JSON entries
// keyed by a name and fact rows named after one that nothing reads go whole. The numbers stay where
// other models read them.
const keptText = walk(path.join(dest, "models")).map((p) => fs.readFileSync(p, "utf8")).join("\n");
let redacted = 0;
// facts: a row named after them that nothing reads goes; charity records: a programme line read
// from a removed model goes.
const scrub = (v, k, facts) => {
  if (typeof v === "string") return k !== "id" && k !== "formula" && names_re.test(v) ? (redacted++, k === "url" ? "https://example.org/removed-for-a-blind-run" : "(removed for a blind run)") : v;
  const goes = (x) => x && typeof x === "object" && ((facts && typeof x.id === "string" && names_re.test(x.id) && !keptText.includes(`.${x.id}`)) || (typeof x.models === "string" && names_re.test(x.models)));
  if (Array.isArray(v)) return v.filter((x) => !goes(x) || (redacted++, false)).map((x) => scrub(x, k, facts));
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).filter(([kk]) => !names_re.test(kk) || (redacted++, false)).map(([kk, x]) => [kk, scrub(x, kk, facts)]));
  return v;
};
const own = new Set(ids.map((c) => path.join(dest, "charities", `${c}.json`)));
for (const p of [...walk(path.join(dest, "facts")), ...walk(path.join(dest, "assumptions")), ...walk(path.join(dest, "models")), ...walk(path.join(dest, "charities")), path.join(dest, "src/engine/normalization-waivers.json")].filter((p) => fs.existsSync(p) && !own.has(p))) {
  const raw = fs.readFileSync(p, "utf8");
  if (!names_re.test(raw)) continue;
  fs.writeFileSync(p, JSON.stringify(scrub(JSON.parse(raw), undefined, p.includes(`${path.sep}facts${path.sep}`)), null, raw.startsWith('{\n "') ? 1 : 2) + "\n");
}
const files = (d, ext) => fs.readdirSync(d).flatMap((f) => {
  const p = path.join(d, f);
  if (f === "node_modules" || f === ".git") return [];
  return fs.lstatSync(p).isDirectory() ? files(p, ext) : ext.some((e) => f.endsWith(e)) ? [p] : [];
});
for (const p of files(dest, [".md"])) {
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
// A TypeScript line naming them is dropped when it stands alone: a comment line, or a register entry
// (`"id": {…},`, `["key", "…"],`) whose brackets close on the line.
const balanced = (l) => {
  const s = l.replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/g, "");
  const n = (re) => (s.match(re) ?? []).length;
  return n(/[([{]/g) === n(/[)\]}]/g);
};
for (const p of [...files(path.join(dest, "scripts"), [".ts", ".py"]), ...files(path.join(dest, "src"), [".ts"]), ...files(path.join(dest, "evaluation"), [".ts"])]) {
  const lines = fs.readFileSync(p, "utf8").split("\n");
  const kept = lines.filter((l) => !(names_re.test(l) && (/^\s*(\/\/|\*|\/\*|#)/.test(l) || (/^\s*["'[]/.test(l) && balanced(l)))));
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
fs.writeFileSync(namesFile, JSON.stringify({ names, relink: droppedDest.length > 0 }));
console.log(`removed ${gone.size} models: ${[...gone].sort().join(", ")}; ${dropped} GiveWell sheet rows only they read; ${redacted} lines or strings naming them`);
JS
[ "$(node -p "JSON.parse(require('fs').readFileSync(process.argv[1], 'utf8')).relink" "$names_file")" = true ] && (cd "$dest" && npx tsx scripts/relink-tlycs.ts)
# Leak check: no file in the copy may name them, except their own records.
node - "$dest" "$names_file" "$@" <<'JS'
const fs = require("fs"), path = require("path");
const [dest, namesFile, ...ids] = process.argv.slice(2);
const { names } = JSON.parse(fs.readFileSync(namesFile, "utf8"));
const re = new RegExp(`(?<![A-Za-z0-9])(${names.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/[-_ ]+/g, "[-_\\s]+")).join("|")})(?![A-Za-z0-9])`, "i");
const own = new Set(ids.map((c) => path.join(dest, "charities", `${c}.json`)));
const files = (d) => fs.readdirSync(d).flatMap((f) => {
  const p = path.join(d, f);
  if (f === "node_modules") return [];
  return fs.lstatSync(p).isDirectory() ? files(p) : [p];
});
const hits = [];
for (const p of files(dest)) {
  if (own.has(p) || /\.(png|jpe?g|gif|webp|ico|pdf|woff2?|ttf|otf|zip|gz)$/i.test(p) || fs.statSync(p).size > 20e6) continue;
  fs.readFileSync(p, "utf8").split("\n").forEach((l, i) => { if (re.test(l)) hits.push(`${path.relative(dest, p)}:${i + 1}: ${l.trim().slice(0, 160)}`); });
}
if (hits.length) {
  console.error(`make-sandbox: ${hits.length} lines still name them:\n${hits.slice(0, 40).join("\n")}`);
  process.exit(1);
}
JS
echo "sandbox at $dest without: $*"
