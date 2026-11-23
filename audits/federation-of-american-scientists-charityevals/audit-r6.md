# Audit: federation-of-american-scientists-charityevals, round 6 (scoped verification)
Result: 0.4320 years of healthy life per $1,000 (was 0.4405 on origin/main, -1.9%). Combined range not re-run (scoped round). Verdict: pass.
Model-sha: 84dfedd1af1ab9c99ef0a40db88acae857f1d72fd10434cc0be7be9c73c6af6c
Rules: 0.3.13
Scope: rules never-started-weight, lives-added, never-started-prose and never-started-branches only (inventory/rule-changes/). No source or scope re-audit.
Preflight: passes
Previous round: r5 passed (no findings), on the model before rule never-started-branches; its figures (0.43196, shares 93/4/2) are now superseded and re-checked here.

## Checks
- Diff vs origin/main: only never_started marks on the five *_future_dalys rows, reworded future_dalys explainer, descendants:false on value_per_death and covid_value_per_death, the future_animal_harm row, the dalys_direct formula, and changed sentences/figures in the summary. Nothing else.
- verify.mts: "lives_added off, never_started_weight 1" = 0.4404556 = "origin/main, defaults" (identical). Headline now 0.4320031 = scripts/headlines.ts (0.432003) = "after" 0.432 in never-started-branches.md. w_ai, w_bio, w_nuclear hold no future (main minus the future's DALYs differs by under 0.01% each, survivors' descendants); pol and fb are 0.
- Preflight passes.

## Prose
Summary and write-up: "counted only where you count lives that never start (0% by default)" is true (dalys_direct = -1.6 DALYs at the defaults). Shares of the result after adjustments recomputed: nuclear 90.8%, AI 7.1%, pandemic 1.8%, science policy under 1% (text 91/7/2/under 1). Nuclear cut at a tenth and ten times (catastrophe cut) gives 0.109 to 3.66 (text 0.11 to 3.7). No typed Long-run value, discount-rate or one-year figure appears.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | none | - | - | - |

Re-stamped (23 Nov 2026), rule input-domains: Every input states its kind of number (domain); the simulation draws each by its kind, so no draw is a number it can't be (normalization 2.18, INV-27). Mechanical: headline unchanged, against the tree before the rule.
