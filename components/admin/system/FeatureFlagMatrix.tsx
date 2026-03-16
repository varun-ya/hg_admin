"use client";
import { useState, useMemo, memo, useEffect, useRef } from "react";
import {
  MagnifyingGlass, CaretLeft, CaretRight, CaretDown, Funnel, X, Command,
} from "@phosphor-icons/react";
import { featureFlags } from "./systemMockData";
import type { FeatureFlag, FlagEnvironment, FlagStatus } from "./systemTypes";
import FlagDrawer from "./FlagDrawer";

const PAGE_SIZE = 8;

const STATUS_STYLE: Record<FlagStatus, string> = {
  enabled: "bg-[#ECFDF5] text-[#10B981]",
  disabled: "bg-[#F5F5F5] text-[#999]",
  partial: "bg-[#FEF3C7] text-[#F59E0B]",
};

const ENV_STYLE: Record<FlagEnvironment, string> = {
  production: "bg-[#FEF2F2] text-[#E11D48]",
  staging: "bg-[#F0F0F0] text-[#777]",
};

function FeatureFlagMatrix() {
  const [localFlags, setLocalFlags] = useState(featureFlags);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [envFilter, setEnvFilter] = useState<FlagEnvironment | "all">("all");
  const [statusFilter, setStatusFilter] = useState<FlagStatus | "all">("all");
  const [selectedFlag, setSelectedFlag] = useState<FeatureFlag | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); searchRef.current?.focus(); } };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return localFlags.filter((f) => {
      if (q && !f.name.toLowerCase().includes(q) && !f.description.toLowerCase().includes(q)) return false;
      if (envFilter !== "all" && f.environment !== envFilter) return false;
      if (statusFilter !== "all" && f.status !== statusFilter) return false;
      return true;
    });
  }, [search, envFilter, statusFilter, localFlags]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const activeFilterCount = [envFilter !== "all", statusFilter !== "all"].filter(Boolean).length;

  const handleToggle = (id: string) => {
    setLocalFlags((prev) =>
      prev.map((f) => {
        if (f.id !== id) return f;
        const newStatus: FlagStatus = f.status === "enabled" ? "disabled" : "enabled";
        return { ...f, status: newStatus, rolloutPercent: newStatus === "enabled" ? 100 : 0 };
      })
    );
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
        <div className="px-7 pt-6 pb-5">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">Feature Matrix</h3>
              <p className="text-[12px] text-[#CACACA] mt-1">{filtered.length} flag{filtered.length !== 1 ? "s" : ""}{activeFilterCount > 0 ? " (filtered)" : ""}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-[280px]">
                <MagnifyingGlass size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#CACACA]" />
                <input ref={searchRef} type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} placeholder="Search flags…" className="w-full h-[38px] pl-9 pr-16 border border-[#F0F0F0] rounded-xl text-[13px] text-[#1A1A1A] placeholder:text-[#DCDCDC] focus:outline-none focus:border-[#DCDCDC] focus:shadow-[0_0_0_3px_rgba(0,0,0,0.02)] transition-all font-matter bg-white" />
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
            <FilterSelect value={envFilter} options={[{ value: "all", label: "All Environments" }, { value: "production", label: "Production" }, { value: "staging", label: "Staging" }]} onChange={(v) => { setEnvFilter(v as FlagEnvironment | "all"); setPage(0); }} />
            <FilterSelect value={statusFilter} options={[{ value: "all", label: "All Status" }, { value: "enabled", label: "Enabled" }, { value: "partial", label: "Partial" }, { value: "disabled", label: "Disabled" }]} onChange={(v) => { setStatusFilter(v as FlagStatus | "all"); setPage(0); }} />
            {activeFilterCount > 0 && <button onClick={() => { setEnvFilter("all"); setStatusFilter("all"); setPage(0); }} className="flex items-center gap-1 text-[11px] font-medium text-[#ACACAC] hover:text-[#1A1A1A] bg-transparent border-none cursor-pointer ml-1 transition-colors"><X size={10} weight="bold" /> Reset</button>}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[960px]">
            <thead>
              <tr className="border-t border-b border-[#F5F5F5]">
                <th className="py-3.5 pl-7 pr-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Flag Name</th>
                <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Env</th>
                <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Rollout</th>
                <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Status</th>
                <th className="py-3.5 pr-7 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em] text-right">Toggle</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((f, i) => (
                <tr key={f.id} onClick={() => setSelectedFlag(f)} className={`hover:bg-[#FAFAFA]/60 transition-colors duration-100 cursor-pointer ${i > 0 ? "border-t border-[#F8F8F8]" : ""}`}>
                  <td className="py-4 pl-7 pr-3">
                    <div>
                      <span className="text-[13px] font-mono text-[#1A1A1A]">{f.name}</span>
                      <p className="text-[11px] text-[#CACACA] mt-0.5 line-clamp-1">{f.description}</p>
                    </div>
                  </td>
                  <td className="py-4 px-3"><span className={`inline-flex px-2.5 py-[3px] rounded-full text-[10.5px] font-medium capitalize ${ENV_STYLE[f.environment]}`}>{f.environment}</span></td>
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-2 min-w-[130px]">
                      <div className="flex-1 h-[6px] bg-[#F5F5F5] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${f.rolloutPercent}%`, backgroundColor: f.rolloutPercent === 100 ? "#10B981" : f.rolloutPercent > 0 ? "#F59E0B" : "#DCDCDC" }} />
                      </div>
                      <span className="text-[11px] font-medium text-[#ACACAC] tabular-nums w-8 text-right">{f.rolloutPercent}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-3"><span className={`inline-flex px-2.5 py-[3px] rounded-full text-[10.5px] font-medium capitalize ${STATUS_STYLE[f.status]}`}>{f.status}</span></td>
                  <td className="py-4 pr-7 px-3 text-right">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleToggle(f.id); }}
                      className={`relative w-11 h-6 rounded-full transition-all shrink-0 border-none cursor-pointer ${f.status !== "disabled" ? "bg-[#10B981]" : "bg-[#DCDCDC]"}`}
                    >
                      <span className={`absolute top-[2px] w-5 h-5 rounded-full bg-white shadow-sm transition-all ${f.status !== "disabled" ? "left-[22px]" : "left-[2px]"}`} />
                    </button>
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

      <FlagDrawer flag={selectedFlag} onClose={() => setSelectedFlag(null)} />
    </>
  );
}

function FilterSelect({ value, options, onChange }: { value: string; options: { value: string; label: string }[]; onChange: (v: string) => void }) {
  return (<div className="relative"><select value={value} onChange={(e) => onChange(e.target.value)} className="appearance-none h-[34px] pl-3 pr-8 border border-[#F0F0F0] rounded-lg text-[12px] text-[#1A1A1A] bg-white focus:outline-none focus:border-[#DCDCDC] cursor-pointer font-matter transition-colors hover:border-[#DCDCDC]">{options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select><CaretDown size={10} weight="bold" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#DCDCDC] pointer-events-none" /></div>);
}

export default memo(FeatureFlagMatrix);
