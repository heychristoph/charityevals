// /data/library.json: the inputs of buildLibrary, for rebuilding the site's models elsewhere (the MCP
// server reads it). See libraryJson in src/lib/open-data.ts.
import type { APIRoute } from "astro";
import { libraryJson, json } from "../../lib/open-data";

export const GET: APIRoute = () => json(libraryJson());
