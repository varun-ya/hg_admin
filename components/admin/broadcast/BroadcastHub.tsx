"use client";
import { useState, memo } from "react";
import { Megaphone, Envelope, DeviceMobile, Bell, WhatsappLogo, CaretRight, Warning, X, CheckCircle } from "@phosphor-icons/react";
import { broadcastTemplates, broadcastLogs } from "./broadcastMockData";
import type { BroadcastChannel, BroadcastTemplate } from "./broadcastMockData";

const CHANNEL_ICON: Record<BroadcastChannel, React.ReactNode> = {
  email: <Envelope size={10} />,
  sms: <DeviceMobile size={10} />,
  push: <Bell size={10} />,
  whatsapp: <WhatsappLogo size={10} />,
};

const CATEGORY_STYLE: Record<string, string> = {
  emergency: "bg-[#FEE2E2] text-[#DC2626]",
  marketing: "bg-[#EEF2FF] text-[#4F46E5]",
  transactional: "bg-[#F0F0F0] text-[#1A1A1A]",
  system: "bg-[#FEF3C7] text-[#92400E]",
};

function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-[300] flex items-center gap-3 bg-[#1A1A1A] text-white px-4 py-3 rounded-xl shadow-lg animate-fadeIn">
      <CheckCircle size={14} weight="fill" className="text-[#22C55E] shrink-0" />
      <span className="text-[13px]">{msg}</span>
      <button onClick={onClose} className="ml-2 text-white/50 hover:text-white bg-transparent border-none cursor-pointer"><X size={12} weight="bold" /></button>
    </div>
  );
}

const CHANNELS: BroadcastChannel[] = ["email", "sms", "push", "whatsapp"];
const CATEGORIES = ["emergency", "marketing", "transactional", "system"] as const;

