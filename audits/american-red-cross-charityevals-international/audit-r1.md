# Audit: american-red-cross-charityevals-international, round 1 (verification of the rule-1/2/4 changes)
Result: 6.863e-5 daly/$ = 0.06863 years of healthy life per 1,000 dollars (combined range 0.01429-0.3295); cause median 0.1100 (x0.62). Verdict: pass.
Model-sha: 94e26134f403077738affd625e160b4e18db2ddb27a941c0dc582eb9c89d89f8
Scope: the six ln_gain_* rows, the two-branch split of the adjustments (deaths and illness; goods), the bridges and outcome rows that read them, the summary and the write-up sentences on this model. Rule 3 (livelihoods) does not apply: the model has no livelihood branch.
Mechanical: lint 0 findings, invariants none, check.ts all valid, simulation-check 5% 0.462 / 50% 1 / 95% 2.19 x best guess, normalization-audit not rerun (coordinator: none)
Previous round: none kept (grandfathered); this round checks only the changes.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | summary | The summary says the result is "far below the site's global-health median"; it is 0.0686 against a median of 0.1100, x0.62: below, not far below. | audit-model prints "median of 60 global-health models: 0.1100 (this model x0.6237)". | Change "far below" to "below" (keep the reason clause). | none |

Checks with no finding:
- ln_gain_* (6 rows): years_exposed * ln(1 + v*cpi*ppp / (baseline*years_exposed)) is the rule-1 form (goods used over t, consumption of those months t*baseline). It uses the same years_exposed (0.25, 0.1-0.5) as deaths_averted_per_person, so both branches share one period. Explainers match the formulas; the weighted ln_gain_per_person keeps its weights and now states the period.
- Split: deaths_total_adj = deaths_evidence_adj x counterfactual x deaths_attribution x implementation x leverage x wait x missing; goods_total_adj is the same without evidence and with goods_attribution_share. No factor dropped or applied twice. uov_bridged = deaths_uov_unadjusted x deaths_total_adj + goods_uov_unadjusted x goods_total_adj; dalys_direct (0, illness) carries deaths_total_adj; outcome_total no longer multiplies total_adj, only (1 + unmodelled_benefits_adj), once. The two unadjusted UoV rows sum to the old unadjusted bridge.
- New judgment rows: deaths_evidence_adj 0.85 (0.7-1), reason and anchor present (World Vision's relief_evidence_adj is 0.85, 0.7-1, checked in its model; CARE). goods_attribution_share 0.95 (0.85-1), reason (other donors' money pays for its own goods; only unpaid volunteers are behind the value) and anchor (CARE 0.95) present. deaths_attribution_share keeps 0.7/0.85/0.95 with a rewritten explainer.
- Reading-only averages (evidence_adj, attribution_share_shared, attribution_share, total_adj): the weights deaths_part_dalys_unadjusted and goods_part_dalys_unadjusted are each branch's unadjusted DALYs (deaths bridge plus illness; goods bridge), so the weighting is right. No row on the result's path reads them (formula grep: only each other); labelled "for reading only".
- Labels (rule 4): wellbys_bridged lost "(before adjustments)" (it is 0, correct); the *_unadjusted rows keep it and are before adjustments; dalys_direct says "after its adjustments"; uov_bridged "after each branch's adjustments"; deaths_averted_per_person and dalys_illness_per_person keep "(before adjustments)" and are.
- Size of the move (0.0732 -> 0.0686, -6%): goods evidence 0.95 -> 1 (+5%) and attribution 0.85 -> 0.95 (+12%) raise the goods branch; the monthly-use log gain lowers it (the larger term); deaths evidence 0.95 -> 0.85 (-10%) lowers the small deaths branch. The stated before -> after is right.
- Summary: no figures, so nothing else to match; need not mention the monthly use.
- Write-up: this model's 0.069 matches 0.06863. Gift-weighted by spend (domestic $721M at 0.004533, measles $4M at 0.3585, this model $45M at 0.0686): (3.27 + 1.43 + 3.09) / 770 = 0.0101, so 0.010 holds; shares are about 40% abroad, 18% measles, 42% domestic, so "about two fifths from the relief abroad and a fifth from the small measles programme" holds. The domestic 0.005 and its added "counted over the weeks they are used" belong to the domestic model and were not checked further.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| none | | | No new sourced inputs; new judgment rows are anchored to peer rows (World Vision, CARE) in the repository. |

## Drivers
Missing-data discount (0.1-1: 0.014-0.137), uov_per_daly, counterfactual_adj (0.4-0.85), affected_consumption_share and intl_value_share. About 89% of the uncertainty is judgment. years_exposed now moves both deaths and goods (0.052-0.080). Best improvement: a published count of people reached, replacing the judged value per person.

Verdict: pass
Model-sha: 94e26134f403077738affd625e160b4e18db2ddb27a941c0dc582eb9c89d89f8
