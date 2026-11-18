# Audit: doctors-without-borders-charityevals-advocacy, round 8 (scoped verification of round 7's findings)
Result: 1.322e-4 uov/$ = 0.0661 years of healthy life per 1,000 dollars (combined range 0.0046-0.95). Verdict: pass.
Model-sha: 6d719ade6e160d0f66a46ec57fb5a885fc06b3f516f49e6240f82703597d7ef7
Rules: 0.3.4
Verdict: pass
Scope: only round 7's findings and the changes made for them.
Preflight: pass (only the out-of-date distributions line, ignored).
Previous round:
- 1 (high, adopters' delivery cost in `dndi_pdp_dalys_per_dollar`): resolved. The row is now `dndi_pdp_dalys / dndi_pdp_investment_usd`; the pro-rata delivery factor is gone, so the adopters' part is cut once, by `mobiliser_share` through `dndi_attribution_share`. Headline 0.0645 to 0.0661 (DNDi branch x1.35). The delivery cost is not netted: acceptable under rule 2.24's logged deferral ("not yet for other wins"), and a netting row would read `$uov_per_daly` outside a bridge. The omission overstates the DNDi branch by about 2% (delivery at government-spending value is about 2m of 87m DALYs), under 0.2% of the headline: low, no fix needed. The row's explainer says the netting is deferred.
- 2 (medium, `acc_attribution_share_shared` wording): resolved. The explainer now names only the campaigners and puts the buyers and makers under the mobiliser's share; value 0.25 (0.1-0.5) unchanged.
- 3 (low) and 4 (low): resolved (the awareness sentence appended; the DNDi used-share explainer reworded).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | `dndi_pdp_delivery_usd` | Now a context row feeding nothing; its explainer should say so (builder's choice whether to keep it). | Row list. | Keep as context, or remove if lint flags an unused row. | None. |

Write-up check: branch shares at the default (computed from the rows) are Access 86%, awareness 5%, DNDi 9%, matching the text. Stale typed numbers corrected by this audit: the value-of-a-healthy-year range "0.034 to 0.12" to "0.036 to 0.13" and the combined range "0.007 to 0.60" to "0.005 to 0.95" (from audit-model and its tornado). The other tornado figures match.

## Sources checked
None new.

## Drivers
Unchanged: `mobiliser_share`, `missing_data_discount`, `win_years_counted`, `acc_attribution_share_shared`, `@next_dollar.doctors_without_borders`.

Re-stamped (17 Nov 2026), rule credit-switch-co-funders: Credit rule 2.24, step 6: the co-funder switch counts co-funders only; the donors whose money a mover moves are mobilised (under mobiliser_share), so their new money leaves donor_cost_share. Only results with the switch on move. Mechanical: headline unchanged, against the tree before the rule.
