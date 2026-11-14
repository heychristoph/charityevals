# Audit: effektiv-spenden-charityevals, round 2
Result: 0.05026 uov/$ = 25.1 years of healthy life per 1,000 dollars (combined range 7.1–89.4; joint low–high of the model's own ranges 17.4–40.4); cause median 0.06841 (×367). Verdict: pass.
Scope: scoped verification of round 1's seven findings and of the changes since (diff e237bfa..HEAD of the model, write-up, facts/meta.json, facts/next_dollar.json). Scope, cost and reach rows unchanged from round 1.
Mechanical: audit-model Findings 0; check.ts "all models valid"; normalization-audit: every invariant 0 violations, none for this model (`generated` restored); every `#reference` resolves to a finite value (the headline is finite; a scratch copy with the Lafiya term replaced by 1000 moves the result to 123.6, so that term is live and finite; METR, Ploughshares Fund, Sinergia Animal, Wild Animal Initiative, Helen Keller, New Incentives, StrongMinds and Lafiya all resolve). Simulation not re-run (no input range changed except grant_wait_years and survey_response_share's explainer).

## Round 1 findings
| # | Round 1 | Status | Check |
|---|---|---|---|
| 1 | medium, placeholder source on value_per_unit_year | fixed | `kind` is `judgment`, no `source`, explainer kept. |
| 2 | medium, METR / Sinergia / WAI unread | fixed | Catastrophic: 2024 average of ten models (Ploughshares added, 80,000 Hours left out) blended with METR at the Swiss share; animals: THL, Sinergia, WAI by Swiss grants; explainer and write-up say so. |
| 3 | low, 2024 split only for poverty | fixed | Poverty blends the 2024 split with the Swiss 2025 grants by recipient (eight, each at its owner:charity figure, StrongMinds at #hli:strongminds). |
| 4 | low, grant_wait_years from year-end balances | fixed | Judgment 0.35 (0.1–0.62); balances kept as the high end in the explainer; I recomputed 0.62 = (14.08M EUR x 1.1287 + 3.116M CHF x 1.2034) / $31.95M. |
| 5 | low, five funds / understated | fixed | "six funds"; the poverty half carries the result and other causes count slightly below zero. |
| 6 | low, paraphrased budget quote | fixed | Verified verbatim against the Jahresrückblick 2024 page (fetched: "ein ähnliches Budget – bei etwas geringeren Personalkosten und dafür etwas höheren Marketingausgaben"). |
| 7 | low, survey_response_share anchor | partly fixed, see finding 1 below | |

## New findings
| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | source | survey_response_share (explainer) | The anchor says "roughly 23,000 donor-years in 2019–2022", but only one yearly count is cited (more than 9,000 donors in 2021); the other three years are described as "fewer"/"more", so 23,000 is a guess presented as its donor counts. The cited forum post could not be fetched (HTTP 429 / security checkpoint), so the 9,000 and the €2.84M / €18.86M are unverified by me. | Explainer text; forum URL returned 429 and a Vercel checkpoint. | Cite each year's donor count from the Jahresrückblicke 2019, 2020 and 2022 (linked from the Transparenz page) and sum them, or say "at least 9,000 donors in 2021 alone" and keep the 20% (8–40%) judgment around it. | none (judgment unchanged; tornado 22.9–28.9) |
| 2 | low | double counting | value_destinations (blend) | The 2024 within-cause split is organisation-wide (it already contains the Swiss association's giving), yet it takes weight (1 - Swiss share) while the Swiss 2025 list takes the Swiss share, so Swiss money is represented by both lists in part. | Jahresrückblick 2024 pie charts are for the whole organisation; fact es_ch_share_2025 note. | Say so in the explainer ("the 2024 split is read as the German entity's, an approximation") or, if a German-only 2025 split is published, use it. Both poverty lists are GiveWell-ranked charities, so the effect is small. | small, not computed |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| es_ch_2025_* (12 facts: AMF 205,534; Evidence Action 874,481; GiveDirectly 324,611; Helen Keller 354,192; Malaria Consortium 104,174; New Incentives 55,662; StrongMinds 299,457; Lafiya 1,249; THL 100,256; Sinergia 209,147; WAI 7,805; METR 323,605 CHF) | https://drive.google.com/uc?export=download&id=1jDkMkI2TYvsEMuBa_kSsslLDikQ4nqn7 | verified | A02 table, printed page 6 (PDF page 7), every figure matches digit for digit; audited (eingeschränkte Revision, W&P AG, 5 May 2026). |
| es_ch_share_2025 = 0.2654 | same, Erfolgsrechnung p. 3; UES Jahresabschluss p. 3; ESO | verified | (6,937,346 + 110,566) CHF x 1.203369 = $8.48M; (20,683,417.60 + 110,580) EUR x 1.128668 = $23.47M; 8.48 / 31.95 = 0.2654. FX values match facts/fx.json. |
| grant_wait_years high end | UES Bilanz p. 2, ESS Bilanz p. 2 (A: 3,060,858 and 3,171,424 confirmed) | verified | 0.62 reproduced. |
| next_dollar budget quote | https://effektiv-spenden.org/blog/jahresrueckblick-2024/ | verified | Verbatim. |
| survey_response_share anchor | https://forum.effectivealtruism.org/posts/38GG44y2hYLovADeK/ | unreachable | 429 / checkpoint; ask for an archived copy. |

## Write-up
Matches the model: six funds, ten catastrophic-risk models (Ploughshares in), Swiss share 27%, wait "about a third of a year (0.1 to 0.6)", other causes slightly below zero, headline live.

Verdict: pass (no high or medium findings; two low).
Model-sha: be0a0456f497b68062f513af04255ad93580d33fb5fb24727e1fb9bf8fc0480f
