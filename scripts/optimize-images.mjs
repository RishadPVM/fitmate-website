import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const ARTIFACT_DIR = 'C:/Users/clanl/.gemini/antigravity/brain/5d37a4d8-03a7-4a90-9a32-670c331b4edf';
const OUT_IMAGES = path.resolve('public/images');
const OUT_PUBLIC = path.resolve('public');

fs.mkdirSync(OUT_IMAGES, { recursive: true });

const photos = [
  {
    src: path.join(ARTIFACT_DIR, 'hero_training_1795607094964.jpg'),
    name: 'hero-training',
    widths: [
      { suffix: '640', width: 640, height: 360 },
      { suffix: '1280', width: 1280, height: 720 },
    ],
  },
  {
    src: path.join(ARTIFACT_DIR, 'intro_studio_1795607199289.jpg'),
    name: 'intro-studio',
    widths: [
      { suffix: '640', width: 640, height: 857 },
      { suffix: '1280', width: 896, height: 1200 },
    ],
  },
  {
    src: path.join(ARTIFACT_DIR, 'download_backdrop_1795607113182.jpg'),
    name: 'download-backdrop',
    widths: [
      { suffix: '640', width: 640, height: 360 },
      { suffix: '1280', width: 1280, height: 720 },
    ],
  },
];

async function run() {
  for (const item of photos) {
    if (!fs.existsSync(item.src)) {
      throw new Error(`Missing source image: ${item.src}`);
    }
    for (const target of item.widths) {
      const base = sharp(item.src).resize(target.width, target.height, {
        fit: 'cover',
        position: 'center',
      });

      await base
        .clone()
        .avif({ quality: 58, effort: 4 })
        .toFile(path.join(OUT_IMAGES, `${item.name}-${target.suffix}.avif`));

      await base
        .clone()
        .webp({ quality: 82 })
        .toFile(path.join(OUT_IMAGES, `${item.name}-${target.suffix}.webp`));
    }
    console.log(`Optimized ${item.name} (AVIF + WebP responsive variants)`);
  }

  // Generate PNG favicons from public/favicon.svg
  const faviconSvg = fs.readFileSync(path.join(OUT_PUBLIC, 'favicon.svg'));
  await sharp(faviconSvg).resize(180, 180).png().toFile(path.join(OUT_PUBLIC, 'apple-touch-icon.png'));
  await sharp(faviconSvg).resize(192, 192).png().toFile(path.join(OUT_PUBLIC, 'icon-192.png'));
  await sharp(faviconSvg).resize(512, 512).png().toFile(path.join(OUT_PUBLIC, 'icon-512.png'));
  console.log('Generated PNG app icons (180, 192, 512)');

  // Generate Open Graph 1200x630 branded image
  const ogOverlaySvg = Buffer.from(`
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="scrim" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#090B10" stop-opacity="0.96"/>
          <stop offset="0.52" stop-color="#090B10" stop-opacity="0.88"/>
          <stop offset="1" stop-color="#090B10" stop-opacity="0.35"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#scrim)"/>
      <rect x="72" y="88" width="44" height="44" rx="12" fill="#11151D" stroke="#A3C0FF" stroke-opacity="0.45" stroke-width="2"/>
      <path d="M84 103C84 100.8 85.8 99 88 99H103" stroke="#FFFFFF" stroke-width="3.2" stroke-linecap="round" fill="none"/>
      <path d="M84 103V121" stroke="#FFFFFF" stroke-width="3.2" stroke-linecap="round" fill="none"/>
      <path d="M84.5 110.5H95L98.5 106L102 115L105.5 110.5" stroke="#A3C0FF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <text x="132" y="119" fill="#FFFFFF" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="28" font-weight="700">FitMate</text>
      <text x="72" y="246" fill="#FFFFFF" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="54" font-weight="800">Your Fitness Journey.</text>
      <text x="72" y="314" fill="#A3C0FF" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="54" font-weight="800">Better Connected.</text>
      <text x="72" y="382" fill="#A5ADBC" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="23" font-weight="400">Attendance tracking, gym connectivity &amp;</text>
      <text x="72" y="416" fill="#A5ADBC" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="23" font-weight="400">personal BMI insights in one platform.</text>
      <rect x="72" y="468" width="286" height="46" rx="23" fill="#171C27" stroke="#A3C0FF" stroke-opacity="0.45"/>
      <text x="215" y="497" text-anchor="middle" fill="#A3C0FF" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="16" font-weight="700" letter-spacing="1.2">100% FREE FOR MEMBERS</text>
    </svg>
  `);

  await sharp(path.join(ARTIFACT_DIR, 'hero_training_1795607094964.jpg'))
    .resize(1200, 630, { fit: 'cover', position: 'right' })
    .composite([{ input: ogOverlaySvg, top: 0, left: 0 }])
    .jpeg({ quality: 86 })
    .toFile(path.join(OUT_IMAGES, 'og-fitmate.jpg'));

  console.log('Generated og-fitmate.jpg (1200x630)');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
