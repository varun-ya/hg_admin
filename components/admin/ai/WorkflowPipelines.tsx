"use client";
import { useState, memo } from "react";
import {
  Play, Pause, PencilSimple, CaretRight, Lightning, Clock, CheckCircle,
} from "@phosphor-icons/react";
import { workflows } from "./aiMockData";
import type { WorkflowRule, WorkflowStatus } from "./aiTypes";
import { TRIGGER_LABELS, ENGINE_LABELS, ENGINE_COLORS } from "./aiTypes";
import WorkflowRuleModal from "./WorkflowRuleModal";

const STATUS_STYLE: Record<WorkflowStatus, string> = {
  active: "bg-[#FFF7ED] text-[#E08A3C]",
  paused: "bg-[#FFF7ED] text-[#D4956A]",
  draft: "bg-[#F0F0F0] text-[#999]",
};

function WorkflowPipelines() {
  const [localWorkflows, setLocalWorkflows] = useState(workflows);
  const [editingWorkflow, setEditingWorkflow] = useState<WorkflowRule | null>(null);

  const toggleStatus = (id: string) => {
    setLocalWorkflows((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, status: (w.status === "active" ? "paused" : "active") as WorkflowStatus }
          : w
      )
    );
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
        <div className="px-7 pt-6 pb-5">
          <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">AI Pipelines</h3>
          <p className="text-[12px] text-[#CACACA] mt-1">{localWorkflows.length} workflow{localWorkflows.length !== 1 ? "s" : ""} configured</p>
        </div>

        <div className="divide-y divide-[#F5F5F5]">
          {localWorkflows.map((w) => (
            <div key={w.id} className="px-7 py-5 hover:bg-[#FAFAFA]/40 transition-colors">
              <div className="flex items-start justify-between gap-4">
                {/* Left: Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    <h4 className="text-[14px] font-medium text-[#1A1A1A]">{w.name}</h4>
                    <span className={`inline-flex px-2.5 py-[3px] rounded-full text-[10.5px] font-medium capitalize ${STATUS_STYLE[w.status]}`}>{w.status}</span>
                  </div>
                  <p className="text-[12px] text-[#999] leading-relaxed mb-3">{w.description}</p>

                  {/* Pipeline Steps — Visual */}
                  <div className="flex items-center gap-0 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F7F7F7] rounded-lg text-[10px] font-medium text-[#777] border border-[#F0F0F0]">
                      <Lightning size={10} weight="fill" className="text-[#D4956A]" />
                      {TRIGGER_LABELS[w.trigger]}
                    </span>
                    {w.steps.map((step, i) => (
                      <div key={i} className="flex items-center">
                        <CaretRight size={10} className="text-[#DCDCDC] mx-1" />
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-medium border"
                          style={{
                            backgroundColor: `${ENGINE_COLORS[step.engine]}08`,
                            borderColor: `${ENGINE_COLORS[step.engine]}20`,
                            color: ENGINE_COLORS[step.engine],
                          }}
                        >
                          {step.action}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mt-3">
                    <span className="flex items-center gap-1 text-[10px] text-[#CACACA]">
                      <Clock size={10} /> Last: {w.lastRun}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-[#CACACA]">
                      <CheckCircle size={10} /> {w.executionCount.toLocaleString()} runs
                    </span>
                    <span className="text-[10px] text-[#CACACA]">Avg: {w.avgDuration}</span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0 pt-1">
                  <button
                    onClick={() => setEditingWorkflow(w)}
                    className="w-8 h-8 rounded-lg border border-[#F0F0F0] bg-white flex items-center justify-center text-[#ACACAC] hover:text-[#1A1A1A] hover:border-[#DCDCDC] cursor-pointer transition-all"
                    title="Edit pipeline"
                  >
                    <PencilSimple size={14} />
                  </button>
                  <button
                    onClick={() => toggleStatus(w.id)}
                    disabled={w.status === "draft"}
                    className={`w-8 h-8 rounded-lg border flex items-center justify-center cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                      w.status === "active"
                        ? "border-[#E08A3C]/20 bg-[#FFF7ED] text-[#E08A3C] hover:bg-[#D1FAE5]"
                        : "border-[#F0F0F0] bg-white text-[#ACACAC] hover:text-[#1A1A1A] hover:border-[#DCDCDC]"
                    }`}
                    title={w.status === "active" ? "Pause pipeline" : "Activate pipeline"}
                  >
                    {w.status === "active" ? <Pause size={14} weight="fill" /> : <Play size={14} weight="fill" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <WorkflowRuleModal
        workflow={editingWorkflow}
        onClose={() => setEditingWorkflow(null)}
        onSave={(updated) => {
          setLocalWorkflows((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
          setEditingWorkflow(null);
        }}
      />
    </>
  );
}

export default memo(WorkflowPipelines);
