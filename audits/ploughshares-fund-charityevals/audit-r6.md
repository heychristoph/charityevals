# Audit: ploughshares-fund-charityevals, round 6 (verification round)
Result: 0.02424 daly/$ = 24.24 years of healthy life per 1,000 dollars (combined range 1.27-462; model's own ranges 3.07-93.0); cause median 5.255 (x4.6). Verdict: pass.
Model-sha: 9b6e4f67614a1597099155f8c6210bb7204d64ff6ace04f912a68151f2ac2081
Scope: only the change since round 5 (headline 25.98 -> 24.24): rows grl_aca, grl_fas, grl_ucs, grl_bas, grl_dollars, grl_cost_share, grl_uov, grl_dalys; the changed formulas of nuclear_cost_share, gr_share_of_nuclear, cost_shares_total and outcome_total; gr_relevant_share 0.86 -> 0.84; the summary and write-up. Programmes and year (fiscal 2025, all of them) unchanged.
Mechanical: audit-model lint 0 high / 0 medium / 7 low (the same estimate-without-range lows as before, none from the new rows); invariants none; scripts/check.ts all models valid; normalization-audit (run in full): no violation for this model; summaries + simulation-check: stable (5% 0.148, 50% 1, 95% 9.8 x best guess, single events miss 0% of draws). `git checkout -- generated` not run: generated/distributions.json and usage.json were already modified before this audit (the caller's work) and the audit changed nothing else there.
Previous round: round 5 had no findings.

Checks made:
- Amounts: Schedule I of the Form 990 FY2025 (IRS XML, object 202620979349300102, extracted text) lists Arms Control Association 178,000, Bulletin of the Atomic Scientists 80,000, Federation of American Scientists 90,000, Union of Concerned Scientists 120,000: all four match; sum 468,000. ICAN is not a Schedule I recipient (only the 10,000 capstone grant, in the fellowship branch); Back from the Brink 15,000 is listed and stays in the typical-dollar grants; Global Zero is not listed.
- Bookkeeping: nuclear_cost_share = 0.8776 after taking grl_cost_share (468,000 / 5.679M = 8.2%) out; gr_share_of_nuclear numerator (3,119,923 - 100,000 - 468,000 = 2,551,923) matches the explainer; cost_shares_total = 1.000. No dollar counts twice.
- gr_relevant_share: justice grants 80+60+15+8 = about 0.16M of 2.55M = 6.3%; half-counted diplomacy about 0.5M x 0.5 = 9.8%; 1 - 0.063 - 0.098 = 0.84. Re-derivation right (the RECA grant now sits in the UCS dollars).
- Credit: grl_dalys = grl_uov x gr_attribution_share_shared / $uov_per_daly, added after total_adj. Skipping the second missing-data step, evidence and the grantee-side counterfactuals is right: each grantee's ranked figure already holds its own missing_data_adj 0.5, evidence_adj, counterfactual_adj, room factor, and the one-consistent-way rule values a destination at the ranked figure. The block that is multiplied by total_adj and by (1 + unmodelled_benefits + harm shares) is correctly not applied to it. Overhead is paid in cost_total, so the ratio treats the grants like every other branch. Ploughshares' own @next_dollar factor (0.53, room x use x run about Ploughshares' funders and its own use of an extra dollar) on top of the grantee's own next-dollar factor answers a different question and is right. grl is about 3% of outcome_total (about 8% of the cost), which explains the 6.7% drop.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | presentation | write-up, adjustments table | The row "Share of the spending counted" still shows 0.86 for the grants; the model now has 0.84. | writeups/ploughshares-fund-charityevals.md line 27 reads `0.86 | 0.75 | 1`; gr_relevant_share best = 0.84 (range 0.75-0.95 unchanged). | Change the 0.86 to 0.84 in the table. | none on the result |
| 2 | low | double-counting | gr_attribution_share_shared (in grl_dalys) | Ploughshares' 0.95 "unpaid volunteers' and partners' time" share is applied on top of grantees that already hold their own attribution_share_shared (ACA 0.9, and the others' weighted shares), which is the same question; the row's own explainer says the grantee figure holds the credit factors. | grl_dalys formula; gr_attribution_share_shared explainer ("only volunteers' and partners' unpaid time inside the funded projects"); ACA attribution_share_shared 0.75-0.9-1. | Drop the factor from grl_dalys (use grl_uov / $uov_per_daly), or state in the explainer why Ploughshares' share is a separate question from the grantee's. | about +0.15% (5% of a 3% part) |
| 3 | low | structure | grl_dalys | Division by uov_bridged is fragile (NaN if the model's deaths averted are ever 0, e.g. at an extreme slider); the same conversion is `/ $uov_per_daly`. | formula `grl_uov * gr_attribution_share_shared * dalys_from_uov / uov_bridged`; dalys_from_uov = uov_bridged / $uov_per_daly. | Use `grl_uov * gr_attribution_share_shared / $uov_per_daly`. | none at the defaults |
| 4 | low | presentation | summary | "It is more than ten times its peers" no longer holds on the cause's median (x4.6, 24.2 vs 5.3; it was x4.9 before); the reason given (most peers are AI-only) is still right. | audit-model: "median of 23 catastrophic-risk models: 5.255 (this model x4.613)". | Reword to "about five times the median of its peers" (keep the reason and the Nuclear Threat Initiative comparison). | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| grl_aca, grl_fas, grl_ucs, grl_bas | https://apps.irs.gov/pub/epostcard/990/xml/2026/2026_TEOS_XML_04A.zip (Schedule I) | verified | CashGrantAmt 178,000 / 90,000 / 120,000 / 80,000 against the recipient names in the extracted XML (the zip itself not re-downloaded; the extracted text of object 202620979349300102 was used); purposes match the explainers |
| gr_relevant_share explainer | same, Schedule I | verified | justice and half-counted grants sum as stated |

## Drivers
Unchanged: @catastrophe.nuclear_catastrophe_cut_per_million (estimate, Rethink; 5.6-210), win_years_counted (judgment), missing_data_discount (judgment), nuclear_catastrophe_death_share (judgment), discount_rate (judgment); then Ploughshares' next-dollar factor (estimate, 0.25-0.9). The four valued grants depend on the grantees' own models (the Bulletin's model has uncommitted edits in this worktree). What would improve the model most is a sourced cut-per-million figure for nuclear work.

**Verdict: pass**

Re-stamped: low and medium findings fixed after the round (wording in the model and write-up only, no formula or number changed).
