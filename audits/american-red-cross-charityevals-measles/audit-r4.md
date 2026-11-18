# Audit: american-red-cross-charityevals-measles, round 4
Result: 2.484e-3 uov/$ = 1.242 years of healthy life per 1,000 dollars (combined range 0.158–9.77); cause median 0.0938 (×13.24). Verdict: pass.
Model-sha: fd0eaaba80d50e1b67c1c20286eac53226c07dea843e568d2e8bb2c875adaeb0
Rules: 0.3.12
Scope: scoped to the changes since round 3 (`git diff a0d083b9 b76ba3ed`): the new rows `msl_u5_years_after_five` and `msl_u5_after_five_deaths_per_child`, and the changed `deaths_averted_per_person`, `share_under5`, `benefit_midpoint_years`, `msl_u5_per_household`, `msl_5_14_years_at_risk` and `share_15_49_of_over15`, the summary's changed sentence, and the write-up's measles lines. Programme, year, cost and reach are as in round 3 and not rechecked.
Mechanical: lint 0 high / 1 medium (`far-above`, ×13.24, dealt with under Peers) / 1 low (the spread, which the summary states). Invariants: none. check.ts: all valid. Simulation stable: 5% 0.19×, 50% 1×, 95% 4.99× the best guess. Nothing written to generated/.
Previous round: #1 (protection after five) resolved: the two rows are added as the fix named and `deaths_averted_per_person` sums them. The explainer slip in `msl_5_14_years_at_risk` and the typed household sizes in the sibling explainer are resolved. Round-3 low #3 (regional GBD ratio) was not adopted: see finding 3. The other round-3 lows are unchanged.

The move from 1.036 to 1.242 (×1.20) is the +20% that round 3 predicted for #1. Engine values at default settings: `msl_u5_deaths_per_child` 0.001725, `msl_u5_after_five_deaths_per_child` 0.000394 (= 0.001725 × 0.0768 ÷ 0.8 × 5 ÷ 2.1, as the formulas say), `msl_5_14_deaths_per_u5_child` 0.000194, total 0.002313.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | sensitivity | `msl_u5_years_after_five` | The 2–10 range has no anchor beyond the arithmetic (ten years from five to fifteen, fewer where later campaigns would reach the child). The high end assumes no later wide-age campaign or routine contact, while `msl_wide_age_campaign_share` (0.1–0.8) says such campaigns reach 10–80% of children; the joint range does not tie the two. | Row explainer; `msl_wide_age_campaign_share` explainer. | Keep as a stated judgment (best 5 is the same halving that `msl_5_14_years_at_risk` applies). If the partnership's FY2025 campaign list is found, set both rows from it. | Not in the tornado's top 12 |
| 2 | low | structure | `msl_u5_per_household` | The low end 0.65 is typed: the shared 4.25 average household size (as `msl_5_14_per_household` reads it) × 0.15 under five, the 15% unsourced. | Row explainer; `msl_5_14_per_household` formula. | Optional: name the DHS rosters as the 15%'s source, as `msl_5_14_share_of_household` does. It is a ranged judgment, so no rule is broken. | <±1% |
| 3 | low | missing-adjustment | `msl_5_14_risk_ratio` | Round-3 low #3 (a regional GBD ratio about 40% above the Bauchi-based 0.077) was not adopted because its population ratio was from memory. **That is acceptable**: the row reads the site's shared GBD figures, and a figure from memory must not enter a model. Adopting the regional ratio would raise the after-five and 5–14 branches (25% of the deaths averted) by about 40%, so about +10% on the result: a low, not a verdict changer. | Round-3 audit; the row's formula. | Keep. If a shared regional age split of measles deaths is added to facts/death_ages.json, point the row to it. | About +10% if adopted |

## Checks on the changed rows
- **`benefit_midpoint_years`**: computes what it says and is not circular. Each branch is measured from the dose to the middle of its own protected years: under five 0.5 × `years_of_coverage` (1.05); after five `years_of_coverage` + 0.5 × `msl_u5_years_after_five` (2.1 + 2.5 = 4.6); 5–14 0.5 × `msl_5_14_years_at_risk` (2.5). Weighted by deaths averted: (0.001725 × 1.05 + 0.000394 × 4.6 + 0.000194 × 2.5) ÷ 0.002313 = 1.777, the engine's 1.7765. The rows it reads (the deaths rows and the years) do not read `wait_discount`, `deaths_averted` or any adjustment, so there is no cycle. Discounting once at the weighted midpoint rather than each branch at its own differs by about 0.15% at 4%.
- **`deaths_averted_per_person`, `share_under5`**: `share_under5` counts only the under-five branch (0.746), so the after-five deaths take the 5–14 death value (`share_5_14_of_over5` is 1), which is right for deaths at five or older; `value_per_death` is 120.8 (0.746 × 116.25 + 0.254 × 134). The explainers match.
- **`msl_u5_after_five_deaths_per_child`**: uses the 5–14 risk ratio and not `msl_age_risk_ratio` (0.8, for ages 3–5), so no age is counted twice; it shares `mortality_reduction`, `indirect_deaths_ratio` and the baseline rate with the other branches. It does not overlap the 5–14 branch (children already 5–14 at the campaign).
- **`msl_5_14_years_at_risk`**: "about 10, five years from fifteen" is right.
- **`share_15_49_of_over15`**: "Not used: no deaths at 15 or older are counted" is accurate (the row is 0).
- **Summary and write-up**: the summary's changed sentence ("the dose often comes on top of an earlier dose") is consistent with the model now counting protection after five. The write-up's headline span (1.2) is live and matches 1.242; the Measles bullet ("before and after five") and the 15 November line (0.36 to 1.2) match the model. No comparison with other charities (no lint `comparison`).

## Peers
1.242 is 13.2× the median of 126 global-health models (0.0938); round 3's explanation still holds. Models of child vaccination in low-income settings on the same chain run from 0.69 (Doctors Without Borders, charityevals) to 3.98 (New Incentives, GiveWell), so 1.24 sits inside them. The gap to the median is the setting's measles mortality at the site's one death value for a cheap visit, after the steep cuts (3% of children counted as extra, 0.5 missing data, 0.80 credit, 0.85 evidence). No row is wrong. Audit only; not for the summary or write-up.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| `msl_5_14_risk_ratio` | facts/givewell_common.json | verified (shared) | 0.5 × 0.000258566 ÷ 0.001684193 = 0.0768, as in round 3 |
| `msl_u5_per_household` | facts/household_size.json | verified (shared) | four-country average 4.25; the 15% under five is a typed judgment |
| top-5 inputs | as in rounds 1–3 | rows unchanged | not refetched |

## Drivers
1. `$missing_data_discount` (shared slider). 2. `msl_report_to_behaviour` (judgment). 3. `@american_red_cross.msl_spend_share` (estimate, Form 990 Schedule F). 4. `msl_setting_risk` (judgment, MMWR-anchored). 5. `msl_years_unvaccinated` (judgment). The new `msl_u5_years_after_five` is not in the top 12. Best improvement: the partnership's FY2025 campaign list with countries and age bands.

Verdict: pass

Re-stamped (16 Nov 2026): Pre-audit gate cleanup: judgments' explainers name their reference class (sourced); bystanders per arrest read from @cardiac_arrest.ohca_bystanders_per_arrest and ln 2 from @givewell_shared.ln_consumption_per_doubling (same best values); some judgment ranges widened where no evidence anchors them; no peer-model comparisons in explainers. Mechanical: headline unchanged, against 14a782cd.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 768b765f.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against cc9a04dd.
