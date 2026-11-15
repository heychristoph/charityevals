# Verification round (scoped)

Result: −3.958 ced/$ = −4.354e-4 years of healthy life per $1,000, unchanged from round 3. Verdict: **pass** (no high finding; 0 medium, 0 low).
Model-sha: d85f830afb9dd8b14185413f5d68009d1f6ad874393bdefb02a5fdce57415946

Verdict: **pass**

Scope: the two explainer edits after round 3. The diff against round 3 touches only the `explainer` strings of `def_sows` and `def_cost_egg_share`; no value, range, formula or source changed. audit-model.ts: result −3.958 ced/$ and 0 findings; check.ts: all models valid.

1. `def_sows`: the "under 0.1%" claim is gone. The veal calves are now left out because the veal market supplying California is small (labelled our judgment, a few tens of thousands of calves a year), "small beside the sows'". No percentage is left to contradict the 700,000 sows, so the round 3 finding is answered.
2. `def_cost_egg_share`: now says the net egg part is taken to be about the size of the egg producers' $72 million against the roughly $300 million net, 0.25, and that because the net is built from spending and the Department of Finance notes producers' costs are not quantified, it is a judgment, not an identity. This answers the round 3 finding. The value 0.25 and the range 0.05 to 0.5 are unchanged.

| Severity | Row | Finding | Fix |
|---|---|---|---|
