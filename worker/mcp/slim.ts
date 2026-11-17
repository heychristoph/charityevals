// /data/mcp-library.json: the library the MCP server computes with, without the text its answers never
// quote. The engine reads ids, formulas, values, ranges, kinds, labels (a value-of-information sheet is
// told by its rows' labels; the uncertainty by an input's), dates and licences; the explainers,
// quotes, notes, write-ups and sources of single inputs it never reads. get_model's text comes from
// the answers the build writes beside it (/data/mcp/<id>.json), and list_assumptions' from the shared
// assumptions, kept whole.
import type { LibraryInput } from "./library";

type Obj = Record<string, unknown>;
const pick = (o: Obj, drop: string[]) => Object.fromEntries(Object.entries(o).filter(([k]) => !drop.includes(k)));

/** A row without its prose: the explainer, its source, the value it reproduces and its range's note. */
function row(r: unknown): unknown {
  if (typeof r !== "object" || r === null) return r;
  const out = pick(r as Obj, ["explainer", "source", "expected", "change", "technical"]);
  if (out.range && typeof out.range === "object") out.range = pick(out.range as Obj, ["note"]);
  return out;
}

function model(m: unknown): unknown {
  const o = m as Obj;
  const out = pick(o, ["summary", "resources", "beneficiaries_note", "template"]);
  if (Array.isArray(o.sections)) out.sections = o.sections.map((s) => pick(s as Obj, ["explainer"]));
  if (Array.isArray(o.rows)) out.rows = o.rows.map(row);
  if (o.source && typeof o.source === "object") out.source = pick(o.source as Obj, ["sheet"]);
  if (o.missing_data && typeof o.missing_data === "object") out.missing_data = { ...(o.missing_data as Obj), note: "-" };
  if (o.theoretical && typeof o.theoretical === "object") out.theoretical = { reason: "-", runs: "-", url: (o.theoretical as Obj).url, checked: (o.theoretical as Obj).checked };
  return out;
}

/** A fact file without explainers and sources, but each row's date read (the next-dollar figures' age). */
function facts(f: unknown): unknown {
  const o = f as Obj;
  return {
    ...pick(o, ["explainer", "note", "source"]),
    rows: ((o.rows ?? []) as Obj[]).map((r) => {
      const retrieved = (r.source as Obj | undefined)?.retrieved;
      return { ...(row(r) as Obj), ...(retrieved ? { source: { retrieved } } : {}) };
    }),
  };
}

function charity(c: unknown): unknown {
  const o = c as Obj;
  const out = pick(o, ["resources", "website", "donate", "donate_via"]);
  if (o.spending && typeof o.spending === "object") out.spending = pick(o.spending as Obj, ["source"]);
  if (Array.isArray(o.lines)) out.lines = o.lines.map((l) => pick(l as Obj, ["source"]));
  if (Array.isArray(o.locations)) out.locations = o.locations.map((l) => pick(l as Obj, ["weight_source"]));
  return out;
}

export function slimLibrary(input: LibraryInput): LibraryInput {
  return {
    models: input.models.map(model),
    assumptions: input.assumptions,
    facts: input.facts.map(facts),
    charities: input.charities.map(charity),
    owners: input.owners,
    ...(input.options ? { options: input.options } : {}),
  };
}
