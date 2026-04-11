"use client";
import { memo, useState, useMemo, useCallback, useRef, useEffect } from "react";
import {
  Folder, FolderOpen, FileText, CaretRight, CaretDown, Plus, House,
  PencilSimple, Eye, Trash, Copy, ArrowBendUpRight, Globe, GlobeX,
  Archive, Clock, X, Check, Warning,
} from "@phosphor-icons/react";
import { buildFileTree, flattenTree, countPages, type FileNode } from "./fileTree";
import type { CmsPage, PageStatus } from "./cmsTypes";
import type { CmsActions } from "./useCmsState";

const STATUS_STYLE: Record<PageStatus, { bg: string; text: string; dot: string; label: string }> = {
  published: { bg: "bg-[#F0F3FA]", text: "text-[#293763]", dot: "bg-[#293763]", label: "Live" },
  draft: { bg: "bg-[#FFF7ED]", text: "text-[#E08A3C]", dot: "bg-[#E08A3C]", label: "Draft" },
  scheduled: { bg: "bg-[#FFF7ED]", text: "text-[#B45309]", dot: "bg-[#B45309]", label: "Scheduled" },
  archived: { bg: "bg-[#F5F5F5]", text: "text-[#999]", dot: "bg-[#999]", label: "Archived" },
};

interface Props {
  cms: CmsActions;
  onEditPage: (pageId: string) => void;
  onPreviewPage: (pageId: string) => void;
}

