# Audit round 6 (scoped verification): GiveWell (charityevals)

## Scope
Only the overlap change of docs/normalization.md 2.24: rows `effective_giving_through_givewell`, `effective_giving_direct`, `fundraisers_shared_moved`, `fundraisers_credit_share`, the changed `donors_moved`, the shared fact `@meta.shared_credit_donor_side` (0.5, 0.3 to 0.7), the summary and writeups/givewell-charityevals.md. Headline 36.2 to 35.80 years per $1,000 (`scripts/headlines.ts`: 35.7977).

## Checked
1. Figures: the Metrics Report 2024 (files.givewell.org) was fetched; its text is font-encoded and no PDF text extractor is installed here, so the two table cells (giving groups $3,924,509 through GiveWell, $28,136,642 direct) were not re-read from the page. Confirmed independently by search: funds raised $414,893,748 and $108M from Open Philanthropy (matches `funds_raised`, `funds_raised_open_philanthropy`). The quotes and the note in the two rows (p. 8 "Source of Funds Raised", Internet Archive copy, retrieved today) are consistent with the table structure the model uses. Not blocking; a reader with a PDF viewer can confirm in a minute.
2. Meaning: both rows are gifts of effective giving groups that rely on GiveWell's research, split by channel (through GiveWell's funds, direct to charities). `donors_moved_gross` = funds_raised - Open Philanthropy - operations deduction; `funds_raised` explainer says it includes charity-specific gifts and gifts made directly to recommended charities, so both channels sit inside it, and only the Open Philanthropy and operations parts are removed elsewhere (about $307M, far above the $32M deducted). The deduction removes money that is there.
3. Once and before own effect: `donors_moved = (donors_moved_gross - fundraisers_shared_moved * (1 - fundraisers_credit_share)) * donor_own_effect + influenced_funding * survey_response_adj`. The deduction is the fundraisers' share (the fact, 0.5) of their money, inside the bracket multiplied by `donor_own_effect`; `influenced_funding` is untouched; no other row reads `fundraisers_shared_moved`. `fundraisers_credit_share = 1 - @meta.shared_credit_donor_side`, so the fundraiser model and this one add to the whole. `mobiliser_share` is applied only in the value rows, unchanged (`moved_dollar_net_value`, `shifted_dollar_value`, `career_change_value`).
4. `donor_cost_share = cost_total / (cost_total + if($resource_shares, salary_sacrifice, 0))` reads no money moved.
5. Summary and writeup: both use placeholders (`{{row:fundraisers_shared_moved}}`, `{{row:fundraisers_credit_share}}`, `{{row:money_moved}}`), say the credit is shared and name no other charity or median. The writeup's "(30% to 70%)" matches the fact's range. The summary's "plus $45M its research influenced" is an old typed figure, unchanged by this edit.
6. Preflight: only two low "generated ... out of date" lines (distributions, usage); passes.

## Findings
None.

Verdict: pass
Model-sha: 94c0f41c46ba1acf140e2ebd5be96205c161b262e5a1d2bbdcc01f277087389f
Rules: 0.2.2
