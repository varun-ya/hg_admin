"use client";
import { useState, useEffect, memo } from "react";
import { X, Rocket, Clock, User } from "@phosphor-icons/react";
import type { FeatureFlag, FlagStatus } from "./systemTypes";

const STATUS_STYLE: Record<FlagStatus, string> = { enabled: "bg-[#ECFDF5] text-[#10B981]", disabled: "bg-[#F5F5F5] text-[#999]", partial: "bg-[#FEF3C7] text-[#F59E0B]" };

interface Props { flag: FeatureFlag | null; onClose: () => void }

function FlagDrawer({ flag, onClose }: Props) {
  const [rollout, setRollout] = useState(0);
  const [deployed, setDeployed] = useState(false);

  useEffect(() => { if (flag) { setRollout(flag.rolloutPercent); setDeployed(false); } }, [flag]);
  useEffect(() => { if (!flag) return; const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); }; window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h); }, [flag, onClose]);

  if (!flag) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end font-matter">
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-[480px] max-w-full bg-white h-full shadow-[-8px_0_30px_-10px_rgba(0,0,0,0.08)] flex flex-col animate-slideIn">
        <div className="px-7 py-5 border-b border-[#F0F0F0] shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[15px] font-medium text-[#1A1A1A] font-season font-mono">{flag.name}</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-[#F7F7F7] border border-[#F0F0F0] flex items-center justify-center text-[#ACACAC] hover:text-[#1A1A1A] hover:border-[#DCDCDC] cursor-pointer transition-all"><X size={14} weight="bold" /></button>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex px-2.5 py-[3px] rounded-full text-[10.5px] font-medium capitalize ${STATUS_STYLE[flag.status]}`}>{flag.status}</span>
            <span className={`inline-flex px-2.5 py-[3px] rounded-full text-[10.5px] font-medium capitalize ${flag.environment === "production" ? "bg-[#FEF2F2] text-[#E11D48]" : "bg-[#F0F0F0] text-[#777]"}`}>{flag.environment}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-7 space-y-7">
          <p className="text-[12px] text-[#777] leading-relaxed">{flag.description}</p>

          <div>
            <p className="text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.12em] mb-3">Rollout Percentage</p>
            <div className="bg-[#FAFAFA] rounded-xl border border-[#F0F0F0] p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] text-[#ACACAC]">0%</span>
                <span className={`text-[20px] font-normal tabular-nums tracking-tight ${rollout === 100 ? "text-[#10B981]" : rollout > 0 ? "text-[#F59E0B]" : "text-[#ACACAC]"}`}>{rollout}%</span>
                <span className="text-[11px] text-[#ACACAC]">100%</span>
              </div>
              <input type="range" min={0} max={100} step={5} value={rollout} onChange={(e) => setRollout(Number(e.target.value))} className="w-full h-1.5 bg-[#F0F0F0] rounded-full appearance-none cursor-pointer accent-[#293763]" />
              <div className="flex items-center justify-between mt-2">
                {[0, 25, 50, 75, 100].map((v) => (
                  <button key={v} onClick={() => setRollout(v)} className={`text-[10px] font-medium px-2 py-0.5 rounded transition-all cursor-pointer border-none ${rollout === v ? "bg-[#F0F0F0] text-[#1A1A1A]" : "bg-transparent text-[#CACACA] hover:text-[#777]"}`}>{v}%</button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.12em] mb-3">Target Segment</p>
            <div className="bg-[#FAFAFA] rounded-xl border border-[#F0F0F0] p-4">
              <p className="text-[13px] text-[#1A1A1A]">{flag.targetSegment}</p>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.12em] mb-3">Details</p>
            <div className="bg-[#FAFAFA] rounded-xl border border-[#F0F0F0] p-5 space-y-3">
              <Row icon={<Clock size={12} className="text-[#ACACAC]" />} label="Last Modified" value={flag.lastModified} />
              <Row icon={<User size={12} className="text-[#ACACAC]" />} label="Modified By" value={flag.modifiedBy} />
            </div>
          </div>
        </div>

        <div className="px-7 py-4 border-t border-[#F0F0F0] flex items-center justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2.5 text-[12px] font-medium text-[#777] bg-white border border-[#F0F0F0] rounded-lg hover:border-[#DCDCDC] transition-colors cursor-pointer">Cancel</button>
          <button
            onClick={() => setDeployed(true)}
            disabled={deployed}
            className={`flex items-center gap-1.5 px-5 py-2.5 text-[12px] font-medium rounded-lg transition-all border-none cursor-pointer active:scale-95 ${
              deployed ? "bg-[#ECFDF5] text-[#10B981] cursor-default" : "bg-[#293763] text-white hover:bg-[#1E2A4A]"
            }`}
          >
            <Rocket size={13} weight="bold" />
            {deployed ? "Deployed ✓" : "Deploy Flag Update"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (<div className="flex items-center justify-between gap-4"><span className="flex items-center gap-1.5 text-[12px] text-[#999]">{icon}{label}</span><span className="text-[12px] text-[#1A1A1A]">{value}</span></div>);
}

export default memo(FlagDrawer);
