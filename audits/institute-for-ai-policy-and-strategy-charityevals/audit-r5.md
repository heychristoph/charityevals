# Audit: institute-for-ai-policy-and-strategy-charityevals, round 5 (verification round)
Result: 0.007114 daly/$ = 7.114 years of healthy life per 1,000 dollars at mobiliser_share 100% (unchanged from round 4). Verdict: pass.
Model-sha: 503d0ba6c9376000c6dfcfb4e049118d4ae1cfffc1098baf6c19806f3e5d2d35
Rules: 0.3.13
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

Re-stamped (18 Nov 2026), rule never-started-prose: Wording: the summaries and write-ups of the models that count a future say it counts only where the reader counts lives that never start, give the Long-run value set's figure where they gave a 0.1% discount rate's, and Redwood Research states no range; no row or result changes. Mechanical: headline unchanged, against the tree before the rule.

Re-stamped (19 Nov 2026), rule never-started-branches: In the catastrophic-risk family the mark for lives that never start moves from the sum of the future to each branch's future row, so the branch weights that average the adjustments count the future as the outcome does (they counted it in full); the future's farmed animals read the branches' own formulas. Mechanical: headline unchanged, 4 rows changed, against the tree before the rule.

Re-stamped (23 Nov 2026), rule input-domains: Every input states its kind of number (domain); the simulation draws each by its kind, so no draw is a number it can't be (normalization 2.18, INV-27). Mechanical: headline unchanged, against the tree before the rule.
