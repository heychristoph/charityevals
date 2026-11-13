# Audit: cancer-research-uk-charityevals, round 1

Result: 3.096e-6 daly/$ = 0.0031 years of healthy life per 1,000 dollars (combined range 0.0002–0.048); cause median 0.3585 (×0.0086). Verdict: fix needed.
Model-sha: 37c39a3dd1ca5476ae712427ca4f0225f0e80efc4af28cf0f71358841cf9ca55
Scope: all charitable spending in the year to 31 March 2026. Research is £441.4m and cancer information and influencing is £32.6m, together £474.0m (note 5, p. 88; SoFA p. 78). Both activities are modelled: a research branch, and a policy and an information branch inside the second activity. Fundraising (£140.2m) and trading's net loss (£0.9m) are spread as overhead (ratio 1.298). `charities/cancer-research-uk.json` matches: £474.0m × 1.3175 = $624,495,000, one line for the one model. No programme is missing.
Mechanical: lint 0 high / 0 medium / 5 low. The lows are 3 context rows not on the path (policy_share_of_info, ref_health_irr, ref_value_per_qaly_gbp, each marked as context), plus far-below and spread (the summary states both). Invariants: none. normalization-audit: no violations, 0 for this model across all invariants. check.ts: all models valid. simulation-check: 5% 0.235×, 95% 5.45× the best guess, stable.
Previous round: none (first round).

