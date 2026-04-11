"use client";
import { useState, useMemo, memo, useEffect, useRef } from "react";
import {
  MagnifyingGlass, Funnel, CaretLeft, CaretRight, CaretDown, DotsThree,
  Eye, Export, X, Command,
} from "@phosphor-icons/react";
import { transactions } from "./financialMockData";
import type { Transaction, TxnStatus, Gateway } from "./financialTypes";

const PAGE_SIZE = 8;

const STATUS_STYLE: Record<TxnStatus, string> = {
  cleared: "bg-[#FFF7ED] text-[#E08A3C]",
  pending: "bg-[#F0F0F0] text-[#1A1A1A]",
  failed: "bg-[#FFF1E6] text-[#C2571A]",
};

const GATEWAY_STYLE: Record<Gateway, string> = {
  razorpay: "bg-[#FFF7ED] text-[#E08A3C]",
  stripe: "bg-[#F0F0F0] text-[#1A1A1A]",
  paypal: "bg-[#FFF8F3] text-[#E08A3C]",
};

interface Props { onSelect: (t: Transaction) => void }

function RevenueEscrowTable({ onSelect }: Props) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<TxnStatus | "all">("all");
  const [gatewayFilter, setGatewayFilter] = useState<Gateway | "all">("all");
  const [destFilter, setDestFilter] = useState<"escrow" | "revenue" | "all">("all");
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
    return transactions.filter((t) => {
      if (q && !t.studentName.toLowerCase().includes(q) && !t.txnId.toLowerCase().includes(q) && !t.teacherName.toLowerCase().includes(q)) return false;
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (gatewayFilter !== "all" && t.gateway !== gatewayFilter) return false;
      if (destFilter !== "all" && t.destination !== destFilter) return false;
      return true;
    });
  }, [search, statusFilter, gatewayFilter, destFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const activeFilterCount = [statusFilter !== "all", gatewayFilter !== "all", destFilter !== "all"].filter(Boolean).length;

  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
      <div className="px-7 pt-6 pb-5">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">Master Ledger</h3>
            <p className="text-[12px] text-[#CACACA] mt-1">{filtered.length} transaction{filtered.length !== 1 ? "s" : ""}{activeFilterCount > 0 ? " (filtered)" : ""}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-[280px]">
              <MagnifyingGlass size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#CACACA]" />
              <input ref={searchRef} type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} placeholder="Search transactions…" className="w-full h-[38px] pl-9 pr-16 border border-[#F0F0F0] rounded-xl text-[13px] text-[#1A1A1A] placeholder:text-[#DCDCDC] focus:outline-none focus:border-[#DCDCDC] focus:shadow-[0_0_0_3px_rgba(0,0,0,0.02)] transition-all font-matter bg-white" />
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
          <FilterSelect value={statusFilter} options={[{ value: "all", label: "All Status" }, { value: "cleared", label: "Cleared" }, { value: "pending", label: "Pending" }, { value: "failed", label: "Failed" }]} onChange={(v) => { setStatusFilter(v as TxnStatus | "all"); setPage(0); }} />
          <FilterSelect value={gatewayFilter} options={[{ value: "all", label: "All Gateways" }, { value: "razorpay", label: "Razorpay" }, { value: "stripe", label: "Stripe" }, { value: "paypal", label: "PayPal" }]} onChange={(v) => { setGatewayFilter(v as Gateway | "all"); setPage(0); }} />
          <FilterSelect value={destFilter} options={[{ value: "all", label: "All Destinations" }, { value: "escrow", label: "Escrow" }, { value: "revenue", label: "Revenue" }]} onChange={(v) => { setDestFilter(v as "escrow" | "revenue" | "all"); setPage(0); }} />
          {activeFilterCount > 0 && <button onClick={() => { setStatusFilter("all"); setGatewayFilter("all"); setDestFilter("all"); setPage(0); }} className="flex items-center gap-1 text-[11px] font-medium text-[#ACACAC] hover:text-[#1A1A1A] bg-transparent border-none cursor-pointer ml-1 transition-colors"><X size={10} weight="bold" /> Reset</button>}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1060px]">
          <thead>
            <tr className="border-t border-b border-[#F5F5F5]">
              <th className="py-3.5 pl-7 pr-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Txn ID</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Date</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Student</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Amount</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Gateway</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Destination</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Status</th>
              <th className="py-3.5 pr-7 pl-3 text-right text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em] w-[60px]"></th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr><td colSpan={8} className="py-20 text-center"><div className="flex flex-col items-center gap-3"><div className="w-12 h-12 rounded-2xl bg-[#F7F7F7] flex items-center justify-center"><MagnifyingGlass size={20} className="text-[#DCDCDC]" /></div><p className="text-[13px] text-[#ACACAC]">No transactions match</p></div></td></tr>
            ) : paged.map((t, i) => (
              <tr key={t.id} onClick={() => onSelect(t)} className={`hover:bg-[#FAFAFA]/60 transition-colors duration-100 cursor-pointer group ${i > 0 ? "border-t border-[#F8F8F8]" : ""}`}>
                <td className="py-4 pl-7 pr-3"><span className="text-[12px] font-mono text-[#ACACAC]">{t.txnId}</span></td>
                <td className="py-4 px-3"><span className="text-[12px] text-[#777]">{t.date}</span></td>
                <td className="py-4 px-3"><span className="text-[13px] text-[#1A1A1A]">{t.studentName}</span></td>
                <td className="py-4 px-3"><span className="text-[13px] font-normal text-[#1A1A1A] tabular-nums">${t.totalAmount.toLocaleString()}</span></td>
                <td className="py-4 px-3"><span className={`inline-flex px-2.5 py-[3px] rounded-full text-[10.5px] font-medium capitalize ${GATEWAY_STYLE[t.gateway]}`}>{t.gateway}</span></td>
                <td className="py-4 px-3">
                  <span className={`inline-flex items-center gap-1.5 text-[12px] font-medium ${t.destination === "escrow" ? "text-[#E08A3C]" : "text-[#E08A3C]"}`}>
                    <span className={`w-[5px] h-[5px] rounded-full ${t.destination === "escrow" ? "bg-[#E08A3C]" : "bg-[#E08A3C]"}`} />
                    {t.destination === "escrow" ? "Escrow" : "Revenue"}
                  </span>
                </td>
                <td className="py-4 px-3"><span className={`inline-flex px-2.5 py-[3px] rounded-full text-[10.5px] font-medium capitalize ${STATUS_STYLE[t.status]}`}>{t.status}</span></td>
                <td className="py-4 pr-7 pl-3 text-right relative">
                  <button onClick={(e) => { e.stopPropagation(); setContextMenu(contextMenu === t.id ? null : t.id); }} className="p-1.5 rounded-lg hover:bg-[#F5F5F5] bg-transparent border-none cursor-pointer text-[#CACACA] hover:text-[#999] transition-colors opacity-0 group-hover:opacity-100"><DotsThree size={18} weight="bold" /></button>
                  {contextMenu === t.id && (
                    <div className="absolute right-7 top-full mt-1 bg-white border border-[#F0F0F0] rounded-xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)] py-1 z-20 min-w-[200px] animate-contextIn" onClick={(e) => e.stopPropagation()}>
                      <CtxItem icon={<Eye size={13} />} label="View Breakdown" onClick={() => { setContextMenu(null); onSelect(t); }} />
                      <CtxItem icon={<Export size={13} />} label="Export Ledger (CSV)" onClick={() => setContextMenu(null)} />
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

export default memo(RevenueEscrowTable);
