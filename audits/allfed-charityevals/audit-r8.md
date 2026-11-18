# Audit: allfed-charityevals, round 8 (wording check)
Result: 0.02741 daly/$ = 27.4 years of healthy life per 1,000 dollars, unchanged from round 7. Verdict: pass.
Model-sha: 77ec655b66de16dadb5970d228072d7c0c310d636a160212fdb0a45b7cb27718
Rules: 0.3.11
Scope: confirm the round 7 wording fix changed no value, range, formula or class.
Preflight: not re-run (wording only).
Previous round (round 7): finding 1 (high-end wording "partners' time") resolved: now "the high end if co-authors' time is small". Finding 2 (writeup "partners'") resolved: writeup reads "co-authors' time".

Headline 27.4056 equals round 7. nuclear and bio shares still 0.66 (0.5 to 0.88); classes and formulas unchanged.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| none | | | | | | | |

## Sources checked
None (no factual claim added).

**Verdict: pass**

Re-stamped (17 Nov 2026): credit rule 2.24: fb_credit_share is the skeleton's row (unused here, or wording only): no value change. Mechanical: headline unchanged, 1 row changed, against 2b24b73c.

Re-stamped (18 Nov 2026), rule never-started-weight: Lives that never start count times a slider, 0% by default (the suffering in them always counts); future generations are the first rows it weighs, so the discount rate is time preference only. Mechanical: headline 8.222 → 8.169 (−0.64%), 4 rows changed, against the tree before the rule.

Re-stamped (18 Nov 2026), rule lives-added: The people and animals a result adds: a death averted, a stillbirth averted, a year of contraception, an income raised and a future kept are read with the births parents forgo, the survivor's descendants and the animals all of them eat, by the beneficiaries' income group; nothing moves by more than 0.2% at the defaults. Mechanical: headline 8.169 → 8.169 (−0.0095%), 12 rows changed, against the tree before the rule.
