// Minimal Express server with CORS, MongoDB (Mongoose), and posts CRUD.
import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";

import postsRouter from "./routes/posts.js";
import authRouter from "./routes/auth.js";
import mediaRouter from "./routes/media.js";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/blog";

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use("/uploads", (await import("express")).default.static(path.resolve(process.cwd(), "uploads")));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || "development" });
});

app.use("/api/posts", postsRouter);
app.use("/api/auth", authRouter);
app.use("/api/media", mediaRouter);

app.listen(PORT, () => console.log(`API http://localhost:${PORT}`));

// Try to connect to MongoDB in the background. If it fails, continue running with in-memory fallback.
mongoose
  .connect(MONGO_URI, { dbName: "blog" })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.warn("MongoDB connection failed. Running with in-memory store.");
    console.warn(String(err?.message || err));
  });


