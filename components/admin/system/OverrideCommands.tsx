"use client";
import { useState, memo } from "react";
import {
  Database, Trash, IdentificationBadge, SignOut, Warning, CheckCircle, Clock, User, Spinner,
} from "@phosphor-icons/react";
import { systemOverrides, overrideLogs } from "./systemMockData";
import type { SystemOverride, OverrideStatus } from "./systemTypes";

const ICONS = [
  <Database size={18} weight="regular" />,
  <Trash size={18} weight="regular" />,
  <IdentificationBadge size={18} weight="regular" />,
  <SignOut size={18} weight="regular" />,
];

const DANGER_BORDER: Record<string, string> = {
  low: "border-[#F0F0F0]",
  medium: "border-[#F59E0B]/20",
  high: "border-[#E11D48]/15",
  critical: "border-[#E11D48]/30",
};

const DANGER_BADGE: Record<string, string> = {
  low: "bg-[#F5F5F5] text-[#999]",
  medium: "bg-[#FEF3C7] text-[#F59E0B]",
  high: "bg-[#FEF2F2] text-[#E11D48]",
  critical: "bg-[#FEF2F2] text-[#E11D48]",
};

const STATUS_ICON: Record<OverrideStatus, React.ReactNode> = {
  idle: <Clock size={12} className="text-[#CACACA]" />,
  running: <Spinner size={12} className="text-[#F59E0B] animate-spin" />,
  completed: <CheckCircle size={12} className="text-[#10B981]" />,
  failed: <Warning size={12} className="text-[#E11D48]" />,
};

function OverrideCommands() {
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [acknowledged, setAcknowledged] = useState<Record<string, boolean>>({});
  const [confirmInput, setConfirmInput] = useState("");
  const [executing, setExecuting] = useState<string | null>(null);

  const handleExecute = (override: SystemOverride) => {
    setExecuting(override.id);
    setTimeout(() => { setExecuting(null); setConfirmId(null); setConfirmInput(""); setAcknowledged({}); }, 1500);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
        <div className="px-7 pt-6 pb-5">
          <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">Override Commands</h3>
          <p className="text-[12px] text-[#CACACA] mt-1">Manual system corrections — use when automated pipelines fail</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-7 pb-7">
          {systemOverrides.map((o, i) => {
            const isConfirming = confirmId === o.id;
            const isExecuting = executing === o.id;

            return (
              <div key={o.id} className={`rounded-2xl border-2 ${DANGER_BORDER[o.dangerLevel]} bg-white p-5 transition-all`}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-[#F7F7F7] text-[#999]">{ICONS[i]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-[13px] font-medium text-[#1A1A1A]">{o.name}</h4>
                      <span className={`text-[9px] font-medium uppercase px-1.5 py-[1px] rounded-full ${DANGER_BADGE[o.dangerLevel]}`}>{o.dangerLevel}</span>
                    </div>
                    <p className="text-[11px] text-[#999] mt-1 leading-relaxed">{o.description}</p>
                  </div>
                </div>

                {isConfirming ? (
                  <div className="space-y-3 mt-4">
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input type="checkbox" checked={acknowledged[o.id] || false} onChange={(e) => setAcknowledged({ ...acknowledged, [o.id]: e.target.checked })} className="mt-0.5 accent-[#1A1A1A]" />
                      <span className="text-[11px] text-[#777] leading-relaxed">I understand the impact of this action</span>
                    </label>
                    <div>
                      <p className="text-[10px] text-[#ACACAC] mb-1">Type <span className="font-mono font-medium text-[#1A1A1A] bg-[#F5F5F5] px-1 py-0.5 rounded">{o.command}</span></p>
                      <input type="text" value={confirmInput} onChange={(e) => setConfirmInput(e.target.value)} placeholder={o.command} className="w-full h-[36px] px-3 border border-[#F0F0F0] rounded-lg text-[12px] font-mono text-[#1A1A1A] placeholder:text-[#DCDCDC] bg-white focus:outline-none focus:border-[#DCDCDC] transition-all" />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleExecute(o)}
                        disabled={!acknowledged[o.id] || confirmInput !== o.command || isExecuting}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[12px] font-medium transition-all border-none cursor-pointer ${
                          acknowledged[o.id] && confirmInput === o.command && !isExecuting
                            ? "bg-[#1A1A1A] text-white hover:bg-[#333] active:scale-95"
                            : "bg-[#F0F0F0] text-[#CACACA] cursor-not-allowed"
                        }`}
                      >
                        {isExecuting ? <><Spinner size={12} className="animate-spin" /> Executing…</> : "Execute"}
                      </button>
                      <button onClick={() => { setConfirmId(null); setConfirmInput(""); setAcknowledged({}); }} className="px-3 py-2 rounded-lg text-[12px] font-medium text-[#777] bg-white border border-[#F0F0F0] hover:border-[#DCDCDC] cursor-pointer transition-all">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setConfirmId(o.id)} className="mt-3 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[12px] font-medium text-[#777] bg-[#FAFAFA] border border-[#F0F0F0] hover:border-[#DCDCDC] hover:text-[#1A1A1A] cursor-pointer transition-all">
                    <Warning size={12} /> Execute Override
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
        <div className="px-7 pt-6 pb-5">
          <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">Recent Overrides</h3>
          <p className="text-[12px] text-[#CACACA] mt-1">Last 5 executed overrides</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-t border-b border-[#F5F5F5]">
                <th className="py-3.5 pl-7 pr-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Override</th>
                <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Executed By</th>
                <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Time</th>
                <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Status</th>
                <th className="py-3.5 pr-7 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Duration</th>
              </tr>
            </thead>
            <tbody>
              {overrideLogs.map((log, i) => (
                <tr key={log.id} className={`${i > 0 ? "border-t border-[#F8F8F8]" : ""}`}>
                  <td className="py-4 pl-7 pr-3"><span className="text-[13px] text-[#1A1A1A]">{log.overrideName}</span></td>
                  <td className="py-4 px-3"><span className="text-[12px] text-[#777]">{log.executedBy}</span></td>
                  <td className="py-4 px-3"><span className="text-[12px] text-[#ACACAC]">{log.executedAt}</span></td>
                  <td className="py-4 px-3"><span className="flex items-center gap-1.5 text-[12px] text-[#777] capitalize">{STATUS_ICON[log.status]} {log.status}</span></td>
                  <td className="py-4 pr-7 px-3"><span className="text-[11px] font-mono text-[#ACACAC]">{log.duration}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default memo(OverrideCommands);
