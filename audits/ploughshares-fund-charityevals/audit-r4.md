# Audit: ploughshares-fund-charityevals, round 4 (verification)
Result: 0.02598 daly/$ = 26.0 years of healthy life per 1,000 dollars (combined range 1.22–555; model's own ranges 2.17–102), unchanged from round 3. Verdict: pass.
Model-sha: 2d44cede649f5f2dce26c3c5585a8e4fddb39fb14dd552fccd855bc3322e20a8
Scope: scoped to the wording change since round 3 (`git diff 659a741 6eb8f71 -- models/catastrophic-risk/ploughshares-fund-charityevals.json writeups/ploughshares-fund-charityevals.md`): the summary drops "(no grantee has a model on the site yet)", and the nuclear_cost_share explainer and the write-up now say that the one grantee with a model on the site, the Arms Control Association ($178,000 from Ploughshares in fiscal 2025, Schedule I), asks the same questions with the same figures, so its grant is worth the same within 2% and is valued with the rest. Only that claim was checked; no number in the model changed, so nothing else was re-audited.
Mechanical: audit-model lint 0/0/7 (the same seven structural zeros accepted in round 2; the "Point inputs without a range" line is unchanged); result identical to round 3 (25.98); the Model-sha differs from round 3 only because of the wording.
Previous round (round 3): no findings, nothing to carry over.

## The "within 2%" claim
Figures read from the two models (evaluated with the engine at the defaults):

| Question | Ploughshares (grants branch) | Arms Control Association |
|---|---|---|
| Typical project's effect applies | gr_evidence_adj 0.8 | evidence_adj 0.8 |
| Other organisations would have done the work now | gr_cf_other_orgs 0.7 | counterfactual_adj 0.7 |
| Other funders would have paid | gr_cf_other_funders 0.8 | room factor 0.8 in @next_dollar.arms_control_association (0.8 room × 0.7 use × 1.0 run = 0.56) |
| Share of resources behind the work | gr_attribution_share_shared 0.95 | attribution_share_shared 0.9 |
| Share of the money aimed at the risk | gr_relevant_share 0.86 (portfolio average) | nuclear_cost_share 0.91 plus bio_cost_share 0.02 (other_cost_share 0.07 counts for nothing) |

The figures agree on the first three questions. The attribution differs (0.95 against 0.9), so "the same figures" is slightly loose; it is the only difference and the Association's explainer already says why (Ploughshares' 0.95 is an average over 46 grantees, the Association's is counted from its own volunteers and outside experts).

Value of a Ploughshares grant dollar, as a share of a typical nuclear dollar (before the missing-data step, which is 0.5 on both paths):
- Ploughshares' model: 0.86 × 0.8 × (0.7 × 0.8) × 0.95 = 0.366.
- The Association's model: the bio dollar is worth 0.24 of a nuclear dollar (per unit of cost share the Association's model values biological work at about 120,000 healthy years and nuclear work at about 492,000, deaths averted and future years together), so the money counts as 0.91 + 0.02 × 0.24 = 0.915 nuclear-dollar equivalents; × 0.8 × 0.7 × 0.9 × 0.8 (room) = 0.369.
- Ratio 0.369 / 0.366 = 1.008: the Association's grant is worth 0.8% more, which is within 2% (counting the nuclear 0.91 alone it is 0.367, +0.2%). The two offset each other: the Association's per-dollar adjustments are 5% lower (0.403 against 0.426, from 0.9 against 0.95 attribution) and its share of the grant aimed at the risk is 6% higher (0.915 against 0.86). The claim holds at the defaults; "within 2%" is a statement about the best estimates (gr_relevant_share at 0.75 or 0.95 instead of 0.86 would move the gap to about +16% or -9%), which is what the text says.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| none | | | | | | | |

## Sources checked
| Row | Source | Status | Note |
|---|---|---|---|
| nuclear_cost_share explainer, write-up "How the model works" | models/catastrophic-risk/arms-control-association-charityevals.json, facts/next_dollar.json arms_control_association | verified | 0.8, 0.7, 0.9, room 0.8; $178,000 is the figure the Association's model gives for Ploughshares' two grants (its Schedule I) |
| summary | the model | verified | the removed parenthesis no longer applies |

**Verdict: pass** (no findings)
Model-sha: 2d44cede649f5f2dce26c3c5585a8e4fddb39fb14dd552fccd855bc3322e20a8

Re-stamped: mechanical shared-fact change (INV-14): fb_work_years reads @catastrophe.field_work_years, the same 5 (2 to 10) every catastrophic-risk model had typed; result unchanged.
