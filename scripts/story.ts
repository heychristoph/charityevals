// What a model's story (docs/story.md) is written from, and whether it holds.
//   npx tsx scripts/story.ts <id>            the model's main path, its places and the numbers that move it most
//   npx tsx scripts/story.ts <id> --check    the story's chain at every value set npm run check uses
//   npx tsx scripts/story.ts <id> --set <story.json>   write the story into the model's file (one line,
//                                            before "rows"; the rest of the file untouched), then check it
//   npx tsx scripts/story.ts --missing       models (not variants) without a story
//   npx tsx scripts/story.ts --charity <id> [--sentence "<text>"]   a charity of several programmes: each
//                                            programme's share, steps and numbers; with --sentence, write the
//                                            charity's sentence into charities/<id>.json, then check and fill it
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { assumptionValues, compute, headline, headlineExprOf } from "../src/engine/model";
import { formulaText } from "../src/engine/derive";
import { childrenOf, lookupFor, rootOf, type TreeNode } from "../src/engine/tree";
import { uncertainty } from "../src/engine/uncertainty";
import { declaredLocations, locationsOf } from "../src/engine/ranking";
import { charityStoryNumbers, charityStoryValue, checkCharityStory, checkStory, placesMean, storyValue, storyValueSets } from "../src/engine/story";
import { rankingPlan } from "../src/engine/ranking";
import { libraryOf, readTree, root } from "./lib/library";

const tree = readTree();
const [id, flag, arg] = process.argv.slice(2);
if (flag === "--set") {
  const path = join(root, tree.paths.get(id) ?? "");
  if (!tree.paths.get(id)) throw new Error(`no model ${id}`);
  const story = JSON.stringify(JSON.parse(readFileSync(arg, "utf8")));
  const text = readFileSync(path, "utf8");
  const line = /^(\s*)"story": \{.*\},?\n/m;
  const next = line.test(text)
    ? text.replace(line, (_, pad) => `${pad}"story": ${story},\n`)
    : text.replace(/^(\s*)"rows": \[/m, (all, pad) => `${pad}"story": ${story},\n${all}`);
  if (next === text && !line.test(text)) throw new Error(`${path}: no "rows" line to put the story before`);
  writeFileSync(path, next);
  JSON.parse(next);
  (tree.models.find((m) => m.id === id) as Record<string, unknown>).story = JSON.parse(story);
  console.log(`wrote the story into ${tree.paths.get(id)}`);
}
if (id === "--charity" && process.argv[4] === "--sentence") {
  const path = join(root, "charities", `${flag}.json`);
  const text = readFileSync(path, "utf8");
  const line = /^(\s*)"story": ".*",?\n/m;
  const value = JSON.stringify(arg === undefined ? process.argv[5] : process.argv[5]);
  const next = line.test(text)
    ? text.replace(line, (_, pad) => `${pad}"story": ${value},\n`)
    : text.replace(/^(\s*)"name": .*\n/m, (all, pad) => `${all}${pad}"story": ${value},\n`);
  JSON.parse(next);
  writeFileSync(path, next);
  (tree.charities.find((c) => (c as { id: string }).id === flag) as Record<string, unknown>).story = JSON.parse(value);
  console.log(`wrote the sentence into charities/${flag}.json`);
}
const lib = libraryOf(tree);
const av = assumptionValues(lib.assumptions);

if (id === "--charity") {
  const c = lib.charities.get(flag);
  if (!c) throw new Error(`no charity ${flag}`);
  const plans = rankingPlan(lib, flag).filter((e) => e.parts.length > 1 && e.parts.every((p) => p.weight! > 0));
  if (c.story) {
    const errors = [...new Set(storyValueSets(lib).flatMap((set) => checkCharityStory(lib, flag, set)))];
    const plan = plans.find((e) => charityStoryNumbers(c.story!).every((n) => e.parts.some((p) => p.program === n.program)));
    if (plan) {
      const total = plan.parts.reduce((s, p) => s + p.weight!, 0);
      const filled = c.story.replace(/\{([a-z0-9-]+):\s*([^}|]+?)\s*(?:\|\s*([^}]+?)\s*)?\}/g, (_, prog: string, expr: string) => {
        const part = plan.parts.find((p) => p.program === prog)!;
        const w = placesMean(lib, part.model, av);
        return String(+charityStoryValue(expr, w.values, w.result, part.weight! / total).toPrecision(3));
      });
      console.log(`sentence at the defaults: ${filled}`);
    }
    console.log(errors.length ? errors.join("\n") : `✓ ${flag}: sentence holds`);
    if (process.argv[4] === "--sentence") process.exit(errors.length ? 1 : 0);
  }
  for (const plan of plans) {
    const total = plan.parts.reduce((s, p) => s + p.weight!, 0);
    console.log(`\n${c.name} — ${plan.owner}'s split`);
    for (const p of plan.parts) {
      const share = p.weight! / total;
      const w = placesMean(lib, p.model, av);
      console.log(`\n[${p.program}] ${c.lines?.find((l) => l.id === p.program)?.label} — share ${(share * 100).toPrecision(3)}% — model ${p.model.id}`);
      for (const st of p.model.story?.steps ?? []) {
        const src = (st.total ?? st.op ?? "").replace(/^[^{]*\{|\}\s*$/g, "").split("|")[0];
        const v = storyValue(st.total ? st.total.split("|")[0] : src, w.values, w.result);
        console.log(`   ${st.total ? "=" : (st.op ?? "").trim()[0]} ${st.total ? st.total : st.op}   → ${+v.toPrecision(3)} per $1,000 (× share: ${+(v * share).toPrecision(3)})   ${st.text}`);
      }
      if (p.model.story) console.log(`   sentence: ${p.model.story.sentence}`);
    }
  }
  process.exit(0);
}

