// Build-time only: a model's history from git. Only commits that touched the model's own file (or the
// files it extends) count; for each we rebuild the library as it was at that commit, compute the
// result and every row, and keep the commit message, so the page shows what changed and why.
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { buildLibrary, assumptionValues, comparable, compute, headline, type Library, type ResolvedModel } from "../engine/model";
import { formatValue } from "./format";

/** One row that changed: its value before and after, and whether its calculation changed too. */
export type RowChange = { id: string; label: string; before: string; after: string; kind: "value" | "formula" | "added" | "removed" };

export type HistoryEntry = {
  sha: string | null; // null: uncommitted changes in the working copy
  date: string;
  author: string;
  subject: string;
  /** The commit message's body: why the change was made. */
  body: string;
  /** Years of healthy life per $1,000, default assumptions. Undefined when that version can't be read. */
  ours?: number;
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

const libraryCache = new Map<string, Library | undefined>();

/** The library as it was at a commit, or in the working copy when sha is null. Cached: every
 * history page asks for the same commits. */
function libraryAt(root: string, sha: string | null): Library | undefined {
  const key = `${root}@${sha ?? "working"}`;
  if (!libraryCache.has(key)) libraryCache.set(key, loadLibrary(root, sha));
  return libraryCache.get(key);
}

function loadLibrary(root: string, sha: string | null): Library | undefined {
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

function evaluate(lib: Library | undefined, id: string): { ours?: number; values?: Record<string, number> } {
  const m = lib?.models.get(id);
  if (!lib || !m || !m.output) return {};
  const av = assumptionValues(lib.assumptions);
  // The page's own headline: years of healthy life per $1,000 (none for a unit nobody converts).
  const ours = comparable(lib, m) ? headline(lib, m, av) : NaN;
  let values: Record<string, number> | undefined;
  try {
    values = compute(lib, m, av);
  } catch {
    /* an old version today's engine can't run */
  }
  return { ours: Number.isFinite(ours) ? ours : undefined, values };
}

/** Rows whose input or calculation changed between two versions, shown by their values. */
function diffRows(before: ResolvedModel | undefined, bv: Record<string, number> | undefined, after: ResolvedModel | undefined, av: Record<string, number> | undefined): RowChange[] {
  if (!after) return [];
  const show = (r: ResolvedModel["rows"][number], v: Record<string, number> | undefined) => (v && Number.isFinite(v[r.id]) ? formatValue(v[r.id], r.format) : "—");
  const out: RowChange[] = [];
  for (const r of after.rows) {
    const b = before?.byId.get(r.id);
    if (!b) {
      out.push({ id: r.id, label: r.label, before: "—", after: show(r, av), kind: "added" });
      continue;
    }
    // A row changed when what it says changed (its value, range or formula), not when a change upstream
    // merely moved its result: that shows in the result line.
    const formula = (b.formula ?? "") !== (r.formula ?? "");
    if (!formula && JSON.stringify(b.value) === JSON.stringify(r.value)) continue;
    const [was, is] = [show(b, bv), show(r, av)];
    // A value that reads the same before and after (only its range or a far decimal moved) isn't a
    // change worth a line; a new calculation that gives the same number still is, shown once.
    if (!formula && was === is) continue;
    out.push({ id: r.id, label: r.label, before: was, after: is, kind: formula ? "formula" : "value" });
  }
  for (const r of before?.rows ?? []) if (!after.byId.has(r.id)) out.push({ id: r.id, label: r.label, before: show(r, bv), after: "removed", kind: "removed" });
  // Imported sheets repeat a row under the same label (a value and the cell that passes it on): one line each.
  return out.filter((c, i) => out.findIndex((x) => x.label === c.label && x.before === c.before && x.after === c.after && x.kind === c.kind) === i);
}

/** The commit message's body without git trailers (Co-Authored-By: …, Signed-off-by: …). */
const reason = (body: string) => body.split("\n").filter((l) => !/^[A-Za-z-]+: .*<[^>]+>\s*$/.test(l)).join("\n").trim();

/** Oldest first. Empty when the site isn't built from a git checkout. */
/** `uncommitted`: add the working copy's changes as a last entry (while developing; a production build
 * shows only what's committed). */
export function modelHistory(root: string, model: ResolvedModel, filePaths: string[], { uncommitted = true }: { uncommitted?: boolean } = {}): HistoryEntry[] {
  let log: string[] = [];
  try {
    // %x1e ends each commit, %x1f separates its fields: the body may span lines.
    log = git(root, ["log", "--reverse", "--format=%H%x1f%ad%x1f%an%x1f%s%x1f%b%x1e", "--date=short", "--", ...filePaths]).split("\x1e").map((l) => l.trim()).filter(Boolean);
  } catch {
    return [];
  }
  const entries: HistoryEntry[] = [];
  let prev: { m: ResolvedModel; values?: Record<string, number> } | undefined;
  const step = (sha: string | null, date: string, author: string, subject: string, body: string) => {
    const lib = libraryAt(root, sha);
    const m = lib?.models.get(model.id);
    const { ours, values } = evaluate(lib, model.id);
    entries.push({
      sha, date, author, subject, body: reason(body), ours,
      changes: prev ? diffRows(prev.m, prev.values, m, values) : [],
      note: !m ? "This model doesn't exist yet at this point, or can't be read by today's engine."
        : !prev ? `First version: ${m.rows.length} rows.`
        : undefined,
    });
    if (m) prev = { m, values };
  };
  for (const line of log) {
    const [sha, date, author, subject, body = ""] = line.split("\x1f");
    step(sha, date, author, subject, body);
  }
  let dirty = false;
  if (uncommitted) try {
    dirty = git(root, ["status", "--porcelain", "--", ...filePaths]).trim().length > 0;
  } catch {
    /* not a checkout */
  }
  if (dirty) step(null, new Date().toISOString().slice(0, 10), "", "Uncommitted changes", "");
  // Every commit to the file stays: one that changed no number (wording, sources, links) says so.
  for (const e of entries) if (!e.note && !e.changes.length) e.note = "No numbers changed: wording, sources or links did.";
  return entries;
}
