# Audit: founders-pledge-charityevals, round 3 (scoped verification of round 2's fixes)
Result: 0.01591 uov/$ = 7.955 years of healthy life per 1,000 dollars (combined range 2.05–30.9; the model's own ranges alone 6.77–10.68); cause median 0.06519 (×122, explained in the summary: about sixteen dollars to recommended charities per dollar spent; INV-15 passes). Verdict: pass.
Model-sha: 26da1f1a2ed096d36b9426bad9b43674d0d6d0c5e3e678b221bdf2706009e6a8
Scope: unchanged (whole group, 2025, costs £9,147,150 = $12.05M); only round 2's changed rows were checked.
Mechanical: lint none shown by audit-model (no findings printed), invariants none; check.ts "all models valid"; simulation-check stable (5% 0.337×, 50% 1×, 95% 2.65× the best guess). normalization-audit not re-run (scoped round; no rule change).
Previous round (round 2): finding 1 (donor_cost_share missing other giving's new money) resolved; finding 2 (SilverLining, Save the Children) resolved; finding 3 (£7.3M) resolved; finding 4 (Bandhan, Resolve to Save Lives in lists) resolved; finding 5 (93% anchor, system change / global security wording) resolved.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | facts/meta.json fp_grants_2025_save_the_children | The Save the Children note says "Of its health and economic empowerment grantees ... these have a figure on the site's rankings", copied from the other health facts; it is fine, but the label says "from its donor-advised and pooled funds" whereas the accounts' note 10 does not state the funding channel (same wording in all fp_grants_2025_* labels, pre-existing). | Note 10 header: "material grants to institutions during the year". | Optional: drop "from its donor-advised and pooled funds" from the seven-plus labels, or say "in its audited list of grants". | 0 |

## Round 2 fixes checked
- Finding 1: `other_moved = (community_moved - hifo_granted) * other_end_charity_share * member_own_effect` (money, US$, section reach) exists; `other_giving_value = other_moved * new_money_share * @meta.prior_vs_cash * #givedirectly` reads it (one quantity); `donor_cost_share = cost_total / (cost_total + if($resource_shares, salary_sacrifice + (money_moved + other_moved) * new_money_share, 0))`. Does not read `informed_money` (INV-12 satisfied). Slider off: unchanged by this fix; slider on: tornado shows 1.768 (round 2 predicted 1.92 before the grantee readings lowered the base from 8.72 to 7.955; scaled, consistent). Explainer and write-up credit sentence now include the new money from its fund donors and members "to its recommended charities and to others".
- Finding 2: `value_destinations` weights CATF (£2,599,670) and SilverLining (£1,233,333) in the climate term, and Evidence Action, CHAI, Fika, Precision Development, Helen Keller Intl and Save the Children (£1,776,000) in the health term; denominators sum the same facts. New facts `fp_grants_2025_silverlining` (printed p. 33 in the facts; the rendered image shows the SilverLining line on the following page) and `fp_grants_2025_save_the_children` (p. 32) match the rendered note 10 (Save the Children Federation, Inc 1,776,000 on printed p. 32; CATF 2,599,670, SecureBio 1,593,960, CHAI 2,281,363, Fika 2,240,496, Precision 1,749,188 on p. 32; Evidence Action 4,248,000 on p. 31). The "left out" wording is gone; CATF's note now says "one of its two climate grantees ... (with SilverLining)". Explainer and summary updated. The result moved 8.72 to 7.955 (round 2 estimated 8.02 for Save the Children, 8.74 for SilverLining: consistent). Models `#charityevals:silverlining` and `#charityevals:save-the-children` resolve (audit-model runs).
- Finding 3: `facts/next_dollar.json founders_pledge` note now reads "(£7.3M to £9.1M, accounts note 8: expenditure less grants)".
- Finding 4: the health notes list Raising the Village, Fortification Foundation, JSI only; Bandhan and Resolve to Save Lives are gone from lists and explainer.
- Finding 5: `other_end_charity_share` is 90% (80% to 100%), anchored on £240.8M of grants less £149M to its recommendations (£92M; p. 4 quotes $196M (£149M)), with £9.3M to other donor-advised funds (Fidelity £6.24M, Daffy £1.52M, UBS Optimus £1.53M: sum £9.29M, about 10%): checked on the rendered pages. The "system change" and "global security" wording now says only that the chart gives no breakdown and the average of the rest is used. The "£125M" is gone.
- Summary and write-up: headline 8.0 (7.955), "sixteen dollars", "about a quarter", climate at CATF and SilverLining, health at six grantees, round 2 paragraph in "How this model was checked" and the 93% to 90% change are consistent. No stale 93%, 8.7, "only modelled grantee" or £7.1M wording remains in the model, the facts or the write-up. No Founders Pledge evaluator-model figure appears.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| fp_grants_2025_silverlining, _save_the_children, others | accounts note 10 (rendered pages) | verified | Figures match; Save the Children and CATF on printed p. 32. |
| hifo_granted ($196M, £149M) | accounts p. 4 | verified | Quote in the model. |
| other_end_charity_share anchor | accounts note 10 pp. 31–32 | verified | £6,238,974 + £1,524,810 + £1,532,866. |
| next_dollar founders_pledge | accounts note 8 | verified (round 2) | £7.3M figure computed in round 2. |

## Drivers
1. `@next_dollar.founders_pledge` 33% (14–71%): sourced estimate; 3.4–17.1.
2. `resource_shares` (off by default): 7.96 or 1.77 on.
3. `@meta.own_effect_share` 30% (15–45%): 4.0–11.9.
4. `$missing_data_discount` (partner branch only): 5.5–12.1.
5. The destination valuation and `other_giving_value`. A members' and partners' survey would improve the model most.

Verdict: pass (no high or medium finding).
Model-sha: 26da1f1a2ed096d36b9426bad9b43674d0d6d0c5e3e678b221bdf2706009e6a8

Re-stamped (orchestrator, 14 Nov 2026): on merge the summary's "more than ten times its peers" corrected to "about eight times" (7.9× the global-health median); no value changed.

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders (scripts/prose-numbers.ts); the receipt passed on HEAD's model, whose headline moved since its audit only through models it reads. Mechanical: headline unchanged, against HEAD.
