# Audit: doctors-without-borders-charityevals-advocacy, round 2 (verification)
Result: 1.304e-4 uov/$ = 0.0652 years of healthy life per 1,000 dollars (combined range 0.00692–0.614); cause median 0.1042 (×0.6255). Verdict: pass.
Scope: only the fix to round 1's one medium finding (the "under a tenth" claim in the summary and the write-up's "Why it is so low"), and that nothing else in the model changed since round 1's review. The model's diff vs HEAD is the summary sentence and the `aw_aid_vs_cash` row (formula `@aid_value.humanitarian_vs_cash`) that round 1 approved; nothing else differs.
Mechanical: audit-model lint 0 findings (warns on the 10^6 spread and judgment share only); check.ts "all models valid"; result and range identical to round 1 (0.06519; 0.00692–0.614). normalization-audit not run (per the caller).

Checks:
- Summary now reads "below the site's global-health median (about three fifths of it)"; write-up "Why it is so low" reads "About three fifths of the site's global-health median". audit-model: "median of 71 global-health models: 0.1042 (this model ×0.6255)", so about three fifths is right (0.63), and the old "under a tenth" is gone from both places. Verified.
- The rest of the summary and write-up text is unchanged from round 1's review (shares 89 / 4 / 7%, drivers, combined range 0.007 to 0.61, headline 0.065).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| none | | | | No high or medium finding; round 1's medium is fixed. | | | |

## Sources checked
None new (round 1's recomputation of the aid_value fact stands; no source on the changed text).

Verdict: pass
Model-sha: 58b920ab6d0339bd439b7a0a0601f352e3d7426b4754a4a20ae56280e0206cce
