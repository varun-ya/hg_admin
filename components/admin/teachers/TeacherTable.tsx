"use client";
import { useState, useMemo, memo, useCallback, useEffect, useRef } from "react";
import {
  MagnifyingGlass,
  Funnel,
  CaretLeft,
  CaretRight,
  DotsThree,
  Copy,
  Eye,
  CalendarX,
  Prohibit,
  X,
  CaretDown,
  Command,
  SealCheck,
} from "@phosphor-icons/react";
import { teachers } from "./teacherMockData";
import type { Teacher, TeacherStatus } from "./teacherTypes";

const PAGE_SIZE = 8;

const STATUS_STYLE: Record<TeacherStatus, string> = {
  verified: "bg-[#F0F0F0] text-[#1A1A1A]",
  unverified: "bg-[#F5F5F5] text-[#999]",
  suspended: "bg-[#F5F5F5] text-[#E08A3C]",
  under_review: "bg-[#F5F5F5] text-[#ACACAC]",
};

const STATUS_LABEL: Record<TeacherStatus, string> = {
  verified: "Verified",
  unverified: "Unverified",
  suspended: "Suspended",
  under_review: "Under Review",
};

const RATING_TIERS = [
  { label: "All Ratings", min: 0, max: 6 },
  { label: "★ 4.5+", min: 4.5, max: 6 },
  { label: "★ 4.0 – 4.5", min: 4.0, max: 4.5 },
  { label: "★ 3.0 – 4.0", min: 3.0, max: 4.0 },
  { label: "★ < 3.0", min: 0, max: 3.0 },
];

const SUBJECTS = ["All Subjects", ...Array.from(new Set(teachers.map((t) => t.subject)))];
const REGIONS = ["All Regions", ...Array.from(new Set(teachers.map((t) => t.region)))];

const MAX_HOURS = 2400;

function MiniSparkline({ data }: { data: number[] }) {
  if (data.every((v) => v === 0)) return <span className="text-[10px] text-[#DCDCDC]">—</span>;
  const h = 16, w = 36, pad = 1;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 0.01;
  const points = data.map((v, i) => ({
    x: pad + (i / (data.length - 1)) * (w - pad * 2),
    y: pad + (1 - (v - min) / range) * (h - pad * 2),
  }));
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const cpx = (points[i].x + points[i + 1].x) / 2;
    d += ` C ${cpx} ${points[i].y}, ${cpx} ${points[i + 1].y}, ${points[i + 1].x} ${points[i + 1].y}`;
  }
  const last = points[points.length - 1];
  const trending = data[data.length - 1] >= data[0];
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0">
      <path d={d} fill="none" stroke={trending ? "#1A1A1A" : "#E08A3C"} strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      <circle cx={last.x} cy={last.y} r="1.2" fill={trending ? "#1A1A1A" : "#E08A3C"} />
    </svg>
  );
}

interface Props {
  onSelectTeacher: (teacher: Teacher) => void;
}

