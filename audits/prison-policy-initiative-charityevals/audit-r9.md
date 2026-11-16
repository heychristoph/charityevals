# Audit: prison-policy-initiative-charityevals, round 9 (scoped verification)
Result: 6.033e-5 daly/$ = 0.0603 years of healthy life per 1,000 dollars (combined range 0.0054–0.678); cause median 0.0682 (×0.88). Verdict: pass.
Model-sha: dab33b2f68ca0626a23fc5c488a7d8a03ce16eab9a57de63c9eb6ede5dabdb4f
Scope: scoped to the change since round 8: row fed_uov_per_dollar (phone-company owners' term now fed_owner_multiple x @united_states.ce_expenditure_per_person_2024), fed_owner_multiple's label/explainer, and the write-up. Nothing else re-audited.
Mechanical: lint 0/0/0 (audit-model: Findings (0)), invariants none, normalization-audit no violations (run in background, then `git checkout -- generated`), summaries and simulation-check ran without instability; result 0.0631 to 0.0603 (-4.4%).
Previous round: round 8 had no findings.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | write-up | The write-up says "Six independent audit rounds were run" while audits/ now holds nine. | writeups/prison-policy-initiative-charityevals.md line 40. | Update the count (or drop the number) at the next write-up edit. | none |

## Checks asked for
1. **Formula.** fed_uov_per_dollar = $uov_per_ln_consumption * (1/family_consumption - fed_commission_share * mcpf / (payer_multiple * consumption_per_person_2024) - (1 - fed_commission_share) / (fed_owner_multiple * ce_expenditure_per_person_2024)). Units are consistent (UoV per $), the shares sum to 1, and the owners' term now sits on the survey base.
2. **Consistency with 2.14.** The rule puts groups on the Consumer Expenditure Survey base and leaves only the taxpayers who fund public money on the national-accounts base. The model does exactly that. California YIMBY's model builds its landlord consumption as ce_expenditure_per_person_2024 x landlord_multiple (x a California factor, which does not apply to a national phone-company owner set), with the same multiple 2 as here; fed_owner_multiple's explainer quotes YIMBY's 2 (1.2 to 3.5) accurately next to its own 1 to 4.
3. **Taxpayers' term unchanged.** Still commission share x mcpf / (payer multiple x national-accounts consumption), identical to st_uov_per_dollar's taxpayer term.
4. **No other group on the national-accounts base.** grep of the model: consumption_per_person_2024 appears only in fed_uov_per_dollar's taxpayer term and st_uov_per_dollar's taxpayer term (both taxpayers); the families' consumption and the owners use ce_expenditure_per_person_2024.
5. **Result move.** The owners' consumption falls from 2 x national accounts to 2 x the (lower) survey figure, so their loss weighs more and the federal branch falls slightly; 0.0631 to 0.0603 matches. Within the cause median band.
6. **INV-15 / write-up.** The write-up states taxpayers at national-accounts consumption and the owners as a group at twice the US survey average per person, as for landlords in YIMBY's model; the model's explainers say the same. Summary unaffected by the change.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| fed_owner_multiple | (judgment, no source) | n/a | ranged judgment with anchor (YIMBY landlord multiple) named |

## Drivers
Unchanged from round 8 (win_years_counted, missing_data_discount, dec_attribution_share, next-dollar figure, dec_people). The owners' multiple is a minor driver.

Re-stamped: low and medium findings fixed after the round (wording in the model and write-up only, no formula or number changed).

Re-stamped (15 Nov 2026): one consumption scale for US public money (normalization.md 2.14); 0.0603 → 0.054.
Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.

Re-stamped (16 Nov 2026): Preflight cleanup: judgments' explainers name their reference class (or say plainly there is none); labels and unit labels say what the rows are; no value changed. Mechanical: headline unchanged, against migrate/data-model.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against a8d130f3.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against c42a537d.