if (id === "--missing") {
  const ids = [...lib.models.values()].filter((m) => m.kind !== "variant" && !m.story).map((m) => m.id);
  console.log(ids.join("\n"));
  console.error(`${ids.length} without a story`);
  process.exit(0);
}
const m = lib.models.get(id);
if (!m) throw new Error(`no model ${id}`);

if (flag === "--check" || flag === "--set") {
  const errors = [...new Set(storyValueSets(lib).flatMap((set) => checkStory(lib, m, set)))];
  const variants = [...lib.models.values()].filter((v) => v.kind === "variant" && v.id !== m.id && !!m.story && v.story === m.story);
  for (const v of variants) for (const set of storyValueSets(lib)) errors.push(...checkStory(lib, v, set));
  console.log(errors.length ? [...new Set(errors)].join("\n") : `✓ ${id}: story holds${variants.length ? ` (and ${variants.length} variants)` : ""}`);
  process.exit(errors.length ? 1 : 0);
}

const values = compute(lib, m, av);
const result = headline(lib, m, av);
const fmt = (x: number) => (!Number.isFinite(x) ? String(x) : Math.abs(x) >= 1e5 || (Math.abs(x) < 1e-3 && x !== 0) ? x.toExponential(3) : +x.toPrecision(4) + "");
console.log(`${m.id} — ${m.name} (${m.owner}, ${m.cause}${m.bulk ? ", bulk" : ""})`);
console.log(`charity: ${m.charity}; output: ${m.output?.row} in ${m.output?.unit}; result = ${fmt(result)} years of healthy life per $1,000`);
if (m.summary) console.log(`summary: ${m.summary}`);
const parts = declaredLocations(lib.charities.get(m.charity), locationsOf(lib, m))?.filter((p) => p.weight > 0);
if (parts && parts.length > 1) console.log(`places: ${parts.map((p) => `${p.label} ${p.weight} [${p.models.map((x) => x.id).join(", ")}]`).join("; ")}`);
const variants = [...lib.models.values()].filter((v) => v.kind === "variant" && v.id !== m.id && tree.models.some((f) => f.id === v.id && f.extends === m.id));
if (variants.length) console.log(`variants (inherit the story): ${variants.map((v) => v.id).join(", ")}`);

// The path to the result: every row the headline reads, with its share of the result's leverage.
console.log(`\nPATH (row id = value  [elasticity]  label  := formula)`);
const look = lookupFor(lib, m, values, av, "charityevals");
const toCommon = m.output ? headlineExprOf(lib, m, { type: "ref", scope: "row", name: m.output.row }) : undefined;
const seen = new Set<string>();
let printed = 0;
const LIMIT = Number(process.env.STORY_LINES ?? 90);
const walk = (n: TreeNode, depth: number) => {
  if (printed >= LIMIT || depth > 9) return;
  const e = n.e === undefined ? "" : `[${fmt(n.e)}]`;
  const pad = "  ".repeat(depth);
  if (n.rowId) {
    const r = m.byId.get(n.rowId)!;
    const again = seen.has(n.rowId);
    seen.add(n.rowId);
    const f = r.node ? formulaText(r.node) : r.range ? `input, range ${fmt(r.range.low)}–${fmt(r.range.high)}` : "input";
    console.log(`${pad}${n.op ?? "="} ${n.rowId} = ${fmt(values[n.rowId])} ${e} ${r.label}${again ? " (above)" : `  := ${f.length > 160 ? f.slice(0, 160) + "…" : f}`}`);
    printed++;
    if (again) return;
  } else if (n.type === "assumption" || n.type === "fact" || n.type === "model") {
    console.log(`${pad}${n.op ?? "="} ${n.type === "assumption" ? "$" : n.type === "fact" ? "@" : "#"}${n.refId} = ${fmt(n.value ?? NaN)} ${e}`);
    printed++;
    return;
  } else if (n.type === "const") {
    console.log(`${pad}${n.op ?? "="} ${fmt(n.value ?? NaN)}${n.label ? ` (${n.label})` : ""}`);
    printed++;
    return;
  } else if (depth === 0) {
    console.log(`= ${fmt(n.value ?? NaN)} ${n.label ?? ""}`);
    printed++;
  }
  // Parts that barely move the result (under 2% leverage) are left out; they're in the file.
  for (const c of childrenOf(m, n, look)) if (c.e === undefined || Math.abs(c.e) >= 0.02 || c.type === "row") walk(c, depth + 1);
};
walk(rootOf(m, look, toCommon), 0);
if (printed >= LIMIT) console.log(`… (cut at ${LIMIT} lines)`);

const u = uncertainty(lib, m, values, av, "charityevals");
console.log(`\nDRIVERS (share of the spread; questions come from these)`);
for (const d of [...u.drivers].sort((a, b) => b.share - a.share).slice(0, 10))
  console.log(`  ${(d.share * 100).toFixed(0)}%  ${d.scope}:${d.id}  ${d.label}`);
