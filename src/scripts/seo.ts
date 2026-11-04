// Structured data (schema.org JSON-LD) shared by every page.
// Every page emits one @graph containing the WebSite and the Person (referenced by @id),
// plus whatever the page adds (BlogPosting, SoftwareApplication, BreadcrumbList, ...).
import { site, socials } from '../data/site';
import { education } from '../data/cv';

export const SITE_URL = 'https://koustav.isroot.in';
export const abs = (path: string) => new URL(path, SITE_URL).href;

export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const person = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: site.name,
  givenName: 'Koustav Kumar',
  familyName: 'Mondal',
  alternateName: ['Koustav Mondal', 'Koustav K. Mondal', 'K. K. Mondal', 'TakMashhido'],
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
  alternateName: ['Koustav Kumar Mondal', 'koustav.isroot.in'],
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
