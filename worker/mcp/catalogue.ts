// What the MCP tools answer from: a catalogue of the charities and models (names, causes, pages,
// licences, the shared assumptions) and their figures under one set of values. The build writes the
// catalogue and the figures at the defaults and under every value set (/data/mcp-results.json), so most
// calls need no engine at all; a reader's own values are computed live from the library (LiveFigures).
import { assumptionValues, comparable, modelsOf, type Library, type ResolvedModel } from "../../src/engine/model";
import { primaryModel, type Basis } from "../../src/engine/ranking";
import type { Assumptions } from "../../src/engine/schema";
import { licenceOf, type Licence } from "../../src/lib/licence";
import { charityFigure, modelFigure, rankings, type CharityFigure, type Figure } from "./figures";
import { plainModelName } from "../../src/lib/format";

export const YEARS = "years of healthy life per $1,000";

export type CatalogueModel = {
  name: string;
  charity: string;
  owner: string;
  /** What its figure is counted in: healthy years per $1,000, or its own unit per dollar. */
  unit: string;
  /** Its page is the charity's (it is the charity's main model). */
  main: boolean;
  /** Index into the catalogue's licences. */
  licence: number;
};

export type CatalogueCharity = { name: string; cause: string; area?: string; summary?: string; models: string[]; main: string };

export type Catalogue = {
  assumptions: Assumptions;
  owners: Record<string, string>;
  licences: Licence[];
  charities: Record<string, CatalogueCharity>;
  models: Record<string, CatalogueModel>;
};

/** A figure's numbers; null for one that isn't a number (JSON has no NaN). */
type Num = number | null;
export type ProgrammeFig = { programme: string; model: string; weight?: number; locations: number; central: Num; low: Num; high: Num };
export type EvaluatorFig = { owner: string; basis: Basis; central: Num; low: Num; high: Num; programmes: ProgrammeFig[] };
/** A charity's figure: as ranked where it is on the rankings at these values, else as its page shows it. */
export type CharityFig = { ranked: boolean; primary: string; central: Num; low: Num; high: Num; evaluators: EvaluatorFig[] };

/** Every model's and charity's figure under one set of values, and the rankings' order. */
export type Scenario = { models: Record<string, [Num, Num, Num]>; charities: Record<string, CharityFig>; rankings: string[] };

/** /data/mcp-results.json. */
export type Precomputed = { catalogue: Catalogue; scenarios: Record<string, Scenario> };

/** The figures a tool reads, whether stored or computed. */
export interface Figures {
  model(id: string): Figure | undefined;
  charity(id: string): CharityFig | undefined;
  /** Charity ids on the rankings, best first. */
  rankings(): string[];
}

const num = (x: number): Num => (Number.isFinite(x) ? x : null);
export const val = (x: Num | undefined): number => (x === null || x === undefined ? NaN : x);

/** The models the tools answer for: every model with a result that isn't a template. */
export const answerable = (lib: Library) => [...lib.models.values()].filter((m) => m.kind !== "template" && m.output);

export function catalogueOf(lib: Library): Catalogue {
  const licences: Licence[] = [];
  const licenceIndex = (m: ResolvedModel) => {
    const l = licenceOf(m);
    const i = licences.findIndex((x) => x.name === l.name && x.attribution === l.attribution && x.url === l.url);
    return i >= 0 ? i : licences.push(l) - 1;
  };
  const charities: Record<string, CatalogueCharity> = {};
  for (const c of lib.charities.values()) {
    const ms = modelsOf(lib, c.id);
    const main = primaryModel(lib, c.id);
    if (!ms.length || !main) continue;
    charities[c.id] = { name: c.name, cause: c.cause, ...(c.area ? { area: c.area } : {}), ...(c.summary ? { summary: c.summary } : {}), models: ms.map((m) => m.id), main: main.id };
  }
  const models: Record<string, CatalogueModel> = {};
  const owners: Record<string, string> = {};
  for (const m of answerable(lib)) {
    owners[m.owner] = lib.owners.get(m.owner)?.name ?? m.owner;
    models[m.id] = {
      name: plainModelName(m.name),
      charity: m.charity,
      owner: m.owner,
      unit: comparable(lib, m) ? YEARS : `${lib.assumptions.units[m.output!.unit]?.label ?? m.output!.unit} per dollar`,
      main: primaryModel(lib, m.charity)?.id === m.id,
      licence: licenceIndex(m),
    };
  }
  return { assumptions: lib.assumptions, owners, licences, charities, models };
}

