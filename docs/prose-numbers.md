# Numbers in prose

A write-up or a model's text states the model's own figures as placeholders, not typed numbers. The site renders each from the computed model at the default assumptions, formatted as the page formats it, so the prose can't go stale when the model changes.

Where: `writeups/<model id>.md`, and a model's `summary`, section `explainer`s, row `explainer`s and `range.note`s.

| Placeholder | Renders |
| --- | --- |
| `{{result}}` | the headline, years of healthy life per $1,000 (our view) |
| `{{result:evaluator}}` | the headline in the evaluator view |
| `{{result:<model-id>}}` | another model's headline (our view) |
| `{{row:<row_id>}}` | a row's value in its format (`35%`, `$4.5`, `1,200`) |
| `{{row:<row_id>:evaluator}}` | the same, evaluator view |
| `{{low}}`, `{{high}}`, `{{range}}` | the headline's plausible range: one end, or `low – high` |
| `{{low:<row_id>}}`, `{{high:<row_id>}}`, `{{range:<row_id>}}` | a row's range (an input's low and high, a calculated row's `range`) |

- A placeholder renders with the values of the model whose file holds the text: a variant reads its parent's inherited sentence as the parent wrote it.
- In a write-up, `{{result}}` (and `{{result:<id>}}`) render as the figure span the page keeps in step with the reader's sliders. Don't type `<span data-figure>` by hand.
- Keep a source's own figure typed when the sentence quotes it as theirs ("the trial found 35%"), and so for years, counts in other units and section numbers.
- A placeholder that names nothing (unknown kind, row or model; a range on a row without one) fails the build and `npm run check`.

`npm run check` also fails a write-up that types the headline (`checkProseNumbers` in `src/engine/prose-numbers.ts`; medium for a model's own text). `npx tsx scripts/prose-numbers.ts [ids]` lists typed numbers that match a figure, and `--apply` replaces the safe ones: exact matches to one figure, not attributed to a source, and only in a row's own explainer for that row. A model's text is part of its audit fingerprint: `--apply` prints the `scripts/restamp.ts` command for the audited models it changed (no value moves).
