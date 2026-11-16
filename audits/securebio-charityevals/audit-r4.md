# Audit round 4 (scoped verification): SecureBio

Checked only the change since round 3: evidence_adj applied per branch, weighted by each branch's healthy years before adjustments (new rows dalys_per_death_value, w_ai, w_bio), with the summary and write-up figures that moved. Sourced inputs are unchanged, so no source fetching; normalization-audit is the builder's.

- Formulas, evaluated live: w_ai 53,628 + w_bio 210,830 = 264,458 = dalys_from_uov 243,506 + dalys_direct 20,952. So evidence_adj x (dalys_direct + dalys_from_uov) equals w_ai x 1.2 + w_bio x 0.75 (each branch's own adjustment on its own value); evidence_adj 0.8413 (write-up "about 0.84"). counterfactual_adj and attribution stay single values and apply to both branches alike. dalys_per_death_value (0.5) is the bridge's healthy years over the deaths' value including the non-death-loss uplift, so it carries that uplift into the weights; the COVID-scale part of w_bio uses covid_value_per_death, matching uov_bridged. Nothing unused or double counted; w_nuclear, w_pol and w_fb (in the template) are omitted here since those branches are zero in this model.
- The 1.1 claim: per dollar before adjustments, (210,830 / 0.7789) / (53,628 / 0.2211) = 1.116.
- `scripts/audit-model.ts`: no high findings, no invariant violations; seven low "estimate with no range" warnings as in round 3. `check.ts` passes. Headline 6.123 (summary and write-up 6.1); combined range 0.4001 to 93.72 (summary "0.4 to 94", write-up "about 94"); tornado discount_rate low end 63.65 (write-up "about 64"); win_years_counted 1.323 to 18.69 ("1.3 to 18.7"); bio extinction cut 3.994 to 27.42 and catastrophe cut 4.336 to 24.00 ("about 4 to 27"); next dollar 2.124 to 10.62 ("2.1 to 10.6").
- INV-15: 6.123 is 4.834x the median of 8 ranked peers (1.267), under 10x, so no outlier sentence is needed.

New findings: none.

Model-sha: 26b8c56aaaa587094f55dbf02722d5ffdb281a2bb65501fb4e7fea3888e70d13

**Verdict: pass**

Re-stamped: mechanical shared-fact change (INV-14): fb_work_years reads @catastrophe.field_work_years, the same 5 (2 to 10) every catastrophic-risk model had typed; result unchanged.
Re-stamped (15 Nov 2026): pandemic and nuclear extinction chances read the new sliders (same defaults; mechanical)

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against ee138d3d.

Re-stamped (16 Nov 2026): unit labels state per $1M (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against e8ecb2b3.

Re-stamped (16 Nov 2026): the summary's typed combined range replaced by the page's plausible range (placeholders). Mechanical: headline unchanged, against 7dbeec92.
