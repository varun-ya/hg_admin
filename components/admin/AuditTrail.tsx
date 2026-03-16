"use client";
import { memo } from "react";
import { Lock } from "@phosphor-icons/react";
import { auditTrail } from "./mockData";

function AuditTrailWidget() {
  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-7 py-5">
        <div className="flex items-center gap-2.5">
          <Lock size={15} weight="regular" className="text-[#999]" />
          <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">System Audit Trail</h3>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[11px] font-normal text-[#CACACA]">Last 10 events</span>
          <button className="text-[11px] font-medium text-[#1A1A1A] hover:text-black bg-transparent border-none cursor-pointer">
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="border-t border-[#F5F5F5]">
              <th className="py-3 pl-7 pr-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em] w-8"></th>
              <th className="py-3 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Timestamp</th>
              <th className="py-3 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Actor</th>
              <th className="py-3 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Action</th>
              <th className="py-3 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Target</th>
              <th className="py-3 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Category</th>
              <th className="py-3 pr-7 pl-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">IP</th>
            </tr>
          </thead>
          <tbody>
            {auditTrail.map((e, i) => (
              <tr key={e.id} className={`hover:bg-[#FAFAFA] transition-colors ${i > 0 ? "border-t border-[#F8F8F8]" : ""}`}>
                <td className="py-3.5 pl-7 pr-3">
                  {e.immutable && (
                    <Lock size={10} weight="regular" className="text-[#DCDCDC]" />
                  )}
                </td>
                <td className="py-3.5 px-3 text-[12px] font-mono font-normal text-[#CACACA] whitespace-nowrap">{e.timestamp}</td>
                <td className="py-3.5 px-3">
                  <span className={`text-[12px] font-normal ${e.actor === "system" ? "text-[#DCDCDC] italic" : "text-[#666]"}`}>
                    {e.actor}
                  </span>
                </td>
                <td className="py-3.5 px-3 text-[12px] font-normal text-[#1A1A1A]">{e.action}</td>
                <td className="py-3.5 px-3 text-[12px] font-normal text-[#999]">{e.target}</td>
                <td className="py-3.5 px-3">
                  <span className="text-[10px] font-medium text-[#ACACAC] uppercase tracking-wider">
                    {e.category}
                  </span>
                </td>
                <td className="py-3.5 pr-7 pl-3 text-[11px] font-mono text-[#DCDCDC]">{e.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default memo(AuditTrailWidget);
