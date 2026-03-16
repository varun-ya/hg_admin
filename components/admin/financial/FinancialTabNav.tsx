"use client";
import { memo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  CurrencyDollar, Wallet, ArrowsClockwise, Receipt,
} from "@phosphor-icons/react";

const TABS = [
  { label: "Revenue & Escrow", href: "/dashboard/admin/revenue", icon: CurrencyDollar },
  { label: "Payouts", href: "/dashboard/admin/payouts", icon: Wallet },
  { label: "Refunds", href: "/dashboard/admin/refunds", icon: ArrowsClockwise },
  { label: "Invoices & Taxes", href: "/dashboard/admin/invoices", icon: Receipt },
] as const;

function FinancialTabNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 bg-[#F5F5F5] rounded-xl p-[3px] w-fit">
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            prefetch={false}
            className={`flex items-center gap-1.5 px-4 py-[7px] rounded-lg text-[12px] font-medium transition-all select-none ${
              active
                ? "bg-white text-[#1A1A1A] shadow-sm"
                : "bg-transparent text-[#ACACAC] hover:text-[#777]"
            }`}
          >
            <Icon size={14} weight={active ? "fill" : "regular"} />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default memo(FinancialTabNav);
