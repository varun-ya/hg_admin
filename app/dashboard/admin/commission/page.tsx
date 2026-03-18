"use client";
import { Scales, Percent, CurrencyDollar, Globe } from "@phosphor-icons/react";
import LiveOpsKPIRibbon from "@/components/admin/LiveOpsKPIRibbon";
import CommissionEngine from "@/components/admin/commission/CommissionEngine";
import { commissionKPIs, commissionSparklines } from "@/components/admin/commission/commissionMockData";

const ICONS = [
  <Scales size={20} weight="regular" className="text-[#999]" />,
  <Percent size={20} weight="regular" className="text-[#999]" />,
  <CurrencyDollar size={20} weight="regular" className="text-[#999]" />,
  <Globe size={20} weight="regular" className="text-[#999]" />,
];

export default function CommissionPage() {
  const items = commissionKPIs.map((k, i) => ({ ...k, icon: ICONS[i] }));
  return (
    <div className="flex flex-col gap-8 md:gap-10 pt-4">
      <section><LiveOpsKPIRibbon items={items} sparklines={commissionSparklines} /></section>
      <section><CommissionEngine /></section>
    </div>
  );
}
