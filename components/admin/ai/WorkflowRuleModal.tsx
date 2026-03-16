"use client";
import { useState, useEffect, memo } from "react";
import {
  X, Lightning, CaretDown, Plus, Trash, FloppyDisk, ArrowRight,
} from "@phosphor-icons/react";
import type { WorkflowRule, WorkflowStep, TriggerEvent } from "./aiTypes";
import { TRIGGER_LABELS, ENGINE_LABELS, ENGINE_COLORS } from "./aiTypes";

const TRIGGERS: TriggerEvent[] = ["class_ends", "booking_created", "churn_signal", "lead_inbound", "kyc_submitted", "payment_received"];
const ENGINES: WorkflowStep["engine"][] = ["osmium_videomeet", "osmium_llm", "lmlens", "system"];

const ACTION_SUGGESTIONS: Record<WorkflowStep["engine"], string[]> = {
  osmium_videomeet: ["Process Recording", "Extract Audio Track", "Generate Thumbnails"],
  osmium_llm: ["Generate Transcript & Speaker Diarization", "Create Follow-up Quiz", "Analyze Engagement Pattern", "Generate Personalized Nudge", "Score Lead Intent", "Quality & Compliance Check", "Calculate Tax Components", "Cross-Reference & Validate", "Generate Prep Summary", "Generate Qualification Summary"],
  lmlens: ["Extract Document Fields", "Generate PDF Invoice", "Extract Content Metadata"],
  system: ["Send WhatsApp Notification", "Send Push Notification", "Schedule Follow-up Call", "Route to Agent Queue", "Update KYC Status", "Email Receipt to Student", "Send Confirmation Email", "Create Calendar Event", "Flag if Below Threshold"],
};

interface Props {
  workflow: WorkflowRule | null;
  onClose: () => void;
  onSave: (w: WorkflowRule) => void;
}

