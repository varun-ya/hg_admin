"use client";
import { useState, useMemo, memo, useEffect, useRef } from "react";
import {
  MagnifyingGlass,
  Funnel,
  CaretLeft,
  CaretRight,
  CaretDown,
  CheckCircle,
  Warning as WarningTriangleIcon,
  ImageBroken,
  ShieldCheck,
  ShieldWarning,
  LockSimple,
  ArrowRight,
  X,
  Command,
} from "@phosphor-icons/react";
import { kycApplicants } from "./kycMockData";
import type { KycApplicant, KycStatus, LmlensFlag } from "./kycTypes";

const PAGE_SIZE = 8;

const STATUS_LABEL: Record<KycStatus, string> = { new: "New", resubmitted: "Resubmitted", in_review: "In Review", waiting_on_user: "Waiting" };
const STATUS_STYLE: Record<KycStatus, string> = { new: "bg-[#F0F0F0] text-[#1A1A1A]", resubmitted: "bg-[#F5F5F5] text-[#ACACAC]", in_review: "bg-[#F5F5F5] text-[#293763]", waiting_on_user: "bg-[#F5F5F5] text-[#999]" };

const FLAG_ICON: Record<LmlensFlag, React.ReactNode> = {
  clear: <CheckCircle size={14} weight="fill" className="text-[#1A1A1A]" />,
  mismatch: <WarningTriangleIcon size={14} weight="fill" className="text-[#E08A3C]" />,
  blurry_id: <ImageBroken size={14} weight="fill" className="text-[#E08A3C]" />,
};
const FLAG_LABEL: Record<LmlensFlag, string> = { clear: "Clear", mismatch: "Mismatch", blurry_id: "Blurry ID" };
const FLAG_STYLE: Record<LmlensFlag, string> = { clear: "text-[#1A1A1A]", mismatch: "text-[#E08A3C]", blurry_id: "text-[#E08A3C]" };

const CONFIDENCE_TIERS = [
  { label: "All Confidence", min: 0, max: 101 },
  { label: "High (> 90%)", min: 90, max: 101 },
  { label: "Medium (60–90%)", min: 60, max: 90 },
  { label: "Low (< 60%)", min: 0, max: 60 },
];

const SUBJECTS = ["All Subjects", ...Array.from(new Set(kycApplicants.map((a) => a.subject)))];

interface Props { onBeginReview: (applicant: KycApplicant) => void }

