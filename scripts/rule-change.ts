// A site-wide rule change in one command: apply it, see every model it moved, re-stamp the receipts it
// changed only a little, and list the rest for one scoped verification each.
//   npx tsx scripts/rule-change.ts <rule-id> --apply <script> [--note "<what the rule does>"] [--tolerance 0.01] [--level major] [--dry-run]
// <script> is the change itself (.ts runs with tsx, .py with python3, .sh with sh; RULE_ID in its env): it
// edits facts/, models/, assumptions/ or src/engine/. The working tree must be clean first, so what moves is
// the rule's. Then:
//   1. every model's headline (our view, defaults) and rows, before (in a separate process, so an engine
//      change counts) and after the script;
//   2. a before/after table of every model whose headline or rows changed, largest move first;
//   3. charityevals models whose audited content changed and whose headline moved by at most the tolerance
//      (relative, default 1%): receipts re-stamped (scripts/restamp.ts), the rule recorded in the note;
//   4. charityevals models that moved more: the verification list, one scoped (sonnet) verification each;
//      other models moved more than 2×: listed for the owner;
//   5. a rules release (scripts/rules-version.ts), its level from the moves: major when a headline moved more
//      than 2× or changed sign, minor when one moved, else patch (--level major for a standard step added or
//      removed); every receipt the rule leaves current moves from the previous version to the new one.
// Steps 2-4 go to inventory/rule-changes/<rule-id>.md. --dry-run prints the table and the plan, then
// puts every file back as it was (nothing stamped or written).
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { contentSha } from "./audit-receipt";
import { changedRows, readResults, readTree, relativeMove, root, type Result } from "./lib/library";
import { fmt, latestRound, passes, pct, receiptShas, stamp, today } from "./restamp";
import { latest, next, receiptRules, release, setRules, type Level } from "./rules-version";

const args = process.argv.slice(2);
const opt = (n: string) => { const i = args.indexOf(n); return i < 0 ? undefined : args.splice(i, 2)[1]; };
const apply = opt("--apply"), note = opt("--note");
const tolerance = Number(opt("--tolerance") ?? "0.01");
const forced = opt("--level");
const dry = args.includes("--dry-run");
const rule = args.find((a) => !a.startsWith("--"));
if (!rule || !apply || !/^[a-z0-9][a-z0-9.-]*$/i.test(rule) || (forced && forced !== "major")) {
  console.error('usage: npx tsx scripts/rule-change.ts <rule-id> --apply <script> [--note "<what the rule does>"] [--tolerance 0.01] [--level major] [--dry-run]');
  process.exit(2);
}
const git = (...a: string[]) => execFileSync("git", a, { cwd: root, encoding: "utf8", maxBuffer: 1 << 28 });
if (git("status", "--porcelain", "--untracked-files=no").trim()) {
  console.error("rule-change: commit or set aside the working tree's changes first, so the table shows only the rule's");
  process.exit(2);
}

const tmp = mkdtempSync(join(tmpdir(), "rule-change-"));
const snapshot = (name: string) => {
  const out = join(tmp, `${name}.json`);
  execFileSync("npx", ["tsx", join(root, "scripts/lib/library.ts"), "--out", out], { cwd: root, stdio: ["ignore", "inherit", "inherit"] });
  return readResults(out);
};
const untracked = () => new Set(git("ls-files", "--others", "--exclude-standard").split("\n").filter(Boolean));

console.log("Before…");
const before = snapshot("before");
const beforeTree = readTree();
const untrackedBefore = untracked();

console.log(`Applying ${apply}…`);
const script = resolve(process.cwd(), apply);
const runner = script.endsWith(".ts") ? ["npx", "tsx", script] : script.endsWith(".py") ? ["python3", script] : script.endsWith(".sh") ? ["sh", script] : [script];
const r = spawnSync(runner[0], runner.slice(1), { cwd: root, stdio: "inherit", env: { ...process.env, RULE_ID: rule } });
const touched = git("diff", "--name-only").split("\n").filter(Boolean);
const created = [...untracked()].filter((p) => !untrackedBefore.has(p));
const restore = () => {
  if (touched.length) git("checkout", "--", ...touched);
  for (const p of created) unlinkSync(join(root, p));
};
if (r.status !== 0) {
  restore();
  console.error(`rule-change: ${apply} failed (exit ${r.status}); every file put back`);
  process.exit(1);
}

console.log("After…");
let after: Record<string, Result>;
try { after = snapshot("after"); } catch (e) { restore(); throw e; }
const afterTree = readTree();

// --- What moved ----------------------------------------------------------------------------------------
type Line = { id: string; ours: boolean; before: number; after: number; move: number; rows: string[]; contentChanged: boolean };
const shaOf = (t: typeof beforeTree, id: string) => { const m = t.models.find((x) => x.id === id); return m ? contentSha(m) : undefined; };
const owner = new Map(afterTree.models.map((m) => [m.id as string, m.owner as string]));
const lines: Line[] = [];
for (const id of new Set([...Object.keys(before), ...Object.keys(after)])) {
  const b = before[id], a = after[id];
  const contentChanged = shaOf(beforeTree, id) !== shaOf(afterTree, id);
  const rows = b && a ? changedRows(b.rows, a.rows) : ["(model added or removed)"];
  const move = b && a ? relativeMove(b.headline, a.headline) : Infinity;
  if (move <= 1e-12 && !rows.length && !contentChanged) continue;
  lines.push({ id, ours: owner.get(id) === "charityevals", before: b?.headline ?? NaN, after: a?.headline ?? NaN, move, rows, contentChanged });
}
lines.sort((x, y) => y.move - x.move || x.id.localeCompare(y.id));

