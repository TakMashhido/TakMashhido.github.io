// Publications from the CV, enriched with publisher metadata.
// DOIs, years, volume/pages, BibTeX and formatted citations come from Crossref / doi.org
// (see tools/lookup-dois.py and tools/fetch-citations.py) and live in ./citations.json.
// Abstracts (taken from the papers themselves) live in ./abstracts.json.
import citations from './citations.json';
import paperFiles from './paper-files.json';
import abstracts from './abstracts.json';

// PDFs dropped into papers/ (any file name) are matched to papers by tools/match_papers.py,
// which writes ./paper-files.json. A matched paper gets its own page with the PDF beside it.
type PaperFile = { file: string; bytes: number; text: boolean };
const files = paperFiles as Record<string, PaperFile>;
const SCHOLAR_MAX_BYTES = 5 * 1024 * 1024;

export type PubType = 'journal' | 'conference' | 'chapter' | 'patent';

export interface Publication {
  id: string;
  type: PubType;
  title: string;
  authors: string[];
  venue: string;
  details?: string;
  year: number;
  doi?: string;
  bibtex: string;
  styles: Record<CiteStyle, string>;
  /** URL slug of the paper's own page (papers with a PDF or an abstract). */
  slug?: string;
  /** Where links to this paper go: its own page, or its entry on /publications/. */
  url: string;
  /** Public URL of the PDF, served next to the paper page. */
  pdf?: string;
  /** Source file in papers/. */
  pdfFile?: string;
  /** PDF meets Google Scholar's rules (searchable text, at most 5 MB). */
  scholarPdf: boolean;
  abstract?: string;
  /** The chapter has no abstract, so `abstract` holds its opening paragraph instead. */
  abstractIsExcerpt: boolean;
  /** Fields parsed from the BibTeX entry (full author names, volume, pages, ...). */
  bib: Record<string, string>;
}

export type CiteStyle = 'apa' | 'ieee' | 'mla' | 'chicago' | 'harvard';
export const styleLabels: Record<CiteStyle, string> = { apa: 'APA', ieee: 'IEEE', mla: 'MLA', chicago: 'Chicago', harvard: 'Harvard' };


export const typeLabels: Record<PubType, string> = {
  journal: 'Journal article',
  conference: 'Conference paper',
  chapter: 'Book chapter',
  patent: 'Patent',
};

