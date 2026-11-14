# Audit: longview-philanthropy-charityevals, round 2 (scoped verification)
Result: 0.002471 uov/$ = 1.235 years of healthy life per 1,000 dollars (round 1: 1.61; combined range 0.069-22.0; the model's own ranges alone 0.97-1.59); cause median 5.26 (x0.235). Verdict: pass.
Model-sha: d0d5b04ac485168fedccb849d8587ef11e9728451744f56f099dbe03faf285b2
Scope: the nine round 1 findings and the changes made for them (model, facts/meta.json longview_2025_*, facts/next_dollar.json longview_philanthropy, write-up). No source or scope re-audit.
Mechanical: audit-model lint 0 findings, no invariant; check.ts "all models valid"; normalization-audit no violation for this model (generated/ restored).

## Round 1 findings
| # | Status | Check |
|---|---|---|
| 1 | fixed | Shares are now a hand-done blend, in the explainers. Arithmetic checked: itemised classified $5.72M (5.07 + 0.55 + 0.10), 89/10/2% (88.6/9.6/1.7); rest 55 - 5.72 = 49.3; AI (5.07 + 0.80 x 49.3)/55 = 0.809; nuclear (0.55 + 0.12 x 49.3)/55 = 0.118; bio (0.10 + 0.03 x 49.3)/55 = 0.029. Facts set to 0.81 (0.70-0.90), 0.12, 0.03. Write-up says two nuclear grantmakers in 2025 (four going into 2026), drops biosecurity as a pointer. Nuclear -25%, as predicted. |
| 2 | fixed (sound alternative) | `advised_share_changed` = `@meta.own_effect_share`; `money_moved` = advised_money x that; `informed_money_value` = money_moved x shifted_dollar_value x evidence_adj x missing_data_adj; read in `moved_value` beside fund money at the net value. Explainer gives why no advised money is new. Effektiv Spenden's advised gifts moved to the same rule (round 5 of that model). Both models now read the same share, so the comparability gap is closed. |
| 3 | fixed | Explainer drops grantee backfire ("already in their figures"); range -5% to +20%, best 5%. |
| 4 | fixed | `intra_group_share` best 0.05 (0-0.5); explainer adds note 2's GBP 2,054 and Schedule F "general support". |
| 5 | fixed | ECF explainer says donations stand in for 2025 grants; NWPF-through-GWWC sits in `advised_money` (explainer says so); states GWWC pays grantees on Longview's recommendations (quote not re-fetched this round). |
| 6 | fixed | METR share 0.0341 = 173,000 / 5,069,388 (UPenn and Rethink grants out); Digital Sentience Fund named in the write-up; `value_destinations` explainer says digital sentience and Rethink's grant drop out at the average of the rest. |
| 7 | fixed | The four GBP rows have format "number". |
| 8 | fixed | Write-up's fund-money bullet replaced by the unmeasured-results and won-reforms line. |
| 9 | fixed | "$11.1M" removed; note says "18 organisations supported ... its fund page". |

## New findings
1. low, summary and write-up: the summary says "about 1.25 years" but the result is 1.235 (rounds to 1.2); the write-up's static headline reads 1.3. Fix: "about 1.2" in the summary and 1.2 in the write-up span.
2. low, facts/meta.json `longview_2025_share_nuclear` and `_bio`: the ranges in the fact values (nuclear high 0.20, bio high 0.08) differ from the blend's stated ends (0.19, 0.07), and the blend leaves 4.5% for digital sentience and other work where the explainer says 4%. Fix: set the highs to 0.19 and 0.07 (or say "about 0.2" and "about 0.08" in the blend line) and say "about 4.5%" instead of 4%.
3. low, facts/next_dollar.json `longview_philanthropy` note: "first nine months ... December 2024 to September 2025" spans ten months. Fix: "first ten months" or "first round".
4. low, write-up line 53 still reads "To be completed after the audit rounds." Fix: fill in the audit section (two rounds, nine findings fixed in round 2) before publishing.

No finding above low.

Verdict: pass.
