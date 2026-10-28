// Sitemap for the live pages only (the prototype routes are noindex). Served at <base>sitemap.xml; xbuild.com's own
// robots.txt (at the domain root) can point to it, or it can be submitted in Search Console.
import type { APIRoute } from 'astro';

const pages = ['', 'product-model/', 'how-it-works/'];

export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL;
  const urls = pages.map((path) => new URL(`${base}${path}`, site ?? 'https://xbuild.com').href);
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${url}</loc></url>`).join('\n')}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
