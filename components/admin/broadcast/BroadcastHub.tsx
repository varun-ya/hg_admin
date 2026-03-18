"use client";
import { memo } from "react";
import { Megaphone, Envelope, DeviceMobile, Bell, WhatsappLogo, CaretRight, Warning } from "@phosphor-icons/react";
import { broadcastTemplates, broadcastLogs } from "./broadcastMockData";
import type { BroadcastChannel } from "./broadcastMockData";

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

function BroadcastHub() {
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
            <button className="px-3 py-1.5 bg-white border border-[#EBEBEB] rounded-lg text-[11px] font-medium text-[#666] hover:bg-[#FAFAFA] cursor-pointer">
              + New Template
            </button>
            <button className="px-4 py-2 bg-[#1A1A1A] text-white rounded-full text-[12px] font-medium hover:bg-[#333] transition-all cursor-pointer border-none">
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
    </div>
  );
}

export default memo(BroadcastHub);