type RawPublication = Pick<Publication, 'id' | 'type' | 'title' | 'authors' | 'venue' | 'details' | 'year'>;
const raw: RawPublication[] = [
  // Patent
  {
    id: 'mondal2026mems', type: 'patent', year: 2026,
    title: 'Dynamic MEMS-Based Physical Unclonable Function Device Using Differential Sensing and Chaotic Perturbation',
    authors: ['K. K. Mondal', 'D. Das'],
    venue: 'Indian Patent Application No. 202611079833',
    details: 'Filed 26 June 2026',
  },
  // Journals
  {
    id: 'mondal2026rpoe', type: 'journal', year: 2026,
    title: 'RPoE: A Reputation-Aware Proof-of-Energy Blockchain Protocol for Electric Vehicle Energy Trading in IoEV',
    authors: ['K. K. Mondal', 'A. Kumar', 'D. Das'],
    venue: 'IEEE Transactions on Vehicular Technology',
  },
  {
    id: 'kandpal2026spog', type: 'journal', year: 2026,
    title: 'SPOG: A GPU Rasterization Pipeline for Artifact-Reduced Photovoltaic Farm Orthomosaics',
    authors: ['U. Kandpal', 'K. K. Mondal', 'D. Das'],
    venue: 'IEEE Geoscience and Remote Sensing Letters',
  },
  {
    id: 'nahar2026qiov', type: 'journal', year: 2026,
    title: 'qIoV: A Quantum-Driven Approach for Environmental Monitoring and Rapid Response Systems Using Internet of Vehicles',
    authors: ['A. Nahar', 'K. K. Mondal', 'D. Das', 'R. Buyya'],
    venue: 'Ad Hoc Networks', details: 'vol. 185, Article 104158',
  },
  {
    id: 'mondal2025aes', type: 'journal', year: 2025,
    title: 'Secure IoT Communications with Optimized AES and Dynamic Threat Modeling on Embedded System',
    authors: ['K. K. Mondal', 'H. Sikarwar', 'D. Das', 'C.-I. Fan'],
    venue: 'IEEE Transactions on Consumer Electronics',
  },
  {
    id: 'mondal2025bcpuf', type: 'journal', year: 2025,
    title: 'A Blockchain-Integrated PUF Framework for Secure Authentication and Communication',
    authors: ['K. K. Mondal', 'D. Das', 'A. Khandelwal'],
    venue: 'Ad Hoc Networks', details: 'Article 104059',
  },
  {
    id: 'kumar2025rbcet', type: 'journal', year: 2025,
    title: 'RBCET: A Reputation-Based Blockchain Consensus Mechanism for Fast and Secured Energy Trading in Internet of Electric Vehicles (IoEV)',
    authors: ['A. Kumar', 'K. K. Mondal', 'L. Vishwakarma', 'D. Das'],
    venue: 'IEEE Transactions on Consumer Electronics',
  },
  {
    id: 'jain2025ipm', type: 'journal', year: 2025,
    title: 'Intelligent Predictive Maintenance: Multivariate ML Model Optimization in an Edge-Fog-Cloud Environment',
    authors: ['P. Jain', 'K. K. Mondal', 'D. Das', 'A. Khandelwal'],
    venue: 'Computing', details: 'vol. 107, no. 12, Article 225',
  },
  {
    id: 'nahar2024clouds', type: 'journal', year: 2024,
    title: 'Clouds on the Road: A Software-Defined Fog Computing Framework for Intelligent Resource Management in Vehicular Ad-Hoc Networks',
    authors: ['A. Nahar', 'K. K. Mondal', 'D. Das', 'R. Buyya'],
    venue: 'IEEE Transactions on Mobile Computing', details: 'vol. 23, no. 12, pp. 12778–12792',
  },
  {
    id: 'sikarwar2024secure', type: 'journal', year: 2024,
    title: 'SECURE: Secure and Efficient Protocol Using Randomness and Edge-Computing for Drone-Assisted Internet of Vehicles',
    authors: ['H. Sikarwar', 'H. Vasudev', 'D. Das', 'M. Conti', 'K. K. Mondal'],
    venue: 'IEEE Transactions on Network and Service Management', details: 'vol. 21, no. 6, pp. 6974–6988',
  },
  // Conferences
  {
    id: 'mondal2025pufanalytics', type: 'conference', year: 2025,
    title: 'PUFAnalytics: Python Library for Comprehensive Evaluation and Analysis of PUFs',
    authors: ['K. K. Mondal', 'A. Gupta', 'D. Das'],
    venue: '30th Asia-Pacific Conference on Communications (APCC), IEEE', details: 'pp. 1–6',
  },
  {
    id: 'mondal2024guardev', type: 'conference', year: 2024,
    title: 'Guardev: Guided Unified Adaptive Response for Defending Electric Vehicles',
    authors: ['K. K. Mondal', 'D. Das'],
    venue: 'International Conference on Pattern Recognition (ICPR), Springer', details: 'pp. 47–62',
  },
  {
    id: 'mondal2024piston', type: 'conference', year: 2024,
    title: 'PISTON: PUF-Integrated Secure, Throughput-Optimized Network Protocol for IoV',
    authors: ['K. K. Mondal', 'A. Gupta', 'D. Das', 'C.-I. Fan'],
    venue: '29th Asia-Pacific Conference on Communications (APCC), IEEE', details: 'pp. 149–154',
  },
  {
    id: 'mondal2023edge', type: 'conference', year: 2023,
    title: 'Edge-Centric Security Framework for Electric Vehicle Connectivity: A Deep Learning Approach',
    authors: ['K. K. Mondal', 'D. Mahendia', 'D. Das', 'S. Kalra'],
    venue: '28th Asia-Pacific Conference on Communications (APCC), IEEE', details: 'pp. 448–453',
  },
  {
    id: 'mondal2023flamenet', type: 'conference', year: 2023,
    title: 'FlameNet: A Real-Time, Lightweight Fire & Smoke Detection Solution for Internet of Vehicles',
    authors: ['K. K. Mondal', 'D. Das'],
    venue: 'International Wireless Communications and Mobile Computing Conference (IWCMC), IEEE', details: 'pp. 539–544',
  },
  {
    id: 'paramanik2019smartgrid', type: 'conference', year: 2019,
    title: 'Survey of Smart Grid Network Using Drone & PTZ Camera',
    authors: ['S. Paramanik', 'P. S. Sarkar', 'K. K. Mondal', 'A. Chakraborty', 'S. Chakraborty', 'K. Sarker'],
    venue: 'Devices for Integrated Circuit (DevIC), IEEE', details: 'pp. 361–364',
  },
  // Chapters
  {
    id: 'mondal2025cliff', type: 'chapter', year: 2025,
    title: 'A Comprehensive Security Risk Analysis of Cliff Edge on Cyber-Physical Systems',
    authors: ['K. K. Mondal', 'A. Biswas', 'D. G. Roy'],
    venue: 'Secure and Smart Cyber-Physical Systems, CRC Press', details: 'pp. 153–177',
  },
  {
    id: 'biswas2023smart', type: 'chapter', year: 2023,
    title: 'A Study of Smart Evolution on AI-Based Cyber-Physical System Using Blockchain Techniques',
    authors: ['A. Biswas', 'K. K. Mondal', 'D. Guha Roy'],
    venue: 'AI Models for Blockchain-Based Intelligent Networks in IoT Systems, Springer', details: 'pp. 327–346',
  },
  {
    id: 'mondal2022iotsec', type: 'chapter', year: 2022,
    title: 'IoT Data Security with Machine Learning Blockchain: Risks and Countermeasures',
    authors: ['K. K. Mondal', 'D. Guha Roy'],
    venue: 'Deep Learning for Security and Privacy Preservation in IoT, Springer', details: 'pp. 49–81',
  },
  {
    id: 'mondal2022quantum', type: 'chapter', year: 2022,
    title: 'Quantum Aware Distributed Ledger Technology for Blockchain-Based IoT Network',
    authors: ['K. K. Mondal', 'D. Guha Roy'],
    venue: 'Blockchain Based Internet of Things, Springer', details: 'pp. 267–288',
  },
];

