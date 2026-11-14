# Audit: protect-democracy-charityevals, round 8
Result: 1.733e-5 daly/$ = 0.0173 years of healthy life per 1,000 dollars (combined range 0.00074–0.41); cause median 0.0693 (×0.25). Verdict: pass.
Model-sha: f4440c57726452b6386ec28ce5fd9741ccf8ed34a043ca700735f321427b46fd
Scope: scoped verification of commit 3775874 only: the reform branch's `ref_implementation_adj`, the shared facts it reads (local_offices_weight, pr_offices_share, us_pr_people_covered_per_year, us_pr_movement_resources_per_year), the summary and write-up. The backsliding branch and everything else not re-audited.
Mechanical: audit-model lint 0 findings; invariants none; check.ts "all models valid"; simulation-check stable (5% 0.109×, 50% 1.00×, 95% 8.58× the best guess); normalization-audit not re-run (scoped; no checked row kind changed). Working tree clean (no generated/ written). Result moved from 0.01852 to 0.01733 (-6%): the reform branch's offices weight fell from 0.82 to 0.41, its people rose from 95,000 to 103,000; no move above 2×.
Previous round (r7):
1. us_pr_people_covered_per_year below the note's sum (low): **resolved.** Best 103,000 = 1,030,354 / 10 (recomputed), range 85,000-115,000, partial-use wording removed; pr_offices_share is the only place partial adoptions are netted.
2. Portland, Oregon's population (low): **resolved.** 652,503 in both facts; pr_offices_share recomputed at 0.8247 (0.82).

## Formulas and stated numbers (checked)
- ref_implementation_adj = @democracy.pr_offices_share * @democracy.local_offices_weight = 0.8247 × 0.5 = 0.412 (explainer "about 41%", "82%", "half"); the same formula as FairVote's pr_implementation_adj, so both models weight a city's own elections one way and the shared weight's range moves both.
- ref_total_adj = 0.6 × 1 × 0.687 × 0.412 × 0.5 = 0.085 (half of round 7's 0.169). ref_side_factor and attribution (34,368,875 × 0.07 / 3.5M = 0.687) are unchanged and unaffected by the commit.
- Branch share: setting ref_uov to 0 gives 0.01592 against 0.01733, so the reform branch is 8.1% of the result; "about a twelfth" (8.3%) in the summary and write-up matches (round 7 had a seventh, 14%). Result "about 0.02" and "about a quarter of the median" (×0.25) match. Write-up: 103,000 people, $3.5 million, 7% of spending: match.
- The explainer of us_pr_people_covered_per_year (103,000; 85,000 to 115,000) matches the fact.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | source | @democracy.us_pr_movement_resources_per_year | The parts now sum to the stated $3.5M ($0.9M + $0.8M + $1.8M), but the new $0.3M a year for Portland's Charter Commission has no cited budget or hours; it is what closes the sum. This model's reform branch divides by the $3.5M, so ±$0.3M moves the branch by about 9%. | Fact note. | Cite the City of Portland's Charter Commission budget (FY 2021-22) and the commissioners' hours at the local median wage; show the computation in the note. | under 1% on the result |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| @democracy.local_offices_weight | https://doi.org/10.1111/1468-0297.00570 | verified | the abstract's "federal structure (local autonomy) systematically and sizeably raise self-reported individual well-being" |
| @democracy.us_pr_people_covered_per_year, @democracy.pr_offices_share | Wikipedia, Ranked-choice voting in the United States; Census QuickFacts | verified in round 7 and FairVote round 2 | populations (2020 census) and sums recomputed |

## Drivers
Unchanged from round 7 for the backsliding branch (field risk cut, win years, missing-data slider, the 2030 chance, the next dollar). The reform branch (about a twelfth) is driven by the shared figures it reads: movement spend 2-7M, pr_gain_share 1%-15%, and now local_offices_weight 0.3-0.65. No high or medium finding open.

Verdict: pass (0 high, 0 medium, 1 low).
