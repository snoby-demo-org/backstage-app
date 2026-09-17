/**
 * Type declaration for the published loki plugin's /alpha subpath.
 *
 * The published package's `exports["./alpha"]` points to `dist/alpha.esm.js`
 * (string), and TypeScript won't route the subpath to `dist/alpha.d.ts` via
 * `typesVersions` when `exports` is present (TS7016: implicitly 'any'). This
 * ambient module re-exposes the real default export type so `App.tsx`'s
 * `import lokiPlugin from '@snoby-demo-org/backstage-plugin-loki/alpha'`
 * typechecks without losing the typed plugin surface.
 */
declare module '@snoby-demo-org/backstage-plugin-loki/alpha' {
  import type { OverridableFrontendPlugin } from '@backstage/frontend-plugin-api';
  const _default: OverridableFrontendPlugin<
    Record<string, never>,
    Record<string, never>,
    Record<string, never>
  >;
  export default _default;
}
