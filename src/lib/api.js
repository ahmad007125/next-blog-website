// Prefer relative API path so Next.js can proxy to the Express server via rewrites.
// If NEXT_PUBLIC_API_BASE_URL is set (e.g., production), use it instead.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

/**
 * Fetch all posts from the Express backend.
 * Returns an array of posts. On error, returns an empty array.
 */
export async function getPosts() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/posts`, {
      // Revalidate periodically when used in Next.js Server Components
      // Next.js will ignore this in client components
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      console.error("Failed to fetch posts:", res.status, await res.text());
      return [];
    }

    const data = await res.json();
    // Support both { items: [...] } and direct array responses
    const items = Array.isArray(data) ? data : Array.isArray(data.items) ? data.items : [];
    return items;
  } catch (err) {
    console.error("getPosts error:", err);
    return [];
  }
}

export async function createPost(body) {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
  const res = await fetch(`${API_BASE_URL}/api/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updatePost(id, body) {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
  const res = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deletePost(id) {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
  const res = await fetch(`${API_BASE_URL}/api/posts/${id}`, { method: "DELETE", headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}


