"use client";
import { useState, useMemo, memo, useEffect, useRef } from "react";
import {
  MagnifyingGlass, Lock, Funnel, CaretLeft, CaretRight, CaretDown,
  Export, X, Command,
} from "@phosphor-icons/react";
import { auditLogs } from "./systemMockData";
import type { AuditLogEntry, AuditCategory } from "./systemTypes";
import { CATEGORY_LABELS } from "./systemTypes";

const PAGE_SIZE = 10;

const CATEGORY_STYLE: Record<AuditCategory, string> = {
  auth: "bg-[#F0F0F0] text-[#1A1A1A]",
  financial: "bg-[#ECFDF5] text-[#10B981]",
  liveops: "bg-[#EEF2FF] text-[#4F46E5]",
  system: "bg-[#F5F5F5] text-[#999]",
  ai: "bg-[#F3F0FF] text-[#8B5CF6]",
};

const SEVERITY_DOT: Record<string, string> = {
  info: "bg-[#DCDCDC]",
  warning: "bg-[#F59E0B]",
  critical: "bg-[#E11D48]",
};

function AuditLedgerTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<AuditCategory | "all">("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); searchRef.current?.focus(); } };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return auditLogs.filter((l) => {
      if (q && !l.actor.toLowerCase().includes(q) && !l.description.toLowerCase().includes(q) && !l.target.toLowerCase().includes(q) && !l.ipAddress.includes(q)) return false;
      if (categoryFilter !== "all" && l.category !== categoryFilter) return false;
      if (severityFilter !== "all" && l.severity !== severityFilter) return false;
      return true;
    });
  }, [search, categoryFilter, severityFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const activeFilterCount = [categoryFilter !== "all", severityFilter !== "all"].filter(Boolean).length;

  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
      <div className="px-7 pt-6 pb-5">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">Immutable Ledger</h3>
            <p className="text-[12px] text-[#CACACA] mt-1">{filtered.length} event{filtered.length !== 1 ? "s" : ""}{activeFilterCount > 0 ? " (filtered)" : ""}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-[280px]">
              <MagnifyingGlass size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#CACACA]" />
              <input ref={searchRef} type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} placeholder="Search logs…" className="w-full h-[38px] pl-9 pr-16 border border-[#F0F0F0] rounded-xl text-[13px] text-[#1A1A1A] placeholder:text-[#DCDCDC] focus:outline-none focus:border-[#DCDCDC] focus:shadow-[0_0_0_3px_rgba(0,0,0,0.02)] transition-all font-matter bg-white" />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] text-[#DCDCDC] font-mono bg-[#FAFAFA] border border-[#F0F0F0] px-1.5 py-0.5 rounded-md pointer-events-none"><Command size={9} weight="bold" />K</kbd>
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-1.5 px-3.5 h-[38px] border rounded-xl text-[12px] font-medium transition-all cursor-pointer ${showFilters || activeFilterCount > 0 ? "border-[#1A1A1A] text-[#1A1A1A] bg-white" : "border-[#F0F0F0] text-[#999] bg-white hover:border-[#DCDCDC]"}`}>
              <Funnel size={13} weight={activeFilterCount > 0 ? "fill" : "regular"} />Filters{activeFilterCount > 0 && <span className="ml-0.5 w-4 h-4 rounded-full bg-[#1A1A1A] text-white text-[9px] flex items-center justify-center">{activeFilterCount}</span>}
            </button>
            <button className="flex items-center gap-1.5 px-3.5 h-[38px] border border-[#F0F0F0] rounded-xl text-[12px] font-medium text-[#999] bg-white hover:border-[#DCDCDC] transition-all cursor-pointer">
              <Export size={13} /> Export
            </button>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="px-7 pb-5 flex items-center gap-3 flex-wrap border-b border-[#F5F5F5]">
          <FilterSelect value={categoryFilter} options={[{ value: "all", label: "All Categories" }, { value: "auth", label: "Auth" }, { value: "financial", label: "Financial" }, { value: "liveops", label: "LiveOps" }, { value: "system", label: "System" }, { value: "ai", label: "AI" }]} onChange={(v) => { setCategoryFilter(v as AuditCategory | "all"); setPage(0); }} />
          <FilterSelect value={severityFilter} options={[{ value: "all", label: "All Severity" }, { value: "info", label: "Info" }, { value: "warning", label: "Warning" }, { value: "critical", label: "Critical" }]} onChange={(v) => { setSeverityFilter(v); setPage(0); }} />
          {activeFilterCount > 0 && <button onClick={() => { setCategoryFilter("all"); setSeverityFilter("all"); setPage(0); }} className="flex items-center gap-1 text-[11px] font-medium text-[#ACACAC] hover:text-[#1A1A1A] bg-transparent border-none cursor-pointer ml-1 transition-colors"><X size={10} weight="bold" /> Reset</button>}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1100px]">
          <thead>
            <tr className="border-t border-b border-[#F5F5F5]">
              <th className="py-3.5 pl-7 pr-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Timestamp</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Actor</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">IP Address</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Category</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Target</th>
              <th className="py-3.5 pr-7 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Description</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr><td colSpan={6} className="py-20 text-center"><div className="flex flex-col items-center gap-3"><div className="w-12 h-12 rounded-2xl bg-[#F7F7F7] flex items-center justify-center"><MagnifyingGlass size={20} className="text-[#DCDCDC]" /></div><p className="text-[13px] text-[#ACACAC]">No logs match</p></div></td></tr>
            ) : paged.map((l, i) => (
              <tr key={l.id} className={`hover:bg-[#FAFAFA]/60 transition-colors duration-100 ${i > 0 ? "border-t border-[#F8F8F8]" : ""}`}>
                <td className="py-4 pl-7 pr-3">
                  <div className="flex items-center gap-2">
                    <Lock size={10} className="text-[#DCDCDC] shrink-0" />
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${SEVERITY_DOT[l.severity]}`} />
                    <span className="text-[11px] font-mono text-[#ACACAC] whitespace-nowrap">{l.timestamp}</span>
                  </div>
                </td>
                <td className="py-4 px-3"><span className="text-[12px] text-[#1A1A1A]">{l.actor}</span></td>
                <td className="py-4 px-3"><span className="text-[11px] font-mono text-[#ACACAC]">{l.ipAddress}</span></td>
                <td className="py-4 px-3"><span className={`inline-flex px-2.5 py-[3px] rounded-full text-[10.5px] font-medium ${CATEGORY_STYLE[l.category]}`}>{CATEGORY_LABELS[l.category]}</span></td>
                <td className="py-4 px-3"><span className="text-[11px] font-mono text-[#ACACAC]">{l.target}</span></td>
                <td className="py-4 pr-7 px-3"><span className="text-[12px] text-[#777] line-clamp-1">{l.description}</span></td>
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

export default memo(AuditLedgerTable);
