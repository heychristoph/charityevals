// Classifies every imported (evaluator's) model by how much of its result is measured for the charity
// (docs/normalization.md 2.12, INV-21) and writes `missing_data: { thin_share, note }` on it; our view
// counts the thin share at $missing_data_discount (src/engine/model.ts missingDataNode). charityevals'
// own models are skipped: their branches' missing_data_adj rows carry the step. Variants inherit.
//   npx tsx scripts/missing-data.ts           write
//   npx tsx scripts/missing-data.ts --check   fail if a file would change
//   npx tsx scripts/missing-data.ts --table   print every model's classification
//
// Measured: the charity's own count of who got the intervention (or its cost per person from its own past
// delivery) and an effect from a controlled evaluation of the charity or from trials of the same
// intervention delivered the same way. Thin: reach or effect a judgment (a projection for work not yet
// delivered, an idea-stage or value-of-information sheet), or the effect from research on other
// delivery. The evaluator's own trial-transfer adjustments (internal and external validity,
// replicability) stay: they answer how well the trials transfer, which our builds ask in evidence_adj.
// A generic haircut of the evaluator's for weak or missing evidence is the same question as ours, so in
// our view it is replaced by this step (SWAPS: the row reads 1, the evaluator's figure in `published`).
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { assumptionValues, buildLibrary, comparable, compute, type ResolvedModel } from "../src/engine/model";

const root = join(import.meta.dirname, "..");
const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));
const walk = (d: string): string[] => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : f.endsWith(".json") ? [p] : [];
});
const check = process.argv.includes("--check");

type Rule = { share: number | ((m: ResolvedModel) => number); note: string };
const M = (note: string): Rule => ({ share: 0, note: `Measured: ${note}` });
const T = (note: string): Rule => ({ share: 1, note: `Thin: ${note}` });
const P = (share: number, note: string): Rule => ({ share, note: `Partly thin (${Math.round(share * 100)}%): ${note}` });

// --- Generic evidence haircuts replaced by the site's step in our view (A', owner 2026-11-04) ------------
const SWAPS: Record<string, { row: string; why: string }[]> = {
  "evidence-action-ifa-supplementation-2022": [{ row: "overall_skeptical_adjustment", why: "GiveWell's 25% discount on the charity's own guess of the coverage it adds, from a prior that charities overestimate their impact" }],
  "evidence-action-iron-folic-acid-supplementation-india": [{ row: "overall_skeptical_adjustment", why: "GiveWell's 25% discount on the charity's own guess of the coverage it adds, from a prior that charities overestimate their impact" }],
  "nutrition-international-rice-fortification-2024": [{ row: "skeptical_adjustment_givewell_s_best_guess", why: "GiveWell's 20% skeptical discount on the coverage the programme projects" }],
  "no-means-no-worldwide-founders-pledge": [{ row: "unevidenced_adjustment", why: "Founders Pledge's halving for the part of NMNW's work that hasn't been evaluated (newer curricula, other countries, the boys' programme)" }],
};

