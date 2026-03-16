"use client";
import { memo } from "react";
import { ChalkboardTeacher, IdentificationBadge, Star, Vault, TrendUp, TrendDown, Minus } from "@phosphor-icons/react";
import { teacherKPIs } from "./teacherMockData";
import type { TeacherKPI } from "./teacherTypes";

const ICON_MAP: Record<string, React.ReactNode> = {
  ChalkboardTeacher: <ChalkboardTeacher size={20} weight="regular" className="text-[#999]" />,
  IdentificationBadge: <IdentificationBadge size={20} weight="regular" className="text-[#999]" />,
  Star: <Star size={20} weight="regular" className="text-[#999]" />,
  Vault: <Vault size={20} weight="regular" className="text-[#999]" />,
};

const SPARKLINES: number[][] = [
  [72, 75, 74, 78, 80, 82, 86],
  [14, 18, 16, 22, 19, 15, 12],
  [4.78, 4.79, 4.8, 4.8, 4.81, 4.82, 4.82],
  [1.8, 2.0, 1.9, 2.1, 2.2, 2.3, 2.4],
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
  const gId = `tsp-${color.replace("#", "")}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0">
      <defs>
        <linearGradient id={gId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.08" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gId})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="1.5" fill={color} />
    </svg>
  );
}

function TrendBadge({ type, text }: { type: TeacherKPI["changeType"]; text: string }) {
  const icons = { up: <TrendUp size={11} weight="bold" />, down: <TrendDown size={11} weight="bold" />, neutral: <Minus size={11} weight="bold" /> };
  return (
    <span className="flex items-center gap-1 text-[11px] font-normal text-[#ACACAC]">
      {icons[type]} {text}
    </span>
  );
}

function TeacherKPIRibbon() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {teacherKPIs.map((m, i) => (
        <div key={i} className="bg-white rounded-2xl p-6 border border-[#F0F0F0] hover:border-[#DCDCDC] hover:shadow-md transition-all duration-200">
          <div className="flex items-start justify-between mb-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#F7F7F7]">
              {ICON_MAP[m.icon]}
            </div>
            {m.isCritical && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E08A3C] opacity-50" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E08A3C]" />
              </span>
            )}
          </div>
          <p className="text-[13px] text-[#ACACAC] font-normal mb-1.5">{m.label}</p>
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[26px] font-normal text-[#1A1A1A] tracking-tight leading-none mb-2">{m.value}</p>
              <TrendBadge type={m.changeType} text={m.change} />
            </div>
            <Sparkline data={SPARKLINES[i]} color={m.isCritical ? "#E08A3C" : "#1A1A1A"} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default memo(TeacherKPIRibbon);
