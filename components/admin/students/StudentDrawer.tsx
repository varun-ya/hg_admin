"use client";
import { useState, useEffect, memo } from "react";
import {
  X,
  Copy,
  ShieldCheck,
  Wallet,
  BookOpen,
  Gavel,
  ArrowClockwise,
  Gift,
  CurrencyDollar,
  Trash,
  Prohibit,
  Globe,
  DeviceMobile,
  GoogleLogo,
  AppleLogo,
  Lock,
  LockOpen,
  CaretRight,
  CalendarBlank,
  Clock,
  CheckCircle,
} from "@phosphor-icons/react";
import { getStudentProfile } from "./studentMockData";
import type { Student, StudentProfile, RiskLevel } from "./studentTypes";

const STATUS_STYLE: Record<string, string> = {
  active: "bg-[#F0F0F0] text-[#1A1A1A]",
  inactive: "bg-[#F5F5F5] text-[#999]",
  suspended: "bg-[#F5F5F5] text-[#E08A3C]",
  pending_deletion: "bg-[#F5F5F5] text-[#ACACAC]",
};

const RISK_STYLE: Record<RiskLevel, { dot: string; label: string }> = {
  low: { dot: "bg-[#CACACA]", label: "Low Risk" },
  medium: { dot: "bg-[#E08A3C]", label: "Medium Risk" },
  high: { dot: "bg-[#1A1A1A]", label: "High Risk" },
};

const TXN_DOT: Record<string, string> = {
  success: "bg-[#1A1A1A]",
  failed: "bg-[#E08A3C]",
  pending: "bg-[#DCDCDC]",
};

interface Props {
  student: Student | null;
  onClose: () => void;
}

