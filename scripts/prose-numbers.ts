// Typed numbers in prose that the model prints (docs/prose-numbers.md): write-ups and every model's text
// (summary, section and row explainers, range notes).
//   npx tsx scripts/prose-numbers.ts [ids…]            report: each candidate, its placeholder, whether it's safe
//   npx tsx scripts/prose-numbers.ts --apply [ids…]    replace the safe ones
//   flags: --json (report as JSON lines), --unsafe (report only what --apply leaves)
// Safe: an exact match to one figure as the page prints it (the headline in either view, the plausible
// range's ends together, a calculated row, in a row's own text only that row), not a source's own figure,
// not one end of a range or a case ("if…"), plus a write-up's figure spans and the headline typed with
// fewer digits after "about". Inputs, ambiguous and attributed numbers are reported, never replaced.
// A model's text is part of its audit fingerprint (scripts/audit-receipt.ts): --apply prints the
// scripts/restamp.ts command for the audited models it changed (no value moves).
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { applyCandidates, modelFile, ownRow, repoRoot, scanText, siteLibrary, writeupPath, type Candidate } from "../src/engine/prose-numbers";
import { textFields } from "../src/engine/prose";

const root = repoRoot();
const args = process.argv.slice(2);
const apply = args.includes("--apply"), json = args.includes("--json"), unsafeOnly = args.includes("--unsafe");
const only = new Set(args.filter((a) => !a.startsWith("--")));

const lib = siteLibrary();
const counts = { safe: 0, unsafe: 0, replaced: 0, files: 0 };
const skipped: string[] = [], audited: string[] = [];

function report(where: string, cs: Candidate[]) {
  for (const c of cs) {
    c.safe ? counts.safe++ : counts.unsafe++;
    if (unsafeOnly && c.safe) continue;
    if (json) console.log(JSON.stringify({ where, typed: c.typed, placeholder: c.placeholder, safe: c.safe, note: c.note, coarse: c.coarse, sentence: c.sentence.slice(0, 300) }));
    else console.log(`${c.safe ? "✓" : "·"} ${where}: ${c.typed.replace(/<[^>]+>/g, "")} → ${c.placeholder}${c.note ? ` (${c.note})` : ""}${c.coarse ? " (rounded)" : ""}\n    ${c.sentence.slice(0, 200)}`);
  }
}

for (const m of lib.models.values()) {
  if (only.size && !only.has(m.id)) continue;
  if (m.kind === "template" || !m.output) continue;
  // The model's own text, as its file has it.
  const file = modelFile(m.id);
  if (file) {
    const raw = JSON.parse(readFileSync(file, "utf8")) as Record<string, unknown>;
    // The file's own layout stays: each changed string is replaced where it's written.
    let src = readFileSync(file, "utf8"), replaced = 0;
    for (const f of textFields(raw as never)) {
      const s = f.get();
      if (!s) continue;
      const cs = scanText(lib, m, s, { row: ownRow(f.key) });
      report(`${m.id} ${f.key}`, cs);
      if (!apply) continue;
      // A model's text renders as plain text: a figure span stays a write-up's.
      const safe = cs.filter((c) => c.safe && !c.typed.startsWith("<"));
      const next = applyCandidates(s, safe);
      if (next === s) continue;
      // The text must be written once, as JSON.stringify writes it (the same text in two rows can stand for two rows' numbers).
      const n = src.split(JSON.stringify(s)).length - 1;
      if (n !== 1) { skipped.push(`${m.id} ${f.key}: ${n ? "the same text is in another field" : "not written as JSON.stringify writes it"}; left typed`); continue; }
      src = src.replace(JSON.stringify(s), () => JSON.stringify(next));
      f.set(next);
      replaced += safe.length;
    }
    if (replaced) {
      if (JSON.stringify(JSON.parse(src)) !== JSON.stringify(raw)) throw new Error(`${relative(root, file)}: the edit changed more than the text`);
      writeFileSync(file, src);
      counts.files++;
      counts.replaced += replaced;
      if (existsSync(join(root, "audits", m.id))) audited.push(m.id);
    }
  }
  const wp = writeupPath(m.id);
  if (existsSync(wp)) {
    const s = readFileSync(wp, "utf8");
    const cs = scanText(lib, m, s, { writeup: true });
    report(`writeups/${m.id}.md`, cs);
    if (apply) {
      const next = applyCandidates(s, cs);
      if (next !== s) { writeFileSync(wp, next); counts.files++; counts.replaced += cs.filter((c) => c.safe).length; }
    }
  }
}

console.log(`\n${counts.safe} safe, ${counts.unsafe} left typed${apply ? `; ${counts.replaced} replaced in ${counts.files} files` : ""}`);
if (skipped.length) console.log(`Left typed:\n${skipped.map((x) => `  ${x}`).join("\n")}`);
if (audited.length) console.log(`\nRe-stamp the audited models whose text changed:\n  npx tsx scripts/restamp.ts ${audited.join(" ")} --note "typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts)"`);
