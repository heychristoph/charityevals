// Numbers in prose rendered from the model (docs/prose-numbers.md), and the scan that finds typed ones.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { load, root } from "./test-library";
import { assumptionValues, compute, headline } from "./model";
import { parsePlaceholder, placeholderErrors, renderLibraryProse, renderText } from "./prose";
import { applyCandidates, scanText } from "./prose-numbers";
import { formatValue, formatYears } from "../lib/format";

const gd = JSON.parse(readFileSync(join(root, "models/global-health/givedirectly.json"), "utf8"));
const { lib, models: [m] } = load(gd);
const av = assumptionValues(lib.assumptions);
const calc = m.rows.find((r) => r.node && r.deps.length && r.id !== m.output!.row)!;
const value = formatValue(compute(lib, m, av)[calc.id], calc.format);
const result = formatYears(headline(lib, m, av));

describe("placeholders", () => {
  it("parses the forms the spec names, and says why a body names nothing", () => {
    expect(parsePlaceholder("result")).toEqual({ kind: "result", model: undefined, view: "charityevals" });
    expect(parsePlaceholder("result:evaluator")).toEqual({ kind: "result", model: undefined, view: "evaluator" });
    expect(parsePlaceholder("result:givedirectly")).toEqual({ kind: "result", model: "givedirectly", view: "charityevals" });
    expect(parsePlaceholder("row:cost_per_net:evaluator")).toEqual({ kind: "row", row: "cost_per_net", view: "evaluator" });
    expect(parsePlaceholder("range:cost_per_net")).toEqual({ kind: "range", row: "cost_per_net", view: "charityevals" });
    expect(parsePlaceholder("rows:x")).toMatch(/unknown placeholder/);
    expect(parsePlaceholder("row")).toMatch(/needs a row id/);
    expect(parsePlaceholder("low:evaluator")).toMatch(/our view's only/);
  });

  it("renders the headline and a row as the page formats them; in a write-up the headline is the live span", () => {
    expect(renderText(lib, m, "comes to {{result}} years")).toBe(`comes to ${result} years`);
    expect(renderText(lib, m, `{{row:${calc.id}}}`)).toBe(value);
    expect(renderText(lib, m, "{{result}}", true)).toBe(`<span data-figure="headline" data-model="${m.id}">${result}</span>`);
  });

  it("fails on a placeholder that names nothing", () => {
    expect(() => renderText(lib, m, "{{row:no_such_row}}")).toThrow(/no row no_such_row/);
    expect(() => renderText(lib, m, "{{result:no-such-model}}")).toThrow(/no model/);
    expect(placeholderErrors(lib, m, "{{row:no_such_row}} and {{bogus}}")).toHaveLength(2);
  });

  it("renders a variant's inherited text with its parent's values", () => {
    const parent = { ...gd, id: "prose-parent", summary: "It comes to {{result}} years." };
    const child = { id: "prose-child", extends: "prose-parent", name: "Child", kind: "variant", cause: gd.cause, rows: [{ id: m.output!.row, formula: `${m.byId.get(m.output!.row)!.formula} * 2` }] };
    const two = load(parent, child);
    expect(two.lib.errors.filter((e) => e.includes("prose-"))).toEqual([]);
    expect(renderLibraryProse(two.lib)).toEqual([]);
    expect(two.models[1].summary).toBe(two.models[0].summary);
    expect(two.models[0].summary).toBe(`It comes to ${formatYears(headline(two.lib, two.models[0], av))} years.`);
  });
});

describe("typed numbers", () => {
  it("finds the typed headline and a figure span, and replaces them with what renders the same", () => {
    const text = `Our model comes to **${result} years of healthy life per $1,000**; <span data-figure="headline" data-model="${m.id}">1</span> years of healthy life per $1,000.`;
    const cs = scanText(lib, m, text, { writeup: true });
    expect(cs.filter((c) => c.safe).map((c) => c.placeholder)).toEqual(["{{result}}", "{{result}}"]);
    const out = applyCandidates(text, cs);
    expect(out).toContain("comes to **{{result}} years");
    expect(renderText(lib, m, out.replace(/<span[^>]*>1<\/span>/, ""))).toContain(`**${result} years`);
  });

  it("leaves years, numbered references and quoted figures typed", () => {
    const text = `In 2024 (docs/normalization.md 2.6) the source says "${result} years of healthy life per $1,000".`;
    expect(scanText(lib, m, text).filter((c) => c.safe)).toEqual([]);
  });

  it("finds the headline typed stale in the model's own sentence, but not a source's or a case", () => {
    const stale = String(Number(result.replace(/,/g, "")) * 3 + 0.1);
    const cs = scanText(lib, m, `At the defaults it averts about ${stale} years of healthy life per $1,000.`);
    expect(cs.filter((c) => c.safe).map((c) => c.placeholder)).toEqual(["{{result}}"]);
    expect(scanText(lib, m, `The study found ${stale} years of healthy life per $1,000.`).filter((c) => c.safe)).toEqual([]);
    expect(scanText(lib, m, `If the rate were higher, at the defaults it averts about ${stale} years of healthy life per $1,000.`).filter((c) => c.safe)).toEqual([]);
  });

  it("takes a row that reads a shared fact or an assumption as the model's own figure, not an input", () => {
    const fact = m.rows.find((r) => r.node && !r.deps.length && (r.factDeps.length || r.assumptionDeps.length) && /percent|usd|multiple/.test(r.format ?? ""));
    if (!fact) return;
    const shown = formatValue(compute(lib, m, av)[fact.id], fact.format);
    const cs = scanText(lib, m, `Here it is ${shown}.`, { row: fact.id });
    expect(cs.find((c) => c.placeholder === `{{row:${fact.id}}}`)?.note ?? "").not.toMatch(/an input/);
  });
});
