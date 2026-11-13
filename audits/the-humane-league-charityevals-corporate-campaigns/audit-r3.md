# Audit round 3 (verification of round-2 fixes), THL charityevals models

Checks run: audit-model.ts on the three models (0 findings each, defaults unchanged: other-programmes 3.964 SADs/$, grants 3.443, corporate-campaigns 2.883 with implementation_adj 1.0 as before), vitest lint.test.ts 48/48 pass. generated/ not modified by my runs (diffed against a copy).

- L1 settled: "11% (US) to 15% (global)" matches thl_acc_share's explainer and ACE's figures; new_attribution_share 0.8 best consistent with 0.85 text. No problem.
- L2 settled: program_spend explainer now names running the Open Wing Alliance, matching the model name and owa_coordination_cost.
- L3 settled: owa_resources identical in both models (members' term x pay factor + coordination cost x same factor); owa_attribution_share numerator uses the same factor, so the share is coordination-with-pay over the same pool and stays <= 1 with $resource_shares on or off. Defaults unchanged. No problem.
- L4 settled: owa_coordination_cost explainer is byte-identical in both models (values identical). Note: it sits in section "cost" in other-programmes and "adjustments" in grants; harmless but inconsistent (low, see below).
- L5 settled: ace_cost_block1/2 labels Global/US match the corporate-campaigns model's ace_cost_global/ace_cost_us and the cells (B28 global, B53 US).
- L6 settled: lint exception is gated on family === "corporate-campaign" and formula exactly "1"; a model in another family, or a corporate-campaign one with any other implementation_adj, still must read the fulfilment rate. Tests pass.
- L7 accepted as left (writeup states it). L8 scratch file gone; git status shows no stray files.
- Write-up round-2 entry is accurate against the changes.

## Findings
1. low: owa_coordination_cost is in section "cost" (other-programmes) vs "adjustments" (grants) with otherwise identical content. Fix: put both in the same section (adjustments, since it feeds owa_resources) unless the cost section is meant to list it.
2. low: the write-up's round-2 bullets don't mention L6 (lint exception) or L5 (ACE block labels); optional, no model effect.

Counts: high 0, medium 0, low 2.
