// /data/models.json: every published model's headline, range and licence, with links (src/lib/open-data.ts).
import type { APIRoute } from "astro";
import { modelsJson, json } from "../../lib/open-data";

export const GET: APIRoute = () => json(modelsJson());
