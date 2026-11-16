// /llms-full.txt: every charity's models in plain text (summary, result, range, top drivers, sources),
// for language models; /llms.txt is the short map. Built from the same library as the pages.
import type { APIRoute } from "astro";
import { llmsFull } from "../lib/open-data";

export const GET: APIRoute = () => new Response(llmsFull(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
