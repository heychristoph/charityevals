# Audit: earthjustice-charityevals-health, round 6 (verification of the compliance-cost rule 2.21, text fixes of round 5)
Result: 1.186e-5 uov/$ = 0.005932 years of healthy life per 1,000 dollars (unchanged from round 5). Verdict: pass.
Verdict: pass
Model-sha: 122aca2982967ca4d15118fa01418ddb8b46a6ce6289307e179191d2c50486c1
Rules: 0.3.13

Scope: scoped verification of the text fixes (`summary`, writeups/earthjustice-charityevals.md compliance line, facts/compliance_costs.json PM2.5 table label and power-plant url). No formula changed.

Mechanical: `audit-model.ts` exit 0; one MEDIUM far-below (peer line, being removed elsewhere, ignored per brief). normalization-audit, simulation-check not run (caller runs them).

Previous round: round 5 findings: 1 (stale "not counted" sentences) fixed in summary and write-up; 2 (PFAS "about equal") fixed; 3 (unmodelled_benefits_adj explainer line) still open, low; 4 (quote lacks "2022 dollars") still open, low.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | missing-adjustment | `unmodelled_benefits_adj` explainer | Still no line that the other wins' compliance costs are not counted (round 5 finding 3). | Explainer text has no "compliance" sentence. | Append: "These wins' compliance costs are not counted: the 50% is of the modelled benefits, gross of costs." | none |
| 2 | low | source | facts/compliance_costs.json `us_pfas_npdwr_2024_cost_per_year` | Quote still lacks the price year (round 5 finding 4). | | Add the preamble sentence naming 2022 dollars. | none |

Checks:
- Summary against the computed rows: pfas_compliance_uov -1347.7 over four years against the PFAS branch's gross value of about 225 (pfas_downstream 3,975.7 x pfas_total_adj 0.0288 x (1 + DBP share 0.248) = 143, plus illness 172.5 x 0.0288 x 1.35 = 6.7, both x 1.5 for other wins). The costs exceed the deaths averted several times, and the branch nets to about -1,120: "costs exceed the deaths they avert, so that branch counts below zero" is true. PM2.5 nets +about 5,700 (gross 6,578 less 852): "nearly all from the PM2.5 standard" holds.
- The sentence "compliance costs aren't counted" is gone from the summary; the write-up line now reads "Compliance costs ... are subtracted, from EPA's own figures; for the PFAS standards they exceed the value of the deaths averted on our scale", consistent with the model.
- facts: PM2.5 label now "Table ES-10", which matches the RIA (the table "Estimated Monetized Benefits, Costs, and Net Benefits of the Control Strategies"; "Costsb $200 $340 $590 $1,500"). Power-plant fact: the EPA fact sheet (cps-111-fact-sheet-standards-and-ria-2024.pdf, p. 2) reads "$270 billion in climate benefits; $120 billion in health benefits; and $19 billion in compliance costs", matching the quote and the $0.98 billion a year ("a single year ... $0.98 billion in compliance costs"), 2019 dollars per the explainer.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| us_pm_naaqs_2024_cost_per_year | EPA RIA, Table ES-10 p. ES-27 | verified | label now ES-10, correct |
| us_power_plant_rule_2024_cost_per_year | https://www.epa.gov/system/files/documents/2024-04/cps-111-fact-sheet-standards-and-ria-2024.pdf | verified | quote on p. 2 of the fact sheet (wraps across a line) |

## Drivers
Unchanged: text-only fixes.

Verdict: pass
Model-sha: 122aca2982967ca4d15118fa01418ddb8b46a6ce6289307e179191d2c50486c1
Re-stamped (15 Nov 2026): merged with the one-consumption-scale and no-comparison changes; compliance-cost rows (2.21) now on the survey scale (2.14); headline moves under 2×.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 1807d315.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 5724c36c.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 1 row changed, against HEAD.

Re-stamped (17 Nov 2026), rule mobiliser-share-30: typed results in the model's text made placeholders or recomputed at the 30% mobiliser share, and wrong prose placeholders corrected; no row changes. Mechanical: headline 0.00397 → 0.001191 (−70%), 15 rows changed, against ca214e5f.

Re-stamped (23 Nov 2026), rule input-domains: Every input states its kind of number (domain); the simulation draws each by its kind, so no draw is a number it can't be (normalization 2.18, INV-27). Mechanical: headline unchanged, against the tree before the rule.

Re-stamped (25 Nov 2026): the plain-words story (docs/story.md) added; no value changed.

Re-stamped 27 Nov 2026: source link points to the model's page (the old /<model-id> address was a 404); values unchanged.