const patentStyles: Record<CiteStyle, string> = {
  apa: 'Mondal, K. K., & Das, D. (2026). Dynamic MEMS-based physical unclonable function device using differential sensing and chaotic perturbation (Indian Patent Application No. 202611079833).',
  ieee: 'K. K. Mondal and D. Das, “Dynamic MEMS-Based Physical Unclonable Function Device Using Differential Sensing and Chaotic Perturbation,” Indian Patent Application 202611079833, filed Jun. 26, 2026.',
  mla: 'Mondal, Koustav Kumar, and Debasis Das. Dynamic MEMS-Based Physical Unclonable Function Device Using Differential Sensing and Chaotic Perturbation. Indian Patent Application 202611079833, 26 June 2026.',
  chicago: 'Mondal, Koustav Kumar, and Debasis Das. 2026. “Dynamic MEMS-Based Physical Unclonable Function Device Using Differential Sensing and Chaotic Perturbation.” Indian Patent Application 202611079833, filed June 26, 2026.',
  harvard: 'Mondal, K.K. and Das, D. (2026) Dynamic MEMS-based physical unclonable function device using differential sensing and chaotic perturbation. Indian Patent Application 202611079833.',
};
const patentBib = `@misc{mondal2026mems,
  title = {Dynamic MEMS-Based Physical Unclonable Function Device Using Differential Sensing and Chaotic Perturbation},
  author = {Mondal, Koustav Kumar and Das, Debasis},
  howpublished = {Indian Patent Application No. 202611079833},
  note = {Filed 26 June 2026},
  year = {2026}
}`;

type Cite = { doi: string; year: number; details: string | null; bibtex: string; styles: Record<CiteStyle, string> };
const cites = citations as Record<string, Cite>;
const abstractText = abstracts as Record<string, string>;
// Chapters published without an abstract: abstracts.json holds their opening paragraph.
const excerpts = new Set(['mondal2022iotsec']);

/** Flat `key = {value}` fields of a BibTeX entry (keys lower-cased). */
export function parseBib(entry: string): Record<string, string> {
  const out: Record<string, string> = {};
  const type = /^@(\w+)\{/.exec(entry);
  if (type) out.entrytype = type[1].toLowerCase();
  for (const m of entry.matchAll(/^\s*(\w+)\s*=\s*(?:\{(.*)\}|(\w+)),?\s*$/gm)) out[m[1].toLowerCase()] = (m[2] ?? m[3]).trim();
  return out;
}

const slugify = (title: string) => {
  const words = title.toLowerCase().normalize('NFKD').replace(/[^a-z0-9\s-]/g, ' ').split(/[\s-]+/).filter(Boolean);
  let slug = '';
  for (const w of words) {
    if (slug && (slug + '-' + w).length > 64) break;
    slug = slug ? `${slug}-${w}` : w;
  }
  // Do not end on a filler word ("...-protocol-for").
  return slug.replace(/(-(a|an|the|and|or|for|of|on|in|with|to|using|via|by))+$/, '');
};

export const publications: Publication[] = raw.map((p) => {
  const c = cites[p.id];
  const file = files[p.id];
  const abstract = abstractText[p.id];
  const slug = file || abstract ? slugify(p.title) : undefined;
  const base = c
    ? { ...p, year: c.year ?? p.year, details: c.details ?? p.details, doi: c.doi, bibtex: c.bibtex, styles: c.styles }
    : { ...p, bibtex: patentBib, styles: patentStyles };
  return {
    ...base,
    slug,
    url: slug ? `/publications/${slug}/` : `/publications/#${p.id}`,
    pdf: slug && file ? `/publications/${slug}/${slug}.pdf` : undefined,
    pdfFile: file?.file,
    scholarPdf: !!file && file.text && file.bytes <= SCHOLAR_MAX_BYTES,
    abstract,
    abstractIsExcerpt: excerpts.has(p.id),
    bib: parseBib(base.bibtex),
  };
});

const slugs = publications.flatMap((p) => (p.slug ? [p.slug] : []));
if (new Set(slugs).size !== slugs.length) throw new Error('Two publications have the same page slug; shorten or change a title.');

export const doiUrl = (doi: string) => `https://doi.org/${doi}`;
export const bibtex = (p: Publication) => p.bibtex;