// --- Per-model classifications (non-GiveWell evaluators, and GiveWell exceptions) ---------------------
const ACE = T("ACE's estimate of a campaign or outreach programme: the animals or people its work reached and the welfare change per animal are ACE's judgments (pledges won, meals swapped, welfare footprints), with no controlled evaluation of the charity.");
const AIM = T("an Ambitious Impact idea-stage estimate, made before the charity ran the work: reach and effect are projections from research on other programmes.");
const GG = T("Giving Green's estimate of policy or innovation advocacy: the policy's tonnes and the charity's part in winning it are judgments.");
const BY_ID: Record<string, Rule> = {
  // Founders Pledge
  "the-humane-league-founders-pledge": T("Founders Pledge's estimate of corporate campaigns: the hens under the pledges, their counterfactual and the welfare change are judgments."),
  "clean-air-task-force-founders-pledge": T("policy advocacy: the emissions the rules avert and CATF's part in them are Founders Pledge's judgments."),
  "coalition-for-rainforest-nations-founders-pledge": T("policy advocacy (REDD+): the emissions averted and the charity's part are judgments."),
  "terrapraxis-founders-pledge": T("one event's influence on coal-plant repowering: reach and effect are judgments."),
  "action-for-happiness-founders-pledge": M("the participants of its course are counted, and the effect comes from a randomised trial of the same course (Krekel et al. 2021)."),
  "bandhan-founders-pledge": M("Bandhan counts the households in its graduation programme, and the effect is from a randomised trial of that programme in West Bengal (Banerjee et al.)."),
  "central-square-foundation-founders-pledge": M("the gains come from the programme's own comparison of districts (a controlled, non-randomised evaluation); Founders Pledge's discount for its design stays as its internal-validity step."),
  "clear-solutions-founders-pledge": T("the extra children treated with ORS and zinc are a projection of market and policy work, not a count."),
  "development-media-international-founders-pledge": M("DMI's own randomised trial of the same radio campaigns (Burkina Faso) measured the behaviour change; Founders Pledge's discount on the modelled deaths calibrates to that trial and stays."),
  "educational-initiatives-founders-pledge": P(0.5, "Mindspark's effect is from a randomised trial of the charity's own software, but in after-school centres; in government schools (about half the modelled reach) the delivery differs."),
  "eidu-founders-pledge": T("a young programme: reach is projected and the learning effect is from trials of other digital-learning programmes."),
  "family-empowerment-media-founders-pledge": T("the listeners reached and the contraceptive uptake per listener are judgments built from other media studies."),
  "givedirectly-founders-pledge": M("GiveDirectly counts its recipients, and the effect is from randomised trials of its own transfers."),
  "global-alliance-for-improved-nutrition-founders-pledge": T("salt-iodisation advocacy: the people newly covered and GAIN's part in it are judgments."),
  "iodine-global-network-founders-pledge": T("salt-iodisation advocacy: the people newly covered and the network's part in it are judgments."),
  "imagine-worldwide-founders-pledge": M("the children using the tablets are counted, and the effect is from randomised trials of the same tablet programme in Malawi."),
  "imagine-worldwide-tanzania-founders-pledge": M("the children are counted, and the effect is from randomised trials of the same tablet programme (Malawi); the move to Tanzania is an external-validity question, which Founders Pledge adjusts for."),
  "innovation-in-government-initiative-founders-pledge": T("policy partnerships: the programmes scaled and the initiative's part in them are judgments."),
  "international-rescue-committee-founders-pledge": T("the children treated for acute malnutrition are counted, but no trial measures the treatment against none: the deaths it averts rest on case series of untreated wasting and a judged share averted, as in our own builds."),
  "lead-exposure-elimination-project-founders-pledge": T("lead-paint law advocacy: the children protected and the charity's part in the laws are judgments."),
  "new-incentives-founders-pledge": M("New Incentives counts the infants enrolled, and the effect on vaccination is from a randomised trial of its own programme."),
  "no-means-no-worldwide-founders-pledge": P(0.5, "the course's effect is from randomised trials of NMNW's own course in Kenya, but about half its work (newer curricula, other countries, the boys' programme) hasn't been evaluated; that half replaces Founders Pledge's own halving."),
  "pure-earth-founders-pledge": T("lead-exposure work: the people protected and the reduction are judgments."),
  "raising-the-village-founders-pledge": T("the income gains come from the charity's own monitoring without a randomised comparison."),
  "strongminds-founders-pledge": M("StrongMinds counts the people treated, and the effect is from trials of the same group interpersonal therapy (Bolton et al., Uganda) and its own monitoring."),
  "suvita-founders-pledge": { share: (m) => anc(m), note: "Partly thin: the vaccination reminders count their families and take their effect from a randomised trial of SMS reminders in India; the antenatal-care part rests on an observational study of antenatal visits and infant deaths, so its share of the deaths is thin." },
  "taimaka-founders-pledge": T("the children treated for acute malnutrition are counted, but no trial measures the treatment against none: the deaths it averts rest on case series of untreated wasting and a judged share averted, as in our own builds."),
  "teaching-at-the-right-level-africa-founders-pledge": M("the children are counted, and the effect is from randomised trials of Teaching at the Right Level delivered the same way (India, Zambia)."),
  "the-life-you-can-save-founders-pledge": M("money moved is counted dollars; each destination it reads live brings its own missing-data step."),
  "ubongo-founders-pledge": T("viewers are estimated from audience surveys and the learning effect is from studies of other educational media."),
  "village-enterprise-founders-pledge": M("Village Enterprise counts its businesses, and the effect is from a randomised trial of its own programme (Sedlmayr et al.)."),
  "winning-start-founders-pledge": T("a young programme: reach is projected and the effect is from other programmes' trials."),
  // Happier Lives Institute
  "actra-hli": T("a new programme: reach is projected and the effect is from trials of other delivery."),
  "against-malaria-foundation-hli": M("AMF counts the nets distributed, and the effect is from randomised trials of the same nets."),
  "fortify-health-hli": T("the people eating fortified flour are estimated from mills' output, and the effect is from efficacy trials of fortified food, not of mill-level programmes."),
  "friendship-bench": M("Friendship Bench counts the people treated, and the effect is from randomised trials of its own programme (Chibanda et al. 2016)."),
  "givedirectly-hli": M("GiveDirectly counts its recipients, and the effect is from randomised trials of its own transfers."),
  "icddr-b-hli": M("the families are counted, and the effect is from randomised trials of Reach Up delivered the same way, including icddr,b's own."),
  "pallium-india-hli": T("the patients reached by the expansion are projected and the wellbeing gain is a judgment from other palliative-care studies."),
  "pure-earth-hli-ghana-cosmetics": T("leaded-cosmetics advocacy: the people protected and the reduction are judgments."),
  "pure-earth-hli-ghana-cosmetics-before-correction": T("leaded-cosmetics advocacy: the people protected and the reduction are judgments."),
  "shamiri-institute-hli": M("Shamiri counts the students in its groups, and the effect is from randomised trials of its own intervention."),
  "strongminds": M("StrongMinds counts the people treated, and the effect blends its own trial and monitoring with trials of the same group therapy."),
  "taimaka-hli": T("the children treated for acute malnutrition are counted, but no trial measures the treatment against none: the deaths it averts rest on case series of untreated wasting and a judged share averted, as in our own builds."),
  "world-spine-care-hli": T("the patients reached by the expansion are projected and the effect is from studies of other spine-care programmes."),
  // SoGive
  "breast-cancer-now-sogive": T("research funding: what the research achieves is a judgment from the returns-to-research literature."),
  "motor-neurone-disease-association-sogive-upper-bound": T("research and care: what the spending achieves is a judgment."),
  "versus-arthritis-sogive-upper-bound": T("research funding: what the research achieves is a judgment from the returns-to-research literature."),
  "compassion-uk-sogive": M("the sponsored children are counted, and the effect is from an evaluation of Compassion's own sponsorship programme (Wydick et al. 2013)."),
  "royal-national-lifeboat-institution-sogive": T("launches and rescues are counted, but the lives a rescue saves are a judgment, not measured against what would have happened."),
  "strongminds-sogive-march-2024": M("StrongMinds counts the people treated, and the effect is from trials of the same group therapy and its own trial."),
  "woodland-trust-sogive": T("trees planted are counted, but the carbon each stores is from forestry tables for other woodland, not measured for these trees."),
  "end-fund-deworming-sogive-2022": M("the treatments are counted, and the effect is from randomised trials of school-based deworming (Miguel and Kremer and its follow-ups)."),
  "evidence-action-deworm-the-world-sogive-2022": M("the treatments are counted, and the effect is from randomised trials of school-based deworming."),
  "sightsavers-deworming-sogive-2022": M("the treatments are counted, and the effect is from randomised trials of school-based deworming."),
  "unlimit-health-deworming-sogive-2022": M("the treatments are counted, and the effect is from randomised trials of school-based deworming."),
  // GiveWell exceptions to the rules below
  "alima-primary-healthcare-malnutrition": T("primary health care and malnutrition treatment: the deaths either averts rest on judgment and case series, not on trials against no treatment."),
  "new-incentives-expected-cost-effectiveness-2017-rct": T("a forecast made before the randomised trial of the programme reported: the effect on vaccination was a judgment."),
  "new-incentives-june-2019": T("before the trial of the programme reported (2020), the effect on vaccination was a judgment."),
  "new-incentives-june-2019-endline-updated-ni-early-2018": T("before the trial of the programme reported (2020), the effect on vaccination was a judgment."),
  "new-incentives-ni-early-2018-with-baseline-rates": T("before the trial of the programme reported (2020), the effect on vaccination was a judgment."),
  "givedirectly-pilots-optionality-2025": T("an option-value sheet for pilots not yet run."),
  "givedirectly-v2-6x-botecs-givewell": T("back-of-the-envelope estimates of new programme designs, not yet delivered."),
  "fika-update-to-bridges-to-prosperity": M("the bridges are counted, and the effect is from a quasi-experimental evaluation of the charity's own bridges (Brooks and Donovan, Nicaragua)."),
  "development-media-international-dmi": M("DMI's own randomised trial of the same radio campaigns measured the behaviour change the estimate rests on."),
  "precision-development-agriculture-intervention-report": M("the farmers are counted, and the effect is from randomised trials of the charity's own phone-based advice."),
  "suvita-march-2023": M("the families are counted, and the effect is from a randomised trial of SMS reminders and community ambassadors in India delivered the same way."),
  "ird-global-2023-zm-mcct-in-sindh": M("the children are counted, and the effect on vaccination is from a randomised trial of IRD's own mobile conditional cash transfers in Sindh."),
  "ird-global-mcct-in-high-risk-sindh-districts-2021": M("the children are counted, and the effect on vaccination is from a randomised trial of IRD's own mobile conditional cash transfers in Sindh."),
  "jhpiego-seasonal-malaria-chemoprevention-smc": M("seasonal malaria chemoprevention campaigns count the children reached, and the effect is from randomised trials of the same campaigns."),
};

