// Google Scholar meta tags (Highwire Press `citation_*`) and schema.org nodes for one publication.
// Scholar rules this follows (https://scholar.google.com/intl/en/scholar/inclusion.html):
// - one paper per page, with its abstract visible on that page;
// - citation_title, citation_author (one per author) and citation_publication_date are required;
// - citation_pdf_url must point to a PDF in the same directory as the abstract page, with searchable
//   text and at most 5 MB (otherwise it is left out, see `scholarPdf` in src/data/publications.ts).
import { doiUrl, typeLabels, type Publication } from '../data/publications';
import { PERSON_ID, abs } from './seo';

type Meta = { name: string; content: string };

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

/** Full author names from the BibTeX entry ("Mondal, Koustav Kumar"), falling back to the short form. */
export const fullAuthors = (p: Publication) =>
  p.bib.author ? p.bib.author.split(/\s+and\s+/).map((a) => a.trim()) : p.authors;

/** "Mondal, Koustav Kumar" -> "Koustav Kumar Mondal". */
export const displayName = (a: string) => (a.includes(',') ? a.split(',').map((s) => s.trim()).reverse().join(' ') : a);

export const isMe = (a: string) => /Mondal/.test(a) && /Koustav|^K\.\s?K\./.test(a);

/** Publication date: year and, when the publisher gives it, month. */
export const publishedDate = (p: Publication) => {
  const m = MONTHS.indexOf((p.bib.month ?? '').slice(0, 3).toLowerCase());
  return new Date(Date.UTC(p.year, Math.max(m, 0), 1));
};

/** First and last page, from BibTeX or from the "pp. 12–34" details text. */
export const pageRange = (p: Publication): [string, string | undefined] | undefined => {
  const raw = p.bib.pages ?? /\bpp?\.\s*([\w–-]+)/.exec(p.details ?? '')?.[1];
  if (!raw) return undefined;
  const [first, last] = raw.split(/[–-]+/);
  return [first, last && last !== first ? last : undefined];
};

/** Venue name without the trailing publisher (", IEEE", ", Springer"). */
const venueName = (p: Publication) => p.venue.replace(/,\s*(IEEE|Springer|CRC Press)$/, '');

export function scholarMeta(p: Publication): Meta[] {
  const tags: Meta[] = [];
  const add = (name: string, content?: string | number) => {
    if (content !== undefined && content !== '') tags.push({ name, content: String(content) });
  };

  add('citation_title', p.title);
  fullAuthors(p).forEach((a) => add('citation_author', a));
  add('citation_publication_date', String(p.year));
  if (p.type === 'journal') add('citation_journal_title', p.bib.journal ?? p.venue);
  if (p.type === 'conference') add('citation_conference_title', p.bib.entrytype === 'inproceedings' && p.bib.booktitle ? p.bib.booktitle : venueName(p));
  if (p.type === 'chapter') {
    add('citation_inbook_title', p.bib.booktitle ?? venueName(p));
    add('citation_book_title', p.bib.booktitle ?? venueName(p));
  }
  add('citation_publisher', p.bib.publisher);
  add('citation_volume', p.bib.volume);
  add('citation_issue', p.bib.number);
  const pages = pageRange(p);
  if (pages) { add('citation_firstpage', pages[0]); add('citation_lastpage', pages[1]); }
  add('citation_issn', p.bib.issn);
  add('citation_isbn', p.bib.isbn);
  add('citation_doi', p.doi);
  add('citation_language', 'en');
  add('citation_abstract_html_url', abs(p.url));
  if (p.pdf && p.scholarPdf) add('citation_pdf_url', abs(p.pdf));
  return tags;
}

/** schema.org node for the paper. `withAbstract` adds the abstract (only on the paper's own page). */
export function workNode(p: Publication, withAbstract = false) {
  const type = p.type === 'chapter' ? 'Chapter' : p.type === 'patent' ? 'CreativeWork' : 'ScholarlyArticle';
  const pages = pageRange(p);
  return {
    '@type': type,
    '@id': p.slug ? `${abs(p.url)}#work` : abs(p.url),
    ...(p.slug ? { url: abs(p.url), mainEntityOfPage: abs(p.url) } : {}),
    name: p.title,
    headline: p.title.length > 110 ? `${p.title.slice(0, 107)}...` : p.title,
    author: fullAuthors(p).map((a) => (isMe(a) ? { '@id': PERSON_ID } : { '@type': 'Person', name: displayName(a) })),
    datePublished: p.bib.month ? publishedDate(p).toISOString().slice(0, 7) : String(p.year),
    inLanguage: 'en',
    genre: typeLabels[p.type],
    ...(p.type === 'patent'
      ? { description: p.details ? `${p.venue}. ${p.details}` : p.venue }
      : {
          isPartOf: p.type === 'chapter'
            ? { '@type': 'Book', name: p.bib.booktitle ?? venueName(p), ...(p.bib.isbn ? { isbn: p.bib.isbn } : {}) }
            : { '@type': 'Periodical', name: p.bib.journal ?? p.bib.booktitle ?? venueName(p), ...(p.bib.issn ? { issn: p.bib.issn } : {}) },
        }),
    ...(p.bib.publisher ? { publisher: { '@type': 'Organization', name: p.bib.publisher } } : {}),
    ...(pages ? { pageStart: pages[0], ...(pages[1] ? { pageEnd: pages[1] } : {}) } : {}),
    ...(p.doi ? { sameAs: doiUrl(p.doi), identifier: { '@type': 'PropertyValue', propertyID: 'DOI', value: p.doi, url: doiUrl(p.doi) } } : {}),
    ...(p.pdf ? { encoding: { '@type': 'MediaObject', contentUrl: abs(p.pdf), encodingFormat: 'application/pdf' } } : {}),
    ...(withAbstract && p.abstract && !p.abstractIsExcerpt ? { abstract: p.abstract } : {}),
  };
}
