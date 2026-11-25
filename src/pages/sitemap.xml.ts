import type { APIRoute } from 'astro';
import { SITE } from '../config/site';

const pages = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/privacy/', priority: '0.4', changefreq: 'monthly' },
  { path: '/terms/', priority: '0.4', changefreq: 'monthly' },
];

export const GET: APIRoute = () => {
  const lastmod = new Date().toISOString().split('T')[0];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) => `  <url>
    <loc>${new URL(p.path, SITE.siteUrl).toString()}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
