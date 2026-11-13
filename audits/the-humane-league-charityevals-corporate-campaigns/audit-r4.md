# Audit: the-humane-league-charityevals-corporate-campaigns, round 4
Result: 3.190 ced/$ = 3.509e-4 years of healthy life per 1,000 dollars (combined range 1.277e-5–0.009645); cause median 7.416e-4 (×0.47). Verdict: pass.
Model-sha: 25523b9397dca6b17e44638680f43a3047f520457790e20550957d73a1e1ece3
Scope: unchanged since round 3 (scoped verification after the merge into main): the cage-free accountability line, US and global, $5,108,314 of THL's 2025 programme spending; the model and write-up were not re-audited for sources.
Mechanical: lint 0 high / 0 medium / 0 low (audit-model "Findings (0)" on this model, on other-programmes and on owa-grants), invariants none, normalization-audit not re-run (not requested), check.ts "all models valid", simulation-check stable (5% 0.184, 50% 1, 95% 3.36 × best guess; same as round 3).
Previous round: round 3: the model's own findings were none; its two lows (owa_coordination_cost section differing between other-programmes and grants; write-up not listing L5/L6) concern the other models and the write-up wording, no effect on this result. Round 2 and round 1: H1 (ACE blocks labelled US/global the right way round: ace_cost_us 3,372,446, ace_cost_global 1,604,910, program_spend = their sum × CPI 2025/2024), H2 (UK subtraction: uk_switches_in_count {0.1M, 0.4M, 1.85M} identical here and in other-programmes; animals_per_year = hens_switched − UK − alliance = 5.46M), H3 (drawn_with: no uk_cage_free rows left here), M1 (acc_counterfactual_share 0.3, {0.1, 0.3, 0.6} identical in this model and other-programmes), M2 (no training branch here), L1–L8: all resolved; thl_acc_share {0.7, 0.87, 0.95} is the same here and in other-programmes; overhead_ratio = total_expenses / program_expenses in all three models; the ACE costs are unchanged.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | mobilisation_spend | A typed {1.0M, 2.73M, 3.5M} still copies other-programmes' computed vol_spend (2,725,819); today the two agree (rounding only), so no drift yet. | vol_spend = max(rest_spend − owa_coordination_cost − new_spend, 0); owa_coordination_cost unchanged at {0.75M, 1.5M, 3M}. | Re-check at each audit of THL's models until a row can be read across models (accepted, as in round 2 L7). | none today |

## Double counting across the three THL models (check 3)
- Same companies' commitments credited twice: none. This line credits THL's own switches (animals_per_year 5.46M hens, after taking out THL UK's 0.4M and the alliance's owaacc_hens) at companies THL pressed. The alliance's wins abroad sit in other-programmes (owaacc_/owanew_/owabcc_ branches) and in owa-grants, and the formula for owa_resources is identical in both (members' staff × pay factor + coordination cost × the same factor, with owa_attribution_share on the same pool); UK switches are taken out here at 0.4M and credited in the grants model through ukacc_coalition_share (a deliberate approximation, unchanged). THL's four new commitments are only in other-programmes' new_ branch.
- Credit shares above THL's own: no. This line's share is thl_acc_share × program_spend / acc_resources (0.87 × 5.108M / 10.12M = 0.439); other-programmes' vol_ branch uses the same numerator logic, thl_acc_share × vol_spend / (vol_spend + ace_line_spend + volunteer_value), i.e. the same denominator pool, so the two together are at most thl_acc_share (0.439 + 0.2345 = 0.674 ≤ 0.87); the alliance credit is a separate pool (0.0832 + 0.0976 in other-programmes and grants).
- Money: this line 5,108,314 + other-programmes' program_spend (program_expenses − grants_paid − ace_line_spend) + grants_paid reproduce the Form 990 programme expenses; the three models' default results are unchanged since round 3 (SADs per dollar: this 2.883, other-programmes 3.964, grants 3.443).
- facts/next_dollar.json: @next_dollar.the_humane_league 0.51 (0.3–0.8), still read here; nothing else read changed the result.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| (all) | | not re-audited | Scoped round: sources verified in rounds 1–3 and unchanged in the model. |

## Drivers
Chicken vs person, years a won reform counts, missing-data discount, DALYs per SAD (the site's sliders), then acc_counterfactual_share (judgment 0.1–0.6, reason stated), @next_dollar.the_humane_league and the shared cage-to-aviary SADs. Peers: ×0.47 of the animal-welfare median, in line with the other two THL models (4.9e-4, 5.3e-4); no gap needing a reason.
