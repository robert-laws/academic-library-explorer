# Academic Library Explorer

A static knowledge portal discussing contemporary academic library topics for information professionals.

## Quick start

```bash
npm run build
```

This command:
- parses markdown files from `content/topics` and `content/briefs`
- validates required metadata
- builds HTML pages into `dist/`
- runs internal link checks

## Content model

All content is authored in markdown with YAML-like front matter.

Required fields:
- `title`
- `slug`
- `summary`
- `topics`
- `audience`
- `status`
- `published`
- `last_updated`
- `references`

Example front matter:

```md
---
title: Open Access and Scholarly Communication
slug: open-access-scholarship
topics: Open Access, Scholarly Communication, Policy
audience: academic librarians, repository managers
status: published
published: 2026-01-05
last_updated: 2026-02-10
references:
  - [Open Access Overview](https://sparcopen.org)
  - [Plan S](https://www.coalition-s.org)
---
```

## GitHub setup

Repository is intended for GitHub Pages deployment.

1. Push content to `main`.
2. GitHub Actions runs build validation.
3. `dist/` is published via `actions/deploy-pages`.

Set `siteUrl` in `site.config.js` to your Pages origin (for example `https://YOUR_GITHUB_USER.github.io/academic-library-explorer`) before first deploy to generate an accurate sitemap.

To connect a remote repository:

```bash
git remote add origin git@github.com:<your-org>/academic-library-explorer.git
git push -u origin main
``` 

## Branching

Use:
- `main`: deployable source
- `feature/*`: topic and issue changes

## License

MIT-style placeholder for internal use.