// --- GiveWell by programme (first match wins) ----------------------------------------------------------
const GIVEWELL: [RegExp, Rule][] = [
  [/voi|value-information|value-of-information|optionality|option-value|threshold|breakeven|skeleton|rough|incubat|-pilot|pilot-|bridge-funding|quick-nls|beta/, T("a value-of-information, threshold or pilot sheet, or a rough estimate of work not yet delivered: reach and effect are projections.")],
  [/^against-malaria-foundation|insecticide-treated-net|llins/, M("the nets distributed are counted, and the effect is from randomised trials of the same nets.")],
  [/^malaria-consortium|seasonal-malaria-chemoprevention|smc/, M("the campaigns count the children reached, and the effect is from randomised trials of the same chemoprevention (and of vitamin A, where co-delivered).")],
  [/^helen-keller|vitamin-a/, M("the campaigns count the children dosed, and the effect is from randomised trials of vitamin A supplementation.")],
  [/^nutrition-international-(2024-chad|chad)/, M("the campaigns count the children dosed, and the effect is from randomised trials of vitamin A supplementation.")],
  [/^new-incentives/, M("New Incentives counts the infants enrolled, and the effect on vaccination is from a randomised trial of its own programme.")],
  [/^givedirectly/, M("GiveDirectly counts its recipients, and the effect is from randomised trials of its own transfers.")],
  [/deworm|^sightsavers/, M("the treatments are counted, and the effect is from randomised trials of school-based deworming.")],
  [/malnutrition|^alima-mirriah/, T("the children treated for acute malnutrition are counted, but no trial measures the treatment against none: the deaths it averts rest on case series of untreated wasting and a judged share averted, as in our own builds.")],
  [/^evidence-action-(dispensers|in-line-chlorination|water-quality)/, M("the dispensers and chlorinators are counted with their monitored use, and the effect is from randomised trials of water chlorination.")],
];
const GIVEWELL_DEFAULT = T("a grant estimate for a new, scaled-up or partner-delivered programme: its reach is a projection, or its effect comes from research on other delivery (market or policy work, technical assistance to governments, new organisations).");

