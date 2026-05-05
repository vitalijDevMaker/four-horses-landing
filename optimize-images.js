import fs from "fs/promises";
import { glob } from "glob";
import path from "path";
import sharp from "sharp";

const IMAGE_DIR = "./src/assets/img";

async function optimizeImages() {
  const images = await glob(`${IMAGE_DIR}/**/*.{jpg,jpeg,png,webp}`, {
    absolute: true,
  });

  for (const imagePath of images) {
    const ext = path.extname(imagePath).toLowerCase();
    const tempPath = `${imagePath}.tmp`;

    try {
      let pipeline = sharp(imagePath);

      switch (ext) {
        case ".jpg":
        case ".jpeg":
          pipeline = pipeline.jpeg({ quality: 75, mozjpeg: true });
          break;
        case ".png":
          pipeline = pipeline.png({ quality: 75, compressionLevel: 9 });
          break;
        case ".webp":
          pipeline = pipeline.webp({ quality: 75 });
          break;
        default:
          continue;
      }

      await pipeline.toFile(tempPath);
      await fs.rename(tempPath, imagePath);
      console.log(`✅ ${path.basename(imagePath)}`);
    } catch (err) {
      console.error(`❌ ${path.basename(imagePath)}: ${err.message}`);
      try {
        await fs.unlink(tempPath);
      } catch (e) {}
    }
  }

  console.log("🎉 Готово!");
}

optimizeImages().catch(console.error);
