import { gloss } from "../lib/glossary";
import InfoTip from "./InfoTip";

/** Text with an info tip after the first use of each special term (src/lib/glossary.ts) not in `seen`.
 * The term and its tip share an unbreakable span, so the tip never wraps onto a line of its own. Clicks
 * on the tip stay inside it, so a tip in a clickable row doesn't also toggle the row. */
export default function Glossed({ text, seen }: { text: string; seen?: Set<string> }) {
  return (
    <>
      {gloss(text, seen).map((p, i) =>
        typeof p === "string" ? p : (
          <span key={i} className="nobr">
            {p.text}{" "}
            <span className="gloss-tip" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
              <InfoTip label={`Meaning of ${p.text}`}>{p.term.meaning}</InfoTip>
            </span>
          </span>
        ),
      )}
    </>
  );
}
