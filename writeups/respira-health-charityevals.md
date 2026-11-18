### Summary

Respira Health runs pulmonary rehabilitation, breathing exercises and education for people with chronic lung disease, over WhatsApp in India. Our model counts its first year, April 2025 to March 2026, against what it spent, and comes to **{{result}} years of healthy life per 1,000 dollars**. That year went mostly on setting up: the pilot enrolled {{row:people_reached}} people. The charity hopes to enrol about 1,000 in its second year, which would lower the cost per person a lot, but that hasn't happened yet.

### What the charity does

Respira Health was incubated by Ambitious Impact in 2025 and is a fiscally sponsored project of Anti Entropy. Its programme lasts eight weeks: a WhatsApp chatbot sends 24 guided exercise sessions and 24 short education videos, in English and Hindi. Physiotherapists screen each applicant by video call, assess them at the start and end, and follow up when they stop.

In its first year it interviewed patients and doctors in India, tested a short course on breathlessness with over 140 sign-ups, and ran a pilot from January to April 2026. The pilot recruited {{row:people_reached}} people through Facebook and Instagram adverts, mean age 63. They had COPD, another chronic lung disease, or breathlessness without a diagnosis, mostly with mild to moderate symptoms (a baseline CAAT score of 16).

### How the impact happens

Pulmonary rehabilitation is exercise training with education. In trials it makes breathing easier, lets people walk further and improves quality of life. After a hospital stay for a COPD flare-up it also cuts readmissions, and perhaps deaths. Few people in India can reach a rehabilitation centre; a phone programme could reach many more.

### How the model works

- **Cost:** Respira Health publishes no accounts, so we estimate the year's spending at {{row:program_spend}}. That is based on the $110,000 seed grant (about half its first-year budget), the $66,000 more it raised by November 2025, and the $23,000 it then said would finish the pilot.
- **People:** the {{row:people_reached}} people enrolled in the pilot.
- **Gain in health:** in a UK study of 324 people, a full eight-week programme raised quality of life by {{row:rh_utility_gain}} on a 0-to-1 scale. We count {{row:rh_before_after_adj}} of that as rehabilitation's own (the study had no control group, but randomised trials broadly confirm it), {{row:rh_milder_adj}} of it for milder participants, and take the gain to last {{row:years_of_coverage}} of a year.
- **Deaths:** about {{row:baseline_mortality_rate}} of the participants would die each year. Trials after a COPD flare-up found about a third fewer deaths, but no trial shows a fall in milder, stable disease, so we take a small one: {{row:mortality_reduction}}.
- **Adjustments:**
  - participants did {{row:rh_sessions_done}} of the {{row:rh_sessions_planned}} exercise sessions on average, so they get {{row:implementation_adj}} of a full programme's gain, as gains grew with sessions done in the pilot;
  - {{row:external_validity_adj}} carries over from supervised programmes to a chatbot;
  - {{row:counterfactual_adj}} wouldn't have had rehabilitation otherwise.
- **Missing data:** the missing-data discount applies, because the pilot had no control group.

### What drives the result

The result is low mainly because of the cost per participant in a setting-up year: about {{row:cost_per_person}}. The inputs that move it most are the missing-data discount, the fall in deaths, the baseline death rate, how long the gain lasts and how well the trials carry over to a chatbot.

### Biggest uncertainties

- **Scale:** the cost is mostly setting up. If the second year enrols 1,000 people at a similar budget, the cost per person falls about twentyfold. That year's count and accounts aren't published yet.
- **Effect:** the pilot's symptom score improved by 4.4 points, beyond the 2 points patients notice, and sit-to-stand repetitions rose. But only half the participants gave end-of-programme data, and their general quality-of-life scores didn't move.
- **Who it reaches:** the cost-effectiveness case rests on people just out of hospital. The pilot reached milder patients through adverts.

### What isn't modelled

The second year's work and the people still in the programme in May 2026 aren't counted. Hospital stays averted and the 2025 breathlessness course are counted only as a small share.

### How this model was checked

Audit rounds are listed in audits/respira-health-charityevals/. Round 1 found two high issues, both fixed: the fall in deaths is now marked as our judgment, and the corrections for the before-after design and milder participants apply only to the quality-of-life gain, not to deaths, which rest on randomised trials. That took the result from 0.0029 to {{result}}. Round 2 passed.

### Sources

- Respira Health, digital pulmonary rehabilitation pilot report (January to April 2026): https://docs.google.com/document/d/1jsiCHHch_H3ikQjh7pMB15aHNl5Ss9T5/
- Munns and Lund (Respira Health), Piloting a digital treatment for COPD (November 2025): https://forum.effectivealtruism.org/posts/D59GPfsNWHDayPe2c/piloting-a-digital-treatment-for-copd-the-second-biggest
- Respira Health, website: https://www.respirahealth.org
- Nolan et al. (2016), The EQ-5D-5L health status questionnaire in COPD, Thorax: https://pmc.ncbi.nlm.nih.gov/articles/PMC4893131/
- McCarthy et al. (2015), Pulmonary rehabilitation for COPD, Cochrane review: https://pmc.ncbi.nlm.nih.gov/articles/PMC10008021/
- Puhan et al. (2016), Pulmonary rehabilitation following exacerbations of COPD, Cochrane review: https://pmc.ncbi.nlm.nih.gov/articles/PMC6463852/
- Cox et al. (2021), Telerehabilitation for chronic respiratory disease, Cochrane review: https://pmc.ncbi.nlm.nih.gov/articles/PMC8095032/
- Two-year mortality in survivors of acute exacerbations of COPD: a North Indian study (2017), Lung India: https://pmc.ncbi.nlm.nih.gov/articles/PMC5684807/
- Estimation of the health economic benefit of widening pulmonary rehabilitation uptake and completion (2024), COPD: https://pmc.ncbi.nlm.nih.gov/articles/PMC11626660/
- WHO Global Health Observatory, life tables, India 2019: https://ghoapi.azureedge.net/api/LIFE_0000000030
