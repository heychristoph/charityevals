# Audit: action-for-happiness-charityevals, round 4 (verification)
Result: 0.001791 wellby/$ = about 0.117 years of healthy life per 1,000 dollars (0.12 as stated); digital programme about 84.5% of the result (1,100 of 1,301 WELLBYs). All four round-3 findings are fixed. Verdict: pass.
Model-sha: 4fe4e901cdaba8e87744186e98446e4064f7d5ed8b0f3538c8e7dddb71c42393
Scope: Scoped verification of the round-3 fixes only (no re-audit of the rest). Mechanical: lint 0/0/1 (the expected past_average note), check.ts all models valid, generated/ untouched.
Previous round (r3, 4 findings): all resolved.

| # | Item | Status | Note |
|---|---|---|---|
| 1 | `digital_evidence_adj` 0.5 (0.3-0.8), student-vs-online reason | resolved | Fetched Bolier 2013 Table 4: internet recruitment SWB 0.06 (2 trials), PWB 0.09 (5), depression 0.11 (5); university SWB 0.36. The explainer's 0.09 and 0.11 match the source; the self-help figures 0.14 and 0.15 are taken from the r3 audit, not located again in the table text. Anchors cohere: internal 0.7 times external about 0.7 (0.85 recruitment times 0.85 other) gives about 0.5, and the result fell 0.137 to 0.117 as r3 predicted. |
| 2 | next_dollar "new programmes not yet tested" dropped | resolved | Use stays 0.55 (0.8 x 0.55 x 1.0 = 44%), now justified only by new users bought by reach who engage less than members who sought it out. That is a fair reason about use, not about evidence. Mild: "engage less" is asserted, not measured; it is a judged figure with a 0.35-0.85 range. No finding. |
| 3 | `beneficiaries` and OURS entry | resolved | GBR 0.46, USA 0.2125, CAN 0.051, AUS 0.051, IRL 0.0255, world 0.2 = 1.0. Recomputed: 0.15 x 0.8 + 0.85 x 0.4 = 0.46; world 0.15 x 0.2 + 0.85 x 0.2 = 0.2. Model note and scripts/beneficiary-countries.ts agree (about 15% / about 85%). |
| 4 | "unlike most wellbeing models" removed | resolved | `program_spend` explainer now reads "The model is a past average because the digital branch's reach is an audience built over many years ...". No "unlike", "median", "peer" or "other charit" in the model or write-up. |
| 5 | Summary and write-up consistency | resolved | Summary: about 0.12 per $1,000, combined range 0.016-0.87, about 85% digital. Write-up headline figure, adjustments paragraph (digital 0.5, mostly students) and audit paragraph agree. |

## Findings
| # | Severity | Category | Row | Finding | Fix |
|---|---|---|---|---|---|
| 1 | low | presentation | `digital_evidence_adj` explainer | "About 0.7 together, half that gap counted here" does not say what the 0.7 multiplies, and the 0.85 recruitment factor is implicit. A reader cannot rebuild 0.7 x 0.7 = 0.5. | Optional: write "external about 0.7 (recruitment 0.85 x the rest 0.85), internal about 0.7, together about 0.5". No effect on result. |
