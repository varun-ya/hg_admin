"use client";
import { ShieldCheck, Prohibit, ListBullets, Globe } from "@phosphor-icons/react";
import LiveOpsKPIRibbon from "@/components/admin/LiveOpsKPIRibbon";
import AITabNav from "@/components/admin/ai/AITabNav";
import EthicsControls from "@/components/admin/ai/EthicsControls";
import { ethicsKPIs, ethicsSparklines } from "@/components/admin/ai/aiMockData";

const ICONS = [
  <ShieldCheck size={20} weight="regular" className="text-[#8B5CF6]" />,
  <Prohibit size={20} weight="regular" className="text-[#10B981]" />,
  <ListBullets size={20} weight="regular" className="text-[#999]" />,
  <Globe size={20} weight="regular" className="text-[#06B6D4]" />,
];

export default function AIEthicsPage() {
  const items = ethicsKPIs.map((k, i) => ({ ...k, icon: ICONS[i] }));

  return (
    <div className="flex flex-col gap-8 md:gap-10 pt-4">
      <section><AITabNav /></section>
      <section><LiveOpsKPIRibbon items={items} sparklines={ethicsSparklines} /></section>
      <section><EthicsControls /></section>
    </div>
  );
}
