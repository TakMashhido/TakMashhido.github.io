import { getCollection, type CollectionEntry } from 'astro:content';

export type App = CollectionEntry<'apps'>;

export async function getApps(): Promise<App[]> {
  const apps = await getCollection('apps', ({ data }) => import.meta.env.DEV || !data.draft);
  return apps.sort((a, b) => Number(b.data.featured) - Number(a.data.featured) || b.data.date.valueOf() - a.data.date.valueOf());
}

export const isExternal = (url: string) => /^https?:\/\//.test(url);
export const hostOf = (url: string) => (isExternal(url) ? new URL(url).host.replace(/^www\./, '') : 'koustav.isroot.in');
