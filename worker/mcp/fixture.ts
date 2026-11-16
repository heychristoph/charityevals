// A small library for the MCP server's tests: two evaluators and a hidden one, charities in two causes,
// a model with a location variant, one with a simulation, one in a unit that doesn't convert.
import type { LibraryInput } from "./library";

const src = (title: string) => ({ title, url: "https://example.org/source" });
const input = (id: string, label: string, value: number | { low: number; best: number; high: number }, kind = "estimate") => ({ id, label, value, kind, source: src(label), explainer: `Why ${label.toLowerCase()} is what it is.` });

export const fixture = (): LibraryInput => ({
  assumptions: {
    groups: [{ id: "people", title: "People" }],
    rows: [
      { id: "uov_per_daly", label: "Units of value per healthy year", section: "people", format: "number", value: { low: 1, best: 2, high: 4 }, kind: "judgment", explainer: "How much a year of healthy life is worth." },
      { id: "discount_rate", label: "Discount rate", section: "people", format: "percent", value: { low: 0.001, best: 0.04, high: 0.08 }, kind: "judgment", explainer: "How much less next year counts." },
      { id: "fixed_rate", label: "A fixed rate", format: "number", value: 3, kind: "observed", fixed: true, explainer: "Taken from evidence." },
      { id: "derived_rate", label: "A derived rate", format: "number", formula: "$uov_per_daly * 2" },
    ],
    presets: [{ id: "patient", label: "Patient", about: "The future counts almost in full.", values: { discount_rate: 0.001 } }],
    units: {
      uov: { label: "units of value", short: "UoV", to_common: "1" },
      widgets: { label: "widgets", short: "widgets" },
    },
    common: { unit: "uov", benchmark: "cash" },
  },
  facts: [],
  owners: [
    { id: "givewell", name: "GiveWell", short: "GW", url: "https://www.givewell.org", kind: "evaluator" },
    { id: "founders-pledge", name: "Founders Pledge", short: "FP", url: "https://www.founderspledge.com", kind: "evaluator", published: false },
    { id: "charityevals", name: "charityevals", short: "CE", url: "https://charityevals.org", kind: "charityevals" },
  ],
  charities: [
    { id: "cash", name: "Cash Charity", cause: "global-health", summary: "Sends money to poor households." },
    { id: "nets", name: "Bednet Foundation", cause: "global-health", summary: "Buys malaria nets." },
    { id: "hens", name: "Hen Welfare League", cause: "animal-welfare", summary: "Campaigns for cage-free hens." },
    { id: "widgetco", name: "Widget Co", cause: "climate" },
    { id: "secret", name: "Secret Charity", cause: "climate" },
  ],
  models: [
    {
      id: "cash", name: "Cash Charity (GiveWell)", kind: "charity", cause: "global-health", charity: "cash", owner: "givewell",
      summary: "Cash transfers: {{result}} years of healthy life per $1,000.",
      source: { publisher: "GiveWell", title: "Cash CEA", url: "https://www.givewell.org/cash", published: "2025-11-01", retrieved: "2026-11-01", license: "CC BY-NC-SA 3.0 US" },
      rows: [
        input("cost", "Cost per household", { low: 800, best: 1000, high: 1200 }),
        input("benefit", "Units of value per household", { low: 2, best: 3, high: 4 }),
        { id: "per_dollar", label: "Units of value per dollar", formula: "benefit / cost * (1 - $discount_rate)" },
      ],
      output: { row: "per_dollar", unit: "uov", label: "Units of value per dollar" },
    },
    {
      id: "cash-fp", name: "Cash Charity (Founders Pledge)", kind: "charity", cause: "global-health", charity: "cash", owner: "founders-pledge",
      rows: [input("per_dollar", "Units of value per dollar", 1)],
      output: { row: "per_dollar", unit: "uov", label: "Units of value per dollar" },
    },
    {
      id: "secret-fp", name: "Secret Charity (Founders Pledge)", kind: "charity", cause: "climate", charity: "secret", owner: "founders-pledge",
      rows: [input("per_dollar", "Units of value per dollar", 1)],
      output: { row: "per_dollar", unit: "uov", label: "Units of value per dollar" },
    },
    {
      id: "nets-charityevals", name: "Bednet Foundation", kind: "charity", cause: "global-health", charity: "nets", owner: "charityevals",
      summary: "Nets save lives.",
      source: { publisher: "charityevals", title: "Our model", url: "https://charityevals.org/nets", published: "2026-10-01", retrieved: "2026-10-01" },
      rows: [
        input("cost", "Cost per net", { low: 4, best: 5, high: 6 }),
        input("value", "Units of value per net", { low: 0.1, best: 0.2, high: 0.4 }, "judgment"),
        { id: "per_dollar", label: "Units of value per dollar", formula: "value / cost" },
      ],
      output: { row: "per_dollar", unit: "uov", label: "Units of value per dollar" },
    },
    {
      id: "nets-charityevals-chad", name: "Bednet Foundation (Chad)", kind: "variant", extends: "nets-charityevals",
      rows: [{ id: "cost", label: "Cost per net", value: { low: 5, best: 6, high: 7 }, kind: "estimate", explainer: "Nets cost more in Chad." }],
    },
    {
      id: "hens-charityevals", name: "Hen Welfare League", kind: "charity", cause: "animal-welfare", charity: "hens", owner: "charityevals",
      source: { publisher: "charityevals", title: "Our model", url: "https://charityevals.org/hens", published: "2026-10-01", retrieved: "2026-10-01" },
      rows: [input("per_dollar", "Units of value per dollar", { low: 0.001, best: 0.01, high: 0.1 }, "judgment")],
      output: { row: "per_dollar", unit: "uov", label: "Units of value per dollar" },
    },
    {
      id: "widgetco-charityevals", name: "Widget Co", kind: "charity", cause: "climate", charity: "widgetco", owner: "charityevals",
      source: { publisher: "charityevals", title: "Our model", url: "https://charityevals.org/widgetco", published: "2026-10-01", retrieved: "2026-10-01" },
      rows: [input("per_dollar", "Widgets per dollar", 7)],
      output: { row: "per_dollar", unit: "widgets", label: "Widgets per dollar" },
    },
  ],
  // The cash model's simulation: the result from half to twice the best guess.
  options: { distributions: { cash: { q: Array.from({ length: 19 }, (_, i) => 0.5 * 4 ** (i / 18)), mean: 1.1, zero: 0 } } },
});
