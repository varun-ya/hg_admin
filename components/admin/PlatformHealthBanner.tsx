"use client";
import { memo } from "react";
import { Warning, Pulse, Clock } from "@phosphor-icons/react";
import { platformStatus } from "./healthData";

const STATUS_STYLE = {
  operational: { dot: "bg-[#059669]", text: "text-[#059669]", label: "Operational" },
  degraded: { dot: "bg-[#E08A3C]", text: "text-[#E08A3C]", label: "Degraded" },
  down: { dot: "bg-[#DC2626]", text: "text-[#DC2626]", label: "Down" },
};

function PlatformHealthBanner() {
  const { uptime, lastIncident, services } = platformStatus;
  const degradedCount = services.filter((s) => s.status !== "operational").length;

  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
      {/* Top bar — stacks on mobile */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 px-4 sm:px-7 py-3.5 sm:py-5 border-b border-[#F5F5F5]">
        {/* Left: title + badge */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#059669] opacity-40" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#059669]" />
          </div>
          <h3 className="text-[14px] sm:text-[15px] font-medium text-[#1A1A1A] font-season whitespace-nowrap">Platform Health</h3>
          {degradedCount > 0 && (
            <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-[#E08A3C] bg-[#FFF7ED] px-2 py-0.5 rounded-full shrink-0">
              <Warning size={10} weight="fill" /> {degradedCount} degraded
            </span>
          )}
        </div>

        {/* Right: uptime + last incident — wraps on small screens */}
        <div className="flex items-center gap-3 sm:gap-5 flex-wrap">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-[#ACACAC]">
            <Pulse size={12} weight="bold" className="text-[#059669] shrink-0" />
            <span className="font-medium text-[#1A1A1A]">{uptime}%</span>
            <span className="hidden xs:inline">uptime (30d)</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-[#CACACA]">
            <Clock size={11} className="shrink-0" />
            <span className="hidden sm:inline">Last incident:</span> {lastIncident}
          </div>
        </div>
      </div>

      {/* Service strip — horizontally scrollable */}
      <div className="overflow-x-auto custom-scrollbar">
        <div className="flex divide-x divide-[#F5F5F5] min-w-max">
          {services.map((svc) => {
            const st = STATUS_STYLE[svc.status];
            return (
              <div key={svc.name} className="px-3.5 sm:px-5 py-3 sm:py-4 hover:bg-[#FAFAFA] transition-colors min-w-[130px] sm:min-w-[160px]">
                <div className="flex items-center gap-1.5 mb-1.5 sm:mb-2">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${st.dot}`} />
                  <span className={`text-[9px] sm:text-[10px] font-medium uppercase tracking-wider ${st.text}`}>{st.label}</span>
                </div>
                <p className="text-[11px] sm:text-[12px] font-medium text-[#1A1A1A] mb-0.5 whitespace-nowrap">{svc.name}</p>
                <p className="text-[10px] sm:text-[11px] text-[#CACACA] tabular-nums">{svc.latency} {svc.unit}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default memo(PlatformHealthBanner);
