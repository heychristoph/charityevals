# Rule change spending-weights-fallback (18 Nov 2026)

A charity with no spending on record weighs the median of the others in the same weighted average (wavg), not its cause's median. Applied by `scripts/_spending-weights-fallback.py`; files changed: 6. 1 models moved; 0 receipts re-stamped (headline within 1%), 1 to verify, 0 other models moved more than 2×.

Rules 0.2.2 → 0.3.0 (major); 173 receipts moved to 0.3.0, the 1 to verify stay on theirs until verified.

## Verification list

- [ ] **ambitious-impact-charityevals**: rule spending-weights-fallback moved the headline 2.761 → 8.213 (+2.0e+2%); rows changed: value_destinations, moved_dollar_value, shifted_dollar_value, informed_money_value +8. Scoped verification (sonnet): the move is the rule's, applied as it says, and nothing else in the model changed; then a passing round on the current Model-sha.

## Before and after

| model | before | after | move | rows changed | receipt |
|---|---|---|---|---|---|
| ambitious-impact-charityevals | 2.761 | 8.213 | +2.0e+2% | value_destinations, moved_dollar_value, shifted_dollar_value, informed_money_value +8 | verify |
