"use client";
import { GitBranch, Lightning, Timer, Warning } from "@phosphor-icons/react";
import LiveOpsKPIRibbon from "@/components/admin/LiveOpsKPIRibbon";
import AITabNav from "@/components/admin/ai/AITabNav";
import WorkflowPipelines from "@/components/admin/ai/WorkflowPipelines";
import { workflowKPIs, workflowSparklines } from "@/components/admin/ai/aiMockData";

const ICONS = [
  <GitBranch size={20} weight="regular" className="text-[#293763]" />,
  <Lightning size={20} weight="regular" className="text-[#999]" />,
  <Timer size={20} weight="regular" className="text-[#999]" />,
  <Warning size={20} weight="regular" className="text-[#C2571A]" />,
];

export default function AIWorkflowsPage() {
  const items = workflowKPIs.map((k, i) => ({ ...k, icon: ICONS[i] }));

  return (
    <div className="flex flex-col gap-8 md:gap-10 pt-4">
      <section><AITabNav /></section>
      <section><LiveOpsKPIRibbon items={items} sparklines={workflowSparklines} /></section>
      <section><WorkflowPipelines /></section>
    </div>
  );
}
