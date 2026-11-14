# Audit: prison-policy-initiative-charityevals, round 4 (verification)
Result: 2.852e-5 daly/$ = 0.0285 years of healthy life per 1,000 dollars (combined range 0.0030–0.272); cause median 0.0693 (×0.41). Verdict: pass.
Model-sha: b315062f48f4987109e0a54cd65834756d8fcf53adc2dd7ab60bf3fbc17ab67f
Scope: unchanged (one programme column, four branches). Scoped to the round-3 fixes (git diff 7a7f7a2~1 7a7f7a2).
Mechanical: audit-model runs (0.0289 → 0.0285, −1.3%: the lowered copay and video-visit judgments outweigh the new 2021 interstate arithmetic); 0 findings; check.ts valid; simulation stable (5% 0.32×, 50% 1.00×, 95% 3.2× the best guess); 0 expected values reproduced differences. No generated/ changes.
Previous round:
- N1 (`ct_people` URL): resolved. The model URL is the cjppd-main path and WebFetch returns the 419 KB PDF (no 404). The text layer could not be extracted here, so the figure 10,098 rests on round 3's search-confirmed quote at this same path; unchanged.
- N2 (`ger_ls_gain`): resolved. The explainer now gives the paper's figure (about 11 percentage points more likely to be completely satisfied, most versus fewest rights) and a stated conversion to roughly 0.1–0.2 points; the 0.004 top and 0.0003 judgment are kept and follow from it.
- N3 (three money wins): resolved. `fcc2021_savings` is now `fed_savings_2024_order × fcc2021_interstate_share × fcc2021_cut_vs_2024`; the cut share is arithmetic from the caps (9/15 = 0.6 at prisons, 7/12–15 about 0.5 at jails, less for providers already under the cap: 0.45, 0.25–0.7) and the interstate share is a labelled judgment (0.15, 0.05–0.30). Copays and video visits are lowered to 2M (0.5–8M) with arithmetic anchors (people affected × fee × visits). All remain judgments by design, now with stated reasons.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| N4 | low | source | `copay_fee_savings` | The copay anchor names Nevada (2023) and Virginia from memory in the explainer, with no source row; the "about 30,000 people" is not tied to a tracker. | Explainer text. | Cite PPI's copay tracker or drop the state names; keep the judgment. | below 1% (row's range 0.5–8M) |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| ct_people | portal.ct.gov cjppd-main path, Oct 2023 report | URL resolves (PDF); number not re-extracted | N1 resolved; value verified at this path in r3 |
| ger_ls_gain | SSRN 203211 | verified in r3 | 11 pp figure now stated as published |
| fcc2021 caps | Federal Register 28 July 2021 (as cited) | not re-fetched | 21¢ → 12¢ prisons / 14¢ large jails, as r3 recorded |
