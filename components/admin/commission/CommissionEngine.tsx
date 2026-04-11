"use client";
import { useState, memo } from "react";
import { Scales, CurrencyDollar, Globe, Receipt, CaretRight, X, CheckCircle } from "@phosphor-icons/react";
import { commissionRules, fxRates, taxRules } from "./commissionMockData";
import type { CommissionRule } from "./commissionTypes";

function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-[300] flex items-center gap-3 bg-[#1A1A1A] text-white px-4 py-3 rounded-xl shadow-lg animate-fadeIn">
      <CheckCircle size={14} weight="fill" className="text-[#E08A3C] shrink-0" />
      <span className="text-[13px]">{msg}</span>
      <button onClick={onClose} className="ml-2 text-white/50 hover:text-white bg-transparent border-none cursor-pointer"><X size={12} weight="bold" /></button>
    </div>
  );
}

function NewRuleModal({ onClose, onSave }: { onClose: () => void; onSave: (name: string, rate: string) => void }) {
  const [name, setName] = useState("");
  const [trigger, setTrigger] = useState("flat");
  const [rate, setRate] = useState("");
  const [conditions, setConditions] = useState("");
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/15 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-[460px] max-w-[95vw] border border-[#F0F0F0] overflow-hidden">
        <div className="px-7 py-5 flex items-center justify-between border-b border-[#F5F5F5]">
          <h3 className="text-[15px] font-medium text-[#1A1A1A]">New Commission Rule</h3>
          <button onClick={onClose} className="text-[#CACACA] hover:text-[#999] bg-transparent border-none cursor-pointer"><X size={16} weight="bold" /></button>
        </div>
        <div className="px-7 py-5 space-y-4">
          <div>
            <label className="text-[11px] font-medium text-[#999] uppercase tracking-wider block mb-1.5">Rule Name *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Premium Subject Boost" className="w-full h-[38px] px-3 border border-[#EBEBEB] rounded-lg text-[13px] focus:outline-none focus:border-[#1A1A1A] transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-[#999] uppercase tracking-wider block mb-1.5">Trigger Type</label>
              <select value={trigger} onChange={(e) => setTrigger(e.target.value)} className="w-full h-[38px] px-3 border border-[#EBEBEB] rounded-lg text-[13px] bg-white focus:outline-none focus:border-[#1A1A1A] transition-all">
                {["flat", "subject", "volume", "tiered"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-medium text-[#999] uppercase tracking-wider block mb-1.5">Rate *</label>
              <input value={rate} onChange={(e) => setRate(e.target.value)} placeholder="e.g. 18% or $5 flat" className="w-full h-[38px] px-3 border border-[#EBEBEB] rounded-lg text-[13px] focus:outline-none focus:border-[#1A1A1A] transition-all" />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-medium text-[#999] uppercase tracking-wider block mb-1.5">Conditions</label>
            <input value={conditions} onChange={(e) => setConditions(e.target.value)} placeholder="e.g. Subject = IELTS, Rating ≥ 4.5" className="w-full h-[38px] px-3 border border-[#EBEBEB] rounded-lg text-[13px] focus:outline-none focus:border-[#1A1A1A] transition-all" />
          </div>
        </div>
        <div className="px-7 pb-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-[13px] text-[#777] bg-white border border-[#EBEBEB] rounded-lg hover:bg-[#FAFAFA] cursor-pointer">Cancel</button>
          <button disabled={!name || !rate} onClick={() => { onSave(name, rate); onClose(); }} className={`px-4 py-2 text-[13px] font-medium rounded-lg border-none cursor-pointer transition-all ${
            name && rate ? "bg-[#1A1A1A] text-white hover:bg-[#333]" : "bg-[#F0F0F0] text-[#CACACA] cursor-not-allowed"
          }`}>Create Rule</button>
        </div>
      </div>
    </div>
  );
}

const STATUS_STYLE: Record<string, string> = {
  active: "bg-[#F0F0F0] text-[#1A1A1A]",
  draft: "bg-[#FFF7ED] text-[#9A3412]",
  archived: "bg-[#F5F5F5] text-[#ACACAC]",
};

const TRIGGER_STYLE: Record<string, string> = {
  flat: "bg-[#F0F0F0] text-[#666]",
  subject: "bg-[#FFF7ED] text-[#E08A3C]",
  volume: "bg-[#FFF8F3] text-[#E08A3C]",
  tiered: "bg-[#FFF8F3] text-[#E08A3C]",
};

function CommissionEngine() {
  const [rules, setRules] = useState(commissionRules);
  const [showNewRule, setShowNewRule] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  return (
    <div className="flex flex-col gap-6">
      {/* Commission Rules */}
      <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
        <div className="flex items-center justify-between px-7 py-5">
          <div className="flex items-center gap-2.5">
            <Scales size={17} weight="regular" className="text-[#999]" />
            <h3 className="text-[15px] font-medium text-[#1A1A1A]">Commission Rule Builder</h3>
          </div>
          <button onClick={() => setShowNewRule(true)} className="px-4 py-2 bg-[#1A1A1A] text-white rounded-full text-[12px] font-medium hover:bg-[#333] transition-all cursor-pointer border-none">
            + New Rule
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-t border-[#F5F5F5]">
                {["Rule Name", "Type", "Conditions", "Rate", "Status", "Applied To", "Revenue (30d)", ""].map((h) => (
                  <th key={h} className="py-3 px-4 first:pl-7 last:pr-7 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rules.map((r, i) => (
                <tr key={r.id} className={`hover:bg-[#FAFAFA] transition-colors cursor-pointer ${i > 0 ? "border-t border-[#F8F8F8]" : ""}`}>
                  <td className="py-4 px-4 pl-7">
                    <span className="text-[13px] text-[#1A1A1A]">{r.name}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`text-[10px] font-medium px-2 py-[2px] rounded-full ${TRIGGER_STYLE[r.trigger]}`}>{r.trigger}</span>
                  </td>
                  <td className="py-4 px-4 text-[12px] text-[#666] max-w-[200px] truncate">{r.conditions}</td>
                  <td className="py-4 px-4 text-[13px] font-medium text-[#1A1A1A] tabular-nums">{r.rate}</td>
                  <td className="py-4 px-4">
                    <span className={`text-[10px] font-medium px-2 py-[2px] rounded-full ${STATUS_STYLE[r.status]}`}>{r.status}</span>
                  </td>
                  <td className="py-4 px-4 text-[12px] text-[#666] tabular-nums">{r.appliedTo.toLocaleString()}</td>
                  <td className="py-4 px-4 text-[12px] text-[#1A1A1A] tabular-nums">{r.revenue30d}</td>
                  <td className="py-4 px-4 pr-7"><CaretRight size={12} className="text-[#DCDCDC]" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FX Risk Management */}
        <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
          <div className="flex items-center justify-between px-7 py-5">
            <div className="flex items-center gap-2.5">
              <Globe size={15} weight="regular" className="text-[#999]" />
              <h3 className="text-[15px] font-medium text-[#1A1A1A]">FX Rate Monitor</h3>
            </div>
            <span className="text-[10px] text-[#CACACA]">Live rates</span>
          </div>
          {fxRates.map((fx, i) => (
            <div key={fx.pair} className={`px-7 py-4 hover:bg-[#FAFAFA] transition-colors ${i > 0 ? "border-t border-[#F5F5F5]" : "border-t border-[#F5F5F5]"}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[13px] font-medium text-[#1A1A1A] font-mono">{fx.pair}</span>
                <span className="text-[15px] font-normal text-[#1A1A1A] tabular-nums">{fx.rate}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#ACACAC]">
                <span>Locked escrow: {fx.lockedEscrow} · Expires {fx.lockExpiry}</span>
                <span className={fx.change24h >= 0 ? "text-[#E08A3C]" : "text-[#C2571A]"}>
                  {fx.change24h >= 0 ? "+" : ""}{fx.change24h}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Tax Compliance */}
        <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
          <div className="flex items-center justify-between px-7 py-5">
            <div className="flex items-center gap-2.5">
              <Receipt size={15} weight="regular" className="text-[#999]" />
              <h3 className="text-[15px] font-medium text-[#1A1A1A]">Tax Compliance</h3>
            </div>
          </div>
          {taxRules.map((t, i) => (
            <div key={t.jurisdiction} className={`px-7 py-4 hover:bg-[#FAFAFA] transition-colors ${i > 0 ? "border-t border-[#F5F5F5]" : "border-t border-[#F5F5F5]"}`}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-[#1A1A1A]">{t.jurisdiction}</span>
                  <span className="text-[10px] font-medium text-[#ACACAC] bg-[#F7F7F7] px-1.5 py-[1px] rounded">{t.taxType} {t.rate}</span>
                </div>
                <span className="text-[13px] font-normal text-[#1A1A1A] tabular-nums">{t.totalWithheld}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#ACACAC]">
                <span>{t.transactionsAffected.toLocaleString()} transactions</span>
                <span className={`flex items-center gap-1 ${t.autoWithhold ? "text-[#E08A3C]" : "text-[#ACACAC]"}`}>
                  <span className={`w-[5px] h-[5px] rounded-full ${t.autoWithhold ? "bg-[#E08A3C]" : "bg-[#DCDCDC]"}`} />
                  {t.autoWithhold ? "Auto-withhold" : "Manual"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showNewRule && (
        <NewRuleModal
          onClose={() => setShowNewRule(false)}
          onSave={(name, rate) => {
            setRules((prev) => [{ id: `rule-${Date.now()}`, name, trigger: "flat" as const, conditions: "All tutors", rate, status: "draft" as const, appliedTo: 0, revenue30d: "$0", createdBy: "admin@homeguruworld.com", createdAt: new Date().toLocaleDateString() }, ...prev]);
            showToast(`Rule "${name}" created as draft`);
          }}
        />
      )}
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

export default memo(CommissionEngine);
