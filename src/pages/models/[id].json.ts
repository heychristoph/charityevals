// /models/<id>.json: a bulk-imported model's full file. The browser only carries summaries of these
// (see lib/data.ts), so a page that switches to another evaluator's bulk model loads it from here.
import type { APIRoute } from "astro";
import { lib, bulkRaw } from "../../lib/data";

export function getStaticPaths() {
  return [...lib.models.values()].filter((m) => m.bulk).map((m) => ({ params: { id: m.id } }));
}

export const GET: APIRoute = ({ params }) =>
  new Response(JSON.stringify(bulkRaw(params.id!)), { headers: { "Content-Type": "application/json" } });
