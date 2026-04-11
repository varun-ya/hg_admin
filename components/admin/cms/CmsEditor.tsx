"use client";
import { memo, useState, useCallback, useRef, useEffect } from "react";
import {
  PencilSimple, Eye, Trash, Plus, DotsSixVertical, Globe, Clock, Archive,
  FileText, Image, VideoCamera, FilePdf, Export, FileCsv, CaretRight,
  TextT, RocketLaunch, ChatTeardropDots, Question, CurrencyDollar, ChartBar,
} from "@phosphor-icons/react";
import { cmsPages, sampleBlocks, cmsMedia } from "./cmsMockData";
import type { PageStatus } from "./cmsTypes";
import { exportCSV, exportPDF } from "@/lib/exportUtils";

const STATUS_STYLE: Record<PageStatus, { bg: string; text: string; label: string }> = {
  published: { bg: "bg-[#F0F3FA]", text: "text-[#293763]", label: "Published" },
  draft: { bg: "bg-[#FFF7ED]", text: "text-[#E08A3C]", label: "Draft" },
  scheduled: { bg: "bg-[#FFF7ED]", text: "text-[#B45309]", label: "Scheduled" },
  archived: { bg: "bg-[#F5F5F5]", text: "text-[#999]", label: "Archived" },
};

const BLOCK_ICONS: Record<string, React.ReactNode> = {
  hero: <RocketLaunch size={14} className="text-[#E08A3C]" />,
  text: <TextT size={14} className="text-[#999]" />,
  image: <Image size={14} className="text-[#293763]" />,
  cta: <RocketLaunch size={14} className="text-[#C2571A]" />,
  testimonials: <ChatTeardropDots size={14} className="text-[#D4956A]" />,
  faq: <Question size={14} className="text-[#999]" />,
  pricing: <CurrencyDollar size={14} className="text-[#293763]" />,
  stats: <ChartBar size={14} className="text-[#E08A3C]" />,
};

const MEDIA_ICONS: Record<string, React.ReactNode> = {
  image: <Image size={16} className="text-[#293763]" />,
  video: <VideoCamera size={16} className="text-[#E08A3C]" />,
  document: <FilePdf size={16} className="text-[#999]" />,
};

