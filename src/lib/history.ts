// Build-time only: a model's history from git. Only commits that touched the model's own file (or the
// files it extends) count; for each we rebuild the library as it was at that commit, compute the
// result and every row, and keep the commit message, so the page shows what changed and why.
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { AGE_DISCOUNT, MISSING_DATA_DISCOUNT, buildLibrary, assumptionValues, comparable, compute, headline, type Library, type ResolvedModel } from "../engine/model";
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

/** Every JSON file under `dir` at a commit, read in one `git cat-file --batch` rather than one process
 * per file: a past library is hundreds of files. */
function jsonFilesAt(root: string, sha: string, dir: string): unknown[] {
  const names = git(root, ["ls-tree", "-r", "--name-only", sha, "--", dir]).split("\n").filter((n) => n.endsWith(".json"));
  if (!names.length) return [];
  const out = execFileSync("git", ["cat-file", "--batch"], {
    cwd: root, input: names.map((n) => `${sha}:${n}`).join("\n") + "\n", maxBuffer: 1024 * 1024 * 1024, stdio: ["pipe", "pipe", "ignore"],
  });
  // Each object: "<oid> blob <size>\n<content>\n".
  const files: unknown[] = [];
  let at = 0;
  while (at < out.length) {
    const nl = out.indexOf(10, at);
    const size = Number(out.subarray(at, nl).toString("utf8").split(" ")[2]);
    files.push(JSON.parse(out.subarray(nl + 1, nl + 1 + size).toString("utf8")));
    at = nl + 1 + size + 1;
  }
  return files;
}

function jsonFilesWorking(root: string, dir: string): unknown[] {
  const walk = (d: string): string[] =>
    existsSync(join(root, d))
      ? readdirSync(join(root, d), { withFileTypes: true }).flatMap((e) =>
          e.isDirectory() ? walk(join(d, e.name)) : e.name.endsWith(".json") ? [join(d, e.name)] : [])
      : [];
  return walk(dir).map((p) => JSON.parse(readFileSync(join(root, p), "utf8")));
}

/** owners.json at a commit; none before it existed. */
function ownersAt(root: string, sha: string): unknown[] {
  try {
    return JSON.parse(git(root, ["show", `${sha}:owners.json`]));
  } catch {
    return [];
  }
}

type RawAssumptions = { rows?: { id: string }[]; common?: Record<string, unknown> };

/** A past commit's assumptions with today's discount for an estimate's age where that commit had none
 * (docs/normalization.md 2.11): the age is how old an estimate is now, not when the commit was made, so
 * every version is aged to today's date and the line runs on into the page's headline. */
function withAgeDiscount(a: RawAssumptions, root: string): RawAssumptions {
  const today: RawAssumptions = JSON.parse(readFileSync(join(root, "assumptions/default.json"), "utf8"));
  // Likewise the missing-data slider (2.12), so an imported model's line doesn't jump where it arrived.
  const missing = today.rows?.find((r) => r.id === MISSING_DATA_DISCOUNT);
  if (missing && a.rows && !a.rows.some((r) => r.id === MISSING_DATA_DISCOUNT)) a = { ...a, rows: [...a.rows, missing] };
  if (a.rows?.some((r) => r.id === AGE_DISCOUNT)) return a;
  const row = today.rows?.find((r) => r.id === AGE_DISCOUNT);
  if (!row || !a.rows || !a.common) return a;
  return { ...a, rows: [...a.rows, row], common: { ...a.common, estimate_age_as_of: today.common?.estimate_age_as_of } };
}

let classified: Map<string, unknown> | undefined;
/** A past commit's imported models with today's missing-data classification where that commit had none
 * (docs/normalization.md 2.12): which share of an evaluator's result isn't measured is a reading of its
 * model, so every version is read today's way and the line doesn't jump at the commit that added it. */
function withMissingData(models: unknown[], root: string): unknown[] {
  classified ??= new Map(
    (jsonFilesWorking(root, "models") as { id: string; missing_data?: unknown }[]).filter((m) => m.missing_data).map((m) => [m.id, m.missing_data]),
  );
  return (models as { id?: string; missing_data?: unknown }[]).map((m) =>
    m && typeof m === "object" && !m.missing_data && m.id && classified!.has(m.id) ? { ...m, missing_data: classified!.get(m.id) } : m);
}

/** The library as it was at a commit, or in the working copy when sha is null. Never cached: a library
 * holds every model, bulk imports included, and one per commit doesn't fit in memory (see
 * prepareHistories, which builds each commit's library once for every page). */
