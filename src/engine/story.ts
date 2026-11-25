// A model's story (`story` in its file) never contradicts its model: every number in it is read from
// the computed rows, and the steps of "How it's worked out" must chain. Each step times (or plus) the
// factors under it gives the next step, and the last step is the model's own result. Checked for every
// location the charity funds and for the whole charity, at the default values and at others
// (scripts/check.ts, story.test.ts).
import { evaluate, parse, type Node } from "./expr";
import { assumptionValues, compute, headline, pickValue, type Library, type ResolvedModel } from "./model";
import { declaredLocations, locationsOf, primaryModel, rankingPlan } from "./ranking";

const nodes = new Map<string, Node>();
const nodeOf = (src: string) => {
  let n = nodes.get(src);
  if (!n) nodes.set(src, (n = parse(src)));
  return n;
};

/** An expression's value; `result` reads the bottom line (years of healthy life per $1,000), every
 * other name a row of the model. */
export function storyValue(src: string, values: Record<string, number>, result: number): number {
  return evaluate(nodeOf(src), (scope, name) => (scope === "row" ? (name === "result" ? result : values[name] ?? NaN) : NaN));
}

type Story = NonNullable<ResolvedModel["story"]>;
const OP = /^\s*([×÷+−-])\s*\{([^}]+)\}\s*$/;
/** Equal to rounding: the steps are read from the same computed numbers, so only float error remains. */
const same = (a: number, b: number) => Math.abs(a - b) <= 1e-6 * Math.max(Math.abs(a), Math.abs(b)) + 1e-12;
const numbers = (t: string) => [...t.matchAll(/\{([^}]+)\}/g)].map((m) => m[1].split("|")[0].trim());

/** What's wrong with a story's chain at these numbers, one line each ("" where it holds). */
export function chainErrors(story: Story, values: Record<string, number>, result: number, where: string): string[] {
  const errors: string[] = [];
  const val = (src: string) => storyValue(src.split("|")[0].trim(), values, result);
  for (const src of [...numbers(story.sentence), ...story.steps.flatMap((s) => numbers(s.text))])
    if (!Number.isFinite(val(src))) errors.push(`${where}: {${src}} isn't a number`);
  const steps = story.steps;
  if (steps[0]?.total === undefined) errors.push(`${where}: the first step must be a total (the money given)`);
  if (steps[steps.length - 1]?.total === undefined) errors.push(`${where}: the last step must be a total (the result)`);
  let acc: number | undefined;
  steps.forEach((s, i) => {
    if (s.total !== undefined) {
      const v = val(s.total);
      if (!Number.isFinite(v)) errors.push(`${where}: step ${i + 1} (${s.text}) isn't a number`);
      else if (acc !== undefined && !same(acc, v)) errors.push(`${where}: step ${i + 1} (${s.text}) shows ${v.toPrecision(6)}, but the steps above it give ${acc.toPrecision(6)}`);
      acc = v;
      return;
    }
    const m = (s.op ?? "").match(OP);
    if (!m) return void errors.push(`${where}: step ${i + 1} must be one operator and one {number} ("× {a / b|%}"), not "${s.op}"`);
    const v = val(m[2]);
    if (!Number.isFinite(v) || acc === undefined) return void errors.push(`${where}: step ${i + 1} (${s.text}) can't be applied`);
    acc = m[1] === "×" ? acc * v : m[1] === "÷" ? acc / v : m[1] === "+" ? acc + v : acc - v;
  });
  const last = steps[steps.length - 1];
  if (last?.total !== undefined) {
    const v = val(last.total);
    if (Number.isFinite(v) && !same(v, result)) errors.push(`${where}: the last step shows ${v.toPrecision(6)}, but the model's result is ${result.toPrecision(6)}`);
  }
  return errors;
}

/** Each location a model's money goes to, with its share and its numbers. */
function placeFigures(lib: Library, m: ResolvedModel, av: Record<string, number>) {
  const parts = declaredLocations(lib.charities.get(m.charity), locationsOf(lib, m))?.filter((p) => p.weight > 0);
  const total = parts?.reduce((s, p) => s + p.weight, 0) ?? 0;
  const places = parts?.length
    ? parts.flatMap((p) => p.models.map((model) => ({ model, share: p.weight / total / p.models.length })))
    : [{ model: m, share: 1 }];
  return places.map((p) => ({ ...p, values: compute(lib, p.model, av), result: headline(lib, p.model, av) }));
}

