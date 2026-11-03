import { publications, bibtex } from '../data/publications';

export function GET() {
  const body = publications.map(bibtex).join('\n\n') + '\n';
  return new Response(body, { headers: { 'Content-Type': 'application/x-bibtex; charset=utf-8' } });
}
