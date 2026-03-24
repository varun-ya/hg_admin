"use client";
import { useState, useEffect, memo } from "react";
import {
  X,
  Play,
  CheckCircle,
  XCircle,
  Eye,
  EyeSlash,
  ShieldCheck,
  ShieldWarning,
  Brain,
  SealCheck,
  ArrowCounterClockwise,
  Prohibit,
  MagnifyingGlassPlus,
  MagnifyingGlassMinus,
  FileText,
} from "@phosphor-icons/react";
import { getKycProfile } from "./kycMockData";
import type { KycApplicant, KycProfile } from "./kycTypes";
import ConfirmModal from "@/components/admin/ConfirmModal";

interface Props {
  applicant: KycApplicant | null;
  onClose: () => void;
}

function Skeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {[...Array(rows)].map((_, i) => <div key={i} className="h-4 bg-[#F5F5F5] rounded w-full" />)}
    </div>
  );
}

function KycWorkspace({ applicant, onClose }: Props) {
  const [profile, setProfile] = useState<KycProfile | null>(null);
  const [docRevealed, setDocRevealed] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rejectModal, setRejectModal] = useState(false);
  const [resubReason, setResubReason] = useState<string | null>(null);

  useEffect(() => {
    if (applicant) {
      setProfile(null);
      setDocRevealed(false);
      setZoom(1);
      const t = setTimeout(() => setProfile(getKycProfile(applicant.id)), 500);
      return () => clearTimeout(t);
    }
  }, [applicant]);

  useEffect(() => {
    if (!applicant) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [applicant, onClose]);

  if (!applicant) return null;

  const doc = profile?.document;

  return (
    <>
      <div className="fixed inset-0 z-[100] bg-white flex flex-col font-matter animate-fadeIn">
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-4 bg-white border-b border-[#F0F0F0] shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-[#F0F0F0] shrink-0">
              <img src={applicant.avatar} alt={applicant.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-[15px] font-medium text-[#1A1A1A] font-season">{applicant.name}</h2>
              <p className="text-[11px] text-[#ACACAC]">{applicant.subject} · {applicant.aegisId} · {applicant.timeInQueue} in queue</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-[#F7F7F7] border border-[#F0F0F0] flex items-center justify-center text-[#ACACAC] hover:text-[#1A1A1A] hover:border-[#DCDCDC] cursor-pointer transition-all">
            <X size={14} weight="bold" />
          </button>
        </div>

        {/* Split panes */}
        <div className="flex-1 flex overflow-hidden">
          {/* ── LEFT PANE: Teacher's Pitch ── */}
          <div className="flex-1 min-w-0 border-r border-[#F0F0F0] overflow-y-auto custom-scrollbar p-8 space-y-6">
            {/* Video */}
            <div>
              <p className="text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.12em] mb-3">Intro Video</p>
              <div className="aspect-video bg-[#1A1A1A] rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors">
                  <Play size={24} weight="fill" className="text-white ml-1" />
                </div>
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <span className="text-[10px] text-white/60 bg-black/30 px-2 py-0.5 rounded">0:00 / 2:34</span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <p className="text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.12em] mb-3">Bio & Experience</p>
              {profile ? (
                <p className="text-[13px] text-[#555] leading-relaxed">{profile.bio}</p>
              ) : <Skeleton rows={4} />}
            </div>

            {/* Osmium Analysis */}
            <div>
              <p className="text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.12em] mb-3">Osmium AI Analysis</p>
              {profile ? (
                <div className="bg-white rounded-xl border border-[#F0F0F0] p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#999]">Language Proficiency</span>
                    <span className="flex items-center gap-1.5 text-[12px] font-medium text-[#1A1A1A]">
                      <Brain size={12} className="text-[#ACACAC]" /> {profile.osmiumAnalysis.proficiencyLevel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#999]">Spoken ↔ Claimed Match</span>
                    <MatchBadge match={profile.osmiumAnalysis.languageMatch} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#999]">Flagged Phrases</span>
                    {profile.osmiumAnalysis.flaggedPhrases.length === 0 ? (
                      <span className="text-[11px] text-[#DCDCDC]">None</span>
                    ) : (
                      <span className="text-[11px] text-[#E08A3C]">{profile.osmiumAnalysis.flaggedPhrases.length} found</span>
                    )}
                  </div>
                </div>
              ) : <Skeleton rows={3} />}
            </div>
          </div>

          {/* ── RIGHT PANE: Document Vault ── */}
          <div className="flex-1 min-w-0 overflow-y-auto custom-scrollbar p-8 space-y-6">
            {/* Document Viewer */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.12em]">Document Viewer</p>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setZoom(Math.max(0.5, zoom - 0.25))} className="w-7 h-7 rounded-lg bg-white border border-[#F0F0F0] flex items-center justify-center text-[#ACACAC] hover:text-[#1A1A1A] cursor-pointer transition-colors"><MagnifyingGlassMinus size={13} /></button>
                  <span className="text-[10px] text-[#CACACA] tabular-nums w-10 text-center">{Math.round(zoom * 100)}%</span>
                  <button onClick={() => setZoom(Math.min(2, zoom + 0.25))} className="w-7 h-7 rounded-lg bg-white border border-[#F0F0F0] flex items-center justify-center text-[#ACACAC] hover:text-[#1A1A1A] cursor-pointer transition-colors"><MagnifyingGlassPlus size={13} /></button>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-[#F0F0F0] aspect-[4/3] flex items-center justify-center overflow-hidden">
                <div style={{ transform: `scale(${zoom})`, transition: "transform 0.2s ease" }} className="flex flex-col items-center gap-3 text-center">
                  <FileText size={40} weight="thin" className="text-[#DCDCDC]" />
                  <p className="text-[12px] text-[#CACACA]">{doc?.docType || "Loading…"}</p>
                  <p className="text-[10px] text-[#DCDCDC]">Document preview area</p>
                </div>
              </div>
            </div>

            {/* LMlens Extraction Overlay */}
            <div>
              <p className="text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.12em] mb-3">LMlens Data Extraction</p>
              {profile && doc ? (
                <div className="bg-white rounded-xl border border-[#F0F0F0] divide-y divide-[#F5F5F5] overflow-hidden">
                  <ExtractionRow label="Name" claimed={doc.claimedName} extracted={doc.extractedName} match={doc.nameMatch} />
                  <ExtractionRow label="Date of Birth" claimed={doc.claimedDob} extracted={doc.extractedDob} match={doc.dobMatch} />
                  <ExtractionRow label="Document Expiry" claimed="—" extracted={doc.docExpiry} match={doc.docExpiryValid} />
                  {/* PII masked field */}
                  <div className="px-5 py-3.5 flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-[10px] text-[#CACACA] mb-1">Document Number</p>
                      <p className="text-[13px] font-mono text-[#1A1A1A] tabular-nums">{docRevealed ? "5678-9012-4821" : doc.docNumber}</p>
                    </div>
                    <button onClick={() => setDocRevealed(!docRevealed)} className="flex items-center gap-1 text-[10px] font-medium text-[#ACACAC] hover:text-[#1A1A1A] bg-[#F7F7F7] px-2 py-1 rounded-md border-none cursor-pointer transition-colors">
                      {docRevealed ? <EyeSlash size={11} /> : <Eye size={11} />}
                      {docRevealed ? "Mask" : "Reveal"}
                    </button>
                  </div>
                </div>
              ) : <Skeleton rows={4} />}
            </div>

            {/* Aegis Security Context */}
            <div>
              <p className="text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.12em] mb-3">Aegis Security Context</p>
              {profile && doc ? (
                <div className="bg-white rounded-xl border border-[#F0F0F0] p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#999]">IP Country</span>
                    <span className="text-[12px] text-[#1A1A1A]">{doc.ipCountry}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#999]">Document Country</span>
                    <span className="text-[12px] text-[#1A1A1A]">{doc.docCountry}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#999]">IP ↔ Document Match</span>
                    {doc.ipMatch ? (
                      <span className="flex items-center gap-1.5 text-[12px] text-[#1A1A1A]"><ShieldCheck size={13} weight="fill" /> Match</span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-[12px] text-[#E08A3C]"><ShieldWarning size={13} weight="fill" /> Mismatch</span>
                    )}
                  </div>
                </div>
              ) : <Skeleton rows={3} />}
            </div>
          </div>
        </div>

        {/* ── Bottom Decision Bar ── */}
        <div className="bg-white border-t border-[#F0F0F0] px-8 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#CACACA]">LMlens:</span>
            <span className={`text-[11px] font-medium ${applicant.lmlensConfidence >= 80 ? "text-[#1A1A1A]" : "text-[#E08A3C]"}`}>{applicant.lmlensConfidence}% confidence</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setRejectModal(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-[12px] font-medium text-[#E08A3C] bg-transparent border border-[#F0F0F0] rounded-lg hover:bg-[#FFF8F3] hover:border-[#E08A3C]/20 transition-all cursor-pointer"
            >
              <Prohibit size={13} /> Reject & Ban
            </button>
            <button
              onClick={() => setResubReason("")}
              className="flex items-center gap-1.5 px-4 py-2.5 text-[12px] font-medium text-[#1A1A1A] bg-white border border-[#F0F0F0] rounded-lg hover:border-[#DCDCDC] transition-all cursor-pointer"
            >
              <ArrowCounterClockwise size={13} /> Request Re-submission
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-5 py-2.5 text-[12px] font-medium text-white bg-[#293763] rounded-lg hover:bg-[#1E2A4A] transition-all cursor-pointer border-none active:scale-95"
            >
              <SealCheck size={13} weight="fill" /> Approve & Issue Badge
            </button>
          </div>
        </div>
      </div>

      {/* Re-submission reason modal */}
      {resubReason !== null && (
        <ResubModal onClose={() => setResubReason(null)} onSubmit={() => { setResubReason(null); onClose(); }} />
      )}

      <ConfirmModal
        isOpen={rejectModal}
        onClose={() => setRejectModal(false)}
        title="Reject & Ban Applicant"
        description={`This will permanently reject ${applicant.name}'s application and log their Aegis device ID to prevent re-registration. This action cannot be undone.`}
        confirmString="CONFIRM-REJECT"
        onConfirm={() => { setRejectModal(false); onClose(); }}
        variant="danger"
      />
    </>
  );
}

/* ── Sub-components ── */

function ExtractionRow({ label, claimed, extracted, match }: { label: string; claimed: string; extracted: string; match: boolean }) {
  return (
    <div className="px-5 py-3.5">
      <p className="text-[10px] text-[#CACACA] mb-2">{label}</p>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <p className="text-[9px] text-[#DCDCDC] uppercase tracking-wider mb-0.5">Claimed</p>
          <p className="text-[13px] text-[#1A1A1A]">{claimed}</p>
        </div>
        <div className="flex-1">
          <p className="text-[9px] text-[#DCDCDC] uppercase tracking-wider mb-0.5">Extracted</p>
          <p className="text-[13px] text-[#1A1A1A]">{extracted}</p>
        </div>
        <MatchBadge match={match} />
      </div>
    </div>
  );
}

function MatchBadge({ match }: { match: boolean }) {
  return match ? (
    <span className="flex items-center gap-1 text-[10px] font-medium text-[#1A1A1A] bg-[#F0F0F0] px-2 py-[2px] rounded-full">
      <CheckCircle size={10} weight="fill" /> Match
    </span>
  ) : (
    <span className="flex items-center gap-1 text-[10px] font-medium text-[#E08A3C] bg-[#FFF8F3] px-2 py-[2px] rounded-full">
      <XCircle size={10} weight="fill" /> Mismatch
    </span>
  );
}

const RESUB_REASONS = ["ID is blurry or unreadable", "Intro video has background noise", "Name mismatch between ID and profile", "Document appears expired", "Intro video does not meet quality standards", "Other"];

function ResubModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] w-[440px] max-w-[95vw] overflow-hidden font-matter">
        <div className="px-7 py-6">
          <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">Request Re-submission</h3>
          <p className="text-[12px] text-[#999] mt-1.5">Select a reason. The applicant will receive an automated notification.</p>
        </div>
        <div className="px-7 pb-4 space-y-1.5">
          {RESUB_REASONS.map((r) => (
            <button
              key={r}
              onClick={() => setSelected(r)}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-[12px] border-none cursor-pointer transition-colors ${
                selected === r ? "bg-[#EEF0F7] text-[#293763] font-medium" : "bg-transparent text-[#666] hover:bg-[#FAFAFA]"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="px-7 pb-6 pt-3 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-[13px] font-medium text-[#777] bg-white border border-[#EBEBEB] rounded-lg hover:bg-[#FAFAFA] transition-colors cursor-pointer">Cancel</button>
          <button onClick={onSubmit} disabled={!selected} className={`px-4 py-2 text-[13px] font-medium rounded-lg transition-all cursor-pointer border-none ${selected ? "bg-[#1A1A1A] text-white hover:bg-[#333]" : "bg-[#F0F0F0] text-[#CACACA] cursor-not-allowed"}`}>
            Send & Move to Waiting
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(KycWorkspace);
