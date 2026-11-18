# Audit: labri-charityevals, round 2
Result: 0.003157 uov/$ = 1.579 years of healthy life per 1,000 dollars (combined range 0.0207–120.3); cause median 0.1196 (×13.2). Verdict: **pass** (scoped verification: no open high or medium; 3 low for the builder).
Model-sha: 076f80cc0cd8d61c1e71f5743cce022ec48da40eaf111a4f6434b079ce120524
Rules: 0.2.0
Scope: unchanged from round 1 (the whole charity, one programme, April 2025 to October 2026; no accounts exist). Not re-audited; only round 1's three mediums, the changes made for them and what those changes introduced.
Preflight: pass (no blocking lines). One low: generated/distributions.json is out of date for this model.
Previous round: finding 1 (implementation_adj double-counts legacy soil) resolved. Finding 2 (source_share below both whole-population estimates) resolved. Finding 3 (shared battery-smelting persistence and adult-exposure figures) resolved by a reason that holds. The eight lows are the builder's; their state is noted below.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | generated/distributions.json | The model's simulation is out of date after the changes (preflight low). | Preflight output | Run `npx tsx scripts/summaries.ts`. | none |
| 2 | low | presentation | write-up, "How this model was checked" | "That took the result from 1.1 to about {{result}}" types round 1's headline as a number, which is the old result and will not follow the model. | writeups/labri-charityevals.md | Drop "from 1.1", or say "raised the result" and leave the number to `{{result}}`. | none |
| 3 | low | normalization | lead_cvd_value_per_death | Round 1 finding 9 is answered with a reason rather than a fix: facts/death_ages.json has world, UK and US splits only, so the Philippines' younger heart-disease deaths are valued at the world's ages (small, upward). The explainer now says so. Under "fix, don't flag" the fix is still open. | facts/death_ages.json holds `cvd_share_*_world/_gbr/_usa` only | Add `cvd_share_<band>_phl` from WHO Global Health Estimates to facts/death_ages.json and read it here. | small, upward |

## Round 1 findings, one by one

1. **implementation_adj (medium): resolved.** Label is now "Share of unlicensed smelting the rule stops in the years counted". The legacy-soil reason is gone, and the explainer says in a parenthesis that lead already in the soil is not counted as removed. The best guess, 0.4 (0.15–0.65), rests on collection and enforcement alone, with the Brazil anchor ("about fifteen years … over three quarters"). The write-up's "Delivered" bullet matches. Brazil years in the note now read 2005 to 2019 (finding 10). The explainer's added line on sellers' lost premium (finding 6) is the one-line option the audit allowed.
2. **source_share (medium): resolved.** Best guess 20% (3%–35%). The explainer states the weighting: the two whole-population estimates (CGD's third scaled down for the Philippines' 40% unlicensed share, the charity's quarter discounted as the proposer's own), with the near-site estimates setting only the low end. source.note carries the charity's 25% quote and Ericson et al. 2016 (PubMed 28283119). Both were verified in round 1; the 40% share is the charity's Q2/Q3 2026 project with the regulator.
3. **exposure_life_years and adult_vs_child_exposure (medium): resolved by a reason that holds.** Lead Research for Action's rows (5 years; 0.8) concern pots, plates and hair dye, where exposure ends when the product is discarded, and its own explainers say so. No other model values battery smelting, so there is no second reader of a shared fact. Both explainers here now give a reference class: soil lead persistence (petrol lead in city soils) and WHO's 4–5× absorption by children. Peer comparisons were removed from the text.
4. **Tanzania and six countries (low): resolved, and the source holds.** Fetched the Q4 2025 newsletter: "Market research in Malawi and Tanzania", with "less likely to be so in Tanzania". Six countries are the Philippines, Malawi, Tanzania, Georgia, Togo and Cambodia. Georgia and Togo are in lag_share and the write-up, and the Q4 2025 newsletter is in the resources.
5. **Volunteers (low): resolved.** 0.35 → 0.33, and the explainer names the four reviews.
6. **Sellers' lost premium (low): resolved** by the one-line explainer option, also in the write-up's "What isn't modelled".
7. **Typed numbers in the write-up (low): resolved for seed_grant and iq_per_ug.** A new typed number appears, see finding 2.
8. **evidence_adj explainer (low): resolved.**
9. **CVD age mix (low): not fixed**, see finding 3.
10. **Brazil years (low): resolved.**
11. **Label and summary (low): resolved.** The summary is four sentences.

