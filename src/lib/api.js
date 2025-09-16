const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

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
  const res = await fetch(`${API_BASE_URL}/api/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updatePost(id, body) {
  const res = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deletePost(id) {
  const res = await fetch(`${API_BASE_URL}/api/posts/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}


