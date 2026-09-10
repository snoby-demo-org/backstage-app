import { createApp } from '@backstage/frontend-defaults';
import catalogPlugin from '@backstage/plugin-catalog/alpha';
import lokiPlugin from '@snoby-demo-org/backstage-plugin-loki/alpha';
import { convertLegacyPlugin } from '@backstage/core-compat-api';
import { EntityContentBlueprint } from '@backstage/plugin-catalog-react/alpha';
import {
  githubActionsPlugin as legacyGithubActionsPlugin,
  isGithubActionsAvailable,
} from '@backstage/plugin-github-actions';
import { navModule } from './modules/nav';
import { homeModule } from './modules/home';

/**
 * Custom "Builds" entity tab for GitHub Actions.
 *
 * The default plugin renders a sparse 3-column table (Commit Message/Branch/
 * Status) with no workflow name, run number, or timestamps. We replace it with
 * a richer table (Workflow / Run # / Branch / Commit / Status / Started /
 * Duration) rendered from the SAME GithubActionsClient that the legacy plugin
 * registers. We still use convertLegacyPlugin(legacyGithubActionsPlugin) so the
 * githubActionsApiRef implementation (plugin.githubactions.service) is
 * preserved for useApi() to resolve.
 */
const githubActionsContent = EntityContentBlueprint.make({
  name: 'builds',
  params: {
    path: '/builds',
    title: 'Builds',
    filter: isGithubActionsAvailable,
    loader: async () => {
      const { GithubActionsTab } = await import('./components/GithubActionsTab');
      return <GithubActionsTab />;
    },
  },
});

const githubActionsPlugin = convertLegacyPlugin(legacyGithubActionsPlugin, {
  extensions: [githubActionsContent],
});

export default createApp({
  features: [
    catalogPlugin,
    githubActionsPlugin,
    lokiPlugin,
    navModule,
    homeModule,
  ],
});
