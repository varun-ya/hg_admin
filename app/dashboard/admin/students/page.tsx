"use client";
import { useState } from "react";
import StudentKPIRibbon from "@/components/admin/students/StudentKPIRibbon";
import StudentTable from "@/components/admin/students/StudentTable";
import StudentDrawer from "@/components/admin/students/StudentDrawer";
import type { Student } from "@/components/admin/students/studentTypes";

export default function StudentsPage() {
  const [selected, setSelected] = useState<Student | null>(null);

  return (
    <>
      <div className="flex flex-col gap-8 md:gap-10 pt-4">
        <section>
          <StudentKPIRibbon />
        </section>
        <section>
          <StudentTable onSelectStudent={setSelected} />
        </section>
      </div>
      <StudentDrawer student={selected} onClose={() => setSelected(null)} />
    </>
  );
}
