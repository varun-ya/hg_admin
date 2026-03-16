"use client";
import { useState } from "react";
import { Queue, Robot, Timer, ArrowUp } from "@phosphor-icons/react";
import LiveOpsKPIRibbon from "@/components/admin/LiveOpsKPIRibbon";
import ModerationQueueTable from "@/components/admin/moderation/ModerationQueueTable";
import ModerationDrawer from "@/components/admin/moderation/ModerationDrawer";
import { moderationKPIs, moderationSparklines } from "@/components/admin/moderation/moderationMockData";
import type { FlaggedItem } from "@/components/admin/moderation/moderationTypes";

const ICONS = [
  <Queue size={20} weight="regular" className="text-[#999]" />,
  <Robot size={20} weight="regular" className="text-[#999]" />,
  <Timer size={20} weight="regular" className="text-[#999]" />,
  <ArrowUp size={20} weight="regular" className="text-[#999]" />,
];

export default function ModerationPage() {
  const [selected, setSelected] = useState<FlaggedItem | null>(null);
  const items = moderationKPIs.map((k, i) => ({ ...k, icon: ICONS[i] }));

  return (
    <>
      <div className="flex flex-col gap-8 md:gap-10 pt-4">
        <section><LiveOpsKPIRibbon items={items} sparklines={moderationSparklines} /></section>
        <section><ModerationQueueTable onSelectItem={setSelected} /></section>
      </div>
      <ModerationDrawer item={selected} onClose={() => setSelected(null)} />
    </>
  );
}
