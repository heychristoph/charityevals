# Audit: american-cancer-society-charityevals, round 1

Model-sha: 189ba54c914268050967ea833971ddccbe738f52c916967533062bc63ed06541

Result: 2.694e-6 daly/$ = 0.00269 years of healthy life per $1,000 (combined range 2.6e-4 to 0.028); global-health median 0.338 (×0.008). Verdict: **pass** (no high findings).

Scope: research ($193.291m), ACS CAN advocacy ($55.066m) and the prevention and early-detection part of patient support (45% of $426.454m, the shared judgment `@american_cancer_society.prevention_share_of_support`), year to 31 March 2026. That is ACS's first full twelve months after the change of year end, per the accounts' note 1. Patient services (the other 55%) are the sibling model. charities/american-cancer-society.json lines: $440,261,300 + $234,549,700 = $674,811,000, which equals total mission programme services on p. 7. Overhead (management $37.228m, fundraising $118.168m) is spread by `overhead_ratio` 1.230. Exchange expenses ($101.446m, p. 8) are left out on both sides, which is correct. No programme is missing. At the defaults the result splits into advocacy 63%, research 27% and screening 10% (worked out by zeroing the other branches in scratch copies). `beneficiaries` matches: world 0.27, USA 0.73.

Mechanical: lint 0 high / 0 medium / 4 low (two unused reference rows, far-below and spread, both of which the summary explains). Invariants: none violated. normalization-audit: 0 violations for every invariant. check.ts: all models valid. simulation-check: 5% 0.256, 50% 1.00, 95% 4.27 × best guess (stable). The audit scripts rewrote generated/*.json; I restored those files with `git checkout -- generated`.

Previous round: none (first round).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | plausibility | `adv_noncancer_ratio` | The best value (0.5) contradicts the row's own anchor. The explainer says smoking's non-cancer deaths are about twice its cancer deaths, so tobacco wins avert about twice their cancer burden again. In `adv_share_burden_averted`'s worked example, tobacco is half of the 0.1% (0.05% tobacco, "about as much again" from coverage and budgets). That gives a non-cancer ratio of 2 × 0.5 = 1.0. Even with tobacco at a third of the wins, the ratio is 0.67. | Explainers of `adv_noncancer_ratio` and `adv_share_burden_averted` | Set `adv_noncancer_ratio` to {low 0.5, best 0.9, high 1.3}, worked from the same anchors: non-cancer = 2 × the tobacco share of the cancer burden averted (a third to two thirds). Alternatively, change the worked example's tobacco share and the explainer together so that they agree. | +21% at 1.0 (0.00269 → 0.00326) |
| 2 | medium | source | `research_attribution_share_shared` | The denominator that sets ACS's 0.2% share (the #9 swing) rests on "drug companies spend about $80bn a year on oncology research and development (Bloomberg New Economy International Cancer Coalition)". That figure has no URL and is not in `resources`, so it can't be checked. The other anchor (Head et al., $51.4bn over 2016–2023, via Euronews) checks out but covers only public and philanthropic funders. | Euronews page fetched (verified $51.4bn, 2016–2023, "not private sector data"); no source for the $80bn | Add a fetchable source for industry oncology R&D, with its quote, to the explainer and `resources`: the Bloomberg/ICC report's URL, or IQVIA Global Oncology Trends / Global Trends in R&D. If the sourced figure differs, re-derive the 0.2% (range 0.1%–0.6%) from it. | Up to ±25% on research only (≈ ±7% on result) if the total moves by a quarter |
| 3 | low | source | `screen_screenable_share` | The explainer cites 2021 figures ("2.86m of 13.9m"; colorectal "about 9%", breast "about 7%"). The model's own source, WHO GHE 2023 for the USA, gives lung 2,881,802, colorectal 1,576,824, breast 1,341,504 and cervix 215,503 of 14,653,469 DALYs: 19.7%, 10.8%, 9.2% and 1.5%, 41% in all. The high end (37%, "if all lung cancer were screenable") is therefore below the true ceiling. | WHO GHE API, USA 2023, causes 650/680/700/710 | Restate the anchors from GHE 2023 (the same API as `usa_cancer_dalys`) and set the high end to 0.41. Keep 0.30 best: colorectal + breast + cervical 21.5% plus about half of lung for USPSTF 2021 eligibility. | <1% at best (0.31 → +0.3%); widens the high end |
| 4 | low | structure | `adv_years_until_health`, `adv_years_until_effect` | Both are labelled "years from the win", but they are multiplied together as discount factors, so the year between the win and the policy taking effect is discounted twice (11 years in all instead of 10). | Formulas of `adv_dalys_per_person_year` and `adv_discounted_years` | Relabel `adv_years_until_health` as "years from the policy taking effect until the health gain" and set it to 9 (range 2–24). Alternatively, drop the 1-year factor from `adv_discounted_years`. | +2.5% |
| 5 | low | source | `ref_value_per_qaly_gbp` | The quote ("We related 17% of the annual NMB…") doesn't contain the number £25,000. | Glover et al. full text: "using a base-case value of a QALY of GB£25,000" | Replace the quote with that sentence. | none (context row) |
| 6 | low | plausibility | `share_burden_averted_per_research_year` | The worked example credits research with "the screening tests and risk findings behind most of the rest" of the US decline, which mostly came from the decline in smoking. `research_dalys_per_gbp_credited` says the chain "gives [smoking] mostly to policy". The two explainers pull in opposite directions. | Explainers of both rows; Glover: smoking 51% of UK QALYs gained | Say in the worked example how much of the risk-factor share is credited to research (e.g. treatment 30% + screening's test development + a small share of smoking ≈ 0.9–1.2% a year). Either keep 0.25% with that sentence, or lower the best to about 0.2%. | 0 to −5% |
| 7 | low | presentation | `adv_share_burden_averted` | The worked example uses "one or two states' rises" without naming the year's wins. ACS's impact page (fetched) gives ACS CAN's own reach for the year, "25.6M lives impacted", and a "$2 per pack" tax rise projected to cut youth smoking 14.3%. These are better anchors than a generic $1 rise. | ACS Our impact page | Cite the year's state tax rise(s) and the 25.6M reach (as the charity's claim) in the worked example. Re-derive the 0.05% tobacco part from them. | judgment re-anchored; sign unknown |

## Sources checked

| Row | URL | Status | Note |
|---|---|---|---|
| `research_spend`, `advocacy_spend`, `total_expenses`, `program_expenses`, fact `patient_support_fy2026` | cancer.org combined-financials-2026.pdf, p. 7 | verified | Patient support 426,454; Research 193,291; Advocacy 55,066; Total mission program services 674,811; Total expenses 830,207 (thousands), year ended March 31, 2026, a full twelve months (note 1) |
| `personnel_research`, `personnel_advocacy`, `personnel_support_overhead`, fact `patient_support_personnel_fy2026` | same, p. 8 | verified | Personnel costs 212,686 / 35,086 / 34,013 / … / 13,935 / 75,137 / 89,072; grants for research 128,547; exchange expenses 101,446 |
| fact `prevention_share_of_support` anchors | same, notes 4 and 5 | verified | Donated media "Cancer prevention and screening" $41,939 (with restrictions); joint costs to patient support $76,314 |
| `@next_dollar.american_cancer_society` (room) | same, p. 17 | verified | Financial assets managed for liquidity $472,014; board policy five to nine months; 472.0 / (830.2/12) = 6.8 months; revenue 910,838 |
| `disease_dalys_per_year` | WHO GHE API (cause 610, 2023) | verified | Sum over 183 countries, all ages: 261,286,377 |
| `usa_cancer_dalys` | same | verified | USA: DALYs 14,653,469, YLL 13,567,194, YLD 1,086,275, deaths 626,361 |
| facts `death_ages` cancer_*_world / _usa | same | verified | World deaths/DALY 0.036419, YLD share 0.031796; USA 0.042745 and 0.074131; USA 70–79 194,416 and 80+ 195,607 (80+ share of 70+ 0.5015) |
| `years_until_effect`, `ref_health_irr` | Glover et al. 2014 (Europe PMC XML) | verified | "estimated elapsed time of 15 years"; "best-estimate IRR of 10%, compared with 9% previously estimated for cardiovascular disease research" |
| `ref_value_per_qaly_gbp` | same | unsupported by its quote | £25,000 is in the text, but not in the quoted sentence (finding 5) |
| `screen_mortality_rrr` | Lin et al. 2021 (Europe PMC record, PMID 34003220) | verified | "flexible sigmoidoscopy vs no screening was associated with a decrease in CRC-specific mortality (incidence rate ratio, 0.74 [95% CI, 0.68-0.80])"; gFOBT 0.91 at 19.5 years, so the 15% low end is supported |
| `research_attribution_share_shared` anchor | Euronews 2025 (Head et al.) | verified | "$51.4 billion", 2016–2023, government and philanthropic only |
| same, industry $80bn | none given | unsourced | Finding 2 |
| `adv_share_burden_averted`, `research_spend` explainers | ACS Our impact | verified | $123.9M new grants FY2026; 34% mortality decline since 1991; 23 states with biomarker laws as of March 31, 2026; 665 trainees |
| `screen_screenable_share` anchors | WHO GHE API, USA 2023 by cause | mismatch (stale year) | Finding 3 |

## Drivers

1. `$missing_data_discount` (shared value judgment, 0.5): it scales all three branches.
2. `adv_share_burden_averted` (judgment, 0.1%, 0.02–0.4%; advocacy is 63% of the result). It is anchored on a worked tobacco-elasticity example. Naming the year's actual wins would improve it most (finding 7).
3. `$win_years_counted` and `@next_dollar.american_cancer_society` (shared; the latter is sourced room × use × run = 46%).
4. `$discount_rate`, and the research chain's `share_burden_averted_per_research_year` (judgment, 0.25%, anchored on US mortality-decline decompositions and on the British Heart Foundation model's 0.3%).
5. `research_attribution_share_shared` (judgment, 0.2%): its industry denominator needs a source (finding 2).

Peers: 0.008× the global-health median. The summary gives the reasons, and the rows confirm them: the 15-year research lag (wait discount 0.555), ACS's 0.2% share of the field, coalition shares for advocacy (30%) and screening (15%), the 0.5 missing-data discount and 46% at the next dollar. Against the same template, `total_adj` is 0.0026, versus British Heart Foundation 0.0038 and St. Jude 0.053. The result sits beside St. Jude's research model (0.0020) and below the British Heart Foundation model (0.019), whose larger advocacy branch and share of a smaller field explain the gap. Nothing here is tuned toward a peer.

Findings by severity: high 0, medium 2, low 5.

Verdict: pass (high 0, medium 2, low 5)
