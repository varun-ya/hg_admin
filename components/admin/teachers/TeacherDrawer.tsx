"use client";
import { useState, useEffect, memo } from "react";
import {
  X,
  Copy,
  ShieldCheck,
  Wallet,
  Chalkboard,
  Brain,
  Folder,
  Rocket,
  Percent,
  CalendarX,
  Prohibit,
  Globe,
  DeviceMobile,
  Lock,
  LockOpen,
  CaretRight,
  SealCheck,
  Star,
  Clock,
  CalendarBlank,
  CheckCircle,
  Warning,
  HourglassMedium,
  Play,
} from "@phosphor-icons/react";
import { getTeacherProfile } from "./teacherMockData";
import type { Teacher, TeacherProfile, TeacherStatus } from "./teacherTypes";

const STATUS_STYLE: Record<TeacherStatus, string> = {
  verified: "bg-[#F0F0F0] text-[#1A1A1A]",
  unverified: "bg-[#F5F5F5] text-[#999]",
  suspended: "bg-[#F5F5F5] text-[#E08A3C]",
  under_review: "bg-[#F5F5F5] text-[#ACACAC]",
};

const PAYOUT_DOT: Record<string, string> = {
  settled: "bg-[#1A1A1A]",
  pending: "bg-[#DCDCDC]",
  chargeback: "bg-[#E08A3C]",
};

const BG_CHECK_ICON: Record<string, React.ReactNode> = {
  passed: <CheckCircle size={12} weight="fill" className="text-[#1A1A1A]" />,
  pending: <HourglassMedium size={12} className="text-[#ACACAC]" />,
  failed: <Warning size={12} weight="fill" className="text-[#E08A3C]" />,
};

interface Props {
  teacher: Teacher | null;
  onClose: () => void;
}

function Skeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3.5 animate-pulse">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex items-center justify-between">
          <div className="h-3 bg-[#F5F5F5] rounded w-24" />
          <div className="h-3 bg-[#F5F5F5] rounded w-16" />
        </div>
      ))}
    </div>
  );
}