/** A model's rows and result across its locations, funding-weighted, as its page shows them (src/lib/whole.ts). */
export function placesMean(lib: Library, m: ResolvedModel, av: Record<string, number>): { values: Record<string, number>; result: number } {
  const figures = placeFigures(lib, m, av);
  const mean = (f: (p: (typeof figures)[number]) => number) => figures.reduce((s, p) => s + p.share * f(p), 0);
  const values: Record<string, number> = {};
  for (const r of m.rows) if (figures.every((p) => Number.isFinite(p.values[r.id]))) values[r.id] = mean((p) => p.values[r.id]);
  return { values, result: mean((p) => p.result) };
}

/** The numbers of a charity's sentence (`story` in its file): `{<line id>: <expression>|<format>}`. */
export function charityStoryNumbers(text: string): { program: string; expr: string; fmt?: string }[] {
  return [...text.matchAll(/\{([a-z0-9-]+):\s*([^}|]+?)\s*(?:\|\s*([^}]+?)\s*)?\}/g)].map((x) => ({ program: x[1], expr: x[2], fmt: x[3] }));
}

/** A charity sentence's number: the expression over its programme's rows across its locations, with
 * `share` its programme's share of the money. */
export function charityStoryValue(expr: string, values: Record<string, number>, result: number, share: number): number {
  return storyValue(expr, { ...values, share }, result);
}

/** What's wrong with a charity's sentence at these values: every number names a programme of some
 * evaluator's split and is a finite number there. */
export function checkCharityStory(lib: Library, charity: string, av: Record<string, number>): string[] {
  const c = lib.charities.get(charity);
  if (!c?.story) return [];
  const nums = charityStoryNumbers(c.story);
  if (!nums.length) return [`${charity}: its story has no live number ({<line id>: <expression>})`];
  // The split its main page shows (the first evaluator's, as primaryModel picks), else any with money.
  const plans = rankingPlan(lib, charity).filter((e) => e.parts.length > 1 && e.parts.every((p) => p.weight! > 0));
  const main = primaryModel(lib, charity)?.owner;
  const shown = plans.find((e) => e.owner === main) ?? plans[0];
  const plan = shown && nums.every((n) => shown.parts.some((p) => p.program === n.program)) ? shown : undefined;
  if (!plan) return [`${charity}: its story names programmes (${[...new Set(nums.map((n) => n.program))].join(", ")}) that ${shown ? `${shown.owner}'s split on its page (${shown.parts.map((p) => p.program).join(", ")}) doesn't all have` : "no evaluator's split has with money"}`];
  const total = plan.parts.reduce((s, p) => s + p.weight!, 0);
  const errors: string[] = [];
  for (const n of nums) {
    const part = plan.parts.find((p) => p.program === n.program)!;
    const { values, result } = placesMean(lib, part.model, av);
    const v = charityStoryValue(n.expr, values, result, part.weight! / total);
    if (!Number.isFinite(v)) errors.push(`${charity}: {${n.program}: ${n.expr}} isn't a number`);
  }
  return errors;
}

/** The story's chain checked for each location the charity funds and for the whole charity (the
 * funding-weighted mean of their numbers, as the page shows it: src/lib/whole.ts). */
export function checkStory(lib: Library, m: ResolvedModel, av: Record<string, number>): string[] {
  const story = m.story;
  if (!story) return [];
  const figures = placeFigures(lib, m, av);
  const errors = figures.flatMap((p) => chainErrors(story, p.values, p.result, `${m.id} (${p.model.id})`));
  if (figures.length > 1) {
    const mean = (f: (p: (typeof figures)[number]) => number) => figures.reduce((s, p) => s + p.share * f(p), 0);
    const values: Record<string, number> = {};
    for (const r of m.rows) if (figures.every((p) => Number.isFinite(p.values[r.id]))) values[r.id] = mean((p) => p.values[r.id]);
    errors.push(...chainErrors(story, values, mean((p) => p.result), `${m.id} (whole charity)`));
  }
  return [...new Set(errors)];
}

/** Values to check a story at: the defaults, every value at its low end, every value at its high end,
 * and a few draws in between (seeded, so a check is the same every run). */
export function storyValueSets(lib: Library, draws = 4): Record<string, number>[] {
  const rows = lib.assumptions.rows.filter((r) => typeof r.value === "object" && r.value.low !== undefined);
  let seed = 1;
  const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const at = (pick: (r: (typeof rows)[number]) => number) => assumptionValues(lib.assumptions, Object.fromEntries(rows.map((r) => [r.id, pick(r)])));
  return [
    assumptionValues(lib.assumptions),
    at((r) => pickValue(r.value, "low")),
    at((r) => pickValue(r.value, "high")),
    ...Array.from({ length: draws }, () => at((r) => { const lo = pickValue(r.value, "low"), hi = pickValue(r.value, "high"); return lo + rand() * (hi - lo); })),
  ];
}
