#!/usr/bin/env bash
# Makes a blind copy of the repo for a build-cea evaluation run (docs/eval-skills.md).
#   evaluation/make-sandbox.sh <dest> <charity-id> [<charity-id> ...]
# The copy has no git history, no bulk imports (models/grants), no GiveWell shared-input facts
# (they hold charity-specific numbers), and none of the named charities' models, variants or
# write-ups; their charity records keep only name, cause and website. node_modules is a symlink.
set -euo pipefail
dest=$1; shift
src=$(cd "$(dirname "$0")/.." && pwd)
mkdir -p "$dest"
rsync -a --exclude .git --exclude node_modules --exclude dist --exclude .astro --exclude 'models/grants' \
  --exclude generated --exclude inventory --exclude 'evaluation/blind-runs' --exclude 'evaluation/dev-runs' --exclude docs/eval-skills.md \
  --exclude '.claude/worktrees' --exclude 'facts/givewell*.json' --exclude 'scripts/convert-*' --exclude 'scripts/import-*' --exclude scripts/givewell-manifest.py --exclude scripts/collect-resources.py "$src/" "$dest/"
ln -sfn "$src/node_modules" "$dest/node_modules"
for id in "$@"; do
  rm -f "$dest"/models/*/"$id".json "$dest"/models/*/"$id"-*.json "$dest"/writeups/*"$id"*.md
  node -e '
    const fs = require("fs"); const p = process.argv[1];
    if (fs.existsSync(p)) { const c = JSON.parse(fs.readFileSync(p, "utf8"));
      fs.writeFileSync(p, JSON.stringify({ id: c.id, name: c.name, cause: c.cause, website: c.website }, null, 2) + "\n"); }
  ' "$dest/charities/$id.json"
done
echo "sandbox at $dest without: $*"
