// Where each item of a batch run stands, worked out from the repository, not from memory (resume after a
// crash or a compaction from here; .claude/skills/import-cea/references/batch.md):
//   npx tsx scripts/batch-status.ts <batch.json>
// batch.json: [{ "charity": "<id>", "kind": "build" | "import", "branch"?: "<agent's branch>", "models"?: ["<id>"] }]
// Per item: the branch (exists, merged here), its models in this tree, for our own models the latest audit
// (verdict, and whether it is on the model as it is now), the simulation (generated/distributions.json) and
// the next step.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { modelSha } from "./audit-receipt";

type Item = { charity: string; kind: "build" | "import"; branch?: string; models?: string[] };
const root = join(import.meta.dirname, "..");
const path = process.argv[2];
if (!path) {
  console.error("usage: npx tsx scripts/batch-status.ts <batch.json>");
  process.exit(1);
}
const items: Item[] = JSON.parse(readFileSync(path, "utf8"));
const git = (...a: string[]) => {
  try {
    return execFileSync("git", ["-C", root, ...a], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return undefined;
  }
};
const walk = (d: string): string[] => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : f.endsWith(".json") ? [p] : [];
});
const models = walk(join(root, "models")).map((p) => JSON.parse(readFileSync(p, "utf8")) as { id: string; charity?: string; owner?: string });
const dist: Record<string, { unstable?: boolean }> = existsSync(join(root, "generated/distributions.json"))
  ? JSON.parse(readFileSync(join(root, "generated/distributions.json"), "utf8")) : {};
const grandfathered = new Set<string>(JSON.parse(readFileSync(join(root, "audits/grandfathered.json"), "utf8")).models);

function audit(id: string): string {
  if (grandfathered.has(id)) return "built before receipts";
  const dir = join(root, "audits", id);
  const rounds = existsSync(dir) ? readdirSync(dir).filter((f) => /^audit-r\d+\.md$/.test(f)).sort((a, b) => parseInt(b.slice(7)) - parseInt(a.slice(7))) : [];
  if (!rounds.length) return "no audit";
  const text = readFileSync(join(dir, rounds[0]), "utf8");
  const verdict = /Verdict:\s*(pass|fix needed)/i.exec(text)?.[1]?.toLowerCase() ?? "no verdict";
  const current = /Model-sha:\s*([0-9a-f]{64})/.exec(text)?.[1] === modelSha(id);
  return `${rounds[0].replace(".md", "")} ${verdict}${current ? "" : ", model changed since"}`;
}

let open = 0;
for (const it of items) {
  const branchExists = it.branch ? git("rev-parse", "--verify", "--quiet", `refs/heads/${it.branch}`) !== undefined : false;
  const merged = it.branch && branchExists ? git("merge-base", "--is-ancestor", it.branch, "HEAD") !== undefined : false;
  const ids = it.models ?? models.filter((m) => m.charity === it.charity && (it.kind === "import" ? m.owner !== "charityevals" : m.owner === "charityevals")).map((m) => m.id);
  const here = ids.filter((id) => models.some((m) => m.id === id));
  const audits = it.kind === "build" ? here.map((id) => `${id}: ${audit(id)}`) : [];
  const unstable = here.filter((id) => dist[id]?.unstable);
  const notSimulated = here.filter((id) => !dist[id]);
  let next: string;
  if (it.branch && !branchExists && !here.length) next = "start the agent";
  else if (it.branch && !merged) next = `merge ${it.branch}`;
  else if (!here.length) next = "no model here: check the agent's report";
  else if (it.kind === "build" && audits.some((a) => !/pass$|before receipts$/.test(a))) next = "audit or verification round";
  else if (notSimulated.length) next = "run the after-merge steps (batch.md)";
  else if (unstable.length) next = `fix the unstable simulation: npx tsx scripts/simulation-check.ts ${unstable.join(" ")}`;
  else next = "done";
  if (next !== "done") open++;
  console.log(`${it.charity} (${it.kind}${it.branch ? `, ${it.branch}${branchExists ? (merged ? ", merged" : ", not merged") : ", no branch"}` : ""})`);
  for (const a of audits) console.log(`  ${a}`);
  if (it.kind === "import") console.log(`  models: ${here.join(", ") || "none"}`);
  console.log(`  next: ${next}`);
}
console.log(`\n${items.length - open} of ${items.length} done`);
