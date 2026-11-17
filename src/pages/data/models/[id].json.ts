// /data/models/<id>.json: one published model in full: every row with its value, range, kind, source,
// explainer and value at the defaults, the headline, plausible range, top drivers and licence.
import type { APIRoute } from "astro";
import { lib, rankable } from "../../../lib/data";
import { modelJson, json } from "../../../lib/open-data";

export function getStaticPaths() {
  return rankable.map((m) => ({ params: { id: m.id } }));
}

export const GET: APIRoute = ({ params }) => json(modelJson(lib.models.get(params.id!)!));
