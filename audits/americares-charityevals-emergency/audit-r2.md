# Audit: americares-charityevals-emergency, round 2 (verification)
Result: 3.670e-5 DALY/$ = 0.0367 years of healthy life per 1,000 dollars (combined range 0.0074–0.183, as in round 1); cause median 0.338 (x0.11). Verdict: pass.
Model-sha: c50717f426f89269734d18803e214abc867dd73d7bb3c485a0e8d227bb1d5531
Scope: unchanged from round 1 (Emergency Programs, FY2025, cash expenses only; donated goods in the credit share).
Mechanical: audit-model 0 findings (no high, medium or low); result identical to round 1 (the edits are explainers, a source change and a row-order move). Normalization-audit wrote nothing to generated/.
Previous round: F1 resolved, F2 resolved, F3 resolved, F4 resolved, F5 resolved, F6 resolved (details below).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| F1 | resolved | sensitivity | em_goods_share | Explainer now gives the reference class from the Emergency column (statements p. 8): 22.3M + 4.6M = 67% of cash, salaries 20%, about half judged health care; 30% (15–50%) kept. Numbers match round 1's reading of the column. | model explainer | none | none |
| F2 | resolved | double-counting | crisis_mortality_rate | Explainer states it is one rate for all people reached with the US's smaller excess averaged in; the 3% effect is acknowledged by that wording and the range 0.8–2.5% covers it. | model explainer | none | none |
| F3 | resolved | presentation | baseline_usa | Explainer says why the lowest quintile (0.45, facts/united_states.json ce_lowest_quintile_vs_all_2024 = 0.4462) plays the affected share, which is 0.42 abroad. Consistent. | facts/united_states.json | none | none |
| F4 | resolved | comparability | em_partner_cost_vs_own | Explainer says why 0.5 of Americares' cash differs from the main model's multiple of medicine value (emergency delivery is paid by Americares). Reasonable; no base change. | model explainer | none | none |
| F5 | resolved | source | program_expenses | Now cited to the audited statement p. 7, quote "Other program expenses 133,068"; the PDF text contains "Other program" and 133,068 (page number not re-confirmed: no PDF page renderer in this environment, text extracted from the file's streams). Explainer reproduces 1,878,619 less 1,745,551 = 133,068. `total_expenses` = program_expenses + mgmt_general + fundraising, so the overhead ratio is unchanged (1.283). | ug2025.pdf, model | none | none |
| F6 | resolved | presentation | write-up | writeups/americares-charityevals.md "How this model was checked" is filled; it says the assistance programme's age split came from the shared split, the goods share was anchored, the cash total cited, overlaps stated. No placeholder left. | write-up | none | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| program_expenses | https://www.americares.org/wp-content/uploads/2025-Americares-Foundation-UG.pdf | verified | "Other program expenses", 133,068 and 1,745,551 present in the file |
| baseline_usa | facts/united_states.json | verified | 0.4462, rounded to 0.45 in the explainer |

## Drivers
Unchanged from round 1: crisis mortality rate (judgment, American Red Cross reference class), value delivered per person, em_goods_share (now with a reference class), place weights, partner cost share.

New-text check: the added `beneficiaries` and `beneficiaries_note` keys moved to the top of the file without change to values (0.35, 0.2275, 0.1479, 0.2746, sum 1).

**Verdict: pass. No high or medium findings.**
