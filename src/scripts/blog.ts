import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function readingTime(body = ''): number {
  const words = body.replace(/```[\s\S]*?```/g, ' ').replace(/\$\$[\s\S]*?\$\$/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export const slugifyTag = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const formatDate = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

// Card illustration for a post: explicit `art`, otherwise picked from its tags.
export function artFor(post: Post) {
  if (post.data.art) return post.data.art;
  const t = post.data.tags.join(' ').toLowerCase();
  if (/puf|hardware/.test(t)) return 'chip';
  if (/quantum|qkd/.test(t)) return 'qubit';
  if (/blockchain|consensus/.test(t)) return 'chain';
  if (/vehicle|iov|robot/.test(t)) return 'vehicle';
  if (/monitor|grafana|prometheus/.test(t)) return 'gauge';
  if (/kubernetes|edge|infrastructure|cluster|docker/.test(t)) return 'cluster';
  return post.data.category === 'Research' ? 'network' : 'cluster';
}
