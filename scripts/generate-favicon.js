const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

async function generateFavicons() {
  try {
    const sourceIcon = path.join(process.cwd(), 'app', 'icon.png');
    const publicDir = path.join(process.cwd(), 'public');
    const appDir = path.join(process.cwd(), 'app');

    // Ensure directories exist
    await fs.mkdir(publicDir, { recursive: true });

    // First, trim transparent pixels and generate a clean base icon
    const trimmedBuffer = await sharp(sourceIcon)
      .trim()
      .toBuffer();

    // Save the trimmed version back to app/icon.png
    await sharp(trimmedBuffer)
      .toFile(sourceIcon);

    // Generate favicon.png (32x32)
    await sharp(trimmedBuffer)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toFormat('png')
      .toFile(path.join(publicDir, 'favicon.png'));

    // Generate apple-touch-icon.png (180x180)
    await sharp(trimmedBuffer)
      .resize(180, 180, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toFormat('png')
      .toFile(path.join(publicDir, 'apple-touch-icon.png'));

    // Generate icon.png (512x512)
    await sharp(trimmedBuffer)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toFormat('png')
      .toFile(path.join(publicDir, 'icon.png'));

    // Generate various sizes for manifest
    const sizes = [192, 384, 512];
    for (const size of sizes) {
      await sharp(trimmedBuffer)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .toFormat('png')
        .toFile(path.join(publicDir, `icon-${size}x${size}.png`));
    }

    console.log('✅ Favicons generated successfully!');
    console.log('✅ Main icon trimmed and updated!');
  } catch (error) {
    console.error('Error generating favicons:', error);
    process.exit(1);
  }
}

generateFavicons(); 