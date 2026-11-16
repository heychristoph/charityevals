// The build-cea skeletons on disk (.claude/skills/build-cea/templates/<family>.json, written by
// scripts/gen-templates.py), for the checks that need their row ids: a row the family's skeleton has is
// kept even where a model doesn't use it (lint's unused-row finding skips it). Node only.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

export const TEMPLATE_DIR = join(import.meta.dirname, "../../.claude/skills/build-cea/templates");

/** Row ids of every skeleton, by template family (a family with two skeletons, policy-research-meta and
 * its climate one, gets both). Empty when the skeletons aren't there. */
export function templateRowIds(dir = TEMPLATE_DIR): Map<string, Set<string>> {
  const out = new Map<string, Set<string>>();
  if (!existsSync(dir)) return out;
  for (const f of readdirSync(dir).filter((x) => x.endsWith(".json"))) {
    const raw = JSON.parse(readFileSync(join(dir, f), "utf8")) as { template?: string; rows?: { id: string }[] };
    if (!raw.template) continue;
    const ids = out.get(raw.template) ?? new Set<string>();
    for (const r of raw.rows ?? []) ids.add(r.id);
    out.set(raw.template, ids);
  }
  return out;
}
