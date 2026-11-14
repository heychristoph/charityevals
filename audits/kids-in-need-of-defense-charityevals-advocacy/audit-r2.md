# Audit: kids-in-need-of-defense-charityevals-advocacy, round 2
Result: 8.649e-6 daly/$ = 0.00865 years of healthy life per 1,000 dollars (combined range 0.00056–0.133); cause median 0.0693 (×0.125). Verdict: **pass** (no high finding; one medium and three low remain).
Model-sha: e387bdc2927d0b9eb2c975894251a21eabe347a47cad05b6ed596ce4b4d258cd
Scope: verification round only: round 1's ten findings and the rows the fixes changed. Not re-audited: the rest.
Mechanical: audit-model lint 0 high / 0 medium / 1 low (spread, the summary says so: 32,377×); invariants none; simulation-check stable (5% 0.16×, 50% 1.0×, 95% 5.3× best guess). normalization-audit not re-run (no change to shared rows).
Previous round: 1 resolved, 2 resolved, 3 partly resolved (see finding A), 4 resolved, 5 accepted as a judged share (see finding B), 6 resolved, 7 resolved, 8 partly resolved (findings C, D), 9 resolved, 10 resolved.

Result check: round 1's 0.0162 moves by implementation 0.7 (about -21%), KIND share 0.5 (about -23%), other wins 0.3 (about -13%) and the longer D.C. wait (about -1%): 0.0162 x 0.79 x 0.77 x 0.87 x 0.99 = 0.0085, matching 0.00865. The summary's "about 0.009", "about a tenth" (0.2 x 0.5) and "over ten thousandfold" agree with the model; the median ratio 0.125 is "far below".

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| A | low | source | jop_class_members | The explainer now has a reference class (ORR referrals 2019-2024, over half a million, matches ORR's yearly counts of about 70k, 15k, 122k, 128k, 118k, 98k), but no URL and no filing share, and "USCIS's asylum offices take several thousand such filings a year" is still unsourced. The 8,000 (2,000-30,000) is an honest judgment with a wide range; the finding is the missing numbers, not a wrong value. | explainer | Add the ORR source (HHS ORR facts and data page) and, if USCIS's Asylum Division publishes affirmative filings by unaccompanied-child status, the count; otherwise name that none is published. | none now |
| B | medium | missing-adjustment | adv_other_wins_ratio | Round 1 asked for a fed_ branch. The builder kept the judged share, lowered to 30% (0-100%) with the Baumgartner anchor and the 2025 cut-off, as in IRAP's advocacy model. Acceptable for this round: the ratio now matches the peers', the explainer names the federal funding as the main member and why a past win is small (the programme came before the period; appropriations are hard to move), and an unmodelled-channel share is the template's accepted form for other wins. It still contradicts the "every programme gets a chain" rule for the one channel that funds most of the sister model's casework, so a branch (dollars at stake x coalition counterfactual x KIND share x value per dollar read from the sister model) would be the better model. | explainer; peer rows | Build the `fed_` branch when the sister model's federal-funding figures are next touched; until then keep 30%. | unknown, adds back |
| C | low | presentation | dc_youth_per_year | The code citation is wrong: the act adds D.C. Code 16-2399.01 to 16-2399.09 (new Subchapter VI of Chapter 23 of Title 16), not 21-2381. Description (ages 18-20, SIJ-style findings, effective 19 July 2024) is right. | code.dccouncil.gov/us/dc/council/laws/25-188 | Replace "D.C. Code 21-2381 ff." by "D.C. Code 16-2399.01 ff.". | none |
| D | low | presentation | dc_relief_gain | Still says "Many of these youths could already seek guardianship under D.C.'s earlier law; the act removes obstacles for some", which round 1 found contradicts the law (a new guardianship class for 18-20-year-olds, which D.C. had not offered). | same | Write: "The act opens a guardianship for 18-20-year-olds that D.C. did not offer; the gain is the added chance that such a youth gets the state-court order an SIJ petition needs. Our judgment +30 points, from 10 to 60." | none |
| E | low | source | jop_implementation_adj | The explainer says the court "extended the agreement to November 2026"; round 1's docket evidence (3 Nov 2026) is jurisdiction extended to 27 May 2027 for removed class members. | Public Counsel case page | Say "extended its jurisdiction to May 2027". | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| dc_youth_per_year | https://code.dccouncil.gov/us/dc/council/laws/25-188 | verified | sections 16-2399.01 to .09, age 18 to under 21, effective 19 July 2024; explainer's section number wrong (C) |
| jop_implementation_adj | https://publiccounsel.org/our-cases/jop-v-dhs/ | verified in round 1 | enforcement orders 2025-2026; the extension date is stated wrongly (E) |
| jop_class_members (ORR counts) | none given | judgment, figures plausible | see A |
| jop_relief_gain (TRAC 73% vs 15%) | none given | plausible, known TRAC figure for represented vs unrepresented children | add the TRAC URL to the explainer if wanted |
| writeup | writeups/kids-in-need-of-defense-charityevals.md | verified | now "about 10% more consumption" |

## Drivers
Unchanged from round 1: `$missing_data_discount`, `jop_class_members`, `$uov_per_daly`, `@kind.p_removed_without_status`, `discount_rate`; own-row drivers are the class size, `dc_youth_per_year`, `jop_relief_gain` and `jop_kind_share_vs_equal`. Most useful addition: USCIS counts for the class and a federal-funding branch.
