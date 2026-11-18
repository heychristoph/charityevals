### Summary

Besides its programmes, Save the Children UK spends about 13.5 million pounds a year on advocacy and awareness, and its subsidiary Elrha spends about 11 million pounds funding research and innovation for humanitarian crises. We estimate **{{result}} years of healthy life per $1,000** for this work, about a tenth of Save the Children UK's charitable spending in 2025. None of it publishes a measured result, so each branch is built from what the campaigns won or what Elrha funds, with wide ranges, and counted at half by the site's shared missing-data slider. Save the Children's programmes are in its main model, [here](/save-the-children/save-the-children-charityevals).

### How the model works

**The Gavi pledges** (about seven tenths of the result). More than $9 billion was pledged to Gavi's 2026-2030 strategy in 2025, short of the $12 billion target; Save the Children UK says it mobilised more than 200 civil-society organisations for it. We take 85% of the pledges as paid, value a Gavi dollar at the site's shared figure (GiveWell's), less the other aid a larger pledge displaces (60% of it, at the site's shared value of a dollar of donors' aid, about cash), and credit civil society's campaign with 3% of the pledges, of which Save the Children UK has 15% of the resources. The campaign ran about two years.

**Elrha** (under a tenth). Its 2025 spending funds about 28 research and innovation projects a year (our judgment of $400,000 a project). Each has a 10% chance of changing what responders do, improving about $20 million a year of humanitarian spending by 10%, a humanitarian dollar valued at the site's shared figure, 0.2 of cash (what its relief models do per dollar), for the years a won change counts, after a three-year wait.

**Nutrition for Growth** (about a fifth). The March 2025 summit's $27 billion of commitments, half of them spent, valued at the site's shared figure for a dollar of government spending, less the aid displaced; the campaign added 1% and Save the Children UK has 15% of the credit.

**The two-child limit** (under a tenth). The UK government removes the two-child limit on Universal Credit from April 2026, costing £2.4 billion in its first year, about £5,000 a year for each of the 470,000 households affected. The gain is valued on the log-income scale at these families' consumption ({{row:tcl_consumption_share}} of the UK average per person), less the loss to those who pay for it (a side effect), for the years a won reform counts. Campaigners caused 30% of the decision, Save the Children UK has 12% of the coalition's resources, and the campaign ran about four years.

The three wins get 30% more for the year's other campaigns (aid cuts, debt, child marriage, school safety, children in the COP30 text). Because they are past wins set against past spending, the next dollar counts at Save the Children's own share of the average ({{row:marginal_vs_past_average}}, from its accounts: money is short after the aid cuts, but the campaigns credited here are won).

### What drives the result

The missing-data slider, the value of a healthy year in units of value, and the two judgments on the Gavi pledges (how much the campaign added and Save the Children's share of it), then the next dollar's share of the average and how much humanitarian spending a changed study improves. The result is mostly uncertainty: the plausible range runs from {{low}} to {{high}}.

### What isn't modelled

Awareness work for the public is counted as cost with no result of its own beyond the campaigns it supports. The Humanitarian Leadership Academy's training is in the programmes model's emergencies branch.

### How this model was checked

Built with charityevals' policy-research-meta template on 13 November 2026; the mechanical audit passes. Round 1 of the independent audit passed with four medium findings: Elrha's humanitarian dollar now counts at 0.3 of cash, not 1 (anchored on charityevals' relief models), and the Gavi counterfactual and the other campaigns' share are anchored in their explainers. The share of advocacy spending in earlier years stays a ranged judgment, as their accounts weren't read. The result fell from 0.49 to 0.43. Round 2 checked the changes and passed, keeping the earlier years' spending as its one medium finding. November 2026: the displaced aid and Elrha's humanitarian dollar take the site's shared figures for aid (about 1× and 0.2× cash, from 1× and 0.3×), as in every model that values aid won or kept; the result is 0.42, with a verification round.

### Sources

- [Save the Children UK, Annual Report and Financial Statements 2025](https://i.stci.uk/dam/annual-report-2025-tsp-ch11594965.pdf/fr56uvecp24bdm232q2y3e478dl8a82e.pdf)
- [HM Treasury, Budget 2025](https://www.gov.uk/government/publications/budget-2025-document/budget-2025-html)
- [DWP, Removing the two-child limit on Universal Credit: impact on low income poverty levels](https://dera.ioe.ac.uk/id/eprint/41762/1/Removing%20the%20two-child%20limit%20on%20UC%20Impact%20on%20low%20income%20poverty%20levels%20in%20the%20United%20Kingdom%20-%20GOV.UK.pdf)
- [Save the Children UK on DWP's two-child limit statistics, April 2025](https://www.savethechildren.org.uk/news/media-centre/press-releases/2025/statement-new-figures-show-40000-more-children-affected-two)
