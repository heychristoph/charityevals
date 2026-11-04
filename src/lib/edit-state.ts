// The reader's edits to one model's numbers: its inputs by row id, shared facts by "@key". They live in
// the page's URL only (n.<id>=value), so a link carries them and they never leak into another model or
// the rankings. Assumption overrides (a.<id>) sit beside them in the same URL.
import { useSyncExternalStore } from "react";
import { usedFacts, type Library, type ResolvedModel } from "../engine/model";

type Edits = Record<string, number>;
const PREFIX = "n.";

let current: Edits = {};
let loaded = false;
const listeners = new Set<() => void>();

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  for (const [k, v] of new URLSearchParams(window.location.search))
    if (k.startsWith(PREFIX) && v.trim() && Number.isFinite(Number(v))) current[k.slice(PREFIX.length)] = Number(v);
}

function persist() {
  const url = new URL(window.location.href);
  for (const k of [...url.searchParams.keys()]) if (k.startsWith(PREFIX)) url.searchParams.delete(k);
  for (const [k, v] of Object.entries(current)) url.searchParams.set(`${PREFIX}${k}`, String(Number(v.toPrecision(6))));
  history.replaceState(null, "", url);
  listeners.forEach((l) => l());
}

/** Set one number, or put it back (undefined, or the original value). */
export function setEdit(id: string, value: number | undefined, original: number) {
  ensureLoaded();
  const next = { ...current };
  if (value === undefined || Math.abs(value - original) <= Math.abs(original) * 1e-9) delete next[id];
  else next[id] = value;
  current = next;
  persist();
}

export function clearEdits() {
  current = {};
  persist();
}

const EMPTY: Edits = {};

/** Every model a page shows editable (a charity's programmes on its whole-charity page): an edit that
 * lands in any of them stays in the URL, whichever model's island filters it first. */
let pageModels: { m: ResolvedModel; lib?: Library }[] = [];
export function setPageModels(models: ResolvedModel[], lib?: Library) {
  pageModels = models.map((m) => ({ m, lib }));
}

/** The edits in the URL now, outside React. */
export function readEdits(): Edits {
  ensureLoaded();
  return current;
}

export function useEdits(): Edits {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    readEdits,
    () => EMPTY,
  );
}

/** Where an edit to `key` lands in a model: an input row's id, or "@key" for a shared fact it reads.
 * A row whose formula is just another row or fact ("pass-through") sends the edit on to what it
 * copies, which the tree then marks as the reader's edit. Anything else (a calculated row, an
 * assumption, another model's row) lands nowhere. */
function target(m: ResolvedModel, facts: Set<string>, key: string): string | undefined {
  if (key.startsWith("@")) return facts.has(key.slice(1)) ? key : undefined;
  for (let id = key, hops = 0; hops <= m.rows.length; hops++) {
    const r = m.byId.get(id);
    if (!r) return undefined;
    if (!r.node) return id;
    if (r.node.type !== "ref" || r.node.scope === "assumption" || r.node.scope === "model") return undefined;
    if (r.node.scope === "fact") return facts.has(r.node.name) ? `@${r.node.name}` : undefined;
    id = r.node.name;
  }
}

/** The browser's stand-in for a bulk model (generated/bulk-summaries.json) renames and folds its rows,
 * so it can't tell which of the full model's rows an edit names. */
const isSummary = (m: ResolvedModel) => !!m.bulk && m.rows.every((r) => r.id === m.output?.row || !r.label);

/** The edits that apply to a model: its inputs by row id and the shared facts it reads by "@key", with
 * edits to pass-through rows moved to the input they copy. A key that applies nowhere is never applied
 * unmarked; it is dropped from the URL too, so a copied link doesn't carry it. An edit made directly to
 * an input wins over one reaching it through a pass-through row. Given the library, the facts the
 * model's unit conversion reads (climate's) are editable too. */
export function editsFor(m: ResolvedModel, edits: Edits, lib?: Library): Edits {
  const facts = new Set(usedFacts(m, lib));
  const keys = Object.keys(edits);
  const where = keys.map((k) => target(m, facts, k));
  if (keys.every((k, i) => where[i] === k)) return edits;
  const out: Edits = {};
  keys.forEach((k, i) => { const t = where[i]; if (t && (t === k || !(t in edits))) out[t] = edits[k]; });
  // Only the page's own model rewrites the URL, and only once it has the model's real rows. A key
  // that lands in another model the page shows (a sibling programme) is that model's, so it stays.
  const elsewhere = (k: string) => pageModels.some((p) => p.m !== m && target(p.m, new Set(usedFacts(p.m, p.lib)), k) !== undefined);
  if (edits === current && typeof window !== "undefined" && !isSummary(m))
    queueMicrotask(() => {
      if (current !== edits) return;
      const kept: Edits = { ...out };
      keys.forEach((k, i) => { if (!where[i] && elsewhere(k)) kept[k] = edits[k]; });
      // Nothing dropped or moved (every key kept as it was): no new snapshot, so no re-render loop.
      const same = Object.keys(kept).length === keys.length && keys.every((k) => kept[k] === edits[k]);
      if (same) return;
      current = kept;
      persist();
    });
  return out;
}
