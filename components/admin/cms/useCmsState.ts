"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import type { CmsPage, PageStatus } from "./cmsTypes";
import { cmsPages as fallbackPages } from "./cmsMockData";

function generateId() {
  return `PG-${Date.now().toString(36).toUpperCase()}`;
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function now() {
  return new Date().toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true });
}

async function apiGet(): Promise<CmsPage[]> {
  try {
    const res = await fetch("/api/cms");
    const data = await res.json();
    if (data.success && Array.isArray(data.data) && data.data.length > 0) return data.data;
  } catch {}
  return [];
}

async function apiPost(body: any) {
  try {
    await fetch("/api/cms", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  } catch (e) {
    console.error("CMS API error:", e);
  }
}

export interface CmsActions {
  pages: CmsPage[];
  loading: boolean;
  createPage: (parentPath: string, title: string, template: CmsPage["template"]) => CmsPage;
  deletePage: (id: string) => void;
  duplicatePage: (id: string) => CmsPage | null;
  renamePage: (id: string, newTitle: string) => void;
  renameSlug: (id: string, newSlug: string) => void;
  publishPage: (id: string) => void;
  unpublishPage: (id: string) => void;
  archivePage: (id: string) => void;
  schedulePage: (id: string) => void;
  updatePage: (id: string, updates: Partial<CmsPage>) => void;
  getPage: (id: string) => CmsPage | undefined;
  syncToFile: () => Promise<void>;
  seedDefaults: () => Promise<void>;
}

export function useCmsState(): CmsActions {
  const [pages, setPages] = useState<CmsPage[]>(fallbackPages);
  const [loading, setLoading] = useState(true);
  const pagesRef = useRef(pages);
  pagesRef.current = pages;

  // Load from API on mount
  useEffect(() => {
    (async () => {
      const remote = await apiGet();
      if (remote.length > 0) setPages(remote);
      setLoading(false);
    })();
  }, []);

  // Persist to API after every change (debounced)
  const saveTimer = useRef<ReturnType<typeof setTimeout>>();
  const persistToApi = useCallback(() => {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      apiPost({ action: "bulk_write", pages: pagesRef.current });
    }, 500);
  }, []);

  const mutate = useCallback((fn: (prev: CmsPage[]) => CmsPage[]) => {
    setPages((prev) => {
      const next = fn(prev);
      pagesRef.current = next;
      persistToApi();
      return next;
    });
  }, [persistToApi]);

  const createPage = useCallback((parentPath: string, title: string, template: CmsPage["template"]): CmsPage => {
    const slug = parentPath === "/" ? `/${slugify(title)}` : `${parentPath}/${slugify(title)}`;
    const page: CmsPage = {
      id: generateId(), title, slug, status: "draft", lastEdited: now(),
      editedBy: "admin@homeguruworld.com", template, views: 0, seoScore: 50,
      metaTitle: title, metaDescription: "", ogImage: "",
      canonicalUrl: `https://homeguruworld.com${slug}`, content: "",
    };
    mutate((prev) => [...prev, page]);
    return page;
  }, [mutate]);

  const deletePage = useCallback((id: string) => {
    mutate((prev) => prev.filter((p) => p.id !== id));
  }, [mutate]);

  const duplicatePage = useCallback((id: string): CmsPage | null => {
    let copy: CmsPage | null = null;
    mutate((prev) => {
      const original = prev.find((p) => p.id === id);
      if (!original) return prev;
      copy = { ...original, id: generateId(), title: `${original.title} (Copy)`, slug: `${original.slug}-copy`, status: "draft" as PageStatus, lastEdited: now(), views: 0 };
      return [...prev, copy];
    });
    return copy;
  }, [mutate]);

  const renamePage = useCallback((id: string, newTitle: string) => {
    mutate((prev) => prev.map((p) => p.id === id ? { ...p, title: newTitle, metaTitle: newTitle, lastEdited: now() } : p));
  }, [mutate]);

  const renameSlug = useCallback((id: string, newSlug: string) => {
    const slug = newSlug.startsWith("/") ? newSlug : `/${newSlug}`;
    mutate((prev) => prev.map((p) => p.id === id ? { ...p, slug, canonicalUrl: `https://homeguruworld.com${slug}`, lastEdited: now() } : p));
  }, [mutate]);

  const setStatus = useCallback((id: string, status: PageStatus) => {
    mutate((prev) => prev.map((p) => p.id === id ? { ...p, status, lastEdited: now() } : p));
  }, [mutate]);

  const publishPage = useCallback((id: string) => setStatus(id, "published"), [setStatus]);
  const unpublishPage = useCallback((id: string) => setStatus(id, "draft"), [setStatus]);
  const archivePage = useCallback((id: string) => setStatus(id, "archived"), [setStatus]);
  const schedulePage = useCallback((id: string) => setStatus(id, "scheduled"), [setStatus]);

  const updatePage = useCallback((id: string, updates: Partial<CmsPage>) => {
    mutate((prev) => prev.map((p) => p.id === id ? { ...p, ...updates, lastEdited: now() } : p));
  }, [mutate]);

  const getPage = useCallback((id: string) => pagesRef.current.find((p) => p.id === id), []);

  const syncToFile = useCallback(async () => {
    await apiPost({ action: "bulk_write", pages: pagesRef.current });
  }, []);

  const seedDefaults = useCallback(async () => {
    setPages(fallbackPages);
    await apiPost({ action: "bulk_write", pages: fallbackPages });
  }, []);

  return {
    pages, loading, createPage, deletePage, duplicatePage, renamePage, renameSlug,
    publishPage, unpublishPage, archivePage, schedulePage, updatePage, getPage,
    syncToFile, seedDefaults,
  };
}
