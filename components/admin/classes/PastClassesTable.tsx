"use client";
import { useState, useMemo, memo, useRef, useEffect } from "react";
import {
  MagnifyingGlass, CaretLeft, CaretRight, CaretDown, Star, VideoCamera,
  CheckCircle, XCircle, Prohibit, Clock, Export, FileCsv, FilePdf, X,
} from "@phosphor-icons/react";
import { pastClasses } from "./classMockData";
import type { ClassType, PastClassOutcome, PastClass } from "./classTypes";
import { exportCSV, exportPDF } from "@/lib/exportUtils";

const PAGE_SIZE = 8;

const OUTCOME_STYLE: Record<PastClassOutcome, { bg: string; text: string; label: string; icon: React.ReactNode }> = {
  completed:        { bg: "bg-[#F0F3FA]", text: "text-[#293763]", label: "Completed", icon: <CheckCircle size={10} weight="fill" /> },
  no_show_student:  { bg: "bg-[#FFF7ED]", text: "text-[#E08A3C]", label: "No-show (Student)", icon: <Clock size={10} weight="fill" /> },
  no_show_teacher:  { bg: "bg-[#FFF1E6]", text: "text-[#C2571A]", label: "No-show (Teacher)", icon: <Clock size={10} weight="fill" /> },
  terminated:       { bg: "bg-[#FFF1E6]", text: "text-[#C2571A]", label: "Terminated", icon: <Prohibit size={10} weight="fill" /> },
  cancelled:        { bg: "bg-[#F5F5F5]", text: "text-[#999]", label: "Cancelled", icon: <XCircle size={10} weight="fill" /> },
};

