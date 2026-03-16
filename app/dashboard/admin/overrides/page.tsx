"use client";
import { Wrench, Warning, Heartbeat } from "@phosphor-icons/react";
import LiveOpsKPIRibbon from "@/components/admin/LiveOpsKPIRibbon";
import SystemTabNav from "@/components/admin/system/SystemTabNav";
import OverrideCommands from "@/components/admin/system/OverrideCommands";
import { overrideKPIs, overrideSparklines } from "@/components/admin/system/systemMockData";

const ICONS = [
  <Wrench size={20} weight="regular" className="text-[#999]" />,
  <Warning size={20} weight="regular" className="text-[#999]" />,
  <Heartbeat size={20} weight="regular" className="text-[#999]" />,
];

export default function OverridesPage() {
  const items = overrideKPIs.map((k, i) => ({ ...k, icon: ICONS[i] }));

  return (
    <div className="flex flex-col gap-8 md:gap-10 pt-4">
      <section><SystemTabNav /></section>
      <section><LiveOpsKPIRibbon items={items} sparklines={overrideSparklines} /></section>
      <section><OverrideCommands /></section>
    </div>
  );
}
