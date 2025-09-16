import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, "../data");
const postsFile = path.resolve(dataDir, "posts.json");

function ensureFiles() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(postsFile)) fs.writeFileSync(postsFile, JSON.stringify([]), "utf-8");
}

export function readPostsFromDisk() {
  try {
    ensureFiles();
    const raw = fs.readFileSync(postsFile, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writePostsToDisk(posts) {
  try {
    ensureFiles();
    fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2), "utf-8");
  } catch (e) {
    console.warn("Failed to persist posts.json:", String(e?.message || e));
  }
}


