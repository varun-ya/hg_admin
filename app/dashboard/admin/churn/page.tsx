"use client";
import { Warning, Heartbeat, WhatsappLogo, ArrowUUpLeft } from "@phosphor-icons/react";
import LiveOpsKPIRibbon from "@/components/admin/LiveOpsKPIRibbon";
import ChurnDashboard from "@/components/admin/churn/ChurnDashboard";
import { churnKPIs, churnSparklines } from "@/components/admin/churn/churnMockData";

const ICONS = [
  <Warning size={20} weight="regular" className="text-[#E08A3C]" />,
  <Heartbeat size={20} weight="regular" className="text-[#999]" />,
  <WhatsappLogo size={20} weight="regular" className="text-[#E08A3C]" />,
  <ArrowUUpLeft size={20} weight="regular" className="text-[#999]" />,
];

export default function ChurnPage() {
  const items = churnKPIs.map((k, i) => ({ ...k, icon: ICONS[i] }));
  return (
    <div className="flex flex-col gap-8 md:gap-10 pt-4">
      <section><LiveOpsKPIRibbon items={items} sparklines={churnSparklines} /></section>
      <section><ChurnDashboard /></section>
    </div>
  );
}
