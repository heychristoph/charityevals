// A Worker of its own (redirect.wrangler.jsonc) on charityevals.com and www.charityevals.com: every
// request there is sent, permanently, to the same path on charityevals.org.

const CANONICAL = "charityevals.org";

export function redirectTarget(url: string): string {
  const u = new URL(url);
  u.protocol = "https:";
  u.hostname = CANONICAL;
  u.port = "";
  return u.toString();
}

export default {
  fetch(request: Request): Response {
    return new Response(null, { status: 301, headers: { Location: redirectTarget(request.url), "Cache-Control": "public, max-age=86400" } });
  },
};
