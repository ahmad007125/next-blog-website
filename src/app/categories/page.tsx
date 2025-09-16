import Link from "next/link";
import { getPosts } from "@/lib/api";

export default async function CategoriesPage() {
  const posts = await getPosts();
  const categories = Array.from(
    new Set(posts.map((p: any) => (p.category || "General").toString()))
  ).sort((a, b) => a.localeCompare(b));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Categories</h1>
      {categories.length === 0 ? (
        <p className="text-muted-foreground">No categories yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {categories.map((c) => (
            <Link
              key={c}
              href={`/?category=${encodeURIComponent(c)}`}
              className="rounded-md border px-4 py-3 hover:bg-accent hover:text-accent-foreground transition"
            >
              {c}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}


