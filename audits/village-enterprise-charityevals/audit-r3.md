# Audit: village-enterprise-charityevals, round 3 (verification of the round-2 changes)
Result: 0.007652 uov/$ = 3.83 years of healthy life per 1,000 dollars (combined range 1.29–11.4); cause median 0.0686 (×55.7). Verdict: pass (0 high, 0 medium, 2 low).
Scope: scoped verification round. Only the 8 low findings of round 2 and the rows and write-up lines changed in commit 72713d68 were checked; nothing else was re-audited.
Mechanical: audit-model reports no high finding; the one medium (far-above) is the known flag explained in earlier rounds (the row is `ln_gain_per_person`, supported by two trials). Tornado figures in the write-up (Uganda core -16% to +16%, Kenya -12% to +12%, funging -15% to +10%, spillovers -9% to +27%, persistence and fade) match audit-model.

## Round-2 findings

| Round-2 item | Status | Check |
|---|---|---|
| delay_years | resolved | Now 0.33 (0.2-0.5), spending to first gains only; the funds-held wait stays in `gift_to_grant_years`, and `wait_discount` adds the two once. |
| sprint_households | resolved | 1 staff-year x 600 businesses x 3 entrepreneurs = 1,800; range 600 (one third of a staff-year) to 5,400 (3 staff-years). Arithmetic reproduces. |
| gov_households_per_year, gov_evidence_adj | resolved | Anchors named (KSEIP 7,500-household cohort, Rwanda's 14,500 parasocial workers; KSEIP evaluation's +30% and the Niger trial, with reasons for the cut). Values unchanged apart from the widened range (3,000-60,000). |
| savings_leader_usd | resolved | Now a formula from `sg_members_per_group`, `sg_officers_per_group`, `sg_officer_hours_per_year`, `hours_per_working_year` and `baseline_consumption` (47,505 / 30 x 3 x 75 x 382.9 / 2,000 = US$68,200). The 2,000-hour year matches facts/water.json. See finding 2. |
| government_staff_usd, boma_usd | resolved | 15,000 + 30,000 + 15,000 = 60,000 (150 x 200 h x 0.50 = 15,000), rounded up to 80,000; BOMA 10% of about 1.75M = about 175,000, written as 170,000. Both reproduce. |
| crs_nawiri_usd | resolved | New, in `partner_resources` and in the `attribution_share_shared` explainer; US$987,009 and US$68,384 figures match the Form 990 numbers in the earlier rounds; a third of 987,009 = 296,000, written as 300,000. Share stays 0.955. |
| Explainers: program_spend, leverage_funging_adj, dreams_ethiopia_missing_data_adj, unmodelled_benefits_adj | resolved | Nawiri 987,009 / 17,076,992 = 5.8% ("6%"); the six listed lines sum to 17.07M; government adoption points to `uov_government_adoption`; the two small activities are in `unmodelled_benefits_adj` at 0 (0 to +1%) without moving its net +2%; Ethiopia's 7,209 matches `households_ethiopia`. |
| Write-up (adjustments bullet, drivers, round 2 line) | resolved | CRS added to the bullet; Uganda spread -16%/+16% matches; "3.77 to 3.83" matches the current result. |

## New findings

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | wording | `program_spend` | The explainer is missing a comma or "and" in the list: "(Nawiri, 6%, ended early in 2025) the work helping the Kenyan and Rwandan governments", so it reads as if the work follows Nawiri's description. | Text of the explainer. | Insert "," or "and" after "(Nawiri, 6%, ended early in 2025)". | none |
| 2 | low | arithmetic | `savings_leader_usd` | The explainer says "about US$69,000", but the formula gives US$68,200 (1,583.5 groups, not the rounded 1,600). | 47,505 / 30 x 3 x 75 x 382.9 / 2,000 = 68,211. | Write "about US$68,000". | none |

Verdict: pass. Findings: 0 high, 0 medium, 2 low.
Model-sha: a1a2576e71b69765040469f56e6fc18e4789d2950e0da9b24c5f32013c969922
