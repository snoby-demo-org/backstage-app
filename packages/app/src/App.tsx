import { createApp } from '@backstage/frontend-defaults';
import catalogPlugin from '@backstage/plugin-catalog/alpha';
import { convertLegacyPlugin } from '@backstage/core-compat-api';
import { convertLegacyEntityContentExtension } from '@backstage/plugin-catalog-react/alpha';
import {
  githubActionsPlugin as legacyGithubActionsPlugin,
  EntityGithubActionsContent,
  isGithubActionsAvailable,
} from '@backstage/plugin-github-actions';
import { navModule } from './modules/nav';
import { homeModule } from './modules/home';

/**
 * The github-actions plugin (0.6.x) is a legacy v1 frontend-plugin with no
 * `/alpha` export, so v2 feature discovery won't pick it up automatically.
 * convertLegacyPlugin preserves BOTH the legacy plugin's API factories
 * (githubActionsApiRef -> plugin.githubactions.service implementation) AND
 * lets us supply the entity content extension, gated by
 * isGithubActionsAvailable (requires github.com/project-slug annotation).
 */
const githubActionsPlugin = convertLegacyPlugin(legacyGithubActionsPlugin, {
  extensions: [
    convertLegacyEntityContentExtension(EntityGithubActionsContent, {
      name: 'github-actions',
      title: 'GitHub Actions',
      path: '/github-actions',
      filter: isGithubActionsAvailable,
    }),
  ],
});

export default createApp({
  features: [
    catalogPlugin,
    githubActionsPlugin,
    navModule,
    homeModule,
  ],
});
