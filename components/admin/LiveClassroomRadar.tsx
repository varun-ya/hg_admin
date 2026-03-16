"use client";
import { useState, memo } from "react";
import { VideoCamera, Eye, Prohibit, Globe } from "@phosphor-icons/react";
import { liveSessions } from "./mockData";
import type { LiveSession } from "./types";
import ConfirmModal from "./ConfirmModal";

function StatusBadge({ status }: { status: LiveSession["status"] }) {
  if (status === "live")
    return (
      <span className="flex items-center gap-1.5 text-[11px] font-normal text-[#1A1A1A]">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E08A3C] opacity-50" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#E08A3C]" />
        </span>
        Live
      </span>
    );
  return <span className="text-[11px] font-normal text-[#ACACAC]">{status === "starting" ? "Starting" : "Ending"}</span>;
}

function LiveClassroomRadar() {
  const [terminateId, setTerminateId] = useState<string | null>(null);

  return (
    <>
      <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 shrink-0">
          <div className="flex items-center gap-2.5">
            <VideoCamera size={17} weight="regular" className="text-[#999]" />
            <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">Live Classroom Radar</h3>
          </div>
          <span className="text-[11px] font-normal text-[#ACACAC]">
            {liveSessions.filter((s) => s.status === "live").length} live now
          </span>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="border-t border-[#F5F5F5]">
                <th className="py-3 pl-7 pr-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Host</th>
                <th className="py-3 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Subject</th>
                <th className="py-3 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Duration</th>
                <th className="py-3 px-3 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Status</th>
                <th className="py-3 pr-7 pl-3 text-right text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {liveSessions.map((s, i) => (
                <tr key={s.id} className={`hover:bg-[#FAFAFA] transition-colors group ${i > 0 ? "border-t border-[#F8F8F8]" : ""}`}>
                  <td className="py-4 pl-7 pr-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-[#F0F0F0] shrink-0">
                        <img src={s.hostAvatar} alt={s.host} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[13px] font-normal text-[#1A1A1A] truncate">{s.host}</span>
                        <span className="text-[10px] text-[#CACACA] font-normal flex items-center gap-1">
                          <Globe size={9} /> {s.region}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-3 text-[13px] font-normal text-[#666]">{s.subject}</td>
                  <td className="py-4 px-3 text-[13px] font-mono font-normal text-[#ACACAC]">{s.duration}</td>
                  <td className="py-4 px-3"><StatusBadge status={s.status} /></td>
                  <td className="py-4 pr-7 pl-3">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        title="Join as Observer"
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-white border border-[#EBEBEB] rounded-lg text-[10px] font-medium text-[#666] hover:bg-[#FAFAFA] transition-all cursor-pointer"
                      >
                        <Eye size={11} /> Observe
                      </button>
                      <button
                        title="Force Terminate"
                        onClick={() => setTerminateId(s.id)}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-white border border-[#EBEBEB] rounded-lg text-[10px] font-medium text-[#999] hover:text-[#1A1A1A] hover:border-[#999] transition-all cursor-pointer"
                      >
                        <Prohibit size={11} /> Terminate
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!terminateId}
        onClose={() => setTerminateId(null)}
        title="Force Terminate Session"
        description={`This will immediately end session ${terminateId} and disconnect all participants. This action is logged and cannot be undone.`}
        confirmString="FORCE-TERMINATE"
        onConfirm={() => setTerminateId(null)}
        variant="danger"
      />
    </>
  );
}

export default memo(LiveClassroomRadar);
