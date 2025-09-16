"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getPosts, createPost, updatePost, deletePost } from "@/lib/api";

type Post = {
  _id?: string;
  title: string;
  category?: string;
  description?: string;
  content?: string;
  createdAt?: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [uploading, setUploading] = useState(false);

  const categories = useMemo(() => ["General", "Tech", "Design", "Business"], []);

  async function load() {
    setLoading(true);
    const data = await getPosts();
    setPosts(data);
    setLoading(false);
  }

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    load();
  }, []);

  function openCreate() {
    setEditing({ title: "", category: categories[0], content: "", description: "", coverUrl: "" } as any);
    setOpen(true);
  }

  function openEdit(p: Post) {
    setEditing({ ...p });
    setOpen(true);
  }

  async function handleSubmit() {
    if (!editing) return;
    const isNew = !editing._id;
    const body = {
      title: editing.title,
      category: editing.category,
      description: editing.description,
      content: editing.content,
      coverUrl: (editing as any).coverUrl || undefined,
    };
    try {
      if (isNew) {
        await createPost(body);
      } else {
        await updatePost(editing._id as string, body);
      }
      setOpen(false);
      setEditing(null);
      await load();
    } catch (e) {
      console.error(e);
      const message = e instanceof Error ? e.message : "Failed to save post";
      alert(message);
    }
  }

  async function handleDelete(id?: string) {
    if (!id) return;
    if (!confirm("Delete this post?")) return;
    try {
      await deletePost(id);
      await load();
    } catch (e) {
      console.error(e);
      alert("Failed to delete");
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <Button onClick={openCreate}>Add Post</Button>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4}>Loading...</TableCell>
              </TableRow>
            ) : posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>No posts found.</TableCell>
              </TableRow>
            ) : (
              posts.map((p) => (
                <TableRow key={p._id || p.title}>
                  <TableCell className="max-w-[280px] truncate">{p.title}</TableCell>
                  <TableCell>{p.category || "-"}</TableCell>
                  <TableCell>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "-"}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="secondary" onClick={() => openEdit(p)}>Edit</Button>
                    <Button variant="outline" onClick={() => handleDelete(p._id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeader>{editing?. _id ? "Edit Post" : "Add Post"}</DialogHeader>
        <DialogContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={editing?.title || ""} onChange={(e) => setEditing((s) => s ? { ...s, title: e.target.value } : s)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select id="category" value={editing?.category || categories[0]} onChange={(e) => setEditing((s) => s ? { ...s, category: e.target.value } : s)}>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">Cover Image</Label>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    setUploading(true);
                    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
                    const fd = new FormData();
                    fd.append("file", file);
                    const res = await fetch(`${base}/api/media/upload`, { method: "POST", body: fd });
                    if (!res.ok) throw new Error(await res.text());
                    const data = await res.json();
                    setEditing((s) => s ? { ...s, coverUrl: data.url } as any : s);
                  } catch (err) {
                    alert("Image upload failed");
                  } finally {
                    setUploading(false);
                  }
                }}
              />
              {(editing as any)?.coverUrl && (
                <img src={(editing as any).coverUrl} alt="cover" className="mt-2 h-32 w-52 object-cover rounded" />
              )}
              {uploading && <span className="text-xs text-muted-foreground">Uploading...</span>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Short Description</Label>
              <Textarea id="description" value={editing?.description || ""} onChange={(e) => setEditing((s) => s ? { ...s, description: e.target.value } : s)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">Content</Label>
              <Textarea id="content" className="min-h-[160px]" value={editing?.content || ""} onChange={(e) => setEditing((s) => s ? { ...s, content: e.target.value } : s)} />
            </div>
          </div>
        </DialogContent>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>{editing?. _id ? "Save Changes" : "Create"}</Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}


