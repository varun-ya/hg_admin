"use client";
import { ShieldWarning, LockKey, Prohibit, Heartbeat } from "@phosphor-icons/react";
import LiveOpsKPIRibbon from "@/components/admin/LiveOpsKPIRibbon";
import SystemTabNav from "@/components/admin/system/SystemTabNav";
import SecurityDashboard from "@/components/admin/security/SecurityDashboard";
import { securityKPIs, securitySparklines } from "@/components/admin/security/securityMockData";

const ICONS = [
  <ShieldWarning size={20} weight="regular" className="text-[#C2571A]" />,
  <LockKey size={20} weight="regular" className="text-[#293763]" />,
  <Prohibit size={20} weight="regular" className="text-[#E08A3C]" />,
  <Heartbeat size={20} weight="regular" className="text-[#999]" />,
];

export default function SecurityPage() {
  const items = securityKPIs.map((k, i) => ({ ...k, icon: ICONS[i] }));

  return (
    <div className="flex flex-col gap-8 md:gap-10 pt-4">
      <section><SystemTabNav /></section>
      <section><LiveOpsKPIRibbon items={items} sparklines={securitySparklines} /></section>
      <section><SecurityDashboard /></section>
    </div>
  );
}
