"use client";
import { memo } from "react";
import { UsersThree, Crown, ShieldCheck, Pulse, TrendUp, TrendDown, Minus } from "@phosphor-icons/react";
import { staffKPIs } from "./staffMockData";
import type { StaffKPI } from "./staffTypes";

const ICON_MAP: Record<string, React.ReactNode> = {
  UsersThree: <UsersThree size={20} weight="regular" className="text-[#999]" />,
  Crown: <Crown size={20} weight="regular" className="text-[#999]" />,
  ShieldCheck: <ShieldCheck size={20} weight="regular" className="text-[#999]" />,
  Pulse: <Pulse size={20} weight="regular" className="text-[#999]" />,
};

const SPARKLINES: number[][] = [
  [28, 30, 29, 31, 32, 33, 34],
  [4, 4, 3, 3, 4, 3, 3],
  [100, 100, 100, 98, 100, 100, 97],
  [8, 14, 10, 16, 11, 18, 12],
];

function Sparkline({ data, color = "#1A1A1A" }: { data: number[]; color?: string }) {
  const h = 28, w = 56, pad = 2;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => ({
    x: pad + (i / (data.length - 1)) * (w - pad * 2),
    y: pad + (1 - (v - min) / range) * (h - pad * 2),
  }));
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const cpx = (points[i].x + points[i + 1].x) / 2;
    d += ` C ${cpx} ${points[i].y}, ${cpx} ${points[i + 1].y}, ${points[i + 1].x} ${points[i + 1].y}`;
  }
  const area = `${d} L ${points[points.length - 1].x} ${h} L ${points[0].x} ${h} Z`;
  const gradId = `spark-staff-${color.replace("#", "")}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.08" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="1.5" fill={color} />
    </svg>
  );
}

function TrendBadge({ type, text }: { type: StaffKPI["changeType"]; text: string }) {
  const icons = { up: <TrendUp size={11} weight="bold" />, down: <TrendDown size={11} weight="bold" />, neutral: <Minus size={11} weight="bold" /> };
  return (
    <span className="flex items-center gap-1 text-[11px] font-normal text-[#ACACAC]">
      {icons[type]} {text}
    </span>
  );
}

function StaffKPIRibbon() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {staffKPIs.map((m, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-6 border border-[#F0F0F0] hover:border-[#DCDCDC] hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-start justify-between mb-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#F7F7F7]">
              {ICON_MAP[m.icon]}
            </div>
            {m.isCritical && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DC2626] opacity-50" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#DC2626]" />
              </span>
            )}
          </div>
          <p className="text-[13px] text-[#ACACAC] font-normal mb-1.5">{m.label}</p>
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className={`text-[26px] font-normal tracking-tight leading-none mb-2 ${
                m.isCritical && String(m.value) !== "100%" ? "text-[#DC2626]" : "text-[#1A1A1A]"
              }`}>{m.value}</p>
              <TrendBadge type={m.changeType} text={m.change} />
            </div>
            <Sparkline data={SPARKLINES[i]} color={m.isCritical ? "#DC2626" : "#1A1A1A"} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default memo(StaffKPIRibbon);
