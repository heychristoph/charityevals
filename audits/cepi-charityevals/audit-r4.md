# Audit: cepi-charityevals, round 4 (verification of round 3's one low)
Result: 5.205e-4 daly/$ = 0.5205 years of healthy life per 1,000 dollars (unchanged from round 3); cause median 1.576 over 15 catastrophic-risk models (×0.33). Verdict: **pass** (no high findings; 0 medium, 0 low).
Model-sha: fad169c387dbf9d0285993d13dc2453d2201d3f379009c55e9d6f342721e1c83
Scope: only the two changes since round 3: the `mpox_deaths_per_year` explainer and the write-up's "How this model was checked" paragraph.
Mechanical: audit-model.ts 0 findings; check.ts: all models valid (warnings only: joint-extreme span, judgment share ~70%, 30 point inputs); result 0.52 years per $1,000, as in round 3. Invariants, normalization-audit and simulation-check: not re-run (no formula, value, range or shared figure changed).
Previous round: finding 1 (`mpox_deaths_per_year` high end read as a measured figure): resolved, see below.

Checks of the changes:
- **`mpox_deaths_per_year`.** Value and range unchanged (500; 170–1,100), `kind: judgment`, no source block. The explainer now states: the low end is the WHO sitrep 67 count (244 deaths among confirmed cases, 1 January 2025 to 31 May 2026, about 170 a year); 500 is "our judgment" from most Democratic Republic of Congo cases going untested; 1,100 is "about six and a half times the confirmed count" for a year with a larger untested epidemic. 1,100 / 170 = 6.47, so "about six and a half" is right. The suspected-case death claim is gone; no figure is presented as measured except the 244, which matches the sitrep text extraction (global row, 61,061 cases, 244 deaths). The ranged judgment names its anchor (the 170 floor), as the rules require.
- **Write-up.** "All were fixed, and two verification rounds checked them" matches the audit history (round 3 and this round). The rest of the paragraph is unchanged and was checked in round 3 (0.69 to 0.52; round 2's four lows). No stale number.
- **Result.** Unchanged at 5.205e-4 daly/$; the branch is 0.4% of it.

No findings.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| `mpox_deaths_per_year` low end | WHO sitrep 67 | verified | 244 deaths among confirmed cases, global, 1 January 2025 to 31 May 2026, in the text extraction of the report. |

## Drivers
Unchanged from round 3.

Re-stamped: mechanical shared-fact change (INV-14): fb_work_years reads @catastrophe.field_work_years, the same 5 (2 to 10) every catastrophic-risk model had typed; result unchanged.
Re-stamped (15 Nov 2026): pandemic and nuclear extinction chances read the new sliders (same defaults; mechanical)

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against ee138d3d.

Re-stamped (16 Nov 2026): unit labels state per $1M (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against e8ecb2b3.

Re-stamped (16 Nov 2026): the summary's typed combined range replaced by the page's plausible range (placeholders). Mechanical: headline unchanged, against 7dbeec92.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 7 rows changed, against HEAD.
