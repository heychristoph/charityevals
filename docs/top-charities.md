# The 50 charities people look for most, and what it takes to model them

What people search for, from DataForSEO (Google, United States and United Kingdom, monthly averages
over the 12 months to September 2026, pulled 2026-11-03), so the site covers the charities donors
actually ask about. Data: `inventory/charity-interest-2026-11.json`.

**How the list is ranked.** By searches that show intent to give ("donate to …", "… donation"), with
the brand's own searches as the tiebreak (weighted 1:20). Brand searches alone mislead: Goodwill (stores),
Khan Academy (students), the YMCA (gyms) and Blue Cross (insurance) top them for reasons that have
nothing to do with giving, so they were left out. Aliases are merged (American, British and "red cross";
WWF and World Wildlife Fund; MSF and Doctors Without Borders). For some charities the brand count
includes other reasons to search (adoption, shops, hospitals, news), which only affects the tiebreak.
Limits: two countries, English only; 89 well-known charities were checked, so a big charity missing
from that list is missing here; DataForSEO had no UK figures for Cancer Research UK or Macmillan,
which would likely make the top 50.

## The list

| # | Charity | US + UK brand searches/month | "donate to …" searches/month | Main work | Template family |
|---|---|---|---|---|---|
| 1 | Salvation Army | 897,000 | 108,860 | shelters, food, addiction, thrift-funded social services (US/UK) | NEW domestic-services |
| 2 | Habitat for Humanity | 550,000 | 22,900 | affordable housing builds and repairs | NEW domestic-services (housing) |
| 3 | Red Cross (American/British/IFRC) | 457,300 | 23,030 | disaster relief, blood supply, first aid | NEW humanitarian-relief; blood → direct-health (high-income) |
| 4 | St. Jude Children's Research Hospital | 135,000 | 25,100 | children's cancer treatment and research | NEW medical-care-high-income + medical-research |
| 5 | Humane Society of the US | 550,000 | 1,300 | farm-animal and wildlife campaigns, pet shelters | corporate-campaign / policy + NEW companion-animals |
| 6 | The Nature Conservancy | 67,600 | 13,200 | land and water conservation | NEW conservation (+ climate skeleton) |
| 7 | Doctors Without Borders (MSF) | 77,000 | 12,180 | emergency medical care in crises | direct-health + NEW humanitarian-relief |
| 8 | United Way | 74,000 | 9,900 | local fundraising passed to community charities | policy-research-meta (money moved) → domestic-services destinations |
| 9 | British Heart Foundation | 247,600 | 720 | heart research, shops, awareness | NEW medical-research |
| 10 | American Heart Association | 165,000 | 4,400 | heart research, guidelines, CPR training, advocacy | NEW medical-research + policy |
| 11 | Feeding America | 49,500 | 9,900 | food bank network (US) | NEW domestic-services (food) |
| 12 | Dogs Trust | 201,000 | 90 | dog rehoming and welfare (UK) | NEW companion-animals |
| 13 | Boys & Girls Clubs | 201,000 | 0 | after-school youth clubs (US) | NEW domestic-services (youth) |
| 14 | WWF | 112,200 | 4,350 | conservation, climate and policy | NEW conservation + climate skeleton |
| 15 | ASPCA | 135,000 | 3,120 | animal shelters, cruelty enforcement, adoption | NEW companion-animals |
| 16 | American Cancer Society | 60,500 | 6,600 | cancer research, patient support, screening advocacy | NEW medical-research + policy |
| 17 | Make-A-Wish | 76,600 | 5,400 | wishes for seriously ill children | wellbeing (high-income) |
| 18 | RSPCA | 171,600 | 140 | animal rescue, inspection, prosecution (UK) | NEW companion-animals |
| 19 | Oxfam | 147,100 | 1,070 | humanitarian relief, development, advocacy | NEW humanitarian-relief + cash-income + policy |
| 20 | Catholic Charities | 135,000 | 880 | local social services network (US) | NEW domestic-services |
| 21 | Samaritan's Purse | 74,000 | 3,600 | disaster relief, gift boxes, medical missions | NEW humanitarian-relief |
| 22 | UNICEF | 82,700 | 2,570 | child health, nutrition, vaccines, emergencies | direct-health + NEW humanitarian-relief |
| 23 | The Trevor Project | 60,200 | 3,600 | crisis line for LGBTQ young people | wellbeing (suicide prevention) |
| 24 | Toys for Tots | 110,000 | 880 | toy distribution at Christmas (US) | NEW domestic-services |
| 25 | ACLU | 110,000 | 590 | civil-liberties litigation and advocacy | NEW rights-advocacy (no unit yet) |
| 26 | Disabled American Veterans | 33,100 | 4,400 | benefits claims help, transport for veterans | NEW domestic-services |
| 27 | World Central Kitchen | 27,100 | 4,400 | meals in disasters and conflicts | NEW humanitarian-relief (food) |
| 28 | Barnardo's | 110,000 | 0 | children's services, fostering (UK) | NEW domestic-services |
| 29 | Battersea Dogs & Cats Home | 110,000 | 0 | rehoming dogs and cats (UK) | NEW companion-animals |
| 30 | Meals on Wheels | 90,500 | 590 | meals delivered to older people (US/UK) | NEW domestic-services (food) / wellbeing |
| 31 | Wounded Warrior Project | 49,500 | 2,400 | programmes for injured veterans | NEW domestic-services / wellbeing |
| 32 | Cats Protection | 90,500 | 70 | cat rehoming and neutering (UK) | NEW companion-animals |
| 33 | Alzheimer's Association | 90,500 | 0 | dementia research, care support, advocacy | NEW medical-research + wellbeing |
| 34 | PDSA | 90,500 | 0 | free vet care for pets of low-income owners (UK) | NEW companion-animals |
| 35 | Heifer International | 14,800 | 3,600 | livestock and farming livelihoods | cash-income |
| 36 | PETA | 74,000 | 390 | animal-rights campaigns | corporate-campaign / diet-change / policy |
| 37 | Age UK | 74,000 | 390 | services and advice for older people (UK) | NEW domestic-services / wellbeing |
| 38 | Samaritans (UK) | 74,000 | 70 | emotional-support phone line | wellbeing (suicide prevention) |
| 39 | Amnesty International | 41,900 | 1,300 | human-rights research and campaigns | NEW rights-advocacy (no unit yet) |
| 40 | Special Olympics | 49,500 | 880 | sport for people with intellectual disabilities | wellbeing (high-income) |
| 41 | City of Hope | 60,500 | 320 | cancer hospital and research (US) | NEW medical-care-high-income + medical-research |
| 42 | Big Brothers Big Sisters | 40,500 | 1,300 | youth mentoring (US) | NEW domestic-services (youth) / income |
| 43 | International Rescue Committee | 24,100 | 1,900 | refugee and crisis services | NEW humanitarian-relief + direct-health (on the site already) |
| 44 | Marie Curie | 60,500 | 0 | end-of-life nursing and hospices (UK) | wellbeing / NEW medical-care-high-income |
| 45 | RSPB | 60,500 | 0 | bird and habitat conservation (UK) | NEW conservation |
| 46 | World Vision | 36,000 | 1,000 | child sponsorship, relief, development | cash-income / direct-health + NEW humanitarian-relief |
| 47 | Compassion International | 49,500 | 260 | child sponsorship through churches | cash-income (sponsorship RCT evidence) |
| 48 | March of Dimes | 22,200 | 1,600 | maternal and infant health research and advocacy | NEW medical-research + policy |
| 49 | Oceana | 49,500 | 210 | ocean policy campaigns (fishing limits) | policy (fish: SADs) + NEW conservation |
| 50 | World Food Programme | 12,300 | 1,900 | food aid in emergencies (on the site already) | NEW humanitarian-relief (food) / direct-health |

