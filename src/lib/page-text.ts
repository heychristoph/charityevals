// What a model's page says, as data for readers that don't run its JavaScript: the MCP server's get_model
// (src/lib/mcp-data.ts), /data/models/<id>.json and llms-full.txt (src/lib/open-data.ts). The story and its
// steps, "What it depends on", how the evaluator's figure becomes ours, the write-up and the sources, each
// from the function the page itself uses, at the default values. Build time only (it reads the write-ups).
import { assumptionValues, compute, modelsOf, pickValue, type ResolvedModel } from "../engine/model";
import { renderText } from "../engine/prose";
import { uncertainty, type Driver } from "../engine/uncertainty";
import { STEP_KIND, stepTimes, waterfall } from "../engine/waterfall";
import { lib, primaryOf } from "./data";
import { formatShown, formatValue, formatYears, possessive } from "./format";
import { plain } from "./labels";
import { charityDrivers, pickDrivers } from "./page-drivers";
import { fillStory, storyNumber, storyValue } from "./story";
import { charityOf, charitySentence, programsOf, wholeOf, type Whole } from "./whole";

type Story = NonNullable<ResolvedModel["story"]>;
const writeups = import.meta.glob<string>("../../writeups/*.md", { eager: true, query: "?raw", import: "default" });
const writeupPath = (id: string) => `../../writeups/${id}.md`;
const defaults = () => assumptionValues(lib.assumptions);
/** The page's bold, as plain text. */
const bare = (s: string) => s.replace(/\*\*/g, "");

/** The write-up a model's page shows: its own; a variant's parent's; on the charity's main page, the one
 * filed under its first model (a hand-written evaluation stays when a newer sheet becomes the main model). */
export function writeupIdOf(m: ResolvedModel, has: (id: string) => boolean = (id) => writeupPath(id) in writeups): string | undefined {
  const main = primaryOf(lib, m.charity)?.id === m.id;
  return [m.id, ...m.chain.slice(1), ...(main ? [modelsOf(lib, m.charity)[0]?.id] : [])].find((id): id is string => !!id && has(id));
}

/** The write-up in Markdown, its numbers filled in at the default values. */
export function writeupOf(m: ResolvedModel): string | undefined {
  const id = writeupIdOf(m);
  const text = id && writeups[writeupPath(id)];
  return text ? renderText(lib, lib.models.get(id) ?? m, text).trim() : undefined;
}