function anc(m: ResolvedModel): number {
  const v = compute(lib, m, assumptionValues(lib.assumptions));
  return v.anc_deaths_averted / v.deaths_averted;
}

function classify(m: ResolvedModel): Rule {
  if (BY_ID[m.id]) return BY_ID[m.id];
  if (m.owner === "ace") return ACE;
  if (m.owner === "ambitious-impact") return AIM;
  if (m.owner === "giving-green") return GG;
  if (m.owner === "givewell") return GIVEWELL.find(([re]) => re.test(m.id))?.[1] ?? GIVEWELL_DEFAULT;
  throw new Error(`${m.id} (${m.owner}): no classification; add it to BY_ID`);
}

const files = walk(join(root, "models"));
const raws = new Map<string, string>(files.map((p) => [read(p).id as string, p]));
// Swaps first, so a computed share (Suvita) reads the swapped rows.
let changed = 0;
const write = (path: string, text: string, next: string) => {
  if (next === text) return;
  changed++;
  if (!check) writeFileSync(path, next);
};
for (const [id, swaps] of Object.entries(SWAPS)) {
  const path = raws.get(id)!;
  const text = readFileSync(path, "utf8");
  const raw = JSON.parse(text);
  let next = text;
  for (const s of swaps) {
    const i = raw.rows.findIndex((r: { id: string }) => r.id === s.row);
    const r = raw.rows[i];
    if (r.formula === "1") continue;
    const theirs = r.value;
    const { value: _v, kind: _k, range: _r, ...rest } = r;
    raw.rows[i] = {
      ...rest, formula: "1", published: theirs,
      explainer: `Changed for consistency (docs/normalization.md 2.12): ${s.why} (${typeof theirs === "object" ? theirs.best : theirs}) is a discount for weak or missing evidence, the question the site's missing-data step answers for every model, so in our view it is 1 and the model's missing_data classification applies instead; nothing is discounted twice. The evaluator view keeps the evaluator's figure.${r.explainer ? ` The evaluator's note: ${r.explainer}` : ""}`,
    };
    // Rewrite only this row's object, at its own indent, so the rest of the file keeps its layout.
    const at = new RegExp(`\\n([ \\t]*)\\{\\n[ \\t]*"id": "${s.row}",[\\s\\S]*?\\n\\1\\}`).exec(next);
    if (!at) throw new Error(`${id}: row ${s.row} not found`);
    const indent = at[1];
    const block = JSON.stringify(raw.rows[i], null, 2).split("\n").map((l, j) => (j ? indent + l : l)).join("\n");
    next = next.slice(0, at.index) + `\n${indent}${block}` + next.slice(at.index + at[0].length);
  }
  write(path, text, next);
}

