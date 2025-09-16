import { notFound } from "next/navigation";

async function getPost(id: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
  const res = await fetch(`${base}/api/posts/${id}`, { next: { revalidate: 15 } });
  if (!res.ok) return null;
  return res.json();
}

export default async function PostPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const post = await getPost(id);
  if (!post) return notFound();
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm text-muted-foreground mb-6">{post.category} • {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}</p>
      {post.coverUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.coverUrl} alt="cover" className="mb-6 w-full h-auto rounded" />
      )}
      <article className="prose dark:prose-invert max-w-none whitespace-pre-wrap leading-7">
        {post.content}
      </article>
    </div>
  );
}


