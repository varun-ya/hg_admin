"use client";
import { useState, memo } from "react";
import { TreeStructure, Star, TrendUp, CaretRight, X, CheckCircle } from "@phosphor-icons/react";
import { subjectTree, featuredTutors } from "./taxonomyMockData";

function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-[300] flex items-center gap-3 bg-[#1A1A1A] text-white px-4 py-3 rounded-xl shadow-lg animate-fadeIn">
      <CheckCircle size={14} weight="fill" className="text-[#E08A3C] shrink-0" />
      <span className="text-[13px]">{msg}</span>
      <button onClick={onClose} className="ml-2 text-white/50 hover:text-white bg-transparent border-none cursor-pointer"><X size={12} weight="bold" /></button>
    </div>
  );
}

function AddSubjectModal({ onClose, onSave }: { onClose: () => void; onSave: (name: string) => void }) {
  const [name, setName] = useState("");
  const [parent, setParent] = useState("None (Top Level)");
  const parents = ["None (Top Level)", ...subjectTree.filter((s) => s.level === 0).map((s) => s.name)];
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/15 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-[420px] max-w-[95vw] border border-[#F0F0F0] overflow-hidden">
        <div className="px-7 py-5 flex items-center justify-between border-b border-[#F5F5F5]">
          <h3 className="text-[15px] font-medium text-[#1A1A1A]">Add Subject</h3>
          <button onClick={onClose} className="text-[#CACACA] hover:text-[#999] bg-transparent border-none cursor-pointer"><X size={16} weight="bold" /></button>
        </div>
        <div className="px-7 py-5 space-y-4">
          <div>
            <label className="text-[11px] font-medium text-[#999] uppercase tracking-wider block mb-1.5">Subject Name *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Organic Chemistry" className="w-full h-[38px] px-3 border border-[#EBEBEB] rounded-lg text-[13px] focus:outline-none focus:border-[#1A1A1A] transition-all" />
          </div>
          <div>
            <label className="text-[11px] font-medium text-[#999] uppercase tracking-wider block mb-1.5">Parent Category</label>
            <select value={parent} onChange={(e) => setParent(e.target.value)} className="w-full h-[38px] px-3 border border-[#EBEBEB] rounded-lg text-[13px] bg-white focus:outline-none focus:border-[#1A1A1A] transition-all">
              {parents.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div className="px-7 pb-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-[13px] text-[#777] bg-white border border-[#EBEBEB] rounded-lg hover:bg-[#FAFAFA] cursor-pointer">Cancel</button>
          <button disabled={!name} onClick={() => { onSave(name); onClose(); }} className={`px-4 py-2 text-[13px] font-medium rounded-lg border-none cursor-pointer transition-all ${name ? "bg-[#1A1A1A] text-white hover:bg-[#333]" : "bg-[#F0F0F0] text-[#CACACA] cursor-not-allowed"}`}>Add Subject</button>
        </div>
      </div>
    </div>
  );
}

function AssignSlotModal({ onClose, onSave }: { onClose: () => void; onSave: (name: string) => void }) {
  const [tutorName, setTutorName] = useState("");
  const [subject, setSubject] = useState("");
  const [slotType, setSlotType] = useState("manual");
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/15 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-[420px] max-w-[95vw] border border-[#F0F0F0] overflow-hidden">
        <div className="px-7 py-5 flex items-center justify-between border-b border-[#F5F5F5]">
          <h3 className="text-[15px] font-medium text-[#1A1A1A]">Assign Featured Slot</h3>
          <button onClick={onClose} className="text-[#CACACA] hover:text-[#999] bg-transparent border-none cursor-pointer"><X size={16} weight="bold" /></button>
        </div>
        <div className="px-7 py-5 space-y-4">
          <div>
            <label className="text-[11px] font-medium text-[#999] uppercase tracking-wider block mb-1.5">Tutor Name / Aegis ID *</label>
            <input value={tutorName} onChange={(e) => setTutorName(e.target.value)} placeholder="e.g. Priya Sharma or TCH-1234" className="w-full h-[38px] px-3 border border-[#EBEBEB] rounded-lg text-[13px] focus:outline-none focus:border-[#1A1A1A] transition-all" />
          </div>
          <div>
            <label className="text-[11px] font-medium text-[#999] uppercase tracking-wider block mb-1.5">Subject</label>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. IELTS Speaking" className="w-full h-[38px] px-3 border border-[#EBEBEB] rounded-lg text-[13px] focus:outline-none focus:border-[#1A1A1A] transition-all" />
          </div>
          <div>
            <label className="text-[11px] font-medium text-[#999] uppercase tracking-wider block mb-1.5">Slot Type</label>
            <div className="flex items-center gap-2">
              {["manual", "auto"].map((t) => (
                <button key={t} onClick={() => setSlotType(t)} className={`px-4 py-1.5 rounded-lg text-[12px] font-medium border cursor-pointer transition-all ${slotType === t ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" : "bg-white text-[#666] border-[#EBEBEB] hover:border-[#DCDCDC]"}`}>{t}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="px-7 pb-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-[13px] text-[#777] bg-white border border-[#EBEBEB] rounded-lg hover:bg-[#FAFAFA] cursor-pointer">Cancel</button>
          <button disabled={!tutorName} onClick={() => { onSave(tutorName); onClose(); }} className={`px-4 py-2 text-[13px] font-medium rounded-lg border-none cursor-pointer transition-all ${tutorName ? "bg-[#1A1A1A] text-white hover:bg-[#333]" : "bg-[#F0F0F0] text-[#CACACA] cursor-not-allowed"}`}>Assign Slot</button>
        </div>
      </div>
    </div>
  );
}

function TaxonomyCenter() {
  const [subjects, setSubjects] = useState(subjectTree);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [showAssignSlot, setShowAssignSlot] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  return (
    <div className="flex flex-col gap-6">
      {/* Subject Tree */}
      <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
        <div className="flex items-center justify-between px-7 py-5">
          <div className="flex items-center gap-2.5">
            <TreeStructure size={17} weight="regular" className="text-[#999]" />
            <h3 className="text-[15px] font-medium text-[#1A1A1A]">Subject Taxonomy</h3>
          </div>
          <button onClick={() => setShowAddSubject(true)} className="px-4 py-2 bg-[#1A1A1A] text-white rounded-full text-[12px] font-medium hover:bg-[#333] transition-all cursor-pointer border-none">
            + Add Subject
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-t border-[#F5F5F5]">
                {["Subject", "Tutors", "Bookings (30d)", "Status", ""].map((h) => (
                  <th key={h} className="py-3 px-4 first:pl-7 last:pr-7 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subjects.map((s, i) => (
                <tr key={s.id} className={`hover:bg-[#FAFAFA] transition-colors cursor-pointer ${i > 0 ? "border-t border-[#F8F8F8]" : ""}`}>
                  <td className="py-3.5 px-4 pl-7">
                    <span className="text-[13px] text-[#1A1A1A]" style={{ paddingLeft: s.level * 20 }}>
                      {s.level > 0 && <span className="text-[#DCDCDC] mr-2">{s.level === 1 ? "├" : "└"}</span>}
                      {s.name}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[12px] text-[#666] tabular-nums">{s.tutorCount.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-[12px] text-[#666] tabular-nums">{s.bookings30d.toLocaleString()}</td>
                  <td className="py-3.5 px-4">
                    {s.trending && (
                      <span className="flex items-center gap-1 text-[10px] font-medium text-[#E08A3C] bg-[#FFF8F3] px-2 py-[2px] rounded-full w-fit">
                        <TrendUp size={10} weight="bold" /> Trending
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 pr-7"><CaretRight size={12} className="text-[#DCDCDC]" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Featured Tutors */}
      <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
        <div className="flex items-center justify-between px-7 py-5">
          <div className="flex items-center gap-2.5">
            <Star size={15} weight="regular" className="text-[#E08A3C]" />
            <h3 className="text-[15px] font-medium text-[#1A1A1A]">Featured Tutor Slots</h3>
          </div>
          <button onClick={() => setShowAssignSlot(true)} className="px-3 py-1.5 bg-white border border-[#EBEBEB] rounded-lg text-[11px] font-medium text-[#666] hover:bg-[#FAFAFA] cursor-pointer">
            + Assign Slot
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-t border-[#F5F5F5]">
                {["Tutor", "Subject", "Rating", "Sessions", "Slot Type", "Reason", "Since"].map((h) => (
                  <th key={h} className="py-3 px-4 first:pl-7 last:pr-7 text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {featuredTutors.map((t, i) => (
                <tr key={t.id} className={`hover:bg-[#FAFAFA] transition-colors cursor-pointer ${i > 0 ? "border-t border-[#F8F8F8]" : ""}`}>
                  <td className="py-4 px-4 pl-7">
                    <div className="flex items-center gap-3">
                      <img src={t.avatar} alt={t.name} className="w-8 h-8 rounded-full border border-[#F0F0F0]" />
                      <span className="text-[13px] text-[#1A1A1A]">{t.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-[12px] text-[#666]">{t.subject}</td>
                  <td className="py-4 px-4">
                    <span className="flex items-center gap-1 text-[12px] text-[#1A1A1A]">
                      <Star size={10} weight="fill" className="text-[#D4956A]" /> {t.rating}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-[12px] text-[#666] tabular-nums">{t.totalSessions.toLocaleString()}</td>
                  <td className="py-4 px-4">
                    <span className={`text-[10px] font-medium px-2 py-[2px] rounded-full ${t.slot === "auto" ? "bg-[#FFF7ED] text-[#E08A3C]" : "bg-[#F0F0F0] text-[#1A1A1A]"}`}>
                      {t.slot}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-[11px] text-[#999] max-w-[200px] truncate">{t.reason}</td>
                  <td className="py-4 px-4 pr-7 text-[12px] text-[#ACACAC]">{t.featuredSince}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddSubject && (
        <AddSubjectModal
          onClose={() => setShowAddSubject(false)}
          onSave={(name) => {
            setSubjects((prev) => [...prev, { id: `sub-${Date.now()}`, name, level: 0, parentId: null, tutorCount: 0, bookings30d: 0, trending: false }]);
            showToast(`Subject "${name}" added to taxonomy`);
          }}
        />
      )}
      {showAssignSlot && (
        <AssignSlotModal
          onClose={() => setShowAssignSlot(false)}
          onSave={(name) => showToast(`Featured slot assigned to ${name}`)}
        />
      )}
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

export default memo(TaxonomyCenter);
