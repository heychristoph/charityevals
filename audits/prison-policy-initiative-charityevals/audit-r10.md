# Audit round 10 (scoped verification): Prison Policy Initiative
Result: 0.0546 years of healthy life per 1,000 dollars at the defaults (was 0.05399). Verdict: pass.
Model-sha: de7e1cf0e0ecfbc631f668cc666d4b97af9b021f7b6412f8b934e9391709c3ef
Rules: 0.3.6

## Scope
Credit rule 2.24, step 5 (re-judged shares): st_attribution_share_shared (4% to 5%, range 1.5% to 12%) and ger_attribution_share_shared (50% to 60%, range 35% to 85%). Both used shares already carry credit win and read mobiliser_share. Nothing else re-audited.

## Checked
- Denominators: legislators, the bills' sponsors and the legislatures (who pass and carry out the laws) are out. State laws: Worth Rises and local coalitions stay in, with PPI's data and testimony as support. Gerrymandering: PPI's national campaign, model bills and the state groups that campaigned for them stay in. No co-advocate dropped.
- Anchor: no published accounting of the campaigns' resources; both explainers state the rest on who led and who supported (Worth Rises led the state campaigns; PPI started and led the Prisoners of the Census campaign), so the moves are small and in the right direction (up, as a party left the denominator).
- Double cut: st_counterfactual_adj is 1 (the laws coming some day sit in the years a win counts); nothing cuts the legislators a second time.
- Class: state laws and districting rules are laws others carry out, so win is right. st_attribution_share and ger_attribution_share are used in st_total_adj and ger_total_adj.
- Headline 0.0546 reproduced; check.ts: all models valid. Text rules: no peer comparison, no "effective altruism".

## Findings
| # | Severity | Row | Finding | Fix |
|---|---|---|---|---|
| 1 | low | st_attribution_share_shared | The rise (4% to 5%) is a judgment with no data behind the size of the step. | None needed; the explainer says it is a judgment among campaigning groups. |

No high or medium findings.

Verdict: pass
Model-sha: de7e1cf0e0ecfbc631f668cc666d4b97af9b021f7b6412f8b934e9391709c3ef

Re-stamped (17 Nov 2026), rule mobiliser-share-30: typed results in the model's text made placeholders or recomputed at the 30% mobiliser share, and wrong prose placeholders corrected; no row changes. Mechanical: headline 0.05462 → 0.01639 (−70%), 22 rows changed, against bc9e3979.
