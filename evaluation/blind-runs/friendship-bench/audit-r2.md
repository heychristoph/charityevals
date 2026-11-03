# Audit: friendship-bench-charityevals, round 2

Result: 0.04534 wellby/$ = 2.960 years of healthy life per $1,000 (joint 0.052–230; model's own ranges 0.136–35.2); global-health median 7.505 (×0.39). Verdict: **fix needed** (one high finding).

Scope: talk therapy in Zimbabwe in 2024: benches at about 385 clinics, the Open Line, Youth Friendship Bench and CKT groups. It covers both organisations' spending. The Zimbabwe PVO is built from the US affiliate's Form 990 grant ÷ (1 − other funders' share), plus the US affiliate's own spending. Research and international FB-in-a-Box trainings (about 10%) are left out and stated as partial coverage (Convention 12). This is unchanged from round 1 and still sound. The PVO publishes no statements, and the charity's site lists only impact and annual reports, no financial statements (checked on friendshipbenchzimbabwe.org/impactreports). Reach and cost are from the same year (2024). Cost per client seen is about $12, against the KBF press figure of $13–16.50 and the 2026 ask of about $10.80 ($4.1M ÷ 380,000).

Mechanical: lint 0 high / 0 medium / 2 low (`rct_effect_se_points` and `prior_effect_se` have no range; both are explained as spreads for the weights, which is acceptable). Invariants: none. normalization-audit: not run (it excludes this model with its charity id, as briefed). `check.ts friendship-bench-charityevals`: all models valid.

Previous round:
1. Dose shape (0.3 front-loading): **resolved** (best 1, proportional, as the pilot finds).
2. Caseness asked twice: **resolved** (now only in `evidence_adj`, range down to 0.4).
3. 13,864 misread as the share screened: **resolved in the model**, but the write-up still repeats the misreading (finding 5 below).
4. Duration: **resolved** (2.5, 1.5–4, with anchors). Weobong 2017 verified.
5. Attribution from hours: **resolved** (0.9, 0.7–0.97). Its hours anchor needs updating under finding 1.
6. Monitoring check: **resolved**.
7. Service-share arithmetic: **resolved** (12% / 7%).
8. Contracted services purpose: **resolved**.
9. DIV amount: **resolved** (figure dropped).
10. Suicide rates by age band: **not resolved** (answered with a note). Re-checked: the WHO GHO API still returns HTTP 500, and the WHO Mortality Database (via OWID) has no Zimbabwe series. See finding 7.
11. `salary_gap`: **resolved in the model**, but the write-up is stale (finding 5).
12. Lint lows: **resolved** (the explainers say "a spread, no range").
13. Reach inconsistencies: **resolved** (noted in `people_reached`).
14. Write-up rounds list: **resolved**.

Blind-run note: no web search was run. Fetched only: the charity's site and its Drive reports (annual 2024 and 2025; impact reports Q1–Q3 2024, Q1–Q2 2025), the Europe PMC API (Weobong 2017), the WHO GHO API (HTTP 500) and OWID's WHO Mortality Database CSV. No evaluator's cost-effectiveness figure for Friendship Bench was seen.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | high | source | `follow_up_sessions` (feeds `sessions_per_client` → `implementation_adj`, the top non-shared driver) | The point value of 47,073 follow-up sessions for 2024 is contradicted by the charity's own quarterly impact reports for the same year. Q2 and Q3 alone report 157,569 follow-ups, and Q1–Q3 report 162,276. So 47,073 can't be the year's total on the quarterly definition. The explainer's own range anchor cites "the first two quarterly reports of 2025" (no URL in the model; their programme matrices are images that don't extract), while the 2024 quarterlies, for the modelled year, are not used. The count's uncertainty is also carried inside `dose_shape_factor`, so one row asks two questions (count and dose-response shape; Convention 5). | Q1 2024 impact report, programme matrix: clients seen 69,721; follow-up sessions 4,707. Q2 2024: clients 71,388; follow-ups 75,256. Q3 2024: clients 76,087; follow-ups 82,313. Q1–Q3: 162,276 follow-ups for 217,196 clients (0.75 per client). Annual report 2024 p. 9: 47,073 for 295,770 clients (0.16). Harare alone has 10,380 follow-ups in Q3 against 3,758 for the whole year in the annual matrix. (impactreports page, Drive ids 11JxYcf8…, 1rpPGQcp…, 1Tn-Yt4U….) | Make `follow_up_sessions` a ranged `estimate`. Best 220,980 = 295,770 × 162,276 / 217,196 (the Q1–Q3 2024 rate applied to the year's clients), citing the three 2024 impact reports with their matrix figures. Low 47,073 (the annual matrix). High 313,000 (the Q2–Q3 rate of 1.06 per client). Then narrow `dose_shape_factor` to the shape question only: best 1, low 0.5 (the pilot's convex Table 3), high 1.6 (a flattening dose-effect curve, Howard et al. 1986). Drop the count anchors from its explainer. Update `sessions_per_client`'s explainer (about 1.75), `implementation_adj` (about 0.35), the summary and the write-up ("about 1.2 sessions"). Update `attribution_share_shared`'s hours anchor too: about 517,000 sessions ≈ 320,000 hours ≈ 6% of full time. Best 0.9 still holds. | 2.960 → 4.461 (+51%). Model's own joint range 0.11–45 (from 0.14–35). `follow_up_sessions` then shows in the tornado (2.96–5.26) and `dose_shape_factor` reads 2.23–7.14. |
| 2 | medium | sensitivity | `trial_weight_discount` | A top-6 judgment (2.2–3.7) with reasoning but no reference class for how much single-trial effects shrink at scale or on replication (Convention 10). | Explainer: "the kind of result that shrinks on replication" with no source. | Anchor 0.7 on a published reference class. Options: Vivalt 2020 (J Eur Econ Assoc 18(6), how much impact-evaluation effects generalise, larger for small and NGO-run studies), or government scale-ups of NGO-trial interventions (Bold et al. 2018, J Public Econ 168, contract teachers: the effect vanished under government delivery). State what share of the trial-vs-prior gap each implies, and keep the range 0.4–1. | none at best (range already 0.4–1) |
| 3 | low | source | `evidence_adj` (caseness part) | The caseness anchors skip the modelled year. The 2024 and 2025 quarterly follow-ups also report the share of clients above the cut-off. | Q3 2024 impact report: 966 of 1,003 followed-up clients scored above 8 at baseline (96%). Q1 2025: 434 of 439 (99%). | Add the Q3 2024 figure (96%) beside the 2025 annual figure. Say both cover only reachable, sampled clients, so 0.9 (0.45–1) stays the best guess. | none |
| 4 | low | double-counting | `depression_suicide_rr`, `total_adj` (deaths) | "Some have no disorder" lowers the relative risk (5). The deaths are then also multiplied by `total_adj`, which includes `evidence_adj`'s caseness part (0.9). So caseness is counted twice for suicides. | `depression_suicide_rr` explainer; `uov_valued_outside_wellbys = … × total_adj`. | Drop "and some have no disorder" from the relative risk's reasoning, so caseness lives only in `evidence_adj`. Keep 5 for mild-to-moderate distress, or raise it slightly if that part was moving it. | deaths are about 5% of the result, so under 1% |
| 5 | low | presentation | write-up | Three stale statements. (a) "Your dollar's share uses the shared staff-pay defaults for … local delivery staff": the model now reads `@staff_pay.gap_health_field`. (b) "In 2025 only 13,864 of 336,215 clients seen had a baseline symptom score recorded": round 1 finding 3 showed that 13,864 is the six-week follow-up cohort (the 2024 report calls it a 10% random sample), not the share screened. (c) "about 1.2 sessions … would put most clients at one session" changes under finding 1. | writeups/friendship-bench-charityevals.md; annual report 2025 p. 12 ("From a target cohort of 13,864 clients enrolled"). | (a) "the shared staff-pay defaults for staff-delivered programmes and health and field staff". (b) Replace with: the charity's session counts disagree between reports (0.16 follow-ups per client in the 2024 annual matrix, 0.75 in its 2024 quarterlies, 0.01 in the 2025 annual), and a split of clients by sessions received would narrow the result most. (c) Restate the sessions after finding 1. | none |
| 6 | low | presentation | `sessions_per_client` | Labelled "(context)", but it is on the result's path (it feeds `implementation_adj`). | Formula of `implementation_adj`. | Relabel "Sessions per client seen". | none |
| 7 | low | normalization | `suicide_rate_female`, `suicide_rate_male`, `adult_rate_vs_crude` | Still all-ages crude rates × a judgment multiplier. The template asks for the clients' age band from WHO GHE. | WHO GHO API HTTP 500 (re-checked 2026-11-03). WHO Mortality Database has no Zimbabwe series. | Read WHO GHE 2021 deaths by cause, age and sex for Zimbabwe from the GHE country downloads (the who.int GHE "leading causes of death" data page, xlsx). Or, where WHO has none, IHME GBD 2021 suicide rates for ages 15–49 by sex. Add them to facts/death_ages.json and drop `adult_rate_vs_crude`. | under 2% |

## Sources checked

| Row | URL | Status | Note |
|---|---|---|---|
| `follow_up_sessions` | Annual report 2024 (Drive 1OdRIWIc…), p. 9 | verified as printed, but contradicted | Matrix: clients 295,770, partners 7,382, Open Line 5,895. The follow-up row totals 47,073 (round 1), but the Q1–Q3 2024 impact reports sum to 162,276 (finding 1). |
| `follow_up_sessions` (2025 anchors) | Annual report 2025 (Drive 1jcoxqvN…), p. 11 | verified | 336,215 clients; 3,284 follow-up sessions. |
| same (2025 quarterly anchors) | Q1 2025 (1U6FtkVu…), Q2 2025 (1so97KZJ…) impact reports | unsupported in the model, unreadable here | Not cited with a URL in the model. Their matrices don't extract as text. Q1 2025 gives 79,683 clients seen. |
| `people_reached` | Annual report 2024 p. 6 | verified | 285,900 + 9,870 = 295,770. |
| `evidence_adj` anchors | Annual report 2025 pp. 12–13 | verified | Cohort 13,864, follow-up contacts 5,686 (41%), paired scores 3,009 (22%), 2,990 symptomatic, recovery 85.2%. |
| `trial_weight_discount` anchor | Annual report 2025 p. 13 | verified | "reliability issues missed counselling sessions and incomplete follow-ups by the lay health workers". |
| `female_share_clients` | Annual report 2025 p. 11 | verified | "we serve 64% of women". |
| `effect_duration_years` anchor | Weobong et al. 2017, PLoS Med (PMC5595303) | verified | "HAP participants maintained the gains they showed at the end of treatment through the 12-month follow-up" (3- vs 12-month difference −0.34 BDI-II, p = 0.74). |
| `attribution_share_shared` | Annual report 2024 pp. 7, 10 | verified | 2,773 community health workers; integration into government structures from 2024, national rollout by 2028. |
| `support_cost_share` | Annual report 2024 p. 20 | verified | US$8M for 2024–25: $4.9M (60%) programmes, $3.1M (40%) support. Cancels in `cost_total`. |
| `zimbabwe_spend` context | Annual report 2025 p. 20 | verified | US$4.1M to reach 380,000 people in 2026. |
| `zimbabwe_other_funding_share` | Annual report 2024 pp. 11–13; 2025 p. 7 | verified | Global Fund, WHO FRIENDZ, USAID DIV ("abruptly came to an end"; USAID withdrawal in Q1 2025), OPHID. No amounts. |
| `us_total_expenses`, `us_grant_to_zimbabwe`, `rct_effect_points`, `rct_effect_se_points`, `trial_median_sessions`, `prior_effect_sd`, `prior_effect_se`, suicide rates | as in round 1 | verified in round 1, unchanged | Values and quotes are the same as round 1's verified figures. |
| `adult_rate_vs_crude` (WHO GHE) | ghoapi.azureedge.net SDGSUICIDE / MH_12 | unreachable | HTTP 500, as the builder reports. |

## Drivers

1. `$daly_per_wellby` (shared slider): the site's, not a finding.
2. `dose_shape_factor` × `follow_up_sessions` (judgment × observed point value): the share of a full course a client seen gets. The count is the larger problem: the charity's own 2024 figures run from 0.16 to about 1.06 follow-ups per client (finding 1). Fixed, this is the single largest swing.
3. `effect_duration_years` (judgment, 1.5–4): anchored on the trial's 6 months and HAP's 12 months.
4. `evidence_adj` (judgment, 0.4–1): caseness and response bias, anchored on the charity's own follow-up shares.
5. `trial_weight_discount` (judgment, 0.4–1): needs a reference class (finding 2).

What would most improve the model: one consistent count of sessions per client for 2024. For example, the charity's LHW register split by sessions received, or the 10% random follow-up sample asked how many sessions each client attended. That would replace both the follow-up count and much of the shape judgment. Next would be the Zimbabwe PVO's audited 2024 statements (the other-funder share and the support split).
