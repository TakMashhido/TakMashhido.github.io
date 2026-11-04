#!/usr/bin/env node
// IndexNow: tell Bing, Yandex, Seznam, Naver and Yep the moment pages change (https://www.indexnow.org).
//
//   node tools/indexnow.mjs diff     After `astro build`: compare every page in dist/ with the live
//                                    site and print the URLs whose content changed (one per line).
//   node tools/indexnow.mjs submit   Submit the URLs given as arguments, or read from stdin.
//   node tools/indexnow.mjs all      Submit every URL in the sitemap (first-time setup or a full re-crawl).
//   Add --dry-run to print what would be sent without sending it.
//
// The deploy workflow runs `diff` in the build job (before the new version goes live) and `submit`
// after the deploy, so only real content changes are announced. "Content" means the title, the meta
// description and the text of <main>, so restyling the site or changing asset hashes does not count.
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import https from 'node:https';

const SITE = 'https://koustav.isroot.in';
const HOST = new URL(SITE).hostname;
// The key file in public/ is the proof that we own the host; search engines fetch it from keyLocation.
const keyFile = readdirSync('public').find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) throw new Error('No IndexNow key file (32 hex characters + .txt) found in public/');
const KEY = keyFile.slice(0, -4);
// GitHub Pages addresses: fetching the live site through them avoids depending on public DNS.
const PAGES_IPS = ['185.199.108.153', '185.199.109.153', '185.199.110.153', '185.199.111.153'];

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const [mode, ...rest] = args.filter((a) => a !== '--dry-run');

function get(url) {
  return new Promise((resolve) => {
    const req = https.get(url, {
      lookup: (_host, opts, cb) => {
        const ip = PAGES_IPS[Math.floor(Math.random() * PAGES_IPS.length)];
        return opts?.all ? cb(null, [{ address: ip, family: 4 }]) : cb(null, ip, 4);
      },
      headers: { 'user-agent': 'indexnow-diff (koustav.isroot.in deploy)' },
      timeout: 15000,
    }, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (c) => (body += c));
      res.on('end', () => resolve(res.statusCode === 200 ? body : null));
    });
    req.on('timeout', () => req.destroy());
    req.on('error', () => resolve(null));
  });
}

const sitemapUrls = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

// A fingerprint of what a reader (and a search engine) sees, ignoring markup and asset names.
function fingerprint(html) {
  const pick = (re) => (html.match(re) || [])[1] || '';
  const main = pick(/<main[^>]*>([\s\S]*)<\/main>/)
    .replace(/<(script|style)[\s\S]*?<\/\1>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const parts = [pick(/<title>([\s\S]*?)<\/title>/), pick(/<meta name="description" content="([^"]*)"/), main];
  return createHash('sha256').update(parts.join('\n')).digest('hex');
}

async function diff() {
  if (!existsSync('dist/sitemap-0.xml')) throw new Error('dist/ not built: run `npm run build` first');
  const changed = [];
  for (const url of sitemapUrls(readFileSync('dist/sitemap-0.xml', 'utf8'))) {
    const file = `dist${new URL(url).pathname}index.html`;
    if (!existsSync(file)) continue; // separate sites under this domain (PUFAnalytics, NebulaTransfer)
    const live = await get(url);
    if (live === null || fingerprint(live) !== fingerprint(readFileSync(file, 'utf8'))) changed.push(url);
  }
  return changed;
}

async function submit(urls) {
  urls = [...new Set(urls.map((u) => u.trim()).filter((u) => u.startsWith(`${SITE}/`)))];
  if (!urls.length) return console.log('IndexNow: nothing to submit');
  const payload = { host: HOST, key: KEY, keyLocation: `${SITE}/${keyFile}`, urlList: urls };
  if (dryRun) return console.log(`IndexNow (dry run): would submit ${urls.length} URL(s)\n${urls.join('\n')}`);
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  });
  // 200 = received, 202 = received and key validation pending; anything else is a problem.
  console.log(`IndexNow: HTTP ${res.status} for ${urls.length} URL(s)\n${urls.join('\n')}`);
  if (res.status !== 200 && res.status !== 202) {
    console.error(await res.text());
    process.exitCode = 1;
  }
}

if (mode === 'diff') {
  const changed = await diff();
  if (changed.length) console.log(changed.join('\n'));
} else if (mode === 'submit') {
  const urls = rest.length ? rest : readFileSync(0, 'utf8').split('\n');
  await submit(urls);
} else if (mode === 'all') {
  const xml = (await get(`${SITE}/sitemap-0.xml`)) ?? readFileSync('dist/sitemap-0.xml', 'utf8');
  await submit(sitemapUrls(xml));
} else {
  console.error('Usage: node tools/indexnow.mjs diff | submit [url ...] | all  [--dry-run]');
  process.exitCode = 2;
}
