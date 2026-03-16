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
  WarningCircle,
  Prohibit,
  X,
  CaretDown,
  Command,
} from "@phosphor-icons/react";
import { students } from "./studentMockData";
import type { Student, StudentStatus, RiskLevel } from "./studentTypes";

const PAGE_SIZE = 8;

const STATUS_STYLE: Record<StudentStatus, string> = {
  active: "bg-[#F0F0F0] text-[#1A1A1A]",
  inactive: "bg-[#F5F5F5] text-[#999]",
  suspended: "bg-[#F5F5F5] text-[#E08A3C]",
  pending_deletion: "bg-[#F5F5F5] text-[#ACACAC]",
};

const STATUS_LABEL: Record<StudentStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  suspended: "Suspended",
  pending_deletion: "Pending Deletion",
};

const RISK_DOT: Record<RiskLevel, string> = {
  low: "bg-[#CACACA]",
  medium: "bg-[#E08A3C]",
  high: "bg-[#1A1A1A]",
};

const RISK_LABEL: Record<RiskLevel, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

const SPEND_TIERS = [
  { label: "All Tiers", min: 0, max: Infinity },
  { label: "< $1,000", min: 0, max: 1000 },
  { label: "$1K – $3K", min: 1000, max: 3000 },
  { label: "$3K – $5K", min: 3000, max: 5000 },
  { label: "$5K+", min: 5000, max: Infinity },
];

const MAX_HOURS = 420; // for engagement bar scaling

interface Props {
  onSelectStudent: (student: Student) => void;
}

