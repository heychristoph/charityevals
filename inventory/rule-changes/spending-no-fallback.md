# Rule change spending-no-fallback (18 Nov 2026)

Spending is recorded, never guessed: #spending needs a figure from accounts or the evaluator's model; wavg has no fill; Clear Solutions and ACTRA, with neither, leave the weighted average. Applied by `scripts/_spending-no-fallback.py`; files changed: 7. 1 models moved; 0 receipts re-stamped (headline within 1%), 1 to verify, 0 other models moved more than 2×.

Rules 0.3.0 → 0.3.1 (minor); 173 receipts moved to 0.3.1, the 1 to verify stay on theirs until verified.

## Verification list

- [ ] **ambitious-impact-charityevals**: rule spending-no-fallback moved the headline 6.203 → 6.489 (+4.6%); rows changed: value_destinations, moved_dollar_value, shifted_dollar_value, informed_money_value +8. Scoped verification (sonnet): the move is the rule's, applied as it says, and nothing else in the model changed; then a passing round on the current Model-sha.

## Before and after

| model | before | after | move | rows changed | receipt |
|---|---|---|---|---|---|
| ambitious-impact-charityevals | 6.203 | 6.489 | +4.6% | value_destinations, moved_dollar_value, shifted_dollar_value, informed_money_value +8 | verify |
