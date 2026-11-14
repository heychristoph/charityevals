# Audit: jesuit-refugee-service-charityevals, round 2 (scoped verification)
Result: 3.696e-4 daly/$ = 0.370 years of healthy life per 1,000 dollars (combined range 0.028–4.9). Verdict: **PASS** (no high findings).
Model-sha: 64d1245a1de3d4936d2c5094437a91bd35174211a44ead319478f4112e491aca
Scope: the changes made for round 1's findings only; the scope, spending lines and sources verified in round 1 are unchanged.
Mechanical: lint 0 high / 0 medium / 1 low (spread 2,739× on the model's own ranges; the summary says so). `check.ts`: all models valid. Invariants: none.
Previous round: 1 resolved; 2 resolved (see finding 1 for one residue); 3 resolved; 4 resolved; 5 resolved by a stated judgment (the site has no Chad PPP factor, the explainer says so and bounds the effect); 6 resolved; 7 resolved; 8 resolved (see finding 1).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | source | `edu_spend` explainer vs `edu_access_share` | `edu_spend` still cites the Chad lead-partner statement as "Annual Report 2024 p. 8" (the PDF page), while `edu_access_share` now says printed p. 14. Round 1 asked for "printed p. 14 (PDF p. 8)" in both. The new quote in `edu_access_share` ('delivering a wide range of services in 19 refugee camps') differs from the wording round 1 verified ("lead partner for education response … in 19 refugee camps"); I could not re-extract the PDF text in this round to confirm the new wording. | Model rows `edu_spend`, `edu_access_share`. | Use "printed p. 14 (PDF p. 8)" in `edu_spend`, and quote the sentence round 1 verified. | none |

## Checks
| Item | Status | Note |
|---|---|---|
| `edu_counterfactual_adj` | fixed | One question (would another provider have run these schools); says the children's lack of schooling is in `edu_access_share`; anchored on the 2025 cuts, p. 13. 0.85 (0.6–1) kept with that reason. |
| `edu_access_share` | fixed | 25% (10–45%), stated as a judgment because JRS publishes no pupil count; the 2025 US cut to Chad's camp secondary schools is the stated reason for the best guess; printed p. 14 given (see finding 1). |
| `mhp_suicide_rate`, `_rr`, `_excess_removed`, `_suicides_averted_per_client`, `mhp_value_per_suicide`, `mhp_uov`, `mhp_dalys_from_uov` | sound | Recipe matches templates.md: rate 10/100,000 (5–20) × (RR 5 − 1) × 15% removed × linear fade (half) × 0.75 years, no discount (deaths come within a year or two); valued at `uov_per_death_age_15_49` × `$life_value_multiplier`; × `mhp_focused_share`, `mhp_people`, `mhp_total_adj`; in `uov_bridged` (sum of branch UoV incl. `mhp_uov`, `hea_uov`); `mhp_dalys` = bridge from UoV + wellbys, so the branch weights match. Units consistent. Size about 0.3 suicides per 1,000 clients adjusted, i.e. under 1% of the result. Ranged judgments, each with a reason; the rate's explainer gives WHO's about 9 per 100,000 as the anchor and says no country-specific figure is on the site. |
| `hea_dalys_per_person`, `hea_deaths_per_person`, `hea_uov`, `hea_dalys_from_uov` | sound | Illness 0.005 (0.001–0.02) plus deaths 1e-4 (2e-5–4e-4) at about 50 healthy years per death reproduces the old 0.01 total; deaths now valued by `value_per_death` and move with `$life_value_multiplier`; no double count between rows. |
| `ppp_factor` explainer | ok | Sudan stands in for Chad; `facts/givewell_chad.json` carries no PPP factor, and no Chad fact is named on the site; effect bounded at under 1%. |
| `mhp_attribution_share` explainer | fixed | Now quotes p. 20's "trained refugee and volunteer community workers"; unpaid staff are in `salary_sacrifice`. |
| `unmodelled_benefits_adj` | fixed | Suicides are no longer in its list; 5% (−10% to +20%) unchanged and still plausible. |
| `edu_spend` explainer (scholarships) | fixed | "with scholarships" dropped. |
| `scripts/beneficiary-countries.ts` note | fixed | Uses "West Africa" ($18.4m) as on p. 33; region sums 18.4+14.8+8.5+6.7+5.7+1.6+23.3+4.1 = 83.1 (matches the chart's regions; the rest is the international office and rounding). |
| Summary | ok | 0.37, range 0.03–4.9 equal the audit's 0.370 and 0.028–4.895; says education carries over 90% and that the result is mostly uncertainty. |
| Write-up | ok | Says round 1 ran and what changed, 0.40 to 0.37; "10–40%" now matches the rows. |

## Drivers
Unchanged from round 1: `$missing_data_discount`, `$discount_rate`, `$uov_per_daly`, `edu_earnings_per_sd`, `edu_persistence`, `edu_evidence_adj`, and `edu_access_share` (now 25%, 10–45%), which remains the input a pupil count would improve most.
