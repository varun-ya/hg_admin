"use client";
import { memo } from "react";
import { Buildings, ChalkboardTeacher } from "@phosphor-icons/react";
import { topConsumers } from "./aiMockData";

function formatTokens(v: number) {
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `${(v / 1000).toFixed(1)}K`;
  return String(v);
}

function TopConsumersTable() {
  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
      <div className="px-7 pt-6 pb-5">
        <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">Top Consumers</h3>
        <p className="text-[12px] text-[#CACACA] mt-1">Highest resource usage this month</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-t border-b border-[#F5F5F5]">
              <th className="py-3.5 pl-7 pr-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Name</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Tokens</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">LMlens Jobs</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Video Min</th>
              <th className="py-3.5 pr-7 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Est. Cost</th>
            </tr>
          </thead>
          <tbody>
            {topConsumers.map((c, i) => (
              <tr key={c.id} className={`hover:bg-[#FAFAFA]/60 transition-colors duration-100 ${i > 0 ? "border-t border-[#F8F8F8]" : ""}`}>
                <td className="py-4 pl-7 pr-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${c.type === "institution" ? "bg-[#FFF7ED]" : "bg-[#F7F7F7]"}`}>
                      {c.type === "institution"
                        ? <Buildings size={14} className="text-[#E08A3C]" />
                        : <ChalkboardTeacher size={14} className="text-[#999]" />
                      }
                    </div>
                    <div>
                      <span className="text-[13px] text-[#1A1A1A]">{c.name}</span>
                      <p className="text-[10px] text-[#CACACA] capitalize">{c.type}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-3">
                  <span className="text-[13px] font-normal text-[#1A1A1A] tabular-nums">{formatTokens(c.tokensUsed)}</span>
                </td>
                <td className="py-4 px-3">
                  <span className="text-[13px] font-normal text-[#1A1A1A] tabular-nums">{c.lmlensJobs.toLocaleString()}</span>
                </td>
                <td className="py-4 px-3">
                  <span className="text-[13px] font-normal text-[#1A1A1A] tabular-nums">{c.videoMinutes.toLocaleString()}</span>
                </td>
                <td className="py-4 pr-7 px-3">
                  <span className="text-[13px] font-normal text-[#1A1A1A] tabular-nums">${c.costEstimate.toLocaleString()}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default memo(TopConsumersTable);