function TeacherTable({ onSelectTeacher }: Props) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<TeacherStatus | "all">("all");
  const [subjectFilter, setSubjectFilter] = useState("All Subjects");
  const [regionFilter, setRegionFilter] = useState("All Regions");
  const [ratingTier, setRatingTier] = useState(0);
  const [contextMenu, setContextMenu] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); searchRef.current?.focus(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (!contextMenu) return;
    const handler = () => setContextMenu(null);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [contextMenu]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return teachers.filter((t) => {
      if (q && !t.name.toLowerCase().includes(q) && !t.email.toLowerCase().includes(q) && !t.aegisId.toLowerCase().includes(q) && !t.subject.toLowerCase().includes(q)) return false;
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (subjectFilter !== "All Subjects" && t.subject !== subjectFilter) return false;
      if (regionFilter !== "All Regions" && t.region !== regionFilter) return false;
      const tier = RATING_TIERS[ratingTier];
      if (t.avgRating < tier.min || t.avgRating >= tier.max) return false;
      return true;
    });
  }, [search, statusFilter, subjectFilter, regionFilter, ratingTier]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const rangeStart = page * PAGE_SIZE + 1;
  const rangeEnd = Math.min((page + 1) * PAGE_SIZE, filtered.length);

  const copyAegisId = useCallback((aegisId: string) => {
    navigator.clipboard.writeText(aegisId);
    setCopiedId(aegisId);
    setTimeout(() => setCopiedId(null), 1500);
  }, []);

  const activeFilterCount = [statusFilter !== "all", subjectFilter !== "All Subjects", regionFilter !== "All Regions", ratingTier !== 0].filter(Boolean).length;

  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
      {/* Toolbar */}
      <div className="px-7 pt-6 pb-5">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">Teacher Directory</h3>
            <p className="text-[12px] text-[#CACACA] mt-1">
              {filtered.length} tutor{filtered.length !== 1 ? "s" : ""}{activeFilterCount > 0 ? " (filtered)" : ""}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-[280px]">
              <MagnifyingGlass size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#CACACA]" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                placeholder="Search tutors…"
                className="w-full h-[38px] pl-9 pr-16 border border-[#F0F0F0] rounded-xl text-[13px] text-[#1A1A1A] placeholder:text-[#DCDCDC] focus:outline-none focus:border-[#DCDCDC] focus:shadow-[0_0_0_3px_rgba(0,0,0,0.02)] transition-all font-matter bg-white"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] text-[#DCDCDC] font-mono bg-[#FAFAFA] border border-[#F0F0F0] px-1.5 py-0.5 rounded-md pointer-events-none">
                <Command size={9} weight="bold" />K
              </kbd>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3.5 h-[38px] border rounded-xl text-[12px] font-medium transition-all cursor-pointer ${
                showFilters || activeFilterCount > 0
                  ? "border-[#1A1A1A] text-[#1A1A1A] bg-white"
                  : "border-[#F0F0F0] text-[#999] bg-white hover:border-[#DCDCDC]"
              }`}
            >
              <Funnel size={13} weight={activeFilterCount > 0 ? "fill" : "regular"} />
              Filters{activeFilterCount > 0 && <span className="ml-0.5 w-4 h-4 rounded-full bg-[#1A1A1A] text-white text-[9px] flex items-center justify-center">{activeFilterCount}</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      {showFilters && (
        <div className="px-7 pb-5 flex items-center gap-3 flex-wrap border-b border-[#F5F5F5]">
          <FilterSelect value={statusFilter} options={[{ value: "all", label: "All Status" }, { value: "verified", label: "Verified" }, { value: "unverified", label: "Unverified" }, { value: "suspended", label: "Suspended" }, { value: "under_review", label: "Under Review" }]} onChange={(v) => { setStatusFilter(v as TeacherStatus | "all"); setPage(0); }} />
          <FilterSelect value={subjectFilter} options={SUBJECTS.map((s) => ({ value: s, label: s }))} onChange={(v) => { setSubjectFilter(v); setPage(0); }} />
          <FilterSelect value={regionFilter} options={REGIONS.map((r) => ({ value: r, label: r }))} onChange={(v) => { setRegionFilter(v); setPage(0); }} />
          <FilterSelect value={String(ratingTier)} options={RATING_TIERS.map((t, i) => ({ value: String(i), label: t.label }))} onChange={(v) => { setRatingTier(Number(v)); setPage(0); }} />
          {activeFilterCount > 0 && (
            <button onClick={() => { setStatusFilter("all"); setSubjectFilter("All Subjects"); setRegionFilter("All Regions"); setRatingTier(0); setPage(0); }} className="flex items-center gap-1 text-[11px] font-medium text-[#ACACAC] hover:text-[#1A1A1A] bg-transparent border-none cursor-pointer ml-1 transition-colors">
              <X size={10} weight="bold" /> Reset
            </button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1060px]">
          <thead>
            <tr className="border-t border-b border-[#F5F5F5]">
              <th className="py-3.5 pl-7 pr-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Tutor</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Aegis ID</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Status</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Performance</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Financials</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Commission</th>
              <th className="py-3.5 pr-7 pl-3 text-right text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em] w-[60px]"></th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#F7F7F7] flex items-center justify-center">
                      <MagnifyingGlass size={20} className="text-[#DCDCDC]" />
                    </div>
                    <p className="text-[13px] text-[#ACACAC]">No tutors match your criteria</p>
                    <p className="text-[11px] text-[#DCDCDC]">Try adjusting your search or filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              paged.map((t, i) => (
                <tr
                  key={t.id}
                  onClick={() => onSelectTeacher(t)}
                  className={`hover:bg-[#FAFAFA]/60 transition-colors duration-100 cursor-pointer group ${i > 0 ? "border-t border-[#F8F8F8]" : ""}`}
                >
                  {/* Tutor Info */}
                  <td className="py-4 pl-7 pr-3">
                    <div className="flex items-center gap-3.5">
                      <div className="relative shrink-0">
                        <div className="w-9 h-9 rounded-full overflow-hidden border border-[#F0F0F0] ring-2 ring-white">
                          <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                        </div>
                        {t.isVerified && (
                          <SealCheck size={14} weight="fill" className="absolute -bottom-0.5 -right-0.5 text-[#293763] bg-white rounded-full" />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[13px] font-normal text-[#1A1A1A] truncate leading-tight">{t.name}</span>
                        <span className="text-[11px] text-[#CACACA] font-normal truncate mt-0.5">{t.subject}</span>
                      </div>
                    </div>
                  </td>
                  {/* Aegis ID */}
                  <td className="py-4 px-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); copyAegisId(t.aegisId); }}
                      className="group/copy flex items-center gap-1.5 text-[11.5px] font-mono text-[#ACACAC] hover:text-[#1A1A1A] bg-transparent border-none cursor-pointer transition-colors"
                    >
                      <span className={copiedId === t.aegisId ? "text-[#1A1A1A]" : ""}>{copiedId === t.aegisId ? "Copied" : t.aegisId}</span>
                      <Copy size={10} className={`transition-opacity ${copiedId === t.aegisId ? "opacity-100 text-[#1A1A1A]" : "opacity-0 group-hover/copy:opacity-100"}`} />
                    </button>
                  </td>
                  {/* Status */}
                  <td className="py-4 px-3">
                    <span className={`inline-flex px-2.5 py-[3px] rounded-full text-[10.5px] font-medium tracking-wide ${STATUS_STYLE[t.status]}`}>
                      {STATUS_LABEL[t.status]}
                    </span>
                  </td>
                  {/* Performance — rating + hours + sparkline */}
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-baseline gap-1">
                          <span className="text-[13px] font-normal text-[#1A1A1A] tabular-nums">{t.avgRating > 0 ? t.avgRating.toFixed(2) : "—"}</span>
                          {t.avgRating > 0 && <span className="text-[10px] text-[#DCDCDC]">★</span>}
                          <span className="text-[#EBEBEB] mx-0.5">·</span>
                          <span className="text-[13px] font-normal text-[#1A1A1A] tabular-nums">{t.totalHours.toLocaleString()}</span>
                          <span className="text-[10px] text-[#DCDCDC]">h</span>
                        </div>
                        <div className="w-[100px] h-[3px] bg-[#F0F0F0] rounded-full overflow-hidden">
                          <div className="h-full bg-[#1A1A1A] rounded-full transition-all duration-500" style={{ width: `${Math.min((t.totalHours / MAX_HOURS) * 100, 100)}%`, opacity: 0.2 + (t.totalHours / MAX_HOURS) * 0.8 }} />
                        </div>
                      </div>
                      <MiniSparkline data={t.ratingTrend} />
                    </div>
                  </td>
                  {/* Financials */}
                  <td className="py-4 px-3">
                    <div className="flex flex-col">
                      <span className="text-[13px] font-normal text-[#1A1A1A] tabular-nums">${t.lifetimeEarnings.toLocaleString()}</span>
                      <span className="text-[10px] text-[#DCDCDC] mt-0.5">${t.hourlyRate}/hr base</span>
                    </div>
                  </td>
                  {/* Commission */}
                  <td className="py-4 px-3">
                    <span className="text-[13px] font-normal text-[#1A1A1A] tabular-nums">{t.commissionTier}%</span>
                  </td>
                  {/* Actions */}
                  <td className="py-4 pr-7 pl-3 text-right relative">
                    <button
                      onClick={(e) => { e.stopPropagation(); setContextMenu(contextMenu === t.id ? null : t.id); }}
                      className="p-1.5 rounded-lg hover:bg-[#F5F5F5] bg-transparent border-none cursor-pointer text-[#CACACA] hover:text-[#999] transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <DotsThree size={18} weight="bold" />
                    </button>
                    {contextMenu === t.id && (
                      <div className="absolute right-7 top-full mt-1 bg-white border border-[#F0F0F0] rounded-xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)] py-1 z-20 min-w-[200px] animate-contextIn" onClick={(e) => e.stopPropagation()}>
                        <CtxItem icon={<Eye size={13} />} label="View Details" onClick={() => { setContextMenu(null); onSelectTeacher(t); }} />
                        <CtxItem icon={<CalendarX size={13} />} label="Force Schedule Override" onClick={() => setContextMenu(null)} />
                        <div className="my-1 mx-3 border-t border-[#F5F5F5]" />
                        <CtxItem icon={<Prohibit size={13} />} label="Suspend Account" onClick={() => setContextMenu(null)} danger />
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between px-7 py-4 border-t border-[#F5F5F5]">
          <span className="text-[12px] text-[#CACACA] font-normal tabular-nums">{rangeStart}–{rangeEnd} of {filtered.length}</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} className="w-8 h-8 rounded-lg border border-[#F0F0F0] bg-white text-[#999] hover:text-[#1A1A1A] hover:border-[#DCDCDC] disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer transition-all flex items-center justify-center">
              <CaretLeft size={13} weight="bold" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i)} className={`w-8 h-8 rounded-lg text-[12px] font-medium transition-all cursor-pointer border-none flex items-center justify-center ${i === page ? "bg-[#1A1A1A] text-white" : "bg-transparent text-[#ACACAC] hover:bg-[#F5F5F5] hover:text-[#1A1A1A]"}`}>
                {i + 1}
              </button>
            ))}
            <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1} className="w-8 h-8 rounded-lg border border-[#F0F0F0] bg-white text-[#999] hover:text-[#1A1A1A] hover:border-[#DCDCDC] disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer transition-all flex items-center justify-center">
              <CaretRight size={13} weight="bold" />
            </button>
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

function CtxItem({ icon, label, onClick, danger }: { icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-2.5 px-4 py-2 text-[12px] font-normal bg-transparent border-none cursor-pointer transition-colors text-left rounded-lg mx-0 ${danger ? "text-[#E08A3C] hover:bg-[#FFF8F3]" : "text-[#666] hover:bg-[#FAFAFA]"}`}>
      {icon} {label}
    </button>
  );
}

export default memo(TeacherTable);
