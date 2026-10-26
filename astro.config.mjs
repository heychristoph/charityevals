import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

// The history pages read git from the repository root, wherever the build is started from.
const repoRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  site: "https://charityevals.org",
  integrations: [react(), sitemap({ filter: (page) => !page.endsWith("/404/") })],
  devToolbar: { enabled: false },
  vite: { define: { __REPO_ROOT__: JSON.stringify(repoRoot) } },
});
