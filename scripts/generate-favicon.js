import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateFavicon() {
  const inputPath = path.join(__dirname, '..', 'public', 'logo.png');
  const outputPath = path.join(__dirname, '..', 'public', 'favicon.ico');
  
  // Generate 32x32 PNG for favicon
  const pngBuffer = await sharp(inputPath)
    .resize(32, 32)
    .png()
    .toBuffer();
  
  // Create a simple ICO file (with PNG inside)
  // ICO header: 6 bytes
  const iconDirHeader = Buffer.alloc(6);
  iconDirHeader.writeUInt16LE(0, 0);  // Reserved
  iconDirHeader.writeUInt16LE(1, 2);  // Image type (1 = ICO)
  iconDirHeader.writeUInt16LE(1, 4);  // Number of images
  
  // ICO directory entry: 16 bytes
  const iconDirEntry = Buffer.alloc(16);
  iconDirEntry.writeUInt8(32, 0);     // Width
  iconDirEntry.writeUInt8(32, 1);     // Height
  iconDirEntry.writeUInt8(0, 2);      // Color palette
  iconDirEntry.writeUInt8(0, 3);      // Reserved
  iconDirEntry.writeUInt16LE(1, 4);   // Color planes
  iconDirEntry.writeUInt16LE(32, 6);  // Bits per pixel
  iconDirEntry.writeUInt32LE(pngBuffer.length, 8);  // Image size
  iconDirEntry.writeUInt32LE(22, 12); // Offset (6 + 16 = 22)
  
  // Combine all parts
  const icoBuffer = Buffer.concat([iconDirHeader, iconDirEntry, pngBuffer]);
  
  fs.writeFileSync(outputPath, icoBuffer);
  console.log('✅ favicon.ico generated successfully!');
}

generateFavicon().catch(console.error);
