"use client";
import { useState, memo } from "react";
import {
  Lock, Info, Check, X as XIcon, ShieldCheck, Globe, ListBullets,
} from "@phosphor-icons/react";
import { safeguards, regionalScopes } from "./aiMockData";
import type { EthicsSafeguard, RegionalScope } from "./aiTypes";

const CATEGORY_LABELS: Record<EthicsSafeguard["category"], string> = {
  financial: "Financial Autonomy",
  governance: "Account Governance",
  dispute: "Dispute Resolution",
  content: "Content & Safety",
};

function EthicsControls() {
  const [localSafeguards, setLocalSafeguards] = useState(safeguards);
  const [localRegions, setLocalRegions] = useState(regionalScopes);
  const [auditRetention, setAuditRetention] = useState("90");
  const [auditPromptLogging, setAuditPromptLogging] = useState(true);

  const toggleSafeguard = (id: string) => {
    setLocalSafeguards((prev) =>
      prev.map((s) => (s.id === id && !s.locked ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const toggleRegion = (code: string, field: keyof RegionalScope) => {
    setLocalRegions((prev) =>
      prev.map((r) =>
        r.code === code ? { ...r, [field]: !r[field] } : r
      )
    );
  };

  // Group safeguards by category
  const grouped = localSafeguards.reduce<Record<string, EthicsSafeguard[]>>((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {/* Safeguard Toggles */}
      <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
        <div className="px-7 pt-6 pb-5">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#293763]" />
            <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">Human-in-the-Loop Safeguards</h3>
          </div>
          <p className="text-[12px] text-[#CACACA] mt-1">Controls that enforce human oversight on AI decisions</p>
        </div>

        <div className="divide-y divide-[#F5F5F5]">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="px-7 py-5">
              <p className="text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.12em] mb-4">
                {CATEGORY_LABELS[category as EthicsSafeguard["category"]]}
              </p>
              <div className="space-y-4">
                {items.map((s) => (
                  <div key={s.id} className={`flex items-start justify-between gap-4 ${s.locked ? "opacity-70" : ""}`}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[13px] text-[#1A1A1A]">{s.label}</p>
                        {s.locked && (
                          <div className="group relative">
                            <Lock size={12} className="text-[#C2571A] cursor-help" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-[260px] bg-[#1A1A1A] text-white text-[11px] px-3 py-2 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none z-10">
                              {s.lockReason}
                              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-transparent border-t-[#1A1A1A]" />
                            </div>
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] text-[#ACACAC] mt-0.5 leading-relaxed">{s.description}</p>
                    </div>
                    <button
                      onClick={() => toggleSafeguard(s.id)}
                      disabled={s.locked}
                      className={`relative w-11 h-6 rounded-full transition-all shrink-0 mt-0.5 border-none cursor-pointer ${
                        s.locked ? "cursor-not-allowed" : ""
                      } ${s.enabled ? "bg-[#E08A3C]" : "bg-[#DCDCDC]"}`}
                    >
                      <span className={`absolute top-[2px] w-5 h-5 rounded-full bg-white shadow-sm transition-all ${
                        s.enabled ? "left-[22px]" : "left-[2px]"
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Regional Scoping Matrix */}
      <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
        <div className="px-7 pt-6 pb-5">
          <div className="flex items-center gap-2">
            <Globe size={16} className="text-[#3D4D7A]" />
            <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">Regional Scoping Matrix</h3>
          </div>
          <p className="text-[12px] text-[#CACACA] mt-1">Disable Osmium features per region for regulatory compliance</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-t border-b border-[#F5F5F5]">
                <th className="py-3.5 pl-7 pr-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Region</th>
                <th className="py-3.5 px-3 text-center text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Facial Analysis</th>
                <th className="py-3.5 px-3 text-center text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Voice Profiling</th>
                <th className="py-3.5 px-3 text-center text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Auto Moderation</th>
                <th className="py-3.5 pr-7 px-3 text-center text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Sentiment Tracking</th>
              </tr>
            </thead>
            <tbody>
              {localRegions.map((r, i) => (
                <tr key={r.code} className={`${i > 0 ? "border-t border-[#F8F8F8]" : ""}`}>
                  <td className="py-4 pl-7 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-medium text-[#ACACAC] bg-[#F7F7F7] px-1.5 py-0.5 rounded">{r.code}</span>
                      <span className="text-[13px] text-[#1A1A1A]">{r.region}</span>
                    </div>
                  </td>
                  <td className="py-4 px-3 text-center">
                    <MatrixToggle enabled={r.facialAnalysis} onClick={() => toggleRegion(r.code, "facialAnalysis")} />
                  </td>
                  <td className="py-4 px-3 text-center">
                    <MatrixToggle enabled={r.voiceProfiling} onClick={() => toggleRegion(r.code, "voiceProfiling")} />
                  </td>
                  <td className="py-4 px-3 text-center">
                    <MatrixToggle enabled={r.autoModeration} onClick={() => toggleRegion(r.code, "autoModeration")} />
                  </td>
                  <td className="py-4 pr-7 px-3 text-center">
                    <MatrixToggle enabled={r.sentimentTracking} onClick={() => toggleRegion(r.code, "sentimentTracking")} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Logging Configuration */}
      <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
        <div className="px-7 pt-6 pb-5">
          <div className="flex items-center gap-2">
            <ListBullets size={16} className="text-[#999]" />
            <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">Audit Logging Configuration</h3>
          </div>
          <p className="text-[12px] text-[#CACACA] mt-1">Immutable logging of all AI prompts and responses</p>
        </div>

        <div className="px-7 pb-6 space-y-5">
          {/* Prompt Logging Toggle */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[13px] text-[#1A1A1A]">Log all LLM prompts & responses</p>
              <p className="text-[11px] text-[#ACACAC] mt-0.5">Every Osmium LLM interaction is stored immutably for compliance review</p>
            </div>
            <button
              onClick={() => setAuditPromptLogging(!auditPromptLogging)}
              className={`relative w-11 h-6 rounded-full transition-all shrink-0 mt-0.5 border-none cursor-pointer ${auditPromptLogging ? "bg-[#E08A3C]" : "bg-[#DCDCDC]"}`}
            >
              <span className={`absolute top-[2px] w-5 h-5 rounded-full bg-white shadow-sm transition-all ${auditPromptLogging ? "left-[22px]" : "left-[2px]"}`} />
            </button>
          </div>

          {/* Retention Period */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[13px] text-[#1A1A1A]">Log retention period</p>
              <p className="text-[11px] text-[#ACACAC] mt-0.5">How long AI interaction logs are retained before archival</p>
            </div>
            <div className="relative">
              <select
                value={auditRetention}
                onChange={(e) => setAuditRetention(e.target.value)}
                className="appearance-none h-[34px] pl-3 pr-8 border border-[#F0F0F0] rounded-lg text-[12px] text-[#1A1A1A] bg-white focus:outline-none focus:border-[#DCDCDC] cursor-pointer font-matter"
              >
                <option value="30">30 days</option>
                <option value="90">90 days</option>
                <option value="180">180 days</option>
                <option value="365">1 year</option>
                <option value="indefinite">Indefinite</option>
              </select>
              <Info size={10} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#DCDCDC] pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MatrixToggle({ enabled, onClick }: { enabled: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-7 h-7 rounded-lg border flex items-center justify-center cursor-pointer transition-all mx-auto ${
        enabled
          ? "bg-[#FFF7ED] border-[#E08A3C]/20 text-[#E08A3C]"
          : "bg-[#FFF1E6] border-[#C2571A]/10 text-[#C2571A]"
      }`}
    >
      {enabled ? <Check size={12} weight="bold" /> : <XIcon size={12} weight="bold" />}
    </button>
  );
}

export default memo(EthicsControls);
