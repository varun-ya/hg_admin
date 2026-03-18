"use client";
import { memo } from "react";
import { Warning, ChatCircle, Star, WhatsappLogo, Envelope, CaretRight } from "@phosphor-icons/react";
import { atRiskUsers, sentimentFlags } from "./churnMockData";

const RISK_STYLE: Record<string, { dot: string; bg: string; text: string }> = {
  critical: { dot: "bg-[#EF4444]", bg: "bg-[#FEE2E2]", text: "text-[#DC2626]" },
  high: { dot: "bg-[#E08A3C]", bg: "bg-[#FFF8F3]", text: "text-[#E08A3C]" },
  medium: { dot: "bg-[#F59E0B]", bg: "bg-[#FEF3C7]", text: "text-[#92400E]" },
  low: { dot: "bg-[#DCDCDC]", bg: "bg-[#F0F0F0]", text: "text-[#666]" },
};

function ChurnDashboard() {
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
            <button className="px-3 py-1.5 bg-white border border-[#EBEBEB] rounded-lg text-[11px] font-medium text-[#666] hover:bg-[#FAFAFA] cursor-pointer">
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
              {atRiskUsers.map((u, i) => {
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
                      <span className={`text-[10px] font-medium px-2 py-[2px] rounded-full ${u.type === "student" ? "bg-[#F0F0F0] text-[#666]" : "bg-[#EEF2FF] text-[#4F46E5]"}`}>
                        {u.type}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-[40px] h-[4px] bg-[#F0F0F0] rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${u.engagementScore < 40 ? "bg-[#EF4444]" : u.engagementScore < 60 ? "bg-[#E08A3C]" : "bg-[#1A1A1A]"}`} style={{ width: `${u.engagementScore}%` }} />
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
                        <span className="flex items-center gap-1 text-[10px] text-[#22C55E]">
                          {u.nudgeChannel === "WhatsApp" ? <WhatsappLogo size={11} /> : <Envelope size={11} />}
                          Sent
                        </span>
                      ) : (
                        <button className="text-[10px] font-medium text-[#1A1A1A] hover:text-[#E08A3C] bg-transparent border-none cursor-pointer">
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
          <span className="text-[11px] text-[#ACACAC]">{sentimentFlags.filter((s) => !s.resolved).length} unresolved</span>
        </div>
        {sentimentFlags.map((s, i) => (
          <div key={s.id} className={`px-7 py-4 hover:bg-[#FAFAFA] transition-colors ${i > 0 ? "border-t border-[#F5F5F5]" : "border-t border-[#F5F5F5]"}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[13px] text-[#1A1A1A]">{s.userName}</span>
                  <span className={`text-[10px] font-medium px-2 py-[2px] rounded-full ${s.sentiment === "negative" ? "bg-[#FEE2E2] text-[#DC2626]" : "bg-[#FEF3C7] text-[#92400E]"}`}>
                    {s.sentiment}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, si) => (
                      <Star key={si} size={10} weight={si < s.rating ? "fill" : "regular"} className={si < s.rating ? "text-[#F59E0B]" : "text-[#DCDCDC]"} />
                    ))}
                  </div>
                  {s.resolved && <span className="text-[10px] text-[#22C55E]">Resolved</span>}
                </div>
                <p className="text-[12px] text-[#666] leading-relaxed">&ldquo;{s.reviewSnippet}&rdquo;</p>
                <span className="text-[10px] text-[#CACACA] mt-1 block">{s.flaggedAt}</span>
              </div>
              {!s.resolved && (
                <button className="text-[11px] font-medium text-[#1A1A1A] hover:text-[#E08A3C] bg-transparent border-none cursor-pointer shrink-0 flex items-center gap-0.5">
                  Follow up <CaretRight size={10} weight="bold" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(ChurnDashboard);
