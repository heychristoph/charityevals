# Audit: sentinel-bio-charityevals, round 3 (verification of the changes since round 2)
Result: 0.004651 daly/$ = 4.65 years of healthy life per 1,000 dollars (combined range 0.35–61.3; model's own ranges 1.6–10.7); cause median 5.26 (×0.89). Verdict: pass.
Model-sha: ce1413b842bdf016a171e61a1f5e42422f64909e201ed7bcdcadefca26ad8518
Scope: unchanged from round 2 (everything spent in the first tax year, 16 May to 31 December 2024). Only the changes since round 2 were checked.
Mechanical: lint 0/0/1 (pol_cost_share unused, marked as context), invariants none, normalization-audit 0 violations (generated/ restored), check.ts all models valid.

Previous round (round 2):
1. **(medium, branch shares) resolved.** Scratch runs at the defaults: no fellows (fb_people 0) −20.1%; no typical grants (bio_cost_share 0) −50.1%; no CSR (value_csr 0) −25.3%; no advised gift −3.8%. The summary and the write-up say half, a fifth, a quarter, a few percent: right.
2. **(low, prior_dollar_value read mode) not changed, accepted as a known limitation.** It needs an engine change. The effect is about +1.9% (round 2's scratch run), well below the 10% medium line, and the rows are the shared ones word for word. It stays an engine task for the owner (normalization.md 2.13).
3. **(low, fb_people cost) resolved.** `umd_fellowship_committed` = 164,468, observed, with the grant page's quote ("We provided the University of Maryland with $164,468 for a fellowship …") and URL. `fb_people` = 1 + grant_umd_fellowship / umd_fellowship_committed = 1.689, with its explainer. Result 4.72 → 4.65 (−1.5%), as predicted.
4. **(low, spending.source) resolved.** charities/sentinel-bio.json says "its first tax year, 16 May to 31 December 2024".
5. **(low, policy branch) resolved.** covid_scale_deaths_averted = (bio + pol + fb deaths averted) × bio_covid_scale_share (197.7 at the defaults); w_pol has w_fb's form. Branch off, so no move.

New changes:
6. **Template merge (climate option): correct.** Every template row is present in the model (no template-only rows). climate_cost_share = 0, observed, 990 Part I line 1 mission as the source, "no range, 0 by construction" (as nuclear_cost_share does). climate_value_per_dollar, climate_uov and w_climate are the template's; climate_evidence_adj, climate_counterfactual_adj and climate_attribution_share keep the template's ranges and say "Not used". cost_shares_total (= 1) and own_cost_share (0.279) include climate_cost_share; w_total, the three adjustment averages and the result formula carry the w_climate terms. IBBIS predates the climate option, so the template (and the Bulletin's model) were the comparison.
7. **Write-up: correct.** "How this model was checked" mentions round 2 and the Maryland fellow's share.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | write-up "How this model was checked" | It calls the round 2 medium "the branches' shares in this text" without saying it is fixed in this same text. Optional. | write-up, last paragraph before Sources. | None needed; optionally add "fixed". | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| umd_fellowship_committed | https://sentinelbio.org/grant/university-of-maryland-department-of-computer-science/ | verified in round 2 | Quote and amount ($164,468) match what round 2 read; not fetched again this round. |
| spending.source | IRS e-file XML, object 202532799349300228 | verified in round 2 | TaxPeriodBeginDt 2024-05-16. |

## Drivers
Unchanged from round 2: discount rate, years a win counts, missing-data discount, the shared bio cut estimates, @next_dollar.sentinel_bio; own judgments bio_evidence_adj, bio_cf_other_orgs, fb_share_working. The engine read of round 2's finding 2 would improve the model most.
