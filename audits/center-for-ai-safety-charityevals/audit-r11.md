# Audit: center-for-ai-safety-charityevals, round 11 (scoped verification of round 10's fixes)
Result: 0.01307 daly/$ = 13.07 years of healthy life per 1,000 dollars at mobiliser_share 100% (round 10 predicted about 13.1). Verdict: pass.
Model-sha: 0a6a7edf855cb365595e39557b3fabde8b25ce4ec1dd8f00e48f0cab2f587ca4
Rules: 0.3.11
Scope: only round 10's findings and the rows changed for them.
Preflight: pass (low range lines and the out-of-date distributions line only).
Previous round: finding 1 (medium) resolved; findings 2 and 3 (low) resolved.

- Finding 1: `ai_evidence_adj` {0.4, 1.2, 1.2} and `ai_counterfactual_adj` {0.35, 0.65, 0.85} carry the old rows' values and text; `fb_evidence_adj` {0.7, 1, 1.2} and `fb_counterfactual_adj` {0.8, 1, 1} have the template's values, with explainers that name the reason (no published alumni data; would-have-got-there-anyway already out of `fb_share_working`). The three formulas match the template's: evidence_adj = (w_ai ev_ai + w_fb ev_fb)/(w_ai + w_fb); counterfactual_adj = (sum w ev cf)/((sum w) evidence_adj); attribution_share_shared = (sum w ev cf used share)/((sum w) evidence_adj counterfactual_adj). So evidence x counterfactual x share = the value-weighted sum of each branch's own product (scratch run: 1.0619 x 0.8776 x 0.8534 = 0.7953 = (173,571 x 0.78 x 0.577 + 387,214 x 1 x 0.95)/560,785). The mobiliser's share enters once: only `mobiliser_share` (the setting), `ai_attribution_share` and `fb_attribution_share` read it; total_adj reads attribution_share. No double cut of "would have happened anyway" for the course.
- Finding 2: the explainer reads "About {{row:attribution_share}} overall ..." (renders 0.85). Resolved.
- Finding 3: the appended sentence is in `fb_share_working`. Resolved.

No findings. Remaining observation (not a finding): the course carries about four fifths of the result and rests on the unsurveyed 5% (1% to 15% moves 13.1 to 4.4 and 34.6); an alumni follow-up would improve it most.

## Edits to writeups/center-for-ai-safety-charityevals.md (bringing typed figures to 13.07)
Adjustments table: evidence 1.2 for the AI work, 1 for the course; counterfactual 0.65 for the AI work, 1 for the course; overall share 0.83 -> 0.85. Swings: chance slider 0.4% to 20% now 1.0 to 52; misuse cut 1.9 to 125; misuse share 10% to 40% now 5.6 to 20.5; fb_share_working 1% to 15% now 4.4 to 35; 0.1% discount rate now 28. The "about four fifths" for the course still holds (about 82%).

Re-stamped (18 Nov 2026), rule never-started-weight: Lives that never start count times a slider, 0% by default (the suffering in them always counts); future generations are the first rows it weighs, so the discount rate is time preference only. Mechanical: headline 3.922 → 3.892 (−0.76%), 4 rows changed, against the tree before the rule.

Re-stamped (18 Nov 2026), rule lives-added: The people and animals a result adds: a death averted, a stillbirth averted, a year of contraception, an income raised and a future kept are read with the births parents forgo, the survivor's descendants and the animals all of them eat, by the beneficiaries' income group; nothing moves by more than 0.2% at the defaults. Mechanical: headline 3.892 → 3.892 (−0.0096%), 11 rows changed, against the tree before the rule.
