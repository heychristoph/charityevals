// /fact-text.json: the shared facts' text (explainers and sources, lib/browser-models.ts FACT_TEXT),
// rendered, by fact key. The browser's copy of the facts leaves it out; a model's page fetches this once
// before its tree hydrates (lib/model-directive.ts), and the browser keeps it cached across pages.
import type { APIRoute } from "astro";
import { lib } from "../lib/data";
import { FACT_TEXT } from "../lib/browser-models";

export const GET: APIRoute = () => {
  const text: Record<string, Record<string, unknown>> = {};
  for (const [key, f] of lib.facts) {
    const t = Object.fromEntries(FACT_TEXT.flatMap((k) => ((f as Record<string, unknown>)[k] !== undefined ? [[k, (f as Record<string, unknown>)[k]]] : [])));
    if (Object.keys(t).length) text[key] = t;
  }
  return new Response(JSON.stringify(text), { headers: { "Content-Type": "application/json" } });
};
