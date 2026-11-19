# Audit round 5 (scoped verification): Electoral Reform Society

Result: 7.99e-5 daly/$ = 0.0799 years of healthy life per 1,000 dollars at the defaults (round 4: 0.0491), mobiliser share 100%. `check.ts`: all models valid. Verdict: pass.

## Scope
Credit rule 2.24, step 5: the six win-branch shares re-judged from "share of the resources behind the win, the government's own choice included" to the Society's share among the campaigners: `sv_ers_share` 0.2 to 0.5, `v16_ers_share` 0.15 to 0.25, `reg_ers_share` 0.15 to 0.25, `dev_ers_share` 0.15 to 0.3, `lords_ers_share` 0.1 to 0.3, `sen_ers_share` 0.1 to 0.4, each with a new range, label and explainer. Only these rows were checked (`git diff HEAD`).

## Checked
- Denominators: Make Votes Matter, Unlock Democracy, the Votes at 16 coalition, youth groups and the other Welsh civic groups stay in; the government, Parliament, Senedd, Scottish Government and Plaid Cymru are out and named as under the mobiliser's share. No co-advocate was dropped.
- Branch class: all six used share rows read `credit: win` and `x_attribution_share_shared * mobiliser_share`; each is a law, which others carry out. Correct.
- Ranges contain their best values and are wider on the side the evidence is thin; `pr_ers_share` (0.3 to 0.7) is the sourced anchor for sv and lords.
- No double cut: every `*_counterfactual_adj` is 1 and every `*_p_success` is 1 (or `v16_p_win`, the chance the bill passes, which is not a share). The party is cut once, in the share.
- Text: no comparison with other charities, no peer medians; explainers are short.

## Findings
1. Low, `sv_ers_share`, `lords_ers_share` (anchor wording). Both explainers call the anchor "from the groups' accounts", but `pr_ers_share` is a judgment: its own explainer says the other groups' spending cannot be added up. Fix: say "a judgment (`pr_ers_share`): the Society's spending is about 1.0 million pounds a year, the other groups are too small to file spending".
2. Low, `dev_ers_share`, `sen_ers_share`, `reg_ers_share` (what the judgment rests on). The explainers give only the number. Fix: add one clause each, for example dev "two Society offices against youth groups with no filed spending", sen "the Society convenes the Welsh group, the other members are small", reg "as votes at 16: the same coalition".
3. Low, gap check on the "would have come anyway" cut. Each counterfactual row is 1 because `$win_years_counted` (5 years, 1 to 20) says the reform would have come some day; that is a delay cut, not a cut for a government that would have made the same change in the same year. The old, lower shares (the old explainers called Labour's manifesto "the main reason" for votes at 16 and the Lords act) partly stood in for it. Now that the government's choice sits only under the mobiliser's share (100% by default), a manifesto-driven win (`v16`, `reg`, `lords`; also `sv`, `sen`) is credited in full to the campaigners times the Society's share for the years counted. This is the site's one answer in 2.9, applied to every win, so I do not call it a defect of this re-judgment; if the owner wants a same-year cut it belongs in `*_counterfactual_adj` (for example 0.6, 0.3 to 0.9 for votes at 16 and the Lords act, 1 for the rest), not back in the share. The row explainers (`*_counterfactual_adj`) should then also stop saying the delay alone covers it.

No high or medium findings.

Verdict: pass
Model-sha: 94d528b0eb96abe06fe8c6a0ad9bbce10039737012d16f7922ed49b99345e025
Rules: 0.3.13

Re-stamped (17 Nov 2026): the round's low findings fixed in wording (and, for the rainforest model, rows no longer read removed and the branch weights kept free of the mobiliser's share); no value changed at a 100% mobiliser share.

Re-stamped (17 Nov 2026), rule mobiliser-share-30: typed results in the model's text made placeholders or recomputed at the 30% mobiliser share, and wrong prose placeholders corrected; no row changes. Mechanical: headline 0.07988 → 0.02396 (−70%), 29 rows changed, against bc9e3979.
