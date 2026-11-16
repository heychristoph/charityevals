# cash-income: a measured-gain path for graduation and livelihood programmes

**What.** Add to templates/cash-income.json (and templates.md "cash-income") an alternative effect block for
programmes whose own trials measure consumption directly, instead of the lump-sum transfer chain:

- `gain_ratio` (trial gain ÷ control mean; several trials blended by precision with `<trial>_ratio_se` rows built
  from fixed point rows, never from the ranged estimate itself, or the draw moves its own weight);
- `y1_share`, `measured_years`, `fade_rate`, `tail_years` and
  `ln_gain_per_person = ln(1+gain_ratio) × (y1_share + pv_annuity_due(1,r,measured_years)/(1+r) + (1−fade)/(1+r)^(1+measured_years) × pv_annuity_due(1,(1+r)/(1−fade)−1,tail_years))`;
- the optional `gift_to_grant_years`, `delay_years`, `wait_discount` rows the direct-health template has.

**Why.** Today the skeleton only has the lump-sum chain; the recurring-gain recipe is one sentence in an
explainer, so each graduation build invents its own time profile and some leave out the wait before
delivery (pilot build, 2026-11-16: the persistence profile alone moved the result ×1.4).

**Diff.** templates/cash-income.json: add the rows above after `baseline_consumption`, marked
"TEMPLATE: measured-gain path; delete the transfer-chain rows when used"; templates.md cash-income: one bullet
pointing to them; src/engine/templates.ts: no change (canonical rows unchanged).

Applied 2026-11-16, commit 05d4e2a0 (the wait rows on the path for every cash model, not optional; the measured-gain final row is measured_ln_gain_per_person, wired into ln_gain_per_person when used; templates.ts reads $discount_rate in wait_discount and measured_ln_gain_per_person).
