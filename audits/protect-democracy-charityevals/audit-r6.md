# Audit: protect-democracy-charityevals, round 6
Result: 1.953e-5 daly/$ = 0.0195308 years of healthy life per 1,000 dollars (combined range 0.00093–0.41); cause median 0.071 (×0.27). Verdict: pass.
Model-sha: 998d6a415f4aff6732b66f007e20ef731c3465331285c0e633ee58a72d63a9fa
Scope: scoped verification of the fixes to round 5's two mediums and three lows (facts/democracy.json, and the explainer of bs_years_until_effect). Nothing else re-audited; scope, drivers and the rest as in rounds 3-5.
Mechanical: lint 0 findings (audit-model "Findings (0)"); invariants none; normalization-audit no violations (sandbox run reports 0 models per invariant, a weak signal); simulation-check 5% 0.109, 50% 1, 95% 7.63 × best guess (stable). Result unchanged: 0.01953 (audit-model bottom line 1.953e-5 daly/$).
Previous round (r5):
- 1 (Helliwell DOI, medium): resolved. `slide_beyond_income_share` source.url is now https://doi.org/10.1017/S0007123408000306; the explainer says quality of government is linked to life satisfaction beyond income "with the size depending on a country's level of development", with no "richer countries" claim.
- 2 (slide_violence_share source, medium): resolved in substance, one new low (finding 1 below). Boese is no longer cited for repression; the fact is labelled "charityevals' judgment" and the note says no study sizes it. The new source is Protect Democracy's CSSE page, but that URL does not exist (see below).
- 3 (unsourced litigation sentence, low): resolved. Neither "litigation is more decisive" nor "The biggest uncertainty..." appears in field_risk_cut_per_year's explainer.
- 4 (CSSE reason gone, low): resolved. The explainer again names Protect Democracy's election-official trainings as acting against intimidation.
- 5 (backlash and indirect-effect sources, low): resolved. Both source notes now state "No study sizes it/measures it" and are labelled judgments; the backlash title anchors on the ranked-choice bans, the indirect effect keeps the Field in Focus link only as a context source for the field's focal areas, which is honest as stated.
- bs_years_until_effect explainer: resolved. It says why it differs from Brennan's dem_years_until_effect (2.5, 1.5 to 4.5): work year to June 2025 is half a year closer to the same date. Brennan's explainer says the same from its side; the numbers agree (3 vs 2.5).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | source | @democracy.slide_violence_share | `source.url` https://protectdemocracy.org/work/committee-for-safe-and-secure-elections/ returns HTTP 404 (WebFetch and curl with a browser user agent; the /work/ index lists no such page). The claim it backs, "150 trainings ... in 35 states", is true. | Protect Democracy's https://protectdemocracy.org/our-work/building-pro-democracy-collective-action/ says: "CSSE has hosted 150 trainings and tabletop exercises in 35 states." safeelections.org/about/ describes the committee ("nearly 150 training sessions in more than 35 states"). | Set `source.url` to https://protectdemocracy.org/our-work/building-pro-democracy-collective-action/ (the title text can stay). | None (judgment 0-20%, a few percent of the result at most) |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| slide_beyond_income_share | https://doi.org/10.1017/S0007123408000306 | verified (DOI) | Helliwell and Huang 2008, BJPS 38(4); the DOI is the one round 5 found by Crossref title search. The explainer's wording now matches the abstract as round 5 read it. |
| slide_violence_share | https://protectdemocracy.org/work/committee-for-safe-and-secure-elections/ | unreachable (404) | Finding 1; the claim is supported at the page named in the fix. |
| democracy_work_backlash_share, field_indirect_relative_effect | n/a | judgments | Notes say no study sizes them; no number to find. |

## Drivers
Unchanged from round 5: the field's yearly risk cut (judgment 0.5% to 20%), win years counted, missing-data discount, the next-dollar slider, the democratization GDP gain. No value moved. No high or medium finding open.