function PastClassesTable({ onSelectClass }: { onSelectClass?: (c: PastClass) => void }) {
  const [classTab, setClassTab] = useState<ClassType>("live");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [outcomeFilter, setOutcomeFilter] = useState("all");
  const [showExport, setShowExport] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function close(e: MouseEvent) { if (exportRef.current && !exportRef.current.contains(e.target as Node)) setShowExport(false); }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const byType = useMemo(() => pastClasses.filter((c) => c.classType === classTab), [classTab]);
  const liveCount = pastClasses.filter((c) => c.classType === "live").length;
  const demoCount = pastClasses.filter((c) => c.classType === "demo").length;

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return byType.filter((c) => {
      if (q && !c.teacher.toLowerCase().includes(q) && !c.student.toLowerCase().includes(q) && !c.sessionId.toLowerCase().includes(q) && !c.subject.toLowerCase().includes(q)) return false;
      if (outcomeFilter !== "all" && c.outcome !== outcomeFilter) return false;
      return true;
    });
  }, [search, outcomeFilter, byType]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const stamp = new Date().toISOString().slice(0, 10);
  const handleCSV = () => {
    const h = ["Session", "Date", "Teacher", "Student", "Subject", "Duration", "Outcome", "Rating"];
    const r = filtered.map((c) => [c.sessionId, c.date, c.teacher, c.student, c.subject, `${c.durationMin}m`, c.outcome, c.rating ? String(c.rating) : "—"]);
    exportCSV(`past-${classTab}-classes-${stamp}`, h, r);
    setShowExport(false);
  };
  const handlePDF = () => {
    const h = ["Session", "Date", "Teacher", "Student", "Subject", "Dur.", "Outcome", "Rating"];
    const r = filtered.map((c) => [c.sessionId, c.date, c.teacher, c.student, c.subject, `${c.durationMin}m`, c.outcome, c.rating ? String(c.rating) : "—"]);
    exportPDF(`past-${classTab}-classes-${stamp}`, `Past ${classTab === "live" ? "Live" : "Demo"} Classes`, h, r, { generatedBy: "Super Admin" });
    setShowExport(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
      {/* Header */}
      <div className="px-7 pt-6 pb-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">Past Classes</h3>
            <p className="text-[12px] text-[#CACACA] mt-1">{filtered.length} class{filtered.length !== 1 ? "es" : ""}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-[240px]">
              <MagnifyingGlass size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#CACACA]" />
              <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} placeholder="Search…" className="w-full h-[38px] pl-9 pr-3 border border-[#F0F0F0] rounded-xl text-[13px] text-[#1A1A1A] placeholder:text-[#DCDCDC] focus:outline-none focus:border-[#DCDCDC] transition-all font-matter bg-white" />
            </div>
            {/* Outcome filter */}
            <div className="relative">
              <select value={outcomeFilter} onChange={(e) => { setOutcomeFilter(e.target.value); setPage(0); }} className="appearance-none h-[38px] pl-3 pr-8 border border-[#F0F0F0] rounded-xl text-[12px] text-[#1A1A1A] bg-white focus:outline-none cursor-pointer font-matter hover:border-[#DCDCDC] transition-colors">
                <option value="all">All Outcomes</option>
                <option value="completed">Completed</option>
                <option value="no_show_student">No-show (Student)</option>
                <option value="no_show_teacher">No-show (Teacher)</option>
                <option value="terminated">Terminated</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <CaretDown size={10} weight="bold" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#DCDCDC] pointer-events-none" />
            </div>
            {/* Export */}
            <div className="relative" ref={exportRef}>
              <button onClick={() => setShowExport(!showExport)} className="flex items-center gap-1.5 h-[38px] px-3 border border-[#F0F0F0] rounded-xl text-[12px] font-medium text-[#999] bg-white hover:border-[#DCDCDC] transition-colors cursor-pointer">
                <Export size={13} weight="bold" />
              </button>
              {showExport && (
                <div className="absolute right-0 mt-1.5 w-[170px] bg-white rounded-xl shadow-[0_12px_44px_-12px_rgba(0,0,0,0.12)] border border-[#EAEAEA] z-50 overflow-hidden animate-contextIn">
                  <button onClick={handleCSV} className="w-full flex items-center gap-2.5 px-4 py-3 hover:bg-[#FAFAFA] text-left transition-colors cursor-pointer border-none bg-transparent text-[12px] font-medium text-[#1A1A1A]"><FileCsv size={14} className="text-[#E08A3C]" /> CSV</button>
                  <button onClick={handlePDF} className="w-full flex items-center gap-2.5 px-4 py-3 hover:bg-[#FAFAFA] text-left transition-colors cursor-pointer border-none bg-transparent border-t border-[#F5F5F5] text-[12px] font-medium text-[#1A1A1A]"><FilePdf size={14} className="text-[#293763]" /> PDF</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live / Demo tabs */}
        <div className="flex items-center gap-1 bg-[#F5F5F5] rounded-xl p-[3px] w-fit">
          <button
            onClick={() => { setClassTab("live"); setPage(0); setSearch(""); setOutcomeFilter("all"); }}
            className={`flex items-center gap-1.5 px-4 py-[7px] rounded-lg text-[12px] font-medium transition-all cursor-pointer border-none ${classTab === "live" ? "bg-white text-[#1A1A1A] shadow-sm" : "bg-transparent text-[#ACACAC] hover:text-[#777]"}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${classTab === "live" ? "bg-[#E08A3C]" : "bg-[#DCDCDC]"}`} />
            Live Classes
            <span className={`text-[10px] font-medium px-1.5 py-[1px] rounded-full ${classTab === "live" ? "bg-[#FFF7ED] text-[#E08A3C]" : "bg-[#F0F0F0] text-[#ACACAC]"}`}>{liveCount}</span>
          </button>
          <button
            onClick={() => { setClassTab("demo"); setPage(0); setSearch(""); setOutcomeFilter("all"); }}
            className={`flex items-center gap-1.5 px-4 py-[7px] rounded-lg text-[12px] font-medium transition-all cursor-pointer border-none ${classTab === "demo" ? "bg-white text-[#1A1A1A] shadow-sm" : "bg-transparent text-[#ACACAC] hover:text-[#777]"}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${classTab === "demo" ? "bg-[#293763]" : "bg-[#DCDCDC]"}`} />
            Demo Classes
            <span className={`text-[10px] font-medium px-1.5 py-[1px] rounded-full ${classTab === "demo" ? "bg-[#F0F3FA] text-[#293763]" : "bg-[#F0F0F0] text-[#ACACAC]"}`}>{demoCount}</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[960px]">
          <thead>
            <tr className="border-t border-b border-[#F5F5F5]">
              <th className="py-3.5 pl-7 pr-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Session</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Date</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Teacher</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Student</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Subject</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Duration</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Outcome</th>
              <th className="py-3.5 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Rating</th>
              <th className="py-3.5 pr-7 pl-3 text-right text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Recording</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr><td colSpan={9} className="py-16 text-center">
                <div className="flex flex-col items-center gap-2">
                  <MagnifyingGlass size={20} className="text-[#DCDCDC]" />
                  <p className="text-[13px] text-[#ACACAC]">No past classes found</p>
                </div>
              </td></tr>
            ) : paged.map((c, i) => {
              const o = OUTCOME_STYLE[c.outcome];
              return (
                <tr key={c.id} onClick={() => onSelectClass?.(c)} className={`hover:bg-[#FAFAFA]/60 transition-colors cursor-pointer group ${i > 0 ? "border-t border-[#F8F8F8]" : ""}`}>
                  <td className="py-4 pl-7 pr-3 text-[12px] font-mono text-[#ACACAC]">{c.sessionId}</td>
                  <td className="py-4 px-3 text-[12px] text-[#888]">{c.date}</td>
                  <td className="py-4 px-3 text-[13px] text-[#1A1A1A]">{c.teacher}</td>
                  <td className="py-4 px-3 text-[13px] text-[#1A1A1A]">{c.student}</td>
                  <td className="py-4 px-3 text-[12px] text-[#777]">{c.subject}</td>
                  <td className="py-4 px-3">
                    {c.durationMin > 0 ? (
                      <span className="text-[13px] text-[#1A1A1A] tabular-nums">{c.durationMin}m</span>
                    ) : (
                      <span className="text-[12px] text-[#DCDCDC]">—</span>
                    )}
                  </td>
                  <td className="py-4 px-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-[2px] rounded-full text-[10px] font-medium ${o.bg} ${o.text}`}>
                      {o.icon} {o.label}
                    </span>
                  </td>
                  <td className="py-4 px-3">
                    {c.rating ? (
                      <span className="flex items-center gap-1 text-[12px] text-[#1A1A1A] tabular-nums">
                        <Star size={11} weight="fill" className={c.rating >= 4.5 ? "text-[#E08A3C]" : c.rating >= 3.5 ? "text-[#D4956A]" : "text-[#C2571A]"} />
                        {c.rating.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-[12px] text-[#DCDCDC]">—</span>
                    )}
                  </td>
                  <td className="py-4 pr-7 pl-3 text-right">
                    {c.recordingAvailable ? (
                      <button className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white border border-[#F0F0F0] rounded-lg text-[10px] font-medium text-[#666] hover:border-[#DCDCDC] hover:text-[#1A1A1A] transition-all cursor-pointer">
                        <VideoCamera size={11} /> Watch
                      </button>
                    ) : (
                      <span className="text-[10px] text-[#DCDCDC]">N/A</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between px-7 py-4 border-t border-[#F5F5F5]">
          <span className="text-[12px] text-[#CACACA] tabular-nums">{page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} className="w-8 h-8 rounded-lg border border-[#F0F0F0] bg-white text-[#999] hover:text-[#1A1A1A] hover:border-[#DCDCDC] disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer transition-all flex items-center justify-center"><CaretLeft size={13} weight="bold" /></button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i)} className={`w-8 h-8 rounded-lg text-[12px] font-medium transition-all cursor-pointer border-none flex items-center justify-center ${i === page ? "bg-[#1A1A1A] text-white" : "bg-transparent text-[#ACACAC] hover:bg-[#F5F5F5]"}`}>{i + 1}</button>
            ))}
            <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1} className="w-8 h-8 rounded-lg border border-[#F0F0F0] bg-white text-[#999] hover:text-[#1A1A1A] hover:border-[#DCDCDC] disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer transition-all flex items-center justify-center"><CaretRight size={13} weight="bold" /></button>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(PastClassesTable);
