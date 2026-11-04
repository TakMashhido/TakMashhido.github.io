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

## Add an app

The Apps page (`/apps/`) lists things visitors can open and try. Each app is one Markdown file in `src/content/apps/`:

1. Copy `src/content/apps/_template.md` to `src/content/apps/my-app.md` (files starting with `_` are ignored).
2. Fill in the front matter: `title`, `summary`, `url` (where **Open app** goes, in a new tab), `category` (`Research` or `Side project`), `status`, `date`, and optionally `stack`, `repo`, `paper`, `post`, `art` or `screenshot`.
3. Write the intro below the front matter: what it does, how to use it, how it works.

That creates the card on `/apps/` and the intro page at `/apps/my-app/`. Apps hosted on this site itself (like the PUF simulator) live in `src/pages/play/`.

## Reproducible material behind the posts

- `tools/puf-sim.mjs`: arbiter-PUF simulation that generates `src/data/puf-sim.json` (run `node tools/puf-sim.mjs`).
- `resources/puf_demo.py`: the Python example in the PUF post.
- `resources/monitoring-stack/`: the files shown in the monitoring post (imported as code listings). The public copy lives at
  https://github.com/TakMashhido/docker-monitoring-stack; keep the two in sync when you change either.

## Adding a new publication

1. Add it to `raw` in `src/data/publications.ts`.
2. Re-run the lookups to refresh `citations.json`: `python3 tools/lookup-dois.py` then `python3 tools/fetch-citations.py` (see the scripts for arguments), or add the entry by hand.
3. Optional: drop the PDF into `public/papers/` with any file name. `tools/match_papers.py` (run with uv, automatically before
   `npm run dev` and `npm run build`, or by hand with `npm run papers`) finds the paper by its DOI or title and adds a download button.

## Search engines (SEO)

The site handles SEO itself; when you add content, only these steps matter:

- **Every page** gets a canonical URL, Open Graph/Twitter cards and one schema.org JSON-LD graph (your `Person`, the `WebSite`, breadcrumbs and a page-specific node: `BlogPosting`, `WebApplication`, `ScholarlyArticle` list, ...). It lives in `src/layouts/Base.astro` and `src/scripts/seo.ts`. To change how search engines describe you (job title, affiliations, profiles, research topics), edit `person` in `src/scripts/seo.ts` and `socials` in `src/data/site.ts`.
- **Blog posts:** keep `title` under about 60 characters if you can. If `description` is longer than 160 characters, add a `seoDescription:` (150 to 160 characters) for search results.
- **Covers and app screenshots** should be 1280×720 WebP. After adding one, run `node tools/make-og.mjs`; it writes the 1200×630 JPEG copy used for link previews (LinkedIn does not show WebP).
- **Sitemap:** `sitemap-index.xml` is built automatically, with last-modified dates from `date`/`updated`. Tag pages and the 404 page are `noindex`. The PUFAnalytics and NebulaTransfer apps are listed too.
- **`/llms.txt`** is generated from the site data, so AI assistants and AI search get an accurate summary of you, your posts, apps and papers.

## Still placeholder (DEMO)

- `web3formsKey` in `src/data/site.ts` (free key from https://web3forms.com)

## Deployment

Live at **https://koustav.isroot.in**, served by GitHub Pages.

- Every push to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it (about a minute).
- DNS: isroot.in delegates `koustav.isroot.in` to deSEC (`ns1.desec.io`, `ns2.desec.org`). The deSEC zone holds:
  - `A` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
  - `AAAA` → `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
  - `CAA` → `0 issue "letsencrypt.org"` (needed: the parent zone's nameservers time out on CAA queries, which blocks certificate issuance)
- HTTPS: Let's Encrypt certificate issued and renewed by GitHub; *Enforce HTTPS* is on. `public/CNAME` holds the domain.
