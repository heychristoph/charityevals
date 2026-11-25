# The story: a model in plain words

Every model's file has a `story` (variants inherit it). The page leads with it: one sentence under the
name, the questions a reader can change, and "How it's worked out", a short chain from the money to the
result. Every number in it is an expression over the model's rows, computed live, so it never
contradicts the model; `npm run check` proves the chain at the defaults, at the low and high ends of
every value, and at random draws, for each location and the whole charity.

## Format

```json
"story": {
  "sentence": "$1,000 buys **{1000 * units / cost} <things>**. ...",
  "questions": { "<row id>": "<a plain question about that number?>" },
  "steps": [
    { "total": "1000|$", "text": "given to <charity>" },
    { "op": "÷ {cost / units|$}", "text": "per <thing>" },
    { "total": "1000 * units / cost", "text": "<things>" },
    { "op": "× {result / (1000 * units / cost)}", "text": "years of healthy life for each" },
    { "total": "result|y", "text": "years of healthy life per $1,000" }
  ]
}
```

- `{expr|fmt}`: an expression over row ids and `result` (the bottom line in years of healthy life per
  $1,000, after every step of ours); `|$` money, `|%` a share, `|y` years of healthy life, none a count.
- **Steps** alternate totals and operations. The first total is `1000|$`, the last `result|y`. Each
  `op` is one operator (`×`, `÷`, `+`, `−`) and one `{number}`; applied to the total above, the ops
  give the next total exactly. Write ops as ratios of totals (`× {used / distributed|%}`), never a
  rate row alone, so the chain holds when locations are averaged.
- 3–6 totals: money, the thing the money buys, what it changes (people reached, animals spared, tonnes
  avoided, policies won), the good done in the model's own terms, then years of healthy life. Each a
  thing a reader can picture. The step into years of healthy life may read `result` directly
  ("years of healthy life for each").
- Where several channels add up (several programmes, lives and income), split the last total with `+`
  ops, one per channel the reader would name, each a share of `result`.

## Words

- The sentence: one or two short statements a reader understands in five seconds; the thing bought and
  the thing changed, in bold. No ranges: the page shows the range beside it.
- Plain words, no jargon or acronyms (no SADs, DALYs, WELLBYs, units of value, counterfactual,
  leverage): say what they stand for ("hens out of cages", "a year of a hen's life in a cage").
- Never a comparison with other charities, medians or peers; never a median or best guess as "the"
  result.
- **Questions**: the 3–7 inputs that move the result most (the tornado of `scripts/audit-model.ts`),
  each a question a reader can answer with a number ("How many of the nets get used?"). Key every row
  id the question stands for in any location (rows with `_2` suffixes and the like), the same text.
  Only inputs, rows that pass one along, and ranged rows.

## A charity of several programmes

Its page splits $1,000 across the programmes by their share of the money, each opening into its own
story. Its sentence is `story` in `charities/<id>.json`: one sentence, the numbers live from the
programmes' models as `{<line id>: <expression>|<format>}`, where the expression reads that programme's
rows, `result` and `share` (its share of the money). Per $1,000 given to the charity, multiply by
`share` (`**{smc: 1000 * share * children / cost} children**`); "every **{line: cost / deaths|$}** saves
a life" needs no share. Name the largest programmes; leave out one that only gives a fraction of a thing.
`npx tsx scripts/story.ts --charity <id> [--sentence "<text>"]` shows the programmes and checks it.
