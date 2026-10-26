// The visitor's assumption overrides: kept in the URL (so a set of values is a shareable link)
// and mirrored to localStorage (so they survive navigation). Only values that differ from the
// defaults are stored. Every island on the page subscribes to the same store.
import { useSyncExternalStore } from "react";
import type { View } from "../engine/model";

const KEY = "charityevals:assumptions";
const VIEW_KEY = "charityevals:view";
type Overrides = Record<string, number>;

let current: Overrides = {};
let view: View = "charityevals";
const listeners = new Set<() => void>();
let loaded = false;

function load(): Overrides {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const fromUrl: Overrides = {};
  for (const [k, v] of params) if (k.startsWith("a.") && Number.isFinite(Number(v))) fromUrl[k.slice(2)] = Number(v);
  if (Object.keys(fromUrl).length) return fromUrl;
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}

function loadView(): View {
  if (typeof window === "undefined") return "charityevals";
  const fromUrl = new URLSearchParams(window.location.search).get("view");
  if (fromUrl === "evaluator" || fromUrl === "charityevals") return fromUrl;
  try {
    return localStorage.getItem(VIEW_KEY) === "evaluator" ? "evaluator" : "charityevals";
  } catch {
    return "charityevals";
  }
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(current));
    localStorage.setItem(VIEW_KEY, view);
  } catch {
    /* private mode: URL still carries the state */
  }
  const url = new URL(window.location.href);
  if (view === "evaluator") url.searchParams.set("view", "evaluator");
  else url.searchParams.delete("view");
  for (const k of [...url.searchParams.keys()]) if (k.startsWith("a.")) url.searchParams.delete(k);
  for (const [k, v] of Object.entries(current)) url.searchParams.set(`a.${k}`, String(Number(v.toPrecision(6))));
  history.replaceState(null, "", url);
}

function ensureLoaded() {
  if (!loaded && typeof window !== "undefined") {
    current = load();
    view = loadView();
    loaded = true;
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

export function setView(next: View) {
  ensureLoaded();
  view = next;
  persist();
  listeners.forEach((l) => l());
}

export function useView(): View {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => (ensureLoaded(), view),
    () => "charityevals",
  );
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
