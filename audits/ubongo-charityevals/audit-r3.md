# Audit r3: ubongo-charityevals (scoped verification)

Result: pass (0 high, 0 medium findings of our own; audit-model's far-above medium is explained in round 2 #1 and unchanged)
Model-sha: af05f9152d54927331d591ac1d483d2ea48984f327898bea64c065e68378eb10
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
