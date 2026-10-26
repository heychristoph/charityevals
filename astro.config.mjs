import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";
import react from "@astrojs/react";

// The history pages read git from the repository root, wherever the build is started from.
const repoRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  site: "https://charityevals.org",
  integrations: [react()],
  devToolbar: { enabled: false },
  vite: { define: { __REPO_ROOT__: JSON.stringify(repoRoot) } },
});
