import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { upgrade, presetOf, PRESETS, parseShare, serialise, shareUrl, shortNumber } from "./assumption-state";
import { assumptionValues } from "../engine/model";
import assumptions from "../../assumptions/default.json";

describe("old assumption links", () => {
  it("drop overrides for rates that are now fixed", () => {
    expect(upgrade({ climate_heat_share: 0.5, discount_rate: 0.02 })).toEqual({ discount_rate: 0.02 });
  });

  it("never apply an override to a fixed rate", () => {
    const av = assumptionValues(assumptions as never, { climate_heat_share: 0.5 });
    expect(av.climate_heat_share).toBe(0.2279);
  });
});

describe("the WELLBY rate", () => {
  it("is a slider, so an old link's value applies, restated in healthy years per WELLBY", () => {
    expect(upgrade({ uov_per_wellby: 0.55 })).toEqual({ daly_per_wellby: 0.275 });
    expect(upgrade({ daly_per_wellby: 0.1 })).toEqual({ daly_per_wellby: 0.1 });
  });
});

describe("the value of a life", () => {
  it("was a multiplier on GiveWell's values; an old link's value is restated in healthy years at the default rate", () => {
    expect(upgrade({ life_value_multiplier: 1.2 })).toEqual({ daly_per_child_death: 1.2 * 116.25262 / 2 });
    expect(upgrade({ life_value_multiplier: 1.2, daly_per_child_death: 40 })).toEqual({ daly_per_child_death: 40 });
  });

  it("is worked out from the sliders, never set by a link", () => {
    expect(assumptionValues(assumptions as never, { life_value_multiplier: 3 }).life_value_multiplier).toBeUndefined();
  });
});

describe("value sets", () => {
  it("name the values: Default with none changed, a set when exactly its values, else Custom", () => {
    expect(presetOf({})).toBe("default");
    for (const p of PRESETS) expect(presetOf({ ...p.values })).toBe(p.id);
    expect(presetOf({ ...PRESETS[0].values, discount_rate: 0.02 })).toBe("custom");
    expect(presetOf({ discount_rate: 0.02 })).toBe("custom");
  });

  it("set only sliders that exist, within their ends", () => {
    for (const p of PRESETS)
      for (const [id, v] of Object.entries(p.values)) {
        const r = assumptions.rows.find((x) => x.id === id) as { value: number | { low: number; high: number }; slider?: { low?: number; high?: number }; fixed?: boolean } | undefined;
        expect(r, `${p.id}: ${id}`).toBeDefined();
        expect(r!.fixed, `${p.id}: ${id}`).toBeFalsy();
        // The slider's ends where it has them, else the value's range.
        const range = typeof r!.value === "number" ? { low: r!.value, high: r!.value } : r!.value;
        expect(v).toBeGreaterThanOrEqual(r!.slider?.low ?? range.low);
        expect(v).toBeLessThanOrEqual(r!.slider?.high ?? range.high);
      }
  });
});

