import type { ResolvedRow } from "../engine/model";

const sig = (x: number, digits = 3) => {
  if (!Number.isFinite(x)) return "—";
  if (x === 0) return "0";
  const abs = Math.abs(x);
  if (abs >= 1e9) return `${(x / 1e9).toPrecision(digits)}B`;
  if (abs >= 1e6) return `${(x / 1e6).toPrecision(digits)}M`;
  if (abs >= 1000) return Math.round(x).toLocaleString("en-US");
  if (abs >= 1) return Number(x.toPrecision(digits)).toLocaleString("en-US");
  return Number(x.toPrecision(digits)).toString();
};

export function formatValue(x: number, format: ResolvedRow["format"] = "number"): string {
  if (!Number.isFinite(x)) return "—";
  switch (format) {
    case "percent": return `${Number((x * 100).toPrecision(3))}%`;
    case "usd": return `$${sig(x)}`;
    case "integer": return Math.round(x).toLocaleString("en-US");
    case "multiple": return `${Number(x.toPrecision(3))}×`;
    case "small": return x.toExponential(2).replace("e-", " × 10⁻").replace(/(\d)$/, "$1").replace(/⁻(\d+)/, (_, d) => "⁻" + [...d].map((c: string) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[+c]).join(""));
    default: return sig(x);
  }
}

/** Multiples of the benchmark, readable across five orders of magnitude. */
export function formatMultiple(x: number): string {
  if (!Number.isFinite(x)) return "—";
  if (x >= 100) return `${Math.round(x).toLocaleString("en-US")}×`;
  if (x >= 10) return `${x.toFixed(0)}×`;
  if (x >= 1) return `${x.toFixed(1)}×`;
  return `${x.toPrecision(2)}×`;
}
