import { useEffect, useMemo } from "react";
import { lib, rawFacts, bulkRaw } from "../lib/data";
import { buildLibrary, headline, type ResolvedModel } from "../engine/model";
import { useAssumptionValues, useResults } from "../lib/use-results";
import { editsFor, setPageModels, useEdits } from "../lib/edit-state";
import { formatYears } from "../lib/format";

const built = new Map<string, ResolvedModel>();
/** A bulk model in full (its page loads the file before hydrating); any other model as the library has it. */
function modelOf(id: string, bulk: boolean): ResolvedModel {
  if (!bulk) return lib.models.get(id)!;
  const raw = bulkRaw(id);
  if (!raw) return lib.models.get(id)!;
  let m = built.get(id);
  if (!m) built.set(id, (m = buildLibrary([raw], lib.assumptions, rawFacts, [...lib.charities.values()], [...lib.owners.values()], { models: lib.models }).models.get(id)!));
  return m;
}

/** The page's figures outside the model: it keeps any figure a write-up quotes (<span
 * data-figure="headline" data-model="id">) in step with the model's own numbers, and on a charity
 * whose figure combines several programs it tells the edit store which models the page shows. The
 * figure itself is the model's bottom line, the first row of its tree just below, so it isn't repeated
 * under the title. */
export default function Headline({ id, bulk = false, main = false }: { id: string; bulk?: boolean; place?: string; main?: boolean }) {
  const model = useMemo(() => modelOf(id, bulk), [id, bulk]);
  const av = useAssumptionValues();
  const urlEdits = useEdits();
  const edits = useMemo(() => editsFor(model, urlEdits, lib), [model, urlEdits]);
  const value = useMemo(() => headline(lib, model, av, edits), [model, av, edits]);
  const { results } = useResults();
  const ev = main ? results.find((r) => r.charity.id === model.charity)?.evaluators.find((e) => e.owner === model.owner) : undefined;

  useEffect(() => {
    for (const el of document.querySelectorAll<HTMLElement>("[data-figure=headline]")) {
      const m = lib.models.get(el.dataset.model ?? id);
      if (!m) continue;
      const v = m.id === model.id ? value : headline(lib, m, av);
      if (Number.isFinite(v)) el.textContent = formatYears(v);
    }
  }, [value, av, id, model.id]);

  // A whole-charity page edits each programme's own model; their edits stay in the URL (edit-state).
  if (ev && ev.programs.length > 1) setPageModels(ev.programs.map((p) => p.result.model), lib);
  return null;
}
