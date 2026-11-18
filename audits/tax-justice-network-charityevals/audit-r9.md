# Audit: tax-justice-network-charityevals, round 9 (scoped verification of credit rule 2.24, step 5)
Result: 0.009298 uov/$ = 4.649 years of healthy life per 1,000 dollars (combined range 0.28-77.7; joint own-range 0.039-348). Verdict: fix needed (one medium).
Verdict: fix needed
Model-sha: a99fd1b2d93c5785528fd39eaa20c8cf9001ad5331794472f8fcbf15c4c497b5

Scope: scoped to a_movement_credit, b_movement_credit, the two `_shared` explainers, branch classes, counterfactual rows, summary and write-up. Preflight: passes (only the out-of-date distributions line, ignored).
Previous round: round 8 open items were lows only; nothing re-opened.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | structure / plausibility | a_movement_credit, b_movement_credit | The governments that pressed for the outcomes independently of the network are treated as adopters and removed, so the share is optimistic. The rule's test is "would the party have committed it without the organisation?": the G20's 2009 push after the crisis, the US FATCA law (driven by the UBS case and Senate inquiries), the EU's directives, and for the convention the African Group's 2022 and 2023 resolutions all pass it (yes: independent), so they are co-campaigners and stay in the denominator. Only the OECD/Global Forum secretariat running peer reviews and the governments enforcing the standards are adopters. The report the row cites itself credits "the leadership of the African Group of countries and the decades-long work of the international tax justice movement", i.e. governments first. 60% and 80% treat civil society as the leading campaigner against journalists only (a) and against academics only (b). | Old text of both rows (G20, FATCA, EU, African Group named as campaigners); Annual Report 2025 p. 4 (read, quote matches). | a_movement_credit: best 0.35, range 0.2-0.6, text: civil society proposed the measures and kept them on the agenda, against the governments that pressed for them independently (G20 2009, FATCA 2010, EU directives) and the journalists who published the leaks; the secretariat and the governments that run the standards are adopters (mobiliser_share). b_movement_credit: best 0.5, range 0.3-0.8, text: civil society's two decades of proposals and analysis against the African Group's resolutions and the negotiating governments that put the text forward on their own; the UN secretariat is the adopter. Then update the summary ("judged 4%" becomes about 2.4%; "10%" about 6%), the write-up lines on both credits and the uncertainty line. | At these values the headline is about 2.7 years per 1,000 dollars (a share x0.58, b x0.63) instead of 4.65. |
| 2 | low | presentation | section "adjustments" explainer | Still reads "times civil society's share of all". | Section explainer. | "...times civil society's share among those who campaigned for it, trust in the figures, ..." | none |
| 3 | low | presentation | write-up, Credit bullet | "Our 1%" was the old standards share (now 4%). Fixed in this round (see edits). | writeups line 39. | done | none |

Checks by item of the brief:
1. Denominator: adopters out is right for the OECD secretariat, Global Forum peer reviews, UN secretariat and enforcing tax authorities; wrong for governments that campaigned on their own (finding 1). Journalists stay in (a); no one named in the old text dropped except those governments.
2. Facts hold: the report quote (p. 4) is there verbatim. FATCA 2010, CRS from 2017, the G20 2009 push and the African Group resolutions of 2022 and 2023 are well documented; I did not fetch them again. The anchor is the network's own report, not another charity's model.
3. Value: 0.6 and 0.8 are above a best guess given the contributors named in 1; the arithmetic in the `_shared` explainers matches the formulas (4.1% = 8% x 60% x (1 - 30% x 50%); 9.6% = 12% x 80%).
4. Classes: both `a_attribution_share` and `b_attribution_share` are `win` = shared x `mobiliser_share` once; no other path reads the slider for credit (careers and moved money rows are separate, as before). Correct.
5. Would-have-happened-anyway: not lost. `a/b_counterfactual_adj` = 1 per Convention 5, carried by `$win_years_counted` (5 years) and, for the convention, `b_p_success`. The old 0.15 and 0.25 mixed "governments did it" with "it would have come anyway"; the part about the standards coming some day is rightly in the years counted (stated in the new a_movement_credit text). No double count: governments that pressed independently belong in the share (finding 1), not in the years, since the years measure how much sooner the whole movement made it come. No new home needed.
6. Text: summary figures consistent with the model (4% / 10% / 40% / 4.6). Branch shares 56% / 44% verified (old 50.5/49.5 split rescaled by x4.0 and x3.2). The write-up credit line and mobiliser-share wording are consistent; two stale items corrected or listed (findings 2, 3). The write-up's "Round 1 ... 2.0 to 1.1 ... 1.3" history is dated and fine.

Write-up edits made: writeups/tax-justice-network-charityevals.md, Biggest uncertainties, Credit bullet: "Our 1% could be a third or twice that." became "Our {{row:a_attribution_share_shared}} for the standards could be a third or twice that."

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| b_movement_credit | https://taxjustice.net/wp-content/uploads/2026/06/Tax-Justice-Network-Annual-Report-2025.pdf | verified | p. 4 quote present; it names governments' leadership first |

## Drivers
Mobiliser share (slider), years counted, missing-data slider, next dollar, convention share recovered; credit rows rank 7th to 12th in the tornado. Both credit rows are judgments; the best improvement is the finding-1 re-judgment with the named contributors.
