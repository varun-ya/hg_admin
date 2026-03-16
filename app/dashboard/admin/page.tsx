"use client";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import {
  MetricsSkeleton,
  ChartSkeleton,
  TableSkeleton,
  QueueSkeleton,
} from "@/components/admin/AdminSkeletons";

const GlobalOpsPulse = dynamic(() => import("@/components/admin/GlobalOpsPulse"), {
  loading: () => <MetricsSkeleton />,
  ssr: false,
});

const AIMediaHealth = dynamic(() => import("@/components/admin/AIMediaHealth"), {
  loading: () => <ChartSkeleton className="h-[360px]" />,
  ssr: false,
});

const FinancialReconciliation = dynamic(() => import("@/components/admin/FinancialReconciliation"), {
  loading: () => <ChartSkeleton className="h-[360px]" />,
  ssr: false,
});

const LiveClassroomRadar = dynamic(() => import("@/components/admin/LiveClassroomRadar"), {
  loading: () => <TableSkeleton rows={5} className="h-[380px]" />,
  ssr: false,
});

const GovernanceQueue = dynamic(() => import("@/components/admin/GovernanceQueue"), {
  loading: () => <QueueSkeleton />,
  ssr: false,
});

const AuditTrail = dynamic(() => import("@/components/admin/AuditTrail"), {
  loading: () => <TableSkeleton rows={10} />,
  ssr: false,
});

export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-8 md:gap-10 pt-4">
      {/* Metrics */}
      <section>
        <Suspense fallback={<MetricsSkeleton />}>
          <GlobalOpsPulse />
        </Suspense>
      </section>

      {/* AI Health + Financial */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<ChartSkeleton className="h-[360px]" />}>
          <AIMediaHealth />
        </Suspense>
        <Suspense fallback={<ChartSkeleton className="h-[360px]" />}>
          <FinancialReconciliation />
        </Suspense>
      </section>

      {/* Live Radar + Queue */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Suspense fallback={<TableSkeleton rows={5} className="h-[380px]" />}>
            <LiveClassroomRadar />
          </Suspense>
        </div>
        <div className="lg:col-span-4">
          <Suspense fallback={<QueueSkeleton />}>
            <GovernanceQueue />
          </Suspense>
        </div>
      </section>

      {/* Audit Trail */}
      <section>
        <Suspense fallback={<TableSkeleton rows={10} />}>
          <AuditTrail />
        </Suspense>
      </section>
    </div>
  );
}
