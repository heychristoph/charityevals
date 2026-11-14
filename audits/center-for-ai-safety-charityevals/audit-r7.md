# Audit: center-for-ai-safety-charityevals, round 7 (scoped: two merged changes)
Result: 0.001590 daly/$ = 1.590 years of healthy life per 1,000 dollars (combined range 0.035–71.4); cause median 0.0733 (x21.7). Verdict: pass.
Model-sha: bf5e134417c0c91038732c75b7217b5ad604ee175086d917788c03b05d233121
Scope: unchanged from round 4; this round verifies that two separately verified changes, both now in the model, are present together and consistent: (a) the pandemic death-age rule (rows bio_covid_scale_share, covid_scale_deaths_averted, covid_value_per_death, uov_bridged using @death_ages.covid_scale_*; round 5); (b) leverage_funging_adj = 1 (round 6).
Mechanical: lint no high or medium (four lows: estimate rows without a range, none new), invariants none, normalization-audit none (0 violations, INV-15 included; generated output restored). No source re-fetched: no new or changed facts.
Previous round: round 6 finding 1 (next-dollar note naming the large funders' behaviour): resolved; the note already says "a few large donors in a field big foundations fund heavily, who would fill gaps".

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | summary, write-up | NTI's figure had moved from 23.59 to 23.39 since round 6 (pandemic ages merged), so "24" no longer matched `scripts/headlines.ts` (23.39 rounds to 23). | headlines.ts nuclear-threat-initiative-charityevals = 23.3937 | Fixed: "24" to "23" in the summary and the write-up's "What drives the result". | none (wording) |

## Checks
- (a) The four rows equal the catastrophic-risk template (formula, value and explainer compared row by row). bio_cost_share is 0 (AI-only), so bio_covid_scale_share carries zero weight and the headline is unchanged by (a).
- (b) leverage_funging_adj is 0.85 / 1 / 1.05, formula and value as the template; the explainer names @next_dollar.center_for_ai_safety as the place the funging question is asked (the model's explainer is specific to CAIS, the template's is generic). No double count: the next-dollar room factor (0.4 best) is the only funders' response factor; the adjustment is 1 at best.
- The two changes touch different rows (value of pandemic deaths; an adjustment multiplier) and do not interact.
- Headline: `scripts/headlines.ts` 1.5896; summary "1.6", write-up "1.6": match. Range 0.0354–71.38: "0.04 to 71" / "0.04 to about 71": match. Write-up sensitivities (0.2 to 11, 0.2 to 15, 0.7 to 2.5, about 3.3) match the tornado.
- INV-15: "more than ten times its peers' median" is true (1.590 / 0.0733 = 21.7) and the reason is stated (misuse work: ai_misuse_cost_share 0.25 here, all-misalignment peers); "far below the Nuclear Threat Initiative (23)" true (23.39 vs 1.59) with its reason stated.
- Round 6 file's stray "(Numbered 5 on its branch; renumbered at merge.)" note removed.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| all | n/a | not re-fetched | no source changed since round 4 |

## Drivers
Misuse cut per dollar, AI catastrophe chance, years a cut counts, missing-data discount, AI catastrophe death share. Unchanged.

Verdict: pass
Model-sha: bf5e134417c0c91038732c75b7217b5ad604ee175086d917788c03b05d233121
