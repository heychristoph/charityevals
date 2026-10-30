// The visitor's assumption overrides: kept in the URL (so a set of values is a shareable link)
// and mirrored to localStorage (so they survive navigation). Only values that differ from the
// defaults are stored. Every island on the page subscribes to the same store.
import { useSyncExternalStore } from "react";

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
export const LEGACY: Record<string, [string, number]> = { animal_moral_weight: ["chicken_vs_person", 0.332] };

export function upgrade(o: Overrides): Overrides {
  const out: Overrides = {};
  for (const [k, v] of Object.entries(o)) if (!(k in LEGACY)) out[k] = v;
  for (const [k, v] of Object.entries(o)) {
    const legacy = LEGACY[k];
    if (legacy && !(legacy[0] in out)) out[legacy[0]] = v * legacy[1];
  }
  return out;
}

function load(): Overrides {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const fromUrl: Overrides = {};
  for (const [k, v] of params) if (k.startsWith("a.") && Number.isFinite(Number(v))) fromUrl[k.slice(2)] = Number(v);
  if (Object.keys(fromUrl).length) return upgrade(fromUrl);
  try {
    return upgrade(JSON.parse(localStorage.getItem(KEY) ?? "{}"));
  } catch {
    return {};
  }
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(current));
  } catch {
    /* private mode: URL still carries the state */
  }
  const url = new URL(window.location.href);
  url.searchParams.delete("view");
  for (const k of [...url.searchParams.keys()]) if (k.startsWith("a.")) url.searchParams.delete(k);
  for (const [k, v] of Object.entries(current)) url.searchParams.set(`a.${k}`, String(Number(v.toPrecision(6))));
  history.replaceState(null, "", url);
}

function ensureLoaded() {
  if (!loaded && typeof window !== "undefined") {
    current = load();
    loaded = true;
    try {
      localStorage.removeItem(OLD_VIEW_KEY);
    } catch {
      /* private mode */
    }
  }
}

export function setAssumption(id: string, value: number | undefined, defaultValue: number) {
  ensureLoaded();
  const next = { ...current };
  if (value === undefined || Math.abs(value - defaultValue) <= Math.abs(defaultValue) * 1e-9) delete next[id];
  else next[id] = value;
  current = next;
  persist();
  listeners.forEach((l) => l());
}

export function resetAssumptions() {
  current = {};
  persist();
  listeners.forEach((l) => l());
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
