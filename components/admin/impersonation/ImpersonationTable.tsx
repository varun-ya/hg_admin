"use client";
import { useState, memo } from "react";
import { Eye, Prohibit, MagnifyingGlass, CaretRight, X, Warning } from "@phosphor-icons/react";
import { impersonationSessions, impersonationLogs } from "./impersonationMockData";
import type { ImpersonationSession } from "./impersonationTypes";

function ImpersonationTable() {
  const [selected, setSelected] = useState<ImpersonationSession | null>(null);
  const [showLoginAs, setShowLoginAs] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [reason, setReason] = useState("");
  const [ticketId, setTicketId] = useState("");

  return (
    <>
      {/* Active Impersonation Banner */}
      {impersonationSessions.some((s) => !s.endedAt) && (
        <div className="bg-[#FFF8F3] border border-[#F5E6D8] rounded-2xl px-6 py-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Warning size={16} weight="fill" className="text-[#E08A3C]" />
            <div>
              <p className="text-[13px] font-medium text-[#1A1A1A]">Active impersonation session</p>
              <p className="text-[11px] text-[#999] mt-0.5">
                admin@homeguru.in → Rohan Mehta (STU-8842) · Started 10:42 AM
              </p>
            </div>
          </div>
          <button className="px-3 py-1.5 bg-[#E08A3C] text-white rounded-lg text-[11px] font-medium border-none cursor-pointer hover:bg-[#D07A2C] transition-colors">
            End Session
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5">
          <div className="flex items-center gap-2.5">
            <Eye size={17} weight="regular" className="text-[#999]" />
            <h3 className="text-[15px] font-medium text-[#1A1A1A]">Impersonation Sessions</h3>
          </div>
          <button
            onClick={() => setShowLoginAs(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#1A1A1A] text-white rounded-full text-[12px] font-medium hover:bg-[#333] transition-all cursor-pointer border-none"
          >
            <Eye size={12} weight="bold" /> Login As User
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-t border-[#F5F5F5]">
                {["Admin", "Target User", "Type", "Reason / Ticket", "Started", "Duration", "Actions", ""].map((h) => (
                  <th key={h} className="py-3 px-4 first:pl-7 last:pr-7 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {impersonationSessions.map((s, i) => (
                <tr
                  key={s.id}
                  className={`hover:bg-[#FAFAFA] transition-colors cursor-pointer ${i > 0 ? "border-t border-[#F8F8F8]" : ""}`}
                  onClick={() => setSelected(s)}
                >
                  <td className="py-4 px-4 pl-7 text-[12px] text-[#666]">{s.adminEmail}</td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span className="text-[12px] text-[#1A1A1A]">{s.targetUserName}</span>
                      <span className="text-[10px] text-[#CACACA] font-mono">{s.targetUserId}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`text-[10px] font-medium px-2 py-[2px] rounded-full ${
                      s.targetType === "student" ? "bg-[#F0F0F0] text-[#666]" : "bg-[#EEF2FF] text-[#4F46E5]"
                    }`}>
                      {s.targetType}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span className="text-[12px] text-[#666] truncate max-w-[180px]">{s.reason}</span>
                      <span className="text-[10px] text-[#CACACA] font-mono">{s.ticketId}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-[12px] text-[#ACACAC]">{s.startedAt}</td>
                  <td className="py-4 px-4 text-[12px] text-[#ACACAC]">
                    {s.endedAt ? "Ended" : (
                      <span className="flex items-center gap-1.5 text-[#E08A3C]">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E08A3C] opacity-50" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#E08A3C]" />
                        </span>
                        Active
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-[12px] text-[#ACACAC]">{s.actionsPerformed}</td>
                  <td className="py-4 px-4 pr-7">
                    {s.blockedActions.length > 0 && (
                      <span className="flex items-center gap-1 text-[10px] text-[#E08A3C]">
                        <Prohibit size={10} /> {s.blockedActions.length} blocked
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Login As Modal */}
      {showLoginAs && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/15 backdrop-blur-[2px]" onClick={() => setShowLoginAs(false)} />
          <div className="relative bg-white rounded-2xl w-[480px] max-w-[95vw] overflow-hidden border border-[#F0F0F0]">
            <div className="px-7 py-5 flex items-center justify-between border-b border-[#F5F5F5]">
              <h3 className="text-[15px] font-medium text-[#1A1A1A]">Login As User</h3>
              <button onClick={() => setShowLoginAs(false)} className="text-[#CACACA] hover:text-[#999] bg-transparent border-none cursor-pointer">
                <X size={16} weight="bold" />
              </button>
            </div>
            <div className="px-7 py-5 space-y-4">
              <div>
                <label className="text-[11px] font-medium text-[#999] uppercase tracking-wider block mb-1.5">Search User</label>
                <div className="relative">
                  <MagnifyingGlass size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#CACACA]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Name, email, or Aegis ID..."
                    className="w-full h-[38px] pl-9 pr-3 border border-[#EBEBEB] rounded-lg text-[13px] focus:outline-none focus:border-[#1A1A1A] transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-medium text-[#999] uppercase tracking-wider block mb-1.5">Reason for Impersonation *</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Describe why you need to view this user's account..."
                  className="w-full h-[72px] px-3 py-2 border border-[#EBEBEB] rounded-lg text-[13px] focus:outline-none focus:border-[#1A1A1A] transition-all resize-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-[#999] uppercase tracking-wider block mb-1.5">Support Ticket ID *</label>
                <input
                  type="text"
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
                  placeholder="TKT-XXXX"
                  className="w-full h-[38px] px-3 border border-[#EBEBEB] rounded-lg text-[13px] font-mono focus:outline-none focus:border-[#1A1A1A] transition-all"
                />
              </div>
              <div className="bg-[#FFF8F3] rounded-xl px-4 py-3 flex items-start gap-2.5">
                <Warning size={14} weight="fill" className="text-[#E08A3C] shrink-0 mt-0.5" />
                <div className="text-[11px] text-[#999] leading-relaxed">
                  <strong className="text-[#1A1A1A]">Safety guardrails active.</strong> Modifying 2FA, bank details, or deleting accounts is blocked during impersonation. All actions are logged with your Admin ID.
                </div>
              </div>
            </div>
            <div className="px-7 py-4 border-t border-[#F5F5F5] flex justify-end gap-3">
              <button onClick={() => setShowLoginAs(false)} className="px-4 py-2 text-[13px] text-[#777] bg-white border border-[#EBEBEB] rounded-lg hover:bg-[#FAFAFA] cursor-pointer">Cancel</button>
              <button
                disabled={!reason || !ticketId}
                className={`px-4 py-2 text-[13px] font-medium rounded-lg border-none cursor-pointer transition-all ${
                  reason && ticketId ? "bg-[#1A1A1A] text-white hover:bg-[#333]" : "bg-[#F0F0F0] text-[#CACACA] cursor-not-allowed"
                }`}
              >
                Start Impersonation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Session Detail Drawer */}
      {selected && (
        <>
          <div className="fixed inset-0 bg-black/15 backdrop-blur-[2px] z-40" onClick={() => setSelected(null)} />
          <div className="fixed right-0 top-0 h-full w-[440px] max-w-[95vw] bg-white z-50 shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.08)] flex flex-col">
            <div className="px-7 pt-6 pb-5 border-b border-[#F5F5F5] shrink-0">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.12em]">Session Detail</span>
                <button onClick={() => setSelected(null)} className="w-7 h-7 rounded-lg bg-white border border-[#F0F0F0] flex items-center justify-center text-[#CACACA] hover:text-[#999] cursor-pointer">
                  <X size={13} weight="bold" />
                </button>
              </div>
              <h2 className="text-[16px] font-medium text-[#1A1A1A]">{selected.targetUserName}</h2>
              <p className="text-[12px] text-[#ACACAC] mt-1">{selected.targetUserEmail} · {selected.targetUserId}</p>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar px-7 py-5 space-y-5">
              <div className="space-y-3">
                <DetailRow label="Admin" value={selected.adminEmail} />
                <DetailRow label="Reason" value={selected.reason} />
                <DetailRow label="Ticket" value={selected.ticketId} />
                <DetailRow label="Started" value={selected.startedAt} />
                <DetailRow label="Ended" value={selected.endedAt || "Active"} />
                <DetailRow label="Actions" value={String(selected.actionsPerformed)} />
              </div>
              {selected.blockedActions.length > 0 && (
                <div>
                  <p className="text-[10px] font-medium text-[#DCDCDC] uppercase tracking-[0.1em] mb-2">Blocked Actions</p>
                  {selected.blockedActions.map((a) => (
                    <div key={a} className="flex items-center gap-2 py-1.5 text-[12px] text-[#E08A3C]">
                      <Prohibit size={11} /> {a}
                    </div>
                  ))}
                </div>
              )}
              <div>
                <p className="text-[10px] font-medium text-[#DCDCDC] uppercase tracking-[0.1em] mb-2">Action Log</p>
                {impersonationLogs.filter((l) => l.sessionId === selected.id).map((l) => (
                  <div key={l.id} className={`flex items-center justify-between py-2.5 border-t border-[#F8F8F8] first:border-none`}>
                    <div className="flex items-center gap-2">
                      {l.blocked && <Prohibit size={10} className="text-[#E08A3C]" />}
                      <span className={`text-[12px] ${l.blocked ? "text-[#E08A3C] line-through" : "text-[#666]"}`}>{l.action}</span>
                    </div>
                    <span className="text-[10px] text-[#CACACA]">{l.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12px] text-[#999]">{label}</span>
      <span className="text-[12px] text-[#1A1A1A]">{value}</span>
    </div>
  );
}

export default memo(ImpersonationTable);
