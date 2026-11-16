// Mechanical re-stamp of audit receipts: for a change that keeps a model's values (wording, a moved row, a
// tool field) or applies a site-wide rule, the latest round (audits/<id>/audit-r<n>.md, a pass) gets the
// model's current fingerprint and one note line, for many models in one command.
//   npx tsx scripts/restamp.ts <model-id…> --note "<why>" [--rule <rule-id>] [--tolerance 0.01] [--base <rev>] [--dry-run]
// Before stamping it computes each model's headline (our view, defaults) on the audited version and now,
// and refuses a model whose headline moved by more than the tolerance (relative; default 1%) unless --rule
// names the rule that moved it (recorded in the note; scripts/rule-change.ts does this for a whole rule).
// The audited version: the newest commit whose model file has the receipt's fingerprint, or --base. The
// comparison runs on today's engine, so a change to src/engine/ goes through rule-change.ts, which measures
// before and after the change. Refused too: a latest round that isn't a pass, a model with no receipt.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { contentSha } from "./audit-receipt";
import { libraryOf, readTree, relativeMove, results, root, changedRows, type Result } from "./lib/library";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const today = (d = new Date()) => `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
export const fmt = (x: number) => (Number.isFinite(x) ? Number(x.toPrecision(4)).toString() : String(x));
export const pct = (before: number, after: number) => {
  const m = relativeMove(before, after);
  return !Number.isFinite(m) ? "moved across zero or from none" : m === 0 ? "unchanged" : `${after > before ? "+" : "−"}${(m * 100).toPrecision(2)}%`;
};

/** The latest audit round's file, or undefined. */
export function latestRound(id: string, base = root): string | undefined {
  const dir = join(base, "audits", id);
  if (!existsSync(dir)) return undefined;
  const r = readdirSync(dir).map((f) => /^audit-r(\d+)\.md$/.exec(f)).filter((x) => x !== null).sort((a, b) => Number(b![1]) - Number(a![1]))[0];
  return r ? join(dir, r[0]) : undefined;
}

export const receiptShas = (text: string) => [...text.matchAll(/Model-sha:\s*([0-9a-f]{64})/g)].map((m) => m[1]);
export const passes = (text: string) => /Verdict:[\s*_]*pass\b/i.test(text);

/** The round's text with every fingerprint replaced by `sha` and the note appended (once). */
export function stampText(text: string, sha: string, note: string): string {
  const out = text.replace(/(Model-sha:\s*)[0-9a-f]{64}/g, (_, p: string) => p + sha);
  return out.includes(note) ? out : `${out.replace(/\n*$/, "\n")}\n${note}\n`;
}

export type Measure = { before: number; after: number; rows: string[]; base: string };

/** The note line a re-stamp writes. */
export function noteLine(note: string, m: Measure, rule?: string): string {
  const moved = m.before === m.after || (Number.isNaN(m.before) && Number.isNaN(m.after)) ? "headline unchanged" : `headline ${fmt(m.before)} → ${fmt(m.after)} (${pct(m.before, m.after)})`;
  const rows = m.rows.length ? `, ${m.rows.length} row${m.rows.length === 1 ? "" : "s"} changed` : "";
  return `Re-stamped (${today()})${rule ? `, rule ${rule}` : ""}: ${note.replace(/\.$/, "")}. Mechanical: ${moved}${rows}, against ${m.base}.`;
}

/** Re-stamp a model's latest round with the fingerprint of `model` (its current content). */
export function stamp(model: Record<string, unknown>, note: string, m: Measure, opts: { rule?: string; dry?: boolean } = {}): string {
  const file = latestRound(model.id as string)!;
  const text = readFileSync(file, "utf8");
  const next = stampText(text, contentSha(model), noteLine(note, m, opts.rule));
  if (!opts.dry) writeFileSync(file, next);
  return `${opts.dry ? "would re-stamp" : "re-stamped"} ${file.slice(root.length + 1)}`;
}

const git = (...a: string[]) => execFileSync("git", a, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 1 << 28 });

/** The newest commit whose copy of the model has this fingerprint. */
function auditedRevision(path: string, sha: string): string | undefined {
  for (const c of git("log", "--format=%H", "-n", "400", "--", path).split("\n").filter(Boolean)) {
    try { if (contentSha(JSON.parse(git("show", `${c}:${path}`))) === sha) return c; } catch { /* not JSON there */ }
  }
  return undefined;
}

function main() {
  const args = process.argv.slice(2);
  const opt = (n: string) => { const i = args.indexOf(n); return i < 0 ? undefined : args.splice(i, 2)[1]; };
  const note = opt("--note"), rule = opt("--rule"), baseArg = opt("--base");
  const tolerance = Number(opt("--tolerance") ?? "0.01");
  const dry = args.includes("--dry-run");
  const ids = args.filter((a) => !a.startsWith("--"));
  if (!note || !ids.length) {
    console.error('usage: npx tsx scripts/restamp.ts <model-id…> --note "<why>" [--rule <rule-id>] [--tolerance 0.01] [--base <rev>] [--dry-run]');
    process.exit(2);
  }
  const now = readTree();
  const nowLib = libraryOf(now);
  const nowRes = results(nowLib, ids);
  const libs = new Map<string, Record<string, Result>>();
  const at = (rev: string) => {
    if (!libs.has(rev)) libs.set(rev, results(libraryOf(readTree(rev))));
    return libs.get(rev)!;
  };
  let refused = 0;
  for (const id of ids) {
    const model = now.models.find((x) => x.id === id);
    const file = latestRound(id);
    const text = file && readFileSync(file, "utf8");
    const no = (why: string) => { refused++; console.log(`refused ${id}: ${why}`); };
    if (!model) { no("no such model"); continue; }
    if (!text) { no("no audit receipt (audits/<id>/audit-r<n>.md): it needs an audit"); continue; }
    if (!passes(text)) { no(`${file!.slice(root.length + 1)} isn't a pass: it needs a verification round`); continue; }
    const shas = receiptShas(text);
    if (!shas.length) { no("the latest round has no Model-sha"); continue; }
    const sha = contentSha(model);
    if (shas.every((s) => s === sha)) { console.log(`skip ${id}: the receipt is on the current content`); continue; }
    const rev = baseArg ?? auditedRevision(now.paths.get(id)!, shas[0]);
    if (!rev) { no("its audited version isn't in the last 400 commits of its file: pass --base <rev> to compare with one"); continue; }
    const before = at(rev)[id];
    if (!before) { no(`not in ${rev}`); continue; }
    const after = nowRes[id];
    const move = relativeMove(before.headline, after.headline);
    const m: Measure = { before: before.headline, after: after.headline, rows: changedRows(before.rows, after.rows), base: rev.length === 40 ? rev.slice(0, 8) : rev };
    if (move > tolerance && !rule) {
      no(`headline ${fmt(m.before)} → ${fmt(m.after)} (${pct(m.before, m.after)}) since ${m.base}, beyond the tolerance ${tolerance * 100}%: a verification round, or --rule <rule-id> if a site-wide rule moved it`);
      continue;
    }
    console.log(`${stamp(model, note, m, { rule, dry })}\n  ${noteLine(note, m, rule)}`);
  }
  if (refused) {
    console.log(`${refused} model${refused === 1 ? "" : "s"} refused`);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) main();
