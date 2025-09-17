import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import { requireAuth } from "../middleware/auth.js";

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

router.post("/upload", requireAuth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const filenameBase = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const outputPath = path.join(uploadDir, `${filenameBase}.webp`);

    // Convert to WebP regardless of input type
    await sharp(req.file.buffer).toFormat("webp", { quality: 85 }).toFile(outputPath);

    // Build an absolute URL that works locally and on Vercel. Prefer env, else infer from request.
    const forwardedProto = (req.headers["x-forwarded-proto"] || "").toString().split(",")[0]?.trim();
    const forwardedHost = (req.headers["x-forwarded-host"] || req.headers.host || "").toString().split(",")[0]?.trim();
    const originFromHeaders = forwardedHost ? `${forwardedProto || "https"}://${forwardedHost}` : "";
    const baseUrl = process.env.PUBLIC_BASE_URL || originFromHeaders || `http://localhost:${process.env.PORT || 4000}`;
    const publicUrl = `${baseUrl}/uploads/${path.basename(outputPath)}`;
    res.status(201).json({ url: publicUrl });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to process image" });
  }
});

export default router;


