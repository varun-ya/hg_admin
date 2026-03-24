"use client";
import { useState, memo } from "react";
import { Buildings, Upload, CurrencyDollar, CaretRight, X, CheckCircle } from "@phosphor-icons/react";
import { tenants, bulkInvites, creditAllocations } from "./tenantMockData";
import type { Tenant } from "./tenantTypes";

function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-[300] flex items-center gap-3 bg-[#1A1A1A] text-white px-4 py-3 rounded-xl shadow-lg animate-fadeIn">
      <CheckCircle size={14} weight="fill" className="text-[#22C55E] shrink-0" />
      <span className="text-[13px]">{msg}</span>
      <button onClick={onClose} className="ml-2 text-white/50 hover:text-white bg-transparent border-none cursor-pointer"><X size={12} weight="bold" /></button>
    </div>
  );
}

function AddTenantModal({ onClose, onSave }: { onClose: () => void; onSave: (name: string) => void }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("school");
  const [email, setEmail] = useState("");
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/15 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-[460px] max-w-[95vw] border border-[#F0F0F0] overflow-hidden">
        <div className="px-7 py-5 flex items-center justify-between border-b border-[#F5F5F5]">
          <h3 className="text-[15px] font-medium text-[#1A1A1A]">Add Tenant</h3>
          <button onClick={onClose} className="text-[#CACACA] hover:text-[#999] bg-transparent border-none cursor-pointer"><X size={16} weight="bold" /></button>
        </div>
        <div className="px-7 py-5 space-y-4">
          <div>
            <label className="text-[11px] font-medium text-[#999] uppercase tracking-wider block mb-1.5">Organization Name *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Delhi Public School" className="w-full h-[38px] px-3 border border-[#EBEBEB] rounded-lg text-[13px] focus:outline-none focus:border-[#1A1A1A] transition-all" />
          </div>
          <div>
            <label className="text-[11px] font-medium text-[#999] uppercase tracking-wider block mb-1.5">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full h-[38px] px-3 border border-[#EBEBEB] rounded-lg text-[13px] bg-white focus:outline-none focus:border-[#1A1A1A] transition-all">
              {["school", "corporation", "university"].map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-medium text-[#999] uppercase tracking-wider block mb-1.5">Admin Email *</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@organization.com" className="w-full h-[38px] px-3 border border-[#EBEBEB] rounded-lg text-[13px] focus:outline-none focus:border-[#1A1A1A] transition-all" />
          </div>
        </div>
        <div className="px-7 pb-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-[13px] text-[#777] bg-white border border-[#EBEBEB] rounded-lg hover:bg-[#FAFAFA] cursor-pointer">Cancel</button>
          <button disabled={!name || !email} onClick={() => { onSave(name); onClose(); }} className={`px-4 py-2 text-[13px] font-medium rounded-lg border-none cursor-pointer transition-all ${
            name && email ? "bg-[#1A1A1A] text-white hover:bg-[#333]" : "bg-[#F0F0F0] text-[#CACACA] cursor-not-allowed"
          }`}>Add Tenant</button>
        </div>
      </div>
    </div>
  );
}

function AllocateCreditsModal({ onClose, onSave }: { onClose: () => void; onSave: (dept: string, amount: string) => void }) {
  const [dept, setDept] = useState("");
  const [amount, setAmount] = useState("");
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/15 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-[400px] max-w-[95vw] border border-[#F0F0F0] overflow-hidden">
        <div className="px-7 py-5 flex items-center justify-between border-b border-[#F5F5F5]">
          <h3 className="text-[15px] font-medium text-[#1A1A1A]">Allocate Credits</h3>
          <button onClick={onClose} className="text-[#CACACA] hover:text-[#999] bg-transparent border-none cursor-pointer"><X size={16} weight="bold" /></button>
        </div>
        <div className="px-7 py-5 space-y-4">
          <div>
            <label className="text-[11px] font-medium text-[#999] uppercase tracking-wider block mb-1.5">Department *</label>
            <input value={dept} onChange={(e) => setDept(e.target.value)} placeholder="e.g. Engineering Dept" className="w-full h-[38px] px-3 border border-[#EBEBEB] rounded-lg text-[13px] focus:outline-none focus:border-[#1A1A1A] transition-all" />
          </div>
          <div>
            <label className="text-[11px] font-medium text-[#999] uppercase tracking-wider block mb-1.5">Credit Amount ($) *</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 5000" className="w-full h-[38px] px-3 border border-[#EBEBEB] rounded-lg text-[13px] focus:outline-none focus:border-[#1A1A1A] transition-all" />
          </div>
        </div>
        <div className="px-7 pb-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-[13px] text-[#777] bg-white border border-[#EBEBEB] rounded-lg hover:bg-[#FAFAFA] cursor-pointer">Cancel</button>
          <button disabled={!dept || !amount} onClick={() => { onSave(dept, amount); onClose(); }} className={`px-4 py-2 text-[13px] font-medium rounded-lg border-none cursor-pointer transition-all ${
            dept && amount ? "bg-[#1A1A1A] text-white hover:bg-[#333]" : "bg-[#F0F0F0] text-[#CACACA] cursor-not-allowed"
          }`}>Allocate</button>
        </div>
      </div>
    </div>
  );
}

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
  const [tenantList, setTenantList] = useState(tenants);
  const [showAddTenant, setShowAddTenant] = useState(false);
  const [showAllocate, setShowAllocate] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  return (
    <div className="flex flex-col gap-6">
      {/* Tenant Directory */}
      <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
        <div className="flex items-center justify-between px-7 py-5">
          <div className="flex items-center gap-2.5">
            <Buildings size={17} weight="regular" className="text-[#999]" />
            <h3 className="text-[15px] font-medium text-[#1A1A1A]">Tenant Directory</h3>
          </div>
          <button onClick={() => setShowAddTenant(true)} className="px-4 py-2 bg-[#1A1A1A] text-white rounded-full text-[12px] font-medium hover:bg-[#333] transition-all cursor-pointer border-none">
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
              {tenantList.map((t, i) => {
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
            <button onClick={() => showToast("CSV upload dialog opened — select a file to begin bulk onboarding")} className="px-3 py-1.5 bg-white border border-[#EBEBEB] rounded-lg text-[11px] font-medium text-[#666] hover:bg-[#FAFAFA] cursor-pointer">
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
            <button onClick={() => setShowAllocate(true)} className="px-3 py-1.5 bg-white border border-[#EBEBEB] rounded-lg text-[11px] font-medium text-[#666] hover:bg-[#FAFAFA] cursor-pointer">
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
      {showAddTenant && (
        <AddTenantModal
          onClose={() => setShowAddTenant(false)}
          onSave={(name) => {
            setTenantList((prev) => [{ id: `TEN-${Date.now()}`, name, type: "school" as const, status: "trial" as const, subAdmins: 1, activeStudents: 0, totalStudents: 0, creditsUsed: 0, creditsAllocated: 5000, onboardedVia: "manual" as const, createdAt: new Date().toLocaleDateString() }, ...prev]);
            showToast(`Tenant "${name}" added successfully`);
          }}
        />
      )}
      {showAllocate && (
        <AllocateCreditsModal
          onClose={() => setShowAllocate(false)}
          onSave={(dept, amount) => showToast(`$${amount} credits allocated to ${dept}`)}
        />
      )}
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

export default memo(TenantManager);
