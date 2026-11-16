// The visitor's assumption overrides: kept in the URL (so a set of values is a shareable link)
// and mirrored to localStorage (so they survive navigation). Only values that differ from the
// defaults are stored. Every island on the page subscribes to the same store.
//
// The URL: `?set=<value set id>` for a ready-made set, else `?values=<id>:<number>,<id>:<number>` with
// the values that differ from the defaults. A link's values win over stored ones and become the
// visitor's; unknown ids and non-numbers are dropped, numbers are clamped to the slider's ends. Links
// from before (`?a.<id>=<n>`) still read. The URL follows each change by history.replaceState: no
// history entries, and analytics records only the path (worker/events.ts drops the query).
import { useSyncExternalStore } from "react";
import assumptions from "../../assumptions/default.json";
import { pickValue } from "../engine/model";
import { byCode } from "../engine/countries";
import type { Row } from "../engine/schema";
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
  // young child); it is now in healthy years (× 116.25 ÷ 2, the default healthy-year rate), so moving
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
  return out;
}

/** A slider's ends: its own where it has them, else the value's range (a tenth to ten times a bare
 * value). `zero`: on a log scale, 0 is a stop below `low`. */
export function sliderEnds(r: Pick<Row, "value" | "slider">): { low: number; high: number; zero: boolean } {
  const best = pickValue(r.value);
  const v = typeof r.value === "object" ? r.value : { best, low: undefined, high: undefined };
  let low = r.slider?.low ?? v.low ?? best / 10;
  let high = r.slider?.high ?? v.high ?? best * 10;
  if (low === high) {
    low = best / 10;
    high = best * 10;
  }
  return { low, high, zero: low > 0 && !r.slider?.linear && !!r.slider?.zero };
}

const ROWS = new Map((assumptions.rows as unknown as Row[]).map((r) => [r.id, r]));
const isDefault = (v: number, best: number) => Math.abs(v - best) <= Math.abs(best) * 1e-9;

/** Only values a reader can set, each within its control's reach; values at the default are dropped. */
export function sanitize(o: Overrides): Overrides {
  const out: Overrides = {};
  for (const [id, raw] of Object.entries(o)) {
    const r = ROWS.get(id);
    if (!r || r.fixed || r.value === undefined || typeof raw !== "number" || !Number.isFinite(raw)) continue;
    let v = raw;
    if (r.control === "country") {
      if (v !== 0 && !byCode.has(v)) continue;
    } else if (r.format === "toggle") v = v >= 0.5 ? 1 : 0;
    else {
      const { low, high, zero } = sliderEnds(r);
      v = zero && v <= 0 ? 0 : Math.min(high, Math.max(low, v));
    }
    if (!isDefault(v, pickValue(r.value))) out[id] = v;
  }
  return out;
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

/** A number in as few characters as read back to 6 significant figures: 0.04, 7.1e-5, 840. */
export function shortNumber(v: number): string {
  const n = Number(v.toPrecision(6));
  const plain = String(n);
  const exp = n.toExponential().replace("e+", "e");
  return exp.length < plain.length ? exp : plain;
}

/** The query for a state: a value set's id when it is exactly one, else the changed values. */
export function serialise(o: Overrides): { set?: string; values?: string } {
  const preset = presetOf(o);
  if (preset === "default") return {};
  if (preset !== "custom") return { set: preset };
  return { values: Object.entries(o).map(([k, v]) => `${k}:${shortNumber(v)}`).join(",") };
}

const STATE_PARAM = (k: string) => k === "set" || k === "values" || k === "view" || k.startsWith("a.");

/** `href` carrying the given values (by default the current ones), its other params and hash kept. */
export function shareUrl(href: string, o?: Overrides): string {
  if (!o) ensureLoaded();
  const { set, values } = serialise(o ?? current);
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

/** Set one value, within the slider's ends (as a link would carry it); undefined or the default puts it back. */
export function setAssumption(id: string, value: number | undefined, defaultValue: number) {
  ensureLoaded();
  const next = { ...current };
  const v = value === undefined || isDefault(value, defaultValue) ? undefined : sanitize({ [id]: value })[id];
  if (v === undefined) delete next[id];
  else next[id] = v;
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

/** Which set the values are: "default" with none changed, a set's id when they are exactly its values,
 * else "custom". */
export function presetOf(o: Overrides): string {
  const keys = Object.keys(o);
  if (!keys.length) return "default";
  const same = (a: number, b: number) => Math.abs(a - b) <= Math.abs(b) * 1e-6;
  return PRESETS.find((p) => Object.keys(p.values).length === keys.length && keys.every((k) => k in p.values && same(o[k], p.values[k])))?.id ?? "custom";
}

const EMPTY: Overrides = {};

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
