# Audit: aspca-charityevals, round 4

Result: 1.244 ced/$ = 1.368e-4 years of healthy life per $1,000 (combined range 1.59e-5 – 1.18e-3); cause median 4.87e-4 (×0.28). Verdict: pass.
Model-sha: a39724b129abb487eb832c6bdef98f9a730778bd6f80ff19c085cc492d9c0708

Scope: unchanged from round 3 (every companion-animal programme in the 2025 accounts, `program_spend` $307.7m). This round checks only round 3's five findings and whether the changes (commit 02718f9) brought new problems. The diff of the model against the previous commit touches only the rows named below.

Mechanical: lint 0 high / 0 medium / 1 low (spread: 4,211× joint on the model's own ranges, which the summary names). check.ts: all models valid. simulation-check: stable (5% 0.175, 50% 1.0, 95% 4.5 × best guess). normalization-audit not re-run (no unit, row or shared-figure changes beyond the formulas below). generated/ untouched.

Where the result comes from: 1.12e-4 → 1.368e-4 (+22%). Expected from the changes: the food, disaster, poison-control and grant terms now take 0.9 instead of 0.5 (×1.8 on those four terms, about 16% of the owners' WELLBYs before), and poison control's donor share rises from 0.054 to about 0.29 because the fees are compared with the cost after overhead (that term has about 5× more credit), against a 2.7% higher cost. Added up (food +46, disaster +18, grants +9, poison control +84 WELLBYs on 638, then the cost), that is about +21%, so the move is explained. Poison control is now about 12% of the owners' WELLBYs against 1.5% before; that is the intended effect of the corrected base (fees pay about 71% of its cost, so what donors' money buys there is the call's gain times the full cost's credit), not an error. The veterinary term (84% of the result before) is unchanged in form.

Previous round:
1. `own_share_eased` applied to all five owner terms (medium): **resolved**. It now multiplies only the veterinary term in `wellbys_people`; the other four share the new `own_share_burdened_need` (0.9, 0.7–1, judgment), whose explainer gives the reason (they come when the owner is already in trouble). The `own_share_eased` explainer says it is for the clinics' owners only. Checked in the formula: the grouping is right (the vet term outside the bracket, food, disaster owners, poison control and grants inside it).
2. `pets_per_household` format (medium): **resolved**: `number`, unit `pets`.
3. `cost_total` and the donor shares' base (low): **resolved**: `program_spend * overhead_ratio - netted_fees`; `apc_donor_share` and `clinic_donor_share` divide by the direct cost times `overhead_ratio`, as asked. `netted_fees`' explainer does not yet say donors also pay the overhead on fee-funded work (finding 2, low).
4. Sources (low): **resolved in form**: both rows now have a `source`; the links return 403 to automated fetches (finding 2).
5. Write-up sentence (low): **resolved**: "one owner per household of about 1.6 pets, with disaster meals taken off the food count" and the clinics-only share are in it. One new wording issue (finding 1).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | write-up, "How this model was checked" | The last sentence says two sources gained links "checked by a verification round" before this file existed; it states an outcome the text could not know. "Biggest uncertainties" (line 23) names the owners' gain and the share eased but not the new `own_share_burdened_need`, and the poison-control branch, now about 12% of the owners' WELLBYs, is not named as a branch resting on the fees' credit rule. | writeups/aspca-charityevals.md lines 23 and 34. | Write "after it ... and two sources gained links" and add round 4's outcome only after this file exists; add one clause to the uncertainties: "how many owners of the food, disaster, poison-control and grant help faced a burden (our judgment), and how much of poison control's cost the fees carry". | None. |
| 2 | low | source | `vet_counterfactual_adj`, `own_burden_gap_sd`, `netted_fees` | (a) The two new `source` blocks use a URL that fails automated fetches (AVMA 403; doi.org redirects to Wiley, 403), and both quote only a title, so the 28% and 74% in the explainer are not in a quote. Round 2 verified Spitznagel on PubMed and the survey figures through secondary coverage. (b) `netted_fees`' explainer lacks the sentence round 3 asked for: donors also pay the overhead on fee-funded work, which is why the donor shares divide by the overhead-loaded cost. | The two rows. | (a) Use https://pubmed.ncbi.nlm.nih.gov/28870976/ for Spitznagel (its abstract is fetchable) and https://trace.tennessee.edu/utk_smalpubs/17 for the AVCC report with the "nearly 28%" and 74% quote. (b) Add the sentence. | None. |
| 3 | low | sensitivity | (lint: spread) | The joint spread of the model's own ranges is 4,211×; the summary names it. The widest are `own_years_burdened` (0.03–0.3 year), the gap in SD and `$missing_data_discount`. The new `own_share_burdened_need` is not in the top twelve of the tornado. | audit-model. | Narrow `own_years_burdened` with a duration for owners at risk (a study of time to treatment after an unaffordable estimate) when one exists. | None at the defaults. |

## Double counting
- The two shares ask different questions of different populations: `own_share_eased` the burden among the clinics' owners, `own_share_burdened_need` among owners in trouble, each multiplying disjoint terms. Neither repeats the counterfactual, the owned share or `food_disaster_share`.
- Fees: the cost is net of them and the donor shares carry the same base (overhead-loaded direct cost), so a branch's outcome is over its full cost; no overlap.
- Food and disaster: unchanged, disaster meals come off the food count and the households divide by `pets_per_household`.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| vet_counterfactual_adj | https://www.avma.org/javma-news/2019-02-15/report-outlines-barriers-accessing-veterinary-care-possible-solutions | unreachable (403) | Figures verified in round 2 from secondary coverage; title quoted (finding 2). |
| own_burden_gap_sd | https://doi.org/10.1136/vr.104295 | unreachable (403 at Wiley); verified in round 2 on PubMed | Reference class as described (finding 2). |
| own_share_burdened_need | none | judgment | Ranged (0.7–1), reason stated. |

## Drivers
1. `$missing_data_discount` (shared): 2.7e-5 – 2.7e-4.
2. `own_years_burdened` (judgment): 4.1e-5 – 4.1e-4.
3. `own_burden_gap_sd` (judgment): 4.2e-5 – 2.5e-4.
4. `$daly_per_wellby`: 1.0e-4 – 5.8e-4.
5. `own_share_eased` and `vet_counterfactual_adj` (judgments): each about 9e-5 – 1.9e-4.

Verdict: pass. Findings: 0 high, 0 medium, 3 low.

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.
Re-stamped (15 Nov 2026): compliance costs of won rules (normalization.md 2.21): the policy branch's explainer names the analyses checked, none of which gives a cost; no value changed.

Re-stamped (16 Nov 2026): pre-audit cleanup: shared facts read (US layers, preemption chance, market leakage, evaluator side effects), reference classes named, ranges widened where evidence is thin; headline unchanged. Mechanical: headline unchanged, against 9d3d36e4.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 1b0eb29e.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 1 row changed, against 7224423b.
