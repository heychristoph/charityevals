// /models/<id>.json: a model's full file. The browser carries most models only as summaries
// (lib/browser-models.ts), so a model's page, or a programme opened on a charity's page, loads it from here.
import type { APIRoute } from "astro";
import { lib, fullRaw } from "../../lib/data";

export function getStaticPaths() {
  // Every model with a page: each page's islands hydrate through client:model (lib/model-directive.ts).
  return [...lib.models.values()].filter((m) => m.kind !== "template").map((m) => ({ params: { id: m.id } }));
}

export const GET: APIRoute = ({ params }) =>
  new Response(JSON.stringify(fullRaw(params.id!)), { headers: { "Content-Type": "application/json" } });
