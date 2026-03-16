"use client";
import { useState } from "react";
import { Scales, CurrencyDollar, CreditCard, Timer } from "@phosphor-icons/react";
import LiveOpsKPIRibbon from "@/components/admin/LiveOpsKPIRibbon";
import DisputeTable from "@/components/admin/disputes/DisputeTable";
import DisputeDrawer from "@/components/admin/disputes/DisputeDrawer";
import { disputeKPIs, disputeSparklines } from "@/components/admin/disputes/disputeMockData";
import type { Dispute } from "@/components/admin/disputes/disputeTypes";

const ICONS = [
  <Scales size={20} weight="regular" className="text-[#999]" />,
  <CurrencyDollar size={20} weight="regular" className="text-[#999]" />,
  <CreditCard size={20} weight="regular" className="text-[#999]" />,
  <Timer size={20} weight="regular" className="text-[#999]" />,
];

export default function DisputesPage() {
  const [selected, setSelected] = useState<Dispute | null>(null);
  const items = disputeKPIs.map((k, i) => ({ ...k, icon: ICONS[i] }));

  return (
    <>
      <div className="flex flex-col gap-8 md:gap-10 pt-4">
        <section><LiveOpsKPIRibbon items={items} sparklines={disputeSparklines} /></section>
        <section><DisputeTable onSelectDispute={setSelected} /></section>
      </div>
      <DisputeDrawer dispute={selected} onClose={() => setSelected(null)} />
    </>
  );
}
