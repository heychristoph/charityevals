# Audit: usa-for-unhcr-charityevals, round 2 (verification)

Result: 6.074e-5 daly/$ = 0.0607 years of healthy life per $1,000 (combined range 0.0139–0.265); cause median 0.0994 (×0.61). Verdict: fix needed (one high, from the normalization audit's INV-14; it is a small fix, see finding 1).
Model-sha: cd4496dffbd005e54c43ebc56b53d1235d1c825f35eb689898b041c22d3a0791

Scope: unchanged from round 1 (all three programmes of the 2025 Form 990, $63,325,785). Only the eight round-1 fixes were checked.
Mechanical: lint 0 high, 0 medium, 1 low (spread, the summary says so). Invariants: none in audit-model. check.ts: all models valid. normalization-audit: one violation for this model (INV-14, finding 1); generated/ restored. Simulation: stable (5% 0.52×, median 1.00×, 95% 2.31× of the best guess).
Previous round: all eight findings resolved (below).

## Round-1 findings

| R1 # | Status | Check |
|---|---|---|
| 1 support markup | resolved | `unhcr_exp_all` 3,830.4 and `unhcr_exp_programme` 2,766.8 match Table IV.4 (PDF p. 100, printed p. 98). `unhcr_support_markup` = 1.384. All six reach rows divide by (delivery cost × markup): `hlt_people`, `edu_children`, `liv_households`, `pro_people`, `pro_doc_people`, `sol_return_people`. `rel_cost_per_person` says it is already a full cost; `sol_return_cost_per_person` stays the cash value and its explainer says so. `sol_cost_per_departure` is derived from full spending. |
| 2 documents gain | resolved, with a residual (finding 2) | `pro_doc_gain` = `pro_doc_rights_share` × `pro_doc_rights_gain` = 0.02 × 0.48 = 0.96%. The 48% quote is on p. 4 of Ibáñez et al.: "induced improvements of 48% and 22% in consumption per capita and labor income". Range 18–60% is as stated. The branch fell from 28% of the result to about 17% (1,361 DALY-units of 5,746 for all protection). |
| 3 baseline | resolved | `baseline_consumption` = Σ weights × stand-in baselines = 1,494 (2017 PPP $; Kenya 473, Lebanon 2,769, Bangladesh 922, Ukraine 2,627). Same formulas as american-red-cross-charityevals-international (`survey_to_na_*` ratios, `cpi_2017_vs_2024`). Weights 41/25/17/17% come from Schedule F region totals; all five totals and the grant sums are in the XML (verified). `ppp_factor` (2.58) uses the same weights. `refugee_consumption_share` is a ranged judgment with its anchor. |
| 4 double counting | resolved | The gross rows divide out `implementation_adj`, `leverage_funging_adj`, `wait_discount` and `rel_missing_data_adj`. Exact: every grant branch's total_adj carries exactly those four (each `*_missing_data_adj` is `$missing_data_discount`). `gik_uov`, `gik_wellbys`, `aw_uov`, `aw_wellbys` read them; `aw_total_adj` applies the four once. |
| 5 US clothes | resolved | `gik_us_goods` 771,969 = $628,085 + $143,884 (both verified in Schedule I). `gik_people` is abroad only. The US part: 25,732 people × `gik_us_ln_gain_per_person` 0.00092 at US lowest-quintile consumption, in current dollars on both sides. |
| 6 impact area 2 | resolved | `unhcr_exp_ia2` 1,707.6 matches Table IV.3 (PDF p. 99, printed p. 97). `rel_share` = ia2/total − hlt − edu = 0.327; `pro_share` = 0.400. Write-up says impact areas are audited, the split within them judged. |
| 7 departures | resolved | `unhcr_departures_2025` 37,237 matches Table II.8 ("Departures 58 452 96 262 116 420 37 237", PDF p. 60). `sol_cost_per_departure` = 1,715. The write-up says UNHCR counts departures only. |
| 8 resettled consumption | resolved | `sol_resettled_consumption` = $11,409 from the shared US figures × CPI 2017/2024 × `sol_resettled_vs_low_quintile` (judgment 1, 0.6–1.5). `sol_resettle_ln_gain` divides by the new baseline in the same 2017 PPP base. |

No new error found in the changed rows beyond the findings below. The write-up's branch shares (relief a third, protection a quarter, health a tenth, a seventh for gifts in kind) match the model's DALY shares (34%, 24%, 11%, 14%).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | high | normalization | `liv_years` | The normalization audit's INV-14 (partial) lists this model: "Years the gain lasts" = 2 is typed into five models (care, mercy-corps, salvation-army-international, world-vision, this one) with no shared fact behind it. Round 1 found no violation. | normalization-audit run: INV-14, "usa-for-unhcr-charityevals (1): liv_years = 2". The same figure is typed in four sibling models, so the fix is the site's, not this model's alone. | Create one shared fact for the livelihoods gain duration (2 years) and read it from all five models, or, if the owner prefers, give this row its own label and a reasoned value or range. Do not add a waiver unless the owner accepts one. | none (value unchanged) |
| 2 | medium | sensitivity | `pro_doc_rights_share` | The best guess 2% (0.5–8%) has no reference class. The explainer sets it "so that documents do less per dollar than relief cash", which anchors the judgment on the outcome it is meant to produce, not on the evidence. Round 1 asked for an anchor on the share of UNHCR's refugees in hosts that tie work or services to registration. It is the 3rd driver (0.052–0.097). | Tornado: 0.0516–0.0968. Round-1 finding 2 fix, 'a ranged judgment, anchored on the share of UNHCR's refugee population in hosts with de jure work rights'. | Rewrite the explainer to anchor on a count: UNHCR's refugees in hosts where legal work or services depend on UNHCR or host registration (Global Trends, annual), times the share newly registered each year. Remove the "so that documents do less than relief" clause. Keep the range unless the anchor moves it. | −15% to +60% over the range; about ±0 until the anchor is built |
| 3 | low | structure | `unhcr_support_markup` | The markup is `unhcr_exp_all` (3,830.4, with the $8.6M Junior Professional Officers) over programme, but the sector shares divide by `unhcr_exp_total` (3,821.9). The two totals differ by 0.2%. | Table IV.4: programme 2,766.8 + support 841.6 + management 213.5 = 3,821.9; + JPO 8.6 = 3,830.4. | Define the markup as `unhcr_exp_total / unhcr_exp_programme` (1.381) and drop `unhcr_exp_all`, or say in the explainer that JPO is included. | −0.2% |
| 4 | low | presentation | write-up summary | "about two-thirds of the site's global-health median" — the model's own audit prints ×0.61. | audit-model: median 0.0994. | Say "about 60% of". | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| `unhcr_exp_all`, `unhcr_exp_programme` | https://digitallibrary.un.org/record/4126985/files/A_81_5_Add.6-EN.pdf | verified | Table IV.4: "Programme 2 766.8 72.2 3 818.1 77.4", "Total expenditure 3 830.4 100.0 4 932.6 100.0". |
| `unhcr_exp_ia2` | same | verified | Table IV.3: "Impact area 2 4 624.6 1 714.3 1 707.6". |
| `unhcr_departures_2025` | same | verified | Table II.8: "Departures 58 452 96 262 116 420 37 237". |
| `pro_doc_rights_gain` | the Ibáñez et al. PDF (poverty-action.org) | verified | p. 4, the 48% consumption and 22% labour income quote; also stated in the paper's results (48% on per-capita consumption). |
| `grants_*` (5 regions) | Form 990 XML | verified | RegionTotalExpendituresAmt 19,689,744; 12,112,708; 8,201,757; 6,044,819; 2,218,259. |
| `gik_us_goods` | Form 990 XML | verified | NonCashAssistanceAmt 628,085 and 143,884. |

## Drivers
1. `$missing_data_discount` (shared slider).
2. `$uov_per_daly` (shared).
3. `pro_doc_rights_share` (judgment 2%; needs a reference class, finding 2).
4. `pro_doc_cost_per_person` (judgment $25 delivery cost; the anchor is "a few dollars a record").
5. `refugee_consumption_share` (judgment 45%, anchored on the American Red Cross model's 42%).
