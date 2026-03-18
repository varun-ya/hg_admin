"use client";
import { Buildings, UsersThree, CurrencyDollar, Upload } from "@phosphor-icons/react";
import LiveOpsKPIRibbon from "@/components/admin/LiveOpsKPIRibbon";
import TenantManager from "@/components/admin/tenants/TenantManager";
import { tenantKPIs, tenantSparklines } from "@/components/admin/tenants/tenantMockData";

const ICONS = [
  <Buildings size={20} weight="regular" className="text-[#999]" />,
  <UsersThree size={20} weight="regular" className="text-[#999]" />,
  <CurrencyDollar size={20} weight="regular" className="text-[#999]" />,
  <Upload size={20} weight="regular" className="text-[#999]" />,
];

export default function TenantsPage() {
  const items = tenantKPIs.map((k, i) => ({ ...k, icon: ICONS[i] }));
  return (
    <div className="flex flex-col gap-8 md:gap-10 pt-4">
      <section><LiveOpsKPIRibbon items={items} sparklines={tenantSparklines} /></section>
      <section><TenantManager /></section>
    </div>
  );
}
