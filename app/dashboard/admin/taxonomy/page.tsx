"use client";
import { TreeStructure, Star, TrendUp } from "@phosphor-icons/react";
import LiveOpsKPIRibbon from "@/components/admin/LiveOpsKPIRibbon";
import TaxonomyCenter from "@/components/admin/taxonomy/TaxonomyCenter";
import { taxonomyKPIs, taxonomySparklines } from "@/components/admin/taxonomy/taxonomyMockData";

const ICONS = [
  <TreeStructure size={20} weight="regular" className="text-[#999]" />,
  <Star size={20} weight="regular" className="text-[#E08A3C]" />,
  <TrendUp size={20} weight="regular" className="text-[#999]" />,
];

export default function TaxonomyPage() {
  const items = taxonomyKPIs.map((k, i) => ({ ...k, icon: ICONS[i] }));
  return (
    <div className="flex flex-col gap-8 md:gap-10 pt-4">
      <section><LiveOpsKPIRibbon items={items} sparklines={taxonomySparklines} /></section>
      <section><TaxonomyCenter /></section>
    </div>
  );
}