export type SourceLink = { title: string; url: string; type: "evaluation" | "model" | "data" | "study" | "charity" | "other"; note?: string };
/** "Evidence and sources": the charity's, the model's and the write-up's own Sources list, once each. */
export function sourcesOf(m: ResolvedModel): SourceLink[] {
  const id = writeupIdOf(m);
  const md = id ? (writeups[writeupPath(id)] ?? "").split(/^### Sources\s*$/m)[1]?.split(/^#{2,3} /m)[0] ?? "" : "";
  const linked = [...md.matchAll(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g)].map((x) => ({ title: x[1], url: x[2], type: "other" as const }));
  const all: SourceLink[] = [...(lib.charities.get(m.charity)?.resources ?? []), ...(m.resources ?? []), ...linked];
  return all.filter((r, i) => all.findIndex((x) => x.url === r.url) === i);
}

/** A charity's main page splits $1,000 across its programmes when they split its money (ModelPage). */
function programmesOn(m: ResolvedModel) {
  return primaryOf(lib, m.charity)?.id === m.id ? programsOf(m) : undefined;
}

/** A story's steps as the page writes them, `scale` the programme's share of $1,000 on a charity's page. */
function steps(story: Story, whole: Whole, scale = 1): string[] {
  const fill = (t: string) => bare(fillStory(t, whole.values, whole.result, formatYears));
  const total = (spec: string) => {
    if (scale === 1) return storyNumber(spec, whole.values, whole.result, formatYears);
    const [src, f] = spec.split("|").map((x) => x.trim());
    const x = storyValue(src, whole.values, whole.result) * scale;
    return f === "y" ? formatYears(x) : formatValue(x, f === "$" ? "usd" : f === "%" ? "percent" : "number");
  };
  const last = story.steps.length - 1;
  return story.steps.map((s, i) => {
    const text = scale !== 1 && i === last ? fill(s.text).replace(/ per \$1,000$/, "") : fill(s.text);
    return `${s.total !== undefined ? total(s.total) : fill(s.op ?? "")} ${text}`;
  });
}

export type StoryText = {
  sentence?: string;
  /** "How it's worked out": from $1,000 to the result. */
  steps?: string[];
  /** A charity of several programmes: $1,000 split by their share of the money, each with its steps. */
  programmes?: { programme: string; dollars: string; result: string; steps?: string[] }[];
};

/** The story the page leads with, at the default values. */
export function storyOf(m: ResolvedModel): StoryText | undefined {
  const av = defaults();
  const programs = programmesOn(m);
  if (programs) {
    const c = charityOf(programs, av, {});
    return {
      sentence: charitySentence(c) && bare(charitySentence(c)!),
      programmes: c.programs.map((p) => ({
        programme: p.label,
        dollars: formatValue(1000 * p.share, "usd"),
        result: formatYears(p.share * p.whole.result),
        ...(p.model.story ? { steps: steps(p.model.story, p.whole, p.share) } : {}),
      })),
    };
  }
  if (!m.story) return undefined;
  const whole = wholeOf(m, av, {});
  return { sentence: bare(fillStory(m.story.sentence, whole.values, whole.result, formatYears)), steps: steps(m.story, whole) };
}

export type Question = {
  question: string;
  /** What kind of number: a shared assumption, or the model's own judgment, estimate or data. */
  kind: "shared assumption" | "judgment" | "estimate" | "data";
  value: string;
  low: string;
  high: string;
  /** Its part of the uncertainty in the result. */
  share: number;
  /** The programme it belongs to, on a charity of several. */
  programme?: string;
  /** What the page says about it: where the number comes from, and why. */
  source?: { title: string; url?: string };
  explainer?: string;
};

/** One question as the page asks it (ModelLayers: Question), for the whole charity across its locations. */
function question(d: Driver, model: ResolvedModel, whole: Whole, share: number, programme?: string): Question {
  const kind = d.scope === "assumption" ? "shared assumption" : d.source === "assumption" ? "shared assumption" : d.source;
  const base = { kind, share: Number(share.toFixed(3)), ...(programme ? { programme } : {}) } as const;
  if (d.scope === "assumption") {
    const row = lib.assumptions.rows.find((r) => r.id === d.id)!;
    const show = (x: number) => formatShown(row, x);
    return { question: row.label, value: show(defaults()[d.id]), low: show(d.low), high: show(d.high), ...base, ...(row.explainer ? { explainer: row.explainer } : {}) };
  }
  const fact = d.scope === "fact" ? lib.facts.get(d.id) : undefined;
  const row = d.scope === "row" ? model.byId.get(d.id) : undefined;
  const key = d.scope === "fact" ? `@${d.id}` : d.id;
  const pageBase = compute(lib, model, defaults());
  // The page's model's rows are one location's; the page shows the funding-weighted mean.
  const k = fact || !pageBase[d.id] ? 1 : whole.base[d.id] / pageBase[d.id];
  const format = (fact ?? row)?.format;
  const source = (fact ?? row)?.source;
  const explainer = (fact ?? row)?.explainer;
  return {
    question: model.story?.questions?.[key] ?? plain(fact?.label ?? row?.label ?? d.label),
    value: formatValue(fact ? pickValue(fact.value) : whole.values[d.id], format),
    low: formatValue(d.low * k, format),
    high: formatValue(d.high * k, format),
    ...base,
    ...(source?.title ? { source: { title: source.title, ...(source.url ? { url: source.url } : {}) } } : {}),
    ...(explainer ? { explainer: renderText(lib, model, explainer) } : {}),
  };
}

/** "What it depends on": the questions the page asks, most uncertainty first. */
export function questionsOf(m: ResolvedModel): Question[] {
  const av = defaults();
  const programs = programmesOn(m);
  if (programs) {
    const c = charityOf(programs, av, {});
    return charityDrivers(c, av).map((a) => question(a.d, a.p.model, a.p.whole, a.weight, a.p.label));
  }
  const whole = wholeOf(m, av, {});
  const u = uncertainty(lib, m, compute(lib, m, av), av, "charityevals");
  return pickDrivers(u, m).map((d) => question(d, m, whole, d.share));
}

export type FromEvaluator = { start: string; value: string; steps: { step: string; kind?: string; times: string }[]; shown: string };

/** How the evaluator's figure becomes the one the page shows (Waterfall), at the default values. */
export function fromEvaluatorOf(m: ResolvedModel): FromEvaluator | undefined {
  const w = waterfall(lib, m, defaults());
  if (!w) return undefined;
  const owner = lib.owners.get(m.owner)?.name ?? m.owner;
  return {
    start: w.start === "evaluator" ? `${possessive(owner)} result, in years of healthy life per $1,000` : "The model at the site's defaults",
    value: formatYears(w.startValue),
    steps: w.steps.map((s) => ({ step: s.label, ...(STEP_KIND[s.kind] ? { kind: STEP_KIND[s.kind] } : {}), times: stepTimes(s.to / s.from) })),
    shown: formatYears(w.end),
  };
}

export type Locations = { result: string; low: string; high: string; places: { location: string; share: string; low: string; high: string }[] };

/** A model whose page combines the locations it funds (src/lib/whole.ts): the figure the page leads with,
 * and each location's share of the money and range. Undefined for a model of one place. */
export function locationsOf(m: ResolvedModel): Locations | undefined {
  if (programmesOn(m)) return undefined;
  const w = wholeOf(m, defaults(), {});
  if (w.places.length < 2) return undefined;
  return {
    result: formatYears(w.result),
    low: formatYears(w.low),
    high: formatYears(w.high),
    places: w.places.map((p) => ({ location: p.label, share: `${Math.round(p.share * 100)}%`, low: formatYears(p.low), high: formatYears(p.high) })),
  };
}

export type PageText = {
  /** On a page over several locations: the figure it leads with, across them. */
  across_locations?: Locations;
  story?: StoryText;
  depends_on: Question[];
  from_evaluator?: FromEvaluator;
  writeup?: string;
  sources: SourceLink[];
};

const cache = new Map<string, PageText>();
/** Everything above for one model's page. */
export function pageText(m: ResolvedModel): PageText {
  let t = cache.get(m.id);
  if (!t) {
    const places = locationsOf(m), story = storyOf(m), from = fromEvaluatorOf(m), writeup = writeupOf(m);
    t = { ...(places ? { across_locations: places } : {}), ...(story ? { story } : {}), depends_on: questionsOf(m), ...(from ? { from_evaluator: from } : {}), ...(writeup ? { writeup } : {}), sources: sourcesOf(m) };
    cache.set(m.id, t);
  }
  return t;
}
