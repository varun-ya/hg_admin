"use client";
import { useState } from "react";
import StaffKPIRibbon from "@/components/admin/staff/StaffKPIRibbon";
import StaffTable from "@/components/admin/staff/StaffTable";
import StaffDrawer from "@/components/admin/staff/StaffDrawer";
import RBACMatrix from "@/components/admin/staff/RBACMatrix";
import type { StaffMember } from "@/components/admin/staff/staffTypes";

export default function StaffPage() {
  const [selected, setSelected] = useState<StaffMember | null>(null);
  const [tab, setTab] = useState<"directory" | "rbac">("directory");

  return (
    <>
      <div className="flex flex-col gap-8 md:gap-10 pt-4">
        <section>
          <StaffKPIRibbon />
        </section>

        {/* Tab switcher */}
        <section>
          <div className="flex items-center gap-1 mb-6">
            <TabButton active={tab === "directory"} onClick={() => setTab("directory")}>Staff Directory</TabButton>
            <TabButton active={tab === "rbac"} onClick={() => setTab("rbac")}>Aegis RBAC Matrix</TabButton>
          </div>
          {tab === "directory" ? (
            <StaffTable onSelectStaff={setSelected} />
          ) : (
            <RBACMatrix />
          )}
        </section>
      </div>
      <StaffDrawer staff={selected} onClose={() => setSelected(null)} />
    </>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-[13px] font-medium transition-all cursor-pointer border-none ${
        active
          ? "bg-[#1A1A1A] text-white"
          : "bg-transparent text-[#ACACAC] hover:bg-[#F5F5F5] hover:text-[#1A1A1A]"
      }`}
    >
      {children}
    </button>
  );
}
