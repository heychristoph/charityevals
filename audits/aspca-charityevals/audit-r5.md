# Audit round 5 (scoped verification): aspca-charityevals

Scope: credit rule 2.24, step 5. Only `pol_attribution_share_shared` changed: 0.25 (0.10-0.50) to 0.30 (0.12-0.55), relabelled "share among the groups that campaigned for the laws", with a new explainer. The other branches are class delivery and unchanged.

Checked:
- Denominator: the legislators' staff are out; the named co-advocates stay (Humane World for Animals, Bark, local shelters). No adopter or carrier-out is left in. `pol_counterfactual_adj` is 1 (the years counted carry "would have happened anyway", `$win_years_counted`), so the legislature is cut once, in `mobiliser_share`, not twice.
- Anchor: "one lead of about four groups in New York, one of several co-sponsors in California". Public record for S1130/A4283 lists ASPCA, HSUS (now Humane World), NY State Animal Protection Federation, Voters for Animal Rights, CAPS, ALDF and the NYC Bar's animal law committee as supporters, so six or more groups; the California sponsors are not named in the model. 30% as a lead of four to six is consistent; the range 12-55% covers one of eight to a lead of two.
- Class: `pol_attribution_share` is `"credit": "win"`, formula `pol_attribution_share_shared * mobiliser_share` (laws others enforce). Right. Compliance-cost row already reads the used share.
- Text: no peer comparison, no "effective altruism", short and plain.
- check.ts: all models valid. Headline 1.368e-4 years of healthy life per $1,000 (unchanged to the digits shown; the policy branch is small).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | source | pol_attribution_share_shared | "About four groups in New York" understates the public sponsor list (six or more); the California sponsors are not named. | Governor's/ALDF/CAPS pages for S1130/A4283. | Say "one lead of six or more groups in New York" or name them in a `source`; the value stands. | none |

Verdict: pass (0 high, 0 medium, 1 low)
Model-sha: c8d67f65682c479cfb76c8cedb8584938fd2e0f094cc21a9a49a9ffd76804e65
Rules: 0.1.1

Re-stamped (17 Nov 2026): the round's low findings fixed in wording (and, for the rainforest model, rows no longer read removed and the branch weights kept free of the mobiliser's share); no value changed at a 100% mobiliser share.
