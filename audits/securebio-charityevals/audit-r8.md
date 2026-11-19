# Audit: securebio-charityevals, round 8 (scoped verification)
Result: 2.181 years of healthy life per $1,000 (was 2.320, -6.0%). Combined range not re-run (scoped round). Verdict: fix needed.
Model-sha: 408ae7012096cb5ac488bac2e8ef589402f6b699a07d53c49e8224f0923cdeca
Rules: 0.3.13
Scope: rules never-started-weight, lives-added, never-started-prose and never-started-branches only (inventory/rule-changes/). No source or scope re-audit.
Preflight: passes
Previous round: round 7 passed (at 2.157, rules 0.3.12); rule never-started-branches has since moved the headline +1.1% to 2.181.

## Checks
- Diff against origin/main: only the `never_started` marks on the five `*_future_dalys` rows, the reworded explainer on future_dalys_if_extinct, `descendants: false` on value_per_death and covid_value_per_death, the new future_animal_harm row, the dalys_direct formula, and the summary's future sentence. Nothing else.
- verify.mts: "lives_added off, never_started_weight 1" = 2.320204 = origin/main defaults (6+ figures). Headline now 2.181023 = scripts/headlines.ts (2.18102) = never-started-branches.md "after" (2.181).
- Weights at 0: w_ai 89135.68 and w_bio 190000.85 equal the deaths-only weights exactly (ai_deaths_averted * value_per_death * dalys_per_death_value; bio_deaths_averted * COVID-mixed value * dalys_per_death_value; bio's deaths-only is the model's own w_bio without its future term, since bio mixes in covid_value_per_death). No future in the weights. (The brief's plain `deaths_averted` ratio differs for this model only because of that mix.)
- sens.mts: years counted 1 -> 0.4711, 20 -> 6.658; Rethink pandemic catastrophe cut x0.1 -> 1.613, x10 -> 7.859 (extinction cut alone 1.628 to 7.715); next dollar 0.17 -> 0.7567, 0.85 -> 3.783; Long-run value set (0.1%, weight 1) -> 20.75. Shares of the pandemic branch by value: extinction 49%, survivable catastrophes 37%, COVID-scale 14%.

## Prose
Summary holds. Write-up: future sentence, "about 21", 0.47 to 6.7, 1.6 to 7.9, 0.76 to 3.8 and "half" for the pandemics that end humanity's future (49%) all hold. Stale: "Catastrophes the world survives bring about two-fifths" in "What drives the result"; it is 37% (3.3 points from 40%), COVID-scale is 14%.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | prose | writeups/securebio-charityevals.md, "What drives the result" | Survivable catastrophes' share of the pandemic work stated as two-fifths; it is 37%. | Recomputed from bio_*_cut_per_million, bio_*_per_year, deaths and value_per_death / covid_value_per_death: 49% / 37% / 14% | Replace "Catastrophes the world survives bring about two-fifths and COVID-scale pandemics the rest." with "Catastrophes the world survives bring about a little over a third and COVID-scale pandemics about a seventh." | none |
