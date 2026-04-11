"use client";
import { memo, useState, useCallback, useRef, useEffect } from "react";
import { ShieldWarning, Globe, Lock, LockOpen, Prohibit, CheckCircle, Eye, Warning, Export, FileCsv, FilePdf, CaretRight } from "@phosphor-icons/react";
import { threatEvents, activeSessions, ipRules, securityPolicies } from "./securityMockData";
import { exportCSV, exportPDF } from "@/lib/exportUtils";
import ConfirmModal from "../ConfirmModal";

const SEVERITY: Record<string, string> = { critical: "bg-[#C2571A]", high: "bg-[#E08A3C]", medium: "bg-[#D4956A]", low: "bg-[#DCDCDC]" };
const STATUS: Record<string, { bg: string; text: string }> = {
  blocked: { bg: "bg-[#F0F3FA]", text: "text-[#293763]" },
  flagged: { bg: "bg-[#FFF7ED]", text: "text-[#E08A3C]" },
  investigating: { bg: "bg-[#FFF7ED]", text: "text-[#B45309]" },
  resolved: { bg: "bg-[#F5F5F5]", text: "text-[#999]" },
};

function SecurityDashboard() {
  const [tab, setTab] = useState<"threats" | "sessions" | "firewall" | "policies">("threats");
  const [revokeId, setRevokeId] = useState<string | null>(null);
  const [showExport, setShowExport] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function close(e: MouseEvent) { if (exportRef.current && !exportRef.current.contains(e.target as Node)) setShowExport(false); }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const stamp = new Date().toISOString().slice(0, 10);
  const handleCSV = useCallback(() => {
    const h = ["Time", "Type", "Severity", "Source", "Target", "Description", "Status"];
    const r = threatEvents.map((t) => [t.timestamp, t.type, t.severity, t.source, t.target, t.description, t.status]);
    exportCSV(`security-threats-${stamp}`, h, r);
    setShowExport(false);
  }, [stamp]);
  const handlePDF = useCallback(() => {
    const h = ["Time", "Type", "Severity", "Source", "Target", "Status"];
    const r = threatEvents.map((t) => [t.timestamp, t.type, t.severity, t.source, t.target, t.status]);
    exportPDF(`security-threats-${stamp}`, "Security Threat Report", h, r, { generatedBy: "Super Admin" });
    setShowExport(false);
  }, [stamp]);

  return (
    <>
      <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-[#F5F5F5]">
          <div className="flex items-center gap-1 bg-[#F5F5F5] rounded-xl p-[3px]">
            {(["threats", "sessions", "firewall", "policies"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`px-4 py-[7px] rounded-lg text-[12px] font-medium transition-all cursor-pointer border-none capitalize ${tab === t ? "bg-white text-[#1A1A1A] shadow-sm" : "bg-transparent text-[#ACACAC] hover:text-[#777]"}`}>
                {t === "threats" ? "Threat Feed" : t === "sessions" ? "Active Sessions" : t === "firewall" ? "IP Firewall" : "Policies"}
              </button>
            ))}
          </div>
          <div className="relative" ref={exportRef}>
            <button onClick={() => setShowExport(!showExport)} className="flex items-center gap-1.5 text-[11px] font-medium text-[#1A1A1A] border border-[#EBEBEB] rounded-lg px-3 py-1.5 cursor-pointer hover:bg-[#FAFAFA] transition-colors bg-transparent">
              <Export size={12} weight="bold" /> Export
            </button>
            {showExport && (
              <div className="absolute right-0 mt-1.5 w-[180px] bg-white rounded-xl shadow-[0_12px_44px_-12px_rgba(0,0,0,0.12)] border border-[#EAEAEA] z-50 overflow-hidden animate-contextIn">
                <button onClick={handleCSV} className="w-full flex items-center gap-2.5 px-4 py-3 hover:bg-[#FAFAFA] text-left transition-colors cursor-pointer border-none bg-transparent text-[12px] font-medium text-[#1A1A1A]"><FileCsv size={15} className="text-[#E08A3C]" /> Export as CSV</button>
                <button onClick={handlePDF} className="w-full flex items-center gap-2.5 px-4 py-3 hover:bg-[#FAFAFA] text-left transition-colors cursor-pointer border-none bg-transparent border-t border-[#F5F5F5] text-[12px] font-medium text-[#1A1A1A]"><FilePdf size={15} className="text-[#293763]" /> Export as PDF</button>
              </div>
            )}
          </div>
        </div>

        {/* Threat Feed */}
        {tab === "threats" && (
          <div className="divide-y divide-[#F8F8F8]">
            {threatEvents.map((t) => {
              const st = STATUS[t.status];
              return (
                <div key={t.id} className="px-7 py-4 hover:bg-[#FAFAFA] transition-colors group">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full shrink-0 mt-2 ${SEVERITY[t.severity]}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-medium text-[#ACACAC] uppercase tracking-wider">{t.type.replace(/_/g, " ")}</span>
                        <span className={`text-[10px] font-medium px-2 py-[1px] rounded-full ${st.bg} ${st.text}`}>{t.status}</span>
                        {t.country && <span className="text-[10px] text-[#CACACA] flex items-center gap-0.5"><Globe size={9} />{t.country}</span>}
                      </div>
                      <p className="text-[13px] text-[#1A1A1A]">{t.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-[11px] font-mono text-[#CACACA]">{t.source}</span>
                        <CaretRight size={8} className="text-[#DCDCDC]" />
                        <span className="text-[11px] font-mono text-[#999]">{t.target}</span>
                        <span className="text-[10px] text-[#DCDCDC] ml-auto">{t.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Active Sessions */}
        {tab === "sessions" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-[#F5F5F5]">
                  <th className="py-3 pl-7 pr-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">User</th>
                  <th className="py-3 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Role</th>
                  <th className="py-3 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">IP / Location</th>
                  <th className="py-3 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Device</th>
                  <th className="py-3 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">MFA</th>
                  <th className="py-3 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Last Active</th>
                  <th className="py-3 pr-7 pl-3 text-right text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeSessions.map((s, i) => (
                  <tr key={s.id} className={`hover:bg-[#FAFAFA] transition-colors group ${i > 0 ? "border-t border-[#F8F8F8]" : ""}`}>
                    <td className="py-4 pl-7 pr-3 text-[13px] text-[#1A1A1A]">{s.user}</td>
                    <td className="py-4 px-3"><span className={`text-[10px] font-medium px-2 py-[2px] rounded-full ${s.role === "super_admin" ? "bg-[#FFF7ED] text-[#E08A3C]" : "bg-[#F5F5F5] text-[#999]"}`}>{s.role.replace(/_/g, " ")}</span></td>
                    <td className="py-4 px-3"><span className="text-[12px] font-mono text-[#ACACAC]">{s.ip}</span><span className="text-[11px] text-[#CACACA] ml-2">{s.location}</span></td>
                    <td className="py-4 px-3 text-[12px] text-[#888]">{s.device}</td>
                    <td className="py-4 px-3">{s.mfaVerified ? <Lock size={13} className="text-[#293763]" /> : <LockOpen size={13} className="text-[#C2571A]" />}</td>
                    <td className="py-4 px-3 text-[12px] text-[#ACACAC]">{s.lastActive}</td>
                    <td className="py-4 pr-7 pl-3 text-right">
                      <button onClick={() => setRevokeId(s.id)} className="text-[11px] font-medium text-[#999] hover:text-[#C2571A] bg-transparent border-none cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">Revoke</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* IP Firewall */}
        {tab === "firewall" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-[#F5F5F5]">
                  <th className="py-3 pl-7 pr-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">IP / Range</th>
                  <th className="py-3 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Rule</th>
                  <th className="py-3 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Reason</th>
                  <th className="py-3 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Hits</th>
                  <th className="py-3 pr-7 pl-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Added</th>
                </tr>
              </thead>
              <tbody>
                {ipRules.map((r, i) => (
                  <tr key={r.id} className={`hover:bg-[#FAFAFA] transition-colors ${i > 0 ? "border-t border-[#F8F8F8]" : ""}`}>
                    <td className="py-4 pl-7 pr-3 text-[13px] font-mono text-[#1A1A1A]">{r.ip}</td>
                    <td className="py-4 px-3">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-[2px] rounded-full ${r.type === "block" ? "bg-[#FFF1E6] text-[#C2571A]" : "bg-[#F0F3FA] text-[#293763]"}`}>
                        {r.type === "block" ? <Prohibit size={9} /> : <CheckCircle size={9} />}{r.type}
                      </span>
                    </td>
                    <td className="py-4 px-3 text-[12px] text-[#888]">{r.reason}</td>
                    <td className="py-4 px-3 text-[12px] font-mono text-[#ACACAC]">{r.hits.toLocaleString()}</td>
                    <td className="py-4 pr-7 pl-3 text-[11px] text-[#CACACA]">{r.addedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Security Policies */}
        {tab === "policies" && (
          <div className="divide-y divide-[#F8F8F8]">
            {securityPolicies.map((p) => (
              <div key={p.id} className="px-7 py-5 flex items-center justify-between hover:bg-[#FAFAFA] transition-colors">
                <div className="flex-1 min-w-0 mr-6">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-[13px] font-medium text-[#1A1A1A]">{p.name}</p>
                    <span className={`text-[10px] font-medium px-2 py-[1px] rounded-full ${p.enabled ? "bg-[#F0F3FA] text-[#293763]" : "bg-[#F5F5F5] text-[#999]"}`}>{p.enabled ? "Active" : "Disabled"}</span>
                  </div>
                  <p className="text-[12px] text-[#ACACAC]">{p.description}</p>
                  <p className="text-[10px] text-[#DCDCDC] mt-1.5">Last updated: {p.lastUpdated}</p>
                </div>
                <button className={`relative w-10 h-[22px] rounded-full transition-colors cursor-pointer border-none ${p.enabled ? "bg-[#E08A3C]" : "bg-[#DCDCDC]"}`}>
                  <span className={`absolute top-[2px] w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-all ${p.enabled ? "left-[20px]" : "left-[2px]"}`} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!revokeId}
        onClose={() => setRevokeId(null)}
        title="Revoke Admin Session"
        description={`This will immediately terminate session ${revokeId} and force the user to re-authenticate. This action is audit-logged.`}
        confirmString="REVOKE-SESSION"
        onConfirm={() => setRevokeId(null)}
        variant="danger"
      />
    </>
  );
}

export default memo(SecurityDashboard);
