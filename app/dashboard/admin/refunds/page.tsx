"use client";
import { useState } from "react";
import { ArrowsClockwise, CurrencyDollar, ShieldCheck, Percent } from "@phosphor-icons/react";
import LiveOpsKPIRibbon from "@/components/admin/LiveOpsKPIRibbon";
import FinancialTabNav from "@/components/admin/financial/FinancialTabNav";
import RefundTable from "@/components/admin/financial/RefundTable";
import RefundDrawer from "@/components/admin/financial/RefundDrawer";
import { refundKPIs, refundSparklines } from "@/components/admin/financial/financialMockData";
import type { Refund } from "@/components/admin/financial/financialTypes";

const ICONS = [
  <ArrowsClockwise size={20} weight="regular" className="text-[#E11D48]" />,
  <CurrencyDollar size={20} weight="regular" className="text-[#999]" />,
  <ShieldCheck size={20} weight="regular" className="text-[#F59E0B]" />,
  <Percent size={20} weight="regular" className="text-[#999]" />,
];

export default function RefundsPage() {
  const [selected, setSelected] = useState<Refund | null>(null);
  const items = refundKPIs.map((k, i) => ({ ...k, icon: ICONS[i] }));

  return (
    <>
      <div className="flex flex-col gap-8 md:gap-10 pt-4">
        <section><FinancialTabNav /></section>
        <section><LiveOpsKPIRibbon items={items} sparklines={refundSparklines} /></section>
        <section><RefundTable onSelect={setSelected} /></section>
      </div>
      <RefundDrawer refund={selected} onClose={() => setSelected(null)} />
    </>
  );
}
