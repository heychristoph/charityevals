// Typed numbers in prose that are the model's own (docs/prose-numbers.md): finds them, says which
// placeholder would render the same text, and checks that a write-up never types the headline (it would
// go stale the next time the model changes). Node only: reads the repo's files.
//   checkProseNumbers(id)    what scripts/check.ts and scripts/preflight.ts report for one model
//   scanText(...)            candidates for scripts/prose-numbers.ts (report, --apply)
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildLibrary, comparable, compute, headline, assumptionValues, plausibleRange, type Library, type ResolvedModel } from "./model";
import { PLACEHOLDER, placeholderErrors, resultText, textFields } from "./prose";
import { formatValue, formatYears } from "../lib/format";

/** The repository: the folder above this file that holds owners.json. */
export function repoRoot(): string {
  let d = dirname(fileURLToPath(import.meta.url));
  while (!existsSync(join(d, "owners.json")) && dirname(d) !== d) d = dirname(d);
  return existsSync(join(d, "owners.json")) ? d : process.cwd();
}

const walk = (d: string): string[] => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : f.endsWith(".json") ? [p] : [];
});

let cached: Library | undefined;
/** The site's library, built from the repo (every model, the shared data, the simulated ranges), its
 * text as written. Built once per process. */
export function siteLibrary(): Library {
  if (cached) return cached;
  const root = repoRoot();
  const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));
  const dist = join(root, "generated/distributions.json");
  cached = buildLibrary(walk(join(root, "models")).map(read), read(join(root, "assumptions/default.json")), walk(join(root, "facts")).map(read), walk(join(root, "charities")).map(read), read(join(root, "owners.json")),
    { distributions: existsSync(dist) ? read(dist) : undefined });
  return cached;
}

/** A write-up's file for a model, if it has one. */
export const writeupPath = (id: string) => join(repoRoot(), "writeups", `${id}.md`);

/** One typed number the model could render. */
export type Candidate = {
  /** Where it sits in the text, and what is typed there. */
  start: number;
  end: number;
  typed: string;
  /** The placeholder that renders the same text (or, `coarse`, the headline more precisely). */
  placeholder: string;
  /** What it stands for, in words. */
  what: string;
  /** Replaceable without a reader's eye: an exact match to one figure, not a source's own. */
  safe: boolean;
  /** Why it isn't safe, or how it matches. */
  note?: string;
  /** Headline typed with fewer digits than the page shows ("about 5" for 5.3): the placeholder renders it in full. */
  coarse?: boolean;
  sentence: string;
};