function KycTriageQueue({ onBeginReview }: Props) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<KycStatus | "all">("all");
  const [subjectFilter, setSubjectFilter] = useState("All Subjects");
  const [confidenceTier, setConfidenceTier] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); searchRef.current?.focus(); } };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return kycApplicants.filter((a) => {
      if (q && !a.name.toLowerCase().includes(q) && !a.email.toLowerCase().includes(q) && !a.aegisId.toLowerCase().includes(q)) return false;
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (subjectFilter !== "All Subjects" && a.subject !== subjectFilter) return false;
      const tier = CONFIDENCE_TIERS[confidenceTier];
      if (a.lmlensConfidence < tier.min || a.lmlensConfidence >= tier.max) return false;
      return true;
    });
  }, [search, statusFilter, subjectFilter, confidenceTier]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const rangeStart = page * PAGE_SIZE + 1;
  const rangeEnd = Math.min((page + 1) * PAGE_SIZE, filtered.length);
  const activeFilterCount = [statusFilter !== "all", subjectFilter !== "All Subjects", confidenceTier !== 0].filter(Boolean).length;

  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
      {/* Toolbar */}
      <div className="px-7 pt-6 pb-5">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">Verification Triage Queue</h3>
            <p className="text-[12px] text-[#CACACA] mt-1">{filtered.length} application{filtered.length !== 1 ? "s" : ""}{activeFilterCount > 0 ? " (filtered)" : ""}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-[280px]">
              <MagnifyingGlass size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#CACACA]" />
              <input ref={searchRef} type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} placeholder="Search applicants…" className="w-full h-[38px] pl-9 pr-16 border border-[#F0F0F0] rounded-xl text-[13px] text-[#1A1A1A] placeholder:text-[#DCDCDC] focus:outline-none focus:border-[#DCDCDC] focus:shadow-[0_0_0_3px_rgba(0,0,0,0.02)] transition-all font-matter bg-white" />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] text-[#DCDCDC] font-mono bg-[#FAFAFA] border border-[#F0F0F0] px-1.5 py-0.5 rounded-md pointer-events-none"><Command size={9} weight="bold" />K</kbd>
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-1.5 px-3.5 h-[38px] border rounded-xl text-[12px] font-medium transition-all cursor-pointer ${showFilters || activeFilterCount > 0 ? "border-[#1A1A1A] text-[#1A1A1A] bg-white" : "border-[#F0F0F0] text-[#999] bg-white hover:border-[#DCDCDC]"}`}>
              <Funnel size={13} weight={activeFilterCount > 0 ? "fill" : "regular"} />
              Filters{activeFilterCount > 0 && <span className="ml-0.5 w-4 h-4 rounded-full bg-[#1A1A1A] text-white text-[9px] flex items-center justify-center">{activeFilterCount}</span>}
            </button>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="px-7 pb-5 flex items-center gap-3 flex-wrap border-b border-[#F5F5F5]">
          <FilterSelect value={statusFilter} options={[{ value: "all", label: "All Status" }, { value: "new", label: "New" }, { value: "resubmitted", label: "Resubmitted" }]} onChange={(v) => { setStatusFilter(v as KycStatus | "all"); setPage(0); }} />
          <FilterSelect value={subjectFilter} options={SUBJECTS.map((s) => ({ value: s, label: s }))} onChange={(v) => { setSubjectFilter(v); setPage(0); }} />
          <FilterSelect value={String(confidenceTier)} options={CONFIDENCE_TIERS.map((t, i) => ({ value: String(i), label: t.label }))} onChange={(v) => { setConfidenceTier(Number(v)); setPage(0); }} />
          {activeFilterCount > 0 && <button onClick={() => { setStatusFilter("all"); setSubjectFilter("All Subjects"); setConfidenceTier(0); setPage(0); }} className="flex items-center gap-1 text-[11px] font-medium text-[#ACACAC] hover:text-[#1A1A1A] bg-transparent border-none cursor-pointer ml-1 transition-colors"><X size={10} weight="bold" /> Reset</button>}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[920px]">
          <thead>
            <tr className="border-t border-b border-[#F5F5F5]">
              <th className="py-3.5 pl-7 pr-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Applicant</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Time in Queue</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Status</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">LMlens</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Aegis Risk</th>
              <th className="py-3.5 pr-7 pl-3 text-right text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Action</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr><td colSpan={6} className="py-20 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#F7F7F7] flex items-center justify-center"><MagnifyingGlass size={20} className="text-[#DCDCDC]" /></div>
                  <p className="text-[13px] text-[#ACACAC]">No applications match your criteria</p>
                  <p className="text-[11px] text-[#DCDCDC]">Try adjusting your search or filters</p>
                </div>
              </td></tr>
            ) : paged.map((a, i) => {
              const isBreached = a.hoursInQueue >= 48;
              return (
                <tr key={a.id} className={`hover:bg-[#FAFAFA]/60 transition-colors duration-100 group ${i > 0 ? "border-t border-[#F8F8F8]" : ""}`}>
                  <td className="py-4 pl-7 pr-3">
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-full overflow-hidden border border-[#F0F0F0] shrink-0 ring-2 ring-white">
                        <img src={a.avatar} alt={a.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[13px] font-normal text-[#1A1A1A] truncate leading-tight">{a.name}</span>
                        <span className="text-[11px] text-[#CACACA] font-normal truncate mt-0.5">{a.subject}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-3">
                    <span className={`text-[13px] font-normal tabular-nums ${isBreached ? "text-[#E08A3C]" : "text-[#1A1A1A]"}`}>
                      {a.timeInQueue}
                    </span>
                    {isBreached && <span className="ml-1.5 text-[9px] font-medium text-[#E08A3C] bg-[#FFF8F3] px-1.5 py-[1px] rounded-full">SLA</span>}
                  </td>
                  <td className="py-4 px-3">
                    <span className={`inline-flex px-2.5 py-[3px] rounded-full text-[10.5px] font-medium tracking-wide ${STATUS_STYLE[a.status]}`}>
                      {STATUS_LABEL[a.status]}
                    </span>
                  </td>
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-2">
                      {FLAG_ICON[a.lmlensFlag]}
                      <div className="flex flex-col">
                        <span className={`text-[12px] font-normal ${FLAG_STYLE[a.lmlensFlag]}`}>{FLAG_LABEL[a.lmlensFlag]}</span>
                        <span className="text-[10px] text-[#DCDCDC] tabular-nums">{a.lmlensConfidence}% conf.</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-3">
                    {a.aegisRisk === "safe" ? (
                      <span className="flex items-center gap-1.5 text-[12px] text-[#1A1A1A]"><ShieldCheck size={14} weight="fill" className="text-[#1A1A1A]" /> Safe</span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-[12px] text-[#E08A3C]"><ShieldWarning size={14} weight="fill" className="text-[#E08A3C]" /> {a.aegisRisk === "vpn_detected" ? "VPN" : "IP Mismatch"}</span>
                    )}
                  </td>
                  <td className="py-4 pr-7 pl-3 text-right">
                    {a.lockedBy ? (
                      <span className="flex items-center justify-end gap-1.5 text-[11px] text-[#CACACA]"><LockSimple size={12} /> Locked</span>
                    ) : (
                      <button onClick={() => onBeginReview(a)} className="flex items-center gap-1.5 px-3.5 py-2 bg-[#293763] text-white rounded-lg text-[11px] font-medium hover:bg-[#1E2A4A] transition-all cursor-pointer border-none active:scale-95 ml-auto">
                        Begin Review <ArrowRight size={11} weight="bold" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filtered.length > 0 && (
        <div className="flex items-center justify-between px-7 py-4 border-t border-[#F5F5F5]">
          <span className="text-[12px] text-[#CACACA] font-normal tabular-nums">{rangeStart}–{rangeEnd} of {filtered.length}</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} className="w-8 h-8 rounded-lg border border-[#F0F0F0] bg-white text-[#999] hover:text-[#1A1A1A] hover:border-[#DCDCDC] disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer transition-all flex items-center justify-center"><CaretLeft size={13} weight="bold" /></button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i)} className={`w-8 h-8 rounded-lg text-[12px] font-medium transition-all cursor-pointer border-none flex items-center justify-center ${i === page ? "bg-[#1A1A1A] text-white" : "bg-transparent text-[#ACACAC] hover:bg-[#F5F5F5] hover:text-[#1A1A1A]"}`}>{i + 1}</button>
            ))}
            <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1} className="w-8 h-8 rounded-lg border border-[#F0F0F0] bg-white text-[#999] hover:text-[#1A1A1A] hover:border-[#DCDCDC] disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer transition-all flex items-center justify-center"><CaretRight size={13} weight="bold" /></button>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterSelect({ value, options, onChange }: { value: string; options: { value: string; label: string }[]; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <select value={value} onChange={(e) => onChange(e.target.value)} className="appearance-none h-[34px] pl-3 pr-8 border border-[#F0F0F0] rounded-lg text-[12px] text-[#1A1A1A] bg-white focus:outline-none focus:border-[#DCDCDC] cursor-pointer font-matter transition-colors hover:border-[#DCDCDC]">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <CaretDown size={10} weight="bold" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#DCDCDC] pointer-events-none" />
    </div>
  );
}

export default memo(KycTriageQueue);