function TeacherDrawer({ teacher, onClose }: Props) {
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    if (teacher) {
      setProfile(null);
      const t = setTimeout(() => setProfile(getTeacherProfile(teacher.id)), 400);
      return () => clearTimeout(t);
    }
  }, [teacher]);

  useEffect(() => {
    if (!teacher) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [teacher, onClose]);

  if (!teacher) return null;

  const copyId = () => {
    navigator.clipboard.writeText(teacher.aegisId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 1500);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/15 backdrop-blur-[2px] z-40 animate-fadeIn" onClick={onClose} />

      <div className="fixed right-0 top-0 h-full w-[500px] max-w-[95vw] bg-white z-50 shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.08)] flex flex-col font-matter animate-slideIn">

        {/* ── Hero Header ── */}
        <div className="px-8 pt-7 pb-6 border-b border-[#F5F5F5] shrink-0 bg-[#FAFAFA]/50">
          <div className="flex items-center justify-between mb-6">
            <span className="text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.12em]">Teacher Profile</span>
            <button onClick={onClose} className="w-7 h-7 rounded-lg bg-white border border-[#F0F0F0] flex items-center justify-center text-[#CACACA] hover:text-[#999] hover:border-[#DCDCDC] cursor-pointer transition-all">
              <X size={13} weight="bold" />
            </button>
          </div>

          <div className="flex items-center gap-4 mb-5">
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border border-[#F0F0F0] ring-3 ring-white shadow-sm">
                <img src={teacher.avatar} alt={teacher.name} className="w-full h-full object-cover" />
              </div>
              {teacher.isVerified && (
                <SealCheck size={18} weight="fill" className="absolute -bottom-1 -right-1 text-[#293763] bg-white rounded-full" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-[18px] font-medium text-[#1A1A1A] font-season leading-tight truncate">{teacher.name}</h2>
              <p className="text-[12px] text-[#ACACAC] mt-1 truncate">{teacher.subject} · {teacher.region}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex px-2.5 py-[3px] rounded-full text-[10.5px] font-medium ${STATUS_STYLE[teacher.status]}`}>
              {teacher.status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </span>
            {teacher.avgRating > 0 && (
              <span className="flex items-center gap-1 px-2.5 py-[3px] rounded-full text-[10.5px] font-medium bg-[#F7F7F7] text-[#999]">
                <Star size={10} weight="fill" className="text-[#1A1A1A]" /> {teacher.avgRating.toFixed(2)}
              </span>
            )}
            <button onClick={copyId} className="flex items-center gap-1 text-[10.5px] font-mono text-[#ACACAC] hover:text-[#1A1A1A] bg-[#F7F7F7] px-2.5 py-[3px] rounded-full border-none cursor-pointer transition-colors">
              {copiedId ? "Copied!" : teacher.aegisId} <Copy size={9} />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2.5 mt-5">
            <QuickStat icon={<Clock size={11} className="text-[#CACACA]" />} label="Hours" value={teacher.totalHours.toLocaleString()} />
            <QuickStat icon={<Wallet size={11} className="text-[#CACACA]" />} label="Earned" value={`$${(teacher.lifetimeEarnings / 1000).toFixed(0)}K`} />
            <QuickStat icon={<Percent size={11} className="text-[#CACACA]" />} label="Comm." value={`${teacher.commissionTier}%`} />
            <QuickStat icon={<CalendarBlank size={11} className="text-[#CACACA]" />} label="Joined" value={new Date(teacher.dateJoined).toLocaleDateString("en-US", { month: "short", year: "2-digit" })} />
          </div>
        </div>

        {/* ── Scrollable Sections ── */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">

          {/* Identity & KYC */}
          <Section icon={<ShieldCheck size={14} />} title="Identity & KYC">
            {profile ? (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#999]">Background Check</span>
                  <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#1A1A1A]">
                    {BG_CHECK_ICON[profile.bgCheckStatus]}
                    {profile.bgCheckStatus.charAt(0).toUpperCase() + profile.bgCheckStatus.slice(1)}
                  </span>
                </div>
                <Row label="ID Documents" value={profile.idDocType} />
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#999]">Intro Video</span>
                  <button className="flex items-center gap-1 text-[11px] font-medium text-[#1A1A1A] hover:text-[#293763] bg-transparent border-none cursor-pointer transition-colors">
                    <Play size={10} weight="fill" /> Preview
                  </button>
                </div>
                <Row label="Last Login IP" value={profile.lastLoginIp} icon={<Globe size={11} className="text-[#DCDCDC]" />} />
                <Row label="Device" value={profile.deviceType} icon={<DeviceMobile size={11} className="text-[#DCDCDC]" />} />
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#999]">MFA</span>
                  <span className={`flex items-center gap-1 text-[11px] font-medium ${profile.mfaEnabled ? "text-[#1A1A1A]" : "text-[#E08A3C]"}`}>
                    {profile.mfaEnabled ? <Lock size={10} weight="fill" /> : <LockOpen size={10} />}
                    {profile.mfaEnabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>
            ) : <Skeleton rows={6} />}
          </Section>

          {/* Financials & Settlements */}
          <Section icon={<Wallet size={14} />} title="Financials & Settlements">
            {profile ? (
              <div className="space-y-5">
                <div className="grid grid-cols-3 gap-2.5">
                  <Metric label="Pending Payout" value={`$${profile.pendingPayout.toLocaleString()}`} />
                  <Metric label="Settled (LT)" value={`$${(profile.completedSettlements / 1000).toFixed(0)}K`} />
                  <Metric label="Chargebacks" value={String(profile.activeChargebacks)} highlight={profile.activeChargebacks > 0} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#999]">Payout Method</span>
                  <span className="text-[12px] font-normal text-[#1A1A1A]">{profile.payoutMethod}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#999]">Account</span>
                  <span className="text-[12px] font-mono text-[#ACACAC]">{profile.payoutAccount}</span>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-[#DCDCDC] uppercase tracking-[0.1em] mb-2.5">Recent Payouts</p>
                  {profile.recentPayouts.map((p, i) => (
                    <div key={p.id} className={`flex items-center justify-between py-2.5 ${i > 0 ? "border-t border-[#F8F8F8]" : ""}`}>
                      <div className="flex items-center gap-2.5">
                        <span className={`w-[5px] h-[5px] rounded-full shrink-0 ${PAYOUT_DOT[p.status]}`} />
                        <div className="flex flex-col">
                          <span className="text-[12px] font-mono text-[#999] leading-tight">{p.id}</span>
                          <span className="text-[10px] text-[#DCDCDC] mt-0.5">{p.date}</span>
                        </div>
                      </div>
                      <span className="text-[13px] font-normal text-[#1A1A1A] tabular-nums">${p.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : <Skeleton rows={5} />}
          </Section>

          {/* Classroom & Media Quality */}
          <Section icon={<Chalkboard size={14} />} title="Classroom & Media Quality">
            {profile ? (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-2.5">
                  <Metric label="Attendance Rate" value={`${profile.attendanceRate}%`} />
                  <Metric label="Osmium AI Score" value={`${profile.osmiumAudit.score}/100`} />
                </div>

                {/* AI Audit summary */}
                {profile.osmiumAudit.flags > 0 && (
                  <div className="bg-[#FFF8F3] rounded-xl px-3.5 py-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Brain size={11} className="text-[#E08A3C]" />
                      <span className="text-[10px] font-medium text-[#E08A3C]">{profile.osmiumAudit.flags} Osmium Flag{profile.osmiumAudit.flags !== 1 ? "s" : ""}</span>
                    </div>
                    <p className="text-[11px] text-[#999] leading-relaxed">{profile.osmiumAudit.summary}</p>
                  </div>
                )}

                {/* Reviews */}
                <div>
                  <p className="text-[10px] font-medium text-[#DCDCDC] uppercase tracking-[0.1em] mb-2.5">Recent Reviews</p>
                  {profile.recentReviews.map((r, i) => (
                    <div key={i} className={`py-3 ${i > 0 ? "border-t border-[#F8F8F8]" : ""}`}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[12px] font-normal text-[#1A1A1A]">{r.student}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-[11px] font-normal text-[#1A1A1A] tabular-nums">{r.rating}</span>
                          <Star size={10} weight="fill" className="text-[#1A1A1A]" />
                        </div>
                      </div>
                      <p className="text-[11px] text-[#999] leading-relaxed">{r.text}</p>
                      <p className="text-[10px] text-[#DCDCDC] mt-1">{r.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : <Skeleton rows={5} />}
          </Section>

          {/* Content & Assets */}
          <Section icon={<Folder size={14} />} title="Content & Assets">
            {profile ? (
              <div className="grid grid-cols-3 gap-2.5">
                <Metric label="Courses" value={String(profile.publishedCourses)} />
                <Metric label="Modules" value={String(profile.uploadedModules)} />
                <Metric label="Quizzes" value={String(profile.autoGradedQuizzes)} />
              </div>
            ) : <Skeleton rows={2} />}
          </Section>

          {/* ── Command & Control ── */}
          <div className="px-8 py-6">
            <p className="text-[10px] font-medium text-[#DCDCDC] uppercase tracking-[0.12em] mb-3">Command & Control</p>
            <div className="border border-[#F0F0F0] rounded-xl overflow-hidden divide-y divide-[#F5F5F5]">
              <ActionRow icon={<Rocket size={13} />} label="Feature / Boost" sub="Boost in Trending Teachers algorithm" onClick={() => showToast(`${teacher.name} boosted in Trending Teachers`)} />
              <ActionRow icon={<Percent size={13} />} label="Adjust Commission" sub="Override platform take-rate for this tutor" onClick={() => showToast(`Commission override applied for ${teacher.name}`)} />
              <ActionRow icon={<CalendarX size={13} />} label="Force Cancel Schedule" sub="Cancel bookings & auto-refund students" onClick={() => showToast(`Schedule cancelled and refunds initiated for ${teacher.name}`)} />
              <ActionRow icon={<Prohibit size={13} />} label="Suspend / Revoke Verification" sub="Freeze escrow, revoke Aegis tokens" onClick={() => showToast(`Account suspended: ${teacher.name}`)} danger />
            </div>
          </div>
        </div>
      </div>
      {toast && (
        <div className="fixed bottom-6 right-6 z-[300] flex items-center gap-3 bg-[#1A1A1A] text-white px-4 py-3 rounded-xl shadow-lg animate-fadeIn">
          <CheckCircle size={14} weight="fill" className="text-[#22C55E] shrink-0" />
          <span className="text-[13px]">{toast}</span>
          <button onClick={() => setToast(null)} className="ml-2 text-white/50 hover:text-white bg-transparent border-none cursor-pointer"><X size={12} weight="bold" /></button>
        </div>
      )}
    </>
  );
}

/* ── Sub-components ── */

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="px-8 py-6 border-b border-[#F5F5F5]">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[#ACACAC]">{icon}</span>
        <h4 className="text-[13px] font-medium text-[#1A1A1A] font-season">{title}</h4>
      </div>
      {children}
    </div>
  );
}

function Row({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12px] text-[#999]">{label}</span>
      <span className="flex items-center gap-1.5 text-[12px] font-normal text-[#1A1A1A]">{icon} {value}</span>
    </div>
  );
}

function QuickStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border border-[#F0F0F0] px-2.5 py-2.5 text-center">
      <div className="flex items-center justify-center gap-1 mb-1">{icon}<span className="text-[10px] text-[#CACACA]">{label}</span></div>
      <p className="text-[13px] font-normal text-[#1A1A1A] tracking-tight leading-none tabular-nums">{value}</p>
    </div>
  );
}

function Metric({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-[#FAFAFA] rounded-xl px-3.5 py-3">
      <p className="text-[10px] text-[#CACACA] mb-1.5">{label}</p>
      <p className={`text-[15px] font-normal tracking-tight leading-none tabular-nums ${highlight ? "text-[#E08A3C]" : "text-[#1A1A1A]"}`}>{value}</p>
    </div>
  );
}

function ActionRow({ icon, label, sub, danger, onClick }: { icon: React.ReactNode; label: string; sub: string; danger?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center justify-between px-4 py-3.5 border-none cursor-pointer transition-colors text-left group/action ${danger ? "bg-transparent hover:bg-[#FFF8F3]" : "bg-transparent hover:bg-[#FAFAFA]"}`}>
      <div className="flex items-center gap-3">
        <span className={danger ? "text-[#E08A3C]" : "text-[#999]"}>{icon}</span>
        <div>
          <p className={`text-[12px] font-normal leading-tight ${danger ? "text-[#E08A3C]" : "text-[#1A1A1A]"}`}>{label}</p>
          <p className="text-[10px] text-[#DCDCDC] mt-0.5">{sub}</p>
        </div>
      </div>
      <CaretRight size={11} weight="bold" className="text-[#EBEBEB] group-hover/action:text-[#CACACA] transition-colors" />
    </button>
  );
}

export default memo(TeacherDrawer);
