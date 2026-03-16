"use client";
import { useState, useEffect, memo } from "react";
import {
  X, Copy, Sparkle, Globe, Phone, Envelope, Tag, Brain,
  WhatsappLogo, UserPlus, CaretDown, ChatText, Robot, User as UserIcon,
} from "@phosphor-icons/react";
import { getLeadProfile } from "./leadMockData";
import type { Lead, LeadProfile, LeadScore, LeadSource } from "./leadTypes";

const SCORE_STYLE: Record<LeadScore, string> = {
  hot: "bg-[#FEF2F2] text-[#DC2626]",
  warm: "bg-[#FFF8F3] text-[#E08A3C]",
  cold: "bg-[#F0F0F0] text-[#999]",
};

const SOURCE_LABEL: Record<LeadSource, string> = {
  meta_ads: "Meta Ads", google: "Google", organic: "Organic", whatsapp: "WhatsApp", csv_import: "CSV Import", referral: "Referral",
};

const SENDER_STYLE: Record<string, { bg: string; label: string; icon: React.ReactNode }> = {
  bot: { bg: "bg-[#F7F7F7]", label: "Bot", icon: <Robot size={10} weight="fill" className="text-[#ACACAC]" /> },
  agent: { bg: "bg-[#EFF6FF]", label: "Agent", icon: <UserIcon size={10} weight="fill" className="text-[#3B6FC0]" /> },
  lead: { bg: "bg-white", label: "Lead", icon: null },
};

const WA_TEMPLATES = [
  "Send 10% Discount Code",
  "Free Trial Reminder",
  "Weekend Promo Blast",
  "Tutor Match Notification",
  "Follow-up: Demo Feedback",
];

const AGENTS = ["Arya Desai", "Bran Nair", "Brienne Joshi"];

interface Props { lead: Lead | null; onClose: () => void }

