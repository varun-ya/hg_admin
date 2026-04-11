"use client";
import { memo, useState, useCallback, useRef } from "react";
import {
  ArrowLeft, FloppyDisk, Rocket, ArrowSquareOut, Check,
  X, Globe, GlobeX, Gear, UploadSimple, SpinnerGap,
} from "@phosphor-icons/react";
import dynamic from "next/dynamic";
import type { BlogPost } from "./blogTypes";
import type { BlogActions } from "./useBlogState";
import EditorStyles from "./editor/EditorStyles";

const TiptapEditor = dynamic(() => import("./editor/TiptapEditor"), { ssr: false, loading: () => <div className="min-h-[400px] flex items-center justify-center text-[#DCDCDC] text-[14px]">Loading editor...</div> });

const WEBSITE = "https://homeguruworld.com";

function CoverUploadBtn({ onUploaded }: { onUploaded: (url: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const handle = async (f: File) => {
    setBusy(true);
    try {
      const fd = new FormData(); fd.append("file", f);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) onUploaded(data.url);
    } finally { setBusy(false); }
  };
  return (
    <>
      <button onClick={() => ref.current?.click()} disabled={busy} className="h-[36px] px-3 rounded-lg border border-dashed border-[#DCDCDC] bg-[#FAFAFA] text-[11px] text-[#888] hover:border-[#1A8917] hover:text-[#1A8917] cursor-pointer flex items-center gap-1.5 transition-colors disabled:opacity-50">
        {busy ? <SpinnerGap size={13} className="animate-spin" /> : <UploadSimple size={13} />} {busy ? "..." : "Upload"}
      </button>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handle(f); e.target.value = ""; }} />
    </>
  );
}

interface Props {
  post: BlogPost;
  blog: BlogActions;
  onBack: () => void;
}

