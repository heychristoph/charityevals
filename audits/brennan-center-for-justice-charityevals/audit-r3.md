# Audit: brennan-center-for-justice-charityevals, round 3
Result: 7.832e-5 daly/$ = 0.0783 years of healthy life per 1,000 dollars (combined range 0.0068–0.90); cause median 0.069 (×1.14). Verdict: pass.
Model-sha: 370b78f8e29886ce99625dfd6493b217f152eb61e6680518bbd997604987b914
Scope: unchanged and correct: all six programme columns of the audited FY2025 functional expenses (p. 5), $41.61M of programmes × overhead to $57.56M. Three branches: the IEEPA tariff ruling (91.5% of the result: 12,893 of 14,088 healthy years), democracy (6.4%) and justice (2.1%). charities/brennan-center-for-justice.json `spending` and its line match the accounts; the line's note now names three branches.
Mechanical: lint 0 findings (audit-model); invariants none for this model (normalization-audit: the one INV-15 violation is another model's); check.ts valid; simulation-check stable (5% 0.22×, 95% 4.52× the best guess).
Previous round: 1 resolved; 2 partly resolved (the share is now built from countable pieces and the six briefs are dated, but the denominator is still a judgment where the dockets give a count, and its low end sits below the Supreme Court count alone: new finding 1); 3 deferred to the owner (family doc line 61 unchanged; no effect on this model); 4 resolved; 5 resolved; 6 resolved; 7 resolved.

## Round-2 findings

| # | Severity (r2) | Status | Check |
|---|---|---|---|
| 1 | high | resolved | `tar_abroad_multiple` (1.6, 1.3–2) in tar_uov's chain. Fig. 4 bars re-read from both reports: China −0.23 → −0.16, Canada −0.22 → −0.21, Mexico +0.02 → −0.04, FTROW +0.05 → +0.03, EU +0.04 → +0.03, UK +0.10 → +0.05, Japan and ROW unchanged. × population: China +0.99M ln-units, Canada +0.004M (round 2's 0.04M was a slip; immaterial), Mexico −0.08M, FTROW ≈ −0.06M, EU −0.05M, UK −0.03M; net ≈ 0.78M against the US's 0.41M (×1.9) or 0.61M from the same two reports (×1.3). In the "Section 122 expires" scenario the ratio is also ≈1.6 (abroad ≈0.98M, US 0.61M), so a multiple that scales with tar_gdp_restored is sound. In the main chain rather than a side effect: acceptable (the tariffs were levied on partners' goods; the result is identical either way). Beneficiaries: tariff abroad 0.915 × 1.6/2.6 = 0.563 → CHN 0.56, USA 0.44: checked. |
| 2 | medium | partly resolved | 6 / 60 × 0.15 = 1.5%. The six briefs are right (Supreme Court docket 24-1287 lists the Center's brief on 24 October 2025). The denominator: see new finding 1; the amici's share: new finding 2. |
| 3 | medium | deferred (owner) | .claude/skills/build-cea/references/families/rights-advocacy.md line 61 still says "the average share reached in the years counted". This model uses the shifted path; no effect here. |
| 4 | medium | resolved | tar_evidence_adj = 1 with the reason; size doubt stays in tar_gdp_restored's range. |
| 5 | low | resolved | Dates corrected (12 and 20 May; three in July; October). |
| 6 | low | resolved | Column list complete; July 2026 Section 301 replacement given as the reason for the best guess. |
| 7 | low | resolved | cpus23 in `resources`; Budget Lab (both), Bridgespan, Patterson, Acemoglu et al., Manifold and the SCOTUS brief added; charity line note says three branches. |

The move from 0.026 to 0.078 (×3.0) decomposes exactly: on the tariff branch (74% of the old result), (1 + 1.6)/(1 + 0.3) = 2.0 for the gains abroad, × 1.5 for the share (1% → 1.5%), × 1.25 for the evidence factor (0.8 → 1) = ×3.75; 0.019 × 3.75 + 0.007 = 0.079. The first and third steps are right and verified. The second is likely a fifth too high (finding 1), so the defensible result is nearer 0.06–0.065 at the best guesses: still about the cause's median.

## New findings

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | source | tar_amicus_briefs | A judgment (60, 35–120, "dozens of briefs") where the dockets give a count. The Supreme Court docket alone lists about 37 amicus briefs filed 8–24 October 2025 at the merits stage for the challengers (the government's amici filed on 23 September), so the low end of 35 is below the count of one court; the Federal Circuit en banc (V.O.S. Selections, No. 25-1812), the Court of International Trade, D.D.C./D.C. Cir., N.D. Cal./9th Cir. and N.D. Fla. add more (at least the Center's own five). The best guess is likely 70–90, not 60. | supremecourt.gov docket 24-1287 (25-250's amici are filed there "VIDED"): 46 amicus entries, of which ~37 dated 8–24 Oct 2025 (Economists, Cato, Chamber of Commerce, 31 Former Federal Judges, Members of Congress, California et al., Brennan Center, ...). | Make it a counted `estimate`: Supreme Court challenger-side merits briefs (count from 24-1287, ≈37) + Federal Circuit No. 25-1812 + the district and circuit dockets the Center filed in; cite the dockets and state the count in the explainer. Until the lower courts are counted: low 45, best 75, high 120. | At 75: −18% (0.078 → 0.064); at 90: −27%. |
| 2 | medium | sensitivity | tar_amici_resource_share | The #4 driver (0.031–0.174) is a judgment whose only anchor is "amicus briefs are short by comparison"; no reference class or arithmetic for 15%. | Row explainer; tornado. | Anchor it in countable effort on the same dockets: pages (or words) of the parties' briefs, replies and appendices at the four levels against the amici's brief pages, or brief count × typical cost (parties' merits litigation through four levels vs a pro-bono amicus brief); state the arithmetic and keep the range wide. | Unknown sign; the row's range moves the result −61% to +122%. |
| 3 | low | sensitivity | tar_abroad_multiple | The best guess (1.6) sits between a like-for-like ratio (1.3: both changes from the same two reports) and a mixed one (2.0: a cross-report abroad change over the within-report US change, where the US cross-report change, 0.18 points, is half again the ruling-only 0.12, so part of the abroad change may be model revision). The explainer gives both anchors but not why the best lies between. | Budget Lab 1313 and 1410 fig. 4; 1410 table 1. | Add one clause: "1.3 if the revision between the reports moved the regions as it moved the US, 2.0 if it moved only the US; 1.6 between". | None at the best guess (1.3 would be −11%). |
| 4 | low | presentation | summary; writeup Sources; people_affected_per_year | The summary says the model's own ranges "span over a thousandfold"; they now span about 350× (0.0036–1.28). The write-up's Sources leave out the Budget Lab's January 19, 2026 report, which tar_abroad_multiple cites. `people_affected_per_year` and `ln_gain_per_person_year` (reading rows) count only Americans though 56% of the result is abroad. | audit-model output; writeup Sources; canonical rows. | Change the summary to "several hundredfold"; add the January report to the write-up's Sources; add the explainer note "the trading partners' gain is in tar_uov via tar_abroad_multiple, not in these reading rows" to people_affected_per_year (or add CHN's population from the shared facts). | None. |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| tar_abroad_multiple | https://budgetlab.yale.edu/sites/default/files/page_to_pdf/1313/publication_1313.pdf p. 10 fig. 4; https://budgetlab.yale.edu/sites/default/files/page_to_pdf/1410/publication_1410.pdf p. 11 fig. 4 | verified | Bars as in the source note; computed ratio 1.3–1.9 at the best scenario, ≈1.6 in the "expires" scenario. |
| tar_gdp_restored | publication 1410 p. 6 table 1 | verified (round 2) | Unchanged values; page note now complete. |
| tar_bcj_briefs | https://www.supremecourt.gov/search.aspx?filename=/docket/docketfiles/html/public/24-1287.html | verified | "Brief amicus curiae of Brennan Center for Justice filed", Oct 24 2025; lower-court dates as round 2 found. |
| tar_amicus_briefs | same docket | mismatch with range | ~37 challenger-side merits briefs at the Supreme Court alone, above the row's low end (finding 1). |

## Drivers
1. `$win_years_counted` (shared slider): 0.017–0.239.
2. `$missing_data_discount` (shared slider), all three branches thin, correctly applied.
3. `@next_dollar.brennan_center_for_justice` (0.32, sourced, verified round 2): 0.032–0.189.
4. `tar_amici_resource_share` (judgment, 15%): 0.031–0.174; needs an anchor (finding 2).
5. `tar_amicus_briefs` (judgment, 60): 0.042–0.130; countable (finding 1). Then `tar_gdp_restored` (estimate, verified) and `tar_cost_year_share` (judgment, dated).

What would most improve the model: count the challengers' amicus briefs across the courts and anchor the amici's share in countable effort; together they set the Center's 1.5% share, on which nine tenths of the result rests.

Verdict: pass
