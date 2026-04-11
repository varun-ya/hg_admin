"use client";
import { useMemo, memo } from "react";
import { Sparkle, WhatsappLogo, Phone } from "@phosphor-icons/react";
import { leads } from "./leadMockData";
import { PIPELINE_STAGES } from "./leadTypes";
import type { Lead, LeadScore, PipelineStage } from "./leadTypes";

const SCORE_STYLE: Record<LeadScore, { bg: string; text: string }> = {
  hot: { bg: "bg-[#FFF1E6]", text: "text-[#C2571A]" },
  warm: { bg: "bg-[#FFF8F3]", text: "text-[#E08A3C]" },
  cold: { bg: "bg-[#F0F0F0]", text: "text-[#999]" },
};

const SOURCE_ICON: Record<string, React.ReactNode> = {
  whatsapp: <WhatsappLogo size={10} weight="fill" />,
  meta_ads: <Sparkle size={10} weight="fill" />,
};

interface Props { onSelectLead: (l: Lead) => void }

function LeadKanbanBoard({ onSelectLead }: Props) {
  const grouped = useMemo(() => {
    const map: Record<PipelineStage, Lead[]> = {
      new_inbound: [], ai_qualified: [], agent_contacted: [], demo_booked: [], converted: [],
    };
    leads.forEach((l) => { if (map[l.pipelineStage]) map[l.pipelineStage].push(l); });
    return map;
  }, []);

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
      {PIPELINE_STAGES.map((stage) => {
        const items = grouped[stage.key];
        return (
          <div
            key={stage.key}
            className="flex-shrink-0 w-[260px] flex flex-col"
            data-stage={stage.key}
          >
            {/* Column header */}
            <div className="flex items-center gap-2.5 mb-4 px-1">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: stage.color }} />
              <span className="text-[12px] font-medium text-[#1A1A1A] font-season">{stage.label}</span>
              <span className="text-[10px] font-medium text-[#CACACA] bg-[#F5F5F5] px-1.5 py-[1px] rounded-full ml-auto tabular-nums">{items.length}</span>
            </div>

            {/* Cards container — droppable zone */}
            <div
              className="flex-1 bg-[#F7F7F7] rounded-2xl p-2.5 space-y-2.5 min-h-[200px]"
              data-droppable={stage.key}
            >
              {items.length === 0 ? (
                <div className="flex items-center justify-center h-[120px]">
                  <p className="text-[11px] text-[#DCDCDC]">No leads</p>
                </div>
              ) : (
                items.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => onSelectLead(lead)}
                    className="bg-white rounded-xl border border-[#F0F0F0] p-4 cursor-pointer hover:border-[#DCDCDC] hover:shadow-sm transition-all duration-150 group"
                    data-draggable={lead.id}
                  >
                    {/* Name + Score */}
                    <div className="flex items-start justify-between mb-2.5">
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-normal text-[#1A1A1A] truncate leading-tight">{lead.name}</p>
                        <p className="text-[10px] text-[#CACACA] font-mono mt-0.5 truncate">{lead.phone}</p>
                      </div>
                      <span className={`inline-flex px-2 py-[2px] rounded-full text-[9px] font-medium capitalize shrink-0 ml-2 ${SCORE_STYLE[lead.aiScore].bg} ${SCORE_STYLE[lead.aiScore].text}`}>
                        {lead.aiScore}
                      </span>
                    </div>

                    {/* Touchpoint */}
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <span className="text-[10px] text-[#ACACAC]">{lead.lastTouchpoint}</span>
                      <span className="text-[#EBEBEB]">·</span>
                      <span className="text-[10px] text-[#DCDCDC]">{lead.lastTouchpointTime}</span>
                    </div>

                    {/* Footer: source + agent */}
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-[10px] text-[#CACACA]">
                        {SOURCE_ICON[lead.source] || null}
                        {lead.utm.campaign !== "—" ? lead.utm.campaign.replace(/_/g, " ").slice(0, 20) : lead.source.replace("_", " ")}
                      </span>
                      {lead.assignedAgent !== "Unassigned" ? (
                        <span className="w-5 h-5 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center text-[8px] font-medium shrink-0" title={lead.assignedAgent}>
                          {lead.assignedAgent.split(" ").map((n) => n[0]).join("")}
                        </span>
                      ) : (
                        <span className="w-5 h-5 rounded-full bg-[#F0F0F0] border border-dashed border-[#DCDCDC] flex items-center justify-center shrink-0" title="Unassigned">
                          <span className="text-[8px] text-[#DCDCDC]">?</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default memo(LeadKanbanBoard);