## Changes made in this pass and checked for new problems

- **years_until_effect**, now 4 years (2.5–7), counted from the middle of the spending. April 2025 to October 2026 has its middle in January 2026, so the base date is right, and the explainer's reasoning (drafting and consultation from 2027, then collection and enforcement) holds. It is also the base date the Lead Research for Action model uses for its own spending. The row stays a ranged judgment with its anchor.
- **facts/philippines.json** (births 1,840,477 and people aged 65 and over 6,045,539, 2023): both observed, each with its UN WPP 2024 source, URL, and figure quoted in `page`. Verified in round 1 against the OWID series. The model reads `@philippines.births_2023` and `@philippines.older_adults_2023`. Nothing is typed.
- **@next_dollar.labri** is now 0.7 × 0.7 × 1.0 = 49% (20%–90%), dated November 2026, with room, use and run each stated in source.note. It is the neutral factors of normalization.md 2.10, as the other charity with the same evidence situation has, and the row carries `published: 1`, so INV-18 holds. It lowers the headline by about 12%, which is not an upward tune.
- **Result move**, 1.119 → 1.579 (+41%). It follows from implementation_adj 0.3 → 0.4 (+33%), source_share 0.15 → 0.20 (+33%), the next dollar 0.56 → 0.49 (−12%), attribution 0.35 → 0.33 (−6%) and the earlier base date for years_until_effect. Each change is the round 1 fix or a consistency fix, and each has its reason. Nothing else was touched on the path.
- **The charity's spending and `lines`** (charities/labri.json) are unchanged and still match the model's cost.

## Peers

The result is now 13.2× the global-health median (round 1: 9.4×), so audit-model flags `far-above`. The row is found, so this is a note and not a finding. One national policy covering a whole birth cohort of 1.84 million, counted over the shared `$win_years_counted`, is set against a cost of about $320k. It carries the shared lobbying chance (`@democracy.lobbied_issue_change_rate`) times `issue_record_adj` 1.0, the policy-chance judgment accepted in round 1 (an existing producer-responsibility law, an industry endorsement, a 2024 industry request). No row uses a different counting rule from the site's. The model's own summary and write-up already say the result is very uncertain, and neither compares with peers.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| lag_share, facts (Tanzania, six countries) | labrecyclinginitiative.com/post/q4-2025-newsletter | verified | "Market research in Malawi and Tanzania"; Tanzania judged less likely to be impactful |
| lag_share, summary (Malawi dropped, Georgia, Togo, Cambodia) | …/post/q2-q3-2026-newsletter | verified | "will not be continuing full programme work in Malawi"; "Georgia, Togo and Cambodia" |
| source_share (CGD, charity's 25%, Ericson 2016) | CGD; Q2/Q3 newsletter; PubMed 28283119 | verified in round 1 | Source note now carries all three; unchanged since |
| philippines.births_2023, older_adults_2023 | ourworldindata.org grapher CSVs | verified in round 1 | The same figures, now in a facts file |
| @next_dollar.labri | Q2/Q3 2026 newsletter | verified | Quote present; neutral factors, dated November 2026 |

## Drivers
1. `$mobiliser_share`, `$win_years_counted` and `$discount_rate` (shared sliders, set by the site).
2. `source_share` (judgment, 0.24–2.76), now anchored on both whole-population estimates.
3. `implementation_adj` (judgment, 0.59–2.57), now anchored on collection and enforcement.
4. `@next_dollar.labri` (estimate, 0.64–2.90), the neutral figure.
5. `$missing_data_discount` (slider), then `attribution_share_shared`, `issue_record_adj`.

Best improvements: a measured share of Philippine children's blood lead from unlicensed smelting (the charity's planned Metro Manila study), a published draft of the rule, and the charity's first accounts.
