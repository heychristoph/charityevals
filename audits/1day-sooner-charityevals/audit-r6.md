# Audit: 1day-sooner-charityevals, round 6 (scoped verification)
Result: 1.595 years of healthy life per $1,000 (was 1.639, -2.70%). Combined range not re-run (scoped round). Verdict: fix needed.
Model-sha: 3debfe337bd49007b01a570ee84411078a2ff0d1ed53e002960b35eeb1ae4498
Rules: 0.3.12
Scope: rules never-started-weight, lives-added, animals-never-bred and never-started-prose only (inventory/rule-changes/). No source or scope re-audit.
Preflight: passes
Previous round: round 5 passed (wording fixes, 0.3.8); its one low (typed sensitivities) was later re-typed by rule mobiliser-share-30.

## Checks
- Diff vs origin/main: only the never_started mark and reworded explainer on future_dalys_averted, descendants:false on value_per_death and covid_value_per_death, the new future_animal_harm row, the dalys_direct formula, and the write-up's discount-rate bullet. The model `summary` is unchanged (it has no future sentence). Nothing else.
- verify.mts: lives_added off + never_started_weight 1 = 1.639322 = origin/main defaults. Headline 1.595162 = scripts/headlines.ts (1.59516) = lives-added.md (1.595). never-started-weight alone: -2.69% (1.639322 to 1.595300). lives-added alone: -0.0087% (1.595300 to 1.595162). animals-never-bred: none.
- Preflight: passes.

## Prose
Summary: no sentence about the future; holds. Write-up discount-rate bullet: "about 19" (script 18.91) and "about 1.2" (1.244) hold. "The years a cut counts: at one year 0.48" is stale: the script gives 0.46 at win_years_counted 1.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | prose | writeups/1day-sooner-charityevals.md "Biggest uncertainties" | Typed figure for a cut counted one year is stale. | verify.mts: win_years_counted 1 gives 0.4617. | Write "At one year the result is 0.46". | none |
