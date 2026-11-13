import type React from "react";
import { useMemo } from "react";
import { lib, rawFacts, bulkRaw } from "../lib/data";
import { buildLibrary, compute, plausibleRange, type Library } from "../engine/model";
import { useAssumptionValues, useResultFor } from "../lib/use-results";
import { useOverrides } from "../lib/assumption-state";
import { useLiveDistribution, withPageDistribution } from "../lib/live-distribution";
import { editsFor, useEdits } from "../lib/edit-state";
import ModelTree from "./ModelTree";
import { WaterfallInSlot } from "./Waterfall";
import { uncertainty } from "../engine/uncertainty";
import { flags, sensitivity } from "../engine/sensitivity";
import { coverageFlag } from "../engine/ranking";
import "./model.css";

/** `place`: the location the model covers, when it is one of several. `about`: who made the model and links to its spreadsheet, file and history, shown under the model.
 * `children`: the evaluation's write-up. Both come from the page as Astro slots. */
export default function ModelView({ id, bulk = false, place, about, children, waterfall = true }: { id: string; bulk?: boolean; place?: string; about?: React.ReactNode; children?: React.ReactNode; waterfall?: boolean }) {
  // Bulk models reach the browser as one-row summaries; their page loads the full file before
  // hydrating (client:model, lib/model-directive.ts).
  const raw = bulk ? bulkRaw(id) : undefined;
  const model = useMemo(
    () => (raw ? buildLibrary([raw], lib.assumptions, rawFacts, [...lib.charities.values()], [...lib.owners.values()], { models: lib.models }).models.get(id)! : lib.models.get(id)!),
    [id, raw],
  );
  const av = useAssumptionValues();
  const r = useResultFor(model);
  // The reader's own edits to this model's numbers, from the page's URL: its inputs and facts only.
  const urlEdits = useEdits();
  const edits = useMemo(() => editsFor(model, urlEdits, lib), [model, urlEdits]);
  const values = useMemo(() => compute(lib, model, av, edits), [model, av, edits]);
  const u = useMemo(() => uncertainty(lib, model, values, av, "charityevals", edits), [model, values, av, edits]);
  // Once the reader changes a value or edits a number, the model is simulated again at theirs; the page's
  // own library carries that simulation, so the rankings elsewhere on the page keep the build's.
  const overrides = useOverrides();
  const live = useLiveDistribution(lib, model, av, edits, Object.keys(edits).length > 0 || Object.keys(overrides).length > 0);
  const engine: Library = useMemo(() => withPageDistribution(lib, model.id, live), [live, model.id]);
  // The caveats describe the result on screen, so they follow the edits and the page's simulation.
  const caveats = useMemo(() => {
    if (!Object.keys(edits).length && !live) return r.flags;
    const s = sensitivity(engine, model, av, "charityevals", edits);
    const range = plausibleRange(engine, model, s.central, av) ?? { low: s.jointLow, high: s.jointHigh };
    return [...flags(model, { ...s, jointLow: range.low, jointHigh: range.high }), ...[coverageFlag(lib, model)].filter((f) => !!f)];
  }, [model, av, edits, r.flags, live, engine]);

  return (
    <div className="model-view" style={{ ["--cause" as string]: `var(--cause-${model.cause})` }}>
      <ModelTree model={model} place={place} values={values} edits={edits} u={u} flags={caveats} engine={engine}>{about}</ModelTree>
      {waterfall && <WaterfallInSlot model={model} av={av} edits={edits} engine={engine} />}

      {children}
    </div>
  );
}
