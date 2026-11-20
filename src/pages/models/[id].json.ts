// /models/<id>.json: a summarised model's full file. The browser only carries summaries of these
// (lib/browser-models.ts), so a model's page, or a programme opened on a charity's page, loads it from here.
import type { APIRoute } from "astro";
import { lib, fullRaw, summarised } from "../../lib/data";

export function getStaticPaths() {
  return [...lib.models.values()].filter((m) => summarised(m)).map((m) => ({ params: { id: m.id } }));
}

export const GET: APIRoute = ({ params }) =>
  new Response(JSON.stringify(fullRaw(params.id!)), { headers: { "Content-Type": "application/json" } });
