# Audit: usa-for-unhcr-charityevals, round 6 (verification)
Result: 5.986e-5 daly/$ = 0.0599 years of healthy life per 1,000 dollars (combined range 0.0135-0.2662). Verdict: pass.
Scope: only the change since round 5: rows ln_gain_per_person and sol_return_ln_gain now apply the site's within-a-year rule with t = years_exposed (judgment 0.25 / 0.5 / 1).
Mechanical: audit-model 0 high or medium (spread and judgment-share warns already carried; info on unranged inputs); check.ts "all models valid"; headline moved 6.033e-5 -> 5.986e-5 daly/$ (-0.8%, as expected).

Findings:
1. [low] The label of value_delivered_per_person still reads "delivered per person in the year"; it is now the amount over years_exposed (0.25-1 year). Fix: reword to "delivered per person over the months covered". Does not change the result.

Checks passed:
- Formula: t * ln(1 + v * price * ppp / (b * t)) with t = years_exposed, identical in form to the humanitarian-relief family rule and to the IRC cash branch (cash_years_covered * ln(1 + cash * price * ppp / (baseline * cash_years_covered))); unit-consistent (v in 2017 PPP dollars over t, b a yearly consumption, so b*t is the consumption of those months).
- t is right for relief: the same years_exposed already scales the deaths-averted row (crisis excess mortality over the months of the response), so goods and deaths cover one period; the two channels are separate (deaths vs consumption) and the row's explainer notes the deaths are not counted twice. No double use of years_exposed (it is a rate-period, not a multiplier on top of an already-annualised figure).
- Return grants: sol_return_ln_gain reuses the relief share, PPP and baseline, so using the same exposure period is consistent; a one-off return grant is used up over a few months, so t in 0.25-1 is a fair judgment. At t=1 the old formula is recovered exactly; at t<1 the gain is lower, correctly (concavity of log).
- gik goods branches (gik_ln_gain: clothes in the US, goods abroad) left as ln(1 + v/b): deliberate, durable clothes and kits spread over their life; accepted.
- years_exposed is a judgment with a range (0.25-1) feeding the tornado; no other new inputs.

Verdict: pass
Model-sha: 8d3bc7f44e187b78274a3dcfbcf4f72b3d4de2fe9276fa2d6dafd38dd5ff6f8f
