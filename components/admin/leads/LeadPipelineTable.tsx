"use client";
import { useState, useMemo, memo, useEffect, useRef } from "react";
import {
  MagnifyingGlass, Funnel, CaretLeft, CaretRight, CaretDown, DotsThree,
  Eye, UserPlus, WhatsappLogo, X, Command,
} from "@phosphor-icons/react";
import { leads } from "./leadMockData";
import type { Lead, LeadScore, LeadSource, LeadStatus } from "./leadTypes";

const PAGE_SIZE = 8;

const SCORE_STYLE: Record<LeadScore, string> = {
  hot: "bg-[#FFF1E6] text-[#C2571A]",
  warm: "bg-[#FFF8F3] text-[#E08A3C]",
  cold: "bg-[#F0F0F0] text-[#999]",
};

const SOURCE_LABEL: Record<LeadSource, string> = {
  meta_ads: "Meta Ads", google: "Google", organic: "Organic", whatsapp: "WhatsApp", csv_import: "CSV Import", referral: "Referral",
};

const STATUS_STYLE: Record<LeadStatus, string> = {
  new: "bg-[#EFF6FF] text-[#3B6FC0]",
  contacted: "bg-[#F0F0F0] text-[#1A1A1A]",
  qualified: "bg-[#F0FFF0] text-[#1A7A1A]",
  converted: "bg-[#F3F0FF] text-[#6B4FBB]",
  lost: "bg-[#F5F5F5] text-[#ACACAC]",
};

interface Props { onSelectLead: (l: Lead) => void }