function FileManager({ cms, onEditPage, onPreviewPage }: Props) {
  const tree = useMemo(() => buildFileTree(cms.pages), [cms.pages]);
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const paths = new Set<string>();
    function walk(node: FileNode) { if (node.type === "folder") { paths.add(node.path); node.children.forEach(walk); } }
    walk(tree);
    return paths;
  });
  const [selected, setSelected] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [showCreate, setShowCreate] = useState<string | null>(null); // parent path
  const [createTitle, setCreateTitle] = useState("");
  const [createTemplate, setCreateTemplate] = useState<CmsPage["template"]>("marketing");
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; pageId: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const renameRef = useRef<HTMLInputElement>(null);
  const createRef = useRef<HTMLInputElement>(null);
  const contextRef = useRef<HTMLDivElement>(null);

  const toggleExpand = useCallback((path: string) => {
    setExpanded((prev) => { const n = new Set(prev); n.has(path) ? n.delete(path) : n.add(path); return n; });
  }, []);

  const flat = useMemo(() => flattenTree(tree, expanded), [tree, expanded]);
  const selectedPage = selected ? cms.pages.find((p) => p.id === selected || p.slug === selected) : null;

  // Close context menu on outside click
  useEffect(() => {
    function close(e: MouseEvent) { if (contextRef.current && !contextRef.current.contains(e.target as Node)) setContextMenu(null); }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  // Focus rename input
  useEffect(() => { if (renamingId) renameRef.current?.focus(); }, [renamingId]);
  useEffect(() => { if (showCreate) createRef.current?.focus(); }, [showCreate]);

  const handleRenameSubmit = () => {
    if (renamingId && renameValue.trim()) {
      cms.renamePage(renamingId, renameValue.trim());
      setRenamingId(null);
    }
  };

  const handleCreateSubmit = () => {
    if (showCreate !== null && createTitle.trim()) {
      const page = cms.createPage(showCreate, createTitle.trim(), createTemplate);
      setShowCreate(null);
      setCreateTitle("");
      setSelected(page.id);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, pageId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, pageId });
  };

  const contextPage = contextMenu ? cms.getPage(contextMenu.pageId) : null;

  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden flex flex-col" style={{ minHeight: 520 }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#F5F5F5] shrink-0">
        <div className="flex items-center gap-2.5">
          <Folder size={16} weight="duotone" className="text-[#E08A3C]" />
          <h3 className="text-[13px] sm:text-[14px] font-medium text-[#1A1A1A]">Site Structure</h3>
          <span className="text-[10px] text-[#CACACA] bg-[#F5F5F5] px-2 py-0.5 rounded-full">{cms.pages.length} pages</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { setShowCreate("/"); setCreateTitle(""); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1A1A] text-white rounded-lg text-[11px] font-medium hover:bg-[#333] transition-all cursor-pointer border-none">
            <Plus size={11} weight="bold" /> New Page
          </button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Tree */}
        <div className="flex-1 overflow-y-auto custom-scrollbar py-1">
          {flat.map(({ node, depth }) => {
            const isFolder = node.type === "folder";
            const isExpanded = expanded.has(node.path);
            const isSelected = selected === (node.page?.id || node.path);
            const page = node.page;
            const st = page ? STATUS_STYLE[page.status] : null;
            const pageCount = isFolder ? countPages(node) : 0;
            const isRenaming = page && renamingId === page.id;

            return (
              <div
                key={node.path + (page?.id || "")}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 cursor-pointer transition-colors group ${isSelected ? "bg-[#FFF7ED]" : "hover:bg-[#FAFAFA]"}`}
                style={{ paddingLeft: `${16 + depth * 18}px` }}
                onClick={() => {
                  if (isFolder) { toggleExpand(node.path); }
                  setSelected(page?.id || node.path);
                }}
                onContextMenu={page ? (e) => handleContextMenu(e, page.id) : undefined}
              >
                {/* Caret */}
                <div className="w-3.5 flex items-center justify-center shrink-0">
                  {isFolder && (isExpanded ? <CaretDown size={10} className="text-[#ACACAC]" /> : <CaretRight size={10} className="text-[#CACACA]" />)}
                </div>

                {/* Icon */}
                {isFolder
                  ? (isExpanded ? <FolderOpen size={16} weight="duotone" className="text-[#E08A3C] shrink-0" /> : <Folder size={16} weight="duotone" className="text-[#D4956A] shrink-0" />)
                  : <FileText size={16} weight="duotone" className="text-[#ACACAC] shrink-0" />
                }

                {/* Name */}
                <div className="flex-1 min-w-0 flex items-center gap-1.5">
                  {isRenaming ? (
                    <input
                      ref={renameRef}
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleRenameSubmit(); if (e.key === "Escape") setRenamingId(null); }}
                      onBlur={handleRenameSubmit}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 h-6 px-1.5 text-[12px] border border-[#E08A3C] rounded bg-white outline-none text-[#1A1A1A]"
                    />
                  ) : (
                    <span className={`text-[12px] truncate ${isFolder ? "font-medium text-[#1A1A1A]" : "text-[#555]"}`}>{node.name}</span>
                  )}
                  {isFolder && <span className="text-[9px] text-[#DCDCDC] shrink-0">{pageCount}</span>}
                  {page && st && (
                    <span className={`text-[9px] font-medium px-1.5 py-[1px] rounded-full shrink-0 ${st.bg} ${st.text}`}>{st.label}</span>
                  )}
                </div>

                {/* Hover actions */}
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  {page && (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); onEditPage(page.id); }} title="Edit" className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#F0F0F0] text-[#CACACA] hover:text-[#1A1A1A] transition-colors border-none bg-transparent cursor-pointer"><PencilSimple size={11} /></button>
                      <button onClick={(e) => { e.stopPropagation(); onPreviewPage(page.id); }} title="Preview" className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#F0F0F0] text-[#CACACA] hover:text-[#1A1A1A] transition-colors border-none bg-transparent cursor-pointer"><Eye size={11} /></button>
                    </>
                  )}
                  {isFolder && (
                    <button onClick={(e) => { e.stopPropagation(); setShowCreate(node.path); setCreateTitle(""); }} title="New page" className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#F0F0F0] text-[#CACACA] hover:text-[#E08A3C] transition-colors border-none bg-transparent cursor-pointer"><Plus size={11} /></button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail panel */}
        {selectedPage && (
          <div className="hidden lg:flex flex-col w-[280px] border-l border-[#F5F5F5] bg-[#FAFAFA] shrink-0 overflow-y-auto custom-scrollbar">
            {/* Page header */}
            <div className="p-4 border-b border-[#F0F0F0]">
              <p className="text-[13px] font-medium text-[#1A1A1A] mb-1">{selectedPage.title}</p>
              <p className="text-[11px] font-mono text-[#ACACAC] break-all">{selectedPage.slug}</p>
            </div>

            {/* Quick actions */}
            <div className="p-3 border-b border-[#F0F0F0] flex flex-wrap gap-1.5">
              <button onClick={() => onEditPage(selectedPage.id)} className="flex items-center gap-1 px-2.5 py-1.5 bg-[#1A1A1A] text-white rounded-lg text-[10px] font-medium cursor-pointer border-none hover:bg-[#333] transition-colors"><PencilSimple size={10} /> Edit</button>
              <button onClick={() => onPreviewPage(selectedPage.id)} className="flex items-center gap-1 px-2.5 py-1.5 bg-white text-[#666] border border-[#EBEBEB] rounded-lg text-[10px] font-medium cursor-pointer hover:bg-[#F5F5F5] transition-colors"><Eye size={10} /> Preview</button>
              <button onClick={() => { const c = cms.duplicatePage(selectedPage.id); if (c) setSelected(c.id); }} className="flex items-center gap-1 px-2.5 py-1.5 bg-white text-[#666] border border-[#EBEBEB] rounded-lg text-[10px] font-medium cursor-pointer hover:bg-[#F5F5F5] transition-colors"><Copy size={10} /> Duplicate</button>
              <button onClick={() => { setRenamingId(selectedPage.id); setRenameValue(selectedPage.title); }} className="flex items-center gap-1 px-2.5 py-1.5 bg-white text-[#666] border border-[#EBEBEB] rounded-lg text-[10px] font-medium cursor-pointer hover:bg-[#F5F5F5] transition-colors"><PencilSimple size={10} /> Rename</button>
            </div>

            {/* Status toggle */}
            <div className="p-3 border-b border-[#F0F0F0]">
              <p className="text-[9px] text-[#CACACA] uppercase tracking-wider mb-2">Status</p>
              <div className="flex flex-wrap gap-1">
                {(["published", "draft", "scheduled", "archived"] as PageStatus[]).map((s) => {
                  const st = STATUS_STYLE[s];
                  const active = selectedPage.status === s;
                  return (
                    <button
                      key={s}
                      onClick={() => {
                        if (s === "published") cms.publishPage(selectedPage.id);
                        else if (s === "draft") cms.unpublishPage(selectedPage.id);
                        else if (s === "archived") cms.archivePage(selectedPage.id);
                        else if (s === "scheduled") cms.schedulePage(selectedPage.id);
                      }}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium cursor-pointer border transition-all ${active ? `${st.bg} ${st.text} border-current` : "bg-white text-[#ACACAC] border-[#EBEBEB] hover:border-[#CACACA]"}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${active ? st.dot : "bg-[#DCDCDC]"}`} />
                      {st.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Meta fields */}
            <div className="p-3 flex flex-col gap-3">
              <div>
                <p className="text-[9px] text-[#CACACA] uppercase tracking-wider mb-1">SEO Score</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-[4px] bg-[#F0F0F0] rounded-full overflow-hidden"><div className="h-full rounded-full bg-[#293763]" style={{ width: `${selectedPage.seoScore}%` }} /></div>
                  <span className="text-[11px] font-medium text-[#1A1A1A]">{selectedPage.seoScore}</span>
                </div>
              </div>
              <div>
                <p className="text-[9px] text-[#CACACA] uppercase tracking-wider mb-1">Views (30d)</p>
                <p className="text-[11px] text-[#888]">{selectedPage.views > 0 ? selectedPage.views.toLocaleString() : "—"}</p>
              </div>
              <div>
                <p className="text-[9px] text-[#CACACA] uppercase tracking-wider mb-1">Template</p>
                <p className="text-[11px] text-[#888] capitalize">{selectedPage.template}</p>
              </div>
              <div>
                <p className="text-[9px] text-[#CACACA] uppercase tracking-wider mb-1">Last Edited</p>
                <p className="text-[11px] text-[#888]">{selectedPage.lastEdited}</p>
                <p className="text-[9px] text-[#DCDCDC]">{selectedPage.editedBy}</p>
              </div>

              {/* Danger zone */}
              {selectedPage.status !== "published" && (
                <button onClick={() => setConfirmDelete(selectedPage.id)} className="flex items-center justify-center gap-1.5 w-full px-3 py-2 mt-2 bg-white text-[#C2571A] border border-[#EBEBEB] rounded-lg text-[10px] font-medium cursor-pointer hover:bg-[#FFF1E6] hover:border-[#C2571A]/20 transition-colors">
                  <Trash size={11} /> Delete Page
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create page dialog */}
      {showCreate !== null && (
        <>
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[200]" onClick={() => setShowCreate(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[201] w-[400px] max-w-[90vw] bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-[#EAEAEA] p-6">
            <h3 className="text-[15px] font-medium text-[#1A1A1A] mb-1">Create New Page</h3>
            <p className="text-[12px] text-[#ACACAC] mb-5">in <span className="font-mono text-[#888]">{showCreate === "/" ? "/ (root)" : showCreate}</span></p>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-[10px] font-medium text-[#ACACAC] uppercase tracking-wider mb-1.5">Page Title</label>
                <input ref={createRef} value={createTitle} onChange={(e) => setCreateTitle(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleCreateSubmit(); }} placeholder="e.g. About Us" className="w-full h-[38px] px-3 border border-[#EBEBEB] rounded-lg text-[13px] text-[#1A1A1A] focus:outline-none focus:border-[#E08A3C] transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-[#ACACAC] uppercase tracking-wider mb-1.5">Template</label>
                <div className="flex flex-wrap gap-1.5">
                  {(["landing", "marketing", "blog", "legal", "pricing", "custom"] as const).map((t) => (
                    <button key={t} onClick={() => setCreateTemplate(t)} className={`px-3 py-1.5 rounded-lg text-[11px] font-medium cursor-pointer border transition-all capitalize ${createTemplate === t ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" : "bg-white text-[#888] border-[#EBEBEB] hover:border-[#CACACA]"}`}>{t}</button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button onClick={() => setShowCreate(null)} className="flex-1 h-[38px] rounded-lg text-[13px] font-medium text-[#777] bg-white border border-[#EBEBEB] cursor-pointer hover:bg-[#FAFAFA] transition-colors">Cancel</button>
                <button onClick={handleCreateSubmit} disabled={!createTitle.trim()} className={`flex-1 h-[38px] rounded-lg text-[13px] font-medium border-none cursor-pointer transition-all ${createTitle.trim() ? "bg-[#1A1A1A] text-white hover:bg-[#333]" : "bg-[#F0F0F0] text-[#CACACA] cursor-not-allowed"}`}>Create Page</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <>
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[200]" onClick={() => setConfirmDelete(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[201] w-[380px] max-w-[90vw] bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-[#EAEAEA] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#FFF1E6] flex items-center justify-center"><Warning size={20} weight="fill" className="text-[#C2571A]" /></div>
              <div>
                <h3 className="text-[15px] font-medium text-[#1A1A1A]">Delete Page</h3>
                <p className="text-[12px] text-[#ACACAC]">This cannot be undone.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 h-[38px] rounded-lg text-[13px] font-medium text-[#777] bg-white border border-[#EBEBEB] cursor-pointer hover:bg-[#FAFAFA] transition-colors">Cancel</button>
              <button onClick={() => { cms.deletePage(confirmDelete); setConfirmDelete(null); setSelected(null); }} className="flex-1 h-[38px] rounded-lg text-[13px] font-medium text-white bg-[#C2571A] border-none cursor-pointer hover:bg-[#A84A16] transition-colors">Delete</button>
            </div>
          </div>
        </>
      )}

      {/* Context menu */}
      {contextMenu && contextPage && (
        <div ref={contextRef} className="fixed z-[300] w-[180px] bg-white rounded-xl shadow-[0_12px_44px_-12px_rgba(0,0,0,0.15)] border border-[#EAEAEA] overflow-hidden animate-contextIn" style={{ top: contextMenu.y, left: contextMenu.x }}>
          {[
            { icon: <PencilSimple size={13} />, label: "Edit", action: () => { onEditPage(contextPage.id); setContextMenu(null); } },
            { icon: <Eye size={13} />, label: "Preview", action: () => { onPreviewPage(contextPage.id); setContextMenu(null); } },
            { icon: <PencilSimple size={13} />, label: "Rename", action: () => { setRenamingId(contextPage.id); setRenameValue(contextPage.title); setContextMenu(null); } },
            { icon: <Copy size={13} />, label: "Duplicate", action: () => { const c = cms.duplicatePage(contextPage.id); if (c) setSelected(c.id); setContextMenu(null); } },
            null, // divider
            { icon: contextPage.status === "published" ? <GlobeX size={13} /> : <Globe size={13} />, label: contextPage.status === "published" ? "Unpublish" : "Publish", action: () => { contextPage.status === "published" ? cms.unpublishPage(contextPage.id) : cms.publishPage(contextPage.id); setContextMenu(null); } },
            { icon: <Archive size={13} />, label: "Archive", action: () => { cms.archivePage(contextPage.id); setContextMenu(null); } },
            null,
            { icon: <Trash size={13} className="text-[#C2571A]" />, label: "Delete", danger: true, action: () => { setConfirmDelete(contextPage.id); setContextMenu(null); } },
          ].map((item, i) => item === null ? (
            <div key={`d-${i}`} className="h-px bg-[#F5F5F5] mx-2" />
          ) : (
            <button key={item.label} onClick={item.action} className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left transition-colors cursor-pointer border-none bg-transparent text-[12px] ${(item as any).danger ? "text-[#C2571A] hover:bg-[#FFF1E6]" : "text-[#555] hover:bg-[#FAFAFA]"}`}>
              {item.icon} {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(FileManager);
