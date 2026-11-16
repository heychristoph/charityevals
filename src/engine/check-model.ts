// The per-model half of scripts/check.ts, importable (scripts/preflight.ts runs it on the models it is
// given): `expected` values reproduce, the estimate's date, no `kind: "template"` on a charity's model,
// charityevals' own models free of high lint findings, a write-up for a charity's main model and an
// exchange rate for every ranked unit.
import { comparable, compute, modelsOf, type Library, type ResolvedModel } from "./model";
import { primaryModel } from "./ranking";
import { lintModel } from "./lint";

export const EXPECTED_TOLERANCE = 1e-6;

export type ModelCheck = { errors: string[]; matched: number };

/** `hasWriteup(id)`: whether writeups/<id>.md exists (the caller reads the disk). */
export function checkModel(lib: Library, m: ResolvedModel, hasWriteup: (id: string) => boolean, av: Record<string, number>): ModelCheck {
  const errors: string[] = [];
  // `expected` values are the source's own figures, so they're checked in the evaluator view.
  const evalVals = compute(lib, m, av, {}, "evaluator");
  let matched = 0;
  for (const r of m.rows) {
    if (r.expected === undefined) continue;
    const got = evalVals[r.id];
    // Relative, with a floor so a sheet's 0 matches our 3e-11 from subtracting equal totals.
    if (!(Math.abs(got - r.expected) <= Math.max(EXPECTED_TOLERANCE * Math.abs(r.expected), 1e-9))) errors.push(`${m.id}.${r.id}: expected ${r.expected}, got ${got}`);
    else matched++;
  }
  if (!m.output) return { errors, matched };
  // Every estimate says when it was made: our view discounts it by its age ($estimate_age_discount).
  if (m.kind !== "template" && !m.source?.published) errors.push(`${m.id}: no source.published, the date the estimate was made (our view discounts it by its age)`);
  // A build copied from a template must say it's a charity's model: a template is skipped by the lint below.
  if (m.kind === "template" && m.charity) errors.push(`${m.id}: kind "template" on a charity's model (copied from a template): set "kind": "charity"`);
  // charityevals' own models (build-cea) must follow their template and source every number.
  if (m.owner === "charityevals" && m.kind !== "template")
    for (const f of lintModel(lib, m)) if (f.severity === "high") errors.push(`${m.id}${f.row ? `.${f.row}` : ""}: ${f.message} (npx tsx scripts/audit-model.ts ${m.id})`);
  // Each charity's main page carries a write-up: its main model's, or the one filed under its first
  // model (a hand-written evaluation outlives a newer sheet becoming the main model).
  const has = (id?: string) => !!id && hasWriteup(id);
  if (m.kind === "charity" && primaryModel(lib, m.charity)?.id === m.id && !has(m.id) && !has(modelsOf(lib, m.charity)[0]?.id))
    errors.push(`${m.id}: missing write-up writeups/${m.id}.md`);
  // Every charity is ranked: a new unit needs an exchange rate (a shared assumption) in assumptions/default.json.
  if (!comparable(lib, m) && m.kind === "charity") errors.push(`${m.id}: unit ${m.output.unit} has no exchange rate (to_common), so the charity can't be ranked`);
  return { errors, matched };
}