function NewTemplateModal({ onClose, onSave }: { onClose: () => void; onSave: (name: string) => void }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<string>("transactional");
  const [channels, setChannels] = useState<BroadcastChannel[]>(["email"]);
  const toggleChannel = (c: BroadcastChannel) =>
    setChannels((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/15 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-[460px] max-w-[95vw] border border-[#F0F0F0] overflow-hidden">
        <div className="px-7 py-5 flex items-center justify-between border-b border-[#F5F5F5]">
          <h3 className="text-[15px] font-medium text-[#1A1A1A]">New Template</h3>
          <button onClick={onClose} className="text-[#CACACA] hover:text-[#999] bg-transparent border-none cursor-pointer"><X size={16} weight="bold" /></button>
        </div>
        <div className="px-7 py-5 space-y-4">
          <div>
            <label className="text-[11px] font-medium text-[#999] uppercase tracking-wider block mb-1.5">Template Name *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Session Reminder" className="w-full h-[38px] px-3 border border-[#EBEBEB] rounded-lg text-[13px] focus:outline-none focus:border-[#1A1A1A] transition-all" />
          </div>
          <div>
            <label className="text-[11px] font-medium text-[#999] uppercase tracking-wider block mb-1.5">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full h-[38px] px-3 border border-[#EBEBEB] rounded-lg text-[13px] bg-white focus:outline-none focus:border-[#1A1A1A] transition-all">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-medium text-[#999] uppercase tracking-wider block mb-2">Channels</label>
            <div className="flex items-center gap-2">
              {CHANNELS.map((c) => (
                <button key={c} onClick={() => toggleChannel(c)} className={`px-3 py-1.5 rounded-lg text-[11px] font-medium border cursor-pointer transition-all ${
                  channels.includes(c) ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" : "bg-white text-[#666] border-[#EBEBEB] hover:border-[#DCDCDC]"
                }`}>{c}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="px-7 pb-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-[13px] text-[#777] bg-white border border-[#EBEBEB] rounded-lg hover:bg-[#FAFAFA] cursor-pointer">Cancel</button>
          <button disabled={!name || channels.length === 0} onClick={() => { onSave(name); onClose(); }} className={`px-4 py-2 text-[13px] font-medium rounded-lg border-none cursor-pointer transition-all ${
            name && channels.length > 0 ? "bg-[#1A1A1A] text-white hover:bg-[#333]" : "bg-[#F0F0F0] text-[#CACACA] cursor-not-allowed"
          }`}>Create Template</button>
        </div>
      </div>
    </div>
  );
}

function ComposeModal({ templates, onClose, onSend }: { templates: BroadcastTemplate[]; onClose: () => void; onSend: (t: string) => void }) {
  const [templateId, setTemplateId] = useState(templates[0]?.id || "");
  const [audience, setAudience] = useState("All Active Students");
  const [channel, setChannel] = useState<BroadcastChannel>("email");
  const selected = templates.find((t) => t.id === templateId);
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/15 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-[500px] max-w-[95vw] border border-[#F0F0F0] overflow-hidden">
        <div className="px-7 py-5 flex items-center justify-between border-b border-[#F5F5F5]">
          <h3 className="text-[15px] font-medium text-[#1A1A1A]">Compose Broadcast</h3>
          <button onClick={onClose} className="text-[#CACACA] hover:text-[#999] bg-transparent border-none cursor-pointer"><X size={16} weight="bold" /></button>
        </div>
        <div className="px-7 py-5 space-y-4">
          <div>
            <label className="text-[11px] font-medium text-[#999] uppercase tracking-wider block mb-1.5">Template</label>
            <select value={templateId} onChange={(e) => setTemplateId(e.target.value)} className="w-full h-[38px] px-3 border border-[#EBEBEB] rounded-lg text-[13px] bg-white focus:outline-none focus:border-[#1A1A1A] transition-all">
              {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-medium text-[#999] uppercase tracking-wider block mb-1.5">Audience Segment</label>
            <select value={audience} onChange={(e) => setAudience(e.target.value)} className="w-full h-[38px] px-3 border border-[#EBEBEB] rounded-lg text-[13px] bg-white focus:outline-none focus:border-[#1A1A1A] transition-all">
              {["All Active Students", "All Verified Teachers", "At-Risk Users", "Trial Users", "India Region", "UAE Region"].map((a) => <option key={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-medium text-[#999] uppercase tracking-wider block mb-2">Channel</label>
            <div className="flex items-center gap-2">
              {(selected?.channels || CHANNELS).map((c) => (
                <button key={c} onClick={() => setChannel(c as BroadcastChannel)} className={`px-3 py-1.5 rounded-lg text-[11px] font-medium border cursor-pointer transition-all ${
                  channel === c ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" : "bg-white text-[#666] border-[#EBEBEB] hover:border-[#DCDCDC]"
                }`}>{c}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="px-7 pb-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-[13px] text-[#777] bg-white border border-[#EBEBEB] rounded-lg hover:bg-[#FAFAFA] cursor-pointer">Cancel</button>
          <button onClick={() => { onSend(selected?.name || ""); onClose(); }} className="px-4 py-2 text-[13px] font-medium bg-[#1A1A1A] text-white rounded-lg border-none cursor-pointer hover:bg-[#333] transition-all">Send Broadcast</button>
        </div>
      </div>
    </div>
  );
}

function BroadcastHub() {
  const [templates, setTemplates] = useState(broadcastTemplates);
  const [showNewTemplate, setShowNewTemplate] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  return (
    <div className="flex flex-col gap-6">
      {/* Templates */}
      <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
        <div className="flex items-center justify-between px-7 py-5">
          <div className="flex items-center gap-2.5">
            <Megaphone size={17} weight="regular" className="text-[#999]" />
            <h3 className="text-[15px] font-medium text-[#1A1A1A]">Broadcast Templates</h3>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowNewTemplate(true)} className="px-3 py-1.5 bg-white border border-[#EBEBEB] rounded-lg text-[11px] font-medium text-[#666] hover:bg-[#FAFAFA] cursor-pointer">
              + New Template
            </button>
            <button onClick={() => setShowCompose(true)} className="px-4 py-2 bg-[#1A1A1A] text-white rounded-full text-[12px] font-medium hover:bg-[#333] transition-all cursor-pointer border-none">
              Compose Broadcast
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-t border-[#F5F5F5]">
                {["Template", "Category", "Channels", "Merge Fields", "Last Used", ""].map((h) => (
                  <th key={h} className="py-3 px-4 first:pl-7 last:pr-7 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {broadcastTemplates.map((t, i) => (
                <tr key={t.id} className={`hover:bg-[#FAFAFA] transition-colors cursor-pointer ${i > 0 ? "border-t border-[#F8F8F8]" : ""}`}>
                  <td className="py-4 px-4 pl-7">
                    <div className="flex items-center gap-2">
                      {t.category === "emergency" && <Warning size={12} className="text-[#DC2626]" />}
                      <span className="text-[13px] text-[#1A1A1A]">{t.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`text-[10px] font-medium px-2 py-[2px] rounded-full ${CATEGORY_STYLE[t.category]}`}>{t.category}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5">
                      {t.channels.map((c) => (
                        <span key={c} className="w-5 h-5 rounded bg-[#F7F7F7] flex items-center justify-center text-[#999]" title={c}>
                          {CHANNEL_ICON[c]}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {t.mergeFields.slice(0, 2).map((f) => (
                        <span key={f} className="text-[9px] font-mono text-[#999] bg-[#F7F7F7] px-1.5 py-[1px] rounded">{f}</span>
                      ))}
                      {t.mergeFields.length > 2 && <span className="text-[9px] text-[#CACACA]">+{t.mergeFields.length - 2}</span>}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-[12px] text-[#ACACAC]">{t.lastUsed || "Never"}</td>
                  <td className="py-4 px-4 pr-7"><CaretRight size={12} className="text-[#DCDCDC]" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Broadcast Log */}
      <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
        <div className="flex items-center justify-between px-7 py-5">
          <h3 className="text-[15px] font-medium text-[#1A1A1A]">Recent Broadcasts</h3>
          <span className="text-[11px] text-[#ACACAC]">Last 7 days</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-t border-[#F5F5F5]">
                {["Template", "Channel", "Audience", "Delivered", "Status", "Sent By", "Time"].map((h) => (
                  <th key={h} className="py-3 px-4 first:pl-7 last:pr-7 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {broadcastLogs.map((b, i) => (
                <tr key={b.id} className={`hover:bg-[#FAFAFA] transition-colors ${i > 0 ? "border-t border-[#F8F8F8]" : ""}`}>
                  <td className="py-4 px-4 pl-7 text-[13px] text-[#1A1A1A]">{b.templateName}</td>
                  <td className="py-4 px-4">
                    <span className="flex items-center gap-1 text-[11px] text-[#666]">
                      {CHANNEL_ICON[b.channel]} {b.channel}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-[12px] text-[#666] max-w-[180px] truncate">{b.audience}</td>
                  <td className="py-4 px-4 text-[12px] text-[#1A1A1A] tabular-nums">
                    {b.deliveredCount.toLocaleString()} / {b.recipientCount.toLocaleString()}
                  </td>
                  <td className="py-4 px-4">
                    <span className="flex items-center gap-1.5 text-[11px] text-[#666]">
                      <span className={`w-[5px] h-[5px] rounded-full ${b.status === "sent" ? "bg-[#22C55E]" : b.status === "failed" ? "bg-[#EF4444]" : "bg-[#F59E0B]"}`} />
                      {b.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-[12px] text-[#ACACAC]">{b.sentBy}</td>
                  <td className="py-4 px-4 pr-7 text-[12px] text-[#ACACAC]">{b.sentAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showNewTemplate && (
        <NewTemplateModal
          onClose={() => setShowNewTemplate(false)}
          onSave={(name) => {
            setTemplates((prev) => [{ id: `tpl-${Date.now()}`, name, category: "transactional", channels: ["email"], mergeFields: ["{{first_name}}"], lastUsed: null, createdBy: "admin@homeguru.in" }, ...prev]);
            showToast(`Template "${name}" created`);
          }}
        />
      )}
      {showCompose && (
        <ComposeModal
          templates={templates}
          onClose={() => setShowCompose(false)}
          onSend={(name) => showToast(`Broadcast "${name}" queued for delivery`)}
        />
      )}
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

export default memo(BroadcastHub);
