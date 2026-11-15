# Audit: evergreen-collaborative-charityevals, round 2 (scoped verification of the round-1 fixes)
Result: 0.01221 t CO₂e/$ = 0.002635 years of healthy life per 1,000 dollars (combined range 4.053e-5–0.1712); cause median 0.001519 (×1.73), against 0.002710 in round 1 (-2.8%; the tonnes fall 3.7% with Michigan's 15 Mt, the rest of the move is the merges since). Verdict: pass.
Model-sha: c2d1aef90b714add1af4558c2c6434690a8f45d22432d865bf8615d2a189fa6d
Scope: scoped to the changes since round 1 (commit eb14a64c: model, facts mi_clean_energy_2023_* in facts/climate.json, evergreen_collaborative in facts/next_dollar.json, the write-up). Programme and spending scope as in round 1, not re-audited.
Mechanical: audit-model exit 0, "Findings (0)" (lint and invariants clean); check.ts all valid; normalization-audit: 0 violations anywhere, INV-4 included (the new waivers for usmeth_first_year are not this model's).
Previous round: all nine findings resolved except two small remainders in finding 5 (below, findings 1 and 2).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | source | facts/climate.json `mi_clean_energy_2023_delivered_share` note | The note still names "repeal bills (HB 5710, 5711)". The article gives no bill numbers in its text (a link to a PDF has "2026-HLA-5710" in its URL; nothing for 5711). | Michigan Public, 13 May 2026 | Drop the numbers: "The Republican-led House passed two repeal bills (58-47 and 57-48) in May 2026; the article reports they are likely to die in the Democratic-led Senate." | none |
| 2 | low | source | write-up "What drives the result"; explainer of `mi_clean_energy_2023_delivered_share`; note | "the Senate has not taken it up" is not in the article, which says only that the bills "now go to the Democratic-led Michigan Senate, where they're likely to die". It is probably true but unsourced. | Michigan Public, 13 May 2026 | Say "which the Senate is expected to let die" in the write-up and the explainer, or cite a Senate record showing no action. | none |

## Round-1 findings checked
| Round-1 # | Status | Check |
|---|---|---|
| 1 unmodelled_benefits_adj tag | resolved | Row has `"side_effect": "added"`. (The same tag in the other builds' rows is outside this round.) |
| 2 Michigan tonnes | resolved | Fact value 15,000,000 (8,000,000 to 30,000,000); note and explainer carry the power-sector cross-check (about 50 Mt in 2023, EIA; coal exits in the baseline, RFF; "about two thirds of the simulator's reading", 15/22 = 0.68). Effect: Michigan's weighted tonnes 19.0k to 13.0k a year, the result −3.7% in tonnes. |
| 3 mi_attribution_share_shared | resolved | Explainer: "$100,000 to four Michigan groups" and "beside the Union of Concerned Scientists' 4% of California's cap-and-invest extension". |
| 4 vehicle quote | resolved | `quote` is "drove comments (over 15,000)". |
| 5 Senate status | partly resolved | "likely to die" and the 58-47 and 57-48 votes are in the article; see findings 1 and 2. |
| 6 net assets and loan | resolved | Write-up says "net assets"; the next_dollar note carries the $296,859 loan to Evergreen Action (Schedule R). |
| 7 heavy-duty sentence | resolved | veh_tonnes_total explainer: "The heavy-duty standards of the same year are not counted: Evergreen reports no work on them." |
| 8 summary wording | resolved | "it is low because" is gone; the sentence starts "each win is shared with hundreds of groups". |
| 9 Michigan explainers | resolved | mi_downstream-chain rows (mi_discounted_years, mi_downstream's expected-tonnes row, mi_counterfactual_adj, mi_attribution_share, mi_implementation_adj, mi_total_adj, the weight row) have explainers; mi_total_adj carries the no-cost-analysis line (Senate Fiscal Agency gives none). |

## Figures checked against `audit-model`
Summary: 0.0026 years of healthy life per $1,000 (0.002635), 0.012 tonnes of CO₂e a dollar (0.01221), about $80 a tonne (1000/12.21 = $82). Write-up headline span 0.0026. Shares of the result, computed from the rows: federal law about 83% of the value (four fifths), Michigan 8% (under a tenth), household money 7% (a little under a tenth: transfer 5.8%, compliance savings 1.6%), the two EPA rules 2%. The write-up's "lowered the result about 4%" matches the tonnes (−3.7%). Shares 0.4%, 2%, 0.5%, 0.1% and 37% (17% to 76%) match the rows and the fact.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| mi_clean_energy_2023_delivered_share | https://www.michiganpublic.org/environment-climate-change/2026-05-13/michigan-house-votes-to-undo-michigan-clean-energy-standards | partly unsupported | votes 58-47 and 57-48 and "likely to die" verified; bill 5711 and "has not taken up" not in the text (findings 1, 2) |
| mi_clean_energy_2023_tco2e_per_year_2030 | RMI, EIA (round 1) | verified in round 1 | the new cross-check cites EIA 50 Mt and RFF, both checked in round 1 |

## Drivers
Unchanged from round 1: discount rate, missing-data discount, years counted, deaths per tonne, the shared advocacy share; the model's own: the IRA attribution share (0.4%, 0.15% to 1.2%) and the next-dollar figure.

Verdict: pass (no high or medium finding; two lows).
Model-sha: c2d1aef90b714add1af4558c2c6434690a8f45d22432d865bf8615d2a189fa6d
After this round (builder, 15 Nov 2026): both lows fixed outside the model content (the delivered-share fact note drops the bill numbers and says the bills are likely to die in the Senate; the write-up says the repeal is expected to die there).
