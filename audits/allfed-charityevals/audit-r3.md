# Audit: allfed-charityevals, round 3 (verification round)
Result: 0.02574 daly/$ = 25.7 years of healthy life per 1,000 dollars (combined range 0.88-750), unchanged from round 2. Verdict: fail (one medium wording finding).
Model-sha: bb1210eecbdfe5ed1e32660eb046e60b02517380b64f84ea41512a6d1e37439b
Scope: only the sentence added to `summary` in commit a6b0860 (INV-15: why the model is more than ten times its peers). No number changed.
Mechanical: audit-model lint no new findings; scripts/check.ts: all models valid. Not re-run this round (scoped): normalization-audit, simulation-check.

The sentence's mechanism is true: the model applies Rethink Priorities' typical nuclear cut (3.56e-4 per $1M, against 1.24e-4 for AI misuse) to the famine deaths after a nuclear war, as the write-up (writeups/allfed-charityevals.md) says, and the model is 16.3 times the median 1.583 of the 21 catastrophic-risk models, so a stated reason is required. The stated cause is not true: "most of them work only on AI" does not hold of the peers. Eight of the 20 peers are AI-only (CAIS, FAR, MIRI, METR, Redwood, GovAI, Epoch, IAPS); the rest are nuclear or biosecurity, and the nuclear peers are about as high as ALLFED (Ploughshares 26.0, Nuclear Threat Initiative 23, Arms Control Association 41, as the write-up itself says). The sentence also reads as if ALLFED were far above its own field.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | presentation | summary | "more than ten times its peers because most of them work only on AI" is not true of the peers and hides that ALLFED matches the nuclear models. | 8 of 20 peers AI-only; ARA 41.3, NTI 23, Ploughshares 26.0 | Say it is over ten times the cause median (about 1.6) because that median is set by AI work, while the nuclear peers (Ploughshares 26, Nuclear Threat Initiative 23, Arms Control Association 41) are about as high, all applying the same typical nuclear cut. | none |

**Verdict: fail** (the summary sentence gives a reason that does not hold; reword as in finding 1)
