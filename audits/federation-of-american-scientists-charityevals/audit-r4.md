# Audit: federation-of-american-scientists-charityevals, round 4 (scoped verification, credit rule 2.24)
Result: 0.001468 daly/$ = 1.468 years of healthy life per 1,000 dollars (combined range 0.052–41.3; model's own ranges 0.12–8.16). Verdict: pass.
Model-sha: 6ee92927ccb8e4ff04bca3cb6c3a669c7188ab7aad15b5f230c4a4f6c3f38d57
Rules: 0.1.0
Scope: only gov_attribution_share_shared (0.7 (0.4-0.95) -> 0.9 (0.7-1)) and the classes on the used share rows.
Preflight: pass (only the generated/distributions.json line, ignored as instructed).
Previous round: round 3 had no open high or medium.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | double-counting | gov_attribution_share_shared | The sponsored projects' own staff and partners' paid work are in the cost; only their unpaid time is a co-advocate input, so 0.9 (0.7 to 1) is a defensible best guess but rests on no count of unpaid hours. | Explainer names Day One authors (small stipends in the cost) and sponsored projects' partners. | Optional: cite the Day One stipend scale or the number of unpaid memo authors when available. No change to value or range. | none |

## Checks
1. Denominator: the explainer now counts only Day One memo authors and sponsored projects' partners beside FAS's staff and fellows. Agencies' supervising and implementing staff (the adopters) are removed and said to sit under the mobiliser's share. No co-advocate in the old text was dropped; the one removal is the adopter, with reason.
2. Claims: the federal grants figure ($8.4M, Part VIII line 1e) matches the 990 figure verified in round 1 (government grants 8,368,187). The explainer's other claims are about the model's own structure (cost includes staff, fellows, grants). No new external claim was added.
3. Value: 0.9 (0.7 to 1) is a best guess for a branch whose main inputs (staff, fellows, sponsored projects) are in the cost and whose unpaid inputs are small; it matches the nuclear and AI branches' 0.9 and sits above the pandemic branch's 0.8 (workshops with outside experts). The explainer arithmetic is only the value and range; consistent.
4. Classes: gov = win (agency changes enacted and carried out by government), ai, bio, nuclear, fb = research (adoption by labs, funders, health systems), pol = win. Each used share is `<branch>_shared * mobiliser_share` once (grep: mobiliser_share is read only in those six formulas and its own row). The weighted `attribution_share_shared` combines the used shares and divides by the product of the aggregate evidence and counterfactual rows, so s enters once. No delivery class is needed: no own-service branch. No branch cost row reads the share, and the gov chain values better use of the same public money with no extra cost to payers (no mobilised cost to net).
5. Would-have-happened-anyway: stays in gov_counterfactual_adj (0.6, 0.3 to 0.9), gov_evidence_adj and $win_years_counted; the share does not repeat it.
6. Text: the model summary quotes no branch shares. The write-up's adjustments table already gives 0.9 for science policy (matches the new value; the 0.7 old value is not quoted anywhere). Headline 1.468 matches the task's 1.4682; the write-up uses live placeholders. No write-up edit needed.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| gov_attribution_share_shared | 990 Part VIII line 1e (round 1 audit record) | verified in round 1 | government grants 8,368,187 = $8.4M; not re-fetched |

## Drivers
Unchanged: nuclear cut per million, win_years_counted, mobiliser_share (now the second largest tornado input, as intended), missing_data_discount, discount_rate.

Verdict: pass

Re-stamped (17 Nov 2026): credit rule 2.24: fb_credit_share is the skeleton's row (unused here, or wording only): no value change. Mechanical: headline unchanged, 1 row changed, against 2b24b73c.
