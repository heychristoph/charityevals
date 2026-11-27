# Audit: lead-exposure-elimination-project-charityevals, round 8
Result: 0.01084 uov/$ = 5.419 years of healthy life per 1,000 dollars (combined range 0.19–68.8 on the model's own ranges); cause median 0.1196 (×45.3). Verdict: pass.
Model-sha: dcd09d5a2650c641d414ffee49b57be3dce03b491e454a404577e3d840c8eafc
Rules: 0.1.0
Scope: a scoped verification of the round-7 medium and its fix only. Programmes and year modelled are unchanged from round 6.
Preflight: passes (no blocking line); two low "generated" lines (stale generated/distributions.json and usage.json), the builder's to refresh with `npx tsx scripts/summaries.ts` before commit.
Previous round: round 7's one medium (finding 1, peer mention in the write-up) is resolved. Its low (stale generated files) is still open and is the builder's.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | generated files | generated/distributions.json and generated/usage.json are out of date (preflight lows). | Preflight output. | Run `npx tsx scripts/summaries.ts`. | 0 |

Checked and fine:
- **Round-7 medium fixed.** The write-up's "How this model was checked" now reads "In November 2026 adults' lead deaths were scaled to the protected countries' age structure: their populations are much younger than the world's, so a year of lower blood lead there averts fewer heart-disease deaths." The clause "as the site's other lead models do" is gone; a grep of the write-up for "other lead", "peer" and "median" finds nothing, and the preflight output has no peer-mention line.
- **Nothing new introduced.** The model's sha equals round 7's (57a4bef0...), so the model is byte-identical and the result is unchanged (audit-model: 5.419 years per $1,000). The write-up still uses `{{result}}`, so it stays live. The only text change is the deleted clause; the sentence stays accurate.

## Sources checked
None: the model is unchanged since round 7, whose source checks stand.

## Drivers
Unchanged: discount_rate, mobiliser_share, win_years_counted (site judgments), paint_share (a judgment, 4% to 40%), missing_data_discount. Most improving: a sourced paint share of children's blood lead in these countries.

Re-stamped (23 Nov 2026), rule input-domains: Every input states its kind of number (domain); the simulation draws each by its kind, so no draw is a number it can't be (normalization 2.18, INV-27). Mechanical: headline unchanged, against the tree before the rule.

Re-stamped (25 Nov 2026): the plain-words story (docs/story.md) added; no value changed.

Re-stamped 27 Nov 2026: source link points to the model's page (the old /<model-id> address was a 404); values unchanged.
