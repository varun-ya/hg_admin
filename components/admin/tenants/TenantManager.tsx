"use client";
import { memo } from "react";
import { Buildings, Upload, CurrencyDollar, CaretRight } from "@phosphor-icons/react";
import { tenants, bulkInvites, creditAllocations } from "./tenantMockData";

const TYPE_BADGE: Record<string, string> = {
  school: "bg-[#EEF2FF] text-[#4F46E5]",
  corporation: "bg-[#F0F0F0] text-[#1A1A1A]",
  university: "bg-[#FFF8F3] text-[#E08A3C]",
};

const STATUS_DOT: Record<string, string> = {
  active: "bg-[#22C55E]",
  trial: "bg-[#F59E0B]",
  suspended: "bg-[#EF4444]",
  churned: "bg-[#DCDCDC]",
};

function TenantManager() {
  return (
    <div className="flex flex-col gap-6">
      {/* Tenant Directory */}
      <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
        <div className="flex items-center justify-between px-7 py-5">
          <div className="flex items-center gap-2.5">
            <Buildings size={17} weight="regular" className="text-[#999]" />
            <h3 className="text-[15px] font-medium text-[#1A1A1A]">Tenant Directory</h3>
          </div>
          <button className="px-4 py-2 bg-[#1A1A1A] text-white rounded-full text-[12px] font-medium hover:bg-[#333] transition-all cursor-pointer border-none">
            + Add Tenant
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-t border-[#F5F5F5]">
                {["Organization", "Type", "Status", "Sub-Admins", "Students", "Credits", "Onboarded", ""].map((h) => (
                  <th key={h} className="py-3 px-4 first:pl-7 last:pr-7 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tenants.map((t, i) => {
                const pct = Math.round((t.creditsUsed / t.creditsAllocated) * 100);
                return (
                  <tr key={t.id} className={`hover:bg-[#FAFAFA] transition-colors cursor-pointer ${i > 0 ? "border-t border-[#F8F8F8]" : ""}`}>
                    <td className="py-4 px-4 pl-7">
                      <div className="flex flex-col">
                        <span className="text-[13px] text-[#1A1A1A]">{t.name}</span>
                        <span className="text-[10px] text-[#CACACA] font-mono">{t.id}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-[10px] font-medium px-2 py-[2px] rounded-full ${TYPE_BADGE[t.type]}`}>{t.type}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="flex items-center gap-1.5 text-[11px] text-[#666]">
                        <span className={`w-[5px] h-[5px] rounded-full ${STATUS_DOT[t.status]}`} />
                        {t.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-[12px] text-[#666]">{t.subAdmins}</td>
                    <td className="py-4 px-4 text-[12px] text-[#666]">{t.activeStudents.toLocaleString()} / {t.totalStudents.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] text-[#666]">${t.creditsUsed.toLocaleString()} / ${t.creditsAllocated.toLocaleString()}</span>
                        <div className="w-[60px] h-[3px] bg-[#F0F0F0] rounded-full overflow-hidden">
                          <div className="h-full bg-[#1A1A1A] rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-[10px] font-medium text-[#ACACAC] uppercase">{t.onboardedVia}</td>
                    <td className="py-4 px-4 pr-7">
                      <CaretRight size={12} className="text-[#DCDCDC]" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bulk Onboarding Log */}
        <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
          <div className="flex items-center justify-between px-7 py-5">
            <div className="flex items-center gap-2.5">
              <Upload size={15} weight="regular" className="text-[#999]" />
              <h3 className="text-[15px] font-medium text-[#1A1A1A]">Bulk Onboarding</h3>
            </div>
            <button className="px-3 py-1.5 bg-white border border-[#EBEBEB] rounded-lg text-[11px] font-medium text-[#666] hover:bg-[#FAFAFA] cursor-pointer">
              Upload CSV
            </button>
          </div>
          {bulkInvites.map((b, i) => (
            <div key={b.id} className={`px-7 py-4 hover:bg-[#FAFAFA] transition-colors ${i > 0 ? "border-t border-[#F5F5F5]" : "border-t border-[#F5F5F5]"}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[13px] text-[#1A1A1A]">{b.tenantName}</span>
                <span className={`text-[10px] font-medium px-2 py-[2px] rounded-full ${
                  b.status === "completed" ? "bg-[#F0F0F0] text-[#1A1A1A]" : b.status === "processing" ? "bg-[#FEF3C7] text-[#92400E]" : "bg-[#FEE2E2] text-[#DC2626]"
                }`}>{b.status}</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-[#ACACAC]">
                <span>{b.method.toUpperCase()}</span>
                <span>·</span>
                <span>{b.successCount}/{b.totalUsers} success</span>
                {b.failedCount > 0 && <><span>·</span><span className="text-[#E08A3C]">{b.failedCount} failed</span></>}
                <span>·</span>
                <span>{b.initiatedAt}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Credit Allocation */}
        <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
          <div className="flex items-center justify-between px-7 py-5">
            <div className="flex items-center gap-2.5">
              <CurrencyDollar size={15} weight="regular" className="text-[#999]" />
              <h3 className="text-[15px] font-medium text-[#1A1A1A]">Credit Allocation</h3>
            </div>
            <button className="px-3 py-1.5 bg-white border border-[#EBEBEB] rounded-lg text-[11px] font-medium text-[#666] hover:bg-[#FAFAFA] cursor-pointer">
              Allocate Credits
            </button>
          </div>
          {creditAllocations.map((c, i) => {
            const pct = Math.round((c.usedCredits / c.totalCredits) * 100);
            return (
              <div key={c.id} className={`px-7 py-4 hover:bg-[#FAFAFA] transition-colors ${i > 0 ? "border-t border-[#F5F5F5]" : "border-t border-[#F5F5F5]"}`}>
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <span className="text-[13px] text-[#1A1A1A]">{c.department}</span>
                    <span className="text-[11px] text-[#CACACA] ml-2">{c.tenantName}</span>
                  </div>
                  <span className="text-[13px] font-normal text-[#1A1A1A] tabular-nums">${c.usedCredits.toLocaleString()} / ${c.totalCredits.toLocaleString()}</span>
                </div>
                <div className="w-full h-[3px] bg-[#F0F0F0] rounded-full overflow-hidden mt-2">
                  <div className={`h-full rounded-full ${pct > 80 ? "bg-[#E08A3C]" : "bg-[#1A1A1A]"}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default memo(TenantManager);
