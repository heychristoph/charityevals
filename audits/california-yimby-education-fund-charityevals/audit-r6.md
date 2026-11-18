# Audit round 6 (scoped verification): California YIMBY Education Fund

Scope: only round 5's findings: the credit paragraph of writeups/california-yimby-education-fund-charityevals.md against rows `adu_coalition_share` and `oth_coalition_share` and their inputs; the `oth_lobbies_resources` explainer. Result 0.267 years of healthy life per $1,000 at the defaults (round 5: 0.2675), unchanged.

Checked:
- Recomputed from the rows (spend CPI-adjusted to 2024, `family_spend_period` about $29.0m): `adu_others_resources` = $1.2m Casita (990s, CPI-adjusted) + $12m judged = about $13.3m, share 24.6%; `oth_others_resources` = YIMBY Action's $6.87m x 40% state share (CPI-adjusted) + $100m judged = about $103.2m, share 12.3%. Before the 62% Education Fund factor. The write-up says "about 25%" for the ADU laws (15% of spending against about $13 million) and "12%" for the others (half their spending against about $103 million). All figures match; the legislators' and housing department's work is stated once as under the mobiliser's share. The paragraph is fixed.
- `oth_lobbies_resources` explainer now ties the $100m ($30m to $300m) to the ADU row ("about eight times the ADU lobbies' $12 million, for a dozen larger laws", 8.3x) and says the authors', committee and department staff are under the mobiliser's share. Fixed.
- check.ts passes; headline 0.267.

Findings:
- [LOW] "How this model was checked" still says "Four independent audit rounds" and stops at round 4. Fix: change to "Six independent audit rounds" and append: "Round 5 re-judged the two coalition shares for the credit rule: the legislators' and housing department's staff time left the denominators (they are credited through the mobiliser's share), which lifted the ADU laws' share from about 11% to 25% and the others' from 9% to 12%, and the result from 0.13 to 0.27. Round 6 checked the write-up against the rows."

Verdict: pass

Model-sha: a089843c46d0d828334e3bba24572e1f7c329a5d40e60f338303556dcb25705c
Rules: 0.2.2
