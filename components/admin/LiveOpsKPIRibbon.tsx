"use client";
import { memo, useId } from "react";
import { TrendUp, TrendDown, Minus } from "@phosphor-icons/react";
import { useCurrency } from "./context/CurrencyContext";

export interface KPIItem {
  label: string;
  value: string | number;
  change: string;
  changeType: "up" | "down" | "neutral";
  icon: React.ReactNode;
  isCritical?: boolean;
  pulseColor?: string;
  /** If set, the value is auto-converted from USD to the active currency */
  usdValue?: number;
  /** If set, the change text contains a USD amount that should be converted */
  usdChange?: number;
  /** Prefix for the converted change amount (e.g. "+") */
  usdChangePrefix?: string;
  /** Suffix for the converted change amount (e.g. " today") */
  usdChangeSuffix?: string;
}

function Sparkline({ data, color = "#1A1A1A" }: { data: number[]; color?: string }) {
  const uid = useId();
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
  const id = `spark-${color.replace("#", "")}-${uid.replace(/:/g, "")}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.08" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="1.5" fill={color} />
    </svg>
  );
}

function TrendBadge({ type, text }: { type: "up" | "down" | "neutral"; text: string }) {
  const icons = { up: <TrendUp size={11} weight="bold" />, down: <TrendDown size={11} weight="bold" />, neutral: <Minus size={11} weight="bold" /> };
  return (
    <span className="flex items-center gap-1 text-[11px] font-normal text-[#ACACAC]">
      {icons[type]} {text}
    </span>
  );
}

interface Props {
  items: KPIItem[];
  sparklines: number[][];
}

function LiveOpsKPIRibbon({ items, sparklines }: Props) {
  const { formatCurrency } = useCurrency();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {items.map((m, i) => {
        const pulseColor = m.pulseColor || "#E08A3C";
        const displayValue = m.usdValue != null ? formatCurrency(m.usdValue, { compact: true }) : m.value;
        const displayChange = m.usdChange != null
          ? `${m.usdChangePrefix || ""}${formatCurrency(m.usdChange, { compact: true })}${m.usdChangeSuffix || ""}`
          : m.change;
        return (
          <div key={i} className="bg-white rounded-2xl p-6 border border-[#F0F0F0] hover:border-[#DCDCDC] hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#F7F7F7]">
                {m.icon}
              </div>
              {m.isCritical && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50" style={{ backgroundColor: pulseColor }} />
                  <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: pulseColor }} />
                </span>
              )}
            </div>
            <p className="text-[13px] text-[#ACACAC] font-normal mb-1.5">{m.label}</p>
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[26px] font-normal text-[#1A1A1A] tracking-tight leading-none mb-2">{displayValue}</p>
                <TrendBadge type={m.changeType} text={displayChange} />
              </div>
              <Sparkline data={sparklines[i] || []} color={m.isCritical ? pulseColor : "#1A1A1A"} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default memo(LiveOpsKPIRibbon);
