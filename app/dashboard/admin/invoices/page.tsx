"use client";
import { useState } from "react";
import { Receipt, FileText, Warning } from "@phosphor-icons/react";
import LiveOpsKPIRibbon from "@/components/admin/LiveOpsKPIRibbon";
import FinancialTabNav from "@/components/admin/financial/FinancialTabNav";
import InvoiceTable from "@/components/admin/financial/InvoiceTable";
import InvoiceDrawer from "@/components/admin/financial/InvoiceDrawer";
import { invoiceKPIs, invoiceSparklines } from "@/components/admin/financial/financialMockData";
import type { Invoice } from "@/components/admin/financial/financialTypes";

const ICONS = [
  <Receipt size={20} weight="regular" className="text-[#999]" />,
  <FileText size={20} weight="regular" className="text-[#999]" />,
  <Warning size={20} weight="regular" className="text-[#E11D48]" />,
];

export default function InvoicesPage() {
  const [selected, setSelected] = useState<Invoice | null>(null);
  const items = invoiceKPIs.map((k, i) => ({ ...k, icon: ICONS[i] }));

  return (
    <>
      <div className="flex flex-col gap-8 md:gap-10 pt-4">
        <section><FinancialTabNav /></section>
        <section>
          <LiveOpsKPIRibbon
            items={items}
            sparklines={invoiceSparklines}
          />
        </section>
        <section><InvoiceTable onSelect={setSelected} /></section>
      </div>
      <InvoiceDrawer invoice={selected} onClose={() => setSelected(null)} />
    </>
  );
}