function WorkflowRuleModal({ workflow, onClose, onSave }: Props) {
  const [trigger, setTrigger] = useState<TriggerEvent>("class_ends");
  const [steps, setSteps] = useState<WorkflowStep[]>([]);

  useEffect(() => {
    if (workflow) {
      setTrigger(workflow.trigger);
      setSteps([...workflow.steps]);
    }
  }, [workflow]);

  useEffect(() => {
    if (!workflow) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [workflow, onClose]);

  if (!workflow) return null;

  const addStep = () => {
    setSteps([...steps, { engine: "osmium_llm", action: "New Action" }]);
  };

  const removeStep = (idx: number) => {
    setSteps(steps.filter((_, i) => i !== idx));
  };

  const updateStep = (idx: number, field: keyof WorkflowStep, value: string) => {
    setSteps(steps.map((s, i) => (i === idx ? { ...s, [field]: value } : s)));
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center font-matter">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] w-[640px] max-w-[95vw] max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-7 py-5 border-b border-[#F0F0F0] flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">{workflow.name}</h3>
            <p className="text-[12px] text-[#CACACA] mt-0.5">Configure trigger and action pipeline</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-[#F7F7F7] border border-[#F0F0F0] flex items-center justify-center text-[#ACACAC] hover:text-[#1A1A1A] hover:border-[#DCDCDC] cursor-pointer transition-all"><X size={14} weight="bold" /></button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-7 space-y-6">
          {/* Trigger */}
          <div>
            <p className="text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.12em] mb-3">Trigger Event</p>
            <div className="relative">
              <div className="flex items-center gap-2 px-4 py-3 bg-[#FEF3C7]/30 border border-[#F59E0B]/20 rounded-xl">
                <Lightning size={14} weight="fill" className="text-[#F59E0B] shrink-0" />
                <select
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value as TriggerEvent)}
                  className="appearance-none flex-1 bg-transparent text-[13px] font-medium text-[#1A1A1A] focus:outline-none cursor-pointer font-matter"
                >
                  {TRIGGERS.map((t) => <option key={t} value={t}>{TRIGGER_LABELS[t]}</option>)}
                </select>
                <CaretDown size={12} className="text-[#F59E0B] shrink-0" />
              </div>
            </div>
          </div>

          {/* Action Pipeline */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.12em]">Actions Pipeline</p>
              <button
                onClick={addStep}
                className="flex items-center gap-1 text-[11px] font-medium text-[#8B5CF6] bg-transparent border-none cursor-pointer hover:text-[#7C3AED] transition-colors"
              >
                <Plus size={11} weight="bold" /> Add Step
              </button>
            </div>

            <div className="space-y-0">
              {steps.map((step, i) => (
                <div key={i}>
                  {/* Connector */}
                  {i > 0 && (
                    <div className="flex items-center justify-center py-1">
                      <div className="w-[1.5px] h-4 bg-[#F0F0F0]" />
                    </div>
                  )}

                  {/* Step Card */}
                  <div
                    className="rounded-xl border p-4 transition-all"
                    style={{
                      backgroundColor: `${ENGINE_COLORS[step.engine]}04`,
                      borderColor: `${ENGINE_COLORS[step.engine]}15`,
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-medium text-white" style={{ backgroundColor: ENGINE_COLORS[step.engine] }}>
                          {i + 1}
                        </span>
                        <span className="text-[10px] font-medium uppercase tracking-[0.08em]" style={{ color: ENGINE_COLORS[step.engine] }}>
                          {ENGINE_LABELS[step.engine]}
                        </span>
                      </div>
                      <button
                        onClick={() => removeStep(i)}
                        className="w-6 h-6 rounded-md flex items-center justify-center text-[#DCDCDC] hover:text-[#E11D48] hover:bg-[#FEF2F2] bg-transparent border-none cursor-pointer transition-all"
                      >
                        <Trash size={12} />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Engine Select */}
                      <div className="relative w-[160px]">
                        <select
                          value={step.engine}
                          onChange={(e) => updateStep(i, "engine", e.target.value)}
                          className="appearance-none w-full h-[34px] pl-3 pr-7 border border-[#F0F0F0] rounded-lg text-[12px] text-[#1A1A1A] bg-white focus:outline-none cursor-pointer font-matter"
                        >
                          {ENGINES.map((eng) => <option key={eng} value={eng}>{ENGINE_LABELS[eng]}</option>)}
                        </select>
                        <CaretDown size={10} weight="bold" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#DCDCDC] pointer-events-none" />
                      </div>

                      <ArrowRight size={12} className="text-[#DCDCDC] shrink-0" />

                      {/* Action Select */}
                      <div className="relative flex-1">
                        <select
                          value={step.action}
                          onChange={(e) => updateStep(i, "action", e.target.value)}
                          className="appearance-none w-full h-[34px] pl-3 pr-7 border border-[#F0F0F0] rounded-lg text-[12px] text-[#1A1A1A] bg-white focus:outline-none cursor-pointer font-matter"
                        >
                          <option value={step.action}>{step.action}</option>
                          {ACTION_SUGGESTIONS[step.engine]
                            .filter((a) => a !== step.action)
                            .map((a) => <option key={a} value={a}>{a}</option>)}
                        </select>
                        <CaretDown size={10} weight="bold" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#DCDCDC] pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-7 py-4 border-t border-[#F0F0F0] flex items-center justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2.5 text-[12px] font-medium text-[#777] bg-white border border-[#F0F0F0] rounded-lg hover:bg-[#FAFAFA] transition-colors cursor-pointer">
            Cancel
          </button>
          <button
            onClick={() => onSave({ ...workflow, trigger, steps })}
            className="flex items-center gap-1.5 px-5 py-2.5 text-[12px] font-medium text-white bg-[#293763] rounded-lg hover:bg-[#1E2A4A] transition-all cursor-pointer border-none active:scale-95"
          >
            <FloppyDisk size={13} weight="bold" /> Save & Deploy
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(WorkflowRuleModal);
