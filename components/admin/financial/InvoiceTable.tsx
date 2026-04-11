"use client";
import { useState, useMemo, memo, useEffect, useRef } from "react";
import {
  MagnifyingGlass, Funnel, CaretLeft, CaretRight, CaretDown, DotsThree,
  Eye, ArrowsClockwise, EnvelopeSimple, X, Command,
} from "@phosphor-icons/react";
import { invoices } from "./financialMockData";
import type { Invoice, InvoiceType, InvoiceStatus } from "./financialTypes";

const PAGE_SIZE = 8;

const STATUS_STYLE: Record<InvoiceStatus, string> = {
  generated: "bg-[#FFF7ED] text-[#E08A3C]",
  sent: "bg-[#F5F5F5] text-[#999]",
  failed: "bg-[#FFF1E6] text-[#C2571A]",
  regenerating: "bg-[#FFF7ED] text-[#D4956A]",
};

const TYPE_LABEL: Record<InvoiceType, string> = {
  platform_invoice: "Platform Invoice",
  student_receipt: "Student Receipt",
};

interface Props { onSelect: (inv: Invoice) => void }

function InvoiceTable({ onSelect }: Props) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [typeFilter, setTypeFilter] = useState<InvoiceType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "all">("all");
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
    return invoices.filter((inv) => {
      if (q && !inv.billTo.toLowerCase().includes(q) && !inv.invoiceId.toLowerCase().includes(q)) return false;
      if (typeFilter !== "all" && inv.type !== typeFilter) return false;
      if (statusFilter !== "all" && inv.status !== statusFilter) return false;
      return true;
    });
  }, [search, typeFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const activeFilterCount = [typeFilter !== "all", statusFilter !== "all"].filter(Boolean).length;

  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
      <div className="px-7 pt-6 pb-5">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">Document Repository</h3>
            <p className="text-[12px] text-[#CACACA] mt-1">{filtered.length} document{filtered.length !== 1 ? "s" : ""}{activeFilterCount > 0 ? " (filtered)" : ""}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-[280px]">
              <MagnifyingGlass size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#CACACA]" />
              <input ref={searchRef} type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} placeholder="Search invoices…" className="w-full h-[38px] pl-9 pr-16 border border-[#F0F0F0] rounded-xl text-[13px] text-[#1A1A1A] placeholder:text-[#DCDCDC] focus:outline-none focus:border-[#DCDCDC] focus:shadow-[0_0_0_3px_rgba(0,0,0,0.02)] transition-all font-matter bg-white" />
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
          <FilterSelect value={typeFilter} options={[{ value: "all", label: "All Types" }, { value: "platform_invoice", label: "Platform Invoice" }, { value: "student_receipt", label: "Student Receipt" }]} onChange={(v) => { setTypeFilter(v as InvoiceType | "all"); setPage(0); }} />
          <FilterSelect value={statusFilter} options={[{ value: "all", label: "All Status" }, { value: "generated", label: "Generated" }, { value: "sent", label: "Sent" }, { value: "failed", label: "Failed" }, { value: "regenerating", label: "Regenerating" }]} onChange={(v) => { setStatusFilter(v as InvoiceStatus | "all"); setPage(0); }} />
          {activeFilterCount > 0 && <button onClick={() => { setTypeFilter("all"); setStatusFilter("all"); setPage(0); }} className="flex items-center gap-1 text-[11px] font-medium text-[#ACACAC] hover:text-[#1A1A1A] bg-transparent border-none cursor-pointer ml-1 transition-colors"><X size={10} weight="bold" /> Reset</button>}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1020px]">
          <thead>
            <tr className="border-t border-b border-[#F5F5F5]">
              <th className="py-3.5 pl-7 pr-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Invoice ID</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Date</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Bill To</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Type</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Total</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Tax</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Status</th>
              <th className="py-3.5 pr-7 pl-3 text-right text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em] w-[60px]"></th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr><td colSpan={8} className="py-20 text-center"><div className="flex flex-col items-center gap-3"><div className="w-12 h-12 rounded-2xl bg-[#F7F7F7] flex items-center justify-center"><MagnifyingGlass size={20} className="text-[#DCDCDC]" /></div><p className="text-[13px] text-[#ACACAC]">No invoices match</p></div></td></tr>
            ) : paged.map((inv, i) => (
              <tr key={inv.id} onClick={() => onSelect(inv)} className={`hover:bg-[#FAFAFA]/60 transition-colors duration-100 cursor-pointer group ${i > 0 ? "border-t border-[#F8F8F8]" : ""}`}>
                <td className="py-4 pl-7 pr-3"><span className="text-[12px] font-mono text-[#ACACAC]">{inv.invoiceId}</span></td>
                <td className="py-4 px-3"><span className="text-[12px] text-[#777]">{inv.date}</span></td>
                <td className="py-4 px-3"><span className="text-[13px] text-[#1A1A1A]">{inv.billTo}</span></td>
                <td className="py-4 px-3"><span className={`text-[12px] ${inv.type === "platform_invoice" ? "text-[#E08A3C]" : "text-[#777]"}`}>{TYPE_LABEL[inv.type]}</span></td>
                <td className="py-4 px-3"><span className="text-[13px] font-normal text-[#1A1A1A] tabular-nums">${inv.total.toLocaleString()}</span></td>
                <td className="py-4 px-3"><span className="text-[12px] text-[#777] tabular-nums">${inv.taxComponent.toLocaleString()}</span></td>
                <td className="py-4 px-3"><span className={`inline-flex px-2.5 py-[3px] rounded-full text-[10.5px] font-medium capitalize ${STATUS_STYLE[inv.status]}`}>{inv.status}</span></td>
                <td className="py-4 pr-7 pl-3 text-right relative">
                  <button onClick={(e) => { e.stopPropagation(); setContextMenu(contextMenu === inv.id ? null : inv.id); }} className="p-1.5 rounded-lg hover:bg-[#F5F5F5] bg-transparent border-none cursor-pointer text-[#CACACA] hover:text-[#999] transition-colors opacity-0 group-hover:opacity-100"><DotsThree size={18} weight="bold" /></button>
                  {contextMenu === inv.id && (
                    <div className="absolute right-7 top-full mt-1 bg-white border border-[#F0F0F0] rounded-xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)] py-1 z-20 min-w-[220px] animate-contextIn" onClick={(e) => e.stopPropagation()}>
                      <CtxItem icon={<Eye size={13} />} label="View Document" onClick={() => { setContextMenu(null); onSelect(inv); }} />
                      <CtxItem icon={<ArrowsClockwise size={13} />} label="Regenerate" onClick={() => setContextMenu(null)} />
                      <CtxItem icon={<EnvelopeSimple size={13} />} label="Email Copy" onClick={() => setContextMenu(null)} />
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

export default memo(InvoiceTable);
