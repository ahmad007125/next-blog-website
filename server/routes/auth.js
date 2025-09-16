import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

// Very simple admin credential (for demo). Replace with real user store later.
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

router.post("/login", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "Email and password are required" });
  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) return res.status(401).json({ error: "Invalid credentials" });

  const secret = process.env.JWT_SECRET || "dev_secret_change_me";
  const token = jwt.sign({ sub: "admin", email, role: "admin" }, secret, { expiresIn: "1d" });
  res.json({ token, user: { email, role: "admin" } });
});

export default router;


