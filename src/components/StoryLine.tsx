// The sentence under a charity's name on a page whose model has a story (`story.sentence`): live numbers
// in plain words, following the reader's values and edits.
import { useMemo } from "react";
import { lib } from "../lib/data";
import { useAssumptionValues } from "../lib/use-results";
import { editsFor, useEdits } from "../lib/edit-state";
import { useFigure } from "../lib/metric";
import { fillStory } from "../lib/story";
import { wholeOf } from "../lib/whole";
import { modelOf } from "./Headline";

export default function StoryLine({ id, bulk = false }: { id: string; bulk?: boolean }) {
  const model = useMemo(() => modelOf(id, bulk), [id, bulk]);
  const av = useAssumptionValues();
  const urlEdits = useEdits();
  const edits = useMemo(() => editsFor(model, urlEdits, lib), [model, urlEdits]);
  const fig = useFigure(lib, av);
  const text = useMemo(() => {
    if (!model.story) return "";
    // The whole charity, every location weighted by its money, as on the rest of the page.
    const w = wholeOf(model, av, edits);
    return fillStory(model.story.sentence, w.values, w.result, (x) => fig.format(x));
  }, [model, av, edits, fig]);
  return <>{text.split(/\*\*(.+?)\*\*/g).map((s, i) => (i % 2 ? <b key={i}>{s}</b> : s))}</>;
}
