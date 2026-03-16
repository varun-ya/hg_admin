"use client";
import { useState, useEffect, memo } from "react";
import {
  X,
  Copy,
  ShieldCheck,
  ShieldWarning,
  Laptop,
  DeviceMobile,
  Globe,
  Clock,
  ListBullets,
  Gavel,
  ArrowsClockwise,
  Lock,
  UserMinus,
  SignOut,
  CaretRight,
  Crown,
} from "@phosphor-icons/react";
import { getStaffProfile } from "./staffMockData";
import type { StaffMember, StaffProfile, AegisRole, MfaStatus } from "./staffTypes";
import ConfirmModal from "../ConfirmModal";

const ROLE_STYLE: Record<AegisRole, { bg: string; text: string; label: string }> = {
  super_admin: { bg: "bg-[#F3F0FF]", text: "text-[#6B4FBB]", label: "Super Admin" },
  trust_safety: { bg: "bg-[#EFF6FF]", text: "text-[#3B6FC0]", label: "Trust & Safety" },
  finance_ops: { bg: "bg-[#F0F0F0]", text: "text-[#1A1A1A]", label: "Finance Ops" },
  tier1_support: { bg: "bg-[#F0F0F0]", text: "text-[#777]", label: "Tier 1 Support" },
};

const MFA_DISPLAY: Record<MfaStatus, { icon: React.ReactNode; label: string; color: string }> = {
  enabled: { icon: <ShieldCheck size={12} weight="fill" />, label: "2FA Enabled", color: "text-[#1A1A1A]" },
  pending: { icon: <Clock size={12} />, label: "2FA Pending", color: "text-[#E08A3C]" },
  disabled: { icon: <ShieldWarning size={12} weight="fill" />, label: "2FA Disabled", color: "text-[#DC2626]" },
};

const SEVERITY_DOT: Record<string, string> = {
  info: "bg-[#CACACA]",
  warning: "bg-[#E08A3C]",
  critical: "bg-[#DC2626]",
};

