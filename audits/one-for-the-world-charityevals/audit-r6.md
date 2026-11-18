# Audit round 6 (scoped verification): One for the World

## Scope
Only the fixes to round 5: `value_destinations` reweighted by the credit share, `moved_per_dollar` explainer, summary and write-up. Headline 7.43 to 6.50 years of healthy life per $1,000 (scripts/headlines.ts 6.50261).

## Checked
1. Mix by hand. s = 0.841 (share to GiveWell's charities), credit share c = 0.5. `money_moved` = 723,588 - 608,537 x 0.5 = 419,319, i.e. 0.5795 of caused. The formula `(s*c*V_gw + (1-s)*V_other) / (s*c + 1 - s)` weights GiveWell's charities at 0.4205/0.5795 = 72.6% and the others at 27.4%: the credited money is the full unshared dollars plus half the shared, each at its own value. No recipient is weighted twice; the inner split of the GiveWell part (GiveWell, Every.org, Against Malaria Foundation) is unchanged. Headline equals the 6.50 tested in round 5. Fully explained by the fix (-12.5%).
2. `donor_cost_share` reads only cost_total and, with `$resource_shares`, salary sacrifice, in-kind and volunteer value: no money moved. `$mobiliser_share` is read only by the `mobiliser_share` row. At 0.5 the headline is 3.25.
3. Summary and write-up agree with the model and use placeholders for caused_donations, money_moved, givewell_credit_share, moved_per_dollar; the write-up's sentence now says "less GiveWell's share"; no typed "(30% to 70%)"; no peer comparison. The "84%" and "44%" are the facts' own figures.
4. Previous findings: 1 (medium) resolved; 2 resolved (explainer uses {{row:moved_per_dollar}}, 0.55); 3 resolved.
5. Preflight: passes; only the "generated ... out of date" lines.

## Findings
| # | Severity | Row | Finding | Fix |
|---|---|---|---|---|
| 1 | low | `moved_per_dollar` label; summary | Label "Money moved it caused per dollar" now holds the credited money (0.55); the summary's "it causes about one dollar of discounted giving per dollar it spends" is the caused figure (0.95), correct but different from the row. | Relabel the row "Money moved credited to it per dollar of its own costs"; in the summary say "about {{row:moved_per_dollar}} of discounted giving credited to it per dollar it spends". |

Verdict: pass
Model-sha: a178a71e8309094069dc1945387b108f46799dcde9b975d7972530c534ae1e62
Rules: 0.2.0
