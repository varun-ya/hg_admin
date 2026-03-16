"use client";
import { useState } from "react";
import { UsersThree, Brain, WhatsappLogo, TrendUp, ListBullets, Kanban } from "@phosphor-icons/react";
import LiveOpsKPIRibbon from "@/components/admin/LiveOpsKPIRibbon";
import LeadPipelineTable from "@/components/admin/leads/LeadPipelineTable";
import LeadKanbanBoard from "@/components/admin/leads/LeadKanbanBoard";
import LeadDrawer from "@/components/admin/leads/LeadDrawer";
import { leadKPIs, leadSparklines } from "@/components/admin/leads/leadMockData";
import type { Lead } from "@/components/admin/leads/leadTypes";

const ICONS = [
  <UsersThree size={20} weight="regular" className="text-[#999]" />,
  <Brain size={20} weight="regular" className="text-[#999]" />,
  <WhatsappLogo size={20} weight="regular" className="text-[#999]" />,
  <TrendUp size={20} weight="regular" className="text-[#999]" />,
];

export default function LeadsPage() {
  const [selected, setSelected] = useState<Lead | null>(null);
  const [view, setView] = useState<"list" | "kanban">("list");
  const items = leadKPIs.map((k, i) => ({ ...k, icon: ICONS[i] }));

  return (
    <>
      <div className="flex flex-col gap-8 md:gap-10 pt-4">
        <section>
          <LiveOpsKPIRibbon items={items} sparklines={leadSparklines} />
        </section>

        <section>
          {/* Section header with view toggle */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">CRM Pipeline</h3>
            <div className="flex items-center bg-[#F5F5F5] rounded-xl p-[3px]">
              <button
                onClick={() => setView("list")}
                className={`flex items-center gap-1.5 px-3.5 py-[7px] rounded-lg text-[12px] font-medium transition-all cursor-pointer border-none ${
                  view === "list" ? "bg-white text-[#1A1A1A] shadow-sm" : "bg-transparent text-[#ACACAC] hover:text-[#777]"
                }`}
              >
                <ListBullets size={13} weight={view === "list" ? "bold" : "regular"} /> List View
              </button>
              <button
                onClick={() => setView("kanban")}
                className={`flex items-center gap-1.5 px-3.5 py-[7px] rounded-lg text-[12px] font-medium transition-all cursor-pointer border-none ${
                  view === "kanban" ? "bg-white text-[#1A1A1A] shadow-sm" : "bg-transparent text-[#ACACAC] hover:text-[#777]"
                }`}
              >
                <Kanban size={13} weight={view === "kanban" ? "bold" : "regular"} /> Pipeline View
              </button>
            </div>
          </div>

          {view === "list" ? (
            <LeadPipelineTable onSelectLead={setSelected} />
          ) : (
            <LeadKanbanBoard onSelectLead={setSelected} />
          )}
        </section>
      </div>
      <LeadDrawer lead={selected} onClose={() => setSelected(null)} />
    </>
  );
}
