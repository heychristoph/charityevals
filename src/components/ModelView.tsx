import type React from "react";
import { useMemo } from "react";
import { lib, rawFacts, fullRaw } from "../lib/data";
import { buildLibrary, compute, type Library } from "../engine/model";
import { useAssumptionValues } from "../lib/use-results";
import { useOverrides } from "../lib/assumption-state";
import { useLiveDistribution, withPageDistribution } from "../lib/live-distribution";
import { editsFor, useEdits } from "../lib/edit-state";
import ModelLayers from "./ModelLayers";
import { WaterfallInSlot } from "./Waterfall";
import { uncertainty } from "../engine/uncertainty";
import "./model.css";

/** A model's layered page (ModelLayers). `about`: who made the model and links to its spreadsheet, file
 * and history. `children`: the evaluation's write-up. Both come from the page as Astro slots. */
export default function ModelView({ id, bulk = false, about, children, waterfall = true }: { id: string; bulk?: boolean; about?: React.ReactNode; children?: React.ReactNode; waterfall?: boolean }) {
  // `bulk`: the browser has only a summary of this model (lib/browser-models.ts); its page loads the full
  // file before hydrating (client:model, lib/model-directive.ts).
  const raw = bulk ? fullRaw(id) : undefined;
  const model = useMemo(
    () => (raw ? buildLibrary([raw], lib.assumptions, rawFacts, [...lib.charities.values()], [...lib.owners.values()], { models: lib.models, trusted: !import.meta.env.SSR }).models.get(id)! : lib.models.get(id)!),
    [id, raw],
  );
  const av = useAssumptionValues();
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

  return (
    <div className="model-view" style={{ ["--cause" as string]: `var(--cause-${model.cause})` }}>
      <ModelLayers model={model} values={values} av={av} edits={edits} u={u} engine={engine} about={about}>
        {waterfall && <WaterfallInSlot model={model} av={av} edits={edits} engine={engine} />}
        {children}
      </ModelLayers>
    </div>
  );
}
