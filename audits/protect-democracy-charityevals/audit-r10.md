# Audit: protect-democracy-charityevals, round 10
Result: 1.797e-5 daly/$ = 0.01797 years of healthy life per 1,000 dollars (combined range 0.00076–0.423); cause median 0.0652 (×0.28). Verdict: pass.
Model-sha: 58eb490e4295c9525092da4a38f5ee37e8bc4927cfdf897102c94592a86980f8
Rules: 0.3.13
Scope: scoped verification of the change in commit 8fb7156 only (the answer to finding 4 of representus-education-fund-charityevals audit r1: the slide's severity moved inside the log). Rows bs_ln_gain, bs_severity, bs_evidence_adj, the canonical reading rows, the summary and the write-up. Nothing else re-audited.
Mechanical: audit-model lint 0 findings. Result moved from 0.017370 to 0.017974 (+3.5%), no move above 2x.
Previous round (r9): 1 low (commission inputs uncited) unchanged by this commit.

## What changed and the checks
- bs_ln_gain = ln(1 + @democracy.democratization_gdp_gain * bs_severity); bs_evidence_adj = bs_external_validity (was bs_severity * bs_external_validity). The slide's severity is applied exactly once: bs_severity now appears only in bs_ln_gain (its own definition aside), and bs_evidence_adj, bs_total_adj (product of bs_evidence_adj and the other adjustments), the side-effect rows and the reading rows contain no further severity factor. Nothing is lost either: the 60% is in the log.
- Size of the move: ln(1 + 0.2124 × 0.6) = 0.11990 against 0.6 × ln(1.2124) = 0.11555, a ratio of 1.0376 on the slide branch; the slide branch is about 92% of the result (the reform branch about 8%, which is unaffected), so 1 + 0.92 × 0.0376 = +3.5%, matching 0.017370 to 0.017974.
- Canonical and reading rows: ln_gain_per_person_year = bs_ln_gain (0.1199, the same as the peers' 0.1199 for Common Cause, League of Women Voters and RepresentUs, which is the point of the change); evidence_adj = (bs_value × bs_evidence_adj + ref_value × ref_evidence_adj) / (bs_value + ref_value) is for reading only, and now reads bs_value with the severity inside it (the weights are consistent with the adjustments they weight; the result is computed from bs_uov = bs_value × bs_total_adj × side factor, not from this row).
- Explainers on bs_ln_gain, bs_severity and bs_evidence_adj describe the new placement accurately.
- Summary and write-up: no stated figure is contradicted. "about 0.02" (0.01797), "about a quarter" of the median (×0.28), "about a twelfth" for the proportional-representation branch (8.3% of 0.01737 earlier; 8.0% now), "a slide ... counts as 60% of the full loss" (write-up), 1.3%, 11%, 4.5%, 35%, $3.4 million, 103,000 people: all unchanged and still right. No stale 0.0174 or 0.017 figure appears in the model, record or write-up.
- Peer consistency: the family now values a slide's severity one way (inside the log) in Common Cause, League of Women Voters, RepresentUs and this model; round 1's finding 4 of RepresentUs's audit is resolved.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | No new finding. | | | |

## Sources checked
No source row changed in this commit; the shared figures read (democratization_gdp_gain 0.2124, slide_severity_share 0.6) are in facts/democracy.json and unchanged.

## Drivers
Unchanged from r9: the field's cut per year, win_years_counted, the missing-data discount, the 2030 loss chance, the income gain. slide_severity_share now acts through the log (low 0.3 to high 1: 0.0100 to 0.0280).

Verdict: pass (0 high, 0 medium, 0 low new; r9's 1 low stands).

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against e247896f.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against c42a537d.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 3 rows changed, against cc9a04dd.
