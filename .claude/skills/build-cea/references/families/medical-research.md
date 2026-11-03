# medical-research (DALYs → daly; past_average)

Research funded or done by disease charities and research institutes, plus the guideline and policy
advocacy many of them run. Patient-support services (helplines, nurses, grants to patients) are a
unit-cost programme of their own: a `domestic-services` model (or `direct-health` with illness in
DALYs), weighted by spending, so the next-dollar slider, which applies to research's past average,
doesn't touch them.

## The chain

```
research    disease_dalys_per_year × share_burden_addressable × p_success
            × pv(years_brought_forward) × (1 + $discount_rate)^−years_until_effect   = research_dalys
advocacy    adv_people_affected_per_year × adv_dalys_per_person_year × adv_p_success
            × pv($win_years_counted) × wait                                          = advocacy_dalys
(research_dalys + advocacy_dalys) × total_adj, where attribution_share_shared is the charity's share
of the field's funding; ÷ cost_total; × $marginal_vs_past_average
```

The burden is in DALYs already (GBD), deaths included, so the uov and WELLBY bridges stay at 0 unless
a branch measures wellbeing or income (then they carry it, never a rate typed in).

## Shared figures it reads

- `$discount_rate` on the wait and on every year brought forward; `$win_years_counted` for a won
  policy (normalization.md 2.9); `$marginal_vs_past_average` (2.10: a year's grants against what
  past grants achieved is a past average).
- `@staff_pay.share_research_policy` / `gap_research_policy`.

## The reference class (research returns)

Anchor `p_success`, `years_brought_forward` and `years_until_effect` on published returns-to-research
studies and say which:

- UK cardiovascular and mental-health research, 1975–1992 (Health Economics Research Group, Office of
  Health Economics and RAND Europe, *Medical Research: What's it worth?*, 2008): a health-gain return of
  about 9–10% a year, with about 17 years from funding to health benefit.
- UK cancer research (Glover et al., *BMC Medicine* 2014): about 10% a year, a lag of about 15 years.
- The translation lag (Morris, Wooding and Grant, *J R Soc Med* 2011): around 17 years from research to
  practice, shorter for screening and guideline work than for new drugs.
- Phase success rates for drug development (Wong, Siah and Lo, *Biostatistics* 2019) for `p_success`
  where the work is a drug pipeline.

Check the template's chain against these: the result per dollar implied by a 10% return over a 15-year
lag is a sanity bound, not an input.

## Evidence to look for

- **Burden**: GBD Results tool, DALYs for the cause (and subtype or age where the work is narrower),
  in the places the results would reach (the world for a drug; the country for a screening policy).
- **The portfolio**: what the year's grants fund (basic, translational, trials, implementation), from
  the charity's research strategy and grant database; `share_burden_addressable` and `p_success`
  differ a lot between basic science and late-stage trials, so split branches by stage where the
  charity's spending allows (Convention 4).
- **Share of the field**: the charity's research spending ÷ all funders' spending on the disease
  (national funders' databases, the UK Health Research Classification System, NIH RePORTER, the
  charity sector's own totals) as `attribution_share_shared`.
- **Advocacy**: the policy pressed or won, its population, and the evidence for its health effect.

## Pitfalls

- **Counting the whole field's success** as the charity's: the attribution share is what keeps the
  result to its share of the funding, so it can't be 1 for a charity that funds a small part.
- **Years brought forward and counterfactual are one question** (Convention 5): years_brought_forward
  already says what would have happened without the field's funding; don't add a counterfactual for
  "others would have found it".
- **Wide ranges are right here**: say in the summary that the result is dominated by judgment.
- A charity's own count of "breakthroughs" or papers is reach, not outcome: the chain goes through
  practice changing.
