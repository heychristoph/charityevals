# Audit: fair-tax-foundation-charityevals, round 8 (scoped verification, credit rule 2.24, step 5)
Result: 0.0967 years of healthy life per $1,000 at mobiliser_share 100% (0.0953 in round 7).
Verdict: pass
Model-sha: 9677c62a15a83ce5a027e33f477bf3b5344adea4b8ea30c83a14c5fae21300fd
Rules: 0.3.13

Scope: round 7's one low finding, b_movement_credit, and the text that follows.

| # | Sev | Row | Finding | Fix |
|---|---|---|---|---|
| 1 | resolved | b_movement_credit | Now 0.8 (0.5 to 1) with the agreed explainer: the campaigners' share among those who campaign (civil society and investors); the UK government is the adopter and sits under the mobiliser's share (2.24); the EU's and Australia's laws and the OECD's rules are in the chance (b_issue_record_adj and the shared base rate), not here. Nothing is cut twice now. b_attribution_share_shared = b_ftf_movement_share x b_movement_credit = 3.2%, and b_attribution_share still multiplies by mobiliser_share once (class win). Headline moved 0.0953 to 0.0967 (+1.5%), as predicted. | none |
| 2 | pass | text | Writeup UK-reporting line reads "the campaigners 80% of the credit among those who campaign": agrees with the row. The "30%" in that line is the other-advocacy side effect (b_ue_other_advocacy), unchanged and correct. Branch shares (about 73% / 26% / 1%) hold: the policy branch is still about 1% and the others move by under a point. No other row or the summary quotes the old 30%. | none |

Preflight output was not re-read (the script was slow on this machine); round 7's pass stood and only one judgment value and its text changed.
Writeup edits made: none needed.

Re-stamped (17 Nov 2026), rule credit-switch-co-funders: Credit rule 2.24, step 6: the co-funder switch counts co-funders only; the donors whose money a mover moves are mobilised (under mobiliser_share), so their new money leaves donor_cost_share. Only results with the switch on move. Mechanical: headline unchanged, against the tree before the rule.
