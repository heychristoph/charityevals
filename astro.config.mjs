import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { lastmodFor } from "./scripts/sitemap-lastmod.mjs";

// The history pages read git from the repository root, wherever the build is started from.
const repoRoot = fileURLToPath(new URL(".", import.meta.url));
const lastmod = lastmodFor(repoRoot);

export default defineConfig({
  site: "https://charityevals.org",
  // URLs have no trailing slash: /about is built as about.html, which Cloudflare serves at /about
  // directly (and redirects /about/ to it). With directories (about/index.html) every link to /about
  // took a redirect first.
  trailingSlash: "never",
  build: { format: "file" },
  integrations: [
    react(),
    {
      name: "charityevals:client-model",
      hooks: {
        "astro:config:setup": ({ addClientDirective }) =>
          addClientDirective({ name: "model", entrypoint: fileURLToPath(new URL("./src/lib/model-directive.ts", import.meta.url)) }),
      },
    },
    sitemap({
      // The 404 page, and the history pages (noindex: tables rebuilt from git, little to search for).
      filter: (page) => !/\/(404|assumptions)\/?$/.test(page) && !/\/history\/?$/.test(page),
      serialize: (item) => {
        const date = lastmod(item.url);
        return date ? { ...item, lastmod: date } : item;
      },
    }),
  ],
  devToolbar: { enabled: false },
  vite: { define: { __REPO_ROOT__: JSON.stringify(repoRoot) } },
});
