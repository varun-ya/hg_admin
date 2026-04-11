"use client";
import { memo } from "react";
import {
  Lightning, Student, VideoCamera, CreditCard, IdentificationBadge,
  ShieldWarning, ArrowsClockwise, Gear,
} from "@phosphor-icons/react";
import { activityFeed } from "./healthData";

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; bg: string; border: string }> = {
  enrollment: { icon: <Student size={13} weight="fill" className="text-[#293763]" />, bg: "bg-[#F0F3FA]", border: "border-[#293763]/10" },
  session: { icon: <VideoCamera size={13} weight="fill" className="text-[#E08A3C]" />, bg: "bg-[#FFF7ED]", border: "border-[#E08A3C]/10" },
  payment: { icon: <CreditCard size={13} weight="fill" className="text-[#059669]" />, bg: "bg-[#ECFDF5]", border: "border-[#059669]/10" },
  kyc: { icon: <IdentificationBadge size={13} weight="fill" className="text-[#7C3AED]" />, bg: "bg-[#F5F3FF]", border: "border-[#7C3AED]/10" },
  flag: { icon: <ShieldWarning size={13} weight="fill" className="text-[#DC2626]" />, bg: "bg-[#FEF2F2]", border: "border-[#DC2626]/10" },
  refund: { icon: <ArrowsClockwise size={13} weight="fill" className="text-[#B45309]" />, bg: "bg-[#FFFBEB]", border: "border-[#B45309]/10" },
  system: { icon: <Gear size={13} weight="fill" className="text-[#6B7280]" />, bg: "bg-[#F3F4F6]", border: "border-[#6B7280]/10" },
};

function ActivityFeed() {
  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden h-full flex flex-col max-h-[480px]">
      <div className="flex items-center justify-between px-6 py-5 shrink-0 border-b border-[#F5F5F5]">
        <div className="flex items-center gap-2">
          <Lightning size={14} weight="fill" className="text-[#E08A3C]" />
          <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">Live Activity</h3>
        </div>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E08A3C] opacity-40" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E08A3C]" />
        </span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activityFeed.map((item, i) => {
          const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.system;
          return (
            <div
              key={item.id}
              className={`px-6 py-3.5 flex items-start gap-3 hover:bg-[#FAFAFA] transition-colors ${i > 0 ? "border-t border-[#F8F8F8]" : ""}`}
            >
              <div className={`w-7 h-7 rounded-lg ${cfg.bg} border ${cfg.border} flex items-center justify-center shrink-0 mt-0.5`}>
                {cfg.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium text-[#1A1A1A] leading-snug">{item.event}</p>
                <p className="text-[11px] text-[#CACACA] mt-0.5 truncate">{item.detail}</p>
              </div>
              <span className="text-[10px] text-[#DCDCDC] shrink-0 mt-0.5">{item.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default memo(ActivityFeed);