function CmsEditor() {
  const [tab, setTab] = useState<"pages" | "editor" | "media">("pages");
  const [editingPage, setEditingPage] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [showExport, setShowExport] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function close(e: MouseEvent) { if (exportRef.current && !exportRef.current.contains(e.target as Node)) setShowExport(false); }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const filtered = filter === "all" ? cmsPages : cmsPages.filter((p) => p.status === filter);
  const editPage = cmsPages.find((p) => p.id === editingPage);

  const stamp = new Date().toISOString().slice(0, 10);
  const handleCSV = useCallback(() => {
    const h = ["Title", "Slug", "Status", "Template", "Views", "SEO Score", "Last Edited", "Edited By"];
    const r = cmsPages.map((p) => [p.title, p.slug, p.status, p.template, String(p.views), String(p.seoScore), p.lastEdited, p.editedBy]);
    exportCSV(`cms-pages-${stamp}`, h, r);
    setShowExport(false);
  }, [stamp]);
  const handlePDF = useCallback(() => {
    const h = ["Title", "Slug", "Status", "Views", "SEO", "Last Edited"];
    const r = cmsPages.map((p) => [p.title, p.slug, p.status, String(p.views), String(p.seoScore), p.lastEdited]);
    exportPDF(`cms-pages-${stamp}`, "CMS Pages Report", h, r, { generatedBy: "Super Admin" });
    setShowExport(false);
  }, [stamp]);

  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-7 py-5 border-b border-[#F5F5F5]">
        <div className="flex items-center gap-1 bg-[#F5F5F5] rounded-xl p-[3px]">
          {(["pages", "editor", "media"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-[7px] rounded-lg text-[12px] font-medium transition-all cursor-pointer border-none capitalize ${tab === t ? "bg-white text-[#1A1A1A] shadow-sm" : "bg-transparent text-[#ACACAC] hover:text-[#777]"}`}>
              {t === "pages" ? "All Pages" : t === "editor" ? "Block Editor" : "Media Library"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative" ref={exportRef}>
            <button onClick={() => setShowExport(!showExport)} className="flex items-center gap-1.5 text-[11px] font-medium text-[#1A1A1A] border border-[#EBEBEB] rounded-lg px-3 py-1.5 cursor-pointer hover:bg-[#FAFAFA] transition-colors bg-transparent">
              <Export size={12} weight="bold" /> Export
            </button>
            {showExport && (
              <div className="absolute right-0 mt-1.5 w-[180px] bg-white rounded-xl shadow-[0_12px_44px_-12px_rgba(0,0,0,0.12)] border border-[#EAEAEA] z-50 overflow-hidden animate-contextIn">
                <button onClick={handleCSV} className="w-full flex items-center gap-2.5 px-4 py-3 hover:bg-[#FAFAFA] text-left transition-colors cursor-pointer border-none bg-transparent text-[12px] font-medium text-[#1A1A1A]"><FileCsv size={15} className="text-[#E08A3C]" /> CSV</button>
                <button onClick={handlePDF} className="w-full flex items-center gap-2.5 px-4 py-3 hover:bg-[#FAFAFA] text-left transition-colors cursor-pointer border-none bg-transparent border-t border-[#F5F5F5] text-[12px] font-medium text-[#1A1A1A]"><FilePdf size={15} className="text-[#293763]" /> PDF</button>
              </div>
            )}
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-[#1A1A1A] text-white rounded-lg text-[12px] font-medium hover:bg-[#333] transition-all cursor-pointer border-none">
            <Plus size={12} weight="bold" /> New Page
          </button>
        </div>
      </div>

      {/* Pages List */}
      {tab === "pages" && (
        <>
          {/* Filter bar */}
          <div className="px-7 py-3 border-b border-[#F5F5F5] flex items-center gap-2">
            {(["all", "published", "draft", "scheduled", "archived"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer border-none capitalize ${filter === f ? "bg-[#1A1A1A] text-white" : "bg-transparent text-[#ACACAC] hover:bg-[#F5F5F5] hover:text-[#777]"}`}>
                {f} {f !== "all" && <span className="ml-1 text-[10px] opacity-60">({cmsPages.filter((p) => p.status === (f as string)).length})</span>}
              </button>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-[#F5F5F5]">
                  <th className="py-3 pl-7 pr-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Page</th>
                  <th className="py-3 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Status</th>
                  <th className="py-3 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Template</th>
                  <th className="py-3 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Views</th>
                  <th className="py-3 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">SEO</th>
                  <th className="py-3 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Last Edited</th>
                  <th className="py-3 pr-7 pl-3 text-right text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => {
                  const st = STATUS_STYLE[p.status];
                  const seoColor = p.seoScore >= 85 ? "text-[#293763]" : p.seoScore >= 70 ? "text-[#E08A3C]" : "text-[#C2571A]";
                  return (
                    <tr key={p.id} className={`hover:bg-[#FAFAFA] transition-colors group ${i > 0 ? "border-t border-[#F8F8F8]" : ""}`}>
                      <td className="py-4 pl-7 pr-3">
                        <div className="flex flex-col">
                          <span className="text-[13px] font-medium text-[#1A1A1A]">{p.title}</span>
                          <span className="text-[11px] font-mono text-[#CACACA]">{p.slug}</span>
                        </div>
                      </td>
                      <td className="py-4 px-3"><span className={`text-[10px] font-medium px-2 py-[2px] rounded-full ${st.bg} ${st.text}`}>{st.label}</span></td>
                      <td className="py-4 px-3 text-[12px] text-[#888] capitalize">{p.template}</td>
                      <td className="py-4 px-3 text-[12px] font-mono text-[#ACACAC]">{p.views > 0 ? p.views.toLocaleString() : "—"}</td>
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-1.5 bg-[#F0F0F0] rounded-full overflow-hidden"><div className="h-full rounded-full bg-[#293763] transition-all" style={{ width: `${p.seoScore}%` }} /></div>
                          <span className={`text-[11px] font-medium ${seoColor}`}>{p.seoScore}</span>
                        </div>
                      </td>
                      <td className="py-4 px-3">
                        <span className="text-[12px] text-[#ACACAC]">{p.lastEdited}</span>
                        <span className="text-[10px] text-[#DCDCDC] block">{p.editedBy}</span>
                      </td>
                      <td className="py-4 pr-7 pl-3">
                        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setEditingPage(p.id); setTab("editor"); }} title="Edit" className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#F0F0F0] text-[#999] hover:text-[#1A1A1A] transition-colors border-none bg-transparent cursor-pointer"><PencilSimple size={13} /></button>
                          <button title="Preview" className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#F0F0F0] text-[#999] hover:text-[#1A1A1A] transition-colors border-none bg-transparent cursor-pointer"><Eye size={13} /></button>
                          {p.status !== "published" && <button title="Delete" className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#FFF1E6] text-[#CACACA] hover:text-[#C2571A] transition-colors border-none bg-transparent cursor-pointer"><Trash size={13} /></button>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Block Editor */}
      {tab === "editor" && (
        <div className="p-7">
          {editPage && (
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-[15px] font-medium text-[#1A1A1A]">Editing: {editPage.title}</h3>
                <p className="text-[12px] text-[#ACACAC] mt-0.5 font-mono">{editPage.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 text-[12px] font-medium text-[#777] bg-white border border-[#EBEBEB] rounded-lg hover:bg-[#FAFAFA] transition-colors cursor-pointer">Save Draft</button>
                <button className="px-4 py-2 text-[12px] font-medium text-white bg-[#E08A3C] rounded-lg hover:bg-[#C97A34] transition-colors cursor-pointer border-none">Publish</button>
              </div>
            </div>
          )}
          {!editPage && (
            <div className="text-center py-8">
              <p className="text-[13px] text-[#ACACAC] mb-2">Select a page from the Pages tab to edit</p>
              <button onClick={() => setTab("pages")} className="text-[12px] font-medium text-[#E08A3C] bg-transparent border-none cursor-pointer hover:underline">Go to Pages →</button>
            </div>
          )}
          <div className="flex flex-col gap-2">
            {sampleBlocks.map((b) => (
              <div key={b.id} className="flex items-center gap-3 px-4 py-3.5 bg-[#FAFAFA] rounded-xl border border-[#F0F0F0] hover:border-[#DCDCDC] transition-all group">
                <DotsSixVertical size={16} className="text-[#DCDCDC] cursor-grab shrink-0" />
                <div className="w-8 h-8 rounded-lg bg-white border border-[#F0F0F0] flex items-center justify-center shrink-0">{BLOCK_ICONS[b.type]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium text-[#1A1A1A]">{b.label}</span>
                    <span className="text-[10px] font-medium text-[#CACACA] uppercase tracking-wider">{b.type}</span>
                  </div>
                  <p className="text-[12px] text-[#ACACAC] truncate mt-0.5">{b.content}</p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white text-[#999] hover:text-[#1A1A1A] transition-colors border-none bg-transparent cursor-pointer"><PencilSimple size={12} /></button>
                  <button className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#FFF1E6] text-[#CACACA] hover:text-[#C2571A] transition-colors border-none bg-transparent cursor-pointer"><Trash size={12} /></button>
                </div>
              </div>
            ))}
            <button className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-[#EBEBEB] rounded-xl text-[12px] font-medium text-[#ACACAC] hover:border-[#E08A3C] hover:text-[#E08A3C] transition-colors cursor-pointer bg-transparent">
              <Plus size={14} /> Add Block
            </button>
          </div>
        </div>
      )}

      {/* Media Library */}
      {tab === "media" && (
        <div className="p-7">
          <div className="flex items-center justify-between mb-5">
            <p className="text-[13px] text-[#ACACAC]">{cmsMedia.length} files</p>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-[#1A1A1A] text-white rounded-lg text-[12px] font-medium hover:bg-[#333] transition-all cursor-pointer border-none">
              <Plus size={12} weight="bold" /> Upload
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cmsMedia.map((m) => (
              <div key={m.id} className="bg-[#FAFAFA] rounded-xl border border-[#F0F0F0] p-4 hover:border-[#DCDCDC] transition-all group">
                <div className="w-full h-24 rounded-lg bg-[#F0F0F0] flex items-center justify-center mb-3">{MEDIA_ICONS[m.type]}</div>
                <p className="text-[12px] font-medium text-[#1A1A1A] truncate">{m.name}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[10px] text-[#CACACA]">{m.size}</span>
                  <span className="text-[10px] text-[#DCDCDC]">{m.uploadedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(CmsEditor);
