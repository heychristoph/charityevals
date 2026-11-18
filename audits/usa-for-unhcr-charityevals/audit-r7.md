# Audit: usa-for-unhcr-charityevals, round 7 (verification)
Result: 5.991e-5 daly/$ = 0.0599 years of healthy life per 1,000 dollars (0.0599078; was 0.0599067). Verdict: pass.
Scope: only the changes since round 6: gik_us_ln_gain_per_person on the shared US donated-goods figures; pro_share_distressed and pro_doc_years read shared facts; rewritten explainers of gik_value_per_person and gik_inkind_equivalence.
Mechanical: preflight no high or medium (generated files re-run with summaries.ts); headline 0.0599067 -> 0.0599078 (+0.002%).

Findings:
1. [low, fixed] gik_value_per_person explainer called US$30 an "average" of UNFPA's catalogue; the page is one customised kit listed at a price of up to US$30. Reworded to "a price of up to US$30". No value change.

Checks passed:
- Formula: ln(1 + v * 0.85 * 0.7 / (CE spend per person * lowest-quintile ratio)); v is the kit/clothes value in current US dollars, the denominator is current US dollars per person per year; the two shared factors are dimensionless ratios (market value per recorded dollar; worth of in-kind goods per cash dollar). Dimensionally right and the same reading as the World Vision domestic model. The 0.45 abroad figure (with PPP) is no longer applied to US recipients, correct.
- gik_attribution_share still uses gik_inkind_equivalence (0.45) for the donors' resources behind all goods: acceptable, since it prices the goods' resource cost as the abroad-weighted blend for the whole programme, not a recipient gain, so there is no double counting of the benefit; the effect on the result of switching to 0.595 for the US share would be well under 1% (attribution ~6%, already low).
- Facts: @humanitarian_response.conflict_mental_disorder_prevalence = 0.221 (0.188-0.257), Charlson et al. 2019; @humanitarian_response.legal_aid_years = 3 (1-6); @united_states.donated_goods_value_vs_recorded = 0.85; @aid_value.inkind_goods_vs_cash = 0.7 (Wydick et al. 2018). All exist with stated values; reads are value-preserving.
- Sources: UNFPA DignityKits page says "only US$15 per kit" with pads, washing powder, soap, underwear, flashlight, comb, toothbrush, toothpaste (verified). Globalsupply page is the "Customized Dignity Kit (for price less than 30 USD)" listing, price 30 USD (verified as a ceiling).
- Explainers: no comparison with other charities, medians or peers (the World Vision mention is gone from both rows).

Verdict: pass
Model-sha: c0bb9605e1ffba7474ae7f98a9b7c460d6e470ec2febcd8d4c7c8f1b87d6806b
Rules: 0.3.11

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 2b148c62.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against c42a537d.

Re-stamped (16 Nov 2026): the summary's typed combined range replaced by the page's plausible range (placeholders). Mechanical: headline unchanged, against cc9a04dd.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against d150f0b2.
