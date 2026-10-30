// A reader's edits live in the page's URL: they must survive a round trip through it, leave other
// parameters alone, and apply only to numbers a reader can edit.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildLibrary } from "../engine/model";

let href = "";
beforeEach(() => {
  vi.resetModules();
  href = "https://charityevals.org/toy?a.uov_per_daly=3&n.cost=250&n.@kenya.ppp=2&n.bad=abc&n.empty=";
  const location = { get href() { return href; }, get search() { return new URL(href).search; } };
  vi.stubGlobal("window", { location });
  vi.stubGlobal("history", { replaceState: (_: unknown, __: string, url: URL) => { href = String(url); } });
});
afterEach(() => vi.unstubAllGlobals());

const params = () => Object.fromEntries(new URL(href).searchParams);

describe("edits in the URL", () => {
  it("reads numbers, writes them back, and keeps everything else", async () => {
    const { setEdit, clearEdits } = await import("./edit-state");
    setEdit("people", 60, 50);
    expect(params()).toEqual({ "a.uov_per_daly": "3", "n.cost": "250", "n.@kenya.ppp": "2", "n.people": "60" });
    // Back to the original value: the edit goes.
    setEdit("cost", 200, 200);
    setEdit("people", undefined, 50);
    expect(params()).toEqual({ "a.uov_per_daly": "3", "n.@kenya.ppp": "2" });
    clearEdits();
    expect(params()).toEqual({ "a.uov_per_daly": "3" });
  });

  it("applies only to a model's inputs and the facts it reads", async () => {
    const { editsFor } = await import("./edit-state");
    const facts = [{ id: "kenya", label: "Kenya", rows: [{ id: "ppp", label: "PPP", value: 2, kind: "observed", explainer: "x" }] }];
    const lib = buildLibrary([{
      id: "toy", name: "Toy", cause: "global-health", kind: "charity", output: { row: "out", unit: "u", label: "x" },
      rows: [
        { id: "cost", label: "Cost", value: 200, kind: "observed", explainer: "x" },
        { id: "out", label: "Out", formula: "@kenya.ppp / cost" },
      ],
    }], { groups: [], rows: [], units: { u: { label: "u", short: "u", to_common: "1" } }, common: { unit: "u", benchmark: "toy" } }, facts);
    const m = lib.models.get("toy")!;
    const ok = { cost: 250, "@kenya.ppp": 3 };
    expect(editsFor(m, ok)).toBe(ok);
    expect(editsFor(m, { ...ok, out: 1, missing: 2, "@kenya.gdp": 4 })).toEqual(ok);
  });

  it("moves an edit to a pass-through row onto what it copies, and drops what applies nowhere from the URL", async () => {
    const { editsFor, readEdits } = await import("./edit-state");
    const lib = buildLibrary([{
      id: "toy", name: "Toy", cause: "global-health", kind: "charity", output: { row: "out", unit: "u", label: "x" },
      rows: [
        { id: "cost", label: "Cost", value: 200, kind: "observed", explainer: "x" },
        { id: "cost_copy", label: "Cost again", formula: "cost" },
        { id: "cost_copy2", label: "Cost once more", formula: "cost_copy" },
        { id: "ppp_copy", label: "PPP", formula: "@kenya.ppp" },
        { id: "out", label: "Out", formula: "ppp_copy / cost_copy2" },
      ],
    }], { groups: [], rows: [], units: { u: { label: "u", short: "u", to_common: "1" } }, common: { unit: "u", benchmark: "toy" } },
    [{ id: "kenya", label: "Kenya", rows: [{ id: "ppp", label: "PPP", value: 2, kind: "observed", explainer: "x" }] }]);
    const m = lib.models.get("toy")!;
    expect(editsFor(m, { cost_copy2: 250, ppp_copy: 3, out: 1 })).toEqual({ cost: 250, "@kenya.ppp": 3 });
    // A direct edit to the input wins.
    expect(editsFor(m, { cost_copy: 300, cost: 250 })).toEqual({ cost: 250 });

    // The URL's own edits: n.cost_copy2 moves to n.cost, n.out goes.
    href = "https://charityevals.org/toy?a.uov_per_daly=3&n.cost_copy2=250&n.out=1";
    expect(editsFor(m, readEdits())).toEqual({ cost: 250 });
    await Promise.resolve();
    expect(params()).toEqual({ "a.uov_per_daly": "3", "n.cost": "250" });
  });
});
