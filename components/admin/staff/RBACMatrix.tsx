"use client";
import { memo } from "react";
import { Check, X, ShieldCheck, Crown } from "@phosphor-icons/react";
import { rbacPermissions, rbacMatrix } from "./staffMockData";
import type { AegisRole } from "./staffTypes";

const ROLE_COLS: { key: AegisRole; label: string; icon: React.ReactNode; color: string }[] = [
  { key: "tier1_support", label: "Tier 1 Support", icon: null, color: "text-[#777]" },
  { key: "trust_safety", label: "Trust & Safety", icon: <ShieldCheck size={12} weight="fill" />, color: "text-[#3B6FC0]" },
  { key: "finance_ops", label: "Finance Ops", icon: null, color: "text-[#1A1A1A]" },
  { key: "super_admin", label: "Super Admin", icon: <Crown size={12} weight="fill" />, color: "text-[#6B4FBB]" },
];

const categories = [...new Set(rbacPermissions.map((p) => p.category))];

function RBACMatrix() {
  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
      <div className="px-7 pt-6 pb-5">
        <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">Aegis RBAC Matrix</h3>
        <p className="text-[12px] text-[#CACACA] mt-1">Role-based access control — permissions tied to each Aegis role</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[720px]">
          <thead>
            <tr className="border-t border-b border-[#F5F5F5]">
              <th className="py-3.5 pl-7 pr-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em] w-[260px]">Permission</th>
              {ROLE_COLS.map((r) => (
                <th key={r.key} className="py-3.5 px-3 text-center">
                  <span className={`flex items-center justify-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.1em] ${r.color}`}>
                    {r.icon} {r.label}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <>
                <tr key={`cat-${cat}`}>
                  <td colSpan={5} className="pt-5 pb-2 pl-7 text-[10px] font-medium text-[#DCDCDC] uppercase tracking-[0.12em]">{cat}</td>
                </tr>
                {rbacPermissions.filter((p) => p.category === cat).map((perm, pi) => (
                  <tr key={perm.key} className={pi > 0 ? "border-t border-[#F8F8F8]" : ""}>
                    <td className="py-3 pl-7 pr-3 text-[12px] text-[#777]">{perm.label}</td>
                    {ROLE_COLS.map((r) => {
                      const has = rbacMatrix[r.key]?.includes(perm.key);
                      return (
                        <td key={r.key} className="py-3 px-3 text-center">
                          {has ? (
                            <span className="inline-flex w-6 h-6 rounded-lg bg-[#F0F0F0] items-center justify-center">
                              <Check size={12} weight="bold" className="text-[#1A1A1A]" />
                            </span>
                          ) : (
                            <span className="inline-flex w-6 h-6 rounded-lg items-center justify-center">
                              <X size={10} weight="bold" className="text-[#EBEBEB]" />
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="px-7 py-4 border-t border-[#F5F5F5] flex items-center gap-6">
        <span className="flex items-center gap-2 text-[11px] text-[#ACACAC]">
          <span className="inline-flex w-5 h-5 rounded-md bg-[#F0F0F0] items-center justify-center"><Check size={10} weight="bold" className="text-[#1A1A1A]" /></span>
          Granted
        </span>
        <span className="flex items-center gap-2 text-[11px] text-[#ACACAC]">
          <span className="inline-flex w-5 h-5 rounded-md items-center justify-center"><X size={10} weight="bold" className="text-[#EBEBEB]" /></span>
          Denied
        </span>
        <span className="text-[10px] text-[#DCDCDC] ml-auto">Super Admin has unrestricted access to all systems</span>
      </div>
    </div>
  );
}

export default memo(RBACMatrix);
