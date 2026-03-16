import fs from 'node:fs/promises';
import path from 'node:path';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config({ path: '.env.local' });

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error('Missing OPENAI_API_KEY in environment.');
  process.exit(1);
}

const client = new OpenAI({ apiKey });

const outputDir = path.join(process.cwd(), 'public', 'images');

const shots = [
  {
    filename: 'hero-chess-king.png',
    size: '1536x1024',
    prompt: `Luxury cinematic editorial photograph of a black stone chess king statue, centered and powerful, dramatic museum-style lighting, deep charcoal background, subtle dust in the air, high contrast but refined, mysterious premium mood, strategic symbolism, elegant shadows, realistic texture, no text, no watermark, no extra objects, ultra clean composition, premium direct-response brand aesthetic.`,
  },
  {
    filename: 'marble-bust.png',
    size: '1536x1024',
    prompt: `Premium editorial photograph of a marble bust fragment in a dark gallery environment, black and off-white palette, subtle red undertone in lighting, cinematic rim light, luxury brand campaign feel, calm and structured composition, realistic stone texture, mysterious and elite, no text, no watermark, no clutter.`,
  },
  {
    filename: 'strategy-architecture.png',
    size: '1536x1024',
    prompt: `Cinematic architectural editorial image, dark modern structure with sharp lines and strategic geometry, moody black and charcoal palette, subtle off-white highlights, refined luxury visual language, minimal and powerful, no people, no text, no watermark, premium consulting brand aesthetic, strong composition for a website section image.`,
  },
  {
    filename: 'intelligence-symbols.png',
    size: '1536x1024',
    prompt: `Abstract premium editorial visual representing intelligence, systems, strategy, and hidden power, dark black charcoal environment, subtle geometric patterns, elegant symbolic forms, cinematic lighting, minimal luxury style, sophisticated and mysterious, no text, no watermark, not generic AI art, suitable for high-end brand website imagery.`,
  },
  {
    filename: 'smoke-power-texture.png',
    size: '1536x1024',
    prompt: `Dark cinematic texture image with drifting smoke, dust, shadow, and subtle sculptural form, black charcoal and off-white palette, refined luxury editorial feeling, mysterious strategic atmosphere, minimal composition, premium background visual for a high-end landing page, no text, no watermark.`,
  },
];

await fs.mkdir(outputDir, { recursive: true });

for (const shot of shots) {
  console.log(`Generating ${shot.filename}...`);

  const result = await client.images.generate({
    model: 'gpt-image-1',
    size: shot.size,
    quality: 'high',
    output_format: 'png',
    prompt: shot.prompt,
  });

  const imageBase64 = result.data?.[0]?.b64_json;

  if (!imageBase64) {
    throw new Error(`No image returned for ${shot.filename}`);
  }

  const filePath = path.join(outputDir, shot.filename);
  await fs.writeFile(filePath, Buffer.from(imageBase64, 'base64'));
  console.log(`Saved ${filePath}`);
}

console.log('Done.');
