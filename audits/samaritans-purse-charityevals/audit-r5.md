# Audit: samaritans-purse-charityevals, round 5
Result: 5.069e-5 daly/$ = 0.05069 years of healthy life per 1,000 dollars (combined range 0.0122–0.2103); cause median 0.1100 (×0.46). Verdict: pass.
Model-sha: 1f8b8b807c54415d902701e1fe8a4df0569614e1567acb5af1d9eef8fce117ae
Scope: verification of rule 2 (no evidence discount on goods valued at cost; deaths averted keep theirs) in the relief branch, the shoeboxes and material aid, plus rules 1's status for shoeboxes, US rebuilding and material aid; the summary and write-up sentences. Not a full re-audit.
Mechanical: lint 0 findings (3 warn/info on range width, unchanged); invariants none; check.ts all valid; simulation-check stable (5% 0.553, 50% 1, 95% 1.8 x best); normalization-audit not rerun (coordinator ran it: none).
Previous round: round 4 had no findings (pass); nothing to resolve.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | normalization | us_evidence_adj | Rule 2 applied to the food, shoeboxes and material aid, but US disaster relief (goods, labour and grants valued at cost) still carries a 0.95 (0.8-1) evidence judgment, and its own explainer says these "need no effect study". Same reasoning as occ_/aid_evidence_adj, left inconsistent. | Row explainer; scratch copy with formula 1 gives 0.05071 | Set us_evidence_adj to formula `1`, explainer "1: goods, labour and grants valued at what they are worth need no effect study; the share reaching households is in us_value_share." (adjust the row id if the share row is named otherwise); the Adjustments write-up sentence then lists US relief too. | +0.04% (0.05069 → 0.05071) |
| 2 | low | presentation | write-up Adjustments | "Goods valued at their worth (food, shoeboxes, material aid) take no evidence step" is correct for the model as it stands but will need "US relief" once finding 1 is fixed. | write-up line 36 | Add with finding 1. | none |

Checked and correct:
- relief_uov = deaths × value_per_death × relief_total_adj + food ln gain × uov_per_ln × relief_goods_total_adj; relief_goods_total_adj is relief_total_adj without relief_evidence_adj only (no other factor dropped); relief_evidence_adj (0.85, 0.7-1) now on deaths only, with reason, anchor (World Vision, CARE) and range.
- Food's attribution 0.8 kept: right. The food per person is South Sudan's 40M lb over 302,000 people, which includes WFP commodities (contributed food only $6.6M; WFP a grantor), while people reached come from Samaritan's Purse's own spending, so the value counted includes others' resources. The 0.95 default does not apply; the row has a reason and a 0.6-1 range. A note: the same 0.8 is shared with deaths, consistent.
- relief_uov_unadjusted, relief_deaths_share_unadj, relief_dalys_unadjusted: correct, weights only. evidence_adj weights relief as share × 0.85 + (1 − share), others unchanged; evidence_adj and total_adj are reading-only and not on the result's path (result is the sum of the branch UoV).
- relief_dalys_direct still uses relief_total_adj, but dalys_illness_per_person is 0, so no effect.
- Rule 1 status: relief food already t × ln(1 + v/(b t)) with t = years_exposed (0.33). Shoeboxes (ln(1 + box value / a year's consumption)): contents last beyond a year (clothes, tools, toys), left over a year: right. US rebuilding: spread over us_years (3, 1-10) by annuity: right. Material aid (goods, cash, buildings, one year): right.
- occ_ and aid_evidence_adj → formula 1: valuation doubts sit in occ_inkind_equivalence (0.15-0.6) and aid_value_share (0.3-0.7); both have ranges. occ_ and aid_dalys_unadjusted still divide by their total adj (fine).
- Summary: "about half the site's global-health median" matches ×0.46; write-up headline "about half the middle" same; stated before → after 0.04715 → 0.05069 matches r4's 4.715e-5 and the live result.

## Sources checked
Not in scope (no source changed).

## Drivers
Top swings: missing_data_discount (judgment, thin), uov_per_daly (shared), occ_inkind_equivalence (judgment, 0.15-0.6), uov_per_ln_consumption (shared), occ_recipient_consumption_share (judgment). Most improving: a priced local food basket for food_price_per_kg and a count of people reached by relief outside South Sudan.

Verdict: pass
Model-sha: 1f8b8b807c54415d902701e1fe8a4df0569614e1567acb5af1d9eef8fce117ae
