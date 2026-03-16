"use client";
import { useState } from "react";
import KycKPIRibbon from "@/components/admin/kyc/KycKPIRibbon";
import KycTriageQueue from "@/components/admin/kyc/KycTriageQueue";
import KycWorkspace from "@/components/admin/kyc/KycWorkspace";
import type { KycApplicant } from "@/components/admin/kyc/kycTypes";

export default function KycPipelinePage() {
  const [reviewing, setReviewing] = useState<KycApplicant | null>(null);

  return (
    <>
      <div className="flex flex-col gap-8 md:gap-10 pt-4">
        <section>
          <KycKPIRibbon />
        </section>
        <section>
          <KycTriageQueue onBeginReview={setReviewing} />
        </section>
      </div>
      <KycWorkspace applicant={reviewing} onClose={() => setReviewing(null)} />
    </>
  );
}
