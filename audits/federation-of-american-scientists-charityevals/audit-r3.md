# Audit: federation-of-american-scientists-charityevals, round 3 (verification round)
Result: 0.001425 daly/$ = 1.425 years of healthy life per 1,000 dollars (combined range 0.069–29.3; model's own ranges 0.12–7.66); cause median 1.58 (×0.90). Verdict: pass.
Model-sha: 1131a9ee273b00d6367f2f53eb444f095ca61148a43e675844cc075d73f4152f
Scope: unchanged from round 2 (every programme, year to 30 June 2025, $32,215,480 of programme spending). Only the round-2 fixes were checked.
Mechanical: audit-model lint 0 findings, invariants none (run on the current model); normalization-audit, check.ts and simulation-check not re-run: the fixes changed two estimate values, text, and the charity record's wording, no structure.
Previous round: finding 1 (global_risk_share timing): resolved, rebuilt from the dated grant and the 990 pay. Finding 2 (ai_staff_share): resolved, 0.02 (0.005–0.06), explainer now says today's staff joined after the year and matches the range. Finding 3 (branch shares): resolved, see below. Finding 4 (charity record): resolved, summary and line label name the Global Risk Program.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | double-counting | global_risk_share | Yong-Bee Lim's four months (March to June 2025, about $0.06M) fall inside the period when the FLI grant was spent, and the grant's 5/18 share already counts that project's staff. His pay is probably counted twice, and the $0.06M is an assumed salary (about $180k a year) with no source. | Explainer: grant February to June 2025 plus Lim's four months. | Drop Lim from the sum (about $0.56M, 10%) or say in the explainer that his pay is a check within the grant's figure. The 8–20% range already covers it. | about −1% at 0.10 to 0.11 |
| 2 | low | presentation | write-up "How this model was checked" | The text says "A verification round checked those fixes" before this round was written. | Write-up line 54. | Keep it now that this round passes. | none |

## Verified
- Arithmetic: 5/18 × $1.5M = $0.417M; Wolfsthal 7/12 (July 2024 to January 2025) × $241,391 = $0.141M; Lim ≈ $0.06M; total ≈ $0.62M of the $5,435,380 research line = 11.4%, stated as 12% (8–20%). Consistent.
- 990 (fy25.txt): Part VII Jon Wolfsthal, Director of Global Risks, 40 hours, ReportableCompFromOrgAmt 194,969 + OtherCompensationAmt 46,422 = 241,391. Schedule J: base 194,966, total 241,391. Matches the row's source and explainer. (The base differs from Part VII's 194,969 by $3, as the filing itself does.) The FLI grant's date (1 February 2025) and the $1.5M were verified in round 2.
- ai_staff_share: value {0.005, 0.02, 0.06}; the explainer says 2%, from 0.5% to 6%, and that today's two staff joined after the year. Consistent.
- Cost shares: nuclear 3.17%, AI 1.51%, pandemics 0.40% (model formulas); sum 5.08%, "about 5%". Summary and write-up say 3.2%, 1.5%, 0.4%.
- Branch value shares (scratch runs, each branch's evidence_adj set to 0 against 1.425): nuclear 93.5% (0.0926), AI 4.3% (1.364), pandemics 2.0% (1.396), science policy and public-spending 0.07% (1.424); the pol and fb branches are 0. Summary and write-up say 93% / 4% / 2% / under 1%. Correct.
- Headline 1.4 and range 0.07–29: model 1.425, 0.069–29.3. Correct. The write-up's figure uses the live data-figure.
- Charity record: summary and lines[0].label and source name the Global Risk Program, matching the model summary.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| global_risk_share | 990 Part VII, Schedule J (local text) | verified | Wolfsthal 194,969 + 46,422 = 241,391; Schedule J base 194,966, total 241,391 |
| global_risk_share | FLI grant page, FAS release, Lim page | verified in round 2 | not re-fetched; unchanged |

## Drivers
Nuclear cut per million (estimate; Rethink placeholders), win_years_counted (judgment), missing_data_discount (judgment), discount_rate (judgment), nuclear_death_share (judgment). The headline is dominated by the nuclear branch at about 3% of the cost. The best further improvement would be a measured outcome for the Nuclear Information Project's work.

Verdict: pass

Re-stamped: mechanical shared-fact change (INV-14): fb_work_years reads @catastrophe.field_work_years, the same 5 (2 to 10) every catastrophic-risk model had typed; result unchanged.

Re-stamped (15 Nov 2026): one consumption scale for US public money (normalization.md 2.14); 1.43 → 1.43.
Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.
Re-stamped (15 Nov 2026): pandemic and nuclear extinction chances read the new sliders (same defaults; mechanical)
