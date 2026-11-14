# Audit round 3 (scoped verification): Johns Hopkins Center for Health Security

Checked only the change since round 2 (evidence adjustment applied per branch, weighted by each branch's healthy years) and its wording.

| Check | Result |
|---|---|
| Formulas | dalys_per_death_value = dalys_from_uov / (deaths valued without the non-death factor), so w_bio and w_fb (each with the COVID-scale share at COVID's age mix, matching covid_scale_deaths_averted) convert each branch's deaths to its healthy years including the non-death factor. w_bio + w_fb = dalys_from_uov + bio_future_dalys + fb_future_dalys = dalys_from_uov + dalys_direct, since the ai, nuclear and policy branches are zero (ai_cost_share, nuclear_cost_share, pol_wins all 0). Weighting by w therefore gives the same total as applying each branch's own adjustment to its own value; counterfactual_adj, attribution and the other factors are single values on the total, as before. |
| bio_evidence_adj | Spending weights inside one branch (CORI 0.34 at 0.4, the rest of the field work at 0.9) over bio_cost_share: correct. Training keeps policy_evidence_adj, as the old spending blend implied. Nothing unused or double counted. |
| audit-model.ts | No high findings, no invariant violations; 7 low (point inputs without ranges, unchanged: zero-valued branch rows). |
| Figures | Headline 7.521 (write-up 7.5); combined range 0.4234 to 133.6 (0.4 to 134); evidence 0.7268 (write-up about 0.73); 0.1% discount 103.4 (about 103); per-dollar-cut tornado 3.84 to 44.3 (4 to 44); years counted 1.625 to 22.96 (1.6 to 23). All match. |
| INV-15 wording | Model is 5.94 times the median 1.267 of 8 ranked catastrophic-risk peers; "about six times its peers' median" is correct. Under the 10x line, so no stated reason is required; "because most of them work only on AI" holds (CAIS, FAR, MIRI, METR, Redwood, GovAI AI-only; NTI nuclear; SecureBio bio and AI). Write-up wording matches. |

New findings: none. (Not a finding: w_bio + w_fb equals the total only while the ai, nuclear and policy branches are zero, which holds here.)

Model-sha: f0dc99fa873659a3647468f603ae1d7c49ef35d88dd60ac31a5b473c67c12118

**Verdict: pass**

Re-stamped: mechanical shared-fact change (INV-14): fb_work_years reads @catastrophe.field_work_years, the same 5 (2 to 10) every catastrophic-risk model had typed; result unchanged.
