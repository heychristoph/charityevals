// /llms.txt (llmstxt.org): a plain-text map of the site for language models and other readers that
// don't run the page's JavaScript. Generated from the same models as the pages.
import type { APIRoute } from "astro";
import { lib, modelUrl, primaryOf, rankable } from "../lib/data";
import { modelsOf } from "../engine/model";
import { abs, defaultMultiple } from "../lib/seo";
import { formatMultiple } from "../lib/format";
import { repo } from "../lib/site";

const CAUSES = [["global-health", "Global health"], ["animal-welfare", "Animal welfare"], ["ai-safety", "AI safety"]] as const;

export const GET: APIRoute = () => {
  const charities = [...lib.charities.values()].filter((c) => primaryOf(lib, c.id));
  const line = (id: string) => {
    const c = lib.charities.get(id)!;
    const models = modelsOf(lib, id);
    const m = primaryOf(lib, id)!;
    const x = defaultMultiple(m);
    const owners = [...new Set(models.map((x) => lib.owners.get(x.owner)!.name))].join(", ");
    const figure = x !== undefined ? `${formatMultiple(x)} as much good per dollar as GiveDirectly (default assumptions)` : `measured in ${lib.assumptions.units[m.output!.unit].label} per dollar`;
    return `- [${c.name}](${abs(modelUrl(lib, m))}): ${figure} in ${lib.owners.get(m.owner)!.name}'s model; ${models.length > 1 ? `${models.length} models` : "modelled"} by ${owners}`;
  };
  const sections = CAUSES.map(([cause, title]) => {
    const list = charities.filter((c) => c.cause === cause).sort((a, b) => a.name.localeCompare(b.name));
    return list.length ? `## ${title}\n\n${list.map((c) => line(c.id)).join("\n")}` : "";
  }).filter(Boolean);
  const variants = rankable.filter((m) => primaryOf(lib, m.charity)?.id !== m.id);

  const body = `# charityevals

> Open cost-effectiveness analyses (CEAs) of charities. Each model re-implements a published evaluator's analysis (GiveWell, Animal Charity Evaluators, Happier Lives Institute) or is charityevals' own where none exists. Every input has a source, a low/best/high range, a kind (observed, estimate or judgment) and an explanation. Visitors can change the shared assumptions (moral weights, exchange rates between causes) and every model recomputes.

Results are given as a multiple of GiveDirectly's cash transfers per dollar ("× GiveDirectly"), on the site's default assumptions; each page shows the plausible range and what drives it. The evaluators have not reviewed or endorsed this site. Estimates are for research, not financial advice.

## Key pages

- [Rankings](${abs("/")}): every charity, ranked by good done per dollar, re-ranked live by your assumptions
- [Shared assumptions](${abs("/assumptions")}): the moral weights, exchange rates and shared facts every model reads
- [Method](${abs("/method")}): how models are built, checked against their sources, and compared across causes
- [About](${abs("/about")}): who runs the site and how to contribute
- [Source code and model files](${repo}): every model is a JSON file in a public git repository

${sections.join("\n\n")}

## Optional

Other evaluators' models of the same charities, older versions, and country or program variants:

${variants.map((m) => `- [${m.name}, ${lib.owners.get(m.owner)!.name}](${abs(modelUrl(lib, m))})`).join("\n")}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
