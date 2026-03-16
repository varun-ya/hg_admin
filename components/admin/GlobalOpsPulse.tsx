"use client";
import { memo } from "react";
import Link from "next/link";
import { VideoCamera, Vault, IdentificationBadge, Scales, TrendUp, TrendDown, Minus } from "@phosphor-icons/react";
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

function GlobalOpsPulse() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {opsMetrics.map((m) => (
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
          <p className="text-[26px] font-normal text-[#1A1A1A] tracking-tight leading-none">{m.value}</p>
        </Link>
      ))}
    </div>
  );
}

export default memo(GlobalOpsPulse);
