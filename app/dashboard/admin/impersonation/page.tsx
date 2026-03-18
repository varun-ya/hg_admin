"use client";
import { Eye, UserSwitch, Prohibit } from "@phosphor-icons/react";
import LiveOpsKPIRibbon from "@/components/admin/LiveOpsKPIRibbon";
import ImpersonationTable from "@/components/admin/impersonation/ImpersonationTable";
import { impersonationKPIs, impersonationSparklines } from "@/components/admin/impersonation/impersonationMockData";

const ICONS = [
  <Eye size={20} weight="regular" className="text-[#999]" />,
  <UserSwitch size={20} weight="regular" className="text-[#999]" />,
  <Prohibit size={20} weight="regular" className="text-[#E08A3C]" />,
];

export default function ImpersonationPage() {
  const items = impersonationKPIs.map((k, i) => ({ ...k, icon: ICONS[i] }));
  return (
    <div className="flex flex-col gap-8 md:gap-10 pt-4">
      <section><LiveOpsKPIRibbon items={items} sparklines={impersonationSparklines} /></section>
      <section><ImpersonationTable /></section>
    </div>
  );
}
