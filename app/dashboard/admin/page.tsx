"use client";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import {
  MetricsSkeleton,
  ChartSkeleton,
  TableSkeleton,
  QueueSkeleton,
} from "@/components/admin/AdminSkeletons";

const PlatformHealthBanner = dynamic(() => import("@/components/admin/PlatformHealthBanner"), {
  loading: () => <div className="h-[100px] rounded-2xl bg-[#F0F0F0] shimmer" />,
  ssr: false,
});

const GlobalOpsPulse = dynamic(() => import("@/components/admin/GlobalOpsPulse"), {
  loading: () => <MetricsSkeleton />,
  ssr: false,
});

const UserGrowthChart = dynamic(() => import("@/components/admin/UserGrowthChart"), {
  loading: () => <ChartSkeleton className="h-[380px]" />,
  ssr: false,
});

const SessionDistribution = dynamic(() => import("@/components/admin/SessionDistribution"), {
  loading: () => <ChartSkeleton className="h-[380px]" />,
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

const RevenueHeatmap = dynamic(() => import("@/components/admin/RevenueHeatmap"), {
  loading: () => <ChartSkeleton className="h-[240px]" />,
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

const ActivityFeed = dynamic(() => import("@/components/admin/ActivityFeed"), {
  loading: () => <QueueSkeleton />,
  ssr: false,
});

const SystemHealthGrid = dynamic(() => import("@/components/admin/SystemHealthGrid"), {
  loading: () => <div className="h-[160px] rounded-2xl bg-[#F0F0F0] shimmer" />,
  ssr: false,
});

const AuditTrail = dynamic(() => import("@/components/admin/AuditTrail"), {
  loading: () => <TableSkeleton rows={10} />,
  ssr: false,
});

export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-8 md:gap-10 pt-4">
      {/* 1. Platform Health Banner */}
      <section>
        <Suspense fallback={<div className="h-[100px] rounded-2xl bg-[#F0F0F0] shimmer" />}>
          <PlatformHealthBanner />
        </Suspense>
      </section>

      {/* 2. KPI Metrics */}
      <section>
        <Suspense fallback={<MetricsSkeleton />}>
          <GlobalOpsPulse />
        </Suspense>
      </section>

      {/* 3. User Growth + Session Distribution */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Suspense fallback={<ChartSkeleton className="h-[380px]" />}>
            <UserGrowthChart />
          </Suspense>
        </div>
        <div className="lg:col-span-4">
          <Suspense fallback={<ChartSkeleton className="h-[380px]" />}>
            <SessionDistribution />
          </Suspense>
        </div>
      </section>

      {/* 4. AI Health + Financial */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<ChartSkeleton className="h-[360px]" />}>
          <AIMediaHealth />
        </Suspense>
        <Suspense fallback={<ChartSkeleton className="h-[360px]" />}>
          <FinancialReconciliation />
        </Suspense>
      </section>

      {/* 5. Revenue Heatmap */}
      <section>
        <Suspense fallback={<ChartSkeleton className="h-[240px]" />}>
          <RevenueHeatmap />
        </Suspense>
      </section>

      {/* 6. Live Radar + Queue + Activity Feed */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <Suspense fallback={<TableSkeleton rows={5} className="h-[420px]" />}>
            <LiveClassroomRadar />
          </Suspense>
        </div>
        <div className="lg:col-span-4">
          <Suspense fallback={<QueueSkeleton />}>
            <GovernanceQueue />
          </Suspense>
        </div>
        <div className="lg:col-span-3">
          <Suspense fallback={<QueueSkeleton />}>
            <ActivityFeed />
          </Suspense>
        </div>
      </section>

      {/* 7. System Health Grid */}
      <section>
        <Suspense fallback={<div className="h-[160px] rounded-2xl bg-[#F0F0F0] shimmer" />}>
          <SystemHealthGrid />
        </Suspense>
      </section>

      {/* 8. Audit Trail */}
      <section>
        <Suspense fallback={<TableSkeleton rows={10} />}>
          <AuditTrail />
        </Suspense>
      </section>
    </div>
  );
}
