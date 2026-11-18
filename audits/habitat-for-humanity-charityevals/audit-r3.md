# Audit r3: habitat-for-humanity-charityevals (scoped verification)

Result: 4.933e-6 daly/$ = 0.00493 years of healthy life per $1,000 (unchanged from r2; combined range 0.00112–0.0217).
Model-sha: 82e7b3913b6ee9238f75d0d24d37a835e0c3848ef396aa845e9f06fd76025ef6
Rules: 0.3.0
Verdict: pass

Scope: only the changes of commit 5f6554f1 to the model, its write-up and facts/habitat_for_humanity.json, checked against the four r2 lows, the move of the volunteer rows to shared facts, the result and the mechanical audit.

| Severity | Row | Finding | Status |
|---|---|---|---|
| low (r2 #1) | `staff_cost_share` | Explainer now says "(35%)", matching 120,366 / 343,063. | resolved |
| low (r2 #2) | `dis_reach_share`, `dis_spend_share` | Both explainers are now on the cash basis: transfers 58% of the line; the line in cash rose $24.4M ($127.9M to $152.4M), transfers +$19.0M. | resolved |
| low (r2 #3) | write-up Summary, "What isn't modelled", `unmodelled_benefits_adj` | "60% of its programme spending in cash"; "Three things set the result"; "no longer as a share here" and the explainer's advocacy history are cut. | resolved |
| low (r2 #4) | `source.published` | `published` and `retrieved` are 2026-11-15. | resolved |
| none | `network_volunteers`, `us_volunteer_share` | Both now read `@habitat_for_humanity.network_volunteers_fy2025` and `@habitat_for_humanity.us_volunteer_share` by formula. Values unchanged: 828,000 (same Form 990 Schedule O source and quote) and 0.3 / 0.5 / 0.75 with the same judgment explainer. The international model reads the same two facts. | verified |
| none | result | `check.ts` all models valid. audit-model prints 0.004933 years of healthy life per $1,000, the same as r2; no change from the shared-fact move. | verified |
| medium (judged right in r1 and r2) | whole result | audit-model `far-below` (0.0422× the global-health median). Still the only finding; no lint high, no invariant violation. | accepted |

Re-stamped (16 Nov 2026): Pre-audit cleanup (16 Nov 2026): shared figures read from facts at the same values (@myanmar.household_consumption_share_of_gdp, @survey_consumption.disaster_affected_share_of_survey_mean, @volunteering.disaster_volunteer_ls_gain_year); judgments' reference classes named from sources; volunteer-hours labels name the charity. Values unchanged. Mechanical: headline unchanged, against d90d80aa.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 2b370f40.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against 32b69cd7.
