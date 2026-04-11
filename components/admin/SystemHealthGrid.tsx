"use client";
import { memo, useId } from "react";
import { Gauge, CheckCircle, Warning } from "@phosphor-icons/react";
import { systemHealth } from "./healthData";

function MiniSpark({ data, color, label }: { data: number[]; color: string; label?: string }) {
  const uid = useId().replace(/:/g, "");
  const w = 64, h = 24, pad = 2;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => ({
    x: pad + (i / (data.length - 1)) * (w - pad * 2),
    y: pad + (1 - (v - min) / range) * (h - pad * 2),
    v,
  }));
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const cpx = (pts[i].x + pts[i + 1].x) / 2;
    d += ` C ${cpx} ${pts[i].y}, ${cpx} ${pts[i + 1].y}, ${pts[i + 1].x} ${pts[i + 1].y}`;
  }
  const area = `${d} L ${pts[pts.length - 1].x} ${h} L ${pts[0].x} ${h} Z`;
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0">
      <title>{label ? `Current: ${label}` : ""}</title>
      <defs>
        <linearGradient id={`sh-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.1" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sh-${uid})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={i === pts.length - 1 ? 2 : 0} fill={color}>
          <title>{days[i] ?? `Day ${i + 1}`}: {p.v}</title>
        </circle>
      ))}
      {/* Invisible hover targets for tooltips */}
      {pts.map((p, i) => (
        <circle key={`h-${i}`} cx={p.x} cy={p.y} r={5} fill="transparent">
          <title>{days[i] ?? `Day ${i + 1}`}: {p.v}</title>
        </circle>
      ))}
    </svg>
  );
}

function SystemHealthGrid() {
  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
      <div className="flex items-center justify-between px-7 py-5 border-b border-[#F5F5F5]">
        <div className="flex items-center gap-2">
          <Gauge size={15} weight="regular" className="text-[#999]" />
          <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">System Health</h3>
        </div>
        <span className="flex items-center gap-1.5 text-[11px] text-[#059669]">
          <CheckCircle size={12} weight="fill" /> All systems nominal
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#F5F5F5]">
        {systemHealth.map((m) => (
          <div key={m.label} className="px-6 py-5 hover:bg-[#FAFAFA] transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-[12px] text-[#888] mb-1">{m.label}</p>
                <p className="text-[20px] font-medium text-[#1A1A1A] tracking-tight leading-none">{m.value}</p>
              </div>
              <MiniSpark data={m.trend} color={m.ok ? "#293763" : "#E08A3C"} label={m.value} />
            </div>
            {/* Progress bar */}
            <div className="flex items-center gap-2.5 mt-3">
              <div className="flex-1 h-[4px] bg-[#F0F0F0] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(m.pct, 100)}%`,
                    backgroundColor: m.ok ? "#293763" : "#E08A3C",
                  }}
                />
              </div>
              <span className="text-[10px] text-[#CACACA] shrink-0">{m.target}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(SystemHealthGrid);
