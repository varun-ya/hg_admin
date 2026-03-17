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
  SidebarSimple,
  CaretDown,
  User as UserIcon,
  Circle,
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
          { name: "Health Dashboard", href: "/dashboard/admin", icon: <House size={16} weight="regular" /> },
          { name: "Global Analytics", href: "/dashboard/admin/analytics", icon: <ChartLineUp size={16} weight="regular" /> },
        ],
      },
      {
        label: "USER LIFECYCLE",
        items: [
          { name: "Students", href: "/dashboard/admin/students", icon: <Student size={16} weight="regular" /> },
          { name: "Teachers", href: "/dashboard/admin/teachers", icon: <ChalkboardTeacher size={16} weight="regular" /> },
          { name: "KYC Pipeline", href: "/dashboard/admin/kyc", icon: <IdentificationBadge size={16} weight="regular" />, badge: "89" },
          { name: "Agents / Staff", href: "/dashboard/admin/staff", icon: <UsersThree size={16} weight="regular" /> },
        ],
      },
      {
        label: "LIVE OPS",
        items: [
          { name: "Class Monitor", href: "/dashboard/admin/classes", icon: <VideoCamera size={16} weight="regular" /> },
          { name: "Content Moderation", href: "/dashboard/admin/moderation", icon: <ShieldCheck size={16} weight="regular" /> },
          { name: "Dispute Resolution", href: "/dashboard/admin/disputes", icon: <Scales size={16} weight="regular" />, badge: "23" },
          { name: "Lead Management", href: "/dashboard/admin/leads", icon: <Megaphone size={16} weight="regular" /> },
        ],
      },
      {
        label: "FINANCIAL",
        items: [
          { name: "Revenue & Escrow", href: "/dashboard/admin/revenue", icon: <CurrencyDollar size={16} weight="regular" /> },
          { name: "Payouts", href: "/dashboard/admin/payouts", icon: <Wallet size={16} weight="regular" /> },
          { name: "Refunds", href: "/dashboard/admin/refunds", icon: <ArrowsClockwise size={16} weight="regular" /> },
          { name: "Invoices & Taxes", href: "/dashboard/admin/invoices", icon: <Receipt size={16} weight="regular" /> },
        ],
      },
      {
        label: "AI GOVERNANCE",
        items: [
          { name: "Usage Metrics", href: "/dashboard/admin/ai-usage", icon: <Brain size={16} weight="regular" /> },
          { name: "Quotas & API Keys", href: "/dashboard/admin/api-keys", icon: <Key size={16} weight="regular" /> },
          { name: "AI Workflow Rules", href: "/dashboard/admin/ai-workflows", icon: <GitBranch size={16} weight="regular" /> },
          { name: "Ethics Controls", href: "/dashboard/admin/ai-ethics", icon: <ToggleRight size={16} weight="regular" /> },
        ],
      },
      {
        label: "SYSTEM & AUDIT",
        items: [
          { name: "Audit Logs", href: "/dashboard/admin/audit", icon: <ListBullets size={16} weight="regular" /> },
          { name: "Feature Flags", href: "/dashboard/admin/flags", icon: <Flag size={16} weight="regular" /> },
          { name: "Emergency Controls", href: "/dashboard/admin/emergency", icon: <Lightning size={16} weight="regular" /> },
          { name: "Overrides", href: "/dashboard/admin/overrides", icon: <Wrench size={16} weight="regular" /> },
        ],
      },
    ],
    []
  );

  return (
    <aside
      className={`bg-[#FAFAFA] border-r border-[#EAEAEA] flex flex-col shrink-0 h-screen sticky top-0 overflow-y-auto custom-scrollbar transition-all duration-[220ms] ease-[cubic-bezier(0.4,0,0.2,1)] font-matter ${
        isOpen ? "w-[260px]" : "w-[68px]"
      }`}
    >
      {/* Header / Logo Area */}
      <div className={`flex items-center justify-between px-5 pt-[22px] pb-[16px] shrink-0 sticky top-0 bg-[#FAFAFA] z-10 ${
        !isOpen ? "flex-col justify-center px-0 gap-4" : ""
      }`}>
        {isOpen ? (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#111111] flex items-center justify-center shrink-0">
               <span className="text-white text-[12px] font-bold">H</span>
            </div>
            <span className="text-[#111] font-medium text-[14px] tracking-tight">HomeGuru</span>
          </div>
        ) : (
          <div className="w-8 h-8 rounded bg-[#111111] flex items-center justify-center shrink-0">
            <span className="text-white text-[14px] font-bold">HG</span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="text-[#999] hover:text-[#111] p-1.5 rounded-md transition-colors flex cursor-pointer border-none bg-transparent hover:bg-[#EAEAEA]"
          title="Toggle Sidebar (Cmd+B)"
        >
          <SidebarSimple size={16} weight="duotone" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 w-full overflow-y-auto overflow-x-hidden pb-4 custom-scrollbar">
        {navGroups.map((group, index) => {
          const isExpanded = expandedGroups[group.label] !== false;
          return (
            <div key={index} className={`py-1.5 ${index === 0 ? "pt-2" : ""}`}>
              {isOpen && (
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="w-full flex items-center justify-between px-5 py-1.5 min-h-[28px] text-[10px] font-medium tracking-[0.06em] text-[#888] font-matter border-none bg-transparent cursor-pointer group-hover:text-[#555] transition-colors"
                >
                  <span>{group.label}</span>
                  <span className={`inline-flex transition-transform duration-200 text-[#CCC] ${isExpanded ? "rotate-0" : "-rotate-90"}`}>
                    <CaretDown size={12} weight="bold" />
                  </span>
                </button>
              )}
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen
                  ? isExpanded ? "max-h-[500px] opacity-100 visible" : "max-h-0 opacity-0 invisible"
                  : "max-h-full opacity-100 visible"
              }`}>
                <ul className="flex flex-col m-0 p-0 list-none">
                  {group.items.map((item, itemIdx) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={itemIdx}>
                        <Link
                          href={item.href}
                          prefetch={false}
                          className={`flex items-center rounded-md text-[13px] transition-colors duration-[130ms] border-none select-none text-left font-matter group relative ${
                            isOpen
                              ? "gap-2.5 px-3 py-1.5 mx-3 my-[1px] w-[calc(100%-24px)] min-h-[32px]"
                              : "gap-0 p-2 mx-2 my-[2px] justify-center min-h-[36px] w-[36px]"
                          } ${
                            isActive
                              ? "bg-[#EAEAEA]/60 text-[#111] font-medium"
                              : "text-[#666] font-normal hover:bg-[#EAEAEA]/40 hover:text-[#333] bg-transparent"
                          }`}
                          title={!isOpen ? item.name : ""}
                        >
                          <span className={`inline-flex shrink-0 ${isActive ? "text-[#111]" : "text-[#888] group-hover:text-[#555]"}`}>
                            {item.icon}
                          </span>
                          {isOpen && (
                            <span className="overflow-hidden text-ellipsis whitespace-nowrap flex-1 leading-tight">
                              {item.name}
                            </span>
                          )}
                          {isOpen && item.badge && isActive ? (
                             <span className="text-[10px] font-medium text-[#111] bg-[#FFF] border border-[#EAEAEA] shadow-sm px-1.5 py-0.5 rounded-full leading-none">
                               {item.badge}
                             </span>
                          ) : isOpen && item.badge ? (
                            <span className="text-[10px] font-medium text-[#888] px-1.5 py-0.5 rounded-full leading-none group-hover:text-[#555]">
                              {item.badge}
                            </span>
                          ) : null}
                          {isActive && !isOpen && (
                            <span className="absolute left-[-8px] w-1 h-4 bg-[#111] rounded-r-md"></span>
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
      <div className={`mt-auto border-t border-[#EAEAEA] shrink-0 flex items-center gap-3 transition-all ${
        isOpen ? "px-4 py-3 mx-2 my-2 rounded-lg hover:bg-[#EAEAEA]/40 cursor-pointer" : "justify-center py-4 px-0 flex-col"
      }`}>
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#333] to-[#111] text-white flex items-center justify-center shrink-0 shadow-sm relative">
           <span className="text-[11px] font-medium">A</span>
           <div className="absolute bottom-[-2px] right-[-2px] w-2.5 h-2.5 bg-[#10b981] border-2 border-[#FAFAFA] rounded-full"></div>
        </div>
        {isOpen && (
          <div className="flex flex-col min-w-0 flex-1">
             <span className="text-[13px] text-[#111] font-medium whitespace-nowrap overflow-hidden text-ellipsis leading-tight">
               System Admin
             </span>
             <span className="text-[11px] text-[#888] leading-tight">
                Global Scope
             </span>
          </div>
        )}
      </div>
    </aside>
  );
}

export default memo(AdminSidebar);
