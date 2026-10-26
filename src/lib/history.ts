// Build-time only: a model's history from git. For every commit that touched the model, its
// parents, the shared assumptions or facts, we rebuild the whole library as it was at that commit
// and compute the bottom line, so the page shows how the assessment moved and why.
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { buildLibrary, assumptionValues, bottomLine, pickValue, type Library, type ResolvedModel } from "../engine/model";

export type RowChange = { id: string; label: string; before: string; after: string };

export type HistoryEntry = {
  sha: string | null; // null: uncommitted changes in the working copy
  date: string;
  author: string;
  subject: string;
  /** Multiples of the benchmark, default assumptions. Undefined when that version can't be read. */
  ours?: number;
  evaluator?: number;
  changes: RowChange[];
  note?: string;
};

const git = (root: string, args: string[]) =>
  execFileSync("git", args, { cwd: root, encoding: "utf8", maxBuffer: 64 * 1024 * 1024, stdio: ["ignore", "pipe", "ignore"] });

function jsonFilesAt(root: string, sha: string, dir: string): unknown[] {
  return git(root, ["ls-tree", "-r", "--name-only", sha, "--", dir])
    .split("\n")
    .filter((n) => n.endsWith(".json"))
    .map((n) => JSON.parse(git(root, ["show", `${sha}:${n}`])));
}

function jsonFilesWorking(root: string, dir: string): unknown[] {
  const walk = (d: string): string[] =>
    existsSync(join(root, d))
      ? readdirSync(join(root, d), { withFileTypes: true }).flatMap((e) =>
          e.isDirectory() ? walk(join(d, e.name)) : e.name.endsWith(".json") ? [join(d, e.name)] : [])
      : [];
  return walk(dir).map((p) => JSON.parse(readFileSync(join(root, p), "utf8")));
}

/** The library as it was at a commit, or in the working copy when sha is null. */
function libraryAt(root: string, sha: string | null): Library | undefined {
  try {
    if (sha === null)
      return buildLibrary(
        jsonFilesWorking(root, "models"),
        JSON.parse(readFileSync(join(root, "assumptions/default.json"), "utf8")),
        jsonFilesWorking(root, "facts"),
      );
    return buildLibrary(
      jsonFilesAt(root, sha, "models"),
      JSON.parse(git(root, ["show", `${sha}:assumptions/default.json`])),
      jsonFilesAt(root, sha, "facts"),
    );
  } catch {
    return undefined;
  }
}

const describe = (r: ResolvedModel["rows"][number] | undefined) =>
  !r ? "—" : r.formula !== undefined ? `= ${r.formula}` : typeof r.value === "object"
    ? `${r.value.low ?? r.value.best} / ${r.value.best} / ${r.value.high ?? r.value.best}`
    : String(pickValue(r.value));

function evaluate(lib: Library | undefined, id: string) {
  const m = lib?.models.get(id);
  const bench = lib?.models.get(lib.assumptions.common.benchmark);
  if (!lib || !m || !bench || !m.output) return {};
  const av = assumptionValues(lib.assumptions);
  const ours = bottomLine(lib, m, av).common / bottomLine(lib, bench, av).common;
  const evaluator = m.evaluator
    ? bottomLine(lib, m, av, {}, "evaluator").common / bottomLine(lib, bench, av, {}, bench.evaluator ? "evaluator" : "charityevals").common
    : undefined;
  return { ours: Number.isFinite(ours) ? ours : undefined, evaluator: evaluator !== undefined && Number.isFinite(evaluator) ? evaluator : undefined };
}

function diffRows(before: ResolvedModel | undefined, after: ResolvedModel | undefined): RowChange[] {
  if (!after) return [];
  const out: RowChange[] = [];
  for (const r of after.rows) {
    const b = before?.byId.get(r.id);
    const [x, y] = [describe(b), describe(r)];
    if (x !== y) out.push({ id: r.id, label: r.label, before: x, after: y });
  }
  for (const r of before?.rows ?? []) if (!after.byId.has(r.id)) out.push({ id: r.id, label: r.label, before: describe(r), after: "removed" });
  return out;
}

/** Oldest first. Empty when the site isn't built from a git checkout. */
export function modelHistory(root: string, model: ResolvedModel, filePaths: string[]): HistoryEntry[] {
  const paths = [...filePaths, "assumptions/default.json", "facts"];
  let log: string[] = [];
  try {
    log = git(root, ["log", "--reverse", "--format=%H%x1f%ad%x1f%an%x1f%s", "--date=short", "--", ...paths]).split("\n").filter(Boolean);
  } catch {
    return [];
  }
  const entries: HistoryEntry[] = [];
  let prev: ResolvedModel | undefined;
  const step = (sha: string | null, date: string, author: string, subject: string) => {
    const lib = libraryAt(root, sha);
    const m = lib?.models.get(model.id);
    const result = evaluate(lib, model.id);
    const changes = diffRows(prev, m);
    entries.push({
      sha, date, author, subject, ...result,
      changes: prev ? changes : [],
      note: !m ? "This model doesn't exist yet at this point, or can't be read by today's engine." : !prev ? `First version: ${m.rows.length} rows.` : undefined,
    });
    if (m) prev = m;
  };
  for (const line of log) {
    const [sha, date, author, subject] = line.split("\x1f");
    step(sha, date, author, subject);
  }
  let dirty = false;
  try {
    dirty = git(root, ["status", "--porcelain", "--", ...paths]).trim().length > 0;
  } catch {
    /* not a checkout */
  }
  if (dirty) step(null, new Date().toISOString().slice(0, 10), "", "Uncommitted changes");
  return entries.filter((e) => e.sha === null || e.note || e.changes.length || e === entries[0]);
}
