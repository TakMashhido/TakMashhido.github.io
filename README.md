# koustav.isroot.in

Personal research portfolio of Koustav Kumar Mondal. Built with Astro, a claymorphism design, and a Markdown blog.

## Run locally

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # output in dist/
```

## Where things live

| What | File |
|---|---|
| Name, headline, email, social links, contact-form key | `src/data/site.ts` |
| Bio, education, experience, skills, awards, service, projects | `src/data/cv.ts` |
| Publications | `src/data/publications.ts` (list) + `src/data/citations.json` (DOIs, BibTeX, APA/IEEE/MLA/Chicago/Harvard from Crossref) |
| Blog posts | `src/content/blog/*.md` |
| Paper PDFs | `public/papers/` |
| Photo | `src/assets/headshot.jpg` |
| Colours, fonts, clay shadows | `src/styles/global.css` |

## Write a blog post

Create `src/content/blog/my-post.md` (plain Markdown) or `my-post.mdx` (Markdown plus components):

```yaml
---
title: My post
description: One sentence summary.
date: 2026-11-15
category: Research   # or Technical
tags: [PUF, Quantum]
art: qubit           # card illustration: chip, chain, qubit, vehicle, cluster, network, gauge, paper, mail, cap, shield
# cover: /images/blog/figure.webp   # or a real image instead of the illustration
draft: false
---
```

Supported: Markdown, `$inline$` and `$$display$$` LaTeX, fenced code with highlighting (copy buttons are added
automatically), images (`![alt](/images/blog/x.webp)`, click to enlarge), tables.

In `.mdx` posts you can also use the site's components, for example:

```mdx
import PufAuthSequence from '../../components/diagrams/PufAuthSequence.astro';
import CodeFile from '../../components/CodeFile.astro';
import script from '../../../resources/my_script.py?raw';

<PufAuthSequence />
<CodeFile code={script} lang="python" file="my_script.py" />
```

Diagrams live in `src/components/diagrams/`, charts in `src/components/charts/`.
Tags, search (Ctrl K), reading time, table of contents, related posts and RSS (`/rss.xml`) are automatic.

## Reproducible material behind the posts

- `tools/puf-sim.mjs`: arbiter-PUF simulation that generates `src/data/puf-sim.json` (run `node tools/puf-sim.mjs`).
- `resources/puf_demo.py`: the Python example in the PUF post.
- `resources/monitoring-stack/`: the tested Docker monitoring stack. After editing it, rebuild the download:
  `cd resources && rm ../public/downloads/monitoring-stack.zip && zip -r ../public/downloads/monitoring-stack.zip monitoring-stack`

## Adding a new publication

1. Add it to `raw` in `src/data/publications.ts`.
2. Re-run the lookups to refresh `citations.json`: `python3 tools/lookup-dois.py` then `python3 tools/fetch-citations.py` (see the scripts for arguments), or add the entry by hand.
3. Optional: drop the PDF into `public/papers/` with any file name. `tools/match_papers.py` (run with uv, automatically before
   `npm run dev` and `npm run build`, or by hand with `npm run papers`) finds the paper by its DOI or title and adds a download button.

## Still placeholder (DEMO)

- `web3formsKey` in `src/data/site.ts` (free key from https://web3forms.com)

## Deploy (GitHub Pages, free) on koustav.isroot.in

1. Create a GitHub repo and push this folder to the `main` branch.
2. Repo → Settings → Pages → Source: **GitHub Actions**. The workflow in `.github/workflows/deploy.yml` builds and publishes on every push.
3. At your DNS provider for isroot.in (nameservers ns1/ns2.nevercode.in), add:
   `CNAME  koustav  →  <your-github-username>.github.io`
4. Repo → Settings → Pages → Custom domain: `koustav.isroot.in`, then tick **Enforce HTTPS** once the certificate is issued.
   (`public/CNAME` already contains the domain.)
