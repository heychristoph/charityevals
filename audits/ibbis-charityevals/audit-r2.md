# Audit: ibbis-charityevals, round 2
Result: 0.008344 daly/$ = 8.34 years of healthy life per 1,000 dollars (combined range 0.43–160); cause median 1.50 (×5.6). Verdict: pass.
Model-sha: 2c4c494ddbf2f25cec625e4e386862b63a3fecaed219b4b7bcc4e4b46486d5c2
Scope: all of IBBIS's 2025 work (commec and the NIST evaluation portal, customer-screening resources, the DSSC and SBRC consortia, the Global DNA Synthesis Map, launched 17 December 2025, EU/UK/US policy work, in-country workshops, industry convenings), one pandemic field-work branch. No accounts or budget are published. A search for a funder's grant record (Coefficient Giving, Sentinel Bio, NTI pages) found no amount. Spending is built from staff: (7.5 + 1 × 0.6) × $250,000 × 1.2 = $2,430,000. charities/ibbis.json `spending.programme` and its one `lines` entry match it ($2,430,000, 2025). No programme is left out.
Mechanical: lint 0 high / 0 medium / 8 low (estimates with no range: the switched-off branches' zeros, unchanged from round 1); invariants none; normalization-audit none (all invariants 0 violations; generated/ restored); check.ts all models valid; simulation stable (5% 0.103×, median 1×, 95% 11× the best guess; one single event, misses 0% of draws).
Previous round:
- 1 (high, placeholder sources on 10 rows): resolved. No `TEMPLATE`, `REPLACE` or example.org is left. The smaller-size rows cite the tournament PDF (it resolves, HTTP 200), as the Johns Hopkins and SecureBio models do. The four cost shares cite the About page's "Our Work" passage, checked word for word. pol_cost_share cites letter p. 3 (verified). fb_share_working and fb_work_years now have no source block.
- 2 (medium, write-up result split): resolved. The text now gives about half, a third, and the rest. At the defaults it is 54% / 33% / 13%, unchanged by the cost change. The same sentence is corrected in the SecureBio write-up ("half the pandemic work's share") and the Johns Hopkins write-up.
- 3 (low, Johns Hopkins comparison): resolved. The new wording ("outbreak analytics count for less per dollar and whose main funder may give less if others give more") matches Johns Hopkins's cori_evidence_adj 0.4 on 34% of its budget (bio_evidence_adj 0.727 against 0.8) and its leverage_funging_adj 0.9. Its higher attribution (0.85 against 0.75) offsets part of that. The net gap is ×1.11.
- 4 (low, bio_evidence_adj explainer): resolved. It now says "on balance a little less than a typical project's".
- 5 (low, fellows paid by others): resolved. The new judgment fellows_paid_share is 0.6 (0.2 to 1). The unpaid rest is named in bio_attribution_share. Spending is $2.43M and the result per dollar is unchanged (8.344).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | scope | fellows_fte, core_staff_fte | The two technical fellows may already be inside the annual letter's "full-time team of 10", so part of fellows_fte may be counted twice. The people page lists 5 staff and 2 technical fellows (Yordanova, Chung). Only 2 of the 5 staff predate 2025 (Millett, Lababidi). The letter's other 3 hires on the page are Hamilton, Lefebvre and Shivakumara, and 2 hires are missing from it (the Programme Lead for International Standards, the Operations Manager). That leaves the "about 5 at the start" partly unexplained, and the fellows are the obvious candidates. The letter is dated April 2026 and says "I am proud to lead" in the present tense, so the 10 may also include a 2026 hire. | ibbis.bio/about/people/ (fetched 2026-11-14); letter p. 5: "effectively doubled its core staff… a full-time team of 10". | In fellows_fte's explainer, say that the two listed technical fellows are taken to be inside the team of 10. Set fellows_fte to 0.5 (0.25 to 1.5) for the contractors and the outside AI x Biosecurity fellows, keeping fellows_paid_share. Spending becomes (7.5 + 0.3) × 250,000 × 1.2 = $2,340,000; update charities/ibbis.json `spending` and `lines` to match. | 0 on the result (per dollar); spending −4% |
| 2 | low | source | @next_dollar.ibbis (facts/next_dollar.json) | The room note calls Sentinel Bio "its main recent funder" but leaves out its second grant. The same Manifund section says IBBIS received a Sentinel Bio grant in May 2026 (amount not published). New money arriving in 2026 is evidence on room, against 0.85. | Manifund: "through a grant received in May 2026 (amount not currently published) and a grant received July 2025". | Add the May 2026 grant to the room note: "…Sentinel Bio, which gave a further grant in May 2026 (amount unpublished), funds the consortium and policy work, not the tool…". Keep room 0.85: the grant is restricted to other work and the Manifund gap ($121,585 left) is still open. | 0 (text) |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| core_staff_fte | ibbis.bio/wp-content/uploads/2026/04/Annual-Letter-Executive-Director-1.pdf | verified | p. 5: the quote is exact; five hires are named. See finding 1. |
| fellows_fte | manifund.org/projects/scaling-adoption-of-synthesis-screening-outside-the-us-and-eu | verified | "We have a team of 4 working on the tool (part-time and full-time, including several fellows from AI x Biosecurity programs)". |
| fellows_paid_share | (judgment) | n/a | It rests on the same Manifund sentence. A judgment, 0.2 to 1, is the right form, since who pays is not published. |
| other_costs_ratio | ibbis.bio/indirect-cost-policy/ | verified | "It applies to all grants made by IBBIS": IBBIS makes grants, so a cost on top of staff is right. |
| program_spend / charities/ibbis.json | (derived) | verified arithmetic | (7.5 + 0.6) × 250,000 × 1.2 = 2,430,000 = the record's `programme` and `lines` dollars. |
| ai_cost_share, nuclear_cost_share, fb_cost_share | ibbis.bio/about/ | verified | The "Our Work" passage is quoted exactly. It names no AI-risk, nuclear or careers programme. |
| pol_cost_share, pol_wins | annual letter p. 3 | verified | Draft EU Biotech Act, December 2025: "If adopted, this would make screening mandatory in all 27 EU countries." |
| fb_people | annual letter p. 5 | verified | Workshop sentence is exact. |
| ai_/nuclear_smaller_per_year, _deaths | forecastingresearch.org/pdf/existential-risk-persuasion-tournament.pdf | reachable | Same source and page note as the Johns Hopkins and SecureBio rows. Switched off (cost share 0). |
| bio_evidence_adj (facts cited) | letter pp. 3–4; Manifund update | verified | Dynegene and SIAT; benchmark "met or exceeded industry standards"; NIST portal "more than 15 evaluations… across 5 datasets"; DSSC "around 30 experts", ISO 20688-2:2024; SBRC "more than 60"; a Latin American user screening every order. |
| bio_counterfactual_adj | Manifund | verified | "fewer than 10 people in the world working full-time on direct outreach to companies". |
| bio_years_until_effect | Manifund update | verified | "Adoption takes a median of seven months from first contact". |
| bio_attribution_share | letter pp. 1–5 | verified | Study with Microsoft; NIST test sets; consortia sizes. Arithmetic: 90 experts × 2–5% × $250k = $0.45M–$1.1M beside $2.43M plus about $0.1M of unpaid fellows' time, a share of 0.68–0.82, so 0.75 is right. |
| leverage_funging_adj | Manifund | verified | Sentinel Bio July 2025: $36,000 plus a match up to $175,000, "claimed over 80%". |
| @next_dollar.ibbis | Manifund; founderspledge.com/research/international-biosecurity-and-biosafety-initiative-for-science | verified | $68,415 of $190,000 raised; "up to $265,000". FP (updated 31 October 2023): "fund its first three years of operations". 0.85 × 0.7 × 1.0 = 0.60; range 0.26–0.95 is the product of the factor ranges. Dated 2026-11-14. See finding 2. |
| write-up: map launch | ibbis.bio/news/page/2/ | verified | "December 17, 2025 — IBBIS Launches the Global DNA Synthesis Map at the Biological Weapons Convention". |
| resources | ibbis.bio/2025-annual-letter/; commec.ibbis.bio/notes/testing-v0-1 | verified | Both resolve (the second redirects from the listed URL). |
| shared @catastrophe cuts and chances | facts/catastrophe.json | not re-verified | Shared facts, read correctly. Checking them is outside this audit. |

## Drivers
1. `$discount_rate` (shared slider): 6.9–115.
2. `$win_years_counted` (shared slider): 1.8–25.
3. `@catastrophe.bio_extinction_cut_per_million` and `_catastrophe_cut_per_million` (shared estimates, Rethink Priorities, ×10 either way): 4.3–49 and 4.9–43.
4. `$missing_data_discount` (shared): 1.7–17. Thin is right: no outcome is measured and the spending is estimated.
5. `bio_evidence_adj` 0.8 (judgment, 3.1–12.5), then `@next_dollar.ibbis` (3.6–13), `bio_counterfactual_adj` (4.8–10.7) and `bio_attribution_share` (5.6–10.6). These are anchored on the peers: NTI 0.8, SecureBio 0.75, Johns Hopkins 0.73, and a counterfactual of 0.7 throughout.

Checked afresh and found sound:
- The chain is the template's. Every shared row is still read. Adjustments are weighted by branch value. Every future benefit and wait is discounted at `$discount_rate`. Deaths are valued by age band (the COVID-scale part at COVID's age mix) × `$life_value_multiplier`. `estimate_basis` past_average with 2025 cost and 2025 outputs, reading `@next_dollar.ibbis`.
- Side effects: +5% / 0 / −3%, each a ranged judgment with an anchor. There is no double count with the shared backfire step: speedup is 0, and hazard is only the map and the toxin study.
- Write-up figures match the live model: 8.3, 0.4–160, $2.4M, about 115 at 0.1%, 1.8–25, about 4–49, 3.6–13, 60% vs 49%.
- Peers: 5.6× the cause median, so no INV-15 statement is needed. The model sits just above the other pandemic models: Blueprint 5.9, SecureBio 6.1, Johns Hopkins 7.5. The gaps come from the next dollar and the Johns Hopkins CORI and funging rows, not from the counting rules.

What would most improve the model is still a published 2025 budget or a funder's grant record in place of the staff build. After that, a count of providers screening with commec because of IBBIS, which IBBIS's quarterly adoption-funnel updates are starting to provide.

Verdict: pass (no high findings; two lows).
