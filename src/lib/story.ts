// A model's story (`story` in its file): live numbers written into plain words. `{expr}` is an expression
// over the model's rows and `result` (years of healthy life per $1,000); `|$`, `|%` and `|y` format it.
import { storyValue } from "../engine/story";
import { formatValue } from "./format";

export { storyValue };

/** `expr|fmt` read and formatted; `years` formats a value in years of healthy life per $1,000. */
export function storyNumber(spec: string, values: Record<string, number>, result: number, years: (x: number) => string): string {
  const [src, fmt] = spec.split("|").map((s) => s.trim());
  const x = storyValue(src, values, result);
  if (fmt === "$") return formatValue(x, "usd");
  if (fmt === "%") return formatValue(x, "percent");
  if (fmt === "y") return years(x);
  return formatValue(x, "number");
}

/** A template with every `{…}` filled in. */
export function fillStory(text: string, values: Record<string, number>, result: number, years: (x: number) => string): string {
  return text.replace(/\{([^}]+)\}/g, (_, spec: string) => storyNumber(spec, values, result, years));
}

/** Every expression a story reads, for checks. */
export function storyExpressions(story: { sentence: string; steps: { total?: string; op?: string; text: string }[] }): string[] {
  const inner = (t: string) => [...t.matchAll(/\{([^}]+)\}/g)].map((m) => m[1].split("|")[0].trim());
  return [
    ...inner(story.sentence),
    ...story.steps.flatMap((s) => [...(s.total ? [s.total.split("|")[0].trim()] : []), ...inner(s.op ?? ""), ...inner(s.text)]),
  ];
}
