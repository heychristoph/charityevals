import type React from "react";
import { useMemo } from "react";
import { lib, rawFacts, bulkRaw } from "../lib/data";
import { buildLibrary, compute } from "../engine/model";
import { useAssumptionValues, useResultFor } from "../lib/use-results";
import { editsFor, useEdits } from "../lib/edit-state";
import ModelTree from "./ModelTree";
import { uncertainty } from "../engine/uncertainty";
import { flags, sensitivity } from "../engine/sensitivity";
import "./model.css";

/** `place`: the location the model covers, when it is one of several. `about`: who made the model and links to its spreadsheet, file and history, shown under the model.
 * `children`: the evaluation's write-up. Both come from the page as Astro slots. */
export default function ModelView({ id, bulk = false, place, about, children }: { id: string; bulk?: boolean; place?: string; about?: React.ReactNode; children?: React.ReactNode }) {
  // Bulk models reach the browser as one-row summaries; their page loads the full file before
  // hydrating (client:model, lib/model-directive.ts).
  const raw = bulk ? bulkRaw(id) : undefined;
  const model = useMemo(
    () => (raw ? buildLibrary([raw], lib.assumptions, rawFacts, [...lib.charities.values()], [...lib.owners.values()]).models.get(id)! : lib.models.get(id)!),
    [id, raw],
  );
  const av = useAssumptionValues();
  const r = useResultFor(model);
  // The reader's own edits to this model's numbers, from the page's URL: its inputs and facts only.
  const urlEdits = useEdits();
  const edits = useMemo(() => editsFor(model, urlEdits), [model, urlEdits]);
  const values = useMemo(() => compute(lib, model, av, edits), [model, av, edits]);
  const u = useMemo(() => uncertainty(lib, model, values, av, "charityevals", edits), [model, values, av, edits]);
  // The caveats describe the result on screen, so they follow the edits.
  const caveats = useMemo(
    () => (Object.keys(edits).length ? flags(model, sensitivity(lib, model, av, "charityevals", edits)) : r.flags),
    [model, av, edits, r.flags],
  );

  return (
    <div className="model-view" style={{ ["--cause" as string]: `var(--cause-${model.cause})` }}>
      <ModelTree model={model} place={place} values={values} edits={edits} u={u} flags={caveats}>{about}</ModelTree>

      {children}
    </div>
  );
}
