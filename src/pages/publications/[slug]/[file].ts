// Serves each paper's PDF from papers/ at /publications/<slug>/<slug>.pdf, the same directory as
// the paper's page. Google Scholar only follows citation_pdf_url to a PDF in that directory.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { publications } from '../../../data/publications';

export function getStaticPaths() {
  return publications
    .filter((p) => p.slug && p.pdfFile)
    .map((p) => ({ params: { slug: p.slug, file: `${p.slug}.pdf` }, props: { source: p.pdfFile } }));
}

export function GET({ props }: { props: { source: string } }) {
  const body = readFileSync(join(process.cwd(), 'papers', props.source));
  return new Response(body, { headers: { 'Content-Type': 'application/pdf' } });
}
