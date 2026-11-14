# Audit round 3 (verification): transparency-international-charityevals

Scope: the five round-2 fixes only. `audit-model.ts` and `check.ts` run clean (all models valid; no schema or lint finding on this model). Result 0.0336 years of healthy life per $1,000 (unchanged in kind; the median of 91 global-health models is 0.0686).

## Checks

| Fix | Check | Result |
|---|---|---|
| 1. eu_corruption_cost_share | Best 0.016, low 0.009, high 0.05. Note reports the Commission's EUR 120 billion as a floor, EPRS Scenarios 2 and 3 (1.1-1.5%, 1.3-1.7%) as floors and Scenario 1 (4.9-6.3%) as the optimistic benchmark, with pp. 42-43 and 46. Matches what round 2 verified in the EPRS PDF and the Commission text. 1.6% is in the model summary, the pol_eu_cost_share explainer and the write-up. | ok |
| 2. People governed | pol_global_rules 4 (observed; UNCAC political-finance resolution, Financing for Development, climate-talks disclosure rule, Human Rights Council resolution all found in the annual report text), pol_eu_rules 3 (1-3), eu_population 452,000,000 (Eurostat, 1 January 2026), pol_people_per_national_change 9M (3M-30M, lognormal). Formula: 3 x 452M + (63 - 3 - 4) x 9M = 1.86 billion, per change 29.5M, EU share 72.9%: all recomputed from the engine and equal the explainers (about 29 million, 73%). No double counting: global resolutions carry no people; EU rules and national changes are separate counts of the 63; national changes in member states are valued at the world rate (a stated, tiny understatement of the EU share). | ok |
| 3. Write-up | Driver list, "more than halved", round-2 note, policy 94%, EU 73% consistent with the model. | ok |
| 4. Resources | Commission report, EPRS study and 2024 statements present; EPRS in the write-up Sources. | ok |
| 5. Beneficiaries | At the defaults the engine gives policy 3,686 / advice centres 34 / legal 207 of 3,927 uov: 93.9% / 0.9% / 5.3%. EU part of policy = 0.729 x 4.80e-5 / 5.13e-5 = 68.3% of the branch = 64.1% of the result; plus legal 5.3% = 69.4% EU. World 30.6%. The note says 64% / 5% / 31%, and OURS and the model agree. Shares sum to 1.0000 and the 27 member-state weights are by population. | ok |

## Findings

None at high or medium. One note, not a finding: the legal submissions' 5% sit wholly in the EU split although the note calls them "mostly in Europe"; at 5% of the result the effect on the country split is under one point.

Verdict: pass

Model-sha: d8796e52466b0bbef241a0a7acd614d26669ab3c29aa781fa74fb363101d70c4
