"use client";
import { memo, useState, useCallback, useRef, useEffect } from "react";
import { Lock, Export, FileCsv, FilePdf } from "@phosphor-icons/react";
import { auditTrail } from "./mockData";
import { exportCSV, exportPDF } from "@/lib/exportUtils";

const HEADERS = ["Timestamp", "Actor", "Action", "Target", "Category", "IP"];

const CAT_STYLE: Record<string, { bg: string; text: string }> = {
  auth: { bg: "bg-[#FFF7ED]", text: "text-[#B45309]" },
  financial: { bg: "bg-[#ECFDF5]", text: "text-[#059669]" },
  system: { bg: "bg-[#F3F4F6]", text: "text-[#6B7280]" },
  override: { bg: "bg-[#FEF2F2]", text: "text-[#DC2626]" },
  kyc: { bg: "bg-[#F5F3FF]", text: "text-[#7C3AED]" },
};

function AuditTrailWidget() {
  const [showExport, setShowExport] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [dropPos, setDropPos] = useState({ top: 0, right: 0 });

  useEffect(() => {
    function close(e: MouseEvent) {
      if (btnRef.current && !btnRef.current.contains(e.target as Node)) setShowExport(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const openExport = useCallback(() => {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setDropPos({ top: r.bottom + 6, right: Math.max(8, window.innerWidth - r.right) });
    }
    setShowExport((p) => !p);
  }, []);

  const rows = auditTrail.map((e) => [e.timestamp, e.actor, e.action, e.target, e.category, e.ip]);
  const stamp = new Date().toISOString().slice(0, 10);

  const handleCSV = useCallback(() => {
    exportCSV(`audit-trail-${stamp}`, HEADERS, rows);
    setShowExport(false);
  }, [rows, stamp]);

  const handlePDF = useCallback(() => {
    exportPDF(`audit-trail-${stamp}`, "System Audit Trail", HEADERS, rows, { generatedBy: "Super Admin" });
    setShowExport(false);
  }, [rows, stamp]);

  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden max-h-[480px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-7 py-3.5 sm:py-5 shrink-0">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <Lock size={15} weight="regular" className="text-[#999] shrink-0" />
          <h3 className="text-[14px] sm:text-[15px] font-medium text-[#1A1A1A] font-season">System Audit Trail</h3>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="text-[10px] sm:text-[11px] font-normal text-[#CACACA] hidden xs:inline">Last 10 events</span>
          <button
            ref={btnRef}
            onClick={openExport}
            className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-medium text-[#1A1A1A] hover:text-black bg-transparent border border-[#EBEBEB] rounded-lg px-2.5 sm:px-3 py-1.5 cursor-pointer hover:bg-[#FAFAFA] transition-colors shrink-0"
          >
            <Export size={12} weight="bold" /> Export
          </button>
        </div>
      </div>

      {/* Table — horizontally scrollable */}
      <div className="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-t border-[#F5F5F5]">
              <th className="py-3 pl-4 sm:pl-7 pr-2 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em] w-7"></th>
              <th className="py-3 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Timestamp</th>
              <th className="py-3 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Actor</th>
              <th className="py-3 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Action</th>
              <th className="py-3 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Target</th>
              <th className="py-3 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Category</th>
              <th className="py-3 pr-4 sm:pr-7 pl-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">IP</th>
            </tr>
          </thead>
          <tbody>
            {auditTrail.map((e, i) => {
              const cat = CAT_STYLE[e.category] || CAT_STYLE.system;
              return (
                <tr key={e.id} className={`hover:bg-[#FAFAFA] transition-colors ${i > 0 ? "border-t border-[#F8F8F8]" : ""}`}>
                  <td className="py-3.5 pl-4 sm:pl-7 pr-2">
                    {e.immutable && <Lock size={10} weight="regular" className="text-[#DCDCDC]" />}
                  </td>
                  <td className="py-3.5 px-3 text-[12px] font-mono font-normal text-[#CACACA] whitespace-nowrap">{e.timestamp}</td>
                  <td className="py-3.5 px-3">
                    <span className={`text-[12px] font-normal ${e.actor === "system" ? "text-[#DCDCDC] italic" : "text-[#666]"}`}>{e.actor}</span>
                  </td>
                  <td className="py-3.5 px-3 text-[12px] font-normal text-[#1A1A1A] whitespace-nowrap">{e.action}</td>
                  <td className="py-3.5 px-3 text-[12px] font-normal text-[#999]">{e.target}</td>
                  <td className="py-3.5 px-3">
                    <span className={`text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded ${cat.bg} ${cat.text}`}>{e.category}</span>
                  </td>
                  <td className="py-3.5 pr-4 sm:pr-7 pl-3 text-[11px] font-mono text-[#DCDCDC]">{e.ip}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Export dropdown — fixed position */}
      {showExport && <div className="fixed inset-0 z-[199]" onClick={() => setShowExport(false)} />}
      {showExport && (
        <div
          className="fixed z-[200] w-[180px] bg-white rounded-xl shadow-[0_12px_44px_-12px_rgba(0,0,0,0.12)] border border-[#EAEAEA] overflow-hidden animate-contextIn"
          style={{ top: dropPos.top, right: dropPos.right }}
        >
          <button onClick={handleCSV} className="w-full flex items-center gap-2.5 px-4 py-3 hover:bg-[#FAFAFA] text-left transition-colors cursor-pointer border-none bg-transparent text-[12px] font-medium text-[#1A1A1A]">
            <FileCsv size={15} className="text-[#E08A3C]" /> Export as CSV
          </button>
          <button onClick={handlePDF} className="w-full flex items-center gap-2.5 px-4 py-3 hover:bg-[#FAFAFA] text-left transition-colors cursor-pointer border-none bg-transparent border-t border-[#F5F5F5] text-[12px] font-medium text-[#1A1A1A]">
            <FilePdf size={15} className="text-[#293763]" /> Export as PDF
          </button>
        </div>
      )}
    </div>
  );
}

export default memo(AuditTrailWidget);
