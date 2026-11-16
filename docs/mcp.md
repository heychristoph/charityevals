# The MCP server (/mcp)

A public, read-only MCP server for AI assistants (Streamable HTTP, no sign-in), served by the Worker
(`worker/mcp/`). The `/ai` page explains it to users.

## What it answers from

The build writes these files (`src/lib/mcp-data.ts`):

- `/data/mcp-results.json`: the catalogue (names, causes, pages, licences, the shared assumptions)
  and every figure at the defaults and under every value set in `assumptions/default.json`.
  Calls at the defaults or a value set read only this file. A fresh isolate answers in about 10 ms
  of CPU.
- `/data/mcp/<id>.json`: get_model's answer for each model and charity.
- `/data/mcp-library.json`: the library without the text no answer quotes. Only calls with custom
  values load it and compute. That takes about 1.5 s of CPU in a fresh isolate, and a few ms for
  a repeat (the last 8 are kept per isolate).

Tests check that the stored answers are the computed ones (`worker/mcp/*.test.ts`).

## Limits

- **Per IP**: 120 calls a minute (`MCP_LIMITER`, a Rate Limiting binding in `wrangler.jsonc`).
- **Custom values, globally**: 20,000 new calculations a day, UTC (`DAILY_CUSTOM` in
  `worker/mcp/budget.ts`). One Durable Object (`McpBudget`, binding `MCP_BUDGET`) counts them for
  every isolate. Past the cap, calls with custom values get an error that names the value sets.
  The defaults and value sets keep working. If the counter can't be reached, custom values are
  refused.
- **CPU**: 5 s per request (`limits.cpu_ms`; needs Workers Paid).
- **Size**: requests up to 64 KB, answers up to 120 KB, batches up to 20 messages.

## Owner step: an edge rate limit (dashboard)

The Worker's own limit runs after the Worker starts. A WAF rule stops floods before that. It needs
the dashboard (or an API token with zone WAF edit rights), so it isn't in the repo:

1. Cloudflare dashboard → charityevals.org → **Security** → **WAF** → **Rate limiting rules** →
   **Create rule**.
2. Name: `MCP flood`.
3. If incoming requests match, choose **Edit expression** and paste:
   `(http.request.uri.path in {"/mcp" "/mcp/"} and http.request.method eq "POST")`
4. With the same characteristics: **IP**.
5. When rate exceeds: **60** requests per **10 seconds**. The Free plan allows only a 10-second
   period and one rule.
6. Then take action: **Block**, for **10 seconds** (the Free plan's duration).
7. **Deploy**.

To check it: Security → Events, filtered on the rule's name.