// A number as prose types it: 24, 4.4, 1,200, $3.40, 35%, 1.5×, $2.4M, −3.1.
const NUMBER = /(?<![\w$£€¥₹.,/#@\-−])([−-]?\$?)(\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?)(%|×|[MB](?![a-z]))?(?![\w%×]|[.,]\d)/g;
const YEAR = /^(1[89]|20|21)\d\d$/;
// "340 million Americans", "2.4 billion pounds": a count in words, which no figure prints. "17-year wait": a modifier.
const MAGNITUDE = /^\s*(?:million|billion|trillion|thousand|hundred|mn|bn)\b/i;
const COMPOUND = /^[-‑][A-Za-z]/;
const MONTH = /\b(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s*$/;
// The headline's unit, right after the number.
const YEARS_AFTER = /^(?:\s*(?:\*\*|<\/span>))*\s*(?:healthy\s+years?|years?\s+of\s+healthy\s+life|(?:healthy\s+)?life[- ]years?|DALYs?\s+averted|years?\s*(?:\(|,)?[^.;\n]{0,40}per\s+\$1,000|[^.;\n]{0,25}per\s+\$1,000)/i;
// A source's own figure, quoted as theirs: kept typed.
const ATTRIBUTED = /\b(?:reports?|reported|according to|cites?|cited|quotes?|quoted|surveys?|study|studies|trials?|papers?|reviews?|publish(?:es|ed)?|finds|found|their|says|said|states|stated|claims?|anchors?|model's|et al|(?:19|20)\d\d's|sheet(?:'s)?|spreadsheet|evaluator view|GBD|census)\b/i;
// "0.17 to 5.4", "between 17 and 31", "15%–40%": a range's end, not a value.
const RANGE_AFTER = /^\s*(?:to|–|-|and)\s*(?:about\s+)?[−-]?\$?\d/;
const RANGE_BEFORE = /(?:\b(?:from|between|to|and)\s+(?:about\s+)?|\d[%×]?\s*(?:–|-)\s*)$/;
// An audit round's history ("Round 3 … now judged at about $15,000"): what was set then, kept typed.
const HISTORY = /^Round\s+\d|\bround\s+\d+\b/i;
// "The result moved from 0.18 to 0.20, 0.14 and then 0.12": what it was, kept typed.
const MOVED = /\b(?:moved|went|rose|fell|changed|dropped|grew)\s+from\b/i;
// "under 1% of the total", "more than 30%": a bound, not the value.
const BOUND = /\b(?:under|over|above|below|more\s+than|less\s+than|fewer\s+than|at\s+least|at\s+most|up\s+to)\s+(?:about\s+)?(?:\*\*)?$/i;
// "Ambitious Impact's 4%", "the households' own 4%": somebody's figure, stated as theirs.
const POSSESSED = /(?:'s|’s|s['’])\s+(?:own\s+)?(?:\*\*)?$/;
// A named party's figure in the clause before the number: "Bangladesh's households consume 70%".
const PARTY = /\b([A-Z][\w&.-]*(?:\s+[A-Z][\w&.-]*)*)(?:'s|’s)\s+(?:[a-z-]+\s+){0,4}(?:\*\*)?$/;
// Words after a bare number that don't name a unit.
const FUNCTION = new Set("a an the of in on at to from for and or per with by as is are was were that which each every more less higher lower above below over under than when if so but because since while here there it its this these those not no after before into out about then both all".split(" "));
const stems = (s: string) => new Set(s.toLowerCase().split(/[^a-z]+/).filter((w) => w.length >= 3).map((w) => w.slice(0, 5)));
const CONDITIONAL =/\b(?:if|when|unless|otherwise|would|were)\b|^(?:off|on)\b/i;
const STOP = new Set("with from that this than each year years dollar dollars share value total cost costs count counts people person rate number other into over after before their which about model result adjustment factor ours what where them they then also only more less much many some such per".split(" "));
const words = (s: string) => new Set(s.toLowerCase().split(/[^a-z]+/).filter((w) => w.length >= 4 && !STOP.has(w)).map((w) => w.slice(0, 5)));
/** Whether a sentence names what a row is: two words of its label (one, where the label has under three). */
const mentions = (sentence: string, label: string) => {
  const s = words(sentence), l = [...words(label)];
  return l.filter((w) => s.has(w)).length >= Math.min(2, Math.max(1, l.length - 1));
};
const HEDGE =/\b(?:about|around|roughly|some|nearly|almost|approximately|over|under|~)\s*(?:\*\*)?\s*$/i;
// The model's own headline sentence, just before the number: "At the defaults it averts about".
const STALE_HEAD = /\bat\s+the\s+defaults,?\s+(?:it|this\s+model|the\s+model|the\s+work|[\w'’ -]{1,40}?)\s+(?:averts?|gives?|buys?|adds?|comes?\s+to)\s+(?:about\s+|around\s+|roughly\s+)?(?:\*\*)?\s*$/i;

/** Regions no number in is the model's: placeholders, code, link targets, URLs, HTML tags, quotations,
 * block quotes, a write-up's sources. Figure spans are matched separately. */
function masked(text: string): boolean[] {
  const mask = new Array<boolean>(text.length).fill(false);
  const cover = (re: RegExp) => { for (const x of text.matchAll(re)) for (let i = x.index!; i < x.index! + x[0].length; i++) mask[i] = true; };
  cover(/<span data-figure="headline" data-model="[^"]*">[^<]*<\/span>/g);
  cover(PLACEHOLDER);
  cover(/`[^`\n]*`/g);
  cover(/\]\([^)\s]*\)/g);
  cover(/https?:\/\/[^\s)\]]+/g);
  cover(/<[^>\n]+>/g);
  // Quotations, however long: a source's words.
  cover(/“[^”\n]*”|"[^"\n]{1,3000}"/g);
  cover(/^>.*$/gm);
  // References to numbered things: docs/normalization.md 2.6, §2.6, Convention 1, INV-8, Part III line 2.
  cover(/(?:\.md|§|\b(?:sections?|conventions?|decisions?|steps?|lines?|part|schedule|table|figure|pages?|pp?\.|INV-?))\s*#?\d+(?:\.\d+)*(?:\s*(?:and|to|–|-)\s*\d+(?:\.\d+)*)?/gi);
  // Laws and other numbered names: Measure 110, Proposition 47, Rule 1153.1, HB 1234, Phase 2, Form 990.
  cover(/\b(?:Measure|Proposition|Prop\.?|Amendment|Act|Bill|Rule|Title|Article|Question|Initiative|Resolution|Regulation|Directive|Order|Chapter|Clause|Annex|Appendix|Form|Law|Issue|Goal|Target|Phase|Round|Tier|Class|Category|Type|Level|Stage|Group|Wave|Cohort|No\.|HB|SB|AB|HR|H\.R\.|H\.B\.|S\.B\.|EO|SDG)\s*#?\d+(?:[.,/-]\d+)*[A-Za-z]?/g);
  // The headline's own denominator: "per $1,000", "per 1,000 dollars".
  cover(/\bper\s+\$?1,000(?:\s+dollars)?(?![\d,])/gi);
  cover(/^#{2,3} (?:Sources|How this model was checked)\s*$[\s\S]*?(?=^#{2,3} |(?![\s\S]))/gm);
  return mask;
}

/** The sentence around a position. */
function sentenceAt(text: string, i: number): string {
  const before = text.slice(0, i), after = text.slice(i);
  const s = Math.max(before.search(/(?:[.!?]\s+|\n\s*\n|\n[|*-]|\n#)[^.!?\n]*$/), 0);
  const e = after.search(/[.!?](?:\s|$)|\n\s*\n|\n\|/);
  return text.slice(s, e === -1 ? text.length : i + e + 1).replace(/^[.!?\s|*-]+/, "").trim();
}

const sigDigits = (s: string) => s.replace(/[^\d.]/g, "").replace(/^0*\.?0*/, "").replace(".", "").length;

type Figure = { text: string; placeholder: string; what: string; input?: boolean; row?: string };

/** Every figure of a model as the page would print it: the headline in both views, its plausible range,
 * and each row's value (calculated rows; inputs only for the report). */
const figureCache = new WeakMap<ResolvedModel, Figure[]>();
export function figures(lib: Library, m: ResolvedModel): Figure[] {
  let out = figureCache.get(m);
  if (!out) figureCache.set(m, (out = figuresOf(lib, m)));
  return out;
}
function figuresOf(lib: Library, m: ResolvedModel): Figure[] {
  const out: Figure[] = [];
  if (!m.output) return out;
  const av = assumptionValues(lib.assumptions);
  out.push({ text: resultText(lib, m), placeholder: "{{result}}", what: "the result (our view)" });
  if (m.evaluator || m.rows.some((r) => r.published !== undefined)) out.push({ text: resultText(lib, m, "evaluator"), placeholder: "{{result:evaluator}}", what: "the result (evaluator view)" });
  if (comparable(lib, m)) {
    const r = plausibleRange(lib, m, headline(lib, m, av), av);
    if (r) out.push({ text: formatYears(r.low), placeholder: "{{low}}", what: "the plausible range's low end" }, { text: formatYears(r.high), placeholder: "{{high}}", what: "the plausible range's high end" });
  }
  const ours = compute(lib, m, av), theirs = compute(lib, m, av, {}, "evaluator");
  for (const r of m.rows) {
    const t = formatValue(ours[r.id], r.format);
    // A row typed in the model (a number, a constant formula) is given, usually its source's figure. A row
    // that reads a shared fact, an assumption or another model is the model's own, and goes stale when that
    // moves ("the next dollar counts at 64%" for @next_dollar.x).
    const input = !r.node || (!r.deps.length && !r.factDeps.length && !r.assumptionDeps.length && !r.modelDeps.length);
    out.push({ text: t, placeholder: `{{row:${r.id}}}`, what: `row ${r.id}`, input, row: r.id });
    const e = formatValue(theirs[r.id], r.format);
    if (e !== t) out.push({ text: e, placeholder: `{{row:${r.id}:evaluator}}`, what: `row ${r.id} (evaluator view)`, input, row: r.id });
  }
  return out;
}

/** Typed numbers in a text that the model prints: which placeholder would render each, and whether it
 * can be replaced without a reader's eye. `writeup`: a write-up (its figure spans are the headline);
 * `row`: the text is that row's own (its explainer or range note). */
export function scanText(lib: Library, m: ResolvedModel, text: string, opts: { writeup?: boolean; row?: string } = {}): Candidate[] {
  const out: Candidate[] = [];
  const figs = figures(lib, m);
  const owner = lib.owners.get(m.owner);
  // The parties whose figures the model's are: its charity and its owner, by name, short name or initials.
  const mine = [lib.charities.get(m.charity)?.name, owner?.name, owner?.short].filter((n): n is string => !!n);
  const initials = (n: string) => n.split(/[^A-Za-z]+/).filter((w) => /^[A-Z]/.test(w)).map((w) => w[0]).join("");
  const own = (party: string) => mine.some((n) => n.includes(party) || party.includes(n) || initials(n) === party);
  const evaluatorNamed = (s: string) => !!owner && owner.kind !== "charityevals" && [owner.name, owner.short].some((n) => n && new RegExp(`\\b${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(s));

  // A write-up's figure spans: the headline, kept in step in the browser but typed at build time.
  if (opts.writeup)
    for (const x of text.matchAll(/<span data-figure="headline" data-model="([^"]*)">([^<]*)<\/span>/g)) {
      const id = x[1], t = lib.models.get(id);
      out.push({
        start: x.index!, end: x.index! + x[0].length, typed: x[0], placeholder: id === m.id ? "{{result}}" : `{{result:${id}}}`,
        what: id === m.id ? "the result (figure span)" : `${id}'s result (figure span)`, safe: !!t?.output,
        note: t?.output ? (resultText(lib, t) === x[2] ? "span" : `span, stale: typed ${x[2]}, the model gives ${resultText(lib, t)}`) : `no model ${id}`,
        sentence: sentenceAt(text, x.index!),
      });
    }

  const mask = masked(text);
  for (const x of text.matchAll(NUMBER)) {
    const i = x.index!, typed = x[0];
    if (mask[i]) continue;
    const digits = x[2];
    const before = text.slice(Math.max(0, i - 30), i), after = text.slice(i + typed.length, i + typed.length + 90);
    if (!x[1] && !x[3] && YEAR.test(digits)) continue;
    if (COMPOUND.test(after) || (!x[3] && MAGNITUDE.test(after))) continue;
    if (MONTH.test(before) || /^\s*(?:January|February|March|April|May|June|July|August|September|October|November|December)\b/.test(after)) continue;
    const sentence = sentenceAt(text, i);
    const norm = typed.replace(/^-/, "−");
    const hits = figs.filter((f) => f.text === typed || f.text === norm);
    const years = YEARS_AFTER.test(after);
    const attributed = ATTRIBUTED.test(sentence);
    const named = evaluatorNamed(sentence);
    const add = (c: Omit<Candidate, "start" | "end" | "typed" | "sentence">) => out.push({ start: i, end: i + typed.length, typed, sentence, ...c });

    // The headline: a number in its unit (years of healthy life per $1,000).
    const heads = hits.filter((f) => f.placeholder.startsWith("{{result"));
    if (years && heads.length) {
      // Both views print the same: the sentence's subject decides (an evaluator named: theirs).
      const pick = heads.length > 1 ? heads.find((f) => (named ? f.placeholder === "{{result:evaluator}}" : f.placeholder === "{{result}}"))! : heads[0];
      const unsure = heads.length === 1 && pick.placeholder === "{{result}}" && named && figs.some((f) => f.placeholder === "{{result:evaluator}}");
      const past = HISTORY.test(sentence) || MOVED.test(sentence);
      add({ placeholder: pick.placeholder, what: pick.what, safe: !unsure && !past, note: past ? "what the result was, not what it is" : unsure ? "the sentence names the evaluator but gives our view's figure" : undefined });
      continue;
    }
    // The headline typed with fewer digits ("about 5" for 5.3).
    if (years && HEDGE.test(before) && !hits.length) {
      const n = Number(digits.replace(/,/g, "")) * (x[1].includes("−") || x[1].includes("-") ? -1 : 1);
      const head = figs.find((f) => f.placeholder === "{{result}}");
      const v = Number(head?.text.replace(/[,−]/g, (c) => (c === "−" ? "-" : "")));
      const sd = sigDigits(digits);
      if (head && Number.isFinite(v) && sd < sigDigits(head.text) && Number(v.toPrecision(sd)) === n && !named) {
        add({ placeholder: "{{result}}", what: `the result, rounded (the page shows ${head.text})`, safe: true, coarse: true });
        continue;
      }
    }
    // The headline typed and gone stale: the model's own result at the defaults ("At the defaults it
    // averts about 4.7 years…" where the model now gives 4.6), not a source's, a case or a range's end.
    if (years && !hits.length && STALE_HEAD.test(text.slice(Math.max(0, i - 80), i)) && !named && !attributed && !CONDITIONAL.test(sentence) && !HISTORY.test(sentence) && !RANGE_AFTER.test(after) && !RANGE_BEFORE.test(before)) {
      const head = figs.find((f) => f.placeholder === "{{result}}");
      if (head) { add({ placeholder: "{{result}}", what: `the result, typed stale (the page shows ${head.text})`, safe: true, coarse: true }); continue; }
    }
    // The plausible range: both ends typed in one sentence that says it's the range.
    const ends = hits.filter((f) => f.placeholder === "{{low}}" || f.placeholder === "{{high}}");
    if (ends.length && /\brange\b/i.test(sentence)) {
      const other = ends[0].placeholder === "{{low}}" ? figs.find((f) => f.placeholder === "{{high}}") : figs.find((f) => f.placeholder === "{{low}}");
      const pair = !!other && new RegExp(`(?<![\\d.,])${other.text.replace(/[.$]/g, "\\$&")}(?![\\d]|[.,]\\d)`).test(sentence);
      add({ placeholder: ends[0].placeholder, what: ends[0].what, safe: pair && !named, note: pair ? undefined : "only one end of the range in the sentence" });
      continue;
    }
    // A row's value. In a row's own text, only that row: a number there is the row's or its sources'.
    const rows = hits.filter((f) => f.placeholder.startsWith("{{row:") && (!opts.row || f.row === opts.row));
    if (!rows.length) continue;
    const marked = !!x[1]?.includes("$") || !!x[3];
    const enough = marked || (digits.includes(".") ? sigDigits(digits) >= 2 : digits.replace(/,/g, "").length >= 3);
    const distinct = new Set(rows.map((f) => f.row));
    const f = rows[0];
    const row = m.byId.get(f.row!)!;
    // A number before a noun counts that noun ("100 countries", "50% climate"): the row's only if its label (or id) names it.
    const noun = /^\s+([A-Za-z][A-Za-z'’-]*)/.exec(after)?.[1].toLowerCase();
    const otherUnit = !!noun && !FUNCTION.has(noun) && !stems(`${row.label} ${row.id.replace(/_/g, " ")}`).has(noun.slice(0, 5));
    const clause = text.slice(Math.max(0, i - 70), i).split(/[.;:]\s/).at(-1)!;
    const party = PARTY.exec(clause)?.[1];
    const why = distinct.size > 1 ? `ambiguous: ${[...distinct].join(", ")}`
      : f.input ? "an input: its own figure, usually the source's"
      : !enough ? "too few digits to be sure"
      : attributed || named ? "attributed to a source"
      : POSSESSED.test(before) || (party && !own(party)) ? "somebody's figure, stated as theirs"
      : BOUND.test(before) ? "a bound, not the value"
      : otherUnit ? `a count of something else (${noun})`
      : MOVED.test(sentence) ? "what it was, not what it is"
      : CONDITIONAL.test(sentence) ? "a case, not the value (if, when, would)"
      : HISTORY.test(sentence) ? "an audit round's history"
      : RANGE_AFTER.test(after) || RANGE_BEFORE.test(before) ? "one end of a range"
      : !opts.row && !mentions(sentence, row.label) ? "the sentence doesn't name the row"
      : undefined;
    add({ placeholder: f.placeholder, what: f.what, safe: !why, note: why });
  }
  return out.sort((a, b) => a.start - b.start);
}

/** A text with the safe candidates replaced by their placeholders. */
export function applyCandidates(text: string, cs: Candidate[]): string {
  let out = "", at = 0;
  for (const c of cs.filter((c) => c.safe).sort((a, b) => a.start - b.start)) {
    if (c.start < at) continue;
    out += text.slice(at, c.start) + c.placeholder;
    at = c.end;
  }
  return out + text.slice(at);
}

export type ProseFinding = { severity: "high" | "medium" | "low"; field: string; message: string };

/** What a model's prose types that the model should print. High: a placeholder that names nothing, or
 * a write-up that types the headline (`{{result}}` renders it and can't go stale). Medium: a model's own
 * text typing the headline, or a write-up typing another of the model's figures exactly. */
export function checkProseNumbers(modelId: string, lib: Library = siteLibrary()): ProseFinding[] {
  const m = lib.models.get(modelId);
  if (!m) return [{ severity: "high", field: "model", message: `no model ${modelId}` }];
  const out: ProseFinding[] = [];
  const texts: [field: string, text: string, writeup: boolean][] = [];
  // The model's own text, as its file has it (the site's library holds it rendered, and a variant's
  // inherited text is its parent's to check).
  const file = modelFile(modelId);
  if (file) for (const f of textFields(JSON.parse(readFileSync(file, "utf8")))) texts.push([f.key, f.get() ?? "", false]);
  const wp = writeupPath(modelId);
  if (existsSync(wp)) texts.push([`writeups/${modelId}.md`, readFileSync(wp, "utf8"), true]);
  for (const [field, text, writeup] of texts) {
    if (!text) continue;
    for (const e of placeholderErrors(lib, m, text)) out.push({ severity: "high", field, message: `${e} (docs/prose-numbers.md)` });
    if (!m.output || m.kind === "template") continue;
    for (const c of scanText(lib, m, text, { writeup, row: ownRow(field) })) {
      const shown = c.typed.replace(/<[^>]+>/g, "");
      if (c.placeholder.startsWith("{{result") && (c.safe || c.coarse))
        out.push({ severity: writeup ? "high" : "medium", field, message: `types ${c.what} as "${shown}": write ${c.placeholder}, which renders it from the model (npx tsx scripts/prose-numbers.ts --apply ${modelId})` });
      else if (c.safe) out.push({ severity: "low", field, message: `types ${c.what} as "${shown}": ${c.placeholder} renders it from the model` });
    }
  }
  return out;
}

/** The row whose own text a field is (its explainer or range note), if any. */
export const ownRow = (field: string) => (/^[a-z][a-z0-9_]*\.(?:explainer|range\.note)$/.test(field) ? field.split(".")[0] : undefined);

/** A model's file: models/<cause>/<id>.json, or models/grants/<owner>/<id>.json. */
export function modelFile(id: string): string | undefined {
  return siteFiles().get(id);
}
let files: Map<string, string> | undefined;
function siteFiles(): Map<string, string> {
  if (!files) {
    const root = repoRoot();
    files = new Map(walk(join(root, "models")).map((p) => [p.slice(p.lastIndexOf("/") + 1, -".json".length), p]));
  }
  return files;
}
