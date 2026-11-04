import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Optional shorter text for search results (aim for 150-160 characters); defaults to description.
    seoDescription: z.string().optional(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    category: z.enum(['Technical', 'Research']),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    demo: z.boolean().default(false),
    // Optional card art: a real image in public/ (e.g. '/images/qkd.jpg') or a built-in clay illustration.
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    art: z.enum(['chip', 'chain', 'qubit', 'vehicle', 'cluster', 'network', 'gauge', 'paper', 'mail', 'cap', 'shield']).optional(),
  }),
});

const artNames = ['chip', 'chain', 'qubit', 'vehicle', 'cluster', 'network', 'gauge', 'paper', 'mail', 'cap', 'shield', 'code'] as const;

// Apps: one Markdown file per app in src/content/apps/. Files starting with _ (like _template.md) are ignored.
const apps = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/apps' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(), // one or two sentences, shown on the card and at the top of the intro page
    url: z.string(), // where "Open app" goes: https://... or a path on this site
    category: z.enum(['Research', 'Side project']),
    status: z.enum(['Live', 'Beta', 'Archived']).default('Live'),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    stack: z.array(z.string()).default([]), // what it is built with
    repo: z.string().url().optional(), // source code
    paper: z.string().optional(), // publication id from src/data/publications.ts
    post: z.string().optional(), // related blog post slug
    art: z.enum(artNames).default('code'),
    screenshot: z.string().optional(), // image in public/, e.g. /images/apps/my-app.webp
    screenshotAlt: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, apps };