const grandfathered = new Set<string>(JSON.parse(readFileSync(join(root, "audits/grandfathered.json"), "utf8")).models);
const plan = lines.map((l) => {
  if (!l.ours) return { l, action: l.move > 1 ? "owner: moved more than 2×" : "-" };
  const round = latestRound(l.id);
  const text = round && readFileSync(round, "utf8");
  if (!text) return { l, action: grandfathered.has(l.id) ? "grandfathered (no receipt)" : "no receipt" };
  if (l.move > tolerance) return { l, action: "verify" };
  if (!l.contentChanged && receiptShas(text).every((s) => s === shaOf(afterTree, l.id))) return { l, action: "receipt current" };
  if (!passes(text)) return { l, action: "verify (latest round isn't a pass)" };
  // A receipt already stale before the rule: re-stamping it would pass an unaudited earlier change.
  if (!receiptShas(text).every((s) => s === shaOf(beforeTree, l.id))) return { l, action: "verify (receipt stale before the rule)" };
  return { l, action: "re-stamp" };
});

const rowsCell = (rs: string[]) => (rs.length > 4 ? `${rs.slice(0, 4).join(", ")} +${rs.length - 4}` : rs.join(", ")) || "-";
const table = [
  "| model | before | after | move | rows changed | receipt |",
  "|---|---|---|---|---|---|",
  ...plan.map(({ l, action }) => `| ${l.id} | ${fmt(l.before)} | ${fmt(l.after)} | ${pct(l.before, l.after)} | ${rowsCell(l.rows)} | ${action} |`),
].join("\n");
console.log(`\n${table}\n`);

const why = note ?? `rule ${rule} applied by ${apply}`;
const verify = plan.filter((p) => p.action.startsWith("verify"));
const owners = plan.filter((p) => p.action.startsWith("owner"));
const stamped: string[] = [];
for (const p of plan.filter((x) => x.action === "re-stamp")) {
  const model = afterTree.models.find((m) => m.id === p.l.id)!;
  stamped.push(stamp(model, why, { before: p.l.before, after: p.l.after, rows: p.l.rows, base: "the tree before the rule" }, { rule, dry }));
}
stamped.forEach((s) => console.log(s));

// --- The rules release ---------------------------------------------------------------------------------
// How far a headline moved, as a factor either way; a sign change or a model added or removed is infinite.
const factor = (l: Line) => (l.before === l.after ? 1 : !Number.isFinite(l.before) || !Number.isFinite(l.after) || l.before * l.after <= 0 ? Infinity : Math.max(l.after / l.before, l.before / l.after));
const level: Level = forced === "major" || lines.some((l) => factor(l) > 2) ? "major" : lines.some((l) => l.move > 1e-9) ? "minor" : "patch";
const prev = latest().version;
const version = next(prev, level);
// Receipts the rule leaves current (every charityevals model not on the verification list) move up a
// version, but only from the previous one: a receipt already behind stays behind until it is audited.
const verifyIds = new Set(plan.filter((p) => p.action.startsWith("verify")).map((p) => p.l.id));
const advanced: string[] = [];
for (const m of afterTree.models.filter((x) => x.owner === "charityevals" && !verifyIds.has(x.id as string))) {
  const file = latestRound(m.id as string);
  const text = file && readFileSync(file, "utf8");
  if (!text || !passes(text) || receiptRules(text) !== prev || !receiptShas(text).every((s) => s === shaOf(afterTree, m.id as string))) continue;
  advanced.push(m.id as string);
  if (!dry) writeFileSync(file!, setRules(text, version));
}
console.log(`Rules ${prev} → ${version} (${level}); ${advanced.length} receipts moved to ${version}.`);

if (dry) {
  restore();
  console.log(`\nDry run: ${lines.length} models moved; ${stamped.length} would be re-stamped, ${verify.length} to verify, ${owners.length} for the owner; rules ${prev} → ${version} (${level}). Every file put back.`);
  process.exit(0);
}

const brief = (l: Line) => `- [ ] **${l.id}**: rule ${rule} moved the headline ${fmt(l.before)} → ${fmt(l.after)} (${pct(l.before, l.after)}); rows changed: ${rowsCell(l.rows)}. Scoped verification (sonnet): the move is the rule's, applied as it says, and nothing else in the model changed; then a passing round on the current Model-sha.`;
const md = [
  `# Rule change ${rule} (${today()})`,
  "",
  `${why}. Applied by \`${apply}\`; files changed: ${touched.length + created.length}. ${lines.length} models moved; ${stamped.length} receipts re-stamped (headline within ${tolerance * 100}%), ${verify.length} to verify, ${owners.length} other models moved more than 2×.`,
  "",
  `Rules ${prev} → ${version} (${level}); ${advanced.length} receipts moved to ${version}, the ${verify.length} to verify stay on theirs until verified.`,
  "",
  "## Verification list",
  "",
  ...(verify.length ? verify.map((p) => brief(p.l)) : ["None."]),
  ...(owners.length ? ["", "## Other models moved more than 2× (for the owner)", "", ...owners.map((p) => `- ${p.l.id}: ${fmt(p.l.before)} → ${fmt(p.l.after)} (${pct(p.l.before, p.l.after)})`)] : []),
  "",
  "## Before and after",
  "",
  table,
  "",
].join("\n");
const dir = join(root, "inventory/rule-changes");
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, `${rule}.md`), md);
release(level, why, { log: `inventory/rule-changes/${rule}.md` });
console.log(`\nWrote inventory/rule-changes/${rule}.md: ${stamped.length} re-stamped, ${verify.length} to verify, ${owners.length} for the owner. Nothing committed.`);
