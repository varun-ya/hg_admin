"use client";
import { memo } from "react";
import Link from "next/link";
import { VideoCamera, Vault, IdentificationBadge, Scales, TrendUp, TrendDown, Minus } from "@phosphor-icons/react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { opsMetrics } from "./mockData";
import type { OpsMetric } from "./types";

const ICON_MAP: Record<string, React.ReactNode> = {
  VideoCamera: <VideoCamera size={20} weight="regular" className="text-[#999]" />,
  Vault: <Vault size={20} weight="regular" className="text-[#999]" />,
  IdentificationBadge: <IdentificationBadge size={20} weight="regular" className="text-[#999]" />,
  Scales: <Scales size={20} weight="regular" className="text-[#999]" />,
};

const HREF_MAP: Record<string, string> = {
  "live-classes": "/dashboard/admin/classes",
  escrow: "/dashboard/admin/revenue",
  kyc: "/dashboard/admin/kyc",
  disputes: "/dashboard/admin/disputes",
};

const SPARK_COLOR: Record<string, string> = {
  up: "#22C55E",
  down: "#22C55E",
  neutral: "#F59E0B",
};

function TrendBadge({ type, text }: { type: OpsMetric["changeType"]; text: string }) {
  const icons = {
    up: <TrendUp size={11} weight="bold" />,
    down: <TrendDown size={11} weight="bold" />,
    neutral: <Minus size={11} weight="bold" />,
  };
  return (
    <span className="flex items-center gap-1 text-[11px] font-normal text-[#ACACAC]">
      {icons[type]} {text}
    </span>
  );
}

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const chartData = data.map((v, i) => ({ v, i }));
  return (
    <div className="w-[72px] h-[32px] shrink-0">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
          <defs>
            <linearGradient id={`spark-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.15} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            fill={`url(#spark-${color.replace("#", "")})`}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function GlobalOpsPulse() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {opsMetrics.map((m) => {
        const sparkColor = SPARK_COLOR[m.changeType] || "#1A1A1A";
        return (
          <Link
            key={m.id}
            href={HREF_MAP[m.id] || "/dashboard/admin"}
            className="bg-white rounded-2xl p-6 border border-[#F0F0F0] hover:border-[#DCDCDC] hover:shadow-md transition-all duration-200 cursor-pointer block"
          >
            <div className="flex items-start justify-between mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#F7F7F7]">
                {ICON_MAP[m.icon]}
              </div>
              <TrendBadge type={m.changeType} text={m.change} />
            </div>
            <p className="text-[13px] text-[#ACACAC] font-normal mb-1.5">{m.label}</p>
            <div className="flex items-end justify-between gap-3">
              <p className="text-[26px] font-normal text-[#1A1A1A] tracking-tight leading-none">{m.value}</p>
              {m.sparkline && <MiniSparkline data={m.sparkline} color={sparkColor} />}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default memo(GlobalOpsPulse);
