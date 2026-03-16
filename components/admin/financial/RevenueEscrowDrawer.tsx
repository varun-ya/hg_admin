"use client";
import { memo, useEffect } from "react";
import { X, Export, ArrowRight } from "@phosphor-icons/react";
import type { Transaction, TxnStatus } from "./financialTypes";

const STATUS_STYLE: Record<TxnStatus, string> = {
  cleared: "bg-[#ECFDF5] text-[#10B981]",
  pending: "bg-[#F0F0F0] text-[#1A1A1A]",
  failed: "bg-[#FEF2F2] text-[#E11D48]",
};

interface Props { txn: Transaction | null; onClose: () => void }

function RevenueEscrowDrawer({ txn, onClose }: Props) {
  useEffect(() => {
    if (!txn) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [txn, onClose]);

  if (!txn) return null;

  const flowSteps = [
    { label: "Student Payment", value: `$${txn.totalAmount.toLocaleString()}`, sub: txn.studentName, color: "#1A1A1A" },
    { label: txn.destination === "escrow" ? "Held in Escrow" : "Cleared to Revenue", value: `$${txn.totalAmount.toLocaleString()}`, sub: `via ${txn.gateway.charAt(0).toUpperCase() + txn.gateway.slice(1)}`, color: txn.destination === "escrow" ? "#4F46E5" : "#10B981" },
    { label: "Platform Commission", value: `$${txn.platformCut.toLocaleString()}`, sub: `${((txn.platformCut / txn.totalAmount) * 100).toFixed(1)}% take-rate`, color: "#10B981" },
    { label: "Teacher Payout", value: `$${txn.teacherPayout.toLocaleString()}`, sub: txn.teacherName, color: "#1A1A1A" },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex justify-end font-matter">
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-[520px] max-w-full bg-white h-full shadow-[-8px_0_30px_-10px_rgba(0,0,0,0.08)] flex flex-col animate-slideIn">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-[#F0F0F0] shrink-0">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-[15px] font-medium text-[#1A1A1A] font-season">{txn.txnId}</h2>
              <span className={`inline-flex px-2.5 py-[3px] rounded-full text-[10.5px] font-medium capitalize ${STATUS_STYLE[txn.status]}`}>{txn.status}</span>
            </div>
            <p className="text-[12px] text-[#ACACAC]">{txn.date}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-[#F7F7F7] border border-[#F0F0F0] flex items-center justify-center text-[#ACACAC] hover:text-[#1A1A1A] hover:border-[#DCDCDC] cursor-pointer transition-all"><X size={14} weight="bold" /></button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-7 space-y-7">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Stat label="Total" value={`$${txn.totalAmount.toLocaleString()}`} />
            <Stat label="Platform Cut" value={`$${txn.platformCut.toLocaleString()}`} accent="#10B981" />
            <Stat label="Teacher Net" value={`$${txn.teacherPayout.toLocaleString()}`} />
          </div>

          {/* Money Flow Timeline */}
          <div>
            <p className="text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.12em] mb-4">Money Flow</p>
            <div className="space-y-0">
              {flowSteps.map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full border-2 shrink-0" style={{ borderColor: step.color }} />
                    {i < flowSteps.length - 1 && <div className="w-[1.5px] h-12 bg-[#F0F0F0]" />}
                  </div>
                  <div className="pb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium text-[#1A1A1A]">{step.label}</span>
                      {i < flowSteps.length - 1 && <ArrowRight size={10} className="text-[#DCDCDC]" />}
                    </div>
                    <p className="text-[15px] font-normal text-[#1A1A1A] tabular-nums mt-0.5">{step.value}</p>
                    <p className="text-[11px] text-[#ACACAC] mt-0.5">{step.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <p className="text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.12em] mb-3">Transaction Details</p>
            <div className="bg-[#FAFAFA] rounded-xl border border-[#F0F0F0] p-5 space-y-3">
              <Row label="Gateway" value={txn.gateway.charAt(0).toUpperCase() + txn.gateway.slice(1)} />
              <Row label="Destination" value={txn.destination === "escrow" ? "Escrow (Held)" : "Platform Revenue"} />
              <Row label="Student" value={txn.studentName} />
              <Row label="Teacher" value={txn.teacherName} />
              <Row label="Take-Rate" value={`${((txn.platformCut / txn.totalAmount) * 100).toFixed(1)}%`} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-7 py-4 border-t border-[#F0F0F0] flex items-center justify-end gap-3 shrink-0">
          <button onClick={onClose} className="flex items-center gap-1.5 px-4 py-2.5 text-[12px] font-medium text-[#1A1A1A] bg-white border border-[#F0F0F0] rounded-lg hover:border-[#DCDCDC] transition-all cursor-pointer">
            <Export size={13} /> Export Ledger (CSV)
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="bg-[#FAFAFA] rounded-xl border border-[#F0F0F0] p-4">
      <p className="text-[11px] text-[#ACACAC] mb-1">{label}</p>
      <p className="text-[17px] font-normal tabular-nums tracking-tight" style={{ color: accent || "#1A1A1A" }}>{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (<div className="flex items-start justify-between gap-4"><span className="text-[12px] text-[#999] shrink-0">{label}</span><span className="text-[12px] text-[#1A1A1A] text-right">{value}</span></div>);
}

export default memo(RevenueEscrowDrawer);
