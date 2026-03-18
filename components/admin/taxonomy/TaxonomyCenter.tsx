"use client";
import { memo } from "react";
import { TreeStructure, Star, TrendUp, CaretRight } from "@phosphor-icons/react";
import { subjectTree, featuredTutors } from "./taxonomyMockData";

function TaxonomyCenter() {
  return (
    <div className="flex flex-col gap-6">
      {/* Subject Tree */}
      <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
        <div className="flex items-center justify-between px-7 py-5">
          <div className="flex items-center gap-2.5">
            <TreeStructure size={17} weight="regular" className="text-[#999]" />
            <h3 className="text-[15px] font-medium text-[#1A1A1A]">Subject Taxonomy</h3>
          </div>
          <button className="px-4 py-2 bg-[#1A1A1A] text-white rounded-full text-[12px] font-medium hover:bg-[#333] transition-all cursor-pointer border-none">
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
              {subjectTree.map((s, i) => (
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
          <button className="px-3 py-1.5 bg-white border border-[#EBEBEB] rounded-lg text-[11px] font-medium text-[#666] hover:bg-[#FAFAFA] cursor-pointer">
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
                      <Star size={10} weight="fill" className="text-[#F59E0B]" /> {t.rating}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-[12px] text-[#666] tabular-nums">{t.totalSessions.toLocaleString()}</td>
                  <td className="py-4 px-4">
                    <span className={`text-[10px] font-medium px-2 py-[2px] rounded-full ${t.slot === "auto" ? "bg-[#EEF2FF] text-[#4F46E5]" : "bg-[#F0F0F0] text-[#1A1A1A]"}`}>
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
    </div>
  );
}

export default memo(TaxonomyCenter);
