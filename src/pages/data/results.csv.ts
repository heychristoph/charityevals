// /data/results.csv: one row per published model, its headline and plausible range at the defaults.
import type { APIRoute } from "astro";
import { resultsCsv } from "../../lib/open-data";

export const GET: APIRoute = () => new Response(resultsCsv(), { headers: { "Content-Type": "text/csv; charset=utf-8" } });
