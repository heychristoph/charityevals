// Prints the shared moved-money rows (src/engine/moved-money.ts, docs/normalization.md 2.8) for a meta
// model as JSON: { section, rows }. scripts/moved-money.py writes them into a model file.
//   npx tsx scripts/moved-money.ts <global-health|livelihoods|tlycs|own-split> [net|informed [<cause>]]
//     global-health  an organisation that only moves money within global health and poverty
//     livelihoods    an organisation that moves money to livelihoods charities (Better Futures Guide)
//     tlycs          The Life You Can Save's own published split by charity
//     own-split      an organisation's own published split: moved_dollar_value reads the model's
//                    hand-written value_destinations (normalization.md 2.8, isDestinationMix)
//     net            also the new/shifted rows (for money moved gross); omit for a result already
//                    stated as counterfactual value in dollars of effective donations (CEARCH), which
//                    multiplies by the row mobiliser_share itself (written with every scope)
//     informed       spending research or advice changed, all shifted: prior_dollar_value,
//                    shifted_dollar_value and informed_money_value (evidence and missing-data steps)
//     <cause>        the model's cause, when it isn't global-health: shifted money is compared with an
//                    ordinary charity of that cause (priorDollarValue); for money split across causes,
//                    <fact>=<cause>[+<cause>],... (the @meta share facts of value_destinations; `+`
//                    averages areas): each cause's ordinary charity in that mix (priorDollarValueMix)
//   npx tsx scripts/moved-money.ts set <set> <global-health|livelihoods|tlycs>
//                    a second destination set: the main set's rows prefixed <set>_ (destinationSetRows)
import { GLOBAL_HEALTH_ONLY, LIVELIHOODS_ONLY, MOVED_MONEY_ROWS, MOVED_MONEY_SECTION, OWN_SPLIT, TLYCS_SPLIT, destinationSetRows, priorDollarValue, priorDollarValueMix, type CauseShare } from "../src/engine/moved-money";

if (process.argv[2] === "set") {
  const [, set, dest] = process.argv.slice(2);
  const d = ({ "global-health": GLOBAL_HEALTH_ONLY, livelihoods: LIVELIHOODS_ONLY, tlycs: TLYCS_SPLIT } as const)[dest as "tlycs"];
  if (!/^[a-z][a-z0-9]*$/.test(set ?? "") || !d) {
    console.error("usage: npx tsx scripts/moved-money.ts set <set> <global-health|livelihoods|tlycs>");
    process.exit(1);
  }
  const rows = destinationSetRows(set, d.formula).map((r) => ({ id: r.id, section: MOVED_MONEY_SECTION.id, label: r.label, format: r.format, formula: r.formula, explainer: r.explainer }));
  console.log(JSON.stringify({ section: MOVED_MONEY_SECTION, rows }));
  process.exit(0);
}

const [scope, step, cause = "global-health"] = process.argv.slice(2);
if (!["global-health", "livelihoods", "tlycs", "own-split"].includes(scope) || (step && !["net", "informed"].includes(step))) {
  console.error("usage: npx tsx scripts/moved-money.ts <global-health|livelihoods|tlycs|own-split> [net|informed [<cause> | <fact>=<cause>[+<cause>],...]]");
  process.exit(1);
}
const R = MOVED_MONEY_ROWS;
const destinations = {
  "global-health": [R.value_global_health, GLOBAL_HEALTH_ONLY],
  livelihoods: [R.value_livelihoods, LIVELIHOODS_ONLY],
  tlycs: [R.value_tlycs_recommended, TLYCS_SPLIT],
  "own-split": [R.value_global_health, OWN_SPLIT],
}[scope]!;
const prior = cause.includes("=")
  ? priorDollarValueMix(cause.split(",").map((p): CauseShare => {
      const [k, c] = p.split("=");
      return [k, c.includes("+") ? c.split("+") : c];
    }))
  : priorDollarValue(cause);
// The mobiliser's share (docs/normalization.md 2.24) is written with every scope: the net and shifted rows
// read it, and a result already in counterfactual dollars (no step) multiplies by it in the model's own row.
const steps = { net: [prior, R.new_money_share, R.mobiliser_share, R.moved_dollar_net_value], informed: [prior, R.mobiliser_share, R.shifted_dollar_value, R.informed_money_value] };
const rows = [...destinations, ...(step ? steps[step as keyof typeof steps] : [R.mobiliser_share])].map((r) => ({
  id: r.id, section: MOVED_MONEY_SECTION.id, label: r.label, format: r.format, formula: r.formula, explainer: r.explainer,
}));
console.log(JSON.stringify({ section: MOVED_MONEY_SECTION, rows }));
