import { createApp } from '@backstage/frontend-defaults';
import catalogPlugin from '@backstage/plugin-catalog/alpha';
import { convertLegacyPlugin } from '@backstage/core-compat-api';
import { EntityContentBlueprint } from '@backstage/plugin-catalog-react/alpha';
import {
  githubActionsPlugin as legacyGithubActionsPlugin,
  isGithubActionsAvailable,
} from '@backstage/plugin-github-actions';
import { navModule } from './modules/nav';
import { homeModule } from './modules/home';

/**
 * GitHub Actions entity tab.
 *
 * Renders the FULL official plugin component (EntityGithubActionsContent) so we
 * get the complete drill-down: workflow runs -> jobs -> individual job steps
 * with per-step logs. We keep convertLegacyPlugin(legacyGithubActionsPlugin) so
 * the githubActionsApiRef implementation (plugin.githubactions.service) is
 * preserved. The custom builds tab path/title is kept for continuity.
 */
const githubActionsContent = EntityContentBlueprint.make({
  name: 'builds',
  params: {
    path: '/builds',
    title: 'Builds',
    filter: isGithubActionsAvailable,
    loader: async () => {
      const { EntityGithubActionsContent } = await import('@backstage/plugin-github-actions');
      return <EntityGithubActionsContent />;
    },
  },
});

const githubActionsPlugin = convertLegacyPlugin(legacyGithubActionsPlugin, {
  extensions: [githubActionsContent],
});

export default createApp({
  features: [catalogPlugin, githubActionsPlugin, navModule, homeModule],
});
