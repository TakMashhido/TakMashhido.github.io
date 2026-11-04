// Social-card images. LinkedIn and some chat apps don't show WebP link previews, so every
// .webp used as a `cover:` (blog) or `screenshot:` (apps) gets a 1200×630 JPEG copy in public/og/.
// Base.astro switches to the copy automatically. Run after adding a cover: node tools/make-og.mjs
import sharp from 'sharp';
import { readdirSync, readFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { dirname } from 'node:path';

const images = new Set();
for (const dir of ['src/content/blog', 'src/content/apps']) {
  for (const f of readdirSync(dir).filter((n) => /\.mdx?$/.test(n))) {
    for (const m of readFileSync(`${dir}/${f}`, 'utf8').matchAll(/^(?:cover|screenshot):\s*(\/images\/\S+\.webp)\s*$/gm)) images.add(m[1]);
  }
}
let made = 0;
for (const img of images) {
  const src = `public${img}`, out = `public/og${img.slice('/images'.length).replace(/\.webp$/, '.jpg')}`;
  if (existsSync(out) && statSync(out).mtimeMs >= statSync(src).mtimeMs) continue;
  mkdirSync(dirname(out), { recursive: true });
  await sharp(src).resize(1200, 630, { fit: 'cover', position: 'top' }).jpeg({ quality: 82, mozjpeg: true }).toFile(out);
  made++;
}
console.log(`og images: ${images.size} in use, ${made} written`);