function LeadDrawer({ lead, onClose }: Props) {
  const [profile, setProfile] = useState<LeadProfile | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [waPopover, setWaPopover] = useState(false);
  const [agentPopover, setAgentPopover] = useState(false);

  useEffect(() => {
    if (lead) { setProfile(null); setWaPopover(false); setAgentPopover(false); const t = setTimeout(() => setProfile(getLeadProfile(lead.id)), 400); return () => clearTimeout(t); }
  }, [lead]);

  useEffect(() => {
    if (!lead) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [lead, onClose]);

  if (!lead) return null;

  const copyId = () => { navigator.clipboard.writeText(lead.id); setCopiedId(true); setTimeout(() => setCopiedId(false), 1500); };

  return (
    <>
      <div className="fixed inset-0 bg-black/15 backdrop-blur-[2px] z-40 animate-fadeIn" onClick={onClose} />

      <div className="fixed right-0 top-0 h-full w-[540px] max-w-[95vw] bg-white z-50 shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.08)] flex flex-col font-matter animate-slideIn">

        {/* ── Hero Header ── */}
        <div className="px-8 pt-7 pb-6 border-b border-[#F5F5F5] shrink-0 bg-[#FAFAFA]/50">
          <div className="flex items-center justify-between mb-6">
            <span className="text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.12em]">Lead Profile</span>
            <button onClick={onClose} className="w-7 h-7 rounded-lg bg-white border border-[#F0F0F0] flex items-center justify-center text-[#CACACA] hover:text-[#999] hover:border-[#DCDCDC] cursor-pointer transition-all"><X size={13} weight="bold" /></button>
          </div>

          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-2xl bg-[#F0F0F0] flex items-center justify-center shrink-0 ring-3 ring-white shadow-sm">
              <span className="text-[18px] font-medium text-[#1A1A1A]">{lead.name.split(" ").map((n) => n[0]).join("")}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-[18px] font-medium text-[#1A1A1A] font-season leading-tight truncate">{lead.name}</h2>
              <p className="text-[12px] text-[#ACACAC] mt-1 truncate">{lead.email}</p>
            </div>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex px-2.5 py-[3px] rounded-full text-[10.5px] font-medium capitalize ${SCORE_STYLE[lead.aiScore]}`}>{lead.aiScore} Lead</span>
            <span className="inline-flex px-2.5 py-[3px] rounded-full text-[10.5px] font-medium bg-[#F0F0F0] text-[#777]">{SOURCE_LABEL[lead.source]}</span>
            <button onClick={copyId} className="flex items-center gap-1 text-[10.5px] font-mono text-[#ACACAC] hover:text-[#1A1A1A] bg-[#F7F7F7] px-2.5 py-[3px] rounded-full border-none cursor-pointer transition-colors">
              {copiedId ? "Copied!" : lead.id} <Copy size={9} />
            </button>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-4 gap-3 mt-5">
            <QS icon={<Phone size={10} className="text-[#CACACA]" />} label="Phone" value={lead.phone.slice(-5)} />
            <QS icon={<Globe size={10} className="text-[#CACACA]" />} label="Source" value={lead.utm.medium} />
            <QS icon={<Tag size={10} className="text-[#CACACA]" />} label="Campaign" value={lead.utm.campaign === "—" ? "None" : lead.utm.campaign.replace(/_/g, " ").slice(0, 12)} />
            <QS icon={<UserIcon size={10} className="text-[#CACACA]" />} label="Agent" value={lead.assignedAgent === "Unassigned" ? "—" : lead.assignedAgent.split(" ")[0]} />
          </div>
        </div>

        {/* ── Scrollable Sections ── */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">

          {/* Section A: Identity & UTM */}
          <Section icon={<Globe size={14} />} title="Identity & UTM Context">
            {profile ? (
              <div className="space-y-3">
                <Row label="Full Name" value={lead.name} />
                <Row label="Phone" value={lead.phone} />
                <Row label="Email" value={lead.email} />
                <div className="pt-2 mt-2 border-t border-[#F8F8F8]">
                  <p className="text-[10px] font-medium text-[#DCDCDC] uppercase tracking-[0.1em] mb-2.5">Marketing Attribution</p>
                  <div className="grid grid-cols-3 gap-2.5">
                    <UTMTag label="Source" value={lead.utm.source} />
                    <UTMTag label="Medium" value={lead.utm.medium} />
                    <UTMTag label="Campaign" value={lead.utm.campaign} />
                  </div>
                </div>
              </div>
            ) : <Skeleton rows={5} />}
          </Section>

          {/* Section B: Osmium AI Summary */}
          <Section icon={<Brain size={14} />} title="Osmium AI Qualification">
            {profile ? (
              <div className="space-y-4">
                {/* AI output block with indigo left border */}
                <div className="border-l-2 border-[#293763] bg-[#FAFAFA] rounded-r-xl px-5 py-4 relative">
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <Sparkle size={11} weight="fill" className="text-[#293763]" />
                    <span className="text-[10px] font-medium text-[#293763] uppercase tracking-[0.08em]">Osmium LLM Output</span>
                  </div>
                  <p className="text-[12px] text-[#555] leading-relaxed">{profile.aiSummary}</p>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  <Metric label="Subject" value={profile.subject} />
                  <Metric label="Budget" value={profile.budget} />
                  <Metric label="Availability" value={profile.availability} />
                </div>
              </div>
            ) : <Skeleton rows={4} />}
          </Section>

          {/* Section C: Communication Hub */}
          <Section icon={<ChatText size={14} />} title="Communication Hub">
            {profile ? (
              <div className="space-y-0">
                {profile.chatHistory.map((msg, i) => {
                  const s = SENDER_STYLE[msg.sender];
                  const isLead = msg.sender === "lead";
                  return (
                    <div key={i} className={`flex ${isLead ? "justify-end" : "justify-start"} ${i > 0 ? "mt-2" : ""}`}>
                      <div className={`max-w-[85%] rounded-xl px-4 py-3 ${isLead ? "bg-[#F0F0F0]" : s.bg} ${isLead ? "" : "border border-[#F5F5F5]"}`}>
                        {!isLead && (
                          <div className="flex items-center gap-1.5 mb-1.5">
                            {s.icon}
                            <span className="text-[9px] font-medium text-[#ACACAC] uppercase tracking-wider">{s.label}</span>
                            {msg.channel === "whatsapp" && <WhatsappLogo size={9} weight="fill" className="text-[#25D366] ml-0.5" />}
                          </div>
                        )}
                        <p className="text-[12px] text-[#1A1A1A] leading-relaxed">{msg.text}</p>
                        <p className={`text-[9px] mt-1.5 ${isLead ? "text-[#ACACAC] text-right" : "text-[#DCDCDC]"}`}>
                          {msg.time}
                          {isLead && msg.channel === "whatsapp" && <WhatsappLogo size={8} weight="fill" className="text-[#25D366] inline ml-1" />}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : <Skeleton rows={6} />}
          </Section>
        </div>

        {/* ── Sticky Action Bar ── */}
        <div className="px-8 py-4 border-t border-[#F0F0F0] bg-white shrink-0 flex items-center gap-3">
          {/* WhatsApp Campaign */}
          <div className="relative">
            <button onClick={() => { setWaPopover(!waPopover); setAgentPopover(false); }} className="flex items-center gap-1.5 px-3.5 py-2.5 text-[12px] font-medium text-[#1A1A1A] bg-white border border-[#F0F0F0] rounded-lg hover:border-[#DCDCDC] transition-all cursor-pointer">
              <WhatsappLogo size={13} weight="fill" className="text-[#25D366]" /> WhatsApp <CaretDown size={9} weight="bold" className="text-[#CACACA] ml-0.5" />
            </button>
            {waPopover && (
              <div className="absolute bottom-full mb-2 left-0 bg-white border border-[#F0F0F0] rounded-xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)] py-1 z-20 min-w-[240px] animate-contextIn">
                <p className="px-4 py-2 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Select Template</p>
                {WA_TEMPLATES.map((t) => (
                  <button key={t} onClick={() => setWaPopover(false)} className="w-full text-left px-4 py-2 text-[12px] text-[#666] hover:bg-[#FAFAFA] bg-transparent border-none cursor-pointer transition-colors">{t}</button>
                ))}
              </div>
            )}
          </div>

          {/* Assign Agent */}
          <div className="relative">
            <button onClick={() => { setAgentPopover(!agentPopover); setWaPopover(false); }} className="flex items-center gap-1.5 px-3.5 py-2.5 text-[12px] font-medium text-[#1A1A1A] bg-white border border-[#F0F0F0] rounded-lg hover:border-[#DCDCDC] transition-all cursor-pointer">
              <UserIcon size={13} /> Assign <CaretDown size={9} weight="bold" className="text-[#CACACA] ml-0.5" />
            </button>
            {agentPopover && (
              <div className="absolute bottom-full mb-2 left-0 bg-white border border-[#F0F0F0] rounded-xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)] py-1 z-20 min-w-[180px] animate-contextIn">
                <p className="px-4 py-2 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Assign To</p>
                {AGENTS.map((a) => (
                  <button key={a} onClick={() => setAgentPopover(false)} className={`w-full text-left px-4 py-2 text-[12px] hover:bg-[#FAFAFA] bg-transparent border-none cursor-pointer transition-colors ${a === lead.assignedAgent ? "text-[#293763] font-medium" : "text-[#666]"}`}>{a}</button>
                ))}
              </div>
            )}
          </div>

          {/* Convert — pushed to right */}
          <button onClick={onClose} className="flex items-center gap-1.5 px-5 py-2.5 text-[12px] font-medium text-white bg-[#293763] rounded-lg hover:bg-[#1E2A4A] transition-all cursor-pointer border-none active:scale-95 ml-auto">
            <UserPlus size={13} weight="bold" /> Convert to Student
          </button>
        </div>
      </div>
    </>
  );
}

