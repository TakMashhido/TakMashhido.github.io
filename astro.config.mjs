// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  site: 'https://koustav.isroot.in',
  integrations: [mdx(), sitemap()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
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
