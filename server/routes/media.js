import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";

const router = Router();

const uploadDir = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
      "image/heic",
      "image/heif",
      "image/avif",
      "image/gif",
      "image/bmp",
      "image/tiff",
    ];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Unsupported file type"));
    }
    cb(null, true);
  },
});

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const filenameBase = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const outputPath = path.join(uploadDir, `${filenameBase}.webp`);

    // Convert to WebP regardless of input type
    await sharp(req.file.buffer).toFormat("webp", { quality: 85 }).toFile(outputPath);

    const publicUrl = `/uploads/${path.basename(outputPath)}`;
    res.status(201).json({ url: publicUrl });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to process image" });
  }
});

export default router;