function StudentTable({ onSelectStudent }: Props) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StudentStatus | "all">("all");
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "all">("all");
  const [spendTier, setSpendTier] = useState(0);
  const [contextMenu, setContextMenu] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // ⌘K / Ctrl+K to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Close context menu on outside click
  useEffect(() => {
    if (!contextMenu) return;
    const handler = () => setContextMenu(null);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [contextMenu]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return students.filter((s) => {
      if (q && !s.name.toLowerCase().includes(q) && !s.email.toLowerCase().includes(q) && !s.aegisId.toLowerCase().includes(q)) return false;
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      if (riskFilter !== "all" && s.riskScore !== riskFilter) return false;
      const tier = SPEND_TIERS[spendTier];
      if (s.lifetimeSpend < tier.min || s.lifetimeSpend >= tier.max) return false;
      return true;
    });
  }, [search, statusFilter, riskFilter, spendTier]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const rangeStart = page * PAGE_SIZE + 1;
  const rangeEnd = Math.min((page + 1) * PAGE_SIZE, filtered.length);

  const copyAegisId = useCallback((aegisId: string) => {
    navigator.clipboard.writeText(aegisId);
    setCopiedId(aegisId);
    setTimeout(() => setCopiedId(null), 1500);
  }, []);

  const activeFilterCount = [statusFilter !== "all", riskFilter !== "all", spendTier !== 0].filter(Boolean).length;

  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
      {/* Toolbar */}
      <div className="px-7 pt-6 pb-5">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">Student Directory</h3>
            <p className="text-[12px] text-[#CACACA] mt-1">
              {filtered.length} student{filtered.length !== 1 ? "s" : ""}{activeFilterCount > 0 ? " (filtered)" : ""}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative w-[280px]">
              <MagnifyingGlass size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#CACACA]" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                placeholder="Search students…"
                className="w-full h-[38px] pl-9 pr-16 border border-[#F0F0F0] rounded-xl text-[13px] text-[#1A1A1A] placeholder:text-[#DCDCDC] focus:outline-none focus:border-[#DCDCDC] focus:shadow-[0_0_0_3px_rgba(0,0,0,0.02)] transition-all font-matter bg-white"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] text-[#DCDCDC] font-mono bg-[#FAFAFA] border border-[#F0F0F0] px-1.5 py-0.5 rounded-md pointer-events-none">
                <Command size={9} weight="bold" />K
              </kbd>
            </div>
            {/* Filter toggle */}
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
          <FilterSelect
            value={statusFilter}
            options={[{ value: "all", label: "All Status" }, { value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }, { value: "suspended", label: "Suspended" }, { value: "pending_deletion", label: "Pending Deletion" }]}
            onChange={(v) => { setStatusFilter(v as StudentStatus | "all"); setPage(0); }}
          />
          <FilterSelect
            value={riskFilter}
            options={[{ value: "all", label: "All Risk Levels" }, { value: "low", label: "Low Risk" }, { value: "medium", label: "Medium Risk" }, { value: "high", label: "High Risk" }]}
            onChange={(v) => { setRiskFilter(v as RiskLevel | "all"); setPage(0); }}
          />
          <FilterSelect
            value={String(spendTier)}
            options={SPEND_TIERS.map((t, i) => ({ value: String(i), label: t.label }))}
            onChange={(v) => { setSpendTier(Number(v)); setPage(0); }}
          />
          {activeFilterCount > 0 && (
            <button
              onClick={() => { setStatusFilter("all"); setRiskFilter("all"); setSpendTier(0); setPage(0); }}
              className="flex items-center gap-1 text-[11px] font-medium text-[#ACACAC] hover:text-[#1A1A1A] bg-transparent border-none cursor-pointer ml-1 transition-colors"
            >
              <X size={10} weight="bold" /> Reset
            </button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[960px]">
          <thead>
            <tr className="border-t border-b border-[#F5F5F5]">
              <th className="py-3.5 pl-7 pr-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Student</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Aegis ID</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Status</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Engagement</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Lifetime Spend</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Risk Score</th>
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
                    <p className="text-[13px] text-[#ACACAC]">No students match your criteria</p>
                    <p className="text-[11px] text-[#DCDCDC]">Try adjusting your search or filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              paged.map((s, i) => (
                <tr
                  key={s.id}
                  onClick={() => onSelectStudent(s)}
                  className={`hover:bg-[#FAFAFA]/60 transition-colors duration-100 cursor-pointer group ${i > 0 ? "border-t border-[#F8F8F8]" : ""}`}
                >
                  {/* Student Info */}
                  <td className="py-4 pl-7 pr-3">
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-full overflow-hidden border border-[#F0F0F0] shrink-0 ring-2 ring-white">
                        <img src={s.avatar} alt={s.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[13px] font-normal text-[#1A1A1A] truncate leading-tight">{s.name}</span>
                        <span className="text-[11px] text-[#CACACA] font-normal truncate mt-0.5">{s.email}</span>
                      </div>
                    </div>
                  </td>
                  {/* Aegis ID */}
                  <td className="py-4 px-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); copyAegisId(s.aegisId); }}
                      className="group/copy flex items-center gap-1.5 text-[11.5px] font-mono text-[#ACACAC] hover:text-[#1A1A1A] bg-transparent border-none cursor-pointer transition-colors"
                      title="Click to copy"
                    >
                      <span className={copiedId === s.aegisId ? "text-[#1A1A1A]" : ""}>{copiedId === s.aegisId ? "Copied" : s.aegisId}</span>
                      <Copy size={10} weight="regular" className={`transition-opacity ${copiedId === s.aegisId ? "opacity-100 text-[#1A1A1A]" : "opacity-0 group-hover/copy:opacity-100"}`} />
                    </button>
                  </td>
                  {/* Status */}
                  <td className="py-4 px-3">
                    <span className={`inline-flex px-2.5 py-[3px] rounded-full text-[10.5px] font-medium tracking-wide ${STATUS_STYLE[s.status]}`}>
                      {STATUS_LABEL[s.status]}
                    </span>
                  </td>
                  {/* Engagement — visual bar */}
                  <td className="py-4 px-3">
                    <div className="flex flex-col gap-1.5 w-[140px]">
                      <div className="flex items-baseline gap-1">
                        <span className="text-[13px] font-normal text-[#1A1A1A] tabular-nums">{s.totalClasses}</span>
                        <span className="text-[10px] text-[#DCDCDC]">classes</span>
                        <span className="text-[#EBEBEB] mx-0.5">·</span>
                        <span className="text-[13px] font-normal text-[#1A1A1A] tabular-nums">{s.totalHours}</span>
                        <span className="text-[10px] text-[#DCDCDC]">h</span>
                      </div>
                      <div className="w-full h-[3px] bg-[#F0F0F0] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#1A1A1A] rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((s.totalHours / MAX_HOURS) * 100, 100)}%`, opacity: 0.2 + (s.totalHours / MAX_HOURS) * 0.8 }}
                        />
                      </div>
                    </div>
                  </td>
                  {/* Spend */}
                  <td className="py-4 px-3">
                    <span className="text-[13px] font-normal text-[#1A1A1A] tabular-nums">
                      ${s.lifetimeSpend.toLocaleString()}
                    </span>
                  </td>
                  {/* Risk */}
                  <td className="py-4 px-3">
                    <span className="flex items-center gap-2">
                      <span className={`w-[6px] h-[6px] rounded-full ${RISK_DOT[s.riskScore]}`} />
                      <span className="text-[12px] font-normal text-[#999]">{RISK_LABEL[s.riskScore]}</span>
                    </span>
                  </td>
                  {/* Actions */}
                  <td className="py-4 pr-7 pl-3 text-right relative">
                    <button
                      onClick={(e) => { e.stopPropagation(); setContextMenu(contextMenu === s.id ? null : s.id); }}
                      className="p-1.5 rounded-lg hover:bg-[#F5F5F5] bg-transparent border-none cursor-pointer text-[#CACACA] hover:text-[#999] transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <DotsThree size={18} weight="bold" />
                    </button>
                    {contextMenu === s.id && (
                      <div
                        className="absolute right-7 top-full mt-1 bg-white border border-[#F0F0F0] rounded-xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)] py-1 z-20 min-w-[180px] animate-contextIn"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ContextItem icon={<Eye size={13} />} label="View Profile" onClick={() => { setContextMenu(null); onSelectStudent(s); }} />
                        <ContextItem icon={<WarningCircle size={13} />} label="Send Warning" onClick={() => setContextMenu(null)} />
                        <div className="my-1 mx-3 border-t border-[#F5F5F5]" />
                        <ContextItem icon={<Prohibit size={13} />} label="Suspend Account" onClick={() => setContextMenu(null)} danger />
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
          <span className="text-[12px] text-[#CACACA] font-normal tabular-nums">
            {rangeStart}–{rangeEnd} of {filtered.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="w-8 h-8 rounded-lg border border-[#F0F0F0] bg-white text-[#999] hover:text-[#1A1A1A] hover:border-[#DCDCDC] disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer transition-all flex items-center justify-center"
            >
              <CaretLeft size={13} weight="bold" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-8 h-8 rounded-lg text-[12px] font-medium transition-all cursor-pointer border-none flex items-center justify-center ${
                  i === page
                    ? "bg-[#1A1A1A] text-white"
                    : "bg-transparent text-[#ACACAC] hover:bg-[#F5F5F5] hover:text-[#1A1A1A]"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="w-8 h-8 rounded-lg border border-[#F0F0F0] bg-white text-[#999] hover:text-[#1A1A1A] hover:border-[#DCDCDC] disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer transition-all flex items-center justify-center"
            >
              <CaretRight size={13} weight="bold" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterSelect({ value, options, onChange }: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none h-[34px] pl-3 pr-8 border border-[#F0F0F0] rounded-lg text-[12px] text-[#1A1A1A] bg-white focus:outline-none focus:border-[#DCDCDC] cursor-pointer font-matter transition-colors hover:border-[#DCDCDC]"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <CaretDown size={10} weight="bold" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#DCDCDC] pointer-events-none" />
    </div>
  );
}

function ContextItem({ icon, label, onClick, danger }: { icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-4 py-2 text-[12px] font-normal bg-transparent border-none cursor-pointer transition-colors text-left rounded-lg mx-0 ${
        danger ? "text-[#E08A3C] hover:bg-[#FFF8F3]" : "text-[#666] hover:bg-[#FAFAFA]"
      }`}
    >
      {icon} {label}
    </button>
  );
}

export default memo(StudentTable);