/* ── Sub-components ── */

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (<div className="px-8 py-6 border-b border-[#F5F5F5]"><div className="flex items-center gap-2 mb-4"><span className="text-[#ACACAC]">{icon}</span><h4 className="text-[13px] font-medium text-[#1A1A1A] font-season">{title}</h4></div>{children}</div>);
}

function Row({ label, value }: { label: string; value: string }) {
  return (<div className="flex items-center justify-between"><span className="text-[12px] text-[#999]">{label}</span><span className="text-[12px] text-[#1A1A1A]">{value}</span></div>);
}

function QS({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (<div className="bg-white rounded-xl border border-[#F0F0F0] px-3 py-2.5 text-center"><div className="flex items-center justify-center gap-1 mb-1">{icon}<span className="text-[10px] text-[#CACACA]">{label}</span></div><p className="text-[12px] font-normal text-[#1A1A1A] tracking-tight leading-none truncate">{value}</p></div>);
}

function UTMTag({ label, value }: { label: string; value: string }) {
  return (<div className="bg-[#FAFAFA] rounded-lg px-3 py-2"><p className="text-[9px] text-[#DCDCDC] uppercase tracking-wider mb-1">{label}</p><p className="text-[11px] font-mono text-[#1A1A1A] truncate">{value}</p></div>);
}

function Metric({ label, value }: { label: string; value: string }) {
  return (<div className="bg-[#FAFAFA] rounded-xl px-3.5 py-3"><p className="text-[10px] text-[#CACACA] mb-1.5">{label}</p><p className="text-[13px] font-normal text-[#1A1A1A] tracking-tight leading-none">{value}</p></div>);
}

function Skeleton({ rows = 3 }: { rows?: number }) {
  return (<div className="space-y-3.5 animate-pulse">{[...Array(rows)].map((_, i) => <div key={i} className="flex items-center justify-between"><div className="h-3 bg-[#F5F5F5] rounded w-24" /><div className="h-3 bg-[#F5F5F5] rounded w-16" /></div>)}</div>);
}

export default memo(LeadDrawer);
