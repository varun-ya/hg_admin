"use client";
import { useState, useEffect, memo } from "react";
import {
  X, CheckCircle, Trash, Prohibit, FileText, Brain, Scales, CaretRight,
} from "@phosphor-icons/react";
import { getFlagProfile } from "./moderationMockData";
import type { FlaggedItem, FlagProfile, FlagSeverity } from "./moderationTypes";
import ConfirmModal from "@/components/admin/ConfirmModal";

const SEV_STYLE: Record<FlagSeverity, string> = { critical: "bg-[#FFF1E6] text-[#C2571A]", medium: "bg-[#FFF8F3] text-[#E08A3C]", low: "bg-[#F0F0F0] text-[#777]" };

interface Props { item: FlaggedItem | null; onClose: () => void }

function ModerationDrawer({ item, onClose }: Props) {
  const [profile, setProfile] = useState<FlagProfile | null>(null);
  const [suspendModal, setSuspendModal] = useState(false);

  useEffect(() => {
    if (item) { setProfile(null); const t = setTimeout(() => setProfile(getFlagProfile(item.id)), 400); return () => clearTimeout(t); }
  }, [item]);

  useEffect(() => {
    if (!item) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [item, onClose]);

  if (!item) return null;

  return (
    <>
      <div className="fixed inset-0 z-[100] bg-[#FAFAFA] flex flex-col font-matter animate-fadeIn">
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-4 bg-white border-b border-[#F0F0F0] shrink-0">
          <div className="flex items-center gap-4">
            <span className={`inline-flex px-2.5 py-[3px] rounded-full text-[10.5px] font-medium capitalize ${SEV_STYLE[item.severity]}`}>{item.severity}</span>
            <div>
              <h2 className="text-[15px] font-medium text-[#1A1A1A] font-season">{item.flagId} — {item.reason}</h2>
              <p className="text-[11px] text-[#ACACAC]">{item.userName} ({item.userRole}) · {item.flaggedAt}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-[#F7F7F7] border border-[#F0F0F0] flex items-center justify-center text-[#ACACAC] hover:text-[#1A1A1A] hover:border-[#DCDCDC] cursor-pointer transition-all"><X size={14} weight="bold" /></button>
        </div>

        {/* Split panes */}
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT: The Asset */}
          <div className="w-1/2 border-r border-[#F0F0F0] overflow-y-auto custom-scrollbar p-8 space-y-6">
            <div>
              <p className="text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.12em] mb-3">Flagged Asset Preview</p>
              {profile ? (
                <>
                  <div className="bg-white rounded-xl border border-[#F0F0F0] p-5 mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText size={14} className="text-[#ACACAC]" />
                      <span className="text-[12px] text-[#999] uppercase">{item.assetType}</span>
                    </div>
                    <p className="text-[13px] text-[#555] leading-relaxed">{profile.assetPreview}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.12em] mb-3">Highlighted Content</p>
                    <div className="bg-[#FFF8F3] border border-[#E08A3C]/10 rounded-xl px-5 py-4">
                      <p className="text-[13px] text-[#1A1A1A] leading-relaxed italic">{profile.highlightedText}</p>
                    </div>
                  </div>
                </>
              ) : <Skeleton rows={6} />}
            </div>
          </div>

          {/* RIGHT: The Context */}
          <div className="w-1/2 overflow-y-auto custom-scrollbar p-8 space-y-6">
            <div>
              <p className="text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.12em] mb-3">LMlens Analysis</p>
              {profile ? (
                <div className="bg-white rounded-xl border border-[#F0F0F0] p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#999]">Confidence Score</span>
                    <span className="flex items-center gap-1.5 text-[13px] font-normal text-[#1A1A1A] tabular-nums"><Brain size={13} className="text-[#ACACAC]" /> {profile.lmlensConfidence}%</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#CACACA] mb-1.5">Detection Reason</p>
                    <p className="text-[12px] text-[#555] leading-relaxed">{profile.lmlensReason}</p>
                  </div>
                </div>
              ) : <Skeleton rows={3} />}
            </div>

            <div>
              <p className="text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.12em] mb-3">Platform Rule Violated</p>
              {profile ? (
                <div className="bg-white rounded-xl border border-[#F0F0F0] p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Scales size={14} className="text-[#ACACAC]" />
                    <span className="text-[12px] font-medium text-[#1A1A1A]">{profile.platformRule}</span>
                  </div>
                  <p className="text-[12px] text-[#777] leading-relaxed">{profile.ruleSection}</p>
                </div>
              ) : <Skeleton rows={3} />}
            </div>

            <div>
              <p className="text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.12em] mb-3">Session Context</p>
              {profile ? (
                <p className="text-[12px] text-[#777] leading-relaxed">{profile.context}</p>
              ) : <Skeleton rows={2} />}
            </div>
          </div>
        </div>

        {/* Bottom Decision Bar */}
        <div className="bg-white border-t border-[#F0F0F0] px-8 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#CACACA]">LMlens:</span>
            <span className={`text-[11px] font-medium ${item.lmlensConfidence >= 90 ? "text-[#1A1A1A]" : "text-[#E08A3C]"}`}>{item.lmlensConfidence}% confidence</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setSuspendModal(true)} className="flex items-center gap-1.5 px-4 py-2.5 text-[12px] font-medium text-[#E08A3C] bg-transparent border border-[#F0F0F0] rounded-lg hover:bg-[#FFF8F3] hover:border-[#E08A3C]/20 transition-all cursor-pointer"><Prohibit size={13} /> Suspend Account</button>
            <button onClick={onClose} className="flex items-center gap-1.5 px-4 py-2.5 text-[12px] font-medium text-[#1A1A1A] bg-white border border-[#F0F0F0] rounded-lg hover:border-[#DCDCDC] transition-all cursor-pointer"><Trash size={13} /> Delete & Warn</button>
            <button onClick={onClose} className="flex items-center gap-1.5 px-5 py-2.5 text-[12px] font-medium text-white bg-[#293763] rounded-lg hover:bg-[#1E2A4A] transition-all cursor-pointer border-none active:scale-95"><CheckCircle size={13} weight="fill" /> Approve (False Alarm)</button>
          </div>
        </div>
      </div>

      <ConfirmModal isOpen={suspendModal} onClose={() => setSuspendModal(false)} title="Suspend User Account" description={`This will immediately suspend ${item.userName}'s account, revoke all active sessions, and log the action. The user will be notified via email.`} confirmString="SUSPEND-ACCOUNT" onConfirm={() => { setSuspendModal(false); onClose(); }} variant="danger" />
    </>
  );
}

function Skeleton({ rows = 3 }: { rows?: number }) {
  return (<div className="space-y-3 animate-pulse">{[...Array(rows)].map((_, i) => <div key={i} className="h-4 bg-[#F5F5F5] rounded w-full" />)}</div>);
}

export default memo(ModerationDrawer);
