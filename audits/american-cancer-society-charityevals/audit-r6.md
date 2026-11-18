# Audit round 6 (scoped verification): American Cancer Society
Result: 6.807e-6 daly/$ = 0.00681 years of healthy life per 1,000 dollars at a 100% mobiliser share (round 5: 0.006005). Verdict: pass.

## Scope
Credit rule 2.24, step 5: `adv_attribution_share_shared`, `tob_attribution_share_shared` (0.3 to 0.35 each, range 0.15-0.5 to 0.2-0.55) and the class `"credit": "delivery"` on `screen_attribution_share`. Nothing else re-audited.

## Checked
- Both advocacy denominators now hold only campaigning groups (patient groups, AHA, ALA, Truth Initiative, medical societies, state coalitions). Legislators' staff and health departments are out and sit under `mobiliser_share` via `adv_attribution_share` and `tob_attribution_share` (class `win`, formula `<x>_shared * mobiliser_share`). No co-advocate dropped; the CTFK 12% peer figure was removed from the text (rule met).
- No double cut: `adv_counterfactual_adj` and `tob_counterfactual_adj` are 1 (the years-counted step carries "would have happened anyway"), so the share alone splits credit.
- Screening class `delivery` holds: the branch values screening promotion by ACS and its co-promoters (roundtables, guidelines, community health centre partnerships); the model carries no screening-cost row for health systems or insurers, and no adopter's spending is credited, so no `mobiliser_share` is needed. Confirmed.
- `npx tsx scripts/check.ts` passes; `headlines.ts` gives 0.00680710.

## Findings
| # | Severity | Row | Finding | Fix |
|---|---|---|---|---|
| 1 | low | adv_attribution_share_shared, tob_attribution_share_shared | The new best guess (35%) and range rest only on "often the largest member"; no figure anchors the move from 30%. Allowed as a judgment, but the explainer should say that the value is a stated judgment with no count of coalition members or spending. | Add "No count of members or spending exists; a judgment." to each explainer (or cite coalition membership or lobbying-spend data if found). |
| 2 | low | screen_attribution_share_shared | Insurers are in the denominator while `screen_counterfactual_adj` already cuts "insurance changes and habit". Insurers' coverage decisions are not promotion, so they are cut twice (small effect, the share is 15%). | Name only CDC's programmes, health systems' outreach and other charities in the explainer; keep the 15% (5-30%). |

Verdict: pass
Model-sha: 1ef0a962b55c918e6e6fe3801aca4186a4d5718e1689829d560240453b4be4c6

Re-stamped (17 Nov 2026): the round's low findings fixed in wording (and, for the rainforest model, rows no longer read removed and the branch weights kept free of the mobiliser's share); no value changed at a 100% mobiliser share.
