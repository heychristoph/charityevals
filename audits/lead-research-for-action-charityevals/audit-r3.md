# Audit: lead-research-for-action-charityevals, round 3
Result: 2.630e-4 uov/$ = 0.1315 years of healthy life per 1,000 dollars (combined range 0.00128–13.55); cause median about 0.12 (round 1's figure, not re-printed; ×1.1). Verdict: **pass** (0 high, 0 medium, 0 new low; round 2's L2 and L3 remain with the builder).
Model-sha: 8edeadef42af5c9d911f24118d783e61914ac94cd2dd0bf9b03c05059e2edb1a
Rules: 0.3.10
Scope: unchanged from round 2: the whole charity, one programme (market studies of lead in consumer products), October 2024 to October 2026, no accounts (charities/lead-research-for-action.json one line, $300,000 a year). Scoped verification: only round 2's two mediums and what they touched.
Preflight: pass (no blocking lines; one low, generated/distributions.json out of date, which the builder regenerates before commit).
Previous round: N1 resolved. N2 resolved. L1 no change needed (agreed). L2 kept with its reason (low, the builder's). L3 open as a low (summaries to be regenerated before commit); neither re-opens the round. Round 1's H1 deferred to the owner by instruction, not open against this model.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| (none) | | | | No new high or medium introduced by the two fixes. | See checks below. | | Result 0.136 to 0.1315 (-3%), as round 2 predicted for N1 net of N2. |

## Checks of the two fixes
- **N1, gps_use_share**: now best 0.15 (0.08-0.30), as asked. Source page p. 30 (5.2.4) and its quote are in the report text: "50% of the women who had consumed soils in the past ate them regularly while pregnant" (download.txt lines 884-887; the 26% "currently or in the past" is the sentence before). The explainer states 26% ever, half regularly in pregnancy, about 13%, under-reporting suspected, and the range's high end sits above 13% for that reason. Resolved.
- **N2, gps_implementation_adj**: now 0.25 (0.05-0.50), `judgment`, anchored on Larson et al. (2025). Report p. 39 (6.4) quote is verbatim in the text (download.txt lines 1206-1208); the citation in the note (Larson, Mwangi, ... Pasricha, 2025, J Nutr 155(7): 2398-2405) matches the report's reference list (lines 1453-1455). The explainer states what was measured (percentage-point fall in prevalence after iron therapy), says awareness campaigns have no trial, and names the judgment. The explainer's earlier false statement ("no trial has measured") is gone. Resolved.
- **Nothing new**: the write-up's soils bullet reads `{{row:gps_use_share}}` live (no stale number; "about 15% of pregnant women eat them" is what it now prints, consistent with the row); no comparison with other charities; result read from `{{result}}`. The change touches only these two rows' values and text, so no chain, credit, discount or double-counting step is affected. audit-model result 0.1315 reproduces the drop expected from round 2's computation.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| gps_use_share | https://drive.google.com/file/d/1pqRUeejiRCX2bXekeZnL0zGi34zbK23w/view (text copy download.txt, p. 30) | verified | Quote present; 26% ever, 50% of those regularly in pregnancy. |
| gps_implementation_adj | same, p. 39 | verified | Larson et al. (2025), 8-11 percentage point decrease in geophagia prevalence with iron therapy; reference list entry present. |
| Other rows | | not re-checked | Verified in rounds 1-2; unchanged. |

## Drivers
Unchanged from round 2: `$mobiliser_share`, `$discount_rate`, `$win_years_counted`, `$missing_data_discount` (shared sliders), then `cookware_bll` (judgment, the most improvable), `issue_record_adj`, `@next_dollar.lead_research_for_action` (neutral factors), `enforcement_share`. The soils branch moves the headline by about 5% either way.
