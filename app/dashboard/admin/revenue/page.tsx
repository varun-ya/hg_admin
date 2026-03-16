"use client";
import { useState } from "react";
import { Vault, ChartLineUp, Percent, WifiHigh } from "@phosphor-icons/react";
import LiveOpsKPIRibbon from "@/components/admin/LiveOpsKPIRibbon";
import FinancialTabNav from "@/components/admin/financial/FinancialTabNav";
import RevenueEscrowTable from "@/components/admin/financial/RevenueEscrowTable";
import RevenueEscrowDrawer from "@/components/admin/financial/RevenueEscrowDrawer";
import { revenueKPIs, revenueSparklines } from "@/components/admin/financial/financialMockData";
import type { Transaction } from "@/components/admin/financial/financialTypes";

const ICONS = [
  <Vault size={20} weight="regular" className="text-[#4F46E5]" />,
  <ChartLineUp size={20} weight="regular" className="text-[#10B981]" />,
  <Percent size={20} weight="regular" className="text-[#999]" />,
  <WifiHigh size={20} weight="regular" className="text-[#999]" />,
];

export default function RevenueEscrowPage() {
  const [selected, setSelected] = useState<Transaction | null>(null);
  const items = revenueKPIs.map((k, i) => ({ ...k, icon: ICONS[i] }));

  return (
    <>
      <div className="flex flex-col gap-8 md:gap-10 pt-4">
        <section><FinancialTabNav /></section>
        <section><LiveOpsKPIRibbon items={items} sparklines={revenueSparklines} /></section>
        <section><RevenueEscrowTable onSelect={setSelected} /></section>
      </div>
      <RevenueEscrowDrawer txn={selected} onClose={() => setSelected(null)} />
    </>
  );
}
