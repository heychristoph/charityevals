# Audit: johns-hopkins-center-for-health-security-charityevals, round 7 (scoped verification)
Result: 2.889 years of healthy life per $1,000 (was 3.205, -9.9%). Combined range not re-run (scoped round). Verdict: fix needed.
Model-sha: d70148cfc9d635984974b2507a2859aea2955fd7a8bdb57c72c6363e2afb1893
Rules: 0.3.12
Scope: rules never-started-weight, lives-added, animals-never-bred and never-started-prose only (inventory/rule-changes/). No source or scope re-audit.
Preflight: passes (only low lint "estimate with no range" lines)
Previous round: round 6 (wording re-check) passed; its headline and the rows it named are unchanged by this round's rules.

## Checks
- Diff vs origin/main: only the never_started mark and reworded explainer on future_dalys_averted, descendants:false on value_per_death and covid_value_per_death, new row future_animal_harm, dalys_direct formula, and the reworded summary sentence. Nothing else.
- verify.mts: lives_added off + never_started_weight 1 = 3.205432 = origin/main defaults (exact). Branch defaults 2.888679; scripts/headlines.ts prints 2.88868; lives-added.md "after" 2.889. never-started-weight alone: 3.205 to 2.889 (-9.9%, the future's 110,941 DALYs no longer count). lives-added: 2.889034 to 2.888679 (-0.012%). animals-never-bred: none.
- Preflight passes.

## Prose
Summary is true (future counted only where lives that never start count, 0% default). Writeup: "about 45" with the Long-run value set matches 44.69. The sentence in "What drives the result" on shares is stale: by branch the deaths are about 59% extinction-scale, 25% survivable catastrophes, 17% COVID-scale before age weighting (COVID-scale lower still after it), not "half, a third, the rest".

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | prose | writeups/johns-hopkins-center-for-health-security-charityevals.md, What drives the result | Shares of the result by pandemic type are wrong at the defaults | Computed expected deaths per branch: extinction 0.59, catastrophe 0.25, COVID-scale 0.17 | "Pandemics that end humanity's future bring about 60% of the result, catastrophes the world survives about a quarter and COVID-scale pandemics the rest." | none |
