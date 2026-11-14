# Audit: danish-refugee-council-charityevals, round 2
Result: 7.027e-5 daly/$ = 0.0703 years of healthy life per 1,000 dollars (combined range 0.016–0.30); cause median 0.0693 (×1.01). Verdict: pass.
Model-sha: 547a8e5c8a3d77ee6b24bda7caea5b9de575da2a7477ea3989b2424c904e94d6
Scope: unchanged from round 1 and still right: every programme line of DRC's audited 2025 accounts (notes 5, 6 and 9, pp. 64-66): projects, pools etc. DKK 3,144.3m, the ministry's grants 38.8m, own activities 36.6m, special-purpose activities 11.5m = DKK 3,231.3m, with fundraising 40.8m and administration 197.6m as overhead (1.074). I re-checked all seven figures and payroll 1,281,610 in the report text; charities/danish-refugee-council.json `spending` and its one line ($488,329,363) match. facts/fx.json usd_per_dkk_2025 (1/6.617 = 0.151126) was verified in round 1 and hasn't changed. Twelve branches, all thin.
Mechanical: lint 0 high / 0 medium / 0 low; invariants none; normalization-audit no violation for this model (INV-14 now 0 violations across the site; the only violation anywhere is INV-15 for malaria-consortium-insecticide-treated-net-itn, which isn't this model's; generated/ restored); check.ts all models valid; simulation 5%/50%/95% = 0.54/1/1.87 × best guess (stable).
Previous round:
1. INV-14 share_5_14_of_over5: resolved. facts/death_ages.json crisis_share_5_14_of_over5 is a judgment, 0.2 (0.1-0.4), and names its anchor. All five models read it (DRC, NRC, MSF relief, United Way, USA for UNHCR), and INV-14 reports 0 violations. share_under5 and share_15_49_of_over15 stay as model rows. That's acceptable: they don't trip INV-14, and the round-1 fix only asked for them as a precaution.
2. Spending shares: resolved. The anchor is now in the explainers sector by sector, and it reproduces. The NRC model's direct costs give $107 for cash (NOK 2,002.8m / 1,800,047 at 10.392 kroner a dollar), $65 for food security, $72 for shelter, $16 for WASH, $41.8 for legal aid and $47.3 for protection. DRC's people at those costs sum to $220.0m, × 1.0593 (NOK 470.6m / 7,934.7m) = $233.2m. The carve-out is $7.9m + $60m + $17m + $4.5m + $10m = $99.4m, which leaves $375.8m, so the scale-up is 1.611. That gives cash 30.7%, food security 5.82%, shelter 7.62% and infrastructure 6.43%. The ranges run from no scale-up to full pro rata (19.1/38.9, 3.61/7.36, 4.73/9.63). Infrastructure's 3-10% is wider on purpose, as its explainer says. The $60m for mine action is unsourced but stated as a judgment. Halving it to $30m moves the result by +4.8%, which is inside cash's range.
3. csh_mic_share: resolved. 0.43 (0.3-0.6) is valued at ukr_consumption, and deaths are counted on 1 − csh_mic_share only.
4. Template's ln form: resolved in ln_gain_per_person and in both terms of csh_ln_gain_per_person (t × ln(1 + v/(b t))). The same form is in NRC.
5. Spillover on cash: resolved. market_spillover_share multiplies the consumption terms of both csh_uov and lfs_uov, and it is marked `side_effect: "added"`.
6. Beneficiaries: resolved. I read the p. 49 charts again from round 1's render: Ukraine ≈445, Yemen ≈295, Sudan ≈180, Burkina Faso ≈145, Afghanistan ≈120. The regions are ≈750 (West Africa & Americas), 760 (East Africa & Great Lakes), 650 (Middle East & North Africa) and 940 (Asia & Europe). The split's regional sums are 0.2354 / 0.2384 / 0.204 / 0.2952, plus Denmark 0.027. That is exactly the chart's regional totals over 3,100 × 0.973, and the five largest operations follow the same scaling. The order in the summary and note is now right.
7. sbr_budget_influenced: resolved at $0.9m ($0.25-4m). EUR 7m × 1.1287 / 154 = $51.3k, against NORCAP's $111.6k (NOK 711.1m / 613, both without overhead), is 0.46 × $2m.
8. Wording: resolved. csh_people now cites the Cash Consortium of Yemen (pp. 26-27, "36 644 households", verified), and Syria is gone from shl_mic_share's middle-income list.
9. "Denmark (under 0.1%)": resolved (15 of 35,100 healthy years, 0.04%).

