import type { ResolvedRow } from "../engine/model";

/** Two significant figures: the inputs are rarely known better than that, and more digits only
 * suggest they are (48,715 reads as 49,000; 116.253 as 120). */
export const SIG = 2;

const sig = (x: number, digits = SIG) => {
  if (!Number.isFinite(x)) return "—";
  if (x === 0) return "0";
  const abs = Math.abs(x);
  if (abs >= 1e9) return `${Number((x / 1e9).toPrecision(digits))}B`;
  if (abs >= 1e6) return `${Number((x / 1e6).toPrecision(digits))}M`;
  return Number(x.toPrecision(digits)).toLocaleString("en-US");
};

export function formatValue(x: number, format: ResolvedRow["format"] = "number"): string {
  if (!Number.isFinite(x)) return "—";
  switch (format) {
    case "percent": return `${Number((x * 100).toPrecision(SIG))}%`;
    case "usd": return `$${sig(x)}`;
    case "integer": return Math.round(x).toLocaleString("en-US");
    case "multiple": return `${Number(x.toPrecision(SIG))}×`;
    case "small": return x.toExponential(SIG - 1).replace("e-", " × 10⁻").replace(/(\d)$/, "$1").replace(/⁻(\d+)/, (_, d) => "⁻" + [...d].map((c: string) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[+c]).join(""));
    default: return sig(x);
  }
}

/** A shared assumption's value as it reads on screen: some are multipliers shown in the site's own
 * terms (`shown_as`), the same wherever they appear. */
export function formatAssumption(row: { format?: ResolvedRow["format"]; shown_as?: { factor: number; format?: ResolvedRow["format"] } }, v: number): string {
  return formatValue(v * (row.shown_as?.factor ?? 1), row.shown_as?.format ?? row.format);
}

/** Years of healthy life per $1,000, readable across five orders of magnitude, to about two
 * significant figures (24, 4.4, 910). */
export function formatYears(x: number): string {
  if (!Number.isFinite(x)) return "—";
  if (x >= 100) return Number(x.toPrecision(SIG)).toLocaleString("en-US");
  if (x >= 10) return x.toFixed(0);
  if (x >= 1) return x.toFixed(1);
  return x.toPrecision(2);
}

/** Dollars per year of healthy life, from years per $1,000. */
export function formatCostPerYear(x: number): string {
  if (!Number.isFinite(x) || x <= 0) return "—";
  const usd = 1000 / x;
  return `$${usd >= 100 ? Math.round(usd).toLocaleString("en-US") : usd >= 1 ? usd.toPrecision(2) : usd.toFixed(2)}`;
}

/** Typed values, in the units the value is shown in (percent as 4 for 4%), may go past the slider's
 * ends; the slider then sits at its end. Negative values never make sense here, and a log-scale
 * value must stay above zero. */
export function parseTyped(text: string, format: ResolvedRow["format"], log: boolean): number | undefined {
  const n = Number(text.replace(/[%×x,\s]/gi, ""));
  if (!text.trim() || !Number.isFinite(n)) return undefined;
  const v = format === "percent" ? n / 100 : n;
  return v < 0 || (log && v === 0) ? undefined : v;
}

/** A reader's typed value for one of a model's numbers, in its terms: "35%" is 0.35, "$1,200" is 1200. */
export function parseEdit(text: string, format?: ResolvedRow["format"]): number | undefined {
  const n = Number(text.replace(/[$%×x,\s]/gi, ""));
  if (!text.trim() || !Number.isFinite(n)) return undefined;
  return format === "percent" ? n / 100 : n;
}

/** A value as typed into a field: the number shown, without its unit signs ("1.7" for 1.7%,
 * "49000" for 49,000). Seeding a field with it means an unchanged field reads as it looks. */
export function editText(x: number, format: ResolvedRow["format"] = "number"): string {
  if (!Number.isFinite(x)) return "";
  const shown = format === "percent" ? x * 100 : x;
  if (format === "integer") return String(Math.round(shown));
  return String(Number(shown.toPrecision(SIG)));
}

/** A model's name in plain words: evaluators' file names carry spreadsheet jargon ("CEA", "BOTEC",
 * version numbers, "[June 2024]") that means nothing to most readers. Two models' plain names can be
 * the same (versions 1 and 2), so lists show them with their date or evaluator. */
export function plainModelName(name: string): string {
  const s = name
    .replace(/\s*\(CEA\)/g, "")
    .replace(/_/g, " ")
    // A date in brackets reads as a date: "[July 2024]" → ", July 2024".
    .replace(/\s*\[((?:(?:\w+ )?(?:\d{1,2}, )?)?(?:19|20)\d\d)\]/g, ", $1")
    .replace(/(?<![A-Za-z])BOTECs(?![A-Za-z])/g, "rough estimates")
    .replace(/(?<![A-Za-z])BOTEC(?![A-Za-z])/g, "rough estimate")
    .replace(/(?<![A-Za-z])CEA(?![A-Za-z])/g, "cost-effectiveness analysis")
    .replace(/,?\s*\(?\b(?:version|ver\.?|v)\s?\d+(?:\.\d+)*\)?/gi, "")
    // A dash left with nothing after it but a bracket ("— (Ondo grant…)" once the version is gone).
    .replace(/\s+[—–-]\s*(?=[([]|$)/g, " ")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,)\]])/g, "$1")
    .trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}
