"use client";
import { useState, useMemo, memo, useCallback, useEffect, useRef } from "react";
import {
  MagnifyingGlass,
  Funnel,
  CaretLeft,
  CaretRight,
  DotsThree,
  Eye,
  SignOut,
  UserMinus,
  X,
  CaretDown,
  Command,
  ShieldCheck,
  ShieldWarning,
  Clock as ClockIcon,
} from "@phosphor-icons/react";
import { staffMembers } from "./staffMockData";
import type { StaffMember, AegisRole, StaffStatus, MfaStatus } from "./staffTypes";

const PAGE_SIZE = 8;

const ROLE_STYLE: Record<AegisRole, { bg: string; text: string; label: string }> = {
  super_admin: { bg: "bg-[#F3F0FF]", text: "text-[#6B4FBB]", label: "Super Admin" },
  trust_safety: { bg: "bg-[#EFF6FF]", text: "text-[#3B6FC0]", label: "Trust & Safety" },
  finance_ops: { bg: "bg-[#F0F0F0]", text: "text-[#1A1A1A]", label: "Finance Ops" },
  tier1_support: { bg: "bg-[#F0F0F0]", text: "text-[#777]", label: "Tier 1 Support" },
};

const STATUS_STYLE: Record<StaffStatus, string> = {
  active: "bg-[#F0F0F0] text-[#1A1A1A]",
  revoked: "bg-[#F5F5F5] text-[#ACACAC]",
};

const MFA_ICON: Record<MfaStatus, React.ReactNode> = {
  enabled: <ShieldCheck size={14} weight="fill" className="text-[#1A1A1A]" />,
  pending: <ClockIcon size={14} weight="regular" className="text-[#E08A3C]" />,
  disabled: <ShieldWarning size={14} weight="fill" className="text-[#C2571A]" />,
};

const MFA_LABEL: Record<MfaStatus, { text: string; color: string }> = {
  enabled: { text: "Enabled", color: "text-[#1A1A1A]" },
  pending: { text: "Pending", color: "text-[#E08A3C]" },
  disabled: { text: "Disabled", color: "text-[#C2571A]" },
};

interface Props {
  onSelectStaff: (staff: StaffMember) => void;
}

