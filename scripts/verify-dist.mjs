import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const pages = ['index.html', 'privacy/index.html', 'terms/index.html'];

let hasError = false;

function luminance(hex) {
  const clean = hex.replace('#', '');
  const nums = [0, 2, 4].map((i) => {
    const c = parseInt(clean.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * nums[0] + 0.7152 * nums[1] + 0.0722 * nums[2];
}

function contrastRatio(hex1, hex2) {
  const l1 = luminance(hex1);
  const l2 = luminance(hex2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

console.log('=== WCAG Contrast Checks ===');
const checks = [
  ['#FFFFFF', '#090B10', 'Primary Text on Primary BG'],
  ['#A5ADBC', '#090B10', 'Secondary Text on Primary BG'],
  ['#A5ADBC', '#171C27', 'Secondary Text on Card BG'],
  ['#8C95A6', '#171C27', 'Subtle Text on Card BG'],
  ['#A3C0FF', '#090B10', 'Primary Accent on Primary BG'],
  ['#090B10', '#A3C0FF', 'Button Text on Primary Accent'],
];
for (const [fg, bg, label] of checks) {
  const ratio = contrastRatio(fg, bg);
  console.log(`${label}: ${ratio.toFixed(2)}:1 (${ratio >= 4.5 ? 'AA PASS' : 'WARN < 4.5'})`);
  if (ratio < 4.5) hasError = true;
}

for (const page of pages) {
  const fullPath = path.join(distDir, page);
  if (!fs.existsSync(fullPath)) {
    console.error(`MISSING PAGE: ${page}`);
    hasError = true;
    continue;
  }

  const html = fs.readFileSync(fullPath, 'utf8');
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/);
  const descMatch = html.match(/<meta name="description" content="([^"]*)"/);
  const canonMatch = html.match(/<link rel="canonical" href="([^"]*)"/);
  const h1Count = (html.match(/<h1\b/g) || []).length;
  const ldMatches = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];

  console.log(`\n=== ${page} ===`);
  console.log('Title:', titleMatch?.[1]);
  console.log('Meta description length:', descMatch?.[1]?.length);
  console.log('Canonical:', canonMatch?.[1]);
  console.log('H1 count:', h1Count);
  console.log('JSON-LD blocks:', ldMatches.length);

  if (h1Count !== 1) {
    console.error(`ERROR: Expected exactly 1 H1 on ${page}, found ${h1Count}`);
    hasError = true;
  }

  if ((descMatch?.[1]?.length ?? 0) > 165) {
    console.error(`WARN: Meta description slightly long (${descMatch?.[1]?.length}) on ${page}`);
  }

  ldMatches.forEach((m, i) => {
    try {
      const parsed = JSON.parse(m[1]);
      console.log(`  Schema[${i}]:`, parsed['@type'], parsed['@type'] === 'FAQPage' ? `(${parsed.mainEntity.length} Qs)` : '');
    } catch (e) {
      console.error(`ERROR: Invalid JSON-LD on ${page}:`, e.message);
      hasError = true;
    }
  });

  // Check local asset references
  const assetRefs = [...html.matchAll(/(?:src|srcset|href)="([^"]+)"/g)]
    .map((m) => m[1])
    .flatMap((val) => val.split(',').map((s) => s.trim().split(' ')[0]))
    .filter((u) => u.startsWith('/') && !u.startsWith('/#') && u !== '/' && u !== '/privacy/' && u !== '/terms/');

  for (const ref of new Set(assetRefs)) {
    const cleanRef = ref.split('#')[0];
    if (!fs.existsSync(path.join(distDir, cleanRef))) {
      console.error(`MISSING ASSET/ROUTE: ${ref} referenced in ${page}`);
      hasError = true;
    }
  }

  // Visible text guardrails
  const visibleText = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ');

  const forbiddenTerms = [/\bdatabase\b/i, /\bbackend\b/i, /\bAstro\b/i, /\bPostgreSQL\b/i, /\bMongoDB\b/i];
  for (const rx of forbiddenTerms) {
    if (rx.test(visibleText)) {
      console.error(`FORBIDDEN TECH LEAK (${rx}) on ${page}`);
      hasError = true;
    }
  }

  if (page === 'index.html') {
    const ids = new Set([...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]));
    const anchors = [...html.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);
    const broken = [...new Set(anchors)].filter((a) => !ids.has(a));
    console.log('Internal anchors checked:', new Set(anchors).size, 'Broken:', broken);
    if (broken.length > 0) hasError = true;

    const requiredPhrases = [
      '100% FREE FOR MEMBERS',
      'Gyms pay for the FitMate platform',
      'BMI is a screening indicator',
      'What is FitMate?',
      'How can my gym get started with FitMate?',
    ];
    for (const phrase of requiredPhrases) {
      if (!visibleText.includes(phrase)) {
        console.error(`MISSING REQUIRED CONTENT: "${phrase}"`);
        hasError = true;
      }
    }
  }
}

for (const file of ['sitemap.xml', 'robots.txt', 'site.webmanifest', 'favicon.svg', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png']) {
  const exists = fs.existsSync(path.join(distDir, file));
  console.log(`${file}:`, exists ? 'OK' : 'MISSING');
  if (!exists) hasError = true;
}

if (hasError) {
  process.exit(1);
}
console.log('\nALL STATIC SEO, CONTRAST, ASSET & BRAND CHECKS PASSED!');
