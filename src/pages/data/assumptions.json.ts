// /data/assumptions.json: the shared assumptions every model reads, with their defaults and ranges.
import type { APIRoute } from "astro";
import { assumptionsJson, json } from "../../lib/open-data";

export const GET: APIRoute = () => json(assumptionsJson());
