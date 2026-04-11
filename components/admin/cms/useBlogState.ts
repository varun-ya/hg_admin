"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { BLOGS as fallbackBlogs, type BlogPost } from "@/components/admin/cms/blogTypes";

function generateSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function now() {
  return new Date().toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

async function apiGet(): Promise<BlogPost[]> {
  try {
    const res = await fetch("/api/cms");
    const data = await res.json();
    if (data.success && Array.isArray(data.data) && data.data.length > 0) return data.data;
  } catch {}
  return [];
}

async function apiSaveAll(blogs: BlogPost[]) {
  try {
    await fetch("/api/cms", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "save_all", blogs }) });
  } catch (e) { console.error("Blog sync error:", e); }
}

export interface BlogActions {
  blogs: BlogPost[];
  loading: boolean;
  createBlog: (title: string) => BlogPost;
  updateBlog: (slug: string, updates: Partial<BlogPost>) => void;
  deleteBlog: (slug: string) => void;
  duplicateBlog: (slug: string) => BlogPost | null;
  publishBlog: (slug: string) => void;
  unpublishBlog: (slug: string) => void;
  getBlog: (slug: string) => BlogPost | undefined;
  seedDefaults: () => void;
}

export function useBlogState(): BlogActions {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(blogs);
  ref.current = blogs;

  useEffect(() => {
    (async () => {
      const remote = await apiGet();
      if (remote.length > 0) setBlogs(remote);
      setLoading(false);
    })();
  }, []);

  const timer = useRef<ReturnType<typeof setTimeout>>();
  const persist = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => apiSaveAll(ref.current), 400);
  }, []);

  const mutate = useCallback((fn: (prev: BlogPost[]) => BlogPost[]) => {
    setBlogs((prev) => { const next = fn(prev); ref.current = next; persist(); return next; });
  }, [persist]);

  const createBlog = useCallback((title: string): BlogPost => {
    const blog: BlogPost = {
      slug: generateSlug(title), title, desc: "", date: now(),
      tags: [], color: "#F97316",
      author: { name: "HomeGuru Team", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=homeguru", role: "Editorial" },
      readTime: "1 min read", content: "", published: false,
    };
    mutate((prev) => [blog, ...prev]);
    return blog;
  }, [mutate]);

  const updateBlog = useCallback((slug: string, updates: Partial<BlogPost>) => {
    mutate((prev) => prev.map((b) => b.slug === slug ? { ...b, ...updates, date: now() } : b));
  }, [mutate]);

  const deleteBlog = useCallback((slug: string) => {
    mutate((prev) => prev.filter((b) => b.slug !== slug));
  }, [mutate]);

  const duplicateBlog = useCallback((slug: string): BlogPost | null => {
    let copy: BlogPost | null = null;
    mutate((prev) => {
      const orig = prev.find((b) => b.slug === slug);
      if (!orig) return prev;
      copy = { ...orig, slug: `${orig.slug}-copy`, title: `${orig.title} (Copy)`, published: false, date: now() };
      return [copy!, ...prev];
    });
    return copy;
  }, [mutate]);

  const publishBlog = useCallback((slug: string) => {
    mutate((prev) => prev.map((b) => b.slug === slug ? { ...b, published: true, date: now() } : b));
  }, [mutate]);

  const unpublishBlog = useCallback((slug: string) => {
    mutate((prev) => prev.map((b) => b.slug === slug ? { ...b, published: false, date: now() } : b));
  }, [mutate]);

  const getBlog = useCallback((slug: string) => ref.current.find((b) => b.slug === slug), []);

  const seedDefaults = useCallback(() => {
    setBlogs(fallbackBlogs);
    ref.current = fallbackBlogs;
    apiSaveAll(fallbackBlogs);
  }, []);

  return { blogs, loading, createBlog, updateBlog, deleteBlog, duplicateBlog, publishBlog, unpublishBlog, getBlog, seedDefaults };
}
