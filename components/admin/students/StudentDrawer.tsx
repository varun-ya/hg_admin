"use client";
import { useState, useEffect, memo } from "react";
import {
  X, Copy, ShieldCheck, Wallet, BookOpen, Gavel,
  ArrowClockwise, Gift, CurrencyDollar, Trash, Prohibit,
  Globe, DeviceMobile, GoogleLogo, AppleLogo, Lock, LockOpen,
  CaretRight, CalendarBlank, Clock, CheckCircle, Warning,
} from "@phosphor-icons/react";
import { getStudentProfile } from "./studentMockData";
import type { Student, StudentProfile, RiskLevel } from "./studentTypes";

const STATUS_CFG: Record<string, { bg: string; text: string; dot: string }> = {
  active:           { bg: "#F0FDF4", text: "#16A34A", dot: "#22C55E" },
  inactive:         { bg: "#F5F5F5", text: "#999",    dot: "#CACACA" },
  suspended:        { bg: "#FFF7ED", text: "#B45309", dot: "#F59E0B" },
  pending_deletion: { bg: "#FEF2F2", text: "#DC2626", dot: "#EF4444" },
};

const RISK_CFG: Record<RiskLevel, { bg: string; text: string; dot: string; label: string }> = {
  low:    { bg: "#F5F5F5", text: "#888",    dot: "#CACACA", label: "Low Risk" },
  medium: { bg: "#FFF7ED", text: "#B45309", dot: "#F59E0B", label: "Medium Risk" },
  high:   { bg: "#FEF2F2", text: "#DC2626", dot: "#EF4444", label: "High Risk" },
};

const TXN_CFG: Record<string, { dot: string; amtColor: string }> = {
  success: { dot: "#22C55E", amtColor: "#1A1A1A" },
  failed:  { dot: "#EF4444", amtColor: "#DC2626" },
  pending: { dot: "#F59E0B", amtColor: "#888"    },
};

interface Props { student: Student | null; onClose: () => void; }

function Skeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex items-center justify-between">
          <div className="h-3 bg-[#F0F0F0] rounded-full w-28" />
          <div className="h-3 bg-[#F0F0F0] rounded-full w-20" />
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

  useEffect(() => {
    if (!student) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [student, onClose]);

  if (!student) return null;

  const sc  = STATUS_CFG[student.status] ?? STATUS_CFG.inactive;
  const rc  = RISK_CFG[student.riskScore];
  const statusLabel = student.status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const copyId = () => {
    navigator.clipboard.writeText(student.aegisId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 1500);
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40 animate-fadeIn" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-[520px] max-w-[96vw] bg-white z-50 shadow-[-24px_0_80px_-20px_rgba(0,0,0,0.10)] flex flex-col animate-slideIn overflow-hidden">

        {/* ── Hero ── */}
        <div className="shrink-0 bg-gradient-to-b from-[#FAFAFA] to-white border-b border-[#F0F0F0]">

          {/* Top bar */}
          <div className="flex items-center justify-between px-7 pt-6 pb-0">
            <span className="text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.14em]">Student Profile</span>
            <button onClick={onClose} className="w-7 h-7 rounded-lg bg-white border border-[#EBEBEB] flex items-center justify-center text-[#CACACA] hover:text-[#555] hover:border-[#CACACA] cursor-pointer transition-all">
              <X size={12} weight="bold" />
            </button>
          </div>

          {/* Avatar + name */}
          <div className="flex items-center gap-4 px-7 pt-5 pb-5">
            <div className="relative shrink-0">
              <div className="w-[60px] h-[60px] rounded-2xl overflow-hidden border-2 border-white shadow-md">
                <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
              </div>
              {/* online dot */}
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white" style={{ backgroundColor: sc.dot }} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-[19px] font-semibold text-[#1A1A1A] leading-tight truncate">{student.name}</h2>
              <p className="text-[12px] text-[#ACACAC] mt-0.5 truncate">{student.email}</p>
            </div>
          </div>

          {/* Badge row */}
          <div className="flex items-center gap-2 px-7 pb-5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium" style={{ backgroundColor: sc.bg, color: sc.text }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sc.dot }} />
              {statusLabel}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium" style={{ backgroundColor: rc.bg, color: rc.text }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: rc.dot }} />
              {rc.label}
            </span>
            <button onClick={copyId} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono bg-[#F5F5F5] text-[#888] hover:bg-[#EBEBEB] hover:text-[#1A1A1A] cursor-pointer transition-all border-none">
              {copiedId ? "Copied!" : student.aegisId}
              <Copy size={9} weight="bold" />
            </button>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-3 border-t border-[#F0F0F0]">
            {[
              { icon: <BookOpen size={13} />, label: "Classes", value: String(student.totalClasses) },
              { icon: <Clock size={13} />,    label: "Hours",   value: String(student.totalHours) },
              { icon: <CalendarBlank size={13} />, label: "Joined", value: new Date(student.dateJoined).toLocaleDateString("en-US", { month: "short", year: "numeric" }) },
            ].map((s, i) => (
              <div key={s.label} className={`flex flex-col items-center py-4 gap-1 ${i < 2 ? "border-r border-[#F0F0F0]" : ""}`}>
                <span className="text-[#CACACA]">{s.icon}</span>
                <p className="text-[18px] font-semibold text-[#1A1A1A] leading-none tabular-nums">{s.value}</p>
                <p className="text-[10px] text-[#CACACA] uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto">

          {/* Identity & Security */}
          <Section icon={<ShieldCheck size={14} weight="duotone" />} title="Identity & Security">
            {profile ? (
              <div className="space-y-0 divide-y divide-[#F8F8F8]">
                <InfoRow label="Last Login IP" value={profile.lastLoginIp} icon={<Globe size={11} className="text-[#CACACA]" />} />
                <InfoRow label="Device" value={profile.deviceType} icon={<DeviceMobile size={11} className="text-[#CACACA]" />} />
                <div className="flex items-center justify-between py-3">
                  <span className="text-[12px] text-[#888]">Connected</span>
                  <div className="flex items-center gap-1.5">
                    {profile.connectedAccounts.map((a) => (
                      <span key={a} className="inline-flex items-center gap-1 text-[11px] text-[#555] bg-[#F5F5F5] px-2.5 py-1 rounded-lg font-medium">
                        {a === "Google" ? <GoogleLogo size={11} weight="fill" /> : <AppleLogo size={11} weight="fill" />} {a}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-[12px] text-[#888]">MFA</span>
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full ${profile.mfaEnabled ? "bg-[#F0FDF4] text-[#16A34A]" : "bg-[#FFF7ED] text-[#B45309]"}`}>
                    {profile.mfaEnabled ? <Lock size={10} weight="fill" /> : <LockOpen size={10} />}
                    {profile.mfaEnabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>
            ) : <Skeleton rows={4} />}
          </Section>

          {/* Wallet & Transactions */}
          <Section icon={<Wallet size={14} weight="duotone" />} title="Wallet & Transactions">
            {profile ? (
              <div className="space-y-5">
                {/* KPI cards */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Escrow",   value: `$${profile.escrowBalance}`,              sub: "held" },
                    { label: "Refunded", value: `$${profile.totalRefunded}`,              sub: "total" },
                    { label: "Lifetime", value: `$${student.lifetimeSpend.toLocaleString()}`, sub: "spent" },
                  ].map((k) => (
                    <div key={k.label} className="bg-[#FAFAFA] rounded-xl border border-[#F0F0F0] px-4 py-3.5 text-center">
                      <p className="text-[10px] text-[#CACACA] uppercase tracking-wider mb-1.5">{k.label}</p>
                      <p className="text-[17px] font-semibold text-[#1A1A1A] tabular-nums leading-none">{k.value}</p>
                      <p className="text-[10px] text-[#CACACA] mt-1">{k.sub}</p>
                    </div>
                  ))}
                </div>
                {/* Transactions */}
                <div>
                  <p className="text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.12em] mb-3">Recent Transactions</p>
                  <div className="rounded-xl border border-[#F0F0F0] overflow-hidden divide-y divide-[#F8F8F8]">
                    {profile.recentTransactions.map((t) => {
                      const cfg = TXN_CFG[t.status] ?? TXN_CFG.success;
                      return (
                        <div key={t.id} className="flex items-center justify-between px-4 py-3 hover:bg-[#FAFAFA] transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cfg.dot }} />
                            <div>
                              <p className="text-[12px] font-mono font-medium text-[#555]">{t.id}</p>
                              <p className="text-[10px] text-[#CACACA] mt-0.5">{t.date}</p>
                            </div>
                          </div>
                          <span className="text-[13px] font-semibold tabular-nums" style={{ color: cfg.amtColor }}>${t.amount.toLocaleString()}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : <Skeleton rows={5} />}
          </Section>

          {/* Learning Activity */}
          <Section icon={<BookOpen size={14} weight="duotone" />} title="Learning Activity">
            {profile ? (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <div className={`rounded-xl border px-4 py-3.5 ${profile.missedClasses > 2 ? "border-[#FED7AA] bg-[#FFF7ED]" : "border-[#F0F0F0] bg-[#FAFAFA]"}`}>
                    <p className="text-[10px] text-[#CACACA] uppercase tracking-wider mb-1.5">Missed Classes</p>
                    <p className={`text-[22px] font-semibold leading-none tabular-nums ${profile.missedClasses > 2 ? "text-[#B45309]" : "text-[#1A1A1A]"}`}>
                      {profile.missedClasses}
                    </p>
                    {profile.missedClasses > 2 && <p className="text-[10px] text-[#F59E0B] mt-1 flex items-center gap-1"><Warning size={9} weight="fill" />Above threshold</p>}
                  </div>
                  <div className="rounded-xl border border-[#F0F0F0] bg-[#FAFAFA] px-4 py-3.5">
                    <p className="text-[10px] text-[#CACACA] uppercase tracking-wider mb-1.5">Avg. Feedback</p>
                    <p className="text-[22px] font-semibold text-[#1A1A1A] leading-none tabular-nums">{profile.avgFeedbackGiven}<span className="text-[13px] text-[#CACACA] font-normal"> / 5</span></p>
                  </div>
                </div>
                {profile.activePackages.length > 0 && (
                  <div>
                    <p className="text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.12em] mb-3">Active Packages</p>
                    <div className="rounded-xl border border-[#F0F0F0] overflow-hidden divide-y divide-[#F8F8F8]">
                      {profile.activePackages.map((p, i) => {
                        const pct = Math.min((p.hoursLeft / 10) * 100, 100);
                        return (
                          <div key={i} className="px-4 py-3.5 hover:bg-[#FAFAFA] transition-colors">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[12px] font-medium text-[#555]">{p.name}</span>
                              <span className="text-[12px] font-semibold text-[#1A1A1A] tabular-nums">{p.hoursLeft}h left</span>
                            </div>
                            <div className="w-full h-[5px] bg-[#F0F0F0] rounded-full overflow-hidden">
                              <div className="h-full bg-[#293763] rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : <Skeleton rows={4} />}
          </Section>

          {/* Governance & AI Audit */}
          <Section icon={<Gavel size={14} weight="duotone" />} title="Governance & AI Audit">
            {profile ? (
              <div className="rounded-xl border border-[#F0F0F0] overflow-hidden divide-y divide-[#F8F8F8]">
                <FlagRow label="LMlens Content Flags" count={profile.contentFlags} />
                <FlagRow label="Chat Abuse Flags (Osmium)" count={profile.chatFlags} />
              </div>
            ) : <Skeleton rows={2} />}
          </Section>

          {/* Super Admin Actions */}
          <div className="px-7 py-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.14em]">Super Admin Actions</span>
              <span className="text-[10px] text-[#CACACA] bg-[#F5F5F5] px-2 py-0.5 rounded-full">Restricted</span>
            </div>
            <div className="rounded-xl border border-[#F0F0F0] overflow-hidden divide-y divide-[#F5F5F5]">
              <ActionRow icon={<ArrowClockwise size={13} />} label="Trigger Password Reset" sub="Sends secure Aegis reset link" onClick={() => showToast(`Password reset link sent to ${student.email}`)} />
              <ActionRow icon={<Gift size={13} />} label="Issue Promo / Credit" sub="Add manual wallet balance" onClick={() => showToast(`Promo credit issued to ${student.name}`)} />
              <ActionRow icon={<CurrencyDollar size={13} />} label="Process Manual Refund" sub="Overrides standard policy" onClick={() => showToast(`Manual refund initiated for ${student.name}`)} />
              <ActionRow icon={<Trash size={13} />} label="GDPR Right to be Forgotten" sub="Initiates 30-day data wipe" onClick={() => showToast(`GDPR deletion request queued for ${student.name}`)} danger />
              <ActionRow icon={<Prohibit size={13} />} label="Suspend / Ban Account" sub="Immediately revokes access tokens" onClick={() => showToast(`Account suspended: ${student.name}`)} danger />
            </div>
          </div>

        </div>{/* end scroll */}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[300] flex items-center gap-3 bg-[#1A1A1A] text-white px-4 py-3 rounded-xl shadow-xl animate-fadeIn">
          <CheckCircle size={14} weight="fill" className="text-[#22C55E] shrink-0" />
          <span className="text-[13px]">{toast}</span>
          <button onClick={() => setToast(null)} className="ml-1 text-white/40 hover:text-white bg-transparent border-none cursor-pointer"><X size={11} weight="bold" /></button>
        </div>
      )}
    </>
  );
}

/* ── Sub-components ── */

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="px-7 py-6 border-b border-[#F5F5F5]">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[#ACACAC]">{icon}</span>
        <h4 className="text-[13px] font-semibold text-[#1A1A1A]">{title}</h4>
      </div>
      {children}
    </div>
  );
}

function InfoRow({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-[12px] text-[#888]">{label}</span>
      <span className="flex items-center gap-1.5 text-[12px] font-medium text-[#1A1A1A]">{icon}{value}</span>
    </div>
  );
}

function FlagRow({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5 hover:bg-[#FAFAFA] transition-colors">
      <span className="text-[12px] text-[#555]">{label}</span>
      {count === 0
        ? <span className="text-[11px] font-medium text-[#CACACA] bg-[#F5F5F5] px-2.5 py-1 rounded-full">None</span>
        : <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#B45309] bg-[#FFF7ED] px-2.5 py-1 rounded-full">
            <Warning size={10} weight="fill" />{count} flag{count !== 1 ? "s" : ""}
          </span>
      }
    </div>
  );
}

function ActionRow({ icon, label, sub, danger, onClick }: { icon: React.ReactNode; label: string; sub: string; danger?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center justify-between px-4 py-4 border-none cursor-pointer transition-colors text-left group/action ${danger ? "hover:bg-[#FFF7ED]" : "hover:bg-[#FAFAFA]"}`}>
      <div className="flex items-center gap-3.5">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${danger ? "bg-[#FFF7ED] text-[#E08A3C]" : "bg-[#F5F5F5] text-[#888]"}`}>
          {icon}
        </div>
        <div>
          <p className={`text-[13px] font-medium leading-tight ${danger ? "text-[#B45309]" : "text-[#1A1A1A]"}`}>{label}</p>
          <p className="text-[11px] text-[#CACACA] mt-0.5">{sub}</p>
        </div>
      </div>
      <CaretRight size={11} weight="bold" className="text-[#DCDCDC] group-hover/action:text-[#ACACAC] transition-colors shrink-0" />
    </button>
  );
}

export default memo(StudentDrawer);
