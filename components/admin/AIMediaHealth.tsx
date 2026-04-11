"use client";
import { memo } from "react";
import { Brain, Eye, VideoCamera } from "@phosphor-icons/react";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import { aiMediaHealth } from "./mockData";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function RadialGauge({ pct, color, size = 48 }: { pct: number; color: string; size?: number }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="shrink-0 -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F0F0F0" strokeWidth={5} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={5} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset}
        className="transition-all duration-700"
      />
      <text
        x={size / 2} y={size / 2}
        textAnchor="middle" dominantBaseline="central"
        className="rotate-90 origin-center"
        fill="#1A1A1A" fontSize={10} fontWeight={500}
      >
        {Math.round(pct)}%
      </text>
    </svg>
  );
}

function DailyTrendSpark({ data, color }: { data: number[]; color: string }) {
  const chartData = data.map((v, i) => ({ v, i }));
  return (
    <div className="w-full h-[28px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
          <defs>
            <linearGradient id={`ai-spark-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.12} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="bg-white rounded-lg border border-[#F0F0F0] shadow-[0_6px_20px_-6px_rgba(0,0,0,0.12)] px-3 py-2 font-matter">
                  <span className="text-[12px] font-medium text-[#1A1A1A] tabular-nums">{formatNumber(payload[0].value as number)}</span>
                </div>
              );
            }}
            cursor={false}
          />
          <Area
            type="monotone" dataKey="v" stroke={color}
            fill={`url(#ai-spark-${color.replace("#", "")})`}
            strokeWidth={1.5} dot={false} isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function UsageRow({ label, current, limit, unit, icon, color, dailyTrend }: {
  label: string; current: number; limit: number; unit: string;
  icon: React.ReactNode; color: string; dailyTrend?: number[];
}) {
  const pct = Math.min((current / limit) * 100, 100);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <RadialGauge pct={pct} color={color} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {icon}
            <span className="text-[13px] font-normal text-[#555]">{label}</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[15px] font-medium text-[#1A1A1A] tabular-nums">{formatNumber(current)}</span>
            <span className="text-[11px] text-[#CACACA]">/ {formatNumber(limit)} {unit}</span>
          </div>
        </div>
      </div>
      {dailyTrend && (
        <div>
          <span className="text-[10px] text-[#CACACA] mb-1 block">Daily usage (7d)</span>
          <DailyTrendSpark data={dailyTrend} color={color} />
        </div>
      )}
    </div>
  );
}

function AIMediaHealthWidget() {
  const { osmiumLLM, lmlensAPI, videoMeetStatus, videoMeetActiveSessions } = aiMediaHealth;

  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F0] p-7 h-full flex flex-col">
      <div className="flex items-center justify-between mb-7">
        <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">Osmium AI & Media Health</h3>
        <span className="text-[11px] font-normal text-[#ACACAC] bg-[#F7F7F7] px-2.5 py-1 rounded-full">
          {videoMeetStatus}
        </span>
      </div>

      <div className="flex flex-col gap-6 flex-1">
        <UsageRow
          label={osmiumLLM.label}
          current={osmiumLLM.current}
          limit={osmiumLLM.limit}
          unit={osmiumLLM.unit}
          icon={<Brain size={14} weight="regular" className="text-[#E08A3C]" />}
          color="#E08A3C"
          dailyTrend={osmiumLLM.dailyTrend}
        />
        <UsageRow
          label={lmlensAPI.label}
          current={lmlensAPI.current}
          limit={lmlensAPI.limit}
          unit={lmlensAPI.unit}
          icon={<Eye size={14} weight="regular" className="text-[#293763]" />}
          color="#293763"
          dailyTrend={lmlensAPI.dailyTrend}
        />

        <div className="mt-auto pt-5 border-t border-[#F5F5F5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <VideoCamera size={15} weight="regular" className="text-[#ACACAC]" />
            <span className="text-[13px] font-normal text-[#888]">VideoMeet Ingest</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#E08A3C]" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#E08A3C]" />
            </span>
            <span className="text-[12px] font-normal text-[#555]">{videoMeetActiveSessions} active</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(AIMediaHealthWidget);
