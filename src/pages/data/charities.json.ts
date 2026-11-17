// /data/charities.json: every charity with a published model (src/lib/open-data.ts).
import type { APIRoute } from "astro";
import { charitiesJson, json } from "../../lib/open-data";

export const GET: APIRoute = () => json(charitiesJson());
