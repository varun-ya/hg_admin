"use client";
import { memo } from "react";
import { Brain, Eye, VideoCamera } from "@phosphor-icons/react";
import { aiMediaHealth } from "./mockData";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function UsageBar({ label, current, limit, unit, icon, barColor = "bg-[#1A1A1A]" }: {
  label: string; current: number; limit: number; unit: string;
  icon: React.ReactNode; barColor?: string;
}) {
  const pct = Math.min((current / limit) * 100, 100);
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {icon}
          <span className="text-[13px] font-normal text-[#555]">{label}</span>
        </div>
        <span className="text-[11px] font-normal text-[#ACACAC]">
          {formatNumber(current)} / {formatNumber(limit)} {unit}
        </span>
      </div>
      <div className="w-full h-1.5 bg-[#F0F0F0] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[11px] font-normal text-[#CACACA]">
        {pct.toFixed(1)}% utilized
      </span>
    </div>
  );
}

function AIMediaHealthWidget() {
  const { osmiumLLM, lmlensAPI, videoMeetStatus, videoMeetActiveSessions } = aiMediaHealth;

  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F0] p-7 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">Osmium AI & Media Health</h3>
        <span className="text-[11px] font-normal text-[#ACACAC] bg-[#F7F7F7] px-2.5 py-1 rounded-full">
          {videoMeetStatus}
        </span>
      </div>

      <div className="flex flex-col gap-7 flex-1">
        <UsageBar
          label={osmiumLLM.label}
          current={osmiumLLM.current}
          limit={osmiumLLM.limit}
          unit={osmiumLLM.unit}
          icon={<Brain size={15} weight="regular" className="text-[#E08A3C]" />}
          barColor="bg-[#E08A3C]"
        />
        <UsageBar
          label={lmlensAPI.label}
          current={lmlensAPI.current}
          limit={lmlensAPI.limit}
          unit={lmlensAPI.unit}
          icon={<Eye size={15} weight="regular" className="text-[#ACACAC]" />}
        />

        <div className="mt-auto pt-5 border-t border-[#F5F5F5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <VideoCamera size={15} weight="regular" className="text-[#ACACAC]" />
            <span className="text-[13px] font-normal text-[#888]">VideoMeet Ingest</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#22C55E]" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#22C55E]" />
            </span>
            <span className="text-[12px] font-normal text-[#555]">{videoMeetActiveSessions} active</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(AIMediaHealthWidget);
