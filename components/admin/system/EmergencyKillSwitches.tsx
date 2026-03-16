"use client";
import { useState, memo } from "react";
import {
  ShoppingCart, Wallet, VideoCamera, Wrench, Warning, Clock, User,
} from "@phosphor-icons/react";
import { killSwitches } from "./systemMockData";
import type { KillSwitch } from "./systemTypes";
import EmergencyConfirmModal from "./EmergencyConfirmModal";

const SWITCH_ICONS = [
  <ShoppingCart size={20} weight="regular" />,
  <Wallet size={20} weight="regular" />,
  <VideoCamera size={20} weight="regular" />,
  <Wrench size={20} weight="regular" />,
];

function EmergencyKillSwitches() {
  const [switches, setSwitches] = useState(killSwitches);
  const [confirmTarget, setConfirmTarget] = useState<KillSwitch | null>(null);

  const handleConfirm = () => {
    if (!confirmTarget) return;
    setSwitches((prev) =>
      prev.map((s) => s.id === confirmTarget.id ? { ...s, active: !s.active } : s)
    );
    setConfirmTarget(null);
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
        <div className="px-7 pt-6 pb-5">
          <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">Kill Switches</h3>
          <p className="text-[12px] text-[#CACACA] mt-1">Glass-break emergency controls — use only during active incidents</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-7 pb-7">
          {switches.map((sw, i) => (
            <div
              key={sw.id}
              className={`rounded-2xl border-2 p-6 transition-all duration-300 ${
                sw.active
                  ? "border-[#E11D48] bg-[#FEF2F2]"
                  : "border-[#F0F0F0] bg-white hover:border-[#DCDCDC]"
              }`}
            >
              {/* Active indicator */}
              {sw.active && (
                <div className="flex items-center gap-2 mb-4">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E11D48] opacity-50" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E11D48]" />
                  </span>
                  <span className="text-[11px] font-medium text-[#E11D48] uppercase tracking-[0.08em]">Active</span>
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  sw.active ? "bg-[#E11D48]/10 text-[#E11D48]" : "bg-[#F7F7F7] text-[#999]"
                }`}>
                  {SWITCH_ICONS[i]}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`text-[14px] font-medium ${sw.active ? "text-[#E11D48]" : "text-[#1A1A1A]"}`}>{sw.name}</h4>
                  <p className="text-[12px] text-[#999] mt-1 leading-relaxed">{sw.description}</p>
                </div>
              </div>

              {/* Impact */}
              <div className="mt-4 p-3 bg-[#FAFAFA] rounded-xl border border-[#F0F0F0]">
                <p className="text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em] mb-0.5">Impact</p>
                <p className="text-[11px] text-[#777]">{sw.impact}</p>
              </div>

              {/* Last triggered */}
              {sw.lastTriggered && (
                <div className="flex items-center gap-3 mt-3 text-[10px] text-[#CACACA]">
                  <span className="flex items-center gap-1"><Clock size={10} /> Last: {sw.lastTriggered}</span>
                  <span className="flex items-center gap-1"><User size={10} /> {sw.triggeredBy}</span>
                </div>
              )}

              {/* Toggle Button */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setConfirmTarget(sw)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[12px] font-medium transition-all cursor-pointer active:scale-95 ${
                    sw.active
                      ? "bg-white border border-[#F0F0F0] text-[#1A1A1A] hover:border-[#DCDCDC]"
                      : "bg-[#FEF2F2] border border-[#E11D48]/10 text-[#E11D48] hover:bg-[#FEE2E2]"
                  }`}
                >
                  <Warning size={13} weight="fill" />
                  {sw.active ? "Deactivate Kill Switch" : "Activate Kill Switch"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <EmergencyConfirmModal
        isOpen={!!confirmTarget}
        onClose={() => setConfirmTarget(null)}
        switchName={confirmTarget?.name || ""}
        impact={confirmTarget?.impact || ""}
        onConfirm={handleConfirm}
      />
    </>
  );
}

export default memo(EmergencyKillSwitches);