Already on the site: Humane Society of the US, International Rescue Committee and World Food
Programme (evaluator models), so 47 of the 50 have no model yet.

## What it takes

The current templates were built for charities evaluators already model: global health, cash, therapy,
farm animals, policy. Counting each charity's main kinds of work, the top 50 need:

| Template family | Top-50 charities with work of this kind | Exists? |
|---|---|---|
| Domestic social services (food banks, housing, youth, veterans, older people in rich countries) | 12 | new |
| Humanitarian relief (disasters, conflicts, refugees, emergency food) | 9 | new |
| Wellbeing (crisis lines, wishes, hospices, sport) | 9 | yes, needs high-income values |
| Policy and advocacy with a measurable win | 7 | yes |
| Companion animals (shelters, rehoming, vet care) | 7 | new |
| Medical research and disease charities | 7 | new |
| Direct health | 5 | yes |
| Cash and livelihoods (livestock, child sponsorship) | 4 | yes |
| Conservation (land, oceans, species) | 4 | new, and no unit on the site |
| Hospital care in rich countries | 3 | new (direct health with high-income costs) |
| Rights advocacy (civil liberties, human rights) | 2 | new, and no unit on the site |

## The scaffolding, in order

1. **Partial coverage on the site.** Most of these charities run several kinds of work. Each modelled
   charity gets a coverage share: the share of programme spending its models cover. The rankings need a
   rule for a charity whose models cover only part of its spending (decision below).
2. **Domestic social services** (12 charities): a variant of the wellbeing and cash-income templates for
   rich countries. Outcomes in WELLBYs (food insecurity, housing, mentoring, loneliness) or income, with
   shared facts for US and UK consumption, household size and cost per person. The site's one log-income
   scale already says a dollar does far less for a US household than for a Kenyan one.
3. **Humanitarian relief** (9): deaths averted in crises (crisis mortality against baseline, the
   share a response averts), plus food, water and shelter delivered, with the counterfactual of other
   responders. Blood supply (Red Cross) goes through direct health.
4. **Medical research** (7): a research template. The disease burden comes from GBD, then the chance the
   funded work matters, the years it brings a result forward, and the charity's share of the field's
   funding. It is speculative, so the ranges are wide, and it needs a published reference class (research
   returns estimates).
5. **Companion animals** (7): the animal templates with dogs and cats. This needs species weights for
   dogs and cats, which the site's shared welfare ranges don't cover yet (decision below).
6. **High-income values** for wellbeing and hospital care: costs, baselines and suicide rates for the US
   and UK as shared facts.
7. **Conservation and rights** (6): no measure on the site converts species saved or rights won into
   years of healthy life (decision below).

Each new family gets what the existing ones have: a skeleton in `scripts/gen-templates.py` that passes
every invariant and the lint, a section in `references/templates.md`, and a blind test charity with an
evaluator model, where one exists, before it is used on the list.

## Decisions needed

- **Partial coverage:** rank a charity on what is modelled with its coverage shown, or rank only above a
  coverage share (say half of programme spending) and list the rest as "not yet comparable".
- **Conservation and rights:** leave them unranked ("no comparable measure"), count only what converts
  (climate in tCO2e, health effects), or add a value-judgement slider that prices them in healthy years.
- **Dogs and cats:** take species weights from a published source (Rethink Priorities' method extended,
  or a judgement with a wide range), or leave companion-animal work unranked for now.
