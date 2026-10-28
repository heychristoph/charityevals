#!/usr/bin/env bash
# Makes a blind copy of the repo for a build-cea evaluation run (docs/eval-skills.md).
#   evaluation/make-sandbox.sh <dest> <charity-id> [<charity-id> ...]
# The copy has no git history, no bulk imports (models/grants), no GiveWell shared-input facts
# (they hold charity-specific numbers), and none of the named charities' models: every model whose
# `charity` is one of them, every model that extends one of those (variants), and their write-ups,
# plus any write-up whose file name mentions the charity. Their charity records keep only name,
# cause and website. node_modules is a symlink.
set -euo pipefail
dest=$1; shift
src=$(cd "$(dirname "$0")/.." && pwd)
mkdir -p "$dest"
rsync -a --exclude .git --exclude node_modules --exclude dist --exclude .astro --exclude 'models/grants' \
  --exclude generated --exclude inventory --exclude 'evaluation/blind-runs' --exclude 'evaluation/dev-runs' --exclude docs/eval-skills.md \
  --exclude '.claude/worktrees' --exclude 'facts/givewell*.json' --exclude 'scripts/convert-*' --exclude 'scripts/import-*' --exclude scripts/givewell-manifest.py --exclude scripts/collect-resources.py "$src/" "$dest/"
ln -sfn "$src/node_modules" "$dest/node_modules"
node - "$dest" "$@" <<'JS'
const fs = require("fs"), path = require("path");
const [dest, ...ids] = process.argv.slice(2);
const walk = (d) => fs.readdirSync(d).flatMap((f) => {
  const p = path.join(d, f);
  return fs.statSync(p).isDirectory() ? walk(p) : f.endsWith(".json") ? [p] : [];
});
const models = walk(path.join(dest, "models")).map((p) => ({ p, m: JSON.parse(fs.readFileSync(p, "utf8")) }));
// A model goes if it is about an excluded charity, or extends a model that goes.
const gone = new Set();
let changed = true;
while (changed) {
  changed = false;
  for (const { m } of models)
    if (!gone.has(m.id) && (ids.includes(m.charity) || (m.extends && gone.has(m.extends)))) { gone.add(m.id); changed = true; }
}
for (const { p, m } of models) if (gone.has(m.id)) fs.rmSync(p);
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
console.log(`removed ${gone.size} models: ${[...gone].sort().join(", ")}`);
JS
echo "sandbox at $dest without: $*"
