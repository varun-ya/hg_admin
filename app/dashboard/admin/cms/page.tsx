"use client";
import { useState } from "react";
import {
  Plus, PencilSimple, Eye, Trash, Copy, Globe, GlobeX,
  ArrowSquareOut, ArrowsClockwise, MagnifyingGlass, Funnel,
  Article, Check,
} from "@phosphor-icons/react";
import PageEditor from "@/components/admin/cms/PageEditor";
import { useBlogState } from "@/components/admin/cms/useBlogState";
import type { BlogPost } from "@/components/admin/cms/blogTypes";

const WEBSITE = "https://homeguruworld.com";

export default function CmsPage() {
  const blog = useBlogState();
  const [editSlug, setEditSlug] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const editPost = editSlug ? blog.getBlog(editSlug) : null;

  const filtered = blog.blogs.filter((b) => {
    if (filter === "published" && !b.published) return false;
    if (filter === "draft" && b.published) return false;
    if (search && !b.title.toLowerCase().includes(search.toLowerCase()) && !b.slug.includes(search.toLowerCase())) return false;
    return true;
  });

  const publishedCount = blog.blogs.filter((b) => b.published).length;
  const draftCount = blog.blogs.filter((b) => !b.published).length;

  // If editing, show the editor full screen
  if (editPost) {
    return <PageEditor post={editPost} blog={blog} onBack={() => setEditSlug(null)} />;
  }

  return (
    <div className="flex flex-col gap-6 pt-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[18px] sm:text-[20px] font-medium text-[#1A1A1A] font-season">Blog Manager</h2>
          <p className="text-[12px] text-[#ACACAC] mt-0.5">{blog.blogs.length} posts · {publishedCount} published · {draftCount} drafts</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => blog.seedDefaults()} title="Reset to defaults" className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] text-[#CACACA] hover:text-[#888] bg-transparent border-none cursor-pointer transition-colors">
            <ArrowsClockwise size={12} />
          </button>
          <button onClick={() => { setShowCreate(true); setNewTitle(""); }} className="flex items-center gap-1.5 px-4 py-2 bg-[#1A1A1A] text-white rounded-lg text-[12px] font-medium hover:bg-[#333] transition-all cursor-pointer border-none">
            <Plus size={13} weight="bold" /> New Post
          </button>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 flex-1 h-[38px] bg-white border border-[#EBEBEB] rounded-lg px-3 w-full sm:max-w-[320px]">
          <MagnifyingGlass size={14} className="text-[#CACACA] shrink-0" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search posts..." className="flex-1 h-full text-[13px] text-[#1A1A1A] border-none outline-none bg-transparent placeholder:text-[#DCDCDC]" />
        </div>
        <div className="flex items-center gap-1">
          {(["all", "published", "draft"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer border-none capitalize ${filter === f ? "bg-[#1A1A1A] text-white" : "bg-transparent text-[#ACACAC] hover:bg-[#F5F5F5]"}`}>
              {f} {f === "published" ? `(${publishedCount})` : f === "draft" ? `(${draftCount})` : ""}
            </button>
          ))}
        </div>
      </div>

      {/* Blog list */}
      <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Article size={28} className="text-[#DCDCDC]" />
            <p className="text-[13px] text-[#ACACAC]">{search ? "No posts match your search" : "No posts yet"}</p>
            {!search && (
              <button onClick={() => { setShowCreate(true); setNewTitle(""); }} className="text-[12px] font-medium text-[#E08A3C] bg-transparent border-none cursor-pointer hover:underline">
                Create your first post
              </button>
            )}
          </div>
        ) : (
          filtered.map((post, i) => (
            <div
              key={post.slug}
              className={`flex items-center gap-4 px-4 sm:px-6 py-4 sm:py-5 hover:bg-[#FAFAFA] transition-colors cursor-pointer group ${i > 0 ? "border-t border-[#F8F8F8]" : ""}`}
              onClick={() => setEditSlug(post.slug)}
            >
              {/* Cover thumbnail */}
              <div className="w-16 h-16 sm:w-20 sm:h-14 rounded-lg overflow-hidden bg-[#F5F5F5] shrink-0 hidden xs:block">
                {post.coverImage ? (
                  <img src={post.coverImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ background: `${post.color}15` }}>
                    <Article size={20} style={{ color: post.color }} />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[9px] sm:text-[10px] font-medium px-2 py-[1px] rounded-full ${post.published ? "bg-[#F0F3FA] text-[#293763]" : "bg-[#FFF7ED] text-[#E08A3C]"}`}>
                    {post.published ? "Published" : "Draft"}
                  </span>
                  {post.tags.slice(0, 2).map((t) => (
                    <span key={t} className="text-[9px] text-[#CACACA] hidden sm:inline">{t}</span>
                  ))}
                </div>
                <p className="text-[13px] sm:text-[14px] font-medium text-[#1A1A1A] truncate leading-snug">{post.title}</p>
                <p className="text-[11px] sm:text-[12px] text-[#ACACAC] truncate mt-0.5">{post.desc || "No description"}</p>
                <div className="flex items-center gap-3 mt-1.5 text-[10px] text-[#DCDCDC]">
                  <span>{post.date}</span>
                  <span>·</span>
                  <span>{post.readTime}</span>
                  <span>·</span>
                  <span className="font-mono">/blogs/{post.slug}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setEditSlug(post.slug)} title="Edit" className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F0F0F0] text-[#CACACA] hover:text-[#1A1A1A] transition-colors border-none bg-transparent cursor-pointer">
                  <PencilSimple size={14} />
                </button>
                <button onClick={() => window.open(`${WEBSITE}/blogs/${post.slug}`, "_blank")} title="View on website" className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F0F0F0] text-[#CACACA] hover:text-[#1A1A1A] transition-colors border-none bg-transparent cursor-pointer">
                  <ArrowSquareOut size={14} />
                </button>
                <button onClick={() => post.published ? blog.unpublishBlog(post.slug) : blog.publishBlog(post.slug)} title={post.published ? "Unpublish" : "Publish"} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F0F0F0] text-[#CACACA] hover:text-[#1A1A1A] transition-colors border-none bg-transparent cursor-pointer">
                  {post.published ? <GlobeX size={14} /> : <Globe size={14} />}
                </button>
                <button onClick={() => blog.duplicateBlog(post.slug)} title="Duplicate" className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F0F0F0] text-[#CACACA] hover:text-[#1A1A1A] transition-colors border-none bg-transparent cursor-pointer">
                  <Copy size={14} />
                </button>
                <button onClick={() => setConfirmDelete(post.slug)} title="Delete" className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#FFF1E6] text-[#CACACA] hover:text-[#C2571A] transition-colors border-none bg-transparent cursor-pointer">
                  <Trash size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create dialog */}
      {showCreate && (
        <>
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[200]" onClick={() => setShowCreate(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[201] w-[400px] max-w-[90vw] bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-[#EAEAEA] p-6">
            <h3 className="text-[15px] font-medium text-[#1A1A1A] mb-4">New Blog Post</h3>
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && newTitle.trim()) { const b = blog.createBlog(newTitle.trim()); setShowCreate(false); setEditSlug(b.slug); } }}
              placeholder="Post title..."
              autoFocus
              className="w-full h-[42px] px-4 border border-[#EBEBEB] rounded-xl text-[14px] text-[#1A1A1A] focus:outline-none focus:border-[#E08A3C] transition-colors mb-4"
            />
            <div className="flex gap-2">
              <button onClick={() => setShowCreate(false)} className="flex-1 h-[38px] rounded-lg text-[13px] font-medium text-[#777] bg-white border border-[#EBEBEB] cursor-pointer hover:bg-[#FAFAFA] transition-colors">Cancel</button>
              <button
                onClick={() => { if (newTitle.trim()) { const b = blog.createBlog(newTitle.trim()); setShowCreate(false); setEditSlug(b.slug); } }}
                disabled={!newTitle.trim()}
                className={`flex-1 h-[38px] rounded-lg text-[13px] font-medium border-none cursor-pointer transition-all ${newTitle.trim() ? "bg-[#1A1A1A] text-white hover:bg-[#333]" : "bg-[#F0F0F0] text-[#CACACA] cursor-not-allowed"}`}
              >
                Create & Edit
              </button>
            </div>
          </div>
        </>
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <>
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[200]" onClick={() => setConfirmDelete(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[201] w-[360px] max-w-[90vw] bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-[#EAEAEA] p-6">
            <h3 className="text-[15px] font-medium text-[#1A1A1A] mb-2">Delete Post</h3>
            <p className="text-[12px] text-[#ACACAC] mb-5">This will permanently remove this blog post. This cannot be undone.</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 h-[38px] rounded-lg text-[13px] font-medium text-[#777] bg-white border border-[#EBEBEB] cursor-pointer hover:bg-[#FAFAFA] transition-colors">Cancel</button>
              <button onClick={() => { blog.deleteBlog(confirmDelete); setConfirmDelete(null); }} className="flex-1 h-[38px] rounded-lg text-[13px] font-medium text-white bg-[#C2571A] border-none cursor-pointer hover:bg-[#A84A16] transition-colors">Delete</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
