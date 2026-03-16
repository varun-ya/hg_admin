"use client";
import { Flag, Rocket, Clock } from "@phosphor-icons/react";
import LiveOpsKPIRibbon from "@/components/admin/LiveOpsKPIRibbon";
import SystemTabNav from "@/components/admin/system/SystemTabNav";
import FeatureFlagMatrix from "@/components/admin/system/FeatureFlagMatrix";
import { flagKPIs, flagSparklines } from "@/components/admin/system/systemMockData";

const ICONS = [
  <Flag size={20} weight="regular" className="text-[#999]" />,
  <Rocket size={20} weight="regular" className="text-[#999]" />,
  <Clock size={20} weight="regular" className="text-[#999]" />,
];

export default function FlagsPage() {
  const items = flagKPIs.map((k, i) => ({ ...k, icon: ICONS[i] }));

  return (
    <div className="flex flex-col gap-8 md:gap-10 pt-4">
      <section><SystemTabNav /></section>
      <section><LiveOpsKPIRibbon items={items} sparklines={flagSparklines} /></section>
      <section><FeatureFlagMatrix /></section>
    </div>
  );
}
