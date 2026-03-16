"use client";
import { useState } from "react";
import { VideoCamera, Heartbeat, Warning, XCircle } from "@phosphor-icons/react";
import LiveOpsKPIRibbon from "@/components/admin/LiveOpsKPIRibbon";
import ClassRadarTable from "@/components/admin/classes/ClassRadarTable";
import ClassDrawer from "@/components/admin/classes/ClassDrawer";
import { classKPIs, classSparklines } from "@/components/admin/classes/classMockData";
import type { LiveSession } from "@/components/admin/classes/classTypes";

const ICONS = [
  <VideoCamera size={20} weight="regular" className="text-[#999]" />,
  <Heartbeat size={20} weight="regular" className="text-[#999]" />,
  <Warning size={20} weight="regular" className="text-[#999]" />,
  <XCircle size={20} weight="regular" className="text-[#999]" />,
];

export default function ClassMonitorPage() {
  const [selected, setSelected] = useState<LiveSession | null>(null);
  const items = classKPIs.map((k, i) => ({ ...k, icon: ICONS[i] }));

  return (
    <>
      <div className="flex flex-col gap-8 md:gap-10 pt-4">
        <section><LiveOpsKPIRibbon items={items} sparklines={classSparklines} /></section>
        <section><ClassRadarTable onSelectSession={setSelected} /></section>
      </div>
      <ClassDrawer session={selected} onClose={() => setSelected(null)} />
    </>
  );
}