function PageEditor({ post, blog, onBack }: Props) {
  const [title, setTitle] = useState(post.title);
  const [desc, setDesc] = useState(post.desc);
  const [slug, setSlug] = useState(post.slug);
  const [tags, setTags] = useState(post.tags.join(", "));
  const [coverImage, setCoverImage] = useState(post.coverImage || "");
  const [content, setContent] = useState(post.content || "");
  const [saved, setSaved] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleSave = useCallback(() => {
    const words = content.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
    blog.updateBlog(post.slug, {
      title, desc, slug, tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      coverImage: coverImage || undefined, content,
      readTime: `${Math.max(1, Math.ceil(words / 200))} min read`,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [blog, post.slug, title, desc, slug, tags, coverImage, content]);

  const handlePublish = useCallback(() => {
    handleSave();
    setTimeout(() => blog.publishBlog(post.slug), 100);
  }, [handleSave, blog, post.slug]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-200px)]">
      <EditorStyles />

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-3 bg-white border-b border-[#F5F5F5] sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-[#888] hover:text-[#1A1A1A] bg-transparent border-none cursor-pointer transition-colors"><ArrowLeft size={18} /></button>
          <span className="text-[12px] text-[#DCDCDC] hidden sm:inline font-mono">/blogs/{slug}</span>
        </div>
        <div className="flex items-center gap-2">
          {saved && <span className="flex items-center gap-1 text-[11px] text-[#059669]"><Check size={12} weight="bold" /> Saved</span>}
          <button onClick={() => window.open(`${WEBSITE}/blogs/${slug}`, "_blank")} title="View on website" className="text-[#CACACA] hover:text-[#1A1A1A] bg-transparent border-none cursor-pointer transition-colors p-1.5"><ArrowSquareOut size={16} /></button>
          <button onClick={() => setShowSettings(!showSettings)} className={`p-1.5 rounded-lg transition-colors cursor-pointer border-none ${showSettings ? "bg-[#1A1A1A] text-white" : "text-[#CACACA] hover:text-[#1A1A1A] bg-transparent"}`}><Gear size={16} /></button>
          <button onClick={handleSave} className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-[#555] border border-[#EBEBEB] rounded-lg text-[11px] font-medium cursor-pointer hover:bg-[#FAFAFA] transition-colors"><FloppyDisk size={13} /> Save</button>
          <button onClick={handlePublish} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] font-medium cursor-pointer border-none transition-colors ${post.published ? "bg-[#F0F3FA] text-[#293763] hover:bg-[#E0E8F5]" : "bg-[#1A8917] text-white hover:bg-[#156D12]"}`}>
            {post.published ? <><Check size={12} /> Published</> : <><Rocket size={12} /> Publish</>}
          </button>
        </div>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="px-4 sm:px-8 py-5 border-b border-[#F5F5F5] bg-[#FAFAFA]">
          <div className="max-w-[680px] mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-medium text-[#ACACAC] uppercase tracking-wider mb-1">URL Slug</label>
              <div className="flex items-center h-[36px] border border-[#EBEBEB] rounded-lg overflow-hidden bg-white">
                <span className="px-2 text-[10px] text-[#CACACA] bg-[#F5F5F5] h-full flex items-center border-r border-[#EBEBEB]">/blogs/</span>
                <input value={slug} onChange={(e) => setSlug(e.target.value)} className="flex-1 h-full px-2 text-[12px] font-mono text-[#888] border-none outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-medium text-[#ACACAC] uppercase tracking-wider mb-1">Tags</label>
              <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tutoring, Study Tips" className="w-full h-[36px] px-3 border border-[#EBEBEB] rounded-lg text-[12px] text-[#555] bg-white outline-none focus:border-[#1A8917]" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-medium text-[#ACACAC] uppercase tracking-wider mb-1">Cover Image</label>
              <div className="flex gap-2">
                <input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://... or upload" className="flex-1 h-[36px] px-3 border border-[#EBEBEB] rounded-lg text-[12px] font-mono text-[#888] bg-white outline-none focus:border-[#1A8917]" />
                <CoverUploadBtn onUploaded={setCoverImage} />
              </div>
            </div>
            <div className="sm:col-span-2 p-3 bg-white rounded-lg border border-[#F0F0F0]">
              <p className="text-[9px] text-[#CACACA] uppercase tracking-wider mb-1.5">Search Preview</p>
              <p className="text-[14px] text-[#1A0DAB] truncate" style={{ fontFamily: "Arial" }}>{title || "Untitled"}</p>
              <p className="text-[11px] text-[#006621] truncate" style={{ fontFamily: "Arial" }}>homeguruworld.com/blogs/{slug}</p>
              <p className="text-[11px] text-[#545454] line-clamp-2" style={{ fontFamily: "Arial" }}>{desc || "No description"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Editor area */}
      <div className="flex-1 bg-white overflow-y-auto">
        <div className="max-w-[680px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Cover image */}
          {coverImage && (
            <div className="mb-8 rounded-xl overflow-hidden relative group">
              <img src={coverImage} alt="" className="w-full h-auto max-h-[320px] object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              <button onClick={() => setCoverImage("")} className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-none"><X size={12} weight="bold" /></button>
            </div>
          )}

          {/* Title */}
          <input
            value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full text-[28px] sm:text-[40px] text-[#1A1A1A] border-none outline-none bg-transparent leading-[1.15] tracking-tight placeholder:text-[#DCDCDC] mb-2"
            style={{ fontFamily: "'Season Mix', Georgia, serif", fontWeight: 400 }}
          />

          {/* Subtitle */}
          <textarea
            value={desc} onChange={(e) => setDesc(e.target.value)}
            placeholder="Tell readers what this post is about..."
            rows={2}
            className="w-full text-[16px] sm:text-[20px] text-[#888] border-none outline-none bg-transparent leading-relaxed placeholder:text-[#DCDCDC] mb-6 resize-none"
          />

          <div className="w-10 h-px bg-[#EBEBEB] mb-6" />

          {/* Tiptap Editor */}
          <TiptapEditor content={content} onChange={setContent} />
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-2 border-t border-[#F5F5F5] bg-[#FAFAFA] shrink-0">
        <div className="flex items-center gap-3 text-[10px] text-[#CACACA]">
          <span className="flex items-center gap-1">{post.published ? <Globe size={10} /> : <GlobeX size={10} />} {post.published ? "Published" : "Draft"}</span>
          <span>{post.date}</span>
          <span>{post.readTime}</span>
        </div>
        <span className="text-[10px] text-[#DCDCDC]">Select text for formatting · ⌘B ⌘I ⌘U ⌘K ⌘Z</span>
      </div>
    </div>
  );
}

export default memo(PageEditor);
