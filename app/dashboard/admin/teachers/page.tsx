"use client";
import { useState } from "react";
import TeacherKPIRibbon from "@/components/admin/teachers/TeacherKPIRibbon";
import TeacherTable from "@/components/admin/teachers/TeacherTable";
import TeacherDrawer from "@/components/admin/teachers/TeacherDrawer";
import type { Teacher } from "@/components/admin/teachers/teacherTypes";

export default function TeachersPage() {
  const [selected, setSelected] = useState<Teacher | null>(null);

  return (
    <>
      <div className="flex flex-col gap-8 md:gap-10 pt-4">
        <section>
          <TeacherKPIRibbon />
        </section>
        <section>
          <TeacherTable onSelectTeacher={setSelected} />
        </section>
      </div>
      <TeacherDrawer teacher={selected} onClose={() => setSelected(null)} />
    </>
  );
}
