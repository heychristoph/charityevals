# Audit: rewiring-america-charityevals, round 6
Result: 0.0120 years of healthy life per 1,000 dollars at the defaults (0.012034 by scripts/headlines.ts; combined range 0.0008-0.174; down from round 5's 0.0278). Verdict: pass.
Model-sha: 524fd5fa2ab3df4900c5aea070ca533de75a8b5ceb6630d20828e1019308d37c
Scope: scoped verification after the owner's one-consumption-scale rule (docs/normalization.md 2.14): the changed row `payer_cost_per_dollar` and its readers `rebate_uov` and `credit_uov`, the summary's quoted figures, and any remaining national-accounts reading in the model and write-up. The rest of the model not re-opened.
Mechanical: audit-model 0 findings (INV-15 not applicable per the owner's rule; the peer line prints x6.06 of the climate median, not a finding); the other mechanical scripts not re-run (scoped round).
Previous round: round 5 had no findings; nothing open.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | writeups/rewiring-america-charityevals.md (lines 3, 25, 39, 41, 56) | The write-up still has the old figures: "0.028" (line 3; line 56's "lowered the result to 0.028" is history, fine), "The tonnes give about 1.4% of it" (lines 3 and 39), "about 3.5 times what it costs them" (line 25), and "more than ten times the climate median" with the peers' shares (line 41). The caller is updating it in parallel. | Defaults: headline 0.0120; tonnes' own part (ira_downstream_per_year × ira_total_adj + tools_downstream × tools_total_adj) × 1.2 = 81,188 of outcome_total 2,537,931 tco2e = 3.2%; a rebate dollar is worth 1/(0.6 × 32,723) = 5.09e-5 against the payer's 2.62e-5, i.e. 1.9 times, not 3.5. | Line 3 and 39: "about 3%"; line 25: "about twice what it costs them"; line 41: drop the comparison with the median and the peers (owner rule: no comparisons); add that the larger credits count slightly below zero. | none |
| 2 | low | presentation | facts/united_states.json `consumption_per_person_2024` explainer (not this model's file) | Its explainer still says to read it "such as the taxpayers who fund public money", which the 2.14 decision reverses for US public money. This model no longer reads it. | grep: no `@united_states.consumption_per_person_2024` read left in this model. | Reword the explainer to say US taxpayers are valued on `ce_expenditure_per_person_2024` too (mention to the owner; not a model edit). | none |

## Checks in scope
- `payer_cost_per_dollar` = mcpf 1.2 / (us_federal_payer_multiple 1.4 × ce_expenditure_per_person_2024 32,723) = 2.619e-5 ln-consumption per dollar. Units: per dollar of federal money, the same unit as the recipients' 1 / (ratio × 32,723). The payer and the recipients are now on the same survey scale; the real income difference stays in the multiple (payers 1.4× the average, rebate recipients 0.6×, credit claimants 1.3×).
- `rebate_uov`: (4.5e9 + 4.3e9) × 0.55 paid × (5.09e-5 − 2.62e-5) × uov_per_ln_consumption × discount over 5.5 years = +139,224 uov. Positive (poorer recipients than payers). Sign and formula correct; no double counting of the payer cost (it enters once, inside the bracket).
- `credit_uov`: the credit stream (3.8e9 in 2023, 8.4e9 a year after, 3 years counted) × (1/(1.3 × 32,723) = 2.351e-5 − 2.619e-5 = −2.68e-6) = −71,785 uov. Negative because the claimants (1.3×) are slightly poorer than the payers' 1.4× at the defaults; consistent with the summary's "claimed mostly by better-off households, count slightly below zero" in direction (better-off than the rebate households, and just below the payers). The 1.3 is CRS-sourced (1 to 1.8) and the payer multiple is a judgment (1 to 2); the sign flips if the multiple falls below 1.3 or the claimants' ratio exceeds 1.4. The tornado shows the multiple as the top driver (-0.0022 to 0.0227).
- `ira_transfer_uov_per_year` = (139,224 × 0.35 + (−71,785) × 0.10) × p_success × counterfactual × missing_data / 4 = 1,246 uov; uov_bridged 1,189, so the households' net loss and tonnes part is -57 uov (slightly below zero, as the summary says).
- Summary: 0.012 matches the headline 0.01203; tonnes about 3% matches (3.2%); credits slightly below zero matches; $8.8B rebates and 35% share unchanged; "more than ten times its peers" removed.
- Remaining national-accounts readings: none in the model (grep for `consumption_per_person_2024` finds only `ce_expenditure_per_person_2024` reads: the households' and tools' gains, the payer row and the two transfer rows).

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| ce_expenditure_per_person_2024 | facts/united_states.json | verified unchanged | 32,723 observed, as in earlier rounds; mcpf and us_federal_payer_multiple unchanged shared facts |

## Drivers
Top of the tornado now: `@public_funds.us_federal_payer_multiple` (judgment, the payer's side of the sign), `missing_data_discount`, the rebate recipients' ratio, advocacy's share of a won policy, `mcpf`, the rebate attribution share, the next-dollar figure. Most improving: an incidence source for who pays federal tax relative to the consumption survey's scale (narrows the multiple), and IRS data on the income of 25C and 25D claimants (settles the credits' sign).

Verdict: pass
Re-stamped (15 Nov 2026): damage beyond deaths at EPA's 0.6 in the tco2e bridge copy, read through the side-effects weight (2.5, 2.16; mechanical); summary figure updated where it changed

Re-stamped (16 Nov 2026): Reference class named in a judgment's explainer (published data on disclosure windows, rule start dates or grant-voucher periods); Rewiring America's cohort tonnes unit corrected; values unchanged. Mechanical: headline unchanged, against 1a9667aa.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 8904b83b.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 7224423b.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 1 row changed, against HEAD.