Branch shares of the result, from scratch copies with each branch zeroed: research 77%, policy 20% and information 3%. These match the write-up.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | high | source | research_attribution_share_shared | The denominator behind Cancer Research UK's 1.5% share leaves out most of industry's cancer R&D. The explainer scales $16bn of non-commercial cancer research up by Moses et al.'s 58% private share of all US medical research (2012), giving about $38bn in total and $22bn from industry. Cancer is industry's largest research area, so an all-disease private share understates it. The $22bn would be about 8% of global pharma R&D (about $288bn a year), but oncology is 38% of industry-sponsored phase I–III trial starts (IQVIA, Global Trends in R&D 2026). Even at a quarter of pharma R&D, industry oncology R&D is about $70bn. The total field is then about $85–110bn, and Cancer Research UK's $580m is 0.5–0.7% of it, not 1.5%. This is the 5th swing in the tornado, and its anchor doesn't hold for cancer. | IQVIA blog "therapeutic areas driving clinical trial growth" (May 2026): oncology 38% of phase I–III industry trial starts in 2025. BioSpace "Pharma ups R&D investment in 2024": about $288bn global pharma R&D. Moses et al. 2015's 58% is for all US biomedical research, not cancer. | Rebuild the industry part from global pharma R&D (sourced, e.g. EvaluatePharma or IFPMA for the year) × oncology's share of industry R&D (IQVIA's 38% of trial starts, or a spending share if one is published; range 25–40%). Set research_attribution_share_shared to about 0.006 (0.003–0.012), with the low end at industry's full trial share and the high end at non-commercial funders plus a low industry share. Keep share_burden_averted_per_research_year unchanged: it is already calibrated on all advances, industry's included. For one consistent way, apply the same per-field industry share to british-heart-foundation-charityevals, where cardiovascular is a much smaller share of pharma R&D than 58% of the field implies, so its share moves the other way or less. | −41% at 0.007 (0.00182); −26% at 0.010; about −50% at 0.006 |
| 2 | low | source | share_burden_averted_per_research_year | The split "about half of that is earlier detection and treatment, the rest mostly smoking" is unsourced. The ACS page (verified) names smoking, treatment and detection as the drivers of the 34% fall but gives no split. The BHF model's analogue rests on a sourced decomposition (IMPACT, 42% from treatment). The row is the 2nd swing; its reference class is the US decline, which is verified. | ACS pressroom, Cancer statistics 2025: "drops in smoking, better treatment, and earlier detection" with no shares | Cite a decomposition of the US cancer mortality decline, for example the CISNET modelling for lung, breast and colorectal cancer (Plevritis et al. 2018, JAMA, breast: screening and treatment shares; Edwards et al. 2010, colorectal). Or label the half as our judgment within the explainer and keep 0.13%. | none if the decomposition supports about half |
| 3 | low | units | research_spend_gbp | The note-5 research expenditure (£441.4m) includes about £8m of royalty revenue shares passed on to others (p. 9: "Revenue shares … which we pass on to others involved in it"). That is not research. | p. 9 research spend breakdown, £8m revenue shares | Subtract £8m in research_spend_gbp, citing p. 9 (£433.4m), or add a line to the explainer saying it is left in, and why. | +1.7% if subtracted |

## Sources checked

| Row | URL | Status | Note |
|---|---|---|---|
| research_spend_gbp | CRUK Annual report and accounts 2025/26 (ctfassets PDF) | verified | Note 5, p. 88: "Cancer research 115.5 313.5 12.4 441.4"; p. 9 £416m cash basis and the £8m Scotland Institute partner funding as stated |
| info_spend_gbp | same | verified | Note 5, p. 88: "Cancer information and influencing 21.4 2.9 8.3 32.6" |
| charitable_spend_gbp, fundraising_cost_gbp, trading_cost_gbp, trading_income_gbp | same, SoFA p. 78 | verified | 474.0, 140.2, 140.8, 139.9; trading net contribution (1) on p. 8 |
| staff_cost_share | same, note 9, p. 90 | verified | £201.2m staff cost and 5,108 average headcount (1,228 / 3,243 / 637). Rebuilt from these: £116m of £615m is 19% |
| disease_dalys_per_year | WHO GHE xmart API, cause 610, 2021 | verified | Summed 183 countries myself: 254,522,509 DALYs |
| uk_cancer_dalys_per_year | same | verified | GBR 3,681,626 (UI 3,277,448–4,085,805) |
| facts death_ages cancer_* (14 rows) | same | verified | World deaths by band recomputed: <5 39,034; 5–14 59,514; 15–49 998,270; 50–69 3,766,040; 70–79 2,313,566; 80+ 1,997,578. UK bands, deaths per DALY (0.036044, 0.04741) and YLD shares (7,747,236 and 197,708) all match |
| years_until_effect, ref_health_irr, ref_value_per_qaly_gbp | Glover et al. 2014 (Europe PMC) | verified | 15-year elapsed time, IRR 10% (9% CVD), £25,000 per QALY, 17% of UK gains attributed to UK research, £850m by 2009 (in 2011 prices) |
| share_burden_averted_per_research_year (anchor) | ACS Cancer statistics 2025 pressroom | verified | 34% fall 1991–2022 and its drivers; the split between them is unsourced (finding 2) |
| research_attribution_share_shared (anchors) | NCI fact book FY2024; Moses et al. 2015 | partly | NCI's $7.2bn and Moses' 58% are as quoted, but the 58% doesn't carry over to cancer (finding 1) |
| @next_dollar.cancer_research_uk | CRUK report p. 51–52, 78 | verified | £755m spent against £696m income; £295m reserves, 4.7 months, the new three-month minimum; "If we raise more money than we expect, we can increase our funding for research and/or invest in activities that generate more income" |
| adv_* (impact assessment rows) | DHSC Tobacco and Vapes Bill IA | not re-fetched | Same rows and values as british-heart-foundation-charityevals (retrieved 2026-11-03). One cohort recomputed: 11,777,381 / 17 × 1.19 = 824,393 |
| info_share_burden_averted (anchor) | Ironmonger et al. 2015 | not fetched | Judgment on a 3% branch; below the materiality bar for this round |

## Drivers

1. `$missing_data_discount` (shared slider, 0.5): applied to all three thin branches, correctly.
2. share_burden_averted_per_research_year (judgment, 0.13%, 0.03–0.5%). Its reference class is the US cancer mortality decline, scaled to the world by the high-income share of DALYs and halved for the uptake of older advances. It needs a sourced split of the decline (finding 2).
3. `$discount_rate` (shared): the 15-year wait.
4. years_brought_forward (judgment, 5, 2–15): the same as BHF's, and checked against the returns-to-research reference class (the chain is a tenth of Glover's, and the explainer gives the reasons).
5. research_attribution_share_shared (judgment, 1.5%): its denominator is too small for cancer (finding 1). Fixing it is the change that would most improve the model.

The ranges are wide but argued, not a reflexive ±. The result sits at 0.0086× the cause median, and the summary gives the reason: a 15-year wait, a large field, a slow fall in cancer mortality, and the next-dollar share. Finding 1 would widen the gap. That is a counting rule, not something to tune toward a peer.

Verdict: fail. High 1, medium 0, low 2.
