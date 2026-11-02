// Prints the shared moved-money rows (src/engine/moved-money.ts, docs/normalization.md 2.8) for a meta
// model as JSON: { section, rows }. scripts/moved-money.py writes them into a model file.
//   npx tsx scripts/moved-money.ts <global-health|livelihoods|tlycs> [net]
//     global-health  an organisation that only moves money within global health and poverty
//     livelihoods    an organisation that moves money to livelihoods charities (Better Futures Guide)
//     tlycs          The Life You Can Save's own published split by charity
//     net            also the new/shifted rows (for money moved gross); omit for a result already
//                    stated as counterfactual value in dollars of effective donations (CEARCH)
import { GLOBAL_HEALTH_ONLY, LIVELIHOODS_ONLY, MOVED_MONEY_ROWS, MOVED_MONEY_SECTION, TLYCS_SPLIT } from "../src/engine/moved-money";

const [scope, net] = process.argv.slice(2);
if (!["global-health", "livelihoods", "tlycs"].includes(scope)) {
  console.error("usage: npx tsx scripts/moved-money.ts <global-health|livelihoods|tlycs> [net]");
  process.exit(1);
}
const R = MOVED_MONEY_ROWS;
const destinations = {
  "global-health": [R.value_global_health, GLOBAL_HEALTH_ONLY],
  livelihoods: [R.value_livelihoods, LIVELIHOODS_ONLY],
  tlycs: [R.value_tlycs_recommended, TLYCS_SPLIT],
}[scope]!;
const rows = [...destinations, ...(net ? [R.prior_dollar_value, R.new_money_share, R.moved_dollar_net_value] : [])].map((r) => ({
  id: r.id, section: MOVED_MONEY_SECTION.id, label: r.label, format: r.format, formula: r.formula, explainer: r.explainer,
}));
console.log(JSON.stringify({ section: MOVED_MONEY_SECTION, rows }));
