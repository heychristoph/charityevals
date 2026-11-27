// The visitor's assumption overrides: kept in the URL (so a set of values is a shareable link)
// and mirrored to localStorage (so they survive navigation). Only values that differ from the
// defaults are stored. Every island on the page subscribes to the same store.
//
// The URL: `?set=<value set id>` for a ready-made set, else `?values=<id>:<number>,<id>:<number>` with
// the values that differ from the defaults. A link's values win over stored ones and become the
// visitor's; unknown ids, non-numbers and values the models can't run on are dropped (any value the
// panel takes when typed is kept, past the slider's ends too). Links
// from before (`?a.<id>=<n>`) still read. The URL follows each change by history.replaceState: no
// history entries, and analytics records only the path (worker/events.ts drops the query).
import { useSyncExternalStore } from "react";
import assumptions from "../../assumptions/default.json";
import type { Assumptions } from "../engine/schema";
import { isDefault, presetIn, sanitizeValues, serialiseValues, shortNumber, sliderEnds } from "./share-values";
import { editQuery } from "./query";

const KEY = "charityevals:assumptions";
/** Where an evaluator view, since removed, was kept: cleared so no one is left in it. */
const OLD_VIEW_KEY = "charityevals:view";
type Overrides = Record<string, number>;

let current: Overrides = {};
const listeners = new Set<() => void>();
let loaded = false;

/** Assumptions since renamed or rescaled: old id → [new id, factor]. Links shared before the change
 * keep their meaning. The chicken weight was a multiplier on Rethink Priorities' median (1 = 33.2%);
 * it now stores the weight itself. */
export const LEGACY: Record<string, [string, number]> = {
  animal_moral_weight: ["chicken_vs_person", 0.332],
  // The WELLBY rate was in doubled-income years per WELLBY; it is now in healthy years (÷ 2, the
  // default healthy-year rate), so depression's calibration holds at any healthy-year rate.
  uov_per_wellby: ["daly_per_wellby", 0.5],
  // The value of a life was a multiplier on GiveWell's values (1 = 116.25 doubled-income years for a
  // young child); it is now in healthy years (× 116.25 ÷ 2, the healthy-year rate's default when those links were made), so moving
  // the healthy-year rate no longer changes how many healthy years a death counts as.
  life_value_multiplier: ["daly_per_child_death", 116.25262 / 2],
};

/** Rates now fixed from evidence: an old link's override for one is dropped, not kept unused. */
const FIXED = new Set(assumptions.rows.filter((r) => (r as { fixed?: boolean }).fixed).map((r) => r.id));

export function upgrade(o: Overrides): Overrides {
  const out: Overrides = {};
  for (const [k, v] of Object.entries(o)) if (!(k in LEGACY) && !FIXED.has(k)) out[k] = v;
  for (const [k, v] of Object.entries(o)) {
    const legacy = LEGACY[k];
    if (legacy && !(legacy[0] in out)) out[legacy[0]] = v * legacy[1];
  }
  // The risk setting was a share of each result's outcomes, or 1 for its average (docs/normalization.md
  // 2.18): an old link's average is the new setting's 10; a share has no counterpart and is dropped.
  if (o.risk_quantile >= 1 && !("long_shot_value" in out)) out.long_shot_value = 10;
  delete out.risk_quantile;
  return out;
}

export { sliderEnds };

/** Only values a reader can set, each one the models can run on; values at the default are dropped
 * (src/lib/share-values.ts, the same rules the MCP server applies). */
export function sanitize(o: Overrides): Overrides {
  return sanitizeValues(assumptions as unknown as Assumptions, o);
}

/** The overrides a URL's query sets, or undefined when it sets none (then the stored ones apply). */
export function parseShare(search: string): Overrides | undefined {
  const params = new URLSearchParams(search);
  const raw: Overrides = {};
  let named = false;
  const set = params.get("set");
  const preset = PRESETS.find((p) => p.id === set);
  if (set === "default" || preset) named = true;
  if (preset) Object.assign(raw, preset.values);
  // Single values on top of a set.
  for (const pair of (params.get("values") ?? "").split(",")) {
    const i = pair.indexOf(":");
    const v = pair.slice(i + 1).trim();
    if (i > 0 && v) raw[pair.slice(0, i).trim()] = Number(v);
  }
  for (const [k, v] of params) if (k.startsWith("a.") && v.trim()) raw[k.slice(2)] = Number(v);
  const out = sanitize(upgrade(raw));
  return named || Object.keys(out).length ? out : undefined;
}

