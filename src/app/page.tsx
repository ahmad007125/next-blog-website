import { BlogCard } from "@/components/blog-card";
import { getPosts } from "@/lib/api";
import Link from "next/link";

export default async function Home({ searchParams }: { searchParams?: { category?: string } }) {
  const posts = await getPosts();
  const activeCategory = searchParams?.category;
  const filtered = activeCategory ? posts.filter((p: any) => (p.category || "General") === activeCategory) : posts;

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
        {filtered.map((p: any) => (
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
