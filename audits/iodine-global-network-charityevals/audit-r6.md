# Audit: iodine-global-network-charityevals, round 6 (follow-up after wording fixes)
Result: 0.006344 uov/$ = 3.17 years of healthy life per 1,000 dollars (combined range 0.094-107). Verdict: pass.
Model-sha: e724713db6908f74314d10b28733b285750863963a14063ab7f36e4127fe09dd
Rules: 0.3.1
Scope: wording changes since round 5 only.
Preflight: pass as in round 5 (not re-run; headline unchanged at 3.17176).
Previous round: finding 1 (medium, summary quotes "about 2.4") resolved: the summary now reads "The result, about {{result}} years of healthy life per 1,000 dollars". Finding 2 (low, Davao partners unnamed) resolved: the explainer now says "its report names no other partner, and the rest allows for partners not named"; it reads correctly and adds no new factual claim.

No value, range, formula or class changed: the six `_attribution_share_shared` rows hold 0.45 (0.25-0.7), 0.45 (0.2-0.7), 0.2 (0.1-0.4), 0.6 (0.3-0.85), 0.55 (0.3-0.8), 0.25 (0.1-0.5), and each used share is still `<b>_attribution_share_shared * mobiliser_share` with `credit: "win"`.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| none | | | | | | | |

## Sources checked
None needed (no new factual claim).

## Drivers
Unchanged.

Verdict: pass

Re-stamped (17 Nov 2026), rule credit-switch-co-funders: Credit rule 2.24, step 6: the co-funder switch counts co-funders only; the donors whose money a mover moves are mobilised (under mobiliser_share), so their new money leaves donor_cost_share. Only results with the switch on move. Mechanical: headline unchanged, against the tree before the rule.
