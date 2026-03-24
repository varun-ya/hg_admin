"use client";
import { useState } from "react";
import StudentKPIRibbon from "@/components/admin/students/StudentKPIRibbon";
import StudentTable from "@/components/admin/students/StudentTable";
import StudentDrawer from "@/components/admin/students/StudentDrawer";
import type { Student } from "@/components/admin/students/studentTypes";

export default function StudentsPage() {
  const [selected, setSelected] = useState<Student | null>(null);

  return (
    <div className="flex flex-col gap-8 md:gap-10 pt-4 h-full">
      <section>
        <StudentKPIRibbon />
      </section>

      {/* Split layout */}
      <div className="flex gap-6 items-start min-h-0 flex-1">

        {/* Left — table, shrinks when panel is open */}
        <div className={`flex-1 min-w-0 transition-all duration-300 ${selected ? "lg:max-w-[calc(100%-480px)]" : ""}`}>
          <StudentTable onSelectStudent={setSelected} selectedId={selected?.id ?? null} />
        </div>

        {/* Right — inline profile panel */}
        {selected && (
          <div className="hidden lg:block w-[460px] shrink-0 sticky top-6">
            <StudentDrawer student={selected} onClose={() => setSelected(null)} inline />
          </div>
        )}
      </div>

      {/* Mobile / small screen: still use overlay drawer */}
      <div className="lg:hidden">
        <StudentDrawer student={selected} onClose={() => setSelected(null)} />
      </div>
    </div>
  );
}
