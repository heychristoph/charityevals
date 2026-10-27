/// <reference types="astro/client" />

/** Absolute path of the repository root, set in astro.config.mjs. */
declare const __REPO_ROOT__: string;

/** Bulk models' full files, fetched by the client:model directive before hydration (lib/model-directive.ts). */
declare var __charityevalsModels: Record<string, unknown> | undefined;

declare namespace Astro {
  interface ClientDirectives {
    /** Hydrate once /models/<id>.json has loaded: client:model={id}. */
    "client:model"?: string;
  }
}
