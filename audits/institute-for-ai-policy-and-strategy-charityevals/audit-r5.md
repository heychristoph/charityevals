# Audit: institute-for-ai-policy-and-strategy-charityevals, round 5 (verification round)
Result: 0.007114 daly/$ = 7.114 years of healthy life per 1,000 dollars at mobiliser_share 100% (unchanged from round 4). Verdict: pass.
Model-sha: 33c5d571dc419b73f77cb3a5603c57fbcd2bfea4a0a959e7b239c7312d920bba
Rules: 0.3.10
Scope: round 4's medium (stale `summary`) and low 2 (ai_attribution_share_shared wording). Preflight passes (distributions.json notice ignored). No value changed.

| # | Round 4 finding | Status | Evidence |
|---|---|---|---|
| 1 | summary stale (medium) | resolved | Credit clause now says full credit because no other programme is known to have trained the same people, employers under the mobiliser's share; "the fellowship gives most of the result" (85%, round 4 arithmetic); "from 0.2 to 40 on the model's own ranges" (audit-model joint 0.19-40); biggest swings now the catastrophe chance, the misuse cut, the mobiliser's share, the years a cut counts and the share of fellows who work on the risk, which match the tornado's top rows. "Next dollar 38.5%" and other figures unchanged. |
| 2 | ai_attribution_share_shared wording (low) | resolved | Closing sentence names co-authors' and co-advocates' resources and puts what others would have done anyway in ai_counterfactual_adj; value 0.75 (0.6-0.9) unchanged. |

No new finding. Writeup (edited in round 4) agrees with the summary.

**Verdict: pass**

Re-stamped (17 Nov 2026), rule mobiliser-share-30: the summary's typed range replaced by placeholders rendered from the model (the mobiliser's share now defaults to 30%). Mechanical: headline 7.114 → 2.134 (−70%), 12 rows changed, against 814eaf77.

Re-stamped (18 Nov 2026), rule never-started-weight: Lives that never start count times a slider, 0% by default (the suffering in them always counts); future generations are the first rows it weighs, so the discount rate is time preference only. Mechanical: headline 2.134 → 2.114 (−0.92%), 4 rows changed, against the tree before the rule.

Re-stamped (18 Nov 2026), rule lives-added: The people and animals a result adds: a death averted, a stillbirth averted, a year of contraception, an income raised and a future kept are read with the births parents forgo, the survivor's descendants and the animals all of them eat, by the beneficiaries' income group; nothing moves by more than 0.2% at the defaults. Mechanical: headline 2.114 → 2.114 (−0.0096%), 12 rows changed, against the tree before the rule.
