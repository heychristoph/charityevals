# Audit r3: ubongo-charityevals (scoped verification)

Result: pass (0 high, 0 medium findings of our own; audit-model's far-above medium is explained in round 2 #1 and unchanged)
Model-sha: 0ef00b2bc17fe88b4af769859811ec7d36a11a80fee783fba1c5cbb792db599f
Rules: 0.3.13
Verdict: pass

Scope: the one change since round 2 (HEAD~1 to HEAD), the `effect_sd` explainer's Watson cross-check wording. `git diff` shows one line changed in the model file, in that explainer only. No value, range, formula or source change. `scripts/check.ts` reports all models valid; `scripts/audit-model.ts` gives the same result (51.9) and the same two findings as round 2 (far-above, explained; spread, low).

| # | Severity | Row | Finding | Status |
|---|---|---|---|---|
| R2 #2 | low | `effect_sd` explainer | Resolved. The text now says "about 39,000 children" (covers both 38,682 and 39,717), says 0.15 SD is "by our division", states the thesis's own 0.106 SD as the coefficient multiplied by the SD, and gives "PDF p. 169, printed p. 165". Matches the round-2 evidence (0.126, SE 0.035, SD 0.841; 0.106 in the thesis). | resolved |
| R2 #3 | low | `partner_share` | Kept by the builder: airtime terms are not published; the 0.4-1 range covers the hypothetical anchor. Accepted. | accepted |
| R2 #4 | low | `implementation_adj` | Kept by the builder: Ubongo's monthly count includes occasional viewers whom the surveys would class as non-viewers or light viewers, so the 0.55 cut is a defensible match of populations, and it errs conservative at worst. Accepted. | accepted |

No new findings.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against e1436081.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against cc9a04dd.

Re-stamped (23 Nov 2026), rule input-domains: Every input states its kind of number (domain); the simulation draws each by its kind, so no draw is a number it can't be (normalization 2.18, INV-27). Mechanical: headline unchanged, against the tree before the rule.
