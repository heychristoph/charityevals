// Renders the placeholders in a write-up (writeups/<model id>.md) from that model at build time
// (docs/prose-numbers.md): `{{result}}` becomes the figure span the page keeps in step with the reader's
// values (src/components/Headline.tsx), the rest plain text. A placeholder that names nothing fails the build.
// A Vite transform on the compiled write-up: Markdown leaves `{{…}}` as text, so it is still there to replace.
import { PLACEHOLDER, renderText } from "../engine/prose";
import { siteLibrary } from "../engine/prose-numbers";

export function proseNumbers() {
  return {
    name: "charityevals:prose-numbers",
    transform(code: string, id: string) {
      const file = /[/\\]writeups[/\\]([^/\\?]+)\.md$/.exec(id);
      if (!file || !code.includes("{{")) return;
      const lib = siteLibrary();
      const m = lib.models.get(file[1]);
      return code.replace(PLACEHOLDER, (all) => {
        try {
          if (!m) throw new Error(`no model ${file[1]} to read it from`);
          // Inside the module's JSON string literals.
          return JSON.stringify(renderText(lib, m, all, true)).slice(1, -1);
        } catch (e) {
          throw new Error(`writeups/${file[1]}.md: ${(e as Error).message} (docs/prose-numbers.md)`);
        }
      });
    },
  };
}
