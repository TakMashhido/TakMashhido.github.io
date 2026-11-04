// /llms.txt: a plain-text summary of the site for AI assistants and AI search (https://llmstxt.org).
import { site, socials } from '../data/site';
import { education } from '../data/cv';
import { publications, typeLabels } from '../data/publications';
import { getPosts } from '../scripts/blog';
import { getApps } from '../scripts/apps';

const SITE = 'https://koustav.isroot.in';

export async function GET() {
  const posts = await getPosts();
  const apps = await getApps();
  const abs = (u: string) => (u.startsWith('http') ? u : SITE + u);
  const lines = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    `${site.name} is a hardware security researcher. ${site.role}. Research areas: physically unclonable functions (PUFs) and PUF-based authentication for IoT and connected vehicles, blockchain consensus, post-quantum security and fault-tolerant distributed quantum computing.`,
    '',
    `Education: ${education.map((e) => `${e.degree}, ${e.school} (${e.period})`).join('; ')}.`,
    '',
    `Contact: ${site.email}. Profiles: ${socials.filter((s) => !s.demo).map((s) => `[${s.label}](${s.href})`).join(', ')}.`,
    '',
    '## Pages',
    '',
    `- [Home](${SITE}/): overview, research themes and selected papers`,
    `- [About](${SITE}/about/): background, education, experience, skills and awards`,
    `- [Research](${SITE}/research/): research themes and projects`,
    `- [Publications](${SITE}/publications/): all ${publications.length} papers, chapters and patents with BibTeX`,
    `- [Blog](${SITE}/blog/): technical and research writing`,
    `- [Apps](${SITE}/apps/): research tools and side projects`,
    `- [Contact](${SITE}/contact/)`,
    '',
    '## Blog posts',
    '',
    ...posts.map((p) => `- [${p.data.title}](${SITE}/blog/${p.id}/): ${p.data.description}`),
    '',
    '## Apps',
    '',
    ...apps.map((a) => `- [${a.data.title}](${abs(a.data.url)}): ${a.data.summary} (about: ${SITE}/apps/${a.id}/)`),
    '',
    '## Publications',
    '',
    ...publications.map((p) => `- ${p.authors.join(', ')}. "${p.title}." ${p.venue}, ${p.year}. ${typeLabels[p.type]}.${p.doi ? ` https://doi.org/${p.doi}` : ''}`),
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
