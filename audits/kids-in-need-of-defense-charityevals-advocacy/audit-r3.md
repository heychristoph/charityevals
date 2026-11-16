Model-sha: 65f1879376e29d14ef56077013bfc782c3fbc865f1d0fe6c285b36d46bb16e94

# Audit round 3: KIND advocacy (scoped verification)

Scope: the four explainer edits since round 2. `git diff` shows only explainer strings changed; no numeric value, range or formula changed. `scripts/audit-model.ts` runs clean with one low finding (spread, 32377x, summary states it).

- dc_youth_per_year: D.C. Code §§16-2399.01 to 16-2399.09 (Subchapter VI, Vulnerable Youth Guardian, added by D.C. Law 25-188, effective 19 July 2024; code.dccouncil.gov). Correct.
- dc_relief_gain: "no guardianship for noncitizens over 18 before the act" is consistent with the act creating the new subchapter for ages 18 to 20. Wording matches the +30 pp judgment and its range. Correct.
- jop_implementation_adj: "agreement and jurisdiction extended (to May 2027)" is a reworded claim; consistent with the July 2026 contempt order extension recorded in the round-2 source check. Number (70%) unchanged. Accepted.
- jop_class_members: "USCIS publishes no count of such filings (a judgment)" is honest labelling; 8,000 unchanged.

Remaining findings:
- [MEDIUM, accepted in round 2, non-blocking] adv_other_wins_ratio has no fed_ branch.
- [LOW] spread of ranges (32377x), disclosed in the summary.

**Verdict: PASS (no high findings; no number changed)**

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against e247896f.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 5724c36c.
