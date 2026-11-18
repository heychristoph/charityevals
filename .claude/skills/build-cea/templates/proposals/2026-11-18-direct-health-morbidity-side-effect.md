# direct-health: mark `morbidity_value_ratio` as a side effect

**What.** In `templates/direct-health.json` (via `scripts/gen-templates.py`), give the row
`morbidity_value_ratio` `"side_effect": "added"`, as `unmodelled_benefits_adj` already has.

**Why.** normalization.md 2.16 marks GiveWell's supplemental intervention-level items, morbidity
included, so "Side effects count … %" moves them. `uov_morbidity` adds illness as a share of the
deaths' and income's value beside the other supplementary shares, but the template leaves its ratio
unmarked. At 0% the other shares drop and illness stays. Today 10 models mark a morbidity ratio and 20
don't. Among them are doctors-without-borders-charityevals, dogs-trust-charityevals-rabies,
american-red-cross-charityevals-measles, americares-charityevals and
american-red-cross-charityevals-biomedical. The GiveWell kangaroo-care imports (ansh, both r.i.c.e.
sheets) don't mark their morbidity or developmental rows either. first-embrace-charityevals marks its
`morbidity_value_ratio`.

**Diff.**

```
   {"id": "morbidity_value_ratio", ..., "formula": "@givewell_common.malaria_morbidity",
-   "explainer": "..."}
+   "explainer": "...", "side_effect": "added"}
```

Then mark the same row in every direct-health model that has an unmarked `morbidity_value_ratio`. Mark
the GiveWell imports' morbidity and developmental adjustment rows the same way. At the default weight
(100%) no headline moves, so `scripts/restamp.ts --note "2.16: morbidity marked as a side effect"`
re-stamps the audited ones.
