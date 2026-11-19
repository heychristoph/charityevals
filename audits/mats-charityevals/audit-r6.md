# Audit: mats-charityevals, round 6 (scoped verification)
Result: 3.066 years of healthy life per $1,000 (was 3.120, -1.70%). Combined range not re-run (scoped round). Verdict: fix needed.
Model-sha: 97f75ede5f622d3c9f3ebfd846dc7c6063196f176ddc56d50356bac16fe5e296
Rules: 0.3.12
Scope: rules never-started-weight, lives-added, animals-never-bred and never-started-prose only (inventory/rule-changes/). No source or scope re-audit.
Preflight: passes
Previous round: round 5 passed (verification of round 4's findings), re-stamped for rule mobiliser-share-30 at 3.12.

## Checks
- Diff against origin/main: only the summary's future sentence, the `never_started` mark and reworded explainer on future_dalys_averted/future_years row, `descendants: false` on value_per_death and covid_value_per_death, the new future_animal_harm row, and the dalys_direct formula. Nothing else.
- verify.mts: "lives_added off, never_started_weight 1" = 3.119510 = origin/main defaults (equal to 7 figures). Headline now 3.066483 = `scripts/headlines.ts` (3.06648) = lives-added.md "after" (3.066). never-started-weight alone: 3.119510 to 3.066783 (-1.69%). lives-added: 3.066783 to 3.066483 (-0.0098%). animals-never-bred: none.
- Preflight passes.

## Prose
Summary: "the future lost counted only where you count lives that never start (0% by default)" is true (future_dalys_averted is now zero-weighted at the default). Write-up "How the impact happens" sentence on the future is true. Write-up "Biggest uncertainties": "The discount rate and the years a cut counts. Each moves the result several-fold." is stale. The years a cut counts does (1 year: 0.66, about 4.6x lower), but the discount rate no longer does at the defaults: 8% gives 2.67 and 0.1% gives 3.55 (-13% / +16%); the several-fold move only comes with lives that never start counted (Long-run value set: 10.6).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | prose | writeups/mats-charityevals.md, "Biggest uncertainties" | Discount rate said to move the result several-fold; at the defaults it moves it by about 15%. | verify.mts: discount 8% = 2.669, 0.1% alone = 3.548, default 3.066 | Reword to "**The years a cut counts.** Moving it to one year cuts the result about fivefold. The discount rate moves it about 15% (several-fold only with lives that never start counted: 10.6 with the Long-run value set)." | none |
