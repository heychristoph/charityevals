// Test helpers for the build-cea templates (src/engine/templates.test.ts, lint.test.ts): the skeletons,
// filled in the way a builder would, inside a library of the repo's facts, assumptions and the models
// they read live (`#id`, the moved-money destinations), so the whole library needn't be built.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { buildLibrary } from "./model";

export const root = join(import.meta.dirname, "../..");
const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));
const walk = (d: string): string[] =>
  readdirSync(d).flatMap((f) => {
    const p = join(d, f);
    return statSync(p).isDirectory() ? walk(p) : f.endsWith(".json") ? [p] : [];
  });

export const templateDir = join(root, ".claude/skills/build-cea/templates");
/** Every skeleton file, by name (a family can have more than one: policy-research-meta-climate). */
export const templateFiles = (): Record<string, Record<string, unknown>> =>
  Object.fromEntries(readdirSync(templateDir).filter((f) => f.endsWith(".json")).map((f) => [f.replace(/\.json$/, ""), read(join(templateDir, f))]));

const facts = walk(join(root, "facts")).map(read);
const assumptions = read(join(root, "assumptions/default.json"));
const owners = read(join(root, "owners.json"));
const charities = [...walk(join(root, "charities")).map(read), { id: "template-charity", name: "Template", cause: "global-health" }];
const repoModels: Record<string, unknown>[] = walk(join(root, "models")).map(read);
const byId = new Map(repoModels.map((m) => [m.id as string, m]));

/** The models a set of models reads live or extends, transitively, plus the site's benchmark. */
function closure(raws: Record<string, unknown>[]): Record<string, unknown>[] {
  const out = new Map<string, Record<string, unknown>>();
  const visit = (m: Record<string, unknown>) => {
    const text = ((m.rows ?? []) as unknown[]).map((r) => (typeof r === "string" ? r : ((r as { formula?: string }).formula ?? ""))).join(" ");
    const ids = [...text.matchAll(/#([a-z0-9-]+)(?::([a-z0-9-]+))?/g)].flatMap(([, a, b]) => (b ? repoModels.filter((x) => x.charity === b && x.owner === a).map((x) => x.id as string) : [a]));
    if (typeof m.extends === "string") ids.push(m.extends);
    for (const id of ids) {
      const t = byId.get(id);
      if (t && !out.has(id)) { out.set(id, t); visit(t); }
    }
  };
  raws.forEach(visit);
  visit({ rows: [`#${assumptions.common.benchmark}`] });
  return [...out.values()];
}

export function load(...raws: Record<string, unknown>[]) {
  const lib = buildLibrary([...closure(raws), ...raws], assumptions, facts, charities, owners);
  return { lib, models: raws.map((r) => lib.models.get(r.id as string)!) };
}

/** A template with its placeholders filled the way a builder would: explainers rewritten, a charity
 * model with a summary. The numbers stay the skeleton's examples. */
export function filled(raw: Record<string, unknown>): Record<string, unknown> {
  const rows = (raw.rows as Record<string, unknown>[]).map((r) => ({
    ...r,
    explainer: typeof r.explainer === "string" ? r.explainer.replace(/TEMPLATE: ?/g, "") + " Filled in for the test with a rationale long enough to pass." : r.explainer,
  }));
  return { ...raw, kind: "charity", summary: "A test charity. It does one thing in one place in 2025 and the model says how much good a dollar does, with the biggest uncertainty named.", rows };
}
