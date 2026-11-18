// The rules version: one semantic version for what an audit checks a model against, so a page can show
// how far its audit is behind the latest rules. audits/versions.json lists every release, newest first,
// with a fingerprint of the files below; a test fails when they change without a release.
//   npx tsx scripts/rules-version.ts <major|minor|patch> --note "<what changed>" [--log <file>]
//   npx tsx scripts/rules-version.ts --to 1.0.0 --note "<why>"     (an explicit version, e.g. at launch)
//   npx tsx scripts/rules-version.ts --check
// Levels, decided by what the change does to results (scripts/rule-change.ts sets them by measuring):
//   major: some model's headline moves more than 2× (or changes sign), or a standard step is added or removed;
//   minor: headlines move, none more than 2×;
//   patch: no headline moves: wording, a clearer rule, a new check in the audit skill.
// Before 1.0 a major change bumps the second number and everything else the third.
// A receipt (audits/<id>/audit-r<n>.md) records the version it was audited under ("Rules: x.y.z"); a rule
// change applied to every model moves the receipts it leaves current from the previous version to the new
// one (rule-change.ts), and a fresh audit or verification round writes the latest.
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const root = join(import.meta.dirname, "..");
export const versionsFile = join(root, "audits/versions.json");
export type Level = "major" | "minor" | "patch";
export type Release = { version: string; date: string; level: Level | "baseline" | "set"; change: string; log?: string; sha: string };
type Versions = { tracked: string[]; releases: Release[] };

const walk = (p: string): string[] => (statSync(p).isDirectory() ? readdirSync(p).sort().flatMap((f) => walk(join(p, f))) : [p]);
export const readVersions = (): Versions => JSON.parse(readFileSync(versionsFile, "utf8"));
export const latest = () => readVersions().releases[0];

/** Fingerprint of the files that make up the rules and the auditor. */
export function rulesSha(tracked = readVersions().tracked): string {
  const h = createHash("sha256");
  for (const f of tracked.flatMap((t) => walk(join(root, t)))) h.update(`${relative(root, f)}\0${readFileSync(f, "utf8").replace(/\r\n/g, "\n")}\0`);
  return h.digest("hex");
}

export const parse = (v: string) => {
  const m = /^(\d+)\.(\d+)\.(\d+)$/.exec(v);
  if (!m) throw new Error(`not a version: ${v}`);
  return [Number(m[1]), Number(m[2]), Number(m[3])] as const;
};
export const compare = (a: string, b: string) => { const x = parse(a), y = parse(b); return x[0] - y[0] || x[1] - y[1] || x[2] - y[2]; };

export function next(v: string, level: Level): string {
  const [ma, mi, pa] = parse(v);
  if (ma === 0) return level === "major" ? `0.${mi + 1}.0` : `0.${mi}.${pa + 1}`;
  return level === "major" ? `${ma + 1}.0.0` : level === "minor" ? `${ma}.${mi + 1}.0` : `${ma}.${mi}.${pa + 1}`;
}

/** Add a release on top and write the file; returns it. */
export function release(level: Level | "set", change: string, opts: { log?: string; to?: string; dry?: boolean } = {}): Release {
  const v = readVersions();
  const version = opts.to ?? next(v.releases[0].version, level as Level);
  if (compare(version, v.releases[0].version) <= 0) throw new Error(`${version} isn't after ${v.releases[0].version}`);
  const r: Release = { version, date: new Date().toISOString().slice(0, 10), level, change: change.replace(/\.?$/, "."), ...(opts.log ? { log: opts.log } : {}), sha: rulesSha(v.tracked) };
  if (!opts.dry) writeFileSync(versionsFile, JSON.stringify({ ...v, releases: [r, ...v.releases] }, null, 2) + "\n");
  return r;
}

/** The receipt's rules version, or undefined. */
export const receiptRules = (text: string) => /^Rules:\s*(\d+\.\d+\.\d+)\s*$/m.exec(text)?.[1];

/** The receipt with its rules version set to `version` (the line goes after Model-sha when missing). */
export function setRules(text: string, version: string): string {
  if (/^Rules:.*$/m.test(text)) return text.replace(/^Rules:.*$/m, `Rules: ${version}`);
  return text.replace(/^(Model-sha:.*)$/m, `$1\nRules: ${version}`);
}

function main() {
  const args = process.argv.slice(2);
  const opt = (n: string) => { const i = args.indexOf(n); return i < 0 ? undefined : args.splice(i, 2)[1]; };
  if (args.includes("--check")) {
    const ok = rulesSha() === latest().sha;
    console.log(ok ? `rules ${latest().version}: current` : `rules changed since ${latest().version}: npx tsx scripts/rules-version.ts <major|minor|patch> --note "<what changed>"`);
    process.exit(ok ? 0 : 1);
  }
  const note = opt("--note"), log = opt("--log"), to = opt("--to");
  const level = args.find((a) => a === "major" || a === "minor" || a === "patch") as Level | undefined;
  if (!note || (!level && !to)) {
    console.error('usage: npx tsx scripts/rules-version.ts <major|minor|patch> --note "<what changed>" [--log <file>] | --to <x.y.z> --note "<why>" | --check');
    process.exit(2);
  }
  const r = release(to ? "set" : level!, note, { log, to });
  console.log(`rules ${r.version} (${r.level}): ${r.change}`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