Branch shares now (adjusted healthy years, my computation): cash 20.6k (59%), food security 5.4k (15%), shelter 3.8k (11%), WASH 2.7k (7.6%), protection 1.3k (3.8%), infrastructure 0.80k (2.3%), Standby Roster 0.18k (0.5%), mine action 0.14k (0.4%), site management 0.07k, peacebuilding, the Mixed Migration Centre and Denmark under 0.1% each. The summary and write-up shares agree: cash about 60%, food security about 15%, shelter and WASH about 18%, the shelter/WASH/infrastructure group about 20%, protection about 4%, mine action and peacebuilding under 1%, site management/Standby Roster/MMC "about 1%" against 0.7%.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | units | csh_transfer_share | NRC's 50% is transfers over the 'Other' line's direct costs, which exclude project support. DRC's cash spending is NRC's cost × 1.06 for project support × 1.61, so the 1.06 of support costs is also taken as half transfers. On DRC's spending base the same anchor is 0.50 / 1.06 = 0.47. | NRC csh_transfer_share explainer (NOK 1,025m / 'Other' line direct costs); DRC csh_spend_share explainer (× 1.06 "for NRC's project support, which DRC's project costs include"). | Set csh_transfer_share to 0.47 (0.33-0.67), i.e. NRC's 50% (35-71%) ÷ 1.0593, and say so in the explainer. | 0.0703 → 0.0683 (-2.7%) |
| 2 | low | presentation | writeup "Food security", goods_share | The write-up says food security delivers "about $58 a person", but value_delivered_per_person is $61 (475.2m × 5.8% × 55% / 248,600; the row's own explainer says "about $60"). goods_share's explainer says it is "used for food security, cash, shelter and infrastructure", but the cash branch uses csh_transfer_share, not goods_share. | Model rows value_delivered_per_person, csh_transfer_per_person. | Write "about $60 a person" in the write-up. In goods_share's explainer write "Used for food security, shelter and infrastructure (cash uses csh_transfer_share)". | none |
| 3 | low | source | shl_mic_share | The explainer says "repairs to nearly 6,000 war-damaged homes in Ukraine (p. 31)" as if that were 2025's work. The report says the Mykolaiv team has repaired them "since the beginning of its operation": the count is cumulative and covers one oblast. | Annual Report 2025, Ukraine story ("Since the beginning of its operation, the team has also repaired nearly 6,000 conflict-damaged homes", Mykolaiv oblast). | Write "repairs to war-damaged homes in Ukraine (nearly 6,000 in Mykolaiv since the operation began, p. 31)". The 35% judgment can stay. | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| facts/danish_refugee_council.json (all seven), payroll | https://drc.ngo/media/govow2w2/drc_annual-report_2025_final.pdf | verified | Report text: 3,144,332; 38,796; 40,806; 36,610; 197,578; 11,535; 1,281,610. |
| csh_people, er_people, swi_people, pro_people | same PDF | verified | 798 900; 1 047 500; 1 628 400; 1 305 000. |
| csh_people explainer (Yemen) | same PDF, pp. 26-27 | verified | Cash Consortium of Yemen, MPCA to 36 644 households in 2025. |
| sbr_deployments, sbr_budget_influenced anchor | same PDF, pp. 34-35 | verified | 154 experts, 45 operations, "Over EUR 7 million in turnover". |
| beneficiaries, beneficiaries_note | same PDF, p. 49 (round 1's render) | verified | Chart readings as the note gives them; the split reproduces the regional totals. |
| csh/lfs/shl/inf_spend_share anchor | NRC model rows *_spend_nok, *_people, total_expenses; @fx.usd_per_nok_2025 | verified | Costs per person and the 1.0593 project-support ratio reproduce; DRC sums reproduce (#2 of round 1). |
| shl_mic_share explainer | same PDF, Ukraine story | mismatch (minor) | Cumulative Mykolaiv count, not 2025's (#3). |
| @death_ages.crisis_share_5_14_of_over5 | facts/death_ages.json | shared (judgment) | 0.2 (0.1-0.4), anchor stated; read by all five relief models that typed it. |
| @aid_value.humanitarian_vs_cash | facts/aid_value.json | shared (judgment) | 0.2 (0.05-0.8), anchored on the site's relief models; read here and by NRC's NORCAP. |
| @fx.usd_per_dkk_2025 | https://www.irs.gov/individuals/international-taxpayers/yearly-average-currency-exchange-rates | verified (round 1, unchanged) | 1/6.617 = 0.151126. |

## Drivers
1. missing_data_discount and uov_per_daly (site sliders): every branch is thin.
2. baseline_consumption $700 PPP (judgment, the $2.15-a-day anchor shared with NRC and Save the Children) and uov_per_ln_consumption (shared).
3. csh_counterfactual_adj 70% (judgment; ALNAP's 35% of appeals funded, verified in round 1).
4. csh_transfer_share 50% and csh_spend_share 31% (judgments; the spending share's anchor now reproduces from NRC's 2025 line costs). Together they set the $92 a recipient that carries 59% of the result.
5. implementation_adj, attribution_share_shared, unmodelled_benefits_adj (judgments with the relief family's anchors).

What would improve it most: DRC's 2025 spending by sector and its total cash transferred (from DRC directly, or from IATI once coverage passes a fifth). That would replace the NRC-cost allocation and could make the cash branch measured, as NRC's is.

Verdict: pass (0 high, 0 medium, 3 low)
Model-sha: 547a8e5c8a3d77ee6b24bda7caea5b9de575da2a7477ea3989b2424c904e94d6
