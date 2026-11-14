# Audit: earthjustice-charityevals-biodiversity, round 3 (verification)
Result: 7.148e-10 daly/$ = 7.148e-7 years of healthy life per 1,000 dollars, unchanged from round 2 (7.15e-10).
Scope: only the change in d44289d: row `hectares_per_acre` now reads the shared fact `@climate.ha_per_acre`.
Previous round: audits/earthjustice-charityevals-biodiversity/audit-r2.md (pass).

## Checks
- Fact `climate.ha_per_acre`: value 0.4046856 ha per acre, kind observed, source NIST Handbook 44 Appendix C, quote "1 acre = 0.404 685 6 hectare". The value matches the quote exactly (international acre, 4,046.856 m2). Unit, label and explainer are right.
- Row `hectares_per_acre`: formula `@climate.ha_per_acre`, no leftover value, kind or source; explainer says it is the shared figure and names NIST. The shared fact carries the source, so the model no longer holds its own copy (the INV-4 flag).
- Headline: the old input was 0.404686 and the fact is 0.4046856, a relative difference of 1e-6, far below the model's uncertainty. audit-model prints 7.148e-10 daly/$, the same as round 2; check.ts reports all models valid. Tornado, drivers and range are unchanged.

## Findings
None.

Verdict: pass
Model-sha: ae92505d59fe6cc59e41d350a871c548b8f20088beb00e8dc1f58a66d79d2b58
