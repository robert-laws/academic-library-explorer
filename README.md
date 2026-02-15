# Academic Library Explorer
[![Build and Publish](https://github.com/robert-laws/academic-library-explorer/actions/workflows/gh-pages.yml/badge.svg)](https://github.com/robert-laws/academic-library-explorer/actions/workflows/gh-pages.yml)
[![Build and Publish (main)](https://github.com/robert-laws/academic-library-explorer/actions/workflows/gh-pages.yml/badge.svg?branch=main)](https://github.com/robert-laws/academic-library-explorer/actions/workflows/gh-pages.yml?query=branch%3Amain)

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

## GitHub Pages deployment

This repository uses GitHub Actions to publish the generated `dist/` output from `.github/workflows/gh-pages.yml`.

### First-time Pages setup (GitHub UI)

1. In GitHub, open `Settings → Pages`.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Confirm the Pages URL after the first successful workflow run.

### First-time Pages setup (GitHub CLI)

> Requires authenticated `gh` and network access from your machine:

```bash
gh api repos/robert-laws/academic-library-explorer/pages \
  -f 'source[branch]=main' \
  -f 'source[path]=/' \
  -X PUT
```

### Deployment verification

```bash
git push
gh run list --workflow=gh-pages.yml --limit 5
gh api repos/robert-laws/academic-library-explorer/pages
```

Your site URL appears in the final `gh api .../pages` response as `html_url`.

If you run separate quality or lint workflows, add matching badges by replacing `gh-pages.yml` with that workflow filename.

### Post-activation quick checks

```bash
gh run list --workflow=gh-pages.yml --branch=main --limit 3
gh run view --log
```

Open the Pages URL from `gh api repos/robert-laws/academic-library-explorer/pages` and verify the homepage renders.

## Branching

Use:
- `main`: deployable source
- `feature/*`: topic and issue changes

## License

This project is licensed under the [MIT License](./LICENSE).
