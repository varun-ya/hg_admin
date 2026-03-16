"use client";
import { useState, useEffect, memo } from "react";
import { X, HandPalm, Lightning, Bank, ShieldCheck } from "@phosphor-icons/react";
import { getPayoutBookings } from "./financialMockData";
import type { Payout, PayoutBooking, PayoutStatus } from "./financialTypes";
import ConfirmModal from "@/components/admin/ConfirmModal";

const STATUS_STYLE: Record<PayoutStatus, string> = {
  ready: "bg-[#ECFDF5] text-[#10B981]",
  locked: "bg-[#EEF2FF] text-[#4F46E5]",
  processing: "bg-[#F0F0F0] text-[#1A1A1A]",
  failed: "bg-[#FEF2F2] text-[#E11D48]",
  completed: "bg-[#F5F5F5] text-[#999]",
};

interface Props { payout: Payout | null; onClose: () => void }

function PayoutDrawer({ payout, onClose }: Props) {
  const [bookings, setBookings] = useState<PayoutBooking[] | null>(null);
  const [holdModal, setHoldModal] = useState(false);
  const [manualModal, setManualModal] = useState(false);

  useEffect(() => {
    if (payout) { setBookings(null); const t = setTimeout(() => setBookings(getPayoutBookings(payout.id)), 350); return () => clearTimeout(t); }
  }, [payout]);

  useEffect(() => {
    if (!payout) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [payout, onClose]);

  if (!payout) return null;

  return (
    <>
      <div className="fixed inset-0 z-[100] flex justify-end font-matter">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" onClick={onClose} />
        <div className="relative w-[540px] max-w-full bg-white h-full shadow-[-8px_0_30px_-10px_rgba(0,0,0,0.08)] flex flex-col animate-slideIn">
          {/* Header */}
          <div className="px-7 py-5 border-b border-[#F0F0F0] shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F7F7F7] flex items-center justify-center text-[13px] font-medium text-[#999]">{payout.teacherName.split(" ").map(n => n[0]).join("")}</div>
                <div>
                  <h2 className="text-[15px] font-medium text-[#1A1A1A] font-season">{payout.teacherName}</h2>
                  <p className="text-[11px] text-[#ACACAC] font-mono">{payout.aegisId}</p>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-lg bg-[#F7F7F7] border border-[#F0F0F0] flex items-center justify-center text-[#ACACAC] hover:text-[#1A1A1A] hover:border-[#DCDCDC] cursor-pointer transition-all"><X size={14} weight="bold" /></button>
            </div>
            <div className="flex items-center gap-3">
              <span className={`inline-flex px-2.5 py-[3px] rounded-full text-[10.5px] font-medium capitalize ${STATUS_STYLE[payout.status]}`}>{payout.status}</span>
              <span className="text-[11px] text-[#CACACA]">{payout.classCount} classes · {payout.expectedDate}</span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-7 space-y-7">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#FAFAFA] rounded-xl border border-[#F0F0F0] p-4">
                <p className="text-[11px] text-[#ACACAC] mb-1">Payout Amount</p>
                <p className="text-[17px] font-normal text-[#10B981] tabular-nums tracking-tight">${payout.clearedAmount.toLocaleString()}</p>
              </div>
              <div className="bg-[#FAFAFA] rounded-xl border border-[#F0F0F0] p-4">
                <p className="text-[11px] text-[#ACACAC] mb-1">Classes</p>
                <p className="text-[17px] font-normal text-[#1A1A1A] tabular-nums tracking-tight">{payout.classCount}</p>
              </div>
              <div className="bg-[#FAFAFA] rounded-xl border border-[#F0F0F0] p-4">
                <p className="text-[11px] text-[#ACACAC] mb-1">Bank</p>
                <p className="text-[13px] font-normal text-[#1A1A1A] mt-0.5">{payout.bankName}</p>
              </div>
            </div>

            {/* Bank Details */}
            <div>
              <p className="text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.12em] mb-3">Settlement Route</p>
              <div className="bg-[#FAFAFA] rounded-xl border border-[#F0F0F0] p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <Bank size={16} className="text-[#ACACAC]" />
                  <div>
                    <p className="text-[13px] text-[#1A1A1A]">{payout.bankName}</p>
                    <p className="text-[11px] text-[#ACACAC] font-mono">{payout.bankAccount}</p>
                  </div>
                </div>
                <Row label="Expected Settlement" value={payout.expectedDate} />
              </div>
            </div>

            {/* Covered Bookings */}
            <div>
              <p className="text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.12em] mb-3">Covered Bookings</p>
              {bookings ? (
                <div className="space-y-2">
                  {bookings.map((b) => (
                    <div key={b.classId} className="bg-white rounded-xl border border-[#F0F0F0] p-4 flex items-center justify-between">
                      <div>
                        <p className="text-[13px] text-[#1A1A1A]">{b.subject}</p>
                        <p className="text-[11px] text-[#ACACAC]">{b.studentName} · {b.date}</p>
                      </div>
                      <span className="text-[13px] font-normal text-[#1A1A1A] tabular-nums">${b.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              ) : <Skeleton rows={4} />}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-7 py-4 border-t border-[#F0F0F0] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-[#ACACAC]" />
              <span className="text-[11px] text-[#ACACAC]">Aegis MFA required for manual payouts</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setHoldModal(true)}
                disabled={payout.status === "locked" || payout.status === "completed"}
                className="flex items-center gap-1.5 px-4 py-2.5 text-[12px] font-medium text-[#E11D48] bg-transparent border border-[#F0F0F0] rounded-lg hover:bg-[#FEF2F2] hover:border-[#E11D48]/20 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <HandPalm size={13} /> Hold Funds
              </button>
              <button
                onClick={() => setManualModal(true)}
                disabled={payout.status !== "ready"}
                className="flex items-center gap-1.5 px-5 py-2.5 text-[12px] font-medium text-white bg-[#293763] rounded-lg hover:bg-[#1E2A4A] transition-all cursor-pointer border-none active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Lightning size={13} weight="bold" /> Manual Payout
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={holdModal}
        onClose={() => setHoldModal(false)}
        title="Hold Funds — Trust & Safety Review"
        description={`This will freeze the $${payout.clearedAmount.toLocaleString()} payout to ${payout.teacherName} pending Trust & Safety review. The teacher will be notified.`}
        confirmString="CONFIRM"
        onConfirm={() => setHoldModal(false)}
        variant="danger"
      />
      <ConfirmModal
        isOpen={manualModal}
        onClose={() => setManualModal(false)}
        title="Initiate Manual Payout"
        description={`This will immediately dispatch $${payout.clearedAmount.toLocaleString()} to ${payout.teacherName} (${payout.bankAccount}), bypassing the batch schedule. Aegis MFA verification required.`}
        confirmString="CONFIRM"
        onConfirm={() => setManualModal(false)}
        variant="warning"
      />
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (<div className="flex items-start justify-between gap-4"><span className="text-[12px] text-[#999] shrink-0">{label}</span><span className="text-[12px] text-[#1A1A1A] text-right">{value}</span></div>);
}

function Skeleton({ rows = 3 }: { rows?: number }) {
  return (<div className="space-y-3 animate-pulse">{[...Array(rows)].map((_, i) => <div key={i} className="h-16 bg-[#F5F5F5] rounded-xl w-full" />)}</div>);
}

export default memo(PayoutDrawer);
