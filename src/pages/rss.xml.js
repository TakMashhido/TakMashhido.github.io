import rss from '@astrojs/rss';
import { getPosts } from '../scripts/blog';
import { site } from '../data/site';

export async function GET(context) {
  const posts = await getPosts();
  return rss({
    title: `${site.name} — Blog`,
    description: 'Technical notes and research writing on hardware security, PUFs, blockchain and quantum-era networks.',
    site: context.site,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.date,
      categories: [p.data.category, ...p.data.tags],
      link: `/blog/${p.id}/`,
    })),
  });
}
