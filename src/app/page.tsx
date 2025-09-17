// File: src/app/page.tsx

import { BlogCard } from "@/components/blog-card";
import { getPosts } from "@/lib/api";
import Link from "next/link";

// Define the expected type for searchParams as Next.js expects it
// This is the key change to resolve the build error.
export default async function Home({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const posts = await getPosts();

  // Safely access the 'category' from searchParams.
  // Note: searchParams[key] returns 'string | string[] | undefined'.
  // We explicitly cast it to string | undefined for your usage,
  // assuming 'category' will always be a single string for your case.
  const rawCategory = sp?.category;
  const activeCategory = typeof rawCategory === "string" ? rawCategory : Array.isArray(rawCategory) ? rawCategory[0] : undefined;

  const filtered = activeCategory
    ? posts.filter((p: { category?: string }) => (p.category || "General") === activeCategory)
    : posts;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Latest Posts</h1>
        {activeCategory && (
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <span>Category:</span>
            <span className="font-medium">{activeCategory}</span>
            <Link href="/" className="underline underline-offset-4">Clear</Link>
          </div>
        )}
        </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p: { _id?: string; slug?: string; title: string; category?: string; description?: string; excerpt?: string }) => (
          <BlogCard
            key={p._id || p.slug}
            title={p.title}
            category={p.category || "General"}
            description={p.description || p.excerpt || ""}
            href={`/posts/${p.slug || p._id}`}
          />
        ))}
      </div>
    </div>
  );
}