// /data/facts.json: the shared facts (data and fixed judgments) the models read, with their sources.
import type { APIRoute } from "astro";
import { factsJson, json } from "../../lib/open-data";

export const GET: APIRoute = () => json(factsJson());
