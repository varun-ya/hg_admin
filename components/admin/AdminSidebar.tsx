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
  CaretLeft,
  CaretRight,
  CaretDown,
  User as UserIcon,
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

  const handleToggleOpen = useCallback(() => setIsOpen(true), [setIsOpen]);
  const handleToggleClose = useCallback(() => setIsOpen(false), [setIsOpen]);

  const navGroups = useMemo(
    () => [
      {
        label: "PLATFORM COMMAND",
        items: [
          { name: "Health Dashboard", href: "/dashboard/admin", icon: <House size={18} weight="regular" /> },
          { name: "Global Analytics", href: "/dashboard/admin/analytics", icon: <ChartLineUp size={18} weight="regular" /> },
        ],
      },
      {
        label: "USER LIFECYCLE",
        items: [
          { name: "Students", href: "/dashboard/admin/students", icon: <Student size={18} weight="regular" /> },
          { name: "Teachers", href: "/dashboard/admin/teachers", icon: <ChalkboardTeacher size={18} weight="regular" /> },
          { name: "KYC Pipeline", href: "/dashboard/admin/kyc", icon: <IdentificationBadge size={18} weight="regular" />, badge: "89" },
          { name: "Agents / Staff", href: "/dashboard/admin/staff", icon: <UsersThree size={18} weight="regular" /> },
        ],
      },
      {
        label: "LIVE OPS",
        items: [
          { name: "Class Monitor", href: "/dashboard/admin/classes", icon: <VideoCamera size={18} weight="regular" /> },
          { name: "Content Moderation", href: "/dashboard/admin/moderation", icon: <ShieldCheck size={18} weight="regular" /> },
          { name: "Dispute Resolution", href: "/dashboard/admin/disputes", icon: <Scales size={18} weight="regular" />, badge: "23" },
          { name: "Lead Management", href: "/dashboard/admin/leads", icon: <Megaphone size={18} weight="regular" /> },
        ],
      },
      {
        label: "FINANCIAL",
        items: [
          { name: "Revenue & Escrow", href: "/dashboard/admin/revenue", icon: <CurrencyDollar size={18} weight="regular" /> },
          { name: "Payouts", href: "/dashboard/admin/payouts", icon: <Wallet size={18} weight="regular" /> },
          { name: "Refunds", href: "/dashboard/admin/refunds", icon: <ArrowsClockwise size={18} weight="regular" /> },
          { name: "Invoices & Taxes", href: "/dashboard/admin/invoices", icon: <Receipt size={18} weight="regular" /> },
        ],
      },
      {
        label: "AI GOVERNANCE",
        items: [
          { name: "Usage Metrics", href: "/dashboard/admin/ai-usage", icon: <Brain size={18} weight="regular" /> },
          { name: "Quotas & API Keys", href: "/dashboard/admin/api-keys", icon: <Key size={18} weight="regular" /> },
          { name: "AI Workflow Rules", href: "/dashboard/admin/ai-workflows", icon: <GitBranch size={18} weight="regular" /> },
          { name: "Ethics Controls", href: "/dashboard/admin/ai-ethics", icon: <ToggleRight size={18} weight="regular" /> },
        ],
      },
      {
        label: "SYSTEM & AUDIT",
        items: [
          { name: "Audit Logs", href: "/dashboard/admin/audit", icon: <ListBullets size={18} weight="regular" /> },
          { name: "Feature Flags", href: "/dashboard/admin/flags", icon: <Flag size={18} weight="regular" /> },
          { name: "Emergency Controls", href: "/dashboard/admin/emergency", icon: <Lightning size={18} weight="regular" /> },
          { name: "Overrides", href: "/dashboard/admin/overrides", icon: <Wrench size={18} weight="regular" /> },
        ],
      },
    ],
    []
  );

  return (
    <aside
      className={`bg-white border-r border-[#F0F0F0] flex flex-col shrink-0 h-screen sticky top-0 overflow-y-auto custom-scrollbar transition-all duration-[220ms] ease-[cubic-bezier(0.4,0,0.2,1)] font-matter ${
        isOpen ? "w-[250px]" : "w-[72px]"
      }`}
    >
      {/* Logo */}
      <div className={`flex items-center justify-between px-5 pt-[24px] pb-[20px] shrink-0 ${
        !isOpen ? "justify-center px-0" : ""
      }`}>
        {isOpen ? (
          <>
            <Image
              src="/images/homeguru.png"
              alt="HomeGuru Logo"
              width={86}
              height={28}
              className="object-contain"
            />
            <button
              onClick={handleToggleClose}
              className="text-[#ccc] hover:text-[#999] p-1 rounded-md transition-colors flex cursor-pointer border-none bg-transparent"
            >
              <CaretLeft size={18} weight="bold" />
            </button>
          </>
        ) : (
          <button
            onClick={handleToggleOpen}
            className="text-[#ccc] hover:text-[#999] p-1 rounded-md transition-colors flex cursor-pointer border-none bg-transparent"
          >
            <CaretRight size={18} weight="bold" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 w-full overflow-y-auto overflow-x-hidden pb-4 custom-scrollbar">
        {navGroups.map((group, index) => {
          const isExpanded = expandedGroups[group.label] !== false;
          return (
            <div key={index} className={`py-2 ${index === 0 ? "pt-0" : ""}`}>
              {isOpen && (
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="w-full flex items-center justify-between px-5 py-2 text-[11px] font-medium tracking-[0.08em] uppercase text-[#C0C0C0] font-matter border-none bg-transparent cursor-pointer"
                >
                  <span>{group.label}</span>
                  <span className={`inline-flex transition-transform duration-200 ${isExpanded ? "rotate-0" : "rotate-180"}`}>
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
                          className={`flex items-center rounded-lg text-[14px] transition-colors duration-[130ms] border-none select-none text-left font-matter ${
                            isOpen
                              ? "gap-3 px-4 py-2.5 mx-2.5 my-[1px] w-[calc(100%-20px)]"
                              : "gap-0 p-2.5 mx-2.5 my-[2px] justify-center"
                          } ${
                            isActive
                              ? "bg-[#293763]/8 text-[#293763] font-medium"
                              : "text-[#777] font-normal hover:bg-[#FAFAFA] bg-transparent"
                          }`}
                          title={!isOpen ? item.name : ""}
                        >
                          <span className="inline-flex shrink-0">{item.icon}</span>
                          {isOpen && (
                            <span className="overflow-hidden text-ellipsis whitespace-nowrap flex-1 leading-tight">
                              {item.name}
                            </span>
                          )}
                          {isOpen && item.badge && (
                            <span className="text-[10px] font-medium text-[#ACACAC] bg-[#F0F0F0] px-1.5 py-0.5 rounded-full leading-none">
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

      {/* Footer */}
      <div className={`border-t border-[#F5F5F5] shrink-0 flex items-center gap-3 ${
        isOpen ? "px-5 py-4" : "justify-center py-4 px-0"
      }`}>
        <div className="w-8 h-8 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center shrink-0 cursor-pointer">
          <UserIcon size={16} weight="regular" />
        </div>
        {isOpen && (
          <span className="text-[14px] text-[#555] font-normal whitespace-nowrap overflow-hidden text-ellipsis font-matter">
            Admin Portal
          </span>
        )}
      </div>
    </aside>
  );
}

export default memo(AdminSidebar);
