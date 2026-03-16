"use client";
import { ListBullets, ShieldCheck, Lightning } from "@phosphor-icons/react";
import LiveOpsKPIRibbon from "@/components/admin/LiveOpsKPIRibbon";
import SystemTabNav from "@/components/admin/system/SystemTabNav";
import AuditLedgerTable from "@/components/admin/system/AuditLedgerTable";
import { auditKPIs, auditSparklines } from "@/components/admin/system/systemMockData";

const ICONS = [
  <ListBullets size={20} weight="regular" className="text-[#999]" />,
  <ShieldCheck size={20} weight="regular" className="text-[#E11D48]" />,
  <Lightning size={20} weight="regular" className="text-[#999]" />,
];

export default function AuditPage() {
  const items = auditKPIs.map((k, i) => ({ ...k, icon: ICONS[i] }));

  return (
    <div className="flex flex-col gap-8 md:gap-10 pt-4">
      <section><SystemTabNav /></section>
      <section><LiveOpsKPIRibbon items={items} sparklines={auditSparklines} /></section>
      <section><AuditLedgerTable /></section>
    </div>
  );
}
