"use client";
import { Warning, Clock, Timer } from "@phosphor-icons/react";
import LiveOpsKPIRibbon from "@/components/admin/LiveOpsKPIRibbon";
import SystemTabNav from "@/components/admin/system/SystemTabNav";
import EmergencyKillSwitches from "@/components/admin/system/EmergencyKillSwitches";
import { emergencyKPIs, emergencySparklines } from "@/components/admin/system/systemMockData";

const ICONS = [
  <Warning size={20} weight="regular" className="text-[#999]" />,
  <Clock size={20} weight="regular" className="text-[#999]" />,
  <Timer size={20} weight="regular" className="text-[#999]" />,
];

export default function EmergencyPage() {
  const items = emergencyKPIs.map((k, i) => ({ ...k, icon: ICONS[i] }));

  return (
    <div className="flex flex-col gap-8 md:gap-10 pt-4">
      <section><SystemTabNav /></section>
      <section><LiveOpsKPIRibbon items={items} sparklines={emergencySparklines} /></section>
      <section><EmergencyKillSwitches /></section>
    </div>
  );
}
