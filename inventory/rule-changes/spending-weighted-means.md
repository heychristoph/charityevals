# Rule change spending-weighted-means (18 Nov 2026)

Ambitious Impact's average of its charities weighs each by programme spending (#spending:<charity>); #cause:x stays equal-weight, and 2.8 says why. Applied by `scripts/_spending-weighted-means.py`; files changed: 6. 1 models moved; 0 receipts re-stamped (headline within 1%), 1 to verify, 0 other models moved more than 2×.

Rules 0.2.1 → 0.2.2 (minor); 173 receipts moved to 0.2.2, the 1 to verify stay on theirs until verified.

## Verification list

- [ ] **ambitious-impact-charityevals**: rule spending-weighted-means moved the headline 3.994 → 2.761 (−31%); rows changed: value_destinations, moved_dollar_value, shifted_dollar_value, informed_money_value +8. Scoped verification (sonnet): the move is the rule's, applied as it says, and nothing else in the model changed; then a passing round on the current Model-sha.

## Before and after

| model | before | after | move | rows changed | receipt |
|---|---|---|---|---|---|
| ambitious-impact-charityevals | 3.994 | 2.761 | −31% | value_destinations, moved_dollar_value, shifted_dollar_value, informed_money_value +8 | verify |
