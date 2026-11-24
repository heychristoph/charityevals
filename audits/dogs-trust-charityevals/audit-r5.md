# Audit round 5 (scoped verification): dogs-trust-charityevals

Scope: credit rule 2.24, step 5. Only `pol_attribution_share_shared` changed: 0.15 (0.05-0.30) to 0.20 (0.08-0.40), relabelled "share among the groups that campaigned for it". Its branch is `"credit": "win"` (import law); the other branches are class delivery.

Checked:
- Denominator: the MPs who brought the bill and the government that enforces it are out; the campaigning charities (RSPCA, BVA, Four Paws, Battersea, Blue Cross, Kennel Club) stay. Parliamentary debates also name Cats Protection and the Conservative Animal Welfare Foundation as campaigners; the Kennel Club was mainly a consulted stakeholder. Seven or eight groups either way, so the equal split is 12.5-14%.
- Anchor: "an equal split of 14%, above that for leading for years and being the only charity rehoming smuggled pups" is real and arithmetic checks (1/7). 20% (8-40%) follows.
- No double cut: `pol_counterfactual_adj` is 1 (years counted); the legislature is cut once, in `mobiliser_share`.
- Class: `pol_attribution_share` is `"credit": "win"`, formula `pol_attribution_share_shared * mobiliser_share`. Right (a statute the state enforces).
- Text rules met.
- check.ts: all models valid. Headline 5.34e-5 years of healthy life per $1,000 (unchanged at the digits shown; policy is a small part).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | text | pol_attribution_share_shared | The list of campaigning groups omits Cats Protection and the Conservative Animal Welfare Foundation, both named in the bill's debates. | Hansard, Commons, 14 May and 4 July 2025. | Add them (or say "and others") and put the equal split at 1/8 to 1/9; the 20% still stands as "above an equal share". | none |

Verdict: pass (0 high, 0 medium, 1 low)
Model-sha: 89f2877906b981d73aa0f8907e4d3594c355e9d654dad1bc5bb6dad5b5913499
Rules: 0.3.13

Re-stamped (17 Nov 2026): the round's low findings fixed in wording (and, for the rainforest model, rows no longer read removed and the branch weights kept free of the mobiliser's share); no value changed at a 100% mobiliser share.

Re-stamped (23 Nov 2026), rule input-domains: Every input states its kind of number (domain); the simulation draws each by its kind, so no draw is a number it can't be (normalization 2.18, INV-27). Mechanical: headline unchanged, against the tree before the rule.
