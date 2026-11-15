// Re-stamps audit receipts after a wording-only change to models' summaries (15 November 2026: peer
// comparisons removed from summaries). For each model whose latest audit round (audits/<id>/audit-r<n>.md)
// carries the fingerprint of the model as it is at <base>, and whose content differs from <base> only in its
// `summary`, every occurrence of that Model-sha in the round becomes the current one and one note line is
// appended. Anything else (other fields changed, an audit on neither version) is listed, not touched.
//   npx tsx scripts/restamp-wording.ts [--base main] [--note "..."] [--dry]
// Safe to re-run, e.g. after merging other branches: a receipt already on the current content is skipped.
import { execFileSync } from "node:child_process";
import { appendFileSync, existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { contentSha } from "./audit-receipt";

const root = join(import.meta.dirname, "..");
const args = process.argv.slice(2);
const flag = (name: string, fallback: string) => {
  const i = args.indexOf(name);
  return i === -1 ? fallback : args[i + 1];
};
const base = flag("--base", "main");
const note = flag("--note", "Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.");
const dry = args.includes("--dry");

const walk = (d: string): string[] => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : f.endsWith(".json") ? [p] : [];
});
const withoutSummary = (m: Record<string, unknown>) => contentSha({ ...m, summary: undefined });

let stamped = 0;
for (const file of walk(join(root, "models"))) {
  const model = JSON.parse(readFileSync(file, "utf8")) as Record<string, unknown>;
  const id = model.id as string;
  const dir = join(root, "audits", id);
  if (!existsSync(dir)) continue;
  const rounds = readdirSync(dir).map((f) => /^audit-r(\d+)\.md$/.exec(f)).filter((x) => x !== null).sort((a, b) => Number(b![1]) - Number(a![1]));
  if (!rounds.length) continue;
  const roundFile = join(dir, rounds[0]![0]);
  const text = readFileSync(roundFile, "utf8");
  const shas = [...text.matchAll(/Model-sha:\s*([0-9a-f]{64})/g)].map((x) => x[1]);
  if (!shas.length) continue;
  const now = contentSha(model);
  if (shas.every((s) => s === now)) continue;
  let old: Record<string, unknown>;
  try {
    old = JSON.parse(execFileSync("git", ["show", `${base}:${relative(root, file)}`], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 1 << 28 }));
  } catch {
    console.log(`skip ${id}: not in ${base}`);
    continue;
  }
  // The fingerprint to replace: the base's, or, once this script has stamped the round (its note is there), the
  // receipt's own (a further wording edit since).
  const then = shas.includes(contentSha(old)) ? contentSha(old) : text.includes(note) ? shas[0] : contentSha(old);
  if (withoutSummary(old) !== withoutSummary(model)) { console.log(`skip ${id}: more than the summary changed since ${base} (needs a verification round)`); continue; }
  if (!shas.includes(then)) { console.log(`skip ${id}: ${relative(root, roundFile)} isn't on ${base}'s content`); continue; }
  console.log(`${dry ? "would re-stamp" : "re-stamped"} ${relative(root, roundFile)}`);
  stamped++;
  if (dry) continue;
  writeFileSync(roundFile, text.split(then).join(now));
  if (!text.includes(note)) appendFileSync(roundFile, `${text.endsWith("\n") ? "" : "\n"}\n${note}\n`);
}
console.log(`${stamped} receipt(s) ${dry ? "to re-stamp" : "re-stamped"}`);
