# Audit: ploughshares-fund-charityevals, round 7 (verification round)
Result: 0.02424 daly/$ = 24.24 years of healthy life per 1,000 dollars (combined range 1.27-462; model's own ranges 3.07-93.0), unchanged; cause median 1.576 (x15.4). Verdict: pass.
Model-sha: e25fefe15d86a9abbcfa53ddf750216ad35d59e714ea255baca5fadad1f02722
Scope: only the change in the `summary` line (the file's only change against main): "It is several times its peers (the cause's median) because" became "It is more than ten times its peers because" (15.4 against the median 1.576; it was 4.6 against 5.255 in round 6, before the MATS model lowered the median). The reason that follows (most peers work only on AI; Rethink's typical nuclear project averts far more deaths per dollar than a typical AI project) is unchanged and true, and "it is close to the Nuclear Threat Initiative" is untouched.
Mechanical: audit-model lint clean; 7 low "estimate with no range" findings on point inputs (ai_smaller_per_year, ai_smaller_deaths, ai_cost_share, bio_cost_share, nuclear_smaller_per_year, nuclear_smaller_deaths, pol_cost_share), unrelated to the change. normalization-audit INV-15 checked 247 models, 0 violations (generated/ restored with git checkout). Not re-run this round (scoped): check.ts, simulation-check. No file in generated/ was changed.

Previous round (round 6): no open finding carried over.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | model `summary` | "Far more deaths per dollar" is true for the presets (nuclear extinction cut 0.0002023 against AI misalignment 7.712e-7 per $1 million, 262 times; catastrophe cut 0.0003559 against 2.742e-7, 1,298 times). | facts/catastrophe.json best values | None needed. | none |

## Sources checked
None re-fetched (scoped round; no row or source changed). facts/catastrophe.json presets read: nuclear_extinction_cut_per_million best 0.0002023, nuclear_catastrophe_cut_per_million 0.0003559, ai_extinction_cut_per_million 7.712e-7, ai_catastrophe_cut_per_million 2.742e-7.

**Verdict: pass** (no high or medium finding; one low note, no change needed)
