"use client";
import { useState, memo } from "react";
import { Warning, ChatCircle, Star, WhatsappLogo, Envelope, CaretRight, X, CheckCircle } from "@phosphor-icons/react";
import { atRiskUsers, sentimentFlags } from "./churnMockData";
import type { AtRiskUser } from "./churnMockData";

function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-[300] flex items-center gap-3 bg-[#1A1A1A] text-white px-4 py-3 rounded-xl shadow-lg animate-fadeIn">
      <CheckCircle size={14} weight="fill" className="text-[#E08A3C] shrink-0" />
      <span className="text-[13px]">{msg}</span>
      <button onClick={onClose} className="ml-2 text-white/50 hover:text-white bg-transparent border-none cursor-pointer"><X size={12} weight="bold" /></button>
    </div>
  );
}

const RISK_STYLE: Record<string, { dot: string; bg: string; text: string }> = {
  critical: { dot: "bg-[#C2571A]", bg: "bg-[#FFF1E6]", text: "text-[#C2571A]" },
  high: { dot: "bg-[#E08A3C]", bg: "bg-[#FFF8F3]", text: "text-[#E08A3C]" },
  medium: { dot: "bg-[#D4956A]", bg: "bg-[#FFF7ED]", text: "text-[#9A3412]" },
  low: { dot: "bg-[#DCDCDC]", bg: "bg-[#F0F0F0]", text: "text-[#666]" },
};