function LeadPipelineTable({ onSelectLead }: Props) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [scoreFilter, setScoreFilter] = useState<LeadScore | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<LeadSource | "all">("all");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [contextMenu, setContextMenu] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); searchRef.current?.focus(); } };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, []);

  useEffect(() => {
    if (!contextMenu) return;
    const h = () => setContextMenu(null);
    window.addEventListener("click", h); return () => window.removeEventListener("click", h);
  }, [contextMenu]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return leads.filter((l) => {
      if (q && !l.name.toLowerCase().includes(q) && !l.phone.includes(q) && !l.assignedAgent.toLowerCase().includes(q) && !l.email.toLowerCase().includes(q)) return false;
      if (scoreFilter !== "all" && l.aiScore !== scoreFilter) return false;
      if (sourceFilter !== "all" && l.source !== sourceFilter) return false;
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      return true;
    });
  }, [search, scoreFilter, sourceFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const activeFilterCount = [scoreFilter !== "all", sourceFilter !== "all", statusFilter !== "all"].filter(Boolean).length;

  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
      <div className="px-7 pt-6 pb-5">
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="text-[12px] text-[#CACACA] mt-1">{filtered.length} lead{filtered.length !== 1 ? "s" : ""}{activeFilterCount > 0 ? " (filtered)" : ""}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-[280px]">
              <MagnifyingGlass size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#CACACA]" />
              <input ref={searchRef} type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} placeholder="Search leads…" className="w-full h-[38px] pl-9 pr-16 border border-[#F0F0F0] rounded-xl text-[13px] text-[#1A1A1A] placeholder:text-[#DCDCDC] focus:outline-none focus:border-[#DCDCDC] focus:shadow-[0_0_0_3px_rgba(0,0,0,0.02)] transition-all font-matter bg-white" />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] text-[#DCDCDC] font-mono bg-[#FAFAFA] border border-[#F0F0F0] px-1.5 py-0.5 rounded-md pointer-events-none"><Command size={9} weight="bold" />K</kbd>
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-1.5 px-3.5 h-[38px] border rounded-xl text-[12px] font-medium transition-all cursor-pointer ${showFilters || activeFilterCount > 0 ? "border-[#1A1A1A] text-[#1A1A1A] bg-white" : "border-[#F0F0F0] text-[#999] bg-white hover:border-[#DCDCDC]"}`}>
              <Funnel size={13} weight={activeFilterCount > 0 ? "fill" : "regular"} />Filters{activeFilterCount > 0 && <span className="ml-0.5 w-4 h-4 rounded-full bg-[#1A1A1A] text-white text-[9px] flex items-center justify-center">{activeFilterCount}</span>}
            </button>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="px-7 pb-5 flex items-center gap-3 flex-wrap border-b border-[#F5F5F5]">
          <FilterSelect value={scoreFilter} options={[{ value: "all", label: "All Scores" }, { value: "hot", label: "Hot" }, { value: "warm", label: "Warm" }, { value: "cold", label: "Cold" }]} onChange={(v) => { setScoreFilter(v as LeadScore | "all"); setPage(0); }} />
          <FilterSelect value={sourceFilter} options={[{ value: "all", label: "All Sources" }, { value: "meta_ads", label: "Meta Ads" }, { value: "google", label: "Google" }, { value: "organic", label: "Organic" }, { value: "whatsapp", label: "WhatsApp" }, { value: "csv_import", label: "CSV Import" }, { value: "referral", label: "Referral" }]} onChange={(v) => { setSourceFilter(v as LeadSource | "all"); setPage(0); }} />
          <FilterSelect value={statusFilter} options={[{ value: "all", label: "All Status" }, { value: "new", label: "New" }, { value: "contacted", label: "Contacted" }, { value: "qualified", label: "Qualified" }, { value: "converted", label: "Converted" }, { value: "lost", label: "Lost" }]} onChange={(v) => { setStatusFilter(v as LeadStatus | "all"); setPage(0); }} />
          {activeFilterCount > 0 && <button onClick={() => { setScoreFilter("all"); setSourceFilter("all"); setStatusFilter("all"); setPage(0); }} className="flex items-center gap-1 text-[11px] font-medium text-[#ACACAC] hover:text-[#1A1A1A] bg-transparent border-none cursor-pointer ml-1 transition-colors"><X size={10} weight="bold" /> Reset</button>}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="border-t border-b border-[#F5F5F5]">
              <th className="py-3.5 pl-7 pr-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Lead</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Source</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">AI Score</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Status</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Assigned Agent</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Last Touchpoint</th>
              <th className="py-3.5 pr-7 pl-3 text-right text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em] w-[60px]"></th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr><td colSpan={7} className="py-20 text-center"><div className="flex flex-col items-center gap-3"><div className="w-12 h-12 rounded-2xl bg-[#F7F7F7] flex items-center justify-center"><MagnifyingGlass size={20} className="text-[#DCDCDC]" /></div><p className="text-[13px] text-[#ACACAC]">No leads match</p></div></td></tr>
            ) : paged.map((l, i) => (
              <tr key={l.id} onClick={() => onSelectLead(l)} className={`hover:bg-[#FAFAFA]/60 transition-colors duration-100 cursor-pointer group ${i > 0 ? "border-t border-[#F8F8F8]" : ""}`}>
                <td className="py-4 pl-7 pr-3">
                  <div className="flex flex-col"><span className="text-[13px] text-[#1A1A1A]">{l.name}</span><span className="text-[11px] text-[#CACACA] font-mono mt-0.5">{l.phone}</span></div>
                </td>
                <td className="py-4 px-3"><span className="text-[12px] text-[#777]">{SOURCE_LABEL[l.source]}</span></td>
                <td className="py-4 px-3"><span className={`inline-flex px-2.5 py-[3px] rounded-full text-[10.5px] font-medium capitalize ${SCORE_STYLE[l.aiScore]}`}>{l.aiScore}</span></td>
                <td className="py-4 px-3"><span className={`inline-flex px-2.5 py-[3px] rounded-full text-[10.5px] font-medium capitalize ${STATUS_STYLE[l.status]}`}>{l.status}</span></td>
                <td className="py-4 px-3"><span className={`text-[12px] ${l.assignedAgent === "Unassigned" ? "text-[#DCDCDC] italic" : "text-[#1A1A1A]"}`}>{l.assignedAgent}</span></td>
                <td className="py-4 px-3">
                  <div className="flex flex-col"><span className="text-[12px] text-[#1A1A1A]">{l.lastTouchpoint}</span><span className="text-[10px] text-[#DCDCDC] mt-0.5">{l.lastTouchpointTime}</span></div>
                </td>
                <td className="py-4 pr-7 pl-3 text-right relative">
                  <button onClick={(e) => { e.stopPropagation(); setContextMenu(contextMenu === l.id ? null : l.id); }} className="p-1.5 rounded-lg hover:bg-[#F5F5F5] bg-transparent border-none cursor-pointer text-[#CACACA] hover:text-[#999] transition-colors opacity-0 group-hover:opacity-100"><DotsThree size={18} weight="bold" /></button>
                  {contextMenu === l.id && (
                    <div className="absolute right-7 top-full mt-1 bg-white border border-[#F0F0F0] rounded-xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)] py-1 z-20 min-w-[210px] animate-contextIn" onClick={(e) => e.stopPropagation()}>
                      <CtxItem icon={<Eye size={13} />} label="View Profile" onClick={() => { setContextMenu(null); onSelectLead(l); }} />
                      <CtxItem icon={<WhatsappLogo size={13} />} label="Send WhatsApp" onClick={() => setContextMenu(null)} />
                      <CtxItem icon={<UserPlus size={13} />} label="Convert to Student" onClick={() => setContextMenu(null)} />
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length > 0 && (
        <div className="flex items-center justify-between px-7 py-4 border-t border-[#F5F5F5]">
          <span className="text-[12px] text-[#CACACA] font-normal tabular-nums">{page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} className="w-8 h-8 rounded-lg border border-[#F0F0F0] bg-white text-[#999] hover:text-[#1A1A1A] hover:border-[#DCDCDC] disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer transition-all flex items-center justify-center"><CaretLeft size={13} weight="bold" /></button>
            {Array.from({ length: totalPages }, (_, i) => <button key={i} onClick={() => setPage(i)} className={`w-8 h-8 rounded-lg text-[12px] font-medium transition-all cursor-pointer border-none flex items-center justify-center ${i === page ? "bg-[#1A1A1A] text-white" : "bg-transparent text-[#ACACAC] hover:bg-[#F5F5F5] hover:text-[#1A1A1A]"}`}>{i + 1}</button>)}
            <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1} className="w-8 h-8 rounded-lg border border-[#F0F0F0] bg-white text-[#999] hover:text-[#1A1A1A] hover:border-[#DCDCDC] disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer transition-all flex items-center justify-center"><CaretRight size={13} weight="bold" /></button>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterSelect({ value, options, onChange }: { value: string; options: { value: string; label: string }[]; onChange: (v: string) => void }) {
  return (<div className="relative"><select value={value} onChange={(e) => onChange(e.target.value)} className="appearance-none h-[34px] pl-3 pr-8 border border-[#F0F0F0] rounded-lg text-[12px] text-[#1A1A1A] bg-white focus:outline-none focus:border-[#DCDCDC] cursor-pointer font-matter transition-colors hover:border-[#DCDCDC]">{options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select><CaretDown size={10} weight="bold" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#DCDCDC] pointer-events-none" /></div>);
}

function CtxItem({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (<button onClick={onClick} className="w-full flex items-center gap-2.5 px-4 py-2 text-[12px] font-normal bg-transparent border-none cursor-pointer transition-colors text-left rounded-lg mx-0 text-[#666] hover:bg-[#FAFAFA]">{icon} {label}</button>);
}

export default memo(LeadPipelineTable);
