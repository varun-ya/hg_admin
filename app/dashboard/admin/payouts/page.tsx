"use client";
import { useState } from "react";
import { Wallet, Lock, Warning, Timer } from "@phosphor-icons/react";
import LiveOpsKPIRibbon from "@/components/admin/LiveOpsKPIRibbon";
import FinancialTabNav from "@/components/admin/financial/FinancialTabNav";
import PayoutTable from "@/components/admin/financial/PayoutTable";
import PayoutDrawer from "@/components/admin/financial/PayoutDrawer";
import { payoutKPIs, payoutSparklines } from "@/components/admin/financial/financialMockData";
import type { Payout } from "@/components/admin/financial/financialTypes";

const ICONS = [
  <Wallet size={20} weight="regular" className="text-[#10B981]" />,
  <Lock size={20} weight="regular" className="text-[#4F46E5]" />,
  <Warning size={20} weight="regular" className="text-[#E11D48]" />,
  <Timer size={20} weight="regular" className="text-[#999]" />,
];

export default function PayoutsPage() {
  const [selected, setSelected] = useState<Payout | null>(null);
  const items = payoutKPIs.map((k, i) => ({ ...k, icon: ICONS[i] }));

  return (
    <>
      <div className="flex flex-col gap-8 md:gap-10 pt-4">
        <section><FinancialTabNav /></section>
        <section><LiveOpsKPIRibbon items={items} sparklines={payoutSparklines} /></section>
        <section><PayoutTable onSelect={setSelected} /></section>
      </div>
      <PayoutDrawer payout={selected} onClose={() => setSelected(null)} />
    </>
  );
}
