import { getPosts } from '../scripts/blog';
import { publications, typeLabels } from '../data/publications';
import { nav } from '../data/site';

export async function GET() {
  const posts = await getPosts();
  const items = [
    ...nav.map((n) => ({ t: n.label, u: n.href, k: 'Page', d: '' })),
    ...posts.map((p) => ({ t: p.data.title, u: `/blog/${p.id}/`, k: 'Post', d: `${p.data.description} ${p.data.tags.join(' ')}` })),
    ...publications.map((p) => ({ t: p.title, u: `/publications/#${p.id}`, k: typeLabels[p.type], d: `${p.venue} ${p.year} ${p.authors.join(' ')}` })),
    { t: 'All publications as BibTeX', u: '/publications.bib', k: 'File', d: 'bibtex citations export' },
    { t: 'Monitoring stack (zip)', u: '/downloads/monitoring-stack.zip', k: 'File', d: 'prometheus grafana docker compose download' },
  ];
  return new Response(JSON.stringify(items), { headers: { 'Content-Type': 'application/json' } });
}
