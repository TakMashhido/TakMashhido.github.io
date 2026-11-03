import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
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

export const collections = { blog };
