# Audit: doctors-without-borders-charityevals-relief, round 3 (verification)
Scope: only the change since round 2 (fix needed, INV-15): the summary's new reason for being over ten times its peers. The diff also shows beneficiaries reformatted to multi-line with the same values; nothing else changed (7 lines added, 2 removed).
Mechanical: audit-model 0 high, 0 medium, 1 low (spread, below); headline 0.7008 years of healthy life per $1,000, combined range 0.1539-3.191, identical to round 2; INV-15 no longer fires (no high finding; the multiple is x10.21 against a median of 0.0686, and the summary now gives the reason); generated/ untouched.

Previous round:
1. INV-15 summary reason: resolved. The stated reasons check against the rows:
   - "Cheap kits, an estimated EUR 45 a family": @msf.relief_cost_per_family_eur is a judgment of 45 (25-90), and the tornado shows it as the second largest driver (0.97 at 25, 0.51 at 90).
   - "A judged death rate of 1.5 per 10,000 a day, above Sphere's emergency line": crisis_mortality_rate is 0.055 a year (0.0365-0.1), 1.5/10,000 x 365 = 0.0548; Sphere's emergency threshold is 1 per 10,000 a day (0.0365), cited in the row's explainer. It is the highest crisis death rate in the template's canonical-rows table (next 0.02), and the tornado ranks it third.
   - "Mosquito nets in them avert malaria deaths": the relief_net_* rows value the nets' children's deaths averted per person reached (trial all-cause effect), a separate term from the other items.
   The summary keeps its sentence "the result is mostly uncertainty" (round 2's #2).
2. Spread (round 2 #2, low): the model's own ranges still span 1026x and the summary says the result is mostly uncertainty; optional, no change needed.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
(none)

Verdict: pass
Model-sha: 3c5cbb8a4b3df5b2b695ad0fc8ec1c2772e5d02a80f32372c835719af2e178ad
Rules: 0.3.5

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.

Re-stamped (16 Nov 2026): Typed refugee-relief figures now read shared facts (@humanitarian_response.*, @ukraine.war_affected_aid_recipients_consumption_share) at the same values; judgment explainers anchored on studies and published data (pre-audit gate cleanup). Mechanical: headline unchanged, against e247896f.

Re-stamped (16 Nov 2026): Pre-audit gate cleanup: judgments' explainers name their reference class (sourced); bystanders per arrest read from @cardiac_arrest.ohca_bystanders_per_arrest and ln 2 from @givewell_shared.ln_consumption_per_doubling (same best values); some judgment ranges widened where no evidence anchors them; no peer-model comparisons in explainers. Mechanical: headline unchanged, against 2b148c62.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 768b765f.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against cc9a04dd.