function charityFig(f: CharityFigure, ranked: boolean): CharityFig {
  return {
    ranked,
    primary: f.primary,
    central: num(f.central), low: num(f.low), high: num(f.high),
    evaluators: f.evaluators.map((e) => ({
      owner: e.owner, basis: e.basis, central: num(e.central), low: num(e.low), high: num(e.high),
      programmes: e.programs.map((p) => ({ programme: p.program, model: p.result.model.id, ...(p.weight !== undefined ? { weight: p.weight } : {}), locations: p.locations, central: num(p.central), low: num(p.low), high: num(p.high) })),
    })),
  };
}

/** Figures computed from the library at values `av`, each once. */
export class LiveFigures implements Figures {
  private models = new Map<string, Figure | undefined>();
  private charities = new Map<string, CharityFig | undefined>();
  private order?: string[];
  constructor(readonly lib: Library, readonly av: Record<string, number>) {}

  model(id: string): Figure | undefined {
    if (!this.models.has(id)) {
      const m = this.lib.models.get(id);
      this.models.set(id, m && m.kind !== "template" && m.output ? modelFigure(this.lib, m, this.av) : undefined);
    }
    return this.models.get(id);
  }

  charity(id: string): CharityFig | undefined {
    if (!this.charities.has(id)) {
      const ranked = charityFigure(this.lib, id, this.av, true);
      const page = ranked ? undefined : charityFigure(this.lib, id, this.av, false);
      this.charities.set(id, ranked ? charityFig(ranked, true) : page ? charityFig(page, false) : undefined);
    }
    return this.charities.get(id);
  }

  rankings(): string[] {
    if (!this.order) {
      const all = rankings(this.lib, this.av);
      for (const f of all) if (!this.charities.has(f.charity.id)) this.charities.set(f.charity.id, charityFig(f, true));
      this.order = all.map((f) => f.charity.id);
    }
    return this.order;
  }
}

/** Figures the build stored. */
export class StoredFigures implements Figures {
  constructor(readonly scenario: Scenario) {}
  model(id: string): Figure | undefined {
    const f = this.scenario.models[id];
    return f && { central: val(f[0]), low: val(f[1]), high: val(f[2]) };
  }
  charity(id: string): CharityFig | undefined {
    return this.scenario.charities[id];
  }
  rankings(): string[] {
    return this.scenario.rankings;
  }
}

/** Every figure under values `av`, for the build. */
export function scenarioOf(lib: Library, cat: Catalogue, av: Record<string, number>): Scenario {
  const live = new LiveFigures(lib, av);
  const order = live.rankings();
  const models: Scenario["models"] = {};
  for (const id of Object.keys(cat.models)) {
    const f = live.model(id)!;
    models[id] = [num(f.central), num(f.low), num(f.high)];
  }
  const charities: Scenario["charities"] = {};
  for (const id of Object.keys(cat.charities)) {
    const f = live.charity(id);
    if (f) charities[id] = f;
  }
  return { models, charities, rankings: order };
}

/** The catalogue and the figures at the defaults ("default") and under every value set (by its id). */
export function precompute(lib: Library): Precomputed {
  const catalogue = catalogueOf(lib);
  const scenarios: Record<string, Scenario> = { default: scenarioOf(lib, catalogue, assumptionValues(lib.assumptions)) };
  for (const p of lib.assumptions.presets ?? []) scenarios[p.id] = scenarioOf(lib, catalogue, assumptionValues(lib.assumptions, p.values));
  return { catalogue, scenarios };
}