interface Props {
  staff: StaffMember | null;
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

function StaffDrawer({ staff, onClose }: Props) {
  const [profile, setProfile] = useState<StaffProfile | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{ title: string; description: string; confirmString: string } | null>(null);

  useEffect(() => {
    if (staff) {
      setProfile(null);
      const t = setTimeout(() => setProfile(getStaffProfile(staff.id)), 400);
      return () => clearTimeout(t);
    }
  }, [staff]);

  useEffect(() => {
    if (!staff) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [staff, onClose]);

  if (!staff) return null;

  const role = ROLE_STYLE[staff.aegisRole];
  const mfa = MFA_DISPLAY[staff.mfaStatus];
  const isRevoked = staff.status === "revoked";

  const copyId = () => {
    navigator.clipboard.writeText(staff.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 1500);
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/15 backdrop-blur-[2px] z-40 animate-fadeIn" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-[520px] max-w-[95vw] bg-white z-50 shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.08)] flex flex-col font-matter animate-slideIn">

        {/* ── Hero Header ── */}
        <div className="px-8 pt-7 pb-6 border-b border-[#F5F5F5] shrink-0 bg-[#FAFAFA]/50">
          <div className="flex items-center justify-between mb-6">
            <span className="text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.12em]">Staff Audit Profile</span>
            <button onClick={onClose} className="w-7 h-7 rounded-lg bg-white border border-[#F0F0F0] flex items-center justify-center text-[#CACACA] hover:text-[#999] hover:border-[#DCDCDC] cursor-pointer transition-all">
              <X size={13} weight="bold" />
            </button>
          </div>

          <div className="flex items-center gap-4 mb-5">
            <div className={`w-14 h-14 rounded-2xl overflow-hidden border border-[#F0F0F0] shrink-0 ring-3 ring-white shadow-sm ${isRevoked ? "grayscale" : ""}`}>
              <img src={staff.avatar} alt={staff.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-[18px] font-medium text-[#1A1A1A] font-season leading-tight truncate">{staff.name}</h2>
              <p className="text-[12px] text-[#ACACAC] mt-1 truncate">{staff.email}</p>
            </div>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1 px-2.5 py-[3px] rounded-full text-[10.5px] font-medium ${role.bg} ${role.text}`}>
              {staff.aegisRole === "super_admin" && <Crown size={10} weight="fill" />}
              {role.label}
            </span>
            <span className={`flex items-center gap-1 px-2.5 py-[3px] rounded-full text-[10.5px] font-medium bg-[#F7F7F7] ${mfa.color}`}>
              {mfa.icon} {mfa.label}
            </span>
            {isRevoked && (
              <span className="px-2.5 py-[3px] rounded-full text-[10.5px] font-medium bg-[#F5F5F5] text-[#ACACAC]">Revoked</span>
            )}
            <button onClick={copyId} className="flex items-center gap-1 text-[10.5px] font-mono text-[#ACACAC] hover:text-[#1A1A1A] bg-[#F7F7F7] px-2.5 py-[3px] rounded-full border-none cursor-pointer transition-colors">
              {copiedId ? "Copied!" : staff.id} <Copy size={9} />
            </button>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-4 gap-3 mt-5">
            <QuickStat label="Department" value={staff.department} />
            <QuickStat label="Last Active" value={staff.lastActiveTime} />
            <QuickStat label="Last IP" value={staff.lastActiveIp} />
            <QuickStat label="Status" value={isRevoked ? "Revoked" : "Active"} />
          </div>
        </div>

        {/* ── Scrollable Sections ── */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">

          {/* Device Bindings */}
          <Section icon={<Laptop size={14} />} title="Aegis Device Bindings">
            {profile ? (
              <div className="space-y-2.5">
                {profile.devices.map((d) => (
                  <div key={d.id} className="flex items-center justify-between py-2.5 px-3.5 rounded-xl bg-[#FAFAFA] border border-[#F5F5F5]">
                    <div className="flex items-center gap-3">
                      {d.type === "laptop" ? <Laptop size={14} className="text-[#ACACAC]" /> : <DeviceMobile size={14} className="text-[#ACACAC]" />}
                      <div>
                        <p className="text-[12px] text-[#1A1A1A] leading-tight">{d.label}</p>
                        <p className="text-[10px] text-[#DCDCDC] mt-0.5">Last seen: {d.lastSeen}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-medium px-2 py-[2px] rounded-full ${d.trusted ? "bg-[#F0F0F0] text-[#1A1A1A]" : "bg-[#F5F5F5] text-[#ACACAC]"}`}>
                      {d.trusted ? "Trusted" : "Untrusted"}
                    </span>
                  </div>
                ))}
              </div>
            ) : <DrawerSkeleton rows={3} />}
          </Section>

          {/* Active Sessions */}
          <Section icon={<Globe size={14} />} title="Session Management">
            {profile ? (
              <div className="space-y-2.5">
                {profile.activeSessions.map((ses) => (
                  <div key={ses.id} className="flex items-center justify-between py-2.5 px-3.5 rounded-xl bg-[#FAFAFA] border border-[#F5F5F5]">
                    <div className="flex items-center gap-3">
                      <span className="relative flex h-2 w-2 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1A1A1A] opacity-30" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1A1A1A]" />
                      </span>
                      <div>
                        <p className="text-[12px] text-[#1A1A1A] leading-tight">{ses.device} — {ses.location}</p>
                        <p className="text-[10px] text-[#DCDCDC] font-mono mt-0.5">{ses.ip} · {ses.startedAt}</p>
                      </div>
                    </div>
                    <button className="text-[10px] font-medium text-[#E08A3C] hover:text-[#C0722F] bg-transparent border-none cursor-pointer transition-colors">
                      Kill
                    </button>
                  </div>
                ))}
                {profile.activeSessions.length === 0 && (
                  <p className="text-[12px] text-[#DCDCDC] text-center py-4">No active sessions</p>
                )}
              </div>
            ) : <DrawerSkeleton rows={2} />}
          </Section>

          {/* Access Logs */}
          <Section icon={<Clock size={14} />} title="Access Logs">
            {profile ? (
              <div className="space-y-0">
                {profile.accessLogs.map((log, i) => (
                  <div key={i} className={`flex items-start gap-3 py-2.5 ${i > 0 ? "border-t border-[#F8F8F8]" : ""}`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#DCDCDC] mt-1.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-[#1A1A1A] leading-tight">{log.timestamp}</p>
                      <p className="text-[10px] text-[#CACACA] mt-0.5">{log.method} · {log.ip} · {log.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : <DrawerSkeleton rows={5} />}
          </Section>

          {/* Audit Trail */}
          <Section icon={<ListBullets size={14} />} title="Action Audit Trail (30d)">
            {profile ? (
              <div className="space-y-0">
                {profile.auditTrail.map((action, i) => (
                  <div key={i} className={`flex items-start gap-3 py-2.5 ${i > 0 ? "border-t border-[#F8F8F8]" : ""}`}>
                    <span className={`w-[6px] h-[6px] rounded-full mt-1.5 shrink-0 ${SEVERITY_DOT[action.severity]}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-[#1A1A1A] leading-relaxed">{action.description}</p>
                      <p className="text-[10px] text-[#DCDCDC] mt-0.5">{action.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : <DrawerSkeleton rows={6} />}
          </Section>

          {/* ── Command Actions ── */}
          <div className="px-8 py-6">
            <p className="text-[10px] font-medium text-[#DCDCDC] uppercase tracking-[0.12em] mb-3">Super Admin Commands</p>
            <div className="border border-[#F0F0F0] rounded-xl overflow-hidden divide-y divide-[#F5F5F5]">
              <ActionRow
                icon={<Gavel size={13} />}
                label="Promote / Demote Role"
                sub="Change Aegis clearance level"
                onClick={() => setConfirmModal({ title: "Change Agent Role", description: "This will modify the agent's Aegis clearance level and immediately update their permissions across all systems.", confirmString: "CONFIRM-ROLE-CHANGE" })}
              />
              <ActionRow icon={<ArrowsClockwise size={13} />} label="Force Password Reset" sub="Invalidates current password on next login" />
              <ActionRow icon={<Lock size={13} />} label="Force 2FA Enrollment" sub="Requires MFA setup before next session" />
              <ActionRow icon={<SignOut size={13} />} label="Force Global Logout" sub="Kills all active sessions immediately" danger />
              <ActionRow
                icon={<UserMinus size={13} />}
                label="Revoke Access (Offboarding)"
                sub="Disables account and kills all sessions"
                danger
                onClick={() => setConfirmModal({ title: "Revoke Agent Access", description: "This will immediately kill all active sessions, disable the account, and revoke all Aegis permissions. This action is logged and audited.", confirmString: "REVOKE-ACCESS" })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      {confirmModal && (
        <ConfirmModal
          isOpen
          onClose={() => setConfirmModal(null)}
          title={confirmModal.title}
          description={confirmModal.description}
          confirmString={confirmModal.confirmString}
          onConfirm={() => setConfirmModal(null)}
          variant="danger"
        />
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

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border border-[#F0F0F0] px-3 py-2.5 text-center">
      <p className="text-[10px] text-[#CACACA] mb-1">{label}</p>
      <p className="text-[13px] font-normal text-[#1A1A1A] tracking-tight leading-none truncate">{value}</p>
    </div>
  );
}

function ActionRow({ icon, label, sub, danger, onClick }: { icon: React.ReactNode; label: string; sub: string; danger?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3.5 border-none cursor-pointer transition-colors text-left group/action ${
        danger ? "bg-transparent hover:bg-[#FFF8F3]" : "bg-transparent hover:bg-[#FAFAFA]"
      }`}
    >
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

export default memo(StaffDrawer);
