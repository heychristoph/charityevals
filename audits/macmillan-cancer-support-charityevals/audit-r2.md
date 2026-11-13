# Audit: macmillan-cancer-support-charityevals, round 2

Result: 2.017e-6 daly/$ = 0.002017 years of healthy life per $1,000 (combined range 3.8e-4 – 0.0108; joint low–high on the model's own ranges 3.4e-5 – 0.047); cause median 0.3585 (×0.0056). Verdict: pass.
Model-sha: 9c880c8ba65e1f579fcd7bbea6d47be4c3f29d039a54be2a35c2e0014f2fc0bb

Scope: all five charitable areas of note 11 (p. 106), year to 31 December 2025. The cost is now on a cash basis for grants: direct £68,523k + support £11,553k + grants paid £56,590k (note 21) = £136,666k → $180.1m, ×1.519 overhead = $273.5m. Each area is still a branch, and Data, Evidence and Research is counted as cost only. charities/macmillan-cancer-support.json keeps the accounts' in-year £112,056k as `spending.programme` and note 11's five lines at $1.3175 (all checked). That is right for 2.17, which wants the accounts' programme expenses, not the model's cost basis. No programme is left out.

Mechanical: lint 0 high / 0 medium / 6 low: the evidence_adj diagnostic; three unused context rows (`service_spend_gbp`, `professional_spend_gbp`, `research_spend_gbp`), whose explainers say they are context; far-below and spread, both explained in the summary. Invariants: none. normalization-audit: 0 violations for any invariant (generated/ restored afterwards). simulation-check: stable, 5% 0.239×, 50% 1.0×, 95% 3.03× the best guess. check.ts: all models valid.

Where the result comes from (DALYs before the +10% unmodelled share, total 501.5):
- Welfare rights: gross 1,009.5 less the taxpayers' cost 646.9 gives a net 362.6 (72%).
- Grants: 59.5 (12%; up from 32, now that the missing-data marker is 1).
- Support Line, Buddies and online: 43.3 (9%).
- Professionals: 22.2 (4%).
- System: 11.2 (2%).
- Communities: 2.7 (0.5%).

The net welfare gain is 36% of the gross.

Previous round:
1. high, taxpayers' cost: **resolved**. `taxpayer_cost_uov` is in the main chain (`wr_uov = wr_gross_uov + taxpayer_cost_uov`) with no side-effect tag. It is valued at `consumption_na` (national accounts, 2025 dollars, $34,738), with `mcpf` 1.2 (1.0–1.5) and `uk_payer_multiple` 1.1 (0.85–1.5), over the same `income_years` annuity and the same `wr_total_adj` as the gain. This matches Habitat's `funds × mcpf / (payer_multiple × NA consumption)`. One residual problem: `mcpf` is typed again, not shared (finding 2).
2. medium, years in the £112m: **resolved**. `wr_years_in_figure` is a judgment, 1 (0.7–1.5), and the explainer cross-checks it against Moffatt: £70.30 a week → about £5,600 at 2025 prices, against the model's £5,090.
3. medium, claimants' consumption: **resolved**. It is now anchored on ONS Family spending FYE 2025 (£407.30 against £676.60 a week, verified).
4. medium, system cost per person: **resolved**. It is re-anchored on Improving the Cancer Journey, and the NTF loans are excluded and explained.
5. medium, cost basis: **resolved**, on the cash basis as recommended. The change brings in new problems (findings 1, 3 and 7).
6. medium, grants marked thin: **resolved** (`grant_missing_data_adj` = 1, with its own row).
7. low, professionals' counterfactual: **resolved** (`prof_counterfactual_adj` 0.6, 0.3–0.9, in `prof_total_adj` and `counterfactual_adj`).
8. low, Zhang title: **resolved in the model**, but the write-up's Sources list still has the old title (finding 6).
9. low, wording: **resolved** in (a) and (b).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | missing-adjustment | `program_spend` (cash basis), `prof_practice_share` | The cash basis now counts £56.6m of grants paid in 2025, mostly on commitments made in earlier years (commitments at 1 January £133.5m). Those commitments come from the years when Macmillan funded NHS posts and services: the report says it is "moving away from our historical approach of funding individual posts for a fixed, short-term period", and its 2024 grant awards were £52.9m. The posts still being paid for in 2025 deliver care that the model doesn't credit anywhere. The professionals branch says the posts are "paid by the NHS" and credits only learning. So the cash-basis change added the cost of the funded posts and centres but not their effect. | AR p. 25 (posts), note 21 p. 113, note 11 p. 106; `prof_practice_share` explainer. | Add a funded-posts branch. `posts_share_of_grants_paid` is a judgment of the share of the £56.6m paid to post grants (anchor it on Macmillan's separately published grants list, which note 11 cites, or on the 2023–24 accounts' split). Funded posts = that money / a cost per post of about £50k (`@cpi.gbr`-dated NHS Band 6–7 pay with on-costs). Then: × patients per post (the existing 100, 40–300) × `prof_effect_sd` and `prof_effect_years` × a counterfactual for the post (0.5, 0.25–0.8: the NHS would have funded some of these posts or funded them later) × `support_evidence_adj` × `prof_missing_data_adj`. If the grants list shows no post grants paid in 2025, say so in `program_spend`'s explainer instead. | About +5% to +15% (for example, £20m of posts gives about 400 posts and 40,000 patients, roughly 40–70 DALYs before the unmodelled share). |
| 2 | medium | normalization | `mcpf` | The marginal cost of public funds is retyped in this model with the same value, range and explainer as Habitat's. Two independent judgment rows for one concept are drawn independently in the simulation and can drift apart. The builder's reason (changing Habitat would void its audit receipt) doesn't hold: a rule change is applied mechanically and doesn't need a re-audit. | Habitat `mcpf`; this model's `mcpf`. | Create `facts/public_funds.json` with `mcpf_high_income` 1.2 (1.0–1.5, Dahlby 2008), and `mcpf_low_income` 1.2 (1.1–1.3, Auriol and Warlters 2012) if Habitat's international branch wants it. Point both models' `mcpf` rows at it (`@public_funds.mcpf_high_income`) and re-record Habitat's receipt as a mechanical change. | None at the defaults. |
| 3 | low | scope | `program_spend` | The grants to individuals (£1,444k) are probably missing from the cash cost while the grants branch credits them. Note 21 is the roll-forward of grants held as liabilities. Macmillan grants are "recognised in the year in which they are paid" (accounting policy), so they never pass through that creditor, and "grants paid during the year (56,590)" is institutional grants. The statement's figures agree: £22,641k to institutions after releases and discounting, plus £1,444k to individuals, is £24,085k. | Note 11 p. 106, note 21 p. 113, accounting policies. | Set `program_spend = (direct_costs_gbp + support_costs_gbp + grants_paid_gbp + grants_individuals_gbp) * usd_per_gbp`, the same in `program_expenses` and `total_expenses`, and say why in the explainer. | −1%. |
| 4 | low | double-counting | `outcome_total`, `unmodelled_benefits_adj` | The +10% for what isn't modelled multiplies the net total, including the negative taxpayer term. So it shrinks as the taxpayers' cost grows and flips sign when the net goes negative (the joint low with shared defaults is −6.1e-6). Habitat applies its unmodelled share to the households' gross value so that "its sign doesn't flip when the net does". The items listed (carers, suicides averted, energy advice, admissions averted) don't scale with the taxpayers' cost. | Rows; Habitat `outcome_total`. | Apply it to the positive branches only, as `dalys_from_wellby + (wr_gross_uov + grant_uov) / $uov_per_daly`, added to the net. Re-judge the share against that larger base: about 5% (−3% to +15%) keeps the items' value about the same. | Near 0 if the share is re-judged; +13% if 10% is kept on the gross base. |
| 5 | low | scope | `system_people`, `communities_people` | The reach of the system and community branches comes from note 11's in-year commitments (£17.4m, £5.3m), while the cost now counts grants as paid. The two branches together are 2.5% of the result. | Rows. | Say in `system_people`'s explainer that the in-year split is used as each area's share of the year's activity, or scale both by `grants_paid_gbp / 31,980k` for their grant parts. | Under ±1%. |
| 6 | low | presentation | write-up | (a) "Every branch is counted at half" contradicts the write-up's own line that grants aren't discounted for missing data, and the model `summary` lists "welfare rights and grants" as thin too. (b) "How poor the claimants are (40-85% of average consumption)" is stale: the range is 45–90%. (c) The Sources list still has the old Zhang title ("Telephone-based interventions on psychological outcomes"). (d) The Summary and the model `summary` both say benefits are "worth about £8,500 a year to each" household, but that is the identified figure; the model counts £5,100 awarded. | Write-up; model `summary`. | (a) "Every branch except grants is counted at half"; in the model summary, drop "and grants" from the thin list. (b) "45-90%". (c) "Zhang et al., Effectiveness of telephone-based interventions on health-related quality of life and prognostic outcomes in breast cancer patients and survivors (Eur J Cancer Care 2018)". (d) "benefits identified worth about £8,500 a year to each of 13,200 households, of which we count 60% as paid". | None. |
| 7 | low | source | `wr_years_in_figure` | The low end, 0.7 (less than a year of payments), has no stated reason; only the high end is explained. | Explainer. | Add the reason for the low end (for example, if part of the £112m is a lump-sum or partial-year award), or set the range to 1–1.5 and keep it asymmetric. | Within the tornado's 0.0016–0.0025. |

## Double counting

- The taxpayers' cost is netted once, with the same `wr_total_adj`, award share, years in the figure and `income_years` annuity as the gain. Correct.
- Grants are donors' money, already in the cost, so no taxpayer term applies. Correct.
- The cash basis doesn't double-count: grants paid replace the commitment column, and the write-backs and discounting fall away with it.
- Unmodelled share on the net: finding 4.

## Sources checked

| Row | URL | Status | Note |
|---|---|---|---|
| direct_costs_gbp, support_costs_gbp | AR 2025 note 11 p. 106 | verified | 68,523 / 11,553 (total 112,056). |
| grants_paid_gbp | AR 2025 note 21 p. 113 | verified | "Grants paid during the year (56,590)"; the roll-forward checks: 133,487 − 56,590 + 33,504 − 11,655 = 98,746. Excludes Macmillan grants to individuals (finding 3). |
| raising_income_gbp | AR p. 94 | verified | 70,903. |
| grants_individuals_gbp | AR note 11 | verified | £1,444,000; £22,641k to institutions + £1,444k = £24,085k on the statement. |
| wr_households, wr_identified_gbp | AR p. 15 | verified | 13,200; £112m "potential" (years: judgment row, finding 7). |
| recipients_consumption_share anchor | https://www.ons.gov.uk/peoplepopulationandcommunity/personalandhouseholdfinances/expenditure/bulletins/familyspendingintheuk/april2024tomarch2025 | verified | £676.60 (all households) and £407.30 (poorest fifth) a week, FYE 2025. |
| wr_years_in_figure cross-check | Moffatt et al. 2012 (verified round 1) | verified | £70.30 a week in 2009–10; ×52 = £3,656; ×about 1.53 UK CPI 2010→2025 ≈ £5,600. |
| mcpf | Habitat's row (Dahlby 2008) | consistent | Same value and range (finding 2). |
| uk_payer_multiple | ONS Effects of taxes and benefits (cited, not fetched) | judgment | Plausible: total taxes are near-proportional to gross income by fifth. Against consumption that is mildly progressive, so a multiple above 1 has the right sign. |
| system_cost_per_person_gbp anchor | AR p. 38 (ICJ) | judgment | Glasgow's 6 officers and 6,130 people not re-fetched; the branch is 2%. |
| professionals, households_reached, line counts | AR pp. 7, 15, 18, 24 | verified (round 1, unchanged) | |

## Drivers

1. `$missing_data_discount` (shared slider): 5.9e-4 – 0.0038. It moves every branch except grants.
2. `recipients_consumption_share` (judgment, ONS-anchored): 0.0038 – 8.8e-4. The net gain goes roughly as 1/share − mcpf/(multiple × NA level).
3. `$uov_per_daly` (shared): 0.0037 – 0.0012.
4. `income_years` (judgment, 0.75–3): 0.0013 – 0.0034. It still has no reference class. Anchor it on the DWP's average PIP or Attendance Allowance award duration for claimants with cancer, or on the share of special-rules (end-of-life) claims.
5. `uk_payer_multiple` (judgment): 0.0013 – 0.0027. Next are `wr_counterfactual_adj` (0.0013 – 0.0027) and `mcpf` (0.0025 – 0.0014).

What would most improve the model:
- Pin `income_years` to DWP award durations.
- Find out from Macmillan's grants list how much of the £56.6m paid for posts, and credit it (finding 1).
- Ask Macmillan what "potential benefits identified" covers (the years and the award rate).

Verdict: pass. Findings: 0 high, 2 medium, 5 low.
