"use client";
import { useState, useMemo, useCallback, memo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  House,
  ChartLineUp,
  Student,
  ChalkboardTeacher,
  IdentificationBadge,
  UsersThree,
  VideoCamera,
  ShieldCheck,
  Scales,
  Megaphone,
  CurrencyDollar,
  Wallet,
  ArrowsClockwise,
  Receipt,
  Brain,
  Key,
  GitBranch,
  ToggleRight,
  ListBullets,
  Flag,
  Lightning,
  Wrench,
  CaretDown,
  CaretLeft,
  CaretRight,
  Eye,
  Buildings,
  Percent,
  Heartbeat,
  TreeStructure,
  PaperPlaneTilt,
} from "@phosphor-icons/react";

interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}

function AdminSidebar({ isOpen, setIsOpen }: AdminSidebarProps) {
  const pathname = usePathname();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    "PLATFORM COMMAND": true,
    "USER LIFECYCLE": true,
    "LIVE OPS": true,
    "FINANCIAL": true,
    "AI GOVERNANCE": true,
    "ORCHESTRATION": true,
    "SYSTEM & AUDIT": true,
  });

  const toggleGroup = useCallback((label: string) => {
    setExpandedGroups((p) => ({ ...p, [label]: !p[label] }));
  }, []);

  const toggleSidebar = useCallback(() => setIsOpen(!isOpen), [isOpen, setIsOpen]);

  const navGroups = useMemo(
    () => [
      {
        label: "PLATFORM COMMAND",
        items: [
          { name: "Health Dashboard", href: "/dashboard/admin", icon: House },
          { name: "Global Analytics", href: "/dashboard/admin/analytics", icon: ChartLineUp },
        ],
      },
      {
        label: "USER LIFECYCLE",
        items: [
          { name: "Students", href: "/dashboard/admin/students", icon: Student },
          { name: "Teachers", href: "/dashboard/admin/teachers", icon: ChalkboardTeacher },
          { name: "KYC Pipeline", href: "/dashboard/admin/kyc", icon: IdentificationBadge, badge: "89", badgeColor: "amber" as const },
          { name: "Agents / Staff", href: "/dashboard/admin/staff", icon: UsersThree },
        ],
      },
      {
        label: "LIVE OPS",
        items: [
          { name: "Class Monitor", href: "/dashboard/admin/classes", icon: VideoCamera },
          { name: "Content Moderation", href: "/dashboard/admin/moderation", icon: ShieldCheck },
          { name: "Dispute Resolution", href: "/dashboard/admin/disputes", icon: Scales, badge: "23", badgeColor: "red" as const },
          { name: "Lead Management", href: "/dashboard/admin/leads", icon: Megaphone },
        ],
      },
      {
        label: "FINANCIAL",
        items: [
          { name: "Revenue & Escrow", href: "/dashboard/admin/revenue", icon: CurrencyDollar },
          { name: "Payouts", href: "/dashboard/admin/payouts", icon: Wallet },
          { name: "Refunds", href: "/dashboard/admin/refunds", icon: ArrowsClockwise },
          { name: "Invoices & Taxes", href: "/dashboard/admin/invoices", icon: Receipt },
        ],
      },
      {
        label: "AI GOVERNANCE",
        items: [
          { name: "Usage Metrics", href: "/dashboard/admin/ai-usage", icon: Brain },
          { name: "Quotas & API Keys", href: "/dashboard/admin/api-keys", icon: Key },
          { name: "AI Workflow Rules", href: "/dashboard/admin/ai-workflows", icon: GitBranch },
          { name: "Ethics Controls", href: "/dashboard/admin/ai-ethics", icon: ToggleRight },
        ],
      },
      {
        label: "ORCHESTRATION",
        items: [
          { name: "Impersonation", href: "/dashboard/admin/impersonation", icon: Eye },
          { name: "B2B Tenants", href: "/dashboard/admin/tenants", icon: Buildings },
          { name: "Commission Engine", href: "/dashboard/admin/commission", icon: Percent },
          { name: "Churn Prediction", href: "/dashboard/admin/churn", icon: Heartbeat },
          { name: "Taxonomy", href: "/dashboard/admin/taxonomy", icon: TreeStructure },
          { name: "Broadcast Hub", href: "/dashboard/admin/broadcast", icon: PaperPlaneTilt },
        ],
      },
      {
        label: "SYSTEM & AUDIT",
        items: [
          { name: "Audit Logs", href: "/dashboard/admin/audit", icon: ListBullets },
          { name: "Feature Flags", href: "/dashboard/admin/flags", icon: Flag },
          { name: "Emergency Controls", href: "/dashboard/admin/emergency", icon: Lightning },
          { name: "Overrides", href: "/dashboard/admin/overrides", icon: Wrench },
        ],
      },
    ],
    []
  );

  return (
    <aside
      className={`bg-[#F7F7F8] border-r border-[#EBEBEB] flex flex-col shrink-0 h-screen sticky top-0 overflow-y-auto custom-scrollbar font-matter transition-all duration-[220ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
        isOpen ? "w-[260px]" : "w-[68px]"
      }`}
    >
      {/* Header / Logo Area */}
      <div className={`flex items-center shrink-0 sticky top-0 bg-[#F7F7F8] z-10 border-b border-[#EBEBEB] ${
        isOpen ? "justify-between pl-6 pr-4 pt-[22px] pb-[16px]" : "flex-col items-center pt-[22px] pb-[16px] gap-3"
      }`}>
        {isOpen ? (
          <Image
            src="https://homeguruworld.com/wp-content/uploads/2022/04/Homeguru-Logo-1.png"
            alt="HomeGuru Logo"
            width={110}
            height={32}
            className="object-contain"
            priority
          />
        ) : (
          <Image
            src="https://homeguruworld.com/wp-content/uploads/2022/04/Homeguru-Logo-1.png"
            alt="HomeGuru Logo"
            width={36}
            height={36}
            className="object-contain"
            priority
          />
        )}
        <button
          onClick={toggleSidebar}
          className="text-[#ACACAC] hover:text-[#555] p-1.5 rounded-full transition-colors flex cursor-pointer border-none bg-transparent hover:bg-[#EBEBEB]"
          title="Toggle Sidebar"
        >
          {isOpen ? <CaretLeft size={16} weight="regular" /> : <CaretRight size={16} weight="regular" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 w-full overflow-y-auto overflow-x-hidden pb-4 custom-scrollbar">
        {navGroups.map((group, index) => {
          const isExpanded = expandedGroups[group.label] !== false;
          return (
            <div key={index} className="py-2.5">
              {isOpen && (
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="w-full flex items-center justify-between px-4 py-1.5 border-none bg-transparent cursor-pointer group"
                >
                  <span className="text-[10px] font-semibold text-[#BCBCC4] uppercase tracking-[0.1em] group-hover:text-[#888] transition-colors">
                    {group.label}
                  </span>
                  <span className={`inline-flex transition-transform duration-200 text-[#BCBCC4] ${isExpanded ? "rotate-0" : "-rotate-90"}`}>
                    <CaretDown size={14} weight="regular" />
                  </span>
                </button>
              )}
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen
                  ? isExpanded ? "max-h-[800px] opacity-100 visible" : "max-h-0 opacity-0 invisible"
                  : "max-h-full opacity-100 visible"
              }`}>
                <ul className="flex flex-col m-0 p-0 list-none mt-1">
                  {group.items.map((item, itemIdx) => {
                    const isActive = pathname === item.href || (item.name === "Health Dashboard" && pathname === "/dashboard/admin");
                    const Icon = item.icon;
                    return (
                      <li key={itemIdx}>
                        <Link
                          href={item.href}
                          className={`flex items-center rounded-lg transition-all duration-150 select-none text-left font-matter mx-2 my-[2px] relative ${
                            isOpen
                              ? "gap-3 px-3 py-2.5 min-h-[40px]"
                              : "gap-0 p-2 mx-2 justify-center min-h-[40px] w-[40px]"
                          } ${
                            isActive
                              ? "bg-[#EEF2FF] text-[#4F46E5] font-medium border-l-[2px] border-[#4F46E5] pl-[11px]"
                              : "text-[#666] font-normal hover:bg-[#EBEBEB] hover:text-[#111] bg-transparent border-l-[2px] border-transparent"
                          }`}
                          title={!isOpen ? item.name : ""}
                        >
                          <span className={`inline-flex shrink-0 ${isActive ? "text-[#4F46E5]" : "text-[#ACACAC]"}`}>
                            <Icon size={18} weight="regular" />
                          </span>
                          {isOpen && (
                            <span className="overflow-hidden text-ellipsis whitespace-nowrap flex-1 text-[13px]">
                              {item.name}
                            </span>
                          )}
                          {isOpen && item.badge && (
                            <span className={`absolute right-3 pl-1.5 pr-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                              item.badgeColor === "red" ? "bg-[#FEE2E2] text-[#DC2626]" :
                              item.badgeColor === "amber" ? "bg-[#FEF3C7] text-[#D97706]" :
                              "bg-[#F3F4F6] text-[#6B7280]"
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer Profile */}
      <div className={`mt-auto shrink-0 border-t border-[#EBEBEB] flex items-center gap-3 transition-all ${
        isOpen ? "px-4 py-4 cursor-pointer hover:bg-[#EBEBEB]" : "justify-center py-4 px-0 flex-col"
      }`}>
        <div className="w-8 h-8 rounded-lg bg-[#111] text-white flex items-center justify-center shrink-0">
           <span className="text-[13px] font-semibold">N</span>
        </div>
        {isOpen && (
          <div className="flex flex-col min-w-0 flex-1">
             <span className="text-[13px] font-medium text-[#111] leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
               Admin Portal
             </span>
             <span className="text-[11px] text-[#999] font-normal">Super Admin</span>
          </div>
        )}
      </div>
    </aside>
  );
}

export default memo(AdminSidebar);
