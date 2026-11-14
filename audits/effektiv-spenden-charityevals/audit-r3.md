# Audit: effektiv-spenden-charityevals, round 3
Result: 0.05026 uov/$ = 25.1 years of healthy life per 1,000 dollars (unchanged from round 2). Verdict: pass.
Scope: scoped verification of round 2's two low findings and of the write-up's "How this model was checked" section (diff of commit dbbd34f). No scope, cost, reach or formula re-audit.
Mechanical: audit-model Findings 0, bottom line 0.05026 uov/$ = 25.13 years per $1,000. `git show dbbd34f -- models` changes exactly two lines, the explainers of survey_response_share and value_destinations; no formula, value, range, source or kind changed. The Model-sha differs from round 2 only because of those two explainer texts.

## Round 2 findings
| # | Round 2 | Status | Check |
|---|---|---|---|
| 1 | low, survey_response_share anchor presented 23,000 donor-years as its own counts | fixed | The explainer now cites only sourced figures (more than 9,000 donors in 2021 per its review of that year; about 12,000 in 2024 per the Jahresrückblick 2024; donations EUR 2.84M in 2020 and EUR 18.86M in 2021) and labels "about 23,000 donor-years over 2019-2022" as "our rough total". I fetched the Jahresrückblick 2024 page: "rund 12.000 Spenderinnen und Spender ... gespendet", which matches. The 2021 and 2020 figures come from the forum post that was unreachable in round 2 and still are unverified by me, but they are now attributed to it rather than to a count presented as exact. Judgment 20% (8-40%) unchanged. |
| 2 | low, 2024 split already contains Swiss giving | fixed | value_destinations explainer now says the blend by the Swiss share (27%) is "an approximation since the 2024 list already includes Swiss giving". Formula untouched; both poverty lists are GiveWell-ranked charities, so the effect stays small. |

## New findings
None.

## Write-up
"How this model was checked" matches audit-r1.md and audit-r2.md: three rounds; round 1 had no high finding (verdict pass, two medium, five low) and verified its cost, reach and fact figures against their sources; the three fixes named (Swiss 2025 grants by recipient bringing in METR, Sinergia Animal and Wild Animal Initiative; the lower grant wait; the corrected write-up) are in round 1's list and confirmed fixed in round 2; round 2 passed with two low explainer findings. The list names three of round 1's seven fixes, not all; it is a summary, not a misstatement.

Verdict: pass (no findings).
Model-sha: 40d7e281def9dcb882cb66093e75d40166933dfbb4b24ee1c2f82618bbc043d7
