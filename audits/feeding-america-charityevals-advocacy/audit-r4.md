# Audit: feeding-america-charityevals-advocacy, round 4
Re-stamped: `destination_reads` added for the shared moved-money rows (GiveWell's four top charities and the GiveDirectly prior, read as destinations at their figures on the rankings, docs/normalization.md 2.12); no formula or value changed and the result is unchanged (the money-moved branch is 0 here), so round 3's pass stands.
Verdict: pass
Model-sha: fb3e4a4b6e73c4d614c38d7d1155c367778dff2c762bc57a2f71c949efe188f6
Rules: 0.3.13

Re-stamped (15 Nov 2026): one consumption scale for US public money (normalization.md 2.14); 0.104 → 0.0875.
Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 2ef0280a.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 5724c36c.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 1 row changed, against HEAD.
Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 1 row changed, against cc9a04dd.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (steps 2 and 3a combined; no value change). Mechanical: headline unchanged, against HEAD.

Re-stamped (17 Nov 2026), rule credit-switch-co-funders: Credit rule 2.24, step 6: the co-funder switch counts co-funders only; the donors whose money a mover moves are mobilised (under mobiliser_share), so their new money leaves donor_cost_share. Only results with the switch on move. Mechanical: headline unchanged, against the tree before the rule.

Re-stamped (23 Nov 2026), rule input-domains: Every input states its kind of number (domain); the simulation draws each by its kind, so no draw is a number it can't be (normalization 2.18, INV-27). Mechanical: headline unchanged, against the tree before the rule.