function StaffTable({ onSelectStaff }: Props) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [roleFilter, setRoleFilter] = useState<AegisRole | "all">("all");
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<StaffStatus | "all">("all");
  const [contextMenu, setContextMenu] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const departments = useMemo(() => [...new Set(staffMembers.map((s) => s.department))], []);

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
    return staffMembers.filter((s) => {
      if (q && !s.name.toLowerCase().includes(q) && !s.email.toLowerCase().includes(q) && !s.id.toLowerCase().includes(q)) return false;
      if (roleFilter !== "all" && s.aegisRole !== roleFilter) return false;
      if (deptFilter !== "all" && s.department !== deptFilter) return false;
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      return true;
    });
  }, [search, roleFilter, deptFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const rangeStart = page * PAGE_SIZE + 1;
  const rangeEnd = Math.min((page + 1) * PAGE_SIZE, filtered.length);

  const activeFilterCount = [roleFilter !== "all", deptFilter !== "all", statusFilter !== "all"].filter(Boolean).length;

  const resetFilters = useCallback(() => {
    setRoleFilter("all"); setDeptFilter("all"); setStatusFilter("all"); setPage(0);
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
      {/* Toolbar */}
      <div className="px-7 pt-6 pb-5">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">Staff Directory</h3>
            <p className="text-[12px] text-[#CACACA] mt-1">
              {filtered.length} member{filtered.length !== 1 ? "s" : ""}{activeFilterCount > 0 ? " (filtered)" : ""}
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
                placeholder="Search staff…"
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
          <FilterSelect
            value={roleFilter}
            options={[{ value: "all", label: "All Roles" }, { value: "super_admin", label: "Super Admin" }, { value: "trust_safety", label: "Trust & Safety" }, { value: "finance_ops", label: "Finance Ops" }, { value: "tier1_support", label: "Tier 1 Support" }]}
            onChange={(v) => { setRoleFilter(v as AegisRole | "all"); setPage(0); }}
          />
          <FilterSelect
            value={deptFilter}
            options={[{ value: "all", label: "All Departments" }, ...departments.map((d) => ({ value: d, label: d }))]}
            onChange={(v) => { setDeptFilter(v); setPage(0); }}
          />
          <FilterSelect
            value={statusFilter}
            options={[{ value: "all", label: "All Status" }, { value: "active", label: "Active" }, { value: "revoked", label: "Revoked" }]}
            onChange={(v) => { setStatusFilter(v as StaffStatus | "all"); setPage(0); }}
          />
          {activeFilterCount > 0 && (
            <button onClick={resetFilters} className="flex items-center gap-1 text-[11px] font-medium text-[#ACACAC] hover:text-[#1A1A1A] bg-transparent border-none cursor-pointer ml-1 transition-colors">
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
              <th className="py-3.5 pl-7 pr-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Staff Member</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Aegis Role</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Department</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">2FA Status</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Last Active</th>
              <th className="py-3.5 pr-7 pl-3 text-right text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em] w-[60px]"></th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#F7F7F7] flex items-center justify-center">
                      <MagnifyingGlass size={20} className="text-[#DCDCDC]" />
                    </div>
                    <p className="text-[13px] text-[#ACACAC]">No staff match your criteria</p>
                    <p className="text-[11px] text-[#DCDCDC]">Try adjusting your search or filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              paged.map((s, i) => {
                const role = ROLE_STYLE[s.aegisRole];
                const mfa = MFA_LABEL[s.mfaStatus];
                const isRevoked = s.status === "revoked";
                return (
                  <tr
                    key={s.id}
                    onClick={() => onSelectStaff(s)}
                    className={`hover:bg-[#FAFAFA]/60 transition-colors duration-100 cursor-pointer group ${i > 0 ? "border-t border-[#F8F8F8]" : ""} ${isRevoked ? "opacity-50" : ""}`}
                  >
                    {/* Staff Info */}
                    <td className="py-4 pl-7 pr-3">
                      <div className="flex items-center gap-3.5">
                        <div className={`w-9 h-9 rounded-full overflow-hidden border border-[#F0F0F0] shrink-0 ring-2 ring-white ${isRevoked ? "grayscale" : ""}`}>
                          <img src={s.avatar} alt={s.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-normal text-[#1A1A1A] truncate leading-tight">{s.name}</span>
                            {isRevoked && (
                              <span className={`inline-flex px-2 py-[2px] rounded-full text-[9px] font-medium ${STATUS_STYLE.revoked}`}>Revoked</span>
                            )}
                          </div>
                          <span className="text-[11px] text-[#CACACA] font-normal truncate mt-0.5">{s.email}</span>
                        </div>
                      </div>
                    </td>
                    {/* Role */}
                    <td className="py-4 px-3">
                      <span className={`inline-flex px-2.5 py-[3px] rounded-full text-[10.5px] font-medium tracking-wide ${role.bg} ${role.text}`}>
                        {role.label}
                      </span>
                    </td>
                    {/* Department */}
                    <td className="py-4 px-3">
                      <span className="text-[12px] font-normal text-[#777]">{s.department}</span>
                    </td>
                    {/* 2FA */}
                    <td className="py-4 px-3">
                      <span className={`flex items-center gap-1.5 text-[12px] font-normal ${mfa.color}`}>
                        {MFA_ICON[s.mfaStatus]}
                        {mfa.text}
                      </span>
                    </td>
                    {/* Last Active */}
                    <td className="py-4 px-3">
                      <div className="flex flex-col">
                        <span className="text-[12px] font-normal text-[#1A1A1A]">{s.lastActiveTime}</span>
                        <span className="text-[10px] text-[#DCDCDC] font-mono mt-0.5">{s.lastActiveIp}</span>
                      </div>
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
                          className="absolute right-7 top-full mt-1 bg-white border border-[#F0F0F0] rounded-xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)] py-1 z-20 min-w-[200px] animate-contextIn"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ContextItem icon={<Eye size={13} />} label="View Audit Profile" onClick={() => { setContextMenu(null); onSelectStaff(s); }} />
                          <ContextItem icon={<SignOut size={13} />} label="Force Global Logout" onClick={() => setContextMenu(null)} />
                          <div className="my-1 mx-3 border-t border-[#F5F5F5]" />
                          <ContextItem icon={<UserMinus size={13} />} label="Suspend Agent" onClick={() => setContextMenu(null)} danger />
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
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
                  i === page ? "bg-[#1A1A1A] text-white" : "bg-transparent text-[#ACACAC] hover:bg-[#F5F5F5] hover:text-[#1A1A1A]"
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

function FilterSelect({ value, options, onChange }: { value: string; options: { value: string; label: string }[]; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none h-[34px] pl-3 pr-8 border border-[#F0F0F0] rounded-lg text-[12px] text-[#1A1A1A] bg-white focus:outline-none focus:border-[#DCDCDC] cursor-pointer font-matter transition-colors hover:border-[#DCDCDC]"
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
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

export default memo(StaffTable);
