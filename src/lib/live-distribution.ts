// On a model's page: its result re-simulated at the reader's values and edits (src/engine/montecarlo.ts),
// once they stop changing for a moment, in batches that never hold the page up. Until then, and with
// everything at the defaults, the page uses the build's simulation. The latest result is shared, so every
// part of the page (the model, the figures its write-up quotes) uses the same one.
import { useEffect, useState, useSyncExternalStore } from "react";
import type { Distribution, Library, ResolvedModel } from "../engine/model";
import { simulateInSteps } from "../engine/montecarlo";

const SETTLE_MS = 300;

const latest = new Map<string, Distribution | undefined>();
const listeners = new Set<() => void>();
function publish(id: string, d: Distribution | undefined) {
  if (latest.get(id) === d) return;
  latest.set(id, d);
  listeners.forEach((l) => l());
}

/** The page's latest simulation of a model, if it has re-simulated it. */
export function usePageDistribution(id: string): Distribution | undefined {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => latest.get(id),
    () => undefined,
  );
}

/** A library whose simulation of `model` is the page's own, where there is one. */
export function withPageDistribution(lib: Library, id: string, d: Distribution | undefined): Library {
  return d ? { ...lib, distributions: { ...lib.distributions, [id]: d } } : lib;
}

export function useLiveDistribution(lib: Library, model: ResolvedModel, av: Record<string, number>, edits: Record<string, number>, active: boolean): Distribution | undefined {
  const [d, setD] = useState<Distribution | undefined>();
  useEffect(() => {
    if (!active) {
      setD(undefined);
      publish(model.id, undefined);
      return;
    }
    let cancelled = false;
    const t = setTimeout(() => {
      simulateInSteps(lib, model, av, edits, () => cancelled).then((r) => {
        if (cancelled) return;
        setD(r);
        publish(model.id, r);
      });
    }, SETTLE_MS);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [lib, model, av, edits, active]);
  return d;
}
