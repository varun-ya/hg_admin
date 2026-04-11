"use client";
import { useState, memo } from "react";
import { ShieldWarning, CreditCard, ArrowsClockwise, CaretRight, LockKey } from "@phosphor-icons/react";
import { governanceQueue } from "./mockData";
import type { GovernanceItem } from "./types";
import ConfirmModal from "./ConfirmModal";

const TYPE_LABEL: Record<GovernanceItem["type"], string> = {
  flagged_content: "Flagged",
  failed_payment: "Payment",
  pending_refund: "Refund",
};

const SEVERITY_DOT: Record<GovernanceItem["severity"], string> = {
  critical: "bg-[#E08A3C]",
  high: "bg-[#ACACAC]",
  medium: "bg-[#DCDCDC]",
};

function GovernanceQueueWidget() {
  const [approveId, setApproveId] = useState<string | null>(null);
  const item = governanceQueue.find((g) => g.id === approveId);

  return (
    <>
      <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden h-full flex flex-col max-h-[480px]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 shrink-0">
          <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">Urgent Queue</h3>
          <span className="text-[11px] font-normal text-[#ACACAC]">
            {governanceQueue.filter((g) => g.severity === "critical").length} critical
          </span>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {governanceQueue.map((g, i) => (
            <div key={g.id} className={`px-6 py-4 hover:bg-[#FAFAFA] transition-colors group cursor-pointer ${i > 0 ? "border-t border-[#F5F5F5]" : ""}`}>
              <div className="flex items-start gap-3">
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 mt-2 ${SEVERITY_DOT[g.severity]}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-medium text-[#ACACAC] uppercase tracking-wider">
                      {TYPE_LABEL[g.type]}
                    </span>
                    {g.requiresApproval && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-normal text-[#999] uppercase tracking-wider">
                        <LockKey size={9} weight="bold" /> 2-Person
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] font-normal text-[#1A1A1A] truncate">{g.title}</p>
                  <p className="text-[12px] text-[#CACACA] mt-0.5 truncate">{g.description}</p>
                  <div className="flex items-center justify-between mt-2.5">
                    <span className="text-[10px] font-normal text-[#DCDCDC]">{g.timestamp}</span>
                    {g.requiresApproval ? (
                      <button
                        onClick={(e) => { e.stopPropagation(); setApproveId(g.id); }}
                        className="text-[11px] font-medium text-[#1A1A1A] hover:text-black bg-transparent border-none cursor-pointer flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Approve <CaretRight size={10} weight="bold" />
                      </button>
                    ) : (
                      <button className="text-[11px] font-medium text-[#999] hover:text-[#555] bg-transparent border-none cursor-pointer flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        Review <CaretRight size={10} weight="bold" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConfirmModal
        isOpen={!!approveId}
        onClose={() => setApproveId(null)}
        title="Approve High-Value Action"
        description={item ? `${item.title} — ${item.description}. This requires two-person approval and will be logged.` : ""}
        confirmString="CONFIRM-APPROVE"
        onConfirm={() => setApproveId(null)}
        variant="warning"
      />
    </>
  );
}

export default memo(GovernanceQueueWidget);