export { shortNumber };

/** The query for a state: a value set's id when it is exactly one, else the changed values. */
export const serialise = (o: Overrides, opts?: { explicitDefault?: boolean }) => serialiseValues(PRESETS, o, opts);

const STATE_PARAM = (k: string) => k === "set" || k === "values" || k === "view" || k.startsWith("a.");

/** `href` carrying the given values (by default the current ones), its other params and hash kept.
 * `explicitDefault` for a link to share: the defaults travel as `set=default` (see serialiseValues). */
export function shareUrl(href: string, o?: Overrides, opts?: { explicitDefault?: boolean }): string {
  if (!o) ensureLoaded();
  const { set, values } = serialise(o ?? current, opts);
  const add: [string, string][] = [];
  if (set) add.push(["set", set]);
  if (values) add.push(["values", values]);
  return editQuery(href, STATE_PARAM, add);
}

function stored(): Overrides {
  try {
    return sanitize(upgrade(JSON.parse(localStorage.getItem(KEY) ?? "{}")));
  } catch {
    return {};
  }
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(current));
  } catch {
    /* private mode: URL still carries the state */
  }
}

function persist() {
  save();
  history.replaceState(history.state, "", shareUrl(window.location.href, current));
}

function ensureLoaded() {
  if (!loaded && typeof window !== "undefined") {
    loaded = true;
    // A link's values become the visitor's, so they stay as the reader moves to another page.
    const fromUrl = parseShare(window.location.search);
    current = fromUrl ?? stored();
    if (fromUrl) save();
    try {
      localStorage.removeItem(OLD_VIEW_KEY);
    } catch {
      /* private mode */
    }
  }
}

/** Set one value; undefined or the default puts it back. A value no link could carry (one the models
 * can't run on) is ignored, so every state round-trips through a link. */
export function setAssumption(id: string, value: number | undefined, defaultValue: number) {
  ensureLoaded();
  const next = { ...current };
  if (value === undefined || isDefault(value, defaultValue)) delete next[id];
  else {
    const v = sanitize({ [id]: value })[id];
    if (v === undefined) return;
    next[id] = v;
  }
  current = next;
  persist();
  listeners.forEach((l) => l());
}

export function resetAssumptions() {
  ensureLoaded();
  current = {};
  persist();
  listeners.forEach((l) => l());
}

/** The ready-made sets of values (assumptions/default.json `presets`). */
export const PRESETS: { id: string; label: string; about: string; values: Overrides }[] = (assumptions as unknown as { presets?: typeof PRESETS }).presets ?? [];

/** Every slider at a set's values, the rest at the defaults. */
export function applyPreset(id: string) {
  ensureLoaded();
  current = { ...(PRESETS.find((p) => p.id === id)?.values ?? {}) };
  persist();
  listeners.forEach((l) => l());
}

/** Every set a reader can pick. The site's own values (every slider at its default) aren't one of them:
 * they're what applies until a set is picked. */
export const VALUE_SETS: { id: string; label: string; about: string }[] = PRESETS;

/** Picks a set: the site's own resets every slider. */
export const chooseSet = (id: string) => (id === "default" ? resetAssumptions() : applyPreset(id));

/** Which set the values are: "default" with none changed, a set's id when they are exactly its values,
 * else "custom". */
export const presetOf = (o: Overrides) => presetIn(PRESETS, o);

const EMPTY: Overrides = {};

/** The current overrides and their changes, outside React: the rankings start their work from here. */
export function getOverrides(): Overrides {
  ensureLoaded();
  return current;
}

export function subscribeOverrides(l: () => void): () => void {
  listeners.add(l);
  return () => void listeners.delete(l);
}

export function useOverrides(): Overrides {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => (ensureLoaded(), current),
    () => EMPTY,
  );
}
