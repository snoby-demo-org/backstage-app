---
site_name: backstage-app
---

# backstage-app

Custom-built [Backstage](https://backstage.io) developer portal for the viporlab homelab.

## Plugins

- **TechDocs** — per-entity runbooks rendered + searchable
- **GitHub Actions** — CI/build status on entities
- **GitHub Insights** — contributors, languages, releases
- **Catalog Graph** — entity dependency map

## Local Development

```bash
yarn install
yarn dev
```

## Build

```bash
docker build . -f packages/backend/Dockerfile -t ghcr.io/snoby-demo-org/backstage-app:latest
```

## Deployment

Deployed via Flux GitOps on the homelab k3s cluster at `backstage.viporlab.net`.
