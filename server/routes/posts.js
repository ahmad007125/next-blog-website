import { Router } from "express";
import mongoose from "mongoose";
import Post from "../models/Post.js";
import { readPostsFromDisk, writePostsToDisk } from "../utils/store.js";

// In-memory fallback when DB is not connected
const memory = {
  posts: readPostsFromDisk(),
};

function isDbConnected() {
  const ready = mongoose.connection.readyState; // 1=connected
  return ready === 1;
}

function slugify(input) {
  return String(input)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function ensureUniqueSlug(baseSlug, list) {
  let slug = baseSlug;
  let counter = 1;
  const exists = (s) => list.some((p) => p.slug === s);
  while (exists(slug)) {
    slug = `${baseSlug}-${counter++}`;
  }
  return slug;
}

const router = Router();

router.get("/", async (_req, res) => {
  try {
    if (isDbConnected()) {
      const items = await Post.find().sort({ createdAt: -1 }).limit(100);
      return res.json({ items });
    }
    return res.json({ items: memory.posts });
  } catch (e) {
    res.status(500).json({ error: "Internal error" });
  }
});

// Get by id
// Resolve post by id or slug
router.get("/:idOrSlug", async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    if (isDbConnected()) {
      let doc = null;
      if (mongoose.isValidObjectId(idOrSlug)) {
        doc = await Post.findById(idOrSlug);
      } else {
        doc = await Post.findOne({ slug: idOrSlug });
      }
      if (!doc) return res.status(404).json({ error: "Not found" });
      return res.json(doc);
    }
    const found = memory.posts.find((p) => p._id === idOrSlug || p.slug === idOrSlug);
    if (!found) return res.status(404).json({ error: "Not found" });
    return res.json(found);
  } catch (e) {
    res.status(500).json({ error: "Internal error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, category, description, content } = req.body;
    if (!title || !category || !description || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if (isDbConnected()) {
      const baseSlug = slugify(title);
      const created = await Post.create({ title, category, description, content, slug: baseSlug, coverUrl: req.body.coverUrl });
      return res.status(201).json(created);
    }
    const created = {
      _id: Math.random().toString(36).slice(2),
      slug: ensureUniqueSlug(slugify(title), memory.posts),
      title,
      category,
      description,
      content,
      coverUrl: req.body.coverUrl || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memory.posts.unshift(created);
    writePostsToDisk(memory.posts);
    return res.status(201).json(created);
  } catch (e) {
    if (e?.name === "ValidationError") {
      return res.status(400).json({ error: e.message });
    }
    res.status(500).json({ error: "Internal error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (isDbConnected()) {
      if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });
      const updated = await Post.findByIdAndUpdate(id, req.body, { new: true });
      if (!updated) return res.status(404).json({ error: "Not found" });
      return res.json(updated);
    }
    const idx = memory.posts.findIndex((p) => p._id === id);
    if (idx === -1) return res.status(404).json({ error: "Not found" });
    memory.posts[idx] = { ...memory.posts[idx], ...req.body, updatedAt: new Date().toISOString() };
    writePostsToDisk(memory.posts);
    return res.json(memory.posts[idx]);
  } catch (e) {
    res.status(500).json({ error: "Internal error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (isDbConnected()) {
      if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });
      const deleted = await Post.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ error: "Not found" });
      return res.json({ ok: true });
    }
    const before = memory.posts.length;
    memory.posts = memory.posts.filter((p) => p._id !== id);
    writePostsToDisk(memory.posts);
    if (memory.posts.length === before) return res.status(404).json({ error: "Not found" });
    return res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "Internal error" });
  }
});

export default router;


