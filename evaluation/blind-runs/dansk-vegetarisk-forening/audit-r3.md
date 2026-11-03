# Audit: dansk-vegetarisk-forening-charityevals, round 3

Result: 0.7596 ced/$ = 0.2774 years of healthy life per $1,000 (joint 6.5e-10 to 2.5e+4; model's own ranges, shared figures at their best: 5.8e-4 to 26.0); cause median 10.21 (×0.027). Verdict: **pass**. No high findings remain. One medium is left: the mechanical far-below, which the summary already explains. Four low findings are wording and citation fixes.

Scope: unchanged and right. The model covers DVF's domestic policy work over 2020-2024 as a past average. The two wins are the plant-based food fund (675m DKK, 2023-2030) and its top-up and permanence (420m DKK, 2025-2030). The other wins (crop premium, action plan, research money) enter through `unmodelled_benefits_adj`. 2024 is still the latest audited year: the accounts page (vegetarisk.dk/om-dansk-vegetarisk-forening/, retrieved 2026-11-03) lists no 2025 accounts. The accounts are by nature, with no programme split. The other five programme areas (about 75%) publish no outcomes in meals or animals and are stated as partial coverage (Convention 12) in the summary, `program_spend` and the write-up.

Mechanical: lint 0 high / 1 medium (far-below) / 1 low (spread). Invariants on the model: none. check.ts `dansk-vegetarisk-forening-charityevals`: all models valid. normalization-audit (run without `--exclude`): 0 violations in every invariant, with this model included. It then crashed writing generated/normalization-audit.json, which doesn't exist in the sandbox; that is not a finding.

Previous round:
1. Undiscounted wait in the meal streams (high): **resolved**. `meals_replaced_per_dkk` now discounts the in-project meals to P/2 and the after-project meals to P(1 + m/2), as asked. `years_until_effect` is 1.7 (1.2-3), and its explainer works it as (84 × 2.1 + 70 × 1.1) / 154. The write-up says "about 1.7 years" and "each stream discounted to its middle".
2. far-below (medium): **resolved as far as it can be**. The summary gives the reason and names the rows. "About 0.28" matches the live 0.2774. The lint always emits this code below a tenth of the median, so it carries forward as finding 1.
3. `menu_persistence_multiple` reference class (medium): **resolved**. The explainer is anchored on the Danish '6 a day' canteen 5-year follow-up, now verified (four of five canteens kept or raised their intake; one went almost back to baseline). Citation details are in finding 3. The Guedes study is no longer cited, which is acceptable: one verified anchor is enough.
4. Research-funding wins (low): **resolved**. They are added to the explainer, and the row is now 0.08 (0-0.2).
5. `policy_share` wording and working (low): **resolved**. The explainer now says "a political adviser" and cites note 9. The working "about 10.2 of 44.5 million kroner ... about 0.23" reproduces: real spending 4.39 + 6.20 + 9.22 + 11.69 + 13.02 = 44.52m, and 0.45 × 10.59 + 0.16 × 33.93 = 10.19m, so 0.229.
6. 75% wording; research-pool citation (low): **resolved**. `program_spend` says 75%, and `fund_dkk_per_year` cites p. 9. The home-page URL in that explainer is a separate issue (finding 4).
7. `evidence_adj` anchors (low): **resolved**. It is split into compensation (0.85, Garnett et al. 2019, verified: no evidence of compensation at the evening meal) and reporting (0.85, fund annual report p. 38), giving a product of 0.72, about 0.7 (0.4-0.9).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | plausibility | (lint: far-below) | 0.277 is under a tenth of the animal median (10.2). Copied from the mechanical pass. The summary already gives the reason the evidence supports. The fund's money changes meals only indirectly (`meals_in_project_per_dkk`), and DVF is one of many groups behind the win (`attribution_share_shared`). The nearest peer is Good Food Fund at 0.35, also a fund-and-institutions model. | audit-model reference class. | Keep the summary's reason as written. The gap is explained, so nothing else is needed. | none |
| 2 | low | presentation | write-up, "What isn't modelled" and "How this model was checked" | Two stale lines. "Other policy wins beyond a small share for the food-crop premium and the action plan" predates round 2: the share now also covers the research-funding wins. "Two independent audits" will be three once the Round 3 line is filled. | Write-up text; `unmodelled_benefits_adj` explainer. | Write "beyond a small share (8%) for the food-crop premium, the action plan and the research-funding wins". Write "Three independent audits". Fill the Round 3 line with "Round 3 (0 high, 1 medium, 4 low): wording and citations only". | none |
| 3 | low | source | `menu_persistence_multiple` | The 5-year follow-up is cited as "Lassen, Thorsen and colleagues" with no year. Its first author is Thorsen. Lassen et al. (2004) is the original intervention paper. The explainer also doesn't show how the anchor gives 1. | Thorsen AV, Lassen AD, Tetens I, Hels O, Mikkelsen BE. Long-term sustainability of a worksite canteen intervention of serving more fruit and vegetables. Public Health Nutr 2010;13:1647-52: "four of the five canteens" kept or raised intake at 5 years. | Cite "Thorsen et al. 2010, Public Health Nutr 13:1647-52". Add the working: four of five canteens kept the change for about 5 years after the project, about 1.7 project-lengths × 0.8 ≈ 1.3. Plant-based menu changes are newer and less settled than vegetable servings, hence 1 (0-2). | none at the default |
| 4 | low | source | `fund_dkk_per_year`, `years_until_effect` | `fund_dkk_per_year` cites "Plantefonden's home page plantefonden.lbst.dk". That is the fund's old domain; the 195.5m sentence is on www.plantefonden.dk. `years_until_effect` dates the 2021 win's first grants to "November 2023" with no source. A Danske Erhverv notice of February 2024 reports the first grants (58.2m DKK) as recent, so the first grants may be closer to early 2024. That would be about 2.3 years rather than 2.1, which moves the weighted wait by about 0.1 year and the result by under 1%. | plantefonden.dk home page: "Plantefonden har i 2026 givet tilsagn om støtte for i alt 195,5 mio. kr. til 38 nye projekter". Fund tilsagnskatalog 2023 (plantefonden.lbst.dk): 36 projects, 58.2m. danskerhverv.dk, February 2024. | Cite https://www.plantefonden.dk/ (retrieved 2026-11-03). In `years_until_effect`, cite the date of the first grants from the fund's 2023 grant catalogue or its annual report 2023. If that date is 2024, recompute the weighted wait (about 1.8) and keep the range 1.2-3. | under 1% |

## Sources checked

| Row | URL | Status | Note |
|---|---|---|---|
| 2024 latest audited year | vegetarisk.dk/om-dansk-vegetarisk-forening/ | verified | newest accounts link is regnskab-2024-underskrevet.pdf; none for 2025 |
| spend_2020-2024, provisions, admin, staff pay | DVF accounts 2020, 2022, 2023, 2024 | verified (rounds 1-2) | values unchanged since then |
| policy_share working | arithmetic on the model's rows and @cpi.dnk_* | verified | 10.19 / 44.52 = 0.229 |
| menu_persistence_multiple anchor | Thorsen et al. 2010, PHN 13:1647-52 (ku.dk record; aprifel.com summary) | verified (abstract) | "four of the five canteens" kept or raised fruit and vegetable intake at 5 years; one almost went back to baseline; citation details are in finding 3 |
| evidence_adj anchor | Garnett et al. 2019, PNAS 116(42) (pubmed 31570584) | verified (abstract) | no evidence of compensation at the evening meal; vegetarian sales +40-80% when availability doubled |
| fund_dkk_per_year (2026 round) | www.plantefonden.dk | verified | "195,5 mio. kr. til 38 nye projekter"; URL in the explainer outdated (finding 4) |
| years_until_effect (first grants Nov 2023) | none cited; search: tilsagnskatalog 2023, danskerhverv.dk Feb 2024 | unsupported (date) | first round 58.2m DKK to 36 projects; date not confirmed (finding 4) |
| meals_in_project_per_dkk, project_years, counterfactual_adj, attribution, fund rows | Plantefonden Årsberetning 2025; om-plantefonden; DVF reports 2021 and 2024 | verified (rounds 1-2) | unchanged |
| @fx, @cpi, @sad_factors, @staff_pay, @aim_sads, @welfare_ranges | shared facts | not checked (shared) | |

## Drivers

1. Shared figures dominate the spread: `$chicken_vs_person` (0.0017-0.73), the fish welfare range, `@sad_factors.sads_per_meal_replaced`, `$win_years_counted`, `$daly_per_sad` and `$marginal_vs_past_average`. These are the site's figures, not findings.
2. `meals_in_project_per_dkk` (judgment 0.025, 0.0025-0.125; tornado 0.028-1.39) is the largest of the model's own inputs. Its anchor is a verified target, not a measured outcome. The best improvement is the meals served that the fund's Effektmodel will report from the 2025 projects.
3. `attribution_share_shared` (judgment 0.25, worked from staff-years; 0.11-0.55).
4. `meal_mix_vs_reference` (judgment 1, 0.5-2; the site's rule for Denmark).
5. `menu_persistence_multiple` (judgment 1, 0-2; 0.15-0.39), now anchored. `policy_share` (judgment 0.25, worked; 0.17-0.46) and `evidence_adj` (0.16-0.36) are next.

Net effect of this round's fixes: under 1%. The result stays at about 0.28 years of healthy life per $1,000.
