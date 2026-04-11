"use client";
import { useState } from "react";
import { Key, Database, Warning, Prohibit } from "@phosphor-icons/react";
import LiveOpsKPIRibbon from "@/components/admin/LiveOpsKPIRibbon";
import AITabNav from "@/components/admin/ai/AITabNav";
import KeyVaultTable from "@/components/admin/ai/KeyVaultTable";
import KeyDrawer from "@/components/admin/ai/KeyDrawer";
import { keysKPIs, keysSparklines } from "@/components/admin/ai/aiMockData";
import type { ApiKey } from "@/components/admin/ai/aiTypes";

const ICONS = [
  <Key size={20} weight="regular" className="text-[#E08A3C]" />,
  <Database size={20} weight="regular" className="text-[#999]" />,
  <Warning size={20} weight="regular" className="text-[#D4956A]" />,
  <Prohibit size={20} weight="regular" className="text-[#999]" />,
];

export default function APIKeysPage() {
  const [selected, setSelected] = useState<ApiKey | null>(null);
  const items = keysKPIs.map((k, i) => ({ ...k, icon: ICONS[i] }));

  return (
    <>
      <div className="flex flex-col gap-8 md:gap-10 pt-4">
        <section><AITabNav /></section>
        <section><LiveOpsKPIRibbon items={items} sparklines={keysSparklines} /></section>
        <section><KeyVaultTable onSelect={setSelected} /></section>
      </div>
      <KeyDrawer apiKey={selected} onClose={() => setSelected(null)} />
    </>
  );
}
