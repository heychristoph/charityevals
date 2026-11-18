# Audit: norwegian-refugee-council-charityevals-advocacy, round 9
Re-stamped: `destination_reads` added for the shared moved-money rows (GiveWell's four top charities and the GiveDirectly prior, read as destinations at their figures on the rankings, docs/normalization.md 2.12); no formula or value changed and the result is unchanged (the money-moved branch is 0 here), so round 8's pass stands.
Verdict: pass
Model-sha: e0c60ecbc0e7b16c4d17c83081d7cb16ae3290040b90a2f5d3561ce6f8685b7f
Rules: 0.3.4

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.

Re-stamped (16 Nov 2026): Typed refugee-relief figures now read shared facts (@humanitarian_response.*, @ukraine.war_affected_aid_recipients_consumption_share) at the same values; judgment explainers anchored on studies and published data (pre-audit gate cleanup). Mechanical: headline unchanged, against e247896f.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 2b148c62.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): the summary's typed combined range replaced by the page's plausible range (placeholders). Mechanical: headline unchanged, against cc9a04dd.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 3 rows changed, against HEAD.
Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 1 row changed, against d150f0b2.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (steps 2 and 3a combined; no value change). Mechanical: headline unchanged, against HEAD.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against ce8e784f.

Re-stamped (17 Nov 2026), rule credit-switch-co-funders: Credit rule 2.24, step 6: the co-funder switch counts co-funders only; the donors whose money a mover moves are mobilised (under mobiliser_share), so their new money leaves donor_cost_share. Only results with the switch on move. Mechanical: headline unchanged, against the tree before the rule.
