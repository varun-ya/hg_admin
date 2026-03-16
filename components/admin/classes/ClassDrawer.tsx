"use client";
import { useState, useEffect, memo } from "react";
import {
  X, Eye, Megaphone, Prohibit, CaretRight, ChartLine, ChatText, FileText, Copy,
} from "@phosphor-icons/react";
import { getSessionProfile } from "./classMockData";
import type { LiveSession, SessionProfile, ConnectionHealth } from "./classTypes";
import ConfirmModal from "@/components/admin/ConfirmModal";

const HEALTH_DOT: Record<ConnectionHealth, string> = { green: "bg-[#1A1A1A]", yellow: "bg-[#E08A3C]", red: "bg-[#DC2626]" };
const HEALTH_LABEL: Record<ConnectionHealth, string> = { green: "Healthy", yellow: "Degraded", red: "Critical" };

interface Props { session: LiveSession | null; onClose: () => void }

function TelemetryChart({ label, data, unit, color }: { label: string; data: number[]; unit: string; color: string }) {
  const w = 200, h = 48, pad = 2;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => ({ x: pad + (i / (data.length - 1)) * (w - pad * 2), y: pad + (1 - (v - min) / range) * (h - pad * 2) }));
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const cpx = (pts[i].x + pts[i + 1].x) / 2;
    d += ` C ${cpx} ${pts[i].y}, ${cpx} ${pts[i + 1].y}, ${pts[i + 1].x} ${pts[i + 1].y}`;
  }
  const area = `${d} L ${pts[pts.length - 1].x} ${h} L ${pts[0].x} ${h} Z`;
  const last = data[data.length - 1];
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-[10px] text-[#CACACA]">{label}</span>
        <span className="text-[12px] font-normal text-[#1A1A1A] tabular-nums">{last} {unit}</span>
      </div>
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full">
        <defs>
          <linearGradient id={`tc-${label.replace(/\s/g, "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.06" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#tc-${label.replace(/\s/g, "")})`} />
        <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function ClassDrawer({ session, onClose }: Props) {
  const [profile, setProfile] = useState<SessionProfile | null>(null);
  const [terminateModal, setTerminateModal] = useState(false);

  useEffect(() => {
    if (session) { setProfile(null); const t = setTimeout(() => setProfile(getSessionProfile(session.id)), 400); return () => clearTimeout(t); }
  }, [session]);

  useEffect(() => {
    if (!session) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [session, onClose]);

  if (!session) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/15 backdrop-blur-[2px] z-40 animate-fadeIn" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-[520px] max-w-[95vw] bg-white z-50 shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.08)] flex flex-col font-matter animate-slideIn">

        {/* Hero */}
        <div className="px-8 pt-7 pb-6 border-b border-[#F5F5F5] shrink-0 bg-[#FAFAFA]/50">
          <div className="flex items-center justify-between mb-6">
            <span className="text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.12em]">Session Intervention</span>
            <button onClick={onClose} className="w-7 h-7 rounded-lg bg-white border border-[#F0F0F0] flex items-center justify-center text-[#CACACA] hover:text-[#999] hover:border-[#DCDCDC] cursor-pointer transition-all"><X size={13} weight="bold" /></button>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-40" style={{ backgroundColor: session.health === "green" ? "#1A1A1A" : session.health === "yellow" ? "#E08A3C" : "#DC2626" }} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${HEALTH_DOT[session.health]}`} />
            </span>
            <h2 className="text-[18px] font-medium text-[#1A1A1A] font-season">{session.sessionId}</h2>
            <span className="text-[11px] text-[#ACACAC]">· {HEALTH_LABEL[session.health]}</span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <QS label="Teacher" value={session.teacher.split(" ")[0]} />
            <QS label="Student" value={session.student.split(" ")[0]} />
            <QS label="Duration" value={`${session.durationMin}m`} />
            <QS label="Latency" value={`${session.latencyMs}ms`} />
          </div>
        </div>

        {/* Scrollable */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">

          {/* Telemetry */}
          <Section icon={<ChartLine size={14} />} title="Live Telemetry">
            {profile ? (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <TelemetryChart label="Teacher Bitrate" data={profile.teacherBitrate} unit="kbps" color="#1A1A1A" />
                  <TelemetryChart label="Student Bitrate" data={profile.studentBitrate} unit="kbps" color="#293763" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <TelemetryChart label="Teacher Pkt Loss" data={profile.teacherPacketLoss} unit="%" color="#ACACAC" />
                  <TelemetryChart label="Student Pkt Loss" data={profile.studentPacketLoss} unit="%" color="#E08A3C" />
                </div>
              </div>
            ) : <Skeleton rows={4} />}
          </Section>

          {/* Chat Logs */}
          <Section icon={<ChatText size={14} />} title="Session Chat Logs">
            {profile ? (
              <div className="space-y-0">
                {profile.chatMessages.map((m, i) => (
                  <div key={i} className={`flex items-start gap-3 py-2.5 ${i > 0 ? "border-t border-[#F8F8F8]" : ""}`}>
                    <span className={`text-[9px] font-medium uppercase tracking-wider px-1.5 py-[1px] rounded mt-0.5 shrink-0 ${
                      m.sender === "teacher" ? "bg-[#F0F0F0] text-[#1A1A1A]" : m.sender === "student" ? "bg-[#EFF6FF] text-[#3B6FC0]" : "bg-[#F5F5F5] text-[#ACACAC]"
                    }`}>{m.sender === "teacher" ? "T" : m.sender === "student" ? "S" : "SYS"}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-[#1A1A1A] leading-relaxed">{m.text}</p>
                      <p className="text-[10px] text-[#DCDCDC] mt-0.5">{m.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : <Skeleton rows={4} />}
          </Section>

          {/* Files */}
          <Section icon={<FileText size={14} />} title="Files Shared">
            {profile ? (
              profile.filesShared.length > 0 ? (
                <div className="space-y-2">
                  {profile.filesShared.map((f, i) => (
                    <div key={i} className="flex items-center justify-between py-2.5 px-3.5 rounded-xl bg-[#FAFAFA] border border-[#F5F5F5]">
                      <div className="flex items-center gap-2.5">
                        <FileText size={14} className="text-[#ACACAC]" />
                        <div>
                          <p className="text-[12px] text-[#1A1A1A]">{f.name}</p>
                          <p className="text-[10px] text-[#DCDCDC]">{f.type} · {f.size}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <p className="text-[12px] text-[#DCDCDC]">No files shared</p>
            ) : <Skeleton rows={2} />}
          </Section>

          {/* Actions */}
          <div className="px-8 py-6">
            <p className="text-[10px] font-medium text-[#DCDCDC] uppercase tracking-[0.12em] mb-3">Super Admin Actions</p>
            <div className="border border-[#F0F0F0] rounded-xl overflow-hidden divide-y divide-[#F5F5F5]">
              <ActionRow icon={<Eye size={13} />} label="Observe (Silent Mode)" sub="Connect to Osmium stream without notifying participants" />
              <ActionRow icon={<Megaphone size={13} />} label="Send System Alert" sub="Push toast notification to the room" />
              <ActionRow icon={<Prohibit size={13} />} label="Force Terminate" sub="Kill session — status set to 'Failed - Tech Issue'" danger onClick={() => setTerminateModal(true)} />
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal isOpen={terminateModal} onClose={() => setTerminateModal(false)} title="Force Terminate Session" description={`This will immediately kill session ${session.sessionId} and update the database status to "Failed - Tech Issue". Both participants will be disconnected.`} confirmString="TERMINATE-SESSION" onConfirm={() => { setTerminateModal(false); onClose(); }} variant="danger" />
    </>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (<div className="px-8 py-6 border-b border-[#F5F5F5]"><div className="flex items-center gap-2 mb-4"><span className="text-[#ACACAC]">{icon}</span><h4 className="text-[13px] font-medium text-[#1A1A1A] font-season">{title}</h4></div>{children}</div>);
}
function QS({ label, value }: { label: string; value: string }) {
  return (<div className="bg-white rounded-xl border border-[#F0F0F0] px-3 py-2.5 text-center"><p className="text-[10px] text-[#CACACA] mb-1">{label}</p><p className="text-[13px] font-normal text-[#1A1A1A] tracking-tight leading-none truncate">{value}</p></div>);
}
function Skeleton({ rows = 3 }: { rows?: number }) {
  return (<div className="space-y-3.5 animate-pulse">{[...Array(rows)].map((_, i) => <div key={i} className="flex items-center justify-between"><div className="h-3 bg-[#F5F5F5] rounded w-24" /><div className="h-3 bg-[#F5F5F5] rounded w-16" /></div>)}</div>);
}
function ActionRow({ icon, label, sub, danger, onClick }: { icon: React.ReactNode; label: string; sub: string; danger?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center justify-between px-4 py-3.5 border-none cursor-pointer transition-colors text-left group/action ${danger ? "bg-transparent hover:bg-[#FFF8F3]" : "bg-transparent hover:bg-[#FAFAFA]"}`}>
      <div className="flex items-center gap-3"><span className={danger ? "text-[#E08A3C]" : "text-[#999]"}>{icon}</span><div><p className={`text-[12px] font-normal leading-tight ${danger ? "text-[#E08A3C]" : "text-[#1A1A1A]"}`}>{label}</p><p className="text-[10px] text-[#DCDCDC] mt-0.5">{sub}</p></div></div>
      <CaretRight size={11} weight="bold" className="text-[#EBEBEB] group-hover/action:text-[#CACACA] transition-colors" />
    </button>
  );
}

export default memo(ClassDrawer);
