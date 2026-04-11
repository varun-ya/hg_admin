"use client";
import { useState, useEffect, memo } from "react";
import {
  X, ArrowRight, ArrowsClockwise, Scales, ChatText, Database, CaretRight, Warning,
} from "@phosphor-icons/react";
import { getDisputeProfile } from "./disputeMockData";
import type { Dispute, DisputeProfile, DisputeStatus } from "./disputeTypes";
import ConfirmModal from "@/components/admin/ConfirmModal";

const STATUS_STYLE: Record<DisputeStatus, string> = { open: "bg-[#F0F0F0] text-[#1A1A1A]", resolved: "bg-[#F5F5F5] text-[#999]", escalated: "bg-[#FFF1E6] text-[#C2571A]" };

interface Props { dispute: Dispute | null; onClose: () => void }

function DisputeDrawer({ dispute, onClose }: Props) {
  const [profile, setProfile] = useState<DisputeProfile | null>(null);
  const [refundModal, setRefundModal] = useState(false);

  useEffect(() => {
    if (dispute) { setProfile(null); const t = setTimeout(() => setProfile(getDisputeProfile(dispute.id)), 400); return () => clearTimeout(t); }
  }, [dispute]);

  useEffect(() => {
    if (!dispute) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [dispute, onClose]);

  if (!dispute) return null;

  const isHighValue = dispute.amount >= 3000;

  return (
    <>
      <div className="fixed inset-0 z-[100] bg-[#FAFAFA] flex flex-col font-matter animate-fadeIn">
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-4 bg-white border-b border-[#F0F0F0] shrink-0">
          <div className="flex items-center gap-4">
            <span className={`inline-flex px-2.5 py-[3px] rounded-full text-[10.5px] font-medium capitalize ${STATUS_STYLE[dispute.status]}`}>{dispute.status}</span>
            <div>
              <h2 className="text-[15px] font-medium text-[#1A1A1A] font-season">{dispute.disputeId} — {dispute.reason}</h2>
              <p className="text-[11px] text-[#ACACAC]">{dispute.raisedByName} vs {dispute.otherParty} · ${dispute.amount.toLocaleString()} · {dispute.ticketAge}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-[#F7F7F7] border border-[#F0F0F0] flex items-center justify-center text-[#ACACAC] hover:text-[#1A1A1A] hover:border-[#DCDCDC] cursor-pointer transition-all"><X size={14} weight="bold" /></button>
        </div>

        {/* Split columns */}
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT: User Claims */}
          <div className="w-1/2 border-r border-[#F0F0F0] overflow-y-auto custom-scrollbar p-8 space-y-6">
            <div>
              <p className="text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.12em] mb-3">User Claims</p>
              {profile ? (
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <ChatText size={13} className="text-[#ACACAC]" />
                      <span className="text-[11px] font-medium text-[#1A1A1A]">{dispute.raisedBy === "student" ? "Student's Claim" : "Teacher's Claim"}</span>
                    </div>
                    <div className="bg-white rounded-xl border border-[#F0F0F0] p-5">
                      <p className="text-[13px] text-[#555] leading-relaxed">{profile.studentClaim}</p>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <ChatText size={13} className="text-[#ACACAC]" />
                      <span className="text-[11px] font-medium text-[#1A1A1A]">{dispute.raisedBy === "student" ? "Teacher's Rebuttal" : "Student's Rebuttal"}</span>
                    </div>
                    <div className="bg-white rounded-xl border border-[#F0F0F0] p-5">
                      <p className="text-[13px] text-[#555] leading-relaxed">{profile.teacherRebuttal}</p>
                    </div>
                  </div>
                </div>
              ) : <Skeleton rows={8} />}
            </div>
          </div>

          {/* RIGHT: System Truth */}
          <div className="w-1/2 overflow-y-auto custom-scrollbar p-8 space-y-6">
            <div>
              <p className="text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.12em] mb-3">System Truth (Osmium Logs)</p>
              {profile ? (
                <div className="space-y-4">
                  <div className="bg-white rounded-xl border border-[#F0F0F0] p-5 space-y-3">
                    <Row label="Join Times" value={profile.osmiumJoinTime} />
                    <Row label="Leave Times" value={profile.osmiumLeaveTime} />
                    <Row label="Connection Drops" value={String(profile.connectionDrops)} />
                    <Row label="Session Duration" value={profile.sessionDurationMin > 0 ? `${profile.sessionDurationMin} min` : "0 min (no session)"} />
                    <div className="flex items-center justify-between pt-2 border-t border-[#F8F8F8]">
                      <span className="text-[12px] text-[#999]">Teaching Occurred</span>
                      <span className={`flex items-center gap-1.5 text-[12px] font-medium ${profile.teachingOccurred ? "text-[#1A1A1A]" : "text-[#C2571A]"}`}>
                        <span className={`w-[6px] h-[6px] rounded-full ${profile.teachingOccurred ? "bg-[#1A1A1A]" : "bg-[#C2571A]"}`} />
                        {profile.teachingOccurred ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Database size={13} className="text-[#ACACAC]" />
                      <span className="text-[11px] font-medium text-[#1A1A1A]">Osmium Transcript Summary</span>
                    </div>
                    <div className="bg-[#F7F7F7] rounded-xl border border-[#F0F0F0] p-5">
                      <p className="text-[12px] text-[#555] leading-relaxed italic">{profile.transcriptSummary}</p>
                    </div>
                  </div>
                </div>
              ) : <Skeleton rows={6} />}
            </div>
          </div>
        </div>

        {/* Bottom Decision Bar */}
        <div className="bg-white border-t border-[#F0F0F0] px-8 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#CACACA]">Disputed:</span>
            <span className="text-[11px] font-medium text-[#1A1A1A] tabular-nums">${dispute.amount.toLocaleString()}</span>
            {isHighValue && (
              <span className="flex items-center gap-1 text-[10px] font-medium text-[#E08A3C] bg-[#FFF8F3] px-2 py-[2px] rounded-full ml-2">
                <Warning size={10} weight="fill" /> Two-person approval required
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setRefundModal(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-[12px] font-medium text-[#E08A3C] bg-transparent border border-[#F0F0F0] rounded-lg hover:bg-[#FFF8F3] hover:border-[#E08A3C]/20 transition-all cursor-pointer"
            >
              <ArrowsClockwise size={13} /> Full Refund
            </button>
            <button onClick={onClose} className="flex items-center gap-1.5 px-4 py-2.5 text-[12px] font-medium text-[#1A1A1A] bg-white border border-[#F0F0F0] rounded-lg hover:border-[#DCDCDC] transition-all cursor-pointer">
              <Scales size={13} /> Partial Credit
            </button>
            <button onClick={onClose} className="flex items-center gap-1.5 px-5 py-2.5 text-[12px] font-medium text-white bg-[#293763] rounded-lg hover:bg-[#1E2A4A] transition-all cursor-pointer border-none active:scale-95">
              <ArrowRight size={13} weight="bold" /> Release to Teacher
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={refundModal}
        onClose={() => setRefundModal(false)}
        title={isHighValue ? "Full Refund — Two-Person Approval" : "Full Refund"}
        description={isHighValue
          ? `This refund of $${dispute.amount.toLocaleString()} exceeds the threshold. A notification will be sent to a second admin for approval before funds are released.`
          : `This will refund $${dispute.amount.toLocaleString()} to ${dispute.raisedByName} and close the dispute.`}
        confirmString={isHighValue ? "APPROVE-HIGH-VALUE-REFUND" : "CONFIRM-REFUND"}
        onConfirm={() => { setRefundModal(false); onClose(); }}
        variant={isHighValue ? "danger" : "warning"}
      />
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (<div className="flex items-start justify-between gap-4"><span className="text-[12px] text-[#999] shrink-0">{label}</span><span className="text-[12px] text-[#1A1A1A] text-right">{value}</span></div>);
}

function Skeleton({ rows = 3 }: { rows?: number }) {
  return (<div className="space-y-3 animate-pulse">{[...Array(rows)].map((_, i) => <div key={i} className="h-4 bg-[#F5F5F5] rounded w-full" />)}</div>);
}

export default memo(DisputeDrawer);
