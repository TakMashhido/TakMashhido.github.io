import { getPosts } from '../scripts/blog';
import { publications, typeLabels } from '../data/publications';
import { nav } from '../data/site';
import { getApps } from '../scripts/apps';

export async function GET() {
  const posts = await getPosts();
  const apps = await getApps();
  const items = [
    ...nav.map((n) => ({ t: n.label, u: n.href, k: 'Page', d: '' })),
    ...posts.map((p) => ({ t: p.data.title, u: `/blog/${p.id}/`, k: 'Post', d: `${p.data.description} ${p.data.tags.join(' ')}` })),
    ...apps.map((a) => ({ t: a.data.title, u: `/apps/${a.id}/`, k: 'App', d: `${a.data.summary} ${a.data.tags.join(' ')} ${a.data.stack.join(' ')}` })),
    ...publications.map((p) => ({ t: p.title, u: `/publications/#${p.id}`, k: typeLabels[p.type], d: `${p.venue} ${p.year} ${p.authors.join(' ')}` })),
    { t: 'All publications as BibTeX', u: '/publications.bib', k: 'File', d: 'bibtex citations export' },
    { t: 'Monitoring stack (GitHub)', u: 'https://github.com/TakMashhido/docker-monitoring-stack', k: 'Code', d: 'prometheus grafana docker compose repository' },
  ];
  return new Response(JSON.stringify(items), { headers: { 'Content-Type': 'application/json' } });
}
