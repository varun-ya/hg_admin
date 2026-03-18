"use client";
import { memo } from "react";
import { Scales, CurrencyDollar, Globe, Receipt, CaretRight } from "@phosphor-icons/react";
import { commissionRules, fxRates, taxRules } from "./commissionMockData";

const STATUS_STYLE: Record<string, string> = {
  active: "bg-[#F0F0F0] text-[#1A1A1A]",
  draft: "bg-[#FEF3C7] text-[#92400E]",
  archived: "bg-[#F5F5F5] text-[#ACACAC]",
};

const TRIGGER_STYLE: Record<string, string> = {
  flat: "bg-[#F0F0F0] text-[#666]",
  subject: "bg-[#EEF2FF] text-[#4F46E5]",
  volume: "bg-[#FFF8F3] text-[#E08A3C]",
  tiered: "bg-[#FFF8F3] text-[#E08A3C]",
};

function CommissionEngine() {
  return (
    <div className="flex flex-col gap-6">
      {/* Commission Rules */}
      <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
        <div className="flex items-center justify-between px-7 py-5">
          <div className="flex items-center gap-2.5">
            <Scales size={17} weight="regular" className="text-[#999]" />
            <h3 className="text-[15px] font-medium text-[#1A1A1A]">Commission Rule Builder</h3>
          </div>
          <button className="px-4 py-2 bg-[#1A1A1A] text-white rounded-full text-[12px] font-medium hover:bg-[#333] transition-all cursor-pointer border-none">
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
              {commissionRules.map((r, i) => (
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
                <span className={fx.change24h >= 0 ? "text-[#22C55E]" : "text-[#EF4444]"}>
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
                <span className={`flex items-center gap-1 ${t.autoWithhold ? "text-[#22C55E]" : "text-[#ACACAC]"}`}>
                  <span className={`w-[5px] h-[5px] rounded-full ${t.autoWithhold ? "bg-[#22C55E]" : "bg-[#DCDCDC]"}`} />
                  {t.autoWithhold ? "Auto-withhold" : "Manual"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(CommissionEngine);
