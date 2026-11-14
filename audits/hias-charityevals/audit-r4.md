# Audit: hias-charityevals, round 4 (scoped)
Model-sha: 47070d289ad75897575a5a5984beb29f6b2920d687c5ac93424f3164bfd240b4
Scope: only the explainer changes since 04a7b33 (leg_wait_years, leg_removed_if_lost, leg_remit_share) and the write-up's legal bullet and RSC line. No input changed, so the result is unchanged (3.133e-6 daly/$).
Mechanical: audit-model 0 high / 0 medium / 2 low (far-below, spread; both stated in the summary, unchanged); no files rewritten.

| # | Severity | Row | Finding | Fix |
|---|---|---|---|---|
| R3-F1 | resolved | leg_wait_years | Gigafact page (TRAC, 20 March 2024) gives 1,424 days as the overall average wait; the explainer now says "average wait" and the 1,016-day clause is dropped. | none |
| R3-F2a | resolved for ICE, low remainder for NPR | leg_removed_if_lost, leg_remit_share | ICE URL added; 271,484 removals in FY2024 verified in the annual report text (ERO removed 271,484 noncitizens, an increase of 90.4% on FY2023). The NPR URL was added but the page timed out in two fetches and a curl returned no text, so the "$300 each time" figure is not re-verified this round. | Re-check the $300 when NPR is reachable; no change needed to the 6% (2-12%) judgment. |
| R3-F2b | resolved | leg_removed_if_lost | 55% x 1,445,549 = about 795,000 executable orders; 271,484 / 795,000 = 34%, so "a quarter to a third" is right (top of the range). | none |
| R3-F3 | resolved | write-up | Legal bullet now says "family reunions and green cards", matching the model's row. | none |
| N1 | low | write-up | The RSC line says "about 200, our judgment", matching hias-charityevals-international rsc_people best 200. | none |

No new inconsistency found. **PASS** (no high findings)

**Verdict: PASS**
