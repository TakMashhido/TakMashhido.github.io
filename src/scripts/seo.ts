// Structured data (schema.org JSON-LD) shared by every page.
// Every page emits one @graph containing the WebSite and the Person (referenced by @id),
// plus whatever the page adds (BlogPosting, SoftwareApplication, BreadcrumbList, ...).
import { site, socials } from '../data/site';
import { education } from '../data/cv';

export const SITE_URL = 'https://koustavmondal.com';
export const abs = (path: string) => new URL(path, SITE_URL).href;

// Every way people write or misspell the name, so a search for any of them finds this site.
// Search engines read these from the Person node; they are not shown on the page.
const givenNames = ['Koustav', 'Kaustav', 'Koustab', 'Kaustab', 'Koustuv', 'Kaustuv', 'Kostav', 'Koustov', 'Kowstav'];
const surnames = ['Mondal', 'Mandal', 'Mondol', 'Mandol'];
export const nameVariants = [
  ...new Set([
    ...givenNames.flatMap((g) => surnames.flatMap((s) => [`${g} ${s}`, `${g} Kumar ${s}`, `${g} K. ${s}`, `${g} K ${s}`])),
    ...surnames.flatMap((s) => [`K. K. ${s}`, `K K ${s}`, `KK ${s}`, `K. ${s}`, `${s} K. K.`, `${s}, Koustav Kumar`, `${s} Koustav`, `${s} Koustav Kumar`]),
    'Koustav Kumar', 'Koustav', 'koustavmondal', 'TakMashhido', 'Tak Mashhido',
    'কৌস্তভ কুমার মণ্ডল', 'কৌস্তভ মণ্ডল', 'कौस्तव कुमार मंडल', 'कौस्तव मंडल',
  ]),
].filter((n) => n !== 'Koustav Kumar Mondal');

export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const person = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: site.name,
  givenName: 'Koustav Kumar',
  familyName: 'Mondal',
  alternateName: nameVariants,
  url: `${SITE_URL}/`,
  image: { '@type': 'ImageObject', url: abs('/images/koustav-kumar-mondal.jpg'), width: 800, height: 800, caption: site.name },
  email: `mailto:${site.email}`,
  jobTitle: 'Visiting Researcher',
  description: site.description,
  worksFor: {
    '@type': 'Organization',
    name: 'qCLOUDS Lab, School of Computing and Information Systems, The University of Melbourne',
    url: site.lab.url,
    parentOrganization: { '@type': 'CollegeOrUniversity', name: site.uni.name, url: site.uni.url },
  },
  affiliation: [
    { '@type': 'CollegeOrUniversity', name: site.uni.name, url: site.uni.url },
    { '@type': 'CollegeOrUniversity', name: 'Indian Institute of Technology Jodhpur', url: 'https://www.iitj.ac.in/' },
  ],
  alumniOf: [...new Set(education.map((e) => e.school))].map((name) => ({ '@type': 'CollegeOrUniversity', name })),
  homeLocation: { '@type': 'Place', name: site.location },
  knowsAbout: [
    'Hardware security', 'Physically unclonable functions (PUF)', 'PUF-based authentication', 'Internet of Things security',
    'Internet of Vehicles', 'Blockchain consensus', 'Post-quantum cryptography', 'Distributed quantum computing',
    'Cyber-physical systems', 'Edge computing',
  ],
  sameAs: socials.filter((s) => !s.demo).map((s) => s.href),
};

export const website = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: `${SITE_URL}/`,
  name: site.name,
  alternateName: ['Koustav Mondal', 'koustavmondal.com', 'Koustav Kumar Mondal portfolio'],
  description: site.description,
  inLanguage: 'en',
  author: { '@id': PERSON_ID },
  publisher: { '@id': PERSON_ID },
};

export type Crumb = { name: string; path: string };
export const breadcrumbs = (crumbs: Crumb[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: [{ name: 'Home', path: '/' }, ...crumbs].map((c, i) => ({
    '@type': 'ListItem', position: i + 1, name: c.name, item: abs(c.path),
  })),
});

export const graph = (nodes: object[]) =>
  JSON.stringify({ '@context': 'https://schema.org', '@graph': [website, person, ...nodes] }).replace(/</g, '\\u003c');
