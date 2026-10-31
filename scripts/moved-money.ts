// Prints the shared moved-money rows (src/engine/moved-money.ts, docs/normalization.md 2.8) for a meta
// model as JSON: { section, rows }. scripts/moved-money.py writes them into a model file.
//   npx tsx scripts/moved-money.ts <mix|global-health> [net]
//     mix            destinations: Giving What We Can's split across causes
//     global-health  an organisation that only moves money within global health and poverty
//     net            also the new/shifted rows (for money moved gross); omit for a result already
//                    stated as counterfactual value in dollars of effective donations (CEARCH)
import { GLOBAL_HEALTH_ONLY, MOVED_MONEY_ROWS, MOVED_MONEY_SECTION } from "../src/engine/moved-money";

const [scope, net] = process.argv.slice(2);
if (!["mix", "global-health"].includes(scope)) {
  console.error("usage: npx tsx scripts/moved-money.ts <mix|global-health> [net]");
  process.exit(1);
}
const R = MOVED_MONEY_ROWS;
const rows = [
  R.value_global_health,
  ...(scope === "mix" ? [R.value_animals, R.value_longtermist, R.moved_dollar_value] : [GLOBAL_HEALTH_ONLY]),
  ...(net ? [R.prior_dollar_value, R.new_money_share, R.moved_dollar_net_value] : []),
].map((r) => ({ id: r.id, section: MOVED_MONEY_SECTION.id, label: r.label, format: r.format, formula: r.formula, explainer: r.explainer }));
console.log(JSON.stringify({ section: MOVED_MONEY_SECTION, rows }));
