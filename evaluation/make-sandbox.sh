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
  --exclude generated --exclude inventory --exclude 'evaluation/blind-runs' --exclude 'evaluation/dev-runs' --exclude docs/eval-skills.md \
  --exclude '.claude/worktrees' --exclude 'scripts/convert-*' --exclude 'scripts/import-*' --exclude scripts/givewell-manifest.py --exclude scripts/collect-resources.py "$src/" "$dest/"
ln -sfn "$src/node_modules" "$dest/node_modules"
node - "$dest" "$@" <<'JS'
const fs = require("fs"), path = require("path");
const [dest, ...ids] = process.argv.slice(2);
const walk = (d) => fs.readdirSync(d).flatMap((f) => {
  const p = path.join(d, f);
  return fs.statSync(p).isDirectory() ? walk(p) : f.endsWith(".json") ? [p] : [];
});
const models = walk(path.join(dest, "models")).map((p) => ({ p, m: JSON.parse(fs.readFileSync(p, "utf8")), s: fs.readFileSync(p, "utf8") }));
const reads = (s) => [...s.matchAll(/#([a-z0-9][a-z0-9-]*)/g)].map((x) => x[1]);
// A model goes if it is about an excluded charity, or extends or reads a model that goes.
const gone = new Set();
let changed = true;
while (changed) {
  changed = false;
  for (const { m, s } of models)
    if (!gone.has(m.id) && (ids.includes(m.charity) || (m.extends && gone.has(m.extends)) || reads(s).some((r) => gone.has(r)))) { gone.add(m.id); changed = true; }
}
for (const { p, m } of models) if (gone.has(m.id)) fs.rmSync(p);
// GiveWell's shared inputs: only rows something left in the sandbox reads.
const readers = [...models.filter(({ m }) => !gone.has(m.id)).map(({ s }) => s),
  ...walk(path.join(dest, ".claude/skills")).map((p) => fs.readFileSync(p, "utf8")),
  ...walk(path.join(dest, "assumptions")).map((p) => fs.readFileSync(p, "utf8"))].join("\n");
const used = new Set([...readers.matchAll(/@(givewell[a-z_]*)\.([a-z0-9_]+)/g)].map((x) => `${x[1]}.${x[2]}`));
let dropped = 0;
for (const p of walk(path.join(dest, "facts")).filter((p) => path.basename(p).startsWith("givewell"))) {
  const f = JSON.parse(fs.readFileSync(p, "utf8"));
  const rows = f.rows.filter((r) => used.has(`${f.id}.${r.id}`));
  dropped += f.rows.length - rows.length;
  if (!rows.length) { fs.rmSync(p); continue; }
  fs.writeFileSync(p, JSON.stringify({ ...f, rows }, null, 1) + "\n");
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
console.log(`removed ${gone.size} models: ${[...gone].sort().join(", ")}; ${dropped} GiveWell fact rows nothing left reads`);
JS
echo "sandbox at $dest without: $*"
