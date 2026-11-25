// The sentence under the name of a charity of several programmes: what $1,000 pays for in each, at its
// share of the money (src/lib/whole.ts: charitySentence), following the reader's values and edits.
import { useMemo } from "react";
import { lib } from "../lib/data";
import { useAssumptionValues } from "../lib/use-results";
import { useEdits } from "../lib/edit-state";
import { charityOf, charitySentence, programsOf } from "../lib/whole";

export default function WholeStoryLine({ id }: { id: string }) {
  const model = lib.models.get(id)!;
  const programs = useMemo(() => programsOf(model)!, [model]);
  const av = useAssumptionValues();
  const urlEdits = useEdits();
  const text = useMemo(() => charitySentence(charityOf(programs, av, urlEdits)) ?? "", [programs, av, urlEdits]);
  return <>{text.split(/\*\*(.+?)\*\*/g).map((s, i) => (i % 2 ? <b key={i}>{s}</b> : s))}</>;
}
