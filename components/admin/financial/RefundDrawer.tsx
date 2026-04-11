"use client";
import { useState, useEffect, memo } from "react";
import {
  X, ArrowsClockwise, Database, ChatText, Warning, ShieldCheck, Clock, VideoCamera,
} from "@phosphor-icons/react";
import { getRefundEvidence } from "./financialMockData";
import type { Refund, RefundEvidence, ApprovalStatus } from "./financialTypes";
import { REFUND_REASON_LABELS, APPROVAL_LABELS } from "./financialTypes";
import ConfirmModal from "@/components/admin/ConfirmModal";

const APPROVAL_STYLE: Record<ApprovalStatus, string> = {
  pending: "bg-[#F0F0F0] text-[#1A1A1A]",
  approved_1of2: "bg-[#FFF7ED] text-[#D4956A]",
  approved_2of2: "bg-[#FFF7ED] text-[#E08A3C]",
  rejected: "bg-[#FFF1E6] text-[#C2571A]",
  auto_approved: "bg-[#F5F5F5] text-[#999]",
};

interface Props { refund: Refund | null; onClose: () => void }

function RefundDrawer({ refund, onClose }: Props) {
  const [evidence, setEvidence] = useState<RefundEvidence | null>(null);
  const [localStatus, setLocalStatus] = useState<ApprovalStatus | null>(null);
  const [standardModal, setStandardModal] = useState(false);
  const [highValueModal, setHighValueModal] = useState(false);

  useEffect(() => {
    if (refund) {
      setEvidence(null);
      setLocalStatus(null);
      const t = setTimeout(() => setEvidence(getRefundEvidence(refund.id)), 400);
      return () => clearTimeout(t);
    }
  }, [refund]);

  useEffect(() => {
    if (!refund) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [refund, onClose]);

  if (!refund) return null;

  const isHighValue = refund.amount >= 500;
  const currentStatus = localStatus || refund.approvalStatus;
  const isPending2nd = currentStatus === "approved_1of2";
  const isTerminal = currentStatus === "approved_2of2" || currentStatus === "rejected" || currentStatus === "auto_approved";

  return (
    <>
      <div className="fixed inset-0 z-[100] bg-[#FAFAFA] flex flex-col font-matter animate-fadeIn">
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-4 bg-white border-b border-[#F0F0F0] shrink-0">
          <div className="flex items-center gap-4">
            <span className={`inline-flex px-2.5 py-[3px] rounded-full text-[10.5px] font-medium ${APPROVAL_STYLE[currentStatus]}`}>{APPROVAL_LABELS[currentStatus]}</span>
            <div>
              <h2 className="text-[15px] font-medium text-[#1A1A1A] font-season">{refund.refundId} — {REFUND_REASON_LABELS[refund.reason]}</h2>
              <p className="text-[11px] text-[#ACACAC]">{refund.studentName} · ${refund.amount.toLocaleString()} · {refund.requestedAt}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-[#F7F7F7] border border-[#F0F0F0] flex items-center justify-center text-[#ACACAC] hover:text-[#1A1A1A] hover:border-[#DCDCDC] cursor-pointer transition-all"><X size={14} weight="bold" /></button>
        </div>

        {/* Split columns */}
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT: Student Claim + Refund Details */}
          <div className="w-1/2 border-r border-[#F0F0F0] overflow-y-auto custom-scrollbar p-8 space-y-6">
            {/* Refund Details */}
            <div>
              <p className="text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.12em] mb-3">Refund Details</p>
              <div className="bg-white rounded-xl border border-[#F0F0F0] p-5 space-y-3">
                <Row label="Refund ID" value={refund.refundId} mono />
                <Row label="Original Transaction" value={refund.originalTxnId} mono />
                <Row label="Amount" value={`$${refund.amount.toLocaleString()}`} />
                <Row label="Reason" value={REFUND_REASON_LABELS[refund.reason]} />
                <Row label="Requested" value={refund.requestedAt} />
                {refund.approver1 && <Row label="1st Approver" value={refund.approver1} />}
                {isHighValue && (
                  <div className="flex items-center gap-2 pt-2 border-t border-[#F8F8F8]">
                    <Warning size={12} weight="fill" className="text-[#D4956A]" />
                    <span className="text-[11px] font-medium text-[#D4956A]">High-value refund — Two-person approval required</span>
                  </div>
                )}
              </div>
            </div>

            {/* Student Claim */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ChatText size={13} className="text-[#ACACAC]" />
                <span className="text-[11px] font-medium text-[#1A1A1A]">Student&apos;s Claim</span>
              </div>
              {evidence ? (
                <div className="bg-white rounded-xl border border-[#F0F0F0] p-5">
                  <p className="text-[13px] text-[#555] leading-relaxed">{evidence.studentClaim}</p>
                </div>
              ) : <Skeleton rows={4} />}
            </div>

            {/* Approval Timeline */}
            {(currentStatus === "approved_1of2" || currentStatus === "approved_2of2") && (
              <div>
                <p className="text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.12em] mb-3">Approval Chain</p>
                <div className="space-y-0">
                  <ApprovalStep
                    step={1}
                    label={refund.approver1 || "Admin"}
                    status="approved"
                    isLast={currentStatus !== "approved_2of2"}
                  />
                  {currentStatus === "approved_2of2" && (
                    <ApprovalStep step={2} label="Admin Karan" status="approved" isLast />
                  )}
                  {currentStatus === "approved_1of2" && (
                    <ApprovalStep step={2} label="Awaiting 2nd Approver" status="pending" isLast />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Osmium VideoMeet Evidence */}
          <div className="w-1/2 overflow-y-auto custom-scrollbar p-8 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <VideoCamera size={14} className="text-[#ACACAC]" />
                <p className="text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.12em]">Osmium VideoMeet Logs</p>
              </div>
              {evidence ? (
                <div className="space-y-4">
                  <div className="bg-white rounded-xl border border-[#F0F0F0] p-5 space-y-3">
                    <Row label="Join Times" value={evidence.osmiumJoinTime} />
                    <Row label="Leave Times" value={evidence.osmiumLeaveTime} />
                    <Row label="Connection Drops" value={String(evidence.connectionDrops)} />
                    <Row label="Session Duration" value={evidence.sessionDurationMin > 0 ? `${evidence.sessionDurationMin} min` : "0 min (no session)"} />
                    <div className="flex items-center justify-between pt-2 border-t border-[#F8F8F8]">
                      <span className="text-[12px] text-[#999]">Teaching Occurred</span>
                      <span className={`flex items-center gap-1.5 text-[12px] font-medium ${evidence.teachingOccurred ? "text-[#1A1A1A]" : "text-[#C2571A]"}`}>
                        <span className={`w-[6px] h-[6px] rounded-full ${evidence.teachingOccurred ? "bg-[#1A1A1A]" : "bg-[#C2571A]"}`} />
                        {evidence.teachingOccurred ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Database size={13} className="text-[#ACACAC]" />
                      <span className="text-[11px] font-medium text-[#1A1A1A]">Osmium Transcript Summary</span>
                    </div>
                    <div className="bg-[#F7F7F7] rounded-xl border border-[#F0F0F0] p-5">
                      <p className="text-[12px] text-[#555] leading-relaxed italic">{evidence.transcriptSummary}</p>
                    </div>
                  </div>

                  {/* System Recommendation */}
                  <div className="bg-[#FFF7ED] rounded-xl border border-[#E08A3C]/10 p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldCheck size={14} className="text-[#E08A3C]" />
                      <span className="text-[11px] font-medium text-[#E08A3C]">Osmium AI Recommendation</span>
                    </div>
                    <p className="text-[12px] text-[#E08A3C]/80 leading-relaxed">
                      Based on VideoMeet telemetry: No teaching session occurred. Teacher never joined the room. Student waited the full 15-minute timeout. System recommends full refund.
                    </p>
                  </div>
                </div>
              ) : <Skeleton rows={8} />}
            </div>
          </div>
        </div>

        {/* Bottom Decision Bar */}
        <div className="bg-white border-t border-[#F0F0F0] px-8 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#CACACA]">Refund:</span>
            <span className={`text-[11px] font-medium tabular-nums ${isHighValue ? "text-[#C2571A]" : "text-[#1A1A1A]"}`}>${refund.amount.toLocaleString()}</span>
            {isPending2nd && (
              <span className="flex items-center gap-1 text-[10px] font-medium text-[#D4956A] bg-[#FFF7ED] px-2 py-[2px] rounded-full ml-2">
                <Clock size={10} weight="fill" /> Pending 2nd Approval
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {!isHighValue && !isTerminal && (
              <button
                onClick={() => setStandardModal(true)}
                disabled={isPending2nd}
                className="flex items-center gap-1.5 px-4 py-2.5 text-[12px] font-medium text-white bg-[#E08A3C] rounded-lg hover:bg-[#059669] transition-all cursor-pointer border-none active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowsClockwise size={13} /> Process Standard Refund
              </button>
            )}
            {isHighValue && !isTerminal && (
              <button
                onClick={() => {
                  if (currentStatus === "pending") {
                    setHighValueModal(true);
                  }
                }}
                disabled={isPending2nd}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-[12px] font-medium rounded-lg transition-all border-none active:scale-95 ${
                  isPending2nd
                    ? "bg-[#FFF7ED] text-[#D4956A] cursor-not-allowed"
                    : "bg-[#C2571A] text-white hover:bg-[#BE123C] cursor-pointer"
                }`}
              >
                <Warning size={13} weight="fill" />
                {isPending2nd ? "Awaiting 2nd Approval" : "Process High-Value Refund"}
              </button>
            )}
            <button onClick={onClose} className="flex items-center gap-1.5 px-4 py-2.5 text-[12px] font-medium text-[#1A1A1A] bg-white border border-[#F0F0F0] rounded-lg hover:border-[#DCDCDC] transition-all cursor-pointer">
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Standard Refund Confirm */}
      <ConfirmModal
        isOpen={standardModal}
        onClose={() => setStandardModal(false)}
        title="Process Standard Refund"
        description={`This will refund $${refund.amount.toLocaleString()} to ${refund.studentName}. The funds will be returned via the original payment method within 5-7 business days.`}
        confirmString="CONFIRM"
        onConfirm={() => { setStandardModal(false); onClose(); }}
        variant="warning"
      />

      {/* High-Value Refund Confirm — triggers 2-person flow */}
      <ConfirmModal
        isOpen={highValueModal}
        onClose={() => setHighValueModal(false)}
        title="High-Value Refund — Initiate 2-Person Approval"
        description={`This refund of $${refund.amount.toLocaleString()} exceeds the $500 threshold. Your approval will be recorded as 1/2. A second admin must approve before funds are released.`}
        confirmString="CONFIRM"
        onConfirm={() => {
          setLocalStatus("approved_1of2");
          setHighValueModal(false);
        }}
        variant="danger"
      />
    </>
  );
}

function ApprovalStep({ step, label, status, isLast }: { step: number; label: string; status: "approved" | "pending"; isLast: boolean }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium shrink-0 ${
          status === "approved" ? "bg-[#E08A3C] text-white" : "bg-[#FFF7ED] text-[#D4956A]"
        }`}>{step}</div>
        {!isLast && <div className="w-[1.5px] h-8 bg-[#F0F0F0]" />}
      </div>
      <div className="pb-4">
        <p className="text-[12px] font-medium text-[#1A1A1A]">{label}</p>
        <p className="text-[10px] text-[#ACACAC]">{status === "approved" ? "Approved" : "Pending"}</p>
      </div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (<div className="flex items-start justify-between gap-4"><span className="text-[12px] text-[#999] shrink-0">{label}</span><span className={`text-[12px] text-[#1A1A1A] text-right ${mono ? "font-mono" : ""}`}>{value}</span></div>);
}

function Skeleton({ rows = 3 }: { rows?: number }) {
  return (<div className="space-y-3 animate-pulse">{[...Array(rows)].map((_, i) => <div key={i} className="h-4 bg-[#F5F5F5] rounded w-full" />)}</div>);
}

export default memo(RefundDrawer);
