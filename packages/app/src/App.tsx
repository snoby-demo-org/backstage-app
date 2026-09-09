import { createApp } from '@backstage/frontend-defaults';
import { createFrontendPlugin } from '@backstage/frontend-plugin-api';
import catalogPlugin from '@backstage/plugin-catalog/alpha';
import { convertLegacyEntityContentExtension } from '@backstage/plugin-catalog-react/alpha';
import {
  EntityGithubActionsContent,
  isGithubActionsAvailable,
} from '@backstage/plugin-github-actions';
import { navModule } from './modules/nav';
import { homeModule } from './modules/home';

/**
 * The github-actions plugin (0.6.x) is a legacy v1 frontend-plugin with no
 * `/alpha` export, so v2 feature discovery won't pick it up automatically.
 * Bridge its entity content extension into the v2 frontend system and gate it
 * with isGithubActionsAvailable (requires github.com/project-slug annotation).
 */
const githubActionsPlugin = createFrontendPlugin({
  pluginId: 'github-actions',
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
