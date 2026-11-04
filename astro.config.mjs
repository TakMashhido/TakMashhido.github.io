// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import sharp from 'sharp';

// Markdown images from public/ get their real width/height (no layout shift) and lazy loading.
function rehypeImageSize() {
  return async (tree) => {
    const imgs = [];
    const walk = (n) => { if (n.type === 'element' && n.tagName === 'img') imgs.push(n); (n.children || []).forEach(walk); };
    walk(tree);
    await Promise.all(imgs.map(async (img) => {
      const src = img.properties?.src;
      if (typeof src !== 'string' || !src.startsWith('/') || img.properties.width) return;
      const file = `public${decodeURI(src)}`;
      if (!existsSync(file)) return;
      const { width, height } = await sharp(file).metadata();
      Object.assign(img.properties, { width, height, loading: 'lazy', decoding: 'async' });
    }));
  };
}

// Last-modified dates for the sitemap, read from the front matter of posts and apps.
const SITE = 'https://koustav.isroot.in';
const lastmod = new Map();
const fm = (file, key) => (readFileSync(file, 'utf8').match(new RegExp(`^${key}:\\s*(\\S+)`, 'm')) || [])[1];
for (const [dir, base] of [['src/content/blog', '/blog/'], ['src/content/apps', '/apps/']]) {
  for (const f of readdirSync(dir).filter((n) => /^[^_].*\.mdx?$/.test(n))) {
    const d = fm(`${dir}/${f}`, 'updated') ?? fm(`${dir}/${f}`, 'date');
    if (d) lastmod.set(`${SITE}${base}${f.replace(/\.mdx?$/, '')}/`, new Date(d));
  }
}
const newest = new Date(Math.max(...lastmod.values()));
for (const path of ['/', '/blog/', '/apps/']) lastmod.set(`${SITE}${path}`, newest);

export default defineConfig({
  site: SITE,
  integrations: [
    mdx(),
    sitemap({
      // Tag pages are thin lists (noindex); the two apps are separate static sites under this domain.
      filter: (page) => !page.includes('/blog/tags/') && !page.endsWith('/404/'),
      customPages: [`${SITE}/PUFAnalytics/`, `${SITE}/NebulaTransfer/`],
      serialize(item) {
        const d = lastmod.get(item.url);
        if (d) item.lastmod = d.toISOString();
        return item;
      },
    }),
  ],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex, rehypeImageSize],
    shikiConfig: {
      themes: { light: 'github-light-high-contrast', dark: 'github-dark-high-contrast' },
      wrap: false,
      // ```ts title="src/file.ts"  ->  <pre data-title="src/file.ts">, shown as a file-name bar above the code.
      transformers: [
        {
          pre(node) {
            const m = /title="([^"]+)"/.exec(this.options.meta?.__raw ?? '');
            if (m) node.properties['data-title'] = m[1];
          },
        },
      ],
    },
  },
});
