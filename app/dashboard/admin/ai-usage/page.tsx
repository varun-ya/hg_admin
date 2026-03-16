"use client";
import { Suspense } from "react";
import { Brain, Cpu, VideoCamera, CurrencyDollar } from "@phosphor-icons/react";
import LiveOpsKPIRibbon from "@/components/admin/LiveOpsKPIRibbon";
import AITabNav from "@/components/admin/ai/AITabNav";
import UsageCharts from "@/components/admin/ai/UsageCharts";
import TopConsumersTable from "@/components/admin/ai/TopConsumersTable";
import { usageKPIs, usageSparklines } from "@/components/admin/ai/aiMockData";

const ICONS = [
  <Brain size={20} weight="regular" className="text-[#8B5CF6]" />,
  <Cpu size={20} weight="regular" className="text-[#06B6D4]" />,
  <VideoCamera size={20} weight="regular" className="text-[#999]" />,
  <CurrencyDollar size={20} weight="regular" className="text-[#F59E0B]" />,
];

function TableSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F0] p-7 animate-pulse">
      <div className="h-5 bg-[#F5F5F5] rounded w-40 mb-2" />
      <div className="h-3 bg-[#F5F5F5] rounded w-56 mb-6" />
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-[#F5F5F5]" />
            <div className="flex-1 h-4 bg-[#F5F5F5] rounded" />
            <div className="w-16 h-4 bg-[#F5F5F5] rounded" />
            <div className="w-16 h-4 bg-[#F5F5F5] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AIUsagePage() {
  const items = usageKPIs.map((k, i) => ({ ...k, icon: ICONS[i] }));

  return (
    <div className="flex flex-col gap-8 md:gap-10 pt-4">
      <section><AITabNav /></section>
      <section><LiveOpsKPIRibbon items={items} sparklines={usageSparklines} /></section>
      <section>
        <Suspense fallback={<div className="grid grid-cols-1 lg:grid-cols-2 gap-5"><TableSkeleton /><TableSkeleton /></div>}>
          <UsageCharts />
        </Suspense>
      </section>
      <section>
        <Suspense fallback={<TableSkeleton />}>
          <TopConsumersTable />
        </Suspense>
      </section>
    </div>
  );
}