const lib = buildLibrary(
  files.map(read), read(join(root, "assumptions/default.json")), walk(join(root, "facts")).map(read),
  walk(join(root, "charities")).map(read), read(join(root, "owners.json")),
);
const counts: Record<string, number> = {};
for (const m of [...lib.models.values()].sort((a, b) => a.id.localeCompare(b.id))) {
  if (m.kind === "template" || !comparable(lib, m) || m.owner === "charityevals") continue;
  const path = raws.get(m.id)!;
  const text = readFileSync(path, "utf8");
  let next = text.replace(/^[ \t]+"missing_data": .*\n/m, "");
  // Variants inherit their parent's, unless named here.
  if (m.kind !== "variant" || BY_ID[m.id]) {
    const rule = classify(m);
    const share = Number((typeof rule.share === "function" ? rule.share(m) : rule.share).toPrecision(3));
    const key = `${m.owner} ${share === 0 ? "measured" : share === 1 ? "thin" : "partly thin"}`;
    counts[key] = (counts[key] ?? 0) + 1;
    if (process.argv.includes("--table")) console.log(`${m.id} | ${share} | ${rule.note}`);
    const md = JSON.stringify({ thin_share: share, note: rule.note });
    next = next.replace(/^([ \t]+)"beneficiaries_note": .*\n/m, (line, indent: string) => `${line}${indent}"missing_data": ${md},\n`);
    if (!next.includes('"missing_data"')) throw new Error(`${m.id}: no "beneficiaries_note" line to write after`);
  } else {
    const parent = lib.models.get(m.extends!)!;
    const share = parent.missing_data?.thin_share ?? classify(parent).share;
    const key = `${m.owner} ${share === 0 ? "measured" : share === 1 ? "thin" : "partly thin"} (variants)`;
    counts[key] = (counts[key] ?? 0) + 1;
  }
  write(path, text, next);
}
for (const [k, n] of Object.entries(counts).sort()) console.log(`${k}: ${n}`);
console.log(`${changed} file${changed === 1 ? "" : "s"} ${check ? "would change" : "changed"}`);
if (check && changed) process.exit(1);
