# Audit: nuclear-threat-initiative-charityevals, round 9 (verification)
Result: 0.02339 daly/$ = 23.39 years of healthy life per 1,000 dollars (combined range 1.207–453.3); cause median over the catastrophic-risk models is far lower (INV-15 passes; the summary states the reason). Verdict: pass.
Model-sha: 93276ec3615695f3aae516aafe59602b29421d67bc6c265aa71c4de49f06e356
Scope: scoped verification of the two merged changes, both present together: (a) the pandemic death-age rule and (b) `leverage_funging_adj` = 1. No source re-fetched; no new facts.
Mechanical: audit-model no high or medium (six old lows: four smaller-size ranges, two unused cost shares); normalization-audit 0 violations in every invariant (INV-15 included); `scripts/check.ts` passes; simulation-check stable (5% 0.13, 50% 1, 95% 9.15 x best guess; the single event misses 0% of draws).
Previous round: rounds 7 and 8 had no open findings (r8's low on the next-dollar note was a wording point on a shared fact, not this model).

## Checks
- (a) Pandemic ages: `bio_covid_scale_share` = COVID-scale part of `bio_deaths_per_million` (cut x smaller-size chance x deaths over the total, which includes extinction and catastrophe at the world's mix); `covid_scale_deaths_averted` applies it to the bio and field-building branches (the policy branch is zero in 2025); `covid_value_per_death` reads the four `@death_ages.covid_scale_*` shares with `@moral_weights` and `$life_value_multiplier`; `uov_bridged` values the COVID-scale deaths at it and the rest at `value_per_death`. No literal replaces a shared figure.
- (b) Funging: `leverage_funging_adj` best 1 (0.85-1.05) and its explainer says the room factor `@next_dollar.nuclear_threat_initiative` (0.42, 0.2-0.7) already asks whether large funders would give less, so one question per adjustment. `total_adj` multiplies it once; no other row reads a funder-response figure.
- Consistency: the two changes touch different rows (value per death; adjustment); nothing is counted twice. 21.05 (round 7) / 0.9 = 23.39, equal to the live headline.
- Figures: `scripts/headlines.ts` 23.3937; summary "about 24", "1 to 450" (1.207-453.3), "more than ten times its peers" with the stated reason (INV-15 sentence correct); write-up headline 24, range "about 1 to about 450", 0.1% discount "about 100" (102.8), next dollar 42%, funging 1: match.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | write-up, "Biggest uncertainties" | Stale after the funging change: the nuclear cut's swing read "7 to 194", now 6.37 to 193.6. | tornado `@catastrophe.nuclear_catastrophe_cut_per_million` | Changed to "6 to 194" (done). | none |

Also tidied: the "(Numbered 7 on its branch; renumbered at merge.)" line in audit-r8 removed.

## Sources checked
None re-fetched (no new or changed facts).

## Drivers
Nuclear catastrophe cut per dollar, years a cut counts, missing-data discount, discount rate, evidence adjustment. Unchanged.

Verdict: pass. Findings: 0 high, 0 medium, 1 low (fixed).
Model-sha: 93276ec3615695f3aae516aafe59602b29421d67bc6c265aa71c4de49f06e356