function DrawerSkeleton({ rows = 3 }: { rows?: number }) {
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

function StudentDrawer({ student, onClose }: Props) {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    if (student) {
      setProfile(null);
      const t = setTimeout(() => setProfile(getStudentProfile(student.id)), 400);
      return () => clearTimeout(t);
    }
  }, [student]);

  // Close on Escape
  useEffect(() => {
    if (!student) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [student, onClose]);

  if (!student) return null;

  const risk = RISK_STYLE[student.riskScore];

  const copyId = () => {
    navigator.clipboard.writeText(student.aegisId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 1500);
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/15 backdrop-blur-[2px] z-40 animate-fadeIn" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-[500px] max-w-[95vw] bg-white z-50 shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.08)] flex flex-col font-matter animate-slideIn">

        {/* ── Hero Header ── */}
        <div className="px-8 pt-7 pb-6 border-b border-[#F5F5F5] shrink-0 bg-[#FAFAFA]/50">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.12em]">Student Profile</span>
            <button onClick={onClose} className="w-7 h-7 rounded-lg bg-white border border-[#F0F0F0] flex items-center justify-center text-[#CACACA] hover:text-[#999] hover:border-[#DCDCDC] cursor-pointer transition-all">
              <X size={13} weight="bold" />
            </button>
          </div>

          {/* Identity */}
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border border-[#F0F0F0] shrink-0 ring-3 ring-white shadow-sm">
              <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-[18px] font-medium text-[#1A1A1A] font-season leading-tight truncate">{student.name}</h2>
              <p className="text-[12px] text-[#ACACAC] mt-1 truncate">{student.email}</p>
            </div>
          </div>

          {/* Badges row */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex px-2.5 py-[3px] rounded-full text-[10.5px] font-medium ${STATUS_STYLE[student.status]}`}>
              {student.status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-[3px] rounded-full text-[10.5px] font-medium bg-[#F7F7F7] text-[#999]">
              <span className={`w-[5px] h-[5px] rounded-full ${risk.dot}`} />
              {risk.label}
            </span>
            <button
              onClick={copyId}
              className="flex items-center gap-1 text-[10.5px] font-mono text-[#ACACAC] hover:text-[#1A1A1A] bg-[#F7F7F7] px-2.5 py-[3px] rounded-full border-none cursor-pointer transition-colors"
            >
              {copiedId ? "Copied!" : student.aegisId}
              <Copy size={9} />
            </button>
          </div>

          {/* Quick stats strip */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            <QuickStat icon={<BookOpen size={11} className="text-[#CACACA]" />} label="Classes" value={String(student.totalClasses)} />
            <QuickStat icon={<Clock size={11} className="text-[#CACACA]" />} label="Hours" value={String(student.totalHours)} />
            <QuickStat icon={<CalendarBlank size={11} className="text-[#CACACA]" />} label="Joined" value={new Date(student.dateJoined).toLocaleDateString("en-US", { month: "short", year: "numeric" })} />
          </div>
        </div>

        {/* ── Scrollable Sections ── */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">

          {/* Identity & Security */}
          <Section icon={<ShieldCheck size={14} />} title="Identity & Security">
            {profile ? (
              <div className="space-y-3.5">
                <Row label="Last Login IP" value={profile.lastLoginIp} icon={<Globe size={11} className="text-[#DCDCDC]" />} />
                <Row label="Device" value={profile.deviceType} icon={<DeviceMobile size={11} className="text-[#DCDCDC]" />} />
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#999]">Connected</span>
                  <div className="flex items-center gap-1.5">
                    {profile.connectedAccounts.map((a) => (
                      <span key={a} className="flex items-center gap-1 text-[10.5px] text-[#999] bg-[#F7F7F7] px-2 py-[2px] rounded-md">
                        {a === "Google" ? <GoogleLogo size={10} /> : <AppleLogo size={10} />} {a}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#999]">MFA</span>
                  <span className={`flex items-center gap-1 text-[11px] font-medium ${profile.mfaEnabled ? "text-[#1A1A1A]" : "text-[#E08A3C]"}`}>
                    {profile.mfaEnabled ? <Lock size={10} weight="fill" /> : <LockOpen size={10} />}
                    {profile.mfaEnabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>
            ) : <DrawerSkeleton rows={4} />}
          </Section>

          {/* Wallet & Transactions */}
          <Section icon={<Wallet size={14} />} title="Wallet & Transactions">
            {profile ? (
              <div className="space-y-5">
                <div className="grid grid-cols-3 gap-2.5">
                  <Metric label="Escrow" value={`$${profile.escrowBalance}`} />
                  <Metric label="Refunded" value={`$${profile.totalRefunded}`} />
                  <Metric label="Lifetime" value={`$${student.lifetimeSpend.toLocaleString()}`} />
                </div>
                <div>
                  <p className="text-[10px] font-medium text-[#DCDCDC] uppercase tracking-[0.1em] mb-2.5">Recent Transactions</p>
                  {profile.recentTransactions.map((t, i) => (
                    <div key={t.id} className={`flex items-center justify-between py-2.5 ${i > 0 ? "border-t border-[#F8F8F8]" : ""}`}>
                      <div className="flex items-center gap-2.5">
                        <span className={`w-[5px] h-[5px] rounded-full shrink-0 ${TXN_DOT[t.status]}`} />
                        <div className="flex flex-col">
                          <span className="text-[12px] font-mono text-[#999] leading-tight">{t.id}</span>
                          <span className="text-[10px] text-[#DCDCDC] mt-0.5">{t.date}</span>
                        </div>
                      </div>
                      <span className="text-[13px] font-normal text-[#1A1A1A] tabular-nums">${t.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : <DrawerSkeleton rows={5} />}
          </Section>

          {/* Learning Activity */}
          <Section icon={<BookOpen size={14} />} title="Learning Activity">
            {profile ? (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-2.5">
                  <Metric label="Missed Classes" value={String(profile.missedClasses)} highlight={profile.missedClasses > 2} />
                  <Metric label="Avg. Feedback Given" value={`${profile.avgFeedbackGiven} / 5`} />
                </div>
                {profile.activePackages.length > 0 && (
                  <div>
                    <p className="text-[10px] font-medium text-[#DCDCDC] uppercase tracking-[0.1em] mb-2.5">Active Packages</p>
                    {profile.activePackages.map((p, i) => (
                      <div key={i} className={`flex items-center justify-between py-2.5 ${i > 0 ? "border-t border-[#F8F8F8]" : ""}`}>
                        <span className="text-[12px] text-[#666]">{p.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-[40px] h-[3px] bg-[#F0F0F0] rounded-full overflow-hidden">
                            <div className="h-full bg-[#1A1A1A] rounded-full" style={{ width: `${(p.hoursLeft / 10) * 100}%` }} />
                          </div>
                          <span className="text-[11px] font-normal text-[#1A1A1A] tabular-nums">{p.hoursLeft}h</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : <DrawerSkeleton rows={4} />}
          </Section>

          {/* Governance & AI Audit */}
          <Section icon={<Gavel size={14} />} title="Governance & AI Audit">
            {profile ? (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#999]">LMlens Content Flags</span>
                  <FlagBadge count={profile.contentFlags} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#999]">Chat Abuse Flags (Osmium)</span>
                  <FlagBadge count={profile.chatFlags} />
                </div>
              </div>
            ) : <DrawerSkeleton rows={2} />}
          </Section>

          {/* ── Danger Zone ── */}
          <div className="px-8 py-6">
            <p className="text-[10px] font-medium text-[#DCDCDC] uppercase tracking-[0.12em] mb-3">Super Admin Actions</p>
            <div className="border border-[#F0F0F0] rounded-xl overflow-hidden divide-y divide-[#F5F5F5]">
              <ActionRow icon={<ArrowClockwise size={13} />} label="Trigger Password Reset" sub="Sends secure Aegis reset link" onClick={() => showToast(`Password reset link sent to ${student.email}`)} />
              <ActionRow icon={<Gift size={13} />} label="Issue Promo / Credit" sub="Add manual wallet balance" onClick={() => showToast(`Promo credit issued to ${student.name}`)} />
              <ActionRow icon={<CurrencyDollar size={13} />} label="Process Manual Refund" sub="Overrides standard policy" onClick={() => showToast(`Manual refund initiated for ${student.name}`)} />
              <ActionRow icon={<Trash size={13} />} label="GDPR Right to be Forgotten" sub="Initiates 30-day data wipe" onClick={() => showToast(`GDPR deletion request queued for ${student.name}`)} danger />
              <ActionRow icon={<Prohibit size={13} />} label="Suspend / Ban Account" sub="Immediately revokes access tokens" onClick={() => showToast(`Account suspended: ${student.name}`)} danger />
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
    <div className="bg-white rounded-xl border border-[#F0F0F0] px-3 py-2.5 text-center">
      <div className="flex items-center justify-center gap-1 mb-1">{icon}<span className="text-[10px] text-[#CACACA]">{label}</span></div>
      <p className="text-[14px] font-normal text-[#1A1A1A] tracking-tight leading-none tabular-nums">{value}</p>
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

function FlagBadge({ count }: { count: number }) {
  if (count === 0) return <span className="text-[11px] text-[#DCDCDC]">None</span>;
  return (
    <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#E08A3C] bg-[#FFF8F3] px-2 py-[2px] rounded-full">
      <span className="w-[4px] h-[4px] rounded-full bg-[#E08A3C]" />
      {count} flag{count !== 1 ? "s" : ""}
    </span>
  );
}

function ActionRow({ icon, label, sub, danger, onClick }: { icon: React.ReactNode; label: string; sub: string; danger?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center justify-between px-4 py-3.5 border-none cursor-pointer transition-colors text-left group/action ${
      danger ? "bg-transparent hover:bg-[#FFF8F3]" : "bg-transparent hover:bg-[#FAFAFA]"
    }`}>
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

export default memo(StudentDrawer);
