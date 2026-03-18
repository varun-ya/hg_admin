"use client";
import { Megaphone, PaperPlaneTilt, UsersThree } from "@phosphor-icons/react";
import LiveOpsKPIRibbon from "@/components/admin/LiveOpsKPIRibbon";
import BroadcastHub from "@/components/admin/broadcast/BroadcastHub";
import { broadcastKPIs, broadcastSparklines } from "@/components/admin/broadcast/broadcastMockData";

const ICONS = [
  <Megaphone size={20} weight="regular" className="text-[#999]" />,
  <PaperPlaneTilt size={20} weight="regular" className="text-[#999]" />,
  <UsersThree size={20} weight="regular" className="text-[#999]" />,
];

export default function BroadcastPage() {
  const items = broadcastKPIs.map((k, i) => ({ ...k, icon: ICONS[i] }));
  return (
    <div className="flex flex-col gap-8 md:gap-10 pt-4">
      <section><LiveOpsKPIRibbon items={items} sparklines={broadcastSparklines} /></section>
      <section><BroadcastHub /></section>
    </div>
  );
}
