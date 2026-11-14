# Audit: brennan-center-for-justice-charityevals, round 5 (verification of the round-4 lows)
Result: 0.064 years of healthy life per 1,000 dollars, unchanged from round 4; audit-model.ts: 0 findings; check.ts: all models valid. Scope: the one explainer edit since round 4.
Model-sha: c11ec9d728f8b01319bb3555cfdd16cbdce644c212a5b608ca83b6aee2655342

| # | Round-4 low | Status | Check |
|---|---|---|---|
| 1 | tar_amici_resource_share: "roughly four times the parties' words" overstated (the 8,000-word limit is a ceiling) | resolved | The diff is one explainer string only (no value, range, formula or id change). It now reads "up to about four times the parties' words (a ceiling: briefs often run shorter than the limit)", consistent with the 5-35% range and the result 0.064. |
| 2 | Summary's "several hundredfold" vs the wider plausible range (about 5,000,000x in check.ts, with judgment rows lacking published ranges) | accepted | The summary says "the model's own ranges", which is what audit-model.ts reports; check.ts itself warns about the wider range. No change needed. |

Verdict: pass