function loadLibrary(root: string, sha: string | null): Library | undefined {
  try {
    if (sha === null)
      return buildLibrary(
        jsonFilesWorking(root, "models"),
        JSON.parse(readFileSync(join(root, "assumptions/default.json"), "utf8")),
        jsonFilesWorking(root, "facts"),
        // A meta model reads a charity's programme-weighted figure live (`#owner:charity`).
        jsonFilesWorking(root, "charities"),
        existsSync(join(root, "owners.json")) ? JSON.parse(readFileSync(join(root, "owners.json"), "utf8")) : [],
      );
    return buildLibrary(
      withMissingData(jsonFilesAt(root, sha, "models"), root),
      withAgeDiscount(JSON.parse(git(root, ["show", `${sha}:assumptions/default.json`])), root),
      jsonFilesAt(root, sha, "facts"),
      jsonFilesAt(root, sha, "charities"),
      ownersAt(root, sha),
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

type Commit = { sha: string; date: string; author: string; subject: string; body: string };

/** Commits that touched these files, oldest first. */
function commitsOf(root: string, filePaths: string[]): Commit[] {
  try {
    // %x1e ends each commit, %x1f separates its fields: the body may span lines.
    return git(root, ["log", "--reverse", "--format=%H%x1f%ad%x1f%an%x1f%s%x1f%b%x1e", "--date=short", "--", ...filePaths])
      .split("\x1e").map((l) => l.trim()).filter(Boolean)
      .map((line) => {
        const [sha, date, author, subject, body = ""] = line.split("\x1f");
        return { sha, date, author, subject, body };
      });
  } catch {
    return [];
  }
}

/** One model's history as it is built, commit by commit. */
class Builder {
  entries: HistoryEntry[] = [];
  private prev: { m: ResolvedModel; values?: Record<string, number> } | undefined;
  constructor(private id: string) {}
  step(lib: Library | undefined, c: Commit | { sha: null; date: string; author: string; subject: string; body: string }) {
    const m = lib?.models.get(this.id);
    const { ours, values } = evaluate(lib, this.id);
    this.entries.push({
      sha: c.sha, date: c.date, author: c.author, subject: c.subject, body: reason(c.body), ours,
      changes: this.prev ? diffRows(this.prev.m, this.prev.values, m, values) : [],
      note: !m ? "This model doesn't exist yet at this point, or can't be read by today's engine."
        : !this.prev ? `First version: ${m.rows.length} rows.`
        : undefined,
    });
    if (m) this.prev = { m, values };
  }
  done(): HistoryEntry[] {
    // Every commit to the file stays: one that changed no number (wording, sources, links) says so.
    for (const e of this.entries) if (!e.note && !e.changes.length) e.note = "No numbers changed: wording, sources or links did.";
    return this.entries;
  }
}

export type HistoryRequest = { model: ResolvedModel; filePaths: string[] };

/** Histories of many models at once, oldest first each. Walks the commits that touched any of their
 * files in order and builds the library at each commit once, for every model that commit touched,
 * keeping only the results. `uncommitted`: add the working copy's changes as a last entry (while
 * developing; a production build shows only what's committed). */
export function histories(root: string, reqs: HistoryRequest[], { uncommitted = true }: { uncommitted?: boolean } = {}): Map<string, HistoryEntry[]> {
  const builders = new Map(reqs.map((r) => [r.model.id, new Builder(r.model.id)]));
  const bySha = new Map<string, { commit: Commit; ids: string[] }>();
  for (const r of reqs)
    for (const c of commitsOf(root, r.filePaths)) {
      const at = bySha.get(c.sha) ?? { commit: c, ids: [] };
      at.ids.push(r.model.id);
      bySha.set(c.sha, at);
    }
  let order: string[] = [];
  try {
    order = git(root, ["rev-list", "--reverse", "--topo-order", "HEAD"]).split("\n").filter((s) => bySha.has(s));
  } catch {
    /* not a checkout: no commits to walk */
  }
  for (const sha of bySha.keys()) if (!order.includes(sha)) order.push(sha);
  for (const sha of order) {
    const { commit, ids } = bySha.get(sha)!;
    const lib = loadLibrary(root, sha);
    for (const id of ids) builders.get(id)!.step(lib, commit);
  }
  if (uncommitted) {
    const dirty = reqs.filter((r) => {
      try {
        return git(root, ["status", "--porcelain", "--", ...r.filePaths]).trim().length > 0;
      } catch {
        return false;
      }
    });
    if (dirty.length) {
      const lib = loadLibrary(root, null);
      const c = { sha: null, date: new Date().toISOString().slice(0, 10), author: "", subject: "Uncommitted changes", body: "" };
      for (const r of dirty) builders.get(r.model.id)!.step(lib, c);
    }
  }
  return new Map([...builders].map(([id, b]) => [id, b.done()]));
}

const prepared = new Map<string, Map<string, HistoryEntry[]>>();

/** One model's history, oldest first. Empty when the site isn't built from a git checkout. Given `all`
 * (every history page's request), the first call builds them all together and later calls read the
 * result, so each past library is built once per build rather than once per page. */
export function modelHistory(root: string, model: ResolvedModel, filePaths: string[], opts: { uncommitted?: boolean; all?: HistoryRequest[] } = {}): HistoryEntry[] {
  const { all, ...rest } = opts;
  if (all) {
    const key = `${root}@${rest.uncommitted ?? true}`;
    let done = prepared.get(key);
    if (!done) prepared.set(key, (done = histories(root, all, rest)));
    const hit = done.get(model.id);
    if (hit) return hit;
  }
  return histories(root, [{ model, filePaths }], rest).get(model.id) ?? [];
}