function ChurnDashboard() {
  const [users, setUsers] = useState(atRiskUsers);
  const [flags, setFlags] = useState(sentimentFlags);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const sendNudge = (u: AtRiskUser) => {
    setUsers((prev) => prev.map((x) => x.id === u.id ? { ...x, nudgeSent: true } : x));
    showToast(`${u.nudgeChannel} nudge sent to ${u.name}`);
  };

  const sendBulkNudge = () => {
    const unsent = users.filter((u) => !u.nudgeSent);
    setUsers((prev) => prev.map((u) => ({ ...u, nudgeSent: true })));
    showToast(`Bulk nudge sent to ${unsent.length} at-risk users`);
  };

  const resolveFlag = (id: string, name: string) => {
    setFlags((prev) => prev.map((f) => f.id === id ? { ...f, resolved: true } : f));
    showToast(`Follow-up initiated for ${name}`);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* At-Risk Users */}
      <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
        <div className="flex items-center justify-between px-7 py-5">
          <div className="flex items-center gap-2.5">
            <Warning size={17} weight="regular" className="text-[#E08A3C]" />
            <h3 className="text-[15px] font-medium text-[#1A1A1A]">At-Risk Users — Churn Prediction</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#CACACA]">Threshold: 70%</span>
            <button onClick={sendBulkNudge} className="px-3 py-1.5 bg-white border border-[#EBEBEB] rounded-lg text-[11px] font-medium text-[#666] hover:bg-[#FAFAFA] cursor-pointer">
              Send Bulk Nudge
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-t border-[#F5F5F5]">
                {["User", "Type", "Engagement", "Risk", "Last Active", "Risk Factors", "Nudge", ""].map((h) => (
                  <th key={h} className="py-3 px-4 first:pl-7 last:pr-7 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => {
                const rs = RISK_STYLE[u.riskLevel];
                return (
                  <tr key={u.id} className={`hover:bg-[#FAFAFA] transition-colors cursor-pointer ${i > 0 ? "border-t border-[#F8F8F8]" : ""}`}>
                    <td className="py-4 px-4 pl-7">
                      <div className="flex items-center gap-3">
                        <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full border border-[#F0F0F0]" />
                        <div className="flex flex-col">
                          <span className="text-[12px] text-[#1A1A1A]">{u.name}</span>
                          <span className="text-[10px] text-[#CACACA] font-mono">{u.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-[10px] font-medium px-2 py-[2px] rounded-full ${u.type === "student" ? "bg-[#F0F0F0] text-[#666]" : "bg-[#FFF7ED] text-[#E08A3C]"}`}>
                        {u.type}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-[40px] h-[4px] bg-[#F0F0F0] rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${u.engagementScore < 40 ? "bg-[#C2571A]" : u.engagementScore < 60 ? "bg-[#E08A3C]" : "bg-[#1A1A1A]"}`} style={{ width: `${u.engagementScore}%` }} />
                        </div>
                        <span className="text-[11px] text-[#666] tabular-nums">{u.engagementScore}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-[10px] font-medium px-2 py-[2px] rounded-full ${rs.bg} ${rs.text}`}>{u.riskLevel}</span>
                    </td>
                    <td className="py-4 px-4 text-[12px] text-[#ACACAC]">{u.lastActive}</td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-0.5">
                        {u.riskFactors.slice(0, 2).map((f, fi) => (
                          <span key={fi} className="text-[10px] text-[#999] truncate max-w-[180px]">• {f}</span>
                        ))}
                        {u.riskFactors.length > 2 && <span className="text-[10px] text-[#CACACA]">+{u.riskFactors.length - 2} more</span>}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {u.nudgeSent ? (
                        <span className="flex items-center gap-1 text-[10px] text-[#E08A3C]">
                          {u.nudgeChannel === "WhatsApp" ? <WhatsappLogo size={11} /> : <Envelope size={11} />}
                          Sent
                        </span>
                      ) : (
                        <button onClick={(e) => { e.stopPropagation(); sendNudge(u); }} className="text-[10px] font-medium text-[#1A1A1A] hover:text-[#E08A3C] bg-transparent border-none cursor-pointer">
                          Send →
                        </button>
                      )}
                    </td>
                    <td className="py-4 px-4 pr-7"><CaretRight size={12} className="text-[#DCDCDC]" /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sentiment Mining */}
      <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
        <div className="flex items-center justify-between px-7 py-5">
          <div className="flex items-center gap-2.5">
            <ChatCircle size={15} weight="regular" className="text-[#999]" />
            <h3 className="text-[15px] font-medium text-[#1A1A1A]">Sentiment Mining — Flagged Reviews</h3>
          </div>
          <span className="text-[11px] text-[#ACACAC]">{flags.filter((s) => !s.resolved).length} unresolved</span>
        </div>
        {flags.map((s, i) => (
          <div key={s.id} className={`px-7 py-4 hover:bg-[#FAFAFA] transition-colors ${i > 0 ? "border-t border-[#F5F5F5]" : "border-t border-[#F5F5F5]"}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[13px] text-[#1A1A1A]">{s.userName}</span>
                  <span className={`text-[10px] font-medium px-2 py-[2px] rounded-full ${s.sentiment === "negative" ? "bg-[#FFF1E6] text-[#C2571A]" : "bg-[#FFF7ED] text-[#9A3412]"}`}>
                    {s.sentiment}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, si) => (
                      <Star key={si} size={10} weight={si < s.rating ? "fill" : "regular"} className={si < s.rating ? "text-[#D4956A]" : "text-[#DCDCDC]"} />
                    ))}
                  </div>
                  {s.resolved && <span className="text-[10px] text-[#E08A3C]">Resolved</span>}
                </div>
                <p className="text-[12px] text-[#666] leading-relaxed">&ldquo;{s.reviewSnippet}&rdquo;</p>
                <span className="text-[10px] text-[#CACACA] mt-1 block">{s.flaggedAt}</span>
              </div>
              {!s.resolved && (
                <button onClick={() => resolveFlag(s.id, s.userName)} className="text-[11px] font-medium text-[#1A1A1A] hover:text-[#E08A3C] bg-transparent border-none cursor-pointer shrink-0 flex items-center gap-0.5">
                  Follow up <CaretRight size={10} weight="bold" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

export default memo(ChurnDashboard);