describe("share links", () => {
  it("name a value set by its id, and carry only changed values otherwise", () => {
    expect(serialise({})).toEqual({});
    for (const p of PRESETS) expect(serialise({ ...p.values })).toEqual({ set: p.id });
    expect(serialise({ discount_rate: 0.02, chicken_vs_person: 0.000071 })).toEqual({ values: "discount_rate:0.02,chicken_vs_person:7.1e-5" });
  });

  it("write numbers short", () => {
    expect(shortNumber(0.04)).toBe("0.04");
    expect(shortNumber(840)).toBe("840");
    expect(shortNumber(0.000071)).toBe("7.1e-5");
    expect(shortNumber(1 / 3)).toBe("0.333333");
    expect(shortNumber(2e21)).toBe("2e21");
  });

  it("read back what they write", () => {
    const states = [
      {},
      ...PRESETS.map((p) => ({ ...p.values })),
      { discount_rate: 0.02, chicken_vs_person: 0.000071, home_country: 840, ignore_old_estimates: 0 },
      { ...PRESETS[0].values, discount_rate: 0.02 },
    ];
    for (const o of states) {
      const url = new URL(shareUrl("https://charityevals.org/?m=wellby#your-assumptions", o));
      expect(parseShare(url.search) ?? {}).toEqual(o);
    }
  });

  it("set a value set, single values on top of it", () => {
    expect(parseShare("?set=longtermist")).toEqual({ discount_rate: 0.001, never_started_weight: 1 });
    expect(parseShare("?set=default")).toEqual({});
    expect(parseShare("?set=longtermist&values=chicken_vs_person:0.01")).toEqual({ discount_rate: 0.001, never_started_weight: 1, chicken_vs_person: 0.01 });
  });

  it("set nothing without state params, so the stored values apply", () => {
    expect(parseShare("")).toBeUndefined();
    expect(parseShare("?m=wellby&n.cost=3")).toBeUndefined();
    expect(parseShare("?set=nope&values=nope:1,discount_rate:abc")).toBeUndefined();
  });

  it("drop unknown, fixed and derived ids, non-numbers and values the models can't run on", () => {
    expect(parseShare("?values=nope:1,climate_heat_share:0.5,life_value_multiplier:,discount_rate:x,uov_per_daly:3")).toEqual({ uov_per_daly: 3 });
    // Past the slider's ends, as typed in the panel: kept.
    expect(parseShare("?values=discount_rate:0.1,uov_per_daly:40")).toEqual({ discount_rate: 0.1, uov_per_daly: 40 });
    // Negative; a probability above 1; 0 on a log slider without a zero stop: dropped.
    expect(parseShare("?values=uov_per_daly:-2,ai_catastrophe_chance:1.5,discount_rate:0")).toBeUndefined();
    // A zero stop; a weight shown in other terms (chickens per person) may pass 100%.
    expect(parseShare("?values=chicken_vs_person:0")).toEqual({ chicken_vs_person: 0 });
    expect(parseShare("?values=chicken_vs_person:3")).toEqual({ chicken_vs_person: 3 });
    // Toggles are on or off; a country must exist (0 is "not set", the default).
    expect(parseShare("?values=ignore_old_estimates:0.2,home_country:840")).toEqual({ ignore_old_estimates: 0, home_country: 840 });
    expect(parseShare("?values=home_country:12345")).toBeUndefined();
    // At the default: nothing changed.
    expect(parseShare("?values=uov_per_daly:2")).toBeUndefined();
  });

  it("read the encoded form and older links", () => {
    expect(parseShare("?values=discount_rate%3A0.02%2Cuov_per_daly%3A3")).toEqual({ discount_rate: 0.02, uov_per_daly: 3 });
    expect(parseShare("?a.discount_rate=0.02&a.uov_per_wellby=0.55")).toEqual({ discount_rate: 0.02, daly_per_wellby: 0.275 });
  });

  it("keep the page's other params and hash, readable, and drop the old ones", () => {
    const href = "https://charityevals.org/givedirectly?m=wellby&n.cost=250&a.discount_rate=0.03&view=x&set=longtermist#flags";
    expect(shareUrl(href, { discount_rate: 0.02, uov_per_daly: 3 })).toBe("https://charityevals.org/givedirectly?m=wellby&n.cost=250&values=discount_rate:0.02,uov_per_daly:3#flags");
    expect(shareUrl(href, { discount_rate: 0.001, never_started_weight: 1 })).toBe("https://charityevals.org/givedirectly?m=wellby&n.cost=250&set=longtermist#flags");
    expect(shareUrl(href, {})).toBe("https://charityevals.org/givedirectly?m=wellby&n.cost=250#flags");
  });

  it("say the defaults out loud in a link to share, so a recipient's saved values don't replace them", () => {
    const href = "https://charityevals.org/givedirectly?set=longtermist";
    expect(shareUrl(href, {}, { explicitDefault: true })).toBe("https://charityevals.org/givedirectly?set=default");
    expect(parseShare("?set=default")).toEqual({});
    expect(shareUrl(href, { discount_rate: 0.001, never_started_weight: 1 }, { explicitDefault: true })).toBe("https://charityevals.org/givedirectly?set=longtermist");
  });
});

describe("on load", () => {
  let href = "";
  const store = new Map<string, string>();
  beforeEach(() => {
    vi.resetModules();
    store.clear();
    store.set("charityevals:assumptions", JSON.stringify({ uov_per_daly: 3 }));
    const location = { get href() { return href; }, get search() { return new URL(href).search; } };
    vi.stubGlobal("window", { location });
    vi.stubGlobal("localStorage", { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => store.set(k, v), removeItem: (k: string) => store.delete(k) });
    vi.stubGlobal("history", { state: null, replaceState: (_: unknown, __: string, url: string) => { href = url; } });
  });
  afterEach(() => vi.unstubAllGlobals());

  it("a link's values win over stored ones and become the visitor's", async () => {
    href = "https://charityevals.org/?set=longtermist";
    const s = await import("./assumption-state");
    expect(s.shareUrl(href)).toBe(href);
    expect(JSON.parse(store.get("charityevals:assumptions")!)).toEqual({ discount_rate: 0.001, never_started_weight: 1 });
  });

  it("without one, the stored values apply; each change rewrites the URL in place", async () => {
    href = "https://charityevals.org/?m=wellby";
    const s = await import("./assumption-state");
    expect(s.shareUrl(href)).toBe("https://charityevals.org/?m=wellby&values=uov_per_daly:3");
    // A typed value past the slider's end stays; one the models can't run on is ignored.
    s.setAssumption("discount_rate", 0.1, 0.04);
    s.setAssumption("ai_catastrophe_chance", 2, 0.05);
    expect(href).toBe("https://charityevals.org/?m=wellby&values=uov_per_daly:3,discount_rate:0.1");
    expect(s.parseShare(new URL(href).search)).toEqual({ uov_per_daly: 3, discount_rate: 0.1 });
    s.resetAssumptions();
    expect(href).toBe("https://charityevals.org/?m=wellby");
    s.applyPreset("ai-concerned");
    expect(href).toBe("https://charityevals.org/?m=wellby&set=ai-concerned");
  });
});
